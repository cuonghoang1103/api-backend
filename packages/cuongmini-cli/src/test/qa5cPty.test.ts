/**
 * QA 5c — PTY THẬT + LÕI THẬT (`dist/loi.cjs`) + máy chủ giả LÀM ĐÚNG NHƯ MÁY CHỦ THẬT ở chỗ bộ test cũ bỏ sót:
 * token CT Work CHỈ ĐỌC ⇒ `tools/list` KHÔNG có tool ghi (`src/mcp/server.ts › visibleTools`).
 * Đường người dùng:
 *   gõ câu hỏi ngay lúc mở ⇒ thẻ "Kết nối CT Work?" KHÔNG được bật lên giữa lúc gõ (trước đây Enter của câu hỏi chọn
 *   luôn mục 1 của thẻ vừa bật) ⇒ thẻ hiện khi tay rời phím ⇒ 1 (chỉ đọc) ⇒ gắn LF ⇒ /ctwork ⇒ 5 Ghi giờ ⇒ thẻ "token
 *   chỉ đọc" + một chạm nâng quyền (trước đây xem trước rồi hỏng "server "ctwork" không có tool "log_work"")
 *   ⇒ lượt có ngữ cảnh 83% ⇒ chân trang VẪN hiện "context 83%" + tiền (trước đây cả cụm phải biến mất ở 120 cột)
 *   ⇒ hai lệnh cần duyệt, bấm "1" ĐÚP ⇒ chỉ lệnh đầu được duyệt (trước đây phím thứ hai duyệt mù lệnh thứ hai).
 */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { MAU_LIST_PROJECTS, MAU_TOOLS, mauGetIssue, mauSprintCurrent, MAU_MY_WORK } from '../../../../desktop/src/main/agent/ctworkMauThu';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dist = path.join(goc, 'dist/cuongmini.mjs');
const loi = path.join(goc, 'dist/loi.cjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const boQua = !existsSync(dist) || !existsSync(loi) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : false;

let tam = '';
let may: Server | null = null;
let cong = 0;
const ghi = { scopes: [] as string[][], goiGhi: [] as string[], turn: [] as Array<Record<string, any>> };

function json(res: import('node:http').ServerResponse, ma: number, v: unknown): void {
  res.writeHead(ma, { 'content-type': 'application/json' });
  res.end(JSON.stringify(v));
}

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'ctw-qa5c-'));
  may = createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      const url = req.url ?? '';
      if (url === '/api/v1/auth/refresh') return json(res, 200, { data: { userId: 7, username: 'cuong', fullName: 'Cường', token: 'tk-thu' } });
      if (url === '/api/v1/work/me/api-tokens' && req.method === 'POST') {
        const sc = (JSON.parse(than) as { scopes: string[] }).scopes;
        ghi.scopes.push(sc);
        return json(res, 201, { data: { token: sc.includes('write') ? 'ctw_ghi' : 'ctw_doc', id: 77 } });
      }
      if (url.startsWith('/api/v1/work/me/api-tokens/')) return json(res, 200, { data: { ok: true } });
      if (url === '/api/v1/work/mcp') {
        const tk = String(req.headers.authorization ?? '').replace('Bearer ', '');
        if (tk !== 'ctw_doc' && tk !== 'ctw_ghi') return json(res, 401, { error: 'invalid token' });
        const tin = JSON.parse(than) as { id?: number; method: string; params?: { name?: string; arguments?: Record<string, unknown> } };
        if (tin.id === undefined) { res.writeHead(202).end(); return; }
        const coGhi = tk === 'ctw_ghi';
        const ten = tin.params?.name ?? '';
        if (tin.method === 'tools/call' && MAU_TOOLS.find((t) => t.name === ten)?.ghi) ghi.goiGhi.push(ten);
        const chu = ten === 'list_projects' ? MAU_LIST_PROJECTS : ten === 'sprint_current' ? mauSprintCurrent(5) : ten === 'get_issue' ? mauGetIssue(String(tin.params?.arguments?.issue ?? 'LF-18'))
          : ten === 'my_work' ? MAU_MY_WORK : 'ok';
        const kq = tin.method === 'initialize' ? { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'ctwork-gia', version: '1' } }
          // ĐÚNG như máy chủ thật: token chỉ đọc KHÔNG thấy tool ghi.
          : tin.method === 'tools/list' ? { tools: MAU_TOOLS.filter((t) => coGhi || !t.ghi).map((t) => ({ name: t.name, description: `CT Work ${t.name}`, inputSchema: { type: 'object', properties: {} }, annotations: { title: t.name, readOnlyHint: !t.ghi } })) }
            : tin.method === 'tools/call' ? { content: [{ type: 'text', text: chu }], isError: false } : {};
        return json(res, 200, { jsonrpc: '2.0', id: tin.id, result: kq });
      }
      if (url === '/api/v1/agent/turn') {
        const b = JSON.parse(than) as Record<string, any>;
        ghi.turn.push(b);
        const cuoi = b.messages.at(-1);
        if (cuoi.role === 'user' && cuoi.content === 'hai lenh') {
          // Hai lệnh cần duyệt liên tiếp — kiểm bấm đúp không duyệt mù lệnh thứ hai.
          const calls = ['echo mot', 'echo hai'].map((c, i) => ({ id: `r${i}`, type: 'function', function: { name: 'run_command', arguments: JSON.stringify({ command: c }) } }));
          const k2 = [{ type: 'start', model: 'gia' }, ...calls.map((c) => ({ type: 'tool_call', id: c.id, name: 'run_command', args: JSON.parse(c.function.arguments) })),
            { type: 'done', append: [{ role: 'assistant', content: null, tool_calls: calls }], stop: 'tool_calls', usage: { inputTokens: 1, outputTokens: 1, costUsd: 0.001 }, quota: null }];
          res.writeHead(200, { 'content-type': 'text/event-stream' });
          return res.end(k2.map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
        }
        const khung = [{ type: 'start', model: 'gia' }, { type: 'text', delta: 'ok' },
          { type: 'done', append: [{ role: 'assistant', content: 'ok' }], stop: 'end', usage: { inputTokens: 10, outputTokens: 5, costUsd: 0.25 }, nguCanh: { kyTu: 498000, tran: 600000, phanTram: 83, soLuotDaBo: 0 }, quota: null }];
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        return res.end(khung.map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
      }
      return json(res, 200, { data: {} });
    });
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

