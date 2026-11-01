// perf/idem-replay.mjs — bài 12.4: client nhận 201 rồi gửi lại NGAY (cùng Idempotency-Key) — qua proxy nên thường rơi vào instance KHÁC.
// Lần gửi lại phải được PHÁT LẠI (201 + Idempotent-Replayed), không được 409 "đang xử lý", càng không được tạo lượt thứ hai.
//   N=20 node perf/idem-replay.mjs        (BASE=http://localhost:8180)
const BASE = process.env.BASE ?? 'http://localhost:8180';
const N = Number(process.env.N ?? 20);
const token = (await (await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) })).json()).accessToken;
const out = {};
const run = Date.now() % 100000;
for (let i = 0; i < N; i++) {
  const key = `replay-${run}-${i}`;
  const body = JSON.stringify({ labId: 'lab_2', period: { start: `2028-0${1 + (i % 9)}-${String(1 + Math.floor(i / 9)).padStart(2, '0')}T08:00:00Z`,
    end: `2028-0${1 + (i % 9)}-${String(1 + Math.floor(i / 9)).padStart(2, '0')}T09:00:00Z` } });
  const send = () => fetch(`${BASE}/v2/bookings`, { method: 'POST', body, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'idempotency-key': key } });
  const a = await send();
  const first = await a.json();
  const b = await send();                                         // ngay khi vừa cầm câu trả lời đầu
  const second = await b.json();
  const label = b.status === 201 && b.headers.get('idempotent-replayed') === 'true' && second.id === first.id ? 'phát lại đúng'
    : b.status === 409 ? `409 ${second.code}` : `${b.status} ${second.id ?? second.code}`;
  out[label] = (out[label] ?? 0) + 1;
}
console.log(`${N} lần "nhận 201 rồi gửi lại ngay": ${Object.entries(out).map(([k, v]) => `${k} ×${v}`).join(' · ')}`);
