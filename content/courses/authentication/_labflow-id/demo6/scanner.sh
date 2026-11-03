# demo6/scanner.sh — lesson 6.2: an email scanner (link prefetch) must not burn a one-time token, and sign-up must not
# leak which emails exist. v0.6 on :4800.
MAIL=${LFID_MAIL_DIR:?set LFID_MAIL_DIR}; rm -f "$MAIL"/* 2>/dev/null
curl -s -o /dev/null localhost:4800/sign-up -H 'content-type: application/json' \
  -d '{"email":"scan-me@student.labflow.example","name":"Scan Me","password":"zephyr-lab-canyon-2026-qwk"}'
sleep 0.2; TOKEN=$(grep -ohE 'token=lfid_verify_[A-Za-z0-9_-]+' "$MAIL"/*scan* | head -1 | cut -d= -f2)
echo '$ # a mail scanner PREFETCHES the link (GET) — it is safe and consumes nothing:'
curl -s "localhost:4800/verify-email?token=$TOKEN" | tr -d '\n' | sed -E 's/value="[A-Za-z0-9_-]{8}[A-Za-z0-9_-]*"/value="lfid_verify_…"/'; echo
echo
echo '$ # the real user clicks (POST) — now the token is consumed:'
curl -s -X POST localhost:4800/verify-email -H 'content-type: application/json' -d "{\"token\":\"$TOKEN\"}"; echo
echo
echo '$ # sign up again with an email that already exists — same 202, no "taken" leak:'
curl -s localhost:4800/sign-up -H 'content-type: application/json' \
  -d '{"email":"an@student.labflow.example","name":"Not An","password":"zephyr-lab-canyon-2026-qwk"}'; echo
echo '$ # and the mailbox shows a "you already have an account" note instead of a verify link:'
sleep 0.2; grep -h '^Subject:' "$MAIL"/*an_student* | head -1
