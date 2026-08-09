/** "100 Ngày Database với CuongThai" — Ngày 3: SELECT sâu hơn.
    Chọn đúng cột (thay vì *), đặt tên lại bằng AS, tạo cột tính toán, ghép
    chuỗi bằng ||, lọc trùng bằng DISTINCT.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day03). Ghi chú SQL Server ở chỗ khác biệt (|| vs + / CONCAT). */
export default {
  day: 3,
  card: 'db-day-03',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'choose-specific-columns',
    title: 'Chọn đúng cột cần lấy',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 3: SELECT — LẤY ĐÚNG THỨ CẦN

Ngày 2 bạn đã đi trọn vòng đời CRUD và dùng \`SELECT *\` để "lấy hết ra". Nhưng \`SELECT\` mạnh hơn thế nhiều: nó không chỉ *lấy* dữ liệu, nó còn *biến đổi* dữ liệu ngay khi lấy — chọn đúng cột, đặt tên lại, tính toán, ghép chuỗi, lọc trùng. Hôm nay ta khai thác đúng phần đó.

Ta dùng một bảng sản phẩm nhỏ (đã \`INSERT\` 5 dòng, mọi kết quả bên dưới là thật):

\`\`\`sql
CREATE TABLE san_pham (
  id SERIAL PRIMARY KEY, ten TEXT, danh_muc TEXT, gia INT, so_luong INT
);
\`\`\`

━━━━━━━━━━━━━━━━━━━━

📋 CHỌN ĐÚNG CỘT — ĐỪNG QUEN TAY SELECT *

\`SELECT *\` nghĩa là "cho tôi **mọi** cột". Tiện khi khám phá, nhưng trong code thật nên nêu rõ cột cần:

\`\`\`sql
SELECT ten, gia FROM san_pham ORDER BY id;
\`\`\`

\`\`\`
     ten     |   gia
-------------+---------
 Ban phim co |  890000
 Chuot game  |  550000
 Man hinh 27 | 4200000
 Tai nghe    | 1200000
 Man hinh 24 | 2800000
(5 rows)
\`\`\`

Vì sao nên chọn cột cụ thể? Ba lý do thật: (1) **rõ ràng** — người đọc biết ngay câu này cần gì; (2) **nhanh hơn** — không kéo về những cột không dùng (tưởng tượng cột \`mo_ta\` dài hàng nghìn ký tự); (3) **ổn định** — nếu ai đó thêm/bớt cột trong bảng, \`SELECT *\` đổi hình dạng kết quả không báo trước, còn danh sách cột tường minh thì không.

━━━━━━━━━━━━━━━━━━━━

🏷️ AS — ĐẶT TÊN LẠI CHO CỘT KẾT QUẢ

Tên cột trong bảng thường viết không dấu, cụt lủn (\`gia\`, \`so_luong\`). Khi trả kết quả, bạn có thể đặt tên đẹp hơn bằng \`AS\`:

\`\`\`sql
SELECT ten AS san_pham, gia AS don_gia FROM san_pham;
\`\`\`

\`AS\` chỉ đổi **nhãn của cột trong kết quả** — dữ liệu gốc trong bảng không hề thay đổi. Nếu muốn tên có dấu cách hay chữ hoa, bọc trong nháy kép: \`gia AS "Đơn giá"\`. (Từ khoá \`AS\` thậm chí có thể bỏ — \`gia don_gia\` cũng chạy — nhưng viết \`AS\` cho rõ nghĩa.)

━━━━━━━━━━━━━━━━━━━━

🧮 CỘT TÍNH TOÁN — SELECT LÀ MỘT BIỂU THỨC

Đây là chỗ nhiều người mới bất ngờ: bạn **tính toán ngay trong \`SELECT\`**, tạo ra cột mới không có sẵn trong bảng. Ví dụ "thành tiền" = đơn giá × số lượng:

\`\`\`sql
SELECT ten AS san_pham, gia * so_luong AS thanh_tien
FROM san_pham
ORDER BY thanh_tien DESC;
\`\`\`

\`\`\`
  san_pham   | thanh_tien
-------------+------------
 Man hinh 24 |   16800000
 Man hinh 27 |    8400000
 Tai nghe    |    4800000
 Chuot game  |    2750000
 Ban phim co |    2670000
(5 rows)
\`\`\`

Cột \`thanh_tien\` không tồn tại trong bảng — nó được **tính khi truy vấn**. Và bạn thấy đấy, còn \`ORDER BY\` được theo chính cột vừa tính, cho ra bảng xếp hạng doanh thu tiềm năng. Trong \`SELECT\` bạn dùng được mọi phép \`+ - * /\`, hàm dựng sẵn (\`round()\`, \`upper()\`…), và biểu thức điều kiện — tất cả sẽ gặp dần.

━━━━━━━━━━━━━━━━━━━━

🔗 GHÉP CHUỖI & 🧹 LỌC TRÙNG

**Nối chuỗi** bằng toán tử \`||\` — tạo một nhãn gộp:

\`\`\`sql
SELECT ten || ' (' || danh_muc || ')' AS nhan FROM san_pham ORDER BY id;
\`\`\`

\`\`\`
          nhan
------------------------
 Ban phim co (Phu kien)
 Chuot game (Phu kien)
 Man hinh 27 (Man hinh)
 Tai nghe (Phu kien)
 Man hinh 24 (Man hinh)
(5 rows)
\`\`\`

**Lọc trùng** bằng \`DISTINCT\` — bảng có 5 dòng nhưng chỉ 2 danh mục:

\`\`\`sql
SELECT DISTINCT danh_muc FROM san_pham ORDER BY danh_muc;
\`\`\`

\`\`\`
 danh_muc
----------
 Man hinh
 Phu kien
(2 rows)
\`\`\`

\`DISTINCT\` gom các dòng có cùng giá trị lại thành một. Rất hay dùng để trả lời "có những loại nào?", "những khách hàng nào từng mua?"…

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

- **Nối chuỗi:** PostgreSQL dùng \`||\` (chuẩn SQL). SQL Server **không bật \`||\` mặc định** — bên đó nối bằng \`+\` (\`ten + ' (' + danh_muc + ')'\`) hoặc hàm \`CONCAT(...)\`. Hàm \`CONCAT()\` thực ra chạy được ở **cả hai** và an toàn hơn với NULL, nên nếu muốn viết code chạy mọi nơi thì ưu tiên \`CONCAT\`.
- **AS, DISTINCT, cột tính toán, ORDER BY theo alias:** giống nhau ở cả hai hệ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết câu trả về \`ten\` và \`gia\` **giảm 10%** (gợi ý: \`gia * 0.9\`), đặt tên cột là \`gia_km\`.
2. Ghép \`ten\` và \`gia\` thành một nhãn kiểu \`"Tai nghe: 1200000d"\`.
3. Đếm xem bảng có mấy danh mục khác nhau (dùng \`DISTINCT\`, ta sẽ học \`COUNT(DISTINCT ...)\` sau).
4. Vì sao \`SELECT *\` trong code sản phẩm thật lại bị coi là thói quen xấu?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`SELECT\` không chỉ đọc — nó **chọn, đổi tên, tính toán, ghép, lọc trùng**. Nắm chắc điều này, bạn đã có công cụ định hình dữ liệu đầu ra theo ý mình, chưa cần đụng tới bảng khác. Đây là nền để mọi truy vấn phức tạp sau này dựng lên.

Nhưng có một câu hỏi ta lướt qua: vì sao \`gia\` là \`INT\` mà không phải \`TEXT\`? Chọn sai kiểu dữ liệu là nguồn gốc của vô số lỗi. Ngày mai ta xử lý nó.

Ngày 4: **Kiểu dữ liệu** — \`INTEGER\`, \`TEXT\`/\`VARCHAR\`, \`NUMERIC\` (tiền phải dùng nó, không phải số thực!), \`BOOLEAN\`, \`DATE\`/\`TIMESTAMP\` — chọn đúng kiểu để dữ liệu tự bảo vệ mình. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
