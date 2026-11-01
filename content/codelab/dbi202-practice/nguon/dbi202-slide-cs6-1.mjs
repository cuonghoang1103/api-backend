/**
 * DBI202 · ⭐ CS.6 phần 1 — từ yêu cầu tới bảng, khoá tự nhiên vs khoá thay thế (IDENTITY/SEQUENCE/UUID v4–v7), quy ước đặt tên,
 * kiểu cho tiền / múi giờ / tiếng Việt, xoá mềm (slide 1–12). Đề xoá mềm chấm trong trình duyệt.
 */
import { mod, de, cs, q, bang1, chan, duoc, ma, YC_DDL, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs6-1', '⭐ CS.6 Real-world design (1): requirements, keys, types, soft delete', [
  cs({
    t: 'Read the brief: entity, relationship or constraint?', k: 'EASY', p: 6, loai: 'table',
    kn: ['requirements analysis', 'entity', 'relationship', 'constraint'], tag: ['advanced', 'design'],
    en: '<p>Slides 2–3. Each sentence of a clinic brief becomes one design element. Classify it.</p>', vi: '<p>Slide 2–3. Mỗi câu trong bản mô tả phòng khám thành một thành phần thiết kế. Phân loại nó.</p>',
    bang: [bang1('b1', ['Sentence → element', 'Câu → thành phần'],
      [{ ma: 'cau', ten: 'Sentence / Câu' }, { ma: 'tp', ten: 'Element', luaChon: ['entity (a table)', 'relationship (a foreign key or a link table)', 'constraint (CHECK / UNIQUE / NOT NULL)', 'attribute (a column)'] }],
      [{ o: { cau: 'The clinic keeps a record of every patient.' }, a: { tp: 'entity (a table)' } },
        { o: { cau: 'Each appointment is with exactly one doctor.' }, a: { tp: 'relationship (a foreign key or a link table)' } },
        { o: { cau: 'A doctor cannot have two appointments starting at the same time.' }, a: { tp: 'constraint (CHECK / UNIQUE / NOT NULL)' } },
        { o: { cau: 'We need each patient\'s phone number.' }, a: { tp: 'attribute (a column)' } },
        { o: { cau: 'A prescription may contain many medicines, each with its own dosage.' }, a: { tp: 'relationship (a foreign key or a link table)' } },
        { o: { cau: 'A visit fee is never negative.' }, a: { tp: 'constraint (CHECK / UNIQUE / NOT NULL)' } }],
      ['Nouns that are tracked on their own ⇒ tables; "each/exactly one/many" ⇒ relationships (many-to-many with attributes ⇒ a link table); "cannot/never/must" ⇒ constraints.', 'Danh từ được theo dõi riêng ⇒ bảng; "mỗi/đúng một/nhiều" ⇒ quan hệ (nhiều-nhiều có thuộc tính ⇒ bảng nối); "không được/không bao giờ/phải" ⇒ ràng buộc.'])],
    gy: [['Look for the verbs: "cannot", "must" are rules.', 'Tìm động từ: "không được", "phải" là luật.'], ['"Many … each with its own …" ⇒ a link table with columns.', '"Nhiều … mỗi cái có … riêng" ⇒ bảng nối có cột.']],
    lhg: [['Leaving rules in the application only — they belong in the database too.', 'Chỉ để luật trong ứng dụng — chúng cũng thuộc về CSDL.'], ['Turning every noun into a table (a phone number is an attribute).', 'Biến mọi danh từ thành bảng (số điện thoại là thuộc tính).']],
    tn: [tn('business rule', 'luật nghiệp vụ'), tn('link table', 'bảng nối')],
  }),
  cs({
    t: 'Choose and defend a primary key', k: 'MEDIUM', p: 7,
    kn: ['natural key', 'surrogate key', 'IDENTITY', 'SEQUENCE', 'UUID v4/v7'], tag: ['advanced', 'design', 'keys'],
    en: '<p>Five questions on slides 4–8.</p>', vi: '<p>Năm câu về slide 4–8.</p>',
    cau: [
      q('c1', ['Why not use the customer\'s email as the primary key?', 'Vì sao không dùng email khách hàng làm khoá chính?'], ['it changes, and every foreign key would have to change with it', 'emails cannot be stored in a VARCHAR column', 'a primary key must always be an integer', 'two customers can never share one email'], ['Keys should be stable. Keep email UNIQUE, and use a surrogate id as the PK.', 'Khoá phải ổn định. Giữ email UNIQUE, dùng id thay thế làm khoá chính.']),
      q('c2', ['A random UUID v4 as a clustered key on SQL Server tends to…', 'UUID v4 ngẫu nhiên làm khoá cụm trên SQL Server thường…'], ['insert all over the tree: page splits and fragmentation', 'keep every insert at the end of the index', 'make the table read-only after a million rows', 'need less space than an INT key'], ['UUID v7 (time-ordered) or NEWSEQUENTIALID() keep inserts at the end like an IDENTITY.', 'UUID v7 (theo thời gian) hoặc NEWSEQUENTIALID() giữ việc chèn ở cuối như IDENTITY.']),
      q('c3', ['A SEQUENCE differs from IDENTITY because it…', 'SEQUENCE khác IDENTITY vì nó…'], ['is a separate object that several tables (or the app) can draw numbers from', 'never leaves gaps after a ROLLBACK', 'can only produce numbers in ascending order', 'is stored inside the table definition itself'], ['Both may leave gaps (a rolled-back insert burns a number); never rely on "no gaps".', 'Cả hai đều có thể có khoảng trống (insert bị huỷ đốt mất số); đừng trông vào "không trống".']),
      q('c4', ['A composite primary key is the natural choice for…', 'Khoá chính ghép là lựa chọn tự nhiên cho…'], ['a link table such as Enrollment(studentId, courseId)', 'a Customer table with a name and a birth date', 'any table that has more than ten columns', 'a log table that only ever receives inserts'], ['The pair IS the identity of the fact and prevents duplicates for free.', 'Cặp đó CHÍNH LÀ danh tính của sự kiện và chống trùng miễn phí.']),
      q('c5', ['Why name constraints explicitly (pk_order, fk_order_customer, ck_order_total)?', 'Vì sao đặt tên ràng buộc tường minh (pk_order, fk_order_customer, ck_order_total)?'], ['error messages and migrations then say exactly which rule failed', 'unnamed constraints are not enforced by SQL Server', 'PostgreSQL refuses constraints without a name', 'explicit names make every query run faster'], ['Generated names like CK__Order__total__5EBF139D differ per server and break scripts.', 'Tên tự sinh như CK__Order__total__5EBF139D khác nhau mỗi server và làm hỏng script.']),
    ],
    gy: [['Stable, small, meaningless ⇒ a good surrogate key.', 'Ổn định, nhỏ, không mang nghĩa ⇒ khoá thay thế tốt.'], ['Natural candidates become UNIQUE constraints.', 'Ứng viên tự nhiên thành ràng buộc UNIQUE.']],
    lhg: [['Using a phone number or email as the PK.', 'Dùng số điện thoại hoặc email làm khoá chính.'], ['Using random UUIDs as clustered keys without thinking about inserts.', 'Dùng UUID ngẫu nhiên làm khoá cụm mà không nghĩ tới việc chèn.']],
    tn: [tn('surrogate key', 'khoá thay thế'), tn('natural key', 'khoá tự nhiên')],
  }),
  cs({
    t: 'Money, time zones, Vietnamese text: pick the type', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['DECIMAL for money', 'time zones', 'Unicode'], tag: ['advanced', 'design', 'types'],
    en: '<p>Slides 9–11. Choose the SQL Server type for each column.</p>', vi: '<p>Slide 9–11. Chọn kiểu SQL Server cho từng cột.</p>',
    bang: [bang1('b1', ['Column → type', 'Cột → kiểu'],
      [{ ma: 'cot', ten: 'Column / Cột' }, { ma: 'kieu', ten: 'Type', luaChon: ['DECIMAL(19,0)', 'DECIMAL(5,2)', 'DATETIMEOFFSET', 'DATE', 'NVARCHAR(100)', 'VARCHAR(15)', 'VARCHAR(254)'] }],
      [{ o: { cot: 'order total in VND' }, a: { kieu: 'DECIMAL(19,0)' } },
        { o: { cot: 'discount rate such as 12.50 %' }, a: { kieu: 'DECIMAL(5,2)' } },
        { o: { cot: 'online appointment booked from several countries' }, a: { kieu: 'DATETIMEOFFSET' } },
        { o: { cot: 'date of birth' }, a: { kieu: 'DATE' } },
        { o: { cot: 'customer full name "Lê Thị Ánh Tuyết"' }, a: { kieu: 'NVARCHAR(100)' } },
        { o: { cot: 'phone number "0912 345 678"' }, a: { kieu: 'VARCHAR(15)' } },
        { o: { cot: 'email address' }, a: { kieu: 'VARCHAR(254)' } }],
      ['Never FLOAT for money (0.1 + 0.2 ≠ 0.3). Store instants with an offset (or UTC) when users span time zones. Phone numbers are text: leading zeros and spaces matter, you never add them up. On PostgreSQL: numeric, timestamptz, varchar/text (UTF-8).', 'Không bao giờ FLOAT cho tiền (0.1 + 0.2 ≠ 0.3). Lưu thời điểm kèm độ lệch (hoặc UTC) khi người dùng ở nhiều múi giờ. Số điện thoại là chữ: số 0 đầu và khoảng trắng có nghĩa, không ai cộng chúng. PostgreSQL: numeric, timestamptz, varchar/text (UTF-8).'])],
    gy: [['Will you do arithmetic on it? If not, it is probably text.', 'Có tính toán trên nó không? Không thì nhiều khả năng là chữ.'], ['Exact money ⇒ DECIMAL; VND has no minor unit.', 'Tiền chính xác ⇒ DECIMAL; VND không có đơn vị lẻ.']],
    lhg: [['INT for phone numbers — the leading 0 disappears.', 'INT cho số điện thoại — số 0 đầu biến mất.'], ['VARCHAR for Vietnamese names on SQL Server — "Ánh" becomes "?nh" with a non-UTF-8 collation.', 'VARCHAR cho tên tiếng Việt trên SQL Server — "Ánh" thành "?nh" với collation không UTF-8.']],
    tn: [tn('time zone offset', 'độ lệch múi giờ'), tn('exact numeric', 'số chính xác')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Soft delete without breaking the unique rule', k: 'MEDIUM', p: 10,
    kn: ['soft delete', 'filtered unique index', 'partial unique index'], tag: ['advanced', 'design', 'soft-delete'],
    en: '<p>Slide 12. Products are never really deleted: <code>deletedAt</code> is set instead. A product code must be unique <b>among live products</b>, but a retired code may be reused. Create:</p><ul><li><code>SanPham(id INT PK, maSP VARCHAR(20) NOT NULL, ten VARCHAR(100) NOT NULL, deletedAt DATE NULL)</code>;</li><li>the unique index <code>ux_sanpham_ma_live</code> that enforces the rule.</li></ul>',
    vi: '<p>Slide 12. Sản phẩm không bao giờ bị xoá thật: đặt <code>deletedAt</code> thay thế. Mã sản phẩm phải duy nhất <b>trong các sản phẩm còn sống</b>, nhưng mã đã nghỉ được dùng lại. Tạo:</p><ul><li><code>SanPham(id INT PK, maSP VARCHAR(20) NOT NULL, ten VARCHAR(100) NOT NULL, deletedAt DATE NULL)</code>;</li><li>chỉ mục duy nhất <code>ux_sanpham_ma_live</code> thi hành luật đó.</li></ul>',
    yc: [YC_DDL, ['A UNIQUE constraint on maSP is too strict: use CREATE UNIQUE INDEX … WHERE deletedAt IS NULL (filtered on SQL Server, partial on PostgreSQL — same syntax).', 'UNIQUE trên maSP là quá chặt: dùng CREATE UNIQUE INDEX … WHERE deletedAt IS NULL (filtered trên SQL Server, partial trên PostgreSQL — cùng cú pháp).']],
    giai: `CREATE TABLE SanPham (
    id        INT          NOT NULL CONSTRAINT pk_sanpham PRIMARY KEY,
    maSP      VARCHAR(20)  NOT NULL,
    ten       VARCHAR(100) NOT NULL,
    deletedAt DATE         NULL                 -- NULL = live
);
CREATE UNIQUE INDEX ux_sanpham_ma_live ON SanPham (maSP) WHERE deletedAt IS NULL;   -- unique among live rows only`,
    kiem: [
      duoc(['A retired code can be reused by a new live product', 'Mã đã nghỉ được dùng lại cho sản phẩm mới còn sống'], "INSERT INTO SanPham VALUES (1, 'TET2025', 'Hop qua Tet', '2025-03-01'); INSERT INTO SanPham VALUES (2, 'TET2025', 'Hop qua Tet 2026', NULL)"),
      chan(['Two live products with the same code are refused', 'Hai sản phẩm còn sống cùng mã bị từ chối'], "INSERT INTO SanPham VALUES (1, 'BUT01', 'But bi', NULL); INSERT INTO SanPham VALUES (2, 'BUT01', 'But bi xanh', NULL)", '23505'),
      duoc(['The code may be retired several times', 'Mã được nghỉ nhiều lần'], "INSERT INTO SanPham VALUES (1, 'VO', 'Vo 2023', '2023-12-31'), (2, 'VO', 'Vo 2024', '2024-12-31'), (3, 'VO', 'Vo 2025', NULL)"),
      chan(['The id is still a real primary key', 'id vẫn là khoá chính thật'], "INSERT INTO SanPham VALUES (1, 'A', 'A', NULL); INSERT INTO SanPham VALUES (1, 'B', 'B', NULL)", '23505'),
      ma(['A filtered unique index', 'Chỉ mục duy nhất có lọc'], '\\bCREATE\\s+UNIQUE\\s+INDEX\\b[^;]*\\bWHERE\\b'),
    ],
    sai: [
      'CREATE TABLE SanPham (id INT NOT NULL PRIMARY KEY, maSP VARCHAR(20) NOT NULL UNIQUE, ten VARCHAR(100) NOT NULL, deletedAt DATE NULL);',
      'CREATE TABLE SanPham (id INT NOT NULL PRIMARY KEY, maSP VARCHAR(20) NOT NULL, ten VARCHAR(100) NOT NULL, deletedAt DATE NULL); CREATE UNIQUE INDEX ux_sanpham_ma_live ON SanPham (maSP, deletedAt);',
      'CREATE TABLE SanPham (id INT NOT NULL PRIMARY KEY, maSP VARCHAR(20) NOT NULL, ten VARCHAR(100) NOT NULL, deletedAt DATE NULL); CREATE UNIQUE INDEX ux_sanpham_ma_live ON SanPham (maSP) WHERE deletedAt IS NOT NULL;',
    ],
    gy: [['Only live rows (deletedAt IS NULL) take part in the uniqueness.', 'Chỉ dòng còn sống (deletedAt IS NULL) tham gia luật duy nhất.'], ['Every query of live data must also say WHERE deletedAt IS NULL — a view helps.', 'Mọi truy vấn dữ liệu sống cũng phải ghi WHERE deletedAt IS NULL — một view sẽ giúp.']],
    lhg: [['UNIQUE (maSP): a retired code can never come back.', 'UNIQUE (maSP): mã đã nghỉ không bao giờ quay lại được.'], ['UNIQUE (maSP, deletedAt): NULLs are distinct on PostgreSQL, so two live rows with the same code slip through (and SQL Server allows only one NULL).', 'UNIQUE (maSP, deletedAt): NULL khác nhau trên PostgreSQL nên hai dòng sống cùng mã lọt qua (còn SQL Server chỉ cho một NULL).']],
    gt: ['<p>Soft delete keeps history and makes "undo" easy, but every unique rule and every query must learn about it. The filtered/partial unique index is the standard fix; foreign keys pointing to a soft-deleted row still succeed, which is usually what you want for history.</p>', '<p>Xoá mềm giữ lịch sử và giúp "hoàn tác" dễ, nhưng mọi luật duy nhất và mọi truy vấn phải biết đến nó. Chỉ mục duy nhất filtered/partial là cách sửa chuẩn; khoá ngoại trỏ tới dòng đã xoá mềm vẫn hợp lệ, thường đúng là điều ta muốn cho lịch sử.</p>'],
    tn: [tn('soft delete', 'xoá mềm'), tn('filtered unique index', 'chỉ mục duy nhất có lọc')],
  }),
]);
