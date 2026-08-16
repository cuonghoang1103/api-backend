/**
 * Smoke test end-to-end: khởi động app ĐÃ BUILD và kiểm chứng nền tảng.
 *
 * Vì sao phải chạy thật thay vì đọc mã: `sandbox`, `contextIsolation`,
 * `nodeIntegration` và CSP đều là cấu hình lúc chạy. Đặt sai thì TypeScript
 * vẫn sạch, build vẫn xanh, và mã đọc vẫn đúng — chỉ có app đang chạy mới nói
 * được sự thật. Đây cũng là lý do file này nạp `dist/` chứ không nạp `src/`:
 * nó kiểm cái sẽ được đóng gói, không kiểm cái ta định đóng gói.
 *
 * Chạy: npm run smoke
 * Đầy đủ (gồm cả phần cần đăng nhập):
 *   CT_SMOKE_USER=<tên> CT_SMOKE_PASS=<mật khẩu> npm run smoke
 */
import { _electron as electron } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

const results = [];
let skipped = 0;

function check(label, pass, detail = '') {
  results.push({ label, pass, detail });
  const mark = pass ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
  console.log(`  ${mark} ${label}${detail ? ` — ${detail}` : ''}`);
}

console.log('\nKhởi động CuongThai Desktop (bản đã build)…\n');

const app = await electron.launch({
  args: [path.join(root, 'dist/main/index.cjs')],
  // `CT_RENDERER=bundle` là mấu chốt. Không có nó, `app.isPackaged` là false
  // (ta đang chạy Electron từ node_modules, không phải bản đã đóng gói) nên
  // main sẽ trỏ vào Vite dev server — và bài kiểm sẽ đo đường DEV trong khi
  // báo cáo là đã kiểm bản phát hành.
  env: { ...process.env, CT_RENDERER: 'bundle' },
});

const window = await app.firstWindow();
await window.waitForLoadState('domcontentloaded');

// ── 1. Cách ly renderer ──────────────────────────────────────
const isolation = await window.evaluate(() => ({
  hasRequire: typeof globalThis.require !== 'undefined',
  hasProcess: typeof globalThis.process !== 'undefined',
  hasModule: typeof globalThis.module !== 'undefined',
  hasBuffer: typeof globalThis.Buffer !== 'undefined',
  bridgeKeys: globalThis.cuongthai ? Object.keys(globalThis.cuongthai).sort() : null,
}));

console.log('Cách ly renderer:');
check('require() không lộ ra renderer', !isolation.hasRequire);
check('process không lộ ra renderer', !isolation.hasProcess);
check('module không lộ ra renderer', !isolation.hasModule);
check('Buffer không lộ ra renderer', !isolation.hasBuffer);

// ── 2. Bề mặt cầu nối đúng hợp đồng ──────────────────────────
const expected = ['app', 'auth', 'on', 'settings', 'storage', 'update'];
console.log('\nCầu nối preload:');
check('window.cuongthai tồn tại', isolation.bridgeKeys !== null);
check(
  'chỉ phơi ra đúng các nhóm đã khai báo',
  JSON.stringify(isolation.bridgeKeys) === JSON.stringify(expected),
  `nhận: ${JSON.stringify(isolation.bridgeKeys)}`,
);

// ── 3. IPC chạy được và trả dữ liệu thật ─────────────────────
console.log('\nIPC:');
const info = await window.evaluate(() => globalThis.cuongthai.app.getInfo());
check('app:getInfo trả về phiên bản', typeof info.version === 'string', info.version);
check('main quyết gốc API', info.apiOrigin === 'https://api.cuongthai.com', info.apiOrigin);

// ── 4. Xác thực payload thật sự CHẶN ─────────────────────────
// Phép kiểm quan trọng nhất của Phase 1: lớp zod ở main phải từ chối dữ liệu
// sai. Nếu nó cho qua thì mọi thứ còn lại chỉ là trang trí.
const rejected = await window.evaluate(async () => {
  const out = {};
  const probe = async (name, fn) => {
    try {
      await fn();
      out[name] = 'CHO QUA';
    } catch {
      out[name] = 'đã chặn';
    }
  };
  await probe('javascriptUrl', () =>
    globalThis.cuongthai.app.openExternal('javascript:alert(1)'),
  );
  await probe('fileUrl', () => globalThis.cuongthai.app.openExternal('file:///etc/passwd'));
  await probe('badKey', () => globalThis.cuongthai.settings.set('khoa-bia-dat', 'x'));
  await probe('badZoom', () => globalThis.cuongthai.app.setZoom(999));
  return out;
});

