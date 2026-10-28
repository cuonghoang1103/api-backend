# @ Chương 14 · bài 14.2 — trong container lab: docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch14":/lab/ch14 -w /lab/ch14 os-lab bash -c "phien c142-lx.sh 2>&1" > ../out/c142-lx.out.txt
gcc -O2 -Wall -o /tmp/spawn spawn.c && echo built
cat /proc/loadavg
for run in 1 2; do /tmp/spawn 300 0; /tmp/spawn 300 512; done
kill -l | head -4
sh -c 'kill -USR1 $$'; echo "exit=$?"
sh -c 'kill -BUS $$'; echo "exit=$?"
node sig.js & P=$!; sleep 0.5; echo "threads: $(ls /proc/$P/task | wc -l)"; kill -TERM $P; wait $P; echo "exit=$?"
strace -f -e trace=clone,clone3,vfork,execve -o /tmp/st.txt /tmp/spawn 1 0 > /dev/null; grep -E 'clone|vfork' /tmp/st.txt | sed -E 's/child_tidptr=0x[0-9a-f]+/child_tidptr=…/; s/stack=0x[0-9a-f]+, stack_size=0x[0-9a-f]+/stack=…/; s/child_stack=0x[0-9a-f]+/child_stack=…/'
