# 14.4 · nft-vps: máy chủ OpenVPN chỉ nghe 127.0.0.1:1194 — người ngoài tới bằng cổng 443, sslh nhận ra OpenVPN và chuyển vào
mkdir -p /etc/openvpn/lab; cd /etc/openvpn/lab
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -days 30 -subj /CN=vps-vpn -keyout server.key -out server.crt 2>/dev/null
openssl x509 -in server.crt -noout -fingerprint -sha256 | cut -d= -f2 > server.fp
cat > server.conf <<CFG
local 127.0.0.1
port 1194
proto tcp-server
dev tun
topology subnet
server 10.67.0.0 255.255.255.0
dh none
cert server.crt
key server.key
peer-fingerprint $(cat client.fp)
push "redirect-gateway def1"
push "dhcp-option DNS 198.18.0.53"
CFG
openvpn --config server.conf --daemon --log /var/log/ovpn.log
iptables -t nat -A POSTROUTING -s 10.67.0.0/24 -o net0 -j MASQUERADE
@ sleep 1
ss -4tlnp | grep -E ':(443|1194) ' | awk '{print $4, $6}'
