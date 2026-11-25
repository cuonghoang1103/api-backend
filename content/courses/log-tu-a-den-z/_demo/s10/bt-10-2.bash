awk '{for (i = 1; i <= NF; i++) if ($i ~ /^rt=/) {s[$9] += substr($i, 4); n[$9]++}} END {for (k in s) printf "%s %4d req  tb %.3f s\n", k, n[k], s[k] / n[k]}' logs/access.log | sort
grep '" 504 ' logs/access.log | grep -o 'rid=.*'
grep 'upstream timed out' logs/error.log | grep -o '\*[0-9]*'
grep -F '*111 ' logs/error.log
jq -s 'map(.uri |= split("?")[0]) | group_by(.uri) | map(select(length >= 5) | {uri: .[0].uri, n: length, tb: ((map(.rt) | add / length) * 1000 | round / 1000)}) | sort_by(-.tb) | .[] | "\(.uri) \(.n) req tb \(.tb) s"' -r logs/access.json
grep -c 'prematurely closed' logs/error.log; grep -c 'connect() failed' logs/error.log
