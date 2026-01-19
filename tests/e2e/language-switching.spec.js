import { test, expect } from '@playwright/test';

// Helper function to switch language based on viewport
async function switchLanguage(page, lang) {
  const viewport = page.viewportSize();
  const isMobile = viewport.width < 768;

  if (isMobile) {
    // On mobile, use mobile nav language buttons
    const mobileMenuOpen = await page.locator('.mobile-nav').evaluate(el => el.classList.contains('active'));
    if (!mobileMenuOpen) {
      await page.locator('.mobile-menu-btn').click();
      await page.waitForTimeout(300);
    }
    const langButton = page.locator(`.mobile-nav .lang-text-btn[data-lang="${lang}"]`);
    await langButton.waitFor({ state: 'visible', timeout: 5000 });
    await langButton.click();
  } else {
    // On desktop, use header language buttons
    const langButton = page.locator(`.header-actions .lang-text-btn[data-lang="${lang}"]`);
    await langButton.waitFor({ state: 'visible', timeout: 5000 });
    await langButton.click();
  }
}

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear storage before each test
    await context.clearCookies();
    await page.goto('/');
  });

  test('should switch language from NL to EN', async ({ page }) => {
    // Verify initial language is NL (default)
    const heroTitle = page.locator('[data-i18n="hero.line1"]');
    await expect(heroTitle).toContainText('Applied AI');

    // Switch to English
    await switchLanguage(page, 'en');

    // Verify language changed
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
    await expect(page.locator('[data-i18n="nav.contact"]').first()).toHaveText('Contact', { timeout: 10000 });

    // Verify EN button is active
    const enButton = page.locator('.lang-text-btn[data-lang="en"]').first();
    await expect(enButton).toHaveClass(/active/);
  });

  test('should persist language after accepting cookies', async ({ page }) => {
    // Accept cookies first
    await page.locator('#cookie-accept').click();

    // Wait for banner to hide
    await expect(page.locator('#cookie-banner')).toHaveClass(/hidden/);

    // Switch to English
    await switchLanguage(page, 'en');

    // Wait for language change
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Language should persist (EN button should be active)
    const enButton = page.locator('.lang-text-btn[data-lang="en"]').first();
    await expect(enButton).toHaveClass(/active/);

    // UI should still be in English
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
  });

  test('should not persist language after declining cookies', async ({ page }) => {
    // Decline cookies
    await page.locator('#cookie-decline').click();

    // Switch to English
    await switchLanguage(page, 'en');

    // Wait for language change
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Language should reset to default (NL)
    const nlButton = page.locator('.lang-text-btn[data-lang="nl"]').first();
    await expect(nlButton).toHaveClass(/active/);

    // UI should be back in Dutch
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Diensten', { timeout: 10000 });
  });

  test('should toggle between NL and EN multiple times', async ({ page }) => {
    // Switch to English
    await switchLanguage(page, 'en');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Switch back to Dutch
    await switchLanguage(page, 'nl');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Diensten', { timeout: 10000 });

    // Switch to English again
    await switchLanguage(page, 'en');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
  });
});
