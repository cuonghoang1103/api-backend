#!/usr/bin/env bash
# dung-pg.bash — dựng "máy chủ CSDL" lgz-pg12 (PostgreSQL 17.12 + pgAudit + pgBadger, ảnh ../anh/Dockerfile) với cấu hình MẶC ĐỊNH của ảnh docker.
# --network none: không ra mạng; máy khách là psql chạy ngay trong container, nối qua TCP tới các IP giả gắn lên lo
# (10.20.0.15 = laptop dev An, 10.20.0.23 = máy thực tập sinh, 10.20.0.50 = máy chủ ứng dụng, 203.0.113.66 = kẻ dò từ Internet).
set -euo pipefail
docker rm -f -v lgz-pg12 >/dev/null 2>&1 || true
docker run -d --name lgz-pg12 --label lgz=c12 --network none --cap-add NET_ADMIN --memory 2g --memory-swap 2g --cpus 2 \
  -e POSTGRES_PASSWORD=lab-chi-dung-o-may-nha -e TZ=Asia/Ho_Chi_Minh -e PGTZ=Asia/Ho_Chi_Minh lgz-pg12:1 >/dev/null
until docker exec -u postgres lgz-pg12 pg_isready -q 2>/dev/null && docker logs lgz-pg12 2>&1 | grep -q 'PostgreSQL init process complete'; do sleep 1; done
until docker exec -u postgres lgz-pg12 pg_isready -q; do sleep 1; done
for ip in 10.20.0.15 10.20.0.23 10.20.0.50 203.0.113.66; do docker exec lgz-pg12 ip addr add $ip/32 dev lo; done
docker exec -i -u postgres lgz-pg12 psql -q -v ON_ERROR_STOP=1 <<'SQL'
CREATE ROLE app LOGIN PASSWORD 'App-Lab-2026';
CREATE ROLE an LOGIN PASSWORD 'An-Lab-2026';
CREATE ROLE intern LOGIN PASSWORD 'Intern-Lab-2026';
CREATE DATABASE shop OWNER app;
\c shop
SET ROLE app;
CREATE TABLE accounts (id int PRIMARY KEY, owner text, balance numeric);
INSERT INTO accounts VALUES (1, 'An', 1000), (2, 'Binh', 500);
CREATE TABLE customers (id serial PRIMARY KEY, email text UNIQUE, phone text, full_name text);
INSERT INTO customers (email, phone, full_name) VALUES ('an@example.com', '0901234567', 'Nguyễn Văn An'), ('binh@example.com', '0912345678', 'Trần Thị Bình');
CREATE TABLE coupons (code text PRIMARY KEY, pct int);
INSERT INTO coupons VALUES ('TET2027', 20), ('FREESHIP', 100);
CREATE TABLE orders_old AS SELECT g AS id, now() - g * interval '1 hour' AS created_at FROM generate_series(1, 500) g;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO an, intern;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO an, intern;
GRANT CREATE ON SCHEMA public TO an, intern;
RESET ROLE;
SQL
docker exec lgz-pg12 mkdir -p /lab; for f in "$(dirname "$0")"/../*.sql; do docker cp "$f" lgz-pg12:/lab/; done
echo "lgz-pg12 sẵn sàng"
