/** "100 Ngày Java với CuongThai" — Ngày 11, mở Giai đoạn 2 (OOP).
    Bài này trỏ ngược về Ngày 02 (luật tên file), Ngày 08 (mảng & tham
    chiếu), Ngày 09 (equals) và Ngày 10 (method, biến local, shadowing) —
    sửa nội dung những ngày đó thì phải sửa cả các mốc nhắc lại ở đây.

    Mọi output trong bài là output THẬT của `javac`+`java` trên JDK 21,
    không phải viết tay. Kiểm lại được bằng chương trình ở day-11 lesson
    card (`content/lesson-cards/java-day-11.mjs`, khối `verify`). */
export default {
  day: 11,
  card: 'java-day-11',
  /* Ảnh phải mang số phiên bản: URL `java-day-11.webp` (không hậu tố) đã bị
     Cloudflare cache một phản hồi 404 trước khi ảnh kịp upload, và cache đó
     không xoá được từ repo. Xem chú thích `cardRev` trong seeder. */
  cardRev: 2,
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'model-a-2d-point-class',
    title: 'Dựng class Point 2D đầu tiên của bạn',
  },

  content: `🏠 100 NGÀY JAVA — NGÀY 11: CLASS & OBJECT

Giai đoạn 2 bắt đầu. Hôm qua ta khép lại phần nền: biến, vòng lặp, mảng, method. Nhưng còn một vết nứt chưa vá — dữ liệu và hành vi vẫn nằm rời nhau.

Muốn quản lý 30 sinh viên, đến giờ bạn chỉ có một cách:

\`\`\`java
String[] ten   = new String[30];
double[] diemTB = new double[30];
boolean[] daTotNghiep = new boolean[30];
\`\`\`

Ba mảng chạy song song, và sự thật "ten[7] với diemTB[7] là cùng MỘT người" chỉ tồn tại trong đầu bạn — không nằm ở đâu trong code cả. Xoá nhầm một phần tử ở mảng này mà quên mảng kia là dữ liệu lệch hàng, im lặng, không báo lỗi.

Hôm nay ta gom chúng về chung một nhà.

━━━━━━━━━━━━━━━━━━━━

📌 CLASS LÀ KHUÔN, OBJECT LÀ SẢN PHẨM ĐÚC RA

\`\`\`java
public class SinhVien {
    String ten;              // field — mỗi đối tượng giữ một bản riêng
    double diemTB;

    void gioiThieu() {       // method — làm việc với dữ liệu CỦA CHÍNH NÓ
        System.out.println("Toi la " + ten + ", diem " + diemTB);
    }
}
\`\`\`

Để ý \`void gioiThieu()\` KHÔNG còn chữ \`static\` như suốt mười ngày qua. \`static\` nghĩa là "thuộc về class, gọi thẳng không cần đối tượng". Bỏ nó đi là ta nói: method này phục vụ một đối tượng cụ thể, và nó đọc được \`ten\`, \`diemTB\` của đối tượng đó mà không cần ai truyền vào.

Nhắc lại luật từ Ngày 2: class \`public\` tên \`SinhVien\` thì file BẮT BUỘC tên \`SinhVien.java\`.

━━━━━━━━━━━━━━━━━━━━

🏭 new — ĐÚC MỘT CHIẾC

\`\`\`java
SinhVien an = new SinhVien();
an.ten = "An";   an.diemTB = 9.0;

SinhVien binh = new SinhVien();
binh.ten = "Binh";   binh.diemTB = 7.5;

an.gioiThieu();     // Toi la An, diem 9.0
binh.gioiThieu();   // Toi la Binh, diem 7.5
\`\`\`

Một khuôn, hai chiếc bánh, mỗi chiếc mang dữ liệu riêng. Ba mảng song song ở đầu bài giờ thành một mảng duy nhất — và không còn cách nào làm lệch hàng nữa.

Đây cũng là chỗ Java tử tế hơn C: khi không còn ai trỏ tới đối tượng nữa, Garbage Collector tự dọn. Bạn không phải nhớ giải phóng.

━━━━━━━━━━━━━━━━━━━━

🎁 FIELD CÓ MẶC ĐỊNH — BIẾN LOCAL THÌ KHÔNG

Nhớ Ngày 10 chứ? \`int x;\` rồi in ra là LỖI DỊCH. Field thì ngược lại:

\`\`\`java
SinhVien moi = new SinhVien();
System.out.println(moi.diemTB);        // 0.0
System.out.println(moi.daTotNghiep);   // false
System.out.println(moi.ten);           // null   ← tham chiếu
\`\`\`

Đúng bộ mặc định của phần tử mảng ở Ngày 8, vì lý do giống hệt: cả hai đều nằm trên HEAP và được \`new\` xoá sạch bộ nhớ trước khi giao cho bạn. Biến local nằm trên STACK, không ai xoá hộ — nên Java bắt bạn tự gán.

Và cái \`null\` kia là cạm bẫy số một của người mới:

\`\`\`java
System.out.println(moi.ten.length());   // ✗ NullPointerException lúc CHẠY
\`\`\`

Dịch vẫn qua. Nổ lúc chạy. Ghi nhớ mặt chữ này, bạn sẽ gặp nó cả nghìn lần.

━━━━━━━━━━━━━━━━━━━━

🔗 BIẾN CHỈ GIỮ THAM CHIẾU, KHÔNG GIỮ ĐỐI TƯỢNG

\`\`\`java
SinhVien x = an;    // KHÔNG đúc chiếc mới — chỉ thêm một tay cầm
x.diemTB = 5.0;

System.out.println(an.diemTB);      // 5.0    ← đổi luôn!
System.out.println(x == an);        // true   ← cùng một đối tượng
\`\`\`

Chính xác là chuyện của mảng ở Ngày 8 và của pass-by-value ở Ngày 10: cái được sao chép là ĐỊA CHỈ, không phải nội dung. Hai biến, một ngôi nhà.

Mảng đối tượng cũng thế — mặc định toàn \`null\`, phải \`new\` từng chiếc:

\`\`\`java
SinhVien[] lop = new SinhVien[3];
System.out.println(lop[0]);         // null   ← chưa đúc ai cả
lop[0] = an;
System.out.println(lop[0].ten);     // An
\`\`\`

━━━━━━━━━━━━━━━━━━━━

👉 this — "CHÍNH TÔI ĐÂY"

Ngày 10 kết ở chữ shadowing: trong method, đặt biến trùng tên tham số là lỗi. Nhưng tham số trùng tên FIELD lại hoàn toàn hợp lệ — và đó chính là lúc phải có \`this\`:

\`\`\`java
void doiTen(String ten) {
    this.ten = ten;    // this.ten = field · ten = tham số
}
\`\`\`

Quên \`this\` thì sao? Không lỗi dịch, không cảnh báo, chỉ là gán tham số cho chính nó:

\`\`\`java
void doiTen(String ten) { ten = ten; }   // vô nghĩa — field KHÔNG đổi
\`\`\`

Chạy thật với field ban đầu là "cu" rồi gọi \`doiTen("moi")\`: kết quả vẫn là \`cu\`. Một bug im lặng hoàn hảo.

Một method chỉ có MỘT bản code trong bộ nhớ dù bạn đúc một nghìn đối tượng — \`this\` là thứ cho nó biết lần gọi này đang phục vụ ai.

━━━━━━━━━━━━━━━━━━━━

⚖️ VÀ ĐÂY LÀ CHỖ NGÀY 9 QUAY LẠI

\`\`\`java
SinhVien a1 = new SinhVien();   a1.ten = "An";
SinhVien a2 = new SinhVien();   a2.ten = "An";

a1 == a2                  // false  ← hai lần new = hai đối tượng
a1.equals(a2)             // FALSE  ← ơ?!
a1.ten.equals(a2.ten)     // true
\`\`\`

Ngày 9 ta học "\`==\` so địa chỉ, \`equals\` so nội dung". Nói chính xác hơn: \`equals\` của \`String\` so nội dung, vì \`String\` đã VIẾT LẠI nó. Còn \`equals\` mặc định mà mọi class thừa hưởng từ \`Object\` chỉ làm đúng một việc — so địa chỉ, y hệt \`==\`.

Muốn "hai sinh viên cùng mã số là một người" thì bạn phải tự viết \`equals\`. Ta sẽ làm đúng việc đó ở Giai đoạn 2.

━━━━━━━━━━━━━━━━━━━━

⚠️ LỖI ĐẦU TIÊN AI CŨNG GẶP

\`\`\`java
public static void main(String[] args) {
    gioiThieu();   // ✗ error: non-static method gioiThieu()
}                  //   cannot be referenced from a static context
\`\`\`

\`main\` là \`static\` — nó chạy khi CHƯA có đối tượng nào tồn tại. Còn \`gioiThieu()\` cần một đối tượng để biết \`ten\` là của ai. Phải đúc trước rồi mới gọi: \`new SinhVien().gioiThieu()\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết class \`SachGiaoKhoa\` với \`ten\`, \`tacGia\`, \`gia\` và method \`inThongTin()\`.
2. Đúc 3 cuốn, cho vào \`SachGiaoKhoa[]\`, duyệt mảng in ra tất cả.
3. In một field của phần tử chưa \`new\` để tự tay gặp NullPointerException.
4. Viết \`giamGia(double gia)\` dùng \`this.gia\`, rồi bỏ \`this\` đi và giải thích vì sao giá không đổi.
5. Đúc hai cuốn cùng tên tác giả rồi so bằng \`==\`, bằng \`equals\`, và so riêng field \`tacGia\`. Ba kết quả, giải thích cả ba.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Class là khuôn. \`new\` đúc ra object trên heap. Biến chỉ giữ tham chiếu tới nó. \`this\` là cách một method gọi tên chính đối tượng đang phục vụ.

Nhưng cách đúc hôm nay còn vụng: \`new\` xong rồi mới gán từng field một, và không gì ngăn bạn quên mất một field, để lại \`null\` hay \`0.0\` lang thang trong chương trình.

Ngày 12 ta học CONSTRUCTOR — nghi thức khai sinh bắt buộc, đảm bảo không đối tượng nào ra đời trong trạng thái dở dang. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
