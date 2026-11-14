# 14.2 · nft-win: cùng một IP, hai tên — một qua, một bị cắt
dig +short news.test social.test
curl -s -m 3 --cacert /ca/ca.pem https://news.test/
curl -sS -m 3 --cacert /ca/ca.pem https://social.test/
curl -s -m 3 http://social.test/
