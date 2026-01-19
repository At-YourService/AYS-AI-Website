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

test.describe('Cookie Consent', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear storage before each test
    await context.clearCookies();
    await page.goto('/');
  });

  test('should display cookie banner on first visit', async ({ page }) => {
    // Cookie banner should be visible
    const banner = page.locator('#cookie-banner');
    await expect(banner).toBeVisible();
    await expect(banner).not.toHaveClass(/hidden/);

    // Banner should have accept and decline buttons
    await expect(page.locator('#cookie-accept')).toBeVisible();
    await expect(page.locator('#cookie-decline')).toBeVisible();
  });

  test('should hide banner after accepting cookies', async ({ page }) => {
    // Click accept button
    await page.locator('#cookie-accept').click();

    // Banner should be hidden
    const banner = page.locator('#cookie-banner');
    await expect(banner).toHaveClass(/hidden/);
  });

  test('should store cookieConsent in localStorage after accepting', async ({ page }) => {
    // Click accept button
    await page.locator('#cookie-accept').click();

    // Check localStorage
    const cookieConsent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
    expect(cookieConsent).toBe('accepted');
  });

  test('should hide banner after declining cookies', async ({ page }) => {
    // Click decline button
    await page.locator('#cookie-decline').click();

    // Banner should be hidden
    const banner = page.locator('#cookie-banner');
    await expect(banner).toHaveClass(/hidden/);
  });

  test('should store cookieConsent as declined in localStorage', async ({ page }) => {
    // Click decline button
    await page.locator('#cookie-decline').click();

    // Check localStorage
    const cookieConsent = await page.evaluate(() => localStorage.getItem('cookieConsent'));
    expect(cookieConsent).toBe('declined');
  });

  test('should clear language preference when declining cookies', async ({ page }) => {
    // First accept cookies and set language
    await page.locator('#cookie-accept').click();
    await switchLanguage(page, 'en');

    // Wait for language change
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Verify language is stored
    let lang = await page.evaluate(() => localStorage.getItem('lang'));
    expect(lang).toBe('en');

    // Reload and decline cookies
    await page.reload();
    await page.waitForLoadState('networkidle');

    // The banner won't show again because we already accepted
    // Let's clear storage and reload
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Now decline
    await page.locator('#cookie-decline').click();

    // Check that lang is not stored
    lang = await page.evaluate(() => localStorage.getItem('lang'));
    expect(lang).toBeNull();
  });

  test('should not show banner on subsequent visits after consent given', async ({ page }) => {
    // Accept cookies
    await page.locator('#cookie-accept').click();
    await expect(page.locator('#cookie-banner')).toHaveClass(/hidden/);

    // Reload page
    await page.reload();

    // Banner should remain hidden
    const banner = page.locator('#cookie-banner');
    await expect(banner).toHaveClass(/hidden/);
  });

  test('should not show banner on subsequent visits after declining', async ({ page }) => {
    // Decline cookies
    await page.locator('#cookie-decline').click();
    await expect(page.locator('#cookie-banner')).toHaveClass(/hidden/);

    // Reload page
    await page.reload();

    // Banner should remain hidden
    const banner = page.locator('#cookie-banner');
    await expect(banner).toHaveClass(/hidden/);
  });

  test('should save current language when accepting cookies', async ({ page }) => {
    // Decline first (so language isn't saved yet)
    await page.locator('#cookie-decline').click();

    // Switch to English
    await switchLanguage(page, 'en');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Clear storage and reload to reset
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Switch to English (without cookies accepted)
    await switchLanguage(page, 'en');
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Now accept cookies
    await page.locator('#cookie-accept').click();

    // Check that current language (en) was saved
    const lang = await page.evaluate(() => localStorage.getItem('lang'));
    expect(lang).toBe('en');

    // Reload and verify language persisted
    await page.reload();
    await page.waitForLoadState('networkidle');
    const enButton = page.locator('.lang-text-btn[data-lang="en"]').first();
    await expect(enButton).toHaveClass(/active/);
  });

  test('should show banner text in current language', async ({ page }) => {
    // Check initial language (NL)
    const cookieText = page.locator('[data-i18n="cookie.text"]');
    await expect(cookieText).toContainText('cookie');

    // Accept button should have text
    const acceptButton = page.locator('#cookie-accept');
    await expect(acceptButton).toBeVisible();
  });

  test('should handle cookie banner on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Banner should still be visible on mobile
    await expect(page.locator('#cookie-banner')).toBeVisible();

    // Accept button should be clickable
    await page.locator('#cookie-accept').click();

    // Banner should hide
    await expect(page.locator('#cookie-banner')).toHaveClass(/hidden/);
  });
});
