// race.mjs — bài 11.4: 50 sinh viên cùng bấm đặt lab_1 14:00–16:00 trong CÙNG một khoảnh khắc. Bao nhiêu người "thành công"?
// node interview/booking/race.mjs naive|lock|serializable|constraint|holds      (PostgreSQL 18 ở PGURL, schema riêng "iv")
import pg from 'pg';

const URL = process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow';
const N = Number(process.env.N ?? 50);
const SLOT = '[2026-11-20 14:00+07, 2026-11-20 16:00+07)';
const pool = new pg.Pool({ connectionString: URL, max: N + 2 });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function setup() {
  await pool.query(`DROP SCHEMA IF EXISTS iv CASCADE; CREATE SCHEMA iv; CREATE EXTENSION IF NOT EXISTS btree_gist;
    CREATE TABLE iv.labs (id text PRIMARY KEY);
    INSERT INTO iv.labs VALUES ('lab_1');
    CREATE TABLE iv.bookings (id serial PRIMARY KEY, lab_id text NOT NULL REFERENCES iv.labs, slot tstzrange NOT NULL,
      user_id text NOT NULL, status text NOT NULL, hold_expires_at timestamptz,
      CONSTRAINT no_overlap EXCLUDE USING gist (lab_id WITH =, slot WITH &&) WHERE (status IN ('HELD', 'CONFIRMED')) NOT DEFERRABLE);`);
  if (process.argv[2] !== 'constraint' && process.argv[2] !== 'holds') await pool.query('ALTER TABLE iv.bookings DROP CONSTRAINT no_overlap');
}

const overlap = `SELECT 1 FROM iv.bookings WHERE lab_id = $1 AND slot && $2::tstzrange AND status IN ('HELD', 'CONFIRMED')`;
const insert = `INSERT INTO iv.bookings (lab_id, slot, user_id, status) VALUES ($1, $2, $3, 'CONFIRMED') RETURNING id`;

// mỗi cách là một "handler POST /bookings" — trả 201 hoặc 409
const MODES = {
  async naive(c, user) {                                           // kiểm rồi mới ghi, hai câu lệnh riêng
    await c.query('BEGIN');
    const { rowCount } = await c.query(overlap, ['lab_1', SLOT]);
    if (rowCount) { await c.query('ROLLBACK'); return 409; }
    await pause(5);                                                 // 5 ms việc khác của handler (kiểm quyền, giới hạn 3 lượt…)
    await c.query(insert, ['lab_1', SLOT, user]);
    await c.query('COMMIT'); return 201;
  },
  async lock(c, user) {                                            // khoá dòng của phòng trước, mọi người xếp hàng ở đây
    await c.query('BEGIN');
    await c.query('SELECT 1 FROM iv.labs WHERE id = $1 FOR UPDATE', ['lab_1']);
    const { rowCount } = await c.query(overlap, ['lab_1', SLOT]);
    if (rowCount) { await c.query('ROLLBACK'); return 409; }
    await pause(5);
    await c.query(insert, ['lab_1', SLOT, user]);
    await c.query('COMMIT'); return 201;
  },
  async serializable(c, user) {                                    // để PostgreSQL phát hiện xung đột, kẻ thua nhận lỗi 40001
    try {
      await c.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
      const { rowCount } = await c.query(overlap, ['lab_1', SLOT]);
      if (rowCount) { await c.query('ROLLBACK'); return 409; }
      await pause(5);
      await c.query(insert, ['lab_1', SLOT, user]);
      await c.query('COMMIT'); return 201;
    } catch (e) { await c.query('ROLLBACK'); if (e.code === '40001') return '40001'; throw e; }
  },
  async constraint(c, user) {                                      // chỉ một câu INSERT; luật nằm trong CSDL
    try { await pause(5); await c.query(insert, ['lab_1', SLOT, user]); return 201; }
    catch (e) { if (e.code === '23P01') return 409; throw e; }      // exclusion_violation ⇒ 409 SLOT_TAKEN
  },
};

