/**
 * PostgreSQL · LAB 7 (sau Ch13) — CT Shop: thuộc tính JSONB + ô tìm kiếm tha thứ. 5 câu × 2 điểm theo J1/J2/J3/S2–S4 của
 * lab7-solution.sql, trên CT Shop mini + một spec_feed 16 tài liệu thu nhỏ (giữ đúng các bẫy của feed thật: pages/tip_mm/solar
 * là chuỗi, gsm = JSON null, khoá "colour", sku lạ CT1207, Moleskine không có specs).
 * Máy chấm KHÔNG có unaccent/pg_trgm (PGlite lõi) ⇒ phần tìm kiếm dùng khong_dau() tự viết (bài 13.4) + FTS 'simple';
 * phần trigram/KNN của S3 nằm ở bài 13.4 (chạy trên máy). Câu sau nạp bản CHUẨN của câu trước.
 */
import { doiDau, KHOA, deLonPg, CT_SHOP, PLAN_ALL, sau, chan, duoc, ma, kq, tn, TN } from './_chung.mjs';
import { KHONG_DAU_FN } from './_du-lieu.mjs';

const FEED = `CREATE TABLE spec_feed (line int PRIMARY KEY, doc jsonb NOT NULL);
INSERT INTO spec_feed (line, doc) VALUES
 (1,  '{"sku": "CT0501", "specs": {"ink": "dầu", "tip_mm": 0.7, "pack": 1, "desc": "Bút bi đầu 0.7mm, mực dầu"}}'),
 (2,  '{"sku": "CT0502", "specs": {"ink": "dầu", "tip_mm": 0.7, "pack": 20, "desc": "Hộp 20 cây"}}'),
 (3,  '{"sku": "CT0504", "specs": {"ink": "gel", "tip_mm": "0.5", "pack": 1, "desc": "Mực gel khô nhanh"}}'),
 (4,  '{"sku": "CT0601", "specs": {"hardness": "2B", "pack": 1, "exam_ok": true, "desc": "Bút chì thi trắc nghiệm"}}'),
 (5,  '{"sku": "CT0604", "specs": {"pack": 1, "desc": "Tẩy sạch, không để vết"}}'),
 (6,  '{"sku": "CT0702", "specs": {"ink": "nước", "tip_mm": 5, "colour": "vàng", "desc": "Đầu dẹt 2–5mm"}}'),
 (7,  '{"sku": "CT0801", "specs": {"pages": 48, "gsm": null, "desc": "Vở ô ly 4 ô"}}'),
 (8,  '{"sku": "CT0805", "specs": {"pages": "96 trang", "gsm": 70, "pack": 10, "desc": "Lốc 10 vở"}}'),
 (9,  '{"sku": "CT0901", "specs": {"pages": 100, "gsm": 80, "desc": "Gáy lò xo kép"}}'),
 (10, '{"sku": "CT1001", "specs": {"solar": true, "exam_ok": true, "desc": "Được mang vào phòng thi"}}'),
 (11, '{"sku": "CT1006", "specs": {"solar": "có", "exam_ok": false, "desc": "Máy tính văn phòng 12 số"}}'),
 (12, '{"sku": "CT1101", "specs": {"length_cm": 20, "desc": "Thước dẻo"}}'),
 (13, '{"sku": "CT1105", "specs": {"desc": "Compa có khoá"}}'),
 (14, '{"sku": "CT1201", "specs": {"pages": 320, "desc": "Giáo trình CSDL quan hệ"}}'),
 (15, '{"sku": "CT1204", "specs": {"pages": "160", "desc": "Tra cứu SQL nhanh"}}'),
 (16, '{"sku": "CT1207", "specs": {"pages": 200, "desc": "Giáo trình PostgreSQL"}}');`;

