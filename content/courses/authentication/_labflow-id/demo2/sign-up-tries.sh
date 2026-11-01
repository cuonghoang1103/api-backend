# demo2/sign-up-tries.sh — lesson 2.4: four new passwords against LabFlow ID v0.2's policy (server on :4800).
for pw in '123456' 'LabFlow2026!!!!!' 'iloveyouiloveyou' 'hoa sen nở giữa đầm lầy tháng năm'; do
  curl -s -w ' %{http_code}' localhost:4800/sign-up -H 'content-type: application/json' \
    -d "{\"email\":\"sv$RANDOM@student.labflow.example\",\"name\":\"SV\",\"password\":\"$pw\"}"
  echo "  ← \"$pw\""
done
