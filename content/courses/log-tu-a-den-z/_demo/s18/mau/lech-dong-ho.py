#!/usr/bin/env python3
"""lech-dong-ho.py <thư mục su-co18> — đo độ lệch đồng hồ của router rt01 bằng CÙNG MỘT sự kiện được hai nguồn ghi:
gói SYN tới cổng 445 của PC-DEV01 (router ghi cổng nguồn SPT=…) và lần đăng nhập SMB hỏng 4625 trên PC-DEV01 (Windows ghi IpPort=…).
Cùng cổng nguồn ⇒ cùng một kết nối. Windows đồng bộ giờ (time.windows.com) nên lấy Windows làm chuẩn."""
import sys, json, re
from datetime import datetime, timedelta, timezone
goc = sys.argv[1]; VN = timezone(timedelta(hours=7))
win = {}
for l in open(f"{goc}/pc-dev01/security.jsonl", encoding="utf-8"):
    e = json.loads(l)
    if e["Id"] == 4625 and e["Data"].get("IpAddress") == "10.8.0.1":
        win[e["Data"]["IpPort"]] = datetime.fromisoformat(e["TimeCreated"][:26] + "+00:00")
lech = []
print("cổng nguồn  router (giờ máy rt01)   Windows 4625 (UTC)          router − Windows")
for l in open(f"{goc}/rt01/logread.txt", encoding="utf-8"):
    m = re.search(r"DST=10\.20\.0\.15 .*SPT=(\d+) DPT=445", l)
    if not m or m[1] not in win: continue
    tr = datetime.strptime(l[4:24], "%b %d %H:%M:%S %Y").replace(tzinfo=VN)
    s = (tr - win[m[1]]).total_seconds(); lech.append(s)
    if len(lech) <= 4: print(f"{m[1]:>10}  {l[:24]}  {win[m[1]]:%Y-%m-%d %H:%M:%S.%f}Z  {s:+8.1f} s")
lech.sort()
print(f"... {len(lech)} cặp khớp; router − Windows từ {lech[0]:+.1f} s tới {lech[-1]:+.1f} s")
# Router chỉ ghi tới GIÂY (cắt phần lẻ, tối đa −1 s) và ghi SYN TRƯỚC khi Windows kịp từ chối (~0,2 s) ⇒ giá trị gần 0 nhất là ước lượng tốt nhất.
print(f"⇒ đồng hồ rt01 CHẬM ≈ {-round(lech[-1])} s: giờ thật = giờ router + {-round(lech[-1])} s, rồi −7 giờ ra UTC")
