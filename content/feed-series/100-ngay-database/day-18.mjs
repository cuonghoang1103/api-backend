/** "100 Ngày Database với CuongThai" — Ngày 18: Window functions P1.
    OVER (giữ mọi dòng, khác GROUP BY), ROW_NUMBER, RANK vs DENSE_RANK (xử lý
    hoà), PARTITION BY (xếp hạng lại trong từng nhóm).

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day18). Chuẩn SQL — SQL Server y hệt. */
export default {
  day: 18,
  card: 'db-day-18',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'number-rows-with-rownumber',
    title: 'Đánh số dòng với ROW_NUMBER',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 18: WINDOW FUNCTIONS (P1) — XẾP HẠNG & ĐÁNH SỐ

Nhớ Ngày 13: \`GROUP BY\` gộp nhiều dòng thành *một* — bạn được con số tổng kết nhưng **mất các dòng chi tiết**. Vậy làm sao vừa xếp hạng học sinh, vừa vẫn thấy *từng* học sinh? Câu trả lời là **window functions** — có lẽ là tính năng bị đánh giá thấp nhất mà lại mạnh nhất của SQL. Chúng tính toán trên một "cửa sổ" các dòng nhưng **không gộp mất dòng nào**. Hôm nay ta học nhóm xếp hạng: \`ROW_NUMBER\`, \`RANK\`, \`DENSE_RANK\`, và \`PARTITION BY\`. Kết quả là thật từ psql, trên một bảng học sinh (12A và 12B).

━━━━━━━━━━━━━━━━━━━━

🪟 OVER — CHÌA KHOÁ CỦA WINDOW FUNCTION

Điểm khác biệt cốt lõi với \`GROUP BY\` nằm ở mệnh đề \`OVER\`:

\`\`\`sql
SELECT ten, diem, rank() OVER (ORDER BY diem DESC) AS hang
FROM hoc_sinh;
\`\`\`

\`GROUP BY diem\` sẽ nén các dòng cùng điểm lại. Nhưng \`rank() OVER (ORDER BY diem DESC)\` thì **giữ nguyên mọi dòng học sinh**, chỉ *thêm* một cột \`hang\` tính bằng cách nhìn qua toàn bộ tập dòng. \`OVER (...)\` chính là nơi bạn định nghĩa "cửa sổ" — tập dòng và thứ tự để hàm tính trên đó. Đây là ý tưởng nền tảng: **window = tính xuyên nhiều dòng, nhưng đầu ra vẫn một-dòng-một-dòng.**

━━━━━━━━━━━━━━━━━━━━

🔢 ROW_NUMBER, RANK, DENSE_RANK — BA KIỂU ĐÁNH SỐ

Ba hàm này trông giống nhau nhưng xử lý **điểm bằng nhau (hoà)** khác hẳn. Xem cả ba cạnh nhau (có hai bạn cùng 8.5):

\`\`\`sql
SELECT ten, diem,
  row_number() OVER (ORDER BY diem DESC, ten) AS rn,
  rank()       OVER (ORDER BY diem DESC)      AS rnk,
  dense_rank() OVER (ORDER BY diem DESC)      AS drnk
FROM hoc_sinh ORDER BY diem DESC, ten;
\`\`\`

\`\`\`
 ten  | diem | rn | rnk | drnk
------+------+----+-----+------
 Em   |  9.5 |  1 |   1 |    1
 An   |  9.2 |  2 |   2 |    2
 Binh |  8.5 |  3 |   3 |    3
 Chi  |  8.5 |  4 |   3 |    3
 Phuc |  8.0 |  5 |   5 |    4
 Dung |  7.0 |  6 |   6 |    5
(6 rows)
\`\`\`

Nhìn hàng Binh, Chi (cùng 8.5) và Phuc ngay sau:
- **\`ROW_NUMBER\`** — luôn ra số **khác nhau** (3, 4), kể cả khi hoà. Dùng khi cần "đánh số thứ tự duy nhất". (Lưu ý: khi hoà, ai được 3 ai được 4 là tuỳ ý — nên thêm cột phân giải như \`, ten\` để ổn định.)
- **\`RANK\`** — hoà thì **cùng hạng** (3, 3), rồi **nhảy** qua số bị chiếm: Phuc thành hạng **5** (không có hạng 4). Giống xếp hạng thể thao: hai người đồng hạng 3 thì người kế là hạng 5.
- **\`DENSE_RANK\`** — hoà cùng hạng (3, 3) nhưng **không nhảy**: Phuc là hạng **4**. Dùng khi muốn "các mức hạng liền mạch".

Chọn hàm theo đúng ý nghĩa bạn cần — đây là chỗ nhiều người dùng nhầm.

━━━━━━━━━━━━━━━━━━━━

🧩 PARTITION BY — XẾP HẠNG LẠI TRONG TỪNG NHÓM

Thường bạn không muốn xếp hạng toàn trường, mà **trong từng lớp**. \`PARTITION BY\` chia cửa sổ thành các nhóm, và hàm chạy lại từ đầu cho mỗi nhóm:

\`\`\`sql
SELECT lop, ten, diem,
  rank() OVER (PARTITION BY lop ORDER BY diem DESC) AS hang_trong_lop
FROM hoc_sinh ORDER BY lop, diem DESC, ten;
\`\`\`

\`\`\`
 lop | ten  | diem | hang_trong_lop
-----+------+------+----------------
 12A | An   |  9.2 |              1
 12A | Binh |  8.5 |              2
 12A | Chi  |  8.5 |              2
 12A | Dung |  7.0 |              4
 12B | Em   |  9.5 |              1
 12B | Phuc |  8.0 |              2
\`\`\`

Mỗi lớp có "hạng 1" riêng — thứ hạng **reset** ở ranh giới nhóm. \`PARTITION BY\` với window giống vai trò \`GROUP BY\` với hàm gộp, chỉ khác: nó **không** gộp mất dòng. Đây là cách trả lời "top 1 mỗi lớp", "sản phẩm bán chạy nhất mỗi danh mục"… mà vẫn giữ chi tiết.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt** ở cả hai hệ — window functions là chuẩn SQL và cả hai hỗ trợ đầy đủ: \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`, \`OVER\`, \`PARTITION BY\`, \`ORDER BY\` trong cửa sổ. Bạn viết một kiểu, chạy cả hai. (SQL Server cũng có \`NTILE\`, \`LAG\`, \`LEAD\`… mà ta gặp ngày mai — cũng y hệt.)

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Lấy **học sinh đứng nhất mỗi lớp** (gợi ý: \`WHERE\` không dùng được window trực tiếp → bọc trong CTE rồi lọc \`hang = 1\`).
2. So sánh kết quả \`RANK\` và \`DENSE_RANK\` khi có **ba** bạn cùng điểm.
3. Đánh số thứ tự học sinh theo tên (A→Z) bằng \`ROW_NUMBER\`.
4. Vì sao không thể viết \`WHERE rank() OVER (...) = 1\` trực tiếp?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Window functions tính toán xuyên nhiều dòng mà **vẫn giữ từng dòng** — điều \`GROUP BY\` không làm được. \`ROW_NUMBER\` đánh số duy nhất; \`RANK\` và \`DENSE_RANK\` xếp hạng, khác nhau ở cách xử lý hoà (nhảy số hay không); \`PARTITION BY\` cho phép xếp hạng lại trong từng nhóm. Đây là bước nâng bạn từ "truy vấn dữ liệu" lên "phân tích dữ liệu".

Nhưng xếp hạng mới là một nửa sức mạnh của window. Nửa còn lại là **nhìn qua các dòng khác trong cửa sổ**: cộng dồn một tổng chạy theo thời gian, so một dòng với dòng ngay trước nó (tháng này so tháng trước). Đó là bài ngày mai.

Ngày 19: **Window functions (P2)** — tổng chạy dồn (\`SUM() OVER\`), \`LAG\`/\`LEAD\` (nhìn dòng trước/sau), và khung cửa sổ (frame). Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
