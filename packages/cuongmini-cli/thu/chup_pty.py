# Chạy một lệnh trong pseudo-terminal (macOS/Linux) có kích thước cố định, gửi phím theo lịch,
# ghi lại toàn bộ đầu ra kèm mốc thời gian — để chụp màn hình (dựng lại bằng xterm.js) và để
# CI kiểm giao diện tương tác thật sự lên được.  python3 chup_pty.py cau-hinh.json
# Cấu hình: {cols, rows, duration, cwd, cmd:[...], env:{...}, keys:[[giây, "chuỗi"], ...], out}
import base64, fcntl, json, os, pty, select, signal, struct, sys, termios, time
cfg = json.load(open(sys.argv[1]))
cols, rows = cfg['cols'], cfg['rows']
env = dict(os.environ); env.update(cfg.get('env', {}))
pid, fd = pty.fork()
if pid == 0:
    fcntl.ioctl(0, termios.TIOCSWINSZ, struct.pack('HHHH', rows, cols, 0, 0))
    os.chdir(cfg.get('cwd', '.'))
    os.execvpe(cfg['cmd'][0], cfg['cmd'], env)
keys = sorted([(k[0], k[1].encode('utf-8')) for k in cfg['keys']], key=lambda x: x[0])
chunks = []
start = time.time()
alive = True
while time.time() - start < cfg['duration']:
    now = time.time() - start
    while keys and keys[0][0] <= now:
        os.write(fd, keys.pop(0)[1])
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
        chunks.append([round(time.time() - start, 3), base64.b64encode(data).decode()])
try:
    os.kill(pid, signal.SIGKILL)
except ProcessLookupError:
    pass
try:
    os.waitpid(pid, 0)
except ChildProcessError:
    pass
json.dump({'cols': cols, 'rows': rows, 'chunks': chunks}, open(cfg['out'], 'w'))
print('ghi', len(chunks), 'mẩu,', sum(len(base64.b64decode(c[1])) for c in chunks), 'byte, còn sống' if alive else ', tiến trình đã thoát')
