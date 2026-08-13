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
from contextlib import contextmanager
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

# Trần số việc /tts đang chạy. Model chỉ sinh MỘT lượt tại một thời điểm
# nên việc thứ tư trở đi chỉ đứng đợi chứ không nhanh hơn — nhận thêm chỉ
# tổ dài hàng và tốn luồng.
MAX_JOBS_CHO = int(os.environ.get("TTS_MAX_JOBS", "3"))

app = FastAPI(title="Voice CuongMini")

# Bộ điều khiển máy nhà. MẶC ĐỊNH TẮT — không có `MAY_NHA_TOKEN` thì mọi
# endpoint của nó trả 503. Xem đầu file `dieukhien.py`.
try:
    from dieukhien import router as _dk_router

    app.include_router(_dk_router)
except Exception as _e:  # noqa: BLE001
    print(f"[tts] khong nap duoc bo dieu khien: {_e}", flush=True)

_tts: Any = None
_lock = threading.Lock()          # model KHÔNG an toàn đa luồng

# ─── Ưu tiên: robot đi trước, web xếp sau ──────────────────────
#
# Chỉ có MỘT khoá mô hình cho cả nhà, và trước 12/08/2026 nó cấp theo kiểu
# ai giành được thì lấy. Hậu quả đo thật trong 30 phút: 23 việc từ trang
# `/voice-mini` và 47 lượt của robot cùng tranh nhau, tiến trình phình lên
# **103 luồng**, và robot chờ quá 20 giây rồi tụt xuống giọng Google. Người
# dùng thấy đúng một câu: "robot mất giọng nhân bản rồi".
#
# Hai loại việc này KHÔNG ngang nhau, và đó mới là điều mã cũ bỏ sót:
#
#   robot  — có người đang đứng im chờ nghe. Chậm 10 giây là hỏng cuộc
#            nói chuyện, không cứu lại được.
#   web    — người ta bấm nút rồi đi làm việc khác. Chậm 10 giây thì
#            thanh tiến độ chạy lâu hơn một chút, thế thôi.
#
# Nên việc web phải NHƯỜNG ĐƯỜNG khi có robot đang chờ. Không phải hàng
# đợi công bằng — công bằng ở đây chính là cái làm hỏng việc.
_cho_uu_tien = 0                  # số lượt robot đang chờ hoặc đang chạy
_dem_lock = threading.Lock()


# ─── Canh gác KẸT KHOÁ ──────────────────────────────────────────
#
# ⚠️ MÁY ĐỌC KẸT KHÔNG BAO GIỜ TỰ BÁO. NÓ CHỈ IM.
#
# Xảy ra thật 13/08/2026: một việc cũ giữ khoá mô hình, mọi lời gọi sau
# xếp hàng vô hạn. `/health` vẫn trả `{"ok":true,"loaded":true}` suốt —
# vì nó KHÔNG cần khoá — nên mọi phép kiểm tự động đều báo xanh trong khi
# robot của người dùng lặng lẽ rơi xuống giọng Google.
#
# Mất mấy giờ mới lần ra, và chỉ lần ra được vì bắt nó SINH TIẾNG THẬT
# thay vì tin `/health`.
#
# Hai việc ở đây, và việc thứ nhất mới là việc chính:
#
#   1. `/health` NÓI THẬT — báo luôn khoá đang bị giữ bao lâu, và tự
#      chuyển `ok: false` khi quá ngưỡng. Một phép kiểm chỉ có giá trị
#      nếu nó biết hỏng.
#   2. Quá hạn thì THOÁT HẲN tiến trình. Không cứu được một phép tính
#      CUDA đang treo từ bên trong Python — nhưng systemd có
#      `Restart=always`, nên thoát là cách sạch nhất để có lại một tiến
#      trình lành. Mất ~10 giây nạp lại, đổi lấy việc không phải chờ
#      người phát hiện.
_giu_tu: float = 0.0          # lúc khoá được cấp, 0 = đang rảnh
_giu_gi: str = ""             # việc gì đang giữ, để log ra cho người đọc
KET_GIAY = float(os.environ.get("TTS_KET_GIAY", "300"))


def dang_giu_bao_lau() -> float:
    """Khoá đang bị giữ bao nhiêu giây. 0 = rảnh."""
    return (time.time() - _giu_tu) if _giu_tu else 0.0


