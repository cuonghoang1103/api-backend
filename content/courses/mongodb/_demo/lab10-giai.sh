#!/usr/bin/env bash
# Lab 10.7 — LỜI GIẢI: khôi phục tới thời điểm (PITR) trên MÁY NHÁP, rồi chỉ chép lại các đơn bị xoá vào máy thật.
# Không đụng vào mọi thứ ứng dụng đã ghi sau 14:03 trên máy thật.
set -euo pipefail
L=/tmp/mgo-lab10
# 1. Tìm lệnh xoá trong oplog: mục applyOps đầu tiên chứa thao tác 'd' trên lab10.orders, SAU thời điểm bản sao lưu.
GOC_TS=$(docker run --rm --memory 2g --memory-swap 2g --cpus 2 -v $L/goc:/g:ro mongo:8.0 bsondump --quiet /g/oplog.bson | head -1 | sed -E 's/.*"t":([0-9]+),"i":([0-9]+).*/\1 \2/')
set -- $GOC_TS
MOC=$(docker exec mgo-lab mongosh --quiet local --eval "
  const x = db.oplog.rs.find({ ts: { \$gt: Timestamp({ t: $1, i: $2 }) }, op: 'c', 'o.applyOps': { \$elemMatch: { op: 'd', ns: 'lab10.orders' } } })
    .sort({ \$natural: 1 }).limit(1).next();
  print(x.ts.t + ':' + x.ts.i + ' ' + x.wall.toISOString())")
echo "1. lệnh xoá đầu tiên: ts $MOC"
# 2. Lấy oplog từ lúc sao lưu tới giờ (ra thư mục riêng, đổi tên thành oplog.bson như mongorestore cần).
docker exec mgo-lab sh -c "rm -rf /tmp/l10op && mongodump -d local -c oplog.rs --query '{\"ts\":{\"\$gte\":{\"\$timestamp\":{\"t\":$1,\"i\":$2}}}}' --out /tmp/l10op --quiet"
mkdir -p $L/oplog; docker cp -q mgo-lab:/tmp/l10op/local/oplog.rs.bson $L/oplog/oplog.bson; docker exec mgo-lab rm -rf /tmp/l10op
echo "2. oplog từ bản sao lưu tới giờ: $(du -h $L/oplog/oplog.bson | cut -f1)"
# 3. Máy nháp: bản 02:00 + phát lại oplog tới NGAY TRƯỚC lệnh xoá.
docker rm -f mgo-l10kp >/dev/null 2>&1
docker run -d --memory 2g --memory-swap 2g --cpus 2 --name mgo-l10kp --network none mongo:8.0 >/dev/null
until docker exec mgo-l10kp mongosh --quiet --eval 1 >/dev/null 2>&1; do sleep 1; done
docker cp -q $L/goc mgo-l10kp:/goc; docker cp -q $L/oplog mgo-l10kp:/oplog
docker exec mgo-l10kp mongorestore --oplogReplay /goc --quiet            # cả máy: --oplogReplay không đi chung --nsInclude
docker exec mgo-l10kp mongorestore --oplogReplay --oplogLimit "${MOC%% *}" /oplog --quiet
echo "3. máy nháp ở thời điểm ngay trước lệnh xoá: $(docker exec mgo-l10kp mongosh --quiet lab10 --eval 'db.orders.countDocuments()') đơn"
# 4. Chỉ chép những đơn KHÔNG còn trên máy thật (đúng các đơn bị xoá) — insert, không ghi đè ⇒ đơn sau 14:03 an toàn.
docker exec mgo-lab mongosh --quiet lab10 --eval 'db.orders.find({}, { _id: 1 }).forEach(d => print(d._id))' > $L/con.txt
docker exec -e CON="$(tr '\n' ',' < $L/con.txt)" mgo-l10kp mongosh --quiet lab10 --eval '
  const con = process.env.CON.split(",").filter(Boolean).map(Number);
  const n = db.orders.aggregate([{ $match: { _id: { $nin: con } } }, { $out: "can_tra_lai" }]).toArray() && db.can_tra_lai.countDocuments();
  print("4. đơn cần trả lại:", n)'
docker exec mgo-l10kp mongodump -d lab10 -c can_tra_lai --archive --quiet |
  docker exec -i mgo-lab mongorestore --archive --nsFrom 'lab10.can_tra_lai' --nsTo 'lab10.orders' 2>&1 | tail -1
docker rm -f mgo-l10kp >/dev/null; rm -rf $L/oplog $L/con.txt
