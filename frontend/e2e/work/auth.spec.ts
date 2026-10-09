/**
 * E2E — đăng ký + đăng nhập ở local rồi vào CT Work (/work).
 * Đăng ký bằng FORM thật; bước mở thư xác thực được thay bằng đánh dấu emailVerified trong CSDL cục bộ.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright';
import { BASE, PASSWORD, cleanup, launch, loginUi, newContext, prisma, shot, tag, trackUser, trackWorkspace } from './helpers';

describe('CT Work E2E — đăng ký / đăng nhập', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('đăng ký bằng form ⇒ trang nhập OTP; xác thực ⇒ đăng nhập form ⇒ /work tạo được không gian đầu tiên', async () => {
    const ctx = await newContext(browser);
    const page = await ctx.newPage();
    const username = `${tag}_signup`.slice(0, 50);
    const email = `${username}@e2e.local`;
    await page.goto('/register');
    // `next dev` lạnh: gõ trước khi React gắn xong thì state rỗng ⇒ nút còn disabled. Chờ mạng yên, gõ lại tới khi nút bật.
    const submit = page.getByRole('button', { name: 'Create Account' });
    for (let attempt = 0; attempt < 3 && !(await submit.isEnabled()); attempt++) {
      await page.waitForLoadState('networkidle', { timeout: 60_000 }).catch(() => undefined);
      await page.getByPlaceholder('cuonghoang').fill(username);
      await page.getByPlaceholder('you@example.com').fill(email);
      await page.getByPlaceholder('John Doe').fill('E2E Signup');
      await page.getByPlaceholder('Create a strong password').fill(PASSWORD);
      await page.getByPlaceholder('Re-enter your password').fill(PASSWORD);
      await page.waitForTimeout(500);
    }
    await submit.click();
    await page.waitForURL(/\/verify-otp/, { timeout: 60_000 });
    await shot(page, 'auth-verify-otp');

    const u = await prisma().user.update({ where: { email }, data: { emailVerified: true, emailVerifiedAt: new Date() }, select: { id: true } });
    trackUser(u.id); // dọn theo id

    await ctx.clearCookies();
    await loginUi(page, { id: u.id, username, email }, '/work');
    await page.goto('/work');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await shot(page, 'auth-work-home');
    // Phiên hợp lệ: API /work/workspaces qua proxy trả 200 bằng cookie trình duyệt.
    const res = await page.request.get(`${BASE}/api/v1/work/workspaces`);
    assert.equal(res.status(), 200);
    const ws = await page.request.post(`${BASE}/api/v1/work/workspaces`, { data: { name: `E2E ${tag}` } });
    assert.equal(ws.status(), 201);
    trackWorkspace((await ws.json()).data.id);
    await ctx.close();
  });

  it('sai mật khẩu ⇒ ở lại /login, không có phiên', async () => {
    const ctx = await newContext(browser);
    const page = await ctx.newPage();
    await page.goto('/login');
    await page.getByPlaceholder('Enter your username').fill(`${tag}_nobody`);
    await page.getByPlaceholder('Enter your password').fill('Wrong-Password-123!');
    await page.locator('form button[type="submit"]').click();
    await page.waitForTimeout(2500);
    assert.match(new URL(page.url()).pathname, /^\/login/);
    assert.equal((await page.request.get(`${BASE}/api/v1/work/workspaces`)).status(), 401);
    await ctx.close();
  });
});
