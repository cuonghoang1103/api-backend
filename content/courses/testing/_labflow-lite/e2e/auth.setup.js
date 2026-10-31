// Runs once before the browser tests: sign in through the real page and keep the session (lesson 7.2).
import { test as setup, expect } from '@playwright/test';
import { signIn } from './helpers.js';

for (const user of ['an', 'boss']) {
  setup('sign in as ' + user, async ({ page }) => {
    await signIn(page, user);
    await expect(page.getByText('Signed in as ' + user)).toBeVisible();
    await page.context().storageState({ path: 'playwright/.auth/' + user + '.json' });
  });
}
