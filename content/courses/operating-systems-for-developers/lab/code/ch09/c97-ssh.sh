# @ Chương 9 · bài 9.7 — khoá SSH quá "mở" bị OpenSSH từ chối. Ảnh os-lab không có OpenSSH ⇒ dùng ảnh node:22-bookworm
# @ (đã có sẵn trên máy, chính là ảnh gốc Node của os-lab; có ssh 9.2) + phien gắn từ lab/moi-truong, người dùng node (uid 1000):
# @ docker run --rm --label oslab=1 --name os-c97s --hostname oslab --user node -v "$PWD/../moi-truong/phien.sh":/usr/local/bin/phien:ro -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 node:22-bookworm bash -c "bash /usr/local/bin/phien c97-ssh.sh 2>&1" | tr -d '\r'
# @ (tr -d '\r': OpenSSH in cảnh báo bằng CR LF như terminal; bỏ CR để file output đọc như màn hình)
ssh -V
ssh-keygen -q -t ed25519 -N '' -C deploy@cuongthai -f /tmp/deploy_key; ls -l /tmp/deploy_key*
chmod 644 /tmp/deploy_key; ssh-keygen -y -f /tmp/deploy_key
chmod 600 /tmp/deploy_key; ssh-keygen -y -f /tmp/deploy_key | cut -c1-60
