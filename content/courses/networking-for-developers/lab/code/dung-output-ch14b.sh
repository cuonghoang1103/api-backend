#!/bin/bash
# dung-output-ch14b.sh — chạy lại MỌI output Docker của bài 14.3–14.6 (output 14.1–14.2 là của dung-output-ch14.sh, KHÔNG đụng tới).
# Lab dựng MỚI từ đầu rồi đưa NGẦM về trạng thái cuối bài 14.2 (laptop win + ke đã đăng ký, trường bật mọi luật chặn) — không ghi output nào
# của 14.1–14.2. Thứ tự là một câu chuyện: (14.3) khoá SSH → bẫy socket activation → ssh993.service → 22 chết / 993 sống → ~/.ssh/config tự
# chọn cổng → -L CSDL → -R khoe demo → -D SOCKS (và SOCKS mở toang) → máy nhà sau CGNAT + đường hầm ngược + ProxyJump + autossh →
# DPI soi "SSH-2.0" ⇒ SSH bọc TLS qua sslh 443 → bot dò mật khẩu + bẫy thứ tự drop-in. (14.4) WireGuard ở nhà (split → full) → ở
# trường UDP bị bỏ → OpenVPN-TCP sau sslh 443 → rò DNS + vá → kill switch → VPN thấy hết → đo trễ/tốc độ (netem) → điện thoại QR.
#   GIU_LAB=1 ⇒ giữ lab · CHI=143 | CHI=144 ⇒ chỉ chạy output của một bài (phần dựng ngầm vẫn chạy).
set -e
cd "$(dirname "$0")/.."
M=moi-truong; X() { ./chay.sh "$@"; }
docker build -q -t net-lab-truong -f $M/Dockerfile.truong $M >/dev/null
docker compose -f $M/truong.yml -p nft down -v >/dev/null 2>&1 || true
docker compose -f $M/truong.yml -p nft up -d >/dev/null 2>&1; sleep 6
E() { docker exec "$@"; }
# ── trạng thái cuối 14.2 (ngầm) ──
E nft-win bash -c 'for c in dk sv; do ip link set $c down; ip link set $c address $(cat /run/mac-phan-cung); done
  bash /lab/k/moi-truong/truong/vao-ssid.sh dk >/dev/null; curl -s -d "user=SE12345&pass=fpt@2026" http://portal.truong.test/login >/dev/null
  bash /lab/k/moi-truong/truong/vao-ssid.sh sv >/dev/null'
E nft-ke bash -c 'for c in dk sv; do ip link set $c down; ip link set $c address $(cat /run/mac-phan-cung); done
  bash /lab/k/moi-truong/truong/vao-ssid.sh dk >/dev/null; curl -s -d "user=SE24680&pass=fpt@2026" http://portal.truong.test/login >/dev/null
  bash /lab/k/moi-truong/truong/vao-ssid.sh sv >/dev/null'
E nft-gw bash -c 'printf "address=/phim.test/\naddress=/cado.test/10.20.2.1\n" > /run/truong/dns/chan.conf; pkill dnsmasq; sleep 0.5; dnsmasq -C /run/truong/dnsmasq.conf
  iptables -A CHAN -p udp --dport 53 -j DROP; iptables -A CHAN -p tcp --dport 53 -j DROP
  iptables -A CHAN -p tcp --dport 443 -m string --string "social.test" --algo bm -j REJECT --reject-with tcp-reset
  iptables -A CHAN -d 198.18.0.20 -j DROP; iptables -A CHAN -p tcp -m multiport ! --dports 80,443,587,993 -j DROP; iptables -A CHAN -p udp -j DROP
  iptables -t mangle -A PREROUTING -i sv0 -m ttl --ttl-eq 63 -j DROP; iptables -t mangle -A PREROUTING -i sv0 -m ttl --ttl-eq 127 -j DROP'
[ "$(E nft-win ip -4 -br addr show sv | awk '{print $3}')" = 10.20.2.159/24 ] || { echo "nft-win không nhận 10.20.2.159 — DHCP đổi?"; exit 1; }
for i in $(seq 1 30); do E nft-vps systemctl is-system-running 2>/dev/null | grep -qE "running|degraded" && break; sleep 1; done
E nft-vps bash /lab/k/moi-truong/truong/vps.sh

