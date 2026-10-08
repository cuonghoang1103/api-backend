/**
 * CT Work đợt 3C — "Dùng được khi KHÔNG có Claude", qua HTTP thật + Postgres cục bộ (model GIẢ, không gọi LLM thật):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw3c.db.test.ts
 *
 *   R   Registry qua MCP (token agent + token người): 5.1 tạo hàm → thêm UTCID (dòng mới + "O") → đánh/bỏ O → ghi P/F;
 *       5.3 workflow → thêm case → ghi vòng 2; Xray test → cycle → ghi bước; Docs nháp + sửa mục; export_file (link tải
 *       chạy được, Project Tracking vẫn cấm agent); họp → action → thẻ; RAID; sprint hiện tại; báo cáo tuần (lần 2 = làm mới);
 *       gợi ý test (helper giả).
 *   A   Ask AI: lệnh ĐỌC chạy trong lúc trả lời; lệnh GHI chỉ là đề xuất (lệnh lạ/đọc/tham số sai bị lọc); Apply ⇒ chạy
 *       bằng quyền người bấm; VIEWER áp ⇒ 403.
 *   B   Agent BUILTIN: tạo (Pro/admin, ≤ 3, không token) · giao thẻ ⇒ tự xếp lượt ⇒ vòng lặp (LLM giả) gọi lệnh thật ⇒
 *       request_review + nhả lease + chi phí GATEWAY · người không Pro ⇒ FAILED + bình luận · rào chắn trong vòng lặp ·
 *       trần/lượt ⇒ CAPPED + cờ · dừng · JSON hỏng ⇒ FAILED · hết bước ⇒ FAILED · token agent không gọi được agent-runs.
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
const tag = `c3${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work đợt 3C — registry lệnh, Ask AI, agent BUILTIN (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, free: U, viewer: U;
  let wsId = 0, pid = 0;
  let cfg: any;
  let ext: { token: string; userId: number; agentId: number };
  let devTok = '';
  let rpcId = 0;
  const askPrompts: string[] = [];
  const askReplies: string[] = [];
  let llmScript: Array<(req: { system: string; messages: any[]; step: number }) => { text: string; inputTokens?: number; outputTokens?: number }> = [];
  const llmSeen: Array<{ system: string; messages: any[]; step: number }> = [];

  async function mkUser(name: string, pro = false): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', ...(pro ? { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 86_400_000) } : {}) } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function tool(token: string, name: string, args: Record<string, unknown> = {}) {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/call', params: { name, arguments: args } }),
    });
    const body = (await res.json()) as any;
    if (body.error) return { isError: true, text: JSON.stringify(body.error), json: null as any };
    const text: string = body.result.content[0].text;
    let json: any = null;
    try { json = JSON.parse(text); } catch { /* markdown / untrusted */ }
    return { isError: body.result.isError as boolean, text, json };
  }
  /** Phần JSON nằm trong <ctwork-content …> (lệnh đọc bọc dữ liệu người dùng). */
  const inner = (text: string) => JSON.parse(text.slice(text.indexOf('>', text.indexOf('<ctwork-content')) + 1, text.lastIndexOf('</ctwork-content>')).trim());
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  async function mkIssue(by: U, title: string, extra: Record<string, unknown> = {}) {
    const r = await call(by, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data as { id: number; number: number; version: number };
  }
  async function issueRow(number: number) {
    return prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number }, select: { id: true, version: true, assigneeId: true, flaggedAt: true, flagReason: true, status: { select: { name: true, category: true } } } });
  }
  const builtin = () => import('../services/work/builtinAgent.service.js');
  async function waitRun(issueId: number, ms = 3000) {
    const end = Date.now() + ms;
    for (;;) {
      const r = await prisma.workAgentRun.findFirst({ where: { issueId }, orderBy: { id: 'desc' } });
      if (r || Date.now() > end) return r;
      await new Promise((res) => setTimeout(res, 50));
    }
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    (await import('../services/work/ai.service.js'))._setAskForTests(async (system, user) => {
      askPrompts.push(`${system}\n---\n${user}`);
      return askReplies.shift() ?? '{"reply":"ok","actions":[]}';
    });
    (await import('../services/work/fptTests.service.js'))._setFptAskForTests(async () => JSON.stringify({
      conditions: [{ group: 'email', label: 'valid', value: 'a@b.co' }, { group: 'email', label: 'empty', value: '' }],
      confirmations: [{ group: 'Return', label: null, value: 'true' }, { group: 'Exception', label: null, value: 'IllegalArgumentException' }],
      cases: [{ type: 'N', conditions: [0], confirmations: [0] }, { type: 'A', conditions: [1], confirmations: [1] }],
      notes: 'fake',
    }));
    const b = await builtin();
    b._setAutoRunForTests(false);
    b._setAgentLlmForTests(async (req) => {
      llmSeen.push({ system: req.system, messages: req.messages, step: req.step });
      const f = llmScript.shift();
      const out = f ? f(req) : { text: '{"done":{"summary":"nothing to do","outcome":"review"}}' };
      return { text: out.text, inputTokens: out.inputTokens ?? 1000, outputTokens: out.outputTokens ?? 200, model: 'gpt-6-sol' };
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    owner = await mkUser('owner', true);
    [dev, free, viewer] = await Promise.all([mkUser('dev'), mkUser('free'), mkUser('viewer')]);
    (await import('../mcp/server.js'))._resetMcpRateForTests();
  });

  after(async () => {
    server?.close();
    (await import('../services/work/ai.service.js'))._setAskForTests(null);
    (await import('../services/work/fptTests.service.js'))._setFptAskForTests(null);
    (await builtin())._setAgentLlmForTests(null);
    const agentUsers = wsId ? await prisma.workAgent.findMany({ where: { workspaceId: wsId }, select: { userId: true } }) : [];
    const ids = [...userIds, ...agentUsers.map((a) => a.userId)];
    if (wsId) {
      await prisma.workBuiltinBudget.deleteMany({ where: { workspaceId: wsId } });
      await prisma.workSpace.deleteMany({ where: { id: wsId } });
    }
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  // ═══ Dựng dữ liệu ═════════════════════════════════════════════════

  it('dựng không gian + dự án (dev MEMBER, viewer VIEWER, free ADMIN không gian) + agent ngoài + token người', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `3C ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, free.email, viewer.email], role: 'MEMBER' });
    pid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'FP', name: 'Flying pencil', template: 'COMPANY', kind: 'CLIENT' })).data.id;
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${free.id}`, { role: 'ADMIN' });
    await call(owner, 'PATCH', `/workspaces/${wsId}/members/${free.id}`, { role: 'ADMIN' });
    const r = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Ext Bot', model: 'claude-sonnet-5', projectIds: [pid] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    ext = { token: r.data.token.token, userId: r.data.agent.userId, agentId: r.data.agent.id };
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'dev', scopes: ['read', 'write'] })).data.token;
    assert.ok(devTok?.startsWith('ctw_'));
  });

  // ═══ R: lệnh mới qua MCP ══════════════════════════════════════════

  it('R1 5.1: tạo hàm → thêm UTCID (dòng mới, "O" theo group/value) → bỏ/đặt O → ghi P/F → đọc lại', async () => {
    const c = await tool(ext.token, 'fpt_unit_create_function', { project: 'FP', moduleName: 'UserService', methodName: 'register', loc: 40 });
    assert.equal(c.isError, false, c.text);
    const fid = c.json.created.id;
    assert.equal(c.json.matrix.cases.length, 1, 'mẫu khởi đầu có 1 case N');
    const add = await tool(ext.token, 'fpt_unit_add_cases', {
      project: 'FP', function: 'UserService.register',
      rows: [{ section: 'condition', group: 'email', value: 'a@b.co' }, { section: 'condition', group: 'email', value: '' }, { section: 'confirmation', group: 'Exception', value: 'IllegalArgumentException' }],
      cases: [
        { type: 'N', O: [{ group: 'Precondition' }, { group: 'email', value: 'a@b.co' }] },
        { type: 'B', O: [{ group: 'email', value: '' }, { group: 'Exception', value: 'IllegalArgumentException' }], result: 'F', note: 'empty email' },
      ],
    });
    assert.equal(add.isError, false, add.text);
    assert.deepEqual(add.json.added, ['UTCID02', 'UTCID03']);
    const m = add.json.matrix;
    const emailRows = m.rows.filter((r: any) => r.group === 'email');
    assert.equal(emailRows.length, 2);
    // dòng mới đứng trong khối Condition (trước mọi Confirmation)
    const firstConfirm = m.rows.findIndex((r: any) => r.section === 'confirmation');
    assert.ok(m.rows.findIndex((r: any) => r.group === 'email') < firstConfirm);
    const u3 = m.cases.find((x: any) => x.utcid === 'UTCID03');
    assert.equal(u3.type, 'B'); assert.equal(u3.result, 'F'); assert.equal(u3.O.length, 2); assert.ok(u3.executedAt);
    const mk = await tool(ext.token, 'fpt_unit_mark', { project: 'FP', function: fid, case: 'UTCID03', rows: [emailRows[1].row], on: false });
    assert.equal(mk.json.matrix.cases[2].O.length, 1);
    const res = await tool(ext.token, 'fpt_unit_record_results', { project: 'FP', function: fid, results: [{ case: 'UTCID02', result: 'P' }, { case: 3, result: 'P', defectId: 'BUG-1' }] });
    assert.equal(res.isError, false, res.text);
    const got = inner((await tool(ext.token, 'fpt_unit_get', { project: 'FP', function: 'register' })).text);
    assert.deepEqual(got.cases.map((x: any) => x.result), [null, 'P', 'P']);
    assert.equal(got.cases[2].defectId, 'BUG-1');
    const list = inner((await tool(ext.token, 'fpt_unit_list', { project: 'FP' })).text);
    assert.equal(list.functions[0].cases, 3);
    const bad = await tool(ext.token, 'fpt_unit_mark', { project: 'FP', function: fid, case: 'UTCID09', rows: [1] });
    assert.equal(bad.isError, true);
    assert.match(bad.text, /WORK_BAD_CASE/);
  });

  it('R2 gợi ý test cho hàm (helper 1b, model giả) ⇒ chỉ đề xuất, dán thẳng được vào fpt_unit_add_cases', async () => {
    const s = await tool(devTok, 'fpt_unit_suggest', { project: 'FP', function: 'UserService.register' });
    assert.equal(s.isError, false, s.text);
    assert.equal(s.json.cases.length, 2);
    assert.deepEqual(s.json.cases[1].O, [{ group: 'email', value: '' }, { group: 'Exception', value: 'IllegalArgumentException' }]);
    const before = await prisma.workUnitCase.count({ where: { function: { projectId: pid } } });
    assert.equal(before, 3, 'gợi ý không lưu gì');
    const apply = await tool(devTok, 'fpt_unit_add_cases', { project: 'FP', function: 'UserService.register', rows: s.json.rows, cases: s.json.cases.map((c: any) => ({ type: c.type, O: c.O })) });
    assert.equal(apply.isError, false, apply.text);
    assert.deepEqual(apply.json.added, ['UTCID04', 'UTCID05']);
  });

  it('R3 5.3: tạo workflow → thêm case (bước) → ghi vòng 2 (thêm vòng) → vượt 3 vòng ⇒ lỗi', async () => {
    const c = await tool(ext.token, 'fpt_it_create_module', { project: 'FP', kind: 'system', name: 'Checkout flow', idPrefix: 'CK' });
    assert.equal(c.isError, false, c.text);
    const add = await tool(ext.token, 'fpt_it_add_cases', { project: 'FP', kind: 'system', module: 'Checkout flow', cases: [{ description: 'Pay by card', procedure: '1. Add item\n2. Pay', expected: 'Order paid' }, { description: 'Card declined', expected: 'Error shown' }] });
    assert.deepEqual(add.json.added, ['CK01', 'CK02']);
    const r2 = await tool(ext.token, 'fpt_it_record_round', { project: 'FP', kind: 'system', module: 'Checkout flow', results: [{ case: 'CK02', round: 2, status: 'Failed', actual: 'No error', date: '2026-10-09' }] });
    assert.equal(r2.isError, false, r2.text);
    const cs = r2.json.sheet.cases[1];
    assert.equal(cs.rounds.length, 2);
    assert.equal(cs.rounds[0].status, null);
    assert.equal(cs.rounds[1].status, 'Failed');
    assert.equal(cs.actual, 'No error');
    const over = await tool(ext.token, 'fpt_it_record_round', { project: 'FP', kind: 'system', module: 'Checkout flow', results: [{ case: 1, round: 4, status: 'Passed' }] });
    assert.equal(over.isError, true);
    const wrongKind = await tool(ext.token, 'fpt_it_get', { project: 'FP', kind: 'integration', module: c.json.created.id });
    assert.equal(wrongKind.isError, true, 'module 5.3 không đọc được dưới tên 5.2');
    const l = inner((await tool(ext.token, 'fpt_it_list', { project: 'FP', kind: 'system' })).text);
    assert.equal(l.modules[0].cases, 2);
  });

  it('R4 Xray: test_create (gắn requirement) → test_cycle_create → test_run_record (bước theo vị trí) ⇒ FAIL', async () => {
    await call(owner, 'POST', `/projects/${pid}/tests/enable`, {});
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    const story = await mkIssue(owner, 'Checkout story');
    const t = await tool(devTok, 'test_create', { project: 'FP', title: 'Pay with card', steps: [{ action: 'Open cart', expected: 'Cart shown' }, { action: 'Pay', expected: 'Paid' }], requirement: story.number });
    assert.equal(t.isError, false, t.text);
    const cyc = await tool(devTok, 'test_cycle_create', { project: 'FP', name: 'Sprint 1 regression', tests: [t.json.number] });
    assert.equal(cyc.isError, false, cyc.text);
    const detail = inner((await tool(devTok, 'test_cycles', { project: 'FP', cycle: cyc.json.cycle })).text);
    const runId = detail.runs[0].id;
    const rec = await tool(devTok, 'test_run_record', { project: 'FP', run: runId, steps: [{ step: 1, status: 'PASS' }, { step: 2, status: 'FAIL', actual: 'Timeout' }], comment: 'gateway slow' });
    assert.equal(rec.isError, false, rec.text);
    assert.equal(rec.json.status, 'FAIL');
    assert.equal(rec.json.steps[1].actual, 'Timeout');
    const tl = inner((await tool(devTok, 'test_list', { project: 'FP' })).text);
    assert.ok(JSON.stringify(tl).includes('Pay with card'));
  });

  it('R5 Docs: nháp trang (DRAFT) + sửa một mục ⇒ phiên bản mới; xuất Word/PDF bằng link chạy được', async () => {
    const d = await tool(ext.token, 'docs_draft_page', { project: 'FP', title: 'Test plan', markdown: '## Scope\nAll of checkout.\n\n## Risks\nNone yet.' });
    assert.equal(d.isError, false, d.text);
    assert.equal(d.json.status, 'DRAFT');
    const num = d.json.number;
    const u = await tool(ext.token, 'docs_update_section', { project: 'FP', page: num, heading: 'Risks', markdown: 'Payment gateway downtime.' });
    assert.equal(u.isError, false, u.text);
    const page = await tool(ext.token, 'get_page', { project: 'FP', page: num });
    assert.match(page.text, /Payment gateway downtime/);
    assert.doesNotMatch(page.text, /None yet/);
    const link = await tool(devTok, 'export_file', { project: 'FP', kind: 'page_docx', page: num });
    assert.equal(link.isError, false, link.text);
    assert.match(link.json.path, new RegExp(`/api/v1/work/projects/${pid}/pages/${num}/export\\.docx$`));
    const file = await fetch(`${base}${link.json.path}`, { headers: { Authorization: `Bearer ${devTok}` } });
    assert.equal(file.status, 200);
    assert.match(file.headers.get('content-type') ?? '', /wordprocessingml/);
    assert.ok((await file.arrayBuffer()).byteLength > 1000);
    const missing = await tool(devTok, 'export_file', { project: 'FP', kind: 'page_pdf', page: 9999 });
    assert.equal(missing.isError, true, 'trang không có ⇒ không phát link chết');
  });

  it('R6 export_file: link Excel 5.1 tải được; Project Tracking — người được, agent bị chặn như REST', async () => {
    const l = await tool(ext.token, 'export_file', { project: 'FP', kind: 'unit_test' });
    assert.equal(l.isError, false, l.text);
    const x = await fetch(`${base}${l.json.path}`, { headers: { Authorization: `Bearer ${ext.token}` } });
    assert.equal(x.status, 200);
    assert.match(x.headers.get('content-type') ?? '', /spreadsheetml/);
    const deny = await tool(ext.token, 'export_file', { project: 'FP', kind: 'project_tracking', variant: 'SEP490' });
    assert.equal(deny.isError, true);
    assert.match(deny.text, /WORK_AGENT_FORBIDDEN/);
    const okH = await tool(devTok, 'export_file', { project: 'FP', kind: 'project_tracking', variant: 'SEP490' });
    assert.equal(okH.isError, false, okH.text);
    const weeklyNone = await tool(devTok, 'export_file', { project: 'FP', kind: 'weekly_report' });
    assert.equal(weeklyNone.isError, true);
    assert.match(weeklyNone.text, /weekly_report_generate/);
  });

  it('R7 họp → thêm action → thẻ (không nhân đôi); RAID tạo/sửa/đọc; sprint hiện tại; báo cáo tuần (lần 2 = làm mới)', async () => {
    const mtg = await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Sprint review', type: 'DEMO', startsAt: new Date(Date.now() + 3600_000).toISOString(), endsAt: new Date(Date.now() + 7200_000).toISOString() });
    assert.equal(mtg.status, 201, JSON.stringify(mtg.raw));
    const n = mtg.data.number;
    const a = await tool(devTok, 'meeting_add_actions', { project: 'FP', meeting: `M-${n}`, actions: [{ text: 'Fix card timeout', owner: dev.username, dueDate: '2026-10-20' }, { text: 'Update test plan' }] });
    assert.equal(a.isError, false, a.text);
    assert.equal(a.json.actions.length, 2);
    const g = inner((await tool(devTok, 'meeting_get', { project: 'FP', meeting: n })).text);
    assert.equal(g.actions[0].owner, dev.username);
    const ci = await tool(devTok, 'meeting_create_issues', { project: 'FP', meeting: n });
    assert.equal(ci.isError, false, ci.text);
    assert.equal(ci.json.created.length, 2);
    const again = await tool(devTok, 'meeting_create_issues', { project: 'FP', meeting: n });
    assert.equal(again.isError, true, 'bấm lần hai không nhân đôi');

    const rc = await tool(devTok, 'raid_create', { project: 'FP', type: 'RISK', title: 'Gateway downtime', probability: 3, impact: 4, mitigation: 'Retry + fallback', owner: dev.username });
    assert.equal(rc.isError, false, rc.text);
    const key = rc.json.created;
    const ru = await tool(devTok, 'raid_update', { project: 'FP', item: key, probability: 2 });
    assert.equal(ru.isError, false, ru.text);
    const rl = inner((await tool(devTok, 'raid_list', { project: 'FP', type: 'RISK' })).text);
    assert.equal(rl[0].score, 8);

    const sp = await tool(devTok, 'sprint_current', { project: 'FP' });
    assert.equal(sp.isError, false, sp.text);

    const w1 = await tool(devTok, 'weekly_report_generate', { project: 'FP' });
    assert.equal(w1.isError, false, w1.text);
    assert.equal(w1.json.refreshed, false);
    assert.match(w1.json.download, /fpt-reports\/weekly\/export\?ids=/);
    const w2 = await tool(devTok, 'weekly_report_generate', { project: 'FP' });
    assert.equal(w2.json.refreshed, true);
    assert.equal(w2.json.report.id, w1.json.report.id);
  });

  it('R8 token read-only không thấy/không chạy lệnh ghi mới; VIEWER không ghi ma trận', async () => {
    const ro = (await call(viewer, 'POST', '/me/api-tokens', { name: 'ro', scopes: ['read'] })).data.token;
    const w = await tool(ro, 'fpt_unit_add_cases', { project: 'FP', function: 'register', cases: [{ type: 'N', O: [1] }] });
    assert.equal(w.isError, true);
    const rw = (await call(viewer, 'POST', '/me/api-tokens', { name: 'rw', scopes: ['read', 'write'] })).data.token;
    const v = await tool(rw, 'fpt_unit_create_function', { project: 'FP', moduleName: 'X', methodName: 'y' });
    assert.equal(v.isError, true, 'VIEWER không có issue.edit');
    const r = await tool(ro, 'fpt_unit_list', { project: 'FP' });
    assert.equal(r.isError, false);
  });

  // ═══ A: Ask AI dùng chung bộ lệnh ═════════════════════════════════

  it('A1 lệnh ĐỌC chạy trong lúc trả lời; đề xuất GHI được lọc (lệnh lạ / lệnh đọc / tham số sai) và KHÔNG tự chạy', async () => {
    askPrompts.length = 0;
    askReplies.push(
      JSON.stringify({ reply: '', reads: [{ tool: 'command', name: 'fpt_unit_get', args: { function: 'UserService.register' } }, { tool: 'command', name: 'raid_create', args: {} }] }),
      JSON.stringify({
        reply: 'I propose two boundary cases.',
        actions: [
          { type: 'command', command: 'fpt_unit_add_cases', args: { function: 'UserService.register', cases: [{ type: 'B', O: [{ group: 'email', value: '' }] }] }, summary: 'Add UTCID06 (boundary)' },
          { type: 'command', command: 'delete_everything', args: {} },
          { type: 'command', command: 'fpt_unit_list', args: {} },
          { type: 'command', command: 'raid_create', args: { type: 'NOPE' } },
        ],
      }),
    );
    const before = await prisma.workUnitCase.count({ where: { function: { projectId: pid } } });
    const r = await call(dev, 'POST', `/projects/${pid}/ai/chat`, { message: 'Add a boundary test for register' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.actions.length, 1);
    assert.equal(r.data.actions[0].command, 'fpt_unit_add_cases');
    assert.match(askPrompts[0], /fpt_unit_add_cases\(function:/, 'mục lục lệnh nằm trong prompt');
    assert.match(askPrompts[0], /WRITE commands — you can NOT run them/);
    assert.match(askPrompts[1], /Command results/);
    assert.match(askPrompts[1], /UTCID05/, 'kết quả lệnh đọc thật đưa vào lượt hỏi kế');
    assert.match(askPrompts[1], /raid_create: ERROR WORK_AI_BAD_COMMAND/, 'lệnh GHI xin như lệnh đọc ⇒ bị từ chối');
    assert.equal(await prisma.workUnitCase.count({ where: { function: { projectId: pid } } }), before, 'chưa Apply thì chưa ghi gì');

    // VIEWER không áp được đề xuất của người khác (không có issue.edit) — lệnh tự chặn ở service.
    const mid = r.data.answer.id;
    const v = await call(viewer, 'POST', `/projects/${pid}/ai/messages/${mid}/actions/0/apply`, {});
    assert.ok([403, 404].includes(v.status), `viewer: ${v.status}`);
    const ap = await call(dev, 'POST', `/projects/${pid}/ai/messages/${mid}/actions/0/apply`, {});
    assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    assert.equal(await prisma.workUnitCase.count({ where: { function: { projectId: pid } } }), before + 1);
    const again = await call(dev, 'POST', `/projects/${pid}/ai/messages/${mid}/actions/0/apply`, {});
    assert.ok(again.status >= 400, 'không áp hai lần');
  });

  it('A2 /ai/apply trực tiếp với lệnh: chạy bằng quyền người bấm; lệnh đọc / lệnh lạ ⇒ 400', async () => {
    const ok = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'command', command: 'raid_create', args: { type: 'ASSUMPTION', title: 'Users have cards' }, summary: 'Add assumption' } });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    assert.match(ok.data.summary, /^Add assumption — A-\d+/);
    const read = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'command', command: 'raid_list', args: {} } });
    assert.equal(read.status, 400);
    const unk = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'command', command: 'claim_issue', args: { issue: 1 } } });
    assert.equal(unk.status, 400);
    assert.equal(unk.code, 'WORK_AI_BAD_COMMAND');
    const ag = await call({ token: ext.token }, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'command', command: 'raid_create', args: { type: 'RISK', title: 'x' } } });
    assert.equal(ag.status, 403, 'token agent không dùng Ask AI của web');
  });

  // ═══ B: agent BUILTIN ═════════════════════════════════════════════

  let bot: { agentId: number; userId: number };

  it('B1 tạo agent BUILTIN: Pro ⇒ 201, không token, model theo work_agent, trần 5 $; không Pro ⇒ 402; > 3 ⇒ 400; không cấp token', async () => {
    const r = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'CT Tester', model: 'builtin', runtime: 'BUILTIN', projectIds: [pid] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.agent.runtime, 'BUILTIN');
    assert.equal(r.data.token, null);
    assert.equal(r.data.agent.dailyCostCapUsd, 5);
    assert.notEqual(r.data.agent.model, 'builtin');
    bot = { agentId: r.data.agent.id, userId: r.data.agent.userId };
    const nf = await call(free, 'POST', `/workspaces/${wsId}/agents`, { name: 'Nope', model: 'x', runtime: 'BUILTIN' });
    assert.equal(nf.status, 402);
    assert.equal(nf.code, 'WORK_PRO_REQUIRED');
    const tok = await call(owner, 'POST', `/workspaces/${wsId}/agents/${bot.agentId}/tokens`, { name: 'x', scopes: ['read'] });
    assert.equal(tok.status, 400);
    for (const n of ['B2', 'B3']) assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: n, model: 'x', runtime: 'BUILTIN' })).status, 201);
    const fourth = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'B4', model: 'x', runtime: 'BUILTIN' });
    assert.equal(fourth.status, 400);
    assert.equal(fourth.code, 'WORK_LIMIT');
    const bud = await call(owner, 'GET', `/workspaces/${wsId}/builtin-budget`);
    assert.equal(bud.status, 200);
    assert.deepEqual([bud.data.dailyCapUsd, bud.data.runCapUsd, bud.data.maxSteps, bud.data.canUse, bud.data.canEdit], [10, 2, 12, true, true]);
    assert.equal((await call(free, 'GET', `/workspaces/${wsId}/builtin-budget`)).data.canUse, false);
  });

  it('B2 "Assign to AI" (giao thẻ) ⇒ tự xếp lượt ⇒ vòng lặp gọi lệnh thật ⇒ request_review + nhả lease + chi phí GATEWAY', async () => {
    const issue = await mkIssue(owner, 'Viết test case 5.1 cho hàm OrderService.total', { descriptionJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'total(items) returns the sum; empty list returns 0; negative price throws.' }] }] } });
    llmSeen.length = 0;
    llmScript = [
      () => ({ text: JSON.stringify({ thought: 'add function', call: { name: 'fpt_unit_create_function', args: { moduleName: 'OrderService', methodName: 'total', loc: 20 } } }) }),
      () => ({ text: `Here: ${JSON.stringify({ thought: 'cases', call: { name: 'fpt_unit_add_cases', args: { function: 'OrderService.total', rows: [{ section: 'condition', group: 'items', value: '[]' }, { section: 'confirmation', group: 'Return', value: '0' }], cases: [{ type: 'B', O: [{ group: 'items', value: '[]' }, { group: 'Return', value: '0' }] }] } } })}` }),
      () => ({ text: JSON.stringify({ done: { summary: 'Added OrderService.total with UTCID02 (boundary: empty list).', outcome: 'review' } }) }),
    ];
    const pre = await issueRow(issue.number);
    const asg = await call(owner, 'PATCH', `/projects/${pid}/issues/${issue.number}`, { assigneeId: bot.userId, version: pre.version });
    assert.equal(asg.status, 200, JSON.stringify(asg.raw));
    const queued = await waitRun(issue.id);
    assert.ok(queued, 'giao thẻ ⇒ một lượt chạy được xếp');
    assert.equal(queued!.status, 'QUEUED');
    assert.equal(queued!.task, 'WRITE_TESTS');
    assert.equal(queued!.requestedById, owner.id);
    await (await builtin()).drainRuns();
    const run = await prisma.workAgentRun.findUniqueOrThrow({ where: { id: queued!.id } });
    assert.equal(run.status, 'DONE', `${run.error}`);
    assert.equal((run.steps as any[]).length, 3);
    assert.match((run.steps as any[])[0].text, /fpt_unit_create_function → ok/);
    const usage = await prisma.workAgentUsage.findMany({ where: { runId: run.id } });
    assert.equal(usage.length, 3);
    assert.ok(usage.every((u) => u.source === 'GATEWAY' && u.model === 'gpt-6-sol'));
    assert.ok(Number(run.costUsd) > 0);
    assert.ok(Math.abs(Number(run.costUsd) - usage.reduce((s, u) => s + Number(u.costUsd), 0)) < 1e-5);
    const after = await issueRow(issue.number);
    assert.equal(after.status.category, 'IN_PROGRESS');
    assert.match(after.status.name, /review/i, 'kết thúc ⇒ cột Review');
    assert.equal(await prisma.workAgentLease.count({ where: { issueId: issue.id, status: 'ACTIVE' } }), 0, 'lease đã nhả');
    assert.equal(await prisma.workAgentLease.count({ where: { issueId: issue.id } }), 1, 'chip lease có dùng');
    const fn = await prisma.workUnitFunction.findFirst({ where: { projectId: pid, methodName: 'total' }, select: { _count: { select: { cases: true } } } });
    assert.equal(fn?._count.cases, 2);
    const comments = await prisma.workComment.findMany({ where: { issueId: issue.id }, select: { authorId: true, bodyText: true } }).catch(async () => prisma.workComment.findMany({ where: { issueId: issue.id }, select: { authorId: true } }) as any);
    assert.ok(comments.some((c: any) => c.authorId === bot.userId), 'bình luận tóm tắt của agent');
    // Prompt: luật cố định + mục lục lệnh + thẻ đã đọc sẵn, project tự điền
    assert.match(llmSeen[0].system, /fpt_unit_add_cases\(function:/);
    assert.doesNotMatch(llmSeen[0].system, /claim_issue|report_usage|request_review/);
    assert.match(llmSeen[0].messages[0].content, /Task: WRITE_TESTS/);
    assert.match(llmSeen[0].messages[0].content, /negative price throws/);
    // Chi phí lên khối Agent activity (đo thật) + trang agent
    const act = await call(owner, 'GET', `/projects/${pid}/issues/${issue.number}/agent-activity`);
    assert.ok(act.data.usage.totals.gateway > 0);
    const runs = await call(owner, 'GET', `/workspaces/${wsId}/agents/${bot.agentId}/runs`);
    assert.equal(runs.status, 200);
    assert.ok(runs.data.spend.todayUsd > 0);
    assert.equal(runs.data.runs[0].status, 'DONE');
    const ir = await call(dev, 'GET', `/projects/${pid}/issues/${issue.number}/agent-runs`);
    assert.equal(ir.data[0].agent.userId, bot.userId);
  });

  it('B3 người KHÔNG Pro giao thẻ cho agent BUILTIN ⇒ lượt FAILED (PRO_REQUIRED) + bình luận, không gọi model; POST agent-runs ⇒ 402', async () => {
    const issue = await mkIssue(free, 'Analyse login flow');
    const calls = llmSeen.length;
    const pre = await issueRow(issue.number);
    await call(free, 'PATCH', `/projects/${pid}/issues/${issue.number}`, { assigneeId: bot.userId, version: pre.version });
    const run = await waitRun(issue.id);
    assert.equal(run?.status, 'FAILED');
    assert.match(run?.error ?? '', /PRO_REQUIRED/);
    await (await builtin()).drainRuns();
    assert.equal(llmSeen.length, calls);
    const r = await call(free, 'POST', `/projects/${pid}/issues/${issue.number}/agent-runs`, {});
    assert.equal(r.status, 402);
    const ag = await call({ token: ext.token }, 'POST', `/projects/${pid}/issues/${issue.number}/agent-runs`, {});
    assert.equal(ag.status, 403, 'token agent không khởi động agent dựng sẵn');
  });

  it('B4 rào chắn trong vòng lặp: lệnh bị cấm / lệnh lạ trả lỗi cho model; "blocked" ⇒ ask_lead + cờ', async () => {
    const issue = await mkIssue(owner, 'Send the tracking file');
    llmScript = [
      () => ({ text: JSON.stringify({ call: { name: 'export_file', args: { kind: 'project_tracking' } } }) }),
      () => ({ text: JSON.stringify({ call: { name: 'approve_everything', args: {} } }) }),
      () => ({ text: JSON.stringify({ done: { summary: 'I cannot export Project Tracking.', outcome: 'blocked', question: 'Can a person export it?' } }) }),
    ];
    const r = await call(owner, 'POST', `/projects/${pid}/issues/${issue.number}/agent-runs`, { agentId: bot.agentId, task: 'CUSTOM' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    await (await builtin()).drainRuns();
    const run = await prisma.workAgentRun.findUniqueOrThrow({ where: { id: r.data.run.id } });
    assert.equal(run.status, 'DONE');
    const steps = run.steps as any[];
    assert.match(steps[0].text, /WORK_AGENT_FORBIDDEN/);
    assert.match(steps[1].text, /Unknown command/);
    const row = await issueRow(issue.number);
    assert.ok(row.flaggedAt, 'bị chặn ⇒ cờ Blocked');
    assert.equal(row.assigneeId, bot.userId, 'POST agent-runs giao thẻ cho agent');
  });

  it('B5 trần mỗi lượt ⇒ CAPPED + bình luận + cờ + nhả lease; trần không gian đặt được (admin), không admin ⇒ 403', async () => {
    assert.equal((await call(dev, 'PUT', `/workspaces/${wsId}/builtin-budget`, { runCapUsd: 0.01 })).status, 403);
    const put = await call(owner, 'PUT', `/workspaces/${wsId}/builtin-budget`, { runCapUsd: 0.01 });
    assert.equal(put.status, 200);
    assert.equal(put.data.runCapUsd, 0.01);
    const issue = await mkIssue(owner, 'Analyse checkout');
    llmScript = [() => ({ text: JSON.stringify({ call: { name: 'get_issue', args: { issue: 1 } } }), inputTokens: 50_000, outputTokens: 5_000 })];
    const r = await call(owner, 'POST', `/projects/${pid}/issues/${issue.number}/agent-runs`, { agentId: bot.agentId });
    await (await builtin()).drainRuns();
    const run = await prisma.workAgentRun.findUniqueOrThrow({ where: { id: r.data.run.id } });
    assert.equal(run.status, 'CAPPED');
    assert.match(run.error ?? '', /cost cap for one run/);
    const row = await issueRow(issue.number);
    assert.match(row.flagReason ?? '', /Built-in agent stopped/);
    assert.equal(await prisma.workAgentLease.count({ where: { issueId: row.id, status: 'ACTIVE' } }), 0);
    await call(owner, 'PUT', `/workspaces/${wsId}/builtin-budget`, { runCapUsd: 2, maxSteps: 2 });
  });

  it('B6 hết bước ⇒ FAILED; JSON hỏng 2 lần ⇒ FAILED; không thử lại', async () => {
    const i1 = await mkIssue(owner, 'Loop forever');
    llmScript = [
      () => ({ text: JSON.stringify({ call: { name: 'sprint_current', args: {} } }) }),
      () => ({ text: JSON.stringify({ call: { name: 'sprint_current', args: {} } }) }),
    ];
    const r1 = await call(owner, 'POST', `/projects/${pid}/issues/${i1.number}/agent-runs`, { agentId: bot.agentId });
    await (await builtin()).drainRuns();
    const run1 = await prisma.workAgentRun.findUniqueOrThrow({ where: { id: r1.data.run.id } });
    assert.equal(run1.status, 'FAILED');
    assert.match(run1.error ?? '', /step limit \(2\)/);
    assert.match(llmSeen[llmSeen.length - 1].messages.at(-1).content, /LAST reply/);
    await call(owner, 'PUT', `/workspaces/${wsId}/builtin-budget`, { maxSteps: 12 });

    const i2 = await mkIssue(owner, 'Talk nonsense');
    llmScript = [() => ({ text: 'Sure! I will do it.' }), () => ({ text: '{"plan": 1}' })];
    const r2 = await call(owner, 'POST', `/projects/${pid}/issues/${i2.number}/agent-runs`, { agentId: bot.agentId });
    await (await builtin()).drainRuns();
    const run2 = await prisma.workAgentRun.findUniqueOrThrow({ where: { id: r2.data.run.id } });
    assert.equal(run2.status, 'FAILED');
    assert.match(run2.error ?? '', /expected format/);
    assert.equal(await prisma.workAgentRun.count({ where: { issueId: i2.id } }), 1, 'không tự thử lại');
  });

  it('B7 dừng: QUEUED ⇒ CANCELLED ngay, không chạy; người lạ không dừng được; một thẻ một lượt đang chờ', async () => {
    const issue = await mkIssue(owner, 'Will be stopped');
    const r = await call(owner, 'POST', `/projects/${pid}/issues/${issue.number}/agent-runs`, { agentId: bot.agentId });
    assert.equal(r.status, 201);
    const dup = await call(owner, 'POST', `/projects/${pid}/issues/${issue.number}/agent-runs`, { agentId: bot.agentId });
    assert.equal(dup.status, 200);
    assert.equal(dup.data.run.id, r.data.run.id);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/agent-runs/${r.data.run.id}/cancel`, {})).status, 403);
    const c = await call(owner, 'POST', `/projects/${pid}/agent-runs/${r.data.run.id}/cancel`, {});
    assert.equal(c.status, 200);
    assert.equal(c.data.status, 'CANCELLED');
    const calls = llmSeen.length;
    await (await builtin()).drainRuns();
    assert.equal(llmSeen.length, calls);
  });

  it('B8 agent PAUSED ⇒ không chạy (423 khi yêu cầu)', async () => {
    await call(owner, 'POST', `/workspaces/${wsId}/agents/${bot.agentId}/pause`, {});
    const issue = await mkIssue(owner, 'Paused agent');
    const r = await call(owner, 'POST', `/projects/${pid}/issues/${issue.number}/agent-runs`, { agentId: bot.agentId });
    assert.equal(r.status, 423);
    await call(owner, 'POST', `/workspaces/${wsId}/agents/${bot.agentId}/resume`, {});
  });
});
