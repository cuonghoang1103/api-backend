/** "100 Ngày Java với CuongThai" — Ngày 25: Set & Map.
    Nối thẳng chỗ Ngày 24 kết (chặn email trùng và tra số điện thoại đều
    chậm với List). Đây cũng là nơi equals/hashCode của Ngày 20 phát huy
    tác dụng thật. Ngày 26 (Comparable/Comparator) trỏ ngược về TreeSet.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. Khi in
    một HashMap phải bọc `new TreeMap<>(...)`: HashMap không hứa thứ tự nào
    nên để nguyên thì output đổi giữa các lần chạy. */
export default {
  day: 25,
  card: 'java-day-25',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-word-frequency-analyzer-using-collection-types',
    title: 'Đếm tần suất từ bằng các kiểu Collection',
  },

  content: `🗺️ 100 NGÀY JAVA — NGÀY 25: SET & MAP

Hôm qua tôi để lại hai bài toán mà \`List\` làm rất tệ:

1. Danh sách email đăng ký — chặn trùng thế nào? Gọi \`contains()\` trước mỗi lần \`add\`. Với 100.000 email thì mỗi lần kiểm là một lần quét cả danh sách.
2. Tra số điện thoại theo tên — duyệt từ đầu tới khi thấy?

Cả hai đều chậm vì \`List\` chỉ biết THỨ TỰ, không biết TRA CỨU. Hôm nay là hai cấu trúc sinh ra đúng cho hai việc đó.

━━━━━━━━━━━━━━━━━━━━

🎯 SET — TỰ CHỐNG TRÙNG

\`\`\`java
Set<String> email = new HashSet<>();
email.add("an@abc.com");     // true  — thêm được
email.add("an@abc.com");     // false — đã có rồi
\`\`\`

Chạy thật:

\`\`\`
2) them lan 2 -> false  size 1
\`\`\`

Không cần \`contains\` trước. \`add\` trả về \`boolean\` cho biết có thêm được hay không — một lời gọi, xong cả kiểm tra lẫn thêm.

Và nó nhanh: \`HashSet\` tra bằng mã băm, không quét tuần tự.

**Đây chính là chỗ Ngày 20 trả bài.** \`Set\` biết hai phần tử trùng nhau nhờ \`equals()\` + \`hashCode()\`. Class của bạn quên viết đè hai method đó thì \`Set\` sẽ nhận hai đối tượng giống hệt nhau như hai thứ khác nhau — đúng cái kết quả \`xau=2 phan tu\` ở Ngày 20.

━━━━━━━━━━━━━━━━━━━━

📑 BA LOẠI SET, BA KIỂU THỨ TỰ

Cùng thêm "chuoi", "cam", "buoi":

\`\`\`
3) LinkedHashSet giu thu tu them -> [chuoi, cam, buoi]
4) TreeSet tu sap xep            -> [buoi, cam, chuoi]
\`\`\`

- \`HashSet\` — nhanh nhất, **không hứa thứ tự nào**. Đừng bao giờ dựa vào thứ tự nó in ra.
- \`LinkedHashSet\` — giữ đúng thứ tự bạn thêm vào.
- \`TreeSet\` — tự sắp xếp tăng dần.

Mặc định chọn \`HashSet\`. Chỉ đổi khi thật sự cần thứ tự — hai loại kia trả giá bằng bộ nhớ hoặc tốc độ.

━━━━━━━━━━━━━━━━━━━━

🗺️ MAP — TRA THEO KHOÁ

\`\`\`java
Map<String, String> danhBa = new HashMap<>();
danhBa.put("An", "0912345678");
danhBa.put("Binh", "0987654321");
danhBa.put("An", "0911111111");     // CÙNG KHOÁ = ghi đè, không thêm mới
\`\`\`

Chạy thật:

\`\`\`
5) 0911111111 | size 2
\`\`\`

Ba lần \`put\` nhưng \`size\` là 2: khoá "An" chỉ tồn tại một lần, giá trị sau đè giá trị trước.

\`Map\` là cấu trúc bạn sẽ dùng nhiều nhất trong đời lập trình. Danh bạ, tồn kho theo mã hàng, cấu hình theo tên, đếm số lần xuất hiện — tất cả đều là "cho tôi khoá, trả tôi giá trị".

**Cái bẫy \`null\`:**

\`\`\`
6) khong co khoa -> null | getOrDefault -> chua co
\`\`\`

\`get()\` với khoá không tồn tại trả về \`null\`, không ném lỗi. Rồi bạn gọi method trên cái \`null\` đó và nhận \`NullPointerException\` ở một chỗ khác hẳn. Dùng \`getOrDefault(khoa, giaTriMacDinh)\` hoặc kiểm \`containsKey()\` trước.

━━━━━━━━━━━━━━━━━━━━

🔢 ĐẾM TẦN SUẤT — VIỆC MAP LÀM HAY NHẤT

Bài toán kinh điển: đếm số lần mỗi từ xuất hiện.

\`\`\`java
Map<String, Integer> dem = new HashMap<>();
for (String tu : cau.split(" ")) {
    dem.merge(tu, 1, Integer::sum);
}
\`\`\`

Với câu \`"java la java va java"\`:

\`\`\`
7) dem tu -> {java=3, la=1, va=1}
\`\`\`

\`merge(khoa, 1, Integer::sum)\` nghĩa là: chưa có khoá thì đặt 1, có rồi thì cộng thêm 1. Một dòng thay cho:

\`\`\`java
if (dem.containsKey(tu)) dem.put(tu, dem.get(tu) + 1);
else dem.put(tu, 1);
\`\`\`

Duyệt \`Map\` thì đi qua từng cặp:

\`\`\`java
for (Map.Entry<String, String> e : danhBa.entrySet()) {
    System.out.println(e.getKey() + " = " + e.getValue());
}
\`\`\`

Ba loại \`Map\` tương ứng ba loại \`Set\`: \`HashMap\` (mặc định), \`LinkedHashMap\` (giữ thứ tự thêm), \`TreeMap\` (sắp theo khoá).

━━━━━━━━━━━━━━━━━━━━

🧭 CHỌN CÁI NÀO?

| Cần gì | Dùng |
|---|---|
| Có thứ tự, cho phép trùng, truy cập theo chỉ số | \`List\` |
| Chỉ cần biết "có hay không", không trùng | \`Set\` |
| Tra giá trị theo một khoá | \`Map\` |

Câu hỏi tự đặt: *tôi sẽ tìm phần tử này bằng cách nào?* Bằng vị trí → \`List\`. Bằng chính nó → \`Set\`. Bằng một thứ khác → \`Map\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Đọc 10 email từ bàn phím vào \`Set\`, in ra số email khác nhau.
2. Cho cùng dữ liệu vào \`HashSet\`, \`LinkedHashSet\`, \`TreeSet\` rồi in cả ba.
3. Viết danh bạ bằng \`Map\`, có tra cứu và \`getOrDefault\` khi không thấy.
4. Đếm số lần xuất hiện của từng KÝ TỰ trong một chuỗi bằng \`merge\`.
5. Tạo \`Set<SinhVien>\` với class chưa viết \`equals\`/\`hashCode\`, thêm hai em cùng mssv — rồi thêm hai method đó và chạy lại.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`Set\` chống trùng, \`Map\` tra theo khoá, cả hai đều dựa trên \`hashCode\` để nhanh. Ba biến thể Hash/Linked/Tree cho ba nhu cầu thứ tự khác nhau.

Nhưng để ý \`TreeSet\` một chút: nó "tự sắp xếp" — dựa vào đâu mà biết "buoi" đứng trước "cam"?

Với \`String\` thì Java biết sẵn. Còn \`TreeSet<SinhVien>\` thì sao? Sắp theo tên, theo điểm, hay theo mã số? Java không thể đoán.

\`\`\`java
Collections.sort(dsSinhVien);   // ✗ chạy được không?
\`\`\`

Ngày 26: \`Comparable\` và \`Comparator\` — cách dạy Java biết thứ tự của class do bạn định nghĩa, và vì sao cần TỚI HAI cơ chế cho một việc nghe có vẻ đơn giản. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
