# Ch2 · 2.2 — một hop im lặng: "* * *" ở giữa nhưng đích vẫn tới
traceroute -n -w 1 203.0.113.10
mtr -n -r -c 10 203.0.113.10
curl -s -m 3 http://203.0.113.10/
