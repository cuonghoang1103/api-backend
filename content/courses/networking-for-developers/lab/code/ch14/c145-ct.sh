# 14.5 · nft-win: bảng conntrack — mỗi kết nối của điện thoại là một dòng "bên trong ↔ bên ngoài"
conntrack -L -p tcp --orig-src 192.168.137.50 2>/dev/null | grep -oE "src=[0-9.]+ dst=[0-9.]+ sport=[0-9]+ dport=[0-9]+" | head -4
conntrack -C
