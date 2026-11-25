#!/usr/bin/env bash
# lab-up.bash — dựng Lab 10: app Node (pino) + nginx đứng trước, log ra thư mục ./logs. Cần Docker.
#   bash lab-up.bash      (dọn: docker rm -f lgz-nginx lgz-node)
# Hai container dùng CHUNG mạng (nginx gọi app ở 127.0.0.1:3000) — không tạo mạng docker mới.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p logs && : > logs/app.log
# npm i pino@9 pino-http@10 pino-pretty@13 winston@3 đã chạy sẵn trong thư mục này (node_modules/)
docker run -d --name lgz-node --user "$(id -u):$(id -g)" -p 127.0.0.1:41080:8080 \
  -v "$PWD":/w -w /w node:22-alpine \
  sh -c 'while true; do node app.js >> logs/app.log 2>&1; echo "$(date -u +%FT%TZ) supervisor: app exited with code $?, restarting in 3s" >> logs/app.log; sleep 3; done' >/dev/null
docker run -d --name lgz-nginx --network container:lgz-node \
  -v "$PWD/nginx.conf":/etc/nginx/nginx.conf:ro -v "$PWD/logs":/var/log/nginx nginx:1.27-alpine >/dev/null
sleep 2 && curl -s -o /dev/null -w 'nginx -> app: %{http_code}\n' http://127.0.0.1:41080/api/products
