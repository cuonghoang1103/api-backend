/** "100 Ngày Java với CuongThai" — Ngày 5. */
export default {
  day: 5,
  card: 'java-day-05',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'number-classification-and-prime-factorization-system',
    title: 'Phân loại số & phân tích thừa số — luyện rẽ nhánh',
  },

  content: `🔀 100 NGÀY JAVA — NGÀY 5: if · else · switch

Bốn ngày qua chương trình chạy một mạch từ trên xuống. Hôm nay nó biết chọn đường — và cùng với khả năng đó là ba cái bẫy khiến code SAI mà vẫn chạy ngon lành, không một dòng báo lỗi.

━━━━━━━━━━━━━━━━━━━━

📌 if — else if — else

\`\`\`java
static String xepLoai(double diem) {
    if (diem >= 8.5)      return "Gioi";
    else if (diem >= 7.0) return "Kha";
    else if (diem >= 5.0) return "Trung binh";
    else                  return "Yeu";
}
\`\`\`

Chuỗi \`else if\` dừng ở nhánh ĐÚNG ĐẦU TIÊN. Nên THỨ TỰ quyết định kết quả:

\`\`\`java
if (diem >= 5.0)      return "Trung binh";   // ✗ đặt trước
else if (diem >= 8.5) return "Gioi";          // không bao giờ chạm tới
\`\`\`

Học sinh 9.0 sẽ rơi vào nhánh đầu và bị xếp Trung bình. Chương trình không sai cú pháp, chỉ sai logic — loại bug tốn nhiều thời gian nhất.

Quy tắc: xếp điều kiện từ CHẶT tới LỎNG.

━━━━━━━━━━━━━━━━━━━━

🪤 BA CÁI BẪY ĐIỀU KIỆN

\`\`\`java
if (a = 5)          // ✗ gán chứ không so — Java báo lỗi, C thì không
if (s == "Java")    // ✗ so ĐỊA CHỈ chứ không so nội dung → Ngày 9
if (x > 0);         // ✗ dấu ; nuốt mất thân if
    lam();          //   dòng này LUÔN chạy, bất kể x
\`\`\`

Bẫy 1 Java cứu bạn: \`if (a = 5)\` không dịch được vì \`a = 5\` cho ra \`int\` chứ không phải \`boolean\`. Nhưng \`if (b = true)\` với \`b\` là \`boolean\` thì LỌT — cẩn thận.

Bẫy 2 là kinh điển nhất Java, để dành hẳn Ngày 9. Tóm tắt: so chuỗi luôn dùng \`.equals()\`.

Bẫy 3 im lặng nhất. Cách phòng: LUÔN viết \`{ }\` kể cả thân chỉ có một dòng.

━━━━━━━━━━━━━━━━━━━━

➡️ switch KIỂU MŨI TÊN (Java 14+)

\`\`\`java
String ten = switch (thu) {
    case 2 -> "Thu hai";
    case 3 -> "Thu ba";
    case 7, 8 -> "Cuoi tuan";       // gộp nhiều case
    default -> "Khong ro";
};
\`\`\`

Kiểu \`->\` này KHÔNG rơi tầng và trả thẳng giá trị — quên \`break\` không còn là lỗi được nữa vì không còn \`break\`.

Kiểu cũ vẫn chạy nhưng nguy hiểm hơn:

\`\`\`java
switch (thu) {
    case 2: System.out.println("Thu hai");   // ✗ thiếu break
    case 3: System.out.println("Thu ba");    //   → in CẢ HAI dòng
        break;
}
\`\`\`

Với code mới, cứ dùng kiểu mũi tên.

━━━━━━━━━━━━━━━━━━━━

⚡ BA NGÔI & NGẮN MẠCH

\`\`\`java
String kq = (diem >= 5) ? "Dau" : "Rot";   // if rút gọn cho phép GÁN
\`\`\`

Và một chi tiết cứu bạn khỏi \`NullPointerException\`:

\`\`\`java
if (s != null && s.length() > 0)   // ✓ && ngắn mạch: null thì dừng ngay
if (s.length() > 0 && s != null)   // ✗ nổ trước khi kịp kiểm null
\`\`\`

\`&&\` chỉ chạy vế phải khi vế trái đúng; \`||\` chỉ chạy vế phải khi vế trái sai. Nên phép kiểm null luôn đặt TRƯỚC.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết hàm xếp loại điểm, rồi cố tình đảo thứ tự điều kiện để tự thấy bug.
2. Viết \`switch\` đổi số 1-7 thành tên thứ, dùng kiểu mũi tên.
3. Viết hàm kiểm tra năm nhuận: chia hết 4, trừ khi chia hết 100 mà không chia hết 400.
4. Viết \`if (x > 0);\` rồi giải thích vì sao khối dưới luôn chạy.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`if\` chạy nhánh đúng đầu tiên nên thứ tự là logic chứ không phải thẩm mỹ. Luôn viết \`{ }\`. Dùng \`switch\` kiểu mũi tên. Và đặt phép kiểm null trước dấu \`&&\`.

Ngày 6 chương trình biết lặp: \`for\`, \`while\`, \`do-while\` — kèm ba cách tự treo máy mà ai cũng gặp một lần. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
