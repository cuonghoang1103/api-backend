/** "100 Ngày Java với CuongThai" — Ngày 2. */
export default {
  day: 2,
  card: 'java-day-02',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'temperature-converter-with-data-type-exploration',
    title: 'Bộ đổi nhiệt độ — khám phá kiểu dữ liệu',
  },

  content: `📦 100 NGÀY JAVA — NGÀY 2: BIẾN & KIỂU DỮ LIỆU

Hôm qua ta cho máy in ra một câu. Hôm nay ta cho nó NHỚ. Biến là cái hộp có tên, và điều làm nhiều người mới khó chịu ở Java là: mở hộp ra phải nói rõ hộp này đựng gì. Python cho bạn viết \`x = 5\` rồi đổi thành \`x = "năm"\` — Java thì không. Cuối bài bạn sẽ thấy vì sao cái "phiền" đó lại là thứ cứu bạn.

━━━━━━━━━━━━━━━━━━━━

📌 KHAI BÁO: ĐẶT TÊN + CHỌN HỘP

\`\`\`java
int     tuoi  = 20;     // số nguyên
double  diem  = 8.5;    // số thực
boolean dauKy = true;   // đúng / sai
char    hang  = 'A';    // MỘT ký tự, nháy ĐƠN
String  ten   = "An";   // chuỗi, nháy KÉP
\`\`\`

• Java là ngôn ngữ KIỂU TĨNH: kiểu được chốt lúc khai báo và không đổi được. Gán \`tuoi = "hai mươi"\` là lỗi ngay lúc dịch — chương trình còn chưa chạy.
• \`char\` dùng nháy ĐƠN, \`String\` dùng nháy KÉP. Đây là hai kiểu khác nhau chứ không phải hai cách viết.
• Quy ước tên biến: camelCase, bắt đầu bằng chữ thường — \`diemTrungBinh\`, không phải \`DiemTrungBinh\` hay \`diem_trung_binh\`.

━━━━━━━━━━━━━━━━━━━━

🔢 TÁM KIỂU NGUYÊN THUỶ

\`\`\`
byte    1 byte   -128 .. 127
short   2 byte   -32.768 .. 32.767
int     4 byte   ±2,1 tỉ           ← MẶC ĐỊNH cho số nguyên
long    8 byte   ±9,2 tỉ tỉ        ← hậu tố L: 10000000000L
float   4 byte   ~7 chữ số         ← hậu tố f: 3.14f
double  8 byte   ~15 chữ số        ← MẶC ĐỊNH cho số thực
char    2 byte   một ký tự Unicode
boolean          true / false
\`\`\`

Đừng cố học thuộc bảng này. Thực tế 90% thời gian bạn chỉ dùng \`int\`, \`double\`, \`boolean\` và \`String\`. Chỉ nhớ hai mốc: quá 2,1 tỉ thì đổi sang \`long\`, và số thực thì mặc định là \`double\`.

Hai hậu tố hay quên: \`long x = 10000000000;\` báo lỗi vì Java coi con số bên phải là \`int\` trước đã — phải viết \`10000000000L\`. Tương tự \`float f = 3.14;\` cũng lỗi, phải là \`3.14f\`.

━━━━━━━━━━━━━━━━━━━━

🔤 char THỰC RA LÀ MỘT CON SỐ

\`\`\`java
char hang = 'A';
System.out.println((int) hang);      // 65 — mã Unicode
char sau = (char) (hang + 1);        // 'B'
\`\`\`

Bên dưới, \`char\` chỉ là một số nguyên 2 byte. Đó là lý do bạn cộng trừ được với nó, và là nền của mọi bài xử lý ký tự sau này: đổi hoa thành thường, kiểm tra chữ số, mã hoá Caesar…

━━━━━━━━━━━━━━━━━━━━

🔒 final — KHOÁ GIÁ TRỊ LẠI

\`\`\`java
final double PI = 3.14159;
// PI = 3.14;   ✗ lỗi lúc DỊCH, không đợi tới lúc chạy
\`\`\`

Quy ước đặt tên hằng: VIẾT_HOA_CÓ_GẠCH_DƯỚI. Dùng \`final\` cho mọi thứ đáng lẽ không được đổi — thuế suất, số ngày trong tuần, tên file cấu hình. Nó biến một loại bug thành lỗi biên dịch.

Java 10 trở đi còn có \`var\`:

\`\`\`java
var tuoi = 20;        // Java tự suy ra là int
var ten = "An";       // tự suy ra là String
// var x;             ✗ không có giá trị thì không suy được
\`\`\`

Lưu ý: \`var\` KHÔNG biến Java thành ngôn ngữ kiểu động. Kiểu vẫn được chốt lúc dịch, chỉ là bạn khỏi gõ ra thôi.

━━━━━━━━━━━━━━━━━━━━

🤔 VÌ SAO PHẢI KHAI KIỂU?

Vì nó chuyển lỗi từ 3 giờ sáng về lúc bạn đang gõ. Trong ngôn ngữ kiểu động, \`tuoi + " tuoi"\` chạy ngon lành cho tới khi ai đó truyền vào một giá trị lạ và hệ thống nổ giữa lúc có khách. Java bắt bạn nói trước, đổi lại nó bắt lỗi trước.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Khai báo đủ 8 kiểu nguyên thuỷ, in từng cái ra kèm nhận xét.
2. Thử \`long x = 10000000000;\` rồi đọc lỗi. Sửa bằng hậu tố \`L\`.
3. In ra mã số của \`'a'\` và \`'A'\`, tính hiệu hai số đó — con số này giải thích cách đổi hoa/thường.
4. Khai một hằng \`final\` rồi thử gán lại — xem lỗi xuất hiện ở bước dịch hay bước chạy.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Biến là hộp có tên và có kiểu. Kiểu tĩnh là cái giá bạn trả bằng vài chữ khi gõ, để đổi lấy việc trình biên dịch bắt lỗi giùm. \`final\` khoá thứ không nên đổi, \`var\` cho bạn gõ ít hơn mà vẫn giữ nguyên độ an toàn.

Ngày 3 ta đụng toán tử — và câu hỏi làm nhiều người sốc: vì sao \`7 / 2\` trong Java lại bằng \`3\`? Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
