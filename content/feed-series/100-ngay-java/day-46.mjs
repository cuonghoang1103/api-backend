/** "100 Ngày Java với CuongThai" — Ngày 46: chẩn đoán đa luồng.
    Nối chỗ Ngày 45 kết (máy chủ đứng im, CPU 0%, không log gì). Ngày 47
    (BlockingQueue) trỏ ngược về phần kết.

    Bài này về `jstack` — công cụ dòng lệnh nên không dán được vào thẻ.
    Chương trình kiểm chứng dùng `ThreadMXBean`, chính API mà jstack đứng
    trên: tự tạo deadlock rồi tự phát hiện. Mọi output là kết quả THẬT
    của javac/java trên JDK 21. */
export default {
  day: 46,
  card: 'java-day-46',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-polymorphic-payment-processing-system',
    title: 'Hệ thống thanh toán đa hình',
  },

  content: `🔎 100 NGÀY JAVA — NGÀY 46: CHẨN ĐOÁN LUỒNG

Tình huống hôm qua bỏ ngỏ, và nó là tình huống thật:

Ba giờ chiều, máy chủ ngừng trả lời. Nhưng tiến trình vẫn sống. CPU 0%. Bộ nhớ bình thường. Log không có dòng nào bất thường — dòng cuối cùng là một yêu cầu thành công cách đây mười phút.

Không có ngoại lệ nên không có stack trace. Không có gì để đọc.

Bạn làm gì? Khởi động lại thì hết treo — nhưng ba tiếng sau nó lặp lại, và bạn vẫn không biết vì sao.

━━━━━━━━━━━━━━━━━━━━

📌 THREAD DUMP — ẢNH CHỤP MỌI LUỒNG

Thứ bạn cần là **thread dump**: ảnh chụp tại một thời điểm cho biết mọi luồng trong JVM đang làm gì, đang đợi cái gì, và ai đang giữ cái nó đợi.

Ba lệnh cần thuộc:

\`\`\`bash
jps -l                      # tìm pid của tiến trình Java
jstack <pid> > dump.txt     # chụp trạng thái mọi luồng
jcmd <pid> Thread.print     # tương đương, lệnh mới hơn
\`\`\`

Cả ba đều có sẵn trong JDK, không phải cài gì.

**Việc đầu tiên khi gặp treo: chụp dump TRƯỚC khi khởi động lại.** Khởi động lại là xoá sạch bằng chứng — và bạn sẽ chờ nó tái diễn để điều tra lại từ đầu.

Mẹo thực dụng: chụp **ba lần cách nhau 5 giây**. Luồng nào ở nguyên một chỗ qua cả ba lần là luồng đang kẹt thật, chứ không phải tình cờ bị bắt gặp giữa lúc làm việc.

━━━━━━━━━━━━━━━━━━━━

🎯 JVM TỰ BIẾT MÌNH ĐANG DEADLOCK

Điều nhiều người không biết: bạn không cần công cụ ngoài. JVM có sẵn API tự kiểm tra.

\`\`\`java
ThreadMXBean mx = ManagementFactory.getThreadMXBean();
long[] ket = mx.findDeadlockedThreads();     // != null nghĩa là CÓ deadlock
\`\`\`

Chạy thật trên đúng đoạn deadlock của Ngày 45:

\`\`\`
1) JVM phat hien deadlock? true
2) so luong bi ket -> 2
3) ten cac luong -> [luong-A, luong-B]
4) trang thai -> BLOCKED
5) dang doi khoa do luong -> true
\`\`\`

JVM chỉ đúng hai luồng, cho biết chúng \`BLOCKED\`, và cho biết khoá chúng đợi đang do luồng khác giữ.

Đây là thứ đáng nhúng vào **health check** của ứng dụng: mỗi phút kiểm một lần, phát hiện deadlock thì ghi log kèm tên luồng và bắn cảnh báo. Thay vì đợi người dùng gọi điện, hệ thống tự báo — kèm sẵn manh mối.

Và \`jstack\` chính là công cụ dòng lệnh đứng trên API này, chỉ khác là nó in ra dạng người đọc.

━━━━━━━━━━━━━━━━━━━━

📊 ĐỌC TRẠNG THÁI LUỒNG

Trong dump, mỗi luồng có một trạng thái. Đây là bảng tra:

\`\`\`
RUNNABLE       đang chạy (hoặc đang chờ I/O — dump không phân biệt được)
BLOCKED        đang chờ để vào một khối synchronized
WAITING        chờ vô hạn (join, wait, lock.lock)
TIMED_WAITING  chờ có hạn (sleep, wait(1000), tryLock 100ms)
TERMINATED     đã xong
\`\`\`

\`\`\`
6) luong-A con song? true | state BLOCKED
\`\`\`

Cách đọc nhanh một dump:

- **Nhiều luồng \`BLOCKED\` trên CÙNG một khoá** → điểm nghẽn. Có thể không phải deadlock, chỉ là khoá quá rộng (Ngày 41) khiến mọi người xếp hàng.
- **Hai luồng \`BLOCKED\` chờ chéo nhau** → deadlock. Trong dump của \`jstack\`, tìm chữ *"Found one Java-level deadlock"* là nó chỉ thẳng ra.
- **Toàn bộ luồng của hồ bơi đều \`WAITING\`** → cạn luồng. Thường do gọi \`get()\`/\`join()\` ngay bên trong tác vụ của chính hồ bơi đó — đúng cảnh báo cuối bài Ngày 43.
- **Một luồng \`RUNNABLE\` suốt ba lần chụp, cùng một dòng code** → vòng lặp vô hạn, không phải chờ khoá.

━━━━━━━━━━━━━━━━━━━━

🧭 QUY TRÌNH KHI GẶP TREO

1. **Chụp dump ngay**, ba lần cách nhau 5 giây. Chưa khởi động lại vội.
2. Tìm chữ \`deadlock\` trong dump. Có thì xong — nó chỉ luôn tên luồng và dòng code.
3. Không có thì đếm trạng thái: bao nhiêu \`BLOCKED\`, chờ khoá nào, ai giữ khoá đó.
4. So ba lần chụp: luồng nào đứng yên là luồng đáng ngờ.
5. Lần theo stack trace của luồng đó về đúng dòng code trong dự án của bạn (bỏ qua các khung của thư viện).

Một điều đáng nhớ: **CPU 0% mà treo** gần như luôn là vấn đề khoá hoặc chờ. Còn **CPU 100% mà treo** là vòng lặp vô hạn hoặc bộ dọn rác vật lộn — hai hướng điều tra hoàn toàn khác nhau.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chạy lại chương trình deadlock của Ngày 45, để nó treo, rồi \`jps\` + \`jstack\` và tìm chữ "deadlock".
2. Nhúng \`findDeadlockedThreads()\` vào một luồng kiểm tra mỗi 2 giây, in cảnh báo khi phát hiện.
3. Tạo 5 luồng cùng tranh một khoá, chụp dump và đếm số luồng \`BLOCKED\`.
4. Cho một luồng \`sleep(10000)\` và một luồng chạy vòng lặp vô hạn — so hai trạng thái trong dump.
5. Gọi \`Future.get()\` bên trong chính hồ bơi tạo ra nó để tự tạo cạn luồng, rồi đọc dump.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Treo mà không có log thì thread dump là bằng chứng duy nhất — và phải chụp trước khi khởi động lại. \`jps\` + \`jstack\`, đọc trạng thái luồng, so nhiều lần chụp. JVM còn tự phát hiện được deadlock qua \`ThreadMXBean\`, đủ để nhúng vào health check.

Sáu ngày qua ta chia sẻ dữ liệu giữa các luồng bằng biến chung — và trả giá: race condition (41), khoá (45), deadlock (45), rồi phải đi chẩn đoán (46).

Nhưng có một hướng khác hẳn: **đừng chia sẻ biến, hãy chuyển tin nhắn**.

\`\`\`java
// Một luồng đọc file, đẩy từng dòng vào hàng đợi
// Ba luồng khác lấy từ hàng đợi ra xử lý
// Không ai đụng vào biến của ai
\`\`\`

Ngày 47: \`BlockingQueue\` và mô hình sản-xuất/tiêu-thụ — hàng đợi tự lo việc đồng bộ, và cả lớp bug ta vừa học cách gỡ đơn giản là không xuất hiện. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
