# Lab 2 · R5 — triệu chứng sự cố A, nhìn từ laptop
curl -sS -m 3 -o /dev/null http://labflow.test/; echo "curl exit code $?"
ping -4 -c 1 labflow.test
traceroute -n -q 1 -N 1 -m 7 203.0.113.10
traceroute -n -q 1 -N 1 -m 5 203.0.113.100
