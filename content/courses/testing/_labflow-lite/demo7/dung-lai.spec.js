import { test, expect } from '@playwright/test';
import { book, freshLab } from '../e2e/helpers.js';

// The same six bookings, reusing the session saved by e2e/auth.setup.js.
test.use({ storageState: 'playwright/.auth/an.json' });

for (let i = 1; i <= 6; i++) {
  test('signed in already, booking ' + i, async ({ page }, testInfo) => {
    await page.goto('/');
    await book(page, { lab: freshLab(testInfo) });
    await expect(page.getByRole('status')).toContainText('Booked');
  });
}
