"""
============================================================
Điều khiển máy nhà từ trang admin
============================================================

⚠️⚠️ ĐÂY LÀ ĐƯỜNG TỪ MỘT TRANG WEB CÔNG KHAI VÀO MÁY CÁ NHÂN.

Mọi thứ khác trong dự án này hỏng thì mất một tính năng. Cái này hỏng thì
mất cả cái máy để bàn ở nhà. Nên nó được viết theo luật khác:

── 1. MẶC ĐỊNH TẮT ──

Không có `MAY_NHA_TOKEN` thì mọi endpoint ở đây trả 503. Không phải quên
bật — là CỐ Ý. Một tính năng điều khiển tự bật khi cài đặt là thứ chạy
trên máy người ta mà họ không biết mình đã mở cửa.

── 2. KHÔNG NHẬN LỆNH TỰ DO ──

Chỉ chạy đúng những lệnh viết sẵn trong hai bảng dưới. Không có tham số
nào từ client đi vào shell. Nhận `?cmd=` rồi chạy là biến trang admin
thành một cái shell — mất tài khoản admin là mất luôn máy nhà.

── 3. KHÔNG POWEROFF ──

`reboot` thì có, `poweroff` thì không. Máy tắt rồi thì KHÔNG có đường nào
bật lại từ xa: đường hầm chết theo máy. Một cú bấm nhầm là phải về nhà.
Đây là cái nút mà việc không có nó an toàn hơn nhiều so với có.

── 4. KHOÁ ĐI TRONG HEADER, KHÔNG ĐI TRONG URL ──

URL bị ghi vào log truy cập, log proxy, lịch sử trình duyệt. Khoá nằm
trong đó là khoá đã lộ. (Dự án này còn một món nợ đúng kiểu ấy: khoá
thiết bị của robot vẫn đang nằm trong query string.)
"""
from __future__ import annotations

import hmac
import os
import subprocess
import time
from typing import Dict, List, Optional

from fastapi import APIRouter, Header, HTTPException

router = APIRouter(prefix="/dk")

TOKEN = os.environ.get("MAY_NHA_TOKEN", "")

# Dịch vụ được phép khởi động lại. Tên viết cứng — không ghép chuỗi từ
# tham số, vì "systemctl restart " + <client> là chạy lệnh tuỳ ý.
DICH_VU: Dict[str, List[str]] = {
    "tts-vieneu": ["systemctl", "--user", "restart", "tts-vieneu"],
    "tts-chatterbox": ["systemctl", "--user", "restart", "tts-chatterbox"],
    "tunnel-vps": ["systemctl", "--user", "restart", "tunnel-vps"],
}

# "Console" = một MENU lệnh chẩn đoán, không phải shell. Đủ để soi máy,
# mà không có đường nào chạy thứ ngoài danh sách này.
LENH_XEM: Dict[str, List[str]] = {
    "gpu": ["nvidia-smi"],
    "dia": ["df", "-h"],
    "ram": ["free", "-h"],
    "tai": ["uptime"],
    "tien-trinh": ["sh", "-c", "ps -eo pid,pcpu,pmem,comm --sort=-pcpu | head -15"],
    "mang": ["sh", "-c", "ss -tln | head -20"],
    "nhiet": ["sensors"],
    "trang-thai-tts": ["systemctl", "--user", "status", "tts-vieneu", "--no-pager", "-l"],
    "trang-thai-cb": ["systemctl", "--user", "status", "tts-chatterbox", "--no-pager", "-l"],
    "trang-thai-ham": ["systemctl", "--user", "status", "tunnel-vps", "--no-pager", "-l"],
}


def _kiem_khoa(x_token: Optional[str]) -> None:
    if not TOKEN:
        raise HTTPException(
            503,
            "Điều khiển đang TẮT. Đặt MAY_NHA_TOKEN ở cả máy nhà và VPS rồi khởi động lại dịch vụ.",
        )
    # So sánh theo thời gian hằng số: so bằng `!=` để lộ độ dài khớp qua
    # thời gian trả lời, và đó là đủ để dò từng ký tự.
    if not x_token or not hmac.compare_digest(x_token, TOKEN):
        raise HTTPException(401, "Sai khoá")


def _chay(cmd: List[str], han: float = 15.0) -> str:
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=han)
        return (r.stdout + r.stderr).strip()[:20000]
    except subprocess.TimeoutExpired:
        return f"(quá {han:.0f} giây, đã dừng)"
    except Exception as e:  # noqa: BLE001
        return f"(lỗi: {e})"


@router.get("/menu")
def menu(x_token: Optional[str] = Header(None, alias="X-Token")):
    """Những gì bấm được — để giao diện không phải viết cứng danh sách."""
    _kiem_khoa(x_token)
    return {"dichVu": list(DICH_VU), "lenhXem": list(LENH_XEM), "reboot": True}


@router.get("/xem/{ten}")
def xem(ten: str, x_token: Optional[str] = Header(None, alias="X-Token")):
    _kiem_khoa(x_token)
    if ten not in LENH_XEM:
        raise HTTPException(404, f"Không có mục '{ten}'")
    return {"ten": ten, "ra": _chay(LENH_XEM[ten])}


@router.get("/log/{ten}")
def log(ten: str, dong: int = 200, x_token: Optional[str] = Header(None, alias="X-Token")):
    _kiem_khoa(x_token)
    if ten not in DICH_VU:
        raise HTTPException(404, f"Không có dịch vụ '{ten}'")
    n = max(20, min(1000, dong))
    return {
        "ten": ten,
        "ra": _chay(["journalctl", "--user", "-u", ten, "-n", str(n), "--no-pager"], han=20.0),
    }


@router.post("/restart/{ten}")
def restart(ten: str, x_token: Optional[str] = Header(None, alias="X-Token")):
    _kiem_khoa(x_token)
    if ten not in DICH_VU:
        raise HTTPException(404, f"Không có dịch vụ '{ten}'")
    print(f"[dk] restart {ten} lúc {time.strftime('%H:%M:%S')}", flush=True)
    ra = _chay(DICH_VU[ten])
    time.sleep(1.5)
    tt = _chay(["systemctl", "--user", "is-active", ten])
    return {"ten": ten, "ra": ra, "trangThai": tt}


@router.post("/reboot")
def reboot(xac_nhan: str = "", x_token: Optional[str] = Header(None, alias="X-Token")):
    """Khởi động lại máy. Đòi gõ đúng tên máy để xác nhận.

    Không phải thủ tục rườm rà: đây là nút duy nhất ở đây làm mất kết nối
    thật sự trong vài phút, và nếu máy không lên lại thì phải có người ở
    nhà. Bắt gõ tên máy khiến không thể bấm nhầm.
    """
    _kiem_khoa(x_token)
    ten_may = os.uname().nodename
    if xac_nhan != ten_may:
        raise HTTPException(400, f"Phải gõ đúng tên máy '{ten_may}' để xác nhận")
    print(f"[dk] REBOOT theo yêu cầu lúc {time.strftime('%H:%M:%S')}", flush=True)
    subprocess.Popen(["sudo", "/usr/bin/systemctl", "reboot"])
    return {"ok": True, "ghiChu": "Đang khởi động lại. Máy lên lại sau khoảng 1-2 phút."}
