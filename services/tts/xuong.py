"""
============================================================
XƯỞNG GIỌNG — thu, kiểm, xuất dữ liệu huấn luyện F5-TTS
============================================================

Gắn vào dịch vụ ở cổng 8090 chứ KHÔNG dựng cổng riêng, cùng lý do đã ghi
ở `may.py`: đường hầm ngược về VPS chỉ chở những cổng có trong
`permitlisten` bên đó, và sửa nó phải có người ngồi trước máy.

── VIỆC CỦA FILE NÀY, VÀ VIỆC KHÔNG PHẢI CỦA NÓ ──

Của nó:   nhận tiếng, ĐO chất lượng, cắt lặng, cất, xuất ra dataset.
KHÔNG:    phiên âm. Khoá Groq nằm ở backend trên VPS và nên nằm yên ở đó
          — thêm một bản sao khoá lên máy cá nhân là thêm một chỗ để mất
          nó, đổi lấy đúng một lần bớt nhảy mạng.

── VÌ SAO PHẢI ĐO CHẤT LƯỢNG NGAY LÚC THU ──

Dữ liệu train hỏng KHÔNG báo lỗi. Nó chỉ làm model kém đi, và ta biết
điều đó sau nhiều giờ train — lúc mà người dùng đã thu xong hết và không
còn muốn thu lại. Một đoạn vỡ tiếng, một đoạn lẫn tiếng quạt, một đoạn
lỡ tay bấm sớm mất nửa chữ đầu: mỗi cái là một liều thuốc độc nhỏ.

Nên mọi phép đo ở đây chạy NGAY khi nhận file, và trả về cho màn hình
thu. Bắt lỗi lúc người ta còn đang ngồi trước mic thì sửa mất mười giây.

⚠️ Và theo đúng bài học `feedback_verify_the_checker_before_the_content`:
bộ kiểm này phải tự chứng minh nó chạy. Mỗi đoạn đều trả về số đo THẬT
(đỉnh, RMS, phần trăm mẫu chạm trần, giây lặng đã cắt) chứ không trả
"đạt/không đạt" — một chữ "đạt" từ bộ kiểm chết trông y hệt một chữ
"đạt" từ bộ kiểm sống.

── VÌ SAO CẤT WAV 24 kHz ──

F5-TTS làm việc ở 24 kHz. Thu ở 48 rồi để nó tự hạ lúc train cũng được,
nhưng như thế mỗi epoch lại hạ lại một lần, và ta mất khả năng NGHE đúng
thứ model sẽ nghe. Hạ ngay lúc nhận thì cái ta bấm nghe lại chính là cái
model học.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import time
import wave
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse

try:
    from kichban import KICH_BAN, tat_ca_cau, tom_tat
except ImportError:  # chạy như module con
    from .kichban import KICH_BAN, tat_ca_cau, tom_tat  # type: ignore

router = APIRouter(prefix="/xuong")

TOKEN = os.environ.get("MAY_NHA_TOKEN", "")

GOC = Path(os.environ.get("XUONG_DIR", str(Path.home() / "f5-train" / "xuong")))
TIENG = GOC / "tieng"
META = GOC / "meta.json"
# Mục và câu do NGƯỜI DÙNG tự thêm — xem `_doc_them`.
THEM = GOC / "them.json"

# F5-TTS làm việc ở 24 kHz — xem ghi chú đầu file.
SR = 24_000

# ── Ngưỡng chất lượng ──
# Các con số này là NGƯỠNG BÁO, không phải ngưỡng CHẶN. Chặn thì người
# dùng mất công thu lại một đoạn có khi vẫn dùng được; báo thì họ tự
# quyết. Bài học từ chính dự án này: bốn hằng số cứng hỏng trong một ngày
# vì chúng không co giãn theo thứ chúng đo.
TOI_THIEU_GIAY = 1.2
TOI_DA_GIAY = 22.0
TRAN_CHAM = 0.995  # mẫu ≥ ngưỡng này coi như chạm trần
CHAM_TOI_DA = 0.20  # % mẫu chạm trần mà vượt là vỡ tiếng
RMS_TOI_THIEU = 0.012  # nhỏ hơn là thu quá nhỏ, tỉ lệ ồn/tiếng xấu


def _kiem_khoa(x_token: Optional[str]) -> None:
    """Cửa vào. Không có khoá thì TẮT HẲN, không phải mở tự do.

    Cùng luật với `dieukhien.py`: đây là đường từ một trang web công khai
    vào máy cá nhân, nên mặc định của nó phải là đóng.
    """
    if not TOKEN:
        raise HTTPException(503, "Chưa đặt MAY_NHA_TOKEN — xưởng đang tắt.")
    if not x_token or not _bang_nhau(x_token, TOKEN):
        raise HTTPException(401, "Sai khoá.")


def _bang_nhau(a: str, b: str) -> bool:
    """So sánh không rò thời gian."""
    import hmac

    return hmac.compare_digest(a.encode(), b.encode())


# ══════════════════════════════════════════════════════════
#  Sổ ghi — meta.json
# ══════════════════════════════════════════════════════════


def _doc_meta() -> Dict[str, Any]:
    try:
        return json.loads(META.read_text("utf-8"))
    except Exception:
        return {}


def _ghi_meta(d: Dict[str, Any]) -> None:
    _ghi_json(META, d)


def _ghi_json(duong: Path, d: Dict[str, Any]) -> None:
    GOC.mkdir(parents=True, exist_ok=True)
    # Ghi qua file tạm rồi đổi tên: mất điện giữa chừng thì mất bản ghi
    # MỚI, không mất cả sổ. Sổ này là thứ duy nhất nối tiếng với chữ —
    # hỏng nó là hỏng toàn bộ công thu.
    tam = duong.with_suffix(duong.suffix + ".tam")
    tam.write_text(json.dumps(d, ensure_ascii=False, indent=1), "utf-8")
    tam.replace(duong)


# ══════════════════════════════════════════════════════════
#  Mục và câu do NGƯỜI DÙNG tự thêm
# ══════════════════════════════════════════════════════════
#
# ⚠️ VÌ SAO PHẢI CÓ, VÀ VÌ SAO KHÔNG PHẢI SỬA `kichban.py`.
#
# Kịch bản dựng sẵn viết bằng tiếng phổ thông, cộng một mục miền Trung
# chỉ gồm phần LÕI CHUNG (mô, tê, răng, rứa, chi, ni, nớ). Nhưng miền
# Trung không phải một giọng: Nghệ Tĩnh nói "nỏ", "chộ", "mần"; Huế nói
# "ưng", "bây chừ"; Quảng Nam lại khác nữa. Người viết kịch bản KHÔNG
# BIẾT người dùng nói kiểu nào — chỉ họ mới biết.
#
# Và đọc một câu không phải giọng mình thì HẠI HƠN LÀ KHÔNG ĐỌC: model
# học ra một giọng lai không giống ai. Nên chỗ này phải mở cho người dùng
# tự viết, không phải chờ sửa mã rồi deploy.
#
# ── Vì sao id có chữ `t`, và vì sao mục có tiền tố `rieng-` ──
#
# Id câu dựng sẵn là `{mục}-{ba chữ số}`. Câu tự thêm là `{mục}-t{số}` —
# có chữ `t` nên KHÔNG BAO GIỜ đụng id dựng sẵn, kể cả khi sau này kịch
# bản gốc thêm câu. Mục tự tạo mang tiền tố `rieng-` vì cùng lý do: khoá
# dựng sẵn hiện có `trung`, mà một tiền tố `t` trơn cộng slug "rung" sẽ
# ra đúng chữ đó.
#
# Đây không phải cẩn thận thừa: id là TÊN FILE WAV trên đĩa. Trùng id là
# một đoạn thu đè lên một đoạn thu khác, im lặng, và người dùng chỉ phát
# hiện khi nghe lại thấy câu này ra tiếng câu kia.


def _doc_them() -> Dict[str, Any]:
    try:
        d = json.loads(THEM.read_text("utf-8"))
        if isinstance(d, dict):
            d.setdefault("muc", [])
            d.setdefault("cau", [])
            d.setdefault("dem", 0)
            return d
    except Exception:
        pass
    return {"muc": [], "cau": [], "dem": 0}


def _khong_dau(s: str) -> str:
    import unicodedata

    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("đ", "d").replace("Đ", "D").lower()
    return "".join(c if c.isalnum() else "-" for c in s).strip("-")[:24] or "muc"


def _muc_day_du() -> List[Dict[str, Any]]:
    """Mục dựng sẵn + mục tự thêm, theo đúng thứ tự hiện trên màn hình."""
    ra = [
        {
            "khoa": m["khoa"], "ten": m["ten"], "dan": m["dan"],
            "lamMau": m["lamMau"], "tuThem": False,
        }
        for m in KICH_BAN
    ]
    for m in _doc_them()["muc"]:
        ra.append({**m, "tuThem": True})
    return ra


def _cau_day_du() -> List[Dict[str, Any]]:
    """Câu dựng sẵn + câu tự thêm, đã gắn thông tin mục."""
    ra = list(tat_ca_cau())
    ban_muc = {m["khoa"]: m for m in _muc_day_du()}
    for c in _doc_them()["cau"]:
        m = ban_muc.get(c.get("muc") or "")
        if not m:
            # Mục đã bị xoá — bỏ qua chứ không ném, để một dòng rác không
            # làm chết cả màn hình thu.
            continue
        ra.append({
            "id": c["id"], "muc": m["khoa"], "tenMuc": m["ten"], "dan": m["dan"],
            "lamMau": m["lamMau"], "chu": c["chu"], "tuThem": True,
        })
    return ra


# ══════════════════════════════════════════════════════════
#  Xử lý tiếng
# ══════════════════════════════════════════════════════════


def _sang_wav_24k(tho: bytes) -> bytes:
    """Bất cứ định dạng gì trình duyệt gửi lên → WAV 24 kHz mono 16-bit.

    Trình duyệt gửi webm/opus (Chrome) hoặc mp4/aac (Safari) — không đoán
    được, nên để ffmpeg tự nhận. `-vn` vì MediaRecorder đôi khi kèm một
    luồng video rỗng, và luồng đó làm hỏng bước đọc mẫu sau này.
    """
    r = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error",
            "-i", "pipe:0", "-vn",
            "-ac", "1", "-ar", str(SR),
            "-c:a", "pcm_s16le", "-f", "wav", "pipe:1",
        ],
        input=tho, capture_output=True, timeout=60,
    )
    if r.returncode != 0 or not r.stdout:
        raise HTTPException(400, f"Không đọc được tiếng: {r.stderr.decode()[:200]}")
    return r.stdout


def _doc_mau(wav: bytes) -> np.ndarray:
    with wave.open(__import__("io").BytesIO(wav), "rb") as w:
        n = w.getnframes()
        raw = w.readframes(n)
    return np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0


def _ghi_wav(duong: Path, mau: np.ndarray) -> None:
    duong.parent.mkdir(parents=True, exist_ok=True)
    i16 = np.clip(mau * 32768.0, -32768, 32767).astype("<i2")
    with wave.open(str(duong), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(i16.tobytes())


def _cat_lang(mau: np.ndarray) -> tuple[np.ndarray, float, float]:
    """Cắt lặng hai đầu, chừa một khoảng đệm ngắn.

    ⚠️ CHỪA ĐỆM, ĐỪNG CẮT SÁT. Cắt sát mép chữ làm mất phần bật hơi của
    phụ âm đầu (p, t, k) và đuôi hơi của nguyên âm cuối — model học được
    một giọng nói cụt hai đầu, và lúc phát ra nghe như bị chém.

    Ngưỡng lấy theo NỀN CỦA CHÍNH ĐOẠN ĐÓ, không phải hằng số: phòng yên
    và phòng có quạt cho hai cái nền khác nhau cả chục lần, mà một ngưỡng
    cứng thì hoặc không cắt gì hoặc ăn mất chữ. Đây đúng bài học đã trả
    giá ở phần hiệu chỉnh mic của robot.
    """
    if mau.size == 0:
        return mau, 0.0, 0.0

    khung = SR // 100  # 10 ms
    so = mau.size // khung
    if so < 3:
        return mau, 0.0, 0.0
    nl = np.sqrt((mau[: so * khung].reshape(so, khung) ** 2).mean(axis=1))

    # Nền = phân vị 10 của năng lượng khung. Dùng phân vị chứ không dùng
    # trung bình vì trung bình bị chính tiếng nói kéo lên.
    nen = float(np.percentile(nl, 10))
    dinh = float(nl.max())
    if dinh <= 0:
        return mau, 0.0, 0.0
    nguong = max(nen * 3.0, dinh * 0.02)

    co = np.where(nl > nguong)[0]
    if co.size == 0:
        return mau, 0.0, 0.0

    dem = 8  # 80 ms đệm mỗi đầu
    d = max(0, int(co[0]) - dem) * khung
    c = min(so, int(co[-1]) + 1 + dem) * khung
    return mau[d:c], d / SR, (mau.size - c) / SR


def _do_chat_luong(mau: np.ndarray) -> Dict[str, Any]:
    """Trả SỐ ĐO, kèm cảnh báo. Không trả 'đạt/không đạt' trống rỗng."""
    if mau.size == 0:
        return {"giay": 0.0, "canhBao": ["Đoạn rỗng."]}

    giay = mau.size / SR
    dinh = float(np.abs(mau).max())
    rms = float(np.sqrt((mau**2).mean()))
    cham = float((np.abs(mau) >= TRAN_CHAM).mean() * 100)

    # Nền tính trên phân vị 10 của các khung 10 ms — cùng cách với hàm cắt.
    khung = SR // 100
    so = mau.size // khung
    nen = 0.0
    if so >= 3:
        nl = np.sqrt((mau[: so * khung].reshape(so, khung) ** 2).mean(axis=1))
        nen = float(np.percentile(nl, 10))
    # dB tiếng trên nền. Đây là con số nói lên "phòng có yên không" rõ hơn
    # mọi thứ khác; dưới ~25 dB là nghe thấy nền trong bản model học được.
    snr = 20 * np.log10(rms / nen) if nen > 1e-9 else 99.0

    cb: List[str] = []
    if giay < TOI_THIEU_GIAY:
        cb.append(f"Quá ngắn ({giay:.1f}s) — F5-TTS bỏ qua đoạn dưới 1 giây.")
    if giay > TOI_DA_GIAY:
        cb.append(f"Quá dài ({giay:.1f}s) — cắt bớt hoặc đọc lại gọn hơn.")
    if cham > CHAM_TOI_DA:
        cb.append(f"VỠ TIẾNG — {cham:.1f}% mẫu chạm trần. Lùi xa mic hoặc hạ gain.")
    if rms < RMS_TOI_THIEU:
        cb.append(f"Thu quá nhỏ (RMS {rms:.3f}) — lại gần mic hơn.")
    if snr < 25:
        cb.append(f"Nền ồn (tiếng hơn nền {snr:.0f} dB) — tắt quạt/điều hoà nếu được.")

    return {
        "giay": round(giay, 2),
        "dinh": round(dinh, 3),
        "rms": round(rms, 4),
        "chamTran": round(cham, 2),
        "snrDb": round(float(snr), 1),
        "canhBao": cb,
    }


# ══════════════════════════════════════════════════════════
#  Đường API
# ══════════════════════════════════════════════════════════


@router.get("/kich-ban")
async def kich_ban(x_token: Optional[str] = Header(None, alias="X-Token")):
    _kiem_khoa(x_token)
    meta = _doc_meta()
    cau = _cau_day_du()
    for c in cau:
        g = meta.get(str(c["id"]))
        c["daThu"] = bool(g)
        if g:
            c["do"] = g.get("do")
            c["chuSua"] = g.get("chuSua")
    tt = dict(tom_tat())
    tt["soCau"] = len(cau)
    tt["soTuThem"] = sum(1 for c in cau if c.get("tuThem"))
    return {"cau": cau, "tomTat": tt, "muc": _muc_day_du()}


@router.get("/tien-do")
async def tien_do(x_token: Optional[str] = Header(None, alias="X-Token")):
    _kiem_khoa(x_token)
    meta = _doc_meta()
    tong_giay = 0.0
    theo_muc: Dict[str, Dict[str, float]] = {}
    dem_cau: Dict[str, int] = {}
    for c in _cau_day_du():
        dem_cau[str(c["muc"])] = dem_cau.get(str(c["muc"]), 0) + 1
    for m in _muc_day_du():
        theo_muc[m["khoa"]] = {
            "ten": m["ten"],
            "xong": 0,
            "tong": dem_cau.get(m["khoa"], 0),
            "giay": 0.0,
            "tuThem": m.get("tuThem", False),
        }
    for k, v in meta.items():
        muc = k.rsplit("-", 1)[0]
        g = float((v.get("do") or {}).get("giay") or 0)
        tong_giay += g
        if muc in theo_muc:
            theo_muc[muc]["xong"] += 1
            theo_muc[muc]["giay"] += g
    for v in theo_muc.values():
        v["giay"] = round(v["giay"], 1)
    return {
        "soDoan": len(meta),
        "tongPhut": round(tong_giay / 60, 1),
        "theoMuc": theo_muc,
        # Mốc thực tế, và mốc "tốt" ĐO TỪ CHÍNH KỊCH BẢN chứ không phải
        # một con số tròn cho đẹp: đọc hết 248 câu ra ~23 phút. Đặt mốc
        # 30 như bản đầu là vẽ ra một cái vạch mà kịch bản này không bao
        # giờ chạm tới — thanh tiến độ đứng mãi ở 78% dù đã làm xong hết.
        "mocToiThieuPhut": 15,
        "mocTotPhut": round(float(tom_tat()["uocPhut"])),
    }


@router.post("/cau/{cid}")
async def luu_cau(cid: str, req: Request, x_token: Optional[str] = Header(None, alias="X-Token")):
    """Nhận tiếng thô + chữ đã sửa, cất lại.

    Chữ đi trong header `X-Chu` dạng base64 chứ không trong query: chữ
    tiếng Việt có dấu trong URL vừa bị ghi vào log vừa hay vỡ mã.
    """
    _kiem_khoa(x_token)
    if not any(c["id"] == cid for c in _cau_day_du()):
        raise HTTPException(404, "Không có câu này trong kịch bản.")

    tho = await req.body()
    if not tho:
        raise HTTPException(400, "Không có dữ liệu tiếng.")

    import base64

    chu_b64 = req.headers.get("X-Chu", "")
    chu = base64.b64decode(chu_b64).decode("utf-8").strip() if chu_b64 else ""
    phien_am = req.headers.get("X-Phien-Am", "") == "1"

    mau = _doc_mau(_sang_wav_24k(tho))
    mau, cat_dau, cat_cuoi = _cat_lang(mau)
    do = _do_chat_luong(mau)
    do["catDauGiay"] = round(cat_dau, 2)
    do["catCuoiGiay"] = round(cat_cuoi, 2)

    _ghi_wav(TIENG / f"{cid}.wav", mau)

    meta = _doc_meta()
    meta[cid] = {
        "chuSua": chu,
        "phienAm": phien_am,
        "do": do,
        "luc": int(time.time()),
    }
    _ghi_meta(meta)
    return {"id": cid, "do": do}


@router.put("/cau/{cid}/chu")
async def sua_chu(cid: str, req: Request, x_token: Optional[str] = Header(None, alias="X-Token")):
    """Sửa lại chữ mà không phải thu lại tiếng."""
    _kiem_khoa(x_token)
    meta = _doc_meta()
    if cid not in meta:
        raise HTTPException(404, "Chưa thu câu này.")
    body = await req.json()
    chu = str(body.get("chu") or "").strip()
    if not chu:
        raise HTTPException(400, "Chữ rỗng.")
    meta[cid]["chuSua"] = chu
    _ghi_meta(meta)
    return {"id": cid, "chu": chu}


@router.delete("/cau/{cid}")
async def xoa_cau(cid: str, x_token: Optional[str] = Header(None, alias="X-Token")):
    _kiem_khoa(x_token)
    meta = _doc_meta()
    meta.pop(cid, None)
    _ghi_meta(meta)
    (TIENG / f"{cid}.wav").unlink(missing_ok=True)
    return {"id": cid, "xoa": True}


@router.get("/am/{cid}.wav")
async def nghe_lai(cid: str, token: str = "", x_token: Optional[str] = Header(None, alias="X-Token")):
    """Nghe lại đoạn đã thu.

    ⚠️ Đây là đường DUY NHẤT nhận khoá qua query, và có lý do: thẻ
    `<audio src>` của trình duyệt không gửi được header. Đổi lại, nó chỉ
    ĐỌC một file wav đã có — không đổi gì, không chạy gì.
    """
    _kiem_khoa(x_token or token or None)
    f = TIENG / f"{cid}.wav"
    if not f.exists():
        raise HTTPException(404, "Chưa có tiếng.")
    return FileResponse(f, media_type="audio/wav")


@router.post("/xuat")
async def xuat(x_token: Optional[str] = Header(None, alias="X-Token")):
    """Dựng dataset F5-TTS từ những gì đã thu.

    Ba bước, và bước nào hỏng cũng phải nói rõ hỏng ở đâu — chứ không
    trả một chữ "lỗi" rồi để người dùng đoán.
    """
    _kiem_khoa(x_token)
    meta = _doc_meta()
    if not meta:
        raise HTTPException(400, "Chưa thu câu nào.")

    ban_do = {c["id"]: c for c in _cau_day_du()}
    xuat_dir = GOC / "xuat"
    wavs = xuat_dir / "wavs"
    if xuat_dir.exists():
        shutil.rmtree(xuat_dir)
    wavs.mkdir(parents=True)

    dong: List[str] = ["audio_file|text"]
    bo_qua: List[Dict[str, str]] = []
    tong_giay = 0.0

    for cid, g in sorted(meta.items()):
        src = TIENG / f"{cid}.wav"
        if not src.exists():
            bo_qua.append({"id": cid, "vi": "mất file wav"})
            continue
        chu = (g.get("chuSua") or "").strip() or str(ban_do.get(cid, {}).get("chu") or "").strip()
        if not chu:
            bo_qua.append({"id": cid, "vi": "chưa có chữ"})
            continue
        giay = float((g.get("do") or {}).get("giay") or 0)
        if giay < 1.0:
            bo_qua.append({"id": cid, "vi": f"ngắn quá ({giay:.1f}s)"})
            continue

        dich = wavs / f"{cid}.wav"
        shutil.copy2(src, dich)
        # ⚠️ Dấu `|` trong chữ sẽ cắt đôi dòng CSV. Đổi thành dấu phẩy —
        # người ta không gõ `|` khi nói, nhưng Whisper thì có thể nhả ra.
        dong.append(f"{dich.resolve()}|{chu.replace('|', ',')}")
        tong_giay += giay

    if len(dong) == 1:
        raise HTTPException(400, f"Không đoạn nào dùng được. Bỏ qua: {bo_qua[:5]}")

    (xuat_dir / "metadata.csv").write_text("\n".join(dong) + "\n", "utf-8")

    return {
        "soDoan": len(dong) - 1,
        "tongPhut": round(tong_giay / 60, 1),
        "boQua": bo_qua,
        "thuMuc": str(xuat_dir),
        # Bước tiếp theo chạy bằng script riêng chứ không gọi ở đây: nó
        # mất vài phút và cần cả GPU, mà một request HTTP treo vài phút
        # là một request sẽ chết giữa đường.
        "buocTiep": "chạy `bash ~/f5-train/chuan-bi.sh` để dựng dataset cho F5-TTS",
    }


@router.post("/them/muc")
async def them_muc(req: Request, x_token: Optional[str] = Header(None, alias="X-Token")):
    """Tạo một mục mới của riêng người dùng."""
    _kiem_khoa(x_token)
    b = await req.json()
    ten = str(b.get("ten") or "").strip()[:60]
    if not ten:
        raise HTTPException(400, "Thiếu tên mục.")
    dan = str(b.get("dan") or "").strip()[:1200] or "Đọc tự nhiên, đúng kiểu bạn vẫn nói."
    lam_mau = bool(b.get("lamMau", True))

    d = _doc_them()
    khoa = f"rieng-{_khong_dau(ten)}"
    # Trùng tên thì thêm số, chứ KHÔNG ghi đè: ghi đè là hai mục dùng
    # chung một dải id, tức hai câu khác nhau cùng một tên file wav.
    da_co = {m["khoa"] for m in d["muc"]} | {m["khoa"] for m in KICH_BAN}
    if khoa in da_co:
        i = 2
        while f"{khoa}-{i}" in da_co:
            i += 1
        khoa = f"{khoa}-{i}"
    d["muc"].append({"khoa": khoa, "ten": ten, "dan": dan, "lamMau": lam_mau})
    _ghi_json(THEM, d)
    return {"khoa": khoa, "ten": ten}


@router.post("/them/cau")
async def them_cau(req: Request, x_token: Optional[str] = Header(None, alias="X-Token")):
    """Thêm một câu vào mục bất kỳ — kể cả mục dựng sẵn."""
    _kiem_khoa(x_token)
    b = await req.json()
    muc = str(b.get("muc") or "").strip()
    chu = str(b.get("chu") or "").strip()[:600]
    if not chu:
        raise HTTPException(400, "Thiếu chữ.")
    if not any(m["khoa"] == muc for m in _muc_day_du()):
        raise HTTPException(404, f"Không có mục '{muc}'.")

    d = _doc_them()
    # Bộ đếm TĂNG MÃI, không dùng lại số đã xoá. Dùng lại là một câu mới
    # nhận đúng id của câu vừa xoá, và nếu file wav cũ chưa kịp xoá thì
    # câu mới thừa hưởng tiếng của câu cũ.
    d["dem"] = int(d.get("dem") or 0) + 1
    cid = f"{muc}-t{d['dem']:03d}"
    d["cau"].append({"id": cid, "muc": muc, "chu": chu})
    _ghi_json(THEM, d)
    return {"id": cid, "muc": muc, "chu": chu}


@router.delete("/them/cau/{cid}")
async def xoa_cau_them(cid: str, x_token: Optional[str] = Header(None, alias="X-Token")):
    _kiem_khoa(x_token)
    d = _doc_them()
    truoc = len(d["cau"])
    d["cau"] = [c for c in d["cau"] if c["id"] != cid]
    if len(d["cau"]) == truoc:
        raise HTTPException(404, "Không phải câu tự thêm.")
    _ghi_json(THEM, d)
    # Xoá luôn tiếng đã thu cho câu đó, nếu có — để lại là rác chiếm đĩa
    # mà không đường nào tới được nữa.
    meta = _doc_meta()
    if meta.pop(cid, None) is not None:
        _ghi_meta(meta)
    (TIENG / f"{cid}.wav").unlink(missing_ok=True)
    return {"id": cid, "xoa": True}


@router.delete("/them/muc/{khoa}")
async def xoa_muc_them(khoa: str, x_token: Optional[str] = Header(None, alias="X-Token")):
    """Xoá cả mục. Chỉ xoá được mục TỰ TẠO, không đụng mục dựng sẵn."""
    _kiem_khoa(x_token)
    d = _doc_them()
    if not any(m["khoa"] == khoa for m in d["muc"]):
        raise HTTPException(404, "Không phải mục tự tạo.")
    con = [c for c in d["cau"] if c["muc"] == khoa]
    d["muc"] = [m for m in d["muc"] if m["khoa"] != khoa]
    d["cau"] = [c for c in d["cau"] if c["muc"] != khoa]
    _ghi_json(THEM, d)
    meta = _doc_meta()
    doi = False
    for c in con:
        if meta.pop(c["id"], None) is not None:
            doi = True
        (TIENG / f"{c['id']}.wav").unlink(missing_ok=True)
    if doi:
        _ghi_meta(meta)
    return {"khoa": khoa, "xoaCau": len(con)}


@router.get("/nen")
async def nen(x_token: Optional[str] = Header(None, alias="X-Token")):
    """Mô hình nền tiếng Việt đã tải xong chưa."""
    _kiem_khoa(x_token)
    thu = Path.home() / "f5-train" / "nen"
    ra = []
    for f in ("hynt_model_last.pt", "hynt_vocab.txt"):
        p = thu / f
        ra.append({"ten": f, "co": p.exists(), "mb": round(p.stat().st_size / 1048576, 1) if p.exists() else 0})
    return {"tep": ra}
