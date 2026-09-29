# Đề cương 4 chương MỚI — khoá Deploy lên VPS (bổ sung 09/2026)

Đọc `_HOP-DONG.md` trước. Chương mới không có bản cũ ⇒ chạy bộ kiểm với `--moi`.
Khoá cũ (Mục 0 – Ch11) dạy bốn bước deploy bằng rsync/git/ssh trên một máy, tới giám sát–sao lưu–chẩn đoán. Người dùng
muốn "đến chuyên gia… đầy đủ" và chính họ deploy bằng Docker + GHCR + script ⇒ thêm: đưa web ra Internet (tên miền,
HTTPS, CDN), deploy bằng container + registry + CI, nhiều môi trường và vượt khỏi một máy, và một dự án cuối khoá trọn.

Mỗi chương: N.0 slide (DOCUMENT) · 4 bài LESSON (khối VI mỗi bài 12–18k ký tự, EN tương đương; cùng khung bài cũ:
eyebrow/h2/lead/h3…, 4–6 slide nhúng, `.pitfall co-tieu-de` ≥ 1, bảng cờ/chỉ thị, "Chạy thử từng bước", 🧪/🗂/📌,
link-card nguồn chính thức GET được 200) · N.5 quiz 10 câu. Giọng như chương cũ (đọc `s03-trao.mjs`, `s07-script.mjs`:
nói thẳng, ĐO THẬT, "vì sao" trước "làm sao"). File chương: `export default { title, description, lessons }`, title
chương dạng `'Chapter N — …|||Chương N — …'`. Luôn `isFreePreview: true`. Hằng `REF` như chương cũ. Trỏ khoá khác thay
vì dạy lại: `/courses/nginx`, `/courses/docker`, `/courses/github-actions`, `/courses/linux-bash`, `/courses/git`.
Mọi số đo làm trên VPS thí nghiệm (hợp đồng mục 7b) — KHÔNG đụng VPS thật.

## Chương 12 — Từ tên miền tới HTTPS (`s12-ten-mien-https.mjs`, deck `dv-12`)
Title: `Chapter 12 — From a domain name to HTTPS: putting your server on the Internet|||Chương 12 — Từ tên miền tới HTTPS: đưa máy chủ của bạn ra Internet`
- 12.1 `deploy-12-1-ten-mien-dns` — Tên miền và DNS: mua tên miền (registrar vs DNS host), bản ghi A/AAAA/CNAME/TXT/
  CAA, TTL và vì sao đổi IP "chưa ăn", `dig +trace`/`dig @1.1.1.1` (đọc bản ghi công khai thật, vd cuongthai.com/
  example.com — CHỈ đọc), Cloudflare proxy cam vs xám (IP thật bị lộ hay không), DNS trong mạng nội bộ/`/etc/hosts`.
- 12.2 `deploy-12-2-reverse-proxy-tls` — Reverse proxy + HTTPS: vì sao app không nghe thẳng cổng 443, nginx/Caddy đứng
  trước (trỏ `/courses/nginx`, không dạy lại cú pháp), ACME/Let's Encrypt: HTTP-01 vs DNS-01, certbot vs Caddy tự cấp,
  gia hạn tự động + kiểm hạn (`openssl s_client`, `-checkend`), HSTS, chuyển hướng 80→443. Demo bằng **Pebble** (ACME
  thử) hoặc CA cục bộ trong container; KHÔNG gọi Let's Encrypt thật. Kiểm giới hạn/rate limit LE trên trang chính thức.
- 12.3 `deploy-12-3-cong-mo-ra-internet` — Chỉ mở đúng cổng: 22/80/443, `ss -tlnp` nhìn cái gì đang nghe `0.0.0.0`,
  ufw + **Docker vượt mặt ufw** khi `ports: "5432:5432"` (dựng lại thật trong container privileged: cổng DB lộ dù ufw
  chặn) ⇒ bind `127.0.0.1:` hoặc mạng nội bộ compose; quét tự kiểm từ máy khác (`nmap` chỉ vào VPS thí nghiệm của mình).
