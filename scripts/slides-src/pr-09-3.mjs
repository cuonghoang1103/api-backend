/**
 * pr-09-3 — Prisma ORM · Chapter 9 · Lesson 9.3 "Indexes your Prisma queries can use" (deck video, 12/11/2026). Bài web: pr-9-3-chi-muc.
 * Output THẬT (`chay.sh p9-3`, prisma-pg9 PostgreSQL 16.14 4 CPU, CSDL c93 = mẫu c9, 1,2 triệu bài; Prisma 6.19.3). Mọi số ms trên slide ĐỌC TỪ output (không gõ tay).
 * Ba khoá ngoại không chỉ mục · trang tác giả: Parallel Seq Scan → Index Scan trên chỉ mục một phần · thứ tự cột: idx_ab / idx_ba với 4 truy vấn (A, B, B2, C) —
 * Prisma thêm ORDER BY id khi có take mà không orderBy ⇒ B đi theo khoá chính · @@index sort: Desc ⇒ DESC trong DDL · chỉ mục một phần KHÔNG dùng được khi truy vấn
 * thiếu điều kiện deleted_at · INCLUDE ⇒ Index Only Scan, Heap Fetches 0, Buffers 4 · pg_stat_user_indexes / pg_stat_user_tables.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p9-3/thu-tu.txt": "$ docker exec -i prisma-pg9 psql -U student -d c93 -c 'DROP INDEX posts_tac_gia_dang;' -c 'CREATE INDEX idx_ab ON posts (author_id, published_at);'\nDROP INDEX\nCREATE INDEX\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts A,B,B2,C\nA: Index Scan Backward using idx_ab on posts  · 0.029 ms\nB: Index Scan using posts_pkey on posts  · 413.691 ms\nB2: Parallel Seq Scan on posts  · 226.853 ms\nC: Bitmap Heap Scan on posts  → Bitmap Index Scan on idx_ab  · 0.187 ms\n$ docker exec -i prisma-pg9 psql -U student -d c93 -c 'DROP INDEX idx_ab;' -c 'CREATE INDEX idx_ba ON posts (published_at, author_id);'\nDROP INDEX\nCREATE INDEX\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts A,B,B2,C\nA: Index Scan Backward using idx_ba on posts  · 0.741 ms\nB: Index Scan using posts_pkey on posts  · 388.904 ms\nB2: Index Scan using idx_ba on posts  · 0.018 ms\nC: Index Scan using idx_ba on posts  · 10.185 ms\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts B du\n-- B: SELECT … FROM \"posts\" WHERE \"posts\".\"published_at\" > '2026-08-01 00:00:00 UTC' ORDER BY \"posts\".\"id\" ASC LIMIT 20 OFFSET 0\nLimit  (cost=0.43..12.23 rows=20 width=4) (actual time=389.942..389.953 rows=20 loops=1)\n  Buffers: shared hit=44715 read=90037\n  I/O Timings: shared read=273.210\n  ->  Index Scan using posts_pkey on posts  (cost=0.43..151923.59 rows=257398 width=4) (actual time=389.941..389.950 rows=20 loops=1)\n        Filter: (published_at > '2026-08-01 00:00:00'::timestamp without time zone)\n        Rows Removed by Filter: 915842\n        Buffers: shared hit=44715 read=90037\n        I/O Timings: shared read=273.210\nPlanning Time: 0.067 ms\nExecution Time: 389.976 ms\n$ docker exec -i prisma-pg9 psql -U student -d c93 -c 'DROP INDEX idx_ba;'\nDROP INDEX\n",
 "demo/out/p9-3/trang-truoc.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts trang du\n-- trang: SELECT … FROM \"posts\" WHERE (\"posts\".\"author_id\" = 42 AND \"posts\".\"published\" = true AND \"posts\".\"deleted_at\" IS NULL) ORDER BY \"posts\".\"published_at\" DESC LIMIT 20 OFFSET 0\nLimit  (cost=121939.22..121941.55 rows=20 width=1896) (actual time=242.936..247.762 rows=20 loops=1)\n  Buffers: shared hit=2216 read=112543\n  I/O Timings: shared read=523.409\n  ->  Gather Merge  (cost=121939.22..121960.22 rows=180 width=1896) (actual time=240.033..244.857 rows=20 loops=1)\n        Workers Planned: 2\n        Workers Launched: 2\n        Buffers: shared hit=2216 read=112543\n        I/O Timings: shared read=523.409\n        ->  Sort  (cost=120939.20..120939.42 rows=90 width=1896) (actual time=228.999..229.001 rows=16 loops=3)\n              Sort Key: published_at DESC\n              Sort Method: top-N heapsort  Memory: 45kB\n              Buffers: shared hit=2216 read=112543\n              I/O Timings: shared read=523.409\n              Worker 0:  Sort Method: top-N heapsort  Memory: 45kB\n              Worker 1:  Sort Method: top-N heapsort  Memory: 45kB\n              ->  Parallel Seq Scan on posts  (cost=0.00..120936.80 rows=90 width=1896) (actual time=6.180..228.766 rows=80 loops=3)\n                    Filter: (published AND (deleted_at IS NULL) AND (author_id = 42))\n                    Rows Removed by Filter: 399920\n                    Buffers: shared hit=2144 read=112543\n                    I/O Timings: shared read=523.409\nPlanning Time: 0.082 ms\nJIT:\n  Functions: 8\n  Options: Inlining false, Optimization false, Expressions true, Deforming true\n  Timing: Generation 0.642 ms, Inlining 0.000 ms, Optimization 0.549 ms, Emission 9.090 ms, Total 10.281 ms\nExecution Time: 247.972 ms\n",
 "demo/out/p9-3/trang-sau.txt": "$ docker exec -i prisma-pg9 psql -U student -d c93 -c 'CREATE INDEX posts_tac_gia_dang ON posts (author_id, published, published_at DESC) WHERE deleted_at IS NULL;'\nCREATE INDEX\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts trang du\n-- trang: SELECT … FROM \"posts\" WHERE (\"posts\".\"author_id\" = 42 AND \"posts\".\"published\" = true AND \"posts\".\"deleted_at\" IS NULL) ORDER BY \"posts\".\"published_at\" DESC LIMIT 20 OFFSET 0\nLimit  (cost=0.43..81.20 rows=20 width=1896) (actual time=0.017..0.032 rows=20 loops=1)\n  Buffers: shared hit=23\n  ->  Index Scan using posts_tac_gia_dang on posts  (cost=0.43..868.69 rows=215 width=1896) (actual time=0.016..0.030 rows=20 loops=1)\n        Index Cond: ((author_id = 42) AND (published = true))\n        Buffers: shared hit=23\nPlanning Time: 0.126 ms\nExecution Time: 0.043 ms\n",
 "demo/lab/p9/93/fk.sql": "SELECT c.conrelid::regclass AS bang, a.attname AS cot, c.conname AS rang_buoc\nFROM pg_constraint c\nJOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)\nWHERE c.contype = 'f'\n  AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND a.attnum = i.indkey[0])\nORDER BY 1, 2;\n",
 "demo/out/p9-3/fk-thieu.txt": "$ docker exec -i prisma-pg9 psql -U student -d c93 < p9/93/fk.sql\n   bang   |    cot    |        rang_buoc        \n----------+-----------+-------------------------\n posts    | author_id | posts_author_id_fkey\n comments | author_id | comments_author_id_fkey\n comments | post_id   | comments_post_id_fkey\n(3 rows)\n\n",
 "demo/lab/p9/93/desc.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\nmodel Post {\n  id          Int       @id @default(autoincrement())\n  authorId    Int       @map(\"author_id\")\n  publishedAt DateTime? @map(\"published_at\")\n  @@index([authorId, publishedAt(sort: Desc)])\n  @@map(\"posts\")\n}\n",
 "demo/out/p9-3/prisma-desc.txt": "$ npx prisma migrate diff --from-empty --to-schema-datamodel p9/93/desc.prisma --script | grep INDEX\nCREATE INDEX \"posts_author_id_published_at_idx\" ON \"posts\"(\"author_id\", \"published_at\" DESC);\n",
 "demo/out/p9-3/phu.txt": "$ docker exec -i prisma-pg9 psql -U student -d c93 -c 'CREATE INDEX posts_tac_gia_dang ON posts (author_id, published, published_at DESC) WHERE deleted_at IS NULL;'\nCREATE INDEX\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts phu du\n-- phu: SELECT … FROM \"posts\" WHERE (\"posts\".\"author_id\" = 42 AND \"posts\".\"published\" = true) ORDER BY \"posts\".\"published_at\" DESC LIMIT 20 OFFSET 0\nLimit  (cost=121939.42..121941.75 rows=20 width=31) (actual time=193.887..200.311 rows=20 loops=1)\n  Buffers: shared hit=16060 read=98699\n  I/O Timings: shared read=371.388\n  ->  Gather Merge  (cost=121939.42..121960.42 rows=180 width=31) (actual time=191.676..198.098 rows=20 loops=1)\n        Workers Planned: 2\n        Workers Launched: 2\n        Buffers: shared hit=16060 read=98699\n        I/O Timings: shared read=371.388\n        ->  Sort  (cost=120939.39..120939.62 rows=90 width=31) (actual time=181.604..181.606 rows=16 loops=3)\n              Sort Key: published_at DESC\n              Sort Method: top-N heapsort  Memory: 27kB\n              Buffers: shared hit=16060 read=98699\n              I/O Timings: shared read=371.388\n              Worker 0:  Sort Method: top-N heapsort  Memory: 27kB\n              Worker 1:  Sort Method: top-N heapsort  Memory: 27kB\n              ->  Parallel Seq Scan on posts  (cost=0.00..120937.00 rows=90 width=31) (actual time=3.805..181.426 rows=80 loops=3)\n                    Filter: (published AND (author_id = 42))\n                    Rows Removed by Filter: 399920\n                    Buffers: shared hit=15988 read=98699\n                    I/O Timings: shared read=371.388\nPlanning Time: 0.073 ms\nJIT:\n  Functions: 14\n  Options: Inlining false, Optimization false, Expressions true, Deforming true\n  Timing: Generation 0.487 ms, Inlining 0.000 ms, Optimization 0.475 ms, Emission 7.294 ms, Total 8.256 ms\nExecution Time: 200.514 ms\n$ docker exec -i prisma-pg9 psql -U student -d c93 -c 'CREATE INDEX posts_bang_liet_ke ON posts (author_id, published, published_at DESC) INCLUDE (id, title);' -c 'VACUUM ANALYZE posts;'\nCREATE INDEX\nERROR:  could not resize shared memory segment \"/PostgreSQL.4073595074\" to 67145312 bytes: No space left on device\n[exit 1]\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts phu du\n-- phu: SELECT … FROM \"posts\" WHERE (\"posts\".\"author_id\" = 42 AND \"posts\".\"published\" = true) ORDER BY \"posts\".\"published_at\" DESC LIMIT 20 OFFSET 0\nLimit  (cost=0.43..2.69 rows=20 width=31) (actual time=0.020..0.023 rows=20 loops=1)\n  Buffers: shared hit=4\n  ->  Index Only Scan using posts_bang_liet_ke on posts  (cost=0.43..24.73 rows=215 width=31) (actual time=0.019..0.021 rows=20 loops=1)\n        Index Cond: ((author_id = 42) AND (published = true))\n        Heap Fetches: 0\n        Buffers: shared hit=4\nPlanning Time: 0.052 ms\nExecution Time: 0.033 ms\n",
 "demo/out/p9-3/khong-dung.txt": "$ docker exec -i prisma-pg9 psql -U student -d c93 -tAc 'SELECT stats_reset FROM pg_stat_database WHERE datname = current_database();'\n\n$ docker exec -i prisma-pg9 psql -U student -d c93 < p9/93/khong-dung.sql\n bang  |       chi_muc       | so_lan_dung | kich_thuoc \n-------+---------------------+-------------+------------\n posts | posts_bang_liet_ke  |           4 | 67 MB\n posts | posts_tac_gia_dang  |           0 | 33 MB\n posts | posts_published_idx |           0 | 8144 kB\n(3 rows)\n\n bang  | seq_scan | seq_tup_read | idx_scan | hang_moi_lan_quet | so_hang \n-------+----------+--------------+----------+-------------------+---------\n posts |       30 |     14400000 |       10 |            480000 | 1201029\n(1 row)\n\n",
 "demo/out/p9-3/rong.txt": "$ docker exec -i prisma-pg9 psql -U student -d c93 -c 'CREATE INDEX posts_published_idx ON posts (published);' -c 'ANALYZE posts;'\nCREATE INDEX\nANALYZE\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c93 npx tsx p9/93/ke.mts rong\nrong: Index Only Scan using posts_bang_liet_ke on posts  · 127.581 ms\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, prs, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-09-3', code: 'PR 9.3', title: 'Indexes your Prisma queries can use', sub: 'Chapter 9 · Lesson 9.3' };

const DEMO = 'demo';
const OUT = (t, ch = 'p9-3') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/docker exec -i prisma-pg9 psql -U student -d c93/g, 'psql').replace(/p9\/9\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 (Docker, 4 CPU) · Prisma 6.19.3 · 1.2M posts';
const ke = (t, re) => gon(OUT(t)).split('\n').filter((l) => re.test(l)).map((l) => l.replace(/\(cost=[^)]*\) /, '').replace(/^\s+->\s+/, '  -> ').replace(/^\s{3,}/, '    ')).join('\n');
const exe = (t, k = 0) => [...OUT(t).matchAll(/Execution Time: ([\d.]+) ms/g)][k][1];
const thuTu = gon(OUT('thu-tu')).split('\n').filter((l) => /^(A|B|B2|C):/.test(l));
const phan = (i) => thuTu.slice(i * 4, i * 4 + 4).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — Performance', bai: '9.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 9 · Lesson 9.3', t: 'Indexes your Prisma queries can use', sub: 'Start from the SQL Prisma sends — then let EXPLAIN say whether the index works' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['search', 'Writing an index from the query, not the schema', ''],
      ['link', 'The foreign keys nobody indexed', ''],
      ['layers', 'Column order, measured on four queries', ''],
      ['filter', 'Covering indexes — and a partial index that silently does nothing', ''],
      ['gauge', 'Finding unused indexes and unindexed scans', ''],
    ], 2) },
  /* 3 */ { t: 'Start from the query Prisma sends', body: two(ts(`await prisma.post.findMany({
  where: { authorId: 42, published: true,
           deletedAt: null },
  orderBy: { publishedAt: 'desc' },
  take: 20,
});`, { sm: true }) + sql(`CREATE INDEX posts_tac_gia_dang ON posts
  (author_id, published, published_at DESC)
  WHERE deleted_at IS NULL;`, { sm: true }), tp(ke('trang-truoc', /Seq Scan|Rows Removed|Execution/) + '\n-- after\n' + ke('trang-sau', /Index Scan|Index Cond|Execution/), { wrap: 70, fs: 12, title: MOI }), '') +
      cards([
        ['Equality first, then the sort column', 'author_id, published, then published_at DESC; the soft-delete filter becomes the predicate.'],
        ['Verify', `Index Scan and no Sort node: ${exe('trang-truoc')} ms → ${exe('trang-sau')} ms.`],
      ], 2) },
  /* 4 */ { t: 'The foreign keys nobody indexed', body: sql(SRC('fk.sql'), { sm: true }) + tp(gon(OUT('fk-thieu')).split('\n').slice(1).join('\n'), { fs: 15, title: MOI }) +
      box('PostgreSQL indexes the referenced side, never the referencing side', 'Prisma created these foreign keys with db push and no index on any of them. Every include, every cascade and every "posts of user X" pays for it — in 9.1 the slowest query left was exactly a COUNT by author_id.', 'do2') },
  /* 5 */ { t: 'Column order, measured', body: two(ts(`// A:  authorId = 42, orderBy publishedAt desc
// B:  publishedAt > '2026-08-01', take 20
//     (no orderBy)
// B2: same, orderBy publishedAt asc
// C:  authorId = 42, every row`, { sm: true }) + tp('-- idx_ab (author_id, published_at)\n' + phan(0) + '\n-- idx_ba (published_at, author_id)\n' + phan(1), { wrap: 70, fs: 12, title: MOI }),
      tp(ke('thu-tu', /^-- B:|Index Scan using posts_pkey|Execution/).split('\n').slice(0, 3).join('\n'), { wrap: 56, fs: 12, title: 'why B ignores both indexes' }), '') +
      box('take without orderBy: Prisma adds ORDER BY id', 'B walks the primary key; with an orderBy (B2) the leading-column range wins. The "wrong" order still scanned an index, just slower.', 'lam') },
  /* 6 */ { t: 'In Prisma: sort direction lives in @@index', body: prs(SRC('desc.prisma').split('\n').slice(4).join('\n'), { sm: true }) + tp(gon(OUT('prisma-desc')), { wrap: 116, fs: 14, title: MOI }) +
      cards([
        ['A composite index serves its prefixes', '(a, b) serves a and (a, b) — query C used idx_ab cheaply, idx_ba only by scanning it.'],
        ['Equality first, range or sort last', 'Columns after a range can only filter, not seek.'],
        ['Partial indexes are not expressible', 'WHERE deleted_at IS NULL needs a hand-written migration (Lesson 6.3).'],
      ], 3) },
  /* 7 */ { t: 'A covering index — and a partial index that does nothing', body: ts(`await prisma.post.findMany({ where: { authorId: 42, published: true },   // no deletedAt filter!
  orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, publishedAt: true }, take: 20 });`, { sm: true }) +
      two(tp(ke('phu', /Seq Scan|Execution/).split('\n').slice(0, 2).join('\n'), { wrap: 64, fs: 12, title: 'only the partial index exists' }),
        tp(ke('phu', /Index Only Scan|Heap Fetches|Buffers: shared hit=4$|Execution/).split('\n').slice(-4).join('\n'), { wrap: 64, fs: 12, title: '+ (author_id, published, published_at DESC) INCLUDE (id, title)' }), '') +
      box('A partial index is used only when the query repeats its predicate', 'Without deletedAt: null in the where, posts_tac_gia_dang could not be used — a full parallel scan. The INCLUDE index answered from the index alone: Heap Fetches 0, 4 buffers.', 'do2') },
  /* 8 */ { t: 'Find the indexes nobody uses, and the scans nobody fixed', body: tp(gon(OUT('khong-dung')).split('\n').filter((l) => !/^\$/.test(l)).join('\n'), { wrap: 116, fs: 13, title: MOI }) +
      cards([
        ['Zero scans', 'posts_tac_gia_dang and posts_published_idx were never used by this workload. Check stats_reset before trusting a zero.'],
        ['seq_tup_read ÷ seq_scan ≈ table size', 'Full scans of a large table: find the query in pg_stat_statements.'],
        ['Drop in a migration, CONCURRENTLY', 'By hand, and the next migrate diff calls it drift.'],
      ], 3) },
  /* 9 */ { t: 'Queries no B-tree can save', body: cmp(['Query', 'Why', 'Instead'], [
      [c("contains / ILIKE '%x%'"), 'leading wildcard', 'pg_trgm GIN — 9.1'],
      [c('skip: 1000000'), 'reads and discards the offset', 'keyset — 9.5'],
      [c('count()') + ' on a big table', 'no stored row count', 'reltuples estimate — 9.5'],
      [c('where: { published: true }') + ' (90 % match)', 'returns most of the table', 'it used a covering index and still read ~1M rows'],
    ]) + tp(gon(OUT('rong')).split('\n').filter((l) => /^rong:/.test(l)).join('\n'), { fs: 14, title: MOI }) },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run the foreign-key query on your database`,
      `EXPLAIN one Prisma query; write its index`,
      `Swap the column order; EXPLAIN again`,
      `Check ${c('pg_stat_user_indexes')} for zero scans`,
    ]), box('Keep these', `<ul><li>Index the query, not the schema</li><li>Foreign keys need their own index</li><li>Partial index ⇒ repeat the predicate</li><li>take alone adds ORDER BY id</li></ul>`, 'lam'), '') },
]);
function SRC(t) { return fs.readFileSync(`${DEMO}/lab/p9/93/${t}`, 'utf8').replace(/\n+$/, ''); }
