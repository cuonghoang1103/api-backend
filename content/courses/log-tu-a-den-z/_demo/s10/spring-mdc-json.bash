# 10.7 — MDC qua @Async, JSON (logstash-logback-encoder và structured logging có sẵn của Spring Boot), giá của log DEBUG
docker rm -f lgz-spring 2> /dev/null; rm -rf logs; mkdir logs
docker run -d --name lgz-spring --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar --logging.config=classpath:logback-lab.xml > /dev/null && sleep 8
curl -s -X POST -H 'X-Request-Id: req-c0ffee01' 'http://127.0.0.1:41081/api/orders/7/confirm?email=an@example.com'; echo
jq -c 'select(.requestId == "req-c0ffee01") | {"@timestamp", level, thread_name, logger_name, message, requestId, traceId, spanId}' logs/shop.json
docker rm -f lgz-spring > /dev/null; docker run -d --name lgz-spring -e MDC_DECORATOR=false -e JAVA_TOOL_OPTIONS=-DADDITIVITY=false --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar --logging.config=classpath:logback-lab.xml > /dev/null && sleep 8
curl -s -X POST -H 'X-Request-Id: req-c0ffee03' 'http://127.0.0.1:41081/api/orders/7/confirm?email=an@example.com' > /dev/null; docker logs lgz-spring 2>&1 | grep -E 'confirm|sending' | tail -n 3
docker rm -f lgz-spring > /dev/null; docker run -d --name lgz-spring --user "$(id -u):$(id -g)" -p 127.0.0.1:41081:8080 -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -jar target/shop-1.0.jar --logging.structured.format.console=ecs > /dev/null && sleep 8
curl -s -H 'X-Request-Id: req-ecs00001' http://127.0.0.1:41081/api/orders/7 > /dev/null; docker logs lgz-spring 2>&1 | grep 'load order' | jq .
docker rm -f lgz-spring > /dev/null; docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -Dlogback.configurationFile=logback-bench.xml -Dloader.main=vn.lab.shop.LogBench -cp target/shop-1.0.jar org.springframework.boot.loader.launch.PropertiesLauncher
