/**
 * KIỂM ĐẦU-CUỐI TRÊN WINDOWS (đợt 8C): chạy `dist/cuongmini.mjs` THẬT trong ConPTY (như Windows Terminal/cmd),
 * máy chủ CuongThai GIẢ trên 127.0.0.1, clipboard đặt bằng .NET. Bấm alt+v / ctrl+v ⇒ phải thấy `[Ảnh #n]` và lượt
 * gửi đi có ảnh PNG; clipboard chỉ có chữ ⇒ báo rõ; kéo-thả đường có ngoặc kép + dấu cách ⇒ đính được.
 * Cần: `npm i --no-save @lydell/node-pty` (ConPTY dựng sẵn) + `node build.mjs`. Chạy: npx tsx thu/kiemWindowsPty.mts
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pty = createRequire(import.meta.url)('@lydell/node-pty') as typeof import('node-pty');
const tam = path.join(os.tmpdir(), 'cm pty 8c', 'Người dùng');
rmSync(path.join(os.tmpdir(), 'cm pty 8c'), { recursive: true, force: true });
mkdirSync(path.join(tam, '.cuongmini'), { recursive: true });
writeFileSync(path.join(tam, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));
const duAn = path.join(tam, 'du an');
mkdirSync(duAn, { recursive: true });
const fAnh = path.join(tam, 'ảnh kéo (1).png');
copyFileSync(path.join(goc, 'tai-nguyen/cuongmini.png'), fAnh);

const ps = (script: string, them: Record<string, string> = {}) => spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-STA', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')], { encoding: 'utf8', env: { ...process.env, ...them } });
const datAnh = () => ps(`Add-Type -AssemblyName System.Windows.Forms, System.Drawing; $b = New-Object System.Drawing.Bitmap 64, 48; $g = [System.Drawing.Graphics]::FromImage($b); $g.Clear([System.Drawing.Color]::Green); $g.Dispose(); [System.Windows.Forms.Clipboard]::SetImage($b)`);
const datChu = () => ps(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetText('chỉ chữ')`);

const luot: string[] = [];
/** Tin NGƯỜI DÙNG cuối của một lượt có ảnh PNG không (thân lượt sau mang cả lịch sử — đừng tìm cả chuỗi). */
const tinCuoiCoAnh = (than: string | undefined): boolean => {
  if (!than) return false;
  const m = (JSON.parse(than) as { messages: Array<{ role: string; content: unknown }> }).messages.filter((x) => x.role === 'user').at(-1);
  return /iVBORw0KGgo/.test(JSON.stringify(m?.content ?? ''));
};
const may = createServer((req, res) => {
  let than = '';
  req.on('data', (c) => { than += c; });
  req.on('end', () => {
    const url = req.url ?? '';
    const json = (v: unknown) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(v)); };
    if (url === '/api/v1/auth/refresh') return json({ data: { userId: 7, username: 'an', fullName: 'An', token: 'tk-thu' } });
    if (url === '/api/v1/agent/turn') {
      luot.push(than);
      const chu = `Đã nhận lượt ${luot.length}.`;
      setTimeout(() => {
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        res.end([{ type: 'start', model: 'gia' }, { type: 'text', delta: chu }, { type: 'done', append: [{ role: 'assistant', content: chu }], stop: 'end', usage: { inputTokens: 1, outputTokens: 1, costUsd: 0 }, quota: null }].map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
      }, 1500);
      return undefined;
    }
    return json({ data: {} });
  });
});
await new Promise<void>((ok) => may.listen(0, '127.0.0.1', ok));
const cong = (may.address() as { port: number }).port;

