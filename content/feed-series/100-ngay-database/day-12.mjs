/** "100 Ngày Database với CuongThai" — Ngày 12: Nối 3+ bảng & self-join.
    Chuỗi JOIN 4 bảng (khach->don->chi_tiet->san_pham); self-join cho quan hệ
    phân cấp (nhân viên–quản lý cùng một bảng).

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day12). Chuẩn SQL — SQL Server y hệt. */
export default {
  day: 12,
  card: 'db-day-12',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'join-three-tables',
    title: 'Nối ba bảng',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 12: NỐI 3+ BẢNG & SELF-JOIN

Ngày 11 ta nối hai bảng. Nhưng câu hỏi thật thường xuyên xuyên qua *nhiều* bảng: "khách An đã mua **những sản phẩm nào**, mỗi thứ mấy cái?" — dữ liệu đó nằm rải ở bốn bảng: khách → đơn hàng → chi tiết đơn → sản phẩm. Hôm nay ta nối chuỗi chúng lại, rồi học một kỹ thuật đặc biệt: cho một bảng **tự nối chính nó** (self-join) để xử lý quan hệ phân cấp như "ai là sếp của ai". Mọi kết quả là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

⛓️ NỐI CHUỖI — MỖI JOIN THÊM MỘT BẢNG

Không có giới hạn số bảng nối. Cứ mỗi bảng mới, thêm một \`JOIN ... ON ...\`, dùng khoá nối để lần theo chuỗi quan hệ:

\`\`\`sql
SELECT k.ten AS khach, s.ten AS san_pham, ct.so_luong
FROM khach_hang k
JOIN don_hang d      ON d.khach_id = k.id
JOIN chi_tiet_don ct ON ct.don_id = d.id
JOIN san_pham s      ON s.id = ct.san_pham_id
ORDER BY k.ten, s.ten;
\`\`\`

\`\`\`
 khach | san_pham | so_luong
-------+----------+----------
 An    | Ban phim |        1
 An    | Chuot    |        2
 Binh  | Man hinh |        1
(3 rows)
\`\`\`

Đọc chuỗi như đi bộ trên bản đồ quan hệ: từ **khách** → tới **đơn** của khách → tới **dòng chi tiết** của đơn → tới **sản phẩm** của dòng đó. Bốn bảng, một câu trả lời gọn gàng. Bảng \`chi_tiet_don\` ở giữa (còn gọi là *bảng nối*) chính là cách mô hình quan hệ biểu diễn "một đơn có nhiều sản phẩm, một sản phẩm ở trong nhiều đơn" — quan hệ **nhiều–nhiều**.

━━━━━━━━━━━━━━━━━━━━

🪞 SELF-JOIN — MỘT BẢNG TỰ NỐI CHÍNH NÓ

Đây là kỹ thuật khiến nhiều người mới bối rối, nhưng ý tưởng rất đẹp. Hình dung bảng \`nhan_vien\`, trong đó mỗi người có cột \`quan_ly_id\` trỏ tới… một dòng **khác trong cùng bảng đó** (sếp của họ cũng là một nhân viên):

\`\`\`
 id | ten  | quan_ly_id
----+------+-----------
  1 | An   | (null)     -- sếp tổng
  2 | Binh | 1          -- quản lý là An
  3 | Chi  | 1
  4 | Dung | 2          -- quản lý là Binh
\`\`\`

Để hiện "tên nhân viên — tên quản lý", ta cần bảng \`nhan_vien\` **hai lần**: một lần đóng vai nhân viên, một lần đóng vai sếp. Bí quyết là **hai bí danh khác nhau**:

\`\`\`sql
SELECT nv.ten AS nhan_vien, sep.ten AS quan_ly
FROM nhan_vien nv
LEFT JOIN nhan_vien sep ON sep.id = nv.quan_ly_id
ORDER BY nv.ten;
\`\`\`

\`\`\`
 nhan_vien | quan_ly
-----------+---------
 An        | (null)
 Binh      | An
 Chi       | An
 Dung      | Binh
(4 rows)
\`\`\`

\`nv\` là "nhân viên", \`sep\` là "sếp" — cùng một bảng nhưng hai vai. Điều kiện \`sep.id = nv.quan_ly_id\` nói "ghép mỗi nhân viên với dòng-nhân-viên mà id bằng quan_ly_id của họ". Dùng \`LEFT JOIN\` để **giữ cả sếp tổng** (An không có quản lý → \`quan_ly\` là NULL); nếu dùng \`INNER JOIN\`, An sẽ biến mất.

Self-join là công cụ cho mọi quan hệ **phân cấp trong một bảng**: nhân viên–quản lý, danh mục–danh mục cha, bình luận–bình luận gốc.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt** ở cả hai hệ: nối chuỗi nhiều \`JOIN\`, bảng nối cho nhiều–nhiều, và self-join bằng hai bí danh. Không có khác biệt phương ngữ đáng kể — đây đều là chuẩn SQL. Điểm cần nhớ (chung cho cả hai): **luôn đặt bí danh khác nhau** cho mỗi lần dùng bảng trong self-join, nếu không máy không biết bạn nói tới bản sao nào.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm cột \`gia\` vào truy vấn 4 bảng và tính \`gia * so_luong\` (thành tiền mỗi dòng).
2. Với self-join, đếm mỗi quản lý có bao nhiêu nhân viên cấp dưới (gợi ý: sẽ cần \`GROUP BY\` — bài mai!).
3. Vì sao self-join cần \`LEFT JOIN\` để không mất "sếp tổng"?
4. Tìm tên các nhân viên có cùng quản lý với "Binh".

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Nối chuỗi nhiều \`JOIN\` cho phép bạn đi xuyên qua bao nhiêu bảng tuỳ ý, lần theo các mối quan hệ để trả lời những câu hỏi thật. Và self-join — cùng một bảng, hai bí danh — mở khoá các quan hệ phân cấp nằm gọn trong một bảng. Giờ bạn ghép được dữ liệu ở mọi hình dạng.

Nhưng tới đây các truy vấn của ta vẫn trả về *từng dòng*. Câu hỏi thật thường cần **tổng hợp**: "mỗi khách chi tổng bao nhiêu?", "mỗi thành phố có mấy khách?". Trả lời chúng cần gộp nhiều dòng thành một con số — đó là công việc của \`GROUP BY\`, ngôi sao ngày mai.

Ngày 13: **GROUP BY & HAVING** — gộp nhóm rồi tính \`COUNT\`/\`SUM\`/\`AVG\` cho từng nhóm, và lọc nhóm bằng \`HAVING\`. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
