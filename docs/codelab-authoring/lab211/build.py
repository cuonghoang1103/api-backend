#!/usr/bin/env python3
"""Build the LAB211 Code Lab payload.

Source of truth is the original brief — the text is reproduced faithfully,
never paraphrased. Images are inlined at the position they occupy in the
Word document. Nothing about the task is invented: fields that the brief
does not state are left null.
"""
import html as H
import json, os, re, sys

SRC = os.path.expanduser('~/Documents/Lab211')
IMG = json.load(open('img-urls.json'))

SECTIONS = {
    'title', 'background', 'background context', 'program specifications',
    'function details', 'expectation of user interface', 'guidelines',
    'technical requirements', 'requirements', 'example', 'examples',
    'suggestion', 'hint', 'deliverables', 'note', 'notes',
    'student must implement methods', 'student must implement the methods',
    'algorithm', 'the ideas of insertion',
}


def is_heading(b):
    if b['t'] != 'p' or b['list']:
        return None
    t = b['text'].strip().rstrip(':').strip()
    if t.lower() in SECTIONS and len(t) < 50:
        return t
    if b['style'] in ('Heading1', 'Heading2', 'Heading3') and len(t) < 80:
        return t
    return None


def esc(s):
    return H.escape(s, quote=False)


def looks_tabular(t):
    """A console-sample line: has a tab, a pipe column separator, or a run of
    aligning whitespace — ordinary spaces OR the non-breaking spaces Word uses
    to line up columns (binary-search step traces, expense tables)."""
    return ('\t' in t or '|' in t
            or re.search(r'\S {3,}\S', t)
            or re.search(r'\S\xa0{2,}\S', t))


def render(blocks, code):
    """blocks -> HTML, preserving order, lists, tables and images."""
    out = []
    i = 0
    open_list = []          # stack of ('ul'|'ol', level)
    ol_seen = {}            # level -> how many <ol> items emitted since the last heading

    def close_lists(to=0):
        while len(open_list) > to:
            kind, _ = open_list.pop()
            out.append(f'</{kind}>')

    while i < len(blocks):
        b = blocks[i]

        if b['t'] == 'img':
            close_lists()
            key = f"{code}__{os.path.basename(b['file'])}"
            url = IMG.get(key)
            if url:
                out.append(f'<figure><img src="{url}" alt="Figure from the original {code} brief" /></figure>')
            i += 1
            continue

        if b['t'] == 'pre':          # console sample lifted from a Word text box
            close_lists()
            out.append('<pre>' + esc(b['text']) + '</pre>')
            i += 1
            continue

        if b['t'] == 'table':
            close_lists()
            rows = b['rows']
            head, body = rows[0], rows[1:]
            out.append('<table><thead><tr>' +
                       ''.join(f'<th>{esc(c)}</th>' for c in head) +
                       '</tr></thead><tbody>')
            for r in body:
                out.append('<tr>' + ''.join(
                    f'<td>{esc(c).replace(chr(10), "<br />")}</td>' for c in r) + '</tr>')
            out.append('</tbody></table>')
            i += 1
            continue

        if (b['t'] == 'p' and not b['list']
                and re.match(r'^(Function|Option|Task|Step)\s*\d+\s*[:.]', b['text'].strip())
                and len(b['text'].strip()) < 90):
            close_lists()
            out.append(f"<h4>{esc(b['text'].strip())}</h4>")
            i += 1
            continue

        h = is_heading(b)
        if h:
            close_lists()
            ol_seen.clear()          # a new section restarts numbering
            out.append(f'<h3>{esc(h)}</h3>')
            i += 1
            continue

        # ── console-sample run: consecutive plain paragraphs that are aligned
        # text (tabs / pipes / column padding). Kept verbatim in <pre>.
        if b['t'] == 'p' and not b['list'] and looks_tabular(b['text']):
            close_lists()
            run = []
            while i < len(blocks):
                c = blocks[i]
                if c['t'] != 'p' or c['list'] or is_heading(c):
                    break
                if looks_tabular(c['text']) or (run and len(c['text']) < 70 and not c['text'].rstrip().endswith('.')):
                    run.append(c['text'])
                    i += 1
                else:
                    break
            out.append('<pre>' + esc('\n'.join(run)) + '</pre>')
            continue

        # ── list item
        if b['t'] == 'p' and b['list']:
            lvl = b['level']
            while len(open_list) > lvl + 1:
                kind, _ = open_list.pop()
                out.append(f'</{kind}>')
            if len(open_list) == lvl + 1 and open_list[-1][0] != b['list']:
                kind, _ = open_list.pop()
                out.append(f'</{kind}>')
            while len(open_list) < lvl + 1:
                lv = len(open_list)
                if b['list'] == 'ol' and ol_seen.get(lv):
                    out.append(f'<ol start="{ol_seen[lv] + 1}">')
                else:
                    out.append(f"<{b['list']}>")
                open_list.append((b['list'], lv))
            if b['list'] == 'ol':
                ol_seen[lvl] = ol_seen.get(lvl, 0) + 1
            out.append(f"<li>{esc(b['text'].strip())}</li>")
            i += 1
            continue

        close_lists()
        txt = b['text'].strip()
        if txt:
            out.append(f'<p>{esc(txt)}</p>')
        i += 1

    close_lists()
    html_out = '\n'.join(out)
    # A heading with nothing under it reads as an unfinished page; the original
    # briefs do leave e.g. "Guidelines" empty. Drop those trailing headings.
    prev = None
    while prev != html_out:
        prev = html_out
        html_out = re.sub(r'\n?<h[34]>[^<]*</h[34]>\s*$', '', html_out)
    return html_out


