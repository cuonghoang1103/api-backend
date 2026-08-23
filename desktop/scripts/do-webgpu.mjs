/**
 * ĐO WEBGPU TRONG CHÍNH ELECTRON MÀ APP ĐANG DÙNG.
 *
 * Câu hỏi nó trả lời: nếu đóng gói sân chơi 3D (`playground-3d/`, chạy bằng
 * `three/webgpu` + TSL) vào app desktop thì nó chạy đường WebGPU hay bị lùi về
 * WebGL2? Khác nhau là hiệu năng, và là cả `PreRenderer` (xem
 * `playground-3d/sources/Game/Game.js:258` — chỉ chạy khi backend là WebGPU).
 *
 * Chạy:
 *   cd desktop && npm run do:webgpu
 *
 * Đọc kết quả:
 *   navigator.gpu = object + adapter = YES  → chạy WebGPU, ngon.
 *   navigator.gpu = undefined               → app sẽ chạy WebGL2. Game KHÔNG
 *                                             chết (`forceWebGL: false` để
 *                                             three tự lùi), chỉ chậm hơn.
 *   adapter = null                          → có API nhưng không có card dùng
 *                                             được: thường là driver/Vulkan.
 *
 * ⚠️⚠️ KIỂM BỘ KIỂM TRƯỚC — bẫy này đã sụp thật ngày 23/08/2026.
 *
 * Trên máy KHÔNG có GPU (container, máy ảo, SSH không có phiên đồ hoạ), mọi
 * thứ đều báo `undefined` và trông y hệt như "Electron không hỗ trợ WebGPU".
 * Đo thật hôm đó: Electron 33 (Chromium 130) `undefined`, Electron 43
 * (Chromium 150) `undefined` — và **Chromium 141 cài sẵn trong CÙNG cái máy đó
 * cũng `undefined`**, trong khi Chrome 141 chắc chắn có WebGPU trên Linux.
 * Tức là con số đo được nói về CÁI MÁY, không nói gì về Electron.
 *
 * Nên: nếu bộ này báo `undefined`, mở `chrome://gpu` trong Chrome trên CHÍNH
 * máy đó trước. Chrome cũng không có WebGPU ⇒ lỗi máy, đừng kết luận về app.
 *
 * ⚠️ Bẫy thứ hai (mất 2 lượt chạy): trong renderer KHÔNG có `process`
 * (`contextIsolation` + `sandbox`). Đọc `process.versions.chrome` ở đó thì
 * `executeJavaScript` ném lỗi, promise treo, và bộ kiểm hết giờ mà không nói
 * được vì sao. Phiên bản phải lấy ở MAIN rồi mới ghép vào kết quả.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

/** Ba cấu hình cờ. Cờ đặt ở MAIN, trước `app.whenReady()` — muộn hơn là vô tác dụng. */
const MODES = [
  ['mac-dinh', 'không cờ nào — đúng thứ người dùng nhận hôm nay'],
  ['unsafe', '--enable-unsafe-webgpu'],
  ['unsafe-vulkan', '--enable-unsafe-webgpu + --enable-features=Vulkan (đường của Linux)'],
];

const MAIN = String.raw`
const { app, BrowserWindow } = require('electron')
const MODE = process.env.CT_WGPU_MODE || 'mac-dinh'
if (MODE.startsWith('unsafe')) app.commandLine.appendSwitch('enable-unsafe-webgpu')
if (MODE === 'unsafe-vulkan') app.commandLine.appendSwitch('enable-features', 'Vulkan')

// Phiên bản phải đọc Ở ĐÂY. Renderer không có 'process' — xem đầu file .mjs.
const CHROME = process.versions.chrome
const ELECTRON = process.versions.electron

const noi = (o) => console.log('CT_WGPU ' + JSON.stringify({ mode: MODE, chrome: CHROME, electron: ELECTRON, ...o }))

// Lưới đỡ: không có cái này thì một máy hỏng đồ hoạ làm bộ kiểm treo vô hạn.
setTimeout(() => { noi({ ketQua: 'HET_GIO' }); app.exit(2) }, 75000)

app.whenReady().then(async () => {
  // Electron tự biết trạng thái từng tính năng GPU — rẻ hơn và thật hơn suy đoán.
  let gpuFeature = null
  try { gpuFeature = app.getGPUFeatureStatus() } catch (e) { gpuFeature = { loi: String(e) } }

  const w = new BrowserWindow({ show: false })
  await w.loadURL('data:text/html,<html><body>do-webgpu</body></html>')

  const r = await w.webContents.executeJavaScript(` + '`' + String.raw`(async () => {
    const hanGio = (p, ms, nhan) => Promise.race([p, new Promise(res => setTimeout(() => res(nhan + ':HET_GIO'), ms))])
    const o = { navigatorGpu: typeof navigator.gpu }
    if (navigator.gpu) {
      const a = await hanGio(navigator.gpu.requestAdapter().catch(e => 'LOI:' + e), 20000, 'adapter')
      o.adapter = (typeof a === 'string') ? a : (a ? 'YES' : 'null')
      if (a && typeof a !== 'string' && a.info)
        o.card = { vendor: a.info.vendor, arch: a.info.architecture, device: a.info.device }
    }
    o.webgl2 = !!document.createElement('canvas').getContext('webgl2')
    return o
  })()` + '`' + String.raw`)

  noi({ ...r, gpuWebgpu: gpuFeature && gpuFeature.webgpu ? gpuFeature.webgpu : '(không khai)' })
  app.exit(0)
}).catch(e => { noi({ loi: String(e) }); app.exit(3) })
`;

