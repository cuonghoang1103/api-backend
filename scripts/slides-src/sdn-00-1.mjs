/**
 * sdn-00-1 — SDN302 · Section 0 · Lessons 0.1 + 0.2 + 0.3 "About SDN302, grading and learning outcomes" (slide EN, kiểu FU, đợt 5 — 01/11/2026). Tập sdn-0-1.
 * Nguồn: content/academy/SDN302.mjs › sdn302-gioi-thieu (+ sdn302-dieu-kien-qua-mon, sdn302-chuan-dau-ra gắn chung).
 * Phủ: SDN302 là gì (FER202 → SDN302, MERN) · đường đi một request (Client → Express → Controller → Mongoose → JSON) CHẠY THẬT · lộ trình 7 chặng + ★ ·
 * 3 tín chỉ, tiên quyết, điểm danh ≥ 80 % · 5 thành phần điểm + 2 cổng ≥ 4 · Practical Exam 85′ · Progress Test ↔ CLO · ví dụ rớt dù TB > 5 (chạy thật) ·
 * 8 CLO · tư duy backend (không tin client) · BỔ SUNG: nên xem video nào (bài môn ↔ video Courses), cần biết trước gì, bài tập tính điểm.
 * Output THẬT Node 22.23.3 + Express 5.3.0 + Mongoose 9.11.4 + MongoDB 7.0.37, cổng 4300: that/s0/{tour,grade}.
 */
import { lamDeck, two, box, kw, bang, cards, flow, ma, ra, js, term, cot, rc } from './_sdn-chung.mjs';

