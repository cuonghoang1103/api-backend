# @ Chương 12 · bài 12.1 — gõ TỪ MÁY CHỦ (docker CLI), từ lab/code/ch12: bash phien-host.sh c121-host.sh > ../../out/c121-host.out.txt 2>&1
# @ Một tiến trình, hai góc nhìn. Container nhìn "máy ảo Docker" dùng --pid=host --privileged CHỈ ĐỂ ĐỌC /proc, không đổi gì.
docker run -d --name os-c121-web --label oslab=1 --hostname web os-lab sleep 600 > /dev/null
docker exec os-c121-web ps -ef
P=$(docker inspect -f '{{.State.Pid}}' os-c121-web); echo "the same sleep, seen by the Docker VM: PID $P"
docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c "grep -E '^(Name|NSpid)' /proc/$P/status; ps -o pid,ppid,args -p $P,\$(ps -o ppid= -p $P)"
docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c "for n in pid net mnt uts ipc user cgroup; do printf '%-7s container %-18s VM %s\n' \$n \$(readlink /proc/$P/ns/\$n) \$(readlink /proc/1/ns/\$n); done"
docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab nsenter -t $P --uts --net --pid --mount sh -c 'hostname; ip -br addr | grep -v NONE; ps -ef'
docker rm -f os-c121-web > /dev/null
