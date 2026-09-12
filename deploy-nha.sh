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
REPO_VPS="/home/deployer/repo"            # nơi docker-compose.yml + nginx.conf nằm
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
        # Bỏ hẳn bước tự push ở cuối (bước 8) — chỉ deploy, không đụng GitHub.
        # Giữ tên cũ `--khong-hoi` để mọi chỗ đang gọi không phải sửa.
        --khong-hoi) KHONG_HOI=true ;;
    esac
done

info() { echo "[$(date '+%H:%M:%S')] [INFO]  $*"; }
ok()   { echo "[$(date '+%H:%M:%S')] [✅ OK]  $*"; }
warn() { echo "[$(date '+%H:%M:%S')] [WARN]  $*"; }
fail() { echo "[$(date '+%H:%M:%S')] [❌ FAIL] $*"; }

# ─── SSH KHÔNG ĐƯỢC TREO VÔ HẠN ──────────────────────────────────────
#
# 07/09/2026: hai lượt deploy của hai phiên khác nhau treo 2 GIỜ, mỗi lượt
# kẹt ở một `ssh` trong khi VPS rảnh hoàn toàn — không docker, không prisma,
# mọi container healthy. Chúng giữ luôn `/var/lock/cuongthai-deploy.lock`,
# nên mọi lượt deploy sau xếp hàng sau chúng và cũng treo theo. Phải giết tay
# 8 tiến trình mới thông.
#
# `ConnectTimeout` KHÔNG cứu được: nó chỉ chặn giai đoạn BẮT TAY. Phiên đã
# nối rồi mà đứng im thì nó không nói gì. Hai lớp chặn:
#
#  1. `ServerAliveInterval`/`CountMax` — ssh tự bỏ cuộc sau ~60s nếu đầu kia
#     không đáp. Bắt được link chết.
#  2. `chay_canh_gio` — trần thời gian THẬT cho cả lời gọi. Bắt được ca xấu
#     hơn: phiên vẫn sống, lệnh từ xa đã xong, mà ssh không chịu trả về.
#     ServerAlive mù với ca này vì kết nối vẫn khoẻ.
#
# macOS không có `timeout`/`gtimeout` nên chó gác phải tự viết.
SSH_SONG=(-o ServerAliveInterval=15 -o ServerAliveCountMax=4)

# Trần cho MỘT lời gọi ssh. Bước lâu nhất đo được là dựng ảnh ở nhà (~15 phút)
# và kéo ảnh về VPS; 2400s (40 phút) rộng rãi mà vẫn hữu hạn. Đặt
# `SSH_TRAN=0` để tắt hẳn chó gác khi cần soi tay.
SSH_TRAN=${SSH_TRAN:-2400}

chay_canh_gio() {
    if [ "$SSH_TRAN" -le 0 ]; then "$@"; return $?; fi
    # `<&0` là BẮT BUỘC: bash chuyển stdin của job nền sang /dev/null, nên
    # `sshvps "bash -s" <<EOF` sẽ gửi lên stdin RỖNG — bước tráo ảnh chạy một
    # script trống, báo thành công, và KHÔNG có gì đổi trên VPS. Đã bắt được
    # lỗi này bằng phép kiểm riêng trước khi cắm vào đây.
    "$@" <&0 &
    local pid=$!
    (
        local n=0
        while kill -0 "$pid" 2>/dev/null; do
            n=$((n + 1))
            if [ "$n" -ge "$SSH_TRAN" ]; then
                echo "[chó gác] ssh treo quá ${SSH_TRAN}s — giết pid $pid" >&2
                kill -9 "$pid" 2>/dev/null
                exit 0
            fi
            sleep 1
        done
    ) &
    local cho=$!
    wait "$pid"; local ma=$?
    kill "$cho" 2>/dev/null; wait "$cho" 2>/dev/null
    return $ma
}

sshnha() { chay_canh_gio ssh -o ConnectTimeout=15 "${SSH_SONG[@]}" -o BatchMode=yes "$MAY_NHA" "$@"; }
sshvps() { chay_canh_gio ssh -i "$VPS_SSH_KEY" -o ConnectTimeout=15 "${SSH_SONG[@]}" -o StrictHostKeyChecking=accept-new "${VPS_USER}@${VPS_IP}" "$@"; }

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