def _canh_ket() -> None:
    while True:
        time.sleep(10)
        giu = dang_giu_bao_lau()
        if KET_GIAY > 0 and giu > KET_GIAY:
            print(
                f"[tts] ⛔ KẸT: khoá bị giữ {giu:.0f}s bởi '{_giu_gi}' "
                f"(trần {KET_GIAY:.0f}s). Thoát để systemd dựng lại.",
                flush=True,
            )
            # `os._exit` chứ không phải `sys.exit`: một luồng đang treo
            # trong CUDA sẽ nuốt mọi ngoại lệ, và tiến trình không bao giờ
            # đóng được đàng hoàng. Đây đúng là ca cần cắt phăng.
            os._exit(1)


threading.Thread(target=_canh_ket, daemon=True).start()


@contextmanager
def khoa_mo_hinh(uu_tien: bool = False, viec: str = "?"):
    """Xin khoá mô hình. `uu_tien=True` cho đường robot.

    Việc thường quay vòng chờ trong lúc còn robot xếp hàng. Ngủ 50 ms mỗi
    vòng chứ không bận-đợi: giữ CPU rảnh cho chính cái model đang sinh
    tiếng, và 50 ms thì tai không nhận ra.
    """
    global _cho_uu_tien
    if uu_tien:
        with _dem_lock:
            _cho_uu_tien += 1
    try:
        while True:
            if not uu_tien and _cho_uu_tien > 0:
                time.sleep(0.05)          # có robot đang chờ → nhường
                continue
            if _lock.acquire(timeout=0.2):
                break
        global _giu_tu, _giu_gi
        _giu_tu = time.time()
        _giu_gi = viec
        try:
            yield
        finally:
            _giu_tu = 0.0
            _giu_gi = ""
            _lock.release()
    finally:
        if uu_tien:
            with _dem_lock:
                _cho_uu_tien -= 1


def dang_ban() -> int:
    """Số lượt robot đang chờ/đang chạy — để chỗ khác biết mà nhường."""
    return _cho_uu_tien


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


# ─── Máy đọc TIẾNG ANH — chuyển tiếp sang tiến trình riêng ─────
#
# Chatterbox chạy ở `chatterbox_en.py`, cổng 8091, venv RIÊNG. Ở đây chỉ
# chuyển tiếp qua loopback.
#
# Vì sao không `import chatterbox` thẳng vào đây cho gọn: hai thư viện
# ghim hai bộ phụ thuộc khác nhau (Chatterbox đòi transformers 5.2.0,
# VieNeu ghim bản riêng, cả hai cùng kéo torch). Gộp venv là đánh cược
# rằng pip hoà giải được — hoà giải hỏng thì mất luôn GIỌNG TIẾNG VIỆT
# đang chạy tốt, để đổi lấy một giọng mới. Tách ra thì hỏng bên nào chỉ
# mất bên đó.
#
# Vì sao vẫn nằm sau cổng 8090: đường hầm về VPS chỉ chở những cổng ghi
# trong `permitlisten`, sửa nó cần người dùng chạy tay. Chuyển tiếp qua
# loopback thì thêm máy đọc mà không đụng gì tới mạng.
CHATTERBOX_URL = os.environ.get("CHATTERBOX_URL", "http://127.0.0.1:8091")
CHATTERBOX_BAT = os.environ.get("CHATTERBOX_ENABLED", "true").lower() == "true"

GIONG_ANH = {
    "en-default": "English — giọng mặc định",
    "en-cham": "English — nói chậm, rõ",
    "en-bieu-cam": "English — nhiều biểu cảm",
}

# Giọng NHÂN BẢN tiếng Anh — hỏi thẳng tiến trình 8091, không viết cứng.
#
# ⚠️ BẢNG VIẾT CỨNG Ở TRÊN KHÔNG BAO GIỜ BIẾT GIỌNG NGƯỜI DÙNG TỰ NHÂN BẢN.
#
# Bản đầu chỉ so với `GIONG_ANH`. Nhân bản giọng robot xong, đặt tên
# `robot-walle`, thì tên đó KHÔNG có trong bảng ⇒ `la_giong_anh` trả
# False ⇒ câu tiếng Anh bị đẩy sang máy đọc TIẾNG VIỆT ⇒ nó không tra
# được tên giọng ⇒ hỏng ⇒ cả chuỗi tụt xuống Google.
#
# Triệu chứng y hệt lỗi "mất giọng nhân bản" vừa chữa sáng nay, và cũng
# y hệt kiểu khó chịu đó: không có lỗi nào ném ra, chỉ có giọng lạ phát
# ra loa. Nên chỗ nào hỏi "giọng này của ai" đều phải hỏi ĐÚNG cái tiến
# trình đang giữ giọng, chứ không hỏi một bản chép.
_giong_anh_cache: Dict[str, float] = {}   # tên giọng → lúc thấy lần cuối
_CACHE_GIAY = 60.0


