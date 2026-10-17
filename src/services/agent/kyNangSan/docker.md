---
name: docker
description: Docker trên macOS/Windows/Linux: cài/khởi động Docker Desktop hoặc Engine, phân biệt CHƯA CÀI vs CHƯA CHẠY vs TREO, compose, đọc log, vào container, mạng/volume, dọn đĩa, lỗi hay gặp (cổng trùng, arm64/amd64, CRLF, hết RAM).
---

# KỸ NĂNG: DOCKER — chạy được, đọc được lỗi, không làm mất dữ liệu

Viết Dockerfile/compose để DEPLOY ⇒ đọc thêm kỹ năng `deploy`. Kỹ năng này là phần vận hành Docker trên máy.

## 0. Luật vàng

1. **Mọi lệnh nói chuyện với daemon đều có thể TREO VÔ HẠN** (Docker Desktop đang khởi động dở, VM kẹt, socket cũ còn
   sót). Đã đo thật: `docker info` treo mãi trong khi tiến trình `com.docker.backend` vẫn sống. ⇒ chạy lệnh kiểm bằng
   `chay_lenh_nen` rồi `doc_dau_ra_nen` sau 10–15 giây, hoặc bọc giới hạn giờ (Linux: `timeout 15 docker info`;
   macOS không có `timeout` — dùng `gtimeout` nếu có coreutils, không thì chạy nền). Treo quá 30 giây = coi như daemon hỏng.
2. **Không bao giờ tự chạy** `docker system prune -a --volumes`, `docker volume rm`, `docker compose down -v` khi chưa
   hỏi: volume là DỮ LIỆU (database). Dọn ảnh/cache build thì được, dọn volume thì không.
3. Đọc lỗi trước khi thử lại. Lỗi Docker thường nói đúng nguyên nhân ở dòng cuối.

## 1. Chẩn đoán: chưa cài · chưa chạy · treo · không có quyền

```bash
docker --version                  # KHÔNG cần daemon. Lỗi "command not found" ⇒ CHƯA CÀI
docker context ls                 # đang trỏ daemon nào (desktop-linux, default, colima, ssh://…)
docker info --format '{{.ServerVersion}}'   # cần daemon (chạy nền + đọc sau 15s, xem luật 1)
```
| Triệu chứng | Nghĩa | Làm gì |
|---|---|---|
| `command not found` / `'docker' is not recognized` | chưa cài | mục 2 |
| `Cannot connect to the Docker daemon … Is the docker daemon running?` | cài rồi, daemon CHƯA CHẠY | mục 3 |
| lệnh treo, không in gì | daemon đang lên dở hoặc VM kẹt | đợi 60s; vẫn treo ⇒ khởi động lại Docker Desktop (mục 3) |
| `permission denied … /var/run/docker.sock` (Linux) | user chưa ở nhóm `docker` | `sudo usermod -aG docker $USER` rồi ĐĂNG XUẤT/VÀO lại (hoặc `newgrp docker`) |
| `error during connect … pipe/docker_engine` (Windows) | Docker Desktop chưa chạy / WSL2 hỏng | mục 3 + `wsl --status` |

macOS: `pgrep -lf com.docker.backend` có tiến trình ⇒ app đang chạy (nhưng chưa chắc daemon đã sẵn sàng).

## 2. Cài

- **macOS**: `brew install --cask docker` (Docker Desktop; cần người dùng mở app lần đầu, chấp nhận điều khoản, cấp quyền).
  Nhẹ hơn/không giấy phép: `brew install colima docker docker-compose && colima start --cpu 4 --memory 6`.
  Máy Apple Silicon: ảnh chỉ có amd64 ⇒ chạy được qua giả lập nhưng chậm (`--platform linux/amd64`).
- **Windows**: `winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements`.
  Cần WSL2: `wsl --status` (thiếu ⇒ `wsl --install` trong PowerShell Admin rồi KHỞI ĐỘNG LẠI máy — hỏi người dùng).
  Ảo hoá phải bật trong BIOS (Task Manager → Performance → CPU → "Virtualization: Enabled").
- **Linux (Ubuntu/Debian)**: script chính thức hoặc gói repo Docker (không dùng `docker.io` cũ của distro nếu cần compose v2):
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
  sudo systemctl enable --now docker && sudo usermod -aG docker $USER
  ```
  Fedora: `sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin` (sau khi thêm repo docker-ce).
- Cài xong kiểm: `docker run --rm hello-world` (in "Hello from Docker!").
- Docker Desktop: miễn phí cho cá nhân/học tập/công ty nhỏ (<250 người VÀ <10 triệu USD doanh thu); lớn hơn cần gói trả phí.

## 3. Khởi động / khởi động lại daemon

- macOS: `open -a Docker` rồi đợi (30–90s). Kẹt: `osascript -e 'quit app "Docker"'` → đợi 10s → `open -a Docker`.
  Kẹt hẳn (không thoát được): `killall com.docker.backend` (hỏi trước — mọi container đang chạy sẽ dừng).
  Colima: `colima status` / `colima start` / `colima restart`.
- Windows: `start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"`; kẹt ⇒ `wsl --shutdown` rồi mở lại app.
- Linux: `sudo systemctl start docker` · `sudo systemctl status docker --no-pager` · `journalctl -u docker -n 50 --no-pager`.
- Đợi sẵn sàng bằng vòng lặp có trần (đừng `sleep 60` mù):
  `for i in $(seq 1 30); do docker info >/dev/null 2>&1 && echo READY && break; sleep 3; done`

