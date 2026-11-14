#!/usr/bin/env python3
"""portal.py — trang đăng nhập (captive portal) của "Wi-Fi trường" trong lab (chạy trên nft-gw, quyền root + NET_ADMIN).

  10.20.1.1:80    trang đăng nhập (GET /), POST /login, GET /api (RFC 8908: {"captive": true, …})
  10.20.1.1:8080  nơi gw DNAT MỌI HTTP của SSID đăng ký tới ⇒ 302 về trang đăng nhập
  10.20.1.1:8443  nơi gw DNAT MỌI HTTPS của SSID đăng ký tới ⇒ chứng chỉ của portal.truong.test (sai tên ⇒ trình duyệt báo lỗi)
  10.20.2.1:8081  máy CHƯA đăng ký trên SSID sinh viên ⇒ 302 về trang "thiết bị chưa đăng ký"
  10.20.2.1:80    trang chặn (DNS của trường trỏ tên bị chặn về đây — bài 14.2)

Đăng nhập: hệ thống KHÔNG biết bạn là máy nào ngoài địa chỉ MAC của gói tin vừa tới (đọc từ bảng ARP của gw bằng IP nguồn).
Nó ghi "tài khoản ↔ MAC" rồi mở tường lửa cho MAC đó trên SSID sinh viên. MỖI TÀI KHOẢN MỘT MAC: đăng nhập bằng MAC mới ⇒ gỡ MAC cũ.
"""
import json, ssl, subprocess, threading, time, urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DB = '/run/truong/dang-ky.tsv'
TAI_KHOAN = {'SE12345': 'fpt@2026', 'SE67890': 'fpt@2026', 'SE24680': 'fpt@2026'}
lock = threading.Lock()


def sh(*a):
    return subprocess.run(list(a), capture_output=True, text=True).stdout


def mac_cua(ip):
    for line in sh('ip', 'neigh', 'show', ip).splitlines():
        p = line.split()
        if 'lladdr' in p:
            return p[p.index('lladdr') + 1]
    return None


def doc_db():
    try:
        return dict(l.rstrip('\n').split('\t')[:2] for l in open(DB) if l.strip())
    except FileNotFoundError:
        return {}


def mo(mac, bat):
    op = '-I' if bat else '-D'
    subprocess.run(['iptables', op, 'DADK', '-m', 'mac', '--mac-source', mac, '-j', 'ACCEPT'])
    subprocess.run(['iptables', '-t', 'nat', op, 'DADK_NAT', '-m', 'mac', '--mac-source', mac, '-j', 'RETURN'])


def dang_ky(user, mac):
    with lock:
        db = doc_db()
        cu = db.get(user)
        if cu and cu != mac:
            mo(cu, False)               # một tài khoản — một MAC: MAC cũ mất quyền ngay
        if cu != mac:
            mo(mac, True)
        db[user] = mac
        with open(DB, 'w') as f:
            for u, m in db.items():
                f.write(f'{u}\t{m}\t{time.strftime("%H:%M:%S")}\n')
        return cu


FORM = '''<html><head><title>Wi-Fi TRUONG — dang nhap</title></head><body>
<h1>Dang nhap Wi-Fi truong</h1><p>Nhap tai khoan sinh vien. May ban: IP {ip} · MAC {mac}</p>
<form method="post" action="/login"><input name="user"> <input name="pass" type="password"> <button>Dang nhap</button></form>
</body></html>
'''


class H(BaseHTTPRequestHandler):
    server_version = 'TruongPortal/1.0'
    sys_version = ''

    def log_message(self, fmt, *a):
        print(f'{self.client_address[0]} {self.server.server_address[1]} {fmt % a}', flush=True)

    def gui(self, code, body='', loai='text/html; charset=utf-8', them=None):
        b = body.encode()
        self.send_response(code)
        for k, v in (them or {}).items():
            self.send_header(k, v)
        self.send_header('Content-Type', loai)
        self.send_header('Content-Length', str(len(b)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        cong = self.server.server_address[1]
        ip = self.client_address[0]
        if cong in (8080, 8443):         # bị bắt giữ trên SSID đăng ký
            return self.gui(302, '', them={'Location': 'http://portal.truong.test/'})
        if cong == 8081:                 # SSID sinh viên, MAC chưa đăng ký
            return self.gui(302, '', them={'Location': 'http://10.20.2.1/chua-dang-ky'})
        if self.server.server_address[0] == '10.20.2.1':
            if self.path.startswith('/chua-dang-ky'):
                return self.gui(403, f'Thiet bi chua dang ky. MAC {mac_cua(ip)} khong co trong danh sach. Vao SSID TRUONG-DANGKY de dang nhap.\n', 'text/plain; charset=utf-8')
            return self.gui(403, f'Trang {self.headers.get("Host", "?")} bi chan theo quy dinh cua truong.\n', 'text/plain; charset=utf-8')
        if self.path == '/api':
            return self.gui(200, json.dumps({'captive': True, 'user-portal-url': 'http://portal.truong.test/'}) + '\n', 'application/captive+json')
        return self.gui(200, FORM.format(ip=ip, mac=mac_cua(ip)))

    do_HEAD = do_GET

    def do_POST(self):
        ip = self.client_address[0]
        n = int(self.headers.get('Content-Length', 0))
        f = urllib.parse.parse_qs(self.rfile.read(n).decode())
        user, pw = f.get('user', [''])[0], f.get('pass', [''])[0]
        if TAI_KHOAN.get(user) != pw:
            return self.gui(401, 'Sai tai khoan hoac mat khau.\n', 'text/plain; charset=utf-8')
        mac = mac_cua(ip)
        cu = dang_ky(user, mac)
        thay = f' (thay MAC cu {cu} — may do mat mang)' if cu and cu != mac else ''
        self.gui(200, f'OK {user}: da ghi MAC {mac}{thay}. Gio hay ket noi SSID TRUONG-SV.\n', 'text/plain; charset=utf-8')


def chay(dia_chi, cong, tls=False):
    s = ThreadingHTTPServer((dia_chi, cong), H)
    if tls:
        c = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        c.load_cert_chain('/run/truong/portal/cert.pem', '/run/truong/portal/key.pem')
        s.socket = c.wrap_socket(s.socket, server_side=True)
    threading.Thread(target=s.serve_forever, daemon=True).start()


chay('10.20.1.1', 80)
chay('10.20.1.1', 8080)
chay('10.20.1.1', 8443, tls=True)
chay('10.20.2.1', 8081)
chay('10.20.2.1', 80)
print('portal: nghe 10.20.1.1:80/8080/8443 · 10.20.2.1:80/8081', flush=True)
while True:
    time.sleep(3600)
