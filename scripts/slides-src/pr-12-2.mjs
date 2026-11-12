/**
 * pr-12-2 — Prisma ORM · Chapter 12 · Lesson 12.2 "Seven failure shapes, told apart by their code" (deck video, 12/11/2026). Bài web: pr-12-2-bay-hinh-dang.
 * Output THẬT (`chay.sh p12-2` → out/p12-2/ma-loi.txt + p3009.txt; prisma-pg12 PostgreSQL 16, Prisma 6.19.3, Mac arm64):
 * sai mật khẩu / sai cổng / CSDL không có ⇒ PrismaClientInitializationError; errorCode P1000/P1001/P1003 CHỈ khi gọi $connect(), truy vấn đầu tiên ⇒ undefined · P2002 · P2003 (tạo + xoá) · P2025 (update + connect) ·
 * findUnique ⇒ null · updateMany ⇒ {count: 0} · pool 2 + pool_timeout 2 + 4 truy vấn 3 s ⇒ 2 OK, 2 P2024 · giao dịch quá timeout ⇒ P2028 · deadlock ⇒ PrismaClientUnknownRequestError 40P01 (KHÔNG P2034) ·
 * kết nối bị cắt ⇒ P1017 · migration hỏng ⇒ P3018 (22P02), deploy lại ⇒ P3009, status exit=1, applied_steps_count 0, cột phone KHÔNG còn, diff CSDL↔schema rỗng.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p12-2/ma-loi.txt": "$ bash p12/chay.sh ma-loi\n$ npx tsx ma-loi.mts\n== Hình dáng 1 — chưa từng khởi động\nsai mật khẩu                       PrismaClientInitializationError InitializationError — Please make sure to provide valid database credentials for the database server at the configured address.\nsai cổng (CSDL không chạy)         PrismaClientInitializationError InitializationError — Please make sure your database server is running at `127.0.0.1:55499`.\nCSDL không tồn tại                 PrismaClientInitializationError InitializationError — Database `khong_co` does not exist\n== Hình dáng 2 — dữ liệu nói không\nemail trùng                        P2002 KnownRequestError — Unique constraint failed on the fields: (`email`)\nauthorId không tồn tại             P2003 KnownRequestError — Foreign key constraint violated on the constraint: `posts_author_id_fkey`\nxoá user còn bài                   P2003 KnownRequestError — Foreign key constraint violated on the constraint: `posts_author_id_fkey`\n== Hình dáng 3 — không có hàng\nupdate id không có                 P2025 KnownRequestError — An operation failed because it depends on one or more records that were required but not found. No record was found for an update.\nconnect id không có                P2025 KnownRequestError — An operation failed because it depends on one or more records that were required but not found. No 'User' record (needed to inline the relat\nfindUnique id không có             OK  null\nupdateMany không khớp              OK  {\"count\":0}\n== Hình dáng 4 — pool cạn (connection_limit=2, pool_timeout=2)\ntruy vấn 1 (pg_sleep 3 s)          OK\ntruy vấn 2 (pg_sleep 3 s)          OK\ntruy vấn 3 (pg_sleep 3 s)          P2024 — Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: \ntruy vấn 4 (pg_sleep 3 s)          P2024 — Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: \n== Hình dáng 5 — giao dịch bỏ cuộc\ngiao dịch quá timeout 1 s          P2028 KnownRequestError — Transaction API error: Transaction already closed: A query cannot be executed on an expired transaction. The timeout for this transaction wa\ndeadlock — giao dịch A             undefined — ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { code: \"40P01\", message: \"deadlock detected\", sever\ndeadlock — giao dịch B             OK\nkết nối bị máy chủ cắt (lần 1)     P1017 KnownRequestError — Server has closed the connection.\nkết nối bị máy chủ cắt (lần 2)     P1017 KnownRequestError — Server has closed the connection.\n$ npx tsx tham-do.mts\nsai mật khẩu   $queryRaw  PrismaClientInitializationError · errorCode=undefined · code=undefined\nsai mật khẩu   $connect() PrismaClientInitializationError · errorCode=P1000 · code=undefined\nsai mật khẩu   user.count PrismaClientInitializationError · errorCode=undefined · code=undefined\nsai cổng       $queryRaw  PrismaClientInitializationError · errorCode=undefined · code=undefined\nsai cổng       $connect() PrismaClientInitializationError · errorCode=P1001 · code=undefined\nsai cổng       user.count PrismaClientInitializationError · errorCode=undefined · code=undefined\nCSDL không có  $queryRaw  PrismaClientInitializationError · errorCode=undefined · code=undefined\nCSDL không có  $connect() PrismaClientInitializationError · errorCode=P1003 · code=undefined\nCSDL không có  user.count PrismaClientInitializationError · errorCode=undefined · code=undefined\ndeadlock A: OK\ndeadlock B: PrismaClientUnknownRequestError · code=undefined · 40P01 / deadlock detected\ndeadlock (mảng) A: PrismaClientUnknownRequestError · code=undefined · ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { code: \"40P\ndeadlock (mảng) B: OK\n",
 "demo/out/p12-2/p3009.txt": "$ bash p12/chay.sh p3009\n-- prisma/migrations/1_hong/migration.sql\n   ALTER TABLE \"users\" ADD COLUMN \"phone\" TEXT;\n   CREATE UNIQUE INDEX \"users_phone_key\" ON \"users\" (\"phone\");\n   ALTER TABLE \"users\" ALTER COLUMN \"email\" TYPE INTEGER USING \"email\"::integer;\n$ npx prisma migrate deploy\n2 migrations found in prisma/migrations\nError: P3009\nmigrate found failed migrations in the target database, new migrations will not be applied. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\nThe `1_hong` migration started at 2026-11-12 12:10:20.259376 UTC failed\n$ npx prisma migrate deploy   # lần hai\n2 migrations found in prisma/migrations\nError: P3009\nmigrate found failed migrations in the target database, new migrations will not be applied. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\nThe `1_hong` migration started at 2026-11-12 12:10:20.259376 UTC failed\n$ npx prisma migrate status; echo \"exit=$?\"\n2 migrations found in prisma/migrations\nFollowing migration have failed:\n1_hong\nDuring development if the failed migration(s) have not been deployed to a production database you can then fix the migration(s) and run prisma migrate dev.\nThe failed migration(s) can be marked as rolled back or applied:\n- If you rolled back the migration(s) manually:\nprisma migrate resolve --rolled-back \"1_hong\"\n- If you fixed the database manually (hotfix):\nexit=1\n$ psql -c \"SELECT migration_name, finished_at, rolled_back_at, applied_steps_count FROM _prisma_migrations\"\n migration_name | xong | rolled_back_at | applied_steps_count \n----------------+------+----------------+---------------------\n 0_init         | t    |                |                   1\n 1_hong         | f    |                |                   0\n(2 rows)\n\n$ psql -c \"\\d users\"   # câu 1 và 2 có để lại gì không?\n   email  | text    |           | not null | \n      \"users_email_key\" UNIQUE, btree (email)\n$ npx prisma migrate diff --from-url \"$DATABASE_URL\" --to-schema-datamodel hong/prisma/schema.prisma --script   # CSDL so với schema\n-- This is an empty migration.\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, sql, tc } from './_pr-chung.mjs';

export const deck = { key: 'pr-12-2', code: 'PR 12.2', title: 'Seven failure shapes, told apart by their code', sub: 'Chapter 12 · Lesson 12.2' };

const DEMO = 'demo';
const A = fs.readFileSync(`${DEMO}/out/p12-2/ma-loi.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const B = fs.readFileSync(`${DEMO}/out/p12-2/p3009.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const khoi = (L, tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const gon = (xs) => xs.map((l) => l.replace(/ KnownRequestError — /, ' — ').replace(/PrismaClientInitializationError InitializationError — /, 'InitializationError — '));
const MOI = 'terminal — prisma-pg12 PostgreSQL 16 · Prisma 6.19.3';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });

export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosing Prisma, and where to go next', bai: '12.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 12 · Lesson 12.2', t: 'Seven failure shapes, told apart by their code', sub: 'Every code reproduced on purpose — and two that surprised us' },
  /* 2 */ { t: 'Seven shapes', body: icards([
      ['power', '1 · It never started', 'credentials, network, database name'],
      ['shield', '2 · The data said no', 'P2002 · P2003'],
      ['search', '3 · The row was not there', 'P2025 · null · count 0'],
      ['gauge', '4 · The pool ran out', 'P2024'],
      ['clock', '5 · The transaction gave up', 'P2028 · deadlock · P1017'],
      ['layers', '6 · The migration failed', 'P3018 → P3009'],
      ['pulse', '7 · Nothing is failing', 'it is just slow'],
    ], 3) },
  /* 3 */ { t: 'Shape 1 — it never started', body: T(khoi(A, '$ npx tsx tham-do.mts', 'deadlock A').join('\n').replace(/PrismaClientInitializationError · /g, ''), { wrap: 112, fs: 13 }) +
      cmp(['Message says', 'Meaning', 'Docs name it'], [
        ['provide valid database credentials', 'wrong user or password', 'P1000'],
        ['make sure your database server is running', 'network, port, or the DB is down', 'P1001'],
        ['Database `…` does not exist', 'the URL names a database never created', 'P1003'],
      ]) +
      box('Measured: the code depends on how you connect', 'All nine were PrismaClientInitializationError. An explicit $connect() carried errorCode P1000/P1001/P1003; the same failure on a first query carried none. Match on the class and the message, not only the code.', 'do2') },
  /* 4 */ { t: 'Shapes 2 and 3 — the data said no, the row was not there', body: T(gon([...khoi(A, '== Hình dáng 2', '== Hình dáng 4')]).join('\n'), { wrap: 112, fs: 12 }) +
      cards([
        ['P2002 · P2003', 'The constraint did its job. Usually a 409 or 400 to the client — not an incident.'],
        ['P2025', 'update, delete, a nested connect: the row was required. In bursts, suspect a filter (Lesson 10.5).'],
        ['null · { count: 0 }', 'Not errors at all — which is the danger. Use findUniqueOrThrow, check the count.'],
      ], 3) },
  /* 5 */ { t: 'Shape 4 — the pool ran out', body: T(gon(khoi(A, '== Hình dáng 4', '== Hình dáng 5')).join('\n'), { wrap: 112, fs: 13 }) +
      flow([
        { t: '2 connections', s: 'connection_limit=2' },
        { t: '4 queries × 3 s', s: 'all at once' },
        { t: '2 wait in the queue', s: 'pool_timeout=2 s', mau: '#b85a2b' },
        { t: 'P2024', s: 'after 2 s', mau: '#c62828' },
      ], { h: 120, fs: 18 }) +
      box('P2024 is a symptom', 'Something holds connections: slow queries, a long transaction, too small a pool for the concurrency (Lesson 9.4). Raising pool_timeout only makes the failure slower.', 'lam') },
  /* 6 */ { t: 'Shape 5 — the transaction gave up', body: T(gon(khoi(A, '== Hình dáng 5', '$ npx tsx tham-do.mts')).join('\n'), { wrap: 112, fs: 12 }) +
      cmp(['What happened', 'What Prisma 6.19.3 threw', 'Action'], [
        ['interactive transaction over its timeout', c('P2028') + ' Transaction already closed', 'shorten the transaction, or raise timeout deliberately'],
        ['two transactions, opposite row order', c('PrismaClientUnknownRequestError') + ', 40P01 in the message — not P2034', 'retry; fix the lock order (Lesson 7)'],
        ['the server cut the connection', c('P1017') + ' Server has closed the connection', 'look for a restart, failover, or pooler'],
      ], { hl: [1] }) },
  /* 7 */ { t: 'Shape 6 — the migration failed', body: sql(khoi(B, '   ALTER', '$ npx prisma migrate deploy').map((l) => l.trim()).join('\n'), { sm: true }) +
      two(T(khoi(B, '$ npx prisma migrate deploy', '$ npx prisma migrate status').filter((l) => !/^A migration failed|^migrate found|^Read more|^2 migrations|^Database error:$/.test(l)).join('\n'), { wrap: 58, fs: 12 }),
        T(khoi(B, '$ npx prisma migrate status', '$ psql -c "SELECT').filter((l) => !/During development|If you|prisma migrate resolve|^- |can be marked/.test(l)).join('\n'), { wrap: 58, fs: 12 }), '') },
  /* 8 */ { t: 'The protocol: stop, read, check, then decide', body: steps([
      `<b>Stop.</b> Do not run ${c('migrate resolve')} yet — it records a decision you have not made`,
      `<b>Read the file.</b> Which statement failed (22P02 on the third), which ran before it?`,
      `<b>Check the database.</b> Here: no ${c('phone')} column, ${c('applied_steps_count')} 0, diff against the schema empty — nothing applied`,
      `<b>Decide with a person.</b> Nothing applied ⇒ fix the file, ${c('resolve --rolled-back')}, deploy. Partly applied ⇒ finish or undo by hand first`,
    ]) + T(khoi(B, '$ psql -c "\\d users"').join('\n'), { wrap: 112, fs: 12 }) },
  /* 9 */ { t: 'Shape 7 — nothing is failing', body: cmp(['Symptom', 'Where it is measured', 'Lesson'], [
      ['one endpoint slow', 'the query log, EXPLAIN ANALYZE', '9.1 · 9.3'],
      ['everything slow under load', 'pool wait: prisma_client_queries_wait', '9.4 · 12.4'],
      ['slow after a deploy', 'queries per second by operation — an N+1 shipped', '9.2'],
      ['slow after data grew', 'seq scans, dead tuples', 'PostgreSQL course'],
    ]) + box('Slow is a measurement question, not an error-code question', 'No exception fires. Decide "failing or slow?" first (12.1) — then measure, never guess.', 'lam') },
  /* 10 */ { t: 'The code map', body: tbl(['Code / class', 'Shape', 'First action'], [
      ['InitializationError (P1000/1001/1003)', '1 · never started', 'read the message; check URL, network, DB name'],
      [c('P2002') + ' · ' + c('P2003'), '2 · data said no', 'a 4xx, not an incident'],
      [c('P2025') + ' · null · count 0', '3 · row not there', 'expected? then a 404'],
      [c('P2024'), '4 · pool ran out', 'find what holds connections'],
      [c('P2028') + ' · 40P01 · ' + c('P1017'), '5 · transaction gave up', 'shorten, retry, check restarts'],
      [c('P3018') + ' → ' + c('P3009'), '6 · migration failed', 'stop · read · check · decide'],
    ]) },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Reproduce P2002, P2003 and P2025 on purpose`,
      `Squeeze the pool to 2; fire 4 slow queries`,
      `Make two transactions deadlock; read the class`,
      `Write a migration that fails on its third statement`,
      `Check what applied before resolving`,
    ]), box('Keep these', `<ul><li>Group failures by shape</li><li>Some errors carry no code — read the class</li><li>P2024 is a symptom</li><li>Failed migration: stop, read, check, decide</li></ul>`, 'lam'), '') },
]);
