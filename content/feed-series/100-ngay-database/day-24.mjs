/** "100 Ngày Database với CuongThai" — Ngày 24: Dạng chuẩn 1 (1NF).
    Mỗi ô một giá trị nguyên tử; không danh sách nhồi trong cột; không nhóm cột
    lặp. Chứng minh bằng SQL: list-trong-ô làm truy vấn sai.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day24). 1NF là nguyên tắc thiết kế — hệ nào cũng vậy. */
export default {
  day: 24,
  card: 'db-day-24',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'composite-primary-key-for-a-join-table',
    title: 'Khoá chính tổng hợp cho bảng nối',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 24: DẠNG CHUẨN 1 (1NF) — MỖI Ô MỘT GIÁ TRỊ

Ngày 23 ta thấy bảng "gộp tất cả" gây dị thường, và thuốc chữa là **chuẩn hoá** — tách bảng có nguyên tắc. Nguyên tắc đó là một chuỗi **dạng chuẩn** (normal forms), và bước đầu tiên — nền của tất cả — là **1NF (First Normal Form)**. Luật của 1NF nghe rất đơn giản: **mỗi ô chứa đúng một giá trị nguyên tử**, không danh sách nhồi trong một cột, không nhóm cột lặp lại. Nhưng vi phạm nó phá hỏng khả năng truy vấn theo cách rất khó chịu — ta xem tận mắt bằng SQL thật.

━━━━━━━━━━━━━━━━━━━━

🚫 VI PHẠM 1NF: NHỒI DANH SÁCH VÀO MỘT Ô

Cám dỗ phổ biến: một người có nhiều số điện thoại, nhét luôn vào một ô cho gọn:

\`\`\`
 ten  | dien_thoai
------+-------------
 An   | 0901, 0902     <- HAI số trong một ô
 Binh | 09021
 Chi  | 0903
\`\`\`

Trông "tiết kiệm", nhưng giờ thử một câu hỏi tầm thường: *"ai có số 0902?"*

\`\`\`sql
SELECT ten FROM lien_he_xau WHERE dien_thoai = '0902';
-- -> (0 rows)
\`\`\`

**Không dòng nào!** Dù An rõ ràng có số 0902 — nhưng giá trị trong ô là chuỗi \`'0901, 0902'\`, không bằng \`'0902'\`. So khớp chính xác trở nên vô dụng.

━━━━━━━━━━━━━━━━━━━━

⚠️ BUỘC DÙNG LIKE MỜ — VÀ BẮT NHẦM

Để "cứu", bạn có thể dùng \`LIKE\`. Nhưng nó mong manh và sai:

\`\`\`sql
SELECT ten FROM lien_he_xau WHERE dien_thoai LIKE '%0902%' ORDER BY ten;
\`\`\`

\`\`\`
 ten
------
 An
 Binh
(2 rows)
\`\`\`

Binh lọt vào — dù số của Binh là \`09021\`, một số **khác hẳn** chỉ *tình cờ chứa* chuỗi "0902". Đây là loại bug âm thầm và nguy hiểm: kết quả *trông* có lý nhưng sai. Và mọi thao tác khác cũng hỏng theo — bạn không \`JOIN\` được theo số điện thoại, không \`GROUP BY\` được, không đặt \`UNIQUE\` hay khoá ngoại lên nó.

━━━━━━━━━━━━━━━━━━━━

✅ ĐÚNG 1NF: MỖI GIÁ TRỊ MỘT DÒNG

Cách sửa: tách mỗi số điện thoại thành một **dòng** riêng, mỗi ô đúng một giá trị:

\`\`\`sql
CREATE TABLE lien_he (ten TEXT, dien_thoai TEXT);
INSERT INTO lien_he VALUES ('An','0901'), ('An','0902'), ('Binh','09021'), ('Chi','0903');

SELECT ten FROM lien_he WHERE dien_thoai = '0902';   -- -> An  (chính xác!)
\`\`\`

Giờ so khớp chính xác chạy đúng, và mọi thứ khác cũng dễ. Đếm mỗi người có mấy số?

\`\`\`sql
SELECT ten, count(*) AS so_luong FROM lien_he GROUP BY ten ORDER BY ten;
-- -> An 2, Binh 1, Chi 1
\`\`\`

Dữ liệu ở 1NF thì **truy vấn được đúng nghĩa**: lọc, đếm, gộp, nối, ràng buộc — tất cả hoạt động.

━━━━━━━━━━━━━━━━━━━━

🔁 1NF CŨNG CẤM "NHÓM CỘT LẶP"

Có một kiểu vi phạm 1NF thứ hai, tinh vi hơn: các cột **đánh số lặp lại**. Ví dụ một bảng đơn hàng với \`san_pham_1\`, \`san_pham_2\`, \`san_pham_3\`. Vấn đề: đơn có 4 sản phẩm thì sao? Truy vấn "đơn nào có bán 'Chuot'" phải kiểm cả ba cột. Cách đúng vẫn là **mỗi sản phẩm một dòng** trong một bảng chi tiết (đúng như \`chi_tiet_don\` ta đã dùng). Quy tắc chung: *khi thấy mình đánh số cột (\_1, \_2, \_3), gần như chắc chắn nên chuyển thành dòng.*

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

1NF là **nguyên tắc thiết kế**, đúng cho mọi hệ. Một điểm thú vị riêng của PostgreSQL: nó *có* các kiểu \`ARRAY\` và \`JSONB\` cho phép lưu danh sách/cấu trúc trong một cột (Giai đoạn 4 ta sẽ học). Nhưng đó là **phi chuẩn hoá CÓ CHỦ Ý** cho dữ liệu bán cấu trúc — không phải cái cớ để nhồi dữ liệu-cần-truy-vấn-quan-hệ vào một ô. Khi bạn cần lọc/nối/ràng buộc theo từng phần tử, hãy giữ 1NF (mỗi giá trị một dòng). SQL Server cũng có kiểu \`XML\`/\`JSON\` tương tự, với cùng lời khuyên.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Cho bảng \`sinh_vien(ten, mon_hoc)\` với \`mon_hoc = 'Toan, Ly, Hoa'\` — chuyển về 1NF.
2. Vì sao \`WHERE mon_hoc LIKE '%Ly%'\` có thể bắt nhầm (gợi ý: "Lyện")?
3. Thiết kế lại một bảng có \`dia_chi_1\`, \`dia_chi_2\` cho đúng 1NF.
4. Kể một trường hợp bạn *cố ý* muốn lưu mảng trong một cột — khi nào chấp nhận được?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

1NF là viên gạch nền của thiết kế đúng: **mỗi ô một giá trị nguyên tử**, không danh sách trong cột, không nhóm cột lặp. Vi phạm nó khiến truy vấn chính xác bất khả thi, buộc dùng \`LIKE\` mờ dễ sai, và chặn mọi \`JOIN\`/\`GROUP BY\`/ràng buộc. Sửa bằng cách tách giá trị thành các dòng. Một bảng chưa đạt 1NF thì mọi dạng chuẩn sau đều vô nghĩa.

Nhưng đạt 1NF chưa đủ. Khi bảng có **khoá tổng hợp** (nhiều cột làm khoá), lại nảy ra một loại dư thừa mới — vài cột chỉ phụ thuộc vào *một phần* của khoá. Dọn nó là việc của 2NF, bài ngày mai.

Ngày 25: **Dạng chuẩn 2 (2NF)** — trên nền 1NF, loại bỏ "phụ thuộc bộ phận": cột không được chỉ phụ thuộc vào một phần của khoá tổng hợp. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
