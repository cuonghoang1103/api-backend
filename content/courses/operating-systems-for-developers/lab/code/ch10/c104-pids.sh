# @ Chương 10 · bài 10.4 — bức tường 1: giới hạn số tác vụ (pids) của container. Gõ từ máy chủ:
# @ docker run --rm --label oslab=1 --name os-c104p --hostname oslab --pids-limit 1000 -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c104-pids.sh 2>&1"
@ gcc -O2 -Wall -o tai tai.c && gcc -O2 -Wall -o echo-epoll echo-epoll.c && gcc -O2 -Wall -pthread -o echo-thread echo-thread.c
cat /sys/fs/cgroup/pids.max
./echo-thread 7001 > srv.log & S=$!; sleep 0.3
./tai 7001 3000 2 1000
cat srv.log
@ kill $S; sleep 0.3
./echo-epoll 7000 > /dev/null & S=$!; sleep 0.3
./tai 7000 3000 2 1000
@ kill $S
