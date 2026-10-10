/**
 * CT Work đợt 8a — phần thuần của khung OAuth + adapter (không DB, không mạng):
 *   npx tsx --test src/services/work/oauth/oauth.test.ts
 */

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { describe, it } from 'node:test';
import { openToken, parseState, pkcePair, sealToken, signState, stateSignatureOk, tokenAad } from './crypto.js';
import { getProvider, listProviders, providerConfigured, redirectUri, registerProvider } from './registry.js';
import { registerBuiltinProviders } from './providers.js';
import { _setOAuthFetchForTests, oauthFetch, providerError } from './http.js';
import { safeReturnTo } from './connections.js';
import { colName, googlePreviewUrl, gParse, msParse, safeCell } from '../cloud/adapters.js';
import { eventHash, readSettings } from '../cloud/calendarSync.js';

registerBuiltinProviders();

describe('mã hoá token', () => {
  it('seal/open khứ hồi; AAD khác (người khác / nhà cung cấp khác) ⇒ null; sửa một byte ⇒ null', () => {
    const t = sealToken('ya29.secret-token', tokenAad('google', 7));
    assert.ok(t.startsWith('o1.') && !t.includes('secret'));
    assert.equal(openToken(t, tokenAad('google', 7)), 'ya29.secret-token');
    assert.equal(openToken(t, tokenAad('google', 8)), null);
    assert.equal(openToken(t, tokenAad('microsoft', 7)), null);
    const raw = Buffer.from(t.slice(3), 'base64url');
    raw[raw.length - 1] ^= 1;
    assert.equal(openToken(`o1.${raw.toString('base64url')}`, tokenAad('google', 7)), null);
    assert.equal(openToken(null, 'x'), null);
    assert.notEqual(sealToken('a', 'x'), sealToken('a', 'x'), 'IV ngẫu nhiên');
  });
});

describe('state + PKCE', () => {
  it('chữ ký gắn nonce + userId + provider + hạn', () => {
    const exp = Math.floor(Date.now() / 1000) + 600;
    const s = signState('n'.repeat(32), 5, 'google', exp);
    const p = parseState(s)!;
    assert.ok(p);
    assert.equal(stateSignatureOk(p, 5, 'google'), true);
    assert.equal(stateSignatureOk(p, 6, 'google'), false);
    assert.equal(stateSignatureOk(p, 5, 'microsoft'), false);
    assert.equal(stateSignatureOk({ ...p, exp: exp + 1 }, 5, 'google'), false, 'kéo dài hạn ⇒ sai chữ ký');
    assert.equal(parseState('garbage'), null);
    assert.equal(parseState(`${s}x`), null);
  });
  it('challenge = base64url(sha256(verifier)), verifier 43–128 ký tự', () => {
    const { verifier, challenge } = pkcePair();
    assert.ok(verifier.length >= 43 && verifier.length <= 128);
    assert.equal(challenge, crypto.createHash('sha256').update(verifier).digest('base64url'));
  });
});

describe('sổ đăng ký nhà cung cấp', () => {
  it('Microsoft + Google dựng sẵn; scope + env đã chốt; redirect URI cố định', () => {
    assert.deepEqual(listProviders().map((p) => p.id).filter((x) => x === 'microsoft' || x === 'google').sort(), ['google', 'microsoft']);
    assert.deepEqual(getProvider('microsoft')!.env, { clientId: 'CTW_MS_CLIENT_ID', clientSecret: 'CTW_MS_CLIENT_SECRET' });
    assert.deepEqual(getProvider('google')!.env, { clientId: 'CTW_GOOGLE_CLIENT_ID', clientSecret: 'CTW_GOOGLE_CLIENT_SECRET' });
    assert.equal(getProvider('google')!.scopes.join(' '), 'openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets');
    const env = { ...process.env };
    process.env.NODE_ENV = 'production';
    delete process.env.CTW_OAUTH_REDIRECT_BASE;
    assert.equal(redirectUri('microsoft'), 'https://cuongthai.com/api/v1/work/integrations/microsoft/callback');
    assert.equal(redirectUri('notion'), 'https://cuongthai.com/api/v1/work/integrations/notion/callback');
    process.env.NODE_ENV = 'development'; process.env.PORT = '4000';
    assert.equal(redirectUri('google'), 'http://localhost:4000/api/v1/work/integrations/google/callback');
    for (const k of ['NODE_ENV', 'PORT'] as const) { if (env[k] === undefined) delete process.env[k]; else process.env[k] = env[k]; }
  });
  it('thiếu một trong hai biến ⇒ chưa cấu hình', () => {
    const d = getProvider('google')!;
    const a = process.env.CTW_GOOGLE_CLIENT_ID, b = process.env.CTW_GOOGLE_CLIENT_SECRET;
    process.env.CTW_GOOGLE_CLIENT_ID = 'x'; delete process.env.CTW_GOOGLE_CLIENT_SECRET;
    assert.equal(providerConfigured(d), false);
    process.env.CTW_GOOGLE_CLIENT_SECRET = 'y';
    assert.equal(providerConfigured(d), true);
    if (a === undefined) delete process.env.CTW_GOOGLE_CLIENT_ID; else process.env.CTW_GOOGLE_CLIENT_ID = a;
    if (b === undefined) delete process.env.CTW_GOOGLE_CLIENT_SECRET; else process.env.CTW_GOOGLE_CLIENT_SECRET = b;
  });
  it('id sai ⇒ ném; đăng ký thêm (kiểu 8b) được', () => {
    assert.throws(() => registerProvider({ ...getProvider('google')!, id: 'Bad Id' }));
    registerProvider({ ...getProvider('google')!, id: 'fake-x', label: 'Fake' });
    assert.ok(getProvider('fake-x'));
  });
});

