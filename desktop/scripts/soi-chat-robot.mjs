/**
 * ============================================================
 * SOI KHUNG CHAT CỦA ROBOT NỔI — chạy: node scripts/soi-chat-robot.mjs
 * ============================================================
 *
 * Cách dùng:
 *   npx vite build                                  # phải build trước
 *   node scripts/soi-chat-robot.mjs chat   ra.png
 *   node scripts/soi-chat-robot.mjs lichsu ra.png
 *   node scripts/soi-chat-robot.mjs hoi    ra.png
 *
 * ─── Vì sao cần ───
 * Cửa sổ robot là một entry RIÊNG (`robot.html`), không nằm trong bộ đo bố cục
 * vốn chỉ đi qua vỏ app. Hai lỗi "chữ bị xén" ở đây đã lọt liên tiếp và cả hai
 * lần đều do NGƯỜI DÙNG gửi ảnh mới biết — build xanh, `tsc` xanh, chỉ có chữ
 * mất. Xem `do-bong-robot.mjs` cho phần đo bong bóng; tệp này lo khung chat.
 *
 * Dựng cửa sổ robot THẬT (bản đã build) và chụp khung chat mini.
 *
 * Giả `window.cuongthai` vì cửa sổ này chỉ nói chuyện với main qua IPC — không
 * giả thì mọi nút đều chết và ảnh chụp không nói lên điều gì.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

const GOC = path.join(path.dirname(fileURLToPath(new URL('../package.json', import.meta.url))), 'dist/renderer');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

const may = http.createServer((req, res) => {
  const u = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const f = path.join(GOC, u === '/' ? 'robot.html' : u);
  if (!f.startsWith(GOC) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => may.listen(0, r));
const cong = may.address().port;

const trinh = await chromium.launch();
const ctx = await trinh.newContext({ viewport: { width: 400, height: 560 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

globalThis.__ANH_THU_NODE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAOklEQVR42u3OMQEAAAgDoC251a3gLzmwgbfKAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4NUCkHAAAegKMuQAAAAASUVORK5CYII=';
const ANH_1PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

await p.addInitScript(({ anh }) => {
  const cho = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
  /* Cầu nối có hàng chục phương thức và renderer gọi rải rác. Bọc bằng Proxy
     để MỌI tên đều tồn tại và trả `undefined` một cách êm — đoán từng hàm một
     là mỗi lần chạy lại phát hiện thêm một hàm thiếu. */
  const rong = new Proxy({}, {
    get: (o, k) => (k in o ? o[k] : async () => undefined),
  });
  const thatRobot = {
    hoi: async (chu, them) => cho(50, {
      /* Trả về MARKDOWN THẬT — đó là thứ model gửi về, và là chỗ khung này
         từng hiện nguyên dấu sao cho người dùng xem. */
      chu: [
        'Có chứ! Đây là **cuongthai.com** — website của **Hoàng Nghĩa Cường**.',
        '',
        '- Website bán hàng, landing page',
        '- Thanh toán `MoMo` / `ZaloPay` / `VNPay`',
        '- Bảo hành *3–6 tháng* miễn phí',
        '',
        '| Gói | Giá |',
        '| --- | --- |',
        '| Cơ bản | 3 triệu |',
        '| Pro | 8 triệu |',
        '',
        'Lãi kép: $A = P(1 + r)^n$',
        '',
        '```js',
        'const a = 1;',
        '```',
        them?.anh?.length ? `Có ${them.anh.length} ảnh kèm theo.` : '',
      ].join('\n'),
      phienId: 'p-1',
      roiBac: them?.model === 'cuongmini-max' ? { thanh: 'cuongmini-3.11', lyDo: 'pro_required' } : null,
    }),
    phienDs: async () => cho(30, {
      ds: [
        { id: 'p-1', ten: 'Cách tối ưu truy vấn Postgres cho bảng rất lớn', luc: '', so: 12 },
        { id: 'p-2', ten: 'Ôn nhanh SWR302', luc: '', so: 4 },
        { id: 'p-3', ten: 'Cuộc chưa đặt tên', luc: '', so: 2 },
      ],
    }),
    phienDoc: async () => cho(30, {
      luot: [
        { toi: true, chu: 'Bảng 20 triệu dòng, truy vấn theo ngày đang chậm.' },
        { toi: false, chu: 'Thử index theo (ngay, id) rồi đo lại bằng EXPLAIN ANALYZE nhé.' },
      ],
    }),
    docCau: async () => ({ tiengBase64: null }),
    noi: async () => ({ cauHoi: '', traLoi: '', cau: [] }),
  };

  window.cuongthai = new Proxy({
    /* `on` trả về hàm HUỶ ĐĂNG KÝ — `useEffect(() => window.cuongthai?.on(...))`
       dùng thẳng giá trị trả về làm hàm dọn. Trả `undefined` là React ném. */
    on: () => () => {},
    settings: {
      getAll: async () => ({ odinCo: 'gon', giamChuyenDong: false }),
      set: async () => {},
      get: async () => undefined,
    },
    robot: new Proxy(thatRobot, { get: (o, k) => (k in o ? o[k] : async () => undefined) }),
    app: { luuFile: async () => ({ ok: true }) },
  }, { get: (o, k) => (k in o ? o[k] : rong) });

  window.__ANH_THU = anh;
}, { anh: ANH_1PX });