export const deck = { key: 'sdn-00-1', code: 'SDN 0.1', title: 'About SDN302: the back-end course', sub: 'SDN302 — Node.js, Express & MongoDB' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';

/** Lộ trình 7 chặng + ★ (SVG hai hàng). */
function loTrinh() {
  const w = 1110, h = 330;
  const o = (x, y, so, t, s, mau) => `<g data-k="chang"><rect x="${x}" y="${y}" width="255" height="138" rx="14" fill="${mau}12" stroke="${mau}" stroke-width="3"/>` +
    `<circle cx="${x + 30}" cy="${y + 30}" r="19" fill="${mau}"/><text x="${x + 30}" y="${y + 37}" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">${so}</text>` +
    `<text x="${x + 58}" y="${y + 38}" font-size="21" font-weight="800" fill="${mau}">${t}</text>` +
    s.map((l, i) => `<text x="${x + 16}" y="${y + 74 + i * 26}" font-size="17.5" fill="#444">${l}</text>`).join('') + '</g>';
  const ar = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#ms01)"/>`;
  let s = `<svg data-k="lotrinh" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="ms01" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  s += o(0, 0, 1, 'Node.js', ['event loop · async', 'modules · npm', 'the HTTP module'], LAM) + ar(258, 69, 283, 69);
  s += o(285, 0, 2, 'Express', ['routing', 'middleware', 'Express Generator'], LAM) + ar(543, 69, 568, 69);
  s += o(570, 0, 3, 'MongoDB', ['NoSQL · CRUD', 'Mongoose schema', 'population'], NODE) + ar(828, 69, 853, 69);
  s += o(855, 0, 4, 'REST + MVC', ['routes → controllers', '→ services → models', 'EJS · Handlebars'], NODE);
  s += `<path d="M982,140 C982,168 128,160 128,186" fill="none" stroke="#b85a2b" stroke-width="3" marker-end="url(#ms01)"/>`;
  s += o(0, 190, 5, 'Security', ['bcrypt · session', 'Passport · JWT', 'HTTPS · CORS · upload'], CAM) + ar(258, 259, 283, 259);
  s += o(285, 190, 6, 'React + deploy', ['connect a front-end', 'hosting', 'BaaS'], CAM) + ar(543, 259, 568, 259);
  s += o(570, 190, 7, 'NestJS · Hono', ['sessions 49–56', 'CLO2', 'both are required'], TIM);
  s += o(855, 190, '★', 'Beyond', ['aggregation pipeline', 'production hardening', 'outside the syllabus'], DO);
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Section 0 — Course introduction', bai: '0.1' }, [
  { cover: true, t: 'SDN302:<br>the back-end course', sub: 'What you will build, how you are graded, and where every video lives.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a back-end does, and what changes after FER202</li>
<li>One request through your server: <b>every layer, run for real</b></li>
<li>The 7-stage journey of SDN302</li>
<li>The <b>5 grade components</b> and the <b>2 gates</b> that fail most students</li>
<li>The 8 learning outcomes (CLOs), and which videos to watch</li>
</ul>
${box('By the end of SDN302', 'A complete, secured REST API in MVC style, deployed. The same skill SWP391 and every full-stack job asks for.', 'xanh')}` },

  { t: 'From FER202 to SDN302', to: true, giua: true, body: two(
    box('FER202: the client', 'React runs in the <b>browser</b>. It shows data and sends requests. Anyone can open DevTools and change it.', 'lam'),
    box('SDN302: the server', 'Node.js + Express + MongoDB run on <b>your machine</b>. You own the <b>data</b>, the <b>rules</b> and the <b>trust boundary</b>.', 'xanh')) +
    `<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('back-end', 'the part that answers requests')} ${kw('MERN', 'MongoDB · Express · React · Node')} ${kw('API', 'the door your front-end knocks on')}</div>` +
    box('The one rule under half the course', '<b>Never trust the client.</b> Validate every input. Never send a password or a secret back.', 'do2') },

  { t: 'One request through your server', to: true, giua: true, body: flow([
    { t: 'Client (React)', s: 'fetch / axios', mau: LAM },
    { t: 'Express', s: 'route + middleware', mau: NODE },
    { t: 'Controller', s: 'validate, call service', mau: CAM },
    { t: 'Mongoose model', s: 'query MongoDB', mau: TIM },
    { t: 'JSON response', s: 'back to the client', mau: DO },
  ], { h: 170, fs: 20 }) + cards([
    ['Express', 'Matches the URL and method, runs middleware like the JSON parser.'],
    ['Controller', 'Reads the request, checks the input, decides the status code.'],
    ['Model', 'The only layer that talks to the database.'],
  ]) + box('', 'Each box is a chapter of this course. This slide is the map you will keep coming back to.', 'lam') },

  { t: 'The same trip, run for real', body: js(ma('s0/tour', 6, 17), { sm: true }) +
    term(rc('s0/tour', 1, 2).replace(" -w '  [%{http_code}] %{content_type}'", ''), { title: 'curl · real', sm: true }) + two(
    term(ra('s0/tour', 3, 6, 'server'), { title: 'server log · real', sm: true }),
    box('Read it', 'One line per layer: Express, controller, Mongoose, response. MongoDB answered in a few milliseconds.', 'xanh')) },

  { t: 'Your journey: 7 stages', to: true, giua: true, body: loTrinh() + box('', 'Stages 1–2 reuse the Node.js course videos. Stages 3–4 are this course’s own videos: MongoDB, Mongoose and MVC.', 'lam') },

  { t: 'The course in four numbers', to: true, giua: true, body: `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
${box('Credits', '<div style="font-size:52px;font-weight:800;color:#15803d;text-align:center">3</div>', 'xanh')}
${box('Prerequisites', '<div style="font-size:30px;font-weight:800;text-align:center;line-height:1.5">DBI202<br>FER202</div>', 'lam')}
${box('Attendance', '<div style="font-size:52px;font-weight:800;color:#b0281a;text-align:center">≥ 80%</div>', 'do2')}
${box('Sessions', '<div style="font-size:52px;font-weight:800;text-align:center">60</div>', '')}
</div>
${box('Attendance is a hard gate', 'Miss more than 20% of the sessions and you are <b>barred from the final exam</b>. Not a lower grade: no exam at all.', 'do2')}
${box('Pass rule', 'Practical Exam ≥ 4 <b>AND</b> Final Exam ≥ 4 <b>AND</b> weighted average ≥ 5.', 'xanh')}
<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('DBI202', 'databases: SQL, ERD')} ${kw('FER202', 'React: the client you will feed')}</div>` },

  { t: 'Five grade components', to: true, giua: true, body: bang(['Component', 'Weight', 'Format', 'Gate'], [
    ['Assignment ×4', '20%', 'Code, in tutorials and at home', 'on time'],
    ['Practical Exam', '25%', '85 minutes, during the term: build a working API', '<b style="color:#b0281a">≥ 4</b>'],
    ['Progress Test ×3', '15%', 'Short tests, 20–40 minutes', '—'],
    ['Project', '15%', 'A full server-side app + presentation', '—'],
    ['Final Exam', '25%', '60 minutes, the only final-exam line', '<b style="color:#b0281a">≥ 4</b>'],
  ], { hl: [1, 4], co: 23 }) + box('Mostly code', 'Two components are practical and gated. You cannot pass SDN302 on theory alone.', '') },

  { t: 'Above 5, and still a fail', body: js(ma('s0/grade', 2, 9), { sm: true }) + term(ra('s0/grade', 2, 4), { title: 'node grade.js · real', sm: true }) + two(
    box('Read the output', 'A and C average above 6 and still FAIL: one gate is below 4. B averages 5.22 and PASSES.', 'do2'),
    box('Lesson', 'Practise building endpoints, again and again, before the Practical Exam.', 'xanh')) },

  { t: 'The Practical Exam: 85 minutes', to: true, giua: true, body: `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
${box('1 · Connect', 'Mongoose to MongoDB', 'lam')}${box('2 · Route', 'URL + method → handler', 'lam')}${box('3 · Validate', 'bad input → 400', 'lam')}${box('4 · Answer', 'JSON + the right status', 'lam')}
</div>
${box('Where most students stumble', 'A working endpoint, against the clock. The exam format is not printed in the syllabus, so prepare to build an API live.', 'do2')}
${box('No partial credit for theory', '“I know how it works” with nothing running scores close to zero. In this course, <b>runs in Postman</b> beats <b>looks right on paper</b>.', '')}` },

  { t: 'Progress Tests map to CLOs', to: true, giua: true, body: bang(['Test', 'Covers', 'Length'], [
    ['PT1', 'CLO1–5 and CLO8: Node, Express, Generator, MongoDB, REST, templating', '20–40 min'],
    ['PT2', 'CLO6: user authentication', '20–40 min'],
    ['PT3', 'CLO7: Backend-as-a-Service', '20–40 min'],
  ], { co: 23 }) + box('Use it', 'You know exactly what each test targets. Before PT1, every video of stages 1–4 must feel easy.', 'xanh') +
    box('Final Exam: 60 minutes', 'Question format is not printed either: revise theory <b>and</b> how to apply it.', 'lam') },

  { t: 'Eight learning outcomes (CLOs)', body: bang(['CLO', 'You will be able to…', 'Chapter'], [
    ['CLO1', 'Understand Node, modules, APIs and the Node HTTP server', 'Ch1'],
    ['CLO2', 'Understand Express (and NestJS / Hono), build a web server', 'Ch2 · Ch8'],
    ['CLO3', 'Use Express Generator to scaffold an app', 'Ch2'],
    ['CLO4', 'Understand MongoDB, build a Node app that works with data', 'Ch3'],
    ['CLO5', 'Build a REST API with Express, MongoDB, Mongoose & population', 'Ch4'],
    ['CLO6', 'Implement user authentication', 'Ch5'],
    ['CLO7', 'Use Backend-as-a-Service for safe client–server communication', 'Ch6'],
    ['CLO8', 'Use EJS and Handlebars templating', 'Ch4'],
  ], { co: 21, hl: [4] }) + box('', 'Every CLO says <b>understand</b> and <b>build</b>: code that runs, not answers you memorise.', 'xanh') },

  { t: 'Which video for which lesson', body: bang(['SDN302 lesson', 'Video', 'From'], [
    ['1.1 Node & the event loop', 'Node.js 2.1 (+ 2.2, 1.5)', 'Courses: Node.js'],
    ['1.2 HTTP server', 'Node.js 3.5', 'Courses: Node.js'],
    ['2.1 Express routing', 'SDN 2.1: generator included', 'this course'],
    ['2.2 Middleware', 'Node.js 5.3 (two parts)', 'Courses: Node.js'],
    ['3.1 – 4.2 MongoDB → MVC', 'SDN 3.1 … 4.2', 'this course'],
  ], { co: 22, hl: [2, 4] }) + box('Before you start', 'Weak on JavaScript or async/await? Watch <b>Node.js Chapter 1</b> first. Every database call in SDN302 is async.', 'lam') +
    box('Going deeper later', 'The Node.js course on Courses goes further on every shared topic, with real measurements.', 'xanh') },

  { t: 'The trap: reading back-end like front-end', to: true, giua: true, body: two(
    box('✗ Front-end habits', '“It works on my screen.”<br>Trusting what the form sends.<br>Reading code without running it.<br>One giant route file.', 'do2'),
    box('✓ Back-end habits', 'Run it, then try to break it.<br>Validate on the server.<br>Right status codes.<br>Layers that each do one job.', 'xanh')) +
    box('Why it matters', 'A browser check can be skipped with one curl command. Only the server is really in control.', '') +
    term(rc('s0/red-flags', 8, 9).replace(" -w '  [%{http_code}]'", ''), { title: 'one curl, no form, no browser · real (lesson 0.5 shows the whole API)' }) },

  { t: 'Exercise: pass or fail?', to: true, giua: true, body: bang(['Student', 'Assign.', 'Practical', 'PT', 'Project', 'Final'], [
    ['D', '7', '4', '6', '7', '4'],
    ['E', '9', '9', '9', '9', '3.5'],
  ], { co: 26 }) + box('Your task', 'Compute each weighted average (20 · 25 · 15 · 15 · 25 %), then check the two gates. Pass or fail?', '') +
    `<div data-k="dapan">${term(ra('s0/grade', 5, 6), { title: 'answer · node grade.js · real' })}${box('', 'D passes with 5.35: a gate of exactly 4 is enough. E fails with an average above 7: Final 3.5 is below the gate.', 'xanh')}</div>` },

  { t: 'Check yourself', to: true, giua: true, body: `${box('Answer out loud before the reveal', 'Pause the video, then check.', '')}<ol>
<li>Name the five boxes a request passes through, in order.</li>
<li>Which two components have their own gate of 4?</li>
<li>Which layer is the only one allowed to talk to MongoDB?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Client → Express → Controller → Mongoose model → JSON response. &nbsp;2. Practical Exam and Final Exam. &nbsp;3. The model.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>SDN302 = the back-end of MERN: <b>you own data, rules and trust</b></li>
<li>A request: Client → Express → Controller → Model → JSON</li>
<li>Pass = Practical ≥ 4 <b>and</b> Final ≥ 4 <b>and</b> average ≥ 5, attendance ≥ 80%</li>
<li>8 CLOs, all about code that runs</li>
</ul>
${flow([
    { t: 'Client', s: 'React', mau: LAM }, { t: 'Express', s: 'route', mau: NODE }, { t: 'Controller', s: 'validate', mau: CAM }, { t: 'Model', s: 'Mongoose', mau: TIM }, { t: 'JSON', s: 'status + body', mau: DO }], { h: 130, fs: 21 })}
${box('Next', 'Lesson 0.5: choosing a project topic, and the 7 ways students lose marks.', 'lam')}` },
]);
