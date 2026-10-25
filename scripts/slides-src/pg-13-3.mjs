/**
 * pg-13-3 — PostgreSQL · Chapter 13 · Lesson 13.3 "Full-text search: tsvector, tsquery and ranking" (slide EN, kiểu FU, 26/10/2026, agent c13).
 * Nguồn: content/courses/postgresql/s13-jsonb-fts.mjs › postgresql-13-3-full-text-search. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-13-3.sql/.out.txt, bài tập pg-13-3ex) — đọc qua pg-13-out.mjs. SQL trên slide chỉ khác bản chạy ở chỗ xuống dòng.
 * Bổ sung so với bài web: LIKE so với FTS trên 3 câu thật, ts_debug (token → từ điển → lexeme), email/URL là loại token riêng, toán tử
 * & | ! <-> <N> :* chạy thật, to_tsquery ném lỗi với chữ người dùng ⇒ plainto/phraseto/websearch, ts_rank vs ts_rank_cd + mảng trọng số,
 * ts_headline, 200.000 bài: Seq 15,1 ms → GIN 0,057 ms, chỉ mục biểu thức phải khớp (0,052 ms vs 1.091 ms), to_tsvector một tham số là
 * STABLE (provolatile s) ⇒ cột GENERATED bị từ chối, tiếng Việt: english/simple giữ dấu, unaccent + cấu hình vi_unaccent tự dựng,
 * CT Shop tìm "but bi thien long" không dấu, giới hạn tách từ (sinh 31 = học sinh 15 + sinh viên 16, cụm "sinh hoc" 0), CuongThai projects.search_vector.
 */
import { lamDeck, two, box, cards } from './_pg-chung.mjs';
import { tsPipe, weightsPic, P, S, p, L } from './pg-13-hinh.mjs';
import { barsPages } from './pg-09-hinh.mjs';

export const deck = { key: 'pg-13-3', code: 'PG 13.3', title: 'Full-text search: tsvector, tsquery and ranking', sub: 'a search engine you already have' };

const J = (...xs) => xs.join('\n');

