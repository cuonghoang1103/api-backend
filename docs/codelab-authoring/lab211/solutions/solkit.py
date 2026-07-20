#!/usr/bin/env python3
"""Authoring + verification kit for the LAB211 solutions.

A solution is a real NetBeans-shaped project — package entity / bo / controller
/ ui / utils, exactly the layout the user's own passing submissions used. So it
is verified the way a marker would: compile the whole project with javac, run
the main class, feed it the keystrokes a marker would type, and diff the console
against the expected transcript.

Compiling proves the code is valid Java. Only running it with input proves the
program does what the brief asked.
"""
import json, os, re, shutil, subprocess, tempfile

SOLUTIONS = []


def solution(lab, *, title_vi, files, main_class, runs,
             explain_en, explain_vi, hints_en, hints_vi, starter=None,
             problem_vi=None):
    """One exercise's deliverable.

    files      : [(path, source)] — path like 'src/entity/Doctor.java'
    main_class : 'ui.Main'
    runs       : [(stdin, expected_stdout)] — the marker's keystrokes
    """
    SOLUTIONS.append({
        'lab': lab, 'titleVi': title_vi, 'files': files, 'mainClass': main_class,
        'runs': runs, 'explainEn': explain_en, 'explainVi': explain_vi,
        'hintsEn': hints_en, 'hintsVi': hints_vi, 'starter': starter or [],
        'problemVi': problem_vi,
    })


# ─── verification ────────────────────────────────────────────────

def compile_and_run(sol, workdir):
    """Returns (ok, report). Compiles every file, then plays each scripted run."""
    root = os.path.join(workdir, sol['lab'].replace('.', '_'))
    src = os.path.join(root, 'src')
    os.makedirs(src, exist_ok=True)

    paths = []
    for rel, code in sol['files']:
        rel = rel.replace('src/', '', 1)
        full = os.path.join(src, rel)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, 'w') as f:
            f.write(code)
        paths.append(full)

    out = os.path.join(root, 'build')
    os.makedirs(out, exist_ok=True)
    r = subprocess.run(['javac', '-nowarn', '-d', out, *paths],
                       capture_output=True, text=True, timeout=180)
    if r.returncode != 0:
        return False, 'JAVAC:\n' + (r.stderr or r.stdout).strip()

    for i, (stdin_text, expected) in enumerate(sol['runs']):
        try:
            p = subprocess.run(['java', '-cp', out, sol['mainClass']],
                               input=stdin_text, capture_output=True, text=True,
                               timeout=60, cwd=root)
        except subprocess.TimeoutExpired:
            return False, f'RUN {i}: timed out — the program is probably waiting for input it was never given'
        got = (p.stdout or '').rstrip('\n')
        if p.returncode != 0:
            return False, f'RUN {i}: exit {p.returncode}\n{(p.stderr or "").strip()[:600]}'
        if callable(expected):
            # A program with a random element cannot be diffed against fixed text,
            # so the expectation is a predicate over the real output instead —
            # "the second array is the first one sorted" is still a hard check.
            ok, why = expected(got)
            if not ok:
                return False, f'RUN {i}: {why}\n--- ACTUAL ---\n{got}'
        elif expected is not None and got.strip() != expected.strip():
            return False, (f'RUN {i}: output differs\n--- EXPECTED ---\n{expected}\n'
                           f'--- ACTUAL ---\n{got}')
    return True, ''


def verify_all(only=None):
    work = tempfile.mkdtemp(prefix='lab211-sol-')
    ok = bad = 0
    problems = []
    unchecked = []
    for sol in SOLUTIONS:
        if only and sol['lab'] not in only:
            continue
        # A run whose expectation is still None compiles and runs and proves
        # NOTHING about the output. That is not a failure, so it used to pass
        # silently - and a batch was once committed and shipped with two of
        # them still in place. Count them and say so, loudly.
        blank = sum(1 for _stdin, expected in sol['runs'] if expected is None)
        if blank:
            unchecked.append((sol['lab'], blank, len(sol['runs'])))

        good, report = compile_and_run(sol, work)
        if good:
            ok += 1
        else:
            bad += 1
            problems.append((sol['lab'], report))
    print(f'lời giải: OK={ok}  LỖI={bad}')
    for lab, rep in problems:
        print(f'\n──────── {lab}\n{rep[:2500]}')
    if unchecked:
        print('\n⚠️  CHƯA KIỂM OUTPUT (expected=None — chạy được nhưng không chứng minh gì):')
        for lab, blank, total in unchecked:
            print(f'    {lab}: {blank}/{total} lần chạy')
    shutil.rmtree(work, ignore_errors=True)
    return bad == 0 and not unchecked