def _giong_anh_song() -> set:
    """Danh sách giọng tiếng Anh đang có, nhớ tạm 60 giây.

    Nhớ tạm để một lượt nói không phải nhảy thêm một vòng HTTP; 60 giây
    đủ ngắn để nhân bản xong là dùng được gần như ngay.
    """
    import urllib.request
    import json as _json

    gio = time.time()
    con_han = [k for k, v in _giong_anh_cache.items() if gio - v < _CACHE_GIAY]
    if con_han:
        return set(con_han)
    try:
        with urllib.request.urlopen(f"{CHATTERBOX_URL}/voices", timeout=3) as r:
            ds = _json.loads(r.read()).get("voices") or []
        _giong_anh_cache.clear()
        for v in ds:
            _giong_anh_cache[str(v)] = gio
        return set(_giong_anh_cache)
    except Exception as e:  # noqa: BLE001
        # Hỏi không được thì lùi về bảng dựng sẵn — thà thiếu giọng nhân
        # bản còn hơn chặn cả ba giọng vẫn chạy tốt.
        print(f"[tts] khong hoi duoc danh sach giong Anh: {e}", flush=True)
        return set(GIONG_ANH)


def la_giong_anh(voice: Optional[str]) -> bool:
    if not voice:
        return False
    v = str(voice)
    if v in GIONG_ANH:      # đường nhanh, không đụng mạng
        return True
    return CHATTERBOX_BAT and v in _giong_anh_song()


