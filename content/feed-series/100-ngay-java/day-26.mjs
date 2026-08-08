/** "100 Ngày Java với CuongThai" — Ngày 26: Comparable & Comparator.
    Nối thẳng chỗ Ngày 25 kết (TreeSet "tự sắp xếp" dựa vào đâu). Dùng lại
    tràn số của Ngày 03 ở mục bẫy `a - b`, và equals của Ngày 20 ở mục nhất
    quán. Ngày 27 (Iterator) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 26,
  card: 'java-day-26',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-product-inventory-tracker-using-custom-objects-and-maps',
    title: 'Theo dõi tồn kho bằng đối tượng và Map',
  },

  content: `🔤 100 NGÀY JAVA — NGÀY 26: COMPARABLE & COMPARATOR

Hôm qua \`TreeSet\` "tự sắp xếp" và tôi hỏi: dựa vào đâu mà nó biết "buoi" đứng trước "cam"?

Với \`String\` và số thì Java biết sẵn. Nhưng:

\`\`\`java
Collections.sort(dsSinhVien);   // sắp theo gì? tên? điểm? tuổi?
\`\`\`

Java không đoán được. Bạn phải nói. Và Java cho tới HAI cách nói — vì có hai tình huống rất khác nhau.

━━━━━━━━━━━━━━━━━━━━

📌 Comparable — THỨ TỰ "ĐƯƠNG NHIÊN" CỦA CLASS

\`\`\`java
class SinhVien implements Comparable<SinhVien> {
    @Override
    public int compareTo(SinhVien o) {
        return ten.compareTo(o.ten);
    }
}

Collections.sort(ds);   // giờ chạy được
\`\`\`

Chạy thật:

\`\`\`
1) tu nhien (ten)   -> [An(9.5,22), Binh(8.0,19), Chi(8.0,20)]
\`\`\`

Quy ước trả về của \`compareTo\` — nhớ kỹ, đây là chỗ hay sai:

- số **ÂM** → \`this\` đứng TRƯỚC \`o\`
- **0** → hai cái ngang nhau
- số **DƯƠNG** → \`this\` đứng SAU

Không phải \`true/false\`. Mẹo nhớ: \`a.compareTo(b) < 0\` đọc như \`a < b\`.

Một class chỉ có MỘT \`compareTo\`, nên hãy dành nó cho thứ tự hiển nhiên nhất — thứ mà ai nhìn cũng gật đầu. \`TreeSet\`, \`TreeMap\`, \`Collections.sort()\` không tham số đều dùng nó.

━━━━━━━━━━━━━━━━━━━━

🔀 Comparator — THỨ TỰ NHẤT THỜI

Nhưng thực tế cần sắp nhiều kiểu: hôm nay theo điểm, mai theo tuổi, mốt theo điểm giảm dần rồi tên tăng dần.

\`\`\`java
ds.sort(Comparator.comparingDouble(s -> s.diem));                          // điểm tăng
ds.sort(Comparator.comparingDouble((SinhVien s) -> s.diem).reversed());    // điểm giảm
\`\`\`

Chạy thật:

\`\`\`
2) theo diem tang   -> [Binh(8.0,19), Chi(8.0,20), An(9.5,22)]
3) theo diem giam   -> [An(9.5,22), Binh(8.0,19), Chi(8.0,20)]
\`\`\`

Và khi bằng điểm thì phân định bằng tên:

\`\`\`java
ds.sort(Comparator.comparingDouble((SinhVien s) -> s.diem).reversed()
                  .thenComparing(s -> s.ten));
\`\`\`

\`thenComparing\` chỉ được dùng tới khi tiêu chí trước hoà — đúng như xếp hạng thi đấu.

Khác biệt cốt lõi:

| | \`Comparable\` | \`Comparator\` |
|---|---|---|
| Nằm ở đâu | BÊN TRONG class | bên ngoài, rời |
| Số lượng | đúng 1 | bao nhiêu cũng được |
| Sửa được class không? | phải sửa | **không cần** |

Vế cuối rất quan trọng: muốn sắp một class của thư viện người khác — thứ bạn không sửa được — thì \`Comparator\` là lối duy nhất.

━━━━━━━━━━━━━━━━━━━━

⚠️ BẪY: ĐỪNG VIẾT return a - b

Mẹo phổ biến để so hai số nguyên:

\`\`\`java
return this.tuoi - o.tuoi;   // âm/0/dương — nhìn thì đúng
\`\`\`

Chạy thật với hai số lớn:

\`\`\`
6) (int)(a-b) voi a=2000000000,b=-2000000000 -> -294967296
7) Integer.compare an toan               -> 1
\`\`\`

\`2000000000 - (-2000000000)\` = 4 tỉ, vượt sức chứa \`int\` (Ngày 3), tràn thành số ÂM. \`compareTo\` trả âm nghĩa là "nhỏ hơn" — trong khi thực tế lớn hơn hẳn. Danh sách sắp sai, không lỗi, không cảnh báo.

Luôn dùng:

\`\`\`java
return Integer.compare(this.tuoi, o.tuoi);
return Double.compare(this.diem, o.diem);
\`\`\`

Với \`double\` còn một lý do nữa: \`Double.compare\` xử lý đúng \`NaN\` và \`-0.0\`, phép trừ thì không.

━━━━━━━━━━━━━━━━━━━━

🤝 NHẤT QUÁN VỚI equals

Quy ước mạnh của Java: \`a.compareTo(b) == 0\` nên trùng với \`a.equals(b) == true\`.

Phá quy ước này thì các cấu trúc dựa trên cây cư xử rất lạ: \`TreeSet\` coi hai phần tử là trùng khi \`compareTo\` trả 0 (bất kể \`equals\`), còn \`HashSet\` thì dựa trên \`equals\`/\`hashCode\` (Ngày 20). Cùng một dữ liệu, hai tập hợp cho hai số lượng khác nhau — và bạn ngồi tìm mãi không hiểu vì sao.

Ví dụ dễ dính: \`compareTo\` chỉ so tên, \`equals\` so mssv. Hai sinh viên trùng tên khác mã sẽ biến mất một người khi cho vào \`TreeSet\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Cho \`SinhVien\` \`implements Comparable\` sắp theo mssv, rồi \`Collections.sort\`.
2. Viết ba \`Comparator\`: theo tên, theo điểm giảm, theo tuổi tăng.
3. Ghép "điểm giảm dần, cùng điểm thì tên A→Z" bằng \`thenComparing\`.
4. Viết \`compareTo\` bằng \`a - b\` với \`tuoi = Integer.MAX_VALUE\` và \`-1\` — xem nó sắp sai.
5. Cho \`compareTo\` so tên còn \`equals\` so mssv, rồi thêm hai em trùng tên vào \`TreeSet\` và \`HashSet\`. Đếm cả hai.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`Comparable\` cho thứ tự mặc định gắn với class; \`Comparator\` cho mọi thứ tự khác, không cần đụng vào class. Trả âm/0/dương, dùng \`Integer.compare\` thay phép trừ, và giữ nhất quán với \`equals\`.

Ba ngày qua ta dùng \`for-each\` khắp nơi:

\`\`\`java
for (String s : ds) { … }
\`\`\`

Nhưng nó hoạt động thế nào? Vì sao \`ArrayList\`, \`HashSet\`, \`TreeMap.keySet()\` — ba cấu trúc bên trong khác hẳn nhau — lại đều duyệt được bằng đúng cú pháp đó? Và vì sao xoá phần tử giữa chừng thì nổ \`ConcurrentModificationException\` (Ngày 24)?

Ngày 27: \`Iterator\` và \`Iterable\` — thứ nằm dưới mọi vòng for-each, và cách làm cho class của chính bạn duyệt được bằng nó. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
