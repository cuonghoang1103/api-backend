// perf/shards.mjs — bài 9.4: bảng 1.000.000 lượt đặt chia làm HAI phân mảnh theo lab_id (shard0, shard1).
// Đo: phân trang offset vs cursor qua hai mảnh, truy vấn có / không có khoá phân mảnh. Đúng hay sai: so với bảng gốc.
import pg from 'pg';
const db = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 4 });
const SHARDS = ['shard0', 'shard1'];
const shardOf = async (labId) => SHARDS[(await db.query('SELECT abs(hashtext($1)) % 2 AS s', [labId])).rows[0].s];
const ORDER = 'ORDER BY created_at DESC, id DESC';
const newer = (a, b) => (b.created_at - a.created_at) || (b.id > a.id ? 1 : b.id < a.id ? -1 : 0);
const ids = (rows) => rows.map((r) => r.id).join(',');
async function timed(label, fn) {
  const a = performance.now(); const { rows, fetched } = await fn();
  console.log(`${label.padEnd(44)} ${String(fetched).padStart(6)} dòng kéo về · ${(performance.now() - a).toFixed(1).padStart(6)} ms`);
  return rows;
}
const LIMIT = 20, OFFSET = 19980;                                // trang 1000
const truth = (await db.query(`SELECT id, created_at FROM bookings ${ORDER} OFFSET ${OFFSET} LIMIT ${LIMIT}`)).rows;

const wrong = await timed('offset SAI: mỗi mảnh OFFSET 19980 LIMIT 20', async () => {
  const parts = await Promise.all(SHARDS.map((s) => db.query(`SELECT id, created_at FROM ${s}.bookings ${ORDER} OFFSET ${OFFSET} LIMIT ${LIMIT}`)));
  const all = parts.flatMap((p) => p.rows).sort(newer);
  return { rows: all.slice(0, LIMIT), fetched: all.length };
});
console.log(`  ⇒ khớp bảng gốc? ${ids(wrong) === ids(truth) ? 'ĐÚNG' : 'SAI'}`);
const right = await timed('offset ĐÚNG: mỗi mảnh LIMIT 20000, gộp, cắt', async () => {
  const parts = await Promise.all(SHARDS.map((s) => db.query(`SELECT id, created_at FROM ${s}.bookings ${ORDER} LIMIT ${OFFSET + LIMIT}`)));
  const all = parts.flatMap((p) => p.rows).sort(newer);
  return { rows: all.slice(OFFSET, OFFSET + LIMIT), fetched: all.length };
});
console.log(`  ⇒ khớp bảng gốc? ${ids(right) === ids(truth) ? 'ĐÚNG' : 'SAI'}`);
const prev = (await db.query(`SELECT id, created_at FROM bookings ${ORDER} OFFSET ${OFFSET - 1} LIMIT 1`)).rows[0];   // dòng cuối trang 999 = cursor
const cur = await timed('cursor: mỗi mảnh WHERE (…) < cursor LIMIT 20', async () => {
  const parts = await Promise.all(SHARDS.map((s) => db.query(
    `SELECT id, created_at FROM ${s}.bookings WHERE (created_at, id) < ($1, $2) ${ORDER} LIMIT ${LIMIT}`, [prev.created_at, prev.id])));
  const all = parts.flatMap((p) => p.rows).sort(newer);
  return { rows: all.slice(0, LIMIT), fetched: all.length };
});
console.log(`  ⇒ khớp bảng gốc? ${ids(cur) === ids(truth) ? 'ĐÚNG' : 'SAI'}`);

const lab = 'lab_7', s = await shardOf(lab);
await timed(`có khoá phân mảnh: lab ${lab} ⇒ chỉ ${s}`, async () => {
  const r = await db.query(`SELECT id FROM ${s}.bookings WHERE lab_id = $1 AND start_at >= '2027-03-01' AND start_at < '2027-03-08'`, [lab]);
  return { rows: r.rows, fetched: r.rowCount };
});
await timed('không có khoá: user usr_4536 ⇒ hỏi MỌI mảnh', async () => {
  const parts = await Promise.all(SHARDS.map((x) => db.query(`SELECT id FROM ${x}.bookings WHERE user_id = $1`, ['usr_4536'])));
  return { rows: parts.flatMap((p) => p.rows), fetched: parts.reduce((n, p) => n + p.rowCount, 0) };
});
await db.end();
