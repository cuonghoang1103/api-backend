/** "100 Ngày Java với CuongThai" — Ngày 32: Optional.
    Nối thẳng chỗ Ngày 31 kết (`.max(...).get()` trả Optional chứ không
    trả thẳng đối tượng). Dùng lại map/filter của Ngày 31 và ngoại lệ
    nghiệp vụ của Ngày 22. Ngày 33 (Date/Time) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 32,
  card: 'java-day-32',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'generic-configuration-file-validator',
    title: 'Bộ kiểm tra tệp cấu hình tổng quát',
  },

  content: `🎁 100 NGÀY JAVA — NGÀY 32: OPTIONAL

Hôm qua có một dòng tôi hẹn giải thích:

\`\`\`java
ds.stream().max(Comparator.comparingDouble(SinhVien::getDiem)).get()
\`\`\`

Vì sao phải \`.get()\`? Vì \`max\` không trả về \`SinhVien\` — danh sách rỗng thì làm gì có ai cao điểm nhất. Nó trả về \`Optional<SinhVien>\`: một cái hộp có thể có, có thể rỗng.

Hôm nay là câu chuyện về cái hộp đó, và về thứ mà người tạo ra \`null\` gọi là "sai lầm tỷ đô của tôi".

━━━━━━━━━━━━━━━━━━━━

📌 VẤN ĐỀ VỚI null: CHỮ KÝ NÓI DỐI

\`\`\`java
Integer tim(String ma) { return ton.get(ma); }
\`\`\`

Nhìn chữ ký này, bạn có biết nó trả về \`null\` được không? Không. Phải mở code ra đọc, hoặc đọc tài liệu, hoặc… đợi lúc chạy:

\`\`\`java
Integer soLuong = kho.timCu("tay");
int x = soLuong + 1;
\`\`\`

\`\`\`
7) cach cu tra null -> NullPointerException
\`\`\`

\`Optional\` đưa sự thật đó vào ngay kiểu trả về:

\`\`\`java
Optional<Integer> tim(String ma) {
    return Optional.ofNullable(ton.get(ma));
}
\`\`\`

Giờ người gọi KHÔNG THỂ quên: muốn lấy số ra thì buộc phải nói rõ xử lý ra sao khi không có.

\`\`\`
1) co hang -> 10 | khong co -> 0
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧰 BỐN CÁCH LẤY GIÁ TRỊ RA

\`\`\`java
.orElse(0)                                    // giá trị thay thế
.orElseGet(() -> tinhLaiTonKho())             // chỉ tính khi rỗng
.orElseThrow(() -> new KhongCoHangException()) // ném ngoại lệ nghiệp vụ
.ifPresent(n -> System.out.println("con " + n)) // chỉ chạy khi CÓ
\`\`\`

\`\`\`
3) ifPresent -> con 10
6) orElseThrow -> Khong co ma hang
\`\`\`

Phân biệt \`orElse\` và \`orElseGet\`: \`orElse(tinhLai())\` gọi \`tinhLai()\` **luôn luôn**, kể cả khi có giá trị — vì tham số phải tính xong mới truyền vào được. \`orElseGet(() -> tinhLai())\` chỉ chạy khi thật sự rỗng. Giá trị thay thế mà đắt tiền thì phải dùng \`orElseGet\`.

\`orElseThrow\` ghép rất đẹp với ngoại lệ nghiệp vụ của Ngày 22: không tìm thấy thì ném đúng loại lỗi mang đủ thông tin.

━━━━━━━━━━━━━━━━━━━━

⛓️ XÍCH ĐƯỢC NHƯ STREAM

\`Optional\` dùng chung bộ từ vựng với Stream (Ngày 31):

\`\`\`java
kho.tim("vo")
   .filter(n -> n > 5)
   .map(n -> "du hang")
   .orElse("sap het");
\`\`\`

\`\`\`
4) map+filter -> sap het
\`\`\`

Kho còn 3 quyển vở, không qua được \`filter(n > 5)\`, nên hộp thành rỗng và cả dây chuyền phía sau bỏ qua, rơi thẳng xuống \`orElse\`.

Điểm hay: bạn viết mạch xử lý cho trường hợp CÓ, và chỉ nói một lần ở cuối phải làm gì khi KHÔNG — thay vì rải \`if (x != null)\` khắp nơi.

━━━━━━━━━━━━━━━━━━━━

☠️ ĐỪNG GỌI .get()

\`\`\`java
kho.tim("tay").get();
// ✗ NoSuchElementException: No value present
\`\`\`

\`\`\`
5) get() khi rong -> NoSuchElementException
\`\`\`

Gọi \`.get()\` mà không kiểm tra trước thì bạn vừa đổi \`NullPointerException\` lấy \`NoSuchElementException\` — cùng một cú nổ, tên khác. Toàn bộ giá trị của \`Optional\` biến mất.

Java 10 đặt tên rõ hơn cho việc này: \`orElseThrow()\` không tham số. Cùng hành vi nhưng đọc là biết "tôi cố ý ném nếu rỗng", chứ không phải "tôi quên kiểm".

━━━━━━━━━━━━━━━━━━━━

🚫 BA CHỖ ĐỪNG DÙNG OPTIONAL

\`Optional\` sinh ra cho ĐÚNG MỘT việc: kiểu trả về của method có thể không tìm thấy gì. Ba chỗ dùng sai rất phổ biến:

\`\`\`java
class SinhVien {
    private Optional<String> email;        // ✗ field
}
void luu(Optional<SinhVien> s) { … }       // ✗ tham số
List<Optional<String>> ds;                 // ✗ phần tử collection
\`\`\`

- **Field**: tốn thêm một lớp bọc cho mỗi đối tượng, và \`Optional\` không serialize được.
- **Tham số**: người gọi phải bọc \`Optional.of(...)\` rất phiền — cứ nạp chồng method (Ngày 10) là gọn hơn.
- **Trong Collection**: danh sách rỗng đã đủ nghĩa "không có gì" rồi.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`Optional<SinhVien> timTheoMssv(String mssv)\` rồi dùng \`orElseThrow\`.
2. So \`orElse(tinhLai())\` và \`orElseGet(() -> tinhLai())\` — in log trong \`tinhLai\` để thấy khác biệt.
3. Xích \`filter\` + \`map\` + \`orElse\` trên một \`Optional\`.
4. Gọi \`.get()\` trên \`Optional.empty()\` để tự gặp lỗi.
5. Viết một method trả \`null\` và một method trả \`Optional\`, rồi đưa cả hai cho bạn cùng lớp dùng — xem ai quên kiểm.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`Optional\` đưa sự thật "có thể không có" vào chữ ký method, để người gọi không thể quên. Dùng \`orElse\`/\`orElseGet\`/\`orElseThrow\`/\`ifPresent\`, xích được như stream, và tránh xa \`.get()\` trần.

Ba ngày qua toàn công cụ xử lý dữ liệu: lambda, stream, optional. Nhưng có một loại dữ liệu mà mọi phần mềm đều đụng tới và Java từng làm rất tệ — ngày giờ.

\`\`\`java
Date d = new Date(2026, 8, 9);   // ✗ năm 3926, tháng 9!
\`\`\`

Class \`Date\` cũ đếm năm từ 1900, đếm tháng từ 0, và thay đổi được sau khi tạo — ba quyết định thiết kế sai gộp trong một dòng.

Ngày 33: \`LocalDate\`, \`LocalDateTime\`, \`Duration\` — bộ API ngày giờ của Java 8, bất biến và gọi tên đúng như con người nghĩ. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