## 4. Compose — vòng làm việc hằng ngày

```bash
docker compose config                       # kiểm cú pháp + biến .env đã thay ĐÚNG chưa (đọc trước khi up)
docker compose up -d --build                # dựng lại + chạy nền
docker compose ps                           # trạng thái + health
docker compose logs -f --tail=100 api       # log một dịch vụ (dừng theo dõi: chạy nền rồi đọc, đừng chặn lượt)
docker compose exec api sh                  # vào container (alpine không có bash)
docker compose exec -T db psql -U postgres -c 'select 1'   # -T khi dẫn ống/không TTY
docker compose restart api  ·  docker compose stop  ·  docker compose down   # down KHÔNG xoá volume (khác down -v)
```
- `docker compose` (v2, có cách) ≠ `docker-compose` (v1, đã ngừng). Máy chỉ có v1 ⇒ cài plugin compose.
- Đổi `.env` ⇒ phải `up -d` lại (restart KHÔNG nạp lại biến môi trường).

## 5. Đọc lỗi container

```bash
docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
docker logs --tail 200 <tên>                 # container chết ngay: lỗi nằm ở đây
docker inspect <tên> --format '{{.State.ExitCode}} {{.State.OOMKilled}} {{.State.Error}}'
docker inspect <tên> --format '{{json .State.Health}}'
```
| Mã thoát | Nghĩa thường gặp |
|---|---|
| 137 | bị giết — thường HẾT RAM (`OOMKilled true`) ⇒ tăng RAM Docker Desktop / giảm `--max-old-space-size` |
| 139 | segfault — hay gặp ảnh sai kiến trúc hoặc thư viện native (musl vs glibc) |
| 1 / 2 | lỗi của chính app — đọc `docker logs` |
| 126/127 | entrypoint không chạy được: không có quyền thực thi hoặc **file .sh mang CRLF** (`/bin/sh^M`) |

## 6. Mạng, cổng, volume

- `Bind for 0.0.0.0:5432 failed: port is already allocated` ⇒ cổng trùng. Tìm ai giữ:
  macOS/Linux `lsof -nP -iTCP:5432 -sTCP:LISTEN` · Windows `netstat -ano | findstr :5432` rồi `tasklist /FI "PID eq <pid>"`.
  Đổi cổng NGOÀI (`"5433:5432"`), đừng tắt dịch vụ của người dùng khi chưa hỏi.
- Trong compose, container gọi nhau bằng **tên dịch vụ** (`db:5432`), KHÔNG phải `localhost`.
  Container gọi ra máy chủ: `host.docker.internal` (Linux cần `extra_hosts: ["host.docker.internal:host-gateway"]`).
- `docker volume ls` · `docker volume inspect <v>` · sao lưu volume trước thao tác nguy hiểm:
  `docker run --rm -v <v>:/data -v "$PWD":/bk alpine tar czf /bk/<v>.tgz -C /data .`

## 7. Dọn đĩa (hỏi trước mục nào đụng dữ liệu)

```bash
docker system df                 # ảnh / container / volume / build cache chiếm bao nhiêu
docker builder prune -f          # cache build — an toàn, thường lớn nhất
docker image prune -f            # ảnh treo (<none>) — an toàn
docker container prune -f        # container đã dừng — hỏi nếu có thể còn log cần đọc
# KHÔNG tự chạy: docker volume prune / docker system prune -a --volumes
```
Docker Desktop giữ đĩa ảo (`Docker.raw` / `ext4.vhdx`) — dọn trong Docker xong file đó KHÔNG tự co; giới hạn ở
Settings → Resources.

## 8. Bẫy thường gặp

- Apple Silicon/ARM VPS kéo ảnh chỉ có amd64 ⇒ `exec format error`. Dựng đa nền tảng:
  `docker buildx build --platform linux/amd64,linux/arm64 -t x --push .`
- `COPY` thiếu file ⇒ xem `.dockerignore` (có thể đang loại đúng file đó).
- Sửa mã mà container không đổi ⇒ quên `--build`, hoặc chạy ảnh cũ cùng tên (`docker compose up -d --build --force-recreate`).
- `npm ci` trong ảnh alpine lỗi native (sharp, bcrypt, prisma) ⇒ dùng `node:22-slim` hoặc cài đúng engine musl.

## 9. Kiểm sau khi làm & báo cáo

`docker compose ps` (tất cả `running`/`healthy`) + gọi thử dịch vụ (`curl -fsS localhost:3000/health`) + `docker logs
--tail 20` không có lỗi mới. Báo cáo: lệnh đã chạy, trạng thái thật, những gì CHƯA làm (vd. "chưa dọn volume — cần bạn đồng ý").
