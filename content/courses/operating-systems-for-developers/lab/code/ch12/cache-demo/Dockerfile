# cache-demo — một Dockerfile bốn lớp để xem build cache làm việc (bài 12.3).
FROM alpine:latest
WORKDIR /app
COPY package.json .
RUN echo "installing dependencies (pretend npm ci)..." && sleep 3 && echo "deps for $(cat package.json)" > deps.txt
COPY server.js .
CMD ["cat", "deps.txt", "server.js"]
