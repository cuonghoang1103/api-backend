/**
 * ts-00-8 — TypeScript · Section 0 · Start here (1/2) "What TypeScript is, and why it exists" (01/11/2026).
 * Slug bài: typescript-0-8-bat-dau-tai-day. Output = chạy thật Node 22.23.3 + tsc 7.0.2 trên labflow-ts (demo0/ts-00-8) và
 * một dự án tập mới (ts-00-8-practice). Mốc lịch sử: npm registry (npm view typescript time), devblogs.microsoft.com (2.0, native port,
 * 7.0), nodejs.org (v22.18.0), github.blog (Octoverse 2025). Số đo website: git ls-files trên commit c572cf189 (01/11/2026).
 */
import { lamDeck, ts, js, tc, two, box, cards, c, tbl, steps } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s00/_ma-ts-00-8.mjs';

export const deck = { key: 'ts-00-8', code: 'TS 0.S1', title: 'What TypeScript is', sub: 'Start here (1/2)' };

const bo = (s) => s.replace(/^\$ .*\n/, ''); // bỏ dòng lệnh khi đã ghi lệnh ở tiêu đề terminal

/** Dòng thời gian: items [[năm, tiêu đề, dòng phụ]] (chép từ tst-00-8). */
const timeline = (items, opts = {}) => {
  const { w = 1110, h = 330, mau = '#336791' } = opts;
  const n = items.length, gap = (w - 200) / (n - 1), y = 160;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<line x1="40" y1="${y}" x2="${w - 40}" y2="${y}" stroke="#bfbfbf" stroke-width="5" stroke-linecap="round"/>`;
  items.forEach(([nam, t, sub], i) => {
    const x = 100 + i * gap, up = i % 2 === 0;
    s += `<circle cx="${x}" cy="${y}" r="13" fill="${mau}" stroke="#fff" stroke-width="4"/>`;
    s += `<text x="${x}" y="${up ? y - 30 : y + 52}" text-anchor="middle" font-size="27" font-weight="800" fill="#b85a2b">${nam}</text>`;
    const ty = up ? y - 112 : y + 92;
    s += `<text x="${x}" y="${ty}" text-anchor="middle" font-size="19" font-weight="700" fill="#262626">${t}</text>`;
    if (sub) s += `<text x="${x}" y="${ty + 26}" text-anchor="middle" font-size="16" fill="#666">${sub}</text>`;
  });
  return s + '</svg>';
};

export const slides = lamDeck({ chuong: 'Section 0 — Start here', bai: 'Start here 1/2' }, [
  { cover: true, nhan: 'Section 0 · Start here (1/2)', t: 'What TypeScript is,<br>and why it exists', sub: 'Start here (1/2) — the language, the compiler, and why every Node team asks for it' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What TypeScript is — in one everyday picture and a few lines of code</li>
    <li>The same LabFlow bug: <b>silent in JavaScript</b>, <b>refused by tsc</b></li>
    <li>The words people mix up: TypeScript, ${c('tsc')}, type stripping, ${c('tsx')}, JSDoc, Flow</li>
    <li>Where it came from: 2012 → 2026, with dates you can check</li>
    <li>What it gives <b>you</b>: projects, internships, this website’s own code</li>
    <li>Your first real type error — and its fix — in 10 minutes</li></ul>` },
  { t: 'An everyday picture first', body: cards([
      ['📝 Spell-checker', 'It underlines a typo <b>while you type</b>, long before the teacher reads your essay. TypeScript underlines a wrong value before the code runs.'],
      ['🔌 Shaped plug', 'A three-pin plug does not fit a two-pin socket. You find out at the wall, not when the laptop burns. A type is the shape of a value.'],
      ['🏷️ Label on a box', '“Fragile — 31 glasses”. Whoever carries it knows what is inside without opening it. A type annotation is that label.'],
    ], 3) + box('The definition, now it will feel obvious', `<b>TypeScript = JavaScript + type labels</b>. A checker called ${c('tsc')} reads the labels and reports values that do not fit — <b>without running the program</b>. Then the labels are removed and plain JavaScript runs.`, 'lam') },
  { t: 'One small LabFlow function in JavaScript', body: js(CODE.endJs, { hl: [7] }) + two(tc(OUT['1-js'], { title: 'Node 22.23.3' }),
      box('No error. Just a wrong answer.', `The start time came from a form field, so it was the string ${c("'480'")}. ${c('+')} glued the texts: <b>480120</b> instead of 600. Nothing crashes — the wrong number flows on into the booking.`, 'do2'), 'r37') },
  { t: 'The same function in TypeScript', body: ts(CODE.endTs, { sm: true, hl: [2, 7] }) +
    tc(OUT['5-time-a'], { title: 'terminal — tsc 7.0.2 (run 1 of 2: 0.399 s, run 2: 0.375 s)', wrap: 100 }) +
    box('Two labels, one red line', `${c(': number')} on the two parameters is all that changed. ${c('tsc')} points at <b>line 7, column 23</b> — the exact argument — in under half a second, and nobody had to run the booking.`, 'xanh') },
  { t: 'Checking and running are two different steps', body: two(
      `<div>${tc(OUT['3-node-ts'], { title: 'node runs the .ts file' })}${box('Node does NOT check types', `Since Node 22.18 (31 Jul 2025) ${c('node file.ts')} works: Node <b>strips</b> the labels and runs the JavaScript. The bug still prints 480120.`, 'do2')}</div>`,
      `<div>${tc(OUT['2-tsc'], { title: 'tsc checks it', wrap: 52 })}${box('So every project has a gate', `Teams run ${c('tsc --noEmit')} before merging (CI). The runner is fast; the checker is the guard. Lesson 0.4 explains why.`, 'xanh')}</div>`) },
  { t: 'The words people mix up', body: `<table class="t">
      <tr><th>Word</th><th>What it really is</th></tr>
      <tr><td><b>JavaScript</b></td><td>The language browsers and Node actually run. Has no type labels.</td></tr>
      <tr><td><b>TypeScript</b></td><td>A language = JavaScript + types. Every JS file is already valid TS syntax.</td></tr>
      <tr><td><b>${c('tsc')}</b></td><td>The TypeScript compiler: checks types, can also emit ${c('.js')}. Version 7 is written in Go.</td></tr>
      <tr><td><b>Type stripping</b></td><td>Node 22.18+ deletes the labels and runs the file. Fast, checks nothing.</td></tr>
      <tr><td><b>${c('tsx')}</b></td><td>A small npm tool that runs ${c('.ts')} files (strips, does not check). Not React’s ${c('.tsx')} files!</td></tr>
      <tr><td><b>JSDoc + ${c('@ts-check')}</b></td><td>Types written in comments inside a ${c('.js')} file; ${c('tsc')} can still check them.</td></tr>
      <tr><td><b>Flow</b></td><td>Facebook’s rival type checker for JS (2014). Same idea, far fewer users today.</td></tr></table>` },
  { t: 'Types without a .ts file: JSDoc and @ts-check', body: js(CODE.endCheck, { sm: true, hl: [1, 4, 5, 12] }) +
    tc(OUT['4-checkjs'], { title: 'tsc with allowJs + checkJs', wrap: 100 }) +
    box('Same checker, same error', `The file is still JavaScript, so Node runs it unchanged — the types live in comments. Teams use this to move an old JS project to TypeScript <b>one file at a time</b> (lesson 1.4).`, 'lam') },
  { t: 'Where TypeScript came from — dates you can check', body: timeline([
      ['2012', 'TypeScript 0.8', 'public, 1 Oct · Hejlsberg'],
      ['2014', '1.0', '2 Apr 2014'],
      ['2016', '2.0: strictNullChecks', '22 Sep — null bugs caught'],
      ['2023', '5.0', '16 Mar 2023'],
      ['2025', '“10x faster”', 'Go port announced 11 Mar'],
      ['2025', 'Node 22.18', 'runs .ts by stripping · 31 Jul'],
      ['2026', 'TypeScript 7.0', 'native compiler · 8 Jul'],
    ]) + tc(bo(OUT['8-npm-time']), { title: '$ npm view typescript time --json   (filtered — check it yourself)' }) },
  { t: 'Why it was born', body: cards([
      ['📈 Apps outgrew the language', 'By 2010 teams wrote apps of hundreds of thousands of lines in a language designed in 1995 for small page scripts. No labels ⇒ nobody knew what a value could be.'],
      ['🔁 Refactoring was scary', 'Rename a field used in 200 places and JavaScript says nothing until a user hits the forgotten one. With types, every place lights up red at once.'],
      ['🧭 Editors needed to understand code', 'Autocomplete, “go to definition”, safe rename — all need to know the shape of values. Types give the editor that knowledge.'],
    ], 3) + box('The design choice that made it win', `A <b>superset</b> of JavaScript: you never rewrite, you add labels gradually — and the labels disappear at runtime. Led by <b>Anders Hejlsberg</b> (Turbo Pascal, Delphi, C#). In 2025 the team rewrote ${c('tsc')} in Go: VS Code’s 1.5 M lines checked in <b>7.5 s instead of 77.8 s</b>.`, 'lam') },
  { t: 'What it gives you', body: tc(OUT['6-website'], { title: 'this website (cuongthai.com) — git ls-files on 1 Nov 2026' }) + cards([
      ['📊 The job market', 'GitHub Octoverse 2025: TypeScript became the <b>#1 language on GitHub</b> in Aug 2025 — <b>2,636,006</b> monthly contributors, +66% in a year.'],
      ['🎓 Your FPT projects', 'SWP391, SEP490 and the Node.js major (SDN302, WDP301) are team code. Types are the contract between your functions and your teammates’.'],
      ['🏢 Not a toy', `This site: <b>1,199</b> backend ${c('.ts')} files (360,306 lines), <b>2,601</b> frontend ${c('.ts/.tsx')} files — and <b>0</b> ${c('.js')} files in ${c('src/')}.`],
    ], 3) },
  { t: 'Practice: your first type error in 10 minutes', body: two(steps([
      `Make a folder ${c('hello-ts')}, run ${c('npm init -y')}`,
      `${c('npm install -D -E typescript@7.0.2')}`,
      `Write ${c('hello.ts')} (3 lines, one wrong value)`,
      `${c('npx tsc --noEmit hello.ts')} → read the error`,
      `Fix it, check again, then ${c('node hello.ts')}`,
    ]), `<div>${ts(CODE.helloSai, { sm: true, hl: [2] })}${tc(OUT['7-p-loi'] + '\n' + OUT['7-p-dung'], { title: 'terminal — before and after the fix', wrap: 50 })}</div>`, 'r46') },
]);
