/**
 * CT Work — đợt 1a (08/10/2026): 10 lỗi còn mở từ lần dùng thật (dự án CTW) — HTTP + Postgres thật. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw1a.db.test.ts
 *
 * CTW-27 move/PATCH rỗng ⇒ 400 · CTW-15 parentKey/parentNumber/typeKey · CTW-7 "Test" luật = chạy thử
 * CTW-9 tải theo sprint đang chạy + sức chứa · CTW-10 plan-sprint bỏ test case + ticket desk
 * CTW-17 action họp kế thừa sprint/giai đoạn/bộ phận + defaults · CTW-20 Docs IN_REVIEW chỉ đường
 * CTW-38 không duyệt tuần chưa hết · CTW-14 tiêu đề phê duyệt + loại yêu cầu desk theo ngôn ngữ dự án
 * CTW-18 kỳ xem trước báo cáo tuần = lastWeekPeriod (giờ dự án). Phần thuần: services/work/ctw1a.test.ts.
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
import { lastWeekPeriod } from '../services/work/projectTime.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c1a${Date.now().toString(36)}`;
const userIds: number[] = [];
const DAY = 86_400_000;

type U = { id: number; token: string; email: string };

describe('CT Work — đợt 1a sửa lỗi CTW (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U;
  let wsId = 0, pid = 0;
  let cfg: any;
  const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k)?.id;
  const status = (name: string) => cfg.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.name === name).id;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { json = { raw: text }; }
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, message: json.message ?? json.error?.message, raw: json, text };
  }
  const mk = async (title: string, extra: Record<string, unknown> = {}, u: U = owner) => {
    const r = await call(u, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title, ...extra });
    assert.equal(r.status, 201, r.text);
    return r.data;
  };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, dev] = await Promise.all(['owner', 'dev'].map(mkUser));
    wsId = (await call(owner, 'POST', '/workspaces', { name: `C1A ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'FP', name: 'Flying Pencil', template: 'BLANK' });
    assert.equal(p.status, 201, p.text);
    pid = p.data.id;
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('CTW-27: move thiếu statusId / thân rỗng / trường lạ ⇒ 400; PATCH rỗng ⇒ 400 nêu trường lạ', async () => {
    const i = await mk('Move me');
    for (const body of [{}, { statusId: undefined }, { version: 0 }]) {
      const r = await call(owner, 'POST', `/projects/${pid}/issues/${i.number}/move`, body);
      assert.equal(r.status, 400, `${JSON.stringify(body)} ${r.text}`);
      assert.equal(r.code, 'VALIDATION_ERROR');
      assert.match(r.message, /statusId/);
    }
    const typo = await call(owner, 'POST', `/projects/${pid}/issues/${i.number}/move`, { status: status('Done') });
    assert.equal(typo.status, 400);
    assert.match(typo.text, /status/);
    // Hợp lệ vẫn chạy như cũ.
    const okMove = await call(owner, 'POST', `/projects/${pid}/issues/${i.number}/move`, { statusId: status('Done') });
    assert.equal(okMove.status, 200, okMove.text);
    assert.equal((await call(owner, 'GET', `/projects/${pid}/issues/${i.number}`)).data.statusId, status('Done'));
    // PATCH: rỗng / chỉ trường lạ ⇒ 400, không còn 200 im lặng.
    const empty = await call(owner, 'PATCH', `/projects/${pid}/issues/${i.number}`, {});
    assert.equal(empty.status, 400, empty.text);
    const unknown = await call(owner, 'PATCH', `/projects/${pid}/issues/${i.number}`, { status: 'Done', assignee: 'me' });
    assert.equal(unknown.status, 400);
    assert.match(unknown.message, /Unknown field\(s\): status, assignee/);
    // Bulk đã có chặn từ trước — vẫn 400.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues/bulk`, { numbers: [i.number], patch: { status: 3 } })).status, 400);
  });

  let epicNum = 0;
  it('CTW-15: cha theo parentKey / parentNumber / parentId chữ; typeKey; lỗi rõ ràng, đủ mọi lỗi', async () => {
    assert.ok(type('EPIC'), 'mẫu BLANK có EPIC');
    epicNum = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeKey: 'epic', title: 'Màn 1' })).data.number;
    const epicId = (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: epicNum } })).id;
    const a = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: 'STORY', title: 'Story A', parentKey: `FP-${epicNum}` });
    assert.equal(a.status, 201, a.text);
    assert.equal(a.data.parentId, epicId);
    assert.equal(a.data.typeId, type('STORY'));
    const b = await call(owner, 'POST', `/projects/${pid}/issues`, { typeKey: 'TASK', title: 'Task B', parentNumber: epicNum });
    assert.equal(b.data.parentId, epicId);
    const c = await call(owner, 'POST', `/projects/${pid}/issues`, { typeKey: 'TASK', title: 'Task C', parentId: `FP-${epicNum}` });
    assert.equal(c.data.parentId, epicId);
    // Nội bộ vẫn chạy.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'Task D', parentId: epicId })).data.parentId, epicId);
    // PATCH + bulk nhận khoá thẻ; null gỡ cha.
    const loose = await mk('Loose');
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${loose.number}`, { parentKey: `#${epicNum}` })).data.parentId, epicId);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${loose.number}`, { parentKey: null })).data.parentId, null);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues/bulk`, { numbers: [loose.number], patch: { parentKey: `FP-${epicNum}` } })).status, 200);
    assert.equal((await call(owner, 'GET', `/projects/${pid}/issues/${loose.number}`)).data.parentId, epicId);
    // Lỗi rõ ràng.
    const notFound = await call(owner, 'POST', `/projects/${pid}/issues`, { typeKey: 'TASK', title: 'x', parentKey: 'FP-9999' });
    assert.equal(notFound.code, 'WORK_BAD_ISSUE_REF');
    assert.match(notFound.message, /parentKey: issue FP-9999 not found/);
    assert.match((await call(owner, 'POST', `/projects/${pid}/issues`, { typeKey: 'TASK', title: 'x', parentKey: 'ZZ-1' })).message, /belongs to another project/);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues`, { typeKey: 'TASK', title: 'x', parentId: epicId, parentNumber: loose.number })).code, 'WORK_BAD_ISSUE_REF');
    const badType = await call(owner, 'POST', `/projects/${pid}/issues`, { typeKey: 'STROY', title: 'x' });
    assert.equal(badType.code, 'WORK_BAD_TYPE');
    assert.match(badType.message, /this project has .*STORY/);
    const many = await call(owner, 'POST', `/projects/${pid}/issues`, { title: '', priority: 'high' });
    assert.equal(many.status, 400);
    assert.ok(many.raw.errors?.length >= 2 || many.raw.data?.errors?.length >= 2 || /more — see errors/.test(many.message), many.text);
    assert.doesNotMatch(many.text, /received nan/);
  });

  let sprint1 = 0;
  it('CTW-9: quá tải chỉ tính sprint đang chạy (+ sức chứa), có đơn vị', async () => {
    sprint1 = (await call(owner, 'POST', `/projects/${pid}/sprints`, {})).data.id;
    const s2 = (await call(owner, 'POST', `/projects/${pid}/sprints`, {})).data.id;
    await mk('Now', { assigneeId: dev.id, storyPoints: 2, sprintId: sprint1 });
    // Việc tương lai: 60 điểm trong sprint PLANNED — trước đây làm dev "quá tải".
    await mk('Later 1', { assigneeId: dev.id, storyPoints: 30, sprintId: s2 });
    await mk('Later 2', { assigneeId: dev.id, storyPoints: 30, sprintId: s2 });
    const st = await call(owner, 'POST', `/projects/${pid}/sprints/${sprint1}/start`, { startAt: new Date(Date.now() - DAY).toISOString(), endAt: new Date(Date.now() + 6 * DAY).toISOString() });
    assert.equal(st.status, 200, st.text);
    let ins = (await call(owner, 'GET', `/projects/${pid}/insights`)).data;
    assert.equal(ins.loadScope.kind, 'sprint');
    const devLoad = ins.loads.find((l: any) => l.username === `${tag}_dev`);
    assert.equal(devLoad.points, 2);
    assert.equal(devLoad.unit, 'points');
    assert.equal(ins.overloaded.length, 0, JSON.stringify(ins.overloaded));
    // Sức chứa: 1 h/ngày ⇒ vài điểm cả sprint; giao thêm 8 điểm trong sprint ⇒ quá tải theo sức chứa.
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/capacity/${dev.id}`, { hoursPerDay: 1 })).status, 200);
    await mk('Big now', { assigneeId: dev.id, storyPoints: 8, sprintId: sprint1 });
    ins = (await call(owner, 'GET', `/projects/${pid}/insights`)).data;
    const over = ins.overloaded.find((l: any) => l.username === `${tag}_dev`);
    assert.ok(over, JSON.stringify(ins.loads));
    assert.equal(over.basis, 'capacity');
    assert.ok(over.capacity > 0 && over.capacity < 10);
  });

  it('CTW-10: plan-sprint không coi test case / ticket desk là backlog thiếu ước lượng', async () => {
    const s3 = (await call(owner, 'POST', `/projects/${pid}/sprints`, {})).data.id;
    assert.equal((await call(owner, 'POST', `/projects/${pid}/tests/enable`, {})).status, 200);
    const t = await call(owner, 'POST', `/projects/${pid}/tests`, { title: 'Đăng nhập', steps: [{ action: 'Mở', expected: 'Form' }] });
    assert.equal(t.status, 201, t.text);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { serviceDesk: true } })).status, 200);
    const desk = await call(owner, 'POST', `/projects/${pid}/desk/tickets`, { requestType: 'INCIDENT', impact: 'LOW', urgency: 'LOW', title: 'Trang trắng' });
    assert.equal(desk.status, 201, desk.text);
    const plain = await mk('Backlog chưa ước lượng');
    const plan = await call(owner, 'POST', `/projects/${pid}/ai/plan-sprint`, { sprintId: s3 });
    assert.equal(plan.status, 200, plan.text);
    const w = plan.data.warnings.join(' | ');
    assert.ok(w.includes(`FP-${plain.number}`), w);
    assert.ok(!w.includes(`FP-${t.data.number}`) && !w.includes(`FP-${desk.data.number}`), w);
    assert.deepEqual(plan.data.excluded, { testCases: 1, deskTickets: 1 });
    const all = await call(owner, 'POST', `/projects/${pid}/ai/plan-sprint`, { sprintId: s3, includeTestCases: true, includeDeskTickets: true });
    assert.ok(all.data.warnings.join(' ').includes(`FP-${t.data.number}`));
  });

  it('CTW-7: "Test" luật mặc định CHẠY THỬ — không bình luận, không thông báo; execute:true mới chạy thật', async () => {
    const i = await mk('Rule target', { assigneeId: dev.id });
    const rule = await call(owner, 'POST', `/projects/${pid}/automation`, {
      name: 'Done ping', trigger: 'issue.transitioned',
      config: { actions: [{ kind: 'comment', text: 'Đã xong, cảm ơn!' }, { kind: 'notify', to: ['assignee'], text: 'Xong rồi' }] },
    });
    assert.equal(rule.status, 201, rule.text);
    const iid = (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: i.number } })).id;
    const notes0 = await prisma.socialNotification.count({ where: { receiverId: dev.id, type: 'WORK_ALERT', entityId: iid } });
    const dry = await call(owner, 'POST', `/projects/${pid}/automation/${rule.data.id}/test`, { number: i.number });
    assert.equal(dry.status, 200, dry.text);
    assert.equal(dry.data.dryRun, true);
    assert.equal(dry.data.status, 'DRY_RUN');
    assert.equal(dry.data.actions.length, 2);
    assert.match(dry.data.actions[0].summary, /Post an automation comment/);
    assert.match(dry.data.actions[1].summary, new RegExp(`Notify @${tag}_dev`));
    assert.equal(await prisma.workComment.count({ where: { issueId: iid } }), 0, 'chạy thử không bình luận');
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: dev.id, type: 'WORK_ALERT', entityId: iid } }), notes0, 'chạy thử không thông báo');
    const log = await prisma.workAutomationLog.findFirst({ where: { ruleId: rule.data.id }, orderBy: { id: 'desc' } });
    assert.equal(log?.status, 'DRY_RUN');
    assert.equal((await prisma.workAutomationRule.findUniqueOrThrow({ where: { id: rule.data.id } })).runCount, 0);
    const real = await call(owner, 'POST', `/projects/${pid}/automation/${rule.data.id}/test`, { number: i.number, execute: true });
    assert.equal(real.data.dryRun, false);
    assert.equal(real.data.status, 'SUCCESS');
    assert.match(real.data.message, /^Test run — commented, notified 1/);
    assert.equal(await prisma.workComment.count({ where: { issueId: iid } }), 1);
    await call(owner, 'DELETE', `/projects/${pid}/automation/${rule.data.id}`);
  });

  it('CTW-17: action họp ⇒ thẻ kế thừa sprint/giai đoạn/bộ phận; defaults ghi đè (epic theo khoá, sprint null)', async () => {
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { serviceDesk: true, meetings: true, stages: true, teams: true } })).status, 200);
    const stg = await call(owner, 'POST', `/projects/${pid}/stages`, { slug: 'man-1', name: 'Màn 1' });
    assert.equal(stg.status, 201, stg.text);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/stages/${stg.data.id}/activate`, {})).status, 200);
    const team = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'ART', name: 'Mỹ thuật', memberIds: [dev.id] });
    assert.equal(team.status, 201, team.text);
    const start = new Date();
    const m = await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Daily', type: 'DAILY', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 900_000).toISOString() });
    assert.equal(m.status, 201, m.text);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/meetings/${m.data.number}/actions`, { items: [{ text: 'Vẽ máy bay', assigneeId: dev.id }, { text: 'Chưa ai nhận' }] })).status, 200);
    const r = await call(owner, 'POST', `/projects/${pid}/meetings/${m.data.number}/actions/issues`, {});
    assert.equal(r.status, 201, r.text);
    const [a, b] = await Promise.all(r.data.created.map((c: any) => prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: c.number } })));
    assert.equal(a.sprintId, sprint1);
    assert.equal(a.stageId, stg.data.id);
    assert.equal(a.teamId, team.data.id);
    assert.equal(b.sprintId, sprint1);
    assert.equal(b.teamId, null);
    // Họp thứ hai: chỉnh mặc định — epic theo khoá, không sprint.
    const m2 = await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Review', type: 'WEEKLY', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 900_000).toISOString() });
    await call(owner, 'PUT', `/projects/${pid}/meetings/${m2.data.number}/actions`, { items: [{ text: 'Sửa đuôi máy bay' }] });
    const r2 = await call(owner, 'POST', `/projects/${pid}/meetings/${m2.data.number}/actions/issues`, { defaults: { parentKey: `FP-${epicNum}`, sprintId: null } });
    assert.equal(r2.status, 201, r2.text);
    const c = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: r2.data.created[0].number }, include: { parent: true } });
    assert.equal(c.parent?.number, epicNum);
    assert.equal(c.sprintId, null);
    assert.equal(c.stageId, stg.data.id);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/meetings/${m2.data.number}/actions/issues`, { defaults: { epic: 1 } })).status, 400);
  });

  it('CTW-20 + CTW-14: PATCH IN_REVIEW chỉ đường; POST /pages/:num/request-approval; tiêu đề duyệt theo tiếng Việt', async () => {
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}`, { settings: { language: 'vi' } })).status, 200);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { serviceDesk: true, meetings: true, stages: true, teams: true, docs: true, approvals: true } })).status, 200);
    const page = await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'GDD', markdown: '# GDD\n\nThiết kế màn 1' });
    assert.equal(page.status, 201, page.text);
    const n = page.data.number;
    const bad = await call(owner, 'PATCH', `/projects/${pid}/pages/${n}`, { status: 'IN_REVIEW' });
    assert.equal(bad.status, 400);
    assert.equal(bad.code, 'WORK_PAGE_APPROVAL_REQUIRED');
    assert.match(bad.message, new RegExp(`POST /api/v1/work/projects/${pid}/pages/${n}/request-approval`));
    assert.match(bad.message, /"targetType":"DOC"/);
    const req = await call(owner, 'POST', `/projects/${pid}/pages/${n}/request-approval`, { approverIds: [dev.id] });
    assert.equal(req.status, 201, req.text);
    assert.equal(req.data.title, 'Duyệt tài liệu: GDD');
    assert.equal((await call(owner, 'GET', `/projects/${pid}/pages/${n}`)).data.status, 'IN_REVIEW');
    const back = await call(owner, 'PATCH', `/projects/${pid}/pages/${n}`, { status: 'DRAFT' });
    assert.equal(back.status, 409);
    assert.equal(back.code, 'WORK_PAGE_PENDING_APPROVAL');
    assert.match(back.message, new RegExp(`/approvals/${req.data.id}/cancel`));
    assert.equal((await call(owner, 'POST', `/projects/${pid}/pages/${n}/request-approval`, { approverIds: [] })).status, 400);
    // Phê duyệt thẻ + loại yêu cầu desk cũng theo tiếng Việt.
    const i = await mk('Thẻ cần duyệt');
    const ap = await call(owner, 'POST', `/projects/${pid}/approvals`, { issueNumber: i.number, approverIds: [dev.id] });
    assert.equal(ap.status, 201, ap.text);
    assert.match(ap.data.title, /^Duyệt FP-\d+: Thẻ cần duyệt/);
    const ds = (await call(owner, 'GET', `/projects/${pid}/desk/settings`)).data;
    const types = ds.requestTypes ?? ds.config?.requestTypes;
    assert.equal(types.find((t: any) => t.key === 'INCIDENT').name, 'Báo sự cố');
  });

  it('CTW-18: kỳ xem trước báo cáo tuần theo giờ dự án = kỳ của AI weekly-report', async () => {
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { serviceDesk: true, meetings: true, stages: true, teams: true, docs: true, approvals: true, reports: true, clientPortal: true } })).status, 200);
    const pv = await call(owner, 'GET', `/projects/${pid}/reports/client-weekly/preview`);
    assert.equal(pv.status, 200, pv.text);
    const p = lastWeekPeriod(new Date());
    assert.deepEqual(pv.data.data.period, { from: p.from, to: p.to });
    assert.equal(pv.data.data.language, 'vi');
    assert.match(pv.data.markdown, /^# Cập nhật hằng tuần/);
  });

  it('CTW-38: tuần chưa hết ⇒ không duyệt được (409 + ngày duyệt được); 423 chỉ đường mở lại', async () => {
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { serviceDesk: true, meetings: true, stages: true, teams: true, docs: true, approvals: true, reports: true, clientPortal: true, finance: true } })).status, 200);
    const i = await mk('Giờ tuần này');
    const w = await call(owner, 'POST', `/projects/${pid}/issues/${i.number}/worklogs`, { minutes: 60 });
    assert.equal(w.status, 201, w.text);
    const view = (await call(owner, 'GET', `/projects/${pid}/finance/timesheet`)).data;
    const sub = await call(owner, 'POST', `/projects/${pid}/finance/timesheets/submit`, { weekStart: view.weekStart });
    assert.equal(sub.status, 201, sub.text);
    const v2 = (await call(owner, 'GET', `/projects/${pid}/finance/timesheet`)).data;
    assert.equal(v2.can.approve, false);
    const ap = await call(owner, 'POST', `/projects/${pid}/finance/timesheets/${sub.data.id}/approve`);
    assert.equal(ap.status, 409, ap.text);
    assert.equal(ap.code, 'WORK_WEEK_NOT_OVER');
    assert.match(ap.message, new RegExp(`ends on Sunday ${view.weekEnd}`));
    // Tuần vẫn SUBMITTED (chưa khoá cứng) ⇒ ghi giờ bị 423 chỉ đường withdraw.
    const locked = await call(owner, 'POST', `/projects/${pid}/issues/${i.number}/worklogs`, { minutes: 15 });
    assert.equal(locked.status, 423);
    assert.match(locked.message, new RegExp(`/finance/timesheets/${sub.data.id}/withdraw`));
    // Trả lại vẫn làm được ngay.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/timesheets/${sub.data.id}/return`, { reason: 'Thiếu giờ thứ Ba' })).status, 200);
    // Tuần ĐÃ duyệt (dữ liệu cũ trước bản sửa) ⇒ 423 chỉ đường reopen.
    await prisma.workTimesheet.update({ where: { id: sub.data.id }, data: { status: 'APPROVED' } });
    const l2 = await call(owner, 'POST', `/projects/${pid}/issues/${i.number}/worklogs`, { minutes: 15 });
    assert.equal(l2.status, 423);
    assert.match(l2.message, new RegExp(`POST /api/v1/work/projects/${pid}/finance/timesheets/${sub.data.id}/reopen`));
  });
});