console.log('\nXác thực payload ở main:');
check('chặn javascript: URL', rejected.javascriptUrl === 'đã chặn', rejected.javascriptUrl);
check('chặn file:// URL', rejected.fileUrl === 'đã chặn', rejected.fileUrl);
check('chặn khoá cấu hình lạ', rejected.badKey === 'đã chặn', rejected.badKey);
check('chặn zoom ngoài khoảng', rejected.badZoom === 'đã chặn', rejected.badZoom);

// ── 5. Kênh sự kiện ngoài danh sách trắng bị từ chối ──────────
const eventGuard = await window.evaluate(() => {
  try {
    globalThis.cuongthai.on('kenh:bia-dat', () => {});
    return 'CHO QUA';
  } catch {
    return 'đã chặn';
  }
});
check('chặn đăng ký kênh sự kiện lạ', eventGuard === 'đã chặn', eventGuard);

// ── 6. Cấu hình đọc/ghi được ─────────────────────────────────
console.log('\nCấu hình:');
const settingsRoundTrip = await window.evaluate(async () => {
  await globalThis.cuongthai.settings.set('theme', 'dark');
  const all = await globalThis.cuongthai.settings.getAll();
  return all.theme;
});
check('ghi rồi đọc lại được', settingsRoundTrip === 'dark', String(settingsRoundTrip));

// ── 7. Cổng đăng nhập ────────────────────────────────────────
// App khởi động vào màn đăng nhập, không vào shell. Đó là hành vi ĐÚNG — và nó
// có nghĩa là các phép kiểm shell bên dưới cần một tài khoản thật.
console.log('\nCổng đăng nhập:');
await window.waitForSelector('.ct-card, .ct-shell', { timeout: 15_000 });
const gate = await window.evaluate(() => ({
  hasLogin: !!document.querySelector('input[autocomplete="username"]'),
  firstLine: document.body.innerText.split('\n')[0],
}));
check('chưa đăng nhập thì hiện màn đăng nhập', gate.hasLogin, gate.firstLine);

// ── 8. Gọi API THẬT từ origin app://cuongthai ────────────────
// Không cần tài khoản đúng. Mục đích là chứng minh cả chuỗi thông suốt:
// app:// → CORS → backend → ánh xạ lỗi. Nhận "sai mật khẩu" TỪ MÁY CHỦ là bằng
// chứng kết nối chạy; nhận lỗi mạng/CORS mới là hỏng.
console.log('\nGọi API thật từ origin app://cuongthai:');
const probe = await window.evaluate(async () => {
  try {
    const response = await fetch('https://api.cuongthai.com/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ username: '__smoke_test__', password: '__sai__' }),
    });
    const body = await response.json().catch(() => null);
    return { reached: true, status: response.status, message: body?.message ?? null };
  } catch (error) {
    return { reached: false, status: 0, message: String(error) };
  }
});
check(
  'CORS cho phép app:// gọi api.cuongthai.com',
  probe.reached,
  probe.reached ? `HTTP ${probe.status}` : probe.message,
);
check(
  'máy chủ trả lỗi xác thực (không phải lỗi mạng)',
  probe.status === 400 || probe.status === 401,
  `HTTP ${probe.status} — ${probe.message ?? ''}`,
);

// ── 8b. Sai mật khẩu phải nói "sai mật khẩu" ─────────────────
// Từng hỏng: `request()` thấy 401 là thử làm mới token rồi báo "Phiên đăng nhập
// đã hết hạn" — nói với người ĐANG ĐỨNG Ở MÀN ĐĂNG NHẬP rằng phiên của họ hết
// hạn, và che mất lý do thật (sai mật khẩu / tài khoản bị khoá / chưa xác thực
// email). Giữ phép kiểm này để nó không quay lại.
await window.fill('input[autocomplete="username"]', '__smoke_test__');
await window.fill('input[autocomplete="current-password"]', '__sai__');
await window.click('button[type="submit"]');
await window.waitForSelector('.ct-notice[data-tone="err"]', { timeout: 20_000 });
const loginError = (await window.textContent('.ct-notice[data-tone="err"]')) ?? '';
check(
  'sai mật khẩu hiện lý do THẬT của máy chủ',
  !loginError.includes('hết hạn') && loginError.length > 0,
  loginError,
);

