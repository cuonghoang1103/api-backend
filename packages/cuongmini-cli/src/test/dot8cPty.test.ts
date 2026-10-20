/**
 * ĐỢT 8C — PTY THẬT + LÕI THẬT (`dist/`) + máy chủ CuongThai GIẢ + công cụ clipboard/thông báo GIẢ trên PATH
 * (osascript / wl-paste / notify-send — không đụng clipboard hay trung tâm thông báo thật của máy):
 *   1. iTerm2 3.7.2: alt+v dán ảnh ⇒ `[Ảnh #1]` ⇒ lượt gửi kèm PNG; ctrl+v khi clipboard chỉ có chữ ⇒ báo rõ; kéo-thả
 *      đường bọc nháy có dấu cách + tiếng Việt ⇒ lượt 2 có ảnh. Chuỗi phát ra: lưu tiêu đề, tiêu đề xoay "đang làm",
 *      OSC 9;4;3, user var, rời cửa sổ ⇒ thông báo GỐC OSC 9 (không gọi osascript), thoát ⇒ xoá 9;4 + trả tiêu đề.
 *   2. Apple Terminal: KHÔNG một chuỗi 9;4 / 1337 / OSC 9 nào; thông báo đi osascript với chữ qua argv đúng nguyên văn.
 *   3. Windows Terminal (WT_SESSION): có 9;4 nhưng KHÔNG OSC 9 thông báo (ở WT, OSC 9 ≠ thông báo).
 */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dist = path.join(goc, 'dist/cuongmini.mjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const boQua = !existsSync(dist) || !existsSync(path.join(goc, 'dist/loi.cjs')) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : false;

let tam = '';
let bin = '';
let may: Server | null = null;
let cong = 0;
const luot: string[] = [];

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'cm-dot8c-pty-'));
  bin = path.join(tam, 'bin');
  mkdirSync(bin, { recursive: true });
  /* Công cụ GIẢ: mỗi lần đọc clipboard lấy dòng kế tiếp của KỊCH BẢN (anh | chu); thông báo ghi argv vào nhật ký. */
  const doc = `n=$(cat "$CM_GIA_DEM" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$CM_GIA_DEM"; mode=$(sed -n "\${n}p" "$CM_GIA_KICH_BAN")`;
  writeFileSync(path.join(bin, 'osascript'), `#!/bin/sh
case "$*" in
  *"display notification"*) echo TB >> "$CM_GIA_LOG"; for a in "$@"; do printf 'ARG:%s\\n' "$a" >> "$CM_GIA_LOG"; done; exit 0;;
  *PNGf*) ${doc}; for a in "$@"; do last="$a"; done
    if [ "$mode" = anh ]; then cp "$CM_GIA_PNG" "$last"; printf OK; else printf EMPTY; fi; exit 0;;
esac
exit 0
`);
  writeFileSync(path.join(bin, 'wl-paste'), `#!/bin/sh
${doc}
if [ "$mode" = anh ]; then cat "$CM_GIA_PNG"; exit 0; fi
echo "No suitable type of content copied" >&2; exit 1
`);
  writeFileSync(path.join(bin, 'notify-send'), `#!/bin/sh
echo TB >> "$CM_GIA_LOG"; for a in "$@"; do printf 'ARG:%s\\n' "$a" >> "$CM_GIA_LOG"; done
`);
  for (const f of ['osascript', 'wl-paste', 'notify-send']) chmodSync(path.join(bin, f), 0o755);
  may = createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      const url = req.url ?? '';
      const json = (v: unknown) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(v)); };
      if (url === '/api/v1/auth/refresh') return json({ data: { userId: 7, username: 'an', fullName: 'An', token: 'tk-thu' } });
      if (url === '/api/v1/agent/turn') {
        luot.push(than);
        const chu = `Đã nhận lượt ${luot.length}.`;
        // Trễ 2 giây: đủ để thấy "đang làm" + rời cửa sổ trước khi xong.
        setTimeout(() => {
          res.writeHead(200, { 'content-type': 'text/event-stream' });
          res.end([{ type: 'start', model: 'gia' }, { type: 'text', delta: chu }, { type: 'done', append: [{ role: 'assistant', content: chu }], stop: 'end', usage: { inputTokens: 1, outputTokens: 1, costUsd: 0 }, quota: null }].map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
        }, 2000);
        return undefined;
      }
      return json({ data: {} });
    });
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

interface Ghi { su_kien: Array<[string, number, ...unknown[]]> }
const tho = (g: Ghi): string => Buffer.concat(g.su_kien.filter((e) => e[0] === 'o').map((e) => Buffer.from(String(e[2]), 'base64'))).toString('utf8');

