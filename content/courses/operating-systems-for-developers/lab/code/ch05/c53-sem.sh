gcc -O2 -pthread sem.c -o sem
./sem 0
./sem 3
gcc -O2 -pthread rw.c -o rw
./rw mutex
./rw rwlock
gcc -O2 -pthread cas.c -o cas
./cas 1 1000000
./cas 4 1000000
java Atomics.java
node race-sab.js atomics
gcc -O2 -pthread flag.c -o flag
timeout 3 ./flag plain; echo "exit=$?"
./flag atomic
timeout 5 java Stop.java plain; echo "exit=$?"
java Stop.java volatile
gcc -O2 -pthread sb.c -o sb
./sb relaxed
./sb seq_cst
objdump -d --no-show-raw-insn sb | sed -n '/<A>:/,/<B>:/p' | grep -A1 -E '(stlr|str)[[:space:]]+w0, \[x24\]'
@ rm -f sem rw cas flag sb
