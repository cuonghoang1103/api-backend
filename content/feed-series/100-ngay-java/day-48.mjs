/** "100 Ngày Java với CuongThai" — Ngày 48: parallelStream.
    Nối chỗ Ngày 47 kết (song song hoá Stream bằng một chữ). Dùng lại
    race condition của Ngày 41 và Stream của Ngày 31. Ngày 49 (mẫu thiết
    kế đa luồng) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21; phép
    đo in NGƯỠNG và phép thử race chạy 5 lượt để output tất định. */
export default {
  day: 48,
  card: 'java-day-48',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-metro-transit-route-analyzer-using-adjacency-list-graph-traversal',
    title: 'Phân tích tuyến metro bằng duyệt đồ thị',
  },

  content: `⚡ 100 NGÀY JAVA — NGÀY 48: PARALLELSTREAM

Hôm qua ta tự dựng hồ bơi, viết vòng lặp thợ, nghĩ tín hiệu dừng. Với việc "xử lý hai triệu phần tử bằng nhiều nhân CPU" thì nặng nề quá.

Java cho một lối tắt — đổi đúng một chữ:

\`\`\`java
so.stream()          .mapToLong(...).sum();
so.parallelStream()  .mapToLong(...).sum();
\`\`\`

Chạy thật với hai triệu số và một phép tính nặng:

\`\`\`
1) cung ket qua? true
2) song song nhanh hon (viec nang CPU)? true
\`\`\`

Cùng kết quả, nhanh hơn, và bạn không tạo luồng nào cả. Bên dưới nó dùng \`ForkJoinPool.commonPool()\`, tự chia dữ liệu theo số nhân máy.

Nghe như phép màu. Nhưng nó có giá, và hôm nay ta xem giá đó.

━━━━━━━━━━━━━━━━━━━━

💥 BẪY 1: BIẾN CHUNG TRONG forEach

\`\`\`java
int[] dem = {0};
so.parallelStream().limit(100_000).forEach(x -> dem[0]++);
\`\`\`

\`\`\`
3) BAY: dem bang bien chung -> co mat so? true
\`\`\`

Đúng race condition của Ngày 41 — chỉ khác là lần này nó nấp sau một chữ \`parallel\` trông rất vô hại. Không có \`new Thread\`, không có \`synchronized\`, nên người viết không nghĩ mình đang làm việc với đa luồng.

Sửa thì như cũ:

\`\`\`java
AtomicInteger dem = new AtomicInteger();
so.parallelStream().forEach(x -> dem.incrementAndGet());
\`\`\`

\`\`\`
4) SUA: AtomicInteger -> dung? true
\`\`\`

Nhưng cách ĐÚNG hơn là đừng đếm bằng biến ngoài chút nào:

\`\`\`java
long dem = so.parallelStream().filter(...).count();     // ✓ để stream tự lo
\`\`\`

Quy tắc vàng: **lambda trong stream song song không được sửa gì bên ngoài nó**. Chỉ nhận vào, trả ra.

━━━━━━━━━━━━━━━━━━━━

🔀 BẪY 2: MẤT THỨ TỰ

\`\`\`java
parallelStream().forEach(...)          // thứ tự NGẪU NHIÊN
parallelStream().forEachOrdered(...)   // giữ đúng thứ tự
\`\`\`

\`\`\`
5) forEachOrdered giu thu tu -> 12345678
\`\`\`

\`forEach\` không hứa thứ tự nào — in log ra sẽ thấy lộn xộn. Cần đúng thứ tự thì \`forEachOrdered\`, nhưng nó chậm hơn vì các luồng phải chờ nhau.

Tin tốt: \`collect(toList())\` VẪN giữ đúng thứ tự, kể cả song song. Nên phần lớn trường hợp bạn không phải lo.

Và \`reduce\` vẫn cho kết quả đúng:

\`\`\`
6) reduce song song -> 36 (dung vi cong co tinh ket hop)
\`\`\`

Nhưng chỉ đúng khi phép gộp có **tính kết hợp** — \`(a+b)+c\` bằng \`a+(b+c)\`. Cộng và nhân thì có; trừ và chia thì KHÔNG, và \`reduce\` song song với phép trừ sẽ cho kết quả sai khác nhau mỗi lần chạy.

━━━━━━━━━━━━━━━━━━━━

🐢 BẪY 3: NHIỀU KHI NÓ CHẬM HƠN

Đây là điều ít người nói: \`parallelStream\` thường xuyên CHẬM hơn bản tuần tự.

Chia dữ liệu, phân việc cho các luồng, rồi gộp kết quả — tất cả đều tốn. Với dữ liệu nhỏ hoặc phép tính nhẹ, chi phí đó lớn hơn phần tiết kiệm được.

**Nên dùng khi cả ba điều sau cùng đúng:**

1. Dữ liệu lớn (từ hàng chục nghìn phần tử trở lên)
2. Mỗi phần tử tốn kha khá CPU
3. Nguồn dữ liệu chia tách rẻ — \`ArrayList\` hoặc mảng thì tốt, \`LinkedList\` thì tệ (phải đi từ đầu mới chia được)

**Đừng dùng khi:**

- Bên trong có I/O — gọi API, đọc file, truy vấn DB. Đó là việc chờ đợi, và chỗ đúng cho nó là luồng ảo của Ngày 44. Tệ hơn: \`commonPool\` dùng chung cho cả ứng dụng, một tác vụ I/O chậm sẽ chặn mọi \`parallelStream\` khác.
- Đang chạy trong một máy chủ web đã xử lý nhiều yêu cầu song song. CPU vốn đã bận, chia nhỏ thêm chỉ tốn công quản lý.

**Và luôn ĐO trước khi đổi.** Đừng thay \`stream()\` bằng \`parallelStream()\` chỉ vì nghe có vẻ nhanh hơn — đó là một trong những "tối ưu" hay phản tác dụng nhất.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tính tổng bình phương 10 triệu số bằng cả hai cách, đo thời gian.
2. Làm lại với danh sách 100 phần tử — quan sát song song chậm hơn.
3. Đếm bằng biến ngoài trong \`parallelStream().forEach\` và chạy 5 lần, ghi kết quả từng lần.
4. So \`forEach\` và \`forEachOrdered\` trên cùng dữ liệu.
5. Dùng \`reduce\` với phép TRỪ ở cả hai chế độ — giải thích vì sao kết quả khác nhau.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`parallelStream\` cho song song gần như miễn phí về mặt cú pháp, nhưng không miễn phí về mặt tư duy: không sửa biến ngoài, cẩn thận thứ tự, phép gộp phải có tính kết hợp, và luôn đo trước khi tin.

Tám ngày qua ta đã đi qua gần hết công cụ đa luồng: \`Thread\`, hồ bơi, \`Future\`, \`CompletableFuture\`, luồng ảo, khoá, deadlock, hàng đợi, stream song song.

Nhưng biết công cụ và biết CHỌN công cụ là hai chuyện khác nhau. Đứng trước một bài toán thật — "xử lý 100.000 ảnh", "gọi 50 API rồi gộp kết quả", "một máy chủ nhận 5.000 yêu cầu đồng thời" — bạn dùng cái nào?

Ngày 49: bảng chọn công cụ theo tình huống, cùng những mẫu thiết kế đa luồng thường gặp trong dự án thật — và các lỗi kinh điển ở mỗi mẫu. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
