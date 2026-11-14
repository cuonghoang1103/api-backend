# 14.5 · nft-win: ai đang dùng điểm phát của mình? (bảng hàng xóm của card hs)
ip neigh show dev hs | grep -v FAILED
conntrack -L --orig-src 192.168.137.66 2>/dev/null | grep -oE "src=[0-9.]+ dst=[0-9.]+ sport=[0-9]+ dport=[0-9]+" | head -2
