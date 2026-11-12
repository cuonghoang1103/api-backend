/**
 * pr-12-4 — Prisma ORM · Chapter 12 · Lesson 12.4 "Monitoring: eight panels and eight alerts" (deck video, 12/11/2026). Bài web: pr-12-4-giam-sat.
 * Output THẬT (`chay.sh p12-3` → out/p12-3/cong-cu.txt, phần metrics.mts; prisma-pg12 PostgreSQL 16, Prisma 6.19.3, Mac arm64): previewFeatures "metrics" ⇒ cảnh báo
 * "Preview feature metrics is deprecated" · sau 40 findMany song song: queries_total 40, pool_connections_opened 21, open 21 / idle 21 / busy 0, queries_wait 0;
 * histogram client duration count 40 sum 208 ms, wait count 41 sum 575 ms · prometheus() 85 dòng. Sự cố đĩa CuongThai 18/08/2026: theo CLAUDE.md của repo.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p12-3/cong-cu.txt": "$ bash p12/chay.sh cong-cu\n$ npx prisma -v\nprisma                  : 6.19.3\n@prisma/client          : 6.19.3\nComputed binaryTarget   : darwin-arm64\nOperating System        : darwin\nArchitecture            : arm64\nNode.js                 : v26.8.1\nQuery Engine (Node-API) : libquery-engine c2990dca591cba766e3b7ef5d9e8a84796e47ab7 (at ../node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node)\nDefault Engines Hash    : c2990dca591cba766e3b7ef5d9e8a84796e47ab7\n$ npx prisma validate\nThe schema at prisma/schema.prisma is valid 🚀\n$ npx prisma validate --schema hu/schema.prisma   # đã xoá dòng posts Post[] ở User\nPrisma schema warning:\n- Preview feature \"metrics\" is deprecated. It will be removed in a future version of Prisma.\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Error validating field `author` in model `Post`: The relation field `author` on model `Post` is missing an opposite relation field on the model `User`. Either run `prisma format` or add it manually.\n  -->  hu/schema.prisma:21\n   | \n20 |   authorId Int    @map(\"author_id\")\n21 |   author   User   @relation(fields: [authorId], references: [id])\n$ npx prisma migrate status; echo \"exit=$?\"\n1 migration found in prisma/migrations\nDatabase schema is up to date!\nexit=0\n-- (ai đó tạo tay: CREATE INDEX posts_title_idx ON posts (title))\n$ npx prisma migrate diff --from-url \"$DATABASE_URL\" --to-schema-datamodel prisma/schema.prisma --script\n-- DropIndex\nDROP INDEX \"posts_title_idx\";\n$ npx prisma migrate diff --from-migrations prisma/migrations --to-url \"$DATABASE_URL\" --script\nError: You must pass the --shadow-database-url if you want to diff a migrations directory.\n$ npx prisma migrate diff --from-migrations prisma/migrations --to-url \"$DATABASE_URL\" --shadow-database-url \"$SHADOW\" --script\n-- CreateIndex\nCREATE INDEX \"posts_title_idx\" ON \"public\".\"posts\"(\"title\" ASC);\n$ npx prisma migrate status; echo \"exit=$?\"   # sau khi có chỉ mục tạo tay\nDatabase schema is up to date!\nexit=0\n$ DEBUG=\"prisma:client\" npx tsx -e \"…findFirst()\" 2>&1 | head\nprisma:client checkPlatformCaching:postinstall false +6ms\nprisma:client checkPlatformCaching:ciName undefined +0ms\nprisma:client dirname p12/gen +0ms\nprisma:client relativePath ../prisma +0ms\nprisma:client cwd p12/prisma +0ms\nprisma:client clientVersion 6.19.3 +0ms\nprisma:client Prisma Client call: +1ms\nprisma:client prisma.user.findFirst({}) +1ms\n$ npx tsx metrics.mts\ncounter prisma_client_queries_total                  40\ncounter prisma_datasource_queries_total              40\ncounter prisma_pool_connections_closed_total         0\ncounter prisma_pool_connections_opened_total         21\ngauge   prisma_client_queries_active                 0\ngauge   prisma_client_queries_wait                   0\ngauge   prisma_pool_connections_busy                 0\ngauge   prisma_pool_connections_idle                 21\ngauge   prisma_pool_connections_open                 21\nhistogram prisma_client_queries_duration_histogram_ms count=40 sum=208\nhistogram prisma_client_queries_wait_histogram_ms    count=41 sum=575\nhistogram prisma_datasource_queries_duration_histogram_ms count=40 sum=204\n--- prometheus() (đầu ra, rút gọn) ---\n# HELP prisma_client_queries_total The total number of Prisma Client queries executed\n# TYPE prisma_client_queries_total counter\nprisma_client_queries_total 40\nprisma_client_queries_active 0\nprisma_client_queries_wait 0\nprisma_pool_connections_busy 0\nprisma_pool_connections_idle 21\nprisma_pool_connections_open 21\n(prometheus(): 85 dòng)\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, ts, tc, vsd } from './_pr-chung.mjs';

export const deck = { key: 'pr-12-4', code: 'PR 12.4', title: 'Monitoring: eight panels and eight alerts', sub: 'Chapter 12 · Lesson 12.4' };

const DEMO = 'demo';
const L = fs.readFileSync(`${DEMO}/out/p12-3/cong-cu.txt`, 'utf8').replace(/\n+$/, '').split('\n');
const khoi = (tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const MOI = 'terminal — prisma-pg12 PostgreSQL 16 · Prisma 6.19.3';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });
const CANH_BAO = L.find((l) => /Preview feature "metrics" is deprecated/.test(l)) || '';

export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosing Prisma, and where to go next', bai: '12.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 12 · Lesson 12.4', t: 'Monitoring: eight panels and eight alerts', sub: 'See it before the users do — and alert only on what needs a human tonight' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['gauge', 'What Prisma itself can report', '$metrics — and its deprecation'],
      ['pulse', 'Eight panels', 'Prisma, PostgreSQL, the host'],
      ['warn', 'Eight alerts, with thresholds', ''],
      ['cut', 'What not to alert on', ''],
    ], 2) + flow([
      { t: 'Prisma + PostgreSQL', s: 'metrics and views' },
      { t: 'eight panels', s: 'look when asked' },
      { t: 'eight alerts', s: 'wake someone', mau: '#c62828' },
      { t: 'a person', s: 'acts tonight', mau: '#2f7d32' },
    ], { h: 150, fs: 20 }) + box('Measured in this lesson', 'The pool gauges after 40 parallel queries, the wait-versus-run histograms, and the deprecation warning — all from one lab run on Prisma 6.19.3 and PostgreSQL 16. The disk story is CuongThai&#39;s own, 18/08/2026.', 'lam') },
  /* 3 */ { t: '$metrics after 40 parallel queries', body: T(['$ npx prisma validate --schema hu/schema.prisma   # previewFeatures = ["metrics"]', CANH_BAO.trim(), ...khoi('$ npx tsx metrics.mts', '--- prometheus()')].join('\n'), { wrap: 112, fs: 13 }) +
      box('Measured, and on its way out', 'The gauges answer "is the pool saturated?" directly — but validate warns that the metrics preview feature is deprecated in 6.19.3. Build panels you can feed from somewhere else too: your own counters, OpenTelemetry, PostgreSQL&#39;s views.', 'do2') },
  /* 4 */ { t: 'Exporting it: the Prometheus format', body: two(ts(`app.get('/metrics', async (_req, res) => {
  res.type('text/plain');
  res.send(await prisma.$metrics.prometheus());
});`, { sm: true }), T(khoi('--- prometheus()').slice(1).join('\n'), { wrap: 60, fs: 12 }), '') +
      bars([['client time per query (avg)', 5.2, '#336791', '208 ms / 40'], ['waiting for a connection (avg)', 14.0, '#b85a2b', '575 ms / 41']], { don: 'ms', nhan: 330, fs: 16, rh: 38 }) +
      box('Read the wait, not just the duration', 'With 21 connections and 40 queries fired at once, queries spent longer waiting for a connection than running — the pool is the first place latency hides (Lesson 9.4).', 'lam') },
  /* 5 */ { t: 'Eight panels', body: cmp(['Panel', 'Source', 'What a change means'], [
      ['1 · Query latency p50/p95/p99', 'duration histogram', 'p99 is what users feel'],
      ['2 · Queries per second by operation', 'queries_total, your labels', 'a 20× jump with flat traffic = an N+1 shipped'],
      ['3 · Pool: open, busy, idle, waiting', 'pool gauges', 'busy → open means saturation'],
      ['4 · PG connections by state', c('pg_stat_activity'), '"idle in transaction" should stay at zero'],
      ['5 · Errors by Prisma code', 'your error counter', '"errors up" becomes a diagnosis (12.2)'],
      ['6 · Slow queries per minute', c("$on('query')") + ' (11.5)', 'a step change = a plan changed'],
      ['7 · Table growth, dead tuples', c('pg_stat_user_tables'), 'vacuum not keeping up'],
      ['8 · Disk free on the DB volume', 'the host', 'the outage that kills everything'],
    ]) },
  /* 6 */ { t: 'Eight alerts, with thresholds', body: tbl(['Alert', 'Threshold', 'Why'], [
      [c('queries_wait') + ' > 0', 'for 5 min', 'zero is normal; sustained waiting is real'],
      ['connections', '> 80% of max_connections', 'headroom for psql and a migration'],
      ['idle in transaction', 'older than 60 s', 'a transaction someone forgot'],
      ['disk free', '< 20%', 'time to act; at 5% it is an outage'],
      ['errors by code', 'above the weekly baseline', 'P2002 has a healthy background'],
      ['p99 latency', '> 2× weekly baseline', 'absolute thresholds age badly'],
      ['pending migrations after deploy', 'migrate status exit ≠ 0', 'a pipeline step, not a metric'],
      ['container restarts', '> 0', 'catches Lesson 11.1'],
    ]) },
  /* 7 */ { t: 'The disk alert is not theoretical', body: tiers([
      ['db', 'Postgres and the build cache share one disk', 'CuongThai VPS', '#336791'],
      ['layers', 'Build cache grows to 7.6 GB', 'nobody watches it', '#b85a2b'],
      ['warn', '18/08/2026: deploy dies — no space left on device', 'disk down to 1.8 GB during next build', '#c62828'],
      ['check', 'Fix: build elsewhere, weekly cleanup, a disk alert', 'deploy-nha.sh · vps-cleanup-weekly', '#2f7d32'],
    ], { th: 60, gap: 20 }) + box('The most boring panel prevents the worst outage', 'A database that fills its volume stops accepting writes — every endpoint fails at once, and the fix takes longer than any query tuning.', 'lam') },
  /* 8 */ { t: 'What not to alert on', body: vsd(`<ul><li>One slow query — alert on the <b>rate</b></li><li>Database CPU at 80% — a database being used</li><li>Every P2002 — the constraint doing its job</li></ul>`,
      `<ul><li>Things that need a human <b>tonight</b></li><li>Symptoms users feel: latency, errors, saturation</li><li>Everything else is a dashboard panel</li></ul>`, '✗ Alerts that train people to ignore alerts', '✓ The 3 a.m. test') +
      flow([
        { t: 'metric moves' },
        { t: 'does it need a human tonight?', mau: '#b85a2b' },
        { t: 'yes → alert', mau: '#c62828' },
        { t: 'no → panel', mau: '#2f7d32' },
      ], { h: 120, fs: 17 }) +
      box('An alert nobody acts on is worse than none', 'Every page that turns out to be "look at it tomorrow" teaches the team to ignore the next one. Keep the list short enough that each alert still wakes someone up.', 'do2') },
  /* 9 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Enable metrics; read the deprecation warning`,
      `Fire 40 queries; read open, busy, idle, wait`,
      `Expose ${c('/metrics')}; scrape it once`,
      `Pick thresholds for your eight alerts`,
      `Delete one alert that fails the 3 a.m. test`,
    ]), box('Keep these', `<ul><li>Wait time reveals the pool</li><li>$metrics is deprecated — plan a second source</li><li>Alert on rates and symptoms</li><li>Watch the disk</li></ul>`, 'lam'), '') },
]);
