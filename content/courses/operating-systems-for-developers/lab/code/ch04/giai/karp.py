# giai/karp.py — LỜI GIẢI bài tự viết 4.5: từ các lần đo (số lõi, thời gian) suy ra phần TUẦN TỰ thật của chương trình
# (chỉ số Karp–Flatt) rồi dự đoán Amdahl cho máy lớn hơn.
#   python3 karp.py "1:3115 2:1870 4:1171 8:836"        (số lõi:ms — chép từ bảng sweep.sh của bạn)
#   ./sweep.sh "./amdahl {k} 10" 1 2 4 8 | python3 giai/karp.py -     (hoặc đọc thẳng bảng của sweep.sh)
# Karp–Flatt: e = (1/S − 1/n) / (1 − 1/n), S = speedup đo được ở n lõi. e gần như KHÔNG ĐỔI theo n ⇒ đúng là phần tuần
# tự kiểu Amdahl; e TĂNG dần theo n ⇒ có chi phí lớn lên theo số luồng (khoá, băng thông bộ nhớ, lõi không đều…).
import sys
if sys.argv[1] == '-':
    pts = [tuple(map(float, l.split()[:2])) for l in sys.stdin if l.split() and l.split()[0].isdigit()]
else:
    pts = [tuple(map(float, p.split(':'))) for p in sys.argv[1].split()]
t1 = pts[0][1]
print(f"{'cores':>5} {'ms':>7} {'speedup':>8} {'Karp-Flatt e':>13}")
es = []
for n, ms in pts[1:]:
    s = t1 / ms
    e = (1 / s - 1 / n) / (1 - 1 / n)
    es.append(e)
    print(f'{n:5.0f} {ms:7.0f} {s:7.2f}x {e:12.1%}')
e = es[-1]
print(f'serial fraction from the largest run: {e:.1%}  ⇒  Amdahl ceiling 1/e = {1 / e:.1f}x')
for n in (16, 32, 64):
    print(f'  predicted on {n:2d} cores: {1 / (e + (1 - e) / n):5.2f}x')
