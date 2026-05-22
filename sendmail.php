<?php
/**
 * Contact form mail handler — MailerSend API
 *
 * Setup
 * ─────
 * 1. Create a free account at https://www.mailersend.com
 * 2. Verify your sending domain (at-yourservice.ai) by adding the DNS records
 *    MailerSend provides (SPF, DKIM) — takes ~10 minutes in OVHCloud DNS manager
 * 3. Generate an API token: MailerSend dashboard → API Tokens → Generate
 * 4. On OVHCloud: create a file named .env ONE level above your www/ webroot:
 *
 *       /home/your-account/.env          ← not publicly accessible
 *       /home/your-account/www/          ← webroot
 *
 *    .env contents:
 *       MAILERSEND_API_KEY=mlsn.xxxxxxxxxxxxxxxx
 *
 * 5. Copy .env.example to .env and fill in your key (never commit .env itself)
 */

// ── Load API key from .env outside the webroot ─────────────────────────────
$env_file = __DIR__ . '/../../.env'; // one level above www/ on OVHCloud

if (!file_exists($env_file)) {
    // Fallback: .env next to this file (useful during local development)
    $env_file = __DIR__ . '/.env';
}

if (!file_exists($env_file)) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Server configuration error.']));
}

$env     = parse_ini_file($env_file);
$api_key = $env['MAILERSEND_API_KEY'] ?? '';

if (empty($api_key)) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Server configuration error.']));
}

// ── Configuration ──────────────────────────────────────────────────────────
$recipient_email = 'info@at-yourservice.ai';
$recipient_name  = 'at your service';
$from_email      = 'noreply@at-yourservice.ai'; // must be on your verified MailerSend domain
$from_name       = 'at your service website';

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
    respond(true, 'Message sent.', $is_ajax); // silent discard
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

// ── Build MailerSend payload ───────────────────────────────────────────────
$payload = [
    'from' => [
        'email' => $from_email,
        'name'  => $from_name,
    ],
    'to' => [
        [
            'email' => $recipient_email,
            'name'  => $recipient_name,
        ],
    ],
    'reply_to' => [
        'email' => $email,
        'name'  => $name,
    ],
    'subject' => 'Nieuw contactformulier: ' . $name,
    'text'    => "Naam:   " . $name    . "\n"
               . "E-mail: " . $email   . "\n\n"
               . "Bericht:\n" . $message . "\n",
];

// ── Call MailerSend API via cURL ───────────────────────────────────────────
$ch = curl_init('https://api.mailersend.com/v1/email');

curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Accept: application/json',
        'X-Requested-With: XMLHttpRequest',
        'Authorization: Bearer ' . $api_key,
    ],
]);

$response    = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error  = curl_error($ch);
curl_close($ch);

// MailerSend returns 202 Accepted on success
if (!$curl_error && $http_status === 202) {
    respond(true, 'Uw bericht is succesvol verzonden.', $is_ajax);
} else {
    // Uncomment the line below temporarily to debug in OVHCloud error logs:
    // error_log('MailerSend error — HTTP ' . $http_status . ': ' . $response . ' | cURL: ' . $curl_error);
    respond(false, 'Verzenden mislukt. Probeer het opnieuw of mail ons rechtstreeks.', $is_ajax);
}
