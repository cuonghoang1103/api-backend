#!/usr/bin/env python3
"""Render each LAB211 brief to a PDF, from the SAME blocks the web page is
built from — so the PDF and the page can never drift apart.

Not a byte-for-byte copy of the Word layout (no Office on this machine); it is
a clean typeset of the same content: headings, lists, tables, the figures at
their original position, and console samples in a monospace box.
"""
import json, os, re, sys
from fpdf import FPDF
from fpdf.enums import XPos, YPos

sys.path.insert(0, '.')
from build import load_blocks, strip_header, SECTIONS, is_heading  # noqa: E402

F = '/System/Library/Fonts/Supplemental/'
MEDIA = 'out/media'
OUT = 'pdf'
ORANGE = (242, 112, 36)
GREY = (110, 110, 110)


class Brief(FPDF):
    def __init__(self, meta):
        super().__init__(format='A4')
        self.meta = meta
        self.set_auto_page_break(True, margin=18)
        for style, fn in [('', 'Arial.ttf'), ('B', 'Arial Bold.ttf'), ('I', 'Arial Italic.ttf')]:
            self.add_font('Arial', style, F + fn)
        self.add_font('Mono', '', F + 'Courier New.ttf')

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font('Arial', '', 8)
        self.set_text_color(*GREY)
        self.cell(0, 5, f"LAB211 · {self.meta['lab']} · {self.meta['title']}",
                  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def footer(self):
        self.set_y(-14)
        self.set_font('Arial', '', 8)
        self.set_text_color(*GREY)
        self.cell(0, 5, f'Page {self.page_no()}', align='C')


def clean(s):
    """fpdf handles unicode via the TTF, but tabs and NBSP need normalising."""
    return (s.replace('\t', '    ').replace('\xa0', ' ')
             .replace('’', "'").replace('‘', "'")
             .replace('“', '"').replace('”', '"'))


def render_pdf(lab, meta, blocks, path):
    pdf = Brief(meta)
    pdf.add_page()
    W = pdf.w - pdf.l_margin - pdf.r_margin

    # ── title block
    pdf.set_font('Arial', 'B', 17)
    pdf.set_text_color(20, 20, 20)
    pdf.multi_cell(W, 8, clean(meta['title']), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('Arial', '', 10)
    pdf.set_text_color(*ORANGE)
    bits = [meta['lab'], meta.get('type') or 'Assignment']
    if meta.get('loc'):
        bits.append(f"{meta['loc']} LOC")
    if meta.get('slot(s)'):
        bits.append(f"{meta['slot(s)']} slot(s)")
    pdf.cell(0, 6, '  ·  '.join(bits), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_draw_color(*ORANGE)
    pdf.set_line_width(0.6)
    pdf.line(pdf.l_margin, pdf.get_y() + 2, pdf.w - pdf.r_margin, pdf.get_y() + 2)
    pdf.ln(6)

    for b in blocks:
        if b['t'] == 'img':
            fn = os.path.join(MEDIA, lab, os.path.basename(b['file']))
            if os.path.exists(fn):
                try:
                    w = min(W, 150)
                    if pdf.will_page_break(60):
                        pdf.add_page()
                    pdf.image(fn, x=(pdf.w - w) / 2, w=w)
                    pdf.ln(4)
                except Exception:
                    pass
            continue

        if b['t'] == 'pre':
            pdf.set_font('Mono', '', 8)
            pdf.set_text_color(30, 30, 30)
            pdf.set_fill_color(245, 245, 245)
            pdf.multi_cell(W, 4.2, clean(b['text']), border=0, fill=True,
                           new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.ln(3)
            continue

        if b['t'] == 'table':
            rows = b['rows']
            ncol = max(len(r) for r in rows)
            cw = W / ncol
            pdf.set_font('Arial', '', 8.5)
            for ri, r in enumerate(rows):
                cells = list(r) + [''] * (ncol - len(r))
                heights = []
                for c in cells:
                    heights.append(len(pdf.multi_cell(cw, 4.5, clean(c), dry_run=True,
                                                      output='LINES')) * 4.5)
                h = max(max(heights), 5)
                if pdf.will_page_break(h):
                    pdf.add_page()
                y0 = pdf.get_y()
                for ci, c in enumerate(cells):
                    pdf.set_xy(pdf.l_margin + ci * cw, y0)
                    pdf.set_font('Arial', 'B' if ri == 0 else '', 8.5)
                    pdf.set_fill_color(240, 240, 240)
                    pdf.multi_cell(cw, 4.5, clean(c), border=1, fill=(ri == 0),
                                   new_x=XPos.RIGHT, new_y=YPos.TOP, max_line_height=4.5)
                pdf.set_xy(pdf.l_margin, y0 + h)
            pdf.ln(4)
            continue

        text = clean(b['text'].strip())
        if not text:
            continue

        h = is_heading(b)
        sub = re.match(r'^(Function|Option|Task|Step)\s*\d+\s*[:.]', text) and len(text) < 90
        if h:
            if pdf.will_page_break(14):
                pdf.add_page()
            pdf.ln(2)
            pdf.set_font('Arial', 'B', 12)
            pdf.set_text_color(*ORANGE)
            pdf.multi_cell(W, 6, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.ln(1)
        elif sub:
            pdf.ln(1)
            pdf.set_font('Arial', 'B', 10)
            pdf.set_text_color(40, 40, 40)
            pdf.multi_cell(W, 5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        elif b['list']:
            pdf.set_font('Arial', '', 9.5)
            pdf.set_text_color(30, 30, 30)
            indent = 5 + b['level'] * 5
            pdf.set_x(pdf.l_margin + indent)
            pdf.multi_cell(W - indent, 4.8, ('•  ' if b['list'] == 'ul' else '–  ') + text,
                           new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        else:
            pdf.set_font('Arial', '', 9.5)
            pdf.set_text_color(30, 30, 30)
            pdf.multi_cell(W, 4.8, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.ln(1)

    pdf.output(path)


def main():
    os.makedirs(OUT, exist_ok=True)
    metas = {m['lab']: m for m in json.load(open('meta.json'))}
    made, failed = [], []
    for lab, meta in metas.items():
        meta.setdefault('title', lab)
        try:
            blocks = strip_header(load_blocks(lab, meta))
            path = f'{OUT}/{lab}.pdf'
            render_pdf(lab, meta, blocks, path)
            made.append((lab, os.path.getsize(path)))
        except Exception as ex:
            failed.append((lab, repr(ex)[:120]))
    for lab, sz in sorted(made):
        print(f'  {lab:14} {sz/1024:7.0f} KB')
    print(f'\nTạo được {len(made)} PDF | lỗi {len(failed)}')
    for lab, err in failed:
        print('  LỖI', lab, err)


if __name__ == '__main__':
    main()
