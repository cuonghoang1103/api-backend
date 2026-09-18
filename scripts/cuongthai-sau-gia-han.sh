#!/bin/sh
# Chạy sau MỖI lần certbot gia hạn cert cuongthai.com.
#
# ⚠️ BẢN CHẠY THẬT NẰM Ở /usr/local/bin/cuongthai-sau-gia-han.sh TRÊN VPS.
# File này là bản trong git để còn dựng lại được. Sửa ở đây thì phải chép lên:
#   scp scripts/cuongthai-sau-gia-han.sh vps:/usr/local/bin/ && ssh vps chmod +x /usr/local/bin/cuongthai-sau-gia-han.sh
#
# HAI nơi tiêu thụ chứng chỉ, và cả hai đều KHÔNG tự cập nhật — cả hai đều đọc
# chứng chỉ MỘT LẦN lúc khởi động rồi giữ trong RAM:
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
HAN_MOI=$(openssl x509 -in "$D/fullchain${MOI}.pem" -noout -enddate)

# ── 1. nginx ──────────────────────────────────────────────────────
ln -sfn fullchain${MOI}.pem $D/fullchain.pem
ln -sfn privkey${MOI}.pem  $D/privkey.pem
docker exec cuonghoangdev_nginx nginx -t && docker exec cuonghoangdev_nginx nginx -s reload

# ── 2. coturn ─────────────────────────────────────────────────────
cp $D/fullchain${MOI}.pem /opt/coturn/certs/fullchain.pem
cp $D/privkey${MOI}.pem  /opt/coturn/certs/privkey.pem
chmod 644 /opt/coturn/certs/fullchain.pem

# ⚠️ KHOÁ RIÊNG: 600 ở đây là SAI và đã làm TURN-over-TLS chết câm từ lúc dựng
# tới 18/09/2026. Ảnh coturn chạy bằng nobody (uid 65534, gid 65533) nên không
# đọc nổi file root:root 600 ⇒ TLS không bật, nhưng STUN vẫn chạy nên nhìn
# ngoài tưởng ổn. Cấp cho ĐÚNG NHÓM chứ không chmod 644 — 644 là mở khoá riêng
# cho mọi tiến trình trên máy mà chẳng để làm gì.
chown root:65533 /opt/coturn/certs/privkey.pem
chmod 640 /opt/coturn/certs/privkey.pem

docker restart cuonghoangdev_coturn >/dev/null

# ── 3. NGHIỆM THU ─────────────────────────────────────────────────
#
# HỎI THỨ ĐANG CHẠY, đừng đọc config rồi tin. `nginx -t` chỉ kiểm CÚ PHÁP —
# nó vẫn xanh khi chứng chỉ đã hết hạn, và `reload` vẫn trả về 0 khi nginx nạp
# lại đúng bản cũ. Chính vì thế sự cố 08/09 xảy ra mà không có gì báo động.
#
# Kiểm CẢ HAI rồi mới thoát, không dừng giữa chừng: một bên hỏng không có lý
# do gì để bỏ mặc bên kia ở chứng chỉ cũ.
sleep 5
LOI=0

HAN_NGINX=$(echo | openssl s_client -connect 127.0.0.1:443 -servername cuongthai.com 2>/dev/null \
            | openssl x509 -noout -enddate 2>/dev/null || true)
if [ "$HAN_NGINX" = "$HAN_MOI" ]; then
  echo "[cuongthai] nginx  OK — đang phục vụ ${HAN_MOI}"
else
  echo "[cuongthai] ⚠️ nginx VẪN phục vụ chứng chỉ cũ." >&2
  echo "            mong đợi: ${HAN_MOI}" >&2
  echo "            thực tế : ${HAN_NGINX:-(không bắt tay được — nginx còn sống không?)}" >&2
  LOI=1
fi

HAN_TURN=$(echo | openssl s_client -connect 127.0.0.1:5349 -servername cuongthai.com 2>/dev/null \
           | openssl x509 -noout -enddate 2>/dev/null || true)
if [ "$HAN_TURN" = "$HAN_MOI" ]; then
  echo "[cuongthai] coturn OK — TLS 5349 đang phục vụ ${HAN_MOI}"
else
  echo "[cuongthai] ⚠️ coturn KHÔNG phục vụ TLS đúng chứng chỉ — gọi video ở mạng chặn UDP sẽ hỏng." >&2
  echo "            mong đợi: ${HAN_MOI}" >&2
  echo "            thực tế : ${HAN_TURN:-(5349 không bắt tay được)}" >&2
  docker logs --since 2m cuonghoangdev_coturn 2>&1 | grep -i 'private key' >&2 || true
  LOI=1
fi

[ "$LOI" -eq 0 ] || exit 1
echo "[cuongthai] fullchain${MOI}.pem → nginx + coturn đều đã nhận."
