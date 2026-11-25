# dem.py <tổng> <tệp>... — gom số thứ tự trong các tệp log, báo bao nhiêu dòng mất / trùng
import sys, re
tong = int(open(sys.argv[1]).read()); thay = []
for p in sys.argv[2:]:
    for d in open(p, errors="replace"):
        m = re.search(r"dong (\d+)$", d.strip())
        if m: thay.append(int(m.group(1)))
s = set(thay); mat = [i for i in range(1, tong + 1) if i not in s]
print(f"đã ghi {tong} dòng · thấy {len(thay)} · mất {len(mat)} · trùng {len(thay) - len(s)}" + (f" · mất từ dòng {mat[0]} tới {mat[-1]}" if mat else ""))
