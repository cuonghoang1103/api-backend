import type { Chapter } from './types';

/**
 * Chương 6 — truy vấn con, CTE và phép tập hợp.
 *
 * Điểm nhấn: CTE không chỉ là "cách viết khác của subquery" mà là công cụ để
 * CHIA một bài toán khó thành các bước đọc được từ trên xuống — đúng thứ người
 * mới thiếu khi đứng trước một yêu cầu báo cáo dài ba câu.
 */
export const CH06: Chapter = {
  no: 6,
  slug: 'subquery-cte',
  title: 'Truy vấn con, CTE & phép tập hợp',
  icon: '🧩',
  tagline: 'Cách chẻ một bài toán khó thành các bước đọc được từ trên xuống',
  minutes: 50,
  goals: [
    'Dùng truy vấn con ở ba vị trí: SELECT, FROM, WHERE',
    'Phân biệt truy vấn con độc lập và truy vấn con tương quan (EXISTS)',
    'Viết CTE bằng WITH để câu query dài vẫn đọc được',
    'Dùng CTE đệ quy để đi hết một cây phân cấp',
    'Dùng UNION / INTERSECT / EXCEPT và biết UNION khác UNION ALL ở đâu',
  ],
  labModuleId: 864,
  labModuleName: 'Subqueries, CTEs & Set Operations',
  labCount: 10,
  labPicks: [
    { slug: 'name-a-subquery-with-a-cte-with', title: 'Name a Subquery with a CTE (WITH)', vi: 'Đặt tên cho truy vấn con bằng CTE' },
    { slug: 'correlated-subquery-with-exists', title: 'Correlated Subquery with EXISTS', vi: 'Truy vấn con tương quan với EXISTS' },
    { slug: 'recursive-cte-walk-a-hierarchy', title: 'Recursive CTE: Walk a Hierarchy', vi: 'CTE đệ quy: đi hết cây phân cấp' },
    { slug: 'set-operations-union-intersect-except', title: 'Set Operations: UNION, INTERSECT, EXCEPT', vi: 'Phép tập hợp: UNION, INTERSECT, EXCEPT' },
  ],
  status: 'full',
  blocks: [
    {
      kind: 'p',
      text:
        'Có những câu hỏi cần hai bước: *"khách nào chi nhiều hơn mức trung bình?"* — '
        + 'phải tính mức trung bình trước, rồi mới so được. Truy vấn con và CTE là hai cách viết bước đó.',
    },

    { kind: 'h', text: 'Truy vấn con ở WHERE' },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- Trả về đúng MỘT giá trị → so sánh trực tiếp được
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Trả về một CỘT nhiều giá trị → dùng IN
SELECT name
FROM products
WHERE category IN (SELECT slug FROM categories WHERE is_featured);`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Truy vấn con dùng với `=` thì phải trả về đúng một dòng',
      text:
        'Nếu nó trả về nhiều dòng, Postgres báo lỗi `more than one row returned by a subquery used as an expression`. '
        + 'Lỗi này thường chỉ xuất hiện khi dữ liệu thật lớn lên — ở máy dev với vài dòng mẫu thì không lộ ra.',
    },

    { kind: 'h', text: 'EXISTS — truy vấn con tương quan' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT c.name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id      -- ← tham chiếu ra bảng ngoài
    AND o.total > 5000000
);`,
    },
    {
      kind: 'p',
      text:
        'Gọi là **tương quan** vì truy vấn con nhắc tới `c.id` của truy vấn ngoài, nên nó phải chạy lại cho từng dòng. '
        + 'Bù lại, `EXISTS` dừng ngay khi tìm thấy dòng đầu tiên — không cần đếm hết.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: '`SELECT 1` bên trong EXISTS không phải là mẹo tối ưu',
      text:
        'Nó chỉ là quy ước cho người đọc hiểu "tôi không quan tâm lấy cột gì, chỉ hỏi có hay không". '
        + 'Viết `SELECT *` cũng nhanh y hệt — bộ lập kế hoạch bỏ qua phần đó.',
    },
    {
      kind: 'table',
      caption: 'Chọn dạng nào',
      head: ['Muốn hỏi', 'Dùng', 'Ghi chú'],
      rows: [
        ['Có tồn tại không?', '`EXISTS`', 'Nhanh, an toàn với NULL'],
        ['Không tồn tại?', '`NOT EXISTS`', '**Luôn ưu tiên hơn `NOT IN`**'],
        ['Nằm trong danh sách cố định?', '`IN (1, 2, 3)`', 'Rõ ràng, dễ đọc'],
        ['Nằm trong kết quả truy vấn khác?', '`IN (SELECT …)`', 'Được, nhưng cẩn thận NULL'],
      ],
    },

    { kind: 'h', text: 'Truy vấn con ở FROM — bảng dẫn xuất' },
    {
      kind: 'code',
      lang: 'sql',
      code: `SELECT t.category, t.doanh_thu
FROM (
  SELECT category, SUM(price * stock) AS doanh_thu
  FROM products
  GROUP BY category
) AS t
WHERE t.doanh_thu > 50000000
ORDER BY t.doanh_thu DESC;`,
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Bắt buộc phải đặt bí danh cho bảng dẫn xuất',
      text: 'Thiếu `AS t` là lỗi cú pháp trong PostgreSQL: `subquery in FROM must have an alias`.',
    },

    { kind: 'h', text: 'CTE — đặt tên cho từng bước' },
    {
      kind: 'p',
      text:
        'Câu trên vẫn còn đọc được. Nhưng khi bài toán có ba bước, viết lồng nhau sẽ thành một khối không ai đọc nổi. '
        + '`WITH` cho phép đặt tên từng bước và đọc **từ trên xuống dưới** như đọc một đoạn văn:',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Cùng một bài toán, viết bằng CTE',
      code: `WITH doanh_thu_theo_danh_muc AS (
  SELECT category, SUM(price * stock) AS doanh_thu
  FROM products
  GROUP BY category
),
muc_trung_binh AS (
  SELECT AVG(doanh_thu) AS tb FROM doanh_thu_theo_danh_muc
)
SELECT d.category, d.doanh_thu
FROM doanh_thu_theo_danh_muc d
CROSS JOIN muc_trung_binh m
WHERE d.doanh_thu > m.tb
ORDER BY d.doanh_thu DESC;`,
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Vì sao nên tập dùng CTE sớm',
      text:
        'Mỗi CTE là một bước có TÊN. Khi query sai, bạn chạy thử riêng từng CTE để tìm ra bước nào hỏng — '
        + 'thay vì ngồi nhìn một khối lồng bốn tầng. Đây là kỹ năng gỡ lỗi quan trọng hơn cả cú pháp.',
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Một lưu ý về hiệu năng',
      text:
        'PostgreSQL từ phiên bản 12 trở đi tự động "trộn" CTE vào câu query chính khi có lợi. '
        + 'Trước phiên bản 12 thì CTE luôn là hàng rào tối ưu (chạy xong mới dùng), khiến nó chậm hơn subquery. '
        + 'Nếu bạn cần ép giữ hàng rào đó thì viết `WITH x AS MATERIALIZED (…)`.',
    },
    {
      kind: 'mssql',
      text: 'CTE có ở cả hai hệ với cú pháp giống nhau. Khác biệt nhỏ nhưng hay vấp:',
      pg: 'WITH a AS (…), b AS (…)\nSELECT … ;',
      ms: '; WITH a AS (…), b AS (…)\nSELECT … ;\n-- SQL Server yêu cầu câu lệnh TRƯỚC đó phải kết thúc bằng dấu ;\n-- nên người ta hay đặt dấu ; ngay trước WITH cho chắc',
    },

    { kind: 'h', text: 'CTE đệ quy — đi hết một cây' },
    {
      kind: 'p',
      text: 'Danh mục có danh mục con, danh mục con lại có con nữa. Không biết trước sâu bao nhiêu tầng:',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: `WITH RECURSIVE cay AS (
  -- Bước neo: điểm xuất phát
  SELECT id, name, parent_id, 1 AS cap
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- Bước đệ quy: nối con vào cha đã tìm được ở vòng trước
  SELECT c.id, c.name, c.parent_id, t.cap + 1
  FROM categories c
  JOIN cay t ON t.id = c.parent_id
)
SELECT repeat('  ', cap - 1) || name AS cay_thu_muc, cap
FROM cay
ORDER BY cap, name;`,
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Dữ liệu vòng tròn sẽ làm nó chạy mãi',
      text:
        'Nếu danh mục A là cha của B mà B lại là cha của A, CTE đệ quy lặp vô hạn cho tới khi hết bộ nhớ. '
        + 'Cách phòng: thêm cột đường đi và chặn lặp, hoặc đơn giản là giới hạn `WHERE cap < 10`.',
    },

    { kind: 'h', text: 'UNION, INTERSECT, EXCEPT' },
    {
      kind: 'code',
      lang: 'sql',
      code: `-- Nối hai kết quả, TỰ ĐỘNG BỎ TRÙNG (tốn công sắp xếp)
SELECT email FROM customers
UNION
SELECT email FROM newsletter_subscribers;

-- Nối và GIỮ NGUYÊN mọi dòng — nhanh hơn hẳn
SELECT email FROM customers
UNION ALL
SELECT email FROM newsletter_subscribers;

-- Có ở CẢ HAI
SELECT email FROM customers
INTERSECT
SELECT email FROM newsletter_subscribers;

-- Có ở bảng trên nhưng KHÔNG có ở bảng dưới
SELECT email FROM customers
EXCEPT
SELECT email FROM newsletter_subscribers;`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Mặc định `UNION` là bỏ trùng — và đó là chi phí ngầm',
      text:
        'Để biết dòng nào trùng, database phải sắp xếp hoặc băm toàn bộ kết quả. '
        + 'Nếu bạn **biết chắc** hai tập không giao nhau thì `UNION ALL` nhanh hơn nhiều. '
        + 'Đây là một trong những tối ưu dễ nhất mà ít người để ý.',
    },
    {
      kind: 'mssql',
      text: 'Ba phép này giống hệt nhau ở hai hệ, riêng EXCEPT thì Oracle gọi tên khác:',
      pg: 'UNION · UNION ALL · INTERSECT · EXCEPT',
      ms: 'UNION · UNION ALL · INTERSECT · EXCEPT   -- y hệt (Oracle dùng MINUS thay cho EXCEPT)',
    },
    {
      kind: 'list',
      items: [
        'Số cột hai bên phải **bằng nhau**',
        'Kiểu dữ liệu từng cột phải **tương thích**',
        'Tên cột kết quả lấy theo truy vấn **đầu tiên**',
        '`ORDER BY` chỉ được đặt **một lần, ở cuối cùng**',
      ],
    },

    {
      kind: 'quiz',
      q: 'Khi nào `UNION ALL` được ưu tiên hơn `UNION`?',
      options: [
        'Khi muốn kết quả đã sắp xếp',
        'Khi biết chắc hai tập không có dòng trùng — bỏ bước khử trùng nên nhanh hơn',
        'Khi hai bảng có số cột khác nhau',
        'Không bao giờ, UNION luôn tốt hơn',
      ],
      answer: 1,
      explain:
        '`UNION` phải sắp xếp/băm toàn bộ để khử trùng. Nếu không cần khử thì đó là công vô ích.',
    },
    {
      kind: 'quiz',
      q: 'Vì sao `NOT EXISTS` được ưu tiên hơn `NOT IN` khi tìm dòng không có cặp?',
      options: [
        'Vì cú pháp ngắn hơn',
        'Vì `NOT IN` sẽ trả về rỗng nếu danh sách con chứa NULL, còn `NOT EXISTS` thì không bị',
        'Vì `NOT IN` không chạy được trên PostgreSQL',
        'Vì `NOT EXISTS` luôn dùng index còn `NOT IN` thì không',
      ],
      answer: 1,
      explain:
        'Đây là bẫy logic ba trị từ chương 3. `NOT EXISTS` hỏi "có tồn tại không" nên NULL không ảnh hưởng.',
    },
    {
      kind: 'quiz',
      q: 'CTE đệ quy thiếu điều kiện dừng thì sao?',
      options: [
        'Postgres tự dừng sau 100 vòng',
        'Báo lỗi cú pháp ngay khi chạy',
        'Chạy mãi cho tới khi hết bộ nhớ hoặc bị huỷ',
        'Chỉ trả về bước neo',
      ],
      answer: 2,
      explain:
        'Không có giới hạn tự động. Với dữ liệu có vòng tròn (A là cha B, B là cha A) nó sẽ lặp vô hạn. '
        + 'Hãy chặn bằng cột độ sâu hoặc cột đường đi.',
    },
    {
      kind: 'try',
      text:
        'Bài `Recursive CTE: Walk a Hierarchy` bên Code Lab là bài khó nhất module này. '
        + 'Nếu tự viết được nó thì phần truy vấn con coi như xong.',
    },
  ],
  flash: [
    { q: 'Truy vấn con đặt được ở những đâu?', a: 'SELECT (một giá trị), FROM (bảng dẫn xuất, bắt buộc có alias), WHERE (so sánh / IN / EXISTS).' },
    { q: 'Truy vấn con tương quan là gì?', a: 'Là truy vấn con nhắc tới cột của truy vấn ngoài, nên phải chạy lại cho từng dòng. Điển hình là EXISTS.' },
    { q: 'CTE giải quyết vấn đề gì?', a: 'Đặt tên cho từng bước để câu query dài đọc được từ trên xuống, và chạy thử riêng từng bước khi gỡ lỗi.' },
    { q: 'UNION khác UNION ALL?', a: 'UNION khử dòng trùng (tốn công sắp xếp/băm). UNION ALL giữ nguyên, nhanh hơn.' },
    { q: 'CTE đệ quy gồm mấy phần?', a: 'Bước neo (điểm xuất phát) + UNION ALL + bước đệ quy (nối vào kết quả vòng trước). Nhớ chặn vòng lặp vô hạn.' },
    { q: 'Trước WITH của SQL Server cần gì?', a: 'Dấu chấm phẩy kết thúc câu lệnh trước đó — nên người ta hay viết `;WITH`.' },
  ],
};
