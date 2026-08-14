#!/usr/bin/env bash
# ============================================================
#  Dựng dataset F5-TTS từ những gì xưởng giọng đã thu
# ============================================================
#
# Chạy trên MÁY NHÀ. Không đụng GPU, không đụng robot — chạy lúc nào cũng
# được.
#
# ⛔⛔ BẪY LỚN NHẤT CỦA CẢ QUY TRÌNH NẰM Ở BƯỚC 2 DƯỚI ĐÂY.
#
# `prepare_csv_wavs.py` ở chế độ fine-tune KHÔNG dựng bảng chữ từ dữ liệu
# của ta. Nó CHÉP ĐÈ bảng chữ Emilia ZH/EN của F5-TTS gốc vào thư mục
# dataset. Sau đó `finetune_cli` đọc đúng file đó để quyết kích thước lớp
# nhúng chữ.
#
# Đo thật 14/08/2026:
#     bảng chữ Emilia            2545 dòng
#     bảng chữ hynt (tiếng Việt) 2566 dòng
#     lớp nhúng trong checkpoint (2567, 512)
#
# Để nguyên là dựng model lệch 21 ô so với checkpoint sắp nạp vào.
#
# ⚠️ Và đây là chỗ bẫy trở nên nguy hiểm: bảng chữ Emilia CŨNG chứa 406
# ký tự có dấu tiếng Việt. Liếc qua thấy "à á ả ã ạ" thì ai cũng gật đầu
# bảo đúng rồi. Nó sai ở SỐ LƯỢNG và THỨ TỰ, mà hai thứ đó không nhìn ra
# bằng mắt — chỉ đếm mới ra.
#
# Nên bước 2 chép đè lại bằng bảng chữ của hynt, và bước 3 ĐẾM để chứng
# minh việc chép đè đã xảy ra. Không có bước đếm thì bước chép có chạy
# hay không cũng trông y hệt nhau.

set -euo pipefail

F5=~/f5-train
XUAT="$F5/xuong/xuat"
TEN="${1:-cuong}"

# Thư mục dataset mà `get_tokenizer` sẽ đọc. Đường này do F5-TTS tính ra
# bằng `files("f5_tts").joinpath("../../data")` — tức là NẰM TRONG venv,
# không phải trong thư mục dự án. Đặt sai chỗ thì lỗi báo là "không tìm
# thấy vocab.txt", nghe như thiếu file chứ không như đặt nhầm chỗ.
DATA_VENV="$F5/.venv/lib64/python3.14/data"
DICH="$DATA_VENV/${TEN}_char"

VOCAB_VIET="$F5/nen/hynt_vocab.txt"

echo "════ 1. Kiểm đầu vào ════"
[ -f "$XUAT/metadata.csv" ] || { echo "✗ Chưa có $XUAT/metadata.csv — bấm 'Xuất dataset' trên web trước."; exit 1; }
[ -f "$VOCAB_VIET" ] || { echo "✗ Thiếu bảng chữ tiếng Việt $VOCAB_VIET"; exit 1; }
SO_DONG=$(( $(wc -l < "$XUAT/metadata.csv") - 1 ))
echo "  $SO_DONG đoạn trong metadata.csv"
[ "$SO_DONG" -ge 20 ] || { echo "✗ Dưới 20 đoạn thì train không ra gì. Thu thêm."; exit 1; }

echo ""
echo "════ 2. Dựng dataset (arrow + duration) ════"
mkdir -p "$DATA_VENV"
rm -rf "$DICH"
# ⚠️ THAM SỐ ĐẦU LÀ FILE CSV, KHÔNG PHẢI THƯ MỤC.
#
# Nó tên là `inp_dir` — nghe như thư mục, và bản đầu của script này đưa
# thư mục vào rồi chết ở `ValueError: input must be a .csv file`. Phần
# trợ giúp của chính nó mới nói đúng: "Input CSV with header".
#
# Tên biến nói dối về kiểu dữ liệu là chuyện thường gặp; đọc `--help` chứ
# đừng suy từ tên.
"$F5/.venv/bin/python" \
  "$F5/.venv/lib64/python3.14/site-packages/f5_tts/train/datasets/prepare_csv_wavs.py" \
  "$XUAT/metadata.csv" "$DICH"

echo ""
echo "════ 3. Chép đè bảng chữ TIẾNG VIỆT (xem ghi chú đầu file) ════"
TRUOC=$(wc -l < "$DICH/vocab.txt")
cp "$VOCAB_VIET" "$DICH/vocab.txt"
SAU=$(wc -l < "$DICH/vocab.txt")
echo "  bảng chữ: $TRUOC dòng (Emilia) → $SAU dòng (tiếng Việt)"

# Chốt chặn. Không có nó thì một lần `cp` hỏng vì hết đĩa cũng trôi qua
# im lặng, và ta chỉ biết sau nhiều giờ train ra một model nói bậy.
if [ "$SAU" -ne 2566 ]; then
  echo "✗ Bảng chữ sau khi chép là $SAU dòng, phải là 2566. DỪNG."
  exit 1
fi
if [ "$TRUOC" -eq "$SAU" ]; then
  echo "⚠ Cảnh báo: số dòng không đổi. Kiểm lại xem có thật sự chép đè không."
fi

echo ""
echo "════ 4. Đối chiếu với checkpoint ════"
"$F5/.venv/bin/python" - <<PY
import torch, pathlib, sys
v = pathlib.Path("$DICH/vocab.txt").read_text("utf-8").split("\n")
ck = torch.load("$F5/nen/hynt_model_last.pt", map_location="meta", weights_only=False, mmap=True)
sd = ck.get("ema_model_state_dict") or ck["model_state_dict"]
w = next(t for k, t in sd.items() if k.endswith("text_embed.text_embed.weight"))
print(f"  bảng chữ file      : {len(v)}")
print(f"  lớp nhúng checkpoint: {tuple(w.shape)}")
if len(v) != w.shape[0]:
    print(f"✗ LỆCH {abs(len(v)-w.shape[0])} ô — nạp checkpoint sẽ hỏng. DỪNG.")
    sys.exit(1)
print("  ✓ khớp")
PY

echo ""
echo "════ Xong ════"
echo "  dataset: $DICH"
ls -la "$DICH"
echo ""
echo "  Bước tiếp: bash ~/f5-train/train.sh"