# ─── concepts / tags, derived from what the brief actually asks for ───
KEYWORDS = [
    (r'\bbubble sort\b', 'Bubble sort', 'sorting'),
    (r'\bselection sort\b', 'Selection sort', 'sorting'),
    (r'\binsertion sort\b', 'Insertion sort', 'sorting'),
    (r'\bquick ?sort\b', 'Quicksort', 'sorting'),
    (r'\bmerge sort\b', 'Merge sort', 'sorting'),
    (r'\bbinary search\b', 'Binary search', 'searching'),
    (r'\blinear search\b|\bsequential search\b', 'Linear search', 'searching'),
    (r'\bfibonacci\b', 'Fibonacci sequence', 'recursion'),
    (r'\bgraph\b|\badjacency\b', 'Graph representation', 'graphs'),
    (r'\bstack\b', 'Stack', 'data-structures'),
    (r'\brecursi', 'Recursion', 'recursion'),
    (r'\barraylist\b', 'ArrayList', 'collections'),
    (r'\bhash ?(table|map)\b', 'HashMap / Hashtable', 'collections'),
    (r'\bcollection\b', 'Java Collections', 'collections'),
    (r'\barray\b', 'Arrays', 'arrays'),
    (r'\bfile\b|\.txt\b|\.dat\b|\bread from file\b', 'File I/O', 'file-io'),
    (r'\bcsv\b', 'CSV parsing', 'file-io'),
    (r'\bzip\b|\bcompress', 'Compression streams', 'file-io'),
    (r'\bmd5\b|\bencrypt', 'Hashing / encryption', 'security'),
    (r'\binherit|\babstract class\b|(?<!user )\binterface\b|\bpolymorph|\bOOP\b',
     'Inheritance and polymorphism', 'oop'),
    (r'\bencapsulat', 'Encapsulation', 'oop'),
    (r'\bvalidat|\bcheck the valid|\bregular expression\b|\bregex\b',
     'Input validation', 'validation'),
    (r'\bmenu\b', 'Menu-driven console loop', 'console-app'),
    (r'\bscanner\b|\binput from keyboard\b|\bprompt', 'Reading console input', 'console-app'),
    (r'\bsort\b', 'Sorting and comparators', 'sorting'),
    (r'\bsearch\b', 'Searching', 'searching'),
    (r'\bstring\b', 'String processing', 'strings'),
    (r'\bexception\b|\btry\b', 'Exception handling', 'exceptions'),
    (r'\bdate\b|\bdd/mm/yyyy\b', 'Date handling', 'dates'),
    (r'\bhexadecimal\b|\bbinary\b|\bbase number\b|\bnumber system\b|\bdecimal\b',
     'Number-base conversion', 'number-systems'),
    (r'\bdeck of cards\b|\bplaying card\b|\brank and suit\b', 'Modelling with classes', 'oop'),
    (r'\bmultiply\b|\bbig data\b|\bunlimited\b|\blarge number\b',
     'Arbitrary-precision arithmetic', 'math'),
]


