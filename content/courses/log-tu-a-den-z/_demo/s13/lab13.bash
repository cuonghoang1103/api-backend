# Lab 13 — đáp án chạy thật. cwd = bản sao thư mục lab13/. Docker 29 + Compose v5.
date +%s > .t0; docker compose up -d 2>/dev/null; sleep 20; docker compose ps -a --format 'table {{.Service}}\t{{.Status}}'
docker compose logs --no-color api | head -3
docker compose logs --no-color --tail 2 worker
docker compose logs --no-color thumb | wc -l
for s in api worker thumb; do docker inspect -f "$s: ExitCode={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}} RestartCount={{.RestartCount}} Restart={{.HostConfig.RestartPolicy.Name}}:{{.HostConfig.RestartPolicy.MaximumRetryCount}}" lab13-$s-1; done
docker compose logs --no-color -t api 2>&1 | grep -c FATAL
docker events --since "$(cat .t0)" --until "$(date +%s)" --filter label=com.docker.compose.project=lab13 --filter type=container --format '{{.Time}} {{index .Actor.Attributes "com.docker.compose.service"}} {{.Action}} {{.Actor.Attributes.exitCode}}' | awk '$3 ~ /^(oom|die)$/ { $1 = strftime("%H:%M:%S", $1); print }'
docker inspect -f '{{.HostConfig.Memory}}' lab13-worker-1 | awk '{print $1/1024/1024 " MiB"}'
docker compose run --rm --no-deps -e PYTHONUNBUFFERED=1 thumb 2>&1 | tail -3; echo "mã thoát: ${PIPESTATUS[0]}"
docker compose run --rm --no-deps -e PYTHONUNBUFFERED=1 thumb python3 -X faulthandler /app/thumb.py 2>&1 | tail -8
docker compose down 2>/dev/null; rm -f .t0; docker ps -a --filter label=com.docker.compose.project=lab13 --format '{{.Names}}' | wc -l
