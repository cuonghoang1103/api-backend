/** "100 Ngày Java với CuongThai" — Ngày 65: Giao dịch (Transaction).
    Nối đúng chỗ Ngày 64 kết ("trừ tiền A xong, chưa cộng B thì mất điện — tiền
    bốc hơi"). Ngày 66 (chỉ mục) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại nguyên lý
    commit/rollback bằng bản nháp; thân bài dạy setAutoCommit/commit/rollback
    thật. Mọi output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 65,
  card: 'java-day-65',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'jdbc-batch-order-processor-with-transaction-support',
    title: 'Bộ xử lý đơn theo lô có giao dịch (JDBC)',
  },

  content: `💳 100 NGÀY JAVA — NGÀY 65: GIAO DỊCH (TRANSACTION)

Hôm qua tầng DAO của bạn đã gọn gàng. Nhưng có một tình huống nó một mình không giải nổi.

Chuyển 30.000 từ tài khoản A sang B. Hai bước:

\`\`\`java
dao.tru("A", 30000);    // trừ của A — xong
// ... ngay lúc này mất điện, JVM chết, mạng đứt ...
dao.cong("B", 30000);   // cộng cho B — chưa kịp chạy
\`\`\`

Tiền đã rời khỏi A. Chưa tới B. Nó **bốc hơi** khỏi hệ thống.

Đây không phải chuyện hiếm. Máy chủ khởi động lại, kết nối rớt, một exception ở giữa — đời không bao giờ hứa cho bạn chạy hết cả hai dòng.

━━━━━━━━━━━━━━━━━━━━

🎯 GIAO DỊCH: MỘT LỜI HỨA "CÙNG NHAU"

Giao dịch (transaction) là cách gói nhiều thao tác thành **một đơn vị không thể chia cắt**: hoặc tất cả cùng thành công, hoặc tất cả cùng như chưa từng xảy ra. Không bao giờ có trạng thái nửa vời.

Trong JDBC, mặc định mỗi câu lệnh tự \`commit\` ngay lập tức — gọi là *autoCommit*. Để gộp nhiều câu, bạn phải tắt nó đi:

\`\`\`java
try (Connection conn = DriverManager.getConnection(url, user, pw)) {
    conn.setAutoCommit(false);          // MỞ giao dịch
    try {
        tru(conn, "A", 30000);
        cong(conn, "B", 30000);
        conn.commit();                  // cả hai cùng ghi, một lần
    } catch (SQLException e) {
        conn.rollback();                // hỏng bất cứ đâu -> huỷ SẠCH
        throw e;
    }
}
\`\`\`

Ba dòng đáng thuộc nằm gọn ở đây: \`setAutoCommit(false)\` mở, \`commit()\` chốt, \`rollback()\` huỷ.

━━━━━━━━━━━━━━━━━━━━

✅ COMMIT: THẾ GIỚI BÊN NGOÀI CHỈ THẤY KẾT QUẢ CUỐI

Trong lúc giao dịch đang chạy, mọi thay đổi chỉ tồn tại *bên trong* nó. Người khác nhìn vào CSDL vẫn thấy số liệu cũ:

\`\`\`
1) trong giao dich (chua commit): A=70000 B=30000, nhung CSDL that A=100000
\`\`\`

Bạn thấy A đã còn 70.000, nhưng một truy vấn từ nơi khác vẫn đọc ra A=100.000. Chỉ khi \`commit()\`, mọi thứ mới hiện ra cùng lúc:

\`\`\`
2) sau commit: A=70000 B=30000, tong khong doi? true
\`\`\`

Tổng tiền trước và sau đều là 100.000 — không đồng nào sinh ra hay mất đi. Đó là điều một giao dịch bảo đảm.

━━━━━━━━━━━━━━━━━━━━

↩️ ROLLBACK: HUỶ CẢ NHỮNG BƯỚC ĐÃ CHẠY

Đây mới là phần cứu bạn. Giả sử bước 1 chạy ngon, bước 2 mới phát hiện không đủ số dư:

\`\`\`
3) buoc 2 hong (khong du so du o C) -> rollback
4) sau rollback: C=100000 D=0, tien co boc hoi khong? khong, ven nguyen
\`\`\`

Bước 1 đã trừ tiền của C *bên trong giao dịch*. Nhưng \`rollback()\` xoá sạch mọi thay đổi chưa commit — kể cả bước 1. Kết quả: C vẫn nguyên 100.000, D vẫn 0, như thể chưa có ai động vào.

Không có giao dịch, bạn sẽ phải tự viết code "hoàn tác bước 1" trong \`catch\` — và cầu cho code hoàn tác đó đừng cũng lỗi nốt. Giao dịch làm việc đó giúp bạn, đúng và trọn vẹn.

━━━━━━━━━━━━━━━━━━━━

⚠️ CÁI BẪY: QUÊN TẮT autoCommit

Nếu bạn quên \`setAutoCommit(false)\`, mỗi câu lệnh tự commit ngay khi chạy xong. Lúc đó \`rollback()\` không còn gì để huỷ:

\`\`\`
5) autoCommit=true, mat dien sau buoc 1: G=30000 H=0 -> lech 20000 dong, khong the phuc hoi
\`\`\`

Bước 1 đã ghi vĩnh viễn xuống đĩa. Mất điện sau đó thì 20.000 đồng lệch đó ở lại vĩnh viễn. Đây là lý do: **bất cứ việc gì gồm nhiều bước phải-cùng-nhau, dòng đầu tiên luôn là \`setAutoCommit(false)\`.**

━━━━━━━━━━━━━━━━━━━━

🏛️ ACID — BỐN CHỮ CÁI CSDL HỨA VỚI BẠN

Giao dịch chính là chữ đầu tiên trong bộ đảm bảo nổi tiếng của CSDL quan hệ:

- **A — Atomicity (nguyên tử):** cả cụm là một khối, chỉ "xong hết" hoặc "như chưa xảy ra". Chính là bài hôm nay.
- **C — Consistency (nhất quán):** giao dịch không được để lại dữ liệu vi phạm ràng buộc (khoá ngoại của Ngày 62 vẫn phải đúng sau khi commit).
- **I — Isolation (cô lập):** nhiều giao dịch chạy song song không giẫm lên nhau — nhớ lại Ngày 41, đây là bài toán đa luồng ở tầng dữ liệu, và CSDL giải nó bằng khoá.
- **D — Durability (bền vững):** đã commit thì mất điện cũng còn. CSDL ghi xuống đĩa an toàn trước khi báo "xong".

Bốn chữ này là lý do người ta tin CSDL quan hệ để giữ tiền, đơn hàng, hồ sơ — những thứ sai một lần là hỏng thật.

━━━━━━━━━━━━━━━━━━━━

🧾 QUY TẮC THỰC HÀNH

- **Giao dịch càng ngắn càng tốt.** Nó giữ khoá; giữ lâu là chặn người khác (Ngày 45).
- **Đừng gọi API mạng / gửi email giữa giao dịch.** Mạng chậm kéo dài giao dịch, và bạn không rollback được cái email đã gửi.
- **Luôn có đường \`rollback\`.** Mọi \`catch\` trong khối giao dịch phải rollback trước khi ném lỗi tiếp.
- **Trả \`Connection\` về \`autoCommit=true\`** nếu dùng chung pool — nếu không, người mượn kết nối sau thừa hưởng một giao dịch đang mở.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết hàm \`chuyenTien(conn, tu, den, tien)\` dùng \`setAutoCommit(false)\` + \`commit\`.
2. Cố tình cho bước 2 ném lỗi, xác nhận \`rollback\` trả số dư về nguyên vẹn.
3. Bỏ \`setAutoCommit(false)\`, gây lỗi ở bước 2 — quan sát tiền lệch không rút lại được.
4. Bọc trong \`try-with-resources\`, đảm bảo \`Connection\` luôn đóng dù có lỗi.
5. Thử chuyển quá số dư, kiểm cả bảng vẫn nguyên sau khi rollback.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Giao dịch biến "nhiều thao tác rời rạc" thành "một khối nguyên tử": \`setAutoCommit(false)\` mở, \`commit()\` chốt khi xong hết, \`rollback()\` huỷ sạch khi hỏng bất cứ đâu. Đó là chữ **A** trong **ACID**, và là dòng code cứu mọi hệ thống có dính tới tiền.

Đến đây bạn đã lưu được dữ liệu, truy vấn được, chống tiêm được, tổ chức code gọn được, và bảo toàn được tính đúng đắn khi có sự cố. Chỉ còn một câu hỏi treo lại từ Ngày 62: khi \`JOIN\` 10.000 khách với 1 triệu đơn tốn **mười tỉ** phép so sánh, làm sao nó vẫn chạy trong tích tắc trên hệ thống thật?

Ngày 66: **Chỉ mục (Index)** — cấu trúc dữ liệu ẩn khiến một truy vấn từ vài giây xuống vài mili-giây, vì sao nó không miễn phí (mỗi lần ghi phải cập nhật chỉ mục), và \`EXPLAIN\` — công cụ cho bạn nhìn thấy CSDL thật sự đi tìm dữ liệu bằng cách nào. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
