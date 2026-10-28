#!/bin/sh
# Sinh dữ liệu THẬT cho mô phỏng "Từ mã C tới chương trình chạy" (cpu-lab · pipeline):
# gcc + objdump + readelf trong container Ubuntu (image os-lab của khoá OS, có gcc aarch64; tự cài gcc x86-64 chéo).
#   sh frontend/scripts/cpu-lab/gen-pipeline.sh
# Kết quả: frontend/src/components/cpu-lab/data/pipeline.json (commit vào repo — trang web KHÔNG gọi trình biên dịch).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=$(mktemp -d)
IMG=${CPU_LAB_IMAGE:-os-lab}
docker run --rm -v "$HERE":/work:ro -v "$OUT":/out "$IMG" sh /work/gen-in-docker.sh
node "$HERE/build-pipeline-json.mjs" "$OUT" "$HERE/../../src/components/cpu-lab/data/pipeline.json"
rm -rf "$OUT"
