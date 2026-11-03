// chay: tay — Bài 5.4 + 5.5: fetch POST tới API Node thật, AbortSignal.timeout, và module mở bằng file:// bị chặn.
// node content/courses/web-foundations/_demo/_t5/chay.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createApi } from './api.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEMO = path.resolve(HERE, '..');
const require = createRequire(path.resolve(HERE, '../../../../../package.json'));
const { chromium } = require('playwright');
const ghi = (ten, s) => fs.writeFileSync(path.join(HERE, 'out', ten + '.out.txt'), s.replace(/\n+$/, '') + '\n');

const logs = [];
const origLog = console.log;
console.log = (...a) => logs.push(a.join(' '));
const api = createApi();
await new Promise((r) => api.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${api.address().port}`;

const trinh = await chromium.launch();
const page = await trinh.newPage();
await page.goto(base + '/api/todos');
const ketQua = await page.evaluate(async () => {
  const out = [];
  const post = async (body, headers = { 'Content-Type': 'application/json' }) => {
    const res = await fetch('/api/todos', { method: 'POST', headers, body });
    return `${res.status} ${res.ok} ${await res.text()}`;
  };
  out.push('POST with JSON body       → ' + await post(JSON.stringify({ title: 'Write the report' })));
  out.push('POST, forgot JSON.stringify → ' + await post({ title: 'oops' }));
  out.push('POST, missing title       → ' + await post(JSON.stringify({})));
  const all = await (await fetch('/api/todos')).json();
  out.push('GET /api/todos now has ' + all.length + ' items');
  const t0 = performance.now();
  try {
    await fetch('/api/slow', { signal: AbortSignal.timeout(500) });
  } catch (err) {
    out.push(`slow endpoint, 500 ms timeout → ${err.name} after about ${Math.round((performance.now() - t0) / 100) * 100} ms`);
  }
  return out;
});
ghi('fetch-post', ketQua.join('\n'));
ghi('fetch-post-server', logs.join('\n'));

// 5.5 — a module page opened from the disk (file://) instead of a server
const p2 = await trinh.newPage();
const loi = [];
p2.on('console', (m) => loi.push(m.text()));
await p2.goto(pathToFileURL(path.join(DEMO, '5-5/app.html')).href);
await p2.waitForTimeout(500);
ghi('module-file', loi.map((l) => l.replace(/file:\/\/\S*\/_demo\//g, 'file:///…/').replace(/'null'/g, "'null'")).join('\n') || '(no console output)');

await trinh.close();
api.close();
console.log = origLog;
console.log('xong');
