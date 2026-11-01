// reportTask.js — Lab 10 (LỜI GIẢI): báo cáo dùng phòng của CẢ TRƯỜNG (50 phòng, bảng 1 triệu dòng) theo ngày.
// Mỗi ngày: một truy vấn gộp + một lần hỏi dịch vụ điểm danh (giả lập EXPORT_BATCH_MS) ⇒ 92 ngày ~ 30 s: phải chạy nền.
import { pool, Cancelled } from './exportTask.js';

const BATCH_MS = Number(process.env.EXPORT_BATCH_MS ?? 250);
const sleep = (ms, signal) => new Promise((ok, fail) => {
  const t = setTimeout(ok, ms);
  signal?.addEventListener('abort', () => { clearTimeout(t); fail(new Cancelled()); }, { once: true });
});

export async function usageReport({ from, days }, { progress = async () => {}, signal } = {}) {
  const rows = [];
  await progress(0, days);
  for (let d = 0; d < days; d++) {
    if (signal?.aborted) throw new Cancelled();
    const day = new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10);
    const { rows: r } = await pool.query(`SELECT lab_id, count(*)::int AS n FROM bookings
      WHERE start_at >= $1::timestamptz AND start_at < $1::timestamptz + interval '1 day' AND status <> 'CANCELLED'
      GROUP BY lab_id`, [`${day}T00:00:00Z`]);
    await sleep(BATCH_MS, signal);                                 // dịch vụ điểm danh: tỉ lệ có mặt của ngày đó
    const byLab = new Map(r.map((x) => [x.lab_id, x.n]));
    for (let l = 1; l <= 50; l++) {
      const labId = `lab_${l}`, n = byLab.get(labId) ?? 0;
      rows.push({ day, labId, bookings: n, attended: Math.round(n * 0.85) });
    }
    await progress(d + 1, days);
  }
  return JSON.stringify({ from, days, rows });
}
