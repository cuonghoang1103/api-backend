/**
 * pr-11-3 — Prisma ORM · Chapter 11 · Lesson 11.3 "Migrations in the deploy, and the window where both versions run" (deck video, 12/11/2026). Bài web: pr-11-3-migration-khi-deploy.
 * Output THẬT (`chay.sh p11-3` → out/p11-3/khoa.txt; prisma-pg PostgreSQL 16.14, CSDL c113, 200.000 users; Prisma 6.19.3; Mac arm64):
 * migrate diff đổi tên một bước ⇒ DROP COLUMN full_name + ADD COLUMN ho_ten NOT NULL · RENAME ⇒ mã cũ P2022 cả đọc lẫn ghi · ADD NOT NULL không default ⇒ ERROR contains null values ·
 * ADD cột NULL / NOT NULL DEFAULT ⇒ mã cũ OK · giao dịch dài 10 s: ALTER không lock_timeout chờ 9 s, SELECT thường bị kẹt tới statement_timeout 5 s; lock_timeout 2s ⇒ ALTER huỷ sau 2 s, SELECT 1 s ·
 * file migration chỉ một câu CONCURRENTLY ⇒ áp được; hai câu ⇒ P3018 / 25001 "cannot run inside a transaction block"; migrate status exit=1 · --to-database-url ⇒ unknown option.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p11-3/khoa.txt": "$ bash p11/113/chay.sh\n$ npx prisma migrate deploy   # v1: bảng users\nThe following migration(s) have been applied:\nAll migrations have been successfully applied.\n$ psql -c \"SELECT count(*) FROM users\"\n200000\n\n== 1. Đổi tên MỘT bước: Prisma sinh gì?\n$ npx prisma migrate diff --from-schema-datamodel v1/… --to-schema-datamodel v2/… --script\n-- AlterTable\nALTER TABLE \"users\" DROP COLUMN \"full_name\",\nADD COLUMN     \"ho_ten\" TEXT NOT NULL;\n\n== 2. Cửa sổ: lược đồ MỚI đã áp, mã CŨ vẫn chạy\n$ psql -c \"ALTER TABLE users RENAME COLUMN full_name TO ho_ten\"   # (đổi tên kiểu \"giữ dữ liệu\", vẫn vỡ mã cũ)\n$ npx tsx cu.mts   # mã CŨ\nfindFirst: P2022 — The column `users.full_name` does not exist in the current database.\ncreate   : P2022 — The column `full_name` does not exist in the current database.\n$ psql -c \"ALTER TABLE users ADD COLUMN phone TEXT NOT NULL\"   # cột NOT NULL không default\nERROR:  column \"phone\" of relation \"users\" contains null values\n$ psql -c \"ALTER TABLE users ADD COLUMN phone TEXT\"   # cột cho phép NULL (mở rộng)\nALTER TABLE\n$ npx tsx cu.mts   # mã CŨ\nfindFirst: OK {\"id\":1,\"fullName\":\"Người 1\"}\ncreate   : OK {\"id\":200001}\n$ psql -c \"ALTER TABLE users ADD COLUMN ho_ten TEXT NOT NULL DEFAULT ''\"   # mã cũ không ghi ho_ten\nALTER TABLE\n$ npx tsx cu.mts   # mã CŨ\nfindFirst: OK {\"id\":1,\"fullName\":\"Người 1\"}\ncreate   : OK {\"id\":200002}\n\n== 3. ALTER \"tức thì\" xếp hàng sau một giao dịch dài — và kéo cả SELECT xếp hàng theo\n-- KHÔNG lock_timeout\n   [pg_stat_activity]  A giao dich dai | active | Timeout         | PgSleep    | BEGIN; SELECT count(*) FROM users; SELECT pg_sleep(10); CO\n   [pg_stat_activity]  B ALTER         | active | Lock            | relation   | SET lock_timeout='0'; ALTER TABLE users ADD COLUMN score I\n   [SELECT thường] ERROR:  canceling statement due to statement timeout\n   [SELECT thường] trả lời sau 5 s\n   [ALTER] xong sau 9 s\n-- CÓ SET lock_timeout = '2s'\n   [pg_stat_activity]  A giao dich dai | active | Timeout         | PgSleep    | BEGIN; SELECT count(*) FROM users; SELECT pg_sleep(10); CO\n   [pg_stat_activity]  B ALTER         | active | Lock            | relation   | SET lock_timeout='2s'; ALTER TABLE users ADD COLUMN score \n   [ALTER] ERROR:  canceling statement due to lock timeout\n   [ALTER] xong sau 2 s\n   [SELECT thường] SELECT count(*) = 200002\n   [SELECT thường] trả lời sau 1 s\n\n== 4. CREATE INDEX CONCURRENTLY trong một file migration\n-- 1_idx_mot_lenh/migration.sql:\n   CREATE INDEX CONCURRENTLY \"users_full_name_idx\" ON \"users\" (\"full_name\");\n-- 2_idx_hai_lenh/migration.sql:\n   SET lock_timeout = '3s';\n   CREATE INDEX CONCURRENTLY \"users_email_lower_idx\" ON \"users\" (lower(\"email\"));\n$ npx prisma migrate status; echo \"exit=$?\"\n3 migrations found in prisma/migrations\nFollowing migrations have not yet been applied:\n1_idx_mot_lenh\n2_idx_hai_lenh\nexit=1\n$ npx prisma migrate deploy\n3 migrations found in prisma/migrations\nApplying migration `1_idx_mot_lenh`\nApplying migration `2_idx_hai_lenh`\nError: P3018\nA migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\nMigration name: 2_idx_hai_lenh\nDatabase error code: 25001\nDatabase error:\nERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block\nDbError { severity: \"ERROR\", parsed_severity: Some(Error), code: SqlState(E25001), message: \"CREATE INDEX CONCURRENTLY cannot run inside a transaction block\", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some(\"xact.c\"), line: Some(3497), routine: Some(\"PreventInTransactionBlock\") }\n$ npx prisma migrate status; echo \"exit=$?\"\nFollowing migration have failed:\n2_idx_hai_lenh\nDuring development if the failed migration(s) have not been deployed to a production database you can then fix the migration(s) and run prisma migrate dev.\nThe failed migration(s) can be marked as rolled back or applied:\nexit=1\n$ psql -c \"\\di users*\"\n   users_email_key     \n   users_full_name_idx \n   users_pkey          \n\n== 5. Cờ của migrate diff ở bản 6.19.3\n$ npx prisma migrate diff --from-migrations … --to-database-url \"$DATABASE_URL\" --script\nError: \nunknown or unexpected option: --to-database-url\n$ npx prisma migrate diff --from-url \"$DATABASE_URL\" --to-schema-datamodel v1/prisma/schema.prisma --script\n-- DropIndex\nDROP INDEX \"users_full_name_idx\";\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, sql, prs, tc, hai_phien } from './_pr-chung.mjs';

export const deck = { key: 'pr-11-3', code: 'PR 11.3', title: 'Migrations in the deploy, and the window where both versions run', sub: 'Chapter 11 · Lesson 11.3' };

const DEMO = 'demo';
const L = fs.readFileSync(`${DEMO}/out/p11-3/khoa.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const khoi = (tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const khoiN = (tu, n, den) => { const ids = L.map((l, i) => (l.startsWith(tu) ? i : -1)).filter((i) => i >= 0); const a = ids[n]; const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3 · 200,000 users';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });

export const slides = lamDeck({ chuong: 'Chapter 11 — Shipping to production', bai: '11.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 11 · Lesson 11.3', t: 'Migrations in the deploy, and the window where both versions run', sub: 'A deploy is not atomic — so every migration is read by old code too' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['clock', 'The window', 'Old code and new schema, at the same time'],
      ['warn', 'What a one-step rename does', 'Measured with the old client'],
      ['layers', 'Expand and contract', 'A rename across three deploys'],
      ['lock', 'The "instant" ALTER that stops the site', 'And lock_timeout'],
      ['page', 'CONCURRENTLY inside a migration file', 'One statement, or none'],
      ['check', 'Gates: migrate status and diff', ''],
    ], 3) },
  /* 3 */ { t: 'The window: both versions run at once', body: flow([
      { t: 't0', s: 'old code · old schema' },
      { t: 't1 — the window', s: 'old code · NEW schema', mau: '#b85a2b' },
      { t: 't2', s: 'new code · new schema', mau: '#2f7d32' },
    ], { h: 130 }) +
      box('The two-way rule', 'A migration must be safe for the code already running, and the new code must be safe against the schema already there. Migrate first, then swap: the window is "old code, new schema" — so every migration must be readable by the old client.', 'lam') +
      cards([
        ['Migrate, then swap', 'The default. Safe as long as each migration is backward-compatible.'],
        ['Swap, then migrate', 'New code queries columns that do not exist yet: the failure is immediate and total.'],
        ['Both at once', 'Two triggers on one event (CuongThai, 03/07/2026): whichever finishes first picks the window.'],
      ], 3) },
  /* 4 */ { t: 'A one-step rename, generated and run', body: two(prs(`model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  hoTen String @map("ho_ten") // was fullName
}`, { sm: true }), T(khoi('$ npx prisma migrate diff --from-schema-datamodel', '== 2.').join('\n'), { wrap: 60, fs: 14 }), '') +
      T(khoi('$ psql -c "ALTER TABLE users RENAME', '$ psql -c "ALTER TABLE users ADD COLUMN phone TEXT NOT NULL"').join('\n'), { wrap: 112, fs: 14 }) +
      box('Two ways to break it', 'Prisma&#39;s diff drops full_name and adds a NOT NULL ho_ten — data gone, and the ADD fails on a non-empty table. A hand-written RENAME keeps the data, and the old code still reads full_name: P2022 on reads and writes.', 'do2') },
  /* 5 */ { t: 'What the old code survives — measured', body: cmp(['Change applied first', 'Old client: findFirst', 'Old client: create'], [
      [c('RENAME COLUMN full_name'), '✗ P2022', '✗ P2022'],
      [c('ADD COLUMN phone TEXT NOT NULL'), 'the migration itself fails: "contains null values"', '—'],
      [c('ADD COLUMN phone TEXT'), '✓', '✓'],
      [c("ADD COLUMN ho_ten TEXT NOT NULL DEFAULT ''"), '✓', '✓'],
    ], { hl: [2, 3] }) + T(khoi('$ psql -c "ALTER TABLE users ADD COLUMN phone TEXT NOT NULL"', '== 3.').filter((l) => !/^\$ npx tsx/.test(l)).join('\n'), { wrap: 112, fs: 13 }) },
  /* 6 */ { t: 'Expand and contract: a rename in three deploys', body: tiers([
      ['layers', 'Deploy 1 · expand', 'add ho_ten nullable · write both · read full_name', '#336791'],
      ['loop', 'Between · backfill', 'copy full_name → ho_ten in chunks (Lesson 11.4)', '#b85a2b'],
      ['code', 'Deploy 2 · switch the read', 'read ho_ten · still write both', '#336791'],
      ['cut', 'Deploy 3 · contract', 'stop writing full_name · then drop it', '#2f7d32'],
    ], { th: 60, gap: 20 }) +
      box('@map makes a name-only change free', 'If only the Prisma field name changes, fullName String @map("full_name") renames it in your code with an empty migration: the column never moves, so no window exists.', 'xanh') },
  /* 7 */ { t: 'The "instant" ALTER that queues the whole table', body: hai_phien([
      ['0 s', 'BEGIN; SELECT count(*) FROM users; …10 s…', '', 'A holds ACCESS SHARE'],
      ['1 s', '', 'ALTER TABLE users ADD COLUMN score INT NOT NULL DEFAULT 0', 'B waits for ACCESS EXCLUSIVE', '#fdecea'],
      ['2 s', 'C: SELECT count(*) FROM users', '', 'C queues BEHIND B', '#fdecea'],
      ['7 s', 'C: statement timeout (5 s)', '', 'a plain read failed'],
      ['10 s', 'A commits', 'B runs — finished after 9 s', ''],
    ], { a: 'Sessions A and C', b: 'Session B (the migration)', fs: 15 }) +
      T(khoi('-- KHÔNG lock_timeout', '-- CÓ SET lock_timeout').join('\n').replace(/^ {3}/gm, ''), { wrap: 112, fs: 12 }) },
  /* 8 */ { t: 'lock_timeout: fail the migration, not the site', body: T(khoi('-- CÓ SET lock_timeout', '== 4.').join('\n').replace(/^ {3}/gm, ''), { wrap: 112, fs: 13 }) +
      bars([['SELECT, no lock_timeout', 5, '#c62828', 'cancelled by statement_timeout'], ['SELECT, lock_timeout 2s', 1, '#2f7d32', 'answered'], ['ALTER, no lock_timeout', 9, '#b85a2b', 'waited for A'], ['ALTER, lock_timeout 2s', 2, '#336791', 'cancelled — retry later']], { don: 's', nhan: 300, fs: 16, rh: 36 }) +
      box('Two lines at the top of a migration on a big table', `${c("SET lock_timeout = '3s';")} — a queued ALTER blocks every query behind it, including plain SELECTs. Whole seconds, measured with date +%s on this machine.`, 'lam') },
  /* 9 */ { t: 'CREATE INDEX CONCURRENTLY inside a migration file', body: T([...khoi('-- 1_idx_mot_lenh', '$ npx prisma migrate status'), ...khoiN('$ npx prisma migrate deploy', 1, '$ npx prisma migrate status; echo "exit=$?"').filter((l) => !/^DbError|^Read more/.test(l))].join('\n').replace(/^ {3}/gm, '  '), { wrap: 112, fs: 12 }) +
      box('One statement per file — or the file is one transaction', 'A file with only the CONCURRENTLY statement applied. Add a single SET line and the file runs as one implicit transaction: 25001, migration failed (P3018), and nothing after it can deploy.', 'do2') },
  /* 10 */ { t: 'Gates: migrate status, and diff with the right flags', body: two(T(khoi('$ npx prisma migrate status; echo "exit=$?"', '$ npx prisma migrate deploy').concat(khoiN('$ npx prisma migrate status; echo "exit=$?"', 1, '$ psql').filter((l) => !/During development|can be marked/.test(l))).join('\n'), { wrap: 60, fs: 12 }),
      T(khoi('== 5.').slice(1).join('\n'), { wrap: 60, fs: 12 }), '') +
      cards([
        ['migrate status exits 1', 'Pending or failed migrations: a gate a deploy script can test before swapping.'],
        ['--to-database-url does not exist', 'In 6.19.3 the flags are --from-url / --to-url. The diff above found a real drift: an index the schema never declared.'],
      ], 2) },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run the old client after a RENAME; read P2022`,
      `Add a nullable column; run the old client again`,
      `Hold a long transaction; ALTER with and without ${c('lock_timeout')}`,
      `Put CONCURRENTLY in a file alone, then with a SET line`,
      `Gate on ${c('migrate status')}; diff with ${c('--from-url')}`,
    ]), box('Keep these', `<ul><li>Old code reads every migration</li><li>Expand, backfill, switch, contract</li><li>lock_timeout on big tables</li><li>CONCURRENTLY alone in its file</li></ul>`, 'lam'), '') },
]);
