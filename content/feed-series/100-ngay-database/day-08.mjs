/** "100 Ngày Database với CuongThai" — Ngày 8: Lọc dữ liệu với WHERE.
    So sánh + AND/OR/NOT, IN, BETWEEN (bao gồm 2 đầu), LIKE (%/_), và bẫy thứ
    tự ưu tiên AND > OR.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day08). Ghi chú SQL Server (LIKE hoa/thường, ILIKE). */
export default {
  day: 8,
  card: 'db-day-08',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'filter-rows-with-where',
    title: 'Lọc dòng với WHERE',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 8: LỌC DỮ LIỆU VỚI WHERE

Một bảng thật có hàng nghìn, hàng triệu dòng. Sức mạnh của SQL không nằm ở việc "lấy hết ra" mà ở chỗ **hỏi đúng những dòng bạn cần**. Đó là công việc của \`WHERE\` — và hôm nay ta làm chủ toàn bộ bộ công cụ lọc: so sánh, \`AND\`/\`OR\`/\`NOT\`, danh sách \`IN\`, khoảng \`BETWEEN\`, mẫu \`LIKE\`, cùng một cái bẫy thứ tự ưu tiên khiến rất nhiều truy vấn trả sai âm thầm.

Ta dùng một bảng 7 sản phẩm thuộc 3 danh mục (Phụ kiện, Màn hình, Laptop). Mọi kết quả bên dưới là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🎯 SO SÁNH & KẾT HỢP ĐIỀU KIỆN

Các phép so sánh quen thuộc: \`=\`, \`<>\` (khác), \`>\`, \`<\`, \`>=\`, \`<=\`. Nối nhiều điều kiện bằng \`AND\` (cả hai đúng), \`OR\` (một trong hai đúng), \`NOT\` (phủ định):

\`\`\`sql
SELECT ten, danh_muc, gia FROM san_pham
WHERE danh_muc = 'Phu kien' AND gia < 1000000 ORDER BY gia;
\`\`\`

\`\`\`
     ten     | danh_muc |  gia
-------------+----------+--------
 Chuot game  | Phu kien | 550000
 Ban phim co | Phu kien | 890000
(2 rows)
\`\`\`

"Phụ kiện **và** dưới một triệu" → đúng 2 món. Đổi \`AND\` thành \`OR\` sẽ cho "phụ kiện **hoặc** dưới một triệu" — một tập rộng hơn hẳn.

━━━━━━━━━━━━━━━━━━━━

📦 IN & BETWEEN — GỌN VÀ RÕ

Thay vì \`danh_muc = 'Man hinh' OR danh_muc = 'Laptop'\`, dùng \`IN\`:

\`\`\`sql
SELECT ten, danh_muc FROM san_pham
WHERE danh_muc IN ('Man hinh', 'Laptop') ORDER BY ten;
-- -> Laptop Dell, Laptop HP, Man hinh 24, Man hinh 27  (4 dòng)
\`\`\`

Với khoảng số (hoặc ngày), dùng \`BETWEEN\` — **bao gồm cả hai đầu**:

\`\`\`sql
SELECT ten, gia FROM san_pham WHERE gia BETWEEN 500000 AND 1200000 ORDER BY gia;
\`\`\`

\`\`\`
     ten     |   gia
-------------+---------
 Chuot game  |  550000
 Ban phim co |  890000
 Tai nghe    | 1200000
(3 rows)
\`\`\`

Chú ý "Tai nghe" giá **đúng** 1.200.000 vẫn được tính — \`BETWEEN a AND b\` tương đương \`>= a AND <= b\` (đóng ở cả hai đầu). Đây là điểm hay quên, dễ lệch một phần tử ở biên.

━━━━━━━━━━━━━━━━━━━━

🔎 LIKE — TÌM THEO MẪU

Khi cần khớp một *phần* của chuỗi, dùng \`LIKE\` với hai ký tự đại diện: \`%\` (0 hoặc nhiều ký tự bất kỳ) và \`_\` (đúng một ký tự):

\`\`\`sql
SELECT ten FROM san_pham WHERE ten LIKE 'Man%';    -- bắt đầu bằng "Man"
-- -> Man hinh 24, Man hinh 27

SELECT ten FROM san_pham WHERE ten LIKE '%game%';   -- chứa "game"
-- -> Chuot game
\`\`\`

\`'Man%'\` = "bắt đầu bằng Man", \`'%game%'\` = "chứa game", \`'_a%'\` = "ký tự thứ hai là a". \`LIKE\` là nền của mọi ô tìm kiếm đơn giản (ta sẽ học tìm kiếm mạnh hơn — full-text — ở giai đoạn sau).

━━━━━━━━━━━━━━━━━━━━

⚠️ CÁI BẪY: AND ĐƯỢC TÍNH TRƯỚC OR

Đây là lỗi logic phổ biến nhất khi viết \`WHERE\`. Muốn "laptop hoặc màn hình, mà giá dưới 3 triệu". Viết tự nhiên:

\`\`\`sql
SELECT ten FROM san_pham
WHERE danh_muc = 'Laptop' OR danh_muc = 'Man hinh' AND gia < 3000000 ORDER BY ten;
\`\`\`

\`\`\`
     ten
-------------
 Laptop Dell
 Laptop HP
 Man hinh 24
(3 rows)
\`\`\`

Ơ, hai con laptop giá 15–18 triệu vẫn lọt! Vì \`AND\` **ưu tiên cao hơn** \`OR\`, máy hiểu câu này là \`Laptop OR (Man hinh AND gia<3tr)\` — tức "mọi laptop, hoặc màn hình rẻ". Không phải ý bạn. Thêm **ngoặc** để nói đúng:

\`\`\`sql
SELECT ten FROM san_pham
WHERE (danh_muc = 'Laptop' OR danh_muc = 'Man hinh') AND gia < 3000000 ORDER BY ten;
\`\`\`

\`\`\`
     ten
-------------
 Man hinh 24
(1 row)
\`\`\`

Giờ mới đúng: chỉ "Man hinh 24" (2.8 triệu) thoả cả hai vế. **Quy tắc:** khi trộn \`AND\` với \`OR\`, luôn dùng ngoặc — vừa đúng, vừa dễ đọc.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

- **WHERE, AND/OR/NOT, IN, BETWEEN, thứ tự ưu tiên:** giống hệt ở cả hai.
- **LIKE và hoa/thường:** PostgreSQL \`LIKE\` **phân biệt hoa/thường** (\`'man%'\` không khớp "Man hinh"); muốn bỏ qua hoa/thường dùng \`ILIKE\` (riêng PostgreSQL). SQL Server thì \`LIKE\` **mặc định không phân biệt** hoa/thường (tuỳ collation của cột). Đây là khác biệt hay làm sai kết quả tìm kiếm khi chuyển hệ — luôn kiểm.
- Ký tự đại diện \`%\` và \`_\` giống nhau ở cả hai.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết câu lấy sản phẩm **không** thuộc "Phu kien" (thử cả \`<> 'Phu kien'\` và \`NOT danh_muc = 'Phu kien'\`).
2. Dùng \`IN\` để lấy sản phẩm giá thuộc {550000, 1200000, 4200000}.
3. Tìm mọi sản phẩm có tên chứa chữ "hinh" bất kể vị trí.
4. Giải thích vì sao \`WHERE gia BETWEEN 1000000 AND 500000\` trả về 0 dòng.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`WHERE\` là nơi bạn ra lệnh "chỉ những dòng này thôi". Bộ công cụ: so sánh + \`AND\`/\`OR\`/\`NOT\`, \`IN\` cho danh sách, \`BETWEEN\` cho khoảng (nhớ: bao gồm hai đầu), \`LIKE\` cho mẫu chuỗi. Và luật vàng: **trộn AND với OR thì dùng ngoặc**, vì AND luôn được tính trước — đây là nguồn của vô số truy vấn "chạy nhưng sai".

Giờ bạn lọc được đúng dòng cần. Nhưng kết quả trả về theo thứ tự nào? Và nếu có mười nghìn dòng khớp, làm sao chỉ lấy 10 dòng đầu để hiển thị một trang? Đó là bài ngày mai.

Ngày 9: **Sắp xếp & phân trang** — \`ORDER BY\` (một/nhiều cột, tăng/giảm, vị trí của NULL), \`LIMIT\`/\`OFFSET\` để lấy từng trang, và vì sao PostgreSQL \`LIMIT\` khác SQL Server \`TOP\`. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