describe('mạng + lỗi', () => {
  it('trong test, quên mock ⇒ ném (không gọi Internet)', async () => {
    const old = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    _setOAuthFetchForTests(null);
    await assert.rejects(() => oauthFetch('https://graph.microsoft.com/v1.0/me'), /real network call in test/);
    if (old === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = old;
  });
  it('đọc lỗi kiểu Graph / Google / OAuth', async () => {
    const g = await providerError(new Response(JSON.stringify({ error: { code: 'ErrorItemNotFound', message: 'Not  found' } }), { status: 404 }));
    assert.equal(g.status, 404); assert.equal(g.providerCode, 'ErrorItemNotFound'); assert.equal(g.message, 'Not found');
    const o = await providerError(new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'Token revoked' }), { status: 400 }));
    assert.equal(o.providerCode, 'invalid_grant'); assert.equal(o.message, 'Token revoked');
    const t = await providerError(new Response('<html>', { status: 502 }));
    assert.equal(t.message, 'HTTP 502');
  });
  it('returnTo chỉ nhận đường /work nội bộ', () => {
    assert.equal(safeReturnTo('/work/acme/WEB/meetings/3'), '/work/acme/WEB/meetings/3');
    for (const bad of ['https://evil.com', '//evil.com', '/work\\..\\x', '/admin', 42, undefined]) assert.equal(safeReturnTo(bad), '/work/connections');
  });
});

describe('adapter', () => {
  it('đọc giờ Graph (UTC) + sự kiện cả ngày bị lệch múi ⇒ làm tròn về nửa đêm', () => {
    assert.equal(msParse({ dateTime: '2026-10-12T04:30:00.0000000', timeZone: 'UTC' }, false)!.toISOString(), '2026-10-12T04:30:00.000Z');
    assert.equal(msParse({ dateTime: '2026-10-11T17:00:00.0000000', timeZone: 'UTC' }, true)!.toISOString(), '2026-10-12T00:00:00.000Z');
    assert.equal(msParse({ dateTime: '2026-10-12T00:00:00.0000000', timeZone: 'UTC' }, true)!.toISOString(), '2026-10-12T00:00:00.000Z');
    assert.equal(msParse(undefined, false), null);
  });
  it('đọc giờ Google (date / dateTime)', () => {
    assert.deepEqual(gParse({ date: '2026-10-12' }), { at: new Date('2026-10-12T00:00:00Z'), allDay: true });
    assert.equal(gParse({ dateTime: '2026-10-12T09:00:00+07:00' }).at!.toISOString(), '2026-10-12T02:00:00.000Z');
  });
  it('ô chặn công thức, tên cột A1, link xem trước Drive', () => {
    assert.equal(safeCell('=SUM(A1)'), "'=SUM(A1)"); assert.equal(safeCell('@x'), "'@x"); assert.equal(safeCell(3), 3); assert.equal(safeCell('ok'), 'ok');
    assert.equal(colName(0), 'A'); assert.equal(colName(25), 'Z'); assert.equal(colName(26), 'AA'); assert.equal(colName(51), 'AZ');
    assert.equal(googlePreviewUrl('abc', 'https://docs.google.com/spreadsheets/d/abc/edit#gid=0'), 'https://docs.google.com/spreadsheets/d/abc/preview');
    assert.equal(googlePreviewUrl('f1', 'https://drive.google.com/file/d/f1/view'), 'https://drive.google.com/file/d/f1/preview');
  });
  it('dấu sự kiện ổn định; đổi giờ ⇒ đổi dấu; cài đặt mặc định tắt', () => {
    const ev = { title: 'A', description: 'd', url: 'u', allDay: true, start: new Date('2026-10-12T00:00:00Z'), end: new Date('2026-10-13T00:00:00Z'), timezone: 'UTC', ctworkId: 'issue:1' };
    assert.equal(eventHash(ev), eventHash({ ...ev }));
    assert.notEqual(eventHash(ev), eventHash({ ...ev, start: new Date('2026-10-14T00:00:00Z') }));
    assert.deepEqual(readSettings(null), { enabled: false, calendarId: null, calendarName: null, syncIssues: true, syncMeetings: true });
    assert.equal(readSettings({ enabled: true, calendarId: 'primary', syncIssues: false }).syncIssues, false);
  });
});
