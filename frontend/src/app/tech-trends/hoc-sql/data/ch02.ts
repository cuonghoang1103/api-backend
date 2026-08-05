import type { Chapter } from './types';

/**
 * Chương 2 — SELECT / ORDER BY / LIMIT.
 *
 * Trục chính của chương không phải cú pháp (cú pháp ở đây rất ít) mà là THỨ TỰ
 * THỰC THI. Gần như mọi câu hỏi kiểu "vì sao alias này báo lỗi ở WHERE mà chạy
 * được ở ORDER BY" đều tan biến khi người học nhìn thấy thứ tự đó một lần.
 * Widget `query-sim` đặt ngay đầu chương chính vì lý do đó.
 */
export const CH02: Chapter = {
  no: 2,
  slug: 'select-order-by-limit',
  title: 'SELECT, ORDER BY & LIMIT',
  icon: '🔍',
  tagline: 'Câu SQL không chạy từ trên xuống — biết thứ tự thật là hết bối rối',
  minutes: 40,
  goals: [
    'Đọc được thứ tự thực thi thật của một câu SELECT',
    'Giải thích được vì sao alias dùng được ở ORDER BY nhưng không dùng được ở WHERE',
    'Sắp xếp nhiều cột, điều khiển chỗ NULL rơi vào',
    'Phân trang bằng LIMIT/OFFSET và biết vì sao trang thứ 1000 chậm',
    'Chuyển được mọi câu TOP/OFFSET-FETCH của SQL Server sang Postgres',
  ],
  labModuleId: 860,
  labModuleName: 'Querying Data: SELECT, ORDER BY, LIMIT',
  labCount: 10,
  labPicks: [
    { slug: 'sort-results-with-order-by', title: 'Sort Results with ORDER BY', vi: 'Sắp xếp kết quả bằng ORDER BY' },
    { slug: 'sort-by-multiple-columns', title: 'Sort by Multiple Columns', vi: 'Sắp xếp theo nhiều cột' },
    { slug: 'control-where-nulls-sort', title: 'Control Where NULLs Sort', vi: 'Điều khiển chỗ NULL rơi vào' },
    { slug: 'one-row-per-group-with-distinct-on', title: 'One Row Per Group with DISTINCT ON', vi: 'Mỗi nhóm một dòng bằng DISTINCT ON' },
  ],
  status: 'full',
  blocks: [
    {
      kind: 'p',
      text:
        'Người mới đọc câu SQL từ trên xuống dưới, và tin rằng nó chạy theo đúng thứ tự đó. '
        + 'Nó không chạy như vậy. Hiểu sai điểm này sinh ra một loạt lỗi trông rất vô lý — '
        + 'nên ta xử lý nó ngay từ đầu chương.',
    },

    {
      kind: 'figure',
      name: 'select-anatomy',
      title: 'Giải phẫu một câu SELECT',
      caption: 'Sáu mệnh đề, mỗi cái một nhiệm vụ. Con số bên trái là THỨ TỰ CHẠY, không phải thứ tự viết.',
    },

    { kind: 'h', text: 'Thứ tự thực thi thật' },
    {
      kind: 'p',
      text:
        'Bạn **viết** theo thứ tự này: `SELECT` → `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `ORDER BY` → `LIMIT`. '
        + 'Nhưng database **chạy** theo thứ tự khác hẳn. Bấm nút chạy từng bước để xem dữ liệu biến đổi qua từng chặng:',
    },
    {
      kind: 'widget',
      name: 'query-sim',
      title: 'Chạy thử một câu SELECT từng bước',
      hint: 'Chọn một câu query ở trên, rồi bấm "Bước tiếp" để xem bảng thu hẹp dần qua từng mệnh đề.',
    },
    {
      kind: 'table',
      caption: 'Thứ tự thực thi logic — học thuộc bảng này là hết bối rối',
      head: ['#', 'Mệnh đề', 'Làm gì', 'Đã "thấy" alias của SELECT chưa?'],
      rows: [
        ['1', '`FROM` / `JOIN`', 'Lấy dữ liệu ra, ghép bảng lại', '❌ Chưa'],
        ['2', '`WHERE`', 'Bỏ bớt DÒNG không thoả điều kiện', '❌ Chưa'],
        ['3', '`GROUP BY`', 'Gom các dòng còn lại thành nhóm', '❌ Chưa'],
        ['4', '`HAVING`', 'Bỏ bớt NHÓM không thoả điều kiện', '❌ Chưa'],
        ['5', '`SELECT`', 'Tính các cột kết quả, đặt alias', '✅ Đang tạo ra'],
        ['6', '`DISTINCT`', 'Bỏ dòng kết quả trùng nhau', '✅ Rồi'],
        ['7', '`ORDER BY`', 'Sắp xếp kết quả', '✅ Rồi'],
        ['8', '`LIMIT` / `OFFSET`', 'Cắt lấy một phần', '✅ Rồi'],
      ],
    },
    {
      kind: 'figure',
      name: 'exec-order',
      title: 'Đường ống thực thi — dữ liệu hẹp dần qua từng chặng',
      caption: 'Bắt đầu bằng 1.200 dòng thô, kết thúc bằng 20 dòng trả về. Mỗi chặng cắt bớt một ít.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Bảng trên giải thích được ba câu hỏi hay gặp nhất',
      text:
        '**(1)** Vì sao alias báo lỗi ở `WHERE`? Vì `WHERE` chạy TRƯỚC `SELECT`, lúc đó alias chưa tồn tại. '
        + '**(2)** Vì sao alias lại dùng được ở `ORDER BY`? Vì `ORDER BY` chạy SAU `SELECT`. '
        + '**(3)** Vì sao lọc theo hàm tổng hợp (`COUNT`, `SUM`) phải dùng `HAVING` chứ không phải `WHERE`? '
        + 'Vì `WHERE` chạy trước khi nhóm được tạo ra, nên chưa có gì để đếm.',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Cùng một alias — một chỗ lỗi, một chỗ chạy',
      code: `SELECT price * 0.9 AS gia_km
FROM products
WHERE gia_km < 1000000;     -- ❌ LỖI: column "gia_km" does not exist

SELECT price * 0.9 AS gia_km
FROM products
ORDER BY gia_km DESC;       -- ✅ CHẠY ĐƯỢC`,
    },
    {
      kind: 'p',
      text: 'Muốn lọc theo biểu thức đó thì viết lại nguyên biểu thức trong `WHERE`, hoặc bọc bằng một truy vấn con (chương 6):',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT price * 0.9 AS gia_km
FROM products
WHERE price * 0.9 < 1000000;`,
    },

    { kind: 'h', text: 'Đặt tên lại cột — alias' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT
  name          AS ten_san_pham,
  price         AS gia,
  price * 0.9   AS gia_sau_giam,
  stock > 0     AS con_hang
FROM products;`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Alias có dấu cách hoặc chữ hoa phải bọc nháy KÉP',
      text:
        '`AS "Giá bán"` — nháy kép là để đặt tên định danh. Nháy ĐƠN `\'…\'` là để viết chuỗi văn bản. '
        + 'Nhầm hai loại nháy này là lỗi cú pháp phổ biến nhất khi mới học. '
        + 'Bên SQL Server bạn quen viết `[Giá bán]` với ngoặc vuông — Postgres không hiểu ngoặc vuông theo nghĩa đó.',
    },

    { kind: 'h', text: 'ORDER BY — sắp xếp' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT name, price, stock
FROM products
ORDER BY price DESC,       -- giá giảm dần
         name ASC;         -- giá bằng nhau thì xếp theo tên A→Z`,
    },
    {
      kind: 'p',
      text:
        '`ASC` (tăng dần) là mặc định nên thường bỏ đi. Sắp theo nhiều cột nghĩa là: '
        + 'cột sau chỉ được dùng khi cột trước bằng nhau.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'NULL rơi vào đâu?',
      text:
        'Trong PostgreSQL, mặc định `NULL` được coi là LỚN NHẤT: `ASC` thì NULL nằm cuối, `DESC` thì NULL nằm đầu. '
        + 'SQL Server làm ngược lại — coi NULL là nhỏ nhất. Đây là khác biệt hay khiến báo cáo trông "lệch" khi đổi hệ. '
        + 'Muốn chắc chắn thì nói rõ ra: `ORDER BY price DESC NULLS LAST`.',
    },
    {
      kind: 'mssql',
      text: 'Điều khiển vị trí NULL khi sắp xếp:',
      pg: 'ORDER BY price DESC NULLS LAST',
      ms: 'ORDER BY CASE WHEN price IS NULL THEN 1 ELSE 0 END, price DESC',
    },

    { kind: 'h', text: 'LIMIT & OFFSET — phân trang' },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Trang 3, mỗi trang 20 dòng',
      code: `SELECT name, price
FROM products
ORDER BY id
LIMIT 20 OFFSET 40;`,
    },
    {
      kind: 'mssql',
      text:
        'Đây là khác biệt cú pháp gây vấp nhiều nhất khi từ trường ra làm web. Ba cách viết cho cùng một việc:',
      pg: 'SELECT ... ORDER BY id LIMIT 20 OFFSET 40;',
      ms: 'SELECT TOP 20 ... ;  -- lấy 20 dòng đầu\nSELECT ... ORDER BY id OFFSET 40 ROWS FETCH NEXT 20 ROWS ONLY;  -- phân trang',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Postgres cũng hiểu cú pháp chuẩn ANSI',
      text:
        '`OFFSET 40 ROWS FETCH NEXT 20 ROWS ONLY` chạy được trên PostgreSQL. '
        + 'Nhưng người ta hầu như luôn viết `LIMIT … OFFSET …` vì ngắn hơn. Biết cả hai để đọc code người khác.',
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'ORDER BY là bắt buộc khi phân trang',
      text:
        'Không có `ORDER BY` thì thứ tự dòng trả về **không được bảo đảm** — Postgres có quyền trả theo thứ tự nào tiện nhất. '
        + 'Hệ quả: trang 1 và trang 2 có thể lặp dòng hoặc bỏ sót dòng, và bug này chỉ lộ ra khi dữ liệu đủ lớn.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Vì sao trang 1000 chậm hơn trang 1 rất nhiều',
      text:
        '`OFFSET 20000` không phải phép nhảy. Database vẫn phải lấy ra 20.020 dòng, sắp xếp, rồi **vứt đi 20.000 dòng đầu**. '
        + 'Càng sang trang sau càng chậm. Cách chữa là phân trang theo con trỏ (keyset pagination): '
        + '`WHERE id > <id cuối của trang trước> ORDER BY id LIMIT 20` — luôn nhanh như nhau ở mọi trang. Chương 15 nói kỹ.',
    },

    { kind: 'h', text: 'DISTINCT và DISTINCT ON' },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- Danh sách danh mục, mỗi tên một lần
SELECT DISTINCT category FROM products;

-- DISTINCT ON: mỗi danh mục lấy đúng MỘT dòng — dòng đắt nhất
SELECT DISTINCT ON (category)
       category, name, price
FROM products
ORDER BY category, price DESC;`,
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'DISTINCT ON là đặc sản của PostgreSQL',
      text:
        'SQL Server không có. Bên đó phải viết dài hơn bằng `ROW_NUMBER() OVER (PARTITION BY …)` rồi lọc `= 1` (chương 8). '
        + 'Quy tắc dùng: cột trong `DISTINCT ON (...)` phải là các cột đầu tiên của `ORDER BY`.',
    },

    {
      kind: 'quiz',
      q: 'Câu nào chạy được?',
      options: [
        '`SELECT price*2 AS gia FROM p WHERE gia > 100`',
        '`SELECT price*2 AS gia FROM p ORDER BY gia`',
        'Cả hai đều chạy',
        'Cả hai đều lỗi',
      ],
      answer: 1,
      explain:
        '`WHERE` chạy TRƯỚC `SELECT` nên chưa biết alias `gia`. `ORDER BY` chạy SAU `SELECT` nên dùng được. '
        + 'Nhớ lại bảng thứ tự thực thi ở đầu chương.',
    },
    {
      kind: 'quiz',
      q: 'Bạn phân trang bằng `LIMIT 20 OFFSET 20` nhưng KHÔNG có `ORDER BY`. Rủi ro là gì?',
      options: [
        'Câu lệnh báo lỗi',
        'Luôn chạy đúng, chỉ chậm hơn một chút',
        'Thứ tự không bảo đảm — trang 2 có thể lặp lại hoặc bỏ sót dòng của trang 1',
        'Postgres tự thêm ORDER BY theo khoá chính',
      ],
      answer: 2,
      explain:
        'Không có ORDER BY thì thứ tự là tuỳ database. Khi kế hoạch truy vấn đổi (dữ liệu lớn lên, có index mới), '
        + 'thứ tự đổi theo và trang bị lặp/sót. Đây là bug rất khó tái hiện ở môi trường dev.',
    },
    {
      kind: 'quiz',
      q: 'Bên SQL Server bạn viết `SELECT TOP 10 * FROM products ORDER BY price DESC`. Viết lại cho PostgreSQL:',
      options: [
        '`SELECT TOP 10 * FROM products ORDER BY price DESC`',
        '`SELECT * FROM products ORDER BY price DESC LIMIT 10`',
        '`SELECT * FROM products LIMIT 10 ORDER BY price DESC`',
        '`SELECT FIRST 10 * FROM products ORDER BY price DESC`',
      ],
      answer: 1,
      explain:
        'Postgres không có `TOP`. Dùng `LIMIT`, và `LIMIT` luôn đứng CUỐI câu, sau `ORDER BY`.',
    },
    {
      kind: 'try',
      text:
        'Bốn bài Code Lab gợi ý bên dưới đi đúng mạch chương này, trong đó bài `DISTINCT ON` là bài khó — '
        + 'làm được nó nghĩa là bạn đã hiểu chắc quan hệ giữa ORDER BY và DISTINCT ON.',
    },
  ],
  flash: [
    { q: 'Thứ tự thực thi thật của SELECT?', a: 'FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.' },
    { q: 'Vì sao alias lỗi ở WHERE nhưng chạy ở ORDER BY?', a: 'WHERE chạy trước SELECT (alias chưa tồn tại); ORDER BY chạy sau SELECT.' },
    { q: 'NULL sắp xếp ở đâu trong Postgres?', a: 'Được coi là LỚN NHẤT: ASC thì cuối, DESC thì đầu. SQL Server thì ngược lại. Nói rõ bằng NULLS FIRST/LAST.' },
    { q: '`TOP 10` của SQL Server viết lại thế nào?', a: '`LIMIT 10`, đặt ở cuối câu sau ORDER BY.' },
    { q: 'Vì sao OFFSET lớn thì chậm?', a: 'Database vẫn phải lấy và sắp xếp đủ OFFSET+LIMIT dòng rồi vứt phần đầu đi. Chữa bằng keyset pagination (WHERE id > …).' },
    { q: '`DISTINCT ON (category)` làm gì?', a: 'Mỗi giá trị category lấy đúng một dòng — dòng đầu tiên theo ORDER BY. Là đặc sản Postgres, SQL Server không có.' },
  ],
};
