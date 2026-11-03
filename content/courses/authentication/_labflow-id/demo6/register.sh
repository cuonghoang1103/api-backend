# demo6/register.sh — lesson 6.1: register a new account (v0.6 on :4800). The account is UNVERIFIED until it proves its email.
MAIL=${LFID_MAIL_DIR:?set LFID_MAIL_DIR}; rm -f "$MAIL"/* 2>/dev/null
echo '$ curl -s -X POST localhost:4800/sign-up  (email: newbie@student.labflow.example)'
curl -s localhost:4800/sign-up -H 'content-type: application/json' \
  -d '{"email":"newbie@student.labflow.example","name":"New Bie","password":"zephyr-lab-canyon-2026-qwk"}'; echo
echo
echo '$ # the verification email that landed in the dev mailbox:'
sleep 0.2; cat "$MAIL"/*newbie* | sed -E 's/(token=lfid_verify_.{8})[A-Za-z0-9_-]*/\1…/'
TOKEN=$(grep -ohE 'token=lfid_verify_[A-Za-z0-9_-]+' "$MAIL"/*newbie* | head -1 | cut -d= -f2)
echo
echo '$ # the user clicks the link and confirms (POST consumes the one-time token):'
curl -s -X POST localhost:4800/verify-email -H 'content-type: application/json' -d "{\"token\":\"$TOKEN\"}"; echo
echo '$ # clicking the same link again — the token is single-use:'
curl -s -X POST localhost:4800/verify-email -H 'content-type: application/json' -d "{\"token\":\"$TOKEN\"}"; echo
