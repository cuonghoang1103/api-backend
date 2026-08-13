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
# Đặc trưng giọng DỰNG SẴN, cất lúc nạp mô hình — xem ghi chú ở `may()`.
_conds_goc: Any = None
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


# ─── Giữ VRAM trong tầm kiểm soát ──────────────────────────────
#
# Card 12 GB này nuôi BA thứ cùng lúc: LLM cục bộ 5,8 GB, máy đọc tiếng
# Việt 0,7 GB, và bộ này. Đo 13/08/2026 lúc chật nhất: còn **441 MiB**
# trống. Hết chỗ thì thứ đổ trước không phải bộ nhẹ nhất mà là bộ nào
# xin thêm trước — nên đây là chuyện của cả máy, không riêng máy đọc.
_lan_cuoi: float = 0.0
_RANH_TAT = float(os.environ.get("CHATTERBOX_IDLE_UNLOAD_SEC", "0") or 0)


def _tra_bo_dem() -> None:
    """Trả phần bộ đệm đã xin nhưng không còn dùng về cho driver.

    ⚠️ ĐÂY LÀ THỨ LÀM `nvidia-smi` NHÌN NHƯ RÒ RỈ BỘ NHỚ.

    Đo thật: bộ này phình từ 3.630 lên 4.576 MiB sau vài chục câu, trong
    khi trọng số trên đĩa chỉ 3.044 MB và trọng số thì KHÔNG tự lớn lên.
    Phần phình là bộ đệm: mỗi câu dài hơn câu trước đòi một khối to hơn,
    PyTorch xin của driver rồi giữ luôn.

    Giữ lại là CÓ LỢI khi card chỉ chạy một thứ — lần sau khỏi hỏi
    driver. Ở đây thì ngược lại: chỗ giữ không dùng tới của bộ này chính
    là chỗ LLM cần lúc trả lời dài.

    Giá phải trả: lần sinh sau phải xin lại driver, đo được vài mili
    giây trên tổng ~2 giây một câu — không đáng kể.
    """
    global _lan_cuoi
    _lan_cuoi = time.time()
    try:
        import torch

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
    except Exception:  # noqa: BLE001
        pass


def _canh_ranh() -> None:
    """Rảnh quá lâu thì NHẢ HẲN mô hình, giành lại trọn 4,5 GB.

    Chỉ bật khi đặt `CHATTERBOX_IDLE_UNLOAD_SEC`. Mặc định TẮT vì cái giá
    rất dễ thấy: nạp lại mất ~20-30 giây, và nó rơi đúng vào câu tiếng
    Anh đầu tiên sau khi rảnh — người dùng sẽ tưởng robot treo.

    Đáng bật khi máy cần chỗ cho việc khác (train, model lớn hơn) và
    tiếng Anh chỉ dùng thỉnh thoảng.
    """
    global _m
    while True:
        time.sleep(30)
        if _RANH_TAT <= 0 or _m is None or _lan_cuoi <= 0:
            continue
        if time.time() - _lan_cuoi < _RANH_TAT:
            continue
        with _nap_lock:
            if _m is None:
                continue
            _m = None
        _tra_bo_dem()
        print(f"[cb] ranh qua {_RANH_TAT:.0f}s — da nha mo hinh, tra lai VRAM", flush=True)


if _RANH_TAT > 0:
    threading.Thread(target=_canh_ranh, daemon=True).start()


