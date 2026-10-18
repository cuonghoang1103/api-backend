/**
 * ĐỢT 6 — PTY THẬT + LÕI THẬT (`dist/loi.cjs`) + máy chủ CuongThai GIẢ (MCP CT Work giả ~153 tool, phân quyền đọc/ghi
 * như máy chủ thật). Đi đúng đường người dùng:
 *   1. mở ở thư mục MỚI ⇒ hộp "Mở thư mục làm việc … Có, tôi tin thư mục này / Không, thoát" ⇒ 1 ⇒ nhớ (mở lại không hỏi);
 *   2. `/mcp` ⇒ "CT Work — chọn dự án & quyền" ⇒ nối bằng phiên ⇒ MỌI dự án (không gian · vai) ⇒ LF ⇒ "Đọc + ghi" (token
 *      đang chỉ đọc ⇒ nối lại đọc + ghi) ⇒ gắn ⇒ TỰ đọc trang Docs "AGENTS.md — …" (khối ```markdown) ⇒ "Hôm nay";
 *   3. câu hỏi ⇒ thân gửi mang AGENTS.md của nhóm (gộp), `ctworkDuAn`, MỤC LỤC tool + `mcp_nap` (dùng được mọi tool);
 *   4. lượt xong trên nhánh `LF-18-erd` có commit ⇒ thẻ "Xong việc ở LF-18? … đúng luật dự án" ⇒ Chuyển → Review ⇒ XEM TRƯỚC ⇒
 *      đồng ý ⇒ `transition {to: Review}` (chỉ sau khi đồng ý);
 *   5. `/ctwork huong-dan 18` ⇒ PHỤ THUỘC "cần @longbui làm xong LF-5 trước … nhánh";
 *   6. thu cửa sổ 60×20 ⇒ `/ctwork` ⇒ thẻ KHÔNG cao hơn màn hình (thấy viền dưới + chân thẻ).
 * Và: mở ở thư mục HOME ⇒ cảnh báo đỏ, con trỏ mặc định "Không, thoát", Enter ⇒ thoát.
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
import {
  MAU_MY_WORK, MAU_TOOLS_DAY_DU, MAU_TRANG_AGENTS, mauGetIssuePhuThuoc, mauGetPage, mauIssueGuide, mauListPages, mauMyUpdates, mauSprintCurrent,
} from '../../../../desktop/src/main/agent/ctworkMauThu';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dist = path.join(goc, 'dist/cuongmini.mjs');
const loi = path.join(goc, 'dist/loi.cjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const coGit = spawnSync('git', ['--version']).status === 0;
const boQua = !existsSync(dist) || !existsSync(loi) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : !coGit ? 'không có git' : false;

let tam = '';
let may: Server | null = null;
let cong = 0;
const ghi = { scopes: [] as string[][], turn: [] as Array<Record<string, any>>, goi: [] as Array<[string, Record<string, unknown>]> };
/** QA đợt 6: lượt agent đầu tiên "làm việc" ⇒ tạo một commit trong repo (gợi ý "Xong việc?" chỉ bật khi LƯỢT đổi git). */
let repoCuaLuot = '';

const DS_DU_AN = [
  { key: 'LF', name: 'LabFlow AI', kind: 'SCHOOL', myRole: 'MEMBER', archived: false, openIssues: 42, modules: ['sprints', 'docs'], workspace: 'labflow-studio', id: 2, workspaceId: 3, workspaceName: 'LabFlow Studio' },
  { key: 'TP2', name: 'SWR302 nhóm 2', kind: 'SCHOOL', myRole: 'TEACHER', archived: false, openIssues: 8, modules: [], workspace: 'swr302', id: 9, workspaceId: 1, workspaceName: 'SWR302' },
];
const boc = (n: string, t: string) => `<ctwork-content source="${n}" untrusted="true">\n${t}\n</ctwork-content>`;

