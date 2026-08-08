/** "100 Ngày Java với CuongThai" — Ngày 52: bộ dọn rác.
    Nối chỗ Ngày 51 kết (ứng dụng khựng 2 giây rồi chạy tiếp). Dùng lại
    định nghĩa "rác" và rò rỉ tham chiếu của Ngày 51. Ngày 53 (JUnit) trỏ
    ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21; in so
    sánh và ngưỡng nên tất định. */
export default {
  day: 52,
  card: 'java-day-52',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'generic-file-statistics-analyzer',
    title: 'Bộ phân tích thống kê tệp tin',
  },

  content: `🗑️ 100 NGÀY JAVA — NGÀY 52: BỘ DỌN RÁC

Hôm qua kết ở một hiện tượng rất thật:

\`\`\`
Ứng dụng chạy mượt, bỗng khựng 2 giây, rồi lại bình thường.
Không có yêu cầu nào nặng. CPU nhảy vọt rồi về.
\`\`\`

Đó là bộ dọn rác. Hôm nay ta xem nó làm gì trong hai giây đó — và vì sao nó phải dừng cả chương trình lại.

━━━━━━━━━━━━━━━━━━━━

👶 GIẢ THUYẾT THẾ HỆ

Toàn bộ thiết kế GC hiện đại đứng trên một quan sát:

> **Hầu hết đối tượng chết rất trẻ.**

Nghĩ về code bạn viết: chuỗi tạm trong vòng lặp, đối tượng trả về từ một method, danh sách trung gian trong stream. Chúng sống vài mili-giây rồi thành rác. Ngược lại, một khi đối tượng đã sống được lâu (cấu hình, cache, kết nối) thì nó thường sống tiếp rất lâu.

Nên JVM chia heap làm hai:

\`\`\`
YOUNG GEN   đối tượng mới sinh ra ở đây
            dọn LIÊN TỤC, rất nhanh (minor GC)
            phần lớn chết ngay → chỉ chép số ít còn sống sang bên

OLD GEN     ai sống sót qua nhiều lần dọn thì được "thăng hạng" lên đây
            dọn HIẾM, và CHẬM (major / full GC)
\`\`\`

Chạy thật: tạo khoảng 2GB rác ngắn hạn rồi đọc số liệu GC:

\`\`\`
1) JVM co bo don rac? true
2) tao ~2GB rac ngan han -> GC da chay them? true
5) heap chia thanh nhieu vung? true
\`\`\`

Điểm hay: dọn vùng trẻ rất rẻ vì GC không quét toàn bộ heap — nó chỉ đi qua vùng trẻ và chép những đối tượng CÒN SỐNG sang chỗ mới. Rác không phải đụng tới. Càng nhiều rác thì càng… nhanh.

━━━━━━━━━━━━━━━━━━━━

🛑 VÌ SAO PHẢI "DỪNG CẢ THẾ GIỚI"

GC không chỉ đánh dấu — nó còn **di chuyển** đối tượng để dồn bộ nhớ liền mạch. Mà di chuyển thì mọi tham chiếu trỏ tới nó phải được cập nhật.

Nếu chương trình vẫn chạy trong lúc đó, một luồng có thể đang cầm địa chỉ cũ. Nên GC phải dừng mọi luồng ứng dụng lại — gọi là *stop-the-world*.

Hệ quả rất thực tế:

- **Minor GC**: vài mili-giây. Không ai để ý.
- **Full GC** trên heap lớn: từ vài trăm mili-giây tới vài giây. Người dùng thấy trang đứng hình, request timeout, cảnh báo hệ thống nổ.

Đọc số liệu ngay trong code:

\`\`\`java
for (GarbageCollectorMXBean g : ManagementFactory.getGarbageCollectorMXBeans()) {
    g.getCollectionCount();   // đã dọn bao nhiêu lần
    g.getCollectionTime();    // tổng thời gian dừng
}
\`\`\`

\`\`\`
3) tong thoi gian GC do duoc >= 0ms? true
\`\`\`

Đây là hai con số đáng đưa vào bảng theo dõi hệ thống: số lần dọn tăng đột biến, hoặc tổng thời gian dừng tăng dần, là dấu hiệu sớm của rắc rối.

━━━━━━━━━━━━━━━━━━━━

🧹 BA BỘ DỌN RÁC HAY GẶP

\`\`\`bash
-XX:+UseParallelGC   # thông lượng cao nhất, dừng lâu nhất
-XX:+UseG1GC         # MẶC ĐỊNH từ Java 9 — cân bằng
-XX:+UseZGC          # dừng dưới 1ms, kể cả heap hàng trăm GB
\`\`\`

Chọn theo thứ bạn cần:

- **Parallel** — chạy batch, xử lý dữ liệu ban đêm. Không ai chờ, nên dừng lâu cũng được, miễn tổng thời gian ngắn.
- **G1** — ứng dụng web thường ngày. Chia heap thành nhiều vùng nhỏ và dọn dần, nên độ trễ khá đều. Mặc định, và hợp với hầu hết trường hợp.
- **ZGC** — hệ thống đòi độ trễ thấp: giao dịch, game, quảng cáo thời gian thực. Dừng gần như không đo được, đổi lại tốn CPU và bộ nhớ hơn.

Lời khuyên thực dụng: **đừng đổi GC khi chưa đo**. Đổi bừa thường làm chậm hơn. Chỉ đổi khi đã thấy rõ trong log rằng thời gian dừng là vấn đề.

━━━━━━━━━━━━━━━━━━━━

📊 ĐỌC LOG GC

\`\`\`bash
java -Xlog:gc -Xmx512m ChuongTrinh
\`\`\`

Ba dấu hiệu cần biết đọc:

1. **Full GC liên tục mà bộ nhớ không giảm** → đây KHÔNG phải vấn đề của GC, mà là **rò rỉ tham chiếu** (Ngày 51). GC đang cố hết sức nhưng không có gì để dọn vì mọi thứ vẫn "có người giữ". Chữa bằng cách tìm chỗ giữ tham chiếu, không phải bằng cách tăng \`-Xmx\`.
2. **Minor GC quá thường xuyên** → vùng trẻ quá nhỏ so với tốc độ sinh rác, hoặc code tạo quá nhiều đối tượng tạm (nhớ \`StringBuilder\` của Ngày 36).
3. **Thời gian dừng dài dần theo thời gian chạy** → heap đang phình, thường cũng là rò rỉ.

━━━━━━━━━━━━━━━━━━━━

🧭 BẠN LÀM GÌ ĐƯỢC ĐỂ GC NHẸ NHÀNG

Không phải chỉnh tham số — mà là viết code tử tế:

- **Đừng giữ tham chiếu quá lâu.** Cache phải có hạn mức và hạn tuổi.
- **Tránh tạo đối tượng vô ích trong vòng lặp** — chính là bài \`StringBuilder\` Ngày 36.
- **Đừng gọi \`System.gc()\`.** Nó chỉ ép một lần dừng vô ích, và JVM vốn biết khi nào nên dọn.
- **Đặt \`-Xms\` bằng \`-Xmx\`** để heap không phải co giãn liên tục.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chạy một chương trình tạo nhiều rác với \`-Xlog:gc\` và đọc log.
2. In \`getCollectionCount()\` trước và sau khi tạo 1GB rác.
3. So thời gian chạy giữa \`-XX:+UseParallelGC\` và \`-XX:+UseG1GC\` trên cùng việc.
4. Tạo rò rỉ bằng \`static List\` rồi quan sát full GC lặp lại mà bộ nhớ không giảm.
5. Viết một vòng lặp nối chuỗi bằng \`+\` và bằng \`StringBuilder\`, so số lần GC của hai bản.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

GC chia heap thành thế hệ trẻ và già vì hầu hết đối tượng chết rất trẻ. Nó phải dừng chương trình để di chuyển đối tượng — minor GC thì không ai thấy, full GC trên heap lớn thì người dùng thấy. G1 là mặc định hợp lý; đừng đổi khi chưa đo. Và full GC liên tục thường là rò rỉ, không phải lỗi của GC.

Hai ngày qua ta nhìn xuống tầng dưới của Java. Nhưng có một câu hỏi khó chịu hơn đang chờ.

Suốt 52 ngày, mỗi lần viết xong một hàm, bạn kiểm tra nó bằng cách nào? Chạy \`main\`, in ra màn hình, mắt nhìn xem có đúng không. Rồi sửa một chỗ khác, lại chạy lại, lại nhìn.

Với 5 hàm thì được. Với 500 hàm và một đội 5 người thì không ai làm nổi — và không ai dám sửa code cũ vì không biết mình vừa làm hỏng cái gì.

Ngày 53: **JUnit** — viết test tự động, để máy kiểm tra thay bạn và báo ngay khi có thứ vỡ. Đây là ranh giới rõ nhất giữa code sinh viên và code đi làm. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
