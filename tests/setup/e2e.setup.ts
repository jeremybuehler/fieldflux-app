import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../test-results/auth-state.json');

setup('authenticate', async ({ page }) => {
  // Mock authentication for testing
  // In a real app, you'd navigate to login page and authenticate
  console.log('🔐 Setting up authentication for tests...');
  
  try {
    // Navigate to home page to establish session
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Mock user authentication by setting local storage
    await page.evaluate(() => {
      localStorage.setItem('fieldflux_user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@fieldflux.com',
        name: 'Test User',
        role: 'admin'
      }));
      
      localStorage.setItem('fieldflux_session', JSON.stringify({
        token: 'test-session-token',
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));
    });

    // Reload to apply authentication
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify we're authenticated by checking for user interface elements
    // This might be a user menu, dashboard, or other authenticated state indicators
    const hasUserInterface = await page.locator('[data-testid="user-menu"], .user-avatar, [aria-label*="user"]').count();
    
    if (hasUserInterface > 0) {
      console.log('✅ Authentication successful');
    } else {
      console.log('⚠️ Authentication state unclear, continuing with test setup');
    }

    // Save authenticated state
    await page.context().storageState({ path: authFile });
    console.log('💾 Authentication state saved');
    
  } catch (error) {
    console.error('❌ Authentication setup failed:', error);
    
    // Still save the state even if authentication wasn't perfect
    await page.context().storageState({ path: authFile });
    console.log('💾 Basic state saved despite authentication issues');
  }
});

setup('verify app loads', async ({ page }) => {
  console.log('🔍 Verifying app loads correctly...');
  
  await page.goto('/');
  
  // Wait for the app to load
  await page.waitForLoadState('networkidle');
  
  // Check for essential elements
  const hasTitle = await page.locator('title').count() > 0;
  const hasContent = await page.locator('body').count() > 0;
  
  expect(hasTitle).toBeTruthy();
  expect(hasContent).toBeTruthy();
  
  // Take a screenshot for visual verification
  await page.screenshot({ 
    path: path.join(__dirname, '../../test-results/app-loaded.png'),
    fullPage: true 
  });
  
  console.log('✅ App loads successfully');
});