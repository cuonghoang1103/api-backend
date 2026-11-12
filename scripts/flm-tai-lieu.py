#!/usr/bin/env python3
"""
flm-tai-lieu.py — tải tài liệu sinh viên của từng môn trên FLM, CUỐN CHIẾU, để soạn bài Academy.

    python3 -I scripts/flm-tai-lieu.py --ds <ds.json> --kho ~/Documents/FLM-nguon/_kho [--min-trong-gb 15] [--ma CHI111,...]

<ds.json> = mảng [{ "ma": "CHI111", "sylID": "13832", "links": ["/download/12295/S/1_CHI111.zip", ...] }, ...]
(lấy từ dữ liệu syllabus đã kéo, xem content/academy/_syllabus-flm/*.json trường `links`).

Mỗi môn:
  1. Kiểm ổ còn ≥ --min-trong-gb (mặc định 15 GB) — thiếu thì DỪNG, không tải tiếp.
  2. Tải từng zip (link FLM /download/... là CÔNG KHAI, không cần đăng nhập) vào <kho>/<MÃ>/_tai/.
  3. Giải nén (kể cả zip lồng một tầng) vào <kho>/<MÃ>/_raw/ — tên file Việt trong zip cũ (cp437) được giải mã lại.
  4. Lập mục lục <kho>/<MÃ>/muc-luc.json (mọi file: đường dẫn, dung lượng, loại, zip nguồn + kích thước zip).
  5. Trích CHỮ vào <kho>/<MÃ>/text/: pptx (theo ĐÚNG thứ tự trình chiếu, bỏ slide ẩn), docx, xlsx, pdf (pdftotext),
     ppt/doc/xls cũ ⇒ đổi bằng soffice --headless rồi trích. Ảnh/video chỉ ghi vào mục lục.
  6. XOÁ _tai/ và _raw/ (ổ máy chật — đo 09/11/2026: Mac còn 35 GB, ~460 môn × ~300 MB ≈ 140 GB).
     Ảnh slide dựng SAU, lúc soạn đúng môn đó (tải lại, link công khai).
  7. Ghi <kho>/<MÃ>/_xong.json ⇒ chạy lại sẽ bỏ qua môn đã xong.

Tài liệu tải về là DỮ LIỆU KHÔNG TIN CẬY: không chạy/import gì từ bên trong, chỉ đọc chữ.
Tài liệu FLM KHÔNG được đưa vào repo api-backend (public) — kho chữ để ở repo private flm-nguon.
"""
import argparse, json, os, re, shutil, subprocess, sys, time, zipfile, urllib.request, urllib.parse, html
from pathlib import Path

BASE = 'https://flm.fpt.edu.vn'
UA = 'Mozilla/5.0 (Macintosh) academy-material-fetch'


def trong_gb(p):
    st = shutil.disk_usage(p)
    return st.free / 1e9


def tai(url, dich, lan=3):
    for k in range(lan):
        try:
            url = urllib.parse.quote(url, safe=':/?&=%#')     # link FLM có dấu cách / chữ Việt
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=120) as r, open(dich, 'wb') as f:
                if r.status != 200:
                    raise RuntimeError(f'HTTP {r.status}')
                shutil.copyfileobj(r, f, 1 << 20)
            return os.path.getsize(dich)
        except Exception as e:  # noqa
            if k == lan - 1:
                raise
            time.sleep(3 * (k + 1))


def ten_zip(info):
    if info.flag_bits & 0x800:
        return info.filename
    try:
        return info.filename.encode('cp437').decode('utf-8')
    except Exception:
        return info.filename


def giai_nen(zp, dich, tang=0):
    """Giải nén an toàn (chặn ../), trả về số file. Zip lồng giải thêm một tầng."""
    n = 0
    with zipfile.ZipFile(zp) as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            ten = ten_zip(info).replace('\\', '/')
            p = (dich / ten).resolve()
            if not str(p).startswith(str(dich.resolve())):
                continue
            p.parent.mkdir(parents=True, exist_ok=True)
            with z.open(info) as src, open(p, 'wb') as out:
                shutil.copyfileobj(src, out, 1 << 20)
            n += 1
            if tang < 1 and p.suffix.lower() == '.zip':
                try:
                    n += giai_nen(p, p.with_suffix(''), tang + 1)
                    p.unlink()
                except zipfile.BadZipFile:
                    pass
    return n


