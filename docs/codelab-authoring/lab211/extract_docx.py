#!/usr/bin/env python3
"""Extract a .docx into ordered blocks (paragraph / list item / table / image),
preserving document order. Pure stdlib: zipfile + xml.etree.

Emits per lab a JSON: {code, blocks:[...], images:{rid: filename}}
Block shapes:
  {"t":"p",     "text":..., "style":..., "bold":bool, "list":None|"ul"|"ol", "level":int}
  {"t":"table", "rows":[[cell,...],...]}
  {"t":"img",   "file":"media/imageN.png", "w":emu, "h":emu}
"""
import json, os, re, sys, zipfile
import xml.etree.ElementTree as ET

NS = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture',
    'v': 'urn:schemas-microsoft-com:vml',
    'mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
    'rel': 'http://schemas.openxmlformats.org/package/2006/relationships',
}
W = '{%s}' % NS['w']


def rels_map(z):
    """rId -> media path inside the docx."""
    try:
        root = ET.fromstring(z.read('word/_rels/document.xml.rels'))
    except KeyError:
        return {}
    out = {}
    for e in root.findall('rel:Relationship', NS):
        if 'image' in e.get('Type', ''):
            out[e.get('Id')] = 'word/' + e.get('Target').replace('../', '')
    return out


def numbering_map(z):
    """numId -> 'ol' | 'ul' based on the first level's numFmt."""
    try:
        root = ET.fromstring(z.read('word/numbering.xml'))
    except KeyError:
        return {}
    abstract = {}
    for a in root.findall('w:abstractNum', NS):
        aid = a.get(W + 'abstractNumId')
        lvl = a.find('w:lvl', NS)
        fmt = lvl.find('w:numFmt', NS).get(W + 'val') if lvl is not None and lvl.find('w:numFmt', NS) is not None else 'bullet'
        abstract[aid] = 'ul' if fmt == 'bullet' else 'ol'
    out = {}
    for n in root.findall('w:num', NS):
        nid = n.get(W + 'numId')
        ref = n.find('w:abstractNumId', NS)
        if ref is not None:
            out[nid] = abstract.get(ref.get(W + 'val'), 'ul')
    return out


def run_text(run):
    """Text of one w:r, honouring tabs and breaks."""
    parts = []
    for child in run:
        tag = child.tag
        if tag == W + 't':
            parts.append(child.text or '')
        elif tag == W + 'tab':
            parts.append('\t')
        elif tag in (W + 'br', W + 'cr'):
            parts.append('\n')
        elif tag == W + 'noBreakHyphen':
            parts.append('-')
    return ''.join(parts)


def para_images(p, rmap):
    """Images anchored in this paragraph, in order (DrawingML + legacy VML)."""
    found, seen = [], set()
    for blip in p.iter('{%s}blip' % NS['a']):
        rid = blip.get('{%s}embed' % NS['r'])
        if rid in rmap and rid not in seen:
            seen.add(rid)
            ext = None
            for ext_el in p.iter('{%s}extent' % NS['wp']):
                ext = (int(ext_el.get('cx', 0)), int(ext_el.get('cy', 0)))
                break
            found.append((rmap[rid], ext))
    for im in p.iter('{%s}imagedata' % NS['v']):
        rid = im.get('{%s}id' % NS['r'])
        if rid in rmap and rid not in seen:
            seen.add(rid)
            found.append((rmap[rid], None))
    return found


TXBX = '{%s}txbxContent' % NS['w']


def textboxes(p):
    """Console samples are drawn in Word TEXT BOXES. Two traps:
      1. every line is its own <w:p> inside <w:txbxContent> — flattening the
         paragraph joins them into one unreadable line;
      2. Word writes each box TWICE (mc:Choice + mc:Fallback), so a naive walk
         duplicates the whole sample.
    Returns one list-of-lines per distinct box, in order."""
    boxes, seen = [], set()
    for tb in p.iter(TXBX):
        lines = []
        for q in tb.iter(W + 'p'):
            lines.append(''.join(run_text(r) for r in q.iter(W + 'r')).rstrip())
        while lines and not lines[-1].strip():
            lines.pop()
        key = tuple(lines)
        if not any(l.strip() for l in lines) or key in seen:
            continue
        seen.add(key)
        boxes.append(lines)
    return boxes


