/**
 * node-01-2 — Node.js · Chapter 1 · Lesson 1.2 "Functions, closures and this" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: s01-javascript.mjs › nodejs-1-2-ham-closure-this. Output THẬT: that/c1/{closure,closure-factory,this-four,this-esm,this-callback,this-timer,ex-closure}.
 * Khác bài web: arrow in "hello from undefined" (web ghi "(undefined)"); thêm nhà máy kiểu middleware + callback mất this chạy thật + hàm thường trong setTimeout.
 */
import { lamDeck, two, cot, box, kw, cards, bang, ma, ra, js, term, runJs } from './_node-chung.mjs';

export const deck = { key: 'node-01-2', code: 'NODE 1.2', title: 'Functions, closures and this', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', TIM = '#7c3aed';

/* Hàm + ba lô (SVG). */
const balo = () => {
  const the = (x, ten, so, m) => `<rect data-k="balo" x="${x}" y="36" width="230" height="146" rx="16" fill="${m}12" stroke="${m}" stroke-width="3"/><text x="${x + 115}" y="74" text-anchor="middle" font-size="25" font-weight="800" font-family="Menlo,monospace" fill="${m}">${ten}</text><text x="${x + 115}" y="146" text-anchor="middle" font-size="27" font-weight="700" fill="#333">count = ${so}</text>`;
  return `<svg viewBox="0 0 520 300" width="520" height="300" font-family="Arial">${the(14, 'a()', 3, NODE)}${the(276, 'b()', 1, CAM)}<text x="260" y="228" text-anchor="middle" font-size="23" fill="#444">two calls of createCounter = two backpacks</text><text x="260" y="266" text-anchor="middle" font-size="23" font-weight="700" fill="${LAM}">nobody outside can open them</text></svg>`;
};

export const slides = lamDeck({ chuong: 'Chapter 1 — JavaScript Foundations for Backend', bai: '1.2' }, [
  { cover: true, t: 'Functions, closures<br>and this', sub: 'One sentence explains connection pools,<br>rate limiters, caches and middleware.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>closure</b> is: a function with a backpack</li>
<li>Private state without a class</li>
<li>The function-that-builds-a-function shape of <b>Express</b></li>
<li>What really decides <code class="i">this</code></li>
<li>How <code class="i">this</code> gets lost, and three ways to fix it</li>
</ul>` },

  { t: 'A closure is a function with a backpack', to: true, giua: true, body: two(`
<ul>
<li>When a function is born, it packs the <b>variables around it</b></li>
<li>It carries them wherever it goes</li>
<li>Even after the code that made them has finished</li>
</ul>`, box('Term', `${kw('closure', 'a function that remembers the variables around it')}`, 'lam')) + box('Why you care', 'Connection pools, rate limiters, caches and middleware factories are all built on this one idea.', 'xanh') },

  { t: 'Private state without a class', giua: true, body: runJs(ma('c1/closure'), ra('c1/closure'), { hl: [2, 4], hlOut: [1, 2, 3], sm: false }) },

  { t: 'Two calls, two separate backpacks', to: true, giua: true, body: two(balo(), cot(box('First', '<b>a</b> and <b>b</b> count separately: each call makes a brand-new scope.', 'xanh'), box('Second', '<code class="i">count</code> cannot be reached from outside. That is real encapsulation, no class needed.', 'lam')), 'r46') },

  { t: 'The shape of every Express middleware', giua: true, body: runJs(ma('c1/closure-factory'), ra('c1/closure-factory'), { hl: [2, 3], hlOut: [1, 2, 3], sm: true }) + box('Read it', 'The inner arrow keeps <code class="i">role</code> in its backpack. Chapter 5 uses this exact shape: <code class="i">requireRole(role)</code> returns <code class="i">(req, res, next) =&gt; …</code>', 'xanh') },

  { t: 'this: who is calling?', to: true, giua: true, body: two(`
<ul>
<li>A normal function: <code class="i">this</code> depends on <b>how it is called</b></li>
<li>Not on where it was written</li>
<li>An arrow function has <b>no this of its own</b>: it takes it from where it was written</li>
</ul>`, box('Picture it', 'The word "I" means whoever is speaking. Same word, different person. <code class="i">this</code> works the same way.', 'xanh')) },

  { t: 'Four calls, real output', giua: true, body: runJs(ma('c1/this-four'), ra('c1/this-four'), { hl: [10], hlOut: [3], sm: true }) + box('The dangerous line', 'Line 3 of the output: take a method off its object and <code class="i">this</code> is silently lost. No crash, just <code class="i">undefined</code>.', 'do2') },

  { t: 'What decides this', to: true, giua: true, body: bang(['How it is called', 'this is', 'Example'], [
    ['As a method', 'the object before the dot', '<code class="i">service.normal()</code>'],
    ['Alone', 'nothing useful', '<code class="i">const f = service.normal; f()</code>'],
    ['With bind / call / apply', 'what you pass', '<code class="i">f.bind(service)</code>'],
    ['Arrow function', 'taken from where it was written', '<code class="i">() =&gt; this.name</code>'],
  ], { co: 23 }) + box('Do not mix them up', 'A closure keeps <b>variables</b>. <code class="i">this</code> is about the <b>call</b>. The two are independent.', 'lam') },

  { t: 'In an ES module the same mistake throws', to: true, giua: true, body: runJs(ma('c1/this-esm'), ra('c1/this-esm'), { hl: [8], hlOut: [1], sm: false }) + box('Why', 'ES modules are always in <b>strict mode</b>: a lone call gets <code class="i">undefined</code> as this. A loud error instead of a silent wrong value.', 'xanh') },

  { t: 'Where it bites: passing a method as a callback', giua: true, body: `${js(ma('c1/this-callback'), { hl: [9], sm: true })}${term(ra('c1/this-callback'), { title: 'real output', hl: [1], sm: true })}
${box('Same as', '<code class="i">app.get(\'/notes\', controller.list)</code> loses <code class="i">this</code> inside <code class="i">list</code>.', 'do2')}` },

  { t: 'Three fixes, in order of preference', to: true, giua: true, body: `<ol>
<li><b>Do not use this</b>: export plain functions</li>
<li><b>bind</b>: <code class="i">controller.list.bind(controller)</code></li>
<li><b>Wrap it</b>: <code class="i">(req, res) =&gt; controller.list(req, res)</code></li>
</ol>
${box('This website', 'Services are plain exported functions: <code class="i">export async function shareNote(noteId, userId)</code>. No this, so it works from a route, a socket handler or a background job.', 'xanh')}` },

  { t: 'Why an arrow is safe inside setTimeout', to: true, giua: true, body: runJs(ma('c1/this-timer'), ra('c1/this-timer'), { hl: [4, 5], hlOut: [1, 2], sm: false }) + box('Read it', 'The arrow takes <code class="i">this</code> from <code class="i">start()</code>. The normal function is called by the timer, so <code class="i">this</code> is not your object.', 'xanh') },

  { t: 'Which function, when?', to: true, giua: true, body: cards([
    ['Arrow function', 'Callbacks, array methods, middleware bodies. The default choice.'],
    ['Normal function', 'Object methods that use this, constructors. An arrow cannot be a constructor.'],
    ['Honest advice', 'Most modern Node code avoids this. Plain functions plus closures are easier to test.'],
  ], 1) },

  { t: 'Exercise: predict the output', to: true, giua: true, body: two(js(ma('c1/ex-closure')), `<div data-k="dapan">${term(ra('c1/ex-closure'), { title: 'real output' })}</div>`, 'r64') + box('Hint', 'How many backpacks? This little function is a real <b>rate limiter</b> shape.', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why can nobody outside read <code class="i">count</code>?</li>
<li><code class="i">const f = obj.run; f();</code> What is <code class="i">this</code> in an ES module?</li>
<li>Name the three fixes for a lost <code class="i">this</code>.</li>
</ol>
<div data-k="dapan">${box('Answers', '1. It lives only in the closure. &nbsp; 2. undefined, so it throws. &nbsp; 3. Plain functions, bind, wrap in an arrow.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Closure = a function that remembers variables around it</li>
<li>A factory returns a function: the shape of middleware</li>
<li>Normal function: <code class="i">this</code> comes from the <b>call</b></li>
<li>Arrow: <code class="i">this</code> comes from where it was <b>written</b></li>
<li>Best fix: avoid <code class="i">this</code>, export plain functions</li>
</ul>
${box('Next', 'Lesson 1.3 — Objects, arrays and references.', 'lam')}` },
]);
