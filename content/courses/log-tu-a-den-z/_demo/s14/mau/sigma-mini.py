#!/usr/bin/env python3
"""sigma-mini.py <quy-tắc.json|yml> <tệp sự kiện…> — bộ CHẤM quy tắc Sigma tối giản để HIỂU cách một quy tắc được áp vào log
(không thay pySigma/SIEM thật). Hỗ trợ: trường = giá trị hoặc danh sách (OR), bổ ngữ |contains |startswith |endswith (không phân biệt hoa/thường như Sigma),
khối "keywords" (danh sách chuỗi tìm trong cả dòng), condition dạng: X · X and not Y · 1 of P_* · all of P_* · … and not 1 of P_*.
Sự kiện: tệp .jsonl do evtx-rec in ra (EventID = id, Provider_Name = nguon, Channel = kenh, còn lại trong data) hoặc tệp văn bản (mỗi dòng một sự kiện)."""
import sys, json, re, fnmatch
def nap(p):
    if p.endswith((".yml", ".yaml")):
        import yaml; return yaml.safe_load(open(p, encoding="utf-8"))
    return json.load(open(p, encoding="utf-8"))
R = nap(sys.argv[1]); D = R["detection"]
def lay(ev, k):
    if not isinstance(ev, dict): return None
    if k == "EventID": return ev.get("id")
    if k == "Provider_Name": return ev.get("nguon")
    if k == "Channel": return (ev.get("data") or {}).get("Channel") or ev.get("kenh")  # 104 có UserData/Channel = log BỊ XOÁ — ưu tiên nó
    return (ev.get("data") or {}).get(k)
def khop1(v, mau, bo):
    if v is None: return False
    v, m = str(v).lower(), str(mau).lower()
    if bo == "contains": return m in v
    if bo == "startswith": return v.startswith(m)
    if bo == "endswith": return v.endswith(m)
    return v == m
def khop_map(ev, sel):
    for k, mau in sel.items():
        ten, *bo = k.split("|"); bo = bo[0] if bo else ""
        ds = mau if isinstance(mau, list) else [mau]
        if not any(khop1(lay(ev, ten), m, bo) for m in ds): return False
    return True
def khop_khoi(ev, khoi, dong):
    if isinstance(khoi, list):
        if all(isinstance(x, str) for x in khoi): return any(x.lower() in dong.lower() for x in khoi)   # keywords
        return any(khop_map(ev, x) for x in khoi)                                                      # danh sách map = OR
    return khop_map(ev, khoi)
def danh_gia(cond, ev, dong):
    def ten(m): return [k for k in D if k != "condition" and fnmatch.fnmatch(k, m)]
    def tok(t):
        q = re.fullmatch(r"(1|all) of (\S+)", t)
        if q:
            kq = [khop_khoi(ev, D[k], dong) for k in ten(q[2])]
            return any(kq) if q[1] == "1" else (all(kq) and bool(kq))
        return khop_khoi(ev, D[t], dong)
    for phan_or in re.split(r"\s+or\s+", cond):
        ok = True
        for phan in re.split(r"\s+and\s+", phan_or):
            phu = phan.startswith("not ")
            ok &= (not tok(phan[4:])) if phu else tok(phan)
        if ok: return True
    return False
n = 0
for p in sys.argv[2:]:
    for i, dong in enumerate(open(p, encoding="utf-8", errors="replace"), 1):
        dong = dong.rstrip("\n")
        try: ev = json.loads(dong)
        except ValueError: ev = None
        if danh_gia(D["condition"], ev, dong):
            n += 1
            if n <= 6:
                tom = f"{ev['t'][:19]} {ev.get('may')} {ev['id']} " + " ".join(f"{k}={v}" for k, v in (ev.get('data') or {}).items() if k in ("SubjectUserName", "TargetUserName", "ServiceName", "ImagePath", "Channel", "SubStatus", "Status")) if ev else dong[:120]
                print(f"  KHỚP {p.split('/')[-1]}:{i}  {tom}"[:170])
print(f"{R['title']} [{R.get('level')}] → {n} sự kiện khớp")
