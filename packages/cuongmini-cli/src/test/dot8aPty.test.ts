/**
 * ĐỢT 8A — PTY THẬT + LÕI THẬT (`dist/loi.cjs`) + máy chủ CuongThai GIẢ (MCP CT Work giả). Không chạm máy chủ thật.
 *   1. Gợi ý bước tiếp: lượt xong ⇒ CHỮ MỜ câu gợi ý đầu ở ô nhập trống + "⇥ tab"; Tab ⇒ điền vào ô (chưa gửi); Enter ⇒
 *      gửi đúng câu đó; lượt sau gõ ký tự khác ⇒ chữ mờ biến mất. `/usage` ⇒ vẽ hạn mức THẬT của máy chủ (`cuongMini`).
 *   2. CT Work gắn theo THƯ MỤC: thư mục lạ ⇒ chỉ dòng gợi ý nhẹ "gõ /ctwork" (không thẻ "Kết nối CT Work?"); nối CT Work ở
 *      đây ⇒ KHÔNG dòng trạng thái, KHÔNG tool ctwork / `ctworkDuAn` gửi model; mở lại ⇒ không hỏi gì, vẫn không tool ctwork.
 *   3. AGENTS.md ghi rõ mã dự án CT Work ⇒ hỏi MỘT lần; "Không" ⇒ mở lại không hỏi nữa.
 *   4. Thư mục ĐÃ gắn ⇒ dòng "⬡ LF", thân gửi có tool ctwork + `ctworkDuAn`; `/mcp` ⇒ Quản lý server ⇒ Ngắt ⇒ "đã ngắt
 *      (phiên này)" (lượt sau không còn tool ctwork) ⇒ Kết nối ⇒ "đã nối" lại.
 */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { MAU_TOOLS_DAY_DU, MAU_MY_WORK, mauSprintCurrent } from '../../../../desktop/src/main/agent/ctworkMauThu';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dist = path.join(goc, 'dist/cuongmini.mjs');
const loi = path.join(goc, 'dist/loi.cjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const boQua = !existsSync(dist) || !existsSync(loi) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : false;

let tam = '';
let may: Server | null = null;
let cong = 0;
const ghi = { turn: [] as Array<Record<string, any>>, token: 0, mcp: 0, usage: [] as string[] };
const DS_DU_AN = [{ key: 'LF', name: 'LabFlow AI', kind: 'SCHOOL', myRole: 'MEMBER', archived: false, openIssues: 4, workspace: 'labflow-studio', id: 2, workspaceId: 3, workspaceName: 'LabFlow Studio' }];
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
  tam = mkdtempSync(path.join(os.tmpdir(), 'cm-dot8a-pty-'));
  may = createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      const url = req.url ?? '';
      if (url === '/api/v1/auth/refresh') return json(res, 200, { data: { userId: 7, username: 'an', fullName: 'An', token: 'tk-thu' } });
      if (url === '/api/v1/work/me/api-tokens' && req.method === 'POST') { ghi.token += 1; return json(res, 201, { data: { token: `ctw_dot8a_${ghi.token}`, id: 100 + ghi.token } }); }
      if (url.startsWith('/api/v1/work/me/api-tokens/') && req.method === 'DELETE') return json(res, 200, { data: { ok: true } });
      if (url === '/api/v1/work/mcp') {
        if (req.method !== 'POST') { res.writeHead(405).end(); return; }
        const tin = JSON.parse(than) as { id?: number; method: string; params?: { name?: string; cursor?: string } };
        if (tin.id === undefined) { res.writeHead(202).end(); return; }
        ghi.mcp += 1;
        const ten = String(tin.params?.name ?? '');
        const chu = ten === 'list_projects' ? `1 project(s). Names are user data.\n${boc('project list', JSON.stringify(DS_DU_AN))}`
          : ten === 'sprint_current' ? mauSprintCurrent(5) : ten === 'my_work' ? MAU_MY_WORK : ten === 'list_pages' ? '0 page(s).' : '{"ok":true}';
        const ds = MAU_TOOLS_DAY_DU.filter((t) => !t.ghi);
        const tu = Number(tin.params?.cursor ?? 0);
        const kq = tin.method === 'initialize' ? { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'ctwork-gia', version: '1' } }
          : tin.method === 'tools/list' ? { tools: ds.slice(tu, tu + 60).map((t) => ({ name: t.name, description: t.mo, inputSchema: { type: 'object', properties: {} }, annotations: { title: t.name, readOnlyHint: true } })), ...(tu + 60 < ds.length ? { nextCursor: String(tu + 60) } : {}) }
            : tin.method === 'tools/call' ? { content: [{ type: 'text', text: chu }], isError: false } : {};
        return json(res, 200, { jsonrpc: '2.0', id: tin.id, result: kq });
      }
      if (url.startsWith('/api/v1/agent/usage')) {
        ghi.usage.push(url);
        return json(res, 200, { data: {
          daDung: 0, tran: 1, phanTram: 0, conLai: 1, hoiLucNao: null,
          cuongMini: {
            phienBan: 2, laAdmin: false, goi: 'pro',
            model: { id: 'cm-solid', ten: 'CuongMini Solid', loai: 'theo_tien', khongGioiHan: false, daDungNgay: 1.25, tranNgay: 3, daDungThang: 4.5, tranThang: 15 },
            vi: { daDung: 2, tran: 10, phanTram: 20, soGio: 5, hoiLucNao: null, khongGioiHan: false, giaHan: 0 },
            default: { phut: 1, tranPhut: 10, ngay: 7, tranNgay: null, free: false },
            giaHan: { soLanKy: 1, usdKy: 3, dangCho: 0 },
          },
        } });
      }
      if (url === '/api/v1/agent/turn') {
        const b = JSON.parse(than) as Record<string, any>;
        ghi.turn.push(b);
        const n = ghi.turn.length;
        const chu = `Trả lời lượt ${n}.`;
        return sse(res, [{ type: 'start', model: 'gia' }, { type: 'text', delta: chu },
          { type: 'done', append: [{ role: 'assistant', content: chu }], stop: 'end', usage: { inputTokens: 10, outputTokens: 5, costUsd: 0.001 }, quota: null,
            nguCanh: { kyTu: 100, tran: 1000, phanTram: 12, soLuotDaBo: 0 },
            goiY: [`Chạy npm test lượt ${n}`, 'Chuyển LF-18 sang Review'] }]);
      }
      return json(res, 200, { data: {} });
    });
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

