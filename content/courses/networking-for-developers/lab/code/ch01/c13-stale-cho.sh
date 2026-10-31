# Ch1 · 1.4 — KHÔNG có gratuitous ARP: client2 vừa đổi MAC lần nữa (…:01:cc) mà không báo ai. Máy client ping mỗi giây
# (mỗi lần chờ tối đa 1 s) và chỉ in một dòng khi kết quả hoặc trạng thái mục ARP THAY ĐỔI.
ip neigh show 10.10.1.11
for i in $(seq 1 90); do if ping -c 1 -W 1 10.10.1.11 >/dev/null; then r=reply; else r=LOST; fi; s=$(ip neigh show 10.10.1.11 | awk '{print $5, $NF}'); [ "$r $s" != "$prev" ] && echo "ping $i: $r | $s"; prev="$r $s"; [ $r = reply ] && break; done
