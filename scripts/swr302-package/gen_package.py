# -*- coding: utf-8 -*-
"""Sinh content/academy/swr302/package-<topic>.mjs từ thư mục deliverables của một đề tài."""
import io, os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from md2lesson import convert

def js_str(s):
    """Nhúng an toàn vào template literal của JS."""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def build(topic, root, out, section_title, section_desc, header, lessons, root_vi=None):
    parts = [header, "import { bi } from './_slides.mjs';\n"]
    names = []
    for i, L in enumerate(lessons, 1):
        # Thân tài liệu: song ngữ khi có bản dịch bên cạnh, nếu không thì giữ một bản.
        # Nội dung KHÔNG nằm trong khối ml-* sẽ hiện ở CẢ hai ngôn ngữ — đó là lý do
        # trước 19/09/2026 bấm sang tiếng Việt mà tài liệu vẫn nguyên tiếng Anh.
        if L.get('file'):
            en_path = os.path.join(root, L['file'])
            vi_path = os.path.join(root_vi, L['file']) if root_vi else None
            if vi_path and os.path.exists(vi_path):
                body = ('<div class="ml-en">' + convert(en_path) + '</div>\n'
                        '<div class="ml-vi">' + convert(vi_path) + '</div>')
            else:
                body = convert(en_path)
        else:
            body = L.get('html','')
        extra = L.get('extra','')
        extra_line = ('\n    `' + js_str(extra) + '`,') if extra else ''
        const = f"{topic}L{i}"
        names.append(const)
        parts.append(f"""
const {const} = {{
  title: {json.dumps(L['title'], ensure_ascii=False)},
  slug: {json.dumps(L['slug'], ensure_ascii=False)},
  type: 'DOCUMENT',{ "\n  isFreePreview: true," if L.get('preview') else "" }
  description: {json.dumps(L['desc'], ensure_ascii=False)},
  content: [
    bi(
      `{js_str(L['en'])}`,
      `{js_str(L['vi'])}`,
    ),{extra_line}
    `{js_str(body)}`,
  ].join('\\n'),
}};
""")
    parts.append(f"""
export default {{
  title: {json.dumps(section_title, ensure_ascii=False)},
  description: {json.dumps(section_desc, ensure_ascii=False)},
  lessons: [{', '.join(names)}],
}};
""")
    io.open(out, 'w', encoding='utf-8').write(''.join(parts))
    total = sum(os.path.getsize(out) for _ in [0])
    print(f'✅ {out} — {len(lessons)} bài, {total:,} bytes')
