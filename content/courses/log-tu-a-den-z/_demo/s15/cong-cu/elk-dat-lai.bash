# Đưa bộ ELK về trạng thái "chưa sửa múi giờ" trước khi chạy elk.bash (cwd = thư mục elk).
source "$(dirname "$0")/elk-env.bash"
docker compose stop filebeat >/dev/null 2>&1; es '_data_stream/filebeat-9.5.7' -XDELETE >/dev/null; docker compose rm -f filebeat >/dev/null 2>&1
docker volume rm lgz-c15e_fb-data >/dev/null 2>&1; docker compose up -d filebeat 2>/dev/null
for i in $(seq 40); do [ "$(es 'filebeat-*/_count' | jq .count)" = 4268 ] && break; sleep 3; done
es '_data_stream/filebeat-9.5.7' | jq -r '.data_streams[0].name'
