/**
 * "Create with CuongMini" (20/10/2026) — test CSDL đầu-cuối với MODEL GIẢ (không tốn tiền, không mạng):
 * bản nháp ⇒ tải tệp ⇒ đọc & tóm tắt ⇒ chấp nhận (xem trước) ⇒ sửa tay + nhờ sửa ⇒ tạo ⇒ dự án/thẻ/sprint/trang/rủi ro/
 * họp/test/tài nguyên/tệp đúng; người chưa có tài khoản ⇒ "Planned owner" + tự giao khi vào nhóm; lỗi giữa chừng ⇒ gỡ sạch;
 * huỷ job; người khác không thấy bản nháp. Kho tệp: storage sandbox tự bật trong test (không bao giờ R2 thật).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.taoCuongMini.db.test.ts
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

/* 27/10/2026: ngày TƯƠNG ĐỐI — ngày cố định (bắt đầu 26/10) làm test hỏng khi qua ngày đó ("no upcoming meetings"). */
const ngayToi = (n: number): string => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `tcm${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

/** Đầu ra giả theo việc (đọc từ system prompt). */
function fakeAnswer(system: string, user: string): string {
  if (system.includes('SUMMARY OF WHAT YOU UNDERSTOOD')) {
    return JSON.stringify({
      goal: 'Website quản lý nhà trọ cho sinh viên', scopeIn: ['Đăng tin phòng', 'Đặt lịch xem phòng'], scopeOut: ['Thanh toán online'],
      deliverables: [{ name: 'Report 1', due: ngayToi(16), criteria: 'SRS v1' }], grading: ['Demo 40%'],
      tech: { stack: ['Java', 'Servlet/JSP'], repoFindings: [] },
      team: [{ name: 'Lead Person', proposedRole: 'Leader', why: 'Mạnh nhất' }], timeline: ['10 tuần'], strategy: ['Theo module'],
      assumptions: ['Nhóm 3 người'], risks: ['Trễ hạn'], questions: [{ q: 'Có cần app mobile không?' }],
    });
  }
  if (system.includes('OUTLINE')) {
    return '```json\n' + JSON.stringify({
      description: 'Hệ thống nhà trọ', labels: [{ name: 'backend', color: '#2563eb' }], components: [{ name: 'Rooms', description: 'Phòng', area: 'be' }],
      epics: [{ key: 'E1', title: 'Quản lý phòng', area: 'be', priority: 2, milestone: 'Report 1', component: 'Rooms' }, { key: 'E2', title: 'Đặt lịch xem', area: 'fe', dependsOn: ['E1'] }],
      sprintGoals: ['Nền tảng + đăng tin', 'Đặt lịch'], risks: [{ title: 'Trễ hạn Report 1', probability: 3, impact: 4, mitigation: 'Chia nhỏ', owner: 'Lead Person' }],
      dod: ['Đã review', 'Có test'], dor: ['Có tiêu chí'], glossary: [{ term: 'Chủ trọ', meaning: 'Người cho thuê' }],
    }) + '\n```';
  }
  if (system.includes('break epic')) {
    const key = /break epic (E\d+)/.exec(system)?.[1] ?? 'E1';
    return JSON.stringify({ items: [
      { key: `${key}-1`, kind: 'STORY', title: `${key} story A`, description: 'As a tenant…', criteria: ['Given…'], points: 3, priority: 2, difficulty: 3, area: 'be', labels: ['backend'], component: 'Rooms', subtasks: ['API', 'UI'] },
      { key: `${key}-2`, kind: 'TASK', title: `${key} task B`, points: 2, difficulty: 1, area: 'fe', blockedBy: [`${key}-1`] },
    ] });
  }
  if (system.includes('TEST CASES')) return JSON.stringify({ tests: [{ title: 'Đăng tin hợp lệ', story: 'E1-1', steps: [{ action: 'Mở form', expected: 'Form hiện' }] }] });
  if (system.includes('Docs pages')) {
    const kinds = [...system.matchAll(/kind "([A-Z_]+)"/g)].map((m) => m[1]);
    return JSON.stringify({ pages: kinds.map((k) => ({ kind: k, title: `Trang ${k}`, markdown: `# ${k}\n\nNội dung **${k}**.` })) });
  }
  if (system.includes('asks for a change')) {
    const first = /([A-Z0-9]+:i\d+) \| STORY/.exec(user)?.[1] ?? '';
    return JSON.stringify({ note: 'Tăng điểm', ops: [{ op: 'update', ref: first, set: { points: 8 } }] });
  }
  return '{}';
}

