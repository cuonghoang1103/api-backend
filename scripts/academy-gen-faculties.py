#!/usr/bin/env python3
"""
academy-gen-faculties.py — sinh frontend/src/data/fptuFaculties.ts từ HTML khung
FLM đã cache (scripts/academy-pull-curriculum.py --cache-dir).

Mô hình 3 cấp cho onboarding /academy:
  Khối ngành (Faculty) → Ngành chính (Major) → Ngành hẹp (Combo, LÁ) → môn.
Mỗi LÁ mang khung 9 kỳ RIÊNG (semesters: kỳ→[mã môn]) — nguồn để LỌC đúng ~40
môn của ngành hẹp đó (không đổ hết ra).

Khối CNTT (IT) KHÔNG sinh ở đây — nó dùng FPTU_MAJORS sẵn có (có combo riêng).
File này chỉ sinh các khối MỚI: Kinh doanh, Truyền thông, Ngôn ngữ, KHMT.

  python3 scripts/academy-gen-faculties.py <cacheRoot> > frontend/src/data/fptuFaculties.ts
"""
import re, os, sys, json

CACHE = sys.argv[1]

# Khối → (meta khối, danh sách ngành chính) ; mỗi ngành chính → (meta, dir cache, [spec code])
# spec code là tên file <SPEC>.html trong dir cache.
def specs_in(d):
    p = os.path.join(CACHE, d)
    if not os.path.isdir(p): return []
    return sorted(f[:-5] for f in os.listdir(p) if f.endswith('.html'))

# Nhãn tiếng Việt + icon cho từng ngành hẹp (fallback: hậu tố mã).
VI = {
 'BBA_MKT':('Marketing','📣'),'BBA_IB':('Kinh doanh quốc tế','🌐'),'BBA_FIN':('Tài chính','💰'),
 'BBA_CF':('Tài chính doanh nghiệp','🏦'),'BBA_SF':('Tài chính thông minh','🤖'),
 'BBA_IF':('Tài chính (Đầu tư)','💱'),'BBA_BF':('Ngân hàng & Tài chính','🏛️'),
 'BBA_EC':('Thương mại điện tử','🛒'),'BBA_GL':('Logistics & Chuỗi cung ứng','🚚'),
 'BBA_FT':('Công nghệ tài chính (Fintech)','💳'),'BBA_HM':('Quản trị khách sạn','🏨'),
 'BBA_TM':('Du lịch & Lữ hành','✈️'),'BBA_EE':('Giải trí & Sự kiện','🎉'),
 'BBA_CX':('Trải nghiệm khách hàng','🤝'),'BBA_PM':('Quản trị thu mua','📦'),
 'BBA_BA':('Phân tích kinh doanh','📊'),'BBA_BSA':('Phân tích hệ thống KD','📈'),
 'BBA_MC':('Truyền thông Marketing','📢'),
 'BCT_MC':('Truyền thông đa phương tiện','🎬'),'BCT_PR':('Quan hệ công chúng','🗣️'),
 'BCT_IMC':('Truyền thông Marketing tích hợp','📡'),'BCT_BC':('Truyền thông thương hiệu','🏷️'),
 'BEN_ENG':('Ngôn ngữ Anh','🇬🇧'),'BEN_BE':('Tiếng Anh thương mại','💬'),
 'BEN_EL':('Anh — Giảng dạy','🎓'),'BEN_CHN':('Anh — Tiếng Trung','🀄'),
 'BJP_EN':('Ngôn ngữ Nhật','🎌'),
 'BKR_BK':('Ngôn ngữ Hàn','🇰🇷'),'BKR_EN':('Hàn — Song ngữ Anh','🗨️'),
 'BCH_CL':('Ngôn ngữ Trung','🇨🇳'),'BCH_BC':('Trung — Thương mại','🧧'),'BCH_EN':('Trung — Song ngữ Anh','💠'),
 'BCS_AD':('AI & Khoa học dữ liệu','🧠'),'BCS_CD':('An ninh mạng & An toàn số','🛡️'),
}

