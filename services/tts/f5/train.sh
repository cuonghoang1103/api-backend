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
# ⚠️ NỀN ĐÃ LỘT, không phải checkpoint gốc — xem ghi chú ở bộ quét dưới.
CK="$F5/nen/hynt_nen.pt"
LOG="$F5/train-$(date +%Y%m%d-%H%M%S).log"

echo "════ Kiểm trước khi động vào GPU ════"
[ -d "$DICH" ] || { echo "✗ Chưa có dataset $DICH — chạy chuan-bi.sh trước."; exit 1; }
if [ ! -f "$CK" ]; then
  echo "✗ Thiếu nền đã lột $CK"
  echo "  Tạo bằng: .venv/bin/python lot-nen.py nen/hynt_model_last.pt nen/hynt_nen.pt"
  exit 1
fi
SO_VOCAB=$(wc -l < "$DICH/vocab.txt")
[ "$SO_VOCAB" -eq 2566 ] || { echo "✗ vocab.txt $SO_VOCAB dòng, phải 2566 — chạy lại chuan-bi.sh."; exit 1; }
echo "  dataset ✓   vocab $SO_VOCAB ✓   nền ✓"

# ⛔⛔ FILE CŨ TRONG `ckpts/` ĐÈ LÊN `--pretrain`, KHÔNG BÁO MỘT LỜI.
#
# `--pretrain` KHÔNG phải thứ quyết định nền. Nó chỉ chép file vào
# `ckpts/<tên>/` với tiền tố `pretrained_`. Chọn nạp cái nào là việc của
# `load_checkpoint` (`trainer.py:194`), và nó chọn thế này:
#
#     1. có `model_last.pt`  → lấy luôn, bỏ qua nền bạn chỉ định
#     2. có `model_<số>.pt`  → lấy cái số lớn nhất
#     3. còn lại             → next(f for f in ds if f.startswith("pretrained_"))
#
# ⚠️ Nhánh 3 dùng `next()` trên `os.listdir` — tức LẤY FILE ĐẦU TIÊN THEO
# THỨ TỰ HỆ THỐNG TỆP. Hai nền trong một thư mục là tung đồng xu.
#
# Đo thật 14/08/2026, hai lần chết liên tiếp trong thư mục này:
#   · `model_last.pt` (12/08, 12 bước, nhúng 2546) — nhánh 1 nuốt luôn
#   · dời nó đi rồi, còn HAI file `pretrained_`:
#       pretrained_hynt_model_last.pt         2567  ← cái muốn
#       pretrained_model_1250000.safetensors  2546  ← `next()` bốc phải
#
# ⚠️⚠️ Và thông báo lỗi ĐÁNH LẠC HƯỚNG hoàn toàn:
#
#     size mismatch … [2546, 512] from checkpoint, current model [2567, 512]
#
# Nghe như vocab sai, khiến người ta đi sửa vocab — trong khi vocab đúng,
# chỉ là nó nạp nhầm nền.
#
# Chốt chặn: quét MỌI file trainer có thể nhặt, đo bảng nhúng từng cái,
# lệch thì DỜI SANG TÊN KHÁC (không xoá — đó là hàng GB công train của ai
# đó) cho tới khi trong thư mục chỉ còn thứ khớp.
CKPT_DIR="$F5/.venv/lib64/python3.14/ckpts/$TEN"
if [ -d "$CKPT_DIR" ]; then
  echo ""
  echo "════ Quét MỌI checkpoint trong ckpts/ ════"
  "$F5/.venv/bin/python" - "$CKPT_DIR" <<'PY'
import os, sys, time, json

thu = sys.argv[1]
CAN = 2567  # bảng nhúng của nền hynt


def do(duong):
    """(số hàng lớp nhúng, số bước) — `None` ở đâu là không đọc được chỗ đó.

    ⚠️ PHẢI XÉT CẢ SỐ BƯỚC, KHÔNG CHỈ KÍCH THƯỚC.

    `load_checkpoint` rẽ nhánh theo việc file CÓ khoá `update` hay không:
    có thì nạp cả optimizer và đặt `update = checkpoint["update"]`; không
    thì lấy trọng số làm nền và đếm lại từ 0.

    Đo 14/08/2026: nền hynt mang `update: 540000`. F5-TTS hiểu là "train
    tiếp lượt đang dở ở bước 540.000", thấy đích 1.800 bước đã qua từ
    lâu, và THOÁT NGAY VỚI MÃ 0 — in "Train xong" mà không chạy một bước.
    Một lỗi báo THÀNH CÔNG thì không ai đi tìm.

    Nên file nào mang số bước lớn hơn mọi lượt train thật của ta (vài
    nghìn) đều là bản sao của nền, không phải tiến độ của mình.
    """
    try:
        if duong.endswith(".safetensors"):
            # Đọc phần TIÊU ĐỀ thôi — nó có sẵn hình dạng, khỏi nạp 1,3 GB.
            with open(duong, "rb") as f:
                n = int.from_bytes(f.read(8), "little")
                head = json.loads(f.read(n))
            for k, v in head.items():
                if k.endswith("text_embed.text_embed.weight"):
                    return v["shape"][0], None  # safetensors không mang số bước
            return None, None
        import torch

        ck = torch.load(duong, map_location="meta", weights_only=False, mmap=True)
        buoc = ck.get("update") or ck.get("step")
        sd = ck.get("ema_model_state_dict") or ck.get("model_state_dict") or ck
        for k, v in sd.items():
            if k.endswith("text_embed.text_embed.weight"):
                return v.shape[0], buoc
    except Exception as e:
        print(f"    (không đọc được {os.path.basename(duong)}: {e})")
    return None, None


# ⚠️ Chỉ những file mà trainer THẬT SỰ nhặt: xem `load_checkpoint`, nó lọc
# theo tiền tố model_/pretrained_ và đuôi .pt/.safetensors.
ds = sorted(
    f for f in os.listdir(thu)
    if (f.startswith("model_") or f.startswith("pretrained_"))
    and f.endswith((".pt", ".safetensors"))
)
if not ds:
    print("  (trống — train sẽ bắt đầu từ nền)")
TRAN_BUOC = 100_000  # lượt train của ta chỉ vài nghìn bước

for f in ds:
    p = os.path.join(thu, f)
    n, buoc = do(p)
    if n != CAN:
        ly = f"nhúng {n}, cần {CAN}"
    elif buoc and buoc >= TRAN_BUOC:
        ly = f"mang số bước {buoc:,} — là bản sao của nền, không phải tiến độ của ta"
    else:
        print(f"  ✓ {f}: nhúng {n}" + (f", bước {buoc:,}" if buoc else "") + " — giữ")
        continue
    moi = f"{p}.bo-{time.strftime('%Y%m%d-%H%M%S')}"
    os.rename(p, moi)
    print(f"  ⚠ {f}: {ly}")
    print(f"    → ĐÃ DỜI sang {os.path.basename(moi)}")
PY
fi

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
