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

  test('should switch language from NL to EN on desktop', async ({ page }) => {
    // Verify initial language is NL (default)
    const heroTitle = page.locator('[data-i18n="hero.line1"]');
    await expect(heroTitle).toContainText('Applied AI');

    // Click EN button
    const enButton = page.locator('.lang-text-btn[data-lang="en"]').first();
    await enButton.click();

    // Verify EN button has active class
    await expect(enButton).toHaveClass(/active/);

    // Verify NL button doesn't have active class
    const nlButton = page.locator('.lang-text-btn[data-lang="nl"]').first();
    await expect(nlButton).not.toHaveClass(/active/);
  });

  test('should update UI text when switching to English', async ({ page }) => {
    // Click EN button
    await switchLanguage(page, 'en');

    // Wait for language change to complete by checking for English text
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
    await expect(page.locator('[data-i18n="nav.method"]').first()).toHaveText('Method', { timeout: 10000 });
    await expect(page.locator('[data-i18n="hero.cta.start"]')).toHaveText('Start your project', { timeout: 10000 });
  });

  test('should switch language in mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    await page.locator('.mobile-menu-btn').click();

    // Wait for mobile nav to be visible
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Click EN button in mobile nav
    const enButton = page.locator('.mobile-nav .lang-text-btn[data-lang="en"]');
    await enButton.click();

    // Wait for language change to complete
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
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

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify language persisted (EN button should be active)
    const enButton = page.locator('.lang-text-btn[data-lang="en"]').first();
    await expect(enButton).toHaveClass(/active/);

    // Verify content is still in English
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
  });

  test('should not persist language after declining cookies', async ({ page }) => {
    // Decline cookies first
    await page.locator('#cookie-decline').click();

    // Wait for banner to hide
    await expect(page.locator('#cookie-banner')).toHaveClass(/hidden/);

    // Switch to English
    await switchLanguage(page, 'en');

    // Wait for language change
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Reload page
    await page.reload();

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify language did NOT persist (should be back to NL)
    // The content should be in Dutch
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Diensten', { timeout: 10000 });
  });

  test('should maintain language selection during same session', async ({ page }) => {
    // Decline cookies (no persistence)
    await page.locator('#cookie-decline').click();

    // Switch to English
    await switchLanguage(page, 'en');

    // Wait for language change
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Navigate to different section
    await page.locator('a[href="#services"]').first().click();
    await page.waitForTimeout(1000);

    // Language should still be English (in-memory state)
    const enButton = page.locator('.lang-text-btn[data-lang="en"]').first();
    await expect(enButton).toHaveClass(/active/);
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
  });

  test('should toggle between NL and EN multiple times', async ({ page }) => {
    // Accept cookies
    await page.locator('#cookie-accept').click();

    // Switch to EN
    await switchLanguage(page, 'en');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Switch back to NL
    await switchLanguage(page, 'nl');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Diensten', { timeout: 10000 });

    // Switch to EN again
    await switchLanguage(page, 'en');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });
  });
});
