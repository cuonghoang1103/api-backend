/**
 * Test phần bù đợt 3–4: xuất báo cáo test cycle, lập kế hoạch sprint theo
 * velocity, retro/bản tin AI (đường hạn mức), bằng chứng lần chạy test.
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.extras.db.test.ts
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wx${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — phần bù đợt 3–4', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, viewer: U;
  let pid = 0;
  let cfg: any;
  const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
  const st = (name: string) => cfg.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.name === name).id;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const buf = Buffer.from(await res.arrayBuffer());
    let json: any = {};
    try { json = JSON.parse(buf.toString('utf8')); } catch { /* file */ }
    return { status: res.status, data: json.data, raw: json, buf, headers: res.headers };
  }
  const newIssue = async (title: string, extra: Record<string, unknown> = {}) =>
    (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('STORY'), title, ...extra })).data;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, viewer] = await Promise.all(['lead', 'dev', 'viewer'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Extras ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'EX', name: 'Extras', template: 'BLANK' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('kế hoạch sprint: velocity từ sprint đã đóng, xếp backlog theo thứ tự tới khi đầy, bỏ thẻ bị chặn / chưa ước lượng', async () => {
    // Sprint 1: cam kết 8, xong 5 ⇒ velocity 5.
    const s1 = (await call(lead, 'POST', `/projects/${pid}/sprints`, {})).data;
    const a = await newIssue('A', { storyPoints: 5, sprintId: s1.id });
    await newIssue('B', { storyPoints: 3, sprintId: s1.id });
    const now = Date.now();
    await call(lead, 'POST', `/projects/${pid}/sprints/${s1.id}/start`, { startAt: new Date(now - 7 * 864e5).toISOString(), endAt: new Date(now).toISOString() });
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/issues/${a.number}`, { statusId: st('Done') })).status, 200);
    const done = await call(lead, 'POST', `/projects/${pid}/sprints/${s1.id}/complete`, { moveTo: 'backlog' });
    assert.equal(done.status, 200, JSON.stringify(done.raw));
    // Backlog theo rank: B(3, quay về từ sprint 1) … C(2) D(4) E(chưa ước lượng) F(1, bị chặn bởi C)
    const c = await newIssue('C', { storyPoints: 2 });
    await newIssue('D', { storyPoints: 4 });
    await newIssue('E');
    const f = await newIssue('F', { storyPoints: 1 });
    await call(dev, 'POST', `/projects/${pid}/issues/${c.number}/links`, { targetKey: `EX-${f.number}`, type: 'BLOCKS' });
    const s2 = (await call(lead, 'POST', `/projects/${pid}/sprints`, {})).data;
    assert.equal((await call(dev, 'POST', `/projects/${pid}/ai/plan-sprint`, { sprintId: s2.id })).status, 403, 'chỉ người quản lý sprint');
    const plan = await call(lead, 'POST', `/projects/${pid}/ai/plan-sprint`, { sprintId: s2.id });
    assert.equal(plan.status, 200, JSON.stringify(plan.raw));
    assert.equal(plan.data.velocity, 5);
    assert.equal(plan.data.target, 5);
    assert.deepEqual(plan.data.selected.map((x: any) => x.title), ['B', 'C'], JSON.stringify(plan.data));
    assert.equal(plan.data.plannedTotal, 5);
    assert.ok(plan.data.warnings.some((w: string) => /no estimate/.test(w)));
    assert.equal(plan.data.rationale, null, 'không xin giải thích thì không gọi AI');
  });

  it('retro / bản tin: viewer không gọi được; hết lượt thì 402 (hoặc 503 khi máy không có khoá AI)', async () => {
    const sprintId = (await call(lead, 'GET', `/projects/${pid}/sprints?includeClosed=true`)).data.find((s: any) => s.state === 'CLOSED').id;
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/ai/retro`, { sprintId })).status, 403);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/ai/daily-brief`, {})).status, 403);
    const old = process.env.WORK_AI_FREE_DAILY;
    process.env.WORK_AI_FREE_DAILY = '0';
    try {
      const r = await call(dev, 'POST', `/projects/${pid}/ai/retro`, { sprintId, notes: 'We forgot to update the board.' });
      assert.ok([402, 503].includes(r.status), `retro ${r.status} ${JSON.stringify(r.raw)}`);
      const b = await call(dev, 'POST', `/projects/${pid}/ai/daily-brief`, {});
      assert.ok([402, 503].includes(b.status), `brief ${b.status}`);
    } finally {
      if (old === undefined) delete process.env.WORK_AI_FREE_DAILY; else process.env.WORK_AI_FREE_DAILY = old;
    }
  });

  it('báo cáo test cycle: Excel có phần tóm tắt + từng lần chạy, PDF, CSV; bằng chứng phải đúng lần chạy của test', async () => {
    await call(lead, 'POST', `/projects/${pid}/tests/enable`);
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    const t1 = (await call(dev, 'POST', `/projects/${pid}/tests`, { title: 'Login works', steps: [{ action: 'Open', expected: 'Form' }] })).data;
    const t2 = (await call(dev, 'POST', `/projects/${pid}/tests`, { title: 'Logout works', steps: [{ action: 'Click', expected: 'Gone' }] })).data;
    const cyc = (await call(dev, 'POST', `/projects/${pid}/test-cycles`, { name: 'Round 1', environment: 'Chrome', numbers: [t1.number, t2.number] })).data;
    const detail = (await call(dev, 'GET', `/projects/${pid}/test-cycles/${cyc.id}`)).data;
    const run1 = detail.runs.find((r: any) => r.test.number === t1.number);
    await call(dev, 'PATCH', `/projects/${pid}/test-runs/${run1.id}`, { status: 'PASS' });
    const run2 = detail.runs.find((r: any) => r.test.number === t2.number);
    await call(dev, 'PATCH', `/projects/${pid}/test-runs/${run2.id}`, { status: 'FAIL', comment: 'Button missing' });

    const x = await call(dev, 'GET', `/projects/${pid}/test-cycles/${cyc.id}/export?format=xlsx`);
    assert.equal(x.status, 200);
    const sheet = new AdmZip(x.buf).readAsText('xl/worksheets/sheet1.xml');
    for (const s of ['Round 1', 'Pass rate', '50%', 'Login works', 'Button missing', 'FAIL']) assert.ok(sheet.includes(s), `thiếu ${s}`);
    const pdf = await call(dev, 'GET', `/projects/${pid}/test-cycles/${cyc.id}/export?format=pdf`);
    assert.equal(pdf.buf.subarray(0, 4).toString(), '%PDF');
    const csv = await call(dev, 'GET', `/projects/${pid}/test-cycles/${cyc.id}/export?format=csv`);
    assert.ok(csv.buf.toString('utf8').includes('Logout works'));

    // Bằng chứng: lần chạy của test khác ⇒ 400 (khi có R2) / 503-500 (máy không có R2) — không bao giờ 201.
    const bad = await call(dev, 'POST', `/projects/${pid}/issues/${t1.number}/attachments/complete`, { key: 'work/x/y/z.png', fileName: 'z.png', runId: run2.id });
    assert.notEqual(bad.status, 201);
    const run = (await call(dev, 'GET', `/projects/${pid}/test-runs/${run1.id}`)).data;
    assert.deepEqual(run.evidence, []);
  });
});
