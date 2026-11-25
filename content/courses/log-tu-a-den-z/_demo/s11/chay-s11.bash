#!/usr/bin/env bash
# chay-s11.bash — chạy lại TOÀN BỘ output thật của Chương 11 (~25 phút; cần Docker + /dev/kvm; Internet cho apk/apt/ISO lần đầu).
# LAN ảo: cong-cu/may.bash (router OpenWrt 25.12.6 + lab7/keodo đĩa Ch7–8 + android-7f3a + Windows Server 2025 bản đánh giá).
# Lần đầu: may.bash len → (từ container) wrt-dau.sh qua 192.168.1.1 → wrt-them.sh → win-cai.bash (~25 phút, rồi touch ~/.rtq-lgz/c11/win.da-cai)
#          → lab7: apt install ufw tcpdump tshark nginx wireguard-tools openvpn easy-rsa; keodo: nmap iptables openvpn; android: tcpdump nmap sshpass iputils-ping.
# Thứ tự dưới đây là thứ tự đã chạy thật (router.bash khởi động lại router; lab11-dung.bash tua đồng hồ — lab11-tra-gio.bash trả lại).
set -euo pipefail
S=$(cd "$(dirname "$0")" && pwd); cd "$S"; C=cong-cu/ssh.cfg
bash cong-cu/may.bash bat; ssh -F $C wrt 'sh -s' < cong-cu/wrt-them.sh
python3 cong-cu/chay-vm.py router.bash
python3 ../s10/cong-cu/chay.py agh.bash "$S"
python3 cong-cu/chay-vm.py dns.bash; python3 cong-cu/chay-vm.py bt-11-2.bash
python3 cong-cu/chay-vm.py fw-win.bash; python3 cong-cu/chay-vm.py bt-11-3.bash
python3 cong-cu/chay-vm.py ufw.bash; sleep 200; python3 cong-cu/chay-vm.py bt-11-4.bash
python3 cong-cu/chay-vm.py pcap.bash; python3 cong-cu/chay-vm.py bt-11-5.bash
ssh -F $C lab7 'sudo tee /tmp/a.sh >/dev/null; sudo bash /tmp/a.sh' < vpn/chuan-bi-vpn.sh; ssh -F $C lab7 'sudo tee /tmp/b.sh >/dev/null; sudo bash /tmp/b.sh' < vpn/wg-tao.sh
for m in android keodo; do ssh -F $C lab7 "sudo cat /root/vpn-lab/$m-wg0.conf" | ssh -F $C $m 'sudo tee /etc/wireguard/wg0.conf >/dev/null; sudo chmod 600 /etc/wireguard/wg0.conf'
  ssh -F $C lab7 "sudo cat /root/vpn-lab/$m.ovpn" | ssh -F $C $m 'cat > ~/lab.ovpn; chmod 600 ~/lab.ovpn'; done
ssh -F $C lab7 'sudo ufw allow 51820/udp; sudo ufw allow 1194/udp'
python3 cong-cu/chay-vm.py vpn.bash; python3 cong-cu/chay-vm.py bt-11-6.bash
python3 cong-cu/chay-vm.py lab11-dung.bash; python3 cong-cu/chay-vm.py lab11.bash; python3 cong-cu/chay-vm.py lab11-tra-gio.bash
ssh -F $C lab7 'sudo cat /var/log/remote/wrt-nha.log' > lab11/mau/wrt-nha.log; ssh -F $C lab7 'sudo cat /var/log/ufw.log' > lab11/mau/ufw.log
ssh -F $C win 'Get-Content C:\Windows\System32\LogFiles\Firewall\pfirewall.log' | tr -d '\r' > lab11/mau/pfirewall.log
bash cong-cu/may.bash xuong
