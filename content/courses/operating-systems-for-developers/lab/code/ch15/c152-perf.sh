# @ Chương 15 · bài 15.2 — perf record/report, folded stacks, flame graph (C và Node). Cần --privileged (perf_event_open).
# @ docker run --rm --label oslab=1 --hostname oslab --privileged -v "$PWD/ch15":/lab/ch15 -v <c15>/tools:/tools:ro \
# @   -w /lab/ch15 os-lab bash -c "phien c152-perf.sh 2>&1" > out/c152-perf.out.txt
# @ /tools = FlameGraph của Brendan Gregg (stackcollapse-perf.pl, flamegraph.pl, difffolded.pl — tải từ github.com/brendangregg/FlameGraph).
@ cd /tmp && cp /lab/ch15/*.c /lab/ch15/*.js /lab/ch15/*.py . && mkdir -p /lab/ch15/fg
gcc -O2 -g -fno-omit-frame-pointer hot.c -o hot
./hot 50000
perf stat -e task-clock,context-switches,page-faults ./hot 50000 2>&1 | grep -E 'requests|task-clock|switches|faults|elapsed'
perf record -F 999 -g -o hot.data ./hot 50000 2>&1 | grep -v schedstat
perf report -i hot.data --stdio --no-children --sort symbol 2>/dev/null | grep -E '^ +[0-9.]+%' | awk '{printf "%8s  %s %s\n", $1, $2, $3}' | head -7
perf report -i hot.data --stdio --no-children --sort symbol --symbols crc_bitwise -G 2>/dev/null | grep -vE '^#|^$' | sed 's/[[:space:]-]*$//' | head -9
perf script -i hot.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | head -8
perf script -i hot.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl /tools/stackcollapse-perf.pl > hot.folded; wc -l < hot.folded
sort -t' ' -k2 -nr hot.folded | head -3 | sed 's/^hot;_start;__libc_start_main@@GLIBC_2.34;call_init;__libc_start_call_main;/…;/'
python3 folded.py hot.folded 5
perl /tools/flamegraph.pl --title "hot.c: crc bitwise (before)" --width 1200 hot.folded > /lab/ch15/fg/hot.svg; ls -l /lab/ch15/fg/hot.svg | awk '{print $5, $9}'
perf annotate -i hot.data --stdio -s crc_bitwise 2>/dev/null | grep -E '^ +[0-9]+\.[0-9]+ ' | sort -rn | head -6
./hot 50000 table
perf record -F 999 -g -o fixed.data ./hot 50000 table 2>&1 | grep -v schedstat
perf script -i fixed.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl /tools/stackcollapse-perf.pl > fixed.folded; python3 folded.py fixed.folded 4
perl /tools/flamegraph.pl --title "hot.c: crc table (after)" --width 1200 fixed.folded > /lab/ch15/fg/hot-fixed.svg
perl /tools/difffolded.pl -n hot.folded fixed.folded | perl /tools/flamegraph.pl --title "differential: before -> after" --width 1200 > /lab/ch15/fg/hot-diff.svg; ls /lab/ch15/fg
gcc -O2 hot.c -o hot-stripped -s; perf record -q -F 999 -g -o s.data ./hot-stripped 50000 > /dev/null; perf report -i s.data --stdio --no-children --sort symbol 2>/dev/null | grep -E '^ +[0-9.]+%' | awk '{printf "%8s  %s %s\n", $1, $2, $3}' | head -4
gcc -O2 -g hot.c -o hot-nofp; perf record -q -F 999 -g -o nofp.data ./hot-nofp 50000 > /dev/null; perf script -i nofp.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl /tools/stackcollapse-perf.pl | sort -t' ' -k2 -nr | head -2 | cut -c1-120
perf record -q -F 999 --call-graph dwarf -o dwarf.data ./hot 50000 > /dev/null; ls -l hot.data dwarf.data | awk '{print $5, $9}'
node --perf-basic-prof orders.js 8081 & N=$!; sleep 0.5
node tai.js http://127.0.0.1:8081/report --closed 1 --duration 7 > /tmp/load.txt & sleep 1
perf record -F 499 -g -p $N -o node.data -- sleep 4 2>&1 | grep -v schedstat
perf report -i node.data --stdio --no-children --sort symbol 2>/dev/null | grep -E '^ +[0-9.]+%' | awk '{printf "%8s  %s %s\n", $1, $2, $3}' | head -6
ls /tmp/perf-$N.map && wc -l < /tmp/perf-$N.map && grep -m3 -E 'JS:.*(report|uniqueCustomers)' /tmp/perf-$N.map
perf script -i node.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl /tools/stackcollapse-perf.pl > node.folded; python3 folded.py node.folded 5
awk '{n = $NF; $NF = ""; print n, $0}' node.folded | sort -nr | head -1 | tr ';' '\n' | tail -6
perl /tools/flamegraph.pl --title "orders.js under load (perf + --perf-basic-prof)" --width 1200 node.folded > /lab/ch15/fg/node.svg
@ wait %2; kill $N; wait $N 2>/dev/null; sleep 0.3
node orders.js 8082 & N=$!; sleep 0.5
node tai.js http://127.0.0.1:8082/report --closed 1 --duration 5 > /dev/null & sleep 1
perf record -q -F 499 -g -p $N -o nomap.data -- sleep 3; perf script -i nomap.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl /tools/stackcollapse-perf.pl > nomap.folded; python3 folded.py nomap.folded 3
awk '{n = $NF; $NF = ""; print n, $0}' nomap.folded | sort -nr | head -1 | tr ';' '\n' | tail -6
@ wait %2; kill $N; wait $N 2>/dev/null
