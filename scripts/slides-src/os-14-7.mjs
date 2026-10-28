/**
 * os-14-7 — khoá "Operating Systems for Developers", bài 14.7 "Shells and package managers" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c147-pwsh.out.txt (PowerShell 7.6.9 THẬT trên Linux trong container lab)
 * và c147-mac.out.txt (Mac thật, đã ẩn danh) qua grab(). Windows PowerShell 5.1, winget, choco: theo tài liệu — "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-7.mjs.
 */
import { lamDeck, sh, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-7', code: 'OS 14.7', title: 'Shells and package managers', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const NOBLANK = { drop: /^\s*$/ };
const p = (pre, n = 1) => grab('c147-pwsh', pre, n, NOBLANK);
const m = (pre, n = 1) => grab('c147-mac', pre, n);
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const A = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m1)"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', PU = '#7b4fa0';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 22) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

/* ống văn bản (3 tiến trình, byte qua pipe) vs ống đối tượng (1 tiến trình, đối tượng .NET) */
const pipes = () => {
  let s = '';
  s += T(10, 30, 'Bash: three processes, bytes through pipes', 22, { w: 700, f: BL });
  const bx = [[10, 'ps -eo …'], [380, 'sort'], [750, 'head -4']];
  bx.forEach(([x, t], i) => {
    s += R(x, 50, 300, 70, BL + '16', BL) + T(x + 150, 92, t, 22, { a: 'middle', m: 1, w: 700 }) + T(x + 150, 142, 'process ' + (i + 1), 16, { a: 'middle', f: '#555' });
    if (i < 2) s += A(x + 302, 85, x + 368, 85) + T(x + 335, 72, 'text', 15, { a: 'middle', f: '#b85a2b' });
  });
  s += T(555, 180, '"  60 node   00:00:01 59992\\n" — every stage re-parses columns', 18, { a: 'middle', m: 1, f: '#555' });
  s += T(10, 236, 'PowerShell: one process, .NET objects between cmdlets', 22, { w: 700, f: GR });
  s += R(0, 252, 1090, 160, GR + '0a', GR, { d: 1, sw: 2 }) + T(1080, 404, 'one pwsh process', 15, { a: 'end', f: GR });
  const ox = [[20, 'Get-Process'], [295, 'Sort-Object CPU'], [570, 'Select-Object'], [845, 'Format-Table']];
  ox.forEach(([x, t], i) => {
    s += R(x, 272, 225, 66, (i === 3 ? OR : GR) + '16', i === 3 ? OR : GR) + T(x + 112, 312, t, 19, { a: 'middle', m: 1, w: 700 });
    if (i < 3) s += A(x + 227, 305, x + 268, 305);
  });
  s += T(410, 370, 'Process objects: Id, ProcessName, CPU, StartTime, Threads … (52 properties)', 18, { a: 'middle', f: GR });
  s += T(957, 370, 'text only here', 17, { a: 'middle', f: OR, w: 700 });
  return svg(1090, 420, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.7',
}, [
  { cover: true, t: 'Shells and package managers:<br>Bash, zsh and PowerShell', sub: 'Pipes that carry text vs pipes that carry objects — with real PowerShell 7 running on Linux in the lab' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Which shell runs where: bash, zsh, <b>PowerShell 5.1 vs 7</b>, cmd</li>
<li>Why the Mac’s <code class="i">/bin/bash</code> is from <b>2007</b></li>
<li>Real <b>pwsh on Linux</b>: installed, checksum verified</li>
<li><b>Text pipes vs object pipes</b>, side by side</li>
<li>Aliases that change meaning between machines</li>
<li>apt vs Homebrew vs winget / Chocolatey</li>
</ul>` },

  { t: 'Which shell, where', giua: true, body: bang(['shell', 'where you meet it', 'notes'], [
    ['<b>bash</b>', 'Ubuntu, Debian, CI images, Dockerfiles', 'the server default'],
    ['<b>zsh</b>', 'macOS login shell since 10.15 (2019)', 'Mac still ships an old bash too'],
    ['<b>Windows PowerShell 5.1</b>', 'built into Windows (per the docs)', 'Windows-only, frozen'],
    ['<b>PowerShell 7</b> (pwsh)', 'Windows, macOS, Linux', 'open source, on .NET'],
    ['<b>cmd.exe</b>', 'old Windows prompt, .bat files', 'still used by some tools'],
  ], 26) },

  { t: 'macOS still ships bash 3.2 from 2007', giua: true, to: true, body: term(m('echo $SHELL') + '\n' + m('/bin/bash -c'), 22) +
    box('', 'zsh 5.9 is the login shell; <code class="i">/bin/bash</code> is <b>3.2.57</b> — Apple stopped updating it at the GPLv3 licence change. No <code class="i">mapfile</code>, and the script keeps going: "read 0 lines".', 'do2') },

  { t: 'Real PowerShell on Linux; a Windows-made checksum', giua: true, body: term(p('curl -sSL -o /tmp/hashes.sha256', 6), 16) +
    box('', 'hashes.sha256 is <b>UTF-16LE + CRLF</b>: grep finds <b>0</b> matches until iconv. The hash then matches the tarball, and PowerShell 7.6.9 runs on Ubuntu.', 'lam') },

  { t: 'Text pipe vs object pipe', giua: true, body: pipes() },

  { t: 'Same question, two shells', giua: true, body: term(p('ps -eo pid,comm,time,rss', 2), 19) +
    box('', 'bash prints <b>text</b> columns; PowerShell sorts by the <b>CPU property</b> and even computes <code class="i">RSS_MiB</code> before anything becomes text.', 'lam') },

  { t: 'An "object" is a real .NET Process', giua: true, to: true, body: term(p("pwsh -NoProfile -c '$p", 2), 21) +
    box('', '<b>System.Diagnostics.Process</b> with <b>52</b> properties: StartTime is a date, Threads a collection — nothing to parse, nothing to break when a column moves.', 'lam') },

  { t: 'Files: compare numbers, not text', giua: true, body: term(p('find /usr/bin -type f -size +2M', 3), 17) +
    box('', '<code class="i">Where-Object Length -gt 2MB</code> compares numbers; <code class="i">Measure-Object</code> sums 749 files; <code class="i">ConvertTo-Json</code> hands the result to another program.', 'lam') },

  { t: 'Aliases change meaning between machines', giua: true, body: term(p("pwsh -NoProfile -c 'Get-Alias gci", 2), 20) +
    box('per the docs', 'Windows PowerShell 5.1 defines <code class="i">ls</code>, <code class="i">cat</code>, <code class="i">ps</code> — and <code class="i">curl</code> → Invoke-WebRequest. On Linux pwsh: <b>0</b> such aliases; <code class="i">ls</code> is /usr/bin/ls.', 'do2') },

  { t: 'Stop-Process on Linux is SIGKILL', giua: true, to: true, body: term(p('pwsh -NoProfile -c "Stop-Process') + '\n' + p("pwsh -NoProfile -c 'Get-Content /etc/os-release"), 21) +
    box('', 'Exit <b>137</b> = 128 + 9: no cleanup (lesson 14.2). On Windows it is TerminateProcess — same effect. <code class="i">Select-String</code> is PowerShell’s grep.', 'lam') },

  { t: 'A translation table', giua: true, body: bang(['task', 'bash / zsh', 'PowerShell 7'], [
    ['list files, incl. hidden', '<code class="i">ls -la</code>', '<code class="i">Get-ChildItem -Force</code>'],
    ['show / search a file', '<code class="i">cat f</code> · <code class="i">grep -n x f</code>', '<code class="i">Get-Content f</code> · <code class="i">Select-String x f</code>'],
    ['processes / kill', '<code class="i">ps aux</code> · <code class="i">kill PID</code>', '<code class="i">Get-Process</code> · <code class="i">Stop-Process -Id PID</code>'],
    ['environment variable', '<code class="i">export PORT=3000</code>', '<code class="i">$env:PORT = "3000"</code>'],
    ['B only if A succeeded', '<code class="i">A &amp;&amp; B</code>', '<code class="i">A &amp;&amp; B</code> (7+, not 5.1)'],
    ['HTTP', '<code class="i">curl -s URL</code>', '<code class="i">Invoke-RestMethod URL</code>'],
    ['PATH separator', '<code class="i">:</code>', '<code class="i">;</code> Windows · <code class="i">:</code> Linux/macOS'],
  ], 23) },

  { t: 'Package managers: apt, Homebrew, winget', giua: true, body: bang(['', 'apt (Ubuntu)', 'Homebrew (macOS)', 'winget / choco (per the docs)'], [
    ['installs into', '/usr, as root', '/opt/homebrew, no sudo', 'per installer / ProgramData'],
    ['install', '<code class="i">apt install nodejs</code>', '<code class="i">brew install node</code>', '<code class="i">winget install OpenJS.NodeJS</code>'],
    ['upgrade all', '<code class="i">apt upgrade</code>', '<code class="i">brew upgrade</code>', '<code class="i">winget upgrade --all</code>'],
    ['list', '<code class="i">dpkg -l</code>', '<code class="i">brew list</code>', '<code class="i">winget list</code>'],
  ], 21) + two(term(p('dpkg-query', 2), 17, 540), term(m('brew --version', 4), 15, 540)) },

  { t: 'Pitfall: the script silently does nothing on a Mac', giua: true, to: true, body: vsd(
    '<code class="i">#!/bin/bash</code> with <code class="i">mapfile</code>, <code class="i">declare -A</code>, <code class="i">${var,,}</code> — fine on the VPS, broken on the Mac’s bash 3.2, and the script keeps running. PowerShell 5.1 <code class="i">&gt; out.txt</code> writes UTF-16LE (per the docs).',
    'POSIX <code class="i">sh</code> for small scripts, or <code class="i">#!/usr/bin/env bash</code> + <code class="i">set -euo pipefail</code> + a modern bash; run every script in Linux CI. In PowerShell use <code class="i">Out-File -Encoding utf8</code> or pwsh 7.') },

  { t: 'Practice: one helper, three shells', giua: true, body: `
<ol>
<li>bash: 3 biggest files + 3 busiest processes, in the lab; then note what breaks on the Mac (BSD find/ps)</li>
<li>pwsh in a throwaway container (sha256 after iconv): the same with Get-ChildItem, Get-Process, ConvertTo-Json</li>
<li><code class="i">/bin/bash -c 'declare -A m; m[a]=1; echo \${m[a]}'</code> on the Mac vs the lab</li>
<li>Four install lines for Node: apt, brew, winget, choco</li>
</ol>` + box('Done when', 'the PowerShell version runs unchanged on Linux (and on Windows) and prints valid JSON, and you can name the two Mac-specific reasons the bash version broke.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>bash on servers, zsh on macOS (plus bash <b>3.2</b>), PowerShell on Windows — pwsh runs on all three</li>
<li>Bash pipes carry <b>text</b>; PowerShell pipes carry <b>objects</b> (52 properties)</li>
<li>Aliases differ: <code class="i">curl</code> is Invoke-WebRequest in Windows PowerShell 5.1</li>
<li>UTF-16 + CRLF defeated grep until iconv</li>
<li>apt as root, brew in your prefix, winget/choco on Windows</li>
</ul>` },
]);
