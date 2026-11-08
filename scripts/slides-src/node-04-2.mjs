/**
 * node-04-2 — Node.js · Chapter 4 · Lesson 4.2 "Semver and the lockfile" (slide EN, kiểu FU, đợt 3 — 01/11/2026).
 * Nguồn: content/courses/nodejs/s04-npm.mjs › nodejs-4-2-semver-lockfile. Output THẬT npm 10.9.9 / Node 22.23.3 (src/khung/node/that/c4/{semver,lockfile,cmds}).
 * Số đo 01/11/2026: ^4.18.0 → 4.22.3 (web ghi 4.22.2, nay đã có bản mới), ~4.18.0 → 4.18.3. Bổ sung so với bài web: bẫy dấu mũ dưới 1.0.0 (^0.1.7 → 0.1.13),
 * trục phiên bản thật (21 bản ổn định từ 4.18.0), máy B có 7 lỗ hổng còn máy C 0 (cùng package.json), npm ci từ chối khi lệch (EUSAGE) — đều chạy thật.
 */
import { lamDeck, two, box, kw, bang, cards, flow, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-04-2', code: 'NODE 4.2', title: 'Semver and the lockfile', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const bo = (t) => t.split('\n').filter((l) => !/fund|^$|audit fix|npm audit/.test(l)).join('\n');
const VER = ra('c4/semver', 14, 14).split(' ');   // 21 bản ổn định thật từ 4.18.0

/** Trục phiên bản SVG: mỗi bản một vạch, các dải ^ ~ ghim nằm trên. dai: [{ nhan, tu, den, mau, chon }] */
function truc(dai, { w = 1110, h = 330 } = {}) {
  const x0 = 150, x1 = w - 30, n = VER.length, dx = (x1 - x0) / (n - 1), X = (v) => x0 + VER.indexOf(v) * dx, yTruc = h - 70;
  let s = `<svg data-k="truc" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<line x1="${x0 - 20}" y1="${yTruc}" x2="${x1 + 20}" y2="${yTruc}" stroke="#404040" stroke-width="3"/>`;
  VER.forEach((v, i) => {
    const maj = v.startsWith('5.');
    s += `<line x1="${X(v)}" y1="${yTruc - 10}" x2="${X(v)}" y2="${yTruc + 10}" stroke="${maj ? DO : '#404040'}" stroke-width="3"/>`;
    s += `<text x="${X(v)}" y="${yTruc + 30 + (i % 2) * 22}" text-anchor="middle" font-size="16" fill="${maj ? DO : '#404040'}" font-weight="${v.endsWith('.0') ? 700 : 400}">${v}</text>`;
  });
  const xMaj = (X('4.22.3') + X('5.0.0')) / 2;
  s += `<line x1="${xMaj}" y1="20" x2="${xMaj}" y2="${yTruc + 70}" stroke="${DO}" stroke-width="2" stroke-dasharray="7 6"/><text x="${xMaj + 8}" y="${yTruc - 16}" font-size="16" fill="${DO}" font-weight="700">MAJOR 5: breaking</text>`;
  dai.forEach((d, i) => {
    const y = 26 + i * 62, a = X(d.tu), b = X(d.den);
    s += `<rect x="${a - 10}" y="${y}" width="${b - a + 20}" height="40" rx="10" fill="${d.mau}22" stroke="${d.mau}" stroke-width="2.5"/>`;
    s += `<text x="8" y="${y + 28}" font-size="22" font-weight="700" fill="${d.mau}">${d.nhan}</text>`;
    if (d.chon) s += `<circle cx="${X(d.chon)}" cy="${y + 20}" r="11" fill="${d.mau}"/><line x1="${X(d.chon)}" y1="${y + 31}" x2="${X(d.chon)}" y2="${yTruc - 12}" stroke="${d.mau}" stroke-width="2" stroke-dasharray="4 4"/>`;
  });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Chapter 4 — npm and a Clean Project', bai: '4.2' }, [
  { cover: true, t: 'Semver<br>and the lockfile', sub: 'Where "but it works on my machine" really comes from. Not magic, not bad luck: one symbol.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read a version number: <b>MAJOR . MINOR . PATCH</b></li>
<li>What <code class="i">^</code>, <code class="i">~</code> and an exact version <b>really</b> allow, asked from the registry</li>
<li>A real experiment: two machines, one repo, <b>two different Express versions</b></li>
<li><code class="i">npm install</code> vs <code class="i">npm ci</code>, and why the lockfile is always committed</li>
</ul>
<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('semver', 'semantic versioning: the number tells you what changed')} ${kw('lockfile', 'package-lock.json: the exact tree that was installed')}</div>
${box('Why it matters', 'This is the most common source of "but it works on my machine". It is not magic and not bad luck: it is one symbol in package.json that most people never read closely.', 'do2')}` },

  { t: 'Picture a textbook', to: true, giua: true, body: cards([
    ['📕 New edition', 'Chapters rewritten, page numbers moved. Your old notes may not match any more. <b>= MAJOR</b>'],
    ['➕ New chapter added', 'Everything you knew is still there, plus something new. <b>= MINOR</b>'],
    ['✏️ Typos fixed', 'Same book, same pages, fewer mistakes. <b>= PATCH</b>'],
  ], 3) + box('The promise', 'Authors who follow semver promise: only a MAJOR bump may break your code. It is a promise, not a guarantee.', 'lam') + box('So a range is a bet', 'When you write a range, you bet that the author kept that promise for every release inside it.', '') },

  { t: 'Read a version number', to: true, giua: true, body: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;text-align:center">
<div style="border:3px solid ${DO};border-radius:14px;padding:16px;background:#fdf0ee"><div style="font-size:84px;font-weight:800;color:${DO}">4</div><div style="font-weight:800;font-size:26px">MAJOR</div><div>breaking change: your code may stop working</div></div>
<div style="border:3px solid ${CAM};border-radius:14px;padding:16px;background:#fff7ef"><div style="font-size:84px;font-weight:800;color:${CAM}">18</div><div style="font-weight:800;font-size:26px">MINOR</div><div>new features, still backward compatible</div></div>
<div style="border:3px solid ${NODE};border-radius:14px;padding:16px;background:#f1f9f4"><div style="font-size:84px;font-weight:800;color:${NODE}">2</div><div style="font-weight:800;font-size:26px">PATCH</div><div>bug fixes only</div></div></div>
${box('Backward compatible', 'Code written for the old version still works on the new one.', 'xanh')}` },

  { t: 'What each range symbol allows, today', to: true, giua: true, body: two(term(gay(ra('c4/semver', 1, 8), 44), { title: 'npm view · asked from the registry 01/11/2026', hl: [3, 6, 8, 10] }), cot(
    box('^4.18.0 caret (npm\'s default)', 'Any 4.x.x from 4.18.0 up. Minor <b>and</b> patch may move: here four minors, to 4.22.3.', ''),
    box('~4.18.0 tilde', 'Any 4.18.x. Patch only, much stricter: 4.18.3.', 'lam'),
    box('4.18.0 exact', 'That version, forever.', 'xanh'))) + box('Which one do you get by default?', '<code class="i">npm i express</code> writes a caret: <code class="i">"express": "^5.3.0"</code> (you saw it in lesson 4.1). So most projects float on minors without anyone deciding it.', 'do2') },

  { t: 'The same three ranges on a real version axis', giua: true, body: truc([
    { nhan: '^4.18.0', tu: '4.18.0', den: '4.22.3', mau: CAM, chon: '4.22.3' },
    { nhan: '~4.18.0', tu: '4.18.0', den: '4.18.3', mau: LAM, chon: '4.18.3' },
    { nhan: '4.18.0', tu: '4.18.0', den: '4.18.0', mau: NODE, chon: '4.18.0' },
  ]) + box('Read it', 'Every tick is a real Express release from 4.18.0 on (21 stable ones). No range ever crosses into 5: that is the MAJOR line.', 'lam') },

  { t: 'The trap below 1.0.0', to: true, giua: true, body: two(term(ra('c4/semver', 9, 12), { title: 'npm view', hl: [2, 4] }), cot(
    box('^0.1.7 → 0.1.13', 'Below 1.0.0 the caret allows <b>patches only</b>, as strict as a tilde.', 'lam'),
    box('^1.7.0 → 1.9.0', 'From 1.0.0 on, the caret allows minors again.', ''))) + bang(['Range', 'Allows', 'Same as'], [
    ['<code class="i">^1.7.0</code>', '1.7.0 up to, not including, 2.0.0', 'minor + patch'],
    ['<code class="i">^0.1.7</code>', '0.1.7 up to, not including, 0.2.0', '<code class="i">~0.1.7</code> (patch only)'],
  ], { co: 22 }) + box('Why', 'In 0.x, semver treats every minor as possibly breaking. Do not assume ^0.x will pick up new features.', 'xanh') },

  { t: 'The experiment: what the repo contains', giua: true, body: term(gay(ra('c4/lockfile', 2, 9), 92), { title: 'one repo, created back when 4.18.0 was new', hl: [2, 5, 7] }) +
    two(box('package.json', 'A <b>range</b>: "^4.18.0". Many versions satisfy it.', ''), box('package-lock.json', 'The <b>exact</b> version, the download URL, and an integrity hash of the file.', 'lam')) },

  { t: 'Two machines, one repo, two versions', giua: true, body: two(term(bo(ra('c4/lockfile', 11, 26)), { title: 'machine B · npm ci', hl: [3, 6] }), term(bo(ra('c4/lockfile', 28, 38)), { title: 'machine C · rm package-lock.json && npm install', hl: [3, 6] })) +
    box('Nobody edited package.json', 'Both machines obeyed it perfectly. Yet B runs 4.18.0 (7 known vulnerabilities) and C runs 4.22.3 (0). Any bug that shows on only one machine confuses the team until someone compares versions.', 'do2') + flow([
    { t: 'Same repo', s: '"^4.18.0" + lockfile 4.18.0', mau: LAM }, { t: 'Machine B', s: 'npm ci → 4.18.0', mau: NODE }, { t: 'Machine C', s: 'no lockfile → 4.22.3', mau: DO }], { h: 130, fs: 22 }) },

  { t: 'npm install vs npm ci', to: true, giua: true, body: bang(['', 'npm install', 'npm ci'], [
    ['Reads ranges', 'yes, resolves them', 'no, reads the lockfile'],
    ['May rewrite the lockfile', 'yes', 'never'],
    ['node_modules', 'updates it', 'deletes it first, clean install'],
    ['package.json ≠ lockfile', 'fixes the lockfile', 'refuses with an error'],
    ['Use it when', 'you add or upgrade a package', 'CI, Docker, and just running a project'],
  ], { co: 22, hl: [4] }) + box('Rule', 'npm ci everywhere, except when you are deliberately changing dependencies. It is also faster: no resolving.', 'xanh') },

  { t: 'npm ci refuses when the two disagree', giua: true, body: term(gay(ra('c4/lockfile', 40, 49), 96) + '\n...', { title: 'package.json says ^5.0.0, the lockfile still pins 4.18.0 (abridged)', hl: [2, 5, 6, 7, 8] }) +
    two(box('Good news', 'It stops <b>before</b> installing anything wrong, and tells you exactly which packages disagree.', 'xanh'), box('Fix', 'Run <code class="i">npm install</code> once on your machine, commit the new lockfile, then CI is green again.', 'lam')) },

  { t: 'Commit the lockfile. Always.', to: true, giua: true, body: cards([
    ['🔒 Exact versions + hashes', 'For every package in the tree, including dependencies of dependencies, which package.json never mentions.'],
    ['🚫 Never in .gitignore', 'You will see that advice. It is wrong for applications.'],
    ['📚 Libraries are different', 'A library does not ship its lockfile: the app that uses it decides the tree.'],
    ['✋ Never edit it by hand', 'Change package.json, let npm regenerate the lockfile.'],
  ], 2) + box('In code review', 'A lockfile diff shows every package that changed. A new indirect dependency nobody asked for is worth one question. The integrity hash also makes a tampered download fail.', 'xanh') },

  { t: 'Upgrade on purpose', giua: true, body: two(js(`npm outdated          # who is behind
npm update            # move inside the range
npm i express@latest  # a major: read the changelog`, { sm: false }) + term(ra('c4/cmds', 14, 16).replace(/ {2}Location +Depended by|  node_modules\/express  notes-api/g, ''), { title: 'npm outdated (columns trimmed)', hl: [3] }), cot(
    box('Current · Wanted · Latest', 'Installed 4.18.0 · the range allows 4.22.3 · the newest is 5.3.0 (a major jump).', 'lam'),
    box('This website', 'Deploys install with <code class="i">npm ci</code>, so the container runs exactly the tree that was tested in CI.', 'xanh'),
    box('The alternative', '<code class="i">npm install</code> at deploy time: the image you tested and the image you ship may silently differ.', 'do2'))) },

  { t: 'Exercise: tilde instead of caret', to: true, giua: true, body: two(`<div style="font-size:28px">package.json says <code class="i">"express": "~4.18.0"</code>.<br>The lockfile pins <b>4.18.0</b>.<ol><li>A teammate runs <code class="i">npm ci</code>. Which version?</li><li>Another deletes the lockfile and runs <code class="i">npm install</code>. Which version?</li></ol></div>`,
    `<div data-k="dapan">${box('1 · npm ci', 'Exactly <b>4.18.0</b>: it obeys the lockfile.', 'xanh')}${term(ra('c4/semver', 3, 4), { title: '2 · what ~4.18.0 resolves to today' })}${box('2 · npm install', '<b>4.18.3</b>: the newest 4.18.x. Smaller drift than ^, but still a drift.', 'lam')}</div>`) + box('Lesson', 'Only the lockfile pins. Any range, even a tilde, drifts the moment the lockfile is gone.', '') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>package.json says ^4.18.0. Can npm install Express 5.0.0? Why?</li>
<li>Which command should a Dockerfile use, and why?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. No: the caret never crosses a MAJOR. &nbsp; 2. <code class="i">npm ci</code>: exactly the lockfile, never rewrites it, fails if out of sync.', 'xanh')}</div>
<ul>
<li>MAJOR breaks · MINOR adds · PATCH fixes; below 1.0.0 the caret is strict</li>
<li>package.json holds ranges, the lockfile holds the exact tree</li>
<li>Commit the lockfile, install with npm ci, upgrade on purpose</li>
</ul>
${box('Next', 'Lesson 4.3: supply chain safety. One dependency, sixty-seven packages.', 'lam')}` },
]);
