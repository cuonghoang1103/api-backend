# Ch13 · 13.3 — TỐI ƯU, đo TRƯỚC/SAU. (1) Nén: cùng /big.html, client không gzip vs gzip. (2) Cache biên: MISS (origin 3s) vs HIT (tức thì).
echo "== compression: same /big.html, size in bytes =="
curl -s              -o /dev/null -w "  no-gzip:  %{size_download} bytes\n" http://10.10.2.10:8080/big.html
curl -s --compressed -o /dev/null -w "  gzip:     %{size_download} bytes\n" http://10.10.2.10:8080/big.html
echo "== edge cache: a slow (3s) origin response — MISS hits origin, HIT served at edge =="
curl -s -D - -o /dev/null -w "  time=%{time_total}s\n" http://10.10.2.10:8080/cached | grep -iE "x-cache|time="
curl -s -D - -o /dev/null -w "  time=%{time_total}s\n" http://10.10.2.10:8080/cached | grep -iE "x-cache|time="
