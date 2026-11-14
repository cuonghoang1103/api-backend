# 14.6 · router nhà: bật UPnP (miniupnpd) — để thiết bị trong nhà TỰ xin mở cổng, không cần ai vào trang quản trị
printf "ext_ifname=wan\nlistening_ip=lan\nport=5000\nenable_upnp=yes\nenable_natpmp=no\nsecure_mode=no\n" > /tmp/mu.conf
miniupnpd -f /tmp/mu.conf -d > /tmp/mu.log 2>&1 &
sleep 2; grep -m1 "Public IP" /tmp/mu.log | cut -d' ' -f2-
