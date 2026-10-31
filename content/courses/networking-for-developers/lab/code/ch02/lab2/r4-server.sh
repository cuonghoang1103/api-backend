# Lab 2 · R4 — khách hàng (máy chủ ngoài Internet) mở bản demo; rồi thử với điện thoại 4G
curl -s -m 3 http://198.51.100.2:8443/
nc -vz -w 3 198.51.100.200 8443
