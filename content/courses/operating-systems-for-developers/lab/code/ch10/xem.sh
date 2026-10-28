#!/bin/bash
# xem.sh PID — một dòng về một tiến trình: số luồng, số fd, RSS, thời gian CPU (user+sys), chuyển ngữ cảnh (cộng mọi luồng).
p=$1
th=$(awk '/^Threads/{print $2}' /proc/$p/status)
rss=$(awk '/^VmRSS/{printf "%.1f MiB", $2/1024}' /proc/$p/status)
cpu=$(awk -v hz="$(getconf CLK_TCK)" '{printf "%.2f s", ($14+$15)/hz}' /proc/$p/stat)
cs=$(cat /proc/$p/task/*/status 2>/dev/null | awk '/ctxt_switches/{s+=$2} END{print s}')
fds=$(ls /proc/$p/fd | wc -l)
echo "pid $p: threads=$th fds=$fds rss=$rss cpu=$cpu ctx-switches=$cs"
