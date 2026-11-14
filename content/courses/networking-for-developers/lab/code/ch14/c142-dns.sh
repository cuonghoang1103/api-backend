# 14.2 · nft-win sau khi bật chặn DNS
dig phim.test | grep -E "status|ANSWER:"
curl -sS -m 3 http://phim.test/
curl -s -m 3 http://cado.test/
dig @198.18.0.53 +short phim.test
curl -s -m 3 --resolve phim.test:80:198.18.0.10 http://phim.test/
