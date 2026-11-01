// perf/shed.mjs — bài 8.4: CONC người cùng bấm "Đăng nhập" liên tục trong SECONDS giây; mỗi người chờ tối đa TIMEOUT ms.
// Đếm theo KẾT CỤC người dùng thấy: có câu trả lời thật (401/200), bị từ chối nhanh (503), hay bỏ cuộc vì quá lâu (timeout).
const BASE = process.env.BASE ?? 'http://localhost:4000';
const CONC = Number(process.env.CONC ?? 100), SECONDS = Number(process.env.SECONDS ?? 10), TIMEOUT = Number(process.env.TIMEOUT ?? 1000);
const pct = (a, p) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const out = { answered: [], shed: [], timeout: 0 };
let n = 0;
const end = Date.now() + SECONDS * 1000;
async function user() {
  while (Date.now() < end) {
    const a = performance.now();
    try {
      const r = await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: `sv${n++}@student.labflow.example`, password: 'sai-mat-khau' }), signal: AbortSignal.timeout(TIMEOUT) });
      await r.text();
      const ms = performance.now() - a;
      if (r.status === 503) { out.shed.push(ms); await new Promise((ok) => setTimeout(ok, 1000 * Number(r.headers.get('retry-after') ?? 1))); }
      else out.answered.push(ms);
    } catch { out.timeout++; }                                    // người dùng bỏ cuộc — nhưng server VẪN tính scrypt cho request này
  }
}
await Promise.all(Array.from({ length: CONC }, user));
const f = (x) => (Number.isNaN(x) ? '—' : `${x.toFixed(0)} ms`);
console.log(`${CONC} người, ${SECONDS} s, chờ tối đa ${TIMEOUT} ms`);
console.log(`  có câu trả lời : ${String(out.answered.length).padStart(5)}  (${(out.answered.length / SECONDS).toFixed(1)}/s) · p50 ${f(pct(out.answered, 0.5))} · p99 ${f(pct(out.answered, 0.99))}`);
console.log(`  bị từ chối 503 : ${String(out.shed.length).padStart(5)}  · p50 ${f(pct(out.shed, 0.5))} (rồi chờ Retry-After)`);
console.log(`  bỏ cuộc (timeout): ${String(out.timeout).padStart(3)}  ⇒ server vẫn làm ${out.timeout} lần scrypt không ai nhận`);
// Tải đã DỪNG. Một người đăng nhập ngay lúc này phải chờ bao lâu? (server còn nợ bao nhiêu việc của người đã bỏ đi)
const a = performance.now();
const r = await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) });
console.log(`  tải đã dừng — cô Lan đăng nhập: ${r.status} sau ${(performance.now() - a).toFixed(0)} ms`);
