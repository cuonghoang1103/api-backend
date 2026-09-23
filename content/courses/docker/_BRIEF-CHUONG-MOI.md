# Đề cương 4 chương MỚI — khoá Docker (bổ sung 09/2026)

Đọc `_HOP-DONG.md` trước. Chương mới thì KHÔNG có bản cũ để so ⇒ chạy bộ kiểm với `--moi`.
Mục tiêu của 4 chương: khoá cũ đi tới "vận hành + chẩn đoán" (Ch11–12); người dùng muốn **"dùng được Docker cho
mọi việc, từ số 0 tới nâng cao"** ⇒ thêm: Docker trong vòng lặp phát triển hằng ngày, Docker như một hộp công cụ
đa năng, phần nâng cao vượt khỏi một máy, và một dự án cuối khoá làm trọn từ đầu tới production.

Mỗi chương: N.0 slide (DOCUMENT) · 4 bài LESSON (khối VI mỗi bài 12–16k ký tự, EN tương đương, cùng khung bài cũ:
eyebrow/h2/lead/h3…, 4–6 slide nhúng, `.pitfall co-tieu-de` ≥ 1, `🧪`/`🗂`/`📌`, link-card nguồn chính thức — URL
GET được 200) · N.5 quiz 10 câu. Viết theo giọng các chương cũ (đọc `s09-compose.mjs` và `s11-production.mjs` để
bắt giọng: nói thẳng, output thật, "vì sao" trước "làm sao"). File chương: `export default { title, description,
lessons }`, title chương dạng `'Chapter N — …|||Chương N — …'`. Luôn `isFreePreview: true`. Hằng `REF` như chương cũ
nếu dùng link-card Code Lab (chỉ trỏ tới `/code-lab/docker` — KHÔNG bịa bài Code Lab cụ thể).
Các khoá liên quan trên site để trỏ sang thay vì dạy lại: `/courses/deploy-vps`, `/courses/github-actions`,
`/courses/nginx`, `/courses/git`.

## Chương 13 — Docker trong vòng lặp phát triển (`s13-phat-trien.mjs`, deck `dk-13`)
Title: `Chapter 13 — Docker in your daily dev loop|||Chương 13 — Docker trong vòng lặp phát triển hằng ngày`
- 13.1 `dk-13-1-dev-containers` — Dev Containers: `.devcontainer/devcontainer.json` (image vs Dockerfile vs compose,
  `features`, `postCreateCommand`, `forwardPorts`, extension), mở bằng VS Code; cả nhóm cùng một môi trường; so với
  Codespaces; khi nào KHÔNG đáng. Chạy thật một devcontainer tối thiểu bằng `@devcontainers/cli` (`npx`) nếu được.
- 13.2 `dk-13-2-hot-reload-debug` — Sửa mã thấy ngay: bind mount + nodemon/`next dev` vs `docker compose watch`
  (`develop.watch`: sync / rebuild / sync+restart), cái bẫy `node_modules` bị bind mount đè (volume ẩn danh), sự kiện
  file trên Mac/Windows; gắn debugger Node (`--inspect=0.0.0.0:9229`, cổng, VS Code attach).
- 13.3 `dk-13-3-db-that-cho-test` — Dịch vụ thật cho test: Postgres/Redis dùng-một-lần cho test tích hợp (`tmpfs` cho
  nhanh, `--rm`, healthcheck chờ sẵn sàng), Testcontainers cho Node (khái niệm + ví dụ chạy thật nếu cài được), service
  containers trong GitHub Actions (trỏ `/courses/github-actions`), dữ liệu seed.
- 13.4 `dk-13-4-mac-windows` — Docker trên Mac & Windows thật ra chạy trong một máy ảo: Docker Desktop (license tính
  đến 09/2026 — KIỂM), OrbStack / Colima (so bảng), WSL2 trên Windows (để mã TRONG hệ file Linux), VirtioFS và hiệu năng
  bind mount, `host.docker.internal`, arm64 vs amd64 (`--platform`, Rosetta), giới hạn RAM/CPU/đĩa của VM và dọn nó.
- 13.5 `dk-13-5-quiz`.

## Chương 14 — Docker cho mọi việc (`s14-moi-viec.mjs`, deck `dk-14`)
Title: `Chapter 14 — Docker for everything: tools, self-hosting & AI|||Chương 14 — Docker cho mọi việc: công cụ, tự host & AI`
- 14.1 `dk-14-1-cong-cu-khong-cai` — Chạy công cụ không cần cài: mẫu `docker run --rm -it -v "\$PWD":/w -w /w <ảnh> …`
  (node/python/go khác phiên bản, ffmpeg, pandoc, sqlite3, `amazon/aws-cli`, `hadolint`, `trivy`…), chạy bằng quyền
  của mình (`-u "\$(id -u):\$(id -g)"`), alias/hàm zsh, ghim phiên bản; khi nào nên cài thật.
- 14.2 `dk-14-2-kho-du-lieu-mot-lenh` — Mọi loại CSDL/hạ tầng trong một lệnh: Postgres, MySQL, MongoDB, Redis,
  MinIO (S3 cục bộ), Mailpit (bắt email khi dev), RabbitMQ; giao diện quản trị (Adminer/pgAdmin); dump/restore giữa
  container và máy; biến môi trường khởi tạo và thư mục `/docker-entrypoint-initdb.d`.