const thuMuc = mkdtempSync(path.join(tmpdir(), 'ct-wgpu-'));
const duongMain = path.join(thuMuc, 'main.cjs');
writeFileSync(duongMain, MAIN);
writeFileSync(
  path.join(thuMuc, 'package.json'),
  JSON.stringify({ name: 'ct-do-webgpu', version: '0.0.0', main: 'main.cjs' })
);

const electronBin = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'electron.cmd' : 'electron'
);

function chay(mode) {
  return new Promise((resolve) => {
    // `--no-sandbox` chỉ để chạy được trong CI/container; nó KHÔNG đụng tới
    // WebGPU (đã đối chứng: bật hay tắt đều ra cùng kết quả).
    const p = spawn(electronBin, ['--no-sandbox', '--disable-dev-shm-usage', thuMuc], {
      env: { ...process.env, CT_WGPU_MODE: mode },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let ra = '';
    p.stdout.on('data', (c) => (ra += c));
    p.stderr.on('data', () => {}); // Chromium xả rất nhiều ERROR vô hại (dbus…)
    const giet = setTimeout(() => p.kill('SIGKILL'), 95000);
    p.on('close', () => {
      clearTimeout(giet);
      const dong = ra.split('\n').find((l) => l.startsWith('CT_WGPU '));
      resolve(dong ? JSON.parse(dong.slice('CT_WGPU '.length)) : { mode, ketQua: 'KHONG_CO_DAU_RA' });
    });
    p.on('error', (e) => {
      clearTimeout(giet);
      resolve({ mode, loi: String(e) });
    });
  });
}

const XANH = '\x1b[32m', DO = '\x1b[31m', VANG = '\x1b[33m', TAT = '\x1b[0m';

console.log('\nĐo WebGPU trong Electron của app — mỗi cấu hình một lượt chạy thật.\n');

const ketQua = [];
for (const [mode, moTa] of MODES) {
  process.stdout.write(`  ${mode.padEnd(14)} ${moTa}\n`);
  ketQua.push(await chay(mode));
}
rmSync(thuMuc, { recursive: true, force: true });

console.log('\n─────────────────────────────────────────────────────────────');
for (const r of ketQua) {
  const co = r.navigatorGpu === 'object';
  const dat = co && r.adapter === 'YES';
  const dau = dat ? `${XANH}✓${TAT}` : co ? `${VANG}~${TAT}` : `${DO}✗${TAT}`;
  console.log(
    `${dau} ${String(r.mode).padEnd(14)} navigator.gpu=${String(r.navigatorGpu)}` +
      `  adapter=${r.adapter ?? '—'}  webgl2=${r.webgl2 ?? '—'}` +
      (r.card ? `  [${r.card.vendor} ${r.card.device}]` : '') +
      (r.gpuWebgpu ? `  gpuFeatureStatus.webgpu=${r.gpuWebgpu}` : '') +
      (r.loi ? `  LỖI=${r.loi}` : '') +
      (r.ketQua ? `  ${r.ketQua}` : '')
  );
}
console.log('─────────────────────────────────────────────────────────────');

const daiDien = ketQua[0] ?? {};
console.log(`Electron ${daiDien.electron ?? '?'} · Chromium ${daiDien.chrome ?? '?'}\n`);

if (ketQua.some((r) => r.adapter === 'YES')) {
  console.log(`${XANH}KẾT LUẬN${TAT}: đóng gói được và chạy đường WebGPU.`);
  if (ketQua[0]?.adapter !== 'YES')
    console.log('         ⚠️ Cần CỜ — thêm vào main trước app.whenReady().');
} else if (ketQua.some((r) => r.navigatorGpu === 'object')) {
  console.log(`${VANG}KẾT LUẬN${TAT}: có API nhưng KHÔNG lấy được card. Kiểm driver/Vulkan trước khi đổ cho Electron.`);
} else {
  console.log(`${DO}KẾT LUẬN${TAT}: không thấy WebGPU. TRƯỚC KHI TIN, mở chrome://gpu trên CHÍNH máy này —`);
  console.log('         Chrome cũng không có thì lỗi ở máy, không phải ở Electron (xem đầu file).');
  console.log('         Kể cả thật thì game vẫn chạy: three tự lùi về WebGL2, chỉ mất hiệu năng.');
}
console.log();