# ─── 0b. Đề thi: CHỐT TIỀN-DEPLOY ──────────────────────────────────────
# `deploy.sh` có chốt này từ lâu (nó chạy exam-check TRƯỚC rsync và chặn deploy
# nếu đề hỏng); `deploy-nha.sh` thì CHƯA TỪNG CÓ — phát hiện 10/09/2026 khi đẩy
# 48 đề PT mới. Đây là lỗi DỮ LIỆU mà `tsc` và `next build` không bao giờ thấy:
# một đề mà chính đáp án mẫu chạy không khớp expectedOutput thì học viên không
# bao giờ đúng được, và AI cũng chấm sai theo.
# ⚠️ Chạy TRẦN thì exam-check chỉ quét NODEJS-*/NEXTJS-*/WF-* (20 trên 1183
# file), nên phải liệt kê tường minh các khoá Courses.
if [ -f scripts/exam-check.mjs ] && command -v node &>/dev/null; then
    info "Kiểm đề thi (đáp án mẫu phải chạy đúng)..."
    DE_LOI=0
    for de in content/exams/{AUTHENTICATION,DOCKER,GIT,LINUX-BASH,NEXTJS,NGINX,NODEJS,POSTGRESQL,PRISMA-ORM,REDIS,SOCKET-IO,TAILWIND-CSS,TYPESCRIPT,WF,GITHUB-ACTIONS,OBJECT-STORAGE,DEPLOY-VPS,MEDIA-PROCESSING,OBSERVABILITY-MONITORING}-*.mjs; do
        [ -e "$de" ] || continue
        if ! node scripts/exam-check.mjs "$de" >/tmp/exam-check-nha.log 2>&1; then
            warn "  đề hỏng: $de"; tail -6 /tmp/exam-check-nha.log | sed 's/^/         /'
            DE_LOI=$((DE_LOI+1))
        fi
    done
    if [ "$DE_LOI" != "0" ]; then
        fail "exam-check thất bại ở ${DE_LOI} đề — sửa xong hãy deploy"
        exit 1
    fi
    ok "Đề thi OK"
fi

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
# Bước DÀI NHẤT của cả script (~6 phút khi khoẻ) và là lời gọi ssh thô duy
# nhất còn lại — nên nó phải nằm dưới chó gác như hai helper kia. 07/09/2026
# nó chạy 42 PHÚT rồi chết vì đứt hầm (`Can't assign requested address`); bản
# vá đầu của tôi chỉ bọc `sshnha`/`sshvps` nên bỏ sót đúng chỗ đau nhất.
if ! chay_canh_gio ssh -o ConnectTimeout=15 "${SSH_SONG[@]}" -o BatchMode=yes "$MAY_NHA" bash -s <<EOF
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
docker build -f frontend/Dockerfile --build-arg BUILD_NUMBER=${SHA} -t ${GHCR_FE}:${SHA} -t ${GHCR_FE}:latest ./frontend > /tmp/nha-fe.log 2>&1 &
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
TRAO_ENV="SHA='${SHA}' BE='${GHCR_BE}' FE='${GHCR_FE}' PROJ='${COMPOSE_PROJECT}' KHOA='${KHOA}' ENV_FILE='/opt/cuonghoangdev/.env' REPO_DIR='${REPO_VPS}'"
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

# ─── 5b. NẠP LẠI NGINX NGAY — không đợi bước 6c ────────────────────────
#
# ⚠️ 11/09/2026 — toàn site 502, và không phải lỗi mã.
#
# nginx phân giải `upstream backend { server backend:3001; }` ĐÚNG MỘT LẦN,
# lúc nạp cấu hình. Không có `resolver` nên nó giữ nguyên cái IP ấy mãi mãi.
# `docker compose up -d` ở trên XOÁ rồi TẠO LẠI cả hai container, và Docker
# cấp IP theo thứ tự còn trống — nên hai container có thể TRÁO IP CHO NHAU.
#
# Đo thật lượt deploy d8656db2:
#     nginx nhớ:  backend=172.18.0.2   frontend=172.18.0.5
#     thực tế:    backend=172.18.0.5   frontend=172.18.0.2
# ⇒ mọi lệnh API bay vào container FRONTEND cổng 3001 (từ chối), mọi lệnh web
# bay vào container BACKEND cổng 3000 (từ chối). `cuongthai.com` VÀ
# `api.cuongthai.com` cùng 502.
#
# Bước 6c đã nạp lại nginx sẵn rồi — nhưng nó chạy SAU toàn bộ phần seed nội
# dung, đo thật lượt này là **15 phút** sau khi tráo (05:18:34 → 05:33:37).
# Mười lăm phút chết cả web, mỗi lần hai container tình cờ tráo IP.
#
# Nên nạp lại NGAY. Rẻ (một tín hiệu, không dừng tiến trình), an toàn (config
# sai thì nginx giữ bản cũ trong RAM), và nó phân giải lại tên upstream.
# Bước 6c vẫn giữ nguyên: việc của nó là ĐỔI config, việc của bước này là đuổi
# kịp IP.
info "Nạp lại nginx ngay (tráo container có thể đã đổi IP upstream)..."
if sshvps "docker exec ${COMPOSE_PROJECT}_nginx nginx -s reload" >/dev/null 2>&1; then
    ok "nginx đã nạp lại — upstream phân giải lại theo IP mới"
