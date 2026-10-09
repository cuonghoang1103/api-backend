/**
 * CT Work giao diện song ngữ (10/10/2026) — lựa chọn ngôn ngữ THEO NGƯỜI DÙNG, lưu ở `users.preferences.work.locale`,
 * qua HTTP thật (GET/PATCH /api/v1/users/me/preferences) + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.i18n.db.test.ts
 *
 *   - Người mới: `work.locale = null` (chưa chọn ⇒ frontend theo site + hỏi lần đầu).
 *   - Chọn 'vi' ⇒ đọc lại 'vi' (máy khác — app desktop — đọc cùng chỗ).
 *   - Giá trị lạ ('fr', 42) bị bỏ qua, giữ lựa chọn cũ; `null` = bỏ chọn.
 *   - Lưu mục khác (ui / sound) KHÔNG xoá `work` (gộp theo mục) và ngược lại; `ui.locale` của site độc lập.
 *   - Mỗi người một lựa chọn: người B không bị ảnh hưởng bởi người A.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `i18n${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string };

describe('CT Work i18n — ngôn ngữ giao diện theo người dùng (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let a: U, b: U;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', fullName: `Full ${name}` } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret) };
  }
  async function call(u: U, method: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/users/me/preferences`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    return { status: res.status, json: JSON.parse(text), text };
  }
  const workLocale = async (u: U) => {
    const r = await call(u, 'GET');
    assert.equal(r.status, 200, r.text);
    return r.json.data.preferences.work.locale as string | null;
  };

  before(async () => {
    const { default: userRoutes } = await import('./user.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/users', userRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [a, b] = await Promise.all([mkUser('a'), mkUser('b')]);
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('người mới: chưa chọn (null)', async () => {
    assert.equal(await workLocale(a), null);
  });

  it('chọn vi ⇒ lưu DB, đọc lại vi; người khác không đổi', async () => {
    const r = await call(a, 'PATCH', { preferences: { work: { locale: 'vi' } } });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json.data.preferences.work.locale, 'vi');
    assert.equal(await workLocale(a), 'vi');
    const row = await prisma.user.findUnique({ where: { id: a.id }, select: { preferences: true } });
    assert.equal((row?.preferences as { work?: { locale?: string } })?.work?.locale, 'vi');
    assert.equal(await workLocale(b), null);
  });

  it('giá trị lạ bị bỏ qua, giữ lựa chọn cũ', async () => {
    for (const bad of ['fr', 42, 'VI', {}]) {
      const r = await call(a, 'PATCH', { preferences: { work: { locale: bad } } });
      assert.equal(r.status, 200, r.text);
    }
    assert.equal(await workLocale(a), 'vi');
    // Khoá lạ trong mục work không lọt vào DB.
    await call(a, 'PATCH', { preferences: { work: { locale: 'en', evil: 'x'.repeat(5000) } } });
    const row = await prisma.user.findUnique({ where: { id: a.id }, select: { preferences: true } });
    assert.deepEqual((row?.preferences as { work: unknown }).work, { locale: 'en' });
  });

  it('lưu mục khác không xoá work; ui.locale của site độc lập', async () => {
    await call(a, 'PATCH', { preferences: { work: { locale: 'vi' } } });
    const r = await call(a, 'PATCH', { preferences: { ui: { locale: 'en', reduceMotion: true }, sound: { volume: 0.3 } } });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json.data.preferences.work.locale, 'vi');
    assert.equal(r.json.data.preferences.ui.locale, 'en');
    const r2 = await call(a, 'PATCH', { preferences: { work: { locale: 'en' } } });
    assert.equal(r2.json.data.preferences.ui.reduceMotion, true, 'đổi work không đụng ui');
    assert.equal(r2.json.data.preferences.work.locale, 'en');
  });

  it('null = bỏ chọn (theo ngôn ngữ của site)', async () => {
    const r = await call(a, 'PATCH', { preferences: { work: { locale: null } } });
    assert.equal(r.status, 200, r.text);
    assert.equal(await workLocale(a), null);
  });
});
