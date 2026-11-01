// Lesson 11.3, a trap: "the Cancel button" — when My bookings has two rows, which one? (RED on purpose: strict mode)
import { test, expect } from '@playwright/test';
import { book, freshLab } from '../../e2e/helpers.js';

const daysFromNow = (n) => new Date(Date.now() + 7 * 3600e3 + n * 86400e3).toISOString().slice(0, 10);
test.use({ storageState: 'playwright/.auth/an.json' });

test('cancel "the" booking', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab, date: daysFromNow(5), start: '08:00', end: '09:00' });
  await expect(page.getByRole('status')).toBeVisible();
  await book(page, { lab, date: daysFromNow(5), start: '10:00', end: '11:00' });
  await expect(page.getByRole('status')).toBeVisible();
  await page.goto('/my-bookings');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('status')).toContainText('Cancelled');
});
