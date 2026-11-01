// demo3/csrf-matrix.mjs — lesson 3.4: an attacker page on 127.0.0.1:4801 tries to change An's email on localhost:4802,
// with an auto-submitting form and with fetch(no-cors). Real Chromium; one fresh browser profile per configuration.
// Status = what the server answered (the attacker's page cannot read a no-cors response — the write happens anyway).
import http from 'node:http';
import { chromium } from 'playwright';
import { csrfTarget } from './csrf-target.mjs';

const T = 'http://localhost:4802/email';
const EVIL = {
  form: `<form id="f" method="POST" action="${T}"><input name="email" value="attacker@evil.example"></form><script>f.submit()</script>`,
  fetch: `<script>fetch('${T}', { method: 'POST', mode: 'no-cors', credentials: 'include',
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'email=attacker@evil.example' })</script>`,
};
const evil = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(EVIL[req.url.slice(1)] ?? ''); }).listen(4801, '127.0.0.1');
const browser = await chromium.launch();
console.log(`Chromium ${browser.version()}`);
console.log('cookie SameSite  defence         attacker form  attacker fetch  An’s own form  email at the end');
for (const [sameSite, defence] of [['None', 'none'], ['', 'none'], ['Lax', 'none'], ['None', 'fetch-metadata'], ['None', 'token']]) {
  const server = csrfTarget({ sameSite, defence }).listen(4802);
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('http://localhost:4802/login');
  const results = [];
  for (const kind of ['form', 'fetch']) {
    await page.goto('http://localhost:4802/reset');                               // each attempt starts from An's real email
    const resp = page.waitForResponse((r) => r.url() === T, { timeout: 3000 }).catch(() => null);
    await page.goto(`http://127.0.0.1:4801/${kind}`);
    const r = await resp;
    if (kind === 'form' && r) await page.waitForURL(T, { waitUntil: 'load' });   // the form navigates the tab to the target
    await page.waitForTimeout(300);
    results.push(r ? String(r.status()) : '—');
    await page.goto('http://localhost:4802/state');
    if (JSON.parse(await page.textContent('body')).email === 'attacker@evil.example') results[results.length - 1] += ' CHANGED';
  }
  await page.goto('http://localhost:4802/settings');
  const own = page.waitForResponse((r) => r.url() === T);
  await page.evaluate(() => document.getElementById('f').submit());
  results.push(String((await own).status()));
  await page.waitForURL(T, { waitUntil: 'load' });
  await page.goto('http://localhost:4802/state');
  const end = JSON.parse(await page.textContent('body')).email;
  console.log(`${(sameSite || '(unset)').padEnd(17)}${defence.padEnd(16)}${results[0].padEnd(15)}${results[1].padEnd(16)}${results[2].padEnd(15)}${end}`);
  await ctx.close();
  await new Promise((r) => server.close(r));
}
await browser.close(); evil.close();
