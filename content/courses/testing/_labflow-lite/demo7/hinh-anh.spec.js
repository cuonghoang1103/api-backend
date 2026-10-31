import { test, expect } from '@playwright/test';

// Compares the sign-in page with a stored picture. The first run has no picture yet and writes one.
test('the sign-in page looks as before', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page).toHaveScreenshot('sign-in.png');
});
