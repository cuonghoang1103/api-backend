# 14.1 · laptop Windows (nft-win) cũng tắt địa chỉ ngẫu nhiên và đăng nhập CÙNG tài khoản SE12345
for c in dk sv; do ip link set $c down; ip link set $c address $(cat /run/mac-phan-cung); done
bash /lab/k/moi-truong/truong/vao-ssid.sh dk
curl -s -d "user=SE12345&pass=fpt@2026" http://portal.truong.test/login
bash /lab/k/moi-truong/truong/vao-ssid.sh sv
curl -s -m 3 http://news.test/
