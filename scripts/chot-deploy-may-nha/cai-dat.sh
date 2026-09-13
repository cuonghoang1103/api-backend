#!/usr/bin/env bash
# Cài chốt chống lùi production vào kho trần ở MÁY NHÀ.
#
#   bash scripts/chot-deploy-may-nha/cai-dat.sh              # cài / cập nhật
#   bash scripts/chot-deploy-may-nha/cai-dat.sh --go         # gỡ chốt
#   bash scripts/chot-deploy-may-nha/cai-dat.sh --xem        # xem trạng thái
#
# Chạy lại bao nhiêu lần cũng được — nó ghi đè hook bằng bản trong repo.
#
# ⚠️ Hook sống ở MÁY NHÀ chứ không nằm trong repo, nên `git clone` không mang
# nó theo. Dựng lại máy nhà thì phải chạy script này lại. Đó là lý do file
# hook được giữ trong repo: để còn có cái mà cài lại.
set -euo pipefail

MAY_NHA_LAN="${MAY_NHA_LAN:-linux-nha}"
KHO="cuongthai-build/repo.git"
HOOK_NGUON="$(dirname "${BASH_SOURCE[0]}")/pre-receive"

ok()   { echo "[✅] $*"; }
info() { echo "[··] $*"; }
fail() { echo "[❌] $*" >&2; }

ssh_nha() { ssh -o BatchMode=yes -o ConnectTimeout=15 "$MAY_NHA_LAN" "$@"; }

case "${1:-}" in
  --xem)
    info "Trạng thái chốt trên ${MAY_NHA_LAN}:"
    ssh_nha "
      H=\$HOME/${KHO}/hooks/pre-receive
      if [ -x \"\$H\" ]; then echo '  hook pre-receive : CÓ (thực thi được)';
      elif [ -f \"\$H\" ]; then echo '  hook pre-receive : CÓ NHƯNG KHÔNG THỰC THI ĐƯỢC ⚠';
      else echo '  hook pre-receive : KHÔNG CÓ'; fi
      echo -n '  push options     : '
      git --git-dir=\$HOME/${KHO} config --get receive.advertisePushOptions || echo '(chưa bật)'
      echo '  ref hiện có:'
      git --git-dir=\$HOME/${KHO} for-each-ref --format='    %(refname) %(objectname:short)' | sed 's/^/  /'
    "
    exit 0
    ;;
  --go)
    ssh_nha "rm -f \$HOME/${KHO}/hooks/pre-receive"
    ok "Đã gỡ chốt. Mọi lượt deploy giờ đi tự do — nhớ bật lại."
    exit 0
    ;;
esac

[ -f "$HOOK_NGUON" ] || { fail "không thấy $HOOK_NGUON"; exit 1; }
bash -n "$HOOK_NGUON" || { fail "hook có lỗi cú pháp — KHÔNG cài"; exit 1; }

info "Cài chốt vào ${MAY_NHA_LAN}:~/${KHO} ..."
ssh_nha "mkdir -p \$HOME/${KHO}/hooks" </dev/null
ssh_nha "cat > \$HOME/${KHO}/hooks/pre-receive && chmod +x \$HOME/${KHO}/hooks/pre-receive" < "$HOOK_NGUON"

# Không có cái này thì `--push-option=cho-lui` bị git nuốt im lặng và đường
# thoát hiểm coi như không tồn tại.
ssh_nha "git --git-dir=\$HOME/${KHO} config receive.advertisePushOptions true" </dev/null

ok "Đã cài. Kiểm lại:"
ssh_nha "
  test -x \$HOME/${KHO}/hooks/pre-receive && echo '  ✓ hook thực thi được' || echo '  ✗ hook KHÔNG thực thi được'
  echo -n '  ✓ push options = '; git --git-dir=\$HOME/${KHO} config --get receive.advertisePushOptions
" </dev/null

echo ""
echo "Từ giờ mọi lượt deploy — của MỌI phiên, MỌI bản script — đều phải chứa"
echo "commit đang chạy trên production. Cố ý lùi thì: bash deploy-nha.sh --cho-lui"
