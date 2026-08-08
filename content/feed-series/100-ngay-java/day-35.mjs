/** "100 Ngày Java với CuongThai" — Ngày 35: Biểu thức chính quy.
    Nối chỗ Ngày 34 kết (bóc dữ liệu khỏi dòng log bằng substring thì dài
    dòng và dễ vỡ). Ngày 36 (StringBuilder) trỏ ngược về phần kết.

    ⚠ ESCAPE HAI TẦNG: `content` là template literal của JS. Muốn người đọc
    thấy `\\d` (đúng như trong mã Java) thì ở đây phải gõ bốn dấu chéo.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 35,
  card: 'java-day-35',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-text-analysis-utility-using-collections',
    title: 'Tiện ích phân tích văn bản',
  },

  content: `🔍 100 NGÀY JAVA — NGÀY 35: BIỂU THỨC CHÍNH QUY

Hôm qua ta đọc được file. Nhưng đọc xong thì phải BÓC dữ liệu ra:

\`\`\`
2026-08-09 09:15:03 ERROR [db] Connection timeout after 30s
\`\`\`

Lấy ngày, mức độ, tên module, nội dung — bằng \`indexOf\` và \`substring\`? Được, khoảng mười lăm dòng, và vỡ ngay khi định dạng đổi một chút.

Regex làm việc đó bằng một dòng. Đổi lại, bạn phải học một thứ ngôn ngữ trông như mèo cào.

━━━━━━━━━━━━━━━━━━━━

📌 BẢNG CHỮ CÁI TỐI THIỂU

Học sáu ký hiệu là đủ dùng 80%:

\`\`\`
\\\\d   một chữ số            \\\\w   chữ hoặc số hoặc _
\\\\s   khoảng trắng          .     MỘT ký tự bất kỳ
[abc] một trong a, b, c      [^a]  bất kỳ trừ a
{9}   đúng 9 lần    +  một trở lên    *  không trở lên    ?  có hoặc không
^     đầu chuỗi     $  cuối chuỗi
\`\`\`

Kiểm nhanh nhất bằng \`String.matches\`:

\`\`\`java
"0912345678".matches("0\\\\d{9}");   // true
"091234".matches("0\\\\d{9}");       // false
\`\`\`

\`\`\`
1) '0912345678' la sdt? true | '091234' ? false
\`\`\`

Chú ý: trong chuỗi Java phải viết \`\\\\d\` (hai dấu chéo) vì bản thân \`\\\` đã là ký tự escape của chuỗi. Regex thật chỉ có một dấu chéo.

Và \`matches\` đòi khớp **toàn bộ** chuỗi — khác với nhiều ngôn ngữ khác chỉ cần khớp một phần.

━━━━━━━━━━━━━━━━━━━━

🎣 BÓC DỮ LIỆU BẰNG NHÓM

Đây mới là chỗ regex đáng học. Đặt ngoặc quanh phần muốn lấy:

\`\`\`java
String log = "2026-08-09 09:15:03 ERROR [db] Connection timeout after 30s";

Pattern p = Pattern.compile("^(\\\\S+) (\\\\S+) (\\\\w+) \\\\[(\\\\w+)\\\\] (.+)$");
Matcher m = p.matcher(log);
if (m.matches()) {
    m.group(1);   // 2026-08-09
    m.group(3);   // ERROR
    m.group(4);   // db
}
\`\`\`

\`\`\`
2) ngay=2026-08-09 muc=ERROR module=db
3) noi dung=Connection timeout after 30s
\`\`\`

Đếm \`group(1)\`, \`group(3)\` dễ nhầm khi mẫu dài. Đặt tên cho nhóm thì rõ hơn hẳn:

\`\`\`java
Pattern email = Pattern.compile("(?<ten>[\\\\w.]+)@(?<mien>[\\\\w.]+\\\\.\\\\w+)");
Matcher me = email.matcher("lien he: an.nguyen@fpt.edu.vn hoac binh@gmail.com");
while (me.find()) {
    me.group("mien");
}
\`\`\`

\`\`\`
4) cac ten mien -> [fpt.edu.vn, gmail.com]
\`\`\`

Phân biệt hai method: \`matches()\` hỏi "cả chuỗi có đúng khuôn này không", còn \`find()\` đi tìm TỪNG chỗ khớp bên trong — nên nó nằm trong \`while\`.

━━━━━━━━━━━━━━━━━━━━

✂️ THAY THẾ VÀ TÁCH

\`\`\`java
"The: 1234-5678-9012-3456"
    .replaceAll("\\\\d{4}-\\\\d{4}-\\\\d{4}", "****-****-****");
\`\`\`

\`\`\`
5) The: ****-****-****-3456
\`\`\`

Che số thẻ trong log — một dòng.

Và \`split\` mà bạn dùng từ Ngày 9 thật ra vẫn luôn nhận regex:

\`\`\`java
"a, b;c |d".split("[,;|]\\\\s*");   // [a, b, c , d]
\`\`\`

Tách bằng nhiều loại dấu cùng lúc, thứ mà \`split(",")\` không làm được.

━━━━━━━━━━━━━━━━━━━━

⚠️ HAI CÁI BẪY

**Bẫy 1 — dấu chấm khớp MỌI ký tự:**

\`\`\`java
"1x3".matches("1.3");     // true   ← không phải chỉ khớp "1.3"!
"1x3".matches("1\\\\.3");   // false  ← escape mới đúng ý
\`\`\`

\`\`\`
7) '1x3'.matches("1.3") -> true | escape \\. -> false
\`\`\`

Kiểm tra định dạng số kiểu \`"\\\\d+.\\\\d+"\` sẽ nhận cả \`"12x34"\`. Nhớ escape dấu chấm.

**Bẫy 2 — regex sai KHÔNG bị bắt lúc dịch:**

\`\`\`java
Pattern.compile("([a-z");   // ✗ PatternSyntaxException — lúc CHẠY
\`\`\`

Với trình dịch, regex chỉ là một chuỗi bình thường. Viết thiếu ngoặc thì chương trình dịch ngon lành rồi nổ trên máy khách. Luôn thử regex trước khi đưa vào code.

━━━━━━━━━━━━━━━━━━━━

⚡ HIỆU NĂNG: COMPILE MỘT LẦN

\`\`\`java
// ✗ trong vòng lặp: dịch lại mẫu ở MỖI dòng
for (String dong : trieuDong) if (dong.matches("\\\\d+")) …

// ✓ dịch một lần, dùng lại
Pattern p = Pattern.compile("\\\\d+");
for (String dong : trieuDong) if (p.matcher(dong).matches()) …
\`\`\`

\`String.matches\` gọi \`Pattern.compile\` bên trong mỗi lần. Với một triệu dòng, đó là một triệu lần dịch lại cùng một mẫu.

━━━━━━━━━━━━━━━━━━━━

🚫 ĐỪNG DÙNG REGEX CHO HTML

Regex mạnh với chuỗi có KHUÔN cố định: số điện thoại, mã sinh viên, dòng log, ngày tháng.

Nó rất tệ với cấu trúc LỒNG NHAU: HTML, JSON, XML. Những thứ đó có độ sâu tuỳ ý, và regex về bản chất không đếm được độ sâu. Dùng thư viện phân tích cú pháp cho chúng.

Cũng đừng cố viết một regex "chuẩn RFC" để kiểm email — bản đầy đủ dài vài trăm ký tự và vẫn sai. Kiểm sơ bộ \`có @ và có dấu chấm phía sau\` rồi gửi mail xác nhận là cách đúng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Kiểm mã sinh viên dạng \`HE\` + 6 chữ số.
2. Bóc ngày, giờ, mức độ từ 10 dòng log bằng nhóm đặt tên.
3. Lấy tất cả số trong một đoạn văn bằng \`find()\` trong \`while\`.
4. Che số điện thoại trong chuỗi thành \`091****678\` bằng \`replaceAll\`.
5. Viết \`"1.5".matches("\\\\d+.\\\\d+")\` rồi thử với \`"1x5"\` — giải thích kết quả.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Regex mô tả HÌNH DẠNG của chuỗi. Sáu ký hiệu đủ dùng phần lớn, nhóm \`( )\` để bóc dữ liệu, \`matches\` cho cả chuỗi và \`find\` cho từng chỗ. Nhớ escape dấu chấm, compile một lần, và đừng đụng vào HTML.

Nhưng để ý một chuyện: cả tuần nay ta ghép chuỗi bằng dấu \`+\` ở khắp nơi.

\`\`\`java
String s = "";
for (int i = 0; i < 100000; i++) s += i;   // chuyện gì xảy ra ở đây?
\`\`\`

Nhớ Ngày 9 chứ — \`String\` là BẤT BIẾN. Mỗi dấu \`+\` tạo ra một chuỗi mới, chép lại toàn bộ nội dung cũ. Một trăm nghìn vòng lặp là một trăm nghìn lần chép.

Ngày 36: \`StringBuilder\`, \`String.format\`, text block — và một phép đo thời gian thật cho thấy khoảng cách giữa hai cách viết lớn tới mức nào. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
