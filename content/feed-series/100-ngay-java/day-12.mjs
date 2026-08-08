/** "100 Ngày Java với CuongThai" — Ngày 12: Constructor.
    Nối thẳng vào Ngày 11 (new xong mới gán từng field) và Ngày 10 (nạp
    chồng, shadowing). Bài Ngày 13 sẽ trỏ ngược về "constructor là nơi
    duy nhất đối tượng ra đời" nên đừng đổi cái ý đó khi sửa.

    Mọi output và mọi thông điệp lỗi trong bài là kết quả THẬT của
    `javac`/`java` trên JDK 21, không phải viết tay. */
export default {
  day: 12,
  card: 'java-day-12',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'overload-constructors-for-a-book-catalog-entry',
    title: 'Nạp chồng constructor cho một đầu sách',
  },

  content: `🔨 100 NGÀY JAVA — NGÀY 12: CONSTRUCTOR

Hôm qua ta đúc được đối tượng đầu tiên. Nhưng nhìn lại cách đúc thì thấy nó vụng:

\`\`\`java
SinhVien an = new SinhVien();
an.ten = "An";
an.diemTB = 9.0;
// quên an.lop = ... → lang thang một chữ null trong chương trình
\`\`\`

Ba dòng cho một sinh viên, và không gì ngăn bạn quên dòng thứ ba. Đối tượng ra đời trong trạng thái dở dang, rồi vỡ ở một chỗ khác hẳn — nơi bạn không bao giờ nghĩ để tìm.

Hôm nay ta học cách bắt buộc: muốn sinh ra thì phải khai đủ.

━━━━━━━━━━━━━━━━━━━━

📌 CÙNG TÊN CLASS, KHÔNG CÓ KIỂU TRẢ VỀ

\`\`\`java
class Sach {
    String ten;
    double gia;

    Sach(String ten, double gia) {     // ← đúng tên class, không void
        this.ten = ten;
        this.gia = gia;
    }
}

Sach s = new Sach("Clean Code", 350000);
\`\`\`

Hai luật, chỉ hai thôi: TÊN trùng tên class, và KHÔNG có kiểu trả về. Chữ \`this.\` chính là chuyện shadowing của Ngày 10 và Ngày 11 — tham số trùng tên field nên bắt buộc phải phân biệt.

Thêm \`void\` vào là hỏng, mà hỏng rất lặng lẽ:

\`\`\`java
void Sach(String ten) { this.ten = ten; }   // đây là METHOD tên Sach
new Sach("Clean Code");                     // ✗ required: no arguments
\`\`\`

Java không báo "bạn viết nhầm constructor". Nó chỉ nói \`new\` không tìm thấy constructor nhận \`String\` — vì cái bạn vừa viết chỉ là một method bình thường. Nhớ mặt lỗi này.

━━━━━━━━━━━━━━━━━━━━

⚠️ BẪY LỚN NHẤT: VIẾT MỘT CÁI LÀ MẤT CÁI MẶC ĐỊNH

Hôm qua \`new SinhVien()\` chạy ngon dù ta chưa viết constructor nào. Đó là vì Java tự cấp một constructor rỗng — nhưng CHỈ KHI bạn không viết cái nào cả.

\`\`\`java
class Sach {
    String ten;
    Sach(String ten) { this.ten = ten; }
}

new Sach();   // ✗ error: constructor Sach in class Sach
              //   cannot be applied to given types;
              //   required: String
\`\`\`

Vừa thêm một constructor có tham số là cái rỗng biến mất. Rất nhiều người mới gặp lỗi này sau khi code đang chạy tốt, và không hiểu mình đã làm gì.

Cần cả hai thì viết tay cả hai — đúng cơ chế nạp chồng của Ngày 10: cùng tên, khác danh sách tham số.

━━━━━━━━━━━━━━━━━━━━

🔁 this(…) — GỌI LẠI ANH EM, ĐỪNG CHÉP LẠI

\`\`\`java
Sach(String ten, String tacGia, double gia, int soLuong) {
    this.ten = ten;  this.tacGia = tacGia;
    this.gia = gia;  this.soLuong = soLuong;
}

Sach(String ten, String tacGia, double gia) {
    this(ten, tacGia, gia, 1);          // thiếu số lượng → mặc định 1
}

Sach() {
    this("Chua dat ten", "Khuyet danh", 0.0, 0);
}
\`\`\`

Chạy thật ba dòng \`new\`:

\`\`\`
Clean Code | Robert Martin | 350000.0 | SL 3
Effective Java | Joshua Bloch | 420000.0 | SL 1
Chua dat ten | Khuyet danh | 0.0 | SL 0
\`\`\`

Luật khởi tạo nằm ở ĐÚNG MỘT chỗ. Mai muốn số lượng mặc định là 0 thay vì 1? Sửa một dòng, cả ba lối vào cùng đúng theo.

Một ràng buộc phải nhớ: \`this(…)\` bắt buộc là câu lệnh ĐẦU TIÊN.

\`\`\`java
Sach() {
    System.out.println("hi");
    this("Chua dat ten", 0.0);   // ✗ error: call to this must be
}                                //   first statement in constructor
\`\`\`

Lý do rất hợp lý: không được phép chạm vào đối tượng trước khi nó được khởi tạo xong.

━━━━━━━━━━━━━━━━━━━━

📋 THỨ TỰ KHỞI TẠO — BA BƯỚC

\`\`\`java
class ThuTu {
    int x = 5;                    // ② giá trị lúc khai báo
    ThuTu() {
        System.out.println(x);    // in ra 5, KHÔNG phải 0
    }
}
\`\`\`

① Cấp bộ nhớ, mọi field về mặc định (\`0\` / \`false\` / \`null\` — Ngày 11)
② Gán giá trị viết ở dòng khai báo
③ Chạy thân constructor

Biết thứ tự này rồi thì không còn ngạc nhiên khi field đã có giá trị trước cả dòng lệnh đầu tiên của constructor.

━━━━━━━━━━━━━━━━━━━━

🧱 VÌ SAO ĐÂY LÀ BƯỚC NGOẶT

So hai cách viết:

\`\`\`java
// Ngày 11 — ba lời mời quên sót
SinhVien an = new SinhVien();
an.ten = "An";  an.diemTB = 9.0;

// Ngày 12 — muốn tồn tại thì phải khai đủ
SinhVien an = new SinhVien("An", 9.0, "SE1701");
\`\`\`

Cách dưới không cho bạn quên. Trình biên dịch đứng canh cửa: thiếu tham số là không dịch được, chứ không phải chạy rồi mới nổ.

Đó chính là tinh thần của cả Giai đoạn 2 — biến lỗi lúc CHẠY thành lỗi lúc DỊCH, càng sớm càng rẻ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`SinhVien(String ten, double diemTB, String lop)\` rồi thử \`new SinhVien()\` — đọc kỹ thông điệp lỗi.
2. Thêm constructor 2 tham số dùng \`this(…)\` để \`lop\` mặc định là "Chua phan lop".
3. Đổi \`this(…)\` xuống dòng thứ hai, xem lỗi \`must be first statement\`.
4. Thêm \`void\` trước tên constructor rồi giải thích vì sao \`new\` báo \`required: no arguments\`.
5. Khai \`int diem = 7;\` ở dòng khai báo và in \`diem\` ngay dòng đầu constructor. Trước khi chạy hãy đoán: 0 hay 7?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Constructor là nghi thức khai sinh: cùng tên class, không kiểu trả về, chạy đúng một lần. Nạp chồng cho nhiều lối vào, \`this(…)\` để luật khởi tạo chỉ nằm một chỗ, và nhớ rằng viết một cái là mất cái mặc định.

Nhưng còn một lỗ hổng to bằng cả cánh cửa: khai sinh chặt chẽ đến mấy thì sau đó ai cũng ghi đè được.

\`\`\`java
Sach s = new Sach("Clean Code", 350000);
s.gia = -999999;    // vẫn hợp lệ!
\`\`\`

Ngày 13 ta đóng cánh cửa đó lại bằng ĐÓNG GÓI: \`private\` + getter/setter, để dữ liệu bẩn bị chặn ngay tại cửa chứ không lọt vào trong. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
