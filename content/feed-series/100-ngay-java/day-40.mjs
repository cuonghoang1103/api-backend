/** "100 Ngày Java với CuongThai" — Ngày 40: bài tổng hợp. KHÉP GIAI ĐOẠN 5.
    Không có khái niệm mới — ghép mười công cụ của Giai đoạn 4-5 vào một
    luồng việc thật. Ngày 41 mở Giai đoạn 6 (đa luồng) nên phần kết phải
    dẫn sang đó.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21;
    chương trình ghi file tạm rồi tự xoá nên chạy lại luôn cho cùng kết
    quả. */
export default {
  day: 40,
  card: 'java-day-40',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'capstone-build-an-encapsulated-inventory',
    title: 'Đồ án nhỏ: kho hàng có đóng gói',
  },

  content: `🧩 100 NGÀY JAVA — NGÀY 40: GHÉP TẤT CẢ LẠI

Hôm nay không có khái niệm mới. Ta viết MỘT chương trình dùng gần hết những gì đã học ở Giai đoạn 4 và 5 — để bạn thấy chúng không phải mười thứ rời rạc.

Bài toán: đọc file điểm, bỏ qua dòng hỏng, thống kê theo lớp và theo xếp loại.

━━━━━━━━━━━━━━━━━━━━

📌 BƯỚC 1 — MÔ HÌNH DỮ LIỆU

\`\`\`java
enum XepLoai {
    XUAT_SAC("Xuat sac"), GIOI("Gioi"), KHA("Kha"), TRUNG_BINH("Trung binh");

    static XepLoai tu(double d) {
        return switch ((int) d) {          // Ngày 39
            case 9, 10 -> XUAT_SAC;
            case 8 -> GIOI;
            case 7 -> KHA;
            default -> TRUNG_BINH;
        };
    }
}

record SinhVien(String ten, String lop, double diem) {
    SinhVien {                              // Ngày 13 + 38
        if (diem < 0 || diem > 10)
            throw new IllegalArgumentException("Diem ngoai 0-10: " + diem);
    }
    XepLoai xepLoai() { return XepLoai.tu(diem); }
}
\`\`\`

Bảy dòng cho toàn bộ mô hình. \`record\` lo constructor/equals/hashCode/toString, \`enum\` lo tập giá trị đóng, constructor gọn lo chặn dữ liệu bẩn.

━━━━━━━━━━━━━━━━━━━━

📥 BƯỚC 2 — ĐỌC FILE VÀ BÓC DỮ LIỆU

File có một dòng hỏng cố ý:

\`\`\`
An|SE01|9.5
Binh|SE01|7.0
Chi|SE02|8.5
DONG HONG          ← không đúng khuôn
Dung|SE02|6.5
Em|SE01|8.0
\`\`\`

\`\`\`java
static final Pattern DONG =
    Pattern.compile("^(?<ten>[\\\\w ]+)\\\\|(?<lop>\\\\w+)\\\\|(?<diem>\\\\d+(\\\\.\\\\d+)?)$");

static Optional<SinhVien> doc(String dong) {         // Ngày 32 + 35
    Matcher m = DONG.matcher(dong.trim());
    if (!m.matches()) return Optional.empty();
    return Optional.of(new SinhVien(m.group("ten"), m.group("lop"),
                                     Double.parseDouble(m.group("diem"))));
}
\`\`\`

Kiểu trả về \`Optional\` nói thẳng: dòng này có thể không đọc được. Người gọi không quên được.

\`\`\`java
try (Stream<String> st = Files.lines(f)) {           // Ngày 23 + 34
    ds = st.map(TongHop::doc)
           .flatMap(Optional::stream)                // Ngày 31 + 32
           .collect(Collectors.toList());
}
\`\`\`

\`\`\`
1) doc duoc 5 sinh vien, bo qua dong hong
\`\`\`

Để ý \`flatMap(Optional::stream)\`: \`Optional\` rỗng thành dòng rỗng và biến mất, \`Optional\` có giá trị thành một phần tử. Dòng hỏng bị loại mà không cần một câu \`if\` nào.

Và \`Files.lines\` nằm trong \`try(...)\` — file được đóng kể cả khi giữa chừng có lỗi.

━━━━━━━━━━━━━━━━━━━━

📊 BƯỚC 3 — THỐNG KÊ

\`\`\`java
ds.stream().filter(s -> s.diem() >= 8.0)
           .map(SinhVien::ten).sorted()
           .collect(Collectors.joining(", "));
\`\`\`

\`\`\`
2) gioi tro len -> An, Chi, Em
\`\`\`

Gom nhóm theo lớp và theo xếp loại:

\`\`\`java
Collectors.groupingBy(SinhVien::lop, TreeMap::new,
                      Collectors.averagingDouble(SinhVien::diem));

Collectors.groupingBy(SinhVien::xepLoai, () -> new EnumMap<>(XepLoai.class),
                      Collectors.counting());
\`\`\`

\`\`\`
3) TB lop SE01 8.17 | SE02 7.50
4) theo xep loai -> {XUAT_SAC=1, GIOI=2, KHA=1, TRUNG_BINH=1}
\`\`\`

Chú ý cả hai đều chỉ định kiểu \`Map\` thay vì để mặc định: \`TreeMap\` cho thứ tự theo tên lớp, \`EnumMap\` cho thứ tự khai báo enum. Để \`HashMap\` mặc định thì thứ tự in ra đổi giữa các lần chạy — thứ đã suýt làm hỏng thẻ bài học của Ngày 25 và 31.

Tìm người cao điểm nhất — và \`Optional\` lại xuất hiện, vì danh sách có thể rỗng:

\`\`\`java
ds.stream().max(Comparator.comparingDouble(SinhVien::diem))   // Ngày 26
  .map(s -> s.ten() + " (" + s.xepLoai().nhan() + ")")
  .orElse("khong co");
\`\`\`

\`\`\`
5) cao nhat -> An (Xuat sac)
6) chan du lieu ban -> Diem ngoai 0-10: 99.0
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔗 ĐẾM LẠI: MƯỜI CÔNG CỤ TRONG MỘT LUỒNG VIỆC

\`Files\` · \`try-with-resources\` · \`Stream\` · \`Optional\` · \`Collectors\` · regex · \`record\` · \`enum\` · \`switch\` biểu thức · \`Comparator\` — cộng thêm ngoại lệ và đóng gói từ Giai đoạn 2-3.

Chúng không phải mười bài học rời. Chúng sinh ra để ghép:

- \`Optional\` sinh ra để hợp với \`Stream\` (\`flatMap(Optional::stream)\`)
- \`record\` sinh ra để hợp với \`Collectors\` (bất biến nên làm khoá nhóm an toàn)
- \`enum\` sinh ra để hợp với \`switch\` biểu thức (phủ hết nhánh là lỗi lúc dịch)
- \`Files.lines\` sinh ra để hợp với \`try-with-resources\`

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP TỔNG HỢP

Viết lại chương trình trên theo yêu cầu của bạn:

1. Thêm cột "số buổi vắng", loại khỏi thống kê ai vắng quá 3 buổi.
2. Ghi kết quả thống kê ra một file mới thay vì in ra màn hình.
3. Thêm \`enum HocKy\` và gom nhóm hai tầng: theo học kỳ, rồi theo lớp.
4. Đọc file có 100.000 dòng và đo thời gian — kiểm chứng \`Files.lines\` không làm tràn bộ nhớ.
5. Dòng hỏng hiện đang bị bỏ im lặng. Sửa để nó ghi log kèm số dòng, đúng tinh thần Ngày 21.

━━━━━━━━━━━━━━━━━━━━

🏁 HẾT GIAI ĐOẠN 5 — BỐN MƯƠI NGÀY

Nhìn lại chặng đường:

- **1-10** nền tảng: biến, vòng lặp, mảng, chuỗi, method
- **11-20** OOP trọn vẹn: class tới \`equals\`/\`hashCode\`
- **21-23** ngoại lệ
- **24-28** collections
- **29-40** Java hiện đại: generics, lambda, stream, optional, date/time, file, regex, StringBuilder, enum, record, switch mới

Bạn đọc và viết được Java như trong dự án thật. Đó là bốn mươi phần trăm chặng đường, và là phần nền quan trọng nhất.

Nhưng mọi chương trình ta viết tới giờ đều làm một việc tại một thời điểm. Thử đoán kết quả đoạn này:

\`\`\`java
int dem = 0;
// hai luồng, mỗi luồng cộng dem lên 10.000 lần
\`\`\`

Bạn nghĩ là 20.000? Chạy thật thì hiếm khi ra đúng con số đó — và mỗi lần chạy lại một kết quả khác nhau.

Ngày 41 mở Giai đoạn 6: **đa luồng** — vì sao phép cộng đơn giản nhất cũng mất số khi có hai luồng, và cách sửa. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
