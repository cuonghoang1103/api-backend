/**
 * pr-09-1 — Prisma ORM · Chapter 9 · Lesson 9.1 "Measure before you change anything" (deck video, 12/11/2026). Bài web: pr-9-1-do-truoc.
 * Output THẬT (`chay.sh p9-1`, container prisma-pg9 = PostgreSQL 16.14, 4 CPU / 2 GB, pg_stat_statements; CSDL c91 nhân từ mẫu c9: 5.000 user · 1,2 triệu bài ·
 * 600.000 bình luận, KHÔNG có chỉ mục khoá ngoại; Prisma 6.19.3; Apple M1 Max): trang chủ 44 truy vấn · đồng hồ tường ~605 ms · vòng 40 findUnique ~22 ms tường
 * nhưng sự kiện ghi 0 ms (duration là số nguyên ms) · câu tìm kiếm ILIKE: Parallel Seq Scan ~297 ms → GIN trigram ~1,7 ms · cả trang ~304 ms, nút cổ chai kế tiếp là
 * COUNT theo author_id (không chỉ mục) · test đếm truy vấn: 41 > 6 ⇒ đỏ · pg_stat_statements 50 lượt. Số ms trên slide ĐỌC TỪ output.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p9-1/do.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c91 npx tsx p9/91/trang.mts\n{ count: 44, totalMs: 579 } · dong ho tuong: ca trang 604.5 ms, vong 40 findUnique 21.7 ms\n┌─────────┬──────────────────────────────────────────────────────────────┬───────┬───────┬─────┐\n│ (index) │ sql                                                          │ count │ total │ max │\n├─────────┼──────────────────────────────────────────────────────────────┼───────┼───────┼─────┤\n│ 0       │ 'SELECT … FROM \"posts\" WHERE (\"posts\".\"published\" = ? AND \"' │ 1     │ 293   │ 293 │\n│ 1       │ 'SELECT … FROM (SELECT \"posts\".\"id\" FROM \"posts\" WHERE \"pos' │ 1     │ 246   │ 246 │\n│ 2       │ 'SELECT … FROM \"comments\" WHERE \"comments\".\"post_id\" IN (?,' │ 1     │ 40    │ 40  │\n│ 3       │ 'SELECT … FROM \"posts\" WHERE \"posts\".\"published\" = ? ORDER ' │ 1     │ 0     │ 0   │\n│ 4       │ 'SELECT … FROM \"users\" WHERE (\"users\".\"id\" = ? AND 1=1) LIM' │ 40    │ 0     │ 0   │\n└─────────┴──────────────────────────────────────────────────────────────┴───────┴───────┴─────┘\nparams cua cau cham nhat: [true,\"%prisma%\",20,0]\nEXPLAIN (ANALYZE, BUFFERS) SELECT \"posts\".\"id\", \"posts\".\"title\", \"posts\".\"body\", \"posts\".\"published\", \"posts\".\"published_at\", \"posts\".\"views\", \"posts\".\"metadata\", \"posts\".\"author_id\", \"posts\".\"deleted_at\", \"posts\".\"created_at\" FROM \"posts\" WHERE (\"posts\".\"published\" = true AND \"posts\".\"title\" ILIKE '%prisma%') ORDER BY \"posts\".\"published_at\" DESC LIMIT 20 OFFSET 0;\n",
 "demo/out/p9-1/explain-truoc.txt": "$ docker exec -i prisma-pg9 psql -U student -d c91 < p9/91/cham.sql\n                                                               QUERY PLAN                                                                \n-----------------------------------------------------------------------------------------------------------------------------------------\n Limit  (cost=121938.02..121940.36 rows=20 width=1896) (actual time=280.434..283.631 rows=20 loops=1)\n   Buffers: shared hit=2504 read=112255\n   I/O Timings: shared read=215.891\n   ->  Gather Merge  (cost=121938.02..121948.52 rows=90 width=1896) (actual time=277.906..281.101 rows=20 loops=1)\n         Workers Planned: 2\n         Workers Launched: 2\n         Buffers: shared hit=2504 read=112255\n         I/O Timings: shared read=215.891\n         ->  Sort  (cost=120938.00..120938.11 rows=45 width=1896) (actual time=267.725..267.726 rows=17 loops=3)\n               Sort Key: published_at DESC\n               Sort Method: top-N heapsort  Memory: 45kB\n               Buffers: shared hit=2504 read=112255\n               I/O Timings: shared read=215.891\n               Worker 0:  Sort Method: top-N heapsort  Memory: 45kB\n               Worker 1:  Sort Method: top-N heapsort  Memory: 45kB\n               ->  Parallel Seq Scan on posts  (cost=0.00..120936.80 rows=45 width=1896) (actual time=195.303..267.603 rows=400 loops=3)\n                     Filter: (published AND (title ~~* '%prisma%'::text))\n                     Rows Removed by Filter: 399600\n                     Buffers: shared hit=2432 read=112255\n                     I/O Timings: shared read=215.891\n Planning:\n   Buffers: shared hit=98\n Planning Time: 0.290 ms\n JIT:\n   Functions: 8\n   Options: Inlining false, Optimization false, Expressions true, Deforming true\n   Timing: Generation 0.319 ms, Inlining 0.000 ms, Optimization 0.472 ms, Emission 6.187 ms, Total 6.978 ms\n Execution Time: 297.437 ms\n(28 rows)\n\n",
 "demo/out/p9-1/explain-sau.txt": "$ docker exec -i prisma-pg9 psql -U student -d c91 < p9/91/cham.sql\n                                                                QUERY PLAN                                                                 \n-------------------------------------------------------------------------------------------------------------------------------------------\n Limit  (cost=569.96..570.01 rows=20 width=1896) (actual time=1.663..1.666 rows=20 loops=1)\n   Buffers: shared hit=412 read=1\n   I/O Timings: shared read=0.040\n   ->  Sort  (cost=569.96..570.23 rows=108 width=1896) (actual time=1.662..1.664 rows=20 loops=1)\n         Sort Key: published_at DESC\n         Sort Method: top-N heapsort  Memory: 45kB\n         Buffers: shared hit=412 read=1\n         I/O Timings: shared read=0.040\n         ->  Bitmap Heap Scan on posts  (cost=97.23..567.09 rows=108 width=1896) (actual time=0.227..1.435 rows=1200 loops=1)\n               Recheck Cond: (title ~~* '%prisma%'::text)\n               Filter: published\n               Heap Blocks: exact=401\n               Buffers: shared hit=409 read=1\n               I/O Timings: shared read=0.040\n               ->  Bitmap Index Scan on posts_title_trgm  (cost=0.00..97.20 rows=120 width=0) (actual time=0.135..0.135 rows=1200 loops=1)\n                     Index Cond: (title ~~* '%prisma%'::text)\n                     Buffers: shared hit=9\n Planning:\n   Buffers: shared hit=148\n Planning Time: 0.641 ms\n Execution Time: 1.723 ms\n(21 rows)\n\n",
 "demo/out/p9-1/do-lai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c91 npx tsx p9/91/trang.mts nho\n{ count: 44, totalMs: 269 } · dong ho tuong: ca trang 304.3 ms, vong 40 findUnique 30.5 ms\n",
 "demo/out/p9-1/dem-test.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c91 npx tsx --test p9/91/dem.test.mts 2>&1 | grep -E 'not ok|^ok|^# (pass|fail)|trang chu ton'\n  AssertionError [ERR_ASSERTION]: trang chu ton 41 truy van\n",
 "demo/out/p9-1/pgss.txt": "$ docker exec prisma-pg9 psql -q -U postgres -d c91 -c 'SELECT pg_stat_statements_reset();' >/dev/null\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c91 npx tsx p9/91/trang.mts lap\nda chay trang chu 50 lan\n$ docker exec -i prisma-pg9 psql -U student -d c91 -c \"SELECT calls, round(total_exec_time::numeric, 0) AS tong_ms, round(mean_exec_time::numeric, 2) AS tb_ms, rows, left(regexp_replace(query, '\\\\s+', ' ', 'g'), 70) AS truy_van FROM pg_stat_statements WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database()) ORDER BY total_exec_time DESC LIMIT 6;\"\n calls | tong_ms | tb_ms  | rows |                                truy_van                                \n-------+---------+--------+------+------------------------------------------------------------------------\n    50 |   11435 | 228.71 |   50 | SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"public\".\"posts\".\"id\" FR\n    50 |    1545 |  30.90 | 6000 | SELECT \"public\".\"comments\".\"id\", \"public\".\"comments\".\"body\", \"public\".\n    50 |      63 |   1.27 | 1000 | SELECT \"public\".\"posts\".\"id\", \"public\".\"posts\".\"title\", \"public\".\"post\n  2000 |      24 |   0.01 | 2000 | SELECT \"public\".\"users\".\"id\", \"public\".\"users\".\"email\", \"public\".\"user\n    50 |       6 |   0.13 | 2000 | SELECT \"public\".\"posts\".\"id\", \"public\".\"posts\".\"title\", \"public\".\"post\n     1 |       0 |   0.13 |    1 | <insufficient privilege>\n(6 rows)\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, two, box, cards, c, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-09-1', code: 'PR 9.1', title: 'Measure before you change anything', sub: 'Chapter 9 · Lesson 9.1' };

const DEMO = 'demo';
const OUT = (t, ch = 'p9-1') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/docker exec -i prisma-pg9 psql -U student -d c91/g, 'psql').replace(/p9\/9\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 (Docker, 4 CPU) · Prisma 6.19.3 · 1.2M posts';
const so1 = (t, re) => OUT(t).match(re)[1];
const N1 = so1('do', /vong 40 findUnique ([\d.]+) ms/), TRUOC = so1('explain-truoc', /Execution Time: ([\d.]+) ms/), SAU = so1('explain-sau', /Execution Time: ([\d.]+) ms/);
const TUONG0 = so1('do', /ca trang ([\d.]+) ms/), TUONG1 = so1('do-lai', /ca trang ([\d.]+) ms/);
const ke = (t, re) => gon(OUT(t)).split('\n').filter((l) => re.test(l)).map((l) => l.replace(/\(cost=[^)]*\) /, '').replace(/^\s{2,}/, (m) => m.slice(0, Math.min(m.length, 10)))).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — Performance', bai: '9.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 9 · Lesson 9.1', t: 'Measure before you change anything', sub: 'Count, rank, rebuild the SQL, read the plan, fix — and measure again' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['list', 'Capturing every query a request sends', ''],
      ['loop', 'Ranking by total time — and what the log rounds away', ''],
      ['code', 'Rebuilding the exact SQL, then reading its plan', ''],
      ['wrench', 'Fixing one thing and measuring again', ''],
      ['test', 'A query-count test, and pg_stat_statements', ''],
    ], 2) },
  /* 3 */ { t: 'Step 1 — capture every query of one request', body: ts(`const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });
const log: { sql: string; params: string; ms: number }[] = [];
prisma.$on('query', (e) => log.push({ sql: e.query, params: e.params, ms: e.duration }));

const done = start();             // remembers log.length
await getHomePage(1);             // 1 feed query, 40 author lookups, a search, comments, a count
console.log(done());              // { count, totalMs } of just this request`, { sm: true }) +
      tp(gon(OUT('do')).split('\n').slice(0, 2).join('\n').replace(' · dong ho tuong:', '\n# wall clock:'), { wrap: 116, fs: 15, title: MOI }) +
      box('44 queries for one page — count first', `The count is the finding a log gives you for free. And note the two clocks: the 40 author lookups took ${N1} ms of wall time.`, 'lam') },
  /* 4 */ { t: 'Step 2 — rank by total time, not by slowest', body: tp(gon(OUT('do')).split('\n').slice(2, 11).join('\n'), { fs: 15, title: MOI }) +
      cards([
        ['Rows 0 and 1 cost the most', 'One search and one count: single queries doing too much work — EXPLAIN territory.'],
        ['Row 4: 40 calls, "0 ms"', `<code>e.duration</code> is whole milliseconds. Forty sub-millisecond lookups sum to 0 here, yet cost ${N1} ms of round trips.`],
        ['So read two numbers', 'Count per pattern, and the wall clock around the loop. The log alone hides an N+1 on a fast network.'],
      ], 3) },
  /* 5 */ { t: 'Step 3 — rebuild the exact SQL', body: two(ts(`function stop(sql: string, params: string) {
  const p: unknown[] = JSON.parse(params);
  return sql.replace(/\\$(\\d+)/g, (_, i) => {
    const v = p[Number(i) - 1];
    if (v === null) return 'NULL';
    if (typeof v === 'number' || typeof v === 'boolean')
      return String(v);
    return \`'\${String(v).replace(/'/g, "''")}'\`;
  });
}
const cham = [...log].sort((a, b) => b.ms - a.ms)[0];
console.log('EXPLAIN (ANALYZE, BUFFERS) '
  + stop(cham.sql, cham.params) + ';');`, { sm: true }),
      tp(gon(OUT('do')).split('\n').slice(11).join('\n').replace(/"t0"\."(\w+)"( AS "\w+")?, /g, '').replace(/SELECT .*? FROM/, 'SELECT … FROM'), { wrap: 56, fs: 13, title: MOI }), '') +
      box('The params arrive as a JSON string', 'Here <code>[true,"%prisma%",20]</code>. Putting them back takes ten lines — keep the function in the repository, or nobody will EXPLAIN the real query.', 'lam') },
  /* 6 */ { t: 'Step 4 — read the plan', body: tp(ke('explain-truoc', /^\$|Limit|Gather|Workers Launched|Seq Scan|Filter:|Rows Removed|Buffers: shared hit=2504|Execution/), { wrap: 116, fs: 14, title: MOI }) +
      cards([
        ['Parallel Seq Scan', 'Two workers plus the leader read the whole table: about 400,000 rows thrown away per process to keep 40.'],
        ['read=112,255 buffers', 'Most pages came from disk, not cache — BUFFERS is always worth adding.'],
        ['ILIKE \'%prisma%\'', 'A leading wildcard: no B-tree can help, at any column order.'],
      ], 3) },
  /* 7 */ { t: 'Step 5 — fix one thing, then measure again', body: two(sql(`CREATE INDEX CONCURRENTLY posts_title_trgm
  ON posts USING gin (title gin_trgm_ops);
ANALYZE posts;`, { sm: true }) + tp(ke('explain-sau', /Bitmap|Execution/), { wrap: 70, fs: 12, title: 'same query, after' }),
      tp(gon(OUT('do-lai')).replace(' · dong ho tuong:', '\n# wall clock:'), { wrap: 64, fs: 14, title: 'the whole page, after' }), '') +
      box(`${TRUOC} ms → ${SAU} ms for the query; ${TUONG0} → ${TUONG1} ms for the page`, 'Re-rank and the next row on top is the COUNT by author_id — a foreign key with no index (Lesson 9.3). Fix it next; never keep indexing on a guess.', 'xanh') },
  /* 8 */ { t: 'The cheapest performance test there is', body: two(ts(`test('trang chu khong bi N+1', async () => {
  const from = prisma.nhatKy.length;
  await getHomePage();
  const count = prisma.nhatKy.length - from;
  assert.ok(count <= 6,
    \`trang chu ton \${count} truy van\`);
});`, { sm: true }), tp(gon(OUT('dem-test')).replace(/ 2>&1 \| grep .*$/m, ''), { wrap: 60, fs: 13, title: MOI }), '') +
      cards([
        ['Queries per request', 'A small constant. If it grows with the items on the page, it is an N+1.'],
        ['Query time per request', 'The database share of latency — 40 ms of 900 means look elsewhere.'],
        ['Rows read vs returned', 'From EXPLAIN: 400,000 read for 40 returned is a missing index.'],
      ], 3) + box('A test, not a dashboard', 'It runs in milliseconds, needs no load generator, and fails the build the day someone puts an await inside a loop.', 'xanh') },
  /* 9 */ { t: 'In production: pg_stat_statements', body: tp(gon(OUT('pgss')).split('\n').filter((l) => !/^\$ docker exec prisma-pg9 psql -q -U postgres/.test(l)).join('\n').replace(/^\$ psql -c .*$/m, '$ psql -c "SELECT calls, tong_ms, tb_ms, rows, truy_van FROM pg_stat_statements … ORDER BY total_exec_time DESC"'), { wrap: 116, fs: 13, title: MOI }) +
      box('The same ranking, across every request', 'After 50 page loads the COUNT dominates the database time, while the 2,000 author lookups at 0.01 ms each total a few dozen ms — cheap for the database, costly only in round trips.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Log queries as events; count one request`,
      `Rank by total; wrap the loop in a wall clock`,
      `Rebuild the slowest SQL; ${c('EXPLAIN (ANALYZE, BUFFERS)')}`,
      `Fix one thing; measure the whole page again`,
    ]), box('Keep these', `<ul><li>Count before timing</li><li>The log rounds to whole ms</li><li>Read rows removed vs returned</li><li>One fix, then re-measure</li></ul>`, 'lam'), '') },
]);