else
    warn "KHÔNG nạp lại được nginx. Nếu container vừa đổi IP thì site đang 502."
    warn "Chạy tay: ssh ${VPS_USER}@${VPS_IP} \"docker exec ${COMPOSE_PROJECT}_nginx nginx -s reload\""
fi

# ─── 5c. KIỂM TỪ NGOÀI — đúng đường người dùng đi ──────────────────────
#
# ⚠️ Smoke-test ở bước 6 chạy `docker exec backend curl localhost:3001/...`,
# tức là TỪ BÊN TRONG container. Nó không đi qua nginx, nên nó KHÔNG THỂ thấy
# lỗi vừa tả: 11/09/2026 nó báo "sạch (52 route)" trong lúc cả hai tên miền
# đang trả 502 cho người thật.
#
# Phép kiểm này đi đúng đường người dùng đi — DNS → nginx → container. Nó là
# thứ duy nhất ở đây chứng minh được "web sống", chứ không phải "tiến trình
# node còn chạy".
info "Kiểm từ NGOÀI (qua nginx, đúng đường người dùng đi)..."
NGOAI_OK=false
for _ in $(seq 1 20); do
    MA_API=$(curl -s -o /dev/null -m 10 -w '%{http_code}' "https://api.cuongthai.com/api/v1/system/health?kiem=${SHA}" 2>/dev/null)
    MA_WEB=$(curl -s -o /dev/null -m 10 -w '%{http_code}' "https://cuongthai.com/?kiem=${SHA}" 2>/dev/null)
    if [ "$MA_API" = "200" ] && [ "$MA_WEB" = "200" ]; then NGOAI_OK=true; break; fi
    sleep 3
done
if [ "$NGOAI_OK" = true ]; then
    ok "Từ ngoài: api=${MA_API} web=${MA_WEB} — người dùng vào được"
else
    fail "TỪ NGOÀI KHÔNG VÀO ĐƯỢC sau 60s: api=${MA_API} web=${MA_WEB}"
    fail "Container có thể khoẻ mà nginx vẫn trỏ IP cũ. Thử:"
    fail "    ssh ${VPS_USER}@${VPS_IP} \"docker exec ${COMPOSE_PROJECT}_nginx nginx -s reload\""
    fail "Rồi đo lại: curl -s -o /dev/null -w '%{http_code}' https://api.cuongthai.com/api/v1/system/health"
    sshnha "test -x \$HOME/bin/bao-tin.sh && bash \$HOME/bin/bao-tin.sh $(printf %q "⛔ Deploy ${SHA}: container khoẻ nhưng TỪ NGOÀI 502 — nginx trỏ IP cũ?")" 2>/dev/null || true
    exit 1
fi

# ─── 6. Prisma + sức khoẻ + smoke test ─────────────────────────────────
info "Chạy migration..."
# ⚠️ KHÔNG `| tail -5`. Prisma in vài dòng npm notice ("New major version of
# npm available…") SAU phần kết quả, nên tail -5 cắt đúng thứ cần đọc: đo thật
# 07/09/2026, một lượt deploy có migration MỚI mà log chỉ còn lại toàn npm
# notice — không có cách nào biết migration đã áp hay đã chết. Với migration
# thì im lặng là trạng thái tệ nhất: CLAUDE.md cấm tự sửa migration hỏng, mà
# muốn không tự sửa thì trước hết phải THẤY nó hỏng.
#
# Lọc bỏ tiếng ồn của npm rồi in phần còn lại; thêm chốt bắt mã lỗi Prisma.
KQ_MIGRATE=$(sshvps "docker exec ${COMPOSE_PROJECT}_backend npx prisma migrate deploy 2>&1" || true)
printf '%s\n' "$KQ_MIGRATE" | grep -vE '^npm notice|^\s*$|^ *[│└┌─]' | tail -20
if printf '%s' "$KQ_MIGRATE" | grep -qE 'P30[0-9][0-9]|Error:|migration failed|failed to apply'; then
    warn "MIGRATION CÓ LỖI — xem Migration Failure Protocol trong CLAUDE.md, ĐỪNG tự resolve"
elif printf '%s' "$KQ_MIGRATE" | grep -qE 'Applied [0-9]+ migration|No pending migrations|already in sync'; then
    ok "Migration xong"
else
    warn "Không đọc được kết quả migration — kiểm tay"
fi

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