async function race(mode) {
  await setup();
  const clients = await Promise.all(Array.from({ length: N }, () => pool.connect()));   // mở sẵn 50 kết nối rồi mới "bấm"
  const lat = [];
  const t0 = performance.now();
  const results = await Promise.all(clients.map(async (c, i) => {
    const s = performance.now();
    const r = await MODES[mode](c, `usr_${i + 1}`);
    lat.push(performance.now() - s); c.release(); return r;
  }));
  const total = performance.now() - t0;
  const rows = (await pool.query("SELECT count(*)::int AS n FROM iv.bookings WHERE status = 'CONFIRMED'")).rows[0].n;
  const count = (v) => results.filter((r) => r === v).length;
  lat.sort((a, b) => a - b);
  console.log(`${mode.padEnd(12)} 201: ${String(count(201)).padStart(2)}  409: ${String(count(409)).padStart(2)}  40001: ${String(count('40001')).padStart(2)}  ` +
    `lượt đặt trong bảng: ${String(rows).padStart(2)}  p50 ${lat[N >> 1].toFixed(1)} ms  chậm nhất ${lat.at(-1).toFixed(1)} ms  tổng ${total.toFixed(0)} ms`);
}

async function holds() {                                          // giữ chỗ có hạn: bẫy "hết hạn nhưng vẫn chặn"
  await setup();
  const hold = `INSERT INTO iv.bookings (lab_id, slot, user_id, status, hold_expires_at) VALUES ('lab_1', $1, $2, 'HELD', now() + $3::interval) RETURNING id`;
  const a = (await pool.query(hold, [SLOT, 'usr_an', '2 seconds'])).rows[0].id;
  console.log(`An giữ chỗ #${a} (HELD, hết hạn sau 2 s) rồi đi đóng tiền… và quên`);
  await pause(2500);
  try { await pool.query(hold, [SLOT, 'usr_binh', '5 minutes']); console.log('Bình giữ chỗ: được'); }
  catch (e) { console.log(`Bình giữ chỗ sau 2,5 s: ${e.code} ${e.message.split('\n')[0]}`); }
  const c = await pool.connect();                                   // sửa: trong cùng transaction, cho các chỗ giữ đã hết hạn về EXPIRED trước khi chèn
  await c.query('BEGIN');
  const ex = await c.query(`UPDATE iv.bookings SET status = 'EXPIRED' WHERE lab_id = 'lab_1' AND slot && $1::tstzrange AND status = 'HELD' AND hold_expires_at <= now()`, [SLOT]);
  const b = (await c.query(hold, [SLOT, 'usr_binh', '5 minutes'])).rows[0].id;
  await c.query('COMMIT'); c.release();
  console.log(`dọn ${ex.rowCount} chỗ giữ hết hạn trong cùng transaction ⇒ Bình giữ chỗ #${b}: được`);
  const conf = await pool.query(`UPDATE iv.bookings SET status = 'CONFIRMED', hold_expires_at = NULL WHERE id = $1 AND status = 'HELD' AND hold_expires_at > now()`, [a]);
  console.log(`An quay lại xác nhận #${a}: ${conf.rowCount} dòng đổi ⇒ ${conf.rowCount ? '200' : '409 HOLD_EXPIRED'}`);
  const ok = await pool.query(`UPDATE iv.bookings SET status = 'CONFIRMED', hold_expires_at = NULL WHERE id = $1 AND status = 'HELD' AND hold_expires_at > now()`, [b]);
  console.log(`Bình xác nhận #${b}: ${ok.rowCount} dòng đổi ⇒ ${ok.rowCount ? '200 CONFIRMED' : '409'}`);
}

const mode = process.argv[2] ?? 'naive';
if (mode === 'holds') await holds(); else await race(mode);
await pool.end();
