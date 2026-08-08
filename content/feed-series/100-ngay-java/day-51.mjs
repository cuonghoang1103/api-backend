/** "100 Ngày Java với CuongThai" — Ngày 51: Bên trong JVM. MỞ GIAI ĐOẠN 7.
    Nối chỗ Ngày 50 kết (OutOfMemoryError khi máy còn 16GB trống). Giải
    thích lại được Ngày 10 (biến local không có mặc định) và Ngày 41
    (biến local an toàn đa luồng). Ngày 52 (GC) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 51,
  card: 'java-day-51',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-generic-log-analyzer',
    title: 'Bộ phân tích log tổng quát',
  },

  content: `🧠 100 NGÀY JAVA — NGÀY 51: BÊN TRONG JVM

Giai đoạn 7 bắt đầu. Năm mươi ngày qua JVM luôn ở đó lo mọi thứ — cấp bộ nhớ, dọn rác, biên dịch mã máy — mà bạn chưa từng nhìn xuống.

Rồi sẽ tới ngày bạn gặp dòng này trên production:

\`\`\`
java.lang.OutOfMemoryError: Java heap space
\`\`\`

Máy còn 16GB RAM trống. Vì sao vẫn hết bộ nhớ?

━━━━━━━━━━━━━━━━━━━━

📌 HAI VÙNG NHỚ, HAI SỐ PHẬN

**STACK** — mỗi LUỒNG có một cái riêng:

\`\`\`java
void tinh() {
    int x = 5;            // trên stack
    SinhVien s = new SinhVien();   // biến s trên stack…
}                          // thoát method → stack tự dọn sạch
\`\`\`

**HEAP** — dùng chung cho cả chương trình:

\`\`\`java
new SinhVien()            // …nhưng ĐỐI TƯỢNG nằm trên heap
\`\`\`

Đây là chỗ khớp lại hai bài cũ:

- **Ngày 10**: biến local KHÔNG có giá trị mặc định, còn field thì có. Giờ đủ chữ để giải thích: stack chỉ dịch con trỏ khi vào method, vùng nhớ đó còn nguyên rác của lần gọi trước. Còn \`new\` trên heap thì xoá sạch trước khi giao — nên field mới có \`0\`/\`false\`/\`null\`.
- **Ngày 41**: biến local an toàn đa luồng miễn phí. Vì mỗi luồng một stack riêng — không có gì để tranh nhau.

Chạy thật hai luồng cùng chạy một hàm có biến local:

\`\`\`
4) bien local tren stack rieng -> co luong nao sai? false
\`\`\`

Không luồng nào ảnh hưởng luồng nào.

━━━━━━━━━━━━━━━━━━━━

📚 TRÀN STACK

\`\`\`java
static int doSau() { return 1 + doSau(); }   // đệ quy không điểm dừng
\`\`\`

\`\`\`
3) de quy toi han > 1000 khung? true
\`\`\`

Mỗi lần gọi method là một khung mới trên stack. Stack mặc định chỉ khoảng 512KB–1MB mỗi luồng, nên vài chục nghìn khung là tràn: \`StackOverflowError\`.

Hai điều đáng nhớ:

- Kích thước stack **không liên quan** tới \`-Xmx\` (đó là heap). Nó đặt bằng \`-Xss\`.
- \`StackOverflowError\` gần như luôn là **lỗi logic** — đệ quy quên điều kiện dừng, hoặc \`toString()\` gọi lại chính nó. Đừng tăng \`-Xss\` để "chữa"; hãy sửa đệ quy.

━━━━━━━━━━━━━━━━━━━━

🗑️ RÁC LÀ GÌ

Java không có \`free()\` hay \`delete\`. Định nghĩa rất gọn: **một đối tượng là rác khi không còn tham chiếu nào trỏ tới nó**.

\`\`\`java
List<byte[]> giu = new ArrayList<>();
for (int i = 0; i < 100; i++) giu.add(new byte[100_000]);   // ~10MB

giu.clear();
giu = null;          // thả tham chiếu → 10MB kia thành rác
System.gc();
\`\`\`

\`\`\`
1) cap ~10MB tren heap -> bo nho tang? true
2) tha tham chieu roi gc -> bo nho giam? true
\`\`\`

Lưu ý \`System.gc()\` chỉ là **gợi ý**, không phải mệnh lệnh — JVM có quyền phớt lờ. Trong code thật đừng gọi nó; hãy để JVM tự quyết.

Và đây là điều quan trọng nhất về rò rỉ bộ nhớ trong Java:

> Rò rỉ trong Java không phải "quên giải phóng". Nó là **vô tình giữ tham chiếu**.

Ba nguồn rò rỉ kinh điển:

\`\`\`java
static List<Object> cache = new ArrayList<>();   // static giữ mãi (Ngày 14)
map.put(khoa, giaTri);                            // không bao giờ remove
luonNhoMoiPhienDangNhap();                        // session không hết hạn
\`\`\`

Đối tượng vẫn "có người trỏ tới" nên GC không dám dọn — dù bạn không còn dùng nó nữa.

━━━━━━━━━━━━━━━━━━━━

📐 VÌ SAO HẾT BỘ NHỚ KHI MÁY CÒN TRỐNG

Đây là câu trả lời cho đầu bài:

\`\`\`bash
java -Xmx512m ChuongTrinh      # heap tối đa 512MB, dù máy có 64GB
\`\`\`

\`\`\`
5) heap toi da JVM duoc cap > 0 MB? true
\`\`\`

JVM không tự lấy hết RAM máy. Nó chạy trong hạn mức bạn đặt bằng \`-Xmx\` (mặc định thường là 1/4 RAM). Vượt hạn mức đó là \`OutOfMemoryError\`, bất kể máy còn bao nhiêu.

Ba tham số nên thuộc:

\`\`\`bash
-Xmx2g      # heap tối đa
-Xms2g      # heap ban đầu (đặt bằng -Xmx để tránh co giãn liên tục)
-Xss1m      # stack mỗi luồng
\`\`\`

**Trong Docker phải đặc biệt cẩn thận.** Container giới hạn 512MB mà JVM đặt \`-Xmx\` cao hơn thì hệ điều hành sẽ giết cả tiến trình (OOM-kill) — không có \`OutOfMemoryError\`, không có log, container chỉ chết. Java hiện đại đã tự đọc giới hạn container, nhưng đặt \`-Xmx\` rõ ràng (khoảng 75% giới hạn) vẫn là cách chắc chắn nhất.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. In \`maxMemory()\`, \`totalMemory()\`, \`freeMemory()\` rồi chạy lại với \`-Xmx128m\`.
2. Viết đệ quy không điểm dừng, bắt \`StackOverflowError\` và đếm số khung.
3. Cấp 100MB rồi thả tham chiếu, gọi \`System.gc()\`, đo bộ nhớ trước và sau.
4. Tạo rò rỉ bằng một \`static List\` cứ thêm mãi, chạy với \`-Xmx64m\` cho tới khi hết heap.
5. Giải thích bằng lời: vì sao biến local không cần đồng bộ giữa các luồng?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Biến local ở stack (mỗi luồng một cái, tự dọn), đối tượng ở heap (dùng chung, GC dọn). Rác là thứ không còn ai trỏ tới — nên rò rỉ trong Java là vô tình giữ tham chiếu. Và giới hạn heap do \`-Xmx\` quyết định, không phải RAM máy.

Nhưng "GC dọn" cụ thể là dọn thế nào? Câu hỏi đó có hậu quả rất thật:

\`\`\`
Ứng dụng đang chạy mượt, bỗng khựng 2 giây, rồi lại bình thường.
Không có yêu cầu nào nặng. CPU nhảy vọt rồi về.
\`\`\`

Đó là bộ dọn rác đang làm việc — và nếu nó dừng cả chương trình lại để dọn, người dùng của bạn nhìn thấy đúng 2 giây đứng hình đó.

Ngày 52: **bộ dọn rác** — thế hệ trẻ và thế hệ già, vì sao "stop-the-world", khác nhau giữa G1/Parallel/ZGC, và cách đọc log GC. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
