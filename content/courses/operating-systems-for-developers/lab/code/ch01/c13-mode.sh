gcc -O2 syscost.c -o syscost && ./syscost
strace -c -o sc.txt ls -l /etc > /dev/null; tail -3 sc.txt
strace -c -f -o sc.txt node -e "console.log(1)" > /dev/null; tail -1 sc.txt
strace -c -f -o sc.txt python3 -c "print(1)" > /dev/null; tail -1 sc.txt
strace -c -f -o sc.txt java -version 2> /dev/null; tail -1 sc.txt
strace -e trace=write,openat -o w.txt python3 -c 'open("/tmp/a.txt","w").write("hi")'; grep -E 'a.txt|write\(3' w.txt
grep -m1 vdso /proc/self/maps
