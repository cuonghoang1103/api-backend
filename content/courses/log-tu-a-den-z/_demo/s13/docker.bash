# 13.1 — docker logs / events / inspect / mã thoát (chạy trên máy chủ có Docker; cwd = bản sao thư mục c13). Docker 29, Compose v5.
docker run -d --name lgz-orders --label lgz=c13 --init -e DB_URL=postgres://db:5432/shop -v ./app.js:/app/app.js:ro node:22-alpine node /app/app.js >/dev/null; sleep 4.5
docker logs lgz-orders
docker logs --tail 3 lgz-orders
docker logs -t --tail 2 lgz-orders
docker logs lgz-orders 2>/dev/null | wc -l
docker logs lgz-orders 2>&1 >/dev/null
docker logs lgz-orders 2>/dev/null | jq -c 'select(.msg == "order created") | {time, orderId}' | head -3
docker logs --since 3s lgz-orders 2>&1 | wc -l
docker inspect -f '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}' lgz-orders
docker run -d --name lgz-dem --label lgz=c13 -v ./dem.py:/w/dem.py:ro lgz-lab:1 python3 /w/dem.py >/dev/null; sleep 3; docker logs lgz-dem | wc -l
sleep 3.5; docker logs -t lgz-dem
docker run -d --name lgz-dem-u --label lgz=c13 -e PYTHONUNBUFFERED=1 -v ./dem.py:/w/dem.py:ro lgz-lab:1 python3 /w/dem.py >/dev/null; timeout 3.5 docker logs -f -t lgz-dem-u
date +%s > .t0; docker run -d --name lgz-orders-loi --label lgz=c13 --restart on-failure:3 -v ./app.js:/app/app.js:ro node:22-alpine node /app/app.js >/dev/null; sleep 9
docker ps -a --filter name=lgz-orders-loi --format '{{.Names}}  {{.Status}}'
docker inspect -f 'RestartCount={{.RestartCount}} ExitCode={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}' lgz-orders-loi
docker logs lgz-orders-loi
docker logs -t lgz-orders-loi 2>&1 | grep FATAL
docker events --since "$(cat .t0)" --until "$(date +%s)" --filter label=lgz=c13 --filter type=container --format '{{.Time}} {{.Actor.Attributes.name}} {{.Action}} exitCode={{.Actor.Attributes.exitCode}}' | awk '{ $1 = strftime("%H:%M:%S", $1); print }' | grep -v 'exitCode= *$' | grep -v 'exec_'
date +%s > .t1; docker run --name lgz-x0 --label lgz=c13 alpine true; docker run --name lgz-x1 --label lgz=c13 -v ./app.js:/app/app.js:ro node:22-alpine node /app/app.js 2>/dev/null; echo "mã thoát lệnh run: $?"
docker run --name lgz-x137 --label lgz=c13 -m 64m --memory-swap 64m -v ./an-ram.js:/a.js:ro node:22-alpine node /a.js | tail -2; echo "mã thoát lệnh run: ${PIPESTATUS[0]}"
docker run --name lgz-x139 --label lgz=c13 lgz-lab:1 python3 -c 'import ctypes; print("đọc địa chỉ 0..."); ctypes.string_at(0)'; echo "mã thoát lệnh run: $?"
docker run -d --name lgz-stop --label lgz=c13 alpine sleep 600 >/dev/null; s=$(date +%s.%N); docker stop lgz-stop >/dev/null; printf 'docker stop mất %.1f s\n' "$(echo "$(date +%s.%N) - $s" | bc)"
docker run -d --name lgz-stop-init --label lgz=c13 --init alpine sleep 600 >/dev/null; s=$(date +%s.%N); docker stop lgz-stop-init >/dev/null; printf 'docker stop mất %.1f s\n' "$(echo "$(date +%s.%N) - $s" | bc)"
for c in lgz-x0 lgz-x1 lgz-x137 lgz-x139 lgz-stop lgz-stop-init; do docker inspect -f '{{printf "%-14s" .Name}} ExitCode={{.State.ExitCode}}  OOMKilled={{.State.OOMKilled}}  Error="{{.State.Error}}"' $c; done
sleep 1; docker events --since "$(cat .t1)" --until "$(date +%s)" --filter label=lgz=c13 --filter type=container --format '{{.Time}} {{.Actor.Attributes.name}} {{.Action}} {{.Actor.Attributes.exitCode}} {{.Actor.Attributes.signal}}' | awk '{ $1 = strftime("%H:%M:%S", $1); print }' | grep -E ' (oom|kill|die|stop) '
docker run -d --name lgz-nolog --label lgz=c13 --log-driver none alpine echo xin chao >/dev/null; sleep 1; docker logs lgz-nolog
docker rm -f lgz-orders >/dev/null; docker logs lgz-orders
docker compose up -d --quiet-pull 2>/dev/null; sleep 5; docker compose logs --no-color | head -4
docker compose logs --no-color -t | sort -k3 | cut -c1-100 | head -8
docker compose logs --no-color -t --tail 2 api
docker compose logs --no-color --no-log-prefix worker
docker compose ps -a --format 'table {{.Service}}\t{{.Status}}'
docker compose down 2>/dev/null; docker rm -f $(docker ps -aq --filter label=lgz=c13) >/dev/null; rm -f .t0 .t1; docker ps -a --filter label=lgz=c13 --format '{{.Names}}' | wc -l
