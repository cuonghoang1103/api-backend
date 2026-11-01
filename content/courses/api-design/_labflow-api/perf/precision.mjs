// perf/precision.mjs — bài 12.1: vì sao cột thời gian của LabFlow là timestamptz(3) chứ không phải timestamptz.
// PostgreSQL giữ tới MICRO giây; JavaScript Date (và chuỗi ISO trong con trỏ phân trang) chỉ giữ MILI giây.
// Phân trang keyset theo (created_at, seq) mà con trỏ mất 3 chữ số ⇒ dòng cùng mili giây với mép trang bị bỏ qua.
// node perf/precision.mjs      (schema riêng "prec" trong DATABASE_URL — bị XOÁ và dựng lại mỗi lần chạy)
import pg from 'pg';

const db = new pg.Client(process.env.DATABASE_URL ?? 'postgres://labflow@localhost:55432/labflow_app');
await db.connect();

async function run(type, fill) {
  await db.query(`DROP SCHEMA IF EXISTS prec CASCADE; CREATE SCHEMA prec;
    CREATE TABLE prec.t (seq bigint GENERATED ALWAYS AS IDENTITY, created_at ${type} NOT NULL DEFAULT clock_timestamp())`);
  await fill();
  const total = (await db.query('SELECT count(*)::int AS n FROM prec.t')).rows[0].n;
  let seen = 0, pages = 0, cursor = null;
  for (;;) {                                                     // đúng câu SQL của store/pg.js: mới nhất trước, 100 dòng/trang
    const { rows } = await db.query(`SELECT seq, created_at FROM prec.t
      ${cursor ? 'WHERE (created_at, seq) < ($1::timestamptz, $2)' : ''} ORDER BY created_at DESC, seq DESC LIMIT 100`,
    cursor ? [cursor.at, cursor.seq] : []);
    if (!rows.length) break;
    seen += rows.length; pages++;
    const last = rows.at(-1);
    cursor = { at: last.created_at.toISOString(), seq: last.seq };   // chuỗi ISO như trong con trỏ base64 của API (mili giây)
  }
  return { total, seen, pages };
}

const oneTx = () => db.query('INSERT INTO prec.t (created_at) SELECT now() FROM generate_series(1, 1000)');   // now() = giờ BẮT ĐẦU transaction
const loop = async () => { for (let i = 0; i < 1000; i++) await db.query('INSERT INTO prec.t DEFAULT VALUES'); };   // mỗi dòng một câu lệnh
for (const [label, fill] of [['1.000 dòng trong MỘT câu INSERT (nhập lô, seed)', oneTx], ['1.000 câu INSERT liên tiếp', loop]]) {
  for (const type of ['timestamptz', 'timestamptz(3)']) {
    const r = await run(type, fill);
    console.log(`${label.padEnd(46)} ${type.padEnd(15)} có ${r.total} · đi hết các trang thấy ${String(r.seen).padStart(4)} (${r.pages} trang)${r.seen < r.total ? `  ⇐ SÓT ${r.total - r.seen}` : ''}`);
  }
}
await db.query('DROP SCHEMA prec CASCADE');
await db.end();
