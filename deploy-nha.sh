#!/bin/bash
# ============================================================
# Deploy KIỂU MỚI: máy nhà BUILD, VPS chỉ TRÁO
#
#   Mac ──git archive HEAD──▶ máy nhà ──build──▶ GHCR ──pull──▶ VPS ──tráo
#
# Vì sao có file này (đo thật 13-14/08/2026):
#
#  • NHANH HƠN. Build ảnh trên VPS 6GB RAM: backend 4'37, frontend 11'00.
#    Cùng mã đó ở máy nhà (12 nhân/31GB): 1'34 và 5'56 — mà còn đo trong lúc
#    hai bản build chạy đè nhau. VPS buộc phải build TUẦN TỰ vì build song
#    song từng bị OOM giết (exit 137); máy nhà chạy song song load chỉ 0,74.
#
#  • ĐỠ ĐẦY ĐĨA. Cache build trên VPS phình 7,6GB, đẩy đĩa lên 91% (còn 4,4GB)
#    trong khi Postgres cũng nằm trên đúng cái đĩa đó. Build ở nhà thì VPS
#    không còn cache build nào.
#
#  • HẾT LỖI "CHỘP TRÚNG FILE ĐANG LƯU DỞ". `deploy.sh` rsync CÂY LÀM VIỆC,
#    nên 13/08 nó ba lần đẩy nhầm file mà phiên khác đang gõ dở (goKhoiCheck
#    chưa có, lyDoDung thừa) và build đổ — dù mã đã commit là sạch. File này
#    lấy mã bằng `git archive HEAD`: CHỈ nội dung đã commit, không đọc đĩa.
#    ⚠️ Hệ quả: thay đổi CHƯA COMMIT sẽ KHÔNG được deploy. Có chủ ý.
#
# ĐƯỜNG LÙI: máy nhà mất điện/mất mạng/build hỏng ⇒ tự quay về `deploy.sh`
# (VPS tự build như cũ, chậm hơn nhưng không phụ thuộc máy nhà). Máy nhà
# KHÔNG giữ dữ liệu gì của web: nó chết cũng không mất byte nào, web vẫn chạy
# bằng ảnh đã dựng lần trước.
#
# Dùng:
#   bash deploy-nha.sh              # build ở nhà, hỏng thì tự lùi về VPS
#   bash deploy-nha.sh --khong-lui  # hỏng thì dừng hẳn, không tự lùi
#   bash deploy-nha.sh --chi-build  # build + đẩy ảnh lên GHCR, KHÔNG tráo
#   bash deploy-nha.sh --khong-day  # CHỈ build ở nhà, không đẩy, không tráo
#
# ─── Sửa 17/08/2026 (sau khi phát hiện nó chưa từng chạy trót lọt) ─────────
#  1. Kiểm đăng nhập GHCR **trước** khi build. Trước đây khoá thiếu thì phải
#     chờ ~6 phút build xong mới lộ, rồi script lặng lẽ lùi về đường VPS —
#     nhìn log vẫn thấy "deploy xong". Từ 14/08 đến 17/08 nó chưa đẩy nổi một
#     ảnh nào lên GHCR mà không ai biết.
#  2. **Không tự lùi về `deploy.sh` khi cây làm việc bẩn.** Đường lùi đó rsync
#     cây làm việc — đúng cái lỗi mà file này sinh ra để tránh.
#  3. Gửi mã bằng `git push` vào kho trần ở máy nhà thay cho `git archive`:
#     archive repo này nặng 272MB và nén gần như không xuống, lần nào cũng
#     phải chở đủ; push chỉ chở object mới (lần đầu ~150MB, sau vài chục KB).
#     Vẫn giữ đúng tính chất: CHỈ nội dung đã commit.
#  4. Vào máy nhà qua **LAN** khi ở cùng nhà (`linux-nha` đi vòng qua VPS nên
#     bắt VPS chở hộ từng byte), nạp `.env` production bằng bộ đọc chịu được
#     dòng hỏng, và smoke-test **đọc danh sách route thẳng từ `deploy.sh`**
#     thay vì giữ một bản chép rời sẽ lệch.
# ============================================================

set -uo pipefail

