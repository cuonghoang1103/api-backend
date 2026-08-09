/** "100 Ngày Database với CuongThai" — Ngày 9: Sắp xếp & phân trang.
    ORDER BY (một/nhiều cột, ASC/DESC), vị trí của NULL (NULLS FIRST/LAST),
    LIMIT/OFFSET để phân trang, và luật "không ORDER BY = không đảm bảo thứ tự".

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day09). Ghi chú SQL Server (TOP, OFFSET FETCH, NULL ngược chiều). */
export default {
  day: 9,
  card: 'db-day-09',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'sort-results-with-order-by',
    title: 'Sắp xếp kết quả với ORDER BY',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 9: SẮP XẾP & PHÂN TRANG

Ngày 8 bạn lọc ra đúng những dòng cần. Nhưng một kết quả 10.000 dòng thì hiển thị kiểu gì? Câu trả lời gồm hai phần: **sắp xếp** (\`ORDER BY\`) để dòng quan trọng lên trên, và **phân trang** (\`LIMIT\`/\`OFFSET\`) để lấy từng khúc nhỏ. Đây là bộ đôi đứng sau mọi bảng xếp hạng, mọi danh sách "Trang 1, 2, 3…" bạn thấy hằng ngày.

Có một luật ngầm quan trọng ta sẽ chạm tới: **PostgreSQL không hứa thứ tự dòng nếu bạn không \`ORDER BY\`**. Bỏ qua điều này là nguồn của những bug phân trang rất khó chịu. Dùng bảng học sinh (có em chưa có điểm — \`NULL\`), kết quả bên dưới là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

↕️ ORDER BY — TĂNG, GIẢM, VÀ NHIỀU TẦNG

Mặc định \`ORDER BY\` sắp **tăng dần** (\`ASC\`); thêm \`DESC\` để giảm dần:

\`\`\`sql
SELECT ten, diem FROM hoc_sinh ORDER BY diem DESC, ten;
\`\`\`

Khi hai dòng bằng nhau ở cột chính, bạn nên có **cột phân giải hoà** (ở đây là \`, ten\`) để thứ tự luôn ổn định. Sắp xếp **nhiều tầng** cũng chỉ là liệt kê nhiều cột — "lớp tăng dần, trong mỗi lớp thì điểm giảm dần":

\`\`\`sql
SELECT ten, lop, diem FROM hoc_sinh ORDER BY lop ASC, diem DESC NULLS LAST, ten;
\`\`\`

\`\`\`
  ten  | lop |  diem
-------+-----+--------
 An    | 12A |    9.2
 Binh  | 12A |    7.5
 Dung  | 12A | (null)
 Giang | 12A | (null)
 Hoa   | 12B |    9.5
 Chi   | 12B |    8.8
 Phuc  | 12B |    6.0
(7 rows)
\`\`\`

Máy sắp theo \`lop\` trước; những dòng cùng lớp mới xét tiếp tới \`diem\`.

━━━━━━━━━━━━━━━━━━━━

🕳️ NULL SẮP Ở ĐÂU? — MỘT KHÁC BIỆT DỄ SẬP

NULL là "chưa biết", vậy nó lớn hay nhỏ? PostgreSQL quy ước **NULL lớn hơn mọi giá trị** — nên khi sắp giảm dần, NULL nhảy lên **đầu**:

\`\`\`sql
SELECT ten, diem FROM hoc_sinh ORDER BY diem DESC, ten;
\`\`\`

\`\`\`
  ten  |  diem
-------+--------
 Dung  | (null)
 Giang | (null)
 Hoa   |    9.5
 An    |    9.2
 ...
\`\`\`

Cho một bảng xếp hạng, để hai em "chưa có điểm" đứng đầu là vô lý. Chủ động đẩy chúng xuống cuối bằng \`NULLS LAST\`:

\`\`\`sql
SELECT ten, diem FROM hoc_sinh ORDER BY diem DESC NULLS LAST, ten;
-- -> Hoa 9.5, An 9.2, Chi 8.8, Binh 7.5, Phuc 6.0, rồi (null), (null)
\`\`\`

Bạn điều khiển được vị trí NULL bằng \`NULLS FIRST\` / \`NULLS LAST\` — một công cụ nhỏ mà cứu nhiều báo cáo.

━━━━━━━━━━━━━━━━━━━━

📄 LIMIT & OFFSET — PHÂN TRANG

\`LIMIT n\` lấy \`n\` dòng đầu; \`OFFSET k\` bỏ qua \`k\` dòng đầu. Ghép lại ra "từng trang". Top 3 điểm cao:

\`\`\`sql
SELECT ten, diem FROM hoc_sinh ORDER BY diem DESC NULLS LAST, ten LIMIT 3;
-- -> Hoa (9.5), An (9.2), Chi (8.8)
\`\`\`

Trang thứ hai (mỗi trang 3 dòng → bỏ 3 dòng đầu, lấy 3 tiếp):

\`\`\`sql
SELECT ten, diem FROM hoc_sinh ORDER BY diem DESC NULLS LAST, ten LIMIT 3 OFFSET 3;
\`\`\`

\`\`\`
 ten  |  diem
------+--------
 Binh |    7.5
 Phuc |    6.0
 Dung | (null)
(3 rows)
\`\`\`

Công thức phân trang quen thuộc: **trang \`p\`, mỗi trang \`n\` dòng → \`LIMIT n OFFSET (p-1)*n\`**. (Ở giai đoạn hiệu năng ta sẽ thấy \`OFFSET\` lớn thì chậm, và cách thay bằng "con trỏ khoá" — nhưng \`LIMIT/OFFSET\` là nền tảng cần nắm trước.)

━━━━━━━━━━━━━━━━━━━━

⚠️ LUẬT: KHÔNG ORDER BY = THỨ TỰ KHÔNG ĐẢM BẢO

Điểm cực dễ sai: \`SELECT ... LIMIT 10\` mà **không** \`ORDER BY\` **không** cho bạn "10 dòng đầu tiên" theo một nghĩa ổn định nào cả. PostgreSQL trả về "10 dòng *nào đó*" tuỳ cách nó đọc dữ liệu — hôm nay thế này, mai chèn thêm dữ liệu lại khác. Phân trang mà thiếu \`ORDER BY\` sẽ khiến cùng một bản ghi xuất hiện ở hai trang, hoặc biến mất. **Luật: \`LIMIT\`/\`OFFSET\` luôn đi kèm một \`ORDER BY\` xác định** (thường phải bao gồm một cột duy nhất như khoá chính để không có hoà).

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

- **Lấy N dòng đầu:** PostgreSQL \`... ORDER BY ... LIMIT 3\`. SQL Server có hai cách: cũ là \`SELECT TOP 3 ...\`, chuẩn (SQL:2011) là \`... ORDER BY ... OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY\`.
- **Phân trang:** PostgreSQL \`LIMIT n OFFSET k\` · SQL Server \`OFFSET k ROWS FETCH NEXT n ROWS ONLY\` (bắt buộc có \`ORDER BY\`). Thực ra cú pháp \`OFFSET ... FETCH\` cũng chạy trên PostgreSQL — nếu muốn viết một kiểu cho cả hai.
- **Vị trí NULL:** PostgreSQL coi NULL **lớn nhất** (ASC → NULL cuối). SQL Server coi NULL **nhỏ nhất** (ASC → NULL đầu) — **ngược nhau**! Và SQL Server **không có** cú pháp \`NULLS LAST\`; phải giả lập bằng \`ORDER BY CASE WHEN diem IS NULL THEN 1 ELSE 0 END, diem DESC\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Lấy 2 học sinh điểm **thấp nhất** (không tính người chưa có điểm).
2. Viết truy vấn "trang 3, mỗi trang 2 dòng" cho danh sách xếp theo điểm giảm dần.
3. Chạy một \`SELECT ... LIMIT 3\` **không** \`ORDER BY\` vài lần sau khi thêm/xoá dòng — thứ tự có đổi không?
4. Sắp học sinh theo lớp giảm dần, rồi tên tăng dần.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`ORDER BY\` sắp kết quả theo một hoặc nhiều cột, tăng/giảm, và bạn còn điều khiển được cả vị trí của \`NULL\`. \`LIMIT\`/\`OFFSET\` cắt kết quả thành từng trang. Nhớ luật sống còn: **phân trang phải luôn kèm \`ORDER BY\` xác định**, nếu không thứ tự là ngẫu nhiên và trang sẽ "nhảy". Đây là bộ đôi đứng sau mọi feed, mọi bảng xếp hạng.

Chín ngày qua, bạn đã làm chủ *một* bảng: tạo, ràng buộc, ghi, lọc, sắp xếp. Nhưng dữ liệu thật sống trong **nhiều bảng có quan hệ** với nhau — học sinh thuộc lớp, đơn hàng thuộc khách. Ngày mai ta nối chúng lại, khép Giai đoạn 1 và mở cánh cửa lớn nhất của SQL.

Ngày 10: **Khoá ngoại & quan hệ** — \`FOREIGN KEY\` liên kết hai bảng, đảm bảo toàn vẹn tham chiếu (không có "đơn hàng mồ côi"), và tổng kết chặng Nền tảng — chuẩn bị cho \`JOIN\`. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
