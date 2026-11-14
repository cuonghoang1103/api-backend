# 14.3 · nft-win: bản demo chạy ở laptop (127.0.0.1:3000), laptop nằm sau NAT của trường — đưa nó ra VPS bằng ssh -R
mkdir -p /tmp/demo && echo "Do an nhom 3 - ban demo chay tren laptop o truong" > /tmp/demo/index.html
@ setsid python3 -m http.server 3000 --bind 127.0.0.1 --directory /tmp/demo > /tmp/demo.log 2>&1 < /dev/null &
@ sleep 1
curl -s http://127.0.0.1:3000/
ssh -f -N -R 8080:localhost:3000 vps
