/**
 * PostgreSQL · 17.1 — Bốn hệ CSDL. Bài giới thiệu so sánh: dữ kiện (lịch sử, giấy phép, hình dạng dữ liệu, ngộ nhận) ⇒ bảng +
 * trắc nghiệm; phần chạy được: cùng một đơn ở hai hình dạng — bảng (JOIN) và document (jsonb dựng từ chính các bảng).
 */
import { mod, pg, cs, q, bang1, kq, kqAn, ma, tn } from './_chung.mjs';

const T = { thuTu: true };

const DOC = `SELECT jsonb_build_object(
  '_id', o.id,
  'customer', jsonb_build_object('id', c.id, 'name', c.full_name, 'city', c.city),
  'status', o.status,
  'items', (SELECT jsonb_agg(jsonb_build_object('sku', p.sku, 'name', p.name, 'qty', oi.qty, 'unit_price', oi.unit_price) ORDER BY p.sku)
            FROM order_item oi JOIN product p ON p.id = oi.product_id
            WHERE oi.order_id = o.id)
) AS doc
FROM orders o JOIN customer c ON c.id = o.customer_id
WHERE o.id = 1;`;

export default mod('postgresql-17-1-bon-he-csdl', '17.1 Four database systems, one order', [
  cs({
    t: 'SQL Server, MySQL, PostgreSQL, MongoDB — the facts', k: 'EASY', p: 8, kn: ['relational vs document', 'licences', 'who decides'], tag: ['comparison'], loai: 'table',
    en: '<p>Match each statement with the system it is true of (lesson 17.1, versions measured in containers on 25/10/2026).</p>', vi: '<p>Ghép mỗi nhận định với hệ CSDL mà nó đúng (bài 17.1, phiên bản đo trong container ngày 25/10/2026).</p>',
    bang: [bang1('b1', ['Statement → system', 'Nhận định → hệ'], [{ ma: 's', ten: 'Statement / Nhận định' }, { ma: 'h', ten: 'System / Hệ', luaChon: ['SQL Server', 'MySQL', 'PostgreSQL', 'MongoDB'] }], [
      { o: { s: 'Born as POSTGRES at UC Berkeley; owned by no company; permissive licence / Ra đời là POSTGRES ở UC Berkeley; không công ty nào sở hữu; giấy phép dễ dãi' }, a: { h: 'PostgreSQL' } },
      { o: { s: 'Stores each order as one self-contained document; SSPL licence / Lưu mỗi đơn là một document tự chứa; giấy phép SSPL' }, a: { h: 'MongoDB' } },
      { o: { s: 'Free Express edition only up to 10 GB per database; paid per CPU core in production / Bản Express miễn phí chỉ tới 10 GB mỗi CSDL; production trả tiền theo nhân CPU' }, a: { h: 'SQL Server' } },
      { o: { s: 'Owned by Oracle since 2010; MariaDB is its fork; GPL v2 community edition / Thuộc Oracle từ 2010; MariaDB là nhánh tách; bản cộng đồng GPL v2' }, a: { h: 'MySQL' } },
      { o: { s: 'The only one WordPress runs on (with MariaDB) / Hệ duy nhất WordPress chạy trên (cùng MariaDB)' }, a: { h: 'MySQL' } },
      { o: { s: 'Multi-document ACID transactions since 4.0 (2018), on a replica set / Giao dịch ACID nhiều document từ 4.0 (2018), trên replica set' }, a: { h: 'MongoDB' } },
    ], ['Three are relational (tables, each fact once, JOIN); MongoDB is a document store (an order and its lines in one document). Licences differ more than features: PostgreSQL and MySQL are free at any size, SQL Server only while small or in development.', 'Ba hệ là quan hệ (bảng, mỗi sự thật một lần, JOIN); MongoDB là kho document (một đơn và các dòng của nó trong một document). Giấy phép khác nhau nhiều hơn tính năng: PostgreSQL và MySQL miễn phí ở mọi cỡ, SQL Server chỉ khi nhỏ hoặc đang phát triển.'])],
    gy: [['Licence and owner are the quickest clues.', 'Giấy phép và chủ sở hữu là manh mối nhanh nhất.'], ['Only one of the four is not relational.', 'Chỉ một trong bốn hệ không phải quan hệ.']],
    lhg: [['"SQL Server only runs on Windows" — Linux and Docker since 2017.', '"SQL Server chỉ chạy trên Windows" — có Linux và Docker từ 2017.'], ['"MongoDB has no transactions" — it has had them since 2018.', '"MongoDB không có giao dịch" — có từ 2018.']],
    tn: [tn('document database', 'CSDL document'), tn('SSPL', 'giấy phép Server Side Public License')],
  }),

  pg({
    t: 'One order, two shapes: rows and a document', k: 'MEDIUM', p: 12, kn: ['jsonb_build_object', 'jsonb_agg … ORDER BY', 'embedding'], tag: ['jsonb', 'comparison', 'ctshop'],
    en: '<p>Build order 1 of CT Shop as the document MongoDB would store: one row, one column <code>doc</code> = <code>{"_id", "customer": {"id", "name", "city"}, "status", "items": [{"sku", "name", "qty", "unit_price"} … ordered by sku]}</code>, from the tables.</p>',
    vi: '<p>Dựng đơn 1 của CT Shop thành document mà MongoDB sẽ lưu: một dòng, một cột <code>doc</code> = <code>{"_id", "customer": {"id", "name", "city"}, "status", "items": [{"sku", "name", "qty", "unit_price"} … sắp theo sku]}</code>, từ các bảng.</p>',
    yc: [['<code>jsonb_build_object</code> for objects, a correlated <code>jsonb_agg(… ORDER BY p.sku)</code> for the items array.', '<code>jsonb_build_object</code> cho đối tượng, một <code>jsonb_agg(… ORDER BY p.sku)</code> tương quan cho mảng items.'], ['Key names exactly as above.', 'Tên khoá đúng như trên.']],
    giai: DOC,
    kiem: [
      kq(['Order 1 as a document', 'Đơn 1 dạng document']),
      kqAn(['After the customer moves to Huế', 'Sau khi khách chuyển ra Huế'], "UPDATE customer SET city = 'Huế' WHERE id = 1"),
      ma(['Builds the array with jsonb_agg', 'Dựng mảng bằng jsonb_agg'], 'json_agg|jsonb_agg'),
    ],
    sai: [
      DOC.replace("'city', c.city", "'town', c.city"),
      "SELECT jsonb_build_object('_id', o.id, 'customer', jsonb_build_object('id', c.id, 'name', c.full_name, 'city', c.city), 'status', o.status, 'items', jsonb_build_array(jsonb_build_object('sku', p.sku, 'name', p.name, 'qty', oi.qty, 'unit_price', oi.unit_price))) AS doc FROM orders o JOIN customer c ON c.id = o.customer_id JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id WHERE o.id = 1 ORDER BY p.sku",
    ],
    gy: [['jsonb sorts keys by length then bytewise, so key order in your call does not matter — key names do.', 'jsonb sắp khoá theo độ dài rồi theo byte, nên thứ tự khoá khi gọi không quan trọng — tên khoá thì có.'], ['The customer is copied into the document: change the table and the next build changes too.', 'Khách được chép vào document: đổi bảng thì lần dựng sau cũng đổi.']],
    lhg: [['Building the items array without ORDER BY — arrays are ordered, so two builds can differ.', 'Dựng mảng items không ORDER BY — mảng có thứ tự, nên hai lần dựng có thể khác nhau.'], ['A JOIN that repeats the order once per line instead of nesting the lines.', 'JOIN lặp lại đơn mỗi dòng một lần thay vì lồng các dòng vào.']],
    gt: ['<p>The relational shape stores the customer and the product names once and joins them on read; the document shape copies them into every order so one read returns everything. Lesson 17.3 measures what each copy costs.</p>', '<p>Hình dạng quan hệ lưu khách và tên sản phẩm một lần rồi JOIN khi đọc; hình dạng document chép chúng vào mọi đơn để một lần đọc trả đủ. Bài 17.3 đo cái giá của mỗi bản chép.</p>'],
    tn: [tn('embedding', 'nhúng dữ liệu vào document'), tn('jsonb_agg', 'gom thành mảng jsonb')],
  }),

  cs({
    t: 'Shapes, myths and the right question', k: 'EASY', p: 5, kn: ['relational vs document', 'myths'], tag: ['comparison'],
    en: '<p>Lesson 17.1 in three questions.</p>', vi: '<p>Bài 17.1 trong ba câu.</p>',
    cau: [
      q('q1', ['Which question should come before "which database is best?"', 'Câu hỏi nào nên đặt trước "CSDL nào tốt nhất?"'], ['linked facts or self-contained documents — and who will run it?', 'which one has the most stars and forks on GitHub right now?', 'which one released its newest major version most recently?', 'which one has the longest list of features on its website?'], ['Brands have no ranking; shapes, correctness needs and operations do decide.', 'Thương hiệu không có thứ hạng; hình dạng dữ liệu, nhu cầu đúng đắn và vận hành mới quyết định.']),
      q('q2', ['"NoSQL means no design." What is true?', '"NoSQL nghĩa là không cần thiết kế." Điều gì đúng?'], ['the schema moves into your code — choosing what to embed is design', 'MongoDB generates a good design for you automatically', 'documents never need indexes because reads are fast', 'there is nothing to back up when there is no schema'], ['You still decide shapes, indexes and what is copied where.', 'Bạn vẫn phải quyết định hình dạng, chỉ mục và chép cái gì vào đâu.']),
      q('q3', ['Which statement about MySQL is true today?', 'Nhận định nào về MySQL đúng hiện nay?'], ['it has a binary JSON type (since 5.7)', 'it cannot store JSON', 'it only runs on Windows', 'it has no transactions with InnoDB'], ['JSON since 5.7 (2015); InnoDB is transactional and the default engine.', 'JSON từ 5.7 (2015); InnoDB có giao dịch và là engine mặc định.']),
    ],
    gy: [['Think shape, then team and cost.', 'Nghĩ hình dạng dữ liệu, rồi tới đội và chi phí.'], ['Many "facts" about databases are 10 years old.', 'Nhiều "sự thật" về CSDL đã cũ 10 năm.']],
    lhg: [['Comparing brands instead of shapes.', 'So thương hiệu thay vì so hình dạng dữ liệu.'], ['Repeating outdated myths.', 'Nhắc lại ngộ nhận đã lỗi thời.']],
    tn: [tn('relational', 'quan hệ')],
  }),
]);
