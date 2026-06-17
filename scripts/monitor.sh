#!/bin/bash
# ============================================================
# CuongHoangDev - Health Monitoring Script
# Cron: */5 * * * * /opt/cuonghoangdev/scripts/monitor.sh
# ============================================================

set -e

ALERT_EMAIL="${ALERT_EMAIL:-cuongthaihnhe176322@gmail.com}"
FRONTEND_URL="https://cuongthai.com"
BACKEND_URL="https://api.cuongthai.com/api/v1/system/health"
LOG_FILE="/var/log/cuonghoangdev-monitor.log"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log_msg() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

send_alert() {
    local msg="$1"
    log_error "$msg"

    # Email
    if command -v mail &> /dev/null; then
        echo "$msg" | mail -s "[CuongHoangDev] Alert: $msg" "$ALERT_EMAIL" 2>/dev/null || true
    fi

    # Telegram
    if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
        curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
            -d "chat_id=$TELEGRAM_CHAT_ID" \
            -d "text=🚨 CuongHoangDev Alert: $msg" 2>/dev/null || true
    fi
}

# Check Frontend
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$FRONTEND_URL/" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    log_msg "Frontend: OK (HTTP $HTTP_CODE)"
else
    send_alert "Frontend DOWN (HTTP $HTTP_CODE)"
fi

# Check Backend Health
HEALTH=$(curl -s --max-time 10 "$BACKEND_URL" 2>/dev/null || echo "")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
    log_msg "Backend: OK"
else
    send_alert "Backend DOWN or Unhealthy: $HEALTH"
fi

# Check Docker Containers
for container in cuonghoangdev_backend cuonghoangdev_frontend cuonghoangdev_nginx cuonghoangdev_postgres cuonghoangdev_redis; do
    STATUS=$(docker inspect -f '{{.State.Status}}' "$container" 2>/dev/null || echo "missing")
    if [ "$STATUS" = "running" ]; then
        log_msg "  $container: OK"
    else
        send_alert "Container $container is NOT running (status: $STATUS)"
    fi
done

# Check Disk Space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    send_alert "Disk usage critical: ${DISK_USAGE}%"
else
    log_msg "  Disk usage: ${DISK_USAGE}%"
fi

# Check Memory
MEM_USAGE=$(free | awk '/Mem:/ {printf "%.0f", $3/$2 * 100}')
if [ "$MEM_USAGE" -gt 90 ]; then
    send_alert "Memory usage critical: ${MEM_USAGE}%"
else
    log_msg "  Memory usage: ${MEM_USAGE}%"
fi

log_msg "Health check complete."
