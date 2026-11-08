/**
 * node-00-3 — Node.js · Section 0 · Lesson 0.3 "Setting up your environment" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: s00-intro.mjs › nodejs-0-3-cai-dat. Output THẬT: that/c0/{nvm-demo,nvmrc-demo,hello,repl-demo}. nvm-demo chạy trong NVM_DIR tạm, tải thật Node 22 (bản 22.23.4 tại lúc quay).
 * Phần Windows KHÔNG chạy được trên máy quay (macOS) ⇒ slide ghi rõ "not run on this Mac".
 */
import { lamDeck, two, cot, box, cards, kw, steps, bang, ma, ra, js, term } from './_node-chung.mjs';

export const deck = { key: 'node-00-3', code: 'NODE 0.3', title: 'Setting up your environment', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', DO = '#b0281a', XAM = '#94a3b8';

/* Dòng thời gian phiên bản (SVG). */
const dongPhienBan = () => {
  const V = [[18, 'ended', XAM], [20, 'ended', XAM], [21, 'odd', DO], [22, 'LTS', NODE], [23, 'odd', DO], [24, 'LTS', NODE]];
  let s = `<svg viewBox="0 0 1110 170" width="1110" height="170" font-family="Arial"><line x1="20" y1="84" x2="1090" y2="84" stroke="#cbd5e1" stroke-width="6"/>`;
  V.forEach(([v, n, m], i) => { const x = 95 + i * 184;
    s += `<circle data-k="ban" cx="${x}" cy="84" r="46" fill="${m}"/><text x="${x}" y="98" text-anchor="middle" font-size="38" font-weight="800" fill="#fff">${v}</text><text x="${x}" y="24" text-anchor="middle" font-size="23" font-weight="800" fill="${m}">${n}</text>`; });
  return s + `<text x="555" y="162" text-anchor="middle" font-size="21" fill="#555">a new major every 6 months · even numbers become LTS</text></svg>`;
};

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.3' }, [
  { cover: true, t: 'Setting up your<br>environment', sub: 'Install a version manager, not Node.<br>Then prove it works with three commands.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why you install a <b>version manager</b>, not Node itself</li>
<li>Which version to choose: <b>LTS</b></li>
<li>nvm on macOS/Linux, nvm-windows or fnm on Windows</li>
<li>Your first program and the <b>REPL</b></li>
<li>How to <b>pin</b> a version so "works on my machine" means something</li>
</ul>` },

  { t: 'Why a version manager?', to: true, giua: true, body: two(`
${box('Project A', 'Old company project. Needs <b>Node 20</b>.', 'lam')}
${box('Project B', 'New project. Needs <b>Node 22</b>.', 'xanh')}`, `
${box('Without a manager', 'Uninstall, reinstall, repeat. Every. Single. Time.', 'do2')}
${box('With a manager', 'One command: <code class="i">nvm use 22</code>', 'xanh')}`) + box('Term', `${kw('version manager', 'a tool that keeps many Node versions and switches between them')}`, 'lam') },

  { t: 'Which version? The LTS.', giua: true, body: `${dongPhienBan()}
${bang(['', 'Rule'], [
    ['<b>Use</b>', 'The current LTS. This course is written and verified on <b>Node 22.x</b>'],
    ['<b>Avoid</b>', 'Odd majors (21, 23) and versions past end of support (16, 18, 20)'],
    ['<b>Principle</b>', 'Your laptop, CI and the server run the <b>same major</b>'],
  ], { co: 23 })}
${box('Term', `${kw('LTS', 'Long-Term Support: fixed for about 30 months')} &nbsp; ${kw('major', 'the first number in 22.23.4')}`, 'lam')}` },

  { t: 'macOS and Linux: nvm', giua: true, body: `${term(`# 1. install nvm (the version manager itself)
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 2. open a NEW terminal, then install and activate Node 22
$ nvm install 22
$ nvm use 22
$ nvm alias default 22    # default for every new terminal`, { title: 'terminal · commands from the lesson' })}
${box('Trap: nvm: command not found', 'The installer wrote setup lines into your shell file, but a terminal that is already open never reads it again. <b>Close the window and open a new one.</b> zsh reads <code class="i">~/.zshrc</code>, bash reads <code class="i">~/.bashrc</code>.', 'do2')}` },

  { t: 'What a real install prints', giua: true, body: term(ra('c0/nvm-demo', 1, 11), { title: 'real session · throw-away folder · Node 22 on macOS', hl: [2, 6, 11] }) + box('Read it', 'nvm downloads the newest 22.x, checks it has not been changed in transit (<b>checksum</b>), then switches to it. At the time of recording that was <b>v22.23.4</b>. Yours may be newer.', 'xanh') },

  { t: 'macOS vs Windows, side by side', to: true, giua: true, body: `<div class="vsd">
<div class="dung"><div class="h">macOS / Linux: nvm</div>${term('$ nvm install 22\n$ nvm use 22', { title: 'zsh · bash', sm: true })}<p style="margin:8px 0 0">Run for real in this lesson.</p></div>
<div class="sai" style="background:#eef4fa;border-color:#c9dbec"><div class="h" style="color:#245077">Windows: nvm-windows or fnm</div>${term('> winget install Schniz.fnm\n> nvm install 22.21.0\n> nvm use 22.21.0', { title: 'PowerShell · not run on this Mac', sm: true })}<p style="margin:8px 0 0">Open the terminal as Administrator.</p></div>
</div>
${box('Windows traps', 'The Linux nvm does not run on Windows. Already installed Node from nodejs.org? <b>Remove it first</b>: two Nodes in PATH is a nightmare to debug.', 'do2')}
${box('Term', `${kw('PATH', 'the list of folders your terminal searches for programs')}`, 'lam')}` },

  { t: 'Check your install: three commands', to: true, giua: true, body: `${term(ra('c0/nvm-demo', 12, 19), { title: 'real output', hl: [2, 4, 6, 8] })}
${two(box('Rule', 'All must answer, and the <b>major</b> must be the one you wanted.', 'xanh'), box('Line 3 and 4', 'Node is a wrapper around <b>V8</b> (runs JS) and <b>libuv</b> (event loop). Chapter 2 opens them up.', 'lam'))}` },

  { t: 'Your editor: VS Code + 4 extensions', to: true, giua: true, body: cards([
    ['ESLint', 'Catches real bugs as you type: unused variables, dead code, forgotten await.'],
    ['Prettier', 'Formats on save. Stop arguing with yourself about commas.'],
    ['REST Client / Thunder Client', 'Send HTTP requests inside the editor.'],
    ['Error Lens', 'Shows errors right on the line, not in a hidden panel.'],
  ], 2) + box('', 'Use VS Code unless you already love another editor. These pay for themselves in the first week.', 'xanh') },

  { t: 'Your first Node program', giua: true, body: `${js(ma('c0/hello'))}
${term(`$ node hello.js\n${ra('c0/hello')}`, { title: 'real output · yours will differ' })}
${box('Notice', '<code class="i">process</code> and <code class="i">os</code> are built in. Nothing to install. Your numbers will differ, and that is the point: this runs on <b>your</b> machine.', 'xanh')}` },

  { t: "Why 'node:os' and not just 'os'?", to: true, giua: true, body: `<div class="vsd">
<div class="dung"><div class="h">Clear</div>${js("const os = require('node:os');")}<p style="margin:8px 0 0">Means: the module built into Node.</p></div>
<div class="sai"><div class="h">Works, but unclear</div>${js("const os = require('os');")}<p style="margin:8px 0 0">Could anyone publish a package called <b>os</b>?</p></div>
</div>
${box('Why it matters', 'The <code class="i">node:</code> prefix removes the doubt. Attacks using lookalike package names are real. Chapter 4 covers them.', 'do2')}` },

  { t: 'The REPL: try one line, right now', to: true, giua: true, body: two(term(ra('c0/repl-demo'), { title: 'real session: type node, then Enter', hl: [3, 5] }), cot(box('Term', `${kw('REPL', 'Read, Eval, Print, Loop')}`, 'lam'), `<ul>
<li>Type <code class="i">node</code> with no file name</li>
<li>The fastest answer to "what does this return?"</li>
<li>Leave with <code class="i">.exit</code></li>
</ul>`)) },

  { t: 'Pin the version in the project', giua: true, body: two(`${term(ra('c0/nvmrc-demo'), { title: 'real session', hl: [6] })}`, cot(box('.nvmrc', 'One small file: anyone can run <code class="i">nvm use</code>.', 'xanh'), box('Our rule', 'This website pins Node 22 in <b>three</b> places:<br>· <code class="i">engines</code> in package.json<br>· the Dockerfile base image<br>· the CI workflow', 'lam')), 'r46') + box('When they drift', 'Code runs on your laptop and dies on the server: the bug only appears in front of users.', 'do2') },

  { t: 'Four steps to a Node you can change later', to: true, giua: true, body: `${steps([
    '<b>Install a version manager</b>, not Node: nvm, fnm or volta',
    '<b>Pin per project</b>: a <code class="i">.nvmrc</code> file or the engines field',
    '<b>Use an LTS</b>: even majors. Odd ones are for trying, not for deploying',
    '<b>Confirm</b> with <code class="i">node --version</code> in a <b>new</b> terminal',
  ])}
${box('Why a new terminal', 'An old terminal read PATH when it started. That alone explains half of all "install failed" reports.', '')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>You just installed nvm and see <code class="i">command not found</code>. What do you do?</li>
<li>Node 23 or Node 22 for production?</li>
<li>Which command proves Node carries V8 inside it?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Open a new terminal. &nbsp; 2. Node 22: even, LTS. &nbsp; 3. <code class="i">node -p "process.versions.v8"</code>', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Install a <b>version manager</b>, then <code class="i">nvm install 22</code></li>
<li>Always an <b>LTS</b>; the same major everywhere</li>
<li>VS Code + ESLint, Prettier, REST Client, Error Lens</li>
<li><code class="i">node file.js</code> runs a file, <code class="i">node</code> alone opens the REPL</li>
<li>Pin it: <code class="i">.nvmrc</code> or <code class="i">engines</code></li>
</ul>
${box('Next', 'Lesson 0.4 — The project we build together.', 'lam')}` },
]);
