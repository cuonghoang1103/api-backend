/**
 * CT Work 28/10/2026 — trợ lý web làm được mọi việc như trên web, qua HTTP thật + Postgres cục bộ (model GIẢ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.aiTroLyWeb.db.test.ts
 *
 *   S1  tìm lệnh (find_commands) ⇒ đọc (read_command, lệnh trước đây chỉ MCP) ⇒ đề xuất hàng loạt 4 UTCID ⇒ người dùng bỏ
 *       tick 1 mục ⇒ Apply ⇒ đúng 3 UTCID mới trong Report 5.1; đề xuất sửa hàm (lệnh trước đây chỉ MCP) ⇒ Apply ⇒ đã đổi
 *   S2  đề xuất GHI KẾT QUẢ chạy test ⇒ cờ recordsResults; Apply không xác nhận ⇒ 409 WORK_AI_CONFIRM_RAN; có xác nhận ⇒ ghi
 *   S3  đề xuất XOÁ ⇒ cờ danger 'delete'; Apply ⇒ chỉ TẠO YÊU CẦU XOÁ chờ trưởng nhóm, dữ liệu còn nguyên
 *   S4  sinh viên (MEMBER) đề xuất việc của trưởng nhóm (đổi vai thành viên) ⇒ Apply bị từ chối, không gì đổi
 *   S5  lệnh ngoài bộ web (tải URL, lệnh agent) ⇒ bị loại, không thành thẻ Apply
 *   S6  việc trên máy người dùng ⇒ câu chuẩn theo vỏ (app CuongThai ⇒ "AI Code ngay trong app") + nhắc trong câu hỏi
 *   S7  agent thành viên KHÔNG đổi: lệnh xoá / quản trị qua MCP ⇒ vẫn bị chặn
 *   S8  đo cỡ system prompt (in ra để ghi vào báo cáo)
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
const tag = `tw${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work 28/10 — trợ lý web ngang quyền người (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, viewer: U;
  let wsId = 0, pid = 0, fid = 0;
  let devTok = '';
  let ext: { token: string; userId: number };
  let rpcId = 0;
  const prompts: Array<{ system: string; user: string }> = [];
  const replies: string[] = [];

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
    try { json = JSON.parse(text); } catch { /* chữ */ }
    return { isError: body.result.isError as boolean, text, json };
  }
  const cases = () => prisma.workUnitCase.findMany({ where: { functionId: fid }, orderBy: { position: 'asc' }, select: { position: true, type: true, result: true, note: true } });
  const ask = (u: U, message: string, extra: Record<string, unknown> = {}) => call(u, 'POST', `/projects/${pid}/ai/chat`, { message, ...extra });
  const answer = (reply: string, actions: unknown[]) => JSON.stringify({ reply, actions });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    (await import('../services/work/ai.service.js'))._setAskForTests(async (system, user) => {
      prompts.push({ system, user });
      return replies.shift() ?? '{"reply":"ok","actions":[]}';
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    owner = await mkUser('owner', true);
    [dev, viewer] = await Promise.all([mkUser('dev'), mkUser('viewer')]);
    (await import('../mcp/server.js'))._resetMcpRateForTests();
  });

  after(async () => {
    server?.close();
    (await import('../services/work/ai.service.js'))._setAskForTests(null);
    const agentUsers = wsId ? await prisma.workAgent.findMany({ where: { workspaceId: wsId }, select: { userId: true } }) : [];
    const ids = [...userIds, ...agentUsers.map((a) => a.userId)];
    if (ids.length) await prisma.workDeleteRequest.deleteMany({ where: { requestedById: { in: ids } } });
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: không gian + dự án SS (owner ADMIN, dev MEMBER, viewer VIEWER) + hàm 5.1 UserService.register + agent ngoài', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `TW ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    pid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SS', name: 'SWT301 SS', template: 'COMPANY', kind: 'CLIENT' })).data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'dev', scopes: ['read', 'write'] })).data.token;
    const c = await tool(devTok, 'fpt_unit_create_function', { project: 'SS', moduleName: 'UserService', methodName: 'register', loc: 40 });
    assert.equal(c.isError, false, c.text);
    fid = c.json.created.id;
    assert.equal((await cases()).length, 1, 'mẫu khởi đầu có 1 UTCID');
    const r = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Ext Bot', model: 'claude-sonnet-5', projectIds: [pid] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    ext = { token: r.data.token.token, userId: r.data.agent.userId };
  });

  it('S1 tìm lệnh ⇒ đọc ⇒ đề xuất 4 UTCID ⇒ bỏ tick 1 ⇒ Apply ⇒ đúng 3 UTCID mới; sửa hàm (lệnh trước đây chỉ MCP) ⇒ Apply', async () => {
    prompts.length = 0;
    const fourCases = [
      { type: 'N', O: [{ group: 'email', value: 'a@b.co' }, { group: 'Return', value: 'true' }], note: 'valid email' },
      { type: 'A', O: [{ group: 'email', value: 'not-an-email' }, { group: 'Exception', value: 'IllegalArgumentException' }], note: 'bad format' },
      { type: 'B', O: [{ group: 'email', value: '' }, { group: 'Exception', value: 'IllegalArgumentException' }], note: 'empty email' },
      { type: 'A', O: [{ group: 'email', value: 'null' }], note: 'duplicate of A — user unticks it' },
    ];
    replies.push(
      JSON.stringify({ reply: '', reads: [{ tool: 'find_commands', names: ['fpt_unit_update_function', 'fpt_unit_move'] }] }),
      JSON.stringify({ reply: '', reads: [{ tool: 'command', name: 'fpt_doc_get', args: {} }, { tool: 'command', name: 'fpt_unit_get', args: { function: 'UserService.register' } }] }),
      answer('Mình soạn 4 UTCID (chưa có kết quả chạy) và sửa mô tả hàm.', [
        {
          type: 'command', command: 'fpt_unit_add_cases', summary: 'Thêm 4 UTCID cho UserService.register (chưa điền kết quả)',
          args: {
            function: 'UserService.register',
            rows: [
              { section: 'condition', group: 'email', value: 'a@b.co' }, { section: 'condition', group: 'email', value: 'not-an-email' },
              { section: 'condition', group: 'email', value: '' }, { section: 'condition', group: 'email', value: 'null' },
              { section: 'confirmation', group: 'Return', value: 'true' }, { section: 'confirmation', group: 'Exception', value: 'IllegalArgumentException' },
            ],
            cases: fourCases,
          },
          // Model cố tự gắn cờ — server phải ghi đè.
          danger: 'delete', recordsResults: true, title: 'bịa',
        },
        { type: 'command', command: 'fpt_unit_update_function', summary: 'Sửa mô tả hàm', args: { function: 'UserService.register', description: 'Đăng ký tài khoản bằng email' } },
      ]),
    );
    const r = await ask(dev, 'Điền 3 UTCID cho hàm UserService.register trong Report 5.1 từ các input: a@b.co, not-an-email, rỗng');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(prompts.length, 3, 'tra lệnh + đọc + trả lời');
    // Lượt 1: prompt có find_commands + mục lục tên (gồm lệnh trước đây chỉ MCP), KHÔNG có tham số của chúng.
    assert.match(prompts[0].system, /find_commands/);
    assert.match(prompts[0].system, /fpt_unit_move\*/);
    assert.match(prompts[0].system, /fpt_unit_delete_cases!/);
    assert.doesNotMatch(prompts[0].system, /fpt_unit_move\(/, 'lệnh ngoài nhóm hay dùng: chỉ có tên');
    // Lượt 2: kết quả tra lệnh = mô tả + tham số.
    assert.match(prompts[1].user, /Commands \(descriptions and arguments\)/);
    assert.match(prompts[1].user, /fpt_unit_update_function \[WRITE — propose it/);
    assert.match(prompts[1].user, /- executedBy\?: string\|null — "Executed By"/);
    // Lượt 3: lệnh đọc trước đây chỉ MCP (fpt_doc_get) chạy được bằng quyền người hỏi; fpt_unit_get thật.
    assert.match(prompts[2].user, /Command results/);
    assert.doesNotMatch(prompts[2].user, /fpt_doc_get: ERROR/);
    assert.match(prompts[2].user, /UTCID01/);
    // Hai đề xuất được giữ; nhãn do server điền (cờ bịa của model bị ghi đè).
    assert.equal(r.data.actions.length, 2, JSON.stringify(r.data.actions));
    const [add, upd] = r.data.actions;
    assert.equal(add.title, 'Add UTCIDs to a unit test matrix');
    assert.equal(add.danger, null);
    assert.equal(add.recordsResults, null, 'soạn case không kết quả ⇒ không cần xác nhận đã chạy');
    assert.equal(upd.command, 'fpt_unit_update_function');
    assert.equal((await cases()).length, 1, 'chưa Apply thì chưa ghi gì');

    // Người dùng bỏ tick mục thứ 4 ⇒ gửi bản đã sửa khi Apply.
    const mid = r.data.answer.id;
    const edited = { ...add, args: { ...add.args, cases: fourCases.slice(0, 3) } };
    const ap = await call(dev, 'POST', `/projects/${pid}/ai/messages/${mid}/actions/0/apply`, { action: edited });
    assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    const after = await cases();
    assert.equal(after.length, 4, '1 UTCID mẫu + đúng 3 UTCID vừa điền');
    assert.deepEqual(after.slice(1).map((c) => [c.type, c.result, c.note]), [['N', null, 'valid email'], ['A', null, 'bad format'], ['B', null, 'empty email']]);
    // Bản đã sửa được lưu lại (cả nhóm thấy đúng thứ đã áp).
    const thread = await call(dev, 'GET', `/projects/${pid}/ai/threads/${r.data.threadId}`);
    const stored = thread.data.messages.find((m: any) => m.id === mid).actions[0];
    assert.equal(stored.status, 'done');
    assert.equal(stored.action.args.cases.length, 3);

    const ap2 = await call(dev, 'POST', `/projects/${pid}/ai/messages/${mid}/actions/1/apply`, {});
    assert.equal(ap2.status, 200, JSON.stringify(ap2.raw));
    const fn = await prisma.workUnitFunction.findUniqueOrThrow({ where: { id: fid }, select: { description: true } });
    assert.equal(fn.description, 'Đăng ký tài khoản bằng email');
  });

  it('S2 ghi KẾT QUẢ chạy test ⇒ phải xác nhận "tôi đã chạy" (409 nếu thiếu), có xác nhận mới ghi', async () => {
    replies.push(answer('Ghi kết quả bạn vừa đưa.', [
      { type: 'command', command: 'fpt_unit_record_results', summary: 'UTCID02 = P', args: { function: 'UserService.register', results: [{ case: 'UTCID02', result: 'P' }] } },
    ]));
    const r = await ask(dev, 'Mình đã chạy JUnit: UTCID02 pass. Ghi giúp.');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.actions[0].recordsResults, true);
    const mid = r.data.answer.id;
    const no = await call(dev, 'POST', `/projects/${pid}/ai/messages/${mid}/actions/0/apply`, {});
    assert.equal(no.status, 409);
    assert.equal(no.code, 'WORK_AI_CONFIRM_RAN');
    assert.equal((await cases())[1].result, null, 'chưa xác nhận ⇒ chưa ghi');
    const yes = await call(dev, 'POST', `/projects/${pid}/ai/messages/${mid}/actions/0/apply`, { confirmRan: true });
    assert.equal(yes.status, 200, JSON.stringify(yes.raw));
    assert.equal((await cases())[1].result, 'P');
    // /ai/apply trực tiếp cũng chặn như vậy.
    const direct = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'command', command: 'fpt_unit_record_results', args: { function: 'UserService.register', results: [{ case: 'UTCID03', result: 'F' }] } } });
    assert.equal(direct.status, 409);
    // Lời dặn "không bịa kết quả" nằm trong system prompt của câu hỏi có ghi.
    assert.match(prompts.at(-1)!.system, /TEST RESULTS ARE EVIDENCE — never invent them/);
  });

  it('S3 đề xuất XOÁ ⇒ thẻ đỏ (danger) ⇒ Apply chỉ tạo yêu cầu xoá chờ trưởng nhóm, UTCID còn nguyên', async () => {
    replies.push(answer('Đây là đề xuất xoá UTCID04 bạn yêu cầu.', [
      { type: 'command', command: 'fpt_unit_delete_cases', summary: 'Xoá UTCID04 của UserService.register', args: { function: 'UserService.register', cases: ['UTCID04'] } },
    ]));
    const r = await ask(dev, 'Xoá UTCID04 của hàm register');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.actions[0].danger, 'delete');
    const before = (await cases()).length;
    const ap = await call(dev, 'POST', `/projects/${pid}/ai/messages/${r.data.answer.id}/actions/0/apply`, {});
    assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    assert.equal((await cases()).length, before, 'chưa xoá gì — chờ trưởng nhóm duyệt');
    const q = await prisma.workDeleteRequest.findFirstOrThrow({ where: { requestedById: dev.id, projectId: pid }, orderBy: { id: 'desc' } });
    assert.equal(q.status, 'PENDING');
  });

  it('S4 sinh viên (MEMBER) đề xuất việc của trưởng nhóm (đổi vai thành viên) ⇒ Apply bị từ chối, vai không đổi', async () => {
    replies.push(answer('Đề xuất nâng @viewer lên ADMIN.', [
      { type: 'command', command: 'project_member_set_role', summary: 'viewer ⇒ ADMIN', args: { user: viewer.username, role: 'ADMIN' } },
    ]));
    const r = await ask(dev, `Cho ${viewer.username} làm ADMIN dự án`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.actions.length, 1);
    const ap = await call(dev, 'POST', `/projects/${pid}/ai/messages/${r.data.answer.id}/actions/0/apply`, {});
    assert.ok(ap.status === 403 || ap.status === 404, `${ap.status} ${JSON.stringify(ap.raw)}`);
    const m = await prisma.workProjectMember.findFirstOrThrow({ where: { projectId: pid, userId: viewer.id }, select: { role: true } });
    assert.equal(m.role, 'VIEWER');
    // VIEWER không hỏi trợ lý được (ai.use) — không có đường vòng nào.
    assert.ok((await ask(viewer, 'hi')).status >= 400);
  });

  it('S5 lệnh ngoài bộ web (tải URL, lệnh riêng agent, lệnh đọc) ⇒ bị loại, model được báo lý do', async () => {
    prompts.length = 0;
    const bad = [
      { type: 'command', command: 'attach_from_url', args: { issue: 1, url: 'https://evil.example/x' } },
      { type: 'command', command: 'claim_issue', args: { issue: 1 } },
      { type: 'command', command: 'fpt_unit_get', args: { function: 'register' } },
    ];
    replies.push(answer('x', bad), answer('Không làm được việc đó từ trợ lý.', []));
    const r = await ask(dev, 'Đính kèm file từ link này vào SS-1');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.deepEqual(r.data.actions, []);
    assert.match(prompts[1].user, /attach_from_url: not a write command this user can propose here/);
    assert.match(prompts[1].user, /fpt_unit_get: this is a READ command/);
  });

  it('S6 việc trên máy người dùng ⇒ câu chuẩn theo vỏ + nhắc trong câu hỏi', async () => {
    const { cauMayCucBo } = await import('../services/work/aiTroLyWeb.js');
    prompts.length = 0;
    replies.push(answer(cauMayCucBo('desktop'), []));
    const r = await ask(dev, 'Chạy JUnit cho UserServiceTest rồi git push giúp mình', { client: 'desktop' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.ok(prompts[0].system.includes(cauMayCucBo('desktop', 'vi')), 'câu chuẩn của app CuongThai');
    assert.match(prompts[0].system, new RegExp(`${(await prisma.workSpace.findUniqueOrThrow({ where: { id: wsId } })).slug}/SS`));
    assert.match(prompts[0].user, /looks like a LOCAL-MACHINE task/);
    prompts.length = 0;
    await ask(dev, 'Việc của tôi tuần này?');
    assert.ok(prompts[0].system.includes(cauMayCucBo('web', 'vi')), 'không gửi client ⇒ câu của trình duyệt');
    assert.doesNotMatch(prompts[0].user, /LOCAL-MACHINE task/);
    const bad = await ask(dev, 'x', { client: 'hacker' });
    assert.equal(bad.status, 400);
  });

  it('S7 agent thành viên KHÔNG đổi: xoá / quản trị / sửa ma trận qua MCP ⇒ vẫn bị chặn', async () => {
    for (const [name, args] of [
      ['fpt_unit_delete_cases', { project: 'SS', function: fid, cases: ['UTCID02'] }],
      ['project_member_set_role', { project: 'SS', user: viewer.username, role: 'ADMIN' }],
      ['sprint_create', { project: 'SS', name: 'Agent sprint' }],
    ] as const) {
      const t = await tool(ext.token, name, args);
      assert.equal(t.isError, true, `${name}: ${t.text}`);
    }
    assert.equal((await cases()).length, 4);
  });

  it('S8 đo cỡ system prompt (câu có ghi / câu chỉ để hiểu)', async () => {
    prompts.length = 0;
    replies.push(answer('ok', []), answer('ok', []));
    await ask(dev, 'Tạo test case cho SS-1 và thêm UTCID');
    await ask(dev, 'Việc của tôi tuần này?');
    const [ghi, hieu] = prompts;
    console.log(`[đo prompt 28/10] system có ghi: ${ghi.system.length} ký tự · chỉ để hiểu: ${hieu.system.length} ký tự`);
    assert.ok(ghi.system.length < 40_000, `${ghi.system.length}`);
  });
});
