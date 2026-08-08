/** "100 Ngày Java với CuongThai" — Ngày 13: Đóng gói.
    Trả lời đúng câu hỏi bài Ngày 12 bỏ ngỏ ("khai sinh chặt rồi thì sau
    đó ai cũng ghi đè được"), và dùng lại chuyện THAM CHIẾU của Ngày 08 &
    11 ở mục rò rỉ getter — đừng đổi hai mốc đó khi sửa.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. Riêng phép thử rò rỉ getter phải dùng HAI tài khoản riêng:
    thử cả hai kiểu trên cùng một đối tượng thì phép thử sau chạy trên dữ
    liệu đã bị phép thử trước phá, và cho ra kết luận ngược hẳn sự thật. */
export default {
  day: 13,
  card: 'java-day-13',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'enforce-invariants-with-an-encapsulated-bank-account',
    title: 'Tài khoản ngân hàng có đóng gói và ràng buộc',
  },

  content: `🔒 100 NGÀY JAVA — NGÀY 13: ĐÓNG GÓI

Hôm qua ta khoá được cửa vào: constructor bắt khai đủ mới cho sinh ra. Nhưng khoá xong rồi thì cửa sổ vẫn mở toang:

\`\`\`java
TaiKhoan tk = new TaiKhoan("An", 1000);
tk.soDu = -999999;    // vẫn hợp lệ. Ngân hàng vừa mất trắng.
\`\`\`

Constructor canh được LÚC SINH RA. Hôm nay ta canh SUỐT ĐỜI đối tượng.

━━━━━━━━━━━━━━━━━━━━

📌 private — ĐÓNG CỬA TRƯỚC ĐÃ

\`\`\`java
class TaiKhoan {
    private double soDu;                    // ngoài class không thấy
    public double getSoDu() { return soDu; } // muốn xem thì hỏi
}

tk.soDu = -999999;   // ✗ error: soDu has private access in TaiKhoan
\`\`\`

Lỗi lúc DỊCH, không phải lúc chạy. Đúng tinh thần Giai đoạn 2: sai thì đừng cho biên dịch, đừng để tới lúc có người dùng thật.

Nguyên tắc mặc định của Java: **field \`private\`, hành vi \`public\`**. Dữ liệu là chuyện riêng bên trong, thứ bạn công bố ra ngoài là những việc đối tượng làm được.

━━━━━━━━━━━━━━━━━━━━

⚠️ SETTER LÀ CHỐT KIỂM, KHÔNG PHẢI ỐNG DẪN

Rất nhiều người học đóng gói xong viết thế này rồi tưởng mình đã đóng gói:

\`\`\`java
private double soDu;
public void setSoDu(double soDu) { this.soDu = soDu; }   // ← vô dụng
\`\`\`

Cái setter đó không kiểm gì cả. Nó chỉ là \`public\` mặc áo mới — vẫn gán được \`-999999\` như thường, chỉ tốn thêm ba dòng.

Setter có ích là setter biết nói KHÔNG:

\`\`\`java
public boolean napTien(double tien) {
    if (tien <= 0) return false;     // chặn ngay tại cửa
    soDu += tien;
    return true;
}

public boolean rutTien(double tien) {
    if (tien <= 0 || tien > soDu) return false;
    soDu -= tien;
    return true;
}
\`\`\`

Chạy thật:

\`\`\`
1) nap -500 duoc chap nhan? false   so du -> 1000.0
2) nap 500          -> so du 1500.0
3) rut 9999 duoc?   false   so du -> 1500.0
\`\`\`

Để ý cả tên: \`napTien\` / \`rutTien\` chứ không phải \`setSoDu\`. Tên theo NGHIỆP VỤ nói lên việc được phép làm; tên theo field chỉ nói lên cái ruột — mà cái ruột thì lẽ ra người ngoài không cần biết.

━━━━━━━━━━━━━━━━━━━━

🕳️ BẪY THẬT SỰ: GETTER LÀM RÒ RỈ

Đây là chỗ ngay cả người đi làm vài năm vẫn dính.

\`\`\`java
private String[] lichSu;

public String[] getLichSu() {
    return lichSu;        // ← trả nguyên CHÌA KHOÁ, không phải bản chụp
}
\`\`\`

Trông thì kín: field \`private\`, chỉ có getter. Nhưng:

\`\`\`java
tk.getLichSu()[0] = "HACKED";
\`\`\`

Xong. Dữ liệu bên trong vừa bị sửa từ ngoài, không qua cửa nào cả.

Vì sao? Ngày 8 và Ngày 11: biến chỉ GIỮ THAM CHIẾU. \`private\` bảo vệ được cái biến — nó không bảo vệ cái đối tượng mà biến đó trỏ tới. Trả biến ra ngoài là trao luôn đường vào.

Cách chữa là **bản sao phòng thủ**:

\`\`\`java
public String[] getLichSu() {
    String[] copy = new String[soGiaoDich];
    for (int i = 0; i < soGiaoDich; i++) copy[i] = lichSu[i];
    return copy;          // sửa thoải mái, không tới được bên trong
}
\`\`\`

Hai tài khoản riêng, cùng một giao dịch, chỉ khác kiểu getter — kết quả thật:

\`\`\`
4) sua qua ban RO RI -> HACKED
5) sua qua ban SAO   -> nap 100.0
\`\`\`

Chỗ này có một bài học về cách TỰ KIỂM: lần đầu tôi thử cả hai kiểu getter trên cùng một tài khoản, và phép thử thứ hai chạy trên dữ liệu đã bị phép thử thứ nhất phá — nó in ra "HACKED" cho cả hai, tức là "chứng minh" rằng bản sao cũng vô dụng. Sai hoàn toàn. Phép thử hỏng thì kết luận hỏng theo, mà đọc code thì không thấy.

━━━━━━━━━━━━━━━━━━━━

🚪 BỐN MỨC TRUY CẬP

\`\`\`java
private      // chỉ trong chính class đó
             // (không viết gì) → cùng package
protected    // cùng package + các lớp con (Ngày 15)
public       // mọi nơi
\`\`\`

Quy tắc thực dụng: bắt đầu bằng \`private\`, chỉ mở rộng khi có lý do rõ. Mở ra thì lúc nào cũng dễ; đóng lại thì phá code của mọi người đang dùng.

━━━━━━━━━━━━━━━━━━━━

🧭 ĐÓNG GÓI KHÔNG PHẢI LÀ SINH GETTER/SETTER CHO MỌI FIELD

IDE có nút "generate getters and setters", và dùng nó cho sạch mọi field là hiểu ngược vấn đề: một class có đủ getter/setter cho tất cả field thì cũng hở y như để \`public\`, chỉ dài dòng hơn.

Câu hỏi đúng không phải "field này cần getter không?" mà là **"người ngoài cần LÀM GÌ với đối tượng này?"**. Trả lời xong thì mới biết nên mở ra những gì.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Đổi mọi field của \`SinhVien\` thành \`private\`, chạy lại code cũ và đọc lỗi.
2. Viết \`capNhatDiem(double d)\` chỉ nhận 0–10, trả về \`false\` nếu ngoài khoảng.
3. Cho \`SinhVien\` một mảng \`diemMon[]\` với getter trả thẳng mảng, rồi sửa nó từ ngoài để tự tay tạo ra lỗ rò rỉ.
4. Sửa getter đó thành bản sao phòng thủ và kiểm chứng lại — nhớ dùng HAI đối tượng riêng.
5. Bỏ hết \`private\` đi rồi tự trả lời: chương trình vẫn chạy, vậy đóng gói bảo vệ ai?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Đóng gói không phải là gõ thêm chữ \`private\`. Nó là quyết định: dữ liệu chỉ có MỘT cửa vào, và cửa đó có người gác — kể cả cửa sau mà getter vô tình mở ra.

Ba ngày qua đều nói về từng đối tượng riêng lẻ: đúc nó, khai sinh nó, bảo vệ nó. Nhưng có những thứ không thuộc về đối tượng nào — số tài khoản tiếp theo được cấp, hằng số lãi suất, tổng số tài khoản đã mở. Chúng thuộc về CẢ CLASS.

Ngày 14 ta học \`static\` — từ khoá đã xuất hiện từ \`public static void main\` ngày đầu tiên mà tới giờ vẫn chưa ai giải thích tử tế cho bạn. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
