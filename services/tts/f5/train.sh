#!/usr/bin/env bash
# ============================================================
#  Fine-tune F5-TTS giọng riêng, từ nền tiếng Việt 1000 giờ
# ============================================================
#
# ⛔⛔ SCRIPT NÀY LÀM ROBOT MẤT NÃO Ở NHÀ TRONG LÚC CHẠY. CÓ CHỦ Ý.
#
# Đo thật trên máy 14/08/2026 — RTX 3060, 12.288 MiB:
#
#     llama-server (Qwen3.5, não robot)   5.898 MiB
#     VieNeu TTS   (giọng Việt robot)       778 MiB
#     kwin_wayland                           15 MiB
#     ─────────────────────────────────────────────
#     đang dùng                           ~7.018 MiB
#     CÒN TRỐNG                           ~5.200 MiB
#
# Train đỉnh **10.000 MiB** (đo lượt thử 12/08 với batch 1.200 frame).
# 10.000 > 5.200, nên KHÔNG có cách nào train mà không dừng thứ gì.
#
# Chọn dừng `llama-server` chứ không dừng VieNeu, vì:
#   · nó chiếm nhiều gấp bảy lần
#   · robot có đường lui: `nao.ts` tự tụt sang cổng trả phí khi máy nhà
#     chết, nên robot VẪN NÓI CHUYỆN ĐƯỢC, chỉ là tốn tiền cổng
#   · dừng VieNeu thì robot mất GIỌNG — thứ không có đường lui nào nghe
#     ra hồn
#
# Nghĩa là: chạy script này lúc bạn không cần robot chạy miễn phí. Nó tự
# bật `llama-server` lại khi xong, kể cả khi train hỏng giữa chừng.

set -uo pipefail

F5=~/f5-train
TEN="${TEN:-cuong}"
EPOCHS="${EPOCHS:-30}"

# ── Vì sao 1.200 frame chứ không phải 3.200 mặc định ──
# Lượt thử 12/08 với 3.200 frame: CUDA OOM ngay. 1.200 + dồn gradient 2
# bước cho ra cùng một kích thước batch hiệu dụng mà vừa bộ nhớ. Đừng
# tăng lại vì thấy "còn trống" — chỗ trống đó là chỗ đỉnh nhất thời của
# bước lan ngược sẽ chiếm.
BATCH="${BATCH:-1200}"
DON="${DON:-2}"

# 1e-5: đây là fine-tune, không phải train từ đầu. Cao hơn thì model quên
# mất tiếng Việt nó đã học 540.000 bước để đổi lấy hai mươi phút giọng
# của bạn — hỏng nhiều hơn được.
LR="${LR:-1e-5}"

DICH="$F5/.venv/lib64/python3.14/data/${TEN}_char"
CK="$F5/nen/hynt_model_last.pt"
LOG="$F5/train-$(date +%Y%m%d-%H%M%S).log"

echo "════ Kiểm trước khi động vào GPU ════"
[ -d "$DICH" ] || { echo "✗ Chưa có dataset $DICH — chạy chuan-bi.sh trước."; exit 1; }
[ -f "$CK" ] || { echo "✗ Thiếu checkpoint nền $CK"; exit 1; }
SO_VOCAB=$(wc -l < "$DICH/vocab.txt")
[ "$SO_VOCAB" -eq 2566 ] || { echo "✗ vocab.txt $SO_VOCAB dòng, phải 2566 — chạy lại chuan-bi.sh."; exit 1; }
echo "  dataset ✓   vocab $SO_VOCAB ✓   nền ✓"

# ── Nhường VRAM ──
#
# `trap` đặt TRƯỚC khi dừng: nếu bị Ctrl-C ngay giữa hai lệnh thì não vẫn
# được bật lại. Đặt sau là có một khe thời gian mà thoát ra sẽ để máy nhà
# câm vĩnh viễn cho tới khi có người để ý.
# ⚠️ TÊN UNIT LÀ `llm.service`, unit của NGƯỜI DÙNG (`--user`).
# Kiểm 14/08/2026: `systemctl --user list-units | grep -i llm`. Không có
# unit hệ thống nào tên như vậy, nên bỏ `--user` là lệnh chạy xong, trả
# về 0, và KHÔNG dừng gì cả — rồi train chết vì hết VRAM mà nhìn log thì
# tưởng đã nhường chỗ rồi.
UNIT=llm.service