- 12.4 `deploy-12-4-cdn-tep-tinh` — CDN và tệp tĩnh: header `Cache-Control` cho file có mã băm vs HTML, Cloudflare cache,
  object storage (S3/R2) cho ảnh/video người dùng, **cache immutable ⇒ đổi file phải đổi tên/prefix** (chuyện thật:
  ảnh slide phải lên `v2`), chuyện thật nginx `proxy_hide_header` nuốt header của Next; kiểm bằng `curl -I`.
- 12.5 `deploy-12-5-quiz`.

## Chương 13 — Deploy bằng container, registry và CI (`s13-container-ci.mjs`, deck `dv-13`)
Title: `Chapter 13 — Deploying with containers, a registry and CI|||Chương 13 — Deploy bằng container, registry và CI`
- 13.1 `deploy-13-1-compose-tren-vps` — Compose trên VPS: ảnh ghim tag theo commit (không `latest`), `env_file` nằm
  ngoài ảnh, `healthcheck`, `restart: unless-stopped`, giới hạn RAM, log rotation, volume có tên cho DB,
  `docker compose up -d --no-build <service>`; bind-mount file cấu hình nằm NGOÀI ảnh ⇒ đẩy ảnh không đụng tới nó
  (chuyện thật nginx.conf + inode). Trỏ `/courses/docker` cho Dockerfile/Compose cơ bản.
- 13.2 `deploy-13-2-registry-build-o-may-khac` — Registry + build ở máy khác: VPS nhỏ không nên build (OOM 137, đĩa
  đầy vì cache) ⇒ build ở máy mạnh/CI, đẩy registry (GHCR — chỉ in lệnh; demo thật bằng `registry:2` cục bộ), VPS chỉ
  `pull` + tráo; kiểm ảnh TRƯỚC khi đẩy (chuyện thật Alpine musl + engine Prisma glibc ⇒ 502 bảy phút; chốt `ldd`/
  `node -e require`), `--platform linux/amd64` từ Mac arm64, digest vs tag, dọn ảnh cũ trên VPS có giữ đường lùi.
- 13.3 `deploy-13-3-github-actions-deploy` — GitHub Actions deploy qua SSH: workflow build → push → ssh tráo, secrets
  (khoá SSH riêng cho CI, known_hosts ghim), `concurrency:` và vì sao nó chỉ XẾP HÀNG, `environment` + duyệt tay,
  chuyện thật hai workflow đua nhau khi push ⇒ vì sao dự án bỏ push-to-deploy; workflow viết đầy đủ + `act` nếu chạy
  được, KHÔNG chạy trên GitHub thật (trỏ `/courses/github-actions`).
- 13.4 `deploy-13-4-khong-rot-request-voi-container` — Tráo container không rơi request: `docker compose up -d` dừng bản
  cũ trước khi bản mới sẵn sàng (đo số request rơi thật), healthcheck + `depends_on: condition: service_healthy`, hai
  bản song song sau nginx (upstream đổi màu) rồi drain, nginx cần reload khi IP container đổi (chuyện thật), smoke-test
  sau tráo (401/200 vs 404 = ảnh cũ).
- 13.5 `deploy-13-5-quiz`.

## Chương 14 — Nhiều môi trường và vượt khỏi một máy (`s14-moi-truong-mo-rong.mjs`, deck `dv-14`)
Title: `Chapter 14 — Environments, and growing beyond one server|||Chương 14 — Nhiều môi trường, và vượt khỏi một máy chủ`
- 14.1 `deploy-14-1-staging-preview` — Dev/staging/production: cấu hình khác nhau mà ảnh giống nhau, dữ liệu staging
  (ẩn danh hoá, không chép prod thô), preview theo nhánh/PR, feature flag để tách "deploy" khỏi "phát hành".
- 14.2 `deploy-14-2-hai-may-can-bang-tai` — Hai máy + cân bằng tải: nginx upstream/HAProxy trước 2 VPS thí nghiệm, trạng
  thái phải ra khỏi máy (session → Redis/DB, file upload → object storage), deploy lần lượt từng máy (rolling), canary,
  DB tách riêng/managed; đo thật khi tắt một máy.
