/** "100 Ngày Java với CuongThai" — Ngày 3. */
export default {
  day: 3,
  card: 'java-day-03',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-mixed-operations-calculator',
    title: 'Máy tính đa phép — luyện toán tử & ép kiểu',
  },

  content: `⚠️ 100 NGÀY JAVA — NGÀY 3: TOÁN TỬ & ÉP KIỂU

Hôm nay là bài nhiều bẫy nhất trong Giai đoạn 1. Ba câu hỏi để mở đầu, thử trả lời trước khi đọc tiếp:

• \`7 / 2\` bằng bao nhiêu?
• \`Integer.MAX_VALUE + 1\` bằng bao nhiêu?
• \`0.1 + 0.2\` có bằng \`0.3\` không?

Nếu bạn trả lời 3.5, tràn-thì-báo-lỗi, và có — thì bài hôm nay dành cho bạn.

━━━━━━━━━━━━━━━━━━━━

📌 BẪY SỐ MỘT: CHIA HAI SỐ NGUYÊN

\`\`\`java
7 / 2         → 3      // int ÷ int = int → CẮT phần thập phân
7 / 2.0       → 3.5    // có một double thì kết quả là double
(double) 7 / 2 → 3.5   // ép một vế trước khi chia
7 % 2         → 1      // phần dư
\`\`\`

Chú ý: \`7 / 2\` KHÔNG làm tròn thành 4 — nó CẮT bỏ phần thập phân. Đây là lỗi số một của người mới, và nó đặc biệt độc vì kết quả 3 trông vẫn "hợp lý", không hề báo lỗi.

Cái bẫy con: \`double tb = tong / soLuong;\` với cả hai đều là \`int\` thì phép chia đã cắt xong rồi mới gán vào \`double\`. Kết quả \`8.0\` thay vì \`8.5\`. Phải viết \`(double) tong / soLuong\`.

━━━━━━━━━━━━━━━━━━━━

💥 TRÀN SỐ — ÂM THẦM, KHÔNG BÁO LỖI

\`\`\`java
int max = Integer.MAX_VALUE;   // 2.147.483.647
System.out.println(max + 1);   // -2147483648  ← quay vòng sang âm!
\`\`\`

Java KHÔNG ném lỗi khi tràn số nguyên. Nó lặng lẽ quay vòng, và chương trình vẫn chạy tiếp với con số sai. Đây là loại bug đắt nhất: không có ngoại lệ, không có log, chỉ có một con số vô lý xuất hiện ở đâu đó.

Khi nào cần \`long\`: đếm tiền (đơn vị đồng), mili-giây từ 1970, lượt xem, ID tự tăng của bảng lớn. Quy tắc thô: bất cứ thứ gì có thể vượt 2 tỉ.

━━━━━━━━━━━━━━━━━━━━

🎯 double KHÔNG CHÍNH XÁC TUYỆT ĐỐI

\`\`\`java
System.out.println(0.1 + 0.2);   // 0.30000000000000004
\`\`\`

Không phải lỗi của Java — mọi ngôn ngữ dùng số thực nhị phân đều vậy. Số \`0.1\` trong hệ nhị phân là số vô hạn tuần hoàn, giống \`1/3\` trong hệ thập phân. Máy phải cắt bớt, và sai số hiện ra.

Hai hệ quả thực tế:

\`\`\`java
if (a == b)                        // ✗ với số thực, gần như không bao giờ đúng
if (Math.abs(a - b) < 1e-9)        // ✓ so trong một sai số cho phép
\`\`\`

Và tiền bạc thì TUYỆT ĐỐI không dùng \`double\`. Dùng \`BigDecimal\`, hoặc lưu số nguyên theo đơn vị nhỏ nhất (đồng, xu). Một sai số 0.0000001 nhân với một triệu giao dịch là một con số có thật trên báo cáo.

━━━━━━━━━━━━━━━━━━━━

🔄 ÉP KIỂU: RỘNG TỰ ĐỘNG, HẸP PHẢI XIN

\`\`\`java
int i = 10;
double d = i;            // ✓ tự động — int lọt vừa trong double

double x = 9.99;
int back = (int) x;      // 9 — CẮT, không làm tròn
// int y = 9.99;         ✗ lỗi dịch: possible lossy conversion
\`\`\`

Java cho ép rộng tự động vì không mất gì, nhưng ép hẹp thì bắt bạn viết \`(int)\` ra — như một chữ ký xác nhận "tôi biết mình đang vứt bớt dữ liệu".

Muốn LÀM TRÒN chứ không cắt thì dùng \`Math.round(9.99)\` → 10.

━━━━━━━━━━━━━━━━━━━━

⚡ ++ ĐẶT TRƯỚC HAY SAU

\`\`\`java
int a = 5;
System.out.println(a++);   // in 5, RỒI mới tăng → a = 6
int b = 5;
System.out.println(++b);   // tăng TRƯỚC rồi in → 6
\`\`\`

Trong vòng lặp thì \`i++\` và \`++i\` như nhau. Nhưng nhét vào giữa một biểu thức thì khác nhau, và đó là lúc code trở nên khó đọc — lời khuyên: tách ra dòng riêng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tính điểm trung bình từ \`int tong = 17, soMon = 2;\` sao cho ra đúng 8.5.
2. In \`Integer.MAX_VALUE + 1\`, rồi đổi sang \`long\` và làm lại — quan sát khác biệt.
3. Viết hàm so sánh hai \`double\` an toàn với sai số \`1e-9\`.
4. Đổi 250 phút thành "4 giờ 10 phút" chỉ bằng \`/\` và \`%\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Bốn điều mang theo cả đời: \`int/int\` cắt chứ không làm tròn, tràn số không báo lỗi, \`double\` chỉ là xấp xỉ, và ép kiểu hẹp phải xin phép. Ba trong bốn thứ này gây bug mà chương trình vẫn chạy bình thường — nên phải nhớ bằng đầu, không thể trông vào trình biên dịch.

Ngày 4 ta cho chương trình nói chuyện với người dùng: \`Scanner\`, \`printf\`, và một cái bẫy khiến \`nextLine()\` bỏ qua không cho bạn gõ. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
