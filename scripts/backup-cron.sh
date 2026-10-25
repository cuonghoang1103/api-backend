#!/bin/bash
# Sao lưu Postgres hằng ngày (cron VPS 02:00) — /opt/cuonghoangdev/scripts/backup-cron.sh
#
# 26/10/2026 viết lại: bản cũ chạy `pg_dump | gzip > F` KHÔNG pipefail và chỉ kiểm "tệp không rỗng" ⇒ pg_dump hỏng
# (container dừng, hết kết nối, sai quyền…) vẫn ra tệp .gz ~20 byte, báo thành công, rồi `find -mtime +30 -delete`
# xoá bản cũ ⇒ hỏng âm thầm quá 30 ngày là mất HẾT bản tốt. Nay:
#   1. dump ra tệp TẠM, bắt lỗi cả pg_dump lẫn gzip (PIPESTATUS);
#   2. NGHIỆM THU: gzip -t + kích thước tối thiểu (≥ 10 MB và ≥ 50% bản tốt gần nhất) + dòng cuối
#      "PostgreSQL database dump complete";
#   3. chỉ khi qua mới đổi tên thành bản chính thức, đẩy R2, và mới xoá bản > 30 ngày (luôn giữ ≥ 7 bản tốt);
#   4. hỏng ở bất kỳ bước nào ⇒ xoá tệp tạm, KHÔNG xoá bản cũ, báo Telegram, exit 1.
# Thử khôi phục: bash /opt/cuonghoangdev/scripts/restore-test.sh (chạy tay hằng tháng — VPS 6 GB, không tự chạy đêm).
set -uo pipefail

DIR=/opt/cuonghoangdev/backups
ENV_FILE=/opt/cuonghoangdev/.env
D=$(date +%Y%m%d_%H%M%S)
F="$DIR/${D}_backup.sql.gz"
TMP="$DIR/.dang-ghi-${D}.sql.gz"
mkdir -p "$DIR"

_getenv() { grep -E "^$1=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }
bao() {   # bao "<nội dung>" — cảnh báo Telegram (cron không có biến môi trường ⇒ tự đọc .env)
  local tok chat
  tok="$(_getenv TELEGRAM_BOT_TOKEN)"; chat="$(_getenv TELEGRAM_CHAT_ID)"; [ -n "$chat" ] || chat="$(_getenv TELEGRAM_ADMIN_CHAT_ID)"
  [ -n "$tok" ] && [ -n "$chat" ] && curl -s -m 15 -o /dev/null "https://api.telegram.org/bot${tok}/sendMessage" \
    --data-urlencode "chat_id=${chat}" --data-urlencode "text=$1" || true
}
hong() { echo "[$(date)] ❌ BACKUP HỎNG: $1"; rm -f "$TMP"; bao "❌ cuongthai.com: sao lưu Postgres $D HỎNG — $1. Bản cũ được GIỮ NGUYÊN (không xoá). Xem /var/log/backup-cron.log"; exit 1; }

docker exec cuonghoangdev_postgres psql -U postgres -lqt 2>/dev/null | cut -d"|" -f1 | grep -qw cuonghoangdev_db \
  || hong "không thấy database cuonghoangdev_db (container postgres dừng?)"

# 1. dump ra tệp tạm, bắt lỗi cả hai đầu ống
docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > "$TMP"
ma=("${PIPESTATUS[@]}")
[ "${ma[0]}" = 0 ] || hong "pg_dump thoát mã ${ma[0]}"
[ "${ma[1]}" = 0 ] || hong "gzip thoát mã ${ma[1]}"

# 2. nghiệm thu
gzip -t "$TMP" 2>/dev/null || hong "tệp gzip hỏng"
co=$(stat -c %s "$TMP")
truoc=$(ls -t "$DIR"/*_backup.sql.gz 2>/dev/null | head -1)
co_truoc=$([ -n "$truoc" ] && stat -c %s "$truoc" || echo 0)
[ "$co" -ge 10485760 ] || hong "tệp quá nhỏ ($co byte < 10 MB)"
[ "$co_truoc" -eq 0 ] || [ $((co * 2)) -ge "$co_truoc" ] || hong "tệp $co byte < 50% bản gần nhất ($co_truoc byte)"
zcat "$TMP" | tail -n 5 | grep -q "PostgreSQL database dump complete" || hong "thiếu dòng 'dump complete' (pg_dump dừng giữa chừng)"

mv "$TMP" "$F"
echo "[$(date)] Backup: $F ($(du -h "$F" | cut -f1)) — đã nghiệm thu"

# 3. bản sao ngoài máy: bucket R2 RIÊNG (P0-6). Khoá R2_BACKUP_* chỉ tiêm vào một lệnh docker exec một lần
#    (backend chạy thường trực không mang khoá ghi backup). Lỗi đẩy R2 KHÔNG làm hỏng bản cục bộ, nhưng có báo.
BK_BUCKET="$(_getenv R2_BACKUP_BUCKET)"
if [ -n "$BK_BUCKET" ]; then
  BK_AK="$(_getenv R2_BACKUP_ACCESS_KEY_ID)"
  BK_SK="$(_getenv R2_BACKUP_SECRET_ACCESS_KEY)"
  if ! ( docker cp "$F" cuonghoangdev_backend:/tmp/dbbackup.sql.gz \
      && docker cp /opt/cuonghoangdev/scripts/backup-r2-upload.mjs cuonghoangdev_backend:/app/backup-r2-upload.mjs \
      && docker exec -e R2_BACKUP_BUCKET="$BK_BUCKET" -e R2_BACKUP_ACCESS_KEY_ID="$BK_AK" -e R2_BACKUP_SECRET_ACCESS_KEY="$BK_SK" \
           cuonghoangdev_backend node /app/backup-r2-upload.mjs /tmp/dbbackup.sql.gz "db/${D}_backup.sql.gz" ); then
    echo "[$(date)] WARN: off-site R2 upload failed"
    bao "⚠️ cuongthai.com: sao lưu $D OK ở VPS nhưng đẩy lên R2 HỎNG — xem /var/log/backup-cron.log"
  fi
  docker exec cuonghoangdev_backend sh -c 'rm -f /tmp/dbbackup.sql.gz /app/backup-r2-upload.mjs' 2>/dev/null || true
fi

# 4. dọn bản > 30 ngày — CHỈ sau khi bản mới đã qua nghiệm thu, và luôn giữ ít nhất 7 bản mới nhất
rm -f "$DIR"/.dang-ghi-*.sql.gz
ls -t "$DIR"/*_backup.sql.gz | tail -n +8 | while read -r cu; do
  [ -n "$(find "$cu" -mtime +30 2>/dev/null)" ] && rm -f "$cu" && echo "[$(date)] xoá bản cũ $cu"
done
exit 0
