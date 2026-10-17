---
name: vps-ssh-deploy
description: Quy trình trọn gói đưa app lên VPS qua SSH: khoá SSH + ~/.ssh/config, rsync/scp, systemd hoặc Docker, nginx reverse proxy, certbot HTTPS, ufw, kiểm sức khoẻ, kế hoạch lùi; luật hỏi trước thao tác không đảo ngược.
---

# KỸ NĂNG: VPS QUA SSH — từ máy trắng tới HTTPS chạy thật, lùi được

Đọc kèm `may-chu-ssh` (làm việc trên server không bị treo, bảo mật tối thiểu), `deploy` (Dockerfile/compose/CI),
`phong-thu-may-chu` (siết an ninh sâu hơn).

## 0. Luật vàng

1. **Hỏi trước mọi thao tác KHÔNG ĐẢO NGƯỢC được**: xoá dữ liệu/DB, `rm -rf`, ghi đè cấu hình đang chạy, đổi cổng SSH,
   bật tường lửa, tắt đăng nhập mật khẩu, khởi động lại máy, cấp lại chứng chỉ nhiều lần (Let's Encrypt giới hạn lượt).
2. **Có kế hoạch lùi TRƯỚC khi làm** (mục 8): bản cũ còn chạy được, cấu hình cũ còn trên đĩa, DB đã sao lưu.
3. **Không tự khoá mình ra ngoài**: mở cổng SSH trong ufw TRƯỚC khi `ufw enable`; tắt mật khẩu chỉ sau khi đã đăng nhập
   bằng khoá THÀNH CÔNG ở một phiên MỚI (giữ phiên cũ mở).
4. Mật khẩu/token: không in ra kết quả, không ghi vào lệnh (lộ trong lịch sử shell) — dùng file `.env` quyền 600.
5. Không gõ mật khẩu thay người dùng. Lệnh cần mật khẩu (ssh lần đầu, sudo) ⇒ đưa lệnh để họ tự gõ trong terminal thật
   hoặc nạp khoá trước (mục 1).

## 1. Khoá SSH và ~/.ssh/config

```bash
ls ~/.ssh/id_ed25519.pub 2>/dev/null || ssh-keygen -t ed25519 -C "ten@may" -f ~/.ssh/id_ed25519 -N ""
# Nạp khoá lên server (người dùng gõ mật khẩu MỘT lần — đưa lệnh này cho họ):
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@203.0.113.10
# Windows (không có ssh-copy-id):
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@203.0.113.10 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```
`~/.ssh/config` — gọi tắt, giữ kết nối, không treo chờ mật khẩu:
```
Host vps
  HostName 203.0.113.10
  User deploy
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 30
  ConnectTimeout 10
```
Kiểm KHÔNG tương tác: `ssh -o BatchMode=yes vps 'echo ok; uname -a; df -h /; free -m'`
(lỗi `Permission denied (publickey)` ⇒ khoá chưa nạp; treo ⇒ cổng bị chặn — thử `nc -vz 203.0.113.10 22`).

## 2. Chuẩn bị server lần đầu (Ubuntu/Debian)

```bash
ssh vps 'sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx ufw rsync curl'
ssh root@vps 'adduser --disabled-password --gecos "" deploy && usermod -aG sudo deploy && rsync -a ~/.ssh /home/deploy/ && chown -R deploy:deploy /home/deploy/.ssh'
```
Tường lửa (hỏi trước khi enable):
```bash
ssh vps 'sudo ufw allow OpenSSH && sudo ufw allow "Nginx Full" && sudo ufw --force enable && sudo ufw status verbose'
```
Docker trên VPS (nếu đi đường container): `curl -fsSL https://get.docker.com | sudo sh && sudo usermod -aG docker deploy`.
⚠️ Cổng Docker publish (`-p 5432:5432`) **đi vòng qua ufw** — DB chỉ publish `127.0.0.1:5432:5432` hoặc không publish.

## 3. Đưa mã lên

```bash
# Thư mục theo phiên bản ⇒ lùi bằng cách đổi symlink
REL=$(date +%Y%m%d_%H%M%S)
rsync -az --delete --exclude node_modules --exclude .git --exclude '.env*' ./ vps:/srv/app/releases/$REL/
ssh vps "cd /srv/app/releases/$REL && npm ci --omit=dev && npm run build && ln -sfn /srv/app/releases/$REL /srv/app/current"
```
- `.env` sống ở server (`/srv/app/shared/.env`, `chmod 600`), symlink vào bản phát hành — rsync KHÔNG mang `.env` lên.
- `scp file vps:/tmp/` cho file lẻ; Windows có `scp`/`ssh` sẵn (OpenSSH), rsync thì dùng trong WSL.
- Mạng chặn cổng 22 ⇒ server mở thêm cổng (443/993…) — xem `may-chu-ssh` mục 6.

## 4a. Chạy bằng systemd (không Docker)

`/etc/systemd/system/app.service`:
```ini
[Unit]
Description=My App
After=network-online.target
Wants=network-online.target

[Service]
User=deploy
WorkingDirectory=/srv/app/current
EnvironmentFile=/srv/app/shared/.env
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload && sudo systemctl enable --now app
systemctl status app --no-pager ; journalctl -u app -n 100 --no-pager
```

## 4b. Chạy bằng Docker compose

`rsync` thư mục có `docker-compose.yml` rồi `ssh vps 'cd /srv/app && docker compose pull && docker compose up -d --build'`.
Ảnh dựng sẵn ở registry (GHCR) ⇒ VPS chỉ `pull` + `up -d` (nhẹ RAM, không đầy đĩa vì cache build).

## 5. nginx reverse proxy

`/etc/nginx/sites-available/app`:
```nginx
server {
  listen 80;
  server_name app.example.com;
  client_max_body_size 20m;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;      # WebSocket
    proxy_set_header Connection "upgrade";
  }
}
```
```bash
sudo ln -sfn /etc/nginx/sites-available/app /etc/nginx/sites-enabled/app
sudo nginx -t && sudo systemctl reload nginx      # nginx -t HỎNG ⇒ KHÔNG reload, sửa trước
```

## 6. HTTPS với certbot

DNS `A app.example.com → IP VPS` phải trỏ đúng TRƯỚC (`dig +short app.example.com`).
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.example.com --non-interactive --agree-tos -m email@cua-nguoi-dung --redirect
sudo certbot renew --dry-run         # kiểm gia hạn tự động
```
Thử nhiều lần khi còn lỗi ⇒ dùng `--staging` để không chạm giới hạn lượt của Let's Encrypt. Email: HỎI người dùng.

## 7. Kiểm sức khoẻ sau deploy (bằng chứng, không phải "chắc là chạy")

```bash
ssh vps 'curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/health'   # app sau proxy
curl -fsS -o /dev/null -w "%{http_code}\n" https://app.example.com/health             # từ ngoài
curl -sI https://app.example.com | head -5                                             # header, HTTPS
ssh vps 'systemctl is-active app; journalctl -u app -n 20 --no-pager | grep -iE "error|warn" || true'
```

## 8. Kế hoạch lùi

- systemd + releases: `ln -sfn /srv/app/releases/<bản_trước> /srv/app/current && sudo systemctl restart app`.
- Docker: giữ tag ảnh cũ (`app:<sha>`), lùi bằng đổi tag trong compose rồi `up -d`.
- nginx: chép `sites-available/app` thành `app.bak` trước khi sửa; hỏng ⇒ chép lại + `nginx -t` + reload.
- DB: sao lưu TRƯỚC migration (`pg_dump -Fc`). Lùi mã không lùi được DB — migration phá huỷ phải hỏi trước.
- Giữ 3–5 bản phát hành gần nhất, xoá bản cũ hơn (hỏi trước lần đầu).

## 9. Bẫy thường gặp

- 502 Bad Gateway ⇒ app chưa nghe cổng/đã chết (`journalctl -u app`), hoặc nghe `localhost` IPv6 còn nginx gọi 127.0.0.1.
- Đĩa đầy giết DB ⇒ `df -h`, `docker system df`, `journalctl --vacuum-size=200M` (hỏi trước khi xoá log).
- `sudo` hỏi mật khẩu trong lệnh không tương tác ⇒ treo. Kiểm `sudo -n true` trước; cần thì nhờ người dùng.
- Sửa file cấu hình bind-mount vào container bằng `mv`/`sed -i` ⇒ container vẫn đọc inode cũ; ghi đè tại chỗ rồi kiểm
  từ BÊN TRONG container.

## 10. Báo cáo cuối

URL chạy thật + mã HTTP đo được, nơi đặt mã/.env/service/nginx, cách xem log, cách lùi, và việc còn chờ người dùng
(DNS, email certbot, mật khẩu, đồng ý tắt đăng nhập mật khẩu…).
