/**
 * CT Work đợt 6b — SRS chuyên sâu (SWR-3) + elicitation & stakeholder (SWR-4) qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw6b.db.test.ts
 * (kho ảnh GIẢ qua `_setImageStoreForTests` — không chạm R2; model AI GIẢ qua `_setElicitationAskForTests`.)
 *
 *   1. Sổ stakeholder: tạo/sửa/trùng/xoá, lưới, nhắc; quyền (viewer đọc, người ngoài 404, agent không xoá); tạo từ actor.
 *   2. RACI: hoạt động mặc định, A duy nhất, vấn đề; agent không đổi.
 *   3. Phiên elicitation: câu hỏi gợi ý, người tham gia, câu trả lời; nối họp K-2 (loại Elicitation); AI đề xuất có bằng chứng
 *      (bịa ⇒ bỏ) ⇒ người nhận ⇒ thẻ REQUIREMENT có nguồn + truy vết; agent không nhận; bỏ đề xuất; nguồn tay.
 *   4. Khảo sát: nháp ⇒ link công khai 404; mở (agent 403) ⇒ form công khai ⇒ trả lời đúng/sai ⇒ đóng ⇒ 410; xlsx đọc lại.
 *   5. Báo cáo elicitation .docx (đọc lại đề mục + bảng) + .pdf.
 *   6. Mô hình: thiếu nguồn ⇒ 422 song ngữ; context/DFD1/state/feature tree/activity ⇒ sơ đồ đề xuất trong Diagram Studio;
 *      dựng lại ⇒ phiên bản mới; duyệt ⇒ vào SRS (2.1 + Phụ lục B); event–response .xlsx.
 *   7. Prototype: ảnh + link Figma; gửi xác nhận; MEMBER không duyệt, giảng viên duyệt; link khách (ảnh + quyết định một lần);
 *      đổi thiết kế ⇒ về nháp, link cũ chết.
 *   8. Checklist chất lượng: chấm tự động, người chấm, AI gợi ý sửa; xlsx.  9. NFR: mẫu ⇒ thẻ + thước đo; sai loại 400.
 *  10. SRS Wiegers .docx có mô hình + NFR + stakeholder; V&S có Stakeholder Profiles.  11. Registry (Ask AI + MCP).
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { readXlsx } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c6b${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt 6b: SRS chuyên sâu + elicitation & stakeholder (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, teacher: U, viewer: U, outsider: U, bot: U;
  let wsId = 0, pid = 0;
  const store = new Map<string, Buffer>();

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function download(u: U | null, path: string, method = 'GET', body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, headers: { ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, type: res.headers.get('content-type'), disposition: res.headers.get('content-disposition'), buf: Buffer.from(await res.arrayBuffer()) };
  }
  const docxParas = (buf: Buffer) => [...new AdmZip(buf).readAsText('word/document.xml').matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => [(/<w:pStyle w:val="([^"]+)"/.exec(m[0])?.[1] ?? ''), [...m[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((x) => x[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')).join('')] as [string, string]);
  const docxText = (buf: Buffer) => docxParas(buf).map((p) => p[1]).join('\n');

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    (await import('../services/work/docs3a.service.js'))._setImageStoreForTests({
      put: async (key, body) => { store.set(key, Buffer.from(body)); },
      read: async (key) => { const b = store.get(key); if (!b) throw new Error('missing'); return b; },
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, teacher, viewer, outsider] = await Promise.all(['owner', 'staff', 'teacher', 'viewer', 'outsider'].map((n) => mkUser(n)));
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW6b ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, teacher.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OMFS', name: 'Order Fulfillment', template: 'SWR302' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const [u, role] of [[staff, 'MEMBER'], [teacher, 'TEACHER'], [viewer, 'VIEWER']] as const) {
      assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role })).status, 200);
    }
    bot = await mkUser('bot', 'AGENT');
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: bot.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: bot.id, role: 'MEMBER' } });
  });

  after(async () => {
    (await import('../services/work/swrElic.service.js'))._setElicitationAskForTests(null);
    (await import('../services/work/docs3a.service.js'))._setImageStoreForTests(null);
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  let actorCustomer = 0, actorManager = 0, actorBank = 0;

  it('1. sổ stakeholder: CRUD, lưới, nhắc, quyền, tạo từ actor', async () => {
    const base0 = `/projects/${pid}/swr/stakeholders`;
    const a = await call(staff, 'POST', base0, { name: 'Lan', role: 'Fulfillment Manager', organization: 'Contoso', userClass: 'Warehouse staff', influence: 5, interest: 5, isChampion: true, decisionRights: 'Signs off the requirements baseline', majorValue: 'Fewer lost orders', interests: 'Pick accuracy', constraints: 'No new scanners this year', userId: staff.id });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal(a.data.key, 'SH-1');
    assert.equal((await call(staff, 'POST', base0, { name: 'lan', role: 'Fulfillment Manager' })).status, 409);
    const b = await call(staff, 'POST', base0, { name: 'Finance director', kind: 'PERSON', influence: 5, interest: 2, attitude: 'CRITIC' });
    assert.equal(b.data.key, 'SH-2');
    assert.equal((await call(viewer, 'POST', base0, { name: 'X' })).status, 403);
    assert.equal((await call(outsider, 'GET', base0)).status, 404);
    assert.equal((await call(staff, 'POST', base0, { name: 'Bad', userId: outsider.id })).status, 400);
    const l = await call(viewer, 'GET', base0);
    assert.equal(l.status, 200);
    assert.deepEqual(l.data.grid.MANAGE_CLOSELY, ['SH-1']);
    assert.deepEqual(l.data.grid.KEEP_SATISFIED, ['SH-2']);
    assert.ok(l.data.warnings.some((w: any) => w.code === 'POWERFUL_CRITIC'));
    const up = await call(staff, 'PATCH', `${base0}/SH-2`, { interest: 4, attitude: 'NEUTRAL', rev: 0 });
    assert.equal(up.status, 200, JSON.stringify(up.raw));
    assert.equal((await call(staff, 'PATCH', `${base0}/2`, { interest: 3, rev: 0 })).status, 409);
    // actor ⇒ stakeholder
    actorCustomer = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Customer' })).data.id;
    actorManager = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Warehouse Manager' })).data.id;
    actorBank = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Payment Gateway', kind: 'SYSTEM' })).data.id;
    const seeded = await call(staff, 'POST', `${base0}/seed-actors`);
    assert.equal(seeded.data.added, 2);
    assert.equal((await call(staff, 'POST', `${base0}/seed-actors`)).data.added, 0);
    const bd = await call(bot, 'DELETE', `${base0}/SH-4`);
    assert.equal(bd.status, 403);
    assert.equal((await call(staff, 'DELETE', `${base0}/SH-4`)).status, 200);
    assert.equal((await call(staff, 'GET', base0)).data.stakeholders.length, 3);
  });

  it('2. RACI: hoạt động mặc định, A duy nhất, vấn đề; agent không đổi', async () => {
    const r0 = `/projects/${pid}/swr/raci`;
    assert.equal((await call(staff, 'POST', `${r0}/activities`, { defaults: true })).data.added, 7);
    assert.equal((await call(bot, 'POST', `${r0}/activities`, { name: 'Bot task' })).status, 403);
    let r = await call(staff, 'GET', r0);
    const act = r.data.activities[4];
    assert.equal(act.name, 'Approve the requirements baseline');
    await call(staff, 'PUT', `${r0}/cells`, { activityId: act.id, stakeholder: 'SH-1', role: 'A' });
    r = await call(staff, 'PUT', `${r0}/cells`, { activityId: act.id, stakeholder: 'SH-2', role: 'A' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const mine = r.data.cells.filter((c: any) => c.activityId === act.id);
    assert.deepEqual(mine.map((c: any) => c.role).sort(), ['A', 'R'], 'A cũ thành R');
    assert.ok(!r.data.problems.some((p: any) => p.activity === act.name));
    assert.ok(r.data.problems.some((p: any) => p.code === 'NO_A'));
    assert.equal((await call(bot, 'PUT', `${r0}/cells`, { activityId: act.id, stakeholder: 'SH-1', role: null })).status, 403);
  });

  it('3. phiên elicitation ⇒ họp K-2 ⇒ AI đề xuất có bằng chứng ⇒ người nhận ⇒ thẻ REQUIREMENT có nguồn', async () => {
    const e0 = `/projects/${pid}/swr/elicitation`;
    const s = await call(staff, 'POST', e0, { title: 'Pickers interview', technique: 'INTERVIEW', scheduledAt: '2026-10-12T02:00:00Z', durationMin: 45, objective: 'Find why orders get lost', suggestQuestions: true, participants: [{ stakeholder: 'SH-1', rolePlayed: 'Fulfillment Manager' }] });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    assert.equal(s.data.number, 1);
    assert.equal(s.data.key, 'ELC-1');
    assert.equal(s.data.questions.length, 6);
    assert.equal(s.data.participants[0].rolePlayed, 'Fulfillment Manager');
    assert.equal((await call(staff, 'POST', e0, { title: 'x', technique: 'INTERVIEW', participants: [{ stakeholder: 'SH-99' }] })).status, 400);
    // nối họp K-2
    const m = await call(staff, 'POST', `${e0}/1/meeting`, { create: true });
    assert.equal(m.status, 200, JSON.stringify(m.raw));
    const meeting = await prisma.workMeeting.findFirstOrThrow({ where: { projectId: pid, number: m.data.meeting.number } });
    assert.equal(meeting.type, 'ELICITATION');
    assert.match(meeting.title, /^ELC-1 Pickers interview/);
    // ghi câu trả lời + ghi chú (không có transcript thật ⇒ AI đọc câu trả lời + ghi chú)
    const cur = (await call(staff, 'GET', `${e0}/ELC-1`)).data;
    const questions = cur.questions.map((q: any, i: number) => ({ ...q, answer: i === 1 ? 'The pick list printer jams twice a day and we lose the orders' : q.answer }));
    const upd = await call(staff, 'PATCH', `${e0}/1`, { questions, notes: 'Peak is 500 orders per hour on Mondays.', status: 'DONE', rev: cur.rev });
    assert.equal(upd.status, 200, JSON.stringify(upd.raw));
    assert.equal(upd.data.questions[1].answer.startsWith('The pick list'), true);
    // AI giả: 1 đề xuất có bằng chứng thật, 1 bịa (trích dẫn không có) ⇒ bỏ
    const { _setElicitationAskForTests } = await import('../services/work/swrElic.service.js');
    let prompt = '';
    _setElicitationAskForTests(async (_s, u) => {
      prompt = u;
      const line = /(\d+)\. Q: [^\n]*printer jams/.exec(u)?.[1];
      const peak = /(\d+)\. Peak is 500/.exec(u)?.[1];
      return JSON.stringify({ requirements: [
        { title: 'The system shall queue pick lists while the printer is offline and reprint them automatically', type: 'FUNCTIONAL', priority: 'HIGH', stakeholder: 'SH-1', evidence: [{ line: Number(line), quote: 'printer jams twice a day' }] },
        { title: 'The system shall handle 500 orders per hour', type: 'QUALITY', evidence: [{ line: Number(peak), quote: '500 orders per hour' }] },
        { title: 'The system shall use blockchain', type: 'FUNCTIONAL', evidence: [{ line: 1, quote: 'blockchain ledger' }] },
      ], notes: ['Ask about scanners next time'] });
    });
    const pr = await call(staff, 'POST', `${e0}/1/propose`, { language: 'en' });
    assert.equal(pr.status, 200, JSON.stringify(pr.raw));
    assert.equal(pr.data.added, 2);
    assert.equal(pr.data.dropped, 1);
    assert.match(prompt, /SH-1 Lan \(Fulfillment Manager\)/);
    const props = pr.data.session.proposals;
    assert.equal(props.length, 2);
    assert.equal(props[0].evidence[0].quote, 'printer jams twice a day');
    // agent: tạo đề xuất được, nhận thì không
    assert.equal((await call(bot, 'POST', `${e0}/1/proposals/${props[0].id}/decide`, { accept: true })).status, 403);
    assert.equal((await call(viewer, 'POST', `${e0}/1/proposals/${props[0].id}/decide`, { accept: true })).status, 403);
    const acc = await call(staff, 'POST', `${e0}/1/proposals/${props[0].id}/decide`, { accept: true, approve: true });
    assert.equal(acc.status, 200, JSON.stringify(acc.raw));
    assert.match(acc.data.issue.key, /^OMFS-\d+$/);
    assert.equal((await call(staff, 'POST', `${e0}/1/proposals/${props[0].id}/decide`, { accept: true })).status, 409);
    const iss = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: acc.data.issue.number }, include: { type: true, requirementInfo: true } });
    assert.equal(iss.type.key, 'REQUIREMENT');
    assert.equal(iss.requirementInfo?.reqType, 'FUNCTIONAL');
    assert.equal(iss.requirementInfo?.priority, 'HIGH');
    assert.equal(iss.requirementInfo?.lifecycle, 'APPROVED');
    assert.equal(iss.requirementInfo?.source, 'ELC-1 Interview, 12/10/2026 — Lan (Fulfillment Manager)');
    assert.match(iss.descriptionText ?? '', /printer jams twice a day/);
    assert.equal((await call(staff, 'POST', `${e0}/1/proposals/${props[1].id}/decide`, { accept: false })).data.status, 'DISMISSED');
    // gắn nguồn tay cho thẻ khác
    const other = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Show the order history', typeKey: 'REQUIREMENT' });
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/origins`, { issue: other.data.number, stakeholder: 'SH-2' })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/origins`, { issue: other.data.number })).status, 400);
    const tr = await call(viewer, 'GET', `/projects/${pid}/swr/trace`);
    assert.equal(tr.data.counts.traced, 2);
    const row = tr.data.rows.find((r: any) => r.issueNumber === acc.data.issue.number);
    assert.deepEqual([row.origins[0].session.key, row.origins[0].stakeholder.key], ['ELC-1', 'SH-1']);
    const list = await call(staff, 'GET', e0);
    assert.equal(list.data.sessions[0].requirements, 1);
    assert.equal(list.data.sessions[0].pending, 0);
    _setElicitationAskForTests(null);
  });

  let token = '';
  it('4. khảo sát công khai: nháp 404, mở (agent 403), trả lời, đóng ⇒ 410, xlsx', async () => {
    const s0 = `/projects/${pid}/swr/surveys`;
    const c = await call(staff, 'POST', s0, { title: 'Picker survey', collectName: true, session: 'ELC-1', questions: [
      { kind: 'SINGLE', text: 'Your role', options: ['Picker', 'Supervisor'], required: true },
      { kind: 'SCALE', text: 'How often does printing fail?', scaleMax: 5 },
      { kind: 'LONG_TEXT', text: 'What should change?' },
    ] });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    assert.equal(c.data.key, 'SV-1');
    assert.equal((await call(staff, 'POST', s0, { title: 'Bad', questions: [{ kind: 'SINGLE', text: 'x', options: ['a'] }] })).status, 400);
    assert.equal((await call(bot, 'POST', `${s0}/1/status`, { status: 'OPEN' })).status, 403);
    const draftTok = await prisma.workSurvey.findFirstOrThrow({ where: { projectId: pid, number: 1 } });
    assert.equal(draftTok.token, null);
    const open = await call(staff, 'POST', `${s0}/SV-1/status`, { status: 'OPEN' });
    assert.equal(open.status, 200, JSON.stringify(open.raw));
    token = open.data.publicPath.split('/').pop();
    const pub = await call(null, 'GET', `/public/surveys/${token}`);
    assert.equal(pub.status, 200);
    assert.equal(pub.data.questions.length, 3);
    assert.equal(pub.data.project, 'Order Fulfillment');
    assert.equal(pub.raw.data.questions[0].id, 'q1');
    const bad = await call(null, 'POST', `/public/surveys/${token}/responses`, { answers: { q1: 'Boss' } });
    assert.equal(bad.status, 400);
    assert.equal(bad.code, 'WORK_SURVEY_INVALID');
    for (const [role, n, txt] of [['Picker', 4, 'A spare printer'], ['Supervisor', 2, '']] as const) {
      const r = await call(null, 'POST', `/public/surveys/${token}/responses`, { name: `Resp ${role}`, answers: { q1: role, q2: n, q3: txt } });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
    }
    const g = await call(staff, 'GET', `${s0}/1`);
    assert.equal(g.data.responses, 2);
    assert.equal(g.data.summary[1].average, 3);
    assert.equal(g.data.session, 'ELC-1');
    const x = await download(staff, `${s0}/1/export.xlsx`);
    assert.equal(x.status, 200);
    const book = readXlsx(x.buf);
    assert.deepEqual(book.map((b) => b.name), ['Responses', 'Summary', 'Questions']);
    assert.equal(book[0].text(4, 3), 'Resp Picker');
    assert.equal(book[0].text(4, 4), 'Picker');
    assert.equal(book[0].text(4, 6), 'A spare printer');
    await call(staff, 'POST', `${s0}/1/status`, { status: 'CLOSED' });
    const closed = await call(null, 'POST', `/public/surveys/${token}/responses`, { answers: { q1: 'Picker' } });
    assert.equal(closed.status, 410);
    assert.equal((await call(null, 'GET', `/public/surveys/${token}`)).data.closed, 'CLOSED');
    assert.equal((await call(null, 'GET', '/public/surveys/notarealtoken000000')).status, 404);
    // khảo sát đã có câu trả lời: không đổi loại câu hỏi cũ
    const lock = await call(staff, 'PATCH', `${s0}/1`, { questions: [{ id: 'q1', kind: 'TEXT', text: 'Role' }, { id: 'q2', kind: 'SCALE', text: 'x' }, { id: 'q3', kind: 'LONG_TEXT', text: 'y' }] });
    assert.equal(lock.status, 409);
  });

  it('5. báo cáo elicitation .docx/.pdf', async () => {
    const d = await download(viewer, `/projects/${pid}/swr/elicitation-report.docx`);
    assert.equal(d.status, 200);
    assert.match(d.disposition ?? '', /OMFS_Elicitation_Report\.docx/);
    const t = docxText(d.buf);
    for (const s of ['Requirements Elicitation Report — Order Fulfillment', '2.1 Power × interest grid', '2.2 RACI matrix', '3.1 ELC-1 Pickers interview', 'plays Fulfillment Manager', 'Picker survey', 'Requirement traceability to sources', 'Manage closely']) assert.ok(t.includes(s), s);
    const p = await download(viewer, `/projects/${pid}/swr/elicitation-report.pdf`);
    assert.equal(p.buf.subarray(0, 4).toString(), '%PDF');
  });

  let ctxDiagram = 0;
  it('6. mô hình: thiếu nguồn 422 song ngữ ⇒ đủ dữ liệu ⇒ sơ đồ đề xuất; dựng lại ⇒ phiên bản mới; event–response', async () => {
    const m0 = `/projects/${pid}/swr/models`;
    const none = await call(staff, 'POST', `${m0}/context/generate`, {});
    assert.equal(none.status, 422);
    assert.equal(none.code, 'WORK_DIAGRAM_NO_SOURCE');
    assert.match(none.raw.data?.vi ?? none.raw.error?.data?.vi ?? JSON.stringify(none.raw), /Sơ đồ ngữ cảnh/);
    // dữ liệu: DD + UC + feature
    await call(staff, 'POST', `/projects/${pid}/swr/dictionary`, { name: 'Order', kind: 'STRUCTURE', composition: 'Order ID + Order Status' });
    await call(staff, 'POST', `/projects/${pid}/swr/dictionary`, { name: 'Order ID', dataType: 'integer' });
    await call(staff, 'POST', `/projects/${pid}/swr/dictionary`, { name: 'Order Status', dataType: 'enum', values: 'Pending, Paid, Shipped' });
    const mk = (body: any) => call(staff, 'POST', `/projects/${pid}/srs/use-cases`, { status: 'APPROVED', ...body });
    const u1 = await mk({ name: 'Place order', feature: 'Ordering', primaryActorId: actorCustomer, secondaryActorIds: [actorBank], postconditions: 'The Order is Pending.', normalFlow: '1. Customer fills the cart.\n2. System saves the Order.' });
    assert.equal(u1.status, 201, JSON.stringify(u1.raw));
    await mk({ name: 'Pay order', feature: 'Ordering', primaryActorId: actorCustomer, secondaryActorIds: [actorBank], preconditions: 'Order is Pending', postconditions: 'Order is Paid', normalFlow: '1. Customer pays.\n2. System records the payment.' });
    await mk({ name: 'Ship order', feature: 'Fulfillment', primaryActorId: actorManager, preconditions: 'Order is Paid', postconditions: 'Order is Shipped', trigger: 'Every day at 08:00', normalFlow: '1. Manager picks the Order.\n2. System prints the label.' });
    await call(staff, 'POST', `/projects/${pid}/swr/features`, { name: 'Ordering' });
    await call(staff, 'POST', `/projects/${pid}/swr/features`, { name: 'Fulfillment' });
    await call(staff, 'POST', `/projects/${pid}/swr/features/FE-1/links`, { kind: 'UC', ref: 'UC-01' });
    await call(staff, 'POST', `/projects/${pid}/swr/features/FE-1/links`, { kind: 'UC', ref: 'UC-02' });
    await call(staff, 'POST', `/projects/${pid}/swr/features/FE-2/links`, { kind: 'UC', ref: 'UC-03' });
    const ctx = await call(staff, 'POST', `${m0}/context/generate`, {});
    assert.equal(ctx.status, 201, JSON.stringify(ctx.raw));
    assert.equal(ctx.data.created, true);
    ctxDiagram = ctx.data.diagram.number;
    const d = await call(staff, 'GET', `/projects/${pid}/diagrams/${ctxDiagram}`);
    assert.equal(d.data.status, 'PROPOSED');
    assert.equal(d.data.type ?? d.data.diagramType, 'DATA_FLOW');
    assert.match(d.data.source, /SYS\(\("0<br\/>Order Fulfillment"\)\)/);
    assert.match(d.data.source, /-->\|"Order"\| SYS/);
    assert.equal(d.data.origin.generator, 'data');
    for (const [k, body] of [['dfd1', {}], ['state', { subject: 'Order Status' }], ['feature_tree', {}], ['activity', { useCase: 'UC-03' }]] as const) {
      const r = await call(staff, 'POST', `${m0}/${k}/generate`, body);
      assert.equal(r.status, 201, `${k}: ${JSON.stringify(r.raw)}`);
    }
    // dữ liệu không đổi ⇒ không thêm phiên bản; thêm UC ⇒ phiên bản mới của CÙNG sơ đồ
    const same = await call(staff, 'POST', `${m0}/context/generate`, {});
    assert.equal(same.data.created, false);
    assert.equal((await call(staff, 'GET', `/projects/${pid}/diagrams/${ctxDiagram}`)).data.currentVersion, 1);
    const courier = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Courier' })).data.id;
    await mk({ name: 'Track order', feature: 'Ordering', primaryActorId: actorCustomer, secondaryActorIds: [courier], normalFlow: '1. Customer opens the order.\n2. System shows the status.' });
    const again = await call(staff, 'POST', `${m0}/context/generate`, {});
    assert.equal(again.data.created, false);
    assert.equal(again.data.diagram.number, ctxDiagram);
    const v2 = await call(staff, 'GET', `/projects/${pid}/diagrams/${ctxDiagram}`);
    assert.equal(v2.data.currentVersion, 2);
    assert.match(v2.data.source, /\["Courier"\]/);
    assert.equal((await call(staff, 'POST', `${m0}/state/generate`, { subject: 'Nope' })).status, 422);
    assert.equal((await call(viewer, 'POST', `${m0}/context/generate`, {})).status, 403);
    const list = await call(viewer, 'GET', m0);
    assert.deepEqual(list.data.models.map((m: any) => `${m.kind}:${m.subject}`).sort(), ['ACTIVITY:UC-03', 'CONTEXT:', 'DFD1:', 'FEATURE_TREE:', 'STATE:Order Status']);
    assert.equal(list.data.readiness.CONTEXT.ready, true);
    assert.deepEqual(list.data.events.map((e: any) => e.type), ['BUSINESS', 'BUSINESS', 'TEMPORAL', 'BUSINESS']);
    const st = await call(staff, 'GET', `/projects/${pid}/diagrams/${list.data.models.find((m: any) => m.kind === 'STATE').diagram.number}`);
    assert.match(st.data.source, /S1 --> S2 : UC-02 Pay order/);
    const ev = await download(viewer, `/projects/${pid}/swr/export/event-response.xlsx`);
    const sh = readXlsx(ev.buf)[0];
    assert.equal(sh.text(3, 1), 'Event');
    assert.equal(sh.text(6, 2), 'Temporal event');
    // duyệt context + DFD ⇒ vào SRS
    assert.equal((await call(teacher, 'POST', `/projects/${pid}/diagrams/${ctxDiagram}/approve`, {})).status, 200);
    const dfd = list.data.models.find((m: any) => m.kind === 'DFD1').diagram.number;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/diagrams/${dfd}/approve`, {})).status, 200);
  });

  it('7. prototype: ảnh + Figma, gửi xác nhận, giảng viên/khách duyệt, đổi thiết kế ⇒ về nháp', async () => {
    const sc = await call(staff, 'POST', `/projects/${pid}/srs/screens`, { name: 'Checkout', feature: 'Ordering' });
    assert.equal(sc.status, 201, JSON.stringify(sc.raw));
    const png = await sharp({ create: { width: 40, height: 30, channels: 3, background: '#4f5bd5' } }).png().toBuffer();
    const up = await fetch(`${base}/api/v1/work/projects/${pid}/images?name=checkout.png`, { method: 'POST', headers: { Authorization: `Bearer ${staff.token}`, 'Content-Type': 'image/png' }, body: png });
    const img = ((await up.json()) as any).data;
    assert.ok(img.id);
    const k0 = `/projects/${pid}/swr/mockups`;
    const a = await call(staff, 'POST', k0, { screenId: sc.data.id, kind: 'IMAGE', imageId: img.id, title: 'Checkout v1' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    const f = await call(staff, 'POST', k0, { screenId: sc.data.id, kind: 'LINK', url: 'https://www.figma.com/design/abc/Checkout', title: 'Figma' });
    assert.equal(f.data.provider, 'FIGMA');
    assert.equal((await call(staff, 'POST', k0, { screenId: sc.data.id, kind: 'LINK', url: 'javascript:alert(1)' })).status, 400);
    assert.equal((await call(teacher, 'POST', `${k0}/${a.data.id}/review`, { decision: 'APPROVED' })).status, 409, 'nháp chưa gửi');
    await call(staff, 'POST', `${k0}/${a.data.id}/submit`, {});
    assert.equal((await call(staff, 'POST', `${k0}/${a.data.id}/review`, { decision: 'APPROVED' })).status, 403, 'MEMBER không tự duyệt');
    assert.equal((await call(teacher, 'POST', `${k0}/${a.data.id}/review`, { decision: 'CHANGES' })).status, 400, 'phải nói đổi gì');
    const ok = await call(teacher, 'POST', `${k0}/${a.data.id}/review`, { decision: 'APPROVED', note: 'Looks right' });
    assert.equal(ok.data.status, 'APPROVED');
    assert.equal(ok.data.reviewerRole, 'LECTURER');
    // link khách cho bản Figma
    assert.equal((await call(bot, 'POST', `${k0}/${f.data.id}/submit`, { share: true })).status, 403);
    const sh = await call(staff, 'POST', `${k0}/${f.data.id}/submit`, { share: true });
    const tok = sh.data.reviewPath.split('/').pop();
    const pub = await call(null, 'GET', `/public/mockup-review/${tok}`);
    assert.equal(pub.data.screen, 'Checkout');
    assert.equal(pub.data.provider, 'FIGMA');
    assert.equal((await call(null, 'POST', `/public/mockup-review/${tok}/decision`, { decision: 'APPROVED' })).status, 400);
    const dec = await call(null, 'POST', `/public/mockup-review/${tok}/decision`, { decision: 'CHANGES', name: 'Client Minh', note: 'Add a coupon field' });
    assert.equal(dec.status, 200, JSON.stringify(dec.raw));
    assert.equal(dec.data.status, 'CHANGES');
    assert.equal((await call(null, 'POST', `/public/mockup-review/${tok}/decision`, { decision: 'APPROVED', name: 'Again' })).status, 409);
    // ảnh qua link khách
    const sh2 = await call(staff, 'POST', `${k0}/${a.data.id}/submit`, { share: true });
    const tok2 = sh2.data.reviewPath.split('/').pop();
    const pi = await download(null, `/public/mockup-review/${tok2}/image`);
    assert.equal(pi.status, 200);
    assert.equal(pi.type, 'image/png');
    await call(null, 'POST', `/public/mockup-review/${tok2}/decision`, { decision: 'APPROVED', name: 'Client Minh' });
    // đổi link Figma ⇒ về nháp, link cũ chết
    const ch = await call(staff, 'PATCH', `${k0}/${f.data.id}`, { url: 'https://www.figma.com/design/abc/Checkout-v2' });
    assert.equal(ch.data.status, 'DRAFT');
    assert.equal((await call(null, 'GET', `/public/mockup-review/${tok}`)).status, 404);
    const l = await call(viewer, 'GET', k0);
    assert.deepEqual(l.data.counts, { screens: 1, withPrototype: 1, approved: 1 });
    assert.equal(l.data.canReview, false);
    assert.equal((await call(teacher, 'GET', k0)).data.canReview, true);
  });

  it('8–9. checklist chất lượng + NFR có số đo', async () => {
    const vague = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Hệ thống phải nhanh và thân thiện', typeKey: 'REQUIREMENT' });
    const q0 = `/projects/${pid}/swr/quality`;
    let q = await call(viewer, 'GET', q0);
    const row = q.data.requirements.find((r: any) => r.number === vague.data.number);
    assert.equal(row.criteria.find((c: any) => c.key === 'unambiguous').status, 'fail');
    assert.equal(row.criteria.find((c: any) => c.key === 'feasible').status, 'unchecked');
    assert.ok(row.vague.some((v: any) => /nhanh/.test(v.match)), JSON.stringify(row.vague));
    assert.equal((await call(bot, 'PUT', `${q0}/${vague.data.number}`, { feasible: true })).status, 403);
    const man = await call(staff, 'PUT', `${q0}/${vague.data.number}`, { feasible: true, necessary: true });
    assert.equal(man.status, 200, JSON.stringify(man.raw));
    assert.equal(man.data.criteria.find((c: any) => c.key === 'feasible').status, 'pass');
    const { _setElicitationAskForTests } = await import('../services/work/swrElic.service.js');
    _setElicitationAskForTests(async () => JSON.stringify({ rewrite: 'Hệ thống phải hiển thị kết quả tìm kiếm trong 2 giây cho 95% yêu cầu [confirm]', acceptanceCriteria: ['Given 100 users, When searching, Then p95 < 2 s'], notes: ['Thay "nhanh" bằng số đo'] }));
    const fix = await call(staff, 'POST', `${q0}/${vague.data.number}/ai-fix`, { language: 'vi' });
    assert.equal(fix.status, 200, JSON.stringify(fix.raw));
    assert.match(fix.data.suggestion.rewrite, /2 giây/);
    _setElicitationAskForTests(null);
    q = await call(staff, 'GET', q0);
    assert.ok(q.data.requirements.find((r: any) => r.number === vague.data.number).ai.rewrite);
    const x = readXlsx((await download(staff, `/projects/${pid}/swr/export/quality.xlsx`)).buf)[0];
    assert.equal(x.text(3, 4), 'Unambiguous');
    // NFR
    const n0 = `/projects/${pid}/swr/nfr`;
    const t = await call(staff, 'POST', `${n0}/from-template`, { template: 'perf-response', title: 'Checkout response time' });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    const nl = await call(viewer, 'GET', n0);
    const nr = nl.data.requirements.find((r: any) => r.number === t.data.number);
    assert.match(nr.statement, /shall be at most 2000 ms \(target 1000 ms\)/);
    assert.equal(nr.subtype, 'PERFORMANCE');
    assert.equal(nl.data.measured, 1);
    assert.equal((await call(staff, 'PUT', `${n0}/${t.data.number}`, { characteristic: 'SECURITY', subCharacteristic: 'Time behaviour', scale: 'abc', meter: 'def' })).status, 400);
    const func = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, title: { startsWith: 'The system shall queue' } } });
    assert.equal((await call(staff, 'PUT', `${n0}/${func.number}`, { characteristic: 'PERFORMANCE_EFFICIENCY', scale: 'p95 latency', meter: 'k6 run', mustValue: 1 })).code, 'WORK_NOT_QUALITY');
    const qq = (await call(staff, 'GET', q0)).data.requirements.find((r: any) => r.number === t.data.number);
    assert.equal(qq.criteria.find((c: any) => c.key === 'verifiable').status, 'pass');
  });

  it('10. SRS Wiegers .docx có mô hình + NFR + stakeholder + prototype; V&S có Stakeholder Profiles', async () => {
    const pre = await call(staff, 'GET', `/projects/${pid}/swr/docs/srs`);
    assert.equal(pre.status, 200, JSON.stringify(pre.raw));
    for (const f of ['context diagram', 'stakeholders', 'prototypes', 'measurable quality attributes', 'analysis models']) assert.ok(pre.data.filled.includes(f), f);
    const json = JSON.stringify(pre.data.doc);
    assert.match(json, /ctw-diagram:\d+@\d+ D-\d+ v2 — Context diagram/);
    assert.match(json, /Event-response table/);
    const d = await download(staff, `/projects/${pid}/swr/docs/srs/export`, 'POST', { format: 'docx' });
    assert.equal(d.status, 200);
    const t = docxText(d.buf);
    for (const s of ['Stakeholder register', 'Lan (Fulfillment Manager)', 'shall be at most 2000 ms', 'Planguage', 'Event-response table', 'Checkout — Checkout v1', 'Ship order']) assert.ok(t.includes(s), s);
    const vs = await call(staff, 'GET', `/projects/${pid}/swr/docs/vision-scope`);
    assert.ok(vs.data.filled.includes('stakeholders'));
    assert.match(JSON.stringify(vs.data.doc), /Fewer lost orders[\s\S]*Product champion/);
    // điền trang Docs SRS (phiên bản mới) — giữ nguyên các mục 4b
    const fill = await call(staff, 'POST', `/projects/${pid}/swr/docs/srs/fill`, { create: true });
    assert.ok(fill.data.filled.includes('analysis models'));
  });

  it('11. registry: đọc chạy ngay, ghi qua service; agent không nhận đề xuất qua đường nào', async () => {
    const r = await import('../services/work/toolRegistry/index.js');
    const ref = await r.projectRefOf(pid);
    const read = await r.runForPerson(viewer.id, pid, 'swr_stakeholders', {}, 'read');
    assert.match(read.text, /SH-1/);
    assert.match((await r.runForPerson(viewer.id, pid, 'swr_quality', { failingOnly: true }, 'read')).text, /unambiguous/);
    assert.match((await r.runForPerson(viewer.id, pid, 'swr_models', {}, 'read')).text, /CONTEXT/);
    const add = await r.runForPerson(staff.id, pid, 'swr_elicitation_add', { title: 'Observe packing', technique: 'OBSERVATION', suggestQuestions: true, participants: [{ stakeholder: 'SH-1' }] }, 'apply');
    assert.match(add.text, /ELC-2/);
    const ans = await r.runForPerson(staff.id, pid, 'swr_elicitation_update', { session: 'ELC-2', answers: [{ id: 'q1', answer: 'Packers re-type the address' }], status: 'DONE' }, 'apply');
    assert.match(ans.text, /"answered": 1/);
    const sv = await r.runForPerson(staff.id, pid, 'swr_survey_add', { title: 'Packers', questions: [{ kind: 'YES_NO', text: 'Do you re-type addresses?' }] }, 'apply');
    assert.match(sv.text, /SV-2/);
    assert.equal((await prisma.workSurvey.findFirstOrThrow({ where: { projectId: pid, number: 2 } })).status, 'DRAFT');
    const ctxAgent = { userId: bot.id, agent: null, scopes: ['read', 'write'], tokenId: 0, signal: new AbortController().signal } as any;
    const st = await r.runForAgent(ctxAgent, ref, 'swr_stakeholder_add', { name: 'Bot-added customer rep', influence: 2, interest: 4 });
    assert.equal(st.ok, true, st.text);
    const nfr = await r.runForAgent(ctxAgent, ref, 'swr_nfr', {});
    assert.equal(nfr.ok, true);
    assert.equal(r.commandByName('swr_proposal_decide'), undefined, 'không có lệnh nhận đề xuất');
  });
});