# ─── Cấu hình ──────────────────────────────────────────────────────────
VPS_IP="160.187.1.208"
VPS_USER="root"
VPS_SSH_KEY="${HOME}/.ssh/id_rsa"
# Hai lối vào máy nhà. Ở cùng nhà thì đi thẳng qua LAN — nhanh hơn và nhất là
# KHÔNG bắt VPS chở hộ: `linux-nha` trong ~/.ssh/config đi vòng
# Mac → VPS → đường hầm ngược → máy nhà, nên mỗi byte mã nguồn đều chạy qua VPS
# hai lần. Đo 17/08: repo này `git archive HEAD` nặng 272MB và nén hầu như không
# xuống (189MB — ảnh/zip/stl vốn đã nén).
MAY_NHA_LAN="Cuong03dx@192.168.1.102"     # cùng nhà: đi thẳng
MAY_NHA_XA="linux-nha"                    # ở xa: qua đường hầm
MAY_NHA=""                                # chọn lúc chạy — xem bước 1
THU_MUC_NHA="\$HOME/cuongthai-build"      # trên máy nhà
KHO_TUONG_DOI="cuongthai-build/repo.git"  # kho git TRẦN ở máy nhà (tính từ $HOME)
COMPOSE_PROJECT="cuonghoangdev"
GHCR_BE="ghcr.io/cuonghoang1103/api-backend-backend"
GHCR_FE="ghcr.io/cuonghoang1103/api-backend-frontend"
HEALTH_URL="http://localhost:3001/api/v1/system/health"
KHOA="/var/lock/cuongthai-deploy.lock"

TU_LUI=true
CHI_BUILD=false
KHONG_DAY=false
KHONG_HOI=false
for a in "$@"; do
    case "$a" in
        --khong-lui) TU_LUI=false ;;
        --chi-build) CHI_BUILD=true ;;
        # Dựng ảnh ở máy nhà rồi DỪNG — không đẩy GHCR, không tráo. Dùng để thử
        # đường build khi chưa có khoá GHCR, hoặc để xem mã có build nổi không.
        --khong-day) KHONG_DAY=true; CHI_BUILD=true ;;
        # Bỏ qua bước hỏi duyệt push qua Telegram ở cuối (bước 8).
        --khong-hoi) KHONG_HOI=true ;;
    esac
done

info() { echo "[$(date '+%H:%M:%S')] [INFO]  $*"; }
ok()   { echo "[$(date '+%H:%M:%S')] [✅ OK]  $*"; }
warn() { echo "[$(date '+%H:%M:%S')] [WARN]  $*"; }
fail() { echo "[$(date '+%H:%M:%S')] [❌ FAIL] $*"; }

sshnha() { ssh -o ConnectTimeout=15 -o BatchMode=yes "$MAY_NHA" "$@"; }
sshvps() { ssh -i "$VPS_SSH_KEY" -o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new "${VPS_USER}@${VPS_IP}" "$@"; }

lui_ve_vps() {
    local ly_do="$1"
    if [ "$TU_LUI" != true ]; then
        fail "$ly_do — dừng ở đây (đang bật --khong-lui)"
        exit 1
    fi
    # ⛔ Cây làm việc bẩn thì TUYỆT ĐỐI không lùi.
    #
    # `deploy.sh` rsync CÂY LÀM VIỆC. Chính vì thế mà file này ra đời: 13/08 nó
    # ba lần chộp trúng file phiên khác đang gõ dở. Tự lùi sang nó lúc cây đang
    # bẩn là im lặng làm lại đúng cái lỗi vừa tránh — mà lại lùi vào giữa lúc
    # người dùng đang bận đọc log build hỏng, không ai kịp ngăn.
    if [ -n "$(git status --porcelain | grep -vE '^\?\?')" ]; then
        fail "$ly_do"
        fail "KHÔNG tự lùi: cây làm việc còn thay đổi chưa commit, mà deploy.sh"
        fail "đẩy nguyên cây làm việc lên production. Commit (hoặc stash) rồi chạy lại,"
        fail "hoặc chạy tay 'bash deploy.sh' nếu bạn thật sự muốn đẩy cả phần chưa commit."
        exit 1
    fi
    warn "$ly_do"
    warn "ĐƯỜNG LÙI: quay về deploy.sh — VPS tự build (chậm hơn ~8 phút)"
    exec bash "$(dirname "${BASH_SOURCE[0]}")/deploy.sh"
}

echo ""
echo "==============================================="
echo "  Deploy: MÁY NHÀ build → VPS tráo"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "==============================================="
echo ""

# ─── 0. Mã nguồn: CHỈ những gì đã commit ───────────────────────────────
cd "$(dirname "${BASH_SOURCE[0]}")"
SHA=$(git rev-parse --short HEAD) || { fail "không đọc được git HEAD"; exit 1; }
NHANH=$(git rev-parse --abbrev-ref HEAD)

BAN=$(git status --porcelain | grep -vE '^\?\?' | head -20)
if [ -n "$BAN" ]; then
    warn "Cây làm việc CÒN THAY ĐỔI CHƯA COMMIT — những thứ này sẽ KHÔNG lên production:"
    echo "$BAN" | sed 's/^/         /'
    warn "(khác với deploy.sh: nó đẩy cả file chưa commit. Muốn deploy chúng thì commit trước.)"
    read -r -p "         Vẫn deploy commit ${SHA}? [y/N] " tra_loi
    [[ "$tra_loi" =~ ^[Yy]$ ]] || { info "Dừng theo yêu cầu."; exit 0; }
fi
ok "Deploy commit ${SHA} (nhánh ${NHANH})"

