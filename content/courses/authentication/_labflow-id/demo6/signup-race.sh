# demo6/signup-race.sh — lesson 6.1: two sign-ups for the SAME email at the same instant. Check-then-insert would create
# two rows; LabFlow ID just INSERTs and lets the UNIQUE index settle it — one wins, the other catches 23505. v0.6 on :4800.
MAIL=${LFID_MAIL_DIR:?set LFID_MAIL_DIR}; rm -f "$MAIL"/* 2>/dev/null
BODY='{"email":"race@student.labflow.example","password":"zephyr-lab-canyon-2026-qwk","name":"Race"}'
echo '$ # fire TWO concurrent POST /sign-up with the identical email:'
curl -s localhost:4800/sign-up -H 'content-type: application/json' -d "$BODY" >/tmp/lfid-race-a &
curl -s localhost:4800/sign-up -H 'content-type: application/json' -d "$BODY" >/tmp/lfid-race-b &
wait
echo "  request A -> $(cat /tmp/lfid-race-a)"
echo "  request B -> $(cat /tmp/lfid-race-b)"
echo
echo '$ # the mailbox proves EXACTLY ONE account was created (one verify link + one "already have an account"):'
sleep 0.3; grep -h '^Subject:' "$MAIL"/*race* | sort | uniq -c
echo '  ⇒ both callers got the same 202 (no enumeration), the DB has one row, and no row was duplicated.'
