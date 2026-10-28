# @ Chương 12 · bài 12.6 — gõ TỪ MÁY CHỦ: Docker thật sự làm gì. Container đọc máy ảo Docker (--pid=host --privileged) CHỈ ĐỌC
# @ /proc và config.json của CHÍNH container os-c126-app. bash phien-host.sh c126-host.sh > ../../out/c126-host.out.txt 2>&1
uname -sr; docker info -f '{{.OperatingSystem}} · kernel {{.KernelVersion}} · {{.NCPU}} CPUs · {{.Driver}} · cgroup v{{.CgroupVersion}}'
docker run --rm --label oslab=1 alpine:latest uname -r; docker run --rm --label oslab=1 os-lab uname -r
docker info -f 'default runtime: {{.DefaultRuntime}} · security: {{.SecurityOptions}}'
docker run -d --name os-c126-app --label oslab=1 --memory 128m --cpus 0.5 --pids-limit 64 --cap-drop ALL --read-only os-lab sleep 600 > /dev/null
docker inspect -f 'Pid={{.State.Pid}} Memory={{.HostConfig.Memory}} NanoCpus={{.HostConfig.NanoCpus}} PidsLimit={{.HostConfig.PidsLimit}} ReadonlyRootfs={{.HostConfig.ReadonlyRootfs}} CapDrop={{.HostConfig.CapDrop}}' os-c126-app
ID=$(docker inspect -f '{{.Id}}' os-c126-app); P=$(docker inspect -f '{{.State.Pid}}' os-c126-app)
docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c "S=\$(ps -o ppid= -p $P); C=\$(pgrep -x containerd | head -1); D=\$(pgrep -x dockerd | head -1); ps -o pid,ppid,args -p \$D,\$C,\$S,$P | cut -c1-118"
docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c "S=\$(ps -o ppid= -p $P | tr -d ' '); readlink /proc/\$S/cwd | sed 's|$ID|<id>|'; ls /proc/\$S/cwd"
docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged -v "$PWD":/lab/ch12:ro os-lab sh -c "S=\$(ps -o ppid= -p $P | tr -d ' '); python3 /lab/ch12/ocisum.py /proc/\$S/cwd/config.json | sed 's|$ID|<id>|'"
docker rm -f os-c126-app > /dev/null
docker run --rm --label oslab=1 alpine:latest sh -c "grep ' / / ' /proc/self/mountinfo | grep -oE 'lowerdir=[^,]*' | tr ':' '\n' | wc -l"
