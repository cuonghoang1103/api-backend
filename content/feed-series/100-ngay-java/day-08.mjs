/** "100 Ngày Java với CuongThai" — Ngày 8. Bài Ngày 11 (OOP) trỏ ngược về đây. */
export default {
  day: 8,
  card: 'java-day-08',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'lab211',
    slug: 'lab211-j1-s-p0001-bubble-sort-algorithm',
    title: 'Sắp xếp nổi bọt trên mảng một chiều',
  },

  content: `📊 100 NGÀY JAVA — NGÀY 8: MẢNG

Bảy ngày qua mỗi biến giữ đúng một giá trị. Muốn lưu điểm của 30 sinh viên thì khai 30 biến? Không. Hôm nay ta có mảng — và quan trọng hơn cú pháp, đây là lần đầu bạn chạm vào THAM CHIẾU, thứ nằm dưới toàn bộ OOP sắp tới.

━━━━━━━━━━━━━━━━━━━━

📌 KHAI BÁO & GIÁ TRỊ MẶC ĐỊNH

\`\`\`java
int[] diem = new int[3];        // [0, 0, 0]      — số về 0
boolean[] co = new boolean[2];  // [false, false]
String[] ten = new String[2];   // [null, null]   — tham chiếu về null

int[] a = {5, 2, 9};            // khai kèm giá trị luôn

a.length    // 3   ← THUỘC TÍNH, không có ngoặc
a[0]        // 5   ← đếm từ 0
\`\`\`

Hai chi tiết dễ vấp:

• \`a.length\` KHÔNG có ngoặc. Chỉ \`String\` mới có \`length()\` có ngoặc. Nhớ: mảng là thuộc tính, chuỗi là method.
• Mảng CÓ giá trị mặc định, khác hẳn biến local phải gán mới dùng được. Nhớ điều này — Ngày 11 field của class cũng có mặc định vì cùng một lý do.

━━━━━━━━━━━━━━━━━━━━

🔗 MẢNG LÀ THAM CHIẾU — PHẦN QUAN TRỌNG NHẤT HÔM NAY

\`\`\`java
int[] a = {5, 2, 9};
int[] b = a;          // KHÔNG copy — chỉ thêm một cái TÊN cho cùng mảng
b[0] = 99;
System.out.println(a[0]);   // 99  ← a cũng đổi!
\`\`\`

Biến mảng không chứa mảng. Nó chứa ĐỊA CHỈ tới mảng nằm trên heap. Gán \`b = a\` là copy cái địa chỉ, không phải copy dữ liệu — hai cái tên, một mảng.

Muốn copy thật:

\`\`\`java
int[] c = a.clone();                       // ✓ mảng mới
int[] d = Arrays.copyOf(a, a.length);      // ✓ cách khác
\`\`\`

Đây chính xác là cơ chế sẽ quay lại ở Ngày 11 với đối tượng: \`SinhVien x = an;\` cũng chỉ là thêm tên, không đúc thêm bánh. Hiểu chắc hôm nay là ngày đó nhẹ hẳn.

━━━━━━━━━━━━━━━━━━━━

💥 VƯỢT CHỈ SỐ — LỖI LÚC CHẠY

\`\`\`java
int[] a = new int[3];   // chỉ số hợp lệ: 0, 1, 2
a[3] = 10;              // 💥 ArrayIndexOutOfBoundsException

for (int i = 0; i <= a.length; i++)   // ✗ dấu = thừa → vượt một ô
for (int i = 0; i <  a.length; i++)   // ✓
\`\`\`

Java kiểm chỉ số ở mỗi lần truy cập và ném lỗi ngay. Nghe như phiền, nhưng so với C — nơi \`a[3]\` lặng lẽ ghi đè lên ô nhớ của biến khác rồi để bạn đi tìm bug ba ngày — thì đây là món quà.

━━━━━━━━━━━━━━━━━━━━

🧰 MẢNG HAI CHIỀU & LỚP Arrays

\`\`\`java
int[][] bang = new int[2][3];       // 2 hàng, 3 cột
bang[0][2] = 7;
bang.length      // 2 — số hàng
bang[0].length   // 3 — số cột của hàng 0

import java.util.Arrays;
Arrays.toString(a)     // "[5, 2, 9]"
Arrays.sort(a);        // sắp xếp TẠI CHỖ, đổi luôn mảng gốc
Arrays.fill(a, 1);     // đổ đầy giá trị
\`\`\`

Và một điều phải nhớ:

\`\`\`java
System.out.println(a);   // ✗ [I@1b6d3586 — địa chỉ, không phải nội dung
System.out.println(Arrays.toString(a));   // ✓
\`\`\`

In thẳng mảng ra chuỗi rác chính là bằng chứng trực quan nhất cho câu "biến mảng chứa địa chỉ".

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Nhập 5 số vào mảng, in ra tổng, trung bình, lớn nhất, nhỏ nhất.
2. Viết \`int[] b = a;\` rồi sửa \`b\`, in \`a\` — vẽ lại bằng hình stack/heap để giải thích.
3. Làm lại bài 2 với \`a.clone()\` và so sánh kết quả.
4. Đảo ngược một mảng tại chỗ, không dùng mảng phụ.
5. Cố tình viết \`i <= a.length\` rồi đọc kỹ thông báo ngoại lệ.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`.length\` không ngoặc, đếm từ 0, và điều quan trọng nhất: gán mảng là thêm tên chứ không phải nhân bản. Cái nhìn "biến giữ địa chỉ, dữ liệu nằm trên heap" là nền của mọi thứ từ đây tới hết khoá.

Ngày 9 ta gặp \`String\` — kiểu dùng nhiều nhất Java, và là nơi \`==\` sẽ lừa bạn một cách rất ngọt ngào. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
