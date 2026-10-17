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
su_kien = []  # ["o", giây, base64] | ["r", giây, cols, rows]
start = time.time()
alive = True
while time.time() - start < cfg['duration']:
    now = time.time() - start
    while keys and keys[0][0] <= now:
        k = keys.pop(0)
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
try:
    os.kill(pid, signal.SIGKILL)
except ProcessLookupError:
    pass
try:
    os.waitpid(pid, 0)
except ChildProcessError:
    pass
json.dump({'cols': cols, 'rows': rows, 'su_kien': su_kien, 'con_song': alive}, open(cfg['out'], 'w'))