# ─── 1. Máy nhà còn sống không ─────────────────────────────────────────
info "Kiểm máy nhà..."
# LAN trước, đường hầm sau. `-o BatchMode` để không bao giờ ngồi chờ hỏi mật khẩu.
if ssh -o ConnectTimeout=4 -o BatchMode=yes "$MAY_NHA_LAN" true 2>/dev/null; then
    MAY_NHA="$MAY_NHA_LAN"; ok "Vào máy nhà qua LAN (không phiền tới VPS)"
elif ssh -o ConnectTimeout=12 -o BatchMode=yes "$MAY_NHA_XA" true 2>/dev/null; then
    MAY_NHA="$MAY_NHA_XA"; ok "Vào máy nhà qua đường hầm VPS"
else
    lui_ve_vps "Máy nhà không trả lời (thử cả LAN lẫn đường hầm)"
fi
if ! sshnha 'command -v docker >/dev/null && docker info >/dev/null 2>&1' 2>/dev/null; then
    lui_ve_vps "Máy nhà có SSH nhưng Docker chưa chạy"
fi
DU_DIA=$(sshnha 'df -BG --output=avail / | tail -1 | tr -dc "0-9"' 2>/dev/null || echo 0)
if [ "${DU_DIA:-0}" -lt 20 ]; then
    lui_ve_vps "Máy nhà chỉ còn ${DU_DIA}G đĩa (cần ≥20G)"
fi
ok "Máy nhà sẵn sàng (còn ${DU_DIA}G đĩa)"

# ─── 1b. Khoá GHCR: kiểm TRƯỚC khi build, không phải sau ────────────────
# Trước đây chỗ này nằm sau bước build: đăng nhập thiếu thì phải chờ ~6 phút
# build xong mới biết, rồi script lặng lẽ lùi về đường VPS chậm — nhìn log vẫn
# thấy "deploy xong" nên không ai nhận ra. Đúng như vậy suốt từ 14/08 tới
# 17/08/2026: `deploy-nha.sh` chưa từng đẩy nổi một ảnh nào lên GHCR.
if [ "$KHONG_DAY" != true ]; then
    if ! sshnha 'grep -q ghcr.io ~/.docker/config.json 2>/dev/null'; then
        fail "Máy nhà CHƯA đăng nhập ghcr.io — có build cũng không đẩy ảnh đi được."
        fail "Chạy MỘT LẦN (token cần quyền write:packages):"
        fail "    ssh ${MAY_NHA} 'echo <TOKEN> | docker login ghcr.io -u cuonghoang1103 --password-stdin'"
        fail "Hoặc chạy 'bash deploy-nha.sh --khong-day' để chỉ thử build, không đẩy."
        exit 1
    fi
    ok "Máy nhà đã đăng nhập GHCR"
fi

# ─── 2. Đẩy MÃ ĐÃ COMMIT sang máy nhà ──────────────────────────────────
# Đẩy vào một KHO GIT TRẦN ở máy nhà, rồi bung commit ra thư mục build.
#
# Vì sao không `git archive HEAD | tar x` thẳng như bản đầu: archive của repo
# này nặng **272MB** và nén gần như không xuống (189MB — ảnh/zip/stl vốn đã
# nén), nên lần deploy nào cũng phải chở đủ 272MB qua Wi-Fi. `git push` chỉ chở
# object MỚI: lần đầu ~150MB, những lần sau vài chục KB.
#
# Tính chất quan trọng nhất giữ nguyên: chỉ NỘI DUNG ĐÃ COMMIT đi qua. Không
# đọc cây làm việc ⇒ file phiên khác đang gõ dở không lọt vào production.
info "Gửi mã (commit ${SHA}) sang máy nhà..."
DICH="${THU_MUC_NHA}/${SHA}"
sshnha "mkdir -p ${THU_MUC_NHA} && [ -d \$HOME/${KHO_TUONG_DOI} ] || git init --bare -q \$HOME/${KHO_TUONG_DOI}" \
    || lui_ve_vps "Không tạo được kho git ở máy nhà"
# Nhánh tạm `deploy` — chỉ là chỗ neo để object không bị dọn; ép ghi đè mỗi lần.
if ! git push --quiet --force "${MAY_NHA}:${KHO_TUONG_DOI}" "HEAD:refs/heads/deploy"; then
    lui_ve_vps "Đẩy mã sang máy nhà thất bại"
fi
if ! sshnha "rm -rf ${DICH} && mkdir -p ${DICH} && git --git-dir=\$HOME/${KHO_TUONG_DOI} archive ${SHA} | tar x -C ${DICH}"; then
    lui_ve_vps "Bung mã ở máy nhà thất bại"
fi
ok "Mã đã sang máy nhà"