def doc_tieng_anh(text: str, voice: str) -> bytes:
    """Gọi sang tiến trình Chatterbox. Trả PCM 16 kHz."""
    import urllib.request
    import json as _json

    yc = urllib.request.Request(
        f"{CHATTERBOX_URL}/en",
        data=_json.dumps({"text": text, "voice": voice}).encode(),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(yc, timeout=180) as r:
        return r.read()


def to_wav(audio: np.ndarray, sr: int) -> bytes:
    buf = io.BytesIO()
    sf.write(buf, np.asarray(audio, dtype=np.float32), sr, format="WAV", subtype="PCM_16")
    return buf.getvalue()


def reap_jobs() -> None:
    now = time.time()
    for jid in [k for k, v in _jobs.items() if now - v["at"] > JOB_TTL_SEC]:
        _jobs.pop(jid, None)


@app.post("/thu-ket")
def thu_ket(giay: float = 30.0):
    """Giữ khoá `giay` giây để THỬ bộ canh gác. Mặc định TẮT.

    ⚠️ MỘT BỘ CANH GÁC KHÔNG THỬ ĐƯỢC LÀ MỘT BỘ CANH GÁC KHÔNG TIN ĐƯỢC.
    
    Đường cắt chỉ chạy khi hệ thống đã hỏng — tức đúng lúc không ai muốn
    phát hiện ra là nó cũng hỏng nốt. Không có cách ép nó chạy thì mọi
    niềm tin vào nó chỉ là suy luận.

    Thử thật 13/08/2026 bằng một việc dài: việc xong trước ngưỡng nên bộ
    canh gác KHÔNG cắt — đúng, nhưng cũng nghĩa là đường cắt vẫn chưa
    được chứng minh. Đây là chỗ chứng minh nó.

    Khoá sau `TTS_CHO_THU_KET=true`: nó cố tình làm dịch vụ đứng im, và
    một endpoint như thế mà mở sẵn thì chỉ chờ ngày ai đó gọi nhầm.
    """
    if os.environ.get("TTS_CHO_THU_KET", "").lower() != "true":
        raise HTTPException(403, "Đặt TTS_CHO_THU_KET=true mới thử được")
    giay = max(1.0, min(600.0, float(giay)))
    print(f"[tts] THỬ KẸT: giữ khoá {giay:.0f}s", flush=True)
    with khoa_mo_hinh(viec=f"THỬ KẸT {giay:.0f}s"):
        time.sleep(giay)
    return {"ok": True, "daGiu": giay}


@app.get("/may/lich-su")
def may_lich_su():
    """Chuỗi số liệu 24 giờ cho biểu đồ."""
    from may import lich_su

    return {"diem": lich_su()}


@app.get("/may")
def may():
    """Số liệu phần cứng của máy này — cho trang quản trị trên web.

    Đi ké cổng 8090 thay vì dựng cổng riêng: đường hầm về VPS chỉ chở
    những cổng ghi trong `permitlisten`, sửa nó cần người dùng chạy tay.
    """
    from may import tat_ca

    return tat_ca()


@app.get("/health")
def health():
    """⚠️ `/health` PHẢI BIẾT HỎNG, KHÔNG THÌ NÓ CHỈ LÀ MỘT LỜI TRẤN AN.

    Bản trước luôn trả `{"ok": true}` vì nó không đụng tới khoá mô hình.
    Ngày 13/08/2026 máy đọc kẹt cứng: mọi lời gọi xếp hàng vô hạn, robot
    rơi xuống giọng Google — và `/health` vẫn xanh suốt. Mọi phép kiểm
    tự động đều báo ổn trong lúc thứ duy nhất người dùng quan tâm đã
    chết.

    Nay nó báo luôn khoá đang bị giữ bao lâu, và tự lật `ok: false` khi
    quá nửa ngưỡng kẹt — tức KÊU TRƯỚC khi bộ canh gác phải cắt.

    Vẫn KHÔNG gọi `engine()` ở đây: nạp model mất ~38 giây và một
    healthcheck đứng chờ nó thì mọi thứ tưởng dịch vụ chết.
    """
    giu = dang_giu_bao_lau()
    keu = KET_GIAY > 0 and giu > KET_GIAY / 2
    return {
        "ok": not keu,
        "loaded": _tts is not None,
        "giuKhoaGiay": round(giu, 1),
        "dangLam": _giu_gi or None,
        "robotDangCho": dang_ban(),
        "tranKetGiay": KET_GIAY,
    }


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
    ds = [
        {"id": vid, "label": label, "custom": vid not in GIONG_GOC, "lang": "vi"}
        for label, vid in t.list_preset_voices()
    ]
    # Giọng tiếng Anh gộp vào CÙNG danh sách, có nhãn `lang` để phía web
    # tách nhóm. Trả về hai danh sách riêng thì mọi chỗ gọi đều phải nhớ
    # hỏi cả hai — và chỗ nào quên thì im lặng thiếu giọng.
    if CHATTERBOX_BAT:
        ds += [
            {"id": k, "label": v, "custom": False, "lang": "en"}
            for k, v in GIONG_ANH.items()
        ]
        # Giọng tiếng Anh NHÂN BẢN cũng phải hiện ra. Thiếu nó thì người
        # dùng nhân bản xong mở ô chọn không thấy đâu — đúng chuyện đã
        # xảy ra với giọng "Trangg" bên tiếng Việt.
        ds += [
            {"id": v, "label": f"English — {v} (nhân bản)", "custom": True, "lang": "en"}
            for v in sorted(_giong_anh_song() - set(GIONG_ANH))
        ]
    return {"voices": ds}


def run_job(jid: str, text: str, voice: Optional[str], style: str) -> None:
    try:
        # ⚠️ ĐƯỜNG KHÔNG-LUỒNG CŨNG PHẢI BIẾT GIỌNG TIẾNG ANH.
        #
        # 13/08/2026 tôi vá `la_giong_anh` cho `/tts-stream` và tưởng xong.
        # Nhưng đây là đường THỨ HAI, và nó là đường LƯỚI ĐỠ — chạy đúng
        # lúc đường luồng đã hỏng. Bỏ sót thì máy đọc tiếng Việt nhận tên
        # `robot-walle`, trả `HTTP 500 Voice not found`, cả chuỗi rơi tiếp
        # xuống Google, và Google đọc tiếng Anh bằng âm tiếng Việt.
        #
        # Người dùng nghe ra: "nói được một hai câu rồi nhảy về giọng
        # Google tiếng Việt nói tiếng Anh, rất khó hiểu". Log của đường
        # luồng thì SẠCH, vì đường luồng có hỏng đâu — nó chỉ không được
        # gọi tới ở những lượt đó.
        if la_giong_anh(voice):
            if not CHATTERBOX_BAT:
                raise RuntimeError("Máy đọc tiếng Anh đang tắt (CHATTERBOX_ENABLED=false)")
            t0 = time.time()
            b = doc_tieng_anh(text, str(voice))
            x = np.frombuffer(b, dtype="<i2").astype(np.float32) / 32768.0
            dur = len(x) / BO_SR
            _jobs[jid].update(
                state="done",
                wav=to_wav(x, BO_SR),
                seconds=round(dur, 2),
                ms=int((time.time() - t0) * 1000),
                rtf=round((time.time() - t0) / dur, 3) if dur else None,
            )
            print(f"[tts] job Anh: {dur:.2f}s tiếng trong {time.time()-t0:.2f}s", flush=True)
            return

        t = engine()
        t0 = time.time()
        # KHÔNG ưu tiên: người bấm nút trên web đã đi làm việc khác, còn
        # robot thì có người đang đứng chờ nghe.
        with khoa_mo_hinh(viec=f"job web {len(text)} ký tự"):
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

    # ⚠️ TRẦN HÀNG ĐỢI — nhận vô hạn là tự bóp cổ.
    #
    # Mỗi việc đẻ một luồng, tất cả xếp hàng trên cùng khoá mô hình. Đo
    # 12/08/2026: 23 việc dồn lại, tiến trình lên 103 luồng, và người dùng
    # ngồi nhìn thanh tiến trình chạy cho một việc còn cả chục việc đứng
    # trước. Nhận rồi bắt chờ mười phút TỆ HƠN từ chối ngay — từ chối thì
    # người ta biết mà thử lại, còn chờ thì chỉ biết ngồi đoán.
    dang_cho = sum(1 for v in _jobs.values() if v.get("state") == "running")
    if dang_cho >= MAX_JOBS_CHO:
        raise HTTPException(
            429,
            f"Máy đọc đang bận {dang_cho} việc. Chờ xong bớt rồi tạo tiếp "
            f"(mỗi việc mất khoảng số ký tự chia 15 giây).",
        )

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


# Trần cho đoạn dùng rút đặc trưng. Rút mất ~6 giây cho 35 giây tiếng và
# tăng tuyến tính, nên 60 giây là chỗ cân bằng: đủ dài để ổn định, mà
# người dùng vẫn không phải ngồi chờ quá lâu cho một việc làm một lần.
REF_TRAN_GIAY = 60.0


def ghi_giong(t, ten: str, duong_day_du: str, duong_8s: str,
              description: str = "", gender: str = "", style: str = "tu_nhien") -> None:
    """Đăng ký một giọng, lấy đặc trưng từ TRỌN đoạn nhưng mồi từ 8 giây.

    Không dùng `t.add_voice()` vì nó rút CẢ HAI thứ từ cùng một file với
    trần 8 giây cứng, mà hai thứ đó muốn hai độ dài khác nhau:

    **Vector đặc trưng người nói** — càng nhiều tiếng càng ổn định. Đo
    thật ngày 12/08/2026 trên đoạn 40,8 giây (cosine sau khi trừ tâm; hai
    người khác nhau ≈ 0,00):
        hai cửa sổ 8 giây bất kỳ của CÙNG giọng :  0,88 – 0,95
        một cửa sổ 8 giây  ↔ đồng thuận 6 cửa sổ:  0,969
        cả đoạn 40,8 giây  ↔ đồng thuận 6 cửa sổ:  0,993
    Tức bộ mã hoá tự gộp cả đoạn tốt hơn bất kỳ cửa sổ đơn lẻ nào. Đây là
    lý do "nhân bản nghe chưa giống": cửa sổ 8 giây mặc định là một mẫu
    ngẫu nhiên lệch 5-12% so với đồng thuận, và lệch theo hướng nào thì
    tuỳ đoạn thu mở đầu bằng gì.

    **Mã tham chiếu** (mồi âm thanh cho phần sinh) — giữ ở 8 giây. Nó dài
    tuyến tính theo đoạn (8 giây = 1.600 phần tử, 35 giây = 7.072), và mô
    hình được huấn luyện với mồi cỡ 8 giây. Đo thì tốc độ sinh KHÔNG đổi
    (0,83 giây cả hai), nên đây không phải chuyện tốc độ — chỉ là không
    có lý do đưa cho mô hình một thứ khác kích cỡ nó quen, khi ta đã biết
    8 giây kia là 8 giây tốt.
    """
    import numpy as _np

    lam_sach = getattr(t, "_preclean_reference_audio", None)
    day_du = duong_day_du
    if lam_sach:
        try:
            day_du = lam_sach(duong_day_du)
        except Exception:
            day_du = duong_day_du

    dac_trung, _ = t.engine.prepare_reference(
        str(day_du), denoise=True, use_ref_codes=False, max_seconds=REF_TRAN_GIAY)
    _, ma = t.engine.prepare_reference(
        str(duong_8s), denoise=True, use_ref_codes=True)

    t._preset_voices[ten] = {
        "description": description,
        "gender": gender,
        "style": style,
        "speaker_emb": _np.asarray(dac_trung, dtype=_np.float32),
        "codes": None if ma is None else _np.asarray(ma, dtype=_np.int64),
    }
    if not getattr(t, "_default_voice", None):
        t._default_voice = ten

    if lam_sach and str(day_du) != str(duong_day_du):
        Path(str(day_du)).unlink(missing_ok=True)


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
            ghi_giong(t, name.strip(), str(tmp), chon,
                      description=description, gender=gender)
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


def _ve_16k_tu(x: np.ndarray, sr: int) -> bytes:
    """float [-1,1] ở `sr` bất kỳ → PCM 16-bit LE mono 16 kHz.

    ⚠️ PHẢI truyền `sr` thật của máy đọc, đừng dùng biến `_sr` toàn cục.
    VieNeu chạy 48 kHz còn Chatterbox chạy tần số khác; lấy nhầm thì
    KHÔNG có lỗi nào cả — chỉ có giọng ra sai tốc độ và sai cao độ, và
    người nghe tưởng model hỏng chứ không nghĩ tới phép đổi mẫu.
    """
    x = np.asarray(x, dtype=np.float32).squeeze()
    if x.ndim > 1:
        x = x.mean(axis=1)
    if sr != BO_SR:
        import librosa
        x = librosa.resample(x, orig_sr=sr, target_sr=BO_SR, res_type="soxr_hq")
    x = np.clip(x, -1.0, 1.0)
    return (x * 32767.0).astype("<i2").tobytes()


def _ve_16k(x: np.ndarray) -> bytes:
    """Bản tiện dụng cho VieNeu — dùng `_sr` toàn cục của nó."""
    return _ve_16k_tu(x, _sr)


@app.post("/tts-stream")
def tts_stream(payload: Dict[str, Any]):
    text = str(payload.get("text") or "").strip()
    if not text:
        raise HTTPException(400, "Thiếu văn bản")
    if len(text) > MAX_CHARS:
        raise HTTPException(400, f"Quá {MAX_CHARS} ký tự (đang {len(text)})")

    voice = payload.get("voice") or None
    style = str(payload.get("style") or "tu_nhien")

    if la_giong_anh(voice):
        if not CHATTERBOX_BAT:
            raise HTTPException(503, "Máy đọc tiếng Anh đang tắt (CHATTERBOX_ENABLED=false)")

        def sinh_anh():
            t0 = time.time()
            try:
                b = doc_tieng_anh(text, str(voice))
            except Exception as e:
                print(f"[tts] máy đọc tiếng Anh hỏng: {e}", flush=True)
                return
            print(f"[tts] Anh: {len(b)/2/BO_SR:.2f}s tiếng trong {time.time()-t0:.2f}s", flush=True)
            # Chatterbox KHÔNG sinh theo luồng — nó trả cả đoạn một lúc.
            # Vẫn cắt nhỏ khi gửi để phía Node bơm xuống bo đều đặn thay vì
            # dội một khối lớn làm tràn vòng đệm.
            for i in range(0, len(b), 8192):
                yield b[i : i + 8192]

        return StreamingResponse(
            sinh_anh(),
            media_type="application/octet-stream",
            headers={"X-Sample-Rate": str(BO_SR), "X-Format": "pcm_s16le_mono", "X-Engine": "chatterbox"},
        )

    def sinh():
        t = engine()
        # ⚠️ Giữ khoá suốt cả luồng. Model này KHÔNG chạy song song được,
        # và hai lượt chồng nhau thì cả hai ra tiếng lẫn lộn — tệ hơn hẳn
        # so với lượt sau phải đợi.
        with khoa_mo_hinh(uu_tien=True, viec=f"robot {len(text)} ký tự"):
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
