# Liên kết chéo Node.js Chương 12 (Redis) ↔ Redis ↔ API Design ↔ Testing

Đợt 9b video Node.js, 01/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `redis`, `api-design`, `testing`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Học sâu hơn ở …" / "Cùng khuôn …"; thẻ ở bài kia nói "Áp vào Node.js — bài 12.x".
Mọi bài đích viết tay (không có header FILE SINH TỰ ĐỘNG). Lời video (`src/bai/node-12-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Số đo của Node chạy trong môi trường sạch (`scratchpad/node/chay-c12.mjs`, biến môi trường GIẢ), Node 22.23.3 · ioredis 5.11.1 · pg 8.23.1 · Redis 7.4.9 + PostgreSQL 17.11 trong Docker
(container `node12-*`, đã gỡ). KHÔNG đo lại thứ API Design đã đo (9.2: 43 → 4.150 req/s, giẫm đạp 50 → 32 → 1; 12.4: token bucket Lua dùng chung, 5 × 201 rồi 429; 12.5: outbox → Stream, email qua hàng đợi) — chỉ dẫn sang, số khớp.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-12-1-redis-co-ban` | `redis/rd-1-4-pipeline` | pipeline bỏ phần chờ, không bỏ việc | PING 0,481 ms / Redis tự làm 0,53 µs; 10.000 SET 4.683,7 → 28,4 ms; lô 1 → 10.000; MGET 510× |
| `nodejs-12-2-cache-aside` | `api-design/api-9-1-server-cache` | cache-aside + single-flight + jitter | 500.000 ghi chú PG 17: 58,34 → 0,41 ms; payload 1,6 MB cache chậm hơn 13 %; trúng 90 % 6,73 ms vs 99 % 0,93 ms |
| `nodejs-12-2-cache-aside` | `redis/rd-6-3-giam-dap` | cú giẫm đạp và cách chữa | 200 request: 200 truy vấn 4.178 ms → single-flight 1 / 69,1 ms → khoá SET NX 1 / 80,6 ms; jitter 1 → 26 giây |
| `nodejs-12-3-cau-truc-du-lieu` | `redis/rd-5-2-ma-hoa-bo-nho` | listpack/intset và ngưỡng | trường 512 → 513: 5.168 → 28.816 B (×5,6); 8 × 125 = 10.368 B; ~50 B/khoá; HLL 14,5 KB vs Set 3,68 MB |
| `nodejs-12-4-nguyen-tu-rate-limit-lock` | `redis/rd-7-5-khoa-phan-tan` | khoá có hạn, token, so-rồi-xoá; khoá không phải bảo đảm | SETNX kẹt mãi; DEL xoá khoá của worker-2; Lua xoá 0; 50 worker: không khoá 2 / khoá 50 / INCR 50 |
| `nodejs-12-4-nguyen-tu-rate-limit-lock` | `testing/tst-4-1-vi-sao` | cuộc đua chỉ lộ khi chạy song song trên hệ thật | GET → kiểm → SET: 500/500 lọt giới hạn 100, bộ đếm = 1; INCR 100/400 |
| `nodejs-12-5-pubsub-streams` | `redis/rd-8-3-consumer-group` | XREADGROUP, pending, đòi lại | A 3 + B 2, B sập ⇒ PENDING 2 ⇒ XAUTOCLAIM ⇒ 0; PUBLISH → 0 mất tin; MAXLEN ~ 1000 còn 40.000 |
| `nodejs-12-5-pubsub-streams` | `api-design/api-12-3-mo-rong` | outbox → Stream, việc chậm lên hàng đợi | cơ chế bên dưới: vì sao Pub/Sub làm mất sự kiện, consumer group không mất job |
| `nodejs-12-6-van-hanh-production` | `redis/rd-2-3-scan-unlink` | SCAN thay KEYS, UNLINK thay DEL | PING người khác: KEYS 231,87 ms vs SCAN 5,31 ms; DEL 207 ms vs UNLINK 0,54 ms; job dọn phiên 80,8 vs 5,2 ms |

Có sẵn từ trước (không thêm lại): Node 12.4 ↔ API Design 12.4 (`api-12-5-chia-se`), Node 12.4 → SDN302 8.2.
**Sửa bài web cùng đợt (EN + VI, `s12-redis.mjs`):** 12.1 "một lệnh chậm làm đông cứng… (bài 12.5)" → 12.6 · 12.3 "93,4 MB (đo ở bài 12.5)" → 12.6 ·
12.5 mẫu `?since=` và vụ mất năm tin là bài **11.3** (không phải 11.4) · 12.3 thêm câu đo lại HLL (used_memory: Set 3,68 MB, HLL 14,5 KB ≈ 254×; 0,04 MB của bài gồm phần phụ lần đo).
**Chỉ nhắc trong lời video, CHƯA đặt thẻ web:** Redis 1.1, 1.5, 2.1, 2.2, 3.3, 3.4, 3.5, 4.3, 4.5, 6.1, 6.2, 6.5, 7.1, 7.3, 8.1, 8.2, 8.4, 8.5, 9.2, 9.3, 10.2, 12.4; Node 3.4, 7.3, 7.5, 8.4, 11.3, 11.4, 13.1; API Design 10.4.
