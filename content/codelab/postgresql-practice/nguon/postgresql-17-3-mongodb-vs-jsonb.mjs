/**
 * PostgreSQL · 17.3 — MongoDB và JSONB. Chạy THẬT trên CT Shop: dựng orders_doc (một document mỗi đơn, sinh từ bảng), hỏi
 * document bằng @> / jsonb_array_elements và đối chiếu với JOIN, và cái giá của bản chép khi đổi tên một sản phẩm
 * (sửa mọi document chứa nó). Phần MongoDB (MQL, $unwind/$group, multikey index) ⇒ trắc nghiệm đối chiếu.
 */
import { mod, pg, cs, q, bang1, kq, kqAn, sau, ma, CT_SHOP, LUOC_DO_CT_SHOP, pre, tn } from './_chung.mjs';

const T = { thuTu: true };

const DUNG = `CREATE TABLE orders_doc (id bigint PRIMARY KEY, doc jsonb NOT NULL);
INSERT INTO orders_doc (id, doc)
SELECT o.id,
       jsonb_build_object(
         '_id', o.id,
         'customer', jsonb_build_object('id', c.id, 'name', c.full_name, 'city', c.city),
         'status', o.status,
         'created_at', o.created_at,
         'items', (SELECT jsonb_agg(jsonb_build_object('sku', p.sku, 'name', p.name, 'category', cat.name,
                                                        'qty', oi.qty, 'unit_price', oi.unit_price) ORDER BY p.sku)
                   FROM order_item oi JOIN product p ON p.id = oi.product_id JOIN category cat ON cat.id = p.category_id
                   WHERE oi.order_id = o.id))
FROM orders o JOIN customer c ON c.id = o.customer_id;`;
const NEN = `${CT_SHOP}\n${DUNG}`;
const LD_DOC = { en: `${LUOC_DO_CT_SHOP.en}<h4>+ orders_doc</h4>${pre(`orders_doc (id, doc jsonb)   -- one document per order:
{"_id", "customer": {"id", "name", "city"}, "status", "created_at", "items": [{"sku", "name", "category", "qty", "unit_price"}]}`)}`, vi: `${LUOC_DO_CT_SHOP.vi}<h4>+ orders_doc</h4>${pre(`orders_doc (id, doc jsonb)   -- mỗi đơn một document:
{"_id", "customer": {"id", "name", "city"}, "status", "created_at", "items": [{"sku", "name", "category", "qty", "unit_price"}]}`)}` };

const HOI = `SELECT (SELECT count(*) FROM orders_doc WHERE doc @> '{"items": [{"sku": "CT0501"}]}') AS from_documents,
       (SELECT count(DISTINCT oi.order_id) FROM order_item oi JOIN product p ON p.id = oi.product_id
        WHERE p.sku = 'CT0501') AS from_tables;`;
const DOANH_THU = `SELECT i->>'category' AS category,
       count(DISTINCT d.id) AS orders,
       sum((i->>'qty')::int * (i->>'unit_price')::numeric) AS revenue
FROM orders_doc d, jsonb_array_elements(d.doc->'items') AS i      -- $unwind
WHERE d.doc->>'status' IN ('paid', 'shipped')                      -- $match
GROUP BY 1                                                          -- $group
ORDER BY revenue DESC, category
LIMIT 5;`;
const DOI_TEN = `UPDATE orders_doc d
SET doc = jsonb_set(d.doc, '{items}',
          (SELECT jsonb_agg(CASE WHEN e.i->>'sku' = 'CT0501'
                                 THEN jsonb_set(e.i, '{name}', '"Bút bi Thiên Long TL-027 (2027)"')
                                 ELSE e.i END ORDER BY e.n)
           FROM jsonb_array_elements(d.doc->'items') WITH ORDINALITY AS e(i, n)))
WHERE d.doc @> '{"items": [{"sku": "CT0501"}]}'
RETURNING d.id;`;

