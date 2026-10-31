// Booking journeys, end to end (lesson 7.2 and Lab 7). Signed in once by auth.setup.js.
import { test, expect } from '@playwright/test';
import { book, freshLab } from './helpers.js';

test.describe('as student an', () => {
  test.use({ storageState: 'playwright/.auth/an.json' });

  test('books a lab and sees it confirmed', async ({ page }, testInfo) => {
    const lab = freshLab(testInfo);
    await page.goto('/');
    await book(page, { lab });
    await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
  });

  test('31 seats waits for approval', async ({ page }, testInfo) => {
    await page.goto('/');
    await book(page, { lab: freshLab(testInfo), seats: '31' });
    await expect(page.getByRole('status')).toHaveText('Sent. A lecturer must approve this booking.');
  });

  test('the same slot twice is refused', async ({ page }, testInfo) => {
    const lab = freshLab(testInfo);
    await page.goto('/');
    await book(page, { lab });
    await expect(page.getByRole('status')).toBeVisible();
    await page.getByRole('button', { name: 'Book' }).click();
    await expect(page.getByRole('alert')).toHaveText('This slot is already taken. Choose another time.');
  });
});

test('a booking by an shows up in the admin list', async ({ browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const student = await browser.newContext({ storageState: 'playwright/.auth/an.json' });
  const admin = await browser.newContext({ storageState: 'playwright/.auth/boss.json' });
  const studentPage = await student.newPage();
  await studentPage.goto('/');
  await book(studentPage, { lab, date: '2026-11-20', start: '13:00', end: '15:00' });
  await expect(studentPage.getByRole('status')).toBeVisible();

  const adminPage = await admin.newPage();
  await adminPage.goto('/');
  const row = adminPage.getByRole('row', { name: new RegExp(lab) });
  await expect(row).toContainText('2026-11-20');
  await expect(row).toContainText('13:00–15:00');
  await student.close();
  await admin.close();
});
