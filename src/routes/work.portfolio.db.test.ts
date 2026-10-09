/**
 * Đợt S3a — Portfolio + Workload qua HTTP thật trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.portfolio.db.test.ts
 *
 * Phủ: RAG + lý do trên ba dự án khác sức khoẻ; phụ thuộc liên dự án (phía người
 * xem không thấy ⇒ ẩn mã/tiêu đề); QUYỀN không lộ dự án (thành viên không thấy dự
 * án PRIVATE, giảng viên GUEST chỉ thấy dự án mình, khách cổng thấy rỗng, người
 * ngoài 404); workload: người quá tải, năng lực theo dự án, gộp bộ phận, thành
 * viên thường chỉ thấy mình, trưởng bộ phận thấy bộ phận mình.
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
import { addDays, mondayOf } from '../services/work/portfolioRules.js';
import { vnDay } from '../services/work/sprints.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `pf${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — Portfolio + Workload S3a (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, lead: U, dev1: U, dev2: U, member: U, teacher: U, client: U, outsider: U;
  let wsId = 0;
  const pid: Record<string, number> = {};
  let teamId = 0;
  const today = vnDay();
  const nextMon = addDays(mondayOf(today), 7);

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }

  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, raw: json };
  }

  async function issue(p: string, body: Record<string, unknown>) {
    const c = (await call(owner, 'GET', `/projects/${pid[p]}`)).data;
    const typeId = c.issueTypes.find((t: any) => t.key === 'TASK').id;
    const r = await call(owner, 'POST', `/projects/${pid[p]}/issues`, { typeId, ...body });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data;
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, lead, dev1, dev2, member, teacher, client, outsider] = await Promise.all(
      ['owner', 'lead', 'dev1', 'dev2', 'member', 'teacher', 'client', 'outsider'].map(mkUser),
    );
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('dựng không gian: 4 dự án (đỏ / vàng / xanh / client có giai đoạn), bộ phận DEV, khách + giảng viên', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `Portfolio ${tag}` });
    assert.equal(ws.status, 201);
    wsId = ws.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [lead.email, dev1.email, dev2.email, member.email], role: 'MEMBER' });
    for (const [k, name, extra] of [
      ['PA', 'Alpha red', { kind: 'SOFTWARE' }],
      ['PB', 'Beta amber', { kind: 'SOFTWARE' }],
      ['PC', 'Gamma secret', { kind: 'SOFTWARE', visibility: 'PRIVATE' }],
      ['PCL', 'Client portal', { kind: 'CLIENT', template: 'COMPANY' }],
    ] as const) {
      const r = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: k, name, template: 'BLANK', ...extra });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      pid[k] = r.data.id;
    }
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [teacher.email], role: 'GUEST', projectId: pid.PB, projectRole: 'TEACHER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [client.email], role: 'GUEST', projectId: pid.PCL, projectRole: 'CLIENT' });
    const t = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'DEV', name: 'Developers', leadIds: [lead.id], memberIds: [dev1.id, dev2.id] });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    teamId = t.data.id;

    // ĐỎ: mốc v1 trễ 3 ngày.
    const v = await call(owner, 'POST', `/projects/${pid.PA}/versions`, { name: 'v1', releaseDate: addDays(today, -3) });
    assert.equal(v.status, 201, JSON.stringify(v.raw));
    const a1 = await issue('PA', { title: 'Alpha private title', fixVersionId: v.data.id });
    // VÀNG: thẻ Beta bị chặn bởi thẻ Alpha (liên dự án) + bởi thẻ Gamma (PRIVATE).
    const b1 = await issue('PB', { title: 'Beta waits' });
    const c1 = await issue('PC', { title: 'Gamma hidden blocker' });
    assert.equal((await call(owner, 'POST', `/projects/${pid.PA}/issues/${a1.number}/links`, { type: 'BLOCKS', targetKey: `PB-${b1.number}` })).status, 201);
    assert.equal((await call(owner, 'POST', `/projects/${pid.PC}/issues/${c1.number}/links`, { type: 'BLOCKS', targetKey: `PB-${b1.number}` })).status, 201);
    // Client: 2 giai đoạn, GĐ1 DONE, GĐ2 ACTIVE ⇒ 50%.
    await prisma.workStage.createMany({ data: [
      { projectId: pid.PCL, n: 1, slug: `${tag}-discover`, name: 'Discovery', status: 'DONE' },
      { projectId: pid.PCL, n: 2, slug: `${tag}-build`, name: 'Build', status: 'ACTIVE' },
    ] });

    // Workload: tuần sau. dev1 60h hạn thứ Sáu (quá tải 40h); dev2 2 điểm = 8h với năng lực 4h/ngày ở PA.
    await issue('PA', { title: 'Big task', assigneeId: dev1.id, originalEstimateMin: 60 * 60, startDate: nextMon, dueDate: addDays(nextMon, 4) });
    await issue('PB', { title: 'Small task', assigneeId: dev2.id, storyPoints: 2, startDate: nextMon, dueDate: addDays(nextMon, 2) });
    await issue('PA', { title: 'Member chore', assigneeId: member.id, remainingEstimateMin: 120, startDate: nextMon, dueDate: addDays(nextMon, 1) });
    await issue('PA', { title: 'No due date', assigneeId: dev1.id, storyPoints: 1 });
    assert.equal((await call(owner, 'PUT', `/projects/${pid.PA}/capacity/${dev2.id}`, { hoursPerDay: 4 })).status, 200);
  });

  it('portfolio (owner): RAG + lý do theo luật; giai đoạn; phụ thuộc liên dự án; dải mốc', async () => {
    const r = await call(owner, 'GET', `/workspaces/${wsId}/portfolio`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const by = (k: string) => r.data.projects.find((p: any) => p.key === k);
    assert.deepEqual(r.data.projects.map((p: any) => p.key).sort(), ['PA', 'PB', 'PC', 'PCL']);
    assert.equal(by('PA').health.rag, 'RED');
    assert.equal(by('PA').health.reasons[0].code, 'MILESTONE_LATE');
    assert.match(by('PA').health.reasons[0].text, /"v1".*3 days ago/);
    assert.equal(by('PB').health.rag, 'AMBER');
    assert.deepEqual(by('PB').health.reasons.map((x: any) => x.code), ['BLOCKED_CROSS']);
    assert.equal(by('PB').dependencies.blockedBy, 1, 'một thẻ bị chặn (dù có hai cạnh)');
    assert.equal(by('PA').dependencies.blocking, 1);
    assert.equal(by('PC').health.rag, 'GREEN');
    assert.equal(by('PC').health.reasons[0].code, 'ALL_CLEAR');
    assert.equal(by('PCL').kind, 'CLIENT');
    assert.deepEqual([by('PCL').stage.percent, by('PCL').stage.current.n, by('PCL').stage.current.name], [50, 2, 'Build']);
    assert.equal(by('PA').stage, null, 'mô-đun stages tắt ⇒ không có giai đoạn');
    assert.equal(by('PA').counts.open, 4);
    assert.equal(r.data.blockers.length, 2);
    assert.ok(r.data.blockers.every((b: any) => !b.blocker.hidden && !b.blocked.hidden));
    assert.equal(r.data.milestones[0].projectKey, 'PA');
    assert.ok(r.data.rules.length >= 8, 'trả kèm luật bằng chữ');
    assert.equal(r.data.workloadScope, 'ALL');
  });

  it('portfolio (thành viên): KHÔNG thấy dự án PRIVATE; phía chặn ở dự án đó bị ẩn mã/tiêu đề', async () => {
    const r = await call(member, 'GET', `/workspaces/${wsId}/portfolio`);
    assert.equal(r.status, 200);
    assert.deepEqual(r.data.projects.map((p: any) => p.key).sort(), ['PA', 'PB', 'PCL']);
    const hidden = r.data.blockers.filter((b: any) => b.blocker.hidden);
    assert.equal(hidden.length, 1);
    assert.equal(hidden[0].blocker.key, null);
    const json = JSON.stringify(r.data);
    assert.ok(!json.includes('Gamma'), 'không lộ tên/tiêu đề dự án PRIVATE');
    assert.ok(!json.includes('PC-'), 'không lộ mã thẻ dự án PRIVATE');
    assert.equal(r.data.workloadScope, 'SELF');
  });

  it('portfolio (giảng viên GUEST): chỉ dự án mình; (khách cổng): rỗng; (người ngoài): 404', async () => {
    const t = await call(teacher, 'GET', `/workspaces/${wsId}/portfolio`);
    assert.equal(t.status, 200);
    assert.deepEqual(t.data.projects.map((p: any) => p.key), ['PB']);
    const json = JSON.stringify(t.data);
    for (const leak of ['Alpha', 'Gamma', 'PA-', 'PC-', 'Client portal']) assert.ok(!json.includes(leak), `lộ "${leak}" cho giảng viên`);
    assert.ok(t.data.blockers.every((b: any) => b.blocker.hidden));
    assert.equal(t.data.canSeeWorkload, false);

    const c = await call(client, 'GET', `/workspaces/${wsId}/portfolio`);
    assert.equal(c.status, 200);
    assert.deepEqual(c.data.projects, []);
    assert.deepEqual(c.data.blockers, []);

    assert.equal((await call(outsider, 'GET', `/workspaces/${wsId}/portfolio`)).status, 404);
    assert.equal((await call(outsider, 'GET', `/workspaces/${wsId}/workload`)).status, 404);
  });

  it('workload (owner): dev1 quá tải 60/40h, dev2 năng lực 4h/ngày từ dự án, gộp bộ phận DEV', async () => {
    const r = await call(owner, 'GET', `/workspaces/${wsId}/workload?from=${nextMon}&to=${addDays(nextMon, 13)}`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.weeks.length, 2);
    assert.equal(r.data.scope, 'ALL');
    const p = (u: U) => r.data.people.find((x: any) => x.user.id === u.id);
    assert.ok(p(dev1) && p(dev2) && p(member) && p(lead) && p(owner));
    assert.equal(p(dev1).overloaded, true);
    assert.deepEqual([p(dev1).weeks[0].hours, p(dev1).weeks[0].capacity, p(dev1).weeks[0].pct], [60, 40, 150]);
    assert.equal(p(dev1).unscheduled, 1, 'thẻ không hạn đếm riêng, không vào lưới');
    assert.equal(r.data.people[0].user.id, dev1.id, 'người quá tải xếp đầu');
    assert.deepEqual([p(dev2).hoursPerDay, p(dev2).capacitySource, p(dev2).weeks[0].hours, p(dev2).weeks[0].pct], [4, 'projects', 8, 40]);
    assert.equal(p(dev2).issues[0].source, 'points');
    assert.equal(p(member).weeks[0].hours, 2);
    assert.equal(p(member).capacitySource, 'default');
    const dev = r.data.teams.find((t: any) => t.key === 'DEV');
    assert.deepEqual(dev.memberIds.sort(), [lead.id, dev1.id, dev2.id].sort());
    assert.equal(dev.overloadedPeople, 1);
    assert.equal(dev.weeks[0].hours, 68);
  });

  it('workload: thành viên thường chỉ thấy mình (lọc bộ phận ⇒ 403); trưởng bộ phận thấy bộ phận; khách chỉ mình', async () => {
    const m = await call(member, 'GET', `/workspaces/${wsId}/workload?from=${nextMon}`);
    assert.equal(m.status, 200);
    assert.deepEqual(m.data.people.map((x: any) => x.user.id), [member.id]);
    assert.equal(m.data.scope, 'SELF');
    assert.deepEqual(m.data.teamOptions, []);
    assert.equal((await call(member, 'GET', `/workspaces/${wsId}/workload?teamId=${teamId}`)).status, 403);

    const l = await call(lead, 'GET', `/workspaces/${wsId}/workload?from=${nextMon}&teamId=${teamId}`);
    assert.equal(l.status, 200, JSON.stringify(l.raw));
    assert.equal(l.data.scope, 'TEAMS');
    assert.deepEqual(l.data.people.map((x: any) => x.user.id).sort(), [lead.id, dev1.id, dev2.id].sort());
    const lAll = await call(lead, 'GET', `/workspaces/${wsId}/workload?from=${nextMon}`);
    assert.ok(!lAll.data.people.some((x: any) => x.user.id === member.id), 'trưởng bộ phận không thấy người ngoài bộ phận');

    const g = await call(teacher, 'GET', `/workspaces/${wsId}/workload?from=${nextMon}`);
    assert.equal(g.status, 200);
    assert.deepEqual(g.data.people.map((x: any) => x.user.id), [teacher.id]);
    assert.deepEqual(g.data.teams, []);

    const bad = await call(owner, 'GET', `/workspaces/${wsId}/workload?from=2026-10-10&to=2026-01-01`);
    assert.equal(bad.status, 400);
  });

  it('UX-A P0-2: số "open" GIỐNG NHAU ở Projects, Portfolio và JQL của widget Dashboard (không tính sub-task)', async () => {
    const r = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'PO', name: 'Open count', template: 'BLANK', kind: 'SOFTWARE' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    pid.PO = r.data.id;
    const cfg = (await call(owner, 'GET', `/projects/${pid.PO}`)).data;
    const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
    const mk = async (body: Record<string, unknown>) => {
      const x = await call(owner, 'POST', `/projects/${pid.PO}/issues`, body);
      assert.equal(x.status, 201, JSON.stringify(x.raw));
      return x.data;
    };
    const epic = await mk({ typeId: type('EPIC'), title: 'Epic counts' });
    const t1 = await mk({ typeId: type('TASK'), title: 'Task one', parentId: epic.id });
    await mk({ typeId: type('BUG'), title: 'Bug counts' });
    await mk({ typeId: type('SUBTASK'), title: 'Sub-task never counts', parentId: t1.id });
    const done = await mk({ typeId: type('TASK'), title: 'Done does not count' });
    const taskType = cfg.issueTypes.find((t: any) => t.key === 'TASK');
    const wf = cfg.workflows.find((w: any) => w.id === taskType.workflowId) ?? cfg.workflows.find((w: any) => w.isDefault) ?? cfg.workflows[0];
    const doneStatus = wf.statuses.find((s: any) => s.category === 'DONE').id;
    assert.equal((await call(owner, 'POST', `/projects/${pid.PO}/issues/${done.number}/move`, { statusId: doneStatus })).status, 200);
    const deleted = await mk({ typeId: type('TASK'), title: 'Deleted does not count' });
    assert.equal((await call(owner, 'DELETE', `/projects/${pid.PO}/issues/${deleted.number}`)).status, 200);

    const list = await call(owner, 'GET', `/workspaces/${wsId}/projects`);
    const pf = await call(owner, 'GET', `/workspaces/${wsId}/portfolio`);
    const { OPEN_ISSUES_JQL } = await import('../services/work/openIssues.js');
    const jql = await call(owner, 'GET', `/projects/${pid.PO}/search?jql=${encodeURIComponent(OPEN_ISSUES_JQL)}&limit=1`);
    assert.equal(jql.status, 200, JSON.stringify(jql.raw));
    const fromList = list.data.find((p: any) => p.key === 'PO').openIssues;
    const fromPf = pf.data.projects.find((p: any) => p.key === 'PO').counts.open;
    assert.deepEqual([fromList, fromPf, jql.data.total], [3, 3, 3], 'epic + task + bug; không sub-task, không Done, không đã xoá');
    // Các dự án cũ trong bài cũng khớp giữa hai trang.
    for (const k of ['PA', 'PB', 'PC', 'PCL']) {
      assert.equal(list.data.find((p: any) => p.key === k).openIssues, pf.data.projects.find((p: any) => p.key === k).counts.open, `lệch ở ${k}`);
    }
  });
});
