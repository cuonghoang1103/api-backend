# Lời giải 🧪 bài 10.7 câu 1–3 — chạy thật 24/11/2026. Thư mục: bản sao spring-lab (~/.rtq-lgz/c10/spring) đã chép bt-10-7/RequestIdFilter.java + logback-lab.xml rồi mvn package (container 2 GB).
grep -n 'userId' src/main/java/vn/lab/shop/RequestIdFilter.java
docker rm -f lgz-spring > /dev/null 2>&1; rm -rf logs; mkdir logs; docker run -d --name lgz-spring --memory 2g --memory-swap 2g --cpus 2 --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar --logging.config=classpath:logback-lab.xml > /dev/null && sleep 12
curl -s -X POST -H 'X-Request-Id: req-uid00001' -H 'X-User-Id: an' 'http://127.0.0.1:41081/api/orders/7/confirm?email=an@example.com'; echo; sleep 1; docker logs lgz-spring 2>&1 | grep 'rid=req-uid00001'
jq -c 'select(.requestId == "req-uid00001") | {thread_name, message, requestId, userId}' logs/shop.json
docker rm -f lgz-spring > /dev/null; echo "đã xoá lgz-spring"
