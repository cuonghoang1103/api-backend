/** "100 Ngày Java với CuongThai" — Ngày 16: Đa hình.
    Bài Ngày 15 kết bằng đúng mảng `PhuongTien[]` này nên phần mở phải nối
    thẳng vào đó. Ngày 17 (abstract) trỏ ngược về chi tiết "Hinh.dienTich()
    trả 0 là vô nghĩa" ở phần kết — giữ nguyên ý đó khi sửa.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 16,
  card: 'java-day-16',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-shape-hierarchy-with-polymorphic-area-calculation',
    title: 'Hệ lớp hình học tính diện tích đa hình',
  },

  content: `🎭 100 NGÀY JAVA — NGÀY 16: ĐA HÌNH

Hôm qua tôi để lại hai dòng này:

\`\`\`java
PhuongTien[] ds = { new XeMay(…), new OTo(…) };
for (PhuongTien p : ds) p.moTa();
\`\`\`

Một mảng chứa hai loại khác nhau, một lời gọi duy nhất, mỗi phần tử trả lời một kiểu — và không có câu \`if\` nào. Hôm nay ta mổ xẻ vì sao nó chạy được, và vì sao đây mới là lý do OOP tồn tại.

━━━━━━━━━━━━━━━━━━━━

📌 CÁCH CŨ: CHUỖI if DÀI VÔ TẬN

Chưa có đa hình thì tính diện tích nhiều hình phải viết thế này:

\`\`\`java
double dienTich(String loai, double a, double b) {
    if (loai.equals("tron"))          return Math.PI * a * a;
    else if (loai.equals("chunhat"))  return a * b;
    else if (loai.equals("vuong"))    return a * a;
    return 0;
}
\`\`\`

Thêm hình tam giác? Sửa hàm này. Thêm hình thang? Sửa nữa. Mà hàm này nằm giữa chương trình, ai cũng gọi — mỗi lần sửa là một lần có cơ hội làm vỡ chỗ khác.

━━━━━━━━━━━━━━━━━━━━

🎯 CÁCH CỦA OOP: MỖI HÌNH TỰ BIẾT TÍNH

\`\`\`java
class Hinh {
    double dienTich() { return 0; }
    String ten() { return "Hinh"; }
}

class HinhTron extends Hinh {
    private double r;
    HinhTron(double r) { this.r = r; }
    @Override double dienTich() { return Math.PI * r * r; }
    @Override String ten() { return "Hinh tron"; }
}

class HinhChuNhat extends Hinh {
    protected double dai, rong;
    @Override double dienTich() { return dai * rong; }
}

class HinhVuong extends HinhChuNhat {
    HinhVuong(double canh) { super(canh, canh); }   // vuông LÀ MỘT chữ nhật
}
\`\`\`

Rồi tất cả gọn trong một vòng lặp:

\`\`\`java
Hinh[] ds = { new HinhTron(2), new HinhChuNhat(3,4), new HinhVuong(5) };
for (Hinh h : ds)
    System.out.printf("%-12s dien tich %.2f%n", h.ten(), h.dienTich());
\`\`\`

Chạy thật:

\`\`\`
Hinh tron    dien tich 12.57
Hinh chu nhat dien tich 12.00
Hinh vuong   dien tich 25.00
tong dien tich 49.57
\`\`\`

Ba công thức khác nhau, một dòng lệnh gọi. Và mai có thêm \`HinhTamGiac\`, bạn viết thêm MỘT class — vòng lặp trên không sửa một chữ nào.

━━━━━━━━━━━━━━━━━━━━

🔍 VÌ SAO CHẠY ĐƯỢC: KIỂU KHAI BÁO ≠ KIỂU THẬT

\`\`\`java
Hinh h = new HinhTron(1);
System.out.println(h.getClass().getSimpleName());   // HinhTron
\`\`\`

Biến \`h\` khai kiểu \`Hinh\`, nhưng thứ nằm trong heap là một \`HinhTron\` thật.

- **Trình dịch** nhìn bên TRÁI dấu \`=\`: nó chỉ cho phép gọi những gì \`Hinh\` có.
- **JVM lúc chạy** nhìn bên PHẢI: nó gọi bản \`dienTich()\` của \`HinhTron\`.

Cơ chế này tên là *dynamic dispatch* (hay late binding): quyết định gọi bản nào diễn ra lúc CHẠY, không phải lúc dịch. Đó là toàn bộ phép màu.

━━━━━━━━━━━━━━━━━━━━

🚧 CÁI GIÁ PHẢI TRẢ

Lập trình theo kiểu cha thì mất quyền gọi phần riêng của con:

\`\`\`java
class A { void chung() {} }
class B extends A { void rieng() {} }

A a = new B();
a.rieng();     // ✗ error: cannot find symbol
               //   symbol: method rieng()
\`\`\`

Đối tượng ĐÚNG là \`B\`, method \`rieng()\` có thật, nhưng trình dịch chỉ thấy \`A\`. Muốn dùng thì phải nói rõ:

\`\`\`java
if (a instanceof B b) {    // Java 16+: kiểm tra và ép kiểu một nhịp
    b.rieng();
}
\`\`\`

Nhưng cẩn thận: nếu code của bạn phải \`instanceof\` liên tục để biết đang cầm loại gì, thì đó là dấu hiệu THIẾT KẾ SAI — bạn đang viết lại chuỗi \`if\` ở đầu bài bằng cú pháp khác. Việc đúng là đẩy hành vi đó xuống thành một method mà mọi lớp con đều trả lời được.

━━━━━━━━━━━━━━━━━━━━

🔓 NGUYÊN TẮC MỞ/ĐÓNG

Đây là tên gọi chính thức cho thứ vừa xảy ra: **mở để mở rộng, đóng với sửa đổi**.

\`\`\`java
void inTatCa(Hinh[] ds) { … }        // viết một lần, không đụng lại

class HinhTamGiac extends Hinh { … } // thêm bao nhiêu cũng được
\`\`\`

Mã đang chạy tốt thì càng ít bị mở ra sửa càng tốt — mỗi lần sửa là một lần có thể làm hỏng. Đa hình cho bạn thêm tính năng mà không phải đụng vào phần đã ổn định.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm \`HinhTamGiac\` vào ví dụ trên, chỉ viết class mới, không sửa vòng lặp.
2. In \`getClass().getSimpleName()\` của từng phần tử trong mảng \`Hinh[]\`.
3. Gán \`Hinh h = new HinhTron(2)\` rồi gọi một method chỉ \`HinhTron\` có — đọc lỗi.
4. Dùng \`if (h instanceof HinhTron t)\` để gọi được method đó.
5. Viết lại bài toán bằng chuỗi \`if\` như đầu bài, rồi tự đếm: thêm một hình mới thì mỗi cách phải sửa mấy chỗ?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Đa hình là: lập trình theo kiểu CHA, còn việc trả lời để cho lớp CON. Trình dịch canh bên trái, JVM chạy bên phải, và chuỗi \`if\` biến mất.

Nhưng nhìn lại class \`Hinh\` thì thấy nó gượng:

\`\`\`java
class Hinh {
    double dienTich() { return 0; }   // diện tích của "hình chung chung"?
}
\`\`\`

Trả về 0 là vô nghĩa — "hình" nói chung làm gì có diện tích. Tệ hơn: \`new Hinh()\` vẫn hợp lệ, và ai đó quên ghi đè \`dienTich()\` ở lớp con thì lặng lẽ nhận số 0, không một lời cảnh báo.

Ngày 17: \`abstract\` — cách nói "class này chỉ nêu YÊU CẦU, không tự làm; đứa nào kế thừa thì bắt buộc phải làm". Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