const Q1 = `SELECT k AS key,
       string_agg(DISTINCT jsonb_typeof(v), ', ' ORDER BY jsonb_typeof(v)) AS json_types,
       count(*) AS docs
FROM spec_feed, jsonb_each(doc->'specs') AS e(k, v)       -- jsonb_each keeps the JSON value (and its type)
GROUP BY k
HAVING count(DISTINCT jsonb_typeof(v)) > 1                -- JSON null counts as a type of its own
ORDER BY k;`;
const MERGE = `UPDATE product p
SET attrs = p.attrs || (f.doc->'specs')       -- parentheses: || and -> have the same precedence, left to right
FROM spec_feed f
WHERE f.doc->>'sku' = p.sku;`;
const REPAIR = `UPDATE product
SET attrs = jsonb_set(attrs, '{pages}', to_jsonb(substring(attrs->>'pages' FROM '[0-9]+')::int))
WHERE jsonb_typeof(attrs->'pages') = 'string';
UPDATE product
SET attrs = jsonb_set(attrs, '{tip_mm}', to_jsonb((attrs->>'tip_mm')::numeric))
WHERE jsonb_typeof(attrs->'tip_mm') = 'string';
UPDATE product
SET attrs = jsonb_set(attrs, '{solar}', to_jsonb(attrs->>'solar' IN ('có', 'yes', 'true')))
WHERE jsonb_typeof(attrs->'solar') = 'string';
UPDATE product SET attrs = jsonb_strip_nulls(attrs)          -- JSON null is not SQL NULL
WHERE attrs @> '{"gsm": null}';
UPDATE product SET attrs = (attrs - 'colour') || jsonb_build_object('color', attrs->'colour')
WHERE attrs ? 'colour';

ALTER TABLE product ADD CONSTRAINT product_attrs_object CHECK (attrs IS JSON OBJECT);
ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK (
      jsonb_typeof(attrs->'pages')   = 'number'  AND jsonb_typeof(attrs->'tip_mm')  = 'number'
  AND jsonb_typeof(attrs->'pack')    = 'number'  AND jsonb_typeof(attrs->'gsm')     = 'number'
  AND jsonb_typeof(attrs->'solar')   = 'boolean' AND jsonb_typeof(attrs->'exam_ok') = 'boolean'
  AND jsonb_typeof(attrs->'tags')    = 'array');   -- a missing key gives NULL, and NULL passes a CHECK`;
const FACET = `CREATE INDEX product_attrs_gin ON product USING GIN (attrs jsonb_path_ops);

SELECT sku, name, price
FROM product
WHERE category_id = 5
  AND attrs @> '{"ink": "dầu", "tip_mm": 0.7}'      -- numbers compare as numbers: 0.70 matches too
ORDER BY price, sku;`;
const SEARCH = `ALTER TABLE product ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (
     setweight(to_tsvector('simple', khong_dau(name)), 'A')
  || setweight(to_tsvector('simple', khong_dau(coalesce(attrs->>'brand', ''))), 'C')
) STORED;
CREATE INDEX product_search_gin ON product USING GIN (search_tsv);

CREATE FUNCTION search_products(q text)
RETURNS TABLE (sku text, name text)
LANGUAGE sql STABLE
AS $$
  SELECT p.sku, p.name
  FROM product p, plainto_tsquery('simple', khong_dau(q)) AS tq   -- fold the INPUT the same way
  WHERE p.search_tsv @@ tq
  ORDER BY ts_rank(p.search_tsv, tq) DESC, p.sku
$$;`;

const NEN2 = `${CT_SHOP}\n${FEED}`;
const NEN3 = `${NEN2}\n${MERGE}`;
// CLUSTER rewrites the table: the repair UPDATEs above left HOT chains, and an index built later in the SAME transaction
// (the grader runs everything in one) would get indcheckxmin = true and be invisible to the planner until commit.
const NEN4 = `${NEN3}\n${REPAIR}\nCLUSTER product USING product_pkey;   -- grader detail: fresh heap, so a new index is usable at once\n${PLAN_ALL}`;
const NEN5 = `${CT_SHOP}\n${KHONG_DAU_FN}`;
const XEM_SUA = "SELECT sku, attrs::text AS attrs FROM product WHERE sku IN ('CT0504', 'CT0702', 'CT0801', 'CT0805', 'CT1006', 'CT1204') ORDER BY sku";

