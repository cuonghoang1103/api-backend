# @ Chương 12 · bài 12.1 — namespace bằng tay. Container đặc quyền VỨT ĐI (chỉ đổi namespace/mount BÊN TRONG nó):
# @ docker run --rm --label oslab=1 --name os-c121 --hostname oslab --privileged -v "$PWD/ch12":/lab/ch12 -w /lab/ch12 os-lab bash -c "phien c121-ns.sh 2>&1"
ls -l /proc/self/ns | awk 'NR>1 {print $9, $10, $11}'
lsns -o NS,TYPE,NPROCS,PID,COMMAND
hostname
unshare --uts sh -c 'hostname mini; echo "inside: $(hostname)  uts=$(readlink /proc/self/ns/uts)"'
echo "outside: $(hostname)  uts=$(readlink /proc/self/ns/uts)"
unshare --pid sh -c 'echo "sh is still PID $$"; /bin/true; echo "first child ran"; /bin/true; echo "second child ran"'
unshare --pid --fork sh -c 'echo "I am PID $$"; ps -e | wc -l'
unshare --pid --fork --mount-proc sh -c 'echo "I am PID $$"; ps -ef'
unshare --pid --fork --mount-proc sleep 300 &
sleep 0.5; S=$(pgrep -n -x sleep); echo "outside the sleep is PID $S"; grep -E '^(Name|NSpid|NSpgid)' /proc/$S/status
readlink /proc/$S/ns/pid /proc/self/ns/pid
kill $S; sleep 0.5; grep -E '^State' /proc/$S/status
kill -KILL $S; wait; echo "gone: $(ls /proc/$S 2>&1 | head -1)"
unshare --mount sh -c 'mount -t tmpfs scratch /mnt && echo secret > /mnt/key && ls /mnt && findmnt -o TARGET,SOURCE,FSTYPE /mnt'
ls /mnt; findmnt /mnt || echo "outside: /mnt is not a mount point"
ip -br link | grep -v NONE
unshare --net sh -c 'ip -br link | grep -v NONE; ip link set lo up; ping -c1 -W1 127.0.0.1 | tail -2; curl -sS -m 2 http://example.com -o /dev/null || echo "curl exit $?"'
ipcmk -Q > /dev/null; ipcs -q | tail -n +3
unshare --ipc sh -c 'ipcs -q | tail -n +3; echo "(no queues in the new IPC namespace)"'
runuser -u dev -- unshare --user --map-root-user sh -c 'id; cat /proc/self/uid_map; touch /etc/hacked'
runuser -u dev -- unshare --user --map-root-user sh -c 'grep -E "^Cap(Eff|Bnd)" /proc/self/status; cat /proc/self/setgroups'
unshare --user --map-users=0:100000:65536 --map-groups=0:100000:65536 sh -c 'cat /proc/self/uid_map; id'
mkdir /sys/fs/cgroup/demo
sh -c 'echo $$ > /sys/fs/cgroup/demo/cgroup.procs; echo "old view: $(cat /proc/self/cgroup)"; unshare --cgroup sh -c "echo new view: \$(cat /proc/self/cgroup)"'
rmdir /sys/fs/cgroup/demo
unshare --uts --pid --mount --net --ipc --fork --mount-proc sh -c 'hostname box; sleep 300' &
sleep 0.5; C=$(pgrep -n -x sleep); echo "the box's sleep is PID $C on this side"
nsenter -t $C --uts --pid --mount --net sh -c 'hostname; echo "pid $$"; ps -ef; ip -br link | grep -v NONE'
nsenter -t $C --all ls -l /proc/1/ns/net /proc/self/ns/net
kill -KILL $C; wait
ip netns add demo; ls -l /run/netns; ip netns exec demo ip -br link | grep -v NONE; ip netns pids demo | wc -l
ip netns del demo; ls /run/netns | wc -l
