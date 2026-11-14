# 14.3 · nft-win: ssh -D — một proxy SOCKS ở chính laptop; mọi kết nối qua nó chui trong đường hầm SSH cổng 993
ssh -f -N -D 1080 vps
curl -sS -m 5 --cacert /ca/ca.pem https://social.test/
curl -sS -m 5 --cacert /ca/ca.pem --socks5-hostname 127.0.0.1:1080 https://social.test/
curl -sS -m 5 --socks5 127.0.0.1:1080 http://phim.test/
curl -sS -m 5 --socks5-hostname 127.0.0.1:1080 http://phim.test/
