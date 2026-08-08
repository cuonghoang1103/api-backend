/** "100 Ngày Java với CuongThai" — Ngày 31: Stream API.
    Nối thẳng đoạn vòng lặp 7 dòng ở phần kết Ngày 30. Dùng lại bốn
    interface hàm của Ngày 30 và Comparator của Ngày 26. Ngày 32
    (Optional) trỏ ngược về `.max(...).get()` ở phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. Chỗ
    `groupingBy` phải chỉ định `TreeMap::new`: HashMap không hứa thứ tự
    nên để mặc định thì output đổi giữa các lần chạy. */
export default {
  day: 31,
  card: 'java-day-31',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-text-statistics-analyzer-using-collections',
    title: 'Bộ phân tích thống kê văn bản',
  },

  content: `🌊 100 NGÀY JAVA — NGÀY 31: STREAM API

Hôm qua tôi để lại đoạn code này — thứ bạn đã viết cả trăm lần:

\`\`\`java
List<String> ketQua = new ArrayList<>();
for (SinhVien s : ds) {
    if (s.getDiem() >= 8.0) {
        ketQua.add(s.getTen().toUpperCase());
    }
}
Collections.sort(ketQua);
\`\`\`

Bảy dòng cho ba việc: lọc, biến đổi, sắp xếp. Và phải đọc hết cả bảy dòng mới hiểu nó làm gì.

━━━━━━━━━━━━━━━━━━━━

📌 CÙNG VIỆC ĐÓ, VIẾT NHƯ MỘT CÂU

\`\`\`java
List<String> gioi = ds.stream()
        .filter(s -> s.getDiem() >= 8.0)        // lọc
        .map(s -> s.getTen().toUpperCase())     // biến đổi
        .sorted()                               // sắp xếp
        .collect(Collectors.toList());          // gom lại
\`\`\`

Chạy thật:

\`\`\`
1) loc+bien doi+sap -> [AN, CHI, EM]
\`\`\`

Đọc từ trên xuống: *lấy danh sách, lọc điểm ≥ 8, lấy tên viết hoa, sắp xếp, gom lại*. Đúng thứ tự bạn nghĩ trong đầu.

Khác biệt cốt lõi: vòng \`for\` mô tả **LÀM THẾ NÀO** (tạo danh sách rỗng, duyệt, kiểm, thêm vào). Stream mô tả **LÀM GÌ**. Phần "thế nào" để Java lo.

Mỗi mắt xích nhận một lambda của Ngày 30: \`filter\` cần \`Predicate\`, \`map\` cần \`Function\`. Hôm qua học từ vựng, hôm nay ghép thành câu.

━━━━━━━━━━━━━━━━━━━━

📊 THỐNG KÊ VÀ GOM NHÓM

\`\`\`java
double tb = ds.stream().mapToDouble(SinhVien::getDiem).average().orElse(0);

Map<String, Long> theoLop = ds.stream()
        .collect(Collectors.groupingBy(SinhVien::getLop, Collectors.counting()));
\`\`\`

Chạy thật:

\`\`\`
2) diem trung binh -> 7.90
4) so em moi lop -> {SE01=3, SE02=2}
\`\`\`

\`groupingBy\` là thứ đáng giá nhất trong \`Collectors\`. Viết tay thì phải: tạo \`Map\`, duyệt, \`containsKey\`, \`put\`, cộng dồn — đúng đoạn code Ngày 25. Ở đây một dòng.

Vài hàm kiểm tra nhanh:

\`\`\`
6) co ai duoi 5? false | tat ca tren 6? true
\`\`\`

\`anyMatch\` · \`allMatch\` · \`noneMatch\` — trả \`boolean\`, và chúng dừng ngay khi có câu trả lời chứ không duyệt hết.

━━━━━━━━━━━━━━━━━━━━

😴 STREAM RẤT LƯỜI — VÀ ĐÓ LÀ ƯU ĐIỂM

Thử chạy một dây chuyền THIẾU mắt xích cuối:

\`\`\`java
List<String> log = new ArrayList<>();
ds.stream().filter(s -> { log.add(s.getTen()); return true; });
\`\`\`

\`\`\`
8) chua co toan tu ket thuc -> log rong? true
\`\`\`

\`filter\` không chạy một lần nào. Vì các toán tử chia hai loại:

- **Trung gian** (\`filter\`, \`map\`, \`sorted\`, \`distinct\`, \`limit\`) — trả về Stream mới, chỉ GHI NHẬN ý định
- **Kết thúc** (\`collect\`, \`forEach\`, \`count\`, \`anyMatch\`, \`reduce\`) — mới thật sự chạy

Thiếu toán tử kết thúc thì cả dây chuyền im lặng không làm gì. Đây là lỗi rất hay gặp của người mới: viết \`ds.stream().map(...)\` rồi thắc mắc sao không thấy gì.

Nhưng lười lại là ưu điểm: nhờ vậy Java duyệt danh sách MỘT lần cho cả dây chuyền, và không tạo danh sách trung gian ở mỗi bước. Với \`.filter(...).limit(3)\`, nó dừng ngay khi đủ 3 phần tử.

━━━━━━━━━━━━━━━━━━━━

🚮 DÙNG MỘT LẦN RỒI BỎ

\`\`\`java
Stream<SinhVien> st = ds.stream();
st.count();
st.count();   // ✗ IllegalStateException
\`\`\`

\`\`\`
7) dung lai stream -> IllegalStateException
\`\`\`

Stream không phải một tập hợp — nó là một DÒNG CHẢY đi qua một lần. Cần dùng lại thì tạo mới từ nguồn: \`ds.stream()\` lần nữa. Đừng lưu stream vào biến rồi tái sử dụng.

Và nhớ: stream **không sửa** danh sách gốc. \`.sorted()\` trả về dòng đã sắp, \`ds\` giữ nguyên thứ tự cũ — khác hẳn \`Collections.sort(ds)\`.

━━━━━━━━━━━━━━━━━━━━

⚖️ KHI NÀO ĐỪNG DÙNG STREAM

Stream không phải luôn tốt hơn:

\`\`\`java
for (int i = 0; i < 3; i++) System.out.println(i);   // rõ hơn stream
\`\`\`

- Vòng lặp đơn giản, ít bước → \`for\` dễ đọc hơn
- Cần \`break\` giữa chừng → \`for\` tự nhiên hơn
- Gỡ lỗi từng bước → \`for\` đặt breakpoint dễ hơn
- Dây chuyền dài quá 4–5 mắt xích → nên tách thành method có tên

Stream sáng nhất khi có nhiều bước biến đổi nối nhau, hoặc khi cần gom nhóm/thống kê.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Từ \`List<String>\`, lọc chuỗi dài hơn 3 ký tự, viết hoa, sắp xếp, gom lại.
2. Tính tổng, trung bình, max của \`List<Integer>\` bằng stream.
3. Gom nhóm sinh viên theo lớp bằng \`groupingBy\`, rồi tính điểm trung bình mỗi lớp.
4. Viết một dây chuyền THIẾU toán tử kết thúc và kiểm chứng nó không chạy.
5. Lưu stream vào biến rồi dùng hai lần — đọc lỗi.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Stream là dây chuyền: nguồn → các bước trung gian → một toán tử kết thúc. Nó lười, chỉ chạy khi có mắt xích cuối, và dùng đúng một lần.

Nhưng để ý dòng này ở trên:

\`\`\`java
ds.stream().max(Comparator.comparingDouble(SinhVien::getDiem)).get()
\`\`\`

Vì sao phải \`.get()\`? Vì \`max\` không trả về \`SinhVien\` — nó trả \`Optional<SinhVien>\`. Danh sách rỗng thì làm gì có ai cao điểm nhất.

Và nếu bạn gọi \`.get()\` trên một \`Optional\` rỗng thì… lại nổ, y hệt \`null\`.

Ngày 32: \`Optional\` — cách Java nói "có thể không có giá trị" một cách tử tế, và vì sao \`.get()\` là method bạn nên tránh dùng nhất. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
