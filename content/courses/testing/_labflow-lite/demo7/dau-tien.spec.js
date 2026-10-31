import { test, expect } from '@playwright/test';

test('the sign-in page shows its form', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByLabel('Username')).toBeEditable();
});

test('a student signs in and books a lab', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('an');
  await page.getByLabel('Password').fill('labflow-demo');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Signed in as an (STUDENT)')).toBeVisible();

  await page.getByLabel('Date').fill('2026-11-16');
  await page.getByLabel('Start').fill('08:00');
  await page.getByLabel('End').fill('10:00');
  await page.getByLabel('Seats').fill('20');
  await page.getByRole('button', { name: 'Book' }).click();
  await expect(page.getByRole('status')).toHaveText('Booked. See you in BE-201.');
});

test('a wrong password is refused', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('an');
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Wrong username or password.');
});
