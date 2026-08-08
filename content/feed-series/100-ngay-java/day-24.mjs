/** "100 Ngày Java với CuongThai" — Ngày 24: ArrayList. MỞ GIAI ĐOẠN 4.
    Nối thẳng chỗ Ngày 23 kết (mảng cố định của Ngày 08: thêm phần tử thứ
    31, xoá giữa, đếm số thật). Ngày 25 (Set & Map) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 24,
  card: 'java-day-24',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-library-catalog-management-system',
    title: 'Hệ thống quản lý danh mục thư viện',
  },

  content: `📚 100 NGÀY JAVA — NGÀY 24: ARRAYLIST

Giai đoạn 4 bắt đầu. Và ta quay lại một chỗ dở dang từ Ngày 8:

\`\`\`java
int[] diem = new int[30];   // đúng 30 ô, không hơn không kém
\`\`\`

Sinh viên thứ 31 chuyển vào? Tạo mảng 31 ô, chép tay từng phần tử, gán lại. Em ở giữa nghỉ học? Dồn toàn bộ phần đuôi lên một ô. Muốn biết lớp có bao nhiêu em thật? Tự đếm — \`length\` chỉ nói SỨC CHỨA, không nói số phần tử đang dùng.

Ba việc tay chân đó, hôm nay biến mất.

━━━━━━━━━━━━━━━━━━━━

📌 DANH SÁCH TỰ CO GIÃN

\`\`\`java
List<String> ds = new ArrayList<>();
ds.add("An");
ds.add("Binh");
ds.add("Chi");
ds.add(1, "Bao");        // chèn vào giữa, phần sau tự dồn xuống
\`\`\`

Chạy thật:

\`\`\`
1) [An, Bao, Binh, Chi] | size 4
\`\`\`

Không khai kích thước, không chép mảng, không dồn tay. \`size()\` cho số phần tử THẬT.

Bộ method cần nhớ chỉ có bấy nhiêu: \`add\` · \`get\` · \`set\` · \`remove\` · \`size\` · \`contains\` · \`indexOf\` · \`isEmpty\` · \`clear\`.

Để ý dòng khai báo:

\`\`\`java
List<String> ds = new ArrayList<>();   // ✓
ArrayList<String> ds = new ArrayList<>();  // chạy được, nhưng kém linh hoạt
\`\`\`

Khai bằng \`List\` (interface — Ngày 18) thì mai đổi sang \`LinkedList\` chỉ sửa một chỗ. Đây là "lập trình theo hợp đồng" áp dụng vào việc thật.

Còn \`<String>\` là **generics** — nó bảo đảm danh sách này chỉ chứa \`String\`, và \`get()\` trả về \`String\` chứ không phải \`Object\` phải ép kiểu. Ta sẽ mổ xẻ generics ở Giai đoạn 5; giờ cứ hiểu: cặp ngoặc nhọn nói "danh sách CỦA cái gì".

━━━━━━━━━━━━━━━━━━━━

⚠️ BẪY 1: remove(1) XOÁ SỐ 1 HAY VỊ TRÍ 1?

\`\`\`java
List<Integer> so = new ArrayList<>(List.of(10, 20, 30));

so.remove(1);                       // -> [10, 30]
so.remove(Integer.valueOf(30));     // -> [10]
\`\`\`

Kết quả thật:

\`\`\`
4) remove(1)          -> [10, 30]
5) remove(valueOf(30))-> [10]
\`\`\`

\`remove(1)\` xoá phần tử ở VỊ TRÍ 1 (số 20), không phải số 1. Vì \`List\` có hai method: \`remove(int index)\` và \`remove(Object o)\` — và với \`List<Integer>\`, số nguyên trần khớp cái đầu tiên.

Muốn xoá theo giá trị thì phải nói rõ: \`remove(Integer.valueOf(30))\`.

Bẫy này chỉ xuất hiện với \`List<Integer>\`, và nó im lặng: không lỗi, chỉ xoá nhầm phần tử.

━━━━━━━━━━━━━━━━━━━━

💥 BẪY 2: VỪA DUYỆT VỪA XOÁ

\`\`\`java
for (String s : t) {
    if (s.length() > 1) t.remove(s);
}
\`\`\`

Chạy thật:

\`\`\`
6) ConcurrentModificationException khi vua duyet vua xoa
\`\`\`

Vòng \`for-each\` dùng một *iterator* để đi qua danh sách. Xoá phần tử giữa chừng làm danh sách đổi cấu trúc, iterator phát hiện và ném ngoại lệ ngay — thà nổ còn hơn duyệt sót âm thầm.

Hai cách đúng:

\`\`\`java
t.removeIf(s -> s.length() > 1);        // gọn nhất (Java 8+)

Iterator<String> it = t.iterator();      // cách cổ điển
while (it.hasNext()) {
    if (it.next().length() > 1) it.remove();
}
\`\`\`

Kết quả:

\`\`\`
7) removeIf -> [a, c]
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧊 BẪY 3: Arrays.asList CỨNG ĐƠ

\`\`\`java
List<String> l = Arrays.asList("x", "y");
l.add("z");   // ✗ UnsupportedOperationException
\`\`\`

\`Arrays.asList\` trả về một khung nhìn có KÍCH THƯỚC CỐ ĐỊNH bọc quanh mảng — \`set()\` được nhưng \`add\`/\`remove\` thì không. \`List.of(...)\` còn chặt hơn: bất biến hoàn toàn.

Muốn danh sách sửa được:

\`\`\`java
List<String> l = new ArrayList<>(Arrays.asList("x", "y"));
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧠 BÊN TRONG NÓ LÀ MỘT MẢNG

\`ArrayList\` không phép màu: bên trong vẫn là mảng. Khi đầy, nó cấp mảng mới lớn hơn (khoảng 1,5 lần) và chép sang — đúng việc bạn từng làm tay ở Ngày 8, chỉ là giờ có người làm hộ.

Hệ quả đáng nhớ:

- \`get(i)\` **rất nhanh** — tính địa chỉ trực tiếp
- \`add()\` cuối danh sách **nhanh**
- \`add(0, x)\` hay \`remove(0)\` **chậm** khi danh sách lớn — phải dồn toàn bộ phần sau

Biết trước sẽ có cả vạn phần tử và toàn thêm/xoá ở đầu? Đó là lúc \`LinkedList\` hợp hơn. Còn lại, 95% trường hợp \`ArrayList\` là lựa chọn đúng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết chương trình quản lý danh sách sinh viên: thêm, xoá theo tên, tìm, in tất cả.
2. Tạo \`List<Integer>\` rồi thử cả \`remove(1)\` lẫn \`remove(Integer.valueOf(1))\`.
3. Cố tình xoá phần tử trong \`for-each\` để tự gặp \`ConcurrentModificationException\`.
4. Sửa lại bằng \`removeIf\`, rồi viết thêm bản dùng \`Iterator\`.
5. Thử \`add\` vào \`Arrays.asList(...)\` và \`List.of(...)\` — đọc lỗi cả hai.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`ArrayList\` cho bạn danh sách co giãn với ba cái bẫy phải nhớ: \`remove\` nhập nhằng với \`Integer\`, không sửa khi đang duyệt, và \`Arrays.asList\` thì cứng.

Nhưng \`List\` không giải được mọi bài toán. Thử nghĩ:

- Danh sách email đăng ký — làm sao chặn trùng? \`contains()\` trước mỗi lần \`add\`, và với 100.000 email thì mỗi lần kiểm là một lần quét cả danh sách.
- Tra số điện thoại theo tên — duyệt từ đầu tới khi thấy?

Cả hai đều CHẬM vì \`List\` chỉ biết sắp xếp theo thứ tự, không biết TRA CỨU.

Ngày 25: \`Set\` (tự chống trùng) và \`Map\` (tra theo khoá, gần như tức thì) — và đây chính là chỗ \`equals\`/\`hashCode\` của Ngày 20 phát huy tác dụng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
