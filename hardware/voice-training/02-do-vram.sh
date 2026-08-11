#!/usr/bin/env bash
# ============================================================
# Đo VRAM thật — 8 GB có đủ để LoRA không?
# ============================================================
#
#   ssh maytrain 'bash -s' < hardware/voice-training/02-do-vram.sh
#
# Đây là câu hỏi chặn cả dự án, và phải trả lời TRƯỚC khi user bỏ ra
# 2–4 giờ thu âm. Tài liệu VieNeu khuyên ≥12 GB VRAM và lấy ví dụ
# "RTX 3060" — nhưng đó là bản 12 GB. Máy này là 3060 **Ti**, mạnh hơn
# về tính toán mà chỉ có **8 GB**. Dưới mức khuyến nghị, nên phải đo.
#
# Cách đo: chạy đúng quy trình thật (dữ liệu mẫu → lọc → mã hoá →
# train) nhưng chỉ 20 bước thay vì 5000, rồi đọc đỉnh VRAM mà torch
# ghi lại. Hai mươi bước là đủ: đỉnh bộ nhớ chạm ngay trong vài bước
# đầu, chứ không tăng dần theo thời gian.
#
# Nếu tràn, script tự thử lại theo thang nhẹ dần thay vì bỏ cuộc:
#   1. mặc định        batch 2, bf16
#   2. batch 1         + tích luỹ 2 bước (giữ nguyên batch hiệu dụng)
#   3. + gradient checkpointing   (đổi tốc độ lấy bộ nhớ)
#   4. + 4-bit         (nén model gốc, VieNeu có sẵn cờ use_4bit)
set -uo pipefail

WORK="${HOME}/voice-training/VieNeu-TTS"
CFG="finetune/configs/lora_config.py"
export PATH="$HOME/.local/bin:$PATH"

say() { printf '\n\033[1;36m▶ %s\033[0m\n' "$1"; }
ok()  { printf '\033[1;32m  ✓ %s\033[0m\n' "$1"; }
bad() { printf '\033[1;31m  ✗ %s\033[0m\n' "$1"; }

cd "$WORK" 2>/dev/null || { bad "Chưa có $WORK — chạy 01-dung-moi-truong.sh trước"; exit 1; }

say "Dữ liệu mẫu"
if [ ! -f finetune/dataset/metadata.csv ]; then
  uv run python finetune/data_scripts/get_hf_sample.py || { bad "không tải được dữ liệu mẫu"; exit 1; }
fi
ok "$(wc -l < finetune/dataset/metadata.csv) dòng trong metadata.csv"

say "Lọc dữ liệu"
uv run python finetune/data_scripts/filter_data.py >/dev/null 2>&1 \
  && ok "xong metadata_cleaned.csv" || { bad "filter_data.py hỏng"; exit 1; }

say "Mã hoá âm thanh (bước này lâu nhất, vài phút)"
uv run python finetune/data_scripts/encode_data.py >/dev/null 2>&1 \
  && ok "xong metadata_encoded.csv" || { bad "encode_data.py hỏng"; exit 1; }

# Giữ bản gốc để trả lại nguyên trạng dù script chết giữa chừng.
cp "$CFG" "$CFG.goc"
trap 'mv -f "$CFG.goc" "$CFG" 2>/dev/null' EXIT

# $1 batch  $2 tích luỹ  $3 checkpointing(true/false)  $4 4bit(true/false)
thu() {
  local bs="$1" ga="$2" gc="$3" q4="$4" nhan="$5"
  cp "$CFG.goc" "$CFG"
  sed -i "s/'max_steps': *[0-9]*/'max_steps': 20/"                      "$CFG"
  sed -i "s/'save_steps': *[0-9]*/'save_steps': 100000/"                "$CFG"
  sed -i "s/'per_device_train_batch_size': *[0-9]*/'per_device_train_batch_size': $bs/" "$CFG"
  sed -i "s/'gradient_accumulation_steps': *[0-9]*/'gradient_accumulation_steps': $ga/" "$CFG"
  sed -i "s/'use_4bit': *\(True\|False\)/'use_4bit': $q4/"              "$CFG"
  [ "$gc" = "True" ] && sed -i "s/ddp_find_unused_parameters=False,/ddp_find_unused_parameters=False,\n        gradient_checkpointing=True,/" "$CFG"

  printf '\n  ── %s ──\n' "$nhan"
  nvidia-smi --query-gpu=memory.used --format=csv,noheader | sed 's/^/     trước khi chạy: /'

  # `PYTORCH_CUDA_ALLOC_CONF=expandable_segments` giảm phân mảnh — với
  # 8 GB thì phân mảnh đủ để biến "vừa khít" thành "tràn".
  PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
    uv run python finetune/train.py > /tmp/train-probe.log 2>&1
  local rc=$?

  if [ $rc -eq 0 ]; then
    ok "CHẠY ĐƯỢC — $nhan"
    /usr/bin/grep -i -E 'loss|step' /tmp/train-probe.log | tail -3 | sed 's/^/     /'
    return 0
  fi
  if /usr/bin/grep -q -i 'out of memory\|OutOfMemoryError' /tmp/train-probe.log; then
    bad "TRÀN VRAM — $nhan"
    /usr/bin/grep -i -o 'Tried to allocate [^;]*' /tmp/train-probe.log | head -1 | sed 's/^/     /'
    return 1
  fi
  bad "Hỏng vì lý do khác (không phải thiếu VRAM) — $nhan"
  tail -12 /tmp/train-probe.log | sed 's/^/     /'
  return 2
}

say "Đo — thử nhẹ dần cho tới khi vừa"

# Viết thành vòng lặp tường minh thay vì chuỗi if/elif: `$?` sau một
# điều kiện `if` KHÔNG giữ mã thoát của hàm như trực giác mách bảo, nên
# nhánh "hỏng vì lý do khác" ở bản trước sẽ không bao giờ chạy đúng.
KQ=""
NAC=(
  "2 1 False False|batch 2 (mặc định) — không cần chỉnh gì"
  "1 2 False False|batch 1 + gradient_accumulation_steps 2"
  "1 2 True  False|thêm gradient_checkpointing (chậm hơn ~30%)"
  "1 4 True  True |phải dùng QLoRA 4-bit"
)
for muc in "${NAC[@]}"; do
  args="${muc%%|*}"; ten="${muc##*|}"
  # shellcheck disable=SC2086
  thu $args "$ten"
  rc=$?
  if [ $rc -eq 0 ]; then KQ="$ten"; break; fi
  if [ $rc -eq 2 ]; then
    bad "Dừng: lỗi này không phải do thiếu VRAM, hạ cấu hình cũng vô ích."
    echo "  Xem /tmp/train-probe.log rồi gửi tôi."
    exit 1
  fi
done

say "KẾT LUẬN"
if [ -n "$KQ" ]; then
  echo "  ✅ 8 GB ĐỦ. Cấu hình chạy được: $KQ"
  echo "     → Yên tâm bỏ công thu 2–4 giờ giọng thật."
else
  echo "  ❌ 8 GB KHÔNG đủ kể cả ở mức nhẹ nhất."
  echo "     → Đừng thu âm vội. Còn hai đường: thuê GPU vài giờ (~150k),"
  echo "       hoặc đổi sang model nhỏ hơn. Gửi tôi /tmp/train-probe.log."
fi
nvidia-smi --query-gpu=memory.total,memory.used --format=csv | sed 's/^/  /'
