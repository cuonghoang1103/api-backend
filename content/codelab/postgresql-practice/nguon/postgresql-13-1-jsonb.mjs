/** PostgreSQL · 13.1 — JSONB: kiểu tài liệu có chỉ mục. Bảng product(props) của bài + attrs của CT Shop mini. */
import { mod, pg, cs, q, kq, kqAn, sau, ma, TN, tn } from './_chung.mjs';
import { O_PROPS } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-13-1-jsonb', '13.1 JSONB: a document type that indexes', [
  pg({
    ...O_PROPS, t: 'Three ways to reach inside a document', k: 'EASY', p: 6, kn: ['->', '->>', 'nested path', 'cast from text'], tag: ['jsonb'],
    en: '<p>For every product return <code>name, brand, ram</code>: brand as <b>text</b>, ram (inside <code>specs</code>) as an <b>integer</b> — NULL when the product has no specs. Order by id.</p>',
    vi: '<p>Với mọi sản phẩm trả về <code>name, brand, ram</code>: brand dạng <b>chữ</b>, ram (nằm trong <code>specs</code>) dạng <b>số nguyên</b> — NULL khi sản phẩm không có specs. Sắp theo id.</p>',
    yc: [['<code>props -&gt;&gt; \'brand\'</code>; <code>(props -&gt; \'specs\' -&gt;&gt; \'ram\')::int</code> (or <code>(props #&gt;&gt; \'{specs,ram}\')::int</code>).', '<code>props -&gt;&gt; \'brand\'</code>; <code>(props -&gt; \'specs\' -&gt;&gt; \'ram\')::int</code> (hoặc <code>(props #&gt;&gt; \'{specs,ram}\')::int</code>).'], ['ram must be an int so it can be compared and summed.', 'ram phải là int để so sánh và cộng được.']],
    giai: `SELECT name,
       props ->> 'brand'                    AS brand,   -- text
       (props -> 'specs' ->> 'ram')::int    AS ram      -- jsonb → text → int; missing path ⇒ NULL
FROM product
ORDER BY id;`,
    kiem: [
      kq(['Five products, Keyboard with ram NULL', 'Năm sản phẩm, Keyboard có ram NULL'], T),
      kqAn(['A product with 32 GB and one without brand', 'Sản phẩm 32 GB và một sản phẩm không có hãng'], "INSERT INTO product (name, props) VALUES ('Workstation', '{\"brand\":\"Acme\",\"specs\":{\"ram\":32}}'), ('No-name cable', '{\"price\":5}')", T),
      ma(['Casts ram to int', 'Ép ram sang int'], "::\\s*int|::\\s*integer|CAST\\s*\\("),
    ],
    sai: ["SELECT name, props -> 'brand' AS brand, props -> 'specs' -> 'ram' AS ram FROM product ORDER BY id", "SELECT name, props ->> 'brand' AS brand, props ->> 'ram' AS ram FROM product ORDER BY id"],
    gy: [['-&gt; returns jsonb, -&gt;&gt; returns text; chain them for nested keys.', '-&gt; trả jsonb, -&gt;&gt; trả text; nối chuỗi để vào khoá lồng.'], ['A missing key anywhere on the path gives NULL, not an error.', 'Thiếu khoá ở đâu trên đường đi cũng cho NULL, không lỗi.']],
    lhg: [['<code>props -&gt;&gt; \'ram\'</code> — ram is inside specs, so this is always NULL.', '<code>props -&gt;&gt; \'ram\'</code> — ram nằm trong specs nên luôn NULL.'], ['Leaving ram as jsonb: ORDER BY and sums behave as JSON, not as numbers.', 'Để ram là jsonb: ORDER BY và phép cộng hành xử như JSON, không như số.']],
    gt: ['<p>The operators walk the document: <code>-&gt;</code> keeps JSON, <code>-&gt;&gt;</code> ends with text, and a cast turns that text into a real SQL type. Missing paths are simply NULL — which makes optional attributes easy.</p>', '<p>Các toán tử đi trong tài liệu: <code>-&gt;</code> giữ JSON, <code>-&gt;&gt;</code> kết thúc bằng chữ, và phép ép biến chữ đó thành kiểu SQL thật. Đường đi thiếu đơn giản là NULL — giúp thuộc tính tuỳ chọn dễ xử lý.</p>'],
    tn: [TN.jsonb, tn('#>>', 'lấy chữ theo đường dẫn')],
  }),

  pg({
    ...O_PROPS, t: 'Change one key without rewriting the document: jsonb_set', k: 'MEDIUM', p: 8, kn: ['jsonb_set', 'to_jsonb', 'RETURNING'], tag: ['jsonb', 'update'],
    en: '<p>Zeta raises its prices by 10 % (rounded to an integer). Update <code>props.price</code> of every Zeta product — keep every other key exactly as it is — and return <code>name, price</code> (the new price as an integer).</p>',
    vi: '<p>Zeta tăng giá 10 % (làm tròn tới số nguyên). Cập nhật <code>props.price</code> của mọi sản phẩm Zeta — giữ nguyên mọi khoá khác — và trả về <code>name, price</code> (giá mới dạng số nguyên).</p>',
    yc: [['<code>SET props = jsonb_set(props, \'{price}\', to_jsonb(round((props-&gt;&gt;\'price\')::numeric * 1.1)::int))</code>.', '<code>SET props = jsonb_set(props, \'{price}\', to_jsonb(round((props-&gt;&gt;\'price\')::numeric * 1.1)::int))</code>.'], ['Filter with <code>props @&gt; \'{"brand": "Zeta"}\'</code>.', 'Lọc bằng <code>props @&gt; \'{"brand": "Zeta"}\'</code>.']],
    giai: `UPDATE product
SET props = jsonb_set(props, '{price}',
                      to_jsonb(round((props ->> 'price')::numeric * 1.1)::int))   -- replaces ONE key
WHERE props @> '{"brand": "Zeta"}'
RETURNING name, (props ->> 'price')::int AS price;`,
    kiem: [
      kq(['Phone X 879, Tablet Mini 494', 'Phone X 879, Tablet Mini 494']),
      sau(['The rest of the document is intact', 'Phần còn lại của tài liệu nguyên vẹn'], "SELECT name, props - 'price' AS rest FROM product WHERE id IN (3, 4) ORDER BY id", T),
      sau(['Acme prices unchanged', 'Giá Acme không đổi'], "SELECT sum((props ->> 'price')::int) AS acme_total FROM product WHERE props ->> 'brand' = 'Acme'", { an: true }),
    ],
    sai: ["UPDATE product SET props = jsonb_build_object('price', round((props ->> 'price')::numeric * 1.1)::int) WHERE props @> '{\"brand\": \"Zeta\"}' RETURNING name, (props ->> 'price')::int AS price", "UPDATE product SET props = jsonb_set(props, '{price}', to_jsonb(round((props ->> 'price')::numeric * 1.1)::int)) RETURNING name, (props ->> 'price')::int AS price"],
    gy: [['jsonb_set(document, path, new_value) returns a new document with one value replaced.', 'jsonb_set(tài liệu, đường dẫn, giá trị mới) trả tài liệu mới với một giá trị được thay.'], ['The new value must be jsonb: wrap it with to_jsonb(…).', 'Giá trị mới phải là jsonb: bọc bằng to_jsonb(…).']],
    lhg: [['Rebuilding the document with only the price — brand, tags and specs are wiped.', 'Dựng lại tài liệu chỉ còn price — brand, tags, specs bị xoá sạch.'], ['Forgetting the WHERE — Acme prices go up too.', 'Quên WHERE — giá Acme cũng tăng.']],
    gt: ['<p>jsonb is immutable as a value: every change produces a new document. jsonb_set (or <code>||</code> to merge, <code>-</code> to remove a key) changes exactly what you name and keeps the rest.</p>', '<p>Giá trị jsonb là bất biến: mỗi thay đổi tạo ra tài liệu mới. jsonb_set (hoặc <code>||</code> để gộp, <code>-</code> để bỏ khoá) đổi đúng thứ bạn nêu và giữ phần còn lại.</p>'],
    tn: [tn('jsonb_set', 'thay một giá trị trong tài liệu')],
  }),

  pg({
    ...O_PROPS, t: 'Build JSON for the API: jsonb_agg per brand', k: 'MEDIUM', p: 8, kn: ['jsonb_build_object', 'jsonb_agg … ORDER BY'], tag: ['jsonb', 'api'],
    en: '<p>The API wants one row per brand: <code>brand</code> and <code>products</code>, a JSON array of objects <code>{"name": …, "price": …}</code> sorted by price (cheapest first). Order the rows by brand.</p>',
    vi: '<p>API cần mỗi hãng một dòng: <code>brand</code> và <code>products</code>, một mảng JSON các đối tượng <code>{"name": …, "price": …}</code> sắp theo giá (rẻ nhất trước). Sắp các dòng theo brand.</p>',
    yc: [['<code>jsonb_agg(jsonb_build_object(\'name\', name, \'price\', (props-&gt;&gt;\'price\')::int) ORDER BY (props-&gt;&gt;\'price\')::int)</code>.', '<code>jsonb_agg(jsonb_build_object(\'name\', name, \'price\', (props-&gt;&gt;\'price\')::int) ORDER BY (props-&gt;&gt;\'price\')::int)</code>.'], ['price as a JSON number, not a string.', 'price là số JSON, không phải chuỗi.']],
    giai: `SELECT props ->> 'brand' AS brand,
       jsonb_agg(jsonb_build_object('name', name, 'price', (props ->> 'price')::int)
                 ORDER BY (props ->> 'price')::int)            AS products
FROM product
GROUP BY 1
ORDER BY 1;`,
    kiem: [
      kq(['Acme and Zeta with their sorted products', 'Acme và Zeta kèm sản phẩm đã sắp'], T),
      kqAn(['A new brand and a new cheap Acme item', 'Hãng mới và một món Acme rẻ mới'], "INSERT INTO product (name, props) VALUES ('Mouse M1', '{\"brand\":\"Acme\",\"price\":25}'), ('Watch W', '{\"brand\":\"Nova\",\"price\":199}')", T),
      ma(['jsonb_agg with ORDER BY', 'jsonb_agg có ORDER BY'], 'jsonb_agg\\s*\\([\\s\\S]*ORDER\\s+BY'),
    ],
    sai: ["SELECT props ->> 'brand' AS brand, jsonb_agg(jsonb_build_object('name', name, 'price', props ->> 'price') ORDER BY (props ->> 'price')::int) AS products FROM product GROUP BY 1 ORDER BY 1", "SELECT props ->> 'brand' AS brand, jsonb_agg(jsonb_build_object('name', name, 'price', (props ->> 'price')::int) ORDER BY props ->> 'price') AS products FROM product GROUP BY 1 ORDER BY 1"],
    gy: [['Build each element with jsonb_build_object, collect them with jsonb_agg.', 'Dựng từng phần tử bằng jsonb_build_object, gom bằng jsonb_agg.'], ['Sort numbers as numbers: cast before ORDER BY.', 'Sắp số như số: ép kiểu trước ORDER BY.']],
    lhg: [['Ordering by the TEXT price — "1299" sorts before "449".', 'Sắp theo giá dạng CHỮ — "1299" đứng trước "449".'], ['Putting <code>-&gt;&gt;</code> text into the object — the API receives "799" instead of 799.', 'Đưa chữ <code>-&gt;&gt;</code> vào đối tượng — API nhận "799" thay vì 799.']],
    gt: ['<p>PostgreSQL can return exactly the JSON shape an API needs, aggregated and sorted on the server — one round-trip instead of N queries and a loop in the app.</p>', '<p>PostgreSQL trả được đúng hình dạng JSON mà API cần, tổng hợp và sắp ngay trên máy chủ — một lượt đi về thay vì N truy vấn và một vòng lặp trong app.</p>'],
    tn: [tn('jsonb_agg', 'gom thành mảng JSON'), tn('jsonb_build_object', 'dựng đối tượng JSON')],
  }),

  pg({
    t: 'Count products per tag (CT Shop attrs)', k: 'HARD', p: 10, kn: ['jsonb_array_elements_text', 'lateral set-returning function', 'GROUP BY an element'], tag: ['jsonb', 'ctshop'],
    en: '<p>Each CT Shop product carries <code>attrs-&gt;\'tags\'</code>, a JSON array such as <code>["học sinh", "sinh viên"]</code>. Return <code>tag, products</code> — how many <b>active</b> products carry each tag — most products first (ties by tag).</p>',
    vi: '<p>Mỗi sản phẩm CT Shop mang <code>attrs-&gt;\'tags\'</code>, một mảng JSON như <code>["học sinh", "sinh viên"]</code>. Trả về <code>tag, products</code> — mỗi thẻ có bao nhiêu sản phẩm <b>đang bán</b> — nhiều nhất trước (bằng nhau theo tag).</p>',
    yc: [['Unnest the array: <code>FROM product p, jsonb_array_elements_text(p.attrs-&gt;\'tags\') AS t(tag)</code>.', 'Tách mảng: <code>FROM product p, jsonb_array_elements_text(p.attrs-&gt;\'tags\') AS t(tag)</code>.'], ['Products without tags simply produce no rows.', 'Sản phẩm không có thẻ đơn giản là không sinh dòng nào.']],
    giai: `SELECT t.tag, count(*) AS products
FROM product p,
     jsonb_array_elements_text(p.attrs -> 'tags') AS t(tag)   -- one row per (product, tag)
WHERE p.is_active
GROUP BY t.tag
ORDER BY products DESC, t.tag;`,
    kiem: [
      kq(['học sinh, sinh viên, văn phòng', 'học sinh, sinh viên, văn phòng'], T),
      kqAn(['A product gets a new tag', 'Một sản phẩm có thêm thẻ mới'], "UPDATE product SET attrs = jsonb_set(attrs, '{tags}', (attrs -> 'tags') || '[\"ôn thi\"]') WHERE id IN (31, 43)", T),
      ma(['Unnests the array', 'Tách mảng'], 'jsonb_array_elements(_text)?\\s*\\('),
    ],
    sai: ["SELECT attrs ->> 'tags' AS tag, count(*) AS products FROM product WHERE is_active GROUP BY 1 ORDER BY products DESC, tag", "SELECT t.tag, count(*) AS products FROM product p, jsonb_array_elements_text(p.attrs -> 'tags') AS t(tag) GROUP BY t.tag ORDER BY products DESC, t.tag"],
    gy: [['A set-returning function in FROM runs once per product row (an implicit LATERAL join).', 'Hàm trả tập trong FROM chạy một lần cho mỗi dòng sản phẩm (phép nối LATERAL ngầm).'], ['_text returns plain text elements, ready to GROUP BY.', '_text trả phần tử dạng chữ, sẵn sàng GROUP BY.']],
    lhg: [['Grouping by the whole array text — ["học sinh", "sinh viên"] becomes its own "tag".', 'Gom theo cả chuỗi mảng — ["học sinh", "sinh viên"] thành một "thẻ" riêng.'], ['Forgetting is_active — the discontinued calculator is counted.', 'Quên is_active — máy tính ngừng bán bị đếm.']],
    gt: ['<p>jsonb_array_elements(_text) turns an array into rows, so normal SQL (GROUP BY, JOIN, filters) works on its elements — the bridge between documents and relational queries.</p>', '<p>jsonb_array_elements(_text) biến mảng thành các dòng, nên SQL bình thường (GROUP BY, JOIN, lọc) làm việc được trên phần tử — cây cầu giữa tài liệu và truy vấn quan hệ.</p>'],
    tn: [tn('jsonb_array_elements_text', 'tách mảng JSON thành dòng chữ')],
  }),

  cs({
    t: 'json or jsonb, column or document?', k: 'MEDIUM', p: 5, kn: ['json vs jsonb', 'when to use a column'], tag: ['jsonb', 'design'],
    en: '<p>Design decisions from lesson 13.1.</p>', vi: '<p>Các quyết định thiết kế của bài 13.1.</p>',
    cau: [
      q('q1', ['<code>SELECT \'{"b":1,"a":2,"a":3}\'::jsonb;</code> returns…', '<code>SELECT \'{"b":1,"a":2,"a":3}\'::jsonb;</code> trả về…'], ['{"a": 3, "b": 1} — keys reordered, the last duplicate wins', '{"b":1,"a":2,"a":3} — kept exactly as typed', 'an error: duplicate key', '{"b": 1, "a": 2}'], ['jsonb stores a parsed, normalized value; json stores the text as typed. jsonb is what you index and query.', 'jsonb lưu giá trị đã phân tích, chuẩn hoá; json lưu nguyên văn chữ. jsonb là thứ bạn đánh chỉ mục và truy vấn.']),
      q('q2', ['Every order has a customer_id that must reference customer. Where does it belong?', 'Mỗi đơn có customer_id phải trỏ tới customer. Nó thuộc về đâu?'], ['a real column with a foreign key', 'a key in a jsonb document', 'a jsonb array of ids', 'a text column with JSON'], ['Anything you join on, constrain, or always query belongs in a column; JSONB is for the varying rest.', 'Thứ gì bạn nối theo, ràng buộc, hay luôn truy vấn thì thuộc về cột; JSONB dành cho phần còn lại hay thay đổi.']),
      q('q3', ['Product attributes differ per category (ink colour, pages, calculator functions). Best model?', 'Thuộc tính sản phẩm khác nhau theo danh mục (màu mực, số trang, chức năng máy tính). Mô hình tốt nhất?'], ['common columns + one jsonb attrs column (CT Shop\'s choice)', 'one table per category', 'an EAV table (product_id, key, value text)', 'a text column with comma-separated values'], ['jsonb keeps the varying part flexible while price, stock, category stay typed columns. EAV loses types and needs a join per attribute.', 'jsonb giữ phần thay đổi linh hoạt trong khi price, stock, category vẫn là cột có kiểu. EAV mất kiểu và cần một phép nối cho mỗi thuộc tính.']),
    ],
    gy: [['Parsed and indexable ⇒ jsonb.', 'Đã phân tích và đánh chỉ mục được ⇒ jsonb.'], ['Constrained and joined ⇒ column.', 'Có ràng buộc và được nối ⇒ cột.']],
    lhg: [['Using json (text) and wondering why containment and GIN do not work.', 'Dùng json (chữ) rồi thắc mắc vì sao phép chứa và GIN không chạy.'], ['Putting foreign keys inside JSON.', 'Đặt khoá ngoại vào trong JSON.']],
    tn: [TN.jsonb],
  }),
]);
