/** "100 Ngày Java với CuongThai" — Ngày 34: đọc/ghi file.
    Nối chỗ Ngày 33 kết (tắt chương trình là mất sạch dữ liệu). Đây là
    lúc try-with-resources của Ngày 23 và Stream của Ngày 31 làm việc
    thật. Ngày 35 (JSON) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21;
    chương trình ghi vào thư mục tạm rồi tự xoá nên chạy lại luôn cho
    cùng một kết quả. */
export default {
  day: 34,
  card: 'java-day-34',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'generic-csv-file-parser-with-custom-exception-handling',
    title: 'Bộ đọc CSV tổng quát có ngoại lệ riêng',
  },

  content: `💾 100 NGÀY JAVA — NGÀY 34: ĐỌC & GHI FILE

Ba mươi ba ngày qua, mọi dữ liệu đều sống trong bộ nhớ. Tắt chương trình là mất sạch.

Hôm nay ta cho nó ở lại.

━━━━━━━━━━━━━━━━━━━━

📌 MỘT DÒNG LÀ XONG

Nếu bạn từng thấy code Java đọc file thời cũ — \`FileReader\` bọc \`BufferedReader\`, rồi \`finally\` đóng — thì quên đi. Java 11 trở lên:

\`\`\`java
Path f = Path.of("diem.csv");

Files.writeString(f, "An,9.5\\nBinh,7.0\\nChi,8.5\\n");
String all = Files.readString(f);
List<String> dong = Files.readAllLines(f);
\`\`\`

Chạy thật:

\`\`\`
1) da ghi, kich thuoc 24 byte
2) doc ca file -> 3 dong
3) readAllLines -> An,9.5
\`\`\`

\`Path\` thay cho class \`File\` cũ. Điểm hay nhất là ghép đường dẫn:

\`\`\`java
Path f = thuMuc.resolve("diem.csv");     // ✓ đúng trên mọi hệ điều hành
String s = thuMuc + "/" + "diem.csv";    // ✗ Windows dùng dấu \\
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⚠️ FILE LỚN: ĐỪNG NẠP HẾT VÀO RAM

\`Files.readString\` nạp TOÀN BỘ file vào bộ nhớ. File log 2GB thì bạn cần 2GB RAM — và nhận \`OutOfMemoryError\`.

Cách đúng là đọc từng dòng như một dòng chảy:

\`\`\`java
try (Stream<String> st = Files.lines(f)) {
    double tb = st.map(l -> l.split(","))
                  .mapToDouble(p -> Double.parseDouble(p[1]))
                  .average().orElse(0);
}
\`\`\`

\`\`\`
4) diem trung binh -> 8.33
\`\`\`

Đây là chỗ ba bài trước gặp nhau: \`Files.lines\` trả về **Stream** (Ngày 31), stream đó giữ một file đang mở nên **bắt buộc** đặt trong \`try-with-resources\` (Ngày 23), và tính trung bình bằng \`mapToDouble().average()\` trả về **Optional** (Ngày 32).

Quên \`try(...)\` quanh \`Files.lines\` là rò rỉ file handle — loại bug chạy vài ngày mới sập mà Ngày 23 đã cảnh báo.

━━━━━━━━━━━━━━━━━━━━

✍️ GHI THÊM, ĐỪNG GHI ĐÈ

\`\`\`java
Files.writeString(f, "Dung,6.0\\n");                               // ĐÈ, mất hết
Files.writeString(f, "Dung,6.0\\n", StandardOpenOption.APPEND);    // ghi thêm
\`\`\`

\`\`\`
5) sau khi APPEND -> 4 dong
\`\`\`

Mặc định là GHI ĐÈ. Đây là lỗi đắt giá: chạy một vòng lặp ghi log mà quên \`APPEND\` thì file cuối cùng chỉ còn đúng dòng cuối, và dữ liệu cũ không lấy lại được.

━━━━━━━━━━━━━━━━━━━━

🧰 VIỆC VẶT VÀ LỖI GỌI ĐÚNG TÊN

\`\`\`java
Files.exists(f)              Files.size(f)
Files.copy(a, b)             Files.move(a, b)
Files.createDirectories(p)   Files.deleteIfExists(f)
Files.isDirectory(p)         Files.list(p)
\`\`\`

\`\`\`
6) ton tai ban sao? true | thu muc? true
7) file khong ton tai -> NoSuchFileException
\`\`\`

Để ý dòng 7: đọc file không tồn tại thì nhận \`NoSuchFileException\` — nói rõ vấn đề. Class \`File\` cũ thì nhiều thao tác chỉ trả \`false\`, không cho biết vì sao: không có file? không có quyền? đường dẫn sai? Bạn tự đoán.

Cũng nhớ \`Files.list\` trả Stream, nên cũng phải nằm trong \`try(...)\`.

━━━━━━━━━━━━━━━━━━━━

🔤 MỘT LỜI VỀ BẢNG MÃ

\`Files.readString\`/\`writeString\` mặc định dùng UTF-8 — điều bạn muốn 99% trường hợp, và là lý do tiếng Việt có dấu không bị hỏng.

Nhưng \`new FileReader(f)\` (API cũ) dùng bảng mã MẶC ĐỊNH CỦA HỆ ĐIỀU HÀNH. Cùng một file, máy bạn đọc ra "Nguyễn", máy đồng nghiệp đọc ra "Nguy?n". Đây là nguồn gốc của phần lớn lỗi tiếng Việt trong file mà dân Việt hay gặp.

Quy tắc: dùng \`java.nio.file.Files\`, và khi buộc phải dùng API cũ thì luôn chỉ định \`StandardCharsets.UTF_8\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Ghi danh sách sinh viên ra file CSV rồi đọc lại thành \`List<SinhVien>\`.
2. Đọc một file bằng \`Files.lines\` và đếm số dòng chứa từ "ERROR".
3. Ghi log 5 lần bằng \`APPEND\`, rồi thử bỏ \`APPEND\` và so kết quả.
4. Đọc file không tồn tại — đọc lỗi, rồi bọc \`try/catch\` xử lý tử tế.
5. Ghi tiếng Việt có dấu bằng \`Files.writeString\`, rồi đọc lại bằng \`new FileReader\` không chỉ định bảng mã.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

File nhỏ thì \`readString\`/\`readAllLines\`; file lớn thì \`Files.lines\` trong \`try-with-resources\`. Nhớ \`APPEND\` khi ghi thêm, và dùng \`Path.resolve\` thay vì nối chuỗi.

Nhưng đọc file xong thì phải BÓC dữ liệu ra, và \`split(",")\` chỉ đủ dùng cho file sạch sẽ. Thực tế thì:

\`\`\`
2026-08-09 09:15:03 ERROR [db] Connection timeout after 30s
\`\`\`

Lấy ra ngày, mức độ, tên module, số giây — bằng \`substring\` và \`indexOf\`? Được, nhưng dài dòng và vỡ ngay khi định dạng đổi một chút.

Ngày 35: **Biểu thức chính quy** (\`Pattern\`, \`Matcher\`) — công cụ mô tả HÌNH DẠNG của chuỗi, để bóc dữ liệu, kiểm email, và tìm kiếm trong văn bản chỉ bằng vài ký tự. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