# ─── 3. Build SONG SONG ở nhà ──────────────────────────────────────────
# Song song được vì máy nhà 12 nhân/31GB. Trên VPS thì không — xem đầu file.
info "Build backend + frontend SONG SONG ở máy nhà (đo trước: ~6 phút)..."
# ⚠️ KHÔNG bọc lệnh nền trong subshell `( … & )`: khi đó tiến trình build là
# con của SUBSHELL, còn `wait` chạy ở shell cha ⇒ "not a child of this shell",
# script tưởng build xong ngay lập tức. Phải chạy nền thẳng ở shell này.
if ! ssh -o ConnectTimeout=15 -o BatchMode=yes "$MAY_NHA" bash -s <<EOF
set -u
cd ${DICH} || exit 1
export DOCKER_BUILDKIT=1

# ⛔⛔ PHẢI CHỈ RÕ \`-f Dockerfile.backend\`.
#
# \`docker build .\` lấy \`Dockerfile\` mặc định — một file KHÁC hẳn thứ
# production dùng. \`docker-compose.yml\` dựng backend bằng
# \`dockerfile: Dockerfile.backend\` (node:22-slim, glibc), còn \`Dockerfile\`
# trần kết thúc ở \`node:22-alpine\` (musl) trong khi vẫn chép sang engine
# Prisma bản \`debian-openssl-3.0.x\`. Engine glibc KHÔNG nạp được trên musl.
#
# Hậu quả đo thật 18/08/2026: ảnh dựng xong bình thường, đẩy lên GHCR bình
# thường, tráo lên production bình thường — rồi backend restart vô tận với
# \`Could not parse schema engine response\` và API chết 502 suốt 7 phút.
# Ảnh nhỏ hơn 1,1GB và có 13 lớp thay vì 19; nhìn con số là thấy khác, nhưng
# không có bước nào so.
#
# Frontend thì \`./frontend\` đã trỏ đúng \`frontend/Dockerfile\` mà compose
# dùng — vẫn ghi rõ cho khỏi trôi.
docker build -f Dockerfile.backend --build-arg YTDLP_NGAY=\$(date +%F) -t ${GHCR_BE}:${SHA} -t ${GHCR_BE}:latest . > /tmp/nha-be.log 2>&1 &
PID_BE=\$!
docker build -f frontend/Dockerfile -t ${GHCR_FE}:${SHA} -t ${GHCR_FE}:latest ./frontend > /tmp/nha-fe.log 2>&1 &
PID_FE=\$!

wait \$PID_BE; MA_BE=\$?
wait \$PID_FE; MA_FE=\$?
echo "backend=\$MA_BE frontend=\$MA_FE"
[ \$MA_BE -eq 0 ] && [ \$MA_FE -eq 0 ]
EOF
then
    warn "Build ở máy nhà HỎNG — đuôi hai bản log:"
    sshnha 'echo "── backend ──"; tail -12 /tmp/nha-be.log; echo "── frontend ──"; tail -12 /tmp/nha-fe.log' 2>/dev/null | sed 's/^/         /'
    lui_ve_vps "Build ở máy nhà thất bại"
fi
ok "Hai ảnh đã dựng xong ở máy nhà"

