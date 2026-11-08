# Liên kết chéo Node.js Chương 15 (Log và quan sát hệ thống) ↔ Observability & Monitoring

Đợt 11 video Node.js, 08/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `observability-monitoring`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Học sâu hơn ở Observability …"; thẻ ở bài kia nói "Áp vào Node.js — bài 15.x".
Lời video (`src/bai/node-15-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Số đo của Node chạy trong môi trường sạch (`scratchpad/node/chay-c15.mjs`, biến môi trường GIẢ), Node 22.23.3 · pino 10.4.0 · pino-http 11.0.0 · prom-client 15.1.3 ·
@opentelemetry/sdk-node 0.301.0 · pg 8.23.1 · PostgreSQL 17.11 trong Docker (`node15-pg`, đã gỡ). Trung vị 5 lần cho mọi phép đo thời gian.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-15-1-log-co-cau-truc` | `obs-1-1-tu-console-toi-json` | log có cấu trúc, máy đọc được | 100.000 dòng: console.log 417,3 ms vs pino 172,8 ms; pino sync 526,8 ms; giá mỗi request −8 % … −36 %; dòng pino-http 486 B chứa token |
| `nodejs-15-1-log-co-cau-truc` | `obs-1-5-stdout-la-mot-cai-ong` | stdout là ống, ống đầy được | file: đứng loop 371 ms; pipe nghẽn: 10,3 MB xếp hàng trong RAM (macOS + node:22-alpine) |
| `nodejs-15-2-request-id` | `obs-3-2-asynclocalstorage` | ngữ cảnh qua await, giá của ALS | 3 request / 18 dòng; biến toàn cục 6/18 dòng sai (có trọng tài); ALS −4…−6 % (nhiễu); 6 cách sinh mã |
| `nodejs-15-3-chi-phi-va-tim-kiem` | `obs-2-2-xoay-vong` | xoay vòng chống đầy đĩa | container thật max-size 1m × 2: còn 12.492/100.000 dòng; 4 hình dạng dòng/ngày; grep 1,66 s vs jq 3,06 s; lấy mẫu 1,00 % |
| `nodejs-15-4-metrics-prometheus` | `obs-4-4-luc-luong-nhan` | nhãn vô hạn phá metric | 300 request: 100 vs 4.268 chuỗi, 9.807 vs 390.366 B; 100.000 user: 1.494 MB, 109,52 MB, 1.473 ms/lần lấy |
| `nodejs-15-5-opentelemetry-trace` | `obs-6-2-otel-trong-node` | OpenTelemetry tự gắn đo đạc | 33 span / 12 pg.query; pool lạnh 24,47 vs 0,13 ms; bẫy 3.x: spanProcessor số ít / exporter vị trí ⇒ 0 span |
| `nodejs-15-5-opentelemetry-trace` | `obs-6-3-lay-mau` | lấy mẫu không giảm CPU | −17,6 % req/s, +80 MB; sampler 0,01: 73× ít span, +3,4 % req/s, RAM không đổi |
| `nodejs-15-6-health-check-canh-bao` | `obs-8-2-tu-ban-vao-chan` | liveness không chạm phụ thuộc | DB treo: 503 sau 809 ms có timeout, không trả lời trong 5 s nếu thiếu; cache readiness phải > khoảng cách thăm dò |
| `nodejs-15-6-health-check-canh-bao` | `obs-9-1-loi-hua-danh-thuc` | cảnh báo là lời hứa | bốn luật, năm cảnh báo đáng có, sự cố đầy đĩa của dự án |

**Sửa bài web cùng đợt (EN + VI, `s15-observability.mjs`):** 15.1 morgan `skip` chỉ loại `/health` + `/api/v1/system/health` (live/ready vẫn được ghi) ·
15.4 + 15.5 tag route Sentry của website gắn TRƯỚC định tuyến ⇒ rơi về URL thô (bản sao: `/v1/courses/42`, đọc khi finish mới ra `/api/v1/courses/:id`) ·
15.5 mã bật SDK theo bộ gói 3.x (`@opentelemetry/sdk-trace`, `spanProcessors: [new BatchSpanProcessor({ exporter })]`) + callout bẫy phiên bản (số ít / vị trí ⇒ 0 span, sdk-trace-base@2 ⇒ ERESOLVE) ·
15.6 JSON thật của `/api/v1/system/health` (`{"success":true,"data":{"status":"ok",…}}`) · cache readiness phải lâu hơn khoảng cách giữa hai lượt thăm dò (~3,3 s ⇒ 10 s: 1,8 → 0,6 truy vấn/s).
**Việc cho phiên được sửa `src/` (KHÔNG làm ở đợt này):** `src/services/sentry.service.ts` `sentryRequestMiddleware` đọc `req.route` trước định tuyến ⇒ tag `route` là URL thô;
healthcheck container (`docker-compose.yml`) gọi `/health` chi tiết có truy vấn DB không timeout riêng.
**Chỉ nhắc trong lời video, CHƯA đặt thẻ web:** Observability 0.2, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4, 2.5, 3.1, 3.3, 3.4, 4.1, 4.2, 4.3, 4.5, 5.1, 5.2, 6.1, 6.4, 6.5, 8.1, 8.4, 8.5, 9.4, 11.3; Node 1.4, 2.4, 4.3, 7.1, 7.4, 8.2, 9.1.
