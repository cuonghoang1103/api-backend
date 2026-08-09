/** "100 Ngày Database với CuongThai" — Ngày 17: Recursive CTE.
    WITH RECURSIVE (anchor + đệ quy UNION ALL), duyệt cây org theo cấp, xây
    đường dẫn từ gốc. Quan hệ phân cấp độ sâu bất kỳ trong một truy vấn.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day17). Ghi chú SQL Server (không có từ khoá RECURSIVE). */
export default {
  day: 17,
  card: 'db-day-17',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'recursive-cte-walk-a-hierarchy',
    title: 'Recursive CTE: đi hết một cây phân cấp',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 17: RECURSIVE CTE — ĐI HẾT MỘT CÂY

Ngày 12 ta dùng self-join để tìm "ai là sếp trực tiếp của ai" — nhưng chỉ **một tầng**. Còn câu "liệt kê *toàn bộ* cấp dưới của một người, sâu bao nhiêu tầng cũng được"? Với self-join thường, bạn không biết trước cần bao nhiêu \`JOIN\`. Đây là lúc **recursive CTE** — CTE tự gọi chính nó — làm điều mà không công cụ nào khác trong SQL làm được: **duyệt một cấu trúc phân cấp đến độ sâu bất kỳ** trong một truy vấn duy nhất. Mọi kết quả là thật từ psql.

Ta dùng một sơ đồ tổ chức: An là sếp tổng; Binh và Chi dưới An; Dung dưới Binh; Em dưới Dung. Một cái cây bốn tầng.

━━━━━━━━━━━━━━━━━━━━

🔁 CẤU TRÚC: ANCHOR + PHẦN ĐỆ QUY

Một recursive CTE luôn có **hai phần**, nối bởi \`UNION ALL\`:

\`\`\`sql
WITH RECURSIVE cay AS (
  -- (1) ANCHOR: hàng xuất phát, chạy MỘT lần
  SELECT id, ten, quan_ly_id, 1 AS cap
  FROM nhan_vien WHERE quan_ly_id IS NULL
  UNION ALL
  -- (2) ĐỆ QUY: tham chiếu chính "cay", chạy lặp lại
  SELECT nv.id, nv.ten, nv.quan_ly_id, c.cap + 1
  FROM nhan_vien nv
  JOIN cay c ON nv.quan_ly_id = c.id
)
SELECT cap, ten FROM cay ORDER BY cap, ten;
\`\`\`

\`\`\`
 cap | ten
-----+------
   1 | An
   2 | Binh
   2 | Chi
   3 | Dung
   4 | Em
(5 rows)
\`\`\`

Cách máy chạy nó, hình dung như bóc từng tầng:
1. **Anchor** cho hàng gốc: An (cấp 1).
2. **Phần đệ quy** lấy những nhân viên có quản lý *nằm trong kết quả vừa có* — tức con trực tiếp của An: Binh, Chi (cấp 2).
3. Lặp lại trên Binh, Chi → tìm con của họ: Dung (cấp 3).
4. Lặp trên Dung → Em (cấp 4).
5. Lặp trên Em → không ai có quản lý là Em → **không thêm hàng mới → dừng**.

Cột \`cap\` (khởi từ 1, mỗi tầng \`+1\`) cho biết mỗi người ở độ sâu nào. Đây là mẫu chuẩn để duyệt xuống một cây.

━━━━━━━━━━━━━━━━━━━━

🧭 XÂY ĐƯỜNG DẪN TỪ GỐC

Không chỉ đếm tầng — bạn có thể **cộng dồn thông tin** qua các tầng. Xây "đường đi từ sếp tổng tới mỗi người" bằng cách nối chuỗi:

\`\`\`sql
WITH RECURSIVE duong_dan AS (
  SELECT id, ten, ten AS path FROM nhan_vien WHERE quan_ly_id IS NULL
  UNION ALL
  SELECT nv.id, nv.ten, d.path || ' > ' || nv.ten
  FROM nhan_vien nv JOIN duong_dan d ON nv.quan_ly_id = d.id
)
SELECT ten, path FROM duong_dan ORDER BY path;
\`\`\`

\`\`\`
 ten  |         path
------+-----------------------
 An   | An
 Binh | An > Binh
 Dung | An > Binh > Dung
 Em   | An > Binh > Dung > Em
 Chi  | An > Chi
(5 rows)
\`\`\`

Mỗi tầng nối tên mình vào \`path\` của cha (\`d.path || ' > ' || nv.ten\`), nên khi tới Em, chuỗi đã tích luỹ trọn đường "An > Binh > Dung > Em". Cùng kỹ thuật này dựng breadcrumb danh mục, cây bình luận, phả hệ…

⚠️ **An toàn:** nếu dữ liệu có vòng lặp (A là sếp của B, B lại là sếp của A), đệ quy sẽ chạy mãi. Với dữ liệu cây sạch thì không sao; khi nghi ngờ, PostgreSQL có \`UNION\` (thay \`UNION ALL\`) để loại trùng, hoặc mệnh đề \`CYCLE\` để phát hiện vòng.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Một khác biệt cú pháp rõ: **PostgreSQL bắt buộc từ khoá \`RECURSIVE\`** (\`WITH RECURSIVE ...\`); còn **SQL Server *không* dùng từ khoá đó** — chỉ viết \`WITH ten AS (...)\` và nó tự nhận ra đệ quy từ việc CTE tự tham chiếu. Cấu trúc anchor + \`UNION ALL\` + phần đệ quy thì **giống hệt** ở cả hai.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Sửa anchor để bắt đầu từ "Binh" — liệt kê mọi cấp dưới của riêng Binh.
2. Thêm cột đếm tổng số cấp dưới của mỗi người (khó hơn — thử sau khi học window).
3. Đi *ngược lên*: từ Em, liệt kê chuỗi quản lý tới sếp tổng.
4. Vì sao anchor phải là \`WHERE quan_ly_id IS NULL\` (điều gì xảy ra nếu bỏ điều kiện đó)?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Recursive CTE là công cụ duy nhất trong SQL đi hết được một cấu trúc phân cấp **độ sâu tuỳ ý**: một phần anchor cho điểm xuất phát, một phần đệ quy tự nối vào chính nó, lặp đến khi không còn hàng mới. Bạn duyệt được sơ đồ tổ chức, cây danh mục, phả hệ, và cộng dồn thông tin (cấp, đường dẫn) dọc đường. Đây là một trong những đỉnh cao của SQL thuần.

Từ mai ta chuyển sang một họ công cụ khác cũng cực mạnh: **window functions**. Chúng cho phép xếp hạng, đánh số, tính chạy dồn — mà **không gộp mất các dòng** như \`GROUP BY\`. Đây là thứ nâng bạn từ "biết SQL" lên "viết SQL phân tích".

Ngày 18: **Window functions (phần 1)** — \`ROW_NUMBER\`, \`RANK\`, \`DENSE_RANK\` và \`PARTITION BY\`: đánh số và xếp hạng trong từng nhóm mà vẫn giữ nguyên mọi dòng. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
