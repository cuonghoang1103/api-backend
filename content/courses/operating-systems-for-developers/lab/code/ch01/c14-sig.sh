bash -c 'exit 3'; echo $?
nosuchcommand 2>/dev/null; echo $?
touch noexec.sh; ./noexec.sh 2>/dev/null; echo $?
sleep 100 & kill -INT $!; wait $!; echo $?
sleep 100 & kill -TERM $!; wait $!; echo $?
sleep 100 & kill -KILL $!; wait $!; echo $?
gcc -O2 sig.c -o sig
./sig & sleep 0.5; kill -TERM $!; wait $!; echo "exit=$?"
kill -l | head -4
gcc -O2 zombie.c -o zombie
./zombie & sleep 0.5; ps -o pid,ppid,stat,cmd --ppid $!
@ wait
gcc -O2 orphan.c -o orphan && ./orphan; sleep 1.5
sleep 100 & sleep 0.2; kill -STOP $!; ps -o pid,stat,cmd -p $!; kill -CONT $!; ps -o pid,stat,cmd -p $!; kill $!
