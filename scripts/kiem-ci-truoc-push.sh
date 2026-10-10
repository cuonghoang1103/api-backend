#!/bin/bash
# ============================================================
# Bộ kiểm BẮT BUỘC của CI, chạy trên một `git worktree` TẠM của ĐÚNG một SHA
# (đợt 8c, 12/10/2026). `deploy-nha.sh` bước 8 gọi file này trước khi push.
#
#   bash scripts/kiem-ci-truoc-push.sh <SHA>          # kiểm SHA đó
#   bash scripts/kiem-ci-truoc-push.sh HEAD           # thử tay trên HEAD hiện tại
#   KIEM_CI_BO_DB=1 bash scripts/kiem-ci-truoc-push.sh <SHA>   # bỏ test:work-db
#
# Mã thoát: 0 = xanh hết · 1 = có phép kiểm hỏng · 2 = không dựng được worktree.
# Tên các phép hỏng ghi vào tệp $KIEM_CI_KET_QUA (nếu đặt) — deploy-nha.sh đọc lại.
#
# Vì sao không chạy trên cây làm việc như trước:
#  1. BÁO ĐỎ GIẢ. Cây làm việc chứa đồ dở của phiên khác (09/10: tệp đang gõ của
#     agent song song làm `tsc` đỏ) ⇒ không push, dù bản ĐÃ deploy là sạch.
#  2. BÁO XANH GIẢ. Ngược lại, tệp có trên đĩa mà CHƯA commit (hoặc bị .gitignore
#     loại, vd `bin/` đợt 2) làm phép kiểm xanh trong khi commit thì thiếu.
#  3. KIỂM MỘT THỨ, ĐẨY THỨ KHÁC. Kiểm cây làm việc rồi `git push HEAD` — HEAD
#     lúc push có thể đã là commit phiên khác vừa thêm (23/09: 26 commit lên
#     GitHub chưa từng chạy trên prod). Nay kiểm đúng SHA, deploy-nha push đúng SHA.
#
# Cách dựng (đo thật, mỗi điểm đều có lý do):
#  • `git worktree add --detach` — index riêng, không đụng index/HEAD của cây chính
#    (nhiều phiên dùng chung `.git/index`, xem bộ nhớ feedback_index_git_dung_chung).
#  • frontend tsc chạy TRƯỚC khi worktree có `node_modules` gốc ⇒ giống Docker
#    (ảnh frontend không có node_modules của backend; 09/10 `e2e/**` import
#    playwright chỉ có ở gốc ⇒ máy xanh, Docker đỏ).
#  • `node_modules` gốc: KHÔNG symlink nguyên thư mục. Prisma sinh client vào
#    `node_modules/.prisma` — dùng chung thì client là của schema TRÊN ĐĨA (có thể
#    đang có đổi dở của phiên khác), không phải của SHA. Nên dựng một thư mục thật
#    gồm symlink từng mục, riêng `@prisma/client` chép thật rồi `prisma generate`
#    trong worktree ⇒ `.prisma/client` của đúng schema SHA, không đè client của cây chính.
#  • `.env` symlink: test cần JWT_SECRET… (đọc thôi, không ghi).
#  • test:work-db chạy trên một CSDL MỚI TINH tạo cho lượt này, dựng từ migration
#    của SHA bằng `scripts/db-test-tu-migration.mjs` (giống job Postgres của CI) rồi
#    DROP — không đụng CSDL dev. Không có Postgres cục bộ ⇒ BỎ QUA có cảnh báo
#    (không chặn push). Đo 12/10: dựng CSDL ~15s + 70 tệp test ~4 phút; cả bộ ~7–8 phút.
#
# Chỉ dùng tính năng bash 3.2 (bash mặc định của macOS) và không cần `timeout`.
# ============================================================

set -uo pipefail

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Không ở trong repo git" >&2; exit 2; }
cd "$ROOT" || exit 2

in_() { echo "[$(date '+%H:%M:%S')] [KIỂM]  $*"; }
xanh() { echo "[$(date '+%H:%M:%S')] [✅ OK]  $*"; }
canh() { echo "[$(date '+%H:%M:%S')] [WARN]  $*"; }

REF="${1:-}"
[ -n "$REF" ] || { echo "Dùng: bash scripts/kiem-ci-truoc-push.sh <SHA>" >&2; exit 2; }
SHA_DU=$(git rev-parse --verify --quiet "${REF}^{commit}") || { echo "Không có commit '${REF}'" >&2; exit 2; }
SHA_NGAN=${SHA_DU:0:8}

