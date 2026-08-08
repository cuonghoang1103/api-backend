/** "100 Ngày Java với CuongThai" — Ngày 7. */
export default {
  day: 7,
  card: 'java-day-07',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'prime-spiral-pattern-generator',
    title: 'Vẽ xoắn ốc số nguyên tố — luyện vòng lặp lồng nhau',
  },

  content: `⏭️ 100 NGÀY JAVA — NGÀY 7: break · continue · LỒNG NHAU

Hôm qua vòng lặp chạy đủ số vòng đã định. Hôm nay ta cho nó quyền dừng sớm và quyền bỏ lượt — cộng một hiểu nhầm mà rất nhiều người mang theo nhiều năm: \`break\` KHÔNG thoát hết vòng lặp lồng nhau.

━━━━━━━━━━━━━━━━━━━━

📌 break THOÁT · continue BỎ LƯỢT

\`\`\`java
for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;   // bỏ lượt này, sang i tiếp theo
    if (i == 5) break;      // thoát HẲN vòng lặp
    System.out.print(i + " ");
}
// in ra: 1 2 4
\`\`\`

\`continue\` nhảy thẳng tới BƯỚC NHẢY của \`for\`. Trong \`while\` thì phải cẩn thận:

\`\`\`java
int i = 0;
while (i < 5) {
    if (i == 2) continue;   // ✗ TREO — i không bao giờ tăng nữa
    i++;
}
\`\`\`

Trong \`while\`, phải tăng biến TRƯỚC khi \`continue\`, hoặc dùng \`for\`.

━━━━━━━━━━━━━━━━━━━━

🪆 break CHỈ THOÁT MỘT TẦNG

\`\`\`java
for (int i = 1; i <= 3; i++)
    for (int j = 1; j <= 3; j++) {
        if (i * j > 4) break;   // ✗ chỉ thoát vòng j — vòng i vẫn chạy tiếp
    }
\`\`\`

Đây là hiểu nhầm phổ biến nhất về vòng lặp lồng. \`break\` thoát đúng MỘT tầng — tầng gần nó nhất. Vòng ngoài vẫn tiếp tục như chưa có gì xảy ra.

Cách người mới hay chữa là dựng biến cờ:

\`\`\`java
boolean found = false;
for (int i = 1; i <= 3 && !found; i++)
    for (int j = 1; j <= 3; j++)
        if (dieuKien) { found = true; break; }
\`\`\`

Chạy được, nhưng lồng ba tầng thì thành ba biến cờ và code khó đọc hẳn.

━━━━━━━━━━━━━━━━━━━━

🏷️ NHÃN — THOÁT NHIỀU TẦNG MỘT PHÁT

\`\`\`java
outer:
for (int i = 1; i <= 3; i++)
    for (int j = 1; j <= 3; j++) {
        if (i * j > 4) break outer;   // ✓ thoát CẢ HAI vòng
        System.out.print(i + "x" + j + "=" + (i * j) + " ");
    }
// in ra: 1x1=1 1x2=2 1x3=3 2x1=2 2x2=4
\`\`\`

Nhãn là một cái tên đặt ngay trước vòng lặp, kết thúc bằng dấu hai chấm. \`break outer\` và \`continue outer\` đều dùng được.

Nhưng dùng ÍT thôi. Lồng quá hai tầng mà cần nhãn thường là dấu hiệu nên tách thân vòng trong thành một method riêng — lúc đó \`return\` thay được nhãn và code đọc dễ hơn hẳn.

━━━━━━━━━━━━━━━━━━━━

⏱️ LỒNG NHAU LÀ NHÂN LÊN

\`\`\`
for i in 1..n
    for j in 1..n        →  n × n = n² lượt

n = 1.000    →         1.000.000 lượt   (chớp mắt)
n = 100.000  →  10.000.000.000 lượt     (hàng phút)
\`\`\`

Thêm một tầng lồng là NHÂN khối lượng công việc, không phải cộng. Đây là lần đầu bạn chạm vào khái niệm độ phức tạp — thứ sẽ quay lại suốt phần thuật toán về sau.

Ví dụ thật: tìm cặp trùng nhau trong danh sách 100.000 phần tử. Cách lồng hai vòng mất hàng phút; dùng \`HashSet\` (học ở phần Collections) mất chưa tới một giây. Cùng một bài toán, khác cách nghĩ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. In các số 1..20, bỏ qua bội của 3, dừng khi gặp số đầu tiên lớn hơn 15.
2. Tìm cặp \`(i, j)\` đầu tiên trong 1..10 có \`i * j == 24\` rồi thoát cả hai vòng — làm bằng cả hai cách: biến cờ và nhãn.
3. In tam giác sao 5 dòng bằng vòng lặp lồng.
4. Đếm số lượt lặp thực tế của một vòng lồng \`n = 1.000\` bằng một biến đếm — so với \`n²\` bạn tính tay.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`break\` thoát một tầng, \`continue\` bỏ một lượt, nhãn thoát nhiều tầng. Và bài học lớn nhất hôm nay không phải cú pháp mà là trực giác về chi phí: mỗi tầng lồng thêm là một phép nhân.

Ngày 8 ta gặp mảng — chứa nhiều giá trị dưới một cái tên, và cũng là lần đầu bạn chạm vào THAM CHIẾU, nền móng của toàn bộ OOP sắp tới. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
