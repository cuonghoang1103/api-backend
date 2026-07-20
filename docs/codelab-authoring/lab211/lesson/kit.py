#!/usr/bin/env python3
"""Authoring helpers for the bilingual LAB211 lesson.

Every block carries English in the primary field and Vietnamese in the `*Vi`
companion, which is exactly what the DocBlock normalizer now accepts.

Java snippets are marked so the verifier knows how to compile them:
  kind='class'    — a complete file, compiled as-is
  kind='fragment' — statements only, wrapped in a class + main before compiling
  kind='member'   — methods/fields, wrapped in a class body
  kind='none'     — pseudo-code / console transcript, never compiled
"""
import json, re

BLOCKS = []
JAVA = []          # dicts for the verifier
CLASSES = {}       # public class name -> source, so later snippets can depend on it


def _register_classes(src):
    for m in re.finditer(r'(?:^|\n)\s*(?:public\s+)?(?:final\s+|abstract\s+)?'
                         r'(?:class|interface|enum|record)\s+(\w+)', src):
        CLASSES.setdefault(m.group(1), src)


JC = '/code-lab/java-core'          # the Java Core roadmap, for practice links


def part(number, en, vi, sub_en='', sub_vi=''):
    """A hard visual break between the major sections of the lesson."""
    b = {'type': 'part', 'number': str(number), 'text': en, 'textVi': vi}
    if sub_en:
        b['subtitle'] = sub_en
    if sub_vi:
        b['subtitleVi'] = sub_vi
    BLOCKS.append(b)


def practice(items):
    """Buttons into Java Core. The first field is the target:
       int  -> a module (opens that module's lesson)
       str  -> one exercise, by slug."""
    out = []
    for target, le, lv, ne, nv in items:
        url = f'{JC}#module-{target}' if isinstance(target, int) else f'{JC}/{target}'
        out.append({'url': url, 'label': le, 'labelVi': lv, 'note': ne, 'noteVi': nv})
    BLOCKS.append({'type': 'practice', 'items': out})


def h(en, vi):
    BLOCKS.append({'type': 'heading', 'text': en, 'textVi': vi})


def p(en, vi):
    """Prose. Pass raw HTML; both languages must be valid HTML fragments."""
    BLOCKS.append({'type': 'prose', 'html': en, 'htmlVi': vi})


def ul(items_en, items_vi):
    p('<ul>' + ''.join(f'<li>{x}</li>' for x in items_en) + '</ul>',
      '<ul>' + ''.join(f'<li>{x}</li>' for x in items_vi) + '</ul>')


def ol(items_en, items_vi):
    p('<ol>' + ''.join(f'<li>{x}</li>' for x in items_en) + '</ol>',
      '<ol>' + ''.join(f'<li>{x}</li>' for x in items_vi) + '</ol>')


def table(head_en, head_vi, rows_en, rows_vi):
    def build(head, rows):
        th = ''.join(f'<th>{c}</th>' for c in head)
        tr = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
        return f'<table><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>'
    p(build(head_en, rows_en), build(head_vi, rows_vi))


def code(title_en, title_vi, src, kind='class', lang='java', src_vi=None, deps=()):
    """deps: names of classes shown earlier that this snippet calls — they are
    compiled alongside it, so a caller example is verified for real instead of
    being quietly skipped."""
    blk = {'type': 'code', 'language': lang, 'code': src.strip('\n'),
           'title': title_en, 'titleVi': title_vi}
    if src_vi:
        blk['codeVi'] = src_vi.strip('\n')
    BLOCKS.append(blk)
    if lang == 'java':
        if kind == 'class':
            _register_classes(src.strip('\n'))
        if kind != 'none':
            dep_src = [CLASSES[d] for d in deps if d in CLASSES]
            missing = [d for d in deps if d not in CLASSES]
            if missing:
                raise SystemExit(f'code() phụ thuộc lớp chưa khai báo: {missing}')
            for s in ([src] + ([src_vi] if src_vi else [])):
                JAVA.append({'index': len(BLOCKS) - 1, 'kind': kind,
                             'code': s.strip('\n'), 'deps': dep_src})


def out(title_en, title_vi, text, verify=True):
    """A console transcript. When `verify` is on it is treated as the EXPECTED
    stdout of the Java snippet immediately above, and the verifier runs that
    snippet and diffs the two. Compiling proves nothing about what a program
    prints; only running does. Set verify=False for interactive transcripts
    that need a human at the keyboard."""
    code(title_en, title_vi, text, kind='none', lang='text')
    if verify and JAVA:
        JAVA[-1]['expect'] = text.strip('\n')


def mermaid(src):
    BLOCKS.append({'type': 'mermaid', 'code': src.strip('\n')})


def links(items):
    BLOCKS.append({'type': 'links', 'items': items})


def dump(path):
    json.dump(BLOCKS, open(path, 'w'), ensure_ascii=False, indent=1)
    return len(BLOCKS)


def dump_java(path):
    json.dump(JAVA, open(path, 'w'), ensure_ascii=False, indent=1)
    return len(JAVA)
