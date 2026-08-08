/** "100 Ngày Java với CuongThai" — Ngày 6. */
export default {
  day: 6,
  card: 'java-day-06',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'prime-number-analyzer-with-sieve-method',
    title: 'Sàng số nguyên tố — luyện vòng lặp',
  },

  content: `🔁 100 NGÀY JAVA — NGÀY 6: VÒNG LẶP

Máy tính giỏi nhất ở việc làm đi làm lại. Hôm nay bạn học cách sai bảo nó — và ba cách khiến nó chạy mãi không dừng.

━━━━━━━━━━━━━━━━━━━━

📌 for — KHI BIẾT TRƯỚC SỐ LẦN

\`\`\`java
int tong = 0;
for (int i = 1; i <= 5; i++) tong += i;
//   ①khởi tạo  ②điều kiện  ③bước nhảy
// tong = 15
\`\`\`

Thứ tự chạy: ① một lần duy nhất → ② kiểm TRƯỚC mỗi vòng → thân → ③ SAU mỗi vòng → quay lại ②.

Biến \`i\` khai bên trong \`for\` chỉ sống trong vòng lặp. Ra ngoài dùng là lỗi dịch — và đó là điều tốt, vì nó chặn bạn vô tình dùng lại biến đếm.

━━━━━━━━━━━━━━━━━━━━

♻️ while & do-while

\`\`\`java
int n = 5, giaiThua = 1;
while (n > 1) { giaiThua *= n; n--; }    // 120 — kiểm TRƯỚC, có thể chạy 0 lần

int lan = 0;
do { lan++; } while (lan < 0);           // 1 — kiểm SAU, chạy ÍT NHẤT 1 lần
\`\`\`

Chọn cái nào:
• \`for\` khi biết trước số lần — duyệt mảng, chạy 1..n.
• \`while\` khi chưa biết — đọc tới khi hết file, lặp tới khi người dùng nhập đúng.
• \`do-while\` khi phải làm ít nhất một lần — hiện menu rồi mới hỏi có muốn thoát không.

━━━━━━━━━━━━━━━━━━━━

🪤 BA CÁCH TỰ TREO CHƯƠNG TRÌNH

\`\`\`java
while (i < 10) { System.out.println(i); }     // ✗ quên i++ → chạy mãi
for (int i = 0; i != 10; i += 3)              // ✗ 0,3,6,9,12… nhảy qua 10
for (double d = 0; d != 1.0; d += 0.1)        // ✗ số thực không bao giờ == đúng
\`\`\`

Cái thứ ba là hậu quả trực tiếp của bài Ngày 3: cộng \`0.1\` mười lần KHÔNG ra đúng \`1.0\`. Với số thực, LUÔN dùng \`<\` hoặc \`>\`, đừng bao giờ dùng \`!=\` hay \`==\`.

Mẹo cứu hộ: khi nghi ngờ, in biến điều khiển ra mỗi vòng. Ba dòng log rẻ hơn ba mươi phút đoán.

━━━━━━━━━━━━━━━━━━━━

🌿 for-each — GỌN VÀ AN TOÀN

\`\`\`java
int[] mang = {5, 2, 9};
for (int x : mang) tong += x;      // đọc từng phần tử, khỏi lo chỉ số
\`\`\`

for-each xoá sổ hoàn toàn lỗi vượt chỉ số. Nhưng nó có hai giới hạn:

\`\`\`java
for (int x : mang) x *= 2;         // ✗ chỉ đổi bản sao, mảng không hề đổi
for (int i = 0; i < mang.length; i++) mang[i] *= 2;   // ✓
\`\`\`

Cần SỬA phần tử hoặc cần biết CHỈ SỐ thì vẫn phải dùng \`for\` thường. Lý do vì sao \`x *= 2\` không ăn thua sẽ rõ hẳn ở Ngày 10, khi ta học pass-by-value.

━━━━━━━━━━━━━━━━━━━━

🧱 LỒNG VÒNG LẶP

\`\`\`java
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= 9; j++)
        System.out.printf("%3d", i * j);
    System.out.println();
}
\`\`\`

Vòng ngoài chạy 1 lần thì vòng trong chạy trọn 9 lần. Tổng 81 lượt. Quy tắc quan trọng: lồng nhau là NHÂN lên, không phải cộng — chi tiết ở Ngày 7.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tính tổng 1..100 bằng cả ba loại vòng lặp.
2. In bảng cửu chương 2..9, các cột thẳng hàng bằng \`%3d\`.
3. Viết vòng lặp yêu cầu nhập số dương, sai thì hỏi lại — dùng \`do-while\`.
4. Chạy thử \`for (double d = 0; d != 1.0; d += 0.1)\` rồi bấm Ctrl+C, giải thích bằng bài Ngày 3.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`for\` khi biết trước, \`while\` khi chưa biết, \`do-while\` khi phải làm ít nhất một lần. Với số thực đừng dùng \`!=\`. for-each gọn nhưng không sửa được phần tử.

Ngày 7 ta học thoát sớm và bỏ lượt: \`break\`, \`continue\`, và cái nhãn cứu bạn khỏi rừng biến cờ khi vòng lặp lồng nhau. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