function json(res: import('node:http').ServerResponse, ma: number, v: unknown): void {
  res.writeHead(ma, { 'content-type': 'application/json' });
  res.end(JSON.stringify(v));
}
function sse(res: import('node:http').ServerResponse, khung: unknown[]): void {
  res.writeHead(200, { 'content-type': 'text/event-stream' });
  res.end(khung.map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
}

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'ctw-dot6pty-'));
  let soToken = 0;
  const tokenGhi = new Set<string>();
  may = createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      const url = req.url ?? '';
      if (url === '/api/v1/auth/refresh') return json(res, 200, { data: { userId: 7, username: 'an', fullName: 'An', token: 'tk-thu' } });
      if (url === '/api/v1/work/me/api-tokens' && req.method === 'POST') {
        const b = JSON.parse(than) as { scopes: string[] };
        ghi.scopes.push(b.scopes);
        soToken += 1;
        const tk = `ctw_pty6_${soToken}`;
        if (b.scopes.includes('write')) tokenGhi.add(tk);
        return json(res, 201, { data: { token: tk, id: 100 + soToken } });
      }
      if (url.startsWith('/api/v1/work/me/api-tokens/') && req.method === 'DELETE') return json(res, 200, { data: { ok: true } });
      if (url === '/api/v1/work/mcp') {
        if (req.method !== 'POST') { res.writeHead(405).end(); return; }
        const tk = String(req.headers.authorization ?? '').replace(/^Bearer /, '');
        if (!/^ctw_pty6_/.test(tk)) return json(res, 401, { error: 'invalid token' });
        const coGhi = tokenGhi.has(tk);
        const tin = JSON.parse(than) as { id?: number; method: string; params?: { name?: string; arguments?: Record<string, unknown>; cursor?: string } };
        if (tin.id === undefined) { res.writeHead(202).end(); return; }
        const ten = String(tin.params?.name ?? '');
        const a = tin.params?.arguments ?? {};
        if (tin.method === 'tools/call') ghi.goi.push([ten, a]);
        const chu = ten === 'list_projects' ? `2 project(s). Names are user data.\n${boc('project list', JSON.stringify(DS_DU_AN))}`
          : ten === 'sprint_current' ? mauSprintCurrent(5) : ten === 'my_work' ? MAU_MY_WORK
            : ten === 'list_pages' ? mauListPages() : ten === 'get_page' ? mauGetPage(Number(a.page), a.page === 5 ? MAU_TRANG_AGENTS : '# Tổng quan')
              : ten === 'issue_guide' ? mauIssueGuide(String(a.issue ?? 'LF-18')) : ten === 'get_issue' ? mauGetIssuePhuThuoc(String(a.issue ?? 'LF-18'))
                : ten === 'my_updates' ? mauMyUpdates({ lastId: 1 }) : ten === 'transition' ? '{"issue":"LF-18","status":"Review"}' : '{"ok":true}';
        const ds = MAU_TOOLS_DAY_DU.filter((t) => coGhi || !t.ghi);
        const tu = Number(tin.params?.cursor ?? 0);
        const kq = tin.method === 'initialize' ? { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'ctwork-gia', version: '1' } }
          : tin.method === 'tools/list' ? { tools: ds.slice(tu, tu + 60).map((t) => ({ name: t.name, description: t.mo, inputSchema: { type: 'object', properties: {} }, annotations: { title: t.name, readOnlyHint: !t.ghi } })), ...(tu + 60 < ds.length ? { nextCursor: String(tu + 60) } : {}) }
            : tin.method === 'tools/call' ? { content: [{ type: 'text', text: chu }], isError: false } : {};
        return json(res, 200, { jsonrpc: '2.0', id: tin.id, result: kq });
      }
      if (url === '/api/v1/agent/turn') {
        const b = JSON.parse(than) as Record<string, any>;
        ghi.turn.push(b);
        if (ghi.turn.length === 1 && repoCuaLuot) git(repoCuaLuot, 'commit', '-q', '--allow-empty', '-m', 'LF-18: ERD v2');
        return sse(res, [{ type: 'start', model: 'gia' }, { type: 'text', delta: 'Đã đọc thẻ — bạn làm tiếp nhé.' },
          { type: 'done', append: [{ role: 'assistant', content: 'Đã đọc thẻ — bạn làm tiếp nhé.' }], stop: 'end', usage: { inputTokens: 10, outputTokens: 5, costUsd: 0.001 }, quota: null }]);
      }
      return json(res, 200, { data: {} });
    });
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

