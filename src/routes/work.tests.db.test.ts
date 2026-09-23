/**
 * Test đợt 3 (quản lý kiểm thử) qua HTTP thật trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.tests.db.test.ts
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

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wt3${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string };

describe('CT Work đợt 3 — kiểm thử', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, tester: U, viewer: U;
  let pid = 0;
  let cfg: any;
  const statusId = (name: string, workflow: 'default' | 'bug') =>
    cfg.workflows.find((w: any) => (workflow === 'default' ? w.isDefault : !w.isDefault)).statuses.find((s: any) => s.name === name).id;

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
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
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
    [lead, tester, viewer] = await Promise.all(['lead', 'tester', 'viewer'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Testing ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [tester.email, viewer.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'QA', name: 'QA Lab', template: 'SWT301' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  const nums: Record<string, number> = {};

  it('tạo test case có bước + liên kết yêu cầu; bước thiếu thao tác bị từ chối', async () => {
    const story = await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: cfg.issueTypes.find((t: any) => t.key === 'STORY').id, title: 'User can log in' });
    nums.story = story.data.number;
    const t = await call(tester, 'POST', `/projects/${pid}/tests`, {
      title: 'Login with valid credentials',
      preconditions: 'A registered account exists',
      steps: [
        { action: 'Open /login', expected: 'Login form is shown' },
        { action: 'Enter email and password', data: 'a@b.com / Secret123', expected: 'Fields accept input' },
        { action: 'Click Sign in', expected: 'Dashboard opens' },
      ],
      requirementKeys: [`QA-${nums.story}`],
    });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    nums.t1 = t.data.number;
    assert.deepEqual(t.data.failedLinks, []);
    const bad = await call(tester, 'POST', `/projects/${pid}/tests`, { title: 'Bad', steps: [{ action: '', expected: 'x' }] });
    assert.equal(bad.status, 400);
    const d = (await call(viewer, 'GET', `/projects/${pid}/tests/${nums.t1}`)).data;
    assert.equal(d.steps.length, 3);
    assert.equal(d.preconditions, 'A registered account exists');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/tests`, { title: 'x' })).status, 403);
  });

  it('nhập hàng loạt: dòng hỏng báo riêng', async () => {
    const r = await call(tester, 'POST', `/projects/${pid}/tests/import`, {
      rows: [
        { title: 'Login with wrong password', steps: [{ action: 'Enter wrong password', expected: 'Error shown' }] },
        { title: '' },
        { title: 'Logout', kind: 'GHERKIN', gherkin: 'Given I am logged in\nWhen I click Logout\nThen I see the login page' },
      ],
    });
    assert.equal(r.status, 201);
    assert.equal(r.data.created.length, 2);
    assert.equal(r.data.failed[0].row, 2);
    nums.t2 = r.data.created[0];
    nums.t3 = r.data.created[1];
  });

  let planId = 0;
  let cycleId = 0;
  it('plan + cycle: cycle từ plan tạo đủ lần chạy, chụp lại các bước', async () => {
    planId = (await call(tester, 'POST', `/projects/${pid}/test-plans`, { name: 'Auth regression', numbers: [nums.t1, nums.t2] })).data.id;
    await call(tester, 'PATCH', `/projects/${pid}/test-plans/${planId}`, { addNumbers: [nums.t3] });
    const plans = (await call(tester, 'GET', `/projects/${pid}/test-plans`)).data;
    assert.deepEqual(plans[0].testNumbers, [nums.t1, nums.t2, nums.t3].sort((a, b) => a - b));
    cycleId = (await call(tester, 'POST', `/projects/${pid}/test-cycles`, { name: 'Sprint 1 — Chrome', environment: 'Chrome 128', planId })).data.id;
    const c = (await call(tester, 'GET', `/projects/${pid}/test-cycles/${cycleId}`)).data;
    assert.equal(c.runs.length, 3);
    assert.equal(c.state, 'PLANNED');
    assert.equal(c.counts.TODO, 3);
    // Sửa test SAU khi tạo cycle: lần chạy vẫn giữ 3 bước cũ.
    await call(tester, 'PUT', `/projects/${pid}/tests/${nums.t1}`, { steps: [{ action: 'Only one step now', expected: 'ok' }] });
    const run1 = c.runs.find((r: any) => r.test.number === nums.t1);
    const run = (await call(tester, 'GET', `/projects/${pid}/test-runs/${run1.id}`)).data;
    assert.equal(run.steps.length, 3);
    assert.equal(run.steps[0].action, 'Open /login');
    nums.run1 = run1.id;
    nums.run2 = c.runs.find((r: any) => r.test.number === nums.t2).id;
    nums.run3 = c.runs.find((r: any) => r.test.number === nums.t3).id;
  });

  it('chạy từng bước: trạng thái suy ra, cycle tự sang IN_PROGRESS; viewer không chạy được', async () => {
    const run = (await call(tester, 'GET', `/projects/${pid}/test-runs/${nums.run1}`)).data;
    let r = await call(tester, 'PATCH', `/projects/${pid}/test-runs/${nums.run1}/steps/${run.steps[0].id}`, { status: 'PASS' });
    assert.equal(r.data.status, 'IN_PROGRESS');
    r = await call(tester, 'PATCH', `/projects/${pid}/test-runs/${nums.run1}/steps/${run.steps[1].id}`, { status: 'PASS' });
    r = await call(tester, 'PATCH', `/projects/${pid}/test-runs/${nums.run1}/steps/${run.steps[2].id}`, { status: 'FAIL', actual: 'Error 500 page' });
    assert.equal(r.data.status, 'FAIL');
    assert.equal(r.data.executedBy.id, tester.id);
    const c = (await call(tester, 'GET', `/projects/${pid}/test-cycles/${cycleId}`)).data;
    assert.equal(c.state, 'IN_PROGRESS');
    assert.equal((await call(viewer, 'PATCH', `/projects/${pid}/test-runs/${nums.run1}`, { status: 'PASS' })).status, 403);
    // Đặt tay cả lần chạy.
    await call(tester, 'PATCH', `/projects/${pid}/test-runs/${nums.run2}`, { status: 'PASS' });
    await call(tester, 'PATCH', `/projects/${pid}/test-runs/${nums.run3}`, { status: 'BLOCKED', comment: 'Logout button missing on staging' });
  });

  it('tạo Bug từ bước lỗi: điền sẵn bước tái hiện + kết quả thực tế, gắn vào lần chạy', async () => {
    const r = await call(tester, 'POST', `/projects/${pid}/test-runs/${nums.run1}/defects`, {});
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    nums.bug = r.data.number;
    const bug = (await call(tester, 'GET', `/projects/${pid}/issues/${nums.bug}`)).data;
    assert.equal(cfg.issueTypes.find((t: any) => t.id === bug.typeId).key, 'BUG');
    assert.match(bug.title, /step 3 fails/);
    const text = JSON.stringify(bug.descriptionJson);
    assert.ok(text.includes('Steps to reproduce') && text.includes('Enter email and password (data: a@b.com / Secret123)'));
    assert.ok(text.includes('Dashboard opens') && text.includes('Error 500 page'));
    assert.ok(text.includes('Chrome 128'));
    const run = (await call(tester, 'GET', `/projects/${pid}/test-runs/${nums.run1}`)).data;
    assert.deepEqual(run.defects.map((d: any) => d.number), [nums.bug]);
  });

  it('bug sang Retest ⇒ lần chạy FAIL thành RETEST; chạy lại thì xoá kết quả bước', async () => {
    await call(lead, 'PATCH', `/projects/${pid}/issues/${nums.bug}`, { statusId: statusId('In Progress', 'bug') });
    await call(lead, 'PATCH', `/projects/${pid}/issues/${nums.bug}`, { statusId: statusId('Fixed', 'bug') });
    await call(lead, 'PATCH', `/projects/${pid}/issues/${nums.bug}`, { statusId: statusId('Retest', 'bug') });
    await new Promise((res) => setTimeout(res, 400));
    let run = (await call(tester, 'GET', `/projects/${pid}/test-runs/${nums.run1}`)).data;
    assert.equal(run.status, 'RETEST');
    run = (await call(tester, 'PATCH', `/projects/${pid}/test-runs/${nums.run1}`, { reset: true })).data;
    assert.equal(run.status, 'TODO');
    assert.ok(run.steps.every((s: any) => s.status === 'TODO' && !s.actual));
    assert.equal(run.defects.length, 1, 'bug đã ghi nhận vẫn giữ');
  });

  it('ma trận truy vết: yêu cầu có test, trạng thái gần nhất, bug còn mở', async () => {
    const story2 = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: cfg.issueTypes.find((t: any) => t.key === 'STORY').id, title: 'Password reset' })).data;
    const tr = (await call(viewer, 'GET', `/projects/${pid}/reports/traceability`)).data;
    const login = tr.rows.find((r: any) => r.number === nums.story);
    assert.equal(login.tests.length, 1);
    assert.equal(login.tests[0].number, nums.t1);
    // Lần chạy gần nhất đã bị reset về TODO nên không tính; trước đó FAIL không còn là "gần nhất".
    assert.ok(['NOT_RUN', 'FAILING'].includes(login.coverage));
    assert.deepEqual(login.tests[0].openBugs.map((b: any) => b.number), [nums.bug]);
    assert.equal(tr.rows.find((r: any) => r.number === story2.number).coverage, 'NOT_COVERED');
    assert.equal(tr.summary.total, 2);
    assert.equal(tr.summary.coveragePct, 50);
    // Chạy lại và PASS ⇒ yêu cầu PASSING.
    await call(tester, 'PATCH', `/projects/${pid}/test-runs/${nums.run1}`, { status: 'PASS' });
    const tr2 = (await call(viewer, 'GET', `/projects/${pid}/reports/traceability`)).data;
    assert.equal(tr2.rows.find((r: any) => r.number === nums.story).coverage, 'PASSING');
  });

  it('danh sách test: số bước, yêu cầu, kết quả gần nhất; cycle đếm tỉ lệ đạt', async () => {
    const list = (await call(viewer, 'GET', `/projects/${pid}/tests`)).data;
    const t1 = list.find((t: any) => t.number === nums.t1);
    assert.equal(t1.stepCount, 1);
    assert.equal(t1.requirements[0].number, nums.story);
    assert.equal(t1.lastRun.status, 'PASS');
    assert.equal(list.find((t: any) => t.number === nums.t3).kind, 'GHERKIN');
    const c = (await call(viewer, 'GET', `/projects/${pid}/test-cycles`)).data[0];
    assert.equal(c.counts.PASS, 2);
    assert.equal(c.counts.BLOCKED, 1);
    assert.equal(c.executed, 3);
    assert.equal(c.passRate, 67);
  });

  it('bật kiểm thử cho dự án không có loại TEST', async () => {
    const ws = (await call(lead, 'GET', `/projects/${pid}`)).data.workspace;
    const p2 = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'NT', name: 'No tests', template: 'SWP391' })).data.id;
    assert.equal((await call(lead, 'POST', `/projects/${p2}/tests`, { title: 'x' })).status, 400);
    assert.equal((await call(tester, 'POST', `/projects/${p2}/tests/enable`)).status, 403);
    assert.equal((await call(lead, 'POST', `/projects/${p2}/tests/enable`)).status, 200);
    assert.equal((await call(lead, 'POST', `/projects/${p2}/tests`, { title: 'Smoke' })).status, 201);
  });
});
