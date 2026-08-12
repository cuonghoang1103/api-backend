"""
============================================================
Voice CuongMini — dịch vụ tổng hợp giọng nói chạy trên VPS
============================================================

VieNeu-TTS v3 Turbo, ONNX/CPU, không GPU. Chỉ nghe ở mạng nội bộ của
Docker; Node gọi vào, không mở ra Internet.

── Vì sao là model NÀY, và vì sao chấp nhận nó chậm ──

Đo thật trên chính con VPS này (11/08/2026, container 3 và 4 nhân):

    VieNeu v3 Turbo   RTF 0,77 – 1,06
    Piper (VITS)      RTF 0,13 – 0,35

Với ROBOT thì RTF ~1,0 là hỏng: bo phát nhanh hơn server sinh, vòng đệm
cạn, tiếng lặp từ. Nhưng trang Voice là kiểu dán chữ - bấm nút - ngồi
chờ, y như mọi trang TTS khác. Ở đó RTF 1,0 chẳng sao cả, và đổi lại
được thứ Piper không bao giờ có: **nhân bản giọng bất kỳ từ vài giây
mẫu**. Đó là lý do tồn tại của dịch vụ này.

Nên đừng "tối ưu" bằng cách đổi sang Piper — hai cái phục vụ hai việc
khác nhau và đang cùng tồn tại có chủ đích.

── Vì sao có hàng đợi dù đã chốt "làm gọn" ──

5.000 ký tự là ~5,5 phút tiếng, ở RTF 1,0 nghĩa là ~5,5 phút sinh. Một
request HTTP treo sáu phút sẽ chết ở nginx trước khi tới đích. Hàng đợi
ở đây chỉ là hai mươi dòng và một cái từ điển trong bộ nhớ — không phải
Redis, không phải Celery. Giao diện vẫn gọn: bấm nút, quay vòng, ra
tiếng.
"""
from __future__ import annotations

import io
import os
import threading
import time
import uuid
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np
import soundfile as sf
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, Response, StreamingResponse

VOICES_FILE = Path(os.environ.get("VIENEU_VOICES_FILE", "/models/voices.json"))
MAX_CHARS = int(os.environ.get("TTS_MAX_CHARS", "5000"))
# Giữ kết quả trong bộ nhớ 30 phút — đủ để người dùng bấm tải về, mà
# không để tiến trình phình mãi. Mỗi phút tiếng 24 kHz float32 ~ 5,7 MB.
JOB_TTL_SEC = 30 * 60

app = FastAPI(title="Voice CuongMini")

_tts: Any = None
_lock = threading.Lock()          # model KHÔNG an toàn đa luồng
_jobs: Dict[str, Dict[str, Any]] = {}
_sr = 48_000


def engine():
    """Nạp model một lần, nạp lười.

    Nạp mất ~38 giây (đo thật). Làm ở lượt gọi đầu chứ không ở lúc khởi
    động container, để `docker compose up` không phải đứng chờ và để
    /health trả lời được ngay — nếu không thì healthcheck sẽ báo đỏ suốt
    nửa phút đầu và deploy tưởng dịch vụ hỏng.
    """
    global _tts, _sr
    if _tts is None:
        with _lock:
            if _tts is None:
                from vieneu import Vieneu

                t0 = time.time()
                # Mặc định "onnx" = đường CPU int8, đúng bản đã đo trên
                # VPS (RTF 2,11). VPS không có GPU nên đây là lựa chọn duy
                # nhất ở đó.
                #
                # Nhưng cùng file này còn chạy trên máy để bàn ở nhà, nơi
                # có RTX 3060. Đo ngày 12/08/2026 trên đúng máy đó:
                #
                #   ONNX/CPU     RTF 0,251
                #   PyTorch/GPU  RTF 0,188
                #
                # Nên mở ra bằng biến môi trường thay vì chốt cứng — cùng
                # một mã chạy được cả hai chỗ, và chỗ nào nhanh thì nói ra
                # bằng cấu hình chứ không phải bằng một nhánh mã riêng.
                _tts = Vieneu(
                    backend=os.environ.get("VIENEU_BACKEND", "onnx"),
                    device=os.environ.get("VIENEU_DEVICE", "auto"),
                )
                _sr = int(getattr(_tts, "sample_rate", 48_000) or 48_000)
                if VOICES_FILE.exists():
                    try:
                        # ⚠️ Hàm RIÊNG TƯ, cố ý. `save_voices()` là công
                        # khai nhưng không có `load_voices()` đối xứng —
                        # đường công khai duy nhất để nạp giọng là trỏ
                        # `backbone_repo` vào một thư mục có voices.json,
                        # mà làm thế thì mất luôn 14 giọng dựng sẵn.
                        # Dùng hàm riêng tư để giữ được CẢ HAI.
                        # Vì thế Dockerfile ghim đúng vieneu==3.2.4:
                        # bản mới đổi tên hàm này là dịch vụ chết câm.
                        _tts._load_voices_from_file(VOICES_FILE)
                        print(f"[tts] đã nạp giọng nhân bản từ {VOICES_FILE}", flush=True)
                    except Exception as e:  # file hỏng thì vẫn phải chạy được
                        print(f"[tts] không nạp được voices.json: {e}", flush=True)
                print(f"[tts] model sẵn sàng sau {time.time() - t0:.1f}s", flush=True)
    return _tts


