/**
 * Cổng khách đợt S2b — API qua HTTP thật trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.portal.db.test.ts
 *
 * Trọng tâm là CÁCH LY: khách chỉ thấy thẻ/bình luận/tệp/trang đã chia sẻ ở mọi
 * đường đọc; khách dự án A không dò được gì của dự án B / dự án nội bộ / người
 * khác trong cùng không gian; thông báo + email không lộ ghi chú nội bộ. Rồi tới
 * luồng cổng: gửi yêu cầu, xem trước như khách, UAT từ chối ⇒ thẻ BUG/CR, duyệt
 * có điều kiện ⇒ biên bản. Email bị chặn (ghi lại để soi nội dung).
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
const tag = `pt${Date.now().toString(36)}`;
const userIds: number[] = [];
const requestIds: number[] = [];
const sent: Array<{ to: string; subject: string; html: string; text: string }> = [];
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

type U = { id: number; token: string; email: string };

describe('CT Work — cổng khách S2b (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, clientA: U, clientB: U, outsider: U;
  let wsId = 0, wsSlug = '';
  let aPid = 0, bPid = 0, intPid = 0, oldPid = 0;
  let cfgA: any;
  let i1 = 0, i2 = 0, i3 = 0, epic = 0, bIssue = 0, intIssue = 0;
  let attShared = 0, attInternal = 0, attB = 0;
  let pageClient = 0, pageInternal = 0;
  const SECRET = 'SECRET-INTERNAL-NOTE-42';

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

  const doc = (t: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }] });
  const mention = (uid: number, t: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'mention', attrs: { id: String(uid), label: 'client' } }, { type: 'text', text: ` ${t}` }] }] });
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  const nums = (r: any) => (r.data.items ?? r.data.issues ?? r.data).map((i: any) => i.number).sort((x: number, y: number) => x - y);

  before(async () => {
    (emailService as any).send = async (m: any) => { sent.push({ to: m.to, subject: m.subject, html: m.html ?? '', text: m.text ?? '' }); return { success: true }; };
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, clientA, clientB, outsider] = await Promise.all(['owner', 'staff', 'clienta', 'clientb', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (requestIds.length) await prisma.projectRequest.deleteMany({ where: { id: { in: requestIds } } });
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('dựng: không gian, 2 dự án khách (A, B), dự án nội bộ, dự án khách CŨ (cổng tắt); mời khách qua cổng', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `Portal ${tag}` });
    wsId = ws.data.id; wsSlug = ws.data.slug;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email], role: 'MEMBER' });
    const a = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'PA', name: 'Acme app', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(a.status, 201);
    assert.equal(a.data.modules.clientPortal, true, 'dự án CLIENT mới bật cổng khách mặc định');
    aPid = a.data.id;
    bPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'PB', name: 'Beta shop', template: 'COMPANY', kind: 'CLIENT' })).data.id;
    intPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'INT', name: 'Internal tools', template: 'BLANK', kind: 'SOFTWARE' })).data.id;
    const old = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLDC', name: 'Legacy client', template: 'COMPANY', kind: 'CLIENT', modules: { clientPortal: false } });
    oldPid = old.data.id;

    // Mời khách bằng email qua cổng — vai CLIENT, không gian GUEST.
    const inv = await call(owner, 'POST', `/projects/${aPid}/portal/invite`, { emails: [clientA.email] });
    assert.equal(inv.status, 201, JSON.stringify(inv.raw));
    assert.equal(inv.data[0].status, 'ADDED');
    const ws1 = await prisma.workMember.findFirstOrThrow({ where: { workspaceId: wsId, userId: clientA.id } });
    assert.equal(ws1.role, 'GUEST');
    const mail = sent.find((m) => m.to === clientA.email);
    assert.ok(mail && /client portal/i.test(mail.subject), 'thư mời khách nói về cổng khách');
    assert.match(mail!.html, new RegExp(`/work/${wsSlug}/PA/portal`));
    await call(owner, 'POST', `/projects/${bPid}/portal/invite`, { emails: [clientB.email] });
    await call(owner, 'PUT', `/projects/${oldPid}/members/${clientA.id}`, { role: 'CLIENT' });
    // Nhân viên không được mời khách (chỉ ADMIN dự án).
    assert.equal((await call(staff, 'POST', `/projects/${aPid}/portal/invite`, { emails: [outsider.email] })).status, 403);

    cfgA = (await call(owner, 'GET', `/projects/${aPid}`)).data;
    const mk = async (pid: number, cfg: any, title: string, extra: object = {}) =>
      (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title, ...extra })).data;
    const e = (await call(owner, 'POST', `/projects/${aPid}/issues`, { typeId: typeId(cfgA, 'EPIC'), title: 'Internal epic codename' })).data;
    epic = e.number;
    i1 = (await mk(aPid, cfgA, 'Login page', { parentId: e.id, storyPoints: 8 })).number;
    i2 = (await mk(aPid, cfgA, 'Checkout flow')).number;
    i3 = (await mk(aPid, cfgA, 'Refactor auth (internal)')).number;
    const cfgB = (await call(owner, 'GET', `/projects/${bPid}`)).data;
    bIssue = (await mk(bPid, cfgB, 'Beta secret roadmap')).number;
    const cfgI = (await call(owner, 'GET', `/projects/${intPid}`)).data;
    intIssue = (await mk(intPid, cfgI, 'Internal salary sheet')).number;
    await call(owner, 'POST', `/projects/${aPid}/issues/${i1}/links`, { type: 'RELATES', targetKey: `PA-${i3}` });
    await call(owner, 'POST', `/projects/${aPid}/issues/${i1}/links`, { type: 'RELATES', targetKey: `PA-${i2}` });

    // Chia sẻ 2 thẻ.
    for (const n of [i1, i2]) {
      const r = await call(staff, 'PUT', `/projects/${aPid}/issues/${n}/client-visible`, { visible: true });
      assert.equal(r.status, 200, JSON.stringify(r.raw));
    }
    // Dự án cũ (cổng tắt) ⇒ route chia sẻ 403 MODULE_DISABLED.
    const oldCfg = (await call(owner, 'GET', `/projects/${oldPid}`)).data;
    const oi = await mk(oldPid, oldCfg, 'Legacy issue');
    assert.equal((await call(owner, 'PUT', `/projects/${oldPid}/issues/${oi.number}/client-visible`, { visible: true })).code, 'MODULE_DISABLED');

    // Tệp (ghi thẳng DB — môi trường test không có R2).
    const id = async (pid: number, n: number) => (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n } })).id;
    const att = (issueId: number, name: string) => prisma.workAttachment.create({ data: { issueId, r2Key: `work/x/${name}`, fileName: name, mime: 'text/plain', size: 10, uploaderId: owner.id } });
    attShared = (await att(await id(aPid, i1), 'spec-for-client.pdf')).id;
    attInternal = (await att(await id(aPid, i1), 'internal-estimate.xlsx')).id;
    attB = (await att(await id(bPid, bIssue), 'beta-contract.pdf')).id;
    assert.equal((await call(staff, 'PATCH', `/projects/${aPid}/attachments/${attShared}/client`, { clientVisible: true })).status, 200);
    // Tệp trên thẻ chưa chia sẻ không chia sẻ được.
    const att3 = (await att(await id(aPid, i3), 'x.txt')).id;
    assert.equal((await call(staff, 'PATCH', `/projects/${aPid}/attachments/${att3}/client`, { clientVisible: true })).code, 'WORK_ISSUE_NOT_SHARED');

    // Trang: một CLIENT, một INTERNAL.
    pageClient = (await call(owner, 'POST', `/projects/${aPid}/pages`, { title: 'Project charter (client)', visibility: 'CLIENT' })).data.number;
    pageInternal = (await call(owner, 'POST', `/projects/${aPid}/pages`, { title: 'Internal pricing notes', visibility: 'INTERNAL' })).data.number;
  });

  it('bình luận: ghi chú nội bộ (mặc định) vs trả lời khách; PUBLIC chỉ trên thẻ đã chia sẻ', async () => {
    sent.length = 0;
    const note = await call(staff, 'POST', `/projects/${aPid}/issues/${i1}/comments`, { bodyJson: mention(clientA.id, `${SECRET} margin is thin`) });
    assert.equal(note.status, 201);
    assert.equal(note.data.visibility, 'INTERNAL');
    const reply = await call(staff, 'POST', `/projects/${aPid}/issues/${i1}/comments`, { bodyJson: doc('Hi! The login page is ready for review.'), visibility: 'PUBLIC' });
    assert.equal(reply.data.visibility, 'PUBLIC');
    const bad = await call(staff, 'POST', `/projects/${aPid}/issues/${i3}/comments`, { bodyJson: doc('x'), visibility: 'PUBLIC' });
    assert.equal(bad.code, 'WORK_ISSUE_NOT_SHARED');
    // Khách xin INTERNAL vẫn thành PUBLIC.
    const c = await call(clientA, 'POST', `/projects/${aPid}/issues/${i1}/comments`, { bodyJson: doc('Looks good, small typo on the button'), visibility: 'INTERNAL' });
    assert.equal(c.status, 201);
    assert.equal(c.data.visibility, 'PUBLIC');
    // Khách không bình luận được vào thẻ chưa chia sẻ (404 — không lộ là tồn tại).
    assert.equal((await call(clientA, 'POST', `/projects/${aPid}/issues/${i3}/comments`, { bodyJson: doc('x') })).status, 404);
    await wait(400);
  });

  it('thông báo + email: khách KHÔNG nhận gì từ ghi chú nội bộ (kể cả bị @nhắc); nhận email trả lời PUBLIC', async () => {
    const notes = await prisma.socialNotification.findMany({ where: { receiverId: clientA.id } });
    assert.ok(!notes.some((n) => JSON.stringify(n.payload).includes(SECRET)), 'chuông của khách không chứa ghi chú nội bộ');
    assert.ok(notes.some((n) => (n.payload as any)?.portal === true && String((n.payload as any).url).includes('/portal')), 'chuông dẫn vào cổng khách');
    const toClient = sent.filter((m) => m.to === clientA.email);
    assert.ok(toClient.length >= 1, 'khách nhận email trả lời');
    for (const m of toClient) {
      assert.ok(!m.html.includes(SECRET) && !m.text.includes(SECRET), 'email không lộ ghi chú nội bộ');
      assert.match(m.html, /Client portal/);
    }
    assert.ok(toClient.some((m) => /New reply on PA-/.test(m.subject)));
    // Đội vẫn nhận thông báo như cũ (người theo dõi = người tạo thẻ).
    assert.ok(!sent.some((m) => m.to === clientB.email), 'khách dự án khác không nhận gì');
  });

  it('CÁCH LY trong dự án: board / list / JQL / chi tiết / bình luận / tệp / trang chỉ phần đã chia sẻ', async () => {
    assert.deepEqual(nums(await call(clientA, 'GET', `/projects/${aPid}/issues`)), [i1, i2]);
    assert.deepEqual(nums(await call(clientA, 'GET', `/projects/${aPid}/board`)), [i1, i2]);
    assert.deepEqual(nums(await call(clientA, 'GET', `/projects/${aPid}/search?jql=${encodeURIComponent('order by created')}`)), [i1, i2]);
    assert.deepEqual(nums(await call(clientA, 'GET', `/projects/${aPid}/search?jql=${encodeURIComponent('text ~ "internal"')}`)), []);
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/search?jql=${encodeURIComponent('points > 1')}`)).code, 'WORK_JQL_ERROR');
    // Nhân viên vẫn thấy hết.
    assert.ok(nums(await call(staff, 'GET', `/projects/${aPid}/issues`)).includes(i3));

    const d = (await call(clientA, 'GET', `/projects/${aPid}/issues/${i1}`)).data;
    assert.deepEqual(d.links.map((l: any) => l.issue.number), [i2], 'liên kết tới thẻ nội bộ bị ẩn');
    assert.deepEqual(d.attachments.map((a: any) => a.id), [attShared]);
    assert.equal(d.storyPoints, null);
    assert.equal(d.timeSpentMin, null);
    assert.equal(d.commentCount, null, 'không lộ số bình luận gồm cả nội bộ');
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/issues/${i3}`)).status, 404);
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/issues/${epic}`)).status, 404);
    const cm = (await call(clientA, 'GET', `/projects/${aPid}/issues/${i1}/comments`)).data;
    assert.ok(cm.length === 2 && cm.every((c: any) => c.visibility === 'PUBLIC'));
    assert.ok(!JSON.stringify(cm).includes(SECRET));
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/issues/${i3}/comments`)).status, 404);
    // Tệp nội bộ / tệp dự án khác: 404 trước khi ký URL.
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/attachments/${attInternal}/url`)).status, 404);
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/attachments/${attB}/url`)).status, 404);
    // Trang: chỉ CLIENT; thẻ liên kết chỉ thẻ đã chia sẻ.
    const pages = (await call(clientA, 'GET', `/projects/${aPid}/pages`)).data.pages.map((p: any) => p.number);
    assert.deepEqual(pages, [pageClient]);
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/pages/${pageInternal}`)).status, 404);
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/issues/${i3}/pages`)).status, 404);
    // Cấu hình dự án rút gọn.
    const cfg = (await call(clientA, 'GET', `/projects/${aPid}`)).data;
    assert.equal(cfg.clientView, true);
    assert.deepEqual([cfg.sprints, cfg.customFields, cfg.components, cfg.settings], [[], [], [], {}]);
  });

  it('CÁCH LY trong dự án: báo cáo, worklog, lịch sử, xuất, AI, backlog, timeline… ⇒ 403 CLIENT_PORTAL_ONLY', async () => {
    const paths = [
      `/backlog`, `/reports/velocity`, `/reports/epics`, `/reports/contributions`, `/reports/time?from=2026-01-01&to=2026-12-31`, `/stats?groupBy=status`,
      `/dashboards`, `/filters`, `/issues/${i1}/history`, `/issues/${i1}/worklogs`, `/issues/${i1}/custom-values`, `/issues/${i1}/dev`,
      `/issues/${i1}/handoffs`, `/timeline`, `/capacity`, `/versions`, `/export?format=csv`, `/export/project-tracking`, `/sprints`, `/tests`,
      `/ai/threads`, `/insights`, `/stages`, `/handoffs`, `/studio`, `/share-links`, `/trash`, `/automation`, `/edit-lock`, `/pages/${pageClient}/versions`,
      `/pages/${pageClient}/comments`, `/issue-templates`,
    ];
    for (const p of paths) {
      const r = await call(clientA, 'GET', `/projects/${aPid}${p}`);
      assert.equal(r.code, 'CLIENT_PORTAL_ONLY', `${p} ⇒ ${r.status} ${r.code}`);
    }
    for (const [m, p, b] of [
      ['POST', '/issues', { typeId: typeId(cfgA, 'TASK'), title: 'x' }], ['PATCH', `/issues/${i1}`, { title: 'hacked' }],
      ['PUT', `/issues/${i3}/client-visible`, { visible: true }], ['POST', '/ai/chat', { message: 'hi' }], ['PUT', `/issues/${i1}/watch`, {}],
    ] as const) {
      assert.equal((await call(clientA, m, `/projects/${aPid}${p}`, b)).code, 'CLIENT_PORTAL_ONLY', `${m} ${p}`);
    }
    const i1Row = await prisma.workIssue.findFirstOrThrow({ where: { projectId: aPid, number: i3 } });
    assert.equal(i1Row.clientVisible, false);
  });

  it('CÁCH LY giữa khách: khách A dò dự án B / dự án nội bộ / người khác ⇒ không thấy gì', async () => {
    for (const pid of [bPid, intPid]) {
      for (const p of ['', '/issues', '/board', `/issues/1`, '/pages', '/approvals', '/portal/overview', '/portal/requests', '/portal/activity', `/search?jql=`]) {
        const r = await call(clientA, 'GET', `/projects/${pid}${p}`);
        assert.equal(r.status, 404, `pid ${pid}${p} ⇒ ${r.status}`);
      }
      assert.equal((await call(clientA, 'POST', `/projects/${pid}/portal/requests`, { kind: 'BUG', title: 'probe' })).status, 404);
    }
    assert.equal((await call(clientA, 'GET', `/projects/${bPid}/attachments/${attB}/url`)).status, 404);
    // Danh sách dự án / không gian.
    const ws = (await call(clientA, 'GET', `/workspaces/by-slug/${wsSlug}`)).data;
    assert.deepEqual(ws.projects.map((p: any) => p.key).sort(), ['OLDC', 'PA']);
    const paRow = ws.projects.find((p: any) => p.key === 'PA');
    assert.equal(paRow.openIssues, 2, 'chỉ đếm thẻ đã chia sẻ');
    const list = (await call(clientA, 'GET', '/workspaces')).data.find((w: any) => w.id === wsId);
    assert.equal(list.projectCount, 2);
    // Thành viên không gian: không thấy khách B.
    const members = (await call(clientA, 'GET', `/workspaces/${wsId}/members`)).data.map((m: any) => m.id);
    assert.ok(!members.includes(clientB.id), 'không thấy khách dự án khác');
    assert.ok(members.includes(staff.id) && members.includes(clientA.id));
    assert.ok(!JSON.stringify(members).includes('@'), 'không email');
    assert.equal(list.memberCount, members.length);
    const membersB = (await call(clientB, 'GET', `/workspaces/${wsId}/members?q=${tag}_clienta`)).data;
    assert.equal(membersB.length, 0, 'khách B tìm tên khách A ⇒ rỗng');
    // Bộ phận, ngày nghỉ, tìm kiếm xuyên dự án, My work, tài liệu.
    assert.equal((await call(clientA, 'GET', `/workspaces/${wsId}/teams`)).status, 403);
    await call(staff, 'POST', `/workspaces/${wsId}/time-off`, { startDate: '2026-12-01', endDate: '2026-12-03', note: 'staff leave' });
    assert.equal((await call(clientA, 'GET', `/workspaces/${wsId}/time-off`)).data.length, 0);
    const gs = (await call(clientA, 'GET', `/search?q=secret`)).data;
    assert.equal(JSON.stringify(gs).includes('Beta secret'), false);
    assert.equal(JSON.stringify(gs).includes('salary'), false);
    assert.equal((await call(clientA, 'GET', `/projects/${intPid}/issues/${intIssue}`)).status, 404);
    assert.equal((await call(clientA, 'GET', `/search?q=Refactor`)).data.items?.length ?? 0, 0);
    const docs = (await call(clientA, 'GET', `/search/docs?q=notes`)).data;
    assert.equal(docs.length, 0, 'trang nội bộ không ra trong tìm tài liệu');
    assert.equal((await call(clientA, 'GET', '/me/work')).data.items.length, 0);
    // Người ngoài: 404 mọi thứ.
    assert.equal((await call(outsider, 'GET', `/projects/${aPid}/portal/overview`)).status, 404);
  });

  it('dự án khách CŨ (cổng tắt): khách giữ hành vi cũ — thấy mọi thẻ; /portal ⇒ MODULE_DISABLED', async () => {
    const r = await call(clientA, 'GET', `/projects/${oldPid}/issues`);
    assert.equal(r.status, 200);
    assert.equal(r.data.items.length, 1);
    assert.equal((await call(owner, 'GET', `/projects/${oldPid}/portal/overview`)).code, 'MODULE_DISABLED');
  });

  it('cổng: Overview / Requests / Documents / Activity như khách; gửi yêu cầu ⇒ thẻ from-client vào hàng đợi', async () => {
    const st = await call(owner, 'POST', `/projects/${aPid}/stages`, { slug: 'discovery', name: 'Discovery' });
    assert.equal(st.status, 201, JSON.stringify(st.raw));
    await call(owner, 'POST', `/projects/${aPid}/stages/${st.data.id}/activate`, {});
    await call(owner, 'PATCH', `/projects/${aPid}/issues/${i1}`, { stageId: st.data.id });
    const ov = (await call(clientA, 'GET', `/projects/${aPid}/portal/overview`)).data;
    assert.equal(ov.viewer.clientView, true);
    assert.equal(ov.stages[0].name, 'Discovery');
    assert.equal(typeof ov.stages[0].percent, 'number');
    assert.equal(ov.counts.sharedOpen, 2);
    assert.equal(ov.project.description, null);

    const req = await call(clientA, 'POST', `/projects/${aPid}/portal/requests`, { kind: 'BUG', title: 'Button overlaps on mobile', description: 'On iPhone 13 the Pay button overlaps.' });
    assert.equal(req.status, 201, JSON.stringify(req.raw));
    const row = await prisma.workIssue.findFirstOrThrow({ where: { projectId: aPid, number: req.data.number }, select: { clientVisible: true, reporterId: true, teamId: true, type: { select: { key: true } }, labels: { select: { label: { select: { name: true } } } } } });
    assert.equal(row.clientVisible, true);
    assert.equal(row.reporterId, clientA.id);
    assert.equal(row.type.key, 'BUG');
    assert.ok(row.labels.some((l) => l.label.name === 'from-client'));
    const reqs = (await call(clientA, 'GET', `/projects/${aPid}/portal/requests`)).data.items.map((i: any) => i.number).sort((a: number, b: number) => a - b);
    assert.deepEqual(reqs, [i1, i2, req.data.number]);
    const det = (await call(clientA, 'GET', `/projects/${aPid}/portal/requests/${i1}`)).data;
    assert.ok(!JSON.stringify(det).includes(SECRET));
    assert.equal(det.parent.title, 'Internal epic codename', 'epic chứa thẻ: chỉ tên');
    assert.equal(det.parent.number, null, 'epic chưa chia sẻ ⇒ không có số để mở');
    assert.deepEqual(det.attachments.map((a: any) => a.id), [attShared]);
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/portal/requests/${i3}`)).status, 404);

    const docs = (await call(clientA, 'GET', `/projects/${aPid}/portal/documents`)).data;
    assert.deepEqual(docs.pages.map((p: any) => p.number), [pageClient]);
    assert.deepEqual(docs.files.map((f: any) => f.id), [attShared]);
    assert.equal((await call(clientA, 'GET', `/projects/${aPid}/portal/documents/${pageInternal}`)).status, 404);

    const act = (await call(clientA, 'GET', `/projects/${aPid}/portal/activity`)).data.items;
    const txt = JSON.stringify(act);
    assert.ok(!txt.includes(SECRET) && !txt.includes('Refactor auth') && !txt.includes('pricing notes'), 'activity không có sự kiện nội bộ');
    assert.ok(act.some((e: any) => e.kind === 'reply'));
    assert.ok(act.some((e: any) => e.kind === 'shared'));

    // Bàn giao (deliverable) ⇒ có ở Deliverables + email cho khách.
    sent.length = 0;
    assert.equal((await call(staff, 'PATCH', `/projects/${aPid}/attachments/${attShared}/client`, { deliverable: true })).status, 200);
    const dl = (await call(clientA, 'GET', `/projects/${aPid}/portal/deliverables`)).data;
    assert.deepEqual(dl.files.map((f: any) => f.id), [attShared]);
    await wait();
    assert.ok(sent.some((m) => m.to === clientA.email && /New deliverable/.test(m.subject)));
  });

  it('Preview as client: nhân viên thấy ĐÚNG như khách, chỉ đọc', async () => {
    for (const p of ['requests', 'documents', 'activity', 'approvals']) {
      const asC = (await call(clientA, 'GET', `/projects/${aPid}/portal/${p}`)).data;
      const pv = (await call(staff, 'GET', `/projects/${aPid}/portal/${p}?as=client`)).data;
      assert.equal(pv.viewer.preview, true, p);
      const strip = (x: any) => JSON.stringify({ ...x, viewer: null }).replace(/"mine":(true|false)/g, '');
      assert.equal(strip(pv), strip(asC), `${p}: xem trước khớp khách`);
    }
    const own = (await call(staff, 'GET', `/projects/${aPid}/portal/requests/${i1}?as=client`)).data;
    assert.ok(!JSON.stringify(own).includes(SECRET));
    assert.equal((await call(staff, 'POST', `/projects/${aPid}/portal/requests?as=client`, { kind: 'BUG', title: 'x' })).code, 'WORK_PREVIEW_READONLY');
  });

  it('UAT: khách từ chối có lý do ⇒ thẻ BUG/CR; lần 2 duyệt có điều kiện ⇒ biên bản có chữ ký', async () => {
    assert.equal((await call(staff, 'POST', `/projects/${aPid}/portal/uat`, { issueNumbers: [i1, i3], approverIds: [clientA.id] })).code, 'WORK_ISSUE_NOT_SHARED');
    assert.equal((await call(staff, 'POST', `/projects/${aPid}/portal/uat`, { issueNumbers: [i1], approverIds: [staff.id] })).code, 'WORK_UAT_NO_CLIENT');
    assert.equal((await call(clientA, 'POST', `/projects/${aPid}/portal/uat`, { issueNumbers: [i1], approverIds: [clientA.id] })).status, 403);
    sent.length = 0;
    const u1 = await call(staff, 'POST', `/projects/${aPid}/portal/uat`, { issueNumbers: [i1, i2], pageNumbers: [pageClient], attachmentIds: [attShared], approverIds: [clientA.id], environment: 'Staging', build: '1.0.0-rc1' });
    assert.equal(u1.status, 201, JSON.stringify(u1.raw));
    assert.equal(u1.data.uat.round, 1);
    await wait();
    assert.ok(sent.some((m) => m.to === clientA.email && /UAT sign-off requested/.test(m.subject)), 'email mời nghiệm thu');
    const ov = (await call(clientA, 'GET', `/projects/${aPid}/portal/overview`)).data;
    assert.ok(ov.waitingOnClient.some((w: any) => w.id === u1.data.id && w.kind === 'UAT'));
    // Không duyệt UAT qua đường phê duyệt chung.
    assert.equal((await call(clientA, 'POST', `/projects/${aPid}/approvals/${u1.data.id}/decide`, { decision: 'APPROVE' })).code, 'WORK_USE_UAT_FORM');
    assert.equal((await call(clientA, 'POST', `/projects/${aPid}/portal/uat/${u1.data.id}/decide`, { decision: 'REJECT' })).code, 'WORK_REJECT_REASON');
    const rj = await call(clientA, 'POST', `/projects/${aPid}/portal/uat/${u1.data.id}/decide`, {
      decision: 'REJECT', comment: 'Two problems found',
      points: [{ title: 'Login error message is unclear', kind: 'BUG' }, { title: 'Add remember-me option', kind: 'CHANGE', detail: 'Keep users signed in 30 days' }],
    });
    assert.equal(rj.status, 200, JSON.stringify(rj.raw));
    assert.equal(rj.data.status, 'REJECTED');
    assert.equal(rj.data.uat.createdIssues.length, 2);
    const created = await prisma.workIssue.findMany({ where: { projectId: aPid, number: { in: rj.data.uat.createdIssues.map((i: any) => i.number) } }, select: { clientVisible: true, type: { select: { key: true } } } });
    assert.deepEqual(created.map((c) => c.type.key).sort(), ['BUG', 'STORY']);
    assert.ok(created.every((c) => c.clientVisible));

    const u2 = await call(staff, 'POST', `/projects/${aPid}/portal/uat`, { issueNumbers: [i1, i2], approverIds: [clientA.id] });
    assert.equal(u2.data.uat.round, 2);
    const ok = await call(clientA, 'POST', `/projects/${aPid}/portal/uat/${u2.data.id}/decide`, { decision: 'APPROVE', comment: 'Accepted', conditions: 'Fix the typo before go-live' });
    assert.equal(ok.data.status, 'APPROVED');
    const cert = (await call(clientA, 'GET', `/projects/${aPid}/portal/uat/${u2.data.id}/certificate`)).data;
    assert.equal(cert.conclusion, 'ACCEPTED_WITH_CONDITIONS');
    assert.equal(cert.round, 2);
    assert.equal(cert.signatures.length, 1);
    assert.match(cert.signatures[0].signature, /^[0-9a-f]{64}$/);
    assert.equal(cert.signatures[0].side, 'CLIENT');
    assert.equal(cert.contentChanged, false);
    // Nhân viên in được cùng biên bản; khách B không.
    assert.equal((await call(owner, 'GET', `/projects/${aPid}/portal/uat/${u2.data.id}/certificate`)).status, 200);
    assert.equal((await call(clientB, 'GET', `/projects/${aPid}/portal/uat/${u2.data.id}/certificate`)).status, 404);
  });

  it('link công khai + trang tra cứu phiếu: chỉ thẻ đã chia sẻ; khách có tài khoản ⇒ link cổng khách', async () => {
    const link = await call(owner, 'POST', `/projects/${aPid}/share-links`, { label: 'pub' });
    const token = link.data.url.split('/').pop();
    const pub = (await call(null, 'GET', `/share/${token}/issues?section=backlog`)).data.map((i: any) => i.number);
    assert.ok(!pub.includes(i3), 'link công khai không lộ thẻ nội bộ');
    assert.ok(pub.includes(i2));
    assert.equal((await call(null, 'GET', `/share/${token}/issues/${i3}`)).status, 404);

    const { lookupProjectRequest } = await import('../services/projectRequest.service.js');
    const code = `YC-2099-${String(Date.now()).slice(-6)}`;
    const r = await prisma.projectRequest.create({ data: { code, name: 'A', email: clientA.email, productTypes: ['WEB'], needs: 'x', status: 'PROJECT_CREATED', workProjectId: aPid, isRoleplay: true } });
    requestIds.push(r.id);
    const v = await lookupProjectRequest(code, clientA.email);
    assert.match(v!.progressUrl ?? '', new RegExp(`/work/${wsSlug}/PA/portal$`));
    await prisma.projectRequest.update({ where: { id: r.id }, data: { email: `${tag}_noaccount@test.local` } });
    const v2 = await lookupProjectRequest(code, `${tag}_noaccount@test.local`);
    assert.ok(!(v2!.progressUrl ?? '').includes('/portal'), 'chưa có tài khoản ⇒ không trỏ cổng');
  });

  // ─── Vá rủi ro lộ dữ liệu sau S2b (04/10/2026) ─────────────────────

  it('phê duyệt: KHÔNG nêu khách duyệt thẻ chưa chia sẻ / trang nội bộ ⇒ 400 WORK_APPROVER_NOT_CLIENT_VISIBLE', async () => {
    const r1 = await call(staff, 'POST', `/projects/${aPid}/approvals`, { targetType: 'ISSUE', issueNumber: i3, approverIds: [clientA.id] });
    assert.equal(r1.status, 400);
    assert.equal(r1.code, 'WORK_APPROVER_NOT_CLIENT_VISIBLE');
    const r2 = await call(staff, 'POST', `/projects/${aPid}/approvals`, { targetType: 'DOC', pageNumber: pageInternal, approverIds: [clientA.id] });
    assert.equal(r2.code, 'WORK_APPROVER_NOT_CLIENT_VISIBLE');
    // Không có yêu cầu nào được tạo; người duyệt là nhân viên thì vẫn được.
    assert.equal(await prisma.workApproval.count({ where: { projectId: aPid, issue: { number: i3 } } }), 0);
    const r3 = await call(staff, 'POST', `/projects/${aPid}/approvals`, { targetType: 'ISSUE', issueNumber: i3, approverIds: [owner.id] });
    assert.equal(r3.status, 201, JSON.stringify(r3.raw));
    await call(owner, 'POST', `/projects/${aPid}/approvals/${r3.data.id}/cancel`, {});
  });

  it('phê duyệt: thẻ bị BỎ chia sẻ sau khi gửi duyệt ⇒ khách thấy "Item no longer shared", không duyệt được; cổng giai đoạn chỉ tên', async () => {
    const ap = await call(staff, 'POST', `/projects/${aPid}/approvals`, { targetType: 'ISSUE', issueNumber: i2, approverIds: [clientA.id], description: 'Internal: client pays extra for this' });
    assert.equal(ap.status, 201, JSON.stringify(ap.raw));
    assert.match(ap.data.title, /Checkout flow/);
    assert.equal((await call(staff, 'PUT', `/projects/${aPid}/issues/${i2}/client-visible`, { visible: false })).status, 200);
    try {
      for (const path of [`/projects/${aPid}/approvals/${ap.data.id}`, `/projects/${aPid}/portal/approvals/${ap.data.id}`]) {
        const v = (await call(clientA, 'GET', path)).data;
        assert.equal(v.title, 'Item no longer shared', path);
        assert.equal(v.issue, null, path);
        assert.equal(v.description, null, path);
        assert.equal(v.canDecide, false, path);
        const txt = JSON.stringify(v);
        assert.ok(!txt.includes('Checkout flow') && !txt.includes(`PA-${i2}`) && !txt.includes('client pays extra'), `${path} không lộ mã/tiêu đề/mô tả`);
      }
      for (const path of [`/projects/${aPid}/approvals`, `/projects/${aPid}/portal/approvals`, `/projects/${aPid}/portal/overview`]) {
        assert.ok(!JSON.stringify((await call(clientA, 'GET', path)).data).includes('Checkout flow'), path);
      }
      assert.equal((await call(clientA, 'POST', `/projects/${aPid}/approvals/${ap.data.id}/decide`, { decision: 'APPROVE' })).code, 'WORK_ITEM_NOT_SHARED');
      // Nhân viên vẫn thấy đủ.
      assert.match((await call(staff, 'GET', `/projects/${aPid}/approvals/${ap.data.id}`)).data.title, /Checkout flow/);
    } finally {
      await call(staff, 'PUT', `/projects/${aPid}/issues/${i2}/client-visible`, { visible: true });
      await call(staff, 'POST', `/projects/${aPid}/approvals/${ap.data.id}/cancel`, {});
    }

    // Cổng giai đoạn có khách đứng tên duyệt: khách chỉ thấy TÊN giai đoạn — ghi chú gửi duyệt không lộ.
    const studio = await call(owner, 'PUT', `/projects/${aPid}/studio`, { stageGate: { approverIds: [clientA.id] } });
    assert.equal(studio.status, 200, JSON.stringify(studio.raw));
    const stage = (await prisma.workStage.findFirstOrThrow({ where: { projectId: aPid, status: 'ACTIVE' } }));
    const g = await call(staff, 'POST', `/projects/${aPid}/stages/${stage.id}/request-gate`, { description: 'GATE-NOTE: margin below target' });
    assert.equal(g.status, 201, JSON.stringify(g.raw));
    const gid = g.data.approval.id;
    for (const path of [`/projects/${aPid}/approvals/${gid}`, `/projects/${aPid}/portal/approvals/${gid}`]) {
      const v = (await call(clientA, 'GET', path)).data;
      assert.equal(v.title, `Stage gate: ${stage.n}. ${stage.name}`, path);
      assert.equal(v.description, null, path);
      assert.ok(!JSON.stringify(v).includes('GATE-NOTE'), path);
    }
    assert.match((await call(staff, 'GET', `/projects/${aPid}/approvals/${gid}`)).data.description, /GATE-NOTE/);
    await call(staff, 'POST', `/projects/${aPid}/approvals/${gid}/cancel`, {});
    await call(owner, 'PUT', `/projects/${aPid}/studio`, { stageGate: null });
  });

  let quiet: U, clientC: U;
  let quietIssue = 0;
  it('người cho khách: chỉ mình + khách cùng dự án + lead + người có tương tác công khai — không liệt kê cả đội, không email', async () => {
    quiet = await mkUser('quiet');
    clientC = await mkUser('clientc');
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [quiet.email], role: 'MEMBER' });
    assert.equal((await call(owner, 'POST', `/projects/${aPid}/portal/invite`, { emails: [clientC.email] })).status, 201);
    // Nhân viên "im lặng": vào ngầm dự án A (mở cho cả không gian), chưa từng trả lời khách.
    const cfgStaff = (await call(staff, 'GET', `/projects/${aPid}`)).data;
    assert.ok(cfgStaff.members.some((m: any) => m.id === quiet.id), 'nhân viên thấy đủ thành viên');

    const ids = async (path: string) => (await call(clientC, 'GET', path)).data;
    const wsMembers = (await ids(`/workspaces/${wsId}/members`)).map((m: any) => m.id);
    const cfg = await ids(`/projects/${aPid}`);
    const cfgIds = cfg.members.map((m: any) => m.id);
    for (const list of [wsMembers, cfgIds]) {
      assert.ok(list.includes(clientC.id), 'chính mình');
      assert.ok(list.includes(owner.id), 'lead dự án');
      assert.ok(list.includes(staff.id), 'người đã trả lời PUBLIC');
      assert.ok(list.includes(clientA.id), 'khách cùng dự án');
      assert.ok(!list.includes(quiet.id), 'nhân viên chưa tương tác công khai ⇒ ẩn');
      assert.ok(!list.includes(clientB.id), 'khách dự án khác ⇒ ẩn');
    }
    assert.ok(!JSON.stringify(cfg.members).includes('@') && !JSON.stringify(wsMembers).includes('@'), 'không email');
    const wsRow = (await ids('/workspaces')).find((w: any) => w.id === wsId);
    assert.equal(wsRow.memberCount, wsMembers.length);
    assert.equal((await call(clientC, 'GET', `/workspaces/${wsId}/members?q=${tag}_quiet`)).data.length, 0, 'gợi ý @nhắc không ra người ẩn');

    // Thẻ do người "im lặng" tạo + chia sẻ + tải tệp: khách thấy "Project team", không thấy tên.
    const created = await call(quiet, 'POST', `/projects/${aPid}/issues`, { typeId: typeId(cfgA, 'TASK'), title: 'Quiet shared task' });
    quietIssue = created.data.number;
    assert.equal((await call(quiet, 'PUT', `/projects/${aPid}/issues/${quietIssue}/client-visible`, { visible: true })).status, 200);
    const qRow = await prisma.workIssue.findFirstOrThrow({ where: { projectId: aPid, number: quietIssue } });
    await prisma.workAttachment.create({ data: { issueId: qRow.id, r2Key: 'work/x/q.txt', fileName: 'quiet.txt', mime: 'text/plain', size: 1, uploaderId: quiet.id, clientVisible: true } });
    const pub = await call(staff, 'POST', `/projects/${aPid}/issues/${quietIssue}/comments`, { bodyJson: doc('Started on this'), visibility: 'PUBLIC' });
    await call(quiet, 'PUT', `/projects/${aPid}/issues/${quietIssue}/comments/${pub.data.id}/reactions/${encodeURIComponent('👍')}`, { active: true });
    const qName = `${tag}_quiet`;
    for (const path of [
      `/projects/${aPid}/issues/${quietIssue}`, `/projects/${aPid}/issues/${quietIssue}/comments`, `/projects/${aPid}/portal/requests/${quietIssue}`,
      `/projects/${aPid}/portal/documents`, `/projects/${aPid}/portal/activity`, `/projects/${aPid}`, `/workspaces/${wsId}/members`,
    ]) {
      const r = await call(clientC, 'GET', path);
      assert.equal(r.status, 200, path);
      assert.ok(!JSON.stringify(r.data).includes(qName), `${path} không lộ tên nhân viên ẩn`);
    }
    const det = await ids(`/projects/${aPid}/issues/${quietIssue}`);
    assert.equal(det.reporter.id, 0);
    assert.equal(det.reporter.displayName, 'Project team');
    assert.equal(det.attachments[0].uploader.id, 0);
    const reacts = (await ids(`/projects/${aPid}/issues/${quietIssue}/comments`))[0].reactions[0];
    assert.equal(reacts.count, 1);
    assert.equal(reacts.users[0].id, 0, 'người thả cảm xúc bị ẩn tên');
    const act = (await ids(`/projects/${aPid}/portal/activity`)).items.find((e: any) => e.kind === 'created' && e.issueNumber === quietIssue);
    assert.equal(act.actor, 'The team');
    // JQL: không dò ra người ẩn bằng tên.
    assert.equal((await call(clientC, 'GET', `/projects/${aPid}/search?jql=${encodeURIComponent(`reporter = ${qName}`)}`)).code, 'WORK_JQL_ERROR');
    // Nhân viên vẫn thấy tên thật.
    assert.equal((await call(staff, 'GET', `/projects/${aPid}/issues/${quietIssue}`)).data.reporter.id, quiet.id);

    // Giao thẻ ĐÃ chia sẻ cho người đó ⇒ giờ là người có tương tác công khai ⇒ hiện.
    assert.equal((await call(owner, 'PATCH', `/projects/${aPid}/issues/${quietIssue}`, { assigneeId: quiet.id })).status, 200);
    assert.ok((await ids(`/projects/${aPid}`)).members.some((m: any) => m.id === quiet.id));
    assert.equal((await ids(`/projects/${aPid}/issues/${quietIssue}`)).reporter.id, quiet.id);
    assert.equal((await call(owner, 'PATCH', `/projects/${aPid}/issues/${quietIssue}`, { assigneeId: null })).status, 200);
  });

  it('khách cũ là MEMBER không gian nhưng vai CLIENT ở dự án cổng ⇒ phạm vi như GUEST ở MỌI đường cấp không gian', async () => {
    const mc = await mkUser('memberclient');
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [mc.email], role: 'MEMBER' });
    assert.equal((await call(owner, 'PUT', `/projects/${aPid}/members/${mc.id}`, { role: 'CLIENT' })).status, 200);
    assert.equal((await prisma.workMember.findFirstOrThrow({ where: { workspaceId: wsId, userId: mc.id } })).role, 'MEMBER', 'vai lưu trong DB không đổi');

    const row = (await call(mc, 'GET', '/workspaces')).data.find((w: any) => w.id === wsId);
    assert.equal(row.role, 'GUEST', 'vai hiệu lực bị hạ');
    assert.equal(row.projectCount, 1);
    assert.deepEqual((await call(mc, 'GET', `/workspaces/by-slug/${wsSlug}`)).data.projects.map((p: any) => p.key), ['PA']);
    // Mất quyền vào ngầm dự án mở cho không gian.
    for (const p of [`/projects/${intPid}`, `/projects/${intPid}/issues/${intIssue}`, `/projects/${bPid}/issues`]) {
      assert.equal((await call(mc, 'GET', p)).status, 404, p);
    }
    // Trong A: cách ly như khách.
    assert.ok(!nums(await call(mc, 'GET', `/projects/${aPid}/issues`)).includes(i3));
    assert.equal((await call(mc, 'GET', `/projects/${aPid}/backlog`)).code, 'CLIENT_PORTAL_ONLY');
    // Cấp không gian: thành viên, bộ phận, tìm kiếm, My work, ngày nghỉ, portfolio, workload, tạo dự án.
    const mem = (await call(mc, 'GET', `/workspaces/${wsId}/members`)).data.map((m: any) => m.id);
    assert.ok(!mem.includes(quiet.id) && !mem.includes(clientB.id) && mem.includes(mc.id));
    assert.equal((await call(mc, 'GET', `/workspaces/${wsId}/teams`)).status, 403);
    assert.equal(JSON.stringify((await call(mc, 'GET', '/search?q=salary')).data).includes('salary'), false);
    assert.equal((await call(mc, 'GET', `/search?q=Refactor`)).data.items?.length ?? 0, 0);
    assert.equal((await call(mc, 'GET', '/me/work')).data.items.length, 0);
    assert.equal((await call(mc, 'GET', `/workspaces/${wsId}/time-off`)).data.length, 0);
    const pf = (await call(mc, 'GET', `/workspaces/${wsId}/portfolio`)).data;
    assert.deepEqual(pf.projects, []);
    assert.equal(pf.canSeeWorkload, false);
    const wl = (await call(mc, 'GET', `/workspaces/${wsId}/workload`)).data;
    assert.deepEqual(wl.people.map((p: any) => p.user.id), [mc.id]);
    assert.deepEqual(wl.projectOptions, [], 'không dự án nào để chọn (A là dự án khách, INT không còn vào ngầm)');
    // Workload của quản trị không coi người này là nhân lực của đội.
    assert.ok(!(await call(owner, 'GET', `/workspaces/${wsId}/workload`)).data.people.some((p: any) => p.user.id === mc.id));
    assert.equal((await call(mc, 'GET', `/workspaces/${wsId}/workload?projectId=${intPid}`)).status, 400);
    assert.equal((await call(mc, 'POST', `/workspaces/${wsId}/projects`, { key: 'MCX', name: 'x' })).status, 403);
    // Nhân viên không thấy người này như "thành viên ngầm" của dự án nội bộ, không xếp được vào bộ phận.
    assert.ok(!(await call(owner, 'GET', `/projects/${intPid}`)).data.members.some((m: any) => m.id === mc.id));
    assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'MCT', name: 'MC team', memberIds: [mc.id] })).code, 'WORK_BAD_TEAM_MEMBER');
  });

  it('vừa khách (A) vừa nhân viên (dự án nội bộ): là nhân viên của không gian, nhưng A bị loại khỏi mọi đường xuyên dự án', async () => {
    const mx = await mkUser('mixed');
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [mx.email], role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${aPid}/members/${mx.id}`, { role: 'CLIENT' });
    assert.equal((await call(owner, 'PUT', `/projects/${intPid}/members/${mx.id}`, { role: 'MEMBER' })).status, 200);
    const row = (await call(mx, 'GET', '/workspaces')).data.find((w: any) => w.id === wsId);
    assert.equal(row.role, 'MEMBER');
    assert.equal((await call(mx, 'GET', `/projects/${intPid}/issues/${intIssue}`)).status, 200);
    // Trong A vẫn bị cách ly.
    assert.ok(!nums(await call(mx, 'GET', `/projects/${aPid}/issues`)).includes(i3));
    // Xuyên dự án: không có gì của A.
    assert.equal((await call(mx, 'GET', `/search?q=Refactor`)).data.items?.length ?? 0, 0);
    const pf = (await call(mx, 'GET', `/workspaces/${wsId}/portfolio`)).data.projects.map((p: any) => p.key);
    assert.ok(!pf.includes('PA') && pf.includes('INT'), JSON.stringify(pf));
    assert.equal((await call(mx, 'GET', `/workspaces/${wsId}/workload?projectId=${aPid}`)).status, 400);
    await prisma.workIssue.updateMany({ where: { projectId: aPid, number: i3 }, data: { assigneeId: mx.id } });
    try {
      assert.equal((await call(mx, 'GET', '/me/work')).data.items.some((i: any) => i.project?.key === 'PA'), false, 'My work không kéo thẻ nội bộ của A');
    } finally {
      await prisma.workIssue.updateMany({ where: { projectId: aPid, number: i3 }, data: { assigneeId: null } });
    }
  });

  it('portfolio + workload với khách cổng GUEST: không dự án/người ngoài phạm vi; lọc bộ phận ⇒ chặn', async () => {
    const pf = (await call(clientC, 'GET', `/workspaces/${wsId}/portfolio`)).data;
    assert.deepEqual(pf.projects, []);
    assert.equal(pf.canSeeWorkload, false);
    const wl = await call(clientC, 'GET', `/workspaces/${wsId}/workload`);
    assert.equal(wl.status, 200);
    assert.deepEqual(wl.data.people.map((p: any) => p.user.id), [clientC.id]);
    assert.deepEqual(wl.data.projectOptions, []);
    assert.deepEqual(wl.data.teamOptions, []);
    assert.ok(!JSON.stringify(wl.data).includes(`${tag}_quiet`) && !JSON.stringify(wl.data).includes(`${tag}_staff`), 'không ai khác ngoài mình');
    assert.equal((await call(clientC, 'GET', `/workspaces/${wsId}/workload?projectId=${aPid}`)).status, 400);
    const team = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'QAX', name: 'QA', memberIds: [staff.id] });
    assert.equal(team.status, 201, JSON.stringify(team.raw));
    assert.equal((await call(clientC, 'GET', `/workspaces/${wsId}/workload?teamId=${team.data.id}`)).status, 400);
    // Khách A có dự án khách CŨ (cổng tắt) ⇒ portfolio chỉ có dự án đó (hành vi cũ), không có PA.
    const pa = (await call(clientA, 'GET', `/workspaces/${wsId}/portfolio`)).data.projects.map((p: any) => p.key);
    assert.deepEqual(pa, ['OLDC']);
  });

  it('URL tải tệp: khách nhận URL ký sẵn hạn 120s, nhân viên 600s', async () => {
    const c = await call(clientA, 'GET', `/projects/${aPid}/attachments/${attShared}/url`);
    const st = await call(staff, 'GET', `/projects/${aPid}/attachments/${attShared}/url`);
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    assert.equal(st.status, 200, JSON.stringify(st.raw));
    assert.match(c.data.url, /X-Amz-Expires=120\b/);
    assert.match(st.data.url, /X-Amz-Expires=600\b/);
  });
});
