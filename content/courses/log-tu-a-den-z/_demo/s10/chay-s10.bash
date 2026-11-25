#!/usr/bin/env bash
# chay-s10.bash <thư mục làm việc> — chạy lại TOÀN BỘ output thật của Chương 10 (cần Docker; ~6 phút).
# Dựng Lab 10 (nginx + Node), bắn lưu lượng, build app Spring + Log4Shell demo, chạy mọi tệp lệnh, ghi *.out.txt cạnh tệp lệnh.
# Lệnh đọc log chạy trong container lgz-lab:1 (Ubuntu 24.04: mawk 1.3.4, jq 1.7 — như log00-lab:1 của các chương trước);
# lệnh docker/curl chạy trên máy chủ. chay.py = cùng luật với scripts/log-khoa/chay-demo.py nhưng cho từng tệp + cwd tuỳ chọn.
set -euo pipefail
S10=$(cd "$(dirname "$0")" && pwd); W=$(realpath -m "${1:?thư mục làm việc}"); CC=${CC:-$(dirname "$0")/cong-cu}
CC=$(realpath "$CC")
docker rm -f lgz-nginx lgz-node lgz-spring lgz-httpd >/dev/null 2>&1 || true
docker image inspect lgz-lab:1 >/dev/null 2>&1 || printf 'FROM ubuntu:24.04\nRUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends jq python3 tzdata ripgrep less gzip && rm -rf /var/lib/apt/lists/*\nENV TZ=Asia/Ho_Chi_Minh LANG=C.UTF-8\n' | docker build -q -t lgz-lab:1 -
mkdir -p "$W"; [ -d "$W/logs" ] && docker run --rm -v "$W/logs":/l alpine:latest sh -c 'rm -rf /l/*'
cp "$S10"/web-lab/* "$W"/
[ -d "$W/node_modules" ] || docker run --rm --user "$(id -u):$(id -g)" -e npm_config_cache=/tmp/nc -v "$W":/w -w /w node:22-alpine \
  sh -c 'npm init -y >/dev/null && npm i --silent pino@9 pino-http@10 pino-pretty@13 winston@3'
bash "$W/lab-up.bash"; python3 "$W/tao-luu-luong.py" http://127.0.0.1:41080
python3 "$S10/../tao-goi-log.py" "$W/goi" >/dev/null
for f in trang-thai nginx-doc node-doc cau-truc tan-cong lab10; do bash "$CC/chay-ct.bash" "$S10/$f.bash" "$W"; done
bash "$CC/chay-ct.bash" "$S10/iis.bash" "$W/goi"
python3 "$CC/chay.py" "$S10/node-host.bash" "$W"
python3 "$CC/chay.py" "$S10/apache.bash" "$W"
rm -rf "$W/spring" && cp -a "$S10/spring-lab" "$W/spring" && bash "$CC/mvn-ct.bash" "$W/spring" package -DskipTests 2>&1 | grep -v copy_reference || true
bash "$CC/mvn-ct.bash" "$W/spring" dependency:copy -Dartifact=org.slf4j:slf4j-simple:2.0.18 -DoutputDirectory=extra 2>&1 | grep -v copy_reference || true
for f in spring-doc spring-cauhinh spring-mdc-json; do docker rm -f lgz-spring >/dev/null 2>&1 || true; python3 "$CC/chay.py" "$S10/$f.bash" "$W/spring"; done
docker rm -f lgz-spring >/dev/null 2>&1 || true
rm -rf "$W/l4j2" && cp -a "$S10/spring-lab" "$W/l4j2" && mv "$W/l4j2/pom-log4j2.xml" "$W/l4j2/pom.xml" \
  && rm "$W/l4j2/src/main/resources/logback-lab.xml" "$W/l4j2/logback-bench.xml" "$W/l4j2/src/main/java/vn/lab/shop/LogBench.java"
bash "$CC/mvn-ct.bash" "$W/l4j2" package -DskipTests 2>&1 | grep -v copy_reference || true
python3 "$CC/chay.py" "$S10/spring-log4j2.bash" "$W/l4j2"
rm -rf "$W/l4s" && cp -a "$S10/log4shell-lab" "$W/l4s"
for v in 2.14.1 2.17.1; do for a in core api; do bash "$CC/mvn-ct.bash" "$W/l4s" dependency:copy -Dartifact=org.apache.logging.log4j:log4j-$a:$v -DoutputDirectory=lib-$v 2>&1 | grep -v copy_reference || true; done; done
python3 "$CC/chay.py" "$S10/log4shell.bash" "$W/l4s"
docker rm -f lgz-nginx lgz-node >/dev/null 2>&1 || true
echo "xong: $(ls "$S10"/*.out.txt | wc -l) tệp output"
