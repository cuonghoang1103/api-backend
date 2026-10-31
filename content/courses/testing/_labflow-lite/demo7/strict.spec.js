import { test, expect } from '@playwright/test';
import { signIn } from '../e2e/helpers.js';

test('RED ON PURPOSE — getByLabel matches part of a name by default', async ({ page }) => {
  await signIn(page, 'an');
  await page.getByLabel('Lab').fill('BE-305');
});

test('exact: true matches the whole label', async ({ page }) => {
  await signIn(page, 'an');
  await page.getByLabel('Lab', { exact: true }).fill('BE-305');
  await expect(page.getByRole('textbox', { name: 'Lab', exact: true })).toHaveValue('BE-305');
});
