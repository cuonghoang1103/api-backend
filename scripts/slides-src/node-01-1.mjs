/**
 * node-01-1 — Node.js · Chapter 1 · Lesson 1.1 "Variables & scope" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: s01-javascript.mjs › nodejs-1-1-bien-pham-vi. Output THẬT: that/c1/{var-loop,var-save,block-scope,hoisting,const-freeze,const-array,ex-scope}.
 * Bổ sung so với bài web: var rò khỏi khối chạy thật, ví dụ "ghi database" chạy thật, freeze một tầng chạy thật.
 */
import { lamDeck, two, cot, box, kw, bang, ma, ra, js, term, runJs } from './_node-chung.mjs';

export const deck = { key: 'node-01-1', code: 'NODE 1.1', title: 'Variables & scope: var, let, const', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', DO = '#b0281a';

/* Hộp phạm vi lồng nhau (SVG). */
const hop = () => `<svg viewBox="0 0 520 390" width="520" height="390" font-family="Arial">
<rect data-k="hop" x="4" y="4" width="512" height="382" rx="14" fill="${LAM}10" stroke="${LAM}" stroke-width="3"/><text x="24" y="38" font-size="23" font-weight="800" fill="${LAM}">file scope</text>
<rect data-k="hop" x="34" y="56" width="452" height="310" rx="14" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/><text x="54" y="90" font-size="23" font-weight="800" fill="#b85a2b">function scope: var lives here</text>
<rect data-k="hop" x="64" y="112" width="392" height="232" rx="14" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/><text x="84" y="146" font-size="23" font-weight="800" fill="${NODE}">block { }: let, const live here</text>
<text x="96" y="196" font-size="22" font-family="Menlo,monospace" fill="#333">if (…) { … }</text><text x="96" y="236" font-size="22" font-family="Menlo,monospace" fill="#333">for (…) { … }</text>
<text x="96" y="300" font-size="21" fill="#444">Inside sees outside.</text><text x="96" y="328" font-size="21" fill="#444">Outside never sees inside.</text>
</svg>`;

/* var: một hộp · let: ba hộp (SVG). */
const hopVong = () => {
  const c = (x, y, t, m) => `<rect data-k="bien" x="${x}" y="${y}" width="108" height="66" rx="10" fill="${m}18" stroke="${m}" stroke-width="3"/><text x="${x + 54}" y="${y + 44}" text-anchor="middle" font-size="27" font-weight="800" font-family="Menlo,monospace" fill="${m}">${t}</text>`;
  const cb = (x, y) => `<rect x="${x}" y="${y}" width="108" height="46" rx="8" fill="#fff" stroke="#94a3b8" stroke-width="2"/><text x="${x + 54}" y="${y + 31}" text-anchor="middle" font-size="20" fill="#475569">callback</text>`;
  const n = (x1, y1, x2, y2, m) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m}" stroke-width="3"/>`;
  let a = `<svg viewBox="0 0 520 250" width="520" height="250" font-family="Arial"><text x="260" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="${DO}">var: one shared variable</text>`;
  a += c(206, 56, 'i = 3', DO); [40, 206, 372].forEach((x) => { a += cb(x, 180) + n(x + 54, 180, 260, 122, DO); });
  a += '</svg>';
  let b = `<svg viewBox="0 0 520 250" width="520" height="250" font-family="Arial"><text x="260" y="30" text-anchor="middle" font-size="24" font-weight="800" fill="${NODE}">let: a new variable each turn</text>`;
  [40, 206, 372].forEach((x, i) => { b += c(x, 56, `j = ${i}`, NODE) + cb(x, 180) + n(x + 54, 180, x + 54, 122, NODE); });
  b += '</svg>';
  return two(a, b);
};

