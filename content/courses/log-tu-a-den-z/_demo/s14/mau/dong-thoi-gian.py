#!/usr/bin/env python3
"""dong-thoi-gian.py <thư mục vụ> <dấu hiệu…> — dựng DÒNG THỜI GIAN từ nhiều nguồn: mỗi dòng log khớp một dấu hiệu (IP, tài khoản, khoá auditd…)
được đổi giờ về UTC và in thành một hàng TSV: thời điểm UTC | nguồn | máy | sự kiện | bằng chứng (tệp:dòng). Các hàng giống nhau liền nhau được GỘP (×n)."""
import sys, os, re, json
from datetime import datetime, timezone
GOC, DAU = sys.argv[1], sys.argv[2:]
THANG = {m: i for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(), 1)}
def utc(x): return x.astimezone(timezone.utc)
def doc_rfc(dong):   # 2026-11-19T02:14:01.078999+07:00 web01 sshd[…]: …  (rsyslog RFC 3339)
    t, may, ct = dong.split(" ", 2); return utc(datetime.fromisoformat(t)), may, re.sub(r"\[\d+\]", "", ct)
def doc_nginx(dong):  # 192.0.2.10 - - [19/Nov/2026:02:47:13 +0700] "GET … HTTP/1.1" 200 18874211 …
    m = re.match(r'(\S+) \S+ \S+ \[(\d+)/(\w+)/(\d+):(\d+):(\d+):(\d+) ([+-]\d{4})\] "([^"]*)" (\d+) (\d+)', dong)
    d = datetime.strptime(f"{m[4]}-{THANG[m[3]]:02d}-{m[2]} {m[5]}:{m[6]}:{m[7]} {m[8]}", "%Y-%m-%d %H:%M:%S %z")
    return utc(d), None, f"{m[1]} {m[9].replace(' HTTP/1.1', '')} → {m[10]} ({int(m[11]):,} byte)"
def doc_audit(dong):  # type=… msg=audit(1795029430.649:12764): …  (giây kỷ nguyên Unix — vốn đã là UTC)
    m = re.match(r"type=(\S+) msg=audit\((\d+)\.\d+:\d+\): (.*)", dong)
    return datetime.fromtimestamp(int(m[2]), timezone.utc), None, f"auditd {m[1]} " + " ".join(re.findall(r'(?:key|auid|comm|name|a\d|op|audit_enabled|acct|grp)=("[^"]*"|\S+)', m[3]) and
        re.findall(r'(?<![a-z])(?:key|auid|comm|name|a3|op|audit_enabled|acct|grp)=(?:"[^"]*"|\S+)', m[3]))
def doc_pino(dong):   # {"level":30,"time":1795025445123,…}  (mili giây kỷ nguyên)
    e = json.loads(dong); return datetime.fromtimestamp(e["time"] // 1000, timezone.utc), e["hostname"], f'app {e["msg"]} user={e.get("user")} ip={e.get("ip")} reqId={e["reqId"][:8]}…'
NGUON = [("web01/var/log/auth.log", "auth.log", doc_rfc), ("web01/var/log/syslog", "syslog", doc_rfc), ("logsrv/web01/auth-syslog.log", "logsrv", doc_rfc),
         ("web01/var/log/audit/audit.log", "audit.log", doc_audit), ("web01/var/log/nginx/access.log", "nginx", doc_nginx),
         ("web01/var/log/shop/app.jsonl", "app.jsonl", doc_pino), ("logsrv/canh-bao.log", "canh-bao", doc_rfc)]
cuc_bo = set()
for rel in ("web01/var/log/auth.log", "web01/var/log/syslog"):
    p = os.path.join(GOC, rel)
    if os.path.exists(p): cuc_bo.update(l.rstrip("\n") for l in open(p, encoding="utf-8"))
hang = []
for rel, ten, doc in NGUON:
    p = os.path.join(GOC, rel)
    if not os.path.exists(p): continue
    for i, dong in enumerate(open(p, encoding="utf-8"), 1):
        dong = dong.rstrip("\n")
        if not any(d in dong for d in DAU): continue
        if ten == "logsrv" and dong in cuc_bo: continue          # còn ở máy ⇒ đã có hàng từ tệp cục bộ
        if ten == "logsrv": ten = "logsrv*"                       # * = CHỈ còn ở máy chủ log (trên máy đã mất)
        if ten == "audit.log" and not dong.startswith(("type=SYSCALL", "type=EXECVE", "type=CONFIG", "type=ADD", "type=USER_CMD")): continue
        t, may, sk = doc(dong)
        sk = re.sub(r"\[origin software=\"rsyslogd\"[^\]]*\]", "[rsyslogd]", sk)
        hang.append((t, ten, may or "web01", sk[:110], f"{os.path.basename(rel)}:{i}"))
        ten = {"logsrv*": "logsrv"}.get(ten, ten)
hang.sort(key=lambda h: (h[0], h[1]))
def chuan(x):  # khoá gộp: bỏ tên tài khoản, cổng, request id, chữ số
    x = re.sub(r"(user[= ])(invalid user )?\S+", r"\1*", x); x = re.sub(r"for (?!\*)\S+ from", "for * from", x)
    return re.sub(r"(reqId=\S+|\(\d[\d,]* byte\))", "", re.sub(r"\d", "#", x))
nhom, mo = [], {}
for h in hang:
    k = (h[1], chuan(h[3]))
    if k in mo and (h[0] - nhom[mo[k]][-1][0]).total_seconds() < 900: nhom[mo[k]].append(h); continue
    mo[k] = len(nhom); nhom.append([h])
for ds in sorted(nhom, key=lambda d: (d[0][0], d[0][1])):
    h = ds[0]; them = f"  [×{len(ds)} tới {ds[-1][0]:%H:%M:%S}]" if len(ds) > 1 else ""
    print(f"{h[0]:%Y-%m-%d %H:%M:%SZ}\t{h[1]}\t{h[2]}\t{h[3]}{them}\t{h[4]}")
