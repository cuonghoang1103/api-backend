/**
 * pr-06-4 — Prisma ORM · Chapter 6 · Lesson 6.4 "Drift, and adopting a database that exists" (deck video, 12/11/2026). Bài web: pr-6-4-troi-dat.
 * Output THẬT (`chay.sh p6-4`, demo/lab/p6/64, CSDL c64/c64r/c64b, Prisma 6.19.3 · PostgreSQL 16.14): sửa tay (cột ghi_chu_tam + chỉ mục trigram) ⇒
 * diff datasource→datamodel đòi DROP, diff --from-migrations→datasource ra ADD (ngược chiều, có "public".) · migrate STATUS KHÔNG thấy trôi dạt ("up to
 * date"; web nói status in "Drift detected") — migrate DEV mới thấy và đòi reset · nhận nuôi: @@index([title], map) như web ⇒ DROP + CREATE btree; đúng là
 * ops: raw("gin_trgm_ops") + type: Gin ⇒ rỗng · migration IF NOT EXISTS + resolve --applied; CSDL sạch deploy ra đúng chỉ mục · @@ignore ⇒ diff rỗng (thiếu ⇒
 * DROP TABLE) · baseline CSDL cũ: db pull 2 model, tên quan hệ máy đặt, cảnh báo CHECK; 0_init 36 dòng KHÔNG có CHECK; resolve --applied 0_init; diff rỗng.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p6/64/troi-tay.sql": "-- the 2 a.m. hotfix — typed straight into psql, no migration\nALTER TABLE posts ADD COLUMN ghi_chu_tam TEXT;\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\nCREATE INDEX posts_title_trgm ON posts USING gin (title gin_trgm_ops);\n",
 "demo/out/p6-4/phat-hien.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate diff --from-schema-datasource p6/64/a/prisma/schema.prisma --to-schema-datamodel p6/64/a/prisma/schema.prisma --script\n-- DropIndex\nDROP INDEX \"posts_title_trgm\";\n\n-- AlterTable\nALTER TABLE \"posts\" DROP COLUMN \"ghi_chu_tam\";\n\n",
 "demo/out/p6-4/phat-hien-lichsu.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate diff --from-migrations p6/64/a/prisma/migrations --to-schema-datasource p6/64/a/prisma/schema.prisma --shadow-database-url postgresql://student:matkhau@127.0.0.1:55491/c64_shadow --script\n-- AlterTable\nALTER TABLE \"public\".\"posts\" ADD COLUMN     \"ghi_chu_tam\" TEXT;\n\n-- CreateIndex\nCREATE INDEX \"posts_title_trgm\" ON \"public\".\"posts\" USING GIN (\"title\" gin_trgm_ops ASC);\n\n",
 "demo/out/p6-4/status.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate status --schema p6/64/a/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/a/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64\", schema \"public\" at \"127.0.0.1:55491\"\n\n1 migration found in prisma/migrations\n\nDatabase schema is up to date!\n",
 "demo/out/p6-4/dev-troi.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate dev --name thu --schema p6/64/a/prisma/schema.prisma --skip-generate\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/a/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64\", schema \"public\" at \"127.0.0.1:55491\"\n\nDrift detected: Your database schema is not in sync with your migration history.\n\nThe following is a summary of the differences between the expected database schema given your migrations files, and the actual schema of the database.\n\nIt should be understood as the set of changes to get from the expected schema to the actual schema.\n\n[*] Changed the `posts` table\n  [+] Added column `ghi_chu_tam`\n  [+] Added index on columns (title)\n\nWe need to reset the \"public\" schema at \"127.0.0.1:55491\"\n\nYou may use prisma migrate reset to drop the development database.\nAll data will be lost.\n[exit 130]\n",
 "demo/out/p6-4/nhan-web.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate diff --from-schema-datasource p6/64/a/prisma/schema.prisma --to-schema-datamodel p6/64/a/prisma/schema.prisma --script\n-- DropIndex\nDROP INDEX \"posts_title_trgm\";\n\n-- CreateIndex\nCREATE INDEX \"posts_title_trgm\" ON \"posts\"(\"title\");\n\n",
 "demo/out/p6-4/nhan-dung.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate diff --from-schema-datasource p6/64/a/prisma/schema.prisma --to-schema-datamodel p6/64/a/prisma/schema.prisma --script\n-- This is an empty migration.\n\n",
 "demo/lab/p6/64/ghi-nhan.sql": "-- Records the column + index added by hand on 12 Nov 2026. Where they exist,\n-- this is marked --applied; on a clean database it really creates them.\nALTER TABLE \"posts\" ADD COLUMN IF NOT EXISTS \"ghi_chu_tam\" TEXT;\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\nCREATE INDEX IF NOT EXISTS \"posts_title_trgm\" ON \"posts\" USING gin (\"title\" gin_trgm_ops);\n",
 "demo/out/p6-4/nhan-resolve.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate resolve --applied 20261112070000_ghi_nhan_troi --schema p6/64/a/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/a/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64\", schema \"public\" at \"127.0.0.1:55491\"\n\nMigration 20261112070000_ghi_nhan_troi marked as applied.\n\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate diff --from-schema-datasource p6/64/a/prisma/schema.prisma --to-schema-datamodel p6/64/a/prisma/schema.prisma --script\n-- This is an empty migration.\n\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate status --schema p6/64/a/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/a/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64\", schema \"public\" at \"127.0.0.1:55491\"\n\n2 migrations found in prisma/migrations\n\nDatabase schema is up to date!\n",
 "demo/out/p6-4/nhan-sach.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64r npx prisma migrate deploy --schema p6/64/a/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/a/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64r\", schema \"public\" at \"127.0.0.1:55491\"\n\n2 migrations found in prisma/migrations\n\nApplying migration `20261112000713_khoi_tao`\nApplying migration `20261112070000_ghi_nhan_troi`\n\nThe following migration(s) have been applied:\n\nmigrations/\n  └─ 20261112000713_khoi_tao/\n    └─ migration.sql\n  └─ 20261112070000_ghi_nhan_troi/\n    └─ migration.sql\n      \nAll migrations have been successfully applied.\n$ docker exec prisma-pg psql -U student -d c64r -c '\\d posts'\n                               Table \"public.posts\"\n   Column    |  Type   | Collation | Nullable |              Default              \n-------------+---------+-----------+----------+-----------------------------------\n id          | integer |           | not null | nextval('posts_id_seq'::regclass)\n title       | text    |           | not null | \n body        | text    |           |          | \n author_id   | integer |           | not null | \n ghi_chu_tam | text    |           |          | \nIndexes:\n    \"posts_pkey\" PRIMARY KEY, btree (id)\n    \"posts_title_trgm\" gin (title gin_trgm_ops)\nForeign-key constraints:\n    \"posts_author_id_fkey\" FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT\n\n",
 "demo/out/p6-4/b-pull.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64b npx prisma db pull --schema p6/64/b/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/b/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64b\", schema \"public\" at \"127.0.0.1:55491\"\n\n- Introspecting based on datasource defined in p6/64/b/prisma/schema.prisma\n✔ Introspected 2 models and wrote them into p6/64/b/prisma/schema.prisma in 79ms\n      \n*** WARNING ***\n\nThese constraints are not supported by Prisma Client, because Prisma currently does not fully support check constraints. Read more: https://pris.ly/d/check-constraints\n  - Model: \"don_hang\", constraint: \"don_hang_tong_check\"\n\nRun prisma generate to generate Prisma Client.\n\n$ sed -n '/^model/,$p' p6/64/b/prisma/schema.prisma\nmodel don_hang {\n  id                                            Int         @id @default(autoincrement())\n  khach_hang_id                                 Int\n  nguoi_giao_id                                 Int?\n  tong                                          Decimal     @db.Decimal(12, 2)\n  trang_thai                                    String      @default(\"moi\") @db.VarChar(20)\n  khach_hang_don_hang_khach_hang_idTokhach_hang khach_hang  @relation(\"don_hang_khach_hang_idTokhach_hang\", fields: [khach_hang_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  khach_hang_don_hang_nguoi_giao_idTokhach_hang khach_hang? @relation(\"don_hang_nguoi_giao_idTokhach_hang\", fields: [nguoi_giao_id], references: [id], onDelete: NoAction, onUpdate: NoAction)\n\n  @@index([khach_hang_id], map: \"don_hang_khach_idx\")\n}\n\nmodel khach_hang {\n  id                                          Int        @id @default(autoincrement())\n  ho_ten                                      String     @db.VarChar(120)\n  email                                       String?    @unique @db.VarChar(200)\n  tao_luc                                     DateTime   @default(now()) @db.Timestamptz(6)\n  don_hang_don_hang_khach_hang_idTokhach_hang don_hang[] @relation(\"don_hang_khach_hang_idTokhach_hang\")\n  don_hang_don_hang_nguoi_giao_idTokhach_hang don_hang[] @relation(\"don_hang_nguoi_giao_idTokhach_hang\")\n}\n",
 "demo/out/p6-4/b-init.txt": "$ npx prisma migrate diff --from-empty --to-schema-datamodel p6/64/b/prisma/schema.prisma --script > p6/64/b/prisma/migrations/0_init/migration.sql\n$ wc -l p6/64/b/prisma/migrations/0_init/migration.sql\n      36 p6/64/b/prisma/migrations/0_init/migration.sql\n$ head -12 p6/64/b/prisma/migrations/0_init/migration.sql\n-- CreateSchema\nCREATE SCHEMA IF NOT EXISTS \"public\";\n\n-- CreateTable\nCREATE TABLE \"don_hang\" (\n    \"id\" SERIAL NOT NULL,\n    \"khach_hang_id\" INTEGER NOT NULL,\n    \"nguoi_giao_id\" INTEGER,\n    \"tong\" DECIMAL(12,2) NOT NULL,\n    \"trang_thai\" VARCHAR(20) NOT NULL DEFAULT 'moi',\n\n    CONSTRAINT \"don_hang_pkey\" PRIMARY KEY (\"id\")\n",
 "demo/out/p6-4/b-status-truoc.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64b npx prisma migrate status --schema p6/64/b/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/b/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64b\", schema \"public\" at \"127.0.0.1:55491\"\n\n1 migration found in prisma/migrations\nFollowing migration have not yet been applied:\n0_init\n\nTo apply migrations in development run prisma migrate dev.\nTo apply migrations in production run prisma migrate deploy.\n[exit 1]\n",
 "demo/out/p6-4/b-resolve.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64b npx prisma migrate resolve --applied 0_init --schema p6/64/b/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/b/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64b\", schema \"public\" at \"127.0.0.1:55491\"\n\nMigration 0_init marked as applied.\n\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64b npx prisma migrate diff --from-schema-datasource p6/64/b/prisma/schema.prisma --to-schema-datamodel p6/64/b/prisma/schema.prisma --script\n-- This is an empty migration.\n\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64b npx prisma migrate status --schema p6/64/b/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/64/b/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c64b\", schema \"public\" at \"127.0.0.1:55491\"\n\n1 migration found in prisma/migrations\n\nDatabase schema is up to date!\n$ docker exec prisma-pg psql -U student -d c64b -c 'SELECT count(*) FROM don_hang'\n count \n-------\n 20000\n(1 row)\n\n",
 "demo/out/p6-4/b-check.txt": "$ grep -n -i 'check' p6/64/b/prisma/migrations/0_init/migration.sql || echo '(0_init không có CHECK nào)'\n(0_init không có CHECK nào)\n$ docker exec prisma-pg psql -U student -d c64b -c '\\d don_hang' | grep -A2 -i check\nCheck constraints:\n    \"don_hang_tong_check\" CHECK (tong >= 0::numeric)\nForeign-key constraints:\n    \"don_hang_khach_hang_id_fkey\" FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)\n",
 "demo/out/p6-4/ignore-khong.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate diff --from-schema-datasource p6/64/a/prisma/schema.prisma --to-schema-datamodel p6/64/a/prisma/schema.prisma --script\n-- DropTable\nDROP TABLE \"events_raw\";\n\n",
 "demo/out/p6-4/ignore-co.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c64 npx prisma migrate diff --from-schema-datasource p6/64/a/prisma/schema.prisma --to-schema-datamodel p6/64/a/prisma/schema.prisma --script\n-- This is an empty migration.\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, tp, sql, two, box, cards, c, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-06-4', code: 'PR 6.4', title: 'Drift, and adopting a database that exists', sub: 'Chapter 6 · Lesson 6.4' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p6-4/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p6/64/${t}`, 'utf8').replace(/\n+$/, '');
const RAC = /^(Environment variables loaded|Prisma schema loaded|Datasource "db")/;
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/ --schema \S+/g, '').replace(/ --skip-generate/g, '').replace(/p6\/64\/[ab]\/prisma\//g, 'prisma/')
  .replace(/--from-schema-datasource prisma\/schema\.prisma --to-schema-datamodel prisma\/schema\.prisma --script/g, '--from-schema-datasource … --to-schema-datamodel … --script')
  .replace(/--shadow-database-url \S+/g, '--shadow-database-url …')
  .replace(/docker exec -i prisma-pg psql -U student -d (\w+)/g, 'psql $1').replace(/docker exec prisma-pg psql -U student -d (\w+)/g, 'psql $1')
  .split('\n').filter((l) => !/^\s*$/.test(l) && !RAC.test(l) && !/^\s*└─|^migrations\/$|^The following migration\(s\) have been applied|^\(\d+ rows?\)$|^-+$|^To apply migrations/.test(l)).join('\n');
const cat = (t, i) => gon(OUT(t)).split(/\n(?=\$ )/)[i];

export const slides = lamDeck({ chuong: 'Chapter 6 — Migrations', bai: '6.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 6 · Lesson 6.4', t: 'Drift, and adopting a database that exists', sub: 'Detect it without touching anything, respond in order of danger, and baseline a database older than Prisma' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Where drift comes from, and the two diffs that see it</li>
    <li>Which command notices drift — and which one does not</li>
    <li>Adopting a change: the schema line, the migration, <code>resolve --applied</code></li>
    <li>Baselining a database that predates Prisma: <code>0_init</code></li>
    <li>Drift you should keep, and the command never to type without thinking</li></ul>` },
  /* 3 */ { t: 'Where drift comes from', body: cards([
      ['Someone ran SQL by hand', 'A 2 a.m. hotfix in psql with no migration. Most common, usually harmless — just unrecorded.'],
      ['Someone ran db push', 'Changes the database, writes no migration.'],
      ['A migration failed half-way', 'Recorded as unfinished — P3009, Lesson 6.5.'],
      ['Another system owns some tables', 'Permanent, expected. Answer: <code>@@ignore</code> or a separate schema.'],
    ], 2) + sql(SRC('troi-tay.sql'), { sm: true }) },
  /* 4 */ { t: 'Detect it: the database against the schema', body: tp(gon(OUT('phat-hien')), { wrap: 120, fs: 16 }) +
      box('Read the direction', 'This is the SQL that would make the <em>database</em> match the <em>schema</em>. So every DROP names something the database has and your schema does not: the column and the trigram index from the hotfix.', 'lam') },
  /* 5 */ { t: 'Detect it: the database against the history', body: tp(gon(OUT('phat-hien-lichsu')), { wrap: 120, fs: 15 }) +
      box('Same drift, opposite sign', 'From the migrations to the live database: what the database has <em>beyond</em> its history — ADD, not DROP. Needs a shadow URL, because it replays the history.', 'lam') +
      cards([
        ['database → schema', 'DROP: what the database has that the schema lacks.'],
        ['migrations → database', 'ADD: what the database gained outside its history.'],
        ['Both read-only', 'Neither touches the target. Safe on production.'],
      ], 3) },
  /* 6 */ { t: 'Which command notices?', body: two(tp(gon(OUT('status')), { wrap: 70, fs: 14, title: 'migrate status — after the hotfix' }),
      tp(gon(OUT('dev-troi')).replace(/^The following is a summary.*\n/m, '').replace(/^It should be understood.*\n/m, ''), { wrap: 60, fs: 11, title: 'migrate dev — same database' }), '') +
      box('Status does not see drift', 'It only compares the folder with <code>_prisma_migrations</code>. The migration that replays history — <code>migrate dev</code> — sees it, and asks to reset. For a check that works on production, use the two diffs.', 'do2') },
  /* 7 */ { t: 'Three responses, in order of danger', body: cards([
      ['1 · Adopt it — safest, usually right', 'Put the change into the schema and into a migration marked as applied. Nothing in the database is touched.'],
      ['2 · Remove it — safe if understood', 'A normal forward migration that undoes it, reviewed and deployed. Leaves a record.'],
      ['3 · Reset — destroys everything', '<code>migrate reset</code> drops the database and replays history. For a local database only.'],
    ], 3) + box('Ask one question first', 'Do we want to keep this change? Yes → adopt it. No → remove it with a reviewed migration. Reset is never the answer on anything shared.', 'lam') },
  /* 8 */ { t: 'Adopt, step A: a schema line that really matches', body: two(prs(`@@index([title], map: "posts_title_trgm")`, { sm: true }) + tp(gon(OUT('nhan-web')), { wrap: 70, fs: 13, title: 'diff — the obvious line' }),
      prs(`@@index([title(ops: raw("gin_trgm_ops"))],
        map: "posts_title_trgm", type: Gin)`, { sm: true }) + tp(gon(OUT('nhan-dung')), { wrap: 70, fs: 13, title: 'diff — the matching line' }), '') +
      box('The name is not enough', 'Without the operator class and index type, Prisma reads a B-tree and plans to drop the GIN index and build a different one.', 'do2') },
  /* 9 */ { t: 'Adopt, steps B and C: record it, mark it applied', body: two(sql(SRC('ghi-nhan.sql').replace(/^-- Records[^\n]*\n-- this is[^\n]*$/m, '-- records the 12 Nov hand-made column + index:\n-- --applied where they exist, real CREATE elsewhere').replace(/ ON "posts" USING/, '\n  ON "posts" USING').replace(' ADD COLUMN IF NOT EXISTS', '\n  ADD COLUMN IF NOT EXISTS'), { sm: true }) + tp(gon(OUT('nhan-resolve')).replace(/ --from-schema-datasource … --to-schema-datamodel … --script/, ' …'), { wrap: 64, fs: 12 }),
      tp(gon(OUT('nhan-sach')).split('\n').filter((l) => /^\$|^Applying|^All migrations| ghi_chu_tam |posts_title_trgm/.test(l)).join('\n'), { wrap: 56, fs: 12, title: 'a clean database built from the history' }), '') +
      box('IF NOT EXISTS keeps the migration honest', 'A no-op where the objects exist, a real CREATE on a clean database — so history replays again.', 'xanh') },
  /* 10 */ { t: 'Baselining, step 1: introspect', body: tp(cat('b-pull', 0).split('\n').filter((l) => !/^- Introspecting|^Run prisma generate/.test(l)).join('\n'), { wrap: 120, fs: 13 }) +
      tp(cat('b-pull', 1).replace(/^\$ .*$/m, '$ cat prisma/schema.prisma   # one of the two models').replace(/\nmodel khach_hang \{[\s\S]*$/, ''), { wrap: 150, fs: 10 }) +
      box('Step 2 is the slow one: rename by hand', 'Machine names like <code>khach_hang_don_hang_khach_hang_idTokhach_hang</code>. Add <code>@map</code>, <code>@@map</code> and relation names once — later pulls keep them.', 'lam') },
  /* 11 */ { t: 'Baselining, steps 3–5: 0_init, mark applied, verify', body: two(tp(cat('b-init', 0).replace(/ --to-schema-datamodel prisma\/schema\.prisma --script > /, ' --to-schema-datamodel … --script >\n    ') + '\n' + cat('b-init', 1), { wrap: 64, fs: 12 }) + tp(gon(OUT('b-status-truoc')), { wrap: 64, fs: 12 }),
      tp(gon(OUT('b-resolve')).replace(/ --from-schema-datasource … --to-schema-datamodel … --script/, ' …').replace(/^\s*count\s*$/m, ''), { wrap: 60, fs: 12 }), '') +
      box('resolve --applied runs no SQL', 'It writes one row into <code>_prisma_migrations</code>. Do it in every environment — miss one and the next deploy there tries to CREATE tables that exist.', 'lam') },
  /* 12 */ { t: 'A baseline is a snapshot — of what Prisma can see', body: tp(gon(OUT('b-check')), { wrap: 120, fs: 16 }) +
      box('The CHECK lives in the database, not in 0_init', 'A database rebuilt from this history has no <code>tong &gt;= 0</code> rule. Add such objects to <code>0_init</code> by hand before you commit it.', 'do2') +
      cards([
        ['Comes through', 'Tables, columns, defaults, primary and foreign keys, plain indexes.'],
        ['Left behind', 'CHECK constraints, triggers, partial and expression indexes, RLS policies.'],
        ['So compare', '<code>pg_dump --schema-only</code> of the old database against a database built from <code>0_init</code>.'],
      ], 3) },
  /* 13 */ { t: 'Drift you should keep: @@ignore', body: two(tp(gon(OUT('ignore-khong')), { wrap: 70, fs: 13, title: 'events_raw exists, not in the schema' }),
      prs(`/// Owned by the analytics pipeline. Do not migrate.
model events_raw {
  id   BigInt   @id
  ts   DateTime
  data Json

  @@ignore
}`, { sm: true }) + tp(gon(OUT('ignore-co')), { wrap: 70, fs: 13, title: 'with the @@ignore model' }), '') +
      box('Or keep it out of reach', 'A separate PostgreSQL schema not listed in <code>schemas</code>, or a database role with no rights on those tables.', 'lam') },
  /* 14 */ { t: 'The command never to type without thinking', body: tp(cat('dev-troi', 0).split('\n').slice(-4).join('\n').replace(/^/, '$ npx prisma migrate dev   # the drifted database\n…\n'), { wrap: 120, fs: 16 }) +
      cards([
        ['migrate reset drops everything', 'Right tool on your laptop; an incident on staging; a restore-from-backup on production.'],
        ['Keep production credentials off your machine', 'A URL that is not in any local <code>.env</code> cannot be typed by accident.'],
        ['Print the target first', '<code>node -e "console.log(process.env.DATABASE_URL)"</code> before anything destructive.'],
      ], 3) },
  /* 15 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Hotfix a column and an index by hand; run both diffs`,
      `Compare ${c('migrate status')} with ${c('migrate dev')} on the drifted database`,
      `Adopt the change: matching schema line, IF NOT EXISTS migration, ${c('resolve --applied')}`,
      `Baseline a database built by plain SQL; check what ${c('0_init')} left out`,
    ]), box('Keep these', `<ul><li>Status does not see drift — diff does</li><li>Adopt with a schema line that truly matches</li><li>${c('resolve --applied')} runs no SQL</li><li>0_init misses CHECKs</li></ul>`, 'lam'), '') },
]);
