import { test, expect } from '@playwright/test';
import { book } from '../e2e/helpers.js';

test.use({ storageState: 'playwright/.auth/an.json', trace: 'on' });

test('RED ON PURPOSE — expects the wrong message, leaves a trace behind', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'TR-701', seats: '31' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in TR-701.', { timeout: 2000 });
});
