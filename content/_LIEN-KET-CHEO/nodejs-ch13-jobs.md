# Liên kết chéo Node.js Chương 13 (Tác vụ nền & hàng đợi) ↔ API Design ↔ Redis

Đợt 10 video Node.js, 08/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `api-design`, `redis`).
Khối `<a class="link-card lien-ket-cheo">` trước mục 🧪 Thực hành (nếu có) hoặc cuối `ml-en` / `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Học sâu hơn ở …" / "Cơ chế bên dưới …" / "Áp vào …";
thẻ ở bài kia nói "Áp vào Node.js — bài 13.x". Lời video (`src/bai/node-13-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Số đo của Node chạy trong môi trường sạch (`scratchpad/node/chay-c13.mjs`, biến môi trường GIẢ), Node 22.23.3 · BullMQ 6.7.2 · ioredis 6.0.0 · Express 5.3.0 · pg 8.23.1 ·
Redis 7.4.9 + PostgreSQL 17 trong Docker (container `node13-*`, đã gỡ). Không đo lại thứ API Design đã đo (10.2: sáu lượt xuất, 1 vs 3 worker, POST ~60 ms; 12.5: outbox + BullMQ) — chỉ dẫn sang.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-13-1-vi-sao-hang-doi` | `api-design/api-10-1-hang-doi` | 202 Accepted + tài nguyên job + hỏi lại | p95 308,7 → 11,7 ms; SMTP 5 kết nối: 5/100 vs 100/100; add() trước COMMIT ⇒ NOT FOUND; GET /jobs/:id active → completed 922 ms |
| `nodejs-13-2-bullmq-co-ban` | `redis/rd-8-3-consumer-group` | mỗi việc tới đúng một worker | job = hash + id trong list + stream (216 B); addBulk 17,8×; concurrency I/O 86×, CPU 0×; 2 worker 50 + 50 trùng 0; allkeys-lru mất 18.118/20.000 |
| `nodejs-13-3-thu-lai-va-idempotent` | `redis/rd-8-4-xclaim` | thử lại, thư chết, chạy lại tập hỏng | backoff 204/415/811/1.604 ms; trừ 3 lần 300.000 VND; ba cách idempotent đo thật; jobId 5 → 1, xoá xong ⇒ hoá đơn 2 |
| `nodejs-13-4-lich-trinh` | `redis/rd-4-3-zset` | job hẹn giờ = phần tử zset theo giờ chạy | trễ TB 47,9 ms (bận 911 ms); OTP #1/11; limiter 10·10·10 cả 3 tiến trình; scheduler 5 lần vs setInterval 12 |
| `nodejs-13-5-worker-chet-va-van-hanh` | `api-design/api-12-7-trien-khai` | tắt êm khi SIGTERM, stop grace period | SIGKILL cứu sau 2.068 ms (mặc định 60.070 ms); job chặn chạy 2 lần rồi hỏng; SIGTERM 903 vs 2 ms; Redis sập ⇒ add() TREO |

Một chiều thêm (chiều kia đã có từ trước): Node 13.3 → API Design 10.5 (`api-10-4-webhook`, đã có 10.5 → 13.3) · Node 13.5 → API Design 10.2 (`api-10-1-worker`, đã có 10.2 → 13.5).
Có sẵn từ trước (không thêm lại): Node 13.1 ↔ API Design 12.5 (`api-12-3-mo-rong`).
**Sửa bài web cùng đợt (EN + VI, `s13-jobs.mjs`):** 13.2 trọng lượng BullMQ đo lại (6.7.2: 19 gói, 16 MB; file website ghi "50MB") + đo thật allkeys-lru làm mất job, Redis của website là allkeys-lru ·
13.3 website đánh dấu JOB trong RAM (pending|processing|completed|failed), thử lại ngay không backoff — không phải "đánh dấu tài liệu" · 13.4 website có 40 lời gọi `cron.schedule()` (không phải 11) ·
13.5 "rồi sẽ" = lockDuration + stalledInterval (mặc định đo 60.070 ms, không phải 30 s; cả câu trắc nghiệm) · 13.5 Redis sập: `queue.add()` TREO (đo 15 s, kể cả `enableOfflineQueue: false`), không ném lỗi ⇒ bọc timeout ·
13.5 `recoverPendingJobs()` là hàm giữ chỗ (chưa có cột `embeddingStatus`) · 13.1 ghi rõ biện pháp trong chú thích website mới là kế hoạch.
**Chỉ nhắc trong lời video, CHƯA đặt thẻ web:** Node 2.4, 2.5, 5.5, 6.5, 7.3, 8.3, 11.1, 12.1–12.6; API Design 10.3; Redis 8.3 (ở 13.2), Code Lab Payment Integration.
