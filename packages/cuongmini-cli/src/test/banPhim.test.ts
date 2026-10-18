/**
 * Shift+Enter xuống dòng qua kitty keyboard protocol (đợt 3, 18/10/2026).
 * Đơn vị: bộ đọc CSI u của Ink + luật `laXuongDong`. PTY: bản dựng THẬT nhận `CSI 13;2u`
 * ⇒ ô nhập có 2 dòng (không gửi), `CSI 106;5u` (ctrl+j) ⇒ dòng thứ 3, Enter ⇒ gửi; bật
 * `CSI > 1 u` lúc vào và `CSI < u` lúc thoát — cả toàn màn hình lẫn in nối tiếp.
 */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BAT_KITTY, TAT_KITTY, doTerminalPhim, laXuongDong, nenBatKitty } from '../banPhim';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

type Phim = { name: string; ctrl: boolean; shift: boolean; meta: boolean; option: boolean; text?: string; isKittyProtocol?: boolean; isPrintable?: boolean; sequence: string };
async function docPhim(s: string): Promise<{ input: string; key: { return: boolean; shift: boolean; meta: boolean; ctrl: boolean; escape: boolean } }> {
  const m = await import(pathToFileURL(path.join(goc, 'node_modules/ink/build/parse-keypress.js')).href) as { default: (s: string) => Phim };
  const k = m.default(s);
  // Rút gọn đúng cách `useInput` của Ink dựng `input`/`key` (hooks/use-input.js).
  let input = k.isKittyProtocol ? (k.isPrintable ? (k.text ?? k.name) : k.ctrl && k.name.length === 1 ? k.name : '') : k.ctrl ? k.name : k.sequence;
  if (!k.isKittyProtocol && k.name === 'return') input = '';
  return { input, key: { return: k.name === 'return', shift: k.shift, meta: k.meta || k.name === 'escape' || k.option, ctrl: k.ctrl, escape: k.name === 'escape' } };
}

test('CSI u: Shift+Enter / Alt+Enter / ctrl+j ⇒ xuống dòng; Enter ⇒ gửi; Esc vẫn là Esc', async () => {
  const shiftEnter = await docPhim('\x1b[13;2u');
  assert.equal(shiftEnter.key.return, true);
  assert.equal(shiftEnter.key.shift, true);
  assert.equal(laXuongDong(shiftEnter.input, shiftEnter.key), true);
  const enter = await docPhim('\x1b[13u');
  assert.equal(enter.key.return, true);
  assert.equal(laXuongDong(enter.input, enter.key), false);
  const altEnter = await docPhim('\x1b[13;3u');
  assert.equal(laXuongDong(altEnter.input, altEnter.key), true);
  const ctrlJ = await docPhim('\x1b[106;5u');
  assert.equal(laXuongDong(ctrlJ.input, ctrlJ.key), true);
  const ctrlC = await docPhim('\x1b[99;5u');
  assert.equal(ctrlC.input, 'c');
  assert.equal(ctrlC.key.ctrl, true);
  const esc = await docPhim('\x1b[27u');
  assert.equal(esc.key.escape, true);
  // Kiểu cũ (terminal không hỗ trợ): `\r` gửi, LF (ctrl+j) và ESC+CR (Alt+Enter) xuống dòng.
  assert.equal(laXuongDong('\r', { return: true }), false);
  assert.equal(laXuongDong('\n', {}), true);
  assert.equal(laXuongDong('', { return: true, meta: true }), true);
});

test('chỉ bật kitty ở TTY thật — không CI, không -p, không TERM=dumb', () => {
  assert.equal(nenBatKitty({ tty: true, env: {} }), true);
  assert.equal(nenBatKitty({ tty: false, env: {} }), false);
  assert.equal(nenBatKitty({ tty: true, cheDoIn: true, env: {} }), false);
  assert.equal(nenBatKitty({ tty: true, env: { CI: 'true' } }), false);
  assert.equal(nenBatKitty({ tty: true, env: { TERM: 'dumb' } }), false);
  assert.equal(nenBatKitty({ tty: true, env: { CUONGMINI_KITTY: '0' } }), false);
});

