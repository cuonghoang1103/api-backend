// Practice 11.3: privacy at the E2E layer — Binh never sees An's booking in My bookings (US-11 AC1).
import { test, expect } from '@playwright/test';
import { book, freshLab, signIn } from '../../e2e/helpers.js';

const daysFromNow = (n) => new Date(Date.now() + 7 * 3600e3 + n * 86400e3).toISOString().slice(0, 10);

test("Binh's My bookings does not show An's booking (US-11 AC1)", async ({ browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const an = await browser.newContext({ storageState: 'playwright/.auth/an.json' });
  const anPage = await an.newPage();
  await anPage.goto('/');
  await book(anPage, { lab, date: daysFromNow(4), start: '09:00', end: '10:00' });
  await expect(anPage.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');

  const binh = await browser.newContext();
  const binhPage = await binh.newPage();
  await signIn(binhPage, 'binh');
  await binhPage.getByRole('link', { name: 'My bookings' }).click();
  await expect(binhPage.getByRole('heading', { name: 'My bookings' })).toBeVisible();
  await expect(binhPage.getByRole('status')).toHaveCount(0);   // the list has finished loading
  await expect(binhPage.getByRole('row', { name: new RegExp(lab) })).toHaveCount(0);
  await an.close();
  await binh.close();
});
