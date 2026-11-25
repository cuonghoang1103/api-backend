#!/usr/bin/env bash
# Bài 6.3–6.4 — replica set BA thành viên trong MỘT container (ba tiến trình mongod, cổng 27018/27019/27020), không mạng ngoài.
# enableTestCommands=1 CHỈ để dùng failpoint trong lab — KHÔNG BAO GIỜ bật ở máy thật.
# Đủ để thấy write concern / read concern / rollback mà không cần ba máy. Cụm ba container thật bằng Compose: Chương 7.
#   bash rs3.sh up     # dựng + khởi tạo replica set "rs3" (m1 ưu tiên làm primary)
#   bash rs3.sh down   # xoá container
#   bash rs3.sh treo 27019 27020   # dừng tạm (SIGSTOP) — giả lập máy treo / đứt mạng: tiến trình còn đó nhưng không trả lời
#   bash rs3.sh chay 27019 27020   # cho chạy tiếp (SIGCONT)
#   bash rs3.sh ngung-chep 27019 27020   # secondary ngừng kéo oplog (failpoint lab) — giả lập đứt mạng primary ⇄ secondary
#   bash rs3.sh chep-tiep 27019 27020
#   bash rs3.sh cho-primary 27019 27020   # chờ tới khi một trong các cổng này thành primary
set -e
case "$1" in
  up)
    docker run -d --memory 2g --memory-swap 2g --cpus 2 --name mgo-rs3 --network none --entrypoint sleep mongo:8.0 infinity >/dev/null
    for p in 27018 27019 27020; do
      docker exec mgo-rs3 bash -c "mkdir -p /data/$p && mongod --replSet rs3 --port $p --dbpath /data/$p --bind_ip localhost --fork --logpath /data/$p.log --pidfilepath /data/$p.pid --setParameter enableTestCommands=1 >/dev/null"
    done
    docker exec mgo-rs3 mongosh --quiet --port 27018 --eval "rs.initiate({ _id: 'rs3', members: [
      { _id: 0, host: 'localhost:27018', priority: 2 }, { _id: 1, host: 'localhost:27019' }, { _id: 2, host: 'localhost:27020' } ] }).ok" >/dev/null
    for i in $(seq 1 60); do
      docker exec mgo-rs3 mongosh --quiet --port 27018 --eval 'db.hello().isWritablePrimary' 2>/dev/null | grep -q true && break; sleep 1
    done
    echo "rs3 sẵn sàng: $(docker exec mgo-rs3 mongosh --quiet --port 27018 --eval 'rs.status().members.map((m) => m.name.split(":")[1] + " " + m.stateStr).join(", ")')"
    ;;
  treo|chay)
    sig=$([ "$1" = treo ] && echo STOP || echo CONT); shift
    for p in "$@"; do docker exec mgo-rs3 bash -c "kill -$sig \$(cat /data/$p.pid)"; done
    echo "$sig: $*"
    ;;
  ngung-chep|chep-tiep)
    # failpoint stopReplProducer: secondary NGỪNG kéo oplog từ primary (chỉ có khi bật enableTestCommands — CHỈ dùng trong lab).
    m=$([ "$1" = ngung-chep ] && echo alwaysOn || echo off); shift
    for p in "$@"; do docker exec mgo-rs3 mongosh --quiet --port $p --eval "db.adminCommand({ configureFailPoint: 'stopReplProducer', mode: '$m' }).ok" >/dev/null; done
    echo "stopReplProducer $m: $*"
    ;;
  cho-primary)
    # chờ tới khi MỘT trong các cổng đã cho tự nhận là primary; in cổng + số giây đã chờ
    shift; t0=$(date +%s)
    for i in $(seq 1 90); do
      for p in "$@"; do
        if docker exec mgo-rs3 mongosh --quiet --port $p --eval 'db.hello().isWritablePrimary' 2>/dev/null | grep -q true; then
          echo "primary mới: $p (sau $(( $(date +%s) - t0 )) s)"; exit 0; fi
      done; sleep 1
    done; echo "hết 90 s vẫn chưa có primary"; exit 1
    ;;
  down) docker rm -f mgo-rs3 >/dev/null && echo "đã xoá mgo-rs3" ;;
esac
