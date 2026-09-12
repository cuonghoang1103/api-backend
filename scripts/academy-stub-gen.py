#!/usr/bin/env python3
"""
academy-stub-gen.py — sinh STUB môn học (khung, chưa có bài giảng) từ TSV môn.

Đầu vào là TSV do academy-pull-curriculum.py xuất ra (code, name, sem, credit,
nSpecs, specs). Với mỗi mã CHƯA có file content/academy/<CODE>.mjs, sinh một stub
đúng khuôn (giống 160 môn IT đã tạo): semester ánh xạ đúng, slug ổn định, trỏ ảnh
bìa v3, mô tả song ngữ ghi RÕ "bài giảng chưa được dựng". KHÔNG ghi đè file đã có
(môn đã dựng nội dung hoặc stub cũ) — nên chạy lại an toàn.

  python3 scripts/academy-stub-gen.py <coursesTsv> <tone> "<nhãn ngành VI>" <coverTsv>

  <tone>     : khoá tông màu bìa trong academy-cover-gen.mjs
               (bba/mc/lang/law/cs cho khối ngoài IT; se/ia/... cho IT).
  <nhãn VI>  : nhắc trong mô tả, vd "khối Quản trị Kinh doanh".
  <coverTsv> : file TSV (code, name, tone) để vẽ bìa bằng academy-cover-gen.mjs.

Ánh xạ kỳ (PHẢI khớp các semester row đang có trong Academy, nếu không sẽ tạo
semester trùng): 1→KY1(1) · 2→KY2(2) · 3→FPTU_Hola3(5) · 4→Hola4(6) · 5→Hola5(7)
· 6→Hola6(8,"Kỳ 6 — Thực tập") · 7→Hola7(9) · 8→Hola8(10) · 9→Hola9(11). sem 0→KY1.
"""
import re, os, sys, unicodedata

ACAD = 'content/academy'
SEM = {
    0: ('KY1', 'Kỳ 1', 1), 1: ('KY1', 'Kỳ 1', 1), 2: ('KY2', 'Kỳ 2', 2),
    3: ('FPTU_Hola3', 'Kỳ 3', 5), 4: ('FPTU_Hola4', 'Kỳ 4', 6),
    5: ('FPTU_Hola5', 'Kỳ 5', 7), 6: ('FPTU_Hola6', 'Kỳ 6 — Thực tập', 8),
    7: ('FPTU_Hola7', 'Kỳ 7', 9), 8: ('FPTU_Hola8', 'Kỳ 8', 10),
    9: ('FPTU_Hola9', 'Kỳ 9', 11),
}

def slugify(t):
    t = unicodedata.normalize('NFD', t).encode('ascii', 'ignore').decode()
    t = re.sub(r'[^a-z0-9\s-]', '', t.lower().strip())
    return re.sub(r'-+', '-', re.sub(r'\s+', '-', t)).strip('-')

def jss(s):   # escape cho chuỗi JS single-quote
    return s.replace('\\', '\\\\').replace("'", "\\'")

def htxt(s):  # escape cho HTML nhúng trong mô tả
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def main():
    courses, tone, majvi, cover_tsv = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    existing = set(f[:-4] for f in os.listdir(ACAD) if f.endswith('.mjs'))
    cov = open(cover_tsv, 'w', encoding='utf-8')
    made = skipped = 0
    for line in open(courses, encoding='utf-8'):
        p = line.rstrip('\n').split('\t')
        if len(p) < 3:
            continue
        code, name, sem = p[0], p[1], p[2]
        if code in existing:
            skipped += 1
            continue
        try:
            sn = int(sem)
        except ValueError:
            sn = 1
        scode, sname, sord = SEM.get(sn, SEM[1])
        kyN = sn if sn >= 1 else 1
        slug = code.lower() + '-' + slugify(name)
        C, T, Th, M = jss(code), jss(name), jss(htxt(name)), jss(majvi)
        body = f"""/**
 * {code} — {name}.
 * SINH TỰ ĐỘNG (khung chương trình), chưa có bài giảng.
 *
 * Môn này nằm trong khung chương trình FPTU nhưng Academy CHƯA dựng nội dung.
 * File tồn tại để môn hiện đủ trong lộ trình {sname} và để sinh viên tra được
 * mã môn, tên môn, vị trí trong khung. Nguồn: FLM View Curriculum + FAP.
 * Khi dựng nội dung thật thì thay cả file này, GIỮ NGUYÊN slug.
 */
export default {{
  semester: {{ code: '{scode}', name: '{sname}', ordinal: {sord} }},
  course: {{
    courseCode: '{C}',
    slug: '{slug}',
    title: '{T}',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/{code}.webp',
    shortDescription: 'Subject in the FPTU curriculum — {M}, semester {kyN}. Lessons are not written yet.|||Môn trong khung chương trình FPTU — {M}, kỳ {kyN}. Bài giảng chưa được dựng.',
    description: 'Môn <strong>{C} — {Th}</strong> thuộc khung chương trình {M}, kỳ {kyN}.<br><br>Academy đã tạo sẵn môn này để bạn tra được mã môn, tên môn và vị trí trong lộ trình. <strong>Phần bài giảng chưa được dựng</strong> — khi có, toàn bộ nội dung sẽ được xây từ chính giáo trình của trường.',
    whatYouLearn: 'Chưa có nội dung. Xem giáo trình chính thức trên FLM (flm.fpt.edu.vn) để biết chuẩn đầu ra của môn.',
    requirements: 'Xem điều kiện tiên quyết trong khung chương trình {M} trên FLM.',
  }},
  sections: [],
}};
"""
        open(os.path.join(ACAD, code + '.mjs'), 'w', encoding='utf-8').write(body)
        cov.write(f"{code}\t{name}\t{tone}\n")
        made += 1
    cov.close()
    print(f'tạo stub: {made} | bỏ qua (đã có file): {skipped}')

if __name__ == '__main__':
    main()
