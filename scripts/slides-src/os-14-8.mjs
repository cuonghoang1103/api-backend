/**
 * os-14-8 — khoá "Operating Systems for Developers", bài 14.8 "Cross-platform code" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c148-mac.out.txt (Mac thật, đã ẩn danh) và c148-lx.out.txt (container lab)
 * qua grab(). Windows (spawn .cmd, khoá file, NetBeans, autocrlf mặc định): theo tài liệu — slide ghi "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-8.mjs.
 */
import { lamDeck, sh, sql, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-8', code: 'OS 14.8', title: 'Cross-platform code', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const m = (pre, n = 1) => grab('c148-mac', pre, n);
const l = (pre, n = 1) => grab('c148-lx', pre, n);
/* chỉ rút gọn phần dựng repo lặp lại trong DÒNG LỆNH (có dấu … cho thấy đã rút), output giữ nguyên */
const GITBOOT = 'git init -q && git config user.name dev && git config user.email dev@example.com && ';
const g = (s) => s.split(GITBOOT).join('git init -q && … && ');
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 22) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const code = (src, lang, fs = 18) => sql(src, { lang }).replace('<pre class="vs">', `<pre class="vs" style="font-size:${fs}px">`);

/* byte của dòng shebang CRLF: kernel đọc tới \n, nên tên trình thông dịch mang theo \r */
const crlfBytes = () => {
  const ch = ['#', '!', '/', 'b', 'i', 'n', '/', 'b', 'a', 's', 'h', '\\r', '\\n'];
  let s = '';
  const w = 72, x0 = 30;
  ch.forEach((c, i) => {
    const bad = c === '\\r', nl = c === '\\n';
    const col = bad ? RD : nl ? GR : BL;
    s += R(x0 + i * (w + 6), 20, w, 64, col + (bad ? '28' : '12'), col, { rx: 6, sw: bad ? 3 : 2 }) + T(x0 + i * (w + 6) + w / 2, 62, c, 26, { a: 'middle', m: 1, w: 700, f: col });
  });
  s += T(x0 + 11 * (w + 6) + w / 2, 112, 'CR', 18, { a: 'middle', f: RD, w: 700 }) + T(x0 + 12 * (w + 6) + w / 2, 112, 'LF', 18, { a: 'middle', f: GR, w: 700 });
  const end = x0 + 11 * (w + 6) + w;
  s += `<line x1="${x0 + 2 * (w + 6)}" y1="140" x2="${end}" y2="140" stroke="${RD}" stroke-width="3"/>` +
    `<line x1="${x0 + 2 * (w + 6)}" y1="132" x2="${x0 + 2 * (w + 6)}" y2="148" stroke="${RD}" stroke-width="3"/><line x1="${end}" y1="132" x2="${end}" y2="148" stroke="${RD}" stroke-width="3"/>`;
  s += T((x0 + 2 * (w + 6) + end) / 2, 174, 'the interpreter the kernel looks for: "/bin/bash\\r" — does not exist', 21, { a: 'middle', f: RD, w: 700 });
  return svg(1060, 190, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.8',
}, [
  { cover: true, t: 'Cross-platform code:<br>one project, three systems', sub: 'Paths, case, line endings, spawning, file locks, NetBeans and a CI matrix — written on a Mac, edited on Windows, deployed to Linux' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Paths: test <b>Windows rules on your Mac</b> with path.win32 / ntpath</li>
<li>Case: why <code class="i">Config.properties</code> works on laptops, fails on Linux</li>
<li>Line endings: the invisible <b>\\r</b> and how Git creates it</li>
<li>Spawning processes and file locks (per the docs for Windows)</li>
<li>NetBeans projects, <code class="i">.gitattributes</code>, <code class="i">.gitignore</code>, a <b>3-OS CI matrix</b></li>
</ul>` },

  { t: 'path.win32 runs Windows path rules on any OS', giua: true, body: term(m('node cross.cjs'), 19) +
    box('', 'On the Mac: <code class="i">path.join</code> uses <b>/</b>, <code class="i">path.win32.join</code> uses <b>\\</b>. On POSIX a backslash is part of a <b>file name</b>; on Windows <code class="i">/etc</code> is absolute. Never write <code class="i">"src/" + name</code>.', 'lam') },

  { t: 'Python and Java answer the same question', giua: true, body: term(l('python3 cross.py', 2), 17) +
    box('', 'Python: <code class="i">ntpath</code>, <code class="i">PureWindowsPath</code> on any OS — even case-insensitive equality. Java: only the running OS’s rules — on Windows <code class="i">\\</code>, <code class="i">;</code>, <code class="i">\\r\\n</code> (per the docs). Use <code class="i">Path.of(a, b)</code>.', 'lam') },

  { t: 'Case: works on the laptops, fails on the server', giua: true, body: term(m('java Res.java'), 21) + box('', '<b>Mac</b> (APFS, case-insensitive): the code asks for <code class="i">Config.properties</code>, finds <code class="i">config.properties</code>', 'xanh') +
    term(l('java Res.java'), 19) + box('', '<b>Linux</b> (ext4, case-sensitive): NoSuchFileException', 'do2') +
    box('', 'Inside a <b>JAR</b> (a ZIP) entry names are case-sensitive on every OS — getResource can pass in the IDE and fail when packaged.', 'lam') },

  { t: 'Git on a Mac does not see a case-only rename', giua: true, body: term(g(m('git -C . config core.ignorecase', 4)), 19) +
    box('', '<code class="i">core.ignorecase = true</code>: the rename is invisible, so everyone else — and Linux — keeps the old name. <code class="i">git mv -f</code> records it.', 'lam') },

  { t: 'A script saved with CRLF', giua: true, body: term(l("printf '#!/bin/bash", 4), 18) +
    box('', '<code class="i">^M</code> is the carriage return: "bad interpreter", <code class="i">NAME</code> becomes <code class="i">prod\\r</code>, <code class="i">cd</code> looks for <code class="i">/tmp\\r</code>.', 'do2') },

  { t: 'Why "/bin/bash: No such file" when bash exists', giua: true, body: crlfBytes() + term(l("sed -i 's/"), 18) +
    box('', 'Strip the <b>\\r</b> and the same script runs. In Docker the symptom is "exec /entrypoint.sh: no such file or directory".', 'xanh') },

  { t: 'Where the CRs come from: core.autocrlf', giua: true, body: term(g(m('git init -q && git config user.name dev && git config user.email dev@example.com && printf', 3)), 19) +
    box('', 'Committed LF → <code class="i">autocrlf=true</code> (Git for Windows’ suggested setting, per the docs) checks out <b>CRLF</b> → <code class="i">.gitattributes eol=lf</code> brings LF back for everyone.', 'lam') },

  { t: 'The committed fix: .gitattributes', giua: true, to: true, body: two(
    code(['# .gitattributes (repo root)', '* text=auto', '*.sh text eol=lf', 'Dockerfile text eol=lf', '*.bat text eol=crlf', '*.cmd text eol=crlf', '*.png binary'].join('\n'), 'ini', 26),
    box('', 'It overrides every personal <code class="i">core.autocrlf</code>, travels with the code, and applies on every clone. Then run <code class="i">git add --renormalize .</code> once to rewrite files already committed.', 'xanh')) },

  { t: 'Spawning and file locks differ on Windows', giua: true, body: bang(['', 'Linux / macOS', 'Windows (per the docs)'], [
    ['<code class="i">spawn("npm")</code> (Node)', 'runs npm', '<code class="i">npm.cmd</code>: ENOENT; .cmd without <code class="i">shell:true</code> ⇒ <b>EINVAL</b> since CVE-2024-27980'],
    ['<code class="i">shell=True</code> (Python)', '/bin/sh', 'cmd.exe — another language'],
    ['Java <code class="i">ProcessBuilder</code> with <code class="i">sh -c</code>', 'works', 'no sh — pass an argument list instead'],
    ['delete / rename an open file', '<b>allowed</b> (measured below)', '<b>refused</b>: ERROR_SHARING_VIOLATION'],
  ], 20) + term(l('exec 3> /tmp/app.log'), 18) },

  { t: 'NetBeans across Windows and Mac', giua: true, body: two(
    code(['# .gitignore (NetBeans/Java)', 'nbproject/private/', 'build/', 'dist/', 'target/', '.DS_Store', 'Thumbs.db', 'desktop.ini'].join('\n'), 'ini', 20),
    box('per the docs', '<b>nbproject/private/</b> holds per-user absolute paths — never commit it. <b>project.properties</b> may hold <code class="i">C\\:\\\\Users\\\\…</code> jar paths. Before Java 18 javac on Windows read sources as windows-1252: set <code class="i">source.encoding=UTF-8</code>. Best: let <b>Maven/Gradle</b> own the build.', 'lam')) },

  { t: 'Let CI run all three operating systems', giua: true, body: code(['strategy:', '  fail-fast: false', '  matrix:', '    os: [ubuntu-latest, macos-latest, windows-latest]', 'runs-on: ${{ matrix.os }}', 'defaults:', '  run:', '    shell: bash        # Git Bash on Windows', 'steps:', '  - uses: actions/checkout@v4', '  - uses: actions/setup-node@v4', '    with: { node-version: 22 }', '  - run: npm ci', '  - run: npm test'].join('\n'), 'yaml', 18) +
    box('', '<code class="i">fail-fast: false</code> shows whether a bug is Windows-only. Add tests for exact-case file access, spawning a child, and SIGINT shutdown.', 'xanh') },

  { t: 'Pitfall: "no such file or directory — but it is right there"', giua: true, to: true, body: vsd(
    'Build the Docker image from a Windows checkout with <code class="i">autocrlf=true</code>: the entrypoint’s first line is <code class="i">#!/bin/sh\\r</code>. Re-saving in an editor "fixes" it until the next checkout.',
    'Commit <code class="i">.gitattributes</code> with <code class="i">*.sh text eol=lf</code>, run <code class="i">git add --renormalize .</code> once, and check with <code class="i">file *.sh</code>.') },

  { t: 'Practice: make the group project portable', giua: true, body: `
<ol>
<li>Run cross.cjs, cross.py, Cross.java on the Mac and in the lab; replace string-built paths</li>
<li>Run Res.java on both; fix every resource name whose case differs (<code class="i">git ls-files</code>)</li>
<li>Add .gitattributes + .gitignore, <code class="i">git add --renormalize .</code>, check <code class="i">file *.sh</code></li>
<li>Add the 3-OS CI matrix with case, spawn and SIGINT tests</li>
</ol>` + box('Done when', 'CI is green on ubuntu, macos and windows; no CRLF scripts; nbproject/private not committed; a Windows teammate clones, opens in NetBeans and runs it without editing a path.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Build paths with <code class="i">path.join</code>, <code class="i">Path.of</code>, <code class="i">pathlib</code>; test Windows rules with <b>path.win32</b></li>
<li>Case-insensitive laptops hide wrong names; Linux and JARs do not</li>
<li>CRLF breaks scripts; <b>.gitattributes eol=lf</b> prevents it</li>
<li>Spawn with argument lists; close files before delete/rename on Windows</li>
<li>Keep IDE files out of Git; run CI on <b>all three</b></li>
</ul>` },
]);
