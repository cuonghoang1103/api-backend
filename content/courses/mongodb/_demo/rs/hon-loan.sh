#!/usr/bin/env bash
# Bài 7.2 / lab 7.6 — gây sự cố THẬT cho cụm rs1 (compose.yaml cùng thư mục). Mọi lệnh in giờ để khớp với log ứng dụng.
#   bash hon-loan.sh primary            # in tên máy đang là primary (r1/r2/r3)
#   bash hon-loan.sh giet [máy]         # docker kill (SIGKILL) — máy chết hẳn, kết nối bị đóng ngay
#   bash hon-loan.sh tat [máy]          # docker stop — tắt lịch sự: primary tự nhường trước khi tắt
#   bash hon-loan.sh nhuong             # rs.stepDown(): primary nhường chức, vẫn chạy tiếp
#   bash hon-loan.sh cat-mang [máy]     # rút máy khỏi mạng replica set — các máy khác mất nó, ứng dụng VẪN thấy r1 qua mạng "ud" (split-brain, lab 7.6)
#   bash hon-loan.sh noi-mang máy       # cắm lại
#   bash hon-loan.sh cat-het [máy]      # rút máy khỏi MỌI mạng — gói tin rơi im lặng, không ai báo lỗi (Bài 7.2)
#   bash hon-loan.sh noi-het máy        # cắm lại mọi mạng
#   bash hon-loan.sh on-dinh            # chờ tới khi r1 là primary và mọi secondary đã có nguồn chép
#   bash hon-loan.sh la                 # in một secondary mà không ai chép từ nó (tạm dừng nó không kéo máy khác theo)
#   bash hon-loan.sh bat máy            # docker start lại máy đã giết/tắt
#   bash hon-loan.sh cho-primary        # chờ tới khi cụm có primary; in tên + số giây đã chờ
#   bash hon-loan.sh trang-thai         # mỗi máy thấy cụm thế nào
# [máy] bỏ trống = primary hiện tại.
set -e
gio() { TZ=Asia/Ho_Chi_Minh date +%T; }
hoi() { for m in r1 r2 r3; do docker exec mgo-$m mongosh --quiet --eval "$1" 2>/dev/null && return 0; done; return 1; }
primary() { hoi 'const p = db.hello().primary; p ? p.split(":")[0] : quit(1)'; }
case "$1" in
  primary) primary ;;
  giet) m=${2:-$(primary)}; docker kill mgo-$m >/dev/null; echo "$(gio) đã GIẾT $m" ;;
  tat) m=${2:-$(primary)}; t=$SECONDS; docker stop mgo-$m >/dev/null
    echo "$(gio) đã TẮT $m (docker stop mất $((SECONDS - t)) s, mã thoát $(docker inspect -f '{{.State.ExitCode}}' mgo-$m))" ;;
  nhuong) m=$(primary); docker exec mgo-$m mongosh --quiet --eval 'rs.stepDown(60).ok' >/dev/null; echo "$(gio) $m đã NHƯỜNG chức primary" ;;
  cat-mang) m=${2:-$(primary)}; docker network disconnect mgo-rs-net mgo-$m; echo "$(gio) đã RÚT $m khỏi mạng replica set" ;;
  noi-mang) docker network connect --alias $2 mgo-rs-net mgo-$2; echo "$(gio) đã CẮM LẠI $2" ;;
  cat-het) m=${2:-$(primary)}; docker network disconnect mgo-rs-net mgo-$m
    [ $m = r1 ] && docker network disconnect mgo-rs-ud mgo-r1; echo "$(gio) đã RÚT $m khỏi MỌI mạng" ;;
  noi-het) docker network connect --alias $2 mgo-rs-net mgo-$2
    [ $2 = r1 ] && docker network connect --ip 10.247.71.11 mgo-rs-ud mgo-r1; echo "$(gio) đã CẮM LẠI $2 vào mọi mạng" ;;
  on-dinh)
    for i in $(seq 1 120); do
      docker exec mgo-r1 mongosh --quiet --eval 'const s = rs.status().members; quit(s[0].stateStr === "PRIMARY" && s.slice(1).every((m) => m.stateStr !== "SECONDARY" || m.syncSourceHost) ? 0 : 1)' 2>/dev/null && { echo "$(gio) cụm ổn định: r1 là primary"; exit 0; }
      sleep 1
    done; echo "$(gio) chưa ổn định sau 120 s"; exit 1 ;;
  la) docker exec mgo-r1 mongosh --quiet --eval 'const s = rs.status().members, nguon = s.map((m) => m.syncSourceHost);
      s.find((m) => m.stateStr === "SECONDARY" && !nguon.includes(m.name)).name.split(":")[0]' ;;
  bat) docker start mgo-$2 >/dev/null; echo "$(gio) đã BẬT LẠI $2" ;;
  cho-primary)
    t=$SECONDS
    for i in $(seq 1 120); do p=$(primary 2>/dev/null) && { echo "$(gio) primary: $p (chờ $((SECONDS - t)) s)"; exit 0; }; sleep 0.5; done
    echo "$(gio) hết 60 s vẫn chưa có primary"; exit 1 ;;
  trang-thai)
    for m in r1 r2 r3; do
      echo "$m thấy: $(docker exec mgo-$m mongosh --quiet --eval 'rs.status().members.map((x) => x.name.split(":")[0] + "=" + x.stateStr.replace("(not reachable/healthy)", "MẤT LIÊN LẠC")).join(" ")' 2>/dev/null || echo 'không trả lời')"
    done ;;
esac
