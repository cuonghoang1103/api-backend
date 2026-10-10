/**
 * CT Work đợt 7a — OKR · planning poker · retro board · timer, qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw7a.db.test.ts
 *
 *   O  OKR: chu kỳ (quyền tạo/đóng), objective dự án + không gian + căn chỉnh, KR nhập tay / tự tính từ epic + điểm,
 *      check-in tuần (ghi đè trong tuần, người phụ trách KR), dashboard, chấm điểm, đóng chu kỳ tự chấm + khoá sửa,
 *      khách/guest/người ngoài 404, agent chỉ đọc.
 *   P  Poker: tạo phòng từ sprint, bỏ phiếu KÍN (người khác chỉ thấy "đã bỏ"), lật, phân bố, bỏ phiếu lại (lịch sử vòng),
 *      chốt ⇒ story_points của thẻ, hết giờ ⇒ tự lật, quyền (viewer/agent không bỏ phiếu, chỉ người điều phối lật/chốt),
 *      gợi ý chỉ đọc.
 *   R  Retro: ẩn danh THẬT (không tác giả qua API với cả ADMIN, cả bản xuất, cả ghi chú gửi AI), không tắt được ẩn danh,
 *      dot vote có trần, gom nhóm, chỉ tác giả sửa chữ, khoá theo hạn (423) nhưng vẫn tạo hành động ⇒ thẻ, xuất docx.
 *   T  Timer: một timer mỗi người (409 + khoá duy nhất), dừng ⇒ worklog có activity, đổi thẻ (switch) ghi giờ thẻ cũ,
 *      nhắc khi chạy quá lâu (một lần), viewer/agent không dùng.
 */

