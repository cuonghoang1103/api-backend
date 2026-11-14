# 14.6 · máy nhà (kiểu camera / NAS / game console): xin router mở cổng 9090 ⇒ 192.168.1.10:80 bằng UPnP
upnpc -a 192.168.1.10 80 9090 TCP 2>&1 | grep -E "ExternalIPAddress|AddPortMapping"
