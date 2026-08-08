/** "100 Ngày Java với CuongThai" — Ngày 23: try-with-resources.
    Trả nốt chỗ Ngày 22 kết (khối finally tám dòng đẻ ra đúng cái catch
    rỗng mà Ngày 21 lên án). Ngày 24 mở phần Collections nên phần kết
    phải dẫn về mảng cố định của Ngày 08.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 23,
  card: 'java-day-23',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'type-safe-generic-file-data-reader-with-exception-handling',
    title: 'Đọc dữ liệu từ file an toàn kiểu, có xử lý ngoại lệ',
  },

  content: `🚰 100 NGÀY JAVA — NGÀY 23: TRY-WITH-RESOURCES

Hôm qua tôi để lại đoạn code xấu này — cách đóng file "đúng chuẩn" trước Java 7:

\`\`\`java
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("a.txt"));
    // … việc thật, đúng 1 dòng
} finally {
    if (br != null) {
        try { br.close(); } catch (IOException e) { }   // catch rỗng!
    }
}
\`\`\`

Tám dòng dọn dẹp cho một dòng việc. Lại còn phải viết đúng cái khối \`catch\` rỗng mà Ngày 21 vừa lên án — vì \`close()\` cũng ném \`IOException\`, và bạn đang ở trong \`finally\` nên không có chỗ nào tử tế để xử lý nó.

Java 7 xoá sạch chuyện này.

━━━━━━━━━━━━━━━━━━━━

📌 MỘT DÒNG, HẾT

\`\`\`java
try (BufferedReader br = new BufferedReader(new FileReader(f))) {
    while (br.readLine() != null) dem++;
}
// hết khối → Java tự gọi br.close()
\`\`\`

Khai báo tài nguyên trong cặp ngoặc sau \`try\`. Ra khỏi khối, Java đóng hộ. Không \`finally\`, không kiểm \`null\`, không \`catch\` rỗng.

Chạy thật với file 3 dòng:

\`\`\`
doc duoc 3 dong
\`\`\`

Điều kiện duy nhất: class đó phải \`implements AutoCloseable\`. Toàn bộ \`java.io\`, JDBC, socket, \`Scanner\` — tất cả đều đã theo chuẩn này.

━━━━━━━━━━━━━━━━━━━━

🔄 NHIỀU TÀI NGUYÊN: ĐÓNG NGƯỢC THỨ TỰ MỞ

\`\`\`java
try (KetNoi a = new KetNoi("A"); KetNoi b = new KetNoi("B")) {
}
\`\`\`

Chạy thật:

\`\`\`
mo   A
mo   B
dong B
dong A
\`\`\`

Mở A → B, đóng B → A. Không phải ngẫu nhiên: B mở sau nên có thể đang dùng A (ví dụ \`BufferedReader\` bọc quanh \`FileReader\`). Đóng A trước thì B đang cầm một thứ đã chết.

Java làm đúng chiều phụ thuộc, tự động, không cần bạn nhớ.

━━━━━━━━━━━━━━━━━━━━

🛡️ CÓ LỖI GIỮA CHỪNG VẪN ĐÓNG

\`\`\`java
try (KetNoi c = new KetNoi("C")) {
    throw new IllegalStateException("hong giua chung");
} catch (IllegalStateException e) {
    System.out.println("bat duoc: " + e.getMessage());
}
\`\`\`

Chạy thật:

\`\`\`
mo   C
dong C
bat duoc: hong giua chung
\`\`\`

Đọc kỹ thứ tự: \`dong C\` chạy TRƯỚC khi \`catch\` nhận được lỗi. Tài nguyên được trả lại trước, rồi ngoại lệ mới đi tiếp lên trên.

Đây là chỗ quan trọng nhất bài hôm nay. Rò rỉ tài nguyên là loại bug tệ nhất để gỡ: chương trình chạy đúng cả tuần, rồi một ngày hết file handle hoặc hết connection trong pool và sập — trong khi log không có gì bất thường vì mỗi lần rò rỉ chỉ là một cái không được đóng.

━━━━━━━━━━━━━━━━━━━━

✍️ TÀI NGUYÊN CỦA RIÊNG BẠN

Chỉ cần một method:

\`\`\`java
class KetNoi implements AutoCloseable {
    private final String ten;
    KetNoi(String ten) { this.ten = ten; }

    @Override
    public void close() {
        // trả kết nối về pool, xoá file tạm, mở khoá…
    }
}
\`\`\`

Từ đó nó dùng được trong \`try(...)\` y như \`BufferedReader\`.

Một chi tiết hay: nếu thân \`try\` ném lỗi VÀ \`close()\` cũng ném lỗi, Java giữ lỗi của thân làm chính, còn lỗi của \`close()\` thành *suppressed* — vẫn lấy được bằng \`e.getSuppressed()\`. Cách cũ thì lỗi thứ hai đè mất lỗi thứ nhất, và bạn đi tìm nhầm chỗ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Đọc một file bằng cách cũ (\`finally\` + kiểm \`null\`), rồi viết lại bằng \`try-with-resources\`. Đếm số dòng cả hai.
2. Viết class \`FileTam implements AutoCloseable\`, \`close()\` xoá file.
3. Mở hai tài nguyên trong một \`try\`, in log ở constructor và \`close()\` để tự thấy thứ tự ngược.
4. Ném lỗi giữa thân \`try\` và kiểm chứng \`close()\` vẫn chạy.
5. Ném lỗi ở CẢ thân lẫn \`close()\`, in \`e.getSuppressed()\` xem có gì.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN — HẾT PHẦN NGOẠI LỆ

Ba ngày qua: bắt lỗi đúng loại và đừng nuốt (21), checked vs unchecked cùng ngoại lệ nghiệp vụ (22), và tự đóng tài nguyên (23). Từ nay, mở cái gì cũng đặt trong \`try(...)\` — hãy để nó thành phản xạ chứ không phải một điều cần nhớ.

Giờ nhìn lại một chỗ ta bỏ dở từ rất lâu. Ngày 8, mảng:

\`\`\`java
int[] diem = new int[30];   // đúng 30, không hơn không kém
\`\`\`

Muốn thêm sinh viên thứ 31? Tạo mảng mới, chép tay từng phần tử. Muốn xoá em ở giữa? Dồn toàn bộ phần đuôi lên một ô. Muốn biết có bao nhiêu em thật sự? Tự đếm, vì \`length\` chỉ nói sức chứa.

Ngày 24 mở Giai đoạn 4: \`ArrayList\` và họ hàng Collections — nơi tất cả những việc tay chân đó biến mất sau một lời gọi method. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
