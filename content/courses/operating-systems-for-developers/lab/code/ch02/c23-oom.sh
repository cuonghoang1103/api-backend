# @ chạy TỪ MÁY CHỦ: bash ch02/phien-host.sh ch02/c23-oom.sh — "VPS" = một container --memory 1g (không swap), mọi container --label oslab=1
docker run --rm --name os-c23a --label oslab=1 --memory 1g --memory-swap 1g -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab node --max-old-space-size=4096 build.js 600 backend; echo "exit=$?"
docker run --rm --name os-c23b --label oslab=1 --memory 1g --memory-swap 1g -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c 'node --max-old-space-size=4096 build.js 600 backend & node --max-old-space-size=4096 build.js 600 frontend & wait -n; echo "first to finish: exit=$?"; wait -n; echo "second: exit=$?"; grep oom /sys/fs/cgroup/memory.events'
docker run --rm --label oslab=1 --privileged os-lab dmesg | grep -E 'Memory cgroup out of memory|oom-kill:' | tail -1 | cut -c1-140
docker run --rm --name os-c23c --label oslab=1 --memory 1g --memory-swap 1g -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c 'node --max-old-space-size=4096 build.js 600 backend && node --max-old-space-size=4096 build.js 600 frontend; echo "exit=$?"'
docker run --rm --name os-c23d --label oslab=1 --memory 1g --memory-swap 1g -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab node --max-old-space-size=256 build.js 600 frontend 2>&1 | grep -E 'compiled|FATAL|done'; echo "exit=${PIPESTATUS[0]}"
docker run --name os-c23e --label oslab=1 --memory 1g --memory-swap 1g -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab node --max-old-space-size=4096 build.js 1500 frontend; echo "exit=$?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' os-c23e
@ docker rm os-c23e > /dev/null
docker run -d --name os-c23f --label oslab=1 --memory 1g --memory-swap 1g -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab node --max-old-space-size=4096 build.js 600 frontend 60 > /dev/null; sleep 5
docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.PIDs}}' os-c23f
docker exec os-c23f sh -c 'cat /sys/fs/cgroup/memory.current /sys/fs/cgroup/memory.max; free -m | head -2'
@ docker rm -f os-c23f > /dev/null