# Cấu trúc khối → ngành chính → [dir/specs]. Ngành hẹp = spec.
FACULTIES = [
  {'id':'business','nameVi':'Quản trị Kinh doanh','name':'Business Administration','icon':'💼',
   'majors':[{'id':'bba','nameVi':'Quản trị Kinh doanh','name':'Business Administration','icon':'💼','dir':'bba'}]},
  {'id':'communication','nameVi':'Công nghệ Truyền thông','name':'Communication Technology','icon':'📺',
   'majors':[{'id':'bct','nameVi':'Công nghệ Truyền thông','name':'Communication Technology','icon':'📺','dir':'BCT'}]},
  {'id':'language','nameVi':'Ngôn ngữ','name':'Languages','icon':'🗣️',
   'majors':[
     {'id':'ben','nameVi':'Ngôn ngữ Anh','name':'English Language','icon':'🇬🇧','dir':'BEN'},
     {'id':'bjp','nameVi':'Ngôn ngữ Nhật','name':'Japanese Language','icon':'🎌','dir':'BJP'},
     {'id':'bkr','nameVi':'Ngôn ngữ Hàn','name':'Korean Language','icon':'🇰🇷','dir':'BKR'},
     {'id':'bch','nameVi':'Ngôn ngữ Trung','name':'Chinese Language','icon':'🇨🇳','dir':'BCH'},
   ]},
  {'id':'cs','nameVi':'Khoa học Máy tính','name':'Computer Science','icon':'🧠',
   'majors':[{'id':'bcs','nameVi':'Khoa học Máy tính','name':'Computer Science','icon':'🧠','dir':'BCS'}]},
]

def parse_sem(html):
    """→ dict kỳ(int)→[mã môn] (bỏ mã giữ chỗ *_COM*)."""
    sem = {}
    for r in re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.S):
        cells = [re.sub(r'<[^>]+>','',c).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.S)]
        if len(cells) < 3: continue
        code = cells[0]
        if not re.fullmatch(r'[A-Z]{2,4}\d{3}[a-z]?', code): continue
        try: s = int(cells[2])
        except: continue
        if s < 1 or s > 9: continue
        sem.setdefault(s, [])
        if code not in sem[s]: sem[s].append(code)
    return sem

def combo_for(spec, html):
    vi, icon = VI.get(spec, (spec.split('_')[-1], '📘'))
    return {'id': spec.lower(), 'code': spec, 'nameVi': vi, 'name': vi, 'icon': icon,
            'semesters': parse_sem(html)}

out_facs = []
for fac in FACULTIES:
    majors = []
    for mj in fac['majors']:
        combos = []
        for spec in specs_in(mj['dir']):
            html = open(os.path.join(CACHE, mj['dir'], spec+'.html'), encoding='utf-8', errors='ignore').read()
            combos.append(combo_for(spec, html))
        if not combos: continue
        majors.append({'id':mj['id'],'nameVi':mj['nameVi'],'name':mj['name'],'icon':mj['icon'],'combos':combos})
    out_facs.append({'id':fac['id'],'nameVi':fac['nameVi'],'name':fac['name'],'icon':fac['icon'],'majors':majors})

hdr = '''/**
 * fptuFaculties.ts — SINH TỰ ĐỘNG bởi scripts/academy-gen-faculties.py.
 * Khối ngành ngoài CNTT (Kinh doanh, Truyền thông, Ngôn ngữ, KHMT) cho onboarding
 * /academy: Khối → Ngành chính → Ngành hẹp → khung 9 kỳ RIÊNG (để LỌC đúng môn).
 * Nguồn: FLM CurriculumDetails (khoá mới nhất mỗi chuyên ngành). ĐỪNG sửa tay —
 * chạy lại generator. Khối CNTT dùng FPTU_MAJORS ở fptuCurriculum.ts (có combo riêng).
 */
export interface FacultyCombo { id: string; code: string; nameVi: string; name: string; icon: string; semesters: Record<number, string[]>; }
export interface FacultyMajor { id: string; nameVi: string; name: string; icon: string; combos: FacultyCombo[]; }
export interface Faculty { id: string; nameVi: string; name: string; icon: string; majors: FacultyMajor[]; }

export const EXTRA_FACULTIES: Faculty[] = '''
print(hdr + json.dumps(out_facs, ensure_ascii=False, indent=2) + ';\n')
