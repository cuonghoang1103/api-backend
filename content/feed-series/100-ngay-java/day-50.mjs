/** "100 Ngày Java với CuongThai" — Ngày 50: dự án nhỏ đa luồng.
    KHÉP GIAI ĐOẠN 6 và MỐC NỬA CHẶNG ĐƯỜNG. Ghép cả bốn mẫu của Ngày 49
    vào một chương trình. Ngày 51 mở Giai đoạn 7 (JVM) nên phần kết phải
    dẫn sang đó.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21; chỉ
    in tổng kết và ngưỡng nên tất định. */
export default {
  day: 50,
  card: 'java-day-50',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-generic-network-resource-fetcher-with-retry-logic-and-custom-exceptions',
    title: 'Bộ tải tài nguyên mạng hoàn chỉnh',
  },

  content: `🏁 100 NGÀY JAVA — NGÀY 50: BỘ TẢI DỮ LIỆU

Nửa chặng đường. Hôm nay không có khái niệm mới — ta ghép cả bốn mẫu của hôm qua vào một chương trình gần với code thật ở công ty.

**Bài toán:** tải dữ liệu từ 6 nguồn khác nhau. Trong đó một nguồn hay lỗi vặt, một nguồn rất chậm. Yêu cầu: luôn trả về đủ 6 kết quả, không để nguồn nào kéo sập cả bộ, và không được gọi quá 3 nguồn cùng lúc.

━━━━━━━━━━━━━━━━━━━━

🍴 FAN-OUT RỒI FAN-IN

\`\`\`java
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    Map<String, Future<String>> giao = new LinkedHashMap<>();
    for (String n : nguon) giao.put(n, pool.submit(() -> thuLai(n, 3)));   // nộp HẾT

    for (var e : giao.entrySet()) { … }                                    // rồi mới thu
}
\`\`\`

\`\`\`
1) tai 6 nguon -> nhan du ket qua? true
\`\`\`

Dùng luồng ảo (Ngày 44) vì đây là việc CHỜ mạng, không phải việc tính toán. \`LinkedHashMap\` để kết quả giữ đúng thứ tự nguồn.

━━━━━━━━━━━━━━━━━━━━

⏱️ HẠN CHỜ — THỨ CỨU CẢ HỆ THỐNG

\`\`\`java
try {
    ket.add(new KetQua(ten, f.get(500, TimeUnit.MILLISECONDS), false));
} catch (TimeoutException t) {
    f.cancel(true);
    ket.add(new KetQua(ten, "du-phong", true));
}
\`\`\`

\`\`\`
2) so nguon phai dung du phong -> 1
3) nguon cham bi timeout? true
\`\`\`

Nguồn "rất chậm" mất 2 giây, quá hạn 500ms nên bị huỷ và thay bằng giá trị dự phòng. Năm nguồn còn lại vẫn về đủ.

Bỏ hạn chờ đi thì sao? Cả sáu kết quả phải đợi nguồn chậm nhất. Người dùng nhìn màn hình trắng 2 giây vì MỘT nguồn phụ.

━━━━━━━━━━━━━━━━━━━━

🔁 THỬ LẠI, NHƯNG KHÔNG PHÁ GIỚI HẠN

Nguồn "hay lỗi" hỏng hai lần đầu:

\`\`\`java
static String thuLai(String nguon, int soLan) throws Exception {
    for (int i = 0; i < soLan; i++) {
        try { return goiNguon(nguon); }
        catch (IllegalStateException e) { Thread.sleep(5L * (1L << i)); }
    }
    throw cuoi;
}
\`\`\`

\`\`\`
4) nguon hay loi da thu lai 3 lan -> thanh cong? true
5) gioi han 3 -> dong thoi cao nhat <= 3? true
\`\`\`

Điểm đáng chú ý: \`Semaphore\` nằm BÊN TRONG \`goiNguon\`, nên mỗi lần thử lại cũng phải xin phép. Thử lại không được phép phá vỡ giới hạn tốc độ — nếu đặt semaphore ở ngoài vòng thử lại thì một nguồn hỏng liên tục sẽ chiếm chỗ của nguồn khác.

Và kết quả cuối:

\`\`\`
6) ket qua thanh cong -> [api-a:ok, api-b:ok, api-c:ok, api-d:ok, hay-loi:ok]
\`\`\`

Năm nguồn thành công (kể cả nguồn hay lỗi, nhờ thử lại), một nguồn dùng dự phòng. Không có ngoại lệ nào thoát ra ngoài, không có luồng nào bị bỏ quên.

━━━━━━━━━━━━━━━━━━━━

🧩 ĐẾM LẠI: BAO NHIÊU BÀI ĐÃ GHÉP VÀO ĐÂY

- \`record KetQua\` — Ngày 38
- \`Stream\` + \`Collectors\` để thống kê — Ngày 31
- Ngoại lệ tự viết, phân biệt lỗi tạm/vĩnh viễn — Ngày 22
- \`try-with-resources\` cho hồ bơi — Ngày 23
- Luồng ảo — Ngày 44
- \`Future\` + hạn chờ — Ngày 42
- \`Semaphore\` — Ngày 45
- \`ConcurrentHashMap\`, \`AtomicInteger\` — Ngày 41–42
- Bốn mẫu thiết kế — Ngày 49

Chín bài trong một chương trình khoảng 60 dòng. Đó là điều tôi muốn bạn thấy ở mỗi mốc tổng kết: những thứ học rời rạc thật ra là một bộ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP MỞ RỘNG

1. Thêm ghi log mỗi lần thử lại kèm tên nguồn và số lần.
2. Thêm *circuit breaker*: nguồn nào lỗi 3 lần liên tiếp thì bỏ qua trong 10 giây tiếp theo.
3. Thay hạn chờ cố định bằng hạn chờ riêng cho từng nguồn.
4. Gom kết quả bằng \`CompletableFuture.allOf\` thay cho vòng \`get()\`.
5. Ghi kết quả ra file CSV (Ngày 34) và thống kê tỉ lệ dự phòng theo nguồn.

━━━━━━━━━━━━━━━━━━━━

🏁 NỬA CHẶNG ĐƯỜNG — 50/100

Nhìn lại năm mươi ngày:

- **1–10** nền tảng: biến, vòng lặp, mảng, chuỗi, method
- **11–20** OOP trọn vẹn
- **21–23** ngoại lệ
- **24–28** collections
- **29–40** Java hiện đại: generics, lambda, stream, optional, file, regex, enum, record, switch mới
- **41–50** đa luồng: từ race condition tới luồng ảo và các mẫu thực chiến

Bạn viết được chương trình Java thật, đọc được code trong dự án, và xử lý được đa luồng — thứ nhiều người đi làm vài năm vẫn né.

Nhưng có một tầng bạn chưa nhìn xuống. Suốt 50 ngày, JVM luôn ở đó lo mọi thứ: cấp bộ nhớ, dọn rác, biên dịch mã máy. Bạn dùng nó mà chưa từng thấy mặt.

Rồi sẽ tới lúc gặp những câu hỏi này:

\`\`\`
java.lang.OutOfMemoryError: Java heap space
\`\`\`

Vì sao hết bộ nhớ khi máy còn 16GB trống? Đặt \`-Xmx\` bao nhiêu là đúng? Vì sao ứng dụng khựng đúng 2 giây rồi chạy tiếp? "Bộ dọn rác" thật ra dọn thế nào?

Ngày 51 mở Giai đoạn 7: **bên trong JVM** — stack và heap, vòng đời một đối tượng, và bộ dọn rác. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
