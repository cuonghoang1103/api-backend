/** "100 Ngày Database với CuongThai" — Ngày 11: JOIN (mở Giai đoạn 2).
    INNER JOIN (chỉ dòng khớp), LEFT JOIN (giữ mọi dòng trái), tìm dòng không
    khớp bằng LEFT JOIN + IS NULL. Nối khach_hang với don_hang.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day11). JOIN là chuẩn SQL — SQL Server y hệt. */
export default {
  day: 11,
  card: 'db-day-11',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'join-two-tables-with-inner-join',
    title: 'Nối hai bảng với INNER JOIN',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 11: JOIN — NỐI NHIỀU BẢNG

Chào mừng đến **Giai đoạn 2 — Truy vấn**. Ngày 10 ta tách dữ liệu ra nhiều bảng liên kết bằng khoá ngoại. Hôm nay ta làm điều ngược lại: **ghép chúng trở lại** trong một câu truy vấn để trả lời những câu hỏi thực sự thú vị — "ai đã mua gì, bao nhiêu tiền?". Công cụ đó là \`JOIN\`, và nó chính là lý do ngành này gọi là "cơ sở dữ liệu **quan hệ**".

Ta có hai bảng: \`khach_hang\` (An, Binh, Chi, Dung) và \`don_hang\`. An có 2 đơn, Binh và Chi mỗi người 1 đơn, còn **Dung chưa mua gì**. Ghi nhớ chi tiết "Dung" đó — nó sẽ cho thấy sự khác nhau giữa các loại JOIN. Mọi kết quả bên dưới là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🔗 JOIN — GHÉP HAI BẢNG THEO KHOÁ

Ý tưởng: mỗi \`don_hang\` có cột \`khach_id\` trỏ tới \`khach_hang.id\`. \`JOIN\` dùng mối nối đó để đặt hai bảng cạnh nhau:

\`\`\`sql
SELECT k.ten, d.tong_tien, d.ngay
FROM khach_hang k
JOIN don_hang d ON d.khach_id = k.id
ORDER BY k.ten, d.id;
\`\`\`

\`\`\`
 ten  | tong_tien |    ngay
------+-----------+------------
 An   |    500000 | 2026-08-01
 An   |    300000 | 2026-08-03
 Binh |    900000 | 2026-08-02
 Chi  |    250000 | 2026-08-05
(4 rows)
\`\`\`

Ba điều cốt lõi:
- **\`ON d.khach_id = k.id\`** — *điều kiện ghép*: nối dòng đơn hàng với dòng khách có \`id\` khớp.
- **Bí danh bảng** (\`khach_hang k\`, \`don_hang d\`) — viết \`k.ten\`, \`d.tong_tien\` cho ngắn và rõ cột thuộc bảng nào (bắt buộc khi hai bảng có cột trùng tên).
- Khách An xuất hiện **hai lần** — đúng, vì An có hai đơn. JOIN ghép theo *từng cặp khớp*.

━━━━━━━━━━━━━━━━━━━━

✅ INNER JOIN — CHỈ GIỮ DÒNG KHỚP CẢ HAI BÊN

\`JOIN\` (viết đầy đủ là \`INNER JOIN\`) chỉ trả về những dòng có **cặp khớp ở cả hai bảng**. Để ý kết quả trên **không có Dung** — vì Dung chưa có đơn nào, không có gì để ghép. Đây là hành vi mặc định, và thường là thứ bạn muốn: "danh sách các đơn kèm tên người mua".

Nhưng đôi khi bạn *cần* thấy cả Dung — ví dụ "danh sách tất cả khách, kèm tổng chi tiêu (kể cả người chưa mua)". Lúc đó INNER JOIN làm mất Dung. Ta cần một loại JOIN khác.

━━━━━━━━━━━━━━━━━━━━

⬅️ LEFT JOIN — GIỮ MỌI DÒNG BẢNG BÊN TRÁI

\`LEFT JOIN\` giữ **toàn bộ** dòng của bảng bên trái (\`khach_hang\`), và ghép đơn hàng nếu có; không có thì điền NULL:

\`\`\`sql
SELECT k.ten, d.tong_tien
FROM khach_hang k
LEFT JOIN don_hang d ON d.khach_id = k.id
ORDER BY k.ten, d.id;
\`\`\`

\`\`\`
 ten  | tong_tien
------+-----------
 An   |    500000
 An   |    300000
 Binh |    900000
 Chi  |    250000
 Dung |    (null)
(5 rows)
\`\`\`

Giờ **Dung xuất hiện**, với \`tong_tien = (null)\` (không có đơn). "Bên trái" là bảng viết sau \`FROM\`. Ngoài ra còn:
- **\`RIGHT JOIN\`** — giữ mọi dòng bảng bên phải (ít dùng hơn; thường người ta đổi thứ tự bảng rồi dùng LEFT).
- **\`FULL JOIN\`** — giữ mọi dòng của **cả hai** bảng.

━━━━━━━━━━━━━━━━━━━━

🔍 MẪU HAY DÙNG: TÌM DÒNG KHÔNG KHỚP

Kết hợp \`LEFT JOIN\` với \`IS NULL\` cho một câu hỏi rất thực tế — "khách nào **chưa** mua gì?":

\`\`\`sql
SELECT k.ten
FROM khach_hang k
LEFT JOIN don_hang d ON d.khach_id = k.id
WHERE d.id IS NULL;
\`\`\`

\`\`\`
 ten
------
 Dung
(1 row)
\`\`\`

Logic: LEFT JOIN giữ mọi khách; những khách không có đơn sẽ có cột \`d.id\` là NULL; lọc \`WHERE d.id IS NULL\` chỉ còn lại đúng họ. Mẫu này trả lời vô số câu thật: "sản phẩm nào chưa từng bán?", "nhân viên nào chưa có dự án?"…

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Tin vui lớn: **\`JOIN\` là chuẩn SQL, giống hệt ở cả hai hệ.** \`INNER JOIN\`, \`LEFT JOIN\`, \`RIGHT JOIN\`, \`FULL JOIN ... ON\` chạy y như nhau trên PostgreSQL và SQL Server. (Lưu ý nhỏ: SQL Server xưa có cú pháp nối cũ \`WHERE a.id *= b.id\` — đã bỏ từ lâu, đừng dùng; luôn viết \`JOIN ... ON\` tường minh.)

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết câu lấy tên khách + thành phố + tổng tiền từng đơn (INNER JOIN).
2. Dùng \`LEFT JOIN\` liệt kê MỌI khách kèm số tiền đơn (người chưa mua hiện NULL).
3. Đổi \`LEFT JOIN\` thành \`RIGHT JOIN\` (đảo thứ tự bảng) — kết quả có đổi không? Vì sao?
4. Tìm mọi khách ở "Ha Noi" *và* đã có ít nhất một đơn.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`JOIN\` là trái tim của cơ sở dữ liệu quan hệ: nó ghép dữ liệu đã tách ra nhiều bảng trở lại thành câu trả lời có nghĩa. \`INNER JOIN\` giữ dòng khớp cả hai bên; \`LEFT JOIN\` giữ mọi dòng bảng trái (điền NULL khi không khớp); và \`LEFT JOIN + IS NULL\` tìm ra "những cái chưa có cặp". Nắm ba thứ này, bạn đã mở được cánh cửa lớn nhất của SQL.

Hôm nay ta nối hai bảng. Nhưng dữ liệu thật thường trải trên ba, bốn bảng — đơn hàng có *chi tiết*, chi tiết trỏ tới *sản phẩm*. Và có khi một bảng cần tự nối với chính nó (nhân viên và quản lý cùng nằm trong bảng nhân viên). Đó là ngày mai.

Ngày 12: **Nối 3+ bảng & self-join** — ghép \`khach_hang → don_hang → chi_tiet → san_pham\` trong một truy vấn, và cho một bảng tự nối chính nó để tìm "ai là sếp của ai". Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
