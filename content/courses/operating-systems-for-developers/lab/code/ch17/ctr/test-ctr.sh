#!/bin/bash
# test-ctr.sh — BỘ KIỂM NGHIỆM THU dự án mở rộng 17.5 (mini container runtime). Chỉ chạy trong container lab VỨT ĐI:
#   docker run --rm --privileged --label oslab=1 --name os-ctr -v "$PWD":/lab/ctr -w /lab/ctr os-lab ./test-ctr.sh [thư-mục-mã]
# Hợp đồng dòng lệnh: minictr [--mem M] [--pids N] [--cpu "Q P"] [--hostname H] ROOTFS CMD [ARGS…] — mã thoát = của CMD.
cd "$(dirname "$0")"; SRC=${1:-.}
W=$(mktemp -d /tmp/ctr-test.XXXX); trap 'umount "$W/rootfs" 2>/dev/null; rm -rf "$W"' EXIT
gcc -Wall -Wextra -Werror -O2 -o "$W/minictr" "$SRC/minictr.c" 2> "$W/cc.txt" || { echo "BUILD FAILED"; head "$W/cc.txt"; echo "SCORE 0/10"; exit 1; }
# chuẩn bị: (a) cgroup v2 gốc phải nhường controller cho con — dời mọi tiến trình sang nhóm "init" như bài 12.2/12.4
if [ ! -d /sys/fs/cgroup/init ]; then mkdir /sys/fs/cgroup/init
  for p in $(cat /sys/fs/cgroup/cgroup.procs); do echo "$p" > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null; done; fi
echo "+memory +pids +cpu" > /sys/fs/cgroup/cgroup.subtree_control
# (b) rootfs: một busybox tĩnh + các liên kết lệnh, trên tmpfs (không đụng đĩa của container)
mkdir -p "$W/rootfs"; mount -t tmpfs -o size=32m rootfs "$W/rootfs"; mkdir -p "$W/rootfs/bin"
cp /bin/busybox "$W/rootfs/bin/"; for a in $(busybox --list | grep -vx busybox); do ln -sf busybox "$W/rootfs/bin/$a"; done   # liên kết TƯƠNG ĐỐI: sau pivot_root vẫn đúng
R="$W/rootfs"; C="$W/minictr"; score=0; total=0
ok() { total=$(echo "$total + $3" | bc)
  if [ "$4" = 1 ]; then score=$(echo "$score + $3" | bc); printf 'PASS %-4s %-56s +%s\n' "$1" "$2" "$3"
  else printf 'FAIL %-4s %-56s  0 / %s   (%s)\n' "$1" "$2" "$3" "$5"; fi; }

O=$("$C" "$R" /bin/sh -c 'echo $$')
ok C1 "PID namespace: the command is PID 1"                1.5 "$([ "$O" = 1 ] && echo 1)" "got '$O'"
O=$("$C" --hostname cuongthai-box "$R" /bin/hostname)
ok C2 "UTS namespace: own hostname, host unchanged"        1   "$([ "$O" = cuongthai-box ] && [ "$(hostname)" != cuongthai-box ] && echo 1)" "inside '$O', outside '$(hostname)'"
M0=$(findmnt -n | wc -l); O=$("$C" "$R" /bin/sh -c 'ls /; test -e /lab && echo LEAK'); M1=$(findmnt -n | wc -l)
ok C3 "pivot_root: only the rootfs is visible inside"      1.5 "$([ "$O" = "$(printf 'bin\ndev\nproc\ntmp')" ] && echo 1)" "ls / = $(echo $O)"
ok C3 "mount namespace: host mount table unchanged"        0.5 "$([ "$M0" = "$M1" ] && echo 1)" "mounts before $M0, after $M1"
O=$("$C" "$R" /bin/sh -c 'grep -c eth /proc/net/dev; tail -n +2 /proc/net/route | wc -l; ip -o link | grep -c "state UP"')
ok C4 "network namespace: no eth0, no routes, nothing UP"   1   "$([ "$(echo $O)" = "0 0 0" ] && echo 1)" "eth lines / routes / up links: $(echo $O)"
"$C" --mem 32M "$R" /bin/sh -c 'head -c 104857600 /dev/zero | tail > /dev/null' 2> "$W/oom.txt"; RC=$?
ok C5 "memory.max 32M: memory hog is killed, exit 137, oom_kill reported" 1.5 "$([ $RC = 137 ] && grep -q 'oom_kill [1-9]' "$W/oom.txt" && echo 1)" "exit $RC, stderr: $(tr '\n' ' ' < "$W/oom.txt")"
O=$("$C" --pids 10 "$R" /bin/sh -c 'for i in $(seq 20); do sleep 1 & done; wait' 2>&1)
ok C6 "pids.max 10: a fork storm is capped and reported"   1   "$([[ "$O" == *"can't fork"* ]] && [[ "$O" == *"pids.max (10) refused"* ]] && echo 1)" "$(echo $O | cut -c1-90)"
O=$("$C" "$R" /bin/sh -c 'mount -t tmpfs x /tmp 2>&1; echo rc=$?; grep CapBnd /proc/self/status')
ok C7 "capabilities: CAP_SYS_ADMIN gone, mount is refused" 1   "$([[ "$O" == *"rc=1"* ]] && [[ "$O" != *"CapBnd:	000001ffffffffff"* ]] && echo 1)" "$(echo $O)"
"$C" "$R" /bin/sh -c 'exit 7'; RC=$?
ok C8 "exit code of the command is passed through"         0.5 "$([ $RC = 7 ] && echo 1)" "exit $RC"
N=$(ls -d /sys/fs/cgroup/minictr-* 2>/dev/null | wc -l)
ok C8 "every cgroup removed after the containers exit"     0.5 "$([ "$N" = 0 ] && echo 1)" "$N left"
echo "SCORE $score/$total"
