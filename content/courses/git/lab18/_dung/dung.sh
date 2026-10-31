#!/usr/bin/env bash
# Dựng s18-tai-nan-nhom.mjs từ _dung/s18.tpl + _dung/out/*.txt  (cần python3).
set -e
cd "$(dirname "$0")"
python3 render.py s18.tpl ../../s18-tai-nan-nhom.mjs
echo "đã dựng $(cd ../.. && pwd)/s18-tai-nan-nhom.mjs"
