/** "100 Ngày Java với CuongThai" — Ngày 29: Generics. MỞ GIAI ĐOẠN 5.
    Trả lời cặp ngoặc <> đã dùng suốt Giai đoạn 4 mà Ngày 24/28 chỉ hứa
    "sẽ giải thích sau". Ngày 30 (Lambda) trỏ ngược về lớp nặc danh của
    Ngày 27 và phần kết ở đây.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 29,
  card: 'java-day-29',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-generic-shopping-cart-with-file-persistence-and-custom-exceptions',
    title: 'Giỏ hàng generic có lưu file và ngoại lệ riêng',
  },

  content: `📦 100 NGÀY JAVA — NGÀY 29: GENERICS

Suốt Giai đoạn 4 ta gõ cặp ngoặc nhọn ở mọi dòng mà tôi cứ hẹn "giải thích sau":

\`\`\`java
List<String>          Map<String, Integer>
Set<SinhVien>         Comparable<SinhVien>
\`\`\`

Hôm nay là "sau". Và để thấy nó giải quyết chuyện gì, hãy xem đời sống trước khi có nó.

━━━━━━━━━━━━━━━━━━━━

📌 THỜI CHƯA CÓ GENERICS

Java 1.4 trở về trước, \`List\` chứa \`Object\`:

\`\`\`java
List ds = new ArrayList();
ds.add("chuoi");
ds.add(123);                       // ai cấm đâu

String s = (String) ds.get(1);     // ✗ ClassCastException lúc CHẠY
\`\`\`

Chạy thật:

\`\`\`
7) raw type -> ClassCastException luc CHAY
\`\`\`

Hai vấn đề: phải ép kiểu ở mọi lần lấy ra, và bỏ nhầm kiểu thì tới lúc CHẠY mới nổ — có khi ở máy khách hàng.

Generics dời phép kiểm đó về lúc DỊCH. Đúng tinh thần cả loạt bài: sai thì đừng cho biên dịch.

━━━━━━━━━━━━━━━━━━━━

📦 CLASS CÓ THAM SỐ KIỂU

\`\`\`java
class Hop<T> {
    private T noiDung;
    void dat(T x) { noiDung = x; }
    T lay() { return noiDung; }
}
\`\`\`

\`T\` là một CHỖ TRỐNG. Người dùng điền kiểu thật lúc khai báo:

\`\`\`java
Hop<String> h1 = new Hop<>();
h1.dat("xin chao");
String s = h1.lay();        // không ép kiểu, và không thể sai

Hop<Integer> h2 = new Hop<>();
h2.dat(42);
h2.lay() + 8;               // 50 — Java biết đây là số
\`\`\`

\`\`\`
1) Hop<String> -> xin chao
2) Hop<Integer> -> 50
\`\`\`

Một class, dùng cho mọi kiểu, mà không mất an toàn kiểu. Đó là toàn bộ ý tưởng.

Quy ước đặt tên (chỉ là quy ước, nhưng cả thế giới theo): \`T\` — Type, \`E\` — Element, \`K\`/\`V\` — Key/Value, \`R\` — Result.

━━━━━━━━━━━━━━━━━━━━

🔒 RÀNG BUỘC: extends

Bên trong class generic, \`T\` có thể là bất cứ gì — nên bạn chỉ gọi được method của \`Object\`. Muốn hơn thì phải ràng buộc:

\`\`\`java
class ThongKe<T extends Comparable<T>> {
    private final List<T> ds = new ArrayList<>();
    T lonNhat() { return Collections.max(ds); }
}
\`\`\`

\`\`\`
3) lon nhat -> 19
\`\`\`

\`T extends Comparable<T>\` nghĩa là "chỉ nhận kiểu nào so sánh được" (Ngày 26). Nhờ vậy \`Collections.max\` dùng được. Ai đó thử \`ThongKe<Object>\` sẽ bị chặn ngay lúc dịch.

Lưu ý: ở đây \`extends\` dùng cho cả interface, không riêng class — một chỗ dùng chữ khác nghĩa thường ngày.

━━━━━━━━━━━━━━━━━━━━

🃏 WILDCARD ? — VÌ SAO List&lt;Integer&gt; KHÔNG PHẢI List&lt;Number&gt;

Trực giác nói \`Integer\` LÀ MỘT \`Number\` (Ngày 15), nên \`List<Integer>\` chắc là \`List<Number>\`. **Sai.**

Nếu đúng thì:

\`\`\`java
List<Number> ns = dsInteger;   // giả sử cho phép
ns.add(3.14);                  // hợp lệ với List<Number>!
\`\`\`

…và \`dsInteger\` vừa nhận một \`Double\`. Java cấm ngay từ dòng đầu để chuyện đó không xảy ra.

Nhưng thế thì làm sao viết một hàm nhận danh sách số bất kỳ? Dùng wildcard:

\`\`\`java
static double tong(List<? extends Number> ds) {
    double s = 0;
    for (Number n : ds) s += n.doubleValue();
    return s;
}
\`\`\`

\`\`\`
5) wildcard tong  -> 6.0 / 4.0
\`\`\`

Mẹo nhớ **PECS** — *Producer Extends, Consumer Super*: danh sách để ĐỌC ra thì \`? extends\`, để GHI vào thì \`? super\`.

━━━━━━━━━━━━━━━━━━━━

👻 TYPE ERASURE — LÚC CHẠY KIỂU BIẾN MẤT

Đây là điều làm nhiều người ngạc nhiên:

\`\`\`java
Hop<String> h1 = new Hop<>();
Hop<Integer> h2 = new Hop<>();
h1.getClass() == h2.getClass();   // true
\`\`\`

\`\`\`
6) erasure: cung mot class? true
\`\`\`

Generics chỉ tồn tại lúc DỊCH. Biên dịch xong, mọi \`<T>\` bị xoá sạch — bytecode chỉ còn \`Hop\` trần. Java làm vậy để code cũ (viết trước Java 5) vẫn chạy trên JVM mới.

Hệ quả phải nhớ:

- Không có \`new T[]\` — JVM lúc chạy không biết \`T\` là gì
- Không \`instanceof List<String>\` — chỉ \`instanceof List\`
- Không tạo được đối tượng \`new T()\`

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`Cap<A, B>\` giữ hai giá trị khác kiểu, có \`getA()\`/\`getB()\`.
2. Viết \`Kho<T>\` với \`them\`, \`lay(int)\`, \`size()\`; thử với \`String\` và \`SinhVien\`.
3. Viết \`<T extends Comparable<T>> T lonNhat(List<T> ds)\` không dùng \`Collections.max\`.
4. Viết \`in(List<?> ds)\` in mọi danh sách, rồi thử ép \`add\` vào — đọc lỗi.
5. Tạo \`List\` raw, bỏ lẫn \`String\` và \`Integer\`, rồi ép kiểu để tự gặp \`ClassCastException\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Generics cho phép dùng lại một đoạn code cho mọi kiểu mà không mất an toàn kiểu: lỗi kiểu chuyển từ lúc chạy về lúc dịch, và hết cảnh ép kiểu ở mọi lần lấy ra. Ràng buộc bằng \`extends\`, mở rộng bằng wildcard, và nhớ rằng lúc chạy thì kiểu đã bị xoá.

Còn một thứ nữa từ Ngày 27 tôi hẹn sẽ quay lại — đoạn code xấu này:

\`\`\`java
ds.sort(new Comparator<SinhVien>() {
    @Override
    public int compare(SinhVien a, SinhVien b) {
        return a.ten.compareTo(b.ten);
    }
});
\`\`\`

Năm dòng, mà việc thật chỉ có một: *so hai cái tên*. Bốn dòng còn lại là thủ tục.

Ngày 30: **Lambda** — năm dòng trên rút còn \`(a, b) -> a.ten.compareTo(b.ten)\`, và đó là bước ngoặt lớn nhất của Java hiện đại. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
