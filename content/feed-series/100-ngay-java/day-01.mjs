/**
 * "100 Ngày Java với CuongThai" — Ngày 1.
 *
 * Bài đăng feed = BÀI VIẾT + ẢNH THẺ. Ảnh dựng từ
 * content/lesson-cards/java-day-01.mjs; bài viết nằm ngay dưới đây.
 *
 *   node scripts/java-series-seed.mjs --file ./content/feed-series/100-ngay-java/day-01.mjs
 *   node scripts/java-series-seed.mjs --file ... --apply
 *
 * Mỗi ngày mới chỉ cần thêm MỘT file như thế này (+ một file thẻ tương ứng).
 */
export default {
  day: 1,
  card: 'java-day-01',          // file trong content/lesson-cards/
  category: 'Java',             // pill trên feed — script tự tạo nếu chưa có
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],

  content: `🚀 100 NGÀY JAVA VỚI CUONGTHAI — NGÀY 1: HELLO, JAVA!

Chào mừng đến ngày đầu tiên của hành trình 100 ngày! Trước khi viết dòng code nào, phải trả lời một câu mà rất nhiều người học Java vài tháng vẫn ấp úng: khi bạn gõ "java HelloJava", thứ gì thực sự đang chạy? Hôm nay ta đi từ một file văn bản thuần cho tới lúc máy in ra chữ — và hiểu từng mắt xích ở giữa.

━━━━━━━━━━━━━━━━━━━━

📌 CHƯƠNG TRÌNH ĐẦU TIÊN

Java bắt buộc mọi thứ phải nằm trong một class, kể cả chương trình nhỏ nhất:

\`\`\`java
// HelloJava.java
public class HelloJava {
    public static void main(String[] args) {
        System.out.println("Xin chao, Java!");
    }
}
\`\`\`

• Tên file BẮT BUỘC trùng tên class public — \`HelloJava.java\`. Đặt sai tên là javac từ chối dịch, đây là luật của ngôn ngữ chứ không phải quy ước cho đẹp.
• \`main\` là cửa vào duy nhất, và chữ ký phải đúng y hệt: \`public static void main(String[] args)\`. Sai một chữ — viết \`Main\`, bỏ \`static\`, đổi \`String[]\` thành \`String\` — thì file vẫn dịch được nhưng JVM báo "Main method not found".
• \`System.out.println\` in ra rồi xuống dòng. Muốn in mà không xuống dòng thì dùng \`print\`.

━━━━━━━━━━━━━━━━━━━━

⚙️ HAI BƯỚC: DỊCH RỒI MỚI CHẠY

Khác Python hay JavaScript chạy thẳng từ mã nguồn, Java luôn có hai nhịp:

\`\`\`bash
javac HelloJava.java    # bước 1 — sinh ra HelloJava.class
java  HelloJava         # bước 2 — chạy, KHÔNG có đuôi .class
\`\`\`

Cái bẫy đầu tiên của gần như mọi người mới: gõ \`java HelloJava.class\`. Sai. Lệnh \`javac\` nhận TÊN FILE, còn \`java\` nhận TÊN CLASS. Thêm đuôi \`.class\` là Java đi tìm một class tên "HelloJava.class" và không thấy.

━━━━━━━━━━━━━━━━━━━━

🌍 "VIẾT MỘT LẦN, CHẠY MỌI NƠI" NẰM Ở ĐÂU?

Câu khẩu hiệu này ai cũng thuộc nhưng ít người chỉ đúng được chỗ:

\`\`\`
HelloJava.java  ──javac──▶  HelloJava.class  ──java──▶  máy bạn
   mã nguồn                    BYTECODE                JVM dịch tiếp
                        (giống nhau ở MỌI máy)      sang mã máy tại chỗ
\`\`\`

\`javac\` KHÔNG dịch ra mã máy. Nó dịch ra bytecode — một thứ ngôn ngữ trung gian mà không CPU nào hiểu trực tiếp. Muốn xem tận mắt thì gõ \`javap -c HelloJava\`:

\`\`\`
0: getstatic     #7    // Field java/lang/System.out
3: ldc           #13   // String Xin chao, Java!
5: invokevirtual #15   // Method println
\`\`\`

Đó là bytecode thật lấy ra từ file \`.class\` vừa dịch. Chính vì bytecode giống hệt nhau ở mọi nơi mà một file \`.class\` build trên macOS chạy được trên máy chủ Linux — JVM ở mỗi nền tảng lo phần dịch nốt sang mã máy. Cái "chạy mọi nơi" nằm ở BYTECODE, không nằm ở mã nguồn.

━━━━━━━━━━━━━━━━━━━━

📦 JDK ⊃ JRE ⊃ JVM — BA THỨ HAY BỊ LẪN

• JVM (Java Virtual Machine) — máy ảo, thứ thực sự nạp và chạy bytecode.
• JRE (Java Runtime Environment) = JVM + thư viện chuẩn. Đủ để CHẠY một chương trình Java, không đủ để viết.
• JDK (Java Development Kit) = JRE + \`javac\` + \`javap\`, \`jshell\`… Đây là thứ bạn cần cài.

Nhớ một câu: cài JDK, đừng cài JRE. Kiểm bằng \`java -version\` và \`javac -version\` — nếu lệnh thứ hai báo "command not found" thì bạn mới có JRE.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`HelloJava.java\` in ra tên bạn, dịch và chạy bằng đúng hai lệnh trên.
2. Cố tình đổi tên file thành \`Hello.java\` (giữ nguyên \`public class HelloJava\`) rồi chạy \`javac\` — đọc kỹ thông báo lỗi, nó nói đúng luật vừa học.
3. Đổi \`main\` thành \`Main\` rồi chạy lại — lần này javac im lặng, nhưng \`java\` mới báo lỗi. Giải thích tại sao lỗi xuất hiện ở bước hai chứ không phải bước một.
4. Chạy \`javap -c HelloJava\` và tìm dòng có chuỗi bạn vừa in.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Hôm nay bạn đã có đủ ba mảnh: một file mã nguồn phải trùng tên class, hai lệnh \`javac\` rồi \`java\`, và bytecode — lớp trung gian làm nên câu "viết một lần, chạy mọi nơi". Mọi bài sau đều đứng trên ba mảnh này.

Ngày 2 ta học biến và kiểu dữ liệu: chỗ chứa dữ liệu đầu tiên, và vì sao Java bắt bạn khai báo kiểu trong khi nhiều ngôn ngữ khác thì không. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
