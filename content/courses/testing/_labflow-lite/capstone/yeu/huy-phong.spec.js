import { test, expect } from '@playwright/test';
import { book, freshLab } from './helpers.js';

test.use({ storageState: 'playwright/.auth/an.json' });

test('cancel', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  const date = new Date(Date.now() + 3 * 86400e3).toISOString().slice(0, 10);
  await page.goto('/');
  await book(page, { lab, date, start: '13:00', end: '15:00' });
  await page.goto('/my-bookings');
  await page.getByRole('row', { name: new RegExp(lab) }).getByRole('button').click();
  await expect(page.getByRole('status')).toContainText('Cancelled');
});
