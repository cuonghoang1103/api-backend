#!/usr/bin/env bash
# Chép chứng chỉ Let's Encrypt sang một bản coturn ĐỌC ĐƯỢC.
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

# 644 cho khoá riêng nghe đáng ngại, nhưng: thư mục này chỉ chứa bản sao của
# chứng chỉ, nằm trên máy chủ mà chỉ root đăng nhập được, và container cần
# đọc bằng `nobody`. Cách chặt hơn là đổi chủ sang uid 65534 — nhưng như thế
# thì mỗi lần đổi ảnh coturn (uid có thể khác) lại hỏng câm.
chmod 755 "$DICH"
chmod 644 "$DICH/fullchain.pem" "$DICH/privkey.pem"

echo "✔ đã chép chứng chỉ sang $DICH"
openssl x509 -in "$DICH/fullchain.pem" -noout -enddate | sed 's/^/  /'
