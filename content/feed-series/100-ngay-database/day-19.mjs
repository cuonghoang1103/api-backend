/** "100 Ngày Database với CuongThai" — Ngày 19: Window functions P2.
    Tổng chạy dồn (SUM OVER ORDER BY), LAG/LEAD (nhìn dòng trước/sau), chênh
    lệch so kỳ trước, và ý niệm khung cửa sổ (frame) cho trung bình trượt.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day19). Chuẩn SQL — SQL Server y hệt. */
export default {
  day: 19,
  card: 'db-day-19',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'running-total-with-sum-over',
    title: 'Tổng chạy dồn với SUM() OVER',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 19: WINDOW FUNCTIONS (P2) — CỘNG DỒN & NHÌN LÂN CẬN

Ngày 18 dùng window để *xếp hạng*. Hôm nay ta khai thác khả năng thứ hai, thực dụng không kém: **nhìn qua các dòng lân cận trong cửa sổ**. Nhờ đó ta tính được *tổng chạy dồn* (doanh thu tích luỹ theo tháng) và *so một dòng với dòng trước* (tháng này tăng/giảm so tháng trước) — những phép ở lõi của mọi báo cáo xu hướng, mà không cần self-join rườm rà. Dùng một bảng doanh thu 5 tháng; kết quả là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

📊 TỔNG CHẠY DỒN — HÀM GỘP + OVER(ORDER BY)

Bí quyết: đặt \`ORDER BY\` *bên trong* \`OVER\`. Khi đó hàm gộp không tính trên toàn bộ, mà tính **tích luỹ tới từng dòng**:

\`\`\`sql
SELECT thang, tien, sum(tien) OVER (ORDER BY thang) AS cong_don
FROM doanh_thu ORDER BY thang;
\`\`\`

\`\`\`
 thang | tien | cong_don
-------+------+----------
     1 |  100 |      100
     2 |  150 |      250
     3 |  120 |      370
     4 |  200 |      570
     5 |  180 |      750
(5 rows)
\`\`\`

Cột \`cong_don\` là **doanh thu tích luỹ**: tháng 2 = 100+150 = 250, tháng 3 = 250+120 = 370… Mỗi dòng cộng gộp chính nó và mọi dòng đứng trước theo thứ tự \`thang\`. Đây là "running total" — bạn thấy nó trong mọi biểu đồ luỹ kế, số dư tài khoản, tiến độ tích luỹ.

*(Vì sao lại là "tới dòng hiện tại"? Vì khi có \`ORDER BY\` trong \`OVER\`, khung cửa sổ mặc định là "từ đầu đến dòng hiện tại". Ta nói thêm về khung ở phần cuối.)*

━━━━━━━━━━━━━━━━━━━━

👀 LAG & LEAD — NHÌN DÒNG TRƯỚC VÀ SAU

\`LAG\` lấy giá trị của dòng **phía trước**, \`LEAD\` của dòng **phía sau** (trong thứ tự cửa sổ) — thẳng vào cùng một hàng kết quả:

\`\`\`sql
SELECT thang, tien,
  lag(tien)  OVER (ORDER BY thang) AS thang_truoc,
  lead(tien) OVER (ORDER BY thang) AS thang_sau
FROM doanh_thu ORDER BY thang;
\`\`\`

\`\`\`
 thang | tien | thang_truoc | thang_sau
-------+------+-------------+-----------
     1 |  100 |      (null) |       150
     2 |  150 |         100 |       120
     3 |  120 |         150 |       200
     4 |  200 |         120 |       180
     5 |  180 |         200 |    (null)
(5 rows)
\`\`\`

Tháng 1 không có tháng trước → \`thang_truoc\` là NULL; tháng 5 không có tháng sau → \`thang_sau\` NULL. Trước khi có window functions, để đặt "giá trị tháng trước" cạnh "tháng này" người ta phải self-join lệch một bậc — rắc rối và chậm. \`LAG\`/\`LEAD\` làm điều đó gọn trong một dòng.

━━━━━━━━━━━━━━━━━━━━

📉 GHÉP LẠI: TĂNG/GIẢM SO KỲ TRƯỚC

Kết hợp phép trừ với \`LAG\` cho ra "chênh lệch so tháng trước" — con số mà mọi dashboard đều hiện:

\`\`\`sql
SELECT thang, tien,
  tien - lag(tien) OVER (ORDER BY thang) AS thay_doi
FROM doanh_thu ORDER BY thang;
\`\`\`

\`\`\`
 thang | tien | thay_doi
-------+------+----------
     1 |  100 |   (null)
     2 |  150 |       50
     3 |  120 |      -30
     4 |  200 |       80
     5 |  180 |      -20
(5 rows)
\`\`\`

Tháng 2 tăng 50, tháng 3 giảm 30, tháng 4 tăng 80… Chỉ một dòng SQL cho ra toàn bộ xu hướng tăng–giảm. (Muốn ra *phần trăm* thay đổi? Chia thêm cho \`lag(tien)\` — thử ở bài tập.)

━━━━━━━━━━━━━━━━━━━━

🪟 KHUNG CỬA SỔ (FRAME) — MỘT BƯỚC NỮA

Bạn còn điều khiển được *chính xác* những dòng nào tham gia tính, bằng mệnh đề khung: \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\` — "dòng hiện tại và 2 dòng trước". Đây là cách tính **trung bình trượt** (moving average), làm mượt một chuỗi số:

\`\`\`sql
avg(tien) OVER (ORDER BY thang ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
\`\`\`

Không cần thuộc lòng cú pháp khung ngay; chỉ cần biết: mặc định (khi có \`ORDER BY\`) là "từ đầu tới dòng hiện tại" (nên \`sum\` thành running total), và bạn *có thể* thu hẹp khung để tính trên một cửa sổ trượt.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt**: \`sum() OVER (ORDER BY ...)\`, \`LAG\`, \`LEAD\`, và cả mệnh đề khung \`ROWS BETWEEN ...\` đều là chuẩn SQL, cả hai hỗ trợ đầy đủ. \`LAG\`/\`LEAD\` ở hai hệ còn nhận tham số bù trừ và giá trị mặc định giống nhau: \`lag(tien, 1, 0)\` = "lùi 1 dòng, nếu không có thì 0".

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tính **phần trăm** thay đổi so tháng trước: \`round(100.0 * (tien - lag(tien)) / lag(tien), 1)\`.
2. Thêm cột **trung bình trượt 3 tháng** bằng khung \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\`.
3. Dùng \`lead\` để đánh dấu tháng nào **sắp** giảm (tháng sau thấp hơn tháng này).
4. Cộng dồn doanh thu **theo từng năm** (gợi ý: \`PARTITION BY nam ORDER BY thang\`).

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Window functions không chỉ xếp hạng — chúng còn *nhìn qua các dòng lân cận*: \`sum() OVER (ORDER BY ...)\` cho tổng chạy dồn, \`LAG\`/\`LEAD\` đặt dòng trước/sau ngay cạnh dòng hiện tại, và ghép chúng lại cho ra tăng/giảm so kỳ trước — nền của mọi phân tích xu hướng. Thêm khung cửa sổ, bạn có cả trung bình trượt. Đây là bộ công cụ phân tích mạnh nhất của SQL thuần.

Ta đã đi gần trọn Giai đoạn 2. Còn một mảnh ghép: khi bạn có *hai* tập kết quả và muốn **gộp**, **giao**, hoặc **trừ** chúng như các tập hợp toán học. Đó là set operations, và là bài khép lại chặng Truy vấn.

Ngày 20: **Set operations** — \`UNION\` (gộp, bỏ trùng), \`UNION ALL\` (gộp, giữ trùng), \`INTERSECT\` (phần chung), \`EXCEPT\` (phần riêng) — khép Giai đoạn 2. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
