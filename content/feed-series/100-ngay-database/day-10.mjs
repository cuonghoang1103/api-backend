/** "100 Ngày Database với CuongThai" — Ngày 10: Khoá ngoại & quan hệ (khép GĐ1).
    FOREIGN KEY liên kết hai bảng, toàn vẹn tham chiếu (chống bản ghi mồ côi),
    RESTRICT vs ON DELETE CASCADE, và tổng kết chặng Nền tảng — mở cửa JOIN.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day10), gồm tên FK thật (don_hang_khach_id_fkey). */
export default {
  day: 10,
  card: 'db-day-10',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'link-tables-with-a-foreign-key',
    title: 'Liên kết bảng bằng khoá ngoại',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 10: KHOÁ NGOẠI & QUAN HỆ (KHÉP GIAI ĐOẠN 1)

Chín ngày qua ta làm chủ *một* bảng. Nhưng chữ "quan hệ" trong "cơ sở dữ liệu quan hệ" nằm ở đây: dữ liệu thật sống trong **nhiều bảng liên kết** với nhau. Khách hàng có đơn hàng, tác giả có bài viết, lớp có học sinh. Hôm nay ta học cách nối chúng bằng **khoá ngoại** (\`FOREIGN KEY\`) — và để CSDL tự đảm bảo các liên kết đó luôn *đúng*. Đây cũng là bài khép Giai đoạn 1 và mở cửa cho \`JOIN\`.

Vì sao tách bảng? Thay vì nhét tên khách vào từng đơn hàng (lặp lại, dễ sai, đổi tên phải sửa khắp nơi), ta lưu khách **một lần** trong bảng \`khach_hang\`, rồi mỗi đơn chỉ **trỏ tới** khách bằng \`id\`. Đó là tinh thần chuẩn hoá — ta sẽ đào sâu ở Giai đoạn 3. Mọi kết quả bên dưới là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🔗 KHAI BÁO KHOÁ NGOẠI

\`\`\`sql
CREATE TABLE khach_hang (
  id  SERIAL PRIMARY KEY,
  ten TEXT NOT NULL
);
CREATE TABLE don_hang (
  id        SERIAL PRIMARY KEY,
  khach_id  INT NOT NULL REFERENCES khach_hang(id),   -- KHOÁ NGOẠI
  tong_tien INT NOT NULL
);
\`\`\`

Dòng \`REFERENCES khach_hang(id)\` nói: giá trị trong \`khach_id\` **bắt buộc** phải là \`id\` của một khách hàng **có thật**. Ba đơn hàng hợp lệ:

\`\`\`sql
SELECT id, khach_id, tong_tien FROM don_hang ORDER BY id;
\`\`\`

\`\`\`
 id | khach_id | tong_tien
----+----------+-----------
  1 |        1 |    500000
  2 |        1 |    300000
  3 |        2 |    900000
(3 rows)
\`\`\`

Khách #1 (An) có hai đơn, khách #2 (Binh) có một — quan hệ **một–nhiều** kinh điển.

━━━━━━━━━━━━━━━━━━━━

🛡️ TOÀN VẸN THAM CHIẾU — KHÔNG CÓ BẢN GHI MỒ CÔI

Thử tạo đơn cho một khách **không tồn tại** (id 99):

\`\`\`sql
INSERT INTO don_hang (khach_id, tong_tien) VALUES (99, 100000);
\`\`\`

\`\`\`
ERROR:  insert or update on table "don_hang" violates foreign key constraint "don_hang_khach_id_fkey"
DETAIL:  Key (khach_id)=(99) is not present in table "khach_hang".
\`\`\`

Bị chặn! CSDL đảm bảo **toàn vẹn tham chiếu** (referential integrity): không thể có "đơn hàng mồ côi" trỏ tới khách không có thật. Đây là một trong những lời hứa quý giá nhất của mô hình quan hệ — dữ liệu của bạn *luôn* nối đúng.

━━━━━━━━━━━━━━━━━━━━

🚫 XOÁ CHA KHI CÒN CON? — RESTRICT vs CASCADE

Chiều ngược lại cũng được bảo vệ. Xoá khách #1 (An) trong khi anh còn đơn hàng:

\`\`\`sql
DELETE FROM khach_hang WHERE id = 1;
\`\`\`

\`\`\`
ERROR:  update or delete on table "khach_hang" violates foreign key constraint "don_hang_khach_id_fkey" on table "don_hang"
DETAIL:  Key (id)=(1) is still referenced from table "don_hang".
\`\`\`

Mặc định (\`RESTRICT\`), không cho xoá cha khi còn con — tránh làm mồ côi các đơn. Khách #3 (Chi) chưa có đơn nào thì xoá được bình thường (\`DELETE 1\`).

Nhưng đôi khi bạn *muốn* con xoá theo cha — ví dụ xoá một tác giả thì xoá luôn bài viết của họ. Khai báo \`ON DELETE CASCADE\`:

\`\`\`sql
CREATE TABLE bai_viet (
  id INT PRIMARY KEY, tac_gia_id INT REFERENCES tac_gia(id) ON DELETE CASCADE, ...
);
-- xoá tác giả #1 (có 2 bài):
DELETE FROM tac_gia WHERE id = 1;
SELECT count(*) AS bai_con_lai FROM bai_viet;   -- -> 0  (2 bài tự xoá theo!)
\`\`\`

Ba lựa chọn hành vi hay dùng: \`ON DELETE RESTRICT\` (mặc định, chặn), \`ON DELETE CASCADE\` (con xoá theo), \`ON DELETE SET NULL\` (con vẫn còn nhưng \`tac_gia_id\` thành NULL). Chọn đúng tuỳ nghiệp vụ.

━━━━━━━━━━━━━━━━━━━━

✅ KHÉP GIAI ĐOẠN 1 — BẠN ĐÃ ĐI ĐƯỢC BAO XA

Nhìn lại 10 ngày, bạn đã có một nền tảng vững:

- **Ngày 1–2:** CSDL là gì, cài PostgreSQL, vòng đời CRUD.
- **Ngày 3–4:** SELECT sâu (cột, alias, tính toán, DISTINCT) và kiểu dữ liệu (nhớ: tiền dùng \`NUMERIC\`).
- **Ngày 5–6:** ràng buộc (PK/NOT NULL/UNIQUE/CHECK/DEFAULT) và cái bẫy \`NULL\`.
- **Ngày 7:** ghi an toàn (INSERT/UPDATE/DELETE, luật \`WHERE\`, \`RETURNING\`).
- **Ngày 8–9:** lọc (\`WHERE\`, \`IN\`, \`BETWEEN\`, \`LIKE\`) và sắp xếp/phân trang (\`ORDER BY\`, \`LIMIT\`).
- **Ngày 10:** khoá ngoại & quan hệ.

Bạn đã có thể thiết kế một bảng đúng đắn, nhập liệu an toàn, và hỏi dữ liệu từ một bảng khá thành thạo. Đó là một nửa đầu vững chắc.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Khoá ngoại là chuẩn SQL — **giống hệt** ở hai hệ: \`FOREIGN KEY (khach_id) REFERENCES khach_hang(id)\`, \`ON DELETE CASCADE\`/\`SET NULL\`/\`RESTRICT\`. Một khác biệt nhỏ khi lên nâng cao: SQL Server khắt khe hơn với "nhiều đường CASCADE" cùng trỏ về một bảng (dễ báo lỗi vòng lặp cascade) — nhưng với thiết kế thường ngày, bạn viết y như nhau.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm bảng \`san_pham\` và bảng \`chi_tiet_don(don_id, san_pham_id, so_luong)\` với **hai** khoá ngoại — quan hệ nhiều–nhiều.
2. Thử \`ON DELETE SET NULL\` cho \`bai_viet.tac_gia_id\`: xoá tác giả thì bài còn không, và cột đó thành gì?
3. Vì sao "toàn vẹn tham chiếu" tốt hơn là để ứng dụng tự kiểm "khách này có tồn tại không"?
4. Vẽ (trên giấy) quan hệ khach_hang — don_hang — chi_tiet_don — san_pham.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Khoá ngoại biến nhiều bảng rời rạc thành một mô hình liền mạch: mỗi liên kết được CSDL bảo đảm luôn trỏ tới dữ liệu có thật, không mồ côi, không "treo". Bạn chọn được cả cách xử lý khi xoá cha (\`RESTRICT\`/\`CASCADE\`/\`SET NULL\`). Với bài này, **Giai đoạn 1 — Nền tảng — chính thức khép lại**: bạn đã nắm chắc một bảng và biết cách nối các bảng.

Nhưng nối *khai báo* mới là một nửa. Nửa còn lại — và là sức mạnh làm nên cái tên "quan hệ" — là **truy vấn xuyên nhiều bảng cùng lúc**: lấy tên khách *kèm* tổng đơn của họ trong một câu. Đó là \`JOIN\`, ngôi sao của Giai đoạn 2, và là nơi SQL bắt đầu thật sự tỏa sáng.

Ngày 11 (mở Giai đoạn 2 — Truy vấn): **JOIN** — ghép \`khach_hang\` với \`don_hang\` để trả lời "ai đã mua gì, bao nhiêu tiền" trong một truy vấn duy nhất. Hẹn gặp lại ở chặng đường mới!

#100NgayDatabase #Database #PostgreSQL`,
};
