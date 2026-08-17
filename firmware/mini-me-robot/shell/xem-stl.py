#!/usr/bin/env python3
"""
Dựng ảnh xem trước cho các file STL — không cần cài phần mềm CAD.

⚠️ VÌ SAO CÓ FILE NÀY. Ngày 16/08/2026 mất hai ngày vì tin vào thứ
không nhìn thấy được. Vỏ in 3D còn đắt hơn: sai một con số là mất cả
lô nhựa và mấy ngày chờ ship. Nhìn trước một ảnh rẻ hơn nhiều.

Chiếu đẳng cự, sắp xếp theo độ sâu, tô bóng theo pháp tuyến. Không
phải render đẹp — chỉ đủ để thấy CÁI LỖ CÓ ĐÚNG CHỖ KHÔNG.

    python3 xem-stl.py <thư-mục-stl> [thư-mục-ảnh]
"""
import struct, glob, os, sys, math
from PIL import Image, ImageDraw

def doc_stl(p):
    d = open(p, 'rb').read()
    n = struct.unpack('<I', d[80:84])[0]
    tris = []
    for i in range(n):
        o = 84 + i * 50
        v = struct.unpack('<12f', d[o:o+48])
        tris.append(((v[3],v[4],v[5]), (v[6],v[7],v[8]), (v[9],v[10],v[11])))
    return tris

def ve(tris, W=560, H=560, goc=(35, 28)):
    # goc=(quay quanh Z, ngả xuống). (0,90) = nhìn thẳng từ trên xuống,
    # góc đó mới thấy rõ LỖ nằm đâu — thứ quan trọng nhất khi kiểm vỏ.
    ca, sa = math.cos(math.radians(goc[0])), math.sin(math.radians(goc[0]))
    cb, sb = math.cos(math.radians(goc[1])), math.sin(math.radians(goc[1]))
    def chieu(p):
        x, y, z = p
        x1, y1 = x*ca - y*sa, x*sa + y*ca
        return (x1, y1*sb - z*cb, y1*cb + z*sb)   # (màn X, màn Y, độ sâu)

    ps = [[chieu(v) for v in t] for t in tris]
    xs = [v[0] for t in ps for v in t]; ys = [v[1] for t in ps for v in t]
    mx, Mx, my, My = min(xs), max(xs), min(ys), max(ys)
    k = min((W-60)/max(Mx-mx, 1e-6), (H-60)/max(My-my, 1e-6))
    ox, oy = (W - (Mx-mx)*k)/2, (H - (My-my)*k)/2

    img = Image.new('RGB', (W, H), (250, 250, 252))
    dr = ImageDraw.Draw(img)
    # Vẽ mặt xa trước, mặt gần sau — thuật toán hoạ sĩ
    for t in sorted(ps, key=lambda t: sum(v[2] for v in t)/3):
        a, b, c = [((v[0]-mx)*k+ox, H-((v[1]-my)*k+oy)) for v in t]
        # pháp tuyến (chỉ cần hướng để tô bóng)
        u = (b[0]-a[0], b[1]-a[1]); w = (c[0]-a[0], c[1]-a[1])
        z = u[0]*w[1] - u[1]*w[0]
        if abs(z) < 0.4: continue          # cạnh nhìn nghiêng, bỏ
        if goc[1] > 80 and z < 0: continue # nhìn từ trên: bỏ mặt đáy
        s = 0.55 + 0.45 * min(1.0, abs(z) / 900.0)
        col = (int(120*s+70), int(140*s+70), int(170*s+70))
        dr.polygon([a, b, c], fill=col, outline=(60, 70, 85))
    return img

src = sys.argv[1] if len(sys.argv) > 1 else 'stl'
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(src, 'anh')
os.makedirs(out, exist_ok=True)
fs = sorted(glob.glob(os.path.join(src, '*.stl')))
anh = []
for f in fs:
    t = doc_stl(f)
    ten = os.path.splitext(os.path.basename(f))[0]
    # Hai góc: nghiêng để thấy khối, TỪ TRÊN XUỐNG để thấy lỗ.
    a1 = ve(t); a2 = ve(t, goc=(0, 89))
    doi = Image.new('RGB', (1120, 560), (250, 250, 252))
    doi.paste(a1, (0, 0)); doi.paste(a2, (560, 0))
    doi.save(os.path.join(out, ten + '.png'))
    anh.append((ten, doi, len(t)))
    print(f'  {ten:22} {len(t):5} tam giác')

# Bảng liên hệ: tất cả trong một ảnh
C, S = 2, 460
R = (len(anh) + C - 1) // C
sheet = Image.new('RGB', (C*S + 20, R*((S-8)//2+26) + 20), (242, 243, 246))
d = ImageDraw.Draw(sheet)
for i, (ten, im, n) in enumerate(anh):
    x, y = 10 + (i % C)*S, 10 + (i//C)*((S-8)//2+26)
    sheet.paste(im.resize((S-8, (S-8)//2), Image.LANCZOS), (x, y))
    d.text((x+4, y+(S-8)//2+4), ten, fill=(40, 45, 60))
sheet.save(os.path.join(out, '00-tat-ca.png'))
print(f'\n  → {out}/00-tat-ca.png')
