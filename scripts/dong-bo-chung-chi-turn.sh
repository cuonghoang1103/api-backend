#!/usr/bin/env bash
# Chép chứng chỉ Let's Encrypt sang một bản coturn ĐỌC ĐƯỢC.
#
# ⚠️ KHÔNG PHẢI script chạy tự động. Thứ chạy sau mỗi lần certbot gia hạn là
# `/usr/local/bin/cuongthai-sau-gia-han.sh` trên VPS (bản trong git:
# `scripts/cuongthai-sau-gia-han.sh`) — nó làm cả nginx lẫn coturn. File này
# chỉ dùng khi cần chép tay riêng phần coturn. Sửa quyền ở đây thì sửa CẢ hai,
# không thì hai script lại nói ngược nhau như từ 21/08 tới 18/09/2026.
#
# VÌ SAO PHẢI CHÉP: ảnh coturn chạy bằng `nobody`, còn khoá riêng của certbot
# là `root:root 600`. Container không đọc nổi ⇒ TLS 5349 không bật, mà STUN
# vẫn chạy nên nhìn ngoài tưởng mọi thứ ổn. Log còn nói mâu thuẫn: "Private
# key file found" ở một dòng, "cannot find private key file" ở dòng khác.
#
# KHÔNG nới quyền file gốc — nginx và certbot đang dựa vào nó.
#
# Chạy sau mỗi lần certbot gia hạn (thêm vào cron hoặc deploy hook):
#   bash scripts/dong-bo-chung-chi-turn.sh && docker restart cuonghoangdev_coturn
set -euo pipefail

NGUON=/opt/certbot/conf/live/cuongthai.com
DICH=/opt/coturn/certs

[ -r "$NGUON/privkey.pem" ] || { echo "Không đọc được $NGUON/privkey.pem — chạy bằng root chưa?" >&2; exit 1; }

mkdir -p "$DICH"
# `-L` để đi theo symlink của certbot và chép file THẬT.
cp -L "$NGUON/fullchain.pem" "$DICH/fullchain.pem"
cp -L "$NGUON/privkey.pem"  "$DICH/privkey.pem"

# Cấp cho ĐÚNG NHÓM của coturn (gid 65533 = nogroup), không chmod 644 — 644 là
# mở khoá riêng cho mọi tiến trình trên máy mà chẳng cần thiết.
#
# Nỗi lo "đổi ảnh coturn thì gid đổi, hỏng câm" được xử bằng phép nghiệm thu ở
# cuối file: gid sai thì 5349 không nghe, và script kêu chứ không im.
chmod 755 "$DICH"
chmod 644 "$DICH/fullchain.pem"
chown root:65533 "$DICH/privkey.pem"
chmod 640 "$DICH/privkey.pem"

echo "✔ đã chép chứng chỉ sang $DICH"
openssl x509 -in "$DICH/fullchain.pem" -noout -enddate | sed 's/^/  /'