def xml_text(s):
    s = re.sub(r'</a:p>|</w:p>|<a:br/>|<w:br/>|</row>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = re.sub(r'\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}', '', s)  # mã trường (field) của PowerPoint
    return '\n'.join(l.strip() for l in s.split('\n') if l.strip())


def pptx_text(p):
    out = []
    with zipfile.ZipFile(p) as z:
        names = set(z.namelist())
        pres = z.read('ppt/presentation.xml').decode('utf8', 'ignore')
        rels = z.read('ppt/_rels/presentation.xml.rels').decode('utf8', 'ignore')
        rmap = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"', rels)) | {a: b for b, a in re.findall(r'Target="([^"]+)"[^>]*Id="([^"]+)"', rels)}
        ids = re.findall(r'<p:sldId [^>]*r:id="([^"]+)"', pres)
        k = 0
        for rid in ids:
            t = rmap.get(rid, '')
            f = 'ppt/' + t.lstrip('/').replace('ppt/', '') if t else ''
            if f not in names:
                continue
            x = z.read(f).decode('utf8', 'ignore')
            if re.search(r'<p:sld [^>]*show="0"', x):
                continue
            # bỏ khối hiệu ứng động: <p:attrName>style.visibility</p:attrName>… là CHỮ trong XML, lọt vào text
            x = re.sub(r'<p:timing>.*?</p:timing>', '', x, flags=re.S)
            k += 1
            note = ''
            nrel = f.replace('slides/', 'slides/_rels/') + '.rels'
            if nrel in names:
                m = re.search(r'Target="\.\./notesSlides/([^"]+)"', z.read(nrel).decode('utf8', 'ignore'))
                if m and 'ppt/notesSlides/' + m.group(1) in names:
                    note = xml_text(z.read('ppt/notesSlides/' + m.group(1)).decode('utf8', 'ignore'))
            out.append((xml_text(x), note))
    return out


def pptx_text_str(p):
    ds = pptx_text(p)
    return '\n\n'.join(f'=== slide {i} ===\n{t}' + (f'\n--- ghi chú ---\n{n}' if n else '') for i, (t, n) in enumerate(ds, 1)), len(ds)


def docx_text(p):
    with zipfile.ZipFile(p) as z:
        return xml_text(z.read('word/document.xml').decode('utf8', 'ignore'))


def xlsx_text(p):
    with zipfile.ZipFile(p) as z:
        ss = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss = [xml_text(x) for x in re.findall(r'<si>(.*?)</si>', z.read('xl/sharedStrings.xml').decode('utf8', 'ignore'), re.S)]
        out = []
        for n in sorted(x for x in z.namelist() if re.match(r'xl/worksheets/sheet\d+\.xml$', x)):
            rows = []
            for row in re.findall(r'<row[^>]*>(.*?)</row>', z.read(n).decode('utf8', 'ignore'), re.S):
                cells = []
                for attrs, body in re.findall(r'<c([^>]*)>(.*?)</c>', row, re.S):
                    v = re.search(r'<v>(.*?)</v>', body, re.S)
                    if 't="s"' in attrs and v:
                        try:
                            cells.append(ss[int(v.group(1))])
                        except Exception:
                            cells.append('')
                    elif v:
                        cells.append(html.unescape(v.group(1)))
                    else:
                        t = re.search(r'<t[^>]*>(.*?)</t>', body, re.S)
                        cells.append(html.unescape(t.group(1)) if t else '')
                if any(c.strip() for c in cells):
                    rows.append(' | '.join(c.replace('\n', ' ') for c in cells))
            out.append(f'=== {n.split("/")[-1]} ===\n' + '\n'.join(rows))
        return '\n\n'.join(out)


