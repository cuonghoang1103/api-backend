/** "100 Ngày Database với CuongThai" — Ngày 28: Quan hệ nhiều–nhiều & bảng nối.
    Vì sao không nối trực tiếp; bảng nối (junction) = 2 FK + khoá tổng hợp;
    thuộc tính của quan hệ ở bảng nối; truy vấn xuyên bảng nối hai chiều.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day28). Bảng nối là chuẩn SQL — SQL Server y hệt. */
export default {
  day: 28,
  card: 'db-day-28',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'model-many-to-many-course-enrollments-with-a-junction-table',
    title: 'Mô hình nhiều–nhiều bằng bảng nối',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 28: QUAN HỆ NHIỀU–NHIỀU & BẢNG NỐI

Ta đã nhắc "nhiều–nhiều" và "bảng nối" vài lần (Ngày 12, 21, 22) nhưng chưa dừng lại mổ xẻ. Đây là mẫu thiết kế bạn sẽ gặp **liên tục**: sinh viên và môn học, bài viết và thẻ, đơn hàng và sản phẩm, phim và diễn viên. Làm chủ nó là làm chủ một nửa công việc mô hình hoá dữ liệu thực tế. Kết quả bên dưới là thật từ psql, với ví dụ sinh viên ↔ môn học.

━━━━━━━━━━━━━━━━━━━━

❓ VÌ SAO KHÔNG NỐI TRỰC TIẾP ĐƯỢC

Quan hệ 1–N (Ngày 21) đặt khoá ngoại ở bên "nhiều": mỗi học sinh có một \`lop_id\`. Nhưng với **nhiều–nhiều** — một sinh viên học *nhiều* môn, và một môn có *nhiều* sinh viên — đặt khoá ngoại ở đâu?

- Đặt \`mon_hoc_id\` trong \`sinh_vien\`? → mỗi SV chỉ được *một* môn. Sai.
- Đặt \`sinh_vien_id\` trong \`mon_hoc\`? → mỗi môn chỉ *một* SV. Cũng sai.

Một khoá ngoại đơn chỉ diễn tả được **một chiều**. Giải pháp: một **bảng thứ ba ở giữa** — **bảng nối (junction table)** — mỗi dòng ghi lại *một cặp* "SV này học môn kia".

━━━━━━━━━━━━━━━━━━━━

🌉 DỰNG BẢNG NỐI

Bảng nối gồm **hai khoá ngoại** (trỏ về hai bảng), và **khoá chính tổng hợp** từ cả hai (để mỗi cặp là duy nhất — nhớ Ngày 22):

\`\`\`sql
CREATE TABLE sinh_vien (id SERIAL PRIMARY KEY, ten TEXT NOT NULL);
CREATE TABLE mon_hoc   (id SERIAL PRIMARY KEY, ten TEXT NOT NULL);

CREATE TABLE dang_ky (
  sinh_vien_id INT REFERENCES sinh_vien(id),
  mon_hoc_id   INT REFERENCES mon_hoc(id),
  PRIMARY KEY (sinh_vien_id, mon_hoc_id)   -- mỗi cặp (SV, môn) đúng một lần
);
\`\`\`

Giờ "An học CSDL", "An học Web", "Chi học CSDL"… mỗi cái là một dòng trong \`dang_ky\`. Một SV nhiều dòng (nhiều môn), một môn nhiều dòng (nhiều SV) — quan hệ nhiều–nhiều được biểu diễn trọn vẹn.

━━━━━━━━━━━━━━━━━━━━

🏷️ THUỘC TÍNH CỦA CHÍNH MỐI QUAN HỆ

Đây là điểm tinh tế mà bảng nối làm rất đẹp. "Điểm" của một sinh viên trong một môn — nó thuộc về ai? Không thuộc *sinh viên* (cùng SV điểm khác nhau ở mỗi môn), không thuộc *môn học* (cùng môn điểm khác nhau ở mỗi SV). Nó thuộc về **cặp** (SV, môn) — tức thuộc về *mối quan hệ*. Vậy nó sống ở bảng nối:

\`\`\`sql
ALTER TABLE dang_ky ADD COLUMN diem NUMERIC(3,1);   -- thuộc tính của quan hệ
-- INSERT: (An, CSDL, 8.5), (An, Web, 9.0), (Binh, CSDL, 7.0), (Chi, Mang, 8.0), (Chi, CSDL, 6.5)
\`\`\`

Ngày ghi danh, trạng thái, số lượng (trong đơn↔sản phẩm)… đều là thuộc tính của quan hệ và đều nằm ở bảng nối.

━━━━━━━━━━━━━━━━━━━━

↔️ TRUY VẤN XUYÊN BẢNG NỐI

Để có dữ liệu đọc được, nối ba bảng (đúng kỹ thuật Ngày 12). "Mỗi SV học môn gì, điểm bao nhiêu":

\`\`\`sql
SELECT sv.ten AS sinh_vien, m.ten AS mon_hoc, dk.diem
FROM dang_ky dk
JOIN sinh_vien sv ON sv.id = dk.sinh_vien_id
JOIN mon_hoc   m  ON m.id  = dk.mon_hoc_id
ORDER BY sv.ten, m.ten;
-- -> An: CSDL 8.5, Web 9.0 | Binh: CSDL 7.0 | Chi: CSDL 6.5, Mang 8.0
\`\`\`

Đi **chiều ngược** cũng chỉ là đổi góc nhìn — "mỗi môn có mấy sinh viên":

\`\`\`sql
SELECT m.ten AS mon_hoc, count(*) AS so_sv
FROM dang_ky dk JOIN mon_hoc m ON m.id = dk.mon_hoc_id GROUP BY m.ten ORDER BY so_sv DESC;
-- -> CSDL 3, Mang 1, Web 1
\`\`\`

Và gộp trên **thuộc tính quan hệ** — "điểm trung bình mỗi môn":

\`\`\`sql
SELECT m.ten AS mon_hoc, round(avg(dk.diem),1) AS diem_tb
FROM dang_ky dk JOIN mon_hoc m ON m.id = dk.mon_hoc_id GROUP BY m.ten ORDER BY m.ten;
-- -> CSDL 7.3, Mang 8.0, Web 9.0
\`\`\`

Một bảng nối nhỏ mở ra cả hai chiều truy vấn và mọi thống kê trên mối quan hệ.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Bảng nối là chuẩn SQL — **giống hệt** ở cả hai hệ: hai khoá ngoại, khoá chính tổng hợp, thuộc tính quan hệ, truy vấn nối ba bảng. Không có khác biệt phương ngữ nào ở đây. (Một số ORM tự sinh bảng nối cho bạn, nhưng hiểu cấu trúc bên dưới là điều bắt buộc.)

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thiết kế nhiều–nhiều "bài viết ↔ thẻ (tag)" với bảng nối phù hợp.
2. Thêm thuộc tính \`ngay_ghi_danh\` vào \`dang_ky\` — nó thuộc SV, môn, hay quan hệ?
3. Tìm các sinh viên học **cùng** môn với "An" (gợi ý: tự nối bảng nối).
4. Vì sao khoá chính của bảng nối nên là tổng hợp \`(a_id, b_id)\`?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Quan hệ nhiều–nhiều không nối trực tiếp được — cần một **bảng nối** ở giữa, gồm hai khoá ngoại và một khoá chính tổng hợp. Đẹp hơn nữa, mọi thuộc tính *của chính mối quan hệ* (điểm, ngày, số lượng) đều có chỗ ở tự nhiên trong bảng nối. Nối ba bảng là truy vấn được cả hai chiều và thống kê trên quan hệ. Đây là mẫu bạn sẽ dùng đi dùng lại suốt sự nghiệp.

Suốt Giai đoạn 3, thông điệp là "chuẩn hoá, tách bảng, chống dư thừa". Nhưng có một sự thật thực chiến ngược đời: đôi khi người ta **cố ý** phá chuẩn — thêm lại dữ liệu dư thừa — để đọc nhanh hơn. Nghe như dị giáo, nhưng có lý do chính đáng. Đó là bài ngày mai.

Ngày 29: **Phi chuẩn hoá (denormalization)** — khi nào và vì sao *cố ý* thêm dư thừa để tối ưu đọc, và cái giá phải trả (giữ đồng bộ). Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
