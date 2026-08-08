/** "100 Ngày Java với CuongThai" — Ngày 38: record.
    Nối chỗ Ngày 37 kết (class SinhVien 30 dòng mà bản chất chỉ một câu).
    Dựa vào hợp đồng equals/hashCode của Ngày 20 và đóng gói của Ngày 13.
    Ngày 39 (switch biểu thức) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 38,
  card: 'java-day-38',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'design-an-immutable-temperature-type',
    title: 'Thiết kế kiểu nhiệt độ bất biến',
  },

  content: `📇 100 NGÀY JAVA — NGÀY 38: RECORD

Hôm qua tôi để lại class \`SinhVien\` — thứ ta viết đi viết lại suốt loạt bài:

\`\`\`java
class SinhVien {
    private final String ten;
    private final double diem;

    SinhVien(String ten, double diem) { this.ten = ten; this.diem = diem; }

    String getTen() { return ten; }
    double getDiem() { return diem; }

    @Override public boolean equals(Object o) { … }   // 5 dòng
    @Override public int hashCode() { … }
    @Override public String toString() { … }
}
\`\`\`

Ba mươi dòng cho một câu: *"sinh viên gồm tên và điểm"*. Java 16 cho phép viết đúng câu đó.

━━━━━━━━━━━━━━━━━━━━

📌 MỘT DÒNG

\`\`\`java
record SinhVien(String ten, double diem) { }
\`\`\`

Hết. Java tự sinh cho bạn: constructor đầy đủ, getter cho từng field, \`equals\`, \`hashCode\`, \`toString\`.

\`\`\`
1) toString tu sinh -> SinhVien[ten=An, diem=9.5]
2) getter khong co chu get -> An / 9.5
\`\`\`

Chú ý getter **không có chữ \`get\`**: \`a.ten()\` chứ không phải \`a.getTen()\`. Tên field chính là tên method.

Và \`toString\` sinh sẵn in ra đủ mọi field — không còn cảnh nhìn thấy \`SinhVien@1b6d3586\` như Ngày 20.

━━━━━━━━━━━━━━━━━━━━

🤝 HỢP ĐỒNG NGÀY 20 ĐƯỢC THOẢ SẴN

\`\`\`java
SinhVien a = new SinhVien("An", 9.5);
SinhVien b = new SinhVien("An", 9.5);

a.equals(b);                        // true
new HashSet<>(List.of(a, b)).size(); // 1
Map.of(a, "SE01").get(b);            // "SE01"
\`\`\`

\`\`\`
3) equals tu sinh -> true | hashCode bang nhau -> true
4) HashSet coi la trung -> 1 phan tu
8) record co the lam khoa Map: lop SE01
\`\`\`

Nhớ Ngày 20 chứ — viết \`equals\` mà quên \`hashCode\` thì dữ liệu "biến mất" trong \`HashMap\`. Với \`record\`, Java sinh cả hai dựa trên đúng bộ field, luôn nhất quán. Một lớp bug bị xoá sổ.

Và vì mọi field đều \`final\` (bất biến), \`record\` là khoá \`Map\` lý tưởng: không ai đổi nội dung sau khi nó đã nằm trong bảng băm — đúng cái bẫy ở bài tập Ngày 26.

━━━━━━━━━━━━━━━━━━━━

✅ VẪN KIỂM ĐƯỢC DỮ LIỆU

\`record\` không có nghĩa là buông lỏng. Đóng gói của Ngày 13 vẫn giữ nguyên nhờ **constructor gọn**:

\`\`\`java
record SinhVien(String ten, double diem) {
    SinhVien {                      // không có ngoặc tham số!
        if (ten == null || ten.isBlank())
            throw new IllegalArgumentException("Ten trong");
        if (diem < 0 || diem > 10)
            throw new IllegalArgumentException("Diem ngoai 0-10");
    }

    boolean gioi() { return diem >= 8.0; }        // method thường

    SinhVien(String ten) { this(ten, 0.0); }      // constructor phụ
}
\`\`\`

\`\`\`
5) constructor phu -> SinhVien[ten=Binh, diem=0.0]
7) kiem tra -> Diem ngoai 0-10
\`\`\`

Cú pháp \`SinhVien { … }\` (không ngoặc) là constructor gọn: bạn chỉ viết phần kiểm tra, Java tự gán field phía sau. Đây chính là "chốt kiểm ngay tại cửa" của Ngày 13, viết ngắn hơn.

━━━━━━━━━━━━━━━━━━━━

🚧 KHI NÀO ĐỪNG DÙNG record

\`record\` là **class chở dữ liệu**, bất biến. Nó không hợp với:

\`\`\`java
record TaiKhoan(String chu, double soDu) { }   // ✗ số dư phải đổi được
\`\`\`

Đối tượng có TRẠNG THÁI ĐỔI theo thời gian — tài khoản ngân hàng, giỏ hàng, kết nối — thì dùng class thường. Bắt \`record\` làm việc đó nghĩa là mỗi lần đổi phải tạo đối tượng mới, rất phiền.

Và \`record\` luôn \`final\`: không kế thừa được, cũng không kế thừa từ class khác (nhưng \`implements interface\` thì được — Ngày 18).

Chỗ \`record\` toả sáng:

- DTO — dữ liệu đi vào/ra khỏi API
- Kết quả trả về nhiều giá trị (thay cho việc trả \`Object[]\` hay tự viết class \`Cap\`)
- Khoá của \`Map\`
- Đối tượng cấu hình

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Đổi class \`SinhVien\` cũ của bạn thành \`record\`, chạy lại toàn bộ code cũ.
2. Thêm constructor gọn kiểm \`diem\` trong khoảng 0–10.
3. Cho hai \`record\` cùng nội dung vào \`HashSet\` và đếm.
4. Viết \`record Diem(double x, double y)\` có method \`khoangCach(Diem k)\`.
5. Thử \`class A extends record B\` — đọc lỗi và giải thích.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`record\` là cách nói "class này chỉ để chở dữ liệu": một dòng khai báo, Java lo constructor, getter, \`equals\`, \`hashCode\`, \`toString\`. Vẫn kiểm tra được dữ liệu, vẫn thêm được method — chỉ là không đổi được sau khi tạo.

Hôm qua trong enum ta viết đoạn này:

\`\`\`java
switch (this) {
    case CHO_XAC_NHAN: return DANG_GIAO;
    case DANG_GIAO:    return HOAN_TAT;
    default:           return this;
}
\`\`\`

Kiểu \`switch\` cũ từ Ngày 5: phải \`return\` hoặc \`break\` ở mỗi nhánh, quên một chữ \`break\` là "rơi" xuống nhánh dưới — một trong những lỗi âm thầm kinh điển nhất của Java.

Ngày 39: \`switch\` **biểu thức** với mũi tên \`->\`, không còn rơi nhánh, trả thẳng giá trị — cộng với pattern matching, thứ làm code kiểm tra kiểu gọn hẳn đi. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
