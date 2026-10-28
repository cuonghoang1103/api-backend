#!/bin/bash
# peek.sh PID — mỗi luồng của tiến trình: tid, tên, trạng thái (R chạy / S ngủ), hàm nhân đang chờ (wchan).
for t in /proc/$1/task/*; do
  printf '  tid %-4s %-14s state %s  wchan %s\n' "${t##*/}" "$(cat "$t/comm")" "$(awk '{print $3}' "$t/stat")" "$(cat "$t/wchan")"
done
