import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');

    // Accept cookies to dismiss banner
    await page.locator('#cookie-accept').click();
  });

  test('should navigate to services section via anchor link', async ({ page }) => {
    // Click services link
    await page.locator('a[href="#services"]').first().click();

    // Wait for URL hash to update
    await page.waitForURL('**/#services', { timeout: 5000 });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Check URL hash
    expect(page.url()).toContain('#services');

    // Services section should be visible in viewport
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeInViewport();
  });

  test('should navigate to method section via anchor link', async ({ page }) => {
    // Click method link
    await page.locator('a[href="#method"]').first().click();

    // Wait for URL hash to update
    await page.waitForURL('**/#method', { timeout: 5000 });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Check URL hash
    expect(page.url()).toContain('#method');

    // Method section should be visible
    const methodSection = page.locator('#method');
    await expect(methodSection).toBeInViewport();
  });

  test('should navigate to partners section via anchor link', async ({ page }) => {
    // Click partners link
    await page.locator('a[href="#partners"]').first().click();

    // Wait for URL hash to update
    await page.waitForURL('**/#partners', { timeout: 5000 });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Check URL hash
    expect(page.url()).toContain('#partners');

    // Partners section should be visible
    const partnersSection = page.locator('#partners');
    await expect(partnersSection).toBeInViewport();
  });

  test('should navigate to contact section via anchor link', async ({ page }) => {
    // Click contact link
    await page.locator('a[href="#contact"]').first().click();

    // Wait for URL hash to update
    await page.waitForURL('**/#contact', { timeout: 5000 });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Check URL hash
    expect(page.url()).toContain('#contact');
  });

  test('should update URL hash correctly on navigation', async ({ page }) => {
    // Navigate to services
    await page.locator('a[href="#services"]').first().click();
    await page.waitForURL('**/#services', { timeout: 5000 });
    expect(page.url()).toContain('#services');

    // Navigate to method
    await page.locator('a[href="#method"]').first().click();
    await page.waitForURL('**/#method', { timeout: 5000 });
    expect(page.url()).toContain('#method');

    // Navigate to partners
    await page.locator('a[href="#partners"]').first().click();
    await page.waitForURL('**/#partners', { timeout: 5000 });
    expect(page.url()).toContain('#partners');
  });

  test('should perform smooth scroll to sections', async ({ page }) => {
    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Click a section link
    await page.locator('a[href="#services"]').first().click();

    // Wait a bit and check scroll position changed
    await page.waitForTimeout(500);
    const newScroll = await page.evaluate(() => window.scrollY);

    expect(newScroll).toBeGreaterThan(initialScroll);
  });

  test('should restore sticky positioning after scroll', async ({ page }) => {
    // Click a section link
    await page.locator('a[href="#services"]').first().click();

    // Wait for scroll animation and position restore
    await page.waitForTimeout(1000);

    // Check that sections have their position style restored
    // According to main.js, the position style is cleared after 800ms
    const sectionStyle = await page.locator('.section-card').first().evaluate(
      el => window.getComputedStyle(el).position
    );

    // Style should be back to its original value (likely sticky or not set)
    expect(sectionStyle).not.toBe('relative');
  });

  test('should close mobile menu when clicking nav link', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Click a nav link
    await page.locator('.mobile-nav a[href="#services"]').click();

    // Wait for menu to close
    await page.waitForTimeout(500);

    // Mobile menu should be closed
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/active/);
  });

  test('should navigate through multiple sections sequentially', async ({ page }) => {
    // Navigate to services
    await page.locator('a[href="#services"]').first().click();
    await page.waitForURL('**/#services', { timeout: 5000 });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#services');

    // Navigate to method
    await page.locator('a[href="#method"]').first().click();
    await page.waitForURL('**/#method', { timeout: 5000 });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#method');

    // Navigate to partners
    await page.locator('a[href="#partners"]').first().click();
    await page.waitForURL('**/#partners', { timeout: 5000 });
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#partners');

    // All sections should be accessible
    const partnersSection = page.locator('#partners');
    await expect(partnersSection).toBeInViewport();
  });

  test('should handle navigation from bottom to top', async ({ page }) => {
    // Scroll to bottom first
    await page.locator('.footer-cta').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Navigate back to top section
    await page.locator('a[href="#services"]').first().click();
    await page.waitForTimeout(1000);

    // Should scroll back up
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeInViewport();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/active/);

    // Click a navigation link
    await page.locator('.mobile-nav a[href="#services"]').click();

    // Wait for URL to update
    await page.waitForURL('**/#services', { timeout: 5000 });
    await page.waitForTimeout(500);

    // Should navigate correctly
    expect(page.url()).toContain('#services');
    await expect(page.locator('#services')).toBeInViewport();
  });

  test('should handle rapid navigation clicks', async ({ page }) => {
    // Click multiple links quickly
    await page.locator('a[href="#services"]').first().click();
    await page.waitForTimeout(100);
    await page.locator('a[href="#method"]').first().click();
    await page.waitForTimeout(100);
    await page.locator('a[href="#partners"]').first().click();

    // Wait for final URL to update
    await page.waitForURL('**/#partners', { timeout: 5000 });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Should end up at the last clicked section
    expect(page.url()).toContain('#partners');
  });

  test('should not navigate when clicking hash-only links', async ({ page }) => {
    // Click a link with just '#'
    const linksWithHashOnly = await page.locator('a[href="#"]').count();

    if (linksWithHashOnly > 0) {
      const initialUrl = page.url();
      await page.locator('a[href="#"]').first().click();
      await page.waitForTimeout(300);

      // URL should not change (or only add #)
      const newUrl = page.url();
      expect(newUrl.replace('#', '')).toBe(initialUrl.replace('#', ''));
    }
  });

  test('should maintain scroll position when navigating to already visible section', async ({ page }) => {
    // Navigate to services
    await page.locator('a[href="#services"]').first().click();
    await page.waitForTimeout(1000);

    // Get scroll position
    const scrollPos1 = await page.evaluate(() => window.scrollY);

    // Click services link again
    await page.locator('a[href="#services"]').first().click();
    await page.waitForTimeout(1000);

    // Scroll position should be similar (might scroll to exact position)
    const scrollPos2 = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollPos2 - scrollPos1)).toBeLessThan(100);
  });

  test('should scroll with proper timing for sticky sections', async ({ page }) => {
    // According to main.js, sections temporarily get position: relative during scroll
    // and it's restored after 800ms

    // Click a section
    await page.locator('a[href="#services"]').first().click();

    // Immediately check if position was modified
    await page.waitForTimeout(100);
    const positionDuringScroll = await page.locator('.section-card').first().evaluate(
      el => el.style.position
    );

    // Should be 'relative' during scroll
    expect(positionDuringScroll).toBe('relative');

    // Wait for restoration
    await page.waitForTimeout(900);

    // Position should be restored (empty string)
    const positionAfterScroll = await page.locator('.section-card').first().evaluate(
      el => el.style.position
    );

    expect(positionAfterScroll).toBe('');
  });
});
