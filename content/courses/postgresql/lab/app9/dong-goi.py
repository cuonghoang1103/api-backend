#!/usr/bin/env python3
"""Lab 9 — đóng gói TẤT ĐỊNH starter/ và solution/ thành lab9-starter.zip, lab9-solution.zip.
Cùng nội dung ⇒ cùng bytes (tên tệp sắp xếp, mốc giờ cố định, quyền cố định). Bỏ node_modules, .env, *.log.
Chạy:  python3 content/courses/postgresql/lab/app9/dong-goi.py <thư-mục-ra>
Rồi upload:  node --env-file=.env scripts/upload-academy-file.mjs --file <thư-mục-ra>/lab9-starter.zip --key PG/labs/v1/lab9-starter.zip
"""
import os, sys, zipfile, hashlib

GOC = os.path.dirname(os.path.abspath(__file__))
RA = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
BO = {'node_modules', '.env', '.DS_Store'}
MOC = (2026, 10, 26, 0, 0, 0)

def dong(ten, thu_muc, goc_zip):
    tep = []
    for root, dirs, files in os.walk(os.path.join(GOC, thu_muc)):
        dirs[:] = sorted(d for d in dirs if d not in BO)
        for f in sorted(files):
            if f in BO or f.endswith('.log'):
                continue
            tep.append(os.path.join(root, f))
    tep.sort()
    out = os.path.join(RA, ten)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in tep:
            rel = os.path.relpath(p, os.path.join(GOC, thu_muc)).replace(os.sep, '/')
            zi = zipfile.ZipInfo(f'{goc_zip}/{rel}', date_time=MOC)
            zi.external_attr = (0o644 & 0xFFFF) << 16
            zi.compress_type = zipfile.ZIP_DEFLATED
            with open(p, 'rb') as fh:
                z.writestr(zi, fh.read(), compresslevel=9)
    h = hashlib.sha256(open(out, 'rb').read()).hexdigest()[:16]
    print(f'{ten}: {len(tep)} files, {os.path.getsize(out)} bytes, sha256 {h}…')

os.makedirs(RA, exist_ok=True)
dong('lab9-starter.zip', 'starter', 'ctshop-api-lab9-starter')
dong('lab9-solution.zip', 'solution', 'ctshop-api-lab9-solution')
