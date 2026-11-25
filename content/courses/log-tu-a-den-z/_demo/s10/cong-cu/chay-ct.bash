#!/usr/bin/env bash
# chay-ct.sh <tệp.sh trong _demo> <thư mục dữ liệu> — chạy lệnh trong container lgz-lab:1, cwd ~/lab = thư mục dữ liệu (chỉ đọc)
set -euo pipefail
T=$(realpath "$1"); D=$(realpath "$2")
docker run --rm --name lgz-chay -e TZ=Asia/Ho_Chi_Minh --user "$(id -u):$(id -g)" -v "$D":/lab:ro -v "$(dirname "$T")":/demo -v "$(cd "$(dirname "$0")" && pwd)":/cc:ro lgz-lab:1 \
  python3 /cc/chay.py "/demo/$(basename "$T")" /lab
