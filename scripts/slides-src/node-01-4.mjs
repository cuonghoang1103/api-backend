/**
 * node-01-4 — Node.js · Chapter 1 · Lesson 1.4 "Async: callbacks, Promises, async/await" (slide EN, kiểu FU, 31/10/2026). MỘT DECK CHO HAI TẬP:
 *   node-1-4 (1.4a): slide 1–18 · node-1-4-2 (1.4b): slide 19–32.
 * Nguồn: s01-javascript.mjs › nodejs-1-4-bat-dong-bo. Output THẬT: that/c1/{gen-callback,gen-promise,gen-await,read-two-ways,promise-states,await-splits,forgot-await,seq-vs-all,all-settled,race-any,try-miss,unhandled,server-dies,server-net,foreach-async,express5-async,ex-async-a,ex-async-b}.
 * ĐÃ KHOÁ số đo: seq-vs-all 904 ms / 326 ms · ex-async-b 51 ms / 201 ms. ĐỪNG chạy lại mà không sửa slide + lời.
 * Bổ sung so với bài web: pyramid + chuỗi + await trên CÙNG một việc, trạng thái Promise chạy thật, hàm tách đôi tại await, server thật chết vì một request, lưới an toàn chạy thật, Express 5 tự bắt lỗi async.
 */
import { lamDeck, two, cot, box, kw, bang, ma, ra, js, term, runJs } from './_node-chung.mjs';