# ─── 3b. Ảnh có CHẠY NỔI không ─────────────────────────────────────────
#
# Build xanh KHÔNG có nghĩa là ảnh chạy được. 18/08/2026: ảnh backend dựng
# xong, đẩy lên GHCR, tráo lên production — rồi restart vô tận với
# `Could not parse schema engine response` và API chết 502 suốt 7 phút, vì nó
# dựng nhầm Dockerfile nên nền là musl còn engine Prisma là bản glibc.
#
# Phép kiểm rẻ nhất bắt đúng lớp lỗi đó: engine Prisma trong ảnh phải hợp với
# libc của chính ảnh. Hai lần chạy container vài giây, đổi lấy việc không bao
# giờ tráo một ảnh chết lên production nữa.
info "Kiểm ảnh backend có chạy nổi không (libc ↔ engine Prisma)..."
KQ_KIEM=$(sshnha "docker run --rm --entrypoint sh ${GHCR_BE}:${SHA} -c '
    if ls /lib/ld-musl-x86_64.so.1 >/dev/null 2>&1; then echo -n musl; else echo -n glibc; fi
    echo -n \" \"
    ls node_modules/.prisma/client/ 2>/dev/null | grep -o \"debian\|musl\" | head -1
'" 2>/dev/null)
LIBC_ANH=$(echo "$KQ_KIEM" | awk '{print $1}')
LIBC_ENGINE=$(echo "$KQ_KIEM" | awk '{print $2}')
[ "$LIBC_ENGINE" = "debian" ] && LIBC_ENGINE=glibc
if [ -z "$LIBC_ANH" ] || [ -z "$LIBC_ENGINE" ]; then
    lui_ve_vps "Không đọc được engine Prisma trong ảnh backend (ảnh hỏng?)"
elif [ "$LIBC_ANH" != "$LIBC_ENGINE" ]; then
    fail "Ảnh backend nền ${LIBC_ANH} nhưng engine Prisma là bản ${LIBC_ENGINE} — engine sẽ KHÔNG nạp được."
    fail "Gần như chắc chắn là dựng nhầm Dockerfile: production dùng Dockerfile.backend"
    fail "(node:22-slim, glibc), còn Dockerfile trần kết thúc ở node:22-alpine (musl)."
    lui_ve_vps "Ảnh backend không chạy nổi — DỪNG trước khi tráo"
fi
ok "Ảnh backend hợp lệ (nền ${LIBC_ANH}, engine ${LIBC_ENGINE})"

if [ "$KHONG_DAY" = true ]; then
    ok "Xong phần build (--khong-day). Ảnh nằm ở máy nhà, chưa đẩy đi đâu."
    sshnha "docker images --format '{{.Repository}}:{{.Tag}}\t{{.Size}}' | grep ${SHA}" 2>/dev/null | sed 's/^/         /'
    exit 0
fi

# ─── 4. Đẩy ảnh lên GHCR ───────────────────────────────────────────────
# Chỉ những lớp THAY ĐỔI mới phải truyền, nên lần deploy sau nhẹ hơn nhiều.
# ⚠️ KHÔNG nuốt đầu ra vào /dev/null. Bản trước làm thế rồi in
# "máy nhà nhiều khả năng chưa đăng nhập GHCR" — một câu ĐOÁN, và 18/08/2026 nó
# đoán SAI: máy nhà đăng nhập bình thường, `docker push` chạy tay được ngay,
# nguyên nhân thật là mạng đứt giữa chừng. Câu đoán sai tốn của người đọc một
# vòng đi tạo token mới, trong khi việc đúng chỉ là bấm chạy lại.
#
# Nên: giữ lỗi THẬT, tự thử lại một lần, và chỉ nhắc chuyện đăng nhập KHI lỗi
# đúng là chuyện đăng nhập.
NHAT_KY_DAY=/tmp/nha-day-ghcr.log

day_anh_len_ghcr() {
    sshnha "docker push ${GHCR_BE}:${SHA} && docker push ${GHCR_BE}:latest && \
            docker push ${GHCR_FE}:${SHA} && docker push ${GHCR_FE}:latest" \
        > "$NHAT_KY_DAY" 2>&1
}

info "Đẩy ảnh lên GHCR..."
if ! day_anh_len_ghcr; then
    warn "Đẩy ảnh hỏng ở lần 1 — bốn dòng cuối:"
    tail -4 "$NHAT_KY_DAY" | sed 's/^/         /'
    # Đẩy ảnh là truyền hàng trăm MB; đứt giữa chừng là chuyện thường và lần
    # thử lại gần như luôn qua (chỉ những lớp còn thiếu mới phải truyền lại).
    info "Thử lại lần 2..."
    if ! day_anh_len_ghcr; then
        fail "Không đẩy được ảnh lên GHCR sau 2 lần. Lỗi THẬT:"
        tail -12 "$NHAT_KY_DAY" | sed 's/^/         /'
        if grep -qiE 'denied|unauthorized|authentication required|forbidden|login' "$NHAT_KY_DAY"; then
            warn "Lỗi trên là chuyện QUYỀN. Chạy MỘT LẦN trên máy nhà (token cần write:packages):"
            warn "    ssh ${MAY_NHA} 'echo <TOKEN> | docker login ghcr.io -u cuonghoang1103 --password-stdin'"
        else
            warn "Lỗi trên KHÔNG phải chuyện đăng nhập. Nhật ký đầy đủ: $NHAT_KY_DAY"
        fi
        lui_ve_vps "Không đẩy được ảnh lên GHCR"
    fi
    ok "Lần 2 qua — đúng là trục trặc mạng, không phải cấu hình."
fi
ok "Ảnh đã lên GHCR (tag ${SHA} và latest)"

if [ "$CHI_BUILD" = true ]; then
    ok "Xong phần build (--chi-build). Chưa tráo gì trên VPS."
    exit 0
fi

# ─── 5. VPS: KHOÁ → kéo ảnh → tráo ─────────────────────────────────────
# Khoá là bắt buộc: hai lần tráo chồng nhau chính là sự cố 06/07/2026
# (Exited 137 + container mồ côi) và lỗi 13/08 "Conflict. The container name
# … is already in use". Build thì chạy song song thoải mái, TRÁO thì không.
info "Tráo container trên VPS (có khoá chống hai phiên cùng tráo)..."
# Heredoc ĐÓNG NGOẶC ĐƠN: không có gì nở ra ở máy Mac. Mọi giá trị thay đổi đi
# vào bằng biến môi trường của `bash -s`, nên không phải đếm dấu `\$` — chỗ đó
# sai một cái là câu lệnh chạy trên PRODUCTION với biến rỗng.
TRAO_ENV="SHA='${SHA}' BE='${GHCR_BE}' FE='${GHCR_FE}' PROJ='${COMPOSE_PROJECT}' KHOA='${KHOA}' ENV_FILE='/opt/cuonghoangdev/.env' REPO_DIR='/home/deployer/repo'"
if ! sshvps "${TRAO_ENV} bash -s" <<'EOF' 2>&1 | tee /tmp/trao.log
set -e
exec 9>"$KHOA"
if ! flock -n 9; then
  echo "KHOA_BAN"
  exit 75
fi

# Nạp env production.
#
# KHÔNG dùng `. .env` trần. File này 273 dòng và chỉ cần MỘT dòng hỏng là
# `source` bỏ dở giữa chừng: container vẫn lên, nhưng lên với NỬA bộ biến —
# hỏng kiểu khó tìm nhất. `deploy.sh` phải tự viết bộ đọc riêng cũng vì lý do
# này (xem khối "Source production env" trong đó). Đây là bản chép lại.
[ -f "$ENV_FILE" ] || { echo "THIEU_ENV"; exit 1; }
while IFS='=' read -r key value; do
  [ -z "$key" ] && continue
  case "$key" in '#'*) continue ;; esac
  if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    value="${value%\"}" ; value="${value#\"}"
    value="${value%\'}" ; value="${value#\'}"
    export "${key}=${value}"
  fi