def _ha_do_chinh_xac(m) -> None:
    """Hạ trọng số xuống fp16 để lấy lại ~1,7 GB VRAM.

    ⚠️ CHỈ HẠ T3 (thân Llama), KHÔNG ĐỘNG VÀO S3GEN.

    Hai khối này chịu fp16 khác hẳn nhau:

      t3     thân Llama 0,5B, 2.031 MB. Sinh token rời rạc — sai số nhỏ
             cùng lắm đổi một token, và token nào cũng ra tiếng nghe
             được. Đây là khối TO NHẤT nên cũng là khối đáng hạ nhất.

      s3gen  1.008 MB, dùng flow matching + vocoder: tích phân LIÊN TỤC
             qua nhiều bước, sai số mỗi bước cộng dồn. fp16 ở đây hay
             cho ra NaN, và NaN trong âm thanh không kêu "lỗi" — nó
             thành một khoảng IM LẶNG hoặc tiếng rít. Lãi 1 GB không
             đáng đổi lấy một máy đọc thỉnh thoảng câm.

    Đặt `CHATTERBOX_DTYPE=float32` để tắt hẳn nếu tai nghe thấy khác.
    """
    import torch

    kieu = os.environ.get("CHATTERBOX_DTYPE", "float16").lower()
    if kieu in ("float32", "fp32", "off", "none"):
        return
    try:
        m.t3 = m.t3.half()

        # ⚠️ HẠ TRỌNG SỐ MÀ QUÊN VÉC-TƠ ĐIỀU KIỆN LÀ HỎNG NGAY LƯỢT ĐẦU.
        #
        # `t3.inference()` nhân đặc trưng giọng với lớp `cond_enc`. Hạ mỗi
        # trọng số thì phép nhân đó thành `Float × Half`:
        #   RuntimeError: mat1 and mat2 must have the same dtype
        # Không phải lỗi tinh vi — nó chết thẳng ở HTTP 500, đo được
        # 13/08/2026.
        #
        # `T3Cond.to(dtype=)` tự bỏ qua tensor số nguyên (mã token là
        # `long`, ép sang half là phá sạch). Dùng đúng nó, đừng tự đi
        # từng trường.
        def _ha_conds() -> None:
            c = getattr(m, "conds", None)
            if c is not None and getattr(c, "t3", None) is not None:
                c.t3.to(dtype=torch.float16)

        _ha_conds()

        # Nhân bản giọng thì đặc trưng được DỰNG LẠI mỗi lượt gọi, ở
        # fp32. Hạ một lần lúc nạp là không đủ — phải hạ sau mỗi lần
        # dựng, nếu không thì giọng dựng sẵn chạy ngon còn giọng nhân
        # bản chết, mà đó lại đúng là giọng đang dùng.
        goc = m.prepare_conditionals

        def boc(*a, **kw):
            r = goc(*a, **kw)
            _ha_conds()
            return r

        m.prepare_conditionals = boc
        print("[cb] da ha t3 xuong fp16 (s3gen giu fp32)", flush=True)
    except Exception as e:  # noqa: BLE001
        print(f"[cb] khong ha duoc fp16, giu fp32: {e}", flush=True)


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
                _ha_do_chinh_xac(_m)
                # ⚠️ CẤT ĐẶC TRƯNG GỐC LẠI NGAY, TRƯỚC KHI CÓ AI NHÂN BẢN.
                #
                # `generate()` chỉ nạp đặc trưng khi ĐƯỢC TRUYỀN
                # `audio_prompt_path`; không truyền thì nó dùng lại
                # `self.conds` của lần trước:
                #
                #     if audio_prompt_path:
                #         self.prepare_conditionals(...)
                #     else:
                #         assert self.conds is not None
                #
                # Nghĩa là sau MỘT lượt giọng nhân bản, mọi lượt giọng dựng
                # sẵn sau đó đều nói bằng giọng nhân bản đó. Người dùng báo
                # 13/08/2026: "ấn tiếng Anh nó ra giọng robot, ấn robot cũng
                # ra giọng robot, hai cái giống nhau".
                #
                # Không có lỗi nào, không có cảnh báo nào — chỉ có sai giọng.
                global _conds_goc
                try:
                    import copy as _copy

                    _conds_goc = _copy.deepcopy(_m.conds)
                except Exception as e:  # noqa: BLE001
                    print(f"[cb] khong cat duoc dac trung goc: {e}", flush=True)
                _tra_bo_dem()  # bản fp32 vừa bỏ đi còn nằm trong bộ đệm
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


@app.get("/vram")
def vram():
    """Bóc tách VRAM: trọng số bao nhiêu, bộ đệm bao nhiêu.

    ⚠️ `nvidia-smi` KHÔNG phân biệt được hai thứ này, và đó là lý do
    con số nhìn như rò rỉ bộ nhớ.

    PyTorch xin VRAM từ driver theo khối lớn rồi tự chia nhỏ. Xin xong nó
    **giữ luôn**, kể cả khi tensor bên trong đã chết — lần sau cần thì
    khỏi hỏi driver nữa, nhanh hơn nhiều. Với máy đọc thì mỗi câu dài hơn
    câu trước lại đòi một khối to hơn, nên `nvidia-smi` chỉ có tăng, và
    nhìn hệt như rò rỉ.

    `allocated` = tensor đang sống thật. `reserved` = tổng đã xin của
    driver. Hiệu số chính là phần đòi lại được bằng `empty_cache()`.
    """
    import torch

    if not torch.cuda.is_available():
        return {"cuda": False}
    return {
        "cuda": True,
        "daNap": _m is not None,
        "dangDung_MB": round(torch.cuda.memory_allocated() / 2**20),
        "daXinCuaDriver_MB": round(torch.cuda.memory_reserved() / 2**20),
        "doiLaiDuoc_MB": round(
            (torch.cuda.memory_reserved() - torch.cuda.memory_allocated()) / 2**20
        ),
        "dinhCaoDangDung_MB": round(torch.cuda.max_memory_allocated() / 2**20),
        "kieuSo": str(_kieu_so()),
        "ranhGiay": round(time.time() - _lan_cuoi) if _lan_cuoi else None,
    }


def _kieu_so() -> str:
    if _m is None:
        return "chưa nạp"
    try:
        return str(next(_m.t3.parameters()).dtype)
    except Exception:  # noqa: BLE001
        return "?"


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
        # Giọng DỰNG SẴN phải trả đặc trưng về bản gốc trước khi sinh.
        # Không trả thì nó nói bằng giọng nhân bản của lượt trước — xem
        # ghi chú dài ở `may()`.
        if ten in GIONG and _conds_goc is not None:
            import copy as _copy

            m.conds = _copy.deepcopy(_conds_goc)
        wav = m.generate(text, **tham)
        _tra_bo_dem()
    b = ve_16k(wav.squeeze().detach().cpu().numpy(), int(m.sr))
    giay = len(b) / 2 / BO_SR
    print(f"[cb] {ten}: {giay:.2f}s tiếng trong {time.time()-t0:.2f}s", flush=True)

    return Response(
        content=b,
        media_type="application/octet-stream",
        headers={"X-Sample-Rate": str(BO_SR), "X-Audio-Seconds": f"{giay:.2f}"},
    )
