/**
 * PostgreSQL · 13.4 — Tìm bằng trigram. Máy chấm trình duyệt KHÔNG có extension pg_trgm (PGlite chạy bản lõi, không nạp
 * extension) ⇒ khái niệm học bằng trắc nghiệm, pg_trgm thật chạy trên máy người học (tay), còn phần chấm được trong
 * trình duyệt là tìm KHÔNG DẤU bằng hàm IMMUTABLE tự viết (translate) + chỉ mục biểu thức — đúng nhu cầu của Lab 7.
 */
import { mod, pg, cs, q, tay, kq, kqAn, sau, ma, CT_SHOP, LUOC_DO_CT_SHOP, PLAN_ALL, pre, tn } from './_chung.mjs';
import { VN_CO_DAU, VN_KHONG_DAU } from './_du-lieu.mjs';

const TRGM = `CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- typo tolerance
SELECT similarity('PostgreSQL', 'PostgresSQL') AS close, similarity('PostgreSQL', 'MySQL') AS far;
SELECT title, round(similarity(title, 'postgres indexs')::numeric, 3) AS score
FROM article WHERE title % 'postgres indexs' ORDER BY score DESC;

-- ILIKE '%…%' that uses an index
CREATE INDEX article_title_trgm ON article USING GIN (title gin_trgm_ops);
EXPLAIN SELECT * FROM article WHERE title ILIKE '%index%';`;