import './work.ctw5b.testenv.js';
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
const tag = `c7a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work đợt 7a — OKR, planning poker, retro, timer (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, dev2: U, viewer: U, teacher: U, client: U, outsider: U;
  let agent: { token: string; userId: number };
  let wsId = 0, pid = 0;
  let cfg: any;
  const num: Record<string, number> = {};
  let doneStatusId = 0;
  let sprintId = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json')) return { status: res.status, data: null as any, code: undefined as string | undefined, raw: null as any, buf: Buffer.from(await res.arrayBuffer()), text: '' };
    const text = await res.text();
    const json = (text ? JSON.parse(text) : {}) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, buf: null as Buffer | null, text };
  }
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k)?.id;
  const issue = async (title: string, extra: Record<string, unknown> = {}) => {
    const r = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data.number as number;
  };
  /** Khách cổng: chốt chung trả 403 CLIENT_PORTAL_ONLY trước khi tới service (service tự trả 404 nếu lọt). */
  const blocked = (r: { status: number; code?: string }) => r.status === 404 || (r.status === 403 && r.code === 'CLIENT_PORTAL_ONLY');
  const markDone = async (n: number) => prisma.workIssue.update({ where: { uk_work_issue_number: { projectId: pid, number: n } }, data: { statusId: doneStatusId } });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, dev, dev2, viewer, teacher, client, outsider] = await Promise.all(['owner', 'dev', 'dev2', 'viewer', 'teacher', 'client', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    const ai = await import('../services/work/ai.service.js');
    ai._setAskForTests(null);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    const ids = [...userIds, ...(agent ? [agent.userId] : [])];
    await prisma.workTimer.deleteMany({ where: { userId: { in: ids } } });
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
    await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  });

  it('dựng: dự án có cổng khách — dev/dev2 MEMBER, viewer VIEWER, teacher (GUEST/TEACHER), khách CLIENT, agent ngoài', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `7A ${tag}` });
    assert.equal(ws.status, 201, JSON.stringify(ws.raw));
    wsId = ws.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, dev2.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SA', name: 'Agile project', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const [u, role] of [[dev, 'MEMBER'], [dev2, 'MEMBER'], [viewer, 'VIEWER']] as const) await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [teacher.email], role: 'GUEST', projectId: pid, projectRole: 'TEACHER' });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    const done = await prisma.workStatus.findFirst({ where: { workflow: { projectId: pid }, category: 'DONE' }, select: { id: true } });
    doneStatusId = done!.id;
    const sp = await call(owner, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint 1' });
    assert.equal(sp.status, 201, JSON.stringify(sp.raw));
    sprintId = sp.data.id;
    const epicType = typeId('EPIC');
    assert.ok(epicType, 'mẫu COMPANY có loại EPIC');
    num.epic = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: epicType, title: 'Checkout epic' })).data.number;
    const epicId = (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num.epic } })).id;
    num.c1 = await issue('Login page with Google OAuth', { parentId: epicId, storyPoints: 5, sprintId });
    num.c2 = await issue('Checkout payment form', { parentId: epicId, storyPoints: 3, sprintId });
    num.c3 = await issue('Login page with Facebook OAuth', { sprintId });
    num.other = await issue('Export invoices to Excel');
    const a = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Agile Bot', model: 'claude-sonnet-5', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    agent = { token: a.data.token.token, userId: a.data.agent.userId };
  });

  // ═══ O: OKR ═══════════════════════════════════════════════════════

  let cycleId = 0, objId = 0, wsObjId = 0;
  const kr: Record<string, number> = {};
  const projOkrs = (u: { token: string }) => call(u, 'GET', `/projects/${pid}/okrs`);

  it('O1 chu kỳ: thành viên không gian tạo được; ngày sai ⇒ 400; GUEST/người ngoài 404', async () => {
    const today = new Date();
    const start = new Date(today.getTime() - 30 * 86_400_000).toISOString().slice(0, 10);
    const end = new Date(today.getTime() + 60 * 86_400_000).toISOString().slice(0, 10);
    const c = await call(dev, 'POST', `/workspaces/${wsId}/okr-cycles`, { name: 'Q4 2026', startDate: start, endDate: end });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    cycleId = c.data.id;
    assert.equal((await call(dev, 'POST', `/workspaces/${wsId}/okr-cycles`, { name: 'Bad', startDate: end, endDate: start })).code, 'WORK_OKR_BAD_DATES');
    assert.equal((await call(teacher, 'GET', `/workspaces/${wsId}/okr-cycles`)).status, 404);
    assert.equal((await call(outsider, 'GET', `/workspaces/${wsId}/okrs`)).status, 404);
    assert.equal((await call(agent, 'POST', `/workspaces/${wsId}/okr-cycles`, { name: 'x', startDate: start, endDate: end })).status, 403);
  });

  it('O2 objective dự án + 4 KR: MEMBER tạo; VIEWER 403; khách 404', async () => {
    const body = {
      cycleId, title: 'Ship a delightful checkout',
      keyResults: [
        { title: 'Reach 10 paying pilots', metric: 'NUMBER', startValue: 0, targetValue: 10 },
        { title: 'Pass security review', metric: 'BOOLEAN' },
        { title: 'Finish checkout epic', source: 'ISSUES' },
        { title: 'Burn sprint points', source: 'POINTS', ownerId: viewer.id },
      ],
    };
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/okrs/objectives`, body)).status, 403);
    assert.ok(blocked(await call(client, 'POST', `/projects/${pid}/okrs/objectives`, body)));
    assert.ok(blocked(await call(client, 'GET', `/projects/${pid}/okrs`)));
    const o = await call(dev, 'POST', `/projects/${pid}/okrs/objectives`, body);
    assert.equal(o.status, 201, JSON.stringify(o.raw));
    objId = o.data.id;
    const g = await projOkrs(dev);
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.equal(g.data.cycle.id, cycleId);
    const obj = g.data.objectives[0];
    assert.equal(obj.keyResults.length, 4);
    for (const k of obj.keyResults) kr[k.title.split(' ')[0]] = k.id;
    assert.equal(obj.keyResults.find((k: any) => k.title.startsWith('Pass')).targetValue, 1);
    assert.equal(obj.progress, 0);
    // Giảng viên + viewer xem được; agent đọc được.
    assert.equal((await projOkrs(teacher)).status, 200);
    assert.equal((await projOkrs(viewer)).data.canEdit, false);
    assert.equal((await call(agent, 'GET', `/projects/${pid}/okrs`)).status, 200);
  });

  it('O3 KR tự tính: liên kết epic (thẻ + thẻ con) và sprint (điểm); thẻ xong ⇒ tiến độ đổi', async () => {
    const l1 = await call(dev, 'PUT', `/okrs/key-results/${kr.Finish}/links`, { links: [{ kind: 'EPIC', number: num.epic }] });
    assert.equal(l1.status, 200, JSON.stringify(l1.raw));
    const l2 = await call(dev, 'PUT', `/okrs/key-results/${kr.Burn}/links`, { links: [{ kind: 'SPRINT', sprintId }] });
    assert.equal(l2.status, 200, JSON.stringify(l2.raw));
    assert.equal((await call(dev, 'PUT', `/okrs/key-results/${kr.Finish}/links`, { links: [{ kind: 'ISSUE', number: 99999 }] })).code, 'WORK_OKR_BAD_LINK');
    await markDone(num.c1);
    const o = (await projOkrs(dev)).data.objectives[0];
    const fin = o.keyResults.find((k: any) => k.id === kr.Finish);
    assert.deepEqual(fin.linkSummary, { done: 1, total: 3, unit: 'issues' }); // epic + 2 con, c1 xong
    assert.equal(fin.progress, 0.333);
    const burn = o.keyResults.find((k: any) => k.id === kr.Burn);
    assert.deepEqual(burn.linkSummary, { done: 5, total: 8, unit: 'points' }); // sprint: c1 5đ xong, c2 3đ, c3 0đ
    assert.equal(burn.progress, 0.625);
    assert.equal(fin.links[0].key, `SA-${num.epic}`);
  });

  it('O4 check-in tuần: giá trị + độ tự tin; lần hai trong tuần ghi đè; người phụ trách KR (viewer) check-in được KR của mình', async () => {
    assert.equal((await call(viewer, 'POST', `/okrs/key-results/${kr.Reach}/checkins`, { value: 3, confidence: 5 })).status, 403);
    const c1 = await call(dev, 'POST', `/okrs/key-results/${kr.Reach}/checkins`, { value: 3, confidence: 8, note: 'Two pilots signed' });
    assert.equal(c1.status, 201, JSON.stringify(c1.raw));
    const c2 = await call(dev, 'POST', `/okrs/key-results/${kr.Reach}/checkins`, { value: 5, confidence: 6 });
    assert.equal(c2.data.progress, 0.5);
    assert.equal(await prisma.workOkrCheckin.count({ where: { keyResultId: kr.Reach } }), 1);
    assert.equal((await call(dev, 'POST', `/okrs/key-results/${kr.Reach}/checkins`, { confidence: 6 })).code, 'WORK_OKR_VALUE_REQUIRED');
    const v = await call(viewer, 'POST', `/okrs/key-results/${kr.Burn}/checkins`, { confidence: 3, note: 'Velocity is low' });
    assert.equal(v.status, 201, JSON.stringify(v.raw));
    assert.equal(v.data.progress, 0.625);
    assert.equal((await call(agent, 'POST', `/okrs/key-results/${kr.Reach}/checkins`, { value: 9, confidence: 9 })).status, 403);
    await call(dev, 'POST', `/okrs/key-results/${kr.Pass}/checkins`, { value: 1, confidence: 9 });
    const o = (await projOkrs(dev)).data;
    const obj = o.objectives[0];
    assert.equal(obj.keyResults.find((k: any) => k.id === kr.Reach).currentValue, 5);
    // (0.5 + 1 + 0.333 + 0.625) / 4
    assert.equal(obj.progress, 0.615);
    assert.equal(obj.confidence, 3, 'độ tự tin thấp nhất của KR');
    assert.ok(o.dashboard.weeks.length >= 4);
    assert.ok(o.dashboard.weeks.at(-1).actual > 0);
    assert.equal(o.dashboard.objectives, 1);
  });

  it('O5 objective KHÔNG GIAN: chỉ OWNER/ADMIN tạo; căn chỉnh objective dự án; trang không gian thấy cả hai', async () => {
    const body = { cycleId, title: 'Win the first 10 customers', keyResults: [{ title: 'Signed contracts', metric: 'NUMBER', startValue: 0, targetValue: 10 }] };
    assert.equal((await call(dev, 'POST', `/workspaces/${wsId}/okrs/objectives`, body)).status, 403);
    const w = await call(owner, 'POST', `/workspaces/${wsId}/okrs/objectives`, body);
    assert.equal(w.status, 201, JSON.stringify(w.raw));
    wsObjId = w.data.id;
    assert.equal((await call(dev, 'PATCH', `/okrs/objectives/${objId}`, { parentId: wsObjId })).status, 200);
    const all = await call(dev, 'GET', `/workspaces/${wsId}/okrs`);
    assert.equal(all.status, 200, JSON.stringify(all.raw));
    const titles = all.data.objectives.map((o: any) => o.title).sort();
    assert.deepEqual(titles, ['Ship a delightful checkout', 'Win the first 10 customers']);
    const mine = all.data.objectives.find((o: any) => o.id === objId);
    assert.equal(mine.parent.id, wsObjId);
    assert.equal(all.data.objectives.find((o: any) => o.id === wsObjId).canEdit, false, 'dev không sửa objective không gian');
    assert.equal((await call(dev, 'PATCH', `/okrs/objectives/${wsObjId}`, { title: 'hack' })).status, 403);
    assert.equal((await projOkrs(dev)).data.alignTo[0].id, wsObjId);
  });

  it('O6 chấm điểm 0–1; đóng chu kỳ tự chấm phần còn lại; sửa sau khi đóng ⇒ 400', async () => {
    const s = await call(dev, 'POST', `/okrs/objectives/${objId}/score`, { krScores: [{ id: kr.Reach, score: 0.5 }, { id: kr.Pass, score: 1 }], note: 'Solid quarter' });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.equal(s.data.score, 0.75);
    assert.equal(s.data.band, 'GREEN');
    assert.equal((await call(dev, 'POST', `/okrs/objectives/${objId}/score`, { krScores: [{ id: 999999, score: 1 }] })).code, 'WORK_OKR_BAD_SCORE');
    assert.equal((await call(dev2, 'PATCH', `/workspaces/${wsId}/okr-cycles/${cycleId}`, { status: 'CLOSED' })).status, 403, 'không phải người tạo / admin');
    const close = await call(owner, 'PATCH', `/workspaces/${wsId}/okr-cycles/${cycleId}`, { status: 'CLOSED' });
    assert.equal(close.status, 200, JSON.stringify(close.raw));
    assert.ok(close.data.autoScored >= 3, 'KR chưa chấm được chấm theo tiến độ');
    const krs = await prisma.workKeyResult.findMany({ where: { objectiveId: objId }, orderBy: { id: 'asc' } });
    assert.ok(krs.every((k) => k.score !== null));
    assert.equal(krs.find((k) => k.id === kr.Burn)!.score, 0.6);
    const w = await prisma.workObjective.findUniqueOrThrow({ where: { id: wsObjId } });
    assert.equal(w.score, 0);
    assert.equal((await call(dev, 'POST', `/okrs/key-results/${kr.Reach}/checkins`, { value: 9, confidence: 9 })).code, 'WORK_OKR_CYCLE_CLOSED');
    assert.equal((await projOkrs(dev)).data.objectives[0].status, 'SCORED');
  });

  // ═══ P: planning poker ════════════════════════════════════════════

  let sid = 0;
  let item = 0;
  const room = (u: { token: string }) => call(u, 'GET', `/projects/${pid}/poker/${sid}`);
  const itemOf = (d: any, n: number) => d.items.find((i: any) => i.issue.number === n);

  it('P1 tạo phòng từ sprint (thẻ chưa xong, không epic); viewer 403; khách 404', async () => {
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/poker`, { title: 'x', sprintId })).status, 403);
    assert.ok(blocked(await call(client, 'GET', `/projects/${pid}/poker`)));
    const s = await call(dev, 'POST', `/projects/${pid}/poker`, { title: 'Sprint 1 estimation', sprintId });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    sid = s.data.id;
    assert.equal(s.data.items, 2, 'c2 + c3 (c1 đã xong)');
    const add = await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items`, { issues: [num.other] });
    assert.equal(add.data.added, 1);
    const d = (await room(dev)).data;
    assert.equal(d.items.length, 3);
    assert.deepEqual(d.voters.map((v: any) => v.id).sort(), [owner.id, dev.id, dev2.id].sort(), 'chỉ ADMIN/MEMBER là người');
    item = itemOf(d, num.c3).id;
  });

  it('P2 bỏ phiếu KÍN: người khác chỉ thấy ai đã bỏ, không thấy lá; viewer/agent không bỏ phiếu được', async () => {
    assert.equal((await call(dev2, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/start`)).status, 403, 'chỉ người điều phối');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/vote`, { value: '5' })).status, 409, 'chưa mở bỏ phiếu');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/start`)).status, 200);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/vote`, { value: '4' })).code, 'WORK_POKER_BAD_CARD');
    for (const [u, v] of [[dev, '5'], [dev2, '13'], [owner, '3']] as const) {
      const r = await call(u, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/vote`, { value: v });
      assert.equal(r.status, 200, JSON.stringify(r.raw));
    }
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/vote`, { value: '5' })).status, 403);
    assert.equal((await call(agent, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/vote`, { value: '5' })).status, 403);
    for (const u of [teacher, viewer, dev]) {
      const it0 = itemOf((await room(u)).data, num.c3);
      assert.equal(it0.state, 'VOTING');
      assert.equal(it0.votes, null, u.username);
      assert.equal(it0.distribution, null);
      assert.deepEqual([...it0.voted].sort(), [owner.id, dev.id, dev2.id].sort());
    }
    assert.equal(itemOf((await room(dev)).data, num.c3).myVote, '5');
    assert.equal(itemOf((await room(dev2)).data, num.c3).myVote, '13');
    assert.equal(itemOf((await room(teacher)).data, num.c3).myVote, null);
    // Lá 13 của dev2 không xuất hiện ở bất kỳ đâu trong phản hồi của dev.
    assert.ok(!JSON.stringify(itemOf((await room(dev)).data, num.c3)).includes('"13"'));
  });

  it('P3 lật: chỉ người điều phối; phân bố + thấp/cao; bỏ phiếu lại giữ lịch sử vòng 1', async () => {
    assert.equal((await call(dev2, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/reveal`)).status, 403);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/reveal`)).status, 200);
    const it1 = itemOf((await room(teacher)).data, num.c3);
    assert.equal(it1.state, 'REVEALED');
    assert.equal(it1.votes.length, 3);
    assert.equal(it1.distribution.low, '3');
    assert.equal(it1.distribution.high, '13');
    assert.equal(it1.distribution.suggested, '5');
    const rv = await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/revote`);
    assert.equal(rv.data.round, 2);
    await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/vote`, { value: '8' });
    await call(dev2, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/vote`, { value: '8' });
    const it2 = itemOf((await room(dev2)).data, num.c3);
    assert.equal(it2.round, 2);
    assert.equal(it2.votes, null, 'vòng 2 còn úp');
    assert.equal(it2.rounds.length, 1, 'vòng 1 đã lật nằm trong lịch sử');
    assert.equal(it2.rounds[0].votes.length, 3);
  });

  it('P4 hết giờ ⇒ máy chủ tự lật ở lần đọc kế; chốt ⇒ story_points; "?" không chốt được', async () => {
    const t = await call(dev, 'POST', `/projects/${pid}/poker/${sid}/timer`, { seconds: 30 });
    assert.equal(t.status, 200, JSON.stringify(t.raw));
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/timer`, { seconds: 45 })).status, 400);
    await prisma.workPokerSession.update({ where: { id: sid }, data: { timerEndsAt: new Date(Date.now() - 1000) } });
    const it3 = itemOf((await room(viewer)).data, num.c3);
    assert.equal(it3.state, 'REVEALED');
    assert.equal(it3.distribution.consensus, true);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/finalize`, { value: '?' })).code, 'WORK_POKER_BAD_CARD');
    assert.equal((await call(dev2, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/finalize`, { value: '8' })).status, 403);
    const f = await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${item}/finalize`, { value: '8' });
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    const iss = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num.c3 } });
    assert.equal(iss.storyPoints, 8);
    assert.ok(await prisma.workHistory.findFirst({ where: { issueId: iss.id, field: 'storyPoints', toValue: '8' } }), 'có lịch sử thay đổi');
    const hist = await call(viewer, 'GET', `/projects/${pid}/issues/${num.c3}/estimates`);
    assert.equal(hist.data[0].finalValue, '8');
    assert.equal(hist.data[0].round, 2);
  });

  it('P5 gợi ý CHỈ ĐỌC từ thẻ tương tự (agent gọi được); đóng phòng ⇒ không bỏ phiếu nữa', async () => {
    const d = (await room(dev)).data;
    const other = itemOf(d, num.other).id;
    const before = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num.other }, select: { storyPoints: true, version: true } });
    const g = await call(agent, 'GET', `/projects/${pid}/poker/${sid}/items/${itemOf(d, num.c2).id}/suggest`);
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.equal(g.data.kind, 'suggestion');
    const g2 = await call(dev, 'GET', `/projects/${pid}/poker/${sid}/items/${other}/suggest`);
    assert.equal(g2.data.suggested, null, 'không thẻ nào giống "Export invoices"');
    const after = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num.other }, select: { storyPoints: true, version: true } });
    assert.deepEqual(after, before);
    assert.equal((await call(agent, 'POST', `/projects/${pid}/poker/${sid}/close`)).status, 403);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/close`)).status, 200);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/poker/${sid}/items/${other}/vote`, { value: '3' })).code, 'WORK_POKER_CLOSED');
    const list = await call(teacher, 'GET', `/projects/${pid}/poker`);
    assert.equal(list.data.sessions[0].estimated, 1);
  });

  // ═══ R: retro ═════════════════════════════════════════════════════

  let rid = 0;
  const card: Record<string, number> = {};
  const retroOf = (u: { token: string }) => call(u, 'GET', `/projects/${pid}/retros/${rid}`);

  it('R1 tạo retro ẩn danh (3 chấm/người); viewer xem được nhưng không viết; khách 404', async () => {
    const r = await call(dev, 'POST', `/projects/${pid}/retros`, { title: 'Sprint 1 retro', template: 'SSC', sprintId, anonymous: true, votesPerPerson: 3 });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    rid = r.data.id;
    assert.ok(blocked(await call(client, 'GET', `/projects/${pid}/retros/${rid}`)));
    assert.equal((await retroOf(viewer)).status, 200);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/retros/${rid}/cards`, { column: 'START', body: 'x' })).status, 403);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/retros/${rid}/cards`, { column: 'MAD', body: 'x' })).code, 'WORK_RETRO_BAD_COLUMN');
  });

  it('R2 ẨN DANH THẬT: không tác giả qua API với người khác — kể cả ADMIN dự án và người tạo retro', async () => {
    card.a = (await call(dev2, 'POST', `/projects/${pid}/retros/${rid}/cards`, { column: 'STOP', body: 'Stop merging without review' })).data.id;
    card.b = (await call(owner, 'POST', `/projects/${pid}/retros/${rid}/cards`, { column: 'STOP', body: 'Skipping code review hurts' })).data.id;
    card.c = (await call(dev, 'POST', `/projects/${pid}/retros/${rid}/cards`, { column: 'START', body: 'Start pairing on hard bugs' })).data.id;
    card.d = (await call(dev2, 'POST', `/projects/${pid}/retros/${rid}/cards`, { column: 'CONTINUE', body: 'Daily standup at 9' })).data.id;
    for (const u of [owner, dev, viewer, teacher]) {
      const r = await retroOf(u);
      assert.equal(r.status, 200);
      for (const c of r.data.cards) {
        assert.equal(c.author, null, u.username);
        assert.ok(!('authorId' in c));
        assert.ok(!('createdAt' in c), 'thời điểm viết cũng có thể lộ người — bỏ');
      }
      assert.ok(!r.text.includes(dev2.username), `${u.username}: phản hồi không chứa tên người viết`);
      assert.ok(!r.text.includes(`"authorId"`));
      assert.ok(!r.text.includes(`"id":${dev2.id},`), 'không có id người viết');
    }
    const mine = (await retroOf(dev2)).data.cards.filter((c: any) => c.mine).map((c: any) => c.id).sort();
    assert.deepEqual(mine, [card.a, card.d].sort());
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/retros/${rid}`, { anonymous: false })).code, 'WORK_RETRO_ANON_ONEWAY');
    // Nhật ký kiểm toán không ghi việc viết thẻ.
    assert.equal(await prisma.workAuditLog.count({ where: { projectId: pid, action: { startsWith: 'retro.card' } } }), 0);
  });

  it('R3 dot vote có trần; chỉ tác giả sửa chữ; gom nhóm (cả nhóm sắp được)', async () => {
    for (const c of [card.a, card.a, card.b]) assert.equal((await call(dev, 'POST', `/projects/${pid}/retros/${rid}/cards/${c}/vote`, { delta: 1 })).status, 200);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/retros/${rid}/cards/${card.c}/vote`, { delta: 1 })).code, 'WORK_RETRO_NO_VOTES');
    const un = await call(dev, 'POST', `/projects/${pid}/retros/${rid}/cards/${card.a}/vote`, { delta: -1 });
    assert.equal(un.data.votesLeft, 1);
    await call(owner, 'POST', `/projects/${pid}/retros/${rid}/cards/${card.a}/vote`, { delta: 1 });
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/retros/${rid}/cards/${card.a}`, { body: 'edited' })).status, 403);
    assert.equal((await call(dev2, 'PATCH', `/projects/${pid}/retros/${rid}/cards/${card.a}`, { body: 'Stop merging without a review' })).status, 200);
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/retros/${rid}/cards/${card.b}`, { groupId: card.a })).status, 200);
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/retros/${rid}/cards/${card.c}`, { groupId: card.b })).code, 'WORK_RETRO_BAD_GROUP', 'một cấp');
    const d = (await retroOf(viewer)).data;
    const a = d.cards.find((c: any) => c.id === card.a);
    assert.equal(a.votes, 2);
    assert.equal(d.cards.find((c: any) => c.id === card.b).groupId, card.a);
    assert.equal(d.me.votesUsed, 0);
  });

  it('R4 tóm tắt AI: ghi chú gửi đi KHÔNG chứa tên người; lưu vào retro', async () => {
    const ai = await import('../services/work/ai.service.js');
    let sent = '';
    ai._setAskForTests(async (_s, user) => { sent = user; return JSON.stringify({ summary: '### What went well\n- Standups', actions: [{ type: 'create_issue', issueType: 'TASK', title: 'Require one review per PR' }] }); });
    const s = await call(dev, 'POST', `/projects/${pid}/retros/${rid}/summary`, {});
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.ok(sent.includes('Stop merging without a review'));
    assert.ok(sent.includes('(2 votes)') || sent.includes('(3 votes)'));
    for (const u of [dev, dev2, owner]) {
      const block = sent.slice(sent.indexOf('Team notes'));
      assert.ok(!block.includes(u.username), 'phần ghi chú không chứa tên người viết');
    }
    assert.equal(s.data.actions.length, 1);
    assert.ok((await retroOf(viewer)).data.summary.includes('Standups'));
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/retros/${rid}/summary`, {})).status, 403);
  });

  it('R5 khoá theo hạn ⇒ 423 khi viết/vote; vẫn tạo hành động ⇒ thẻ; xuất docx không lộ tác giả', async () => {
    await prisma.workRetro.update({ where: { id: rid }, data: { lockAt: new Date(Date.now() - 1000) } });
    const w = await call(dev, 'POST', `/projects/${pid}/retros/${rid}/cards`, { column: 'START', body: 'late' });
    assert.equal(w.status, 423);
    assert.equal(w.code, 'WORK_RETRO_LOCKED');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/retros/${rid}/cards/${card.c}/vote`, { delta: 1 })).status, 423);
    const act = await call(dev, 'POST', `/projects/${pid}/retros/${rid}/actions`, { title: 'Require one review per PR', cardId: card.a, assigneeId: dev2.id });
    assert.equal(act.status, 201, JSON.stringify(act.raw));
    const iss = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: act.data.issueNumber } });
    assert.equal(iss.title, 'Require one review per PR');
    assert.equal(iss.assigneeId, dev2.id);
    const d = (await retroOf(teacher)).data;
    assert.equal(d.locked, true);
    assert.equal(d.actions[0].issue.number, act.data.issueNumber);
    const x = await call(dev, 'GET', `/projects/${pid}/retros/${rid}/export.docx`);
    assert.equal(x.status, 200);
    const xml = new AdmZip(x.buf!).readAsText('word/document.xml');
    assert.ok(xml.includes('Stop merging without a review'));
    assert.ok(xml.includes('Action items'));
    assert.ok(!xml.includes(owner.username), 'tác giả thẻ (owner) không có trong bản xuất');
    // dev2 viết 2 thẻ nhưng chỉ được nhắc ĐÚNG MỘT lần — với tư cách người nhận hành động.
    assert.equal(xml.split(dev2.username).length - 1, 1);
  });

  it('R6 retro CÓ TÊN: tác giả hiện; người điều phối khoá tay', async () => {
    const r = await call(owner, 'POST', `/projects/${pid}/retros`, { title: 'Named retro', template: 'FOUR_L' });
    const id = r.data.id;
    await call(dev, 'POST', `/projects/${pid}/retros/${id}/cards`, { column: 'LIKED', body: 'Clear goals' });
    const d = (await call(viewer, 'GET', `/projects/${pid}/retros/${id}`)).data;
    assert.equal(d.cards[0].author.username, dev.username);
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/retros/${id}`, { locked: true })).status, 403, 'dev không phải người điều phối');
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/retros/${id}`, { locked: true })).status, 200);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/retros/${id}/cards`, { column: 'LIKED', body: 'x' })).status, 423);
  });

  // ═══ T: timer ═════════════════════════════════════════════════════

  it('T1 một timer mỗi người: start thẻ A; start thẻ B ⇒ 409; viewer/agent không dùng', async () => {
    const s = await call(dev, 'POST', `/projects/${pid}/issues/${num.c2}/timer`, {});
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    assert.equal(s.data.timer.issueKey, `SA-${num.c2}`);
    assert.ok(s.data.timer.activity, 'activity đoán sẵn theo thẻ');
    const again = await call(dev, 'POST', `/projects/${pid}/issues/${num.other}/timer`, {});
    assert.equal(again.status, 409);
    assert.equal(again.code, 'WORK_TIMER_RUNNING');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/issues/${num.c2}/timer`, {})).status, 403);
    assert.equal((await call(agent, 'POST', `/projects/${pid}/issues/${num.c2}/timer`, {})).status, 403);
    // Khoá duy nhất ở CSDL — hai tab bấm cùng lúc cũng không thể có hai timer.
    await assert.rejects(prisma.workTimer.create({ data: { userId: dev.id, projectId: pid, issueId: (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num.other } })).id, startedAt: new Date() } }));
    const me = await call(dev, 'GET', '/me/timer');
    assert.equal(me.data.timer.running, true);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/issues/${num.c2}/timer`)).data.onThisIssue, true);
  });

  it('T2 tạm dừng/tiếp tục; dừng ⇒ worklog (phút, activity) + time spent; timer biến mất', async () => {
    assert.equal((await call(dev, 'POST', '/me/timer/pause')).data.timer.running, false);
    await prisma.workTimer.update({ where: { userId: dev.id }, data: { accumulatedSec: 125 * 60 } });
    assert.equal((await call(dev, 'POST', '/me/timer/resume')).data.timer.running, true);
    assert.equal((await call(dev, 'PATCH', '/me/timer', { activity: 'Testing' })).status, 200);
    const iss0 = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num.c2 } });
    const st = await call(dev, 'POST', '/me/timer/stop', { note: 'Paired with dev2' });
    assert.equal(st.status, 200, JSON.stringify(st.raw));
    assert.equal(st.data.minutes, 125);
    const log = await prisma.workWorklog.findUniqueOrThrow({ where: { id: st.data.worklog.id } });
    assert.equal(log.minutes, 125);
    assert.equal(log.activity, 'Testing');
    assert.equal(log.userId, dev.id);
    assert.equal(log.note, 'Paired with dev2');
    const iss1 = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num.c2 } });
    assert.equal(iss1.timeSpentMin, iss0.timeSpentMin + 125);
    assert.equal((await call(dev, 'GET', '/me/timer')).data.timer, null);
    assert.equal((await call(dev, 'POST', '/me/timer/stop', {})).status, 404);
  });

  it('T3 đổi thẻ (switch) ghi giờ thẻ cũ; dưới 30 giây không ghi; bỏ (discard) không ghi', async () => {
    await call(dev, 'POST', `/projects/${pid}/issues/${num.c2}/timer`, { activity: 'Coding' });
    await prisma.workTimer.update({ where: { userId: dev.id }, data: { accumulatedSec: 600, runningSince: null } });
    const sw = await call(dev, 'POST', `/projects/${pid}/issues/${num.other}/timer`, { switch: true });
    assert.equal(sw.status, 201, JSON.stringify(sw.raw));
    assert.equal(sw.data.switched.minutes, 10);
    assert.equal(sw.data.timer.issueNumber, num.other);
    const st = await call(dev, 'POST', '/me/timer/stop', {});
    assert.equal(st.data.minutes, 0, 'vừa bấm ⇒ không ghi');
    assert.equal(st.data.worklog, null);
    await call(dev, 'POST', `/projects/${pid}/issues/${num.other}/timer`, {});
    assert.equal((await call(dev, 'POST', '/me/timer/discard')).status, 200);
    assert.equal(await prisma.workWorklog.count({ where: { userId: dev.id, issue: { number: num.other, projectId: pid } } }), 0);
  });

  it('T4 chạy quá lâu ⇒ overdue + MỘT thông báo chuông', async () => {
    await call(dev2, 'POST', `/projects/${pid}/issues/${num.c2}/timer`, {});
    await prisma.workTimer.update({ where: { userId: dev2.id }, data: { accumulatedSec: 5 * 3600, runningSince: null } });
    const a = await call(dev2, 'GET', '/me/timer');
    assert.equal(a.data.timer.overdue, true);
    await call(dev2, 'GET', '/me/timer');
    const n = await prisma.socialNotification.findMany({ where: { receiverId: dev2.id, type: 'WORK_ALERT' } });
    assert.equal(n.length, 1);
    const st = await call(dev2, 'POST', '/me/timer/stop', { minutes: 90 });
    assert.equal(st.data.minutes, 90, 'sửa số phút trước khi ghi (quên dừng)');
  });

  it('X xoá dự án ⇒ dây chuyền sạch (poker/retro/okr dự án/timer)', async () => {
    await call(dev, 'POST', `/projects/${pid}/issues/${num.c2}/timer`, {});
    await prisma.workProject.delete({ where: { id: pid } });
    assert.equal(await prisma.workPokerSession.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workRetro.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workObjective.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workTimer.count({ where: { userId: dev.id } }), 0);
  });
});
