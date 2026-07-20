#!/usr/bin/env python3
"""Compile every Java snippet in the lesson with the real javac.

Reading code is not verification — the java-core lessons shipped earlier only
became correct after javac rejected a dozen "obviously fine" snippets. Each
snippet is compiled in its own directory so one failure cannot mask another.
"""
import json, os, re, shutil, subprocess, sys, tempfile

WRAP_FRAGMENT = """import java.util.*;
import java.io.*;
import java.time.*;
import java.time.format.*;

public class Snippet%(n)d {
    public static void main(String[] args) throws Exception {
%(body)s
    }
}
"""

WRAP_MEMBER = """import java.util.*;
import java.io.*;
import java.time.*;
import java.time.format.*;

public class Snippet%(n)d {
%(body)s
}
"""


def public_class_name(src):
    m = re.search(r'public\s+(?:final\s+|abstract\s+)?(?:class|interface|enum|record)\s+(\w+)', src)
    if m:
        return m.group(1)
    m = re.search(r'(?:^|\n)\s*(?:final\s+|abstract\s+)?(?:class|interface|enum|record)\s+(\w+)', src)
    return m.group(1) if m else None


def indent(src, spaces):
    pad = ' ' * spaces
    return '\n'.join(pad + line if line.strip() else line for line in src.split('\n'))


def compile_one(n, kind, src, workdir, deps=()):
    d = os.path.join(workdir, f'snip{n}')
    os.makedirs(d, exist_ok=True)
    extra = []
    for dep in deps:
        name = public_class_name(dep) or 'Dep'
        dp = os.path.join(d, f'{name}.java')
        open(dp, 'w').write(dep)
        extra.append(dp)
    if kind == 'class':
        name = public_class_name(src) or f'Snippet{n}'
        path = os.path.join(d, f'{name}.java')
        body = src
    elif kind == 'fragment':
        path = os.path.join(d, f'Snippet{n}.java')
        body = WRAP_FRAGMENT % {'n': n, 'body': indent(src, 8)}
    elif kind == 'member':
        path = os.path.join(d, f'Snippet{n}.java')
        body = WRAP_MEMBER % {'n': n, 'body': indent(src, 4)}
    else:
        return True, ''
    open(path, 'w').write(body)
    r = subprocess.run(['javac', '-nowarn', '-d', d, path, *extra],
                       capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        return False, (r.stderr or r.stdout).strip(), None
    main_class = public_class_name(body) if kind == 'class' else f'Snippet{n}'
    return True, '', (d, main_class)


def run_one(d, main_class):
    r = subprocess.run(['java', '-cp', d, main_class],
                       capture_output=True, text=True, timeout=60, input='')
    return r.returncode, (r.stdout or '').rstrip('\n'), (r.stderr or '').strip()


def main():
    items = json.load(open(sys.argv[1]))
    work = tempfile.mkdtemp(prefix='lab211-javac-')
    ok = fail = 0
    ran = mismatch = 0
    errors = []
    for i, it in enumerate(items):
        good, err, runinfo = compile_one(i, it['kind'], it['code'], work, it.get('deps', []))
        if not good:
            fail += 1
            errors.append((it['index'], 'javac', err))
            continue
        ok += 1
        expect = it.get('expect')
        if expect is None or runinfo is None:
            continue
        d, main_class = runinfo
        try:
            rc, stdout, stderr = run_one(d, main_class)
        except subprocess.TimeoutExpired:
            mismatch += 1
            errors.append((it['index'], 'chạy', 'quá thời gian — có thể đang chờ nhập liệu'))
            continue
        ran += 1
        if rc != 0:
            mismatch += 1
            errors.append((it['index'], 'chạy', f'thoát mã {rc}\n{stderr[:400]}'))
        elif stdout.strip() != expect.strip():
            mismatch += 1
            errors.append((it['index'], 'output',
                           'ĐÃ GHI TRONG BÀI:\n' + expect + '\n\nTHỰC TẾ CHẠY RA:\n' + stdout))
    print(f'javac OK={ok} LỖI={fail} | chạy thật={ran} lệch output={mismatch}')
    for idx, kind, err in errors:
        print(f'\n--- block #{idx} [{kind}] ---')
        print('\n'.join(err.split('\n')[:24]))
    shutil.rmtree(work, ignore_errors=True)
    sys.exit(1 if (fail or mismatch) else 0)


if __name__ == '__main__':
    main()
