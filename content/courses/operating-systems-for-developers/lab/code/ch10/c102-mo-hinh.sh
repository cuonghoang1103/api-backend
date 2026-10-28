# @ Chương 10 · bài 10.2 — năm mô hình I/O của Stevens chạy thật: cùng một ống dẫn, dữ liệu tới sau 1 giây.
# @ docker run --rm --label oslab=1 --name os-c102 --hostname oslab -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c102-mo-hinh.sh 2>&1"
for m in m1-block m2-nonblock m3-poll m4-sigio m5-aio; do gcc -O2 -Wall -o $m $m.c || break; done; gcc -O2 -Wall -o m5-uring m5-uring.c -luring && echo built
./m1-block & P=$!; sleep 0.5; ./peek.sh $P; wait $P
./m2-nonblock & P=$!; sleep 0.5; ./peek.sh $P; wait $P
./m3-poll & P=$!; sleep 0.5; ./peek.sh $P; wait $P
./m4-sigio & P=$!; sleep 0.5; ./peek.sh $P; wait $P
./m5-aio & P=$!; sleep 0.5; ./peek.sh $P; wait $P
strace -f -qq -o aio.txt -e trace=clone,clone3,read,futex ./m5-aio > /dev/null; grep -v ELF aio.txt | sed -E 's/flags=[A-Z_|]+/flags=…/; s/child_stack=0x[0-9a-f]+, //; s/, child_tid=[^}]*\}/, …}/' | head -6 | cut -c1-130
./m5-uring
strace -qq -e trace=io_uring_setup ./m5-uring
strace -qq -o sigio.txt -e trace=fcntl,read,rt_sigsuspend,rt_sigreturn ./m4-sigio > /dev/null; grep -v ELF sigio.txt | cut -c1-150
strace -c -qq ./m2-nonblock 2>&1 | head -5
