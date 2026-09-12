#!/usr/bin/env bash
# Phần chạy TRÊN VPS của trien-khai.sh — đừng gọi tay trên máy local.
set -eo pipefail

GOC=/opt/cong-llm
ENV_CHINH=/opt/cuonghoangdev/.env
ENV_RIENG=$GOC/.env
MANG=cuonghoangdev_backend

mkdir -p "$GOC/data" "$GOC/state"

docker network inspect "$MANG" >/dev/null 2>&1 || {
    echo "❌ không thấy mạng Docker $MANG — stack chính có đang chạy không?" >&2
    exit 1
}

# Key rambo dùng CHUNG với backend. Chỉ kiểm có hay không, không in giá trị.
for bien in AGENT_GATEWAY_BASE_URL AGENT_GATEWAY_API_KEY; do
    grep -q "^${bien}=..*" "$ENV_CHINH" || {
        echo "❌ $ENV_CHINH chưa có $bien — canh không có key chính để gọi rambo." >&2
        exit 1
    }
done

# Bí mật riêng của cụm: sinh MỘT lần, sống qua mọi lần triển khai.
if [ ! -f "$ENV_RIENG" ]; then
    (
        umask 077
        {
            echo "CONG_LLM_SESSION_SECRET=$(openssl rand -hex 32)"
            echo "CONG_LLM_KHOA_NOI_BO=$(openssl rand -hex 32)"
            echo "CONG_LLM_ADMIN_USER=quantri"
            echo "CONG_LLM_ADMIN_PASS=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)"
        } > "$ENV_RIENG"
    )
    echo "✓ đã sinh $ENV_RIENG (mật khẩu quản trị New API nằm trong đó)"
fi
chmod 600 "$ENV_RIENG"

# Nạp env giống hệt deploy-nha.sh (`set -a; . file`) chứ không `--env-file`:
# bộ đọc env-file của compose khác shell ở chuyện dấu nháy, và file chính đã
# chạy ổn qua đường `. file` từ lâu.
set -a
. "$ENV_CHINH"
. "$ENV_RIENG"
set +a
# File env chính là của stack `cuonghoangdev`; lỡ nó khai biến COMPOSE_* thì
# compose sẽ dựng nhầm file/nhầm project. Cụm này tự nói rõ cả hai.
unset COMPOSE_FILE COMPOSE_PROJECT_NAME COMPOSE_PROFILES

cd "$GOC/app"
DC="docker compose -p cong-llm -f $GOC/app/docker-compose.yml"
$DC up -d newapi
# canh luôn dựng lại: nó đọc mã từ thư mục vừa được tráo.
$DC up -d --force-recreate canh

cho_khoe() {
    local ten=$1 i
    for i in $(seq 1 40); do
        [ "$(docker inspect -f '{{.State.Health.Status}}' "$ten" 2>/dev/null)" = healthy ] && { echo "✓ $ten khoẻ"; return 0; }
        sleep 2
    done
    echo "❌ $ten không khoẻ sau 80s:" >&2
    docker logs --tail 30 "$ten" >&2
    return 1
}
cho_khoe cuonghoangdev_newapi
cho_khoe cuonghoangdev_canh_llm

# Chạy lại mỗi lần cũng được — chỉ bổ sung cái còn thiếu.
docker exec cuonghoangdev_canh_llm node /app/khoi-tao.mjs

echo "── trạng thái canh"
docker exec cuonghoangdev_canh_llm wget -qO- http://localhost:8080/suc-khoe; echo
docker logs --tail 5 cuonghoangdev_canh_llm

echo "── đường ra Internet (401 = nginx đã nối vào New API; 404 = nginx.conf chưa được deploy-nha.sh đưa lên)"
curl -s -o /dev/null -w "   https://api.cuongthai.com/llm/v1/messages → %{http_code}\n" \
    -X POST https://api.cuongthai.com/llm/v1/messages -H 'content-type: application/json' -d '{}' || true
echo "✓ xong — phiên bản $(cat "$GOC/app/PHIEN_BAN" 2>/dev/null)"
