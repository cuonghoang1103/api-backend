/** "100 Ngày Java với CuongThai" — Ngày 91: Realtime với WebSocket (Blog API).
    Nối đúng chỗ Ngày 90 kết ("việc nền xong thì người dùng biết bằng cách nào?
    hiện phải F5; chẳng lẽ bắt trình duyệt hỏi mỗi vài giây?").
    Ngày 92 (tài liệu API: OpenAPI/Swagger) trỏ ngược về phần kết.

    ⚠ LUẬT 6: pub/sub dựng bằng JDK thuần (broker topic→subscribers), tất định;
    thân bài dạy @MessageMapping/STOMP thật. Output là kết quả THẬT của
    javac/java JDK 21. */
export default {
  day: 91,
  card: 'java-day-91',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-scalable-non-blocking-chat-server-with-java-nio',
    title: 'Máy chủ chat không chặn với Java NIO (nền cho realtime)',
  },

  content: `🔔 100 NGÀY JAVA — NGÀY 91: REALTIME VỚI WEBSOCKET

Ngày 90, việc chạy nền xong rồi — nhưng người dùng biết bằng cách nào? Tác giả đang mở trang web, có bình luận mới; hiện tại họ phải bấm **F5** mới thấy.

Chẳng lẽ bắt trình duyệt hỏi máy chủ "có gì mới không?" mỗi vài giây? Tốn và chậm. Hôm nay ta cho máy chủ **chủ động đẩy** tin xuống — realtime.

━━━━━━━━━━━━━━━━━━━━

🔌 VẤN ĐỀ CỦA HTTP: MỘT CHIỀU

HTTP suốt 90 ngày qua luôn theo một khuôn: **client hỏi, server đáp, rồi đóng**. Server không tự nói chuyện với client được — nó chỉ trả lời khi được hỏi.

Vậy làm sao báo "có bình luận mới"? Hai cách cũ, đều dở:
- **Polling** — client hỏi lại mỗi vài giây "có gì mới không?".
- **Long polling** — client hỏi, server giữ kết nối tới khi có tin mới.

Polling lãng phí kinh khủng:

\`\`\`
4) POLLING hoi 10 lan, 1 lan co du lieu -> 9 request PHI
\`\`\`

Mười lần hỏi, chín lần trả về "không có gì" — chín request phí băng thông, phí CPU cả hai đầu, mà tin mới vẫn trễ tới vài giây (khoảng cách giữa hai lần hỏi).

━━━━━━━━━━━━━━━━━━━━

🔌 WEBSOCKET: KÊNH HAI CHIỀU LUÔN MỞ

WebSocket phá vỡ khuôn hỏi-đáp. Nó bắt tay **một lần** (nâng cấp từ một request HTTP), rồi giữ một kết nối **mở suốt**, cho phép cả hai đầu gửi tin bất cứ lúc nào:

\`\`\`
client  <==== kết nối mở sẵn ====>  server
\`\`\`

\`\`\`
5) WEBSOCKET: server day khi CO su kien -> 0 request phi, do tre ~tuc thi
6) 2 chieu: cung 1 ket noi mo san, client gui len va nhan ve deu duoc
\`\`\`

Không còn hỏi vô ích: server chỉ truyền khi **thật sự** có sự kiện, và tin tới gần như tức thì. Cùng một kết nối, client vừa nhận vừa gửi được — hợp cho chat, thông báo, bảng số liệu sống, chơi game.

━━━━━━━━━━━━━━━━━━━━

📮 PUB/SUB: TRÁI TIM CỦA REALTIME

Nhưng một máy chủ phục vụ hàng nghìn kết nối cùng lúc. Khi có bình luận mới ở bài số 1, đẩy cho **đúng** những ai đang xem bài đó — không phải tất cả. Cơ chế: **pub/sub** (xuất bản / đăng ký) theo **topic**.

\`\`\`
1) 3 client dang ky topic '/topic/bai-1/binh-luan'
2) publish 1 su kien -> day toi 3 client (server chu dong day)
3) 'dung' o topic khac -> nhan 0 tin
\`\`\`

Ba người đang xem bài 1 **đăng ký** (subscribe) topic của bài đó. Khi có bình luận mới, server **xuất bản** (publish) một tin vào topic → cả ba nhận ngay. Người đang xem bài 2 (topic khác) không nhận gì. Một sự kiện tới đúng người cần, không phiền người khác.

Đây chính là mô hình bạn đã thấy ở Ngày 88 (Redis pub/sub) và là cách mọi hệ realtime hoạt động bên trong.

━━━━━━━━━━━━━━━━━━━━

🌱 TRONG SPRING: STOMP TRÊN WEBSOCKET

Spring cho một tầng gọn trên WebSocket tên **STOMP** — thêm khái niệm topic/subscribe sẵn:

\`\`\`java
@Configuration
@EnableWebSocketMessageBroker
public class CauHinhWs implements WebSocketMessageBrokerConfigurer {
    public void configureMessageBroker(MessageBrokerRegistry r) {
        r.enableSimpleBroker("/topic");           // nơi server đẩy ra
        r.setApplicationDestinationPrefixes("/app"); // nơi client gửi vào
    }
    public void registerStompEndpoints(StompEndpointRegistry r) {
        r.addEndpoint("/ws").withSockJS();         // điểm bắt tay
    }
}
\`\`\`

Khi có bình luận mới, service đẩy ra topic — mọi người đăng ký nhận ngay:

\`\`\`java
@Autowired SimpMessagingTemplate ws;

public void themBinhLuan(String slug, BinhLuan bl) {
    khoBinhLuan.save(bl);
    ws.convertAndSend("/topic/bai/" + slug + "/binh-luan", bl);  // đẩy realtime
}
\`\`\`

Client (trình duyệt) đăng ký topic đó và cập nhật giao diện ngay khi có tin — không F5.

━━━━━━━━━━━━━━━━━━━━

⚠️ VÀI ĐIỀU THỰC TẾ

- **Xác thực vẫn cần.** Kết nối WebSocket cũng phải kiểm token (Ngày 78) lúc bắt tay — đừng để ai cũng nghe được mọi topic.
- **Nhiều máy chủ = cần broker chung.** Nếu bạn có 3 máy chủ, người dùng A nối máy 1, người B nối máy 2; bình luận tới máy 1 phải lan sang máy 2. Cần một **message broker** thật (RabbitMQ, Redis pub/sub, Kafka) làm trung gian — \`enableSimpleBroker\` chỉ chạy trong một tiến trình.
- **Kết nối là tài nguyên.** Hàng nghìn kết nối mở tốn bộ nhớ; dọn kết nối chết, đặt giới hạn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Cấu hình WebSocket + STOMP trong Spring, endpoint \`/ws\`.
2. Client đăng ký \`/topic/bai/{slug}/binh-luan\`, in tin nhận được.
3. Khi thêm bình luận, \`convertAndSend\` ra topic — xác nhận client cập nhật không F5.
4. Mở hai tab trình duyệt cùng topic, bình luận ở tab này thấy ngay ở tab kia.
5. So băng thông giữa polling mỗi 3 giây và WebSocket khi ngồi yên không có tin mới.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Realtime giải bài toán "server muốn nói mà HTTP chỉ cho client hỏi". WebSocket mở một kênh **hai chiều luôn mở**, và **pub/sub theo topic** đẩy mỗi sự kiện tới đúng người đăng ký — thay cho polling hỏi liên tục mà phần lớn trả về rỗng. Trong Spring dùng STOMP trên WebSocket; nhiều máy chủ thì cần một message broker chung.

Blog của bạn giờ khá hoàn chỉnh: bài, ảnh, bình luận, thẻ, tìm kiếm, cache, việc nền, realtime. Nhưng có một người dùng quan trọng bạn chưa phục vụ: **lập trình viên khác** muốn dùng API của bạn. Họ cần biết có những endpoint nào, nhận tham số gì, trả về gì — mà không phải đọc hết mã nguồn hay nhắn tin hỏi bạn từng cái.

Ngày 92: **Tài liệu API với OpenAPI/Swagger** — tự sinh một trang tài liệu tương tác từ chính code của bạn (không viết tay, không lệch với thực tế), để người khác thử API ngay trên trình duyệt. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
