// perf/mixed.mjs — bài 8.2: "giờ mở đăng ký" — nhiều người đăng nhập CÙNG LÚC với người đang xem danh sách phòng
// Tải: autocannon bắn POST /v2/auth/login (mỗi request một email khác ⇒ không chạm giới hạn đăng nhập).
// Đo song song: một người dùng khác cứ 20 ms gọi GET /v2/labs — độ trễ của họ có bị kéo theo không?
import autocannon from 'autocannon';

const BASE = 'http://localhost:4000';
const SECONDS = Number(process.env.SECONDS ?? 10);
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };

let n = 0;
const LOAD = process.env.LOAD !== '0';                   // LOAD=0: chỉ đo người xem phòng, không có tải đăng nhập
const load = !LOAD ? Promise.resolve(null) : autocannon({
  url: `${BASE}/v2/auth/login`, connections: Number(process.env.CONN ?? 10), duration: SECONDS,
  requests: [{ method: 'POST', headers: { 'content-type': 'application/json' },
    setupRequest: (r) => ({ ...r, body: JSON.stringify({ email: `sv${n++}@student.labflow.example`, password: 'sai-mat-khau' }) }) }],
});

const lat = [];
const codes = {};
const end = Date.now() + SECONDS * 1000;
const probe = (async () => {
  while (Date.now() < end) {
    const a = performance.now();
    const res = await fetch(`${BASE}/v2/labs`);
    await res.text();
    codes[res.status] = (codes[res.status] ?? 0) + 1;
    lat.push(performance.now() - a);
    await new Promise((r) => setTimeout(r, 20));
  }
})();

const [r] = await Promise.all([load, probe]);
if (r) console.log(`login: ${r.requests.average.toFixed(1)} req/s · p50 ${r.latency.p50} ms · p99 ${r.latency.p99} ms · non-2xx ${r.non2xx} (email lạ ⇒ 401, vẫn tốn đủ một lần scrypt)`);
console.log(`GET /v2/labs trong lúc đó: ${lat.length} lần · p50 ${pct(lat, 0.5).toFixed(1)} ms · p99 ${pct(lat, 0.99).toFixed(1)} ms · max ${Math.max(...lat).toFixed(1)} ms · mã ${JSON.stringify(codes)}`);
