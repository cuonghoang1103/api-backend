# 14.1 · MacBook (nft-mac) vào SSID TRUONG-DANGKY với "Địa chỉ Wi-Fi riêng: Cố định" (mỗi SSID một MAC riêng)
cat /run/mac-phan-cung
ip -br link show dk; ip -br link show sv
bash /lab/k/moi-truong/truong/vao-ssid.sh dk
ip -br addr show dk; ip route; cat /etc/resolv.conf
curl -sI http://captive.apple.com/hotspot-detect.html | head -3
curl -s http://10.20.1.1/api
curl -sS --cacert /ca/ca.pem https://captive.apple.com/
curl -s -d "user=SE12345&pass=fpt@2026" http://portal.truong.test/login
