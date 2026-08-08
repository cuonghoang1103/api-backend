/** "100 Ngày Java với CuongThai" — Ngày 61: CSDL quan hệ & SQL căn bản.
    MỞ GIAI ĐOẠN 8. Nối đúng chỗ Ngày 60 kết ("mọi thứ ta viết 60 ngày đều chết
    khi chương trình tắt — dữ liệu phải sống lâu hơn chương trình").
    Ngày 62 (JOIN & GROUP BY) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại nguyên lý của một
    bảng; thân bài dạy SQL thật. Toàn bộ SQL trong bài ĐÃ CHẠY THẬT trên
    PostgreSQL 15.4 (docker `cuong_pg_new`, DB tạm `hoc_java_sql`) — mọi thông
    báo lỗi và mọi bảng kết quả bên dưới là output nguyên văn của psql. */
export default {
  day: 61,
  card: 'java-day-61',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-product-inventory-tracker-using-custom-objects-and-maps',
    title: 'Bộ theo dõi tồn kho bằng đối tượng và Map',
  },

  content: `🗄️ 100 NGÀY JAVA — NGÀY 61: CSDL & SQL — MỞ GIAI ĐOẠN 8

Sáu mươi ngày qua, mọi thứ bạn viết đều chết khi chương trình tắt. Giỏ hàng, đơn hàng, người dùng — tắt máy là sạch.

Hôm nay ta chữa dứt điểm chuyện đó.

━━━━━━━━━━━━━━━━━━━━

📁 "THÌ LƯU VÀO FILE LÀ XONG CHỨ GÌ?"

Bạn đã biết đọc/ghi file (Giai đoạn 4). Vậy cứ ghi đơn hàng ra \`don_hang.txt\` là dữ liệu sống sót, đúng không?

Đúng — cho tới khi gặp bốn câu hỏi này:

1. **Sửa một đơn giữa file thì làm sao?** Đọc cả file vào bộ nhớ, sửa, ghi đè lại toàn bộ. Với 2 triệu đơn thì mỗi lần đổi trạng thái một đơn là viết lại cả file.
2. **Hai người cùng đặt hàng một lúc thì sao?** Hai luồng cùng ghi một file — bạn nhớ Ngày 41 chứ? Kết quả là dữ liệu hỏng.
3. **Ai cấm ghi rác vào?** Không ai cả. \`so_tien = "nhieu"\` vẫn ghi tốt, ba tháng sau mới nổ ở chỗ khác.
4. **Tìm đơn của một khách trong 2 triệu dòng?** Quét cả file. Mỗi lần.

Cơ sở dữ liệu quan hệ sinh ra để trả lời đúng bốn câu đó. Nó không phải "file xịn hơn" — nó là một chương trình luôn chạy, giữ dữ liệu, canh ràng buộc và phục vụ nhiều người cùng lúc.

━━━━━━━━━━━━━━━━━━━━

🛠️ CÀI TRONG MỘT DÒNG

Không cần cài gì vào máy, chạy PostgreSQL trong Docker:

\`\`\`bash
docker run --name hoc-sql -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres:16
docker exec -it hoc-sql psql -U postgres
\`\`\`

Từ đây trở đi mọi câu SQL trong bài đều gõ được ngay. **Và mọi output bên dưới là kết quả thật của PostgreSQL, không phải tôi viết tay.**

━━━━━━━━━━━━━━━━━━━━

📋 BẢNG: DỮ LIỆU CÓ HÌNH DẠNG

\`\`\`sql
CREATE TABLE don_hang (
    ma          VARCHAR(20)  PRIMARY KEY,
    so_tien     INTEGER      NOT NULL,
    trang_thai  VARCHAR(20)  NOT NULL DEFAULT 'MOI'
);
\`\`\`

Đọc từng phần — mỗi phần là một lời hứa mà CSDL sẽ **cưỡng chế**:

- **Cột có kiểu.** \`so_tien\` là số nguyên, vĩnh viễn.
- \`NOT NULL\` — không được để trống.
- \`DEFAULT 'MOI'\` — không điền thì tự lấy giá trị này.
- \`PRIMARY KEY\` — **khoá chính**: định danh duy nhất của một dòng.

Một bảng giống hệt một \`class\` bạn viết suốt Giai đoạn 2: cột là trường, dòng là đối tượng. Khác biệt là bảng **còn đó sau khi chương trình tắt**, và ràng buộc do CSDL canh chứ không do code nào nhớ kiểm.

Chèn dữ liệu vào:

\`\`\`sql
INSERT INTO don_hang (ma, so_tien, trang_thai) VALUES
    ('DH-1', 150000, 'MOI'),
    ('DH-2', 350000, 'DA_GIAO'),
    ('DH-3', 990000, 'MOI'),
    ('DH-4', 120000, 'HUY');
\`\`\`

\`\`\`
INSERT 0 4
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔑 KHOÁ CHÍNH LÀM VIỆC NGAY

Thử chèn một đơn trùng mã:

\`\`\`sql
INSERT INTO don_hang (ma, so_tien) VALUES ('DH-2', 10000);
\`\`\`

\`\`\`
ERROR:  duplicate key value violates unique constraint "don_hang_pkey"
DETAIL:  Key (ma)=(DH-2) already exists.
\`\`\`

Bị chặn. Không phải vì code của bạn kiểm — bạn chưa viết dòng code nào cả. **CSDL từ chối.**

Thử ghi sai kiểu:

\`\`\`sql
INSERT INTO don_hang (ma, so_tien) VALUES ('DH-9', 'nhieu');
\`\`\`

\`\`\`
ERROR:  invalid input syntax for type integer: "nhieu"
\`\`\`

Cũng bị chặn. Đây là khác biệt căn bản với file: **dữ liệu sai không vào được**, thay vì vào êm rồi nổ ba tháng sau.

━━━━━━━━━━━━━━━━━━━━

🔍 SELECT: TẢ THỨ MÌNH MUỐN

\`\`\`sql
SELECT ma, so_tien FROM don_hang
WHERE so_tien > 200000
ORDER BY so_tien DESC;
\`\`\`

\`\`\`
  ma  | so_tien
------+---------
 DH-3 |  990000
 DH-2 |  350000
(2 rows)
\`\`\`

Để ý bạn vừa viết gì: **không có vòng lặp nào cả.** Không \`for\`, không \`if\`, không so sánh từng dòng.

Đây là điểm khác biệt lớn nhất giữa SQL và Java. Java là ngôn ngữ **mệnh lệnh** — bạn tả từng bước máy phải làm. SQL là ngôn ngữ **khai báo** — bạn tả *kết quả mình muốn*, còn cách lấy là việc của CSDL. Nó tự quyết định quét cả bảng hay dùng chỉ mục, tự chọn thuật toán sắp xếp.

Mấy mảnh ghép thường dùng của \`SELECT\`:

\`\`\`sql
SELECT * FROM don_hang;                              -- lấy hết cột
SELECT * FROM don_hang WHERE trang_thai = 'MOI';     -- lọc
SELECT * FROM don_hang WHERE so_tien BETWEEN 100000 AND 400000;
SELECT * FROM don_hang WHERE ma LIKE 'DH-%';         -- khớp mẫu
SELECT * FROM don_hang WHERE trang_thai IN ('MOI', 'HUY');
SELECT * FROM don_hang ORDER BY so_tien DESC LIMIT 10;
SELECT count(*) FROM don_hang;                       -- đếm
\`\`\`

━━━━━━━━━━━━━━━━━━━━

✏️ UPDATE VÀ DELETE — VÀ MỘT CẢNH BÁO THẬT

\`\`\`sql
UPDATE don_hang SET trang_thai = 'DA_GIAO' WHERE ma = 'DH-1';
DELETE FROM don_hang WHERE trang_thai = 'HUY';
SELECT count(*) AS con_lai FROM don_hang;
\`\`\`

\`\`\`
UPDATE 1
DELETE 1
 con_lai
---------
       3
\`\`\`

Con số \`UPDATE 1\` / \`DELETE 1\` là **số dòng bị chạm**. Luôn đọc nó — nó là thứ báo cho bạn biết câu lệnh vừa làm đúng cỡ mình nghĩ hay không.

Và đây là cảnh báo nghiêm túc nhất của bài hôm nay:

\`\`\`sql
UPDATE don_hang SET trang_thai = 'DA_GIAO';   -- ⚠️ THIẾU WHERE
DELETE FROM don_hang;                          -- ⚠️ XOÁ SẠCH BẢNG
\`\`\`

Không có nút hoàn tác. Thói quen tự bảo vệ: **viết \`SELECT\` với đúng cái \`WHERE\` đó trước**, nhìn xem nó trả về mấy dòng, rồi mới đổi \`SELECT\` thành \`UPDATE\`/\`DELETE\`.

━━━━━━━━━━━━━━━━━━━━

🧪 TỰ KIỂM BẰNG JAVA

Toàn bộ luật ở trên có thể dựng lại bằng Java thuần — và kết quả khớp với Postgres từng dòng:

\`\`\`
1) chen 4 dong vao bang 'don_hang' -> 4 dong
2) chen lai ma 'DH-2' -> BI TU CHOI: khoa chinh trung
3) chen so_tien = 'nhieu' -> BI TU CHOI: cot so_tien phai la Integer
4) WHERE so_tien > 200000 ORDER BY so_tien DESC -> [DH-3, DH-2]
5) UPDATE trang_thai WHERE ma='DH-1' -> 1 dong bi doi
6) DELETE WHERE trang_thai='HUY' -> xoa 1 dong, con 3 dong
\`\`\`

Không phải để thay CSDL — mà để thấy rằng CSDL không có gì huyền bí. Nó là một chương trình giữ danh sách bản ghi, kiểm ràng buộc trước khi cho ghi, và làm việc theo *điều kiện* thay vì theo *vị trí dòng*.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chạy PostgreSQL bằng Docker, tạo bảng \`don_hang\` như trên.
2. Chèn 10 đơn, rồi cố tình chèn trùng mã — đọc kỹ thông báo lỗi.
3. Viết \`SELECT\` lấy 3 đơn có số tiền lớn nhất (\`ORDER BY ... LIMIT\`).
4. Đổi trạng thái đúng một đơn, kiểm bằng cách đọc số dòng bị chạm.
5. Tạo thêm bảng \`khach_hang\` với khoá chính là \`sdt\` — mai sẽ nối hai bảng này.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Cơ sở dữ liệu quan hệ cho bạn ba thứ mà file không bao giờ cho được: **dữ liệu có hình dạng** (kiểu + ràng buộc, sai là chặn ngay), **truy vấn theo điều kiện** (tả cái muốn, không tả cách làm), và **sống sót** qua mọi lần khởi động lại.

Nhưng bảng \`don_hang\` hôm nay còn thiếu một thứ rất lớn: nó không biết **ai** đặt đơn. Thêm cột \`ten_khach\`, \`sdt_khach\`, \`dia_chi_khach\` vào ư? Thế thì một khách đặt 50 đơn là tên và địa chỉ của họ bị chép 50 lần — đổi số điện thoại là phải sửa 50 dòng, sót một dòng là dữ liệu mâu thuẫn.

Chữ **"quan hệ"** trong "CSDL quan hệ" chính là để giải quyết chuyện đó.

Ngày 62: **JOIN & GROUP BY** — tách dữ liệu ra nhiều bảng rồi nối lại khi cần, khoá ngoại là gì, và cách hỏi CSDL những câu như "mỗi khách đã tiêu bao nhiêu tiền" chỉ bằng một câu lệnh. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
