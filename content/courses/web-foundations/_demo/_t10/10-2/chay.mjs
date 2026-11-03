// chay: tay — Bài 10.2 trong Chromium thật (Playwright): lỗi trên trang (pageerror + dòng:cột), console.log,
// và một BREAKPOINT thật qua Chrome DevTools Protocol: dừng ở dòng 7 của cart.js và đọc biến cục bộ.
// node content/courses/web-foundations/_demo/_t10/10-2/chay.mjs
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(HERE, '../../../../../../package.json'));
const { chromium } = require('playwright');
const ghi = (ten, s) => fs.writeFileSync(path.join(HERE, '..', 'out', ten + '.out.txt'), s.replace(/http:\/\/127\.0\.0\.1:\d+\//g, '').replace(/\n+$/, '') + '\n');
// a tiny static server: on file:// pages the browser hides error details (opaque origin)
const srv = http.createServer((req, res) => {
  const f = req.url === '/' ? 'page.html' : req.url.slice(1);
  if (!['page.html', 'cart.js'].includes(f)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : 'text/html' }).end(fs.readFileSync(path.join(HERE, f)));
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const URL = 'http://127.0.0.1:' + srv.address().port + '/';

const trinh = await chromium.launch();
try {
  // 1. what the Console panel shows after one click
  {
    const page = await trinh.newPage();
    const lines = [];
    // the page's own error event gives V8's real stack (1-based line:column, as DevTools shows it)
    await page.addInitScript(() => addEventListener('error', (e) => console.error('Uncaught ' + e.error.stack)));
    page.on('console', (m) => lines.push(m.text().startsWith('Uncaught ') ? m.text() : 'console.' + m.type() + ': ' + m.text()));
    await page.goto(URL);
    await page.click('#add');
    await page.waitForTimeout(200);
    lines.push('', '#total now shows: ' + JSON.stringify(await page.textContent('#total')));
    ghi('page-console', '[click "Add pen"]\n' + lines.join('\n'));
    await page.close();
  }
  // 2. a breakpoint on line 7 (inside the loop), read the locals each time it pauses
  {
    const page = await trinh.newPage();
    const cdp = await page.context().newCDPSession(page);
    const urls = new Map();
    cdp.on('Debugger.scriptParsed', (e) => urls.set(e.scriptId, e.url));
    await cdp.send('Debugger.enable');
    await page.goto(URL);
    await cdp.send('Debugger.setBreakpointByUrl', { urlRegex: 'cart\\.js$', lineNumber: 6 });   // 0-based ⇒ line 7: return total + shipping
    const stops = [];
    cdp.on('Debugger.paused', async (ev) => {
      const f = ev.callFrames[0];
      const local = f.scopeChain.find((s) => s.type === 'block' || s.type === 'local');
      const vars = [];
      for (const s of f.scopeChain.filter((s) => s.type === 'block' || s.type === 'local')) {
        const { result } = await cdp.send('Runtime.getProperties', { objectId: s.object.objectId, ownProperties: true });
        for (const p of result) {
          const v = p.value;
          let shown = v?.type === 'object' && v.objectId
            ? JSON.stringify((await cdp.send('Runtime.callFunctionOn', { objectId: v.objectId, functionDeclaration: 'function () { return JSON.stringify(this); }', returnByValue: true })).result.value)
            : v?.type === 'string' ? JSON.stringify(v.value) : String(v?.value);
          if (v?.type === 'object') shown = JSON.parse(shown);
          vars.push(p.name + ' = ' + shown);
        }
      }
      stops.push('paused at ' + String(urls.get(f.location.scriptId) ?? '').split('/').pop() + ':' + (f.location.lineNumber + 1) + ' in ' + f.functionName + '()\n  ' + vars.join('\n  '));
      void local;
      await cdp.send('Debugger.resume');
    });
    page.on('pageerror', () => {});
    await page.click('#add');
    await page.waitForTimeout(500);
    ghi('breakpoint', '[breakpoint on cart.js line 7 (return total + shipping), then click "Add pen"]\n' + stops.join('\n'));
    await page.close();
  }
} finally {
  await trinh.close();
  srv.close();
}
