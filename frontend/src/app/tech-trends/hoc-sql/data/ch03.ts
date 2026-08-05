import type { Chapter } from './types';

/**
 * Chương 3 — WHERE và so khớp mẫu.
 *
 * Nửa đầu chương là cú pháp, học rất nhanh. Nửa sau là logic ba trị (true /
 * false / unknown) — phần khiến câu query trả về rỗng mà KHÔNG báo lỗi, nên
 * người học không có cách nào tự phát hiện. Đó mới là lý do chương này tồn tại.
 */
export const CH03: Chapter = {
  no: 3,
  slug: 'where-loc-du-lieu',
  title: 'WHERE — lọc dữ liệu & so khớp mẫu',
  icon: '🎯',
  tagline: 'Cú pháp học trong 10 phút; cái bẫy NULL thì lấy của người ta cả buổi debug',
  minutes: 45,
  goals: [
    'Dùng thành thạo AND / OR / NOT / IN / BETWEEN và biết thứ tự ưu tiên',
    'So khớp chuỗi bằng LIKE, ILIKE và biết chỗ nào ILIKE làm mất index',
    'Xử lý NULL đúng cách bằng IS NULL, COALESCE',
    'Tránh được bẫy `NOT IN` + NULL — lỗi trả về rỗng mà không báo gì',
    'Chuyển được mọi cách viết tương ứng từ SQL Server',
  ],
  labModuleId: 861,
  labModuleName: 'Filtering & Pattern Matching',
  labCount: 10,
  labPicks: [
    { slug: 'filter-rows-with-where', title: 'Filter Rows with WHERE', vi: 'Lọc dòng bằng WHERE' },
    { slug: 'pattern-matching-with-like', title: 'Pattern Matching with LIKE', vi: 'So khớp mẫu bằng LIKE' },
    { slug: 'find-missing-data-with-is-null', title: 'Find Missing Data with IS NULL', vi: 'Tìm dữ liệu thiếu bằng IS NULL' },
    { slug: 'negate-and-beware-three-valued-logic', title: 'Negate and Beware Three-Valued Logic', vi: 'Phủ định và bẫy logic ba trị' },
  ],
  status: 'full',
  blocks: [
    { kind: 'h', text: 'So sánh cơ bản' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT name, price FROM products WHERE price > 1000000;
SELECT name FROM products WHERE is_active = true;      -- hoặc chỉ: WHERE is_active
SELECT name FROM products WHERE category <> 'phu-kien'; -- <> và != đều được`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'So chuỗi thì phân biệt HOA/thường',
      text:
        'Đã nhắc ở chương 1 nhưng đây là chỗ bạn thực sự vấp: `WHERE name = \'bàn phím\'` sẽ KHÔNG khớp `\'Bàn phím\'`. '
        + 'SQL Server mặc định không phân biệt nên thói quen cũ sẽ hại bạn ở đây.',
    },

    { kind: 'h', text: 'Ghép điều kiện: AND, OR, NOT' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT name FROM products
WHERE price BETWEEN 500000 AND 2000000   -- bao gồm cả hai đầu mút
  AND stock > 0
  AND category IN ('ban-phim', 'chuot', 'tai-nghe');`,
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'AND được ưu tiên hơn OR — luôn đóng ngoặc',
      text:
        '`WHERE a = 1 OR a = 2 AND b = 3` được hiểu là `a = 1 OR (a = 2 AND b = 3)` — gần như chắc chắn không phải ý bạn. '
        + 'Cứ đóng ngoặc cho rõ: `WHERE (a = 1 OR a = 2) AND b = 3`. Lỗi này không báo gì, chỉ trả về sai dữ liệu.',
    },
    {
      kind: 'table',
      head: ['Viết ngắn', 'Tương đương với', 'Ghi chú'],
      rows: [
        ['`x IN (1, 2, 3)`', '`x = 1 OR x = 2 OR x = 3`', 'Rõ hơn hẳn khi danh sách dài'],
        ['`x BETWEEN 10 AND 20`', '`x >= 10 AND x <= 20`', '**Bao gồm cả hai đầu** — hay nhầm ở đây'],
        ['`x NOT BETWEEN 10 AND 20`', '`x < 10 OR x > 20`', ''],
        ['`x IS NULL`', '*(không có cách khác)*', '**Không bao giờ** viết `x = NULL`'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'BETWEEN với ngày giờ là cái bẫy im lặng',
      text:
        '`WHERE created_at BETWEEN \'2026-01-01\' AND \'2026-01-31\'` sẽ **mất toàn bộ đơn hàng ngày 31**, '
        + 'vì `\'2026-01-31\'` được hiểu là `2026-01-31 00:00:00`. '
        + 'Cách đúng: `WHERE created_at >= \'2026-01-01\' AND created_at < \'2026-02-01\'` — nửa mở, nửa đóng.',
    },

    { kind: 'h', text: 'So khớp mẫu: LIKE và ILIKE' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT name FROM products WHERE name LIKE 'Bàn%';   -- bắt đầu bằng "Bàn"
SELECT name FROM products WHERE name LIKE '%phím%'; -- có chứa "phím"
SELECT name FROM products WHERE name LIKE 'B_n%';   -- _ khớp đúng 1 ký tự

SELECT name FROM products WHERE name ILIKE '%PHÍM%'; -- không phân biệt hoa thường`,
    },
    {
      kind: 'table',
      head: ['Ký tự', 'Khớp với'],
      rows: [
        ['`%`', 'Không hoặc nhiều ký tự bất kỳ'],
        ['`_`', 'Đúng một ký tự bất kỳ'],
      ],
    },
    {
      kind: 'mssql',
      text: 'So khớp không phân biệt hoa thường:',
      pg: "WHERE name ILIKE '%phím%'",
      ms: "WHERE name LIKE '%phím%'   -- mặc định đã không phân biệt\n-- hoặc ép rõ: WHERE name COLLATE Latin1_General_CI_AI LIKE '%phim%'",
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'SQL Server có `[abc]`, Postgres thì không',
      text:
        'Cú pháp lớp ký tự `LIKE \'[abc]%\'` là riêng của SQL Server. Bên Postgres dùng biểu thức chính quy: '
        + '`WHERE name ~ \'^[abc]\'` (phân biệt hoa thường) hoặc `~*` (không phân biệt).',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Chuẩn bị trước cho chương 9',
      text:
        '`LIKE \'Bàn%\'` (ký tự đại diện ở CUỐI) vẫn dùng được index. '
        + '`LIKE \'%phím%\'` (đại diện ở ĐẦU) thì **không** — buộc phải quét toàn bảng. '
        + 'Đó là lý do ô tìm kiếm "chứa từ khoá" của web trở nên chậm dần theo thời gian. '
        + 'Cách chữa dùng `pg_trgm` hoặc full-text search, ở chương 11.',
    },

    { kind: 'h', text: 'NULL — nơi logic hai trị sụp đổ' },
    {
      kind: 'p',
      text:
        'SQL không dùng logic đúng/sai. Nó dùng **logic ba trị**: `TRUE`, `FALSE`, và `UNKNOWN`. '
        + 'Bất cứ phép so sánh nào có NULL tham gia đều cho ra `UNKNOWN`, và `WHERE` chỉ giữ lại dòng cho ra `TRUE`. '
        + 'Bấm thử từng biểu thức:',
    },
    {
      kind: 'widget',
      name: 'null-lab',
      title: 'Logic ba trị trong thực tế',
      hint: 'Bấm từng dòng để xem kết quả thật và lời giải thích.',
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Cái bẫy đắt nhất: NOT IN gặp NULL',
      text:
        'Nếu danh sách bên trong `NOT IN` có dù chỉ MỘT giá trị NULL, cả câu query trả về **rỗng** — '
        + 'không báo lỗi, không cảnh báo. Vì `x NOT IN (1, NULL)` nghĩa là `x <> 1 AND x <> NULL`, '
        + 'mà `x <> NULL` luôn là `UNKNOWN`, nên toàn bộ biểu thức không bao giờ là `TRUE`.',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Cùng một ý định, ba cách viết — chỉ hai cách an toàn',
      code: `-- ❌ NGUY HIỂM: nếu có bất kỳ đơn hàng nào customer_id là NULL → trả về RỖNG
SELECT * FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);

-- ✅ AN TOÀN cách 1: loại NULL ra khỏi danh sách
SELECT * FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL);

-- ✅ AN TOÀN cách 2 (nên dùng): NOT EXISTS — miễn nhiễm với NULL
SELECT * FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Quy tắc bỏ túi',
      text: 'Thấy `NOT IN` với truy vấn con thì đổi ngay sang `NOT EXISTS`. Vừa an toàn với NULL, vừa thường nhanh hơn.',
    },

    { kind: 'h', text: 'Thay NULL bằng giá trị khác: COALESCE' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT name,
       COALESCE(description, 'Chưa có mô tả') AS mo_ta,
       COALESCE(discount_price, price)        AS gia_ban_thuc_te
FROM products;`,
    },
    {
      kind: 'p',
      text: '`COALESCE` trả về giá trị đầu tiên khác NULL trong danh sách. Nhận bao nhiêu tham số cũng được.',
    },
    {
      kind: 'mssql',
      text: 'Hàm xử lý NULL:',
      pg: 'COALESCE(a, b)      -- chuẩn ANSI, cả hai hệ đều có\nNULLIF(a, b)',
      ms: 'ISNULL(a, b)        -- riêng SQL Server, chỉ nhận đúng 2 tham số\nCOALESCE(a, b)      -- cũng có, nên dùng cái này cho di động',
    },

    {
      kind: 'quiz',
      q: 'Bảng `orders` có vài dòng `customer_id` là NULL. Bạn chạy `SELECT * FROM customers WHERE id NOT IN (SELECT customer_id FROM orders)`. Kết quả?',
      options: [
        'Trả về đúng những khách chưa có đơn hàng',
        'Trả về RỖNG, không báo lỗi gì',
        'Báo lỗi vì có NULL trong danh sách',
        'Bỏ qua các NULL và chạy bình thường',
      ],
      answer: 1,
      explain:
        '`x NOT IN (…, NULL)` không bao giờ cho TRUE, vì `x <> NULL` là UNKNOWN. '
        + 'Query im lặng trả rỗng — đây là lý do phải đổi sang `NOT EXISTS`.',
    },
    {
      kind: 'quiz',
      q: 'Bạn cần mọi đơn hàng trong tháng 1/2026. Cách nào ĐÚNG?',
      options: [
        "`WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'`",
        "`WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'`",
        "`WHERE created_at LIKE '2026-01%'`",
        "`WHERE created_at = '2026-01'`",
      ],
      answer: 1,
      explain:
        'Cách A mất hết đơn ngày 31 sau 00:00. Cách C ép kiểu ngày thành chuỗi nên mất index và sai múi giờ. '
        + 'Khoảng nửa mở `>= đầu tháng AND < đầu tháng sau` là cách đúng và vẫn dùng được index.',
    },
    {
      kind: 'quiz',
      q: '`WHERE a = 1 OR a = 2 AND b = 3` được database hiểu là gì?',
      options: [
        '`(a = 1 OR a = 2) AND b = 3`',
        '`a = 1 OR (a = 2 AND b = 3)`',
        'Báo lỗi vì thiếu ngoặc',
        'Tuỳ database, không xác định',
      ],
      answer: 1,
      explain: 'AND ưu tiên cao hơn OR, giống như nhân ưu tiên hơn cộng. Luôn đóng ngoặc để khỏi phải nhớ.',
    },
    {
      kind: 'try',
      text:
        'Bài `Negate and Beware Three-Valued Logic` bên Code Lab dựng đúng cái bẫy NOT IN vừa học. '
        + 'Làm nó khi vừa đọc xong phần này thì sẽ nhớ rất lâu.',
    },
  ],
  flash: [
    { q: 'Vì sao `NOT IN` với truy vấn con là nguy hiểm?', a: 'Chỉ cần một NULL trong danh sách là toàn bộ query trả rỗng, không báo lỗi. Dùng `NOT EXISTS` thay thế.' },
    { q: '`BETWEEN` có bao gồm hai đầu mút không?', a: 'Có. Nên với ngày giờ nó cắt mất phần sau 00:00 của ngày cuối — hãy dùng `>= … AND < …`.' },
    { q: 'LIKE nào còn dùng được index?', a: "`LIKE 'abc%'` (đại diện ở cuối) thì được. `LIKE '%abc%'` thì không, phải quét toàn bảng." },
    { q: 'ILIKE là gì, SQL Server có không?', a: 'So khớp không phân biệt hoa thường. SQL Server không có vì mặc định đã không phân biệt.' },
    { q: 'AND hay OR được ưu tiên trước?', a: 'AND. `a OR b AND c` = `a OR (b AND c)`. Luôn đóng ngoặc.' },
    { q: 'ISNULL(a,b) của SQL Server tương đương gì?', a: '`COALESCE(a, b)` — chuẩn ANSI, nhận nhiều tham số, cả hai hệ đều hỗ trợ.' },
  ],
};
