#!/bin/sh
# rotate.sh — ĐÃ SỬA: giữ MỘT bản cũ (worker.log.1) thay vì xoá file đang có người mở; worker dùng WatchedFileHandler
# nên tự mở lại worker.log mới. (Trên máy thật: logrotate với copytruncate, hoặc postrotate gửi SIGHUP; trong container:
# ghi log ra stdout và để Docker xoay với --log-opt max-size.)
while true; do
  sleep 15
  [ -f /var/log/app/worker.log ] && mv -f /var/log/app/worker.log /var/log/app/worker.log.1
done
