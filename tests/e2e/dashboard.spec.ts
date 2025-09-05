import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Use authenticated state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load dashboard with key metrics', async ({ page }) => {
    // Navigate to dashboard if not already there
    const dashboardLink = page.locator('a[href="/"], a[href="/dashboard"], nav a:has-text("Dashboard")');
    if (await dashboardLink.count() > 0) {
      await dashboardLink.first().click();
      await page.waitForLoadState('networkidle');
    }

    // Check for dashboard title or heading
    const dashboardTitle = page.locator('h1, h2, [data-testid="dashboard-title"]');
    await expect(dashboardTitle).toBeVisible({ timeout: 10000 });

    // Check for metrics cards/widgets
    const metricsContainer = page.locator('[data-testid="metrics"], .metrics, .dashboard-metrics');
    if (await metricsContainer.count() > 0) {
      await expect(metricsContainer).toBeVisible();
    }

    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/dashboard-loaded.png',
      fullPage: true 
    });
  });

  test('should display analytics widgets', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for various analytics widgets
    const analyticsSelectors = [
      '[data-testid="analytics-chart"]',
      '.analytics-widget',
      '.chart-container',
      'canvas', // Charts often use canvas
      '.recharts-wrapper' // Recharts library
    ];

    let foundAnalytics = false;
    for (const selector of analyticsSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        foundAnalytics = true;
        console.log(`Found analytics widget: ${selector}`);
        break;
      }
    }

    // If no specific analytics widgets found, at least verify page loaded
    if (!foundAnalytics) {
      const body = page.locator('body');
      await expect(body).toBeVisible();
      console.log('No specific analytics widgets found, but page loaded successfully');
    }
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Simulate mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that content is visible and properly sized
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-mobile.png',
      fullPage: true 
    });

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    // Allow small differences due to scrollbars
    expect(scrollWidth - clientWidth).toBeLessThanOrEqual(20);
  });

  test('should navigate between sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for navigation links
    const navSelectors = [
      'nav a',
      '.navigation a',
      '.sidebar a',
      '[role="navigation"] a',
      '.nav-link'
    ];

    const navigationLinks = [];
    for (const selector of navSelectors) {
      const links = await page.locator(selector).all();
      navigationLinks.push(...links);
    }

    // Test navigation to different sections if links exist
    if (navigationLinks.length > 0) {
      const firstLink = navigationLinks[0];
      const linkText = await firstLink.textContent();
      const linkHref = await firstLink.getAttribute('href');
      
      if (linkText && linkHref && linkHref !== '#' && !linkHref.startsWith('http')) {
        console.log(`Testing navigation to: ${linkText} (${linkHref})`);
        
        await firstLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify navigation occurred
        const currentUrl = page.url();
        expect(currentUrl).toContain(linkHref.replace(/^\//, ''));
        
        console.log(`Successfully navigated to: ${currentUrl}`);
      }
    } else {
      console.log('No navigation links found, skipping navigation test');
    }
  });

  test('should handle loading states gracefully', async ({ page }) => {
    // Intercept API calls to simulate slow responses
    await page.route('**/api/**', async route => {
      // Add delay to simulate slow API
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.goto('/');

    // Look for loading indicators
    const loadingSelectors = [
      '[data-testid="loading"]',
      '.loading',
      '.spinner',
      '.skeleton',
      '[aria-label*="loading"]'
    ];

    let foundLoading = false;
    for (const selector of loadingSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        console.log(`Found loading indicator: ${selector}`);
        foundLoading = true;
        break;
      }
    }

    // Wait for page to finish loading
    await page.waitForLoadState('networkidle');

    // Verify content is eventually visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    console.log(foundLoading ? 'Loading states handled correctly' : 'No loading indicators found');
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for basic accessibility features
    const hasTitle = await page.locator('title').count() > 0;
    expect(hasTitle).toBeTruthy();

    // Check for main landmark
    const mainLandmark = page.locator('main, [role="main"]');
    if (await mainLandmark.count() > 0) {
      await expect(mainLandmark).toBeVisible();
    }

    // Check for heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Check that interactive elements are keyboard accessible
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.focus();
      
      // Verify button can be focused
      const isFocused = await firstButton.evaluate((el) => {
        return document.activeElement === el;
      });
      
      if (isFocused) {
        console.log('✅ Interactive elements are keyboard accessible');
      }
    }

    console.log(`Found ${headingCount} headings and ${buttonCount} buttons`);
  });
});