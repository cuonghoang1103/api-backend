# @ Chương 12 · bài 12.2 — gõ TỪ MÁY CHỦ: cờ docker run nào ghi vào file cgroup nào; docker update; docker pause = freezer.
# @ bash phien-host.sh c122-host.sh > ../../out/c122-host.out.txt 2>&1   (container đọc cgroup của VM: --cgroupns=host, CHỈ ĐỌC)
docker run -d --name os-c122-app --label oslab=1 --memory 256m --cpus 1.5 --pids-limit 100 os-lab sleep 600 > /dev/null
docker exec os-c122-app sh -c 'cd /sys/fs/cgroup; for f in memory.max cpu.max pids.max; do echo "$f = $(cat $f)"; done'
docker update --cpus 0.5 --pids-limit 50 os-c122-app > /dev/null; docker exec os-c122-app sh -c 'cat /sys/fs/cgroup/cpu.max /sys/fs/cgroup/pids.max'
ID=$(docker inspect -f '{{.Id}}' os-c122-app); docker pause os-c122-app > /dev/null
docker exec os-c122-app true
docker run --rm --label oslab=1 --name os-c122-vm --privileged --cgroupns=host os-lab sh -c "cd /sys/fs/cgroup/docker/$ID && echo \"cgroup.freeze = \$(cat cgroup.freeze)\" && grep frozen cgroup.events && cat memory.max"
docker unpause os-c122-app > /dev/null; docker rm -f os-c122-app > /dev/null
