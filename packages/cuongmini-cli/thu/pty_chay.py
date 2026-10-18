# Chạy một lệnh trong pseudo-terminal, gửi phím + ĐỔI CỠ CỬA SỔ theo lịch, ghi toàn bộ đầu ra kèm mốc
# thời gian (để dựng lại màn hình bằng xterm). Dùng cho test hồi quy "khung nhập trùng" (khung.test.ts).
#   python3 pty_chay.py cau-hinh.json
# cau-hinh: { cmd, cwd, env, bo_env, cols, rows, duration, out, keys: [[giây, "chữ"] | [giây, "__resize__", cols, rows]] }
import base64, fcntl, json, os, pty, select, signal, struct, sys, termios, time

cfg = json.load(open(sys.argv[1]))
cols, rows = cfg['cols'], cfg['rows']
env = dict(os.environ)
env.update(cfg.get('env', {}))
# Bỏ biến môi trường (vd. CI, GITHUB_ACTIONS — Ink thấy là tắt hẳn khung động).
for k in cfg.get('bo_env', []):
    env.pop(k, None)
pid, fd = pty.fork()
if pid == 0:
    fcntl.ioctl(0, termios.TIOCSWINSZ, struct.pack('HHHH', rows, cols, 0, 0))
    os.chdir(cfg.get('cwd', '.'))
    os.execvpe(cfg['cmd'][0], cfg['cmd'], env)

keys = sorted(cfg['keys'], key=lambda k: k[0])
su_kien = []  # ["o", giây, base64] | ["r", giây, cols, rows] | ["k", giây theo lịch, giây thật]
start = time.time()
alive = True
# Đợt 6 (lỗi PTY đỏ khi máy quá tải): phím có thể kèm CHỮ PHẢI THẤY TRƯỚC — [giây, "phím", "mẫu regex"]. Phím chỉ gửi
# khi màn hình (chữ đã bỏ mã ANSI, kể từ phím trước) đã có mẫu đó, tối đa `cho_toi_da` giây trễ. Trễ cộng dồn (`lech`)
# đẩy MỌI phím sau và hạn chạy theo ⇒ khoảng cách giữa các bước giữ nguyên, máy chậm không làm lệch kịch bản.
# Ghi ["k", lịch, thật] để phatLai.mjs đổi mốc chụp màn hình theo đúng độ trễ đó.
import re
ANSI = re.compile(r'\x1b\[[0-9;?<>=]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[()][0-9A-Za-z]|\x1b[=>78DEHM]')
cho_toi_da = float(cfg.get('cho_toi_da', 25))
# Thấy chữ rồi vẫn chờ thêm chút như người thật đọc thẻ (thẻ duyệt bỏ phím tới < 350 ms sau khi hiện — chống bấm đúp).
cho_sau = float(cfg.get('cho_sau', 0.6))
lech = 0.0
chu_tu_phim_truoc = ''
thay_luc = None
while time.time() - start < cfg['duration'] + lech:
    now = time.time() - start
    while keys and keys[0][0] + lech <= now:
        k = keys[0]
        if len(k) >= 3 and k[1] != '__resize__' and isinstance(k[2], str) and k[2]:
            if now < k[0] + lech + cho_toi_da:
                if thay_luc is None and re.search(k[2], chu_tu_phim_truoc):
                    thay_luc = now
                if thay_luc is None or now < thay_luc + cho_sau:
                    break
        thay_luc = None
        keys.pop(0)
        lech = max(lech, now - k[0])
        su_kien.append(['k', k[0], round(now, 3)])
        chu_tu_phim_truoc = ''
        if k[1] == '__resize__':
            # Đặt cỡ trên đầu master ⇒ nhân gửi SIGWINCH cho nhóm tiến trình đang chạy ở terminal.
            fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', k[3], k[2], 0, 0))
            su_kien.append(['r', round(now, 3), k[2], k[3]])
        else:
            os.write(fd, k[1].encode('utf-8'))
    r, _, _ = select.select([fd], [], [], 0.03)
    if r:
        try:
            data = os.read(fd, 65536)
        except OSError:
            alive = False
            break
        if not data:
            alive = False
            break
        su_kien.append(['o', round(time.time() - start, 3), base64.b64encode(data).decode()])
        chu_tu_phim_truoc = (chu_tu_phim_truoc + ANSI.sub('', data.decode('utf-8', 'replace')))[-200000:]
try:
    os.kill(pid, signal.SIGKILL)
except ProcessLookupError:
    pass
try:
    os.waitpid(pid, 0)
except ChildProcessError:
    pass
json.dump({'cols': cols, 'rows': rows, 'su_kien': su_kien, 'con_song': alive}, open(cfg['out'], 'w'))
