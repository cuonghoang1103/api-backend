# 14.2 · nft-win: thử lại từng thứ
time nc -vz -w 3 vpn.test 443
nc -vz -w 3 198.18.0.10 22
nc -w 3 198.18.0.10 993
echo ping | nc -u -w 2 game.test 27015; echo "exit=$?"
curl -s -m 3 --cacert /ca/ca.pem https://game.test/
