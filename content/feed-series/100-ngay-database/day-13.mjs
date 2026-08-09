/** "100 Ngày Database với CuongThai" — Ngày 13: GROUP BY & HAVING.
    Hàm gộp (COUNT/SUM/AVG/MIN/MAX), GROUP BY gộp nhóm, HAVING lọc nhóm, và
    thứ tự WHERE (lọc dòng) → GROUP BY → HAVING (lọc nhóm).

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day13). Chuẩn SQL — SQL Server y hệt. */
export default {
  day: 13,
  card: 'db-day-13',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'group-rows-with-group-by',
    title: 'Gộp nhóm với GROUP BY',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 13: GROUP BY & HAVING

Tới giờ mọi truy vấn của ta trả về *từng dòng*. Nhưng rất nhiều câu hỏi thật lại cần **con số tổng hợp**: "tổng doanh thu là bao nhiêu?", "mỗi thành phố có mấy đơn?", "khách nào chi nhiều nhất?". Trả lời chúng nghĩa là **nén nhiều dòng thành một con số** — và đó là công việc của **hàm gộp** cùng \`GROUP BY\`. Đây là bước nhảy tư duy quan trọng của SQL. Mọi kết quả là thật từ psql, trên một bảng 6 đơn hàng.

━━━━━━━━━━━━━━━━━━━━

🧮 HÀM GỘP — NÉN NHIỀU DÒNG THÀNH MỘT SỐ

Năm hàm gộp bạn dùng suốt đời: \`count\` (đếm), \`sum\` (tổng), \`avg\` (trung bình), \`min\`, \`max\`. Áp lên cả bảng:

\`\`\`sql
SELECT count(*) AS so_don, sum(tong_tien) AS tong, round(avg(tong_tien)) AS trung_binh
FROM don_hang;
\`\`\`

\`\`\`
 so_don |  tong   | trung_binh
--------+---------+------------
      6 | 2750000 |     458333
(1 row)
\`\`\`

Sáu dòng đơn hàng → **một dòng** tổng kết. Nhớ lại Ngày 6: \`count(*)\` đếm mọi dòng, còn \`count(cot)\` bỏ qua NULL — khác biệt quan trọng khi tính trung bình.

━━━━━━━━━━━━━━━━━━━━

📦 GROUP BY — TÍNH GỘP CHO TỪNG NHÓM

Sức mạnh thật đến khi bạn không gộp cả bảng, mà gộp **theo từng nhóm**. \`GROUP BY thanh_pho\` chia các dòng thành các nhóm cùng thành phố, rồi tính hàm gộp cho *mỗi* nhóm:

\`\`\`sql
SELECT thanh_pho, count(*) AS so_don, sum(tong_tien) AS doanh_thu
FROM don_hang
GROUP BY thanh_pho
ORDER BY doanh_thu DESC;
\`\`\`

\`\`\`
 thanh_pho | so_don | doanh_thu
-----------+--------+-----------
 HCM       |      3 |   1700000
 Ha Noi    |      3 |   1050000
(2 rows)
\`\`\`

Mỗi thành phố giờ là **một dòng** với số đơn và doanh thu riêng. Đây là nền của mọi báo cáo. Nhóm theo khách cũng vậy — cho ra bảng xếp hạng khách hàng theo tổng chi.

**Một luật vàng dễ sai:** mọi cột trong \`SELECT\` phải **hoặc** nằm trong \`GROUP BY\`, **hoặc** là một hàm gộp. Viết \`SELECT khach, tong_tien FROM ... GROUP BY khach\` sẽ lỗi — vì mỗi nhóm \`khach\` có *nhiều* \`tong_tien\`, máy không biết chọn cái nào. Phải gộp nó lại (\`sum(tong_tien)\`).

━━━━━━━━━━━━━━━━━━━━

✂️ HAVING — LỌC TRÊN KẾT QUẢ ĐÃ GỘP

Bạn đã biết \`WHERE\` lọc dòng. Nhưng làm sao lọc theo *kết quả gộp* — ví dụ "chỉ các thành phố doanh thu trên 1,5 triệu"? \`WHERE\` không dùng được ở đây (nó chạy *trước* khi gộp, chưa có tổng). Đó là lý do \`HAVING\` tồn tại:

\`\`\`sql
SELECT thanh_pho, sum(tong_tien) AS doanh_thu
FROM don_hang
GROUP BY thanh_pho
HAVING sum(tong_tien) > 1500000;
\`\`\`

\`\`\`
 thanh_pho | doanh_thu
-----------+-----------
 HCM       |   1700000
(1 row)
\`\`\`

Ha Noi (1.050.000) bị loại, chỉ HCM còn lại. **\`HAVING\` là "WHERE cho các nhóm"** — nó lọc *sau* khi gộp, và dùng được hàm gộp.

━━━━━━━━━━━━━━━━━━━━

🔢 THỨ TỰ THỰC THI: WHERE → GROUP BY → HAVING

Hiểu đúng thứ tự này là hiểu trọn phần gộp. Máy chạy theo trình tự:
1. **\`WHERE\`** — lọc *dòng* (trước khi gộp).
2. **\`GROUP BY\`** — chia nhóm và tính hàm gộp.
3. **\`HAVING\`** — lọc *nhóm* (sau khi gộp).

Ví dụ dùng cả hai: "khách nào có **từ 2 đơn trở lên**, chỉ tính các đơn **từ 300k**?":

\`\`\`sql
SELECT khach, count(*) AS so_don, sum(tong_tien) AS tong
FROM don_hang
WHERE tong_tien >= 300000     -- (1) bỏ các đơn nhỏ TRƯỚC khi gộp
GROUP BY khach                -- (2) gộp theo khách
HAVING count(*) >= 2          -- (3) chỉ giữ nhóm >= 2 đơn
ORDER BY khach;
\`\`\`

\`\`\`
 khach | so_don |  tong
-------+--------+--------
 An    |      2 | 800000
(1 row)
\`\`\`

\`WHERE\` loại các đơn dưới 300k (Chi và một đơn 100k của Binh biến mất), rồi mới gộp, rồi \`HAVING\` chỉ giữ khách còn ≥ 2 đơn — cuối cùng chỉ An thoả. Nắm được luồng này, bạn viết được mọi báo cáo phức tạp.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt** ở cả hai hệ: các hàm gộp, \`GROUP BY\`, \`HAVING\`, và cả luật "cột SELECT phải trong GROUP BY hoặc là hàm gộp" — đều là chuẩn SQL. Vài khác biệt rất nhỏ ở hàm chuỗi gộp (PostgreSQL \`string_agg\`, SQL Server \`STRING_AGG\` — gần như giống), nhưng ý niệm không đổi.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tính tổng và trung bình đơn của **mỗi khách**, sắp theo tổng giảm dần.
2. Tìm các khách có **nhiều hơn 1 đơn** (dùng \`HAVING count(*) > 1\`).
3. Thành phố nào có đơn **lớn nhất** vượt 800k? (gợi ý: \`HAVING max(tong_tien) > 800000\`).
4. Giải thích vì sao \`WHERE sum(tong_tien) > 1000000\` báo lỗi, còn \`HAVING\` thì không.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Hàm gộp nén nhiều dòng thành một con số; \`GROUP BY\` làm điều đó cho *từng nhóm*, biến dữ liệu thô thành báo cáo; \`HAVING\` lọc các nhóm theo kết quả gộp. Và chìa khoá là thứ tự **WHERE (dòng) → GROUP BY (nhóm) → HAVING (nhóm)**. Đây là bộ công cụ phân tích cốt lõi — mọi dashboard, mọi thống kê đều dựng trên nó.

Nhưng có những câu hỏi cần *so sánh với một kết quả tính trước* — "khách nào chi trên **mức trung bình**?". Để trả lời, ta cần một truy vấn *bên trong* một truy vấn. Đó là subquery, chủ đề ngày mai.

Ngày 14: **Subquery** — truy vấn lồng trong truy vấn: dùng kết quả của câu này làm đầu vào cho câu kia (giá trị đơn, danh sách với \`IN\`, bảng tạm trong \`FROM\`). Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
