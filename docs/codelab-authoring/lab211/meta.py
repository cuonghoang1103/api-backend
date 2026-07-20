#!/usr/bin/env python3
"""Pull the LAB211 header metadata (Type / Code / LOC / Slots / Title) out of
every lab, whichever source format it has: docx-extracted JSON, plain .txt, or
the P0101 markdown. Prints a table and writes meta.json."""
import json, os, re, sys

SRC = os.path.expanduser('~/Documents/Lab211')
OUT = 'out'


def from_docx_json(lab):
    p = os.path.join(OUT, lab + '.json')
    if not os.path.exists(p):
        return None
    blocks = json.load(open(p))['blocks']
    meta = {}
    # header table: rows of [label?, key, value] pairs
    for b in blocks:
        if b['t'] != 'table':
            continue
        flat = [c.strip() for row in b['rows'] for c in row]
        for i, c in enumerate(flat):
            k = c.rstrip(':').strip().lower()
            if k in ('type', 'code', 'loc', 'slot(s)', 'slots') and i + 1 < len(flat):
                meta[k] = flat[i + 1].strip()
        break
    # Title: the paragraph after the "Title" label
    texts = [b['text'].strip() for b in blocks if b['t'] == 'p']
    for i, t in enumerate(texts):
        if t.lower().rstrip(':') == 'title' and i + 1 < len(texts):
            meta['title'] = texts[i + 1].strip(' \t.')
            break
    return meta


def read_text(p):
    """LAB211 .txt files are Windows-1252, not UTF-8 (apostrophes and bullets
    come out as U+FFFD if you assume UTF-8) and CRLF-terminated — the stray
    \r ends up inside extracted titles if it is not normalised here."""
    raw = open(p, 'rb').read()
    try:
        txt = raw.decode('utf-8')
    except UnicodeDecodeError:
        txt = raw.decode('cp1252', errors='replace')
    return txt.replace('\r\n', '\n').replace('\r', '\n')


def from_pdf_or_md(lab):
    for p in (f'{OUT}/{lab}.txt', f'{SRC}/{lab}/README.md'):
        if not os.path.exists(p):
            continue
        s = read_text(p)
        meta = {}
        for key, pat in [('type', r'Type:\s*\n?\s*(.+)'), ('loc', r'LOC:\s*\n?\s*(\d+)'),
                         ('slot(s)', r'Slot\(s\):\s*\n?\s*(.+)')]:
            m = re.search(pat, s)
            if m:
                meta[key] = m.group(1).strip()
        m = re.search(r'(?:^|\n)#*\s*Title\s*\n+\s*(.+)', s)
        if m:
            meta['title'] = m.group(1).strip(' \t.')
        return meta
    return None


def from_txt(lab):
    p = os.path.join(SRC, lab, lab + '.txt')
    if not os.path.exists(p):
        return None
    s = read_text(p)
    if 'LAB211 Assignment' not in s and 'Program Specifications' not in s:
        return None
    meta = {}
    for key, pat in [('type', r'Type:\s*\n?\s*(Short Assignment|Long Assignment)'),
                     ('code', r'Code:\s*\n?\s*(J1\.[LS]\.P\d+)'),
                     ('loc', r'LOC:\s*\n?\s*(\d+)'),
                     ('slot(s)', r'Slot\(s\):\s*\n?\s*(\d+|N/A)')]:
        m = re.search(pat, s)
        if m:
            meta[key] = m.group(1).strip()
    m = re.search(r'Title\s*\n\s*(.+)', s)
    if m:
        meta['title'] = m.group(1).strip(' \t.')
    return meta


ROWS = []
labs = sorted(d for d in os.listdir(SRC) if os.path.isdir(os.path.join(SRC, d)))
for lab in labs:
    m = from_docx_json(lab) or {}
    if not m.get('loc') or not m.get('title'):
        t = from_txt(lab) or from_pdf_or_md(lab) or {}
        for k, v in t.items():
            m.setdefault(k, v)
    m['lab'] = lab
    src = 'docx' if os.path.exists(os.path.join(OUT, lab + '.json')) else (
        'pdf' if any(f.endswith('.pdf') for f in os.listdir(os.path.join(SRC, lab))) else
        'md' if any(f.endswith('.md') for f in os.listdir(os.path.join(SRC, lab))) else 'txt')
    m['src'] = src
    ROWS.append(m)

miss = [r for r in ROWS if not r.get('loc')]
print(f'{"LAB":14} {"SRC":5} {"LOC":>5} {"SLOT":>5}  TITLE')
for r in sorted(ROWS, key=lambda r: (int(re.sub(r'\D', '', r.get('loc') or '0') or 0), r['lab'])):
    print(f'{r["lab"]:14} {r["src"]:5} {r.get("loc","-"):>5} {r.get("slot(s)","-"):>5}  {r.get("title","")[:60]}')
print(f'\nTotal {len(ROWS)} | missing LOC: {len(miss)} -> {[r["lab"] for r in miss]}')
json.dump(ROWS, open('meta.json', 'w'), ensure_ascii=False, indent=1)
