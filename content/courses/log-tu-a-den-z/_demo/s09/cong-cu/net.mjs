// net.mjs <kịch bản> — ghi mọi request như bảng Network của DevTools (bài 9.2), từ sự kiện CDP Network.*
//   CHI_TIET=đuôi-url : in thêm header + các pha thời gian của request đó · CURL=đuôi-url : in lệnh như "Copy as cURL (bash)"
import { mo, ngu, viTri } from './mo.mjs';
const kb = process.argv[2] || 'me';
const { browser, page, cdp } = await mo({ console: false });
const R = new Map();
await cdp.send('Network.enable');
cdp.on('Network.requestWillBeSent', (p) => R.set(p.requestId, { ...R.get(p.requestId), req: p.request, init: p.initiator, type: p.type, t0: p.timestamp }));
cdp.on('Network.requestWillBeSentExtraInfo', (p) => (R.get(p.requestId) ?? R.set(p.requestId, {}).get(p.requestId)).hdrGui = p.headers);
cdp.on('Network.responseReceived', (p) => Object.assign(R.get(p.requestId), { res: p.response }));
cdp.on('Network.loadingFinished', (p) => Object.assign(R.get(p.requestId), { t1: p.timestamp, size: p.encodedDataLength }));
cdp.on('Network.loadingFailed', (p) => Object.assign(R.get(p.requestId), { t1: p.timestamp, loi: p.errorText, cors: p.corsErrorStatus?.corsError }));
try {
  await page.goto(`http://shop.lgz.test:41901/?kb=${kb}`);
  await ngu(Number(process.env.CHO ?? 3000));
} finally { await browser.close(); }

const ms = (a, b) => (a >= 0 && b >= 0 ? Math.round(b - a) : null);
const hang = [...R.values()].filter((r) => r.req && !r.req.url.startsWith('data:'));
for (const r of hang) if (r.res?.timing?.requestTime) r.t0 = Math.min(r.t0, r.res.timing.requestTime);
hang.sort((a, b) => a.t0 - b.t0);
const het = Math.max(...hang.map((r) => r.t1 ?? r.t0));
const goc = Math.min(...hang.map((r) => r.t0));
console.log('Name'.padEnd(13), 'Method ', 'Status'.padEnd(34), 'Type'.padEnd(9), 'Initiator'.padEnd(10), 'Size'.padStart(6), 'Time'.padStart(7), ' Waterfall');
for (const r of hang) {
  const u = new URL(r.req.url); const ten = (u.pathname.split('/').pop() || u.host) + (u.search && u.pathname !== '/' ? u.search : '');
  const st = r.cors ? 'CORS error' : r.loi ? `(failed) ${r.loi}` : `${r.res?.status} ${r.res?.statusText}`;
  const init = r.init?.type === 'preflight' ? 'Preflight' : r.init?.stack?.callFrames?.[0] ? viTri(r.init.stack.callFrames[0].url, r.init.stack.callFrames[0].lineNumber, r.init.stack.callFrames[0].columnNumber) : r.init?.type === 'parser' ? '(index)' : r.init?.type;
  console.log(ten.slice(0, 13).padEnd(13), r.req.method.padEnd(7), st.slice(0, 34).padEnd(34), (r.type || '').toLowerCase().padEnd(9), String(init).padEnd(10), (r.size != null ? (r.size / 1024).toFixed(1) + ' kB' : '-').padStart(7), (r.t1 ? Math.round((r.t1 - r.t0) * 1000) + ' ms' : '-').padStart(7), ' ' + ' '.repeat(Math.round((r.t0 - goc) / (het - goc) * 30)) + '█'.repeat(Math.max(1, Math.round(((r.t1 ?? r.t0) - r.t0) / (het - goc) * 30))));
}
const ct = hang.find((r) => process.env.CHI_TIET && r.req.url.endsWith(process.env.CHI_TIET) && r.req.method !== 'OPTIONS');
if (ct) {
  const t = ct.res?.timing;
  console.log(`\n── ${ct.req.method} ${ct.req.url}`);
  if (t) {
    const pha = [['Queueing/Stalled', 0, t.dnsStart >= 0 ? t.dnsStart : t.connectStart >= 0 ? t.connectStart : t.sendStart],
      ['DNS Lookup', t.dnsStart, t.dnsEnd], ['Initial connection', t.connectStart, t.connectEnd], ['SSL', t.sslStart, t.sslEnd],
      ['Request sent', t.sendStart, t.sendEnd], ['Waiting for server response (TTFB)', t.sendEnd, t.receiveHeadersEnd],
      ['Content Download', t.receiveHeadersEnd, ct.t1 ? (ct.t1 - t.requestTime) * 1000 : null]];
    for (const [ten, a, b] of pha) { const v = ms(a, b); if (v !== null && (v > 0 || ten.startsWith('Wait'))) console.log(`   ${ten.padEnd(36)} ${String(v).padStart(5)} ms`); }
    console.log(`   Kết nối mới? ${t.connectStart >= 0 ? 'có (TCP vừa mở)' : 'không (dùng lại kết nối keep-alive)'}   remote: ${ct.res.remoteIPAddress}:${ct.res.remotePort}`);
  }
  console.log('   Request headers:'); for (const [k, v] of Object.entries(ct.hdrGui ?? ct.req.headers)) console.log(`     ${k}: ${v}`);
  console.log('   Response headers:'); for (const [k, v] of Object.entries(ct.res?.headers ?? {})) console.log(`     ${k}: ${v}`);
}
const cu = hang.find((r) => process.env.CURL && r.req.url.endsWith(process.env.CURL) && r.req.method !== 'OPTIONS');
if (cu) {
  const h = cu.hdrGui ?? cu.req.headers;
  console.log(`\n── Copy as cURL (bash):\ncurl '${cu.req.url}' \\\n` + Object.entries(h).filter(([k]) => !k.startsWith(':') && !/^(connection|accept-encoding|host)$/i.test(k)).map(([k, v]) => `  -H '${k}: ${v}'`).join(' \\\n'));
}
