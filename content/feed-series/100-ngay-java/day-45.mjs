/** "100 Ngày Java với CuongThai" — Ngày 45: khoá nâng cao & deadlock.
    Nối chỗ Ngày 44 kết (synchronized không thử được, không đặt hạn được,
    khoá chéo là treo). Nhắc lại pinning của luồng ảo ở Ngày 44. Ngày 46
    (gỡ lỗi đa luồng) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. Phép
    thử "cách sửa" dùng CẶP KHOÁ RIÊNG — bản đầu dùng chung cặp với phép
    thử deadlock nên chạy trên khoá đang kẹt và cho kết quả ngược. */
export default {
  day: 45,
  card: 'java-day-45',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-flexible-payment-processing-system',
    title: 'Hệ thống xử lý thanh toán linh hoạt',
  },

  content: `🔐 100 NGÀY JAVA — NGÀY 45: KHOÁ & DEADLOCK

Bốn ngày qua ta bảo vệ dữ liệu dùng chung bằng \`synchronized\`. Nó đơn giản và tự nhả khoá — nhưng có ba việc nó không làm được:

1. Thử khoá, không được thì làm việc khác
2. Đợi tối đa một khoảng thời gian rồi bỏ
3. Cho phép nhiều luồng cùng vào tới một hạn mức nào đó

Và nghiêm trọng hơn cả: nó không cứu bạn khỏi **deadlock**.

━━━━━━━━━━━━━━━━━━━━

📌 ReentrantLock — KHOÁ CÓ ĐIỀU KHIỂN

\`\`\`java
static final ReentrantLock lock = new ReentrantLock();

lock.lock();
try {
    dem++;
} finally {
    lock.unlock();      // BẮT BUỘC ở finally
}
\`\`\`

\`\`\`
1) ReentrantLock -> dung? true
\`\`\`

Cùng tác dụng với \`synchronized\`, nhưng bạn tự điều khiển. Đổi lại là một trách nhiệm: \`synchronized\` tự nhả khoá khi thoát khối (kể cả có ngoại lệ), còn \`ReentrantLock\` thì **bạn phải nhả**.

Đây chính là chỗ \`finally\` của Ngày 21 trở nên sống còn: quên nó, hoặc đặt \`unlock()\` ở cuối khối \`try\` mà giữa chừng có ngoại lệ, thì khoá kẹt vĩnh viễn và mọi luồng khác đứng chờ mãi.

("Reentrant" nghĩa là luồng đang giữ khoá có thể \`lock()\` thêm lần nữa mà không tự khoá chính mình — miễn là \`unlock()\` đủ số lần. \`synchronized\` cũng vậy.)

━━━━━━━━━━━━━━━━━━━━

⏱️ tryLock — CÓ LỐI THOÁT

\`\`\`java
lock.tryLock();                            // false nếu người khác đang giữ
lock.tryLock(100, TimeUnit.MILLISECONDS);  // đợi tối đa 100ms
\`\`\`

\`\`\`
2) tryLock khi nguoi khac dang giu -> false
3) tryLock 100ms khi ranh -> true
\`\`\`

Đây là thứ \`synchronized\` không có: nó chỉ biết "đợi tới khi được", không có đường lui.

Với \`tryLock\`, luồng của bạn quyết định được: không lấy được khoá thì báo lỗi cho người dùng, thử lại sau, hoặc làm việc khác — thay vì đứng im vô hạn.

━━━━━━━━━━━━━━━━━━━━

🎟️ Semaphore — GIỚI HẠN SỐ LUỒNG

\`\`\`java
Semaphore cho = new Semaphore(2);    // chỉ 2 luồng vào cùng lúc

cho.acquire();       // xin một chỗ (đợi nếu hết)
try { … } finally { cho.release(); }
\`\`\`

\`\`\`
4) Semaphore(2) da cap het? con lai 0 | xin them duoc? false
\`\`\`

Khoá cho MỘT luồng, semaphore cho N luồng. Việc thật rất hay cần:

- Cơ sở dữ liệu chỉ chịu được 10 kết nối đồng thời
- API bên thứ ba giới hạn 5 lời gọi song song
- Chỉ cho 3 file được tải lên cùng lúc

━━━━━━━━━━━━━━━━━━━━

☠️ DEADLOCK — HAI LUỒNG ĐỨNG IM MÃI MÃI

Đây là phần quan trọng nhất bài hôm nay.

\`\`\`java
Thread A: synchronized (k1) { … synchronized (k2) { … } }
Thread B: synchronized (k2) { … synchronized (k1) { … } }
\`\`\`

A giữ k1 và đợi k2. B giữ k2 và đợi k1. Không ai nhả, không ai đi tiếp.

Chạy thật, đặt hạn chờ nửa giây rồi kiểm tra:

\`\`\`
5) hai luong khoa cheo -> con ket? true
\`\`\`

Vẫn kẹt — và sẽ kẹt mãi.

Điều làm deadlock đáng sợ hơn mọi bug khác:

- **Không có ngoại lệ.** Không \`catch\` được gì cả.
- **Không có log.** Chương trình không báo lỗi, nó chỉ… ngừng.
- **Không tự thoát.** Không timeout, không phục hồi.
- **Không tái hiện đều.** Cần đúng thời điểm hai luồng gặp nhau, nên test hiếm khi bắt được. Nó chờ tới lúc production đông người dùng nhất.

Triệu chứng điển hình: máy chủ vẫn sống, CPU 0%, nhưng không trả lời yêu cầu nào nữa.

━━━━━━━━━━━━━━━━━━━━

✅ CÁCH TRÁNH: LUÔN CÙNG MỘT THỨ TỰ

\`\`\`java
Thread A: synchronized (k3) { … synchronized (k4) { … } }
Thread B: synchronized (k3) { … synchronized (k4) { … } }   // CÙNG thứ tự
\`\`\`

\`\`\`
6) cung thu tu khoa -> ca hai xong? true
\`\`\`

Cùng lấy k3 trước rồi mới k4. Ai lấy được k3 thì chắc chắn lấy được k4 (vì người kia còn đang đợi k3), làm xong rồi nhả cả hai.

Ba nguyên tắc để không bao giờ dính:

1. **Định một thứ tự khoá toàn cục** và mọi nơi tuân theo. Ví dụ: khoá tài khoản có số ID nhỏ trước.
2. **Dùng \`tryLock\` có hạn chờ** thay vì \`lock()\` khi phải giữ nhiều khoá. Không đủ khoá thì nhả hết ra, đợi chút rồi thử lại.
3. **Giữ ít khoá nhất có thể, trong thời gian ngắn nhất.** Không giữ khoá khi gọi ra ngoài (gọi API, truy vấn DB) — bạn không biết bên đó chờ bao lâu.

Có một điểm nữa nối với Ngày 44: luồng ảo mà bị chặn trong khối \`synchronized\` có thể ghim luôn luồng hệ điều hành (*pinning*). Dùng \`ReentrantLock\` thì không bị. Đó là lý do trong code hiện đại dùng luồng ảo, \`ReentrantLock\` được ưu tiên hơn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết bộ đếm dùng \`ReentrantLock\`, cố tình bỏ \`finally\` rồi ném ngoại lệ giữa chừng — quan sát khoá kẹt.
2. Dùng \`tryLock\` để in ra "bận, thử lại sau" thay vì đứng đợi.
3. Dùng \`Semaphore(3)\` giới hạn 3 luồng tải file cùng lúc trong 10 việc.
4. Tự tạo deadlock bằng hai khoá và hai luồng, dùng \`join(1000)\` để phát hiện.
5. Sửa nó bằng cách thống nhất thứ tự khoá, kiểm chứng cả hai luồng xong.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`ReentrantLock\` cho bạn \`tryLock\` và hạn chờ, đổi lại phải tự \`unlock\` trong \`finally\`. \`Semaphore\` giới hạn số luồng. Deadlock không báo lỗi và không tự thoát — phòng bằng cách thống nhất thứ tự khoá.

Nhưng giả sử điều tệ nhất đã xảy ra: máy chủ production đứng im, CPU 0%, không log gì, người dùng gọi điện phàn nàn. Bạn làm gì?

Không có stack trace vì không có ngoại lệ. Không có log vì không có gì để ghi. Chương trình vẫn "đang chạy" theo mọi công cụ giám sát.

Ngày 46: **đọc thread dump** — cách chụp lại trạng thái mọi luồng đang chạy bằng \`jstack\`, tìm ra luồng nào giữ khoá nào, và chỉ mặt chính xác dòng code gây deadlock. Đây là kỹ năng phân biệt người biết Java với người biết gỡ lỗi Java. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
