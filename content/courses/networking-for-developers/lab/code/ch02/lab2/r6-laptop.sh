# Lab 2 · R6 — triệu chứng sự cố B, nhìn từ laptop
curl -4 -sS -m 3 -o /dev/null http://203.0.113.10/; echo "curl exit code $?"
curl -6 -s -m 3 "http://[2001:db8:d::10]/" | tail -1
dig +time=2 +tries=1 +short labflow.test; echo "dig exit code $?"
traceroute -n -q 1 -N 1 -w 1 -m 4 203.0.113.10
