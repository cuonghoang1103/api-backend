// perf/notify-cost.mjs — bài 12.5: gửi email NGAY trong request đặt phòng (LABFLOW_NOTIFY=sync) hay qua hàng đợi (mặc định)?
// Đo độ trễ POST /v2/bookings của N lượt liên tiếp và đếm mã trả về. Nhà cung cấp email giả: 300 ms/thư, MAIL_DOWN_FILE ⇒ sập.
//   N=20 node perf/notify-cost.mjs
const BASE = process.env.BASE ?? 'http://localhost:8180';
const N = Number(process.env.N ?? 20);
const START = Number(process.env.START_DAY ?? 1);
const H = (t) => ({ authorization: `Bearer ${t}`, 'content-type': 'application/json' });
const token = (await (await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: H(''),
  body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) })).json()).accessToken;
const lat = [], codes = {};
for (let i = 0; i < N; i++) {
  const d = START + i, day = `2029-04-${String(1 + (d % 28)).padStart(2, '0')}T${String(1 + Math.floor(d / 28) * 2).padStart(2, '0')}`;
  const t0 = performance.now();
  const r = await fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: H(token),
    body: JSON.stringify({ labId: 'lab_1', period: { start: `${day}:00:00Z`, end: `${day}:30:00Z` } }) });
  const b = await r.json();
  lat.push(performance.now() - t0);
  const k = r.status < 300 ? String(r.status) : `${r.status} ${b.code}`;
  codes[k] = (codes[k] ?? 0) + 1;
}
lat.sort((a, b) => a - b);
console.log(`${N} lượt POST /v2/bookings: p50 ${lat[N >> 1].toFixed(1)} ms · chậm nhất ${lat.at(-1).toFixed(1)} ms · mã ${Object.entries(codes).map(([k, v]) => `${k} ×${v}`).join(', ')}`);
