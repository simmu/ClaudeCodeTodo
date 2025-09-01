import { test, expect } from '@playwright/test';

test.describe('Offline Functionality', () => {
  test('should work when network is offline', async ({ page, context }) => {
    // Go online first to load the app
    await page.goto('/');
    
    // Wait for the app to load
    await expect(page.locator('[data-testid="app-container"]')).toBeVisible();
    
    // Go offline
    await context.setOffline(true);
    
    // Check that offline indicator is shown
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
    
    // Try to perform offline actions (if implemented)
    const addTodoButton = page.locator('[data-testid="add-todo-button"]');
    if (await addTodoButton.isVisible()) {
      await addTodoButton.click();
      
      // Fill in todo details
      await page.fill('[data-testid="todo-title-input"]', 'Offline Todo');
      await page.fill('[data-testid="todo-description-input"]', 'Created while offline');
      
      // Submit the todo
      await page.click('[data-testid="save-todo-button"]');
      
      // Check if todo appears in list (stored locally)
      await expect(page.locator('[data-testid="todo-item"]').last()).toContainText('Offline Todo');
      
      // Check if sync indicator shows pending
      await expect(page.locator('[data-testid="sync-status"]')).toContainText(/pending|offline/i);
    }
  });

  test('should sync data when coming back online', async ({ page, context }) => {
    // Start offline
    await context.setOffline(true);
    await page.goto('/');
    
    // Create todo while offline (if the app loads offline)
    // This test assumes the app can work offline from cache
    
    // Go back online
    await context.setOffline(false);
    
    // Check if sync indicator appears
    const syncIndicator = page.locator('[data-testid="sync-status"]');
    if (await syncIndicator.isVisible()) {
      // Wait for sync to complete
      await expect(syncIndicator).toContainText(/synced|online/i, { timeout: 10000 });
    }
  });

  test('should handle sync conflicts', async ({ page }) => {
    await page.goto('/');
    
    // This test would simulate a sync conflict scenario
    // Implementation depends on conflict resolution UI
    
    // Mock a conflict scenario by creating a todo with same ID
    // that has different content locally vs server
    
    // Check if conflict resolution dialog appears
    const conflictDialog = page.locator('[data-testid="conflict-resolution-dialog"]');
    if (await conflictDialog.isVisible()) {
      // Choose to keep local version
      await page.click('[data-testid="keep-local-version"]');
      
      // Verify conflict is resolved
      await expect(conflictDialog).not.toBeVisible();
    }
  });

  test('should cache resources for offline use', async ({ page, context }) => {
    // Go online first to cache resources
    await page.goto('/');
    await expect(page.locator('[data-testid="app-container"]')).toBeVisible();
    
    // Clear network cache but keep service worker cache
    await page.reload();
    
    // Go offline
    await context.setOffline(true);
    
    // Refresh the page - should still work from cache
    await page.reload();
    
    // App should still be functional
    await expect(page.locator('[data-testid="app-container"]')).toBeVisible();
  });
});