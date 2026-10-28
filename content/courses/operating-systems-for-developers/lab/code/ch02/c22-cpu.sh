# @ docker run --rm --label oslab=1 --name os-c22 --hostname oslab --cap-add PERFMON --security-opt seccomp=unconfined -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien c22-cpu.sh 2>&1"
@ cp api.js /tmp/ && cd /tmp
node --perf-basic-prof api.js & sleep 0.5
curl -s 'localhost:3000/check?email=cuong@cuongthai.com'
for n in 40 45 50; do curl -s "localhost:3000/check?email=x@a.$(printf 'a%.0s' $(seq $n))!"; done
curl -s -m 2 localhost:3000/health; echo "exit=$?"
(curl -s "localhost:3000/check?email=x@a.$(printf 'a%.0s' $(seq 64))!" > /dev/null &); sleep 3
curl -s -m 2 localhost:3000/health; echo "exit=$?"
top -b -n 1 -w 100 | head -9
ps -eo pid,stat,%cpu,time,etime,comm --sort=-%cpu | head -4
pidstat -u -p $(pgrep -f api.js) 1 3
grep ctxt /proc/$(pgrep -f api.js)/status; sleep 2; grep ctxt /proc/$(pgrep -f api.js)/status
perf record -q -F 499 -g -p $(pgrep -f api.js) -o /tmp/perf.data -- sleep 3 2>/dev/null; perf report -i /tmp/perf.data --stdio --no-children --sort sym 2>/dev/null | grep -m4 -E '^ +[0-9]'
kill -9 $(pgrep -f api.js); sleep 0.3; ps -o pid,stat,comm -C node; echo "node processes left: $(pgrep -c node)"
