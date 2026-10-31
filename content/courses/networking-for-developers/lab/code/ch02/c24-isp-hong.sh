# Ch2 · 2.4 — IPv6 của nhà mạng hỏng "lặng lẽ": gói v6 tới DC bị vứt, không báo lỗi gì
ip6tables -I FORWARD -d 2001:db8:d::/48 -j DROP
ip6tables -S FORWARD
