"""Gộp phần agent soạn (~/Documents/roadmap-lam/ra/<slug>__<từ>-<đến>.json) thành content/roadmap/<slug>.json.
  python3 -I scripts/roadmap-gop-noi-dung.py [slug ...]        # không slug = mọi lộ trình có phần soạn
Mỗi ref trong `hoc` được TRA trong chỉ mục bài thật rồi mới thành link:
  "khoa/bai" ⇒ /courses/<khoa>/learn?lessonSlug=<bai> · "sim:<id>" ⇒ /simulation?scenario=<id>
  "cl:<slug>" ⇒ /code-lab/<slug> · "page:/algorithms" ⇒ trang công cụ.
Ref không có thật ⇒ BỎ và in cảnh báo (không bao giờ ghi link chết). Key không khớp bước nào ⇒ cảnh báo."""
import glob, json, os, re, sys

W = os.path.expanduser('~/Documents/roadmap-lam')
RA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content', 'roadmap')
os.makedirs(RA_DIR, exist_ok=True)

CHUA_SOAN = re.compile(r'đang (được )?(biên )?soạn|being written|coming soon|chưa soạn', re.I)
bai = {}
for x in open(f'{W}/chi-muc-bai.jsonl'):
    b = json.loads(x)
    if not CHUA_SOAN.search(b['mo']): bai[f"{b['khoa']}/{b['bai']}"] = b  # bài giữ chỗ ⇒ coi như không có
sims = {s['id']: s for s in json.load(open(f'{W}/mo-phong.json'))}
cls = {c['slug']: c for c in json.load(open(f'{W}/code-lab.json'))}
TRANG = {'/algorithms': 'Trực quan thuật toán', '/os-lab': 'OS Lab — hệ điều hành chạy được', '/net-lab': 'Net Lab — mạng máy tính',
         '/cpu-lab': 'CPU Lab — bên trong bộ xử lý', '/interview': 'Luyện phỏng vấn'}
buoc = {r['slug']: [n['key'] for s in r['stages'] for n in s['nodes']] for r in json.load(open(f'{W}/buoc.json'))}

def kieu(b):
    if b['loai'] == 'QUIZ': return 'quiz'
    t = (b['vi'] + ' ' + b['en']).lower()
    if 'slide' in t: return 'slide'
    if b['video']: return 'video'
    if b['loai'] == 'EXERCISE' or re.search(r'\blab\b|dự án|project', t): return 'lab'
    return 'bai-doc'

def chuong_ngan(c):
    m = re.match(r'^((?:Chương|Chapter|Mục|Section|Phần|Part|Slot|Buổi)\s*[\w.]+)', c or '')
    return m.group(1) if m else (c or '')[:40]

def mo_rong(ref, loi):
    ref = ref.strip()
    if ref.startswith('sim:'):
        s = sims.get(ref[4:])
        if not s: loi.append(ref); return None
        return {'href': f"/simulation?scenario={s['id']}", 'ten': s['title'], 'nguon': 'Xưởng mô phỏng', 'kieu': 'mo-phong'}
    if ref.startswith('cl:'):
        c = cls.get(ref[3:])
        if not c: loi.append(ref); return None
        return {'href': f"/code-lab/{c['slug']}", 'ten': c['ten'] or c['slug'], 'nguon': 'Code Lab · luyện có chấm', 'kieu': 'code-lab'}
    if ref.startswith('page:'):
        p = ref[5:]
        if p not in TRANG: loi.append(ref); return None
        return {'href': p, 'ten': TRANG[p], 'nguon': 'Công cụ học trên web', 'kieu': 'trang'}
    b = bai.get(ref)
    if not b: loi.append(ref); return None
    o = {'href': f"/courses/{b['khoa']}/learn?lessonSlug={b['bai']}", 'ten': b['vi'] or b['en'],
         'nguon': f"{b['khoaTen']} · {chuong_ngan(b['chuong'])}".strip(' ·'), 'kieu': kieu(b)}
    if b['academy']: o['academy'] = True
    if b['ma']: o['ma'] = b['ma']
    return o

slugs = sys.argv[1:] or sorted({os.path.basename(f).split('__')[0] for f in glob.glob(f'{W}/ra/*__*.json')})
for slug in slugs:
    gop = {}
    for f in sorted(glob.glob(f'{W}/ra/{slug}__*.json')):
        try: gop.update(json.load(open(f)))
        except Exception as e: print(f'  ✗ {os.path.basename(f)}: JSON hỏng — {e}'); continue
    thu_tu = buoc.get(slug, [])
    la = [k for k in gop if k not in thu_tu]
    if la: print(f'  ⚠ {slug}: {len(la)} key không khớp bước nào, bỏ: {la[:3]}')
    out, loi, co_hoc, co_doc = {}, [], 0, 0
    for k in thu_tu:
        if k not in gop: continue
        g = gop[k]; nd = {}
        body = (g.get('body') or '').strip()
        if body: nd['body'] = body; co_doc += 1
        hoc, thay = [], set()
        for ref in g.get('hoc') or []:
            o = mo_rong(ref, loi)
            if o and o['href'] not in thay: thay.add(o['href']); hoc.append(o)
        if hoc: nd['lessons'] = hoc[:6]; co_hoc += 1
        them = [r for r in (g.get('them') or []) if isinstance(r, dict) and re.match(r'^https?://', r.get('url', '')) and r.get('title')]
        if them: nd['more'] = [{'type': r.get('type') if r.get('type') in ('article', 'video', 'course', 'official') else 'article', 'title': r['title'], 'url': r['url']} for r in them[:3]]
        if nd: out[k] = nd
    json.dump(out, open(os.path.join(RA_DIR, f'{slug}.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'{slug}: {len(out)}/{len(thu_tu)} bước có nội dung · {co_doc} bài đọc · {co_hoc} có bài học trên web'
          + (f' · ⚠ bỏ {len(loi)} ref không có thật: {loi[:4]}' if loi else ''))
