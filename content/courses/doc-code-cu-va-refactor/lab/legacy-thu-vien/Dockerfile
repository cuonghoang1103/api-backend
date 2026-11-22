# Dựng WAR bằng JDK 8 (mã dùng javax.xml.bind — không biên dịch được trên JDK 11+), chạy trên Tomcat 9 (javax.servlet).
# Ảnh này do khoá học thêm vào (Mục 0.1) — dự án gốc không có Docker.
FROM maven:3.9-eclipse-temurin-8 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B package -DskipTests

FROM tomcat:9.0-jdk8-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /src/target/thuvien.war /usr/local/tomcat/webapps/thuvien.war
EXPOSE 8080
