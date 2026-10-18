/**
 * ĐỢT 5 — PTY THẬT + LÕI THẬT (`dist/loi.cjs`, không lõi giả) + máy chủ CuongThai GIẢ (cổng local, gồm
 * MCP CT Work giả theo đúng hình máy chủ): đi đúng đường người dùng —
 *   mở CLI ⇒ "Kết nối CT Work?" ⇒ 1 (token tạo bằng phiên đăng nhập, server `ctwork` dựng sẵn) ⇒
 *   "Gắn thư mục với LF (id 2)?" (đoán từ AGENTS.md) ⇒ 1 ⇒ dòng trạng thái "⬡ LF · Sprint 2 · còn 5 ngày" ⇒
 *   `/ctwork` menu đánh số ⇒ 1 bảng sprint ⇒ `/issue LF-18` thẻ ⇒ câu có `LF-18` ⇒ chip 📎 + tóm tắt thẻ
 *   trong thân gửi model ⇒ agent muốn GHI bình luận ⇒ thẻ duyệt CT Work (xem trước) ⇒ 2 từ chối ⇒ `?` phím tắt.
 * Không chạm CT Work / máy chủ thật nào.
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
const ghi = { token: 0, sprint: 0, getIssue: 0, turn: [] as Array<Record<string, any>>, mcpAuthSai: 0, comment: 0 };

function json(res: import('node:http').ServerResponse, ma: number, v: unknown): void {
  res.writeHead(ma, { 'content-type': 'application/json' });
  res.end(JSON.stringify(v));
}
function sse(res: import('node:http').ServerResponse, khung: unknown[]): void {
  res.writeHead(200, { 'content-type': 'text/event-stream' });
  res.end(khung.map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
}
const xong = (append: unknown[], stop = 'end') => ({ type: 'done', append, stop, usage: { inputTokens: 10, outputTokens: 5, costUsd: 0.001 }, quota: null });

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'ctw-dot5pty-'));
  may = createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      const url = req.url ?? '';
      if (url === '/api/v1/auth/refresh') return json(res, 200, { data: { userId: 7, username: 'cuong', fullName: 'Cường', token: 'tk-thu' } });
      if (url === '/api/v1/work/me/api-tokens' && req.method === 'POST') { ghi.token += 1; return json(res, 201, { data: { token: 'ctw_pty_gia', id: 77 } }); }
      if (url.startsWith('/api/v1/work/me/api-tokens/') && req.method === 'DELETE') return json(res, 200, { data: { ok: true } });
      if (url === '/api/v1/work/mcp') {
        if (req.method !== 'POST') { res.writeHead(405).end(); return; }
        if (req.headers.authorization !== 'Bearer ctw_pty_gia') { ghi.mcpAuthSai += 1; return json(res, 401, { error: 'invalid token' }); }
        const tin = JSON.parse(than) as { id?: number; method: string; params?: { name?: string; arguments?: Record<string, unknown> } };
        if (tin.id === undefined) { res.writeHead(202).end(); return; }
        const ten = tin.params?.name;
        if (ten === 'sprint_current') ghi.sprint += 1;
        if (ten === 'get_issue') ghi.getIssue += 1;
        if (ten === 'comment') ghi.comment += 1;
        const chu = ten === 'list_projects' ? MAU_LIST_PROJECTS : ten === 'sprint_current' ? mauSprintCurrent(5) : ten === 'get_issue' ? mauGetIssue(String(tin.params?.arguments?.issue ?? 'LF-18'))
          : ten === 'my_work' ? MAU_MY_WORK : ten === 'comment' ? '{"commentId":9,"issue":"LF-18"}' : 'ok';
        const kq = tin.method === 'initialize' ? { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'ctwork-gia', version: '1' } }
          : tin.method === 'tools/list' ? { tools: MAU_TOOLS.map((t) => ({ name: t.name, description: `CT Work ${t.name}`, inputSchema: { type: 'object', properties: {} }, annotations: { title: t.name, readOnlyHint: !t.ghi } })) }
            : tin.method === 'tools/call' ? { content: [{ type: 'text', text: chu }], isError: false } : {};
        return json(res, 200, { jsonrpc: '2.0', id: tin.id, result: kq });
      }
      if (url === '/api/v1/agent/turn') {
        const b = JSON.parse(than) as Record<string, any>;
        ghi.turn.push(b);
        const cuoi = b.messages.at(-1);
        // Lượt 1: agent muốn GHI bình luận lên LF-18 ⇒ thẻ duyệt. Lượt 2 (sau kết quả tool): trả lời chữ.
        if (cuoi.role === 'user') {
          const args = { project: 'LF', issue: 'LF-18', markdown: 'Đã đọc thẻ, bước tiếp: vẽ ERD' };
          return sse(res, [{ type: 'start', model: 'gia' }, { type: 'tool_call', id: 'c1', name: 'mcp__ctwork__comment', args },
            xong([{ role: 'assistant', content: null, tool_calls: [{ id: 'c1', type: 'function', function: { name: 'mcp__ctwork__comment', arguments: JSON.stringify(args) } }] }], 'tool_calls')]);
        }
        return sse(res, [{ type: 'start', model: 'gia' }, { type: 'text', delta: 'Đã đọc LF-18 (xong).' }, xong([{ role: 'assistant', content: 'Đã đọc LF-18 (xong).' }])]);
      }
      return json(res, 200, { data: {} });
    });
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

async function chay(phim: Array<[number, string]>, giayChay: number): Promise<{ su_kien: unknown[]; cols: number; rows: number; duAn: string }> {
  const home = path.join(tam, 'home');
  const duAn = path.join(tam, 'LabFlow-AI');
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  mkdirSync(duAn, { recursive: true });
  writeFileSync(path.join(duAn, 'AGENTS.md'), '# AGENTS\n- Dự án **LF** (id 2) trong không gian **"LabFlow Studio"** (id 3) trên cuongthai.com.\n');
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'cuong', fullName: 'Cường', token: 'tk-thu', luu: new Date().toISOString() }));
  const cauHinh = path.join(tam, 'pty.json');
  const ra = path.join(tam, 'ghi.json');
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist], cwd: duAn, cols: 120, rows: 42, duration: giayChay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_CTW_TRE_MS: '900', CUONGMINI_KHONG_DAT_TIEU_DE: '1',
      TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10', CUONGMINI_NGON_NGU: 'vi',
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI'],
    keys: phim,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return { ...(JSON.parse(readFileSync(ra, 'utf8')) as { su_kien: unknown[]; cols: number; rows: number }), duAn };
}

test('PTY lõi thật: kết nối một chạm ⇒ gắn LF ⇒ dòng trạng thái ⇒ /ctwork menu ⇒ /issue ⇒ chip LF-18 ⇒ thẻ duyệt ghi CT Work', { skip: boQua, timeout: 90_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[] }> };
  const g = await chay([
    [3.4, '1'], // Kết nối CT Work? ⇒ Có — chỉ đọc
    [6.4, '1'], // Gắn thư mục với LF? ⇒ Đúng
    [9.0, '/ctwork'], [9.4, '\r'],
    [11.2, '1'], // Sprint hiện tại
    [13.0, '/issue LF-18'], [13.4, '\r'],
    [15.4, '\x1b'],
    [16.0, 'giải thích LF-18 giúp mình'], [16.5, '\r'],
    [20.4, '2'], // thẻ duyệt ghi CT Work ⇒ Không
    [23.0, '?'],
  ], 25);
  const man = async (t: number) => (await phatLai(g, t)).manHinh;
  const co = (m: string[], s: string | RegExp) => m.some((d) => (typeof s === 'string' ? d.includes(s) : s.test(d)));
  const xem = (m: string[]) => m.join('\n');
  // Soi bằng mắt: CUONGMINI_PTY_IN=1 ⇒ in từng màn hình mốc (node --test hiện ở phần diagnostic).
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [3.2, 6.2, 8.8, 11.0, 12.8, 15.2, 20.2, 22.5, 24.8]) console.log(`\n──── t=${t}s ────\n${xem(await man(t))}`);

  const m1 = await man(3.2);
  assert.ok(co(m1, 'Kết nối CT Work?'), `phải hỏi kết nối một lần:\n${xem(m1)}`);
  assert.ok(co(m1, /1\. Có — chỉ đọc/) && co(m1, /3\. Không, đừng hỏi lại/), xem(m1));

  const m2 = await man(6.2);
  assert.equal(ghi.token, 1, 'token tạo bằng phiên đăng nhập đúng 1 lần');
  assert.ok(co(m2, /Gắn thư mục này với dự án CT Work LF \(id 2\)\?/), `phải đoán LF từ AGENTS.md:\n${xem(m2)}`);

  const m3 = await man(8.8);
  const gan = JSON.parse(readFileSync(path.join(g.duAn, '.cuongmini', 'ctwork.json'), 'utf8'));
  assert.deepEqual({ k: gan.key, p: gan.projectId, w: gan.workspaceId }, { k: 'LF', p: 2, w: 3 });
  assert.ok(co(m3, /⬡ LF · Sprint 2 · còn 5 ngày/), `dòng trạng thái kiểu Claude Code:\n${xem(m3)}`);
  const mcpJson = path.join(tam, 'home', '.cuongmini');
  assert.ok(existsSync(mcpJson));

  const m4 = await man(11.0);
  assert.ok(co(m4, /1\. Sprint hiện tại/) && co(m4, /9\. Chọn dự án/) && co(m4, /0\. Thoát/), `menu /ctwork đánh số:\n${xem(m4)}`);

  const m5 = await man(12.8);
  assert.ok(co(m5, /To Do/) && co(m5, /LF-19/), `bảng sprint theo cột:\n${xem(m5)}`);

  const m6 = await man(15.2);
  assert.ok(co(m6, /LF-18 · Thiết kế ERD v1/) && co(m6, /Tự kiểm/) && co(m6, /Bình luận gần nhất/), `thẻ /issue:\n${xem(m6)}`);

  const m7 = await man(20.2);
  assert.ok(co(m7, '📎 LF-18'), `chip đính kèm:\n${xem(m7)}`);
  assert.ok(co(m7, /CT Work · Bình luận → LF-18/), `thẻ duyệt GHI có xem trước:\n${xem(m7)}`);
  assert.ok(co(m7, /1\. Có, ghi lên CT Work/) && co(m7, /2\. Không, và bảo CuongMini làm khác đi \(esc\)/), xem(m7));
  const b1 = ghi.turn[0]!;
  const tin = b1.messages.filter((x: { role: string }) => x.role === 'user').at(-1);
  const chu = typeof tin.content === 'string' ? tin.content : tin.content[0].text;
  assert.match(chu, /<ctwork-content source="issue LF-18 \(summary\)" untrusted="true">/);
  assert.equal(b1.ctwork?.key, 'LF');
  assert.ok(b1.toolMcp.some((t: { name: string }) => t.name === 'mcp__ctwork__get_issue'), 'server ctwork dựng sẵn có tool');

  const m8 = await man(24.8);
  assert.equal(ghi.comment, 0, 'từ chối ⇒ không ghi bình luận');
  assert.ok(co(m8, 'Phím tắt'), `? ⇒ bảng phím tắt:\n${xem(m8)}`);
  // Đọc rẻ: sprint_current = 1 (dòng trạng thái, đệm 5 phút) + 1 (người dùng chọn "Sprint hiện tại") — không gọi theo mỗi lần vẽ.
  assert.ok(ghi.sprint <= 2, `sprint_current bị gọi ${ghi.sprint} lần`);
  assert.equal(ghi.mcpAuthSai, 0);
});
