#!/usr/bin/env python3
"""Rebuild a LAB211 exercise body from an author-supplied PDF brief.

The class diagrams in these PDFs are vector art, and their labels come back
from get_text() interleaved with the prose. So: locate each "Figure N." caption,
treat the band above it (down to the previous prose block) as the figure, render
THAT band to a PNG, and drop the text blocks that fall inside it — otherwise the
diagram's labels reappear as garbled paragraphs.
"""
import json, os, re, sys
import fitz

sys.path.insert(0, '.')

CAPTION = re.compile(r'^\s*(Figure|Fig\.?)\s*\d+\s*[.:]', re.I)


def page_figures(page):
    """[(band_rect, caption_text)] for every 'Figure N.' caption on the page."""
    blocks = [b for b in page.get_text('blocks') if b[6] == 0 and b[4].strip()]
    blocks.sort(key=lambda b: b[1])
    figs = []
    for i, b in enumerate(blocks):
        if not CAPTION.match(b[4]):
            continue
        top = blocks[i - 1][3] if i else page.rect.y0 + 20
        # walk back over blocks that sit inside the drawing (diagram labels):
        # anything whose left edge is indented well past the text column.
        j = i - 1
        while j >= 0 and blocks[j][3] > top - 200 and _looks_like_label(blocks[j]):
            top = blocks[j - 1][3] if j else page.rect.y0 + 20
            j -= 1
        band = fitz.Rect(page.rect.x0 + 20, top + 2, page.rect.x1 - 20, b[1] - 2)
        if band.height > 30:
            figs.append((band, b[4].strip(), j + 1, i))
    return figs


SECTION_WORDS = (
    'title', 'background', 'background context', 'program specifications',
    'function details', 'expectation of user interface', 'guidelines',
    'technical requirements', 'requirements', 'example', 'examples',
    'suggestion', 'hint', 'deliverables', 'note', 'notes',
)


def _starts_item(line):
    t = line.strip()
    if re.match(r'^([-•▪●–*o]|\d+(\.\d+)*[.)])\s+', t):
        return True
    if t.rstrip(':').lower() in SECTION_WORDS:
        return True
    return bool(re.match(r'^(Function|Option|Task|Step)\s*\d+\s*[:.]', t))


def _rejoin(text):
    """Wrapped visual lines -> logical paragraphs / list items."""
    items = []
    for line in text.split('\n'):
        if not line.strip():
            continue
        if not items or _starts_item(line):
            items.append(line.strip())
        else:
            prev = items[-1]
            # a previous line ending in sentence punctuation plus a new
            # capitalised start is a genuine new paragraph inside one block
            if prev.endswith(('.', ':', '?', '!')) and re.match(r'^[A-Z«]', line.strip()) and len(prev) > 90:
                items.append(line.strip())
            else:
                items[-1] = prev + ' ' + line.strip()
    return items


def _looks_like_label(b):
    t = b[4].strip()
    return len(t) < 260 and not t.rstrip().endswith(('.', ':', ';')) or '«' in t


def extract(pdf_path, lab, outdir):
    doc = fitz.open(pdf_path)
    os.makedirs(outdir, exist_ok=True)
    blocks_out, images = [], []
    fig_no = 0
    for pno, page in enumerate(doc):
        figs = page_figures(page)
        skip = set()
        for band, cap, lo, hi in figs:
            for k in range(lo, hi + 1):
                skip.add(k)
        tblocks = [b for b in page.get_text('blocks') if b[6] == 0 and b[4].strip()]
        tblocks.sort(key=lambda b: b[1])
        fig_at = {hi: (band, cap) for band, cap, lo, hi in figs}

        for idx, b in enumerate(tblocks):
            if idx in fig_at:
                band, cap = fig_at[idx]
                fig_no += 1
                pix = page.get_pixmap(clip=band, dpi=200)
                fn = os.path.join(outdir, f'{lab}_figure{fig_no}.png')
                pix.save(fn)
                images.append((fn, cap))
                blocks_out.append({'t': 'img', 'file': fn, 'caption': cap})
                continue
            if idx in skip:
                continue
            # A PDF text block comes back as one VISUAL line per \n. Emitting
            # each as its own paragraph shatters prose into fragments, so join
            # wrapped lines back together and only break on a real new item:
            # a bullet, a numbered step, or a known section heading.
            for item in _rejoin(b[4]):
                blocks_out.append({'t': 'raw', 'text': item})
    return blocks_out, images


if __name__ == '__main__':
    import sys as _s
    pairs = [(a.split('=')[0], a.split('=', 1)[1]) for a in _s.argv[1:]]
    for lab, src in pairs:
        blocks, imgs = extract(src, lab, 'out/media/' + lab)
        json.dump(blocks, open(f'out/{lab}.pdfblocks.json', 'w'), ensure_ascii=False, indent=1)
        print(f'{lab}: {len(blocks)} khối, {len(imgs)} hình')
        for fn, cap in imgs:
            print('   ', os.path.basename(fn), '-', cap[:70])