async function chay(cwd: string, home: string, phim: Array<[number, string] | [number, string, string]>, giayChay: number): Promise<unknown> {
  const cauHinh = path.join(tam, `pty-${Date.now()}.json`);
  const ra = path.join(tam, `ghi-${Date.now()}.json`);
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist], cwd, cols: 120, rows: 42, duration: giayChay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_KHONG_DAT_TIEU_DE: '1', CUONGMINI_TIN_THU_MUC: '1',
      CUONGMINI_CTW_TRE_MS: '800',
      TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10', CUONGMINI_NGON_NGU: 'vi',
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI'],
    keys: phim,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return JSON.parse(readFileSync(ra, 'utf8'));
}

type PhatLai = (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }>;
const co = (m: string[], s: string | RegExp) => m.some((d) => (typeof s === 'string' ? d.includes(s) : s.test(d)));
const xem = (m: string[]) => m.join('\n');
const coCtw = (b: Record<string, any>) => (b.toolMcp ?? []).some((t: { name: string }) => t.name.startsWith('mcp__ctwork__')) || (b.mcpMucLuc ?? []).some((t: { name: string }) => t.name.startsWith('mcp__ctwork__'));

function taoHome(ten: string): string {
  const home = path.join(tam, ten);
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));
  return home;
}

