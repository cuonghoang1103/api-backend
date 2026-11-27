/**
 * dm5 G4 (27/11/2026) — Code, phát hành, báo cáo theo vai, CR/RAID & thư viện mẫu dự án (HTTP + DB, fetch GitHub GIẢ, model GIẢ).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5g4.db.test.ts
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { __setGitFetchForTests, clearSourceCache } from '../services/work/gitSource.js';
import { readXlsx } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `g4${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

const PATCH = `@@ -10,3 +10,5 @@ public class RoomDao {
     public Room find(int id) {
-        String sql = "SELECT * FROM rooms WHERE id=" + id;
+        String sql = "SELECT * FROM rooms WHERE id=?";
+        PreparedStatement ps = conn.prepareStatement(sql);
+        ps.setInt(1, id);
     }`;
const issueChangeWired = (() => {
  try { return readFileSync(new URL('../services/work/issueChange.ts', import.meta.url), 'utf8').includes('assertVersionFreeze'); } catch { return false; }
})();

describe('dm5 G4 — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, qa: U, outsider: U;
  let wsId = 0;
  const pids: Record<string, number> = {};

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
    return { status: res.status, data: json.data, code: json.error?.code ?? json.code, raw: json };
  }
  async function download(u: U, path: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, { headers: { Authorization: `Bearer ${u.token}` } });
    return { status: res.status, buf: Buffer.from(await res.arrayBuffer()) };
  }
  const statusesOf = async (pid: number) => prisma.workStatus.findMany({ where: { workflow: { projectId: pid, isDefault: true } }, orderBy: { position: 'asc' }, select: { id: true, name: true, wipLimit: true } });
  const typeId = async (pid: number, key: string) => (await prisma.workIssueType.findFirstOrThrow({ where: { projectId: pid, key } })).id;
  async function newIssue(pid: number, key: string, title: string, extra: Record<string, unknown> = {}) {
    const r = await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: await typeId(pid, key), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data.number as number;
  }

  function mockFetch(url: string) {
    const h = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
    const u = new URL(url);
    const p = u.pathname;
    if (p === '/repos/acme/labflow') return Promise.resolve(h(200, { default_branch: 'main', private: false, html_url: 'https://github.com/acme/labflow' }));
    if (p === '/repos/acme/labflow/contents') return Promise.resolve(h(200, [{ name: '.gitignore', path: '.gitignore', type: 'file' }, { name: 'pom.xml', path: 'pom.xml', type: 'file' }, { name: '.github', path: '.github', type: 'dir' }]));
    if (p === '/repos/acme/labflow/contents/.github') return Promise.resolve(h(200, [{ name: 'workflows', path: '.github/workflows', type: 'dir' }]));
    if (p === '/repos/acme/labflow/contents/.github/workflows') return Promise.resolve(h(200, [{ name: 'ci.yml', path: '.github/workflows/ci.yml', type: 'file' }]));
    if (p === '/repos/acme/labflow/branches/main') return Promise.resolve(h(200, { name: 'main', protected: false }));
    if (p === '/repos/acme/labflow/pulls/7') {
      return Promise.resolve(h(200, { number: 7, title: 'LF-1 Room lookup', body: 'Fixes LF-1', state: 'open', draft: false, mergeable: true, head: { ref: 'feature/LF-1', sha: 'a'.repeat(40) }, base: { ref: 'main', sha: 'b'.repeat(40) }, user: { login: dev.username }, additions: 3, deletions: 1, changed_files: 1, html_url: 'https://github.com/acme/labflow/pull/7' }));
    }
    if (p === '/repos/acme/labflow/pulls/7/files') return Promise.resolve(h(200, [{ filename: 'src/dao/RoomDao.java', status: 'modified', additions: 3, deletions: 1, changes: 4, patch: PATCH }]));
    return Promise.resolve(h(404, { message: 'Not Found' }));
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    __setGitFetchForTests(mockFetch as never);
    const { _setCodeReviewAskForTests } = await import('../services/work/codeReview.service.js');
    _setCodeReviewAskForTests(async (system) => {
      assert.match(system, /MENTOR MODE/, 'chế độ critic gửi luật mentor cho model');
      return JSON.stringify({
        summary: 'Dùng PreparedStatement. Sửa như sau:\n```java\ntry (PreparedStatement ps = conn.prepareStatement(sql)) { }\n```', verdict: 'CHANGES',
        findings: [{ file: 'src/dao/RoomDao.java', line: 12, severity: 'MAJOR', category: 'correctness', message: 'PreparedStatement không được đóng', suggestion: '```java\nps.close();\n```' }],
        acceptance: [{ criterion: 'Tìm phòng theo id', met: 'yes', evidence: 'src/dao/RoomDao.java:11' }],
        nextSteps: ['```\nps.close()\n```', 'Viết test cho find()'],
      });
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, qa, outsider] = await Promise.all(['lead', 'dev', 'qa', 'out'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `G4 ${tag}` })).data;
    wsId = ws.id;
    wsIds.push(ws.id);
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, qa.email], role: 'MEMBER' });
  });

  after(async () => {
    __setGitFetchForTests(null);
    clearSourceCache();
    const { _setCodeReviewAskForTests } = await import('../services/work/codeReview.service.js');
    _setCodeReviewAskForTests(null);
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  // ═══ A25 — thư viện mẫu ═══════════════════════════════════════

  it('danh sách 5 bộ + xem trước có nhóm bật/tắt; người ngoài không xem trước được', async () => {
    const list = await call(lead, 'GET', '/project-blueprints');
    assert.equal(list.status, 200);
    assert.deepEqual(list.data.map((b: any) => b.key), ['SWP391_TEAM5', 'SWP391_SOLO5', 'SEP490', 'OJT', 'SCRUM']);
    const pv = await call(lead, 'POST', `/workspaces/${wsId}/projects/preview`, { blueprint: 'SWP391_SOLO5', groups: { docs: false } });
    assert.equal(pv.status, 200);
    assert.equal(pv.data.kind, 'blueprint');
    assert.equal(pv.data.groups.find((g: any) => g.key === 'docs').enabled, false);
    assert.equal(pv.data.groups.find((g: any) => g.key === 'cadence').enabled, true);
    assert.equal((await call(outsider, 'POST', `/workspaces/${wsId}/projects/preview`, { blueprint: 'SCRUM' })).status, 404);
    assert.equal((await call(lead, 'POST', `/workspaces/${wsId}/projects/preview`, { blueprint: 'NOPE' })).code, 'WORK_BAD_BLUEPRINT');
    // Không ghi gì.
    assert.equal(await prisma.workProject.count({ where: { workspaceId: wsId } }), 0);
  });

  for (const [key, code] of [['SWP391_TEAM5', 'TA'], ['SWP391_SOLO5', 'SO'], ['SEP490', 'SE'], ['OJT', 'OJ'], ['SCRUM', 'SC']] as const) {
    it(`tạo dự án từ bộ ${key}: đủ nhóm, không nhóm nào lỗi`, async () => {
      const r = await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: code, name: `${key} ${tag}`, blueprint: key });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      assert.deepEqual(r.data.setup.skipped, [], JSON.stringify(r.data.setup));
      const pid = r.data.id;
      pids[key] = pid;
      const { blueprintOf } = await import('../services/work/projectBlueprints.js');
      const b = blueprintOf(key)!;
      const st = await statusesOf(pid);
      for (const s of b.workflow!.statuses) {
        const hit = st.find((x) => x.name === s.name);
        assert.ok(hit, `${key}: thiếu trạng thái ${s.name}`);
        assert.equal(hit!.wipLimit, s.wipLimit ?? null);
      }
      const fields = await prisma.workCustomField.findMany({ where: { projectId: pid }, select: { name: true } });
      for (const f of b.fields ?? []) assert.ok(fields.some((x) => x.name === f.name), `${key}: thiếu trường ${f.name}`);
      const labels = await prisma.workLabel.count({ where: { projectId: pid } });
      assert.ok(labels >= (b.labels?.length ?? 0));
      const p = await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } });
      const s = p.settings as Record<string, any>;
      for (const m of b.modules ?? []) assert.equal(s.modules[m], true, `${key}: mô-đun ${m}`);
      assert.deepEqual(s.definitionOfDone, b.checklists!.definitionOfDone);
      if (b.gates?.doneRequirements) {
        const ev = await prisma.workCustomField.findFirstOrThrow({ where: { projectId: pid, name: 'Evidence' } });
        assert.deepEqual(s.doneRequirements.fieldIds, [ev.id]);
      }
      if (b.gates?.wipMode) assert.equal(s.wipMode, 'block');
      assert.equal(await prisma.workMeetingSeries.count({ where: { projectId: pid } }), b.cadence?.length ?? 0);
      if (b.stages) {
        const stages = await prisma.workStage.findMany({ where: { projectId: pid, slug: { in: b.stages.map((x) => x.slug) } }, select: { plannedStart: true, plannedEnd: true } });
        assert.equal(stages.length, b.stages.length);
        assert.ok(stages.every((x) => x.plannedStart && x.plannedEnd && x.plannedEnd > x.plannedStart));
      }
      const kit = await prisma.workPage.findFirst({ where: { projectId: pid, title: 'Project kit (templates)' }, select: { id: true } });
      assert.ok(kit);
      assert.equal(await prisma.workPage.count({ where: { projectId: pid, parentId: kit!.id } }), b.docs!.length);
    });
  }

  it('bộ SOLO: banner Solo, AI review critic, test gate, làm nguội review, cảnh báo giờ vai', async () => {
    const s = (await prisma.workProject.findUniqueOrThrow({ where: { id: pids.SWP391_SOLO5 }, select: { settings: true } })).settings as Record<string, any>;
    assert.equal(s.banner.tone, 'solo');
    assert.equal(s.aiReviewMode, 'critic');
    assert.equal(s.testGate, 'block');
    assert.equal(s.reviewCoolOffHours, 12);
    assert.deepEqual(s.roleAlert, { qaMinPct: 15, maxWeekHours: 30 });
    assert.ok(Array.isArray(s.reviewChecklists) && s.reviewChecklists.length === 1);
  });

  it('bộ SOLO chạy thật: WIP 2 chặn cứng, người được giao không tự Done, Done cần Evidence', async () => {
    const pid = pids.SWP391_SOLO5;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    const st = await statusesOf(pid);
    const S = (n: string) => st.find((x) => x.name === n)!.id;
    const ready = await prisma.workCustomField.findFirstOrThrow({ where: { projectId: pid, name: 'Ready (DoR)' } });
    const evidence = await prisma.workCustomField.findFirstOrThrow({ where: { projectId: pid, name: 'Evidence' } });
    const nums: number[] = [];
    for (const t of ['Đặt phòng lab', 'Huỷ đặt', 'Duyệt đặt']) {
      const n = await newIssue(pid, 'STORY', t, { assigneeId: dev.id });
      await call(lead, 'PUT', `/projects/${pid}/issues/${n}/custom-values`, { values: { [ready.id]: true } });
      nums.push(n);
    }
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${nums[0]}/move`, { statusId: S('In Progress') })).status, 200);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${nums[1]}/move`, { statusId: S('In Progress') })).status, 200);
    const third = await call(dev, 'POST', `/projects/${pid}/issues/${nums[2]}/move`, { statusId: S('In Progress') });
    assert.equal(third.code, 'WORK_WIP_LIMIT');
    // To Do ⇒ Done bỏ qua review: luồng không cho.
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${nums[2]}/move`, { statusId: S('Done') })).code, 'WORK_TRANSITION_DENIED');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${nums[0]}/move`, { statusId: S('In Review') })).status, 200);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${nums[0]}/move`, { statusId: S('Done') })).code, 'WORK_TRANSITION_SELF');
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${nums[0]}/move`, { statusId: S('Done') })).code, 'WORK_DONE_REQUIREMENTS');
    await call(lead, 'PUT', `/projects/${pid}/issues/${nums[0]}/custom-values`, { values: { [evidence.id]: 'https://github.com/acme/labflow/pull/7 + ảnh chụp' } });
    const done = await call(lead, 'POST', `/projects/${pid}/issues/${nums[0]}/move`, { statusId: S('Done') });
    assert.equal(done.status, 200, JSON.stringify(done.raw));
  });

  it('nhóm tắt thì không áp: SCRUM không có họp, không Docs kit', async () => {
    const r = await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'SN', name: `Scrum lean ${tag}`, blueprint: 'SCRUM', groups: { cadence: false, docs: false, labels: false } });
    assert.equal(r.status, 201);
    assert.equal(await prisma.workMeetingSeries.count({ where: { projectId: r.data.id } }), 0);
    assert.equal(await prisma.workPage.count({ where: { projectId: r.data.id } }), 0);
    assert.equal(await prisma.workLabel.count({ where: { projectId: r.data.id } }), 0);
    assert.ok(!('cadence' in r.data.setup.applied));
  });

  it('A25 — chép CẤU HÌNH từ dự án mẫu: 0 thẻ, trường mới, Done rules chặn đúng trường MỚI', async () => {
    const src = pids.SWP391_SOLO5;
    const pv = await call(lead, 'POST', `/workspaces/${wsId}/projects/preview`, { fromProjectId: src });
    assert.equal(pv.status, 200);
    assert.ok(pv.data.notCopied.issues >= 3);
    assert.ok(pv.data.copies.fields.some((f: string) => f.startsWith('Evidence')));
    const r = await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'CP', name: `Copy ${tag}`, fromProjectId: src, configOnly: true });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const pid = r.data.id;
    assert.equal(await prisma.workIssue.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workProjectMember.count({ where: { projectId: pid } }), 1, 'chỉ người tạo');
    assert.equal(await prisma.workSprint.count({ where: { projectId: pid } }), 0);
    const srcEv = await prisma.workCustomField.findFirstOrThrow({ where: { projectId: src, name: 'Evidence' } });
    const ev = await prisma.workCustomField.findFirstOrThrow({ where: { projectId: pid, name: 'Evidence' } });
    assert.notEqual(ev.id, srcEv.id);
    const s = (await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } })).settings as Record<string, any>;
    assert.deepEqual(s.doneRequirements.fieldIds, [ev.id]);
    assert.equal(s.copiedFrom.key, 'SO');
    assert.equal(s.modules.changeRequests, true);
    const st = await statusesOf(pid);
    assert.deepEqual(st.map((x) => x.name), ['To Do', 'In Progress', 'In Review', 'Done']);
    const rules = await prisma.workTransition.findMany({ where: { workflow: { projectId: pid, isDefault: true }, toStatusId: st[3].id }, select: { fromStatusId: true, rules: true } });
    assert.deepEqual(rules.map((x) => [x.fromStatusId, (x.rules as any).notAssignee]), [[st[2].id, true]]);
    const pages = await prisma.workPage.findMany({ where: { projectId: pid }, select: { title: true, contentText: true } });
    assert.ok(pages.length >= 7);
    assert.ok(pages.every((p) => !p.contentText), 'cây Docs trống (chỉ tiêu đề)');
    // Done rules chặn đúng trường mới.
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    const n = await newIssue(pid, 'TASK', 'Việc đầu tiên', { assigneeId: dev.id });
    await call(dev, 'POST', `/projects/${pid}/issues/${n}/move`, { statusId: st[2].id });
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${n}/move`, { statusId: st[3].id })).code, 'WORK_DONE_REQUIREMENTS');
    await call(lead, 'PUT', `/projects/${pid}/issues/${n}/custom-values`, { values: { [ev.id]: 'link' } });
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${n}/move`, { statusId: st[3].id })).status, 200);
    // Dự án mẫu ở không gian khác / người ngoài ⇒ không chép được.
    assert.equal((await call(outsider, 'POST', `/workspaces/${wsId}/projects`, { key: 'CX', name: 'x', fromProjectId: src })).status, 404);
  });

  // ═══ A2 / D12 / D13 — code ════════════════════════════════════

  it('A2 + D12: PR có CI + cờ PR lớn; nhánh sống quá N ngày; panel thẻ có CI', async () => {
    const pid = pids.SCRUM;
    await call(lead, 'POST', `/projects/${pid}/github`, {});
    await call(lead, 'PATCH', `/projects/${pid}/github`, { repoFullName: 'acme/labflow' });
    const n = await newIssue(pid, 'TASK', 'Room lookup');
    await prisma.workGitPull.createMany({
      data: [
        { projectId: pid, provider: 'GITHUB', number: 7, title: `SC-${n} Room lookup`, state: 'open', headRef: 'feature/SC-1', baseRef: 'main', issueNumbers: [n], additions: 350, deletions: 80, headSha: 'abc1234def5678', ciState: 'failure', ciUrl: 'https://github.com/acme/labflow/actions/runs/1', ciAt: new Date(), openedAt: new Date(), authorLogin: dev.username },
        { projectId: pid, provider: 'GITHUB', number: 8, title: 'small', state: 'open', headRef: 'fix/x', baseRef: 'main', issueNumbers: [], additions: 10, deletions: 2, headSha: 'fff0000aaa', ciState: 'success', openedAt: new Date() },
      ],
    });
    await prisma.workGitBranch.createMany({
      data: [
        { projectId: pid, provider: 'GITHUB', name: 'feature/SC-1', issueNumbers: [n], createdAt: new Date(Date.now() - 6 * 86_400_000), lastPushAt: new Date() },
        { projectId: pid, provider: 'GITHUB', name: 'fix/x', createdAt: new Date(Date.now() - 86_400_000) },
        { projectId: pid, provider: 'GITHUB', name: 'main', createdAt: new Date(Date.now() - 60 * 86_400_000) },
      ],
    });
    const pulls = await call(lead, 'GET', `/projects/${pid}/code/pulls?state=all`);
    assert.equal(pulls.status, 200);
    const p7 = pulls.data.items.find((x: any) => x.number === 7);
    assert.equal(p7.ciState, 'failure');
    assert.match(p7.ciUrl, /actions/);
    assert.equal(p7.large, true);
    assert.equal(p7.lines, 430);
    assert.equal(pulls.data.items.find((x: any) => x.number === 8).large, false);
    assert.equal(pulls.data.largeCount, 1);
    const br = await call(lead, 'GET', `/projects/${pid}/code/branches`);
    assert.equal(br.data.items.find((x: any) => x.name === 'feature/SC-1').stale, true);
    assert.equal(br.data.items.find((x: any) => x.name === 'fix/x').stale, false);
    assert.equal(br.data.items.find((x: any) => x.name === 'main').stale, false);
    assert.equal(br.data.staleCount, 1);
    // Ngưỡng theo settings.codeHealth.
    await call(lead, 'PATCH', `/projects/${pid}`, { settings: { codeHealth: { branchMaxDays: 10, prMaxLines: 1000 } } });
    assert.equal((await call(lead, 'GET', `/projects/${pid}/code/branches`)).data.staleCount, 0);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/code/pulls`)).data.largeCount, 0);
    const dev1 = await call(lead, 'GET', `/projects/${pid}/code/issues/${n}`);
    assert.equal(dev1.data.ci, 'failure');
    assert.equal(dev1.data.groups.find((g: any) => g.kind === 'PR').ciState, 'failure');
  });

  it('D13: sức khoẻ repo 5 mục (đọc qua API GitHub giả)', async () => {
    clearSourceCache();
    const r = await call(lead, 'GET', `/projects/${pids.SCRUM}/code/health`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.deepEqual(r.data.items.map((i: any) => `${i.key}:${i.state}`), ['gitignore:ok', 'envExample:missing', 'prTemplate:missing', 'ci:ok', 'branchProtection:missing']);
  });

  // ═══ D11 + C7 — AI review chỉ phản biện + sổ AI Usage ═════════

  it('D11: mode=critic ⇒ phiên review không còn khối mã; C7: một dòng AI Usage review:n, đặt Chấp nhận được', async () => {
    const pid = pids.SCRUM;
    const r = await call(lead, 'POST', `/projects/${pid}/code/review`, { pr: 7, mode: 'critic', postToGithub: false });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.mode, 'critic');
    const rev = await prisma.workReviewSession.findFirstOrThrow({ where: { projectId: pid, number: r.data.review }, include: { items: true } });
    const all = JSON.stringify(rev);
    assert.doesNotMatch(all, /```/);
    assert.doesNotMatch(all, /prepareStatement\(sql\)\)/);
    assert.match(rev.notes ?? '', /critic|phản biện/);
    const finding = rev.items.find((i) => i.result === 'NG' && i.question.includes('PreparedStatement'));
    assert.ok(finding && /\?/.test(finding.note ?? ''), 'gợi ý thành câu hỏi gợi mở');
    const log = await prisma.workAiUsageLog.findFirstOrThrow({ where: { projectId: pid, sourceKey: `review:${r.data.review}` } });
    assert.equal(log.source, 'AUTO');
    assert.equal(log.phase, 'Implementation');
    assert.match(log.task, /Code review/);
    const upd = await call(lead, 'PATCH', `/projects/${pid}/fpt-reports/ai-usage/${log.id}`, { decision: 'ACCEPTED', validation: 'Đã tự sửa bằng try-with-resources' });
    assert.equal(upd.status, 200, JSON.stringify(upd.raw));
    assert.equal(upd.data.decision, 'ACCEPTED');
    // Bản xuất 10 cột: quyết định nằm đầu cột Validation.
    const x = await download(lead, `/projects/${pid}/fpt-reports/ai-usage/export`);
    assert.equal(x.status, 200);
    const sheet = readXlsx(x.buf).find((s) => [...s.cells.values()].some((c) => String(c ?? '').startsWith('Decision: Accepted')));
    assert.ok(sheet, 'có ô "Decision: Accepted — …"');
  });

  // ═══ D14 — version ════════════════════════════════════════════

  it('D14: freeze + tag/SHA; release chặn khi CI đỏ ở SHA (cờ dự án), xanh ⇒ ghi releaseCi', async () => {
    const pid = pids.SCRUM;
    const v = await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v1.0', freezeLevel: 'FEATURE', gitTag: 'v1.0.0' });
    assert.equal(v.status, 201, JSON.stringify(v.raw));
    assert.equal(v.data.freezeLevel, 'FEATURE');
    assert.equal((await call(lead, 'PATCH', `/projects/${pid}/versions/${v.data.id}`, { gitTag: 'bad tag!' })).code, 'WORK_BAD_TAG');
    assert.equal((await call(lead, 'PATCH', `/projects/${pid}/versions/${v.data.id}`, { commitSha: 'xyz' })).code, 'WORK_BAD_SHA');
    const up = await call(lead, 'PATCH', `/projects/${pid}/versions/${v.data.id}`, { freezeLevel: 'CODE', commitSha: 'ABC1234' });
    assert.equal(up.data.commitSha, 'abc1234');
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'version.freeze' } }));
    await call(lead, 'PATCH', `/projects/${pid}`, { settings: { releaseRequireGreenCi: true } });
    const blocked = await call(lead, 'POST', `/projects/${pid}/versions/${v.data.id}/release`, { moveUnresolvedTo: null });
    assert.equal(blocked.status, 409);
    assert.equal(blocked.code, 'WORK_RELEASE_CI');
    await prisma.workGitPull.updateMany({ where: { projectId: pid, number: 7 }, data: { ciState: 'success' } });
    const rel = await call(lead, 'POST', `/projects/${pid}/versions/${v.data.id}/release`, { moveUnresolvedTo: null, gitTag: 'v1.0.1' });
    assert.equal(rel.status, 200, JSON.stringify(rel.raw));
    assert.equal(rel.data.version.releaseCi, 'success');
    assert.equal(rel.data.version.gitTag, 'v1.0.1');
    assert.equal(rel.data.ci.pr, 7);
  });

  it('D14 × G3: releaseVersion gọi assertTestGate — block ⇒ 409 WORK_TEST_GATE khi RA chưa đạt, warn ⇒ release + trả testGate', async () => {
    const pid = pids.SWP391_SOLO5; // bộ SOLO đặt testGate='block'
    const n = await newIssue(pid, 'BUG', 'Lỗi mở chưa sửa', { priority: 1 });
    void n;
    const v = await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v-gate' });
    const r = await call(lead, 'POST', `/projects/${pid}/versions/${v.data.id}/release`, { moveUnresolvedTo: null });
    if (r.status === 409) {
      assert.equal(r.code, 'WORK_TEST_GATE');
      await call(lead, 'PATCH', `/projects/${pid}`, { settings: { testGate: 'warn' } });
      const r2 = await call(lead, 'POST', `/projects/${pid}/versions/${v.data.id}/release`, { moveUnresolvedTo: null });
      assert.equal(r2.status, 200, JSON.stringify(r2.raw));
      assert.equal(r2.data.testGate.mode, 'warn');
      assert.equal(r2.data.testGate.met, false);
    } else {
      // Tiêu chí RA mặc định đạt khi dự án chưa có gì để kiểm ⇒ vẫn phải trả kết quả cổng.
      assert.equal(r.status, 200, JSON.stringify(r.raw));
      assert.equal(r.data.testGate.mode, 'block');
      assert.equal(r.data.testGate.met, true);
    }
  });

  it('D14: chốt đóng băng (assertVersionFreeze) — MEMBER bị chặn, ADMIN vượt có audit', async () => {
    const pid = pids.SCRUM;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    const v = await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v2.0', freezeLevel: 'FEATURE' });
    const { assertVersionFreeze } = await import('../services/work/versionFreeze.js');
    const story = await typeId(pid, 'STORY');
    const task = await typeId(pid, 'TASK');
    await assert.rejects(() => prisma.$transaction((tx) => assertVersionFreeze(tx, { projectId: pid, versionId: v.data.id, typeId: story, priority: 3, actor: { kind: 'USER', userId: dev.id } })), (e: any) => e.code === 'WORK_VERSION_FROZEN');
    await prisma.$transaction((tx) => assertVersionFreeze(tx, { projectId: pid, versionId: v.data.id, typeId: task, priority: 3, actor: { kind: 'USER', userId: dev.id } }));
    await prisma.$transaction((tx) => assertVersionFreeze(tx, { projectId: pid, versionId: v.data.id, typeId: story, priority: 3, actor: { kind: 'USER', userId: lead.id }, issueKey: 'SC-9' }));
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'version.freeze_override' } }));
    await prisma.$transaction((tx) => assertVersionFreeze(tx, { projectId: pid, versionId: v.data.id, typeId: story, priority: 3, actor: { kind: 'AUTOMATION' } }));
  });

  it('D14 qua REST (khi issueChange đã nối assertVersionFreeze)', { skip: !issueChangeWired }, async () => {
    const pid = pids.SCRUM;
    const v = await prisma.workVersion.findFirstOrThrow({ where: { projectId: pid, name: 'v2.0' } });
    const r = await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: await typeId(pid, 'STORY'), title: 'New feature after freeze', fixVersionId: v.id });
    assert.equal(r.code, 'WORK_VERSION_FROZEN');
    const n = await newIssue(pid, 'STORY', 'Story outside');
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/issues/${n}`, { fixVersionId: v.id })).code, 'WORK_VERSION_FROZEN');
  });

  // ═══ C5 — giờ theo vai ════════════════════════════════════════

  it('C5: worklog chọn mũ; báo cáo giờ theo vai/tuần + cảnh báo QA thấp; contrib xlsx có sheet By role', async () => {
    const pid = pids.SWP391_SOLO5;
    const n = await newIssue(pid, 'TASK', 'Code booking API', { labelIds: [] });
    const at = new Date().toISOString();
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${n}/worklogs`, { minutes: 600, startedAt: at, activity: 'Coding' })).status, 201);
    const qaLog = await call(lead, 'POST', `/projects/${pid}/issues/${n}/worklogs`, { minutes: 30, startedAt: at, hat: 'C5' });
    assert.equal(qaLog.data.hat, 'C5');
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${n}/worklogs`, { minutes: 30, hat: 'C9' })).status, 400);
    const r = await call(lead, 'GET', `/projects/${pid}/reports/hours-by-role`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const w = r.data.weeks.at(-1);
    assert.equal(w.hours.C3, 10);
    assert.equal(w.hours.C5, 0.5);
    assert.ok(w.alerts.some((a: any) => a.code === 'QA_LOW'));
    assert.equal(r.data.guessedHours, 10);
    // Đổi mũ của lần ghi cũ (PATCH meta).
    const logs = await prisma.workWorklog.findMany({ where: { issue: { projectId: pid, number: n } }, orderBy: { id: 'asc' } });
    assert.equal((await call(lead, 'PATCH', `/projects/${pid}/issues/${n}/worklogs/${logs[0].id}`, { hat: 'C5' })).status, 200);
    const r2 = await call(lead, 'GET', `/projects/${pid}/reports/hours-by-role`);
    assert.ok(!r2.data.weeks.at(-1).alerts.some((a: any) => a.code === 'QA_LOW'));
    const today = new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);
    const x = await download(lead, `/projects/${pid}/contrib/export.xlsx?preset=custom&from=${today}&to=${today}`);
    assert.equal(x.status, 200);
    const byRole = readXlsx(x.buf).find((s) => s.name === 'By role');
    assert.ok(byRole, 'sheet By role');
    assert.equal(byRole!.cells.get('B1'), 'C1 PM / Leader (h)');
  });

  // ═══ C3 — Weekly ghi số WBS ═══════════════════════════════════

  it('C3: Weekly mục I ghi số WBS đầu cột Notes; Bug ngoài WBS có ghi chú', async () => {
    const pid = pids.SWP391_SOLO5;
    const b = await newIssue(pid, 'BUG', 'Lỗi trùng giờ');
    await call(lead, 'POST', `/projects/${pid}/issues/${b}/worklogs`, { minutes: 30 });
    const { composeWeekly } = await import('../services/work/fptReports.service.js');
    const w = await composeWeekly(pid, new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10));
    const task = w.status.find((s) => s.task === 'Code booking API')!;
    assert.match(task.notes, /^WBS \d+(\.\d+)+ · SO-\d+/);
    const bug = w.status.find((s) => s.task === 'Lỗi trùng giờ')!;
    assert.match(bug.notes, /not in WBS/);
  });

  // ═══ C8 / C10 — CR & RAID ═════════════════════════════════════

  it('C8: ma trận ảnh hưởng 6 chiều + 3 phương án; tách CR-na/nb; checklist đồng bộ chỉ mở sau duyệt', async () => {
    const pid = pids.SWP391_SOLO5;
    const cr = await call(lead, 'POST', `/projects/${pid}/changes`, {
      title: 'Thêm duyệt 2 cấp', useTemplate: false,
      impactMatrix: { scope: { level: 'HIGH', note: '2 màn mới' }, schedule: { level: 'MEDIUM' }, docs: { level: 'LOW', note: 'SRS + RTM' } },
      options: [{ title: 'Làm trong I2', effortDays: 3, chosen: true }, { title: 'Dời sang I3' }, { title: 'Không làm' }],
    });
    assert.equal(cr.status, 201, JSON.stringify(cr.raw));
    assert.equal(cr.data.impactMatrix.scope.level, 'HIGH');
    assert.equal(cr.data.impactMatrix.cost.level, 'NONE');
    assert.equal(cr.data.impactLevel, 'HIGH');
    assert.deepEqual(cr.data.options.map((o: any) => o.key), ['A', 'B', 'C']);
    const num = cr.data.number;
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/changes/${num}/sync`, { srsRoc: true })).status, 409);
    const sp = await call(lead, 'POST', `/projects/${pid}/changes/${num}/split`, { parts: [{ title: 'Duyệt cấp 1' }, { title: 'Duyệt cấp 2', scheduleDays: 2 }] });
    assert.equal(sp.status, 201, JSON.stringify(sp.raw));
    assert.deepEqual(sp.data.created.map((c: any) => c.splitKey), [`CR-${num}a`, `CR-${num}b`]);
    assert.equal(sp.data.changeRequest.children.length, 2);
    const child = await call(lead, 'GET', `/projects/${pid}/changes/${sp.data.created[1].number}`);
    assert.equal(child.data.splitKey, `CR-${num}b`);
    assert.equal(child.data.parentNumber, num);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/changes/${sp.data.created[0].number}/split`, { parts: [{ title: 'x' }] })).code, 'WORK_CR_SPLIT_NESTED');
    const list = await call(lead, 'GET', `/projects/${pid}/changes`);
    assert.ok(list.data.items.some((r: any) => r.splitKey === `CR-${num}a`));
    await prisma.workChangeRequest.updateMany({ where: { projectId: pid, number: num }, data: { status: 'APPROVED', decidedAt: new Date() } });
    const s1 = await call(lead, 'PUT', `/projects/${pid}/changes/${num}/sync`, { srsRoc: true, rtm: true });
    assert.equal(s1.status, 200, JSON.stringify(s1.raw));
    assert.equal(s1.data.syncDone, 2);
    const s2 = await call(lead, 'PUT', `/projects/${pid}/changes/${num}/sync`, { trackingQna: true, trackingIssues: true, trackingWbs: true });
    assert.equal(s2.data.syncDone, 5);
    assert.ok(s2.data.syncItems.every((i: any) => i.done));
  });

  it('C10: RAID có Plan B (contingency); Risk ⇒ thẻ + liên kết', async () => {
    const pid = pids.SWP391_SOLO5;
    const r = await call(lead, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: 'Demo hỏng mạng', probability: 3, impact: 5, mitigation: 'Chạy local', contingency: 'Phát clip demo quay sẵn' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.contingency, 'Phát clip demo quay sẵn');
    const t = await call(lead, 'POST', `/projects/${pid}/raid/${r.data.number}/to-issue`, { use: 'contingency' });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    assert.match(t.data.issue.title, /^Plan B for R-\d+: Demo hỏng mạng$/);
    assert.ok(t.data.raid.links.some((l: any) => l.issue?.number === t.data.issue.number));
    const issue = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: t.data.issue.number } });
    assert.match(issue.descriptionText ?? '', /clip demo/);
  });

  // ═══ settings G4 qua PATCH ════════════════════════════════════

  it('PATCH settings: present / aiReviewMode được chuẩn hoá', async () => {
    const pid = pids.SCRUM;
    const r = await call(lead, 'PATCH', `/projects/${pid}`, { settings: { present: { durationMin: 12, marks: [{ atMin: 8, label: 'Demo' }, { atMin: 2, label: 'Mở đầu' }], planBUrl: 'https://drive.google.com/x', planBLabel: 'Clip demo' }, aiReviewMode: 'nope' } });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const s = (await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } })).settings as Record<string, any>;
    assert.deepEqual(s.present.marks.map((m: any) => m.atMin), [2, 8]);
    assert.equal(s.present.planBUrl, 'https://drive.google.com/x');
    assert.equal(s.aiReviewMode, null);
  });
});
