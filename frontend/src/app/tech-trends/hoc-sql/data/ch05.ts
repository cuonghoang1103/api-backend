import type { Chapter } from './types';

/**
 * Chương 5 — JOIN.
 *
 * Widget `join-venn` đặt sớm, ngay sau INNER JOIN: người học cần THẤY tập kết
 * quả đổi khi bấm sang LEFT/RIGHT/FULL trước khi đọc bất kỳ định nghĩa nào.
 * Ba cái bẫy được nhấn: điều kiện của bảng phải ở ON chứ không phải WHERE khi
 * dùng LEFT JOIN, COUNT(*) đếm nhầm sau LEFT JOIN, và nhân bản dòng khi JOIN
 * một–nhiều rồi SUM.
 */
export const CH05: Chapter = {
  no: 5,
  slug: 'join-nhieu-bang',
  title: 'JOIN — ghép nhiều bảng',
  icon: '🔗',
  tagline: 'Dữ liệu thật luôn nằm rải ở nhiều bảng; JOIN là cách gọi chúng về một chỗ',
  minutes: 55,
  goals: [
    'Viết được INNER / LEFT / RIGHT / FULL JOIN và biết chọn cái nào',
    'Ghép ba bảng trở lên bằng bí danh bảng',
    'Tìm "những dòng KHÔNG có cặp" — bài toán rất hay gặp',
    'Tránh hai bẫy: đặt điều kiện sai chỗ khi LEFT JOIN, và đếm/cộng nhầm sau khi JOIN',
    'Tự JOIN một bảng với chính nó',
  ],
  labModuleId: 863,
  labModuleName: 'Joins & Multi-Table Queries',
  labCount: 10,
  labPicks: [
    { slug: 'join-two-tables-with-inner-join', title: 'Join Two Tables with INNER JOIN', vi: 'Ghép hai bảng bằng INNER JOIN' },
    { slug: 'keep-unmatched-rows-with-left-join', title: 'Keep Unmatched Rows with LEFT JOIN', vi: 'Giữ dòng không khớp bằng LEFT JOIN' },
    { slug: 'left-join-with-aggregation-count-per-customer', title: 'LEFT JOIN with Aggregation (Count per Customer)', vi: 'LEFT JOIN kèm đếm theo khách' },
    { slug: 'capstone-best-selling-products-report', title: 'Capstone: Best-Selling Products Report', vi: 'Tổng hợp: báo cáo sản phẩm bán chạy' },
  ],
  status: 'full',
  blocks: [
    {
      kind: 'p',
      text:
        'Không ai nhét cả tên khách hàng vào bảng đơn hàng. Nếu khách đổi tên thì phải sửa ở hàng nghìn dòng đơn — '
        + 'và chắc chắn sẽ sót. Nên dữ liệu được **tách ra** (gọi là chuẩn hoá): khách ở bảng `customers`, '
        + 'đơn ở bảng `orders`, nối với nhau bằng `customer_id`. `JOIN` là cách gọi chúng về chung một kết quả.',
    },

    { kind: 'h', text: 'INNER JOIN — chỉ giữ dòng có cặp' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT o.id       AS ma_don,
       c.name    AS ten_khach,
       o.total   AS tong_tien
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY o.id;`,
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Bí danh bảng (`o`, `c`) không phải để gõ cho nhanh',
      text:
        'Nó để **chỉ rõ cột nào của bảng nào**. Khi hai bảng cùng có cột `id` mà bạn chỉ viết `id`, '
        + 'Postgres báo lỗi `column reference "id" is ambiguous`. Hãy tập thói quen đặt bí danh và ghi rõ tiền tố cho mọi cột, '
        + 'kể cả khi chưa cần — người đọc code sau này sẽ biết ơn.',
    },
    {
      kind: 'p',
      text: '`JOIN` viết trần chính là `INNER JOIN`. Bấm thử để xem bốn kiểu JOIN cho ra tập kết quả khác nhau thế nào:',
    },
    {
      kind: 'widget',
      name: 'join-venn',
      title: 'Bốn kiểu JOIN trên dữ liệu thật',
      hint: 'Bấm đổi kiểu JOIN — bảng kết quả và sơ đồ Venn đổi theo ngay.',
    },

    { kind: 'h', text: 'Chọn kiểu JOIN nào' },
    {
      kind: 'table',
      head: ['Kiểu', 'Giữ lại gì', 'Dùng khi'],
      rows: [
        ['`INNER JOIN`', 'Chỉ dòng có cặp ở CẢ HAI bảng', 'Danh sách đơn hàng kèm tên khách'],
        ['`LEFT JOIN`', 'Mọi dòng bảng TRÁI + phần khớp bên phải (không khớp thì NULL)', 'Mọi khách hàng kèm số đơn — kể cả khách chưa mua gì'],
        ['`RIGHT JOIN`', 'Ngược lại của LEFT', 'Hiếm dùng — đảo hai bảng rồi dùng LEFT cho dễ đọc'],
        ['`FULL JOIN`', 'Mọi dòng của cả hai bên', 'Đối soát hai nguồn dữ liệu, tìm chỗ lệch'],
        ['`CROSS JOIN`', 'Mọi tổ hợp (tích Descartes)', 'Sinh lịch, sinh ma trận. Cẩn thận: 1000 × 1000 = 1 triệu dòng'],
      ],
    },
    {
      kind: 'figure',
      name: 'join-4up',
      title: 'Bốn kiểu JOIN — bảng tra nhanh',
      caption: 'Phần tô đậm là phần được giữ lại trong kết quả. In ra dán cạnh màn hình cũng được.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Mẹo chọn nhanh',
      text:
        'Tự hỏi: "dòng bên trái mà KHÔNG có cặp bên phải thì tôi có muốn thấy nó không?" '
        + 'Có → `LEFT JOIN`. Không → `INNER JOIN`. Chỉ vậy thôi.',
    },

    { kind: 'h', text: 'Bẫy 1 — đặt điều kiện sai chỗ khi LEFT JOIN' },
    {
      kind: 'p',
      text: 'Hai câu dưới trông gần giống nhau nhưng cho kết quả khác hẳn. Đây là lỗi kinh điển:',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- ✅ ĐÚNG: mọi khách, kèm các đơn năm 2026 (khách chưa mua vẫn hiện, cột đơn là NULL)
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.id
      AND o.created_at >= '2026-01-01';

-- ❌ SAI: LEFT JOIN bị biến thành INNER JOIN
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= '2026-01-01';`,
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Vì sao câu thứ hai sai',
      text:
        'Với khách chưa có đơn, `LEFT JOIN` sinh ra dòng có `o.created_at` là NULL. '
        + 'Rồi `WHERE NULL >= \'2026-01-01\'` cho ra UNKNOWN, nên dòng đó bị loại. '
        + 'Kết quả: đúng những dòng mà LEFT JOIN vừa cố công giữ lại thì bị `WHERE` vứt đi. '
        + '**Quy tắc: điều kiện về bảng BÊN PHẢI của LEFT JOIN phải đặt trong `ON`, không đặt trong `WHERE`.**',
    },

    { kind: 'h', text: 'Bẫy 2 — đếm nhầm sau LEFT JOIN' },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- ❌ SAI: khách chưa mua gì cũng ra 1 (vì vẫn có đúng 1 dòng, dù cột toàn NULL)
SELECT c.name, COUNT(*) AS so_don
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- ✅ ĐÚNG: đếm cột của bảng bên phải → NULL bị bỏ qua → khách chưa mua ra 0
SELECT c.name, COUNT(o.id) AS so_don
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Đây chính là chương 4 quay lại',
      text:
        '`COUNT(*)` đếm dòng; `COUNT(o.id)` bỏ qua NULL. Sau một `LEFT JOIN` thì khác biệt đó biến thành '
        + 'sai lệch trong báo cáo. Quy tắc bỏ túi: **sau LEFT JOIN, luôn đếm một cột của bảng bên phải.**',
    },

    { kind: 'h', text: 'Bẫy 3 — nhân bản dòng khi JOIN một–nhiều' },
    {
      kind: 'p',
      text:
        'Một đơn hàng có 3 dòng chi tiết. Khi `JOIN` `orders` với `order_items`, đơn đó xuất hiện **3 lần** trong kết quả. '
        + 'Nếu bạn `SUM(o.total)` sau đó, tổng bị nhân ba.',
    },
    {
      kind: 'figure',
      name: 'join-row-multiply',
      title: 'Vì sao tổng doanh thu bị thổi phồng',
      caption: 'Đơn 500k có 3 dòng chi tiết nên sau JOIN nó thành 3 dòng, và SUM cộng nó 3 lần thành 1.500k.',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- ❌ SAI: mỗi đơn bị đếm nhiều lần bằng số dòng chi tiết của nó
SELECT SUM(o.total)
FROM orders o
JOIN order_items i ON i.order_id = o.id;

-- ✅ ĐÚNG: gộp bảng con lại TRƯỚC rồi mới ghép
SELECT SUM(o.total)
FROM orders o
WHERE EXISTS (SELECT 1 FROM order_items i WHERE i.order_id = o.id);

-- ✅ ĐÚNG (khi cần cả hai số): gộp trước trong truy vấn con
SELECT o.id, o.total, i.so_dong
FROM orders o
JOIN (SELECT order_id, COUNT(*) AS so_dong
      FROM order_items GROUP BY order_id) i
  ON i.order_id = o.id;`,
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Dấu hiệu nhận biết',
      text:
        'Doanh thu trong báo cáo lớn hơn thực tế một cách khó hiểu, và tỉ lệ sai không cố định. '
        + 'Gần như luôn là do JOIN một–nhiều rồi cộng. Cách kiểm tra nhanh: bỏ `SUM` đi, chạy lại, đếm số dòng — '
        + 'nếu nhiều hơn số đơn hàng thật thì đã nhân bản.',
    },

    { kind: 'h', text: 'Ghép ba bảng' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT c.name        AS khach,
       o.id          AS ma_don,
       p.name        AS san_pham,
       i.quantity    AS so_luong,
       i.unit_price * i.quantity AS thanh_tien
FROM orders o
JOIN customers   c ON c.id = o.customer_id
JOIN order_items i ON i.order_id = o.id
JOIN products    p ON p.id = i.product_id
WHERE o.created_at >= '2026-01-01'
ORDER BY o.id, p.name;`,
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Đọc câu JOIN dài thế nào cho đỡ choáng',
      text:
        'Đọc từng dòng `JOIN` một, mỗi lần chỉ hỏi: "bảng này nối vào bằng cột nào?". '
        + 'Nếu một dòng JOIN thiếu `ON` thì bạn vừa tạo ra một `CROSS JOIN` ngầm — số dòng bùng nổ.',
    },

    { kind: 'h', text: 'Tìm dòng KHÔNG có cặp' },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Khách chưa từng đặt đơn nào',
      code: `-- Cách 1: LEFT JOIN rồi lọc NULL (mẫu "anti-join")
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- Cách 2: NOT EXISTS — thường dễ đọc hơn và an toàn với NULL
SELECT c.name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Đây là chỗ chương 3 trả bài',
      text:
        'Cả hai cách trên đều đúng. Cách còn lại — `WHERE c.id NOT IN (SELECT customer_id FROM orders)` — '
        + 'là cái bẫy NULL đã học ở chương 3: chỉ cần một `customer_id` NULL là trả về rỗng.',
    },

    { kind: 'h', text: 'Tự JOIN với chính mình' },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Nhân viên và người quản lý của họ — cùng nằm trong một bảng',
      code: `SELECT nv.name    AS nhan_vien,
       sep.name   AS quan_ly
FROM employees nv
LEFT JOIN employees sep ON sep.id = nv.manager_id
ORDER BY nv.name;`,
    },
    {
      kind: 'p',
      text:
        'Dùng `LEFT JOIN` ở đây vì giám đốc không có quản lý — với `INNER JOIN` thì giám đốc biến mất khỏi danh sách.',
    },

    {
      kind: 'quiz',
      q: 'Bạn cần "mọi khách hàng kèm số đơn của họ, khách chưa mua thì hiện 0". Câu nào đúng?',
      options: [
        '`FROM customers c JOIN orders o ON … GROUP BY c.id` với `COUNT(*)`',
        '`FROM customers c LEFT JOIN orders o ON … GROUP BY c.id` với `COUNT(*)`',
        '`FROM customers c LEFT JOIN orders o ON … GROUP BY c.id` với `COUNT(o.id)`',
        '`FROM orders o LEFT JOIN customers c ON … GROUP BY c.id` với `COUNT(o.id)`',
      ],
      answer: 2,
      explain:
        'Cần LEFT JOIN để giữ khách chưa mua, VÀ cần `COUNT(o.id)` để họ ra 0 thay vì 1. '
        + 'Phương án B mắc đúng bẫy `COUNT(*)`; phương án D đảo bảng nên mất luôn khách chưa mua.',
    },
    {
      kind: 'quiz',
      q: 'Vì sao `LEFT JOIN orders o ON … WHERE o.status = \'paid\'` lại hoạt động y như INNER JOIN?',
      options: [
        'Vì LEFT JOIN chỉ dùng được khi không có WHERE',
        'Vì dòng không khớp có `o.status` là NULL, và `NULL = \'paid\'` cho ra UNKNOWN nên bị WHERE loại bỏ',
        'Vì Postgres tự tối ưu thành INNER JOIN cho nhanh',
        'Vì phải viết LEFT OUTER JOIN mới đúng',
      ],
      answer: 1,
      explain:
        'Đúng bản chất. Muốn giữ dòng không khớp thì chuyển điều kiện lên `ON`: '
        + '`LEFT JOIN orders o ON o.customer_id = c.id AND o.status = \'paid\'`.',
    },
    {
      kind: 'quiz',
      q: 'Bảng `orders` có 100 đơn. Mỗi đơn trung bình 3 dòng `order_items`. `SELECT SUM(o.total) FROM orders o JOIN order_items i ON i.order_id = o.id` cho kết quả thế nào?',
      options: [
        'Đúng tổng doanh thu',
        'Gấp khoảng 3 lần tổng thật',
        'Bằng 1/3 tổng thật',
        'Báo lỗi vì thiếu GROUP BY',
      ],
      answer: 1,
      explain:
        'Mỗi đơn xuất hiện 3 lần sau khi JOIN nên `o.total` bị cộng 3 lần. '
        + 'Đây là lỗi nhân bản dòng — hãy gộp bảng con trước rồi mới ghép, hoặc dùng EXISTS.',
    },
    {
      kind: 'try',
      text:
        'Làm bài `LEFT JOIN with Aggregation` bên Code Lab — nó dựng đúng bẫy `COUNT(*)` vs `COUNT(o.id)`. '
        + 'Rồi làm tiếp `Products Never Ordered` để luyện mẫu anti-join.',
    },
  ],
  flash: [
    { q: 'INNER JOIN khác LEFT JOIN thế nào?', a: 'INNER chỉ giữ dòng có cặp ở cả hai bảng. LEFT giữ mọi dòng bảng trái, bên phải không khớp thì NULL.' },
    { q: 'Điều kiện lọc bảng phải trong LEFT JOIN đặt ở đâu?', a: 'Trong `ON`. Đặt vào `WHERE` sẽ biến LEFT JOIN thành INNER JOIN.' },
    { q: 'Sau LEFT JOIN thì đếm bằng gì?', a: '`COUNT(cột_của_bảng_phải)`, không dùng `COUNT(*)` — nếu không, dòng không khớp bị đếm thành 1.' },
    { q: 'Vì sao SUM sau JOIN một–nhiều bị sai?', a: 'Dòng bảng cha bị nhân bản theo số dòng con. Phải gộp bảng con trước rồi mới JOIN, hoặc dùng EXISTS.' },
    { q: 'Hai cách tìm "dòng không có cặp"?', a: 'LEFT JOIN rồi `WHERE khoá_phải IS NULL`, hoặc `NOT EXISTS`. Đừng dùng `NOT IN`.' },
    { q: 'Self-join dùng khi nào?', a: 'Khi quan hệ nằm trong cùng một bảng — nhân viên/quản lý, danh mục cha/con. Nhớ LEFT JOIN để không mất dòng gốc.' },
  ],
};
