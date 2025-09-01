import { FullConfig } from '@playwright/test';
import { testDb } from './database';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');

  try {
    // Stop test database
    await testDb.stopTestDatabase();
    
    // Clean up any temporary files
    // Remove authentication state files
    // Clean up test artifacts
    
    console.log('✅ Global test teardown completed');
  } catch (error) {
    console.error('❌ Global test teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;