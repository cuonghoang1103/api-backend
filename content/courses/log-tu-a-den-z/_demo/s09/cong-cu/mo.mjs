// mo.mjs — mở Google Chrome thật (headless) qua Playwright + một phiên CDP: đúng giao thức mà DevTools dùng để vẽ bảng
// Console/Network. In sự kiện theo kiểu DevTools. Tên miền lab trỏ về 127.0.0.1 bằng --host-resolver-rules.
import { chromium } from 'playwright-core';
import { SourceMap } from 'node:module';
import fs from 'node:fs';

export const ngu = (ms) => new Promise((r) => setTimeout(r, ms));
// JWT giả của lab đã hết hạn (exp = 2026-11-23 00:00 UTC) — chỉ là chuỗi minh hoạ, không phải bí mật thật
export const TOKEN_CU = 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from(JSON.stringify({ sub: 'sv.lab9@example.com', exp: 1795392000 })).toString('base64url') + '.GIA_TOKEN·VIDU_chu_ky';

let SM = null;
export function viTri(url, line, col) {                     // line/col tính từ 0 như CDP
  const ten = (url || '').split('/').pop() || '(không rõ)';
  if (!/app\.min\.js$/.test(url || '') || process.env.KHONG_MAP) return `${ten}:${line + 1}`;
  SM ??= new SourceMap(JSON.parse(fs.readFileSync('public/app.min.js.map', 'utf8')));
  const e = SM.findEntry(line, col);
  return e?.originalSource ? `${e.originalSource.split('/').pop()}:${e.originalLine + 1}` : `${ten}:${line + 1}`;
}

export async function mo({ context = {}, args = [], console: inCon = true } = {}) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, timeout: 30000,
    args: ['--no-first-run', '--host-resolver-rules=MAP shop.lgz.test 127.0.0.1, MAP api.lgz.test 127.0.0.1, MAP bank.lgz.test 127.0.0.1', ...args] });
  const ctx = await browser.newContext({ locale: 'vi-VN', ...context });
  await ctx.addInitScript((t) => { if (location.host.startsWith('shop.')) localStorage.setItem('token', t); }, TOKEN_CU);
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const cdp = await ctx.newCDPSession(page);
  if (inCon) {
    await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
    const muc = { log: 'info   ', info: 'info   ', debug: 'verbose', warning: 'warning', error: 'error  ' };
    cdp.on('Runtime.consoleAPICalled', (p) => {
      const f = p.stackTrace?.callFrames?.[0];
      const v = p.args.map((a) => a.value !== undefined ? (typeof a.value === 'object' ? JSON.stringify(a.value) : a.value) : (a.preview ? '{' + a.preview.properties.map((x) => `${x.name}: ${x.value}`).join(', ') + '}' : a.description ?? a.type));
      console.log(`[${muc[p.type] ?? p.type}] ${v.join(' ')}   ${f ? viTri(f.url, f.lineNumber, f.columnNumber) : ''}`);
    });
    cdp.on('Runtime.exceptionThrown', (p) => {
      const d = p.exceptionDetails; const fr = d.stackTrace?.callFrames || [];
      const dau = (d.exception?.description || d.text).split('\n')[0];
      console.log(`[error  ] ${d.text === 'Uncaught' ? 'Uncaught ' : d.text + ' '}${dau}   ${fr[0] ? viTri(fr[0].url, fr[0].lineNumber, fr[0].columnNumber) : ''}`);
      for (const c of fr.slice(0, Number(process.env.SAU ?? 3))) console.log(`              at ${c.functionName || '(anonymous)'} (${viTri(c.url, c.lineNumber, c.columnNumber)}${process.env.KHONG_MAP ? ':' + (c.columnNumber + 1) : ''})`);
    });
    cdp.on('Log.entryAdded', ({ entry: e }) => console.log(`[${(muc[e.level] ?? e.level).padEnd(7)}] (${e.source}) ${e.text}${e.url && !e.text.includes(e.url) ? '   ' + e.url.split('/').pop() : ''}`));
  }
  return { browser, ctx, page, cdp };
}
