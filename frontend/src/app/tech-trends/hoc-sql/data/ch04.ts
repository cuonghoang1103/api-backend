import type { Chapter } from './types';

/**
 * Chương 4 — GROUP BY.
 *
 * Hai hiểu lầm được nhắm thẳng: (1) COUNT(*) và COUNT(cột) không giống nhau
 * khi có NULL — sai số này lặng lẽ đi vào báo cáo; (2) WHERE và HAVING lọc ở
 * hai thời điểm khác nhau, và cái sai không báo lỗi mà chỉ ra số liệu lệch.
 */
export const CH04: Chapter = {
  no: 4,
  slug: 'group-by-tong-hop',
  title: 'GROUP BY & các hàm tổng hợp',
  icon: '📊',
  tagline: 'Từ danh sách dòng thành báo cáo — và chỗ mọi báo cáo hay sai',
  minutes: 45,
  goals: [
    'Dùng COUNT / SUM / AVG / MIN / MAX đúng ngữ cảnh',
    'Giải thích được COUNT(*) khác COUNT(cột) và COUNT(DISTINCT cột) ở đâu',
    'Nhóm theo một hoặc nhiều cột và biết quy tắc "cột nào được phép có trong SELECT"',
    'Phân biệt dứt khoát WHERE và HAVING',
    'Đếm có điều kiện bằng FILTER — cú pháp gọn mà SQL Server không có',
  ],
  labModuleId: 862,
  labModuleName: 'Aggregation & Grouping',
  labCount: 10,
  labPicks: [
    { slug: 'group-rows-with-group-by', title: 'Group Rows with GROUP BY', vi: 'Gom dòng bằng GROUP BY' },
    { slug: 'filter-groups-with-having', title: 'Filter Groups with HAVING', vi: 'Lọc nhóm bằng HAVING' },
    { slug: 'conditional-aggregates-with-filter', title: 'Conditional Aggregates with FILTER', vi: 'Tổng hợp có điều kiện bằng FILTER' },
    { slug: 'capstone-a-category-sales-summary', title: 'Capstone: A Category Sales Summary', vi: 'Tổng hợp: báo cáo doanh thu theo danh mục' },
  ],
  status: 'full',
  blocks: [
    {
      kind: 'p',
      text:
        'Tới đây bạn lấy được **danh sách dòng**. Chương này biến danh sách đó thành **con số**: '
        + 'có bao nhiêu đơn, doanh thu mỗi danh mục, khách nào mua nhiều nhất. Đây là lúc SQL bắt đầu thay được Excel.',
    },

    { kind: 'h', text: 'Các hàm tổng hợp' },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Gộp cả bảng thành đúng một dòng',
      code: `SELECT COUNT(*)      AS so_san_pham,
       SUM(price)     AS tong_gia,
       AVG(price)     AS gia_trung_binh,
       MIN(price)     AS re_nhat,
       MAX(price)     AS dat_nhat,
       ROUND(AVG(price), 0) AS gia_tb_lam_tron
FROM products;`,
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'COUNT(*) khác COUNT(cột) — và đây là chỗ báo cáo sai',
      text:
        '`COUNT(*)` đếm **số dòng**. `COUNT(email)` đếm số dòng có `email` **khác NULL**. '
        + 'Bảng 100 khách mà 30 người chưa điền email: `COUNT(*)` = 100, `COUNT(email)` = 70. '
        + 'Cả hai đều "đúng", nhưng chỉ một cái là điều bạn muốn — và không có gì cảnh báo bạn đã chọn nhầm.',
    },
    {
      kind: 'table',
      head: ['Viết', 'Đếm cái gì', 'Ví dụ'],
      rows: [
        ['`COUNT(*)`', 'Mọi dòng, kể cả toàn NULL', '100'],
        ['`COUNT(email)`', 'Dòng có email khác NULL', '70'],
        ['`COUNT(DISTINCT city)`', 'Số giá trị city khác nhau (bỏ NULL)', '12'],
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'AVG cũng bỏ qua NULL',
      text:
        'Mọi hàm tổng hợp (trừ `COUNT(*)`) đều **bỏ qua NULL**. `AVG(rating)` trên 100 dòng mà chỉ 20 dòng có điểm '
        + 'sẽ là trung bình của 20 dòng đó, không phải chia cho 100. Nếu muốn coi NULL là 0 thì phải nói rõ: `AVG(COALESCE(rating, 0))`.',
    },

    { kind: 'h', text: 'GROUP BY — mỗi nhóm một dòng' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT category,
       COUNT(*)   AS so_luong,
       SUM(price) AS tong_gia
FROM products
GROUP BY category
ORDER BY tong_gia DESC;`,
    },
    {
      kind: 'figure',
      name: 'groupby-visual',
      title: 'GROUP BY làm gì với các dòng',
      caption: 'Bước 1 gom dòng cùng category vào một rổ. Bước 2 rút mỗi rổ thành ĐÚNG một dòng kết quả.',
    },
    {
      kind: 'p',
      text:
        'Kết quả có bao nhiêu dòng thì đúng bằng số giá trị `category` khác nhau. '
        + 'Dùng lại widget chạy từng bước ở chương 2, lần này chọn câu có `GROUP BY` để nhìn thấy các dòng gom lại:',
    },
    {
      kind: 'widget',
      name: 'query-sim',
      title: 'Xem GROUP BY gom dòng',
      hint: 'Chọn câu query có GROUP BY / HAVING trong danh sách, rồi bấm từng bước.',
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Quy tắc vàng của GROUP BY',
      text:
        'Mọi cột xuất hiện trong `SELECT` mà **không** nằm trong một hàm tổng hợp thì **bắt buộc** phải có trong `GROUP BY`. '
        + 'Lý do: một nhóm có nhiều dòng, database không biết lấy giá trị của dòng nào. '
        + 'PostgreSQL báo lỗi rõ ràng. MySQL đời cũ thì im lặng trả về một giá trị ngẫu nhiên — nguồn của vô số báo cáo sai.',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- ❌ LỖI: column "name" must appear in the GROUP BY clause
SELECT category, name, COUNT(*) FROM products GROUP BY category;

-- ✅ Cách 1: đưa vào GROUP BY (nhưng khi đó nhóm nhỏ hơn hẳn)
SELECT category, name, COUNT(*) FROM products GROUP BY category, name;

-- ✅ Cách 2: bọc trong hàm tổng hợp
SELECT category, MAX(name) AS mot_ten, COUNT(*) FROM products GROUP BY category;

-- ✅ Cách 3: gom hết tên lại thành một chuỗi
SELECT category, STRING_AGG(name, ', ' ORDER BY name) AS danh_sach
FROM products GROUP BY category;`,
    },
    {
      kind: 'mssql',
      text: 'Gom nhiều dòng thành một chuỗi:',
      pg: "STRING_AGG(name, ', ' ORDER BY name)",
      ms: "STRING_AGG(name, ', ') WITHIN GROUP (ORDER BY name)   -- SQL Server 2017+",
    },

    { kind: 'h', text: 'HAVING — lọc NHÓM, không phải lọc dòng' },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Danh mục nào có trên 5 sản phẩm còn hàng?',
      code: `SELECT category, COUNT(*) AS so_luong
FROM products
WHERE stock > 0          -- ① lọc DÒNG: bỏ sản phẩm hết hàng
GROUP BY category        -- ② gom thành nhóm
HAVING COUNT(*) > 5      -- ③ lọc NHÓM: bỏ danh mục ít hơn 6 sản phẩm
ORDER BY so_luong DESC;`,
    },
    {
      kind: 'table',
      caption: 'Nhớ theo thời điểm chạy, không phải theo cú pháp',
      head: ['', '`WHERE`', '`HAVING`'],
      rows: [
        ['Chạy lúc nào', 'TRƯỚC khi gom nhóm', 'SAU khi gom nhóm'],
        ['Lọc cái gì', 'Từng dòng', 'Từng nhóm'],
        ['Dùng được COUNT/SUM không?', '❌ Không', '✅ Có'],
        ['Dùng được alias của SELECT không?', '❌ Không', '❌ Không *(Postgres cho phép ở một số trường hợp, đừng dựa vào)*'],
      ],
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Chọn cái nào? Có quy tắc đơn giản',
      text:
        'Điều kiện của bạn nói về **một dòng** (giá, ngày, trạng thái) → `WHERE`. '
        + 'Điều kiện nói về **cả nhóm** (đếm được bao nhiêu, tổng bằng bao nhiêu) → `HAVING`. '
        + 'Và luôn ưu tiên đẩy điều kiện vào `WHERE` khi có thể: lọc sớm thì có ít dòng để gom hơn, chạy nhanh hơn.',
    },

    { kind: 'h', text: 'Đếm có điều kiện — FILTER' },
    {
      kind: 'p',
      text: 'Bài toán rất hay gặp: một câu query trả về nhiều cột đếm theo các điều kiện khác nhau.',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Cú pháp FILTER — sạch và dễ đọc',
      code: `SELECT category,
       COUNT(*)                                AS tong,
       COUNT(*) FILTER (WHERE stock > 0)       AS con_hang,
       COUNT(*) FILTER (WHERE stock = 0)       AS het_hang,
       SUM(price) FILTER (WHERE is_active)     AS doanh_thu_dang_ban
FROM products
GROUP BY category;`,
    },
    {
      kind: 'mssql',
      text: '`FILTER` là chuẩn ANSI nhưng SQL Server chưa hỗ trợ. Bên đó phải viết bằng CASE:',
      pg: 'COUNT(*) FILTER (WHERE stock > 0)',
      ms: 'SUM(CASE WHEN stock > 0 THEN 1 ELSE 0 END)\n-- hoặc: COUNT(CASE WHEN stock > 0 THEN 1 END)',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Cách viết CASE cũng chạy trên Postgres',
      text:
        'Nếu code của bạn cần chạy được trên cả hai hệ thì dùng `COUNT(CASE WHEN … THEN 1 END)`. '
        + 'Mẹo ở đây: `CASE` không có `ELSE` nên trả về NULL, mà `COUNT` bỏ qua NULL — đúng thứ ta cần.',
    },

    { kind: 'h', text: 'Nhóm theo nhiều cột' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT category,
       is_active,
       COUNT(*) AS so_luong
FROM products
GROUP BY category, is_active
ORDER BY category, is_active;`,
    },
    {
      kind: 'p',
      text:
        'Số dòng kết quả bằng số **tổ hợp** thực sự tồn tại trong dữ liệu — không phải tích của số giá trị. '
        + 'Nếu một tổ hợp không có dòng nào thì nó đơn giản là không xuất hiện (không ra 0).',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Muốn thấy cả nhóm bằng 0 thì phải LEFT JOIN',
      text:
        'Đây là hiểu lầm rất hay gặp: "danh mục chưa có sản phẩm nào" sẽ KHÔNG xuất hiện trong kết quả `GROUP BY`, '
        + 'vì không có dòng nào để gom. Muốn hiện ra kèm số 0 thì phải bắt đầu từ bảng danh mục và `LEFT JOIN` sang — chương 5.',
    },

    {
      kind: 'quiz',
      q: 'Bảng `customers` có 100 dòng, trong đó 30 dòng `phone` là NULL. `SELECT COUNT(*), COUNT(phone) FROM customers` trả về gì?',
      options: ['100 và 100', '100 và 70', '70 và 70', '100 và 30'],
      answer: 1,
      explain: '`COUNT(*)` đếm mọi dòng = 100. `COUNT(phone)` chỉ đếm dòng có phone khác NULL = 70.',
    },
    {
      kind: 'quiz',
      q: 'Bạn muốn "các danh mục có tổng doanh thu trên 10 triệu". Điều kiện đó đặt ở đâu?',
      options: [
        '`WHERE SUM(price) > 10000000`',
        '`HAVING SUM(price) > 10000000`',
        'Chỗ nào cũng được',
        '`WHERE price > 10000000`',
      ],
      answer: 1,
      explain:
        'Điều kiện nói về cả NHÓM (tổng của nhóm) nên phải là HAVING. '
        + 'Đặt ở WHERE sẽ báo lỗi vì lúc WHERE chạy thì nhóm còn chưa được tạo ra.',
    },
    {
      kind: 'quiz',
      q: '`SELECT category, name, COUNT(*) FROM products GROUP BY category` — chuyện gì xảy ra trên PostgreSQL?',
      options: [
        'Chạy bình thường, `name` lấy dòng đầu tiên của nhóm',
        'Báo lỗi: `name` phải nằm trong GROUP BY hoặc trong hàm tổng hợp',
        'Chạy nhưng `name` luôn là NULL',
        'Chạy và tự động thêm `name` vào GROUP BY',
      ],
      answer: 1,
      explain:
        'Postgres tuân thủ chuẩn nên báo lỗi rõ ràng. MySQL đời cũ im lặng trả một giá trị bất kỳ — '
        + 'điều đó nghe "tiện" nhưng là nguồn của những báo cáo sai không ai phát hiện ra.',
    },
    {
      kind: 'try',
      text:
        'Bài Capstone "Category Sales Summary" bên Code Lab gộp cả chương này lại: JOIN, GROUP BY, HAVING và sắp xếp. '
        + 'Nếu làm được nó thì bạn đã đủ sức viết báo cáo thật.',
    },
  ],
  flash: [
    { q: 'COUNT(*) khác COUNT(cột) thế nào?', a: 'COUNT(*) đếm mọi dòng. COUNT(cột) chỉ đếm dòng có giá trị khác NULL.' },
    { q: 'Quy tắc vàng của GROUP BY?', a: 'Cột nào trong SELECT mà không nằm trong hàm tổng hợp thì bắt buộc phải có trong GROUP BY.' },
    { q: 'WHERE và HAVING khác nhau ở đâu?', a: 'WHERE lọc DÒNG trước khi gom nhóm; HAVING lọc NHÓM sau khi đã gom. Chỉ HAVING dùng được COUNT/SUM.' },
    { q: 'Đếm có điều kiện trong Postgres?', a: '`COUNT(*) FILTER (WHERE …)`. SQL Server không có, phải dùng `COUNT(CASE WHEN … THEN 1 END)`.' },
    { q: 'Vì sao danh mục 0 sản phẩm không hiện trong GROUP BY?', a: 'Vì không có dòng nào để gom. Muốn hiện kèm số 0 phải LEFT JOIN từ bảng danh mục sang.' },
    { q: 'AVG có tính NULL không?', a: 'Không. Mọi hàm tổng hợp trừ COUNT(*) đều bỏ qua NULL. Muốn coi NULL là 0 thì AVG(COALESCE(x,0)).' },
  ],
};
