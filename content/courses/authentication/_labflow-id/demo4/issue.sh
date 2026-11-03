# demo4/issue.sh — lessons 4.1 & 4.5: LabFlow ID (v0.4 on :4800) issues an access token for LabFlow API.
# An signs in (session cookie), then asks for a token; the token is for a DIFFERENT audience and lasts 15 minutes.
rm -f /tmp/lfid-an.jar
curl -s -o /dev/null -c /tmp/lfid-an.jar localhost:4800/sign-in -H 'content-type: application/json' \
  -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
echo '$ curl -s -b jar -X POST localhost:4800/token'
TOK=$(curl -s -b /tmp/lfid-an.jar -X POST localhost:4800/token)
echo "$TOK" | node -e 'const o=JSON.parse(require("fs").readFileSync(0,"utf8")); o.access_token=o.access_token.slice(0,24)+"…"; console.log(JSON.stringify(o))'
echo
echo '$ # the client splits the access_token and reads the payload (no key needed):'
echo "$TOK" | node -e 'const t=JSON.parse(require("fs").readFileSync(0,"utf8")).access_token; const [h,p]=t.split("."); console.log("  header :", Buffer.from(h,"base64url").toString()); console.log("  payload:", Buffer.from(p,"base64url").toString())'
echo
echo '$ curl -s localhost:4800/.well-known/jwks.json'
curl -s localhost:4800/.well-known/jwks.json | node -e 'const j=JSON.parse(require("fs").readFileSync(0,"utf8")); const k=j.keys[0]; k.x=k.x.slice(0,20)+"…"; console.log(JSON.stringify(j))'
