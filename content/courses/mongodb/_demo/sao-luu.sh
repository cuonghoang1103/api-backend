#!/usr/bin/env bash
# Sao lưu toàn bộ mgo-lab thành MỘT tệp: mongodump --archive --gzip --oplog (khoá MongoDB, Chương 10).
#   ./sao-luu.sh /tmp/mgo-sl/dem-24-11.archive.gz
# CU=1 ./sao-luu.sh … ⇒ chạy lệnh của cron cũ (chỉ --db ctshop) để thấy kiem-khoi-phuc.sh bắt lỗi.
# Kèm tệp <đích>.dem.json: số tài liệu từng collection lúc sao lưu — kiem-khoi-phuc.sh dùng để đối chiếu.
set -euo pipefail
DICH=$1
docker exec mgo-lab mongosh --quiet --eval '
  const kq = {};
  for (const d of db.adminCommand({ listDatabases: 1 }).databases)
    if (!["admin", "config", "local"].includes(d.name))
      for (const c of db.getSiblingDB(d.name).getCollectionInfos({ type: "collection" }))
        kq[d.name + "." + c.name] = db.getSiblingDB(d.name)[c.name].estimatedDocumentCount();
  print(JSON.stringify(kq))' > "$DICH.dem.json"
if [ "${CU:-}" = 1 ]; then   # kiểu cron CŨ của dự án: chỉ database ctshop, không --oplog
  docker exec mgo-lab mongodump --archive --gzip --db ctshop --quiet > "$DICH"
else
  docker exec mgo-lab mongodump --archive --gzip --oplog --quiet > "$DICH"
fi
echo "sao lưu xong: $(du -h "$DICH" | cut -f1) — $(wc -c < "$DICH") byte, $(grep -o '"[^"]*":' "$DICH.dem.json" | wc -l) collection"
