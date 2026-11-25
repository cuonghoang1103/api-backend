#!/usr/bin/env bash
# Lab 10.7 — dựng sự cố trên mgo-lab (database lab10). Sau khi chạy:
#   /tmp/mgo-lab10/goc/       bản sao lưu 02:00 (mongodump --oplog, cả máy) — đây là bản sao lưu đêm qua
#   /tmp/mgo-lab10/.dap-an    vân tay từng đơn ĐÚNG (để lab10-cham.sh chấm — đừng mở trước khi làm)
# Rồi tự khôi phục sao cho lab10.orders đủ mọi đơn, mỗi đơn đúng trạng thái mới nhất, không mất đơn nào ghi sau 14:03.
set -euo pipefail
L=/tmp/mgo-lab10; rm -rf $L; mkdir -p $L
chay() { docker exec mgo-lab mongosh --quiet --eval "var PHA='$1'" /demo/lab10-su-co.js; }
chay nap
docker exec mgo-lab sh -c 'rm -rf /tmp/lab10-goc && mongodump --oplog --out /tmp/lab10-goc --quiet'
docker cp -q mgo-lab:/tmp/lab10-goc $L/goc; docker exec mgo-lab rm -rf /tmp/lab10-goc
echo "02:00 — đã sao lưu cả máy vào $L/goc"
chay a
# Vân tay đúng = mỗi đơn một dòng "_id md5(EJSON)": đơn bị xoá lấy trạng thái NGAY TRƯỚC 14:03, đơn còn lại lấy trạng thái cuối cùng.
vt() { docker exec mgo-lab mongosh --quiet lab10 --eval "db.orders.find($1).forEach(d => print(d._id + ' ' + require('crypto').createHash('md5').update(EJSON.stringify(d, { relaxed: false })).digest('hex')))"; }
vt '{ ngay: { $lt: ISODate("2026-10-20") } }' > $L/.dap-an
chay xoa
chay b
vt '{}' >> $L/.dap-an
echo "sự cố đã xảy ra. Khách bắt đầu gọi: \"đơn tôi biến mất\". Bản sao lưu: $L/goc — chúc may mắn."
