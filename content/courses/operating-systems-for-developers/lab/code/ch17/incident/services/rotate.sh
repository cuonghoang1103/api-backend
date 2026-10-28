#!/bin/sh
# rotate.sh — "xoay log" tự chế chạy cạnh worker: mỗi 15 giây đổi tên log cũ rồi XOÁ nó cho đỡ tốn chỗ.
while true; do
  sleep 15
  [ -f /var/log/app/worker.log ] && mv /var/log/app/worker.log /var/log/app/worker.log.1 && rm -f /var/log/app/worker.log.1
done
