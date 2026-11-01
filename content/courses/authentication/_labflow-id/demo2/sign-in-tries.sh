# demo2/sign-in-tries.sh — lessons 2.3 and 2.4: existing accounts sign in to v0.2 (server on :4800).
si() { curl -s -w ' %{http_code}\n' localhost:4800/sign-in -H 'content-type: application/json' -d "$1" | sed -E 's/(lfid_ses_.{8})[^"]*/\1…/'; }
si '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
si '{"email":"binh@student.labflow.example","password":"123456"}'
si '{"email":"An@Student.LabFlow.example ","password":"an-lab-2026"}'
si '{"email":"an@student.labflow.example","password":"wrong-password-1"}'
si '{"email":"nobody@student.labflow.example","password":"wrong-password-1"}'
head -c 20000 /dev/zero | tr '\0' 'a' | (printf '{"email":"an@student.labflow.example","password":"'; cat; printf '"}') \
  | curl -s -o /dev/null -w 'a 20 kB password → %{http_code}\n' localhost:4800/sign-in -H 'content-type: application/json' --data-binary @-