export const slides = lamDeck({ chuong: 'Chapter 1 — JavaScript Foundations for Backend', bai: '1.1' }, [
  { cover: true, t: 'Variables & scope:<br>var, let, const', sub: 'Three ways to declare a variable.<br>Modern backend code uses only two.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What <b>scope</b> is: nested boxes</li>
<li>The classic <b>var trap</b> inside a loop</li>
<li>Hoisting and the <b>Temporal Dead Zone</b></li>
<li>Why <code class="i">const</code> does <b>not</b> mean "cannot change"</li>
<li>Which keyword to reach for, in order</li>
</ul>` },

  { t: 'Three keywords, one table', to: true, giua: true, body: `${bang(['', 'Lives in', 'Reassign?', 'Use before declared', 'Verdict'], [
    ['<code class="i">const</code>', 'the block', 'No', 'Error', '<b>Default</b>'],
    ['<code class="i">let</code>', 'the block', 'Yes', 'Error', 'When you must'],
    ['<code class="i">var</code>', 'the whole function', 'Yes', '<code class="i">undefined</code>', 'Never in new code'],
  ], { co: 25, hl: [0] })}
${box('Term', `${kw('scope', 'the region of code where a name can be seen')}`, 'lam')}` },

  { t: 'Scope is a set of nested boxes', to: true, giua: true, body: two(hop(), `
<ul>
<li>Each pair of <b>{ }</b> makes a new box</li>
<li>Code looks <b>outward</b> for a name, box by box</li>
<li><code class="i">let</code> and <code class="i">const</code> stay inside their block</li>
<li><code class="i">var</code> ignores blocks: it <b>leaks</b> to the whole function</li>
</ul>`, 'r46') },

  { t: 'var leaks out of the block', giua: true, body: runJs(ma('c1/block-scope'), ra('c1/block-scope'), { hl: [3, 7], hlOut: [1], sm: false }) + box('Read it', 'Line 7 runs <b>outside</b> the if, and still sees <code class="i">a</code>. <code class="i">typeof</code> says b and c do not exist out there.', 'do2') },

  { t: 'The classic trap: guess the output', giua: true, body: `${js(ma('c1/var-loop'))}
<div data-k="dapan">${term(ra('c1/var-loop'), { title: 'real output', hl: [1, 2, 3] })}</div>` },

  { t: 'Why: one variable vs one per turn', giua: true, body: `${hopVong()}
${box('Why', 'The loop finishes <b>first</b>. Callbacks run after it. With <code class="i">var</code> they all read the same variable, which is now 3. With <code class="i">let</code> each turn has its own.', 'xanh')}` },

  { t: 'Not theory: three writes, wrong data', giua: true, body: `${js(ma('c1/var-save'), { sm: true })}
${two(term(ra('c1/var-save', 1, 3), { title: 'real output · var', hl: [1, 2, 3], sm: true }), term(ra('c1/var-save', 4, 6), { title: 'real output · const', sm: true }))}
${box('Silent bug', 'Nothing crashes. You simply saved the <b>last</b> item three times. Data is wrong and nobody is told.', 'do2')}` },

  { t: 'Hoisting and the Temporal Dead Zone', giua: true, body: runJs(ma('c1/hoisting'), ra('c1/hoisting'), { hlOut: [1, 2], sm: false }) + `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
${box('Term', `${kw('hoisting', 'declarations are moved to the top of their scope')}`, 'lam')}
${box('Term', `${kw('TDZ', 'the zone before the line: touching it throws')}`, 'lam')}
</div>` },

  { t: 'The TDZ error is a feature', to: true, giua: true, body: `<div class="vsd">
<div class="sai"><div class="h">var: a quiet undefined</div><p style="margin:0">The bug travels. You find it far away, much later.</p></div>
<div class="dung"><div class="h">let: a loud ReferenceError</div><p style="margin:0">The program stops at the exact line that is wrong.</p></div>
</div>
${box('Rule', 'A loud error near the cause is a gift. A silent wrong value is the expensive one.', 'xanh')}` },

  { t: 'const does NOT mean immutable', giua: true, body: two(cot(js(ma('c1/const-freeze', 1, 9), { hl: [2, 6], sm: true }), term(ra('c1/const-freeze', 1, 2), { hl: [1, 2], sm: true })), cot(box('Rule', '<code class="i">const</code> locks the <b>name</b>, not the object it points to.', 'xanh'), `<div>${js(ma('c1/const-array'))}</div>`, term(ra('c1/const-array'), { sm: true })), 'r64') },

  { t: 'Object.freeze goes one level only', to: true, giua: true, body: runJs(ma('c1/const-freeze', 11, 14), ra('c1/const-freeze', 3, 3), { hl: [2, 3], hlOut: [1], sm: false }) + box('Worse', 'In a non-strict file the failed write on line 2 is <b>silent</b>. <code class="i">name</code> stayed "An", but no error told you. <code class="i">city</code> did change.', 'do2') },

  { t: 'Which keyword, in order', to: true, giua: true, body: `<ol>
<li><b>const</b> by default. Most names are never reassigned, and the reader gets that promise for free</li>
<li><b>let</b> only when you reassign: a counter, a running total</li>
<li><b>var</b> never in new code</li>
<li>Remember: <b>const</b> does not freeze the value</li>
</ol>
${box('This website', 'Every service file declares <code class="i">const</code> first. ESLint warns about any <code class="i">let</code> that is never reassigned.', 'xanh')}` },

  { t: 'Exercise: predict the output', to: true, giua: true, body: two(js(ma('c1/ex-scope')), `<div data-k="dapan">${term(ra('c1/ex-scope'), { title: 'real output' })}</div>`, 'r64') + box('Hint', 'Synchronous lines first. Timers wait. What is <code class="i">i</code> when the loop has ended?', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why does <code class="i">var</code> print 3, 3, 3 in the loop?</li>
<li>What does the error in the TDZ help you with?</li>
<li>Can you <code class="i">push</code> to a <code class="i">const</code> array?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. One shared variable, read after the loop. &nbsp; 2. It stops at the wrong line. &nbsp; 3. Yes: the name is locked, the array is not.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Scope = nested boxes. Inside sees outside</li>
<li><code class="i">let</code>, <code class="i">const</code>: block. <code class="i">var</code>: leaks to the function</li>
<li>A loop with <code class="i">var</code> + a callback = silent wrong data</li>
<li><code class="i">const</code> locks the name, not the object</li>
</ul>
${box('Next', 'Lesson 1.2 — Functions, closures and this.', 'lam')}` },
]);
