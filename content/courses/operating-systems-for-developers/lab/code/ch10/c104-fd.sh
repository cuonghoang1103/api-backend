# @ Chương 10 · bài 10.4 — bức tường 3: giới hạn fd (ulimit -n), và cái bẫy "accept EMFILE + level-triggered = vòng quay 100% CPU".
# @ docker run --rm --label oslab=1 --name os-c104f --hostname oslab -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c104-fd.sh 2>&1"
@ gcc -O2 -Wall -o tai tai.c && gcc -O2 -Wall -o echo-epoll echo-epoll.c
ulimit -Sn 1024; ulimit -Sn
./echo-epoll 7000 > /dev/null & S=$!; sleep 0.3
./tai 7000 2000 6 1000 & T=$!; sleep 2
./xem.sh $S
timeout 0.5 strace -qq -p $S -e trace=accept4,epoll_pwait 2>&1 | head -4
strace -qq -c -p $S -o spin.txt & ST=$!; sleep 1; kill -INT $ST; wait $ST; head -6 spin.txt
wait $T
@ kill $S
