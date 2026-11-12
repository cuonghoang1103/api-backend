"""Tìm bài học ỨNG VIÊN trên cuongthai.com cho từng bước lộ trình (BM25 trên chỉ mục bài).
  python3 -I scripts/roadmap-ung-vien.py [thư mục làm việc, mặc định ~/Documents/roadmap-lam]
Đọc buoc.json (scripts/roadmap-xuat-buoc.mts), chi-muc-bai.jsonl (scripts/roadmap-chi-muc-bai.mjs),
mo-phong.json, code-lab.json ⇒ ghi ung-vien/<slug>.json: mỗi bước kèm ~16 bài ứng viên + mô phỏng + Code Lab gợi ý.
Đây CHỈ là ứng viên thô — người/agent soát mới chọn bài cuối cùng (bước nào không có bài thật sự dạy nó thì để trống).
  python3 -I scripts/roadmap-ung-vien.py --tim "event loop node" [--khoa nodejs] [--n 20]   ⇒ tra cứu tay (agent dùng)
Chỉ giữ khoá CNTT: mọi khoá Courses + môn Academy có tỉ lệ bài nói chuyện kỹ thuật ≥ 0,2 (it-score.json) — môn ngoại ngữ,
kinh doanh… làm nhiễu (chữ "hoạt động", "thế nào" khớp nhầm)."""
import json, math, os, re, sys, unicodedata, collections

A = sys.argv[1:]
def lay(k, d=None):
    return A[A.index(k) + 1] if k in A else d
TIM = lay('--tim'); KHOA = lay('--khoa'); SO = int(lay('--n', '20'))
W = A[0] if A and not A[0].startswith('--') else os.path.expanduser('~/Documents/roadmap-lam')
os.makedirs(f'{W}/ung-vien', exist_ok=True)

def bo_dau(s):
    s = unicodedata.normalize('NFD', s.replace('đ', 'd').replace('Đ', 'D'))
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')

DUNG = set('hoat dong thao nhu cach the a an and or of to in on for with is are be by as at from your you how what why vs la va cua cho voi trong mot nhung cac khi de co khong duoc bang tu den the nao gi lam ve nay do thi se da dang hoc bai chuong section chapter slide slides quiz kiem tra part phan'.split())

def tu(s):
    s = bo_dau(str(s or '').lower())
    return [t for t in re.findall(r'[a-z0-9][a-z0-9+#.]*[a-z0-9+#]|[a-z0-9]', s) if t not in DUNG and len(t) > 1 or t in ('c', 'r', 'go')]

ITS = json.load(open(f'{W}/it-score.json'))
# Bài còn là chỗ giữ ("đang được biên soạn") KHÔNG được gắn — mở ra chỉ thấy một dòng, tệ hơn không gắn gì.
CHUA_SOAN = re.compile(r'đang (được )?(biên )?soạn|being written|coming soon|chưa soạn', re.I)
# Bài "khung" của Academy (chỉ mục tiêu + khái niệm + chỗ đọc, chưa có lời giảng) — API công khai không trả nội dung
# bài Academy nên không dò được từ chỉ mục; danh sách lấy từ mã nguồn content/academy (bai-khung.json).
_KF = os.path.join(W if 'W' in globals() else os.path.expanduser('~/Documents/roadmap-lam'), 'bai-khung.json')
KHUNG = set(json.load(open(_KF))) if os.path.exists(_KF) else set()
# Trang buổi học FLM (`*-flm-bNNN`): 📑 = có slide giảng, 📘 = chỉ lịch buổi theo syllabus (gần như rỗng) ⇒ bỏ 📘
# trừ khi nội dung dài thật (đo 12/11: 20.575 trang, 20.136 rỗng).
KHUNG_MO_TA = re.compile(r'khung bài|bài khung|chế độ khung', re.I)  # bài khung ghi ngay trong mô tả (gai401/ais201/cac301… 148 bài)
def trang_buoi_rong(b):
    if KHUNG_MO_TA.search(b.get('moTa', '') + ' ' + b.get('mo', '')): return True
    return bool(re.search(r'-flm-b\d{3}', b['bai'])) and not b['vi'].startswith('📑') and b['doDai'] < 1500
bai = [b for b in (json.loads(x) for x in open(f'{W}/chi-muc-bai.jsonl'))
       if (not b['academy'] or ITS.get(b['khoa'], 0) >= 0.2) and (not KHOA or b['khoa'] == KHOA)
       and not CHUA_SOAN.search(b['mo']) and b['bai'] not in KHUNG and not trang_buoi_rong(b)]
