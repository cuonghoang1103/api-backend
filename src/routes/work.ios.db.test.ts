/**
 * CT Work — tuyến cho app iOS (18/10/2026), qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ios.db.test.ts
 *
 *   N  notify-settings: push theo loại + múi giờ · /social/notifications?surface=work (+ unread-count, PATCH all theo bề mặt)
 *   R  Báo cáo nội dung: tin chat (lối tắt + /report), trùng, tự báo, người ngoài 404, cờ hiddenForMe · khách báo bình luận
 *      PUBLIC (không báo được ghi chú nội bộ) · agent không báo được
 *   B  Chặn (/messages/blocks): @nhắc của người bị chặn không tới chuông · tin của họ mang cờ authorBlocked
 *   D  Nhắn riêng 1-1: tạo / mở lại / khách bị chặn tuyến / người ngoài đội 404 / đã chặn ⇒ 403
 *   A  /me/agenda + /me/timesheet · /versions/:id counts · burndown totalIssues · /dashboards/:id · PATCH page baseVersion
 */

import './work.ctw5b.testenv.js';
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
const tag = `ios${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — tuyến cho app iOS (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, client: U, outsider: U;
  let ext: { token: string; userId: number };
  let wsId = 0, pid = 0;
  let cfg: any;
  let general = 0, devMsg = 0, shared = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown, prefix = '/api/v1/work') {
    const res = await fetch(`${base}${prefix}${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  const post = (u: U, cid: number, body: string) => call(u, 'POST', `/projects/${pid}/chat/channels/${cid}/messages`, { body });
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    process.env.WORK_CHAT_RPM = '1000';
    const { default: workRoutes } = await import('./work.routes.js');
    const { default: notifRoutes } = await import('./notifications.routes.js');
    const app = express();
    app.use(express.json({ limit: '2mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use('/api/v1/social/notifications', notifRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, dev, client, outsider] = await Promise.all(['owner', 'dev', 'client', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    const ids = [...userIds, ...(ext ? [ext.userId] : [])];
    if (ids.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.adminNotification.deleteMany({ where: { userId: { in: ids } } });
      await prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: { in: ids } }, { blockedId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT có cổng khách — dev MEMBER, khách CLIENT, agent ngoài', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `iOS ${tag}` });
    wsId = ws.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'IO', name: 'iOS project', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.equal(typeof cfg.permissions.viewReports, 'boolean');
    shared = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Shared login page' })).data.number;
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${shared}/client-visible`, { visible: true })).status, 200);
    const a = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'iOS Bot', model: 'claude-sonnet-5', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    ext = { token: a.data.token.token, userId: a.data.agent.userId };
    general = (await call(owner, 'GET', `/projects/${pid}/chat/channels`)).data.channels.find((c: any) => c.name === 'general').id;
  });

  // ═══ N ═══════════════════════════════════════════════════════════

  it('N1 notify-settings: push mặc định bật hết, timezone null; PUT một phần giữ phần còn lại; múi giờ sai ⇒ 400', async () => {
    const g = await call(dev, 'GET', '/me/notify-settings');
    assert.deepEqual(g.data.push, { assign: true, comment: true, mention: true, alert: true, approval: true, chatAll: true });
    assert.equal(g.data.timezone, null);
    const p = await call(dev, 'PUT', '/me/notify-settings', { push: { chatAll: false }, timezone: 'Asia/Tokyo' });
    assert.equal(p.status, 200, JSON.stringify(p.raw));
    const g2 = (await call(dev, 'GET', '/me/notify-settings')).data;
    assert.equal(g2.push.chatAll, false);
    assert.equal(g2.push.mention, true);
    assert.equal(g2.timezone, 'Asia/Tokyo');
    assert.equal(g2.emailMode, 'INSTANT');
    assert.equal((await call(dev, 'PUT', '/me/notify-settings', { timezone: 'Mars/Olympus' })).code, 'WORK_BAD_TIMEZONE');
    assert.equal((await call(dev, 'PUT', '/me/notify-settings', { push: { nope: true } })).status, 400);
    await call(dev, 'PUT', '/me/notify-settings', { push: { chatAll: true }, timezone: null });
  });

  it('N2 /social/notifications?surface=work chỉ WORK_*; unread-count theo bề mặt; PATCH all theo bề mặt', async () => {
    await prisma.socialNotification.createMany({ data: [
      { receiverId: dev.id, senderId: owner.id, type: 'WORK_ALERT', payload: { message: 'x', surface: 'work' } },
      { receiverId: dev.id, senderId: owner.id, type: 'NEW_POST' },
    ] });
    const all = await call(dev, 'GET', '?limit=50', undefined, '/api/v1/social/notifications');
    assert.ok(all.data.items.some((n: any) => n.type === 'NEW_POST'));
    const work = await call(dev, 'GET', '?surface=work&limit=50', undefined, '/api/v1/social/notifications');
    assert.ok(work.data.items.length >= 1);
    assert.ok(work.data.items.every((n: any) => n.type.startsWith('WORK_')));
    assert.equal(work.data.items[0].sender.kind, 'HUMAN');
    const cWork = (await call(dev, 'GET', '/unread-count?surface=work', undefined, '/api/v1/social/notifications')).data.unreadCount;
    const cAll = (await call(dev, 'GET', '/unread-count', undefined, '/api/v1/social/notifications')).data.unreadCount;
    assert.ok(cAll > cWork && cWork >= 1);
    await call(dev, 'PATCH', '', { all: true, surface: 'work' }, '/api/v1/social/notifications');
    assert.equal((await call(dev, 'GET', '/unread-count?surface=work', undefined, '/api/v1/social/notifications')).data.unreadCount, 0);
    assert.ok((await call(dev, 'GET', '/unread-count?surface=social', undefined, '/api/v1/social/notifications')).data.unreadCount >= 1, 'thông báo mạng xã hội vẫn chưa đọc');
  });

  // ═══ R ═══════════════════════════════════════════════════════════

  it('R1 báo cáo tin chat: lối tắt 201 · trùng ⇒ duplicate · tự báo 400 · người ngoài 404 · cờ hiddenForMe cho người báo', async () => {
    const m = await post(dev, general, 'buy cheap followers here');
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    devMsg = m.data.id;
    const r = await call(owner, 'POST', `/projects/${pid}/chat/channels/${general}/messages/${devMsg}/report`, { reason: 'spam', detail: 'ad' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.deepEqual(r.data, { reported: true, duplicate: false });
    assert.ok(await prisma.adminNotification.findUnique({ where: { khoaChongTrung: `ctw-report:chat_message:${devMsg}:${owner.id}` } }));
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'content.report', targetId: devMsg } }));
    const again = await call(owner, 'POST', '/report', { kind: 'chat_message', id: devMsg, reason: 'spam' });
    assert.equal(again.data.duplicate, true);
    assert.equal((await call(dev, 'POST', '/report', { kind: 'chat_message', id: devMsg, reason: 'spam' })).code, 'WORK_REPORT_SELF');
    assert.equal((await call(outsider, 'POST', '/report', { kind: 'chat_message', id: devMsg, reason: 'spam' })).status, 404);
    assert.equal((await call(owner, 'POST', '/report', { kind: 'nope', id: devMsg, reason: 'spam' })).status, 400);
    const list = (await call(owner, 'GET', `/projects/${pid}/chat/channels/${general}/messages`)).data.messages;
    const mine = list.find((x: any) => x.id === devMsg);
    assert.equal(mine.reportedByMe, true);
    assert.equal(mine.hiddenForMe, true);
    const devView = (await call(dev, 'GET', `/projects/${pid}/chat/channels/${general}/messages`)).data.messages.find((x: any) => x.id === devMsg);
    assert.equal(devView.hiddenForMe, false, 'chỉ ẩn với người báo cáo');
  });

  it('R2 khách báo cáo được bình luận PUBLIC trên thẻ đã chia sẻ; ghi chú nội bộ ⇒ 404', async () => {
    const pub = await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Reply to client' }] }] }, visibility: 'PUBLIC' });
    const internal = await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'internal note' }] }] } });
    assert.equal(pub.status, 201, JSON.stringify(pub.raw));
    const r = await call(client, 'POST', `/projects/${pid}/issues/${shared}/comments/${pub.data.id}/report`, { reason: 'harassment' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal((await call(client, 'POST', `/projects/${pid}/issues/${shared}/comments/${internal.data.id}/report`, { reason: 'spam' })).status, 404);
    assert.equal((await call(client, 'POST', '/report', { kind: 'issue_comment', id: internal.data.id, reason: 'spam' })).status, 404);
    const seen = (await call(client, 'GET', `/projects/${pid}/issues/${shared}/comments`)).data.find((c: any) => c.id === pub.data.id);
    assert.equal(seen.reportedByMe, true);
    // Khách không gọi được tuyến nội bộ khác qua lối báo cáo họp.
    assert.equal((await call(client, 'POST', `/projects/${pid}/meetings/1/report`, { reason: 'spam' })).code, 'CLIENT_PORTAL_ONLY');
  });

  it('R3 agent không báo cáo: /report ⇒ 403 (tuyến ngoài dự án), báo cáo bình luận ⇒ 403', async () => {
    assert.equal((await call({ token: ext.token }, 'POST', '/report', { kind: 'chat_message', id: devMsg, reason: 'spam' })).status, 403);
    assert.equal((await call({ token: ext.token }, 'POST', `/projects/${pid}/issues/${shared}/comments/1/report`, { reason: 'spam' })).status, 403);
  });

  // ═══ B ═══════════════════════════════════════════════════════════

  it('B1 dev chặn owner ⇒ @nhắc của owner không tới chuông dev; tin của owner mang cờ authorBlocked với dev', async () => {
    await prisma.userBlock.create({ data: { blockerId: dev.id, blockedId: owner.id } });
    const before = await prisma.socialNotification.count({ where: { receiverId: dev.id, type: 'WORK_MENTION' } });
    const m = await post(owner, general, `hey @${dev.username} look`);
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    await sleep(400);
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: dev.id, type: 'WORK_MENTION' } }), before);
    const v = (await call(dev, 'GET', `/projects/${pid}/chat/channels/${general}/messages`)).data.messages.find((x: any) => x.id === m.data.id);
    assert.equal(v.authorBlocked, true);
    assert.equal(v.hiddenForMe, true);
  });

  // ═══ D ═══════════════════════════════════════════════════════════

  it('D1 nhắn riêng: đã chặn ⇒ 403; bỏ chặn ⇒ tạo (201) rồi mở lại (200, cùng id); khách ⇒ CLIENT_PORTAL_ONLY; nhắn khách ⇒ 404', async () => {
    assert.equal((await call(owner, 'POST', `/projects/${pid}/chat/dm`, { userId: dev.id })).code, 'USER_BLOCKED');
    await prisma.userBlock.deleteMany({ where: { blockerId: dev.id, blockedId: owner.id } });
    const a = await call(owner, 'POST', `/projects/${pid}/chat/dm`, { userId: dev.id });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal(a.data.kind, 'DM');
    const b = await call(dev, 'POST', `/projects/${pid}/chat/dm`, { userId: owner.id });
    assert.equal(b.status, 200);
    assert.equal(b.data.id, a.data.id);
    assert.equal((await post(dev, a.data.id, 'private hello')).status, 201);
    assert.equal((await call(client, 'POST', `/projects/${pid}/chat/dm`, { userId: owner.id })).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/chat/dm`, { userId: client.id })).status, 404);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/chat/dm`, { userId: owner.id })).status, 400);
  });

  // ═══ A ═══════════════════════════════════════════════════════════

  it('A1 /me/agenda có hạn thẻ của tôi; /me/timesheet cộng giờ đã ghi theo dự án', async () => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const i = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Due today', assigneeId: dev.id, dueDate: today });
    assert.equal(i.status, 201, JSON.stringify(i.raw));
    const ag = await call(dev, 'GET', `/me/agenda?from=${today}&to=${today}`);
    assert.equal(ag.status, 200, JSON.stringify(ag.raw));
    const due = ag.data.items.find((x: any) => x.type === 'due' && x.number === i.data.number);
    assert.ok(due, JSON.stringify(ag.data));
    assert.equal(due.key, `IO-${i.data.number}`);
    assert.equal((await call(dev, 'GET', '/me/agenda?from=2026-01-01&to=2026-12-31')).status, 400, '> 120 ngày');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${i.data.number}/worklogs`, { minutes: 45 })).status, 201);
    const ts = await call(dev, 'GET', `/me/timesheet?week=${today}`);
    assert.equal(ts.status, 200, JSON.stringify(ts.raw));
    assert.equal(ts.data.totalMin, 45);
    assert.equal(ts.data.projects[0].project.key, 'IO');
    assert.equal(ts.data.byDay[today], 45);
    assert.equal((await call({ token: ext.token }, 'GET', '/me/agenda')).status, 403);
  });

  it('A2 /versions/:id có counts; burndown có totalIssues/doneIssues; /dashboards/:id; agent-leases mảng', async () => {
    const v = await call(owner, 'POST', `/projects/${pid}/versions`, { name: 'v1.0' });
    assert.equal(v.status, 201, JSON.stringify(v.raw));
    const i = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'In v1', fixVersionId: v.data.id });
    assert.equal(i.status, 201, JSON.stringify(i.raw));
    const vd = await call(owner, 'GET', `/projects/${pid}/versions/${v.data.id}`);
    assert.equal(vd.data.counts.total, 1, JSON.stringify(vd.data.counts));
    assert.equal(vd.data.counts.done, 0);
    const s = await call(owner, 'POST', `/projects/${pid}/sprints`, { name: 'S1' });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    const bd = await call(owner, 'GET', `/projects/${pid}/reports/burndown?sprintId=${s.data.id}`);
    assert.equal(bd.status, 200, JSON.stringify(bd.raw));
    assert.equal(bd.data.totalIssues, 0);
    assert.equal(bd.data.doneIssues, 0);
    const d = await call(owner, 'POST', `/projects/${pid}/dashboards`, { name: 'Mine', widgets: [] });
    assert.equal(d.status, 201, JSON.stringify(d.raw));
    const dg = await call(owner, 'GET', `/projects/${pid}/dashboards/${d.data.id}`);
    assert.equal(dg.data.name, 'Mine');
    assert.equal(dg.data.canEdit, true);
    assert.equal((await call(owner, 'GET', `/projects/${pid}/dashboards/999999`)).status, 404);
    assert.ok(Array.isArray((await call(owner, 'GET', `/projects/${pid}/agent-leases`)).data));
  });

  it('A3 PATCH trang với baseVersion: lệch ⇒ 409 WORK_PAGE_CONFLICT; khớp ⇒ lưu, version tăng', async () => {
    const pg = await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'Spec' });
    assert.equal(pg.status, 201, JSON.stringify(pg.raw));
    const cur = (await call(owner, 'GET', `/projects/${pid}/pages/${pg.data.number}`)).data;
    const v0 = cur.version;
    const doc = (t: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }] });
    const okr = await call(owner, 'PATCH', `/projects/${pid}/pages/${pg.data.number}`, { contentJson: doc('first'), baseVersion: v0 });
    assert.equal(okr.status, 200, JSON.stringify(okr.raw));
    assert.equal(okr.data.version, v0 + 1);
    const stale = await call(dev, 'PATCH', `/projects/${pid}/pages/${pg.data.number}`, { contentJson: doc('stale edit'), baseVersion: v0 });
    assert.equal(stale.status, 409);
    assert.equal(stale.code, 'WORK_PAGE_CONFLICT');
    const rn = await call(owner, 'PATCH', `/projects/${pid}/pages/${pg.data.number}`, { title: 'Spec v2', baseVersion: v0 + 1 });
    assert.equal(rn.status, 200, JSON.stringify(rn.raw));
    assert.equal(rn.data.title, 'Spec v2');
  });
});
