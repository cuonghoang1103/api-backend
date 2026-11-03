# demo5/sign-in-refresh.sh — lesson 5.1: sign in (v0.5 on :4800), then exchange the refresh cookie for a fresh access token.
rm -f /tmp/lfid-an.jar
echo '$ curl -s localhost:4800/sign-in  (returns an access token; sets a refresh cookie)'
curl -s -i -c /tmp/lfid-an.jar localhost:4800/sign-in -H 'content-type: application/json' \
  -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}' \
  | grep -iE '^(HTTP|Set-Cookie: __Host-lfid_rt|\{)' | sed -E 's/(__Host-lfid_rt=lfid_rt_.{6})[^;]*/\1…/; s/("access_token":"[^"]{20})[^"]*/\1…/'
echo
echo '$ # the refresh token stored in the cookie jar (only its first chars shown):'
grep -o '__Host-lfid_rt.*' /tmp/lfid-an.jar | sed -E 's/(lfid_rt_.{8}).*/\1…/'
echo
echo '$ curl -s -X POST localhost:4800/refresh  (rotates the refresh token, mints a new access token)'
curl -s -i -b /tmp/lfid-an.jar -c /tmp/lfid-an.jar -X POST localhost:4800/refresh \
  | grep -iE '^(HTTP|Set-Cookie: __Host-lfid_rt|\{)' | sed -E 's/(__Host-lfid_rt=lfid_rt_.{6})[^;]*/\1…/; s/("access_token":"[^"]{20})[^"]*/\1…/'
echo
echo '$ # the refresh cookie CHANGED — the old one is now used and would be rejected (rotation):'
grep -o '__Host-lfid_rt.*' /tmp/lfid-an.jar | sed -E 's/(lfid_rt_.{8}).*/\1…/'
