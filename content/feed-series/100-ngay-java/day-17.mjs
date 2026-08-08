/** "100 Ngày Java với CuongThai" — Ngày 17: abstract.
    Trả lời đúng chỗ Ngày 16 bỏ ngỏ: `Hinh.dienTich()` trả 0 là vô nghĩa,
    và quên ghi đè thì lặng lẽ nhận 0. Ngày 18 (interface) trỏ ngược về
    "một cha duy nhất" ở phần kết — giữ ý đó khi sửa.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 17,
  card: 'java-day-17',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'design-a-notification-system-with-abstract-class-and-interface',
    title: 'Hệ thống thông báo với abstract class và interface',
  },

  content: `📐 100 NGÀY JAVA — NGÀY 17: ABSTRACT

Hôm qua đa hình chạy ngon, nhưng class \`Hinh\` để lại hai vết gợn:

\`\`\`java
class Hinh {
    double dienTich() { return 0; }   // diện tích của "hình chung chung"?
}

Hinh h = new Hinh();      // đúc được một cái "hình" không hình thù gì
\`\`\`

Và tệ hơn: lớp con nào quên ghi đè \`dienTich()\` thì lặng lẽ nhận số 0. Không lỗi, không cảnh báo, chỉ có con số sai lẫn vào giữa báo cáo.

Hôm nay ta vá cả ba bằng một từ khoá.

━━━━━━━━━━━━━━━━━━━━

📌 abstract — NÊU YÊU CẦU, KHÔNG TỰ LÀM

\`\`\`java
abstract class ThongBao {
    protected String nguoiNhan;

    ThongBao(String nguoiNhan) { this.nguoiNhan = nguoiNhan; }

    abstract void gui(String noiDung);     // dấu ; thay cho { }

    void guiKemNhatKy(String noiDung) {    // method thường, viết sẵn
        System.out.println("[log] chuan bi gui toi " + nguoiNhan);
        gui(noiDung);
    }
}
\`\`\`

\`abstract void gui(...)\` không có thân — nó chỉ nói: "đứa nào kế thừa tao thì phải biết gửi". Không phải bịa một cái thân vô nghĩa để lấp chỗ trống nữa.

Điểm mạnh nằm ở chỗ TRỘN ĐƯỢC: cùng một class vừa có phần chung viết sẵn (\`guiKemNhatKy\`), vừa có phần bỏ trống bắt con điền (\`gui\`).

━━━━━━━━━━━━━━━━━━━━

🚫 KHÔNG new ĐƯỢC

\`\`\`java
Hinh h = new Hinh();
// ✗ error: Hinh is abstract; cannot be instantiated
\`\`\`

Đúng như trực giác: bản thiết kế ngôi nhà thì không ai ở được, phải xây một căn cụ thể. \`new Hinh()\` giờ là lỗi lúc dịch, không còn tạo ra "hình chung chung" nữa.

Nhưng để ý: abstract class VẪN CÓ constructor. Nó không dùng để \`new\` trực tiếp — nó tồn tại để lớp con gọi \`super(…)\` như Ngày 15.

━━━━━━━━━━━━━━━━━━━━

⚠️ CON QUÊN LÀ KHÔNG DỊCH ĐƯỢC

\`\`\`java
abstract class Hinh { abstract double dienTich(); }

class Vuong extends Hinh { }
// ✗ error: Vuong is not abstract and does not override
//   abstract method dienTich() in Hinh
\`\`\`

So với hôm qua: quên ghi đè thì nhận 0 và không ai biết. Hôm nay: không dịch nổi.

Đây chính là tinh thần xuyên suốt Giai đoạn 2 — biến lỗi lúc CHẠY thành lỗi lúc DỊCH. \`abstract\` là một HỢP ĐỒNG có người canh, không phải một lời nhắc nhở tử tế.

━━━━━━━━━━━━━━━━━━━━

🦴 KHUNG XƯƠNG: CHA GIỮ TRÌNH TỰ, CON ĐIỀN BƯỚC

Đây là chỗ \`abstract\` cho giá trị thật sự:

\`\`\`java
void guiKemNhatKy(String noiDung) {
    System.out.println("[log] chuan bi gui toi " + nguoiNhan);   // cha lo
    gui(noiDung);                                                // con lo
}
\`\`\`

Hai lớp con, hai kiểu gửi:

\`\`\`java
class Email extends ThongBao {
    @Override void gui(String s) { System.out.println("EMAIL -> " + nguoiNhan + ": " + s); }
}

class SMS extends ThongBao {
    @Override void gui(String s) {          // SMS giới hạn ký tự
        System.out.println("SMS   -> " + nguoiNhan + ": " + s.substring(0, Math.min(19, s.length())));
    }
}
\`\`\`

Chạy thật:

\`\`\`
[log] chuan bi gui toi an@abc.com
EMAIL -> an@abc.com: Diem thi da co, vao xem ngay nhe
[log] chuan bi gui toi 0912345678
SMS   -> 0912345678: Diem thi da co, vao
\`\`\`

Cái nhật ký "[log]" chỉ viết MỘT lần ở lớp cha. Mai thêm kênh Zalo, Telegram, push notification — không ai phải chép lại dòng log đó, và cũng không ai quên được nó. Mẫu thiết kế này tên là *Template Method*: cha giữ TRÌNH TỰ, con điền TỪNG BƯỚC.

━━━━━━━━━━━━━━━━━━━━

🧭 KHI NÀO abstract, KHI NÀO CLASS THƯỜNG

Dùng \`abstract\` khi cả ba điều sau cùng đúng:

1. Có quan hệ **LÀ MỘT** thật sự (Ngày 15) — Email LÀ MỘT Thông báo.
2. Có phần chung đáng viết sẵn — nhật ký, kiểm tra đầu vào, trình tự.
3. Có phần mà mỗi lớp con bắt buộc phải tự làm khác nhau.

Thiếu điều 2 (không có gì chung để viết sẵn) thì thứ bạn cần là \`interface\` — ngày mai. Thiếu điều 3 thì class thường là đủ, đừng phức tạp hoá.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Sửa \`Hinh\` ở Ngày 16 thành \`abstract\`, bỏ \`return 0\`, chạy lại toàn bộ.
2. Thử \`new Hinh()\` và đọc lỗi.
3. Viết \`class HinhThang extends Hinh\` nhưng CỐ TÌNH không ghi đè — đọc lỗi.
4. Viết \`abstract class NhanVien\` có \`tinhLuong()\` abstract, rồi \`NhanVienFullTime\` và \`NhanVienPartTime\` tính hai kiểu.
5. Thêm vào lớp cha một method thường \`inPhieuLuong()\` gọi \`tinhLuong()\` bên trong — đó chính là Template Method.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`abstract\` cho bạn ba thứ: không đúc được bản thiết kế, lớp con bắt buộc hoàn thiện hợp đồng, và vẫn giữ được phần chung viết sẵn ở cha.

Nhưng nhớ luật Ngày 15 chứ? **Một class chỉ có ĐÚNG MỘT cha.** Vậy nếu một class cần mang nhiều vai cùng lúc thì sao — một \`Email\` vừa là thứ gửi được, vừa là thứ lưu vào cơ sở dữ liệu được, vừa là thứ so sánh được để sắp xếp?

\`extends\` chịu thua. Ngày 18: \`interface\` — hợp đồng thuần tuý, và một class ký được bao nhiêu hợp đồng tuỳ thích. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
