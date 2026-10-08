/**
 * CTW đợt 3A — tài liệu qua HTTP thật trên Postgres cục bộ (kho ảnh GIẢ qua `_setImageStoreForTests`, không chạm R2):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.docs3a.db.test.ts
 *   (CTW3_OUT=<thư mục> ⇒ lưu tệp .docx/.pdf xuất ra để soát bằng python-docx.)
 *
 *   1. Mẫu dự án CAPSTONE: 6 giai đoạn, Iteration 1–3, 8 trang Docs (gốc + Report 1→7 gắn giai đoạn), 8 epic, mô-đun bật.
 *   2. Ảnh: tải lên (PNG thật), đọc lại đúng byte, trùng nội dung ⇒ cùng id, tệp rác/SVG ⇒ 400, người ngoài 404, VIEWER không tải lên.
 *   3. Record of Changes từ lịch sử phiên bản; "Fill from project data" điền Team (Report 1) + Risks/Schedule/RACI (Report 2).
 *   4. Xuất .docx + PDF (ảnh của dự án + sơ đồ Mermaid client vẽ sẵn); VIEWER xuất được, không điền được; người ngoài 404.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import JSZip from 'jszip';
import sharp from 'sharp';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `d3a${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt 3A: tài liệu (ảnh · xuất docx/PDF · Record of Changes · mẫu Capstone)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, teacher: U, viewer: U, outsider: U;
  let wsId = 0, pid = 0;
  const blobs = new Map<string, Buffer>();
  let pages: Array<{ number: number; title: string; templateKey: string | null; stageId: number | null }> = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, fullName: name[0].toUpperCase() + name.slice(1) } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, p: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${p}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function raw(u: U, method: string, p: string, body?: Buffer | string, type = 'application/json') {
    const res = await fetch(`${base}/api/v1/work${p}`, { method, headers: { 'Content-Type': type, Authorization: `Bearer ${u.token}` }, body: body === undefined ? undefined : typeof body === 'string' ? body : new Uint8Array(body) });
    return { status: res.status, type: res.headers.get('content-type'), disposition: res.headers.get('content-disposition'), buf: Buffer.from(await res.arrayBuffer()) };
  }
  const png = (w: number, h: number, r = 30) => sharp({ create: { width: w, height: h, channels: 3, background: { r, g: 110, b: 190 } } }).png().toBuffer();
  const pageOf = (key: string) => pages.find((p) => p.templateKey === key)!;
  const tablesOf = (doc: any) => (doc.content ?? []).filter((b: any) => b.type === 'table').map((t: any) => t.content.map((r: any) => r.content.map((c: any) => (c.content ?? []).map((pp: any) => (pp.content ?? []).map((x: any) => x.text ?? '').join('')).join(''))));

  before(async () => {
    (await import('../services/work/docs3a.service.js'))._setImageStoreForTests({
      put: async (key, body) => { blobs.set(key, body); },
      read: async (key) => { const b = blobs.get(key); if (!b) throw new Error('missing'); return b; },
    });
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, teacher, viewer, outsider] = await Promise.all(['owner', 'staff', 'teacher', 'viewer', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/docs3a.service.js'))._setImageStoreForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('mẫu CAPSTONE: giai đoạn Report 1→7, Iteration 1–3, trang Docs FPT, epic, mô-đun bật', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `Capstone ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, teacher.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'LAB', name: 'LabFlow AI', template: 'CAPSTONE', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const m of ['stages', 'approvals', 'docs', 'raid', 'meetings', 'resources']) assert.equal(p.data.modules[m], true, m);
    assert.equal(p.data.kind, 'SCHOOL');
    const stages = await prisma.workStage.findMany({ where: { projectId: pid }, orderBy: { n: 'asc' } });
    assert.deepEqual(stages.map((s) => s.name), [
      'Stage 1: Project Initiating (week 1)', 'Stage 2: Project Planning & Initial Requirements (weeks 2-3)', 'Stage 3: Software Design (weeks 4-5)',
      'Stage 4: Implementation (weeks 6-11)', 'Stage 5: Verification & Validation (weeks 12-13)', 'Stage 6: Closing (week 14)',
    ]);
    const sprints = await prisma.workSprint.findMany({ where: { projectId: pid }, orderBy: { position: 'asc' } });
    assert.deepEqual(sprints.map((s) => s.name), ['Iteration 1 (weeks 6-7)', 'Iteration 2 (weeks 8-9)', 'Iteration 3 (weeks 10-11)']);
    pages = await prisma.workPage.findMany({ where: { projectId: pid }, orderBy: { number: 'asc' }, select: { number: true, title: true, templateKey: true, stageId: true } });
    assert.equal(pages.length, 8);
    assert.equal(pages[0].title, 'Capstone documents (FPT)');
    assert.deepEqual(pages.slice(1).map((x) => x.title), [
      'Report 1 – Project Introduction', 'Report 3 – Software Requirement Specification', 'Report 2 – Project Management Plan',
      'Report 4 – Software Design Specification', 'Report 5 – Software Test Documentation', 'Report 6 – Software User Guides', 'Report 7 – Final Project Report',
    ]);
    const stageOf = (key: string) => stages.find((s) => s.id === pageOf(key).stageId)?.n;
    assert.deepEqual([stageOf('fpt-report1-project-introduction'), stageOf('fpt-report2-project-management-plan'), stageOf('fpt-report7-final-report')], [1, 2, 6]);
    const epics = await prisma.workIssue.findMany({ where: { projectId: pid, type: { key: 'EPIC' } }, orderBy: { number: 'asc' }, select: { title: true, stageId: true } });
    assert.equal(epics.length, 8);
    assert.ok(epics.every((e) => e.stageId));
    const types = await prisma.workIssueType.findMany({ where: { projectId: pid }, select: { key: true } });
    for (const k of ['REQUIREMENT', 'TEST', 'BUG', 'EPIC']) assert.ok(types.some((t) => t.key === k), k);
    // Trang gốc trỏ đúng tới từng Report.
    const root = await call(owner, 'GET', `/projects/${pid}/pages/${pages[0].number}`);
    assert.ok(JSON.stringify(root.data.contentJson).includes(`/work/`), 'có link tới trang Report');
    // Vai: staff MEMBER, giảng viên TEACHER, viewer VIEWER.
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${staff.id}`, { role: 'MEMBER' })).status, 200);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${teacher.id}`, { role: 'TEACHER' })).status, 200);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' })).status, 200);
  });

  let imgUrl = '';
  it('ảnh: tải lên, đọc lại, trùng ⇒ cùng id; tệp rác/SVG ⇒ 400; người ngoài 404; VIEWER không tải lên', async () => {
    const buf = await png(1200, 600);
    const up = await raw(staff, 'POST', `/projects/${pid}/images?name=context%20diagram.png`, buf, 'image/png');
    assert.equal(up.status, 201, up.buf.toString());
    const data = JSON.parse(up.buf.toString()).data;
    assert.match(data.url, new RegExp(`^/api/v1/work/projects/${pid}/images/\\d+$`));
    assert.deepEqual([data.width, data.height], [1200, 600]);
    imgUrl = data.url;
    const again = JSON.parse((await raw(owner, 'POST', `/projects/${pid}/images`, buf, 'application/octet-stream')).buf.toString()).data;
    assert.equal(again.id, data.id, 'cùng nội dung ⇒ dùng lại');
    const get = await raw(viewer, 'GET', imgUrl.replace('/api/v1/work', ''));
    assert.equal(get.status, 200);
    assert.equal(get.type, 'image/png');
    assert.ok(get.buf.equals(buf));
    assert.equal((await raw(outsider, 'GET', imgUrl.replace('/api/v1/work', ''))).status, 404);
    assert.equal((await raw(staff, 'POST', `/projects/${pid}/images`, Buffer.from('not an image'), 'image/png')).status, 400);
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script></svg>');
    assert.equal((await raw(staff, 'POST', `/projects/${pid}/images`, svg, 'image/svg+xml')).status, 400);
    assert.equal((await raw(viewer, 'POST', `/projects/${pid}/images`, await png(10, 10, 99), 'image/png')).status, 403);
    assert.equal((await raw(outsider, 'POST', `/projects/${pid}/images`, await png(10, 10, 98), 'image/png')).status, 404);
    // C26: chèn ẢNH vào mô tả thẻ (chữ không đổi) phải được lưu — trước đây so sánh theo chữ nên bị bỏ qua.
    const epic = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, title: { startsWith: 'Report 4' } } });
    const desc = { ...(epic.descriptionJson as any), content: [...(epic.descriptionJson as any).content, { type: 'image', attrs: { src: imgUrl, alt: 'class diagram' } }] };
    const up2 = await call(staff, 'PATCH', `/projects/${pid}/issues/${epic.number}`, { descriptionJson: desc });
    assert.equal(up2.status, 200, JSON.stringify(up2.raw));
    assert.ok(JSON.stringify((await prisma.workIssue.findUniqueOrThrow({ where: { id: epic.id } })).descriptionJson).includes(imgUrl));
    // Bình luận có ảnh.
    const cm = await call(staff, 'POST', `/projects/${pid}/issues/${epic.number}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bug screenshot' }] }, { type: 'image', attrs: { src: imgUrl, alt: null } }] } });
    assert.equal(cm.status, 201, JSON.stringify(cm.raw));
  });

  it('Record of Changes từ lịch sử + "Fill from project data" (Report 1 Team, Report 2 Risks/Schedule/RACI)', async () => {
    const r2 = pageOf('fpt-report2-project-management-plan');
    // Một rủi ro trong RAID, một version, ước lượng giờ trên epic Report 1.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: 'Requirement churn', description: 'Scope changes late', probability: 3, impact: 5, mitigation: 'Freeze SRS v1.0 with supervisor sign-off' })).status, 201);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/versions`, { name: 'Software Package v1', releaseDate: '2026-11-20' })).status, 201);
    const epic = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, title: { startsWith: 'Report 1' } } });
    await prisma.workIssue.update({ where: { id: epic.id }, data: { originalEstimateMin: 7 * 8 * 60, dueDate: new Date('2026-10-12') } });

    // Một bản sửa có ghi chú ⇒ dòng thứ hai của Record of Changes.
    const cur = await call(staff, 'GET', `/projects/${pid}/pages/${r2.number}`);
    const doc = cur.data.contentJson;
    doc.content.push({ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '6. Appendix' }] }, { type: 'image', attrs: { src: imgUrl, alt: 'Figure 1. WBS' } });
    const saved = await call(staff, 'PATCH', `/projects/${pid}/pages/${r2.number}`, { contentJson: doc, version: cur.data.version, versionNote: 'Added WBS appendix' });
    assert.equal(saved.status, 200, JSON.stringify(saved.raw));
    const roc = await call(viewer, 'GET', `/projects/${pid}/pages/${r2.number}/record-of-changes`);
    assert.equal(roc.status, 200);
    assert.deepEqual(roc.data.map((r: any) => [r.action, r.inCharge]), [['A', 'Owner'], ['A', 'Staff']]);
    assert.equal(roc.data[1].description, 'Added WBS appendix');

    assert.equal((await call(viewer, 'POST', `/projects/${pid}/pages/${r2.number}/autofill`, {})).status, 403);
    const fill = await call(staff, 'POST', `/projects/${pid}/pages/${r2.number}/autofill`, { version: saved.data.version });
    assert.equal(fill.status, 200, JSON.stringify(fill.raw));
    assert.deepEqual(fill.data.filled, ['recordOfChanges', 'risks', 'schedule', 'raci']);
    const t = tablesOf(fill.data.page.contentJson);
    assert.deepEqual(t[0].slice(1).map((r: string[]) => r.slice(1, 3)), [['A', 'Owner'], ['A', 'Staff']]);
    assert.deepEqual(t[1][1], ['1', 'Stage 1: Project Initiating (week 1)', '7', '12/10/2026']);
    assert.ok(t[1].some((r: string[]) => r[1] === 'Software Package v1' && r[3] === '20/11/2026'));
    assert.deepEqual(t[3][1], ['1', 'Requirement churn — Scope changes late', 'High', 'Medium', 'Freeze SRS v1.0 with supervisor sign-off']);
    const raci = t.find((x: string[][]) => x[0][0] === 'Work Package');
    assert.deepEqual(raci[0], ['Work Package', 'Owner', 'Staff'], 'chỉ người làm (không giảng viên, không VIEWER)');
    const versions = await call(staff, 'GET', `/projects/${pid}/pages/${r2.number}/versions`);
    assert.ok(JSON.stringify(versions.data).includes('Filled from project data'));

    const r1 = pageOf('fpt-report1-project-introduction');
    const f1 = await call(owner, 'POST', `/projects/${pid}/pages/${r1.number}/autofill`, { sections: ['team'] });
    assert.deepEqual(f1.data.filled, ['team']);
    const team = tablesOf(f1.data.page.contentJson).find((x: string[][]) => x[0][0] === 'Full Name');
    assert.deepEqual(team.slice(1).map((r: string[]) => r.slice(0, 2)), [['Owner', 'Leader'], ['Staff', 'Member'], ['Teacher', 'Lecturer']]);
  });

  it('xuất .docx + PDF: đề mục, bảng, ảnh dự án, sơ đồ Mermaid; VIEWER xuất được; người ngoài 404', async () => {
    const r2 = pageOf('fpt-report2-project-management-plan');
    const diagram = `data:image/png;base64,${(await png(500, 300, 200)).toString('base64')}`;
    const cur = await call(staff, 'GET', `/projects/${pid}/pages/${r2.number}`);
    const doc = cur.data.contentJson;
    doc.content.push({ type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: 'graph TD; A-->B' }] });
    await call(staff, 'PATCH', `/projects/${pid}/pages/${r2.number}`, { contentJson: doc, version: cur.data.version });

    const dx = await raw(viewer, 'POST', `/projects/${pid}/pages/${r2.number}/export`, JSON.stringify({ format: 'docx', diagrams: [diagram] }));
    assert.equal(dx.status, 200, dx.buf.toString().slice(0, 300));
    assert.equal(dx.type, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    assert.match(dx.disposition ?? '', /LAB_Report_2_Project_Management_Plan\.docx/);
    const zip = await JSZip.loadAsync(dx.buf);
    const xml = await zip.file('word/document.xml')!.async('string');
    for (const h of ['I. Record of Changes', '1.3 Project Risks', 'Requirement churn — Scope changes late', '6. Appendix', 'Figure 1. WBS', 'CAPSTONE PROJECT REPORT']) assert.ok(xml.includes(h), h);
    assert.equal((xml.match(/<w:drawing>/g) ?? []).length, 2, 'ảnh dự án + sơ đồ Mermaid');
    assert.ok(!xml.includes('Guide:'));

    const pdf = await raw(staff, 'POST', `/projects/${pid}/pages/${r2.number}/export`, JSON.stringify({ format: 'pdf', diagrams: [diagram] }));
    assert.equal(pdf.status, 200);
    assert.equal(pdf.type, 'application/pdf');
    assert.equal(pdf.buf.subarray(0, 5).toString(), '%PDF-');

    if (process.env.CTW3_OUT) {
      fs.mkdirSync(process.env.CTW3_OUT, { recursive: true });
      fs.writeFileSync(path.join(process.env.CTW3_OUT, 'LAB_Report_2_Project_Management_Plan.docx'), dx.buf);
      fs.writeFileSync(path.join(process.env.CTW3_OUT, 'LAB_Report_2_Project_Management_Plan.pdf'), pdf.buf);
      for (const key of ['fpt-report1-project-introduction', 'fpt-report3-srs', 'fpt-report4-sds', 'fpt-report5-test-documentation', 'fpt-report6-user-guides', 'fpt-report7-final-report']) {
        const out = await raw(owner, 'POST', `/projects/${pid}/pages/${pageOf(key).number}/export`, JSON.stringify({ format: 'docx' }));
        assert.equal(out.status, 200);
        fs.writeFileSync(path.join(process.env.CTW3_OUT, `${key}.docx`), out.buf);
      }
    }

    assert.equal((await raw(outsider, 'POST', `/projects/${pid}/pages/${r2.number}/export`, JSON.stringify({ format: 'docx' }))).status, 404);
    assert.equal((await raw(staff, 'POST', `/projects/${pid}/pages/${r2.number}/export`, JSON.stringify({ format: 'odt' }))).status, 400);
  });
});
