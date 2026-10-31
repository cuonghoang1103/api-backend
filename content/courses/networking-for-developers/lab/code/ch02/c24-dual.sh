# Ch2 · 2.4 — một tên, hai địa chỉ: curl thử IPv6 trước
dig +short labflow.test A
dig +short labflow.test AAAA
getent ahosts labflow.test
curl -sv -o /dev/null http://labflow.test/ 2>&1 | grep -E '^\* (Host|  Trying|Connected|Established)'
curl -s http://labflow.test/
