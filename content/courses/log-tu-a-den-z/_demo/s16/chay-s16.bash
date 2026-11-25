#!/usr/bin/env bash
# chay-s16.bash — chạy lại TOÀN BỘ output thật của Chương 16 (~6 phút; cần Docker; bước giá CloudWatch cần Internet).
# Ảnh: lgz-c16-vm:1 (docker build -t lgz-c16-vm:1 vm — qua khoá nặng), node:22-alpine, eclipse-temurin:21-jdk, nginx:1.27-alpine,
#      zricethezav/gitleaks:v8.30.1, grafana/alloy:v1.22.0, grafana/loki:3.7.10, cgr.dev/chainguard/minio(+minio-client), alpine.
# Mọi container --network none (MinIO client dùng chung netns của MinIO). node_modules pino/winston: NM=… (mặc định lab Ch10);
# jar SLF4J/Logback cho java/: C16LIB=… (slf4j-api 2.0.17, logback-core/classic 1.5.38). Gói log mẫu: GOI=… (tao-goi-log.py).
set -euo pipefail
S=$(cd "$(dirname "$0")" && pwd); CHAY="$S/../s10/cong-cu/chay.py"; export BASH_ENV="$S/cong-cu/env.bash"
export GOI=${GOI:-$HOME/.rtq-lgz/goi}; [ -f "$GOI/web/access.log" ] || python3 "$S/../tao-goi-log.py" "$GOI" >/dev/null
for f in bi-mat java nginx quet ong worm dung-luong chinh-sach; do python3 "$CHAY" "$S/$f.bash" "$S/$f"; done
rm -rf "$S/quet/logs"; docker run --rm -v "$S":/d alpine sh -c 'rmdir /d/java/lib /d/*/node_modules 2>/dev/null; true'   # điểm mount rỗng do docker tạo
for f in luu toan-ven nep lab16; do bash "$S/cong-cu/may.bash" len; python3 "$CHAY" "$S/$f.bash" "$S"; done
bash "$S/cong-cu/may.bash" xuong
