/** "100 Ngày Database với CuongThai" — Ngày 25: Dạng chuẩn 2 (2NF).
    1NF + không phụ thuộc bộ phận: cột không được chỉ phụ thuộc một phần của
    khoá tổng hợp. Chứng minh bằng SQL: partial dependency gây lặp + mâu thuẫn.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day25). 2NF là nguyên tắc thiết kế — hệ nào cũng vậy. */
export default {
  day: 25,
  card: 'db-day-25',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'link-orders-to-customers-with-a-foreign-key',
    title: 'Nối đơn hàng với khách bằng khoá ngoại',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 25: DẠNG CHUẨN 2 (2NF) — BỎ PHỤ THUỘC BỘ PHẬN

Ngày 24 ta đạt 1NF (mỗi ô một giá trị). Nhưng 1NF chưa đủ. Khi một bảng có **khoá tổng hợp** (nhiều cột làm khoá — nhớ Ngày 22), lại nảy sinh một loại dư thừa tinh vi: có cột chỉ phụ thuộc vào *một phần* của khoá, chứ không phải toàn bộ. Dọn nó là việc của **2NF (Second Normal Form)**. Trước khi vào, cần một khái niệm nền: **phụ thuộc hàm**.

━━━━━━━━━━━━━━━━━━━━

🔗 PHỤ THUỘC HÀM (FUNCTIONAL DEPENDENCY) — NGÔN NGỮ CỦA CHUẨN HOÁ

"A **xác định** B" (viết \`A → B\`) nghĩa là: biết A thì biết chắc B. Ví dụ \`san_pham_id → san_pham_ten\` (biết mã sản phẩm thì biết tên nó). Chuẩn hoá thực chất là sắp xếp các bảng sao cho **mọi cột đều phụ thuộc vào khoá, toàn bộ khoá, và không gì ngoài khoá**. 2NF lo phần "toàn bộ khoá".

━━━━━━━━━━━━━━━━━━━━

🚫 VI PHẠM 2NF: CỘT PHỤ THUỘC *MỘT PHẦN* KHOÁ

Xét bảng chi tiết đơn hàng, khoá tổng hợp \`(don_id, san_pham_id)\`, nhưng lỡ nhét cả tên sản phẩm vào:

\`\`\`
 don_id | san_pham_id | san_pham_ten | so_luong
--------+-------------+--------------+---------
      1 |          10 | Ban phim     | 2
      2 |          10 | Ban phim     | 1     <- 'Ban phim' lặp!
      1 |          11 | Chuot        | 3
\`\`\`

Vấn đề: \`san_pham_ten\` phụ thuộc \`san_pham_id\` **thôi** (\`san_pham_id → san_pham_ten\`), *không* phụ thuộc \`don_id\`. Nó chỉ phụ thuộc **một phần** của khoá tổng hợp — đó là **phụ thuộc bộ phận (partial dependency)**. Hệ quả: mỗi khi sản phẩm 10 xuất hiện trong một đơn, tên "Ban phim" lại bị chép lại.

━━━━━━━━━━━━━━━━━━━━

⚠️ VÀ NÓ SINH RA DỊ THƯỜNG (LẠI LÀ NÓ)

Đổi tên sản phẩm 10, lỡ sót một dòng:

\`\`\`sql
UPDATE chi_tiet_xau SET san_pham_ten = 'Ban phim co' WHERE don_id = 1 AND san_pham_id = 10;
SELECT DISTINCT san_pham_id, san_pham_ten FROM chi_tiet_xau WHERE san_pham_id = 10;
\`\`\`

\`\`\`
 san_pham_id | san_pham_ten
-------------+--------------
          10 | Ban phim
          10 | Ban phim co
(2 rows)
\`\`\`

Sản phẩm 10 giờ có *hai* tên — đúng loại dị thường sửa của Ngày 23, nhưng lần này nguyên nhân là **phụ thuộc bộ phận**. Dữ liệu về "sản phẩm" đang sống nhầm chỗ, trong bảng "chi tiết đơn".

━━━━━━━━━━━━━━━━━━━━

✅ SỬA 2NF: TÁCH CỘT VỀ ĐÚNG BẢNG CỦA NÓ

Luật sửa: **chuyển cột phụ thuộc bộ phận sang bảng của cái "phần khoá" mà nó phụ thuộc.** \`san_pham_ten\` phụ thuộc \`san_pham_id\` → nó thuộc về bảng \`san_pham\`:

\`\`\`sql
CREATE TABLE san_pham (id INT PRIMARY KEY, ten TEXT NOT NULL);          -- tên lưu MỘT chỗ
CREATE TABLE chi_tiet (
  don_id INT, san_pham_id INT REFERENCES san_pham(id), so_luong INT,
  PRIMARY KEY (don_id, san_pham_id)
);
\`\`\`

Giờ tên sản phẩm chỉ nằm một chỗ. Đổi tên một lần, mọi nơi đều thấy đồng nhất:

\`\`\`sql
UPDATE san_pham SET ten = 'Ban phim co' WHERE id = 10;
SELECT ct.don_id, ct.san_pham_id, s.ten, ct.so_luong
FROM chi_tiet ct JOIN san_pham s ON s.id = ct.san_pham_id ORDER BY ct.don_id, ct.san_pham_id;
\`\`\`

\`\`\`
 don_id | san_pham_id |     ten     | so_luong
--------+-------------+-------------+---------
      1 |          10 | Ban phim co | 2
      1 |          11 | Chuot       | 3
      2 |          10 | Ban phim co | 1
(3 rows)
\`\`\`

Cả hai dòng của sản phẩm 10 đều hiện "Ban phim co" — vì tên chỉ tồn tại một chỗ. Dị thường biến mất. Còn \`so_luong\` thì đúng chỗ: nó *thực sự* phụ thuộc **cả** \`(don_id, san_pham_id)\` (đơn này, sản phẩm này, mua mấy cái) — nên nó ở lại \`chi_tiet\`.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER & MỘT LƯU Ý HAY

2NF là nguyên tắc thiết kế, giống nhau mọi hệ. Một điểm quan trọng dễ quên: **nếu bảng có khoá chính đơn (chỉ một cột — như \`id\` surrogate), thì nó tự động đạt 2NF** — vì không thể "phụ thuộc một phần" của một khoá chỉ có một phần. Vì thế 2NF chỉ là vấn đề đáng lo với các bảng dùng **khoá tổng hợp** (thường là bảng nối). Đây là lý do nhiều người dùng \`id\` surrogate: né luôn cả một lớp lỗi 2NF.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Trong bảng \`chi_tiet_xau\`, ngoài \`san_pham_ten\` còn cột nào có thể phụ thuộc bộ phận (nếu ta thêm \`san_pham_gia\`)?
2. Vì sao \`so_luong\` *không* vi phạm 2NF, còn \`san_pham_ten\` thì có?
3. Thiết kế bảng "lịch dạy" khoá \`(giao_vien_id, tiet_hoc)\` — cột nào dễ phụ thuộc bộ phận?
4. Giải thích vì sao bảng khoá đơn luôn ở 2NF.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

2NF xây trên 1NF và loại bỏ **phụ thuộc bộ phận**: khi khoá là tổng hợp, mọi cột không-khoá phải phụ thuộc *toàn bộ* khoá, chứ không chỉ một phần. Cột nào phụ thuộc một phần thì thuộc về bảng khác — tách nó ra. Bảng khoá đơn thì miễn nhiễm 2NF sẵn. Mỗi bước chuẩn hoá lại gỡ đi một nguồn dư thừa.

Nhưng vẫn còn một loại phụ thuộc lén lút nữa, ngay cả với khoá đơn: một cột không-khoá phụ thuộc vào *một cột không-khoá khác*, chứ không trực tiếp vào khoá. Dọn nó là 3NF — và là bài ngày mai, dạng chuẩn mà hầu hết hệ thống thực tế nhắm tới.

Ngày 26: **Dạng chuẩn 3 (3NF)** — bỏ "phụ thuộc bắc cầu": cột không-khoá không được phụ thuộc vào cột không-khoá khác. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