const git = (cwd: string, ...a: string[]) => spawnSync('git', a, { cwd, env: { ...process.env, GIT_AUTHOR_NAME: 'An', GIT_AUTHOR_EMAIL: 'an@x.test', GIT_COMMITTER_NAME: 'An', GIT_COMMITTER_EMAIL: 'an@x.test' } });

async function chay(cwd: string, home: string, phim: Array<[number, string] | [number, string, string] | [number, string, number, number]>, giayChay: number, o: { cols?: number; rows?: number; tin?: boolean } = {}): Promise<{ su_kien: unknown[]; cols: number; rows: number }> {
  const cauHinh = path.join(tam, `pty-${Date.now()}.json`);
  const ra = path.join(tam, `ghi-${Date.now()}.json`);
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist], cwd, cols: o.cols ?? 120, rows: o.rows ?? 42, duration: giayChay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_KHONG_DAT_TIEU_DE: '1',
      // Thẻ CT Work TỰ BẬT lúc mở hoãn xa — kịch bản đi bằng /mcp; gợi ý sau lượt vẫn chạy (chờ tay rời phím 2,5 s).
      CUONGMINI_CTW_TRE_MS: '600000',
      ...(o.tin ? { CUONGMINI_TIN_THU_MUC: '1' } : {}),
      TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10', CUONGMINI_NGON_NGU: 'vi',
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI', 'CUONGMINI_TIN_THU_MUC'],
    keys: phim,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return JSON.parse(readFileSync(ra, 'utf8'));
}

