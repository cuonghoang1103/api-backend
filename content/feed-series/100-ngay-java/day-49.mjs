/** "100 Ngày Java với CuongThai" — Ngày 49: mẫu thiết kế đa luồng.
    Nối chỗ Ngày 48 kết (biết công cụ ≠ biết chọn công cụ). Gom lại toàn
    bộ Giai đoạn 6 thành bảng chọn theo tình huống. Ngày 50 khép giai
    đoạn nên phần kết dẫn sang dự án nhỏ.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 49,
  card: 'java-day-49',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-generic-network-resource-fetcher-with-retry-logic-and-custom-exceptions',
    title: 'Bộ tải tài nguyên mạng có thử lại và ngoại lệ riêng',
  },

  content: `🧰 100 NGÀY JAVA — NGÀY 49: MẪU ĐA LUỒNG

Tám ngày qua bạn có đủ công cụ: \`Thread\`, hồ bơi, \`Future\`, \`CompletableFuture\`, luồng ảo, khoá, hàng đợi, stream song song.

Nhưng biết công cụ và biết CHỌN công cụ là hai chuyện khác nhau. Hôm nay là bốn mẫu bạn sẽ gặp đi gặp lại trong dự án thật.

━━━━━━━━━━━━━━━━━━━━

🍴 MẪU 1 — FAN-OUT / FAN-IN

Chia một việc lớn thành nhiều phần, làm song song, rồi gộp kết quả.

\`\`\`java
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<Integer>> phan = new ArrayList<>();
    for (int i = 0; i < 4; i++) {
        phan.add(pool.submit(() -> tinhPhan(i)));    // fan-out
    }
    int tong = 0;
    for (Future<Integer> f : phan) tong += f.get();  // fan-in
}
\`\`\`

\`\`\`
1) fan-out/fan-in tong 1..1000 -> 500500 (dung? true)
\`\`\`

Dùng cho: gọi 5 API rồi gộp, xử lý 10 file cùng lúc, tính toán trên nhiều phần dữ liệu.

**Lỗi kinh điển:** \`get()\` ngay sau mỗi \`submit\` — nộp một việc, đợi xong, mới nộp việc sau. Chương trình chạy tuần tự mà tác giả tưởng đang song song (Ngày 42). Phải nộp HẾT rồi mới thu.

━━━━━━━━━━━━━━━━━━━━

⏱️ MẪU 2 — HẠN CHỜ + GIÁ TRỊ DỰ PHÒNG

\`\`\`java
try {
    kq = f.get(200, TimeUnit.MILLISECONDS);
} catch (TimeoutException e) {
    f.cancel(true);
    kq = "gia tri du phong";
}
\`\`\`

\`\`\`
2) timeout 200ms -> gia tri du phong
\`\`\`

Đây là mẫu quan trọng nhất cho hệ thống chạy thật. Một dịch vụ phụ (gợi ý sản phẩm, thống kê, quảng cáo) treo mà bạn \`get()\` không hạn chờ thì luồng của bạn treo theo — rồi hồ bơi cạn luồng, rồi cả trang không tải được. Một tính năng nhỏ kéo sập toàn bộ.

Nguyên tắc: **mọi lời gọi ra ngoài đều phải có hạn chờ**. Và nhớ \`cancel(true)\` để không bỏ quên một luồng vẫn đang chạy vô ích.

Đây cũng là nền của mẫu *circuit breaker*: một dịch vụ lỗi liên tục thì ngừng gọi nó một thời gian, trả thẳng giá trị dự phòng, thay vì cứ thử rồi cứ đợi.

━━━━━━━━━━━━━━━━━━━━

🎚️ MẪU 3 — GIỚI HẠN TỐC ĐỘ

\`\`\`java
Semaphore gioiHan = new Semaphore(2);

gioiHan.acquire();
try { goiApi(); } finally { gioiHan.release(); }
\`\`\`

Chạy thật 20 việc trên 10 luồng:

\`\`\`
3) Semaphore(2) -> so viec chay dong thoi cao nhat <= 2? true
\`\`\`

Dù có 10 luồng, không lúc nào quá 2 việc chạy cùng lúc.

Dùng khi bên nhận có giới hạn: cơ sở dữ liệu chịu được 10 kết nối, API bên thứ ba cho 5 lời gọi/giây, ổ đĩa chỉ nên đọc 3 file song song. Không giới hạn thì bạn không "nhanh hơn" — bạn làm sập dịch vụ kia rồi nhận lỗi 429 hàng loạt.

Lưu ý \`release()\` phải ở \`finally\`, đúng bài học của Ngày 45.

━━━━━━━━━━━━━━━━━━━━

🔁 MẪU 4 — THỬ LẠI CÓ LÙI DẦN

\`\`\`java
for (int i = 0; i < soLan; i++) {
    try { return viec.call(); }
    catch (Exception e) {
        Thread.sleep(10L * (1L << i));    // 10ms, 20ms, 40ms…
    }
}
\`\`\`

\`\`\`
4) retry -> thanh cong lan 3
\`\`\`

Mạng chập chờn, dịch vụ vừa khởi động lại — những lỗi TẠM THỜI này thử lại là qua.

Hai điều bắt buộc:

- **Lùi dần** (backoff), đừng thử lại ngay lập tức. Mười nghìn client cùng thử lại tức thì sẽ dội bom một dịch vụ vốn đang ốm và giết nó lần thứ hai.
- **Chỉ thử lại lỗi tạm thời.** Sai mật khẩu, dữ liệu không hợp lệ, không tìm thấy — thử 100 lần vẫn sai, chỉ tốn thời gian. Đây là lúc ngoại lệ nghiệp vụ riêng của Ngày 22 phát huy: phân biệt được "lỗi tạm" với "lỗi vĩnh viễn".

━━━━━━━━━━━━━━━━━━━━

🧭 BẢNG CHỌN CÔNG CỤ

| Tình huống | Dùng |
|---|---|
| Tính toán nặng trên tập dữ liệu lớn | \`parallelStream\` (Ngày 48) |
| Gọi nhiều API / truy vấn DB | luồng ảo + fan-out/fan-in (Ngày 44) |
| Máy chủ nhận nhiều yêu cầu | luồng ảo, mỗi yêu cầu một luồng |
| Luồng việc nhiều bước, nhiều thợ | \`BlockingQueue\` (Ngày 47) |
| Vài bước phụ thuộc nhau, có I/O | \`CompletableFuture\` (Ngày 43) |
| Bảo vệ một biến đếm | \`AtomicInteger\` (Ngày 41) |
| Bảo vệ một cụm thao tác | \`ReentrantLock\` (Ngày 45) |
| Giới hạn số việc đồng thời | \`Semaphore\` (Ngày 45) |

Và câu hỏi đầu tiên luôn là: **có thật sự cần đa luồng không?** Một vòng \`for\` chạy 50ms thì đừng đụng vào. Đa luồng đổi tốc độ lấy độ phức tạp — chỉ trả giá đó khi có lời.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tính tổng một mảng 1 triệu phần tử bằng fan-out/fan-in 4 phần, so với tuần tự.
2. Gọi một hàm \`sleep(2000)\` với hạn chờ 300ms và trả giá trị dự phòng.
3. Dùng \`Semaphore(3)\` cho 20 việc, đo số việc chạy đồng thời cao nhất.
4. Viết hàm \`thuLai\` tổng quát có lùi dần, thử với một hàm hỏng 2 lần đầu.
5. Với mỗi dòng trong bảng chọn công cụ, viết một ví dụ ngắn từ dự án bạn từng làm.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Bốn mẫu: chia-rồi-gộp, hạn chờ + dự phòng, giới hạn tốc độ, thử lại có lùi dần. Chúng che gần hết nhu cầu đa luồng trong ứng dụng thường ngày — và mỗi mẫu có một lỗi kinh điển đi kèm mà giờ bạn đã biết mặt.

Mai là Ngày 50 — nửa chặng đường, và khép Giai đoạn 6. Ta sẽ ghép cả bốn mẫu vào một chương trình hoàn chỉnh: một bộ tải dữ liệu nhiều nguồn, có giới hạn tốc độ, có hạn chờ, có thử lại, có thống kê — thứ gần nhất với code bạn sẽ viết ở công ty.

Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
