#!/usr/bin/env python3
"""di-chuyen.py <app.jsonl> <geo.csv> — "di chuyển bất khả" (impossible travel): với mỗi tài khoản, so HAI lần đăng nhập thành công liên tiếp;
nếu đổi quốc gia mà tốc độ cần để kịp đi > 900 km/h (máy bay thương mại) thì in ra. Toạ độ: thủ đô/trung tâm dữ liệu của quốc gia trong geo.csv."""
import sys, json, csv, ipaddress, math
from datetime import datetime, timezone
TOA_DO = {"VN": (21.03, 105.85), "US": (39.04, -77.49), "BR": (-23.55, -46.63), "DE": (50.11, 8.68), "NL": (52.37, 4.90)}
mang = [(ipaddress.ip_network(r[0]), r[1]) for r in csv.reader(l for l in open(sys.argv[2], encoding="utf-8") if not l.startswith("#"))]
def nuoc(ip):
    a = ipaddress.ip_address(ip)
    return next((n for m, n in mang if a in m), "??")
def km(a, b):
    (la1, lo1), (la2, lo2) = [tuple(map(math.radians, TOA_DO[x])) for x in (a, b)]
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(h))
truoc = {}
for dong in open(sys.argv[1], encoding="utf-8"):
    e = json.loads(dong)
    if e.get("msg") != "login ok": continue
    t = e["time"] / 1000; n = nuoc(e["ip"]); u = e["user"]
    if u in truoc:
        t0, n0, ip0 = truoc[u]
        if n != n0 and n in TOA_DO and n0 in TOA_DO:
            d = km(n0, n); gio = max(t - t0, 1) / 3600; v = d / gio
            if v > 900:
                f = lambda x: datetime.fromtimestamp(x, timezone.utc).strftime("%m-%d %H:%M:%SZ")
                print(f"{u:18} {f(t0)} {n0} {ip0:15} → {f(t)} {n} {e['ip']:15} | {d:6.0f} km trong {gio * 60:5.1f} phút ⇒ {v:8.0f} km/h")
    truoc[u] = (t, n, e["ip"])
