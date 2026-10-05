/**
 * CT Work đợt S6 — Spec Fidelity + nguồn gốc AI, qua HTTP thật trên Postgres cục bộ (LLM GIẢ qua `_setSpecAskForTests`):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.s6.db.test.ts
 *
 *   1. Chấm trang SRS mơ hồ ⇒ phát hiện đúng chiều + điểm; LLM giả bổ sung nhận xét ngữ nghĩa (trích dẫn bịa bị bỏ); LLM
 *      lỗi ⇒ vẫn trả phần xác định + semantic UNAVAILABLE. Áp dụng gợi ý ⇒ phiên bản MANUAL mới; chấm lại ⇒ điểm TĂNG;
 *      áp dụng hai lần ⇒ 409. Lịch sử theo trang.
 *   2. Chấm tập thẻ STORY: thiếu AC / thiếu test (traceability THẬT) ⇒ thêm test + AC ⇒ điểm verifiability tăng.
 *   3. Cổng giai đoạn `dac-ta-yeu-cau`: chưa chấm ⇒ 409 WORK_SPEC_GATE; dưới ngưỡng ⇒ 409; MEMBER không ghi đè được;
 *      ADMIN ghi đè cần lý do + audit; đủ ngưỡng ⇒ qua và phê duyệt đính kèm lần chấm.
 *   4. Nguồn gốc AI: AI Apply sửa mô tả ⇒ AI-assisted + lịch sử (model, người); commit có trailer Co-Authored-By ⇒
 *      AI-assisted; gắn tay. Luật duyệt độc lập (mặc định TẮT): bật ⇒ Done bị chặn, người tạo tự duyệt vẫn chặn, người
 *      khác duyệt ⇒ qua.
 *   5. Quyền: khách/VIEWER không chạy được; MEMBER không đổi cấu hình cổng.
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
const tag = `s6${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt S6: Spec Fidelity + nguồn gốc AI (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, staff2: U, viewer: U, client: U;
  let wsId = 0, pid = 0, cfg: any;
  let srsNum = 0, specStage = 0;
  let fakeReplies: Array<string | Error> = [];
  const prompts: string[] = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
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
  const P = (t: string) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
  const H = (t: string) => ({ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: t }] });
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
  const statusId = (name: string) => cfg.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.name === name).id;

  before(async () => {
    (await import('../services/work/specReview.service.js'))._setSpecAskForTests(async (system, user) => {
      prompts.push(`${system}\n---\n${user}`);
      const next = fakeReplies.shift() ?? '{"findings":[]}';
      if (next instanceof Error) throw next;
      return next;
    });
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, staff2, viewer, client] = await Promise.all(['owner', 'staff', 'staff2', 'viewer', 'client'].map(mkUser));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/specReview.service.js'))._setSpecAskForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT (docs + stages + approvals), test bật, giai đoạn dac-ta-yeu-cau, SRS mơ hồ', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `S6 ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, staff2.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SPC', name: 'Spec shop', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    await call(owner, 'POST', `/projects/${pid}/tests/enable`, {});
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    specStage = (await call(owner, 'POST', `/projects/${pid}/stages`, { slug: 'dac-ta-yeu-cau', name: 'Requirements spec' })).data.id;
    assert.equal((await call(owner, 'POST', `/projects/${pid}/stages/${specStage}/activate`, {})).status, 200);
    const page = await call(staff, 'POST', `/projects/${pid}/pages`, {
      title: 'SRS — Spec shop', stageId: specStage,
      contentJson: { type: 'doc', content: [
        H('Purpose'), P('Online shop for students.'),
        H('Functional requirements'),
        P('FR-01 The product list should be fast and user-friendly.'),
        P('FR-02 The cart keeps items for 7 days, etc.'),
        P('FR-03 Phí giao hàng tuỳ khu vực.'),
        H('Non-functional requirements'), P('NFR-01 The site shall be available 99.5% of each month.'),
      ] },
    });
    assert.equal(page.status, 201, JSON.stringify(page.raw));
    srsNum = page.data.number;
  });

  it('quyền: VIEWER/khách không chạy được; người ngoài 404', async () => {
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/spec-reviews/page/${srsNum}`, {})).status, 403);
    assert.equal((await call(client, 'POST', `/projects/${pid}/spec-reviews/page/${srsNum}`, {})).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/spec-reviews`)).status, 200, 'VIEWER đọc được lịch sử');
  });

  let firstReview: any;
  it('chấm trang: phát hiện từ mơ hồ VI+EN, thiếu mục, không failure mode; AI bổ sung (trích dẫn bịa bị bỏ)', async () => {
    fakeReplies = [JSON.stringify({ findings: [
      { dimension: 'consistency', severity: 'high', ref: 'FR-02', excerpt: 'keeps items for 7 days', why: 'Conflicts with the retention policy elsewhere.', suggestion: 'Pick one number.', rewrite: null },
      { dimension: 'completeness', severity: 'high', ref: 'FR-99', excerpt: 'x', why: 'invented ref' },
      { dimension: 'unambiguity', severity: 'low', ref: 'FR-01', excerpt: 'NOT IN TEXT', why: 'invented quote' },
    ] })];
    const r = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${srsNum}`, {});
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    firstReview = r.data;
    assert.equal(r.data.scope, 'PAGE');
    assert.equal(r.data.semantic, 'OK');
    assert.equal(r.data.stageId, specStage, 'lần chấm trang gắn giai đoạn của trang');
    assert.ok(prompts.at(-1)!.includes('[FR-01]'));
    const rules = r.data.findings.map((f: any) => `${f.ref}:${f.rule}`);
    for (const want of ['FR-01:vague_term', 'FR-01:unmeasurable', 'FR-02:vague_term', 'FR-03:vague_term', 'Document:missing_section', 'Document:no_failure_modes']) {
      assert.ok(rules.includes(want), `thiếu ${want} trong ${rules.join(', ')}`);
    }
    const ai = r.data.findings.filter((f: any) => f.source === 'ai');
    assert.equal(ai.length, 1, 'chỉ giữ nhận xét AI có ref + trích dẫn THẬT');
    assert.equal(ai[0].dimension, 'consistency');
    assert.ok(r.data.overall < 70, `overall ${r.data.overall}`);
    assert.ok(r.data.untraced.length >= 3, 'câu yêu cầu không nhắc thẻ nào ⇒ chưa truy được test');
    for (const d of ['completeness', 'consistency', 'unambiguity', 'verifiability']) assert.ok(r.data[d] >= 0 && r.data[d] <= 100);
  });

  it('LLM lỗi ⇒ vẫn có phần xác định + semantic UNAVAILABLE', async () => {
    fakeReplies = [new Error('gateway down')];
    const r = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${srsNum}`, {});
    assert.equal(r.status, 201);
    assert.equal(r.data.semantic, 'UNAVAILABLE');
    assert.match(r.data.stats.semanticReason, /unavailable/i);
    assert.ok(r.data.findings.length > 0 && r.data.findings.every((f: any) => f.source === 'rule'));
    const skipped = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${srsNum}`, { semantic: false });
    assert.equal(skipped.data.semantic, 'SKIPPED');
  });

  it('cổng: chưa đủ ngưỡng ⇒ 409; MEMBER không ghi đè; MEMBER không đổi cấu hình; ADMIN ghi đè cần lý do + audit', async () => {
    // Mặc định TẮT ⇒ chưa chặn gì: kiểm trạng thái.
    const off = await call(staff, 'GET', `/projects/${pid}/stages/${specStage}/spec-gate`);
    assert.equal(off.data.applies, false);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/spec-settings`, { specGate: { enabled: true } })).status, 403);
    const on = await call(owner, 'PUT', `/projects/${pid}/spec-settings`, { specGate: { enabled: true } });
    assert.equal(on.status, 200);
    assert.deepEqual(on.data.specGate, { enabled: true, stageIds: [], minOverall: 70, minDimension: 50 });
    const st = await call(staff, 'GET', `/projects/${pid}/stages/${specStage}/spec-gate`);
    assert.equal(st.data.applies, true);
    assert.equal(st.data.pass, false);
    const blocked = await call(staff, 'POST', `/projects/${pid}/stages/${specStage}/request-gate`, {});
    assert.equal(blocked.status, 409);
    assert.equal(blocked.code, 'WORK_SPEC_GATE');
    assert.ok(blocked.raw.data.specGate.reasons.length > 0);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/stages/${specStage}/request-gate`, { override: { reason: 'please' } })).status, 403);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/stages/${specStage}/request-gate`, { override: { reason: ' ' } })).status, 400);
    const ov = await call(owner, 'POST', `/projects/${pid}/stages/${specStage}/request-gate`, { override: { reason: 'Client demo tomorrow' } });
    assert.equal(ov.status, 201, JSON.stringify(ov.raw));
    assert.ok(ov.data.approval.specReview, 'phê duyệt đính kèm lần chấm');
    assert.match(ov.data.approval.description, /Spec Fidelity: \d+\/100 .*overridden by an admin: Client demo tomorrow/);
    const audit = await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'spec.gate.override' } });
    assert.ok(audit, 'ghi audit');
    // Huỷ để thử lại sau khi sửa ⇒ giai đoạn về ACTIVE.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/approvals/${ov.data.approval.id}/cancel`, {})).status, 200);
  });

  it('áp dụng gợi ý ⇒ phiên bản MANUAL mới; chấm lại ⇒ điểm tăng; áp dụng lần hai ⇒ 409', async () => {
    const r = (await call(staff, 'GET', `/projects/${pid}/spec-reviews/${firstReview.id}`)).data;
    const fast = r.findings.find((f: any) => f.ref === 'FR-01' && f.rule === 'vague_term' && f.rewrite);
    assert.ok(fast, 'có gợi ý viết lại cho FR-01');
    const before = await prisma.workPageVersion.count({ where: { page: { projectId: pid, number: srsNum } } });
    const ap = await call(staff, 'POST', `/projects/${pid}/spec-reviews/${r.id}/findings/${fast.id}/apply`, {
      rewrite: 'FR-01 The product list shall load within 2 seconds for 95% of requests; if loading fails, it shall show an error and a retry button.',
    });
    assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    assert.equal(ap.data.findings.find((f: any) => f.id === fast.id).status, 'applied');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/spec-reviews/${r.id}/findings/${fast.id}/apply`, {})).status, 409);
    const versions = await prisma.workPageVersion.findMany({ where: { page: { projectId: pid, number: srsNum } }, orderBy: { n: 'desc' } });
    assert.equal(versions.length, before + 1);
    assert.equal(versions[0].kind, 'MANUAL');
    assert.match(versions[0].note ?? '', /Spec Fidelity suggestion applied/);
    // Gợi ý do LUẬT (không phải AI) ⇒ trang KHÔNG thành AI-assisted.
    assert.equal((await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: srsNum } })).aiAssisted, false);
    // Sửa nốt bằng tay rồi chấm lại.
    const page = (await call(staff, 'GET', `/projects/${pid}/pages/${srsNum}`)).data;
    const ok = await call(staff, 'PATCH', `/projects/${pid}/pages/${srsNum}`, {
      version: page.version,
      contentJson: { type: 'doc', content: [
        H('Purpose and scope'), P('Online shop for students in Hanoi.'),
        H('Functional requirements'),
        P('FR-01 The product list shall load within 2 seconds for 95% of requests; if loading fails, it shall show an error and a retry button.'),
        P('FR-02 The cart shall keep items for 7 days; expired items shall be removed and the user shall be told.'),
        P('FR-03 Phí giao hàng phải là 20.000 đ trong nội thành và 35.000 đ ngoại thành; địa chỉ không hợp lệ thì báo lỗi.'),
        H('Non-functional requirements'), P('NFR-01 The site shall be available 99.5% of each month.'),
        H('Constraints and assumptions'), P('Runs on the existing VPS.'),
        H('Acceptance criteria'), P('FR-01, FR-02, FR-03 and NFR-01 are verified by the test cases linked to this page.'),
      ] },
    });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    const again = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${srsNum}`, {});
    assert.ok(again.data.overall > firstReview.overall, `${again.data.overall} > ${firstReview.overall}`);
    assert.ok(again.data.unambiguity > firstReview.unambiguity);
    const hist = await call(viewer, 'GET', `/projects/${pid}/spec-reviews?page=${srsNum}`);
    assert.ok(hist.data.items.length >= 4);
    assert.equal(hist.data.items[0].id, again.data.id, 'mới nhất trước');
    assert.equal(hist.data.items[0].createdBy.id, staff.id);
  });

  it('cổng: đủ ngưỡng ⇒ gửi được, phê duyệt đính kèm lần chấm mới nhất', async () => {
    const st = (await call(staff, 'GET', `/projects/${pid}/stages/${specStage}/spec-gate`)).data;
    assert.equal(st.pass, true, JSON.stringify(st));
    assert.ok(st.review.scores.overall >= 70);
    const rq = await call(staff, 'POST', `/projects/${pid}/stages/${specStage}/request-gate`, {});
    assert.equal(rq.status, 201, JSON.stringify(rq.raw));
    assert.equal(rq.data.approval.specReview.id, st.review.id);
    assert.doesNotMatch(rq.data.approval.description, /overridden/);
    // Khách xem phê duyệt cổng: KHÔNG thấy điểm nội bộ.
    const asClient = await call(client, 'GET', `/projects/${pid}/approvals/${rq.data.approval.id}`);
    if (asClient.status === 200) assert.equal(asClient.data.specReview, null);
  });

  let s1 = 0, s2 = 0;
  it('chấm tập thẻ: thiếu AC + thiếu test (truy vết thật) ⇒ thêm AC + test ⇒ verifiability tăng; gợi ý AC áp dụng được', async () => {
    s1 = (await call(staff, 'POST', `/projects/${pid}/issues`, { typeId: typeId('STORY'), title: 'Customer pays by card' })).data.number;
    s2 = (await call(staff, 'POST', `/projects/${pid}/issues`, {
      typeId: typeId('STORY'), title: 'Customer tracks the order',
      descriptionJson: { type: 'doc', content: [P('Happy: the order page shows the latest status within 5 seconds'), P('Unhappy: unknown order code shows "Order not found"')] },
    })).data.number;
    const r1 = await call(staff, 'POST', `/projects/${pid}/spec-reviews/issues`, { semantic: false });
    assert.equal(r1.status, 201, JSON.stringify(r1.raw));
    const rules = r1.data.findings.map((f: any) => `${f.ref}:${f.rule}`);
    assert.ok(rules.includes(`SPC-${s1}:missing_ac`));
    assert.ok(rules.includes(`SPC-${s1}:empty_description`));
    assert.ok(rules.includes(`SPC-${s2}:no_test`));
    assert.deepEqual(r1.data.untraced.map((u: any) => u.ref).sort(), [`SPC-${s1}`, `SPC-${s2}`].sort());
    // Áp dụng khung AC cho s1 (gợi ý của luật) + thêm test liên kết cho cả hai.
    const ac = r1.data.findings.find((f: any) => f.ref === `SPC-${s1}` && f.rule === 'missing_ac');
    const ap = await call(staff, 'POST', `/projects/${pid}/spec-reviews/${r1.data.id}/findings/${ac.id}/apply`, {
      rewrite: 'Happy: a valid card is charged and the receipt is emailed within 1 minute\nUnhappy: a declined card shows "Payment declined" and the cart is kept',
    });
    assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    const issue = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: s1 } });
    assert.match(issue.descriptionText ?? '', /Acceptance criteria/);
    for (const n of [s1, s2]) {
      const t = await call(staff, 'POST', `/projects/${pid}/tests`, { title: `Test SPC-${n}`, steps: [{ action: 'Do it', expected: 'Works' }], requirementKeys: [`SPC-${n}`] });
      assert.equal(t.status, 201, JSON.stringify(t.raw));
    }
    const r2 = await call(staff, 'POST', `/projects/${pid}/spec-reviews/issues`, { semantic: false });
    assert.ok(r2.data.verifiability > r1.data.verifiability, `${r2.data.verifiability} > ${r1.data.verifiability}`);
    assert.equal(r2.data.untraced.length, 0);
    assert.equal(r2.data.stats.testPct, 100);
  });

  it('nguồn gốc AI: AI Apply sửa mô tả ⇒ AI-assisted + lịch sử; commit Co-Authored-By ⇒ AI-assisted; gắn tay', async () => {
    const r = await call(staff, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'update_issue', number: s2, description: 'Rewritten by the assistant. Unhappy: unknown code shows an error.' } });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const d = (await call(staff, 'GET', `/projects/${pid}/issues/${s2}`)).data;
    assert.equal(d.aiAssisted, true);
    assert.equal(d.aiAppliedById, staff.id);
    assert.ok(d.aiModel, 'ghi model');
    const h = (await call(staff, 'GET', `/projects/${pid}/issues/${s2}/history`)).data;
    const row = (Array.isArray(h) ? h : h.items).find((x: any) => x.field === 'aiAssisted');
    assert.ok(row && row.actorKind === 'AI' && row.actor?.id === staff.id && /AI suggestion applied/.test(row.toValue));

    const { markFromDevActivity } = await import('../services/work/provenance.js');
    const i1 = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: s1 } });
    assert.equal(await markFromDevActivity(i1.id, { kind: 'COMMIT', externalId: 'abc1234def', text: `feat: card payment SPC-${s1}\n\nCo-Authored-By: Lan <lan@example.com>` }), false);
    assert.equal(await markFromDevActivity(i1.id, { kind: 'COMMIT', externalId: 'abc1234def', text: `feat: card payment SPC-${s1}\n\nCo-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>` }), true);
    assert.equal(await markFromDevActivity(i1.id, { kind: 'COMMIT', externalId: 'abc1234def', text: 'again\n\nCo-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>' }), false, 'gửi lại không ghi thêm');
    const after1 = await prisma.workIssue.findUniqueOrThrow({ where: { id: i1.id } });
    assert.equal(after1.aiAssisted, true);
    assert.equal(after1.aiModel, 'Claude Opus 5.5 (1M context)');
    const hist = await prisma.workHistory.findMany({ where: { issueId: i1.id, field: 'aiAssisted' } });
    assert.equal(hist.length, 1);
    assert.match(hist[0].toValue ?? '', /commit abc1234 has Co-Authored-By/);

    const manual = (await call(staff, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title: 'Hand-tagged' })).data.number;
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/issues/${manual}`, { aiAssisted: true })).data.aiAssisted, true);
    assert.equal((await call(viewer, 'PATCH', `/projects/${pid}/issues/${manual}`, { aiAssisted: false })).status, 403);
  });

  it('luật duyệt độc lập: TẮT ⇒ Done tự do; BẬT ⇒ chặn; người tạo/người áp dụng tự duyệt vẫn chặn; người khác duyệt ⇒ qua', async () => {
    const done = statusId('Done');
    const todo = statusId('To Do');
    // TẮT (mặc định): s1 (AI-assisted qua commit) vào Done được.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/issues/${s1}/move`, { statusId: done })).status, 200);
    await call(staff, 'POST', `/projects/${pid}/issues/${s1}/move`, { statusId: todo });
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/spec-settings`, { aiReview: { requireIndependentReviewer: true } })).data.aiReview.requireIndependentReviewer, true);
    const blocked = await call(owner, 'POST', `/projects/${pid}/issues/${s2}/move`, { statusId: done });
    assert.equal(blocked.status, 400);
    assert.equal(blocked.code, 'WORK_AI_REVIEW_REQUIRED');
    // staff vừa là người tạo vừa là người áp dụng AI ⇒ staff tự duyệt KHÔNG tính.
    const self = (await call(staff2, 'POST', `/projects/${pid}/approvals`, { issueNumber: s2, approverIds: [staff.id] })).data;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/approvals/${self.id}/decide`, { decision: 'APPROVE' })).status, 200);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues/${s2}/move`, { statusId: done })).code, 'WORK_AI_REVIEW_REQUIRED');
    const indep = (await call(staff, 'POST', `/projects/${pid}/approvals`, { issueNumber: s2, approverIds: [staff2.id] })).data;
    assert.equal((await call(staff2, 'POST', `/projects/${pid}/approvals/${indep.id}/decide`, { decision: 'APPROVE' })).status, 200);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues/${s2}/move`, { statusId: done })).status, 200);
    // Thẻ KHÔNG AI-assisted không bị luật đụng tới.
    const plain = (await call(staff, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title: 'Plain task' })).data.number;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/issues/${plain}/move`, { statusId: done })).status, 200);
    await call(owner, 'PUT', `/projects/${pid}/spec-settings`, { aiReview: { requireIndependentReviewer: false } });
  });

  it('AI soạn trang (draft_page) ⇒ trang AI-assisted; gắn tay trên trang', async () => {
    const r = await call(staff, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'draft_page', title: 'AI draft', markdown: '## Scope\nThe system shall do X.' } });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const pg = (await call(staff, 'GET', `/projects/${pid}/pages/${r.data.number}`)).data;
    assert.equal(pg.aiAssisted, true);
    const p2 = (await call(staff, 'PATCH', `/projects/${pid}/pages/${srsNum}`, { aiAssisted: true })).data;
    assert.equal(p2.aiAssisted, true);
  });
});
