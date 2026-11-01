# demo3/sign-in.sh — lesson 3.1: An signs in to v0.3 (server on :4800). The token arrives ONLY in Set-Cookie.
rm -f /tmp/lfid-an.jar
curl -s -i -c /tmp/lfid-an.jar localhost:4800/sign-in -H 'content-type: application/json' \
  -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}' | grep -E '^(HTTP|Set-Cookie|\{)' | sed -E 's/(lfid_ses_.{6})[^;]*/\1…/'
curl -s -b /tmp/lfid-an.jar localhost:4800/me; echo
