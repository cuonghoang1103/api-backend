#!/usr/bin/env bash
# ============================================================
# Dựng môi trường train VieNeu-TTS
# ============================================================
#
#   ssh maytrain 'bash -s' < hardware/voice-training/01-dung-moi-truong.sh
#
# Chạy SAU khi 00-khao-sat-may.sh báo có driver NVIDIA.
#
# ⚠️ Script này CỐ Ý KHÔNG cài driver NVIDIA.
#
# Cài driver sai cách trên một máy để bàn đang dùng màn hình là cách
# nhanh nhất để mất luôn giao diện đồ hoạ và phải cắm màn hình khác vào
# cứu. Driver là thứ duy nhất bạn nên tự cài, tận nơi, rồi khởi động
# lại. Mọi thứ còn lại script lo.
set -euo pipefail

say() { printf '\n\033[1;36m▶ %s\033[0m\n' "$1"; }
ok()  { printf '\033[1;32m  ✓ %s\033[0m\n' "$1"; }
die() { printf '\033[1;31m  ✗ %s\033[0m\n' "$1"; exit 1; }

WORK="${HOME}/voice-training"

# Nhận diện bản phân phối. Fedora và Ubuntu khác nhau ở trình quản lý
# gói, ở TÊN GÓI (libsndfile1 ↔ libsndfile), và ở cách cài driver
# NVIDIA — nên không thể viết một lệnh dùng chung.
if command -v dnf >/dev/null 2>&1; then
  PKG=dnf
elif command -v apt-get >/dev/null 2>&1; then
  PKG=apt
else
  die "Không nhận ra trình quản lý gói (không có dnf lẫn apt-get)."
fi
. /etc/os-release 2>/dev/null && say "Hệ điều hành: $PRETTY_NAME (dùng $PKG)"

say "Kiểm điều kiện cần"
if ! command -v nvidia-smi >/dev/null 2>&1; then
  if [ "$PKG" = dnf ]; then
    die "Chưa có driver NVIDIA. Trên Fedora phải qua RPM Fusion:

  sudo dnf install -y \\
    https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-\$(rpm -E %fedora).noarch.rpm \\
    https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-\$(rpm -E %fedora).noarch.rpm
  sudo dnf install -y akmod-nvidia xorg-x11-drv-nvidia-cuda

  ⚠️ SAU KHI CÀI, CHỜ 5-10 PHÚT rồi mới khởi động lại. akmod phải biên
  dịch module nhân ở nền; reboot sớm là vào máy không có driver và
  tưởng cài hỏng. Kiểm bằng: modinfo -F version nvidia
  Xong thì: sudo reboot"
  else
    die "Chưa có driver NVIDIA:  sudo ubuntu-drivers autoinstall && sudo reboot"
  fi
fi
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader | sed 's/^/  /'
ok "GPU sẵn sàng"

say "Gói hệ thống"
# ffmpeg: đọc/đổi định dạng audio khi chuẩn bị dữ liệu.
# libsndfile: soundfile đọc wav.
# nhóm biên dịch + python3-devel: vài gói phải build phần C.
if [ "$PKG" = dnf ]; then
  # ffmpeg đầy đủ của Fedora nằm ở RPM Fusion; kho gốc chỉ có
  # ffmpeg-free thiếu vài bộ giải mã. Cài bản nào có thì cài.
  sudo dnf install -y -q git curl ffmpeg libsndfile python3-devel gcc gcc-c++ make \
    || sudo dnf install -y -q git curl ffmpeg-free libsndfile python3-devel gcc gcc-c++ make
else
  sudo apt-get update -qq
  sudo apt-get install -y -qq git curl ffmpeg libsndfile1 build-essential python3-dev
fi
ok "Đã cài git, curl, ffmpeg, libsndfile, bộ biên dịch"

say "uv (trình quản lý gói Python mà VieNeu khuyên dùng)"
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
  # Thêm vào .bashrc để lần SSH sau vẫn thấy uv — nếu không thì mỗi
  # phiên lại phải export tay và mọi script sau đều gãy.
  /usr/bin/grep -q '.local/bin' "$HOME/.bashrc" 2>/dev/null \
    || echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
fi
export PATH="$HOME/.local/bin:$PATH"
ok "uv $(uv --version | awk '{print $2}')"

say "Tải mã nguồn VieNeu-TTS"
mkdir -p "$WORK"
cd "$WORK"
if [ -d VieNeu-TTS/.git ]; then
  cd VieNeu-TTS && git pull --ff-only -q && ok "đã cập nhật bản mới"
else
  git clone -q --depth 1 https://github.com/pnnbao97/VieNeu-TTS.git
  cd VieNeu-TTS && ok "đã tải về $WORK/VieNeu-TTS"
fi

say "Cài phụ thuộc (bản GPU)"
# `--group gpu` kéo PyTorch bản CUDA — ở ĐÂY thì đúng, khác hẳn con VPS
# nơi ta cố tình ép bản CPU. Máy này có card thật, và train thì bắt
# buộc phải có CUDA.
uv sync --group gpu
ok "môi trường đã dựng"

say "Kiểm torch có thấy GPU không"
uv run python - <<'PY'
import torch
print(f"  torch {torch.__version__}")
print(f"  CUDA khả dụng: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    p = torch.cuda.get_device_properties(0)
    print(f"  GPU: {p.name}")
    print(f"  VRAM: {p.total_memory/1e9:.2f} GB")
else:
    raise SystemExit("  ✗ torch KHÔNG thấy GPU — driver và bản torch lệch nhau.")
PY

say "Xong"
echo "  Thư mục làm việc: $WORK/VieNeu-TTS"
echo "  Bước tiếp: chạy 02-do-vram.sh để biết 8 GB có đủ không."