done < "$ENV_FILE"

docker pull "$BE:$SHA"
docker pull "$FE:$SHA"
# Đặt lại đúng TÊN mà compose mong đợi (compose dùng `build:` nên tên ảnh là
# <project>-<service>), nhờ vậy không phải sửa docker-compose.yml.
docker tag "$BE:$SHA" "$PROJ-backend:latest"
docker tag "$FE:$SHA" "$PROJ-frontend:latest"

cd "$REPO_DIR"
docker compose -p "$PROJ" up -d --no-build --remove-orphans backend frontend
EOF
then
    if grep -q KHOA_BAN /tmp/trao.log 2>/dev/null; then
        fail "Có phiên khác ĐANG TRÁO trên VPS. Chờ họ xong rồi chạy lại — đừng tráo chồng."
        exit 75
    fi
    fail "Tráo container thất bại — xem /tmp/trao.log"
    exit 1
fi
ok "Đã tráo sang ảnh ${SHA}"

# ─── 6. Prisma + sức khoẻ + smoke test ─────────────────────────────────
info "Chạy migration..."
sshvps "docker exec ${COMPOSE_PROJECT}_backend npx prisma migrate deploy 2>&1 | tail -5" || warn "migrate có lỗi — kiểm tay"

# ─── 6b. Seed nội dung (Step 3.5→3.17 của deploy.sh) ───────────────────
#
# THIẾU HẲN cho tới 24/08/2026: file này chỉ build+tráo+migrate, chưa từng
# seed nội dung. Hậu quả: content/exams/*.mjs (và ~17 loại khác — academy,
# courses, deepdives, exphub, interview, feed-series, repos, Chinese/Japanese/
# English...) nằm im trong ảnh Docker suốt từ 18/08 (lúc file này thành đường
# deploy chuẩn) tới nay dù code vẫn "deploy xong" đều đặn — log seed cũ nhất
# trên VPS (.deploy-logs/*.log) đứng yên đúng mốc 18/08 00:47-00:51. Phát
# hiện khi `/exam` thiếu cả SWR302 lẫn FER202/ITE302c dù đã seed+deploy nhiều
# đợt trước đó.
#
# Lấy khối Step 3.5→3.17 THẲNG từ deploy.sh của chính commit đang deploy —
# KHÔNG chép tay (chép tay là đúng kiểu lệch bản mà danh sách route smoke-test
# ở dưới đã né bằng cách trích động; áp dụng lại nguyên tắc đó ở đây, nên
# Step 3.18 sau này thêm vào deploy.sh sẽ TỰ ĐỘNG được deploy-nha.sh chạy
# theo, không cần sửa file này). `$DC exec -T backend sh -c "..."` cần cwd có
# docker-compose.yml nên phải cd vào REPO_DIR trên VPS trước — file đó hiếm
# khi đổi cấu trúc dù cây REPO_DIR có thể cũ hơn commit đang deploy (không
# sao: mọi lệnh seed chạy TRONG container, dùng content/scripts ảnh mới vừa
# tráo, không đụng gì tới cây REPO_DIR).
info "Chạy seed nội dung (Step 3.5→3.17 từ deploy.sh)..."
KHOI_SEED_FILE=$(mktemp)
sed -n '/^SEED_ERR_RE=/,/^report_seed "Repo Hub seed"/p' deploy.sh > "$KHOI_SEED_FILE"
if [ ! -s "$KHOI_SEED_FILE" ]; then
    warn "Không trích được khối seed từ deploy.sh — BỎ QUA (kiểm tay: ssh VPS rồi docker exec ${COMPOSE_PROJECT}_backend node scripts/academy-seed-exam.mjs --file content/exams/<file>.mjs --apply)"
