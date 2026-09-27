---
name: server-may-nha
description: Dựng server TÁCH BIỆT trên máy nhà (Windows/Linux/macOS) để chạy app/dịch vụ riêng: Docker hoặc máy ảo, mạng riêng, giới hạn CPU/RAM, không mở cổng router (Tailscale/Cloudflare Tunnel/đường hầm SSH qua VPS), sao lưu, gỡ sạch.
---

# KỸ NĂNG: SERVER TÁCH BIỆT TRÊN MÁY NHÀ

Mục tiêu: một "server riêng" chạy trên máy nhà mà **không làm hỏng, không làm chậm, không làm lộ** máy người dùng
đang dùng hằng ngày; vào được từ xa một cách an toàn; sao lưu được; và **gỡ sạch** được khi không cần nữa.

## 0. Luật vàng

1. **Hỏi trước những việc chạm tới cả máy**: cài hypervisor/WSL/Docker (thường phải khởi động lại), tạo tài khoản
   hệ thống, đổi tường lửa, đổi thiết lập nguồn điện/ngủ, và **mọi thay đổi trên router**. Gom thành MỘT lần hỏi
   kèm lý do.
2. **KHÔNG mở cổng trên router ra Internet** (port forwarding) khi chưa được yêu cầu rõ. Mặc định: chỉ người dùng
   vào được qua mạng riêng (Tailscale), hoặc công khai qua đường hầm (Cloudflare Tunnel / đường hầm SSH qua VPS)
   — máy nhà không lộ IP, không nhận kết nối vào trực tiếp.
3. **Tách biệt thật**: dịch vụ không chạy bằng tài khoản của người dùng, không đọc được thư mục cá nhân của họ,
   có giới hạn CPU/RAM/đĩa, và nghe trên `127.0.0.1` hoặc IP mạng riêng — không trên mọi card mạng.
4. **Bí mật không nằm trong repo hay lệnh**: file `.env` quyền hẹp trong thư mục dữ liệu của server.
5. **Có đường lùi và đường gỡ**: ghi lại mọi thứ đã tạo (container, volume, luật tường lửa, dịch vụ, tài khoản)
   vào một file `SERVER.md` cạnh dự án, kèm lệnh gỡ từng thứ.

## 1. Chọn mức tách biệt

| Nhu cầu | Chọn |
|---|---|
| Chạy app web/API/DB bình thường | **Docker (Compose)** — nhẹ, lên nhanh, gỡ sạch bằng một lệnh. Mặc định. |
| Cần cả một hệ điều hành riêng, phần mềm lạ, thử nghiệm rủi ro | **Máy ảo**: Hyper-V (Windows Pro), KVM/virt-manager (Linux), UTM (macOS) |
| Windows Home không có Hyper-V | **WSL2 distro riêng** (`wsl --import`) + Docker Engine bên trong |
| Chỉ một tiến trình nhỏ, không muốn Docker | Tài khoản hệ thống riêng + dịch vụ (systemd / NSSM / launchd) |

## 2. Docker — cách làm chuẩn

`compose.yaml` mẫu cho server nhà (điều chỉnh theo dự án):
```yaml
name: nha-myapp
services:
  app:
    image: myapp:1.4.2            # tag cụ thể, không latest
    restart: unless-stopped
    env_file: ./data/app.env      # chmod 600, không commit
    ports:
      - "127.0.0.1:3000:3000"     # CHỈ máy này (hoặc IP Tailscale) — không "3000:3000"
    user: "1000:1000"             # không chạy root trong container
    read_only: true              # app phải ghi ra ngoài volume/tmp thì bỏ dòng này
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    deploy:
      resources:
        limits: { cpus: "2.0", memory: 1g }
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }   # log không ăn hết đĩa
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/health"]
      interval: 30s
      retries: 3
    networks: [rieng]
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    env_file: ./data/db.env
    volumes: ["./data/pg:/var/lib/postgresql/data"]
    networks: [rieng]            # KHÔNG publish cổng DB ra máy
networks:
  rieng: {}
```
- `127.0.0.1:` trước cổng là điều quan trọng nhất: thiếu nó thì Docker **vượt qua tường lửa** (trên Linux Docker tự
  thêm luật iptables) và cổng lộ ra cả LAN/Internet.
- Image không có `wget`/`curl` thì healthcheck bằng chính runtime (`node -e "require('http').get(...)"`).
- Dữ liệu trong `./data/` cạnh file compose ⇒ sao lưu một thư mục là đủ.

## 3. Theo từng hệ điều hành

**Linux (Fedora/Ubuntu):**
- Docker hoặc Podman. Fedora có **SELinux**: bind-mount thư mục phải thêm `:Z` (`./data/pg:/var/lib/postgresql/data:Z`),
  thiếu là lỗi `permission denied` dù quyền file đúng.
- Tường lửa: `firewall-cmd` (Fedora) / `ufw` (Ubuntu). Mở cổng CHỈ cho vùng mạng tin cậy:
  `sudo firewall-cmd --zone=trusted --add-interface=tailscale0 --permanent && sudo firewall-cmd --reload`.
