// browser.mjs — mở trang ở hai origin trong Chromium thật (Playwright), in kết quả fetch và lỗi trong console
import { chromium } from '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
for (const origin of ['http://localhost:5173', 'http://localhost:5174']) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(origin);
  await page.waitForFunction(() => document.title === 'done');
  console.log(`page ${origin}`);
  for (const line of await page.evaluate(() => window.__out)) console.log(`  ${line}`);
  for (const e of errors) console.log(`  console: ${e.length > 150 ? `${e.slice(0, 150)}…` : e}`);
  await page.close();
}
await browser.close();
