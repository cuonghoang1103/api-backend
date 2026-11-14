# 14.3 · laptop ở trường (nft-win; trường chỉ mở TCP 80/443/587/993): cổng 22 và cổng 993 của CÙNG một VPS
ssh -o ConnectTimeout=5 sv@vps.example hostname
ssh -p 993 -o StrictHostKeyChecking=accept-new sv@vps.example hostname
ssh -v -p 993 sv@vps.example true 2>&1 | grep -E "Connecting to|Connection established|Remote protocol|Server host key|Authenticated to"
