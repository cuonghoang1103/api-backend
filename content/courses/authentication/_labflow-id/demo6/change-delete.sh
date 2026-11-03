# demo6/change-delete.sh — lesson 6.5: change the email (re-verify), then end the account. v0.6 on :4800.
MAIL=${LFID_MAIL_DIR:?set LFID_MAIL_DIR}; rm -f "$MAIL"/* 2>/dev/null
rm -f /tmp/lfid-lan.jar
curl -s -o /dev/null -c /tmp/lfid-lan.jar localhost:4800/sign-in -H 'content-type: application/json' \
  -d '{"email":"lan@labflow.example","password":"lan-lab-2026"}'
echo '$ curl -s -X POST localhost:4800/me/email  (change to lan.new@labflow.example)'
curl -s -b /tmp/lfid-lan.jar -X POST localhost:4800/me/email -H 'content-type: application/json' -d '{"email":"lan.new@labflow.example"}'; echo
echo '$ # the new address is UN-verified and gets its own verification email:'
sleep 0.2; grep -h '^Subject:' "$MAIL"/*lan_new* | head -1
echo
echo '$ curl -s -X POST localhost:4800/me/delete  (re-auth with the password)'
curl -s -b /tmp/lfid-lan.jar -X POST localhost:4800/me/delete -H 'content-type: application/json' -d '{"password":"lan-lab-2026"}'; echo
echo '$ # the account is gone — sign-in now fails like any unknown email:'
curl -s localhost:4800/sign-in -H 'content-type: application/json' -d '{"email":"lan.new@labflow.example","password":"lan-lab-2026"}'; echo
