#!/usr/bin/env bash
# Lab 9.5 — LỜI GIẢI phần máy chủ: dựng mgo-lab9 đã khoá + tài khoản quyền tối thiểu cho API.
#   export LAB9_ADMIN_PW=$(openssl rand -base64 24) LAB9_API_PW=$(openssl rand -hex 24)   # mật khẩu dài, ngẫu nhiên, không ghi vào mã
#   bash lab9-may-chu.sh up | down
set -euo pipefail
: "${LAB9_ADMIN_PW:?đặt LAB9_ADMIN_PW}" "${LAB9_API_PW:?đặt LAB9_API_PW}"
case "${1:-up}" in
up)
  docker rm -f mgo-lab9 >/dev/null 2>&1 || true
  docker run -d --name mgo-lab9 -p 127.0.0.1:47093:27017 mongo:8.0 \
    mongod --auth --bind_ip_all --noscripting --networkMessageCompressors snappy,zstd >/dev/null
  until docker exec mgo-lab9 mongosh --quiet --eval 'db.runCommand({ ping: 1 }).ok' >/dev/null 2>&1; do sleep 1; done
  # localhost exception: chỉ từ TRONG container, chỉ để tạo user đầu tiên. Mật khẩu qua biến môi trường, không nằm trên dòng lệnh của tiến trình.
  docker exec -e PW="$LAB9_ADMIN_PW" mgo-lab9 mongosh --quiet admin --eval \
    'db.createUser({ user: "quantri", pwd: process.env.PW, roles: ["root"] }); print("tạo quantri: ok")'
  docker exec -e PW="$LAB9_ADMIN_PW" -e APW="$LAB9_API_PW" mgo-lab9 sh -c \
    'mongosh --quiet -u quantri -p "$PW" --authenticationDatabase admin lab9 --eval "
      db.createRole({ role: \"lab9Ung\", roles: [], privileges: [
        { resource: { db: \"lab9\", collection: \"\" }, actions: [\"find\", \"insert\", \"update\"] } ] });
      db.createUser({ user: \"lab9Api\", pwd: process.env.APW, roles: [\"lab9Ung\"] });
      print(\"tạo vai trò lab9Ung + user lab9Api: ok\")"'
  ;;
down) docker rm -f mgo-lab9 >/dev/null; echo "đã xoá mgo-lab9" ;;
esac
