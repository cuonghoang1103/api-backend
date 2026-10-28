# @ chạy: docker run --rm --cap-add SYS_NICE --label oslab=1 --name os-c62 … os-lab  (SYS_NICE cho SCHED_FIFO của pi.c)
@ mkdir -p /tmp/w && cp -r . /tmp/w && cd /tmp/w
@ gcc -O0 -pthread dl.c -o dl
gcc -O2 -pthread livelock.c -o livelock
/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" timeout 3 ./dl naive
/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep
/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./livelock lockstep-random
./livelock real
gcc -O2 -pthread starve.c -o starve
./starve readers
./starve writers
gcc -O2 -pthread pi.c -o pi
./pi none
./pi inherit
strace -f -e trace=futex ./pi none 2>&1 | grep -o 'FUTEX_[A-Z_]*' | sort | uniq -c
strace -f -e trace=futex ./pi inherit 2>&1 | grep -o 'FUTEX_[A-Z_]*' | sort | uniq -c
