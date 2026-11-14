# 14.2 · sau luật TTL: điện thoại (qua hotspot) rồi chính laptop
curl -sS -m 3 http://news.test/
ip -br addr show | grep -E "^(wlan0|sv)"
