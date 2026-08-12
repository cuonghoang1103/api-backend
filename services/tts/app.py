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


# VieNeu chỉ nghe 8 giây của đoạn mẫu — `_MAX_REF_SECONDS = 8.0` trong
# `_v3_turbo_engine`, và nó cắt bằng `wav[: 8*sr]`, tức 8 giây ĐẦU.
REF_GIAY = 8.0


def chon_doan_tot_nhat(duong: str, giay: float = REF_GIAY) -> str:
    """Tìm cửa sổ `giay` giây NGHE RÕ NHẤT trong đoạn mẫu, ghi ra file mới.

    Vì sao cần: thư viện lấy 8 giây đầu tiên. Người ta thu 60 giây rồi
    tưởng máy nghe cả 60 — thật ra 52 giây bị vứt, và 8 giây được giữ
    lại là 8 giây tình cờ nằm ở đầu: tiếng hắng giọng, câu nói nhỏ lúc
    chưa vào giọng, hay khoảng lặng. Cả bản sao giọng dựng trên đó.
    Đây là lý do lớn nhất khiến giọng nhân bản "nghe chưa giống".

    Chấm điểm mỗi cửa sổ bằng TÍCH của hai thứ, không phải tổng:
      - tỉ lệ khung có tiếng nói (không phải khoảng lặng)
      - độ lớn trung bình của những khung có tiếng đó
    Dùng tích vì hai thứ này phải cùng đạt: một cửa sổ toàn tiếng nói
    nhưng thì thầm thì vô dụng, mà một cửa sổ có một tiếng hét giữa
    khoảng lặng dài cũng vô dụng. Lấy tổng thì một cái bù cho cái kia
    và chọn ra đúng hai loại tệ đó.

    Trả về đường dẫn file mới; hỏng thì trả lại chính đường dẫn cũ —
    chọn sai đoạn còn hơn là không nhân bản được.
    """
    try:
        import librosa
        import soundfile as sf

        y, sr = librosa.load(duong, sr=None, mono=True)
        can = int(giay * sr)
        if y.size <= can:
            return duong  # ngắn hơn 8 giây thì không có gì để chọn

        hop = max(1, sr // 100)  # khung 10 ms
        rms = librosa.feature.rms(y=y, frame_length=hop * 4, hop_length=hop)[0]
        nguong = max(float(np.percentile(rms, 60)) * 0.5, float(rms.max()) * 0.06)
        khung_can = max(1, can // hop)

        diem_tot, dau_tot = -1.0, 0
        buoc = max(1, khung_can // 32)  # trượt ~1/4 giây một lần
        for i in range(0, len(rms) - khung_can, buoc):
            cua = rms[i : i + khung_can]
            co_tieng = cua >= nguong
            ti_le = float(co_tieng.mean())
            if ti_le <= 0:
                continue
            do_lon = float(cua[co_tieng].mean())
            diem = ti_le * do_lon
            if diem > diem_tot:
                diem_tot, dau_tot = diem, i * hop

        if diem_tot < 0:
            return duong
        ra = str(Path(duong).with_suffix("")) + "-best.wav"
        sf.write(ra, y[dau_tot : dau_tot + can], sr)
        print(f"[ref] chon {dau_tot/sr:.1f}s→{(dau_tot+can)/sr:.1f}s "
              f"trong {y.size/sr:.1f}s (diem {diem_tot:.4f})", flush=True)
        return ra
    except Exception as e:  # noqa: BLE001
        print(f"[ref] khong chon duoc doan tot nhat: {e}", flush=True)
        return duong


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
    chon = None
    try:
        t = engine()
        chon = chon_doan_tot_nhat(str(tmp))
        with _lock:
            t.add_voice(name.strip(), chon, description=description, gender=gender, save=False)
            t.save_voices(str(VOICES_FILE))
        return {"ok": True, "voice": name.strip()}
    except Exception as e:
        raise HTTPException(400, f"Không nhân bản được: {str(e)[:300]}")
    finally:
        tmp.unlink(missing_ok=True)
        # File 8 giây vừa cắt ra cũng phải dọn — /tmp không tự dọn, và
        # mỗi lần nhân bản để lại một file thì đĩa cạn dần một cách âm
        # thầm. `chon` bằng `tmp` khi đoạn mẫu ngắn hơn 8 giây (lúc đó
        # không cắt gì), nên phải so trước khi xoá.
        if chon and chon != str(tmp):
            Path(chon).unlink(missing_ok=True)


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
        if not any(vid == name for _, vid in t.list_preset_voices()):
            raise HTTPException(404, f"Không có giọng '{name}'")

        # `remove_voice(save=False)` gỡ khỏi bộ nhớ VÀ tự chỉ lại
        # `_default_voice` sang giọng khác nếu vừa xoá trúng giọng mặc
        # định. Bỏ qua chuyện đó thì file lưu ra có `default_voice` trỏ
        # vào một cái tên không còn tồn tại — quả mìn chỉ nổ sau lần khởi
        # động kế tiếp, rất lâu sau khi người ta quên đã xoá gì.
        #
        # Lưu bằng `save_voices(VOICES_FILE)` chứ không dùng `save=True`:
        # mặc định của thư viện ghi vào file assets nằm trong site-packages,
        # tức là mất sạch sau mỗi lần cài lại thư viện. VOICES_FILE nằm
        # trong volume nên sống lâu dài.
        t.remove_voice(name, save=False)
        t.save_voices(str(VOICES_FILE))
    return {"ok": True, "removed": name, "remaining": len(t.list_preset_voices())}

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
