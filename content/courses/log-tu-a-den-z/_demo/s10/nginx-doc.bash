# 10.2 — Đọc access/error log của nginx từng trường
head -n 1 logs/access.log
awk -F'"' 'NR == 1 {print "[1] truoc dau nhay :", $1; print "[2] request line    :", $2; print "[3] status bytes    :", $3; print "[4] referer         :", $4; print "[5] user agent      :", $6; print "[6] them            :", $7}' logs/access.log
awk '{for (i = 1; i <= NF; i++) if ($i ~ /^rt=/) print substr($i, 4), $9, $7}' logs/access.log | sort -rn | head -n 5
awk '{split($7, p, "?"); for (i = 1; i <= NF; i++) if ($i ~ /^rt=/) {s[p[1]] += substr($i, 4); n[p[1]]++}} END {for (k in s) if (n[k] >= 5) printf "%-16s %4d req  tb %.3f s\n", k, n[k], s[k] / n[k]}' logs/access.log | sort -k4 -rn
grep -E '" (499|502|504) ' logs/access.log | awk '{print $9, $7, $(NF-2), $(NF-1)}' | sort -u -k1,1
head -n 2 logs/error.log
sed -E 's/^[0-9\/]+ [0-9:]+ \[([a-z]+)\] [0-9]+#[0-9]+: (\*[0-9]+ )?/\1 /; s/ \(.*//; s/,.*//; s/"[^"]*"/"…"/g' logs/error.log | sort | uniq -c | sort -rn
head -n 1 logs/access.json | jq .
jq -r 'select(.status >= 500) | [.status, (.uri | split("?")[0] | sub("/[0-9]+$"; "/:id"))] | @tsv' logs/access.json | sort | uniq -c | sort -rn
