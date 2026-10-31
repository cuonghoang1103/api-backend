import { test, expect } from '@playwright/test';
import { freshLab, PASSWORD } from '../e2e/helpers.js';

// Arrange through the API (fast, exact), then check through the page what a user sees.
test('a booking made through the API shows up in the admin list', async ({ request, browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const login = await request.post('/api/login', { data: { username: 'an', password: PASSWORD } });
  const { token } = await login.json();
  const created = await request.post('/api/bookings', {
    headers: { Authorization: 'Bearer ' + token },
    data: { lab, date: '2026-11-20', start: '13:00', end: '15:00', seats: 20 },
  });
  expect(created.status()).toBe(201);

  const admin = await browser.newContext({ storageState: 'playwright/.auth/boss.json' });
  const page = await admin.newPage();
  await page.goto('/');
  await expect(page.getByRole('row', { name: new RegExp(lab) })).toContainText('13:00–15:00');
  await admin.close();
});
