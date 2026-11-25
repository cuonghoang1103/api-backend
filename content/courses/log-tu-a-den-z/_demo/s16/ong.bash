# 16.3 — che ở đường ống: Grafana Alloy v1.22.0 đọc logs/ của bài quét, stage.replace rồi in (loki.echo); quét lại bằng gitleaks (cwd = _demo/s16/ong)
docker run -d --name lgz-c16-alloy --network none -v "$PWD/../quet":/q:ro -v "$PWD":/c:ro grafana/alloy:v1.22.0 run /c/che.alloy --storage.path=/tmp/a >/dev/null; sleep 10
docker logs lgz-c16-alloy 2>&1 | grep -o 'entry=".*" entry_timestamp' | sed 's/^entry="//; s/" entry_timestamp$//; s/\\"/"/g' > da-che.txt; wc -l < da-che.txt
grep -E 'CCCD|S3|Stripe|ghp_|access_token' da-che.txt
docker run --rm --network none -v "$PWD":/q -v "$PWD/../quet/luat-viet.toml":/luat.toml:ro -w /q zricethezav/gitleaks:v8.30.1 dir da-che.txt --no-banner --no-color -c /luat.toml 2>&1 | tail -1
docker rm -f lgz-c16-alloy >/dev/null; rm -f da-che.txt
