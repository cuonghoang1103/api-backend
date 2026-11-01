// demo1/open-reset.mjs — open the reset link in real Chromium, once per Referrer-Policy, and let the servers log.
import { chromium } from 'playwright';
const token = process.argv[2];
const browser = await chromium.launch();
for (const policy of ['', 'no-referrer-when-downgrade', 'unsafe-url', 'no-referrer']) {
  const page = await browser.newPage();
  const url = `http://localhost:4800/reset?token=${token}${policy ? `&policy=${policy}` : ''}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  console.log(`opened with Referrer-Policy: ${policy || '(not set — browser default)'}`);
  await page.close();
}
console.log(`Chromium ${browser.version()}`);
await browser.close();
