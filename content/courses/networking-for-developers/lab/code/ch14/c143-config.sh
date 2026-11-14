# 14.3 · nft-win: để ssh TỰ chọn cổng theo mạng đang đứng — thử viết khối Match SAU khối Host
cat > ~/.ssh/config <<'CFG'
Host vps
  HostName vps.example
  User sv
  Port 22
Match host vps,vps.example exec "ip -4 -br addr | grep -q ' 10\.20\.2\.'"
  Port 993
CFG
ssh -G vps 2>/dev/null | grep -E '^(hostname|port) '
# ssh lấy giá trị ĐẦU TIÊN nó gặp ⇒ khối Match phải đứng TRƯỚC
cat > ~/.ssh/config <<'CFG'
# Ở trường (IP 10.20.2.x) ⇒ cổng 993; ở nơi khác ⇒ 22
Match host vps,vps.example exec "ip -4 -br addr | grep -q ' 10\.20\.2\.'"
  Port 993
Host vps
  HostName vps.example
  User sv
  Port 22
  ServerAliveInterval 30
  ServerAliveCountMax 3
Host *
  StrictHostKeyChecking accept-new
CFG
ssh -G vps 2>/dev/null | grep -E '^(hostname|port|serveraliveinterval) '
ssh vps 'echo "vao duoc $(hostname) qua cong ${SSH_CONNECTION##* }"'
