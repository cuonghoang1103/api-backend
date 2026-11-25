# Lời giải Chương 7 — Nâng cấp phiên bản an toàn (soạn 24/11/2026, agent rfc, máy nhà Linux)

Mọi output trong bài 7.1–7.5 sinh ra từ đúng các patch/tệp này. Áp patch: `git am <thư mục>/*.patch` trên nhánh xuất phát ghi dưới.

## java/ — legacy-thu-vien
- `ch7/` (7 commit, áp lên nhánh `ch6`, 49 test): 7.1 mốc 1–2 + commit tính năng Java 17; 7.5 mốc 3 Tomcat 10.1/jakarta + `NANG-CAP.md`.
- `ch7-rewrite/` (2 commit, áp lên `ch6`): output NGUYÊN VĂN của OpenRewrite `UpgradeToJava17` + `JakartaEE10` (runNoFork), rồi commit sửa tay (bài 7.3).
- Chạy e2e của Chương 3 trên ảnh mới: `mvn -B -f e2e/pom.xml test` (cần Docker + JDK 17; thư mục làm việc phải là gốc repo vì test đọc `..`).

## spring/ — legacy-spring-api (repo lab MỚI, bài 7.2/7.3)
Dựng repo gốc: `bash lab/_tao-git-spring.sh lab/legacy-spring-api /tmp/x/legacy-spring-api` ⇒ commit `644975a` (Boot 2.5.15, Java 8, 8 test).
- `nang-cap/` (8 commit): golden master HTTP (`tools/goi-api.sh`) → 2.7.18 + migrator → Security 5.8.16 → Java 17 → 3.0.13 → 3.5.16 → gỡ migrator.
- `rewrite/` (2 commit, áp lên `644975a`): OpenRewrite `UpgradeSpringBoot_3_5` (rewrite-spring 6.37.1) nguyên văn (8/8 test đỏ) → sửa tay.
- `thu-boot4/` (1 commit, áp sau `nang-cap`): Boot 4.1.3 — đổi gói AutoConfigureMockMvc, Jackson 3 đổi thứ tự thuộc tính JSON.
- `goi-api.sh` chạy jar trong `eclipse-temurin:<JDK>-jre`, cổng 127.0.0.1:41881 (đổi bằng biến CONG).

## node/ — legacy-express
- `ch7/` (3 commit, áp lên `ch6`): nới test câu lỗi V8 → Node 24 + lockfile v3 → Jest 30.5.2 + supertest 7.3.2 (snapshot đã đọc diff). 21 test trên Node 22/24/26.
- `thu-express5/` (1 commit, áp sau `ch7`): Express 5.3.0, 21 test xanh.

## demo/
`PhanChieu.java` (phản chiếu 8/11/17/21), `DinhDang.java` (CLDR "đ"/"₫"), `thu-vien-cu/` (Lombok 1.18.12 + Mockito 2.28 — `-Dlombok.version=1.18.30`,
`-Dmockito.version=5.14.2`), `api-cu.js` (md4, util.isArray, url.parse, new Buffer), `so-phieu-moi.js` (ERR_REQUIRE_ESM — cần `npm install nanoid@5.1.6`),
`duong-cu.js` (route Express 4 trên Express 5 — chạy với NODE_PATH trỏ node_modules có express 4 hoặc 5).

## Lệnh OpenRewrite đã dùng
```
mvn -B org.openrewrite.maven:rewrite-maven-plugin:6.46.1:run \
  -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-spring:6.37.1 \
  -Drewrite.activeRecipes=org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_5 -Drewrite.exportDatatables=true
mvn -B org.openrewrite.maven:rewrite-maven-plugin:6.46.1:dryRunNoFork \
  -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-migrate-java:3.42.1 \
  -Drewrite.activeRecipes=org.openrewrite.java.migrate.jakarta.JakartaEE10      # ⇒ target/rewrite/rewrite.patch
```
Trong container không có HOME ghi được: gắn thêm một thư mục vào `~/.rewrite` (không thì "Failed to create directory …/.rewrite/classpath").
