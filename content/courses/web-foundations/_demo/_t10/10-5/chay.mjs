// chay: tay — Bài 10.5: một cú bấm đi hết cả khoá — Chromium thật (Playwright) bấm "Add", máy chủ Node 22 ghi từng tầng
// (http → auth → valid → sql → reply), rồi cùng API đó qua curl. Cổng 3460 phải trống.
// node content/courses/web-foundations/_demo/_t10/10-5/chay.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(HERE, '../../../../../../package.json'));
const { chromium } = require('playwright');
const ghi = (ten, s) => fs.writeFileSync(path.join(HERE, '..', 'out', ten + '.out.txt'), s.replace(/sid=[A-Za-z0-9_-]{20,}/g, 'sid=…').replace(/\n+$/, '') + '\n');
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));
const A = 'http://localhost:3460';

const server = spawn(process.execPath, ['--no-warnings', path.join(HERE, 'server.mjs')], { stdio: ['ignore', 'pipe', 'inherit'] });
const srvLog = [];
server.stdout.on('data', (d) => srvLog.push(...String(d).trim().split('\n')));
await ngu(600);
const mark = () => srvLog.length;
const since = (i) => srvLog.slice(i).join('\n');

const trinh = await chromium.launch();
try {
  const page = await trinh.newPage();
  const browserLog = [];
  page.on('console', (m) => browserLog.push(m.text()));
  const bmark = () => browserLog.length;
  const bsince = (i) => browserLog.slice(i).join('\n');

  let s0 = mark(), b0 = bmark();
  await page.goto(A + '/');
  await page.fill('input[name=password]', 'correct horse battery');
  await page.click('#login button');
  await page.waitForSelector('#add:not([hidden])');
  await page.waitForFunction(() => document.querySelectorAll('#notes li').length === 2);
  ghi('fs-login', '── browser (DevTools console) ──\n' + bsince(b0) + '\n\n── server (terminal) ──\n' + since(s0));

  s0 = mark(); b0 = bmark();
  await page.fill('input[name=title]', 'Ship the capstone');
  await page.click('#add button');
  await page.waitForFunction(() => document.querySelectorAll('#notes li').length === 3);
  await ngu(100);
  const items = await page.$$eval('#notes li', (els) => els.map((e) => e.textContent));
  ghi('fs-click', '── browser (DevTools console) ──\n' + bsince(b0) + '\n\n── server (terminal) ──\n' + since(s0) + '\n\n── page ──\n#notes: ' + JSON.stringify(items));

  s0 = mark(); b0 = bmark();
  await page.fill('input[name=title]', '   ');
  await page.click('#add button');
  await page.waitForFunction(() => document.querySelector('#status').textContent !== '');
  await ngu(100);
  ghi('fs-invalid', '── browser (DevTools console) ──\n' + bsince(b0) + '\n\n── server (terminal) ──\n' + since(s0) + '\n\n── page ──\n#status: ' + JSON.stringify(await page.textContent('#status')));
  await page.close();

  // the same API without a browser
  const jar = path.join(HERE, '.cookies.tmp');
  const curl = (...args) => {
    let out;
    try { out = execFileSync('curl', ['-sS', ...args], { encoding: 'utf8' }); } catch (e) { out = e.stdout; }
    return out.replace(/\r/g, '').replace(/^(Date|Connection|Keep-Alive): .*\n/gm, '');
  };
  const lines = [];
  lines.push('$ curl -i -X POST localhost:3460/api/notes -d \'{"title":"from curl"}\'      (no cookie)');
  lines.push(curl('-i', '-X', 'POST', A + '/api/notes', '-H', 'Content-Type: application/json', '-d', '{"title":"from curl"}'));
  lines.push('', '$ curl -c jar -X POST localhost:3460/login -d \'{"email":"an@example.com","password":"…"}\'');
  lines.push(curl('-c', jar, '-X', 'POST', A + '/login', '-H', 'Content-Type: application/json', '-d', JSON.stringify({ email: 'an@example.com', password: 'correct horse battery' })));
  lines.push('', '$ curl -b jar localhost:3460/api/notes');
  lines.push(curl('-b', jar, A + '/api/notes'));
  fs.rmSync(jar, { force: true });
  ghi('fs-curl', lines.join('\n'));
} finally {
  await trinh.close();
  server.kill();
}
