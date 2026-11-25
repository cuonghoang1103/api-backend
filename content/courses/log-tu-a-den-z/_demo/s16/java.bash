# 16.3 — Java 21 + SLF4J 2.0.17 + Logback 1.5.38: record lộ password qua toString(), %replace làm lưới an toàn (cwd = _demo/s16/java; ./lib = slf4j-api, logback-core, logback-classic từ Maven Central)
java -version 2>&1 | head -1
java -cp 'lib/*' -Dlogback.configurationFile=raw.xml Login.java
java -cp 'lib/*' -Dlogback.configurationFile=logback.xml Login.java
