/** "100 Ngày Java với CuongThai" — Ngày 22: checked vs unchecked.
    Nối thẳng chỗ Ngày 21 kết ("Files.readString bắt phải xử lý, còn 10/0
    thì không"). Ngày 23 (try-with-resources) trỏ ngược về finally của
    Ngày 21 và phần đóng tài nguyên ở đây.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 22,
  card: 'java-day-22',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'generic-file-data-processor-with-custom-exceptions',
    title: 'Bộ xử lý dữ liệu với ngoại lệ tự viết',
  },

  content: `🧯 100 NGÀY JAVA — NGÀY 22: CHECKED VS UNCHECKED

Hôm qua tôi để lại một chuyện lạ:

\`\`\`java
Files.readString(Path.of("a.txt"));
// ✗ error: unreported exception IOException;
//   must be caught or declared to be thrown

int x = 10 / 0;
// dịch bình thường, chạy mới nổ
\`\`\`

Cùng là ngoại lệ, sao một cái bị trình dịch chặn còn cái kia thì không? Vì Java chia chúng thành hai họ, và ranh giới đó là một quyết định thiết kế chứ không phải chuyện tuỳ hứng.

━━━━━━━━━━━━━━━━━━━━

📌 HAI HỌ

**Checked** (kế thừa \`Exception\`) — chuyện NGOÀI TẦM KIỂM SOÁT của bạn:

\`\`\`java
IOException          // file bị xoá giữa chừng, ổ cứng đầy
SQLException         // mất kết nối cơ sở dữ liệu
InterruptedException // luồng bị đánh thức
\`\`\`

Code bạn viết đúng hoàn toàn mà nó vẫn xảy ra được. Nên Java bắt buộc: hoặc \`catch\`, hoặc \`throws\` để đẩy lên trên. Không được làm ngơ.

**Unchecked** (kế thừa \`RuntimeException\`) — LỖI CỦA LẬP TRÌNH VIÊN:

\`\`\`java
NullPointerException        // quên kiểm tra null
ArrayIndexOutOfBoundsException  // tính sai chỉ số
IllegalArgumentException    // truyền tham số vô lý
ArithmeticException         // chia cho 0
\`\`\`

Java không bắt bạn \`catch\` mấy cái này, vì cách sửa đúng KHÔNG PHẢI là bắt — mà là sửa code cho hết sai. Bọc \`try/catch\` quanh một \`NullPointerException\` là dán băng dính lên đèn báo lỗi.

━━━━━━━━━━━━━━━━━━━━

🎯 throw NÉM · throws KHAI BÁO

Hai từ khoá gần giống nhau, hay bị lẫn:

\`\`\`java
void rut(double tien) throws KhongDuTienException {     // KHAI BÁO ở chữ ký
    if (tien > soDu)
        throw new KhongDuTienException(tien - soDu);    // NÉM ở thân hàm
}
\`\`\`

- \`throw\` (không s) — ném một đối tượng ngoại lệ ra, ngay tại đó
- \`throws\` (có s) — báo trước cho người gọi: "hàm này có thể ném cái này"

\`throws\` là MỘT PHẦN CHỮ KÝ của method. Người gọi nhìn vào là biết mình phải chuẩn bị gì — như một cảnh báo dán ngay cửa.

Một lời khuyên: đừng viết \`throws Exception\` cho nhanh. Nó nói "có thể hỏng, không biết hỏng kiểu gì" — người gọi mất khả năng xử lý riêng từng trường hợp, và phải bắt tất cả bằng một khối chung.

━━━━━━━━━━━━━━━━━━━━

✍️ NGOẠI LỆ CỦA RIÊNG BẠN

Java có sẵn vài chục loại, nhưng không loại nào biết nghiệp vụ của bạn:

\`\`\`java
class KhongDuTienException extends Exception {
    private final double thieu;

    KhongDuTienException(double thieu) {
        super("Thieu " + thieu + " d");     // thông điệp cho người đọc log
        this.thieu = thieu;                 // DỮ LIỆU cho người xử lý
    }

    double getThieu() { return thieu; }
}
\`\`\`

Chạy thật:

\`\`\`
1) Thieu 500.0 d | thieu 500.0
2) So tien phai duong, nhan duoc -50.0
3) rut 400 xong, so du 600.0
\`\`\`

Hai điểm đáng học ở đây:

1. **Mang theo dữ liệu.** \`getThieu()\` cho phép người gọi hiện đúng câu "bạn còn thiếu 500đ" thay vì một lời xin lỗi chung chung.
2. **Chọn đúng họ.** \`KhongDuTienException extends Exception\` (checked) vì người gọi LÀM ĐƯỢC gì đó — hỏi nạp thêm tiền. Còn \`SoTienAmException extends RuntimeException\` (unchecked) vì rút số âm là lỗi của người viết code, không phải tình huống nghiệp vụ.

Đó cũng chính là câu hỏi để chọn giữa hai họ: **người gọi có làm được gì có ích khi bắt được nó không?** Có thì checked, không thì unchecked.

━━━━━━━━━━━━━━━━━━━━

🔗 BỌC LẠI MÀ ĐỪNG LÀM MẤT GỐC

Tầng trên thường muốn đổi loại ngoại lệ cho hợp ngữ cảnh của mình:

\`\`\`java
catch (KhongDuTienException e) {
    throw new RuntimeException("Giao dich that bai", e);   // ← truyền e vào!
}
\`\`\`

Kết quả thật:

\`\`\`
4) Giao dich that bai <- Thieu 9399.0 d
\`\`\`

Tham số thứ hai là *cause* — nguyên nhân gốc. Nhờ nó, stack trace in ra đủ cả hai tầng: "giao dịch thất bại" **vì** "thiếu 9399đ".

Quên tham số \`e\` là mất sạch dấu vết chỗ hỏng thật. Bạn còn lại đúng một dòng "Giao dich that bai" và không biết tìm từ đâu — họ hàng gần với khối \`catch\` rỗng của hôm qua.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Gọi \`Files.readString(Path.of("khong-co.txt"))\` mà không xử lý gì — đọc lỗi biên dịch.
2. Sửa bằng \`try/catch\`, rồi sửa lại bằng \`throws\` ở \`main\`. So hai cách.
3. Viết \`TuoiKhongHopLeException\` (checked) có \`getTuoi()\`, ném khi tuổi ngoài 0–150.
4. Viết một ngoại lệ unchecked cho trường hợp tham số \`null\` và giải thích lựa chọn.
5. Bọc một ngoại lệ trong \`RuntimeException\` — một lần truyền \`e\`, một lần quên. In \`printStackTrace()\` cả hai và so.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Checked: chuyện ngoài tầm tay, trình dịch bắt bạn đối mặt. Unchecked: lỗi code, hãy sửa code. \`throw\` ném, \`throws\` khai báo. Ngoại lệ tự viết thì đặt tên theo nghiệp vụ và mang theo dữ liệu. Bọc lại thì luôn truyền cause.

Còn một chuyện dở dang từ hôm qua. Ta biết \`finally\` để đóng tài nguyên, nhưng viết ra thì nó xấu thế này:

\`\`\`java
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("a.txt"));
    …
} finally {
    if (br != null) {
        try { br.close(); } catch (IOException e) { }   // catch rỗng lại xuất hiện!
    }
}
\`\`\`

Tám dòng dọn dẹp cho một dòng việc thật, lại còn đẻ ra đúng cái khối \`catch\` rỗng mà hôm qua ta vừa lên án.

Ngày 23: \`try-with-resources\` — Java tự đóng hộ, và cả đống code trên rút còn một dòng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
