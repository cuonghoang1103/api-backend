#!/usr/bin/env bash
# chay-s12.bash <thư mục làm việc> — chạy lại TOÀN BỘ output thật của Chương 12 (~12 phút; cần Docker; mạng chỉ để kéo ảnh/npm lần đầu).
# Ảnh: lgz-pg12:1 (dựng từ anh/Dockerfile = postgres:17 + pgaudit + pgbadger), mysql:8.4, mcr.microsoft.com/mssql/server:2022-latest, node:22-alpine.
# Mọi container mang tiền tố lgz-, --network none (không tạo mạng docker), --memory 2g; dọn khi xong. Tệp lệnh đuôi .bash — chay-demo.py không chạy nhầm.
# Chạy lại ⇒ PID/giờ/ms đổi: soát số trong lời bài 12.1–12.5 (ghi ở đầu mỗi tệp bài).
set -euo pipefail
S=$(cd "$(dirname "$0")" && pwd); W=$(realpath -m "${1:?thư mục làm việc}"); CHAY="$S/cong-cu/chay-ct.py"
docker image inspect lgz-pg12:1 >/dev/null 2>&1 || docker build -q -t lgz-pg12:1 "$S/anh"
# 12.1–12.3 — PostgreSQL 17 (một máy chủ, các bước nối tiếp nhau: cấu hình của bước trước còn giữ)
bash "$S/cong-cu/dung-pg.bash"
for f in pglog cham kiemtoan do-mat-khau; do python3 "$CHAY" "$S/$f.bash"; done
docker rm -f -v lgz-pg12 >/dev/null
# 12.4 — MySQL 8.4 và SQL Server 2022 (mỗi cái một container 2 GB, lần lượt)
bash "$S/cong-cu/dung-mysql.bash"; MAC=mysql python3 "$CHAY" "$S/mysql.bash"; docker rm -f -v lgz-mysql >/dev/null
bash "$S/cong-cu/dung-mssql.bash"; MAC=mssql python3 "$CHAY" "$S/mssql.bash"; docker rm -f -v lgz-mssql >/dev/null
# Lab 12 — compose (db network_mode none + api network_mode service:db) trong thư mục làm việc
mkdir -p "$W"; rm -rf "$W/lab12"; cp -r "$S/lab12" "$W/"; cp "$S/lab12.bash" "$W/"
docker run --rm --memory 1g --cpus 1 --user "$(id -u):$(id -g)" -e npm_config_cache=/tmp/nc -v "$W/lab12/app":/w -w /w node:22-alpine npm i --silent
(cd "$W" && MAC=lab12db python3 "$CHAY" lab12.bash); cp "$W/lab12.out.txt" "$S/"
echo "xong: $(ls "$S"/*.out.txt | wc -l) tệp output"