let ra = '';
// ConPTY vẽ lại màn hình bằng lệnh di con trỏ (khoảng trắng ⇒ `CSI n C`) — bỏ mã ANSI là dính chữ. Dựng lại màn hình bằng
// xterm headless (bộ giải mã của VS Code) rồi mới tìm chữ.
const { Terminal } = createRequire(import.meta.url)('@xterm/headless') as typeof import('@xterm/headless');
const term = new Terminal({ cols: 120, rows: 40, scrollback: 2000, allowProposedApi: true });
const manHinh = () => {
  const b = term.buffer.active;
  const d: string[] = [];
  for (let i = 0; i < b.length; i += 1) d.push(b.getLine(i)?.translateToString(true) ?? '');
  return d.join('\n');
};
// CM_DIST = bản CLI khác để đối chiếu (vd 0.6.1 đã phát hành); CM_THEM_ENV = JSON biến môi trường thêm.
const distFile = process.env.CM_DIST || path.join(goc, 'dist/cuongmini.mjs');
console.log(`CLI: ${distFile} · env thêm: ${process.env.CM_THEM_ENV ?? '{}'}`);
const p = pty.spawn(process.execPath, [distFile], {
  name: 'xterm-256color', cols: 120, rows: 40, cwd: duAn,
  // Biến CI phải XOÁ hẳn (không đặt rỗng): Ink coi `'CI' in env` là đang chạy CI ⇒ không vẽ khung động.
  env: Object.fromEntries(Object.entries({
    ...process.env, USERPROFILE: tam, HOME: tam, CUONGMINI_HOME: path.join(tam, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
    CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_TIN_THU_MUC: '1', CUONGMINI_NGON_NGU: 'vi', LANG: 'vi_VN.UTF-8',
    WT_SESSION: '00000000-0000-0000-0000-000000000000', CUONGMINI_LUOT_DAI_MS: '500',
    ...(JSON.parse(process.env.CM_THEM_ENV || '{}') as Record<string, string>),
  }).filter(([k, v]) => v !== undefined && !['CI', 'GITHUB_ACTIONS', 'TF_BUILD', 'RUNNER_OS', 'BUILD_NUMBER', 'CONTINUOUS_INTEGRATION'].includes(k) && !k.startsWith('CI_'))) as Record<string, string>,
});
p.onData((d) => { ra += d; term.write(d); });
const chu = () => manHinh();
const ngu = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
async function cho(mau: RegExp | (() => boolean), ms = 25_000): Promise<boolean> {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (typeof mau === 'function' ? mau() : mau.test(chu())) return true;
    await ngu(150);
  }
  return false;
}
let hong = 0;
const ket = (ten: string, ok: boolean, chiTiet = '') => { if (!ok) hong += 1; console.log(`${ok ? 'XANH' : 'DO  '} ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`); };
const duoi = (n = 1500) => `\n${chu().split('\n').filter((d) => d.trim()).slice(-14).join('\n').slice(-n)}`;

const moDuoc = await cho(/Hỏi hoặc giao việc|Ask or give a task/);
ket('CLI mở tới ô nhập', moDuoc, duoi());
if (!moDuoc) console.log(`RAW đầu: ${JSON.stringify(ra.slice(0, 2500))}\nRAW cuối: ${JSON.stringify(ra.slice(-1500))}`);
await ngu(800);

// 1) alt+v với ảnh trong clipboard.
datAnh();
p.write('\x1bv');
ket('alt+v ⇒ [Ảnh #1]', await cho(/\[Ảnh #1\]/), duoi(600));
p.write('mô tả ảnh này');
await ngu(300);
p.write('\r');
ket('lượt 1 gửi kèm ảnh PNG', await cho(() => tinCuoiCoAnh(luot[0])), luot[0] ? `${luot[0].length} byte` : 'chưa có lượt');
await cho(/Đã nhận lượt 1/);
await ngu(1000);

// 2) ctrl+v (conhost/ConPTY để lọt ⇒ cũng nhận).
datAnh();
p.write('\x16');
ket('ctrl+v ⇒ [Ảnh #2]', await cho(/\[Ảnh #2\]/), duoi(600));
for (let i = 0; i < 12; i += 1) p.write('\x7f');
await ngu(500);

// 3) Clipboard chỉ có chữ ⇒ báo rõ.
datChu();
p.write('\x1bv');
ket('clipboard không có ảnh ⇒ báo rõ', await cho(/Clipboard không có ảnh/), duoi(600));
await ngu(500);

// 4) Kéo-thả: đường bọc ngoặc kép, có dấu cách + tiếng Việt + ngoặc tròn.
p.write(`"${fAnh}" xem giúp`);
await ngu(400);
p.write('\r');
ket('kéo-thả "C:\\…\\ảnh kéo (1).png" ⇒ lượt 2 có ảnh', await cho(() => tinCuoiCoAnh(luot[1])), luot[1] ? `${luot[1].length} byte` : 'chưa có lượt 2');
await cho(/Đã nhận lượt 2/);
await ngu(800);

// 5) Hiệu ứng (WT_SESSION): ConPTY có chuyển OSC 0 / 9;4 hay không tuỳ bản conhost — GHI LẠI, không chấm.
console.log(`OSC 0 (tiêu đề) thấy: ${/\x1b\]0;[^\x07]*đang làm/.test(ra)} · OSC 9;4;3: ${ra.includes('\x1b]9;4;3')} · OSC 9;4;0: ${ra.includes('\x1b]9;4;0')}`);

console.log(`RAW ${ra.length} byte · MÀN HÌNH CUỐI:${duoi(2500)}`);
p.write('\x03');
await ngu(300);
p.write('\x03');
await cho(() => false, 2500);
try { p.kill(); } catch { /* đã thoát */ }
may.close();
console.log(hong ? `\n${hong} mục ĐỎ` : '\nTẤT CẢ XANH');
process.exit(hong ? 1 : 0);
