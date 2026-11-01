// US-11 "My bookings", end to end (Chapter 11): book → see it in My bookings → cancel → the slot is free again.
// The server runs on the real clock, so the booking is a few days ahead of TODAY (Lite-3 needs ≥ 60 minutes).
import { test, expect } from '@playwright/test';
import { book, freshLab } from './helpers.js';

// "YYYY-MM-DD" n days from now, in Viet Nam time (UTC+7), like daysAheadVN in Chapter 2.
const daysFromNow = (n) => new Date(Date.now() + 7 * 3600e3 + n * 86400e3).toISOString().slice(0, 10);

test.use({ storageState: 'playwright/.auth/an.json' });

test('cancel a booking from My bookings, then book the same slot again (US-11 AC1, AC2, AC5)', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  const date = daysFromNow(3);
  await page.goto('/');
  await book(page, { lab, date, start: '13:00', end: '15:00' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');

  await page.getByRole('link', { name: 'My bookings' }).click();
  const row = page.getByRole('row', { name: new RegExp(lab) });
  await expect(row).toContainText('CONFIRMED');
  await row.getByRole('button', { name: 'Cancel ' + lab + ' on ' + date + ' at 13:00' }).click();
  await expect(page.getByRole('status')).toHaveText('Cancelled ' + lab + ' on ' + date + ', 13:00–15:00.');
  await expect(row).toContainText('CANCELLED');

  await page.reload();   // what the server stored, not what the screen remembers
  await expect(page.getByRole('row', { name: new RegExp(lab) })).toContainText('CANCELLED');

  await page.getByRole('link', { name: 'Book a lab' }).click();
  await book(page, { lab, date, start: '13:00', end: '15:00' });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
});
