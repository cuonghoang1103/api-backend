/** "100 Ngày Database với CuongThai" — Ngày 4: Kiểu dữ liệu.
    5 kiểu hay dùng nhất, bẫy float-cho-tiền (0.1+0.2), kiểu tự bảo vệ (chặn
    kiểu sai / chuỗi quá dài), DATE làm toán được.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day04). Ghi chú SQL Server (DECIMAL, BIT) ở chỗ khác biệt. */
export default {
  day: 4,
  card: 'db-day-04',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'pick-the-right-data-types',
    title: 'Chọn đúng kiểu dữ liệu',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 4: KIỂU DỮ LIỆU — CHỌN ĐÚNG LÀ ĐƯỢC BẢO VỆ

Ngày 3 ta đã tính "thành tiền" với cột \`gia\` kiểu \`INT\`. Nhưng vì sao là \`INT\` mà không phải \`TEXT\`? Câu trả lời là toàn bộ bài hôm nay — vì **chọn kiểu dữ liệu là quyết định thiết kế quan trọng bậc nhất**. Chọn đúng, dữ liệu tự bảo vệ mình khỏi rác. Chọn sai, bạn rước lỗi âm thầm mà ba tháng sau mới nổ.

Ta sẽ gặp năm kiểu bạn dùng 90% thời gian, một cái bẫy kinh điển về **tiền**, và cách kiểu dữ liệu chặn rác ngay tại cửa.

━━━━━━━━━━━━━━━━━━━━

🧱 NĂM KIỂU HAY DÙNG NHẤT

\`\`\`sql
CREATE TABLE vi_du (
  so_nguyen INTEGER,        -- số nguyên: 42, -7, 1000000
  chuoi     VARCHAR(20),    -- chuỗi tối đa 20 ký tự (hoặc TEXT: không giới hạn)
  tien      NUMERIC(12,2),  -- số thập phân CHÍNH XÁC: 199000.50
  co_that   BOOLEAN,        -- đúng/sai: true / false
  ngay      DATE            -- ngày tháng: 2026-08-09
);
\`\`\`

- **INTEGER** — số nguyên. Có \`BIGINT\` cho số rất lớn (id, tiền tính bằng đồng lẻ…), \`SMALLINT\` cho số nhỏ.
- **TEXT / VARCHAR(n)** — chuỗi. \`TEXT\` không giới hạn độ dài; \`VARCHAR(n)\` chặn ở \`n\` ký tự (dùng khi muốn giới hạn, ví dụ mã số 10 ký tự). Trong PostgreSQL, \`TEXT\` và \`VARCHAR\` gần như giống nhau về hiệu năng — cứ dùng \`TEXT\` nếu không cần giới hạn.
- **NUMERIC(p,s)** — số thập phân chính xác (còn gọi \`DECIMAL\`). \`p\` = tổng chữ số, \`s\` = số chữ số sau dấu phẩy.
- **BOOLEAN** — \`true\`/\`false\` (psql in ra \`t\`/\`f\`).
- **DATE / TIMESTAMP** — ngày (và giờ). Ta đào sâu ngày–giờ–timezone ở giai đoạn sau.

Thêm một dòng hợp lệ, mọi kiểu đúng chỗ:

\`\`\`sql
INSERT INTO vi_du VALUES (42, 'xin chao', 199000.5, true, DATE '2026-08-09');
SELECT * FROM vi_du;
\`\`\`

\`\`\`
 so_nguyen |  chuoi   |   tien    | co_that |    ngay
-----------+----------+-----------+---------+------------
        42 | xin chao | 199000.50 | t       | 2026-08-09
(1 row)
\`\`\`

Chú ý \`199000.5\` được lưu thành \`199000.50\` — \`NUMERIC(12,2)\` luôn giữ đúng 2 số lẻ.

━━━━━━━━━━━━━━━━━━━━

💸 CÁI BẪY ĐẮT GIÁ NHẤT: ĐỪNG DÙNG FLOAT CHO TIỀN

Đây là lỗi khiến các hệ thống thật lệch sổ, và gần như ai cũng dính một lần. Số thực dấu phẩy động (\`float\`/\`double\`, trong PostgreSQL là \`REAL\`/\`float8\`) lưu số bằng **nhị phân**, mà \`0.1\` trong nhị phân là số vô hạn tuần hoàn — nên máy chỉ lưu *xấp xỉ*. Xem tận mắt:

\`\`\`sql
SELECT 0.1::float8  + 0.2::float8  AS float_sai,
       0.1::numeric + 0.2::numeric AS numeric_dung;
\`\`\`

\`\`\`
      float_sai      | numeric_dung
---------------------+--------------
 0.30000000000000004 |          0.3
(1 row)
\`\`\`

\`0.1 + 0.2\` với \`float\` ra **0.30000000000000004** — sai ở số thứ 17! Với tiền bạc, những sai số li ti này cộng dồn qua hàng triệu giao dịch thành lệch sổ thật. \`NUMERIC\` thì tính **chính xác tuyệt đối** như bạn viết tay, cho ra đúng \`0.3\`.

**Luật vàng:** tiền, tỉ giá, số lượng cần chính xác → luôn \`NUMERIC\`. \`float\` chỉ dành cho đại lượng khoa học chấp nhận xấp xỉ (nhiệt độ, toạ độ, cân nặng đo được…).

━━━━━━━━━━━━━━━━━━━━

🛡️ KIỂU DỮ LIỆU TỰ BẢO VỆ — RÁC BỊ CHẶN TẠI CỬA

Vì mỗi cột có kiểu, PostgreSQL từ chối dữ liệu không hợp kiểu **ngay lúc ghi**. Nhét chữ vào cột số:

\`\`\`sql
INSERT INTO vi_du (so_nguyen) VALUES ('bon hai');
\`\`\`

\`\`\`
ERROR:  invalid input syntax for type integer: "bon hai"
\`\`\`

Nhét chuỗi 42 ký tự vào \`VARCHAR(20)\`:

\`\`\`sql
INSERT INTO vi_du (chuoi) VALUES ('chuoi nay chac chan dai hon hai muoi ky tu');
\`\`\`

\`\`\`
ERROR:  value too long for type character varying(20)
\`\`\`

Bạn **không viết một dòng kiểm tra nào** — kiểu dữ liệu tự làm. Đây là điều Ngày 1 đã hứa: dữ liệu sai không vào được ngay từ đầu, thay vì lọt vào rồi nổ về sau.

━━━━━━━━━━━━━━━━━━━━

📅 KIỂU ĐÚNG MỞ RA PHÉP TOÁN ĐÚNG

Chọn \`DATE\` (thay vì lưu ngày dưới dạng \`TEXT\`) cho bạn làm toán trên lịch:

\`\`\`sql
SELECT DATE '2026-12-31' - DATE '2026-08-09' AS so_ngay_con_lai;
\`\`\`

\`\`\`
 so_ngay_con_lai
-----------------
             144
(1 row)
\`\`\`

Trừ hai ngày ra **số ngày** giữa chúng. Nếu \`ngay\` là \`TEXT\` (\`'2026-12-31'\`), phép trừ này vô nghĩa, và so sánh \`'2026-9-1' > '2026-12-31'\` còn cho kết quả SAI (so sánh chuỗi theo bảng chữ cái). Kiểu đúng = ý nghĩa đúng.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

- **Số thập phân chính xác:** PostgreSQL \`NUMERIC(p,s)\` · SQL Server \`DECIMAL(p,s)\` (hai tên này đồng nghĩa ở cả hai hệ). Kết luận về tiền **giống hệt**: dùng DECIMAL/NUMERIC, tránh \`FLOAT\`/\`REAL\`. SQL Server còn có kiểu \`MONEY\` riêng, nhưng nhiều người vẫn ưa \`DECIMAL\` cho rõ ràng.
- **Boolean:** PostgreSQL có \`BOOLEAN\` thật. SQL Server **không có** — dùng \`BIT\` (0/1) thay thế.
- **Chuỗi:** cả hai đều có \`VARCHAR(n)\`; PostgreSQL thêm \`TEXT\` (không giới hạn), SQL Server dùng \`VARCHAR(MAX)\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chạy lại \`SELECT 0.1::float8 * 3;\` và \`SELECT 0.1::numeric * 3;\` — cái nào ra đúng \`0.3\`?
2. Với một sản phẩm giá 19.990 đồng, kiểu nào lưu đúng? Vì sao không phải \`REAL\`?
3. Thử tạo cột \`ma_so VARCHAR(5)\` rồi chèn \`'ABCDEF'\` — bạn nhận lỗi gì?
4. Lưu "ngày sinh" bằng \`TEXT\` thì mất những khả năng gì so với \`DATE\`?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Kiểu dữ liệu không phải thủ tục rườm rà — nó là lớp phòng thủ đầu tiên của CSDL. \`INTEGER\`, \`TEXT\`, \`NUMERIC\`, \`BOOLEAN\`, \`DATE\` phủ hầu hết nhu cầu; nhớ đời **tiền dùng NUMERIC, đừng float**; và chọn kiểu đúng để dữ liệu tự chặn rác và mở ra phép toán đúng.

Kiểu mới chỉ nói *một ô* chứa gì. Nhưng còn những luật ở mức *cả dòng, cả bảng* — "mã này phải duy nhất", "điểm phải từ 0 đến 10", "cột này không được trống". Đó là **ràng buộc**, và là bài ngày mai.

Ngày 5: **Ràng buộc** — \`PRIMARY KEY\`, \`NOT NULL\`, \`UNIQUE\`, \`CHECK\`, \`DEFAULT\`: biến các quy tắc nghiệp vụ thành luật mà CSDL tự cưỡng chế. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
