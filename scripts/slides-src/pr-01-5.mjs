/**
 * pr-01-5 — Prisma ORM · Chapter 1 · Lesson 1.5 "Three workflows: push, migrate, pull" (deck video, 12/11/2026). Bài web: pr-1-5-ba-luong.
 * Output THẬT (`chay.sh p1-5`, dự án demo/p02/hoc-prisma, posts 120.200 hàng, Prisma 6.19.3):
 * db push (thêm cột bắt buộc slug) ⇒ "We found changes that cannot be executed … 120200 rows" + gợi ý --force-reset "All data will be lost";
 * migrate dev không có TTY ⇒ "detected that the environment is non-interactive"; migrate diff ⇒ SQL Prisma sinh (ADD COLUMN … NOT NULL);
 * migration viết tay 3 bước (20261112000000_them_slug) ⇒ status "not yet been applied" ⇒ migrate deploy áp dụng ⇒ diff "This is an empty migration"
 * ⇒ slug = post-203…; db pull --print với lược đồ trống ⇒ model posts / users (tên bảng, created_at, quan hệ "users").
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p1-5/push.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma db push --skip-generate < /dev/null\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\nPrisma schema loaded from prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"hocprisma\", schema \"public\" at \"127.0.0.1:55491\"\n\nError: \n⚠️ We found changes that cannot be executed:\n\n  • Added the required column `slug` to the `posts` table without a default value. There are 120200 rows in this table, it is not possible to execute this step.\n\nYou may use the --force-reset flag to drop the database before push like prisma db push --force-reset\nAll data will be lost.\n      \n[exit 1]\n",
 "demo/out/p1-5/mig-dev.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma migrate dev --name them_slug --create-only < /dev/null\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\nPrisma schema loaded from prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"hocprisma\", schema \"public\" at \"127.0.0.1:55491\"\n\n\n\n⚠️ We found changes that cannot be executed:\n\n  • Step 0 Added the required column `slug` to the `posts` table without a default value. There are 120200 rows in this table, it is not possible to execute this step.\n\n\n⚠️  Warnings for the current datasource:\n\n  • A unique constraint covering the columns `[slug]` on the table `posts` will be added. If there are existing duplicate values, this will fail.\n\nError: Prisma Migrate has detected that the environment is non-interactive, which is not supported.\n\n`prisma migrate dev` is an interactive command designed to create new migrations and evolve the database in development.\nTo apply existing migrations in deployments, use prisma migrate deploy.\nSee https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-deploy\n[exit 1]\n",
 "demo/out/p1-5/diff-truoc.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\n-- AlterTable\nALTER TABLE \"posts\" ADD COLUMN     \"slug\" TEXT NOT NULL;\n\n-- CreateIndex\nCREATE UNIQUE INDEX \"posts_slug_key\" ON \"posts\"(\"slug\");\n\n",
 "demo/out/p1-5/mig-sql.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL cat prisma/migrations/20261112000000_them_slug/migration.sql\n-- Prisma sinh ra; rồi người sửa lại, và đó mới là điểm mấu chốt\n-- 1. Thêm ở dạng cho phép null, để các hàng cũ sống sót\nALTER TABLE \"posts\" ADD COLUMN \"slug\" TEXT;\n\n-- 2. Đổ dữ liệu vào từ thứ vốn đã có\nUPDATE \"posts\" SET \"slug\" = 'post-' || \"id\" WHERE \"slug\" IS NULL;\n\n-- 3. Giờ mới thoả được ràng buộc\nALTER TABLE \"posts\" ALTER COLUMN \"slug\" SET NOT NULL;\nCREATE UNIQUE INDEX \"posts_slug_key\" ON \"posts\"(\"slug\");\n",
 "demo/out/p1-5/status-truoc.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma migrate status | grep -v -e '^$' -e config | tail -4\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\nFollowing migration have not yet been applied:\n20261112000000_them_slug\nTo apply migrations in development run prisma migrate dev.\nTo apply migrations in production run prisma migrate deploy.\n",
 "demo/out/p1-5/deploy.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma migrate deploy | grep -v -e '^$' -e config\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\nPrisma schema loaded from prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"hocprisma\", schema \"public\" at \"127.0.0.1:55491\"\n3 migrations found in prisma/migrations\nApplying migration `20261112000000_them_slug`\nThe following migration(s) have been applied:\nmigrations/\n  └─ 20261112000000_them_slug/\n    └─ migration.sql\n      \nAll migrations have been successfully applied.\n",
 "demo/out/p1-5/diff.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script | grep -v -e config -e '^$'\nLoaded Prisma config from prisma.config.ts.\n\nPrisma config detected, skipping environment variable loading.\n-- This is an empty migration.\n",
 "demo/out/p1-5/slug.txt": "$ docker exec prisma-pg psql -U student -d hocprisma -c 'SELECT id, slug FROM posts ORDER BY id LIMIT 3;'\n id  |   slug   \n-----+----------\n 203 | post-203\n 204 | post-204\n 205 | post-205\n(3 rows)\n\n",
 "demo/out/p1-5/pull-tho.txt": "$ npx prisma db pull --print --schema prisma/trong.prisma   # lược đồ chỉ có datasource\nmodel posts {\n  id         Int      @id @default(autoincrement())\n  title      String\n  body       String?\n  published  Boolean  @default(false)\n  views      Int      @default(0)\n  created_at DateTime @default(now())\n  author_id  Int\n  slug       String   @unique\n  users      users    @relation(fields: [author_id], references: [id], onDelete: Cascade)\n\n  @@index([author_id])\n}\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, sql, prs, tp, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-01-5', code: 'PR 1.5', title: 'Three workflows: push, migrate, pull', sub: 'Chapter 1 · Lesson 1.5' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p1-5/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ cd \.\.\/p02\/hoc-prisma && env -u DATABASE_URL /gm, '$ ').split('\n')
  .filter((l) => l.trim() && !/config detected|Loaded Prisma config|Prisma schema loaded|^Datasource/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — What an ORM actually is', bai: '1.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 1 · Lesson 1.5', t: 'Three workflows:<br>push, migrate, pull', sub: 'Three ways to make schema and database agree — choose wrong and nobody can rebuild your database' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Which way the truth flows in <code>db push</code>, <code>migrate</code> and <code>db pull</code></li>
    <li><code>db push</code> on 120,200 rows — what it refuses, and what it offers</li>
    <li>The migrate path: generated SQL → hand-edited → <code>migrate deploy</code> → empty diff</li>
    <li>When <code>migrate dev</code> is the thing that is broken (CuongThai)</li>
    <li><code>db pull</code>: adopting a database that already exists</li></ul>` },
  /* 3 */ { t: 'Three workflows at a glance', body: tbl(['Workflow', 'Source of truth', 'What it does', 'Leaves behind'], [
      ['<code>db push</code>', 'schema', 'make the database match the schema, now, at any cost', 'nothing — no file, no history'],
      ['<code>migrate dev</code> / <code>deploy</code>', 'schema', 'compute the SQL difference, write it to a file, apply it, remember it ran', 'a reviewable SQL file + a row in <code>_prisma_migrations</code>'],
      ['<code>db pull</code>', 'database', 'read the live database and rewrite the schema to match', 'a schema file you then rename by hand'],
    ]) },
  /* 4 */ { t: 'db push on a table with 120,200 rows', to: true, giua: true, body: tp(gon(OUT('push')), { wrap: 120 }) +
    box('Read the offer carefully', 'A required column with no default cannot be added to existing rows, so push stops — and offers <code>--force-reset</code>: <b>drop the database</b>, then push. “All data will be lost” means exactly that.', 'do2') },
  /* 5 */ { t: 'What db push is — and is not — for', body: cards([
      ['✅ Good for', 'Prototyping, when the schema changes ten times an hour and the data is disposable; a throwaway test database in CI.'],
      ['👻 Leaves nothing', 'No file, no row in <code>_prisma_migrations</code>. A teammate runs <code>migrate dev</code> and sees drift nobody can explain.'],
      ['⛔ Never on production', 'The CuongThai repository forbids <code>prisma db push</code> against production: it bypasses migration history.'],
    ], 3) },
  /* 6 */ { t: 'migrate dev needs a human — and a shadow database', body: tp(gon(OUT('mig-dev')), { wrap: 120, fs: 13 }) +
    box('Interactive by design', 'It warns about the same impossible step, then refuses to run without a terminal: <code>migrate dev</code> is for a developer at a keyboard. In a deploy you use <code>migrate deploy</code>.', 'lam') },
  /* 7 */ { t: 'Step 1 — the SQL Prisma would generate', body: two('<div>' + prs(`model Post {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique   // new: required + unique
  body      String?
  // … published, views, createdAt, author
  @@map("posts")
}`, { sm: true }) + `<div class="cap">the one-line change in schema.prisma</div></div>`, box('Why diff, not migrate dev', '<code>migrate diff</code> prints the SQL between the database and the schema and applies <b>nothing</b>. You read it first — on 120,200 rows that matters.', 'lam'), 'r64') + tp(gon(OUT('diff-truoc')), { wrap: 120, title: 'npx prisma migrate diff --from-schema-datasource … --to-schema-datamodel … --script' }) +
    box('Correct SQL — that cannot run here', '<code>ADD COLUMN "slug" TEXT NOT NULL</code> on 120,200 existing rows has nothing to put in them. This is where you edit the migration before it runs.', 'do2') },
  /* 8 */ { t: 'Step 2 — the migration, edited by a human', body: sql(OUT('mig-sql').replace(/^\$ .*\n/, ''), { hl: [3, 6, 9, 10] }) +
    box('Nullable → backfill → constrain', 'The whole difference between push and migrate: a file you can open, review in a pull request, and fix <b>before</b> it runs.', 'xanh') },
  /* 9 */ { t: 'Step 3 — status, deploy, and an empty diff', body: two(tp(gon(OUT('status-truoc')).replace(/^\$ .*$/m, '$ npx prisma migrate status'), { wrap: 52 }) + tp(gon(OUT('deploy')).replace(/^\$ .*$/m, '$ npx prisma migrate deploy'), { wrap: 52 }),
      tp(gon(OUT('diff')).replace(/^\$ .*$/m, '$ npx prisma migrate diff … --script'), { wrap: 52 }) + tp(OUT('slug').replace(/^\$ .*$/m, '$ psql -c "SELECT id, slug FROM posts …"'), { wrap: 52 }), '') +
    box('The four migrate commands', '<b>dev</b> — create + apply, development only · <b>deploy</b> — apply pending, nothing else · <b>status</b> — what ran, what waits · <b>diff</b> — SQL between two states; empty = no drift.', 'lam') },
  /* 10 */ { t: 'From CuongThai: when migrate dev is what is broken', to: true, giua: true, body: box('A migration that can never replay', 'Migration <code>20260706130000_add_music_and_profile</code> creates a UNIQUE constraint named <code>post_music_post_id_key</code>, then a plain index with the same name. PostgreSQL accepted it once; on a clean shadow database it collides with itself, so <code>migrate dev</code> fails with P3006 in that repository.', 'do2') +
    box('The workaround is exactly what you just did', 'The migration is deployed, so it must not be edited. New migrations there are written by hand into <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code>, applied with <code>migrate deploy</code> (no shadow database), and checked with <code>migrate diff</code> — empty means done.', 'xanh') },
  /* 11 */ { t: 'db pull — the database is the source', body: prs(OUT('pull-tho').replace(/^\$ .*\n/, ''), { sm: true, hl: [7, 10] }) + `<div class="cap">npx prisma db pull --print with an empty schema (datasource only)</div>` + two(
      box('Obviously machine-written', 'Table names, not model names. <code>created_at</code>, not <code>createdAt</code>. A relation field called <code>users</code>. Introspection cannot invent your conventions — but once you add <code>@map</code> / <code>@@map</code>, it keeps them.', 'lam'),
      box('What it cannot see', 'A relationship without a foreign-key constraint becomes two unrelated fields; add <code>@relation</code> yourself. Chapter 6 covers adopting a live database fully.', ''), '') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Add a required ${c('slug')} column; try ${c('db push')} — read the offer`,
      `${c('migrate diff --script')} to see the generated SQL`,
      `Write the 3-step migration by hand; ${c('migrate deploy')}`,
      `${c('migrate diff')} again — expect “empty migration”`,
      `${c('db pull --print')} with an empty schema; rename by hand`,
    ]), box('Keep these', `<ul><li>push = fast, no history, prototyping only</li><li>migrate = a reviewable file; ${c('deploy')} is the production command</li><li>A hand-edited migration beats data loss</li><li>pull = adopt what exists, then add your names</li></ul>`, 'lam'), '') },
]);
