/** "100 Ngày Java với CuongThai" — Ngày 39: switch biểu thức & pattern
    matching. Nối chỗ Ngày 38 kết (switch cũ trong enum, quên break là rơi
    nhánh). Trả nợ chuỗi `instanceof` mà Ngày 16 nói là dấu hiệu thiết kế
    sai. Ngày 40 khép Giai đoạn 5 nên phần kết phải dẫn sang ôn tập.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21 —
    gồm cả dòng chứng minh lỗi rơi nhánh: tháng 2 ra "Mua xuan". */
export default {
  day: 39,
  card: 'java-day-39',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-document-export-system-with-polymorphic-exporters',
    title: 'Hệ thống xuất tài liệu đa hình',
  },

  content: `🏹 100 NGÀY JAVA — NGÀY 39: SWITCH MỚI

Hôm qua trong enum ta viết \`switch\` kiểu cũ. Hôm nay xem vì sao kiểu cũ nguy hiểm — bằng một phép thử chạy thật.

━━━━━━━━━━━━━━━━━━━━

📌 LỖI RƠI NHÁNH, CHỨNG MINH BẰNG SỐ

\`\`\`java
switch (thang) {
    case 12:
    case 1:
    case 2: r = "Mua dong";        // ← QUÊN break
    case 3: r = "Mua xuan"; break;
    default: r = "Khac";
}
\`\`\`

Truyền vào tháng 2, kết quả thật:

\`\`\`
1) switch cu, thang 2 -> Mua xuan   (bi ROI xuong nhanh duoi!)
\`\`\`

Tháng 2 mà ra "Mùa xuân". Vì thiếu \`break\`, Java chạy tiếp xuống nhánh \`case 3\` và ghi đè kết quả.

Điều tệ nhất: trình dịch **không cảnh báo gì**. Rơi nhánh đôi khi là cố ý (gộp nhiều case), nên Java không thể biết bạn quên hay chủ đích. Đây là một trong những lỗi âm thầm kinh điển nhất mà người mới học Ngày 5 hay dính.

━━━━━━━━━━━━━━━━━━━━

✅ SWITCH BIỂU THỨC: MŨI TÊN, KHÔNG RƠI

Java 14 cho một dạng \`switch\` mới:

\`\`\`java
return switch (thang) {
    case 12, 1, 2 -> "Mua dong";
    case 3, 4, 5  -> "Mua xuan";
    case 6, 7, 8  -> "Mua he";
    default       -> "Mua thu";
};
\`\`\`

\`\`\`
2) switch moi, thang 2 -> Mua dong
3) thang 7 -> Mua he | thang 10 -> Mua thu
\`\`\`

Ba cải tiến trong một cú pháp:

1. **Không rơi nhánh.** Mũi tên \`->\` chỉ chạy đúng nhánh khớp. Không cần \`break\`, không thể quên.
2. **Gộp nhiều giá trị** bằng dấu phẩy, không phải xếp chồng \`case\` rỗng.
3. **Là biểu thức**, không phải câu lệnh — nó TRẢ VỀ giá trị, gán thẳng vào biến hoặc \`return\` được.

Điểm thứ ba kéo theo một lợi ích lớn: khi \`switch\` phải trả về giá trị, Java bắt buộc bạn phủ hết mọi trường hợp. Thiếu \`default\` (hoặc thiếu một hằng enum) là **lỗi lúc dịch**. Với enum, thêm một hằng mới là mọi \`switch\` chưa cập nhật đều báo lỗi ngay — thay vì âm thầm rơi vào \`default\`.

━━━━━━━━━━━━━━━━━━━━

🧱 yield KHI NHÁNH CẦN NHIỀU CÂU LỆNH

\`\`\`java
return switch ((int) diem) {
    case 9, 10 -> "Xuat sac";
    case 8 -> "Gioi";
    default -> {
        String s = diem >= 6.5 ? "Kha" : "Trung binh";
        yield s + " (" + diem + ")";
    }
};
\`\`\`

\`\`\`
4) xep loai 9.5 -> Xuat sac | 7.0 -> Kha (7.0)
\`\`\`

Nhánh cần nhiều dòng thì mở ngoặc nhọn và kết bằng \`yield\`. Phân biệt: \`yield\` trả giá trị cho NHÁNH, còn \`return\` thoát khỏi cả method.

━━━━━━━━━━━━━━━━━━━━

🎯 PATTERN MATCHING — TRẢ NỢ NGÀY 16

Nhớ Ngày 16 chứ? Tôi nói phải \`instanceof\` liên tục là dấu hiệu thiết kế sai. Nhưng có những lúc bạn thật sự phải phân loại theo kiểu — xử lý dữ liệu từ bên ngoài, chẳng hạn. Cách cũ rất dài dòng:

\`\`\`java
if (o instanceof Integer) {
    Integer i = (Integer) o;
    if (i > 100) return "so nguyen lon: " + i;
    return "so nguyen: " + i;
} else if (o instanceof String) {
    String s = (String) o;
    return "chuoi dai " + s.length();
}
\`\`\`

Java 21 gộp cả ba việc — kiểm kiểu, ép kiểu, đặt tên biến — vào một dòng:

\`\`\`java
return switch (o) {
    case Integer i when i > 100 -> "so nguyen lon: " + i;
    case Integer i -> "so nguyen: " + i;
    case String s  -> "chuoi dai " + s.length();
    case null      -> "khong co gi";
    default        -> "kieu khac: " + o.getClass().getSimpleName();
};
\`\`\`

\`\`\`
5) so nguyen lon: 500
6) so nguyen: 42 | chuoi dai 8
7) khong co gi | kieu khac: Double
\`\`\`

Ba điểm đáng chú ý:

- \`case Integer i\` — kiểm kiểu VÀ tạo sẵn biến \`i\` đã ép kiểu.
- \`when i > 100\` — thêm điều kiện cho nhánh, gọi là *guard*. Nhánh cụ thể hơn phải viết TRƯỚC.
- \`case null\` — xử lý được \`null\`. \`switch\` cũ gặp \`null\` là ném \`NullPointerException\` ngay.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`switch\` cũ quên \`break\` rồi tự tay tái hiện lỗi rơi nhánh.
2. Viết lại bằng mũi tên và kiểm chứng kết quả đúng.
3. Chuyển hàm xếp loại điểm sang \`switch\` biểu thức có \`yield\`.
4. Viết \`String mota(Object o)\` bằng pattern matching cho \`Integer\`, \`String\`, \`List\`, \`null\`.
5. Viết \`switch\` trên một enum mà THIẾU một hằng, bỏ \`default\` — đọc lỗi lúc dịch.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`switch\` mũi tên không rơi nhánh, trả thẳng giá trị, và bắt bạn phủ hết trường hợp. Pattern matching gộp kiểm kiểu với ép kiểu. Từ nay mặc định viết kiểu mới — kiểu cũ chỉ để đọc code người khác.

Mai là Ngày 40, khép Giai đoạn 5. Mười ngày qua bạn nhận được bộ công cụ của Java **hiện đại**: generics, lambda, stream, optional, date/time, file, regex, StringBuilder, enum, record, switch mới.

Ngày 40 sẽ không có khái niệm mới. Thay vào đó ta viết MỘT chương trình dùng gần hết những thứ trên — đọc file điểm, bóc dữ liệu bằng regex, gom thành \`record\`, lọc và thống kê bằng stream, xử lý thiếu dữ liệu bằng \`Optional\`, phân loại bằng \`enum\` và \`switch\` mới.

Đó là lúc bạn thấy chúng không phải mười thứ rời rạc, mà là một bộ. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
