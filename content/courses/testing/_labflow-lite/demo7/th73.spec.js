import { test, expect } from '@playwright/test';
import { book, freshLab } from '../e2e/helpers.js';

// The two tests of du-lieu-chung.spec.js, each with a lab of its own.
test.use({ storageState: 'playwright/.auth/an.json' });

test('booking from the home page', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab });
  await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
});

test('booking shows the confirmation', async ({ page }, testInfo) => {
  const lab = freshLab(testInfo);
  await page.goto('/');
  await book(page, { lab });
  await expect(page.getByRole('status')).toContainText(lab);
});
