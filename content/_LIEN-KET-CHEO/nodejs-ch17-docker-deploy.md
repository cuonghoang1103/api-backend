# Liên kết chéo Node.js Chương 17 (Docker và triển khai) ↔ Docker · Deploy lên VPS

Đợt 12 video Node.js, 08/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `docker`, `deploy-vps`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Học sâu hơn ở …"; thẻ ở bài kia nói "Áp vào Node.js — bài 17.x".
Lời video (`src/bai/node-17-*/kichban.ts`) nhắc cùng các bài và ghi trong `LIEN_KET` (thêm: Docker 1.2/1.3/2.5/3.2/3.4/4.1/5.1/5.4/6.2/6.4/7.4,
Deploy lên VPS 3.1/3.2/4.2/4.4/4.5/5.2/6.4/7.1/7.4/8.5/11.1/11.3/13.4/14.2, Nginx 3.1/9.5 — chưa gắn thẻ hai chiều; các tệp nginx đang có thay đổi chưa commit của phiên khác).
Số đo chạy trong Docker Desktop 29.8.0 (linux/arm64), app mẫu Express 5.3.0 + pg 8.23.1 + zod 4.6.7, mọi bí mật GIẢ, trung vị 5 lần cho phép đo thời gian.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-17-1-anh-docker` | `dk-6-1-multi-stage` | build ở giai đoạn bị vứt đi | naive 430 · slim 84,3 · alpine 65,5 · multi 81,7 MB; 121 gói + ~/.npm 19 MB trong ảnh naive; bcrypt Mach-O ⇒ invalid ELF header |
| `nodejs-17-2-cache-tang` | `dk-5-2-thu-tu` | thứ tự theo tần suất đổi | build lại 4,36 / 0,47 / 1,34 s (9,3×); context 66,16 MB → 465 B; ARG đầu tệp 6,53 vs 1,79 s; amd64 giả lập 12,5× |
| `nodejs-17-3-pid-1-tat-em` | `dk-4-3-cmd-entrypoint` | dạng exec, exec trong script | npm start exit 1 / shell 137 / exec 0; ân hạn mặc định 3,14 s (Docker Desktop 29.8.0); request 5 s mất 0/3; zombie 12 → 0 với --init; unhealthy không bị restart |
| `nodejs-17-4-bi-mat-cau-hinh` | `dk-4-4-arg-env` | ARG không dành cho bí mật | token trong history (2 lần), mật khẩu trong Config.Env, .env đọc lại từ tầng bị "xoá"; secret mount 0/0; env lúc chạy: ảnh 0, container 1 |
| `nodejs-17-5-deploy-khong-gian-doan` | `deploy-3-3-xanh-lam` | proxy giữ cổng, khoẻ rồi mới đổi | 16/301 · 35/291 · 0 (502 ở 2/5 lần khi bỏ blue ngay) · 0 ở 5/5 lần khi chờ 1 s |
| `nodejs-17-6-deploy-hong-quay-lui` | `deploy-6-1-lui-chay-duoc` | quay lui bằng ảnh có tên | build cũ: 200 / 401 / 404; smoke test exit 1; quay lui ảnh 0,82 s vs build lại 5,05 s; set -e + tee vẫn tráo |

Sửa bài web cùng đợt (s17, EN + VI): 17.2 ảnh KHÔNG còn build trên VPS (deploy-nha.sh từ 18/08/2026: máy nhà build song song, VPS chỉ kéo + tráo; deploy.sh là đường lùi tuần tự) ·
17.3 thêm số đo lại ân hạn mặc định (3,14 s Docker Desktop 29.8.0; tài liệu 10 s) · 17.3 Docker trơn KHÔNG khởi động lại container unhealthy (đo: restart count 0) — chỉ Swarm/Kubernetes/autoheal ·
17.3 website: tini + `exec "$@"`, backend vẫn chưa có stop_grace_period trong khi app tự chờ 30 s, healthcheck gọi /health có SELECT 1 · 17.4 env lúc chạy qua ENV_FILE của deploy-nha.sh ·
17.5 website tráo bằng `up -d --no-build`, nạp lại nginx ngay (sự cố 11/09/2026: tráo IP, 502 15 phút) · 17.6 smoke test 78 route, chạy bởi deploy-nha.sh, + kiểm từ ngoài sau 11/09.
