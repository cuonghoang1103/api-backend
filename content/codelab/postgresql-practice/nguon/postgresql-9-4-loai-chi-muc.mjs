/** PostgreSQL · 9.4 — Các loại chỉ mục: GIN, BRIN, unique (từng phần), GiST + EXCLUDE. */
import { mod, pg, cs, bang1, sau, chan, duoc, ma, CT_SHOP, LUOC_DO_CT_SHOP, PLAN_ALL, pre, tn } from './_chung.mjs';
import { O_EVENT } from './_du-lieu.mjs';

const lit = (s) => s.replace(/'/g, "''");
const LOAI = ['B-tree', 'GIN', 'BRIN', 'GiST', 'Hash'];
const PHONG = `CREATE TABLE room (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO room VALUES (1, 'Lab A'), (2, 'Lab B'), (3, 'Hội trường');
CREATE TABLE booking (
  id      int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id int NOT NULL REFERENCES room(id),
  who     text NOT NULL,
  during  tstzrange NOT NULL
);`;

export default mod('postgresql-9-4-loai-chi-muc', '9.4 Index types: B-tree, GIN, BRIN, GiST & unique', [
  pg({
    ...O_EVENT, t: 'GIN for jsonb containment', k: 'MEDIUM', p: 7, kn: ['GIN', 'jsonb @>'], tag: ['index', 'gin', 'jsonb'],
    en: '<p>Marketing filters events by JSON properties: <code>SELECT count(*) FROM event WHERE props @&gt; \'{"plan": "pro"}\'</code>. A B-tree cannot look inside a document. Create the index type that can.</p>',
    vi: '<p>Marketing lọc sự kiện theo thuộc tính JSON: <code>SELECT count(*) FROM event WHERE props @&gt; \'{"plan": "pro"}\'</code>. B-tree không nhìn vào trong tài liệu được. Tạo loại chỉ mục làm được.</p>',
    yc: [['<code>CREATE INDEX … ON event USING GIN (props)</code>.', '<code>CREATE INDEX … ON event USING GIN (props)</code>.'], ['The containment query must use it.', 'Truy vấn chứa phải dùng nó.']],
    giai: `CREATE INDEX idx_event_props ON event USING GIN (props);   -- one entry per key/value inside every document`,
    kiem: [
      sau(['The @> query uses a Bitmap Index Scan', 'Truy vấn @> dùng Bitmap Index Scan'], `SELECT plan_nodes('${lit(`SELECT count(*) FROM event WHERE props @> '{"plan": "pro"}'`)}') ~ 'Bitmap Index Scan' AS uses_gin`),
      sau(['The index is GIN', 'Chỉ mục là GIN'], "SELECT am.amname FROM pg_index i JOIN pg_class c ON c.oid = i.indexrelid JOIN pg_am am ON am.oid = c.relam WHERE i.indrelid = 'event'::regclass AND NOT i.indisprimary"),
      sau(['Another key works too', 'Khoá khác cũng chạy'], `SET LOCAL enable_seqscan = off; SELECT plan_nodes('${lit(`SELECT count(*) FROM event WHERE props @> '{"device": "ios"}'`)}') ~ 'Bitmap Index Scan' AS uses_gin`, { an: true }),
    ],
    sai: ['CREATE INDEX idx_event_props ON event (props)', "CREATE INDEX idx_event_plan ON event ((props ->> 'device'))"],
    gy: [['GIN = Generalized INverted index: maps each element/key to the rows containing it.', 'GIN = chỉ mục đảo tổng quát: ánh xạ mỗi phần tử/khoá tới các dòng chứa nó.'], ['Write USING GIN after the table name.', 'Viết USING GIN sau tên bảng.']],
    lhg: [['A B-tree on props: it can only compare whole documents, not containment.', 'B-tree trên props: chỉ so được cả tài liệu, không so "chứa".'], ['An expression index on one key: helps that key only and only for =, not @&gt;.', 'Chỉ mục biểu thức trên một khoá: chỉ giúp khoá đó và chỉ cho =, không cho @&gt;.']],
    gt: ['<p>GIN indexes the inside of composite values: jsonb keys/values, array elements, words of a tsvector. Chapter 13 adds the smaller <code>jsonb_path_ops</code> operator class.</p>', '<p>GIN đánh chỉ mục bên trong giá trị tổ hợp: khoá/giá trị jsonb, phần tử mảng, từ của tsvector. Chương 13 thêm lớp toán tử nhỏ hơn <code>jsonb_path_ops</code>.</p>'],
    tn: [tn('GIN', 'chỉ mục đảo')],
  }),

  pg({
    ...O_EVENT, t: 'BRIN: a tiny index for time-ordered data', k: 'MEDIUM', p: 7, kn: ['BRIN', 'physical order', 'index size'], tag: ['index', 'brin'],
    en: '<p><code>event</code> is append-only: rows arrive in created_at order. Create a <b>BRIN</b> index on created_at — a few hundred bytes instead of hundreds of kilobytes — and check that the day query <code>WHERE created_at &gt;= \'2024-03-01\' AND created_at &lt; \'2024-03-02\'</code> can use it.</p>',
    vi: '<p><code>event</code> chỉ chèn thêm: dòng đến theo thứ tự created_at. Tạo chỉ mục <b>BRIN</b> trên created_at — vài trăm byte thay vì hàng trăm kilobyte — và kiểm truy vấn theo ngày <code>WHERE created_at &gt;= \'2024-03-01\' AND created_at &lt; \'2024-03-02\'</code> dùng được nó.</p>',
    yc: [['<code>CREATE INDEX … ON event USING BRIN (created_at)</code>.', '<code>CREATE INDEX … ON event USING BRIN (created_at)</code>.'], ['No B-tree on created_at.', 'Không có B-tree trên created_at.']],
    giai: `CREATE INDEX idx_event_created_brin ON event USING BRIN (created_at);
-- stores min/max of created_at per block range: only works because the table is physically in time order`,
    kiem: [
      sau(['The day query uses the BRIN index', 'Truy vấn theo ngày dùng chỉ mục BRIN'], `SELECT plan_nodes('${lit("SELECT * FROM event WHERE created_at >= '2024-03-01' AND created_at < '2024-03-02'")}') ~ 'Bitmap Index Scan' AS uses_index`),
      sau(['It is BRIN and much smaller than a B-tree would be', 'Nó là BRIN và nhỏ hơn hẳn B-tree'], "SELECT am.amname, pg_relation_size(c.oid) < 50000 AS tiny FROM pg_index i JOIN pg_class c ON c.oid = i.indexrelid JOIN pg_am am ON am.oid = c.relam WHERE i.indrelid = 'event'::regclass AND NOT i.indisprimary"),

      ma(['USING BRIN', 'USING BRIN'], 'USING\\s+BRIN\\s*\\(\\s*created_at\\s*\\)'),
    ],
    sai: ['CREATE INDEX idx_event_created ON event (created_at)'],
    gy: [['BRIN = Block Range INdex: one summary (min, max) per range of pages.', 'BRIN = chỉ mục khoảng khối: một bản tóm tắt (min, max) cho mỗi dải trang.'], ['It only helps when the column correlates with the physical row order.', 'Nó chỉ giúp khi cột tương quan với thứ tự vật lý của dòng.']],
    lhg: [['A B-tree: works too, but is hundreds of times larger on a big log table.', 'B-tree: cũng chạy, nhưng lớn hơn hàng trăm lần trên bảng log lớn.'], ['BRIN on a randomly ordered column (email): every block range covers everything, the index is useless.', 'BRIN trên cột thứ tự ngẫu nhiên (email): mỗi dải khối bao mọi giá trị, chỉ mục vô dụng.']],
    gt: ['<p>For huge append-only tables (logs, events, sensor data) BRIN gives "skip most of the table" for a fraction of the size of a B-tree. The lesson measured it on 500 000 rows.</p>', '<p>Với bảng chỉ-chèn khổng lồ (log, sự kiện, dữ liệu cảm biến), BRIN cho "bỏ qua phần lớn bảng" với kích thước bằng một phần nhỏ của B-tree. Bài giảng đã đo trên 500 000 dòng.</p>'],
    tn: [tn('BRIN', 'chỉ mục khoảng khối')],
  }),

  pg({
    csdl: CT_SHOP, tenCsdl: 'ctshop', ld: LUOC_DO_CT_SHOP,
    t: 'At most one pending order per customer: a partial unique index', k: 'MEDIUM', p: 8, kn: ['UNIQUE index', 'partial unique', 'constraint via index'], tag: ['index', 'unique', 'ctshop'],
    en: '<p>The checkout must never create a second <b>pending</b> order for the same customer (a double click). Paid, shipped and cancelled orders are unlimited. Enforce it in the database with one index.</p>',
    vi: '<p>Trang thanh toán không bao giờ được tạo đơn <b>pending</b> thứ hai cho cùng một khách (bấm đúp). Đơn paid, shipped, cancelled thì không giới hạn. Ép luật này trong CSDL bằng một chỉ mục.</p>',
    yc: [['<code>CREATE UNIQUE INDEX … ON orders (customer_id) WHERE status = \'pending\'</code>.', '<code>CREATE UNIQUE INDEX … ON orders (customer_id) WHERE status = \'pending\'</code>.'], ['A plain UNIQUE constraint cannot have a WHERE — this is why the index form exists.', 'Ràng buộc UNIQUE thường không có WHERE — đó là lý do có dạng chỉ mục.']],
    giai: `CREATE UNIQUE INDEX uq_orders_one_pending ON orders (customer_id) WHERE status = 'pending';`,
    kiem: [
      chan(['A second pending order of customer 3 is rejected', 'Đơn pending thứ hai của khách 3 bị chặn'], "INSERT INTO orders (customer_id, status) VALUES (3, 'pending')", '23505'),
      duoc(['More paid orders are fine', 'Thêm đơn paid thì được'], "INSERT INTO orders (customer_id, status) VALUES (3, 'paid'), (3, 'paid')"),
      duoc(['After paying, a new pending order is allowed', 'Trả tiền xong thì được tạo đơn pending mới'], "UPDATE orders SET status = 'paid' WHERE id = 7; INSERT INTO orders (customer_id) VALUES (3)", { an: true }),
      chan(['Customer 8 cannot get two pending orders either', 'Khách 8 cũng không có được hai đơn pending'], "INSERT INTO orders (customer_id) VALUES (8), (8)", '23505', { an: true }),
    ],
    sai: ['CREATE UNIQUE INDEX uq_orders_customer ON orders (customer_id)', "CREATE INDEX idx_orders_pending ON orders (customer_id) WHERE status = 'pending'"],
    gy: [['A unique index IS a constraint: duplicates fail with 23505.', 'Chỉ mục unique CHÍNH LÀ một ràng buộc: trùng thì lỗi 23505.'], ['Add WHERE to make it apply only to pending rows.', 'Thêm WHERE để nó chỉ áp cho dòng pending.']],
    lhg: [['UNIQUE on customer_id for all rows — cannot even be created (customers already have several orders).', 'UNIQUE trên customer_id cho mọi dòng — không tạo nổi (khách đã có nhiều đơn).'], ['A partial index without UNIQUE — fast, but enforces nothing.', 'Chỉ mục từng phần thiếu UNIQUE — nhanh, nhưng không ép gì cả.']],
    gt: ['<p>Partial unique indexes express rules like "one active X per Y" that plain constraints cannot. The insert of the second pending order fails atomically, even if two requests race.</p>', '<p>Chỉ mục unique từng phần diễn đạt được luật kiểu "mỗi Y chỉ một X đang hoạt động" mà ràng buộc thường không làm được. Lần chèn đơn pending thứ hai hỏng một cách nguyên tử, kể cả khi hai yêu cầu chạy đua.</p>'],
    tn: [tn('partial unique index', 'chỉ mục duy nhất từng phần')],
  }),

  pg({
    csdl: PHONG, tenCsdl: 'booking', ld: { en: pre('room (id PK, name) — 3 rooms\nbooking (id identity PK, room_id → room, who, during tstzrange) — empty'), vi: pre('room (id PK, name) — 3 phòng\nbooking (id identity PK, room_id → room, who, during tstzrange) — rỗng') },
    t: 'No double booking: EXCLUDE with a GiST index', k: 'HARD', p: 14, kn: ['EXCLUDE USING gist', 'range overlap &&', 'int4range trick instead of btree_gist'], tag: ['index', 'gist', 'exclude', 'range'],
    en: '<p>Lab rooms are booked by time range. Add a constraint <code>no_overlap</code> to <code>booking</code> so that two bookings of the <b>same room</b> can never overlap in time, while different rooms may overlap freely. (The usual form <code>room_id WITH =</code> needs the extension btree_gist, which this grader does not have; turn the room id into a one-point range: <code>int4range(room_id, room_id, \'[]\') WITH =</code>.)</p>',
    vi: '<p>Phòng lab được đặt theo khoảng thời gian. Thêm ràng buộc <code>no_overlap</code> cho <code>booking</code> để hai lượt đặt của <b>cùng một phòng</b> không bao giờ chồng lấn thời gian, còn phòng khác nhau thì thoải mái. (Dạng thường <code>room_id WITH =</code> cần extension btree_gist, máy chấm này không có; hãy biến id phòng thành khoảng một điểm: <code>int4range(room_id, room_id, \'[]\') WITH =</code>.)</p>',
    yc: [['<code>ALTER TABLE booking ADD CONSTRAINT no_overlap EXCLUDE USING gist (int4range(room_id, room_id, \'[]\') WITH =, during WITH &amp;&amp;)</code>.', '<code>ALTER TABLE booking ADD CONSTRAINT no_overlap EXCLUDE USING gist (int4range(room_id, room_id, \'[]\') WITH =, during WITH &amp;&amp;)</code>.'], ['Back-to-back bookings ([9:00, 10:00) then [10:00, 11:00)) must be allowed.', 'Đặt nối tiếp ([9:00, 10:00) rồi [10:00, 11:00)) phải được phép.']],
    giai: `ALTER TABLE booking ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    int4range(room_id, room_id, '[]') WITH =,    -- "same room" (a one-point range, so GiST can compare it)
    during WITH &&                               -- "overlapping time"
  );
-- with the btree_gist extension you would simply write: room_id WITH =, during WITH &&`,
    kiem: [
      duoc(['Back-to-back bookings in one room are fine', 'Đặt nối tiếp trong một phòng thì được'], "INSERT INTO booking (room_id, who, during) VALUES (1, 'An', '[2026-11-02 09:00+07, 2026-11-02 10:00+07)'), (1, 'Bình', '[2026-11-02 10:00+07, 2026-11-02 11:00+07)')"),
      chan(['An overlap in the same room is rejected', 'Chồng lấn trong cùng phòng bị chặn'], "INSERT INTO booking (room_id, who, during) VALUES (1, 'An', '[2026-11-02 09:00+07, 2026-11-02 10:00+07)'), (1, 'Chi', '[2026-11-02 09:30+07, 2026-11-02 10:30+07)')", '23P01'),
      duoc(['The same time in another room is fine', 'Cùng giờ ở phòng khác thì được'], "INSERT INTO booking (room_id, who, during) VALUES (1, 'An', '[2026-11-02 09:00+07, 2026-11-02 10:00+07)'), (2, 'Chi', '[2026-11-02 09:30+07, 2026-11-02 10:30+07)')"),
      chan(['A booking inside another one is rejected', 'Lượt đặt nằm trong lượt khác bị chặn'], "INSERT INTO booking (room_id, who, during) VALUES (3, 'An', '[2026-11-02 08:00+07, 2026-11-02 12:00+07)'), (3, 'Dũng', '[2026-11-02 10:00+07, 2026-11-02 10:15+07)')", '23P01', { an: true }),
      sau(['The constraint is called no_overlap', 'Ràng buộc tên no_overlap'], "SELECT conname, contype FROM pg_constraint WHERE conrelid = 'booking'::regclass AND contype = 'x'", { an: true }),
    ],
    sai: ['ALTER TABLE booking ADD CONSTRAINT no_overlap EXCLUDE USING gist (during WITH &&)', "ALTER TABLE booking ADD CONSTRAINT no_overlap UNIQUE (room_id, during)"],
    gy: [['EXCLUDE (a WITH op1, b WITH op2) rejects a row if ANY existing row makes all the operators true.', 'EXCLUDE (a WITH op1, b WITH op2) chặn một dòng nếu CÓ dòng cũ nào làm mọi toán tử đều đúng.'], ['Half-open ranges [start, end) touch without overlapping.', 'Khoảng nửa mở [đầu, cuối) chạm nhau mà không chồng lấn.']],
    lhg: [['Only <code>during WITH &amp;&amp;</code>: two different rooms can no longer be booked at the same time.', 'Chỉ <code>during WITH &amp;&amp;</code>: hai phòng khác nhau không còn đặt cùng giờ được.'], ['UNIQUE (room_id, during): only blocks the exact same range — 9:30–10:30 slips past 9:00–10:00.', 'UNIQUE (room_id, during): chỉ chặn khoảng giống hệt — 9:30–10:30 lọt qua 9:00–10:00.']],
    gt: ['<p>An exclusion constraint generalizes UNIQUE from "equal" to any operator — here "same room AND overlapping time". It is backed by a GiST index and, like UNIQUE, is safe under concurrent inserts. Checking overlaps in the application cannot be made race-free without locks.</p>', '<p>Ràng buộc loại trừ tổng quát hoá UNIQUE từ "bằng nhau" sang toán tử bất kỳ — ở đây là "cùng phòng VÀ chồng lấn thời gian". Nó dựa trên một chỉ mục GiST và, như UNIQUE, an toàn khi chèn đồng thời. Kiểm chồng lấn ở ứng dụng không thể không có kẽ hở nếu thiếu khoá.</p>'],
    tn: [tn('EXCLUDE constraint', 'ràng buộc loại trừ'), tn('GiST', 'chỉ mục cây tìm kiếm tổng quát'), tn('tstzrange', 'khoảng thời gian có múi giờ')],
  }),

  cs({
    t: 'One index type per question', k: 'MEDIUM', p: 6, loai: 'table', kn: ['B-tree', 'GIN', 'BRIN', 'GiST', 'Hash'], tag: ['index', 'concepts'],
    en: '<p>Pick the index type that fits each need best.</p>', vi: '<p>Chọn loại chỉ mục hợp nhất cho từng nhu cầu.</p>',
    bang: [bang1('b1', ['Need → index type', 'Nhu cầu → loại chỉ mục'], [{ ma: 'nc', ten: 'Need / Nhu cầu' }, { ma: 'loai', ten: 'Type', luaChon: LOAI }], [
      { o: { nc: 'orders of a customer, sorted by date / đơn của một khách, sắp theo ngày' }, a: { loai: 'B-tree' } },
      { o: { nc: 'products whose tags array contains \'sale\' / sản phẩm có mảng tags chứa \'sale\'' }, a: { loai: 'GIN' } },
      { o: { nc: '2 billion log rows, queried by time range, inserted in time order / 2 tỉ dòng log, truy vấn theo khoảng thời gian, chèn theo thứ tự thời gian' }, a: { loai: 'BRIN' } },
      { o: { nc: 'no two reservations of a room overlap / không hai lượt đặt phòng nào chồng lấn' }, a: { loai: 'GiST' } },
      { o: { nc: 'full-text search on article bodies (tsvector) / tìm kiếm toàn văn (tsvector)' }, a: { loai: 'GIN' } },
    ], ['B-tree: equality, ranges, sorting. GIN: "contains" on composite values (jsonb, arrays, tsvector). BRIN: huge tables physically ordered by the column. GiST: geometric/range operators such as overlap, used by EXCLUDE. Hash: equality only, rarely better than B-tree.', 'B-tree: so bằng, khoảng, sắp xếp. GIN: "chứa" trên giá trị tổ hợp (jsonb, mảng, tsvector). BRIN: bảng khổng lồ có thứ tự vật lý theo cột. GiST: toán tử hình học/khoảng như chồng lấn, dùng cho EXCLUDE. Hash: chỉ so bằng, hiếm khi hơn B-tree.'])],
    gy: [['Ask what OPERATOR the query uses: =, &lt;, @&gt;, &amp;&amp; …', 'Hỏi truy vấn dùng TOÁN TỬ nào: =, &lt;, @&gt;, &amp;&amp; …'], ['The operator decides the index type.', 'Toán tử quyết định loại chỉ mục.']],
    lhg: [['Using B-tree for everything, including jsonb containment.', 'Dùng B-tree cho mọi thứ, kể cả phép chứa jsonb.'], ['BRIN on data that is not physically ordered.', 'BRIN trên dữ liệu không có thứ tự vật lý.']],
    tn: [tn('operator class', 'lớp toán tử')],
  }),
]);
