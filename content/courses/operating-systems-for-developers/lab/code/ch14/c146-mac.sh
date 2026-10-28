# @ Chương 14 · bài 14.6 — gõ TỪ MÁY MAC (docker CLI + lệnh chỉ đọc), từ lab/code/ch14:
# @   CH14_WORK=<thư mục tạm> bash phien-host.sh c146-mac.sh 2>&1 | CH14_WORK=… bash an-danh.sh > ../../out/c146-mac.out.txt
@ W="$CH14_WORK"; mkdir -p "$W/m"
uname -sm
docker version --format 'client {{.Client.Os}}/{{.Client.Arch}}  ·  server {{.Server.Os}}/{{.Server.Arch}}, kernel {{.Server.KernelVersion}}'
docker info --format '{{.OperatingSystem}} · {{.NCPU}} CPUs · {{.MemTotal}} bytes RAM'
ps -axo pid,%cpu,rss,comm | awk '/Virtualization.VirtualMachine$/{printf "%s  %s%% CPU  RSS %.1f GiB  %s\n", $1, $2, $3/1048576, "com.apple.Virtualization.VirtualMachine"}'
docker run --rm --label oslab=1 --name os-c146-vm --pid=host os-lab bash -c 'echo "processes in the VM: $(ps -e --no-headers | wc -l)"; grep MemTotal /proc/meminfo; ps -o pid,comm -p 1'
docker run --rm --label oslab=1 --name os-c146-a alpine:latest uname -sr
docker run --rm --label oslab=1 --name os-c146-b os-lab uname -sr
docker run --rm --label oslab=1 --name os-c146-fs -v "$PWD":/lab/ch14 -v "$W/m":/mac os-lab bash -c 'mount | grep -E " /mac | / " | cut -c1-70; for r in 1 2; do /lab/ch14/bench-fs.sh /mac; /lab/ch14/bench-fs.sh /tmp; done'
