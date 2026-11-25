"""nguon18.py — đọc MỌI nguồn của bộ su-co18 thành một kiểu bản ghi chung: (thời điểm UTC, nguồn, máy, nội dung, tệp:dòng).
Mỗi nguồn ghi giờ một kiểu — hàm doc_* là nơi DUY NHẤT biết kiểu đó. lech_rt01 = số giây đồng hồ router CHẬM (bài 18.2 tự đo ra)."""
import csv, glob, json, os, re
from datetime import datetime, timedelta, timezone
UTC = timezone.utc; VN = timezone(timedelta(hours=7))
THANG = {m: i for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(), 1)}

def doc_rfc(dong):          # 2026-11-21T22:41:07.041995+07:00 vps01 sshd[1334482]: …   (rsyslog RFC 3339, có múi giờ)
    t, may, ct = dong.split(" ", 2); return datetime.fromisoformat(t).astimezone(UTC), may, ct
def doc_journal(dong):      # {"__REALTIME_TIMESTAMP":"1795016467041995",…}   (micro giây kỷ nguyên Unix = UTC)
    e = json.loads(dong); t = datetime.fromtimestamp(int(e["__REALTIME_TIMESTAMP"]) / 1e6, UTC)
    return t, e["_HOSTNAME"], f'{e["SYSLOG_IDENTIFIER"]}{"[" + e["_PID"] + "]" if "_PID" in e else ""}: {e["MESSAGE"]}'
def doc_nginx(dong):        # 198.51.100.77 - - [22/Nov/2026:02:19:12 +0700] "GET … HTTP/1.1" 200 3486215 "-" "curl/8.5.0" rid=… rt=…
    m = re.match(r'(\S+) \S+ \S+ \[(\d+)/(\w+)/(\d+):(\d+):(\d+):(\d+) ([+-]\d{4})\] "([^"]*)" (\d+) (\d+) "[^"]*" "([^"]*)"', dong)
    t = datetime.strptime(f"{m[4]}-{THANG[m[3]]:02d}-{m[2]} {m[5]}:{m[6]}:{m[7]} {m[8]}", "%Y-%m-%d %H:%M:%S %z").astimezone(UTC)
    return t, "vps01", f'{m[1]} {m[9].replace(" HTTP/1.1", "")} → {m[10]} {int(m[11]):,} B "{m[12][:22]}"'
def doc_nginx_err(dong):    # 2026/11/22 02:12:48 [error] …   (giờ ĐỊA PHƯƠNG, KHÔNG ghi múi giờ — phải biết máy đặt +07:00)
    t = datetime.strptime(dong[:19], "%Y/%m/%d %H:%M:%S").replace(tzinfo=VN).astimezone(UTC)
    return t, "vps01", "nginx-error " + re.sub(r'^\S+ \S+ \[(\w+)\] \d+#\d+: \*\d+ ', r"[\1] ", dong)
def doc_docker(dong):       # {"log":"{…pino…}\n","stream":"stdout","time":"2026-11-21T14:48:10.004215617Z"}
    e = json.loads(dong); a = json.loads(e["log"]); t = datetime.fromisoformat(e["time"][:26] + "+00:00")
    url = (a.get("req") or {}).get("url", ""); st = (a.get("res") or {}).get("statusCode", "")
    return t, "tour-api", f'app lv={a["level"]} {a["msg"]} {st} {url} reqId={a["reqId"][:8]}'
def doc_pg(hang):           # csvlog: cột 0 "2026-11-21 19:14:18.360 UTC", 1 user, 4 host:port, 13 message, 22 application_name
    t = datetime.strptime(hang[0], "%Y-%m-%d %H:%M:%S.%f UTC").replace(tzinfo=UTC)
    return t, "tour-db", f'pg {hang[11]} user={hang[1] or "-"} from={hang[4] or "-"} app={hang[22] or "-"}: {hang[13]}'
def doc_rt(dong, lech):     # Sat Nov 21 22:53:33 2026 kern.warn kernel: …   (giờ địa phương của router, KHÔNG múi giờ, đồng hồ có thể lệch)
    t = datetime.strptime(dong[4:24], "%b %d %H:%M:%S %Y").replace(tzinfo=VN) + timedelta(seconds=lech)
    return t.astimezone(UTC), "rt01", re.sub(r"^\S+ \S+ \d+ \S+ \d+ \S+ ", "", dong)
def doc_win(dong):          # {"TimeCreated":"2026-11-21T15:56:30.1930000Z","Id":4625,…,"Data":{…}}   (UTC, chữ Z)
    e = json.loads(dong); d = e["Data"]; t = datetime.fromisoformat(e["TimeCreated"][:26] + "+00:00")
    k = " ".join(f"{x}={d[x]}" for x in ("TargetUserName", "LogonType", "SubStatus", "WorkstationName", "IpAddress", "IpPort", "TargetDomainName") if x in d and d[x] not in ("-", "0x0"))
    return t, "PC-DEV01", f'win {e["Id"]} {k}'

def doc_tat_ca(goc, lech_rt01=0, bo=()):
    """Sinh (t, nguon, may, noi_dung, vi_tri) từ mọi nguồn. bo = tên nguồn bỏ qua."""
    v = lambda *p: os.path.join(goc, *p)
    for ten in ("auth.log.1", "auth.log", "syslog.1", "syslog"):
        if ten.split(".")[0] in bo: continue
        for i, l in enumerate(open(v("vps01/var/log", ten), encoding="utf-8"), 1):
            t, may, ct = doc_rfc(l.rstrip("\n")); yield t, ten.split(".")[0], may, ct, f"{ten}:{i}"
    if "journal" not in bo:
        for i, l in enumerate(open(v("vps01/journal/vps01-journal.json"), encoding="utf-8"), 1):
            t, may, ct = doc_journal(l); yield t, "journal", may, ct, f"journal:{i}"
    for ten, ham, rel in (("nginx", doc_nginx, "vps01/var/log/nginx/access.log"), ("nginx-err", doc_nginx_err, "vps01/var/log/nginx/error.log"),
                          ("app", doc_docker, glob.glob(v("vps01/var/lib/docker/containers/*/*-json.log"))[0]), ("win", doc_win, "pc-dev01/security.jsonl")):
        if ten in bo: continue
        for i, l in enumerate(open(rel if os.path.exists(rel) else v(rel), encoding="utf-8"), 1):
            t, may, ct = ham(l.rstrip("\n")); yield t, ten, may, ct, f"{os.path.basename(rel)[:20]}:{i}"
    if "pg" not in bo:
        for p in sorted(glob.glob(v("vps01/postgresql/log/*.csv"))):
            for i, h in enumerate(csv.reader(open(p, encoding="utf-8")), 1):
                t, may, ct = doc_pg(h); yield t, "pg", may, ct, f"{os.path.basename(p)}:{i}"
    if "rt01" not in bo:
        for i, l in enumerate(open(v("rt01/logread.txt"), encoding="utf-8"), 1):
            t, may, ct = doc_rt(l.rstrip("\n"), lech_rt01); yield t, "rt01", may, ct, f"logread:{i}"
