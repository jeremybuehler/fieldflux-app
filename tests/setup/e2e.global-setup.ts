import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up E2E test environment...');

  // Ensure test results directory exists
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }

  // Setup test database if needed
  if (process.env.PLAYWRIGHT_SETUP_DB === 'true') {
    try {
      console.log('📊 Setting up test database...');
      execSync('npm run db:push', { stdio: 'inherit' });
      // Add any database seeding here if needed
      console.log('✅ Test database setup complete');
    } catch (error) {
      console.error('❌ Failed to setup test database:', error);
    }
  }

  // Wait for server to be available
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:5000';
  console.log(`⏳ Waiting for server at ${baseURL}...`);
  
  let retries = 30;
  while (retries > 0) {
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      const response = await page.goto(baseURL, { timeout: 10000 });
      
      if (response?.ok()) {
        console.log('✅ Server is ready');
        await browser.close();
        break;
      }
      
      await browser.close();
      throw new Error(`Server responded with status ${response?.status()}`);
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error(`❌ Server not available after 30 attempts: ${error}`);
        throw error;
      }
      console.log(`⏳ Server not ready, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Create admin user for testing if needed
  try {
    console.log('👤 Creating test user...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Store authentication state for tests
    await page.goto(`${baseURL}/auth/test-setup`);
    await page.context().storageState({ 
      path: path.join(testResultsDir, 'auth-state.json') 
    });
    
    await browser.close();
    console.log('✅ Test user authentication setup complete');
  } catch (error) {
    console.warn('⚠️ Could not setup test authentication:', error);
  }

  console.log('🎯 E2E test environment setup complete!');
}

export default globalSetup;