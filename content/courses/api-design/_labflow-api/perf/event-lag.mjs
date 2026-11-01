// perf/event-lag.mjs — bài 12.5: từ lúc API trả 201 tới lúc sự kiện "created" tới tay client SSE mất bao lâu?
// Đường đi: INSERT bookings + outbox (một transaction) ⇒ relay (worker) ⇒ XADD Redis Stream ⇒ instance đang giữ SSE ⇒ client.
//   N=20 node perf/event-lag.mjs      (BASE=http://localhost:8180)
import { openSSE } from './sse-client.mjs';

const BASE = process.env.BASE ?? 'http://localhost:8180';
const N = Number(process.env.N ?? 20);
const H = (t) => ({ authorization: `Bearer ${t}`, 'content-type': 'application/json' });
const token = (await (await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: H(''),
  body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) })).json()).accessToken;
const { ticket } = await (await fetch(`${BASE}/v2/realtime/tickets`, { method: 'POST', headers: H(token) })).json();
const seen = new Map(), ctl = new AbortController();
openSSE(`${BASE}/v2/events/stream?ticket=${ticket}`, { signal: ctl.signal,
  onEvent: (m) => { if (m.data) { const e = JSON.parse(m.data); if (e.type.endsWith('created.v1')) seen.set(e.subject, performance.now()); } } }).catch(() => {});
await new Promise((r) => setTimeout(r, 300));
const lags = [];
for (let i = 0; i < N; i++) {
  const day = String(1 + i).padStart(2, '0');
  const r = await fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: H(token),
    body: JSON.stringify({ labId: 'lab_3', period: { start: `2029-03-${day}T01:00:00Z`, end: `2029-03-${day}T02:00:00Z` } }) });
  const t201 = performance.now();
  const { id } = await r.json();
  while (!seen.has(id) && performance.now() - t201 < 5000) await new Promise((ok) => setTimeout(ok, 1));
  lags.push(seen.has(id) ? seen.get(id) - t201 : Infinity);
  await new Promise((ok) => setTimeout(ok, 50));
}
ctl.abort();
lags.sort((a, b) => a - b);
const f = (x) => (Number.isFinite(x) ? `${x.toFixed(1)} ms` : 'mất');
console.log(`${N} lượt đặt: từ 201 tới sự kiện SSE — p50 ${f(lags[N >> 1])} · p90 ${f(lags[Math.floor(N * 0.9)])} · chậm nhất ${f(lags.at(-1))} · nhanh nhất ${f(lags[0])}`);