# ─── 6c. nginx: đồng bộ config rồi nạp lại ─────────────────────────────
#
# VÌ SAO CÓ BƯỚC NÀY (23/08/2026): trước đó file này KHÔNG hề đụng tới nginx.
# Cả script nhắc chữ "nginx" đúng MỘT lần, trong một dòng chú thích, còn bước
# tráo chỉ có `docker compose up -d --no-build backend frontend`.
#
# Mà `nginx/nginx.conf` là bind-mount từ `${REPO_VPS}/nginx/nginx.conf` trên
# VPS, và từ khi bỏ `deploy.sh` thì KHÔNG còn gì cập nhật thư mục đó nữa
# (deploy.sh rsync cây làm việc; file này chỉ đẩy ảnh). Hệ quả: mọi thay đổi
# nginx — HTTP/2, header cache, location mới — đều "deploy thành công" mà
# không bao giờ có hiệu lực. Im lặng tuyệt đối: log xanh, smoke-test sạch,
# và cái config mới nằm im trên máy bạn.
#
# ⚠️⚠️ KHÔI PHỤC KHI `nginx -t` HỎNG LÀ PHẦN QUAN TRỌNG NHẤT Ở ĐÂY.
# `nginx -s reload` với config sai thì AN TOÀN — nginx giữ nguyên config cũ
# trong bộ nhớ và chạy tiếp. Nhưng để cái FILE sai nằm lại trên đĩa thì nó
# thành bom hẹn giờ: container khai `restart: unless-stopped`, nên lần VPS
# khởi động lại kế tiếp (hoặc một `docker restart` bất kỳ) nginx sẽ không lên
# nổi và CẢ WEB chết — vào đúng lúc không ai đang deploy để mà nghi ngờ.
# Nên hỏng là trả bản cũ về NGAY, không để lại dấu vết.
#
# Nội dung lấy bằng `git show HEAD:` chứ không đọc cây làm việc — đúng nguyên
# tắc của cả file này: CHỈ thứ đã commit mới lên production.
info "Kiểm nginx.conf trên VPS..."
NGINX_TMP=$(mktemp)
if ! git show "HEAD:nginx/nginx.conf" > "$NGINX_TMP" 2>/dev/null; then
    rm -f "$NGINX_TMP"
    warn "Không đọc được nginx/nginx.conf ở commit ${SHA} — bỏ qua bước nginx."
    warn "(Ảnh backend/frontend ĐÃ tráo xong và smoke-test sạch.)"
else
    BAM_NHA=$(sha256sum "$NGINX_TMP" | cut -d' ' -f1)
    BAM_VPS=$(sshvps "sha256sum '${REPO_VPS}/nginx/nginx.conf' 2>/dev/null | cut -d' ' -f1" 2>/dev/null | tr -d '\r\n')

    if [ -n "$BAM_VPS" ] && [ "$BAM_NHA" = "$BAM_VPS" ]; then
        rm -f "$NGINX_TMP"
        # File trên đĩa GIỐNG bản commit — nhưng "file đúng" KHÔNG bảo đảm nginx
        # đang CHẠY nó. Nếu một lần reload trước từng trượt (hoặc container gắn
        # nhầm inode), mọi deploy sau đều thấy hash khớp và BỎ QUA reload → config
        # đúng nằm im trên đĩa còn nginx phục vụ bản cũ trong RAM hàng giờ. Đúng ca
        # HTTP/2 tắt 27/08/2026: `http2 on;` có trong file mà origin vẫn HTTP/1.1,
        # deploy nào cũng báo "không đổi — không nạp lại". Vá: vẫn xác minh inode
        # container + `nginx -t` + reload IDEMPOTENT để RAM luôn khớp đĩa. Không hề
        # sửa file ở nhánh này; reload thừa vô hại, im lặng sai mới nguy.
        info "nginx.conf không đổi — vẫn nạp lại nhẹ để chắc RAM khớp đĩa..."
        NGINX_ENV_RL="PROJ='${COMPOSE_PROJECT}' REPO='${REPO_VPS}'"
        sshvps "${NGINX_ENV_RL} bash -s" <<'EOF' 2>&1 | sed 's/^/         /'
CONF="$REPO/nginx/nginx.conf"
docker ps --format '{{.Names}}' | grep -qx "${PROJ}_nginx" || { echo "nginx không chạy — bỏ qua."; exit 0; }
BAM_NGOAI=$(sha256sum "$CONF" | cut -d' ' -f1)
BAM_TRONG=$(docker exec "${PROJ}_nginx" sha256sum /etc/nginx/nginx.conf 2>/dev/null | cut -d' ' -f1)
if [ "$BAM_NGOAI" != "$BAM_TRONG" ]; then
  echo "⚠ container đọc bản KHÁC file trên đĩa (lệch inode). Sửa:"
  echo "   ssh VPS → docker compose -p ${PROJ} up -d --force-recreate nginx"
  exit 0
fi
if docker exec "${PROJ}_nginx" nginx -t >/dev/null 2>&1; then
  docker exec "${PROJ}_nginx" nginx -s reload >/dev/null 2>&1 \
    && echo "reload OK — RAM đã khớp đĩa (config không đổi)" \
    || echo "⚠ reload trượt — nginx giữ config cũ đang chạy, web không gián đoạn"
