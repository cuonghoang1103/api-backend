/** "100 Ngày Java với CuongThai" — Ngày 42: ExecutorService & Future.
    Nối chỗ Ngày 41 kết (10.000 yêu cầu mà `new Thread` từng cái là sập).
    Dùng lại ngoại lệ bọc cause của Ngày 22. Ngày 43 (CompletableFuture)
    trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 42,
  card: 'java-day-42',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-thread-safe-notification-system-with-observer-pattern-and-lambdas',
    title: 'Hệ thông báo an toàn luồng theo mẫu Observer',
  },

  content: `🏊 100 NGÀY JAVA — NGÀY 42: EXECUTORSERVICE

Hôm qua ta tự tay \`new Thread\`. Hôm nay xem vì sao cách đó không dùng được cho việc thật.

Một máy chủ web nhận 10.000 yêu cầu mỗi phút. Mỗi yêu cầu tạo một luồng mới?

- Mỗi \`Thread\` chiếm khoảng **1MB** bộ nhớ ngăn xếp → 10.000 luồng là 10GB
- Tạo luồng là việc của hệ điều hành, tốn thời gian đáng kể
- Có 8 nhân CPU mà 10.000 luồng thì hệ điều hành bận chuyển qua lại giữa chúng hơn là làm việc thật

Giải pháp không phải "tạo nhanh hơn", mà là **đừng tạo mới** — dùng lại một số luồng có sẵn.

━━━━━━━━━━━━━━━━━━━━

📌 HỒ BƠI LUỒNG

\`\`\`java
ExecutorService pool = Executors.newFixedThreadPool(3);

pool.submit(() -> lamViec());     // nộp việc, không tạo luồng
pool.submit(() -> lamViecKhac());
…
pool.shutdown();
\`\`\`

Ba luồng làm hết mọi việc trong hàng đợi: xong việc này thì lấy việc tiếp theo. Nộp 10.000 việc cũng chỉ có 3 luồng tồn tại.

Vài kiểu hồ bơi:

\`\`\`java
Executors.newFixedThreadPool(n)   // n luồng cố định — dùng nhiều nhất
Executors.newSingleThreadExecutor()  // đúng 1 luồng, việc chạy tuần tự
Executors.newCachedThreadPool()   // tự co giãn, hợp với việc ngắn và nhiều
Executors.newVirtualThreadPerTaskExecutor()  // Java 21: luồng ảo, rất nhẹ
\`\`\`

Số luồng bao nhiêu là hợp lý? Việc nặng CPU thì lấy khoảng số nhân máy (\`Runtime.getRuntime().availableProcessors()\`). Việc chờ mạng/ổ đĩa thì nhiều hơn, vì phần lớn thời gian luồng chỉ ngồi đợi.

**Bắt buộc gọi \`shutdown()\`**:

\`\`\`
6) da shutdown? true | ket thuc trong 2s? true
\`\`\`

Luồng trong hồ bơi mặc định không phải luồng nền, nên quên \`shutdown()\` là chương trình chạy xong \`main\` mà vẫn không thoát. Đây là lỗi rất hay gặp lần đầu.

━━━━━━━━━━━━━━━━━━━━

📨 Future — CUỐI CÙNG CŨNG NHẬN ĐƯỢC KẾT QUẢ

\`Thread\` có một hạn chế lớn: nó chạy xong rồi thôi, không trả gì về. Muốn lấy kết quả phải ghi vào một biến dùng chung — tức là quay lại đúng bài toán race condition của hôm qua.

\`\`\`java
Future<Integer> f = pool.submit(() -> {
    Thread.sleep(30);
    return 6 * 7;
});

f.isDone();    // false — chưa xong
f.get();       // 42 — ĐỢI tới khi xong rồi trả về
\`\`\`

\`\`\`
1) da submit, xong chua? false
2) f.get() (cho toi khi xong) -> 42
\`\`\`

Khác biệt nằm ở kiểu tham số: \`Runnable\` (Ngày 41) không trả về gì, còn \`Callable<T>\` trả về \`T\`. \`submit\` nhận cả hai.

**Cái bẫy của \`get()\`:** nó CHẶN luồng gọi cho tới khi có kết quả. Viết thế này là mất sạch tính song song:

\`\`\`java
for (var viec : danhSach) {
    pool.submit(viec).get();     // ✗ nộp một việc, đợi xong, mới nộp việc sau
}
\`\`\`

Đúng ra phải nộp hết rồi mới thu:

\`\`\`java
List<Future<String>> ket = pool.invokeAll(viec);
for (Future<String> k : ket) sb.append(k.get());
\`\`\`

\`\`\`
3) invokeAll -> viec-1 viec-2 viec-3 viec-4 viec-5
\`\`\`

\`invokeAll\` nộp tất cả, đợi tất cả xong, và trả kết quả **theo đúng thứ tự nộp** — dù bên trong chúng chạy xen kẽ. Thứ tự ổn định nên viết test được.

━━━━━━━━━━━━━━━━━━━━

🧯 NGOẠI LỆ TRONG LUỒNG KHÔNG BỊ NUỐT

\`\`\`java
Future<Integer> loi = pool.submit(() -> 10 / 0);

try {
    loi.get();
} catch (ExecutionException e) {
    e.getCause();     // ArithmeticException — nguyên nhân gốc
}
\`\`\`

\`\`\`
4) loi trong luong -> ArithmeticException
\`\`\`

Lỗi xảy ra trong luồng khác được **gói** vào \`ExecutionException\` và ném lại khi bạn gọi \`get()\`. Lấy nguyên nhân gốc bằng \`getCause()\` — đúng cơ chế bọc ngoại lệ của Ngày 22.

Nhưng chú ý mặt trái: nếu bạn KHÔNG BAO GIỜ gọi \`get()\`, lỗi đó nằm im mãi mãi. Không log, không dấu vết — họ hàng gần với khối \`catch\` rỗng của Ngày 21. Với việc nộp kiểu "bắn rồi quên", hãy tự bọc \`try/catch\` bên trong tác vụ.

━━━━━━━━━━━━━━━━━━━━

🗃️ CẤU TRÚC DỮ LIỆU AN TOÀN LUỒNG

\`\`\`java
ConcurrentHashMap<String, Integer> dem = new ConcurrentHashMap<>();
dem.merge("tong", 1, Integer::sum);      // an toàn giữa mọi luồng
\`\`\`

\`\`\`
5) ConcurrentHashMap dem -> 100
\`\`\`

Một trăm tác vụ cùng cộng, không mất số nào. \`HashMap\` thường ở đây thì không chỉ sai kết quả — nó còn có thể hỏng cấu trúc bên trong và treo vòng lặp.

Bộ thay thế cần nhớ: \`ConcurrentHashMap\` thay \`HashMap\` · \`CopyOnWriteArrayList\` thay \`ArrayList\` (khi đọc nhiều ghi ít) · \`BlockingQueue\` cho mô hình một bên sản xuất một bên tiêu thụ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo hồ bơi 4 luồng, nộp 20 việc in số thứ tự — quan sát chỉ 4 luồng làm hết.
2. Dùng \`Callable\` tính bình phương 10 số, thu kết quả bằng \`invokeAll\`.
3. Gọi \`get()\` ngay sau mỗi \`submit\` rồi đo thời gian; so với nộp hết rồi thu.
4. Ném ngoại lệ trong một tác vụ và bắt \`ExecutionException\`, in \`getCause()\`.
5. Quên \`shutdown()\` và quan sát chương trình không thoát.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`ExecutorService\` tái sử dụng luồng thay vì tạo mới, \`Future\` cho phép nhận kết quả và cả ngoại lệ. Nộp hết rồi mới \`get()\`, và luôn nhớ \`shutdown()\`.

Nhưng \`Future.get()\` vẫn còn một điểm vụng: nó CHẶN. Thử hình dung việc thật:

\`\`\`java
// gọi API lấy thông tin người dùng
// → xong rồi mới gọi API lấy đơn hàng của người đó
// → xong rồi mới tính tổng tiền
// → nếu bất kỳ bước nào lỗi thì trả giá trị mặc định
\`\`\`

Viết bằng \`Future\` thì mỗi bước phải \`get()\` — luồng ngồi đợi, và code lồng vào nhau tầng tầng lớp lớp.

Ngày 43: \`CompletableFuture\` — nối các việc bất đồng bộ thành một dây chuyền giống Stream, không ai phải ngồi đợi ai. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
