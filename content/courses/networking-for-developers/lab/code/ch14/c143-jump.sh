# 14.3 · nft-win ở trường: vào máy nhà = nhảy qua VPS (ProxyJump), rồi đi đường hầm 2222 về nhà
cat >> ~/.ssh/config <<'CFG'
Host nha
  HostName localhost
  Port 2222
  User sv
  ProxyJump vps
  HostKeyAlias may-nha
CFG
ssh nha 'echo "$(hostname): $(ip -4 -br addr show eth0)"'
ssh -v nha true 2>&1 | grep -E "ProxyJump|Connecting to|Authenticated to"
