# Lời giải 🧪 bài 10.7 câu 2 — chạy thật 24/11/2026: dòng MDC.remove("userId") thành chú thích, build lại, Tomcat chỉ 1 luồng.
grep -n 'MDC.remove' src/main/java/vn/lab/shop/RequestIdFilter.java
docker rm -f lgz-spring > /dev/null 2>&1; rm -rf logs; mkdir logs; docker run -d --name lgz-spring --memory 2g --memory-swap 2g --cpus 2 --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar --logging.config=classpath:logback-lab.xml --server.tomcat.threads.max=1 > /dev/null && sleep 12
curl -s -o /dev/null -H 'X-Request-Id: req-an000001' -H 'X-User-Id: an' http://127.0.0.1:41081/api/orders/7
curl -s -o /dev/null -H 'X-Request-Id: req-binh0002' http://127.0.0.1:41081/api/orders/8
sleep 1; docker logs lgz-spring 2>&1 | grep 'load order'
docker rm -f lgz-spring > /dev/null; echo "đã xoá lgz-spring"
