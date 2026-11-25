# Lời giải 🧪 bài 10.7 câu 3 — chạy thật 24/11/2026: LogBench, mức INFO (bài) rồi mức DEBUG ghi vào /dev/null.
grep -E 'root|file' logback-bench-debug.xml
docker run --rm --memory 2g --memory-swap 2g --cpus 2 --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -Dlogback.configurationFile=logback-bench.xml -Dloader.main=vn.lab.shop.LogBench -cp target/shop-1.0.jar org.springframework.boot.loader.launch.PropertiesLauncher
docker run --rm --memory 2g --memory-swap 2g --cpus 2 --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app --entrypoint java maven:3.9-eclipse-temurin-21 -Dlogback.configurationFile=logback-bench-debug.xml -Dloader.main=vn.lab.shop.LogBench -cp target/shop-1.0.jar org.springframework.boot.loader.launch.PropertiesLauncher
