/**
 * Test sơ đồ quy trình (lưu bố cục nút + chuyển tự do ↔ giới hạn) qua HTTP thật:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.workflowdiagram.db.test.ts
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
const tag = `wd${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — sơ đồ quy trình', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let pid = 0;
  let cfg: any;
  const refresh = async () => { cfg = (await call(lead, 'GET', `/projects/${pid}`)).data; };
  const wf = () => cfg.workflows.find((w: any) => w.isDefault);

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
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Diagram ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'WD', name: 'Diagram', template: 'BLANK' })).data.id;
    await refresh();
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('ADMIN lưu bố cục; toạ độ trả về trong settings.workflowLayout, id lạ bị bỏ', async () => {
    const w = wf();
    const [a, b] = w.statuses;
    const r = await call(lead, 'PUT', `/projects/${pid}/workflows/${w.id}/layout`, {
      positions: { [a.id]: { x: 10.4, y: 20 }, [b.id]: { x: 300, y: -40 }, 999999: { x: 1, y: 1 } },
    });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    await refresh();
    const saved = cfg.settings.workflowLayout[String(w.id)];
    assert.deepEqual(saved, { [a.id]: { x: 10, y: 20 }, [b.id]: { x: 300, y: -40 } });
  });

  it('không phải ADMIN thì 403; đầu vào hỏng thì 400; quy trình dự án khác thì 404', async () => {
    const w = wf();
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/workflows/${w.id}/layout`, { positions: {} })).status, 403);
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/workflows/${w.id}/layout`, { positions: { abc: { x: 1, y: 1 } } })).status, 400);
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/workflows/${w.id}/layout`, { positions: { 1: { x: 'a', y: 1 } } })).status, 400);
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/workflows/99999999/layout`, { positions: {} })).status, 404);
  });

  it('lưu bố cục không đè các khoá settings khác; positions=null xoá bố cục', async () => {
    const w = wf();
    await call(lead, 'PATCH', `/projects/${pid}`, { settings: { estimation: 'points' } });
    await call(lead, 'PUT', `/projects/${pid}/workflows/${w.id}/layout`, { positions: { [w.statuses[0].id]: { x: 1, y: 2 } } });
    await refresh();
    assert.equal(cfg.settings.estimation, 'points');
    assert.ok(cfg.settings.workflowLayout[String(w.id)]);
    const r = await call(lead, 'PUT', `/projects/${pid}/workflows/${w.id}/layout`, { positions: null });
    assert.equal(r.status, 200);
    await refresh();
    assert.equal(cfg.settings.workflowLayout[String(w.id)], undefined);
    assert.equal(cfg.settings.estimation, 'points');
  });

  it('sơ đồ dựng luồng tuyến tính + "từ bất kỳ" rồi về tự do', async () => {
    const w = wf();
    const ids = w.statuses.map((s: any) => s.id);
    const transitions = [
      ...ids.slice(0, -1).map((id: number, i: number) => ({ from: id, to: ids[i + 1] })),
      { from: null, to: ids[0] },
    ];
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/workflows/${w.id}/transitions`, { mode: 'restricted', transitions })).status, 200);
    await refresh();
    assert.equal(wf().transitions.length, transitions.length);
    assert.ok(wf().transitions.some((t: any) => t.fromStatusId === null && t.toStatusId === ids[0]));
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/workflows/${w.id}/transitions`, { mode: 'free' })).status, 200);
    await refresh();
    assert.equal(wf().transitions.length, 0);
  });
});
