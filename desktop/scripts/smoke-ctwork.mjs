#!/usr/bin/env node
/**
 * Smoke test app CT Work RIÊNG (13/10/2026) — chạy THẬT bản dựng `dist-ctwork/`.
 *
 *   npm run ctwork:build && node scripts/smoke-ctwork.mjs
 *
 * Kiểm đúng những lời hứa của app này, không kiểm lại những gì `smoke.mjs` của
 * app CuongThai đã kiểm (cách ly renderer, IPC…) — hai biến thể chung main/preload.
 *   1. Màn đăng nhập mang tên + icon CT Work.
 *   2. Đăng nhập xong vào THẲNG `/work`, KHÔNG có thanh bên của app CuongThai.
 *   3. Điều hướng ra ngoài CT Work (`/dashboard`) KHÔNG dựng trong app mà mở trình
 *      duyệt — `shell.openExternal` bị chặn lại ở main để đếm, không mở thật.
 *   4. Cài đặt không còn nhóm Robot Odin / AI.
 * Ảnh chụp ghi vào thư mục do `CT_SMOKE_ANH` chỉ định (mặc định: thư mục tạm).
 *
 * Tài khoản thử đọc từ `desktop/.env.local` (CT_SMOKE_USER / CT_SMOKE_PASS) —
 * xem smoke.mjs. KHÔNG in mật khẩu.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { _electron as electron } from 'playwright';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

for (const line of (() => {
  try { return fs.readFileSync(path.join(root, '.env.local'), 'utf8').split('\n'); } catch { return []; }
})()) {
  const m = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
  if (!m || process.env[m[1]] !== undefined) continue;
  let gt = m[2].trim();
  if ((gt.startsWith('"') && gt.endsWith('"')) || (gt.startsWith("'") && gt.endsWith("'"))) gt = gt.slice(1, -1);
  else gt = gt.split(' #')[0].trim();
  process.env[m[1]] = gt;
}

const hoSo = fs.mkdtempSync(path.join(os.tmpdir(), 'ctwork-smoke-'));
const thuMucAnh = process.env.CT_SMOKE_ANH || hoSo;
fs.mkdirSync(thuMucAnh, { recursive: true });
process.on('exit', () => {
  try { fs.rmSync(hoSo, { recursive: true, force: true }); } catch { /* đã dọn */ }
});

let hong = 0;
const check = (ten, ok, chiTiet = '') => {
  console.log(`  ${ok ? '✓' : '✗'} ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`);
  if (!ok) hong += 1;
};

const app = await electron.launch({
  args: [`--user-data-dir=${hoSo}`, path.join(root, 'dist-ctwork/main/index.cjs')],
  env: { ...process.env, CT_RENDERER: 'bundle' },
});

const win = await app.firstWindow();
await win.waitForLoadState('domcontentloaded');
/* Chặn mở trình duyệt thật: thay `shell.openExternal` bằng bộ đếm. */
await app.evaluate(({ shell }) => {
  globalThis.__moNgoai = [];
  shell.openExternal = (url) => { globalThis.__moNgoai.push(url); return Promise.resolve(); };
  return true;
});

await win.setViewportSize({ width: 1440, height: 900 }).catch(() => {});
await app.evaluate(({ BrowserWindow }) => {
  const w = BrowserWindow.getAllWindows()[0];
  w?.setSize(1440, 900);
});

console.log('\nApp CT Work riêng:');
const ten = await app.evaluate(({ app: a }) => ({ ten: a.getName(), ver: a.getVersion() }));
check('tên app là "CT Work"', ten.ten === 'CT Work', ten.ten);

