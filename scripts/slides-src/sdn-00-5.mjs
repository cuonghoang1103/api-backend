/**
 * sdn-00-5 — SDN302 · Section 0 · Lessons 0.5 + 0.6 "Choosing a project & why students lose marks" (slide EN, kiểu FU, đợt 5 — 01/11/2026). Tập sdn-0-2.
 * Nguồn: content/academy/SDN302.mjs › sdn302-ngan-hang-de-tai (+ sdn302-chong-mat-diem gắn chung).
 * Phủ: project 15 %, đúng cỡ 3–5 tài nguyên · rubric 6 phép thử · 12 đề tài · ★ thiết kế model trước route · tránh dự án một tài nguyên ·
 * 7 kiểu mất điểm + cách sửa · cờ xanh / cờ đỏ · công thức điểm cao · ★ template khởi đầu gõ trong 10 phút · "chạy được trên Postman thắng nhìn đúng trên giấy".
 * BỔ SUNG: chấm thử 3 đề tài bằng rubric · sơ đồ model Blog API (User–Post–Comment) · API "cờ đỏ" CHẠY THẬT (quên await ⇒ 500, không thấy ⇒ 200 null,
 * mật khẩu trả về nguyên văn, body gõ sai vẫn lưu) đặt cạnh API "cờ xanh" chạy thật (201/400/404/409, bài 4.1) · bài tập chấm đề tài.
 * Output THẬT Node 22.23.3 + Express 5.3.0 + Mongoose 9.11.4 + MongoDB 7.0.37, cổng 4300: that/s0/red-flags, that/s4mvc/server.
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, ma, ra, js, term, cot, rc, gay } from './_sdn-chung.mjs';

export const deck = { key: 'sdn-00-5', code: 'SDN 0.5', title: 'Choosing a project & why students lose marks', sub: 'SDN302 — Node.js, Express & MongoDB' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const Y = '<b style="color:#15803d">✓</b>', N = '<b style="color:#b0281a">✗</b>';

/** Sơ đồ model Blog API: User 1—n Post, Comment → User + Post (SVG). */
function moHinh() {
  const w = 1110, h = 300;
  const o = (x, y, t, f, mau) => `<g data-k="model"><rect x="${x}" y="${y}" width="300" height="${56 + f.length * 30}" rx="12" fill="#fff" stroke="${mau}" stroke-width="3"/>` +
    `<rect x="${x}" y="${y}" width="300" height="42" rx="12" fill="${mau}"/><text x="${x + 150}" y="${y + 29}" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">${t}</text>` +
    f.map((l, i) => `<text x="${x + 16}" y="${y + 70 + i * 30}" font-size="19" font-family="Menlo,monospace" fill="#333">${l}</text>`).join('') + '</g>';
  const ar = (x1, y1, x2, y2, t, tx, ty) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#ms05)"/><text x="${tx}" y="${ty}" font-size="19" font-weight="700" fill="#b85a2b">${t}</text>`;
  let s = `<svg data-k="mohinh" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="ms05" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  s += o(0, 60, 'User', ['name', 'email (unique)', 'password (hashed)'], LAM);
  s += o(405, 0, 'Post', ['title', 'author → User', 'createdAt'], NODE);
  s += o(810, 60, 'Comment', ['text', 'author → User', 'post → Post'], CAM);
  s += ar(405, 80, 305, 110, 'author', 318, 82);
  s += ar(810, 105, 710, 70, 'post', 742, 70);
  s += `<path d="M810,190 C640,290 420,290 305,170" fill="none" stroke="#b85a2b" stroke-width="3" marker-end="url(#ms05)"/><text x="520" y="292" font-size="19" font-weight="700" fill="#b85a2b">author</text>`;
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Section 0 — Course introduction', bai: '0.5' }, [
  { cover: true, t: 'Choosing your project,<br>and why students lose marks', sub: 'A rubric for the topic, a bank of 12 APIs, and 7 mistakes you can avoid.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What the project must show, and the right size for it</li>
<li>A <b>6-test rubric</b> to score a topic before you commit</li>
<li>12 topics already checked for scope</li>
<li>The <b>7 ways</b> students lose marks, run for real</li>
<li>The formula for a high grade, and a starter you type from memory</li>
</ul>
${box('Project = 15%', 'A full server-side app of your choice, plus a presentation. It is where every CLO gets shown at once.', 'xanh')}
${box('Why now, in Section 0', 'Pick the topic early: every chapter after this adds one piece to the same project.', 'lam')}` },

  { t: 'What a good project looks like', to: true, giua: true, body: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
${box('3–5 resources', 'Related nouns, e.g. User, Product, Order. Not 1, not 15.', 'xanh')}
${box('Real relations', 'Resources point at each other, so you can show Mongoose <b>population</b>.', 'lam')}
${box('Authentication', 'A reason to log in: actions only the owner may do.', '')}
</div>
${box('Small enough to finish, rich enough to show every CLO', 'A focused REST API beats a huge app that is half done on demo day.', 'xanh')}
<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('resource', 'a noun your API manages: /users, /posts')} ${kw('population', 'replace a stored id with the full document')}</div>` },

  { t: 'The 6-test rubric', to: true, giua: true, body: bang(['#', 'Test', 'Ask yourself'], [
    ['1', 'Right size', '3–5 resources (e.g. User, Product, Order)? Not 1, not 15.'],
    ['2', 'Real relations', 'Do resources reference each other (for population)?'],
    ['3', 'Full CRUD', 'Can you demo create / read / update / delete on one resource?'],
    ['4', 'Needs auth', 'Is there a reason to log in (owner-only actions)?'],
    ['5', 'Has validation', 'Are there rules to enforce (unique email, price > 0)?'],
    ['6', 'Demoable', 'End to end in Postman + one small React page?'],
  ], { co: 23 }) + box('Use it', 'Score a topic before you write a single line. Six ticks, then commit.', 'xanh') },

  { t: 'Scoring three candidates', to: true, giua: true, body: bang(['Topic', '1 size', '2 relations', '3 CRUD', '4 auth', '5 rules', '6 demo', 'Verdict'], [
    ['Notes API (one resource)', N, N, Y, Y, Y, Y, '<b style="color:#b0281a">too thin</b>'],
    ['Social network clone (15+)', N, Y, Y, Y, Y, N, '<b style="color:#b0281a">too big</b>'],
    ['Blog API (users, posts, comments)', Y, Y, Y, Y, Y, Y, '<b style="color:#15803d">go</b>'],
  ], { co: 23, hl: [2] }) + two(
    box('Why Notes fails', 'No relations ⇒ no population to show (CLO5), and population is a headline outcome.', 'do2'),
    box('Why Blog wins', 'Comment points at User and Post: one populate call shows the whole idea.', 'xanh')) +
    box('Read the table', 'One ✗ is a warning, two ✗ means change the topic. Too big is as bad as too thin: a half-finished app cannot be demoed.', '') },

  { t: 'A bank of 12 checked topics', to: true, giua: true, body: cards([
    ['Blog API', 'users · posts · comments'], ['Task manager', 'users · projects · tasks + status'], ['Mini e-commerce', 'users · products · orders · items'],
    ['Movie reviews', 'movies · reviews · users · ratings'], ['Bookstore', 'books · authors · categories · reviews'], ['Recipe sharing', 'users · recipes · ingredients · favourites'],
    ['Event tickets', 'events · tickets · users · bookings'], ['Q&A forum', 'questions · answers · votes · users'], ['Course catalogue', 'courses · lessons · enrollments · users'],
    ['Expense tracker', 'users · wallets · transactions · categories'], ['Job board', 'companies · jobs · applications · candidates'], ['Workout log', 'users · workouts · exercises · sets'],
  ], 4) },

  { t: '★ Design the models before the routes', to: true, giua: true, body: moHinh() + two(
    box('Model first', 'Sketch the schemas and their references first. Once the model is right, routes almost write themselves.', 'xanh'),
    box('One resource → one router', 'GET · POST · PUT · DELETE per router. Half-made schemas are what cause messy rewrites.', 'lam')) },

  { t: 'Seven ways to lose marks (1–4)', to: true, giua: true, body: bang(['#', 'Losing marks', 'The fix'], [
    ['1', 'Not understanding async (callback / promise / await)', 'Every DB call is async: always <b>await</b> Mongoose. Never read a result before it resolves.'],
    ['2', 'No input validation → crash / 500', 'Validate body and params; answer <b>400</b> with a clear message, not a stack trace.'],
    ['3', 'Storing plain-text passwords', 'Always hash with <b>bcrypt</b>; never store or return a raw password.'],
    ['4', 'Wrong HTTP status codes', '200 ok · 201 created · 400 bad request · 401 unauth · 404 not found · 500 server error.'],
  ], { co: 22 }) + box('These four cost the most', 'They are visible in the very first request the grader sends.', 'do2') },

  { t: 'Seven ways to lose marks (5–7)', giua: true, body: bang(['#', 'Losing marks', 'The fix'], [
    ['5', 'Fat controller: all logic in the route', 'Split into routes → controllers → services → models (MVC).'],
    ['6', 'Forgetting Mongoose population', 'Use <b>.populate()</b> to expand references: a headline CLO.'],
    ['7', 'Only reading, never running code', 'Practise the Practical Exam by building timed endpoints.'],
  ], { co: 23 }) + bang(['Mistake', 'Where this course fixes it'], [
    ['1 async', 'Node.js 1.4 · SDN 3.2 (forgot await)'], ['2 validation · 4 status · 5 MVC', 'SDN 4.1 (two parts)'], ['3 passwords', 'SDN 5.1'], ['6 populate', 'SDN 3.2, part 2'], ['7 not running code', 'every lesson: Code Lab + the exercise'],
  ], { co: 20 }) + box('', 'Four of the seven show up in a single request. The next slides run such an API for real.', 'lam') },

  { t: 'A red-flag API (it runs!)', body: js(ma('s0/red-flags', 9, 17), { sm: false }) + two(
    box('It starts, it answers', 'No crash at start-up. That is exactly why these bugs survive until the grader tests them.', 'do2'),
    box('Count the flags', '1 forgot await · 2 not found still 200 · 3 no validation, plain password, 200 instead of 201.', '')) },

  { t: 'Red flags, run for real', body: term(gay(rc('s0/red-flags', 1, 9).split(" -w '  [%{http_code}]'").join('').split(" -w '\\n[%{http_code}]'").join('').replace(' | cut -c1-70', '')), { title: 'curl · the red-flag API · real · [code] = HTTP status', hl: [2, 5, 7, 9] }) + `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
