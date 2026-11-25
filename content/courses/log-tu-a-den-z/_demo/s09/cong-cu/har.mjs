// har.mjs <kịch bản> <tệp.har> — mở trang Lab 9 và ghi toàn bộ lưu lượng thành tệp HAR 1.2 (Playwright recordHar,
// cùng định dạng DevTools "Export HAR"). Dùng cho bài 9.3 và để dựng tệp HAR "người khác gửi" của Lab 9.
import { mo, ngu } from './mo.mjs';
const [kb = 'me', tep = 'shop.har'] = process.argv.slice(2);
const { browser, ctx, page } = await mo({ console: false, context: { recordHar: { path: tep, content: 'embed' } } });
try {
  await page.goto(`http://shop.lgz.test:41901/?kb=${kb}`);
  await ngu(Number(process.env.CHO ?? 3000));
} finally { await ctx.close(); await browser.close(); }
console.log('đã ghi', tep);
