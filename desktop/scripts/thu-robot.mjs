/**
 * Kiểm cửa sổ robot NỔI bằng cách chạy thật.
 *
 * Không có cách nào đọc mã mà biết một cửa sổ có thật sự trong suốt, luôn trên
 * cùng, và không hiện trong thanh tác vụ hay không — đó đều là thuộc tính của
 * hệ điều hành. Phải hỏi Electron lúc đang chạy.
 */
import { _electron as electron } from 'playwright';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const ud = fs.mkdtempSync(path.join(os.tmpdir(), 'rb-'));
const kq = [];
const check = (t, ok, chi = '') => { kq.push(ok); console.log(`  ${ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${t}${chi ? ` — ${chi}` : ''}`); };

const app = await electron.launch({
  args: [`--user-data-dir=${ud}`, path.join(root, 'dist/main/index.cjs')],
  env: { ...process.env, CT_RENDERER: 'bundle' },
});
await app.firstWindow();
await new Promise((r) => setTimeout(r, 2500));

const tt = await app.evaluate(async ({ BrowserWindow }) => {
  const ds = BrowserWindow.getAllWindows();
  const rb = ds.find((w) => w.webContents.getURL().includes('robot.html'));
  if (!rb) return { co: false, so: ds.length, url: ds.map((w) => w.webContents.getURL().slice(-24)) };
  const b = rb.getBounds();
  return {
    co: true, so: ds.length,
    tren: rb.isAlwaysOnTop(),
    boQuaThanhTacVu: !rb.isVisibleOnAllWorkspaces || true,
    hienMoiNoiLamViec: rb.isVisibleOnAllWorkspaces(),
    khung: !rb.isResizable(),
    w: b.width, h: b.height,
  };
});

console.log('\nRobot nổi:');
check('cửa sổ robot được tạo cùng app', tt.co, `${tt.so} cửa sổ` + (tt.co ? '' : ` · ${JSON.stringify(tt.url)}`));
if (tt.co) {
  check('LUÔN NỔI trên mọi cửa sổ khác', tt.tren === true);
  check('theo người dùng qua mọi không gian làm việc', tt.hienMoiNoiLamViec === true);
  check('ôm sát con robot (không phải khối trong suốt to)', tt.w <= 200 && tt.h <= 240, `${tt.w}×${tt.h}`);

  // Bấm MỘT lần ⇒ phình thành khung chat. Góc dưới-phải phải GIỮ NGUYÊN, nếu
  // không con robot nhảy vào giữa màn hình mỗi lần mở.
  // `app.windows()` trả về MẢNG (đồng bộ) — `await` nó rồi `.find` trên kết
  // quả của await là undefined. Và cửa sổ robot có thể chưa kịp đăng ký, nên
  // chờ nó thay vì giả định.
  // ⚠️ `w.url()` của Playwright trả RỖNG cho cửa sổ dùng scheme tuỳ chỉnh
  // (`app://`) — trong khi `webContents.getURL()` ở main thì đúng. Nên nhận
  // diện bằng NỘI DUNG: chỉ trang robot mới có `.rb-than`.
  const timTrang = async () => {
    for (const w of app.windows()) {
      if (await w.locator('.rb-than').count().catch(() => 0)) return w;
    }
    return null;
  };
  let trang = await timTrang();
  for (let i = 0; !trang && i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    trang = await timTrang();
  }
  if (!trang) {
    for (const [i, w] of app.windows().entries()) {
      const than = await w.evaluate(() => document.body.innerHTML.slice(0, 160)).catch((e) => 'LỖI ' + e.message);
      console.log(`   cửa sổ ${i}: ${JSON.stringify(than)}`);
    }
    const loi = await app.evaluate(({ BrowserWindow }) => {
      const rb = BrowserWindow.getAllWindows().find((w) => w.webContents.getURL().includes('robot.html'));
      return rb ? { url: rb.webContents.getURL(), tai: rb.webContents.isLoading() } : null;
    });
    console.log('   main thấy:', JSON.stringify(loi));
  }
  check('playwright thấy được trang robot', !!trang, `${app.windows().length} cửa sổ`);
  if (!trang) throw new Error('không thấy trang robot');
  const truoc = await app.evaluate(({ BrowserWindow }) => {
    const rb = BrowserWindow.getAllWindows().find((w) => w.webContents.getURL().includes('robot.html'));
    const b = rb.getBounds();
    return { phai: b.x + b.width, duoi: b.y + b.height, w: b.width };
  });

  await trang.locator('.rb-than').click();
  await new Promise((r) => setTimeout(r, 700));

  const sau = await app.evaluate(({ BrowserWindow }) => {
    const rb = BrowserWindow.getAllWindows().find((w) => w.webContents.getURL().includes('robot.html'));
    const b = rb.getBounds();
    return { phai: b.x + b.width, duoi: b.y + b.height, w: b.width };
  });
  check('bấm 1 lần ⇒ phình thành khung chat', sau.w > truoc.w, `${truoc.w} → ${sau.w}px`);
  check('GIỮ NGUYÊN góc dưới-phải khi phình',
    sau.phai === truoc.phai && sau.duoi === truoc.duoi,
    `phải ${truoc.phai}→${sau.phai} · dưới ${truoc.duoi}→${sau.duoi}`);
  check('khung chat mini hiện ra', await trang.locator('.rb-chat').count() === 1);

  // Nền PHẢI trong suốt tới tận cùng — một màu nào đó ở body là một khối chữ
  // nhật lơ lửng trên màn hình người dùng.
  const nen = await trang.evaluate(() => [
    getComputedStyle(document.documentElement).backgroundColor,
    getComputedStyle(document.body).backgroundColor,
  ]);
  check('nền trong suốt hoàn toàn',
    nen.every((c) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent'), nen.join(' / '));

  // Con robot phải CÓ MÀU. Bảng màu `--odin-*` từng bị nhốt trong `.odin-dock`
  // — class chỉ có ở app chính — nên ở cửa sổ nổi mọi `fill` rơi về đen và
  // robot thành một vệt đen không mắt, trong khi 9/9 phép kiểm vẫn xanh.
  const mau = await trang.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return ['--odin-body', '--odin-eye', '--odin-screen'].map((k) => s.getPropertyValue(k).trim());
  });
  check('robot có bảng màu (không phải vệt đen)', mau.every(Boolean), mau.join(' '));

  await trang.screenshot({ path: path.join(root, 'robot-thu.png') });
  console.log('   (ảnh chụp: desktop/robot-thu.png)');
}

await app.close();
fs.rmSync(ud, { recursive: true, force: true });
const hong = kq.filter((x) => !x).length;
console.log(hong === 0 ? `\n\x1b[32m${kq.length}/${kq.length} đạt\x1b[0m\n` : `\n\x1b[31m${hong} HỎNG\x1b[0m\n`);
process.exit(hong === 0 ? 0 : 1);
