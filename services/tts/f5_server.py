"""
============================================================
F5-TTS — dịch vụ riêng, cổng 8092
============================================================

⚠️ VÌ SAO PHẢI LÀ TIẾN TRÌNH RIÊNG, KHÔNG NHÉT VÀO `app.py`.

Bản đầu nhét thẳng `from f5_tts.api import F5TTS` vào `app.py` và chết:

    [tts] F5 hỏng: No module named 'f5_tts'

`app.py` chạy bằng `~/voice-training/.venv` (VieNeu), còn F5-TTS cài ở
`~/f5-train/.venv`. Hai môi trường khác nhau, và gộp chúng nghĩa là cài
F5-TTS + toàn bộ phụ thuộc của nó vào đúng cái venv đang phục vụ giọng
robot — một lần xung đột phiên bản là robot mất giọng.

Đây đúng mô hình Chatterbox đã dùng cho tiếng Anh ở cổng 8091: tiến trình
riêng, venv riêng, `app.py` gọi qua HTTP nội bộ. Hỏng cái này thì mất
giọng F5, VieNeu vẫn nói.

── VRAM ──

Máy 12.288 MiB, llama.cpp (não robot) giữ ~5.900, VieNeu ~780. F5 nạp vào
chiếm ~2.500. Vừa, nhưng không còn chỗ cho sai số — nên nạp LƯỜI và tự
nhả sau `F5_NHAN_ROI_GIAY` không ai gọi.

Chạy:
    ~/f5-train/.venv/bin/uvicorn f5_server:app --host 127.0.0.1 --port 8092
"""
from __future__ import annotations

import gc
import io
import json
import os
import threading
import time
from pathlib import Path
from typing import Dict, Optional, Tuple

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

F5_DIR = Path(os.environ.get("F5_DIR", str(Path.home() / "f5-train")))
KHO = F5_DIR / "kho-mau"
CKPT = Path(os.environ.get("F5_CKPT", str(F5_DIR / "cuong_giong_6000.pt")))
VOCAB = Path(
    os.environ.get("F5_VOCAB", str(F5_DIR / ".venv/lib64/python3.14/data/cuong_char/vocab.txt"))
)

# ⚠️ `F5TTS_Base`, KHÔNG PHẢI `F5TTS_v1_Base`. Đo từ chính checkpoint: 22
# lớp, ẩn 1024, 337 triệu tham số = kiến trúc v0. Nền hynt là v0; nạp
# trọng số v0 vào bộ khung v1 là lệch hình ngay ở lớp đầu.
KIEN_TRUC = os.environ.get("F5_ARCH", "F5TTS_Base")

# 10 phút: đủ dài để một cuộc nói chuyện không phải nạp lại (nạp ~15 giây),
# đủ ngắn để không giữ 2,5 GB qua đêm.
NHAN_ROI_GIAY = float(os.environ.get("F5_NHAN_ROI_GIAY", "600"))

app = FastAPI(title="F5-TTS giọng Cường")

_model = None
_model_duong: Optional[str] = None   # model NÀO đang nằm trong VRAM
_lan_cuoi = 0.0
_khoa = threading.Lock()
_kho: Optional[Dict[str, dict]] = None

# ⚠️ MỖI GIỌNG CÓ THỂ CẦN MỘT MODEL KHÁC NHAU.
#
# Giọng chủ nhân dùng `cuong_giong_6000.pt` — đã học 35,7 phút giọng đó.
# Giọng NGƯỜI KHÁC phải dùng nền `hynt_nen.pt` chưa fine-tune ai: đưa
# giọng lạ vào model đã học một người là nó kéo về phía người đó, và bản
# nhân bản mất giống dần.
#
# Hai model là ~5 GB. Card 12 GB đang chia cho llama.cpp (5,9 GB) nên
# KHÔNG giữ cả hai — nạp cái nào cần, thấy đổi thì nhả cái cũ trước.
MODEL_MAC_DINH = str(CKPT)

# Mỗi cảm xúc một "giọng" — vì F5 chép ngữ điệu từ ĐOẠN MẪU, nên chọn cảm
# xúc chính là chọn mẫu. Ánh xạ thành `voiceId` để robot, trang web và
# bảng `giongTheoCheDo` không phải sửa một dòng nào.
TEN_GIONG: Dict[str, Tuple[str, str]] = {
    "f5-cuong": ("binh-thuong", "Cường (F5) — giọng nền, kể chuyện"),
    "f5-cuong-vui": ("vui", "Cường (F5) — vui, hào hứng"),
    "f5-cuong-buon": ("buon", "Cường (F5) — buồn, trầm"),
    "f5-cuong-gian": ("gian", "Cường (F5) — bực, gắt"),
    "f5-cuong-cuoi": ("cuoi", "Cường (F5) — cười khi nói"),
    "f5-cuong-nghiem": ("nghiem", "Cường (F5) — nghiêm túc, giảng giải"),
    "f5-cuong-nghe": ("nghe", "Cường (F5) — tiếng Nghệ Tĩnh"),
    # Giọng người khác — chạy nền hynt, xem ghi chú ở `MODEL_MAC_DINH`.
    "f5-khanh-linh": ("khanh-linh", "Khánh Linh (F5) — nhân bản, nền 1000h"),
}


def kho_mau() -> Dict[str, dict]:
    global _kho
    if _kho is None:
        try:
            _kho = json.loads((KHO / "kho.json").read_text("utf-8"))
        except Exception:
            _kho = {}
    return _kho


