# Lời giải 🧪 bài 10.5 — chạy thật 24/11/2026 (jar shop-1.0 đã build ở chay-s10.bash; container giới hạn 2 GB / 2 CPU)
docker run -d --name lgz-spring --memory 2g --memory-swap 2g --cpus 2 --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar > /dev/null && sleep 10
curl -s http://127.0.0.1:41081/api/v2/orders/13; echo
docker logs lgz-spring 2>&1 | awk '/order 13 failed/,0' | grep -E 'Caused by|vn\.lab\.shop' | cut -c1-140
curl -s -X POST -H 'Content-Type: application/json' -d '{"configuredLevel":"DEBUG"}' -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41081/actuator/loggers/org.springframework.web
N0=$(docker logs lgz-spring 2>&1 | wc -l); curl -s http://127.0.0.1:41081/api/orders/9 > /dev/null; sleep 1; N1=$(docker logs lgz-spring 2>&1 | wc -l); echo "thêm $((N1 - N0)) dòng"; docker logs lgz-spring 2>&1 | tail -n $((N1 - N0)) | sed -E 's/^\S+ +([A-Z]+) .*\] ([^ ]+) +: (.{0,58}).*/\1 \2 : \3/'
curl -s -X POST -H 'Content-Type: application/json' -d '{"configuredLevel":null}' -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41081/actuator/loggers/org.springframework.web
N0=$(docker logs lgz-spring 2>&1 | wc -l); curl -s http://127.0.0.1:41081/api/orders/9 > /dev/null; sleep 1; N1=$(docker logs lgz-spring 2>&1 | wc -l); echo "thêm $((N1 - N0)) dòng"; docker logs lgz-spring 2>&1 | tail -n $((N1 - N0)) | grep -c DEBUG
docker run --rm --memory 2g --memory-swap 2g --cpus 2 --network container:lgz-spring --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar 2>&1 | sed -n '/APPLICATION FAILED TO START/,$p'
docker run --rm --memory 2g --memory-swap 2g --cpus 2 --network container:lgz-spring --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app --entrypoint timeout maven:3.9-eclipse-temurin-21 25 java -jar target/shop-1.0.jar --spring.profiles.active=prod --server.port=8082 2>&1 | grep -o 'The following .*profile.*'
docker rm -f lgz-spring > /dev/null; echo "đã xoá lgz-spring"
