import { test, expect } from '@playwright/test';
import { book } from '../e2e/helpers.js';

// Two tests, written months apart by two people, both use the "obvious" test data: SH-301, 16 Nov, 08:00–10:00.
test.use({ storageState: 'playwright/.auth/an.json' });

test('booking from the home page', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'SH-301' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in SH-301.');
});

test('booking shows the confirmation', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'SH-301' });
  await expect(page.getByRole('status')).toContainText('SH-301');
});
