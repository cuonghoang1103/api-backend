/**
 * Smoke test cho ĐƯỜNG DEV (`npm run dev`).
 *
 * Vì sao cần một bài riêng: `smoke.mjs` chạy ở chế độ bundle, và bundle với dev
 * đi hai đường khác nhau về mọi mặt — nguồn renderer, cách nạp script, CSP áp
 * dụng lên loại script nào.
 *
 * Ngày 16/08/2026 sự khác biệt đó đã gây một lỗi thật: CSP thiếu 'unsafe-inline'
 * chặn đoạn preamble inline của @vitejs/plugin-react → React không khởi động →
 * app hiện MÀN ĐEN HOÀN TOÀN. Terminal sạch, `npm run build` xanh, và
 * `smoke.mjs` báo 21/21 đạt — vì không phép kiểm nào từng chạy qua đường dev.
 *
 * Bài học đóng vào đây: kiểm cả hai đường, hoặc đường không kiểm sẽ hỏng.
 *
 * Chạy: node scripts/smoke-dev.mjs
 */
import { createServer } from 'vite';
import { _electron as electron } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

const results = [];
function check(label, pass, detail = '') {
  results.push({ label, pass });
  const mark = pass ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
  console.log(`  ${mark} ${label}${detail ? ` — ${detail}` : ''}`);
}

console.log('\nKhởi động chế độ DEV (Vite + Electron)…\n');

const server = await createServer({ configFile: path.join(root, 'vite.config.ts') });
await server.listen();

const app = await electron.launch({
  args: [path.join(root, 'dist/main/index.cjs')],
  env: { ...process.env, CT_RENDERER: 'dev' },
});

await app.firstWindow();
await new Promise((resolve) => setTimeout(resolve, 3000));

// Chọn ĐÚNG cửa sổ app. Ở dev, main mở DevTools dạng tách rời, nên
// `firstWindow()` có thể trả về cửa sổ DevTools — đo nhầm nó thì `#root` không
// tồn tại và mọi kết luận đều sai.
const appWindow = app.windows().find((w) => w.url().startsWith('http://localhost:5273'));

console.log('Cửa sổ:');
check('tìm thấy cửa sổ app (không phải DevTools)', appWindow !== undefined);

if (!appWindow) {
  await app.close();
  await server.close();
  process.exit(1);
}

const errors = [];
appWindow.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
appWindow.on('pageerror', (error) => errors.push(`PAGEERROR: ${error.message}`));

await appWindow.reload();
await appWindow.waitForTimeout(3500);

const state = await appWindow.evaluate(() => ({
  rootLength: document.getElementById('root')?.innerHTML.length ?? -1,
  bodyMargin: getComputedStyle(document.body).margin,
  text: document.body.innerText.trim().slice(0, 80),
}));

console.log('\nRenderer:');
// Đây là phép kiểm chống-màn-đen. `#root` rỗng = React không mount.
check('React đã dựng giao diện (#root không rỗng)', state.rootLength > 0, `${state.rootLength} ký tự`);
check('CSS của app đã áp (body margin = 0px)', state.bodyMargin === '0px', state.bodyMargin);
check('có nội dung nhìn thấy được', state.text.length > 0, JSON.stringify(state.text));

// Proxy API của dev. Hai lỗi đã từng xảy ra ở đúng chỗ này:
//  1. quy tắc `/api` nuốt luôn module nguồn `/api/client.ts` → màn trắng;
//  2. proxy chuyển tiếp header `Origin` → backend trả 500 thay vì 401, nên gõ
//     sai mật khẩu lại hiện "Internal Server Error".
console.log('\nProxy API (dev):');
const probe = await appWindow.evaluate(async () => {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '__smoke_test__', password: '__sai__' }),
    });
    const body = await response.json().catch(() => null);
    return { reached: true, status: response.status, message: body?.message ?? '' };
  } catch (error) {
    return { reached: false, status: 0, message: String(error) };
  }
});
check('gọi được API qua proxy', probe.reached, `HTTP ${probe.status}`);
check(
  'nhận lỗi xác thực THẬT (401), không phải 500 do Origin bị chuyển tiếp',
  probe.status === 401 || probe.status === 400,
  `HTTP ${probe.status} — ${probe.message}`,
);

console.log('\nMàn đăng nhập:');
const passwordType = await appWindow.getAttribute(
  'input[autocomplete="current-password"]',
  'type',
);
await appWindow.click('.ct-input-affix');
const revealedType = await appWindow.getAttribute(
  'input[autocomplete="current-password"]',
  'type',
);
check(
  'nút con mắt hiện/ẩn được mật khẩu',
  passwordType === 'password' && revealedType === 'text',
  `${passwordType} → ${revealedType}`,
);

console.log('\nLỗi console:');
const cspErrors = errors.filter((e) => e.includes('Content Security Policy'));
const preambleErrors = errors.filter((e) => e.includes('preamble'));
check('không có lỗi CSP', cspErrors.length === 0, cspErrors[0] ?? '');
check('plugin React tìm thấy preamble', preambleErrors.length === 0, preambleErrors[0] ?? '');

await app.close();
await server.close();

const failed = results.filter((r) => !r.pass);
console.log(
  `\n${failed.length === 0 ? '\x1b[32m' : '\x1b[31m'}` +
    `${results.length - failed.length}/${results.length} phép kiểm đạt\x1b[0m\n`,
);
process.exit(failed.length === 0 ? 0 : 1);