else
  echo "⚠ nginx -t hỏng trên file HIỆN TẠI — KHÔNG reload, giữ nguyên bản đang chạy"
fi
EOF
    else
        [ -z "$BAM_VPS" ] && warn "Không đọc được nginx.conf hiện tại trên VPS — vẫn đẩy bản mới."
        info "nginx.conf CÓ thay đổi — đang đồng bộ..."

        # Gửi vào tên TẠM trước. Không ghi đè thẳng: nếu đường truyền đứt giữa
        # chừng thì `nginx.conf` thật đã cụt, và đó chính là kịch bản bom hẹn
        # giờ ở trên — chỉ khác là ta tự gây ra.
        if ! sshvps "cat > '${REPO_VPS}/nginx/nginx.conf.moi'" < "$NGINX_TMP"; then
            rm -f "$NGINX_TMP"
            fail "Không gửi được nginx.conf sang VPS."
            fail "Ảnh ĐÃ tráo xong và web đang chạy — chỉ config nginx là chưa đổi."
            exit 1
        fi
        rm -f "$NGINX_TMP"

        NGINX_ENV="PROJ='${COMPOSE_PROJECT}' REPO='${REPO_VPS}' SHA='${SHA}'"
        sshvps "${NGINX_ENV} bash -s" <<'EOF' 2>&1 | tee /tmp/nginx-nap.log | sed 's/^/         /'
CONF="$REPO/nginx/nginx.conf"
MOI="$CONF.moi"
SAO="$CONF.sao.$SHA"

[ -f "$MOI" ] || { echo "KQ=THIEU_FILE"; exit 1; }
if ! docker ps --format '{{.Names}}' | grep -qx "${PROJ}_nginx"; then
  rm -f "$MOI"; echo "KQ=NGINX_KHONG_CHAY"; exit 1
fi

cp -p "$CONF" "$SAO" 2>/dev/null || touch "$SAO"

# ⚠️⚠️ GHI ĐÈ TẠI CHỖ, TUYỆT ĐỐI KHÔNG `mv`.
#
# `nginx.conf` là bind-mount một FILE ĐƠN. Docker gắn nó theo INODE lúc
# container khởi động, không theo đường dẫn. `mv` là đổi tên: nó trỏ đường dẫn
# trên host sang một inode MỚI, còn container thì vẫn dính vào inode CŨ.
#
# Hậu quả đo thật 25/08/2026, và nó câm hoàn toàn:
#     file trên host đổi          ✓
#     container vẫn thấy bản cũ   ✗
#     `nginx -t` xanh   — vì đang kiểm CONFIG CŨ, vốn hợp lệ
#     `reload` thành công — nạp lại CONFIG CŨ
#     script báo KQ=OK  — trong khi không có gì thay đổi
# Deploy báo xanh hai lần liền mà HTTP/2 vẫn tắt và header cache vẫn no-store.
#
# `cat > "$CONF"` thì cắt cụt rồi ghi lại ĐÚNG inode đó, nên container thấy
# ngay. Cùng lý do khiến `sed -i` và `:w` của vim (mặc định ghi file tạm rồi
# đổi tên) cũng KHÔNG dùng được ở đây.
cat "$MOI" > "$CONF" || { rm -f "$MOI"; echo "KQ=GHI_HONG"; exit 1; }
rm -f "$MOI"

# Chốt kiểm inode: container có THẬT SỰ thấy bản mới không?
#
# Đây là phép kiểm mà nếu có từ đầu thì đã bắt được lỗi `mv` ngay lần chạy đầu,
# thay vì để nó báo OK hai lần. Đừng bỏ: nó rẻ, và nó canh đúng cái khoảng cách
# giữa "file trên host" và "file container đang đọc" — chỗ duy nhất mà mọi thứ
# khác trong khối này đều mặc định là bằng nhau.
BAM_NGOAI=$(sha256sum "$CONF" | cut -d' ' -f1)
BAM_TRONG=$(docker exec "${PROJ}_nginx" sha256sum /etc/nginx/nginx.conf 2>/dev/null | cut -d' ' -f1)
if [ -z "$BAM_TRONG" ] || [ "$BAM_NGOAI" != "$BAM_TRONG" ]; then
  cat "$SAO" > "$CONF"; rm -f "$SAO"
  echo "KQ=MOUNT_LECH"; exit 1
fi

# `nginx -t` đọc /etc/nginx/nginx.conf trong container — và chốt kiểm ngay trên
# vừa chứng minh đó đúng là bản mới.
if docker exec "${PROJ}_nginx" nginx -t 2>&1; then
  if docker exec "${PROJ}_nginx" nginx -s reload 2>&1; then
    # Giữ 3 bản sao gần nhất, dọn phần còn lại (cùng lối với bước 7).
    ls -1t "$CONF".sao.* 2>/dev/null | tail -n +4 | xargs -r rm -f
    echo "KQ=OK"
  else
    cat "$SAO" > "$CONF"; rm -f "$SAO"
    docker exec "${PROJ}_nginx" nginx -s reload >/dev/null 2>&1 || true
    echo "KQ=NAP_HONG"; exit 1
  fi