TMP_GOC=$(mktemp -d "${TMPDIR:-/tmp}/ctw-kiem-ci.XXXXXX") || exit 2
WT="${TMP_GOC}/wt"
NHAT_KY="${TMP_GOC}/kiem.log"
DB_TEN=""
DB_URL_ADMIN=""
KIEM_HONG=""

don_dep() {
    local ma=$?
    if [ -n "$DB_TEN" ] && [ -n "$DB_URL_ADMIN" ] && [ -x "$WT/node_modules/.bin/prisma" ]; then
        # WITH (FORCE): tiến trình test treo còn giữ kết nối thì DROP thường bị từ chối.
        echo "DROP DATABASE IF EXISTS \"${DB_TEN}\" WITH (FORCE);" \
            | (cd "$WT" && ./node_modules/.bin/prisma db execute --url "$DB_URL_ADMIN" --stdin >/dev/null 2>&1) \
            || canh "Không DROP được CSDL tạm ${DB_TEN} — xoá tay khi rảnh."
    fi
    if [ -d "$WT" ]; then
        git -C "$ROOT" worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"
    fi
    git -C "$ROOT" worktree prune >/dev/null 2>&1 || true
    rm -rf "$TMP_GOC"
    exit $ma
}
trap don_dep EXIT
trap 'exit 130' INT TERM

in_ "Dựng worktree tạm của ${SHA_NGAN} ở ${WT}"
if ! git worktree add --detach --quiet "$WT" "$SHA_DU" 2>"$NHAT_KY"; then
    sed 's/^/      /' "$NHAT_KY"; exit 2
fi

# node_modules của frontend + desktop: symlink nguyên thư mục (Docker frontend cũng
# chỉ có node_modules của chính nó). Không có thì phép kiểm tương ứng báo hỏng.
for d in frontend desktop; do
    if [ -d "$ROOT/$d/node_modules" ] && [ -d "$WT/$d" ]; then
        ln -s "$ROOT/$d/node_modules" "$WT/$d/node_modules"
    fi
done

chay_kiem() {
    local ten="$1"; shift
    local t0=$SECONDS
    if (cd "$WT" && "$@") >"$NHAT_KY" 2>&1; then
        xanh "  ✓ ${ten} ($((SECONDS - t0))s)"
    else
        canh "  ✗ ${ten} — HỎNG ($((SECONDS - t0))s)"
        tail -15 "$NHAT_KY" | sed 's/^/      /'
        KIEM_HONG="${KIEM_HONG} ${ten}"
    fi
}

# ─── 1. frontend tsc — KHI CHƯA có node_modules gốc (giống Docker) ───
chay_kiem "frontend tsc" bash -c 'cd frontend && ./node_modules/.bin/tsc --noEmit --skipLibCheck'

# ─── 2. node_modules gốc: symlink từng mục, @prisma/client chép thật ───
mkdir -p "$WT/node_modules/@prisma"
for p in "$ROOT"/node_modules/* "$ROOT"/node_modules/.[!.]*; do
    [ -e "$p" ] || continue
    case "$(basename "$p")" in .prisma|@prisma) continue ;; esac
    ln -s "$p" "$WT/node_modules/$(basename "$p")"
done
for p in "$ROOT"/node_modules/@prisma/*; do
    [ -e "$p" ] || continue
    if [ "$(basename "$p")" = client ]; then cp -R "$p" "$WT/node_modules/@prisma/client"
    else ln -s "$p" "$WT/node_modules/@prisma/$(basename "$p")"; fi
done
[ -f "$ROOT/.env" ] && ln -s "$ROOT/.env" "$WT/.env"

if ! (cd "$WT" && ./node_modules/.bin/prisma generate) >"$NHAT_KY" 2>&1; then
    canh "  ✗ prisma generate trong worktree hỏng"
    tail -15 "$NHAT_KY" | sed 's/^/      /'
    KIEM_HONG="${KIEM_HONG} prisma-generate"
else
    xanh "  ✓ prisma generate (client của đúng schema ${SHA_NGAN}, không đè client của cây chính)"
fi

# ─── 3. Đúng thứ tự + đúng lệnh các bước (required) của ci-lint.yml ───
chay_kiem "backend tsc"     ./node_modules/.bin/tsc --noEmit
chay_kiem "eval:grader"     npm run --silent eval:grader
chay_kiem "eval:cv-linter"  npm run --silent eval:cv-linter
chay_kiem "npm test"        npm test

# ─── 4. test:work-db trên CSDL TẠM (job work-db-tests của CI) ───
# URL gốc: biến môi trường nếu có, không thì .env. Chỉ nhận Postgres cục bộ.
db_url_goc() {
    if [ -n "${DATABASE_URL:-}" ]; then echo "$DATABASE_URL"; return; fi
    sed -n -E 's/^DATABASE_URL[[:space:]]*=[[:space:]]*"?([^"]*)"?.*/\1/p' "$ROOT/.env" 2>/dev/null | head -1
}
if [ "${KIEM_CI_BO_DB:-0}" = 1 ]; then
    canh "  – test:work-db BỎ QUA (KIEM_CI_BO_DB=1)"
