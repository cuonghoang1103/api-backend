"""
============================================================
Số liệu máy — CPU, RAM, đĩa, GPU, nhiệt độ
============================================================

Gắn vào dịch vụ TTS ở cổng 8090, KHÔNG dựng cổng riêng: đường hầm ngược
về VPS chỉ chở những cổng ghi trong `permitlisten` của `authorized_keys`
bên đó, mà sửa nó cần người dùng chạy tay. Đi ké cổng sẵn có thì thêm
được cả trang giám sát mà không đụng gì tới mạng.

── Nguyên tắc: KHÔNG BỊA ──

Thứ nào máy không đo được thì trả `None` và nói rõ vì sao, đừng đưa ra
một con số cho đẹp bảng. Một cái ô ghi "không có cảm biến" là thông tin
đúng; một cái ô ghi 45 °C bịa ra thì tệ hơn ô trống nhiều lần — người ta
sẽ tin nó, và tin sai về nhiệt độ máy là kiểu tin sai đắt tiền.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import time
from typing import Any, Dict, List, Optional

_boot = time.time()
_cpu_truoc: Optional[tuple] = None


def _chay(cmd: List[str], han: float = 4.0) -> Optional[str]:
    """Chạy lệnh, trả stdout hoặc None. Không bao giờ ném."""
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=han)
        return r.stdout.strip() if r.returncode == 0 else None
    except Exception:
        return None


def _doc(duong: str) -> Optional[str]:
    try:
        with open(duong) as f:
            return f.read()
    except Exception:
        return None


def cpu() -> Dict[str, Any]:
    """Tên, số nhân, %% dùng, tải trung bình.

    %% dùng tính theo HAI lần đọc `/proc/stat` cách nhau — đọc một lần chỉ
    cho con số trung bình từ lúc khởi động máy, tức gần như không đổi và
    vô dụng để theo dõi.
    """
    global _cpu_truoc
    ten = None
    nhan = 0
    info = _doc("/proc/cpuinfo") or ""
    for d in info.splitlines():
        if d.startswith("model name") and not ten:
            ten = d.split(":", 1)[1].strip()
        if d.startswith("processor"):
            nhan += 1

    phan_tram = None
    st = _doc("/proc/stat") or ""
    dong = next((d for d in st.splitlines() if d.startswith("cpu ")), None)
    if dong:
        v = [int(x) for x in dong.split()[1:]]
        ban, tong = sum(v[:3]) + sum(v[5:]), sum(v)
        if _cpu_truoc:
            d_ban, d_tong = ban - _cpu_truoc[0], tong - _cpu_truoc[1]
            if d_tong > 0:
                phan_tram = round(100.0 * d_ban / d_tong, 1)
        _cpu_truoc = (ban, tong)

    tai = None
    la = _doc("/proc/loadavg")
    if la:
        p = la.split()
        tai = [float(p[0]), float(p[1]), float(p[2])]

    return {"ten": ten, "soNhan": nhan, "phanTram": phan_tram, "tai": tai}


def ram() -> Dict[str, Any]:
    mi = _doc("/proc/meminfo") or ""
    g = {}
    for d in mi.splitlines():
        k, _, v = d.partition(":")
        try:
            g[k] = int(v.strip().split()[0]) * 1024  # kB → byte
        except Exception:
            pass
    tong = g.get("MemTotal")
    # `MemAvailable` mới là con số ĐÚNG cho "còn dùng được bao nhiêu".
    # `MemFree` thấp hơn nhiều vì Linux mượn RAM rảnh làm cache, và nhìn
    # vào nó người ta luôn tưởng máy sắp hết RAM.
    con = g.get("MemAvailable", g.get("MemFree"))
    return {
        "tong": tong,
        "conDung": con,
        "daDung": (tong - con) if (tong and con) else None,
        "swapTong": g.get("SwapTotal"),
        "swapDung": (g.get("SwapTotal", 0) - g.get("SwapFree", 0)) or None,
    }


def dia(duong: str = "/") -> Dict[str, Any]:
    try:
        t, d, c = shutil.disk_usage(duong)
        return {"duong": duong, "tong": t, "daDung": d, "conTrong": c}
    except Exception:
        return {"duong": duong, "tong": None, "daDung": None, "conTrong": None}


def nhiet() -> Dict[str, Any]:
    """Nhiệt CPU và ổ đĩa, đọc từ `sensors`.

    Trả `None` khi máy không có cảm biến — xem ghi chú "KHÔNG BỊA" ở đầu
    file. VPS ảo thường không có `thermal_zone` nào cả.
    """
    ra: Dict[str, Any] = {"cpu": None, "cpuNguong": None, "cpuToiHan": None, "dia": None}
    out = _chay(["sensors"])
    if not out:
        return ra
    for d in out.splitlines():
        low = d.lower()
        if ("package id" in low or "tctl" in low) and ra["cpu"] is None:
            try:
                ra["cpu"] = float(d.split("+")[1].split("°")[0])
                if "high =" in d:
                    ra["cpuNguong"] = float(d.split("high = +")[1].split("°")[0])
                if "crit =" in d:
                    ra["cpuToiHan"] = float(d.split("crit = +")[1].split("°")[0])
            except Exception:
                pass
        elif "composite" in low and ra["dia"] is None:
            try:
                ra["dia"] = float(d.split("+")[1].split("°")[0])
            except Exception:
                pass
    return ra


def gpu() -> List[Dict[str, Any]]:
    """Mọi GPU NVIDIA. Danh sách rỗng nếu máy không có card."""
    out = _chay(
        [
            "nvidia-smi",
            "--query-gpu=name,temperature.gpu,utilization.gpu,memory.used,"
            "memory.total,power.draw,power.limit,fan.speed,clocks.sm,driver_version",
            "--format=csv,noheader,nounits",
        ],
        han=6.0,
    )
    if not out:
        return []
    ds = []
    for d in out.splitlines():
        c = [x.strip() for x in d.split(",")]
        if len(c) < 10:
            continue

        def so(i: int) -> Optional[float]:
            try:
                return float(c[i])
            except Exception:
                return None

        ds.append(
            {
                "ten": c[0],
                "nhiet": so(1),
                "phanTram": so(2),
                "vramDung": (so(3) or 0) * 1024 * 1024,
                "vramTong": (so(4) or 0) * 1024 * 1024,
                "dien": so(5),
                "dienToiDa": so(6),
                "quat": so(7),
                "xungNhip": so(8),
                "driver": c[9],
            }
        )
    return ds


# ─── Điện năng ─────────────────────────────────────────────────
#
# ⚠️ ĐO ĐƯỢC BAO NHIÊU THÌ NÓI BẤY NHIÊU.
#
# GPU có số ĐO THẬT (`nvidia-smi` đọc cảm biến trên card). CPU thì KHÔNG:
# bộ đếm năng lượng Intel RAPL nằm ở `/sys/class/powercap/.../energy_uj`
# nhưng nhân Linux đã khoá quyền đọc cho root từ khi có lỗ bảo mật kênh
# phụ — kiểm ngày 12/08/2026 trên chính máy này: có thư mục, không đọc
# được file.
#
# Nên tổng điện = GPU (đo) + phần còn lại (ƯỚC LƯỢNG). Trả về tách riêng
# hai con số và một cờ `uocLuong` để giao diện nói rõ với người dùng.
# Trộn chung thành một số "chính xác" là nói dối bằng giao diện.
#
# Muốn có số thật cho cả máy thì cắm một ổ đo điện, rồi đặt
# `DIEN_CO_SO_W` cho khớp mức chờ đo được.
DIEN_CO_SO_W = float(os.environ.get("DIEN_CO_SO_W", "40"))   # bo mạch + RAM + NVMe + quạt + hao nguồn
DIEN_CPU_CHO_W = float(os.environ.get("DIEN_CPU_CHO_W", "10"))
DIEN_CPU_TOI_DA_W = float(os.environ.get("DIEN_CPU_TOI_DA_W", "65"))
GIA_DIEN_VND = float(os.environ.get("GIA_DIEN_VND", "3500"))  # mỗi kWh, đổi bằng env
FILE_DIEN = os.path.expanduser(os.environ.get("FILE_DIEN", "~/voice-training/dien.json"))

_dien_lock = __import__("threading").Lock()


def _cong_suat_hien_tai(pt_cpu: Optional[float], gpu_w: Optional[float]) -> Dict[str, Any]:
    cpu_w = DIEN_CPU_CHO_W
    if pt_cpu is not None:
        cpu_w += (DIEN_CPU_TOI_DA_W - DIEN_CPU_CHO_W) * (pt_cpu / 100.0)
    tong = DIEN_CO_SO_W + cpu_w + (gpu_w or 0.0)
    return {
        "tongW": round(tong, 1),
        "gpuW": gpu_w,          # ĐO THẬT
        "cpuW": round(cpu_w, 1),  # ước lượng
        "coSoW": DIEN_CO_SO_W,  # ước lượng
        "uocLuong": True,
        "ghiChu": "GPU đo thật; CPU và phần nền là ước lượng — nhân Linux khoá bộ đếm RAPL.",
    }


def _thang_nay() -> str:
    return time.strftime("%Y-%m")


def gop_dien(w: float, giay: float) -> None:
    """Cộng dồn kWh vào file, theo từng tháng."""
    import json

    with _dien_lock:
        try:
            d = json.load(open(FILE_DIEN)) if os.path.exists(FILE_DIEN) else {}
        except Exception:
            d = {}
        t = _thang_nay()
        d[t] = round(d.get(t, 0.0) + (w * giay) / 3_600_000.0, 6)
        try:
            with open(FILE_DIEN, "w") as f:
                json.dump(d, f)
        except Exception:
            pass


def dien_thang() -> Dict[str, Any]:
    import json

    try:
        d = json.load(open(FILE_DIEN)) if os.path.exists(FILE_DIEN) else {}
    except Exception:
        d = {}
    kwh = float(d.get(_thang_nay(), 0.0))
    return {
        "thang": _thang_nay(),
        "kWh": round(kwh, 3),
        "tienVnd": round(kwh * GIA_DIEN_VND),
        "giaMoiKwh": GIA_DIEN_VND,
        # Nói rõ mốc bắt đầu: nếu dịch vụ mới dựng giữa tháng thì con số
        # này KHÔNG phải cả tháng, và người xem cần biết điều đó.
        "batDauDo": d.get("_batDau"),
    }


def lich_su_bat_tat() -> Dict[str, Any]:
    """Lần khởi động hiện tại và lần TẮT gần nhất trước đó."""
    out = _chay(["last", "-x", "-n", "12", "shutdown", "reboot"]) or ""
    lan_tat = None
    for d in out.splitlines():
        if d.startswith("shutdown"):
            lan_tat = " ".join(d.split()[4:8])
            break
    return {"tatGanNhat": lan_tat}


def dichVu(ten: List[str]) -> Dict[str, str]:
    """Trạng thái các dịch vụ systemd mức người dùng."""
    ra = {}
    for t in ten:
        ra[t] = _chay(["systemctl", "--user", "is-active", t]) or "unknown"
    return ra


def tat_ca() -> Dict[str, Any]:
    up = _doc("/proc/uptime")
    c = cpu()
    gs = gpu()
    return {
        "ten": os.uname().nodename,
        "heDieuHanh": _chay(["sh", "-c", ". /etc/os-release && echo $PRETTY_NAME"]),
        "nhan": os.uname().release,
        "uptimeGiay": float(up.split()[0]) if up else None,
        "cpu": c,
        "ram": ram(),
        "dia": dia(os.path.expanduser("~")),
        "nhiet": nhiet(),
        "gpu": gs,
        "dien": _cong_suat_hien_tai(c.get("phanTram"), gs[0]["dien"] if gs else None),
        "dienThang": dien_thang(),
        "lichSu": lich_su_bat_tat(),
        "dichVu": dichVu(["tts-vieneu", "tts-chatterbox", "tunnel-vps"]),
        "luc": time.time(),
    }


def _vong_do_dien() -> None:
    """Lấy mẫu công suất mỗi 30 giây rồi cộng dồn thành kWh.

    Phải lấy mẫu ĐỀU, không thể tính lúc mở trang: người dùng mở trang
    vài lần một ngày, mà điện thì tiêu liên tục 24/24. Tính theo lần mở
    trang sẽ ra con số nhỏ hơn thực tế hàng chục lần.
    """
    import json

    if not os.path.exists(FILE_DIEN):
        try:
            with open(FILE_DIEN, "w") as f:
                json.dump({"_batDau": time.strftime("%Y-%m-%d %H:%M")}, f)
        except Exception:
            pass
    while True:
        try:
            gs = gpu()
            ct = _cong_suat_hien_tai(cpu().get("phanTram"), gs[0]["dien"] if gs else None)
            gop_dien(ct["tongW"], 30.0)
        except Exception:
            pass
        time.sleep(30)


# Khởi động vòng đo điện ngay khi module được nạp. Daemon nên nó không
# giữ tiến trình sống khi dịch vụ tắt.
try:
    __import__("threading").Thread(target=_vong_do_dien, daemon=True).start()
except Exception as e:  # noqa: BLE001
    print(f"[may] khong bat duoc vong do dien: {e}", flush=True)
