#!/bin/bash
# chay-bam.sh — bài 6.3: thấy migration phải chạy TRƯỚC, rồi băm một lượt mọi mật khẩu thô (chạy trong thư mục legacy-thu-vien, sau mvn compile).
# Cần stack lab đang chạy (docker compose up -d). Mạng Docker của stack: lgc-thuvien_default.
NAP=${NAP:-docker compose exec -T db mysql --default-character-set=utf8mb4 -uroot -p123456 thuvien}
JAR=${JAR:-$HOME/.m2/repository/com/mysql/mysql-connector-j/26.10.0/mysql-connector-j-26.10.0.jar}
{ echo "DROP PROCEDURE IF EXISTS sp_overdue_report;"; cat db/thuvien.sql; } | $NAP 2>/dev/null       # dữ liệu gốc: mật khẩu thô, VARCHAR(50)
J() { docker run --rm --user $(id -u):$(id -g) --network lgc-thuvien_default -e 'DB_URL=jdbc:mysql://db:3306/thuvien?useSSL=false&allowPublicKeyRetrieval=true' \
      -e HOME=/tmp -v "$JAR":/cj.jar:ro -v "$PWD":/src -w /src --entrypoint java maven:3.9-eclipse-temurin-8 -cp target/classes:/cj.jar com.thuvien.tools.BamMatKhauCu 2>&1; }
echo '$ java … com.thuvien.tools.BamMatKhauCu      # quên chạy migration'; J | grep -v "^\s*at " | head -3
echo '$ mysql thuvien < db/migrations/V6_3__mat_khau_bam.sql'; $NAP < db/migrations/V6_3__mat_khau_bam.sql 2>/dev/null
echo '$ java … com.thuvien.tools.BamMatKhauCu'; J
echo '$ java … com.thuvien.tools.BamMatKhauCu      # chạy lại'; J
echo 'SELECT username, LEFT(password, 40) AS dau, LENGTH(password) AS dai FROM users;' | $NAP 2>/dev/null
