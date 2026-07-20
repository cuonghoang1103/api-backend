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
    for sol in SOLUTIONS:
        if only and sol['lab'] not in only:
            continue
        good, report = compile_and_run(sol, work)
        if good:
            ok += 1
        else:
            bad += 1
            problems.append((sol['lab'], report))
    print(f'lời giải: OK={ok}  LỖI={bad}')
    for lab, rep in problems:
        print(f'\n──────── {lab}\n{rep[:2500]}')
    shutil.rmtree(work, ignore_errors=True)
    return bad == 0


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


def dump(path):
    """Payload for the shipper: solution files + explanation + hints + Vietnamese."""
    out = []
    for s in SOLUTIONS:
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
