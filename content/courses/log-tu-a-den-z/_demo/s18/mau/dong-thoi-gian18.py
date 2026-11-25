#!/usr/bin/env python3
"""dong-thoi-gian18.py <thư mục su-co18> <lệch rt01 (giây)> <từ UTC> <tới UTC> <dấu hiệu…>
Dòng thời gian ĐA NGUỒN cho vụ Hoa Sen: mọi bản ghi khớp một dấu hiệu (chuỗi con) trong khoảng [từ, tới) được đưa về UTC (sửa lệch router)
và in một hàng TSV: thời điểm UTC | nguồn | máy | sự kiện | bằng chứng (tệp:dòng). Hàng cùng kiểu liền nhau (< 15 phút) được GỘP (×n).
Nguồn journal dùng thay auth.log/syslog (journal là bản đầy đủ); hàng journal nào KHÔNG còn trong auth.log/syslog được đánh dấu "journal!"."""
import sys, re
from datetime import datetime, timezone
from nguon18 import doc_tat_ca
goc, lech, tu, toi, dau = sys.argv[1], int(sys.argv[2]), *[datetime.fromisoformat(x.replace("Z", "+00:00")) for x in sys.argv[3:5]], sys.argv[5:]
van_ban = set()                                   # nội dung còn trong các tệp văn bản của rsyslog
for t, ng, may, ct, vt in doc_tat_ca(goc, lech, bo=("journal", "nginx", "nginx-err", "app", "win", "pg", "rt01")):
    van_ban.add((t.replace(microsecond=0), ct))
hang = []
for t, ng, may, ct, vt in doc_tat_ca(goc, lech, bo=("auth", "syslog")):
    if not (tu <= t < toi) or not any(d in ct for d in dau): continue
    if ng == "journal" and (t.replace(microsecond=0), ct) not in van_ban: ng = "journal!"
    hang.append((t, ng, may, ct[:118], vt))
hang.sort(key=lambda h: h[0])
def chuan(x):   # khoá gộp: bỏ PID, cổng, IP, tên tài khoản bị dò, request id, mọi con số (dòng Accepted giữ nguyên — mỗi lần vào là một mốc)
    if "Accepted" in x: return x
    if "Accepted" not in x: x = re.sub(r"(user|for) (invalid user )?[a-z]+ (from )?(?=\d+\.)", r"\1 * ", x)
    x = re.sub(r"(port \d+|SPT=\d+|ID=\d+|\[\s*[\d.]+\]|reqId=\S+|IpPort=\d+|\[\d+\]|TargetUserName=\S+|SubStatus=\S+|user=\S+$)", "", x)
    return re.sub(r"\d+", "#", x)
nhom, mo = [], {}
for h in hang:
    k = (h[1], chuan(h[3]))
    if k in mo and (h[0] - nhom[mo[k]][-1][0]).total_seconds() < 900: nhom[mo[k]].append(h); continue
    mo[k] = len(nhom); nhom.append([h])
for ds in sorted(nhom, key=lambda d: d[0][0]):
    h = ds[0]; them = f"  [×{len(ds)} tới {ds[-1][0]:%H:%M:%S}]" if len(ds) > 1 else ""
    print(f"{h[0]:%m-%d %H:%M:%S}Z\t{h[1]}\t{h[2]}\t{h[3]}{them}\t{h[4]}")
print(f"# {len(hang)} bản ghi → {len(nhom)} hàng; nguồn: " + ", ".join(f"{n} {sum(1 for x in hang if x[1] == n)}" for n in sorted({x[1] for x in hang})))
