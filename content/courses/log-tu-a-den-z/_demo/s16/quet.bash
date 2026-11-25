# 16.3 — quét log tìm bí mật bằng gitleaks 8.30.1: luật mặc định, rồi thêm luật riêng CCCD/số thẻ (cwd = _demo/s16/quet; logs/ do tao-log.py sinh, toàn chuỗi GIẢ)
python3 tao-log.py
wc -l logs/*
docker run --rm --network none -v "$PWD":/q -w /q zricethezav/gitleaks:v8.30.1 dir logs --no-banner --no-color --redact=60 -r mac-dinh.json 2>&1 | tail -1
jq -r '.[] | "\(.File):\(.StartLine)  \(.RuleID)  \(.Secret)"' mac-dinh.json
docker run --rm --network none -v "$PWD":/q -w /q zricethezav/gitleaks:v8.30.1 dir logs --no-banner --no-color --redact=60 -c luat-viet.toml -r viet.json 2>&1 | tail -1
jq -r '.[] | select(.RuleID | test("cccd|the")) | "\(.File):\(.StartLine)  \(.RuleID)  \(.Secret)"' viet.json
rm -f mac-dinh.json viet.json
