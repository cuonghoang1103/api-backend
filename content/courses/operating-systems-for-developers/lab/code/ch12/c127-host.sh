# @ Chương 12 · bài 12.7 — gõ TỪ MÁY CHỦ: pod = namespace dùng chung; checklist Dockerfile nhìn từ OS (đo thật).
# @ bash phien-host.sh c127-host.sh > ../../out/c127-host.out.txt 2>&1   — mọi container tên os-c127-*, nhãn oslab=1
docker run -d --name os-c127-pause --label oslab=1 --hostname pod-a --ipc shareable alpine:latest sleep 3600 > /dev/null
docker run -d --name os-c127-app --label oslab=1 --network container:os-c127-pause --pid container:os-c127-pause --ipc container:os-c127-pause os-lab python3 -m http.server 8000 > /dev/null
docker run --rm --label oslab=1 --network container:os-c127-pause alpine:latest sh -c 'sleep 1; wget -qO- http://127.0.0.1:8000/ | head -2; hostname'
docker exec os-c127-app ps -eo pid,args
for c in os-c127-pause os-c127-app; do docker exec $c sh -c "printf '%-14s' $c; for n in net pid ipc uts mnt; do printf ' %s' \$(readlink /proc/self/ns/\$n); done; echo"; done
docker rm -f os-c127-app os-c127-pause > /dev/null
TIMEFORMAT='docker stop took %Rs'
docker run -d --name os-c127-s0 --label oslab=1 os-lab sleep 600 > /dev/null; docker inspect -f 'StopTimeout={{.Config.StopTimeout}} StopSignal={{.Config.StopSignal}}' os-c127-s0; docker rm -f os-c127-s0 > /dev/null
docker run -d --name os-c127-s1 --label oslab=1 -v "$PWD":/app -w /app os-lab node naive.js > /dev/null; sleep 1; time docker stop os-c127-s1 > /dev/null; docker inspect -f 'exit {{.State.ExitCode}}' os-c127-s1
docker run -d --name os-c127-s2 --label oslab=1 -v "$PWD":/app -w /app os-lab sh -c 'node naive.js' > /dev/null; sleep 1; docker exec os-c127-s2 ps -eo pid,args | head -3; time docker stop os-c127-s2 > /dev/null
docker run -d --name os-c127-s3 --label oslab=1 --init -v "$PWD":/app -w /app os-lab node naive.js > /dev/null; sleep 1; docker exec os-c127-s3 ps -eo pid,args | head -3; time docker stop os-c127-s3 > /dev/null; docker inspect -f 'exit {{.State.ExitCode}}' os-c127-s3
docker run -d --name os-c127-s4 --label oslab=1 -v "$PWD":/app -w /app os-lab node server.js > /dev/null; sleep 1; time docker stop os-c127-s4 > /dev/null; docker logs os-c127-s4; docker inspect -f 'exit {{.State.ExitCode}}' os-c127-s4
@ docker rm os-c127-s1 os-c127-s2 os-c127-s3 os-c127-s4 > /dev/null
docker run --rm --label oslab=1 os-lab sh -c 'cd /sys/fs/cgroup; echo "memory.max=$(cat memory.max) pids.max=$(cat pids.max) cpu.max=$(cat cpu.max)"'
docker run --rm --label oslab=1 os-lab bash -c 'echo "nofile soft=$(ulimit -Sn) hard=$(ulimit -Hn)  nproc=$(ulimit -u)  core=$(ulimit -c)"'
docker run --rm --label oslab=1 --ulimit nofile=1024:4096 os-lab sh -c 'echo "nofile soft=$(ulimit -Sn) hard=$(ulimit -Hn)"; node -e "console.log(\"node raised it to\", require(\"child_process\").execSync(\"sh -c \\\"ulimit -Sn\\\"\").toString().trim())"'
docker run --rm --label oslab=1 --read-only os-lab sh -c 'touch /app.log; echo tmp > /tmp/x && echo "/tmp ok"'
docker run --rm --label oslab=1 --read-only --tmpfs /tmp:size=16m os-lab sh -c 'echo tmp > /tmp/x && echo "/tmp ok"; findmnt -no FSTYPE,OPTIONS /tmp; findmnt -no OPTIONS / | cut -d, -f1'
docker run --rm --label oslab=1 os-lab sh -c 'id -u; grep CapEff /proc/self/status'
docker run --rm --label oslab=1 --user 1001:1001 os-lab sh -c 'id; grep CapEff /proc/self/status; cat /proc/sys/net/ipv4/ip_unprivileged_port_start; timeout 1 python3 -m http.server 80 > /dev/null 2>&1; echo "bind :80 as uid 1001 -> exit $? (124 = still serving when timeout hit)"'
docker run --rm --label oslab=1 --user 1001:1001 -v "$PWD":/app os-lab sh -c 'touch /app/written-by-1001 && ls -ln /app/written-by-1001'
ls -ln written-by-1001; rm -f written-by-1001
