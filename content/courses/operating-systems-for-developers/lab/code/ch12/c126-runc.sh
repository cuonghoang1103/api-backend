# @ Chương 12 · bài 12.6 — runc thật (bản arm64 v1.5.2 tải từ GitHub, kiểm sha256) chạy cùng rootfs Alpine. Container đặc quyền VỨT ĐI:
# @ docker run --rm --label oslab=1 --name os-c126 --hostname oslab --privileged --memory 1g -v "$PWD/ch12":/lab/ch12 -v <scratch>/c12:/opt/c12:ro -w /lab/ch12 os-lab bash -c "phien c126-runc.sh 2>&1"
@ mkdir /sys/fs/cgroup/init; for p in $(cat /sys/fs/cgroup/cgroup.procs); do echo $p > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null; done; echo "+memory +cpu +pids" > /sys/fs/cgroup/cgroup.subtree_control
install -m 755 /opt/c12/runc.arm64 /usr/local/bin/runc; runc --version | head -1
mkdir -p /srv/box/rootfs && tar -xf /opt/c12/alpine-3.24.tar -C /srv/box/rootfs && cd /srv/box && runc spec && ls
python3 /lab/ch12/ocisum.py config.json
python3 /lab/ch12/ocifix.py config.json 'hostname; echo "PID $$"; ps; grep -E "^(CapEff|Seccomp|NoNewPrivs)" /proc/self/status; cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/pids.max'
runc run oci-box
python3 /lab/ch12/ocifix.py config.json 'sleep 300'; runc run -d oci-box > /dev/null 2>&1; runc list
runc state oci-box | grep -E '"(pid|status|bundle)"'
runc ps oci-box; runc exec oci-box sh -c 'hostname; cat /etc/alpine-release'
P=$(runc state oci-box | python3 -c 'import json,sys; print(json.load(sys.stdin)["pid"])'); cat /proc/$P/cgroup; cat /sys/fs/cgroup$(cut -d: -f3 /proc/$P/cgroup)/memory.max
runc kill oci-box KILL; sleep 0.5; runc list; runc delete oci-box; runc list | wc -l
python3 /lab/ch12/ocifix.py config.json 'true'
strace -f -qq -e trace=clone,clone3,unshare,setns,pivot_root,sethostname,execve -o /tmp/runc.trace runc run oci-trace > /dev/null 2>&1; echo "runc exit $?"
grep -E 'unshare\(|pivot_root|sethostname|execve\("/bin/sh' /tmp/runc.trace | sed -E 's/^[0-9]+ +//' | cut -c1-118
grep -cE 'clone3?\(' /tmp/runc.trace; grep -c 'setns(' /tmp/runc.trace
mkdir -p /srv/rl && chown dev /srv/rl
runuser -u dev -- sh -c 'cd /srv/rl && mkdir rootfs && tar -xf /opt/c12/alpine-3.24.tar -C rootfs 2>/dev/null; runc spec --rootless && python3 /lab/ch12/ocisum.py config.json | grep -E "namespaces|capab|resources"'
runuser -u dev -- sh -c 'cd /srv/rl && python3 -c "import json; c=json.load(open(\"config.json\")); c[\"process\"][\"terminal\"]=False; c[\"root\"][\"readonly\"]=False; c[\"process\"][\"args\"]=[\"sh\",\"-c\",\"id; cat /proc/self/uid_map; touch /etc/x && echo wrote /etc/x\"]; json.dump(c,open(\"config.json\",\"w\"))" && runc --root /tmp/runc-dev run rl-box'
ls -ln /srv/rl/rootfs/etc/x; id -u dev
