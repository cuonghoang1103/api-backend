# Bổ sung video 10.6 (ý từ YouTube TFNV4EQKqk0): thêm appender SEVERE có ThresholdFilter WARN — chạy thật 24/11/2026, cùng thư mục với bt-10-6.bash
grep -n -A3 '<filter' logback-loc.xml
docker rm -f lgz-spring > /dev/null 2>&1; rm -rf logs; mkdir logs; docker run -d --name lgz-spring --memory 2g --memory-swap 2g --cpus 2 --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar --logging.config=file:logback-loc.xml > /dev/null && sleep 12
for i in 7 8 13; do curl -s -o /dev/null -w "đơn $i: %{http_code}\n" http://127.0.0.1:41081/api/orders/$i; done; sleep 1; wc -l logs/shop.log logs/shop-severe.log
cut -c1-130 logs/shop-severe.log | grep -v '^\s'
docker rm -f lgz-spring > /dev/null; echo "đã xoá lgz-spring"