async function chay(ten: string, envThem: Record<string, string>, phim: Array<[number, string] | [number, string, string]>, giay: number, kichBan: string[]): Promise<{ g: Ghi; log: string; duAn: string }> {
  const home = path.join(tam, `home-${ten}`);
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));
  const duAn = path.join(tam, `du-an-${ten}`);
  mkdirSync(duAn, { recursive: true });
  writeFileSync(path.join(tam, `kb-${ten}`), `${kichBan.join('\n')}\n`);
  const log = path.join(tam, `log-${ten}`);
  const cauHinh = path.join(tam, `pty-${ten}.json`);
  const ra = path.join(tam, `ghi-${ten}.json`);
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist], cwd: duAn, cols: 110, rows: 36, duration: giay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`, PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_TIN_THU_MUC: '1', CUONGMINI_LUOT_DAI_MS: '300',
      /* 20/10/2026: lúc mở CuongMini hỏi "Bạn muốn kết nối CT Work không?" (thẻ chặn phím) — bài này không thử CT Work ⇒ hoãn. */
      CUONGMINI_CTW_TRE_MS: '600000',
      TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', CUONGMINI_NGON_NGU: 'vi',
      CM_GIA_LOG: log, CM_GIA_DEM: path.join(tam, `dem-${ten}`), CM_GIA_KICH_BAN: path.join(tam, `kb-${ten}`), CM_GIA_PNG: path.join(goc, 'tai-nguyen/cuongmini.png'),
      ...envThem,
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI',
      'TERM_PROGRAM', 'TERM_PROGRAM_VERSION', 'WT_SESSION', 'TMUX', 'STY', 'ConEmuANSI', 'CUONGMINI_KHONG_DAT_TIEU_DE', 'CUONGMINI_HIEU_UNG', 'KITTY_WINDOW_ID', '__CFBundleIdentifier']
      .filter((k) => !(k in envThem)),
    keys: phim,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return { g: JSON.parse(readFileSync(ra, 'utf8')) as Ghi, log: existsSync(log) ? readFileSync(log, 'utf8') : '', duAn };
}

type PhatLai = (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }>;
const b64 = (s: string) => Buffer.from(s).toString('base64');
/** Tin NGƯỜI DÙNG cuối của một lượt (thân lượt sau mang cả lịch sử — tìm cả chuỗi là đạt vì lý do sai). */
const tinCuoi = (than: string): string => JSON.stringify((JSON.parse(than) as { messages: Array<{ role: string; content: unknown }> }).messages.filter((x) => x.role === 'user').at(-1)?.content ?? '');

test('PTY iTerm2: alt+v / ctrl+v / kéo-thả ảnh + tiêu đề xoay, OSC 9;4, user var, thông báo gốc OSC 9, dọn khi thoát', { skip: boQua, timeout: 120_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: PhatLai };
  const thuMucAnh = path.join(tam, 'ảnh kéo thả');
  mkdirSync(thuMucAnh, { recursive: true });
  const anhKeo = path.join(thuMucAnh, 'màn hình (1).png');
  copyFileSync(path.join(goc, 'tai-nguyen/cuongmini.png'), anhKeo);
  const truoc = luot.length;
  const { g, log } = await chay('iterm', { TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.7.2' }, [
    [3.0, '\x1bv', 'Hỏi hoặc giao việc'], // alt+v
    [4.5, 'mô tả ảnh', 'Ảnh #1'], [4.9, '\r'],
    [5.4, '\x1b[O'], // rời cửa sổ trong lúc lượt chạy
    [8.5, '\x1b[I', 'Đã nhận lượt 1'], // quay lại
    [9.5, '\x16'], // ctrl+v — clipboard chỉ có chữ
    [12.0, `'${anhKeo}' xem giúp`], [12.4, '\r'],
    [16.0, '\x03', 'Đã nhận lượt 2'], [16.3, '\x03'],
  ], 19, ['anh', 'chu']);
  const r = tho(g);
  const man = async (t: number) => (await phatLai(g, t)).manHinh.join('\n');
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [4.4, 7, 10.5, 15]) console.log(`\n── t=${t} ──\n${await man(t)}`);
  // Dán ảnh + kéo-thả.
  assert.match(await man(4.4), /\[Ảnh #1\]/, 'alt+v ⇒ thẻ ảnh trong ô nhập');
  const l = luot.slice(truoc);
  assert.ok(l.length >= 2, `phải có 2 lượt: ${l.length}`);
  assert.match(tinCuoi(l[0]!), /iVBORw0KGgo/, 'lượt 1 kèm PNG');
  assert.match(tinCuoi(l[1]!), /iVBORw0KGgo/, 'lượt 2 (kéo-thả) kèm PNG');
  assert.match(tinCuoi(l[1]!), /\[ảnh: màn hình \(1\)\.png\]/);
  assert.match(await man(10.5), /Clipboard không có ảnh/, 'ctrl+v khi clipboard chỉ có chữ ⇒ báo rõ');
  // Hiệu ứng.
  assert.ok(r.includes('\x1b[22;0t'), 'lưu tiêu đề cũ');
  assert.match(r, /\x1b\]0;[◐◓◑◒] [^\x07]+ · đang làm\x07/, 'tiêu đề xoay + đang làm');
  assert.ok(new Set(r.match(/\x1b\]0;([◐◓◑◒])/g) ?? []).size >= 3, 'biểu tượng có xoay');
  assert.ok(r.includes('\x1b]9;4;3;0\x07'), 'OSC 9;4 đang chạy');
  assert.ok(r.includes(`\x1b]1337;SetUserVar=cuongmini=${b64('working')}\x07`), 'user var working');
  assert.match(r, /\x1b\]0;✓ [^\x07]+ · xong\x07/, 'tiêu đề ✓ xong');
  assert.match(r, /\x1b\]9;CuongMini · Xong · [^\x07]+ · \d+ giây\x07/, 'thông báo gốc iTerm2 (OSC 9) khi rời cửa sổ');
  assert.ok(!/^TB$/m.test(log), `iTerm2 ⇒ KHÔNG gọi osascript thông báo:\n${log}`);
  const cuoi = r.lastIndexOf('\x1b]9;4;3;0\x07');
  assert.ok(r.indexOf('\x1b]9;4;0;0\x07', cuoi) > cuoi, 'xoá tiến độ sau lượt cuối');
  assert.ok(r.lastIndexOf('\x1b[23;0t') > cuoi && r.lastIndexOf(`\x1b]1337;SetUserVar=cuongmini=\x07`) > cuoi, 'thoát ⇒ trả tiêu đề + xoá user var');
  assert.ok(!r.includes('\x1b]9;4;2'), 'không lỗi ⇒ không trạng thái lỗi');
});

test('PTY Apple Terminal: không 9;4 / 1337 / OSC 9; thông báo hệ điều hành chữ đúng nguyên văn qua argv', { skip: boQua, timeout: 90_000 }, async () => {
  const { g, log } = await chay('apple', { TERM_PROGRAM: 'Apple_Terminal' }, [
    [3.0, 'làm "việc" \\ này', 'Hỏi hoặc giao việc'], [3.4, '\r'],
    [3.9, '\x1b[O'],
    [8.0, '\x03', 'Đã nhận lượt'], [8.3, '\x03'],
  ], 11, []);
  const r = tho(g);
  assert.ok(!r.includes('\x1b]9;'), 'không OSC 9 (cả 9;4 lẫn thông báo)');
  assert.ok(!r.includes('\x1b]1337;'), 'không user var iTerm2');
  assert.match(r, /\x1b\]0;[◐◓◑◒] [^\x07]+ · đang làm\x07/, 'tiêu đề vẫn có (OSC 0 phổ thông)');
  const args = log.split('\n').filter((d) => d.startsWith('ARG:')).map((d) => d.slice(4));
  if (process.platform === 'darwin') {
    assert.ok(args.includes('on run argv'), `osascript nhận chữ qua argv:\n${log}`);
    assert.equal(args.at(-3), 'CuongMini');
    assert.match(args.at(-1) ?? '', /^Xong · \d+ giây$/);
    assert.ok(!args.some((a) => a.includes('system attribute')));
  } else {
    assert.deepEqual(args.slice(0, 2), ['-a', 'CuongMini']);
    assert.match(args.at(-1) ?? '', /^Xong · .+ · \d+ giây$/);
  }
});

test('PTY Windows Terminal (WT_SESSION): có 9;4 nhưng KHÔNG OSC 9 thông báo, KHÔNG 1337', { skip: boQua, timeout: 90_000 }, async () => {
  const { g } = await chay('wt', { WT_SESSION: '0f0e0d0c-0000-4000-8000-000000000000' }, [
    [3.0, 'chào', 'Hỏi hoặc giao việc'], [3.4, '\r'],
    [7.5, '\x03', 'Đã nhận lượt'], [7.8, '\x03'],
  ], 10, []);
  const r = tho(g);
  assert.ok(r.includes('\x1b]9;4;3;0\x07') && r.includes('\x1b]9;4;0;0\x07'), 'tiến độ bật rồi xoá');
  assert.ok(!/\x1b\]9;(?!4;)/.test(r), 'không OSC 9 dạng thông báo');
  assert.ok(!r.includes('\x1b]1337;'));
});
