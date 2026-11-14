# 14.4 · nft-win ở trường: OpenVPN qua TCP 443 — cổng trường phải mở cho web
cd /etc/openvpn/lab
cat > client.conf <<CFG
client
remote vps.example 443 tcp
dev tun
cert client.crt
key client.key
peer-fingerprint $(cat server.fp)
CFG
openvpn --config client.conf --daemon --log /tmp/ovpn.log
@ for i in $(seq 1 20); do grep -q "Initialization Sequence Completed" /tmp/ovpn.log && break; sleep 0.5; done
grep -oE "TCP connection established.*|Initialization Sequence Completed" /tmp/ovpn.log
ip -br addr show tun0
ip route | head -3
curl -s http://news.test/
curl -sS -m 5 --cacert /ca/ca.pem https://social.test/
cat /etc/resolv.conf
dig +short phim.test; echo "(dig xong)"
