/**
 * Tuyến đăng nhập app qua web (16/11/2026) — không CSDL, không Redis.
 *   npx tsx --test src/routes/auth.appDangNhap.routes.test.ts
 *  · /auth/app/tao-ma: không có chữ ký nội bộ ⇒ 401 (client ngoài không tự xin mã cho email tuỳ ý được);
 *  · /auth/app/doi-ma: mã bịa ⇒ 400 với MỘT câu chung, không 401 (401 làm app tưởng hết phiên).
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { randomBytes } from 'node:crypto';
import { after, test } from 'node:test';
import express from 'express';

process.env.NODE_ENV = 'test';
after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

async function dungApp() {
  const router = (await import('./auth.routes.js')).default;
  const { errorHandler } = await import('../middleware/errorHandler.js');
  const app = express();
  app.use(express.json());
  app.use('/api/v1/auth', router);
  app.use(errorHandler);
  const sv = app.listen(0);
  const goc = `http://127.0.0.1:${(sv.address() as { port: number }).port}/api/v1/auth`;
  return { sv, goc };
}

const post = (url: string, than: unknown, headers: Record<string, string> = {}) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(than) });

test('tao-ma không chữ ký nội bộ ⇒ 401, kể cả chữ ký bịa', async () => {
  const { sv, goc } = await dungApp();
  try {
    const than = {
      email: 'a@b.com', provider: 'google', providerId: '1', app: 'ctlanguage',
      trangThai: randomBytes(24).toString('base64url'), thu: randomBytes(32).toString('base64url'),
    };
    assert.equal((await post(`${goc}/app/tao-ma`, than)).status, 401);
    assert.equal((await post(`${goc}/app/tao-ma`, than, { 'x-cuongthai-noi-bo': 'a'.repeat(64) })).status, 401);
  } finally { sv.close(); }
});

test('doi-ma mã bịa ⇒ 400 APP_LOGIN_CODE_INVALID; thiếu trường ⇒ 422', async () => {
  const { sv, goc } = await dungApp();
  try {
    const r = await post(`${goc}/app/doi-ma`, {
      ma: randomBytes(32).toString('base64url'), app: 'ctlanguage',
      trangThai: randomBytes(24).toString('base64url'), maXacMinh: randomBytes(32).toString('base64url'),
    });
    assert.equal(r.status, 400);
    const j = await r.json() as { code?: string };
    assert.equal(j.code, 'APP_LOGIN_CODE_INVALID');
    assert.equal((await post(`${goc}/app/doi-ma`, { ma: 'x' })).status, 422); // validate() của repo trả 422
  } finally { sv.close(); }
});

// ─── Trọn vòng với CSDL thật (WORK_DB_TEST=1): tao-ma (chữ ký nội bộ) → doi-ma ⇒ AuthResponse; khoá ⇒ loi= ─
test('trọn vòng: tạo mã ⇒ đổi ra AuthResponse; tài khoản khoá ⇒ chuyển hướng loi=ACCOUNT_LOCKED', { skip: process.env.WORK_DB_TEST !== '1' }, async () => {
  const { chuKyNoiBo } = await import('../services/xacMinhOAuth.js');
  const { thuTuXacMinh } = await import('../services/maDangNhapApp.js');
  const { prisma } = await import('../config/database.js');
  const ky = chuKyNoiBo();
  assert.ok(ky, 'cần AUTH_SECRET trong .env');
  const email = `appdn_${Date.now()}@cuongthai-test.com`;
  const { sv, goc } = await dungApp();
  try {
    const tt = randomBytes(24).toString('base64url');
    const xm = randomBytes(32).toString('base64url');
    const r = await post(`${goc}/app/tao-ma`, {
      email, provider: 'github', providerId: `gh-${Date.now()}`, fullName: 'Thu App', app: 'ctlanguage', trangThai: tt, thu: thuTuXacMinh(xm),
    }, { 'x-cuongthai-noi-bo': ky! });
    assert.equal(r.status, 200);
    const ch = new URL(((await r.json()) as { data: { chuyenHuong: string } }).data.chuyenHuong);
    assert.equal(ch.protocol, 'ctlanguage:');
    assert.equal(ch.searchParams.get('trangThai'), tt);
    const ma = ch.searchParams.get('ma')!;
    const d = await post(`${goc}/app/doi-ma`, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm });
    assert.equal(d.status, 200);
    const phien = ((await d.json()) as { data: { token: string; refreshToken: string; email: string } }).data;
    assert.equal(phien.email, email);
    assert.ok(phien.token && phien.refreshToken);
    // Dùng lại ⇒ 400.
    assert.equal((await post(`${goc}/app/doi-ma`, { ma, app: 'ctlanguage', trangThai: tt, maXacMinh: xm })).status, 400);

    await prisma.user.update({ where: { email }, data: { accountNonLocked: false } });
    const r2 = await post(`${goc}/app/tao-ma`, {
      email, provider: 'github', providerId: 'x', app: 'ctlanguage', trangThai: tt, thu: thuTuXacMinh(xm),
    }, { 'x-cuongthai-noi-bo': ky! });
    const ch2 = new URL(((await r2.json()) as { data: { chuyenHuong: string } }).data.chuyenHuong);
    assert.equal(ch2.searchParams.get('loi'), 'ACCOUNT_LOCKED');
    assert.equal(ch2.searchParams.get('ma'), null);
  } finally {
    sv.close();
    const u = await prisma.user.findUnique({ where: { email } });
    if (u) {
      await prisma.userRole.deleteMany({ where: { userId: u.id } }).catch(() => {});
      await prisma.user.delete({ where: { id: u.id } }).catch(() => {});
    }
  }
});
