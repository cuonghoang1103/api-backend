#!/usr/bin/env bash
# ─── Triển khai cổng key con (New API + canh) lên VPS ─────────────────────
#
#   bash services/cong-llm/trien-khai.sh
#
# ĐỘC LẬP với deploy-nha.sh: không build ảnh, không đụng backend/frontend,
# không push GitHub. Chỉ chở thư mục services/cong-llm (bản ĐÃ COMMIT) lên
# /opt/cong-llm/app rồi dựng lại hai container của cụm `cong-llm`.
#
# Riêng khối `location ^~ /llm/v1/` trong nginx/nginx.conf thì đi đường chuẩn:
# lần deploy-nha.sh kế tiếp (bước 6c) mới đưa nó lên. Trước lúc đó cụm này
# vẫn chạy, chỉ là chưa ra được Internet.
set -euo pipefail

VPS="root@160.187.1.208"
VPS_SSH_KEY="${HOME}/.ssh/id_rsa"
GOC_REPO="$(cd "$(dirname "$0")/../.." && pwd)"
SSH=(ssh -i "$VPS_SSH_KEY" -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=4 "$VPS")

cd "$GOC_REPO"

# Chỉ chở bản ĐÃ COMMIT — cùng lý do deploy-nha.sh bỏ rsync: không chộp trúng
# file đang sửa dở của phiên khác.
if [ -n "$(git status --porcelain -- services/cong-llm)" ]; then
    echo "❌ services/cong-llm còn thay đổi chưa commit — commit trước rồi chạy lại:" >&2
    git status --short -- services/cong-llm >&2
    exit 1
fi
SHA=$(git rev-parse --short HEAD)

echo "→ chở services/cong-llm @ ${SHA} lên VPS"
# Giải nén vào thư mục MỚI rồi mới tráo tên: đang giải nén dở mà canh khởi
# động lại thì nó không đọc phải nửa file.
git archive HEAD services/cong-llm | "${SSH[@]}" "
    set -e
    rm -rf /opt/cong-llm/app.moi && mkdir -p /opt/cong-llm/app.moi
    tar -x -C /opt/cong-llm/app.moi --strip-components=2
    echo '${SHA}' > /opt/cong-llm/app.moi/PHIEN_BAN
    rm -rf /opt/cong-llm/app.cu
    if [ -d /opt/cong-llm/app ]; then mv /opt/cong-llm/app /opt/cong-llm/app.cu; fi
    mv /opt/cong-llm/app.moi /opt/cong-llm/app
"

echo "→ dựng cụm trên VPS"
# Chạy script bằng ĐƯỜNG DẪN, không `bash -s <<EOF`: lệnh docker bên trong có
# thể tranh đọc stdin với chính bash (bẫy đã ghi trong deploy-nha.sh).
"${SSH[@]}" "bash /opt/cong-llm/app/trien-khai-vps.sh"
