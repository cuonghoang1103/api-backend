/** "100 Ngày Database với CuongThai" — Ngày 23: Dị thường dữ liệu.
    Dư thừa + dị thường sửa/xoá/thêm của bảng "gộp tất cả" — chứng minh bằng
    SQL thật, làm động lực cho chuẩn hoá.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day23). Dị thường là lỗi thiết kế — hệ nào cũng dính. */
export default {
  day: 23,
  card: 'db-day-23',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'normalize-a-denormalized-orders-sheet-to-third-normal-form',
    title: 'Chuẩn hoá một bảng đơn hàng gộp về 3NF',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 23: DỊ THƯỜNG DỮ LIỆU — VÌ SAO CẦN CHUẨN HOÁ

Người mới thường bị cám dỗ: "cho tất cả vào **một bảng** cho gọn — tên khách, số điện thoại, sản phẩm, giá, đơn hàng… tất tần tật". Nghe tiện, nhưng đó là công thức của thảm hoạ. Hôm nay ta *chứng minh bằng SQL thật* ba loại "dị thường" (anomaly) mà một bảng gộp tự sinh ra — và đây chính là động lực cho **chuẩn hoá**, chủ đề của bốn ngày tới. Kết quả bên dưới là thật từ psql.

Bảng "gộp tất cả" của ta: mỗi dòng là một đơn hàng, nhưng nhét kèm cả tên và số điện thoại khách:

\`\`\`
 don_id | khach_ten | khach_sdt | san_pham | gia
--------+-----------+-----------+----------+---------
      1 | An        | 0901      | Ban phim | 890000
      2 | An        | 0901      | Chuot    | 550000
      3 | Binh      | 0902      | Man hinh | 4200000
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔁 GỐC BỆNH: DƯ THỪA

Nhìn kỹ: số điện thoại của An (\`0901\`) được lưu **hai lần** — một lần cho mỗi đơn. Đây là **dư thừa (redundancy)**: cùng một sự thật được chép ở nhiều nơi. Nếu An có 100 đơn, số điện thoại của An bị chép 100 lần. Dư thừa không chỉ tốn chỗ — nó là mầm của mọi dị thường dưới đây.

━━━━━━━━━━━━━━━━━━━━

✏️ DỊ THƯỜNG SỬA (UPDATE ANOMALY)

An đổi số điện thoại. Bạn chạy update — nhưng lỡ chỉ sửa một dòng:

\`\`\`sql
UPDATE don_hang_xau SET khach_sdt = '0999' WHERE don_id = 1;   -- quên don_id = 2!
SELECT DISTINCT khach_ten, khach_sdt FROM don_hang_xau WHERE khach_ten = 'An';
\`\`\`

\`\`\`
 khach_ten | khach_sdt
-----------+-----------
 An        | 0901
 An        | 0999
(2 rows)
\`\`\`

**Thảm hoạ:** giờ An có *hai* số điện thoại trong hệ thống — \`0901\` và \`0999\` — và không ai biết cái nào đúng. Vì thông tin bị chép nhiều nơi, sửa mà sót một chỗ là dữ liệu **tự mâu thuẫn**. Với 100 đơn, xác suất sót gần như chắc chắn. Đây là **dị thường sửa**.

━━━━━━━━━━━━━━━━━━━━

🗑️ DỊ THƯỜNG XOÁ (DELETE ANOMALY)

Binh huỷ đơn hàng duy nhất của mình. Bạn xoá dòng đó:

\`\`\`sql
DELETE FROM don_hang_xau WHERE don_id = 3;
SELECT DISTINCT khach_ten FROM don_hang_xau;
\`\`\`

\`\`\`
 khach_ten
-----------
 An
(1 row)
\`\`\`

**Binh biến mất hoàn toàn!** Bạn chỉ định xoá một *đơn hàng*, nhưng vì thông tin *khách* Binh sống ký sinh trong dòng đơn đó, xoá đơn kéo theo xoá luôn khách — dù Binh vẫn là khách hàng của bạn. Đây là **dị thường xoá**: xoá một thứ làm mất một thứ khác không liên quan.

━━━━━━━━━━━━━━━━━━━━

➕ DỊ THƯỜNG THÊM (INSERT ANOMALY)

Chiều ngược lại cũng hỏng. Muốn thêm một khách **mới** (Chi) vừa đăng ký nhưng *chưa đặt đơn nào* — bạn không có chỗ để đặt Chi vào, vì mỗi dòng bắt buộc phải có \`don_id\` và \`san_pham\`. Bạn buộc phải bịa một đơn giả (với các cột NULL) chỉ để lưu được một khách. Đây là **dị thường thêm**: không thể ghi dữ liệu này mà không có dữ liệu kia.

━━━━━━━━━━━━━━━━━━━━

✅ LỜI GIẢI: TÁCH BẢNG (= CHUẨN HOÁ)

Cả ba dị thường có **chung một gốc**: bảng đang ôm *hai chủ đề khác nhau* — "khách hàng" và "đơn hàng" — trộn vào nhau. Thuốc chữa là **tách chúng ra**:

\`\`\`sql
CREATE TABLE khach_hang (id SERIAL PRIMARY KEY, ten TEXT, sdt TEXT);   -- mỗi khách MỘT dòng
CREATE TABLE don_hang   (id SERIAL PRIMARY KEY, khach_id INT REFERENCES khach_hang(id), san_pham TEXT, gia INT);
\`\`\`

Giờ số điện thoại của An lưu **đúng một chỗ** (sửa một lần là xong — hết dị thường sửa); xoá đơn không đụng tới khách (hết dị thường xoá); thêm khách mới không cần đơn (hết dị thường thêm). Đây chính xác là cấu trúc ta đã dùng suốt Giai đoạn 1–2 — và quá trình tách bảng có nguyên tắc này gọi là **chuẩn hoá (normalization)**.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Dị thường **không phải** vấn đề của một hệ CSDL cụ thể — nó là hệ quả của **thiết kế** sai, nên xảy ra y hệt trên PostgreSQL, SQL Server, MySQL, hay bất kỳ đâu. Và cách chữa — chuẩn hoá bằng cách tách bảng và nối bằng khoá ngoại — cũng giống nhau ở mọi hệ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Trong bảng gộp trên, còn thông tin nào bị lặp ngoài số điện thoại? (Gợi ý: nếu hai đơn cùng mua "Ban phim" thì giá lặp lại.)
2. Viết SQL tách bảng gộp thành \`khach_hang\` và \`don_hang\`, rồi \`JOIN\` lại để lấy đúng dữ liệu ban đầu.
3. Mô tả một dị thường thêm bạn từng gặp (hoặc tưởng tượng) trong một bảng thật.
4. Vì sao dư thừa là "gốc" của cả ba loại dị thường?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Một bảng "gộp tất cả" trông tiện nhưng tự gieo mầm hoạ: **dư thừa** dẫn tới ba **dị thường** — sửa (sót chỗ → mâu thuẫn), xoá (xoá thứ này mất thứ kia), thêm (không ghi được cái này nếu thiếu cái kia). Gốc bệnh là trộn nhiều chủ đề vào một bảng; thuốc chữa là **tách bảng có nguyên tắc** — tức chuẩn hoá.

Nhưng "tách bảng" không phải làm tuỳ hứng — có một chuỗi quy tắc rõ ràng gọi là các **dạng chuẩn** (normal forms), đi từng bước từ lộn xộn tới sạch sẽ. Bước đầu tiên, nền của tất cả, là bài ngày mai.

Ngày 24: **Dạng chuẩn 1 (1NF)** — mỗi ô chứa đúng **một** giá trị nguyên tử, không danh sách nhồi trong một cột, không nhóm cột lặp. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
