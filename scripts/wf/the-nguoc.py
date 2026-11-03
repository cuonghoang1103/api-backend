#!/usr/bin/env python3
"""Chèn thẻ liên kết chéo CHIỀU NGƯỢC (bài khoá khác → bài Nền tảng Web) vào cuối content của đúng bài đích.
   python3 scripts/wf/the-nguoc.py <tệp-đích> <slug-đích> <slug-wf> '<tiêu đề EN>' '<mô tả EN>' '<tiêu đề VI>' '<mô tả VI>'
   Thẻ thêm vào cuối template literal `content` của bài: một khối .ml-en và một khối .ml-vi (cùng dạng lienKet()).
   Đã có thẻ trỏ cùng slug-wf trong bài ⇒ bỏ qua (chạy lại an toàn)."""
import sys, re

def str_end(s, i):
    q = s[i]; i += 1
    while s[i] != q:
        i += 2 if s[i] == '\\' else 1
    return i + 1

def tpl_end(s, i):  # i: ngay sau dấu ` mở; trả về vị trí dấu ` đóng
    while True:
        c = s[i]
        if c == '\\': i += 2
        elif c == '`': return i
        elif s.startswith('${', i): i = expr_end(s, i + 2)
        else: i += 1

def expr_end(s, i):  # i: ngay sau ${ ; trả về vị trí sau } đóng
    depth = 0
    while True:
        c = s[i]
        if c in '\'"': i = str_end(s, i)
        elif c == '`': i = tpl_end(s, i + 1) + 1
        elif c == '{': depth += 1; i += 1
        elif c == '}':
            if depth == 0: return i + 1
            depth -= 1; i += 1
        elif s.startswith('//', i): i = s.index('\n', i)
        elif s.startswith('/*', i): i = s.index('*/', i) + 2
        else: i += 1

def card(slug, title, sub, cta):
    return (f'<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug={slug}" target="_blank" rel="noopener">\n'
            f'  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">{title}</span><span class="lc-sub">{sub}</span></span>\n'
            f'  <span class="lc-cta">{cta}</span>\n</a>')

f, slug, wf, te, se, tv, sv = sys.argv[1:8]
s = open(f).read()
m = re.search(r"slug:\s*['\"]" + re.escape(slug) + r"['\"]", s)
if not m: sys.exit(f'không thấy slug {slug} trong {f}')
nxt = re.compile(r"\bslug:\s*['\"]").search(s, m.end())
end_obj = nxt.start() if nxt else len(s)
c = s.find('content:', m.end(), end_obj)
if c < 0:
    prev = [x.end() for x in re.finditer(r"\bslug:\s*['\"]", s[:m.start()])]
    c = s.rfind('content:', prev[-1] if prev else 0, m.start())
if c < 0: sys.exit(f'không thấy content của {slug}')
k = c + len('content:')
while s[k] in ' \n': k += 1
if s[k] != '`': sys.exit(f'content của {slug} không phải template literal ({s[k:k+20]!r})')
close = tpl_end(s, k + 1)
body = s[k + 1:close]
if f'lessonSlug={wf}"' in body:
    print(f'= {slug} đã có thẻ tới {wf}'); sys.exit(0)
add = (f'\n<div class="ml-en">\n{card(wf, te, se, "Open lesson")}\n</div>\n'
       f'<div class="ml-vi">\n{card(wf, tv, sv, "Mở bài")}\n</div>\n')
s = s[:close] + add + s[close:]
open(f, 'w').write(s)
print(f'+ {f} · {slug} ← {wf}')
