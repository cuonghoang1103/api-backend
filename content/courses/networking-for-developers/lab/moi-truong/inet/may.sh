#!/bin/bash
# may.sh <gw4> <gw6|""> <dns> — một máy trạm thường: tuyến mặc định qua router của lab (thay cổng Docker .254), DNS = resolver ISP.
ip route replace default via "$1"
[ -n "$2" ] && ip -6 route replace default via "$2"
echo "nameserver $3" > /etc/resolv.conf
exec sleep infinity
