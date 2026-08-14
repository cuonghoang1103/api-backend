"""
============================================================
F5-TTS — cầu nối tới dịch vụ giọng ở cổng 8092
============================================================

⚠️ THÊM VÀO, KHÔNG THAY THẾ. Hai mươi hai giọng đang có — trong đó bốn
giọng nhân bản người dùng tự tạo (Cuong, Khánh Linh Ver 3, Trang, Trangg
Verr 3) — phải còn nguyên. File này không đụng `voices.json` của VieNeu,
không đụng `engine()`, chỉ nối thêm.

⚠️⚠️ VÌ SAO LÀ CẦU NỐI HTTP CHỨ KHÔNG NẠP MODEL TẠI CHỖ.

Bản đầu `import f5_tts` thẳng trong tiến trình này và chết:

    [tts] F5 hỏng: No module named 'f5_tts'

`app.py` chạy bằng venv `~/voice-training` (VieNeu); F5-TTS cài ở venv
`~/f5-train`. Gộp chúng nghĩa là nhét F5-TTS cùng toàn bộ phụ thuộc vào
đúng cái venv đang phục vụ giọng robot — một lần xung đột phiên bản là
robot mất giọng.

Đây đúng mô hình Chatterbox ở cổng 8091: tiến trình riêng, venv riêng,
gọi qua HTTP nội bộ.

⚠️⚠️⚠️ VÀ ĐÂY LÀ LỖI ĐÁNG NHỚ NHẤT CỦA BẢN ĐẦU.

`san_sang()` bản đầu chỉ kiểm FILE có tồn tại không. File thì đủ cả, nên
nó trả `True`, `/voices` chào ra bảy giọng — và bảy giọng đó không giọng
nào nói được, vì thư viện không import nổi.

Một bộ kiểm không kiểm đúng thứ quyết định thì tệ hơn không có: nó biến
một lỗi ồn ào (thiếu giọng trong danh sách) thành một lỗi im lặng (chọn
giọng xong robot câm). Nay `san_sang()` HỎI THẬT dịch vụ.
"""
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from typing import Dict, List, Optional, Tuple

import numpy as np

F5_URL = os.environ.get("F5_URL", "http://127.0.0.1:8092")
BAT = os.environ.get("F5_ENABLED", "true").lower() == "true"

# Nhớ danh sách giọng trong 60 giây. Hỏi lại mỗi lượt thì mỗi lần mở ô
# chọn giọng là một vòng mạng thừa; nhớ mãi thì thêm giọng mới phải khởi
# động lại cả dịch vụ đọc chữ.
_NHO_GIAY = 60.0
_nho: Optional[List[dict]] = None
_nho_luc = 0.0


def _hoi_voices() -> List[dict]:
    global _nho, _nho_luc
    if _nho is not None and time.time() - _nho_luc < _NHO_GIAY:
        return _nho
    try:
        with urllib.request.urlopen(f"{F5_URL}/voices", timeout=3) as r:
            _nho = json.loads(r.read()).get("voices", [])
    except Exception:
        # Dịch vụ tắt = KHÔNG có giọng nào, chứ không phải giữ danh sách
        # cũ. Giữ lại là chào một thứ đã chết, và người dùng chọn vào thì
        # robot câm.
        _nho = []
    _nho_luc = time.time()
    return _nho


def san_sang() -> bool:
    """Dịch vụ F5 có thật sự trả lời không.

    KHÔNG kiểm bằng cách nhìn file — xem ghi chú đầu file. Kiểm bằng cách
    hỏi nó, và nếu nó không trả lời thì coi như không có.
    """
    return BAT and bool(_hoi_voices())


def la_giong_f5(voice: Optional[str]) -> bool:
    if not voice or not BAT:
        return False
    return any(x.get("id") == voice for x in _hoi_voices())


def danh_sach() -> List[dict]:
    """Cho `/voices`. Rỗng khi dịch vụ tắt — đừng chào thứ không chạy."""
    return list(_hoi_voices()) if BAT else []


def tong_hop(text: str, voice: str) -> Tuple[np.ndarray, int]:
    """Gọi dịch vụ, trả (mẫu float32 [-1,1], tần số lấy mẫu)."""
    than = json.dumps({"text": text, "voice": voice}).encode("utf-8")
    req = urllib.request.Request(
        f"{F5_URL}/noi", data=than, headers={"Content-Type": "application/json"}
    )
    # 300 giây: một đoạn 15 giây mất ~4 giây sinh, nhưng lượt ĐẦU còn phải
    # nạp model (~15 giây), và máy có thể đang bận vì train.
    with urllib.request.urlopen(req, timeout=300) as r:
        b = r.read()
        sr = int(r.headers.get("X-Sample-Rate") or 24000)
    if not b:
        raise RuntimeError("F5 trả về rỗng")
    return np.frombuffer(b, dtype="<i2").astype(np.float32) / 32768.0, sr


def nha_neu_roi() -> bool:
    """Dịch vụ 8092 tự lo việc nhả model. Ở đây không có gì để làm."""
    return False
