/**
 * pg-13-4 — PostgreSQL · Chapter 13 · Lesson 13.4 "Trigram search: typos, partial names and ILIKE that flies" (slide EN, kiểu FU, 26/10/2026, agent c13).
 * Nguồn: content/courses/postgresql/s13-jsonb-fts.mjs › postgresql-13-4-trigram. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-13-4.sql/.out.txt, bài tập pg-13-4ex) — đọc qua pg-13-out.mjs. SQL trên slide chỉ khác bản chạy ở chỗ xuống dòng.
 * Bổ sung so với bài web: FTS thua lỗi gõ (nguyn ⇒ f), Nguyen vs Nguyn 4/9 = 0,444, % và ngưỡng 0,3, <-> khoảng cách, word_similarity / strict,
 * khách CT Shop có dấu vs không dấu (0,478 → 0,789 sau khi bỏ dấu), B-tree KHÔNG giúp ILIKE '%…%' (Index Only Scan vẫn đọc hết, 79 ms),
 * GIN trigram 77 ms → 0,075 ms, regex cũng dùng được, mẫu < 3 ký tự ⇒ Seq Scan, bẫy similarity() > x (Seq 379 ms) vs % (ngưỡng mặc định 0,3
 * khớp 121.594 dòng vì chung "note"), GiST + KNN ORDER BY <-> (21,7 vs 418 ms), GIN 4,5 MB vs GiST 15 MB, unaccent STABLE ⇒ lỗi chỉ mục
 * ⇒ hàm bọc IMMUTABLE với từ điển ghi rõ schema, 15,6 ms vs 336 ms, cách CuongThai dùng translate() trong cột GENERATED (title_fold), FTS trước
 * trigram lùi, trigram trên văn bản dài (10 MB ≈ bảng, 5× FTS), chọn FTS/trigram/B-tree, khi nào cần Elasticsearch/Meilisearch.
 */
import { lamDeck, two, box, cards } from './_pg-chung.mjs';
import { trigramPic, chooseSearch, P, S, p, L } from './pg-13-hinh.mjs';
import { barsPages } from './pg-09-hinh.mjs';

export const deck = { key: 'pg-13-4', code: 'PG 13.4', title: 'Trigram search: typos, partial names and fast ILIKE', sub: 'pg_trgm, GIN/GiST trigram, unaccent for Vietnamese' };

const J = (...xs) => xs.join('\n');

