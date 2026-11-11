/**
 * pr-05-5 — Prisma ORM · Chapter 5 · Lesson 5.5 "Search: four levels, measured" (deck video, 12/11/2026). Bài web: pr-5-5-tim-kiem.
 * Output THẬT (`chay.sh p5-5`, demo/lab/p5/55, CSDL c55: 400.000 post, Prisma 6.19.3 · PostgreSQL 16.14): cấp 1 ILIKE title OR body: quét song song
 * 295 ms (LIMIT 20 dừng sớm 159 ms), qua Prisma ~165 ms · cấp 2 hai GIN trigram (tạo 1,9 s + 7,5 s) ⇒ BitmapOr 0,28 ms · similarity bắt lỗi gõ "Prima" ·
 * cấp 3 cột tsvector sinh (ALTER 20,3 s) + GIN ⇒ 0,85 ms kèm xếp hạng ts_rank; websearch "prisma -migrate" ⇒ 56 · tiếng Việt: "tieng viet" 0 ⇒ unaccent ⇒ 8.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p5-5/cap.txt": "$ docker exec -i prisma-pg psql -U student -d c55 < p5/55/cap.sql\n posts  \n--------\n 400000\n\n== level 1: ILIKE on title OR body, no index\n                                  QUERY PLAN                                   \n-------------------------------------------------------------------------------\n Limit (actual rows=20 loops=1)\n   ->  Seq Scan on posts (actual rows=20 loops=1)\n         Filter: ((title ~~* '%prisma%'::text) OR (body ~~* '%prisma%'::text))\n         Rows Removed by Filter: 75067\n Planning Time: 0.381 ms\n Execution Time: 158.890 ms\n\n                                  QUERY PLAN                                   \n-------------------------------------------------------------------------------\n Gather (actual rows=96 loops=1)\n   Workers Planned: 2\n   Workers Launched: 2\n   ->  Parallel Seq Scan on posts (actual rows=32 loops=3)\n         Filter: ((title ~~* '%prisma%'::text) OR (body ~~* '%prisma%'::text))\n         Rows Removed by Filter: 133301\n Planning Time: 0.282 ms\n Execution Time: 295.289 ms\n\n== level 2: two trigram indexes\nCREATE EXTENSION\nTiming is on.\nCREATE INDEX\nTime: 1874.937 ms (00:01.875)\nCREATE INDEX\nTime: 7456.561 ms (00:07.457)\nTiming is off.\nANALYZE\n                                  QUERY PLAN                                   \n-------------------------------------------------------------------------------\n Bitmap Heap Scan on posts (actual rows=96 loops=1)\n   Recheck Cond: ((title ~~* '%prisma%'::text) OR (body ~~* '%prisma%'::text))\n   Heap Blocks: exact=59\n   ->  BitmapOr (actual rows=0 loops=1)\n         ->  Bitmap Index Scan on posts_title_trgm (actual rows=80 loops=1)\n               Index Cond: (title ~~* '%prisma%'::text)\n         ->  Bitmap Index Scan on posts_body_trgm (actual rows=16 loops=1)\n               Index Cond: (body ~~* '%prisma%'::text)\n Planning Time: 0.524 ms\n Execution Time: 0.282 ms\n\n== fuzzy: similarity, with a typo\n  id   |             title             | sim  \n-------+-------------------------------+------\n     7 | Huong dan Prisma tu dau 7     | 0.54\n 10007 | Huong dan Prisma tu dau 10007 | 0.47\n 20007 | Huong dan Prisma tu dau 20007 | 0.47\n\n== level 3: generated tsvector + GIN\nTiming is on.\nALTER TABLE\nTime: 20290.871 ms (00:20.291)\nCREATE INDEX\nTime: 2081.083 ms (00:02.081)\nTiming is off.\nANALYZE\n                                    QUERY PLAN                                    \n----------------------------------------------------------------------------------\n Limit (actual rows=20 loops=1)\n   ->  Sort (actual rows=20 loops=1)\n         Sort Key: (ts_rank(search, '''prisma'''::tsquery)) DESC, id DESC\n         Sort Method: top-N heapsort  Memory: 26kB\n         ->  Bitmap Heap Scan on posts (actual rows=96 loops=1)\n               Recheck Cond: (search @@ '''prisma'''::tsquery)\n               Heap Blocks: exact=66\n               ->  Bitmap Index Scan on posts_search_idx (actual rows=96 loops=1)\n                     Index Cond: (search @@ '''prisma'''::tsquery)\n Planning Time: 0.219 ms\n Execution Time: 0.850 ms\n\n   id   |             title              |  rank  \n--------+--------------------------------+--------\n 390013 | Migrate voi Prisma 390013      | 0.6079\n 390007 | Huong dan Prisma tu dau 390007 | 0.6079\n 380013 | Migrate voi Prisma 380013      | 0.6079\n\n prisma -migrate \n-----------------\n              56\n\n== Vietnamese without accents\n tiếng việt \n------------\n          8\n\n tieng viet \n------------\n          0\n\nCREATE EXTENSION\nCREATE FUNCTION\nALTER TABLE\nALTER TABLE\nCREATE INDEX\n tieng viet (unaccent) \n-----------------------\n                     8\n\n tiếng việt (unaccent) \n-----------------------\n                     8\n\n",
 "demo/out/p5-5/cap1.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c55 npx tsx p5/55/cap1.mts\n[level 1] SELECT … FROM \"posts\" WHERE (\"title\" ILIKE $1 OR \"body\" ILIKE $2) ORDER BY \"id\" ASC LIMIT $3 OFFSET $4 [\"%prisma%\",\"%prisma%\",20,0]\nrun 1: 20 rows · 165 ms\nrun 2: 20 rows · 163 ms\nrun 3: 20 rows · 172 ms\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-05-5', code: 'PR 5.5', title: 'Search: four levels, measured', sub: 'Chapter 5 · Lesson 5.5' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p5-5/${t}.txt`, 'utf8').replace(/\n+$/, '');
const CAP = OUT('cap').split('\n');
const doan = (tu, den) => { const i = CAP.findIndex((l) => l.includes(tu)); const j = den ? CAP.findIndex((l, k) => k > i && l.includes(den)) : CAP.length; return CAP.slice(i, j).filter((l) => !/^\s*$|^-+$|QUERY PLAN|^\(\d+ rows?\)/.test(l)).join('\n'); };
const tg = (s) => (s.match(/Execution Time: ([\d.]+) ms/g) || []).map((x) => x.match(/[\d.]+/)[0]);
const L1 = tg(doan('== level 1', '== level 2')), L2 = tg(doan('== level 2', '== fuzzy')), L3 = tg(doan('== level 3', '== Vietnamese'));

export const slides = lamDeck({ chuong: 'Chapter 5 — Querying in depth', bai: '5.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 5 · Lesson 5.5', t: 'Search: four levels,<br>measured', sub: 'contains → trigram → full-text → a search engine, on 400,000 rows' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Level 1, <code>contains</code>: what it costs and what it gets wrong</li>
    <li>Level 2, a trigram index: two SQL lines, no code change</li>
    <li>Level 3, a generated <code>tsvector</code>: ranking and real query syntax</li>
    <li>Vietnamese without accents</li>
    <li>Level 4, and when it is actually justified</li></ul>` },
  /* 3 */ { t: 'Level 1 — contains', body: ts(`await prisma.post.findMany({
  where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { body: { contains: q, mode: 'insensitive' } }] },
  take: 20,
});`, { sm: true }) + tp(OUT('cap1').replace(/^\$ DATABASE_URL=\S+ /m, '$ ').replace(/SELECT … FROM/, 'SELECT … FROM'), { wrap: 130, fs: 13 }) +
    tp(doan('== level 1', '== level 2').split('\n').slice(-8).join('\n'), { wrap: 120, fs: 12, title: 'EXPLAIN ANALYZE — all matches' }) },
  /* 4 */ { t: 'What level 1 costs, and gets wrong', body: cards([
      ['Costs', `A sequential scan of every row, twice per row (title and body): ${L1[1]} ms for all matches at 400,000 rows, and linear in table size.`],
      ['Gets wrong', 'No ranking — a title match scores like a body match. No word logic: "prisma migrate" only finds that exact substring.'],
      ['Genuinely fine', 'Under ~10,000 rows, or when another indexed filter has already narrowed the set — searching one user\'s own notes.'],
    ], 3) + box('Linear in rows', 'Twice the table, twice the time: at four million posts the same query is seconds, on every keystroke.', 'do2') },
  /* 5 */ { t: 'Level 2 — a trigram index', body: sql(`CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);
CREATE INDEX "posts_body_trgm"  ON "posts" USING gin ("body"  gin_trgm_ops);
-- exactly the same Prisma query as level 1`, { sm: true }) +
    tp(doan('== level 2', '== fuzzy').replace('== level 2: two trigram indexes', '').split('\n').filter((l) => !/^CREATE EXTENSION|^Timing|^ANALYZE/.test(l)).join('\n'), { wrap: 120, fs: 13 }) +
    box(`${L1[1]} ms → ${L2[0]} ms, no code change`, 'Two indexes; the planner ORs two bitmap index scans.', 'xanh') },
  /* 6 */ { t: 'Fuzzy matching, once the trigram index exists', body: sql(`SELECT id, title, similarity(title, 'Huong dan Prima') AS sim
FROM posts WHERE title % 'Huong dan Prima'          -- note the typo
ORDER BY sim DESC LIMIT 3;`, { sm: true }) + tp(doan('== fuzzy', '== level 3').replace('== fuzzy: similarity, with a typo', ''), { wrap: 110, fs: 16 }) +
    box('Typo tolerance for free', '"Prima" still finds "Prisma": trigram similarity compares overlapping three-letter fragments. It runs through <code>$queryRaw</code>.', 'lam') },
  /* 7 */ { t: 'Level 3 — PostgreSQL full-text search', body: sql(`ALTER TABLE "posts" ADD COLUMN "search" tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("body",  '')), 'B')) STORED;
CREATE INDEX "posts_search_idx" ON "posts" USING gin ("search");`, { sm: true }) + prs(`model Post {
  // …
  search Unsupported("tsvector")?      // generated; never written by the client
}`, { sm: true }) +
    box('A generated column cannot fall out of sync', 'PostgreSQL recomputes it on every insert and update — no trigger to maintain. Adding it to 400,000 rows took about 20 seconds; plan that migration.', 'lam') },
  /* 8 */ { t: 'Ranked results, in a millisecond', body: sql(`SELECT id, title, ts_rank("search", websearch_to_tsquery('simple', $1)) AS rank
FROM posts WHERE "search" @@ websearch_to_tsquery('simple', $1)
ORDER BY rank DESC, id DESC LIMIT 20;                    -- via $queryRaw`, { sm: true }) +
    tp(doan('== level 3', '== Vietnamese').split('\n').filter((l) => /Limit|Sort|Bitmap|Index Cond|Execution|rank|^\s+\d+ \||prisma -migrate|^\s+\d+$/.test(l)).join('\n'), { wrap: 120, fs: 12 }) +
    cards([
      ['Ranking', 'A title match (weight A) outranks a body match (weight B).'],
      ['Real query syntax', '<code>prisma -migrate</code>, <code>"exact phrase"</code>, <code>or</code> — and malformed input never throws.'],
      ['\'simple\', not \'english\'', 'No Vietnamese stemmer in core PostgreSQL; \'simple\' lowercases and splits.'],
    ], 3) },
  /* 9 */ { t: 'Vietnamese without accents', body: tp(doan('== Vietnamese').split('\n').filter((l) => !/^CREATE|^ALTER|^-/.test(l)).join('\n'), { wrap: 100, fs: 15 }) +
    sql(`CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE FUNCTION unaccented(text) RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  AS $$ SELECT unaccent('unaccent', $1) $$;
-- rebuild "search" with unaccented(...) on title and body, and query with unaccented($1)`, { sm: true }) },
  /* 10 */ { t: 'Level 4 — a dedicated search engine', body: cards([
      ['The threshold', 'Typo tolerance across everything, facets, synonyms, per-user relevance, many millions of documents.'],
      ['What it costs', 'A second datastore, an indexing pipeline, and a search index that is always a little behind the database.'],
      ['Do not skip level 3', 'Reaching for a search engine at 50,000 rows buys years of operations work a tsvector column would have deferred.'],
    ], 3) + box('Measure first', 'The numbers on this deck are the argument: levels 2 and 3 answer in under a millisecond on 400,000 rows.', 'lam') },
  /* 11 */ { t: 'The four, side by side', body: tbl(['Level', 'Measured here', 'Setup', 'Adds'], [
      ['1 · contains', L1[1] + ' ms', 'none', '—'],
      ['2 · trigram', L2[0] + ' ms', 'two indexes', 'fuzzy matching'],
      ['3 · tsvector + GIN', L3[0] + ' ms', 'generated column, raw queries', 'ranking, query syntax'],
      ['4 · search engine', '—', 'a second system', 'everything else'],
    ], { cap: '400,000 posts, the word "prisma", PostgreSQL 16.14 on one laptop' }) +
    box('From the CuongThai codebase', 'The site runs <code>pg_trgm</code> for fuzzy post search and <code>pgvector</code> for embeddings — level two plus a semantic layer, no separate search engine.', 'lam') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `EXPLAIN a ${c('contains')} search on a large table`,
      `Add two trigram indexes; EXPLAIN the same query`,
      `Add a generated ${c('tsvector')}; rank with ${c('ts_rank')}`,
      `Search "tieng viet"; add ${c('unaccent')}; search again`,
    ]), box('Keep these', `<ul><li>contains = full scan, no ranking</li><li>Trigram: two lines, no code change</li><li>tsvector + GIN for ranking</li><li>unaccent for Vietnamese</li></ul>`, 'lam'), '') },
]);
