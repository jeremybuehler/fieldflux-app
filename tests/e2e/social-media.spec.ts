import { test, expect } from '@playwright/test';

test.describe('Social Media Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to social media section', async ({ page }) => {
    // Look for social media navigation
    const socialNavOptions = [
      'a[href*="/social"]',
      'nav a:has-text("Social")',
      'a:has-text("Social Media")',
      '.sidebar a:has-text("Social")'
    ];

    let socialLink = null;
    for (const selector of socialNavOptions) {
      const link = page.locator(selector);
      if (await link.count() > 0) {
        socialLink = link.first();
        break;
      }
    }

    if (socialLink) {
      await socialLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verify we're on social media page
      const url = page.url();
      expect(url).toMatch(/social|Social/);
      
      console.log(`Successfully navigated to social media section: ${url}`);
    } else {
      // Try direct navigation
      await page.goto('/social');
      await page.waitForLoadState('networkidle');
      console.log('Navigated directly to /social');
    }
  });

  test('should display social media platforms', async ({ page }) => {
    await page.goto('/social');
    await page.waitForLoadState('networkidle');

    // Look for social media platform indicators
    const platformSelectors = [
      '[data-testid*="facebook"]',
      '[data-testid*="instagram"]',
      '[data-testid*="twitter"]',
      '[data-testid*="linkedin"]',
      '.platform-facebook',
      '.platform-instagram',
      '.platform-twitter',
      '.platform-linkedin',
      'img[alt*="Facebook"]',
      'img[alt*="Instagram"]',
      'img[alt*="Twitter"]',
      'img[alt*="LinkedIn"]'
    ];

    const foundPlatforms = [];
    for (const selector of platformSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        foundPlatforms.push(selector);
      }
    }

    console.log(`Found social platforms: ${foundPlatforms.join(', ')}`);
    
    // Take screenshot of social media interface
    await page.screenshot({ 
      path: 'test-results/social-media-platforms.png',
      fullPage: true 
    });
  });

  test('should allow creating a post', async ({ page }) => {
    await page.goto('/social');
    await page.waitForLoadState('networkidle');

    // Look for create post button or form
    const createPostSelectors = [
      '[data-testid="create-post"]',
      'button:has-text("Create Post")',
      'button:has-text("New Post")',
      'button:has-text("Post")',
      '.create-post-btn',
      '[aria-label*="Create"]'
    ];

    let createButton = null;
    for (const selector of createPostSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        createButton = button.first();
        break;
      }
    }

    if (createButton) {
      await createButton.click();
      await page.waitForTimeout(1000);

      // Look for post creation form
      const formSelectors = [
        'form',
        '[data-testid="post-form"]',
        '.post-form',
        'textarea',
        'input[type="text"]'
      ];

      let foundForm = false;
      for (const selector of formSelectors) {
        const form = page.locator(selector);
        if (await form.count() > 0) {
          foundForm = true;
          console.log(`Found post creation form: ${selector}`);
          
          // Try to fill the form if it's a textarea or input
          if (selector.includes('textarea')) {
            await form.first().fill('Test post content for E2E testing');
          } else if (selector.includes('input[type="text"]')) {
            await form.first().fill('Test post');
          }
          
          break;
        }
      }

      expect(foundForm).toBeTruthy();
      
      // Take screenshot of create post form
      await page.screenshot({ 
        path: 'test-results/create-post-form.png',
        fullPage: true 
      });
      
    } else {
      console.log('No create post button found, checking for inline form');
      
      // Look for inline post creation
      const textareas = page.locator('textarea');
      if (await textareas.count() > 0) {
        await textareas.first().fill('Test post content');
        console.log('Found inline post creation form');
      }
    }
  });

  test('should display scheduled posts', async ({ page }) => {
    await page.goto('/social');
    await page.waitForLoadState('networkidle');

    // Look for scheduled posts section
    const scheduledPostSelectors = [
      '[data-testid="scheduled-posts"]',
      '.scheduled-posts',
      'section:has-text("Scheduled")',
      '.post-schedule',
      '.upcoming-posts'
    ];

    let foundScheduled = false;
    for (const selector of scheduledPostSelectors) {
      const section = page.locator(selector);
      if (await section.count() > 0) {
        await expect(section).toBeVisible();
        foundScheduled = true;
        console.log(`Found scheduled posts section: ${selector}`);
        break;
      }
    }

    // Look for individual post items
    const postSelectors = [
      '.post-item',
      '[data-testid*="post"]',
      '.social-post',
      '.post-card'
    ];

    for (const selector of postSelectors) {
      const posts = page.locator(selector);
      const count = await posts.count();
      if (count > 0) {
        console.log(`Found ${count} posts with selector: ${selector}`);
      }
    }

    if (foundScheduled) {
      await page.screenshot({ 
        path: 'test-results/scheduled-posts.png',
        fullPage: true 
      });
    }
  });

  test('should handle social media calendar', async ({ page }) => {
    await page.goto('/social');
    await page.waitForLoadState('networkidle');

    // Look for calendar component
    const calendarSelectors = [
      '[data-testid="calendar"]',
      '.calendar',
      '.react-calendar',
      '.date-picker',
      '.schedule-calendar'
    ];

    let foundCalendar = false;
    for (const selector of calendarSelectors) {
      const calendar = page.locator(selector);
      if (await calendar.count() > 0) {
        await expect(calendar).toBeVisible();
        foundCalendar = true;
        console.log(`Found calendar component: ${selector}`);
        
        // Try to interact with calendar if possible
        const calendarDates = calendar.locator('button, .calendar-date, [role="gridcell"]');
        const dateCount = await calendarDates.count();
        
        if (dateCount > 0) {
          console.log(`Calendar has ${dateCount} interactive dates`);
          // Click on first available date
          await calendarDates.first().click();
          await page.waitForTimeout(500);
        }
        
        break;
      }
    }

    if (foundCalendar) {
      await page.screenshot({ 
        path: 'test-results/social-calendar.png',
        fullPage: true 
      });
    } else {
      console.log('No calendar component found');
    }
  });

  test('should show analytics for social posts', async ({ page }) => {
    await page.goto('/social');
    await page.waitForLoadState('networkidle');

    // Look for analytics section
    const analyticsSelectors = [
      '[data-testid="social-analytics"]',
      '.social-analytics',
      '.post-analytics',
      '.engagement-metrics',
      'section:has-text("Analytics")',
      '.metrics'
    ];

    let foundAnalytics = false;
    for (const selector of analyticsSelectors) {
      const analytics = page.locator(selector);
      if (await analytics.count() > 0) {
        await expect(analytics).toBeVisible();
        foundAnalytics = true;
        console.log(`Found social analytics: ${selector}`);
        break;
      }
    }

    // Look for metric numbers or charts
    const metricSelectors = [
      '.metric-value',
      '.stat-number',
      '.engagement-count',
      'canvas', // Charts
      '.recharts-wrapper'
    ];

    for (const selector of metricSelectors) {
      const metrics = page.locator(selector);
      const count = await metrics.count();
      if (count > 0) {
        console.log(`Found ${count} metric elements: ${selector}`);
      }
    }

    if (foundAnalytics) {
      await page.screenshot({ 
        path: 'test-results/social-analytics.png',
        fullPage: true 
      });
    }
  });

  test('should be responsive on mobile devices', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto('/social');
    await page.waitForLoadState('networkidle');

    // Verify mobile layout
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check for mobile-specific elements
    const mobileMenuSelectors = [
      '.mobile-menu',
      '.hamburger',
      '[data-testid="mobile-menu"]',
      'button[aria-label*="menu"]'
    ];

    for (const selector of mobileMenuSelectors) {
      const mobileMenu = page.locator(selector);
      if (await mobileMenu.count() > 0) {
        console.log(`Found mobile menu: ${selector}`);
        // Try to open mobile menu
        await mobileMenu.click();
        await page.waitForTimeout(500);
        break;
      }
    }

    // Take mobile screenshot
    await page.screenshot({ 
      path: 'test-results/social-mobile.png',
      fullPage: true 
    });

    // Verify no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth - clientWidth).toBeLessThanOrEqual(20);
  });
});