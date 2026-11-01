// perf/report-mixed.mjs — Lab 8: CONC lượt xem báo cáo cùng lúc (cô Lan + các trưởng bộ môn) trong khi sinh viên xem danh sách phòng
import autocannon from 'autocannon';
const BASE = 'http://localhost:4000';
const SECONDS = Number(process.env.SECONDS ?? 10);
const TOKEN = process.env.TOKEN;
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const load = process.env.LOAD === '0' ? Promise.resolve(null) : autocannon({
  url: `${BASE}/v2/reports/usage?from=2026-11-02&days=30`, connections: Number(process.env.CONC ?? 5), duration: SECONDS,
  headers: { authorization: `Bearer ${TOKEN}` },
});
const lat = [], codes = {};
const end = Date.now() + SECONDS * 1000;
const probe = (async () => {
  while (Date.now() < end) {
    const a = performance.now();
    const r = await fetch(`${BASE}/v2/labs`); await r.text();
    codes[r.status] = (codes[r.status] ?? 0) + 1; lat.push(performance.now() - a);
    await new Promise((ok) => setTimeout(ok, 20));
  }
})();
const [r] = await Promise.all([load, probe]);
if (r) console.log(`report: ${r.requests.average.toFixed(1)} req/s · p50 ${r.latency.p50} ms · p99 ${r.latency.p99} ms · 2xx ${r['2xx']} · non-2xx ${r.non2xx}`);
console.log(`GET /v2/labs trong lúc đó: ${lat.length} lần · p50 ${pct(lat, 0.5).toFixed(1)} ms · p99 ${pct(lat, 0.99).toFixed(1)} ms · max ${Math.max(...lat).toFixed(1)} ms · mã ${JSON.stringify(codes)}`);
