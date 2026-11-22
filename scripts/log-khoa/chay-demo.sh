#!/usr/bin/env bash
# Chạy lại toàn bộ output thật của khoá log-tu-a-den-z rồi sinh _ma.mjs.
#   bash scripts/log-khoa/chay-demo.sh
# Cần Docker; tự dựng ảnh log00-lab:1 (Ubuntu 24.04 + jq + python3 + tzdata + ripgrep) nếu chưa có.
# Container chỉ đọc/ghi thư mục _demo của khoá; gói log mẫu sinh lại trong container mỗi lần chạy.
set -euo pipefail
GOC="$(cd "$(dirname "$0")/../.." && pwd)"
DEMO="$GOC/content/courses/log-tu-a-den-z/_demo"
if ! docker image inspect log00-lab:1 >/dev/null 2>&1; then
  printf 'FROM ubuntu:24.04\nRUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends jq python3 tzdata ripgrep less gzip && rm -rf /var/lib/apt/lists/*\nENV TZ=Asia/Ho_Chi_Minh LANG=C.UTF-8\n' \
    | docker build -q -t log00-lab:1 --label dkhoc=log00 -
fi
docker run --rm --name log00-chay --tmpfs /tmp -e TZ=Asia/Ho_Chi_Minh -v "$DEMO":/demo -v "$GOC/scripts/log-khoa":/s:ro log00-lab:1 \
  bash -c 'cp /demo/tao-goi-log.py /demo/s02/*.py ~/ && python3 ~/tao-goi-log.py ~/log-lab >/dev/null && python3 /s/chay-demo.py /demo sh'
if ! docker image inspect log00-pwsh:1 >/dev/null 2>&1; then   # PowerShell 7 chạy NATIVE theo kiến trúc máy (ảnh mcr amd64 chạy qua qemu trên Mac M1 thì sập)
  A=$(uname -m); case "$A" in arm64|aarch64) A=arm64;; *) A=x64;; esac
  printf 'FROM log00-lab:1\nRUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends curl ca-certificates libicu74 && rm -rf /var/lib/apt/lists/* && mkdir -p /opt/pwsh && curl -sSL https://github.com/PowerShell/PowerShell/releases/download/v7.7.0/powershell-7.7.0-linux-%s.tar.gz | tar xz -C /opt/pwsh && chmod +x /opt/pwsh/pwsh && ln -s /opt/pwsh/pwsh /usr/local/bin/pwsh\n' "$A" \
    | docker build --platform linux/$( [ "$A" = arm64 ] && echo arm64 || echo amd64 ) -q -t log00-pwsh:1 --label dkhoc=log00 -
fi
docker run --rm --name log00-pwsh -e TZ=Asia/Ho_Chi_Minh -v "$DEMO":/demo -v "$GOC/scripts/log-khoa":/s:ro log00-pwsh:1 \
  bash -c 'python3 /demo/tao-goi-log.py ~/log-lab >/dev/null && python3 /s/chay-demo.py /demo ps1'
node "$GOC/scripts/log-khoa/sinh-ma.mjs"