else
  # ⚠️ Trả bản cũ về TRƯỚC khi thoát. Xem chú thích bom hẹn giờ ở phía Mac.
  cat "$SAO" > "$CONF"; rm -f "$SAO"
  echo "KQ=TEST_HONG"; exit 1
fi
EOF

        case "$(grep -o 'KQ=[A-Z_]*' /tmp/nginx-nap.log | tail -1)" in
            KQ=OK)
                ok "nginx đã nạp config mới (bản cũ giữ ở nginx.conf.sao.*)" ;;
            KQ=TEST_HONG)
                fail "nginx.conf SAI cú pháp — ĐÃ TRẢ LẠI bản cũ trên VPS."
                fail "nginx vẫn đang chạy config cũ, web KHÔNG gián đoạn."
                fail "Ảnh backend/frontend thì đã tráo xong và smoke-test sạch."
                fail "Sửa nginx/nginx.conf, commit, rồi chạy lại deploy."
                exit 1 ;;
            KQ=NAP_HONG)
                fail "nginx -t xanh nhưng reload hỏng — ĐÃ TRẢ LẠI bản cũ."
                fail "Kiểm: docker logs ${COMPOSE_PROJECT}_nginx"
                exit 1 ;;
            KQ=MOUNT_LECH)
                fail "Container nginx KHÔNG thấy file vừa ghi — bind-mount đã lệch inode."
                fail "ĐÃ TRẢ LẠI bản cũ; web không gián đoạn."
                fail "Thường là do container được tạo trước khi file bị thay bằng mv/rsync."
                fail "Sửa: ssh VPS rồi 'docker compose -p ${COMPOSE_PROJECT} up -d --force-recreate nginx'"
                exit 1 ;;
            KQ=GHI_HONG)
                fail "Không ghi được nginx.conf trên VPS (đĩa đầy? quyền?) — chưa đổi gì cả."
                exit 1 ;;
            KQ=NGINX_KHONG_CHAY)
                fail "Container ${COMPOSE_PROJECT}_nginx không chạy — chưa đổi gì cả."
                fail "Kiểm: docker ps -a | grep nginx"
                exit 1 ;;
            *)
                fail "Bước nginx thất bại không rõ lý do — xem /tmp/nginx-nap.log"
                fail "Kiểm bằng tay xem ${REPO_VPS}/nginx/nginx.conf còn nguyên vẹn không."
                exit 1 ;;
        esac
    fi
fi

# ─── 7. Dọn ─────────────────────────────────────────────────────────────
# VPS giờ KHÔNG build nữa nên không có cache build; chỉ còn ảnh cũ cần dọn.
# ⚠️ 13/09/2026 — Ảnh của các lần deploy trước đều CÓ TAG (ghcr:<SHA cũ>) nên
# `prune -f` (chỉ dangling) KHÔNG dọn nổi → dồn ~20GB, lấp ổ chứa Postgres →
# Postgres chết → API 502 toàn bộ (đã xảy ra thật).
#
# ⚠️⚠️ ĐỪNG dùng `prune -af` mù ở đây! Nó xoá luôn tag `ghcr:${SHA}` HIỆN TẠI,
# mà (1) bước "Kiểm lại container" ngay dưới ĐỌC đúng tag đó (dòng ~938) → verify
# false-FAIL "KHONG_DOC_DUOC" mọi deploy, và (2) lệnh rollback tay in ở dưới cũng
# retag từ `ghcr:${SHA}` → mất tag là mất đường rollback nhanh. (Đã dính 13/09.)
#
# Cách đúng: chỉ xoá các `ghcr:<SHA CŨ>` — GIỮ SHA hiện tại + latest. Reclaim đủ
# đĩa (mỗi commit khác lớp app), không đụng ảnh verify/rollback cần.
info "Dọn ảnh deploy CŨ trên VPS (giữ ${SHA} + latest)..."
sshvps "
  docker images 'ghcr.io/cuonghoang1103/api-backend-*' --format '{{.Repository}}:{{.Tag}}' \
    | grep -v '<none>' | grep -vE ':(${SHA}|latest)\$' \
    | xargs -r docker rmi >/dev/null 2>&1
  docker image prune -f >/dev/null 2>&1
  df -h / | tail -1" | sed 's/^/         /'
info "Dọn thư mục build cũ ở máy nhà (giữ 3 bản gần nhất)..."
sshnha "cd ${THU_MUC_NHA} 2>/dev/null && ls -1t | tail -n +4 | xargs -r rm -rf" 2>/dev/null || true

