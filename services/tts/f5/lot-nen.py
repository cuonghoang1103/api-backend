"""Lột checkpoint đầy đủ → file NỀN thuần trọng số.

⚠️ CHỈ BỎ Ở TẦNG NGOÀI. KHÔNG ĐỤNG VÀO BÊN TRONG `ema_model_state_dict`.

`trainer.load_checkpoint` rẽ nhánh theo TẦNG NGOÀI:

    "update" in checkpoint or "step" in checkpoint
        → nạp optimizer + scheduler, update = checkpoint["update"]
    ngược lại
        → lấy trọng số làm nền, update = 0     ← cái ta cần

Nền hynt có `update: 540000` ở tầng ngoài, nên F5-TTS tưởng là "train
tiếp lượt đang dở ở bước 540.000", thấy đích 1.800 bước đã qua từ lâu, và
THOÁT NGAY VỚI MÃ 0 — in "Train xong" mà không chạy một bước nào.

⚠️ Nhưng bản đầu của script này lột luôn `initted` và `step` BÊN TRONG
`ema_model_state_dict`, và chết:

    RuntimeError: Error(s) in loading state_dict for EMA:
        Missing key(s) in state_dict: "initted", "step"

Vì `self.ema_model.load_state_dict(checkpoint["ema_model_state_dict"])`
nạp NGUYÊN dict đó vào module EMA, mà `initted`/`step` là buffer đã đăng
ký của module — thiếu là hỏng. Trainer có lọc chúng, nhưng ở CHỖ KHÁC:
lúc dựng `model_state_dict`, không phải lúc nạp EMA.

Bài học: hai chỗ cùng tên khoá, hai luật khác nhau. Chép cả cụm, đừng tỉa.
"""
import torch, pathlib, sys

goc = pathlib.Path(sys.argv[1])
dich = pathlib.Path(sys.argv[2])
print(f"  đọc {goc.name} ({goc.stat().st_size/1e9:.2f} GB)…")
ck = torch.load(goc, map_location="cpu", weights_only=False)
print(f"  khoá tầng ngoài: {list(ck.keys())}")

ema = ck["ema_model_state_dict"]  # NGUYÊN CỤM, không tỉa
print(f"  ema_model_state_dict: {len(ema)} khoá")
for k in ("initted", "step", "update"):
    print(f"    {k}: {'CÓ (giữ)' if k in ema else 'không có'}")
for k, v in ema.items():
    if k.endswith("text_embed.text_embed.weight"):
        print(f"  bảng nhúng: {tuple(v.shape)}")

torch.save({"ema_model_state_dict": ema}, dich)
print(f"  ✓ ghi {dich.name} ({dich.stat().st_size/1e9:.2f} GB)")
print(f"  ✓ tầng ngoài chỉ còn: ['ema_model_state_dict'] → trainer sẽ đếm lại từ 0")
