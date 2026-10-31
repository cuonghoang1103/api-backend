import { test, expect } from '@playwright/test';
import { signIn, book } from '../e2e/helpers.js';

// The API answers 1.5 seconds late — like a slow network. Which assertion copes?
test.beforeEach(async ({ page }) => {
  await page.route('**/api/bookings', async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.continue();
  });
});

test('web-first assertion: retries until the text appears', async ({ page }) => {
  await signIn(page, 'an');
  await book(page, { lab: 'DM-701' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in DM-701.');
});

test('RED ON PURPOSE — isVisible() answers at once and never waits', async ({ page }) => {
  await signIn(page, 'an');
  await book(page, { lab: 'DM-702' });
  expect(await page.getByRole('status').isVisible()).toBe(true);
});

test('RED ON PURPOSE — a fixed sleep shorter than the delay', async ({ page }) => {
  await signIn(page, 'an');
  await book(page, { lab: 'DM-703' });
  await page.waitForTimeout(1000);
  expect(await page.getByRole('status').isVisible()).toBe(true);
});