else
    # ⚠️ KHÔNG `sshvps "bash -s" < file` hay `<<EOF`: một dòng bên trong gọi
    # `docker compose exec -T backend sh -c "..."` — tiến trình con đó THỪA
    # HƯỞNG cùng stdin đang là luồng script chưa đọc hết, nên nó có thể tranh
    # đọc byte với chính bash đang phân tích script, khiến bash gặp EOF sớm và
    # thoát mã 0 giữa chừng KHÔNG BÁO LỖI (đúng lỗi bắt được khi thử thật lần
    # đầu 24/08: chỉ in đúng 1 dòng info rồi dừng câm). Ghi ra FILE trên VPS
    # rồi chạy bằng đường dẫn — bash đọc script từ file, không tranh stdin với
    # tiến trình con nào cả.
    {
        cat <<'HEADER'
set -u
info() { echo "[$(date '+%H:%M:%S')] [INFO]  $*"; }
ok()   { echo "[$(date '+%H:%M:%S')] [✅ OK]  $*"; }
warn() { echo "[$(date '+%H:%M:%S')] [WARN]  $*"; }
HEADER
        echo "DC=\"docker compose -p ${COMPOSE_PROJECT}\""
        echo 'REPO_DIR="/home/deployer/repo"'
        echo 'cd "$REPO_DIR" || exit 1'
        cat "$KHOI_SEED_FILE"
    } | sshvps "cat > /tmp/deploy-nha-seed.sh"
    rm -f "$KHOI_SEED_FILE"
    sshvps "bash /tmp/deploy-nha-seed.sh; rm -f /tmp/deploy-nha-seed.sh" 2>&1 | tee /tmp/seed-nha.log
    # ⚠️ KHÔNG `|| echo 0`: `grep -c` LUÔN in ra một dòng đếm (kể cả "0") dù
    # thoát mã 1 khi không khớp dòng nào — thêm `|| echo 0` in ĐÈ THÊM một
    # dòng "0" nữa, biến kết quả thành "0\n0" và làm `[ -gt 0 ]` bên dưới lỗi
    # "integer expression expected" (vô hại nhưng lộ trong log, bắt được ở
    # lần deploy thật đầu tiên 24/08/2026).
    SO_LOI_SEED=$(grep -c '\[WARN\]' /tmp/seed-nha.log 2>/dev/null)
    if [ "${SO_LOI_SEED:-0}" -gt 0 ]; then
        warn "Seed nội dung có ${SO_LOI_SEED} bước báo lỗi — không chặn deploy, xem chi tiết ở trên hoặc /tmp/seed-nha.log trên máy chạy script này"
    else
        ok "Seed nội dung xong (không bước nào báo lỗi)"
    fi
fi

info "Chờ backend khoẻ..."
KHOE=false
for i in $(seq 1 18); do
    if sshvps "docker exec ${COMPOSE_PROJECT}_backend sh -c 'curl -sf ${HEALTH_URL} >/dev/null'" 2>/dev/null; then
        KHOE=true; ok "Backend khoẻ sau $((i*10))s"; break
    fi
    sleep 10
done
[ "$KHOE" = true ] || { fail "Backend KHÔNG khoẻ sau 3 phút — xem 'docker logs ${COMPOSE_PROJECT}_backend'"; exit 1; }

# ─── Smoke-test: 404 = route không mount = ảnh cũ/hỏng. 401/200 = ổn ────
#
# Danh sách route LẤY THẲNG TỪ `deploy.sh` chứ không chép lại. CLAUDE.md dặn
# "thêm module mới thì thêm một route vào danh sách trong deploy.sh" — chép ra
# đây một bản thứ hai là chắc chắn có ngày hai bản lệch nhau, mà bản lệch thì
# im lặng: nó vẫn báo "smoke sạch" trong khi module mới đang 404.
#
# Gọi TỪ TRONG container backend giống deploy.sh, không gọi qua cuongthai.com:
# đường công khai còn đi qua nginx/Cloudflare nên một lần chớp mạng cũng thành
# "000" và đánh hỏng cả bản deploy vốn không sao.
info "Smoke-test các route lõi..."
DS_ROUTE=$(awk '/^for route in \\$/{f=1;next} f{l=$0; e=(l ~ /;[[:space:]]*do[[:space:]]*$/); sub(/;[[:space:]]*do[[:space:]]*$/,"",l); gsub(/[[:space:]\\]/,"",l); if(l!="")print l; if(e)exit}' deploy.sh | tr '\n' ' ')
SO_ROUTE=$(echo "$DS_ROUTE" | wc -w | tr -d ' ')
if [ "${SO_ROUTE:-0}" -lt 10 ]; then
    warn "Không đọc được danh sách route từ deploy.sh (chỉ thấy ${SO_ROUTE}) — dùng danh sách rút gọn."
    DS_ROUTE="gifs profile social/posts feed/posts notes notes-databases music/tracks courses cv/profile maker-lab/projects doc-tools/presets"
    SO_ROUTE=$(echo "$DS_ROUTE" | wc -w | tr -d ' ')