# ─── 8. Tự đẩy lên GitHub khi các phép kiểm BẮT BUỘC của CI đều xanh ───
#
# Quy trình chuẩn (CLAUDE.md): deploy TRƯỚC, XONG rồi mới push — lúc đó push
# chỉ là đồng bộ GitHub với thứ production đã chạy.
#
# ⚠️ TRƯỚC 06/09/2026 bước này HỎI DUYỆT qua Telegram, và nó hỏng theo kiểu
# câm nhất: **cả bốn lượt deploy trong một ngày đều hết 15 phút không ai trả
# lời**, mỗi lần ghi "KHÔNG push" rồi kết thúc THÀNH CÔNG. Không log nào đỏ,
# không cảnh báo nào. Commit dồn lại tới **288 commit / gần một ngày công chỉ
# tồn tại trên một cái máy**. Production an toàn (nó chạy ảnh Docker), nhưng
# GitHub là bản sao lưu DUY NHẤT của mã nguồn — và nó thiếu gần một ngày.
#
# Nay đổi chỗ "người đồng ý" thành "mã đã được kiểm": chạy CHÍNH những phép
# kiểm mà `ci-lint.yml` đánh dấu (required) ngay tại đây, xanh hết thì push.
#
# ⚠️ Không thể "đợi CI xanh rồi mới push" — CI chỉ chạy SAU khi push. Nên phải
# chạy lại đúng bộ kiểm đó ở máy. Ba phép dưới đây tốn ~3 giây (đo thật), hai
# phép `tsc` tốn thêm chút; so với 15 phút deploy thì không đáng kể.
#
# ⚠️ Và KHÔNG dựa vào "ảnh Docker dựng xong nghĩa là CI sẽ xanh": ảnh chỉ chạy
# `tsc`/`next build`, KHÔNG chạy `npm test` lẫn hai bộ eval golden-set. Bốn thứ
# CI chặn mà Docker không chặn.
if [ "$KHONG_HOI" != true ]; then
    git fetch --quiet origin "$NHANH" 2>/dev/null || true
    CHUA_DAY=$(git rev-list --count "origin/${NHANH}..HEAD" 2>/dev/null || echo 0)
    if [ "$CHUA_DAY" = "0" ]; then
        info "GitHub đã có commit này rồi — không cần push."
    else
        info "Chạy bộ kiểm BẮT BUỘC của CI trước khi push (${CHUA_DAY} commit)..."
        KIEM_HONG=""
        # Đúng thứ tự và đúng lệnh của `.github/workflows/ci-lint.yml`, chỉ lấy
        # những bước đánh dấu (required) — bỏ ESLint vì CI ghi rõ là
        # (informational) và nó đang có cảnh báo tồn từ trước.
        chay_kiem() {
            local ten="$1"; shift
            if "$@" >/tmp/deploy-kiem.log 2>&1; then
                ok "  ✓ ${ten}"
            else
                warn "  ✗ ${ten} — HỎNG"
                tail -12 /tmp/deploy-kiem.log | sed 's/^/      /'
                KIEM_HONG="${KIEM_HONG} ${ten}"
            fi
        }
        chay_kiem "backend tsc"        npx tsc --noEmit
        chay_kiem "eval:grader"        npm run eval:grader
        chay_kiem "eval:cv-linter"     npm run eval:cv-linter
        chay_kiem "npm test"           npm test
        chay_kiem "frontend tsc"       bash -c 'cd frontend && npx tsc --noEmit --skipLibCheck'

        if [ -n "$KIEM_HONG" ]; then
            # ⚠️ KHÔNG push khi có phép kiểm hỏng. Production vẫn chạy bình
            # thường (ảnh đã tráo xong từ bước trước) — chỉ GitHub là chưa
            # đồng bộ, và đó là điều ĐÚNG: đẩy một commit làm đỏ CI lên nhánh
            # chung thì người sau phải dọn.
            warn "Có phép kiểm hỏng:${KIEM_HONG} — KHÔNG push."
            warn "Production vẫn chạy ${SHA} bình thường. Sửa xong thì: git push origin ${NHANH}"
            # ⚠️ BÁO ra ngoài. Đây chính là ca dễ trôi qua im lặng: deploy vẫn
            # kết thúc THÀNH CÔNG, log không đỏ, và commit lại bắt đầu dồn —
            # đúng cách bước hỏi-duyệt cũ đã âm thầm gom tới 288 commit.
            sshnha "test -x \$HOME/bin/bao-tin.sh && bash \$HOME/bin/bao-tin.sh $(printf %q "⚠️ Deploy xong (prod chạy ${SHA}) nhưng KHÔNG push: bộ kiểm CI hỏng —${KIEM_HONG}. Còn ${CHUA_DAY} commit chưa lên GitHub.")" 2>/dev/null || true
        else
            ok "Bộ kiểm của CI xanh hết — đang push lên GitHub..."
            # KHÔNG --force, không bao giờ.
            if git push origin "HEAD:${NHANH}"; then
                ok "Đã push ${SHA} lên origin/${NHANH} (${CHUA_DAY} commit)"
            else
                fail "Push hỏng — production vẫn đang chạy bình thường, chỉ GitHub là chưa đồng bộ."
            fi
        fi
    fi