export const slides = lamDeck({ chuong: 'Chapter 13 — JSONB, GIN, full-text search & trigram', bai: '13.3' }, [
  { cover: true, t: 'Full-text search:<br>tsvector, tsquery, ranking', sub: 'stems, stop words, weights, highlighted snippets<br>a GIN index — and Vietnamese with unaccent' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <code class="i">LIKE '%…%'</code> is not search — and what PostgreSQL does instead: <b>lexemes</b></li>
<li><b>tsvector</b> (the document) and <b>tsquery</b> (the question), matched with <code class="i">@@</code></li>
<li>Safe queries from user input: <code class="i">websearch_to_tsquery</code></li>
<li>A generated column with <b>weights</b>, <b>ranking</b>, <b>highlighted snippets</b> — and a GIN index</li>
<li><b>Vietnamese</b>: no built-in dictionary ⇒ <code class="i">simple</code> + <code class="i">unaccent</code>, and its honest limits</li>
</ul>` },

  { t: 'Why LIKE is not search', body: `
${two(P(J(L('3', "SELECT id, body FROM note WHERE body ILIKE '%jumping%'"), L('3', "SELECT id, body FROM note WHERE body ILIKE '%jump%'")), { w: 540, hm: ['  2 |', '  3 |'] }),
P(L('3', "SELECT id, body FROM note WHERE to_tsvector('english', body)", { q: "SELECT id, body FROM note\n WHERE to_tsvector('english', body)\n    @@ to_tsquery('english', 'jumping');" }), { w: 540, hm: ['  1 |', '  2 |'] }))}
${cards([['LIKE matches letters', '“jumping” misses <b>jumped</b>; “jump” also catches <b>jumper</b> (a sweater). No ranking, and on a big table a full scan every time.'],
['Full-text matches words', 'Search “jumping”, find <b>jumped</b> and <b>jumping</b> — not jumper. Both sides are reduced to the same <b>lexeme</b> (“jump”) first.'],
['A librarian, not Ctrl+F', 'Ctrl+F finds characters. A librarian understands that “foxes” and “fox” are the same topic, ignores “the”, and puts the best book first.']], 3)}` },

  { t: 'to_tsvector: four steps from text to a searchable document', giua: true, body: `
${tsPipe()}
${p('1 split into <b>tokens</b> · 2 drop <b>stop words</b> (the, were, over carry no search value) · 3 reduce each word to its <b>lexeme</b> (foxes → fox, jumping → jump, lazy → lazi) · 4 keep the <b>positions</b> (for phrases and ranking). The result is a <b>tsvector</b>.', 20)}` },

  { t: 'tsvector and ts_debug: see every step', body: `
${P(L('3', "SELECT to_tsvector('english', 'The quick brown foxes were jumping over the lazy dogs')"), { hm: ["'brown':3"], max: 1.0 })}
${two(P(L('3', 'SELECT alias, token, dictionaries, lexemes FROM ts_debug', { q: "SELECT alias, token, dictionaries, lexemes\nFROM ts_debug('english',\n  'The quick brown foxes were jumping over the lazy dogs');" }).split('\n').filter((l) => !/^ blank /.test(l)).join('\n'), { w: 560, max: 0.86, hm: ['{fox}', '{jump}', '{lazi}', '| {}'] }),
box('Reading ts_debug', 'Each word is an <b>asciiword</b> token sent to the <b>english_stem</b> dictionary (Snowball stemmer). <code class="i">{}</code> = a stop word, dropped (The, were, over, the). <code class="i">lazi</code> is not a typo: lexemes are <b>search keys</b>, not words — the query “lazy” becomes lazi too. (Blank tokens are hidden here.)', 'lam'), 'r64')}` },

  { t: 'Stemming, and tokens that are not words', body: `
${P(L('3', "SELECT to_tsvector('english', 'jumping jumped jumps') AS english", { q: "SELECT to_tsvector('english', 'jumping jumped jumps') AS english,\n       to_tsvector('simple',  'jumping jumped jumps') AS simple;" }), { hm: ["'jump':1,2,3"], max: 1.1 })}
${P(L('3', "SELECT to_tsvector('english', 'Email me at an@cuongthai.com", { q: "SELECT to_tsvector('english',\n  'Email me at an@cuongthai.com about https://cuongthai.com/courses/postgresql in 2026');" }), { wrap: true, z: 0.95, hm: ["'an@cuongthai.com'"] })}
${two(box('english vs simple', '<b>english</b>: three forms → one lexeme <code class="i">jump</code> at positions 1, 2, 3. <b>simple</b>: just lowercased, every form kept — no stemming, no stop words.', 'lam'),
box('Token types', 'The parser recognises <b>emails</b>, <b>URLs</b>, hosts, paths and numbers and keeps them whole — an email is never “stemmed like a verb”.', ''))}` },

  { t: 'tsquery and @@: asking the question', body: `
${two(P(J(L('3', "SELECT to_tsquery('english', 'foxes & dogs')"), L('3', "SELECT to_tsvector('english', 'The quick brown foxes were jumping over the lazy dogs') @@", { q: "SELECT to_tsvector('english', 'The quick brown foxes were jumping over the lazy dogs')\n    @@ to_tsquery('english', 'fox & dog') AS khop;" })), { w: 660, max: 0.95, hm: ["'fox' & 'dog'", ' t'] }),
`<table class="t" style="font-size:18px"><tr><th>operator</th><th>meaning</th></tr>
<tr><td><code class="i">&amp;</code> · <code class="i">|</code> · <code class="i">!</code></td><td>and · or · not</td></tr>
<tr><td><code class="i">&lt;-&gt;</code></td><td>followed by (phrase)</td></tr><tr><td><code class="i">&lt;2&gt;</code></td><td>exactly 2 positions later</td></tr><tr><td><code class="i">jump:*</code></td><td>prefix</td></tr></table>`, 'r64')}
${P(J(L('3', "SELECT v @@ to_tsquery('english', 'fox & cat') AS va", { q: "SELECT v @@ to_tsquery('english', 'fox & cat') AS va,  v @@ to_tsquery('english', 'fox | cat') AS hoac,\n       v @@ to_tsquery('english', 'fox & !cat') AS khong, v @@ to_tsquery('english', 'quick <-> brown') AS ngay_sau,\n       v @@ to_tsquery('english', 'brown <-> quick') AS nguoc, v @@ to_tsquery('english', 'quick <2> fox') AS cach_2\nFROM (SELECT to_tsvector('english', 'The quick brown foxes were jumping over the lazy dogs') AS v) s;" }), L('3', "SELECT to_tsquery('english', 'jump:*')", { q: "SELECT to_tsquery('english', 'jump:*') AS tien_to,\n       to_tsvector('english', 'jumper') @@ to_tsquery('english', 'jump:*') AS khop_tien_to;" })), { max: 0.85 })}
` },

  { t: 'User input: use websearch_to_tsquery', body: `
${P(L('3', "SELECT to_tsquery('english', 'lazy dog')"), { hm: ['ERROR'], max: 0.9 })}
${P(J(L('3', "SELECT plainto_tsquery('english', 'lazy dog')", { q: "SELECT plainto_tsquery('english', 'lazy dog') AS plain,\n       phraseto_tsquery('english', 'lazy dog') AS phrase;" }), L('3', "SELECT websearch_to_tsquery('english', '\"brown fox\""), L('3', "SELECT websearch_to_tsquery('english', 'fox & (dog')")), { max: 0.8, hm: ["'brown' <-> 'fox'", "'fox' & 'dog'"] })}
${box('Which one', '<b>to_tsquery</b> expects operators — two plain words are a syntax error; for your own SQL only. <b>plainto / phraseto</b>: words AND-ed or as a phrase. <b>websearch_to_tsquery</b>: Google-style <code class="i">"phrase"</code>, <code class="i">or</code>, <code class="i">-exclude</code>, never errors — <b>use it for a search box</b>.', 'xanh')}` },

  { t: 'Store it once: a generated tsvector column with weights', body: `
${S(`CREATE TABLE article (
  id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  body  text NOT NULL,
  tsv tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', body),  'B')
  ) STORED
);`, { max: 1.0 })}
${P(L('3', 'SELECT id, title, tsv FROM article ORDER BY id'), { wrap: true, z: 0.82, hm: ["'index':2A,8B,13B", "'index':4A,13B"] })}
${p('PostgreSQL recomputes <code class="i">tsv</code> on every INSERT and UPDATE — no trigger, nothing for the app to remember. Article 1: <code class="i">\'index\':2A,8B,13B</code> = in the title (A) and twice in the body (B).', 19)}` },

  { t: 'Weights: telling PostgreSQL the title matters more', giua: true, body: `
${weightsPic()}
${p('Four labels, A to D. <code class="i">setweight</code> stamps every lexeme of a field with one label; <code class="i">||</code> concatenates the vectors (positions of the second one are shifted after the first). Ranking functions then count a hit in the <b>title</b> more than a hit in the <b>body</b>. CuongThai’s projects use A = title, B = description, C = body.', 21)}` },

  { t: 'Ranking with ts_rank and ts_rank_cd', body: `
${two(P(L('3', "SELECT id, title, round(ts_rank(tsv, to_tsquery('english', 'index'))", { q: "SELECT id, title,\n       round(ts_rank(tsv, to_tsquery('english', 'index'))::numeric, 4) AS hang\nFROM article WHERE tsv @@ to_tsquery('english', 'index')\nORDER BY hang DESC;" }), { w: 560, max: 0.95, hm: ['0.6957'] }),
P(L('3', 'SELECT id, title,\n       round(ts_rank(tsv, q)'), { w: 540, max: 0.95, hm: ['0.9772'] }))}
${P(L('3', "SELECT id, title, round(ts_rank('{0.1, 0.2, 0.4, 1.0}'", { q: "SELECT id, title,\n       round(ts_rank('{0.1, 0.2, 0.4, 1.0}', tsv, q)::numeric, 4) AS mac_dinh,\n       round(ts_rank('{0, 0, 0.4, 0.1}', tsv, q)::numeric, 4) AS chi_tieu_de_nhe\nFROM article, to_tsquery('english', 'index') AS q WHERE tsv @@ q ORDER BY id;" }), { max: 0.9 })}
${p('<code class="i">ts_rank</code> scores frequency × weight (A = 1.0, B = 0.4, C = 0.2, D = 0.1 by default — the array is <b>D, C, B, A</b>). <code class="i">ts_rank_cd</code> (“cover density”) also rewards query words that appear <b>close together</b>. Ranking reads every matching row, so filter with <code class="i">@@</code> first, then ORDER BY rank and LIMIT.', 18)}` },

  { t: 'ts_headline: show why it matched', giua: true, body: `
${P(L('3', "SELECT id, ts_headline('english', body", { q: "SELECT id, ts_headline('english', body, to_tsquery('english', 'index'),\n                       'StartSel=<b>, StopSel=</b>') AS trich\nFROM article WHERE tsv @@ to_tsquery('english', 'index') ORDER BY id;" }), { max: 1.05, hm: ['<b>index</b>'] })}
${cards([['Highlights matches', 'Wraps every word that matched — including other forms (indexes, indexing) — in your tags: <code class="i">StartSel</code> / <code class="i">StopSel</code>.'],
['Picks a fragment', '<code class="i">MaxWords</code>, <code class="i">MinWords</code>, <code class="i">MaxFragments</code> choose a snippet around the hits, like a search engine result.'],
['Run it last', 'It re-parses the original text, so call it only on the 10–20 rows you display — never on the whole table.']], 3)}` },

  { t: '200,000 articles, no index: Seq Scan', body: `
${S(`INSERT INTO article (title, body)
SELECT 'Note ' || i,
       'Note ' || i || ' covers ' || (ARRAY['joins','vacuum','backups','replication','locks',
          'triggers','views','json','window functions','cte'])[i % 10 + 1]
       || ' with examples from lesson ' || (i % 97) || '.'
       || CASE WHEN i % 20000 = 0 THEN ' It explains transaction id wraparound.' ELSE '' END
FROM generate_series(1, 200000) AS i;`, { max: 0.95 })}
${two(P(L('3', 'SELECT count(*) AS so_bai', { q: "SELECT count(*) AS so_bai,\n  pg_size_pretty(pg_table_size('article')) AS bang\nFROM article;" }), { w: 380 }), P(L('3', "EXPLAIN ANALYZE SELECT id, title FROM article WHERE tsv @@ to_tsquery('english', 'wraparound')"), { wrap: true, z: 0.8, hm: ['Seq Scan', 'Execution'] }), 'r37')}
${p('Ten articles mention “wraparound”. Without an index PostgreSQL tests the stored tsvector of all 200,003 rows: 15.1 ms.', 19)}` },

  { t: 'GIN on the tsvector: 15.1 ms → 0.057 ms', body: `
${P(J(L('3', 'CREATE INDEX article_tsv_gin ON article USING GIN (tsv)'), L('3', "EXPLAIN ANALYZE SELECT id, title FROM article WHERE tsv @@ to_tsquery('english', 'wraparound')", { lan: 1 })), { hm: ['Time:', 'Bitmap Index Scan', 'Execution'], max: 0.98 })}
${barsPages({ rows: [['Seq Scan', 15.1, '#c0392b', 'reads every tsvector'], ['GIN', 0.057, '#7a5a9a', 'Bitmap Index Scan on article_tsv_gin · 10 heap pages']], max: 16, w: 1110, lw: 200, unit: 'ms', fs: 21 })}
${p('Same inverted index as 13.2 — the entries are <b>lexemes</b> instead of JSON keys. Built in 0.65 s, <b>13 MB</b> on a 40 MB table. The step people forget: search works without it, just slowly enough to hurt only in production.', 19)}` },

  { t: 'An expression index must match the query exactly', body: `
${P(J(L('3', 'CREATE INDEX article_body_fts ON article USING GIN'), L('3', "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE to_tsvector('english', body)", { q: "EXPLAIN ANALYZE SELECT count(*) FROM article\n WHERE to_tsvector('english', body) @@ to_tsquery('english', 'wraparound');", cat: [2, 10] }), L('3', 'EXPLAIN ANALYZE SELECT count(*) FROM article WHERE to_tsvector(body)', { q: "EXPLAIN ANALYZE SELECT count(*) FROM article\n WHERE to_tsvector(body) @@ to_tsquery('english', 'wraparound');", cat: [2, 8] })), { hm: ['article_body_fts  (', 'Seq Scan', 'Execution'], max: 0.92 })}
${p('No stored column? Index the <b>expression</b> <code class="i">to_tsvector(\'english\', body)</code>: 0.052 ms. Drop the config name in the query and it is a different expression ⇒ Seq Scan that re-parses 200,000 bodies: <b>1,091 ms</b> — 20,000× slower. A stored column avoids the mismatch entirely.', 19)}` },

  { t: 'Trap: always name the text search configuration', body: `
${two(P(J(L('3', 'SHOW default_text_search_config'), L('3', "SELECT provolatile FROM pg_proc WHERE oid = 'to_tsvector(text)'", { q: "SELECT provolatile FROM pg_proc\n WHERE oid = 'to_tsvector(text)'::regprocedure;" }), L('3', "SELECT provolatile FROM pg_proc WHERE oid = 'to_tsvector(regconfig,text)'", { q: "SELECT provolatile FROM pg_proc\n WHERE oid = 'to_tsvector(regconfig,text)'::regprocedure;" })), { w: 540, max: 0.95, hm: [' s', ' i'] }),
`<div>${P(L('3', 'ALTER TABLE note ADD COLUMN tsv tsvector GENERATED ALWAYS AS (to_tsvector(body))', { q: "ALTER TABLE note ADD COLUMN tsv tsvector\n  GENERATED ALWAYS AS (to_tsvector(body)) STORED;" }), { w: 540, hm: ['ERROR'] })}
${box('Why', 'One-argument <code class="i">to_tsvector(text)</code> uses <code class="i">default_text_search_config</code> — a <b>server setting</b> (english here, maybe something else on the VPS). So it is only <b>STABLE</b> (s), and a generated column or index needs <b>IMMUTABLE</b> (i). Two arguments ⇒ immutable ⇒ allowed. Always write the config.', 'do2')}</div>`)}` },

  { t: 'Vietnamese: no built-in dictionary', body: `
${P(J(L('3', "SELECT to_tsvector('english', 'Bút bi Thiên Long"), L('3', "SELECT to_tsvector('simple', 'Bút bi Thiên Long, hộp"), L('3', "SELECT to_tsvector('simple', 'Bút bi Thiên Long') @@")), { max: 1.0, hm: ["'câi'"] })}
${cards([['english on Vietnamese', 'Nonsense stemming: <b>cây → câi</b> (the English stemmer treats a final y like “lazy”).'], ['simple is the honest choice', 'Vietnamese words are separate syllables that do not inflect — lowercasing is most of what you need.'], ['But accents', 'Users type <b>“but bi”</b> for “Bút bi”. With simple that is <b>false</b>: different lexemes.']], 3)}` },

  { t: 'unaccent: “but bi” finds “Bút bi”', body: `
${two(P(J(L('3', 'CREATE EXTENSION unaccent'), L('3', "SELECT unaccent('Bút bi Thiên Long", { q: "SELECT unaccent('Bút bi Thiên Long — Đặng Văn Linh, Hồ Chí Minh')\n       AS bo_dau;" })), { w: 560, max: 0.95, hm: ['But bi Thien Long'] }),
S(`CREATE TEXT SEARCH CONFIGURATION vi_unaccent
  (COPY = simple);
ALTER TEXT SEARCH CONFIGURATION vi_unaccent
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, simple;`, { w: 520 }))}
${P(J(L('3', "SELECT to_tsvector('vi_unaccent', 'Bút bi Thiên Long, hộp", { q: "SELECT to_tsvector('vi_unaccent',\n         'Bút bi Thiên Long, hộp 20 cây cho học sinh') AS vi_unaccent;" }), L('3', "SELECT to_tsvector('vi_unaccent', 'Bút bi Thiên Long') @@", { q: "SELECT to_tsvector('vi_unaccent', 'Bút bi Thiên Long')\n         @@ plainto_tsquery('vi_unaccent', 'but bi') AS go_khong_dau;" }), L('3', "SELECT to_tsvector('vi_unaccent', 'Đặng Văn Linh")), { max: 0.85, hm: ["'but':1", "'dang':1"] })}` },

  { t: 'CT Shop: product search without accents', body: `
${S(`ALTER TABLE sp ADD COLUMN tsv tsvector GENERATED ALWAYS AS (     -- sp = a copy of shop.product
  setweight(to_tsvector('vi_unaccent', name), 'A') ||
  setweight(to_tsvector('vi_unaccent', coalesce(attrs->>'brand', '')), 'B') ||
  setweight(to_tsvector('vi_unaccent', coalesce(attrs->'tags'->>0, '')), 'C')) STORED;`, { max: 0.95 })}
${P(L('3', 'SELECT id, name, tsv FROM sp WHERE id IN (1, 19)'), { wrap: true, z: 0.85, hm: ["'thien':3A,8B"] })}
${two(P(L('3', 'SELECT id, name, round(ts_rank(tsv, q)', { q: "SELECT id, name, round(ts_rank(tsv, q)::numeric, 3) AS hang\nFROM sp, websearch_to_tsquery('vi_unaccent', 'but bi thien long') AS q\nWHERE tsv @@ q ORDER BY hang DESC, id;" }), { w: 600, max: 0.9 }),
P(L('3', "SELECT id, name FROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'vo hong ha')", { q: "SELECT id, name FROM sp\n WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'vo hong ha')\n ORDER BY id;" }), { w: 480, max: 0.9 }))}` },

  { t: 'The honest limits for Vietnamese', body: `
${two(P(L('3', 'SELECT id, name, attrs', { q: "SELECT id, name, attrs->'tags'->>0 AS tag FROM sp\n WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'sinh')\n ORDER BY id LIMIT 6;" }), { w: 560, max: 0.85, hm: ['học sinh', 'sinh viên'] }),
P(J(L('3', 'SELECT count(*) FILTER', { q: "SELECT count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'sinh'))       AS sinh,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', '\"hoc sinh\"')) AS cum_hoc_sinh,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'sinh hoc'))   AS sinh_va_hoc,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', '\"sinh hoc\"')) AS cum_sinh_hoc,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', '\"sinh vien\"')) AS cum_sinh_vien\nFROM sp;" }), L('3', "SELECT to_tsvector('vi_unaccent', 'Cơ sở dữ liệu')", { q: "SELECT to_tsvector('vi_unaccent', 'Cơ sở dữ liệu')\n         @@ websearch_to_tsquery('vi_unaccent', 'co so du lieu') AS khop,\n       to_tsvector('vi_unaccent', 'Cơ sở dữ liệu')\n         @@ websearch_to_tsquery('vi_unaccent', 'csdl') AS viet_tat;" })), { w: 540, wrap: true, z: 0.72 }))}
${cards([['No word segmentation', '“học sinh” is two syllables; “sinh” alone matches 31 products = học sinh (15) + <b>sinh viên</b> (16).'], ['Order lost unless you quote', '<code class="i">sinh hoc</code> (AND) still finds 15 “học sinh”; the phrase <code class="i">"sinh hoc"</code> finds 0. Use phrases.'], ['No synonyms, abbreviations', '“csdl” never finds “cơ sở dữ liệu”. Typos? Trigram (13.4). Serious Vietnamese search: an engine with a Vietnamese tokenizer.']], 3)}` },

  { t: 'In practice: full-text search on CuongThai', body: `
${two(S(`-- migration 20260623120000_add_project_search_index
ALTER TABLE "projects" ADD COLUMN "search_vector" tsvector
 GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("description", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("body_mdx", '')), 'C')
 ) STORED;
CREATE INDEX "idx_projects_search_vector"
  ON "projects" USING GIN ("search_vector");

// prisma/schema.prisma — Prisma has no tsvector type
searchVector Unsupported("tsvector")? @map("search_vector")`, { w: 600 }),
S(`// src/routes/project.routes.ts (excerpt)
prisma.$queryRawUnsafe(\`
  SELECT p.id, p.slug, p.title,
    ts_rank(p.search_vector,
            websearch_to_tsquery('simple', $1)) AS rank,
    ts_headline('simple', …,
      websearch_to_tsquery('simple', $1),
      'StartSel=<mark>, StopSel=</mark>,
       MaxWords=25, MinWords=10, MaxFragments=2')
  FROM projects p
  WHERE p.is_published = true
    AND p.search_vector @@ websearch_to_tsquery('simple', $1)
  ORDER BY rank DESC\`, query)`, { lang: 'typescript', w: 500 }), 'r64')}
${p('Everything from this lesson, in production: <b>simple</b> config (Vietnamese + tech names), weights A/B/C, generated column, GIN, <b>websearch_to_tsquery</b> for the search box, a parameter <code class="i">$1</code> (no SQL injection), <code class="i">ts_headline</code> with &lt;mark&gt;. Code Lab, snippets and the interview bank use the same pattern.', 18)}` },

  { t: 'Exercise', to: true, giua: true, body: `
<ol>
<li>Articles about <b>fast</b> and <b>indexes</b>, but <b>not</b> about replicas — typed like a search box. Rank them.</li>
<li>CT Shop: a customer types <code class="i">thuoc thien long</code> (no accents). Show matching products with the matched words marked as <code class="i">[…]</code>.</li>
<li>Why would <code class="i">to_tsvector(name)</code> without a config be rejected in that generated column?</li>
</ol>
${box('Hint', '<code class="i">websearch_to_tsquery</code> with <code class="i">-</code> · <code class="i">ts_headline(\'vi_unaccent\', …, \'StartSel=[, StopSel=]\')</code> · provolatile', 'lam')}` },

  { t: 'Solution', body: `
${P(L('3ex', 'SELECT id, title, round(ts_rank(tsv, q)', { q: "SELECT id, title, round(ts_rank(tsv, q)::numeric, 4) AS hang\nFROM article, websearch_to_tsquery('english', 'fast indexes -replicas') AS q\nWHERE tsv @@ q ORDER BY hang DESC;" }), { max: 1.0 })}
${P(L('3ex', 'SELECT id, name, ts_headline', { q: "SELECT id, name,\n       ts_headline('vi_unaccent', name,\n                   websearch_to_tsquery('vi_unaccent', 'thuoc thien long'),\n                   'StartSel=[, StopSel=]') AS trich\nFROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'thuoc thien long') ORDER BY id;" }), { max: 0.95, hm: ['[Thước]', '[thước]'] })}
${p('3 · One-argument <code class="i">to_tsvector</code> depends on <code class="i">default_text_search_config</code>, so it is STABLE, not IMMUTABLE — generated columns need immutable expressions. Note that ts_headline marks the <b>accented</b> original words: matching happened on the unaccented lexemes.', 19)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why does a search for “jumping” find “jumped” but not “jumper”?</li>
<li>Which function do you use for text typed into a search box, and why not to_tsquery?</li>
<li>An index on <code class="i">to_tsvector('english', body)</code> exists, but the query is slow. What is the first thing to check?</li>
</ol>
${box('Answers', '1 · Both sides are stemmed: jumping/jumped → jump; jumper stays jumper. &nbsp;2 · websearch_to_tsquery — never errors, understands quotes/or/-; to_tsquery throws a syntax error on plain words. &nbsp;3 · That the query uses exactly <code class="i">to_tsvector(\'english\', body)</code> — config included (or use a stored column).', 'xanh')}` },

  { t: 'Summary & next', to: true, body: `
<ul>
<li>FTS matches <b>lexemes</b>: tokens → stop words out → stems → positions (<b>tsvector</b>)</li>
<li>Ask with a <b>tsquery</b> and <code class="i">@@</code>; user input ⇒ <b>websearch_to_tsquery</b></li>
<li>Store a <b>generated</b> tsvector with weights A–D, add <b>GIN</b>: 15.1 ms → 0.057 ms</li>
<li>Rank with <code class="i">ts_rank</code>, show <code class="i">ts_headline</code>; always <b>name the config</b></li>
<li>Vietnamese: <code class="i">simple</code> + <code class="i">unaccent</code>; quote phrases; typos ⇒ next lesson</li>
</ul>
${box('Next — 13.4: trigram search', 'pg_trgm: similarity for typos and partial names, an index that makes ILIKE \'%…%\' fast, unaccent + trigram for Vietnamese — and when to reach for Elasticsearch or Meilisearch.', 'lam')}` },
]);
