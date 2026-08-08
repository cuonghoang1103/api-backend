/** "100 Ngày Java với CuongThai" — Ngày 15: Kế thừa.
    Trả lời câu hỏi bài Ngày 14 bỏ ngỏ (ba class cùng có tên/ngày sinh,
    chép ba lần?). Dùng lại `protected` của Ngày 13, luật "câu lệnh đầu
    tiên" của Ngày 12, nạp chồng của Ngày 10, equals của Ngày 09.
    Ngày 16 (Đa hình) trỏ ngược về mảng `PhuongTien[]` ở đây.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 15,
  card: 'java-day-15',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-constructor-chaining-in-a-vehicle-class-hierarchy',
    title: 'Chuỗi constructor trong hệ lớp phương tiện',
  },

  content: `🧬 100 NGÀY JAVA — NGÀY 15: KẾ THỪA

Hôm qua tôi để lại một câu hỏi: \`NhanVien\`, \`SinhVien\`, \`KhachHang\` đều có tên, ngày sinh, số điện thoại, đều có \`inThongTin()\`. Chép ba lần? Rồi sửa một chỗ phải nhớ sửa đủ ba nơi?

Hôm nay là cách trả lời của OOP — và cũng là công cụ bị lạm dụng nhiều nhất trong nghề.

━━━━━━━━━━━━━━━━━━━━

📌 extends — NHẬN LẠI TOÀN BỘ, RỒI THÊM PHẦN RIÊNG

\`\`\`java
class PhuongTien {
    protected String hang;
    protected int namSX;

    PhuongTien(String hang, int namSX) {
        this.hang = hang;
        this.namSX = namSX;
    }

    void khoiDong() { System.out.println(hang + ": vroom"); }
}

class XeMay extends PhuongTien {   // có sẵn hang, namSX, khoiDong()
    private int phanKhoi;          // thêm phần của riêng xe máy
}
\`\`\`

\`XeMay\` không viết lại \`khoiDong()\` mà vẫn gọi được — nó nhận lại từ cha.

Chú ý \`protected\` chứ không phải \`private\`: theo bốn mức truy cập của Ngày 13, \`private\` thì ngay cả lớp con cũng không thấy. \`protected\` mở đúng một bậc — con thấy, người ngoài vẫn không.

━━━━━━━━━━━━━━━━━━━━

👨‍👦 super(…) — CHA XONG MỚI TỚI CON

\`\`\`java
XeMay(String hang, int namSX, int phanKhoi) {
    super(hang, namSX);        // ← câu lệnh ĐẦU TIÊN
    this.phanKhoi = phanKhoi;
}
\`\`\`

Chạy thật, in ra đúng thứ tự:

\`\`\`
[cha] PhuongTien khoi tao truoc
[con] XeMay khoi tao sau
\`\`\`

Luật này bạn gặp rồi — Ngày 12 nói \`this(…)\` phải đứng đầu, giờ \`super(…)\` cũng vậy, và vì cùng một lý do: phần nền phải dựng xong trước khi ai được chạm vào đối tượng.

Quên \`super(…)\` khi cha không có constructor rỗng thì lỗi ngay lúc dịch:

\`\`\`java
class Cha { Cha(int x) { } }
class Con extends Cha {
    Con() { }     // ✗ constructor Cha in class Cha cannot be
}                 //   applied to given types;
                  //   required: int   found: no arguments
\`\`\`

Java ngầm chèn \`super()\` không tham số vào đầu mọi constructor — mà cha ở đây không có cái nào nhận zero tham số. Đúng cái bẫy "viết một constructor là mất cái mặc định" của Ngày 12, lần này nó cắn từ phía lớp con.

━━━━━━━━━━━━━━━━━━━━

🖊️ @Override — VIẾT ĐÈ CHỨ KHÔNG XOÁ

\`\`\`java
@Override
void moTa() {
    super.moTa();                                  // dùng lại phần của cha
    System.out.println("  -> xe may " + phanKhoi + "cc");
}
\`\`\`

Kết quả thật:

\`\`\`
Phuong tien Honda (2024)
  -> xe may 150cc
\`\`\`

\`super.moTa()\` gọi bản của cha rồi bồi thêm phần của con — không phải xoá đi làm lại.

\`@Override\` là thứ bạn nên gõ mỗi lần, dù nó không bắt buộc. Không có nó, gõ nhầm \`motA()\` thay vì \`moTa()\` sẽ thành một method MỚI hoàn toàn hợp lệ; chương trình dịch được, chạy được, chỉ là gọi \`moTa()\` vẫn ra bản của cha và bạn ngồi tìm cả buổi. Có \`@Override\`, trình dịch chặn ngay.

Phân biệt kỹ với Ngày 10: **cùng tên + KHÁC tham số** trong cùng một class là nạp chồng. **Cùng tên + CÙNG tham số** ở lớp con mới là ghi đè.

━━━━━━━━━━━━━━━━━━━━

🚧 MỘT CHA DUY NHẤT — VÀ ÔNG TỔ TÊN Object

\`\`\`java
class A extends B, C     // ✗ Java KHÔNG cho đa kế thừa class
\`\`\`

C++ cho, và trả giá bằng "bài toán kim cương": hai cha cùng có \`in()\`, gọi cái nào? Java cắt phăng — mỗi class đúng một cha.

Còn class không viết \`extends\` thì sao? Nó vẫn có cha: \`Object\`. Đây chính là chỗ \`toString()\`, \`equals()\`, \`hashCode()\` từ đâu ra — và là lý do Ngày 11 ta thấy \`equals\` mặc định chỉ so địa chỉ: đó là bản của \`Object\`, kế thừa xuống mà chưa ai viết đè.

Muốn một class mang nhiều "vai" cùng lúc thì có \`interface\` — Ngày 18.

━━━━━━━━━━━━━━━━━━━━

⚠️ CÁI BẪY: KẾ THỪA VÌ LƯỜI GÕ

Đây là chỗ nhiều người đi làm vẫn sai:

\`\`\`java
class DanhSachSinhVien extends ArrayList { … }   // "cho tiện, có sẵn add/remove"
\`\`\`

Phép thử trong một câu: **"DanhSachSinhVien LÀ MỘT ArrayList"** — nghe đã sai. Nó CÓ một danh sách, chứ không LÀ một danh sách.

Kế thừa sai chỗ thì lớp con thừa hưởng luôn cả những việc nó không được phép làm, và bạn không rút lại được. Quy tắc: kế thừa diễn tả quan hệ **LÀ MỘT**, không phải mẹo tiết kiệm dòng code. Khi câu đó nghe sai, thứ bạn cần là "CÓ MỘT" — tức là composition, sẽ nói kỹ ở Ngày 19.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`Nguoi\` (tên, tuổi) rồi \`SinhVien extends Nguoi\` thêm \`mssv\`, dùng \`super(…)\`.
2. Bỏ dòng \`super(…)\` đi và đọc kỹ lỗi.
3. Ghi đè \`moTa()\` ở lớp con, gọi \`super.moTa()\` bên trong rồi in thêm phần riêng.
4. Cố tình gõ nhầm tên method khi ghi đè — một lần có \`@Override\`, một lần không. So hai kết quả.
5. Đổi field của cha từ \`protected\` sang \`private\` rồi thử đọc nó trong lớp con.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`extends\` để nhận lại, \`super(…)\` để dựng nền trước, \`@Override\` để viết đè an toàn. Một cha duy nhất, và trên cùng luôn là \`Object\`.

Nhưng sức mạnh thật của kế thừa chưa xuất hiện. Nó nằm ở dòng này:

\`\`\`java
PhuongTien[] ds = { new XeMay(…), new OTo(…) };
for (PhuongTien p : ds) p.moTa();
\`\`\`

Một mảng chứa cả xe máy lẫn ô tô. Cùng một lời gọi \`p.moTa()\`, nhưng mỗi phần tử in ra một kiểu khác nhau — và bạn không hề viết một câu \`if\` nào.

Ngày 16: ĐA HÌNH — thứ khiến OOP đáng giá. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