test('PTY lõi thật: tin thư mục ⇒ /mcp chọn dự án + quyền ⇒ AGENTS.md của nhóm ⇒ gợi ý sau việc ⇒ phụ thuộc ⇒ thẻ vừa 60×20', { skip: boQua, timeout: 240_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[] }> };
  const home = path.join(tam, 'home');
  const duAn = path.join(tam, 'LabFlow-AI');
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  mkdirSync(duAn, { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));
  // Repo thật: main + nhánh LF-18-erd có 1 commit (bằng chứng cho gợi ý "xong việc").
  git(duAn, 'init', '-q', '-b', 'main');
  writeFileSync(path.join(duAn, 'README.md'), '# LabFlow\n');
  git(duAn, 'add', '.'); git(duAn, 'commit', '-q', '-m', 'init');
  git(duAn, 'checkout', '-q', '-b', 'LF-18-erd');
  writeFileSync(path.join(duAn, 'erd.md'), '# ERD\n');
  git(duAn, 'add', '.'); git(duAn, 'commit', '-q', '-m', 'LF-18: ERD bản nháp');
  repoCuaLuot = duAn;

  const g = await chay(duAn, home, [
    [2.0, '1', 'Mở thư mục làm việc'], // 1. hộp tin thư mục ⇒ Có
    [4.0, '/mcp', 'Hỏi hoặc giao việc'], [4.4, '\r'],
    [6.0, '3', 'CT Work — chọn dự án & quyền'], // /mcp ⇒ CT Work — chọn dự án & quyền
    [9.0, '1', 'thư mục này làm cho dự án nào|Chọn dự án CT Work'], // LF
    [11.0, '1', 'Quyền của CuongMini với LF'], // Đọc + ghi (token đang chỉ đọc ⇒ nối lại)
    [15.0, 'giải thích LF-18', 'Hôm nay'], [15.4, '\r'],
    [20.0, '3', 'Xong việc ở LF-18'], // gợi ý tự động: 1 push? · … ⇒ chọn "Chuyển LF-18 → Review" (số 3)
    [22.0, '1', 'Ghi lên CT Work · LF-18'], // xem trước ⇒ Đồng ý
    [24.0, '/ctwork huong-dan 18', 'LF-18 → Review'], [24.4, '\r'],
    [27.0, '\x1b', 'Hướng dẫn · LF-18'],
    [28.0, '__resize__', 60, 20],
    [29.0, '/ctwork', 'Hỏi hoặc giao việc'], [29.4, '\r'],
    [32.0, '\x1b', 'CT Work'],
  ], 34);
  const man = async (t: number) => (await phatLai(g, t)).manHinh;
  const co = (m: string[], s: string | RegExp) => m.some((d) => (typeof s === 'string' ? d.includes(s) : s.test(d)));
  const xem = (m: string[]) => m.join('\n');
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [1.9, 5.9, 8.9, 10.9, 14.9, 19.9, 21.9, 26.9, 31.9]) console.log(`\n──── t=${t}s ────\n${xem(await man(t))}`);

  // 1. Hộp tin thư mục (như Claude Code) + nhớ thư mục đã tin.
  const m1 = await man(1.9);
  assert.ok(co(m1, 'Mở thư mục làm việc:') && co(m1, /LabFlow-AI/), `hộp tin thư mục:\n${xem(m1)}`);
  assert.ok(co(m1, /❯ 1\. Có, tôi tin thư mục này/) && co(m1, /2\. Không, thoát/), xem(m1));
  assert.ok(co(m1, /Kiểm nhanh an toàn/), xem(m1));
  const tin = JSON.parse(readFileSync(path.join(home, '.cuongmini/thu-muc-tin.json'), 'utf8'));
  assert.ok(Object.keys(tin.tin).some((k) => k.endsWith('LabFlow-AI')), JSON.stringify(tin));

  // 2. /mcp ⇒ mục CT Work mới.
  const m2 = await man(5.9);
  assert.ok(co(m2, /3\. CT Work — chọn dự án & quyền/), `thẻ /mcp:\n${xem(m2)}`);
  const m3 = await man(8.9);
  assert.ok(co(m3, /LF — LabFlow AI\s+LabFlow Studio · thành viên · 42 thẻ mở/) && co(m3, /TP2 — SWR302 nhóm 2\s+SWR302 · giảng viên/), `mọi dự án + vai:\n${xem(m3)}`);
  const m4 = await man(10.9);
  assert.ok(co(m4, /1\. Đọc \+ ghi/) && co(m4, /2\. Chỉ đọc/) && co(m4, /3\. Chỉ phiên này/), `thẻ quyền:\n${xem(m4)}`);
  assert.deepEqual(ghi.scopes, [['read'], ['read', 'write']], 'nối (chỉ đọc) ⇒ chọn đọc + ghi ⇒ nối lại đọc + ghi');
  const gan = JSON.parse(readFileSync(path.join(duAn, '.cuongmini', 'ctwork.json'), 'utf8'));
  assert.deepEqual({ k: gan.key, p: gan.projectId, v: gan.vai, q: gan.quyen }, { k: 'LF', p: 2, v: 'MEMBER', q: undefined });
  const m5 = await man(14.9);
  assert.ok(co(m5, /📎 Đã đọc hướng dẫn của nhóm: LF-DOC-5/), `tự đọc AGENTS.md của nhóm:\n${xem(m5)}`);
  assert.ok(co(m5, /Nên làm trước/), `"Hôm nay":\n${xem(m5)}`);

  // 3. Thân gửi model: AGENTS.md của nhóm (khối ```markdown đầu) + ctworkDuAn + mục lục tool + mcp_nap.
  const b = ghi.turn[0]!;
  assert.ok(b, 'phải có một lượt agent');
  assert.match(b.ghiChuDuAn?.noiDung ?? '', /Hướng dẫn của NHÓM[\s\S]*CuongMini là MENTOR/);
  assert.doesNotMatch(b.ghiChuDuAn?.noiDung ?? '', /Khối thứ hai/);
  assert.equal(b.ctworkDuAn, 2);
  assert.ok(b.capabilities.includes('mcp_nap'));
  assert.ok(b.toolMcp.length <= 64 && b.mcpMucLuc.length > 80, `${b.toolMcp.length} tool + ${b.mcpMucLuc?.length} mục lục`);
  assert.equal(b.toolMcp.length + b.mcpMucLuc.length, MAU_TOOLS_DAY_DU.length, 'MỌI tool CT Work đều với tới được');

  // 4. Gợi ý sau việc ⇒ xem trước ⇒ đồng ý ⇒ transition (chỉ SAU đồng ý).
  const m6 = await man(19.9);
  assert.ok(co(m6, /Xong việc ở LF-18\? Bước tiếp theo đúng luật dự án/), `gợi ý sau việc:\n${xem(m6)}`);
  assert.ok(co(m6, /Chuyển LF-18 → Review/) && co(m6, /Bình luận bằng chứng/), xem(m6));
  const m7 = await man(21.9);
  assert.ok(co(m7, /Ghi lên CT Work · LF-18\?/) && co(m7, /In Progress → Review/), `xem trước:\n${xem(m7)}`);
  const tr = ghi.goi.filter(([t]) => t === 'transition');
  assert.equal(tr.length, 1, `transition đúng 1 lần (sau đồng ý): ${JSON.stringify(ghi.goi.map(([t]) => t))}`);
  assert.deepEqual(tr[0]![1], { project: 'LF', issue: 'LF-18', to: 'Review' });

  // 5. Phụ thuộc.
  const m8 = await man(26.9);
  assert.ok(co(m8, /cần @longbui làm xong LF-5 trước/), `phụ thuộc:\n${xem(m8)}`);

  // 6. 60×20: thẻ /ctwork không cao hơn màn hình — thấy viền dưới và chân thẻ.
  const m9 = await man(31.9);
  assert.ok(co(m9, /CT Work/) && co(m9, /1\. Sprint hiện tại/), `thẻ /ctwork 60×20:\n${xem(m9)}`);
  assert.ok(co(m9, /^╰─+╯\s*$/), `mất viền dưới ở 60×20:\n${xem(m9)}`);
  assert.ok(co(m9, /↑↓ chọn/), `mất chân thẻ ở 60×20:\n${xem(m9)}`);
  assert.ok(m9.every((d) => d.length <= 60), 'không dòng nào tràn 60 cột');

  // Mở lại cùng thư mục ⇒ KHÔNG hỏi tin nữa.
  const g2 = await chay(duAn, home, [[3.0, '\x03', 'Hỏi hoặc giao việc'], [3.2, '\x03']], 5);
  const n2 = (await phatLai(g2, 2.9)).manHinh;
  assert.ok(!co(n2, 'Mở thư mục làm việc:'), `thư mục đã tin vẫn hỏi lại:\n${xem(n2)}`);
});

test('PTY: mở ở thư mục HOME ⇒ cảnh báo đỏ, mặc định "Không, thoát"; Enter ⇒ thoát, không mở phiên', { skip: boQua, timeout: 60_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }> };
  const home = path.join(tam, 'home2');
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));
  const g = await chay(home, home, [[2.0, '\r', 'Mở thư mục làm việc']], 5);
  const m = (await phatLai(g, 1.9)).manHinh;
  assert.ok(m.some((d) => /thư mục HOME/.test(d)), `cảnh báo HOME:\n${m.join('\n')}`);
  assert.ok(m.some((d) => /❯ 2\. Không, thoát/.test(d)), `mặc định phải là "Không, thoát":\n${m.join('\n')}`);
  const cuoi = (await phatLai(g)).tatCa.join('\n');
  assert.match(cuoi, /CuongMini không mở thư mục chưa được tin/);
  assert.ok(!existsSync(path.join(home, '.cuongmini/thu-muc-tin.json')), 'không ghi nhớ khi người dùng từ chối');
  assert.equal(ghi.turn.filter((t) => t.workspace?.name === 'home2').length, 0);
});
