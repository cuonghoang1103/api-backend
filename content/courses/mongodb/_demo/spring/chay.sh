#!/usr/bin/env bash
# Bài 8.4 — chạy một thí nghiệm Spring Data MongoDB:  ./chay.sh <decimal|tx|bulk|audit> [--thuộc-tính=giá-trị …]
# Dựng một lần trước:  mvn -q package dependency:copy-dependencies -DoutputDirectory=target/lib -DskipTests
# (tương đương: javac -d target/classes -cp 'target/lib/*' src/main/java/com/cuongthai/mgo/*.java + chép application.properties)
cd "$(dirname "$0")"
exec java -Dstdout.encoding=UTF-8 -cp "src/main/resources:target/classes:target/lib/*" com.cuongthai.mgo.App "$@" 2>&1 | grep -v '^WARNING'
