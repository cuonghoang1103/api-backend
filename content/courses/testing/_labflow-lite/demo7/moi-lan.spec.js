import { test, expect } from '@playwright/test';
import { signIn, book, freshLab } from '../e2e/helpers.js';

// Six bookings, each test signs in through the form first.
for (let i = 1; i <= 6; i++) {
  test('sign in, then booking ' + i, async ({ page }, testInfo) => {
    await signIn(page, 'an');
    await book(page, { lab: freshLab(testInfo) });
    await expect(page.getByRole('status')).toContainText('Booked');
  });
}
