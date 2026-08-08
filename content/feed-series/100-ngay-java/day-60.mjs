/** "100 Ngày Java với CuongThai" — Ngày 60: bài tổng hợp khép Giai đoạn 7.
    Nối đúng chỗ Ngày 59 kết ("ngày mai ta ghép bảy mảnh rời lại").
    Mốc 60/100. Ngày 61 mở Giai đoạn 8 (CSDL) và trỏ ngược về phần kết.

    ⚠ Maven/JUnit/Logback là công cụ ngoài, thẻ chạy JDK thuần nên chương
    trình kiểm chứng dựng lại nguyên lý và ghép cả năm chủ đề vào một dòng
    chảy; thân bài dạy cấu trúc dự án + cú pháp thật.
    Mọi output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 60,
  card: 'java-day-60',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-fully-tested-order-processing-service-with-junit-5-and-mockito',
    title: 'Dịch vụ xử lý đơn hàng có test đầy đủ (JUnit 5 + Mockito)',
  },

  content: `🏁 100 NGÀY JAVA — NGÀY 60: KHÉP GIAI ĐOẠN 7

Mười ngày vừa rồi ta học bảy thứ rời nhau: bên trong JVM, bộ dọn rác, viết test, bản giả, TDD, Maven, Git & CI, log, đo hiệu năng.

Hôm nay ghép lại. Vì giá trị thật của chúng không nằm ở từng cái, mà ở chỗ chúng đỡ nhau.

Kịch bản: bạn có một dịch vụ tra cứu đơn hàng đang chạy tốt. Có người báo nó chậm. Bạn phải sửa **mà không được làm hỏng thứ đang chạy được**.

━━━━━━━━━━━━━━━━━━━━

📁 DỰ ÁN TRÔNG NHƯ THẾ NÀY

\`\`\`
tra-cuu-don/
├── pom.xml                       thư viện + vòng đời build (Ngày 56)
├── .gitignore                    target/, .env (Ngày 57)
├── .github/workflows/ci.yml      máy tự chạy test (Ngày 57)
└── src/
    ├── main/java/.../KhoDonHang.java     interface
    ├── main/java/.../KhoBangDanhSach.java
    ├── main/resources/logback.xml        mức log (Ngày 58)
    └── test/java/.../KhoDonHangTest.java (Ngày 53–55)
\`\`\`

Không có thư mục nào ở đây là tuỳ hứng — mỗi cái tương ứng với một bài trong mười ngày qua.

━━━━━━━━━━━━━━━━━━━━

🕸️ BƯỚC 1: CÓ TEST TRƯỚC ĐÃ

Trước khi đụng vào bất cứ thứ gì, phải có tấm lưới. Quan trọng là test viết cho **interface**, không cho lớp cụ thể:

\`\`\`java
interface KhoDonHang {
    void them(DonHang d);
    DonHang tim(String ma);
}
\`\`\`

\`\`\`java
@Test
void tim_ma_khong_co_thi_tra_null() {
    KhoDonHang kho = new KhoBangDanhSach();
    assertNull(kho.tim("DH-404"));
}
\`\`\`

\`\`\`
1) pha 'test' cua vong doi Maven: 4 phep thu -> 4 dat, 0 hong
\`\`\`

Bốn phép thử: mã có thật, đúng số tiền, mã không có → \`null\`, mã rỗng → \`null\` chứ không nổ. Ít, nhưng đủ mô tả **bản hợp đồng**.

━━━━━━━━━━━━━━━━━━━━

🚦 BƯỚC 2: CỔNG CI ĐANG MỞ

\`\`\`
2) cong CI: test xanh -> cho gop vao main? true
\`\`\`

Nhắc lại vì sao dòng này quan trọng: \`mvn package\` chạy qua \`validate → compile → test → package\`, test đỏ là dừng, không sinh ra file \`.jar\`. Còn CI thì chạy đúng chuỗi đó trên một máy sạch mỗi lần bạn đẩy code lên.

Nghĩa là từ giờ, mọi thay đổi bạn sắp làm đều có người gác — kể cả khi bạn quên.

━━━━━━━━━━━━━━━━━━━━

📏 BƯỚC 3: ĐO, ĐỪNG ĐOÁN

Đây là chỗ dễ sai nhất và cũng là bài học lớn nhất của Ngày 59. Đừng mở code ra đoán. Đo:

\`\`\`
3) do TRUOC: 5000 lan tra cuu (List) -> 12502500 phep so sanh
\`\`\`

Mười hai triệu rưỡi phép so sánh cho 5.000 lần tra cứu. Nhìn số đó là biết ngay vấn đề không nằm ở "code viết chưa khéo" — nó nằm ở chỗ mỗi lần tìm đều phải duyệt cả kho.

━━━━━━━━━━━━━━━━━━━━

🔧 BƯỚC 4: SỬA ĐÚNG CHỖ VỪA ĐO

Không viết lại vòng lặp cho khéo. Đổi cấu trúc dữ liệu:

\`\`\`java
class KhoBangBangBam implements KhoDonHang {
    private final Map<String, DonHang> bang = new HashMap<>();
    public void them(DonHang d) { bang.put(d.ma(), d); }
    public DonHang tim(String ma) { return bang.get(ma); }
}
\`\`\`

\`\`\`
4) doi sang HashMap -> 5000 phep so sanh, nhanh hon 2500 lan
\`\`\`

Để ý: \`interface\` **không đổi một chữ nào**. Đây chính là lý do Ngày 18 bắt bạn phụ thuộc vào bản hợp đồng thay vì bản cài đặt — hôm nay bạn thu lãi: thay ruột mà không ai bên ngoài phải sửa theo.

━━━━━━━━━━━━━━━━━━━━

✅ BƯỚC 5: CHẠY LẠI CHÍNH BỘ TEST ĐÓ

Bước quan trọng nhất của cả bài, và cũng là bước hay bị bỏ nhất:

\`\`\`
5) chay lai test SAU khi toi uu -> 4/4 dat, khong vo gi
\`\`\`

**Cùng một bộ test**, không sửa một dòng, chạy trên bản cài đặt hoàn toàn mới — và vẫn xanh.

Đó là toàn bộ ý nghĩa của mười ngày vừa rồi. Không có bộ test này, bạn vừa thay ruột một dịch vụ đang chạy và cách duy nhất để biết mình có làm hỏng gì không là... chờ khách hàng báo.

Nếu có phép thử nào đỏ ở bước này, CI sẽ chặn, \`.jar\` không được tạo, và bản tối ưu sai không bao giờ tới được production.

━━━━━━━━━━━━━━━━━━━━

🔏 BƯỚC 6: LOG ĐỂ CÒN NHÌN THẤY

Cuối cùng, để lần sau không phải mò trong bóng tối:

\`\`\`
6) log nguong INFO -> 3 dong; INFO dang nhap u=an mk=***
\`\`\`

Hai việc cùng lúc: ngưỡng \`INFO\` **bỏ bớt** dòng \`DEBUG\` cho log khỏi ngập, và mật khẩu bị **che** thành \`mk=***\` trước khi ghi.

Cái thứ hai không phải chuyện nhỏ. Log bị sao lưu, bị gửi sang hệ thống thu thập, bị đồng nghiệp mở khi trực đêm. Một dòng \`mk=matkhau123\` nằm đó là một sự cố bảo mật chỉ chờ ngày bị phát hiện.

━━━━━━━━━━━━━━━━━━━━

🧭 NHÌN LẠI GIAI ĐOẠN 7

Chuỗi vừa rồi có một trật tự:

- **51–52** — hiểu máy chạy code của mình thế nào (JVM, bộ nhớ, bộ dọn rác)
- **53–55** — viết được cái lưới an toàn (JUnit, bản giả, TDD)
- **56–57** — để máy tự lo phần lặp đi lặp lại (Maven, Git & CI)
- **58–59** — nhìn thấy và đo được thứ đang chạy (log, hiệu năng)

Cộng lại, chúng trả lời một câu hỏi duy nhất: **làm sao sửa code mà không sợ?** Từ đây bạn có quyền nói "để tôi đổi chỗ này" mà không thấy lạnh sống lưng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Dựng đúng cấu trúc thư mục trên cho một dự án Maven mới.
2. Viết \`KhoDonHang\` bản \`List\`, viết 4 test cho **interface**, cho xanh.
3. Đếm số phép so sánh với 5.000 đơn — tự tay nhìn con số 12,5 triệu.
4. Viết bản \`HashMap\`, chạy lại **đúng bộ test cũ**, không sửa test.
5. Thêm \`ci.yml\`, đẩy lên GitHub, cố tình làm một test đỏ và xem CI chặn.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN — 60/100

Sáu mươi ngày. Bạn đã đi từ \`System.out.println\` tới một dự án có test, có build tự động, có CI gác cổng, có log tử tế và có kỷ luật đo đạc.

Nhưng để ý một điều: mọi thứ ta viết suốt 60 ngày đều **chết khi chương trình tắt**. Danh sách đơn hàng, giỏ hàng, người dùng — tắt máy là sạch. Cái \`HashMap\` hôm nay nhanh gấp 2500 lần cũng không cứu được điều đó.

Phần mềm thật thì không thế. Đơn hàng phải còn đó sau khi máy chủ khởi động lại. Dữ liệu phải sống lâu hơn chương trình.

Ngày 61 mở **Giai đoạn 8: CSDL & JDBC** — vì sao lưu vào file là không đủ, cơ sở dữ liệu quan hệ giải quyết chuyện gì, bảng/khoá chính/khoá ngoại là gì, và câu lệnh SQL đầu tiên của bạn. Mười ngày tới, dữ liệu sẽ thôi biến mất. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
