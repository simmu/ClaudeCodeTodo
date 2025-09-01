import { chromium, FullConfig } from '@playwright/test';
import { testDb } from './database';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  try {
    // Start test database
    await testDb.startTestDatabase();
    
    // Wait for the web servers to be ready
    // The webServer configuration in playwright.config.ts will handle this
    
    // Create a browser instance for shared authentication if needed
    const browser = await chromium.launch();
    const context = await browser.newContext();
    
    // Pre-authenticate a test user and save the authentication state
    // This will be useful for tests that require authentication
    const page = await context.newPage();
    
    // Store authentication state for reuse in tests
    // await context.storageState({ path: 'tests/fixtures/auth-state.json' });
    
    await browser.close();
    
    console.log('✅ Global test setup completed');
  } catch (error) {
    console.error('❌ Global test setup failed:', error);
    throw error;
  }
}

export default globalSetup;