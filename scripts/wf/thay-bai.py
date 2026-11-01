#!/usr/bin/env python3
"""thay-bai.py <chapter.mjs> <slug> <ten_bien> <duong_import>
Thay object bài (khối '    {' … '    },' chứa slug) bằng '    <ten_bien>,' và thêm import sau dòng import _slides."""
import sys, re
f, slug, var, imp = sys.argv[1:5]
L = open(f).read().split('\n')
i = next(k for k, l in enumerate(L) if re.search(r"slug: '%s'" % re.escape(slug), l))
a = max(k for k in range(i) if L[k] == '    {')
b = min(k for k in range(i, len(L)) if L[k] == '    },')
L[a:b+1] = ['    %s,' % var]
# xoá chú thích phân cách ngay trên (nếu có)
line = "import %s from '%s';" % (var, imp)
if line not in L:
    j = next(k for k, l in enumerate(L) if l.startswith('import ') and '_slides.mjs' in l)
    L.insert(j + 1, line)
open(f, 'w').write('\n'.join(L))
print('ok', slug, 'lines', a, b)
