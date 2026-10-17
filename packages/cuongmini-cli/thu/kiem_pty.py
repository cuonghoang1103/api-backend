# Đọc bản ghi của chup_pty.py, ghép đầu ra (bỏ mã điều khiển) và kiểm có đủ các chuỗi mong đợi.
#   python3 kiem_pty.py ban-ghi.json "chuỗi 1" "chuỗi 2" …   (mã thoát 1 nếu thiếu)
import base64, json, re, sys
g = json.load(open(sys.argv[1]))
tho = b''.join(base64.b64decode(c[1]) for c in g['chunks']).decode('utf-8', 'replace')
chu = re.sub(r'\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b\][^\x07]*\x07', '', tho)
thieu = [s for s in sys.argv[2:] if s not in chu]
print(f'{len(g["chunks"])} mẩu, {len(chu)} ký tự sau khi bỏ mã điều khiển')
for s in sys.argv[2:]:
    print(('✗ THIẾU ' if s in thieu else '✓ có    ') + s)
sys.exit(1 if thieu else 0)
