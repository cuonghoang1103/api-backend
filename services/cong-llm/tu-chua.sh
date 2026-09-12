#!/usr/bin/env bash
# ─── Tự chữa cụm cong-llm: container "unhealthy" thì khởi động lại ───────
#
# Cron chạy mỗi phút (/etc/cron.d/cong-llm-tu-chua, trien-khai-vps.sh cài).
#
# Vì sao cần: `restart: unless-stopped` của Docker CHỈ dựng lại khi tiến trình
# CHẾT. Tiến trình còn sống mà treo (healthcheck đỏ) thì Docker ghi
# "unhealthy" rồi… để nguyên đó mãi. Không có gì tự cứu nó.
#
# Cố ý KHÔNG dùng container kiểu autoheal: nó phải mount docker.sock, tức là
# trao quyền root của cả VPS cho một container. Cron trên host thì đã là root sẵn.
#
# Chốt chống vòng lặp: mỗi container restart tối đa 3 lần/giờ. Quá mức đó thì
# lỗi không phải "treo tạm" mà là hỏng thật (cấu hình, key, rambo đổi API) —
# restart tiếp chỉ làm log rối thêm. Dừng tay và ghi rõ vào log.
#
# Container bị DỪNG TAY (exited/không tồn tại) thì KHÔNG đụng — tôn trọng
# quyết định của người đã dừng nó.
set -u
LOG=${TU_CHUA_LOG:-/opt/cong-llm/tu-chua.log}
DEM=${TU_CHUA_DEM:-/opt/cong-llm/state/tu-chua}
TRAN_MOI_GIO=3
mkdir -p "$DEM"
exec 9>"${TU_CHUA_KHOA:-/run/cong-llm-tu-chua.lock}"
flock -n 9 || exit 0

ghi() { echo "$(date '+%F %T') $*" >> "$LOG"; logger -t cong-llm-tu-chua "$*" 2>/dev/null; }

for ten in ${TU_CHUA_DS:-cuonghoangdev_newapi cuonghoangdev_canh_llm}; do
    tt=$(docker inspect -f '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' "$ten" 2>/dev/null) || continue
    [ "$tt" = "running unhealthy" ] || continue

    f="$DEM/$ten"
    bay_gio=$(date +%s)
    # Chỉ giữ các mốc restart trong 1 giờ gần nhất.
    moc=$(awk -v t="$bay_gio" '$1 > t - 3600' "$f" 2>/dev/null)
    so=$(printf '%s\n' "$moc" | grep -c . || true)
    if [ "$so" -ge "$TRAN_MOI_GIO" ]; then
        # Chỉ ghi một lần mỗi 10 phút, không làm ngập log.
        [ -f "$f.bao" ] && [ $((bay_gio - $(cat "$f.bao"))) -lt 600 ] && continue
        echo "$bay_gio" > "$f.bao"
        ghi "⛔ $ten vẫn unhealthy sau $so lần restart trong 1 giờ — NGỪNG tự restart, cần xem tay: docker logs --tail 50 $ten"
        continue
    fi
    ghi "↻ $ten unhealthy — restart (lần $((so + 1))/$TRAN_MOI_GIO trong giờ). Log trước khi restart:"
    docker logs --tail 15 "$ten" 2>&1 | sed 's/^/      /' >> "$LOG"
    docker restart -t 20 "$ten" >/dev/null 2>&1 && ghi "   $ten đã restart" || ghi "   ⚠ restart $ten HỎNG"
    { printf '%s\n' "$moc"; echo "$bay_gio"; } | grep . > "$f"
done

# Log không phình vô hạn: giữ 2.000 dòng cuối.
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 3000 ]; then
    tail -n 2000 "$LOG" > "$LOG.tmp" && cat "$LOG.tmp" > "$LOG" && rm -f "$LOG.tmp"
fi
