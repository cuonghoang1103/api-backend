/**
 * pr-12-3 — Prisma ORM · Chapter 12 · Lesson 12.3 "The diagnostic toolbox" (deck video, 12/11/2026). Bài web: pr-12-3-bo-cong-cu.
 * Output THẬT (`chay.sh p12-3` → out/p12-3/cong-cu.txt; prisma-pg12 PostgreSQL 16, Prisma 6.19.3, Mac arm64, Node 26.8.1):
 * prisma -v (darwin-arm64, engine hash) · validate OK; xoá posts Post[] ⇒ P1012 thiếu quan hệ đối · migrate status "up to date", exit 0 — KỂ CẢ khi có chỉ mục tạo tay ·
 * diff --from-url → schema ⇒ DROP INDEX posts_title_idx · --from-migrations → --to-url thiếu shadow ⇒ lỗi; có shadow ⇒ CREATE INDEX · DEBUG=prisma:client in từng bước.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p12-3/cong-cu.txt": "$ bash p12/chay.sh cong-cu\n$ npx prisma -v\nprisma                  : 6.19.3\n@prisma/client          : 6.19.3\nComputed binaryTarget   : darwin-arm64\nOperating System        : darwin\nArchitecture            : arm64\nNode.js                 : v26.8.1\nQuery Engine (Node-API) : libquery-engine c2990dca591cba766e3b7ef5d9e8a84796e47ab7 (at ../node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node)\nDefault Engines Hash    : c2990dca591cba766e3b7ef5d9e8a84796e47ab7\n$ npx prisma validate\nThe schema at prisma/schema.prisma is valid 🚀\n$ npx prisma validate --schema hu/schema.prisma   # đã xoá dòng posts Post[] ở User\nPrisma schema warning:\n- Preview feature \"metrics\" is deprecated. It will be removed in a future version of Prisma.\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Error validating field `author` in model `Post`: The relation field `author` on model `Post` is missing an opposite relation field on the model `User`. Either run `prisma format` or add it manually.\n  -->  hu/schema.prisma:21\n   | \n20 |   authorId Int    @map(\"author_id\")\n21 |   author   User   @relation(fields: [authorId], references: [id])\n$ npx prisma migrate status; echo \"exit=$?\"\n1 migration found in prisma/migrations\nDatabase schema is up to date!\nexit=0\n-- (ai đó tạo tay: CREATE INDEX posts_title_idx ON posts (title))\n$ npx prisma migrate diff --from-url \"$DATABASE_URL\" --to-schema-datamodel prisma/schema.prisma --script\n-- DropIndex\nDROP INDEX \"posts_title_idx\";\n$ npx prisma migrate diff --from-migrations prisma/migrations --to-url \"$DATABASE_URL\" --script\nError: You must pass the --shadow-database-url if you want to diff a migrations directory.\n$ npx prisma migrate diff --from-migrations prisma/migrations --to-url \"$DATABASE_URL\" --shadow-database-url \"$SHADOW\" --script\n-- CreateIndex\nCREATE INDEX \"posts_title_idx\" ON \"public\".\"posts\"(\"title\" ASC);\n$ npx prisma migrate status; echo \"exit=$?\"   # sau khi có chỉ mục tạo tay\nDatabase schema is up to date!\nexit=0\n$ DEBUG=\"prisma:client\" npx tsx -e \"…findFirst()\" 2>&1 | head\nprisma:client checkPlatformCaching:postinstall false +6ms\nprisma:client checkPlatformCaching:ciName undefined +0ms\nprisma:client dirname p12/gen +0ms\nprisma:client relativePath ../prisma +0ms\nprisma:client cwd p12/prisma +0ms\nprisma:client clientVersion 6.19.3 +0ms\nprisma:client Prisma Client call: +1ms\nprisma:client prisma.user.findFirst({}) +1ms\n$ npx tsx metrics.mts\ncounter prisma_client_queries_total                  40\ncounter prisma_datasource_queries_total              40\ncounter prisma_pool_connections_closed_total         0\ncounter prisma_pool_connections_opened_total         21\ngauge   prisma_client_queries_active                 0\ngauge   prisma_client_queries_wait                   0\ngauge   prisma_pool_connections_busy                 0\ngauge   prisma_pool_connections_idle                 21\ngauge   prisma_pool_connections_open                 21\nhistogram prisma_client_queries_duration_histogram_ms count=40 sum=208\nhistogram prisma_client_queries_wait_histogram_ms    count=41 sum=575\nhistogram prisma_datasource_queries_duration_histogram_ms count=40 sum=204\n--- prometheus() (đầu ra, rút gọn) ---\n# HELP prisma_client_queries_total The total number of Prisma Client queries executed\n# TYPE prisma_client_queries_total counter\nprisma_client_queries_total 40\nprisma_client_queries_active 0\nprisma_client_queries_wait 0\nprisma_pool_connections_busy 0\nprisma_pool_connections_idle 21\nprisma_pool_connections_open 21\n(prometheus(): 85 dòng)\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, tc } from './_pr-chung.mjs';

export const deck = { key: 'pr-12-3', code: 'PR 12.3', title: 'The diagnostic toolbox', sub: 'Chapter 12 · Lesson 12.3' };

const DEMO = 'demo';
const L = fs.readFileSync(`${DEMO}/out/p12-3/cong-cu.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const khoi = (tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const khoiN = (tu, n, den) => { const ids = L.map((l, i) => (l.startsWith(tu) ? i : -1)).filter((i) => i >= 0); const a = ids[n]; const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const MOI = 'terminal — prisma-pg12 PostgreSQL 16 · Prisma 6.19.3 · Node 26.8.1';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });

export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosing Prisma, and where to go next', bai: '12.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 12 · Lesson 12.3', t: 'The diagnostic toolbox', sub: 'Each tool answers one question — and one of them answers less than you think' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['cpu', 'What is actually running', 'prisma -v'],
      ['check', 'Is the schema even valid?', 'prisma validate'],
      ['layers', 'Is the history applied?', 'migrate status — and its blind spot'],
      ['map', 'Does the database match?', 'migrate diff, three directions'],
      ['eye', 'What the client is doing', 'DEBUG, and the PostgreSQL views'],
    ], 2) },
  /* 3 */ { t: 'What is actually running', body: T(khoi('$ npx prisma -v', '$ npx prisma validate').join('\n'), { wrap: 112, fs: 14 }) +
      cards([
        ['Versions, together', 'CLI and client must match. A client from one version with a CLI from another is a classic "works locally" source.'],
        ['Computed binaryTarget', 'The platform this machine needs (Lesson 11.1). Run it inside the container, not on your laptop.'],
        ['Engine hash', 'Identifies the exact engine build — quote it in a bug report.'],
      ], 3) },
  /* 4 */ { t: 'Is the schema file even valid?', body: T([...khoi('$ npx prisma validate', '$ npx prisma validate --schema hu'), ...khoi('$ npx prisma validate --schema hu', '$ npx prisma migrate status')].join('\n'), { wrap: 112, fs: 13 }) +
      box('validate is offline and fast', 'No database needed. P1012 named the model, the field and the line: Post.author has no opposite field on User (Lesson 3). The warning above it is real too — the metrics preview feature is deprecated (Lesson 12.4).', 'lam') },
  /* 5 */ { t: 'migrate status — and what it cannot see', body: T([...khoi('$ npx prisma migrate status', '-- (ai đó'), ...khoi('-- (ai đó', '$ npx prisma migrate diff'), ...khoiN('$ npx prisma migrate status', 1, '$ DEBUG')].join('\n'), { wrap: 112, fs: 14 }) +
      cmp(['Question', 'migrate status', 'migrate diff'], [
        ['Are all migrations applied?', '✓ — exit 1 if pending or failed', '—'],
        ['Did someone change the database by hand?', '✗ "up to date", exit 0', '✓ shows the difference'],
      ], { hl: [1] }) },
  /* 6 */ { t: 'migrate diff, three directions — measured', body: T(khoi('$ npx prisma migrate diff --from-url', '$ npx prisma migrate status; echo "exit=$?"   # sau').join('\n'), { wrap: 112, fs: 12 }) +
      cmp(['From → to', 'Answers', 'Needs'], [
        [c('--from-url') + ' → ' + c('--to-schema-datamodel'), 'database vs schema file', 'nothing extra'],
        [c('--from-migrations') + ' → ' + c('--to-url'), 'history vs database', c('--shadow-database-url')],
        [c('--from-migrations') + ' → ' + c('--to-schema-datamodel'), 'what the next migration would contain', 'a shadow database'],
      ]) },
  /* 7 */ { t: 'Direction matters', body: flow([
      { t: 'from', s: 'the live database' },
      { t: 'SQL to apply', s: 'DROP INDEX …', mau: '#b85a2b' },
      { t: 'to', s: 'schema.prisma' },
    ], { h: 120 }) + flow([
      { t: 'from', s: 'migration history' },
      { t: 'SQL to apply', s: 'CREATE INDEX …', mau: '#2f7d32' },
      { t: 'to', s: 'the live database' },
    ], { h: 120 }) + box('Same index, opposite scripts', 'The output is the SQL that turns "from" into "to". Database → schema says drop the hand-made index; history → database says it was created outside history. Read which side you are on before running anything.', 'lam') +
      box('Flags in 6.19.3', '--from-url / --to-url, --from-schema-datamodel / --to-schema-datamodel, --from-migrations. There is no --to-database-url.', 'do2') },
  /* 8 */ { t: 'DEBUG: what the client is doing', body: T(khoi('$ DEBUG=', '$ npx tsx metrics.mts').join('\n'), { wrap: 112, fs: 14 }) +
      cards([
        ['DEBUG="prisma:client"', 'Paths, version, and each call as the client received it.'],
        ['DEBUG="prisma:*"', 'Everything, including the engine — loud; for one reproduction, not for production.'],
        ['log: query / info / warn', 'Lesson 11.5: events, sampled, never the params.'],
      ], 3) },
  /* 9 */ { t: 'The database&#39;s own view', body: icards([
      ['list', 'pg_stat_activity', 'who is connected, in which state, waiting on what'],
      ['lock', 'pg_locks', 'who holds what, and who waits (Lesson 11.3)'],
      ['db', 'pg_stat_user_tables', 'seq scans, live and dead tuples'],
      ['gauge', 'pg_stat_statements', 'the slowest queries, aggregated (Lesson 9.1)'],
    ], 2) + box('Prisma Studio does not belong on production', 'It edits and deletes rows with two clicks. To look at production, restore a dump locally, or read with psql — SELECT only.', 'do2') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run ${c('prisma -v')} inside your container`,
      `Delete a back-relation; run ${c('validate')}`,
      `Create an index by hand; run ${c('migrate status')}`,
      `Diff database → schema, then history → database`,
      `Run one call with ${c('DEBUG="prisma:client"')}`,
    ]), box('Keep these', `<ul><li>status checks history, not drift</li><li>diff checks drift — read the direction</li><li>validate needs no database</li><li>Never Studio on production</li></ul>`, 'lam'), '') },
]);
