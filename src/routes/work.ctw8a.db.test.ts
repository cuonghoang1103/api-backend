/**
 * CT Work đợt 8a — kết nối Microsoft 365 / Google, qua HTTP thật trên Postgres cục bộ, nhà cung cấp GIẢ (không gọi
 * Microsoft/Google thật — mọi lời gọi đi qua _setOAuthFetchForTests):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw8a.db.test.ts
 *
 *   1. Khung OAuth: thiếu env ⇒ configured:false + start 409 (không 500) · state sai/giả/hết hạn/đã dùng/khác trình
 *      duyệt ⇒ 400 · PKCE (máy chủ giả kiểm sha256(verifier) = challenge) · token mã hoá trong DB · refresh khi hết hạn ·
 *      refresh hỏng ⇒ ERROR + 409 RECONNECT · agent không dùng được.
 *   2. Lịch hai chiều (Google + Microsoft): đẩy khi tạo/sửa/xoá · đồng bộ lại KHÔNG gọi API thừa · sửa bên lịch ⇒ hạn thẻ /
 *      giờ họp đổi, không đẩy ngược (không lặp) · xung đột: bản mới nhất thắng · xoá bên lịch ⇒ tách, không xoá thẻ.
 *   3. Teams / Google Meet điền link Join (Meet không tạo sự kiện trùng).
 *   4. Tệp Drive gắn thẻ + quyền + xem trước. 5. Sheets: xuất, đồng bộ lại (chỉ chủ), một chiều.
 *   6. Ngắt kết nối ⇒ thu hồi + xoá token + liên kết.
 */

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c8a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

// ─── Nhà cung cấp giả ────────────────────────────────────────────

interface FakeEvent { id: string; cal: string; start: string; end: string; allDay: boolean; updated: string; deleted: boolean; seq: number; ctworkId: string | null; summary: string; conference?: string }

class FakeCloud {
  calls: Array<{ method: string; url: string; body: string }> = [];
  challenges = new Map<string, string>(); // provider → code_challenge
  access = new Map<string, string>(); // provider → access token hợp lệ
  refresh = new Map<string, string>();
  revoked: string[] = [];
  events = new Map<string, FakeEvent>();
  seq = 0;
  n = 0;
  files = new Map<string, Record<string, unknown>>();
  sheets = new Map<string, unknown[][]>();
  refreshCount = 0;

