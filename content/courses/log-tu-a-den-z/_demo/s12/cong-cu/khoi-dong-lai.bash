#!/usr/bin/env bash
# khoi-dong-lai.bash [container] — docker restart + gắn lại IP giả lên lo (netns mới sau restart) + chờ sẵn sàng.
C=${1:-lgz-pg12}
docker restart "$C" >/dev/null
for ip in 10.20.0.15 10.20.0.23 10.20.0.50 203.0.113.66; do docker exec "$C" ip addr add $ip/32 dev lo 2>/dev/null; done
for i in $(seq 60); do docker exec -u postgres "$C" pg_isready -q 2>/dev/null && break; sleep 1; done; sleep 1