export const slides = lamDeck({ chuong: 'Chapter 13 — JSONB, GIN, full-text search & trigram', bai: '13.4' }, [
  { cover: true, t: 'Trigram search:<br>typos, partial names, fast ILIKE', sub: "pg_trgm · similarity · ILIKE '%…%' with an index<br>Vietnamese without accents · when to use Elasticsearch" },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>trigram</b> is, and how <code class="i">similarity</code> measures “almost the same”</li>
<li>Fuzzy search for <b>typos</b> and half-remembered names</li>
<li>The index that makes <code class="i">ILIKE '%…%'</code> fast — and its traps (short patterns, <code class="i">similarity() &gt; x</code>)</li>
<li>Vietnamese without accents: <b>unaccent</b> is not IMMUTABLE — the wrapper that fixes it, and CuongThai’s own trick</li>
<li>FTS vs trigram vs B-tree — and when PostgreSQL is no longer enough</li>
</ul>` },

  { t: 'When users cannot spell', body: `
${two(P(J(L('4', "SELECT to_tsvector('simple', 'Nguyen Van An') @@", { q: "SELECT to_tsvector('simple', 'Nguyen Van An')\n    @@ to_tsquery('simple', 'nguyn') AS fts_go_sai;" }), L('4', "SELECT similarity('Nguyen', 'Nguyn')")), { w: 540, hm: [' f', '0.44444445'] }),
box('Words vs pieces of words', 'Full-text search works on <b>whole words</b>: “nguyn” is a different lexeme from “nguyen”, so a single missing letter gives <b>false</b>. It also cannot find “12345” in the middle of a product code. <b>pg_trgm</b> compares strings by their 3-letter pieces instead — one typo costs a little similarity, not everything.', 'lam'))}
${S(`CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- ships with PostgreSQL (contrib)`, { max: 1.05 })}` },

  { t: 'What is a trigram?', giua: true, body: `
${trigramPic()}
${two(P(L('4', "SELECT show_trgm('cat')"), { w: 480 }), P(L('4', "SELECT show_trgm('Nguyen')", { q: "SELECT show_trgm('Nguyen') AS nguyen,\n       show_trgm('Nguyn')  AS nguyn;" }), { w: 600 }))}` },

  { t: 'similarity, the % operator, and distance', body: `
${P(J(L('4', "SELECT similarity('PostgreSQL', 'PostgresSQL')", { q: "SELECT similarity('PostgreSQL', 'PostgresSQL') AS gan_giong,\n       similarity('PostgreSQL', 'MySQL')       AS khac_han;" }), L('4', 'SELECT show_limit()'), L('4', "SELECT 'PostgreSQL' % 'PostgresSQL'"), L('4', "SELECT 'PostgreSQL' <-> 'PostgresSQL'")), { max: 0.66, hm: ['0.7692308', ' t   | f', '0.23076922'] })}
${cards([['similarity(a, b)', 'shared trigrams ÷ all distinct trigrams: 0 = nothing in common, 1 = identical. A typo still scores <b>0.77</b>; MySQL scores 0.13.'], ['a % b', 'true when similarity ≥ <code class="i">pg_trgm.similarity_threshold</code> (default <b>0.3</b>). This form can use an index.'], ['a &lt;-&gt; b', 'distance = 1 − similarity. <code class="i">ORDER BY a &lt;-&gt; b</code> = closest first (GiST can do it fast).']], 3)}` },

  { t: 'similarity vs word_similarity', body: `
${P(L('4', "SELECT similarity('index', 'PostgreSQL indexing basics')", { q: "SELECT similarity('index', 'PostgreSQL indexing basics')             AS similarity,\n       word_similarity('index', 'PostgreSQL indexing basics')        AS word_similarity,\n       strict_word_similarity('index', 'PostgreSQL indexing basics') AS strict_word;" }), { max: 1.05, hm: ['0.17857143'] })}
${cards([['similarity: 0.18', 'compares the <b>whole</b> strings — a short query against a long title is always “different”.'], ['word_similarity: 0.83', 'best match of the query inside <b>any part</b> of the text. The right tool for “search box against long titles”. Operator: <code class="i">&lt;%</code>.'], ['strict_word_similarity: 0.5', 'same, but the part must align with <b>whole words</b> (“index” vs “indexing”).']], 3)}
${p('CuongThai’s duplicate-issue finder in CT Work uses <code class="i">GREATEST(similarity(…), word_similarity(…))</code> for exactly this reason: a short new title fits inside a long old one.', 19)}` },

  { t: 'Fuzzy search in a table', body: `
${P(L('4', "SELECT title, round(similarity(title, 'postgres indexs')", { q: "SELECT title, round(similarity(title, 'postgres indexs')::numeric, 3) AS diem\nFROM article WHERE id <= 3 ORDER BY diem DESC LIMIT 3;" }), { max: 1.05, hm: ['0.433'] })}
${P(L('4', "SELECT full_name, count(*) AS so_khach, round(max(similarity(full_name, 'Nguyen Minh Phuc'))", { q: "SELECT full_name, count(*) AS so_khach,\n       round(max(similarity(full_name, 'Nguyen Minh Phuc'))::numeric, 3) AS diem\nFROM kh GROUP BY full_name ORDER BY diem DESC, full_name LIMIT 3;", db: 'pgcourse' }), { max: 1.0, hm: ['Nguyễn Minh Phúc |'] })}
${p('“postgres indexs” — not one word spelled right — still ranks the right article first: the engine behind “did you mean…?” and autocomplete. On CT Shop customers (kh = a copy of shop.customer) the accents cost points: <b>0.478</b>. We fix that with unaccent later.', 19)}` },

  { t: "ILIKE '%…%': the query a B-tree cannot help", body: `
${P(L('4', "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12345%'", { cat: [2, 8] }), { max: 0.85, hm: ['Seq Scan', 'Execution'] })}
${P(J(L('4', 'CREATE INDEX article_title_btree'), L('4', "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12345%'", { lan: 1, cat: [2, 9] }), L('4', "EXPLAIN SELECT count(*) FROM article WHERE title LIKE 'Note 12345%'", { cat: [2, 5] })), { max: 0.8, hm: ['Index Only Scan', 'Filter', 'Execution'] })}
${p('A B-tree is sorted from the <b>first</b> character; “12345” can be anywhere, so there is no place to start: the planner reads the <b>whole</b> index (79 ms, slower than the Seq Scan). Even a prefix <code class="i">LIKE \'Note 12345%\'</code> is only a Filter here — the en_US collation needs <code class="i">text_pattern_ops</code> (9.1).', 18)}` },

  { t: 'GIN trigram index: 77 ms → 0.075 ms', body: `
${P(J(L('4', 'CREATE INDEX article_title_trgm ON article USING GIN (title gin_trgm_ops)'), L('4', "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12345%'", { lan: 2, cat: [2, 10] })), { max: 0.82, hm: ['Time:', 'Bitmap Index Scan', 'Execution'] })}
${barsPages({ rows: [['Seq Scan', 77.1, '#c0392b', '200,003 titles tested'], ['GIN trgm', 0.075, '#7a5a9a', '12 rows, 3 heap pages']], max: 80, w: 1110, lw: 200, unit: 'ms', fs: 21 })}
${two(P(L('4', "SELECT show_trgm('12345')"), { w: 480 }), p('“%12345%” still <b>contains</b> the trigrams 123, 234, 345: GIN intersects their row lists and rechecks. Works for <code class="i">LIKE</code>, <code class="i">ILIKE</code> and regex <code class="i">~</code> too.', 19), 'r46')}` },

  { t: 'Regular expressions — and patterns that are too short', body: `
${P(L('4', "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ~ '1234[0-9]$'", { cat: [2, 11] }), { max: 0.8, hm: ['Bitmap Index Scan', 'Rows Removed by Index Recheck', 'Execution'] })}
${P(L('4', "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12%'", { cat: [2, 8] }), { max: 0.8, hm: ['Seq Scan', 'Execution'] })}
${two(box('Regex: yes', 'pg_trgm extracts the trigrams any match must contain (123, 234), the index returns 120 candidates, recheck keeps 20 — 0.3 ms.', 'xanh'),
box('Two characters: no', '“12” has no full trigram of its own and matches 17,641 rows anyway: the planner rightly chooses a Seq Scan. Require at least 3 characters in a search box.', 'do2'))}` },

  { t: 'Trap: similarity() in WHERE never uses the index', body: `
${P(J(L('4', 'EXPLAIN ANALYZE SELECT title FROM article WHERE similarity(title', { cat: [2, 7] }), L('4', "EXPLAIN ANALYZE SELECT title FROM article WHERE title % 'Note 12345'", { cat: [2, 10] }), L('4', 'SET pg_trgm.similarity_threshold = 0.6'), L('4', "EXPLAIN ANALYZE SELECT title FROM article WHERE title % 'Note 12345'", { lan: 1, cat: [2, 10] })), { max: 0.72, hm: ['Seq Scan', 'Execution', 'rows=121594', 'rows=153'] })}
${p('<code class="i">similarity(title, …) &gt; 0.6</code> is a plain function call: Seq Scan, 379 ms. The operator <code class="i">%</code> uses the index — but with the default threshold 0.3, every “Note …” title shares enough trigrams: 121,594 rows, 413 ms. Raise the threshold (0.6 ⇒ 153 rows, 32 ms) and design the score for your data.', 18)}` },

  { t: 'GiST trigram: “the 3 closest” with ORDER BY <->', body: `
${P(J(L('4', 'CREATE INDEX article_title_gist ON article USING GIST (title gist_trgm_ops)'), L('4', "EXPLAIN ANALYZE SELECT title FROM article ORDER BY title <-> 'Note 12345' LIMIT 3", { cat: [2, 7] })), { max: 0.85, hm: ['Index Scan using article_title_gist', 'Order By', 'Execution'] })}
${P(J('-- same query, GiST dropped (BEGIN … ROLLBACK):', L('4', "EXPLAIN ANALYZE SELECT title FROM article ORDER BY title <-> 'Note 12345' LIMIT 3", { lan: 1, cat: [2, 9] })), { max: 0.85, hm: ['Seq Scan', 'Sort', 'Execution'] })}
${p('GiST can return rows <b>already ordered by distance</b> (KNN, k-nearest neighbours): 21.7 ms for the 3 closest titles instead of computing the distance for all 200,003 rows and sorting (418 ms). GIN cannot do this ordering.', 19)}` },

  { t: 'GIN or GiST for trigrams?', body: `
${two(P(L('4', 'SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc FROM pg_stat_user_indexes WHERE', { q: "SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc\nFROM pg_stat_user_indexes WHERE relname = 'article' ORDER BY indexrelname;" }), { w: 560, hm: ['article_title_gist', 'article_title_trgm'] }),
P(L('4', 'SELECT title, round((title <->', { q: "SELECT title, round((title <-> 'Note 12345')::numeric, 3) AS khoang_cach\nFROM article ORDER BY title <-> 'Note 12345' LIMIT 3;" }), { w: 520 }))}
<table class="t" style="font-size:20px"><tr><th></th><th>GIN gin_trgm_ops</th><th>GiST gist_trgm_ops</th></tr>
<tr><td>LIKE / ILIKE / ~ / %</td><td><b>fast</b> (0.075 ms)</td><td>works, usually slower</td></tr>
<tr><td>ORDER BY &lt;-&gt; LIMIT k</td><td>no</td><td><b>yes</b> (KNN)</td></tr>
<tr><td>size / build (titles)</td><td><b>4.5 MB</b> / 0.42 s</td><td>15 MB / 2.4 s</td></tr>
<tr><td>pick it for</td><td>search boxes, filters</td><td>“closest matches”, autocomplete ranking</td></tr></table>` },

  { t: 'Vietnamese: unaccent cannot go into an index', body: `
${P(J(L('4', "SELECT provolatile FROM pg_proc WHERE oid = 'unaccent(text)'"), L('4', 'CREATE INDEX sp_name_unaccent ON sp USING GIN (unaccent(name) gin_trgm_ops)')), { max: 1.05, hm: [' s', 'ERROR'] })}
${cards([['Why STABLE?', 'unaccent(text) looks up its rules in a <b>dictionary</b> found through search_path and editable at any time — the result could change, so PostgreSQL marks it STABLE (12.1).'], ['Why it matters', 'An index stores computed values forever. If the function could return something else tomorrow, the index would be silently wrong — so indexes and generated columns require IMMUTABLE.'], ['The fix', 'A small wrapper that names the dictionary <b>explicitly</b> (schema-qualified) and that <b>you</b> declare IMMUTABLE — a promise you take responsibility for.']], 3)}` },

  { t: 'The IMMUTABLE wrapper: f_unaccent', body: `
${S(`CREATE FUNCTION f_unaccent(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  RETURN ch13.unaccent('ch13.unaccent'::regdictionary, $1);   -- dictionary named explicitly`, { max: 1.0 })}
${P(J(L('4', "SELECT f_unaccent('Bút bi Thiên Long')"), L('4', 'CREATE INDEX sp_name_trgm ON sp USING GIN (lower(f_unaccent(name)) gin_trgm_ops)', { q: "CREATE INDEX sp_name_trgm ON sp\n  USING GIN (lower(f_unaccent(name)) gin_trgm_ops);" }), L('4', "SELECT id, name FROM sp WHERE lower(f_unaccent(name)) LIKE '%' ||", { q: "SELECT id, name FROM sp\n WHERE lower(f_unaccent(name)) LIKE '%' || lower(f_unaccent('but bi')) || '%'\n ORDER BY id;" })), { max: 0.9, hm: ['But bi Thien Long', 'CREATE INDEX'] })}
${p('Index and query use the <b>same expression</b> <code class="i">lower(f_unaccent(name))</code>; the search text goes through f_unaccent too. “but bi” finds all four ballpoint pens. (Use your own schema name — on CuongThai it would be <code class="i">public</code>.)', 18)}` },

  { t: 'On 200,000 names: wrapper vs unaccent()', body: `
${P(J(L('4', "EXPLAIN ANALYZE SELECT count(*) FROM sp_lon WHERE lower(f_unaccent(name))", { q: "EXPLAIN ANALYZE SELECT count(*) FROM sp_lon\n WHERE lower(f_unaccent(name)) LIKE '%thien long tl-027%';" }), L('4', 'EXPLAIN ANALYZE SELECT count(*) FROM sp_lon WHERE lower(unaccent(name))', { q: "EXPLAIN ANALYZE SELECT count(*) FROM sp_lon\n WHERE lower(unaccent(name)) LIKE '%thien long tl-027%';" })), { max: 0.88, hm: ['Bitmap Index Scan on sp_lon_trgm', 'Seq Scan', 'Execution'] })}
${barsPages({ rows: [['unaccent()', 336, '#c0392b', 'Seq Scan: unaccent on 200,000 names'], ['f_unaccent', 15.6, '#2f7d4f', 'Bitmap Index Scan on sp_lon_trgm']], max: 340, w: 1110, lw: 200, unit: 'ms', fs: 20 })}
${p('<code class="i">sp_lon</code> = 200,000 CT Shop names (“… — lô N”). Writing <code class="i">unaccent()</code> in the query does not match the indexed expression ⇒ Seq Scan. 4,166 rows match either way.', 18)}` },

  { t: 'Typos in Vietnamese, without accents', body: `
${P(L('4', "SELECT name, round(word_similarity('thien lomg'", { q: "SELECT name, round(word_similarity('thien lomg', lower(f_unaccent(name)))::numeric, 3) AS diem\nFROM sp ORDER BY diem DESC, id LIMIT 4;" }), { max: 1.0, hm: ['0.727'] })}
${P(L('4', "SELECT full_name, count(*) AS so_khach, round(max(similarity(lower(f_unaccent(full_name))", { q: "SELECT full_name, count(*) AS so_khach,\n       round(max(similarity(lower(f_unaccent(full_name)), 'nguyen minh phuk'))::numeric, 3) AS diem\nFROM kh GROUP BY full_name ORDER BY diem DESC, full_name LIMIT 3;" }), { max: 1.0, hm: ['0.789'] })}
${p('“thien lomg” (typo, no accents) finds every Thiên Long product (0.727). “nguyen minh phuk” → Nguyễn Minh Phúc with <b>0.789</b> — up from 0.478 when the accents were left in. Fold both sides, then compare.', 19)}` },

  { t: 'CuongThai’s way: translate() in a generated column', body: `
${S(`-- CuongThai migration (CT Work): fold accents into a GENERATED column — no extension needed
ALTER TABLE "work_issues" ADD COLUMN "title_fold" TEXT GENERATED ALWAYS AS
  (lower(translate(coalesce("title", ''), 'àÀáÁảẢ…đĐ', 'aaaaaa…dd'))) STORED;`, { max: 0.95 })}
${P(J(L('4', 'SELECT id, name, name_fold FROM sp WHERE id IN'), L('4', 'ALTER TABLE sp ADD COLUMN name_fold2', { q: "ALTER TABLE sp ADD COLUMN name_fold2 text\n  GENERATED ALWAYS AS (lower(unaccent(name))) STORED;" })), { max: 0.95, hm: ['but bi thien long', 'ERROR'] })}
${p('<code class="i">translate()</code> is built in and IMMUTABLE, so a generated <code class="i">name_fold</code> works where <code class="i">unaccent()</code> is rejected. CuongThai keeps the same character table in JS (<code class="i">foldVi</code>) so app and database fold identically, then compares with <code class="i">similarity</code> + <code class="i">word_similarity</code> on <code class="i">title_fold</code>.', 18)}` },

  { t: 'Full-text first, trigram as the fallback', body: `
${S(`SELECT id, name, 'fts' AS cach FROM sp
 WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'compa staedler')      -- 1. exact words
UNION ALL
SELECT id, name, 'trigram' FROM (
  SELECT id, name FROM sp
   WHERE NOT EXISTS (SELECT 1 FROM sp
                      WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'compa staedler'))
   ORDER BY word_similarity('compa staedler', name_fold) DESC LIMIT 3     -- 2. only if 1 found nothing
) AS lui;`, { max: 0.95 })}
${P(L('4', "SELECT id, name, 'fts' AS cach", { chiOut: true }), { max: 1.05, hm: ['Compa Staedtler'] })}
${p('“staedler” is a typo for Staedtler: full-text finds <b>nothing</b>, so the trigram branch runs and puts the right compass first. A common production pattern: fast, ranked FTS for the normal case, trigram exactly when the user misspelled.', 19)}` },

  { t: 'Trap: a trigram index on long text', body: `
${S(`-- 20,000 documents of ~2,000 characters (words from a 60-word vocabulary)
CREATE INDEX longdoc_trgm ON longdoc USING GIN (body gin_trgm_ops);
CREATE INDEX longdoc_fts  ON longdoc USING GIN (to_tsvector('english', body));`, { max: 1.0 })}
${two(P(J(L('4', 'SELECT count(*) AS so_bai, avg(length(body))'), L('4', 'CREATE INDEX longdoc_trgm', { chiOut: true }), L('4', 'CREATE INDEX longdoc_fts', { chiOut: true })), { w: 440 }),
P(L('4', 'SELECT relname AS ten, pg_size_pretty(pg_relation_size(oid)) AS kich_thuoc FROM pg_class\nWHERE relname IN (\'longdoc\'', { q: "SELECT relname AS ten, pg_size_pretty(pg_relation_size(oid)) AS kich_thuoc\nFROM pg_class WHERE relname IN ('longdoc', 'longdoc_trgm', 'longdoc_fts')\nORDER BY pg_relation_size(oid) DESC;" }), { w: 620, hm: ['longdoc_trgm', 'longdoc_fts'] }), 'r37')}
${p('A trigram index stores <b>every 3-character window</b> of every value: on long text it is about <b>as big as the table</b> (9.9 MB vs 10 MB here), 5× the full-text index, slower to build and to update — and still worse at word search. Match the tool to the column: trigram for short strings, tsvector for prose.', 18)}` },

  { t: 'Choosing between the three', giua: true, body: `
${chooseSearch()}
${p('They combine: FTS for the main search, trigram as the typo fallback and for names/codes, B-tree for exact lookups and prefixes. Do not reach for something fancier than the problem.', 21)}` },

  { t: 'When PostgreSQL is not enough: a search engine', body: `
${cards([['Stay in PostgreSQL when…', 'search is one feature among many; up to millions of rows; you want <b>one</b> system to deploy, back up, secure; results must match the data <b>transactionally</b> (just written ⇒ immediately searchable).'],
['Consider a search engine when…', 'search <b>is</b> the product; you need typo tolerance + synonyms + facets + relevance tuning together; real <b>Vietnamese word segmentation</b>; huge corpora; search traffic that must scale separately.'],
['Elasticsearch / OpenSearch', 'the heavyweight: analyzers per language (incl. Vietnamese plugins), aggregations, logs. Powerful, but a cluster to run.'],
['Meilisearch / Typesense', 'lightweight, typo-tolerant out of the box, instant search-as-you-type. Easy to start.'],
['The price', 'a second copy of the data that must be <b>kept in sync</b> (outbox / change data capture), can be stale, needs its own backup and monitoring.'],
['And meaning, not words?', 'semantic search with embeddings: the <b>pgvector</b> extension (Chapter 1 mentioned it) keeps that inside PostgreSQL too.']], 3)}` },

  { t: 'Exercise', to: true, giua: true, body: `
<ol>
<li>A customer types <code class="i">pentl</code> (typo). Find the 5 closest CT Shop products.</li>
<li>Show that <code class="i">lower(f_unaccent(name)) LIKE '%casio fx-5%'</code> on sp_lon uses the trigram index. How many rows?</li>
<li>Which tool for: (a) searching blog post bodies, (b) “contains” search on emails, (c) SKU codes that start with what was typed?</li>
</ol>
${box('Hint', '<code class="i">&lt;%</code> = word_similarity above threshold · same expression as the index · short strings vs prose vs prefix', 'lam')}` },

  { t: 'Solution', body: `
${P(L('4ex', "SELECT id, name, round(word_similarity('pentl'", { q: "SELECT id, name, round(word_similarity('pentl', name_fold)::numeric, 3) AS diem\nFROM sp WHERE 'pentl' <% name_fold ORDER BY diem DESC, id LIMIT 5;" }), { max: 1.0, hm: ['Pentel'] })}
${two(P(J(L('4ex', 'EXPLAIN SELECT count(*) FROM sp_lon', { q: "EXPLAIN SELECT count(*) FROM sp_lon\n WHERE lower(f_unaccent(name)) LIKE '%casio fx-5%';" }), L('4ex', "SELECT count(*) FROM sp_lon WHERE lower(f_unaccent(name)) LIKE '%casio fx-5%'", { lan: 1 })), { w: 640, hm: ['sp_lon_trgm', '8334'] }),
box('3 · Answers', '(a) blog bodies: <b>full-text search</b> (tsvector + GIN). (b) emails “contains”: <b>trigram</b> GIN. (c) SKU prefix: plain <b>B-tree</b> with <code class="i">text_pattern_ops</code>.', 'xanh'), 'r64')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why can a GIN trigram index serve <code class="i">ILIKE '%12345%'</code> when a B-tree cannot?</li>
<li><code class="i">WHERE similarity(name, $1) &gt; 0.4</code> is slow despite a trigram index. Rewrite it.</li>
<li>Why is <code class="i">CREATE INDEX … (unaccent(name))</code> rejected, and two ways around it?</li>
</ol>
${box('Answers', '1 · The pattern still contains trigrams (123, 234, 345) that the index knows; a B-tree needs a known prefix. &nbsp;2 · <code class="i">SET pg_trgm.similarity_threshold = 0.4</code> and <code class="i">WHERE name % $1</code> (or <code class="i">ORDER BY name &lt;-&gt; $1 LIMIT k</code> with GiST). &nbsp;3 · unaccent is STABLE; wrap it in an IMMUTABLE function naming the dictionary, or fold with translate() in a generated column.', 'xanh')}` },

  { t: 'Summary of Chapter 13 & next', to: true, body: `
<ul>
<li><b>13.1</b> jsonb, not json; <code class="i">-&gt;</code>/<code class="i">-&gt;&gt;</code>, edit, SQL/JSON path, JSON_TABLE; filter often ⇒ a column</li>
<li><b>13.2</b> GIN = inverted index for <code class="i">@&gt;</code> <code class="i">?</code>; path_ops smaller; ranges ⇒ expression B-tree</li>
<li><b>13.3</b> FTS: tsvector + tsquery + GIN, weights, ranking; Vietnamese = simple + unaccent</li>
<li><b>13.4</b> Trigram: typos, <code class="i">ILIKE '%…%'</code> in 0.075 ms, IMMUTABLE wrapper; FTS first, trigram fallback</li>
</ul>
${box('Next — Lab 7, then Chapter 14', '<b>Lab 7</b>: CT Shop product attributes in JSONB + GIN, accent-insensitive search with FTS and trigram. <b>Chapter 14</b>: connections, pooling with PgBouncer, VACUUM and bloat, monitoring.', 'lam')}` },
]);