  json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }); }
  count(method: string, re: RegExp) { return this.calls.filter((c) => c.method === method && re.test(c.url)).length; }
  bump(e: FakeEvent) { e.seq = ++this.seq; }
  moveEvent(id: string, start: string, end: string, updated: Date) {
    const e = this.events.get(id)!;
    Object.assign(e, { start, end, updated: updated.toISOString() });
    this.bump(e);
  }

  fetch = async (url: string, init: RequestInit = {}): Promise<Response> => {
    const method = (init.method ?? 'GET').toUpperCase();
    const body = typeof init.body === 'string' ? init.body : init.body instanceof Uint8Array ? `<${init.body.length} bytes>` : '';
    this.calls.push({ method, url, body });
    const u = new URL(url);
    const auth = (init.headers as Record<string, string> | undefined)?.Authorization ?? '';
    const prov = u.hostname.includes('microsoft') ? 'microsoft' : 'google';

    // Token endpoint
    if (url === 'https://oauth2.googleapis.com/token' || url === 'https://login.microsoftonline.com/common/oauth2/v2.0/token') {
      const f = new URLSearchParams(body);
      if (f.get('grant_type') === 'authorization_code') {
        if (f.get('code') !== `code-${prov}`) return this.json({ error: 'invalid_grant' }, 400);
        const want = this.challenges.get(prov);
        const got = crypto.createHash('sha256').update(f.get('code_verifier') ?? '').digest('base64url');
        if (!want || want !== got) return this.json({ error: 'invalid_grant', error_description: 'PKCE verification failed' }, 400);
        const at = `${prov}-at-${++this.n}`; const rt = `${prov}-rt-${this.n}`;
        this.access.set(prov, at); this.refresh.set(prov, rt);
        return this.json({ access_token: at, refresh_token: rt, expires_in: 3600, scope: 'openid email' });
      }
      if (f.get('grant_type') === 'refresh_token') {
        if (f.get('refresh_token') !== this.refresh.get(prov)) return this.json({ error: 'invalid_grant' }, 400);
        this.refreshCount++;
        const at = `${prov}-at-${++this.n}`;
        this.access.set(prov, at);
        const rotate = prov === 'microsoft' ? { refresh_token: `${prov}-rt-${this.n}` } : {};
        if (rotate.refresh_token) this.refresh.set(prov, rotate.refresh_token);
        return this.json({ access_token: at, expires_in: 3600, ...rotate });
      }
      return this.json({ error: 'unsupported_grant_type' }, 400);
    }
    if (url === 'https://oauth2.googleapis.com/revoke') { this.revoked.push(new URLSearchParams(body).get('token') ?? ''); return new Response('', { status: 200 }); }

    // Mọi API khác cần Bearer hợp lệ
    if (auth !== `Bearer ${this.access.get(prov)}`) return this.json({ error: { code: 'InvalidAuthenticationToken', message: 'expired' } }, 401);

    if (url.startsWith('https://openidconnect.googleapis.com/v1/userinfo')) return this.json({ sub: 'g-sub-1', email: 'owner@gmail.test', name: 'Owner G' });
    if (url.startsWith('https://graph.microsoft.com/v1.0/me?')) return this.json({ id: 'ms-id-1', mail: 'owner@outlook.test', displayName: 'Owner MS' });
    if (url === 'https://graph.microsoft.com/v1.0/me/onlineMeetings') return this.json({ joinWebUrl: 'https://teams.microsoft.com/l/meetup-join/fake' }, 201);

    // Google Calendar
    const g = /^https:\/\/www\.googleapis\.com\/calendar\/v3\/(?:calendars\/([^/]+)\/events(?:\/([^/?]+))?|users\/me\/calendarList)/.exec(url);
    if (g) {
      if (!g[1]) return this.json({ error: { code: 403, message: 'Insufficient Permission' } }, 403);
      const cal = decodeURIComponent(g[1]);
      const id = g[2] ? decodeURIComponent(g[2]) : null;
      if (method === 'POST') {
        const b = JSON.parse(body);
        const e: FakeEvent = {
          id: `gev${++this.n}`, cal, allDay: !!b.start.date, start: b.start.date ?? b.start.dateTime, end: b.end.date ?? b.end.dateTime,
          updated: new Date().toISOString(), deleted: false, seq: 0, ctworkId: b.extendedProperties?.private?.ctworkId ?? null, summary: b.summary,
          conference: b.conferenceData ? 'https://meet.google.com/abc-defg-hij' : undefined,
        };
        this.bump(e); this.events.set(e.id, e);
        return this.json({ id: e.id, updated: e.updated, ...(e.conference ? { hangoutLink: e.conference } : {}) });
      }
      if (id && method === 'PATCH') {
        const e = this.events.get(id); if (!e || e.deleted) return this.json({ error: { code: 404, message: 'Not Found' } }, 404);
        const b = JSON.parse(body);
        Object.assign(e, { start: b.start.date ?? b.start.dateTime, end: b.end.date ?? b.end.dateTime, summary: b.summary, updated: new Date().toISOString() });
        this.bump(e);
        return this.json({ id, updated: e.updated });
      }
      if (id && method === 'DELETE') { const e = this.events.get(id); if (e) { e.deleted = true; this.bump(e); } return new Response(null, { status: 204 }); }
      if (method === 'GET') {
        const token = u.searchParams.get('syncToken');
        const since = token ? Number(token.slice(1)) : -1;
        const items = [...this.events.values()].filter((e) => e.cal === cal && e.seq > since && !e.id.startsWith('ms')).map((e) => ({
          id: e.id, status: e.deleted ? 'cancelled' : 'confirmed', updated: e.updated,
          start: e.allDay ? { date: e.start } : { dateTime: e.start }, end: e.allDay ? { date: e.end } : { dateTime: e.end },
          extendedProperties: e.ctworkId ? { private: { ctworkId: e.ctworkId } } : undefined,
        }));
        return this.json({ items, nextSyncToken: `s${this.seq}` });
      }
    }

    // Graph Calendar
    if (url === 'https://graph.microsoft.com/v1.0/me/calendar/events' && method === 'POST') {
      const b = JSON.parse(body);
      const e: FakeEvent = { id: `msev${++this.n}`, cal: 'primary', allDay: b.isAllDay, start: b.start.dateTime, end: b.end.dateTime, updated: new Date().toISOString(), deleted: false, seq: 0, ctworkId: b.singleValueExtendedProperties?.[0]?.value ?? null, summary: b.subject };
      this.bump(e); this.events.set(e.id, e);
      return this.json({ id: e.id, lastModifiedDateTime: e.updated }, 201);
    }
    const me = /^https:\/\/graph\.microsoft\.com\/v1\.0\/me\/events\/([^/?]+)$/.exec(url);
    if (me) {
      const e = this.events.get(decodeURIComponent(me[1]));
      if (!e) return this.json({ error: { code: 'ErrorItemNotFound', message: 'not found' } }, 404);
      if (method === 'DELETE') { e.deleted = true; this.bump(e); return new Response(null, { status: 204 }); }
      const b = JSON.parse(body);
      Object.assign(e, { start: b.start.dateTime, end: b.end.dateTime, summary: b.subject, updated: new Date().toISOString() });
      this.bump(e);
      return this.json({ id: e.id, lastModifiedDateTime: e.updated });
    }
    if (url.startsWith('https://graph.microsoft.com/v1.0/me/calendar/calendarView/delta') || url.startsWith('https://graph.microsoft.com/v1.0/fake-delta')) {
      const since = url.startsWith('https://graph.microsoft.com/v1.0/fake-delta') ? Number(u.searchParams.get('s')) : -1;
      const value = [...this.events.values()].filter((e) => e.id.startsWith('ms') && e.seq > since).map((e) => (e.deleted ? { id: e.id, '@removed': { reason: 'deleted' } } : {
        id: e.id, isAllDay: e.allDay, lastModifiedDateTime: e.updated, start: { dateTime: `${e.start}.0000000`, timeZone: 'UTC' }, end: { dateTime: `${e.end}.0000000`, timeZone: 'UTC' },
      }));
      return this.json({ value, '@odata.deltaLink': `https://graph.microsoft.com/v1.0/fake-delta?s=${this.seq}` });
    }

    // Drive + Sheets
    const df = /^https:\/\/www\.googleapis\.com\/drive\/v3\/files\/([^/?]+)/.exec(url);
    if (df) {
      const f = this.files.get(decodeURIComponent(df[1]));
      return f ? this.json(f) : this.json({ error: { code: 404, message: 'File not found' } }, 404);
    }
    if (url === 'https://sheets.googleapis.com/v4/spreadsheets' && method === 'POST') {
      const sid = `sheet${++this.n}`;
      this.sheets.set(sid, []);
      return this.json({ spreadsheetId: sid, spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sid}/edit` });
    }
    const sv = /^https:\/\/sheets\.googleapis\.com\/v4\/spreadsheets\/([^/]+)\/values\/([^?]+)/.exec(url);
    if (sv) {
      const sid = decodeURIComponent(sv[1]);
      if (!this.sheets.has(sid)) return this.json({ error: { code: 404, message: 'Requested entity was not found.' } }, 404);
      if (sv[2].endsWith(':clear')) { this.sheets.set(sid, []); return this.json({}); }
      this.sheets.set(sid, JSON.parse(body).values);
      return this.json({ updatedRows: JSON.parse(body).values.length });
    }
    return this.json({ error: { code: 404, message: `fake: no route ${method} ${url}` } }, 404);
  };
}

describe('CT Work — đợt 8a: Microsoft 365 / Google (HTTP + DB thật, nhà cung cấp giả)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, member: U, viewer: U, outsider: U;
  let wsId = 0, pid = 0;
  const fake = new FakeCloud();

  function sign(u: { id: number; username: string; email: string }) {
    return jwt.sign({ userId: u.id, username: u.username, email: u.email, roles: [], roleVersion: 0 }, config.jwtSecret);
  }
  async function mkUser(name: string, kind = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name, kind } });
    userIds.push(u.id);
    return { id: u.id, token: sign(u), email, username: u.username };
  }
  async function call(u: U | null, method: string, p: string, body?: unknown, headers: Record<string, string> = {}) {
    const res = await fetch(`${base}/api/v1/work${p}`, {
      method, redirect: 'manual',
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { json = { text }; }
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, headers: res.headers, text };
  }
  const ok = (r: { status: number; raw: unknown }, status = 200) => assert.equal(r.status, status, JSON.stringify(r.raw).slice(0, 700));

  /** Đi trọn luồng kết nối: start (json) → đọc state + challenge → callback kèm cookie. */
  async function connect(u: U, prov: 'google' | 'microsoft') {
    const s = await call(u, 'GET', `/integrations/${prov}/start?format=json&returnTo=/work/connections`);
    ok(s);
    const authUrl = new URL(s.data.url);
    fake.challenges.set(prov, authUrl.searchParams.get('code_challenge')!);
    const cookie = /ctw_oauth=([^;]+)/.exec(s.headers.get('set-cookie') ?? '')?.[1];
    assert.ok(cookie, 'có cookie gắn trình duyệt');
    const state = authUrl.searchParams.get('state')!;
    const cb = await call(null, 'GET', `/integrations/${prov}/callback?state=${encodeURIComponent(state)}&code=code-${prov}`, undefined, { Cookie: `ctw_oauth=${cookie}` });
    assert.equal(cb.status, 302, cb.text.slice(0, 300));
    assert.match(cb.headers.get('location') ?? '', /\/work\/connections\?provider=\w+&connected=1/);
    return { state, cookie, authUrl };
  }
  const settle = () => new Promise((r) => setTimeout(r, 250));
  async function issueDue(num: number) {
    const i = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num } });
    return i.dueDate?.toISOString().slice(0, 10) ?? null;
  }

  before(async () => {
    process.env.CTW_GOOGLE_CLIENT_ID = '123456789-fake.apps.googleusercontent.com';
    process.env.CTW_GOOGLE_CLIENT_SECRET = 'fake-google-secret';
    process.env.CTW_MS_CLIENT_ID = 'fake-ms-client';
    process.env.CTW_MS_CLIENT_SECRET = 'fake-ms-secret';
    process.env.CTW_CAL_DEBOUNCE_MS = '0';
    (emailService as any).send = async () => ({ success: true });
    const oauth = await import('../services/work/oauth/index.js');
    oauth._setOAuthFetchForTests(fake.fetch);
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, member, viewer, outsider] = await Promise.all(['owner', 'member', 'viewer', 'outsider'].map((n) => mkUser(n)));
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW8a ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [member.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'CLD', name: 'Cloud Lab' });
    ok(p, 201);
    pid = p.data.id;
    if (!p.data.modules?.meetings) ok(await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { ...(p.data.modules ?? {}), meetings: true } }));
    for (const [u, r] of [[member, 'MEMBER'], [viewer, 'VIEWER']] as const) ok(await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role: r }));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/oauth/index.js'))._setOAuthFetchForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.workIssueCloudFile.deleteMany({ where: { projectId: pid } });
      await prisma.workCloudSheet.deleteMany({ where: { projectId: pid } });
      await prisma.workOAuthLog.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.workOAuthState.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } }); // kết nối + liên kết lịch xoá theo cascade
    }
    await prisma.$disconnect();
    await (await import('../config/redis.js')).closeRedis().catch(() => undefined);
  });

  // ─── 1. Khung OAuth ────────────────────────────────────────────

  describe('khung OAuth', () => {
    it('thiếu env ⇒ configured:false, start 409 INTEGRATION_NOT_CONFIGURED (không 500)', async () => {
      const saved = process.env.CTW_MS_CLIENT_SECRET;
      delete process.env.CTW_MS_CLIENT_SECRET;
      const l = await call(owner, 'GET', '/integrations');
      ok(l);
      assert.equal(l.data.providers.find((p: any) => p.id === 'microsoft').configured, false);
      assert.equal(l.data.providers.find((p: any) => p.id === 'google').configured, true);
      const s = await call(owner, 'GET', '/integrations/microsoft/start?format=json');
      assert.equal(s.status, 409); assert.equal(s.code, 'INTEGRATION_NOT_CONFIGURED');
      process.env.CTW_MS_CLIENT_SECRET = saved;
      assert.equal((await call(owner, 'GET', '/integrations/nope/start?format=json')).status, 404);
    });

    it('start: redirect URI cố định, scope đã chốt, PKCE S256, cookie httpOnly; không ?format ⇒ 302 sang nhà cung cấp', async () => {
      const s = await call(owner, 'GET', '/integrations/google/start?format=json');
      ok(s);
      const u = new URL(s.data.url);
      assert.equal(u.origin + u.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
      assert.match(u.searchParams.get('redirect_uri')!, /^http:\/\/localhost:\d+\/api\/v1\/work\/integrations\/google\/callback$/);
      assert.equal(u.searchParams.get('scope'), 'openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets');
      assert.equal(u.searchParams.get('code_challenge_method'), 'S256');
      assert.equal(u.searchParams.get('access_type'), 'offline');
      assert.match(s.headers.get('set-cookie') ?? '', /ctw_oauth=.*HttpOnly/i);
      const ms = await call(owner, 'GET', '/integrations/microsoft/start');
      assert.equal(ms.status, 302);
      const mu = new URL(ms.headers.get('location')!);
      assert.equal(mu.searchParams.get('scope'), 'openid profile email offline_access User.Read Calendars.ReadWrite OnlineMeetings.ReadWrite Files.ReadWrite');
      assert.match(mu.searchParams.get('redirect_uri')!, /\/api\/v1\/work\/integrations\/microsoft\/callback$/);
    });

    it('state sai / chữ ký giả / khác trình duyệt / hết hạn ⇒ 400 (không đổi token)', async () => {
      const before = fake.count('POST', /oauth2\.googleapis\.com\/token/);
      const bad = await call(null, 'GET', '/integrations/google/callback?state=garbage&code=code-google');
      assert.equal(bad.status, 400); assert.match(bad.text, /OAUTH_STATE_INVALID/);

      const s = await call(owner, 'GET', '/integrations/google/start?format=json');
      const state = new URL(s.data.url).searchParams.get('state')!;
      const cookie = /ctw_oauth=([^;]+)/.exec(s.headers.get('set-cookie')!)![1];
      const forged = state.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A'));
      assert.equal((await call(null, 'GET', `/integrations/google/callback?state=${forged}&code=code-google`, undefined, { Cookie: `ctw_oauth=${cookie}` })).status, 400);
      // state của Google đem sang callback Microsoft ⇒ 400
      assert.equal((await call(null, 'GET', `/integrations/microsoft/callback?state=${state}&code=code-microsoft`, undefined, { Cookie: `ctw_oauth=${cookie}` })).status, 400);
      const noCookie = await call(null, 'GET', `/integrations/google/callback?state=${state}&code=code-google`);
      assert.equal(noCookie.status, 400); assert.match(noCookie.text, /OAUTH_STATE_MISMATCH/);
      await prisma.workOAuthState.update({ where: { nonce: cookie }, data: { expiresAt: new Date(Date.now() - 1000) } });
      const exp = await call(null, 'GET', `/integrations/google/callback?state=${state}&code=code-google`, undefined, { Cookie: `ctw_oauth=${cookie}` });
      assert.equal(exp.status, 400); assert.match(exp.text, /OAUTH_STATE_EXPIRED/);
      assert.equal(fake.count('POST', /oauth2\.googleapis\.com\/token/), before, 'không đổi code khi state hỏng');
    });

    it('PKCE: verifier sai ⇒ máy chủ giả từ chối ⇒ quay về với error=failed, không lưu kết nối', async () => {
      const s = await call(owner, 'GET', '/integrations/google/start?format=json');
      const u = new URL(s.data.url);
      fake.challenges.set('google', 'not-the-real-challenge');
      const cookie = /ctw_oauth=([^;]+)/.exec(s.headers.get('set-cookie')!)![1];
      const cb = await call(null, 'GET', `/integrations/google/callback?state=${u.searchParams.get('state')}&code=code-google`, undefined, { Cookie: `ctw_oauth=${cookie}` });
      assert.equal(cb.status, 302);
      assert.match(cb.headers.get('location')!, /error=failed/);
      assert.equal(await prisma.workOAuthConnection.count({ where: { userId: owner.id } }), 0);
    });

    it('kết nối Google + Microsoft thành công; token MÃ HOÁ; state dùng lại ⇒ 400', async () => {
      const g = await connect(owner, 'google');
      await connect(owner, 'microsoft');
      const rows = await prisma.workOAuthConnection.findMany({ where: { userId: owner.id } });
      assert.equal(rows.length, 2);
      for (const r of rows) {
        assert.ok(r.accessTokenEnc?.startsWith('o1.'));
        assert.ok(!r.accessTokenEnc!.includes('-at-') && !r.refreshTokenEnc!.includes('-rt-'), 'không lưu token rõ');
      }
      const again = await call(null, 'GET', `/integrations/google/callback?state=${g.state}&code=code-google`, undefined, { Cookie: `ctw_oauth=${g.cookie}` });
      assert.equal(again.status, 400); assert.match(again.text, /OAUTH_STATE_USED/);
      const l = (await call(owner, 'GET', '/integrations')).data;
      const gp = l.providers.find((p: any) => p.id === 'google');
      assert.equal(gp.connection.accountEmail, 'owner@gmail.test');
      assert.equal(JSON.stringify(l).includes('-at-'), false, 'danh sách không lộ token');
      assert.ok(l.activity.some((a: any) => a.kind === 'connect'));
    });

    it('hết hạn ⇒ tự refresh (Microsoft xoay refresh token); refresh hỏng ⇒ ERROR + 409 RECONNECT', async () => {
      await prisma.workOAuthConnection.updateMany({ where: { userId: owner.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
      const before = fake.refreshCount;
      ok(await call(owner, 'GET', '/integrations/google/calendars'));
      assert.equal(fake.refreshCount, before + 1);
      // 401 giữa chừng (token bị thu hồi phía nhà cung cấp) ⇒ refresh + thử lại một lần.
      fake.access.set('google', 'rotated-elsewhere');
      fake.refresh.set('google', fake.refresh.get('google')!);
      const r = await call(owner, 'GET', '/integrations/google/calendars');
      ok(r);
      assert.deepEqual(r.data.items.map((c: any) => c.id), ['primary'], 'calendar.events không đọc được calendarList ⇒ primary');
      // refresh token bị thu hồi
      const savedRt = fake.refresh.get('google')!;
      fake.refresh.set('google', 'revoked');
      await prisma.workOAuthConnection.updateMany({ where: { userId: owner.id, provider: 'google' }, data: { expiresAt: new Date(Date.now() - 1000) } });
      const dead = await call(owner, 'GET', '/integrations/google/calendars');
      assert.equal(dead.status, 409); assert.equal(dead.code, 'INTEGRATION_RECONNECT');
      const row = await prisma.workOAuthConnection.findFirstOrThrow({ where: { userId: owner.id, provider: 'google' } });
      assert.equal(row.status, 'ERROR'); assert.ok(row.lastError);
      // hồi phục cho phần dưới
      fake.refresh.set('google', savedRt);
      ok(await call(owner, 'GET', '/integrations/google/calendars'));
      assert.equal((await prisma.workOAuthConnection.findFirstOrThrow({ where: { userId: owner.id, provider: 'google' } })).status, 'ACTIVE');
    });

    it('agent không dùng được kết nối (service + tuyến)', async () => {
      const bot = await mkUser('bot', 'AGENT');
      const { startAuthorization, liveConnection } = await import('../services/work/oauth/index.js');
      await assert.rejects(() => startAuthorization(bot.id, 'google'), { code: 'AGENT_NO_OAUTH' });
      await assert.rejects(() => liveConnection(bot.id, 'google'), { code: 'AGENT_NO_OAUTH' });
      const { agentRouteAllowed, agentTopRouteAllowed } = await import('../services/work/permissions.js');
      assert.equal(agentTopRouteAllowed('GET', '/integrations'), false);
      assert.equal(agentRouteAllowed('POST', '/cloud/issues/1/files'), false);
    });
  });

  // ─── 2. Lịch hai chiều ─────────────────────────────────────────

  describe('lịch hai chiều', () => {
    let num = 0;
    let eventId = '';
    it('bật đồng bộ Google ⇒ thẻ có hạn được giao đẩy lên (extendedProperties.ctworkId), sửa ⇒ PATCH, đồng bộ lại ⇒ KHÔNG gọi thừa', async () => {
      const i = await call(owner, 'POST', `/projects/${pid}/issues`, { title: 'Write SRS', typeKey: 'TASK', assigneeId: owner.id, dueDate: '2026-11-20' });
      ok(i, 201);
      num = i.data.number;
      ok(await call(owner, 'PUT', '/integrations/google/calendar', { enabled: true, calendarId: 'primary', calendarName: 'Primary' }));
      const link = await prisma.workCalendarLink.findFirstOrThrow({ where: { entityType: 'ISSUE', entityId: i.data.id, connection: { provider: 'google' } } });
      eventId = link.eventId;
      const ev = fake.events.get(eventId)!;
      assert.equal(ev.ctworkId, `issue:${i.data.id}`);
      assert.equal(ev.start, '2026-11-20'); assert.equal(ev.end, '2026-11-21'); assert.equal(ev.allDay, true);

      ok(await call(owner, 'PATCH', `/projects/${pid}/issues/${num}`, { title: 'Write SRS v2' }));
      await settle();
      assert.equal(fake.events.get(eventId)!.summary, `CLD-${num} Write SRS v2`);

      const writes = () => fake.count('POST', /calendar\/v3\/calendars/) + fake.count('PATCH', /calendar\/v3/) + fake.count('DELETE', /calendar\/v3/);
      const w0 = writes();
      ok(await call(owner, 'POST', '/integrations/google/sync'));
      ok(await call(owner, 'POST', '/integrations/google/sync'));
      assert.equal(writes(), w0, 'không có thay đổi ⇒ không ghi lên lịch');
    });

    it('sửa bên lịch ⇒ hạn thẻ đổi (có lịch sử), KHÔNG đẩy ngược (không vòng lặp)', async () => {
      const patches0 = fake.count('PATCH', /calendar\/v3/);
      fake.moveEvent(eventId, '2026-11-24', '2026-11-25', new Date(Date.now() + 60_000));
      const r = await call(owner, 'POST', '/integrations/google/sync');
      ok(r);
      assert.equal(r.data.pulled.applied, 1);
      assert.equal(await issueDue(num), '2026-11-24');
      await settle();
      ok(await call(owner, 'POST', '/integrations/google/sync'));
      assert.equal(fake.count('PATCH', /calendar\/v3/), patches0, 'không PATCH ngược sau khi kéo về');
      const hist = await prisma.workHistory.findMany({ where: { issue: { projectId: pid, number: num }, field: 'dueDate' } });
      assert.ok(hist.length >= 1, 'có lịch sử đổi hạn');
      const logs = await prisma.workOAuthLog.findMany({ where: { userId: owner.id, kind: 'pull' } });
      assert.ok(logs.some((l) => /moved in Google Calendar/.test(l.summary)));
    });

    it('xung đột: CT Work mới hơn ⇒ giữ CT Work và ghi đè lịch; lịch mới hơn ⇒ áp lịch', async () => {
      // Lịch sửa TRƯỚC (updated cũ), CT Work sửa SAU.
      fake.moveEvent(eventId, '2026-11-26', '2026-11-27', new Date(Date.now() - 3600_000));
      await prisma.workCalendarLink.updateMany({ where: { eventId }, data: { pushedAt: new Date(Date.now() - 7200_000) } });
      // Sửa thẳng DB (không qua bus) để mô phỏng "chưa kịp đẩy".
      await prisma.workIssue.updateMany({ where: { projectId: pid, number: num }, data: { dueDate: new Date('2026-11-28T00:00:00Z'), updatedAt: new Date() } });
      const r = await call(owner, 'POST', '/integrations/google/sync');
      ok(r);
      assert.equal(r.data.pulled.conflicts, 1);
      assert.equal(await issueDue(num), '2026-11-28');
      assert.equal(fake.events.get(eventId)!.start, '2026-11-28', 'lần đẩy ghi đè giờ của lịch');

      // Ngược lại: CT Work đổi lúc trước, lịch đổi SAU ⇒ lịch thắng.
      await prisma.workIssue.updateMany({ where: { projectId: pid, number: num }, data: { dueDate: new Date('2026-11-29T00:00:00Z'), updatedAt: new Date(Date.now() - 3600_000) } });
      fake.moveEvent(eventId, '2026-12-01', '2026-12-02', new Date(Date.now() + 60_000));
      const r2 = await call(owner, 'POST', '/integrations/google/sync');
      ok(r2);
      assert.equal(r2.data.pulled.conflicts, 1);
      assert.equal(await issueDue(num), '2026-12-01');
      const c = await prisma.workOAuthLog.findMany({ where: { userId: owner.id, kind: 'conflict' }, orderBy: { id: 'asc' } });
      assert.equal(c.length, 2);
      assert.match(c[0].summary, /CT Work edit is newer/); assert.match(c[1].summary, /calendar edit is newer/);
    });

    it('xoá bên lịch ⇒ thẻ giữ nguyên, liên kết tách, không tạo lại; bỏ giao ⇒ xoá sự kiện', async () => {
      const i2 = await call(owner, 'POST', `/projects/${pid}/issues`, { title: 'Prepare demo', typeKey: 'TASK', assigneeId: owner.id, dueDate: '2026-12-05' });
      ok(i2, 201);
      await settle();
      const l2 = await prisma.workCalendarLink.findFirstOrThrow({ where: { entityType: 'ISSUE', entityId: i2.data.id, connection: { provider: 'google' } } });
      const ev = fake.events.get(l2.eventId)!; ev.deleted = true; fake.bump(ev);
      const r = await call(owner, 'POST', '/integrations/google/sync');
      assert.equal(r.data.pulled.detached, 1);
      assert.equal((await prisma.workIssue.findFirstOrThrow({ where: { id: i2.data.id } })).deletedAt, null);
      const created = fake.count('POST', /calendar\/v3\/calendars/);
      ok(await call(owner, 'POST', '/integrations/google/sync'));
      assert.equal(fake.count('POST', /calendar\/v3\/calendars/), created, 'không tạo lại sự kiện đã bị xoá bên lịch');

      // Bỏ giao thẻ đầu ⇒ sự kiện bị xoá khỏi lịch.
      ok(await call(owner, 'PATCH', `/projects/${pid}/issues/${num}`, { assigneeId: member.id }));
      await settle();
      assert.equal(fake.events.get(eventId)!.deleted, true);
      assert.equal(await prisma.workCalendarLink.count({ where: { eventId } }), 0);
    });

    it('Microsoft: họp đẩy lên Outlook (Graph), dời giờ bên Outlook ⇒ giờ họp đổi + audit, không đẩy ngược', async () => {
      ok(await call(owner, 'PUT', '/integrations/microsoft/calendar', { enabled: true, calendarId: 'primary', calendarName: 'Calendar', syncIssues: false }));
      const start = new Date('2026-11-10T02:00:00Z');
      const m = await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Sprint planning', type: 'OTHER', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 3600_000).toISOString(), attendeeIds: [owner.id, member.id], sendInvites: false });
      ok(m, 201);
      await settle();
      const link = await prisma.workCalendarLink.findFirstOrThrow({ where: { entityType: 'MEETING', connection: { provider: 'microsoft' } } });
      const ev = fake.events.get(link.eventId)!;
      assert.equal(ev.start, '2026-11-10T02:00:00'); assert.equal(ev.ctworkId, `meeting:${link.entityId}`);
      const patches0 = fake.count('PATCH', /graph\.microsoft\.com\/v1\.0\/me\/events/);
      fake.moveEvent(link.eventId, '2026-11-10T04:00:00', '2026-11-10T05:30:00', new Date(Date.now() + 60_000));
      const r = await call(owner, 'POST', '/integrations/microsoft/sync');
      ok(r);
      assert.equal(r.data.pulled.applied, 1);
      const mm = await prisma.workMeeting.findFirstOrThrow({ where: { id: link.entityId } });
      assert.equal(mm.startsAt.toISOString(), '2026-11-10T04:00:00.000Z');
      assert.equal(mm.endsAt.toISOString(), '2026-11-10T05:30:00.000Z');
      await settle();
      ok(await call(owner, 'POST', '/integrations/microsoft/sync'));
      assert.equal(fake.count('PATCH', /graph\.microsoft\.com\/v1\.0\/me\/events/), patches0);
      assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'meeting.calendar_sync' } }));
    });
  });

  // ─── 3. Teams / Meet ───────────────────────────────────────────

  describe('phòng họp', () => {
    it('Teams điền joinWebUrl; Google Meet điền hangoutLink và nhận sự kiện làm liên kết (không trùng); viewer 403', async () => {
      const start = new Date('2026-11-12T03:00:00Z');
      const mk = async (title: string) => (await call(owner, 'POST', `/projects/${pid}/meetings`, { title, startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 1800_000).toISOString(), attendeeIds: [owner.id], sendInvites: false })).data;
      const t = await mk('Teams sync');
      const r = await call(owner, 'POST', `/projects/${pid}/cloud/meetings/${t.number}/online`, { provider: 'microsoft' });
      ok(r);
      assert.equal(r.data.meetingUrl, 'https://teams.microsoft.com/l/meetup-join/fake');
      assert.equal((await call(owner, 'POST', `/projects/${pid}/cloud/meetings/${t.number}/online`, { provider: 'google' })).status, 409, 'đã có link');

      const g = await mk('Meet sync');
      await settle();
      const before = await prisma.workCalendarLink.findFirst({ where: { entityType: 'MEETING', entityId: g.id, connection: { provider: 'google' } } });
      const r2 = await call(owner, 'POST', `/projects/${pid}/cloud/meetings/${g.number}/online`, { provider: 'google' });
      ok(r2);
      assert.equal(r2.data.meetingUrl, 'https://meet.google.com/abc-defg-hij');
      await settle();
      const links = await prisma.workCalendarLink.findMany({ where: { entityType: 'MEETING', entityId: g.id, connection: { provider: 'google' } } });
      assert.equal(links.length, 1);
      assert.ok(fake.events.get(links[0].eventId)!.conference, 'liên kết trỏ vào sự kiện có Meet');
      if (before) assert.equal(fake.events.get(before.eventId)!.deleted, true, 'sự kiện cũ (không Meet) bị gỡ — không trùng');
      const v = await mk('Viewer try');
      assert.equal((await call(viewer, 'POST', `/projects/${pid}/cloud/meetings/${v.number}/online`, { provider: 'google' })).status, 403);
    });
  });

  // ─── 4. Tệp ────────────────────────────────────────────────────

  describe('tệp Drive trên thẻ', () => {
    it('gắn tệp (tên, biểu tượng, người sửa cuối), xem trước nhúng, quyền', async () => {
      fake.files.set('fileA', { id: 'fileA', name: 'SRS v1.docx', mimeType: 'application/vnd.google-apps.document', iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/doc', webViewLink: 'https://docs.google.com/document/d/fileA/edit', modifiedTime: '2026-10-11T08:00:00Z', lastModifyingUser: { displayName: 'An Nguyen' } });
      const i = await call(owner, 'POST', `/projects/${pid}/issues`, { title: 'Docs', typeKey: 'TASK' });
      const n = i.data.number;
      const a = await call(owner, 'POST', `/projects/${pid}/cloud/issues/${n}/files`, { provider: 'google', fileId: 'fileA' });
      ok(a, 201);
      assert.equal(a.data.name, 'SRS v1.docx'); assert.equal(a.data.lastModifiedBy, 'An Nguyen'); assert.ok(a.data.iconUrl);
      const l = await call(viewer, 'GET', `/projects/${pid}/cloud/issues/${n}/files`);
      ok(l);
      assert.equal(l.data.items.length, 1); assert.equal(l.data.items[0].canRemove, false);
      const p = await call(viewer, 'GET', `/projects/${pid}/cloud/files/${a.data.id}/preview`);
      ok(p);
      assert.equal(p.data.url, 'https://docs.google.com/document/d/fileA/preview');
      assert.equal((await call(viewer, 'POST', `/projects/${pid}/cloud/issues/${n}/files`, { provider: 'google', fileId: 'fileA' })).status, 403);
      assert.equal((await call(outsider, 'GET', `/projects/${pid}/cloud/issues/${n}/files`)).status, 404);
      // member chưa kết nối ⇒ 409 rõ ràng
      const m = await call(member, 'POST', `/projects/${pid}/cloud/issues/${n}/files`, { provider: 'google', fileId: 'fileA' });
      assert.equal(m.status, 409); assert.equal(m.code, 'INTEGRATION_NOT_CONNECTED');
      assert.equal((await call(owner, 'POST', `/projects/${pid}/cloud/issues/${n}/files`, { provider: 'google', fileId: 'missing' })).status, 404);
      ok(await call(owner, 'DELETE', `/projects/${pid}/cloud/issues/${n}/files/${a.data.id}`));
    });
  });

  // ─── 5. Bảng tính ──────────────────────────────────────────────

  describe('Sheets (một chiều)', () => {
    it('xuất danh sách thẻ + báo cáo; đồng bộ lại ghi đè; chỉ chủ đồng bộ', async () => {
      const s = await call(owner, 'POST', `/projects/${pid}/cloud/sheets`, { provider: 'google', kind: 'issues', title: 'CLD issues' });
      ok(s, 201);
      const vals = fake.sheets.get(s.data.fileUrl.split('/d/')[1].split('/')[0])!;
      assert.equal(vals[0][0], 'Issue key');
      const n0 = vals.length;
      await call(owner, 'POST', `/projects/${pid}/issues`, { title: '=HYPERLINK("x")', typeKey: 'TASK' });
      const r = await call(owner, 'POST', `/projects/${pid}/cloud/sheets/${s.data.id}/sync`);
      ok(r);
      const vals2 = fake.sheets.get(s.data.fileUrl.split('/d/')[1].split('/')[0])!;
      assert.equal(vals2.length, n0 + 1);
      assert.ok(fake.calls.some((c) => c.url.includes('valueInputOption=RAW')), 'RAW — công thức là chữ');
      assert.equal((await call(member, 'POST', `/projects/${pid}/cloud/sheets/${s.data.id}/sync`)).status, 403);
      const rep = await call(owner, 'POST', `/projects/${pid}/cloud/sheets`, { provider: 'google', kind: 'report', title: 'CLD workload' });
      ok(rep, 201);
      const rv = fake.sheets.get(rep.data.fileUrl.split('/d/')[1].split('/')[0])!;
      assert.equal(rv[0][0], 'Assignee'); assert.equal(rv[rv.length - 1][0], 'Total');
      const list = await call(viewer, 'GET', `/projects/${pid}/cloud/sheets`);
      ok(list); assert.equal(list.data.items.length, 2);
      assert.equal((await call(viewer, 'POST', `/projects/${pid}/cloud/sheets`, { provider: 'google', kind: 'issues', title: 'x' })).status, 409, 'viewer chưa kết nối');
    });
  });

  // ─── 6. Ngắt kết nối ───────────────────────────────────────────

  describe('ngắt kết nối', () => {
    it('Google: thu hồi + xoá token + liên kết lịch; Microsoft: xoá token, trả link tự gỡ app', async () => {
      const conn = await prisma.workOAuthConnection.findFirstOrThrow({ where: { userId: owner.id, provider: 'google' } });
      assert.ok(await prisma.workCalendarLink.count({ where: { connectionId: conn.id } }) > 0);
      const d = await call(owner, 'DELETE', '/integrations/google?removeEvents=1');
      ok(d);
      assert.equal(d.data.revoked, true);
      assert.equal(fake.revoked.length, 1);
      assert.equal(await prisma.workOAuthConnection.count({ where: { id: conn.id } }), 0);
      assert.equal(await prisma.workCalendarLink.count({ where: { connectionId: conn.id } }), 0);
      const d2 = await call(owner, 'DELETE', '/integrations/microsoft');
      ok(d2);
      assert.equal(d2.data.revoked, false); assert.match(d2.data.manageUrl, /myaccount\.microsoft\.com/);
      assert.equal(await prisma.workOAuthConnection.count({ where: { userId: owner.id } }), 0);
      const g = await call(owner, 'GET', '/integrations/google/calendars');
      assert.equal(g.status, 409); assert.equal(g.code, 'INTEGRATION_NOT_CONNECTED');
    });
  });
});
