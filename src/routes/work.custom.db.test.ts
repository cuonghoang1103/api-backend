/**
 * Test đợt 5 (tuỳ biến + tìm kiếm) qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.custom.db.test.ts
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
const tag = `wc${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work đợt 5 — tuỳ biến & tìm kiếm', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let pid = 0;
  let cfg: any;
  const refresh = async () => { cfg = (await call(lead, 'GET', `/projects/${pid}`)).data; };
  const wf = () => cfg.workflows.find((w: any) => w.isDefault);
  const st = (name: string) => wf().statuses.find((s: any) => s.name === name);
  const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;

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
  const jql = async (q: string) => call(dev, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent(q)}`);

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
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Custom ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'CU', name: 'Custom', template: 'BLANK' })).data.id;
    await refresh();
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('thêm trạng thái QA (đứng trước Done), chỉ ADMIN được sửa quy trình', async () => {
    assert.equal((await call(dev, 'POST', `/projects/${pid}/workflows/${wf().id}/statuses`, { name: 'QA', category: 'IN_PROGRESS' })).status, 403);
    const r = await call(lead, 'POST', `/projects/${pid}/workflows/${wf().id}/statuses`, { name: 'QA', category: 'IN_PROGRESS' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    await refresh();
    const names = wf().statuses.map((s: any) => s.name);
    assert.deepEqual(names, ['To Do', 'In Progress', 'In Review', 'QA', 'Done']);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/workflows/${wf().id}/statuses`, { name: 'qa', category: 'TODO' })).status, 409);
  });

  it('luồng chuyển giới hạn được áp dụng; "free" gỡ giới hạn', async () => {
    const t = (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'Flow' })).data;
    const r = await call(lead, 'PUT', `/projects/${pid}/workflows/${wf().id}/transitions`, {
      mode: 'restricted',
      transitions: [{ from: st('To Do').id, to: st('In Progress').id }, { from: null, to: st('To Do').id }],
    });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/issues/${t.number}`, { statusId: st('Done').id })).status, 400);
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/issues/${t.number}`, { statusId: st('In Progress').id })).status, 200);
    await call(lead, 'PUT', `/projects/${pid}/workflows/${wf().id}/transitions`, { mode: 'free' });
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/issues/${t.number}`, { statusId: st('Done').id })).status, 200);
  });

  it('xoá trạng thái đang dùng: bắt chọn nơi dời thẻ; không cho xoá Done cuối cùng', async () => {
    const t = (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'In QA' })).data;
    await call(dev, 'PATCH', `/projects/${pid}/issues/${t.number}`, { statusId: st('QA').id });
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/statuses/${st('QA').id}`)).status, 400);
    const r = await call(lead, 'DELETE', `/projects/${pid}/statuses/${st('QA').id}?moveTo=${st('Done').id}`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const moved = (await call(dev, 'GET', `/projects/${pid}/issues/${t.number}`)).data;
    assert.equal(moved.statusId, st('Done').id);
    assert.ok(moved.resolvedAt, 'dời vào Done thì có resolvedAt');
    await refresh();
    const r2 = await call(lead, 'DELETE', `/projects/${pid}/statuses/${st('Done').id}?moveTo=${st('To Do').id}`);
    assert.equal(r2.status, 400);
    assert.match(r2.raw.message, /at least one "Done"/);
  });

  it('cột board tuỳ chỉnh: gộp trạng thái, bắt phủ đủ mọi trạng thái', async () => {
    await refresh();
    const ids = wf().statuses.map((s: any) => s.id);
    const bad = await call(lead, 'PUT', `/projects/${pid}/board-columns`, { columns: [{ name: 'Todo', statusIds: [ids[0]] }] });
    assert.equal(bad.status, 400);
    const good = await call(lead, 'PUT', `/projects/${pid}/board-columns`, {
      columns: [{ name: 'Backlog', statusIds: [ids[0]] }, { name: 'Doing', statusIds: [ids[1], ids[2]], wipLimit: 3 }, { name: 'Shipped', statusIds: [ids[3]] }],
    });
    assert.equal(good.status, 200, JSON.stringify(good.raw));
    await refresh();
    assert.deepEqual(cfg.boardColumns.map((c: any) => [c.name, c.wipLimit, c.category]), [['Backlog', null, 'TODO'], ['Doing', 3, 'IN_PROGRESS'], ['Shipped', null, 'DONE']]);
    await call(lead, 'PUT', `/projects/${pid}/board-columns`, { columns: null });
  });

  it('loại thẻ tuỳ chỉnh', async () => {
    const r = await call(lead, 'POST', `/projects/${pid}/issue-types`, { name: 'Spike', level: 0, color: '#0ea5e9' });
    assert.equal(r.status, 201);
    assert.equal(r.data.key, 'SPIKE');
    await refresh();
    const i = await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('SPIKE'), title: 'Try websockets' });
    assert.equal(i.status, 201);
  });

  let browser = 0;
  let effort = 0;
  it('trường tuỳ chỉnh: tạo, đặt giá trị có kiểm kiểu, lịch sử, tìm bằng JQL', async () => {
    const b = await call(lead, 'POST', `/projects/${pid}/custom-fields`, { name: 'Browser', kind: 'SELECT', options: [{ label: 'Chrome' }, { label: 'Safari' }] });
    assert.equal(b.status, 201, JSON.stringify(b.raw));
    browser = b.data.id;
    effort = (await call(lead, 'POST', `/projects/${pid}/custom-fields`, { name: 'Effort', kind: 'NUMBER' })).data.id;
    assert.equal((await call(lead, 'POST', `/projects/${pid}/custom-fields`, { name: 'Status', kind: 'TEXT' })).status, 400, 'tên trùng trường có sẵn');
    const chrome = b.data.options.find((o: any) => o.label === 'Chrome').id;
    const t = (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('BUG'), title: 'Layout broken' })).data;
    const set = await call(dev, 'PUT', `/projects/${pid}/issues/${t.number}/custom-values`, { values: { [browser]: chrome, [effort]: 5 } });
    assert.equal(set.status, 200, JSON.stringify(set.raw));
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/issues/${t.number}/custom-values`, { values: { [effort]: 'five' } })).status, 400);
    const h = (await call(dev, 'GET', `/projects/${pid}/issues/${t.number}/history`)).data;
    assert.ok(h.some((x: any) => x.field === 'cf:Browser'));
    const hit = await jql('Browser = Chrome AND Effort >= 3');
    assert.equal(hit.status, 200, JSON.stringify(hit.raw));
    assert.deepEqual(hit.data.items.map((i: any) => i.number), [t.number]);
    assert.equal((await jql('Browser = Safari')).data.total, 0);
  });

  it('JQL trên DB thật: người, trạng thái, loại, ngày, sắp xếp; lỗi trả vị trí', async () => {
    await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'Mine urgent', assigneeId: dev.id, priority: 1 });
    const mine = await call(dev, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('assignee = currentUser() AND statusCategory != Done ORDER BY priority')}`);
    assert.equal(mine.status, 200, JSON.stringify(mine.raw));
    assert.ok(mine.data.items.every((i: any) => i.assigneeId === dev.id));
    assert.equal(mine.data.items[0].title, 'Mine urgent');
    const recent = await jql('created >= -1d AND type IN (Bug, Task)');
    assert.ok(recent.data.total >= 3);
    const err = await jql('status = ');
    assert.equal(err.status, 400);
    assert.equal(err.raw.code, 'WORK_JQL_ERROR');
    assert.equal(typeof err.raw.data.position, 'number');
    assert.equal((await jql('status = Nope')).status, 400);
  });

  it('bộ lọc đã lưu: chỉ lưu truy vấn hợp lệ, riêng tư / chia sẻ', async () => {
    assert.equal((await call(dev, 'POST', `/projects/${pid}/filters`, { name: 'Bad', query: 'status = ' })).status, 400);
    const f = (await call(dev, 'POST', `/projects/${pid}/filters`, { name: 'My bugs', query: 'type = Bug AND assignee = currentUser()' })).data;
    assert.equal((await call(lead, 'GET', `/projects/${pid}/filters`)).data.length, 0, 'bộ lọc riêng không lộ cho người khác');
    await call(dev, 'POST', `/projects/${pid}/filters`, { id: f.id, name: 'My bugs', query: f.query, shared: true });
    assert.equal((await call(lead, 'GET', `/projects/${pid}/filters`)).data.length, 1);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/filters`, { id: f.id, name: 'Hijack', query: 'type = Bug' })).status, 403);
  });

  it('thống kê theo chiều + tạo/hoàn thành theo ngày + dashboard', async () => {
    const s = await call(dev, 'GET', `/projects/${pid}/stats?groupBy=type&jql=`);
    assert.equal(s.status, 200);
    assert.ok(s.data.groups.find((g: any) => g.label === 'Bug').count >= 1);
    const cr = (await call(dev, 'GET', `/projects/${pid}/stats/created-resolved?days=7`)).data;
    assert.equal(cr.length, 8);
    assert.ok(cr.at(-1).created >= 1);
    const d = await call(dev, 'POST', `/projects/${pid}/dashboards`, {
      name: 'Team', widgets: [{ kind: 'pie', title: 'By status', groupBy: 'status' }, { kind: 'filter', title: 'Open bugs', query: 'type = Bug AND statusCategory != Done' }],
    });
    assert.equal(d.status, 201, JSON.stringify(d.raw));
    assert.ok(d.data.widgets.every((w: any) => w.id));
    assert.equal((await call(dev, 'POST', `/projects/${pid}/dashboards`, { name: 'X', widgets: [{ kind: 'filter', query: 'oops =' }] })).status, 400);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/dashboards`)).data.length, 1);
  });
});
