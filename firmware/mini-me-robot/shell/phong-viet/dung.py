#!/usr/bin/env python3
"""
Sinh `src/phong_viet.h` — font tiếng Việt CÓ DẤU cho dải dưới màn ngực.

    python3 shell/phong-viet/dung.py

Vì sao tự sinh: font sẵn của Arduino_GFX chỉ có ASCII (nên nhãn cũ ghi
"DANG NGHE"), còn bản Unifont UTF-8 của thư viện nặng 2,25 MB vì chở cả
57.389 chữ. Ở đây chỉ lấy đúng ~240 chữ cần: ASCII + mọi chữ cái tiếng
Việt + vài dấu câu, khử răng cưa 16 mức xám — khoảng 30 KB.

Font: Be Vietnam Pro (SIL OFL 1.1) — lấy từ gói `@fontsource/be-vietnam-pro`
mà frontend đã cài sẵn (`frontend/node_modules`). OFL cho phép nhúng vào
phần mềm; giữ dòng bản quyền trong file sinh ra.
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

GOC = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(GOC, '..', '..', '..', '..'))
FONT_DIR = os.path.join(REPO, 'frontend/node_modules/@fontsource/be-vietnam-pro/files')
RA = os.path.abspath(os.path.join(GOC, '..', '..', 'src', 'phong_viet.h'))

CO = 21          # cỡ chữ (px, em)
DAM = 600        # SemiBold: đủ đậm để đọc từ xa trên nền đen, chưa thô

# Bảng mã con của fontsource: chữ riêng tiếng Việt nằm ở file "vietnamese",
# còn lại ở "latin". Chọn file theo dải mã — file nào không có chữ thì
# vẽ ra ô rỗng mà không báo lỗi gì.
VIET = set([0x102, 0x103, 0x110, 0x111, 0x128, 0x129, 0x168, 0x169, 0x1A0, 0x1A1,
            0x1AF, 0x1B0, 0x20AB] + list(range(0x1EA0, 0x1EFA)))

MA = list(range(0x20, 0x7F))
MA += [ord(c) for c in 'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúý°×·']
MA += [0x102, 0x103, 0x110, 0x111, 0x128, 0x129, 0x168, 0x169, 0x1A0, 0x1A1, 0x1AF, 0x1B0]
MA += list(range(0x1EA0, 0x1EFA))
MA += [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AB]
MA = sorted(set(MA))

f_latin = ImageFont.truetype(os.path.join(FONT_DIR, f'be-vietnam-pro-latin-{DAM}-normal.woff'), CO)
f_viet = ImageFont.truetype(os.path.join(FONT_DIR, f'be-vietnam-pro-vietnamese-{DAM}-normal.woff'), CO)

glyphs = []
bitmap = bytearray()
tren = 0
duoi = 0
for ma in MA:
    ch = chr(ma)
    f = f_viet if ma in VIET else f_latin
    tien = round(f.getlength(ch))
    x0, y0, x1, y1 = f.getbbox(ch, anchor='ls')
    w, h = max(0, x1 - x0), max(0, y1 - y0)
    if ch == ' ' or w == 0 or h == 0:
        glyphs.append((ma, 0, 0, 0, 0, tien, len(bitmap)))
        continue
    img = Image.new('L', (w, h), 0)
    ImageDraw.Draw(img).text((-x0, -y0), ch, font=f, fill=255, anchor='ls')
    px = img.load()
    if not any(px[x, y] for y in range(h) for x in range(w)):
        sys.exit(f'chữ {ch!r} (U+{ma:04X}) vẽ ra rỗng — file font không có nó?')
    vt = len(bitmap)
    for y in range(h):
        hang = [round(px[x, y] * 15 / 255) for x in range(w)]
        if w % 2:
            hang.append(0)
        for i in range(0, len(hang), 2):
            bitmap.append((hang[i] << 4) | hang[i + 1])
    glyphs.append((ma, w, h, x0, y0, tien, vt))
    tren = max(tren, -y0)
    duoi = max(duoi, y1)

dong = []
dong.append('// ⚠️ FILE SINH TỰ ĐỘNG bởi shell/phong-viet/dung.py — đừng sửa tay, chạy lại script.')
dong.append(f'// Be Vietnam Pro {DAM}, {CO}px, {len(glyphs)} chữ, alpha 4 bit (2 điểm/byte, mỗi hàng đủ byte).')
dong.append('// Font: Copyright 2021 The Be Vietnam Pro Project Authors')
dong.append('// (https://github.com/bettergui/BeVietnamPro), SIL Open Font License 1.1.')
dong.append('#pragma once')
dong.append('#include <stdint.h>')
dong.append('')
dong.append('namespace phongViet {')
dong.append('')
dong.append('struct Chu {')
dong.append('  uint16_t ma;    // mã Unicode')
dong.append('  uint8_t w, h;   // khung ảnh chữ')
dong.append('  int8_t dx, dy;  // góc trên-trái so với điểm bút trên đường chân chữ')
dong.append('  uint8_t tien;   // bút tiến bao nhiêu sau chữ này')
dong.append('  uint32_t vt;    // vị trí trong BITMAP')
dong.append('};')
dong.append('')
dong.append(f'static constexpr int TREN = {tren};   // cao nhất trên chân chữ (chữ hoa hai dấu: Ẫ, Ặ)')
dong.append(f'static constexpr int DUOI = {duoi};    // sâu nhất dưới chân chữ (g, y, dấu nặng)')
dong.append(f'static constexpr uint16_t SO_CHU = {len(glyphs)};')
dong.append('')
dong.append('static const uint8_t BITMAP[] = {')
for i in range(0, len(bitmap), 24):
    dong.append('  ' + ','.join(f'0x{b:02X}' for b in bitmap[i:i + 24]) + ',')
dong.append('};')
dong.append('')
dong.append('// Xếp theo `ma` tăng dần — tìm bằng chia đôi.')
dong.append('static const Chu CHU[] = {')
for ma, w, h, dx, dy, tien, vt in glyphs:
    dong.append(f'  {{0x{ma:04X}, {w}, {h}, {dx}, {dy}, {tien}, {vt}}},')
dong.append('};')
dong.append('')
dong.append('}  // namespace phongViet')
open(RA, 'w', encoding='utf-8').write('\n'.join(dong) + '\n')
print(f'✓ {RA}: {len(glyphs)} chữ, bitmap {len(bitmap)} byte, TREN={tren} DUOI={duoi}')
