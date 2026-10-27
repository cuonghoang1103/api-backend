/**
 * CT Work 27/10/2026 — GitHub App: phần THUẦN (JWT, chữ ký webhook, state HMAC, manifest, review inline, mã hoá khoá).
 *   npx tsx --test src/services/work/githubApp.test.ts
 */

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { describe, it } from 'node:test';
import { appJwt, appManifest, ciStateOf, inlineComments, normalizePem, readAppState, signAppState, verifyAppJwt, webhookSignatureOk } from './githubAppRules.js';
import { openToken, sealToken } from './oauth/crypto.js';
import { agentRouteAllowed } from './permissions.js';

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs1', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });

describe('JWT RS256 của app', () => {
  it('ký bằng private key, kiểm được bằng public key; iss = App ID; sống < 10 phút; iat lùi 60 s', () => {
    const now = 1_800_000_000;
    const t = appJwt(12345, privateKey, now);
    const p = verifyAppJwt(t, publicKey)!;
    assert.equal(p.iss, '12345');
    assert.equal(p.iat, now - 60);
    assert.ok(p.exp - now <= 600 && p.exp > now, "exp ≤ 10 phút kể từ bây giờ");
    const other = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs1', format: 'pem' } });
    assert.equal(verifyAppJwt(t, other.publicKey), null, 'khoá khác ⇒ không qua');
    assert.equal(verifyAppJwt(`${t}x`, publicKey), null);
  });
  it('PEM dán vào env với "\\n" chữ vẫn dùng được', () => {
    const flat = privateKey.replace(/\n/g, '\\n');
    assert.equal(normalizePem(flat), privateKey);
    assert.ok(verifyAppJwt(appJwt(1, normalizePem(flat)), publicKey));
  });
});

describe('chữ ký webhook X-Hub-Signature-256', () => {
  const raw = Buffer.from('{"action":"opened"}');
  const sig = `sha256=${crypto.createHmac('sha256', 's3cret').update(raw).digest('hex')}`;
  it('đúng secret ⇒ qua; sai secret / sửa thân / thiếu header ⇒ không', () => {
    assert.equal(webhookSignatureOk('s3cret', raw, sig), true);
    assert.equal(webhookSignatureOk('other', raw, sig), false);
    assert.equal(webhookSignatureOk('s3cret', Buffer.from('{"action":"closed"}'), sig), false);
    assert.equal(webhookSignatureOk('s3cret', raw, undefined), false);
    assert.equal(webhookSignatureOk('', raw, sig), false, 'app chưa có secret ⇒ không bao giờ qua');
  });
});

describe('state HMAC (chống CSRF, có hạn)', () => {
  it('đọc lại được trong hạn; hết hạn / sửa / khác khoá ⇒ null', () => {
    const now = 1_800_000_000;
    const s = signAppState('k1', { k: 'install', p: 7, u: 3 }, 1800, now);
    assert.deepEqual({ ...readAppState<{ k: string; p: number; u: number }>('k1', s, now + 10)!, exp: 0, n: 0 }, { k: 'install', p: 7, u: 3, exp: 0, n: 0 });
    assert.equal(readAppState('k1', s, now + 1801), null, 'hết hạn');
    assert.equal(readAppState('k2', s, now), null, 'khác khoá');
    const [b, sig] = s.split('.');
    const forged = Buffer.from(JSON.stringify({ k: 'install', p: 8, u: 3, exp: now + 1800 })).toString('base64url');
    assert.equal(readAppState('k1', `${forged}.${sig}`, now), null, 'đổi dự án ⇒ chữ ký sai');
    assert.equal(readAppState('k1', b, now), null);
    assert.equal(readAppState('k1', null, now), null);
  });
});

describe('manifest + mã hoá khoá + quyền tuyến', () => {
  it('manifest: webhook/callback/setup đúng tên miền, quyền tối thiểu, OAuth khi cài, public', () => {
    const m = appManifest('https://cuongthai.com/');
    assert.equal(m.hook_attributes.url, 'https://cuongthai.com/api/v1/work/github/webhook/app');
    assert.equal(m.redirect_url, 'https://cuongthai.com/api/v1/work/github-app/manifest/callback');
    assert.deepEqual(m.callback_urls, ['https://cuongthai.com/api/v1/work/github-app/setup']);
    assert.equal(m.request_oauth_on_install, true);
    assert.equal(m.public, true);
    assert.deepEqual(m.default_permissions, { contents: 'read', metadata: 'read', pull_requests: 'write', checks: 'read', statuses: 'read' });
    for (const e of ['push', 'pull_request', 'pull_request_review', 'check_suite']) assert.ok(m.default_events.includes(e), e);
    assert.ok(m.name.length <= 34);
  });
  it('khoá app lưu mã hoá: đúng AAD mở được, AAD khác / sửa một ký tự ⇒ không', () => {
    const sealed = sealToken(JSON.stringify({ pem: privateKey, webhookSecret: 'w' }), 'github-app');
    assert.ok(!sealed.includes('PRIVATE KEY'));
    assert.match(openToken(sealed, 'github-app')!, /PRIVATE KEY/);
    assert.equal(openToken(sealed, 'gitread:GITHUB:1'), null);
    assert.equal(openToken(`${sealed.slice(0, -2)}xx`, 'github-app'), null);
  });
  it('agent không cài / gỡ / chọn repo của app', () => {
    for (const [m, p] of [['GET', '/github-app'], ['POST', '/github-app/link'], ['DELETE', '/github-app'], ['GET', '/github-app/repos']] as const) assert.equal(agentRouteAllowed(m, p), false, `${m} ${p}`);
  });
});

describe('review lên PR: inline CHỈ dòng có trong diff', () => {
  const files = [{ filename: 'src/A.java', patch: '@@ -1,2 +1,3 @@\n a\n+b\n c' }, { filename: 'src/B.java', patch: null }];
  const f = (file: string, line: number | null, severity = 'MAJOR') => ({ file, line, severity: severity as 'MAJOR', category: 'correctness' as const, message: 'm', suggestion: 's' });
  it('dòng trong hunk ⇒ inline (side RIGHT); ngoài hunk / không dòng / tệp không patch ⇒ thân review', () => {
    const r = inlineComments([f('src/A.java', 2), f('src/A.java', 9), f('src/A.java', null), f('src/B.java', 1)], files);
    assert.deepEqual(r.inline.map((x) => [x.path, x.line, x.side]), [['src/A.java', 2, 'RIGHT']]);
    assert.equal(r.rest.length, 3);
    assert.equal(inlineComments(Array.from({ length: 40 }, () => f('src/A.java', 1)), files).inline.length, 30, 'tối đa 30');
  });
  it('trạng thái CI gộp', () => {
    assert.equal(ciStateOf('completed', 'failure'), 'failure');
    assert.equal(ciStateOf('completed', 'success'), 'success');
    assert.equal(ciStateOf('in_progress', null), 'pending');
    assert.equal(ciStateOf('completed', 'skipped'), 'neutral');
  });
});
