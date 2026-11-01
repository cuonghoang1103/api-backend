// migrate.js — bài 12.2: chạy các tệp migrations/NNN_ten.sql CHƯA chạy, theo thứ tự, mỗi tệp MỘT transaction.
//   node src/migrate.js            áp mọi migration còn thiếu
//   node src/migrate.js --status   chỉ xem đã/chưa áp
// Luật (giống Prisma/Flyway): tệp đã áp thì KHÔNG được sửa — checksum lệch ⇒ dừng. Muốn đổi schema: viết tệp MỚI.
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import pg from 'pg';
import { config } from './config.js';

const DIR = new URL('../migrations/', import.meta.url);
const LOCK = 727012;                                   // khoá advisory: hai instance cùng khởi động ⇒ chỉ MỘT chạy migration

export async function migrate({ url = config.databaseUrl, statusOnly = false, log = console.log } = {}) {
  const db = new pg.Client({ connectionString: url, application_name: 'labflow-migrate' });
  await db.connect();
  try {
    const t0 = performance.now();
    await db.query('SELECT pg_advisory_lock($1)', [LOCK]);
    const waited = performance.now() - t0;
    if (waited > 50) log(`chờ khoá migration ${waited.toFixed(0)} ms (instance khác đang chạy)`);
    await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now(), ms int NOT NULL)`);
    const done = new Map((await db.query('SELECT version, checksum FROM schema_migrations')).rows.map((r) => [r.version, r.checksum]));
    const files = readdirSync(DIR).filter((f) => /^\d{3}_[a-z0-9_]+\.sql$/.test(f)).sort();
    let applied = 0;
    for (const f of files) {
      const sql = readFileSync(new URL(f, DIR), 'utf8');
      const sum = createHash('sha256').update(sql).digest('hex').slice(0, 12);
      if (done.has(f)) {
        if (done.get(f) !== sum) throw new Error(`${f} đã áp nhưng nội dung ĐÃ BỊ SỬA (checksum ${done.get(f)} ⇒ ${sum}). Đừng sửa migration đã chạy — viết tệp mới.`);
        if (statusOnly) log(`  đã áp   ${f}`);
        continue;
      }
      if (statusOnly) { log(`  CHƯA áp ${f}`); continue; }
      const a = performance.now();
      // Bài 12.2: CREATE INDEX CONCURRENTLY không chạy được trong transaction ⇒ tệp mở đầu bằng "-- migrate:no-transaction"
      // chạy từng câu riêng (không còn "tất cả hoặc không gì" — nên mỗi tệp loại này chỉ chứa MỘT câu lệnh)
      const noTx = /^-- migrate:no-transaction/m.test(sql);
      try {
        if (!noTx) await db.query('BEGIN');
        await db.query(sql);
        const ms = Math.round(performance.now() - a);
        await db.query('INSERT INTO schema_migrations (version, checksum, ms) VALUES ($1, $2, $3)', [f, sum, ms]);
        if (!noTx) await db.query('COMMIT');
        log(`  áp ${f} (${ms} ms)`);
        applied++;
      } catch (e) {
        if (!noTx) await db.query('ROLLBACK');
        throw new Error(`${f} hỏng${noTx ? ' (không transaction — kiểm phần đã chạy!)' : ', đã ROLLBACK cả tệp'}: ${e.message}`);
      }
    }
    if (!statusOnly) log(applied ? `xong: áp ${applied} migration` : 'không có migration mới');
    return applied;
  } finally {
    await db.query('SELECT pg_advisory_unlock($1)', [LOCK]).catch(() => {});
    await db.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrate({ statusOnly: process.argv.includes('--status') }).catch((e) => { console.error(`migration DỪNG: ${e.message}`); process.exit(1); });
}
