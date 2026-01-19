import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');

    // Accept cookies to dismiss banner
    await page.locator('#cookie-accept').click();
  });

  test('should open mobile menu when clicking hamburger button', async ({ page }) => {
    // Click hamburger button
    await page.locator('.mobile-menu-btn').click();

    // Mobile menu should be visible
    const mobileNav = page.locator('.mobile-nav');
    await expect(mobileNav).toHaveClass(/active/);

    // Menu button should be active
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).toHaveClass(/active/);

    // Body should have overflow hidden (scroll locked)
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');
  });

  test('should close mobile menu when clicking hamburger button again', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Close menu
    await page.locator('.mobile-menu-btn').click();

    // Mobile menu should not be active
    const mobileNav = page.locator('.mobile-nav');
    await expect(mobileNav).not.toHaveClass(/active/);

    // Menu button should not be active
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).not.toHaveClass(/active/);

    // Body should have overflow restored
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('should close mobile menu when clicking a navigation link', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Click a navigation link
    await page.locator('.mobile-nav a[href="#services"]').click();

    // Wait a bit for menu close animation
    await page.waitForTimeout(500);

    // Mobile menu should not be active
    const mobileNav = page.locator('.mobile-nav');
    await expect(mobileNav).not.toHaveClass(/active/);
  });

  test('should allow language switching in mobile menu', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Click EN button in mobile menu
    await page.locator('.mobile-nav .lang-text-btn[data-lang="en"]').click();

    // Verify language changed
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // Menu should still be open after language change
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    await page.locator('.mobile-menu-btn').click();

    // Menu should be active
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Close menu
    await page.locator('.mobile-menu-btn').click();

    // Menu should be inactive
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/active/);
  });
});
