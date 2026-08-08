/** "100 Ngày Java với CuongThai" — Ngày 47: BlockingQueue.
    Nối chỗ Ngày 46 kết ("đừng chia sẻ biến, hãy chuyền tin nhắn"). Dùng
    lại Queue của Ngày 28, ExecutorService của Ngày 42. Ngày 48
    (parallelStream) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21; chỉ
    in TỔNG KẾT để output tất định, không để các thợ tự in. */
export default {
  day: 47,
  card: 'java-day-47',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-reactive-stream-pipeline-with-backpressure-simulation',
    title: 'Dây chuyền phản ứng có mô phỏng áp lực ngược',
  },

  content: `📮 100 NGÀY JAVA — NGÀY 47: BLOCKINGQUEUE

Sáu ngày qua ta chia sẻ dữ liệu giữa các luồng bằng biến chung, và trả giá đủ cả: race condition (41), phải khoá (45), deadlock (45), rồi phải đi chẩn đoán (46).

Hôm nay là hướng tiếp cận khác hẳn — và trong nhiều trường hợp là hướng ĐÚNG:

> **Đừng chia sẻ biến. Hãy chuyền tin nhắn.**

━━━━━━━━━━━━━━━━━━━━

📌 HÀNG ĐỢI TỰ LO ĐỒNG BỘ

\`\`\`java
BlockingQueue<String> hang = new ArrayBlockingQueue<>(5);

hang.put("viec");     // hàng ĐẦY thì tự đợi
String v = hang.take(); // hàng RỖNG thì tự đợi
\`\`\`

Đó là toàn bộ API bạn cần. Không \`synchronized\`, không \`lock\`, không \`AtomicInteger\`.

\`BlockingQueue\` là \`Queue\` của Ngày 28, thêm hai chữ "chặn": \`put\` chặn khi đầy, \`take\` chặn khi rỗng. Bên trong nó đã lo hết phần khoá — và lo đúng, vì đó là code của thư viện chuẩn đã được hàng triệu ứng dụng chạy qua.

Điểm mấu chốt: **mỗi phần tử chỉ được đúng MỘT luồng lấy**. Nên hai thợ không bao giờ xử lý trùng một việc, và bạn không cần nghĩ về chuyện đó nữa.

━━━━━━━━━━━━━━━━━━━━

👷 MỘT NGƯỜI ĐƯA VIỆC, NHIỀU THỢ LÀM

Đây là mô hình kinh điển — *producer/consumer*:

\`\`\`java
// Người sản xuất: đọc file, nhận request, quét thư mục…
for (int i = 1; i <= 50; i++) hang.put("viec-" + i);

// Thợ (chạy trong ExecutorService của Ngày 42)
while (true) {
    String v = hang.take();
    if (v.equals(HET)) { hang.put(HET); break; }
    xuLy(v);
}
\`\`\`

Chạy thật với 50 việc và 3 thợ:

\`\`\`
1) 50 viec, 3 tho -> xu ly du? true
2) moi tho ket thuc trong 5s? true
\`\`\`

Đủ 50 việc, không sót, không trùng — mà không có một dòng đồng bộ nào do bạn viết.

Và nó tự cân tải: thợ nào rảnh thì lấy việc tiếp. Thợ gặp việc nặng thì làm chậm hơn, hai thợ kia tự nhận nhiều việc hơn. Bạn không phải chia việc trước.

━━━━━━━━━━━━━━━━━━━━

🛡️ SỨC CHỨA LÀ VAN AN TOÀN

\`\`\`java
new ArrayBlockingQueue<>(5)    // giới hạn 5
new LinkedBlockingQueue<>()    // "vô hạn"
\`\`\`

\`\`\`
3) suc chua 2, con cho? 0 | offer them duoc? false
4) offer co han 50ms -> false
5) poll 50ms tren hang rong -> null
\`\`\`

Đây là điểm nhiều người bỏ qua. Hàng đợi **có giới hạn** thì khi đầy, người sản xuất bị chặn ở \`put\` — tức là nó tự chậm lại theo tốc độ của thợ. Cơ chế này gọi là *backpressure* (áp lực ngược), và nó miễn phí.

Dùng hàng đợi không giới hạn mà người sản xuất nhanh hơn thợ thì hàng đợi phình mãi cho tới \`OutOfMemoryError\`. Một lỗi rất hay gặp ở hệ thống xử lý log hoặc nhận sự kiện.

Cũng như Ngày 28, mỗi thao tác có ba biến thể: \`put\`/\`take\` (đợi mãi), \`offer\`/\`poll\` (trả về ngay), \`offer\`/\`poll\` có hạn chờ.

━━━━━━━━━━━━━━━━━━━━

🛑 DỪNG SAO CHO ĐÚNG

Đây là chỗ người mới hay mắc: thợ chạy \`while (true)\` thì làm sao dừng?

\`\`\`java
hang.put(HET);      // người sản xuất gửi tín hiệu kết thúc

// thợ:
if (v.equals(HET)) {
    hang.put(HET);   // TRẢ LẠI để thợ khác cũng thấy
    break;
}
\`\`\`

Mẹo "trả lại tín hiệu" (*poison pill*) rất đáng nhớ: mỗi thợ thấy tín hiệu thì bỏ nó vào lại rồi mới thoát, nên cả ba thợ đều nhận được.

Không có tín hiệu này thì thợ đứng đợi mãi ở \`take()\`, \`awaitTermination\` hết hạn, chương trình không thoát — đúng cái bẫy \`shutdown()\` của Ngày 42, lần này ở dạng khác.

Và khi việc có độ ưu tiên khác nhau:

\`\`\`
6) PriorityBlockingQueue lay ra -> 10 30
\`\`\`

\`PriorityBlockingQueue\` lấy theo thứ tự \`Comparable\` (Ngày 26), không theo thứ tự vào.

━━━━━━━━━━━━━━━━━━━━

🧭 VÌ SAO ĐÂY LÀ HƯỚNG ĐÚNG

So hai cách làm cùng một việc:

**Chia sẻ biến:** một \`List\` chung, mọi luồng cùng đọc/ghi → phải khoá → phải nghĩ về thứ tự khoá → có nguy cơ deadlock → phải biết đọc thread dump.

**Chuyền tin nhắn:** một hàng đợi, người đưa chỉ \`put\`, thợ chỉ \`take\` → không ai đụng dữ liệu của ai → cả lớp bug kia không tồn tại.

Đây cũng là triết lý của Go (channel), Erlang, và các hệ thống actor: *"Đừng giao tiếp bằng cách chia sẻ bộ nhớ; hãy chia sẻ bộ nhớ bằng cách giao tiếp."*

Trong Java, \`BlockingQueue\` là cách rẻ nhất để làm điều đó — không cần thư viện gì thêm.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết 1 người sản xuất + 2 thợ xử lý 20 việc, in tổng số việc mỗi thợ làm.
2. Đặt sức chứa hàng đợi bằng 1 rồi quan sát người sản xuất bị chặn.
3. Bỏ tín hiệu kết thúc và xem chương trình không thoát.
4. Dùng \`offer\` có hạn chờ để bỏ việc khi hàng quá tải.
5. Đổi sang \`PriorityBlockingQueue\` với việc có mức ưu tiên, kiểm chứng việc gấp ra trước.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`BlockingQueue\` biến bài toán đồng bộ thành bài toán chuyền việc: \`put\` và \`take\`, hết. Sức chứa có hạn cho bạn backpressure miễn phí, và tín hiệu kết thúc lo phần dừng sạch.

Nhưng nhìn lại thì hôm nay ta vẫn phải tự dựng khá nhiều: tạo hồ bơi, viết vòng lặp thợ, nghĩ tín hiệu dừng. Với một việc đơn giản như "xử lý một triệu phần tử trong danh sách bằng nhiều nhân CPU" thì hơi nặng nề.

Nhớ Stream của Ngày 31 chứ? Java cho bạn song song hoá nó bằng đúng MỘT chữ:

\`\`\`java
ds.stream()          →  ds.parallelStream()
\`\`\`

Ngày 48: \`parallelStream\` — khi nào nó thật sự nhanh hơn, khi nào nó CHẬM hơn hẳn, và ba cái bẫy khiến kết quả sai mà không ai báo. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
