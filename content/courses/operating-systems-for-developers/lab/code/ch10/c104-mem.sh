# @ Chương 10 · bài 10.4 — bức tường 2: giới hạn bộ nhớ của container (stack nhân của luồng cũng bị tính). Gõ từ máy chủ:
# @ docker run --rm --label oslab=1 --name os-c104m --hostname oslab --memory 192m --memory-swap 192m -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c104-mem.sh 2>&1"
@ gcc -O2 -Wall -o tai tai.c && gcc -O2 -Wall -o echo-epoll echo-epoll.c && gcc -O2 -Wall -pthread -o echo-thread echo-thread.c
cat /sys/fs/cgroup/memory.max
./echo-thread 7001 > /dev/null & S=$!; sleep 0.3
./tai 7001 10000 2 1000
wait $S; echo "echo-thread exit=$?"
grep -E '^(oom|oom_kill) ' /sys/fs/cgroup/memory.events
./echo-epoll 7000 > /dev/null & S=$!; sleep 0.3
./tai 7000 10000 2 1000
grep -E '^(oom|oom_kill) ' /sys/fs/cgroup/memory.events
@ kill $S
