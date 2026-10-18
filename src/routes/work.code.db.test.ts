/**
 * Trang "Code" (18/10/2026): ghi hoạt động Git từ webhook (kể cả push KHÔNG nhắc mã thẻ, nhánh bị xoá), thông báo (gộp một
 * push = một thông báo mỗi người, không gửi người push, gửi lại không báo lại, tắt cá nhân), kênh chat, quyền trang Code
 * (thành viên được; vai CLIENT 403; người ngoài 404), proxy mã nguồn với fetch GIẢ (token không bao giờ lộ, trần 1 MB,
 * nhị phân, hạn mức).
 *   npx tsx --test src/routes/work.code.db.test.ts                       (chỉ hàm thuần)
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.code.db.test.ts        (+ HTTP + DB)
 * KHÔNG gọi GitHub thật: mọi lượt gọi đi qua __setGitFetchForTests.
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
import { extractGithubGit, extractGitlabGit, keyNumbers } from '../services/work/gitEvents.js';
import { __setGitFetchForTests, capPatches, cleanPath, cleanRef, looksBinary, repoMeta, safeGitlabBase } from '../services/work/gitSource.js';
import { gitMessage, prNumberOf } from '../services/work/code.service.js';
import { agentRouteAllowed, clientPortalRouteAllowed } from '../services/work/permissions.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wc${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const SHA = (n: number) => crypto.createHash('sha1').update(`${tag}-${n}`).digest('hex');

// ─── Hàm thuần ───────────────────────────────────────────────────

describe('CTW Code — rút sự kiện (hàm thuần)', () => {
  const now = new Date('2026-10-18T03:00:00Z');
  it('push KHÔNG nhắc mã thẻ vẫn là một sự kiện PUSH đủ commit + nhánh', () => {
    const x = extractGithubGit('push', {
      ref: 'refs/heads/main', before: SHA(1), after: SHA(2), sender: { login: 'longbh' }, pusher: { name: 'longbh', email: 'l@x.vn' },
      repository: { full_name: 'longbh2006/PRJ301_Project_NhaTro', pushed_at: 1760756400 }, compare: 'https://github.com/x/y/compare/a...b',
      commits: [{ id: SHA(3), message: 'Fix layout', author: { name: 'Long', username: 'longbh' }, url: 'u1', modified: ['a.jsp'] }, { id: SHA(2), message: 'Update README\n\nbody', author: { name: 'Long' }, url: 'u2' }],
      head_commit: { id: SHA(2), message: 'Update README', author: { name: 'Long' } },
    }, 'NT', now);
    assert.equal(x.events.length, 1);
    const e = x.events[0];
    assert.equal(e.kind, 'PUSH');
    assert.equal(e.commitCount, 2);
    assert.deepEqual(e.issueNumbers, []);
    assert.equal(e.ref, 'main');
    assert.equal(e.actorLogin, 'longbh');
    assert.equal(e.dedupeKey, `push:main:${SHA(2)}`);
    assert.equal(e.occurredAt.toISOString(), new Date(1760756400 * 1000).toISOString());
    assert.equal(x.branches[0].op, 'PUSH');
    assert.equal(x.branches[0].lastCommitTitle, 'Update README');
  });
  it('nhánh mới + nhánh bị xoá + tag bị bỏ qua', () => {
    const created = extractGithubGit('push', { ref: 'refs/heads/feature/nt-12-login', created: true, before: '0'.repeat(40), after: SHA(4), commits: [], sender: { login: 'a' }, repository: { full_name: 'o/r' } }, 'NT', now);
    assert.deepEqual(created.events.map((e) => e.kind), ['BRANCH_CREATED']);
    assert.deepEqual(created.events[0].issueNumbers, [12]);
    const deleted = extractGithubGit('push', { ref: 'refs/heads/old', deleted: true, before: SHA(5), after: '0'.repeat(40), commits: [], sender: { login: 'a' }, repository: { full_name: 'o/r' } }, 'NT', now);
    assert.deepEqual(deleted.events.map((e) => e.kind), ['BRANCH_DELETED']);
    assert.equal(deleted.branches[0].op, 'DELETE');
    assert.deepEqual(extractGithubGit('push', { ref: 'refs/tags/v1', after: SHA(6), commits: [] }, 'NT', now).events, []);
    assert.equal(extractGithubGit('delete', { ref_type: 'branch', ref: 'old', sender: { login: 'a' } }, 'NT', now).events[0].kind, 'BRANCH_DELETED');
    assert.deepEqual(extractGithubGit('delete', { ref_type: 'tag', ref: 'v1' }, 'NT', now).events, []);
  });
  it('PR: opened / merged / review_requested; synchronize chỉ cập nhật PR', () => {
    const pr = { number: 7, title: 'NT-3 Login', body: '', state: 'open', head: { ref: 'nt-3-login' }, base: { ref: 'main' }, user: { login: 'a' }, html_url: 'h', requested_reviewers: [{ login: 'b' }], created_at: '2026-10-18T01:00:00Z', updated_at: '2026-10-18T01:00:00Z' };
    const o = extractGithubGit('pull_request', { action: 'opened', pull_request: pr, sender: { login: 'a' }, repository: { full_name: 'o/r' } }, 'NT', now);
    assert.equal(o.events[0].kind, 'PR_OPENED');
    assert.deepEqual(o.events[0].issueNumbers, [3]);
    assert.deepEqual(o.pulls[0].reviewers, ['b']);
    const m = extractGithubGit('pull_request', { action: 'closed', pull_request: { ...pr, state: 'closed', merged: true, merged_at: '2026-10-18T02:00:00Z', merged_by: { login: 'lead' } }, sender: { login: 'lead' } }, 'NT', now);
    assert.equal(m.events[0].kind, 'PR_MERGED');
    assert.equal(m.events[0].actorLogin, 'lead');
    assert.equal(m.pulls[0].state, 'merged');
    const r = extractGithubGit('pull_request', { action: 'review_requested', requested_reviewer: { login: 'c' }, pull_request: pr, sender: { login: 'a' } }, 'NT', now);
    assert.equal(r.events[0].kind, 'REVIEW_REQUESTED');
    assert.equal((r.events[0].data as { reviewer?: string }).reviewer, 'c');
    const s = extractGithubGit('pull_request', { action: 'synchronize', pull_request: pr, sender: { login: 'a' } }, 'NT', now);
    assert.equal(s.events.length, 0);
    assert.equal(s.pulls.length, 1);
  });
  it('GitLab: push tạo nhánh + xoá nhánh + MR merge + reviewer mới', () => {
    const p = extractGitlabGit({ object_kind: 'push', ref: 'refs/heads/nt-9', before: '0'.repeat(40), after: SHA(7), total_commits_count: 1, user_username: 'u', project: { path_with_namespace: 'g/p', web_url: 'https://gitlab.com/g/p' }, commits: [{ id: SHA(7), message: 'x', author: { name: 'U', email: 'u@x' } }] }, 'NT', now);
    assert.deepEqual(p.events.map((e) => e.kind).sort(), ['BRANCH_CREATED', 'PUSH']);
    const d = extractGitlabGit({ object_kind: 'push', ref: 'refs/heads/nt-9', before: SHA(7), after: '0'.repeat(40), project: { path_with_namespace: 'g/p' } }, 'NT', now);
    assert.equal(d.events[0].kind, 'BRANCH_DELETED');
    const mr = extractGitlabGit({ object_kind: 'merge_request', user: { username: 'lead' }, project: { path_with_namespace: 'g/p' }, object_attributes: { iid: 4, title: 'NT-9 x', state: 'merged', action: 'merge', source_branch: 'nt-9', target_branch: 'main', updated_at: 't' } }, 'NT', now);
    assert.equal(mr.events[0].kind, 'PR_MERGED');
    const rv = extractGitlabGit({ object_kind: 'merge_request', user: { username: 'a' }, project: { path_with_namespace: 'g/p' }, changes: { reviewers: { previous: [{ username: 'x' }], current: [{ username: 'x' }, { username: 'y' }] } }, object_attributes: { iid: 4, title: 't', state: 'opened', action: 'update', updated_at: 't2' } }, 'NT', now);
    assert.deepEqual(rv.events.map((e) => [e.kind, (e.data as { reviewer?: string }).reviewer]), [['REVIEW_REQUESTED', 'y']]);
  });
  it('QA 18/10: liên kết javascript:/data: trong payload bị bỏ (chỉ http(s) được lưu)', () => {
    const x = extractGithubGit('push', { ref: 'refs/heads/main', before: SHA(1), after: SHA(2), compare: 'javascript:alert(1)', sender: { login: 'a' }, repository: { full_name: 'o/r' },
      commits: [{ id: SHA(2), message: 'x', url: 'javascript:alert(document.cookie)', author: { name: 'a' } }] }, 'NT', now);
    assert.equal(x.events[0].url, null);
    assert.equal(x.events[0].commits[0].url, null);
    const pr = extractGithubGit('pull_request', { action: 'opened', pull_request: { number: 3, title: 't', html_url: 'data:text/html,x', head: { ref: 'b' }, base: { ref: 'main' } }, sender: { login: 'a' } }, 'NT', now);
    assert.equal(pr.pulls[0].url, null);
    const gl = extractGitlabGit({ object_kind: 'push', ref: 'refs/heads/b', before: SHA(3), after: SHA(4), total_commits_count: 1, project: { path_with_namespace: 'g/p', web_url: 'javascript:alert(1)//' }, commits: [{ id: SHA(4), message: 'x', url: 'https://gitlab.com/g/p/-/commit/1' }] }, 'NT', now);
    assert.equal(gl.events[0].url, null);
    assert.equal(gl.events[0].commits[0].url, 'https://gitlab.com/g/p/-/commit/1');
  });
  it('mã thẻ, số PR, câu thông báo', () => {
    assert.deepEqual(keyNumbers('nt-12 and NT-3, XNT-4', 'NT'), [12, 3]);
    assert.equal(prNumberOf('o/r#12'), 12);
    assert.equal(prNumberOf('g/p!4'), 4);
    assert.equal(gitMessage({ kind: 'PUSH', ref: 'main', prNumber: null, title: 'Fix', commitCount: 3 }, 'Long'), 'Long pushed 3 commits to main: “Fix”');
    assert.equal(gitMessage({ kind: 'PR_MERGED', ref: null, prNumber: 7, title: 'Login', commitCount: 0 }, 'Lead'), 'Lead merged pull request #7: Login');
  });
});

describe('CTW Code — an toàn proxy mã nguồn (hàm thuần)', () => {
  it('đường dẫn / ref độc bị chặn', () => {
    assert.throws(() => cleanPath('../etc/passwd'));
    assert.throws(() => cleanPath('a/../../b'));
    assert.equal(cleanPath('/src/App.java/'), 'src/App.java');
    assert.throws(() => cleanRef('main;rm'));
    assert.throws(() => cleanRef('a..b'));
    assert.equal(cleanRef(''), null);
    assert.equal(cleanRef('feature/nt-12'), 'feature/nt-12');
  });
  it('GitLab tự host: chỉ https, không localhost / IP nội bộ', () => {
    assert.equal(safeGitlabBase('https://gitlab.fpt.edu.vn/g/p'), 'https://gitlab.fpt.edu.vn');
    assert.equal(safeGitlabBase('http://gitlab.com/g/p'), null);
    assert.equal(safeGitlabBase('https://localhost/g'), null);
    assert.equal(safeGitlabBase('https://10.0.0.5/g'), null);
    assert.equal(safeGitlabBase('https://[::1]/g'), null);
    // QA 18/10/2026: dấu chấm cuối, IP viết kiểu khác, userinfo.
    assert.equal(safeGitlabBase('https://localhost./g'), null);
    assert.equal(safeGitlabBase('https://git.internal./g'), null);
    assert.equal(safeGitlabBase('https://2130706433/g'), null);
    assert.equal(safeGitlabBase('https://0x7f.1/g'), null);
    assert.equal(safeGitlabBase('https://gitlab.com@127.0.0.1/g'), null);
    assert.equal(safeGitlabBase('https://user:pw@gitlab.example.com/g'), null);
    assert.equal(safeGitlabBase('https://[::ffff:127.0.0.1]/g'), null);
  });
  it('chuyển hướng KHÁC nguồn không được theo (SSRF + token không đi theo 302); cùng nguồn thì theo', async () => {
    const calls: Array<{ url: string; redirect?: string; token: string | null }> = [];
    const target = { provider: 'GITLAB' as const, repo: 'g/p', apiBase: 'https://gitlab.example.com/api/v4', webBase: 'https://gitlab.example.com', token: 'gia-lap-SECRET-khong-phai-token-that', projectId: 1 };
    __setGitFetchForTests(((url: string, init: { headers: Record<string, string>; redirect?: string }) => {
      calls.push({ url, redirect: init.redirect, token: init.headers['PRIVATE-TOKEN'] ?? null });
      if (url.includes('/projects/g%2Fp') && !url.includes('moved')) return Promise.resolve(new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/latest/meta-data/' } }));
      return Promise.resolve(new Response('{}', { status: 200 }));
    }) as never);
    try {
      await assert.rejects(() => repoMeta(target), (e: any) => e.statusCode === 502 && !String(e.message).includes('SECRET'));
      assert.equal(calls.length, 1, 'không gọi tới địa chỉ chuyển hướng');
      assert.equal(calls[0].redirect, 'manual');
      assert.ok(!calls.some((c) => c.url.includes('169.254')));
      // GitHub đổi tên repo: 301 trong CÙNG api.github.com ⇒ theo.
      calls.length = 0;
      __setGitFetchForTests(((url: string, init: { redirect?: string }) => {
        calls.push({ url, redirect: init.redirect, token: null });
        if (url.endsWith('/repos/old/name')) return Promise.resolve(new Response(null, { status: 301, headers: { location: 'https://api.github.com/repositories/42' } }));
        return Promise.resolve(new Response(JSON.stringify({ default_branch: 'dev', private: false }), { status: 200 }));
      }) as never);
      const m = await repoMeta({ provider: 'GITHUB', repo: 'old/name', apiBase: 'https://api.github.com', webBase: 'https://github.com', token: null, projectId: 2 });
      assert.equal(m.defaultBranch, 'dev');
      assert.deepEqual(calls.map((c) => c.url), ['https://api.github.com/repos/old/name', 'https://api.github.com/repositories/42']);
      // Thân không phải JSON ⇒ 502, không phải 500.
      __setGitFetchForTests((() => Promise.resolve(new Response('<html>maintenance</html>', { status: 200 }))) as never);
      await assert.rejects(() => repoMeta({ ...target, projectId: 3 }), (e: any) => e.statusCode === 502);
    } finally {
      __setGitFetchForTests(null);
    }
  });
  it('nhị phân + cắt patch', () => {
    assert.equal(looksBinary(Buffer.from([0x50, 0x4b, 0x00, 0x01]), 'a.txt'), true);
    assert.equal(looksBinary(Buffer.from('hello'), 'logo.png'), true);
    assert.equal(looksBinary(Buffer.from('class A {}'), 'A.java'), false);
    const big = 'x'.repeat(250_000);
    const r = capPatches([{ filename: 'a', previous: null, status: 'modified', additions: 1, deletions: 0, patch: big, truncated: false }, { filename: 'b', previous: null, status: 'modified', additions: 1, deletions: 0, patch: '+y', truncated: false }]);
    assert.equal(r.files[0].patch, null);
    assert.equal(r.files[1].patch, '+y');
    assert.equal(r.truncated, true);
  });
  it('quyền tuyến: khách cổng không gọi được /code; agent đọc hoạt động nhưng không xem mã', () => {
    assert.equal(clientPortalRouteAllowed('GET', '/code/activity'), false);
    assert.equal(clientPortalRouteAllowed('GET', '/code/source/tree'), false);
    assert.equal(agentRouteAllowed('GET', '/code/activity'), true);
    assert.equal(agentRouteAllowed('GET', '/code/issues/3'), true);
    assert.equal(agentRouteAllowed('GET', '/code/source/blob'), false);
    assert.equal(agentRouteAllowed('PUT', '/github/read-token'), false);
  });
});

// ─── HTTP + DB ───────────────────────────────────────────────────

describe('CTW Code — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, dev2: U, client: U, outsider: U;
  let pid = 0;
  let secret = '';
  let issueNum = 0;
  const TOKEN = `github_pat_${tag}_SECRETVALUE_0123456789`;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* không phải JSON */ }
    return { status: res.status, data: json.data, raw: json, text };
  }
  async function hook(event: string, payload: unknown) {
    const raw = Buffer.from(JSON.stringify(payload));
    const sig = `sha256=${crypto.createHmac('sha256', secret).update(raw).digest('hex')}`;
    const res = await fetch(`${base}/api/v1/work/github/webhook/${pid}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-GitHub-Event': event, 'X-Hub-Signature-256': sig }, body: new Uint8Array(raw) });
    return res.status;
  }
  const gitNotes = async (uid: number) =>
    (await prisma.socialNotification.findMany({ where: { receiverId: uid, type: 'WORK_ALERT' }, orderBy: { id: 'asc' } })).filter((n) => (n.payload as { git?: boolean } | null)?.git === true);
  async function settle(check: () => Promise<boolean>, ms = 4000) {
    const end = Date.now() + ms;
    while (Date.now() < end) { if (await check()) return true; await wait(100); }
    return check();
  }
  let n = 100;
  const push = (by: U, ref: string, msgs: string[], extra: Record<string, unknown> = {}) => {
    const before = SHA(n++);
    const commits = msgs.map((m) => ({ id: SHA(n++), message: m, author: { name: by.username, username: by.username, email: by.email }, url: `https://github.com/acme/shop/commit/${SHA(n)}`, timestamp: new Date().toISOString(), modified: ['README.md'] }));
    return {
      ref: `refs/heads/${ref}`, before, after: commits[commits.length - 1]?.id ?? SHA(n++), created: false, deleted: false, forced: false,
      sender: { login: by.username }, pusher: { name: by.username, email: by.email }, repository: { full_name: 'acme/shop' },
      commits, head_commit: commits[commits.length - 1] ?? null, compare: 'https://github.com/acme/shop/compare/x...y', ...extra,
    };
  };

  // fetch GIẢ cho GitHub API — ghi lại header để kiểm token; không bao giờ ra mạng.
  const seen: Array<{ url: string; auth: string | null }> = [];
  let remaining = 4999;
  function mockFetch(url: string, init: { headers: Record<string, string> }) {
    seen.push({ url, auth: init.headers.Authorization ?? null });
    const h = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'x-ratelimit-remaining': String(remaining), 'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 600) } });
    const u = new URL(url);
    if (u.pathname === '/repos/acme/shop') return Promise.resolve(h(200, { default_branch: 'main', private: true, html_url: 'https://github.com/acme/shop', description: 'Shop' }));
    if (u.pathname === '/repos/acme/shop/contents' || u.pathname === '/repos/acme/shop/contents/') {
      return Promise.resolve(h(200, [{ name: 'src', path: 'src', type: 'dir', size: 0 }, { name: 'README.md', path: 'README.md', type: 'file', size: 12 }, { name: 'big.sql', path: 'big.sql', type: 'file', size: 2_000_000 }, { name: 'logo.bin', path: 'logo.bin', type: 'file', size: 4 }]));
    }
    if (u.pathname === '/repos/acme/shop/contents/README.md') return Promise.resolve(h(200, { type: 'file', size: 12, encoding: 'base64', content: Buffer.from('# Shop\nhello').toString('base64') }));
    if (u.pathname === '/repos/acme/shop/contents/big.sql') return Promise.resolve(h(200, { type: 'file', size: 2_000_000, encoding: 'none', content: '' }));
    if (u.pathname === '/repos/acme/shop/contents/logo.bin') return Promise.resolve(h(200, { type: 'file', size: 4, encoding: 'base64', content: Buffer.from([0x89, 0x00, 0x01, 0x02]).toString('base64') }));
    if (u.pathname.startsWith('/repos/acme/shop/commits/')) {
      return Promise.resolve(h(200, { sha: SHA(1), html_url: 'c', commit: { message: 'NT fix', author: { name: 'x', email: 'x@y', date: '2026-10-18T00:00:00Z' } }, parents: [], stats: { additions: 1, deletions: 1 }, files: [{ filename: 'a.js', status: 'modified', additions: 1, deletions: 1, changes: 2, patch: '@@ -1 +1 @@\n-a\n+b' }] }));
    }
    if (u.pathname === '/repos/acme/shop/contents/denied') return Promise.resolve(h(401, { message: 'Bad credentials' }));
    return Promise.resolve(h(404, { message: 'Not Found' }));
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    __setGitFetchForTests(mockFetch as never);
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use('/api/v1/work/github/webhook', express.raw({ type: '*/*' }));
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, dev2, client, outsider] = await Promise.all(['lead', 'dev', 'dev2', 'client', 'outsider'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Code ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, dev2.email, client.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'GC', name: 'Code', template: 'BLANK' })).data.id;
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/members/${client.id}`, { role: 'CLIENT' })).status, 200);
    const cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    const typeId = cfg.issueTypes.find((t: any) => t.key === 'TASK').id;
    issueNum = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId, title: 'Login page', assigneeId: dev2.id })).data.number;
    const c = await call(lead, 'POST', `/projects/${pid}/github`, {});
    secret = c.data.secret;
    await call(lead, 'PATCH', `/projects/${pid}/github`, { repoFullName: 'acme/shop' });
  });

  after(async () => {
    __setGitFetchForTests(null);
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('push KHÔNG nhắc mã thẻ: lưu đủ sự kiện + nhánh; ADMIN nhận MỘT thông báo, người push không nhận', async () => {
    assert.equal(await hook('push', push(dev, 'main', ['Fix layout', 'Update README'])), 200);
    const ev = await prisma.workGitEvent.findMany({ where: { projectId: pid } });
    assert.equal(ev.length, 1);
    assert.equal(ev[0].kind, 'PUSH');
    assert.equal(ev[0].commitCount, 2);
    assert.deepEqual(ev[0].issueNumbers, []);
    assert.equal((await prisma.workDevActivity.count({ where: { projectId: pid } })), 0, 'panel cũ chỉ giữ thứ nhắc mã thẻ');
    const br = await prisma.workGitBranch.findFirst({ where: { projectId: pid, name: 'main' } });
    assert.equal(br?.lastCommitTitle, 'Update README');
    assert.ok(await settle(async () => (await gitNotes(lead.id)).length === 1));
    await wait(300);
    assert.equal((await gitNotes(lead.id)).length, 1);
    assert.equal((await gitNotes(dev.id)).length, 0, 'không gửi cho chính người push');
    assert.equal((await gitNotes(dev2.id)).length, 0, 'không nhắc thẻ của dev2');
    const p = (await gitNotes(lead.id))[0].payload as any;
    assert.match(p.message, /pushed 2 commits to main/);
    assert.match(p.url, /\/code\?tab=activity&event=\d+$/);
  });

  it('push 3 commit nhắc GC-n: người được giao + ADMIN mỗi người MỘT thông báo; gửi lại không ghi đôi, không báo lại', async () => {
    const payload = push(dev, `feature/gc-${issueNum}-login`, [`GC-${issueNum} form`, `GC-${issueNum} validate`, 'tidy']);
    const before2 = (await gitNotes(dev2.id)).length;
    const beforeLead = (await gitNotes(lead.id)).length;
    assert.equal(await hook('push', payload), 200);
    assert.ok(await settle(async () => (await gitNotes(dev2.id)).length === before2 + 1 && (await gitNotes(lead.id)).length === beforeLead + 1));
    assert.equal(await hook('push', payload), 200); // "Redeliver"
    await wait(500);
    assert.equal((await gitNotes(dev2.id)).length, before2 + 1);
    assert.equal((await gitNotes(lead.id)).length, beforeLead + 1);
    assert.equal(await prisma.workGitEvent.count({ where: { projectId: pid, kind: 'PUSH' } }), 2);
    // QA 18/10/2026: gửi lại KHÔNG cộng commitCount của nhánh lần hai.
    assert.equal((await prisma.workGitBranch.findFirst({ where: { projectId: pid, name: `feature/gc-${issueNum}-login` } }))?.commitCount, 3);
    const ev = await prisma.workGitEvent.findFirst({ where: { projectId: pid, ref: `feature/gc-${issueNum}-login` } });
    assert.deepEqual(ev?.issueNumbers, [issueNum]);
  });

  it('QA 18/10: chữ ký webhook GitHub SAI ⇒ 401, không ghi sự kiện nào', async () => {
    const n0 = await prisma.workGitEvent.count({ where: { projectId: pid } });
    const raw = Buffer.from(JSON.stringify(push(dev, 'main', ['forged'])));
    const bad = `sha256=${crypto.createHmac('sha256', 'not-the-secret').update(raw).digest('hex')}`;
    for (const headers of [{ 'X-Hub-Signature-256': bad }, {}] as Array<Record<string, string>>) {
      const r = await fetch(`${base}/api/v1/work/github/webhook/${pid}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-GitHub-Event': 'push', ...headers }, body: new Uint8Array(raw) });
      assert.equal(r.status, 401);
    }
    assert.equal(await prisma.workGitEvent.count({ where: { projectId: pid } }), n0);
  });

  it('QA 18/10: GitLab — token sai 401; gốc web GHIM ở webhook đầu (webhook sau không kéo được token sang host khác)', async () => {
    const c = await call(lead, 'POST', `/projects/${pid}/gitlab`, {});
    assert.ok(c.status === 200 || c.status === 201, c.text);
    const glToken = c.data.token as string;
    const gl = async (tok: string, webUrl: string) => (await fetch(`${base}/api/v1/work/gitlab/webhook/${pid}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Gitlab-Token': tok },
      body: JSON.stringify({ object_kind: 'push', ref: 'refs/heads/gl-main', before: SHA(900), after: SHA(901), total_commits_count: 1, user_username: dev.username,
        project: { path_with_namespace: 'grp/app', web_url: webUrl }, commits: [{ id: SHA(901), message: 'gl', author: { name: 'd', email: 'd@x' } }] }),
    })).status;
    assert.equal(await gl('wrong-token', 'https://gitlab.example.com/grp/app'), 401);
    assert.equal(await gl(glToken, 'https://gitlab.example.com/grp/app'), 200);
    assert.equal(((await prisma.workGitlabConnection.findUnique({ where: { projectId: pid } }))?.config as any)?.webBase, 'https://gitlab.example.com');
    assert.equal(await gl(glToken, 'https://attacker.example.net/grp/app'), 200);
    assert.equal(((await prisma.workGitlabConnection.findUnique({ where: { projectId: pid } }))?.config as any)?.webBase, 'https://gitlab.example.com', 'webhook sau không được đổi host');
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/gitlab`)).status, 200);
  });

  it('nhánh bị xoá: push(deleted) + sự kiện delete chỉ ghi MỘT dòng; nhánh đánh dấu đã xoá', async () => {
    const b = await prisma.workGitBranch.findFirst({ where: { projectId: pid, name: 'main' } });
    assert.equal(await hook('push', { ref: 'refs/heads/main', deleted: true, before: b!.headSha, after: '0'.repeat(40), commits: [], sender: { login: dev.username }, pusher: { name: dev.username }, repository: { full_name: 'acme/shop' } }), 200);
    assert.equal(await hook('delete', { ref: 'main', ref_type: 'branch', sender: { login: dev.username }, repository: { full_name: 'acme/shop' } }), 200);
    assert.equal(await prisma.workGitEvent.count({ where: { projectId: pid, kind: 'BRANCH_DELETED' } }), 1);
    assert.ok((await prisma.workGitBranch.findFirst({ where: { projectId: pid, name: 'main' } }))?.deletedAt);
  });

  it('PR mở (reviewer) + merge ⇒ tab Pull request; panel Development nhóm commit theo PR', async () => {
    const pr = { number: 5, title: `GC-${issueNum} Login page`, body: '', state: 'open', draft: false, head: { ref: `feature/gc-${issueNum}-login` }, base: { ref: 'develop' }, user: { login: dev.username }, html_url: 'https://github.com/acme/shop/pull/5', requested_reviewers: [{ login: lead.username }], created_at: new Date().toISOString(), updated_at: new Date().toISOString(), additions: 40, deletions: 3, changed_files: 4 };
    assert.equal(await hook('pull_request', { action: 'opened', pull_request: pr, sender: { login: dev.username }, repository: { full_name: 'acme/shop' } }), 200);
    const pulls = await call(dev, 'GET', `/projects/${pid}/code/pulls?state=open`);
    assert.equal(pulls.status, 200);
    assert.equal(pulls.data.items[0].number, 5);
    assert.equal(pulls.data.items[0].reviewers[0].user.id, lead.id);
    assert.equal(pulls.data.items[0].author.user.id, dev.id);
    const devp = await call(dev, 'GET', `/projects/${pid}/code/issues/${issueNum}`);
    assert.equal(devp.status, 200);
    const g = devp.data.groups.find((x: any) => x.kind === 'PR');
    assert.equal(g.number, 5);
    assert.equal(g.commits.length, 3, 'commit của nhánh nguồn nằm dưới PR');
    const merged = { ...pr, state: 'closed', merged: true, merged_at: new Date().toISOString(), merged_by: { login: lead.username }, updated_at: new Date(Date.now() + 1000).toISOString() };
    assert.equal(await hook('pull_request', { action: 'closed', pull_request: merged, sender: { login: lead.username }, repository: { full_name: 'acme/shop' } }), 200);
    const all = await call(dev, 'GET', `/projects/${pid}/code/pulls?state=merged`);
    assert.equal(all.data.items[0].state, 'merged');
    // dev2 (được giao thẻ) nhận thông báo PR merge; lead (người merge) không nhận chính hành động của mình.
    assert.ok(await settle(async () => (await gitNotes(dev2.id)).some((x) => (x.payload as any).gitKind === 'PR_MERGED')));
    assert.equal((await gitNotes(lead.id)).some((x) => (x.payload as any).gitKind === 'PR_MERGED'), false);
  });

  it('quyền trang Code: thành viên 200; vai CLIENT 403; người ngoài 404; không đăng nhập 401', async () => {
    for (const path of ['/code/overview', '/code/activity', '/code/branches', '/code/pulls', `/code/issues/${issueNum}`, '/code/status']) {
      assert.equal((await call(dev, 'GET', `/projects/${pid}${path}`)).status, 200, path);
      assert.equal((await call(client, 'GET', `/projects/${pid}${path}`)).status, 403, `client ${path}`);
      assert.equal((await call(outsider, 'GET', `/projects/${pid}${path}`)).status, 404, `outsider ${path}`);
    }
    assert.equal((await call(null, 'GET', `/projects/${pid}/code/activity`)).status, 401);
    // Cài đặt chỉ ADMIN.
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/github/read-token`, { token: TOKEN })).status, 403);
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/github/activity`, { notify: false })).status, 403);
  });

  it('dòng thời gian: push không mã thẻ có mặt; lọc người / nhánh / loại', async () => {
    const all = await call(lead, 'GET', `/projects/${pid}/code/activity`);
    assert.equal(all.status, 200);
    assert.ok(all.data.items.some((i: any) => i.kind === 'PUSH' && i.ref === 'main' && i.issueNumbers.length === 0));
    assert.ok(all.data.items.find((i: any) => i.kind === 'PUSH').actor.user.id === dev.id);
    const byDev = await call(lead, 'GET', `/projects/${pid}/code/activity?actor=u:${dev.id}`);
    assert.ok(byDev.data.items.length >= 2);
    const branch = await call(lead, 'GET', `/projects/${pid}/code/activity?branch=main`);
    assert.ok(branch.data.items.every((i: any) => i.ref === 'main'));
    const prs = await call(lead, 'GET', `/projects/${pid}/code/activity?kind=pr`);
    assert.ok(prs.data.items.length >= 2 && prs.data.items.every((i: any) => i.kind.startsWith('PR_') || i.kind === 'REVIEW_REQUESTED'));
    assert.ok(all.data.filters.actors.some((a: any) => a.value === `u:${dev.id}`));
    assert.ok(!all.text.includes(dev.email), 'không lộ email');
  });

  it('kênh chat + tắt cá nhân: một dòng vào kênh đã chọn; dev2 tắt Git ⇒ không nhận', async () => {
    const ch = (await call(lead, 'GET', `/projects/${pid}/chat/channels`)).data.channels.find((c: any) => c.isGeneral);
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/github/activity`, { chatChannelId: ch.id })).status, 200);
    assert.equal((await call(dev2, 'PUT', '/me/notify-settings', { push: { git: false } })).status, 200);
    const before2 = (await gitNotes(dev2.id)).length;
    assert.equal(await hook('push', push(dev, `feature/gc-${issueNum}-login`, [`GC-${issueNum} more`])), 200);
    assert.ok(await settle(async () => (await prisma.workChannelMessage.count({ where: { channelId: ch.id, kind: 'SYSTEM', body: { contains: 'pushed 1 commit' } } })) === 1));
    await wait(300);
    assert.equal((await gitNotes(dev2.id)).length, before2, 'đã tắt ⇒ không nhận');
    await call(dev2, 'PUT', '/me/notify-settings', { push: { git: true } });
    // Kênh khách không được chọn.
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/github/activity`, { chatChannelId: 999999 })).status, 400);
  });

  it('token chỉ đọc: lưu MÃ HOÁ, không bao giờ trả về; proxy gửi token tới GitHub (giả) và không lộ trong phản hồi', async () => {
    const r = await call(lead, 'PUT', `/projects/${pid}/github/read-token`, { token: TOKEN });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.data.hasReadToken, true);
    assert.equal(r.data.verified, true);
    const row = await prisma.workGithubConnection.findUnique({ where: { projectId: pid } });
    assert.ok(row?.readToken?.startsWith('o1.'));
    assert.ok(!row!.readToken!.includes(TOKEN));
    const conn = await call(lead, 'GET', `/projects/${pid}/github`);
    assert.equal(conn.data.hasReadToken, true);
    assert.ok(!conn.text.includes(TOKEN));
    assert.ok(!conn.text.includes('readToken'));

    const tree = await call(dev, 'GET', `/projects/${pid}/code/source/tree`);
    assert.equal(tree.status, 200, tree.text);
    assert.equal(tree.data.ref, 'main');
    assert.deepEqual(tree.data.entries.map((e: any) => e.name), ['src', 'big.sql', 'logo.bin', 'README.md']);
    assert.ok(seen.some((s) => s.url.includes('/contents') && s.auth === `Bearer ${TOKEN}`), 'token đi kèm lượt gọi GitHub');
    assert.ok(!tree.text.includes(TOKEN));
    const blob = await call(dev, 'GET', `/projects/${pid}/code/source/blob?path=README.md`);
    assert.equal(blob.data.content, '# Shop\nhello');
    const big = await call(dev, 'GET', `/projects/${pid}/code/source/blob?path=big.sql`);
    assert.equal(big.data.tooLarge, true);
    assert.equal(big.data.content, null);
    const bin = await call(dev, 'GET', `/projects/${pid}/code/source/blob?path=logo.bin`);
    assert.equal(bin.data.binary, true);
    const cm = await call(dev, 'GET', `/projects/${pid}/code/source/commit/${SHA(1)}`);
    assert.equal(cm.status, 200);
    assert.equal(cm.data.files[0].patch, '@@ -1 +1 @@\n-a\n+b');
    const bad = await call(dev, 'GET', `/projects/${pid}/code/source/blob?path=denied`);
    assert.equal(bad.status, 400);
    assert.ok(!bad.text.includes(TOKEN), 'lỗi 401 không lộ token');
    // Khách / người ngoài không xem mã.
    assert.equal((await call(client, 'GET', `/projects/${pid}/code/source/tree`)).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/code/source/tree`)).status, 404);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/code/source/blob?path=../x`)).status, 400);
  });

  it('hạn mức: GitHub báo hết lượt ⇒ 429 và KHÔNG gọi tiếp tới giờ reset; đệm không gọi lại', async () => {
    const n0 = seen.length;
    await call(dev, 'GET', `/projects/${pid}/code/source/blob?path=README.md`); // đã đệm
    assert.equal(seen.length, n0, 'đệm');
    remaining = 0;
    const r1 = await call(dev, 'GET', `/projects/${pid}/code/source/commits?ref=main`);
    assert.equal(r1.status, 404); // lượt này vẫn đi (chưa biết hết) — mock trả 404 cho /commits
    const n1 = seen.length;
    const r2 = await call(dev, 'GET', `/projects/${pid}/code/source/tree?path=src`);
    assert.equal(r2.status, 429);
    assert.equal(seen.length, n1, 'không gọi khi đã hết lượt');
    remaining = 4999;
    __setGitFetchForTests(mockFetch as never);
  });

  it('MCP dev_activity (chỉ đọc): thành viên đọc được dự án + thẻ, bọc nội dung không tin cậy; khách bị chặn', async () => {
    const { commandByName } = await import('../services/work/toolRegistry/index.js');
    const tool = commandByName('dev_activity')!;
    assert.equal(tool.write, false);
    const ctx = (uid: number) => ({ userId: uid, agent: null, scopes: ['read'] as never, tokenId: 0, signal: new AbortController().signal });
    const out = String(await tool.run(ctx(dev.id), { project: 'GC' }));
    assert.match(out, /untrusted="true"/);
    assert.match(out, /"kind": "PUSH"/);
    const one = String(await tool.run(ctx(dev.id), { project: 'GC', issue: `GC-${issueNum}` }));
    assert.match(one, /"kind": "PR"/);
    await assert.rejects(() => tool.run(ctx(client.id), { project: 'GC' }), (e: any) => e.statusCode === 403 || e.status === 403);
    assert.equal(commandByName('source_view'), undefined, 'không có tool xem mã nguồn trên MCP');
  });

  it('xoá token ⇒ hasReadToken false; gửi thử: chuông cho người bấm + dòng thử vào kênh', async () => {
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/github/read-token`, { token: null })).data.hasReadToken, false);
    assert.equal((await prisma.workGithubConnection.findUnique({ where: { projectId: pid } }))?.readToken, null);
    const t = await call(lead, 'POST', `/projects/${pid}/github/test`, {});
    assert.equal(t.status, 200, t.text);
    assert.equal(t.data.bellSent, true);
    assert.equal(t.data.chat.posted, true);
    assert.ok(await settle(async () => (await gitNotes(lead.id)).some((x) => (x.payload as any).test === true)));
  });
});
