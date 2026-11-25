// netlog.mjs <tệp.json> — mở Chrome với --log-net-log (y như bấm "Start logging to disk" ở chrome://net-export)
// rồi thử 4 địa chỉ: trang lỗi chứng chỉ, tên miền không tồn tại, cổng không ai nghe, và một trang tốt (bài 9.4)
import { mo, ngu } from './mo.mjs';
const tep = process.argv[2] || 'netlog.json';
const { browser, page } = await mo({ console: false, args: [`--log-net-log=${process.cwd()}/${tep}`, '--net-log-capture-mode=Default'] });
for (const u of ['https://bank.lgz.test:41903/', 'http://mat-tich.lgz.test/', 'http://shop.lgz.test:41909/', 'http://shop.lgz.test:41901/']) {
  const r = await page.goto(u).then((x) => `${x.status()}`, (e) => e.message.split('\n')[0].replace(/ at .*/, ''));
  console.log(u.padEnd(32), '→', r); await ngu(300);
}
await ngu(300); await browser.close();