def capture(lab):
    """Run one solution and print the real console, for filling in expectations."""
    work = tempfile.mkdtemp(prefix='lab211-cap-')
    sol = next(s for s in SOLUTIONS if s['lab'] == lab)
    root = os.path.join(work, 'p')
    src = os.path.join(root, 'src')
    os.makedirs(src, exist_ok=True)
    paths = []
    for rel, code in sol['files']:
        full = os.path.join(src, rel.replace('src/', '', 1))
        os.makedirs(os.path.dirname(full), exist_ok=True)
        open(full, 'w').write(code)
        paths.append(full)
    out = os.path.join(root, 'build')
    r = subprocess.run(['javac', '-nowarn', '-d', out, *paths], capture_output=True, text=True)
    if r.returncode != 0:
        print((r.stderr or r.stdout)[:2000]); return
    for i, (stdin_text, _) in enumerate(sol['runs']):
        p = subprocess.run(['java', '-cp', out, sol['mainClass']], input=stdin_text,
                           capture_output=True, text=True, timeout=60, cwd=root)
        print(f'######## RUN {i} (exit {p.returncode})')
        print(p.stdout.rstrip('\n'))
        if p.stderr.strip():
            print('--- stderr ---'); print(p.stderr.strip()[:800])
    shutil.rmtree(work, ignore_errors=True)


# ─── project structure tree ──────────────────────────────────────
#
# Every solution ships with a picture of the NetBeans project it belongs to:
# which package holds which class, and where the data files live. Reading a
# list of files named "src/bo/UserManager.java" is not the same as seeing the
# shape of the project you are supposed to hand in, and the shape is what a
# marker opens first.
#
# It is GENERATED from the files themselves rather than written by hand, so it
# can never drift out of date with the code beside it.

PACKAGE_ROLE = {
    'entity': ('the data: private fields, constructor, getters, toString',
               'dữ liệu: trường private, constructor, getter, toString'),
    'bo': ('the collection and the rules; throws, never prints',
           'tập dữ liệu và luật nghiệp vụ; ném ngoại lệ, không in ra màn hình'),
    'controller': ('reads input, calls bo, reports the outcome',
                   'nhận dữ liệu vào, gọi bo, báo kết quả'),
    'ui': ('the menu and the screen, nothing else',
           'thực đơn và màn hình, không làm gì khác'),
    'main': ('the menu and the screen, nothing else',
             'thực đơn và màn hình, không làm gì khác'),
    'utils': ('every keyboard read and every check, in one place',
              'mọi thao tác đọc bàn phím và kiểm tra, gom về một chỗ'),
    'validate': ('every keyboard read and every check, in one place',
                 'mọi thao tác đọc bàn phím và kiểm tra, gom về một chỗ'),
}

# Order the packages the way the program flows, not alphabetically.
PACKAGE_ORDER = ['entity', 'bo', 'controller', 'utils', 'validate', 'ui', 'main']

DATA_FILE = re.compile(r'"([A-Za-z0-9_\-]+\.(?:txt|dat|csv|properties|bin|dbo))"')

_TITLES = None


def _project_name(lab):
    """`J1.S.P0057` + its title -> `J1S_P0057_UserManagementSystem`."""
    global _TITLES
    if _TITLES is None:
        _TITLES = {}
        try:
            payload = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'payload.json')
            for e in json.load(open(payload)):
                _TITLES[e['lab']] = e.get('exTitle', '')
        except Exception:
            pass
    code = lab.replace('.', '')
    title = _TITLES.get(lab, '')
    after = title.split('_', 1)[1] if '_' in title else ''
    after = re.sub(r'\(\d+\s*LOC\)', '', after)
    words = re.findall(r'[A-Za-z]+', after)[:4]
    camel = ''.join(w.capitalize() for w in words)
    return f'{code}_{camel}' if camel else code


