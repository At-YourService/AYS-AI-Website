import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear storage and set mobile viewport
    await context.clearCookies();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('should open mobile menu on hamburger click', async ({ page }) => {
    // Click hamburger button
    await page.locator('.mobile-menu-btn').click();

    // Mobile nav should have active class
    const mobileNav = page.locator('.mobile-nav');
    await expect(mobileNav).toHaveClass(/active/);

    // Mobile menu button should have active class
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).toHaveClass(/active/);
  });

  test('should display menu overlay when opened', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();

    // Mobile nav should be visible
    const mobileNav = page.locator('.mobile-nav');
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav).toHaveClass(/active/);

    // Menu links should be visible
    await expect(page.locator('.mobile-nav-links a').first()).toBeVisible();
  });

  test('should lock body scroll when menu is open', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();

    // Check body overflow style
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');
  });

  test('should close menu on hamburger click again', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Close menu
    await page.locator('.mobile-menu-btn').click();

    // Mobile nav should not have active class
    const mobileNav = page.locator('.mobile-nav');
    await expect(mobileNav).not.toHaveClass(/active/);

    // Mobile menu button should not have active class
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).not.toHaveClass(/active/);
  });

  test('should restore body scroll when menu closes', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Close menu
    await page.locator('.mobile-menu-btn').click();

    // Check body overflow is restored
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('should close menu when clicking nav link', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Click a nav link
    await page.locator('.mobile-nav-links a[href="#services"]').click();

    // Wait a bit for the close animation
    await page.waitForTimeout(300);

    // Menu should be closed
    const mobileNav = page.locator('.mobile-nav');
    await expect(mobileNav).not.toHaveClass(/active/);
  });

  test('should display language buttons in mobile menu', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();

    // Language buttons should be visible
    const nlButton = page.locator('.mobile-nav .lang-text-btn[data-lang="nl"]');
    const enButton = page.locator('.mobile-nav .lang-text-btn[data-lang="en"]');

    await expect(nlButton).toBeVisible();
    await expect(enButton).toBeVisible();
  });

  test('should allow language switching from mobile menu', async ({ page }) => {
    // Accept cookies first
    await page.locator('#cookie-accept').click();

    // Open menu
    await page.locator('.mobile-menu-btn').click();

    // Wait for menu to be visible
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Click EN button in mobile nav
    const enButton = page.locator('.mobile-nav .lang-text-btn[data-lang="en"]');
    await enButton.click();

    // Wait for language change to complete
    await expect(page.locator('[data-i18n="nav.services"]').first()).toHaveText('Services', { timeout: 10000 });

    // EN button should have active class
    await expect(enButton).toHaveClass(/active/);
  });

  test('should show all navigation links in mobile menu', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();

    // Check all expected nav links are present
    const navLinks = page.locator('.mobile-nav-links a');
    const count = await navLinks.count();

    // Should have links for services, method, partners, contact, etc.
    expect(count).toBeGreaterThan(0);

    // Check specific links
    await expect(page.locator('.mobile-nav-links a[href="#services"]')).toBeVisible();
    await expect(page.locator('.mobile-nav-links a[href="#method"]')).toBeVisible();
  });

  test('should toggle menu multiple times', async ({ page }) => {
    const menuBtn = page.locator('.mobile-menu-btn');
    const mobileNav = page.locator('.mobile-nav');

    // Open
    await menuBtn.click();
    await expect(mobileNav).toHaveClass(/active/);

    // Close
    await menuBtn.click();
    await expect(mobileNav).not.toHaveClass(/active/);

    // Open again
    await menuBtn.click();
    await expect(mobileNav).toHaveClass(/active/);

    // Close again
    await menuBtn.click();
    await expect(mobileNav).not.toHaveClass(/active/);
  });

  test('should maintain scroll lock when menu is open', async ({ page }) => {
    // Open menu
    await page.locator('.mobile-menu-btn').click();

    // Try to scroll (body should have overflow: hidden)
    const initialOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(initialOverflow).toBe('hidden');

    // Even after waiting, overflow should remain hidden
    await page.waitForTimeout(500);
    const overflowAfterWait = await page.evaluate(() => document.body.style.overflow);
    expect(overflowAfterWait).toBe('hidden');
  });

  test('should work on different mobile viewports', async ({ page }) => {
    // Test on iPhone viewport
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 Pro

    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Close
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/active/);
  });

  test('should close menu after navigation and language change', async ({ page }) => {
    // Accept cookies
    await page.locator('#cookie-accept').click();

    // Open menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Change language
    await page.locator('.mobile-nav .lang-text-btn[data-lang="en"]').click();

    // Menu might stay open after language change
    // Now click a nav link to close it
    await page.locator('.mobile-nav-links a').first().click();

    // Wait for close
    await page.waitForTimeout(300);

    // Menu should be closed
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/active/);
  });
});
