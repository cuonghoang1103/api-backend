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
from pathlib import Path
import time
from typing import Any, Dict, Optional

import json
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
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


# ─── Giọng nhân bản ────────────────────────────────────────────
#
# ⚠️ NHÂN BẢN PHẢI DÙNG MÔ HÌNH ĐANG CHẠY, KHÔNG NẠP BẢN THỨ HAI.
#
# Chatterbox chiếm ~3,5 GB VRAM. Card 12 GB này còn phải nuôi LLM cục bộ
# (5,7 GB) và máy đọc tiếng Việt (0,8 GB) — nạp thêm một bản nữa là tràn.
# Đã tràn thật ngày 13/08/2026: một script nạp bản thứ hai để nhân bản và
# ăn ngay `CUDA out of memory`.
#
# Nên việc nhân bản phải đi qua ĐÂY, nơi mô hình đã nằm sẵn.
THU_MUC_GIONG = Path(os.environ.get("CB_VOICES_DIR", "~/chatterbox/giong")).expanduser()
THU_MUC_GIONG.mkdir(parents=True, exist_ok=True)
FILE_GIONG = THU_MUC_GIONG / "danh-sach.json"


def _nap_giong_nhan_ban() -> Dict[str, str]:
    try:
        return json.loads(FILE_GIONG.read_text()) if FILE_GIONG.exists() else {}
    except Exception:
        return {}


def _luu_giong_nhan_ban(d: Dict[str, str]) -> None:
    try:
        FILE_GIONG.write_text(json.dumps(d, ensure_ascii=False))
    except Exception as e:  # noqa: BLE001
        print(f"[cb] khong luu duoc danh sach giong: {e}", flush=True)


NHAN_BAN: Dict[str, str] = _nap_giong_nhan_ban()


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
    return {"voices": list(GIONG) + list(NHAN_BAN)}


@app.post("/clone")
async def clone(name: str = Form(...), file: UploadFile = File(...)):
    """Nhân bản một giọng tiếng Anh từ đoạn mẫu.

    Chatterbox chỉ cần ~10 giây. Đoạn dài hơn thì cắt lấy 10 giây ở giữa —
    mẫu dài không cho kết quả tốt hơn, mà lại tốn thời gian xử lý.
    """
    ten = name.strip()
    if not ten:
        raise HTTPException(400, "Thiếu tên giọng")
    if ten in GIONG:
        raise HTTPException(409, f"'{ten}' trùng tên giọng dựng sẵn")

    raw = await file.read()
    if len(raw) > 50 * 1024 * 1024:
        raise HTTPException(400, "File quá 50MB")

    tam = THU_MUC_GIONG / f"_tam_{os.getpid()}"
    tam.write_bytes(raw)
    ra = THU_MUC_GIONG / f"{ten}.wav"
    try:
        import subprocess

        # Lấy 10 giây từ giữa file: đầu và cuối hay dính nhạc hiệu, tiếng
        # động, hoặc người nói chưa vào giọng.
        r = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", str(tam)],
            capture_output=True, text=True, timeout=30,
        )
        dai = float(r.stdout.strip() or 0)
        bat_dau = max(0.0, dai / 2 - 5.0) if dai > 12 else 0.0
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", str(bat_dau),
             "-t", "10", "-i", str(tam), "-vn", "-ac", "1", "-ar", "24000",
             str(ra), "-y"],
            check=True, timeout=90,
        )
    except Exception as e:  # noqa: BLE001
        raise HTTPException(400, f"Không tách được tiếng: {str(e)[:200]}")
    finally:
        tam.unlink(missing_ok=True)

    NHAN_BAN[ten] = str(ra)
    _luu_giong_nhan_ban(NHAN_BAN)
    print(f"[cb] da nhan ban giong '{ten}' tu {dai:.1f}s (lay tu giay {bat_dau:.0f})", flush=True)
    return {"ok": True, "voice": ten, "mauGiay": round(min(10.0, dai), 1)}


@app.delete("/voices/{ten}")
def xoa(ten: str):
    if ten in GIONG:
        raise HTTPException(403, f"'{ten}' là giọng dựng sẵn, không xoá được")
    if ten not in NHAN_BAN:
        raise HTTPException(404, f"Không có giọng '{ten}'")
    Path(NHAN_BAN.pop(ten)).unlink(missing_ok=True)
    _luu_giong_nhan_ban(NHAN_BAN)
    return {"ok": True, "removed": ten}


@app.post("/en")
def doc(payload: Dict[str, Any]):
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(400, "Thiếu văn bản")
    if len(text) > 3000:
        raise HTTPException(400, f"Quá 3000 ký tự (đang {len(text)})")

    ten: Optional[str] = payload.get("voice") or "en-default"
    tham: Dict[str, Any] = {}
    if ten in GIONG:
        tham = dict(GIONG[ten])
    elif ten in NHAN_BAN:
        # Giọng nhân bản: dùng tham số của `en-cham` (người dùng đã chọn
        # nhịp này) rồi thêm mẫu tham chiếu.
        tham = dict(GIONG["en-cham"])
        tham["audio_prompt_path"] = NHAN_BAN[ten]
    else:
        raise HTTPException(404, f"Không có giọng '{ten}'. Có: {list(GIONG) + list(NHAN_BAN)}")

    m = may()
    t0 = time.time()
    with _chay_lock:
        wav = m.generate(text, **tham)
    b = ve_16k(wav.squeeze().detach().cpu().numpy(), int(m.sr))
    giay = len(b) / 2 / BO_SR
    print(f"[cb] {ten}: {giay:.2f}s tiếng trong {time.time()-t0:.2f}s", flush=True)

    return Response(
        content=b,
        media_type="application/octet-stream",
        headers={"X-Sample-Rate": str(BO_SR), "X-Audio-Seconds": f"{giay:.2f}"},
    )
