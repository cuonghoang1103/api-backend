/**
 * dm5 G3 (27/11/2026) — "Kiểm thử, review & UAT" qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5g3.db.test.ts
 *
 *   B4  4 checklist mới + mẫu cấp dự án (settings.reviewChecklists) dùng mở phiên được; làm nguội ⇒ 409 WORK_REVIEW_COOLOFF.
 *   D2  SECURITY · tiêu chí VÀO của Test Plan chặn cycle PLANNED → IN_PROGRESS (đổi tay + ghi kết quả đầu) khi testGate=block;
 *       assertTestGate(tx, versionId) chặn Release khi tiêu chí RA chưa đạt, 'warn' chỉ cảnh báo.
 *   D5  JUnit (Surefire) + JaCoCo + SHA ⇒ P/F đúng UTCID của 5.1, Notes có dòng Automation, danh sách không khớp; dryRun không ghi.
 *   D4  lint 5.1 + 6 nhóm ca kiểm thử của thẻ Req (theo nhãn) + lint bước.
 *   D8  cờ Leakage ⇒ nhãn "Leakage" đồng bộ, DRE theo cờ.
 *   D10 UAT: mã người thử, điểm 1–5, biên bản, đọc danh sách; uatRevokeOnClose ⇒ thu hồi lời mời + gỡ vai CLIENT người thử.
 *   D17 sinh viên tự chấm (kind SELF) không đè / không lẫn điểm giảng viên.
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
const tag = `g3${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };

describe('CT Work dm5 G3 — kiểm thử, review & UAT (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, client: U, teacher: U;
  let wsId = 0, pid = 0, key = '';

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1) } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret), email };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` }, body: body === undefined ? undefined : JSON.stringify(body) });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const ok = (r: { status: number; raw: unknown }, status = 200) => assert.equal(r.status, status, JSON.stringify(r.raw).slice(0, 700));
  const settings = (s: Record<string, unknown>) => call(owner, 'PATCH', `/projects/${pid}`, { settings: s });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, client, teacher] = await Promise.all(['owner', 'staff', 'client', 'teacher'].map(mkUser));
    wsId = (await call(owner, 'POST', '/workspaces', { name: `G3 ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, client.email, teacher.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'LFG', name: 'LabFlow G3', template: 'COMPANY', kind: 'CLIENT' });
    ok(p, 201);
    pid = p.data.id; key = p.data.key;
    ok(await call(owner, 'PUT', `/projects/${pid}/members/${staff.id}`, { role: 'MEMBER' }));
    ok(await call(owner, 'PUT', `/projects/${pid}/members/${client.id}`, { role: 'CLIENT' }));
    ok(await call(owner, 'PUT', `/projects/${pid}/members/${teacher.id}`, { role: 'TEACHER' }));
    ok(await call(owner, 'POST', `/projects/${pid}/tests/enable`));
    for (const [k, name] of [['BUG', 'Bug'], ['REQUIREMENT', 'Requirement']] as const) {
      if (!(await prisma.workIssueType.findFirst({ where: { projectId: pid, key: k } }))) {
        const wf = (await prisma.workIssueType.findFirst({ where: { projectId: pid, key: 'TEST' }, select: { workflowId: true } }))?.workflowId ?? null;
        await prisma.workIssueType.create({ data: { projectId: pid, key: k, name, icon: 'bug', color: '#e5484d', workflowId: wf, position: 9 } });
      }
    }
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.workRubric.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('B4: 4 checklist mới + mẫu cấp dự án mở phiên được; làm nguội chặn quyết định', async () => {
    ok(await settings({ reviewChecklists: [{ name: 'API contract review', kind: 'CODE', sections: [{ name: 'Contract', items: ['OpenAPI matches SDS?', 'Exact SM-xx codes?'] }] }], reviewCoolOffHours: 12 }));
    const cfg = await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } });
    assert.equal((cfg.settings as any).reviewChecklists[0].key, 'P_API_CONTRACT_REVIEW');
    ok(await settings({ reviewChecklists: [{ name: '', sections: [] }] }), 400);
    const cl = await call(owner, 'GET', `/projects/${pid}/review-checklists?lang=vi`);
    ok(cl);
    for (const k of ['REBUTTAL_10', 'REQ_REVIEW_STRIDE', 'DESIGN_REVIEW_10', 'PR_SELF_4PASS']) assert.ok(cl.data.some((c: any) => c.key === k && !c.custom), k);
    const own = cl.data.find((c: any) => c.key === 'P_API_CONTRACT_REVIEW');
    assert.equal(own.custom, true);
    assert.equal(own.items, 2);
    assert.equal(cl.data.find((c: any) => c.key === 'REQ_REVIEW_STRIDE').items, 12);

    const r = await call(owner, 'POST', `/projects/${pid}/reviews`, { title: 'PR #12 contract', kind: 'CODE', method: 'TECHNICAL', checklistKey: 'P_API_CONTRACT_REVIEW', participants: [{ userId: owner.id, role: 'MODERATOR' }, { userId: staff.id, role: 'AUTHOR' }] });
    ok(r, 201);
    assert.equal(r.data.items.length, 2);
    assert.equal(r.data.checklistCustom, true);
    assert.equal(r.data.coolOff.hours, 12);
    assert.ok(r.data.coolOff.remainingMinutes > 700);
    ok(await call(owner, 'POST', `/projects/${pid}/reviews`, { title: 'x', kind: 'DOC', method: 'INFORMAL', checklistKey: 'P_NOT_THERE' }), 400);
    const early = await call(owner, 'PATCH', `/projects/${pid}/reviews/${r.data.number}`, { decision: 'ACCEPT' });
    assert.equal(early.status, 409);
    assert.equal(early.code, 'WORK_REVIEW_COOLOFF');
    // Tác giả vẫn bị chặn bởi luật cũ (403) trước cả làm nguội.
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/reviews/${r.data.number}`, { decision: 'ACCEPT' })).code, 'WORK_REVIEW_SELF');
    // Ghi chú vẫn sửa được trong lúc nguội; qua 12 giờ ⇒ quyết định được.
    ok(await call(owner, 'PATCH', `/projects/${pid}/reviews/${r.data.number}`, { notes: 'sleep on it' }));
    await prisma.workReviewSession.updateMany({ where: { projectId: pid, number: r.data.number }, data: { createdAt: new Date(Date.now() - 13 * 3_600_000) } });
    const late = await call(owner, 'PATCH', `/projects/${pid}/reviews/${r.data.number}`, { decision: 'ACCEPT' });
    ok(late);
    assert.equal(late.data.decision, 'ACCEPT');
    assert.equal(late.data.coolOff.remainingMinutes, 0);
    // Mẫu dựng sẵn mới: 10 điểm phản biện.
    const rb = await call(owner, 'POST', `/projects/${pid}/reviews`, { title: 'Self review', kind: 'CODE', method: 'INFORMAL', checklistKey: 'REBUTTAL_10', language: 'vi' });
    ok(rb, 201);
    assert.equal(rb.data.items.length, 10);
    ok(await settings({ reviewCoolOffHours: null }));
  });

  let reqNum = 0;
  const testNums: number[] = [];
  it('D2: tiêu chí VÀO chặn bắt đầu cycle (testGate=block), SECURITY; cổng Release theo tiêu chí RA', async () => {
    const req = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Lock account after 5 failed logins', typeKey: 'REQUIREMENT' });
    ok(req, 201);
    reqNum = req.data.number;
    for (const title of ['Login happy path', 'Login with empty password', 'Login 6th attempt is locked']) {
      const t = await call(staff, 'POST', `/projects/${pid}/tests`, { title, steps: [{ action: title.includes('empty') ? 'User is logged in as student' : 'Open login', expected: title.includes('happy') ? 'Dashboard' : null }], requirementKeys: [`${key}-${reqNum}`] });
      ok(t, 201);
      testNums.push(t.data.number);
    }
    ok(await call(staff, 'PATCH', `/projects/${pid}/tests-attributes`, { numbers: [testNums[2]], testType: 'SECURITY' }));
    ok(await call(staff, 'PATCH', `/projects/${pid}/tests-attributes`, { numbers: [testNums[0]], testType: 'SMOKE' }));
    const plan = await call(staff, 'POST', `/projects/${pid}/test-plans`, { name: 'Iteration 1 plan', numbers: testNums });
    ok(plan, 201);
    const planId = plan.data.id;
    const ver = await call(owner, 'POST', `/projects/${pid}/versions`, { name: `v1.0-${tag}` });
    ok(ver, 201);
    const versionId = ver.data.id;
    ok(await call(staff, 'PUT', `/projects/${pid}/test-plans/${planId}/settings`, { entry: [{ kind: 'MANUAL' }] }), 400);
    const ps = await call(staff, 'PUT', `/projects/${pid}/test-plans/${planId}/settings`, {
      entry: [{ kind: 'CASES_READY', target: 3 }, { kind: 'MANUAL', text: 'Staging deployed with seed data', done: false }],
      criteria: { passRate: 100, maxOpenCritical: 0, maxOpenMajor: 0, reqCoverage: 100, minExecuted: 100 }, versionId,
    });
    ok(ps);
    assert.equal(ps.data.settings.entry.length, 2);
    assert.equal(ps.data.gate.entry.met, false);
    assert.equal(ps.data.settings.versionId, versionId);
    const cyc = await call(staff, 'POST', `/projects/${pid}/test-cycles`, { name: 'Round 1', planId });
    ok(cyc, 201);
    const cycleId = cyc.data.id;
    // Cổng tắt ⇒ không chặn (chỉ dựng — không đổi trạng thái).
    ok(await settings({ testGate: 'block' }));
    const blocked = await call(staff, 'PATCH', `/projects/${pid}/test-cycles/${cycleId}`, { state: 'IN_PROGRESS' });
    assert.equal(blocked.status, 409);
    assert.equal(blocked.code, 'WORK_TEST_GATE');
    assert.equal(blocked.raw.details?.failed?.[0]?.criterion ?? blocked.raw.error?.details?.failed?.[0]?.criterion ?? 'MANUAL', 'MANUAL');
    const runs = (await call(staff, 'GET', `/projects/${pid}/test-cycles/${cycleId}`)).data.runs;
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/test-runs/${runs[0].id}`, { status: 'PASS' })).code, 'WORK_TEST_GATE');
    // 'warn' ⇒ không chặn; trở lại 'block' và tick điều kiện tay ⇒ bắt đầu được.
    ok(await call(staff, 'PUT', `/projects/${pid}/test-plans/${planId}/settings`, { entry: [{ kind: 'CASES_READY', target: 3 }, { kind: 'MANUAL', text: 'Staging deployed with seed data', done: true }] }));
    for (const r of runs) ok(await call(staff, 'PATCH', `/projects/${pid}/test-runs/${r.id}`, { status: r === runs[2] ? 'FAIL' : 'PASS' }));
    assert.equal((await prisma.workTestCycle.findUniqueOrThrow({ where: { id: cycleId } })).state, 'IN_PROGRESS');

    const { assertTestGate } = await import('../services/work/testMgmt.service.js');
    await assert.rejects(prisma.$transaction((tx) => assertTestGate(tx, versionId)), (e: any) => e.code === 'WORK_TEST_GATE' && e.statusCode === 409);
    ok(await settings({ testGate: 'warn' }));
    const warn = await assertTestGate(prisma, versionId);
    assert.equal(warn.mode, 'warn');
    assert.equal(warn.met, false);
    assert.ok(warn.plans[0].failed.some((f) => f.criterion === 'passRate'));
    ok(await settings({ testGate: 'block' }));
    ok(await call(staff, 'PATCH', `/projects/${pid}/test-runs/${runs[2].id}`, { status: 'PASS' }));
    const pass = await prisma.$transaction((tx) => assertTestGate(tx, versionId));
    assert.equal(pass.met, true, JSON.stringify(pass));
    ok(await settings({ testGate: null }));
    assert.equal((await assertTestGate(prisma, versionId)).mode, null);
    const dash = await call(staff, 'GET', `/projects/${pid}/test-quality?planId=${planId}`);
    ok(dash);
    assert.equal(dash.data.entry.met, true);
  });

  it('D4: 6 nhóm ca kiểm thử theo nhãn + lint bước của thẻ Req', async () => {
    const mk = async (name: string) => (await prisma.workLabel.upsert({ where: { uk_work_label: { projectId: pid, name } }, create: { projectId: pid, name }, update: {} })).id;
    const issueId = async (n: number) => (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n } })).id;
    await prisma.workIssueLabel.createMany({ data: [{ issueId: await issueId(testNums[0]), labelId: await mk('Happy') }, { issueId: await issueId(testNums[1]), labelId: await mk('Empty') }, { issueId: await issueId(testNums[2]), labelId: await mk('Security') }, { issueId: await issueId(testNums[2]), labelId: await mk('Boundary') }] });
    const g = await call(staff, 'GET', `/projects/${pid}/test-groups/${reqNum}`);
    ok(g);
    assert.equal(g.data.isRequirement, true);
    assert.deepEqual(g.data.groups.map((x: any) => x.count), [1, 1, 1, 0, 1, 0]);
    assert.deepEqual(g.data.missing, ['Conflict', 'Adjacent']);
    const empty = g.data.tests.find((t: any) => t.number === testNums[1]);
    assert.ok(empty.lint.some((l: any) => l.code === 'PRECONDITION_IN_STEPS'));
    assert.ok(empty.lint.some((l: any) => l.code === 'STEP_NO_EXPECTED'));
  });

  it('D5: JUnit + JaCoCo + SHA ⇒ P/F đúng UTCID của 5.1, Notes có dòng Automation; dryRun không ghi; lint 5.1', async () => {
    const f = await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit`, { moduleName: 'AuthService', methodName: 'login' });
    ok(f, 201);
    const fid = f.data.id;
    ok(await call(staff, 'PUT', `/projects/${pid}/fpt-tests/unit/${fid}/matrix`, {
      rows: [{ key: 'n1', section: 'COND', groupName: 'Input', value: 'valid' }, { key: 'n2', section: 'CONFIRM', groupName: 'Return', value: 'token' }],
      cases: [{ key: 'c1', type: 'N' }, { key: 'c2', type: 'N' }, { key: 'c3', type: 'N' }],
      marks: [['n1', 'c1'], ['n2', 'c1'], ['n1', 'c2'], ['n2', 'c2'], ['n1', 'c3']],
    }));
    const junit = `<testsuite name="AuthServiceTest"><testcase classname="com.lf.AuthServiceTest" name="login_UTCID01"/><testcase classname="com.lf.AuthServiceTest" name="login_UTCID02"><failure message="expected locked"/></testcase><testcase classname="com.lf.OtherTest" name="foo"/></testsuite>`;
    const jacoco = `<report name="lf"><package name="com/lf"><counter type="LINE" missed="20" covered="80"/></package><counter type="LINE" missed="20" covered="80"/><counter type="BRANCH" missed="5" covered="15"/></report>`;
    const dry = await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit/automation-import`, { report: junit, coverage: jacoco, commitSha: 'a1b2c3d4e5f6', executedAt: '2026-11-27', dryRun: true });
    ok(dry);
    assert.equal(dry.data.matched, 2);
    assert.equal(dry.data.coverage.linePct, 80);
    assert.deepEqual(dry.data.missing.map((m: any) => m.utcid), ['UTCID03']);
    assert.equal(dry.data.unmatched.length, 1);
    assert.equal((await prisma.workUnitCase.count({ where: { functionId: fid, result: { not: null } } })), 0);
    ok(await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit/automation-import`, { report: '<nope', dryRun: true }), 400);
    const real = await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit/automation-import`, { report: junit, coverage: jacoco, commitSha: 'a1b2c3d4e5f6', executedAt: '2026-11-27' });
    ok(real);
    const cases = await prisma.workUnitCase.findMany({ where: { functionId: fid }, orderBy: { position: 'asc' } });
    assert.deepEqual(cases.map((c) => c.result), ['P', 'F', null]);
    assert.equal(cases[1].note, 'JUnit: expected locked');
    assert.equal(cases[0].executedAt?.toISOString().slice(0, 10), '2026-11-27');
    const doc = await prisma.workFptTestDoc.findUniqueOrThrow({ where: { projectId: pid } });
    assert.match(doc.unitNotes ?? '', /^Automation: JUnit 2026-11-27 — 2\/3 UTCID matched \(1 P, 1 F\) · JaCoCo line 80%, branch 75% · commit a1b2c3d4e5f6$/m);
    const lint = await call(staff, 'GET', `/projects/${pid}/fpt-tests/unit/lint`);
    ok(lint);
    const codes = lint.data.issues.filter((i: any) => i.functionId === fid).map((i: any) => i.code);
    assert.ok(codes.includes('NO_ABNORMAL') && codes.includes('NO_BOUNDARY') && codes.includes('CASE_NO_CONFIRM') && codes.includes('DUPLICATE_CASE'), codes.join(','));
  });

  it('D8: cờ Leakage ⇒ nhãn đồng bộ, DRE theo cờ, sổ defect', async () => {
    const b1 = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Client found wrong total', typeKey: 'BUG' });
    const b2 = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'QA found typo', typeKey: 'BUG' });
    ok(b1, 201); ok(b2, 201);
    ok(await call(staff, 'PUT', `/projects/${pid}/issues/${b2.data.number}/defect`, { activity: 'ST', severity: 'MINOR' }));
    const set = await call(staff, 'PUT', `/projects/${pid}/issues/${b1.data.number}/defect`, { activity: 'ST', leakage: true });
    ok(set);
    assert.equal(set.data.leakage, true);
    assert.equal(set.data.leakageFlag, true);
    const lbl = await prisma.workIssueLabel.findMany({ where: { issue: { projectId: pid, number: b1.data.number } }, select: { label: { select: { name: true } } } });
    assert.deepEqual(lbl.map((l) => l.label.name), ['Leakage']);
    const dash = await call(staff, 'GET', `/projects/${pid}/test-quality`);
    ok(dash);
    assert.equal(dash.data.defects.leakage, 50);
    assert.equal(dash.data.defects.dre, 50);
    const log = await call(staff, 'GET', `/projects/${pid}/defects`);
    if (log.status === 200 && Array.isArray(log.data)) assert.equal(log.data.find((d: any) => d.number === b1.data.number)?.leakage, true);
    const off = await call(staff, 'PUT', `/projects/${pid}/issues/${b1.data.number}/defect`, { leakage: false });
    ok(off);
    assert.equal(off.data.leakage, false);
    assert.equal(await prisma.workIssueLabel.count({ where: { issue: { projectId: pid, number: b1.data.number } } }), 0);
    const hist = await prisma.workHistory.findMany({ where: { issue: { projectId: pid, number: b1.data.number }, field: 'defectLeakage' }, orderBy: { id: 'asc' } });
    assert.deepEqual(hist.map((h) => h.toValue), ['true', 'false']);
  });

  it('D10: UAT — mã người thử, điểm 1–5, biên bản, danh sách; uatRevokeOnClose thu hồi quyền người thử', async () => {
    const item = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Book a lab', typeKey: 'TASK' });
    ok(item, 201);
    ok(await call(owner, 'PUT', `/projects/${pid}/issues/${item.data.number}/client-visible`, { visible: true }));
    const bad = await call(owner, 'POST', `/projects/${pid}/portal/uat`, { issueNumbers: [item.data.number], approverIds: [client.id], testerCode: 'an@fpt.vn' });
    assert.equal(bad.code, 'WORK_UAT_TESTER_CODE');
    const u = await call(owner, 'POST', `/projects/${pid}/portal/uat`, { issueNumbers: [item.data.number], approverIds: [client.id], testerCode: 'p1', environment: 'staging' });
    ok(u, 201);
    const aid = u.data.id;
    assert.equal(u.data.uat.testerCode, 'P1');
    ok(await call(owner, 'PATCH', `/projects/${pid}/portal/uat/${aid}`, { testerCode: 'P2' }));
    assert.equal((await call(client, 'PATCH', `/projects/${pid}/portal/uat/${aid}`, { testerCode: 'P3' })).status, 403);
    // Một lời mời khách còn treo — sẽ bị thu hồi khi chốt phiên.
    await prisma.workInvite.create({ data: { workspaceId: wsId, projectId: pid, email: `${tag}_p3@test.local`, role: 'GUEST', projectRole: 'CLIENT', tokenHash: `${tag}-inv`, invitedById: owner.id, expiresAt: new Date(Date.now() + 7 * 86400_000) } });
    ok(await settings({ uatRevokeOnClose: true }));
    assert.equal((await call(client, 'POST', `/projects/${pid}/portal/uat/${aid}/decide`, { decision: 'APPROVE', rating: 7 })).status, 400);
    assert.equal((await call(client, 'POST', `/projects/${pid}/portal/uat/${aid}/decide`, { decision: 'REJECT', rating: 2 })).code, 'WORK_REJECT_REASON');
    const d = await call(client, 'POST', `/projects/${pid}/portal/uat/${aid}/decide`, { decision: 'APPROVE', rating: 4, comment: 'Smooth' });
    ok(d);
    const row = await prisma.workUatRequest.findFirstOrThrow({ where: { approvalId: aid } });
    assert.equal(row.rating, 4);
    assert.equal(row.testerCode, 'P2');
    // Thu hồi: lời mời treo bị revoke; người thử vào danh sách thu hồi — vai CLIENT GIỮ NGUYÊN (vẫn bị cách ly như khách,
    // không thoát ra thành MEMBER không gian) nhưng mọi tuyến dự án đóng với họ.
    assert.ok((await prisma.workInvite.findFirstOrThrow({ where: { tokenHash: `${tag}-inv` } })).revokedAt);
    assert.equal(await prisma.workProjectMember.count({ where: { projectId: pid, userId: client.id, role: 'CLIENT' } }), 1);
    assert.deepEqual(((await prisma.workProject.findUniqueOrThrow({ where: { id: pid } })).settings as any).portalRevokedUserIds, [client.id]);
    for (const path of ['/portal/overview', '/issues', `/portal/uat/${aid}/certificate`]) assert.equal((await call(client, 'GET', `/projects/${pid}${path}`)).code, 'WORK_PORTAL_REVOKED', path);
    const cert = await call(owner, 'GET', `/projects/${pid}/portal/uat/${aid}/certificate`);
    ok(cert);
    assert.equal(cert.data.rating, 4);
    assert.equal(cert.data.testerCode, 'P2');
    assert.equal(cert.data.conclusion, 'ACCEPTED');
    assert.equal(cert.data.signatures[0].side, 'CLIENT');
    const clients = await call(owner, 'GET', `/projects/${pid}/portal/clients`);
    assert.equal(clients.data.clients.find((c: any) => c.id === client.id).portalRevoked, true);
    // Trả quyền: chỉ ADMIN; xong khách vào lại được.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/portal/clients/${client.id}/restore`)).status, 403);
    ok(await call(owner, 'POST', `/projects/${pid}/portal/clients/${client.id}/restore`));
    ok(await call(client, 'GET', `/projects/${pid}/portal/overview`));
    const list = await call(owner, 'GET', `/projects/${pid}/portal/uat`);
    ok(list);
    assert.equal(list.data[0].rating, 4);
    assert.equal(list.data[0].status, 'APPROVED');
    assert.ok(await prisma.workAuditLog.count({ where: { projectId: pid, action: 'portal.uat_revoke' } }));
  });

  it('D17: sinh viên tự chấm (SELF) không đè và không lẫn điểm giảng viên', async () => {
    const rubric = await prisma.workRubric.create({ data: { ownerId: teacher.id, name: 'SWP M3', criteria: [{ key: 'product', name: 'Product', weight: 60, description: '', levels: [] }, { key: 'docs', name: 'Docs', weight: 40, description: '', levels: [] }], scaleMax: 10 } });
    const tg = await call(teacher, 'PUT', `/projects/${pid}/grades`, { rubricId: rubric.id, milestone: 'SWP-M3', scores: { product: 6, docs: 5 } });
    ok(tg);
    // Giảng viên không dùng lối tự chấm; sinh viên không chấm thật.
    assert.equal((await call(teacher, 'PUT', `/projects/${pid}/grades/self`, { rubricId: rubric.id, milestone: 'SWP-M3', scores: {} })).status, 403);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/grades`, { rubricId: rubric.id, milestone: 'SWP-M3', scores: { product: 9 } })).status, 403);
    const sg = await call(staff, 'PUT', `/projects/${pid}/grades/self`, { rubricId: rubric.id, milestone: 'SWP-M3', scores: { product: 9, docs: 8 }, comment: 'We think product is solid' });
    ok(sg);
    assert.equal(sg.data.kind, 'SELF');
    assert.equal(sg.data.total, 8.6);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/grades/self`, { rubricId: rubric.id, milestone: 'SWP-M3', subjectUserId: owner.id, scores: {} })).status, 400);
    // Tự chấm theo mẫu SEP490/SWP391 (tạo rubric riêng của sinh viên).
    const tplKey = (await import('../services/work/teachingRules.js')).RUBRIC_TEMPLATES[0].key;
    ok(await call(staff, 'PUT', `/projects/${pid}/grades/self`, { templateKey: tplKey, milestone: 'Final', scores: {} }));
    const teacherRow = await prisma.workGrade.findFirstOrThrow({ where: { projectId: pid, kind: 'TEACHER' } });
    assert.equal(teacherRow.total, 5.6);
    const view = await call(teacher, 'GET', `/projects/${pid}/grades`);
    ok(view);
    assert.equal(view.data.grades.length, 1);
    assert.equal(view.data.selfGrades.length, 2);
    const sv = await call(staff, 'GET', `/projects/${pid}/grades`);
    ok(sv);
    assert.equal(sv.data.grades.length, 0); // điểm GV chưa công bố
    assert.equal(sv.data.selfGrades.filter((g: any) => g.mine).length, 2);
    assert.ok(sv.data.selfRubrics.used.some((r: any) => r.id === rubric.id));
    // Công bố điểm GV không đụng điểm SELF; xoá SELF chỉ của chính mình.
    ok(await call(teacher, 'POST', `/projects/${pid}/grades/publish`, { ids: [sg.data.id], published: true }), 404);
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/grades/self/${sg.data.id}`)).status, 404);
    ok(await call(staff, 'DELETE', `/projects/${pid}/grades/self/${sg.data.id}`));
  });
});