test('PTY: gợi ý bước tiếp = chữ mờ ⇒ Tab điền (Enter gửi) ⇒ gõ khác thì biến mất; /usage vẽ hạn mức thật', { skip: boQua, timeout: 120_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: PhatLai };
  const home = taoHome('home-goiy');
  const duAn = path.join(tam, 'goi-y');
  mkdirSync(duAn, { recursive: true });
  const truoc = ghi.turn.length;
  const g = await chay(duAn, home, [
    [2.5, 'sửa a.ts', 'Hỏi hoặc giao việc'], [2.9, '\r'],
    [6.0, '\t', 'Chạy npm test lượt'], // Tab ⇒ điền
    [7.5, '\r'], // Enter ⇒ gửi đúng câu gợi ý
    [11.0, 'x', 'Trả lời lượt'], // lượt 2 xong ⇒ gõ "x" ⇒ chữ mờ biến mất
    [12.0, '\x7f'], [12.5, '/usage'], [12.9, '\r'],
  ], 17);
  const man = async (t: number) => (await phatLai(g, t)).manHinh;
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [5.9, 7.4, 10.9, 11.9, 16.5]) console.log(`\n──── t=${t}s ────\n${xem(await man(t))}`);
  const m1 = await man(5.9);
  assert.ok(co(m1, /❯ .*Chạy npm test lượt \d+.*⇥ tab/), `chữ mờ + ⇥ tab:\n${xem(m1)}`);
  const m2 = await man(7.4);
  assert.ok(co(m2, /❯ Chạy npm test lượt \d+/) && !co(m2, /⇥ tab/), `Tab điền vào ô (chưa gửi):\n${xem(m2)}`);
  assert.equal(ghi.turn.length - truoc >= 1, true);
  const luot = ghi.turn.slice(truoc);
  assert.ok(luot.length >= 2, `Enter phải gửi lượt 2: ${luot.length}`);
  const cuoi = luot[1]!.messages.filter((x: { role: string }) => x.role === 'user').at(-1);
  assert.match(typeof cuoi.content === 'string' ? cuoi.content : JSON.stringify(cuoi.content), /Chạy npm test lượt/);
  const m3 = await man(11.9);
  assert.ok(co(m3, /❯ x/) && !co(m3, /⇥ tab/), `gõ ký tự khác ⇒ chữ mờ biến mất:\n${xem(m3)}`);
  const m4 = await man(16.5);
  assert.ok(co(m4, /Hạn mức CuongMini/) && co(m4, /CuongMini Solid/) && co(m4, /\$1\.25 \/ \$3/) && co(m4, /Gia hạn tháng này: 1 lần/), `/usage:\n${xem(m4)}`);
  assert.ok(co(m4, /ngữ cảnh 12%/), `/usage có context % của phiên:\n${xem(m4)}`);
  assert.match(ghi.usage.at(-1) ?? '', /model=cm-/, 'lõi gửi model đang chọn');
});

