---
name: may-chu-ssh
description: Kết nối và quản trị server Linux (VPS, máy chủ ở nhà, máy ảo) qua SSH mà không bao giờ bị treo chờ mật khẩu — nạp SSH key, tạo user, cài Docker/Nginx/DB, tường lửa, bảo mật, xem log, backup, dọn đĩa, gỡ lỗi server. Dùng khi việc cần chạy lệnh trên một máy khác.
---

# KỸ NĂNG: MÁY CHỦ QUA SSH — không tương tác, an toàn

## 1. Bạn KHÔNG gõ được mật khẩu — xử lý thế nào

Mọi lệnh ssh của bạn phải dạng:
```bash
ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new user@ip '<lệnh>'
```
`BatchMode=yes` làm ssh BÁO LỖI NGAY thay vì đứng chờ mật khẩu. Thấy `Permission denied (publickey,password)`
⇒ server chưa nhận key của máy này. Hướng dẫn người dùng (họ tự làm, vì cần gõ mật khẩu MỘT lần):

- Chưa có key: `ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519` (bạn tự chạy được — `-N ""` là không hỏi).
- macOS/Linux: người dùng chạy `ssh-copy-id -i ~/.ssh/id_ed25519.pub user@ip` rồi nhập mật khẩu.
- Windows PowerShell (không có ssh-copy-id):
  `type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh user@ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"`
- Nhà cung cấp VPS thường có ô "SSH keys" lúc tạo máy — dán nội dung file `.pub` vào đó.
Sau đó chạy lại lệnh kiểm. Chỉ đi tiếp khi `ssh -o BatchMode=yes ... 'echo ok'` in ra `ok`.

`sudo` cũng không gõ mật khẩu được: dùng `sudo -n <lệnh>` (báo lỗi ngay nếu cần mật khẩu). Cần ⇒ người dùng cấp
sudo không mật khẩu cho đúng user deploy (`echo 'deploy ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/deploy`)
hoặc cho user vào nhóm `docker`. Nói rõ cái giá: nhóm `docker` ≈ quyền root trên máy đó.

Lệnh nhiều dòng: đẩy script qua stdin, đừng nhồi nháy lồng nháy:
```bash
ssh -o BatchMode=yes user@ip 'bash -s' <<'SH'
set -euo pipefail
...
SH
```

Lệnh chạy lâu (build, cài đặt): đặt `timeout_seconds` đủ lớn, hoặc chạy nền trên server bằng
`nohup ... > /tmp/x.log 2>&1 &` rồi đọc log sau. Kết nối hay đứt ⇒ thêm `-o ServerAliveInterval=15`.

## 2. Khảo sát máy TRƯỚC khi cài gì

```bash
uname -m; cat /etc/os-release | head -3; nproc; free -h; df -h /; whoami; id
command -v docker && docker --version; systemctl is-active nginx 2>/dev/null; ss -ltnp | head -30
```
Quyết định dựa trên kết quả: kiến trúc (x86_64 vs aarch64), RAM (SQL Server cần ≥2GB; build Next/Java/.NET cần nhiều),
cổng đang bị chiếm, có sẵn Nginx/Docker chưa. Máy đang chạy dịch vụ khác của người dùng ⇒ KHÔNG đụng cổng/cấu hình của chúng.

## 3. Cài đặt không tương tác (Ubuntu/Debian)

```bash
export DEBIAN_FRONTEND=noninteractive
sudo -n apt-get update -y && sudo -n apt-get install -y ca-certificates curl git ufw fail2ban
curl -fsSL https://get.docker.com | sudo -n sh
sudo -n usermod -aG docker "$USER"          # hiệu lực ở phiên ssh MỚI
```
Fedora/RHEL: `dnf install -y`. Alpine: `apk add --no-cache`. Luôn cờ `-y`.

## 4. Bảo mật tối thiểu cho server mới

- User riêng để deploy, không dùng root hằng ngày.
- Chỉ đăng nhập bằng key: file `/etc/ssh/sshd_config.d/01-hardening.conf` (tên `01-` để thắng các file cloud-init)
  với `PasswordAuthentication no`, `KbdInteractiveAuthentication no`, `PermitRootLogin prohibit-password`.
  **Chỉ làm sau khi đã chắc key vào được**, và kiểm bằng `sudo sshd -T | grep -i passwordauthentication`, không bằng `cat` file.
  Giữ phiên ssh đang mở khi reload sshd — sai là tự khoá mình ngoài cửa.
- Tường lửa: `ufw allow OpenSSH && ufw allow 80,443/tcp && ufw --force enable`. KHÔNG mở cổng DB.
  Docker tự mở cổng qua iptables và BỎ QUA ufw — đừng `ports:` cho DB trong compose.
- `fail2ban` chặn dò mật khẩu; cập nhật bảo mật `unattended-upgrades`.

## 5. Vận hành hằng ngày

- Log: `docker compose logs --tail=100 -f app` (nhớ không dùng `-f` trong lệnh của bạn — nó không bao giờ kết thúc; dùng `--tail`).
- Tài nguyên: `docker stats --no-stream`, `df -h`, `free -h`.
- Đĩa đầy: `docker system df` rồi `docker image prune -f`, `docker builder prune -f`, `journalctl --vacuum-size=200M`.
  `docker system prune -a` và mọi thứ có `--volumes` ⇒ HỎI người dùng trước.
- Backup DB (chạy định kỳ bằng cron):
  Postgres `docker compose exec -T db pg_dump -U postgres app | gzip > /backup/app-$(date +%F).sql.gz`;
  MySQL `mysqldump`; SQL Server `sqlcmd ... -Q "BACKUP DATABASE [App] TO DISK='/var/opt/mssql/backup/app.bak'"`.
  Một bản backup chưa từng thử khôi phục thì chưa phải backup.
- Tự khởi động lại: `restart: unless-stopped` trong compose + `systemctl enable docker`.

## 6. Máy ở nhà / sau NAT / mạng chặn cổng

Máy ở nhà không có IP công khai ⇒ không vào thẳng được từ internet. Cách: Cloudflare Tunnel (`cloudflared`), Tailscale,
hoặc đường hầm ngược qua một VPS (`ssh -R`). Mạng trường/công ty chặn cổng 22 ⇒ cho sshd nghe thêm cổng 443/993 bằng một
service riêng (Ubuntu 24.04 bật `ssh.socket`: sửa `Port` trong sshd_config KHÔNG có tác dụng — kiểm `systemctl is-enabled ssh.socket`).

## 7. Cho người khác dùng chung máy

Đừng cho người khác quyền `docker` trên máy đang giữ dữ liệu/khoá quan trọng — nhóm docker ≈ root. Dựng máy ảo riêng
(KVM/virt-manager, Multipass, Proxmox) hoặc VPS riêng cho họ, rồi mới cấp user + SSH key trong máy ảo đó.

## 8. Những việc KHÔNG tự làm khi chưa được đồng ý

Xoá dữ liệu/volume, restart dịch vụ người khác đang dùng, đổi cấu hình SSH/tường lửa của máy đang chạy sản xuất,
reboot máy. Nói rõ tác động, đưa lệnh, chờ người dùng gật.
