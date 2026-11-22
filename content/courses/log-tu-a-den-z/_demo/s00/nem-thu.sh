grep -c ' 401 ' web/access.log
grep ' 401 ' web/access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 3
grep '^203.0.113.66 ' web/access.log | grep -v ' 401 '
