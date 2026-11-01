// perf/pool.mjs — bài 12.3: pool kết nối là một HÀNG ĐỢI. 20 truy vấn mất 100 ms mỗi cái, pool chỉ có MAX kết nối:
// ai không mượn được kết nối trong WAIT ms thì lỗi ngay (thay vì treo vô hạn — mặc định của node-postgres là chờ mãi).
//   MAX=2 WAIT=500 node perf/pool.mjs      MAX=10 WAIT=500 node perf/pool.mjs      MAX=2 WAIT=0 node perf/pool.mjs
import pg from 'pg';

const MAX = Number(process.env.MAX ?? 2), WAIT = Number(process.env.WAIT ?? 500), N = Number(process.env.N ?? 20);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL ?? 'postgres://labflow@localhost:55432/labflow_app',
  max: MAX, connectionTimeoutMillis: WAIT });
await Promise.all(Array.from({ length: MAX }, () => pool.query('SELECT 1')));          // mở sẵn MAX kết nối (bỏ chi phí bắt tay)
const t0 = performance.now();
const res = await Promise.all(Array.from({ length: N }, async () => {
  const a = performance.now();
  try { await pool.query('SELECT pg_sleep(0.1)'); return { ok: true, ms: performance.now() - a }; }
  catch (e) { return { ok: false, ms: performance.now() - a, err: e.message }; }
}));
const ok = res.filter((r) => r.ok).map((r) => r.ms).sort((a, b) => a - b);
const bad = res.filter((r) => !r.ok);
console.log(`max=${MAX} chờ tối đa ${WAIT || '∞'} ms · ${N} truy vấn 100 ms: xong ${ok.length} (nhanh nhất ${ok[0]?.toFixed(0)} ms, chậm nhất ${ok.at(-1)?.toFixed(0)} ms)` +
  ` · lỗi ${bad.length}${bad.length ? ` sau ~${bad[0].ms.toFixed(0)} ms: "${bad[0].err}"` : ''} · tổng ${(performance.now() - t0).toFixed(0)} ms`);
await pool.end();
