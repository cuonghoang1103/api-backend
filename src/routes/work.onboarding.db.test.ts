/**
 * Test lần chạy đầu (23/09): dữ liệu mẫu, lời hứa của mẫu dự án, tốc độ sprint
 * (Health không còn "0 pts/day"), tên sprint, tuỳ chọn cho MEMBER quản lý sprint.
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.onboarding.db.test.ts
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
import { computePace } from '../services/work/sprintPace.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `won${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };
const DAY = 86_400_000;

describe('computePace (thuần)', () => {
  const base = { name: 'Sprint 1', unit: 'POINTS' as const };
  it('5/21 điểm xong sau 3 ngày, không cần snapshot ⇒ tốc độ khác 0', () => {
    const now = new Date('2026-09-23T10:00:00+07:00');
    const p = computePace({
      ...base, now, startAt: new Date('2026-09-21T09:00:00+07:00'), endAt: new Date('2026-10-05T09:00:00+07:00'), committedPoints: 21,
      issues: [{ points: 5, resolved: true }, { points: 8, resolved: false }, { points: 8, resolved: false }],
    });
    assert.equal(p.elapsedDays, 3);
    assert.equal(p.remaining, 16);
    assert.equal(p.recentPerDay, 1.7);
    assert.notEqual(p.status, 'TOO_EARLY');
  });
  it('ngày đầu: không báo rủi ro', () => {
    const now = new Date('2026-09-23T15:00:00+07:00');
    const p = computePace({ ...base, now, startAt: new Date('2026-09-23T09:00:00+07:00'), endAt: new Date('2026-09-26T09:00:00+07:00'), committedPoints: 30, issues: [{ points: 30, resolved: false }] });
    assert.equal(p.status, 'TOO_EARLY');
    assert.equal(p.atRisk, false);
  });
  it('chưa ước lượng gì: không báo rủi ro', () => {
    const now = new Date('2026-09-30T10:00:00+07:00');
    const p = computePace({ ...base, now, startAt: new Date('2026-09-21T09:00:00+07:00'), endAt: new Date('2026-10-05T09:00:00+07:00'), committedPoints: 0, issues: [{ points: 0, resolved: false }] });
    assert.equal(p.status, 'NO_ESTIMATES');
    assert.equal(p.atRisk, false);
  });
  it('thêm phạm vi giữa sprint không kéo tốc độ về 0', () => {
    const now = new Date('2026-09-25T10:00:00+07:00');
    const p = computePace({
      ...base, now, startAt: new Date('2026-09-21T09:00:00+07:00'), endAt: new Date('2026-10-05T09:00:00+07:00'), committedPoints: 10,
      issues: [{ points: 5, resolved: true }, { points: 5, resolved: false }, { points: 5, resolved: false }],
    });
    assert.equal(p.recentPerDay, 1);
  });
});

describe('CT Work — lần chạy đầu (DB)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let wsId = 0;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }
  async function mkProject(key: string, template: string, extra: Record<string, unknown> = {}) {
    const r = await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key, name: `${key} project`, template, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const cfg = (await call(lead, 'GET', `/projects/${r.data.id}`)).data;
    return { pid: r.data.id as number, cfg };
  }
  const typeOf = (cfg: any, k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
  const doneStatus = (cfg: any) => cfg.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.category === 'DONE').id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev] = await Promise.all(['lead', 'dev'].map(mkUser));
    wsId = (await call(lead, 'POST', '/workspaces', { name: `Onboarding ${tag}` })).data.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('mẫu giữ lời hứa: SWP391 có "Sprint 1" chưa bắt đầu; SWR302 có thêm trường MoSCoW; BLANK thì không', async () => {
    const swp = await mkProject('SWPA', 'SWP391');
    assert.deepEqual(swp.cfg.sprints.map((s: any) => [s.name, s.state]), [['Sprint 1', 'PLANNED']]);
    const swr = await mkProject('SWRA', 'SWR302');
    assert.equal(swr.cfg.sprints[0]?.name, 'Sprint 1');
    const moscow = swr.cfg.customFields.find((f: any) => f.name === 'MoSCoW');
    assert.ok(moscow, 'có trường MoSCoW');
    assert.deepEqual(moscow.options.map((o: any) => o.label), ['Must', 'Should', 'Could', "Won't"]);
    const blank = await mkProject('BLNK', 'BLANK');
    assert.equal(blank.cfg.sprints.length, 0);
    assert.ok(Array.isArray(blank.cfg.settings.definitionOfDone));
    const off = await mkProject('SWPB', 'SWP391', { firstSprint: false });
    assert.equal(off.cfg.sprints.length, 0);
  });

  it('tên sprint luôn "Sprint N", không gắn mã dự án', async () => {
    const { pid } = await mkProject('NAME', 'SWP391');
    const s2 = await call(lead, 'POST', `/projects/${pid}/sprints`, {});
    assert.equal(s2.data.name, 'Sprint 2');
    await call(lead, 'POST', `/projects/${pid}/sprints`, { name: 'Hardening' });
    assert.equal((await call(lead, 'POST', `/projects/${pid}/sprints`, {})).data.name, 'Sprint 4');
  });

  it('dữ liệu mẫu SWP391: epic, story có điểm + tiêu chí, bug, việc con, nhãn, Sprint 1 có 6 story (chưa bắt đầu)', async () => {
    const { pid, cfg } = await mkProject('SHOP', 'SWP391');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/sample-data`)).status, 403, 'chỉ ADMIN');
    const mine = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: typeOf(cfg, 'TASK'), title: 'My own task' })).data;

    const r = await call(lead, 'POST', `/projects/${pid}/sample-data`);
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const all = await prisma.workIssue.findMany({ where: { projectId: pid, deletedAt: null }, select: { id: true, title: true, storyPoints: true, sprintId: true, descriptionText: true, type: { select: { key: true } } } });
    const by = (k: string) => all.filter((i) => i.type.key === k);
    assert.equal(by('EPIC').length, 3);
    assert.equal(by('STORY').length, 12);
    assert.equal(by('BUG').length, 3);
    assert.ok(by('SUBTASK').length >= 3);
    assert.ok(by('STORY').every((s) => s.storyPoints && s.storyPoints > 0));
    assert.ok(by('STORY').every((s) => /Acceptance criteria/.test(s.descriptionText ?? '') || (s.descriptionText ?? '').length > 20));
    assert.ok(all.every((i) => /^[\x20-\x7E×]+$/.test(i.title)), 'tiêu đề tiếng Anh');

    const sprint = await prisma.workSprint.findFirstOrThrow({ where: { projectId: pid, name: 'Sprint 1' } });
    assert.equal(sprint.state, 'PLANNED');
    assert.ok(sprint.startAt && sprint.endAt);
    assert.equal(Math.round((sprint.endAt!.getTime() - sprint.startAt!.getTime()) / DAY), 14);
    assert.equal(by('STORY').filter((s) => s.sprintId === sprint.id).length, 6);
    assert.ok((await prisma.workLabel.count({ where: { projectId: pid } })) >= 4);
    const created = await prisma.workHistory.count({ where: { issue: { projectId: pid }, field: 'created' } });
    assert.ok(created >= all.length, 'mỗi thẻ có dòng lịch sử "created"');

    const st = (await call(lead, 'GET', `/projects/${pid}/onboarding`)).data;
    assert.equal(st.steps.createIssues, true);
    assert.equal(st.steps.planSprint, true);
    assert.equal(st.steps.startSprint, false);
    assert.equal(st.sampleData.issues > 20, true);
    assert.equal(st.canAddSample, false);

    assert.equal((await call(lead, 'POST', `/projects/${pid}/sample-data`)).status, 409, 'không rải hai lần');

    // Người dùng viết thêm một việc con dưới story mẫu — gỡ mẫu không được mất nó.
    const story = by('STORY')[0];
    const child = (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: typeOf(cfg, 'SUBTASK'), title: 'Real work under a sample', parentId: story.id })).data;

    const d = await call(lead, 'DELETE', `/projects/${pid}/sample-data`);
    assert.equal(d.status, 200, JSON.stringify(d.raw));
    const left = await prisma.workIssue.findMany({ where: { projectId: pid }, select: { number: true } });
    assert.deepEqual(left.map((l) => l.number).sort((a, b) => a - b), [mine.number, child.number].sort((a, b) => a - b));
    assert.equal(await prisma.workLabel.count({ where: { projectId: pid } }), 0);
    assert.ok(await prisma.workSprint.findUnique({ where: { id: sprint.id } }), 'Sprint 1 của mẫu dự án vẫn còn');
    const p = await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } });
    assert.equal((p.settings as any).sampleData, undefined);
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/sample-data`)).status, 400);
  });

  it('không rải mẫu vào dự án đã có từ 3 thẻ', async () => {
    const { pid, cfg } = await mkProject('BUSY', 'BLANK');
    for (const t of ['a', 'b', 'c']) await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: typeOf(cfg, 'TASK'), title: t });
    const r = await call(lead, 'POST', `/projects/${pid}/sample-data`);
    assert.equal(r.status, 400);
    assert.equal(r.raw.code, 'WORK_SAMPLE_NOT_EMPTY');
  });

  it('dữ liệu mẫu SWT301: 6 test case có bước, gắn yêu cầu, một test plan; gỡ sạch', async () => {
    const { pid } = await mkProject('QAS', 'SWT301');
    assert.equal((await call(lead, 'POST', `/projects/${pid}/sample-data`)).status, 201);
    const tests = (await call(lead, 'GET', `/projects/${pid}/tests`)).data;
    assert.equal(tests.length, 6);
    const one = (await call(lead, 'GET', `/projects/${pid}/tests/${tests[0].number}`)).data;
    assert.ok(one.steps.length >= 2);
    const plans = (await call(lead, 'GET', `/projects/${pid}/test-plans`)).data;
    assert.equal(plans.length, 1);
    assert.equal(plans[0].testNumbers.length, 6);
    const links = await prisma.workIssueLink.count({ where: { type: 'TESTS', fromIssue: { projectId: pid } } });
    assert.equal(links, 6);
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/sample-data`)).status, 200);
    assert.equal(await prisma.workIssue.count({ where: { projectId: pid } }), 0);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/test-plans`)).data.length, 0);
  });

  it('dữ liệu mẫu SWR302 (yêu cầu + MoSCoW) và Kanban (việc, không sprint)', async () => {
    const swr = await mkProject('REQS', 'SWR302');
    assert.equal((await call(lead, 'POST', `/projects/${swr.pid}/sample-data`)).status, 201);
    const reqs = await prisma.workIssue.count({ where: { projectId: swr.pid, type: { key: 'REQUIREMENT' } } });
    assert.ok(reqs >= 5);
    const moscow = await prisma.workCustomValue.count({ where: { issue: { projectId: swr.pid } } });
    assert.ok(moscow >= 5, 'yêu cầu có giá trị MoSCoW');

    const kb = await mkProject('KANB', 'BLANK', { type: 'KANBAN' });
    assert.equal((await call(lead, 'POST', `/projects/${kb.pid}/sample-data`)).status, 201);
    assert.equal(await prisma.workSprint.count({ where: { projectId: kb.pid } }), 0);
    assert.ok((await prisma.workIssue.count({ where: { projectId: kb.pid, type: { key: 'TASK' } } })) >= 5);
  });

  it('Health: sprint 5/21 điểm xong, KHÔNG có snapshot ⇒ tốc độ khác 0, không "0 pts/day"', async () => {
    const { pid, cfg } = await mkProject('PACE', 'SWP391', { firstSprint: false });
    const sid = (await call(lead, 'POST', `/projects/${pid}/sprints`, {})).data.id;
    const nums: number[] = [];
    for (const pts of [5, 8, 8]) {
      nums.push((await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: typeOf(cfg, 'STORY'), title: `Story ${pts}`, storyPoints: pts, sprintId: sid })).data.number);
    }
    const start = await call(lead, 'POST', `/projects/${pid}/sprints/${sid}/start`, {
      startAt: new Date(Date.now() - 4 * DAY).toISOString(), endAt: new Date(Date.now() + 10 * DAY).toISOString(),
    });
    assert.equal(start.status, 200, JSON.stringify(start.raw));
    assert.equal(start.data.committedPoints, 21);
    assert.equal((await call(lead, 'PATCH', `/projects/${pid}/issues/${nums[0]}`, { statusId: doneStatus(cfg) })).status, 200);
    // Giả lập cron chưa chạy / tắt: không có snapshot nào.
    await prisma.workSprintSnapshot.deleteMany({ where: { sprintId: sid } });

    const r = (await call(lead, 'GET', `/projects/${pid}/insights`)).data.sprintRisk;
    assert.equal(r.remaining, 16);
    assert.equal(r.done, 5);
    assert.ok(r.recentPerDay > 0, `recentPerDay = ${r.recentPerDay}`);
    assert.equal(r.recentPerDay, 1);
    assert.match(r.summary, /1 pts\/day/);
  });

  it('Health: ngày đầu sprint không báo AT RISK', async () => {
    const { pid, cfg } = await mkProject('DAY1', 'SWP391', { firstSprint: false });
    const sid = (await call(lead, 'POST', `/projects/${pid}/sprints`, {})).data.id;
    await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: typeOf(cfg, 'STORY'), title: 'Big story', storyPoints: 40, sprintId: sid });
    await call(lead, 'POST', `/projects/${pid}/sprints/${sid}/start`, { startAt: new Date().toISOString(), endAt: new Date(Date.now() + 3 * DAY).toISOString() });
    const r = (await call(lead, 'GET', `/projects/${pid}/insights`)).data.sprintRisk;
    assert.equal(r.atRisk, false);
    assert.equal(r.status, 'TOO_EARLY');
  });

  it('"Allow members to manage sprints": tắt thì MEMBER bị chặn, bật thì làm được và cờ quyền đổi theo', async () => {
    const { pid } = await mkProject('MSPR', 'SWP391', { firstSprint: false });
    assert.equal((await call(dev, 'GET', `/projects/${pid}`)).data.permissions.manageSprints, false);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/sprints`, {})).status, 403);
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}`, { settings: { membersManageSprints: true } })).status, 403, 'MEMBER không tự bật được');
    assert.equal((await call(lead, 'PATCH', `/projects/${pid}`, { settings: { membersManageSprints: true } })).status, 200);
    assert.equal((await call(dev, 'GET', `/projects/${pid}`)).data.permissions.manageSprints, true);
    const s = await call(dev, 'POST', `/projects/${pid}/sprints`, {});
    assert.equal(s.status, 201);
    assert.equal(s.data.name, 'Sprint 1');
    // Không kéo theo quyền cài đặt.
    assert.equal((await call(dev, 'GET', `/projects/${pid}`)).data.permissions.settings, false);
  });
});
