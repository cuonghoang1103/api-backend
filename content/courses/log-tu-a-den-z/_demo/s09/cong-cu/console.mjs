// console.mjs <kịch bản> — mở trang Lab 9 và in mọi thứ bảng Console nhận được (bài 9.1)
//   KHONG_MAP=1: in vị trí trong tệp đã nén (như khi không có source map) · BAM=1: bấm nút Thanh toán
import { mo, ngu } from './mo.mjs';
const kb = process.argv[2] || 'me';
const { browser, page } = await mo();
try {
  await page.goto(`http://shop.lgz.test:41901/?kb=${kb}`);
  await ngu(Number(process.env.CHO ?? 1500));
  if (process.env.BAM) { await page.click('#pay'); await ngu(300); }
} finally { await browser.close(); }
