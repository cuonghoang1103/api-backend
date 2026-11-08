/**
 * node-03-4 — Node.js · Chapter 3 · Lesson 3.4 "EventEmitter" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s03-*.mjs › nodejs-3-4-eventemitter. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c3).
 * Bổ sung so với bài web: emit đồng bộ đo thật (listener 300 ms ⇒ emit trả về sau 308 ms), listener ném lỗi dội về chỗ gọi emit (chạy thật),
 * 'error' không ai nghe ⇒ sập thật (stack + exit code 1), cảnh báo rò rỉ ở listener thứ 11 chạy thật, off() với arrow viết tại chỗ không gỡ được (chạy thật).
 */
import { lamDeck, two, box, kw, vsd, bang, steps, flow, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';

export const deck = { key: 'node-03-4', code: 'NODE 3.4', title: 'EventEmitter', sub: 'Node.js — from zero to production' };

export const slides = lamDeck({ chuong: 'Chapter 3 — Core Modules', bai: '3.4' }, [
  { cover: true, t: 'EventEmitter', sub: 'Streams, servers, sockets, even the process itself: all emitters underneath.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Emit and listen</b>: publish/subscribe in its simplest form</li>
<li>Why <code class="i">emit()</code> is <b>synchronous</b>, and what that costs</li>
<li>The special <code class="i">'error'</code> event that can <b>kill your server</b></li>
<li>The <b>memory leak warning</b> you will meet, and the real fix</li>
</ul>
${kw('publish / subscribe', 'one side announces "this happened"; any number of others listen, without knowing each other')}` },

  { t: 'Emit and listen', giua: true, body: two(js(ma('c3/emitter'), { sm: true, hl: [5, 9, 10, 11] }), cot(term(ra('c3/emitter'), { hl: [3, 6] }), box('Read it', 'Two <code class="i">on</code> listeners and one <code class="i">once</code>. The second save no longer triggers <b>once</b>, and the count drops from 3 to 2.', 'lam')), 'r64') },

  { t: 'Three things to notice', to: true, giua: true, body: steps([
    '<b>Listeners run in the order they were registered</b>: log, then email, then once.',
    '<b>once removes itself</b> after it runs: the count went from 3 to 2.',
    '<b>emit() is synchronous</b>: it does not return until every listener has finished.',
  ]) + box('Not a queue', 'An emitter is not a message queue: nothing is deferred. A slow listener makes the emitter, and the event loop, wait.', 'do2') + flow([{ t: "emit('saved')", s: 'starts', mau: '#ca8a04' }, { t: '[log]', s: 'listener 1', mau: '#2563eb' }, { t: '[email]', s: 'listener 2', mau: '#2563eb' }, { t: '[once]', s: 'then removed', mau: '#7c3aed' }, { t: 'emit returns', s: 'only now', mau: '#15803d' }], { w: 1100, h: 130 }) },

  { t: 'A slow listener blocks emit()', to: true, giua: true, body: `${runJs(ma('c3/emit-sync'), ra('c3/emit-sync'), { hl: [5, 9], hlOut: [2, 3] })}
${box('Measured', 'emit() returned only after the 300 ms listener finished. In a server, that is 300 ms in which nothing else runs.', 'do2')}` },

  { t: 'A listener that throws', to: true, giua: true, body: `${runJs(ma('c3/listener-throws'), ra('c3/listener-throws'), { hl: [4, 8, 9], hlOut: [2] })}
${box('Surprise', 'The exception travels back to whoever called <code class="i">emit()</code>: code that only wanted to save a message just failed because of an unrelated listener.', 'do2')}` },

  { t: "'error' is special: nobody listening = crash", giua: true, body: two(cot(js(ma('c3/error-crash'), { sm: true, hl: [6] }), term(ra('c3/error-crash').split('\n').slice(0, 7).concat(['   …', ra('c3/error-crash').split('\n').slice(-1)[0]]).join('\n'), { title: 'node error-crash.js', hl: [4, 9] })),
    cot(js(ma('c3/error-handled'), { sm: true, hl: [4] }), term(ra('c3/error-handled'), { title: 'node error-handled.js', hl: [1, 2] }))) + box('Why servers die', 'A stream or a socket <b>is</b> an emitter. An unhandled <code class="i">\'error\'</code> becomes an uncaught exception, and the process exits.', 'do2') },

  { t: 'The memory leak warning you will meet', giua: true, body: `${runJs(ma('c3/leak-warning'), ra('c3/leak-warning'), { hl: [7, 9], hlOut: [2] })}
${box('Read it', 'Node warns at the <b>11th</b> listener on one event. It is almost never fixed by raising the limit: you are adding listeners without removing them, often inside a request handler. Each request adds one; memory grows until the process dies.', 'do2')}` },

  { t: 'The real fix: off() or once()', giua: true, body: two(js(ma('c3/off-ref', 3, 16), { sm: true, hl: [3, 8] }), term(ra('c3/off-ref'), { hl: [1, 2, 3] }), 'r64') + bang(['Method', 'What it does'], [
    ['<code class="i">on / off</code>', 'Add / remove. off needs the <b>same function</b>: an inline arrow cannot be removed'],
    ['<code class="i">once</code>', 'Removes itself after the first emit: ready, close'],
    ['<code class="i">setMaxListeners(100)</code>', '<b style="color:#b0281a">Not the fix</b>: it only hides the warning, the leak stays'],
  ], { co: 20 }) },

  { t: 'This website: realtime on emitters', to: true, giua: true, body: `${flow([{ t: 'chat service', s: 'saves the message', mau: '#2563eb' }, { t: "emit('message created')", s: 'one event', mau: '#ca8a04' }, { t: 'socket layer', s: 'pushes to the room', mau: '#15803d' }, { t: 'notifications', s: 'sends a notice', mau: '#7c3aed' }], { w: 1100, h: 140 })}
${box('The payoff', 'The code that saves a message does not need to know who cares about it. Add a listener tomorrow without touching the chat service. A Socket.IO connection is itself an emitter (Chapter 11).', 'xanh')}
${vsd(js(`async function saveMessage(m) {
  await db.insert(m);
  socketLayer.push(m);   // knows everyone
  notifier.send(m);      // who cares about it
}`, { sm: true }), js(`async function saveMessage(m) {
  await db.insert(m);
  events.emit('messageCreated', m);
}  // listeners subscribe on their own`, { sm: true }), '✗ Tightly coupled', '✓ Decoupled (illustration)')}` },

  { t: 'Four things to know about an emitter', to: true, giua: true, body: steps([
    '<b>emit is SYNCHRONOUS.</b> Listeners run in order, in the same tick, before emit returns. A slow listener blocks.',
    "<b>The 'error' event is special.</b> No listener ⇒ Node throws ⇒ the process exits. Long-lived emitters need one.",
    '<b>Listeners are not removed for you.</b> on adds; only off or once removes. An emitter that outlives its listeners is the classic leak.',
    '<b>Eleven is a warning, not a limit.</b> MaxListenersExceededWarning means Node guesses you forgot an off. It is usually right.',
  ]) },

  { t: 'Exercise: predict every line', to: true, giua: true, body: two(js(ma('c3/ex-emitter'), { sm: false }), `<div data-k="dapan">${term(ra('c3/ex-emitter'), { title: 'real output' })}</div>`, 'r64') + box('Hint', 'Registration does not run anything. emit runs listeners immediately, in order. once is gone after the first emit.', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>A listener does 2 s of sync work. How long does <code class="i">emit()</code> take to return?</li>
<li>What happens on <code class="i">emit('error')</code> with no error listener?</li>
<li>You see MaxListenersExceededWarning. What should you look for first?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. At least 2 s: emit is synchronous. &nbsp; 2. Node throws; the process exits. &nbsp; 3. A listener added per request (or per call) that is never removed: use off or once.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>EventEmitter = <b>publish/subscribe</b>, under streams, servers, sockets</li>
<li><b>emit is synchronous</b>: slow or throwing listeners hit the caller</li>
<li>Always handle <b>'error'</b> on long-lived emitters</li>
<li>Remove listeners with <b>off</b> (same reference) or use <b>once</b></li>
</ul>
${box('Next', 'Lesson 3.5 — An HTTP server with no framework.', 'lam')}` },
]);
