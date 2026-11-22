jq -r '.level' app/app.jsonl | sort | uniq -c
jq -r 'select(.level >= 50) | .msg' app/app.jsonl | sort | uniq -c
grep -o '\[[a-z]*\]' incident/nginx-error.log | sort | uniq -c
grep -o ' [A-Z]*:  ' incident/postgresql.log | sort | uniq -c
jq -r '{"10":"trace","20":"debug","30":"info","40":"warn","50":"error","60":"fatal"}[.level | tostring]' app/app.jsonl | sort | uniq -c
echo "auth.info = <$(( 4 * 8 + 6 ))>   daemon.err = <$(( 3 * 8 + 3 ))>   local0.warning = <$(( 16 * 8 + 4 ))>"
echo "<86> → facility $(( 86 / 8 )), severity $(( 86 % 8 ))"
