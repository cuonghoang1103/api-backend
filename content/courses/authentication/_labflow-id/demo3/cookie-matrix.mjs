// demo3/cookie-matrix.mjs — lesson 3.2: what real Chromium does with each Set-Cookie of demo3/cookie-lab.js.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const B = 'http://localhost:4802';
const jar = async () => (await ctx.cookies(B + '/me')).map((c) => c.name).concat((await ctx.cookies(B + '/admin')).map((c) => c.name));
console.log(`Chromium ${browser.version()} · origin ${B}`);
console.log('case                     stored?  JS sees it?  sent to /me?');
for (const c of ['plain', 'httponly', 'host_ok', 'host_no_secure', 'host_domain', 'host_path', 'secure_prefix_no_secure', 'path_me']) {
  await page.goto(`${B}/set?c=${c}`);
  const names = [...new Set(await jar())];
  await page.goto(`${B}/me`);
  const sent = JSON.parse(await page.textContent('body')).cookieHeader;
  const visible = await page.evaluate(() => document.cookie);
  const name = { plain: 'plain', httponly: 'httponly', host_ok: '__Host-ok', host_no_secure: '__Host-nosecure', host_domain: '__Host-domain',
    host_path: '__Host-path', secure_prefix_no_secure: '__Secure-x', path_me: 'scoped' }[c];
  const yes = (b) => (b ? 'yes' : 'no ').padEnd(9);
  console.log(`${c.padEnd(25)}${yes(names.includes(name))}${yes(visible.split('; ').some((p) => p.startsWith(name + '=')))}   ${sent.split('; ').some((p) => p.startsWith(name + '=')) ? 'yes' : 'no'}`);
}
for (const c of ['delete_wrong_path', 'delete_right_path']) {
  await page.goto(`${B}/set?c=${c}`);
  console.log(`${c.padEnd(25)}scoped still stored: ${(await jar()).includes('scoped') ? 'YES' : 'no'}`);
}
await browser.close();
