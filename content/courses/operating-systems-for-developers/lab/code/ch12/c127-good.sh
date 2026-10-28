# @ Chương 12 · bài 12.7 — gõ TỪ MÁY CHỦ: một ảnh Node viết theo checklist, chạy với đủ cờ, đo lại từng mục.
# @ bash phien-host.sh c127-good.sh > ../../out/c127-good.out.txt 2>&1   — ảnh os-c127-good, container os-c127-g, nhãn oslab=1
docker build -q --label oslab=1 -t os-c127-good good > /dev/null; docker image inspect os-c127-good -f 'User={{.Config.User}} Cmd={{.Config.Cmd}}'
docker run -d --name os-c127-g --label oslab=1 --init --read-only --tmpfs /tmp:size=16m --memory 256m --cpus 1 --pids-limit 128 --cap-drop ALL --security-opt no-new-privileges --ulimit nofile=4096:4096 -p 127.0.0.1:3000:3000 os-c127-good > /dev/null; sleep 1
curl -s http://127.0.0.1:3000/
docker exec os-c127-g sh -c 'ps -o pid,user,args; grep -E "^(CapEff|NoNewPrivs|Seccomp):" /proc/self/status'
docker exec os-c127-g sh -c 'cd /sys/fs/cgroup; echo "memory.max=$(cat memory.max) cpu.max=$(cat cpu.max) pids.max=$(cat pids.max) nofile=$(ulimit -n)"; touch /app/x'
TIMEFORMAT='docker stop took %Rs'
time docker stop os-c127-g > /dev/null; docker logs os-c127-g; docker inspect -f 'exit {{.State.ExitCode}}' os-c127-g
@ docker rm os-c127-g > /dev/null; docker rmi os-c127-good > /dev/null
