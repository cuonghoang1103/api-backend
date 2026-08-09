/** "100 Ngày Database với CuongThai" — Ngày 6: NULL & logic ba giá trị.
    Vì sao NULL = NULL không đúng, phải dùng IS NULL; bẫy WHERE <> loại luôn
    NULL; COUNT bỏ NULL; COALESCE thay giá trị mặc định.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day06, \pset null '(null)'). Ghi chú SQL Server (ISNULL). */
export default {
  day: 6,
  card: 'db-day-06',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'not-null-vs-null-modelling-missing-data',
    title: 'NOT NULL vs NULL: mô hình dữ liệu thiếu',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 6: NULL & LOGIC BA GIÁ TRỊ

Ngày 5 ta dùng \`NOT NULL\` để cấm cột bỏ trống. Hôm nay ta nhìn thẳng vào chính cái "trống" đó: **NULL**. Nó không phải số 0, không phải chuỗi rỗng, không phải \`false\`. NULL nghĩa là **"chưa biết" / "không có giá trị"** — và vì thế nó hành xử khác *mọi* giá trị khác, theo những cách khiến cả người có kinh nghiệm sập bẫy.

Đây là một trong những bài quan trọng nhất của cả loạt. Nắm chắc NULL, bạn tránh được một họ lỗi âm thầm mà rất khó truy. Mọi kết quả dưới đây là thật từ psql (đã bật hiển thị NULL thành \`(null)\` cho dễ thấy).

━━━━━━━━━━━━━━━━━━━━

🕳️ NULL KHÔNG BẰNG GÌ CẢ — KỂ CẢ CHÍNH NÓ

\`\`\`sql
SELECT (NULL = NULL) AS "null=null",
       (NULL = 5)     AS "null=5",
       (NULL IS NULL) AS "is null";
\`\`\`

\`\`\`
 null=null | null=5 | is null
-----------+--------+---------
 (null)    | (null) | t
(1 row)
\`\`\`

Đọc kỹ: \`NULL = NULL\` **không** ra \`true\` — nó ra \`NULL\`! Vì NULL là "chưa biết", nên hỏi "hai cái chưa-biết có bằng nhau không?" thì câu trả lời trung thực là "không biết" (chính là NULL). Chỉ \`NULL IS NULL\` mới ra \`true\` — đó là **cách đúng** để kiểm một giá trị có phải NULL hay không.

**Quy tắc số một về NULL:** đừng bao giờ dùng \`= NULL\` hay \`<> NULL\`. Luôn dùng \`IS NULL\` / \`IS NOT NULL\`.

━━━━━━━━━━━━━━━━━━━━

🔀 LOGIC BA GIÁ TRỊ — TRUE, FALSE, VÀ UNKNOWN

Ở đa số ngôn ngữ lập trình, biểu thức logic chỉ có \`true\`/\`false\`. SQL có **ba**: \`TRUE\`, \`FALSE\`, và \`UNKNOWN\` (sinh ra mỗi khi NULL tham gia so sánh). NULL còn "nuốt" mọi phép tính:

\`\`\`sql
SELECT (5 + NULL) AS cong, (100 * NULL) AS nhan;
\`\`\`

\`\`\`
  cong  |  nhan
--------+--------
 (null) | (null)
(1 row)
\`\`\`

Bất kỳ phép tính nào có NULL đều ra NULL — hợp lý: "5 cộng với một-số-chưa-biết" thì tổng cũng chưa biết.

Điều then chốt cho phần sau: **\`WHERE\` chỉ giữ những dòng mà điều kiện cho ra \`TRUE\`.** Dòng cho \`FALSE\` bị bỏ — và dòng cho \`UNKNOWN\` **cũng bị bỏ**. Đây chính là gốc của cái bẫy tiếp theo.

━━━━━━━━━━━━━━━━━━━━

🪤 CÁI BẪY: "KHÁC 300" LẠI LÀM NGƯỜI CHƯA-CÓ-THƯỞNG BIẾN MẤT

Bảng nhân viên, có người chưa có thưởng (\`thuong\` = NULL):

\`\`\`
 An=500,  Binh=NULL,  Chi=300,  Dung=NULL
\`\`\`

Bạn muốn "những người có thưởng khác 300". Trực giác nói: An, Binh, Dung (mọi người trừ Chi). Nhưng:

\`\`\`sql
SELECT ten FROM nhan_vien WHERE thuong <> 300 ORDER BY ten;
\`\`\`

\`\`\`
 ten
-----
 An
(1 row)
\`\`\`

**Chỉ mỗi An!** Vì với Binh và Dung, điều kiện là \`NULL <> 300\` → \`UNKNOWN\` → dòng bị bỏ. Người "chưa có thưởng" lặng lẽ biến mất khỏi kết quả. Đây là loại bug làm sai báo cáo, sai số liệu, mà không hề có thông báo lỗi nào. Nếu bạn muốn gộp cả họ, phải nói rõ: \`WHERE thuong <> 300 OR thuong IS NULL\`.

━━━━━━━━━━━━━━━━━━━━

✅ LÀM VIỆC ĐÚNG VỚI NULL

**\`COUNT\` phân biệt hai kiểu đếm:**

\`\`\`sql
SELECT count(*) AS tong_dong, count(thuong) AS co_thuong FROM nhan_vien;
\`\`\`

\`\`\`
 tong_dong | co_thuong
-----------+-----------
         4 |         2
(1 row)
\`\`\`

\`count(*)\` đếm **mọi dòng** (4), còn \`count(thuong)\` chỉ đếm dòng có giá trị (bỏ 2 NULL → 2). Khác biệt này cực quan trọng khi tính trung bình, tỉ lệ…

**Lọc NULL đúng cách** bằng \`IS NULL\`:

\`\`\`sql
SELECT ten FROM nhan_vien WHERE thuong IS NULL ORDER BY ten;   -- -> Binh, Dung
\`\`\`

**Thay NULL bằng giá trị mặc định** bằng \`COALESCE\`:

\`\`\`sql
SELECT ten, COALESCE(thuong, 0) AS thuong_thuc FROM nhan_vien ORDER BY id;
\`\`\`

\`\`\`
 ten  | thuong_thuc
------+-------------
 An   |         500
 Binh |           0
 Chi  |         300
 Dung |           0
(4 rows)
\`\`\`

\`COALESCE(a, b)\` trả về \`a\` nếu \`a\` không NULL, ngược lại trả \`b\`. Rất hay dùng để "coi như 0" khi tính toán.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

- **Hành vi NULL:** giống hệt — cả hai theo chuẩn ANSI (so sánh với NULL ra UNKNOWN, \`WHERE\` bỏ dòng UNKNOWN). Cùng dùng \`IS NULL\`/\`IS NOT NULL\`.
- **Thay NULL:** \`COALESCE(x, y)\` chạy ở **cả hai** (ưu tiên dùng cái này). SQL Server có thêm \`ISNULL(x, y)\` riêng — tương tự nhưng chỉ nhận 2 tham số và xử lý kiểu hơi khác.
- *(Mẹo hiển thị: trong psql gõ \`\\pset null '(null)'\` để NULL hiện rõ thay vì ô trống.)*

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Đoán rồi chạy: \`SELECT NULL OR TRUE;\` và \`SELECT NULL AND FALSE;\` — kết quả có làm bạn bất ngờ?
2. Viết câu lấy nhân viên có thưởng khác 300 **bao gồm cả** người NULL.
3. Tính tổng thưởng trung bình — \`avg(thuong)\` có tính người NULL không? Còn \`avg(COALESCE(thuong,0))\`?
4. Vì sao chuỗi rỗng \`''\` KHÁC \`NULL\`? Thử \`SELECT '' IS NULL;\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

NULL là "chưa biết", nên nó phá vỡ trực giác: \`NULL = NULL\` không đúng, so sánh với NULL cho \`UNKNOWN\`, \`WHERE\` lặng lẽ bỏ các dòng UNKNOWN, và \`<>\` có thể làm cả một nhóm dữ liệu biến mất khỏi báo cáo. Vũ khí của bạn: \`IS NULL\`/\`IS NOT NULL\` để hỏi, \`COUNT(cot)\` để đếm có giá trị, \`COALESCE\` để thay mặc định. Hiểu NULL là qua được một trong những ải khó nhất của SQL.

Tới đây bạn đã đọc và định hình dữ liệu khá vững. Ngày mai ta quay lại phía **ghi** — nhưng lần này nghiêm túc về sự an toàn: sửa và xoá thế nào để không phá cả bảng chỉ vì quên một chữ.

Ngày 7: **Ghi dữ liệu an toàn** — \`INSERT\` nhiều dòng, \`UPDATE\`/\`DELETE\` và luật \`WHERE\` sống còn, cùng \`RETURNING\` để thấy ngay thứ mình vừa đổi. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
