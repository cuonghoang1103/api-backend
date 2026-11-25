# 10.6 — Đổi Logback sang Log4j2: loại spring-boot-starter-logging khỏi mọi starter, thêm spring-boot-starter-log4j2. cwd = bản sao dự án dùng pom-log4j2.xml
diff ../spring/pom.xml pom.xml
unzip -l target/shop-1.0.jar | grep -oE '[a-z0-9.-]*(slf4j|logback|log4j)[a-z0-9.-]*\.jar' | sort
docker run -d --name lgz-spring --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar > /dev/null && sleep 8
curl -s http://127.0.0.1:41081/api/orders/7 > /dev/null; docker logs lgz-spring 2>&1 | grep -E 'Started ShopApplication|load order' | cut -c1-200
docker rm -f lgz-spring > /dev/null
