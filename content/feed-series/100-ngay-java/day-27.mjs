/** "100 Ngày Java với CuongThai" — Ngày 27: Iterator & Iterable.
    Trả lời ba câu hỏi Ngày 26 kết: for-each hoạt động thế nào, vì sao mọi
    Collection duyệt được cùng cú pháp, và vì sao xoá giữa chừng thì nổ
    ConcurrentModificationException (Ngày 24). Ngày 28 (Queue/Deque/Stack)
    trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 27,
  card: 'java-day-27',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-text-analysis-utility-using-collections',
    title: 'Tiện ích phân tích văn bản bằng Collections',
  },

  content: `🔁 100 NGÀY JAVA — NGÀY 27: ITERATOR

Ba ngày qua ta viết \`for-each\` khắp nơi:

\`\`\`java
for (String s : ds) { … }
\`\`\`

Nhưng chưa ai hỏi: nó hoạt động thế nào? Vì sao \`ArrayList\` (bên trong là mảng), \`HashSet\` (bảng băm) và \`TreeMap\` (cây) — ba cấu trúc khác hẳn nhau — lại duyệt được bằng đúng một cú pháp?

Hôm nay mở nắp ra xem.

━━━━━━━━━━━━━━━━━━━━

📌 for-each CHỈ LÀ LỚP ÁO

Trình dịch biến dòng này:

\`\`\`java
for (String s : ds) { … }
\`\`\`

thành đúng dòng này:

\`\`\`java
Iterator<String> it = ds.iterator();
while (it.hasNext()) {
    String s = it.next();
    …
}
\`\`\`

Chạy tay thử:

\`\`\`
1) duyet tay -> a bo c do
\`\`\`

Kết quả y hệt \`for-each\`, vì nó CHÍNH LÀ \`for-each\`.

\`Iterator\` là một interface (Ngày 18) với hai method chính:

- \`hasNext()\` — còn phần tử nào không?
- \`next()\` — đưa tôi phần tử kế tiếp

Và đây là câu trả lời cho câu hỏi đầu bài: mỗi cấu trúc tự viết \`Iterator\` riêng theo cách nó lưu trữ, nhưng đều công bố cùng hai method đó. Người dùng chỉ thấy hợp đồng, không thấy ruột — đúng tinh thần "lập trình theo interface" của Ngày 18.

━━━━━━━━━━━━━━━━━━━━

✂️ XOÁ ĐÚNG CÁCH KHI ĐANG DUYỆT

Ngày 24 ta gặp \`ConcurrentModificationException\` khi vừa duyệt vừa xoá. Giờ thì hiểu vì sao: \`Iterator\` ghi nhớ số lần danh sách bị sửa cấu trúc. Bạn gọi \`ds.remove()\` sau lưng nó, con số lệch, và ở lần \`next()\` kế tiếp nó phát hiện ra rồi ném ngoại lệ — thà nổ còn hơn duyệt sót âm thầm.

Cách đúng là xoá QUA chính iterator:

\`\`\`java
Iterator<String> it = ds.iterator();
while (it.hasNext()) {
    if (it.next().length() > 1) it.remove();
}
\`\`\`

Chạy thật:

\`\`\`
2) sau it.remove() -> [a, c]
\`\`\`

\`it.remove()\` xoá phần tử vừa trả về và tự cập nhật bộ đếm, nên không có gì lệch. Còn \`removeIf()\` của Ngày 24 chính là bản viết sẵn của đoạn này.

━━━━━━━━━━━━━━━━━━━━

💥 GỌI next() QUÁ TAY

\`\`\`java
Iterator<String> it = List.of("x").iterator();
it.next();     // lấy "x"
it.next();     // ✗ NoSuchElementException
\`\`\`

\`\`\`
3) NoSuchElementException khi het phan tu
\`\`\`

Đây là lý do \`hasNext()\` tồn tại. Trong \`for-each\` thì Java hỏi hộ bạn; duyệt tay thì phải tự hỏi.

━━━━━━━━━━━━━━━━━━━━

✍️ CHO CLASS CỦA BẠN DUYỆT ĐƯỢC

Điều thú vị nhất: \`for-each\` không dành riêng cho thư viện. Class của bạn chỉ cần \`implements Iterable\`:

\`\`\`java
class LopHoc implements Iterable<String> {
    private final List<String> hs = new ArrayList<>();

    @Override
    public Iterator<String> iterator() {
        return new Iterator<String>() {
            private int i = 0;
            @Override public boolean hasNext() { return i < hs.size(); }
            @Override public String next() { return hs.get(i++); }
        };
    }
}

for (String s : lop) { … }     // chạy ngay
\`\`\`

\`\`\`
4) for-each tren class tu viet -> An Binh
\`\`\`

Ghép luôn với Ngày 19: \`LopHoc\` **CÓ MỘT** danh sách (không kế thừa nó), nhưng vẫn duyệt được như một tập hợp — mà không phải mở \`add\`/\`remove\`/\`clear\` ra ngoài. Đóng gói giữ nguyên, tiện lợi vẫn có.

Đoạn \`new Iterator<String>() { … }\` ở trên là **lớp nặc danh** — class không tên, viết thẳng tại chỗ dùng. Ta sẽ gặp lại nó nhiều ở Giai đoạn 5, nơi lambda ra đời để viết gọn hơn nữa.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết lại một vòng \`for-each\` bằng \`Iterator\` tay, so kết quả.
2. Xoá phần tử bằng \`ds.remove()\` trong \`for-each\` để tự gặp lỗi, rồi sửa bằng \`it.remove()\`.
3. Gọi \`next()\` khi đã hết phần tử và đọc lỗi.
4. Cho class \`GioHang\` \`implements Iterable<SanPham>\` rồi duyệt bằng \`for-each\`.
5. Duyệt một \`Map\` bằng \`entrySet().iterator()\` và in từng cặp khoá–giá trị.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`Iterable\` nghĩa là "duyệt được", \`Iterator\` là "người đang duyệt". \`for-each\` chỉ là cú pháp gọn cho hai method \`hasNext\`/\`next\`. Xoá khi đang duyệt thì xoá qua iterator. Và class của bạn cũng tham gia được vào cuộc chơi đó.

Đến đây bạn có \`List\`, \`Set\`, \`Map\` — đủ cho phần lớn công việc. Nhưng có hai kiểu truy cập rất riêng mà cả ba đều không diễn tả gọn được:

- Hàng đợi in ấn: ai gửi trước in trước — **vào trước ra trước**
- Nút Undo: thao tác vừa làm được huỷ đầu tiên — **vào sau ra trước**

Làm bằng \`ArrayList\` thì được, nhưng \`remove(0)\` phải dồn cả danh sách (Ngày 24), và tên method chẳng nói lên ý định gì.

Ngày 28: \`Queue\`, \`Deque\`, \`Stack\` — và vì sao Java khuyên bạn ĐỪNG dùng class \`Stack\` cũ. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
