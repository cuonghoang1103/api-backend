/** "100 Ngày Java với CuongThai" — Ngày 4. */
export default {
  day: 4,
  card: 'java-day-04',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'create-your-first-interactive-java-program',
    title: 'Chương trình Java tương tác đầu tiên',
  },

  content: `⌨️ 100 NGÀY JAVA — NGÀY 4: NHẬP & XUẤT

Ba ngày qua chương trình của bạn nói một chiều. Hôm nay nó biết nghe. Và ngay bài đầu tiên về nhập liệu, Java đã giăng một cái bẫy mà gần như 100% người mới đều dính: chương trình bỗng nhiên BỎ QUA không cho bạn gõ tên.

━━━━━━━━━━━━━━━━━━━━

📌 Scanner — ĐỌC TỪ BÀN PHÍM

\`\`\`java
import java.util.Scanner;      // BẮT BUỘC, đặt trên đầu file

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Ten: ");
        String ten = sc.nextLine();

        System.out.print("Tuoi: ");
        int tuoi = sc.nextInt();

        System.out.println("Chao " + ten + ", " + tuoi + " tuoi");
    }
}
\`\`\`

• \`nextLine()\` đọc CẢ DÒNG, kể cả khoảng trắng.
• \`nextInt()\` / \`nextDouble()\` chỉ ngoạm đúng con số, để lại dấu xuống dòng trong hàng đợi.
• Dùng \`print\` (không \`ln\`) cho lời nhắc để con trỏ nằm ngay sau dấu hai chấm.

━━━━━━━━━━━━━━━━━━━━

🪤 CÁI BẪY KINH ĐIỂN: nextInt RỒI nextLine

\`\`\`java
int tuoi = sc.nextInt();
String ten = sc.nextLine();   // ✗ nhận CHUỖI RỖNG — không kịp gõ!
\`\`\`

Vì sao? Khi bạn gõ \`20\` rồi Enter, hàng đợi có \`20\\n\`. \`nextInt()\` lấy \`20\` và ĐỂ LẠI \`\\n\`. Ngay sau đó \`nextLine()\` thấy dấu xuống dòng đó, kết luận "dòng này rỗng, xong" và trả về chuỗi rỗng — chương trình chạy vụt qua.

Cách sửa: ăn nốt phần thừa.

\`\`\`java
int tuoi = sc.nextInt();
sc.nextLine();                // ← dòng cứu mạng
String ten = sc.nextLine();   // ✓ giờ mới đúng
\`\`\`

Nhớ quy tắc: sau MỖI \`nextInt\` / \`nextDouble\` mà tiếp theo là \`nextLine\`, chèn một \`sc.nextLine()\`.

━━━━━━━━━━━━━━━━━━━━

🖨️ printf — IN CÓ ĐỊNH DẠNG

\`\`\`java
System.out.printf("%s, %d tuoi, diem %.2f%n", ten, tuoi, diem);
//                 ^chuỗi ^nguyên      ^2 số lẻ        ^xuống dòng

System.out.printf("|%-8s|%8s|%n", "trai", "phai");
// |trai    |    phai|      ← %-8s căn trái, %8s căn phải
\`\`\`

Bốn ký hiệu đủ dùng 95% trường hợp: \`%s\` chuỗi, \`%d\` số nguyên, \`%.2f\` số thực 2 chữ số lẻ, \`%n\` xuống dòng.

Dùng \`%n\` thay \`\\n\`: nó tự chọn đúng kiểu xuống dòng cho từng hệ điều hành. Chi tiết nhỏ, nhưng là thứ phân biệt code chạy được với code chạy đúng ở mọi nơi.

━━━━━━━━━━━━━━━━━━━━

➕ DẤU + LÚC NỐI, LÚC CỘNG

\`\`\`java
System.out.println("1 + 2 = " + 1 + 2);     // 1 + 2 = 12   ✗
System.out.println("1 + 2 = " + (1 + 2));   // 1 + 2 = 3    ✓
\`\`\`

Java đọc từ trái sang phải. Gặp \`String + int\` là nó chuyển sang chế độ NỐI CHUỖI, và từ đó về sau mọi dấu \`+\` đều là nối. Nên \`"..." + 1\` ra \`"...1"\`, rồi \`"...1" + 2\` ra \`"...12"\`.

Quy tắc cho khỏi phải suy nghĩ: cứ đóng ngoặc mọi phép tính khi nối vào chuỗi.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết chương trình hỏi tên, tuổi, điểm rồi in lại bằng \`printf\` với điểm 2 chữ số thập phân.
2. Cố tình bỏ dòng \`sc.nextLine()\` cứu mạng — chạy và quan sát chương trình bỏ qua phần nhập tên.
3. In bảng cửu chương 5 với các cột thẳng hàng bằng \`%3d\`.
4. Giải thích vì sao \`"Tong: " + 1 + 2\` khác \`"Tong: " + (1 + 2)\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`Scanner\` để nghe, \`printf\` để nói cho gọn gàng. Hai thứ phải nhớ bằng đầu vì trình biên dịch không cứu được: chèn \`nextLine()\` sau \`nextInt()\`, và đóng ngoặc phép tính khi nối chuỗi.

Ngày 5 chương trình bắt đầu biết ra quyết định: \`if\`, \`else\`, \`switch\` — và ba cái bẫy điều kiện khiến code chạy sai mà không báo lỗi. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
