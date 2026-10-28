#!/bin/bash
# healthcheck.sh — "kiểm tra sức khoẻ" chạy mỗi 0,1 giây, mỗi lần đẻ vài tiến trình rất ngắn (bài 15.5).
# top/ps gần như không bao giờ bắt gặp chúng; execsnoop thì thấy hết.
while true; do
  load=$(cat /proc/loadavg | awk '{print $1}')
  ok=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/health)
  date +%s > /dev/null
  sleep 0.1
done
