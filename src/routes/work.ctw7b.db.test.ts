/**
 * CT Work đợt 7b — Forms · Import · Kênh ngoài → đề xuất · Knowledge base, qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw7b.db.test.ts
 * Không gọi dịch vụ ngoài nào: chữ ký Resend/Discord/Zalo tự ký bằng khoá GIẢ, tệp mẫu tự dựng (ctw7b.samples.ts),
 * kho tệp form GIẢ (`_setFormFileStoreForTests`), lấy thân thư GIẢ (`_setEmailBodyFetcherForTests`).
 *
 *   1. Form: quyền soạn, form công khai cấm trường "người", mở link ⇒ gửi ⇒ thẻ theo ánh xạ (loại, nhãn, người làm,
 *      trường tuỳ chỉnh, tiêu đề mẫu, tệp đính kèm), ẩn/hiện, honeypot, trần IP, đóng ⇒ 410; form nội bộ (đăng nhập,
 *      người ngoài 404, trường người); tổng hợp + xlsx.
 *   2. Import: Trello / Asana CSV / Jira CSV / CSV chung / Excel — xem trước lỗi từng dòng, nhập, bình luận, nhãn,
 *      checklist ⇒ việc con, khớp người theo email (không khớp ⇒ trống + ghi chú), nhập lại không trùng, báo cáo.
 *   3. Kênh ngoài: email (Svix) / Discord (Ed25519) / Zalo (sha256) — sai chữ ký 401, quá hạn 401, phát lại 409, thư
 *      gửi địa chỉ khác bị bỏ; đề xuất PHẢI duyệt (agent/viewer không duyệt được), nhận ⇒ thẻ; bí mật không lộ; giả lập.
 *   4. KB: bài từ Docs, khách chỉ thấy bài CLIENT trên trang CLIENT, tìm kiếm, gợi ý deflection, bình chọn, xem trước chỉ đọc.
 */

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { readXlsx } from '../services/work/xlsxStyled.js';
import { asanaCsvSample, genericCsvSample, genericXlsxSample, jiraCsvSample, trelloSample } from '../services/work/ctw7b.samples.js';
import { discordSign, rawPublicKeyHex, svixSign, zaloMac } from '../services/work/intakeRules.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c7b${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };

