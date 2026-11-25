# Ảnh lab Chương 12: PostgreSQL 17 (Debian) + pgAudit + pgBadger + iproute2 (gắn IP giả lên lo để giả nhiều máy khách)
FROM postgres:17
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-17-pgaudit pgbadger iproute2 jq \
 && rm -rf /var/lib/apt/lists/*
