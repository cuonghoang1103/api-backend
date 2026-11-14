# 14.1 · MacBook TẮT "Địa chỉ Wi-Fi riêng" cho CẢ HAI SSID (cả hai card dùng MAC phần cứng) rồi đăng ký lại một lần
for c in dk sv; do ip link set $c down; ip link set $c address $(cat /run/mac-phan-cung); done
ip -br link show dk; ip -br link show sv
bash /lab/k/moi-truong/truong/vao-ssid.sh dk
curl -s -d "user=SE12345&pass=fpt@2026" http://portal.truong.test/login
bash /lab/k/moi-truong/truong/vao-ssid.sh sv
curl -s -m 3 http://news.test/
curl -sS -m 3 --cacert /ca/ca.pem https://news.test/
