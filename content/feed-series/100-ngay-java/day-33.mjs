/** "100 Ngày Java với CuongThai" — Ngày 33: Date/Time API.
    Nối chỗ Ngày 32 kết (`new Date(2026, 8, 9)` ra năm 3926 tháng 9).
    Dùng lại tính bất biến đã nói ở Ngày 13/19. Ngày 34 (File I/O) trỏ
    ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21.
    Chương trình cố ý KHÔNG dùng `LocalDate.now()`: kết quả sẽ đổi theo
    ngày chạy và phép so output của thẻ hỏng sau đúng một hôm. */
export default {
  day: 33,
  card: 'java-day-33',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'generic-statistics-processor-with-exception-handling',
    title: 'Bộ xử lý thống kê có kiểm soát ngoại lệ',
  },

  content: `📅 100 NGÀY JAVA — NGÀY 33: NGÀY & GIỜ

Hôm qua tôi để lại dòng này:

\`\`\`java
Date d = new Date(2026, 8, 9);
\`\`\`

Bạn nghĩ nó là ngày 9 tháng 8 năm 2026? Sai. Nó là ngày 9 tháng **9** năm **3926**. Vì class \`Date\` cũ đếm năm từ 1900 và đếm tháng từ 0.

Ba quyết định thiết kế sai trong một dòng — cộng thêm một cái nữa: \`Date\` sửa được sau khi tạo, nên chuyền nó vào một method là method đó đổi được ngày của bạn.

Java 8 làm lại toàn bộ, và làm rất đúng.

━━━━━━━━━━━━━━━━━━━━

📌 BA CLASS CHO BA NHU CẦU

\`\`\`java
LocalDate     ngay = LocalDate.of(2026, 8, 9);         // chỉ ngày
LocalTime     gio  = LocalTime.of(9, 0);               // chỉ giờ
LocalDateTime ca   = LocalDateTime.of(2026, 8, 9, 9, 0); // cả hai
\`\`\`

Chạy thật:

\`\`\`
1) 2026-08-09 | thu SUNDAY | ngay thu 221
\`\`\`

Tháng 8 nghĩa là tháng 8. Năm 2026 nghĩa là năm 2026. Không phải mẹo, chỉ là làm đúng ngay từ đầu.

Chọn class theo đúng thứ bạn cần: ngày sinh thì \`LocalDate\` (giờ nào không quan trọng), giờ mở cửa thì \`LocalTime\` (ngày nào không quan trọng), lịch hẹn thì \`LocalDateTime\`. Cần cả múi giờ — server ở Singapore, người dùng ở Việt Nam — thì \`ZonedDateTime\`.

━━━━━━━━━━━━━━━━━━━━

🧊 BẤT BIẾN — MỌI PHÉP ĐỔI TRẢ VỀ VẬT MỚI

\`\`\`java
LocalDate sau = ngay.plusDays(30).plusMonths(1);
\`\`\`

\`\`\`
2) goc van la 2026-08-09 | moi la 2026-10-08
\`\`\`

\`ngay\` không hề đổi. \`plusDays\` trả về một \`LocalDate\` MỚI — giống \`String\` (Ngày 9) và giống tinh thần bất biến ở Ngày 13.

Lợi ích: chuyền đối tượng này đi khắp chương trình mà không sợ ai sửa trộm. Không cần bản sao phòng thủ như mảng ở Ngày 13.

Cái bẫy đi kèm — người mới hay dính:

\`\`\`java
ngay.plusDays(30);              // ✗ vô nghĩa, kết quả rơi vào hư không
ngay = ngay.plusDays(30);       // ✓ phải gán lại
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⏳ KHOẢNG CÁCH: Period, Duration, ChronoUnit

Ba cách hỏi "cách nhau bao lâu", cho ba câu trả lời khác nhau:

\`\`\`java
ChronoUnit.DAYS.between(ngay, hanNop);   // 144
Period.between(ngay, hanNop);            // 4 tháng 22 ngày
Duration.between(batDau, ketThuc);       // 2h30p
\`\`\`

\`\`\`
3) con 144 ngay den han
4) tuc la 4 thang 22 ngay
5) hop keo dai 2h30p
\`\`\`

Quy tắc nhớ:

- \`Period\` — đơn vị **lịch**: năm, tháng, ngày. Dùng cho tuổi, hạn hợp đồng.
- \`Duration\` — đơn vị **đồng hồ**: giờ, phút, giây. Dùng cho thời lượng cuộc gọi, timeout.
- \`ChronoUnit.X.between(...)\` — cần đúng MỘT con số theo một đơn vị.

━━━━━━━━━━━━━━━━━━━━

🔤 ĐỌC VÀ VIẾT CHUỖI

\`\`\`java
DateTimeFormatter vn = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
batDau.format(vn);                  // 09/08/2026 09:00

LocalDate.parse("2026-01-15");      // đọc chuẩn ISO
\`\`\`

\`\`\`
6) format -> 09/08/2026 09:00
\`\`\`

Nhớ phân biệt chữ hoa thường trong pattern: \`MM\` là tháng còn \`mm\` là phút; \`HH\` là giờ 24 còn \`hh\` là giờ 12. Viết nhầm \`yyyy-mm-dd\` là ra "2026-00-15" — một lỗi kinh điển.

Và một điểm rất đáng khen:

\`\`\`java
LocalDate.of(2026, 2, 30);   // ✗ DateTimeException
\`\`\`

\`\`\`
9) 30/02 -> DateTimeException
\`\`\`

Ngày 30 tháng 2 không tồn tại, và Java nói thẳng. Class \`Calendar\` cũ thì âm thầm chuyển thành ngày 2 tháng 3 — dữ liệu sai lặng lẽ trôi vào cơ sở dữ liệu.

━━━━━━━━━━━━━━━━━━━━

🌏 MỘT LƯU Ý VỀ MÚI GIỜ

\`LocalDate\`/\`LocalDateTime\` KHÔNG mang múi giờ. \`LocalDateTime.of(2026, 8, 9, 9, 0)\` là "9 giờ sáng" ở bất cứ đâu — không phải một thời điểm cụ thể trên trái đất.

Ứng dụng chạy trên server nước ngoài, người dùng ở Việt Nam thì phải dùng:

\`\`\`java
ZonedDateTime vn = ZonedDateTime.of(ca, ZoneId.of("Asia/Ho_Chi_Minh"));
Instant moc = Instant.now();     // mốc thời gian tuyệt đối, chuẩn UTC
\`\`\`

Quy tắc thực dụng: **lưu \`Instant\`/UTC trong cơ sở dữ liệu, đổi sang giờ địa phương khi hiển thị**. Lưu giờ địa phương là tự chuốc rắc rối khi đổi server hoặc khi có người dùng ở nước khác.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tính tuổi từ ngày sinh bằng \`Period.between\`.
2. Tính còn bao nhiêu ngày tới Tết bằng \`ChronoUnit.DAYS\`.
3. In ra tất cả ngày Chủ nhật của tháng này bằng vòng lặp \`plusDays(1)\`.
4. Gọi \`ngay.plusDays(30)\` mà KHÔNG gán lại, in \`ngay\` — giải thích.
5. Thử \`LocalDate.of(2026, 2, 30)\` và \`LocalDate.parse("2026-13-01")\`, đọc cả hai lỗi.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`java.time\` là ví dụ đẹp về API làm đúng: bất biến, gọi tên như con người nghĩ, và từ chối dữ liệu vô lý ngay lập tức. Quên \`Date\`/\`Calendar\` cũ đi — chúng chỉ còn tồn tại vì code cũ.

Đến đây bạn xử lý được dữ liệu trong bộ nhớ khá thành thạo. Nhưng tắt chương trình là mất sạch.

Ngày 34: đọc và ghi FILE bằng \`Files\` và \`Path\` — cách lưu dữ liệu lại, và cách đọc một file 2GB mà không làm tràn bộ nhớ. Đây cũng là lúc \`try-with-resources\` của Ngày 23 quay lại làm việc thật. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
