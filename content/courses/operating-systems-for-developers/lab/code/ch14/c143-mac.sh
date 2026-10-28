# @ Chương 14 · bài 14.3 — gõ TỪ MÁY MAC (chỉ đọc + chương trình của chính mình, không sudo), từ lab/code/ch14:
# @   CH14_WORK=<thư mục tạm> bash phien-host.sh c143-mac.sh 2>&1 | CH14_WORK=… bash an-danh.sh > ../../out/c143-mac.out.txt
@ W="$CH14_WORK"
ps -o pid,ppid,user,comm -p 1
echo "processes whose parent is launchd: $(ps -ax -o ppid= | awk '$1==1' | wc -l) of $(ps -ax -o pid= | wc -l)"
ls /System/Library/LaunchDaemons | wc -l; ls /System/Library/LaunchAgents | wc -l
plutil -p /System/Library/LaunchDaemons/com.apple.newsyslog.plist
launchctl print system/com.apple.newsyslog | grep -E '^	(path|type|state|program|runs|last exit code) '
plutil -lint com.cuongthai.hot.plist
top -l 1 -n 0 -s 0 | grep -E '^(Processes|Load Avg|CPU usage|PhysMem|VM):'
node hot.cjs & P=$!; sleep 1; ps -o pid,%cpu,rss,etime,comm -p $P
lsof -nP -a -p $P -iTCP -sTCP:LISTEN
sample $P 1 -file "$W/hot.sample.txt" > /dev/null 2>&1; sed -n '/Sort by top of stack/,/^$/p' "$W/hot.sample.txt" | head -6
fs_usage -w -f filesys $P 2>&1 | head -1
dtruss -p $P 2>&1 | head -2
kill $P; wait $P 2>/dev/null; echo "stopped"
logger -t ch14 "hello from chapter 14"; log show --last 1m --style compact --predicate 'process == "logger" AND eventMessage CONTAINS "chapter 14"' | tail -1 | cut -c1-110
