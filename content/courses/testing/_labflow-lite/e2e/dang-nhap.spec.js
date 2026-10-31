// Signing in and out (Lab 7). These tests start signed out on purpose.
import { test, expect } from '@playwright/test';
import { signIn, PASSWORD } from './helpers.js';

test('a wrong password is refused with an alert', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username', { exact: true }).fill('an');
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD + '!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Wrong username or password.');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('a session survives a reload; signing out ends it', async ({ page }) => {
  await signIn(page, 'an');
  await expect(page.getByText('Signed in as an (STUDENT)')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Book a lab' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('an admin sees the list, not the form', async ({ page }) => {
  await signIn(page, 'boss');
  await expect(page.getByRole('heading', { name: 'All bookings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Book' })).toHaveCount(0);
});
