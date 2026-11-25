#!/usr/bin/env bash
# "Bản sao lưu chưa thử khôi phục = không có bản sao lưu." Khôi phục THẬT một tệp sao lưu vào máy nháp rồi đối chiếu số tài liệu.
#   ./kiem-khoi-phuc.sh /tmp/mgo-sl/dem-24-11.archive.gz      ⇒ mã thoát 0 = dùng được, 1 = HỎNG (gửi cảnh báo)
# Máy nháp: container mgo-kt, --network none, xoá ngay sau khi kiểm. Chạy hằng đêm sau sao-luu.sh (cron / CI).
set -uo pipefail
TEP=$1
docker rm -f mgo-kt >/dev/null 2>&1
docker run -d --memory 2g --memory-swap 2g --cpus 2 --name mgo-kt --network none mongo:8.0 >/dev/null
until docker exec mgo-kt mongosh --quiet --eval 'db.hello().isWritablePrimary' >/dev/null 2>&1; do sleep 1; done
BAT=$(date +%s)
if ! docker exec -i mgo-kt mongorestore --archive --gzip --oplogReplay < "$TEP" 2> /tmp/mgo-kt.log; then
  echo "HỎNG: mongorestore lỗi — $(grep -m1 Failed /tmp/mgo-kt.log | cut -c30-)"; docker rm -f mgo-kt >/dev/null; exit 1
fi
echo "khôi phục mất $(( $(date +%s) - BAT )) s — $(grep -o "[0-9]* document(s) restored successfully" /tmp/mgo-kt.log)"
docker exec -e DEM="$(cat "$TEP.dem.json")" mgo-kt mongosh --quiet --eval '
  const mong = JSON.parse(process.env.DEM); let loi = 0;
  for (const [ns, n] of Object.entries(mong)) {
    const [d, ...c] = ns.split("."); const co = db.getSiblingDB(d)[c.join(".")].countDocuments();
    const ok = co >= n * 0.99;   // có ghi đồng thời lúc sao lưu thì lệch chút ít; thiếu > 1% là hỏng
    if (!ok) loi++;
    print((ok ? "  ok   " : "  THIẾU ") + ns.padEnd(22) + " lúc sao lưu " + String(n).padStart(6) + " — khôi phục " + String(co).padStart(6));
  }
  print(loi ? "HỎNG: " + loi + " collection thiếu dữ liệu" : "DÙNG ĐƯỢC: mọi collection đủ");
  quit(loi ? 1 : 0)'
MA=$?
docker rm -f mgo-kt >/dev/null
exit $MA
