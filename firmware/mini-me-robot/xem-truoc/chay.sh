#!/usr/bin/env bash
# Vẽ hai con mắt trên MÁY TÍNH, xuất ảnh PNG. Không cần bo, không cần màn.
#
# ⚠️ Nó chạy ĐÚNG file `../src/eyes.cpp` mà bo sẽ chạy — không phải một
# bản chép lại. Sửa eyes.cpp rồi chạy lại là thấy ngay kết quả. Một bộ
# xem trước vẽ bằng mã KHÁC thì vô dụng: nó chỉ chứng minh bản chép đúng.
set -euo pipefail
cd "$(dirname "$0")"
SRC=../src
mkdir -p anh && rm -f anh/*.ppm anh/*.png

clang++ -std=c++17 -O1 -DSPI_FREQUENCY=40000000 -I. -I"$SRC" \
  preview.cpp "$SRC/eyes.cpp" -o anh/preview
(cd anh && ./preview)

python3 - <<'PY'
from PIL import Image, ImageDraw
import glob, os
os.chdir("anh")
fs = sorted(glob.glob("*.ppm"))
if not fs: raise SystemExit("khong co anh nao")
S, cols = 3, 5
tw, th, pad, lab = 496//S, 240//S, 10, 18
rows = (len(fs)+cols-1)//cols
sh = Image.new("RGB", (cols*(tw+pad)+pad, rows*(th+lab+pad)+pad), (14,14,18))
d = ImageDraw.Draw(sh)
for i, f in enumerate(fs):
    im = Image.open(f).resize((tw,th), Image.LANCZOS)
    x, y = pad+(i%cols)*(tw+pad), pad+(i//cols)*(th+lab+pad)
    sh.paste(im,(x,y)); d.text((x+2,y+th+3), os.path.splitext(f)[0], fill=(190,195,205))
    im2 = Image.open(f); im2.save(os.path.splitext(f)[0]+".png")
sh.save("00-tat-ca.png")
print(f"  {len(fs)} canh → anh/00-tat-ca.png")
PY
