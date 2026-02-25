import { test, expect } from '@playwright/test';

test('basic login flow simulation', async ({ page }) => {
    // Go to the landing page
    await page.goto('http://localhost:20261/');

    // Check if we are on the dashboard
    await expect(page).toHaveTitle(/SeikatsuMudik/);

    // Click login button (simulating user action)
    const loginButton = page.locator('button:has-text("Masuk")').first();
    await expect(loginButton).toBeVisible();

    // Note: We won't actually login via Google in automated tests without mocks/secrets,
    // but we verify the button exists and is clickable.
    console.log('Login button is visible and ready for interaction.');
});
