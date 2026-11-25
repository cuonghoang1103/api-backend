#!/usr/bin/env bash
# dung-mysql.bash — MySQL 8.4 (ảnh mysql:8.4, cấu hình mặc định) cho 12.4. --network none; máy khách mysql chạy ngay trong container qua 127.0.0.1.
set -euo pipefail
docker rm -f -v lgz-mysql >/dev/null 2>&1 || true
docker run -d --name lgz-mysql --label lgz=c12 --network none --memory 2g --memory-swap 2g --cpus 2 \
  -e MYSQL_ROOT_PASSWORD=Root-Lab-2026 -e TZ=Asia/Ho_Chi_Minh mysql:8.4 >/dev/null
until docker logs lgz-mysql 2>&1 | grep -q 'ready for connections.*port: 3306'; do sleep 2; done
docker exec lgz-mysql bash -c 'printf "[client]\nuser=root\npassword=Root-Lab-2026\n" > /root/.my.cnf'
docker exec -i lgz-mysql mysql <<'SQL'
CREATE DATABASE shop;
CREATE USER 'app'@'%' IDENTIFIED BY 'App-Lab-2026';
GRANT ALL ON shop.* TO 'app'@'%';
USE shop;
SET SESSION cte_max_recursion_depth = 1000000;
CREATE TABLE orders (id INT PRIMARY KEY, customer_email VARCHAR(80), total INT);
INSERT INTO orders WITH RECURSIVE g(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM g WHERE n < 600000)
  SELECT n, CONCAT('khach', n * 7919 % 50000, '@example.com'), (n * 37 % 5000 + 1) * 1000 FROM g;
SQL
echo "lgz-mysql sẵn sàng"
