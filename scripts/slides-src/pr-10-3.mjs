/**
 * pr-10-3 — Prisma ORM · Chapter 10 · Lesson 10.3 "Five things only SQL can say" (deck video, 12/11/2026). Bài web: pr-10-3-chi-sql-noi-duoc.
 * Output THẬT (`chay.sh p10-3`, prisma-pg PostgreSQL 16.14, CSDL c103 = mẫu c10 + chỉ mục (author_id, created_at DESC); Prisma 6.19.3; trung vị 5): top-3 mỗi người ×50:
 * vòng lặp 50 truy vấn, include take 3 = 2 truy vấn nhưng đọc HẾT bài của 50 người rồi cắt trong engine, LATERAL 1 truy vấn nhanh nhất, row_number() thứ hai ·
 * rank / dense_rank / tổng luỹ tiến / lag trên 6 người (có một cặp hoà) · CTE đệ quy tới tầng 5, include 4 tầng thiếu tầng 5; có vòng + chặn độ sâu ⇒ 11 hàng, không chặn ⇒
 * statement_timeout 57014 · 4.096 upsert ~3,5 s vs unnest + ON CONFLICT ~56 ms · tsvector sinh ra + GIN: websearch_to_tsquery, ts_rank, ts_headline; contains 0 hàng.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p10-3/topn.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c103 npx tsx p10/103/nam.mts topn\nvong lap 50 findMany      → 150 hang · 50 truy van · 36.1 ms\ninclude posts take 3      → 150 hang · 2 truy van · 6.0 ms\nLATERAL                   → 150 hang · 1 truy van · 1.1 ms\nrow_number() <= 3         → 150 hang · 1 truy van · 3.0 ms\nSQL cua include take 3: SELECT … FROM \"users\" WHERE \"users\".\"id\" IN ($1 … $50) OFFSET $51 ; SELECT … FROM \"posts\" WHERE \"posts\".\"author_id\" IN ($1 … $50) ORDER BY \"posts\".\"created_at\" DESC OFFSET $51\n",
 "demo/out/p10-3/cua-so.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c103 npx tsx p10/103/nam.mts cua-so\n┌─────────┬──────────┬────────────┬──────┬───────────┬──────────┬────────────┐\n│ (index) │ username │ post_count │ hang │ hang_lien │ luy_tien │ nguoi_tren │\n├─────────┼──────────┼────────────┼──────┼───────────┼──────────┼────────────┤\n│ 0       │ 'user1'  │ 50         │ 1    │ 1         │ 50       │ null       │\n│ 1       │ 'user2'  │ 41         │ 2    │ 2         │ 91       │ 'user1'    │\n│ 2       │ 'user3'  │ 29         │ 3    │ 3         │ 120      │ 'user2'    │\n│ 3       │ 'user4'  │ 29         │ 3    │ 3         │ 149      │ 'user3'    │\n│ 4       │ 'user7'  │ 15         │ 5    │ 4         │ 164      │ 'user4'    │\n│ 5       │ 'user8'  │ 10         │ 6    │ 5         │ 174      │ 'user7'    │\n└─────────┴──────────┴────────────┴──────┴───────────┴──────────┴────────────┘\n",
 "demo/out/p10-3/de-quy.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c103 npx tsx p10/103/nam.mts de-quy\n┌─────────┬────┬────────┬──────────────────────────────────────────────┐\n│ (index) │ id │ do_sau │ content                                      │\n├─────────┼────┼────────┼──────────────────────────────────────────────┤\n│ 0       │ 1  │ 0      │ 'Bai viet hay'                               │\n│ 1       │ 3  │ 1      │ '  Dong y'                                   │\n│ 2       │ 4  │ 2      │ '    Minh cung nghi vay'                     │\n│ 3       │ 5  │ 3      │ '      Chinh xac'                            │\n│ 4       │ 6  │ 4      │ '        Tang 5 — include 3 tang khong thay' │\n│ 5       │ 2  │ 0      │ 'Cho hoi phan 2 khi nao ra?'                 │\n└─────────┴────┴────────┴──────────────────────────────────────────────┘\ninclude 4 tang (goc + 3): {\"content\":\"Bai viet hay\",\"replies\":[{\"content\":\"Dong y\",\"replies\":[{\"content\":\"Minh cung nghi vay\",\"replies\":[{\"content\":\"Chinh xac\"}]}]}]}\nco vong + chan do sau 10 → { so_hang: 11, sau_nhat: 10 }\nco vong + KHONG chan → P2010 Raw query failed. Code: `57014`. Message: `ERROR: canceling statement due to statement timeout`\n",
 "demo/out/p10-3/upsert.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c103 npx tsx p10/103/nam.mts upsert\nvong lap upsert x 4096    → 3408 ms\nunnest + ON CONFLICT x 4096 → 56 ms · 4096 hang · 4 tham so\nk0 sau ca hai: 3\n",
 "demo/out/p10-3/fts.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c103 npx tsx p10/103/nam.mts fts\n┌─────────┬───────┬──────────┬─────────────────────────────────────────────────────────────────────────────────┐\n│ (index) │ id    │ score    │ trich                                                                           │\n├─────────┼───────┼──────────┼─────────────────────────────────────────────────────────────────────────────────┤\n│ 0       │ 99999 │ '0.0974' │ '<mark>prisma</mark> migration tren <mark>production</mark> — ghi chu so 99999' │\n│ 1       │ 99993 │ '0.0974' │ '<mark>prisma</mark> migration tren <mark>production</mark> — ghi chu so 99993' │\n│ 2       │ 99987 │ '0.0974' │ '<mark>prisma</mark> migration tren <mark>production</mark> — ghi chu so 99987' │\n└─────────┴───────┴──────────┴─────────────────────────────────────────────────────────────────────────────────┘\nthoi gian (trung vi 5): 18.3 ms\ncontains 'prisma production' → 0 hang · 18.7 ms (khop chuoi lien, khong hieu tu)\nBitmap Heap Scan on posts  (cost=67.49..2889.01 rows=5561 width=4)\n  ->  Bitmap Index Scan on posts_tim_kiem_idx  (cost=0.00..66.10 rows=5561 width=0)\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-10-3', code: 'PR 10.3', title: 'Five things only SQL can say', sub: 'Chapter 10 · Lesson 10.3' };

const DEMO = 'demo';
const OUT = (t, ch = 'p10-3') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p10\/10\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3 · 100,000 posts';
const bo$ = (t) => gon(OUT(t)).split('\n').filter((l) => !/^\$ /.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 10 — Escape hatches: raw SQL and client extensions', bai: '10.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 10 · Lesson 10.3', t: 'Five things only SQL can say', sub: 'Top-N per group, windows, recursion, merge-on-conflict, ranked search — each run' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['list', 'Top-N per group with LATERAL', ''],
      ['stack', 'Window functions: rank, running total, previous row', ''],
      ['tree', 'A recursive CTE for a tree of any depth', ''],
      ['merge', 'ON CONFLICT with an expression, for thousands of rows', ''],
      ['search', 'Full-text search that ranks', ''],
    ], 2) },
  /* 3 */ { t: '1 · Top-N per group', body: sql(`SELECT u.id, p.id AS post_id, p.created_at
FROM users u
CROSS JOIN LATERAL (
  SELECT id, created_at FROM posts
  WHERE author_id = u.id AND deleted_at IS NULL
  ORDER BY created_at DESC LIMIT 3) p
WHERE u.id = ANY($1);           -- 50 authors`, { sm: true }) +
      tp(bo$('topn').replace(/SQL cua include take 3: /, 'include take 3 sends: ').replace(/ ; /, '\n  ; '), { wrap: 116, fs: 13, title: MOI }) +
      box('include with take did not limit per author in SQL', 'Its second query reads every post of the 50 authors, ordered, and the engine keeps three each. LATERAL runs the LIMIT 3 per author inside PostgreSQL, on the (author_id, created_at DESC) index.', 'lam') },
  /* 4 */ { t: '2 · Window functions keep every row', body: sql(`SELECT u.username, count(p.id)::int AS post_count,
  rank()       OVER (ORDER BY count(p.id) DESC) AS hang,
  dense_rank() OVER (ORDER BY count(p.id) DESC) AS hang_lien,
  sum(count(p.id)) OVER (ORDER BY count(p.id) DESC, u.id) AS luy_tien,
  lag(u.username)  OVER (ORDER BY count(p.id) DESC, u.id) AS nguoi_tren
FROM users u LEFT JOIN posts p ON p.author_id = u.id AND p.deleted_at IS NULL
GROUP BY u.id, u.username ORDER BY post_count DESC;`, { sm: true }) + tp(bo$('cua-so'), { fs: 13, title: MOI }) +
      box('rank skips after a tie; dense_rank does not', 'user3 and user4 tie at 29: rank gives 3, 3, 5 — dense_rank 3, 3, 4. groupBy can count; it cannot rank, accumulate or look at the previous row.', 'lam') },
  /* 5 */ { t: '3 · A recursive CTE: the whole tree', body: two(sql(`WITH RECURSIVE tree AS (
  SELECT id, content, parent_id, 0 AS do_sau,
         ARRAY[id] AS path
  FROM comments
  WHERE post_id = 1 AND parent_id IS NULL
  UNION ALL
  SELECT c.id, c.content, c.parent_id,
         tree.do_sau + 1, tree.path || c.id
  FROM comments c
  JOIN tree ON c.parent_id = tree.id
  WHERE tree.do_sau < 10        -- depth guard
)
SELECT * FROM tree ORDER BY path;`, { sm: true }), tp(bo$('de-quy').split('\n').slice(0, 10).join('\n'), { wrap: 62, fs: 12, title: MOI }), '') +
      tp(bo$('de-quy').split('\n').slice(10).join('\n'), { wrap: 116, fs: 12, title: 'include, four levels deep — and a cycle' }) },
  /* 6 */ { t: 'The depth guard is not optional', body: sql(`UPDATE comments SET parent_id = 6 WHERE id = 1;   -- 1 → 3 → 4 → 5 → 6 → 1: a cycle
SET LOCAL statement_timeout = '2s';
WITH RECURSIVE tree AS (SELECT id FROM comments WHERE id = 1
  UNION ALL SELECT c.id FROM comments c JOIN tree ON c.parent_id = tree.id)   -- no guard
SELECT count(*) FROM tree;`, { sm: true }) + cards([
        ['include stops where you stop writing', 'Four nested levels returned four; the fifth reply was silently missing.'],
        ['A cycle runs forever', 'With a row pointing back at its descendant and no guard, the query ran until statement_timeout cancelled it (57014).'],
        ['With the guard', 'The same cycle returned 11 rows and stopped at depth 10. Always keep the WHERE on depth.'],
      ], 3) + tp(bo$('de-quy').split('\n').slice(-2).join('\n'), { wrap: 116, fs: 14, title: MOI }) },
  /* 7 */ { t: '4 · ON CONFLICT with an expression', body: sql(`INSERT INTO daily_stats (key, day, count, updated_at)
SELECT * FROM unnest($1::text[], $2::date[], $3::int[], $4::timestamptz[])
ON CONFLICT (key, day) DO UPDATE
SET count = daily_stats.count + EXCLUDED.count,
    updated_at = GREATEST(daily_stats.updated_at, EXCLUDED.updated_at)
WHERE EXCLUDED.updated_at > daily_stats.updated_at;`, { sm: true }) +
      tp(bo$('upsert'), { wrap: 116, fs: 14, title: MOI }) +
      bars(bo$('upsert').split('\n').filter((l) => / ms/.test(l)).map((l) => [l.split('→')[0].trim(), Number(l.match(/→\s+(\d+) ms/)[1]), /unnest/.test(l) ? '#2f9e44' : '#c92a2a']), { nhan: 360 }) +
      box('EXCLUDED, and four parameters for 4,096 rows', 'EXCLUDED is the row that would have been inserted, so the update reads both sides. unnest of arrays stays far below the bind-parameter cap; a loop of upsert pays one statement and one commit per row.', 'lam') },
  /* 8 */ { t: '5 · Full-text search that ranks', body: sql(`ALTER TABLE posts ADD COLUMN tim_kiem tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(content, ''))) STORED;
CREATE INDEX posts_tim_kiem_idx ON posts USING GIN (tim_kiem);

SELECT id, ts_rank(tim_kiem, q) AS score,
       ts_headline('simple', content, q, 'StartSel=<mark>, StopSel=</mark>') AS trich
FROM posts, websearch_to_tsquery('simple', $1) AS q
WHERE tim_kiem @@ q AND deleted_at IS NULL
ORDER BY ts_rank(tim_kiem, q) DESC, created_at DESC LIMIT 3;`, { sm: true }) +
      tp(bo$('fts'), { wrap: 116, fs: 11, title: MOI }) },
  /* 9 */ { t: 'When not to reach for this', body: cmp(['Use SQL when', 'Stay in the builder when'], [
      ['the shape is per-group, ranked, recursive or merged', 'it is a find, a filter, a page, a nested write'],
      ['the builder needs N queries or loads everything', 'one batched include already does it'],
      ['you will type it (10.2, 10.4) and test it', 'nobody will maintain the raw string'],
    ]) + box('Every raw query is a place the schema no longer protects', 'Column renames, soft-delete filters and types all stop at the backtick. Use it for these five shapes, deliberately — not for convenience.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Fetch 3 posts per author three ways; time them`,
      `Rank authors with ties; compare rank and dense_rank`,
      `Walk a 5-level tree; then make a cycle`,
      `Merge 4,096 counters in one statement`,
    ]), box('Keep these', `<ul><li>LATERAL for top-N per group</li><li>Windows keep every row</li><li>Recursive CTE + depth guard</li><li>unnest + ON CONFLICT for bulk merges</li></ul>`, 'lam'), '') },
]);
