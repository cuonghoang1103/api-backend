/** "100 Ngày Java với CuongThai" — Ngày 9. Bài Ngày 11 trỏ ngược về đây (equals). */
export default {
  day: 9,
  card: 'java-day-09',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'lab211',
    slug: 'lab211-j1-s-p0067-analyze-the-user-input-string',
    title: 'Phân tích chuỗi người dùng nhập',
  },

  content: `🎭 100 NGÀY JAVA — NGÀY 9: String & equals

Hôm nay là bài có cái bẫy tinh vi nhất Giai đoạn 1. Không phải vì nó khó hiểu, mà vì nó ĐÔI KHI ĐÚNG — nên bug lọt qua mọi lần bạn thử tay, rồi nổ đúng lúc có người dùng thật.

\`\`\`java
String x = "Java";
String y = "Java";
System.out.println(x == y);   // true  ← ơ, vẫn đúng mà?
\`\`\`

━━━━━━━━━━━━━━━━━━━━

📌 == SO ĐỊA CHỈ · equals SO NỘI DUNG

\`\`\`java
String x = "Java";
String y = "Java";
String z = new String("Java");

x == y        // true    ← cùng nằm trong String pool
x == z        // FALSE   ← z là đối tượng mới, khác ô nhớ
x.equals(z)   // true    ← so nội dung ✓
\`\`\`

Vì sao \`x == y\` lại đúng? Java có String pool: những chuỗi viết thẳng trong code (\`"Java"\`) được gom lại dùng chung một ô nhớ để tiết kiệm. Nên hai biến trỏ cùng chỗ, và \`==\` đúng — một cách tình cờ.

Nhưng chuỗi từ \`new String(...)\`, từ \`Scanner\`, từ đọc file, từ nối chuỗi lúc chạy — đều là đối tượng MỚI. Lúc đó \`==\` sai. Và đó chính là lúc chương trình của bạn đã lên production.

Kết luận không có ngoại lệ: **so chuỗi luôn dùng \`.equals()\`**. Không phân biệt hoa thường thì \`.equalsIgnoreCase()\`.

━━━━━━━━━━━━━━━━━━━━

🔒 String BẤT BIẾN

\`\`\`java
String s = "  Xin chao  ";
s.trim().toUpperCase();          // ✗ tính xong rồi VỨT — s không đổi
System.out.println(s);           // "  Xin chao  "

s = s.trim().toUpperCase();      // ✓ phải GÁN LẠI
System.out.println(s);           // "XIN CHAO"
\`\`\`

Mọi method của \`String\` đều TRẢ VỀ chuỗi mới chứ không sửa chuỗi cũ. Đây là lỗi thầm lặng hay gặp: gọi \`trim()\` xong tưởng đã sạch, hoá ra không.

Hệ quả về hiệu năng:

\`\`\`java
String s = "";
for (int i = 0; i < 10000; i++) s += i;   // ✗ tạo 10.000 chuỗi rác

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) sb.append(i);
String s = sb.toString();                  // ✓ nhanh hơn hàng trăm lần
\`\`\`

Nối chuỗi trong vòng lặp thì luôn dùng \`StringBuilder\`.

━━━━━━━━━━━━━━━━━━━━

🧰 BỘ ĐỒ NGHỀ HAY DÙNG

\`\`\`java
s.length()             // độ dài — CÓ ngoặc (mảng thì không, Ngày 8)
s.charAt(0)            // ký tự tại vị trí
s.substring(0, 3)      // cắt [0, 3) — KHÔNG lấy vị trí 3
s.indexOf("a")         // vị trí đầu tiên, -1 nếu không có
s.contains("av")       // có chứa không
s.split(",")           // tách thành mảng
s.replace("a", "b")    // thay thế (trả chuỗi mới!)
s.isBlank()            // rỗng hoặc toàn khoảng trắng
\`\`\`

\`substring(0, 3)\` là NỬA MỞ: lấy vị trí 0, 1, 2 — không lấy 3. Quy ước này giống \`for (i = 0; i < n; i++)\` và giống mọi khoảng trong lập trình. Nhớ một lần, dùng cả đời.

━━━━━━━━━━━━━━━━━━━━

⚠️ null KHÔNG PHẢI CHUỖI RỖNG

\`\`\`java
String s = null;
s.length();              // 💥 NullPointerException
"".length();             // 0 — chuỗi rỗng vẫn là một chuỗi

"Java".equals(s)         // ✓ false — an toàn, không nổ
s.equals("Java")         // 💥 nổ
Objects.equals(a, b)     // ✓ chịu được null cả hai vế
\`\`\`

Mẹo dùng được ngay: đặt HẰNG CHUỖI ở bên trái \`.equals()\`. \`"admin".equals(role)\` không bao giờ nổ, còn \`role.equals("admin")\` thì có.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo \`x = "Java"\`, \`z = new String("Java")\` rồi in cả \`==\` và \`.equals()\` — giải thích bằng String pool.
2. Viết hàm kiểm tra chuỗi đối xứng (palindrome), bỏ qua hoa thường và khoảng trắng.
3. Đếm số nguyên âm trong một câu bằng \`charAt\`.
4. Nối 100.000 số bằng \`+=\` rồi bằng \`StringBuilder\`, đo thời gian bằng \`System.nanoTime()\`.
5. Viết \`s.trim()\` mà không gán lại, in ra và giải thích vì sao không đổi.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Ba điều: \`equals\` chứ không \`==\`, \`String\` bất biến nên phải gán lại, và \`null\` khác chuỗi rỗng. Cái bẫy \`==\` nguy hiểm không phải vì nó sai, mà vì nó đúng vừa đủ lâu để bạn tin.

Ngày 10 khép lại Giai đoạn 1: method — đóng gói hành vi thành khối dùng lại được, kèm sự thật gây tranh cãi nhất Java: nó LUÔN truyền theo giá trị, kể cả với đối tượng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
