/** "100 Ngày Database với CuongThai" — Ngày 20: Set operations (khép GĐ2).
    UNION (bỏ trùng), UNION ALL (giữ trùng), INTERSECT (phần chung), EXCEPT
    (phần riêng). Điều kiện cùng số cột + kiểu hợp. Tổng kết Giai đoạn 2.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day20). Chuẩn SQL — SQL Server y hệt. */
export default {
  day: 20,
  card: 'db-day-20',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'set-operations-union-intersect-except',
    title: 'Set operations: UNION, INTERSECT, EXCEPT',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 20: SET OPERATIONS — GỘP, GIAO, TRỪ (KHÉP GIAI ĐOẠN 2)

Ngày 11 ta nối bảng theo *chiều ngang* (JOIN ghép cột). Set operations làm điều khác: chúng ghép hai tập kết quả theo *chiều dọc* — xếp chồng các dòng — và cho phép làm toán tập hợp trên chúng: **gộp**, **giao**, **trừ**. Đây là công cụ gọn gàng cho các câu hỏi kiểu "ai mua cả hai năm?", "khách nào đã rời bỏ?". Và với bài này, ta khép lại Giai đoạn 2 — Truy vấn. Kết quả là thật từ psql, trên hai bảng: khách mua năm 2025 và khách mua năm 2026.

━━━━━━━━━━━━━━━━━━━━

➕ UNION & UNION ALL — GỘP HAI TẬP

\`UNION\` xếp chồng kết quả hai truy vấn và **bỏ các dòng trùng**:

\`\`\`sql
SELECT ten FROM mua_2025
UNION
SELECT ten FROM mua_2026
ORDER BY ten;
-- -> An, Binh, Chi, Dung, Em   (5 dòng, mỗi tên một lần)
\`\`\`

Binh và Chi mua cả hai năm nhưng chỉ xuất hiện **một lần** — đó là "gộp tập hợp" đúng nghĩa. Nếu bạn *muốn giữ trùng* (và tránh chi phí lọc trùng), dùng \`UNION ALL\`:

\`\`\`sql
SELECT ten FROM mua_2025 UNION ALL SELECT ten FROM mua_2026 ORDER BY ten;
-- -> An, Binh, Binh, Chi, Chi, Dung, Em   (7 dòng, có lặp)
\`\`\`

**Mẹo hiệu năng:** \`UNION\` phải sắp xếp/băm để loại trùng, còn \`UNION ALL\` chỉ nối thẳng — nên **khi bạn biết chắc không có trùng (hoặc không quan tâm), hãy dùng \`UNION ALL\`** cho nhanh. Đây cũng là loại set operation hay dùng nhất.

━━━━━━━━━━━━━━━━━━━━

🔗 INTERSECT — PHẦN CHUNG

\`INTERSECT\` chỉ giữ những dòng **có mặt ở CẢ HAI** tập — trả lời "vừa… vừa…":

\`\`\`sql
SELECT ten FROM mua_2025
INTERSECT
SELECT ten FROM mua_2026
ORDER BY ten;
\`\`\`

\`\`\`
 ten
------
 Binh
 Chi
(2 rows)
\`\`\`

Binh và Chi — những khách trung thành mua **cả hai** năm. Rất tiện cho "khách hàng có ở cả danh sách A lẫn B", "sản phẩm bán ở cả hai chi nhánh".

━━━━━━━━━━━━━━━━━━━━

➖ EXCEPT — PHẦN RIÊNG (CÓ Ở ĐÂY, KHÔNG Ở KIA)

\`EXCEPT\` giữ những dòng có ở tập **trái** nhưng **không** ở tập phải — công cụ vàng để phân tích "mất" và "mới":

\`\`\`sql
-- Khách 2025 nhưng KHÔNG mua lại 2026 (đã rời bỏ):
SELECT ten FROM mua_2025 EXCEPT SELECT ten FROM mua_2026 ORDER BY ten;
-- -> An

-- Khách MỚI của 2026 (không có ở 2025):
SELECT ten FROM mua_2026 EXCEPT SELECT ten FROM mua_2025 ORDER BY ten;
-- -> Dung, Em
\`\`\`

An đã rời bỏ; Dung và Em là khách mới. Chú ý \`EXCEPT\` **không đối xứng**: đổi thứ tự hai tập cho kết quả khác hẳn — đúng như phép trừ. Chỉ hai câu SQL đã cho bạn một phân tích giữ chân khách hàng.

━━━━━━━━━━━━━━━━━━━━

📏 LUẬT CHUNG CHO SET OPERATIONS

Ba điều phải nhớ khi dùng UNION/INTERSECT/EXCEPT:
1. **Cùng số cột** ở hai truy vấn.
2. **Kiểu tương thích** theo từng vị trí cột (cột 1 của hai bên phải hợp kiểu, v.v.).
3. **Tên cột lấy theo truy vấn đầu tiên** — nên đặt \`AS\` ở câu đầu nếu muốn tên đẹp.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt** ở cả hai hệ: \`UNION\`, \`UNION ALL\`, \`INTERSECT\`, \`EXCEPT\` — cùng cú pháp, cùng luật (số cột, kiểu hợp, tên theo câu đầu). Một lưu ý khi gặp hệ khác: **Oracle dùng \`MINUS\` thay cho \`EXCEPT\`** (cùng ý nghĩa) — nhưng PostgreSQL và SQL Server đều dùng \`EXCEPT\`.

━━━━━━━━━━━━━━━━━━━━

✅ KHÉP GIAI ĐOẠN 2 — TRUY VẤN

Nhìn lại 10 ngày vừa qua, bạn đã đi từ "truy vấn một bảng" tới "làm chủ dữ liệu quan hệ":
- **Ngày 11–12:** \`JOIN\` (inner/left), nối nhiều bảng, self-join.
- **Ngày 13:** \`GROUP BY\`/\`HAVING\` — tổng hợp và báo cáo.
- **Ngày 14–15:** subquery, correlated, \`EXISTS\`.
- **Ngày 16–17:** CTE và recursive CTE (duyệt cây).
- **Ngày 18–19:** window functions — xếp hạng, cộng dồn, \`LAG\`/\`LEAD\`.
- **Ngày 20:** set operations.

Giờ bạn có thể trả lời gần như *mọi* câu hỏi phân tích trên dữ liệu đã có. Đó là một năng lực lớn.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN & CHẶNG TIẾP THEO

Set operations gộp hai tập kết quả theo chiều dọc: \`UNION\`/\`UNION ALL\` (gộp), \`INTERSECT\` (giao), \`EXCEPT\` (trừ) — với luật cùng số cột và kiểu hợp. Chúng khép lại một Giai đoạn 2 đầy sức mạnh.

Nhưng có một sự thật ta đã lướt qua suốt hai giai đoạn: **mọi truy vấn hay chỉ tốt bằng thiết kế bảng bên dưới**. Nếu bảng thiết kế sai — dữ liệu lặp, mâu thuẫn, khó cập nhật — thì không truy vấn nào cứu được. Vậy *thiết kế bảng cho đúng* là như thế nào? Đó là cả một môn khoa học đẹp đẽ, và là Giai đoạn 3.

Ngày 21 (mở Giai đoạn 3 — Thiết kế & Chuẩn hoá): **Mô hình thực thể–quan hệ (ER)** — cách phác thảo các bảng và mối quan hệ *trước khi* gõ dòng \`CREATE TABLE\` đầu tiên. Hẹn gặp lại ở chặng đường mới!

#100NgayDatabase #Database #PostgreSQL`,
};
