/**
 * ĐƯỜNG NHẮC LỊCH CỦA ROBOT — chạy: npm run thu:robot
 *
 * Đường này đi qua ba nhà: vòng đếm ở `App.tsx` → sự kiện `window` →
 * `OdinDock` → `useOdin.announceTam`. Phép kiểm đơn vị canh được từng nhà,
 * KHÔNG canh được cái dây nối — một tên sự kiện gõ sai, một `enabled` chặn
 * nhầm, hay `announceTam` không được đưa ra khỏi hook, đều cho ra đúng một
 * triệu chứng: robot im lặng. Mà im lặng thì không ai báo lỗi.
 *
 * Nên ở đây gắn cây component THẬT rồi hỏi ba câu:
 *   1. chưa bắn thì không có bong bóng (nếu có sẵn thì câu 2 vô nghĩa)
 *   2. bắn xong thì bong bóng hiện, và mã lớp có gạch dưới còn NGUYÊN
 *      (`announce` thường sẽ ăn mất — xem `nhacLichRobot.test.ts`)
 *   3. 15 giây sau nó tự tắt — thứ nói 10 phút một lần mà nằm mãi thì chiếm
 *      góc màn hình vĩnh viễn
 */
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const thuMuc = path.join(process.cwd(), 'dist/bo-cuc');
const kieu = (f) => f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'text/javascript' : 'text/html';
const may = http.createServer((q, r) => {
  const f = path.join(thuMuc, q.url.split('?')[0].replace(/^\//, ''));
  if (fs.existsSync(f) && fs.statSync(f).isFile()) { r.writeHead(200, { 'content-type': kieu(f) }); fs.createReadStream(f).pipe(r); }
  else { r.writeHead(404); r.end(); }
});
await new Promise((r) => may.listen(0, r));
const cong = may.address().port;
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1200, height: 800 });
await p.goto(`http://127.0.0.1:${cong}/bo-cuc/trang-thu.html?trang=%2Fdashboard&robot=1`);
await p.waitForTimeout(2500);

const doc = () => p.evaluate(() => {
  const e = document.querySelector('.ct-odin-bong, .ct-odin-say, [class*="odin"] span');
  const t = [...document.querySelectorAll('[class*="odin"]')].map((x) => x.textContent?.trim()).filter(Boolean);
  return { co: !!e, chu: t.join(' | ').slice(0, 200) };
});

let hong = 0; let tong = 0;
const canh = (ten, dat) => { tong++; console.log(dat ? `\x1b[32m✓\x1b[0m ${ten}` : `\x1b[31m✗\x1b[0m ${ten}`); if (!dat) hong++; };

canh('chưa bắn thì KHÔNG có bong bóng', (await doc()).co === false);
await p.evaluate(() => window.dispatchEvent(new CustomEvent('ct:robot-nhac-lich',
  { detail: { chu: 'Còn 1 giờ 35 phút nữa là học AI17_A ở BE-2_1 (10:00).' } })));
await p.waitForTimeout(600);
const sau = await doc();
canh('bắn xong thì bong bóng hiện', sau.co === true);
canh('mã lớp có gạch dưới còn nguyên (AI17_A)', sau.chu.includes('AI17_A'));
canh('phòng có gạch dưới còn nguyên (BE-2_1)', sau.chu.includes('BE-2_1'));
/* Ảnh chụp chỉ để soi khi cần, và mặc định KHÔNG ghi gì: bản cũ ghi thẳng
   `robot.png` vào `desktop/` nên nó nằm lại trong kho, và một tệp lạ trong
   `desktop/` là đủ để `npm run phat-hanh` từ chối chạy (nó đòi thư mục sạch).
   Đặt `CT_ANH=<đường dẫn>` khi thật sự muốn ảnh. */
if (process.env.CT_ANH) await p.screenshot({ path: process.env.CT_ANH });

/* Đợi qua mốc tự tắt. 14s + dư. */
await p.waitForTimeout(15_000);
canh('15 giây sau thì TỰ TẮT', (await doc()).co === false);
await b.close(); may.close();
console.log(hong === 0 ? `\n\x1b[32m${tong}/${tong} đạt\x1b[0m` : `\n\x1b[31m${hong}/${tong} phép kiểm hỏng\x1b[0m`);
process.exit(hong === 0 ? 0 : 1);