async function chay(phim: Array<[number, string] | [number, string, string]>, giayChay: number): Promise<{ su_kien: unknown[]; cols: number; rows: number }> {
  const home = path.join(tam, 'home');
  const duAn = path.join(tam, 'LabFlow-AI');
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  mkdirSync(duAn, { recursive: true });
  writeFileSync(path.join(duAn, 'AGENTS.md'), '# AGENTS\n- Dự án **LF** (id 2) trong không gian **"LabFlow Studio"** (id 3) trên cuongthai.com.\n');
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'cuong', fullName: 'Cường', token: 'tk-thu', luu: new Date().toISOString() }));
  const cauHinh = path.join(tam, 'pty.json');
  const ra = path.join(tam, 'ghi.json');
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist], cwd: duAn, cols: 120, rows: 40, duration: giayChay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_TIN_THU_MUC: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_CTW_TRE_MS: '2500', CUONGMINI_KHONG_DAT_TIEU_DE: '1',
      TERM: 'xterm-256color', LANG: 'en_US.UTF-8', TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10',
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI', 'LC_ALL', 'LC_MESSAGES'],
    keys: phim,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return JSON.parse(readFileSync(ra, 'utf8')) as { su_kien: unknown[]; cols: number; rows: number };
}

test('PTY lõi thật: thẻ tự bật không cướp Enter khi đang gõ · token chỉ đọc ⇒ thẻ nâng quyền, không gọi tool ghi · chân trang giữ context %', { skip: boQua, timeout: 150_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[] }> };
  const g = await chay([
    [2.0, 'hello', 'Hỏi hoặc giao việc|Ask or give a task'], // gõ ngay lúc mở — thẻ kết nối (hẹn 2,5 s) KHÔNG được bật giữa chừng
    [3.0, '\r'], // Enter của câu hỏi ⇒ GỬI câu hỏi, không chọn gì trên thẻ nào
    [10.5, '1', 'Connect CT Work\\?'], // "Connect CT Work?" (hiện khi tay rời phím) ⇒ Yes — read only
    [13.5, '1', 'Bind this folder'], // "Bind this folder to LF?" ⇒ Yes
    [16.0, '/ctwork', '⬡ LF'], [16.4, '\r'],
    [18.0, '5', 'Log work'], // Log work… ⇒ token chỉ đọc
    [21.5, '\x1b', 'read only'],
    [22.5, 'hai lenh'], [22.9, '\r'],
    [25.0, '1', '\\$ echo'], [25.15, '1'], // bấm ĐÚP: phím thứ hai KHÔNG được duyệt thẻ "echo hai" vừa hiện
  ], 28);
  const man = async (t: number) => (await phatLai(g, t)).manHinh;
  const co = (m: string[], s: string | RegExp) => m.some((d) => (typeof s === 'string' ? d.includes(s) : s.test(d)));
  const xem = (m: string[]) => m.join('\n');
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [2.8, 4.0, 10.3, 13.3, 17.8, 20.8]) console.log(`\n──── t=${t}s ────\n${xem(await man(t))}`);

  assert.equal(ghi.turn[0]?.messages?.at(-1)?.content, 'hello', 'Enter của câu hỏi phải GỬI câu hỏi');
  const m1 = await man(4.0);
  assert.ok(!co(m1, 'Connect CT Work?'), `thẻ kết nối bật lên giữa lúc gõ:\n${xem(m1)}`);
  const m2 = await man(10.3);
  assert.ok(co(m2, 'Connect CT Work?'), `thẻ kết nối phải hiện khi ô nhập trống + tay rời phím:\n${xem(m2)}`);
  assert.deepEqual(ghi.scopes, [['read']]);
  const m3 = await man(13.3);
  assert.ok(co(m3, /Bind this folder to CT Work project LF/), `thẻ NỐI TIẾP (gắn dự án) vẫn hiện ngay:\n${xem(m3)}`);
  const m4 = await man(17.8);
  assert.ok(co(m4, /5\. Log work…\s+needs write access/), `menu báo mục ghi cần quyền ghi:\n${xem(m4)}`);
  const m5 = await man(20.8);
  assert.ok(co(m5, 'Your CT Work token is read only'), `token chỉ đọc ⇒ thẻ nâng quyền:\n${xem(m5)}`);
  assert.ok(co(m5, /1\. Reconnect: read \+ write/), xem(m5));
  assert.ok(!co(m5, /expired or was revoked/), 'không được báo nhầm "token hết hạn"');
  assert.deepEqual(ghi.goiGhi, [], 'không gọi tool ghi nào');
  const m7 = await man(27.5);
  assert.ok(co(m7, '$ echo hai') && co(m7, /❯ 1\. Yes/), `bấm đúp đã duyệt mù thẻ thứ hai:\n${xem(m7)}`);
  // Chân trang: lượt "hello" trả ngữ cảnh 83% ⇒ vẫn thấy context + tiền ở 120 cột.
  const m6 = await man(9.5);
  assert.ok(co(m6, /context 83% · ~\$0\.25/), `chân trang mất context %/tiền:\n${xem(m6)}`);
});
