#!/usr/bin/env bash
# chay-s13.bash <thư mục làm việc> — chạy lại TOÀN BỘ output thật của Chương 13 (~8 phút; cần Docker, mạng để kéo ảnh).
# Ảnh: node:22-alpine, alpine, nginx:1.27-alpine, curlimages/curl:8.11.1, python:3.13-alpine, rancher/k3s:v1.33.5-k3s1,
#      motoserver/moto:5.1.18, amazon/aws-cli:2.32.0, lgz-lab:1 (Ubuntu 24.04 + python3/jq — dựng trong chay-s10.bash).
# Mọi container/mạng mang tiền tố lgz-/lab13 và được dọn khi xong. Tệp lệnh đuôi .bash (KHÔNG .sh) để chay-demo.py không chạy nhầm.
set -euo pipefail
S=$(cd "$(dirname "$0")" && pwd); W=$(realpath -m "${1:?thư mục làm việc}"); CHAY="$S/../s10/cong-cu/chay.py"
mkdir -p "$W"/{c13,proxy,cloud,lab13}
cp "$S"/c13/* "$W/c13/"; python3 "$CHAY" "$S/docker.bash" "$W/c13"
# 13.2 — k3s trong container đặc quyền (chỉ máy lab của bạn). kubectl = hàm trong cong-cu/k8s-env.bash
docker rm -f -v lgz-k3s >/dev/null 2>&1 || true
docker run -d --name lgz-k3s --privileged --tmpfs /run --tmpfs /var/run rancher/k3s:v1.33.5-k3s1 server --disable traefik --disable metrics-server --node-name lab13 >/dev/null
timeout 180 bash -c 'until docker exec lgz-k3s kubectl get nodes 2>/dev/null | grep -q " Ready"; do sleep 3; done'
for i in node:22-alpine alpine:latest nginx:1.27-alpine; do docker save "$i" | docker exec -i lgz-k3s ctr images import - >/dev/null; done
docker cp "$S/." lgz-k3s:/lab; BASH_ENV="$S/cong-cu/k8s-env.bash" python3 "$CHAY" "$S/k8s.bash" "$S"
docker rm -f -v lgz-k3s >/dev/null
# 13.3 — edge giả lập + nginx gốc + Express 5
cp "$S"/proxy/* "$W/proxy/"; [ -d "$W/proxy/node_modules" ] || docker run --rm --user "$(id -u):$(id -g)" -e npm_config_cache=/tmp/nc -v "$W/proxy":/w -w /w node:22-alpine npm i --silent express@5 express-rate-limit@8
[ -d "$W/proxy/logs" ] && docker run --rm -v "$W/proxy":/w alpine rm -rf /w/logs
BASH_ENV="$S/cong-cu/proxy-env.bash" python3 "$CHAY" "$S/proxy.bash" "$W/proxy"
# 13.4 — moto + AWS CLI; bản ghi mẫu
cp "$S"/cloud/tao-mau.py "$W/cloud/"; BASH_ENV="$S/cong-cu/aws-env.bash" python3 "$CHAY" "$S/cloud.bash" "$W/cloud"
# Lab 13
cp "$S"/lab13/* "$W/lab13/"; python3 "$CHAY" "$S/lab13.bash" "$W/lab13"
echo "xong: $(ls "$S"/*.out.txt | wc -l) tệp output"