BAT_LAI() {
  echo ""
  echo "════ Bật lại não robot ($UNIT) ════"
  systemctl --user start "$UNIT" || echo "⚠ BẬT LẠI HỎNG — chạy tay: systemctl --user start $UNIT"
  sleep 3
  systemctl --user is-active "$UNIT" || echo "⚠ $UNIT chưa chạy!"
  nvidia-smi --query-gpu=memory.used --format=csv,noheader
}
trap BAT_LAI EXIT INT TERM

echo ""
echo "════ Dừng não robot để nhường VRAM ════"
nvidia-smi --query-gpu=memory.used,memory.total --format=csv,noheader
systemctl --user stop "$UNIT"
sleep 4
TRONG=$(nvidia-smi --query-gpu=memory.free --format=csv,noheader,nounits)
echo "  còn trống: ${TRONG} MiB"
if [ "$TRONG" -lt 9000 ]; then
  echo "✗ Chỉ còn ${TRONG} MiB, train cần ~10.000. Có tiến trình khác đang giữ GPU:"
  nvidia-smi --query-compute-apps=pid,used_memory,process_name --format=csv
  exit 1
fi

echo ""
echo "════ Train — nhật ký: $LOG ════"
echo "  nền: hynt ViVoice 1000h, 540k bước"
echo "  $EPOCHS epoch · batch $BATCH frame · dồn $DON · lr $LR"
echo ""

cd "$F5"
# ⚠️ `--exp_name F5TTS_Base` chứ KHÔNG PHẢI `F5TTS_v1_Base`.
# Đo từ chính checkpoint: 22 lớp, ẩn 1024, 337 triệu tham số — đó là kiến
# trúc v0. Lượt thử 12/08 dùng v1 vì lúc đó nền còn là bản Emilia gốc;
# giữ nguyên v1 với nền này là nạp trọng số vào một bộ khung khác hình.
#
# ⚠️ KHÔNG truyền `--logger None`. Chuỗi "None" không phải giá trị None,
# và argparse nhận nó rồi mới chết ở chỗ khác. Bỏ hẳn tham số mới đúng.
PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
  .venv/bin/f5-tts_finetune-cli \
  --exp_name F5TTS_Base \
  --dataset_name "$TEN" \
  --tokenizer char \
  --finetune \
  --pretrain "$CK" \
  --batch_size_type frame \
  --batch_size_per_gpu "$BATCH" \
  --grad_accumulation_steps "$DON" \
  --epochs "$EPOCHS" \
  --num_warmup_updates 100 \
  --save_per_updates 200 \
  --last_per_updates 100 \
  --learning_rate "$LR" 2>&1 | tee "$LOG"

MA=${PIPESTATUS[0]}
echo ""
if [ "$MA" -eq 0 ]; then
  echo "════ Train xong ════"
  # Đường ckpt cũng do F5-TTS tự tính bằng `files("f5_tts")/../../ckpts`,
  # tức nằm TRONG venv — cùng kiểu với thư mục data.
  ls -la "$F5/.venv/lib64/python3.14/ckpts/$TEN/" 2>/dev/null | tail -8
else
  echo "✗ Train dừng với mã $MA — xem $LOG"
  # Hai lỗi hay gặp nhất, nói luôn cách sửa thay vì để đi tìm.
  /usr/bin/grep -qi "out of memory" "$LOG" && \
    echo "  → hết VRAM: chạy lại với BATCH=800 DON=3 bash train.sh"
  /usr/bin/grep -qi "size mismatch\|shape" "$LOG" && \
    echo "  → lệch kích thước: vocab.txt không khớp checkpoint, chạy lại chuan-bi.sh"
fi
exit "$MA"
