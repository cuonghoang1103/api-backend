/**
 * Tìm thẻ MỌI dự án (GET /work/search, /work/search/facets) qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.globalsearch.db.test.ts
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
const tag = `wg${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

const doc = (text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });

describe('CT Work — tìm thẻ mọi dự án', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, outsider: U;
  let wsId = 0;
  const pids: Record<string, number> = {};

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
  const search = (u: U, params: Record<string, string | number>) =>
    call(u, 'GET', `/search?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}`);
  async function typeId(u: U, pid: number, key = 'TASK') {
    return (await call(u, 'GET', `/projects/${pid}`)).data.issueTypes.find((t: any) => t.key === key).id;
  }
  async function mkIssue(u: U, key: string, title: string, extra: Record<string, unknown> = {}) {
    const r = await call(u, 'POST', `/projects/${pids[key]}/issues`, { typeId: await typeId(u, pids[key]), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data;
  }
  const keysOf = (r: any) => r.data.items.map((i: any) => i.key) as string[];

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, outsider] = await Promise.all(['lead', 'dev', 'out'].map(mkUser));

    // Không gian A: SHOP + QA (ai trong không gian cũng thấy), SEC riêng tư.
    wsId = (await call(lead, 'POST', '/workspaces', { name: `Search ${tag}` })).data.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    for (const [key, visibility] of [['SHOP', 'WORKSPACE'], ['QA', 'WORKSPACE'], ['SEC', 'PRIVATE']] as const) {
      const r = await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key, name: `${key} project`, template: 'BLANK', visibility });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      pids[key] = r.data.id;
    }
    // Không gian C của người khác — dev không phải thành viên.
    const wsC = (await call(outsider, 'POST', '/workspaces', { name: `Other ${tag}` })).data.id;
    pids.OUT = (await call(outsider, 'POST', `/workspaces/${wsC}/projects`, { key: 'OUT', name: 'Outside', template: 'BLANK' })).data.id;

    await mkIssue(lead, 'SHOP', 'Login page broken', { priority: 1 });                                  // SHOP-1
    await mkIssue(lead, 'SHOP', 'Checkout login redirect', { priority: 3 });                            // SHOP-2
    await mkIssue(lead, 'SHOP', 'Payment flow', { priority: 5, descriptionJson: doc('fails after login on mobile') }); // SHOP-3
    await mkIssue(lead, 'QA', 'Login tests', { priority: 2 });                                          // QA-1
    await mkIssue(lead, 'QA', 'Regression suite', { priority: 4 });                                     // QA-2
    await mkIssue(lead, 'SEC', 'Login secret rotation', { priority: 1 });                               // SEC-1
    await mkIssue(outsider, 'OUT', 'Login outsider', { priority: 1 });                                  // OUT-1
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('chỉ thấy dự án mình xem được: không lộ dự án riêng tư / không gian khác', async () => {
    const r = await search(dev, { q: 'login' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const keys = keysOf(r);
    assert.deepEqual([...keys].sort(), ['QA-1', 'SHOP-1', 'SHOP-2', 'SHOP-3']);
    assert.equal(r.data.total, 4);
    assert.ok(!keys.some((k) => k.startsWith('SEC') || k.startsWith('OUT')));
    const all = await search(dev, { jql: '' });
    assert.equal(all.data.total, 5);
    assert.equal(all.data.projectsSearched, 2);
    // Chủ không gian thấy cả dự án riêng tư.
    assert.ok(keysOf(await search(lead, { q: 'login' })).includes('SEC-1'));
    // Facets cũng không lộ.
    const f = await call(dev, 'GET', '/search/facets');
    assert.equal(f.status, 200);
    assert.deepEqual(f.data.projects.map((p: any) => p.key).sort(), ['QA', 'SHOP']);
    assert.ok(f.data.statuses.some((s: any) => s.name === 'Done' && s.category === 'DONE'));
    assert.ok(f.data.types.some((t: any) => t.key === 'TASK'));
    assert.ok(f.data.assignees.some((u: any) => u.id === dev.id));
  });

  it('dạng kết quả: khoá, dự án, không gian, trạng thái, loại, url', async () => {
    const it0 = (await search(dev, { q: 'SHOP-1' })).data.items[0];
    assert.equal(it0.key, 'SHOP-1');
    assert.equal(it0.match, 'key');
    assert.equal(it0.project.key, 'SHOP');
    assert.equal(it0.project.name, 'SHOP project');
    assert.ok(it0.workspace.slug);
    assert.equal(it0.url, `/work/${it0.workspace.slug}/SHOP/issue/1`);
    assert.ok(it0.status.name && it0.status.category && it0.status.color);
    assert.ok(it0.type.name && it0.type.icon && it0.type.color);
    assert.equal('email' in (it0.assignee ?? {}), false);
  });

  it('q xếp theo độ khớp: khoá > tiêu đề bắt đầu bằng > tiêu đề chứa > mô tả', async () => {
    const r = await search(dev, { q: 'login' });
    const keys = keysOf(r);
    assert.deepEqual(keys.slice(0, 2).sort(), ['QA-1', 'SHOP-1']); // tiền tố tiêu đề
    assert.equal(keys[2], 'SHOP-2');                                 // tiêu đề chứa
    assert.equal(keys[3], 'SHOP-3');                                 // chỉ mô tả
    assert.deepEqual(r.data.items.map((i: any) => i.match), ['title', 'title', 'title', 'description']);
    // Khoá chính xác đứng đầu dù tiêu đề không khớp.
    const k = await search(dev, { q: 'qa-2' });
    assert.equal(keysOf(k)[0], 'QA-2');
    // Khoá của dự án không thấy được ⇒ không gì.
    assert.equal((await search(dev, { q: 'SEC-1' })).data.total, 0);
  });

  it('ORDER BY xuyên dự án + phân trang nhất quán', async () => {
    const byPri = await search(dev, { jql: 'ORDER BY priority ASC' });
    assert.deepEqual(keysOf(byPri), ['SHOP-1', 'QA-1', 'SHOP-2', 'QA-2', 'SHOP-3']);
    const byKey = await search(dev, { jql: 'ORDER BY key DESC' });
    assert.deepEqual(keysOf(byKey), ['SHOP-3', 'SHOP-2', 'SHOP-1', 'QA-2', 'QA-1']);
    const p1 = await search(dev, { jql: 'ORDER BY priority DESC', limit: 2 });
    const p2 = await search(dev, { jql: 'ORDER BY priority DESC', limit: 2, offset: 2 });
    const p3 = await search(dev, { jql: 'ORDER BY priority DESC', limit: 2, offset: 4 });
    assert.deepEqual([...keysOf(p1), ...keysOf(p2), ...keysOf(p3)], ['SHOP-3', 'QA-2', 'SHOP-2', 'QA-1', 'SHOP-1']);
    assert.equal(p1.data.hasMore, true);
    assert.equal(p3.data.hasMore, false);
    // Trường không sắp được ⇒ lỗi JQL có gợi ý.
    const bad = await search(dev, { jql: 'ORDER BY prioirty' });
    assert.equal(bad.status, 400);
    assert.equal(bad.raw.code, 'WORK_JQL_ERROR');
    assert.equal(bad.raw.data.suggestion, 'priority');
  });

  it('project = X / IN / != và lỗi khi dự án không thấy được', async () => {
    assert.deepEqual(keysOf(await search(dev, { jql: 'project = QA ORDER BY key' })), ['QA-1', 'QA-2']);
    assert.deepEqual(keysOf(await search(dev, { jql: 'project IN (QA, SHOP) AND priority >= High ORDER BY key' })), ['QA-1', 'SHOP-1']);
    assert.deepEqual(keysOf(await search(dev, { jql: 'project != SHOP ORDER BY key' })), ['QA-1', 'QA-2']);
    assert.deepEqual(keysOf(await search(dev, { jql: 'project = "QA project" ORDER BY key' })), ['QA-1', 'QA-2']);
    const sec = await search(dev, { jql: 'project = SEC' });
    assert.equal(sec.status, 400);
    assert.equal(sec.raw.code, 'WORK_JQL_ERROR');
    assert.match(sec.raw.message, /No project "SEC"/);
    const typo = await search(dev, { jql: 'status = Done AND project = SHPO' });
    assert.equal(typo.status, 400);
    assert.equal(typo.raw.data.suggestion, 'SHOP');
    assert.equal(typo.raw.data.position, 'status = Done AND project = '.length);
  });

  it('tên chỉ có ở một dự án khớp ở đó; không có ở đâu mới là lỗi', async () => {
    const qaWf = (await call(lead, 'GET', `/projects/${pids.QA}`)).data.workflows.find((w: any) => w.isDefault);
    const st = await call(lead, 'POST', `/projects/${pids.QA}/workflows/${qaWf.id}/statuses`, { name: 'Blocked', category: 'IN_PROGRESS' });
    assert.equal(st.status, 201, JSON.stringify(st.raw));
    const cfg = (await call(lead, 'GET', `/projects/${pids.QA}`)).data;
    const blocked = cfg.workflows.flatMap((w: any) => w.statuses).find((s: any) => s.name === 'Blocked');
    const mv = await call(lead, 'PATCH', `/projects/${pids.QA}/issues/2`, { statusId: blocked.id });
    assert.equal(mv.status, 200, JSON.stringify(mv.raw));

    assert.deepEqual(keysOf(await search(dev, { jql: 'status = Blocked' })), ['QA-2']);
    assert.equal((await search(dev, { jql: 'status != Blocked' })).data.total, 4);
    const bad = await search(dev, { jql: 'status = Blokced' });
    assert.equal(bad.status, 400);
    assert.equal(bad.raw.data.suggestion, 'Blocked');
    assert.equal(bad.raw.data.position, 'status = '.length);
    const nobody = await search(dev, { jql: 'assignee = ghostuser' });
    assert.equal(nobody.status, 400);
    // Lỗi cú pháp giữ đúng khuôn.
    const syn = await search(dev, { jql: 'status = ' });
    assert.equal(syn.raw.code, 'WORK_JQL_ERROR');
    assert.equal(syn.raw.data.position, 9);
  });

  it('dự án lưu trữ bị bỏ, trừ khi gọi tên rõ', async () => {
    assert.equal((await call(lead, 'POST', `/projects/${pids.QA}/archive`, { archived: true })).status, 200);
    assert.ok(!keysOf(await search(dev, { jql: '' })).some((k) => k.startsWith('QA')));
    assert.deepEqual(keysOf(await search(dev, { jql: 'project = QA ORDER BY key' })), ['QA-1', 'QA-2']);
    await call(lead, 'POST', `/projects/${pids.QA}/archive`, { archived: false });
  });

  it('tìm trong một dự án vẫn chạy: project = CHÍNH NÓ khớp hết, dự án khác khớp rỗng', async () => {
    const self = await call(dev, 'GET', `/projects/${pids.SHOP}/search?jql=${encodeURIComponent('project = SHOP')}`);
    assert.equal(self.status, 200, JSON.stringify(self.raw));
    assert.equal(self.data.total, 3);
    const other = await call(dev, 'GET', `/projects/${pids.SHOP}/search?jql=${encodeURIComponent('project = QA')}`);
    assert.equal(other.status, 200);
    assert.equal(other.data.total, 0);
  });

  it('bị gỡ khỏi không gian ⇒ mất hết kết quả của không gian đó', async () => {
    assert.equal((await call(lead, 'DELETE', `/workspaces/${wsId}/members/${dev.id}`)).status, 200);
    const r = await search(dev, { q: 'login' });
    assert.equal(r.status, 200);
    assert.equal(r.data.total, 0);
    assert.equal(r.data.projectsSearched, 0);
    assert.deepEqual((await call(dev, 'GET', '/search/facets')).data.projects, []);
    const named = await search(dev, { jql: 'project = SHOP' });
    assert.equal(named.status, 400);
  });
});