docs = []
for b in bai:
    t = tu(f"{b['vi']} {b['en']}") * 3 + tu(b['chuong']) + tu(b['khoaTen']) + tu(' '.join(b['deMuc'][:12])) + tu(b['moTa'])
    docs.append(collections.Counter(t))
N = len(docs); avg = sum(sum(d.values()) for d in docs) / N
df = collections.Counter()
for d in docs: df.update(d.keys())
idf = {k: math.log(1 + (N - v + .5) / (v + .5)) for k, v in df.items()}
dao = collections.defaultdict(list)
for i, d in enumerate(docs):
    for k in d: dao[k].append(i)
lens = [sum(d.values()) for d in docs]

def bm25(q, k1=1.4, b=.75):
    s = collections.defaultdict(float)
    for k, w in q.items():
        if k not in idf: continue
        for i in dao[k]:
            f = docs[i][k]
            s[i] += w * idf[k] * f * (k1 + 1) / (f + k1 * (1 - b + b * lens[i] / avg))
    for i in s:  # khoá Courses (chuyên sâu, tự soạn) được ưu tiên nhẹ hơn slide môn trường cùng điểm
        if not bai[i]['academy']: s[i] *= 1.25
    return s

sims = json.load(open(f'{W}/mo-phong.json')); cl = json.load(open(f'{W}/code-lab.json'))
seen = set(); cl = [c for c in cl if not (c['slug'] in seen or seen.add(c['slug']))]

def kieu(b):
    if b['loai'] == 'QUIZ': return 'quiz'
    t = (b['vi'] + ' ' + b['en']).lower()
    if 'slide' in t: return 'slide'
    if b['video']: return 'video'
    if b['loai'] == 'EXERCISE' or ' lab' in t or 'dự án' in t: return 'lab'
    return 'bai-doc'

if TIM:
    sc = bm25(collections.Counter(tu(TIM)))
    for i, v in sorted(sc.items(), key=lambda x: -x[1])[:SO]:
        b = bai[i]
        print(f"{v:6.1f} {b['khoa']}/{b['bai']} [{kieu(b)}{' A:' + b['ma'] if b['academy'] else ''}] {b['vi'][:110]}\n        ⤷ {b['chuong'][:60]} · {' · '.join(b['deMuc'][:6])[:150]}")
    sys.exit(0)

for r in json.load(open(f'{W}/buoc.json')):
    out = []
    for s in r['stages']:
        for n in s['nodes']:
            q = collections.Counter(tu(n['title']) * 4 + tu(n.get('subtitle')) + tu(n.get('description')) * 1 + tu(s['label']) + tu(r['title']) * 2)
            sc = bm25(q)
            moi_khoa = collections.Counter(); ds = []
            for i, v in sorted(sc.items(), key=lambda x: -x[1]):
                b = bai[i]
                if b['loai'] == 'QUIZ' and len(ds) > 8: continue
                if moi_khoa[b['khoa']] >= 4: continue
                moi_khoa[b['khoa']] += 1
                ds.append({'ref': f"{b['khoa']}/{b['bai']}", 'diem': round(v, 1), 'khoa': b['khoaTen'] + (f" ({b['ma']})" if b['ma'] else ''),
                           'academy': b['academy'], 'chuong': b['chuong'][:80], 'bai': b['vi'][:140], 'kieu': kieu(b),
                           'deMuc': ' · '.join(b['deMuc'][:8])[:260]})
                if len(ds) >= 16: break
            qs = set(q)
            sim = sorted(((len(qs & set(tu(x['title'] + ' ' + (x.get('mo') or '')))), x['id'], x['title']) for x in sims), reverse=True)[:3]
            clp = sorted(((len(qs & set(tu(c['slug'].replace('-', ' ') + ' ' + (c['ten'] or '')))), c['slug'], c['ten']) for c in cl), reverse=True)[:3]
            out.append({'key': n['key'], 'title': n['title'], 'subtitle': n.get('subtitle'), 'kind': n.get('kind', 'primary'),
                        'description': n.get('description'), 'link': n.get('link'),
                        'resources': [x['url'] for x in n.get('resources') or []],
                        'ungVien': ds, 'moPhong': [{'id': i, 'ten': t} for c, i, t in sim if c >= 2],
                        'codeLab': [{'slug': i, 'ten': t} for c, i, t in clp if c >= 1]})
    json.dump({'slug': r['slug'], 'title': r['title'], 'buoc': out}, open(f"{W}/ung-vien/{r['slug']}.json", 'w'), ensure_ascii=False, indent=1)
    print(r['slug'], len(out), flush=True)
