/** "100 Ngày Java với CuongThai" — Ngày 62: JOIN & GROUP BY.
    Nối đúng chỗ Ngày 61 kết ("bảng don_hang không biết AI đặt đơn — thêm cột
    tên/sđt khách vào là chép lặp 50 lần").
    Ngày 63 (JDBC + SQL injection) trỏ ngược về phần kết.

    ⚠ Toàn bộ SQL trong bài ĐÃ CHẠY THẬT trên PostgreSQL 15.4 (DB tạm
    `hoc_java_sql`) — mọi bảng kết quả và thông báo lỗi bên dưới là output
    nguyên văn của psql, và khớp với chương trình Java từng dòng. */
export default {
  day: 62,
  card: 'java-day-62',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-library-catalog-management-system',
    title: 'Hệ thống quản lý danh mục thư viện',
  },

  content: `🔗 100 NGÀY JAVA — NGÀY 62: JOIN & GROUP BY

Bảng \`don_hang\` hôm qua có một lỗ hổng lớn: nó không biết **ai** đặt đơn.

Cách sửa đầu tiên ai cũng nghĩ ra là thêm cột:

\`\`\`
don_det: ma | ten_khach | sdt_khach | dia_chi_khach | so_tien
\`\`\`

Chạy được. Và sai.

━━━━━━━━━━━━━━━━━━━━

🧱 VÌ SAO NHỒI HẾT VÀO MỘT BẢNG LÀ SAI

Khách "An" đặt 3 đơn. Tên, số điện thoại, địa chỉ của An bị chép lại 3 lần:

\`\`\`
1) nhoi tat ca vao 1 bang -> khach 'An' nam o 3 dong, doi sdt phai sua 3 cho
\`\`\`

An đổi số điện thoại. Bạn phải sửa 3 dòng. Sót một dòng thì hệ thống có **hai** số điện thoại cho cùng một người — và không có cách nào biết cái nào đúng.

Với khách đặt 500 đơn thì con số là 500. Đó không còn là chuyện tốn chỗ; đó là chuyện dữ liệu **tự mâu thuẫn với chính nó**.

Cách chữa: mỗi thứ nằm đúng một chỗ.

\`\`\`
2) tach 2 bang + khoa ngoai -> doi sdt chi sua 1 cho
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔗 KHOÁ NGOẠI: SỢI DÂY NỐI HAI BẢNG

\`\`\`sql
CREATE TABLE khach_hang (
    ma   VARCHAR(20) PRIMARY KEY,
    ten  VARCHAR(50) NOT NULL,
    sdt  VARCHAR(15) NOT NULL
);

CREATE TABLE don (
    ma        VARCHAR(20) PRIMARY KEY,
    ma_khach  VARCHAR(20) NOT NULL REFERENCES khach_hang(ma),
    so_tien   INTEGER     NOT NULL
);
\`\`\`

\`REFERENCES khach_hang(ma)\` là **khoá ngoại**: cột \`ma_khach\` buộc phải là một mã có thật bên bảng \`khach_hang\`.

Thử tạo đơn cho một khách không tồn tại:

\`\`\`sql
INSERT INTO don VALUES ('DH-9', 'K-99', 10000);
\`\`\`

\`\`\`
ERROR:  insert or update on table "don" violates foreign key constraint "don_ma_khach_fkey"
DETAIL:  Key (ma_khach)=(K-99) is not present in table "khach_hang".
\`\`\`

Đơn mồ côi không vào được. Lại là CSDL canh, không phải code bạn nhớ kiểm.

Đây chính là chữ **"quan hệ"** trong "cơ sở dữ liệu quan hệ" — không phải quan hệ giữa người với người, mà là ràng buộc giữa các bảng.

━━━━━━━━━━━━━━━━━━━━

🧩 JOIN: NỐI LẠI KHI CẦN

Tách ra rồi thì lúc cần xem đầy đủ phải nối lại:

\`\`\`sql
SELECT k.ten, d.ma, d.so_tien
FROM khach_hang k
JOIN don d ON d.ma_khach = k.ma
ORDER BY k.ten, d.ma;
\`\`\`

\`\`\`
 ten  |  ma  | so_tien
------+------+---------
 An   | DH-1 |  150000
 An   | DH-2 |  390000
 An   | DH-4 |  120000
 Binh | DH-3 |  990000
 Binh | DH-5 |  250000
(5 rows)
\`\`\`

Đọc câu lệnh: lấy từ \`khach_hang\` (đặt tên tắt là \`k\`), nối với \`don\` (tên tắt \`d\`) theo điều kiện \`d.ma_khach = k.ma\`.

Máy làm gì bên trong? Cách ngây thơ nhất là thử mọi cặp:

\`\`\`
3) JOIN 3 khach x 5 don -> 15 phep so sanh, ghep duoc 5 dong
\`\`\`

Ba khách nhân năm đơn là 15 phép so sánh cho 5 dòng kết quả. Với 10.000 khách và 1 triệu đơn thì con số đó là **mười tỉ**. Ngày 59 dạy rồi: đây đúng là loại chỗ phải đo và phải sửa — và cách sửa gọi là **chỉ mục**, để dành cho Ngày 66.

━━━━━━━━━━━━━━━━━━━━

↩️ LEFT JOIN: ĐỪNG ĐÁNH RƠI NGƯỜI CHƯA MUA GÌ

\`JOIN\` (đầy đủ là \`INNER JOIN\`) chỉ giữ những dòng **ghép được**. Khách Chi chưa đặt đơn nào nên biến mất khỏi kết quả trên.

Nhưng nếu câu hỏi là "liệt kê MỌI khách kèm số đơn của họ" thì mất Chi là sai:

\`\`\`sql
SELECT k.ten, count(d.ma) AS so_don, coalesce(sum(d.so_tien), 0) AS tong_tien
FROM khach_hang k
LEFT JOIN don d ON d.ma_khach = k.ma
GROUP BY k.ten
ORDER BY tong_tien DESC;
\`\`\`

\`\`\`
 ten  | so_don | tong_tien
------+--------+-----------
 Binh |      2 |   1240000
 An   |      3 |    660000
 Chi  |      0 |         0
(3 rows)
\`\`\`

\`LEFT JOIN\` giữ **mọi** dòng của bảng bên trái, bên phải không có thì để \`NULL\`. Còn \`coalesce(x, 0)\` là "nếu \`x\` là \`NULL\` thì lấy 0" — vì \`sum\` của tập rỗng là \`NULL\`, không phải 0.

\`\`\`
5) LEFT JOIN giu khach chua co don -> [Chi]
\`\`\`

Chọn sai loại JOIN là loại bug im lặng khó chịu nhất trong báo cáo: không có lỗi nào cả, chỉ là vài người biến mất khỏi danh sách.

━━━━━━━━━━━━━━━━━━━━

📊 GROUP BY: MỘT CÂU RA CẢ BÁO CÁO

\`\`\`sql
SELECT k.ten, count(d.ma) AS so_don, sum(d.so_tien) AS tong_tien
FROM khach_hang k
JOIN don d ON d.ma_khach = k.ma
GROUP BY k.ten
ORDER BY tong_tien DESC;
\`\`\`

\`\`\`
 ten  | so_don | tong_tien
------+--------+-----------
 Binh |      2 |   1240000
 An   |      3 |    660000
(2 rows)
\`\`\`

\`\`\`
4) GROUP BY khach -> {An=660000, Binh=1240000}
\`\`\`

\`GROUP BY\` gom các dòng cùng giá trị thành **một nhóm**, rồi các hàm tổng hợp chạy trên từng nhóm: \`count\`, \`sum\`, \`avg\`, \`min\`, \`max\`.

Và một chi tiết rất hay nhầm — \`WHERE\` khác \`HAVING\`:

\`\`\`sql
SELECT k.ten, sum(d.so_tien) AS tong_tien
FROM khach_hang k
JOIN don d ON d.ma_khach = k.ma
GROUP BY k.ten
HAVING sum(d.so_tien) > 700000;
\`\`\`

\`\`\`
 ten  | tong_tien
------+-----------
 Binh |   1240000
(1 row)
\`\`\`

**\`WHERE\` lọc từng dòng TRƯỚC khi gom. \`HAVING\` lọc từng nhóm SAU khi gom.** Muốn hỏi "khách nào tiêu trên 700 nghìn" thì phải cộng xong mới biết, nên bắt buộc dùng \`HAVING\`.

━━━━━━━━━━━━━━━━━━━━

⚠️ MỘT CÁM DỖ CẦN TRÁNH TỪ BÂY GIỜ

Khi biết Java rồi mới học SQL, ai cũng có lúc định làm thế này:

\`\`\`java
List<Don> tatCa = layTatCaDon();          // kéo 1 triệu dòng về máy
Map<String, Integer> tong = new HashMap<>();
for (Don d : tatCa) tong.merge(d.maKhach(), d.soTien(), Integer::sum);
\`\`\`

Đừng. Bạn vừa tải cả triệu dòng qua mạng, nhét hết vào bộ nhớ, để làm đúng cái việc mà CSDL làm nhanh hơn nhiều lần — nó có chỉ mục, có thống kê, có thuật toán gom nhóm được tối ưu hàng chục năm.

Nguyên tắc: **lọc và tổng hợp ở nơi có dữ liệu, chỉ mang về thứ thật sự cần dùng.**

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo hai bảng \`khach_hang\` và \`don\` có khoá ngoại, chèn dữ liệu như bài.
2. Cố tình chèn đơn cho mã khách không tồn tại — đọc kỹ thông báo lỗi.
3. Viết \`JOIN\` liệt kê mọi đơn kèm tên khách.
4. Đổi sang \`LEFT JOIN\` và tìm khách chưa đặt đơn nào.
5. Dùng \`GROUP BY\` + \`HAVING\` tìm khách có tổng chi trên 700.000.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Tách dữ liệu ra nhiều bảng để không có thông tin nào bị chép hai lần, dùng **khoá ngoại** để CSDL cưỡng chế mối nối, rồi **JOIN** nối lại khi cần nhìn đầy đủ. \`INNER JOIN\` giữ dòng ghép được, \`LEFT JOIN\` giữ cả bên trái. \`GROUP BY\` biến hàng triệu dòng thành một bảng báo cáo, với \`WHERE\` lọc trước khi gom và \`HAVING\` lọc sau.

Đến đây bạn viết được SQL. Nhưng suốt hai ngày qua bạn gõ nó trong \`psql\` — còn chương trình Java thì vẫn đứng ngoài nhìn.

Ngày 63: **JDBC** — cách Java nối vào CSDL, chạy câu lệnh và nhận kết quả. Và ngay trong bài đó là lỗ hổng bảo mật nổi tiếng nhất lịch sử web: chỉ cần nối chuỗi sai một chỗ, người dùng gõ vào ô đăng nhập là **xoá được cả bảng của bạn**. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
