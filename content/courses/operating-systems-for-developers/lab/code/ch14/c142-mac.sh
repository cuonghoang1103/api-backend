# @ Chương 14 · bài 14.2 — gõ TỪ MÁY MAC (chỉ chạy chương trình của chính mình, không sudo), từ lab/code/ch14:
# @   CH14_WORK=<thư mục tạm> bash phien-host.sh c142-mac.sh 2>&1 | CH14_WORK=… bash an-danh.sh > ../../out/c142-mac.out.txt
@ W="$CH14_WORK"
clang -O2 -Wno-deprecated-declarations -o "$W/spawn" spawn.c && echo built
sysctl -n vm.loadavg
for run in 1 2; do "$W/spawn" 300 0; "$W/spawn" 300 512; done
/bin/kill -l
sh -c 'kill -USR1 $$'; echo "exit=$?"
sh -c 'kill -BUS $$'; echo "exit=$?"
node sig.js & P=$!; sleep 0.5; echo "threads: $(ps -M -p $P | tail -n +2 | wc -l)"; kill -TERM $P; wait $P; echo "exit=$?"