def _nap(duong: Optional[str] = None):
    """Nạp model cần cho lượt này. Gọi TRONG khoá.

    Đổi model thì NHẢ CÁI CŨ TRƯỚC. Giữ cả hai là ~5 GB trên một card
    12 GB đang chia cho não robot — OOM ở đây nghĩa là robot mất giọng
    giữa câu.
    """
    global _model, _model_duong, _lan_cuoi
    can = str(duong or MODEL_MAC_DINH)
    if not Path(can).is_absolute():
        can = str(F5_DIR / can)

    if _model is not None and _model_duong != can:
        print(f"[f5] đổi model: {Path(_model_duong or '?').name} → {Path(can).name}", flush=True)
        _model = None
        _model_duong = None
        gc.collect()
        try:
            import torch

            torch.cuda.empty_cache()
        except Exception:
            pass

    if _model is None:
        from f5_tts.api import F5TTS

        t0 = time.time()
        _model = F5TTS(model=KIEN_TRUC, ckpt_file=can, vocab_file=str(VOCAB))
        _model_duong = can
        print(f"[f5] nạp {Path(can).name} trong {time.time()-t0:.1f}s", flush=True)
    _lan_cuoi = time.time()
    return _model


def _canh_roi() -> None:
    """Nhả model khi lâu không ai gọi — trả VRAM cho não robot."""
    global _model
    while True:
        time.sleep(30)
        if _model is None or time.time() - _lan_cuoi < NHAN_ROI_GIAY:
            continue
        with _khoa:
            if _model is None or time.time() - _lan_cuoi < NHAN_ROI_GIAY:
                continue
            _model = None
            globals()["_model_duong"] = None
        gc.collect()
        try:
            import torch

            torch.cuda.empty_cache()
        except Exception:
            pass
        print("[f5] nhả model, trả VRAM", flush=True)


threading.Thread(target=_canh_roi, daemon=True).start()


@app.get("/health")
def health():
    """⚠️ NÓI THẬT: có đủ file không, model đã nạp chưa.

    Một `/health` chỉ trả `ok: true` mà không kiểm gì thì nó chỉ chứng
    minh tiến trình còn sống — thứ đã biết từ việc gọi được nó.
    """
    k = kho_mau()
    thieu = [x for x in (CKPT, VOCAB, KHO / "kho.json") if not x.exists()]
    return {
        "ok": not thieu and bool(k),
        "thieu": [str(x) for x in thieu],
        "soMau": len(k),
        "daNap": _model is not None,
        "roiGiay": round(time.time() - _lan_cuoi, 1) if _lan_cuoi else None,
        "ckpt": CKPT.name,
        "dangNap": Path(_model_duong).name if _model_duong else None,
    }


@app.get("/voices")
def voices():
    k = kho_mau()
    return {
        "voices": [
            {"id": vid, "label": nhan, "custom": True, "lang": "vi", "engine": "f5"}
            for vid, (cx, nhan) in TEN_GIONG.items()
            if cx in k
        ]
    }


class YeuCau(BaseModel):
    text: str
    voice: str = "f5-cuong"


@app.post("/noi")
def noi(y: YeuCau):
    """Sinh tiếng, trả PCM thô 16-bit mono — cùng khuôn với Chatterbox.

    ⚠️ CHỮ MẪU LẤY TỪ KHO, KHÔNG GÕ TAY.

    F5 ước tốc độ nói bằng `thời lượng mẫu ÷ độ dài chữ mẫu` rồi lấy đó
    dự đoán độ dài đầu ra. Chữ mẫu thiếu một nửa là đầu ra dài gấp đôi —
    đo thật 14/08: 16,3 giây cho câu đáng lẽ 6,8. Và nó KHÔNG báo lỗi,
    chỉ hiện ra ở nhịp.
    """
    if y.voice not in TEN_GIONG:
        raise HTTPException(404, f"Không có giọng '{y.voice}'")
    cx, _ = TEN_GIONG[y.voice]
    m = kho_mau().get(cx)
    if not m:
        raise HTTPException(503, f"Kho mẫu thiếu cảm xúc '{cx}'")
    f = KHO / m["file"]
    if not f.exists():
        raise HTTPException(503, f"Thiếu file mẫu {f.name}")
    if not y.text.strip():
        raise HTTPException(400, "Chữ rỗng")

    t0 = time.time()
    with _khoa:
        tts = _nap(m.get("model"))
        wav, sr, _ = tts.infer(
            ref_file=str(f),
            ref_text=m["chu"],
            gen_text=y.text,
            show_info=lambda *a, **k: None,
            # Seed cố định: cùng câu cùng giọng ra cùng tiếng. Ngẫu nhiên
            # thì mỗi lần robot nói một kiểu, và không tái hiện được lỗi
            # khi người dùng báo "lần nãy nó nói lạ lắm".
            seed=42,
        )
        globals()["_lan_cuoi"] = time.time()

    x = np.clip(np.asarray(wav, dtype=np.float32), -1, 1)
    giay = len(x) / sr
    print(f"[f5] {y.voice}: {giay:.2f}s tiếng trong {time.time()-t0:.2f}s", flush=True)
    return Response(
        content=(x * 32767).astype("<i2").tobytes(),
        media_type="application/octet-stream",
        headers={"X-Sample-Rate": str(sr), "X-Seconds": f"{giay:.2f}"},
    )
