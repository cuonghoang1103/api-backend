# demo5/devices.sh — lesson 5.4: the devices page. An signs in on three devices, lists them, and revokes one.
for d in laptop phone labpc; do
  rm -f /tmp/lfid-$d.jar
  curl -s -o /dev/null -c /tmp/lfid-$d.jar -A "$d" localhost:4800/sign-in -H 'content-type: application/json' \
    -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
done
echo '$ curl -s -b laptop.jar localhost:4800/me/devices   (every live family, one row per device)'
curl -s -b /tmp/lfid-laptop.jar localhost:4800/me/devices \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8")).devices; for(const x of d) console.log("  "+x.familyId.slice(0,11)+"…  ua="+x.userAgent+"  ip="+x.ip)'
echo
PHONE=$(curl -s -b /tmp/lfid-laptop.jar localhost:4800/me/devices | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8")).devices; process.stdout.write((d.find(x=>x.userAgent==="phone")||{}).familyId||"")')
echo '$ curl -s -X POST localhost:4800/me/devices/revoke -d {"familyId":"<phone>"}  (revoke just the phone)'
curl -s -b /tmp/lfid-laptop.jar -X POST localhost:4800/me/devices/revoke -H 'content-type: application/json' -d "{\"familyId\":\"$PHONE\"}"; echo
echo
echo '$ # the phone can no longer refresh:'
curl -s -b /tmp/lfid-phone.jar -X POST localhost:4800/refresh; echo
echo '$ # and it is gone from the list:'
curl -s -b /tmp/lfid-laptop.jar localhost:4800/me/devices \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8")).devices; console.log("  "+d.length+" devices left: "+d.map(x=>x.userAgent).join(", "))'
