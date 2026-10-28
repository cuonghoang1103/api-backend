gcc -Wall -O2 fork1.c -o fork1 && ./fork1
gcc -O2 fork3.c -o fork3 && ./fork3 | sort
./fork3 | wc -l
gcc -O2 buffer.c -o buffer && script -qc ./buffer /dev/null
./buffer | cat
gcc -O2 exec.c -o exec && ./exec
gcc -Wall -O2 ctsh.c -o ctsh
gcc -O2 crash.c -o crash
printf 'echo hello from a child\nls /nope\nnosuchcmd\ncd /tmp\npwd\n/lab/ch01/crash\nexit\n' | ./ctsh; echo
echo true | strace -f -e trace=clone,clone3,execve,wait4,exit_group -o trace.txt ./ctsh > /dev/null; grep -vE 'SIGCHLD|resumed|ENOENT' trace.txt
gcc -O2 spawncost.c -o spawncost && ./spawncost
node spawn.js
java Spawn.java
