/** "100 Ngày Database với CuongThai" — Ngày 2: Cài PostgreSQL & câu SQL đầu tiên.
    Cài bằng Docker (1 dòng), kết nối bằng psql, chạy câu SELECT đầu tiên, rồi
    đi trọn vòng đời dữ liệu CREATE → INSERT → SELECT → UPDATE → DELETE.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day02). Ghi chú SQL Server ở chỗ khác biệt. */
export default {
  day: 2,
  card: 'db-day-02',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'query-without-a-table',
    title: 'Truy vấn không cần bảng: SELECT như máy tính',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 2: CÀI POSTGRESQL & CÂU SQL ĐẦU TIÊN

Ngày 1 ta nói: cơ sở dữ liệu không phải "Excel xịn", mà là một **chương trình luôn chạy**, giữ dữ liệu có luật và phục vụ nhiều người. Hôm nay bạn tự tay dựng chương trình đó trên máy mình — và trong vòng năm phút, gõ câu SQL đầu tiên của đời mình.

Không cần đọc lý thuyết dài. Ta cài, kết nối, rồi đi hết một vòng đời dữ liệu thật: tạo bảng, thêm dòng, đọc lại, sửa, xoá. Mọi lệnh dưới đây tôi đã **chạy thật trên PostgreSQL** và dán đúng kết quả.

━━━━━━━━━━━━━━━━━━━━

🐳 CÀI POSTGRESQL TRONG ĐÚNG MỘT DÒNG

Cách gọn nhất để có một PostgreSQL sạch là dùng **Docker** — bạn không phải cài đặt lằng nhằng vào máy, và xoá đi cũng sạch bong.

\`\`\`bash
docker run --name pg \\
  -e POSTGRES_PASSWORD=123456 \\
  -p 5432:5432 -d postgres:15
\`\`\`

Đọc câu lệnh này như một câu tiếng Việt:
- \`postgres:15\` — lấy **ảnh** PostgreSQL phiên bản 15 (Docker tự tải về).
- \`--name pg\` — đặt tên container là \`pg\` cho dễ gọi.
- \`-e POSTGRES_PASSWORD=123456\` — đặt **mật khẩu** cho tài khoản quản trị \`postgres\`.
- \`-p 5432:5432\` — mở **cổng** 5432 (cổng mặc định của PostgreSQL) ra ngoài để kết nối.
- \`-d\` — chạy nền (detached).

Vài giây sau, bạn đã có một máy chủ cơ sở dữ liệu đang chạy. (Nếu không thích Docker, bạn cài trực tiếp bằng bộ cài trên postgresql.org cũng ra kết quả y hệt — phần còn lại của bài không đổi.)

━━━━━━━━━━━━━━━━━━━━

🔌 KẾT NỐI BẰNG psql

\`psql\` là trình dòng lệnh chính thức để "nói chuyện" với PostgreSQL. Vào container và mở nó:

\`\`\`bash
docker exec -it pg psql -U postgres
# hoặc nếu máy bạn đã có psql:  psql -h localhost -U postgres
\`\`\`

Bạn sẽ thấy dấu nhắc \`postgres=#\`. Đây là nơi gõ SQL. Vài lệnh của **riêng psql** (bắt đầu bằng dấu \`\\\`, không phải SQL) rất hay dùng:

- \`\\l\` — liệt kê các database
- \`\\dt\` — liệt kê bảng trong database hiện tại
- \`\\d ten_bang\` — xem cấu trúc một bảng
- \`\\q\` — thoát

Phân biệt cho rõ: câu **SQL** (như \`SELECT ...\`) là chuẩn chung, chạy ở đâu cũng vậy; còn lệnh \`\\dt\` là **tiện ích của psql**, SQL Server không có (bên đó dùng SSMS hoặc thủ tục hệ thống). Ta sẽ nhắc lại điểm này ở cuối.

━━━━━━━━━━━━━━━━━━━━

🎯 CÂU SQL ĐẦU TIÊN — SELECT KHÔNG CẦN BẢNG

Điều bất ngờ dễ chịu: \`SELECT\` **không bắt buộc phải có bảng**. Nó tính một biểu thức và trả kết quả ngay — như một máy tính bỏ túi biết nói SQL:

\`\`\`sql
SELECT 'Xin chào, PostgreSQL!' AS loi_chao;
\`\`\`

\`\`\`
       loi_chao
-----------------------
 Xin chào, PostgreSQL!
(1 row)
\`\`\`

\`AS loi_chao\` chỉ là **đặt tên** cho cột kết quả cho dễ đọc. Thử phép tính:

\`\`\`sql
SELECT 2 + 3 AS tong, 7 / 2 AS chia_nguyen, 7 % 2 AS phan_du;
\`\`\`

\`\`\`
 tong | chia_nguyen | phan_du
------+-------------+---------
    5 |           3 |       1
(1 row)
\`\`\`

Chú ý cái bẫy đầu tiên của SQL: \`7 / 2\` ra **3**, không phải 3.5! Vì cả hai đều là **số nguyên**, phép chia cũng cho số nguyên (phần dư lấy bằng \`%\`). Muốn ra 3.5, một trong hai phải là số thực: \`7.0 / 2\`. Ghi nhớ điều này — nó gây lỗi tính toán âm thầm cho rất nhiều người mới.

━━━━━━━━━━━━━━━━━━━━

🔄 TRỌN MỘT VÒNG ĐỜI DỮ LIỆU

Giờ làm việc thật: một bảng "việc cần làm", rồi Tạo → Đọc → Sửa → Xoá (tiếng Anh gọi là **CRUD**). Đầu tiên khai báo bảng có hình dạng gì:

\`\`\`sql
CREATE TABLE viec_can_lam (
  id       SERIAL PRIMARY KEY,
  noi_dung TEXT    NOT NULL,
  xong     BOOLEAN NOT NULL DEFAULT false
);
\`\`\`

Ba điều đáng chú ý: \`SERIAL\` là kiểu **tự tăng** (PostgreSQL tự điền 1, 2, 3… cho \`id\`, bạn khỏi đánh số tay); \`NOT NULL\` bắt buộc phải có nội dung; \`DEFAULT false\` cho \`xong\` một giá trị mặc định.

**Thêm hai dòng** (không cần điền \`id\` và \`xong\` — để máy tự lo):

\`\`\`sql
INSERT INTO viec_can_lam (noi_dung) VALUES ('Cai PostgreSQL bang Docker');
INSERT INTO viec_can_lam (noi_dung) VALUES ('Go cau SQL dau tien');
\`\`\`

PostgreSQL đáp \`INSERT 0 1\` sau mỗi câu (nghĩa là ghi 1 dòng). **Đọc lại:**

\`\`\`sql
SELECT * FROM viec_can_lam ORDER BY id;
\`\`\`

\`\`\`
 id |          noi_dung          | xong
----+----------------------------+------
  1 | Cai PostgreSQL bang Docker | f
  2 | Go cau SQL dau tien        | f
(2 rows)
\`\`\`

Thấy chưa: \`id\` được tự sinh 1 và 2, còn \`xong\` lấy mặc định \`f\` (false). **Sửa** — đánh dấu việc 1 đã xong:

\`\`\`sql
UPDATE viec_can_lam SET xong = true WHERE id = 1;
\`\`\`

Kết quả \`UPDATE 1\` (sửa 1 dòng), và giờ dòng 1 có \`xong = t\`. **Xoá** việc 2:

\`\`\`sql
DELETE FROM viec_can_lam WHERE id = 2;
SELECT count(*) AS con_lai FROM viec_can_lam;   -- -> 1
\`\`\`

\`\`\`
 con_lai
---------
       1
(1 row)
\`\`\`

Vậy là bạn vừa đi trọn **CRUD** — bốn việc cốt lõi mà mọi ứng dụng trên đời đều làm với dữ liệu.

⚠️ Một thói quen sống còn: \`UPDATE\` và \`DELETE\` mà **quên \`WHERE\`** sẽ tác động lên **TOÀN BỘ bảng**. \`DELETE FROM viec_can_lam;\` (không WHERE) xoá sạch mọi dòng. Ta sẽ nói kỹ về sự an toàn này ở Ngày 7 — giờ chỉ cần khắc cốt: *nghĩ tới \`WHERE\` trước khi gõ Enter.*

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER — KHÁC GÌ Ở BƯỚC NÀY?

Đúng như Ngày 1 hứa, mỗi chỗ khác biệt tôi sẽ ghi chú để bạn dùng được cả hai:

- **Cài & kết nối:** SQL Server cài bằng bộ cài của Microsoft (hoặc Docker \`mcr.microsoft.com/mssql/server\`), kết nối bằng \`sqlcmd\` hoặc công cụ đồ hoạ **SSMS**. Còn PostgreSQL dùng \`psql\`.
- **Tự tăng id:** PostgreSQL \`SERIAL\` (hoặc chuẩn hơn: \`GENERATED ALWAYS AS IDENTITY\`) · SQL Server \`IDENTITY(1,1)\`.
- **Lệnh tiện ích:** \`\\dt\`, \`\\d\` là **của psql**. SQL Server không có; bên đó xem bảng bằng SSMS hoặc \`SELECT * FROM sys.tables;\`.
- **Còn lại giống hệt:** \`CREATE TABLE\`, \`INSERT\`, \`SELECT\`, \`UPDATE\`, \`DELETE\`, \`WHERE\`, \`count(*)\` — chạy y như nhau ở cả hai.

Nói cách khác: cú pháp *lõi* của SQL là chung; chỉ vài chỗ "hành chính" (cài đặt, công cụ, tự tăng id) là khác phương ngữ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chạy \`SELECT 10 / 3, 10 % 3, 10.0 / 3;\` và giải thích ba kết quả.
2. Tạo bảng \`ghi_chu(id SERIAL PRIMARY KEY, tieu_de TEXT NOT NULL)\`, thêm 3 dòng, rồi \`SELECT\` sắp theo \`id\`.
3. Thử \`UPDATE\` **không** \`WHERE\` trên một bảng nháp và xem có bao nhiêu dòng bị đổi — để nhớ đời bài học \`WHERE\`.
4. Dùng \`\\d viec_can_lam\` xem PostgreSQL mô tả bảng của bạn thế nào.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Chỉ trong một bài, bạn đã: cài PostgreSQL bằng một dòng Docker, kết nối bằng \`psql\`, chạy câu \`SELECT\` đầu tiên, và đi trọn vòng đời **CRUD** — tạo bảng, thêm, đọc, sửa, xoá — với kết quả thật trước mắt. Bạn cũng đã dính (và thoát) cái bẫy \`7/2 = 3\`, và ghi lòng luật \`WHERE\`.

Từ mai, ta đào sâu từng viên gạch. Câu \`SELECT\` mới chỉ dùng ở mức "lấy hết ra" — nhưng nó mạnh hơn thế rất nhiều.

Ngày 3: **SELECT sâu hơn** — chọn đúng cột cần lấy, đặt tên lại bằng \`AS\`, tạo **cột tính toán** (ví dụ thành tiền = số lượng × đơn giá) ngay trong câu truy vấn, và lọc trùng bằng \`DISTINCT\`. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