def derive(text):
    low = text.lower()
    concepts, tags = [], []
    for pat, concept, tag in KEYWORDS:
        if re.search(pat, low):
            if concept not in concepts:
                concepts.append(concept)
            if tag not in tags:
                tags.append(tag)
    return concepts[:6], tags[:6]


def tier(loc):
    if loc <= 45:
        return 'EASY', 10, max(20, int(loc * 1.2))
    if loc <= 99:
        return 'MEDIUM', 20, int(loc * 1.3)
    if loc <= 200:
        return 'HARD', 30, int(loc * 1.4)
    return 'HARD', 40, int(loc * 1.5)


def slugify(code, title):
    s = f"lab211-{code}-{title}".lower()
    s = re.sub(r"[^a-z0-9]+", '-', s).strip('-')
    return s[:150]


# ─── plain-text sources (.txt copies, PDF text, README.md) → blocks ───
def read_text(p):
    """LAB211 .txt briefs are Windows-1252 encoded."""
    raw = open(p, 'rb').read()
    try:
        txt = raw.decode('utf-8')
    except UnicodeDecodeError:
        txt = raw.decode('cp1252', errors='replace')
    return txt.replace('\r\n', '\n').replace('\r', '\n')


def text_to_blocks(txt):
    blocks = []
    for raw in txt.replace('\r\n', '\n').split('\n'):
        line = raw.rstrip()
        if not line.strip():
            continue
        s = line.strip()
        # the .txt briefs squash the whole metadata table onto one line
        if re.match(r'^LAB ?211 Assignment', s) and 'LOC' in s:
            continue
        # markdown heading
        m = re.match(r'^#{1,6}\s+(.*)$', s)
        if m:
            blocks.append({'t': 'p', 'text': m.group(1), 'style': 'Heading2',
                           'list': None, 'level': 0})
            continue
        if s.lower().rstrip(':') in SECTIONS and len(s) < 50:
            blocks.append({'t': 'p', 'text': s.rstrip(':'), 'style': 'Heading2',
                           'list': None, 'level': 0})
            continue
        m = re.match(r'^([-•▪●–\*�])[\s\t]+(.*)$', s)
        if m:
            blocks.append({'t': 'p', 'text': m.group(2), 'style': '', 'list': 'ul',
                           'level': 1 if raw.startswith(('    ', '\t\t')) else 0})
            continue
        m = re.match(r'^(\d+(?:\.\d+)*)[.)]\s+(.*)$', s)
        if m:
            blocks.append({'t': 'p', 'text': f'{m.group(1)}. {m.group(2)}', 'style': '',
                           'list': None, 'level': 0})
            continue
        blocks.append({'t': 'p', 'text': line, 'style': '', 'list': None, 'level': 0})
    return blocks


HEADER_LINE = re.compile(
    r'^(LAB ?211 Assignment|Type|Code|LOC|Slot\(s\)|Slots)\s*[:.]?\s*'
    r'(Short Assignment|Long Assignment|J1\.[LS]\.P\d+|\d+|N/A)?\s*$', re.I)


def strip_header(blocks):
    """Drop the LAB211 metadata header (table or the first Type/Code/LOC lines)
    and the 'Title' label + its value — both are rendered from metadata."""
    out, i = [], 0
    if blocks and blocks[0]['t'] == 'table':
        i = 1
    seen_title = False
    while i < len(blocks):
        b = blocks[i]
        if b['t'] == 'p':
            # header carried on ONE line ("Type: Short Assignment") — happens when
            # the source is a PDF, where label and value share a visual line
            if not seen_title and HEADER_LINE.match(b['text'].strip()):
                i += 1
                continue
            t = b['text'].strip().rstrip(':').strip().lower()
            if not seen_title and t in ('lab211 assignment', 'lab 211 assignment', 'type',
                                        'short assignment', 'long assignment', 'code', 'loc',
                                        'slot(s)', 'slots', 'n/a') or re.fullmatch(r'j1\.[ls]\.p\d+', t or ''):
                i += 1
                continue
            if t == 'title' and not seen_title:
                seen_title = True
                i += 2                      # skip label + the title text itself
                continue
            if not seen_title and re.fullmatch(r'\d+', t or ''):
                i += 1                      # bare LOC / slot numbers
                continue
        out.append(b)
        i += 1
    return out


