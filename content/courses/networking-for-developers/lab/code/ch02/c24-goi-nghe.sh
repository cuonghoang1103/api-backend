# Ch2 · 2.4 — laptop gọi hai app trên server bằng IPv4 và IPv6
curl -s http://203.0.113.10:3000/
curl -sS -m 3 "http://[2001:db8:d::10]:3000/"; echo "curl exit code $?"
curl -s http://203.0.113.10:3001/
curl -s "http://[2001:db8:d::10]:3001/"