# ── 14.3 ──
if [ -z "${CHI:-}" ] || [ "$CHI" = 143 ]; then
X nft-win ch14/c143-khoa.sh
PUB=$(E nft-win cat /root/.ssh/id_ed25519.pub)
for m in nft-vps nft-nha; do E $m bash -c "install -d -m 700 -o sv -g sv /home/sv/.ssh; echo '$PUB' > /home/sv/.ssh/authorized_keys; chown sv:sv /home/sv/.ssh/authorized_keys; chmod 600 /home/sv/.ssh/authorized_keys"; done
X nft-vps ch14/c143-bay.sh
X nft-vps ch14/c143-dichvu.sh
X nft-win ch14/c143-cong.sh
X nft-win ch14/c143-config.sh
# cùng laptop đem về nhà: chép khoá + config sang nft-lap
E nft-win tar -C /root -cf - .ssh | E -i nft-lap tar -C /root -xf -
E nft-lap bash -c 'rm -f /root/.ssh/known_hosts*'
X nft-lap ch14/c143-config-nha.sh
X nft-vps ch14/c143-L-vps.sh
X nft-win ch14/c143-L.sh
X nft-win ch14/c143-R.sh
X nft-lap ch14/c143-R-ban.sh c143-R-ban1
X nft-vps ch14/c143-R-vps.sh
X nft-win ch14/c143-R2.sh
X nft-lap ch14/c143-R-ban.sh c143-R-ban2
X nft-win ch14/c143-D.sh
X nft-gw ch14/c143-D-gw.sh
X nft-win ch14/c143-D-mo.sh
X nft-ke ch14/c143-D-ke.sh
X nft-rnha ch14/c143-cgnat.sh
X nft-vps ch14/c143-vao-nha.sh
E nft-nha bash -c 'ssh-keygen -q -t ed25519 -N "" -C "may-nha@tunnel" -f /root/.ssh/id_ed25519'
NPUB=$(E nft-nha cat /root/.ssh/id_ed25519.pub)
E nft-vps bash -c "install -d -m 700 -o tunnel -g tunnel /home/tunnel/.ssh; echo 'restrict,port-forwarding,permitlisten=\"localhost:2222\" $NPUB' > /home/tunnel/.ssh/authorized_keys; chown tunnel:tunnel /home/tunnel/.ssh/authorized_keys; chmod 600 /home/tunnel/.ssh/authorized_keys"
X nft-nha ch14/c143-ham-nha.sh
X nft-vps ch14/c143-ham-vps.sh
X nft-win ch14/c143-jump.sh
(sleep 2; E nft-rnha iptables -I FORWARD 1 -j DROP; sleep 45; E nft-rnha iptables -D FORWARD 1) &
X nft-nha ch14/c143-autossh.sh
wait
X nft-vps ch14/c143-autossh-vps.sh
X nft-gw ch14/c143-dpi-gw.sh
X nft-win ch14/c143-dpi.sh
X nft-gw ch14/c143-dpi-doc.sh
E nft-gw iptables -D CHAN 1    # gỡ luật DPI (bài sau không cần)
X nft-ke ch14/c143-do.sh
X nft-vps ch14/c143-do-vps.sh
E nft-win bash -c 'pkill -f "ssh -f -N" || true'
fi

# ── 14.4 ──
if [ -z "${CHI:-}" ] || [ "$CHI" = 144 ]; then
X nft-lap ch14/c144-khoa.sh
E nft-lap cat /etc/wireguard/laptop.pub | E -i nft-vps bash -c 'umask 077; mkdir -p /etc/wireguard; cat > /etc/wireguard/laptop.pub'
X nft-vps ch14/c144-vps.sh
E nft-vps cat /etc/wireguard/server.pub | E -i nft-lap bash -c 'cat > /etc/wireguard/server.pub'
X nft-lap ch14/c144-nha.sh
X nft-lap ch14/c144-tach.sh
E nft-lap tar -C /etc -cf - wireguard | E -i nft-win tar -C /etc -xf -     # cùng laptop mang tới trường
X nft-win ch14/c144-truong.sh
X nft-gw ch14/c144-truong-gw.sh
X nft-win ch14/c144-ovpn-khoa.sh
E nft-win cat /etc/openvpn/lab/client.fp | E -i nft-vps bash -c 'mkdir -p /etc/openvpn/lab; cat > /etc/openvpn/lab/client.fp'
X nft-vps ch14/c144-ovpn-vps.sh
E nft-vps cat /etc/openvpn/lab/server.fp | E -i nft-win bash -c 'cat > /etc/openvpn/lab/server.fp'
docker exec -d nft-gw bash -c 'timeout 30 tcpdump -U -i sv0 -n -w /tmp/dns.pcap "udp port 53"'; sleep 2
X nft-win ch14/c144-ovpn.sh
X nft-win ch14/c144-ovpn-dns.sh
sleep 1
X nft-gw ch14/c144-ovpn-gw.sh
X nft-win ch14/c144-kill-win.sh
E nft-rnha iptables -I FORWARD 1 -p udp --dport 51820 -j DROP
X nft-lap ch14/c144-kill-lap.sh
E nft-rnha iptables -D FORWARD 1
docker exec -d nft-vps bash -c 'timeout 15 tcpdump -U -i wg0 -n -w /tmp/thay.pcap "tcp port 80 or tcp port 443"'; sleep 2
X nft-lap ch14/c144-thay-lap.sh
sleep 1
X nft-vps ch14/c144-thay.sh
E nft-lap mkdir -p /etc/openvpn; E nft-win tar -C /etc/openvpn -cf - lab | E -i nft-lap tar -C /etc/openvpn -xf -
E nft-vps iperf3 -s -D
X nft-rnha ch14/c144-netem.sh
X nft-lap ch14/c144-do-nha.sh
X nft-rnha ch14/c144-netem2.sh
X nft-lap ch14/c144-do-nha.sh c144-do-nha-mat
E nft-rnha tc qdisc del dev wan root
X nft-vps ch14/c144-dt.sh
fi

[ -n "${GIU_LAB:-}" ] || docker compose -f $M/truong.yml -p nft down -v >/dev/null 2>&1
echo "XONG ch14b"
