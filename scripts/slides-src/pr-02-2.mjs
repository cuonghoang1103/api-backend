/**
 * pr-02-2 — Prisma ORM · Chapter 2 · Lesson 2.2 "Field attributes: every @" (deck video, 12/11/2026). Bài web: pr-2-2-thuoc-tinh-truong.
 * Output THẬT (`chay.sh p2-2`, demo/lab/p2/22, CSDL c22, Prisma 6.19.3 · PostgreSQL 16.14): SQL bốn kiểu @id · 100.000 hàng mỗi kiểu ⇒
 * khoá chính Int 2208 kB (lá đầy 90%) · cuid 4880 kB (90%) · uuid TEXT 7832 kB (67%) · uuid @db.Uuid 4232 kB (66%) — uuid ngẫu nhiên nên số dao động nhẹ mỗi lần chạy · \d "Example" (code không
 * có DEFAULT) · INSERT thô ⇒ null value in column "code" · unique: tên ràng buộc, hai NULL cùng sống · @updatedAt: tham số $2 từ JS; UPDATE từ
 * psql không đụng updated_at · CuongThai: 4173 @map, 630 @@map (web: 412/112) · @ignore: 0 lần oldColumn trong client, cột vẫn ở CSDL.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p2/22/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel IdInt {\n  id    Int    @id @default(autoincrement())\n  label String\n}\n\nmodel IdUuid {\n  id    String @id @default(uuid())\n  label String\n}\n\nmodel IdCuid {\n  id    String @id @default(cuid())\n  label String\n}\n\nmodel IdDbUuid {\n  id    String @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  label String\n}\n\nmodel Example {\n  id        Int      @id @default(autoincrement())\n  status    String   @default(\"NHAP\")\n  attempts  Int      @default(0)\n  visible   Boolean  @default(true)\n  tags      String[] @default([])\n  createdAt DateTime @default(now())\n  code      String   @default(nanoid(12))\n  fromDb    String   @default(dbgenerated(\"substr(md5(random()::text), 1, 8)\"))\n}\n\nmodel User {\n  id          Int     @id @default(autoincrement())\n  email       String  @unique\n  username    String  @unique(map: \"uk_user_username\")\n  phoneNumber String? @unique\n}\n\nmodel Post {\n  id        Int      @id @default(autoincrement())\n  title     String\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  @@map(\"posts\")\n}\n\nmodel Account {\n  id        String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  email     String   @unique(map: \"uk_account_email\") @db.VarChar(180)\n  password  String   @db.VarChar(255)\n  nickname  String?  @map(\"nick_name\") @db.VarChar(50)\n  balance   Decimal  @default(0) @db.Decimal(14, 2)\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz(3)\n  oldColumn String?  @map(\"old_column\") @ignore\n\n  @@map(\"accounts\")\n}\n",
 "demo/out/p2-2/ids.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c22 npx tsx p2/22/ids.mts\nIdInt     100000 rows 868 ms\nIdUuid    100000 rows 949 ms\nIdCuid    100000 rows 783 ms\nIdDbUuid  100000 rows 778 ms\n{ id: 1 } { id: 'be792146-f69a-463f-8282-32ee7ac87771' }\n{ id: 'cmwcgmgbd0000accf1v3ugol4' } { id: '44937a84-8c54-4ea8-8f04-8dc1fcd28412' }\n",
 "demo/out/p2-2/index-size.txt": "$ docker exec prisma-pg psql -U postgres -d c22 -c \"SELECT c.relname AS index, pg_size_pretty(pg_relation_size(c.oid)) AS size, round((pgstatindex(c.oid::regclass)).avg_leaf_density) AS leaf_density_pct FROM pg_class c WHERE c.relname IN ('IdInt_pkey','IdUuid_pkey','IdCuid_pkey','IdDbUuid_pkey') ORDER BY pg_relation_size(c.oid);\"\n     index     |  size   | leaf_density_pct \n---------------+---------+------------------\n IdInt_pkey    | 2208 kB |               90\n IdDbUuid_pkey | 4232 kB |               66\n IdCuid_pkey   | 4880 kB |               90\n IdUuid_pkey   | 7832 kB |               67\n(4 rows)\n\n",
 "demo/out/p2-2/default-cot.txt": "$ docker exec prisma-pg psql -U student -d c22 -c \"SELECT column_name, column_default FROM information_schema.columns WHERE table_name = 'Example' ORDER BY ordinal_position;\"\n column_name |            column_default             \n-------------+---------------------------------------\n id          | nextval('\"Example_id_seq\"'::regclass)\n status      | 'NHAP'::text\n attempts    | 0\n visible     | true\n tags        | ARRAY[]::text[]\n createdAt   | CURRENT_TIMESTAMP\n code        | \n fromDb      | substr(md5((random())::text), 1, 8)\n(8 rows)\n\n",
 "demo/out/p2-2/raw-insert.txt": "$ docker exec prisma-pg psql -U student -d c22 -c 'INSERT INTO \"Example\" DEFAULT VALUES;'\nERROR:  null value in column \"code\" of relation \"Example\" violates not-null constraint\nDETAIL:  Failing row contains (1, NHAP, 0, t, {}, 2026-11-11 18:35:58.014, null, b739e133).\n[exit 1]\n",
 "demo/out/p2-2/unique.txt": "$ docker exec prisma-pg psql -U student -d c22 -c '\\d \"User\"' | sed -n '/Indexes/,$p'\nIndexes:\n    \"User_pkey\" PRIMARY KEY, btree (id)\n    \"User_email_key\" UNIQUE, btree (email)\n    \"User_phoneNumber_key\" UNIQUE, btree (\"phoneNumber\")\n    \"uk_user_username\" UNIQUE, btree (username)\n\n",
 "demo/out/p2-2/null-unique.txt": "$ docker exec prisma-pg psql -U student -d c22 -c \"INSERT INTO \\\"User\\\" (email, username) VALUES ('a@x.vn','a'), ('b@x.vn','b'); SELECT id, email, \\\"phoneNumber\\\" FROM \\\"User\\\";\"\nINSERT 0 2\n id | email  | phoneNumber \n----+--------+-------------\n  1 | a@x.vn | \n  2 | b@x.vn | \n(2 rows)\n\n",
 "demo/out/p2-2/updated.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c22 npx tsx p2/22/capnhat.mts\nprisma:query INSERT INTO \"public\".\"posts\" (\"title\",\"created_at\",\"updated_at\") VALUES ($1,$2,$3) RETURNING \"public\".\"posts\".\"id\", \"public\".\"posts\".\"title\", \"public\".\"posts\".\"created_at\", \"public\".\"posts\".\"updated_at\" [\"First\",\"2026-11-11 18:36:02.474 UTC\",\"2026-11-11 18:36:02.474 UTC\"]\nprisma:query UPDATE \"public\".\"posts\" SET \"title\" = $1, \"updated_at\" = $2 WHERE (\"public\".\"posts\".\"id\" = $3 AND 1=1) RETURNING \"public\".\"posts\".\"id\", \"public\".\"posts\".\"title\", \"public\".\"posts\".\"created_at\", \"public\".\"posts\".\"updated_at\" [\"Renamed\",\"2026-11-11 18:36:03.581 UTC\",1]\n",
 "demo/out/p2-2/updated-psql.txt": "$ docker exec prisma-pg psql -U student -d c22 -c \"UPDATE posts SET title = 'from psql';\" -c 'SELECT id, title, created_at, updated_at FROM posts;'\nUPDATE 1\n id |   title   |       created_at        |       updated_at        \n----+-----------+-------------------------+-------------------------\n  1 | from psql | 2026-11-11 18:36:02.474 | 2026-11-11 18:36:03.581\n(1 row)\n\n",
 "demo/out/p2-2/map-ct.txt": "$ grep -o '[^@]@map(' ~/Downloads/api-backend/prisma/schema.prisma | wc -l; grep -o '@@map(' ~/Downloads/api-backend/prisma/schema.prisma | wc -l\n    4173\n     630\n",
 "demo/out/p2-2/ignore.txt": "$ grep -c 'oldColumn' p2/22/gen/index.d.ts; docker exec prisma-pg psql -U student -d c22 -c '\\d accounts' | grep old_column\n0\n old_column | text                        |           |          | \n",
 "demo/out/p2-2/sql.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c22 npx prisma migrate diff --from-empty --to-schema-datamodel p2/22/schema.prisma --script | grep -v '^$'\n-- CreateSchema\nCREATE SCHEMA IF NOT EXISTS \"public\";\n-- CreateTable\nCREATE TABLE \"IdInt\" (\n    \"id\" SERIAL NOT NULL,\n    \"label\" TEXT NOT NULL,\n    CONSTRAINT \"IdInt_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"IdUuid\" (\n    \"id\" TEXT NOT NULL,\n    \"label\" TEXT NOT NULL,\n    CONSTRAINT \"IdUuid_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"IdCuid\" (\n    \"id\" TEXT NOT NULL,\n    \"label\" TEXT NOT NULL,\n    CONSTRAINT \"IdCuid_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"IdDbUuid\" (\n    \"id\" UUID NOT NULL DEFAULT gen_random_uuid(),\n    \"label\" TEXT NOT NULL,\n    CONSTRAINT \"IdDbUuid_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"Example\" (\n    \"id\" SERIAL NOT NULL,\n    \"status\" TEXT NOT NULL DEFAULT 'NHAP',\n    \"attempts\" INTEGER NOT NULL DEFAULT 0,\n    \"visible\" BOOLEAN NOT NULL DEFAULT true,\n    \"tags\" TEXT[] DEFAULT ARRAY[]::TEXT[],\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"code\" TEXT NOT NULL,\n    \"fromDb\" TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 8),\n    CONSTRAINT \"Example_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"User\" (\n    \"id\" SERIAL NOT NULL,\n    \"email\" TEXT NOT NULL,\n    \"username\" TEXT NOT NULL,\n    \"phoneNumber\" TEXT,\n    CONSTRAINT \"User_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"posts\" (\n    \"id\" SERIAL NOT NULL,\n    \"title\" TEXT NOT NULL,\n    \"created_at\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updated_at\" TIMESTAMP(3) NOT NULL,\n    CONSTRAINT \"posts_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"accounts\" (\n    \"id\" UUID NOT NULL DEFAULT gen_random_uuid(),\n    \"email\" VARCHAR(180) NOT NULL,\n    \"password\" VARCHAR(255) NOT NULL,\n    \"nick_name\" VARCHAR(50),\n    \"balance\" DECIMAL(14,2) NOT NULL DEFAULT 0,\n    \"created_at\" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updated_at\" TIMESTAMPTZ(3) NOT NULL,\n    \"old_column\" TEXT,\n    CONSTRAINT \"accounts_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateIndex\nCREATE UNIQUE INDEX \"User_email_key\" ON \"User\"(\"email\");\n-- CreateIndex\nCREATE UNIQUE INDEX \"uk_user_username\" ON \"User\"(\"username\");\n-- CreateIndex\nCREATE UNIQUE INDEX \"User_phoneNumber_key\" ON \"User\"(\"phoneNumber\");\n-- CreateIndex\nCREATE UNIQUE INDEX \"uk_account_email\" ON \"accounts\"(\"email\");\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-02-2', code: 'PR 2.2', title: 'Field attributes: every @', sub: 'Chapter 2 · Lesson 2.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p2-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SCHEMA = fs.readFileSync(`${DEMO}/lab/p2/22/schema.prisma`, 'utf8');
const model = (ten) => SCHEMA.match(new RegExp(`model ${ten} \\{[\\s\\S]*?\\n\\}`))[0];
const bang = (ten) => OUT('sql').match(new RegExp(`CREATE TABLE "${ten}" \\([\\s\\S]*?\\n\\);`))[0];
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ docker exec prisma-pg psql -U (student|postgres) -d c22 /gm, '$ psql ');

export const slides = lamDeck({ chuong: 'Chapter 2 — The schema language', bai: '2.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 2 · Lesson 2.2', t: 'Field attributes:<br>every @', sub: 'Eight attributes, each one changing the SQL — read the DDL, not the docs' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>@id</code>: autoincrement, uuid, cuid, dbgenerated — and what each does to the index, measured</li>
    <li><code>@default</code>: which defaults live in the database and which live in JavaScript</li>
    <li><code>@unique</code>: the constraint name it creates, and why many NULLs are allowed</li>
    <li><code>@updatedAt</code>: the writes it misses</li>
    <li><code>@map</code>, <code>@ignore</code>, <code>@db</code> — and all eight on one model</li></ul>` },
  /* 3 */ { t: '@id — four ways to make a primary key', body: tbl(['In the schema', 'The SQL column (migrate diff)', 'Who makes the id'], [
      ['<code>Int @id @default(autoincrement())</code>', '<code>"id" SERIAL NOT NULL</code>', 'PostgreSQL — a sequence'],
      ['<code>String @id @default(uuid())</code>', '<code>"id" TEXT NOT NULL</code>', 'Prisma Client, in JavaScript, before the insert'],
      ['<code>String @id @default(cuid())</code>', '<code>"id" TEXT NOT NULL</code>', 'Prisma Client — time-prefixed, sorts roughly by creation'],
      ['<code>String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid</code>', '<code>"id" UUID NOT NULL DEFAULT gen_random_uuid()</code>', 'PostgreSQL — 16 bytes, not 36 characters'],
    ]) + box('Which one?', 'Default to <code>autoincrement()</code> for internal tables — small, fast, readable in logs. It also leaks a count: <code>/orders/1043</code> tells a competitor how many orders you have. Reach for <code>cuid()</code> or a uuid when ids are public, generated offline, or merged from several databases.', 'lam') },
  /* 4 */ { t: '100,000 rows each — what the key does to the index', body: tp(gon(OUT('ids')), { wrap: 110, fs: 15 }) +
    tp(gon(OUT('index-size')).replace(/SELECT[\s\S]*ORDER BY pg_relation_size\(c\.oid\);"/, 'SELECT index, size, leaf density … FROM pg_class …"'), { wrap: 110, fs: 15 }) +
    box('Sequential keys pack the B-tree; random keys split it', 'Int and cuid fill the right edge — leaves 90% full. Random uuid v4 splits pages everywhere — about two-thirds full. As TEXT it is 3.5× the Int index; <code>@db.Uuid</code> roughly halves that.', 'xanh') },
  /* 5 */ { t: '@default — six generators and a literal', body: two(prs(model('Example'), { sm: true, hl: [8, 9] }),
      tp(gon(OUT('default-cot')).replace(/^\$ .*$/m, "$ psql -c \"SELECT column_name, column_default FROM information_schema.columns …\""), { wrap: 38, fs: 13 }), 'r73') +
    box('Look at code', 'It has <b>no</b> database default. <code>nanoid()</code>, like <code>uuid()</code> and <code>cuid()</code>, runs in Prisma Client. <code>now()</code>, literals and <code>dbgenerated(…)</code> are real SQL defaults.', 'do2') },
  /* 6 */ { t: 'The trap: anything that is not Prisma', body: tp(gon(OUT('raw-insert')), { wrap: 110 }) +
    cards([
      ['🐘 psql, imports, other services', 'They see a NOT NULL column with no default, and the insert fails — or, if the column is nullable, rows arrive with no id.'],
      ['✅ The fix', 'If other writers exist, generate in the database: <code>@default(dbgenerated("gen_random_uuid()")) @db.Uuid</code>.'],
      ['🧭 The rule', 'A default that matters to the data belongs in the database. A default that is a convenience can live in the client.'],
    ], 3) },
  /* 7 */ { t: '@unique — and the constraint name it creates', body: two(prs(model('User'), { sm: true, hl: [4] }),
      tp(gon(OUT('unique')), { wrap: 60 }) + tp(gon(OUT('null-unique')).replace(/^\$ .*$/m, "$ psql -c \"INSERT … two users, no phone …; SELECT …\""), { wrap: 60 }), '') },
  /* 8 */ { t: 'Four things @unique does', body: cards([
      ['📇 An index for free', 'A unique constraint is backed by a B-tree, so <code>where: { email }</code> is already fast. Adding <code>@@index([email])</code> too is wasted disk.'],
      ['🔑 It unlocks findUnique', 'Only unique fields may appear in a <code>findUnique</code> where — a compile-time promise of at most one row.'],
      ['∅ Many NULLs allowed', 'NULL means "unknown", so both users above have no phone and no rule is broken.'],
      ['🏷️ map: names the constraint', '<code>@unique(map: "uk_user_username")</code> renames the index, not the field — for house naming rules and the 63-character limit.'],
    ], 2) },
  /* 9 */ { t: '@updatedAt — and the writes it misses', body: tp(gon(OUT('updated')).replace(/ RETURNING [^[]*/g, ' RETURNING …'), { wrap: 120, fs: 13 }) +
    tp(gon(OUT('updated-psql')), { wrap: 120 }) +
    box('The timestamp comes from your application', 'Prisma sends <code>updated_at = $2</code> with a JavaScript <code>new Date()</code>. A raw UPDATE from psql leaves it untouched — it still shows the last Prisma update; a server with a wrong clock writes a wrong time. Need it always right? Use a database trigger.', 'do2') },
  /* 10 */ { t: '@map — two naming conventions at once', body: two(prs(`model User {
  id           Int       @id @default(autoincrement())
  fullName     String?   @map("full_name")
  avatarUrl    String?   @map("avatar_url")
  lastActiveAt DateTime? @map("last_active_at")

  @@map("users")
}`, { sm: true }), tp(gon(OUT('map-ct')).replace(/^\$ .*$/m, "$ grep -o '[^@]@map(' prisma/schema.prisma | wc -l\n$ grep -o '@@map(' prisma/schema.prisma | wc -l"), { wrap: 60, fs: 15, title: 'CuongThai schema.prisma — 12 Nov 2026' }), '') +
    box('Not cosmetic', 'Your code reads <code>user.fullName</code>; the database has <code>full_name</code>. JavaScript conventions in the code, SQL conventions in the database — what a DBA reviewing your migrations expects. CuongThai maps 4,173 fields and 630 models.', 'lam') +
    box('@map renames the column, not the field', 'Queries, types and autocompletion all use <code>fullName</code>; only the SQL Prisma writes says <code>"full_name"</code>.', 'xanh') },
  /* 11 */ { t: '@ignore, @db — all eight on one model', body: prs(model('Account'), { hl: [9] }) +
    tp(gon(OUT('ignore')).replace(/^\$ .*$/m, "$ grep -c oldColumn gen/index.d.ts ; psql -c '\\d accounts' | grep old_column"), { wrap: 110 }) +
    box('@ignore hides a column from the client, not from the database', 'Zero mentions of <code>oldColumn</code> in the client; the column is still in the table. It must be nullable or have a default.', 'lam') },
  /* 12 */ { t: 'The DDL those eight attributes produce', body: sql(bang('accounts') + '\n' + OUT('sql').match(/CREATE UNIQUE INDEX "uk_account_email".*$/m)[0]) +
    box('Read it line by line', '<code>dbgenerated</code> + <code>@db.Uuid</code> → <code>UUID … DEFAULT gen_random_uuid()</code> · <code>@db.VarChar(180)</code> → <code>VARCHAR(180)</code> · <code>@map</code> → the column names · <code>@updatedAt</code> → NOT NULL with <b>no</b> default · <code>@unique(map:)</code> → <code>uk_account_email</code>.', 'xanh') },
  /* 13 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Fill four tables with 100,000 rows: ${c('autoincrement')}, ${c('uuid')}, ${c('cuid')}, ${c('dbgenerated')}; measure the pkey`,
      `Insert into a ${c('nanoid()')} table from psql; read the error`,
      `Update a row from psql; watch ${c('updated_at')} stay still`,
      `Count ${c('@map')} in a real schema`,
    ]), box('Keep these', `<ul><li>${c('autoincrement')} inside, ${c('cuid')}/${c('uuid')} when ids are public</li><li>Client-side defaults do not exist for psql</li><li>${c('@unique')} is already an index</li><li>${c('@updatedAt')} is set by your app, not the database</li></ul>`, 'lam'), '') },
]);
