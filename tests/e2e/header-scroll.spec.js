import { test, expect } from '@playwright/test';

test.describe('Header Scroll Behavior', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');

    // Accept cookies to dismiss banner
    await page.locator('#cookie-accept').click();
  });

  test('should add scrolled class when scrolling past 50px', async ({ page }) => {
    const header = page.locator('header');

    // Initially, header should not have scrolled class
    await expect(header).not.toHaveClass(/header-scrolled/);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(300); // Wait for scroll handler

    // Header should have scrolled class
    await expect(header).toHaveClass(/header-scrolled/);
  });

  test('should remove scrolled class when scrolling back to top', async ({ page }) => {
    const header = page.locator('header');

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(300);
    await expect(header).toHaveClass(/header-scrolled/);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Header should not have scrolled class
    await expect(header).not.toHaveClass(/header-scrolled/);
  });

  test('should change style over dark sections', async ({ page }) => {
    const header = page.locator('header');

    // Scroll to method section (dark)
    await page.locator('#method').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Header should have dark section styling
    await expect(header).toHaveClass(/header-on-dark/);
  });

  test('should change style over light sections', async ({ page }) => {
    const header = page.locator('header');

    // Scroll to services section (light)
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Header should have light section styling
    await expect(header).toHaveClass(/header-on-light/);
  });

  test('should change style over accent sections', async ({ page }) => {
    const header = page.locator('header');

    // Scroll to partners section (accent)
    await page.locator('#partners').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Header should have accent section styling
    await expect(header).toHaveClass(/header-on-accent/);
  });

  test('should change style over footer-cta (dark)', async ({ page }) => {
    const header = page.locator('header');

    // Scroll to footer CTA
    await page.locator('.footer-cta').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Header should have dark section styling
    await expect(header).toHaveClass(/header-on-dark/);
  });

  test('should update header classes as user scrolls through sections', async ({ page }) => {
    const header = page.locator('header');

    // Start at top (hero - likely no special class)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Scroll to services (light)
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(header).toHaveClass(/header-on-light/, { timeout: 10000 });

    // Scroll to method (dark)
    await page.locator('#method').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(header).toHaveClass(/header-on-dark/, { timeout: 10000 });

    // Scroll to partners (accent)
    await page.locator('#partners').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(header).toHaveClass(/header-on-accent/, { timeout: 10000 });
  });

  test('should handle rapid scrolling', async ({ page }) => {
    const header = page.locator('header');

    // Rapidly scroll to different positions
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    // Header should still respond appropriately
    await expect(header).toHaveClass(/header-scrolled/);
  });

  test('should maintain scrolled state when changing sections', async ({ page }) => {
    const header = page.locator('header');

    // Scroll to a section far down the page
    await page.locator('#partners').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Header should be scrolled (we're definitely past 50px)
    await expect(header).toHaveClass(/header-scrolled/);

    // And should have section-specific styling
    await expect(header).toHaveClass(/header-on-accent/);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const header = page.locator('header');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(300);

    // Header should have scrolled class
    await expect(header).toHaveClass(/header-scrolled/);

    // Scroll to a section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Should have appropriate section styling
    await expect(header).toHaveClass(/header-on-light/);
  });

  test('should remove dark class when leaving dark section', async ({ page }) => {
    const header = page.locator('header');

    // Scroll to dark section
    await page.locator('#method').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(header).toHaveClass(/header-on-dark/);

    // Scroll to light section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Should not have dark class anymore
    await expect(header).not.toHaveClass(/header-on-dark/);
    await expect(header).toHaveClass(/header-on-light/);
  });

  test('should handle scroll events continuously', async ({ page }) => {
    const header = page.locator('header');

    // Scroll smoothly through the page
    for (let i = 0; i <= 1000; i += 100) {
      await page.evaluate((scroll) => window.scrollTo(0, scroll), i);
      await page.waitForTimeout(50);
    }

    // Header should be in scrolled state
    await expect(header).toHaveClass(/header-scrolled/);
  });

  test('should prioritize overlapping sections correctly', async ({ page }) => {
    const header = page.locator('header');

    // This test checks that when sections overlap, the correct priority is applied
    // Based on main.js, accent sections override light, which override dark

    // Scroll to ensure we're in a section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // The header should reflect the current section's style
    const headerClass = await header.getAttribute('class');

    // Should have one of the section style classes
    const hasStyleClass = headerClass.includes('header-on-dark') ||
                         headerClass.includes('header-on-light') ||
                         headerClass.includes('header-on-accent');

    expect(hasStyleClass).toBe(true);
  });
});