${box('Password', 'sent back as typed: 123456', 'do2')}${box('Forgot await', '500: a Query is not data', 'do2')}${box('Not found', '200 with body null', 'do2')}${box('No validation', 'empty user saved, 200', 'do2')}</div>` },

  { t: 'The same requests, green flags', body: term(gay(rc('s4mvc/server', 7, 8) + '\n' + rc('s4mvc/server', 19, 26)).replace(/ -w '  \[%\{http_code\}\]'/g, ''), { title: 'curl · the MVC API of lesson 4.1 · real', hl: [] }) + two(
    box('What changed', '400 for bad input, 404 when missing, 409 for a duplicate, one error shape. You build this API in lesson 4.1.', 'xanh'),
    box('And 201', 'A successful create answers <b>201 Created</b>, not 200.', 'lam')) },

  { t: 'Green flags vs red flags', to: true, giua: true, body: vsd(
    '<ul><li>callback tangles</li><li>unvalidated bodies</li><li>plain passwords</li><li>everything is 200</li><li>one giant route file</li></ul>',
    '<ul><li>async / await everywhere</li><li>validation + correct status codes</li><li>bcrypt</li><li>MVC layers + populate</li><li>runs the first time</li></ul>', '🔴 Red flags', '🟢 Green flags') +
    box('The formula for a high grade', 'Solid async + validated input with the right status codes + hashed auth + clean MVC + population + repeated timed practice for the Practical Exam.', 'xanh') },

  { t: '★ A starter you can type in 10 minutes', to: true, giua: true, body: `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">