p.on('console', (m) => { if (m.type() === 'error') console.log('  [console]', m.text().slice(0, 200)); });
p.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 300)));
await p.goto(`http://127.0.0.1:${cong}/robot.html`);
await p.waitForTimeout(900);

const canh = process.argv[2] ?? 'chat';
const ra = process.argv[3] ?? '/tmp/ct-chup/robot.png';

/* Khung chat mở bằng cách BẤM VÀO CHÍNH CON ROBOT, và nó chờ 260ms xem có
   phải nhấp đúp không (`TRE_NHAP_DUP_MS` trong robot.tsx). Bấm rồi chụp ngay
   là chụp trúng lúc chưa mở. */
await p.locator('.rb-than').first().waitFor({ timeout: 5000 });
await p.locator('.rb-than').first().click();
await p.waitForTimeout(700);

if (!(await p.locator('.rb-chat').count())) {
  console.log('  ⚠️ bấm robot xong vẫn chưa thấy .rb-chat — bộ soi này đang đo nhầm chỗ');
}

if (canh === 'lichsu') {
  await p.locator('.rb-chat-nut button', { hasText: 'Lịch sử' }).click().catch(() => {});
  await p.waitForTimeout(400);
} else if (canh === 'anh') {
  /* Dán ảnh THẬT: dựng một `ClipboardEvent` mang `DataTransfer` có file ảnh,
     đúng thứ trình duyệt bắn ra khi người dùng bấm Ctrl/Cmd+V. Gọi thẳng
     `datAnh` thì chỉ chứng minh React chạy, không chứng minh đường dán. */
  await p.evaluate(async (dataUrl) => {
    const blob = await (await fetch(dataUrl)).blob();
    const tep = new File([blob], 'dan.png', { type: 'image/png' });
    const dt = new DataTransfer();
    dt.items.add(tep);
    const o = document.querySelector('.rb-chat-soan input');
    o.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  }, globalThis.__ANH_THU_NODE);
  await p.waitForTimeout(500);
  await p.locator('.rb-chat-soan input').fill('Ảnh này là gì?');
  await p.waitForTimeout(200);
} else if (canh === 'hoi') {
  await p.locator('.rb-chat-soan input').fill('Câu này giải sao?');
  await p.locator('.rb-chat-soan button').click();
  await p.waitForTimeout(500);
}

fs.mkdirSync(path.dirname(ra), { recursive: true });
const khung = p.locator('.rb-chat');
if (await khung.count() > 0) await khung.screenshot({ path: ra });
else await p.screenshot({ path: ra });
console.log(`đã chụp → ${ra} (khung chat: ${await khung.count() > 0 ? 'có' : 'KHÔNG TÌM THẤY'})`);

await trinh.close();
may.close();
