<?php
/**
 * Contact form handler — DevRev API
 *
 * Flow
 * ────
 * 1. Validate submitted form fields.
 * 2. Look up the submitter in DevRev as a rev-user (by e-mail).
 * 3. Create a DevRev ticket, linking the rev-user when found.
 *
 * Setup
 * ─────
 * 1. Generate a DevRev PAT (Personal Access Token) or service-account token
 *    in your DevRev org: Settings → Security → Access tokens
 * 2. Find your part ID: open the part in DevRev and copy its DON from the URL
 *    (e.g. don:core:dvrv-eu-1:devo/xxxx:product/2)
 * 3. On OVHCloud: create .env ONE level above your www/ webroot (never inside):
 *
 *       /home/your-account/.env          ← not publicly accessible
 *       /home/your-account/www/          ← webroot
 *
 *    .env contents:
 *       DEVREV_API_KEY=your_token_here
 *       DEVREV_PART_ID=don:core:dvrv-eu-1:devo/xxxx:product/2
 */

// ── Logging ────────────────────────────────────────────────────────────────
function log_msg(string $msg): void
{
    error_log('[' . date('Y-m-d H:i:s') . '] ' . $msg);
}

// ── Load config from .env ──────────────────────────────────────────────────
$env_file = __DIR__ . '/../../.env';    // preferred: outside webroot on OVHCloud
if (!file_exists($env_file)) {
    $env_file = __DIR__ . '/.env';      // fallback: next to this file (local dev)
}

if (!file_exists($env_file)) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Server configuration error.']));
}

// parse_ini_file() chokes on parentheses/special chars in comments, so parse manually
$env = [];
foreach (file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#') continue;
    $pos = strpos($line, '=');
    if ($pos === false) continue;
    $env[trim(substr($line, 0, $pos))] = trim(substr($line, $pos + 1));
}
$api_key = $env['DEVREV_API_KEY'] ?? '';
$part_id = $env['DEVREV_PART_ID'] ?? '';

if (empty($api_key) || empty($part_id)) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Server configuration error.']));
}

// ── Security headers ───────────────────────────────────────────────────────
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

// ── Detect AJAX ────────────────────────────────────────────────────────────
$is_ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

function respond(bool $ok, string $msg, bool $ajax): void
{
    if ($ajax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => $ok, 'message' => $msg]);
    } else {
        header('Location: contact.html?status=' . ($ok ? 'success' : 'error'));
    }
    exit;
}

// ── POST only ──────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.', $is_ajax);
}

// ── Honeypot ───────────────────────────────────────────────────────────────
if (!empty($_POST['website'])) {
    respond(true, 'Message sent.', $is_ajax); // silent discard for bots
}

// ── Sanitise inputs ────────────────────────────────────────────────────────
$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));
$privacy = !empty($_POST['privacy']);

// ── Validate ───────────────────────────────────────────────────────────────
$errors = [];

if ($name === '' || strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Ongeldige naam.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Ongeldig e-mailadres.';
}
if ($message === '' || strlen($message) < 10 || strlen($message) > 5000) {
    $errors[] = 'Bericht moet tussen 10 en 5000 tekens bevatten.';
}
if (!$privacy) {
    $errors[] = 'Privacybeleid niet geaccepteerd.';
}

if (!empty($errors)) {
    respond(false, implode(' ', $errors), $is_ajax);
}

// ── Helper: DevRev API request ─────────────────────────────────────────────
function devrev_request(string $method, string $url, array $payload, string $api_key): array
{
    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . $api_key,
        ],
    ]);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    }

    $body       = curl_exec($ch);
    $status     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    return [
        'status'     => $status,
        'body'       => $body ? json_decode($body, true) : null,
        'curl_error' => $curl_error,
    ];
}

// ── Step 1: Look up rev-user by e-mail ─────────────────────────────────────
// If found, we link them as the ticket reporter.
// If not found, the ticket is still created — just without a reported_by.
$rev_user_id = null;

$lookup = devrev_request(
    'GET',
    'https://api.devrev.ai/rev-users.list?email=' . urlencode($email),
    [],
    $api_key
);

if ($lookup['curl_error']) {
    log_msg('[sendmail] rev-users.list cURL error: ' . $lookup['curl_error']);
} elseif ($lookup['status'] === 200) {
    $rev_users   = $lookup['body']['rev_users'] ?? [];
    $rev_user_id = !empty($rev_users) ? ($rev_users[0]['id'] ?? null) : null;
} else {
    log_msg('[sendmail] rev-users.list unexpected HTTP ' . $lookup['status'] . ': ' . json_encode($lookup['body']));
}

// ── Step 2: Create DevRev ticket ───────────────────────────────────────────
$payload = [
    'type'            => 'ticket',
    'title'           => 'Contact form submission from ' . $name,
    'body'            => $email . "\n\n" . $name . " wrote:\n\n" . $message,
    'applies_to_part' => $part_id,
];

if ($rev_user_id !== null) {
    $payload['reported_by'] = [$rev_user_id];
}

$ticket = devrev_request(
    'POST',
    'https://api.devrev.ai/works.create',
    $payload,
    $api_key
);

// DevRev returns 200 or 201 on success
$ticket_ok = !$ticket['curl_error']
    && $ticket['status'] >= 200
    && $ticket['status'] < 300;

if ($ticket_ok) {
    respond(true, 'Uw bericht is succesvol verzonden.', $is_ajax);
} else {
    log_msg('[sendmail] works.create failed — HTTP ' . $ticket['status'] . ': ' . json_encode($ticket['body']) . ' | cURL: ' . $ticket['curl_error']);
    respond(false, 'Verzenden mislukt. Probeer het opnieuw of mail ons rechtstreeks.', $is_ajax);
}
