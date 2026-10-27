/**
 * CT Work 27/10/2026 — GitHub App (HTTP + DB, GitHub GIẢ): webhook chung định tuyến theo repo id, CI của PR, gỡ cài,
 * đọc mã bằng token cài đặt, state cài đặt / vé chọn repo, đăng review COMMENT với bình luận inline chỉ trên dòng có trong diff.
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.githubApp.db.test.ts
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
import { __setGitFetchForTests } from '../services/work/gitSource.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wg${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };
const WH = 'app-webhook-secret-123';
const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs1', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
const PATCH = '@@ -1,2 +1,3 @@\n a\n+b\n c';

describe('GitHub App — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let pid = 0;
  let issueNum = 0;
  const appCalls: Array<{ url: string; method?: string; body?: string; auth?: string }> = [];
  const gitAuth: string[] = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, redirect: 'manual', headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* không phải JSON */ }
    return { status: res.status, data: json.data, raw: json, location: res.headers.get('location') };
  }
  async function hook(event: string, payload: unknown, secret = WH) {
    const raw = Buffer.from(JSON.stringify(payload));
    const sig = `sha256=${crypto.createHmac('sha256', secret).update(raw).digest('hex')}`;
    return (await fetch(`${base}/api/v1/work/github/webhook/app`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-GitHub-Event': event, 'X-Hub-Signature-256': sig }, body: new Uint8Array(raw) })).status;
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    Object.assign(process.env, { GITHUB_APP_ID: '424242', GITHUB_APP_SLUG: 'ct-work-test', GITHUB_APP_PRIVATE_KEY: privateKey.replace(/\n/g, '\\n'), GITHUB_APP_WEBHOOK_SECRET: WH, GITHUB_APP_CLIENT_ID: 'Iv1.test', GITHUB_APP_CLIENT_SECRET: 'csecret' });
    const appSvc = await import('../services/work/githubApp.service.js');
    appSvc.__setAppFetchForTests((async (url: string, init: { method?: string; body?: string; headers: Record<string, string> }) => {
      appCalls.push({ url, method: init.method, body: init.body, auth: init.headers.Authorization });
      const h = (s: number, b: unknown) => new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } });
      if (url.endsWith('/app/installations/777/access_tokens')) return h(201, { token: 'ghs_install_token_abc', expires_at: new Date(Date.now() + 3600_000).toISOString() });
      if (url.endsWith('/installation/repositories?per_page=100')) return h(200, { repositories: [{ id: 9001, full_name: 'acme/nhatro', private: true, default_branch: 'main' }] });
      if (url.endsWith('/pulls/3/reviews')) return h(200, { html_url: 'https://github.com/acme/nhatro/pull/3#pullrequestreview-1' });
      if (url === 'https://github.com/login/oauth/access_token') return h(200, { access_token: 'ghu_user' });
      if (url.includes('/user/installations')) return h(200, { installations: [{ id: 777 }] });
      return h(404, { message: 'Not Found' });
    }) as never);
    __setGitFetchForTests(((url: string, init: { headers: Record<string, string> }) => {
      gitAuth.push(init.headers.Authorization ?? '');
      const h = (s: number, b: unknown) => Promise.resolve(new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } }));
      const u = new URL(url);
      if (u.pathname === '/repos/acme/nhatro') return h(200, { default_branch: 'main', private: true });
      if (u.pathname === '/repos/acme/nhatro/pulls/3') return h(200, { number: 3, title: 'NT login', state: 'open', head: { ref: 'f', sha: 'c'.repeat(40) }, base: { ref: 'main' }, user: { login: 'x' }, html_url: 'https://github.com/acme/nhatro/pull/3' });
      if (u.pathname === '/repos/acme/nhatro/pulls/3/files') return h(200, [{ filename: 'src/A.java', status: 'modified', additions: 1, deletions: 0, changes: 1, patch: PATCH }]);
      return h(404, {});
    }) as never);
    const { _setCodeReviewAskForTests } = await import('../services/work/codeReview.service.js');
    _setCodeReviewAskForTests(async () => JSON.stringify({ summary: 's', verdict: 'COMMENT', findings: [{ file: 'src/A.java', line: 2, severity: 'MAJOR', category: 'correctness', message: 'in diff' }, { file: 'src/A.java', line: 50, severity: 'MINOR', category: 'style', message: 'outside' }], acceptance: [] }));
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use('/api/v1/work/github/webhook', express.raw({ type: '*/*' }));
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev] = await Promise.all(['lead', 'dev'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `App ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'NT', name: 'Nhà trọ', template: 'BLANK' })).data.id;
    const cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    issueNum = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: cfg.issueTypes.find((t: any) => t.key === 'TASK').id, title: 'Login', assigneeId: dev.id })).data.number;
  });

  after(async () => {
    const appSvc = await import('../services/work/githubApp.service.js');
    appSvc.__setAppFetchForTests(null);
    __setGitFetchForTests(null);
    (await import('../services/work/codeReview.service.js'))._setCodeReviewAskForTests(null);
    for (const k of ['GITHUB_APP_ID', 'GITHUB_APP_SLUG', 'GITHUB_APP_PRIVATE_KEY', 'GITHUB_APP_WEBHOOK_SECRET', 'GITHUB_APP_CLIENT_ID', 'GITHUB_APP_CLIENT_SECRET']) delete process.env[k];
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('trạng thái dự án: link cài có state ký; MEMBER không có link cài; chưa nối ⇒ mode none', async () => {
    const a = await call(lead, 'GET', `/projects/${pid}/github-app`);
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.equal(a.data.appConfigured, true);
    assert.match(a.data.installUrl, /^https:\/\/github\.com\/apps\/ct-work-test\/installations\/new\?state=/);
    assert.equal(a.data.mode, 'none');
    assert.equal((await call(dev, 'GET', `/projects/${pid}/github-app`)).data.installUrl, null);
  });

  it('sau khi cài: state sai ⇒ báo lỗi; state đúng + người cài thật sự có bản cài ⇒ vé chọn repo ⇒ nối repo', async () => {
    const bad = await call(null, 'GET', `/github-app/setup?installation_id=777&code=abcdef12&state=forged.sig`);
    assert.equal(bad.status, 302);
    assert.match(bad.location!, /error=state/);
    const installUrl = (await call(lead, 'GET', `/projects/${pid}/github-app`)).data.installUrl as string;
    const state = decodeURIComponent(installUrl.split('state=')[1]);
    const good = await call(null, 'GET', `/github-app/setup?installation_id=777&code=abcdef12&setup_action=install&state=${encodeURIComponent(state)}`);
    assert.equal(good.status, 302);
    const ticket = decodeURIComponent(/ticket=([^&]+)/.exec(good.location!)![1]);
    assert.ok(appCalls.some((c) => c.url.includes('/user/installations') && c.auth === 'Bearer ghu_user'), 'xác minh bằng user token');
    const other = await call(null, 'GET', `/github-app/setup?installation_id=778&code=abcdef12&state=${encodeURIComponent(state)}`);
    assert.match(other.location!, /error=not_yours/, 'bản cài không thuộc người cài ⇒ từ chối');
    assert.equal((await call(dev, 'GET', `/projects/${pid}/github-app/repos?ticket=${encodeURIComponent(ticket)}`)).status, 403, 'vé của người khác / không phải ADMIN');
    const repos = await call(lead, 'GET', `/projects/${pid}/github-app/repos?ticket=${encodeURIComponent(ticket)}`);
    assert.deepEqual(repos.data.repos.map((r: any) => r.fullName), ['acme/nhatro']);
    const link = await call(lead, 'POST', `/projects/${pid}/github-app/link`, { ticket, repoId: 9001 });
    assert.equal(link.status, 200, JSON.stringify(link.raw));
    const conn = await prisma.workGithubConnection.findUnique({ where: { projectId: pid } });
    assert.equal(Number(conn!.appInstallationId), 777);
    assert.equal(Number(conn!.appRepoId), 9001);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/github-app`)).data.mode, 'app');
  });

  it('webhook chung: chữ ký sai 401; sự kiện định tuyến theo repo id; CI của PR được lưu', async () => {
    assert.equal(await hook('push', { installation: { id: 777 }, repository: { id: 9001 } }, 'wrong'), 401);
    const before = await prisma.workGitEvent.count({ where: { projectId: pid } });
    const push = {
      installation: { id: 777 }, repository: { id: 9001, full_name: 'acme/nhatro' }, ref: 'refs/heads/main', before: 'a'.repeat(40), after: 'b'.repeat(40),
      sender: { login: 'dev' }, pusher: { name: 'dev', email: 'd@x.vn' }, commits: [{ id: 'b'.repeat(40), message: `NT-${issueNum} login`, author: { name: 'dev', email: 'd@x.vn' }, timestamp: new Date().toISOString(), url: 'https://github.com/acme/nhatro/commit/b' }],
    };
    assert.equal(await hook('push', push), 200);
    assert.equal(await prisma.workGitEvent.count({ where: { projectId: pid } }), before + 1);
    assert.equal(await hook('push', { ...push, repository: { id: 1234 } }), 200, 'repo lạ ⇒ bỏ qua êm');
    await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 3, title: 'NT login', state: 'open', issueNumbers: [issueNum], openedAt: new Date() } });
    assert.equal(await hook('check_suite', { installation: { id: 777 }, repository: { id: 9001 }, check_suite: { status: 'completed', conclusion: 'failure', head_sha: 'c'.repeat(40), pull_requests: [{ number: 3 }] } }), 200);
    const pr = await prisma.workGitPull.findFirst({ where: { projectId: pid, number: 3 } });
    assert.equal(pr!.ciState, 'failure');
    assert.equal(pr!.headSha, 'c'.repeat(40));
  });

  it('đọc mã dùng token cài đặt (không PAT); review AI đăng COMMENT lên PR, inline chỉ dòng trong diff', async () => {
    const r = await call(lead, 'POST', `/projects/${pid}/code/review`, { pr: 3 });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.ok(gitAuth.includes('Bearer ghs_install_token_abc'));
    const post = appCalls.find((c) => c.url.endsWith('/pulls/3/reviews'));
    assert.ok(post, 'đã đăng review');
    const body = JSON.parse(post!.body!);
    assert.equal(body.event, 'COMMENT', 'không bao giờ APPROVE / REQUEST_CHANGES tự động');
    assert.deepEqual(body.comments.map((c: any) => [c.path, c.line]), [['src/A.java', 2]]);
    assert.match(body.body, /outside/, 'phát hiện ngoài diff vào thân review');
    assert.equal(r.data.githubReviewUrl, 'https://github.com/acme/nhatro/pull/3#pullrequestreview-1');
    const scoped = appCalls.filter((c) => c.url.endsWith('/access_tokens') && JSON.parse(c.body ?? '{}').repository_ids?.[0] === 9001);
    assert.ok(scoped.length >= 1, 'token đọc mã của dự án giới hạn đúng repo');
  });

  it('gỡ cài (installation deleted) ⇒ dự án mất liên kết app, lùi về PAT/ẩn danh', async () => {
    assert.equal(await hook('installation', { action: 'deleted', installation: { id: 777 } }), 200);
    const conn = await prisma.workGithubConnection.findUnique({ where: { projectId: pid } });
    assert.equal(conn!.appInstallationId, null);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/github-app`)).data.mode, 'anonymous');
  });
});
