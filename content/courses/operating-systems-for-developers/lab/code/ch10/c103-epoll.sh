# @ Chương 10 · bài 10.3 — select/poll/epoll: giới hạn FD_SETSIZE, giá mỗi lần thức theo N fd, danh sách quan tâm trong
# @ /proc, level vs edge, EPOLLONESHOT, và một máy chủ echo epoll tí hon.
# @ docker run --rm --label oslab=1 --name os-c103 --hostname oslab -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c103-epoll.sh 2>&1"
@ gcc -O2 -Wall -o tai tai.c && gcc -O2 -Wall -o echo-epoll echo-epoll.c
gcc -O2 -o sel1024 sel1024.c && ./sel1024; echo "exit=$?"
gcc -O2 -Wall -o pollbench pollbench.c && for n in 10 100 1000 10000; do for m in select poll epoll; do ./pollbench $m $n; done; done
./echo-epoll 7000 & S=$!; sleep 0.3
for i in 1 2 3; do (sleep 2) | nc 127.0.0.1 7000 & done; sleep 0.3
ls -l /proc/$S/fd | awk 'NR>1 {print $9, $10, $11}'
cat /proc/$S/fdinfo/4
strace -qq -p $S -e trace=epoll_pwait,epoll_ctl,accept4,read,write,close -o one.txt & ST=$!; sleep 0.5
printf 'hi\n' | nc -N 127.0.0.1 7000; sleep 0.2; kill -INT $ST; wait $ST
cat one.txt
@ sleep 2
gcc -O2 -Wall -o trigger trigger.c && for m in lt et et-drain; do echo "[$m]"; ./trigger $m; done
gcc -O2 -Wall -pthread -o oneshot oneshot.c && for m in lt et oneshot; do echo "[$m]"; ./oneshot $m; done
@ kill $S