describe('CT Work — Create with CuongMini (DB)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, other: U;
  let wsId = 0;
  let svc: typeof import('../services/work/taoCuongMini/banNhap.service.js');
  let model: typeof import('../services/work/taoCuongMini/goiModel.js');
  let gate: { hold: boolean } = { hold: false };

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, fullName: name === 'dev' ? 'Dev Có Tài Khoản' : null } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` }, body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }
  async function upload(u: U, path: string, name: string, content: string, fields: Record<string, string>) {
    const fd = new FormData();
    fd.append('file', new Blob([content], { type: 'text/markdown' }), name);
    for (const [k, v] of Object.entries(fields)) fd.append(k, v);
    const res = await fetch(`${base}/api/v1/work${path}`, { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: fd });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }
  const settle = async (id: number) => { await svc._waitJob(id, 60_000); return (await call(lead, 'GET', `/setup-drafts/${id}`)).data; };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    svc = await import('../services/work/taoCuongMini/banNhap.service.js');
    model = await import('../services/work/taoCuongMini/goiModel.js');
    model._datModelChoTest({
      coKey: async () => true, congHong: () => false, baoHong: () => undefined, hanMuc: async () => ({ het: false }),
      moKhoaCao: async () => false, khoaDaBat: async () => true, laAdmin: async () => false, kiemDuPhong: async () => undefined,
      chinhHang: async (o) => {
        while (gate.hold && !o.signal?.aborted) await new Promise((r) => setTimeout(r, 10));
        if (o.signal?.aborted) throw new Error('aborted');
        return { text: fakeAnswer(o.system, o.messages[0].content), biCat: false, usd: 0.002 };
      },
      duPhong: async () => { throw new Error('fallback should not be used'); },
    });
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, other] = await Promise.all(['lead', 'dev', 'other'].map(mkUser));
    wsId = (await call(lead, 'POST', '/workspaces', { name: `CuongMini ${tag}` })).data.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, other.email], role: 'MEMBER' });
  });

  after(async () => {
    model?._datModelChoTest(null);
    server?.close();
    if (wsId) await prisma.workSpace.delete({ where: { id: wsId } }).catch(() => undefined);
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  let draftId = 0;
  const newbieEmail = `${tag}_newbie@test.local`;

  it('tạo bản nháp + tải tệp đề bài + đọc danh sách dán từ Excel', async () => {
    const roster = await call(lead, 'POST', `/workspaces/${wsId}/setup/roster`, { text: `Họ và tên\tMSSV\tEmail\tTrình độ\nLead Person\tSE100001\t\tGiỏi\nDev Có Tài Khoản\tSE100002\t${dev.email}\tKhá\nNguyễn Văn Mới\tSE100003\t${newbieEmail}\tMới` });
    assert.equal(roster.status, 200, JSON.stringify(roster.raw));
    assert.equal(roster.data.rows.length, 3);
    const d = await call(lead, 'POST', `/workspaces/${wsId}/setup-drafts`, {
      mode: 'PROJECT',
      input: {
        overview: { name: 'Nhà trọ SV', key: 'NTS', template: 'BLANK', type: 'SCRUM', courseCode: 'PRJ301', language: 'vi' },
        team: { members: roster.data.rows, rules: ['BY_LEVEL', 'LEADER_REVIEWS'] },
        timeline: { startDate: ngayToi(1), endDate: ngayToi(56), sprintWeeks: 2, milestones: [{ name: 'Report 1', date: ngayToi(16) }] },
        reviewFirst: true,
      },
    });
    assert.equal(d.status, 201, JSON.stringify(d.raw));
    draftId = d.data.id;
    const up = await upload(lead, `/setup-drafts/${draftId}/files`, 'đề-bài.md', '# Đề bài\nXây dựng website quản lý nhà trọ.', { category: 'BRIEF', note: 'Đề của thầy' });
    assert.equal(up.status, 201, JSON.stringify(up.raw));
    assert.equal(up.data.source.status, 'OK');
    assert.equal(up.data.source.name, 'đề-bài.md', 'tên tệp tiếng Việt giữ nguyên');
    assert.equal(up.data.draft.sources[0].text, undefined, 'chữ đã rút không ra client');
    // Người khác không thấy bản nháp.
    assert.equal((await call(other, 'GET', `/setup-drafts/${draftId}`)).status, 404);
  });

  it('đọc & tóm tắt ⇒ UNDERSTOOD (mọi thành viên có mặt)', async () => {
    const r = await call(lead, 'POST', `/setup-drafts/${draftId}/understand`, {});
    assert.equal(r.status, 202, JSON.stringify(r.raw));
    const d = await settle(draftId);
    assert.equal(d.status, 'UNDERSTOOD', d.error);
    assert.equal(d.understanding.team.length, 3);
    assert.equal(d.understanding.questions[0].q, 'Có cần app mobile không?');
    assert.ok(d.usage.calls >= 1);
  });

  it('chấp nhận (xem trước) ⇒ READY: thẻ, sprint, trang, cảnh báo; sửa tay + nhờ sửa', async () => {
    const d0 = (await call(lead, 'GET', `/setup-drafts/${draftId}`)).data;
    const u = { ...d0.understanding, questions: [{ q: d0.understanding.questions[0].q, answer: 'Không' }] };
    const r = await call(lead, 'POST', `/setup-drafts/${draftId}/accept`, { understanding: u, reviewFirst: true });
    assert.equal(r.status, 202, JSON.stringify(r.raw));
    const d = await settle(draftId);
    assert.equal(d.status, 'READY', d.error);
    const p = d.plan.projects[0];
    assert.equal(p.key, 'NTS');
    assert.equal(p.items.filter((i: any) => i.kind === 'EPIC').length, 2);
    assert.equal(p.items.filter((i: any) => i.labels.includes('onboarding')).length, 3, 'mỗi người một thẻ Onboarding');
    assert.ok(p.sprints.length >= 3);
    assert.ok(p.pages.some((x: any) => x.title.startsWith('AGENTS.md')));
    assert.ok(p.pages.some((x: any) => x.kind === 'RACI'));
    assert.ok(p.pages.some((x: any) => x.kind === 'MEMBER_BRIEFS'));
    const devM = d.plan.members.find((m: any) => m.email === dev.email);
    assert.equal(devM.mapping, 'USER');
    assert.equal(d.plan.members.find((m: any) => m.name === 'Lead Person').leader, true);
    // Người mới (level 1) không ôm việc khó một mình.
    const newbie = d.plan.members.find((m: any) => m.name === 'Nguyễn Văn Mới');
    for (const it of p.items) if (it.assigneeRef === newbie.ref && it.difficulty === 3) assert.ok(it.pairRef);

    // Sửa tay: đổi tên + khoá.
    const story = p.items.find((i: any) => i.kind === 'STORY');
    story.title = 'Đăng tin phòng (sửa tay)';
    story.locked = true;
    const patched = await call(lead, 'PATCH', `/setup-drafts/${draftId}`, { plan: d.plan });
    assert.equal(patched.status, 200, JSON.stringify(patched.raw));
    // Nhờ sửa: model đổi điểm story đầu tiên chưa khoá.
    const rv = await call(lead, 'POST', `/setup-drafts/${draftId}/revise`, { instruction: 'Tăng điểm story đầu tiên lên 8' });
    assert.equal(rv.status, 202, JSON.stringify(rv.raw));
    const d2 = await settle(draftId);
    assert.equal(d2.status, 'READY', d2.error);
    assert.equal(d2.plan.projects[0].items.find((i: any) => i.ref === story.ref).title, 'Đăng tin phòng (sửa tay)', 'sửa tay được giữ');
  });

  it('tạo ⇒ APPLIED: dự án + thẻ + sprint + mốc + trang + rủi ro + họp + test + tài nguyên + tệp; Planned owner', async () => {
    const before = (await call(lead, 'GET', `/setup-drafts/${draftId}`)).data.plan.projects[0];
    const r = await call(lead, 'POST', `/setup-drafts/${draftId}/apply`, { sendInvites: true });
    assert.equal(r.status, 202, JSON.stringify(r.raw));
    const d = await settle(draftId);
    assert.equal(d.status, 'APPLIED', d.error);
    const res = d.result.projects[0];
    const pid = res.id;
    assert.equal(res.issues, before.items.length);
    const issues = await prisma.workIssue.findMany({ where: { projectId: pid, deletedAt: null }, select: { id: true, title: true, assigneeId: true, sprintId: true, aiAssisted: true, type: { select: { key: true } } } });
    // + 1 thẻ "Tài liệu dự án" + 1 test case.
    assert.equal(issues.filter((i) => i.type.key !== 'TEST').length, before.items.length + 1);
    assert.ok(issues.some((i) => i.title.includes('sửa tay')));
    assert.ok(issues.filter((i) => i.type.key !== 'TEST').every((i) => i.aiAssisted), 'thẻ CuongMini soạn mang nhãn AI-assisted');
    assert.ok(issues.some((i) => i.assigneeId === dev.id), 'người có tài khoản được giao');
    assert.equal(await prisma.workSprint.count({ where: { projectId: pid } }), before.sprints.length);
    assert.ok(await prisma.workVersion.count({ where: { projectId: pid } }) >= 1);
    const pages = await prisma.workPage.findMany({ where: { projectId: pid, deletedAt: null }, select: { title: true, parentId: true } });
    const agents = pages.find((x) => x.title === 'AGENTS.md — hướng dẫn cho CuongMini');
    assert.ok(agents && agents.parentId === null, 'AGENTS.md ở gốc');
    assert.ok(pages.length >= before.pages.length);
    assert.equal(await prisma.workRaidItem.count({ where: { projectId: pid } }), 1);
    assert.ok(await prisma.workMeetingSeries.count({ where: { projectId: pid } }) >= 2);
    assert.equal(await prisma.workTestCase.count({ where: { issue: { projectId: pid } } }), 1);
    assert.ok(await prisma.workIssueLink.count({ where: { fromIssue: { projectId: pid } } }) >= 1, 'phụ thuộc "blocks"');
    assert.equal(res.files, 1, 'tệp đề bài đính kèm vào dự án (kho giả)');
    assert.ok(await prisma.workResource.count({ where: { projectId: pid } }) >= 1);
    // Người chưa có tài khoản: trường Planned owner + bản đồ email ⇒ thẻ + lời mời.
    const field = await prisma.workCustomField.findFirst({ where: { projectId: pid, name: 'Planned owner' } });
    assert.ok(field);
    const proj = await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } });
    const planned = (proj.settings as any).cuongMiniPlannedOwners as Array<{ email: string; issueIds: number[] }>;
    const mine = planned.find((x) => x.email === newbieEmail);
    assert.ok(mine && mine.issueIds.length >= 1);
    assert.equal(d.result.invites.sent, 1);
    assert.ok(await prisma.workInvite.count({ where: { workspaceId: wsId, email: newbieEmail } }) === 1);
    assert.equal(await prisma.user.count({ where: { email: newbieEmail } }), 0, 'không tự tạo tài khoản');
    // Sổ AI usage của dự án.
    assert.ok(await prisma.workAiCall.count({ where: { projectId: pid, kind: 'llm', tool: 'work_setup' } }) >= 1);

    // Người mới đăng ký + vào nhóm ⇒ việc dự kiến tự về tay họ.
    const nu = await prisma.user.create({ data: { username: `${tag}_newbie`, email: newbieEmail } });
    userIds.push(nu.id);
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: nu.id, role: 'MEMBER' } });
    const { applyPlannedOwners } = await import('../services/work/taoCuongMini/apDung.js');
    const n = await applyPlannedOwners(nu.id, wsId);
    assert.equal(n, mine.issueIds.length);
    assert.equal(await prisma.workIssue.count({ where: { id: { in: mine.issueIds }, assigneeId: nu.id } }), mine.issueIds.length);
    // Bản nháp đã dùng thì không sửa/tạo lại.
    assert.equal((await call(lead, 'POST', `/setup-drafts/${draftId}/apply`, {})).status, 409);
  });

  it('lỗi giữa chừng ⇒ không để lại dự án dở', async () => {
    const d = await call(lead, 'POST', `/workspaces/${wsId}/setup-drafts`, { input: { overview: { name: 'Rollback', key: 'RBK', template: 'BLANK' }, reviewFirst: true } });
    const id = d.data.id;
    await call(lead, 'POST', `/setup-drafts/${id}/understand`, {});
    await settle(id);
    await call(lead, 'POST', `/setup-drafts/${id}/accept`, { reviewFirst: true });
    const ready = await settle(id);
    assert.equal(ready.status, 'READY', ready.error);
    // Họp có ngày kết thúc TRƯỚC ngày bắt đầu ⇒ createSeries ném lỗi sau khi dự án + thẻ đã được tạo.
    ready.plan.projects[0].meetings = [{ ref: 'bad', title: 'Bad', type: 'WEEKLY', weekday: 1, hour: 9, minute: 0, durationMin: 30, intervalWeeks: 1, startDate: '2026-12-01', endDate: '2026-01-01', agenda: [] }];
    assert.equal((await call(lead, 'PATCH', `/setup-drafts/${id}`, { plan: ready.plan })).status, 200);
    await call(lead, 'POST', `/setup-drafts/${id}/apply`, {});
    const after = await settle(id);
    assert.equal(after.status, 'FAILED');
    assert.equal(after.failedPhase, 'APPLYING');
    assert.equal(await prisma.workProject.count({ where: { workspaceId: wsId, key: 'RBK' } }), 0, 'dự án dở đã bị gỡ');
  });

  it('huỷ job đọc ⇒ về DRAFT', async () => {
    const d = await call(lead, 'POST', `/workspaces/${wsId}/setup-drafts`, { input: { overview: { name: 'Cancel me' } } });
    gate.hold = true;
    await call(lead, 'POST', `/setup-drafts/${d.data.id}/understand`, {});
    await new Promise((r) => setTimeout(r, 50));
    assert.equal((await call(lead, 'GET', `/setup-drafts/${d.data.id}`)).data.status, 'READING');
    await call(lead, 'POST', `/setup-drafts/${d.data.id}/cancel`, {});
    gate.hold = false;
    const after = await settle(d.data.id);
    assert.equal(after.status, 'DRAFT');
    assert.equal(after.error, 'Cancelled.');
    assert.equal((await call(lead, 'DELETE', `/setup-drafts/${d.data.id}`)).status, 200);
  });

  it('Optimum cần khoá; model trong giao diện chỉ mang tên CuongMini', async () => {
    const m = await call(lead, 'GET', `/workspaces/${wsId}/setup/models`);
    assert.equal(m.status, 200);
    assert.deepEqual(m.data.map((x: any) => x.name), ['CuongMini Sonic 5.5', 'CuongMini Optimum 5.5']);
    assert.equal(m.data[1].locked, true);
    const d = await call(lead, 'POST', `/workspaces/${wsId}/setup-drafts`, { model: 'cm-optimum', input: { overview: { name: 'Opus' } } });
    const r = await call(lead, 'POST', `/setup-drafts/${d.data.id}/understand`, {});
    assert.equal(r.status, 403);
    assert.equal(r.raw.code, 'WORK_SETUP_KEY_REQUIRED');
  });
});
