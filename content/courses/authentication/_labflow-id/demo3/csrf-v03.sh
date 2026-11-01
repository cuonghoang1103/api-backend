# demo3/csrf-v03.sh — lesson 3.4: LabFlow ID v0.3's layer 2 on the wire. Same cookie, same body — only the browser's metadata changes.
rm -f /tmp/lfid-an.jar
curl -s -o /dev/null -c /tmp/lfid-an.jar localhost:4800/sign-in -H 'content-type: application/json' \
  -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
post() { printf '%-40s → ' "$1"; shift; curl -s -w ' %{http_code}\n' -b /tmp/lfid-an.jar localhost:4800/me/email -H 'content-type: application/json' "$@" -d '{"email":"an@student.labflow.example"}'; }
post 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-Site: cross-site'
post 'Sec-Fetch-Site: same-site' -H 'Sec-Fetch-Site: same-site'
post 'Origin: http://127.0.0.1:4801 (old browser)' -H 'Origin: http://127.0.0.1:4801'
post 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Site: same-origin'
post 'no browser headers (curl, a mobile app)'
