#!/usr/bin/env python3
"""nap-loki.py <thư mục su-co18> <lệch rt01> [địa chỉ Loki] — nạp CẢ bộ su-co18 vào Loki qua HTTP push API (/loki/api/v1/push).
Nhãn ít và ổn định: may (vps01, tour-api, tour-db, rt01, PC-DEV01) + nguon (journal, nginx, app, pg, rt01, win…). Dòng giữ NGUYÊN VĂN gốc;
thời điểm của mỗi dòng là thời điểm UTC đã chuẩn hoá (router đã cộng độ lệch) — đây chính là việc "chuẩn hoá thời gian khi nạp"."""
import sys, json, glob, os, csv, urllib.request, urllib.parse
from collections import defaultdict
from nguon18 import doc_tat_ca
goc, lech = sys.argv[1], int(sys.argv[2]); url = (sys.argv[3] if len(sys.argv) > 3 else "http://127.0.0.1:3100") + "/loki/api/v1/push"
goc_dong = {}   # dòng gốc nguyên văn theo vị trí — để Loki giữ đúng chữ của bằng chứng
for ten, rel in (("auth.log.1", "vps01/var/log/auth.log.1"), ("auth.log", "vps01/var/log/auth.log"), ("syslog.1", "vps01/var/log/syslog.1"),
                 ("syslog", "vps01/var/log/syslog"), ("journal", "vps01/journal/vps01-journal.json"), ("access.log", "vps01/var/log/nginx/access.log"),
                 ("error.log", "vps01/var/log/nginx/error.log"), ("security.jsonl", "pc-dev01/security.jsonl"), ("logread", "rt01/logread.txt"),
                 (os.path.basename(glob.glob(f"{goc}/vps01/var/lib/docker/containers/*/*-json.log")[0])[:20], glob.glob(f"{goc}/vps01/var/lib/docker/containers/*/*-json.log")[0])):
    p = rel if os.path.exists(rel) else f"{goc}/{rel}"
    for i, l in enumerate(open(p, encoding="utf-8"), 1): goc_dong[f"{ten}:{i}"] = l.rstrip("\n")
for p in glob.glob(f"{goc}/vps01/postgresql/log/*.csv"):
    for i, l in enumerate(open(p, encoding="utf-8"), 1): goc_dong[f"{os.path.basename(p)}:{i}"] = l.rstrip("\n")
luong = defaultdict(list)
for t, ng, may, ct, vt in doc_tat_ca(goc, lech, bo=("auth", "syslog")):   # journal đã chứa mọi dòng của auth.log/syslog
    luong[(may, ng)].append([str(int(t.timestamp() * 1e9)), goc_dong[vt]])
tong = 0
for (may, ng), vs in sorted(luong.items()):
    vs.sort(key=lambda v: int(v[0]))
    for i in range(0, len(vs), 2000):
        body = json.dumps({"streams": [{"stream": {"may": may, "nguon": ng, "vu": "su-co18"}, "values": vs[i:i + 2000]}]}).encode()
        rq = urllib.request.Request(url, body, {"Content-Type": "application/json"}); urllib.request.urlopen(rq).read()
    tong += len(vs); print(f"  {{may=\"{may}\", nguon=\"{ng}\"}}  {len(vs):>6} dòng")
print(f"đã nạp {tong} dòng vào {len(luong)} luồng")
# Querier chỉ hỏi ingester cho 3 giờ gần nhất (querier.query_ingesters_within mặc định 3h); dòng CŨ hơn thế chỉ được tìm trong kho.
# Bằng chứng của ta cũ vài ngày ⇒ phải đẩy chunk từ bộ nhớ ingester xuống kho (POST /flush) rồi mới hỏi được.
import time
urllib.request.urlopen(urllib.request.Request(url.replace("/loki/api/v1/push", "/flush"), method="POST")).read()
for _ in range(60):
    q = url.replace("/push", "/query?") + "query=" + urllib.parse.quote('count_over_time({vu="su-co18"}[30d])') + f"&time={int(time.time())}"
    if json.load(urllib.request.urlopen(q))["data"]["result"]: print("đã đẩy xuống kho (POST /flush) — hỏi được"); break
    time.sleep(2)
