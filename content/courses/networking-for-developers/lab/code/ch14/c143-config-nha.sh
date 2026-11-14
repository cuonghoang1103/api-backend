# 14.3 · cùng laptop, cùng ~/.ssh/config — nhưng đang ở nhà (nft-lap, mạng 192.168.1.x)
ip -4 -br addr show eth0
ssh -G vps 2>/dev/null | grep -E '^(hostname|port) '
ssh vps 'echo "vao duoc $(hostname) qua cong ${SSH_CONNECTION##* }"'
