#!/usr/bin/env bash
# Lab 8.5 — chạy bản Spring của API (cổng 47082). Dựng trước như chay.sh.
cd "$(dirname "$0")"
exec java -Dstdout.encoding=UTF-8 ${JAVA_OPTS:-} -cp "src/main/resources:target/classes:target/lib/*" com.cuongthai.lab8.Lab8App \
  --spring.mongodb.uri='mongodb://127.0.0.1:47017/lab8?directConnection=true' --spring.main.web-application-type=servlet \
  --server.port=47082 --server.address=127.0.0.1 "$@"
