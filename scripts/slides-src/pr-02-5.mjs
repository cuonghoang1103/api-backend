/**
 * pr-02-5 — Prisma ORM · Chapter 2 · Lesson 2.5 "Enums, Json, Bytes and Unsupported" (deck video, 12/11/2026). Bài web: pr-2-5-kieu-kho-chiu.
 * Output THẬT (`chay.sh p2-5`, demo/lab/p2/25, CSDL c25, Prisma 6.19.3 · PostgreSQL 16.14): CREATE TYPE … AS ENUM · psql chèn 'SHIPPED' ⇒
 * invalid input value · thêm giá trị = 1 câu ALTER TYPE ADD VALUE · đổi tên = 8 câu trong BEGIN/COMMIT · db push đổi tên ⇒ cảnh báo + đòi
 * --accept-data-loss · chạy script khi còn hàng DELIVERED ⇒ lỗi, ROLLBACK · union chép tay qua tsc sạch, kiểu import ⇒ TS2322 · JsonValue ⇒
 * TS2339 · path filter 2 hàng · DbNull 2 / JsonNull 1 / AnyNull 3 · sha256 32 byte · Unsupported bắt buộc ⇒ không có create().
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p2/25/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum OrderStatus {\n  NEW\n  PROCESSING\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id     Int         @id @default(autoincrement())\n  status OrderStatus @default(NEW)\n\n  @@map(\"orders\")\n}\n\nmodel User {\n  id       Int   @id @default(autoincrement())\n  settings Json  @default(\"{}\")\n  meta     Json?\n\n  @@map(\"users\")\n}\n\nmodel FileRow {\n  id   Int   @id @default(autoincrement())\n  hash Bytes // a SHA-256: 32 bytes\n\n  @@map(\"files\")\n}\n\nmodel Doc {\n  id     Int                      @id @default(autoincrement())\n  title  String\n  search Unsupported(\"tsvector\")?\n\n  @@map(\"docs\")\n}\n\nmodel Place {\n  id       Int                      @id @default(autoincrement())\n  location Unsupported(\"point\")\n\n  @@map(\"places\")\n}\n",
 "demo/out/p2-5/sql.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c25 npx prisma migrate diff --from-empty --to-schema-datamodel p2/25/schema.prisma --script | grep -v '^$'\n-- CreateSchema\nCREATE SCHEMA IF NOT EXISTS \"public\";\n-- CreateEnum\nCREATE TYPE \"OrderStatus\" AS ENUM ('NEW', 'PROCESSING', 'DELIVERED', 'CANCELLED');\n-- CreateTable\nCREATE TABLE \"orders\" (\n    \"id\" SERIAL NOT NULL,\n    \"status\" \"OrderStatus\" NOT NULL DEFAULT 'NEW',\n    CONSTRAINT \"orders_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"users\" (\n    \"id\" SERIAL NOT NULL,\n    \"settings\" JSONB NOT NULL DEFAULT '{}',\n    \"meta\" JSONB,\n    CONSTRAINT \"users_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"files\" (\n    \"id\" SERIAL NOT NULL,\n    \"hash\" BYTEA NOT NULL,\n    CONSTRAINT \"files_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"docs\" (\n    \"id\" SERIAL NOT NULL,\n    \"title\" TEXT NOT NULL,\n    \"search\" tsvector,\n    CONSTRAINT \"docs_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"places\" (\n    \"id\" SERIAL NOT NULL,\n    \"location\" point NOT NULL,\n    CONSTRAINT \"places_pkey\" PRIMARY KEY (\"id\")\n);\n",
 "demo/out/p2-5/enum-sai.txt": "$ docker exec prisma-pg psql -U student -d c25 -c \"INSERT INTO orders (status) VALUES ('SHIPPED');\"\nERROR:  invalid input value for enum \"OrderStatus\": \"SHIPPED\"\nLINE 1: INSERT INTO orders (status) VALUES ('SHIPPED');\n                                            ^\n[exit 1]\n",
 "demo/out/p2-5/them.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c25 npx prisma migrate diff --from-schema-datamodel p2/25/schema.prisma --to-schema-datamodel p2/25/them.prisma --script | grep -v '^$'\n-- AlterEnum\nALTER TYPE \"OrderStatus\" ADD VALUE 'SHIPPING';\n",
 "demo/out/p2-5/doiten.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c25 npx prisma migrate diff --from-schema-datamodel p2/25/schema.prisma --to-schema-datamodel p2/25/doiten.prisma --script | grep -v '^$'\n-- AlterEnum\nBEGIN;\nCREATE TYPE \"OrderStatus_new\" AS ENUM ('NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED');\nALTER TABLE \"orders\" ALTER COLUMN \"status\" DROP DEFAULT;\nALTER TABLE \"orders\" ALTER COLUMN \"status\" TYPE \"OrderStatus_new\" USING (\"status\"::text::\"OrderStatus_new\");\nALTER TYPE \"OrderStatus\" RENAME TO \"OrderStatus_old\";\nALTER TYPE \"OrderStatus_new\" RENAME TO \"OrderStatus\";\nDROP TYPE \"OrderStatus_old\";\nALTER TABLE \"orders\" ALTER COLUMN \"status\" SET DEFAULT 'NEW';\nCOMMIT;\n",
 "demo/out/p2-5/doiten-push.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c25 npx prisma db push --schema p2/25/doiten.prisma --skip-generate < /dev/null 2>&1 | grep -vE '^\\s*$|Environment|schema loaded|Datasource'\n⚠️  There might be data loss when applying the changes:\n  • The values [DELIVERED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.\nError: Use the --accept-data-loss flag to ignore the data loss warnings like prisma db push --accept-data-loss\n",
 "demo/out/p2-5/doiten-chay.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c25 npx prisma migrate diff --from-schema-datamodel p2/25/schema.prisma --to-schema-datamodel p2/25/doiten.prisma --script | docker exec -i prisma-pg psql -U student -d c25 2>&1 | grep -vE '^\\s*$'\nBEGIN\nCREATE TYPE\nALTER TABLE\nERROR:  invalid input value for enum \"OrderStatus_new\": \"DELIVERED\"\nERROR:  current transaction is aborted, commands ignored until end of transaction block\nERROR:  current transaction is aborted, commands ignored until end of transaction block\nERROR:  current transaction is aborted, commands ignored until end of transaction block\nERROR:  current transaction is aborted, commands ignored until end of transaction block\nROLLBACK\n",
 "demo/lab/p2/25/seed-sai.ts": "// The bug — a hand-copied union that type-checks against itself\ntype OrderStatus = 'NEW' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';\nconst done: OrderStatus = 'DELIVERED';\nconsole.log(done);\n",
 "demo/lab/p2/25/seed-dung-moi.ts": "// The fix, after the rename: the generated type no longer has DELIVERED\nimport type { OrderStatus } from './gen-moi/index.js';\nconst done: OrderStatus = 'DELIVERED';\nconsole.log(done);\n",
 "demo/out/p2-5/seed-tsc.txt": "$ cd p2/25 && npx tsc --strict --noEmit --skipLibCheck seed-sai.ts && echo 'seed-sai.ts: no errors'; npx tsc --strict --noEmit --module NodeNext --moduleResolution NodeNext --skipLibCheck seed-dung-moi.ts\nseed-sai.ts: no errors\nseed-dung-moi.ts(3,7): error TS2322: Type '\"DELIVERED\"' is not assignable to type 'OrderStatus'.\n[exit 2]\n",
 "demo/lab/p2/25/json.ts": "import { PrismaClient, Prisma } from './gen/index.js';\nconst prisma = new PrismaClient();\nconst u = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });\nconsole.log(u.settings.theme);          // ✗ JsonValue has no properties\n",
 "demo/out/p2-5/json-tsc.txt": "$ cd p2/25 && npx tsc --strict --noEmit --module NodeNext --moduleResolution NodeNext --target ES2022 --skipLibCheck json.ts\njson.ts(4,13): error TS18047: 'u.settings' is possibly 'null'.\njson.ts(4,24): error TS2339: Property 'theme' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.\n  Property 'theme' does not exist on type 'string'.\n[exit 2]\n",
 "demo/lab/p2/25/json.mts": "import { PrismaClient, Prisma } from './gen/index.js';\nconst prisma = new PrismaClient();\nawait prisma.user.createMany({ data: [\n  { settings: { theme: 'dark', lang: 'vi' }, meta: Prisma.DbNull },\n  { settings: { theme: 'light', lang: 'en' }, meta: Prisma.JsonNull },\n  { settings: { theme: 'dark', lang: 'en' } },\n] });\nconsole.log('theme = dark :', await prisma.user.count({ where: { settings: { path: ['theme'], equals: 'dark' } } }));\nconsole.log('meta DbNull  :', await prisma.user.count({ where: { meta: { equals: Prisma.DbNull } } }));\nconsole.log('meta JsonNull:', await prisma.user.count({ where: { meta: { equals: Prisma.JsonNull } } }));\nconsole.log('meta AnyNull :', await prisma.user.count({ where: { meta: { equals: Prisma.AnyNull } } }));\nconst hash = (await import('node:crypto')).createHash('sha256').update('xin chao').digest();\nconst f = await prisma.fileRow.create({ data: { hash } });\nconsole.log('hash bytes   :', f.hash.length, f.hash.constructor.name);\nawait prisma.$disconnect();\n",
 "demo/out/p2-5/json.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c25 npx tsx p2/25/json.mts\ntheme = dark : 2\nmeta DbNull  : 2\nmeta JsonNull: 1\nmeta AnyNull : 3\nhash bytes   : 32 Uint8Array\n",
 "demo/out/p2-5/bytes.txt": "$ docker exec prisma-pg psql -U student -d c25 -c 'SELECT id, octet_length(hash) AS bytes, encode(hash, $$hex$$) AS hex FROM files;'\n id | bytes |                               hex                                \n----+-------+------------------------------------------------------------------\n  1 |    32 | f9b197ffdaa45e4fb217f865fe3a2bd8efab8d0a3faf6eb8acb04564decd0b27\n(1 row)\n\n",
 "demo/out/p2-5/unsupported.txt": "$ grep -cE 'create<T extends PlaceCreateArgs' p2/25/gen/index.d.ts; grep -cE 'create<T extends DocCreateArgs' p2/25/gen/index.d.ts; grep -cE '^    search' p2/25/gen/index.d.ts\n0\n1\n0\n[exit 1]\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-02-5', code: 'PR 2.5', title: 'Enums, Json, Bytes and Unsupported', sub: 'Chapter 2 · Lesson 2.5' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p2-5/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p2/25/${t}`, 'utf8').replace(/\n+$/, '');
const khoi = (f, kieu, ten) => SRC(f).match(new RegExp(`${kieu} ${ten} \\{[\\s\\S]*?\\n\\}`))[0];
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ docker exec prisma-pg psql -U student -d c25 /gm, '$ psql ').replace(/^\$ cd p2\/25 && /gm, '$ ')
  .split('\n').filter((l) => !/^\(\d+ rows?\)/.test(l.trim())).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — The schema language', bai: '2.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 2 · Lesson 2.5', t: 'Enums, Json, Bytes<br>and Unsupported', sub: 'Four types that behave differently — and the rename that once broke CuongThai’s production seed' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Enum: a real PostgreSQL type — adding a value is one line, renaming one is eight</li>
    <li>The CuongThai incident: an enum rename that passed every check</li>
    <li>Json: why it has no type, how to filter inside it, and the three kinds of null</li>
    <li>Bytes: right for a hash, wrong for a file</li>
    <li>Unsupported: a column the client cannot see</li></ul>` },
  /* 3 */ { t: 'Four types, four ways to hurt you', body: cards([
      ['🔒 enum', 'Constrained but rigid. A real database type, enforced against every writer. Adding a value is cheap; renaming one is not.'],
      ['🧩 Json', 'Flexible but untyped. Anything fits, nothing is checked, and the TypeScript type has no properties until you give it one.'],
      ['📦 Bytes', 'Raw binary. Correct for a 32-byte hash; a trap for a 5 MB file that then rides along in every SELECT and every backup.'],
      ['🙈 Unsupported', 'The column exists and migrations create it; the client cannot see it. Required + Unsupported = no <code>create()</code>.'],
    ], 2) },
  /* 4 */ { t: 'Enum — a real type in PostgreSQL', body: two(prs(khoi('schema.prisma', 'enum', 'OrderStatus') + '\n\n' + khoi('schema.prisma', 'model', 'Order'), { sm: true }),
      sql(OUT('sql').split('\n').slice(3, 11).join('\n').replace(/AS ENUM \((.*)\);/, (m, a) => 'AS ENUM (\n    ' + a.split(', ').join(',\n    ') + '\n);'), { sm: true }), '') +
    tp(gon(OUT('enum-sai')), { wrap: 110 }) },
  /* 5 */ { t: 'Adding a value: one line. Renaming one: eight.', body: sql(gon(OUT('them')).split('\n').slice(1).join('\n')) + `<div class="cap">migrate diff — add SHIPPING</div>` +
    sql(gon(OUT('doiten')).split('\n').slice(1).join('\n'), { sm: true }) + `<div class="cap">migrate diff — rename DELIVERED → COMPLETED: a new type, a cast of every row, a swap, a drop — one transaction, one exclusive lock</div>` },
  /* 6 */ { t: 'Renaming while rows still hold the old value', body: tp(gon(OUT('doiten-push')).replace(/^\$ .*$/m, '$ npx prisma db push    # DELIVERED renamed to COMPLETED'), { wrap: 110, fs: 14 }) +
    tp(gon(OUT('doiten-chay')).replace(/^\$ .*$/m, '$ npx prisma migrate diff … --script | psql'), { wrap: 110, fs: 14 }) +
    box('Nothing is lost — and nothing moves', 'push refuses without <code>--accept-data-loss</code>. Run the SQL anyway: the cast fails on the row still holding DELIVERED and the whole transaction rolls back.', 'lam') },
  /* 7 */ { t: 'The safe rename: two deploys', body: steps([
      `Deploy 1 — ${c('ALTER TYPE … ADD VALUE \'COMPLETED\'')}; the code writes the new value and still reads both`,
      `Backfill — ${c('UPDATE orders SET status = \'COMPLETED\' WHERE status = \'DELIVERED\'')}`,
      `Deploy 2 — remove ${c('DELIVERED')} from the enum; now the eight-statement migration finds no old rows`,
    ]) + box('Expand, migrate, contract', 'The same three-step shape as the required column in Lesson 1.5: never change the meaning of stored data in one step. Chapter 6 makes this routine.', 'xanh') },
  /* 8 */ { t: 'From CuongThai: the rename that passed every check', body: ts('// seed-sai.ts — a hand-copied union\n' + SRC('seed-sai.ts').replace(/^\/\/.*\n/, '') + '\n\n// seed-dung-moi.ts — the generated type, after the rename\n' + SRC('seed-dung-moi.ts').replace(/^\/\/.*\n/, ''), { sm: true, hl: [7] }) +
    tp(gon(OUT('seed-tsc')).replace(/^\$ .*$/m, '$ npx tsc seed-sai.ts ; npx tsc seed-dung-moi.ts'), { wrap: 110 }) +
    box('2026-08-08: ContentType.CODE → CODE_REVIEW', 'Every pre-push check was green; the seed broke on production. A hand-copied union in <code>prisma/seed.ts</code> agreed with itself. The fix: import the generated type, <code>npm run typecheck:seed</code>, and a real <code>prisma db seed</code>.', 'do2') },
  /* 9 */ { t: 'Json — the column with no type', body: ts(SRC('json.ts'), { sm: true, hl: [4] }) +
    tp(gon(OUT('json-tsc')).replace(/^\$ .*$/m, '$ npx tsc --strict json.ts'), { wrap: 110, fs: 14 }) +
    two(prs(khoi('schema.prisma', 'model', 'User'), { sm: true }),
      box('JsonValue is a recursive union', 'string | number | boolean | object | array | null — no properties. <code>as any</code> throws safety away; a typed generator or a Zod parse at the boundary gives it a shape.', 'lam'), '') },
  /* 10 */ { t: 'Filtering inside Json — and the three kinds of null', body: ts(SRC('json.mts').split('\n').slice(2, 11).join('\n'), { sm: true, hl: [7, 8, 9, 10] }) +
    tp(gon(OUT('json')), { wrap: 110 }) +
    box('DbNull · JsonNull · AnyNull', '<code>Prisma.DbNull</code> = the column is SQL NULL (two rows here, including the one that omitted <code>meta</code>). <code>Prisma.JsonNull</code> = it holds the JSON value null. <code>AnyNull</code> matches both.', 'lam') },
  /* 11 */ { t: 'Bytes for a hash, Unsupported for the rest', body: two(prs((khoi('schema.prisma', 'model', 'FileRow') + '\n\n' + khoi('schema.prisma', 'model', 'Place')).replace(/ +\/\/.*$/gm, ''), { sm: true }),
      tp(gon(OUT('bytes')).replace(/^\$ .*$/m, "$ psql -c \"SELECT id, octet_length(hash), encode(hash, 'hex') FROM files\""), { wrap: 40, fs: 12 }) +
      tp(gon(OUT('unsupported')).replace(/^\$ .*$/m, '$ grep -c … PlaceCreateArgs ; … DocCreateArgs ; "^    search"'), { wrap: 40, fs: 12 }), 'r64') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Add an enum value, then rename one; read both ${c('migrate diff')} scripts`,
      `Run the rename while a row holds the old value`,
      `Hand-copy an enum union, rename the value, run tsc — then import the real type`,
      `Store Json; filter by ${c('path')}; count ${c('DbNull')}, ${c('JsonNull')}, ${c('AnyNull')}`,
    ]), box('Keep these', `<ul><li>Add enum values freely; rename in two deploys</li><li>Import enum types from the client, never copy them</li><li>Json needs a type you attach</li><li>Bytes for hashes; files go to object storage</li></ul>`, 'lam'), '') },
]);