// ── 9. Shell — cần tài khoản thật ────────────────────────────
// BỎ QUA CÓ THÔNG BÁO, không bỏ qua âm thầm. Một bài kiểm tự tắt trong im lặng
// là bài kiểm nói dối: bảng kết quả vẫn xanh trong khi không kiểm gì cả.
const smokeUser = process.env.CT_SMOKE_USER;
const smokePass = process.env.CT_SMOKE_PASS;

if (!smokeUser || !smokePass) {
  console.log('\n\x1b[33m⚠ BỎ QUA 3 phép kiểm shell — cần tài khoản thật\x1b[0m');
  console.log('  Chạy đầy đủ bằng:');
  console.log('  CT_SMOKE_USER=<tên> CT_SMOKE_PASS=<mật khẩu> npm run smoke');
  skipped += 3;
} else {
  await window.fill('input[autocomplete="username"]', smokeUser);
  await window.fill('input[autocomplete="current-password"]', smokePass);
  await window.click('button[type="submit"]');
  await window.waitForSelector('.ct-shell', { timeout: 25_000 });

  console.log('\nShell (đã đăng nhập bằng tài khoản thật):');
  check('đăng nhập thật thành công', true);

  await window.getByRole('button', { name: 'Tin nhắn' }).first().click();
  await window.waitForTimeout(250);
  const afterNav = await window.evaluate(
    () => document.querySelector('.ct-titlebar-title')?.textContent,
  );
  check('bấm sidebar thì đổi trang', afterNav === 'Tin nhắn', String(afterNav));

  await window.keyboard.press('Control+k');
  await window.waitForTimeout(200);
  await window.keyboard.type('tin nhan');
  await window.waitForTimeout(200);
  const paletteHits = await window.evaluate(() =>
    Array.from(document.querySelectorAll('.ct-palette-item span:first-of-type')).map(
      (el) => el.textContent,
    ),
  );
  check(
    'bảng lệnh tìm được khi gõ KHÔNG DẤU',
    paletteHits.length === 1 && paletteHits[0] === 'Tin nhắn',
    JSON.stringify(paletteHits),
  );
  await window.keyboard.press('Escape');
}

// ── 10. Khôi phục kích thước cửa sổ qua hai lần chạy ─────────
// Chỉ chứng minh được bằng cách TẮT rồi MỞ LẠI. Đọc mã chỉ cho thấy ý định.
const marker = { width: 1024, height: 700 };
await app.evaluate(({ BrowserWindow }, size) => {
  const win = BrowserWindow.getAllWindows()[0];
  win.unmaximize();
  win.setBounds({ x: 120, y: 90, ...size });
}, marker);
await window.waitForTimeout(400); // để handler 'resize' kịp ghi xuống đĩa
await app.close();

const app2 = await electron.launch({
  args: [path.join(root, 'dist/main/index.cjs')],
  env: { ...process.env, CT_RENDERER: 'bundle' },
});
const window2 = await app2.firstWindow();
await window2.waitForLoadState('domcontentloaded');
const restored = await app2.evaluate(({ BrowserWindow }) =>
  BrowserWindow.getAllWindows()[0].getNormalBounds(),
);

console.log('\nKhôi phục cửa sổ (sau khi khởi động lại):');
check(
  'kích thước được giữ lại',
  restored.width === marker.width && restored.height === marker.height,
  `${restored.width}×${restored.height}`,
);
check('vị trí được giữ lại', restored.x === 120 && restored.y === 90, `${restored.x},${restored.y}`);

const themeKept = await window2.evaluate(
  () => document.documentElement.getAttribute('data-theme'),
);
check('chủ đề được giữ lại', themeKept === 'dark', String(themeKept));

await app2.close();

const failed = results.filter((r) => !r.pass);
const colour = failed.length === 0 ? '\x1b[32m' : '\x1b[31m';
console.log(
  `\n${colour}${results.length - failed.length}/${results.length} phép kiểm đạt\x1b[0m` +
    (skipped > 0 ? `\x1b[33m  (${skipped} bỏ qua — thiếu tài khoản)\x1b[0m` : '') +
    '\n',
);
process.exit(failed.length === 0 ? 0 : 1);
