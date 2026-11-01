// hdr-probe.mjs — bài 7.2: POST KHÔNG body, Node fetch và Chromium gửi header gì?
import http from 'node:http';
import { chromium } from 'playwright';
const seen = [];
const srv = http.createServer((req, res) => {
  if (req.method === 'POST') seen.push(`${req.headers['user-agent']?.includes('Chrome') ? 'Chromium' : 'Node fetch'}: content-length=${req.headers['content-length'] ?? '(none)'} content-type=${req.headers['content-type'] ?? '(none)'}`);
  res.setHeader('Access-Control-Allow-Origin', '*'); res.end('ok');
}).listen(4099);
await fetch('http://localhost:4099/cancel', { method: 'POST' });
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('http://localhost:4099/');
await p.evaluate(() => fetch('/cancel', { method: 'POST' }));
await b.close(); srv.close();
console.log(seen.join('\n'));
