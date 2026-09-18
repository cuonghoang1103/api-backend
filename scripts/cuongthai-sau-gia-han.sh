#!/bin/sh
# Chạy sau MỖI lần certbot gia hạn cert cuongthai.com.
#
# ⚠️ BẢN CHẠY THẬT NẰM Ở /usr/local/bin/cuongthai-sau-gia-han.sh TRÊN VPS.
# File này là bản trong git để còn dựng lại được. Sửa ở đây thì phải chép lên:
#   scp scripts/cuongthai-sau-gia-han.sh vps:/usr/local/bin/ && ssh vps chmod +x /usr/local/bin/cuongthai-sau-gia-han.sh
#
# HAI nơi tiêu thụ chứng chỉ, và cả hai đều KHÔNG tự cập nhật:
#
# 1. nginx — bind-mount THƯ MỤC /opt/certbot/conf/archive/cuongthai.com và
#    nginx.conf trỏ tới /etc/letsencrypt/archive/fullchain.pem, một symlink
#    ĐẶT TAY (không phải thứ certbot quản). Gia hạn tạo fullchainN+1.pem mới
#    nhưng không đụng symlink đó.
#
# 2. coturn — dùng BẢN SAO ở /opt/coturn/certs. Không có gì nối nó với certbot.
#
# Đã xảy ra thật: 08/09/2026 cert hết hạn 01:00 GMT, cả web VÀ TURN-TLS cùng chết.
set -e
D=/etc/letsencrypt/archive/cuongthai.com
MOI=$(ls -1 $D/fullchain*.pem | sed 's/.*fullchain//;s/\.pem//' | sort -n | tail -1)

# 1. nginx
ln -sfn fullchain${MOI}.pem $D/fullchain.pem
ln -sfn privkey${MOI}.pem  $D/privkey.pem
docker exec cuonghoangdev_nginx nginx -t && docker exec cuonghoangdev_nginx nginx -s reload

# 2. coturn — chép đè rồi khởi động lại (coturn không nạp lại nóng được)
cp $D/fullchain${MOI}.pem /opt/coturn/certs/fullchain.pem
cp $D/privkey${MOI}.pem  /opt/coturn/certs/privkey.pem
chmod 644 /opt/coturn/certs/fullchain.pem

# ⚠️ KHOÁ RIÊNG: 600 ở đây là SAI và đã làm TURN-over-TLS chết câm từ lúc dựng
# tới 18/09/2026. Ảnh coturn chạy bằng nobody (uid 65534, gid 65533) nên không
# đọc nổi file root:root 600 ⇒ TLS không bật, nhưng STUN vẫn chạy nên nhìn
# ngoài tưởng ổn. Log còn nói mâu thuẫn: "Private key file found" một dòng,
# "cannot find private key file" dòng khác.
#
# Cấp cho ĐÚNG NHÓM của coturn chứ không chmod 644 — 644 là mở khoá riêng cho
# mọi tiến trình trên máy, không cần thiết.
chown root:65533 /opt/coturn/certs/privkey.pem
chmod 640 /opt/coturn/certs/privkey.pem

docker restart cuonghoangdev_coturn >/dev/null

# Nghiệm thu TO TIẾNG: nếu TLS vẫn không bật thì phải biết NGAY, đừng để lại
# một lần nữa phát hiện sau nhiều tháng.
sleep 5
if ss -tln | grep -q ':5349 '; then
  echo "[cuongthai] fullchain${MOI}.pem → nginx reload + coturn restart, TLS 5349 OK"
else
  echo "[cuongthai] ⚠️ CẢNH BÁO: coturn KHÔNG nghe 5349 — TURN-over-TLS đang chết." >&2
  docker logs --since 1m cuonghoangdev_coturn 2>&1 | grep -i 'private key' >&2 || true
  exit 1
fi
