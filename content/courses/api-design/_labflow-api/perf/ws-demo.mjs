// perf/ws-demo.mjs — bài 10.4: WebSocket với vé dùng một lần. Xin vé ⇒ nối ⇒ nhận hello + sự kiện ⇒ dùng lại vé cũ ⇒ bị từ chối
import WebSocket from 'ws';
import { book } from './book.mjs';
const BASE = process.env.BASE ?? 'http://localhost:4000';
const r = await fetch(`${BASE}/v2/realtime/tickets`, { method: 'POST', headers: { authorization: 'Bearer tok_lan' } });
const { ticket, expiresIn } = await r.json();
console.log(`POST /v2/realtime/tickets ⇒ ${r.status} { ticket: "${ticket.slice(0, 8)}…", expiresIn: ${expiresIn} }`);
const url = `${BASE.replace('http', 'ws')}/v2/ws?ticket=${ticket}`;
const ws = new WebSocket(url);
ws.on('message', (m) => console.log('← ' + String(m).slice(0, 150) + (String(m).length > 150 ? '…' : '')));
await new Promise((ok) => ws.once('open', ok));
console.log('đã nối (101 Switching Protocols)');
await book(1); await new Promise((ok) => setTimeout(ok, 300));
ws.send(JSON.stringify({ type: 'resume', after: '0' })); console.log('→ {"type":"resume","after":"0"}');
await new Promise((ok) => setTimeout(ok, 300)); ws.close();
const again = new WebSocket(url);
again.on('unexpected-response', (req, res) => { let b = ''; res.on('data', (d) => (b += d)); res.on('end', () => console.log(`dùng lại vé cũ ⇒ ${res.statusCode} ${b}`)); });
again.on('error', () => {});
