/**
 * pr-02-4 — Prisma ORM · Chapter 2 · Lesson 2.4 "Native types, and the two that bite" (deck video, 12/11/2026). Bài web: pr-2-4-native-type.
 * Output THẬT (`chay.sh p2-4`, demo/lab/p2/24, CSDL c24, Prisma 6.19.3 · PostgreSQL 16.14): Date 10:00+07 ⇒ cả hai cột ISO 03:00Z; psql phiên
 * UTC: 03:00 | 03:00+00, phiên Asia/Bangkok: noTz 03:00 | withTz 10:00+07 · 200.000 hàng: uuid TEXT 28 MB vs @db.Uuid 17 MB (web: 24/16) ·
 * TEXT nhận 'khong-phai-uuid', UUID từ chối · db push VarChar(20) ⇒ cảnh báo mất dữ liệu + đòi --accept-data-loss · ALTER … VARCHAR(20) ⇒
 * value too long · provider mysql: Inet + String[] ⇒ 2 lỗi validate.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p2/24/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel Event {\n  id     Int      @id @default(autoincrement())\n  name   String\n  noTz   DateTime                     // TIMESTAMP(3)   — Prisma default\n  withTz DateTime @db.Timestamptz(3)  // TIMESTAMPTZ(3) — what you usually want\n}\n\nmodel TextUuid {\n  id String @id @default(uuid())           // TEXT — 36 characters\n}\n\nmodel NativeUuid {\n  id String @id @default(uuid()) @db.Uuid  // UUID — 16 bytes\n}\n\nmodel Post {\n  id    Int    @id @default(autoincrement())\n  title String\n\n  @@map(\"posts\")\n}\n",
 "demo/out/p2-4/gio.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c24 npx tsx p2/24/gio.mts\nnoTz  : 2026-08-23T03:00:00.000Z\nwithTz: 2026-08-23T03:00:00.000Z\n",
 "demo/lab/p2/24/gio.mts": "import { PrismaClient } from './gen/index.js';\nconst prisma = new PrismaClient();\nconst t = new Date('2026-08-23T10:00:00+07:00');   // 03:00 UTC\nawait prisma.event.create({ data: { name: 'Meeting', noTz: t, withTz: t } });\nconst e = await prisma.event.findFirst();\nconsole.log('noTz  :', e!.noTz.toISOString());\nconsole.log('withTz:', e!.withTz.toISOString());\nawait prisma.$disconnect();\n",
 "demo/out/p2-4/gio-psql.txt": "$ docker exec prisma-pg psql -U student -d c24 -c \"SET TIME ZONE 'UTC';\" -c 'SELECT \"noTz\", \"withTz\" FROM \"Event\";' -c \"SET TIME ZONE 'Asia/Bangkok';\" -c 'SELECT \"noTz\", \"withTz\" FROM \"Event\";'\nSET\n        noTz         |         withTz         \n---------------------+------------------------\n 2026-08-23 03:00:00 | 2026-08-23 03:00:00+00\n(1 row)\n\nSET\n        noTz         |         withTz         \n---------------------+------------------------\n 2026-08-23 03:00:00 | 2026-08-23 10:00:00+07\n(1 row)\n\n",
 "demo/out/p2-4/uuid.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c24 npx tsx p2/24/uuid.mts\nrows: 200000 200000\n",
 "demo/out/p2-4/uuid-size.txt": "$ docker exec prisma-pg psql -U student -d c24 -c \"SELECT pg_size_pretty(pg_total_relation_size('\\\"TextUuid\\\"')) AS text_uuid, pg_size_pretty(pg_total_relation_size('\\\"NativeUuid\\\"')) AS native_uuid;\"\n text_uuid | native_uuid \n-----------+-------------\n 28 MB     | 17 MB\n(1 row)\n\n",
 "demo/out/p2-4/uuid-sai.txt": "$ docker exec prisma-pg psql -U student -d c24 -c \"INSERT INTO \\\"TextUuid\\\" VALUES ('khong-phai-uuid');\" -c \"INSERT INTO \\\"NativeUuid\\\" VALUES ('khong-phai-uuid');\"\nINSERT 0 1\nERROR:  invalid input syntax for type uuid: \"khong-phai-uuid\"\nLINE 1: INSERT INTO \"NativeUuid\" VALUES ('khong-phai-uuid');\n                                         ^\n[exit 1]\n",
 "demo/out/p2-4/hep-push.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c24 npx prisma db push --schema p2/24/hep.prisma --skip-generate < /dev/null 2>&1 | grep -vE '^\\s*$|Environment|schema loaded|Datasource'\n⚠️  There might be data loss when applying the changes:\n  • You are about to alter the column `title` on the `posts` table, which contains 2 non-null values. The data in that column will be cast from `Text` to `VarChar(20)`.\nError: Use the --accept-data-loss flag to ignore the data loss warnings like prisma db push --accept-data-loss\n",
 "demo/out/p2-4/hep-sql.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c24 npx prisma migrate diff --from-schema-datasource p2/24/schema.prisma --to-schema-datamodel p2/24/hep.prisma --script | grep -v '^$'\n-- AlterTable\nALTER TABLE \"posts\" ALTER COLUMN \"title\" SET DATA TYPE VARCHAR(20);\n",
 "demo/out/p2-4/hep-chay.txt": "$ docker exec prisma-pg psql -U student -d c24 -c 'ALTER TABLE \"posts\" ALTER COLUMN \"title\" SET DATA TYPE VARCHAR(20);'\nERROR:  value too long for type character varying(20)\n[exit 1]\n",
 "demo/lab/p2/24/mysql.prisma": "datasource db {\n  provider = \"mysql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// This validates on PostgreSQL and fails immediately on MySQL\nmodel X {\n  id   Int      @id\n  ip   String   @db.Inet\n  tags String[]\n}\n",
 "demo/out/p2-4/mysql.txt": "$ DATABASE_URL=mysql://x@localhost/x npx prisma validate --schema p2/24/mysql.prisma 2>&1 | grep -vE '^\\s*$|Environment|schema loaded|Context|CLI Version'\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Native type Inet is not supported for mysql connector.\n  -->  p2/24/mysql.prisma:9\n   | \n 8 |   id   Int      @id\n 9 |   ip   String   @db.Inet\n   | \nerror: Field \"tags\" in model \"X\" can't be a list. The current connector does not support lists of primitive types.\n  -->  p2/24/mysql.prisma:10\n   | \n 9 |   ip   String   @db.Inet\n10 |   tags String[]\n11 | }\n   | \nValidation Error Count: 2\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-02-4', code: 'PR 2.4', title: 'Native types, and the two that bite', sub: 'Chapter 2 · Lesson 2.4' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p2-4/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p2/24/${t}`, 'utf8').replace(/\n+$/, '');
const model = (f, ten) => SRC(f).match(new RegExp(`model ${ten} \\{[\\s\\S]*?\\n\\}`))[0];
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ docker exec prisma-pg psql -U student -d c24 /gm, '$ psql ')
  .split('\n').filter((l) => !/^\(\d+ rows?\)/.test(l.trim())).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — The schema language', bai: '2.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 2 · Lesson 2.4', t: 'Native types,<br>and the two that bite', sub: '@db.* picks the exact SQL type — the timestamp and the UUID are where it matters' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The <code>@db.*</code> table for PostgreSQL</li>
    <li>Choosing a DateTime type: moment, calendar date, or clock reading</li>
    <li>Trap 1: <code>Timestamp</code> versus <code>Timestamptz</code> — two sessions, one row, run for real</li>
    <li>Trap 2: a UUID stored as text — 200,000 rows measured</li>
    <li>Narrowing a column that has data, and types that bind you to one database</li></ul>` },
  /* 3 */ { t: 'The PostgreSQL @db table', body: tbl(['Scalar', '@db options (default first)'], [
      ['String', '<code>Text</code> · <code>VarChar(n)</code> · <code>Char(n)</code> · <code>Uuid</code> · <code>Citext</code> · <code>Inet</code> · <code>Xml</code> · <code>Bit(n)</code> · <code>Money</code>'],
      ['Int · BigInt', '<code>Integer</code> · <code>SmallInt</code> (2 bytes) · <code>Oid</code> · <code>BigInt</code> (8 bytes)'],
      ['Float', '<code>DoublePrecision</code> (8 bytes) · <code>Real</code> (4 bytes, ~6 digits)'],
      ['Decimal', '<code>Decimal(p, s)</code> — without it, <code>DECIMAL(65,30)</code>'],
      ['DateTime', '<code>Timestamp(n)</code> (no zone!) · <code>Timestamptz(n)</code> · <code>Date</code> · <code>Time(n)</code> · <code>Timetz(n)</code>'],
      ['Json · Bytes', '<code>JsonB</code> (binary, indexable) · <code>Json</code> (raw text) · <code>ByteA</code>'],
    ]) + box('@db changes the column, not the TypeScript', 'A <code>@db.Date</code> is still a <code>Date</code> in your code and a <code>@db.Uuid</code> is still a <code>string</code>. Only the database — and what it accepts — changes.', 'lam') },
  /* 4 */ { t: 'Choosing a DateTime type, in one pass', body: cards([
      ['⏱️ A moment?', '→ <code>@db.Timestamptz(3)</code>. Created-at, published-at, an event start. The instant is the same everywhere; only its display differs. Most of your columns.'],
      ['📅 A calendar date?', '→ <code>@db.Date</code>. A birthday, an invoice date. No time, no zone — as a timestamp it goes off by a day for users west of you.'],
      ['🕘 A clock reading?', '→ <code>@db.Time(3)</code>. "Opens at 09:00", a recurring alarm. A time of day with no date.'],
      ['❓ None of these?', 'Then plain <code>DateTime</code> is a bug: you do not yet know what the column means, and TIMESTAMP without a zone hides that.'],
    ], 2) },
  /* 5 */ { t: 'Trap 1 — the same moment, written twice', body: two(prs(model('schema.prisma', 'Event').replace(/ +\/\/.*$/gm, ''), { sm: true }), tp(gon(OUT('gio')), { wrap: 60 }), '') +
    ts(SRC('gio.mts').split('\n').slice(2, 7).join('\n'), { sm: true, hl: [1, 2] }) +
    box('So far, identical', 'Ten in the morning in Hanoi is 03:00 UTC. Through Prisma both columns come back as exactly that. The difference only shows when something else reads the table.', 'lam') },
  /* 6 */ { t: 'Two sessions, one row', body: tp(gon(OUT('gio-psql')).replace(/^\$ .*$/m, `$ psql -c "SET TIME ZONE 'UTC'" -c "SELECT …" -c "SET TIME ZONE 'Asia/Bangkok'" -c "SELECT …"`), { wrap: 110, fs: 16 }) +
    box('withTz knows the instant; noTz stores a wall clock', 'Timestamptz shows 03:00 in UTC and 10:00 in Bangkok — the same moment. Timestamp shows 03:00 in both: it is a clock reading with the zone thrown away. A report, a BI tool or a cron job reading it in local time is off by seven hours.', 'do2') },
  /* 7 */ { t: 'A schema that has thought about time', body: prs(`model Article {
  id           Int       @id @default(autoincrement())
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamptz(3)
  updatedAt    DateTime  @updatedAt @map("updated_at") @db.Timestamptz(3)
  registeredAt DateTime? @map("registered_at") @db.Timestamptz(3)
  releaseDate  DateTime? @map("release_date") @db.Date
}`, { hl: [3, 4, 5, 6] }) + `<div class="cap">from the lesson (illustration)</div>` + cards([
      ['Timestamptz(3) by default', 'Every moment column. Milliseconds, because JavaScript Date has exactly that.'],
      ['Date when it is a date', 'Release date, birthday — no time, no zone, no off-by-one.'],
      ['Timestamp deliberately, or never', 'Only for a local wall-clock time that truly has no zone.'],
    ], 3) },
  /* 8 */ { t: 'Trap 2 — a UUID stored as text', body: two(prs((model('schema.prisma', 'TextUuid') + '\n\n' + model('schema.prisma', 'NativeUuid')).replace(/ +\/\/.*$/gm, ''), { sm: true }),
      tp(gon(OUT('uuid')), { wrap: 52 }) + tp(gon(OUT('uuid-size')).replace(/^\$ .*$/m, '$ psql -c "SELECT pg_size_pretty(pg_total_relation_size(…)) …"'), { wrap: 52 }), '') +
    box('Same 200,000 ids: 28 MB versus 17 MB', 'TEXT keeps 36 characters plus overhead; <code>@db.Uuid</code> keeps 16 bytes — and the primary-key index copies every one. With three UUID foreign keys per row, the waste multiplies.', 'xanh') },
  /* 9 */ { t: 'UUID is a type; TEXT accepts anything', body: tp(gon(OUT('uuid-sai')).replace(/^\$ .*$/m, `$ psql -c "INSERT INTO \\"TextUuid\\" VALUES ('khong-phai-uuid')" -c "INSERT INTO \\"NativeUuid\\" …"`), { wrap: 110 }) + cards([
      ['📏 Size', '16 bytes versus 36 characters, in the table and again in every index.'],
      ['✅ Correctness', 'UUID rejects garbage, normalises case and compares by value. TEXT stores anything; "AB…" and "ab…" are two different ids.'],
      ['🔌 Interop', 'A TEXT id needs a cast before any PostgreSQL function or join that expects uuid.'],
    ], 3) },
  /* 10 */ { t: 'Narrowing a column that already has data', body: tp(gon(OUT('hep-push')).replace(/^\$ .*$/m, '$ npx prisma db push    # title: String → String @db.VarChar(20)'), { wrap: 110, fs: 14 }) +
    two(tp(gon(OUT('hep-sql')).replace(/^\$ .*$/m, '$ npx prisma migrate diff … --script'), { wrap: 60 }), tp(gon(OUT('hep-chay')).replace(/^\$ .*$/m, '$ psql -c \'ALTER TABLE … VARCHAR(20);\''), { wrap: 60 }), '') +
    box('Prisma warns; PostgreSQL refuses', 'push stops and asks for <code>--accept-data-loss</code>. Run the SQL anyway and the database refuses rather than truncating — no data lost. VARCHAR(n) is a constraint, not a speed-up: in PostgreSQL it stores exactly like TEXT.', 'lam') },
  /* 11 */ { t: 'Types that bind you to one database', body: two(prs(SRC('mysql.prisma').replace(/^\/\/.*\n/gm, ''), { sm: true, hl: [7, 8] }), tp(gon(OUT('mysql')).replace(/^\$ .*$/m, '$ npx prisma validate   # provider = "mysql"'), { wrap: 60, fs: 13 }), '') +
    box('The portability warning from Lesson 0.1, made concrete', 'Native types, list fields, index types and JSON operators are all provider-bound. A schema that uses them well is committed to its database — usually the right trade, but make it on purpose.', 'lam') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write one moment into ${c('Timestamp')} and ${c('Timestamptz')}; read it in two time zones`,
      `Fill 200,000 uuids as TEXT and as ${c('@db.Uuid')}; compare sizes`,
      `Insert a non-uuid into both tables`,
      `Narrow a TEXT column with data to ${c('VarChar(20)')}; read every message`,
    ]), box('Keep these', `<ul><li>Moments are ${c('@db.Timestamptz(3)')}</li><li>Dates are ${c('@db.Date')}</li><li>UUIDs are ${c('@db.Uuid')}</li><li>${c('VarChar(n)')} is a rule, not a speed-up</li></ul>`, 'lam'), '') },
]);
