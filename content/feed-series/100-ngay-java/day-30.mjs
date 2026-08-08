/** "100 Ngày Java với CuongThai" — Ngày 30: Lambda. Mốc 30/100.
    Trả nợ đoạn Comparator nặc danh 5 dòng ở Ngày 29 và lớp nặc danh của
    Ngày 27. Ngày 31 (Stream API) trỏ ngược về bốn interface hàm ở đây.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 30,
  card: 'java-day-30',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-generic-log-analyzer',
    title: 'Bộ phân tích log tổng quát',
  },

  content: `λ 100 NGÀY JAVA — NGÀY 30: LAMBDA

Một phần ba chặng đường. Và hôm nay là bước ngoặt lớn nhất của Java hiện đại.

Hôm qua tôi để lại đoạn code này:

\`\`\`java
ds.sort(new Comparator<SinhVien>() {
    @Override
    public int compare(SinhVien a, SinhVien b) {
        return a.ten.compareTo(b.ten);
    }
});
\`\`\`

Năm dòng, việc thật đúng một: *so hai cái tên*. Bốn dòng còn lại là thủ tục — tên class, tên method, dấu ngoặc, chú thích.

Java 8 (2014) cho phép viết thẳng phần việc thật:

\`\`\`java
ds.sort((a, b) -> a.ten.compareTo(b.ten));
\`\`\`

━━━━━━━━━━━━━━━━━━━━

📌 CÚ PHÁP: THAM SỐ → THÂN

\`\`\`java
(a, b) -> a + b            // hai tham số, một biểu thức
s -> s.length() > 2        // một tham số: bỏ được ngoặc
() -> "xin chao"           // không tham số
x -> {                     // nhiều câu lệnh: dùng ngoặc nhọn
    System.out.println(x);
    return x * 2;
}
\`\`\`

Không cần khai kiểu tham số — Java tự suy ra từ ngữ cảnh. Không cần \`return\` nếu thân chỉ là một biểu thức.

Chạy thật:

\`\`\`
1) cong=7.0 nhan=12.0
2) sort lambda -> [An, Binh, Chi]
3) reverseOrder -> [Chi, Binh, An]
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🎯 CHỈ HỢP LỆ VỚI INTERFACE MỘT METHOD

Lambda không phải phép màu — nó vẫn là một đối tượng, và Java cần biết nó hiện thực method nào. Nên nó chỉ dùng được với **interface có đúng một method trừu tượng**:

\`\`\`java
@FunctionalInterface
interface PhepTinh {
    double tinh(double a, double b);
}

PhepTinh cong = (a, b) -> a + b;
PhepTinh nhan = (a, b) -> a * b;
cong.tinh(3, 4);   // 7.0
\`\`\`

Một method ⇒ không nhập nhằng ⇒ Java biết \`(a, b) -> a + b\` chính là \`tinh\`.

\`@FunctionalInterface\` không bắt buộc, nhưng nên ghi: nó nhờ trình dịch canh giúp — ai đó thêm method thứ hai vào interface là báo lỗi ngay, thay vì làm vỡ mọi lambda đang dùng nó.

Nhìn lại thì \`Comparator\`, \`Runnable\`, \`Comparable\` đều là interface một method — đó là lý do chúng dùng được với lambda mà không ai phải sửa gì.

━━━━━━━━━━━━━━━━━━━━

🧰 BỐN CÁI TÊN PHẢI THUỘC

Java có sẵn một bộ interface hàm trong \`java.util.function\`, và bốn cái này chiếm 90% việc:

\`\`\`java
Predicate<T>    t -> boolean    .test()     // điều kiện lọc
Function<T,R>   t -> R          .apply()    // biến đổi
Consumer<T>     t -> void       .accept()   // làm gì đó, không trả về
Supplier<T>     () -> T         .get()      // sinh ra giá trị
\`\`\`

\`\`\`
4) Predicate=false Function=4 Supplier=xin chao
\`\`\`

Thuộc bốn cái này là đọc được phần lớn code Java hiện đại — và ngày mai, cả Stream API cũng đứng trên đúng chúng.

Dùng ngay với Collection:

\`\`\`java
so.removeIf(n -> n < 3);        // Predicate
so.forEach(n -> System.out.println(n));   // Consumer
\`\`\`

\`\`\`
5) removeIf -> [5, 9]
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔒 BIẾN NGOÀI PHẢI "EFFECTIVELY FINAL"

\`\`\`java
int dem = 0;
Runnable r = () -> System.out.println(dem);
dem = 5;   // ✗ error: local variables referenced from a lambda
           //   expression must be final or effectively final
\`\`\`

Lambda có thể chạy sau, ở luồng khác, khi biến local kia đã biến mất khỏi stack (Ngày 10). Nên Java chỉ cho phép dùng biến mà bạn KHÔNG gán lại — không cần gõ \`final\`, chỉ cần đừng đổi.

Còn đọc thì thoải mái:

\`\`\`java
int he = 10;
Function<Integer, Integer> nhanHeSo = n -> n * he;
nhanHeSo.apply(5);    // 50
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⚡ METHOD REFERENCE — GỌN HƠN NỮA

Khi lambda chỉ gọi đúng một method có sẵn:

\`\`\`java
s -> s.length()          →  String::length
s -> System.out.println(s)  →  System.out::println
(a, b) -> a.compareTo(b)    →  String::compareTo
() -> new ArrayList<>()     →  ArrayList::new
\`\`\`

Hai dấu hai chấm nghĩa là "dùng method này làm hành vi". Ngắn hơn và đọc rõ ý định hơn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`interface KiemTra { boolean kiem(int x); }\` rồi tạo ba lambda: chẵn, dương, chia hết 3.
2. Sắp danh sách sinh viên bằng lambda, rồi bằng \`Comparator.comparing(...)\`, rồi bằng method reference.
3. Dùng đủ bốn: \`Predicate\`, \`Function\`, \`Consumer\`, \`Supplier\` trong một chương trình nhỏ.
4. Gán lại một biến local đang được lambda dùng — đọc lỗi.
5. Viết một lambda rồi chuyển sang method reference; chỉ ra trường hợp KHÔNG chuyển được.

━━━━━━━━━━━━━━━━━━━━

🎯 MỐC 30/100 — NHÌN LẠI

Ba mươi ngày: nền tảng (1-10), OOP trọn vẹn (11-20), ngoại lệ (21-23), collections (24-28), generics (29), lambda (30).

Bạn đã đọc được code Java thật ngoài đời — kể cả code hiện đại đầy \`->\`.

Nhưng lambda mới chỉ là cú pháp. Sức mạnh thật hiện ra khi ghép nó vào một dây chuyền xử lý dữ liệu. Thử nhìn đoạn quen thuộc này:

\`\`\`java
List<String> ketQua = new ArrayList<>();
for (SinhVien s : ds) {
    if (s.diem >= 8.0) {
        ketQua.add(s.ten.toUpperCase());
    }
}
Collections.sort(ketQua);
\`\`\`

Bảy dòng cho ba việc: LỌC, BIẾN ĐỔI, SẮP XẾP.

Ngày 31 mở phần Stream API — bảy dòng trên thành một dây chuyền đọc như tiếng Việt: *lọc điểm ≥ 8, lấy tên viết hoa, sắp xếp, gom lại*. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
