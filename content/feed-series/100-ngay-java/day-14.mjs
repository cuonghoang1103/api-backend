/** "100 Ngày Java với CuongThai" — Ngày 14: static.
    Trả nốt món nợ từ Ngày 1 (`public static void main` là gì) và Ngày 11
    (bỏ `static` khỏi method để nó phục vụ đối tượng). Bài Ngày 15 mở
    Kế thừa nên phần kết phải dẫn sang đó.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 14,
  card: 'java-day-14',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'auto-assign-ids-with-static-members',
    title: 'Tự cấp ID bằng thành viên static',
  },

  content: `⚡ 100 NGÀY JAVA — NGÀY 14: STATIC

Ngày đầu tiên bạn gõ \`public static void main(String[] args)\` và tôi bảo: cứ viết vậy đi, mai mốt hiểu. Hôm nay là "mai mốt".

Ba ngày qua mọi thứ đều thuộc về một đối tượng cụ thể. Nhưng có những thứ không thuộc về ai cả:

- Tên công ty — cả nghìn nhân viên chung một cái
- Số nhân viên hiện có — không phải của riêng anh An hay chị Bình
- Mã nhân viên tiếp theo được cấp — phải đếm chung, không thì ai cũng nhận số 1

Những thứ đó thuộc về CẢ CLASS. Java gọi chúng là \`static\`.

━━━━━━━━━━━━━━━━━━━━

📌 MỘT BẢN DÙNG CHUNG, KHÔNG PHẢI MỖI ĐỐI TƯỢNG MỘT BẢN

\`\`\`java
class NhanVien {
    static final String CONG_TY = "CuongThai Corp";  // 1 bản cho cả class
    private static int soNhanVien = 0;               // 1 bản, đếm chung
    private String ten;                              // mỗi đối tượng 1 bản

    NhanVien(String ten) {
        this.ten = ten;
        soNhanVien++;
    }
}
\`\`\`

Đúc ba nhân viên rồi hỏi:

\`\`\`java
new NhanVien("An");  new NhanVien("Binh");  new NhanVien("Chi");
System.out.println(NhanVien.demNhanVien());   // 3
\`\`\`

Ba đối tượng, ba cái \`ten\` riêng, nhưng chỉ MỘT \`soNhanVien\`. Ai tăng thì tất cả cùng thấy.

Cũng để ý cách gọi: \`NhanVien.demNhanVien()\` — gọi từ TÊN CLASS, không cần đối tượng nào. Gọi qua đối tượng (\`an.demNhanVien()\`) vẫn chạy, nhưng đừng viết thế: nó làm người đọc tưởng kết quả phụ thuộc vào \`an\`.

━━━━━━━━━━━━━━━━━━━━

🎫 VIỆC KINH ĐIỂN NHẤT: CẤP MÃ TỰ ĐỘNG

\`\`\`java
private static int idTiepTheo = 1;   // static: đếm chung
private final int id;                // final: cấp rồi thì không đổi

NhanVien(String ten) {
    this.ten = ten;
    this.id = idTiepTheo++;
}
\`\`\`

Chạy thật:

\`\`\`
#1 An @ CuongThai Corp
#3 Chi @ CuongThai Corp
1) tong nhan vien -> 3
2) an.id=1 binh.id=2 chi.id=3
\`\`\`

Bộ đếm BẮT BUỘC phải \`static\`. Bỏ chữ đó đi thì mỗi đối tượng có bộ đếm riêng, ai cũng bắt đầu từ 1, và cả ba cùng mang mã số 1.

Cặp \`static\` + \`final\` ở đây là hai vai khác hẳn nhau: \`idTiepTheo\` static để dùng chung, \`id\` final để cấp một lần rồi khoá.

━━━━━━━━━━━━━━━━━━━━

🚫 static KHÔNG CÓ this

\`\`\`java
class SaiStatic {
    private String ten = "An";
    static void in() {
        System.out.println(ten);   // ✗ error: non-static variable ten
    }                              //   cannot be referenced from a static context
}
\`\`\`

Ngày 11 bạn gặp bản anh em của lỗi này với method. Lý do giống hệt: code \`static\` chạy ở mức CLASS, khi có thể chưa có đối tượng nào tồn tại. Nó không có \`this\`, nên hỏi "\`ten\` của ai" là câu hỏi không có đáp án.

Và đây, cuối cùng, là lời giải cho ngày đầu tiên:

\`\`\`java
public static void main(String[] args)
\`\`\`

JVM phải gọi \`main\` khi chương trình vừa khởi động — lúc đó chưa có đối tượng nào cả, cũng chưa ai đúc gì. Nếu \`main\` không \`static\` thì JVM phải đúc một đối tượng trước để gọi nó, mà muốn đúc thì lại phải chạy code, mà muốn chạy code thì phải có \`main\`… Vòng luẩn quẩn. \`static\` cắt vòng đó.

━━━━━━━━━━━━━━━━━━━━

📐 static final = HẰNG SỐ

\`\`\`java
static final String CONG_TY = "CuongThai Corp";
static final double THUE_VAT = 0.1;
\`\`\`

Quy ước tên: IN_HOA_GACH_DUOI. Bạn đã dùng loại này từ lâu mà chưa để ý — \`Math.PI\`, \`Integer.MAX_VALUE\` chính là nó.

Đây là chỗ \`static\` xứng đáng nhất: một giá trị dùng chung, không đổi, không ai giành nhau.

━━━━━━━━━━━━━━━━━━━━

⚠️ MẶT TỐI: BIẾN TOÀN CỤC TRÁ HÌNH

\`static\` dễ dùng đến mức người mới thấy cái gì cũng muốn cho static — và thế là quay về đúng thứ OOP sinh ra để tránh: biến toàn cục.

\`\`\`java
static String nguoiDangDangNhap;   // ai cũng đọc, ai cũng ghi
\`\`\`

Ba rắc rối, không phải lý thuyết suông:

1. Sửa ở một nơi, vỡ ở nơi hoàn toàn khác — đúng kiểu bug khó lần nhất.
2. Không viết test được: mỗi test để lại dấu vết cho test sau, chạy riêng thì đúng, chạy cả bộ thì sai.
3. Đa luồng (Giai đoạn 6) là hỏng thật: hai luồng cùng ghi một chỗ, không ai nhường ai.

Câu hỏi phải tự trả lời trước khi gõ \`static\`: **thứ này thuộc về MỘT đối tượng, hay thuộc về CẢ CLASS?** Chỉ khi câu trả lời là vế sau — như bộ đếm ID hay hằng số — thì \`static\` mới đúng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Cho \`SinhVien\` một \`static int siSo\` tăng trong constructor; đúc 5 em rồi in.
2. Thêm \`static final String TRUONG = "FPT"\` và in nó **không** đúc đối tượng nào.
3. Bỏ chữ \`static\` ở bộ đếm ID, chạy lại, giải thích vì sao mọi người cùng mang mã 1.
4. Viết method \`static\` rồi thử đọc một field thường bên trong — đọc kỹ lỗi.
5. Trả lời bằng lời của bạn: vì sao \`main\` phải \`static\`?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN — NỬA ĐƯỜNG GIAI ĐOẠN 2

Bốn ngày qua ta dựng xong một class tử tế: class là khuôn (Ngày 11), constructor bắt khai đủ (Ngày 12), \`private\` canh cửa suốt đời (Ngày 13), và \`static\` cho những gì thuộc về cả class (hôm nay).

Nhưng thử nghĩ: \`NhanVien\`, \`SinhVien\`, \`KhachHang\` — cả ba đều có tên, ngày sinh, số điện thoại, đều có \`inThongTin()\`. Viết lại y hệt ba lần? Sửa một chỗ phải nhớ sửa ba nơi?

Ngày 15 mở phần lớn nhất của OOP: KẾ THỪA. Một class có thể nhận lại toàn bộ những gì class khác đã có, rồi thêm phần của riêng mình — với \`extends\` và \`super\`. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
