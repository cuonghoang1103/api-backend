// exportTask.js — bài 10.1: xuất lượt đặt ra CSV từ bảng bookings 1.000.000 dòng (PostgreSQL, Chương 3).
// Phần CHẬM thật sự không phải SQL mà là dịch vụ điểm danh của trường: mỗi lô 500 dòng phải hỏi nó một lần.
// Ở đây dịch vụ đó được GIẢ LẬP bằng EXPORT_BATCH_MS (mặc định 250 ms/lô) để bài chạy lại được trên máy bạn.
import { pool } from './pg.js';
import { config } from './config.js';

export { pool };                                                   // Chương 12: dùng chung MỘT pool của instance (src/pg.js)
// Chương 12: bảng bookings thật (migration 001) có khoá số là `seq` (id là chuỗi 'bk_42'); bảng giả 1 triệu dòng của Chương 3 dùng `id`
const N = config.store === 'pg' ? 'seq' : 'id';
const BATCH = 500;
const BATCH_MS = Number(process.env.EXPORT_BATCH_MS ?? 250);
export class Cancelled extends Error { constructor() { super('CANCELLED'); } }

const sleep = (ms, signal) => new Promise((ok, fail) => {
  const t = setTimeout(ok, ms);
  signal?.addEventListener('abort', () => { clearTimeout(t); fail(new Cancelled()); }, { once: true });
});
// "Dịch vụ điểm danh" giả: trả về có/không cho từng lượt đặt (xác định theo id để kết quả tái lập được)
async function attendance(rows, signal) {
  await sleep(BATCH_MS, signal);
  // Bài 10.2 — ATTENDANCE_DOWN=1 (đặt cho WORKER): dịch vụ điểm danh sập ⇒ việc hỏng, BullMQ thử lại theo backoff
  if (process.env.ATTENDANCE_DOWN === '1') throw new Error('ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời');
  return rows.map((r) => r.status !== 'CANCELLED' && Number(r.n) % 7 !== 0);
}

// labId bỏ trống ⇒ cả trường. Trang theo keyset (start_at, id) — Chương 3 — để lô thứ 400 nhanh như lô đầu.
export async function exportBookings({ labId, from, to }, { progress = async () => {}, signal } = {}) {
  const where = `start_at >= $1 AND start_at < $2${labId ? ' AND lab_id = $3' : ''}`;
  const args = labId ? [from, to, labId] : [from, to];
  const { rows: [{ n }] } = await pool.query(`SELECT count(*)::int AS n FROM bookings WHERE ${where}`, args);
  const lines = ['id,labId,startAt,status,attended'];
  let after = ['-infinity', 0], done = 0;
  await progress(0, n);
  for (;;) {
    if (signal?.aborted) throw new Cancelled();
    const k = args.length;
    const { rows } = await pool.query(
      `SELECT ${N} AS n, lab_id, start_at, status FROM bookings WHERE ${where} AND (start_at, ${N}) > ($${k + 1}::timestamptz, $${k + 2}::bigint)
       ORDER BY start_at, ${N} LIMIT ${BATCH}`, [...args, ...after]);
    if (rows.length === 0) break;
    const att = await attendance(rows, signal);
    rows.forEach((r, i) => lines.push(`bk_${r.n},${r.lab_id},${r.start_at.toISOString()},${r.status},${att[i]}`));
    done += rows.length;
    after = [rows.at(-1).start_at, rows.at(-1).n];
    await progress(done, n);
  }
  return lines.join('\n') + '\n';
}
