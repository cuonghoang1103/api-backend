// perf/realtime.mjs — bài 10.4: CÙNG 30 lượt đặt (cách nhau 100–700 ms), bốn client nghe song song:
//   polling 2 s · long polling (wait=25) · SSE · WebSocket. Đo: độ trễ từ lúc sự kiện sinh tới lúc client thấy, số request, số byte.
import WebSocket from 'ws';
import { openSSE } from './sse-client.mjs';

const BASE = process.env.BASE ?? 'http://localhost:4000', N = Number(process.env.N ?? 30);
const H = { authorization: 'Bearer tok_lan' };
const stats = {};
const mk = (name) => (stats[name] = { lat: [], requests: 0, bytes: 0 });
// byte = header phản hồi + body JSON gọn (server dev thụt lề JSON; đo theo dạng production cho công bằng)
const hdr = (r) => [...r.headers].reduce((n, [k, v]) => n + k.length + v.length + 4, 17);
const seen = (s, e) => s.lat.push(Date.now() - Date.parse(e.time));
let stop = false;
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const start = await (await fetch(`${BASE}/v2/events`, { headers: H })).json();   // "từ bây giờ"

async function poller(name, waitSec, everyMs) {
  const s = mk(name); let next = start.next;
  while (!stop) {
    const r = await fetch(`${BASE}/v2/events?after=${next}&wait=${waitSec}`, { headers: H });
    const p = await r.json(); s.requests++; s.bytes += hdr(r) + JSON.stringify(p).length; p.data.forEach((e) => seen(s, e)); next = p.next;
    if (everyMs) await sleep(everyMs);
  }
}
async function sse() {
  const s = mk('SSE'); const ctl = new AbortController(); s.ctl = ctl;
  await openSSE(`${BASE}/v2/events/stream`, { headers: H, signal: ctl.signal, onOpen: (r) => { s.requests++; s.bytes += hdr(r); },
    onEvent: (m) => { if (m.data) { s.bytes += m.data.length; seen(s, JSON.parse(m.data)); } } });
}
async function ws() {
  const s = mk('WebSocket');
  const { ticket } = await (await fetch(`${BASE}/v2/realtime/tickets`, { method: 'POST', headers: H })).json(); s.requests++;
  const sock = new WebSocket(`${BASE.replace('http', 'ws')}/v2/ws?ticket=${ticket}`); s.sock = sock;
  sock.on('message', (raw) => { s.bytes += raw.length; const m = JSON.parse(raw); if (m.type === 'event') seen(s, m.event); });
  await new Promise((ok) => sock.once('open', ok)); s.requests++;
}
const clients = [poller('polling 2 s', 0, 2000), poller('long polling', 25, 0), sse(), ws()];
await sleep(500);
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const start = new Date(Date.UTC(2027, 0, 4 + Math.floor(i / 5), 1 + (i % 5) * 2)).toISOString();
  await fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: { ...H, 'content-type': 'application/json' },
    body: JSON.stringify({ labId: 'lab_3', period: { start, end: new Date(Date.parse(start) + 7200000).toISOString() } }) });
  await sleep(100 + Math.random() * 600);
}
await sleep(2500);
const secs = (Date.now() - t0) / 1000;
stop = true; stats.SSE.ctl.abort(); stats.WebSocket.sock.close();
const pct = (xs, p) => xs.slice().sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))];
console.log(`${N} sự kiện trong ${secs.toFixed(1)} s`);
console.log('client         nhận   p50     p95     max     request  byte');
for (const [k, s] of Object.entries(stats))
  console.log(`${k.padEnd(14)} ${String(s.lat.length).padStart(4)}  ${String(pct(s.lat, 0.5)).padStart(5)} ms ${String(pct(s.lat, 0.95)).padStart(5)} ms ${String(Math.max(...s.lat)).padStart(5)} ms  ${String(s.requests).padStart(5)}  ${String(s.bytes).padStart(6)}`);
process.exit(0);
