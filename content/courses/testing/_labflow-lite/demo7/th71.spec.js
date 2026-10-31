import { test, expect } from '@playwright/test';
import { signIn } from '../e2e/helpers.js';

test('the page title, and the password field hides what you type', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('LabFlow Lite');
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
});

test('a lecturer signs in and gets the booking form', async ({ page }) => {
  await signIn(page, 'thay');
  await expect(page.getByText('Signed in as thay (LECTURER)')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Book a lab' })).toBeVisible();
});