def runs_outside_textbox(p):
    """Every run belonging to the paragraph itself, in document order.

    Must walk descendants, not direct children: linked words live inside
    <w:hyperlink> (and revisions inside <w:ins>), so taking only direct <w:r>
    children silently DROPS them mid-sentence. Text-box runs are excluded —
    those are emitted separately as console samples."""
    inside = {id(r) for tb in p.iter(TXBX) for r in tb.iter(W + 'r')}
    return [r for r in p.iter(W + 'r') if id(r) not in inside]


def para_block(p, nummap, rmap):
    """Turn a w:p into (text-block or None, [image blocks])."""
    pPr = p.find('w:pPr', NS)
    style = ''
    lst, level = None, 0
    if pPr is not None:
        st = pPr.find('w:pStyle', NS)
        if st is not None:
            style = st.get(W + 'val', '')
        npr = pPr.find('w:numPr', NS)
        if npr is not None:
            nid = npr.find('w:numId', NS)
            ilvl = npr.find('w:ilvl', NS)
            if nid is not None:
                lst = nummap.get(nid.get(W + 'val'), 'ul')
                level = int(ilvl.get(W + 'val', 0)) if ilvl is not None else 0
    text = ''.join(run_text(r) for r in runs_outside_textbox(p))
    bold = False
    rpr = p.find('.//w:r/w:rPr/w:b', NS)
    if rpr is not None and rpr.get(W + 'val', '1') not in ('0', 'false'):
        bold = True
    imgs = [{'t': 'img', 'file': f, 'ext': e} for f, e in para_images(p, rmap)]
    imgs += [{'t': 'pre', 'text': '\n'.join(lines)} for lines in textboxes(p)]
    blk = None
    if text.strip():
        blk = {'t': 'p', 'text': text.rstrip(), 'style': style, 'bold': bold,
               'list': lst, 'level': level}
    return blk, imgs


def table_block(tbl, nummap, rmap):
    rows, imgs = [], []
    for tr in tbl.findall('w:tr', NS):
        cells = []
        for tc in tr.findall('w:tc', NS):
            lines = []
            for p in tc.findall('w:p', NS):
                b, im = para_block(p, nummap, rmap)
                imgs.extend(im)
                if b:
                    lines.append(b['text'])
            cells.append('\n'.join(lines))
        if cells:
            rows.append(cells)
    return ({'t': 'table', 'rows': rows} if rows else None), imgs


def extract(path):
    z = zipfile.ZipFile(path)
    rmap = rels_map(z)
    nummap = numbering_map(z)
    body = ET.fromstring(z.read('word/document.xml')).find('w:body', NS)
    blocks = []
    for el in body:
        if el.tag == W + 'p':
            b, imgs = para_block(el, nummap, rmap)
            if b:
                blocks.append(b)
            blocks.extend(imgs)
        elif el.tag == W + 'tbl':
            b, imgs = table_block(el, nummap, rmap)
            if b:
                blocks.append(b)
            blocks.extend(imgs)
    media = {n: z.read(n) for n in z.namelist() if n.startswith('word/media/')}
    return blocks, media


if __name__ == '__main__':
    src, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    labs = sorted(d for d in os.listdir(src) if os.path.isdir(os.path.join(src, d)))
    summary = []
    for lab in labs:
        docx = [f for f in os.listdir(os.path.join(src, lab))
                if f.lower().endswith('.docx') and f.startswith(lab)]
        if not docx:
            continue
        p = os.path.join(src, lab, docx[0])
        blocks, media = extract(p)
        mdir = os.path.join(outdir, 'media', lab)
        saved = {}
        if media:
            os.makedirs(mdir, exist_ok=True)
            for name, data in media.items():
                base = os.path.basename(name)
                open(os.path.join(mdir, base), 'wb').write(data)
                saved[name] = base
        json.dump({'code': lab, 'blocks': blocks},
                  open(os.path.join(outdir, lab + '.json'), 'w'), ensure_ascii=False, indent=1)
        nimg = sum(1 for b in blocks if b['t'] == 'img')
        summary.append((lab, len(blocks), nimg, len(media)))
    for lab, nb, ni, nm in summary:
        print(f'{lab:14} blocks={nb:4} img_refs={ni:3} media_files={nm:3}')
    print('TOTAL labs:', len(summary))