- Dịch vụ không Docker: tài khoản riêng `sudo useradd --system --create-home --shell /usr/sbin/nologin svc-myapp`
  + unit systemd có `User=svc-myapp`, `ProtectHome=true`, `ProtectSystem=strict`, `ReadWritePaths=/srv/myapp`,
  `MemoryMax=1G`, `CPUQuota=200%`, `Restart=on-failure`.
- Máy có GPU/ổ riêng cho việc khác (train AI, lưu trữ): đặt giới hạn để server không tranh tài nguyên.

**Windows:** đọc kỹ năng `devops-windows`. Tách biệt bằng: Docker Desktop (cần người đăng nhập), hoặc
**WSL2 distro riêng** không cần đăng nhập Desktop:
```
wsl --import nha-server C:\wsl\nha-server C:\wsl\ubuntu-rootfs.tar --version 2
wsl -d nha-server
```
rồi cài Docker Engine trong distro đó; giới hạn bằng `.wslconfig` (`memory=`, `processors=`). Hyper-V VM khi cần
tách hẳn (Windows Pro/Education).

**macOS:** Docker Desktop / OrbStack / colima. Dịch vụ tự chạy bằng `launchd` (plist trong `~/Library/LaunchAgents`
cho tài khoản người dùng, `/Library/LaunchDaemons` cho cả máy — cần hỏi). Tắt ngủ khi cắm điện:
`sudo pmset -c sleep 0` (hỏi trước).

## 4. Vào từ xa AN TOÀN (không mở cổng router)

| Ai cần vào | Cách |
|---|---|
| Chỉ người dùng và thiết bị của họ | **Tailscale**: cài trên máy nhà + điện thoại/laptop, vào bằng `http://<tên-máy>:3000` hoặc IP `100.x`. Dịch vụ có thể nghe riêng IP Tailscale. |
| Công khai cho người ngoài, có HTTPS | **Cloudflare Tunnel** (`cloudflared tunnel run`) — không mở cổng nào, Cloudflare lo HTTPS. Cần domain trên Cloudflare. |
| Đã có VPS | **Đường hầm SSH ngược** từ máy nhà lên VPS (`ssh -N -R 127.0.0.1:9000:127.0.0.1:3000 user@vps` chạy bằng autossh/systemd), rồi Nginx/Caddy trên VPS proxy về `127.0.0.1:9000`. |

Đường hầm SSH ngược bắt buộc: khoá SSH riêng cho việc này, `ServerAliveInterval=30`, tự nối lại (autossh hoặc
`Restart=always`), và trên VPS chỉ bind `127.0.0.1` (không `GatewayPorts yes`).

## 5. Máy nhà không phải máy chủ — những thứ phải lo

- **Ngủ / tắt máy / mất điện / mất mạng**: tắt ngủ khi cắm điện (hỏi trước), `restart: unless-stopped` hoặc dịch vụ
  tự khởi động, và đường hầm tự nối lại. Chấp nhận là server nhà sẽ có lúc chết — đừng hứa uptime như VPS.
- **IP nhà đổi** ⇒ Tailscale/Tunnel không bị ảnh hưởng; DNS trỏ thẳng IP nhà thì hỏng.
- **Tài nguyên dùng chung với người dùng**: giới hạn CPU/RAM, log xoay vòng, theo dõi đĩa (`docker system df`,
  `df -h`). Đĩa đầy là thứ giết database nhanh nhất.
- **Cập nhật hệ điều hành tự khởi động lại máy** ⇒ dịch vụ phải tự lên lại, và có kiểm sức khoẻ.

## 6. Sao lưu và thử khôi phục

- Sao lưu **dữ liệu**, không phải container: dump DB (`docker compose exec db pg_dump -U app app > backup/app-$(date +%F).sql`)
  + thư mục `data/` (trừ dữ liệu DB đang chạy — dump thay vì chép file).
- Đẩy bản sao ra **ngoài máy** (VPS, ổ khác, dịch vụ lưu trữ): `restic`/`borg`/`rclone`, có mã hoá.
- **Thử khôi phục** vào một container tạm ít nhất một lần — sao lưu chưa từng khôi phục thử là sao lưu chưa biết đúng hay sai.

## 7. Giám sát tối thiểu

- Healthcheck trong compose + `docker ps` xem cột STATUS (healthy/unhealthy, không `Restarting`).
- Uptime Kuma (một container) hoặc kiểm từ VPS mỗi vài phút và báo khi chết.
- Log: `docker compose logs --tail 100 app`.

## 8. Gỡ sạch

Ghi sẵn trong `SERVER.md`: `docker compose down` (giữ dữ liệu) / `docker compose down -v` (XOÁ dữ liệu — hỏi trước),
gỡ luật tường lửa theo tên, gỡ dịch vụ, gỡ tài khoản hệ thống, tắt đường hầm, gỡ máy ảo/distro WSL
(`wsl --unregister nha-server` — xoá toàn bộ, hỏi trước).

## 9. Báo cáo cuối

Server chạy ở đâu (Docker/VM/WSL), tài nguyên giới hạn bao nhiêu, cổng nghe trên địa chỉ nào, vào từ xa bằng cách
nào, dữ liệu + sao lưu ở đâu, lệnh cập nhật/lùi/gỡ, kết quả kiểm sức khoẻ thật, và những việc người dùng còn phải
tự làm (cài Tailscale trên điện thoại, đăng nhập Cloudflare, khởi động lại máy).
