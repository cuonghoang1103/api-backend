/** PostgreSQL · 2.2 — Chữ: text, varchar & bẫy char(n). */
import { mod, pg, cs, q, kq, kqAn, sau, chan, duoc, ma, pre, tn } from './_chung.mjs';

const VOUCHER = `CREATE TABLE voucher (
  code      char(8) PRIMARY KEY,
  discount  int NOT NULL
);
INSERT INTO voucher VALUES ('SALE10', 10), ('TET2026', 26), ('VIP', 30);`;

export default mod('postgresql-2-2-text', '2.2 Text: text, varchar & the char(n) trap', [
  cs({
    t: 'Rejects or truncates? Predict before you run', k: 'EASY', p: 5, kn: ['varchar(n)', 'char(n)', 'cast'], tag: ['types', 'text'],
    en: `<p>Table <code>t_vc (code varchar(3))</code>. Predict what PostgreSQL does — every answer was measured in lesson 2.2.</p>`,
    vi: `<p>Bảng <code>t_vc (code varchar(3))</code>. Đoán xem PostgreSQL làm gì — mọi đáp án đều đo thật ở bài 2.2.</p>`,
    cau: [
      q('q1', ['<code>INSERT INTO t_vc VALUES (\'abcdef\');</code>', '<code>INSERT INTO t_vc VALUES (\'abcdef\');</code>'], ['ERROR: value too long for type character varying(3)', 'stores \'abc\' silently', 'stores \'abcdef\'', 'stores NULL'], ['Assigning a too-long value to varchar(n) is an error — PostgreSQL never truncates data you are storing.', 'Gán giá trị quá dài vào varchar(n) là lỗi — PostgreSQL không bao giờ cắt dữ liệu bạn đang lưu.']),
      q('q2', ['<code>SELECT \'abcdef\'::varchar(3);</code>', '<code>SELECT \'abcdef\'::varchar(3);</code>'], ['abc — an explicit cast truncates, by the SQL standard', 'ERROR: value too long', 'abcdef', 'NULL'], ['An explicit cast is a request to convert, so the standard says truncate. This is why "it worked in my SELECT" proves nothing about INSERT.', 'Ép kiểu tường minh là yêu cầu chuyển đổi nên chuẩn SQL bảo cắt. Vì vậy "SELECT chạy được" không chứng minh gì cho INSERT.']),
      q('q3', ['<code>SELECT (\'hi\'::char(5)) || \'|\';</code>', '<code>SELECT (\'hi\'::char(5)) || \'|\';</code>'], ['hi| — trailing spaces of char(n) are dropped when converted to text', 'hi   | (three spaces)', 'ERROR', 'hi'], ['char(n) is stored padded but its trailing spaces are "insignificant": they disappear when the value becomes text (|| converts). length() also ignores them.', 'char(n) lưu có đệm nhưng khoảng trắng cuối là "không đáng kể": chúng biến mất khi giá trị thành text (|| chuyển đổi). length() cũng bỏ qua chúng.']),
      q('q4', ['<code>SELECT length(\'café\'), octet_length(\'café\');</code> in a UTF-8 database', '<code>SELECT length(\'café\'), octet_length(\'café\');</code> trong database UTF-8'], ['4 and 5', '4 and 4', '5 and 5', '5 and 4'], ['length() counts characters; é takes 2 bytes in UTF-8, so octet_length is 5. Vietnamese letters like ộ take 3 bytes.', 'length() đếm ký tự; é tốn 2 byte trong UTF-8 nên octet_length là 5. Chữ Việt như ộ tốn 3 byte.']),
      q('q5', ['Which type does lesson 2.2 recommend for a product name with no natural length limit?', 'Bài 2.2 khuyên kiểu nào cho tên sản phẩm không có giới hạn độ dài tự nhiên?'], ['text (add a CHECK if a real limit exists)', 'char(255)', 'varchar(255) "just in case"', 'varchar without length is slower, so char'], ['In PostgreSQL text and varchar are the same storage and speed. A length limit is a business rule — write it as CHECK (char_length(x) &lt;= n) when there is one.', 'Trong PostgreSQL text và varchar lưu và chạy như nhau. Giới hạn độ dài là luật nghiệp vụ — khi có thì viết CHECK (char_length(x) &lt;= n).']),
    ],
    gy: [['Storing vs casting behave differently.', 'Lưu và ép kiểu hành xử khác nhau.'], ['char(n) pads, text does not.', 'char(n) đệm, text thì không.']],
    lhg: [['Testing a length limit with a SELECT cast and concluding INSERT will truncate too.', 'Thử giới hạn độ dài bằng SELECT ép kiểu rồi kết luận INSERT cũng cắt.'], ['Using char(n) for codes of varying length.', 'Dùng char(n) cho mã có độ dài thay đổi.']],
    tn: [tn('varchar(n)', 'chuỗi có giới hạn n ký tự'), tn('char(n)', 'chuỗi độ dài cố định, đệm khoảng trắng')],
  }),

  pg({
    t: 'Get rid of a char(8) column', k: 'MEDIUM', p: 8, kn: ['ALTER COLUMN … TYPE', 'char(n) padding'], tag: ['types', 'text', 'ddl'],
    csdl: VOUCHER, tenCsdl: 'voucher', ld: { en: pre('voucher (code char(8) PK, discount int) — SALE10, TET2026, VIP'), vi: pre('voucher (code char(8) PK, discount int) — SALE10, TET2026, VIP') },
    en: `<p>The voucher codes were declared <code>char(8)</code>, so they are stored padded with spaces and every export to the mobile app shows <code>"SALE10  "</code>. Change the column to <code>text</code>, keeping the values without padding.</p>`,
    vi: `<p>Mã voucher được khai <code>char(8)</code> nên lưu có đệm khoảng trắng, và mọi lần xuất sang app di động đều hiện <code>"SALE10  "</code>. Đổi cột sang <code>text</code>, giữ giá trị không còn đệm.</p>`,
    yc: [['One <code>ALTER TABLE voucher ALTER COLUMN code TYPE text</code>.', 'Một lệnh <code>ALTER TABLE voucher ALTER COLUMN code TYPE text</code>.'], ['After it, <code>octet_length(code)</code> equals the visible length.', 'Sau đó, <code>octet_length(code)</code> bằng độ dài nhìn thấy.']],
    giai: `ALTER TABLE voucher ALTER COLUMN code TYPE text;   -- char(n) → text drops the trailing padding
-- (USING rtrim(code) would say it explicitly; the cast already does it)`,
    kiem: [
      sau(['Values without padding', 'Giá trị hết đệm'], "SELECT code || '|' AS shown, octet_length(code) AS bytes FROM voucher ORDER BY discount", { thuTu: true }),
      sau(['The column type is text', 'Kiểu cột là text'], "SELECT data_type FROM information_schema.columns WHERE table_name = 'voucher' AND column_name = 'code'"),
      chan(['Still the primary key', 'Vẫn là khoá chính'], "INSERT INTO voucher VALUES ('VIP', 99)", '23505', { an: true }),
    ],
    sai: ['ALTER TABLE voucher ALTER COLUMN code TYPE varchar(8)', "ALTER TABLE voucher ALTER COLUMN code TYPE char(10)"],
    gy: [['<code>ALTER TABLE … ALTER COLUMN … TYPE …</code> rewrites the column.', '<code>ALTER TABLE … ALTER COLUMN … TYPE …</code> viết lại cột.'], ['Casting char(n) to text removes trailing spaces.', 'Ép char(n) sang text bỏ khoảng trắng cuối.']],
    lhg: [['Changing to <code>varchar(8)</code> — padding is gone, but the arbitrary limit of 8 stays.', 'Đổi sang <code>varchar(8)</code> — hết đệm nhưng giới hạn 8 tuỳ tiện vẫn còn.'], ['Widening to <code>char(10)</code> — now every code is padded to 10.', 'Nới thành <code>char(10)</code> — giờ mọi mã bị đệm tới 10.']],
    gt: ['<p>char(n) is almost never what you want: it pads, and the padding leaks into exports and byte counts. Converting to text strips it; the primary key index is rebuilt with the column.</p>', '<p>char(n) hầu như không bao giờ là thứ bạn muốn: nó đệm, và phần đệm rò ra khi xuất dữ liệu hay đếm byte. Chuyển sang text là bỏ được; chỉ mục khoá chính được dựng lại cùng cột.</p>'],
    tn: [tn('ALTER COLUMN … TYPE', 'đổi kiểu cột')],
  }),

  pg({
    t: 'Characters vs bytes in Vietnamese names', k: 'MEDIUM', p: 7, kn: ['length', 'octet_length', 'UTF-8'], tag: ['text', 'ctshop'],
    en: '<p>The SMS gateway charges by <b>bytes</b>, the website by <b>characters</b>. For every customer return <code>id, full_name, chars, bytes, extra</code> where <code>extra = bytes − chars</code> (bytes spent on accents). Order by id.</p>',
    vi: '<p>Cổng SMS tính tiền theo <b>byte</b>, website tính theo <b>ký tự</b>. Với mọi khách trả về <code>id, full_name, chars, bytes, extra</code> trong đó <code>extra = bytes − chars</code> (số byte dành cho dấu). Sắp theo id.</p>',
    yc: [['<code>chars = length(full_name)</code>, <code>bytes = octet_length(full_name)</code>.', '<code>chars = length(full_name)</code>, <code>bytes = octet_length(full_name)</code>.'], ['Columns exactly <code>id, full_name, chars, bytes, extra</code>.', 'Cột đúng <code>id, full_name, chars, bytes, extra</code>.']],
    giai: `SELECT id, full_name,
       length(full_name)                              AS chars,   -- characters
       octet_length(full_name)                        AS bytes,   -- UTF-8 bytes (ơ, ặ … take 2–3)
       octet_length(full_name) - length(full_name)    AS extra
FROM customer
ORDER BY id;`,
    kiem: [
      kq(['Eight customers', 'Tám khách'], { thuTu: true }),
      kqAn(['A name without accents has extra = 0', 'Tên không dấu có extra = 0'], "INSERT INTO customer (email, full_name) VALUES ('kh009@ctshop.vn', 'John Smith')", { thuTu: true }),
      ma(['Uses octet_length', 'Dùng octet_length'], '\\boctet_length\\s*\\('),
    ],
    sai: ['SELECT id, full_name, length(full_name) AS chars, length(full_name) AS bytes, 0 AS extra FROM customer ORDER BY id', 'SELECT id, full_name, char_length(full_name) AS chars, octet_length(full_name) AS bytes, char_length(full_name) - octet_length(full_name) AS extra FROM customer ORDER BY id'],
    gy: [['length() and char_length() count characters; octet_length() counts bytes.', 'length() và char_length() đếm ký tự; octet_length() đếm byte.'], ['extra must be ≥ 0.', 'extra phải ≥ 0.']],
    lhg: [['Assuming one character = one byte — true only for plain ASCII.', 'Cho rằng một ký tự = một byte — chỉ đúng với ASCII trơn.'], ['Subtracting the wrong way round and getting negative numbers.', 'Trừ ngược chiều và ra số âm.']],
    gt: ['<p>The database stores text in UTF-8: ASCII letters take 1 byte, most Vietnamese vowels with diacritics take 2 or 3. Limits that matter for storage or SMS are byte limits; limits users see are character limits.</p>', '<p>CSDL lưu chữ dạng UTF-8: chữ ASCII 1 byte, đa số nguyên âm tiếng Việt có dấu 2–3 byte. Giới hạn về lưu trữ hay SMS là giới hạn byte; giới hạn người dùng thấy là giới hạn ký tự.</p>'],
    tn: [tn('UTF-8', 'mã hoá ký tự nhiều byte')],
  }),

  pg({
    t: 'A newsletter table that keeps emails clean', k: 'HARD', p: 12, kn: ['text + CHECK', 'lower/btrim in CHECK', 'char_length'], tag: ['text', 'ddl', 'check', 'ctshop'],
    en: '<p>Create table <code>newsletter</code> for CT Shop: <code>email</code> (primary key), <code>customer_id</code> (optional, → customer), <code>subscribed_at</code> (timestamptz, default now()). The <b>database</b> must refuse an email that is not already lower-case and trimmed, and any email longer than 254 characters. Use <code>text</code>, not varchar.</p>',
    vi: '<p>Tạo bảng <code>newsletter</code> cho CT Shop: <code>email</code> (khoá chính), <code>customer_id</code> (không bắt buộc, → customer), <code>subscribed_at</code> (timestamptz, mặc định now()). <b>CSDL</b> phải từ chối email chưa viết thường và chưa cắt khoảng trắng, và email dài hơn 254 ký tự. Dùng <code>text</code>, không dùng varchar.</p>',
    yc: [['<code>email text PRIMARY KEY CHECK (email = lower(btrim(email)) AND char_length(email) &lt;= 254)</code> (one or two CHECKs).', '<code>email text PRIMARY KEY CHECK (email = lower(btrim(email)) AND char_length(email) &lt;= 254)</code> (một hay hai CHECK).'], ['<code>customer_id bigint REFERENCES customer(id)</code>, nullable.', '<code>customer_id bigint REFERENCES customer(id)</code>, cho phép NULL.']],
    giai: `CREATE TABLE newsletter (
  email          text PRIMARY KEY
                 CHECK (email = lower(btrim(email)))      -- no 'An@X.vn', no ' an@x.vn'
                 CHECK (char_length(email) <= 254),       -- the limit is a rule, so it is a CHECK
  customer_id    bigint REFERENCES customer(id),
  subscribed_at  timestamptz NOT NULL DEFAULT now()
);`,
    kiem: [
      duoc(['A clean email with a customer is accepted', 'Email sạch kèm khách được nhận'], "INSERT INTO newsletter (email, customer_id) VALUES ('kh001@ctshop.vn', 1)"),
      chan(['Upper-case letters are refused', 'Chữ hoa bị từ chối'], "INSERT INTO newsletter (email) VALUES ('Guest@Mail.vn')", '23514'),
      chan(['A leading space is refused', 'Khoảng trắng đầu bị từ chối'], "INSERT INTO newsletter (email) VALUES (' guest@mail.vn')", '23514'),
      chan(['255 characters is refused', '255 ký tự bị từ chối'], "INSERT INTO newsletter (email) VALUES (repeat('a', 247) || '@mail.vn')", '23514', { an: true }),
      duoc(['Exactly 254 characters is fine', 'Đúng 254 ký tự thì được'], "INSERT INTO newsletter (email) VALUES (repeat('a', 246) || '@mail.vn')", { an: true }),
      chan(['Unknown customer is refused', 'Khách không tồn tại bị từ chối'], "INSERT INTO newsletter (email, customer_id) VALUES ('x@mail.vn', 999)", '23503', { an: true }),
      sau(['email is text', 'email có kiểu text'], "SELECT data_type FROM information_schema.columns WHERE table_name = 'newsletter' AND column_name = 'email'", { an: true }),
    ],
    sai: [
      'CREATE TABLE newsletter (email varchar(254) PRIMARY KEY CHECK (email = lower(btrim(email))), customer_id bigint REFERENCES customer(id), subscribed_at timestamptz NOT NULL DEFAULT now())',
      'CREATE TABLE newsletter (email text PRIMARY KEY CHECK (email = lower(email)) CHECK (char_length(email) <= 254), customer_id bigint REFERENCES customer(id), subscribed_at timestamptz NOT NULL DEFAULT now())',
    ],
    gy: [['A CHECK can compare a column with a function of itself: <code>email = lower(btrim(email))</code>.', 'CHECK so được cột với một hàm của chính nó: <code>email = lower(btrim(email))</code>.'], ['Length rule: <code>char_length(email) &lt;= 254</code>.', 'Luật độ dài: <code>char_length(email) &lt;= 254</code>.']],
    lhg: [['Only <code>lower(email)</code>: a leading space slips in and later a "duplicate" subscriber appears.', 'Chỉ <code>lower(email)</code>: khoảng trắng đầu lọt vào và sau đó xuất hiện người đăng ký "trùng".'], ['Using varchar(254): it works, but the lesson\'s rule is text + an explicit CHECK, which you can change without rewriting the table.', 'Dùng varchar(254): chạy được, nhưng luật của bài là text + CHECK tường minh, đổi được mà không phải viết lại bảng.']],
    gt: ['<p>Rules about text belong in CHECK constraints next to a plain <code>text</code> column: they are visible, named, and enforced for every client. Normalizing at the door means the PRIMARY KEY really catches duplicates.</p>', '<p>Luật về chữ nên nằm trong CHECK cạnh một cột <code>text</code> trơn: dễ thấy, có tên, áp cho mọi client. Chuẩn hoá ngay từ cửa thì KHOÁ CHÍNH mới thật sự bắt được trùng lặp.</p>'],
    tn: [tn('btrim', 'cắt khoảng trắng hai đầu'), tn('char_length', 'số ký tự')],
  }),
]);
