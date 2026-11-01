/** Web Foundations · deck bài 11.1 — Closure. Slide tiếng Anh, khuôn _pg-chung qua _wf-bai. */
import { deckWf, js, con, anh, box, two, steps, tbl, flow } from './_wf-bai.mjs';

export const deck = { key: 'wf-11-1', code: 'WF 11.1', title: 'Closure', sub: 'Web Foundations · Chapter 11' };

export const slides = deckWf({ chuong: 'Chapter 11 — Advanced JavaScript', bai: '11.1' }, [
  { cover: true, t: 'Closure', sub: 'A function that remembers where it was born — scope, private state, factories, the var-loop trap, stale values' },

  { t: 'After this lesson you can…', to: true, body: `<ul>
    <li>Say <b>which variables a function can see</b>, by reading where it is written</li>
    <li>Build <b>private state</b> that nobody outside can overwrite</li>
    <li>Write <b>function factories</b>: functions that build other functions</li>
    <li>Explain why a <code class="i">var</code> loop prints <b>3, 3, 3</b> — the classic interview question</li>
    <li>Spot a <b>stale value</b> bug before it reaches React</li></ul>
    ${box('Why it matters', 'Every event handler, every <code class="i">setTimeout</code>, every React hook is a closure. You already use them — this lesson gives you the model to predict what they do.', 'info')}` },

  { t: 'Step 0 — scope: who can see which variable', body: two(js('11-1/scope.js'), `${con('11-1/scope')}
    ${box('Rule', 'A function can look <b>outward</b> (to the code that surrounds it), never <b>inward</b>. Where you <i>write</i> the function decides this — not where you call it.', 'info')}`, 'r64') },

  { t: 'A function that outlives its parent', body: two(js('11-1/counter.js'), `${con('11-1/counter')}
    ${box('', '<code class="i">makeCounter</code> finished long ago, yet <code class="i">count</code> is still alive: the returned function still refers to it.', 'ok')}
    ${box('', 'Each call of <code class="i">makeCounter</code> makes a <b>new</b> <code class="i">count</code> ⇒ a: 4, b: 1.', '')}`, 'r64') },

  { t: 'What JavaScript keeps in memory', body: `${flow([
      { t: 'call makeCounter()', s: 'creates count = 0' },
      { t: 'return inner fn', s: 'fn points at count', mau: '#2f7d4f' },
      { t: 'makeCounter ends', s: 'count is NOT freed', mau: '#b85a2b' },
      { t: 'next()', s: 'reads + updates count' },
    ])}
    ${steps([
      'A closure = <b>a function + the variables it was born with</b>.',
      'The variable lives as long as some function can still reach it (garbage collection frees it after).',
      'Two closures from two calls ⇒ two separate sets of variables.',
    ])}
    ${box('Mental picture', 'The function carries a <b>backpack</b> holding the variables of the place it was created.', 'info')}` },

  { t: 'Private state: nobody can cheat the balance', body: two(js('11-1/account.js', null, { chi: [7, 24] }), `${con('11-1/account')}
    ${box('Closure', '<code class="i">balance</code> is unreachable; the only door is <code class="i">deposit</code>, which validates.', 'ok')}`, 'r73') },

  { t: 'Function factories', body: `${js('11-1/factory.js')}
    ${two(con('11-1/factory'), box('', '<code class="i">multiplyBy(2)</code> returns a NEW function with <code class="i">factor = 2</code> baked in; the formatter is built once.', 'ok'))}` },

  { t: 'Closures you already wrote: event handlers', body: `${two(anh('11-1/buttons.png', { w: 420 }), `${con('11-1/buttons')}
    ${box('', 'Each handler remembers <b>its own</b> <code class="i">index</code> and <code class="i">clicks</code>.', 'ok')}`, 'hai')}
    ${js('11-1/buttons.html', null, { chi: [18, 29] })}` },

  { t: 'The classic trap: var in a loop', body: two(js('11-1/var-let.js'), `${con('11-1/var-let')}
    ${box('var', 'ONE <code class="i">i</code> for the whole loop. When the timers run, the loop is over and <code class="i">i</code> is 3.', 'bad')}
    ${box('let', 'A NEW <code class="i">j</code> for every turn of the loop, so each timer captures its own.', 'ok')}`, 'r64') },

  { t: 'It captures the variable, not the value', body: two(js('11-1/variable-not-value.js'), `${con('11-1/variable-not-value')}
    ${box('Stale value bug (React)', 'A handler created in an old render sees that render’s <code class="i">count</code>. Fix: <code class="i">setCount(c =&gt; c + 1)</code> asks React for the latest value.', 'bad')}
    ${box('Want a snapshot?', 'Pass the value as an argument at that moment ⇒ a new variable.', 'ok')}`, 'r64') },

  { t: 'Two everyday helpers: once and memoize', body: `${two(js('11-1/once-memo.js', null, { chi: [15, 28] }), `${con('11-1/once-memo')}
    ${box('Real calls: 2', 'Four calls, but the slow function ran only for 9 and 4.', 'ok')}`, 'r73')}
    ${tbl(['Helper', 'Private variable (in the backpack)', 'Typical use'], [['once(fn)', 'done, result', 'initialise / connect exactly once'], ['memoize(fn)', 'cache (a Map)', 'skip repeating slow, pure work']])}` },

  { t: 'Summary & practice', to: true, body: `${two(`<ul>
    <li>Scope is decided by <b>where code is written</b>.</li>
    <li>A returned function keeps its variables alive.</li>
    <li>Use closures for <b>private state</b> and <b>factories</b>.</li>
    <li><code class="i">let</code> in loops; never <code class="i">var</code>.</li>
    <li>Closures hold the <b>variable</b> ⇒ watch for stale values.</li></ul>`,
    box('Practice (15 min)', 'Write <code class="i">makeRateLimiter(limit)</code>: it returns a function that answers <code class="i">true</code> for the first <code class="i">limit</code> calls and <code class="i">false</code> after. Two limiters must not share a counter.<br><br><b>Done when</b>: <code class="i">l = makeRateLimiter(2)</code> gives true, true, false — and a second limiter starts fresh.', 'ok'))}` },
]);
