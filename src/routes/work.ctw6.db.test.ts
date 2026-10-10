/**
 * CT Work đợt 6 — chất lượng (RV + TST-1) qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw6.db.test.ts
 *
 *   1. Review/inspection tài liệu: vai, checklist Wiegers, NG ⇒ Bug trong defect log (activity Review, bấm lại không trùng),
 *      luồng trạng thái + điều kiện đóng, số đo, biên bản docx; quyền viewer/người ngoài.
 *   2. Review code (PR) + checklist Java; link PR phải http(s).
 *   3. Baseline: chụp REQ/UC/DOC ⇒ ký (chỉ người được mời) ⇒ khoá ⇒ sửa ⇒ 409 WORK_BASELINED ⇒ CR liệt kê mục + APPROVED
 *      ⇒ sửa được; so sánh với hiện tại (CHANGED, authorized); baseline 2 + volatility.
 *   4. Thiết kế test: EP/BVA ⇒ Xray (thẻ Test + TESTS tới yêu cầu, kỹ thuật/cấp) và ⇒ ma trận 5.1.
 *   5. Giám sát: pass rate vòng, độ phủ, tiêu chí ra theo kế hoạch; TSR md + docx.
 *   6. Kiểm thử theo rủi ro: RISK 4×5 ⇒ CRITICAL/P1, liên kết REQ + TEST.
 *   7. Defect RCA + báo cáo Lab 2.5 docx; 8. exploratory: ghi chú theo thời gian ⇒ Bug.
 *   9. Storage sandbox đang bật (không chạm R2 thật).
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
const tag = `c6q${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt 6: review/inspection, baseline, quản lý test chuyên sâu (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, outsider: U;
  let wsId = 0, pid = 0, key = '';
  let reqNum = 0, reqId = 0, ucNum = 0, pageNum = 0;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1) } });
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
  async function download(u: U, path: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, { headers: { Authorization: `Bearer ${u.token}` } });
    return { status: res.status, type: res.headers.get('content-type'), buf: Buffer.from(await res.arrayBuffer()) };
  }
  const docxText = (buf: Buffer) => [...new AdmZip(buf).readAsText('word/document.xml').matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join(' ').replace(/&amp;/g, '&');
  const ok = (r: { status: number; raw: unknown }, status = 200) => assert.equal(r.status, status, JSON.stringify(r.raw).slice(0, 600));

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, outsider] = await Promise.all(['owner', 'staff', 'viewer', 'outsider'].map((n) => mkUser(n)));
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW6 ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'QLT', name: 'Quality Lab', template: 'SWR302' });
    ok(p, 201);
    pid = p.data.id; key = p.data.key;
    for (const [u, role] of [[staff, 'MEMBER'], [viewer, 'VIEWER']] as const) ok(await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role }));
    ok(await call(owner, 'POST', `/projects/${pid}/tests/enable`));
    // Mẫu SWR302 không có loại Bug ⇒ thêm (như admin dự án thêm trong cài đặt).
    if (!(await prisma.workIssueType.findFirst({ where: { projectId: pid, key: 'BUG' } }))) {
      const wf = (await prisma.workIssueType.findFirst({ where: { projectId: pid, key: 'TEST' }, select: { workflowId: true } }))?.workflowId ?? null;
      await prisma.workIssueType.create({ data: { projectId: pid, key: 'BUG', name: 'Bug', icon: 'bug', color: '#e5484d', workflowId: wf, position: 9 } });
    }
    const req = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'The system shall lock an account after 5 failed logins', typeKey: 'REQUIREMENT' });
    ok(req, 201);
    reqNum = req.data.number; reqId = req.data.id;
    const uc = await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, { name: 'Log in', normalFlow: '1. User enters credentials\n2. System verifies' });
    ok(uc, 201);
    ucNum = uc.data.number;
    pageNum = (await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, templateKey: 'swr-srs' }, select: { number: true } })).number;
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('storage sandbox đang bật khi chạy test DB (không chạm bucket R2 thật)', () => {
    assert.equal(config.r2.sandbox, 'memory');
    assert.equal(config.r2.endpoint, 'https://r2-sandbox.invalid');
  });

  it('review tài liệu: vai, checklist Wiegers, NG ⇒ Bug defect log, luồng + điều kiện đóng, số đo, biên bản', async () => {
    const cl = await call(owner, 'GET', `/projects/${pid}/review-checklists?lang=vi`);
    ok(cl);
    assert.ok(cl.data.some((c: any) => c.key === 'WIEGERS_SRS' && c.items >= 15));
    assert.ok(cl.data.some((c: any) => c.key === 'UT_WHITEBOX'));
    ok(await call(viewer, 'POST', `/projects/${pid}/reviews`, { title: 'x', kind: 'DOC', method: 'INSPECTION', checklistKey: 'WIEGERS_SRS' }), 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/reviews`)).status, 404);
    const c = await call(owner, 'POST', `/projects/${pid}/reviews`, {
      title: 'SRS v1.0 inspection', kind: 'DOC', method: 'INSPECTION', checklistKey: 'WIEGERS_SRS', pageNumber: pageNum, size: 10, language: 'en',
      participants: [{ userId: owner.id, role: 'MODERATOR' }, { userId: staff.id, role: 'AUTHOR' }, { userId: staff.id, role: 'REVIEWER' }],
    });
    ok(c, 201);
    const num = c.data.number;
    assert.equal(c.data.key, 'REV-1');
    assert.equal(c.data.status, 'PLANNING');
    assert.ok(c.data.items.length >= 15);
    assert.match(c.data.workProduct, /^Doc \d+/);
    ok(await call(owner, 'PUT', `/projects/${pid}/reviews/${num}/participants`, { items: [{ userId: outsider.id, role: 'REVIEWER' }] }), 400);
    ok(await call(owner, 'PUT', `/projects/${pid}/reviews/${num}/participants`, { items: [
      { userId: owner.id, role: 'MODERATOR', prepMinutes: 60 }, { userId: staff.id, role: 'AUTHOR', prepMinutes: 0 }, { userId: staff.id, role: 'REVIEWER', prepMinutes: 120 }, { userId: viewer.id, role: 'SCRIBE' },
    ] }));
    const first = c.data.items[0];
    ok(await call(owner, 'POST', `/projects/${pid}/reviews/${num}/items/${first.id}/defect`, {}), 400); // chưa NG
    ok(await call(staff, 'PUT', `/projects/${pid}/reviews/${num}/items`, {
      items: c.data.items.map((i: any, k: number) => (k === 0 ? { id: i.id, result: 'NG', line: '§3.2', note: 'TBD left without owner', severity: 'MAJOR' } : { id: i.id, result: k === 1 ? 'NA' : 'OK' })),
    }));
    const bug = await call(staff, 'POST', `/projects/${pid}/reviews/${num}/items/${first.id}/defect`, {});
    ok(bug, 201);
    assert.equal(bug.data.created, true);
    const again = await call(staff, 'POST', `/projects/${pid}/reviews/${num}/items/${first.id}/defect`, {});
    assert.equal(again.data.created, false);
    assert.equal(again.data.number, bug.data.number);
    const info = await prisma.workDefectInfo.findFirstOrThrow({ where: { projectId: pid, issue: { number: bug.data.number } } });
    assert.equal(info.activity, 'Review');
    assert.equal(info.severity, 'MAJOR');
    assert.equal(info.injectedPhase, 'REQUIREMENT');
    assert.ok(info.reviewSessionId);
    // Sổ defect thống nhất (đợt 4) thấy lỗi review.
    const log = await call(owner, 'GET', `/projects/${pid}/defects`);
    if (log.status === 200) assert.ok(log.data.some((d: any) => d.number === bug.data.number && d.activity === 'Review'));

    ok(await call(owner, 'POST', `/projects/${pid}/reviews/${num}/transition`, { to: 'CLOSED' }), 409);
    ok(await call(owner, 'POST', `/projects/${pid}/reviews/${num}/transition`, { to: 'PREPARATION' }));
    ok(await call(owner, 'POST', `/projects/${pid}/reviews/${num}/transition`, { to: 'MEETING' }));
    const blocked = await call(owner, 'POST', `/projects/${pid}/reviews/${num}/transition`, { to: 'CLOSED' });
    assert.equal(blocked.status, 409);
    assert.equal(blocked.code, 'WORK_REVIEW_NOT_READY');
    ok(await call(owner, 'PATCH', `/projects/${pid}/reviews/${num}`, { meetingMinutes: 60, decision: 'REINSPECT' }));
    assert.equal((await call(owner, 'POST', `/projects/${pid}/reviews/${num}/transition`, { to: 'CLOSED' })).code, 'WORK_REVIEW_REINSPECT');
    ok(await call(owner, 'PATCH', `/projects/${pid}/reviews/${num}`, { decision: 'ACCEPT_WITH_CHANGES' }));
    const closed = await call(owner, 'POST', `/projects/${pid}/reviews/${num}/transition`, { to: 'CLOSED' });
    ok(closed);
    assert.equal(closed.data.status, 'CLOSED');
    assert.equal(closed.data.metrics.defects, 1);
    assert.equal(closed.data.metrics.rate, 10);
    assert.equal(closed.data.metrics.rateTooFast, true);
    assert.equal(closed.data.metrics.density, 0.1);
    assert.equal(closed.data.metrics.participants, 3);
    assert.equal(closed.data.items[0].defect.key, `${key}-${bug.data.number}`);
    ok(await call(owner, 'PATCH', `/projects/${pid}/reviews/${num}`, { size: 3 }), 409);

    const v = await call(viewer, 'GET', `/projects/${pid}/reviews/${num}`);
    ok(v);
    assert.equal(v.data.canEdit, false);
    const list = await call(owner, 'GET', `/projects/${pid}/reviews`);
    assert.equal(list.data[0].defects, 1);

    const doc = await download(owner, `/projects/${pid}/reviews/${num}/export?format=docx&lang=en`);
    assert.equal(doc.status, 200);
    assert.match(doc.type ?? '', /wordprocessingml/);
    const text = docxText(doc.buf);
    assert.match(text, /Review record REV-1/);
    assert.match(text, new RegExp(`${key}-${bug.data.number}`));
    assert.match(text, /Accept with minor changes/);
    const pdf = await download(owner, `/projects/${pid}/reviews/${num}/export?format=pdf&lang=vi`);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.buf.subarray(0, 4).toString(), '%PDF');
  });

  it('review code: link PR phải http(s); checklist Java (LOC)', async () => {
    ok(await call(staff, 'POST', `/projects/${pid}/reviews`, { title: 'PR', kind: 'CODE', method: 'TECHNICAL', checklistKey: 'JAVA_BASIC', prUrl: 'javascript:alert(1)' }), 400);
    const r = await call(staff, 'POST', `/projects/${pid}/reviews`, { title: 'P0071 login PR', kind: 'CODE', method: 'TECHNICAL', checklistKey: 'JAVA_BASIC', prUrl: 'https://github.com/x/y/pull/7', size: 400 });
    ok(r, 201);
    assert.equal(r.data.sizeUnit, 'LOC');
    assert.equal(r.data.participants[0].role, 'MODERATOR');
    const it0 = r.data.items[3];
    ok(await call(staff, 'PUT', `/projects/${pid}/reviews/${r.data.number}/items`, { items: [{ id: it0.id, result: 'NG', line: 'Main.java:42' }], add: [{ section: 'Custom', question: 'Is logging consistent?' }] }));
    const b = await call(staff, 'POST', `/projects/${pid}/reviews/${r.data.number}/items/${it0.id}/defect`, { severity: 'MINOR' });
    ok(b, 201);
    const info = await prisma.workDefectInfo.findFirstOrThrow({ where: { projectId: pid, issue: { number: b.data.number } } });
    assert.equal(info.product, 'Software Package');
    assert.equal(info.injectedPhase, 'CODING');
    const g = await call(staff, 'GET', `/projects/${pid}/reviews/${r.data.number}`);
    assert.equal(g.data.items.at(-1).section, 'Custom');
    assert.equal(g.data.metrics.density, 2.5);
  });

  it('baseline: ký ⇒ khoá ⇒ sửa 409 ⇒ CR APPROVED liệt kê mục ⇒ sửa được; so sánh + volatility', async () => {
    ok(await call(staff, 'POST', `/projects/${pid}/baselines`, { name: 'x', scope: { requirements: false, useCases: false, businessRules: false } }), 400);
    const bl = await call(owner, 'POST', `/projects/${pid}/baselines`, { name: 'Requirements Baseline v1.0', scope: { pageNumbers: [pageNum] }, approverIds: [staff.id] });
    ok(bl, 201);
    assert.equal(bl.data.status, 'PENDING');
    assert.ok(bl.data.counts.REQ >= 1 && bl.data.counts.UC === 1 && bl.data.counts.DOC === 1);
    assert.ok(bl.data.items.some((i: any) => i.kind === 'REQ' && i.refId === reqId));
    const n = bl.data.number;
    ok(await call(owner, 'POST', `/projects/${pid}/baselines/${n}/sign`, { decision: 'APPROVE' }), 403);
    // Chưa khoá ⇒ sửa tự do.
    ok(await call(staff, 'PATCH', `/projects/${pid}/issues/${reqNum}`, { title: 'The system shall lock an account after 5 failed sign-ins' }));
    const signed = await call(staff, 'POST', `/projects/${pid}/baselines/${n}/sign`, { decision: 'APPROVE', comment: 'OK' });
    ok(signed);
    assert.equal(signed.data.status, 'APPROVED');
    assert.equal(signed.data.locked, true);
    assert.equal(signed.data.signoffs[0].hashMatches, true);
    ok(await call(staff, 'POST', `/projects/${pid}/baselines/${n}/sign`, { decision: 'APPROVE' }), 409);

    const locked = await call(staff, 'PATCH', `/projects/${pid}/issues/${reqNum}`, { title: 'Changed after baseline' });
    assert.equal(locked.status, 409);
    assert.equal(locked.code, 'WORK_BASELINED');
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/srs/use-cases/${ucNum}`, { name: 'Sign in' })).code, 'WORK_BASELINED');
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/pages/${pageNum}`, { title: 'SRS edited' })).code, 'WORK_BASELINED');
    // Đổi trường không phải nội dung (ưu tiên) vẫn được.
    ok(await call(staff, 'PATCH', `/projects/${pid}/issues/${reqNum}`, { priority: 2 }));
    const lr = await call(viewer, 'GET', `/projects/${pid}/baselines-locked`);
    assert.ok(lr.data.refs.includes(`REQ:${reqId}`));

    const cr = await prisma.workChangeRequest.create({ data: { projectId: pid, number: 1, title: 'Wording of lockout rule', createdById: owner.id } });
    const imp = await call(staff, 'PUT', `/projects/${pid}/changes/1/affected`, { items: [{ kind: 'REQ', ref: `${key}-${reqNum}` }, { kind: 'UC', ref: `UC-${ucNum}` }] });
    ok(imp);
    assert.equal(imp.data.items.length, 2);
    assert.deepEqual(imp.data.items[0].baselines, [`BL-${n}`]);
    assert.equal(imp.data.changeRequest.unlocksEditing, false);
    ok(await call(staff, 'PUT', `/projects/${pid}/changes/1/affected`, { items: [{ kind: 'BR', ref: 'BR-999' }] }), 404);
    // CR chưa duyệt ⇒ vẫn khoá.
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/issues/${reqNum}`, { title: 'Changed after baseline' })).status, 409);
    await prisma.workChangeRequest.update({ where: { id: cr.id }, data: { status: 'APPROVED' } });
    ok(await call(staff, 'PATCH', `/projects/${pid}/issues/${reqNum}`, { title: 'Changed after baseline' }));
    ok(await call(staff, 'PATCH', `/projects/${pid}/srs/use-cases/${ucNum}`, { name: 'Sign in' }));
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/changes/1/affected`, { items: [] })).status, 409);

    const cmp = await call(owner, 'GET', `/projects/${pid}/baselines/${n}/compare?against=current`);
    ok(cmp);
    const changed = cmp.data.rows.filter((r: any) => r.change === 'CHANGED');
    assert.ok(changed.some((r: any) => r.kind === 'REQ' && r.refId === reqId && r.authorized && r.changeRequests[0].key === 'CR-1'));
    assert.ok(changed.some((r: any) => r.kind === 'UC' && r.authorized));
    const bl2 = await call(owner, 'POST', `/projects/${pid}/baselines`, { name: 'Requirements Baseline v1.1', scope: { pageNumbers: [pageNum] } });
    ok(bl2, 201);
    assert.equal(bl2.data.status, 'DRAFT');
    ok(await call(owner, 'POST', `/projects/${pid}/baselines/${bl2.data.number}/request-signoff`, { approverIds: [owner.id] }));
    ok(await call(owner, 'POST', `/projects/${pid}/baselines/${bl2.data.number}/sign`, { decision: 'APPROVE' }));
    const old = await call(owner, 'GET', `/projects/${pid}/baselines/${n}`);
    assert.equal(old.data.status, 'SUPERSEDED');
    const vol = await call(owner, 'GET', `/projects/${pid}/requirements-volatility`);
    assert.equal(vol.data.length, 2);
    assert.ok(vol.data[1].changed >= 2 && vol.data[1].volatility > 0);
    // BL-2 khoá bản mới ⇒ sửa lại phải có CR mới (CR-1 vẫn APPROVED và liệt kê REQ ⇒ vẫn được).
    ok(await call(staff, 'PATCH', `/projects/${pid}/issues/${reqNum}`, { title: 'Changed again under CR-1' }));
    await prisma.workChangeRequest.update({ where: { id: cr.id }, data: { status: 'IMPLEMENTED' } });
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/issues/${reqNum}`, { title: 'No CR now' })).status, 409);
    // Gỡ khoá cho các bước sau.
    await prisma.workBaseline.updateMany({ where: { projectId: pid }, data: { locked: false } });
  });

  it('thiết kế test: EP/BVA ⇒ Xray (TESTS tới yêu cầu) và ⇒ ma trận 5.1', async () => {
    const input = { fields: [{ name: 'age', kind: 'number', min: 18, max: 60 }, { name: 'role', kind: 'enum', values: ['admin', 'user'] }], validOutcome: 'Saved' };
    const pv = await call(staff, 'POST', `/projects/${pid}/test-designs/preview`, { technique: 'EP_BVA', input });
    ok(pv);
    assert.ok(pv.data.cases.length >= 8);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/test-designs/preview`, { technique: 'EP_BVA', input: { fields: [{ name: 'x', kind: 'number', min: 9, max: 1 }] } })).code, 'WORK_DESIGN_INVALID');
    const d = await call(staff, 'POST', `/projects/${pid}/test-designs`, { name: 'Register age', technique: 'EP_BVA', requirementKey: `${key}-${reqNum}`, input });
    ok(d, 201);
    assert.equal(d.data.key, 'TD-1');
    const pick = d.data.cases.slice(0, 3).map((c: any) => c.id);
    const x = await call(staff, 'POST', `/projects/${pid}/test-designs/1/export`, { target: 'XRAY', caseIds: pick, level: 'SYSTEM', testType: 'FUNCTIONAL' });
    ok(x, 201);
    assert.equal(x.data.numbers.length, 3);
    const attrs = await call(staff, 'GET', `/projects/${pid}/tests-attributes`);
    const made = attrs.data.filter((a: any) => x.data.numbers.includes(a.number));
    assert.ok(made.every((a: any) => a.technique === 'EP/BVA' && a.level === 'SYSTEM'));
    const links = await prisma.workIssueLink.count({ where: { type: 'TESTS', toIssue: { projectId: pid, number: reqNum }, fromIssue: { number: { in: x.data.numbers } } } });
    assert.equal(links, 3);
    const t = await call(staff, 'GET', `/projects/${pid}/tests/${x.data.numbers[1]}`);
    assert.match(JSON.stringify(t.data), /age = /);
    const u = await call(staff, 'POST', `/projects/${pid}/test-designs/1/export`, { target: 'UNIT', moduleName: 'Register', methodName: 'validateAge' });
    ok(u, 201);
    const fn = await prisma.workUnitFunction.findFirstOrThrow({ where: { id: u.data.functionId }, include: { cases: true, rows: true } });
    assert.equal(fn.cases.length, d.data.cases.length);
    assert.ok(fn.rows.some((r) => r.section === 'CONFIRM' && r.groupName === 'Exception'));
    const again = await call(staff, 'GET', `/projects/${pid}/test-designs/1`);
    assert.equal(again.data.exported.length, 2);
    ok(await call(viewer, 'POST', `/projects/${pid}/test-designs`, { name: 'v', technique: 'PAIRWISE', input: { parameters: [{ name: 'a', values: ['1'] }, { name: 'b', values: ['2'] }] } }), 403);
    ok(await call(staff, 'POST', `/projects/${pid}/test-designs`, { name: 'Order states', technique: 'STATE_TRANSITION', input: { states: ['New', 'Paid'], initial: 'New', transitions: [{ from: 'New', event: 'pay', to: 'Paid' }] } }), 201);
  });

  it('giám sát: pass rate theo vòng, độ phủ, tiêu chí ra theo kế hoạch, TSR md + docx; ước lượng', async () => {
    const tests = (await call(staff, 'GET', `/projects/${pid}/tests-attributes`)).data.map((a: any) => a.number).slice(0, 2);
    const plan = await call(owner, 'POST', `/projects/${pid}/test-plans`, { name: 'Release 1', numbers: tests });
    ok(plan, 201);
    const planId = plan.data.id;
    ok(await call(owner, 'PUT', `/projects/${pid}/test-plans/${planId}/settings`, { scopeIn: 'Registration', environment: 'Chrome 129', criteria: { passRate: 50, maxOpenMajor: 5 }, estimation: { executePerDay: 20 } }));
    const cyc = await call(owner, 'POST', `/projects/${pid}/test-cycles`, { name: 'Round 1', planId });
    ok(cyc, 201);
    const cycle = await call(owner, 'GET', `/projects/${pid}/test-cycles/${cyc.data.id}`);
    const runs = cycle.data.runs ?? cycle.data.cycle?.runs;
    assert.equal(runs.length, 2);
    ok(await call(staff, 'PATCH', `/projects/${pid}/test-runs/${runs[0].id}`, { status: 'PASS' }));
    ok(await call(staff, 'PATCH', `/projects/${pid}/test-runs/${runs[1].id}`, { status: 'FAIL' }));
    const qd = await call(owner, 'GET', `/projects/${pid}/test-quality?planId=${planId}`);
    ok(qd);
    assert.equal(qd.data.cycles[0].passRate, 50);
    assert.equal(qd.data.cycles[0].progress, 100);
    assert.ok(qd.data.coverage.requirements >= 1 && qd.data.coverage.covered >= 1);
    assert.equal(qd.data.exit.rows.find((r: any) => r.key === 'passRate').met, true);
    assert.equal(qd.data.estimation.testCases, 2);
    assert.equal(qd.data.estimation.params.executePerDay, 20);
    assert.ok(qd.data.defects.total >= 2);
    assert.ok(qd.data.levels.some((l: any) => l.level === 'SYSTEM'));
    assert.ok(qd.data.sCurve.points.length >= 1);
    const md = await call(owner, 'GET', `/projects/${pid}/test-summary-report?planId=${planId}&lang=en`);
    ok(md);
    assert.match(md.data.markdown, /Test Summary Report/);
    assert.match(md.data.markdown, /Chrome 129/);
    assert.match(md.data.markdown, /\| 1 \| Round 1 \| 2 \| 2 \| 1 \| 1 \| 0 \| 50%/);
    const docx = await download(owner, `/projects/${pid}/test-summary-report?planId=${planId}&format=docx&lang=vi`);
    assert.equal(docx.status, 200);
    assert.match(docxText(docx.buf), /Báo cáo tổng kết kiểm thử/);
    ok(await call(viewer, 'GET', `/projects/${pid}/test-quality`));
    ok(await call(viewer, 'PUT', `/projects/${pid}/test-plans/${planId}/settings`, { scopeIn: 'x' }), 403);
  });

  it('kiểm thử theo rủi ro: 4×5 ⇒ CRITICAL/P1, liên kết REQ + TEST', async () => {
    const t = (await call(staff, 'GET', `/projects/${pid}/tests-attributes`)).data[0].number;
    const r = await call(staff, 'POST', `/projects/${pid}/test-risks`, { title: 'Account lockout bypass', likelihood: 4, impact: 5, issueNumbers: [reqNum, t] });
    ok(r, 201);
    const row = r.data.rows.find((x: any) => x.title === 'Account lockout bypass');
    assert.equal(row.level, 'CRITICAL');
    assert.equal(row.policy.priority, 'P1');
    assert.equal(row.riskKind, 'PRODUCT');
    assert.equal(row.tests.length, 1);
    assert.equal(row.requirements[0].number, reqNum);
    assert.equal(r.data.grid[1][4].length, 1); // khả năng 4 (hàng 2 từ trên), tác động 5
    const upd = await call(staff, 'POST', `/projects/${pid}/test-risks`, { number: row.number, likelihood: 1, impact: 2 });
    assert.equal(upd.data.rows.find((x: any) => x.number === row.number).level, 'LOW');
    ok(await call(staff, 'POST', `/projects/${pid}/test-risks`, { issueNumbers: [99999], title: 'bad' }), 400);
  });

  it('defect RCA + báo cáo lỗi theo thành viên (Lab 2.5); exploratory ⇒ Bug', async () => {
    const defects = await call(staff, 'GET', `/projects/${pid}/test-defects`);
    const b = defects.data[0];
    const s = await call(staff, 'PUT', `/projects/${pid}/test-defects/${b.number}`, { rootCause: 'REQUIREMENT', injectedPhase: 'REQUIREMENT', detectedByTool: 'Selenium IDE', testLevel: 'SYSTEM', fixNote: 'Fixed in commit abc' });
    ok(s);
    assert.equal(s.data.find((x: any) => x.number === b.number).detectedByTool, 'Selenium IDE');
    ok(await call(staff, 'PUT', `/projects/${pid}/test-defects/${reqNum}`, { rootCause: 'CODING' }), 400);
    const rep = await download(owner, `/projects/${pid}/test-defects-report?format=docx&lang=en`);
    assert.equal(rep.status, 200);
    assert.match(docxText(rep.buf), /Selenium IDE/);

    const e = await call(staff, 'POST', `/projects/${pid}/exploratory`, { charter: 'Explore registration with boundary ages to discover validation gaps', timeboxMin: 30 });
    ok(e, 201);
    assert.equal(e.data.key, 'EXP-1');
    ok(await call(staff, 'POST', `/projects/${pid}/exploratory/1/notes`, { kind: 'NOTE', text: 'x' }), 409);
    ok(await call(staff, 'POST', `/projects/${pid}/exploratory/1/start`));
    ok(await call(staff, 'POST', `/projects/${pid}/exploratory/1/notes`, { kind: 'NOTE', text: 'Age 17 accepted on mobile layout' }), 201);
    const bug = await call(staff, 'POST', `/projects/${pid}/exploratory/1/notes`, { kind: 'BUG', text: 'Age field accepts 999', severity: 'MAJOR' });
    ok(bug, 201);
    assert.equal(bug.data.bugs, 1);
    assert.match(bug.data.notes[1].bugKey, new RegExp(`^${key}-\\d+$`));
    const di = await prisma.workDefectInfo.findFirstOrThrow({ where: { projectId: pid, issue: { number: bug.data.notes[1].bugNumber } } });
    assert.equal(di.detectedByTool, 'Exploratory testing');
    const stop = await call(staff, 'POST', `/projects/${pid}/exploratory/1/stop`);
    assert.equal(stop.data.status, 'DONE');
    assert.equal(stop.data.counts.NOTE, 1);
    const md = await call(owner, 'GET', `/projects/${pid}/test-summary-report?lang=en`);
    assert.match(md.data.markdown, /Exploratory testing: 1 session/);
  });
});
