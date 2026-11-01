// Lesson 11.3, a time bomb: a fixed time of day. Green before 06:00 in Viet Nam, red after it (RED on purpose when run in the day).
import { test, expect } from '@playwright/test';
import { book, freshLab } from '../../e2e/helpers.js';

const today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
test.use({ storageState: 'playwright/.auth/an.json' });

test('cancel a booking for today at 07:00', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab, date: today, start: '07:00', end: '08:00' });
  await page.goto('/my-bookings');
  await page.getByRole('row', { name: new RegExp(lab) }).getByRole('button').click();
  await expect(page.getByRole('status')).toContainText('Cancelled');
});
