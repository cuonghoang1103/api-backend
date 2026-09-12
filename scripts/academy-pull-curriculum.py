#!/usr/bin/env python3
"""
academy-pull-curriculum.py — kéo KHUNG chương trình một khối ngành từ FLM và
xuất ra TSV môn đã dedupe (code, name, semester, credit, nSpecs, specs).

Dùng để dựng "khung đầy đủ các môn từng kỳ" cho các ngành ngoài CNTT (Kinh
doanh, Truyền thông, Ngôn ngữ, Luật, KHMT) — GIỐNG HỆT cách đã làm 8 ngành IT.

Nguồn (FLM, cần cookie phiên đăng nhập):
  1. Danh sách khung:  /gui/role/student/ListCurriculum?searchOn=Code&keyword=<PROG>
     → nhiều bản: <SPEC>_K<khoá> mỗi chuyên ngành × mỗi khoá.
  2. Khung 1 bản:      /gui/role/student/CurriculumDetails?curid=<id>
     → bảng môn: Subject Code | Subject Name | Semester | NoCredit | PreRequisite.

Với mỗi chuyên ngành (SPEC prefix), script chọn 1 khoá GẦN NHẤT (K-year lớn nhất)
rồi kéo CurriculumDetails, gộp môn của mọi chuyên ngành lại và dedupe theo mã.

  python3 scripts/academy-pull-curriculum.py \
      --keyword BBA --cookie 'ol0yr...' --out /tmp/bba_courses.tsv \
      [--spec-prefix BBA_] [--cache-dir /tmp/curr/bba]

⚠️ Cookie chỉ cần ASP.NET_SessionId (phiên đăng nhập FLM của người dùng). Nó hết
hạn thì phải lấy lại. curl-ra-file để KHÔNG nạp HTML khổng lồ vào ngữ cảnh.
"""
import re, os, sys, argparse, urllib.request

BASE = 'https://flm.fpt.edu.vn/gui/role/student'

def fetch(url, sid):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0',
        'Cookie': f'language=en; ASP.NET_SessionId={sid}',
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8', 'ignore')

def parse_list(html, spec_prefix):
    """→ [(spec, kyear, ktail, curid, code)] cho từng bản khung."""
    out = []
    for r in re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.S):
        if 'curid=' not in r:
            continue
        cid = re.search(r'curid=(\d+)', r).group(1)
        cells = [re.sub(r'<[^>]+>', '', c).strip()
                 for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.S)]
        code = cells[1] if len(cells) > 1 else ''
        m = re.match(re.escape(spec_prefix) + r'([A-Za-z0-9]+)_K(\d+)([A-Za-z0-9]*)', code)
        if not m:
            continue
        out.append((spec_prefix + m.group(1), int(m.group(2)), m.group(3), int(cid), code))
    return out

def choose_latest(rows):
    """1 curid/chuyên ngành: K-year lớn nhất, rồi ktail lớn nhất."""
    best = {}
    for spec, ky, kt, cid, code in rows:
        cur = best.get(spec)
        if cur is None or (ky, kt) > (cur[0], cur[1]):
            best[spec] = (ky, kt, cid, code)
    return best

def parse_subjects(html):
    """→ [(code, name, sem, credit)] từ bảng môn của CurriculumDetails."""
    out = []
    for r in re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.S):
        cells = [re.sub(r'<[^>]+>', '', c).strip()
                 for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.S)]
        if len(cells) < 4:
            continue
        code = cells[0]
        if not re.fullmatch(r'[A-Z]{2,4}\d{3}[a-z]?', code):
            continue
        out.append((code, cells[1], cells[2], cells[3]))
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--keyword', required=True, help='mã chương trình, vd BBA / BEN / BJ / BCH / BCS')
    ap.add_argument('--cookie', required=True, help='ASP.NET_SessionId')
    ap.add_argument('--out', required=True, help='file TSV môn đầu ra')
    ap.add_argument('--spec-prefix', default=None, help='tiền tố chuyên ngành (mặc định = keyword + "_")')
    ap.add_argument('--cache-dir', default=None, help='lưu HTML khung để soi lại')
    a = ap.parse_args()
    spec_prefix = a.spec_prefix or (a.keyword + '_')
    if a.cache_dir:
        os.makedirs(a.cache_dir, exist_ok=True)

    lst = fetch(f'{BASE}/ListCurriculum?searchOn=Code&keyword={a.keyword}', a.cookie)
    rows = parse_list(lst, spec_prefix)
    chosen = choose_latest(rows)
    if not chosen:
        print(f'KHÔNG thấy bản khung nào cho keyword={a.keyword} (prefix={spec_prefix}). '
              f'Kiểm lại mã chương trình / cookie.', file=sys.stderr)
        sys.exit(2)
    print(f'{a.keyword}: {len(chosen)} chuyên ngành')

    courses = {}  # code -> {name, sems:set, specs:set, credit}
    for spec in sorted(chosen):
        ky, kt, cid, code = chosen[spec]
        html = fetch(f'{BASE}/CurriculumDetails?curid={cid}', a.cookie)
        if a.cache_dir:
            open(os.path.join(a.cache_dir, f'{spec}.html'), 'w', encoding='utf-8').write(html)
        subs = parse_subjects(html)
        print(f'  {spec:14} curid={cid:5} {code:20} {len(subs)} môn')
        for scode, sname, sem, credit in subs:
            c = courses.setdefault(scode, {'name': sname, 'sems': set(), 'specs': set(), 'credit': credit})
            if re.fullmatch(r'\d{1,2}', sem):
                c['sems'].add(int(sem))
            c['specs'].add(spec)

    with open(a.out, 'w', encoding='utf-8') as f:
        for code in sorted(courses):
            c = courses[code]
            sem = min(c['sems']) if c['sems'] else 0
            name = c['name'].split('_')[0].strip()  # phần tiếng Anh trước "_VN"
            f.write(f"{code}\t{name}\t{sem}\t{c['credit']}\t{len(c['specs'])}\t{','.join(sorted(c['specs']))}\n")
    print(f'→ {len(courses)} môn phân biệt ghi vào {a.out}')

if __name__ == '__main__':
    main()
