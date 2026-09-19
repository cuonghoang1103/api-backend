# -*- coding: utf-8 -*-
"""Chuyển một deliverable Markdown thành khối HTML dùng được trong bài học Academy.

Chỉ sinh các thẻ nằm trong allowlist của sanitizeHtml (DOMPurify) ở
frontend/src/lib/utils.ts. Không sinh <svg>, không sinh thuộc tính lạ.
"""
import io, re, sys, markdown

HTML_TAGS = set('p br strong em u s code pre h1 h2 h3 h4 h5 h6 ul ol li blockquote a img '
                'table thead tbody tr th td span div hr b i sup sub small'.split())

def escape_pseudo_tags(src):
    """<Team Leader name>, <N>, <date> ... trông như thẻ HTML nên DOMPurify gỡ sạch.
    Escape mọi `<x...>` không phải thẻ thật, giữ nguyên thẻ thật."""
    def repl(m):
        inner = m.group(1)
        name = inner.lstrip('/').split()[0].lower() if inner.lstrip('/').split() else ''
        if name in HTML_TAGS:
            return m.group(0)
        return '&lt;' + inner + '&gt;'
    return re.sub(r'<([^<>\n]{1,60})>', repl, src)

LIST_RE = re.compile(r'^\s*(?:[-*+] |\d+[.)] )')

def tach_khoi(src):
    """Python-Markdown chỉ nhận BẢNG và DANH SÁCH khi chúng MỞ ĐẦU một khối.

    Thiếu một dòng trống phía trên thì cả bảng bị nuốt vào <p> và hiện ra
    nguyên dạng `| a | b |` trên trang — đo thật 19/09/2026: 28 dòng thô
    trong 4 bài của bộ TP1/TP2, trong đó có bảng quan hệ include/extend
    13 dòng của use case diagram TP2.

    Chèn một dòng trống trước mỗi khối như vậy. Bỏ qua phần trong ``` ```.
    """
    out, trong_fence = [], False
    for i, dong in enumerate(src.split('\n')):
        if dong.lstrip().startswith('```'):
            trong_fence = not trong_fence
        if not trong_fence and out:
            truoc = out[-1].strip()
            hien = dong.strip()
            mo_bang = hien.startswith('|') and truoc and not truoc.startswith('|')
            mo_list = bool(LIST_RE.match(dong)) and truoc and not LIST_RE.match(out[-1]) \
                      and not truoc.endswith(('\\', '|'))
            if mo_bang or mo_list:
                out.append('')
        out.append(dong)
    return '\n'.join(out)

def convert(path, drop_front=0):
    src = io.open(path, encoding='utf-8').read()
    src = escape_pseudo_tags(src)
    lines = src.split('\n')
    if drop_front:
        lines = lines[drop_front:]
    src = tach_khoi('\n'.join(lines))
    html = markdown.markdown(src, extensions=['tables','sane_lists','attr_list'])
    # blockquote -> callout (class được CSS của trang hỗ trợ)
    html = html.replace('<blockquote>', '<div class="callout">').replace('</blockquote>', '</div>')
    # h1 của tài liệu -> h2 để không đụng tiêu đề bài học
    html = re.sub(r'<h1>(.*?)</h1>', r'<h2>\1</h2>', html, flags=re.S)
    html = re.sub(r'<h2>(.*?)</h2>', lambda m: '<h3>'+m.group(1)+'</h3>' if m.group(1).startswith(('1.','2.','3.','4.','5.','6.','7.','8.')) else m.group(0), html, flags=re.S)
    # backtick inline đã thành <code> — giữ nguyên
    return html

if __name__ == '__main__':
    print(convert(sys.argv[1], int(sys.argv[2]) if len(sys.argv)>2 else 0))