${box('1', 'Connect Mongoose', 'lam')}${box('2', 'One schema + model', 'lam')}${box('3', 'A router with 5 CRUD routes', 'lam')}${box('4', 'An error-handling middleware', 'lam')}${box('5', 'A bcrypt login', 'lam')}
</div>
${flow([{ t: '0–10 min', s: 'starter from memory', mau: NODE }, { t: '10–80 min', s: 'the real task', mau: CAM }, { t: '80–85 min', s: 'test in Postman', mau: LAM }], { h: 140, fs: 22 })}
${box('Why', 'The syllabus teaches the pieces. A practised starter makes them fast in the exam room: whoever looks everything up runs out of time.', '')}` },

  { t: 'Exercise: score these topics', to: true, giua: true, body: `<ol>
<li><b>Library</b>: books only, with search</li>
<li><b>Clinic booking</b>: patients, doctors, appointments, users with roles</li>
</ol>${box('Your task', 'Run each through the 6 tests. Which one would you pick, and what would you add to the other?', '')}
<div data-k="dapan">${bang(['Topic', '1 size', '2 relations', '3 CRUD', '4 auth', '5 rules', '6 demo', 'Verdict'], [
    ['Library (books only)', N, N, Y, N, Y, Y, '<b style="color:#b0281a">add authors, members, loans</b>'],
    ['Clinic booking', Y, Y, Y, Y, Y, Y, '<b style="color:#15803d">go</b>'],
  ], { co: 22 })}${box('', 'Clinic booking: Appointment points at Patient and Doctor, roles give a reason to log in. Library needs more resources before it can show population.', 'xanh')}</div>` },

  { t: 'Check yourself', to: true, giua: true, body: `<ol>
<li>Why is a one-resource project risky for CLO5?</li>
<li>Your POST /users answers 200 and the JSON contains a password. Name two flags.</li>
<li>What do you design first: routes or models?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. No relations, so no population to show. &nbsp;2. Wrong status (should be 201) and a leaked password. &nbsp;3. Models.', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Project: <b>3–5 related resources</b>, real references, auth, validation</li>
<li>Score the topic with the 6 tests before you commit</li>
<li>Models first, then one router per resource</li>
<li>7 ways to lose marks: async, validation, passwords, status, fat controllers, populate, not running code</li>
</ul>
${box('Formula', 'Async + validation + status codes + hashed auth + MVC + population + timed practice.', 'xanh')}
${box('Next', 'Lesson 2.1: Express routing, your first app, and Express Generator.', 'lam')}` },
]);