test('đoán terminal để gợi ý đúng phím', () => {
  assert.equal(doTerminalPhim({ TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.4' }), 'iterm');
  assert.equal(doTerminalPhim({ TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.4.23' }), 'itermCu');
  assert.equal(doTerminalPhim({ TERM_PROGRAM: 'Apple_Terminal' }), 'appleTerminal');
  assert.equal(doTerminalPhim({ TERM_PROGRAM: 'WezTerm' }), 'kitty');
  assert.equal(doTerminalPhim({ TERM_PROGRAM: 'vscode' }), 'vscode');
});

// ─── PTY: bản dựng thật ────────────────────────────────────────────

const dist = path.join(goc, 'dist/cuongmini.mjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const boQua = !existsSync(dist) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : false;
let tam = '';
let may: Server | null = null;
let cong = 0;

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'ctw-phim-'));
  may = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(req.url === '/api/v1/auth/refresh' ? { data: { userId: 7, username: 'thu', fullName: 'Thử', token: 'tk-thu' } } : { data: {} }));
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

async function chay(ten: string, coThem: string[], phim?: Array<[number, string]>, giayChay = 8.5): Promise<{ su_kien: Array<[string, number, string]> }> {
  const home = path.join(tam, ten);
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  mkdirSync(path.join(tam, 'duan'), { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'thu', fullName: 'Thử', token: 'tk-thu', luu: new Date().toISOString() }));
  const cauHinh = path.join(tam, `${ten}.json`);
  const ra = path.join(tam, `ghi-${ten}.json`);
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist, ...coThem], cwd: path.join(tam, 'duan'), cols: 110, rows: 32, duration: giayChay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_LOI: path.join(goc, 'thu/loiGia.cjs'), LOI_GIA_NHANH: '1', CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1',
      TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10', CUONGMINI_NGON_NGU: 'vi',
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI'],
    keys: phim ?? [[2.4, 'dong mot'], [2.8, '\x1b[13;2u'], [3.1, 'dong hai'], [3.4, '\x1b[106;5u'], [3.7, 'dong ba'], [6.0, '\x1b[99;5u'], [6.4, '\x1b[99;5u'], [6.7, '\x1b[99;5u']],
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return JSON.parse(readFileSync(ra, 'utf8'));
}

test('PTY: CSI 13;2u xuống dòng trong ô nhập (toàn màn hình + in nối tiếp), bật/tắt kitty', { skip: boQua, timeout: 60_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }> };
  const [fs, noi] = await Promise.all([chay('fs', []), chay('noi', ['--no-fullscreen'])]);
  for (const g of [fs, noi]) {
    const tho = g.su_kien.filter((e) => e[0] === 'o').map((e) => Buffer.from(e[2], 'base64').toString('utf8')).join('');
    assert.ok(tho.includes(BAT_KITTY), 'phải bật kitty keyboard protocol (CSI > 1 u)');
    assert.ok(tho.lastIndexOf(TAT_KITTY) > tho.indexOf(BAT_KITTY), 'phải tắt (CSI < u) khi thoát');
    const m = await phatLai(g, 5.5);
    const dong = (s: string) => m.manHinh.findIndex((d) => d.includes(s));
    const [a, b, c] = [dong('dong mot'), dong('dong hai'), dong('dong ba')];
    assert.ok(a >= 0 && b === a + 1 && c === b + 1, `ô nhập phải có 3 dòng liên tiếp:\n${m.manHinh.join('\n')}`);
  }
});

