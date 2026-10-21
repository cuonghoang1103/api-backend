/**
 * 21/10/2026 — CuongMini NGANG QUYỀN NGƯỜI qua MCP (HTTP + Postgres cục bộ, mạng ngoài GIẢ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.parity.db.test.ts
 *
 *   Sự cố gốc: "CT Work chưa cho mình cách điền Executed By hoặc xoá các dòng đó" (ma trận 5.1 còn 4 dòng nháp).
 *   • 5.1: fpt_unit_update_function (Executed By, LOC…), fpt_unit_delete_cases notRun / fpt_unit_delete_rows unused,
 *     fpt_unit_update_rows, fpt_unit_move, fpt_unit_duplicate_function, fpt_unit_delete_function; bìa + Record of change.
 *   • 5.2/5.3: fpt_it_update_module / update_cases / delete_cases / move_case / delete_module.
 *   • Thẻ: issue_delete (reporter / admin như web) + issue_restore, comment_edit / comment_delete, issue_custom_fields_set.
 *   • Docs: docs_page_update (không tự APPROVED), docs_page_move, docs_page_delete + docs_page_restore.
 *   • Xray: test_update, test_cycle_update / test_cycle_delete. Họp: meeting_create / update / delete.
 *   • project_repos: kết nối GitHub + link repo trong Resources ⇒ URL clone + nhánh mặc định.
 *   • Rào: lệnh xoá có destructiveHint; agent không thấy + gọi thẳng ⇒ WORK_AGENT_FORBIDDEN; REST DELETE của agent ⇒ 403.
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
import { _setResourceNetForTests } from '../services/work/resources.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `pa${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — CuongMini ngang quyền người (MCP)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let wsId = 0, pid = 0, cfg: any;
  let devTok = '', leadTok = '', agentTok = '', agentUserId = 0;
  let rpcId = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret), email, username };
  }
  async function call(u: { token: string }, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json, code: json?.error?.code ?? json?.code };
  }
  async function rpc(token: string, method: string, params: Record<string, unknown> = {}) {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
    });
    return (await res.json()) as any;
  }
  async function tool(token: string, name: string, args: Record<string, unknown> = {}) {
    const b = await rpc(token, 'tools/call', { name, arguments: args });
    if (b.error) return { isError: true, text: String(b.error.message), out: null as any };
    const text = String(b.result.content[0].text);
    let out: any = null;
    try { out = JSON.parse(text); } catch { /* chữ */ }
    return { isError: b.result.isError === true, text, out };
  }
  const ok = <T extends { isError: boolean; text: string }>(r: T): T => { assert.equal(r.isError, false, r.text); return r; };
  const denied = (r: { isError: boolean; text: string }, code: RegExp) => { assert.equal(r.isError, true, r.text); assert.match(r.text, code); };
  // 22/10/2026: lệnh xoá của AI KHÔNG chạy ngay — thành yêu cầu chờ trưởng nhóm duyệt; lead duyệt trên web ⇒ lệnh chạy dưới
  // quyền người gửi. okDel/deniedDel = gửi lệnh ⇒ thấy PENDING_APPROVAL (chưa xoá gì) ⇒ duyệt ⇒ kết quả thật.
  async function viaApproval(p: Promise<{ isError: boolean; text: string; out: any }>) {
    const r = ok(await p);
    assert.equal(r.out?.status, 'PENDING_APPROVAL', r.text);
    const a = await call(lead, 'POST', `/delete-requests/${r.out.request}/approve`, {});
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    return a.data as { status: string; error: string | null; result: { output: any; trash: Array<{ id: number }> } };
  }
  const okDel = async (p: Promise<{ isError: boolean; text: string; out: any }>) => {
    const v = await viaApproval(p);
    assert.equal(v.status, 'APPROVED', v.error ?? '');
    return { isError: false, out: v.result.output, text: JSON.stringify(v.result.output) };
  };
  const deniedDel = async (p: Promise<{ isError: boolean; text: string; out: any }>, code: RegExp) => {
    const v = await viaApproval(p);
    assert.equal(v.status, 'FAILED');
    assert.match(String(v.error), code);
  };
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '20mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev] = await Promise.all(['lead', 'dev'].map((n) => mkUser(n)));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `PA ${tag}` })).data;
    wsId = ws.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'LF', name: 'LabFlow Demo', template: 'BLANK', kind: 'SCHOOL', visibility: 'PRIVATE' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { docs: true, meetings: true, resources: true } })).status, 200);
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'CuongMini · dev', scopes: ['read', 'write'] })).data.token;
    leadTok = (await call(lead, 'POST', '/me/api-tokens', { name: 'CuongMini · lead', scopes: ['read', 'write'] })).data.token;
    const a = await call(lead, 'POST', `/workspaces/${wsId}/agents`, { name: 'Bot', model: 'gpt-6-sol', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    agentTok = a.data.token.token;
    agentUserId = a.data.agent.userId;
    await call(lead, 'PUT', `/projects/${pid}/members/${agentUserId}`, { role: 'MEMBER' });
    // GitHub API giả: nhánh mặc định "develop"; DNS giả trả IP công khai.
    _setResourceNetForTests({
      fetch: async (url) => (url.startsWith('https://api.github.com/repos/')
        ? new Response(JSON.stringify({ full_name: url.split('/repos/')[1], default_branch: 'develop', description: 'LabFlow', stargazers_count: 1 }), { headers: { 'content-type': 'application/json' } })
        : new Response('<title>x</title>', { headers: { 'content-type': 'text/html' } })),
      lookup: async () => [{ address: '140.82.112.3' }],
    });
  });

  after(async () => {
    _setResourceNetForTests(null);
    server?.close();
    const ids = [...userIds, agentUserId].filter(Boolean);
    await prisma.workAiCall.deleteMany({ where: { OR: [{ workspaceId: wsId }, { userId: { in: ids } }] } });
    await prisma.workInvite.deleteMany({ where: { workspaceId: wsId } });
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.workApiToken.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  it('tools/list: lệnh xoá có destructiveHint, người thấy, agent không thấy; agent gọi thẳng ⇒ WORK_AGENT_FORBIDDEN', async () => {
    const list = async (tok: string) => (await rpc(tok, 'tools/list')).result.tools as Array<{ name: string; annotations: { destructiveHint: boolean; readOnlyHint: boolean } }>;
    const nguoi = await list(devTok);
    const agent = (await list(agentTok)).map((t) => t.name);
    for (const n of ['fpt_unit_delete_cases', 'fpt_unit_delete_rows', 'fpt_unit_delete_function', 'fpt_it_delete_cases', 'issue_delete', 'docs_page_delete', 'comment_delete']) {
      const t = nguoi.find((x) => x.name === n);
      assert.ok(t, `${n} có cho người`);
      assert.equal(t!.annotations.destructiveHint, true, `${n} destructiveHint`);
      assert.ok(!agent.includes(n), `${n} agent không thấy`);
    }
    assert.equal(nguoi.find((x) => x.name === 'fpt_unit_update_function')!.annotations.destructiveHint, false);
    assert.equal(nguoi.find((x) => x.name === 'project_repos')!.annotations.readOnlyHint, true);
    assert.ok(agent.includes('fpt_unit_update_function') && agent.includes('fpt_unit_record_results'));
    const f = ok(await tool(devTok, 'fpt_unit_create_function', { project: 'LF', moduleName: 'AuthService', methodName: 'probe' })).out.created.id;
    denied(await tool(agentTok, 'fpt_unit_delete_cases', { project: 'LF', function: f, notRun: true }), /WORK_AGENT_FORBIDDEN/);
    denied(await tool(agentTok, 'fpt_unit_delete_function', { project: 'LF', function: f }), /WORK_AGENT_FORBIDDEN/);
    // Tầng tuyến REST: agent không DELETE sheet test.
    const r = await fetch(`${base}/api/v1/work/projects/${pid}/fpt-tests/unit/${f}`, { method: 'DELETE', headers: { Authorization: `Bearer ${agentTok}` } });
    assert.equal(r.status, 403);
    await okDel(tool(devTok, 'fpt_unit_delete_function', { project: 'LF', function: f }));
  });

  it('5.1: Executed By / LOC, xoá UTCID nháp + dòng thừa, sửa dòng, dời, nhân bản, xoá hàm', async () => {
    const c = ok(await tool(devTok, 'fpt_unit_create_function', { project: 'LF', moduleName: 'AuthService', methodName: 'verifyEmail' })).out;
    const fid = c.created.id;
    ok(await tool(devTok, 'fpt_unit_add_cases', {
      project: 'LF', function: 'AuthService.verifyEmail',
      rows: [{ section: 'condition', group: 'token', value: 'valid' }, { section: 'condition', group: 'token', value: 'expired' }, { section: 'condition', group: 'token', value: 'draft-unused' }],
      cases: [
        { type: 'N', O: [{ group: 'token', value: 'valid' }], result: 'P' },
        { type: 'A', O: [{ group: 'token', value: 'expired' }] },
        { type: 'B', O: [{ group: 'token', value: 'expired' }] },
      ],
    }));
    // Executed By + LOC (lý do của đợt này)
    const u = ok(await tool(devTok, 'fpt_unit_update_function', { project: 'LF', function: fid, executedBy: 'Long Bui', loc: 120, codeRef: 'src/auth/AuthService.java#verifyEmail' })).out;
    assert.deepEqual(u.updated.sort(), ['codeRef', 'executedBy', 'loc']);
    assert.equal(u.matrix.function.executedBy, 'Long Bui');
    const row = await prisma.workUnitFunction.findUniqueOrThrow({ where: { id: fid } });
    assert.equal(row.executedBy, 'Long Bui');
    assert.equal(row.loc, 120);
    denied(await tool(devTok, 'fpt_unit_update_function', { project: 'LF', function: fid }), /Nothing to change/);
    // fpt_unit_list hiện Executed By + số chưa chạy
    const list = ok(await tool(devTok, 'fpt_unit_list', { project: 'LF' })).text;
    assert.match(list, /"executedBy": "Long Bui"/);
    assert.match(list, /"notRun": 3/); // 1 case N mẫu + 2 case A/B chưa chạy
    // Xoá UTCID chưa chạy (nháp): còn đúng case đã P, đánh số lại UTCID01
    const d = (await okDel(tool(devTok, 'fpt_unit_delete_cases', { project: 'LF', function: fid, notRun: true }))).out;
    assert.equal(d.deleted.length, 3);
    assert.equal(d.matrix.cases.length, 1);
    assert.equal(d.matrix.cases[0].utcid, 'UTCID01');
    assert.equal(d.matrix.cases[0].result, 'P');
    // Dòng không case nào đánh "O" ⇒ xoá được bằng unused
    const r = (await okDel(tool(devTok, 'fpt_unit_delete_rows', { project: 'LF', function: fid, unused: true }))).out;
    assert.ok(r.deleted.some((x: any) => x.value === 'draft-unused'));
    assert.ok(r.matrix.rows.every((x: any) => x.value !== 'expired'));
    assert.ok(r.matrix.rows.some((x: any) => x.value === 'valid'));
    // Sửa giá trị một dòng; dấu O giữ nguyên
    const validRow = r.matrix.rows.find((x: any) => x.value === 'valid').row;
    const e = ok(await tool(devTok, 'fpt_unit_update_rows', { project: 'LF', function: fid, rows: [{ row: validRow, value: 'valid-token-123' }] })).out;
    assert.equal(e.matrix.cases[0].O.length, 1);
    assert.ok(e.matrix.rows.some((x: any) => x.value === 'valid-token-123'));
    // Đổi loại case + kết quả chỉ trường truyền vào
    const t = ok(await tool(devTok, 'fpt_unit_record_results', { project: 'LF', function: fid, results: [{ case: 'UTCID01', type: 'B' }] })).out;
    assert.equal(t.matrix.cases[0].type, 'B');
    assert.equal(t.matrix.cases[0].result, 'P', 'result giữ nguyên khi không truyền');
    // Thêm 2 case rồi dời case cuối lên đầu
    // id dòng đổi sau mỗi lần lưu ma trận ⇒ trỏ dòng bằng {group, value} (hoặc đọc lại id từ kết quả mới nhất)
    ok(await tool(devTok, 'fpt_unit_add_cases', { project: 'LF', function: fid, cases: [{ type: 'N', O: [{ group: 'token', value: 'valid-token-123' }] }, { type: 'A', O: [{ group: 'token', value: 'valid-token-123' }], result: 'F' }] }));
    const mv = ok(await tool(devTok, 'fpt_unit_move', { project: 'LF', function: fid, case: 'UTCID03', to: 1 })).out;
    assert.equal(mv.matrix.cases[0].result, 'F');
    // Nhân bản + xoá hàm
    const dup = ok(await tool(devTok, 'fpt_unit_duplicate_function', { project: 'LF', function: fid })).out;
    assert.match(dup.created.function, /verifyEmail \(copy\)/);
    const del = (await okDel(tool(devTok, 'fpt_unit_delete_function', { project: 'LF', function: dup.created.id }))).out;
    assert.equal(del.deleted.id, dup.created.id);
    assert.equal(await prisma.workUnitFunction.count({ where: { id: dup.created.id } }), 0);
    await deniedDel(tool(devTok, 'fpt_unit_delete_cases', { project: 'LF', function: fid }), /notRun/);
  });

  it('bìa + Record of change', async () => {
    const u = ok(await tool(devTok, 'fpt_doc_update', { project: 'LF', creator: 'Cuong', reviewer: 'Thay Hung', version: '1.1' })).text;
    assert.match(u, /"reviewer"|Thay Hung/);
    const c = ok(await tool(devTok, 'fpt_change_add', { project: 'LF', report: 'UNIT', effectiveDate: '2026-10-21', version: '1.1', action: 'M', description: 'Executed By' })).out;
    ok(await tool(devTok, 'fpt_change_update', { project: 'LF', id: c.created.id, description: 'Filled Executed By' }));
    const g = ok(await tool(devTok, 'fpt_doc_get', { project: 'LF' })).text;
    assert.match(g, /Filled Executed By/);
    await okDel(tool(devTok, 'fpt_change_delete', { project: 'LF', id: c.created.id }));
    assert.equal(await prisma.workFptChange.count({ where: { id: c.created.id } }), 0);
  });

  it('5.2/5.3: sửa module + case, xoá case chưa chạy, dời, xoá module', async () => {
    const m = ok(await tool(devTok, 'fpt_it_create_module', { project: 'LF', kind: 'integration', name: 'Auth flow', idPrefix: 'AT' })).out.created;
    ok(await tool(devTok, 'fpt_it_add_cases', { project: 'LF', kind: 'integration', module: m.id, cases: [{ description: 'login ok' }, { description: 'login bad' }, { description: 'draft' }] }));
    ok(await tool(devTok, 'fpt_it_record_round', { project: 'LF', kind: 'integration', module: 'Auth flow', results: [{ case: 'AT01', round: 1, status: 'Passed' }, { case: 'AT02', round: 1, status: 'Failed' }] }));
    const u = ok(await tool(devTok, 'fpt_it_update_cases', { project: 'LF', kind: 'integration', module: m.id, cases: [{ case: 'AT02', expected: 'Error 401', clearRound: 1 }] })).out;
    assert.equal(u.sheet.cases[1].expected, 'Error 401');
    assert.equal(u.sheet.cases[1].rounds[0].status, null);
    const d = (await okDel(tool(devTok, 'fpt_it_delete_cases', { project: 'LF', kind: 'integration', module: m.id, notRun: true }))).out;
    assert.deepEqual(d.deleted.map((x: any) => x.id), ['AT02', 'AT03']);
    assert.equal(d.sheet.cases.length, 1);
    ok(await tool(devTok, 'fpt_it_add_cases', { project: 'LF', kind: 'integration', module: m.id, cases: [{ description: 'logout' }] }));
    const mv = ok(await tool(devTok, 'fpt_it_move_case', { project: 'LF', kind: 'integration', module: m.id, case: 'AT02', to: 1 })).out;
    assert.equal(mv.sheet.cases[0].description, 'logout');
    const up = ok(await tool(devTok, 'fpt_it_update_module', { project: 'LF', kind: 'integration', module: m.id, name: 'Auth integration', testRequirement: 'Login + logout' })).out;
    assert.equal(up.sheet.module.name, 'Auth integration');
    // Sai loại (system) ⇒ không đụng
    await deniedDel(tool(devTok, 'fpt_it_delete_module', { project: 'LF', kind: 'system', module: m.id }), /not a system test workflow|NOT_FOUND/i);
    await okDel(tool(devTok, 'fpt_it_delete_module', { project: 'LF', kind: 'integration', module: m.id }));
    assert.equal(await prisma.workItModule.count({ where: { id: m.id } }), 0);
  });

  it('thẻ: xoá đúng quyền (reporter / admin), khôi phục, sửa/xoá bình luận, trường tuỳ chỉnh không rõ ⇒ lỗi rõ', async () => {
    const leadIssue = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title: 'lead task' })).data;
    await deniedDel(tool(devTok, 'issue_delete', { project: 'LF', issue: leadIssue.number }), /FORBIDDEN|reporter/i);
    const mine = ok(await tool(devTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'mine' })).out;
    const n = mine.number ?? Number(String(mine.key ?? mine.created).split('-')[1]);
    const c = ok(await tool(devTok, 'comment', { project: 'LF', issue: n, markdown: 'first draft' })).out;
    const cid = c.commentId ?? c.id ?? c.comment;
    assert.ok(cid, JSON.stringify(c));
    ok(await tool(devTok, 'comment_edit', { project: 'LF', issue: n, comment: cid, markdown: 'edited text' }));
    const cm = await prisma.workComment.findUniqueOrThrow({ where: { id: cid } });
    assert.match(JSON.stringify(cm.bodyJson), /edited text/);
    await okDel(tool(devTok, 'comment_delete', { project: 'LF', issue: n, comment: cid }));
    denied(await tool(devTok, 'issue_custom_fields_set', { project: 'LF', issue: n, fields: [{ field: 'Nope', value: 'x' }] }), /Unknown custom field/);
    await okDel(tool(devTok, 'issue_delete', { project: 'LF', issue: n }));
    assert.ok((await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n } })).deletedAt);
    ok(await tool(leadTok, 'issue_restore', { project: 'LF', issue: n }));
    assert.equal((await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n } })).deletedAt, null);
    const cl = ok(await tool(devTok, 'issue_clone', { project: 'LF', issue: n })).out;
    assert.match(cl.created, /^LF-\d+$/);
  });

  it('Docs: sửa tiêu đề + thay nội dung + IN_REVIEW, không tự APPROVED; dời; xoá vào thùng rác + khôi phục', async () => {
    const pg = ok(await tool(devTok, 'docs_draft_page', { project: 'LF', title: 'Test plan', markdown: '## Scope\nold' })).out;
    const parent = ok(await tool(devTok, 'docs_draft_page', { project: 'LF', title: 'Reports', markdown: 'x' })).out;
    const u = ok(await tool(devTok, 'docs_page_update', { project: 'LF', page: pg.number, title: 'Test plan v2', markdown: '## Scope\nnew scope', status: 'IN_REVIEW' })).out;
    assert.equal(u.title, 'Test plan v2');
    const row = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: pg.number } });
    assert.match(JSON.stringify(row.contentJson), /new scope/);
    assert.equal(row.status, 'IN_REVIEW');
    denied(await tool(devTok, 'docs_page_update', { project: 'LF', page: pg.number, status: 'APPROVED' }), /status|Invalid/i);
    ok(await tool(devTok, 'docs_page_move', { project: 'LF', page: pg.number, parent: parent.number }));
    const moved = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: pg.number }, select: { parentId: true } });
    assert.ok(moved.parentId);
    await okDel(tool(devTok, 'docs_page_delete', { project: 'LF', page: pg.number }));
    assert.ok((await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: pg.number } })).deletedAt);
    ok(await tool(devTok, 'docs_page_restore', { project: 'LF', page: pg.number }));
    assert.equal((await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: pg.number } })).deletedAt, null);
  });

  it('SRS: sửa use case / actor theo tên, không có trạng thái APPROVED; xoá; Docs liên kết thẻ', async () => {
    ok(await tool(devTok, 'srs_add_actor', { project: 'LF', name: 'Student' }));
    const uc = ok(await tool(devTok, 'srs_propose_use_case', { project: 'LF', name: 'Verify email', description: 'old' })).out;
    const ucN = Number(String(uc.proposed).replace(/\D/g, ''));
    assert.ok(ucN > 0, JSON.stringify(uc));
    ok(await tool(devTok, 'srs_use_case_update', { project: 'LF', useCase: `UC-${ucN}`, description: 'Click the link in the email', normalFlow: '1. Open link\n2. Account active' }));
    denied(await tool(devTok, 'srs_use_case_update', { project: 'LF', useCase: ucN, status: 'APPROVED' }), /Nothing to change|status/);
    ok(await tool(devTok, 'srs_actor_update', { project: 'LF', actor: 'student', description: 'FPT student' }));
    const a = await prisma.workSrsActor.findFirstOrThrow({ where: { projectId: pid, name: 'Student' } });
    assert.equal(a.description, 'FPT student');
    await okDel(tool(devTok, 'srs_delete', { project: 'LF', kind: 'actor', item: 'Student' }));
    assert.equal(await prisma.workSrsActor.count({ where: { id: a.id } }), 0);
    const pg = ok(await tool(devTok, 'docs_draft_page', { project: 'LF', title: 'SRS', markdown: 'x' })).out;
    const iss = ok(await tool(devTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'linked' })).out;
    const n = iss.number ?? Number(String(iss.key ?? iss.created).split('-')[1]);
    ok(await tool(devTok, 'docs_page_link_issue', { project: 'LF', page: pg.number, issue: n }));
    ok(await tool(devTok, 'docs_page_link_issue', { project: 'LF', page: pg.number, issue: n, unlink: true }));
  });

  it('Xray: sửa test case (thay bước), sửa + xoá test cycle', async () => {
    await call(lead, 'POST', `/projects/${pid}/tests/enable`, {});
    const t = ok(await tool(devTok, 'test_create', { project: 'LF', title: 'Login works', steps: [{ action: 'open' }] })).out;
    const u = ok(await tool(devTok, 'test_update', { project: 'LF', test: t.number, title: 'Login works (v2)', steps: [{ action: 'open', expected: 'form' }, { action: 'submit', expected: 'home' }] })).out;
    assert.equal(u.steps, 2);
    const cy = ok(await tool(devTok, 'test_cycle_create', { project: 'LF', name: 'Sprint 1', tests: [t.number] })).out;
    ok(await tool(devTok, 'test_cycle_update', { project: 'LF', cycle: cy.cycle, name: 'Sprint 1 — rerun', build: 'v1.0.1' }));
    assert.equal((await prisma.workTestCycle.findUniqueOrThrow({ where: { id: cy.cycle } })).name, 'Sprint 1 — rerun');
    await okDel(tool(devTok, 'test_cycle_delete', { project: 'LF', cycle: cy.cycle }));
    assert.equal(await prisma.workTestCycle.count({ where: { id: cy.cycle } }), 0);
  });

  it('họp: tạo (không gửi mời mặc định), sửa biên bản Markdown, xoá', async () => {
    const m = ok(await tool(devTok, 'meeting_create', { project: 'LF', title: 'Sprint review', start: '2026-10-22T14:00:00+07:00', end: '2026-10-22T15:00:00+07:00', agenda: '- demo\n- retro', attendees: ['me'] }));
    ok(await tool(devTok, 'meeting_update', { project: 'LF', meeting: m.out.created, minutes: '## Decisions\n- ship', status: 'DONE' }));
    const row = await prisma.workMeeting.findFirstOrThrow({ where: { projectId: pid, number: m.out.created } });
    assert.equal(row.status, 'DONE');
    assert.match(JSON.stringify(row.minutesJson), /ship/);
    await okDel(tool(devTok, 'meeting_delete', { project: 'LF', meeting: m.out.created }));
  });

  it('project_repos: kết nối GitHub + link repo trong Resources ⇒ URL clone + nhánh mặc định; không có repo ⇒ câu hướng dẫn', async () => {
    const none = ok(await tool(devTok, 'project_repos', { project: 'LF' })).text;
    assert.match(none, /No code repository is linked/);
    await prisma.workGithubConnection.create({ data: { projectId: pid, repoFullName: 'acme/labflow-demo', secret: 's' } });
    ok(await tool(devTok, 'resource_add', { project: 'LF', url: 'https://gitlab.com/acme/labflow-mobile', title: 'Mobile repo' }));
    const r = ok(await tool(devTok, 'project_repos', { project: 'LF' })).text;
    assert.match(r, /"cloneHttps": "https:\/\/github.com\/acme\/labflow-demo.git"/);
    assert.match(r, /"defaultBranch": "develop"/);
    assert.match(r, /"cloneSsh": "git@gitlab.com:acme\/labflow-mobile.git"/);
    assert.match(r, /git clone/);
    // resource_update / resource_delete theo URL
    ok(await tool(devTok, 'resource_update', { project: 'LF', resource: 'https://gitlab.com/acme/labflow-mobile', description: 'Flutter app' }));
    const del = okDel(tool(devTok, 'resource_delete', { project: 'LF', resource: 'https://gitlab.com/acme/labflow-mobile' }));
    // Xoá link của người khác / của mình theo luật Resources (người thêm hoặc admin) — người thêm là dev ⇒ được.
    await del;
  });
});