def to_wav(audio: np.ndarray, sr: int) -> bytes:
    buf = io.BytesIO()
    sf.write(buf, np.asarray(audio, dtype=np.float32), sr, format="WAV", subtype="PCM_16")
    return buf.getvalue()


def reap_jobs() -> None:
    now = time.time()
    for jid in [k for k, v in _jobs.items() if now - v["at"] > JOB_TTL_SEC]:
        _jobs.pop(jid, None)


@app.get("/health")
def health():
    # KHÔNG gọi engine() ở đây — xem ghi chú trong engine().
    return {"ok": True, "loaded": _tts is not None}


# 14 giọng VieNeu phát kèm mô hình. Giọng người dùng tự nhân bản được ghi
# vào CÙNG một `presets` dict với y hệt cấu trúc (description, gender,
# style, speaker_emb, codes) — không có cờ nào phân biệt, nên nhìn vào
# file là không thể biết cái nào xoá được.
#
# Vì sao chốt danh sách ở đây thay vì ghi thêm một file "giọng của tôi":
# file phụ đó phải đúng với voices.json ở MỌI lúc, mà hai file thì có lúc
# lệch — nhân bản lỗi giữa chừng, khôi phục thủ công, sửa tay. Lúc lệch
# thì hậu quả không cân xứng: coi nhầm giọng tự tạo thành giọng gốc chỉ
# là không xoá được (bực mình); coi nhầm giọng gốc thành giọng tự tạo là
# MẤT nó, và lấy lại phải cài lại mô hình.
#
# Danh sách này chỉ dùng để KHOÁ nút xoá, không đụng vào chuyện đọc.
GIONG_GOC = frozenset({
    "Minh Đức", "Phạm Tuyên", "Thái Sơn", "Xuân Vĩnh", "Thanh Bình",
    "Trúc Ly", "Ngọc Linh", "Đoan Trang", "Mai Anh", "Thục Đoan",
    "Minh Triết", "Thùy Dung", "Quang Sơn", "Ngọc Trân",
})


@app.get("/voices")
def voices():
    t = engine()
    return {
        "voices": [
            {"id": vid, "label": label, "custom": vid not in GIONG_GOC}
            for label, vid in t.list_preset_voices()
        ]
    }


def run_job(jid: str, text: str, voice: Optional[str], style: str) -> None:
    try:
        t = engine()
        t0 = time.time()
        with _lock:  # một lượt sinh tại một thời điểm; model không reentrant
            audio = t.infer(text=text, voice=voice or None, style=style)
        dur = len(audio) / _sr
        _jobs[jid].update(
            state="done",
            wav=to_wav(audio, _sr),
            seconds=round(dur, 2),
            ms=int((time.time() - t0) * 1000),
            rtf=round((time.time() - t0) / dur, 3) if dur else None,
        )
    except Exception as e:
        _jobs[jid].update(state="error", error=str(e)[:400])


@app.post("/tts")
def tts(payload: Dict[str, Any]):
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(400, "Thiếu văn bản")
    if len(text) > MAX_CHARS:
        raise HTTPException(400, f"Quá {MAX_CHARS} ký tự (đang {len(text)})")

    reap_jobs()
    jid = uuid.uuid4().hex
    _jobs[jid] = {"state": "running", "at": time.time(), "chars": len(text)}
    threading.Thread(
        target=run_job,
        args=(jid, text, payload.get("voice"), str(payload.get("style") or "tu_nhien")),
        daemon=True,
    ).start()
    # Ước lượng để giao diện vẽ thanh tiến trình: tiếng Việt đọc ~15 ký
    # tự/giây, nhân RTF ~1,0 đo được ra xấp xỉ số giây phải chờ.
    return {"jobId": jid, "uocTinhGiay": round(len(text) / 15, 1)}


