/**
 * pr-06-2 — Prisma ORM · Chapter 6 · Lesson 6.2 "The shadow database" (deck video, 12/11/2026). Bài web: pr-6-2-shadow-database.
 * Output THẬT (`chay.sh p6-2`, demo/lab/p6/62, CSDL c62/c62t/c62u/c62d/c62c, Prisma 6.19.3 · PostgreSQL 16.14): shadow prisma_migrate_shadow_db_<uuid>
 * thấy được trong lúc migrate dev, 0 còn lại sau đó · vai trò không CREATEDB ⇒ P3014 · shadowDatabaseUrl chữa · trỏ shadow vào CSDL có 5.000 đơn ⇒ bảng
 * biến mất · hai dòng 48–49 của add_music_and_profile (CuongThai) phát lại ⇒ "relation already exists" ⇒ migrate dev P3006, diff --from-migrations P3006 ·
 * migrate deploy chạy được với vai trò không CREATEDB và áp được migration viết tay · migrate diff rỗng = "-- This is an empty migration."
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p6-2/nhin-shadow.txt": "$ bash p6/62/nhin-shadow.sh\ntrong lúc migrate dev chạy: prisma_migrate_shadow_db_d3ab51e3-1fe2-49c4-a1c4-3453cf7e72b2\nmigrate dev xong (exit 0)\nsau đó: 0 CSDL shadow còn lại\nApplying migration `20261112000311_them_phone`\nYour database is now in sync with your schema.\n",
 "demo/out/p6-2/p3014.txt": "$ DATABASE_URL=postgresql://thue:matkhau@127.0.0.1:55491/c62t npx prisma migrate dev --name khoi_tao --schema p6/62/b/prisma/schema.prisma --skip-generate\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/b/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62t\", schema \"public\" at \"127.0.0.1:55491\"\n\nError: P3014\n\nPrisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. Read more about the shadow database (and workarounds) at https://pris.ly/d/migrate-shadow\n\nOriginal error: \nERROR: permission denied to create database\n   0: schema_core::state::DevDiagnostic\n             at schema-engine/core/src/state.rs:319\n\n[exit 1]\n",
 "demo/out/p6-2/shadow-url.txt": "$ DATABASE_URL=postgresql://thue:matkhau@127.0.0.1:55491/c62t SHADOW_DATABASE_URL=postgresql://thue:matkhau@127.0.0.1:55491/c62t_shadow npx prisma migrate dev --name khoi_tao --schema p6/62/b/prisma/schema.prisma --skip-generate\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/b/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62t\", schema \"public\" at \"127.0.0.1:55491\"\n\nApplying migration `20261112000313_khoi_tao`\n\nThe following migration(s) have been created and applied from new schema changes:\n\np6/62/b/prisma/migrations/\n  └─ 20261112000313_khoi_tao/\n    └─ migration.sql\n\nYour database is now in sync with your schema.\n\n",
 "demo/out/p6-2/bay.txt": "$ docker exec prisma-pg psql -U student -d c62d -c 'SELECT count(*) FROM don_hang'\n count \n-------\n  5000\n(1 row)\n\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62 SHADOW_DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62d npx prisma migrate dev --name them_name --schema p6/62/a/prisma/schema.prisma --skip-generate\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/a/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62\", schema \"public\" at \"127.0.0.1:55491\"\n\nApplying migration `20261112000316_them_name`\n\nThe following migration(s) have been created and applied from new schema changes:\n\np6/62/a/prisma/migrations/\n  └─ 20261112000316_them_name/\n    └─ migration.sql\n\nYour database is now in sync with your schema.\n\n$ docker exec prisma-pg psql -U student -d c62d -c 'SELECT count(*) FROM don_hang'\nERROR:  relation \"don_hang\" does not exist\nLINE 1: SELECT count(*) FROM don_hang\n                             ^\n[exit 1]\n",
 "demo/out/p6-2/cuongthai-dong.txt": "$ grep -n 'post_music_post_id_key' ~/Downloads/api-backend/prisma/migrations/20260706130000_add_music_and_profile/migration.sql\n48:ALTER TABLE \"post_music\" ADD CONSTRAINT \"post_music_post_id_key\" UNIQUE (\"post_id\");\n49:CREATE INDEX \"post_music_post_id_key\" ON \"post_music\"(\"post_id\");\n",
 "demo/out/p6-2/phat-lai.txt": "$ docker exec -i prisma-pg psql -U student -d c62x < p6/62/c-mig/2_add_music/migration.sql\nCREATE TABLE\nALTER TABLE\nERROR:  relation \"post_music_post_id_key\" already exists\n",
 "demo/out/p6-2/c-resolve.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62c npx prisma migrate resolve --applied 1_khoi_tao --schema p6/62/c/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/c/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62c\", schema \"public\" at \"127.0.0.1:55491\"\n\nMigration 1_khoi_tao marked as applied.\n\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62c npx prisma migrate resolve --applied 2_add_music --schema p6/62/c/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/c/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62c\", schema \"public\" at \"127.0.0.1:55491\"\n\nMigration 2_add_music marked as applied.\n\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62c npx prisma migrate status --schema p6/62/c/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/c/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62c\", schema \"public\" at \"127.0.0.1:55491\"\n\n2 migrations found in prisma/migrations\n\nDatabase schema is up to date!\n",
 "demo/out/p6-2/c-dev.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62c npx prisma migrate dev --name bat_ky --schema p6/62/c/prisma/schema.prisma --skip-generate\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/c/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62c\", schema \"public\" at \"127.0.0.1:55491\"\n\nError: P3006\n\nMigration `2_add_music` failed to apply cleanly to the shadow database. \nError:\nERROR: relation \"post_music_post_id_key\" already exists\n   0: schema_core::state::DevDiagnostic\n             at schema-engine/core/src/state.rs:319\n\n[exit 1]\n",
 "demo/out/p6-2/c-diff-lichsu.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62c npx prisma migrate diff --from-migrations p6/62/c/prisma/migrations --to-schema-datasource p6/62/c/prisma/schema.prisma --shadow-database-url postgresql://student:matkhau@127.0.0.1:55491/c62c_shadow --script\nError: P3006\n\nMigration `2_add_music` failed to apply cleanly to the shadow database. \nError:\nERROR: relation \"post_music_post_id_key\" already exists\n\n\n[exit 1]\n",
 "demo/out/p6-2/deploy-thue.txt": "$ DATABASE_URL=postgresql://thue:matkhau@127.0.0.1:55491/c62u npx prisma migrate deploy --schema p6/62/b/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/b/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62u\", schema \"public\" at \"127.0.0.1:55491\"\n\n1 migration found in prisma/migrations\n\nApplying migration `20261112000313_khoi_tao`\n\nThe following migration(s) have been applied:\n\nmigrations/\n  └─ 20261112000313_khoi_tao/\n    └─ migration.sql\n      \nAll migrations have been successfully applied.\n",
 "demo/out/p6-2/c-deploy.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62c npx prisma migrate deploy --schema p6/62/c/prisma/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p6/62/c/prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"c62c\", schema \"public\" at \"127.0.0.1:55491\"\n\n3 migrations found in prisma/migrations\n\nApplying migration `3_them_phone`\n\nThe following migration(s) have been applied:\n\nmigrations/\n  └─ 3_them_phone/\n    └─ migration.sql\n      \nAll migrations have been successfully applied.\n",
 "demo/out/p6-2/c-diff.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c62c npx prisma migrate diff --from-schema-datasource p6/62/c/prisma/schema.prisma --to-schema-datamodel p6/62/c/prisma/schema.prisma --script\n-- This is an empty migration.\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-06-2', code: 'PR 6.2', title: 'The shadow database', sub: 'Chapter 6 · Lesson 6.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p6-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const RAC = /^(Environment variables loaded|Prisma schema loaded|Datasource "db"|\s+0: schema_core|\s+at schema-engine)/;
const gon = (s) => s.replace(/postgresql:\/\/(\w+):matkhau@127\.0\.0\.1:55491\//g, 'postgresql://$1:…@localhost/')
  .replace(/^\$ DATABASE_URL=\S+ (SHADOW_DATABASE_URL=\S+ )?/gm, (m, sh) => '$ ' + (sh || ''))
  .replace(/ --schema \S+/g, '').replace(/ --skip-generate/g, '').replace(/p6\/62\/[a-c]\/prisma\//g, 'prisma/')
  .split('\n').filter((l) => !/^\s*$/.test(l) && !RAC.test(l)).join('\n');
const cat = (t, i) => gon(OUT(t)).split(/\n(?=\$ )/)[i];

export const slides = lamDeck({ chuong: 'Chapter 6 — Migrations', bai: '6.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 6 · Lesson 6.2', t: 'The shadow database', sub: 'The throw-away database migrate dev builds, replays and drops — and why production never needs one' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The five steps of <code>migrate dev</code> — seen live</li>
    <li>P3014 on hosted databases, and <code>shadowDatabaseUrl</code></li>
    <li>The trap: a shadow URL that holds real data</li>
    <li>A history that cannot replay — straight from the CuongThai repo</li>
    <li>Why <code>migrate deploy</code> needs none, and <code>migrate diff</code></li></ul>` },
  /* 3 */ { t: 'What migrate dev actually does', body: steps([
      `<b>Create</b> an empty database ${c('prisma_migrate_shadow_db_…')} — needs CREATE DATABASE`,
      `<b>Replay</b> every migration into it, in order, from the first`,
      `<b>Diff</b> shadow ↔ ${c('schema.prisma')} → the SQL of your new migration`,
      `<b>Diff</b> shadow ↔ the real database → drift (Lesson 6.4)`,
      `<b>Drop</b> the shadow, write the file, apply it`,
    ]) + box('Steps 2 and 4 are the point', 'Step 2 proves a clean database can be rebuilt from history. Step 4 proves the real database still matches that history.', 'lam') },
  /* 4 */ { t: 'Catching it in the act', body: sql(`# watch pg_database every few milliseconds while migrate dev runs
npx prisma migrate dev --name them_phone &
SELECT datname FROM pg_database WHERE datname LIKE 'prisma_migrate_shadow%';`, { sm: true }) +
      tp(gon(OUT('nhin-shadow')), { wrap: 110, fs: 16 }) +
      box('Created, used, dropped — in seconds', 'You never see it unless you look while it runs. Afterwards: zero shadow databases left.', 'xanh') },
  /* 5 */ { t: 'Why it fails on a hosted database', body: sql(`CREATE ROLE thue LOGIN PASSWORD '…' NOCREATEDB;   -- may log in, may not create databases
CREATE DATABASE c62t OWNER thue;                    -- its one database, created for it`, { sm: true }) + tp(gon(OUT('p3014')), { wrap: 112, fs: 15, title: 'role "thue" — LOGIN, NOCREATEDB (like a Supabase / Neon / RDS user)' }) +
      cards([
        ['The provider withholds CREATE DATABASE', 'Your account can do anything inside its database and nothing outside it. Correct security — and step 1 becomes impossible.'],
        ['Not your code, not your schema', 'The migration you wanted is fine. Prisma simply cannot build the throw-away copy.'],
      ], 2) },
  /* 6 */ { t: 'The fix: shadowDatabaseUrl', body: two(prs(`datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}`, { sm: true }) + sql(`-- made ONCE, empty, by an admin
CREATE DATABASE c62t_shadow OWNER thue;`, { sm: true }),
      tp(gon(OUT('shadow-url')), { wrap: 60, fs: 12 }), '') +
      box('Prisma wipes and reuses it instead of creating one', 'That is the whole fix — and the reason the next slide matters.', 'lam') },
  /* 7 */ { t: 'Trap: a shadow URL that holds data', body: tp(gon(OUT('bay')).replace(/\$ docker exec prisma-pg psql -U student -d c62d -c/g, '$ psql c62d -c'), { wrap: 120, fs: 13 }) +
      box('5,000 orders gone — and the command said success', 'Prisma emptied <code>c62d</code> because wiping the shadow is its job. Point it at staging and the first migration erases staging. The shadow URL belongs in your local <code>.env</code> only.', 'do2') },
  /* 8 */ { t: 'A history that cannot replay', body: tp(gon(OUT('cuongthai-dong')).replace(/~\/Downloads\/api-backend\//, ''), { wrap: 150, fs: 13, title: 'the CuongThai repository — read only' }) +
      tp(gon(OUT('phat-lai')).replace(/docker exec -i prisma-pg psql -U student -d c62x </, 'psql fresh_db <'), { wrap: 110, fs: 15, title: 'the same two lines on a clean database' }) +
      box('A UNIQUE constraint creates an index of that name', 'So a second index with the same name can never be created on a clean database. Production got past it once; a fresh database never will.', 'do2') },
  /* 9 */ { t: 'So migrate dev fails — forever, in that repo', body: tp(gon(OUT('c-resolve')).split('\n').slice(-2).join('\n').replace(/^/, '$ npx prisma migrate status\n') + '\n' + gon(OUT('c-dev')), { wrap: 112, fs: 14 }) +
      tp(gon(OUT('c-diff-lichsu')).replace(/--shadow-database-url \S+/, '--shadow-database-url …'), { wrap: 112, fs: 13, title: 'migrate diff --from-migrations replays too — same error' }) +
      box('The real database is fine; the history is not', 'Status says up to date. Only tools that replay history into a clean database fail. The migration is deployed, so it must not be edited — the way out is Lesson 6.3.', 'lam') },
  /* 10 */ { t: 'Production does not use a shadow database', body: two(tp(gon(OUT('deploy-thue')), { wrap: 70, fs: 13, title: 'role without CREATEDB — migrate deploy' }),
      tp(gon(OUT('c-deploy')), { wrap: 70, fs: 13, title: 'the broken-history repo — hand-written 3_them_phone' }), '') +
      cards([
        ['No shadow, no diff', 'Reads the folder, reads the table, runs what is missing.'],
        ['Never asks, never resets', 'Built for a pipeline, where a prompt is a hung job.'],
        ['The escape hatch', 'Applies a hand-written migration even where migrate dev cannot run.'],
      ], 3) },
  /* 11 */ { t: 'migrate diff — the "did that work?" command', body: tp(gon(OUT('c-diff')), { wrap: 130, fs: 14 }) +
      tbl(['--from', '--to', 'Answers'], [
        [c('--from-schema-datasource'), c('--to-schema-datamodel'), 'Does the live database match my schema? (empty = yes)'],
        [c('--from-migrations'), c('--to-schema-datasource'), 'Does it match my migration history? (needs a shadow URL)'],
        [c('--from-empty'), c('--to-schema-datamodel'), 'What SQL builds this schema from nothing? (Lesson 6.4)'],
      ]) + box('Read-only', 'It never touches the target. Reach for it first whenever you are unsure what state something is in.', 'xanh') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Watch ${c('pg_database')} while ${c('migrate dev')} runs`,
      `Create a role without CREATEDB; get P3014; fix with ${c('shadowDatabaseUrl')}`,
      `Replay the two CuongThai lines on a clean database`,
      `Apply a hand-written migration with ${c('migrate deploy')}; prove it with ${c('migrate diff')}`,
    ]), box('Keep these', `<ul><li>Shadow = replay history on a clean copy</li><li>P3014 ⇒ ${c('shadowDatabaseUrl')}</li><li>Shadow URL gets wiped — local only</li><li>Deploy never needs a shadow</li></ul>`, 'lam'), '') },
]);
