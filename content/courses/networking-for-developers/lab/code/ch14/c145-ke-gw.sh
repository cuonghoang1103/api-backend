# 14.5 · nft-gw: với trường, lưu lượng của người lạ mang IP + MAC của laptop — tức tài khoản SE12345 của BẠN
cat /run/truong/dang-ky.tsv
conntrack -L -p tcp --orig-src 10.20.2.159 --dport 80 2>/dev/null | grep -oE "src=[0-9.]+ dst=[0-9.]+ sport=[0-9]+ dport=80" | head -3
