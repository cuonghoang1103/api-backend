# @ chạy: docker run --rm --privileged --label oslab=1 --name os-c61 … os-lab  (privileged CHỈ để đọc /proc/<pid>/task/*/stack)
@ mkdir -p /tmp/w && cp -r . /tmp/w && cd /tmp/w
gcc -O0 -g -pthread dl.c -o dl
timeout 5 ./dl naive; echo "exit=$?"
./dl naive & sleep 1; P=$!
ps -L -o pid,lwp,stat,pcpu,wchan:16,comm -p $P
grep . /proc/$P/task/*/wchan
grep -m 4 . /proc/$P/task/*/stack
gdb -p $P -batch -ex "thread apply 2-3 bt 5" 2>&1 | grep -E '^Thread|^#[34] '
gdb -p $P -batch -ex "p A.m.__data.__owner" -ex "p B.m.__data.__owner" 2>&1 | grep '^\$'
kill -9 $P; wait $P 2>/dev/null
./dl ordered
./dl trylock
java Transfer.java naive & sleep 4; J=$!
jstack $J | sed -n '/Found one Java-level deadlock/,/^Found 1 deadlock/p' | grep -v -E 'Lambda|runWith|Thread.run\(|^$'
kill -9 $J; wait $J 2>/dev/null
java Transfer.java watchdog; echo "exit=$?"
java Transfer.java trylock
