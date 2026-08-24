#!/usr/bin/env bash
# ============================================================
# MỘT lệnh: đồng bộ main → deploy → đo lại.
#
#   npm run len-web
#
# Vì sao có file này: quy trình đúng là 5 lệnh, và hai lần liền nó hỏng theo
# CÙNG một kiểu — dán cả khối vào terminal, `git merge --ff-only` từ chối
# (main đã nhảy tiếp), rồi `deploy-nha.sh` VẪN CHẠY và deploy nhầm bản cũ.
# Dấu `;` giữa các dòng không biết dừng; file này thì biết.
#
# Mỗi bước hỏng là DỪNG HẲN, và nói rõ phải làm gì tiếp.
# ============================================================
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

NHANH="${1:-claude/web-perf-seo-upgrades-b82pac}"

b()    { printf '\n\033[1m── %s ──\033[0m\n' "$*"; }
xong() { printf '\033[32m✓\033[0m %s\n' "$*"; }
chet() { printf '\033[31m✗ %s\033[0m\n' "$*"; exit 1; }

# ── 1. Phải đứng ở main ────────────────────────────────────────────────
b "1/4  Kiểm nhánh"
HIEN=$(git rev-parse --abbrev-ref HEAD)
if [ "$HIEN" != "main" ]; then
    printf '   đang ở "%s", chuyển sang main...\n' "$HIEN"
    git checkout main || chet "không chuyển sang main được — có thay đổi chưa lưu?"
fi
xong "đang ở main"

# ── 2. Đồng bộ ─────────────────────────────────────────────────────────
b "2/4  Lấy $NHANH về main"
git fetch origin || chet "git fetch hỏng — kiểm mạng."
if ! git merge --ff-only "origin/$NHANH"; then
    echo
    chet "Không fast-forward được: main đã nhảy tiếp kể từ lần nhánh kia được đồng bộ.

   ĐỪNG tự chạy 'git merge --no-ff' để đi tiếp. Merge ở đây thì không ai đối
   chiếu được là main mới có đụng vào src/ hay frontend/ hay không, mà đó lại
   đúng là thứ quyết định có phải chạy lại tsc + build hay không.

   Nhắn Claude 'main lại nhảy rồi, merge lại giúp' — mất khoảng một phút,
   rồi chạy lại 'npm run len-web'."
fi
xong "main = $(git rev-parse --short HEAD)"

# ── 3. Deploy ──────────────────────────────────────────────────────────
b "3/4  Deploy"
# KHÔNG chạy nền và KHÔNG nuốt stdin: deploy-nha.sh hỏi [y/N] khi cây làm việc
# còn thay đổi chưa commit. Mất stdin là nó lặng lẽ dừng với exit 0 — đúng cái
# bẫy CLAUDE.md đã ghi.
if ! bash deploy-nha.sh; then
    chet "Deploy hỏng — đọc dòng [❌ FAIL] gần nhất ở trên.
   Nếu nó nói KQ=MOUNT_LECH thì chạy một lần:
     ssh root@160.187.1.208 \"cd /home/deployer/repo && docker compose -p cuonghoangdev up -d --force-recreate nginx\"
   rồi chạy lại 'npm run len-web'."
fi
xong "deploy xong"

# ── 4. Đo lại ──────────────────────────────────────────────────────────
b "4/4  Đối chiếu production"
bash scripts/kiem-web-seo.sh
KQ=$?

echo
if [ "$KQ" -eq 0 ]; then
    xong "Tất cả các mục đều đạt."
else
    printf '\033[33m!\033[0m Còn mục hỏng — dán nguyên phần trên cho Claude.\n'
fi
exit "$KQ"