fi

# ─── 8. CHỐT CUỐI: production có THẬT SỰ chạy ảnh vừa tráo không ────────
#
# ⚠️ 11/09/2026 — dòng "XONG — production đang chạy ${SHA}" từng là một LỜI
# KHẲNG ĐỊNH, không phải phép đo, và nó nói dối một lần rất tốn:
#
#   21:00  deploy-nha.sh tráo xong ảnh 4bf5b5c0 (có route /ai/usage) — xanh
#   21:02  một phiên Claude KHÁC bấm tay "Deploy via GHCR (fast path)".
#          Workflow đó dựng từ `main` TRÊN GITHUB, lúc ấy còn là dccad0e6,
#          và dccad0e6 KHÔNG chứa mã vừa tráo (nó rẽ từ main cũ hơn).
#   21:08  deploy-nha.sh mới push 4505f533 lên GitHub — muộn 6 phút.
#
# Kết quả: production chạy ảnh CŨ HƠN thứ vừa deploy, log deploy vẫn xanh
# toàn tập, và tính năng mới trả 404 cho tới khi có người đi dò tay.
#
# Gốc rễ là cửa sổ giữa TRÁO và PUSH: trong khoảng đó, `main` trên GitHub
# CHƯA có mã đang chạy trên production, nên mọi lượt deploy-ghcr.yml rơi vào
# khoảng ấy đều lùi production về sau lưng mình. Cửa sổ đó không đóng lại
# được (bộ kiểm CI phải chạy trước khi push, và push có thể bị từ chối) —
# nhưng nó PHẢI kêu.
#
# Phép kiểm rẻ nhất bắt đúng lớp đó: so mã băm ảnh mà container ĐANG chạy
# với mã băm ảnh ta vừa tráo. Khác nhau = có người tráo đè.
info "Kiểm lại: container có đang chạy đúng ảnh vừa tráo không..."
KQ_CHOT=$(sshvps "
    for d in backend frontend; do
        MUON=\$(docker image inspect -f '{{.Id}}' ghcr.io/cuonghoang1103/api-backend-\$d:${SHA} 2>/dev/null)
        THAT=\$(docker inspect -f '{{.Image}}' ${COMPOSE_PROJECT}_\$d 2>/dev/null)
        TEN=\$(docker inspect -f '{{.Config.Image}}' ${COMPOSE_PROJECT}_\$d 2>/dev/null)
        if [ -z \"\$MUON\" ] || [ -z \"\$THAT\" ]; then echo \"\$d KHONG_DOC_DUOC \$TEN\"
        elif [ \"\$MUON\" = \"\$THAT\" ]; then echo \"\$d KHOP \$TEN\"
        else echo \"\$d LECH \$TEN\"; fi
    done" 2>/dev/null)

if echo "$KQ_CHOT" | grep -q 'LECH\|KHONG_DOC_DUOC'; then
    echo ""
    fail "⚠️  PRODUCTION KHÔNG CHẠY ẢNH VỪA TRÁO — có phiên khác tráo đè lên."
    echo "$KQ_CHOT" | sed 's/^/         /'
    fail "Ảnh ${SHA} vẫn nằm trên VPS. Tráo lại bằng tay:"
    fail "    ssh ${VPS_USER}@${VPS_IP} \"docker tag ghcr.io/cuonghoang1103/api-backend-backend:${SHA} ${COMPOSE_PROJECT}-backend:latest && \\"
    fail "        cd ${REPO_VPS} && set -a && . /opt/cuonghoangdev/.env; set +a; \\"
    fail "        docker compose -p ${COMPOSE_PROJECT} up -d --no-build backend\""
    fail "Hoặc đơn giản nhất: chạy lại 'bash deploy-nha.sh' khi phiên kia đã xong."
    sshnha "test -x \$HOME/bin/bao-tin.sh && bash \$HOME/bin/bao-tin.sh $(printf %q "⛔ Deploy ${SHA} BỊ TRÁO ĐÈ — production đang chạy ảnh khác. Chạy lại deploy-nha.sh.")" 2>/dev/null || true
    exit 1
fi
ok "Container đang chạy ĐÚNG ảnh ${SHA} (đã so mã băm, không phải tin lời log)"

echo ""
ok "XONG — production đang chạy commit ${SHA}"
echo ""
