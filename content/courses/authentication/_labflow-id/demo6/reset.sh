# demo6/reset.sh — lesson 6.3: password reset ends every session. v0.6 on :4800.
MAIL=${LFID_MAIL_DIR:?set LFID_MAIL_DIR}; rm -f "$MAIL"/* 2>/dev/null
rm -f /tmp/lfid-an.jar
echo '$ # An is signed in (session + refresh cookie):'
curl -s -o /dev/null -c /tmp/lfid-an.jar localhost:4800/sign-in -H 'content-type: application/json' \
  -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
curl -s -b /tmp/lfid-an.jar localhost:4800/me | node -e 'const u=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log("  /me →", u.email)'
echo
echo '$ curl -s -X POST localhost:4800/forgot-password  (email: an@student.labflow.example)'
curl -s localhost:4800/forgot-password -H 'content-type: application/json' -d '{"email":"an@student.labflow.example"}'; echo
sleep 0.2; TOKEN=$(grep -ohE 'token=lfid_reset_[A-Za-z0-9_-]+' "$MAIL"/*an_student* | head -1 | cut -d= -f2)
echo '$ # the reset email (one-time link, 15 minutes):'
grep -hE 'reset\?token=' "$MAIL"/*an_student* | sed -E 's/(token=lfid_reset_.{8})[A-Za-z0-9_-]*/\1…/'
echo
echo '$ curl -s -X POST localhost:4800/reset-password  (token + a new password)'
curl -s localhost:4800/reset-password -H 'content-type: application/json' -d "{\"token\":\"$TOKEN\",\"newPassword\":\"an-brand-new-pass-2026\"}"; echo
echo
echo '$ # An’s old refresh cookie is now dead — every session and family was revoked:'
curl -s -b /tmp/lfid-an.jar -X POST localhost:4800/refresh; echo
echo '$ # the reset link cannot be used a second time:'
curl -s localhost:4800/reset-password -H 'content-type: application/json' -d "{\"token\":\"$TOKEN\",\"newPassword\":\"another-new-one-2026\"}"; echo
