/** PostgreSQL · 13.3 — Full-text search: tsvector, tsquery, xếp hạng, cột sinh + GIN; tiếng Việt dùng cấu hình 'simple'. */
import { mod, pg, cs, q, kq, kqAn, sau, ma, CT_SHOP, LUOC_DO_CT_SHOP, PLAN_ALL, tn } from './_chung.mjs';
import { O_ARTICLE } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-13-3-full-text-search', '13.3 Full-text search: tsvector, tsquery and ranking', [
  pg({
    ...O_ARTICLE, t: 'Match words, not substrings: @@', k: 'EASY', p: 6, kn: ['tsvector @@ tsquery', 'stemming'], tag: ['fts'],
    en: '<p>A reader types <b>indexes</b>. Find every article about it in any form (index, indexes, indexing, indexed). Return <code>id, title</code> ordered by id, searching the stored <code>tsv</code> column.</p>',
    vi: '<p>Người đọc gõ <b>indexes</b>. Tìm mọi bài nói về nó ở bất kỳ dạng nào (index, indexes, indexing, indexed). Trả về <code>id, title</code> sắp theo id, tìm trên cột <code>tsv</code> đã lưu.</p>',
    yc: [['<code>WHERE tsv @@ to_tsquery(\'english\', \'indexes\')</code>.', '<code>WHERE tsv @@ to_tsquery(\'english\', \'indexes\')</code>.'], ['The english configuration reduces the query word to the same stem as the stored words.', 'Cấu hình english đưa từ trong câu tìm về cùng gốc với từ đã lưu.']],
    giai: `SELECT id, title
FROM article
WHERE tsv @@ to_tsquery('english', 'indexes')   -- the query is stemmed too: 'indexes' -> 'index'
ORDER BY id;`,
    kiem: [
      kq(['Articles 1 and 3', 'Bài 1 và 3'], T),
      kqAn(['A new article that only says "indexed"', 'Bài mới chỉ nói "indexed"'], "INSERT INTO article (title, body) VALUES ('Partial tricks', 'Only the hot rows are indexed.')", T),
      ma(['Uses @@', 'Dùng @@'], '@@'),
    ],
    sai: ["SELECT id, title FROM article WHERE title ILIKE '%index%' ORDER BY id", "SELECT id, title FROM article WHERE tsv @@ to_tsquery('simple', 'indexes') ORDER BY id"],
    gy: [['to_tsquery parses the search, @@ tests it against a tsvector.', 'to_tsquery phân tích chuỗi tìm, @@ thử nó với một tsvector.'], ['Both sides must use the same configuration (english).', 'Hai vế phải cùng cấu hình (english).']],
    lhg: [['ILIKE \'%index%\' on the title — misses articles that mention it only in the body.', 'ILIKE \'%index%\' trên tiêu đề — bỏ sót bài chỉ nhắc nó trong thân bài.'], ['The simple configuration for the query — no stemming, so the lexeme \'indexes\' never meets the stored \'index\'.', 'Cấu hình simple cho câu tìm — không đưa về gốc, nên từ vị \'indexes\' không bao giờ gặp \'index\' đã lưu.']],
    gt: ['<p>A tsvector is a sorted list of normalized lexemes with positions; a tsquery is a boolean expression of lexemes. Matching is word-based and language-aware, which LIKE can never be.</p>', '<p>tsvector là danh sách từ vị đã chuẩn hoá, đã sắp, kèm vị trí; tsquery là biểu thức boolean của các từ vị. Khớp theo từ và hiểu ngôn ngữ — điều LIKE không bao giờ làm được.</p>'],
    tn: [tn('tsvector / tsquery', 'tài liệu đã chuẩn hoá / câu tìm'), tn('stemming', 'đưa từ về gốc')],
  }),

  pg({
    ...O_ARTICLE, t: 'A search box: websearch_to_tsquery and ranking', k: 'MEDIUM', p: 8, kn: ['websearch_to_tsquery', 'ts_rank', 'weights A/B'], tag: ['fts', 'ranking'],
    en: '<p>The user types <code>explain plan -backup</code>. Return <code>id, title, rank</code> (ts_rank rounded to 4 decimals) of matching articles, best first (ties by id). Titles weigh more than bodies (weights A/B are already in tsv).</p>',
    vi: '<p>Người dùng gõ <code>explain plan -backup</code>. Trả về <code>id, title, rank</code> (ts_rank làm tròn 4 chữ số) của các bài khớp, tốt nhất trước (bằng nhau theo id). Tiêu đề nặng ký hơn thân bài (trọng số A/B đã có trong tsv).</p>',
    yc: [['<code>websearch_to_tsquery(\'english\', \'explain plan -backup\')</code> accepts what users type (quotes, OR, -).', '<code>websearch_to_tsquery(\'english\', \'explain plan -backup\')</code> nhận đúng thứ người dùng gõ (ngoặc kép, OR, -).'], ['<code>round(ts_rank(tsv, q)::numeric, 4)</code>.', '<code>round(ts_rank(tsv, q)::numeric, 4)</code>.']],
    giai: `SELECT id, title, round(ts_rank(tsv, q)::numeric, 4) AS rank
FROM article, websearch_to_tsquery('english', 'explain plan -backup') AS q
WHERE tsv @@ q
ORDER BY rank DESC, id;`,
    kiem: [
      kq(['Articles 3 and 5, ranked', 'Bài 3 và 5, đã xếp hạng'], T),
      kqAn(['A title match outranks a body match', 'Khớp ở tiêu đề xếp trên khớp ở thân bài'], "INSERT INTO article (title, body) VALUES ('Explain the plan', 'A short guide.'), ('Backup plan explained', 'Explain your backup plan.')", T),
      ma(['websearch_to_tsquery', 'websearch_to_tsquery'], 'websearch_to_tsquery'),
    ],
    sai: ["SELECT id, title, round(ts_rank(tsv, q)::numeric, 4) AS rank FROM article, plainto_tsquery('english', 'explain plan -backup') AS q WHERE tsv @@ q ORDER BY rank DESC, id", "SELECT id, title, round(ts_rank(tsv, q)::numeric, 4) AS rank FROM article, websearch_to_tsquery('english', 'explain plan -backup') AS q WHERE tsv @@ q ORDER BY id"],
    gy: [['websearch_to_tsquery never raises a syntax error on user input (to_tsquery does).', 'websearch_to_tsquery không bao giờ báo lỗi cú pháp với chuỗi người dùng nhập (to_tsquery thì có).'], ['ts_rank uses the weights: an A (title) hit counts more than a B (body) hit.', 'ts_rank dùng trọng số: khớp A (tiêu đề) nặng hơn khớp B (thân bài).']],
    lhg: [['plainto_tsquery treats "-backup" as a word to MATCH, not to exclude.', 'plainto_tsquery coi "-backup" là từ phải KHỚP, không phải loại trừ.'], ['Sorting by id — the most relevant article is not on top.', 'Sắp theo id — bài liên quan nhất không ở trên cùng.']],
    gt: ['<p>websearch_to_tsquery maps Google-like syntax to a tsquery: <code>explain &amp; plan &amp; !backup</code>. ts_rank scores frequency and position weighted by A/B/C/D, so title hits float to the top.</p>', '<p>websearch_to_tsquery dịch cú pháp kiểu Google sang tsquery: <code>explain &amp; plan &amp; !backup</code>. ts_rank chấm theo tần suất và vị trí có trọng số A/B/C/D, nên khớp ở tiêu đề nổi lên trên.</p>'],
    tn: [tn('websearch_to_tsquery', 'câu tìm kiểu ô tìm kiếm'), tn('ts_rank', 'điểm liên quan')],
  }),

  pg({
    csdl: `${CT_SHOP}\n${PLAN_ALL}`, tenCsdl: 'ctshop', ld: LUOC_DO_CT_SHOP,
    t: 'Search CT Shop product names (simple config + GIN)', k: 'HARD', p: 12, kn: ['generated tsvector column', "'simple' configuration for Vietnamese", 'GIN on tsvector'], tag: ['fts', 'gin', 'ctshop'],
    en: '<p>Add a stored generated column <code>search_tsv tsvector</code> to product built from <code>name</code> with the <code>simple</code> configuration (there is no Vietnamese stemmer), index it with GIN, then search the words <b>bút</b> and <b>thiên</b>: return <code>sku, name</code> ordered by sku.</p>',
    vi: '<p>Thêm cột sinh lưu sẵn <code>search_tsv tsvector</code> vào product, dựng từ <code>name</code> với cấu hình <code>simple</code> (không có bộ đưa-về-gốc tiếng Việt), đánh chỉ mục GIN, rồi tìm các từ <b>bút</b> và <b>thiên</b>: trả về <code>sku, name</code> sắp theo sku.</p>',
    yc: [['<code>ALTER TABLE product ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (to_tsvector(\'simple\', name)) STORED</code>.', '<code>ALTER TABLE product ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (to_tsvector(\'simple\', name)) STORED</code>.'], ['GIN index on search_tsv; query with <code>to_tsquery(\'simple\', \'bút &amp; thiên\')</code>.', 'Chỉ mục GIN trên search_tsv; truy vấn bằng <code>to_tsquery(\'simple\', \'bút &amp; thiên\')</code>.']],
    giai: `ALTER TABLE product
  ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (to_tsvector('simple', name)) STORED;
CREATE INDEX product_search_gin ON product USING GIN (search_tsv);

SELECT sku, name
FROM product
WHERE search_tsv @@ to_tsquery('simple', 'bút & thiên')     -- 'simple' lower-cases, keeps accents
ORDER BY sku;`,
    kiem: [
      kq(['Thiên Long pens and pencils', 'Bút và bút chì Thiên Long'], T),
      sau(['New products are searchable at once (generated column)', 'Sản phẩm mới tìm được ngay (cột sinh)'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT0703', 'Bút dạ quang Thiên Long HL-03', 7, 7000); SELECT sku FROM product WHERE search_tsv @@ to_tsquery('simple', 'bút & thiên') ORDER BY sku", T),
      sau(['The search can use the GIN index', 'Phép tìm dùng được chỉ mục GIN'], "SET LOCAL enable_seqscan = off; SELECT plan_nodes('SELECT sku FROM product WHERE search_tsv @@ to_tsquery(''simple'', ''bút'')') ~ 'Bitmap Index Scan' AS uses_gin", { an: true }),
    ],
    sai: ["ALTER TABLE product ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (to_tsvector('simple', name)) STORED; SELECT sku, name FROM product WHERE search_tsv @@ to_tsquery('simple', 'bút & thiên') ORDER BY sku;", "SELECT sku, name FROM product WHERE to_tsvector('simple', name) @@ to_tsquery('simple', 'bút & thiên') ORDER BY sku"],
    gy: [['A generated column keeps the tsvector in sync with name automatically.', 'Cột sinh tự giữ tsvector khớp với name.'], ['simple = lower-case + split on spaces/punctuation, no stemming, no stop words.', 'simple = viết thường + tách theo dấu cách/dấu câu, không đưa về gốc, không bỏ từ dừng.']],
    lhg: [['Computing to_tsvector in every query without an index — correct, but a full scan each time.', 'Tính to_tsvector trong mỗi truy vấn mà không có chỉ mục — đúng, nhưng quét toàn bảng mỗi lần.'], ['Adding the column but no GIN index — every search still reads the whole table.', 'Thêm cột mà quên chỉ mục GIN — mọi lần tìm vẫn đọc cả bảng.']],
    gt: ['<p>For Vietnamese, the simple configuration is the honest baseline (no stemmer exists in core). Accent-insensitive search needs an extra step — lesson 13.4 and Lab 7 add it.</p>', '<p>Với tiếng Việt, cấu hình simple là nền trung thực (lõi không có bộ đưa-về-gốc). Tìm không dấu cần thêm một bước — bài 13.4 và Lab 7 thêm vào.</p>'],
    tn: [tn('generated column', 'cột sinh'), tn("'simple' configuration", 'cấu hình tách từ đơn giản')],
  }),

  pg({
    ...O_ARTICLE, t: 'Show where it matched: ts_headline', k: 'MEDIUM', p: 6, kn: ['ts_headline', 'highlighting'], tag: ['fts'],
    en: '<p>The result page highlights the matching words. For articles matching <code>restore</code>, return <code>id, snippet</code> where snippet is <code>ts_headline(\'english\', body, q)</code> with the default options (matches wrapped in &lt;b&gt;…&lt;/b&gt;). Order by id.</p>',
    vi: '<p>Trang kết quả tô đậm các từ khớp. Với các bài khớp <code>restore</code>, trả về <code>id, snippet</code> với snippet là <code>ts_headline(\'english\', body, q)</code> theo tuỳ chọn mặc định (từ khớp được bọc &lt;b&gt;…&lt;/b&gt;). Sắp theo id.</p>',
    yc: [['<code>q = to_tsquery(\'english\', \'restore\')</code>.', '<code>q = to_tsquery(\'english\', \'restore\')</code>.'], ['Filter with tsv @@ q, highlight the body.', 'Lọc bằng tsv @@ q, tô sáng body.']],
    giai: `SELECT id, ts_headline('english', body, q) AS snippet      -- "restored" and "restore" both highlighted
FROM article, to_tsquery('english', 'restore') AS q
WHERE tsv @@ q
ORDER BY id;`,
    kiem: [
      kq(['Article 4 with both forms highlighted', 'Bài 4 với cả hai dạng được tô'], T),
      kqAn(['Another article mentions restoring', 'Một bài khác nhắc tới restoring'], "INSERT INTO article (title, body) VALUES ('Drills', 'Practise restoring a dump into an empty database.')", T),
      ma(['Uses ts_headline', 'Dùng ts_headline'], 'ts_headline\\s*\\('),
    ],
    sai: ["SELECT id, body AS snippet FROM article WHERE tsv @@ to_tsquery('english', 'restore') ORDER BY id"],
    gy: [['ts_headline(config, text, query) marks the lexemes of the query inside the text.', 'ts_headline(cấu hình, văn bản, câu tìm) đánh dấu các từ vị của câu tìm trong văn bản.'], ['Use it only on the rows you display — it re-parses the text.', 'Chỉ dùng trên các dòng hiển thị — nó phân tích lại văn bản.']],
    lhg: [['Highlighting with replace() — misses "restored" and breaks on case.', 'Tô đậm bằng replace() — bỏ sót "restored" và hỏng với chữ hoa.'], ['Calling ts_headline on every row before filtering — slow.', 'Gọi ts_headline trên mọi dòng trước khi lọc — chậm.']],
    gt: ['<p>ts_headline uses the same parser and stemmer as the search, so every form that matched is highlighted. It is expensive, so apply it after filtering and LIMIT.</p>', '<p>ts_headline dùng cùng bộ phân tích và đưa-về-gốc với phép tìm, nên mọi dạng đã khớp đều được tô. Nó tốn kém, nên áp sau khi lọc và LIMIT.</p>'],
    tn: [tn('ts_headline', 'đoạn trích có tô sáng')],
  }),
]);
