# Liên kết chéo Node.js Chương 11 (realtime WebSocket & Socket.IO) ↔ Socket.IO ↔ API Design

Đợt 9 video Node.js, 01/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `socket-io`, `api-design`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Học sâu hơn ở …" / "Cùng luồng ở …"; thẻ ở bài kia nói "Áp vào Node.js — bài 11.x".
Mọi bài đích viết tay (không có header FILE SINH TỰ ĐỘNG). Lời video (`src/bai/node-11-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Số đo của Node chạy trong môi trường sạch (`scratchpad/node/chay-c11.mjs`, khoá JWT GIẢ), Node 22.23.3 · ws 8.22.1 · socket.io 4.8.4 · @socket.io/redis-adapter 8.3.0 ·
Redis 7.4.9 + nginx 1.27.5 trong Docker (container `node11-*`, đã gỡ). KHÔNG đo lại thứ API Design 10.4 đã đo (độ trễ polling/SSE/WS, Last-Event-ID, Redis Stream 0 → 10/10) — chỉ dẫn sang.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-11-1-websocket-co-ban` | `api-design/api-10-3-realtime` | bốn hợp đồng realtime, chọn cái yếu nhất | byte: 839 B/lần hỏi rỗng (cookie 213 B), 2.089 B cho 20 tin qua socket, 10.000 tab × 1 giờ = 12 triệu request / 10,07 GB; bắt tay + khung có mặt nạ từng byte; nginx thiếu Upgrade ⇒ 200/400 |
| `nodejs-11-1-websocket-co-ban` | `socket-io/io-2-1-overhead` | ở lớp Socket.IO hai transport chở cùng payload, giá ở lớp dưới | đếm lớp dưới ở socket TCP: 839 B vs 71 B; ping + pong 10 B (chưa tính header TCP/IP) |
| `nodejs-11-2-ws-vs-socketio-rooms` | `socket-io/io-3-4-broadcast` | io.to gồm người gửi, socket.to bỏ người gửi | đo binh thấy mình gõ; io.emit 12,40 ms đánh thức 2.000 vs room 0,26 ms / 12; giới hạn 500 room theo LẦN GỌI ⇒ 100.000 room +58,6 MB; io.to(A).to(B) là HỢP (đã sửa Socket.IO 3.1/3.4/quiz/đề cuối) |
| `nodejs-11-3-xac-thuc-phan-quyen-socket` | `socket-io/io-1-3-reconnect` | sid mới, room rỗng, tin mất | cách sửa rejoin + GET ?since 5/5; connectionStateRecovery 5/5 cùng id, 0/5 sau khởi động lại, recovered = false sau redis-adapter |
| `nodejs-11-3-xac-thuc-phan-quyen-socket` | `socket-io/io-2-2-ping` | 25.000 + 60.000 ⇒ tới 85 s | hố đen TCP: 3.003 / 2.000 ms (1 s + 2 s), 45.003 ms mặc định, 85.003 ms website; đóng tab 1 ms |
| `nodejs-11-4-scale-adapter-backpressure` | `socket-io/io-5-1-vi-sao` | không adapter ⇒ phát tới 1/N, im lặng; website gắn kiểu best-effort | hai tiến trình: emit 0,34 ms không ai nhận ⇒ adapter 2,23 ms; một kết nối pub+sub bị từ chối (ioredis + node-redis 4) |
| `nodejs-11-4-scale-adapter-backpressure` | `socket-io/io-2-3-sticky` | polling nhiều request một phiên ⇒ 400 Session ID unknown | LB luân phiên tự viết: polling hỏng, client ép websocket chạy, polling + sticky chạy; câu trả lời 400 thật của B |
| `nodejs-11-4-scale-adapter-backpressure` | `api-design/api-10-3-realtime` | hai instance, sự kiện trong RAM ⇒ 0/10; Redis Stream 10/10 | cùng bài toán với Socket.IO + Redis Pub/Sub (không lưu sự kiện) |

**Sửa bài web cùng đợt (EN + VI):** Node 11.1 (proxy thiếu Upgrade: 200/400 chứ không chỉ 400; ws.send(object) ném TypeError, WebSocket chuẩn mới gửi "[object Object]") ·
Node 11.2 (giới hạn post:subscribe theo lần gọi) · Node 11.3 (tokenBatTay đọc handshake.auth trước; thời gian phát hiện 2.000–3.003 ms; connectionStateRecovery) ·
Node 11.4 (client node-redis, không phải ioredis) · Socket.IO 3.1/3.4 + quiz Ch3 + đề cuối Ch11: `io.to(A).to(B)` là phép HỢP, không phải giao (đo: that/c11/to-chain).
**Chỉ nhắc trong lời video, CHƯA đặt thẻ web:** Socket.IO 0.1, 0.2, 0.3, 1.4, 1.5, 3.1, 4.2, 5.3, 5.4, 6.1, 9.2; Node 2.4, 3.3, 3.5, 8.2, 9.4; Authentication 4.5; API Design 10.1.
