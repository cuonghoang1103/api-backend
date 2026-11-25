#!/usr/bin/env bash
# chay-s15.bash <thư mục làm việc> — chạy lại TOÀN BỘ output thật của Chương 15 (~35 phút; cần Docker, Google Chrome + Node 22 cho bước KQL).
# Ảnh: grafana/loki:3.7.10, grafana/alloy:v1.22.0, grafana/grafana:13.2.6, grafana/logcli:3.7.10, binwiederhier/ntfy:v2.38.1,
#      docker.elastic.co/{elasticsearch/elasticsearch,kibana/kibana,beats/filebeat}:9.5.7, node:22-alpine, alpine, ubuntu:24.04, curlimages/curl:8.11.1.
# KHÔNG tạo mạng docker nào: mỗi bộ lab là một netns --network none dùng chung (các khoá khác đang chụp Chromium không bị ERR_NETWORK_CHANGED).
# Dựng ảnh lgz-c15-vm:1 (systemd + sshd) cần mạng apt: docker build -t lgz-c15-vm:1 loki/vm (qua khoá nặng).
# Thư mục tạm cho Playwright + cầu socket: $LAB15_TMP (mặc định ~/.lab15).
# Tệp lệnh đuôi .bash (KHÔNG .sh) để chay-demo.py không chạy nhầm. Dữ liệu mẫu: gói log của khoá (bài 0.1) — web/access.log, linux/auth.log.
set -euo pipefail
S=$(cd "$(dirname "$0")" && pwd); W=$(realpath -m "${1:?thư mục làm việc}"); CHAY="$S/../s10/cong-cu/chay.py"; GOI=${GOI:-$W/goi}
[ -f "$GOI/linux/auth.log" ] || python3 "$S/../tao-goi-log.py" "$GOI" >/dev/null
mkdir -p "$W"; cp -r "$S/loki" "$S/elk" "$S/lab15" "$W/"; for b in loki elk; do mkdir -p "$W/$b/mau/linux" "$W/$b/mau/web"; cp "$GOI/linux/auth.log" "$W/$b/mau/linux/"; cp "$GOI/web/access.log" "$W/$b/mau/web/"; done
CHI=${CHI:-loki,elk,tls}   # chạy riêng một phần: CHI=loki | CHI=elk | CHI=tls
# ── Bộ lab 1: Loki (15.1, 15.2, 15.5, Lab 15)
if [[ $CHI == *loki* ]]; then
cd "$W/loki"; docker compose down -v >/dev/null 2>&1 || true; docker compose up -d >/dev/null 2>&1
until docker exec lgz-c15-net wget -qO- 127.0.0.1:3100/ready 2>/dev/null | grep -q ready; do sleep 3; done
until docker exec lgz-c15-net wget -qO- 127.0.0.1:12345/api/v0/web/components/discovery.docker.lab 2>/dev/null | jq -e '.exports[0].value.value | length > 0' >/dev/null; do sleep 5; done
sleep 30
for f in tap-trung loki canh-bao lab15; do BASH_ENV="$S/cong-cu/loki-env.bash" python3 "$CHAY" "$S/$f.bash" "$W/loki"; done
docker compose down -v >/dev/null 2>&1
fi
# ── Bộ lab 2: ELK (15.3, 15.5 phần Kibana). Kibana cần trình duyệt ⇒ cầu socket ra cổng 45601 của máy (cau-sock.mjs)
if [[ $CHI == *elk* ]]; then
cd "$W/elk"; docker compose down -v >/dev/null 2>&1 || true; docker compose up -d net es >/dev/null 2>&1
source "$S/cong-cu/elk-env.bash"
until es _cluster/health 2>/dev/null | grep -q '"status":"\(green\|yellow\)"'; do sleep 4; done
es _security/user/kibana_system/_password -XPOST -d '{"password":"lab15-kibana-chi-o-may-minh"}' >/dev/null
docker compose up -d kibana >/dev/null 2>&1; mkdir -p ${LAB15_TMP:-$HOME/.lab15}/sock ${LAB15_TMP:-$HOME/.lab15}/pw; cp "$S/cong-cu/kql.mjs" ${LAB15_TMP:-$HOME/.lab15}/pw/
[ -d ${LAB15_TMP:-$HOME/.lab15}/pw/node_modules/playwright-core ] || (cd ${LAB15_TMP:-$HOME/.lab15}/pw && npm init -y >/dev/null && npm i --silent playwright-core)
docker rm -f lgz-c15e-cau >/dev/null 2>&1 || true
docker run -d --name lgz-c15e-cau --network container:lgz-c15e-net -v ${LAB15_TMP:-$HOME/.lab15}/sock:/sock -v "$S/cong-cu/cau-sock.mjs":/cau.mjs:ro node:22-alpine node /cau.mjs trong /sock/kibana.sock 5601 >/dev/null
node "$S/cong-cu/cau-sock.mjs" ngoai 45601 ${LAB15_TMP:-$HOME/.lab15}/sock/kibana.sock & CAU=$!
until curl -s -u elastic:$ELASTIC_PASSWORD localhost:45601/api/status 2>/dev/null | grep -q '"level":"available"'; do sleep 4; done
curl -s -u elastic:$ELASTIC_PASSWORD -H 'kbn-xsrf: lab' -H 'content-type: application/json' localhost:45601/api/data_views/data_view \
  -d '{"data_view":{"id":"filebeat","name":"filebeat-*","title":"filebeat-*","timeFieldName":"@timestamp"}}' >/dev/null
bash "$S/cong-cu/elk-dat-lai.bash" >/dev/null
for f in elk elk2 kibana; do BASH_ENV="$S/cong-cu/elk-env.bash" python3 "$CHAY" "$S/$f.bash" "$W/elk"; done
kill $CAU; docker rm -f lgz-c15e-cau >/dev/null; docker compose -f compose.yaml -f tz.yaml down -v >/dev/null 2>&1
fi
# ── 15.4: TLS hai chiều
if [[ $CHI == *tls* ]]; then
mkdir -p "$W/tls"; cp "$S/windows/loki-tls.yaml" "$W/tls/"; python3 "$CHAY" "$S/tls.bash" "$W/tls"
docker run --rm --network none -v "$S/windows/config.alloy":/c.alloy:ro grafana/alloy:v1.22.0 fmt /c.alloy >/dev/null && echo "windows/config.alloy: alloy fmt OK"
fi
echo "xong: $(ls "$S"/*.out.txt | wc -l) tệp output"
