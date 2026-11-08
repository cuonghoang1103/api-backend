/**
 * node-01-3 — Node.js · Chapter 1 · Lesson 1.3 "Objects, arrays and references" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: s01-javascript.mjs › nodejs-1-3-object-tham-chieu. Output THẬT: that/c1/{value-ref,shallow-deep,json-clone,destructure,spread-update,nullish,ex-copy}.
 * Bổ sung so với bài web: chứng minh === so địa chỉ, bẫy JSON.parse chạy thật, lưu ý limit từ query là CHUỖI (chỉ thành số 0 sau Number()).
 */
import { lamDeck, two, cot, box, kw, cards, bang, ma, ra, js, term, runJs } from './_node-chung.mjs';

export const deck = { key: 'node-01-3', code: 'NODE 1.3', title: 'Objects, arrays and references', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', DO = '#b0281a';

/* Stack ↔ heap (SVG): hai biến trỏ một object. */
const boNho = () => `<svg viewBox="0 0 1000 320" width="1000" height="320" font-family="Arial">
<defs><marker id="m13" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${DO}"/></marker></defs>
<rect data-k="vung" x="4" y="4" width="360" height="312" rx="14" fill="${LAM}0d" stroke="${LAM}" stroke-width="3"/><text x="184" y="40" text-anchor="middle" font-size="25" font-weight="800" fill="${LAM}">Stack: the names</text>
<rect data-k="vung" x="620" y="4" width="376" height="312" rx="14" fill="${NODE}0d" stroke="${NODE}" stroke-width="3"/><text x="808" y="40" text-anchor="middle" font-size="25" font-weight="800" fill="${NODE}">Heap: the objects</text>
${[['a', '5', 62], ['b', '6', 124], ['x', '→', 186], ['y', '→', 248]].map(([t, v, y]) => `<rect x="28" y="${y}" width="312" height="52" rx="8" fill="#fff" stroke="#94a3b8" stroke-width="2"/><text x="60" y="${y + 36}" font-size="26" font-weight="700" font-family="Menlo,monospace" fill="#333">${t}</text><text x="250" y="${y + 36}" text-anchor="middle" font-size="26" font-weight="700" font-family="Menlo,monospace" fill="${v === '→' ? DO : '#333'}">${v}</text>`).join('')}
<rect x="652" y="150" width="312" height="96" rx="12" fill="#fff" stroke="${NODE}" stroke-width="3"/><text x="808" y="208" text-anchor="middle" font-size="28" font-weight="800" font-family="Menlo,monospace" fill="#333">{ n: 6 }</text>
<path d="M270,212 C400,212 520,200 648,192" fill="none" stroke="${DO}" stroke-width="3.5" marker-end="url(#m13)"/><path d="M270,274 C400,274 520,240 648,212" fill="none" stroke="${DO}" stroke-width="3.5" marker-end="url(#m13)"/>
</svg>`;

/* Sao chép nông vs sâu (SVG). */
const nongSau = () => {
  const o = (x, y, w, t, m) => `<rect x="${x}" y="${y}" width="${w}" height="60" rx="10" fill="${m}12" stroke="${m}" stroke-width="3"/><text x="${x + w / 2}" y="${y + 39}" text-anchor="middle" font-size="22" font-weight="700" font-family="Menlo,monospace" fill="#333">${t}</text>`;
  const n = (x1, y1, x2, y2, m) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m}" stroke-width="3" marker-end="url(#m13b)"/>`;
  return `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial"><defs><marker id="m13b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#475569"/></marker></defs>
<text x="290" y="26" text-anchor="middle" font-size="24" font-weight="800" fill="${DO}">Shallow copy: inner object SHARED</text>
${o(20, 44, 240, 'original', LAM)}${o(320, 44, 240, 'shallow', CAM)}${o(170, 160, 240, 'address', DO)}${n(140, 104, 250, 158, '#475569')}${n(440, 104, 330, 158, '#475569')}
<text x="850" y="26" text-anchor="middle" font-size="24" font-weight="800" fill="${NODE}">Deep copy: nothing shared</text>
${o(620, 44, 220, 'original', LAM)}${o(860, 44, 230, 'deep', CAM)}${o(620, 160, 220, 'address', NODE)}${o(860, 160, 230, 'address copy', NODE)}${n(730, 104, 730, 158, '#475569')}${n(975, 104, 975, 158, '#475569')}</svg>`;
};

export const slides = lamDeck({ chuong: 'Chapter 1 — JavaScript Foundations for Backend', bai: '1.3' }, [
  { cover: true, t: 'Objects, arrays<br>and references', sub: 'Why did my original change?<br>Nearly every such bug starts here.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Value vs reference</b>: where the data really lives</li>
<li>Why a <b>shallow copy</b> goes only one level</li>
<li>Destructuring: how you read a request</li>
<li>Spread: update without touching the original</li>
<li><code class="i">?.</code> and <code class="i">??</code>, and a real pagination bug</li>
</ul>` },

  { t: 'A primitive is copied. An object is shared.', giua: true, body: runJs(ma('c1/value-ref'), ra('c1/value-ref'), { hl: [9, 13], hlOut: [2, 4], sm: false }) },

  { t: 'Where it lives: stack and heap', giua: true, body: `<div style="display:flex;justify-content:center">${boNho()}</div>
${two(box('Term', `${kw('reference', 'the address of an object, not the object')}`, 'lam'), box('Rule', 'Two names can point at one object. A change through either name is seen by both.', 'do2'))}` },

  { t: 'A shallow copy goes one level only', giua: true, body: `${js(ma('c1/shallow-deep'), { hl: [5] })}${term(ra('c1/shallow-deep'), { title: 'real output', hl: [1] })}` },

  { t: 'Picture the two copies', to: true, giua: true, body: `${nongSau()}
${two(box('{ ...obj }', 'A new object on top, the same inner objects below.', 'do2'), box('structuredClone(obj)', 'Copies every level. Slower: use it when you really need depth.', 'xanh'))}` },

  { t: 'The old trick: JSON.parse(JSON.stringify())', giua: true, body: `${js(ma('c1/json-clone', 1, 7), { sm: true })}${term(ra('c1/json-clone'), { title: 'real output · last line: JSON.stringify({ big: 10n }) inside a try', hl: [1, 7], sm: true })}
${box('It damages your data', 'Date becomes a string, Set becomes <code class="i">{}</code>, undefined disappears, BigInt throws. Use <code class="i">structuredClone</code>.', 'do2')}` },

  { t: 'Destructuring: how you read a request', giua: true, body: runJs(ma('c1/destructure'), ra('c1/destructure'), { hl: [8, 9, 10], hlOut: [1, 2], sm: false }) },

  { t: 'A default fires only for undefined', to: true, giua: true, body: `${bang(['The client sends', 'body = "" gives', 'Why'], [
    ['nothing', '<code class="i">\'\'</code>', 'The field is undefined: default used'],
    ['<code class="i">"body": null</code>', '<code class="i">null</code>', 'null is a value: default ignored'],
    ['<code class="i">"body": ""</code>', '<code class="i">\'\'</code>', 'An empty string is a value too'],
  ], { co: 25, hl: [1] })}
${box('Real output above', '<code class="i">body</code> stayed <code class="i">null</code>. Your code must still handle it.', 'do2')}` },

  { t: 'Spread: update without touching the original', to: true, giua: true, body: runJs(ma('c1/spread-update'), ra('c1/spread-update'), { hl: [2, 6], hlOut: [2], sm: false }) + box('Security habit', 'Take secrets out with destructuring. Do not trust your memory about which fields are safe to return.', 'xanh') },

  { t: 'Optional chaining and nullish', to: true, giua: true, body: runJs(ma('c1/nullish'), ra('c1/nullish'), { hl: [2, 7, 8], hlOut: [2, 3], sm: false }) + two(box('Term', `${kw('?.', 'stop and give undefined if the left side is missing')}`, 'lam'), box('Term', `${kw('??', 'use the right side only for null or undefined')}`, 'lam')) },

  { t: 'A real pagination bug', to: true, giua: true, body: two(cot(box('With ||', 'A valid <b>0</b> counts as false and silently turns into <b>20</b>.', 'do2'), box('With ??', 'Only a missing value becomes 20. <b>0</b> stays 0.', 'xanh')), box('Careful', 'From a real URL, <code class="i">req.query.limit</code> is the <b>string</b> <code class="i">\'0\'</code>. The bug appears once you convert it with <code class="i">Number()</code>.', '')) },

  { t: 'This website: never leak a secret', to: true, giua: true, body: `<div class="vsd">
<div class="sai"><div class="h">Return the raw row</div><p style="margin:0">Add a column tomorrow and it goes straight out through the API.</p></div>
<div class="dung"><div class="h">serializeUser(): field by field</div><p style="margin:0">A new column cannot leak: it was never listed.</p></div>
</div>
${box('Rule', 'Build the response object explicitly, one field at a time.', 'xanh')}` },

  { t: 'Value or reference: four rules', to: true, giua: true, body: cards([
    ['Primitives are COPIED', 'Numbers, strings, booleans. Changing one never touches the other.'],
    ['Objects are SHARED', 'A variable holds a reference. Two names, one object.'],
    ['Spread copies one level', 'Inner objects stay shared. Most surprises live here.'],
    ['structuredClone copies all', 'Deep, built in, handles Date and Map. Slower.'],
  ], 2) },

  { t: 'Exercise: predict the output', to: true, giua: true, body: two(js(ma('c1/ex-copy')), `<div data-k="dapan">${term(ra('c1/ex-copy'), { title: 'real output' })}</div>`, 'r73') + box('Hint', 'Draw the boxes first. Which names share which object?', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>What does <code class="i">const y = x</code> copy when x is an object?</li>
<li>Does <code class="i">{ body = '' }</code> replace a <code class="i">null</code>?</li>
<li><code class="i">0 || 20</code> and <code class="i">0 ?? 20</code>: what do they give?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The reference only. &nbsp; 2. No, only undefined. &nbsp; 3. 20 and 0.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Primitive = copied. Object = shared by reference</li>
<li><code class="i">{ ...obj }</code> is shallow, <code class="i">structuredClone</code> is deep</li>
<li>Defaults fire only for <code class="i">undefined</code></li>
<li>Numbers: use <code class="i">??</code>, not <code class="i">||</code></li>
<li>Strip secrets, build responses field by field</li>
</ul>
${box('Next', 'Lesson 1.4 — Async: callbacks, Promises, async/await.', 'lam')}` },
]);