@app.get("/tts/{jid}")
def tts_result(jid: str):
    job = _jobs.get(jid)
    if not job:
        raise HTTPException(404, "Không có việc này (có thể đã quá hạn 30 phút)")
    if job["state"] == "running":
        # 202 chứ KHÔNG phải 200. Lúc xong thì thân trả về là WAV nhị
        # phân; nếu lúc đang chạy cũng 200 thì bên gọi không có cách nào
        # phân biệt ngoài việc đi ngửi kiểu nội dung — và bên gọi đầu
        # tiên (chính tôi, lúc thử) đã lưu nguyên 37 byte JSON ra file
        # .wav rồi tưởng đã xong.
        return JSONResponse(
            {"state": "running", "choDuocGiay": round(time.time() - job["at"], 1)},
            status_code=202,
        )
    if job["state"] == "error":
        return JSONResponse({"state": "error", "error": job["error"]}, status_code=500)
    return Response(
        content=job["wav"],
        media_type="audio/wav",
        headers={
            "X-Audio-Seconds": str(job["seconds"]),
            "X-Gen-Ms": str(job["ms"]),
            "X-RTF": str(job.get("rtf")),
        },
    )


@app.post("/voices")
async def add_voice(
    name: str = Form(...),
    description: str = Form(""),
    gender: str = Form(""),
    file: UploadFile = File(...),
):
    """Nhân bản một giọng từ đoạn mẫu tải lên.

    `add_voice` tự khử nhiễu và cắt gọn rồi rút đặc trưng người nói, nên
    mẫu không cần sạch sẵn — nhưng phòng yên và một micro duy nhất vẫn
    cho kết quả hơn hẳn.

    `save=True` ghi xuống /models/voices.json nằm trong volume, nên giọng
    sống qua mọi lần deploy. Không có nó thì nhân bản xong container
    restart là mất, và người dùng phải thu lại từ đầu.
    """
    raw = await file.read()
    if len(raw) > 50 * 1024 * 1024:
        raise HTTPException(400, "File quá 50MB")
    tmp = Path(f"/tmp/ref-{uuid.uuid4().hex}{Path(file.filename or 'a.wav').suffix or '.wav'}")
    tmp.write_bytes(raw)
    try:
        t = engine()
        with _lock:
            t.add_voice(name.strip(), str(tmp), description=description, gender=gender, save=False)
            t.save_voices(str(VOICES_FILE))
        return {"ok": True, "voice": name.strip()}
    except Exception as e:
        raise HTTPException(400, f"Không nhân bản được: {str(e)[:300]}")
    finally:
        tmp.unlink(missing_ok=True)


@app.delete("/voices/{name}")
def remove_voice(name: str):
    """Xoá một giọng ĐÃ NHÂN BẢN. Giọng gốc của VieNeu thì từ chối.

    Chặn ở ĐÂY chứ không chỉ ẩn nút trên web: đây là chỗ duy nhất mọi
    đường đều phải đi qua. Ẩn nút chỉ giấu được một lối vào, còn `curl`,
    lần gọi lặp lại, hay một bản web cũ đang mở trong tab khác thì vẫn
    tới thẳng đây được — và xoá xong thì phải cài lại mô hình mới có lại.
    """
    if name in GIONG_GOC:
        raise HTTPException(403, f"'{name}' là giọng gốc của VieNeu, không xoá được")
    t = engine()
    with _lock:
        kho = getattr(t, "_preset_voices", None)
        if kho is None:
            raise HTTPException(500, "Bản vieneu này không có _preset_voices")
        if name not in kho:
            raise HTTPException(404, f"Không có giọng '{name}'")

        # Tự xoá thay vì gọi `t.remove_voice(name)`: **thư viện vieneu
        # KHÔNG có hàm đó**. Gọi nó chỉ ném AttributeError → 500, và đó
        # đúng là thứ đã khiến đường xoá này nằm chết từ đầu — route có,
        # hàm phía dưới thì không. `save_voices()` ghi lại nguyên
        # `_preset_voices`, nên xoá khỏi dict rồi lưu là đủ.
        del kho[name]

        # Xoá trúng giọng mặc định thì phải chỉ lại chỗ khác. Không thì
        # `default_voice` trong file trỏ vào một cái tên không còn tồn
        # tại, và lần khởi động sau mọi lượt đọc không nêu tên giọng đều
        # hỏng — một quả mìn chỉ nổ sau khi restart, tức là rất lâu sau
        # khi người ta quên mất mình đã xoá gì.
        if getattr(t, "_default_voice", None) == name:
            t._default_voice = next(iter(kho), None)

        t.save_voices(str(VOICES_FILE))
    return {"ok": True, "removed": name, "remaining": len(kho)}

