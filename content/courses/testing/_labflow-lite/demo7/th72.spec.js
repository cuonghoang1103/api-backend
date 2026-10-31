import { test, expect } from '@playwright/test';
import { signIn, book, freshLab } from '../e2e/helpers.js';

test('a lecturer books 40 seats: confirmed at once, and the admin sees CONFIRMED', async ({ browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const lecturer = await (await browser.newContext()).newPage();
  await signIn(lecturer, 'thay');
  await book(lecturer, { lab, seats: '40' });
  await expect(lecturer.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');

  const admin = await (await browser.newContext({ storageState: 'playwright/.auth/boss.json' })).newPage();
  await admin.goto('/');
  await expect(admin.getByRole('row', { name: new RegExp(lab) })).toContainText('CONFIRMED');
});