- 14.3 `deploy-14-3-paas-vps-kubernetes` — Chọn nền tảng: VPS vs PaaS (Vercel, Render, Fly.io, Railway) vs serverless vs
  Kubernetes — bảng bạn quản gì/họ quản gì, **giá thật tính đến 09/2026 (WebFetch trang giá)**, khi nào đồ án SV nên
  PaaS, khi nào tự VPS; Kubernetes chỉ giới thiệu + trỏ `/courses/kubernetes`.
- 14.4 `deploy-14-4-chi-phi-doi-nha-cung-cap` — Chi phí và chuyển nhà: chọn VPS (CPU/RAM/đĩa/băng thông, vị trí gần
  người dùng VN), đo máy mới (`fio`, `iperf3` giữa hai container — ghi rõ là minh hoạ), chuyển sang VPS mới không mất
  dữ liệu (dump/restore, rsync volume, hạ TTL DNS trước, chạy song song, cắt chuyển), hoá đơn bất ngờ (băng thông, snapshot).
- 14.5 `deploy-14-5-quiz`.

## Chương 15 — Dự án cuối khoá (`s15-du-an-cuoi-khoa.mjs`, deck `dv-15`)
Title: `Chapter 15 — Capstone: ship a real app end to end|||Chương 15 — Dự án cuối khoá: đưa một ứng dụng thật lên từ đầu tới cuối`
Bối cảnh: đồ án nhóm "Đặt lịch phòng khám" — web tĩnh/Next tối giản + API Node/Python nhỏ + PostgreSQL, nginx đứng
trước. Dựng THẬT trong VPS thí nghiệm (container có systemd + Docker-in-Docker hoặc compose trên mạng `dv15-net`), tên
miền giả qua `/etc/hosts`, HTTPS bằng CA cục bộ/Pebble. Nối tiếp (không lặp) dự án Linux Ch16 — trỏ sang đó cho phần
dựng máy/systemd.
- 15.1 `deploy-15-1-may-ten-mien-https` — Ngày 1: máy mới → người dùng deploy + khoá SSH → tường lửa → Docker → nginx +
  HTTPS → trang "sắp ra mắt" trả 200 qua HTTPS.
- 15.2 `deploy-15-2-duong-ong-phat-hanh` — Ngày 2: đường ống build → registry cục bộ → script deploy (khoá chống chạy
  chồng, kiểm ảnh trước khi đẩy, migration một lần trước khi API lên, tráo không rơi request, smoke-test, ghi mốc bản
  đã lên) — viết + chạy thật 3 lần phát hành, có một lần cố tình hỏng.
- 15.3 `deploy-15-3-lui-ban-sao-luu` — Ngày 3: tập dượt lùi bản (kể cả khi migration đã chạy — mở rộng/thu hẹp), sao
  lưu tự động + **phục hồi có bấm giờ** sang máy khác, giám sát ngoài (script canh từ máy khác gửi cảnh báo webhook giả).
- 15.4 `deploy-15-4-ra-mat-tuan-dau` — Ra mắt + tuần đầu: runbook một trang, checklist trước/sau deploy, 8 sự cố kinh
  điển dựng lại thật (502 vì ảnh sai libc, đĩa đầy vì cache/log, cổng DB lộ, cert hết hạn, deploy cũ vì `--no-build`,
  sửa cấu hình không hiệu lực vì bind-mount/inode, hai deploy chạy chồng, migration kẹt khoá) — triệu chứng → lệnh
  chẩn đoán → cứu → phòng → chương liên quan.
- 15.5 `deploy-15-5-kiem-tra-cuoi-khoa` — **Bài thi cuối khoá: 20 câu** trải Mục 0 → Ch15 (tình huống, nhiều câu "bước
  nào hỏng / lệnh nào kiểm"), mỗi câu có explanation, đáp án rải 5/5/5/5, `timeLimitSeconds: 1800`; content = lời dặn +
  checklist năng lực cả khoá.
