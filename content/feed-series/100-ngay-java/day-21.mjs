/** "100 Ngày Java với CuongThai" — Ngày 21: Ngoại lệ. MỞ GIAI ĐOẠN 3.
    Bài Ngày 20 kết bằng đúng lời hứa này ("catch (Exception e) {} rỗng là
    dòng code nguy hiểm nhất") nên phần đó phải có mặt. Ngày 22 (checked vs
    unchecked, throw, custom exception) trỏ ngược về phần kết ở đây.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 21,
  card: 'java-day-21',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'lab211',
    slug: 'lab211-j1-s-p0063-input-and-display-person-info',
    title: 'Nhập và hiển thị thông tin cá nhân (có kiểm dữ liệu)',
  },

  content: `💥 100 NGÀY JAVA — NGÀY 21: NGOẠI LỆ

Giai đoạn 3 bắt đầu. Hai mươi ngày qua ta ngầm giả định một điều: chương trình luôn chạy đúng đường.

Người dùng luôn nhập số khi được hỏi số. File luôn tồn tại. Mẫu số luôn khác 0. Mạng luôn thông.

Đời không thế. Và Java có hẳn một cơ chế cho chuyện "không thế".

━━━━━━━━━━━━━━━━━━━━

📌 BỐN CÁI TÊN BẠN SẼ GẶP HÀNG NGÀY

Chạy thật, đây là những gì Java nói khi mọi thứ đi chệch:

\`\`\`
1) ArithmeticException: / by zero
2) NumberFormatException: For input string: "mot tram"
3) ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
4) NullPointerException
\`\`\`

Lần lượt là: chia cho 0 · ép chữ thành số · với tay ra ngoài mảng (Ngày 8) · gọi method trên \`null\` (Ngày 11).

Để ý phần thông điệp: \`Index 5 out of bounds for length 3\` nói thẳng bạn sai ở đâu. Rất nhiều người mới thấy chữ đỏ là hoảng, cuộn lên tìm Google — trong khi câu trả lời nằm ngay dòng đầu tiên.

Không bắt thì sao? Chương trình **dừng ngay tại đó**. Không phải chạy tiếp với dữ liệu sai — Java thà chết còn hơn làm bừa.

━━━━━━━━━━━━━━━━━━━━

🎣 try · catch — BẮT ĐÚNG LOẠI

\`\`\`java
try {
    int tuoi = Integer.parseInt(nhap);
    System.out.println("Nam sau ban " + (tuoi + 1) + " tuoi");
} catch (NumberFormatException e) {
    System.out.println("Vui long nhap MOT SO");
}
\`\`\`

\`try\` bọc phần có thể hỏng, \`catch\` nói phải làm gì khi hỏng. Chương trình đi tiếp thay vì chết.

Hai công cụ trong tay bạn:

- \`e.getMessage()\` — CHUYỆN GÌ xảy ra
- \`e.printStackTrace()\` — Ở ĐÂU, theo cả chuỗi lời gọi

Bắt nhiều loại thì phải đi từ HẸP tới RỘNG:

\`\`\`java
try { … }
catch (Exception e) { }              // rộng
catch (ArithmeticException e) { }    // ✗ error: exception ArithmeticException
                                     //   has already been caught
\`\`\`

\`ArithmeticException\` LÀ MỘT \`Exception\` (kế thừa — Ngày 15), nên \`catch\` đầu đã nuốt sạch, khối sau vĩnh viễn không tới lượt. Java bắt lỗi này ngay lúc dịch.

Muốn xử lý nhiều loại giống nhau thì gộp:

\`\`\`java
catch (NumberFormatException | ArithmeticException e) { … }
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔚 finally — LUÔN CHẠY, KỂ CẢ KHI ĐÃ return

\`\`\`java
static String thu() {
    try {
        return "tu try";
    } finally {
        System.out.println("finally van chay truoc khi ham thoat");
    }
}
\`\`\`

Chạy thật:

\`\`\`
   finally van chay truoc khi ham thoat
5) ket qua = tu try
\`\`\`

Đọc kỹ thứ tự: \`return\` đã định đoạt giá trị trả về, nhưng \`finally\` vẫn kịp chạy TRƯỚC khi hàm thật sự thoát.

Đó là lý do \`finally\` sinh ra: những việc BẮT BUỘC phải làm dù thành công hay thất bại — đóng file, đóng kết nối cơ sở dữ liệu, mở khoá. Đặt ở cuối \`try\` thì gặp lỗi là nó bị bỏ qua; đặt trong \`finally\` thì không thoát đi đâu được.

━━━━━━━━━━━━━━━━━━━━

☠️ DÒNG CODE NGUY HIỂM NHẤT MÀ NGƯỜI MỚI HAY VIẾT

\`\`\`java
try {
    docFile("dulieu.txt");
} catch (Exception e) {
}                          // ☠️
\`\`\`

IDE gạch đỏ, bạn bấm "surround with try/catch", nó sinh ra khối rỗng, hết đỏ. Chạy được. Xong.

Nhưng bạn vừa biến một lỗi TO TIẾNG thành một bug IM LẶNG. File không đọc được, chương trình vẫn chạy tiếp với dữ liệu rỗng, và ba tuần sau có người hỏi vì sao báo cáo thiếu số — không log, không dấu vết, không ai biết bắt đầu tìm từ đâu.

Tối thiểu phải là:

\`\`\`java
catch (IOException e) {
    log.error("Khong doc duoc dulieu.txt", e);   // ghi lại
    throw new RuntimeException(e);               // hoặc để nó nổ tiếp
}
\`\`\`

Nguyên tắc: **không xử lý được thì đừng bắt**. Để ngoại lệ bay lên chỗ có đủ thông tin để quyết định. Bắt rồi làm ngơ là tệ hơn không bắt.

━━━━━━━━━━━━━━━━━━━━

🧭 ĐỪNG DÙNG NGOẠI LỆ THAY CHO if

\`\`\`java
// ✗ dùng ngoại lệ làm luồng điều khiển
try { return a[i]; } catch (ArrayIndexOutOfBoundsException e) { return -1; }

// ✓ kiểm tra trước cho rẻ và rõ
if (i >= 0 && i < a.length) return a[i];
return -1;
\`\`\`

Ngoại lệ dành cho chuyện BẤT THƯỜNG, không dành cho những trường hợp bạn biết chắc sẽ xảy ra. Chúng cũng đắt hơn một câu \`if\` rất nhiều vì phải dựng cả stack trace.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết chương trình nhập tuổi bằng \`Scanner\`, gõ chữ vào và đọc lỗi khi chưa bắt.
2. Bọc \`try/catch (NumberFormatException)\` để nó hỏi lại thay vì chết.
3. Viết hàm có \`return\` trong \`try\` và \`println\` trong \`finally\` — đoán thứ tự trước khi chạy.
4. Bắt \`Exception\` trước \`ArithmeticException\` và đọc lỗi biên dịch.
5. Viết một khối \`catch\` rỗng làm mất một lỗi thật, rồi tự tìm bug đó mà không sửa khối catch — để nhớ đời.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`try\` bọc phần có thể hỏng, \`catch\` xử lý đúng loại từ hẹp tới rộng, \`finally\` dọn dẹp không điều kiện. Và tuyệt đối không nuốt lỗi.

Nhưng bạn sẽ sớm gặp một chuyện lạ: có những ngoại lệ Java BẮT BUỘC bạn phải xử lý mới cho dịch, còn những cái khác thì không nói gì.

\`\`\`java
Files.readString(Path.of("a.txt"));   // ✗ unreported exception IOException
int x = 10 / 0;                       // dịch bình thường, chạy mới nổ
\`\`\`

Ngày 22: **checked vs unchecked** — vì sao Java chia hai loại, khi nào dùng \`throws\` để đẩy lên trên, và cách tự viết ngoại lệ riêng cho nghiệp vụ của mình. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
