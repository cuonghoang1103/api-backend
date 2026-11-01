// seed-pg.js — bài 12.2: nạp dữ liệu mẫu CỐ ĐỊNH của khoá (3 người dùng, 4 phòng, 3 thiết bị + SEED_BOOKINGS / SEED_ISSUES)
// vào CSDL ĐÃ migrate. Chạy lại không sao: dòng đã có thì bỏ qua.
//   node src/seed-pg.js              nạp
//   node src/seed-pg.js --reset      XOÁ SẠCH rồi migrate + nạp lại — CHỈ chạy được trên CSDL tên kết thúc bằng _test
import pg from 'pg';
import { config } from './config.js';
import { migrate } from './migrate.js';
import { labs, devices, users, bookings, issues } from './db.js';
import { fold } from './text.js';

const url = config.databaseUrl;
const dbName = new URL(url).pathname.slice(1);
const db = new pg.Client({ connectionString: url, application_name: 'labflow-seed' });
await db.connect();
if (process.argv.includes('--reset')) {
  if (!dbName.endsWith('_test')) { console.error(`từ chối --reset trên "${dbName}": chỉ CSDL *_test mới được xoá sạch`); process.exit(1); }
  await db.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await migrate({ url, log: () => {} });
}
const t0 = performance.now();
for (const u of users) await db.query(`INSERT INTO users (id, name, role, email, password_hash, failed_logins, staff_note)
  VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`, [u.id, u.name, u.role, u.email, u.passwordHash, u.failedLogins, u.staffNote]);
for (const l of labs) await db.query(`INSERT INTO labs (id, code, name, building, capacity, retired_at) VALUES ($1, $2, $3, $4, $5, $6)
  ON CONFLICT DO NOTHING`, [l.id, l.code, l.name, l.building, l.capacity, l.retiredAt ?? null]);
for (const d of devices) await db.query(`INSERT INTO devices (id, lab_id, name, type, serial_no, status, note) VALUES ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT DO NOTHING`, [d.id, d.labId, d.name, d.type, d.serialNo, d.status, d.note ?? null]);
// Bộ đếm id bắt đầu NGAY SAU dòng mẫu lớn nhất (false = "giá trị này chưa dùng") ⇒ thiết bị kế tiếp là dev_4, lượt đặt đầu tiên là bk_1
await db.query("SELECT setval('devices_seq', coalesce((SELECT max(substr(id, 5)::int) FROM devices), 0) + 1, false)");
// Lượt đặt: chèn theo lô 5.000 dòng bằng unnest (100.000 dòng ⇒ 20 câu lệnh, không phải 100.000)
for (let i = 0; i < bookings.length; i += 5000) {
  const part = bookings.slice(i, i + 5000);
  const col = (f) => part.map(f);
  await db.query(`INSERT INTO bookings (seq, lab_id, user_id, start_at, end_at, purpose, status, created_at, cancelled_at)
    SELECT * FROM unnest($1::bigint[], $2::text[], $3::text[], $4::timestamptz[], $5::timestamptz[], $6::text[], $7::text[], $8::timestamptz[], $9::timestamptz[])
    ON CONFLICT DO NOTHING`, [col((b) => Number(b.id.slice(3))), col((b) => b.labId), col((b) => b.userId), col((b) => b.startAt), col((b) => b.endAt),
    col((b) => b.purpose), col((b) => b.status), col((b) => b.createdAt), col((b) => b.cancelledAt ?? null)]);
}
await db.query("SELECT setval(pg_get_serial_sequence('bookings', 'seq'), coalesce((SELECT max(seq) FROM bookings), 0) + 1, false)");
const hasIssues = (await db.query("SELECT to_regclass('issues') IS NOT NULL AS ok")).rows[0].ok;   // Lab 12: bảng có sau 004_issues.sql
if (hasIssues) {
  for (const i of issues) await db.query(`INSERT INTO issues (seq, device_id, reported_by, title, title_key, severity, description, status, created_at, resolved_at, resolution)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`, [Number(i.id.slice(4)), i.deviceId, i.reportedBy, i.title, fold(i.title),
    i.severity, i.description ?? null, i.status, i.createdAt, i.resolvedAt ?? null, i.resolution ?? null]);
  await db.query("SELECT setval(pg_get_serial_sequence('issues', 'seq'), coalesce((SELECT max(seq) FROM issues), 0) + 1, false)");
}
const { rows: [n] } = await db.query(`SELECT (SELECT count(*) FROM users) AS users, (SELECT count(*) FROM labs) AS labs,
  (SELECT count(*) FROM devices) AS devices, (SELECT count(*) FROM bookings) AS bookings${hasIssues ? ', (SELECT count(*) FROM issues) AS issues' : ''}`);
console.log(`seed ${dbName}: ${Object.entries(n).map(([k, v]) => `${k} ${v}`).join(' · ')} (${Math.round(performance.now() - t0)} ms)`);
await db.end();
