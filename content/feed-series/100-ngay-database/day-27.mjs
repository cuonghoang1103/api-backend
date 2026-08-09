/** "100 Ngày Database với CuongThai" — Ngày 27: BCNF (Boyce–Codd).
    Mọi determinant phải là khoá ứng viên (chặt hơn 3NF). Ví dụ kinh điển
    (SV, môn, GV) với gv->mon: 3NF nhưng vẫn dư thừa. Tách theo determinant.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day27). BCNF là nguyên tắc thiết kế — hệ nào cũng vậy. */
export default {
  day: 27,
  card: 'db-day-27',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'guard-a-products-table-with-check-constraints',
    title: 'Bảo vệ bảng sản phẩm bằng CHECK',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 27: BCNF — DẠNG CHUẨN "3NF NGHIÊM KHẮC"

3NF đủ cho gần như mọi thiết kế. Nhưng có một số tình huống hiếm mà 3NF *vẫn để lọt* một chút dư thừa — khi bảng có nhiều khoá ứng viên **chồng lấn** nhau. **BCNF (Boyce–Codd Normal Form)** vá đúng khe hở đó bằng một luật ngắn gọn và chặt hơn. Đây là bài "khó nhằn" nhất của chuỗi chuẩn hoá, nên ta đi thật chậm với một ví dụ cụ thể, chạy thật trên psql.

━━━━━━━━━━━━━━━━━━━━

🔒 LUẬT BCNF — RẤT NGẮN

Nhớ khái niệm "phụ thuộc hàm" \`A → B\` (biết A thì biết B) từ Ngày 25. **Yếu tố xác định (determinant)** là vế trái \`A\`. Luật BCNF:

> **Với mọi phụ thuộc hàm \`A → B\` không tầm thường, \`A\` phải là một (siêu) khoá.**

Nói cách khác: *chỉ có khoá mới được phép "quyết định" các cột khác*. 3NF nới lỏng điều này một chút (cho phép determinant không-khoá nếu vế phải là cột "prime" — thuộc một khoá nào đó). BCNF không nhân nhượng.

━━━━━━━━━━━━━━━━━━━━

🚫 MỘT BẢNG Ở 3NF NHƯNG VẪN DƯ THỪA

Xét bảng phân công dạy học, với hai luật nghiệp vụ:
- \`(sinh_vien, mon_hoc) → gv\`: mỗi sinh viên trong một môn có một giáo viên cụ thể.
- \`gv → mon_hoc\`: **mỗi giáo viên chỉ dạy đúng một môn.**

\`\`\`
 sinh_vien | mon_hoc | gv
-----------+---------+----------
 An        | CSDL    | Thay Nam
 Binh      | CSDL    | Thay Nam
 An        | Mang    | Co Hoa
 Chi       | CSDL    | Thay Nam
\`\`\`

Bảng này *có* các khoá ứng viên chồng lấn — \`(sinh_vien, mon_hoc)\` và \`(sinh_vien, gv)\` — và nó **đạt 3NF**. Nhưng nhìn sự dư thừa:

\`\`\`sql
SELECT gv, mon_hoc, count(*) AS so_dong_lap FROM phan_cong GROUP BY gv, mon_hoc;
-- -> Thay Nam | CSDL | 3     (sự thật "Thay Nam dạy CSDL" chép 3 lần!)
\`\`\`

Nguồn gốc: \`gv → mon_hoc\`, mà \`gv\` **không phải** một khoá. Đó chính là điều BCNF cấm, và là chỗ 3NF bỏ sót (vì \`mon_hoc\` là cột "prime").

━━━━━━━━━━━━━━━━━━━━

⚠️ VÀ DƯ THỪA GÂY DỊ THƯỜNG

Thay Nam chuyển sang dạy môn "Mang", bạn cập nhật nhưng sót:

\`\`\`sql
UPDATE phan_cong SET mon_hoc = 'Mang' WHERE sinh_vien = 'An' AND gv = 'Thay Nam';
SELECT DISTINCT gv, mon_hoc FROM phan_cong WHERE gv = 'Thay Nam';
\`\`\`

\`\`\`
    gv    | mon_hoc
----------+---------
 Thay Nam | CSDL
 Thay Nam | Mang
(2 rows)
\`\`\`

Giờ dữ liệu nói Thay Nam dạy **hai** môn — vi phạm chính luật nghiệp vụ "mỗi GV một môn". Dư thừa lại đẻ ra mâu thuẫn.

━━━━━━━━━━━━━━━━━━━━

✅ SỬA BCNF: TÁCH THEO ĐÚNG DETERMINANT

Luật sửa: **tách sao cho vế trái của phụ thuộc gây lỗi trở thành khoá của bảng mới.** Phụ thuộc gây lỗi là \`gv → mon_hoc\`, nên cho \`gv\` một bảng riêng nơi nó *là* khoá:

\`\`\`sql
CREATE TABLE gv_mon   (gv TEXT PRIMARY KEY, mon_hoc TEXT NOT NULL);          -- gv -> mon: một chỗ
CREATE TABLE ghi_danh (sinh_vien TEXT, gv TEXT REFERENCES gv_mon(gv), PRIMARY KEY (sinh_vien, gv));
\`\`\`

Giờ "giáo viên dạy môn gì" lưu đúng một chỗ. Thay Nam đổi môn — một lần, đồng nhất, không thể mâu thuẫn:

\`\`\`sql
UPDATE gv_mon SET mon_hoc = 'Mang' WHERE gv = 'Thay Nam';
SELECT gd.sinh_vien, gm.gv, gm.mon_hoc FROM ghi_danh gd JOIN gv_mon gm ON gm.gv = gd.gv ORDER BY gd.sinh_vien, gm.gv;
-- -> mọi dòng của Thay Nam đều 'Mang'; luật "1 GV 1 môn" được bảo toàn
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⚖️ MỘT ĐÁNH ĐỔI CẦN BIẾT

BCNF luôn loại được dư thừa kiểu này, nhưng đôi khi phải trả giá: việc tách có thể làm **mất khả năng cưỡng chế một phụ thuộc** bằng khoá đơn giản (ở đây, ràng buộc \`(sinh_vien, mon_hoc) → gv\` giờ trải trên hai bảng). Đây gọi là "BCNF không phải lúc nào cũng bảo toàn phụ thuộc". Vì thế trong thực tế, nhiều đội **dừng ở 3NF** khi 3NF đã đủ sạch — và chỉ lên BCNF khi dư thừa thực sự gây phiền. Biết BCNF để nhận ra vấn đề; áp dụng nó một cách cân nhắc.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

BCNF là lý thuyết thiết kế, hoàn toàn độc lập hệ CSDL — giống nhau cho PostgreSQL, SQL Server, mọi nơi. Không có cú pháp riêng cho BCNF; nó là *cách bạn tách bảng*. Điều cần nhớ chung: **thực tế, "chuẩn hoá tới 3NF" là mục tiêu mặc định; BCNF là công cụ dự phòng cho các ca khoá ứng viên chồng lấn.**

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chỉ ra determinant \`gv\` không phải khoá trong bảng \`phan_cong\` — vì sao nó phạm BCNF?
2. Vì sao bảng vẫn đạt 3NF dù có dư thừa đó? (Gợi ý: \`mon_hoc\` là cột prime.)
3. Thiết kế lại bảng "phòng họp — thời gian — người đặt" nếu "mỗi phòng ở một toà nhà".
4. Nêu một lý do thực tế để *dừng ở 3NF* thay vì ép BCNF.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

BCNF là bản 3NF nghiêm khắc: **mọi yếu tố xác định phải là một khoá**. Nó bắt được loại dư thừa mà 3NF bỏ sót khi bảng có khoá ứng viên chồng lấn — sửa bằng cách tách theo đúng determinant gây lỗi. Nhưng nó có thể phải đánh đổi việc bảo toàn phụ thuộc, nên thực tế 3NF thường là điểm dừng hợp lý; BCNF là công cụ khi bạn thực sự cần. Tới đây, bạn đã đi trọn chuỗi chuẩn hoá cốt lõi 1NF → BCNF.

Ta đã nhắc nhiều lần tới "quan hệ nhiều–nhiều" và "bảng nối" nhưng chưa dừng lại mổ xẻ. Đó là mẫu thiết kế bạn sẽ gặp *liên tục* — sinh viên và môn học, bài viết và thẻ, đơn hàng và sản phẩm. Ngày mai ta làm chủ nó trọn vẹn.

Ngày 28: **Quan hệ nhiều–nhiều & bảng nối** — vì sao không thể nối trực tiếp, cách dựng bảng nối (junction) đúng chuẩn, và gắn thuộc tính cho chính mối quan hệ. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
