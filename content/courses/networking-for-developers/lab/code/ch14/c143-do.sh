# 14.3 · góc kẻ xấu — nft-ke dò mật khẩu VPS qua cổng 993 (như bot quét SSH khắp Internet)
for u in root admin sv; do ssh -p 993 -o BatchMode=yes -o PubkeyAuthentication=no -o StrictHostKeyChecking=accept-new $u@vps.example true; done