export default doiDau({
  slug: 'postgresql-lab-7-jsonb-tim-kiem-ct-shop',
  ten: '13.5 Lab 7 — CT Shop: JSONB attributes and a search box that forgives',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-7-jsonb-tim-kiem-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 7 — CT Shop: a supplier feed in JSONB and a search box typed without accents', vi: 'Lab 7 — CT Shop: feed nhà cung cấp trong JSONB và ô tìm kiếm gõ không dấu' },
      doKho: 'HARD', phut: 100, diem: 100,
      khaiNiem: ['jsonb_each + jsonb_typeof survey', '|| vs -> precedence', 'jsonb_set / jsonb_strip_nulls repairs', 'CHECK on JSON types', 'GIN jsonb_path_ops facets', 'accent-folded full-text search'],
      tienQuyet: ['13.1–13.4 of this track'],
      the: ['postgresql', 'lab', 'jsonb', 'gin', 'fts', 'ctshop'],
      csdl: NEN2, tenCsdl: 'ctshop',
      thuMuc: 'RollNo_Name_PG_Lab7',
      phu: { en: 'PostgreSQL course · after Chapter 13 · Suggested time: 100 minutes · 10 marks (5 × 2)', vi: 'Khoá PostgreSQL · sau Chương 13 · Thời gian gợi ý: 100 phút · 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>The supplier sends product specs as JSON (<code>spec_feed</code>, 16 documents). You survey the feed, merge it into <code>product.attrs</code>, repair and guard the column, serve a filter panel from a GIN index, and build a search that finds <i>Bút bi</i> when the customer types <code>but bi</code>. Same steps as J1, J2, J3, S2 and S4 of the course lab, on the mini data. From Q3 on, the earlier steps are loaded in their reference version. <b>Note:</b> the browser grader has no extensions, so accent folding uses the <code>khong_dau()</code> function of lesson 13.4 instead of unaccent; the trigram part (S3) is the hands-on exercise of 13.4.</p>',
        vi: '<p>Nhà cung cấp gửi thông số sản phẩm dạng JSON (<code>spec_feed</code>, 16 tài liệu). Bạn khảo sát feed, gộp vào <code>product.attrs</code>, sửa và canh cột đó, phục vụ bảng lọc bằng chỉ mục GIN, và dựng ô tìm kiếm ra <i>Bút bi</i> khi khách gõ <code>but bi</code>. Cùng các bước J1, J2, J3, S2, S4 của lab trong khoá, trên dữ liệu mini. Từ Q3, các bước trước được nạp sẵn bản chuẩn. <b>Lưu ý:</b> máy chấm trình duyệt không có extension, nên bỏ dấu dùng hàm <code>khong_dau()</code> của bài 13.4 thay cho unaccent; phần trigram (S3) là bài làm trên máy của 13.4.</p>',
      },
      yeuCauChung: [
        { en: 'Exact object names (product_attrs_object, product_attrs_types, product_attrs_gin, search_tsv, search_products) — the checks use them.', vi: 'Đúng tên đối tượng (product_attrs_object, product_attrs_types, product_attrs_gin, search_tsv, search_products) — các kiểm dùng chúng.' },
        { en: 'Never compare JSON values as text when they are numbers or booleans: <code>-&gt;&gt;</code> hides the type.', vi: 'Đừng so giá trị JSON dạng chữ khi chúng là số hay boolean: <code>-&gt;&gt;</code> giấu mất kiểu.' },
      ],
      moHinh: [
        { ten: 'spec_feed', truong: [['line', 'int', 'PK'], ['doc', 'jsonb', '{"sku": …, "specs": {…}}']] },
        { ten: 'product', truong: [['sku', 'text', 'UNIQUE'], ['attrs', 'jsonb', 'brand, color, tags + the specs'], ['category_id', 'int', '5 = Bút bi']] },
      ],
      cau: [
        {
          ten: { en: 'J1 · keys that arrive with more than one JSON type', vi: 'J1 · khoá đến với hơn một kiểu JSON' }, diem: 2,
          moTa: { en: 'Survey the feed before importing it: return <code>key, json_types, docs</code> for every key of <code>doc-&gt;\'specs\'</code> that appears with more than one <code>jsonb_typeof</code>. json_types = the distinct types joined with <code>\', \'</code> in alphabetical order; docs = how many documents carry the key. Order by key.', vi: 'Khảo sát feed trước khi nhập: trả về <code>key, json_types, docs</code> cho mọi khoá của <code>doc-&gt;\'specs\'</code> xuất hiện với hơn một <code>jsonb_typeof</code>. json_types = các kiểu khác nhau nối bằng <code>\', \'</code> theo thứ tự chữ cái; docs = số tài liệu có khoá đó. Sắp theo key.' },
          yeuCau: [{ en: '<code>FROM spec_feed, jsonb_each(doc-&gt;\'specs\') AS e(k, v)</code> + GROUP BY k + HAVING.', vi: '<code>FROM spec_feed, jsonb_each(doc-&gt;\'specs\') AS e(k, v)</code> + GROUP BY k + HAVING.' }],
          giai: Q1,
          kiem: [
            kq(['J1 · the four troublesome keys', 'J1 · bốn khoá gây rắc rối'], { thuTu: true }),
            { ...kq(['J1 · a new document with "pack": "2"', 'J1 · tài liệu mới có "pack": "2"'], { thuTu: true, an: true }), themCsdl: `INSERT INTO spec_feed VALUES (17, '{"sku": "CT0503", "specs": {"pack": "2", "desc": "Vỉ 2 cây"}}')` },
            ma(['J1 · reads JSON types with jsonb_typeof', 'J1 · đọc kiểu JSON bằng jsonb_typeof'], 'jsonb_typeof\\s*\\('),
          ],
          saiMau: [
            "SELECT k AS key, string_agg(DISTINCT jsonb_typeof(v), ', ' ORDER BY jsonb_typeof(v)) AS json_types, count(*) AS docs FROM spec_feed, jsonb_each(doc->'specs') AS e(k, v) WHERE jsonb_typeof(v) <> 'null' GROUP BY k HAVING count(DISTINCT jsonb_typeof(v)) > 1 ORDER BY k",
            "SELECT k AS key, string_agg(DISTINCT jsonb_typeof(v), ', ' ORDER BY jsonb_typeof(v)) AS json_types, count(*) AS docs FROM spec_feed, jsonb_each(doc->'specs') AS e(k, v) GROUP BY k ORDER BY k",
          ],
        },
        {
          ten: { en: 'J2 · merge the specs into product.attrs', vi: 'J2 · gộp specs vào product.attrs' }, diem: 2,
          moTa: { en: 'One UPDATE: for every product whose sku is in the feed, add the keys of <code>doc-&gt;\'specs\'</code> to <code>attrs</code> while keeping brand, color and tags. Products without a feed document stay untouched; the unknown sku CT1207 is ignored.', vi: 'Một lệnh UPDATE: với mọi sản phẩm có sku trong feed, thêm các khoá của <code>doc-&gt;\'specs\'</code> vào <code>attrs</code> mà vẫn giữ brand, color và tags. Sản phẩm không có tài liệu trong feed giữ nguyên; sku lạ CT1207 bị bỏ qua.' },
          yeuCau: [{ en: '<code>UPDATE … FROM spec_feed</code>; mind the precedence of <code>||</code> and <code>-&gt;</code>.', vi: '<code>UPDATE … FROM spec_feed</code>; chú ý độ ưu tiên của <code>||</code> và <code>-&gt;</code>.' }],
          giai: MERGE,
          kiem: [
            sau(['J2 · a pen and a textbook after the merge', 'J2 · một cây bút và một giáo trình sau khi gộp'], "SELECT sku, attrs::text AS attrs FROM product WHERE sku IN ('CT0501', 'CT1201') ORDER BY sku", { thuTu: true }),
            sau(['J2 · how many products got specs, and nobody lost a brand', 'J2 · bao nhiêu sản phẩm có specs, và không ai mất brand'], "SELECT count(*) FILTER (WHERE attrs ? 'desc') AS with_specs, count(*) FILTER (WHERE attrs ? 'brand') AS with_brand, count(*) AS products FROM product"),
            sau(['J2 · the Moleskine (no specs) is untouched', 'J2 · Moleskine (không có specs) giữ nguyên'], "SELECT sku, attrs::text AS attrs FROM product WHERE sku = 'CT0906'", { an: true }),
          ],
          saiMau: [
            "UPDATE product p SET attrs = p.attrs || f.doc->'specs' FROM spec_feed f WHERE f.doc->>'sku' = p.sku",
            "UPDATE product p SET attrs = f.doc->'specs' FROM spec_feed f WHERE f.doc->>'sku' = p.sku",
          ],
        },
        {
          ten: { en: 'J2 · repair the dirty values, then guard the column', vi: 'J2 · sửa các giá trị bẩn rồi canh cột' }, diem: 2,
          moTa: { en: 'The merge is loaded. Repair with the smallest change: <code>pages</code> written as text ("96 trang", "160") → integer, <code>tip_mm</code> "0.5" → number, <code>solar</code> "có" → true, the JSON null <code>gsm</code> removed, the key <code>colour</code> renamed to <code>color</code>. Then add <code>product_attrs_object</code> (attrs is a JSON object) and <code>product_attrs_types</code> (pages, tip_mm, pack, gsm are numbers; solar, exam_ok booleans; tags an array — when present).', vi: 'Bước gộp đã nạp. Sửa với thay đổi nhỏ nhất: <code>pages</code> viết dạng chữ ("96 trang", "160") → số nguyên, <code>tip_mm</code> "0.5" → số, <code>solar</code> "có" → true, bỏ <code>gsm</code> là JSON null, đổi khoá <code>colour</code> thành <code>color</code>. Rồi thêm <code>product_attrs_object</code> (attrs là đối tượng JSON) và <code>product_attrs_types</code> (pages, tip_mm, pack, gsm là số; solar, exam_ok là boolean; tags là mảng — khi có mặt).' },
          yeuCau: [
            { en: '<code>jsonb_set(attrs, \'{pages}\', to_jsonb(…::int))</code> replaces one key and keeps the rest.', vi: '<code>jsonb_set(attrs, \'{pages}\', to_jsonb(…::int))</code> thay một khoá, giữ phần còn lại.' },
            { en: 'The CHECK uses <code>jsonb_typeof(attrs-&gt;\'pages\') = \'number\'</code> — a missing key gives NULL, which a CHECK accepts.', vi: 'CHECK dùng <code>jsonb_typeof(attrs-&gt;\'pages\') = \'number\'</code> — khoá vắng cho NULL, và CHECK chấp nhận NULL.' },
          ],
          giai: REPAIR,
          kiem: [
            { ...sau(['J2 · the six repaired documents', 'J2 · sáu tài liệu đã sửa'], XEM_SUA, { thuTu: true }), csdl: NEN3 },
            { ...chan(['J2 · "300 trang" is refused at the door', 'J2 · "300 trang" bị chặn ngay cửa'], "UPDATE product SET attrs = jsonb_set(attrs, '{pages}', '\"300 trang\"') WHERE sku = 'CT1201'", '23514'), csdl: NEN3 },
            { ...chan(['J2 · attrs must stay an object', 'J2 · attrs phải luôn là đối tượng'], "UPDATE product SET attrs = '[]' WHERE sku = 'CT0501'", '23514'), csdl: NEN3 },
            { ...chan(['J2 · a number written as text is refused', 'J2 · số viết dạng chữ bị chặn'], "UPDATE product SET attrs = jsonb_set(attrs, '{pages}', '\"300\"') WHERE sku = 'CT1201'", '23514'), csdl: NEN3, an: true },
            { ...chan(['J2 · a boolean written as text is refused', 'J2 · boolean viết dạng chữ bị chặn'], "UPDATE product SET attrs = jsonb_set(attrs, '{solar}', '\"true\"') WHERE sku = 'CT1001'", '23514'), csdl: NEN3, an: true },
            { ...duoc(['J2 · a correct change still works (tag "ôn thi")', 'J2 · thay đổi đúng vẫn chạy (gắn thẻ "ôn thi")'], "UPDATE product SET attrs = jsonb_set(attrs, '{tags}', (attrs->'tags') || '[\"ôn thi\"]') WHERE attrs @> '{\"exam_ok\": true}'"), csdl: NEN3 },
          ],
          saiMau: [
            REPAIR.replace(`UPDATE product SET attrs = (attrs - 'colour') || jsonb_build_object('color', attrs->'colour')
WHERE attrs ? 'colour';`, ''),
            REPAIR.replace(/ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK \([\s\S]*$/, "ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK (attrs->>'pages' IS NULL OR attrs->>'pages' ~ '^[0-9]+$');"),
            REPAIR.replace("to_jsonb(substring(attrs->>'pages' FROM '[0-9]+')::int)", "to_jsonb(substring(attrs->>'pages' FROM '[0-9]+'))").replace(/ALTER TABLE[\s\S]*$/, ''),
          ],
        },
        {
          ten: { en: 'J3 · a filter panel served by GIN', vi: 'J3 · bảng lọc phục vụ bằng GIN' }, diem: 2,
          moTa: { en: 'Attributes are clean (reference Q3 loaded). Create <code>product_attrs_gin</code> — a GIN index with <code>jsonb_path_ops</code> on attrs — and answer the category page <i>Bút bi</i> (category 5) with the filters <b>ink = dầu</b> and <b>tip 0.7 mm</b>: <code>sku, name, price</code> ordered by price, then sku.', vi: 'Thuộc tính đã sạch (nạp sẵn bản chuẩn Q3). Tạo <code>product_attrs_gin</code> — chỉ mục GIN với <code>jsonb_path_ops</code> trên attrs — và trả lời trang danh mục <i>Bút bi</i> (danh mục 5) với bộ lọc <b>ink = dầu</b> và <b>đầu 0.7 mm</b>: <code>sku, name, price</code> sắp theo giá, rồi sku.' },
          yeuCau: [{ en: 'Containment <code>attrs @&gt; \'{"ink": "dầu", "tip_mm": 0.7}\'</code> — the only operator jsonb_path_ops answers, and it compares numbers as numbers.', vi: 'Phép chứa <code>attrs @&gt; \'{"ink": "dầu", "tip_mm": 0.7}\'</code> — toán tử duy nhất jsonb_path_ops trả lời, và nó so số như số.' }],
          giai: FACET,
          kiem: [
            { ...kq(['J3 · the two oil-ink 0.7 mm pens', 'J3 · hai cây bút mực dầu 0.7 mm'], { thuTu: true }), csdl: NEN4 },
            { ...sau(['J3 · the filter can use the GIN index', 'J3 · bộ lọc dùng được chỉ mục GIN'], "SET LOCAL enable_seqscan = off; SELECT plan_nodes('SELECT sku FROM product WHERE attrs @> ''{\"ink\": \"dầu\"}''') ~ 'product_attrs_gin' AS uses_gin"), csdl: NEN4 },
            { ...sau(['J3 · the index is jsonb_path_ops', 'J3 · chỉ mục là jsonb_path_ops'], "SELECT indexdef ~ 'jsonb_path_ops' AS path_ops FROM pg_indexes WHERE indexname = 'product_attrs_gin'"), csdl: NEN4 },
            { ...kq(['J3 · a new pen stored as 0.70', 'J3 · bút mới lưu 0.70'], { thuTu: true, an: true }), csdl: NEN4, themCsdl: `INSERT INTO product (sku, name, category_id, price, stock, attrs) VALUES ('CT0505', 'Bút bi Bến Nghé B-01', 5, 4000, 90, '{"brand": "Bến Nghé", "ink": "dầu", "tip_mm": 0.70, "pack": 1, "tags": []}')` },
          ],
          saiMau: [
            "CREATE INDEX product_attrs_gin ON product USING GIN (attrs jsonb_path_ops); SELECT sku, name, price FROM product WHERE category_id = 5 AND attrs->>'ink' = 'dầu' AND attrs->>'tip_mm' = '0.7' ORDER BY price, sku;",
            "CREATE INDEX product_attrs_gin ON product USING GIN (attrs); SELECT sku, name, price FROM product WHERE category_id = 5 AND attrs @> '{\"ink\": \"dầu\", \"tip_mm\": 0.7}' ORDER BY price, sku;",
          ],
        },
        {
          ten: { en: 'S2 + S4 · search_products(q), typed without accents', vi: 'S2 + S4 · search_products(q), gõ không dấu' }, diem: 2,
          moTa: { en: '<code>khong_dau(text)</code> (IMMUTABLE, lesson 13.4) is loaded. Add the stored generated column <code>search_tsv</code> = name with weight A + <code>attrs-&gt;&gt;\'brand\'</code> with weight C, both folded by khong_dau and parsed with the <code>simple</code> configuration; index it with GIN (<code>product_search_gin</code>). Then write <code>search_products(q text) RETURNS TABLE (sku text, name text)</code>: all words of q must match (plainto_tsquery on the folded q), best rank first, ties by sku.', vi: '<code>khong_dau(text)</code> (IMMUTABLE, bài 13.4) đã nạp. Thêm cột sinh lưu sẵn <code>search_tsv</code> = name trọng số A + <code>attrs-&gt;&gt;\'brand\'</code> trọng số C, cả hai bỏ dấu bằng khong_dau và phân tích bằng cấu hình <code>simple</code>; đánh chỉ mục GIN (<code>product_search_gin</code>). Rồi viết <code>search_products(q text) RETURNS TABLE (sku text, name text)</code>: mọi từ của q phải khớp (plainto_tsquery trên q đã bỏ dấu), hạng cao trước, bằng nhau theo sku.' },
          yeuCau: [
            { en: 'Fold BOTH sides: the stored document and the user input.', vi: 'Bỏ dấu CẢ HAI phía: tài liệu lưu và chuỗi người dùng gõ.' },
            { en: 'A generated column may only call IMMUTABLE functions of its own row — khong_dau qualifies.', vi: 'Cột sinh chỉ được gọi hàm IMMUTABLE trên chính dòng của nó — khong_dau đạt điều đó.' },
          ],
          giai: SEARCH,
          kiem: [
            { ...sau(['S4 · "but bi"', 'S4 · "but bi"'], "SELECT * FROM search_products('but bi')", { thuTu: true }), csdl: NEN5 },
            { ...sau(['S4 · "SỔ TAY" (capitals, accents)', 'S4 · "SỔ TAY" (chữ hoa, có dấu)'], "SELECT * FROM search_products('SỔ TAY')", { thuTu: true }), csdl: NEN5 },
            { ...sau(['S4 · "ct books" — found through the brand only', 'S4 · "ct books" — chỉ tìm ra nhờ brand'], "SELECT * FROM search_products('ct books')", { thuTu: true }), csdl: NEN5 },
            { ...sau(['S2 · a name hit outranks a brand-only hit', 'S2 · khớp ở tên xếp trên khớp chỉ ở brand'], "INSERT INTO product (sku, name, category_id, price, attrs) VALUES ('CT0698', 'Gọt bút chì kim loại', 6, 15000, '{\"brand\": \"Thiên Long\"}'), ('CT0699', 'Thiên Long bút chì kim 0.5', 6, 12000, '{\"brand\": \"Pentel\"}'); SELECT * FROM search_products('thien long but chi')", { thuTu: true }), csdl: NEN5, an: true },
            { ...sau(['S2 · search_tsv is indexed with GIN', 'S2 · search_tsv có chỉ mục GIN'], "SELECT count(*) AS gin_on_search_tsv FROM pg_indexes WHERE tablename = 'product' AND indexdef ~* 'gin' AND indexdef ~ 'search_tsv'"), csdl: NEN5 },
          ],
          saiMau: [
            SEARCH.replace("plainto_tsquery('simple', khong_dau(q))", "plainto_tsquery('simple', q)"),
            SEARCH.replace(`
  || setweight(to_tsvector('simple', khong_dau(coalesce(attrs->>'brand', ''))), 'C')`, ''),
            SEARCH.replace("ORDER BY ts_rank(p.search_tsv, tq) DESC, p.sku", 'ORDER BY p.sku'),
          ],
        },
      ],
      truDiem: [
        { en: 'Filtering numbers or booleans through <code>-&gt;&gt;</code> text ("0.70" ≠ "0.7", \'48\' &gt; \'100\").', vi: 'Lọc số hay boolean qua chữ của <code>-&gt;&gt;</code> ("0.70" ≠ "0.7", \'48\' &gt; \'100\').' },
        { en: 'A CHECK that tests <code>attrs-&gt;&gt;\'pages\'</code> as text: "300" written as a string slips through.', vi: 'CHECK kiểm <code>attrs-&gt;&gt;\'pages\'</code> dạng chữ: "300" viết dạng chuỗi vẫn lọt.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql (J1, J2 merge, J2 repair + guard, J3, S2 + S4). <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table.',
        vi: 'Các tab Q1.sql … Q5.sql (J1, J2 gộp, J2 sửa + canh, J3, S2 + S4). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10.',
      },
      thuatNgu: [TN.jsonb, tn('jsonb_path_ops', 'lớp toán tử GIN chỉ cho @>'), tn('jsonb_set', 'thay một khoá'), tn('accent folding', 'bỏ dấu'), tn('generated column', 'cột sinh')],
      goiY: [
        { en: 'J1: jsonb_each (not jsonb_each_text) — the value must stay JSON for jsonb_typeof.', vi: 'J1: jsonb_each (không phải jsonb_each_text) — giá trị phải còn là JSON để jsonb_typeof đọc.' },
        { en: 'J2: <code>a || b -&gt; \'x\'</code> means <code>(a || b) -&gt; \'x\'</code>.', vi: 'J2: <code>a || b -&gt; \'x\'</code> nghĩa là <code>(a || b) -&gt; \'x\'</code>.' },
        { en: 'S4: the same folding on both sides, or "SỔ TAY" never meets "so tay".', vi: 'S4: cùng một cách bỏ dấu ở hai phía, nếu không "SỔ TAY" không bao giờ gặp "so tay".' },
      ],
      loiHayGap: [
        { en: 'J1 filtering out JSON null — gsm\'s problem vanishes from the survey and survives into the column.', vi: 'J1 lọc bỏ JSON null — vấn đề của gsm biến khỏi bảng khảo sát và lọt vào cột.' },
        { en: 'J2 replacing attrs by the specs — brand, color and tags are gone for 15 products.', vi: 'J2 thay attrs bằng specs — brand, color, tags mất ở 15 sản phẩm.' },
        { en: 'J3 a default GIN (jsonb_ops) works too, but it is bigger — the task asks for jsonb_path_ops.', vi: 'J3 GIN mặc định (jsonb_ops) cũng chạy, nhưng to hơn — đề yêu cầu jsonb_path_ops.' },
      ],
      giaiThich: { en: '<p>Reference solutions are J1, J2, J3 and the search part of <code>lab7-solution.sql</code>, adapted to the mini data and to a grader without extensions (khong_dau instead of unaccent, the simple configuration instead of a custom one).</p>', vi: '<p>Lời giải chuẩn là J1, J2, J3 và phần tìm kiếm của <code>lab7-solution.sql</code>, chỉnh theo dữ liệu mini và máy chấm không có extension (khong_dau thay cho unaccent, cấu hình simple thay cho cấu hình tự tạo).</p>' },
    }),
  ],
});
