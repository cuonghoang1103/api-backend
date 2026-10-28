# @ Chương 8 · bài 8.4 — gõ TỪ MÁY CHỦ (docker CLI), từ thư mục lab/code/ch08: bash phien-host.sh c84-host.sh > ../../out/c84-host.out.txt 2>&1
# @ Mọi container: tên os-c84*, --label oslab=1, giới hạn bộ nhớ nhỏ — không bao giờ ép bộ nhớ của máy thật.
docker run --name os-c84a --label oslab=1 --memory 512m --memory-swap 512m -v "$PWD":/lab -w /lab os-lab bash -c 'node build.js A 300 & A=$!; node build.js B 300 & B=$!; wait $A; echo "A exit $?"; wait $B; echo "B exit $?"; echo "peak $(( $(cat /sys/fs/cgroup/memory.peak) >> 20 )) MiB"; grep oom_kill /sys/fs/cgroup/memory.events'
echo "container exit $?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' os-c84a
docker run --name os-c84b --label oslab=1 --memory 512m --memory-swap 512m -v "$PWD":/lab -w /lab os-lab bash -c 'node build.js A 300 && node build.js B 300; echo "peak $(( $(cat /sys/fs/cgroup/memory.peak) >> 20 )) MiB"; grep oom_kill /sys/fs/cgroup/memory.events'
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' os-c84b
docker run --name os-c84c --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab node build.js next-build 400
echo "container exit $?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' os-c84c
@ docker rm os-c84a os-c84b os-c84c > /dev/null
docker run --rm --name os-c84d --label oslab=1 --memory 512m -v "$PWD":/lab -w /lab os-lab node --max-old-space-size=64 grow.js 2>&1 | grep -E 'heap|FATAL'; echo "exit ${PIPESTATUS[0]}"
docker run --rm --init --name os-c84g --label oslab=1 --memory 512m -v "$PWD":/lab -w /lab os-lab node --max-old-space-size=64 grow.js 2>&1 | grep -E 'FATAL'; echo "exit ${PIPESTATUS[0]}"
docker run --rm --name os-c84e --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab node --max-old-space-size=8192 grow.js
echo "exit $?"
docker run --rm --name os-c84f --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab node grow.js
echo "exit $?"