def soffice_doi(p, dich_ext, tmp):
    subprocess.run(['soffice', '--headless', '--convert-to', dich_ext, '--outdir', str(tmp), str(p)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=240)
    q = tmp / (p.stem + '.' + dich_ext)
    return q if q.exists() else None


def trich(p, tmp):
    e = p.suffix.lower()
    try:
        if e == '.pptx':
            return pptx_text_str(p)
        if e == '.docx':
            return docx_text(p), None
        if e in ('.xlsx', '.xlsm'):
            return xlsx_text(p), None
        if e == '.pdf':
            r = subprocess.run(['pdftotext', '-layout', str(p), '-'], capture_output=True, timeout=180)
            return r.stdout.decode('utf8', 'ignore'), None
        if e in ('.txt', '.md', '.java', '.c', '.cpp', '.py', '.sql', '.cs', '.js', '.html', '.css', '.xml', '.json'):
            if p.stat().st_size < 2_000_000:
                return p.read_text('utf8', 'ignore'), None
        if e in ('.ppt', '.doc', '.xls'):
            q = soffice_doi(p, {'.ppt': 'pptx', '.doc': 'docx', '.xls': 'xlsx'}[e], tmp)
            if q:
                r = trich(q, tmp)
                q.unlink(missing_ok=True)
                return r
    except Exception as ex:  # noqa
        return f'[LỖI TRÍCH: {ex}]', None
    return None, None


# ── Google Drive: nhiều môn để zip FLM chỉ chứa một file Word ghi link Drive ─────────────
DRIVE_RE = re.compile(r'https?://(?:drive|docs)\.google\.com/[^\s<>"\')\]]+')
GDOWN = os.environ.get('FLM_GDOWN') or str(Path(__file__).resolve().parent / 'venv' / 'bin' / 'gdown')


def liet_ke_nhung(fid, goc='', sau=0):
    """Liệt kê thư mục Drive công khai qua trang embeddedfolderview (đệ quy ≤ 4 tầng) ⇒ [(id, đường dẫn)].
    Đường lùi khi `gdown --json` bỏ cuộc giữa chừng: nó dừng cả thư mục khi gặp MỘT tệp Google Docs/Slides gốc
    ("Cannot retrieve the public link…") — đo 12/11/2026 ở MKG101 (2 thư mục con, 0 tệp tải được)."""
    try:
        h = urllib.request.urlopen(f'https://drive.google.com/embeddedfolderview?id={fid}', timeout=60).read().decode('utf8', 'ignore')
    except Exception:
        return []
    kq = []
    for href, loai, id_, ten in re.findall(r'<a href="(https://drive\.google\.com/(file/d|drive/folders)/([\w-]+)[^"]*)"[^>]*>.*?flip-entry-title">([^<]+)', h, re.S):
        ten = html.unescape(ten).strip().replace('/', '_')
        if loai == 'drive/folders':
            if sau < 4:
                kq += liet_ke_nhung(id_, f'{goc}{ten}/', sau + 1)
        else:
            kq.append((id_, f'{goc}{ten}'))
    return kq


def theo_drive(raw, tmp, links_syl):
    """Tìm link Drive trong file nhỏ (docx/txt/url/pdf ≤ 2 MB) + cột link của syllabus, tải về raw/_drive/<k>/."""
    urls = []
    for p in raw.rglob('*'):
        if not p.is_file() or p.stat().st_size > 2_000_000:
            continue
        e = p.suffix.lower()
        try:
            if e == '.docx':
                t = docx_text(p) + '\n' + zipfile.ZipFile(p).read('word/_rels/document.xml.rels').decode('utf8', 'ignore') if 'word/_rels/document.xml.rels' in zipfile.ZipFile(p).namelist() else docx_text(p)
            elif e in ('.txt', '.url', '.html', '.htm', '.md'):
                t = p.read_text('utf8', 'ignore')
            elif e == '.pdf':
                t = subprocess.run(['pdftotext', str(p), '-'], capture_output=True, timeout=60).stdout.decode('utf8', 'ignore')
            else:
                continue
        except Exception:
            continue
        urls += DRIVE_RE.findall(html.unescape(t))
    urls += [l for l in links_syl if DRIVE_RE.match(l)]
    seen, kq = set(), []
    for u in urls:
        u = u.rstrip('.,;')
        m = re.search(r'/folders/([\w-]+)', u) or re.search(r'/d/([\w-]+)', u) or re.search(r'[?&]id=([\w-]+)', u)
        if not m or m.group(1) in seen or not os.path.exists(GDOWN):
            continue
        seen.add(m.group(1))
        dich = raw / '_drive' / f'{len(kq) + 1:02d}'
        dich.mkdir(parents=True, exist_ok=True)
        la_thu_muc = '/folders/' in u
        # gdown CHỈ để liệt kê thư mục; tải từng tệp bằng curl qua drive.usercontent.google.com — đường tải của
        # gdown (drive.google.com/uc) bị Google siết ("Cannot retrieve the public link… many accesses") trong khi
        # usercontent vẫn trả tệp (đo 09/11/2026). Nghỉ 1,5 s giữa các tệp cho lịch sự.
        tep = []
        if la_thu_muc:
            try:
                r = subprocess.run([GDOWN, u, '--json'], capture_output=True, timeout=600)
                tep = [(re.search(r'id=([\w-]+)', x['url']).group(1), x['path']) for x in json.loads(r.stdout.decode('utf8', 'ignore') or '[]')]
            except Exception:
                tep = []
            if not tep:
                tep = liet_ke_nhung(m.group(1))
        else:
            tep = [(m.group(1), None)]
        ok_n, loi_n = 0, 0
        for fid, ten in tep:
            dst = dich / ten if ten else dich
            if ten:
                dst.parent.mkdir(parents=True, exist_ok=True)
            cmd = ['curl', '-sL', '--retry', '2', '-w', '%{http_code} %{content_type}', f'https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t']
            cmd += (['-o', str(dst)] if ten else ['-J', '-O'])
            try:
                r = subprocess.run(cmd, capture_output=True, timeout=1800, cwd=None if ten else str(dich))
                code = r.stdout.decode().strip()
            except Exception:
                code = 'loi'
            if code.startswith('200') and 'text/html' not in code:
                ok_n += 1
            else:
                loi_n += 1
                if ten and dst.exists():
                    dst.unlink()
                for x in dich.glob('download*'):
                    x.unlink()
            time.sleep(1.5)
        ok = ok_n > 0 and loi_n == 0
        giai_nen_khac(dich)
        kq.append({'url': u, 'thuMuc': la_thu_muc, 'ok': ok, 'tepLoi': loi_n, 'soFile': sum(1 for x in dich.rglob('*') if x.is_file()),
                   'bytes': sum(x.stat().st_size for x in dich.rglob('*') if x.is_file())})
    return kq



SEVENZ = shutil.which('7zz') or shutil.which('7z')


def giai_nen_khac(goc_dir):
    """Giải mọi .zip/.rar/.7z còn nằm trong thư mục (2 vòng, cho lồng nhau), xoá file nén sau khi giải."""
    for _ in range(2):
        for f in [x for x in goc_dir.rglob('*') if x.is_file() and x.suffix.lower() in ('.zip', '.rar', '.7z')]:
            d = f.with_name(f.stem + '_giai')
            try:
                e = f.suffix.lower()
                if e == '.zip':
                    giai_nen(f, d)
                    ok = True
                else:
                    # 7-Zip bản Ubuntu bị cắt RAR ("Unsupported Method") mà vẫn tạo file RỖNG ⇒ RAR dùng unrar/unar.
                    cmds = ([['unrar', 'x', '-o+', '-idq', str(f), str(d) + '/']] if e == '.rar' and shutil.which('unrar') else []) + \
                           ([['unar', '-q', '-f', '-o', str(d), str(f)]] if shutil.which('unar') else []) + \
                           ([[SEVENZ, 'x', '-y', '-bso0', '-bsp0', f'-o{d}', str(f)]] if SEVENZ else [])
                    ok = False
                    for c in cmds:
                        shutil.rmtree(d, ignore_errors=True)
                        d.mkdir(parents=True, exist_ok=True)
                        r = subprocess.run(c, capture_output=True, timeout=1800)
                        if r.returncode == 0:
                            ok = True
                            break
                        # Giải được PHẦN LỚN, vài tệp hỏng (JPD116: 43/44, "Slot 8.ppt … Failed!") ⇒ giữ phần tốt,
                        # xoá đúng tệp hỏng (tệp cụt mà dựng ảnh thì ra rác).
                        ra = r.stdout.decode('utf8', 'ignore') + r.stderr.decode('utf8', 'ignore')
                        tot = [x for x in d.rglob('*') if x.is_file()]
                        if tot:
                            for dong in ra.splitlines():
                                m2 = re.match(r'\s*(.+?)\s+\(\d+ B\)\.\.\. Failed', dong)
                                if m2:
                                    (d / m2.group(1)).unlink(missing_ok=True)
                            for x in tot:
                                if x.exists() and x.stat().st_size == 0:
                                    x.unlink()
                            ok = True
                            break
                    if not ok:
                        shutil.rmtree(d, ignore_errors=True)   # giải dở ⇒ file cụt/rỗng: bỏ hẳn, không cho lọt vào bước dựng ảnh
                if ok:
                    f.unlink()
            except Exception:
                shutil.rmtree(d, ignore_errors=True)


# ── SLIDE: chọn deck, dựng ảnh webp, đẩy R2 ─────────────────────────────────
API = Path(__file__).resolve().parent.parent          # repo api-backend
SOFFICE = '/Applications/LibreOffice.app/Contents/MacOS/soffice' if sys.platform == 'darwin' else 'soffice'
# hồ sơ riêng MỖI TIẾN TRÌNH: không đụng LibreOffice của user, và nhiều luồng chạy song song không giẫm nhau
LO_PROFILE = f'file:///tmp/lo-flm-slide-{os.getpid()}'
NICE = ['nice', '-n', '10'] if sys.platform != 'darwin' else []
# Thư mục/tên file KHÔNG đăng lên web: dữ liệu cá nhân, bài nộp, điểm, đáp án đề.
RIENG_TU = re.compile(r'(?i)(\btemp\b|03\.temp|\bcv\b|resume|danh s[aá]ch|student list|b[aả]ng đi[eể]m|\bgrade|\bmarks?\b|đ[aá]p [aá]n|answer key|solution|submission|bài nộp)')


def nat_key(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', s)]


def pdf_ngang(p):
    try:
        r = subprocess.run(['pdfinfo', str(p)], capture_output=True, timeout=30).stdout.decode('utf8', 'ignore')
        m = re.search(r'Page size:\s*([\d.]+) x ([\d.]+)', r)
        trang = int((re.search(r'Pages:\s*(\d+)', r) or [0, 0])[1])
        return bool(m) and float(m.group(1)) > float(m.group(2)) * 1.15 and 0 < trang <= 400
    except Exception:
        return False


# Tên bài giảng thật bị RIENG_TU bắt nhầm (11/11/2026): "Trade marks", "Resume _ Cover Letter", "networking solutions".
KHONG_RIENG = re.compile(r'(?i)trade ?marks?|cover letter|networking solutions|career')


def la_deck(rel, p):
    if 'previous_version' in rel or '__MACOSX' in rel or Path(rel).name.startswith(('~$', '._')):
        return False
    if RIENG_TU.search(rel) and not KHONG_RIENG.search(rel):
        return False
    e = p.suffix.lower()
    if e in ('.pptx', '.ppsx'):
        return p.stat().st_size > 0 and zipfile.is_zipfile(p)    # pptx hỏng/cụt ⇒ bỏ
    if e in ('.ppt', '.pps'):
        return p.stat().st_size > 0
    return e == '.pdf' and pdf_ngang(p)


def ve_deck(p, out_dir, tmp):
    """Deck ⇒ <out_dir>/NNN.webp (rộng 1280). Trả (số slide, w, h, [chữ từng slide] | None)."""
    e = p.suffix.lower()
    pdf = p
    if e != '.pdf':
        for f in tmp.glob('*.pdf'):
            f.unlink()
        try:
            subprocess.run(NICE + [SOFFICE, f'-env:UserInstallation={LO_PROFILE}', '--headless', '--convert-to', 'pdf', '--outdir', str(tmp), str(p)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=900)
        except subprocess.TimeoutExpired:      # JLR302 Session 24 treo 600 s (09/11) ⇒ trước đây hỏng CẢ môn
            subprocess.run(['pkill', '-f', LO_PROFILE], capture_output=True)
            return 0, 0, 0, None
        ds = list(tmp.glob('*.pdf'))
        if not ds:
            return 0, 0, 0, None
        pdf = ds[0]
    stem = tmp / 'trang'
    subprocess.run(NICE + ['pdftoppm', '-png', '-scale-to-x', '1280', '-scale-to-y', '-1', str(pdf), str(stem)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=900)
    pngs = sorted(tmp.glob('trang-*.png'), key=lambda x: nat_key(x.name))
    out_dir.mkdir(parents=True, exist_ok=True)
    w = h = 0
    for i, png in enumerate(pngs, 1):
        dst = out_dir / f'{i:03d}.webp'
        subprocess.run(NICE + ['cwebp', '-quiet', '-q', '82', str(png), '-o', str(dst)], timeout=120)
        if i == 1:
            with open(png, 'rb') as fh:
                hd = fh.read(24)
            w, h = int.from_bytes(hd[16:20], 'big'), int.from_bytes(hd[20:24], 'big')   # IHDR của PNG
        png.unlink()
    n = len(pngs)
    chu = None
    try:
        if e == '.pptx':
            ds = pptx_text(p)
            chu = [t for t, _ in ds] if len(ds) == n else None   # lệch số slide (slide ẩn…) ⇒ bỏ chữ, không ghép sai
        elif e == '.pdf' or e == '.ppt':
            r = subprocess.run(['pdftotext', '-layout', str(pdf), '-'], capture_output=True, timeout=180).stdout.decode('utf8', 'ignore')
            pages = r.split('\f')
            if pages and not pages[-1].strip():
                pages = pages[:-1]
            chu = [x.strip() for x in pages] if len(pages) == n else None
    except Exception:
        chu = None
    if pdf != p:
        pdf.unlink(missing_ok=True)
    return n, w, h, chu


def ten_dep(s):
    s = re.sub(r'\.(pptx?|ppsx?|pdf)$', '', s, flags=re.I)
    s = re.sub(r'\s+', ' ', s.replace('_', ' ')).strip(' .-@')
    return s


def dung_slide(ma, raw, goc, phien_ban, upload=True):
    decks = []
    for p in raw.rglob('*'):
        if p.is_file():
            rel = p.relative_to(raw).as_posix()
            if la_deck(rel, p):
                decks.append((rel, p))
    decks.sort(key=lambda x: nat_key(x[0]))
    if not decks:
        return None
    out, tmp = goc / '_slide', goc / '_tmp_slide'
    tmp.mkdir(exist_ok=True)
    ds = []
    for i, (rel, p) in enumerate(decks, 1):
        key = f'd{i:02d}'
        n, w, h, chu = ve_deck(p, out / key, tmp)
        if n == 0:
            ds.append({'key': key, 'file': rel, 'loi': 'không dựng được ảnh'})
            continue
        parts = rel.split('/')
        # thư mục cha gần nhất (bỏ tầng gốc "1_MÃ") làm "chương"
        cha = [x for x in parts[:-1] if not re.fullmatch(rf'\d+_{re.escape(ma)}', x, flags=re.I)]
        ds.append({'key': key, 'file': rel, 'chuong': ten_dep(cha[-1]) if cha else '', 'ten': ten_dep(parts[-1]), 'n': n, 'w': w, 'h': h, 'chu': chu})
    shutil.rmtree(tmp, ignore_errors=True)
    prefix = f'{ma}/{phien_ban}'
    m = {'ma': ma, 'prefix': prefix, 'base': f'https://media.cuongthai.com/images/academy/{prefix}', 'decks': ds}
    if not upload:
        # Máy thuê: KHÔNG có khoá R2. Giữ <goc>/_slide/ cho máy Mac đẩy bằng link ký sẵn (flm-day-r2.mjs),
        # rồi Mac mới ghi slide-map.json + xoá _slide.
        (goc / 'slide-map.cho-day.json').write_text(json.dumps(m, ensure_ascii=False, indent=1))
        return sum(d.get('n', 0) for d in ds), len(ds)
    r = subprocess.run(['node', '--env-file=.env', 'scripts/upload-academy-slides.mjs', '--dir', str(out), '--prefix', prefix],
                       cwd=API, capture_output=True, timeout=7200)
    log = r.stdout.decode('utf8', 'ignore')[-1500:] + r.stderr.decode('utf8', 'ignore')[-800:]
    if r.returncode != 0:
        raise RuntimeError('upload R2 hỏng: ' + log[-400:])
    shutil.rmtree(out, ignore_errors=True)
    (goc / 'slide-map.json').write_text(json.dumps(m, ensure_ascii=False, indent=1))
    return sum(d.get('n', 0) for d in ds), len(ds)


def so_trang_pdf(p):
    try:
        r = subprocess.run(['pdfinfo', str(p)], capture_output=True, timeout=30).stdout.decode('utf8', 'ignore')
        return int((re.search(r'Pages:\s*(\d+)', r) or [0, 0])[1])
    except Exception:
        return 0


def _ten_chuan(rel):
    return re.sub(r'^_drive/\d+/', '', rel)


def bo_sung(m, kho, pdf_re=None, max_trang_pdf=150):
    """BỔ SUNG deck vào môn đã xong (11/11/2026): tải lại nguồn, dựng CHỈ những deck chưa có trong slide-map
    (deck bị bộ lọc bắt nhầm, PDF dọc khớp --pdf-re), key nối tiếp, đẩy R2 cùng prefix ⇒ URL ảnh cũ KHÔNG đổi."""
    ma = m['ma']
    goc = kho / ma
    f_map = goc / 'slide-map.json'
    cu = json.loads(f_map.read_text()) if f_map.exists() else {'ma': ma, 'prefix': f'{ma}/flm1', 'base': f'https://media.cuongthai.com/images/academy/{ma}/flm1', 'decks': []}
    da_co = {_ten_chuan(d['file']) for d in cu['decks'] if d.get('n')}
    tai_dir, raw, tmp, out = goc / '_bs_tai', goc / '_bs_raw', goc / '_bs_tmp', goc / '_slide'
    for d in (tai_dir, raw, tmp, out, goc / '_tmp_slide'):
        shutil.rmtree(d, ignore_errors=True)
    for d in (tai_dir, raw, tmp):
        d.mkdir(parents=True)
    try:
        for l in [l for l in m.get('links', []) if l.startswith('/download/')]:
            f = tai_dir / l.rsplit('/', 1)[-1]
            tai(BASE + l, f)
            try:
                giai_nen(f, raw / f.stem)
            except zipfile.BadZipFile:
                pass
        giai_nen_khac(raw)
        theo_drive(raw, tmp, m.get('links', []))
        moi = []
        for p in raw.rglob('*'):
            if not p.is_file():
                continue
            rel = p.relative_to(raw).as_posix()
            if _ten_chuan(rel) in da_co:
                continue
            la_pdf_tl = (p.suffix.lower() == '.pdf' and pdf_re and re.search(pdf_re, rel) and not Path(rel).name.startswith('._')
                         and 0 < so_trang_pdf(p) <= max_trang_pdf)
            if la_deck(rel, p) or la_pdf_tl:
                moi.append((rel, p))
        moi.sort(key=lambda x: nat_key(x[0]))
        # bỏ bản trùng tên (cùng tệp nằm ở hai thư mục)
        thay, uniq = set(), []
        for rel, p in moi:
            k = (Path(rel).name.lower(), p.stat().st_size)
            if k not in thay:
                thay.add(k); uniq.append((rel, p))
        if not uniq:
            return 'không có deck mới'
        so = max([int(d['key'][1:]) for d in cu['decks']] + [0])
        tmp2 = goc / '_tmp_slide'
        tmp2.mkdir(exist_ok=True)
        them = []
        for rel, p in uniq:
            so += 1
            key = f'd{so:02d}'
            n, w, h, chu = ve_deck(p, out / key, tmp2)
            if n == 0:
                print(f'   ! {ma} {rel}: không dựng được', flush=True)
                so -= 1
                continue
            parts = rel.split('/')
            cha = [x for x in parts[:-1] if not re.fullmatch(rf'\d+_{re.escape(ma)}', x, flags=re.I) and not re.fullmatch(r'_drive|\d+', x)]
            them.append({'key': key, 'file': rel, 'chuong': ten_dep(cha[-1]) if cha else '', 'ten': ten_dep(parts[-1]), 'n': n, 'w': w, 'h': h, 'chu': chu})
        if not them:
            return 'deck mới đều hỏng'
        r = subprocess.run(['node', '--env-file=.env', 'scripts/upload-academy-slides.mjs', '--dir', str(out), '--prefix', cu['prefix']],
                           cwd=API, capture_output=True, timeout=7200)
        if r.returncode != 0:
            raise RuntimeError('upload R2 hỏng: ' + (r.stdout + r.stderr).decode('utf8', 'ignore')[-400:])
        cu['decks'] += them
        f_map.write_text(json.dumps(cu, ensure_ascii=False, indent=1))
        return f'+{len(them)} deck · +{sum(d["n"] for d in them)} slide: ' + ' ; '.join(d['ten'][:40] for d in them[:6])
    finally:
        for d in (tai_dir, raw, tmp, out, goc / '_tmp_slide'):
            shutil.rmtree(d, ignore_errors=True)


def mot_mon(m, kho, min_gb, slide=True, phien_ban='flm1', upload=True):
    ma = m['ma']
    goc = kho / ma
    if (goc / '_xong.json').exists():
        return 'đã có'
    links = [l for l in m.get('links', []) if l.startswith('/download/')]
    if not links and not any(DRIVE_RE.match(l) for l in m.get('links', [])):
        goc.mkdir(parents=True, exist_ok=True)
        (goc / '_xong.json').write_text(json.dumps({'ma': ma, 'zip': [], 'ghiChu': 'FLM không có file tải cho môn này', 'linkKhac': m.get('links', [])}, ensure_ascii=False, indent=1))
        return 'không có file'
    tai_dir, raw, txt = goc / '_tai', goc / '_raw', goc / 'text'
    for d in (tai_dir, raw, txt, goc / '_slide', goc / '_tmp', goc / '_tmp_slide'):   # dở dang từ lần trước ⇒ làm lại sạch
        shutil.rmtree(d, ignore_errors=True)
    for d in (tai_dir, raw, txt):
        d.mkdir(parents=True, exist_ok=True)
    zips = []
    for l in links:
        if trong_gb(kho) < min_gb:
            raise SystemExit(f'⛔ ổ còn {trong_gb(kho):.1f} GB < {min_gb} GB — DỪNG trước {ma}')
        f = tai_dir / l.rsplit('/', 1)[-1]
        sz = tai(BASE + l, f)
        zips.append({'url': BASE + l, 'file': f.name, 'bytes': sz})
    muc = []
    for z in zips:
        zd = raw / Path(z['file']).stem
        try:
            z['soFile'] = giai_nen(tai_dir / z['file'], zd)
        except zipfile.BadZipFile:
            z['loi'] = 'không phải zip hợp lệ'
            continue
    tmp = goc / '_tmp'
    tmp.mkdir(exist_ok=True)
    giai_nen_khac(raw)                     # rar/7z lồng trong zip của trường
    drive = theo_drive(raw, tmp, m.get('links', []))
    for p in sorted(raw.rglob('*')):
        if not p.is_file():
            continue
        rel = p.relative_to(raw).as_posix()
        rec = {'duongDan': rel, 'bytes': p.stat().st_size, 'loai': p.suffix.lower().lstrip('.')}
        t, soSlide = trich(p, tmp)
        if t and t.strip():
            out = txt / (rel + '.txt')
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(t, 'utf8')
            rec['text'] = 'text/' + rel + '.txt'
            rec['kyTu'] = len(t)
            if soSlide is not None:
                rec['soSlide'] = soSlide
        muc.append(rec)
    (goc / 'muc-luc.json').write_text(json.dumps({'ma': ma, 'sylID': m.get('sylID'), 'zip': zips, 'drive': drive, 'file': muc}, ensure_ascii=False, indent=1))
    kq_slide = dung_slide(ma, raw, goc, phien_ban, upload) if slide else None
    shutil.rmtree(tai_dir, ignore_errors=True)
    shutil.rmtree(raw, ignore_errors=True)
    shutil.rmtree(tmp, ignore_errors=True)
    tong = sum(z['bytes'] for z in zips)
    (goc / '_xong.json').write_text(json.dumps({'ma': ma, 'zipMB': round(tong / 1e6, 1), 'soFile': len(muc), 'coChu': sum(1 for r in muc if r.get('text')), 'slide': kq_slide, 'luc': time.strftime('%Y-%m-%d %H:%M')}, ensure_ascii=False))
    return f'{len(zips)} zip {tong/1e6:.0f} MB · {len(muc)} file · {sum(1 for r in muc if r.get("text"))} có chữ' + (f' · {kq_slide[0]} slide / {kq_slide[1]} deck' if kq_slide else ' · không có slide')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ds', required=True)
    ap.add_argument('--kho', required=True)
    ap.add_argument('--min-trong-gb', type=float, default=15)
    ap.add_argument('--ma', default='')
    ap.add_argument('--khong-slide', action='store_true')
    ap.add_argument('--khong-day', action='store_true', help='không đẩy R2 (máy không có khoá) — giữ _slide/ chờ Mac đẩy')
    ap.add_argument('--bo-sung', action='store_true', help='môn đã xong: dựng THÊM deck chưa có (xem bo_sung)')
    ap.add_argument('--pdf-re', default='', help='với --bo-sung: regex đường dẫn PDF dọc cũng dựng thành ảnh')
    ap.add_argument('--luong', default='0/1', help='i/N: tiến trình này chỉ làm môn thứ k với k %% N == i')
    a = ap.parse_args()
    kho = Path(os.path.expanduser(a.kho))
    kho.mkdir(parents=True, exist_ok=True)
    ds = json.load(open(a.ds))
    chon = set(x for x in a.ma.split(',') if x)
    if chon:
        ds = [m for m in ds if m['ma'] in chon]
    li, ln = map(int, a.luong.split('/'))
    ds = [m for k, m in enumerate(ds) if k % ln == li]
    for i, m in enumerate(ds, 1):
        t0 = time.time()
        try:
            kq = bo_sung(m, kho, m.get('pdfRe') or a.pdf_re or None) if a.bo_sung else mot_mon(m, kho, a.min_trong_gb, slide=not a.khong_slide, upload=not a.khong_day)
        except SystemExit:
            raise
        except Exception as e:  # noqa
            kq = f'⛔ LỖI {e}'
        print(f'[{i}/{len(ds)}] {m["ma"]}: {kq} ({time.time()-t0:.0f}s, ổ còn {trong_gb(kho):.1f} GB)', flush=True)


if __name__ == '__main__':
    main()
