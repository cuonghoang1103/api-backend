#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# CT Shop · Lab 8 — two throw-away PostgreSQL 17 servers on your laptop
# Lab 8 — hai máy chủ PostgreSQL 17 dùng-xong-vứt trên laptop của bạn
# cuongthai.com/courses/postgresql
#
#   bash lab8-docker.sh up        # network + pglab8-primary (localhost:5481) + pglab8-replica (localhost:5482, BLANK)
#   bash lab8-docker.sh replica   # wipe pglab8-replica and rebuild it as a streaming replica of the primary
#   bash lab8-docker.sh status    # who is primary, who is replica, slot + lag
#   bash lab8-docker.sh down      # remove BOTH containers, their volumes and the network (everything of this lab)
#
# Works on macOS, Linux and Windows inside WSL 2 or Git Bash (Docker Desktop running).
# Windows PowerShell without bash: run the same docker commands by hand — replace the "\" line breaks with "`".
# Passwords are lab passwords on 127.0.0.1 only. Never reuse them on a real server.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

NET=pglab8-net
IMG=postgres:17
P=pglab8-primary
R=pglab8-replica
PW=${PGLAB8_PASSWORD:-ctshop-lab8}          # password of the superuser "postgres"
RPW=${PGLAB8_REPL_PASSWORD:-repl-lab8}      # password of the replication role "replicator"

run_server() {   # $1 = container name, $2 = host port
  docker run -d --name "$1" --network "$NET" -p "127.0.0.1:$2:5432" \
    -e POSTGRES_PASSWORD="$PW" -e POSTGRES_DB=ctshop -e TZ=Asia/Ho_Chi_Minh \
    -v "$1-data:/var/lib/postgresql/data" "$IMG" >/dev/null
}
wait_ready() {   # $1 = container name
  for _ in $(seq 1 60); do
    # -h 127.0.0.1: during first start the image runs a temporary socket-only server — wait for the real one
    if docker exec "$1" pg_isready -h 127.0.0.1 -U postgres -q 2>/dev/null; then echo "✓ $1 is ready"; return 0; fi
    sleep 1
  done
  echo "✗ $1 did not become ready — docker logs $1" >&2; exit 1
}

case "${1:-help}" in
  up)
    docker network inspect "$NET" >/dev/null 2>&1 || docker network create "$NET" >/dev/null
    run_server "$P" 5481
    run_server "$R" 5482
    wait_ready "$P"; wait_ready "$R"
    docker exec "$P" psql -U postgres -Atc "SELECT 'primary: ' || version()"
    ;;

  replica)
    # 1) on the primary: a role that may replicate, and a pg_hba line that lets it in from the docker network
    docker exec "$P" psql -U postgres -q -v ON_ERROR_STOP=1 \
      -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'replicator') THEN
            CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD '$RPW'; END IF; END \$\$;" \
      -c "SELECT pg_drop_replication_slot('replica1') FROM pg_replication_slots WHERE slot_name = 'replica1';" >/dev/null
    docker exec "$P" bash -c 'grep -q "^host replication replicator" "$PGDATA/pg_hba.conf" ||
      echo "host replication replicator samenet scram-sha-256" >> "$PGDATA/pg_hba.conf"'
    docker exec "$P" psql -U postgres -Atc "SELECT 'pg_hba reloaded: ' || pg_reload_conf()"
    # 2) the replica starts from a physical copy of the primary: wipe it, then pg_basebackup into its volume
    docker rm -f "$R" >/dev/null 2>&1 || true
    docker volume rm "$R-data" >/dev/null 2>&1 || true
    docker run --rm --network "$NET" -v "$R-data:/var/lib/postgresql/data" -e PGPASSWORD="$RPW" "$IMG" \
      pg_basebackup -h "$P" -U replicator -D /var/lib/postgresql/data \
                    -R -X stream -C -S replica1 --checkpoint=fast -P
    #   -R  write standby.signal + primary_conninfo (the server starts as a replica)
    #   -X stream  copy the WAL written DURING the backup too     -C -S replica1  create + use a replication slot
    #   --checkpoint=fast  do not wait for the next scheduled checkpoint (minutes) before copying
    # 3) start a server on that copy — it finds standby.signal and follows the primary
    run_server "$R" 5482
    wait_ready "$R"
    docker exec "$R" psql -U postgres -Atc "SELECT 'replica in recovery: ' || pg_is_in_recovery()"
    ;;

  status)
    for c in "$P" "$R"; do
      printf '%-15s ' "$c"
      docker exec "$c" psql -U postgres -Atc \
        "SELECT CASE WHEN pg_is_in_recovery() THEN 'replica' ELSE 'primary' END" 2>/dev/null || echo 'not running'
    done
    docker exec "$P" psql -U postgres -c "SELECT application_name, state, sync_state,
        pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) AS behind, replay_lag
      FROM pg_stat_replication" 2>/dev/null || true
    docker exec "$P" psql -U postgres -c "SELECT slot_name, active, wal_status,
        pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS wal_kept
      FROM pg_replication_slots" 2>/dev/null || true
    ;;

  down)
    docker rm -f "$P" "$R" >/dev/null 2>&1 || true
    docker volume rm "$P-data" "$R-data" >/dev/null 2>&1 || true
    docker network rm "$NET" >/dev/null 2>&1 || true
    echo "✓ removed $P, $R, their volumes and $NET"
    ;;

  *)
    sed -n '2,16p' "$0"
    ;;
esac
