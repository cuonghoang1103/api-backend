/** PostgreSQL · 13.2 — Truy vấn JSONB (@>, ?, ?|, jsonpath) và đánh chỉ mục GIN (jsonb_ops / jsonb_path_ops). */
import { mod, pg, cs, q, kq, kqAn, sau, ma, CT_SHOP, LUOC_DO_CT_SHOP, PLAN_ALL, TN, tn } from './_chung.mjs';
import { O_PROPS } from './_du-lieu.mjs';

const T = { thuTu: true };
const lit = (s) => s.replace(/'/g, "''");

export default mod('postgresql-13-2-gin-jsonb', '13.2 Querying JSONB and indexing it with GIN', [
  pg({
    ...O_PROPS, t: 'Containment: light products of Acme', k: 'EASY', p: 5, kn: ['@> containment', 'arrays inside containment'], tag: ['jsonb'],
    en: '<p>Return the <code>name</code> of every product whose props contain brand <b>Acme</b> AND the tag <b>light</b>, ordered by id. Use one containment test.</p>',
    vi: '<p>Trả về <code>name</code> của mọi sản phẩm có props chứa brand <b>Acme</b> VÀ thẻ <b>light</b>, sắp theo id. Dùng một phép thử "chứa".</p>',
    yc: [['<code>props @&gt; \'{"brand": "Acme", "tags": ["light"]}\'</code>.', '<code>props @&gt; \'{"brand": "Acme", "tags": ["light"]}\'</code>.'], ['An array in the pattern means "contains these elements", in any order.', 'Mảng trong mẫu nghĩa là "chứa các phần tử này", thứ tự tuỳ ý.']],
    giai: `SELECT name
FROM product
WHERE props @> '{"brand": "Acme", "tags": ["light"]}'   -- both keys must match; "light" must be one of the tags
ORDER BY id;`,
    kiem: [
      kq(['Laptop Air 13', 'Laptop Air 13'], T),
      kqAn(['A light Acme keyboard joins', 'Thêm bàn phím Acme nhẹ'], "UPDATE product SET props = jsonb_set(props, '{tags}', '[\"accessory\", \"light\"]') WHERE id = 5", T),
      ma(['Uses @>', 'Dùng @>'], '@>'),
    ],
    sai: ["SELECT name FROM product WHERE props @> '{\"brand\": \"Acme\"}' ORDER BY id", "SELECT name FROM product WHERE props @> '{\"tags\": [\"light\"]}' ORDER BY id"],
    gy: [['@&gt; asks: is the right document a sub-document of the left one?', '@&gt; hỏi: tài liệu bên phải có là tài liệu con của bên trái không?'], ['Put both conditions in one JSON pattern.', 'Đặt cả hai điều kiện vào một mẫu JSON.']],
    lhg: [['Only the brand — the Pro laptop slips in.', 'Chỉ có brand — laptop Pro lọt vào.'], ['Only the tag — the Zeta tablet slips in.', 'Chỉ có tag — máy tính bảng Zeta lọt vào.']],
    gt: ['<p>Containment is the workhorse of JSONB querying and exactly what GIN indexes accelerate. Arrays inside the pattern are matched as subsets, objects recursively.</p>', '<p>Phép chứa là công cụ chính khi truy vấn JSONB và đúng là thứ chỉ mục GIN tăng tốc. Mảng trong mẫu được khớp như tập con, đối tượng thì khớp đệ quy.</p>'],
    tn: [tn('@>', 'chứa')],
  }),

  pg({
    ...O_PROPS, t: 'Existence: who has specs, who has storage?', k: 'MEDIUM', p: 6, kn: ['? key exists', 'nested ?', '?| any key'], tag: ['jsonb'],
    en: '<p>Return <code>name, has_specs, has_storage, phone_or_tablet</code> for every product: whether props has a <code>specs</code> key, whether <code>specs</code> has a <code>storage</code> key, and whether the tags array contains <code>phone</code> or <code>tablet</code>. Order by id.</p>',
    vi: '<p>Trả về <code>name, has_specs, has_storage, phone_or_tablet</code> cho mọi sản phẩm: props có khoá <code>specs</code> không, <code>specs</code> có khoá <code>storage</code> không, và mảng tags có <code>phone</code> hoặc <code>tablet</code> không. Sắp theo id.</p>',
    yc: [['<code>props ? \'specs\'</code>, <code>props-&gt;\'specs\' ? \'storage\'</code> (NULL when there are no specs — wrap in COALESCE(…, false)).', '<code>props ? \'specs\'</code>, <code>props-&gt;\'specs\' ? \'storage\'</code> (NULL khi không có specs — bọc COALESCE(…, false)).'], ['<code>props-&gt;\'tags\' ?| array[\'phone\', \'tablet\']</code>.', '<code>props-&gt;\'tags\' ?| array[\'phone\', \'tablet\']</code>.']],
    giai: `SELECT name,
       props ? 'specs'                                   AS has_specs,
       COALESCE(props -> 'specs' ? 'storage', false)     AS has_storage,       -- no specs ⇒ NULL ⇒ false
       props -> 'tags' ?| array['phone', 'tablet']       AS phone_or_tablet    -- ?| any, ?& all
FROM product
ORDER BY id;`,
    kiem: [
      kq(['Five rows of booleans', 'Năm dòng boolean'], T),
      kqAn(['A phone with storage, a cable without anything', 'Điện thoại có storage, dây cáp không có gì'], "INSERT INTO product (name, props) VALUES ('Phone Y', '{\"brand\":\"Zeta\",\"tags\":[\"phone\"],\"specs\":{\"storage\":512}}'), ('Cable', '{\"tags\":[]}')", T),
      ma(['Uses ?| for "any of"', 'Dùng ?| cho "một trong"'], '\\?\\|'),
    ],
    sai: ["SELECT name, props ? 'specs' AS has_specs, props -> 'specs' ? 'storage' AS has_storage, props -> 'tags' ?| array['phone', 'tablet'] AS phone_or_tablet FROM product ORDER BY id", "SELECT name, props ? 'specs' AS has_specs, COALESCE(props -> 'specs' ? 'storage', false) AS has_storage, props -> 'tags' ?& array['phone', 'tablet'] AS phone_or_tablet FROM product ORDER BY id"],
    gy: [['? tests a top-level key (or an array element string).', '? thử khoá cấp trên cùng (hoặc phần tử chuỗi của mảng).'], ['?| = any of the keys, ?& = all of them.', '?| = một trong các khoá, ?& = tất cả.']],
    lhg: [['NULL instead of false for products without specs.', 'NULL thay vì false cho sản phẩm không có specs.'], ['?& (all) instead of ?| (any) — nothing is both a phone and a tablet.', '?& (tất cả) thay vì ?| (một trong) — không gì vừa là điện thoại vừa là máy tính bảng.']],
    gt: ['<p>Existence operators answer "is the key there at all?" — different from "is its value NULL". Lab 7 uses the difference to clean JSON null values.</p>', '<p>Toán tử tồn tại trả lời "khoá có ở đó không?" — khác với "giá trị có NULL không". Lab 7 dùng sự khác biệt này để dọn giá trị JSON null.</p>'],
    tn: [tn('?', 'có khoá'), tn('?| / ?&', 'có một trong / có tất cả')],
  }),

  pg({
    ...O_PROPS, t: 'jsonpath: products with at least 8 GB of RAM', k: 'MEDIUM', p: 8, kn: ['@? jsonpath', 'filter expressions', 'jsonb_path_query_first'], tag: ['jsonb', 'jsonpath'],
    en: '<p>Using a SQL/JSON path, return <code>name, ram</code> of the products whose <code>specs.ram</code> is at least 8, most RAM first (ties by name). <code>ram</code> is the number, extracted with <code>jsonb_path_query_first</code>.</p>',
    vi: '<p>Dùng đường dẫn SQL/JSON, trả về <code>name, ram</code> của các sản phẩm có <code>specs.ram</code> từ 8 trở lên, RAM lớn nhất trước (bằng nhau theo tên). <code>ram</code> là con số, lấy bằng <code>jsonb_path_query_first</code>.</p>',
    yc: [['<code>WHERE props @? \'$.specs.ram ? (@ &gt;= 8)\'</code>.', '<code>WHERE props @? \'$.specs.ram ? (@ &gt;= 8)\'</code>.'], ['<code>jsonb_path_query_first(props, \'$.specs.ram\')::int AS ram</code>.', '<code>jsonb_path_query_first(props, \'$.specs.ram\')::int AS ram</code>.']],
    giai: `SELECT name,
       jsonb_path_query_first(props, '$.specs.ram')::int AS ram
FROM product
WHERE props @? '$.specs.ram ? (@ >= 8)'          -- @? : does the path return anything?
ORDER BY ram DESC, name;`,
    kiem: [
      kq(['Laptop Pro 14 (16), Laptop Air 13 and Phone X (8)', 'Laptop Pro 14 (16), Laptop Air 13 và Phone X (8)'], T),
      kqAn(['Upgrades and a product without specs', 'Nâng cấp và sản phẩm không có specs'], "UPDATE product SET props = jsonb_set(props, '{specs,ram}', '12') WHERE id = 4; INSERT INTO product (name, props) VALUES ('Server S', '{\"specs\":{\"ram\":64}}')", T),
      ma(['Uses a jsonpath', 'Dùng jsonpath'], '@\\?|@@|jsonb_path_'),
    ],
    sai: ["SELECT name, (props -> 'specs' ->> 'ram')::int AS ram FROM product WHERE props -> 'specs' ->> 'ram' >= '8' ORDER BY ram DESC, name"],
    gy: [['$ is the document root; ? ( … ) filters; @ is the current item.', '$ là gốc tài liệu; ? ( … ) là bộ lọc; @ là phần tử hiện tại.'], ['@? is indexable by GIN like @&gt;.', '@? được GIN tăng tốc như @&gt;.']],
    lhg: [['Comparing the TEXT value: \'16\' &gt;= \'8\' is false (text comparison).', 'So sánh giá trị CHỮ: \'16\' &gt;= \'8\' là false (so chữ).'], ['Forgetting that a missing path just means "no match" — no error, no row.', 'Quên rằng đường dẫn thiếu chỉ là "không khớp" — không lỗi, không dòng.']],
    gt: ['<p>jsonpath compares JSON numbers as numbers and handles missing paths gracefully. The text-comparison version passes the sample by luck and fails on 12 vs 8.</p>', '<p>jsonpath so số JSON như số và xử lý đường dẫn thiếu một cách nhẹ nhàng. Bản so chữ qua được mẫu nhờ may và hỏng với 12 so với 8.</p>'],
    tn: [tn('jsonpath', 'ngôn ngữ đường dẫn SQL/JSON')],
  }),

  pg({
    csdl: `${CT_SHOP}\n${PLAN_ALL}`, tenCsdl: 'ctshop', ld: { en: LUOC_DO_CT_SHOP.en + '<p>Plus the plan helpers (plan_text …). The table is tiny: the check switches sequential scans off to ask whether the index COULD serve the query.</p>', vi: LUOC_DO_CT_SHOP.vi + '<p>Cộng các hàm xem kế hoạch (plan_text …). Bảng rất nhỏ: kiểm tắt quét tuần tự để hỏi chỉ mục CÓ THỂ phục vụ không.</p>' },
    t: 'A compact GIN index for the filter panel (jsonb_path_ops)', k: 'HARD', p: 10, kn: ['GIN jsonb_path_ops', 'which operators each opclass supports'], tag: ['jsonb', 'gin', 'index', 'ctshop'],
    en: '<p>The category page filters products with containment only, e.g. <code>attrs @&gt; \'{"brand": "Thiên Long"}\'</code>. Create the <b>smaller</b> GIN flavour that supports exactly that operator on <code>product.attrs</code>.</p>',
    vi: '<p>Trang danh mục chỉ lọc sản phẩm bằng phép chứa, vd <code>attrs @&gt; \'{"brand": "Thiên Long"}\'</code>. Tạo loại GIN <b>nhỏ hơn</b> hỗ trợ đúng toán tử đó trên <code>product.attrs</code>.</p>',
    yc: [['<code>CREATE INDEX … ON product USING GIN (attrs jsonb_path_ops)</code>.', '<code>CREATE INDEX … ON product USING GIN (attrs jsonb_path_ops)</code>.'], ['jsonb_path_ops supports @&gt;, @? and @@ — not the key-existence operators.', 'jsonb_path_ops hỗ trợ @&gt;, @? và @@ — không hỗ trợ toán tử tồn tại khoá.']],
    giai: `CREATE INDEX product_attrs_gin ON product USING GIN (attrs jsonb_path_ops);
-- hashes whole paths (brand=Thiên Long) instead of every key and value separately ⇒ smaller, faster for @>`,
    kiem: [
      sau(['The containment filter can use the index', 'Bộ lọc chứa dùng được chỉ mục'], `SET LOCAL enable_seqscan = off; SELECT plan_nodes('${lit(`SELECT sku FROM product WHERE attrs @> '{"brand": "Thiên Long"}'`)}') ~ 'Bitmap Index Scan' AS uses_gin`),
      sau(['The operator class is jsonb_path_ops', 'Lớp toán tử là jsonb_path_ops'], "SELECT opc.opcname FROM pg_index i JOIN pg_opclass opc ON opc.oid = i.indclass[0] WHERE i.indrelid = 'product'::regclass AND NOT i.indisunique AND NOT i.indisprimary"),
      sau(['The filter still returns the four Thiên Long products', 'Bộ lọc vẫn trả bốn sản phẩm Thiên Long'], `SELECT count(*) AS thien_long FROM product WHERE attrs @> '{"brand": "Thiên Long"}'`, { an: true }),
    ],
    sai: ['CREATE INDEX product_attrs_gin ON product USING GIN (attrs)', "CREATE INDEX product_brand ON product ((attrs ->> 'brand'))"],
    gy: [['The opclass goes after the column inside the parentheses.', 'Lớp toán tử đặt sau tên cột trong ngoặc.'], ['Default jsonb_ops indexes every key and value (supports ? too) — bigger.', 'jsonb_ops mặc định đánh chỉ mục mọi khoá và giá trị (hỗ trợ cả ?) — lớn hơn.']],
    lhg: [['The default opclass: works, but is larger and slower for pure containment.', 'Lớp mặc định: chạy được, nhưng lớn hơn và chậm hơn với phép chứa thuần.'], ['A B-tree on attrs-&gt;&gt;\'brand\': serves = on that one key, not @&gt; on any key.', 'B-tree trên attrs-&gt;&gt;\'brand\': phục vụ = trên đúng khoá đó, không phục vụ @&gt; trên khoá bất kỳ.']],
    gt: ['<p>jsonb_path_ops stores one hash per path-to-value, so the index is typically 2–3× smaller and lookups touch fewer entries. Choose it when your queries only use containment / jsonpath; keep jsonb_ops when you also test key existence.</p>', '<p>jsonb_path_ops lưu một mã băm cho mỗi đường dẫn-tới-giá-trị, nên chỉ mục thường nhỏ hơn 2–3 lần và tra cứu chạm ít mục hơn. Chọn nó khi truy vấn chỉ dùng phép chứa / jsonpath; giữ jsonb_ops khi còn thử tồn tại khoá.</p>'],
    tn: [tn('jsonb_path_ops', 'lớp toán tử GIN gọn cho @>'), TN.index],
  }),
]);
