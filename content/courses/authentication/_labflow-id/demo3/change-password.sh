# demo3/change-password.sh — lesson 3.3: changing the password = prove the old one, sign out every other device, new session here.
for d in laptop phone; do
  rm -f /tmp/lfid-$d.jar
  curl -s -o /dev/null -c /tmp/lfid-$d.jar localhost:4800/sign-in -H 'content-type: application/json' \
    -d '{"email":"lan@labflow.example","password":"lan-lab-2026"}'
done
cp /tmp/lfid-laptop.jar /tmp/lfid-laptop-old.jar
pw() { curl -s -b /tmp/lfid-laptop.jar -c /tmp/lfid-laptop.jar localhost:4800/me/password -H 'content-type: application/json' -d "$1"; echo; }
printf 'wrong current password  → '; pw '{"current":"guess-123","next":"phong lab tang ba mo cua luc bay gio"}'
printf 'right current password  → '; pw '{"current":"lan-lab-2026","next":"phong lab tang ba mo cua luc bay gio"}'
printf 'phone /me               → '; curl -s -b /tmp/lfid-phone.jar localhost:4800/me; echo
printf 'laptop OLD cookie /me   → '; curl -s -b /tmp/lfid-laptop-old.jar localhost:4800/me; echo
printf 'laptop NEW cookie /me   → '; curl -s -b /tmp/lfid-laptop.jar localhost:4800/me | cut -c1-48