- 14.3 `dk-14-3-tu-host` — Tự host dịch vụ trên VPS/máy nhà: reverse proxy tự cấp HTTPS (Caddy — so với nginx đã học,
  trỏ `/courses/nginx`), vài dịch vụ hữu ích cho SV (Uptime Kuma, n8n, Vaultwarden/…: chọn 2–3 và KIỂM ảnh chính thức),
  cập nhật ảnh an toàn, sao lưu volume, cái giá bảo mật khi mở cổng ra Internet.
- 14.4 `dk-14-4-gpu-ai` — GPU và AI cục bộ trong container: NVIDIA Container Toolkit, `--gpus all`, `nvidia-smi` trong
  container (chạy THẬT trên linux-nha nếu có GPU — chỉ đọc, container nhỏ, không chiếm VRAM lâu), Ollama trong Docker,
  Docker Model Runner (KIỂM docs.docker.com xem đang ở trạng thái nào, 09/2026), Mac không cho GPU vào container ⇒
  chạy native; volume cho model nặng.
- 14.5 `dk-14-5-quiz`.

## Chương 15 — Nâng cao: vượt khỏi một máy (`s15-nang-cao.mjs`, deck `dk-15`)
Title: `Chapter 15 — Advanced: builds, security & beyond one host|||Chương 15 — Nâng cao: build, bảo mật & vượt khỏi một máy`
- 15.1 `dk-15-1-buildx-bake` — BuildKit nâng cao: builder `docker-container`, build đa nền tảng thật
  (`--platform linux/amd64,linux/arm64`, QEMU vs máy build gốc), `docker buildx bake` với `docker-bake.hcl`, build
  secrets (`--secret`), `--ssh`, `docker build --check` (build checks), attestations SBOM/provenance — nối tiếp 3.4, 5.x, 6.5
  chứ không lặp lại.
- 15.2 `dk-15-2-rootless-podman` — Bảo mật sâu hơn: daemon chạy root nghĩa là gì (nhóm `docker` ≈ root), rootless
  Docker, user namespace remap, Podman (không daemon, tương thích CLI, `podman compose`, pod), seccomp/AppArmor mặc định,
  `--cap-drop ALL`; bảng so sánh khi nào chọn cái nào.
- 15.3 `dk-15-3-swarm` — Nhiều máy mức nhẹ: Docker Swarm (`swarm init`, service, replicas, rolling update, secrets,
  overlay network, `docker stack deploy` từ file compose) — chạy thật một swarm một-nút trên máy (tên `dk15-…`, và
  `docker swarm leave --force` khi xong, CHỈ nếu máy chưa ở swarm nào từ trước — kiểm `docker info` trước).
- 15.4 `dk-15-4-kubernetes` — Từ Compose tới Kubernetes: Pod/Deployment/Service/Ingress/ConfigMap/Secret đặt cạnh
  khái niệm Compose tương ứng (bảng), chạy thử bằng `kind` hoặc `k3d` nếu cài được (không thì output chính thức, ghi
  rõ), Kompose; nói thẳng khi nào KHÔNG cần Kubernetes (đồ án SV, một VPS).
- 15.5 `dk-15-5-quiz`.

## Chương 16 — Dự án cuối khoá (`s16-du-an-cuoi-khoa.mjs`, deck `dk-16`)
Title: `Chapter 16 — Capstone: containerise and ship a real app|||Chương 16 — Dự án cuối khoá: đóng gói và đưa một ứng dụng thật lên production`
Bối cảnh xuyên suốt: đồ án nhóm "Đặt lịch phòng khám" — web Next.js, API Express + Prisma, PostgreSQL, Redis,
nginx đứng trước. Dựng THẬT một phiên bản thu nhỏ trong thư mục scratch (mã tối giản nhưng chạy được) để mọi
output là output thật.
- 16.1 `dk-16-1-dong-goi` — Ngày 1: `.dockerignore`, Dockerfile multi-stage cho API (Prisma: chọn ảnh nền đúng libc +
  `binaryTargets`) và web (Next.js standalone), chạy không phải root, healthcheck; đo kích thước trước/sau.
- 16.2 `dk-16-2-compose-dev-prod` — Compose cho dev (watch, bind mount, Mailpit) và prod (ảnh đã dựng, `restart`,
  giới hạn RAM, log rotation, mạng tách front/back, volume có tên, migration chạy một lần trước khi API lên).
- 16.3 `dk-16-3-ci-ghcr-deploy` — Đưa lên: GitHub Actions build đa nền tảng + cache → GHCR (tag theo commit, không chỉ
  `latest`), VPS `pull` + `up -d` + smoke test, quay lui bằng tag cũ (trỏ `/courses/github-actions`, `/courses/deploy-vps`).
  Workflow viết đầy đủ nhưng KHÔNG chạy thật lên GitHub — giải thích từng bước; phần chạy được cục bộ thì chạy.
- 16.4 `dk-16-4-van-hanh-su-co` — Tuần đầu trên production: sao lưu/khôi phục Postgres, xem log, dọn đĩa, và 8 sự cố
  kinh điển (exit 137 OOM, 502 vì ảnh sai libc, đĩa đầy vì cache build, container restart vòng lặp, cổng DB lộ ra
  Internet vì `ports:` bỏ qua firewall, sửa bind-mount file đơn bằng `mv` mà container không thấy, `.env` không vào
  container, múi giờ UTC) — mỗi cái: triệu chứng → lệnh chẩn đoán → cách cứu → cách phòng → chương liên quan.
- 16.5 `dk-16-5-kiem-tra-cuoi-khoa` — **Bài thi cuối khoá: 20 câu** trải đều Mục 0 → Ch16 (tình huống), mỗi câu có
  explanation, đáp án rải 5/5/5/5; content = lời dặn + checklist năng lực cả khoá. `timeLimitSeconds: 1800`.
