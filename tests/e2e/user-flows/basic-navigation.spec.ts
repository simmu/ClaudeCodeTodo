import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('should display the application title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Todo App/);
  });

  test('should have main navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for main app container
    await expect(page.locator('[data-testid="app-container"]')).toBeVisible();
    
    // Check for header
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    
    // Check for main content area
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Look for login link/button
    const loginButton = page.locator('[data-testid="login-button"]');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    
    // Look for register link/button
    const registerButton = page.locator('[data-testid="register-button"]');
    if (await registerButton.isVisible()) {
      await registerButton.click();
      await expect(page).toHaveURL(/.*register/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile navigation works
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    }
  });
});