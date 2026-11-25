# 10.5 — Đọc log Spring Boot (mặc định Logback, chưa có tệp cấu hình riêng). cwd = thư mục spring-lab đã mvn package
docker run -d --name lgz-spring --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar > /dev/null && sleep 8
docker logs lgz-spring 2>&1 | grep -E 'Starting ShopApplication|Tomcat started|Started ShopApplication' | cut -c1-230
curl -s http://127.0.0.1:41081/api/orders/7; echo
docker logs lgz-spring 2>&1 | grep 'load order id=7'
curl -s http://127.0.0.1:41081/api/orders/13; echo
docker logs lgz-spring 2>&1 | grep -A6 'with root cause' | cut -c1-260
curl -s http://127.0.0.1:41081/api/v2/orders/13; echo
docker logs lgz-spring 2>&1 | awk '/order 13 failed/,0' | grep -vE '^\s+at (org\.apache|org\.springframework|jakarta|java\.base/jdk|java\.base/java\.lang\.reflect)'
docker logs lgz-spring 2>&1 | awk '/order 13 failed/,0' | grep -cE '^\s+at '
curl -s http://127.0.0.1:41081/actuator/loggers/vn.lab.shop; echo
curl -s -X POST -H 'Content-Type: application/json' -d '{"configuredLevel":"DEBUG"}' -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41081/actuator/loggers/vn.lab.shop
curl -s http://127.0.0.1:41081/api/orders/8 > /dev/null; docker logs lgz-spring 2>&1 | grep -E 'order id=8|order 8$'
curl -s -X POST -H 'Content-Type: application/json' -d '{"configuredLevel":null}' -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41081/actuator/loggers/vn.lab.shop
docker run --rm --network container:lgz-spring --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar 2>&1 | sed -n '/APPLICATION FAILED TO START/,$p'