else
    GOC=$(db_url_goc)
    # Tách bằng node (đã có sẵn) thay vì regex shell: mật khẩu có ký tự lạ vẫn đúng.
    TACH=$(GOC="$GOC" node -e '
        try {
          const u = new URL(process.env.GOC);
          if (!/^postgres(ql)?:$/.test(u.protocol)) throw 0;
          const host = u.hostname, port = u.port || "5432";
          const admin = new URL(u); admin.pathname = "/postgres"; admin.search = "";
          console.log([host, port, admin.toString()].join(" "));
        } catch { console.log(""); }' 2>/dev/null)
    DB_HOST=$(echo "$TACH" | awk '{print $1}')
    DB_PORT=$(echo "$TACH" | awk '{print $2}')
    case "$DB_HOST" in
        localhost|127.0.0.1|::1) CUC_BO=true ;;
        *) CUC_BO=false ;;
    esac
    if [ -z "$TACH" ] || [ "$CUC_BO" != true ]; then
        canh "  – test:work-db BỎ QUA: DATABASE_URL không phải Postgres cục bộ (không bao giờ chạy test DB lên máy khác)"
    elif ! node -e 'const s=require("net").connect(+process.argv[2],process.argv[1]);s.setTimeout(3000);s.on("connect",()=>{s.end();process.exit(0)});s.on("error",()=>process.exit(1));s.on("timeout",()=>process.exit(1))' "$DB_HOST" "$DB_PORT" 2>/dev/null; then
        canh "  – test:work-db BỎ QUA: Postgres ${DB_HOST}:${DB_PORT} không mở (docker compose up -d postgres). CI trên GitHub vẫn chạy nó."
    else
        DB_TEN="ctw_kiem_ci_${SHA_NGAN}_$$"
        DB_URL_ADMIN=$(echo "$TACH" | awk '{print $3}')
        DB_URL_TAM=$(GOC="$GOC" TEN="$DB_TEN" node -e 'const u=new URL(process.env.GOC);u.pathname="/"+process.env.TEN;console.log(u.toString())')
        # Một tiến trình con mang đủ env của job CI (ci-lint.yml › work-db-tests).
        if echo "CREATE DATABASE \"${DB_TEN}\";" | (cd "$WT" && ./node_modules/.bin/prisma db execute --url "$DB_URL_ADMIN" --stdin) >"$NHAT_KY" 2>&1; then
            # Dựng CSDL bằng scripts/db-test-tu-migration.mjs (KHÔNG `migrate deploy`: lịch sử migration không phát lại
            # được trên CSDL trống — xem đầu tệp đó). Script lấy từ CHÍNH worktree; commit cũ chưa có thì dùng bản trên đĩa.
            DUNG_DB="$WT/scripts/db-test-tu-migration.mjs"
            [ -f "$DUNG_DB" ] || DUNG_DB="$ROOT/scripts/db-test-tu-migration.mjs"
            chay_kiem "test:work-db" env DATABASE_URL="$DB_URL_TAM" NODE_ENV=test \
                LLM_BACKGROUND_ENABLED=false DUNG_DB="$DUNG_DB" \
                bash -c 'node "$DUNG_DB" && npm run --silent test:work-db'
        else
            canh "  ✗ test:work-db — không tạo được CSDL tạm ${DB_TEN}"
            tail -5 "$NHAT_KY" | sed 's/^/      /'
            KIEM_HONG="${KIEM_HONG} test:work-db"
        fi
    fi
fi

if [ -n "${KIEM_CI_KET_QUA:-}" ]; then printf '%s\n' "$KIEM_HONG" > "$KIEM_CI_KET_QUA"; fi
if [ -n "$KIEM_HONG" ]; then
    canh "Bộ kiểm ${SHA_NGAN}: HỎNG —${KIEM_HONG}"
    exit 1
fi
xanh "Bộ kiểm ${SHA_NGAN}: xanh hết"
exit 0
