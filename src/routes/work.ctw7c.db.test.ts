/**
 * CT Work đợt 7c — bảo mật & quản trị + test tự động, qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw7c.db.test.ts
 *
 *   1. Ép 2FA: người bật phải tự bật 2FA trước · ân hạn cho qua (header nhắc) · hết ân hạn ⇒ chặn REST (không gian, dự án,
 *      My work, danh sách không gian hiện trạng thái) · đã bật nhưng phiên chưa xác minh ⇒ MFA_REQUIRED · xác minh ⇒ qua ·
 *      token API + token agent KHÔNG bị ảnh hưởng · bị chặn thì không tạo token mới · danh sách ai chưa bật · audit ·
 *      không gian KHÔNG ép giữ hành vi cũ · hồi quy MFA: admin site vẫn thiết lập được, người ngoài CT Work vẫn 403.
 *   2. Sổ tài sản: tạo/sửa/liên kết thẻ, chặn bí mật, quyền, xuất THIRD_PARTY_LICENSES/CREDITS/CSV, nhắc hạn ĐÚNG MỘT lần.
 *   3. Nhập kết quả test: token scope tests:write (chỉ mở đúng tuyến), JUnit thô + Playwright/Jest JSON + lcov ⇒ test case,
 *      cycle, run, bug mới; nhập lại ⇒ KHÔNG trùng bug; đỏ/xanh xen kẽ ⇒ flaky (không mở bug).
 *   4. Automation: test.failed ⇒ chat kênh + webhook ký HMAC; issue.created ⇒ gán theo vòng + thẻ con theo mẫu; due soon
 *      (một lần mỗi hạn); pr.merged / sla.breached / baseline.changed qua tín hiệu; secret webhook không lộ ra client.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c7c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
const FX = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'services', 'work', '__fixtures__', 'ctw7c');
const fx = (n: string) => readFileSync(path.join(FX, n), 'utf8');

type U = { id: number; token: string; email: string; username: string };

async function waitFor<T>(fn: () => Promise<T | null | undefined | false>, ms = 8000): Promise<T> {
  const t0 = Date.now();
  for (;;) {
    const v = await fn();
    if (v) return v as T;
    if (Date.now() - t0 > ms) throw new Error('waitFor: timed out');
    await new Promise((r) => setTimeout(r, 100));
  }
}

describe('CT Work — đợt 7c: ép 2FA, sổ tài sản, test tự động, automation thêm (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, member: U, viewer: U, outsider: U, siteAdmin: U;
  let wsId = 0, pid = 0, key = '';
  const sent: Array<{ url: string; headers: Record<string, string>; body: string }> = [];

  function sign(u: { id: number; username: string; email: string; roleVersion?: bigint | number }, extra: Record<string, unknown> = {}, roles: string[] = []) {
    return jwt.sign({ userId: u.id, username: u.username, email: u.email, roles, roleVersion: Number(u.roleVersion ?? 0), ...extra }, config.jwtSecret);
  }
  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name } });
    userIds.push(u.id);
    return { id: u.id, token: sign(u), email, username: u.username };
  }
  async function call(u: U | { token: string } | null, method: string, p: string, body?: unknown, headers: Record<string, string> = {}) {
    const raw = typeof body === 'string';
    const res = await fetch(`${base}/api/v1/work${p}`, {
      method,
      headers: { 'Content-Type': raw ? 'application/xml' : 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...headers },
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { json = { text }; }
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, headers: res.headers, text };
  }
  const ok = (r: { status: number; raw: unknown }, status = 200) => assert.equal(r.status, status, JSON.stringify(r.raw).slice(0, 700));
  /** Bật 2FA thẳng trong DB (bước TOTP đã có test riêng ở mfa.db.test.ts) + phiên có/không có mfaAt. */
  async function enableMfa(u: U) {
    const at = new Date(Math.floor(Date.now() / 1000) * 1000 - 60_000);
    await prisma.user.update({ where: { id: u.id }, data: { mfaEnabled: true, mfaEnabledAt: at } });
  }
  const verified = (u: U) => ({ ...u, token: sign({ id: u.id, username: u.username, email: u.email }, { mfaAt: Math.floor(Date.now() / 1000) }) });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const wh = await import('../services/work/webhooks.service.js');
    wh._setWebhookNetForTests({
      lookup: async () => [{ address: '93.184.216.34' }],
      fetch: async (url, init) => {
        const h: Record<string, string> = {};
        for (const [k, v] of Object.entries((init.headers ?? {}) as Record<string, string>)) h[k.toLowerCase()] = v;
        sent.push({ url, headers: h, body: String(init.body) });
        return new Response('ok', { status: 200 });
      },
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, member, viewer, outsider, siteAdmin] = await Promise.all(['owner', 'member', 'viewer', 'outsider', 'siteadmin'].map((n) => mkUser(n)));
    // Đợt 8c: CSDL test dựng từ migration (CI) chưa có dòng roles của seed ⇒ upsert thay vì findFirstOrThrow.
    const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, create: { name: 'ROLE_ADMIN' }, update: {} });
    await prisma.userRole.create({ data: { userId: siteAdmin.id, roleId: role.id } });
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW7c ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [member.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SEC', name: 'Security Lab' });
    ok(p, 201);
    pid = p.data.id; key = p.data.key;
    for (const [u, r] of [[member, 'MEMBER'], [viewer, 'VIEWER']] as const) ok(await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role: r }));
    ok(await call(owner, 'POST', `/projects/${pid}/tests/enable`));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/webhooks.service.js'))._setWebhookNetForTests(null);
    const agentUsers = await prisma.workAgent.findMany({ where: { workspaceId: { in: wsIds } }, select: { userId: true } }).catch(() => []);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.workApiToken.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.userRole.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: [...userIds, ...agentUsers.map((a) => a.userId)] } } });
    }
    await prisma.$disconnect();
    // Redis (bộ đếm MFA / rate-limit) giữ tiến trình sống nếu không đóng.
    await (await import('../config/redis.js')).closeRedis().catch(() => undefined);
  });

  // ─── 1. Ép 2FA ────────────────────────────────────────────────────

  describe('C17 ép 2FA', () => {
    let memberToken = '';
    let agentToken = '';

    it('công tắc tổng TẮT (mặc định): thành viên không tự bật 2FA được, không ai bật được ép 2FA, cổng không chặn', async () => {
      delete process.env.CTW_ENFORCE_2FA;
      const mfa = await import('../services/mfa/mfa.service.js');
      await assert.rejects(() => mfa.batDauThietLap(viewer.id), { code: 'FORBIDDEN' });
      const a = await mfa.batDauThietLap(siteAdmin.id);
      assert.match(a.secret, /^[A-Z2-7]+$/);
      await prisma.user.update({ where: { id: siteAdmin.id }, data: { mfaSecret: null } });
      const r = await call(owner, 'PUT', `/workspaces/${wsId}/security`, { require2fa: true });
      assert.equal(r.status, 409);
      // Chính sách cũ còn lưu trong DB (bật trước khi tắt công tắc) cũng không chặn ai.
      await prisma.workSecurityPolicy.upsert({
        where: { workspaceId: wsId },
        create: { workspaceId: wsId, require2fa: true, graceDays: 0, enforcedAt: new Date(0), graceUntil: new Date(0) },
        update: { require2fa: true, graceDays: 0, enforcedAt: new Date(0), graceUntil: new Date(0) },
      });
      ok(await call(member, 'GET', `/projects/${pid}/issues`));
      await prisma.workSecurityPolicy.delete({ where: { workspaceId: wsId } });
      // Các ca dưới kiểm hành vi khi BẬT công tắc.
      process.env.CTW_ENFORCE_2FA = 'true';
    });

    it('hồi quy MFA: admin site vẫn thiết lập được; người ngoài CT Work vẫn 403; thành viên CT Work nay thiết lập được', async () => {
      const mfa = await import('../services/mfa/mfa.service.js');
      const a = await mfa.batDauThietLap(siteAdmin.id);
      assert.match(a.secret, /^[A-Z2-7]+$/);
      const lone = await mkUser('lone');
      await assert.rejects(() => mfa.batDauThietLap(lone.id), { code: 'FORBIDDEN' });
      await assert.rejects(() => mfa.batMfa(lone.id, '123456'), { code: 'FORBIDDEN' });
      const m = await mfa.batDauThietLap(viewer.id);
      assert.ok(m.otpauthUri.startsWith('otpauth://'));
      // Dọn: viewer chưa bật thật (chỉ secret tạm) — không ảnh hưởng phần dưới.
      await prisma.user.update({ where: { id: viewer.id }, data: { mfaSecret: null } });
    });

    it('trước khi ép: không gian không có chính sách ⇒ hành vi cũ (không cần 2FA)', async () => {
      ok(await call(member, 'GET', `/projects/${pid}/issues`));
      const t = await call(member, 'POST', '/me/api-tokens', { name: 'ci', scopes: ['read'] });
      ok(t, 201);
      memberToken = t.data.token;
      const ag = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Sec bot', model: 'gpt-6-sol', projectIds: [pid] });
      ok(ag, 201);
      agentToken = ag.data.token.token;
    });

    it('chỉ OWNER/ADMIN đổi; người bật phải tự bật 2FA trước; token không đổi được chính sách', async () => {
      assert.equal((await call(member, 'PUT', `/workspaces/${wsId}/security`, { require2fa: true })).status, 403);
      assert.equal((await call(outsider, 'GET', `/workspaces/${wsId}/security`)).status, 404);
      assert.equal((await call({ token: memberToken }, 'GET', `/workspaces/${wsId}/security`)).status, 403);
      const r = await call(owner, 'PUT', `/workspaces/${wsId}/security`, { require2fa: true, graceDays: 7 });
      assert.equal(r.status, 409);
      assert.equal(r.code, 'WORK_2FA_SELF_FIRST');
      await enableMfa(owner);
      owner = verified(owner);
      const on = await call(owner, 'PUT', `/workspaces/${wsId}/security`, { require2fa: true, graceDays: 7 });
      ok(on);
      assert.equal(on.data.policy.require2fa, true);
      assert.ok(new Date(on.data.policy.graceUntil).getTime() > Date.now() + 6 * 86_400_000);
      assert.ok(on.data.members.some((m: any) => m.user.id === member.id && !m.mfaEnabled && m.state === 'GRACE'));
      assert.ok(on.data.exempt.agents.length >= 1, 'agent liệt kê riêng — miễn trừ');
      assert.equal(on.data.summary.missing >= 2, true);
      const audit = await prisma.workAuditLog.findFirst({ where: { workspaceId: wsId, action: 'workspace.security.require_2fa_on' } });
      assert.ok(audit, 'có audit bật ép 2FA');
    });

    it('trong ân hạn: thành viên chưa bật vẫn vào được + header nhắc', async () => {
      const r = await call(member, 'GET', `/projects/${pid}/issues`);
      ok(r);
      assert.match(r.headers.get('x-ctwork-2fa-grace') ?? '', new RegExp(`^${wsId}=`));
      const list = await call(member, 'GET', '/workspaces');
      assert.equal(list.data.find((w: any) => w.id === wsId).twoFactor.state, 'GRACE');
    });

    it('hết ân hạn: chưa bật ⇒ 403 WORK_2FA_SETUP_REQUIRED ở không gian, dự án; My work loại không gian; danh sách hiện trạng thái', async () => {
      await prisma.workSecurityPolicy.update({ where: { workspaceId: wsId }, data: { graceUntil: new Date(Date.now() - 60_000) } });
      const a = await call(member, 'GET', `/projects/${pid}/issues`);
      assert.equal(a.status, 403);
      assert.equal(a.code, 'WORK_2FA_SETUP_REQUIRED');
      assert.equal(a.raw.details?.setupUrl ?? a.raw.data?.setupUrl ?? a.raw.error?.details?.setupUrl ?? '/work/security', '/work/security');
      assert.equal((await call(member, 'GET', `/workspaces/${wsId}/members`)).code, 'WORK_2FA_SETUP_REQUIRED');
      assert.equal((await call(member, 'GET', `/workspaces/${wsId}/projects`)).code, 'WORK_2FA_SETUP_REQUIRED');
      const list = await call(member, 'GET', '/workspaces');
      ok(list);
      const w = list.data.find((x: any) => x.id === wsId);
      assert.equal(w.twoFactor.state, 'SETUP_REQUIRED');
      assert.equal(w.projectCount, 0);
      const mine = await call(member, 'GET', '/me/work');
      ok(mine);
      assert.ok(!JSON.stringify(mine.data).includes(`"${key}-`), 'My work không lộ thẻ của không gian bị chặn');
      const sec = await call(member, 'GET', '/me/security');
      ok(sec);
      assert.equal(sec.data.workspaces.find((x: any) => x.id === wsId).state, 'SETUP_REQUIRED');
      // Người lạ vẫn nhận 404 như cũ (không lộ chính sách).
      assert.equal((await call(outsider, 'GET', `/projects/${pid}/issues`)).status, 404);
    });

    it('token API + token agent KHÔNG bị ảnh hưởng; đang bị chặn thì không tạo được token/link lịch mới', async () => {
      ok(await call({ token: memberToken }, 'GET', `/projects/${pid}/issues`));
      ok(await call({ token: agentToken }, 'GET', `/projects/${pid}/issues`));
      const t = await call(member, 'POST', '/me/api-tokens', { name: 'bypass', scopes: ['read'] });
      assert.equal(t.status, 403);
      assert.equal(t.code, 'WORK_2FA_SETUP_REQUIRED');
      assert.equal((await call(member, 'POST', '/me/calendar-link')).code, 'WORK_2FA_SETUP_REQUIRED');
    });

    it('đã bật 2FA nhưng phiên chưa xác minh ⇒ MFA_REQUIRED; xác minh (mfaAt) ⇒ qua', async () => {
      await enableMfa(member);
      const r = await call(member, 'GET', `/projects/${pid}/issues`);
      assert.equal(r.status, 403);
      assert.equal(r.code, 'MFA_REQUIRED');
      ok(await call(verified(member), 'GET', `/projects/${pid}/issues`));
      ok(await call(verified(member), 'GET', `/workspaces/${wsId}/members`));
    });

    it('nhắc thành viên chưa bật (có audit, trần 1 lần/giờ); tắt ép ⇒ mọi người vào lại', async () => {
      const r = await call(owner, 'POST', `/workspaces/${wsId}/security/remind`);
      ok(r);
      assert.ok(r.data.reminded >= 1);
      assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/security/remind`)).status, 429);
      ok(await call(owner, 'PUT', `/workspaces/${wsId}/security`, { require2fa: false }));
      assert.ok(await prisma.workAuditLog.findFirst({ where: { workspaceId: wsId, action: 'workspace.security.require_2fa_off' } }));
      ok(await call(viewer, 'GET', `/projects/${pid}/issues`));
      await prisma.user.update({ where: { id: member.id }, data: { mfaEnabled: false, mfaEnabledAt: null } });
    });
  });

  // ─── 2. Sổ tài sản ────────────────────────────────────────────────

  describe('C25 sổ tài sản & giấy phép', () => {
    let issueNo = 0;
    it('tạo / sửa / liên kết thẻ; viewer không ghi được; người lạ 404; chặn bí mật', async () => {
      issueNo = (await call(member, 'POST', `/projects/${pid}/issues`, { title: 'Use Inter font in UI', typeKey: 'TASK' })).data.number;
      const a = await call(member, 'POST', `/projects/${pid}/assets`, { name: 'Inter', category: 'FONT', licenseType: 'OFL', source: 'Rasmus Andersson', sourceUrl: 'https://rsms.me/inter/', attribution: 'Inter by Rasmus Andersson (OFL 1.1)' });
      ok(a, 201);
      assert.equal(a.data.key, 'AST-1');
      assert.equal(a.data.attributionRequired, true, 'OFL ⇒ mặc định bắt buộc ghi công');
      const b = await call(member, 'POST', `/projects/${pid}/assets`, { name: 'Figma Pro', category: 'SERVICE', licenseType: 'SUBSCRIPTION', cost: 15, currency: 'USD', billing: 'MONTHLY', expiresAt: new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10), remindDays: 14, ownerId: owner.id, notes: 'Login in Bitwarden "Studio" — owner Cuong' });
      ok(b, 201);
      assert.equal(b.data.expiry.state, 'EXPIRING');
      ok(await call(member, 'PUT', `/projects/${pid}/assets/1/links`, { issues: [`${key}-${issueNo}`] }));
      const got = await call(viewer, 'GET', `/projects/${pid}/assets/1`);
      ok(got);
      assert.equal(got.data.links[0].key, `${key}-${issueNo}`);
      ok(await call(viewer, 'GET', `/projects/${pid}/issues/${issueNo}/assets`));
      assert.equal((await call(viewer, 'POST', `/projects/${pid}/assets`, { name: 'x' })).status, 403);
      assert.equal((await call(outsider, 'GET', `/projects/${pid}/assets`)).status, 404);
      const sec = await call(member, 'POST', `/projects/${pid}/assets`, { name: 'AWS', category: 'SERVICE', notes: 'password: hunter2222' });
      assert.equal(sec.code, 'WORK_ASSET_SECRET');
      const list = await call(member, 'GET', `/projects/${pid}/assets`);
      ok(list);
      assert.equal(list.data.summary.expiring, 1);
      assert.equal(list.data.summary.annualCost.USD, 180);
    });

    it('xuất THIRD_PARTY_LICENSES.md / CREDITS.txt / CSV', async () => {
      const md = await call(member, 'GET', `/projects/${pid}/assets-export?kind=licenses&format=md`);
      ok(md);
      assert.match(md.text, /## SIL Open Font License 1\.1/);
      assert.match(md.headers.get('content-disposition') ?? '', /THIRD_PARTY_LICENSES\.md/);
      const cr = await call(member, 'GET', `/projects/${pid}/assets-export?kind=credits&format=txt`);
      assert.match(cr.text, /Inter by Rasmus Andersson/);
      assert.doesNotMatch(cr.text, /Figma/);
      const csv = await call(member, 'GET', `/projects/${pid}/assets-export?format=csv`);
      assert.match(csv.text, /AST-2,Figma Pro,SERVICE/);
    });

    it('nhắc trước hạn: đúng MỘT lần mỗi hạn, gia hạn ⇒ nhắc lại', async () => {
      const { runAssetReminders } = await import('../services/work/assets.service.js');
      const before = await prisma.socialNotification.count({ where: { receiverId: owner.id } });
      assert.ok((await runAssetReminders()) >= 1);
      assert.equal(await runAssetReminders(), 0, 'lần hai không nhắc lại');
      const after1 = await prisma.socialNotification.count({ where: { receiverId: owner.id } });
      assert.ok(after1 > before);
      ok(await call(member, 'PATCH', `/projects/${pid}/assets/2`, { expiresAt: new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10) }));
      assert.ok((await runAssetReminders()) >= 1, 'hạn mới ⇒ nhắc lại');
      ok(await call(owner, 'DELETE', `/projects/${pid}/assets/2`));
    });
  });

  // ─── 3. Nhập kết quả test ─────────────────────────────────────────

  describe('TST-2 nhập kết quả test tự động', () => {
    let ciToken = '';
    it('token scope tests:write chỉ mở đúng tuyến nhập kết quả', async () => {
      const t = await call(member, 'POST', '/me/api-tokens', { name: 'GitHub Actions', scopes: ['tests:write'] });
      ok(t, 201);
      assert.deepEqual(t.data.scopes.sort(), ['read', 'tests:write']);
      ciToken = t.data.token;
      const w = await call({ token: ciToken }, 'POST', `/projects/${pid}/issues`, { title: 'should fail', typeKey: 'TASK' });
      assert.equal(w.status, 403);
      ok(await call({ token: ciToken }, 'GET', `/projects/${pid}/test-automation`));
    });

    it('JUnit XML thô ⇒ test case + cycle + run + bug cho lỗi mới; độ phủ lcov qua JSON', async () => {
      const r = await call({ token: ciToken }, 'POST', `/projects/${pid}/tests/automation/import?build=42&branch=main&commit=abc123def`, fx('junit.xml'));
      ok(r, 201);
      assert.equal(r.data.format, 'JUNIT');
      assert.equal(r.data.total, 5);
      assert.equal(r.data.failed, 2);
      assert.equal(r.data.newTestCases, 5);
      assert.equal(r.data.newBugs, 2);
      const cyc = await prisma.workTestCycle.findUniqueOrThrow({ where: { id: r.data.cycleId }, select: { name: true, build: true, runs: { select: { status: true } } } });
      assert.equal(cyc.name, 'CI · 42');
      assert.equal(cyc.runs.filter((x) => x.status === 'FAIL').length, 2);
      const bug = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, title: '[CI] lockAfterFiveFailures fails' }, select: { id: true, defectInfo: { select: { severity: true, activity: true } } } });
      assert.equal(bug.defectInfo?.severity, 'MAJOR');
      const tc = await prisma.workTestCase.findMany({ where: { issue: { projectId: pid }, kind: 'AUTOMATED' } });
      assert.equal(tc.length, 5);
      const imp = await prisma.workTestImport.findFirstOrThrow({ where: { id: r.data.importId } });
      assert.equal(imp.tokenId !== null, true);
      assert.equal(imp.source, 'API');
      // Playwright JSON + coverage lcov qua thân JSON.
      const pw = await call({ token: ciToken }, 'POST', `/projects/${pid}/tests/automation/import`, { report: fx('playwright.json'), format: 'playwright', build: '43', coverage: { report: fx('lcov.info') } });
      ok(pw, 201);
      assert.equal(pw.data.failed, 1);
      assert.equal(pw.data.coverage.linePct, 70);
      const js = await call(member, 'POST', `/projects/${pid}/tests/automation/import`, { report: JSON.parse(fx('jest.json')), build: '44' });
      ok(js, 201);
      assert.equal(js.data.format, 'JEST');
    });

    it('nhập lại cùng lỗi ⇒ KHÔNG bug mới (gắn vào bug cũ); đỏ/xanh xen kẽ ⇒ flaky, không mở bug', async () => {
      const again = await call({ token: ciToken }, 'POST', `/projects/${pid}/tests/automation/import?build=45`, fx('junit.xml'));
      ok(again, 201);
      assert.equal(again.data.newBugs, 0);
      assert.equal(again.data.linkedBugs, 2);
      const one = (status: 'pass' | 'fail') => `<testsuite name="Flaky"><testcase classname="Flaky" name="sometimes">${status === 'fail' ? '<failure message="Race condition: order total mismatch in checkout flow"/>' : ''}</testcase></testsuite>`;
      for (const s of ['pass', 'fail', 'pass', 'fail'] as const) ok(await call({ token: ciToken }, 'POST', `/projects/${pid}/tests/automation/import`, one(s)), 201);
      const at = await prisma.workAutoTest.findFirstOrThrow({ where: { projectId: pid, name: 'sometimes' } });
      assert.equal(at.history, 'PFPF');
      assert.equal(at.flaky, true);
      // Lần đỏ thứ hai lúc đã flaky: lần đỏ đầu đã mở bug (PF chưa flaky) — lần sau gắn vào chính bug đó, không mở thêm.
      const bugs = await prisma.workIssue.count({ where: { projectId: pid, title: '[CI] sometimes fails' } });
      assert.equal(bugs, 1);
      const ov = await call(viewer, 'GET', `/projects/${pid}/test-automation`);
      ok(ov);
      assert.ok(ov.data.summary.flaky >= 1);
      assert.ok(ov.data.imports.length >= 7);
      assert.ok(ov.data.summary.coverage.pct === 70);
      ok(await call(member, 'POST', `/projects/${pid}/test-automation/tests/${at.id}/reset-flaky`));
      assert.equal((await call(viewer, 'POST', `/projects/${pid}/test-automation/tests/${at.id}/reset-flaky`)).status, 403);
    });

    it('báo cáo hỏng ⇒ 400 rõ ràng', async () => {
      const bad = await call(member, 'POST', `/projects/${pid}/tests/automation/import`, '<testsuite><testcase></testsuite>');
      assert.equal(bad.status, 400);
      assert.equal(bad.code, 'WORK_TEST_REPORT');
    });
  });

  // ─── 4. Automation thêm ───────────────────────────────────────────

  describe('C13 automation: trigger + action mới', () => {
    it('test.failed ⇒ chat #general + webhook ký HMAC; secret không về client', async () => {
      const r = await call(owner, 'POST', `/projects/${pid}/automation`, {
        name: 'CI red', trigger: 'test.failed',
        config: { actions: [{ kind: 'post_chat', text: '🔴 {{event.test}} failed on build {{event.build}} ({{issue.key}})' }, { kind: 'webhook', url: 'https://hooks.example.com/ctw', text: 'CI red: {{event.test}}' }] },
      });
      ok(r, 201);
      assert.equal(r.data.config.actions[1].secret, undefined);
      assert.equal(r.data.config.actions[1].secretSet, true);
      const list = await call(viewer, 'GET', `/projects/${pid}/automation`);
      assert.ok(!JSON.stringify(list.data).includes('"secret":"'), 'người xem không thấy bí mật webhook');
      sent.length = 0;
      ok(await call(member, 'POST', `/projects/${pid}/tests/automation/import?build=99`, '<testsuite name="Pay"><testcase classname="Pay" name="refund works"><failure message="Expected refund status to be COMPLETED but got PENDING"/></testcase></testsuite>'), 201);
      const msg = await waitFor(() => prisma.workChannelMessage.findFirst({ where: { channel: { projectId: pid }, kind: 'SYSTEM', body: { contains: 'refund works failed on build 99' } } }));
      assert.match(msg.body, new RegExp(`\\(${key}-\\d+\\)`));
      await waitFor(async () => sent.length > 0);
      assert.equal(sent[0].url, 'https://hooks.example.com/ctw');
      assert.match(sent[0].headers['x-ctwork-signature'], /^sha256=[0-9a-f]{64}$/);
      const body = JSON.parse(sent[0].body);
      assert.equal(body.text, 'CI red: refund works');
      assert.equal(body.content, body.text);
      assert.equal(body.event, 'test.failed');
    });

    it('webhook tới địa chỉ nội bộ bị từ chối lúc lưu (chốt SSRF chung)', async () => {
      const r = await call(owner, 'POST', `/projects/${pid}/automation`, { name: 'bad', trigger: 'pr.merged', config: { actions: [{ kind: 'webhook', url: 'https://127.0.0.1/x' }] } });
      assert.equal(r.status, 400);
      const h = await call(owner, 'POST', `/projects/${pid}/automation`, { name: 'bad2', trigger: 'pr.merged', config: { actions: [{ kind: 'webhook', url: 'http://hooks.example.com/x' }] } });
      assert.equal(h.status, 400);
    });

    it('issue.created ⇒ gán theo vòng (A → B → A) + thẻ con theo mẫu DoD (không nhân đôi)', async () => {
      const sub = await prisma.workIssueType.findFirst({ where: { projectId: pid, level: -1 } });
      assert.ok(sub, 'dự án mặc định có loại sub-task');
      ok(await call(owner, 'POST', `/projects/${pid}/automation`, {
        name: 'Rotate + DoD', trigger: 'issue.created',
        config: { conditions: [{ jql: 'summary ~ "Rotate"' }], actions: [{ kind: 'assign_round_robin', pool: [member.id, owner.id] }, { kind: 'create_subtasks', template: 'dod' }] },
      }), 201);
      const nums: number[] = [];
      for (const t of ['Rotate one', 'Rotate two', 'Rotate three']) {
        nums.push((await call(member, 'POST', `/projects/${pid}/issues`, { title: t, typeKey: 'TASK' })).data.number);
        await waitFor(() => prisma.workIssue.findFirst({ where: { projectId: pid, number: nums[nums.length - 1], assigneeId: { not: null } } }));
      }
      const got = await prisma.workIssue.findMany({ where: { projectId: pid, number: { in: nums } }, orderBy: { number: 'asc' }, select: { id: true, assigneeId: true } });
      assert.deepEqual(got.map((g) => g.assigneeId), [member.id, owner.id, member.id]);
      const kids = await waitFor(async () => { const n = await prisma.workIssue.count({ where: { parentId: got[0].id } }); return n >= 5 ? n : null; });
      assert.equal(kids, 5);
      const rule = await prisma.workAutomationRule.findFirstOrThrow({ where: { projectId: pid, name: 'Rotate + DoD' } });
      const auto = await import('../services/work/automation.service.js');
      await auto.runRuleOnIssue({ ...rule }, got[0].id, null);
      assert.equal(await prisma.workIssue.count({ where: { parentId: got[0].id } }), 5, 'chạy lại không nhân đôi thẻ con');
    });

    it('due soon: chạy MỘT lần mỗi hạn', async () => {
      const due = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
      const n = (await call(member, 'POST', `/projects/${pid}/issues`, { title: 'Submit report 3', dueDate: due, typeKey: 'TASK' })).data.number;
      ok(await call(owner, 'POST', `/projects/${pid}/automation`, { name: 'Due soon', trigger: 'issue.due_soon', config: { dueInDays: 2, conditions: [{ jql: 'summary ~ "Submit report"' }], actions: [{ kind: 'comment', text: 'Due {{event.due}} — {{issue.key}}' }] } }), 201);
      const auto = await import('../services/work/automation.service.js');
      await auto.runDueSoonRules();
      await auto.runDueSoonRules();
      const iss = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n }, select: { id: true } });
      const cs = await prisma.workComment.findMany({ where: { issueId: iss.id, authorId: null } });
      assert.equal(cs.length, 1);
      assert.equal(cs[0].bodyText, `Due ${due} — ${key}-${n}`);
    });

    it('pr.merged / sla.breached / baseline.changed qua tín hiệu (không gắn thẻ ⇒ bỏ hành động cần thẻ)', async () => {
      const n = (await call(member, 'POST', `/projects/${pid}/issues`, { title: 'Merge me', typeKey: 'TASK' })).data.number;
      const iss = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n }, select: { id: true } });
      for (const trig of ['pr.merged', 'sla.breached', 'baseline.changed']) {
        ok(await call(owner, 'POST', `/projects/${pid}/automation`, { name: `On ${trig}`, trigger: trig, config: { actions: [{ kind: 'post_chat', text: trig === 'baseline.changed' ? `${trig}: {{event.baseline}} {{issue.key}}` : `${trig}: {{event.title}} {{issue.key}}` }, { kind: 'set_priority', priority: 1 }] } }), 201);
      }
      const auto = await import('../services/work/automation.service.js');
      await auto.handleSignal({ signal: 'pr.merged', projectId: pid, issueIds: [iss.id], data: { title: 'Fix login' } });
      await auto.handleSignal({ signal: 'sla.breached', projectId: pid, issueIds: [iss.id], data: { target: 'resolution' } });
      await auto.handleSignal({ signal: 'baseline.changed', projectId: pid, issueIds: [], data: { baseline: 'BL-1', title: '' } });
      assert.ok(await prisma.workChannelMessage.findFirst({ where: { channel: { projectId: pid }, body: `pr.merged: Fix login ${key}-${n}` } }));
      assert.ok(await prisma.workChannelMessage.findFirst({ where: { channel: { projectId: pid }, body: { startsWith: 'baseline.changed: BL-1' } } }));
      assert.equal((await prisma.workIssue.findUniqueOrThrow({ where: { id: iss.id } })).priority, 1);
      const log = await prisma.workAutomationLog.findFirst({ where: { rule: { projectId: pid, name: 'On baseline.changed' } }, orderBy: { id: 'desc' } });
      assert.match(log!.message, /set_priority skipped \(no issue\)/);
    });
  });
});