def load_blocks(lab, meta):
    """Whichever format this lab ships in, return ordered blocks."""
    if os.path.exists(f'out/{lab}.json'):
        return json.load(open(f'out/{lab}.json'))['blocks']
    if os.path.exists(f'out/{lab}.txt'):                       # PDF text
        return text_to_blocks(read_text(f'out/{lab}.txt'))
    d = os.path.join(SRC, lab)
    for f in sorted(os.listdir(d)):
        if f.lower().endswith(('.txt', '.md')) and (f.startswith(lab) or f.lower() == 'readme.md'):
            return text_to_blocks(read_text(os.path.join(d, f)))
    return []


def main():
    metas = {m['lab']: m for m in json.load(open('meta.json'))}
    # LOC that the PDF/markdown briefs state in their own text
    extra_loc = {'J1.L.P0013': 500, 'J1.L.P0014': 500, 'J1.L.P0015': 500}
    exercises = []
    report = []
    for lab, m in metas.items():
        blocks = strip_header(load_blocks(lab, m))
        loc = int(re.sub(r'\D', '', m.get('loc') or '') or extra_loc.get(lab, 0))
        title = re.sub(r'\s+', ' ', (m.get('title') or '')).strip(' .\t')
        if not title:                                   # PDF / md briefs
            for b in blocks:
                if b['t'] == 'p' and 3 < len(b['text'].strip()) < 70:
                    title = b['text'].strip(' .\t')
                    break
        body = render(blocks, lab)
        # Concepts come from what the task ASKS FOR (specifications + function
        # details), not from the background essay — otherwise a passing mention
        # like "used to improve quicksort" becomes a listed concept.
        spec = body
        sm = re.search(r'<h3>Program Specifications</h3>(.*?)(?=<h3>(?:Guidelines|Algorithm|Suggestion|Hint)</h3>|$)',
                       body, re.S)
        if sm:
            spec = sm.group(1)
        plain = re.sub(r'<[^>]+>', ' ', spec)
        concepts, tags = derive(plain + ' ' + title)
        diff, points, mins = tier(loc or 500)
        n_img = body.count('<img ')
        header = (f'<p><strong>{esc(m.get("type") or "Assignment")} · {lab} · '
                  f'{loc or "?"} LOC · {m.get("slot(s)") or "N/A"} slot(s)</strong></p>')
        exercises.append({
            'lab': lab, 'loc': loc, 'title': title,
            'exTitle': f'{lab}_{title} ({loc} LOC)' if loc else f'{lab}_{title}',
            'slug': slugify(lab, title),
            'difficulty': diff, 'points': points, 'estimatedMinutes': mins,
            'problemHtml': header + '\n' + body,
            'concepts': concepts, 'tags': ['lab211', 'fptu'] + tags,
            'images': n_img,
        })
        report.append((lab, loc, diff, len(body), n_img, title[:46]))

    exercises.sort(key=lambda e: (e['loc'] or 9999, e['lab']))
    for i, e in enumerate(exercises):
        e['sortOrder'] = i + 1
    json.dump(exercises, open('payload.json', 'w'), ensure_ascii=False, indent=1)

    print(f'{"LAB":13}{"LOC":>5} {"DIFF":8}{"HTML":>7}{"IMG":>4}  TITLE')
    for lab, loc, diff, n, ni, t in sorted(report, key=lambda r: (r[1] or 9999, r[0])):
        flag = '  <-- ngắn' if n < 700 else ''
        print(f'{lab:13}{loc:>5} {diff:8}{n:>7}{ni:>4}  {t}{flag}')
    print(f'\nTổng {len(exercises)} bài | HTML ngắn nhất {min(len(e["problemHtml"]) for e in exercises)} '
          f'| ảnh {sum(e["images"] for e in exercises)} | thiếu title: '
          f'{[e["lab"] for e in exercises if not e["title"]]}')


if __name__ == '__main__':
    main()