test('PTY toàn màn hình mặc định: KHÔNG bắt chuột, KHÔNG xoá scrollback; ↑ ở ô trống ⇒ cuộn bản ghi, ô nhập vẫn ở đáy', { skip: boQua, timeout: 60_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[]; manPhu: boolean }> };
  const g = await chay('cuon', [], [
    [2.4, 'sửa laEmail'], [2.7, '\r'], [4.2, '1'], [5.0, '1'],
    [7.0, '\x1b[A'], [7.2, '\x1b[A'], [7.4, '\x1b[A'], [7.6, '\x1b[A'],
  ], 9);
  const tho = g.su_kien.filter((e) => e[0] === 'o').map((e) => Buffer.from(e[2], 'base64').toString('utf8')).join('');
  for (const ma of ['\x1b[?1000h', '\x1b[?1002h', '\x1b[?1003h', '\x1b[?1006h']) assert.ok(!tho.includes(ma), `không được bật mouse tracking (${JSON.stringify(ma)})`);
  assert.ok(tho.includes('\x1b[?1007h'), 'bật alternate scroll để con lăn ⇒ ↑/↓');
  assert.ok(!tho.includes('\x1b[3J'), 'toàn màn hình không bao giờ xoá scrollback (iTerm2 hiện thanh hỏi)');
  assert.ok(!tho.includes('ClearScrollback'));
  const truoc = await phatLai(g, 6.8);
  const sau = await phatLai(g, 8.8);
  assert.equal(sau.manPhu, true);
  const coDong = (m: string[], s2: string[]) => m.some((d) => s2.some((x) => d.includes(x)));
  assert.ok(!coDong(truoc.manHinh, ['đang xem lại', 'scrolled up']), truoc.manHinh.join('\n'));
  assert.ok(coDong(sau.manHinh, ['đang xem lại', 'scrolled up']), `↑ ở ô trống phải cuộn bản ghi:\n${sau.manHinh.join('\n')}`);
  const oNhap = sau.manHinh.findIndex((d) => /Hỏi hoặc giao việc|Ask or give a task/.test(d));
  assert.ok(oNhap >= sau.manHinh.length - 5, `ô nhập phải còn ghim ở đáy (dòng ${oNhap}/${sau.manHinh.length}):\n${sau.manHinh.join('\n')}`);
});

test('PTY: chuỗi lệnh `/` (help, sessions, hen, quyen, ctwork→Esc, copy, worktree) không crash, không khung trùng', { skip: boQua, timeout: 60_000 }, async () => {
  const { phatLai, demDong } = await import(path.join(goc, 'thu/phatLai.mjs')) as {
    phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }>; demDong: (d: string[], c: string[]) => number;
  };
  const O_NHAP = ['Ask or give a task', 'Hỏi hoặc giao việc', 'CuongMini is working', 'CuongMini đang làm'];
  const phim: Array<[number, string]> = [];
  let t = 2.4;
  for (const c of ['/help', '/sessions', '/hen', '/quyen', '/copy q', '/worktree', '/ctwork']) { phim.push([t, c], [t + 0.25, '\r']); t += 0.9; }
  phim.push([t, '\x1b']);
  const [fs, noi] = await Promise.all([chay('lenh-fs', [], phim, t + 1.5), chay('lenh-noi', ['--no-fullscreen'], phim, t + 1.5)]);
  for (const [g, ten] of [[fs, 'toàn màn hình'], [noi, 'in nối tiếp']] as const) {
    const tho = g.su_kien.filter((e) => e[0] === 'o').map((e) => Buffer.from(e[2], 'base64').toString('utf8')).join('');
    const loiLT = /.{0,120}(TypeError|ReferenceError|Cannot read properties).{0,160}/.exec(tho.replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]/g, ''));
    assert.equal(loiLT, null, `${ten}: có lỗi lập trình lọt ra màn hình: ${loiLT?.[0]}`);
    const m = await phatLai(g);
    assert.equal(demDong(m.manHinh, O_NHAP), 1, `${ten}: ô nhập phải đúng một:\n${m.manHinh.join('\n')}`);
  }
});
