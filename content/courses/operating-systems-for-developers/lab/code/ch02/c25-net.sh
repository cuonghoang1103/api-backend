# @ docker run --rm --label oslab=1 --name os-c25 --hostname oslab -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c25-net.sh 2>&1"
node api.js & sleep 0.5
python3 -m http.server 8080 --bind 127.0.0.1 > /dev/null 2>&1 & sleep 0.5
ss -tulpn
node api.js; echo "exit=$?"
ss -ltnp 'sport = :3000'
lsof -nP -iTCP:3000 -sTCP:LISTEN
fuser 3000/tcp
kill $(lsof -ti:3000); sleep 0.3; ss -ltn 'sport = :3000' | tail -n +2 | wc -l
node fake-next.js & sleep 0.5
ps -o pid,comm,args -p $(pgrep -f next-server)
pkill -f "next start"; echo "pkill exit=$?"
pkill -f "fake-next.js"; echo "pkill exit=$?"
lsof -ti:3000; echo "lsof exit=$?"
ss -ltnp 'sport = :3000'
fuser -k 3000/tcp; sleep 0.3; curl -s localhost:3000; echo "curl exit=$?"
@ node api.js > /dev/null & sleep 0.5
for i in $(seq 1 300); do curl -s -o /dev/null localhost:3000/health; done; ss -s
ss -tan state time-wait | head -4
ss -tan state time-wait | wc -l
cat /proc/sys/net/ipv4/ip_local_port_range
@ kill %1 %2 %3 2> /dev/null; disown -a
ulimit -n
bash -c 'ulimit -Sn 64; grep "open files" /proc/self/limits'
bash -c 'ulimit -Sn 64; node -p "require(\"fs\").readFileSync(\"/proc/self/limits\", \"utf8\").match(/Max open files.*/)[0]"'
ulimit -n 64; node ro-ri-fd.js & sleep 0.5
for i in $(seq 1 70); do curl -s localhost:3002/order/$i > /tmp/last.txt; done; cat /tmp/last.txt
ls /proc/$(pgrep -f ro-ri-fd.js)/fd | wc -l
grep 'open files' /proc/$(pgrep -f ro-ri-fd.js)/limits
lsof -nP -p $(pgrep -f ro-ri-fd.js) | awk 'NR > 1 {print $5, $9}' | sort | uniq -c | sort -rn | head -4
curl -s -m 2 localhost:3002/health; echo "curl exit=$?"
prlimit --pid $(pgrep -f ro-ri-fd.js) --nofile=1024:1024
kill $(pgrep -f ro-ri-fd.js); FIX=1 node ro-ri-fd.js & sleep 0.5
for i in $(seq 1 500); do curl -s localhost:3002/order/$i > /tmp/last.txt; done; cat /tmp/last.txt; ls /proc/$(pgrep -f ro-ri-fd.js)/fd | wc -l
cat /proc/sys/fs/file-nr
@ pkill -f ro-ri-fd.js; rm -f /tmp/audit-*.log /tmp/last.txt
