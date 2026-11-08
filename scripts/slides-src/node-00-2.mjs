/**
 * node-00-2 — Node.js · Section 0 · Lesson 0.2 "How to study this course" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s00-intro.mjs › nodejs-0-2-cach-hoc. Mã + output THẬT Node 22.23.3 (that/c0/route-*, port-busy, wrong-port).
 * Bổ sung so với bài web: phá một route thật (xoá await, server sập, cổng bận, sai cổng) và đọc lỗi thật từng dòng.
 */
import { lamDeck, two, cot, box, cards, kw, flow, steps, bang, ma, ra, js, term } from './_node-chung.mjs';

export const deck = { key: 'node-00-2', code: 'NODE 0.2', title: 'How to study this course', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';

const VONG = [{ t: '1 Read', s: 'once, no typing', mau: LAM }, { t: '2 Retype', s: 'by hand', mau: NODE }, { t: '3 Break', s: 'on purpose', mau: DO }, { t: '4 Explain', s: 'out loud', mau: TIM }, { t: '5 Practice', s: 'on Code Lab', mau: CAM }];

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.2' }, [
  { cover: true, t: 'How to study<br>this course', sub: 'Reading feels like learning.<br>Typing and breaking things is learning.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A <b>five-step loop</b> to use for every lesson</li>
<li>Why you must <b>retype</b> code, never copy-paste</li>
<li>How to <b>break</b> working code and read the error</li>
<li>The <b>"explain" test</b>: do you know it, or only recognize it?</li>
<li>Habits that save you months</li>
</ul>` },

  { t: 'Reading code feels like learning. It is not.', to: true, giua: true, body: `<div class="vsd">
<div class="sai"><div class="h">60 hours of reading</div><p style="margin:0">Everything looks familiar. Then you open an empty folder and cannot start.</p></div>
<div class="dung"><div class="h">60 hours of typing</div><p style="margin:0">You make mistakes, read the errors, fix them. You can start from nothing.</p></div>
</div>
${box('The biggest reason', 'People "finish" a backend course and still cannot build anything because they <b>read</b> it instead of <b>typing</b> it.', 'do2')}` },

  { t: 'The loop: five steps for every lesson', to: true, giua: true, body: `${flow(VONG, { h: 150, fs: 23 })}
${steps(['<b>Read</b> once, no typing. Just build a map in your head.', '<b>Retype</b> every example by hand. Never copy-paste.', '<b>Break</b> it: change a value, delete an await, read the error.', '<b>Explain</b> it out loud, as if you were teaching.', '<b>Practice</b> on the matching Code Lab module.'])}` },

  { t: 'Step 2: why you must retype', to: true, giua: true, body: two(`
<ul>
<li>Copy-paste only <b>moves text</b></li>
<li>Typing pushes the code through your <b>fingers</b> and your <b>head</b></li>
<li>You will mistype. Good.</li>
<li>Fixing typos teaches you to <b>read errors</b></li>
</ul>`, cot(box('Honest number', 'Reading error messages is about <b>40%</b> of backend work.', 'xanh'), box('Term', `${kw('error message', 'what the program tells you when it fails')}`, 'lam'))) },

  { t: 'Step 3: break it on purpose', to: true, giua: true, body: `
${bang(['Do this', 'Then ask'], [
    ['Delete one <code class="i">await</code>', 'What does the function return now?'],
    ['Send a wrong status code', 'What does the client see?'],
    ['Throw inside an async handler, no try/catch', 'Does the server die?'],
    ['Pass a string where a number is needed', 'Where does it blow up? How far from the real cause?'],
  ], { co: 24 })}
${box('Safety rule', 'Do this in a throw-away project, never in code you care about. Chapter 4 shows how to make one in ten seconds.', 'do2')}` },

  { t: 'Break #1: delete one word', giua: true, body: two(`${js(ma('c0/route-ok', 9, 13), { sm: true, hl: [2] })}${term(ra('c0/route-ok'), { sm: true, title: 'curl · working', hl: [2] })}`, `${js(ma('c0/route-no-await', 9, 13), { sm: true, hl: [2] })}${term(ra('c0/route-no-await'), { sm: true, title: 'curl · broken', hl: [2, 4] })}`) + box('What you just learned', 'No crash, no red text, status 200 and an <b>empty object</b>. The bug is silent. Now you will recognize <code class="i">{}</code> for life.', 'do2') },

  { t: 'Break #2: a crash you can read', body: `${js(ma('c0/route-crash', 9, 12), { sm: true, hl: [3] })}${term(ra('c0/route-crash', 1, 11, 'server'), { title: 'server terminal', hl: [3, 7, 11] })}
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
${box('Where', 'File and line: <b>route-crash.mjs:11</b>', 'lam')}
${box('What', '<b>TypeError</b>: note is undefined', 'do2')}
${box('Then', 'Exit code 1: the server is <b>gone</b>', '')}
</div>` },

  { t: 'Read the whole error', to: true, giua: true, body: two(`
<ul>
<li>Start at the <b>first line</b> of the message</li>
<li>Then find the <b>first line that is your file</b></li>
<li>Most beginners read neither</li>
</ul>`, box('Term', `${kw('stack trace', 'the list of functions that were running when it failed')}`, 'lam')) + term(ra('c0/route-crash', 7, 8, 'server'), { title: 'the two lines that matter', hl: [1, 2] }) + box('In plain words', 'Reading <code class="i">title</code> of something that is <b>undefined</b>, at line 11, column 16 of my file.', 'xanh') },

  { t: 'Meet these errors on purpose', to: true, giua: true, body: `
${bang(['Real message', 'What it means', 'How to cause it'], [
    ['<code class="i">EADDRINUSE</code>', 'The port is already taken', 'Start the same server twice'],
    ['<code class="i">ECONNREFUSED</code>', 'Nothing is listening there', 'Call the wrong port'],
    ['<code class="i">Cannot read properties of undefined</code>', 'A value you expected is missing', 'Remove a required field'],
  ], { co: 23 })}
${term(`${ra('c0/port-busy', 7, 7)}\n${ra('c0/wrong-port')}`, { title: 'real output, Node 22' })}
${box('Why bother', 'Twenty seconds now. Otherwise you meet them at 11 pm with production down.', 'xanh')}` },

  { t: 'Step 4: the "explain" test', to: true, giua: true, body: two(`
<ul>
<li>Close the page</li>
<li>Say it out loud: <b>"middleware is…, it runs when…, if I forget next() then…"</b></li>
<li>You got stuck? You have not learned it yet</li>
</ul>`, cot(box('Recognizing', 'Fades in about a week.', 'do2'), box('Explaining', 'Stays with you.', 'xanh'), box('Bonus', 'Same skill you need in an interview, or on camera.', 'lam'))) },

  { t: 'Step 5: the practice track', giua: true, body: `
${bang(['After', 'Code Lab module'], [
    ['Chapters 1–2', 'Module 318 — JavaScript Foundations for Node.js'],
    ['Chapters 3–4', 'Module 319 — Core modules & the npm ecosystem'],
    ['Chapter 5', 'Module 320 — Express core concepts'],
    ['Chapter 6', 'Module 321 — RESTful API design'],
    ['Chapter 7', 'Module 322 — Database integration & modeling'],
    ['Chapters 8–9', 'Module 323 — Auth, permissions, security'],
  ], { co: 23 })}
${box('Track', '<b>Node.js (Express)</b> on Code Lab: 16 modules, 160 exercises, each with a solution. Theory here, repetitions there.', 'xanh')}` },

  { t: 'Habits that save you months', to: true, giua: true, body: cards([
    ['Read the whole error', 'The answer is usually in the first lines.'],
    ['Change one thing at a time', 'Change two, one breaks: which one was it?'],
    ['Reproduce, then fix', 'If you cannot trigger it, you cannot know it is fixed.'],
    ['Official docs first', 'nodejs.org and expressjs.com beat any blog post.'],
    ['Small commits, often', 'A working point to return to beats clever code.'],
    ['Recording a video?', 'Record after step 4, never before.'],
  ], 3) },

  { t: 'The trap: skipping step 3', to: true, giua: true, body: `
<ul>
<li>Breaking working code <b>feels like a waste of time</b></li>
<li>Retyping teaches the <b>shape</b>. Breaking teaches the <b>failure</b></li>
<li>Next time you see the error, it is an old friend</li>
</ul>
${box('Try these', 'Delete a required field. Point at the wrong port. Stop the database in the middle of a query. Each takes twenty seconds.', 'do2')}` },

  { t: 'Do this now', to: true, giua: true, body: `
<ol>
<li>Pick the server from Lesson 0.1 and <b>retype</b> it</li>
<li><b>Break it</b>: start it twice and read the error</li>
<li>Stop it, then call it with curl and read that error too</li>
<li>Close everything. <b>Explain</b> out loud what a port is</li>
</ol>
${box('Done when', 'You saw <code class="i">EADDRINUSE</code> and <code class="i">ECONNREFUSED</code> with your own eyes.', 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Which step do most people skip, and why is that a mistake?</li>
<li>After you delete <code class="i">await</code> from a route, what does the client get?</li>
<li>You can recognize a term but cannot explain it. Have you learned it?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Step 3: it teaches failures. &nbsp; 2. An empty object, status 200. &nbsp; 3. No, only recognized it.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Every lesson: <b>read, retype, break, explain, practice</b></li>
<li>Typing beats reading. Breaking beats typing</li>
<li>Read the error: the message, then your file and line</li>
<li>If you cannot explain it, you have not learned it</li>
</ul>
${box('Next', 'Lesson 0.3 — Set up your environment.', 'lam')}` },
]);