describe('CT Work — đợt 7b: forms, import, kênh ngoài, knowledge base (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, outsider: U, client: U, bot: U;
  let wsId = 0, pid = 0;
  const stored = new Map<string, Buffer>();

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN', displayName?: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: displayName ?? name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...headers },
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const issue = (number: number) => prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number }, include: { labels: { include: { label: true } }, type: true, status: true, customValues: true, attachments: true } });

  before(async () => {
    process.env.WORK_PUBLIC_SUBMIT_RPM = '1000';
    process.env.WORK_INTAKE_RPM = '1000';
    (emailService as any).send = async () => ({ success: true });
    const forms = await import('../services/work/forms.service.js');
    forms._setFormFileStoreForTests(async (key, body) => { stored.set(key, body); });
    (await import('../services/work/intake.service.js'))._setEmailBodyFetcherForTests(async () => 'Body fetched from the inbound API');
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    // Giống index.ts: webhook kênh ngoài cần THÂN GỐC.
    app.use('/api/v1/work/intake', express.raw({ type: '*/*', limit: '5mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, viewer, outsider, client] = await Promise.all(['owner', 'viewer', 'outsider', 'client'].map((n) => mkUser(n)));
    staff = await mkUser('staff', 'HUMAN', 'Lan Pham');
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW7b ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'HD', name: 'Help desk', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    assert.equal(p.data.modules.clientPortal, true);
    await call(owner, 'PUT', `/projects/${pid}/members/${staff.id}`, { role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    bot = await mkUser('bot', 'AGENT');
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: bot.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: bot.id, role: 'MEMBER' } });
  });

  after(async () => {
    (await import('../services/work/forms.service.js'))._setFormFileStoreForTests(null);
    (await import('../services/work/intake.service.js'))._setEmailBodyFetcherForTests(null);
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  // ═══ 1. Forms ══════════════════════════════════════════════════

  it('1a. form công khai: soạn, ánh xạ, mở link, gửi ⇒ thẻ đúng ánh xạ; ẩn/hiện; tệp đính kèm', async () => {
    const label = await prisma.workLabel.create({ data: { projectId: pid, name: 'from-form' } });
    const cf = await prisma.workCustomField.create({ data: { projectId: pid, name: `Area ${tag}`, kind: 'SELECT', options: [{ id: 'o1', label: 'Web' }, { id: 'o2', label: 'App' }] } });
    const fields = [
      { id: 'summary', kind: 'text', label: 'Summary', required: true },
      { id: 'kind', kind: 'select', label: 'Kind', options: ['Bug', 'Idea'], required: true },
      { id: 'steps', kind: 'longtext', label: 'Steps', required: true, showIf: { field: 'kind', equals: 'Bug' } },
      { id: 'area', kind: 'select', label: 'Area', options: ['Web', 'App'] },
      { id: 'shot', kind: 'file', label: 'Screenshot' },
    ];
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/forms`, { title: 'X' })).status, 403);
    assert.equal((await call(client, 'POST', `/projects/${pid}/forms`, { title: 'X' })).status, 403);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/forms`, { title: 'Bad', fields: [...fields, { kind: 'user', label: 'Owner' }] })).code, 'WORK_FORM_PUBLIC_USER');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/forms`, { title: 'Bad', fields, mapping: { typeKey: 'NOPE' } })).code, 'WORK_FORM_BAD_MAPPING');
    const f = await call(staff, 'POST', `/projects/${pid}/forms`, {
      title: 'Report a problem', fields, collectEmail: true, confirmMessage: 'Thanks — we got it.',
      mapping: { typeKey: 'BUG', titleTemplate: '[{kind}] {summary}', labelIds: [label.id], assigneeId: staff.id, priority: 2, customFields: { [cf.id]: 'area' } },
    });
    assert.equal(f.status, 201, JSON.stringify(f.raw));
    assert.equal(f.data.key, 'F-1');
    assert.equal(f.data.link, null, 'nháp chưa có link');
    // MEMBER không mở form CÔNG KHAI (đối ngoại) — ADMIN mới mở.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/forms/F-1/status`, { status: 'OPEN' })).status, 403);
    const open = await call(owner, 'POST', `/projects/${pid}/forms/F-1/status`, { status: 'OPEN' });
    assert.equal(open.status, 200, JSON.stringify(open.raw));
    const token = String(open.data.link).split('/').pop()!;
    const pub = await call(null, 'GET', `/public/forms/${token}`);
    assert.equal(pub.status, 200);
    assert.equal(pub.data.fields.length, 5);
    assert.equal(pub.data.members, null);

    const bad = await call(null, 'POST', `/public/forms/${token}/responses`, { answers: { summary: 'Crash', kind: 'Bug' }, email: 'a@b.co', elapsedMs: 5000 });
    assert.equal(bad.status, 400);
    assert.deepEqual(bad.raw.data?.errors ?? bad.raw.errors ?? bad.raw.error?.data?.errors, bad.raw.data?.errors ?? bad.raw.errors ?? bad.raw.error?.data?.errors);
    assert.match(JSON.stringify(bad.raw), /steps/);
    const noEmail = await call(null, 'POST', `/public/forms/${token}/responses`, { answers: { summary: 'x', kind: 'Idea' }, elapsedMs: 5000 });
    assert.equal(noEmail.status, 400);

    const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(40)]);
    const okr = await call(null, 'POST', `/public/forms/${token}/responses`, {
      answers: { summary: 'Crash on save', kind: 'Bug', steps: 'Click save', area: 'Web' }, email: 'Ann@Example.com', name: 'Ann',
      files: { shot: [{ name: 'shot.png', type: 'image/png', data: png.toString('base64') }] }, elapsedMs: 5000,
    }, { 'X-Forwarded-For': '10.0.0.1' });
    assert.equal(okr.status, 201, JSON.stringify(okr.raw));
    assert.equal(okr.data.issue, null, 'người ngoài không thấy số thẻ nội bộ');
    assert.equal(okr.data.message, 'Thanks — we got it.');
    const resp = await prisma.workFormResponse.findFirstOrThrow({ where: { form: { projectId: pid } } });
    const i = await issue(resp.issueNumber!);
    assert.equal(i.title, '[Bug] Crash on save');
    assert.equal(i.type.key, 'BUG');
    assert.equal(i.priority, 2);
    assert.equal(i.assigneeId, staff.id);
    assert.deepEqual(i.labels.map((l) => l.label.name), ['from-form']);
    assert.deepEqual(i.customValues.map((v) => v.value), ['o1']);
    assert.equal(i.attachments.length, 1);
    assert.ok(stored.get(i.attachments[0].r2Key)?.equals(png));
    assert.match(i.descriptionText ?? '', /Steps:\nClick save[\s\S]*ann@example\.com/);

    // Tệp giả kiểu: .exe đổi tên thành png ⇒ FILE_TYPE
    const fake = await call(null, 'POST', `/public/forms/${token}/responses`, { answers: { summary: 'x', kind: 'Idea' }, email: 'a@b.co', files: { shot: [{ name: 'a.png', type: 'image/png', data: Buffer.from('MZ\x90\x00').toString('base64') }] }, elapsedMs: 5000 }, { 'X-Forwarded-For': '10.0.0.9' });
    assert.equal(fake.status, 400);
    assert.match(JSON.stringify(fake.raw), /FILE_TYPE/);
  });

  it('1b. chống spam: honeypot / gửi quá nhanh ⇒ "đã nhận" nhưng không tạo gì; trần IP 5 lượt/10 phút; đóng ⇒ 410', async () => {
    const form = await prisma.workForm.findFirstOrThrow({ where: { projectId: pid, number: 1 } });
    const before = await prisma.workIssue.count({ where: { projectId: pid } });
    const body = { answers: { summary: 'Spam', kind: 'Idea' }, email: 'bot@spam.test' };
    const hp = await call(null, 'POST', `/public/forms/${form.token}/responses`, { ...body, website: 'http://buy.now', elapsedMs: 9000 }, { 'X-Forwarded-For': '10.0.0.2' });
    assert.equal(hp.status, 201);
    assert.equal(hp.data.ok, true);
    const fast = await call(null, 'POST', `/public/forms/${form.token}/responses`, { ...body, elapsedMs: 200 }, { 'X-Forwarded-For': '10.0.0.2' });
    assert.equal(fast.status, 201);
    assert.equal(await prisma.workIssue.count({ where: { projectId: pid } }), before, 'bot không tạo thẻ');
    for (let k = 0; k < 5; k++) {
      const r = await call(null, 'POST', `/public/forms/${form.token}/responses`, { ...body, answers: { summary: `Real ${k}`, kind: 'Idea' }, elapsedMs: 9000 }, { 'X-Forwarded-For': '10.0.0.3' });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
    }
    const sixth = await call(null, 'POST', `/public/forms/${form.token}/responses`, { ...body, elapsedMs: 9000 }, { 'X-Forwarded-For': '10.0.0.3' });
    assert.equal(sixth.status, 429);
    assert.equal(sixth.code, 'WORK_FORM_RATE_LIMIT');
    assert.equal((await call(null, 'POST', `/public/forms/${form.token}/responses`, { ...body, answers: { summary: 'Other IP', kind: 'Idea' }, elapsedMs: 9000 }, { 'X-Forwarded-For': '10.0.0.4' })).status, 201);
    // tổng hợp
    const sum = await call(viewer, 'GET', `/projects/${pid}/forms/F-1/responses`);
    assert.equal(sum.status, 200);
    assert.equal(sum.data.total, 7);
    assert.deepEqual(sum.data.summary.find((s: any) => s.id === 'kind').counts, [{ option: 'Bug', n: 1 }, { option: 'Idea', n: 6 }]);
    const x = await fetch(`${base}/api/v1/work/projects/${pid}/forms/F-1/responses.xlsx`, { headers: { Authorization: `Bearer ${viewer.token}` } });
    assert.equal(x.status, 200);
    const sheet = readXlsx(Buffer.from(await x.arrayBuffer()))[0];
    assert.equal(sheet.text(1, 5), 'Summary');
    assert.equal(sheet.maxRow, 8);
    // đóng ⇒ 410; đổi link ⇒ link cũ 404
    await call(owner, 'POST', `/projects/${pid}/forms/F-1/status`, { status: 'CLOSED' });
    assert.equal((await call(null, 'POST', `/public/forms/${form.token}/responses`, { ...body, elapsedMs: 9000 }, { 'X-Forwarded-For': '10.0.0.5' })).status, 410);
    await call(owner, 'POST', `/projects/${pid}/forms/F-1/rotate`);
    assert.equal((await call(null, 'GET', `/public/forms/${form.token}`)).status, 404);
    // Đã có câu trả lời ⇒ không xoá trường
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/forms/F-1`, { fields: [{ id: 'summary', kind: 'text', label: 'Summary' }] })).code, 'WORK_FORM_LOCKED');
  });

  it('1c. form nội bộ: phải đăng nhập, người ngoài 404, khách cổng 404, trường người; người trong dự án thấy số thẻ', async () => {
    const f = await call(staff, 'POST', `/projects/${pid}/forms`, {
      title: 'Internal request', access: 'INTERNAL',
      fields: [{ id: 'what', kind: 'text', label: 'What', required: true }, { id: 'owner', kind: 'user', label: 'Owner' }, { id: 'pts', kind: 'number', label: 'Points', min: 1, max: 13 }],
    });
    assert.equal(f.status, 201, JSON.stringify(f.raw));
    // nội bộ: MEMBER mở được (không đối ngoại)
    const open = await call(staff, 'POST', `/projects/${pid}/forms/F-2/status`, { status: 'OPEN' });
    assert.equal(open.status, 200, JSON.stringify(open.raw));
    const token = String(open.data.link).split('/').pop()!;
    assert.equal((await call(null, 'GET', `/public/forms/${token}`)).code, 'WORK_FORM_LOGIN');
    assert.equal((await call(outsider, 'GET', `/forms/${token}`)).status, 404);
    assert.equal((await call(client, 'GET', `/forms/${token}`)).status, 404);
    const g = await call(staff, 'GET', `/forms/${token}`);
    assert.ok(g.data.members.some((m: any) => m.id === owner.id));
    assert.equal((await call(staff, 'POST', `/forms/${token}/responses`, { answers: { what: 'x', owner: outsider.id } })).status, 400);
    const r = await call(staff, 'POST', `/forms/${token}/responses`, { answers: { what: 'Need a staging DB', owner: owner.id, pts: 3 } });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.match(r.data.issue.key, /^HD-\d+$/);
    const i = await issue(r.data.issue.number);
    assert.equal(i.reporterId, staff.id);
    assert.match(i.descriptionText ?? '', /Owner: Owner/);
  });

  // ═══ 2. Import ═════════════════════════════════════════════════

  let trelloCreated = 0;

  it('2a. Trello: xem trước ⇒ nhập (cột ⇒ trạng thái, nhãn, bình luận, checklist ⇒ việc con, người khớp theo tên) ⇒ nhập lại không trùng', async () => {
    assert.equal((await call(staff, 'POST', `/projects/${pid}/imports`, { source: 'TRELLO', content: trelloSample() })).status, 403, 'chỉ ADMIN');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'TRELLO', content: '{"x":1}' })).code, 'WORK_IMPORT_BAD_FILE');
    const dry = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'TRELLO', content: trelloSample(), fileName: 'board.json' });
    assert.equal(dry.status, 200, JSON.stringify(dry.raw));
    assert.equal(dry.data.dryRun, true);
    assert.equal(dry.data.summary.toCreate, 3);
    assert.equal(dry.data.summary.checklistItems, 2);
    const lan = dry.data.people.find((p: any) => p.name === 'Lan Pham');
    assert.equal(lan.userId, staff.id);
    assert.equal(lan.matchedBy, 'name');
    assert.equal(dry.data.people.find((p: any) => p.name === 'Ghost Writer').userId, null);
    assert.ok(dry.data.rows[1].warnings.some((w: string) => /Ghost Writer/.test(w)));
    assert.equal(await prisma.workImportRun.count({ where: { projectId: pid } }), 0, 'xem trước không ghi');

    const run = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'TRELLO', content: trelloSample(), fileName: 'board.json', dryRun: false });
    assert.equal(run.status, 201, JSON.stringify(run.raw));
    assert.equal(run.data.created, 3);
    assert.equal(run.data.subtasks, 2);
    assert.equal(run.data.comments, 2);
    assert.deepEqual(run.data.unmatchedPeople, ['Ghost Writer']);
    trelloCreated = run.data.created;
    const recs = await prisma.workImportRecord.findMany({ where: { projectId: pid, source: 'TRELLO', kind: 'ISSUE' } });
    const login = await prisma.workIssue.findFirstOrThrow({ where: { id: recs.find((r) => r.externalId === '650a1b2c3d4e5f6a7b8c9d01')!.issueId }, include: { status: true, labels: { include: { label: true } }, children: { include: { status: true } }, comments: true } });
    assert.equal(login.status.category, 'IN_PROGRESS');
    assert.equal(login.assigneeId, staff.id);
    assert.deepEqual(login.labels.map((l) => l.label.name).sort(), ['frontend', 'red']);
    assert.deepEqual(login.children.map((c) => [c.title, c.status.category]).sort(), [['Email field', 'DONE'], ['Password field', 'TODO']]);
    assert.equal(login.comments[0].authorId, staff.id);
    assert.equal(login.dueDate?.toISOString().slice(0, 10), '2026-10-20');
    const ci = await prisma.workIssue.findFirstOrThrow({ where: { id: recs.find((r) => r.externalId === '650a1b2c3d4e5f6a7b8c9d02')!.issueId }, include: { status: true, comments: true } });
    assert.equal(ci.assigneeId, null);
    assert.match(ci.descriptionText ?? '', /Originally assigned to Ghost Writer/);
    assert.match(ci.comments[0].bodyText, /originally by Ghost Writer/);
    assert.equal(ci.status.category, 'DONE');
    assert.ok(ci.resolvedAt);

    const again = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'TRELLO', content: trelloSample(), dryRun: false });
    assert.equal(again.data.created, 0);
    assert.equal(again.data.duplicates, 3);
    assert.equal(await prisma.workImportRecord.count({ where: { projectId: pid, source: 'TRELLO' } }), 5);
    // Thẻ nhập bị xoá (thùng rác) ⇒ nhập lại được đúng thẻ đó.
    await prisma.workIssue.update({ where: { id: ci.id }, data: { deletedAt: new Date() } });
    const third = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'TRELLO', content: trelloSample(), dryRun: false });
    assert.equal(third.data.created, 1);
  });

  it('2b. Asana CSV: khớp người theo EMAIL, task con theo tên cha; ghép tay người ⇒ đè gợi ý', async () => {
    const csv = asanaCsvSample(staff.email);
    const dry = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'ASANA', content: csv });
    const lan = dry.data.people.find((p: any) => p.email === staff.email);
    assert.equal(lan.matchedBy, 'email');
    const nobody = dry.data.people.find((p: any) => p.email === 'nobody@nowhere.test');
    assert.equal(nobody.userId, null);
    const run = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'ASANA', content: csv, dryRun: false, people: { [nobody.key]: owner.id } });
    assert.equal(run.data.created, 3, JSON.stringify(run.raw));
    const recs = await prisma.workImportRecord.findMany({ where: { projectId: pid, source: 'ASANA' } });
    const checkout = await prisma.workIssue.findUniqueOrThrow({ where: { id: recs.find((r) => r.externalId === '1201')!.issueId }, include: { children: true } });
    assert.equal(checkout.assigneeId, staff.id);
    assert.deepEqual(checkout.children.map((c) => c.title), ['Wallet button']);
    const provider = await prisma.workIssue.findUniqueOrThrow({ where: { id: recs.find((r) => r.externalId === '1202')!.issueId } });
    assert.equal(provider.assigneeId, owner.id, 'ghép tay');
  });

  it('2c. Jira CSV: dòng lỗi được báo, việc con, bình luận; CSV chung + Excel; báo cáo các lượt', async () => {
    const dry = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'JIRA', content: jiraCsvSample(staff.email) });
    assert.equal(dry.data.summary.invalid, 1);
    assert.deepEqual(dry.data.rows[2].errors, ['Title is empty']);
    const run = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'JIRA', content: jiraCsvSample(staff.email), dryRun: false });
    assert.equal(run.data.created, 2);
    assert.equal(run.data.comments, 2);
    assert.deepEqual(run.data.invalidRows, [{ row: 4, errors: ['Title is empty'] }]);
    const recs = await prisma.workImportRecord.findMany({ where: { projectId: pid, source: 'JIRA' } });
    const sub = await prisma.workIssue.findUniqueOrThrow({ where: { id: recs.find((r) => r.externalId === '10002')!.issueId }, include: { type: true } });
    assert.equal(sub.type.level, -1);
    assert.equal(sub.parentId, recs.find((r) => r.externalId === '10001')!.issueId);

    const csv = genericCsvSample(staff.email);
    const cdry = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'CSV', content: csv });
    assert.equal(cdry.data.mapping.title, 0);
    assert.ok(cdry.data.columns.includes('Người làm'));
    assert.ok(cdry.data.rows[1].warnings.some((w: string) => /not a number/.test(w)));
    const crun = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'CSV', content: csv, dryRun: false });
    assert.equal(crun.data.created, 3);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'CSV', content: csv, dryRun: false })).data.duplicates, 3);
    const xrun = await call(owner, 'POST', `/projects/${pid}/imports`, { source: 'CSV', encoding: 'base64', content: genericXlsxSample().toString('base64'), fileName: 'tasks.xlsx', dryRun: false });
    assert.equal(xrun.data.created, 2, JSON.stringify(xrun.raw));
    const runs = await call(owner, 'GET', `/projects/${pid}/imports`);
    assert.ok(runs.data.length >= 7);
    assert.equal(runs.data[0].fileName, 'tasks.xlsx');
    assert.equal((await call(bot, 'POST', `/projects/${pid}/imports`, { source: 'CSV', content: csv })).status, 403, 'agent không nhập hàng loạt');
    assert.ok(trelloCreated > 0);
  });

  // ═══ 3. Kênh ngoài ═════════════════════════════════════════════

  const now = () => String(Math.floor(Date.now() / 1000));
  const whsec = `whsec_${crypto.randomBytes(24).toString('base64')}`;
  const emailEvent = (id: string, to = 'req@in.example.test') => JSON.stringify({ type: 'email.received', data: { email_id: id, from: `Lan <${staff.email}>`, to: [to], subject: 'Fwd: Export is broken', text: 'CSV export fails since Monday.' } });

  it('3a. email (Resend/Svix): ký đúng ⇒ đề xuất; sai chữ ký / quá hạn ⇒ 401; phát lại ⇒ 409; thư gửi địa chỉ khác bị bỏ; bí mật không lộ', async () => {
    assert.equal((await call(staff, 'POST', `/projects/${pid}/intake/channels`, { kind: 'EMAIL', address: 'req@in.example.test' })).status, 403);
    const ch = await call(owner, 'POST', `/projects/${pid}/intake/channels`, { kind: 'EMAIL', address: 'req@in.example.test', secret: whsec });
    assert.equal(ch.status, 201, JSON.stringify(ch.raw));
    assert.equal(ch.data.ready, true);
    assert.ok(!JSON.stringify(ch.data).includes(whsec.slice(10)), 'không trả bí mật');
    const row = await prisma.workIntakeChannel.findUniqueOrThrow({ where: { id: ch.data.id } });
    assert.ok(!row.secretEnc!.includes(whsec.slice(6)), 'bí mật mã hoá trong DB');
    const tok = String(ch.data.webhookUrl).split('/').pop();
    const send = (body: string, h: Record<string, string>) => call(null, 'POST', `/intake/email/${tok}`, body, h);
    const b1 = emailEvent('em_1');
    const ts = now();
    const ok1 = await send(b1, { 'svix-id': 'msg_1', 'svix-timestamp': ts, 'svix-signature': svixSign(whsec, 'msg_1', ts, b1) });
    assert.equal(ok1.status, 200, JSON.stringify(ok1.raw));
    assert.ok(ok1.data.proposal);
    assert.equal((await send(b1, { 'svix-id': 'msg_1', 'svix-timestamp': ts, 'svix-signature': svixSign(whsec, 'msg_1', ts, b1) })).status, 409, 'phát lại');
    assert.equal((await send(b1, { 'svix-id': 'msg_2', 'svix-timestamp': ts, 'svix-signature': svixSign(`whsec_${Buffer.from('wrong').toString('base64')}`, 'msg_2', ts, b1) })).status, 401);
    const old = String(Math.floor(Date.now() / 1000) - 3600);
    assert.equal((await send(b1, { 'svix-id': 'msg_3', 'svix-timestamp': old, 'svix-signature': svixSign(whsec, 'msg_3', old, b1) })).status, 401, 'quá hạn');
    assert.equal((await call(null, 'POST', `/intake/email/${'x'.repeat(24)}`, b1, { 'svix-id': 'msg_4', 'svix-timestamp': ts, 'svix-signature': 'v1,abc' })).status, 401, 'kênh lạ cùng 401');
    const other = emailEvent('em_2', 'someone-else@in.example.test');
    const ign = await send(other, { 'svix-id': 'msg_5', 'svix-timestamp': ts, 'svix-signature': svixSign(whsec, 'msg_5', ts, other) });
    assert.equal(ign.data.ignored, true);
    // Thân thư thiếu ⇒ lấy qua API (giả)
    const noBody = JSON.stringify({ type: 'email.received', data: { email_id: 'em_3', from: 'x@y.test', to: ['req@in.example.test'], subject: 'Metadata only' } });
    await send(noBody, { 'svix-id': 'msg_6', 'svix-timestamp': ts, 'svix-signature': svixSign(whsec, 'msg_6', ts, noBody) });
    const props = await prisma.workIntakeProposal.findMany({ where: { projectId: pid, source: 'EMAIL' }, orderBy: { id: 'asc' } });
    assert.equal(props.length, 2);
    assert.equal(props[0].title, 'Export is broken');
    assert.equal(props[0].senderUserId, staff.id, 'người gửi là thành viên (khớp email)');
    assert.equal(props[1].body, 'Body fetched from the inbound API');
    assert.equal(await prisma.workIssue.count({ where: { projectId: pid, title: 'Export is broken' } }), 0, 'KHÔNG tạo thẻ thẳng');
  });

  it('3b. Discord (Ed25519) + Zalo OA (sha256): PING/PONG, lệnh ⇒ đề xuất, sai chữ ký 401, phát lại 409; giả lập', async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/intake/channels`, { kind: 'DISCORD', publicKey: 'abc' })).code, 'WORK_INTAKE_BAD_CONFIG');
    const dc = await call(owner, 'POST', `/projects/${pid}/intake/channels`, { kind: 'DISCORD', publicKey: rawPublicKeyHex(publicKey) });
    const dtok = String(dc.data.webhookUrl).split('/').pop();
    const dsend = async (obj: unknown, key = privateKey) => {
      const b = JSON.stringify(obj); const ts = now();
      const res = await fetch(`${base}/api/v1/work/intake/discord/${dtok}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Signature-Ed25519': discordSign(key, ts, b), 'X-Signature-Timestamp': ts }, body: b });
      return { status: res.status, json: (await res.json()) as any };
    };
    assert.deepEqual((await dsend({ type: 1, id: 'p1' })).json, { type: 1 });
    const cmd = { type: 2, id: 'int_1', data: { name: 'ctwork', options: [{ type: 1, name: 'new', options: [{ name: 'title', value: '@everyone Add dark mode' }, { name: 'details', value: 'Settings page' }] }] }, member: { user: { id: '42', username: 'lan' } } };
    const r = await dsend(cmd);
    assert.equal(r.status, 200);
    assert.equal(r.json.type, 4);
    assert.deepEqual(r.json.data.allowed_mentions, { parse: [] });
    assert.equal((await dsend(cmd)).status, 409, 'phát lại cùng interaction');
    const other = crypto.generateKeyPairSync('ed25519').privateKey;
    assert.equal((await dsend({ ...cmd, id: 'int_2' }, other)).status, 401);

    const zc = await call(owner, 'POST', `/projects/${pid}/intake/channels`, { kind: 'ZALO', appId: '1234567', secret: 'oa-secret-key', prefix: '#task' });
    assert.equal(zc.status, 201, JSON.stringify(zc.raw));
    const ztok = String(zc.data.webhookUrl).split('/').pop();
    const zsend = (ev: unknown, secret = 'oa-secret-key') => { const b = JSON.stringify(ev); return call(null, 'POST', `/intake/zalo/${ztok}`, b, { 'X-ZEvent-Signature': `mac=${zaloMac('1234567', b, String((ev as any).timestamp), secret)}` }); };
    const ev = { app_id: '1234567', event_name: 'user_send_text', timestamp: String(Date.now()), sender: { id: 'zu1' }, recipient: { id: 'oa1' }, message: { msg_id: 'zm1', text: '#task Menu overlaps\nOn iPhone 15' } };
    const zr = await zsend(ev);
    assert.equal(zr.status, 200, JSON.stringify(zr.raw));
    assert.ok(zr.data.proposal);
    assert.equal((await zsend(ev)).status, 409);
    assert.equal((await zsend({ ...ev, message: { msg_id: 'zm2', text: 'x' } }, 'wrong')).status, 401);
    assert.equal((await zsend({ ...ev, message: { msg_id: 'zm3', text: 'just chatting' } })).data.ignored, true);

    const sim = await call(owner, 'POST', `/projects/${pid}/intake/channels/${zc.data.id}/simulate`, { title: 'Test from settings' });
    assert.equal(sim.status, 201, JSON.stringify(sim.raw));
    assert.equal(sim.data.simulated, true);
    // Không phải ADMIN chỉ thấy tên/loại/số chờ.
    const lim = await call(staff, 'GET', `/projects/${pid}/intake/channels`);
    assert.equal(lim.data.canConfigure, false);
    assert.equal(lim.data.channels[0].webhookUrl, undefined);
    assert.equal((await call(client, 'GET', `/projects/${pid}/intake/proposals`)).status, 403);
  });

  it('3c. duyệt đề xuất: agent/viewer không duyệt; nhận ⇒ thẻ (người báo = người gửi nếu là thành viên); quyết hai lần ⇒ 409; bỏ', async () => {
    const list = await call(staff, 'GET', `/projects/${pid}/intake/proposals?status=PENDING`);
    assert.equal(list.status, 200);
    assert.equal(list.data.proposals.length, 5);
    const email = list.data.proposals.find((p: any) => p.source === 'EMAIL' && p.title === 'Export is broken');
    assert.equal((await call(bot, 'POST', `/projects/${pid}/intake/proposals/${email.id}/decide`, { decision: 'ACCEPT' })).status, 403);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/intake/proposals/${email.id}/decide`, { decision: 'ACCEPT' })).status, 403);
    const acc = await call(staff, 'POST', `/projects/${pid}/intake/proposals/${email.id}/decide`, { decision: 'ACCEPT', typeKey: 'BUG', assigneeId: owner.id });
    assert.equal(acc.status, 200, JSON.stringify(acc.raw));
    assert.equal(acc.data.status, 'ACCEPTED');
    const i = await issue(acc.data.issue.number);
    assert.equal(i.reporterId, staff.id);
    assert.equal(i.type.key, 'BUG');
    assert.match(i.descriptionText ?? '', /Received via email from Lan/);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/intake/proposals/${email.id}/decide`, { decision: 'REJECT' })).status, 409);
    const dis = list.data.proposals.find((p: any) => p.source === 'DISCORD');
    const rej = await call(staff, 'POST', `/projects/${pid}/intake/proposals/${dis.id}/decide`, { decision: 'REJECT', note: 'Duplicate' });
    assert.equal(rej.data.status, 'REJECTED');
    assert.equal(rej.data.issue, null);
    assert.equal((await call(staff, 'GET', `/projects/${pid}/intake/proposals`)).data.counts.PENDING, 3);
  });

  // ═══ 4. Knowledge base ═════════════════════════════════════════

  it('4. KB: bài từ Docs; khách chỉ thấy bài CLIENT trên trang CLIENT; tìm kiếm, gợi ý, bình chọn, deflection; xem trước chỉ đọc', async () => {
    const mk = async (title: string, markdown: string, visibility: 'CLIENT' | 'INTERNAL') => {
      const r = await call(owner, 'POST', `/projects/${pid}/pages`, { title, markdown, visibility });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      return r.data.number as number;
    };
    const pReset = await mk('Reset your password', 'Open the sign-in page, choose **Forgot password** and enter your email. The reset link expires in 30 minutes.', 'CLIENT');
    const pRunbook = await mk('Database failover runbook', 'Internal: promote the replica, then rotate the password of the app user.', 'INTERNAL');
    const pExport = await mk('Export a CSV report', 'Reports → Export → CSV. Large exports arrive by email.', 'CLIENT');
    const cat = await call(staff, 'POST', `/projects/${pid}/kb/categories`, { name: 'Account' });
    assert.equal(cat.status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/kb/categories`, { name: 'Account' })).status, 409);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/kb/categories`, { name: 'X' })).status, 403);
    assert.equal((await call(client, 'GET', `/projects/${pid}/kb`)).status, 403);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/kb/articles`, { pageNumber: pRunbook, audience: 'CLIENT' })).code, 'WORK_KB_PAGE_INTERNAL');
    const a1 = await call(staff, 'POST', `/projects/${pid}/kb/articles`, { pageNumber: pReset, categoryId: cat.data.id, keywords: 'login password forgot' });
    assert.equal(a1.status, 201, JSON.stringify(a1.raw));
    const a2 = await call(staff, 'POST', `/projects/${pid}/kb/articles`, { pageNumber: pRunbook });
    const a3 = await call(staff, 'POST', `/projects/${pid}/kb/articles`, { pageNumber: pExport, published: false });
    assert.equal((await call(staff, 'POST', `/projects/${pid}/kb/articles`, { pageNumber: pReset })).status, 409);
    const ov = await call(viewer, 'GET', `/projects/${pid}/kb`);
    assert.equal(ov.data.articles.length, 3);
    assert.equal(ov.data.articles.find((a: any) => a.id === a3.data.id).hiddenFromClients, true);

    // Khách: chỉ bài CLIENT đã đăng trên trang CLIENT
    const cb = await call(client, 'GET', `/projects/${pid}/portal/kb`);
    assert.equal(cb.status, 200, JSON.stringify(cb.raw));
    assert.deepEqual(cb.data.articles.map((a: any) => a.id), [a1.data.id]);
    assert.equal(cb.data.articles[0].views, undefined, 'khách không thấy số liệu');
    assert.equal((await call(client, 'GET', `/projects/${pid}/portal/kb/${a2.data.id}`)).status, 404);
    assert.equal((await call(client, 'GET', `/projects/${pid}/portal/kb/${a3.data.id}`)).status, 404);
    assert.equal((await call(client, 'POST', `/projects/${pid}/portal/kb/${a2.data.id}/vote`, { helpful: true })).status, 404);
    // Nhân viên thấy cả bài nội bộ đã đăng
    assert.equal((await call(staff, 'GET', `/projects/${pid}/portal/kb`)).data.articles.length, 2);
    // Xem trước như khách = đúng như khách, chỉ đọc
    const pv = await call(owner, 'GET', `/projects/${pid}/portal/kb?as=client`);
    assert.deepEqual(pv.data.articles.map((a: any) => a.id), [a1.data.id]);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/kb/${a1.data.id}/vote?as=client`, { helpful: true })).code, 'WORK_PREVIEW_READONLY');

    // tìm + gợi ý + bình chọn + deflection
    assert.deepEqual((await call(client, 'GET', `/projects/${pid}/portal/kb?q=forgot%20password`)).data.articles.map((a: any) => a.id), [a1.data.id]);
    const sg = await call(client, 'GET', `/projects/${pid}/portal/kb/suggest?q=${encodeURIComponent('I forgot my password and cannot login')}`);
    assert.deepEqual(sg.data.articles.map((a: any) => a.id), [a1.data.id]);
    assert.deepEqual((await call(client, 'GET', `/projects/${pid}/portal/kb/suggest?q=${encodeURIComponent('replica failover password')}`)).data.articles, [], 'khách không được gợi ý bài nội bộ');
    const read = await call(client, 'GET', `/projects/${pid}/portal/kb/${a1.data.id}`);
    assert.equal(read.status, 200);
    assert.ok(read.data.contentJson);
    assert.equal(read.data.canVote, true);
    await call(client, 'POST', `/projects/${pid}/portal/kb/${a1.data.id}/vote`, { helpful: false });
    await call(client, 'POST', `/projects/${pid}/portal/kb/${a1.data.id}/vote`, { helpful: true });
    await call(staff, 'POST', `/projects/${pid}/portal/kb/${a1.data.id}/vote`, { helpful: true });
    await call(client, 'POST', `/projects/${pid}/portal/kb/${a1.data.id}/deflected`);
    const art = await prisma.workKbArticle.findUniqueOrThrow({ where: { id: a1.data.id } });
    assert.deepEqual([art.helpful, art.notHelpful, art.deflected, art.views], [2, 0, 1, 1]);
    // Trang về Internal ⇒ bài tự ẩn với khách
    await prisma.workPage.updateMany({ where: { projectId: pid, number: pReset }, data: { visibility: 'INTERNAL' } });
    assert.deepEqual((await call(client, 'GET', `/projects/${pid}/portal/kb`)).data.articles, []);
  });
});
