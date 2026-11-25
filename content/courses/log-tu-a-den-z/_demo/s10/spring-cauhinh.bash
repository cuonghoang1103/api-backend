# 10.6 — Logback tự cấu hình: pattern có MDC, rolling file theo ngày + dung lượng, bẫy additivity, bẫy hai provider SLF4J
unzip -l target/shop-1.0.jar | grep -oE '[a-z0-9.-]*(slf4j|logback|log4j)[a-z0-9.-]*\.jar' | sort
docker rm -f lgz-spring 2> /dev/null; rm -rf logs; mkdir logs
docker run -d --name lgz-spring --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar --logging.config=classpath:logback-lab.xml > /dev/null && sleep 8
curl -s -H 'X-Request-Id: req-7f3a91c2' http://127.0.0.1:41081/api/orders/7; echo
curl -s -X POST -H 'X-Request-Id: req-c0ffee01' 'http://127.0.0.1:41081/api/orders/7/confirm?email=an@example.com'; echo
docker logs lgz-spring 2>&1 | grep -E 'rid=req-'
curl -s -H 'X-Request-Id: <script>' http://127.0.0.1:41081/api/orders/9 > /dev/null; docker logs lgz-spring 2>&1 | grep 'order id=9'
tail -n 2 logs/shop.log
for i in $(seq 1 400); do curl -s -o /dev/null http://127.0.0.1:41081/api/orders/$i; done; ls -l logs | tail -n +2 | awk '{print $5, $9}'
zcat logs/shop.*.0.log.gz | head -n 2
docker rm -f lgz-spring > /dev/null; docker run -d --name lgz-spring --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -DADDITIVITY=false -jar target/shop-1.0.jar --logging.config=classpath:logback-lab.xml > /dev/null && sleep 8
curl -s -X POST -H 'X-Request-Id: req-c0ffee02' 'http://127.0.0.1:41081/api/orders/7/confirm?email=an@example.com' > /dev/null; docker logs lgz-spring 2>&1 | grep -E 'rid=req-c0ffee02'
docker rm -f lgz-spring > /dev/null; ls extra/
docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -Dloader.path=extra -cp target/shop-1.0.jar org.springframework.boot.loader.launch.PropertiesLauncher 2>&1 | grep -E 'SLF4J|IllegalStateException|LoggerFactory is not' | head -n 6
