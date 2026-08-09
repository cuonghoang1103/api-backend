/** "100 Ngày Java với CuongThai" — Ngày 93: Giám sát & sức khỏe (Actuator).
    Nối đúng chỗ Ngày 92 kết ("chạy trên máy chủ thật: nó có KHOẺ không? CSDL
    còn nối được? bao nhiêu lỗi? không nhìn thấy = vận hành trong bóng tối").
    Ngày 94 (đóng gói Docker) trỏ ngược về phần kết.

    ⚠ LUẬT 6: health aggregation + metrics dựng bằng JDK thuần, tất định; thân
    bài dạy Actuator thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 93,
  card: 'java-day-93',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-secure-transaction-logger-with-observability',
    title: 'Nhật ký giao dịch có khả năng quan sát (observability)',
  },

  content: `🩺 100 NGÀY JAVA — NGÀY 93: GIÁM SÁT & SỨC KHỎE

Blog của bạn chạy ngon và có tài liệu. Nhưng khi nó chạy trên máy chủ thật, phục vụ người dùng thật, bạn cần biết: nó có **khoẻ** không? CSDL còn kết nối được không? Bộ nhớ sắp đầy chưa? Đã xử lý bao nhiêu request, bao nhiêu lỗi?

Không nhìn thấy những con số đó thì bạn vận hành **trong bóng tối** — chỉ biết hệ thống hỏng khi người dùng phàn nàn. Mà lúc đó thì đã muộn.

━━━━━━━━━━━━━━━━━━━━

🩺 HEALTH CHECK: HỆ THỐNG CÒN SỐNG KHÔNG?

Ý tưởng đầu tiên: một endpoint để hệ thống **tự kiểm** và trả lời "tôi ổn" hay "tôi hỏng". Nhưng "ổn" gồm nhiều phần — ứng dụng chạy chưa đủ, còn phải CSDL nối được, đĩa chưa đầy, Redis còn sống. Mỗi phần là một **bộ kiểm** (health indicator), và tổng thể chỉ UP khi **tất cả** UP:

\`\`\`
1) health db/disk/redis UP -> tong the UP -> /health 200
2) redis DOWN -> tong the DOWN, thanh phan hong: [redis]
\`\`\`

Điểm hay: khi hỏng, nó không chỉ nói "DOWN" mà chỉ rõ **cái nào** hỏng — \`redis\`. Bạn biết ngay chỗ cần sửa thay vì mò mẫm.

━━━━━━━━━━━━━━━━━━━━

🚦 /health: MÃ HTTP CHO MÁY ĐỌC

Health check không phải để người đọc, mà để **máy khác** đọc và tự hành động:

\`\`\`
3) /health: UP -> 200, DOWN -> 503 (may giam sat tu phat hien)
\`\`\`

- **Load balancer** (bộ cân bằng tải) gọi \`/health\` liên tục; máy nào trả \`503\` thì nó tự ngắt khỏi luồng, không đẩy người dùng vào máy hỏng.
- **Kubernetes** dùng nó làm *liveness/readiness probe*: pod trả DOWN thì tự khởi động lại.
- **Hệ thống cảnh báo** thấy DOWN thì nhắn cho bạn lúc 3 giờ sáng — trước khi người dùng thức dậy và phàn nàn.

Đây là lý do health check là endpoint đầu tiên mọi hệ thống production cần. (\`deploy.sh\` của nhiều dự án cũng gọi các route để smoke-test sau khi triển khai — chính là ý này.)

━━━━━━━━━━━━━━━━━━━━

📊 METRICS: SỐ LIỆU VẬN HÀNH

Health trả lời "sống hay chết". Nhưng bạn cần nhiều hơn: *xu hướng*. Đang xử lý bao nhiêu request/giây? Tỉ lệ lỗi bao nhiêu? Độ trễ thế nào? Bộ nhớ tăng dần (rò rỉ) không?

\`\`\`
4) metrics: 100 request, 3 loi -> ty le loi 3.0%
5) metrics con: bo nho, so luong luong, do tre P95, so lan GC (Ngay 52)
\`\`\`

Những con số đáng theo dõi:
- **Tỉ lệ lỗi** — 3% lỗi là dấu hiệu có gì đó sai, dù chưa sập hẳn.
- **Độ trễ P95/P99** — 95% request nhanh hơn bao lâu (đo đuôi chậm, không phải trung bình — Ngày 59).
- **Bộ nhớ & GC** (Ngày 52) — bộ nhớ tăng đều mà không tụt là rò rỉ.
- **Số luồng, kết nối CSDL** — cạn kết nối là một sự cố kinh điển (Ngày 63).

━━━━━━━━━━━━━━━━━━━━

🌱 TRONG SPRING: ACTUATOR

Lại một starter:

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
\`\`\`

Và bạn có sẵn:
- **\`/actuator/health\`** — tổng hợp sức khoẻ (tự có bộ kiểm cho CSDL, đĩa, Redis... nếu bạn dùng chúng).
- **\`/actuator/metrics\`** — hàng loạt số liệu (request, JVM, GC, hệ thống).
- **\`/actuator/info\`**, **\`/actuator/loggers\`** (đổi mức log lúc chạy, Ngày 58), và nhiều nữa.

Tự viết bộ kiểm riêng cũng dễ:

\`\`\`java
@Component
public class KiemR2 implements HealthIndicator {
    public Health health() {
        return r2Client.pingDuoc() ? Health.up().build()
                                   : Health.down().withDetail("r2", "khong ket noi").build();
    }
}
\`\`\`

Nối \`/actuator/prometheus\` vào **Prometheus + Grafana** là bạn có biểu đồ sống và cảnh báo tự động — thấy độ trễ tăng, tỉ lệ lỗi vọt lên *trước* khi thành sự cố.

━━━━━━━━━━━━━━━━━━━━

⚠️ CHE CÁC ENDPOINT NHẠY CẢM

Actuator phơi ra nhiều thông tin nội bộ (cấu hình, biến môi trường, số liệu). \`/health\` cơ bản thì công khai được, nhưng \`/actuator/env\`, \`/actuator/heapdump\`... phải **giấu sau xác thực** (Ngày 79) hoặc chỉ mở trên mạng nội bộ. Mặc định Spring chỉ phơi \`/health\` và \`/info\`; bật thêm cái gì thì cân nhắc bảo mật cái đó.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm actuator, mở \`/actuator/health\` — xem tổng hợp UP.
2. Tắt CSDL, gọi lại \`/health\` — xác nhận DOWN và chỉ rõ thành phần.
3. Viết một \`HealthIndicator\` riêng cho một dịch vụ ngoài.
4. Xem \`/actuator/metrics/http.server.requests\` — đếm request và độ trễ.
5. Chỉ phơi \`/health\`, \`/info\` ra ngoài; giấu phần còn lại sau xác thực.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Đừng vận hành trong bóng tối. **Health check** (\`/health\`) tổng hợp trạng thái từ nhiều bộ kiểm, trả \`200\`/\`503\` cho load balancer và hệ giám sát tự hành động. **Metrics** phơi ra số liệu vận hành (request, tỉ lệ lỗi, độ trễ P95, bộ nhớ, GC) để bạn thấy xu hướng và đặt cảnh báo. Spring Actuator cho tất cả bằng một starter; nhớ che các endpoint nhạy cảm. Mục tiêu: thấy vấn đề **trước** khi người dùng thấy.

Đến đây blog của bạn hoàn chỉnh về tính năng lẫn vận hành. Nhưng nó vẫn chỉ chạy được **trên máy bạn** — với đúng phiên bản Java bạn cài, đúng biến môi trường bạn đặt. Đưa cho đồng nghiệp hay lên máy chủ, câu kinh điển lại vang lên: *"máy tôi chạy được mà"* (nhớ Ngày 57). Java nói "viết một lần, chạy mọi nơi" — nhưng vẫn cần đúng JVM và đúng cấu hình ở nơi chạy.

Ngày 94: **Đóng gói bằng Docker** — gói ứng dụng cùng *mọi thứ nó cần* (JVM, thư viện, cấu hình) vào một "container" chạy y hệt nhau ở mọi máy; Dockerfile, image, và vì sao nó chấm dứt vĩnh viễn câu "máy tôi chạy được". Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
