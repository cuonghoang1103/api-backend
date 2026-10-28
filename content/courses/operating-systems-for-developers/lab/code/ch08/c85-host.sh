# @ Chương 8 · bài 8.5 — gõ TỪ MÁY CHỦ, từ lab/code/ch08: bash phien-host.sh c85-host.sh > ../../out/c85-host.out.txt 2>&1
@ docker run --rm --name os-c85c --label oslab=1 -v "$PWD":/lab -w /lab os-lab javac Hog.java
for m in 256m 512m 1g 2g 4g; do printf '%-5s ' $m; docker run --rm --name os-c85n --label oslab=1 --memory $m os-lab node -p "'heap limit ' + Math.round(require('v8').getHeapStatistics().heap_size_limit / 2**20) + ' MB'"; done
docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XshowSettings:system -version 2>&1 | grep -E 'Provider|Memory Limit|Effective CPU'
docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:+PrintFlagsFinal -version 2>/dev/null | grep -E ' (MaxHeapSize|MaxRAMPercentage) '
docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:MaxRAMPercentage=75 -XX:+PrintFlagsFinal -version 2>/dev/null | grep -E ' MaxHeapSize '
docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -Xmx1g Hog
echo "exit $?"
docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 Hog
echo "exit $?"
docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError Hog 2>&1 | tail -2; echo "exit ${PIPESTATUS[0]}"
docker run --rm --name os-c85f --label oslab=1 --memory 256m os-lab cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/memory.swap.max
docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swap 256m os-lab cat /sys/fs/cgroup/memory.swap.max
docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-reservation 128m --oom-score-adj 500 os-lab cat /sys/fs/cgroup/memory.low /sys/fs/cgroup/memory.high /proc/1/oom_score_adj
docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swappiness 10 os-lab cat /proc/sys/vm/swappiness
@ rm -f Hog.class
