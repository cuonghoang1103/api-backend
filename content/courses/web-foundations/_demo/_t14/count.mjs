// Loads a URL in Chromium and counts what the browser downloaded.
import { chromium } from 'playwright';
const [url, label] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();
let n = 0, bytes = 0;
page.on('response', async (r) => { n++; try { bytes += (await r.body()).length; } catch {} });
await page.goto(url, { waitUntil: 'networkidle' });
console.log(label.padEnd(30), n, 'requests,', (bytes / 1024).toFixed(1), 'KB downloaded');
await browser.close();
