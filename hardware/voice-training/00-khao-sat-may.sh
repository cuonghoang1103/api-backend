#!/usr/bin/env bash
# ============================================================
# Khảo sát máy train — chạy TRƯỚC khi cài bất cứ thứ gì
# ============================================================
#
#   ssh maytrain 'bash -s' < hardware/voice-training/00-khao-sat-may.sh
#
# Không cài gì, không đổi gì. Chỉ đọc và báo cáo.
#
# Vì sao có bước này: câu hỏi quyết định cả dự án là "8 GB VRAM có đủ
# để LoRA không" — tài liệu VieNeu khuyên ≥12 GB và lấy ví dụ RTX 3060
# (bản 12 GB), trong khi máy này là 3060 **Ti** chỉ có 8 GB. Trước khi
# user bỏ ra mấy buổi thu âm thì phải biết chắc con số thật, và biết
# chắc thì phải đo chứ không đọc.
set -u

line() { printf '\n──── %s ────\n' "$1"; }

line "Hệ điều hành"
. /etc/os-release 2>/dev/null && echo "  $PRETTY_NAME"
echo "  nhân: $(uname -r)   kiến trúc: $(uname -m)"
command -v dnf >/dev/null 2>&1 && echo "  gói: dnf (Fedora/RHEL)"
command -v apt-get >/dev/null 2>&1 && echo "  gói: apt (Debian/Ubuntu)"
# SELinux chỉ có ở họ Fedora/RHEL và nó là thứ âm thầm chặn nhiều việc
# — kể cả bước đổi mật khẩu cứu hộ. Biết nó đang ở chế độ nào thì đỡ
# mất buổi truy lỗi sai hướng.
command -v getenforce >/dev/null 2>&1 && echo "  SELinux: $(getenforce)"

line "CPU / RAM / Đĩa"
echo "  CPU: $(nproc) nhân — $(/usr/bin/grep -m1 'model name' /proc/cpuinfo | cut -d: -f2 | xargs)"
free -h | awk '/^Mem:/ {print "  RAM: "$2" tổng, "$7" khả dụng"}'
df -h / | awk 'NR==2 {print "  Đĩa /: "$2" tổng, "$4" trống ("$5" đã dùng)"}'
echo "  swap: $(free -h | awk '/^Swap:/ {print $2}')"

line "GPU"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=name,memory.total,memory.used,driver_version --format=csv,noheader \
    | sed 's/^/  /'
  echo "  CUDA (theo driver): $(nvidia-smi | /usr/bin/grep -o 'CUDA Version: [0-9.]*' | cut -d' ' -f3)"
else
  echo "  ❌ KHÔNG có nvidia-smi — driver NVIDIA chưa cài."
  echo "     Đây là thứ chặn đầu tiên; không có driver thì không train được gì."
  lspci 2>/dev/null | /usr/bin/grep -i vga | sed 's/^/     thấy card: /'
fi

line "Python"
for p in python3 python3.10 python3.11 python3.12; do
  command -v "$p" >/dev/null 2>&1 && echo "  $p → $($p -V 2>&1)"
done
command -v uv >/dev/null 2>&1 && echo "  uv → $(uv --version)" || echo "  uv → chưa có (VieNeu khuyên dùng uv)"
command -v git >/dev/null 2>&1 && echo "  git → $(git --version)" || echo "  git → chưa có"

line "Torch đã có sẵn chưa"
python3 - <<'PY' 2>/dev/null || echo "  chưa có torch (bình thường, sẽ cài sau)"
import torch
print(f"  torch {torch.__version__} | CUDA khả dụng: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"  GPU: {torch.cuda.get_device_name(0)}")
    print(f"  VRAM: {torch.cuda.get_device_properties(0).total_memory/1e9:.1f} GB")
PY

line "Kết luận"
VRAM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits 2>/dev/null | head -1)
if [ -n "${VRAM:-}" ]; then
  echo "  VRAM = ${VRAM} MB"
  if [ "$VRAM" -ge 11000 ]; then
    echo "  ✅ Đủ mức VieNeu khuyến nghị (≥12 GB) — train thoải mái."
  elif [ "$VRAM" -ge 7000 ]; then
    echo "  ⚠️  Dưới mức khuyến nghị. LoRA VẪN có thể vừa nếu hạ batch,"
    echo "     bật gradient checkpointing, giảm rank. Phải chạy thử mới chắc —"
    echo "     đó là việc của script 02."
  else
    echo "  ❌ Quá ít VRAM cho việc này."
  fi
else
  echo "  Chưa đo được VRAM vì chưa có driver."
fi
echo
