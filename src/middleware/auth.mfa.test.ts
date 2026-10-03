/**
 * `requireAdmin` (lõi `taoRequireAdmin`) trả 403 MFA_REQUIRED đúng điều kiện —
 * user giả lập, JWT thật ký bằng `config.jwtSecret`.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { config } from '../config/env.js';
import { taoRequireAdmin } from './auth.js';

function userGia(o: { admin?: boolean; mfaEnabled?: boolean; mfaEnabledAt?: Date | null } = {}) {
  return {
    enabled: true,
    accountNonLocked: true,
    roleVersion: 0n,
    mfaEnabled: o.mfaEnabled ?? false,
    mfaEnabledAt: o.mfaEnabledAt ?? null,
    roles: [{ role: { name: o.admin === false ? 'ROLE_USER' : 'ROLE_ADMIN' } }],
  };
}

async function chay(user: ReturnType<typeof userGia>, claims: Record<string, unknown> = {}) {
  const token = jwt.sign({ userId: 7, username: 'a', email: 'a@x', roles: ['ROLE_ADMIN'], roleVersion: 0, ...claims }, config.jwtSecret, { expiresIn: '1h' });
  const req = { headers: { authorization: `Bearer ${token}` }, cookies: {}, query: {} } as unknown as Request;
  const mw = taoRequireAdmin('ROLE_ADMIN', async () => user);
  return new Promise<{ status?: number; code?: string } | null>((resolve) => {
    void mw(req, {} as Response, (err?: unknown) => {
      if (!err) return resolve(null);
      const e = err as { statusCode?: number; code?: string };
      resolve({ status: e.statusCode, code: e.code });
    });
  });
}

const nowSec = () => Math.floor(Date.now() / 1000);

test('admin CHƯA bật MFA ⇒ qua như cũ (opt-in)', async () => {
  delete process.env.ADMIN_MFA_ENFORCE;
  assert.equal(await chay(userGia()), null);
});

test('admin ĐÃ bật MFA, token không có mfaAt ⇒ 403 MFA_REQUIRED', async () => {
  assert.deepEqual(await chay(userGia({ mfaEnabled: true, mfaEnabledAt: new Date(Date.now() - 3600_000) })), { status: 403, code: 'MFA_REQUIRED' });
});

test('admin ĐÃ bật MFA, mfaAt còn hạn ⇒ qua', async () => {
  assert.equal(await chay(userGia({ mfaEnabled: true, mfaEnabledAt: new Date(Date.now() - 3600_000) }), { mfaAt: nowSec() - 60 }), null);
});

test('mfaAt quá TTL ⇒ MFA_REQUIRED', async () => {
  process.env.ADMIN_MFA_TTL_HOURS = '1';
  try {
    assert.deepEqual(
      await chay(userGia({ mfaEnabled: true, mfaEnabledAt: new Date(Date.now() - 5 * 3600_000) }), { mfaAt: nowSec() - 2 * 3600 }),
      { status: 403, code: 'MFA_REQUIRED' },
    );
  } finally {
    delete process.env.ADMIN_MFA_TTL_HOURS;
  }
});

test('mfaAt có trước lần bật MFA (đã tắt-bật lại) ⇒ MFA_REQUIRED', async () => {
  assert.deepEqual(
    await chay(userGia({ mfaEnabled: true, mfaEnabledAt: new Date(Date.now() - 60_000) }), { mfaAt: nowSec() - 3600 }),
    { status: 403, code: 'MFA_REQUIRED' },
  );
});

test('ADMIN_MFA_ENFORCE=true, admin chưa bật ⇒ 403 MFA_SETUP_REQUIRED', async () => {
  process.env.ADMIN_MFA_ENFORCE = 'true';
  try {
    assert.deepEqual(await chay(userGia()), { status: 403, code: 'MFA_SETUP_REQUIRED' });
  } finally {
    delete process.env.ADMIN_MFA_ENFORCE;
  }
});

test('không phải admin ⇒ 403 FORBIDDEN (không lộ chuyện MFA)', async () => {
  assert.deepEqual(await chay(userGia({ admin: false, mfaEnabled: true })), { status: 403, code: 'FORBIDDEN' });
});
