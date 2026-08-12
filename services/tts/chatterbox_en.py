"""
============================================================
Máy đọc TIẾNG ANH — Chatterbox, chạy trên GPU máy nhà
============================================================

Tiến trình RIÊNG, bám `127.0.0.1:8091`. Dịch vụ chính (`app.py`, cổng
8090) chuyển tiếp sang đây khi gặp giọng tiếng Anh.

── Vì sao hai tiến trình chứ không gộp làm một ──

Gọn nhất là `import chatterbox` thẳng trong `app.py`. Nhưng hai thư viện
này ghim hai bộ phụ thuộc khác nhau — Chatterbox đòi `transformers 5.2.0`,
VieNeu ghim bản riêng của nó, và cả hai cùng kéo `torch`. Nhét chung một
venv là đánh cược rằng pip hoà giải được; hoà giải hỏng thì **mất luôn cả
giọng tiếng Việt**, tức mất tính năng đang chạy tốt để đổi lấy một tính
năng mới. Không đáng.

Tách tiến trình thì mỗi bên giữ venv riêng, hỏng bên nào chỉ mất bên đó.
Cái giá là một lần nhảy HTTP qua loopback — đo được là dưới một mili
giây, không đáng kể so với vài giây sinh tiếng.

── Vì sao KHÔNG mở thêm cổng ra ngoài ──

Đường hầm ngược về VPS chỉ chở đúng những cổng ghi trong `permitlisten`
của `authorized_keys` bên đó, và sửa nó cần người dùng chạy tay (xem
[[reference_ssh_linux_nha_qua_vps]]). Cho `app.py` gọi sang đây qua
loopback thì thêm được máy đọc mới mà không đụng gì tới mạng.
"""
from __future__ import annotations

import os
import threading
import time
from typing import Any, Dict, Optional

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response

app = FastAPI(title="Chatterbox EN")

_m: Any = None
_nap_lock = threading.Lock()
# Model KHÔNG chạy song song được — giống VieNeu. Hai lượt chồng nhau thì
# cả hai ra tiếng lẫn lộn.
_chay_lock = threading.Lock()

BO_SR = 16_000

# Ba giọng, khác nhau ở hai núm mà Chatterbox mở ra:
#   exaggeration — cường độ biểu cảm
#   cfg_weight   — THẤP thì nhịp nói CHẬM lại một cách tự nhiên
#
# Chậm bằng `cfg_weight` khác hẳn chậm bằng ffmpeg `atempo`: cái này đổi
# cách model NÓI, cái kia giữ nguyên cách nói rồi kéo giãn thời gian. Tai
# nghe ra ngay — kéo giãn nghe như băng chạy chậm.
GIONG: Dict[str, Dict[str, float]] = {
    "en-default": {"exaggeration": 0.5, "cfg_weight": 0.5},
    "en-cham": {"exaggeration": 0.5, "cfg_weight": 0.3},
    "en-bieu-cam": {"exaggeration": 0.8, "cfg_weight": 0.3},
}


def may():
    global _m
    if _m is None:
        with _nap_lock:
            if _m is None:
                from chatterbox.tts import ChatterboxTTS

                t0 = time.time()
                _m = ChatterboxTTS.from_pretrained(
                    device=os.environ.get("CHATTERBOX_DEVICE", "cuda")
                )
                print(f"[cb] sẵn sàng sau {time.time() - t0:.1f}s", flush=True)
    return _m


def ve_16k(x: np.ndarray, sr: int) -> bytes:
    """float [-1,1] ở `sr` → PCM 16-bit LE mono 16 kHz.

    ⚠️ Luôn truyền `sr` THẬT của model. Lấy nhầm thì không có lỗi nào cả,
    chỉ có giọng ra sai tốc độ lẫn cao độ — và người nghe sẽ tưởng model
    hỏng chứ không nghĩ tới phép đổi mẫu.
    """
    x = np.asarray(x, dtype=np.float32).squeeze()
    if x.ndim > 1:
        x = x.mean(axis=1)
    if sr != BO_SR:
        import librosa

        x = librosa.resample(x, orig_sr=sr, target_sr=BO_SR, res_type="soxr_hq")
    x = np.clip(x, -1.0, 1.0)
    return (x * 32767.0).astype("<i2").tobytes()


@app.get("/health")
def health():
    # KHÔNG gọi `may()` ở đây: nạp model mất vài chục giây, và một
    # healthcheck đứng chờ nó thì mọi thứ tưởng dịch vụ chết.
    return {"ok": True, "loaded": _m is not None}


@app.get("/voices")
def voices():
    return {"voices": list(GIONG)}


@app.post("/en")
def doc(payload: Dict[str, Any]):
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(400, "Thiếu văn bản")
    if len(text) > 3000:
        raise HTTPException(400, f"Quá 3000 ký tự (đang {len(text)})")

    ten: Optional[str] = payload.get("voice") or "en-default"
    if ten not in GIONG:
        raise HTTPException(404, f"Không có giọng '{ten}'. Có: {list(GIONG)}")

    m = may()
    t0 = time.time()
    with _chay_lock:
        wav = m.generate(text, **GIONG[ten])
    b = ve_16k(wav.squeeze().detach().cpu().numpy(), int(m.sr))
    giay = len(b) / 2 / BO_SR
    print(f"[cb] {ten}: {giay:.2f}s tiếng trong {time.time()-t0:.2f}s", flush=True)

    return Response(
        content=b,
        media_type="application/octet-stream",
        headers={"X-Sample-Rate": str(BO_SR), "X-Audio-Seconds": f"{giay:.2f}"},
    )