test('PTY: thư mục lạ ⇒ không CT Work (chỉ gợi ý nhẹ); AGENTS.md có mã ⇒ hỏi 1 lần, "Không" ⇒ không hỏi lại; thư mục đã gắn ⇒ đủ + /mcp ngắt ⇒ kết nối lại', { skip: boQua, timeout: 240_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: PhatLai };
  const home = taoHome('home-ctw');
  const la = path.join(tam, 'thu-muc-la');
  const coMa = path.join(tam, 'co-ma');
  const daGan = path.join(tam, 'da-gan');
  for (const d of [la, coMa, daGan]) mkdirSync(d, { recursive: true });
  writeFileSync(path.join(la, 'AGENTS.md'), '# Dự án ví dụ\nThis project README explains the API project. Tickets ABC-1, ABC-2, ABC-3.\n');
  writeFileSync(path.join(coMa, 'AGENTS.md'), '# AGENTS\n- Dự án CT Work: **LF**\n');
  mkdirSync(path.join(daGan, '.cuongmini'), { recursive: true });
  writeFileSync(path.join(daGan, '.cuongmini/ctwork.json'), JSON.stringify({ key: 'LF', projectId: 2, workspaceId: 3, ten: 'LabFlow AI' }));

  // (a) Thư mục lạ, chưa nối: chỉ dòng gợi ý; nối ở đây; hỏi ⇒ không tool ctwork, không dòng ⬡.
  let t0 = ghi.turn.length;
  const a = await chay(la, home, [
    [3.0, '/ctwork', 'gõ /ctwork'], [3.4, '\r'],
    [5.5, '1', 'CT Work — kết nối'],
    [8.0, 'chào', 'CT Work đã nối'], [8.4, '\r'],
  ], 12);
  const ma = await phatLai(a, 2.9);
  if (process.env.CUONGMINI_PTY_IN === '1') console.log(`\n──── lạ ────\n${xem(ma.manHinh)}\n──── lạ cuối ────\n${xem((await phatLai(a)).manHinh)}`);
  assert.ok(co(ma.manHinh, /Làm dự án trên CT Work\? gõ \/ctwork/), `dòng gợi ý nhẹ:\n${xem(ma.manHinh)}`);
  assert.ok(!co(ma.manHinh, 'Kết nối CT Work?') && !co(ma.manHinh, /Gắn thư mục/), `không thẻ chặn / không hỏi gắn:\n${xem(ma.manHinh)}`);
  assert.equal(ghi.token, 1, 'nối bằng phiên đăng nhập khi người dùng chủ động /ctwork');
  const ba = ghi.turn.slice(t0).at(-1)!;
  assert.ok(ba, 'phải có lượt');
  assert.ok(!coCtw(ba), `thư mục chưa gắn ⇒ không gửi tool ctwork: ${(ba.toolMcp ?? []).length}`);
  assert.equal(ba.ctworkDuAn, undefined);
  const caA = (await phatLai(a)).tatCa.join('\n');
  assert.ok(!/⬡ /.test(caA) && !/AGENTS\.md \(CT Work\)/.test(caA) && !/Hôm nay/.test(caA), 'không dòng trạng thái / AGENTS.md nhóm / Hôm nay');

  // (a2) Mở lại thư mục lạ (đã nối): không hỏi gì; vẫn không tool ctwork.
  t0 = ghi.turn.length;
  const a2 = await chay(la, home, [[3.5, 'chào lại', 'Hỏi hoặc giao việc'], [3.9, '\r']], 7);
  const m2 = (await phatLai(a2)).tatCa.join('\n');
  assert.ok(!/Kết nối CT Work\?|Gắn thư mục|gõ \/ctwork|⬡ /.test(m2), `mở lại thư mục lạ: không gì về CT Work:\n${m2.slice(-1500)}`);
  assert.ok(!coCtw(ghi.turn.slice(t0).at(-1)!), 'vẫn không tool ctwork');

  // (b) AGENTS.md ghi rõ mã ⇒ hỏi MỘT lần; "Không" ⇒ mở lại không hỏi.
  const b = await chay(coMa, home, [[3.5, '0', 'Gắn thư mục này với dự án CT Work LF']], 6);
  assert.ok(co((await phatLai(b, 3.4)).manHinh, /Gắn thư mục này với dự án CT Work LF\?/), 'phải hỏi gắn LF');
  assert.ok(!existsSync(path.join(coMa, '.cuongmini/ctwork.json')), '"Không" ⇒ không gắn');
  const b2 = await chay(coMa, home, [[4.0, 'x', 'Hỏi hoặc giao việc']], 6);
  assert.ok(!/Gắn thư mục/.test((await phatLai(b2)).tatCa.join('\n')), 'đã trả lời "Không" ⇒ không hỏi lại');

  // (c) Thư mục đã gắn ⇒ đủ; /mcp ⇒ quản lý server ⇒ Ngắt ⇒ lượt sau không tool ctwork ⇒ Kết nối ⇒ đã nối.
  t0 = ghi.turn.length;
  const c = await chay(daGan, home, [
    [3.5, 'đọc LF', '⬡ LF'], [3.9, '\r'],
    [7.0, '/mcp', 'Trả lời lượt'], [7.4, '\r'],
    [9.0, '5', 'Quản lý một server'], [10.5, '1', 'Chọn máy chủ MCP'], [12.0, '1', 'MCP · ctwork'],
    [14.5, '\x1b', 'Đã ngắt ctwork'],
    [15.5, 'sau khi ngắt', 'Hỏi hoặc giao việc'], [15.9, '\r'],
    [19.0, '/mcp', 'Trả lời lượt'], [19.4, '\r'],
    [21.0, '5', 'Quản lý một server'], [22.5, '1', 'Chọn máy chủ MCP'], [24.0, '1', 'MCP · ctwork'],
  ], 30);
  const mc = async (t: number) => (await phatLai(c, t)).manHinh;
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [6.9, 11.9, 14.4, 23.9, 29.5]) console.log(`\n──── gắn t=${t} ────\n${xem(await mc(t))}`);
  const lc = ghi.turn.slice(t0);
  assert.ok(coCtw(lc[0]!) && lc[0]!.ctworkDuAn === 2, 'thư mục đã gắn ⇒ có tool ctwork + ctworkDuAn');
  assert.ok(co(await mc(6.9), /⬡ LF/), `dòng trạng thái:\n${xem(await mc(6.9))}`);
  const m12 = await mc(11.9);
  assert.ok(co(m12, /1\. Ngắt kết nối/) && co(m12, /2\. Kết nối lại/) && co(m12, /Đổi dự án đang gắn/) && co(m12, /Đăng xuất CT Work/), `hành động server CT Work:\n${xem(m12)}`);
  const m14 = await mc(14.4);
  assert.ok(co(m14, /Đã ngắt ctwork trong phiên này/) && co(m14, /đã ngắt \(phiên này\)/), `đã ngắt:\n${xem(m14)}`);
  assert.ok(lc[1] && !coCtw(lc[1]), 'đã ngắt ⇒ lượt sau không còn tool ctwork');
  const m24 = await mc(23.9);
  assert.ok(co(m24, /1\. Kết nối/), `server đang ngắt ⇒ nút Kết nối:\n${xem(m24)}`);
  const m29 = await mc(29.5);
  assert.ok(co(m29, /Đã nối ctwork/) && co(m29, /✔ đã nối/), `kết nối lại:\n${xem(m29)}`);
});
