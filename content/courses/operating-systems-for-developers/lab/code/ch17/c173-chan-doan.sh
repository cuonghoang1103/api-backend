# @ Chương 17 · bài 17.3 — điều tra năm sự cố cài sẵn, TỪ MÁY CHỦ (bash ../ch02/phien-host.sh c173-chan-doan.sh), trong lúc
# @ project os17 đang chạy bản LỖI dưới tải (KEEP=1 incident/check.sh). Chỉ đụng các container os-17-* của chính bài này.
# Step 0 — triage: which containers are unhealthy right now? ||| Bước 0 — phân loại: container nào đang không khoẻ?
docker ps -a --filter label=com.docker.compose.project=os17 --format 'table {{.Names}}\t{{.Status}}'
docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.PIDs}}' os-17-shop os-17-report os-17-worker os-17-billing os-17-audit
# Incident 1 — shop-api keeps restarting ||| Sự cố 1 — shop-api cứ khởi động lại
docker inspect -f '{{.Name}} restarts={{.RestartCount}} OOMKilled={{.State.OOMKilled}} started={{.State.StartedAt}}' os-17-shop
docker events --since 3m --until "$(date +%s)" --filter container=os-17-shop --format '{{.Action}} exitCode={{index .Actor.Attributes "exitCode"}}' | grep -E '^(oom|die)' | tail -4
for i in 1 2 3; do docker exec os-17-traffic curl -s shop-api:3000/stats; sleep 2; done
docker exec os-17-shop cat /sys/fs/cgroup/memory.max
# Incident 2 — report answers 500 ||| Sự cố 2 — report trả lời 500
docker logs --tail 2 os-17-report
docker exec os-17-report sh -c 'ulimit -n; ls /proc/1/fd | wc -l; ls -l /proc/1/fd | grep -c template.html'
# Incident 3 — worker jobs fail: the disk is full, but du says it is almost empty ||| Sự cố 3 — việc của worker lỗi: đĩa đầy, mà du bảo gần như trống
docker exec os-17-traffic curl -s worker:3002/
docker exec os-17-worker sh -c 'df -h /var/log/app | tail -1; du -sh /var/log/app'
docker exec os-17-worker sh -c 'ls -l /proc/[0-9]*/fd 2>/dev/null | grep "(deleted)" | sed -E "s/.* ([0-9]+) -> /fd \1 -> /"'
docker exec os-17-worker sh -c 'ls /var/log/app; P=$(pgrep -x python3); stat -Lc "fd 3 of python3 (PID $P): %s bytes" /proc/$P/fd/3; head -c 150 /proc/$P/fd/3; echo'
# Incident 4 — transfers hang, CPU is idle ||| Sự cố 4 — lệnh chuyển tiền treo, CPU lại rảnh
docker exec os-17-traffic curl -s -m 3 -o /dev/null -w '%{http_code} after %{time_total}s\n' 'billing:3003/transfer?from=0&to=1'; echo "curl exit=$?"
docker exec os-17-billing sh -c 'jstack 1 | sed -n "/Found one Java-level deadlock/,/^Found [0-9]* deadlock/p" | grep -vE "^\s*$" | head -24'
# Incident 5 — audit is slow ||| Sự cố 5 — audit chậm
docker exec os-17-traffic sh -c 'for i in 1 2 3; do curl -s "audit:3004/event?id=$i"; done'
docker run --rm --label oslab=1 --name os-17-debug --pid=container:os-17-audit --cap-add SYS_PTRACE os-lab sh -c 'timeout -s INT 4 strace -qq -c -f -p 1 -o /tmp/s.txt; head -8 /tmp/s.txt'
docker exec os-17-audit sh -c "wc -l < /data/audit.log; grep -cvE '^[0-9]+\.[0-9]{6} /event\?id=[0-9]+ user=42 action=transfer amount=1$' /data/audit.log; grep -vE '^[0-9]+\.[0-9]{6} /event' /data/audit.log | head -2 | cut -c1-70"
