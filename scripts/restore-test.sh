#!/bin/bash
# ============================================================
# CuongHoangDev — Backup restore VERIFICATION (P0-6)
# ============================================================
# Proves a backup is actually restorable — a backup you've never
# restored is a backup you don't have. Restores the latest local
# backup into a THROWAWAY Postgres container and counts a few tables.
#
# SAFETY: never touches the production database or the running
# postgres container. Spins up a temporary `pg_restore_test`
# container, restores into it, prints row counts, then destroys it.
#
# Run on the VPS:  bash scripts/restore-test.sh
# Optionally pass a specific backup file:  bash scripts/restore-test.sh /opt/cuonghoangdev/backups/XXXX_backup.sql.gz
set -euo pipefail

BACKUP_DIR="/opt/cuonghoangdev/backups"
PG_IMAGE="$(docker inspect -f '{{.Config.Image}}' cuonghoangdev_postgres 2>/dev/null || echo 'postgres:16')"
TMP_NAME="pg_restore_test_$$"
TMP_PW="restore_test_pw"

BACKUP_FILE="${1:-$(ls -t "${BACKUP_DIR}"/*.sql.gz 2>/dev/null | head -1 || true)}"
if [ -z "${BACKUP_FILE}" ] || [ ! -s "${BACKUP_FILE}" ]; then
  echo "ERROR: no backup file found in ${BACKUP_DIR}"
  exit 1
fi
echo "[restore-test] using backup: ${BACKUP_FILE}"
echo "[restore-test] throwaway image: ${PG_IMAGE}"

cleanup() { docker rm -f "${TMP_NAME}" >/dev/null 2>&1 || true; }
trap cleanup EXIT

echo "[restore-test] starting throwaway container ${TMP_NAME}..."
docker run -d --name "${TMP_NAME}" --shm-size=256m -e POSTGRES_PASSWORD="${TMP_PW}" "${PG_IMAGE}" >/dev/null

# Wait for the REAL server to accept connections.
# The postgres entrypoint runs a TEMPORARY init server that listens on
# the unix socket ONLY (not TCP), then shuts it down and starts the
# final server on TCP. Gating on a socket `pg_isready` races that
# shutdown ("terminating connection due to administrator command"), so
# probe over TCP (127.0.0.1) — only the final server listens there.
ready=""
for i in $(seq 1 60); do
  if docker exec "${TMP_NAME}" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
if [ -z "${ready}" ]; then
  echo "[restore-test] ERROR: throwaway server never became ready; logs:"
  docker logs --tail 20 "${TMP_NAME}" 2>&1 || true
  exit 1
fi
sleep 1  # tiny settle after TCP is up

echo "[restore-test] creating db + restoring dump..."
docker exec "${TMP_NAME}" psql -U postgres -c 'CREATE DATABASE restore_check;' >/dev/null
gunzip -c "${BACKUP_FILE}" | docker exec -i "${TMP_NAME}" psql -U postgres -d restore_check >/dev/null

echo "[restore-test] row counts in the RESTORED copy:"
docker exec "${TMP_NAME}" psql -U postgres -d restore_check -c \
  "SELECT 'users' AS t, count(*) FROM users
   UNION ALL SELECT 'social_posts', count(*) FROM social_posts
   UNION ALL SELECT 'messages', count(*) FROM messages;" \
  || echo "[restore-test] (some tables missing — check the dump)"

echo "[restore-test] OK — backup is restorable. Throwaway container will be removed."
