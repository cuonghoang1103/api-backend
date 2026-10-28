# @ Chương 9 · bài 9.2 — bảng fd, open file description, fdinfo, chung offset sau fork/dup, chuyển hướng = dup2, O_CLOEXEC.
# @ Không cần quyền gì đặc biệt:
# @ docker run --rm --label oslab=1 --name os-c92 --hostname oslab -v "$PWD/ch09":/lab/ch09 -w /lab/ch09 os-lab bash -c "phien c92-fd.sh 2>&1"
@ gcc -O2 ofd.c -o ofd && gcc -O2 leak.c -o leak && mkdir -p /tmp/app && echo "DB_PASSWORD=s3cret" > /tmp/app/.env && printf 'alice:x:1001\nbob:x:1002\ncarol:x:1003\n' > /tmp/users.txt
ls -l /proc/$$/fd
exec 3< /tmp/users.txt
read -r first <&3; echo "first line: $first"
cat /proc/$$/fdinfo/3
ls -l /proc/$$/fd/3
read -r second <&3; echo "second line: $second"; grep pos /proc/$$/fdinfo/3
exec 3<&-
./ofd dup /tmp/log.txt; cat /tmp/log.txt
./ofd twice /tmp/log.txt; cat /tmp/log.txt
./ofd append /tmp/log.txt; cat /tmp/log.txt
./ofd fork /tmp/log.txt; cat /tmp/log.txt
strace -f -e trace=openat,dup2,dup3,close,execve bash -c 'ls /nope > /tmp/out.txt 2>&1' 2>&1 | grep -E 'out.txt|dup|execve\("/usr/bin/ls' | grep -v ENOENT
ls /nope > /tmp/out.txt 2>&1; echo "file: $(cat /tmp/out.txt)"
ls /nope 2>&1 > /tmp/out.txt; echo "file: [$(cat /tmp/out.txt)]"
./leak
./leak cloexec
node -e "require('fs').openSync('/tmp/app/.env'); console.log(require('child_process').execSync('ls -l /proc/self/fd').toString())"
