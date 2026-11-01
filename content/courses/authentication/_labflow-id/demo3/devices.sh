# demo3/devices.sh — lesson 3.1: An on three devices (three cookie jars), then "sign out everywhere" from the laptop.
for d in laptop phone labpc; do
  rm -f /tmp/lfid-$d.jar
  curl -s -o /dev/null -c /tmp/lfid-$d.jar -A "$d" localhost:4800/sign-in -H 'content-type: application/json' \
    -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
done
for d in laptop phone labpc; do printf '%-7s /me → ' $d; curl -s -b /tmp/lfid-$d.jar localhost:4800/me | cut -c1-40; done
printf 'laptop  POST /sign-out-everywhere → '; curl -s -b /tmp/lfid-laptop.jar -X POST localhost:4800/sign-out-everywhere; echo
for d in laptop phone labpc; do printf '%-7s /me → ' $d; curl -s -b /tmp/lfid-$d.jar localhost:4800/me; echo; done
