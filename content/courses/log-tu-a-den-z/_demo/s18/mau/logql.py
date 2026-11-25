#!/usr/bin/env python3
"""logql.py '<truy vấn LogQL>' <từ UTC> <tới UTC> [số dòng] [bước giây] — gọi /loki/api/v1/query_range như Grafana Explore hay logcli làm.
Truy vấn log ⇒ in "thời điểm UTC  {nhãn}  dòng" (cắt 150 ký tự); truy vấn số (count_over_time…) ⇒ in các điểm khác 0."""
import sys, json, urllib.request, urllib.parse
from datetime import datetime, timezone
q, tu, toi = sys.argv[1:4]; n = sys.argv[4] if len(sys.argv) > 4 else "30"; buoc = sys.argv[5] if len(sys.argv) > 5 else "60"
ts = lambda s: str(int(datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp() * 1e9))
u = "http://127.0.0.1:3100/loki/api/v1/query_range?" + urllib.parse.urlencode({"query": q, "start": ts(tu), "end": ts(toi), "limit": n, "direction": "forward", "step": buoc})
kq = json.load(urllib.request.urlopen(u))["data"]
if kq["resultType"] == "streams":
    dong = sorted((int(v[0]), s["stream"], v[1]) for s in kq["result"] for v in s["values"])
    def gon(l):   # chỉ để IN cho gọn: dòng JSON của journal/Windows ⇒ trích vài trường; dòng chữ giữ nguyên
        if not l.startswith("{"): return l
        e = json.loads(l)
        if "MESSAGE" in e: return f'{e["SYSLOG_IDENTIFIER"]}: {e["MESSAGE"]}'
        if "Data" in e: return f'{e["Id"]} ' + " ".join(f"{k}={v}" for k, v in e["Data"].items() if k in ("TargetUserName", "SubStatus", "WorkstationName", "IpAddress", "IpPort", "TargetDomainName"))
        return l
    for t, nh, l in dong:
        l = gon(l)
        print(f'{datetime.fromtimestamp(t / 1e9, timezone.utc):%m-%d %H:%M:%S}Z {nh.get("may")}/{nh.get("nguon")}  {l[:150]}')
    print(f"({len(dong)} dòng)")
else:
    for s in kq["result"]:
        diem = [(int(float(t)), v) for t, v in s["values"] if float(v) > 0]
        print(json.dumps(s["metric"], ensure_ascii=False), " ".join(f"{datetime.fromtimestamp(t, timezone.utc):%H:%M}={v}" for t, v in diem[:12]), f"({len(diem)} điểm ≠ 0)")
