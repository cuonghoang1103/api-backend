# Lab 11 — ĐIỀU TRA (lời giải mẫu): lần theo 192.168.56.142 trong buổi tối 24/11 từ log router gửi về lab7, ufw.log của lab7 và pfirewall.log của Windows.
# Chạy NGAY sau lab11-dung.bash: python3 cong-cu/chay-vm.py lab11.bash
sudo wc -l /var/log/remote/wrt-nha.log /var/log/ufw.log; sudo head -n 2 /var/log/remote/wrt-nha.log
sudo grep -E "DHCP(ACK|REQUEST).*192.168.56.142" /var/log/remote/wrt-nha.log
sudo awk '$6 ~ /^query\[/ && $9 == "192.168.56.142" {k = split($7, n, "."); print n[k-1] "." n[k]}' /var/log/remote/wrt-nha.log | sort | uniq -c | sort -rn
sudo awk '$6 == "query[A]" && $7 == "update.cdn-lab.test" {print substr($1, 12, 8)}' /var/log/remote/wrt-nha.log | tr '\n' ' '; echo
sudo grep "SRC=192.168.56.142" /var/log/ufw.log | grep -oE "^\S+|DPT=[0-9]+" | paste - - | awk '{print substr($1, 12, 8), $2}'
sudo grep "Chan-telnet" /var/log/remote/wrt-nha.log | grep -oE "^\S+|SRC=\S+|DST=\S+|DPT=[0-9]+" | paste - - - - | awk '{print substr($1, 12, 8), $2, $3, $4}'
sudo grep -E "miniupnpd.*(AddPortMapping|redirecting)" /var/log/remote/wrt-nha.log | sed -E 's/^.{11}(.{8})\S* \S+ /\1 /'
sudo grep -E "dropbear.*(Bad password|Child connection from 192.168.56.142)" /var/log/remote/wrt-nha.log | sed -E 's/^.{11}(.{8})\S* \S+ /\1 /'
sudo awk '$6 == "query[TXT]" && $9 == "192.168.56.142" {print $7}' /var/log/remote/wrt-nha.log
sudo awk '$6 == "query[TXT]" && $9 == "192.168.56.142" {split($7, n, "."); printf "%s", n[1]}' /var/log/remote/wrt-nha.log | tr a-z A-Z | awk '{ s = $0; while (length(s) % 8) s = s "="; print s }' | base32 -d; echo
@win Get-Content "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log" | Select-String '192.168.56.142 192.168.56.177' | Select-Object -Last 2 | ForEach-Object Line
{ sudo awk '{t = substr($1, 12, 8)} $4 ~ /^DHCPACK/ && $5 == "192.168.56.142" {print t, "router  DHCP: android-7f3a nhận IP .142"} $6 == "query[A]" && $7 == "update.cdn-lab.test" && !b++ {print t, "router  DNS: lần gọi về đầu tiên update.cdn-lab.test"} /Chan-telnet/ && /SRC=192.168.56.142/ && !t2++ {print t, "router  tường lửa chặn telnet ra Internet"} /AddPortMapping: ext port 2323/ {print t, "router  UPnP mở cổng 2323 từ Internet về máy"} $6 == "query[TXT]" && !x++ {print t, "router  DNS TXT dài bắt đầu (exfil-lab.test)"} /Bad password/ && !p++ {print t, "router  thử mật khẩu SSH của router"}' /var/log/remote/wrt-nha.log; sudo awk '/SRC=192.168.56.142/ && !u++ {print substr($1, 12, 8), "lab7    ufw chặn quét cổng"}' /var/log/ufw.log; } | sort
