# @ chạy TỪ MÁY MAC của tác giả, CHỈ ĐỌC — đúng kiểu lệnh Claude gõ hằng ngày khi kiểm máy: bash ch02/phien-host.sh ch02/c27-mac.sh
@ cd /Users/admin/Downloads/api-backend
df -h /System/Volumes/Data
du -sh frontend/node_modules frontend/.next node_modules
du -sh "$TMPDIR"
docker system df
pgrep -l node | head -3
ps -axo pid,%cpu,rss,etime,comm -m | head -4
lsof -nP -iTCP:3123 -sTCP:LISTEN
