# demo7/totp-enroll.sh — enroll a TOTP factor over HTTP, then step up with a code and with a recovery code. v0.7 on :4800.
J=/tmp/lfid-mfa.jar; rm -f "$J"
curl -s -o /dev/null -c "$J" localhost:4800/sign-in -H 'content-type: application/json' -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
code() { node -e "import('./src/totp/index.js').then(m=>process.stdout.write(m.totp('$1')))"; }
echo '$ curl -s -b jar -X POST localhost:4800/mfa/totp/begin'
BEGIN=$(curl -s -b "$J" -X POST localhost:4800/mfa/totp/begin)
SECRET=$(node -e "console.log(JSON.parse(process.argv[1]).secret)" "$BEGIN")
node -e "const o=JSON.parse(process.argv[1]);console.log('  secret '+o.secret.slice(0,12)+'…   otpauth '+o.otpauth.slice(0,54)+'…')" "$BEGIN"
echo "\$ # the authenticator app shows $(code "$SECRET") — confirm it (and receive recovery codes ONCE):"
CONFIRM=$(curl -s -b "$J" -X POST localhost:4800/mfa/totp/confirm -H 'content-type: application/json' -d "{\"code\":\"$(code "$SECRET")\"}")
node -e "const o=JSON.parse(process.argv[1]);console.log('  → '+JSON.stringify({ok:o.ok,enabled:o.enabled})+'   recovery: '+o.recoveryCodes.slice(0,3).join(' ')+' … ('+o.recoveryCodes.length+' total)')" "$CONFIRM"
RCODE=$(node -e "process.stdout.write(JSON.parse(process.argv[1]).recoveryCodes[0])" "$CONFIRM")
echo '$ # step up at login with a fresh 6-digit code:'
curl -s -b "$J" -X POST localhost:4800/mfa/totp/verify -H 'content-type: application/json' -d "{\"code\":\"$(code "$SECRET")\"}"; echo
echo "\$ # lost the phone — the single-use recovery code $RCODE works instead:"
curl -s -b "$J" -X POST localhost:4800/mfa/totp/verify -H 'content-type: application/json' -d "{\"recovery\":\"$RCODE\"}"; echo
echo '$ # that recovery code is now spent — reusing it fails:'
curl -s -b "$J" -X POST localhost:4800/mfa/totp/verify -H 'content-type: application/json' -d "{\"recovery\":\"$RCODE\"}"; echo
