docker exec pgduan-tam pg_dump -U postgres -Fc -d duan -f /tmp/duan.dump
docker exec pgduan-tam createdb -U postgres duan_restore
docker exec pgduan-tam pg_restore -U postgres -d duan_restore /tmp/duan.dump
for db in duan duan_restore; do
  docker exec pgduan-tam psql -U postgres -d "$db" -Atc "SELECT current_database(), count(*) FROM bookings"
done