def _tree(sol, vi=False):
    """The directory tree, drawn from the solution's own file list."""
    by_package = {}
    for rel, _code in sol['files']:
        parts = rel.replace('src/', '', 1).split('/')
        package = parts[0] if len(parts) > 1 else ''
        by_package.setdefault(package, []).append(parts[-1])

    data_files = []
    for _rel, code in sol['files']:
        for name in DATA_FILE.findall(code):
            if name not in data_files:
                data_files.append(name)

    def role(pkg):
        pair = PACKAGE_ROLE.get(pkg)
        if not pair:
            return ''
        return pair[1] if vi else pair[0]

    L = {
        'build': ('Ant build script. NetBeans needs it — never delete it.',
                  'tệp build của Ant. NetBeans cần nó — đừng bao giờ xoá.'),
        'nb': ('project metadata: main class, source level, libraries',
               'thông tin project: lớp main, phiên bản nguồn, thư viện'),
        'src': ('YOUR CODE LIVES HERE, and only here',
                'MÃ NGUỒN CỦA BẠN NẰM Ở ĐÂY, và chỉ ở đây'),
        'data': ('data file — it sits at the PROJECT ROOT, not inside src/',
                 'tệp dữ liệu — nằm ở GỐC PROJECT, không nằm trong src/'),
        'build_dir': ('compiled .class files (safe to delete)',
                      'tệp .class đã biên dịch (xoá thoải mái)'),
        'dist': ('the packaged .jar (safe to delete)',
                 'tệp .jar đóng gói (xoá thoải mái)'),
    }
    say = (lambda k: L[k][1] if vi else L[k][0])

    lines = [f'{_project_name(sol["lab"])}/',
             f'├── build.xml            <- {say("build")}',
             '├── manifest.mf',
             f'├── nbproject/           <- {say("nb")}',
             '│   ├── build-impl.xml',
             '│   └── project.properties',
             f'├── src/                 <- {say("src")}']

    packages = [p for p in PACKAGE_ORDER if p in by_package]
    packages += [p for p in by_package if p not in packages]
    for i, pkg in enumerate(packages):
        last_pkg = i == len(packages) - 1
        branch = '└──' if last_pkg else '├──'
        note = role(pkg)
        lines.append(f'│   {branch} {pkg}/' + (f'{" " * max(1, 16 - len(pkg))}<- {note}' if note else ''))
        classes = by_package[pkg]
        for j, cls in enumerate(classes):
            inner = '└──' if j == len(classes) - 1 else '├──'
            spine = '    ' if last_pkg else '│   '
            lines.append(f'│   {spine}{inner} {cls}')

    for name in data_files:
        lines.append(f'├── {name}' + ' ' * max(1, 21 - len(name)) + f'<- {say("data")}')
    lines.append(f'├── build/               <- {say("build_dir")}')
    lines.append(f'└── dist/                <- {say("dist")}')
    return '\n'.join(lines)


def structure_html(sol, vi=False):
    heading = ('Cấu trúc project' if vi else 'Project structure')
    lead = ('Đây là hình dạng project NetBeans bạn nộp: lớp nào nằm trong gói nào, '
            'và tệp dữ liệu nằm ở đâu. Chạy <code>{main}</code> để khởi động chương trình.'
            if vi else
            'This is the shape of the NetBeans project you hand in: which class lives in '
            'which package, and where the data files sit. Run <code>{main}</code> to start it.')
    tree = _tree(sol, vi).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return (f'<h3>{heading}</h3>\n<p>{lead.format(main=sol["mainClass"])}</p>\n'
            f'<pre>{tree}</pre>\n')


def dump(path):
    """Payload for the shipper: solution files + explanation + hints + Vietnamese.

    The structure tree is prepended to both walkthroughs here rather than being
    written into each batch by hand — one generator, and it cannot fall out of
    step with the file list it is drawn from.
    """
    out = []
    for s in SOLUTIONS:
        # Idempotent: dump() may be called more than once in a session, and a
        # tree prepended twice is worse than no tree at all.
        if '<h3>Project structure</h3>' not in s['explainEn']:
            s['explainEn'] = structure_html(s, False) + s['explainEn']
        if '<h3>Cấu trúc project</h3>' not in s['explainVi']:
            s['explainVi'] = structure_html(s, True) + s['explainVi']
        out.append({
            'lab': s['lab'],
            'solutionCodeJson': [{'name': rel, 'language': 'java', 'code': code}
                                 for rel, code in s['files']],
            'starterCodeJson': [{'name': rel, 'language': 'java', 'code': code}
                                for rel, code in s['starter']] or None,
            'solutionExplanationHtml': s['explainEn'],
            'solutionExplanationHtmlVi': s['explainVi'],
            'hintsJson': s['hintsEn'],
            'hintsJsonVi': s['hintsVi'],
            'problemHtmlVi': s['problemVi'],
        })
    json.dump(out, open(path, 'w'), ensure_ascii=False, indent=1)
    return len(out)
