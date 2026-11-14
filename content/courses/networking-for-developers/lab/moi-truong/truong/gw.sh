#!/bin/bash
# gw.sh — "bộ điều khiển Wi-Fi" của trường trong lab: DHCP + DNS (dnsmasq), trang đăng nhập (portal.py), tường lửa + NAT (iptables).
#   dk0 10.20.1.1 = SSID TRUONG-DANGKY: chỉ có trang đăng nhập, KHÔNG chuyển tiếp ra ngoài.
#   sv0 10.20.2.1 = SSID TRUONG-SV: chỉ MAC đã đăng ký mới được chuyển tiếp ra net0 (198.18.0.1 = "Internet").
# Luật chặn của bài 14.2 nằm ở chuỗi CHAN (rỗng lúc đầu) và /run/truong/dns/*.conf — kịch bản bài 14.2 tự bật/tắt.
set -e
mkdir -p /run/truong/dns /run/truong/portal
: > /run/truong/dang-ky.tsv

# ── tường lửa ──
iptables -P FORWARD DROP
iptables -N CHAN                      # luật chặn của trường (bài 14.2)
iptables -N DADK                      # MAC đã đăng ký (portal.py thêm/gỡ)
iptables -A FORWARD -i sv0 ! -s 10.20.2.0/24 -j DROP   # chống giả nguồn (14.5): chỉ nhận địa chỉ nguồn thuộc dải của SSID — gói 192.168.137.x
                                                      # (điểm phát KHÔNG NAT) bị bỏ, như bộ điều khiển thật (IP source guard / BCP 38)
iptables -A FORWARD -i sv0 -j CHAN   # luật chặn xét MỌI gói (kể cả gói giữa kết nối — ClientHello của TLS nằm ở đó), TRƯỚC dòng ESTABLISHED
iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -i dk0 -j DROP    # mạng đăng ký: không bao giờ ra ngoài
iptables -A FORWARD -i sv0 -j DADK
iptables -t nat -N DADK_NAT
# SSID đăng ký: MỌI HTTP/HTTPS (tới bất kỳ đâu) bị chuyển về trang đăng nhập — đây là "captive" (bị bắt giữ)
iptables -t nat -A PREROUTING -i dk0 -p tcp --dport 80 ! -d 10.20.1.1 -j DNAT --to-destination 10.20.1.1:8080
iptables -t nat -A PREROUTING -i dk0 -p tcp --dport 443 ! -d 10.20.1.1 -j DNAT --to-destination 10.20.1.1:8443
# SSID sinh viên: máy CHƯA đăng ký ⇒ HTTP về trang "thiết bị chưa đăng ký"; máy đã đăng ký thì RETURN (đi tiếp bình thường)
iptables -t nat -A PREROUTING -i sv0 -j DADK_NAT
iptables -t nat -A DADK_NAT -p tcp --dport 80 ! -d 10.20.2.1 -j DNAT --to-destination 10.20.2.1:8081
iptables -t nat -A POSTROUTING -o net0 -j MASQUERADE   # cả trường ra Internet bằng MỘT địa chỉ: 198.18.0.1

# ── DHCP + DNS ──
cat > /run/truong/dnsmasq.conf <<'EOF'
interface=dk0
interface=sv0
bind-interfaces
no-resolv
no-hosts
filter-AAAA
# dnsmasq mặc định "ping thử" địa chỉ trước khi cấp (máy khách phải hỏi lại 1–3 lần) — lab tắt cho output gọn
no-ping
dhcp-authoritative
dhcp-range=set:dk,10.20.1.100,10.20.1.199,255.255.255.0,2h
dhcp-range=set:sv,10.20.2.100,10.20.2.199,255.255.255.0,2h
dhcp-option=tag:dk,option:router,10.20.1.1
dhcp-option=tag:dk,option:dns-server,10.20.1.1
dhcp-option=tag:sv,option:router,10.20.2.1
dhcp-option=tag:sv,option:dns-server,10.20.2.1
# RFC 8910: báo cho máy khách "mạng này có trang đăng nhập, API ở đây" (option 114)
dhcp-option=tag:dk,114,"http://10.20.1.1/api"
address=/captive.apple.com/198.18.0.10
address=/www.msftconnecttest.com/198.18.0.10
# mọi tên *.test (news, social, game, phim, cado…) ở máy web; tên dài hơn (vpn.test, portal.truong.test) thắng tên ngắn
address=/test/198.18.0.10
address=/vpn.test/198.18.0.20
address=/portal.truong.test/10.20.1.1
# 14.3: máy chủ thuê của sinh viên (vps.example — tên ví dụ RFC 2606, không phải VPS thật nào)
address=/vps.example/198.18.0.30
dhcp-leasefile=/run/truong/dnsmasq.leases
log-dhcp
log-queries
log-facility=/run/truong/dnsmasq.log
conf-dir=/run/truong/dns/,*.conf
EOF
dnsmasq -C /run/truong/dnsmasq.conf

# ── trang đăng nhập + trang chặn ──
openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj "/CN=portal.truong.test" -addext "subjectAltName=DNS:portal.truong.test" \
  -keyout /run/truong/portal/key.pem -out /run/truong/portal/cert.pem 2>/dev/null
python3 /lab/k/moi-truong/truong/portal.py > /run/truong/portal.log 2>&1 &
exec sleep infinity