export const deck = { key: 'node-01-4', code: 'NODE 1.4', title: 'Async: callbacks, Promises, async/await', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed', XAM = '#94a3b8';

/* Dòng thời gian ba thế hệ (SVG). */
const baTheHe = () => {
  const T = [['2010', 'Callback', 'Pass a function to run "when done". Nests badly.', XAM], ['2015', 'Promise', 'An object standing for a future value. Chains.', LAM], ['2017', 'async / await', 'Promises that read like normal code. Use this.', NODE]];
  let s = `<svg viewBox="0 0 1110 200" width="1110" height="200" font-family="Arial"><line x1="20" y1="42" x2="1090" y2="42" stroke="#cbd5e1" stroke-width="6"/>`;
  T.forEach(([y, t, d, m], i) => { const x = 195 + i * 360, ds = d.split('. ');
    s += `<circle data-k="the" cx="${x}" cy="42" r="30" fill="${m}"/><text x="${x}" y="50" text-anchor="middle" font-size="19" font-weight="800" fill="#fff">${y}</text><text x="${x}" y="110" text-anchor="middle" font-size="30" font-weight="800" fill="${m}">${t}</text><text x="${x}" y="146" text-anchor="middle" font-size="21" fill="#444">${ds[0]}.</text><text x="${x}" y="176" text-anchor="middle" font-size="21" font-weight="700" fill="#444">${ds[1] ?? ''}</text>`; });
  return s + '</svg>';
};
/* Ba trạng thái Promise (SVG). */
const baTrangThai = () => `<svg viewBox="0 0 1110 220" width="1110" height="220" font-family="Arial"><defs><marker id="m14" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#475569"/></marker></defs>
<rect data-k="tt" x="30" y="66" width="300" height="96" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="3"/><text x="180" y="106" text-anchor="middle" font-size="29" font-weight="800" fill="#b45309">pending</text><text x="180" y="140" text-anchor="middle" font-size="21" fill="#444">still waiting</text>
<rect data-k="tt" x="680" y="4" width="400" height="96" rx="14" fill="${NODE}14" stroke="${NODE}" stroke-width="3"/><text x="880" y="44" text-anchor="middle" font-size="29" font-weight="800" fill="${NODE}">fulfilled</text><text x="880" y="78" text-anchor="middle" font-size="21" fill="#444">done, here is the value</text>
<rect data-k="tt" x="680" y="120" width="400" height="96" rx="14" fill="${DO}12" stroke="${DO}" stroke-width="3"/><text x="880" y="160" text-anchor="middle" font-size="29" font-weight="800" fill="${DO}">rejected</text><text x="880" y="194" text-anchor="middle" font-size="21" fill="#444">failed, here is the error</text>
<line x1="334" y1="96" x2="674" y2="58" stroke="#475569" stroke-width="3.5" marker-end="url(#m14)"/><line x1="334" y1="132" x2="674" y2="166" stroke="#475569" stroke-width="3.5" marker-end="url(#m14)"/></svg>`;
/* Tuần tự vs song song (SVG), số thật từ tệp output. */
const seq = ra('c1/seq-vs-all').match(/(\d+) ms/g), so1 = seq[0], so2 = seq[1];
const thanhSeq = () => {
  const b = (x, y, w, m, t) => `<rect x="${x}" y="${y}" width="${w}" height="44" rx="6" fill="${m}"/><text x="${x + w / 2}" y="${y + 30}" text-anchor="middle" font-size="21" font-weight="700" fill="#fff">${t}</text>`;
  const u = 330;
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial"><text x="0" y="28" font-size="24" font-weight="800" fill="${DO}">One after another: ${so1}</text>`;
  s += b(0, 40, u - 4, CAM, 'sleep 300') + b(u, 40, u - 4, CAM, 'sleep 300') + b(2 * u, 40, u - 4, CAM, 'sleep 300');
  s += `<text x="0" y="118" font-size="24" font-weight="800" fill="${NODE}">At the same time: ${so2}</text>`;
  [0, 1, 2].forEach((i) => { s += b(0, 130 + i * 32, u - 4, NODE, '').replace('height="44"', 'height="26"'); });
  return s + '</svg>';
};

const CHUONG = { chuong: 'Chapter 1 — JavaScript Foundations for Backend', bai: '1.4' };

export const slides = lamDeck(CHUONG, [
  /* ─────────── TẬP 1.4a ─────────── */
  { cover: true, t: 'Async: callbacks,<br>Promises, async/await', sub: 'The most important lesson of this chapter.<br>Get it wrong: slow, wrong, or dead.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why almost everything in backend means <b>waiting</b></li>
<li>Three generations of one idea</li>
<li>What a <b>Promise</b> really is: pending, fulfilled, rejected</li>
<li>What <code class="i">await</code> does, <b>step by step</b></li>
<li>Mistake 1: forgetting await. Mistake 2: waiting in line for no reason</li>
</ul>` },

  { t: 'Backend work is mostly waiting', to: true, giua: true, body: two(cot(box('A restaurant buzzer', 'You order, take a buzzer, sit down. You do not stand at the counter. It buzzes when the food is ready.', 'xanh'), box('In code', 'Read a database, call an API, read a file: all take time. Node never stands still while waiting.', 'lam')), box('Term', `${kw('asynchronous', 'start it now, get the result later')}<br><br>${kw('synchronous', 'wait here until it is finished')}`, '')) },

  { t: 'Three generations of one idea', to: true, giua: true, body: `${baTheHe()}
${box('Same idea', 'All three say: "here is what to do when the waiting is over". Only the way of writing it changes.', 'xanh')}` },

  { t: 'Generation 1: the callback', giua: true, body: `${js(ma('c1/read-two-ways', 3, 7), { hl: [2] })}
${two(box('Error first', 'The first argument is the <b>error</b>, the second the result. This is the Node convention.', 'xanh'), box('Term', `${kw('callback', 'a function you hand over, to be called later')}`, 'lam'))}
${term(ra('c1/read-two-ways', 1, 1), { title: 'real output: the file does not exist', sm: false })}` },

  { t: 'Three steps with callbacks: the pyramid', giua: true, body: `${js(ma('c1/gen-callback', 6, 15), { hl: [2, 4, 6] })}
${two(term(ra('c1/gen-callback'), { title: 'real output' }), box('The problem', 'Every step goes one level deeper, and every level repeats the error check.', 'do2'))}` },

  { t: 'Generation 2: a Promise is a buzzer', to: true, giua: true, body: `${baTrangThai()}
${box('Term', `${kw('Promise', 'an object standing for a value that will arrive later')}`, 'lam')}
${box('Picture it', 'The buzzer in your hand. It is not the food, it stands for the food. Once it buzzes, it never changes again.', 'xanh')}` },

  { t: 'See the three states, for real', giua: true, body: `${js(ma('c1/promise-states'), { hl: [5] })}${term(ra('c1/promise-states', 2), { title: 'real output', hl: [1, 2, 4] })}` },

  { t: 'Promises chain, and one catch covers all', giua: true, body: `${js(ma('c1/gen-promise'), { hl: [6, 7, 8, 9, 10] })}
${two(term(ra('c1/gen-promise'), { title: 'real output' }), box('Better', 'A flat list instead of a pyramid. One <code class="i">.catch</code> covers every step.', 'xanh'))}` },

  { t: 'Generation 3: async/await', giua: true, body: `${js(ma('c1/gen-await', 6, 13), { hl: [7, 8, 9].map((x) => x - 5) })}
${term(ra('c1/gen-await'), { title: 'real output · the same job as the pyramid' })}
${box('Use this', 'Reads top to bottom, errors go to a normal <code class="i">try/catch</code>. It is still Promises underneath.', 'xanh')}` },

  { t: 'What await really does', giua: true, body: `${js(ma('c1/await-splits'), { hl: [5] })}
${two(term(ra('c1/await-splits'), { title: 'real output', hl: [2] }), box('Surprise', '<b>B</b> prints before <b>C</b>. At <code class="i">await</code> the function pauses and hands the thread back. The rest runs later.', 'do2'))}` },

  { t: 'await, step by step', to: true, giua: true, body: `<ol>
<li><code class="i">handler()</code> runs normally until it meets <code class="i">await</code></li>
<li><code class="i">sleep(50)</code> returns a <b>pending</b> Promise</li>
<li>The function <b>pauses</b> and leaves the call stack</li>
<li>Your other code runs: the thread is <b>free</b></li>
<li>The Promise is fulfilled: the rest of the function goes in line</li>
<li>The rest runs from the line after <code class="i">await</code></li>
</ol>
${box('Rule', 'An <code class="i">async</code> function always returns a Promise, immediately.', 'xanh')}` },

  { t: 'Mistake 1: forgetting await', giua: true, body: `${js(ma('c1/forgot-await'), { hl: [7, 9] })}${term(ra('c1/forgot-await'), { title: 'real output', hl: [1, 2] })}
${box('The classic bug', '"My API returns an empty object." You sent a Promise; JSON turned it into <code class="i">{}</code>.', 'do2')}` },

  { t: 'Mistake 2: waiting in line for no reason', giua: true, body: `${two(js(ma('c1/seq-vs-all', 4, 13), { sm: true, hl: [2, 3, 4, 8] }), term(ra('c1/seq-vs-all'), { title: 'real output', hl: [1, 2], sm: true }), 'r64')}${thanhSeq()}
${box('Rule', 'If B does not need the result of A, do not <code class="i">await</code> A before starting B.', 'xanh')}` },

  { t: 'When to run things at the same time', to: true, giua: true, body: `<div class="vsd">
<div class="sai"><div class="h">B needs A's result</div><p style="margin:0">Keep the order: <code class="i">await</code> A, then B.</p></div>
<div class="dung"><div class="h">B does not need A</div><p style="margin:0">Start both: <code class="i">Promise.all</code>. A dashboard loading user, notes and tags is three trips side by side.</p></div>
</div>
${box('The opposite mistake', '5,000 queries in one <code class="i">Promise.all</code> will drain the connection pool and take the database down. Parallel means "a few at a time". Chapter 16 covers batching.', 'do2')}` },

  { t: 'Exercise: predict the order', to: true, giua: true, body: two(js(ma('c1/ex-async-a')), `<div data-k="dapan">${term(ra('c1/ex-async-a'), { title: 'real output' })}</div>`, 'r64') + box('Hint', 'Line 8 starts <code class="i">slow</code> without waiting. Which timer ends first?', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>What are the three states of a Promise?</li>
<li>At <code class="i">await</code>, what stops: the function or the thread?</li>
<li>An API returns <code class="i">{}</code> where a name should be. What is the first thing to check?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Pending, fulfilled, rejected. &nbsp; 2. Only the function. &nbsp; 3. A forgotten await.', 'xanh')}</div>` },

  { t: 'Summary, part 1', to: true, giua: true, body: `
<ul>
<li>Callback → Promise → await: one idea, better writing</li>
<li>A Promise: <b>pending</b>, then <b>fulfilled</b> or <b>rejected</b></li>
<li><code class="i">await</code> pauses the function, not the thread</li>
<li>Forgot await? You get a Promise: <code class="i">{}</code> in JSON</li>
<li>B does not need A? <code class="i">Promise.all</code></li>
</ul>
${box('Next', 'Part 2 — when async goes wrong: Promise.all vs allSettled, and the error that kills the process.', 'lam')}` },

  /* ─────────── TẬP 1.4b ─────────── */
  { cover: true, t: 'Async, part 2:<br>when things fail', sub: 'One failed promise can take down<br>a server serving thousands of requests.', nhan: 'Chapter 1 — JavaScript Foundations for Backend · Lesson 1.4 · Part 2' },

  { t: 'What you will get from this part', to: true, giua: true, body: `
<ul>
<li>Mistake 3: all-or-nothing when you did not want it</li>
<li><code class="i">all</code>, <code class="i">allSettled</code>, <code class="i">race</code>, <code class="i">any</code>: which one when</li>
<li>Mistake 4: the error that kills the whole process</li>
<li>A real server dying from one request</li>
<li>The <code class="i">forEach</code> trap, and the rules to live by</li>
</ul>` },

  { t: 'Mistake 3: all-or-nothing, by accident', giua: true, body: `${js(ma('c1/all-settled', 4, 11), { hl: [2, 7] })}${term(ra('c1/all-settled'), { title: 'real output', hl: [1, 2] })}
${box('The difference', '<code class="i">Promise.all</code> throws as soon as <b>one</b> fails. <code class="i">allSettled</code> never throws: it reports each result.', 'xanh')}` },

  { t: 'Four tools, four questions', to: true, giua: true, body: bang(['Tool', 'Answers the question', 'Use it for'], [
    ['<code class="i">Promise.all</code>', 'Did <b>all</b> of them work?', 'You need every result to continue'],
    ['<code class="i">Promise.allSettled</code>', 'How did <b>each</b> one end?', '"Send 10 notifications, a few may fail"'],
    ['<code class="i">Promise.race</code>', 'Who <b>finished</b> first?', 'A time limit on slow work'],
    ['<code class="i">Promise.any</code>', 'Who <b>succeeded</b> first?', 'Try a backup server'],
  ], { co: 23 }) + term(ra('c1/race-any'), { title: 'real output: race with a timeout, any with a backup' }) },

  { t: 'Mistake 4: try/catch does not see the future', giua: true, body: `${js(ma('c1/try-miss'), { hl: [3, 7] })}${term(ra('c1/try-miss', 1, 6), { title: 'real output', hl: [2, 6], sm: true })}
${box('Why', '<code class="i">try</code> finished long before the timer fired. The error happens later, with nobody around to catch it. Exit code: <b>1</b>.', 'do2')}` },

  { t: 'A rejected Promise with no owner', giua: true, body: `${js(ma('c1/unhandled'))}${term(ra('c1/unhandled', 1, 6), { title: 'real output', hl: [6], sm: true })}
${box('Read it', 'The last line of the program never ran: "does this line run?" was not printed. Node ended the process with exit code <b>1</b>.', 'do2')}
${box('Term', `${kw('unhandled rejection', 'a Promise failed and nobody handled it')}`, 'lam')}` },

  { t: 'A real server, killed by one request', giua: true, body: `${js(ma('c1/server-dies', 3, 8), { sm: true, hl: [4] })}
${term(ra('c1/server-dies'), { title: 'curl', sm: true, hl: [4, 6] })}
${term(`${ra('c1/server-dies', 7, 7, 'server')}\n${ra('c1/server-dies', 15, 15, 'server')}`, { title: 'server terminal · the lines that matter', sm: true, hl: [1, 2] })}
${box('Worst part', 'The bad request even got its <b>ok</b>. Then the process died, and every other user lost the server.', 'do2')}` },

  { t: 'A safety net: log it, stay alive', giua: true, body: `${js(ma('c1/server-net', 3, 5), { hl: [2] })}
${two(term(ra('c1/server-net'), { title: 'curl', sm: true, hl: [6] }), term(ra('c1/server-net', 1, undefined, 'server'), { title: 'server terminal', sm: true }), 'r64')}
${box('A net, not a fix', 'It keeps you alive and tells you what broke. You still must give that Promise an owner.', 'xanh')}
${box('Express', 'Express 4 does not catch errors from async handlers. Express 5 does: we saw a real <b>500</b> and the server stayed up. Chapter 5 covers it.', 'lam')}` },

  { t: 'The forEach trap', giua: true, body: `${js(ma('c1/foreach-async', 6, 8), { hl: [2] })}${term(ra('c1/foreach-async'), { title: 'real output', hl: [2], sm: true })}
${box('Rule', '<code class="i">forEach</code> does not wait. Use <code class="i">for...of</code> with await, or <code class="i">map</code> + <code class="i">Promise.all</code>.', 'do2')}` },

  { t: 'Rules to live by', to: true, giua: true, body: `<ol>
<li><b>await</b> everything that returns a Promise, or give it a <code class="i">.catch()</code></li>
<li>Independent work runs <b>in parallel</b>: Promise.all for a few, batches for many</li>
<li><b>Every error has an owner</b>: try/catch or .catch(). Decide, do not hope</li>
<li><b>async</b> inside an array callback is a trap</li>
</ol>` },

  { t: 'A real bug: logged out after 24 hours', to: true, giua: true, body: `
<ol>
<li>The access token expired</li>
<li>The refresh call failed</li>
<li>Nobody awaited it, nobody handled the failure</li>
<li>Every request after that returned 401, with no reason shown</li>
</ol>
${box('The fix', 'A layer that refreshes the token once, retries, and passes errors to the right place.', 'xanh')}` },

  { t: 'Exercise: all vs allSettled', to: true, giua: true, body: `${js(ma('c1/ex-async-b', 2, 14), { sm: true })}<div data-k="dapan">${term(ra('c1/ex-async-b'), { title: 'real output' })}</div>` + box('Hint', 'One task takes 200 ms, one fails at 50 ms. When does each tool answer?', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why can <code class="i">try/catch</code> not catch a throw inside <code class="i">setTimeout</code>?</li>
<li>What happens to a rejected Promise that nobody handles?</li>
<li><code class="i">arr.forEach(async …)</code>: does the next line wait?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. try has already finished. &nbsp; 2. The process dies, exit code 1. &nbsp; 3. No.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><code class="i">all</code> fails fast, <code class="i">allSettled</code> reports each</li>
<li><code class="i">race</code>: first to finish. <code class="i">any</code>: first to succeed</li>
<li><code class="i">try/catch</code> sees only what runs inside it</li>
<li>An unhandled rejection kills the whole server</li>
<li>Every error needs an owner</li>
</ul>
${box('Next', 'Lesson 1.5 — Modules: CommonJS and ES Modules.', 'lam')}` },
]);
