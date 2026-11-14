# 14.1 · góc kẻ xấu — nft-ke trả lại MAC của chính nó, đăng nhập tài khoản riêng (SE24680) như một sinh viên bình thường
ip link set sv down; ip link set sv address $(cat /run/mac-phan-cung); ip link set dk address $(cat /run/mac-phan-cung)
bash /lab/k/moi-truong/truong/vao-ssid.sh dk >/dev/null; curl -s -d "user=SE24680&pass=fpt@2026" http://portal.truong.test/login
bash /lab/k/moi-truong/truong/vao-ssid.sh sv
sysctl net.ipv4.ip_forward
