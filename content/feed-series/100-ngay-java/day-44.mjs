/** "100 Ngày Java với CuongThai" — Ngày 44: Luồng ảo (Java 21).
    Nối chỗ Ngày 43 kết (hồ bơi 200 luồng thì yêu cầu 201 phải xếp hàng).
    Ngày 45 (khoá nâng cao, deadlock) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. Phép
    đo in NGƯỠNG chứ không in số giây — số đó đổi theo máy. */
export default {
  day: 44,
  card: 'java-day-44',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'parallel-merge-sort-with-async-statistics-pipeline',
    title: 'Sắp xếp trộn song song có thống kê bất đồng bộ',
  },

  content: `🪶 100 NGÀY JAVA — NGÀY 44: LUỒNG ẢO

Hôm qua ta dừng ở một bức tường: hồ bơi 200 luồng thì yêu cầu thứ 201 phải xếp hàng — kể cả khi 200 luồng kia chỉ đang ngồi đợi mạng chứ không tính toán gì.

Vì sao không tạo 10.000 luồng? Vì mỗi luồng hệ điều hành tốn khoảng 1MB bộ nhớ ngăn xếp.

Java 21 (2023) giải bài toán này theo cách khác hẳn: làm ra một loại luồng rẻ tới mức không cần tiết kiệm nữa.

━━━━━━━━━━━━━━━━━━━━

📌 LUỒNG ẢO LÀ GÌ

\`\`\`java
Thread ao = Thread.ofVirtual().name("ao-1").start(() -> lamViec());
ao.join();
ao.isVirtual();     // true
\`\`\`

\`\`\`
1) luong ao? true | ten ao-1
2) luong he dieu hanh, isVirtual? false
\`\`\`

Khác biệt nằm ở chỗ AI quản lý:

- **Luồng nền tảng** (loại ta dùng ở Ngày 41) là luồng của hệ điều hành. ~1MB ngăn xếp, tạo chậm, số lượng có hạn.
- **Luồng ảo** do chính JVM quản lý. Vài trăm byte, tạo gần như tức thì, tạo cả triệu cũng được.

Cơ chế: khi luồng ảo gặp một thao tác CHỜ (đọc mạng, truy vấn cơ sở dữ liệu, \`Thread.sleep\`), JVM cất trạng thái của nó đi và trả luồng hệ điều hành lại cho việc khác. Chờ xong thì nó được gắn lại vào một luồng OS nào đó để chạy tiếp.

Nói cách khác: **luồng OS không bao giờ ngồi không vì chờ**.

━━━━━━━━━━━━━━━━━━━━

⚡ MƯỜI NGHÌN VIỆC CÙNG LÚC

\`\`\`java
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        pool.submit(() -> { Thread.sleep(50); return null; });
    }
}   // close() đợi tất cả xong
\`\`\`

Mười nghìn việc, mỗi việc chờ 50 mili-giây. Làm tuần tự thì mất **500 giây**. Chạy thật:

\`\`\`
3) 10000 luong ao, hoan thanh du? true
4) tuan tu se mat 500s, thuc te duoi 5s? true
5) so nhan CPU it hon 10000 lan? true
\`\`\`

Xong trong vài giây, không sót việc nào, trên một máy chỉ có vài nhân CPU.

Để ý tên hàm: \`newVirtualThreadPerTaskExecutor\` — **mỗi việc một luồng ảo**. Không còn phải ngồi tính "hồ bơi nên có bao nhiêu luồng" như Ngày 42. Câu hỏi đó biến mất.

Và chú ý \`try (var pool = ...)\`: từ Java 19, \`ExecutorService\` là \`AutoCloseable\`, nên \`try-with-resources\` của Ngày 23 lo luôn việc \`shutdown\` + đợi xong.

━━━━━━━━━━━━━━━━━━━━

📖 ĐIỀU HAY NHẤT: CODE QUAY LẠI KIỂU TUẦN TỰ

Hôm qua để tránh chặn luồng, ta phải viết dây chuyền \`thenApply\`, \`thenCombine\`, \`exceptionally\`. Mạnh, nhưng khó đọc và khó gỡ lỗi.

Với luồng ảo, chặn KHÔNG CÒN ĐẮT nữa — vì chỉ luồng ảo bị chặn, luồng OS vẫn đi làm việc khác. Nên ta viết lại kiểu cũ:

\`\`\`java
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    Future<String> a = pool.submit(() -> goiApi("thong tin"));
    Future<String> b = pool.submit(() -> goiApi("don hang"));
    String kq = a.get() + " + " + b.get();      // "chặn" mà không tốn gì
}
\`\`\`

\`\`\`
6) viet tuan tu, chay song song -> api-1 api-2 api-3
\`\`\`

Đọc từ trên xuống dưới, không callback, không lồng nhau. Gỡ lỗi cũng dễ hơn hẳn: stack trace là stack thật của việc đó, không phải một mớ khung của hồ bơi luồng.

Đây là điểm khiến luồng ảo quan trọng: nó không chỉ nhanh hơn, nó làm code **đơn giản trở lại**.

━━━━━━━━━━━━━━━━━━━━

🧭 KHI NÀO DÙNG, KHI NÀO KHÔNG

**Dùng luồng ảo** khi việc chủ yếu là CHỜ:

- Gọi API, truy vấn cơ sở dữ liệu, đọc/ghi file
- Máy chủ web xử lý nhiều yêu cầu đồng thời

**Đừng dùng** khi việc nặng CPU:

- Tính toán, mã hoá, nén ảnh, xử lý dữ liệu lớn trong bộ nhớ

Lý do rất đơn giản: luồng ảo không làm CPU chạy nhanh hơn. Nó chỉ xoá bỏ chi phí NGỒI ĐỢI. Việc nặng CPU thì cứ dùng \`newFixedThreadPool(số nhân)\` của Ngày 42 — nhiều luồng hơn số nhân chỉ tổ tốn công chuyển qua lại.

Hai lưu ý nữa:

- **Đừng gộp luồng ảo vào hồ bơi cố định.** Cả ý tưởng của luồng ảo là "tạo thoải mái"; nhốt chúng vào một hồ bơi 200 chỗ là quay lại đúng giới hạn cũ.
- **Cẩn thận với \`synchronized\`.** Trong một số trường hợp, luồng ảo đang giữ khối \`synchronized\` sẽ ghim luôn luồng OS lại (gọi là *pinning*). Dùng \`ReentrantLock\` thì không — và đó chính là bài ngày mai.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo một luồng ảo và một luồng nền tảng, in \`isVirtual()\` của cả hai.
2. Chạy 100.000 việc \`sleep(10)\` bằng luồng ảo và đo thời gian.
3. Thử làm điều tương tự với \`newFixedThreadPool(200)\` — so hai kết quả.
4. Viết lại một dây chuyền \`CompletableFuture\` của Ngày 43 theo kiểu tuần tự với luồng ảo.
5. Chạy một việc nặng CPU (tính số nguyên tố tới 10 triệu) bằng luồng ảo và bằng hồ bơi cố định — giải thích vì sao chênh lệch không đáng kể.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Luồng ảo nhẹ tới mức mỗi việc một luồng là chuyện bình thường. Chờ đợi không còn đắt, nên code bất đồng bộ quay về kiểu tuần tự dễ đọc. Dùng cho việc chờ I/O, không dùng cho việc nặng CPU.

Nhưng dù luồng nặng hay nhẹ, có một vấn đề không đổi: **dữ liệu dùng chung**. Hôm Ngày 41 ta dùng \`synchronized\`, và nó có mấy hạn chế thật sự:

- Không thể "thử khoá, không được thì thôi"
- Không đặt được thời gian chờ tối đa
- Hai luồng khoá chéo nhau là treo vĩnh viễn, không cách nào cứu

\`\`\`java
// Luồng A giữ khoá 1, đợi khoá 2
// Luồng B giữ khoá 2, đợi khoá 1
// → cả hai đứng im mãi mãi
\`\`\`

Ngày 45: \`ReentrantLock\`, \`Semaphore\`, và **deadlock** — cách nó xảy ra, cách tránh, và vì sao nó là cơn ác mộng của hệ thống chạy production. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
