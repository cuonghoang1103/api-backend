// perf/write-load.mjs — bài 12.6: tải GHI — POST /v2/bookings liên tục, mỗi request một khung giờ KHÁC nhau (không đụng 409).
// So kho RAM với kho PostgreSQL (transaction + EXCLUDE + outbox + idempotency). Cần LABFLOW_BOOKING_LIMIT=1000000/60 (CHỈ để đo).
//   SECONDS=10 CONN=10 node perf/write-load.mjs        (BASE=http://localhost:4200)
import autocannon from 'autocannon';

const BASE = process.env.BASE ?? 'http://localhost:4200';
const token = (await (await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) })).json()).accessToken;
let n = 0;
const base0 = Date.UTC(2030, 0, 1) + Math.floor(Math.random() * 1000) * 86400000 * 30;   // mỗi lần chạy một vùng thời gian riêng
const r = await autocannon({
  url: `${BASE}/v2/bookings`, connections: Number(process.env.CONN ?? 10), duration: Number(process.env.SECONDS ?? 10),
  requests: [{ method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    setupRequest: (q) => {
      const k = n++, start = base0 + Math.floor(k / 3) * 3600000;   // 3 phòng × mỗi giờ một lượt ⇒ không bao giờ trùng
      return { ...q, body: JSON.stringify({ labId: `lab_${1 + (k % 3)}`, period: { start: new Date(start).toISOString(), end: new Date(start + 3000000).toISOString() } }) };
    } }],
});
console.log(`POST /v2/bookings: ${r.requests.average.toFixed(0)} req/s · p50 ${r.latency.p50} ms · p99 ${r.latency.p99} ms · 2xx ${r['2xx']} · non-2xx ${r.non2xx}`);
