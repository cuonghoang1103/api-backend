# @ Chương 15 · bài 15.6 — đo hiệu năng cho trung thực: làm nóng, độ dao động, best-of-N vs phân vị, coordinated omission,
# @ wrk / hey / k6 / tai.js trên cùng một máy chủ "đứng hình" 200 ms mỗi giây (stall.js).
# @ docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch15":/lab/ch15 -v <c15>/debs:/debs:ro -v <c15>/tools:/tools:ro \
# @   -w /lab/ch15 os-lab bash -c "phien c156-bench.sh 2>&1" > out/c156-bench.out.txt
# @ /debs: wrk 4.1.0 và hey 0.1.4 của Ubuntu 26.04; /tools: k6 v2.3.0 (github.com/grafana/k6/releases).
@ dpkg -i /debs/wrk_*.deb /debs/hey_*.deb /debs/libluajit*.deb > /dev/null 2>&1; export PATH=$PATH:/tools/k6-v2.3.0-linux-arm64
@ cd /tmp && cp /lab/ch15/*.c /lab/ch15/*.js /lab/ch15/*.py /lab/ch15/*.java . && gcc -O2 -g -fno-omit-frame-pointer hot.c -o hot
java Warm.java
hyperfine --warmup 2 --runs 15 './hot 20000' './hot 20000 table'
for i in $(seq 30); do ./hot 20000; done | python3 stats.py "quiet"
taskset -c 3 stress-ng --cpu 1 --timeout 6 -q & S=$!; for i in $(seq 30); do taskset -c 3 ./hot 20000; done | python3 stats.py "noisy core"; wait $S
node stall.js 8090 & ST=$!; sleep 0.5
wrk -t1 -c1 -d8s --latency http://127.0.0.1:8090/ | grep -E 'Latency|50%|90%|99%|requests in|Requests/sec'
hey -z 8s -c 1 http://127.0.0.1:8090/ | grep -E 'Requests/sec|Average|50%|95%|99%'
node tai.js http://127.0.0.1:8090/ --closed 1 --duration 8
node tai.js http://127.0.0.1:8090/ --rate 100 --duration 8 --conns 1
k6 run -q --no-color k6-open.js 2>&1 | grep -E 'http_req_duration|iterations|dropped|vus_max' | sed 's/^ *//'
node tai.js http://127.0.0.1:8090/ --rate 100 --duration 8
@ kill $ST; wait $ST 2>/dev/null