export default mod('postgresql-17-3-mongodb-vs-jsonb', '17.3 The same orders as tables, as documents, as JSONB', [
  pg({
    t: 'Build the documents from the tables', k: 'MEDIUM', p: 12, kn: ['jsonb_build_object', 'correlated jsonb_agg', 'INSERT … SELECT'], tag: ['jsonb', 'document', 'ctshop'],
    en: '<p>Create <code>orders_doc (id bigint PRIMARY KEY, doc jsonb NOT NULL)</code> and fill it with one document per order: <code>{"_id", "customer": {"id", "name", "city"}, "status", "created_at", "items": [{"sku", "name", "category", "qty", "unit_price"} … ordered by sku]}</code> (category = the category name).</p>',
    vi: '<p>Tạo <code>orders_doc (id bigint PRIMARY KEY, doc jsonb NOT NULL)</code> và nạp mỗi đơn một document: <code>{"_id", "customer": {"id", "name", "city"}, "status", "created_at", "items": [{"sku", "name", "category", "qty", "unit_price"} … sắp theo sku]}</code> (category = tên danh mục).</p>',
    yc: [['This is how the lesson generated the MongoDB import, so every answer can be checked against SQL.', 'Đây là cách bài học sinh tệp nhập cho MongoDB, nên mọi câu trả lời đều đối chiếu được bằng SQL.'], ['The items array comes from a correlated subquery with jsonb_agg(… ORDER BY p.sku).', 'Mảng items lấy từ một truy vấn con tương quan với jsonb_agg(… ORDER BY p.sku).']],
    giai: DUNG,
    kiem: [
      sau(['14 documents, 27 items in total', '14 document, tổng 27 dòng hàng'], "SELECT count(*) AS documents, sum(jsonb_array_length(doc->'items')) AS items FROM orders_doc"),
      sau(['Order 5 as a document', 'Đơn 5 dạng document'], "SELECT doc - 'created_at' AS doc FROM orders_doc WHERE id = 5"),
      sau(['created_at survives the trip', 'created_at vẫn nguyên sau chuyến đi'], "SELECT (doc->>'created_at')::timestamptz = (SELECT created_at FROM orders WHERE id = 9) AS same_time FROM orders_doc WHERE id = 9", { an: true }),
    ],
    sai: [
      DUNG.replace("'category', cat.name,", "'category', cat.id,"),
      DUNG.replace("FROM orders o JOIN customer c ON c.id = o.customer_id;", "FROM orders o JOIN customer c ON c.id = o.customer_id WHERE o.status <> 'cancelled';"),
    ],
    gy: [['Write the per-order SELECT first (lesson 17.1 exercise), then wrap it in INSERT … SELECT over all orders.', 'Viết SELECT cho một đơn trước (bài tập 17.1), rồi bọc trong INSERT … SELECT trên mọi đơn.'], ['jsonb stores a timestamptz as an ISO text string.', 'jsonb lưu timestamptz thành chuỗi ISO.']],
    lhg: [['Storing the category id — the document is meant to be read without a JOIN.', 'Lưu id danh mục — document sinh ra để đọc mà không cần JOIN.'], ['Skipping orders — a document store copy must hold everything the tables hold.', 'Bỏ sót đơn — bản sao dạng document phải chứa mọi thứ bảng chứa.']],
    gt: ['<p>Every document repeats the customer and the product and category names. That is what makes one read enough — and what the next exercises put a price on.</p>', '<p>Mỗi document lặp lại khách, tên sản phẩm và tên danh mục. Chính điều đó làm một lần đọc là đủ — và là thứ các bài tiếp theo định giá.</p>'],
    tn: [tn('document', 'tài liệu JSON tự chứa')],
  }),

  pg({
    csdl: NEN, tenCsdl: 'ctshop', ld: LD_DOC,
    t: 'Ask the documents, check with the tables', k: 'MEDIUM', p: 8, kn: ['@> containment into an array', 'MongoDB "items.sku"', 'cross-check with JOIN'], tag: ['jsonb', 'document'],
    en: '<p>MongoDB asks <code>db.orders.countDocuments({ "items.sku": "CT0501" })</code>. Return one row <code>from_documents, from_tables</code>: the same count from orders_doc with <code>@&gt;</code>, and from the tables with a JOIN.</p>',
    vi: '<p>MongoDB hỏi <code>db.orders.countDocuments({ "items.sku": "CT0501" })</code>. Trả về một dòng <code>from_documents, from_tables</code>: cùng số đếm từ orders_doc bằng <code>@&gt;</code>, và từ các bảng bằng JOIN.</p>',
    yc: [['<code>doc @&gt; \'{"items": [{"sku": "CT0501"}]}\'</code> — "the items array contains an element with this sku".', '<code>doc @&gt; \'{"items": [{"sku": "CT0501"}]}\'</code> — "mảng items chứa một phần tử có sku này".'], ['From the tables: count(DISTINCT order_id).', 'Từ bảng: count(DISTINCT order_id).']],
    giai: HOI,
    kiem: [
      kq(['Both sides agree', 'Hai phía khớp nhau']),
      kqAn(['A new order with the pen is added to both shapes', 'Một đơn mới có cây bút được thêm vào cả hai dạng'], `INSERT INTO orders (customer_id, status) VALUES (8, 'paid'); INSERT INTO order_item (order_id, product_id, qty, unit_price) VALUES (15, 1, 1, 5000); INSERT INTO orders_doc VALUES (15, '{"_id": 15, "status": "paid", "items": [{"sku": "CT0501", "qty": 1}]}')`),
      ma(['Uses containment', 'Dùng phép chứa'], '@>'),
    ],
    sai: [`SELECT (SELECT count(*) FROM orders_doc WHERE doc->'items'->0->>'sku' = 'CT0501') AS from_documents, (SELECT count(DISTINCT oi.order_id) FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE p.sku = 'CT0501') AS from_tables`],
    gy: [['MongoDB walks the dot path into the array; PostgreSQL\'s @&gt; asks "does it contain this smaller JSON".', 'MongoDB đi theo đường chấm vào mảng; @&gt; của PostgreSQL hỏi "nó có chứa đoạn JSON nhỏ này không".'], ['A GIN (jsonb_path_ops) index answers @&gt; — like MongoDB\'s multikey index on items.sku.', 'Chỉ mục GIN (jsonb_path_ops) trả lời @&gt; — như chỉ mục multikey của MongoDB trên items.sku.']],
    lhg: [['<code>doc-&gt;\'items\'-&gt;0</code> — only looks at the first line.', '<code>doc-&gt;\'items\'-&gt;0</code> — chỉ nhìn dòng đầu tiên.'], ['Trusting the document count without cross-checking.', 'Tin số đếm từ document mà không đối chiếu.']],
    gt: ['<p>Three spellings, one answer: MQL dot path, JSONB containment, relational JOIN. Generating the documents from the tables is what makes the cross-check possible.</p>', '<p>Ba cách viết, một đáp án: đường chấm của MQL, phép chứa của JSONB, JOIN quan hệ. Sinh document từ bảng là điều khiến việc đối chiếu khả thi.</p>'],
    tn: [tn('containment', 'phép chứa'), tn('multikey index', 'chỉ mục nhiều khoá')],
  }),

  pg({
    csdl: NEN, tenCsdl: 'ctshop', ld: LD_DOC,
    t: 'An aggregation pipeline in SQL: revenue by category from documents', k: 'HARD', p: 12, kn: ['jsonb_array_elements = $unwind', 'GROUP BY = $group', 'casting ->> text'], tag: ['jsonb', 'document', 'aggregation'],
    en: `<p>Translate this MongoDB pipeline to SQL over orders_doc (only paid and shipped orders): <code>category, orders, revenue</code>, top 5 by revenue (ties by category).</p>${pre(`db.orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped"] } } },
  { $unwind: "$items" },
  { $group: { _id: "$items.category", orders: { $addToSet: "$_id" },
              revenue: { $sum: { $multiply: ["$items.qty", "$items.unit_price"] } } } },
  { $project: { orders: { $size: "$orders" }, revenue: 1 } },
  { $sort: { revenue: -1 } }, { $limit: 5 }
])`)}`,
    vi: `<p>Dịch pipeline MongoDB này sang SQL trên orders_doc (chỉ đơn đã thanh toán và đã giao): <code>category, orders, revenue</code>, 5 danh mục doanh thu cao nhất (bằng nhau theo category).</p>${pre(`db.orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped"] } } },
  { $unwind: "$items" },
  { $group: { _id: "$items.category", orders: { $addToSet: "$_id" },
              revenue: { $sum: { $multiply: ["$items.qty", "$items.unit_price"] } } } },
  { $project: { orders: { $size: "$orders" }, revenue: 1 } },
  { $sort: { revenue: -1 } }, { $limit: 5 }
])`)}`,
    yc: [['<code>FROM orders_doc d, jsonb_array_elements(d.doc-&gt;\'items\') AS i</code> — one row per line, like $unwind.', '<code>FROM orders_doc d, jsonb_array_elements(d.doc-&gt;\'items\') AS i</code> — mỗi dòng hàng một dòng, như $unwind.'], ['$addToSet + $size = count(DISTINCT d.id).', '$addToSet + $size = count(DISTINCT d.id).']],
    giai: DOANH_THU,
    kiem: [
      kq(['Top 5 categories from documents', '5 danh mục hàng đầu từ document'], T),
      sau(['…the same numbers as the relational report', '…cùng số liệu với báo cáo quan hệ'], "SELECT cat.name AS category, count(DISTINCT o.id) AS orders, sum(oi.qty * oi.unit_price) AS revenue FROM orders o JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id JOIN category cat ON cat.id = p.category_id WHERE o.status IN ('paid', 'shipped') GROUP BY cat.name ORDER BY revenue DESC, category LIMIT 5", { thuTu: true, an: true }),
      ma(['Unwinds with jsonb_array_elements', 'Trải mảng bằng jsonb_array_elements'], 'jsonb_array_elements\\s*\\('),
    ],
    sai: [DOANH_THU.replace('count(DISTINCT d.id)', 'count(*)'), DOANH_THU.replace("WHERE d.doc->>'status' IN ('paid', 'shipped')                      -- $match\n", '')],
    gy: [['->> returns text: cast qty to int and unit_price to numeric before multiplying.', '->> trả chữ: ép qty sang int và unit_price sang numeric trước khi nhân.'], ['The hidden check runs the relational report — both must print the same rows.', 'Kiểm ẩn chạy báo cáo quan hệ — hai bên phải in cùng các dòng.']],
    lhg: [['count(*) — counts lines, not orders ($addToSet removes duplicates).', 'count(*) — đếm dòng hàng, không đếm đơn ($addToSet loại trùng).'], ['Forgetting the $match on status.', 'Quên $match theo status.']],
    gt: ['<p>A pipeline runs stages in order: $match ≈ WHERE, $unwind = jsonb_array_elements, $group ≈ GROUP BY, $sort/$limit = ORDER BY/LIMIT. The lesson printed the same five rows from MongoDB, from JSONB and from the tables on three SQL servers.</p>', '<p>Pipeline chạy các giai đoạn theo thứ tự: $match ≈ WHERE, $unwind = jsonb_array_elements, $group ≈ GROUP BY, $sort/$limit = ORDER BY/LIMIT. Bài học in ra cùng năm dòng từ MongoDB, từ JSONB và từ bảng trên ba máy SQL.</p>'],
    tn: [tn('aggregation pipeline', 'chuỗi giai đoạn tổng hợp'), tn('$unwind', 'trải mảng thành dòng')],
  }),

  pg({
    csdl: NEN, tenCsdl: 'ctshop', ld: LD_DOC,
    t: 'The price of copies: rename a product everywhere', k: 'HARD', p: 15, kn: ['jsonb_set inside an array', 'jsonb_array_elements WITH ORDINALITY', 'shared facts vs snapshots'], tag: ['jsonb', 'document', 'update'],
    en: '<p>Product CT0501 is renamed <code>Bút bi Thiên Long TL-027 (2027)</code>. In the tables that is one UPDATE of one row. In orders_doc, rewrite the <code>name</code> of every CT0501 item in every document that contains it, keeping the order of the items and every other field, and <code>RETURNING d.id</code> of the documents changed.</p>',
    vi: '<p>Sản phẩm CT0501 đổi tên thành <code>Bút bi Thiên Long TL-027 (2027)</code>. Trong bảng đó là một UPDATE một dòng. Trong orders_doc, viết lại <code>name</code> của mọi dòng hàng CT0501 trong mọi document chứa nó, giữ thứ tự các dòng hàng và mọi trường khác, và <code>RETURNING d.id</code> các document đã đổi.</p>',
    yc: [['Rebuild the items array: <code>jsonb_agg(CASE WHEN … THEN jsonb_set(e.i, \'{name}\', …) ELSE e.i END ORDER BY e.n)</code> over <code>jsonb_array_elements(…) WITH ORDINALITY AS e(i, n)</code>.', 'Dựng lại mảng items: <code>jsonb_agg(CASE WHEN … THEN jsonb_set(e.i, \'{name}\', …) ELSE e.i END ORDER BY e.n)</code> trên <code>jsonb_array_elements(…) WITH ORDINALITY AS e(i, n)</code>.'], ['Touch only documents that contain the sku (WHERE … @&gt; …).', 'Chỉ đụng các document chứa sku đó (WHERE … @&gt; …).']],
    giai: DOI_TEN,
    kiem: [
      kq(['The documents that had to be rewritten', 'Các document phải viết lại'], T),
      sau(['Every CT0501 line carries the new name, nothing else changed', 'Mọi dòng CT0501 mang tên mới, không gì khác đổi'], "SELECT d.id, e.n, e.i->>'sku' AS sku, e.i->>'name' AS name, e.i->>'qty' AS qty FROM orders_doc d, jsonb_array_elements(d.doc->'items') WITH ORDINALITY AS e(i, n) WHERE d.id IN (1, 8, 13) ORDER BY d.id, e.n", T),
      { ...sau(['A document where the pen is the SECOND line', 'Document mà cây bút là dòng THỨ HAI'], "SELECT e.n, e.i->>'sku' AS sku, e.i->>'name' AS name FROM orders_doc d, jsonb_array_elements(d.doc->'items') WITH ORDINALITY AS e(i, n) WHERE d.id = 20 ORDER BY e.n", { thuTu: true, an: true }), themCsdl: `INSERT INTO orders_doc VALUES (20, '{"_id": 20, "status": "paid", "items": [{"sku": "CT0100", "name": "Bút mẫu", "qty": 1}, {"sku": "CT0501", "name": "Bút bi Thiên Long TL-027 (xanh)", "qty": 2}]}')` },
      sau(['Documents without the pen are untouched', 'Document không có cây bút giữ nguyên'], "SELECT count(*) AS unchanged FROM orders_doc d WHERE NOT d.doc @> '{\"items\": [{\"sku\": \"CT0501\"}]}' AND d.doc->'items' IS NOT DISTINCT FROM (SELECT jsonb_agg(jsonb_build_object('sku', p.sku, 'name', p.name, 'category', cat.name, 'qty', oi.qty, 'unit_price', oi.unit_price) ORDER BY p.sku) FROM order_item oi JOIN product p ON p.id = oi.product_id JOIN category cat ON cat.id = p.category_id WHERE oi.order_id = d.id)", { an: true }),
    ],
    sai: [
      `UPDATE orders_doc d SET doc = jsonb_set(d.doc, '{items,0,name}', '"Bút bi Thiên Long TL-027 (2027)"') WHERE d.doc @> '{"items": [{"sku": "CT0501"}]}' RETURNING d.id;`,
      DOI_TEN.replace(" ORDER BY e.n)", ')').replace("jsonb_agg(CASE WHEN e.i->>'sku' = 'CT0501'", "jsonb_agg(CASE WHEN e.i->>'sku' = 'CT0501'").replace('ELSE e.i END', "ELSE e.i - 'qty' END"),
    ],
    gy: [['jsonb_set with a path like {items,0,name} only works if you know the position — and it differs per document.', 'jsonb_set với đường dẫn kiểu {items,0,name} chỉ đúng khi biết vị trí — mà mỗi document một khác.'], ['MongoDB writes the same thing with arrayFilters: <code>{ $set: { "items.$[i].name": … } }, { arrayFilters: [{ "i.sku": "CT0501" }] }</code>.', 'MongoDB viết cùng việc này bằng arrayFilters: <code>{ $set: { "items.$[i].name": … } }, { arrayFilters: [{ "i.sku": "CT0501" }] }</code>.']],
    lhg: [['Updating position 0 — right only for documents where the pen happens to be the first line.', 'Sửa vị trí 0 — chỉ đúng với document mà cây bút tình cờ là dòng đầu.'], ['Losing the item order or other fields while rebuilding the array.', 'Làm mất thứ tự dòng hàng hoặc các trường khác khi dựng lại mảng.']],
    gt: ['<p>One renamed product = one UPDATE in tables, but a rewrite of every document that copied it (119 in the lesson\'s MongoDB). Decide which copies are a problem: a product name in an old order is arguably a snapshot of what was sold; a customer\'s email copied into every order is a shared fact that must stay in one place.</p>', '<p>Đổi tên một sản phẩm = một UPDATE trong bảng, nhưng phải viết lại mọi document đã chép nó (119 trong MongoDB của bài). Hãy phân biệt bản chép nào là vấn đề: tên sản phẩm trong đơn cũ có thể coi là ảnh chụp thứ đã bán; email khách chép vào mọi đơn là sự thật dùng chung phải nằm một chỗ.</p>'],
    tn: [tn('WITH ORDINALITY', 'kèm số thứ tự phần tử'), tn('arrayFilters', 'bộ lọc phần tử mảng của MongoDB')],
  }),

  cs({
    t: 'When documents win, when tables win', k: 'EASY', p: 6, kn: ['embed vs reference', 'shared facts', 'JSONB middle way'], tag: ['document', 'design'], loai: 'table',
    en: '<p>For each need, which shape fits best?</p>', vi: '<p>Với mỗi nhu cầu, hình dạng nào hợp nhất?</p>',
    bang: [bang1('b1', ['Need → shape', 'Nhu cầu → hình dạng'], [{ ma: 'n', ten: 'Need / Nhu cầu' }, { ma: 's', ten: 'Shape / Hình dạng', luaChon: ['documents', 'tables', 'tables + a JSONB column'] }], [
      { o: { n: 'An event log, append-only, every event a different payload / Nhật ký sự kiện chỉ ghi thêm, mỗi sự kiện một kiểu dữ liệu' }, a: { s: 'documents' } },
      { o: { n: 'Prices and stock shared by many orders, changed every day / Giá và tồn kho dùng chung cho nhiều đơn, đổi hằng ngày' }, a: { s: 'tables' } },
      { o: { n: 'A product catalogue: fixed price/stock rules + attributes that differ per category / Danh mục sản phẩm: luật giá/tồn kho cố định + thuộc tính khác nhau theo loại' }, a: { s: 'tables + a JSONB column' } },
      { o: { n: 'A new cross-cutting report every week / Mỗi tuần một báo cáo mới cắt ngang dữ liệu' }, a: { s: 'tables' } },
      { o: { n: 'A user profile read and written as one block / Hồ sơ người dùng đọc và ghi như một khối' }, a: { s: 'documents' } },
    ], ['Documents win when data is read and written as one block and its shape varies; tables win for many-to-many relations, shared facts that change, and integrity across records. PostgreSQL\'s middle way — tables for the core, JSONB with GIN for the varying part — is CT Shop\'s product.attrs.', 'Document thắng khi dữ liệu được đọc ghi như một khối và hình dạng thay đổi; bảng thắng với quan hệ nhiều-nhiều, sự thật dùng chung hay thay đổi, và toàn vẹn xuyên bản ghi. Con đường giữa của PostgreSQL — bảng cho phần lõi, JSONB có GIN cho phần hay đổi — là product.attrs của CT Shop.'])],
    gy: [['Ask how the data is read and how often shared parts change.', 'Tự hỏi dữ liệu được đọc thế nào và phần dùng chung đổi thường xuyên ra sao.'], ['Documents copy; tables reference.', 'Document chép; bảng tham chiếu.']],
    lhg: [['Embedding a fact that changes often.', 'Nhúng một sự thật hay thay đổi.'], ['Splitting a block that is always read together into many tables "for purity".', 'Chẻ một khối luôn được đọc cùng nhau thành nhiều bảng "cho thuần".']],
    tn: [tn('embed vs reference', 'nhúng hay tham chiếu')],
  }),
]);
