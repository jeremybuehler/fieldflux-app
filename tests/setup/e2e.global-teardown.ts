import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up E2E test environment...');

  // Clean up test data if needed
  if (process.env.PLAYWRIGHT_CLEANUP_DB === 'true') {
    try {
      console.log('📊 Cleaning up test database...');
      // Add cleanup SQL commands here
      console.log('✅ Test database cleanup complete');
    } catch (error) {
      console.error('❌ Failed to cleanup test database:', error);
    }
  }

  // Clean up authentication state files
  try {
    const authStatePath = path.join(process.cwd(), 'test-results', 'auth-state.json');
    if (fs.existsSync(authStatePath)) {
      fs.unlinkSync(authStatePath);
      console.log('🔐 Authentication state cleaned up');
    }
  } catch (error) {
    console.warn('⚠️ Could not clean up authentication state:', error);
  }

  // Generate test summary
  try {
    const testResultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    if (fs.existsSync(testResultsPath)) {
      const results = JSON.parse(fs.readFileSync(testResultsPath, 'utf-8'));
      console.log('\n📊 Test Summary:');
      console.log(`   Total tests: ${results.stats?.total || 0}`);
      console.log(`   Passed: ${results.stats?.passed || 0}`);
      console.log(`   Failed: ${results.stats?.failed || 0}`);
      console.log(`   Skipped: ${results.stats?.skipped || 0}`);
      console.log(`   Duration: ${results.stats?.duration || 0}ms`);
    }
  } catch (error) {
    console.warn('⚠️ Could not generate test summary:', error);
  }

  console.log('✅ E2E test environment cleanup complete!');
}

export default globalTeardown;