await win.waitForSelector('.ct-dangnhap, .ct-shell', { timeout: 20_000 });
const dangNhap = await win.evaluate(() => ({
  h1: document.querySelector('.ct-dangnhap h1')?.textContent ?? null,
  icon: document.querySelector('.ct-dangnhap-icon')?.getAttribute('src') ?? null,
  title: document.title,
}));
check('màn đăng nhập ghi "CT Work"', dangNhap.h1 === 'CT Work', String(dangNhap.h1));
check('icon CT Work', dangNhap.icon === '/icon-ctwork.png', String(dangNhap.icon));
check('tiêu đề cửa sổ', dangNhap.title === 'CT Work', dangNhap.title);
await win.screenshot({ path: path.join(thuMucAnh, '1-dang-nhap.png') });

const user = process.env.CT_SMOKE_USER;
const pass = process.env.CT_SMOKE_PASS;
if (!user || !pass) {
  console.log('  ⚠ Thiếu CT_SMOKE_USER/CT_SMOKE_PASS — bỏ qua phần cần đăng nhập.');
} else {
  await win.fill('input[autocomplete="username"]', user);
  await win.fill('input[autocomplete="current-password"]', pass);
  await win.click('button[type="submit"]');
  await win.waitForSelector('.ct-shell', { timeout: 30_000 });
  check('đăng nhập thật thành công', true);

  const vo = await win.evaluate(() => ({
    ctwork: !!document.querySelector('.ct-shell-ctwork'),
    sidebarApp: !!document.querySelector('.ct-sidebar'),
    host: !!document.querySelector('.ct-work-host'),
  }));
  check('vỏ CT Work (không thanh bên của app)', vo.ctwork && !vo.sidebarApp, JSON.stringify(vo));
  check('mở thẳng vào CT Work', vo.host);

  /* Chờ CT Work dựng xong khung (thanh bên riêng của nó). */
  await win.waitForSelector('.work-root', { timeout: 30_000 }).catch(() => {});
  await win.waitForTimeout(3500);
  await win.screenshot({ path: path.join(thuMucAnh, '2-ct-work.png') });
  const coVeTrangChinh = await win.evaluate(() =>
    [...document.querySelectorAll('.work-root a')].some((a) => a.getAttribute('href') === '/'));
  check('không có link "Về CuongThai"', !coVeTrangChinh);

  /* Bấm nút Cài đặt trên thanh tiêu đề. */
  await win.click('.ct-titlebar-chuong');
  await win.waitForSelector('.st-nhom', { timeout: 10_000 });
  const nhom = await win.evaluate(() => [...document.querySelectorAll('.st-nhom strong')].map((e) => e.textContent));
  check('Cài đặt không còn Robot Odin / AI', !nhom.some((t) => /Odin|^AI$/.test(String(t))), nhom.join(' · '));
  await win.screenshot({ path: path.join(thuMucAnh, '3-cai-dat.png') });
  await win.click('.ct-titlebar-chuong'); // về CT Work
  await win.waitForSelector('.ct-work-host', { timeout: 10_000 });

  /* Điều hướng ra NGOÀI CT Work — đi qua kênh `app:navigate` (deep link), cùng
     cửa chặn `moNgoaiNeuKhongThuocCtWork` với `navigate()` mà mọi link web dùng. */
  const truoc = await app.evaluate(() => globalThis.__moNgoai.length);
  await app.evaluate(({ BrowserWindow }) => {
    BrowserWindow.getAllWindows()[0]?.webContents.send('app:navigate', { path: '/dashboard', query: '' });
  });
  await win.waitForTimeout(800);
  const sau = await app.evaluate(() => globalThis.__moNgoai.slice());
  const vanO = await win.evaluate(() => !!document.querySelector('.ct-work-host'));
  check('đường ngoài CT Work mở trình duyệt, không dựng trong app',
    sau.length === truoc + 1 && /\/dashboard$/.test(sau[sau.length - 1] ?? '') && vanO,
    sau[sau.length - 1] ?? '(không mở gì)');
}

await app.close();
console.log(`\n${hong === 0 ? '✅ Xanh' : `❌ ${hong} chỗ hỏng`} — ảnh: ${thuMucAnh}`);
process.exit(hong === 0 ? 0 : 1);