export default mod('postgresql-13-4-trigram', '13.4 Trigram search: typos, partial names and ILIKE that flies', [
  cs({
    t: 'Trigrams in one page', k: 'EASY', p: 5, kn: ['trigram', 'similarity', 'gin_trgm_ops'], tag: ['trigram', 'search'],
    en: '<p>What pg_trgm does, and when to use it instead of full-text search.</p>', vi: '<p>pg_trgm làm gì, và khi nào dùng nó thay cho full-text search.</p>',
    cau: [
      q('q1', ['<code>show_trgm(\'cat\')</code> returns…', '<code>show_trgm(\'cat\')</code> trả về…'], ['{"  c"," ca","at ",cat} — padded 3-letter windows', '{c,a,t} — one entry per single letter', '{cat} — the whole word as one entry', '{ca,at} — every 2-letter window'], ['Words are padded with two spaces in front and one behind, then cut into every 3-character window.', 'Từ được đệm hai dấu cách phía trước và một phía sau, rồi cắt thành mọi cửa sổ 3 ký tự.']),
      q('q2', ['Which search needs pg_trgm rather than full-text search?', 'Kiểu tìm nào cần pg_trgm thay vì full-text search?'], ['a typo-tolerant search on product names ("casoi" → Casio)', 'articles containing the word "restore" in any form', 'documents with both "backup" and "WAL"', 'ranking long texts by relevance'], ['FTS matches whole words (stemmed); trigrams measure character overlap, so they survive typos and partial words.', 'FTS khớp nguyên từ (đã đưa về gốc); trigram đo độ trùng ký tự nên chịu được gõ sai và từ dở dang.']),
      q('q3', ['Why does <code>ILIKE \'%index%\'</code> become fast with a GIN gin_trgm_ops index?', 'Vì sao <code>ILIKE \'%index%\'</code> nhanh lên với chỉ mục GIN gin_trgm_ops?'], ['the pattern is cut into trigrams; rows holding all of them are rechecked', 'the index stores every possible substring of every value', 'the planner rewrites ILIKE into an equality on lower(title)', 'it does not — ILIKE with a leading % never uses any index'], ['B-trees cannot help a leading wildcard; a trigram index can, because every substring of length ≥ 3 is made of indexed trigrams.', 'B-tree không giúp được ký tự đại diện ở đầu; chỉ mục trigram thì được, vì mọi chuỗi con dài ≥ 3 đều ghép từ các trigram đã đánh chỉ mục.']),
    ],
    gy: [['Trigram = 3 consecutive characters.', 'Trigram = 3 ký tự liên tiếp.'], ['Similarity = shared trigrams / all trigrams.', 'Độ giống = trigram chung / tổng trigram.']],
    lhg: [['Using full-text search for "did you mean…" — FTS does not tolerate typos.', 'Dùng full-text search cho "có phải bạn muốn…" — FTS không chịu được gõ sai.'], ['Expecting a B-tree to speed up ILIKE \'%x%\'.', 'Mong B-tree tăng tốc ILIKE \'%x%\'.']],
    tn: [tn('trigram', 'bộ ba ký tự'), tn('similarity', 'độ giống')],
  }),

  tay({
    t: 'pg_trgm on your own PostgreSQL: typos and a fast ILIKE', k: 'MEDIUM', p: 15, kn: ['CREATE EXTENSION pg_trgm', '% similarity operator', 'gin_trgm_ops'], tag: ['trigram', 'extension'],
    en: `<p>Run lesson 13.4 on your PostgreSQL 17 (the article table of lesson 13.3):</p>${pre(TRGM)}`,
    vi: `<p>Chạy bài 13.4 trên PostgreSQL 17 của bạn (bảng article của bài 13.3):</p>${pre(TRGM)}`,
    yc: [['<code>similarity(\'PostgreSQL\', \'PostgresSQL\')</code> is high (about 0.7), MySQL low.', '<code>similarity(\'PostgreSQL\', \'PostgresSQL\')</code> cao (khoảng 0.7), MySQL thấp.'], ['The typo query finds "PostgreSQL indexing basics".', 'Truy vấn gõ sai vẫn tìm ra "PostgreSQL indexing basics".'], ['After the index, EXPLAIN of the ILIKE shows a Bitmap Index Scan on article_title_trgm (on a big enough table, or with enable_seqscan = off).', 'Sau khi có chỉ mục, EXPLAIN của ILIKE hiện Bitmap Index Scan trên article_title_trgm (với bảng đủ lớn, hoặc enable_seqscan = off).']],
    lenh: 'psql -h localhost -p 5444 -U postgres -d pgcourse -f trigram.sql',
    lyDo: ['pg_trgm is an extension; the browser grader runs core PostgreSQL only and cannot load extensions.', 'pg_trgm là một extension; máy chấm trình duyệt chỉ chạy PostgreSQL lõi và không nạp được extension.'],
    tep: { 'trigram.sql': TRGM + '\n' },
    giaiTep: { 'trigram.sql': `${TRGM}
-- Expected (PostgreSQL 17):
--  close  | far
--  0.70.. | 0.2..
-- "PostgreSQL indexing basics" comes first in the % query
-- with SET enable_seqscan = off:  Bitmap Heap Scan on article / Bitmap Index Scan on article_title_trgm
` },
    viDu: [{ input: ["SELECT similarity('PostgreSQL', 'PostgresSQL');", "SELECT similarity('PostgreSQL', 'PostgresSQL');"], output: ['≈ 0.7', '≈ 0.7'], explanation: ['Most trigrams are shared despite the extra s.', 'Phần lớn trigram vẫn chung dù thừa chữ s.'] }],
    gy: [['CREATE EXTENSION needs a superuser (or a trusted extension) — postgres in your container is fine.', 'CREATE EXTENSION cần superuser (hoặc extension tin cậy) — user postgres trong container là đủ.'], ['The % operator uses pg_trgm.similarity_threshold (0.3 by default).', 'Toán tử % dùng pg_trgm.similarity_threshold (mặc định 0.3).']],
    lhg: [['Creating the index on a 5-row table and expecting EXPLAIN to use it — the planner rightly prefers a seq scan.', 'Tạo chỉ mục trên bảng 5 dòng rồi mong EXPLAIN dùng nó — planner chọn seq scan là đúng.'], ['Forgetting gin_trgm_ops — a plain GIN on text is not allowed.', 'Quên gin_trgm_ops — GIN thường trên text không được phép.']],
    gt: ['<p>pg_trgm adds similarity functions/operators and index operator classes for GIN/GiST. Lab 7 combines it with an accent-stripping function for a Vietnamese search box.</p>', '<p>pg_trgm thêm hàm/toán tử độ giống và lớp toán tử chỉ mục cho GIN/GiST. Lab 7 kết hợp nó với hàm bỏ dấu cho ô tìm kiếm tiếng Việt.</p>'],
    tn: [tn('extension', 'phần mở rộng')],
  }),

  pg({
    csdl: `${CT_SHOP}\n${PLAN_ALL}`, tenCsdl: 'ctshop', ld: LUOC_DO_CT_SHOP,
    t: 'Accent-insensitive search without extensions', k: 'HARD', p: 15, kn: ['translate()', 'IMMUTABLE SQL function', 'expression index', 'LIKE prefix on the folded name'], tag: ['search', 'vietnamese', 'index', 'ctshop'],
    en: `<p>Customers type <b>without accents</b>: <code>but bi</code> must find <i>Bút bi …</i>. Write <code>khong_dau(s text) RETURNS text</code>, IMMUTABLE, = <code>translate(lower(s), from, to)</code> with the 67 accented letters → plain letters (given below), create an index on <code>khong_dau(name)</code>, then return <code>sku, name</code> of products whose folded name <b>starts with</b> <code>khong_dau('BUT BI')</code>, ordered by sku.</p>${pre(`from: ${VN_CO_DAU}\nto:   ${VN_KHONG_DAU}`)}`,
    vi: `<p>Khách gõ <b>không dấu</b>: <code>but bi</code> phải tìm ra <i>Bút bi …</i>. Viết <code>khong_dau(s text) RETURNS text</code>, IMMUTABLE, = <code>translate(lower(s), from, to)</code> với 67 chữ có dấu → chữ không dấu (cho dưới đây), tạo chỉ mục trên <code>khong_dau(name)</code>, rồi trả về <code>sku, name</code> của các sản phẩm có tên đã bỏ dấu <b>bắt đầu bằng</b> <code>khong_dau('BUT BI')</code>, sắp theo sku.</p>${pre(`from: ${VN_CO_DAU}\nto:   ${VN_KHONG_DAU}`)}`,
    yc: [['IMMUTABLE is required for an expression index (and true: translate/lower depend only on the argument).', 'IMMUTABLE là bắt buộc với chỉ mục biểu thức (và đúng: translate/lower chỉ phụ thuộc đối số).'], ['Index with <code>text_pattern_ops</code> so <code>LIKE \'prefix%\'</code> can use it: <code>CREATE INDEX … ON product (khong_dau(name) text_pattern_ops)</code>.', 'Đánh chỉ mục với <code>text_pattern_ops</code> để <code>LIKE \'tiền tố%\'</code> dùng được: <code>CREATE INDEX … ON product (khong_dau(name) text_pattern_ops)</code>.']],
    giai: `CREATE FUNCTION khong_dau(s text) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE
AS $$ SELECT translate(lower(s), '${VN_CO_DAU}', '${VN_KHONG_DAU}') $$;

CREATE INDEX product_name_khong_dau ON product (khong_dau(name) text_pattern_ops);

SELECT sku, name
FROM product
WHERE khong_dau(name) LIKE khong_dau('BUT BI') || '%'     -- 'but bi%': the same folding on both sides
ORDER BY sku;`,
    kiem: [
      kq(['The two Thiên Long ballpoint pens', 'Hai cây bút bi Thiên Long'], { thuTu: true }),
      sau(['khong_dau folds every accent', 'khong_dau bỏ mọi dấu'], "SELECT khong_dau('Bút chì Thiên Long ĐẸP Ữ') AS folded"),
      sau(['The prefix search can use the expression index', 'Phép tìm tiền tố dùng được chỉ mục biểu thức'], "SET LOCAL enable_seqscan = off; SELECT plan_nodes('SELECT sku FROM product WHERE khong_dau(name) LIKE ''but bi%''') ~ 'Index' AS uses_index"),
      kqAn(['A new pen typed with capitals and accents', 'Bút mới có chữ hoa và dấu'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT0503', 'BÚT BI Pentel BK77 0.7mm', 5, 12000), ('CT0599', 'Hộp đựng bút bi', 5, 30000)", { thuTu: true }),
    ],
    sai: [`CREATE FUNCTION khong_dau(s text) RETURNS text LANGUAGE sql IMMUTABLE AS $$ SELECT lower(s) $$; CREATE INDEX product_name_khong_dau ON product (khong_dau(name) text_pattern_ops); SELECT sku, name FROM product WHERE khong_dau(name) LIKE khong_dau('BUT BI') || '%' ORDER BY sku;`, `CREATE FUNCTION khong_dau(s text) RETURNS text LANGUAGE sql IMMUTABLE AS $$ SELECT translate(lower(s), '${VN_CO_DAU}', '${VN_KHONG_DAU}') $$; CREATE INDEX product_name_khong_dau ON product (khong_dau(name)); SELECT sku, name FROM product WHERE khong_dau(name) LIKE '%' || khong_dau('BUT BI') || '%' ORDER BY sku;`],
    gy: [['Apply the SAME function to the column and to the user input.', 'Áp CÙNG một hàm lên cột và lên chuỗi người dùng nhập.'], ['In a non-C collation, LIKE \'x%\' needs text_pattern_ops to use a B-tree.', 'Với collation không phải C, LIKE \'x%\' cần text_pattern_ops để dùng được B-tree.']],
    lhg: [['Folding only the case (lower) — "bút" still does not match "but".', 'Chỉ đổi chữ thường (lower) — "bút" vẫn không khớp "but".'], ['"%but bi%" (contains) — "Hộp đựng bút bi" matches too, and no B-tree can serve a leading %.', '"%but bi%" (chứa) — "Hộp đựng bút bi" cũng khớp, và không B-tree nào phục vụ được % ở đầu.']],
    gt: ['<p>Without the unaccent extension, translate() + lower() is a correct, IMMUTABLE accent folding for Vietnamese (NFC text). Indexing the folded expression makes "starts with" searches fast; Lab 7 extends this to full-text search and trigram similarity.</p>', '<p>Không có extension unaccent, translate() + lower() là cách bỏ dấu tiếng Việt đúng và IMMUTABLE (văn bản NFC). Đánh chỉ mục biểu thức đã bỏ dấu giúp tìm "bắt đầu bằng" nhanh; Lab 7 mở rộng sang full-text search và độ giống trigram.</p>'],
    tn: [tn('accent folding', 'bỏ dấu'), tn('text_pattern_ops', 'lớp toán tử cho LIKE tiền tố')],
  }),
]);
