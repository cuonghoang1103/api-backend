# Liên kết chéo Node.js Chương 16 (Hiệu năng) ↔ Observability & Monitoring

Đợt 11 video Node.js, 08/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `observability-monitoring`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Học sâu hơn ở Observability …"; thẻ ở bài kia nói "Áp vào Node.js — bài 16.x".
Lời video (`src/bai/node-16-*/kichban.ts`) nhắc cùng các bài và ghi trong `LIEN_KET`; video còn trỏ sang khoá `performance-load-testing`
(1.1, 1.2, 1.3, 1.5, 2.4, 5.3, 6.2, 6.3, 6.5, 6.6, 8.3, 10.1, 10.2, 12.2, 12.5) — khoá đó mới là KHUNG (bài "Đang soạn"), nên CHƯA gắn thẻ hai chiều; gắn khi soạn.
Số đo chạy trong môi trường sạch (`scratchpad/node/chay-c15.mjs`, biến môi trường GIẢ), Node 22.23.3 · Express 5.3.0 · pg 8.23.1 · PostgreSQL 17.11 (Docker `node15-pg`,
500.000 ghi chú, đã gỡ) · autocannon 9.0.0 · fast-json-stringify 7.3.2 · compression 1.8.2. Trung vị 5 lần cho mọi phép đo thời gian.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-16-1-do-truoc-khi-doan` | `obs-4-2-trung-binh-noi-doi` | báo phân vị, không báo trung bình | 276 → 641 → 1.206 → 3.395 req/s; p97,5 138 → 10 ms; profile: renderNote 21,7 %, crypto 20,5 %, regex 3,2 % |
| `nodejs-16-2-nut-that-that-su` | `obs-5-4-be-va-handle` | chờ tài nguyên ≠ làm việc | DB 97,2 % (Linux); EXPLAIN 0,039 vs app 4,616 ms; pool 1 chờ 14,065 ms; đỉnh ở pool 5 (1.707 req/s), 25/50 tụt 1.373 |
| `nodejs-16-4-cluster-mo-rong` | `obs-5-1-tre-vong-lap` | biết mình bị giới hạn bởi CPU hay chờ | /cpu 11.812 → 40.278 (8 worker, 3,4×), 10 worker tụt 36.299; /io +6,7 %; website 40 cron.schedule |
| `nodejs-16-5-ro-ri-bo-nho` | `obs-5-2-bo-nho` | RSS ≠ heap | Buffer: RSS 282 MB heap 4 MB; container 128m ⇒ exit 137 câm; heap 64 MB ⇒ FATAL exit 134; Node 22: 512m ⇒ heap 259 MB |
| `nodejs-16-5-ro-ri-bo-nho` | `obs-5-3-thu-gom-rac` | dừng do runtime | snapshot 6,2 MB / 93 ms, 56,4 MB / 1.027 ms; +50.001 Object; chuỗi giữ ⇒ biến module `cache` |
| `nodejs-16-6-toi-uu-vo-ich` | `obs-6-4-doc-bieu-do-thac` | tỉ lệ từng phần trước khi tối ưu | fast-json-stringify 0,96× (340 KB) / 1,85× (nhỏ) / 1,35× (route 16.2, 2,2 %, trần 0,6 %) |

Sửa bài web cùng đợt (s16, EN + VI): 16.3 website nén trong NODE (compression level 6 + brotli 4), không phải nginx — curl công khai 1.608.415 ⇒ br 183.673 B ·
16.3 brotli 11 "to hơn" chỉ đúng với dữ liệu lặp · 16.4 cron.service.ts 40 lời gọi (không phải 11) · 16.5 "LRU" là FIFO có trần · 16.5 Node 22 đọc giới hạn container;
137 câm là của bộ nhớ NGOÀI heap · 16.6 fast-json-stringify tuỳ dữ liệu, đổi thật trong route.
