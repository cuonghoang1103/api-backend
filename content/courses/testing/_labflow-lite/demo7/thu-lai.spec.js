import { test, expect } from '@playwright/test';
import { book } from '../e2e/helpers.js';

test.use({ storageState: 'playwright/.auth/an.json' });

// Simulated flakiness: on the first attempt the API answers after 6 s, longer than expect's 5 s.
test('a slow first attempt, then a normal retry', async ({ page }, testInfo) => {
  if (testInfo.retry === 0) {
    await page.route('**/api/bookings', async (route) => {
      await new Promise((r) => setTimeout(r, 6000));
      await route.continue();
    });
  }
  await page.goto('/');
  await book(page, { lab: 'RT-70' + testInfo.retry });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in RT-70' + testInfo.retry + '.');
});