# ─── Đường LUỒNG: đọc tới đâu gửi tới đó ──────────────────────
#
# Đường `/tts` cũ là "nhận việc → hỏi lại": bên gọi phải đợi sinh XONG cả
# đoạn rồi mới nhận được byte đầu tiên. Với robot đang nói thì đó là một
# khoảng trống chết người — đo ngày 12/08/2026: sinh một mẩu 14 giây tiếng
# mất 3,5 giây, và suốt 3,5 giây ấy bo không nhận thêm gì. Đệm của bo cạn,
# DMA lặp lại mẩu cũ, người nghe thành "nói lắp lặp hai từ".
#
# Mọi cách vá quanh nó — tăng đệm, gom câu ngắn hơn, đổ im lặng — chỉ nới
# rộng chỗ đệm quanh cái khoảng trống, không xoá được nó.
#
# `infer_stream()` sinh từng mẩu nhỏ và trả ra ngay. Tiếng bắt đầu chảy
# sau ~0,3 giây và chảy liên tục tới hết. Khoảng trống biến mất hẳn, vì
# RTF 0,19 nghĩa là sinh nhanh gấp năm lần nghe — chỉ cần đừng bắt nó đợi.
#
# ⚠️ Trả về PCM THÔ 16 kHz, KHÔNG phải WAV.
#   - không header ⇒ không cần biết trước độ dài (chính thứ khiến khuôn
#     WAV không stream được, xem chuyện RIFF size 0xFFFFFFFF hôm qua)
#   - đổi mẫu ngay tại đây ⇒ phía Node chuyển tiếp byte thẳng xuống bo,
#     không phải gọi ffmpeg trong đường nóng nữa

BO_SR = 16_000


def _ve_16k(x: np.ndarray) -> bytes:
    """float [-1,1] ở _sr → PCM 16-bit LE mono 16 kHz."""
    x = np.asarray(x, dtype=np.float32).squeeze()
    if x.ndim > 1:
        x = x.mean(axis=1)
    if _sr != BO_SR:
        import librosa
        x = librosa.resample(x, orig_sr=_sr, target_sr=BO_SR, res_type="soxr_hq")
    x = np.clip(x, -1.0, 1.0)
    return (x * 32767.0).astype("<i2").tobytes()


@app.post("/tts-stream")
def tts_stream(payload: Dict[str, Any]):
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(400, "Thiếu văn bản")
    if len(text) > MAX_CHARS:
        raise HTTPException(400, f"Quá {MAX_CHARS} ký tự (đang {len(text)})")

    voice = payload.get("voice") or None
    style = str(payload.get("style") or "tu_nhien")

    def sinh():
        t = engine()
        # ⚠️ Giữ khoá suốt cả luồng. Model này KHÔNG chạy song song được,
        # và hai lượt chồng nhau thì cả hai ra tiếng lẫn lộn — tệ hơn hẳn
        # so với lượt sau phải đợi.
        with _lock:
            t0 = time.time()
            tong = 0
            for mau in t.infer_stream(text=text, voice=voice, style=style):
                b = _ve_16k(mau)
                tong += len(b)
                yield b
            giay = tong / 2 / BO_SR
            ms = (time.time() - t0) * 1000
            print(f"[stream] {giay:.2f}s tieng trong {ms:.0f}ms (RTF {ms/1000/max(giay,0.01):.3f})",
                  flush=True)

    return StreamingResponse(
        sinh(),
        media_type="application/octet-stream",
        headers={"X-Sample-Rate": str(BO_SR), "X-Format": "pcm_s16le_mono"},
    )
