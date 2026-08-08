/** "100 Ngày Java với CuongThai" — Ngày 54: bản giả (Mockito).
    Nối chỗ Ngày 53 kết (hàm gọi DB và API thì test thế nào). Dùng lại
    interface của Ngày 18 và constructor của Ngày 12 để giải thích vì sao
    tiêm phụ thuộc là điều kiện để test được. Ngày 55 (TDD) trỏ ngược về
    phần kết.

    ⚠ Mockito là thư viện ngoài mà thẻ chạy JDK thuần, nên thẻ dựng lại
    nguyên lý bằng bản giả tự viết; thân bài dạy cú pháp Mockito thật.
    Mọi output là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 54,
  card: 'java-day-54',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-flexible-payment-processing-system',
    title: 'Hệ thống thanh toán linh hoạt (hợp để tập viết mock)',
  },

  content: `🎭 100 NGÀY JAVA — NGÀY 54: BẢN GIẢ

Hôm qua tôi để lại hàm này:

\`\`\`java
double tinhTien(int maDon) {
    DonHang d = database.tim(maDon);          // gọi cơ sở dữ liệu
    double thue = apiThue.layThueSuat();      // gọi API bên ngoài
    return d.tongTien() * (1 + thue);
}
\`\`\`

Test nó bằng cách gọi DB thật và API thật? Ba vấn đề:

- **Chậm** — mỗi test vài trăm mili-giây, cả bộ test mất hàng phút
- **Phụ thuộc mạng** — mất mạng là cả bộ test đỏ, dù code đúng
- **Không ổn định** — thuế suất hôm nay 10%, mai 8%, test tự đỏ mà không ai sửa gì

Giải pháp: thay hai thứ bên ngoài bằng **bản giả**.

━━━━━━━━━━━━━━━━━━━━

📌 ĐIỀU KIỆN TIÊN QUYẾT: NHẬN PHỤ THUỘC TỪ NGOÀI

Trước khi nói tới Mockito, phải sửa chính thiết kế:

\`\`\`java
// ✗ tự tạo bên trong → không thay được
class DichVu {
    private final KhoDuLieu kho = new KhoMySQL();
}

// ✓ nhận từ ngoài qua constructor (Ngày 12)
class DichVu {
    private final KhoDuLieu kho;
    private final ApiThue api;
    DichVu(KhoDuLieu kho, ApiThue api) { this.kho = kho; this.api = api; }
}
\`\`\`

Đây gọi là **tiêm phụ thuộc** (dependency injection) — và nó là toàn bộ lý do bạn test được. Kiểu tham số là \`interface\` (Ngày 18), nên khi chạy thật thì truyền bản MySQL, khi test thì truyền bản giả.

Nhớ Ngày 18 nói "lập trình theo hợp đồng, không theo hiện thực" chứ? Đây là lúc nó trả công.

━━━━━━━━━━━━━━━━━━━━

📌 ĐỊNH SẴN KẾT QUẢ

Với Mockito thật:

\`\`\`java
KhoDuLieu kho = mock(KhoDuLieu.class);
ApiThue api = mock(ApiThue.class);

when(kho.tongTien(7)).thenReturn(1000.0);
when(api.thueSuat()).thenReturn(0.1);

DichVu dv = new DichVu(kho, api);
assertEquals(1100.0, dv.tinhTien(7));
\`\`\`

Chạy thật (bằng bản giả tự viết, cùng nguyên lý):

\`\`\`
1) tinh tien -> 1100.0 (mong 1100.0)
\`\`\`

Không có DB nào, không có mạng nào. Test chạy trong một mili-giây và luôn cho cùng kết quả:

\`\`\`
5) chay hai lan -> giong nhau? true (600.0)
\`\`\`

━━━━━━━━━━━━━━━━━━━━

✔️ KIỂM CẢ HÀNH VI, KHÔNG CHỈ KẾT QUẢ

Bản giả còn ghi lại nó đã bị gọi thế nào:

\`\`\`java
verify(kho).tongTien(7);            // có gọi, đúng tham số
verify(api, times(1)).thueSuat();   // đúng một lần
verify(mailer, never()).gui(any()); // KHÔNG được gửi mail
\`\`\`

\`\`\`
2) da goi kho voi ma don -> [7] | api thue goi 1 lan
\`\`\`

Đây là thứ \`assertEquals\` không làm được. Ví dụ nghiệp vụ thật: "khi đơn hàng bị huỷ thì phải gửi ĐÚNG MỘT email cho khách" — kiểm kết quả trả về không thấy được điều đó, phải kiểm hành vi.

━━━━━━━━━━━━━━━━━━━━

💥 GIÁ TRỊ LỚN NHẤT: DỰNG TÌNH HUỐNG KHÓ TÁI HIỆN

\`\`\`java
when(kho.tongTien(9)).thenThrow(new IllegalStateException("DB sap"));
\`\`\`

\`\`\`
3) DB sap -> bat duoc: DB sap
\`\`\`

Thử nghĩ cách test "DB sập giữa chừng" mà không có bản giả: bạn phải tắt DB thật trong lúc test chạy?

Với bản giả, những tình huống sau đều dựng được trong một dòng:

- DB mất kết nối
- API trả về lỗi 500
- API trả về dữ liệu rỗng, hoặc dữ liệu lạ
- Lời gọi thứ nhất lỗi, lời gọi thứ hai thành công (để test cơ chế thử lại của Ngày 49)

Và đây chính là những đường code hay vỡ nhất trên production — những đường mà nếu không có mock thì gần như không ai test.

━━━━━━━━━━━━━━━━━━━━

🧭 ĐỪNG LẠM DỤNG

Ba nguyên tắc:

1. **Chỉ giả lập RANH GIỚI ra ngoài** — DB, API, gửi mail, hệ thống file, đồng hồ. Đừng giả lập class do chính bạn viết trong cùng dự án; cứ dùng đồ thật, nó nhanh và test sát thực tế hơn.
2. **Đừng giả lập những thứ đơn giản.** Một \`List\` thì tạo thật rẻ hơn nhiều so với mock nó.
3. **Cẩn thận test "dính" vào cách hiện thực.** \`verify\` quá chi tiết (gọi bao nhiêu lần, theo thứ tự nào) khiến mỗi lần sửa code là test đỏ dù hành vi không đổi. Kiểm cái QUAN TRỌNG, đừng kiểm mọi thứ.

Một mẹo hay: thứ khó test thường là dấu hiệu thiết kế cần sửa. Hàm nào phải mock 5 thứ mới test được thì có lẽ nó đang làm quá nhiều việc.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tách một class đang tự \`new\` phụ thuộc thành nhận qua constructor.
2. Viết bản giả cho \`KhoDuLieu\` trả về dữ liệu định sẵn, test hàm tính tiền.
3. Cho bản giả ném ngoại lệ, kiểm code xử lý lỗi có đúng không.
4. Ghi lại số lần gọi và kiểm "chỉ gửi đúng một email".
5. Dùng bản giả để test cơ chế thử lại của Ngày 49: hai lần đầu lỗi, lần ba thành công.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Bản giả cho phép test code có phụ thuộc bên ngoài: nhanh, ổn định, và dựng được cả tình huống hỏng. Điều kiện là code phải nhận phụ thuộc từ ngoài qua constructor và khai kiểu bằng interface. Chỉ giả lập ranh giới ra ngoài, đừng giả lập mọi thứ.

Hai ngày qua ta viết test SAU khi viết code. Nhưng có một cách làm ngược lại, và nó thay đổi hẳn cách bạn thiết kế:

\`\`\`
1. Viết test TRƯỚC — nó đỏ, vì code chưa tồn tại
2. Viết code tối thiểu để test xanh
3. Dọn dẹp code, test vẫn xanh
4. Lặp lại
\`\`\`

Nghe ngược đời: viết test cho thứ chưa có? Nhưng chính vì phải gọi hàm trước khi viết nó, bạn buộc phải nghĩ về giao diện sử dụng trước khi nghĩ về cách hiện thực — và đó thường là thiết kế tốt hơn.

Ngày 55: **TDD** — quy trình đỏ-xanh-dọn, khi nào nó đáng dùng và khi nào không. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