fi
info "  ${SO_ROUTE} route"
KET_QUA=$(sshvps "PROJ='${COMPOSE_PROJECT}' DS='${DS_ROUTE}' bash -s" <<'EOF'
hong=0
for r in $DS; do
  ma=$(docker exec "${PROJ}_backend" sh -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/v1/${r}" 2>/dev/null)
  if [ "$ma" = "404" ] || [ -z "$ma" ]; then echo "HONG $r -> ${ma:-khong-tra-loi}"; hong=$((hong+1)); fi
done
echo "TONG_HONG=$hong"
EOF
)
echo "$KET_QUA" | grep '^HONG' | sed 's/^/         /' || true
if echo "$KET_QUA" | grep -q 'TONG_HONG=0'; then
    ok "Smoke-test sạch (${SO_ROUTE} route)"
else
    fail "Có route 404 — ảnh có thể cũ/thiếu. Xem danh sách ngay trên."
    exit 1
fi

# ─── 7. Dọn ─────────────────────────────────────────────────────────────
# VPS giờ KHÔNG build nữa nên không có cache build; chỉ còn ảnh cũ cần dọn.
info "Dọn ảnh cũ trên VPS..."
sshvps "docker image prune -f >/dev/null 2>&1; df -h / | tail -1" | sed 's/^/         /'
info "Dọn thư mục build cũ ở máy nhà (giữ 3 bản gần nhất)..."
sshnha "cd ${THU_MUC_NHA} 2>/dev/null && ls -1t | tail -n +4 | xargs -r rm -rf" 2>/dev/null || true

# ─── 8. Hỏi duyệt trên điện thoại rồi mới push lên GitHub ──────────────
#
# Quy trình chuẩn (CLAUDE.md): deploy TRƯỚC, người dùng thử production, XONG
# rồi mới push — lúc đó push chỉ là đồng bộ GitHub với thứ prod đã chạy. Bước
# này giữ nguyên thứ tự đó, chỉ bỏ đi khoảng chờ: thay vì phải nhớ quay lại
# gõ `git push`, bot Telegram của máy nhà hỏi ngay trên điện thoại, bấm một nút.
#
# ⚠️ KHÔNG tự push. Đẩy lên `main` là hành động phải có người đồng ý, và cái
# nút CHÍNH LÀ chỗ đồng ý đó. Không ai bấm ⇒ không push, và deploy vẫn tính là
# thành công (production đã chạy rồi, push chỉ là việc còn lại).
if [ "$KHONG_HOI" != true ]; then
    git fetch --quiet origin "$NHANH" 2>/dev/null || true
    CHUA_DAY=$(git rev-list --count "origin/${NHANH}..HEAD" 2>/dev/null || echo 0)
    if [ "$CHUA_DAY" = "0" ]; then
        info "GitHub đã có commit này rồi — không cần push."
    elif ! sshnha "test -x \$HOME/bin/hoi-duyet.sh" 2>/dev/null; then
        warn "Máy nhà không trả lời (hoặc chưa có hoi-duyet.sh) — bỏ qua hỏi duyệt."
        warn "Muốn push thì chạy tay: git push origin ${NHANH}"
    else
        info "Hỏi duyệt push qua Telegram (chờ tối đa 15 phút)..."
        CAU="✅ Deploy XONG — production đang chạy ${SHA} (nhánh ${NHANH}).
Smoke-test ${SO_ROUTE} route sạch.
Còn ${CHUA_DAY} commit chưa lên GitHub. Push bây giờ?"
        # 0 = đồng ý · 1 = từ chối · 2 = hết giờ. Chỉ 0 mới push.
        sshnha "bash \$HOME/bin/hoi-duyet.sh $(printf %q "$CAU") 900"
        TRA_LOI=$?
        case "$TRA_LOI" in
            0)  info "Đã duyệt — đang push lên GitHub..."
                # KHÔNG --force, không bao giờ. Bị từ chối thì để nguyên cho
                # người xem, đừng tự ép.
                if git push origin "HEAD:${NHANH}"; then
                    ok "Đã push ${SHA} lên origin/${NHANH}"
                else
                    fail "Push hỏng — production vẫn đang chạy bình thường, chỉ GitHub là chưa đồng bộ."
                fi ;;
            1)  info "Đã từ chối — KHÔNG push. Production vẫn chạy ${SHA}." ;;
            *)  warn "Hết giờ, không ai trả lời — KHÔNG push." ;;
        esac
    fi
fi

echo ""
ok "XONG — production đang chạy commit ${SHA}"
echo ""
