/**
 * api-00-1 — API Design · Section 0 · "Start here (1/2)" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s00-intro.mjs › api-0-8-bat-dau-tai-day. Mốc lịch sử đã kiểm nguồn (link trong bài).
 */
import { lamDeck, two, three, box, steps, cards, kw, c, sql } from './_api-chung.mjs';

const meta = { chuong: 'Section 0 — Why API design matters', bai: '0 · Start here 1/2' };

/* Nhà hàng: khách — thực đơn + phục vụ — bếp. */
const nhaHang = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  <g data-k="khach"><rect x="20" y="70" width="250" height="160" rx="14" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="145" y="120" text-anchor="middle" font-size="46">🧑‍🎓</text>
  <text x="145" y="168" text-anchor="middle" font-size="24" font-weight="800" fill="#336791">Customer</text>
  <text x="145" y="198" text-anchor="middle" font-size="19" fill="#555">= the client app</text></g>
  <g data-k="api"><rect x="400" y="40" width="310" height="220" rx="14" fill="#fff7ef" stroke="#e08a1e" stroke-width="3.5"/>
  <text x="555" y="88" text-anchor="middle" font-size="40">📋 🤵</text>
  <text x="555" y="132" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">Menu + waiter</text>
  <text x="555" y="162" text-anchor="middle" font-size="19" fill="#555">= the API</text>
  <text x="555" y="198" text-anchor="middle" font-size="17" fill="#555">what you may order, how to ask,</text>
  <text x="555" y="222" text-anchor="middle" font-size="17" fill="#555">what comes back, what can go wrong</text></g>
  <g data-k="bep"><rect x="840" y="70" width="250" height="160" rx="14" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/>
  <text x="965" y="120" text-anchor="middle" font-size="46">👩‍🍳</text>
  <text x="965" y="168" text-anchor="middle" font-size="24" font-weight="800" fill="#2f7d4f">Kitchen</text>
  <text x="965" y="198" text-anchor="middle" font-size="19" fill="#555">= server internals</text></g>
  <line x1="275" y1="125" x2="392" y2="125" stroke="#b85a2b" stroke-width="3.5" marker-end="url(#m1)"/>
  <text x="333" y="112" text-anchor="middle" font-size="17" fill="#b85a2b" font-weight="700">order</text>
  <line x1="392" y1="185" x2="278" y2="185" stroke="#b85a2b" stroke-width="3.5" marker-end="url(#m1)"/>
  <text x="333" y="212" text-anchor="middle" font-size="17" fill="#b85a2b" font-weight="700">dish</text>
  <text x="333" y="234" text-anchor="middle" font-size="16" fill="#b85a2b" font-weight="700">or "sold out"</text>
  <line x1="715" y1="150" x2="832" y2="150" stroke="#2f7d4f" stroke-width="3.5" stroke-dasharray="7 5" marker-end="url(#m1)"/>
  <text x="773" y="137" text-anchor="middle" font-size="16" fill="#2f7d4f" font-weight="700">hidden</text>
  <text x="555" y="293" text-anchor="middle" font-size="19" fill="#404040" font-weight="700">You never walk into the kitchen. The menu is the promise; the kitchen can change freely behind it.</text>
</svg>`;

/* Dòng thời gian: mảng [năm, nhãn, mô tả, màu]. */
const timeline = (items, h = 380) => {
  const w = 1110, n = items.length, x0 = 125, x1 = w - 125, step = (x1 - x0) / (n - 1);
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<line x1="${x0 - 30}" y1="${h / 2}" x2="${x1 + 30}" y2="${h / 2}" stroke="#bfbfbf" stroke-width="5"/>`;
  items.forEach(([y, t, d, m = '#336791'], i) => {
    const x = x0 + i * step, up = i % 2 === 0, ty = up ? h / 2 - 34 : h / 2 + 56;
    s += `<circle cx="${x}" cy="${h / 2}" r="12" fill="${m}" stroke="#fff" stroke-width="3"/>`;
    s += `<text x="${x}" y="${up ? h / 2 - 118 : h / 2 + 40}" text-anchor="middle" font-size="26" font-weight="800" fill="${m}">${y}</text>`;
    s += `<text x="${x}" y="${up ? h / 2 - 88 : h / 2 + 70}" text-anchor="middle" font-size="21" font-weight="700" fill="#262626">${t}</text>`;
    d.split('|').forEach((dl, k) => { s += `<text x="${x}" y="${(up ? h / 2 - 60 : h / 2 + 98) + k * 24}" text-anchor="middle" font-size="19" fill="#555">${dl}</text>`; });
  });
  return s + '</svg>';
};

/* Một backend, nhiều client. */
const hub = () => {
  const cl = [['🌐', 'Web app', 'React / Next.js'], ['📱', 'Mobile app', 'iOS · Android'], ['🖥️', 'Admin tool', 'lab managers'], ['🤖', 'Chat bot', 'Discord / Zalo'], ['📊', 'Report script', 'Python · Excel'], ['🏫', 'Partner system', 'school portal']];
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  const cx = 555, cy = 165;
  cl.forEach(([e, t, d], i) => {
    const col = i % 2 === 0 ? 0 : 1, row = Math.floor(i / 2);
    const x = col === 0 ? 30 : 800, y = 20 + row * 105;
    s += `<line x1="${col === 0 ? x + 280 : x}" y1="${y + 42}" x2="${col === 0 ? cx - 150 : cx + 150}" y2="${cy}" stroke="#e08a1e" stroke-width="3"/>`;
    s += `<rect x="${x}" y="${y}" width="280" height="84" rx="12" fill="#fff7ef" stroke="#e08a1e" stroke-width="2.5"/>`;
    s += `<text x="${x + 24}" y="${y + 55}" font-size="34">${e}</text><text x="${x + 78}" y="${y + 38}" font-size="22" font-weight="800" fill="#b85a2b">${t}</text><text x="${x + 78}" y="${y + 64}" font-size="17" fill="#666">${d}</text>`;
  });
  s += `<rect x="${cx - 150}" y="${cy - 70}" width="300" height="140" rx="16" fill="#336791"/>`;
  s += `<text x="${cx}" y="${cy - 18}" text-anchor="middle" font-size="28" font-weight="800" fill="#fff">LabFlow API</text>`;
  s += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="18" fill="#dbe7f3">one contract</text><text x="${cx}" y="${cy + 42}" text-anchor="middle" font-size="18" fill="#dbe7f3">many clients</text>`;
  return s + '</svg>';
};

/* Sơ đồ tài nguyên LabFlow. */
const erd = () => {
  const W = 205;
  const bx = (x, t, f, m) => `<rect x="${x}" y="20" width="${W}" height="150" rx="10" fill="#fff" stroke="${m}" stroke-width="3"/><rect x="${x}" y="20" width="${W}" height="46" rx="10" fill="${m}"/>` +
    `<text x="${x + W / 2}" y="52" text-anchor="middle" font-size="25" font-weight="800" fill="#fff" font-family="Menlo,monospace">${t}</text>` +
    f.map((l, i) => `<text x="${x + 14}" y="${100 + i * 32}" font-size="20" fill="#333" font-family="Menlo,monospace">${l}</text>`).join('');
  const ln = (x1, x2, a, b) => `<line x1="${x1}" y1="95" x2="${x2}" y2="95" stroke="#404040" stroke-width="3"/><text x="${(x1 + x2) / 2}" y="84" text-anchor="middle" font-size="19" font-weight="700" fill="#b85a2b">${a}</text><text x="${(x1 + x2) / 2}" y="122" text-anchor="middle" font-size="17" fill="#666">${b}</text>`;
  return `<svg viewBox="0 0 1110 190" width="1110" height="190" font-family="Arial">` +
    bx(0, 'users', ['id', 'name, role'], '#336791') + ln(W, 300, 'makes', '1 → many') +
    bx(300, 'bookings', ['labId,userId', 'startAt,endAt'], '#e08a1e') + ln(300 + W, 602, 'for', 'many → 1') +
    bx(602, 'labs', ['id, code', 'building'], '#2f7d4f') + ln(602 + W, 905, 'has', '1 → many') +
    bx(905, 'devices', ['labId, type', 'status'], '#b85a2b') + '</svg>';
};

/* Chi phí đổi hợp đồng theo thời gian. */
const chiPhi = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <line x1="90" y1="250" x2="1060" y2="250" stroke="#404040" stroke-width="3"/><line x1="90" y1="250" x2="90" y2="30" stroke="#404040" stroke-width="3"/>
  <text x="575" y="290" text-anchor="middle" font-size="19" fill="#555">time →</text>
  <text x="38" y="140" text-anchor="middle" font-size="19" fill="#555" transform="rotate(-90 38 140)">cost to change</text>
  <path d="M100,240 C300,238 420,232 520,215 C640,190 760,120 1050,40" fill="none" stroke="#c0392b" stroke-width="5"/>
  <line x1="520" y1="40" x2="520" y2="250" stroke="#e08a1e" stroke-width="3" stroke-dasharray="8 6"/>
  <text x="520" y="30" text-anchor="middle" font-size="20" font-weight="800" fill="#b85a2b">first client goes live</text>
  <text x="300" y="205" text-anchor="middle" font-size="20" fill="#1f7a45" font-weight="700">early — rename a field: 2 minutes</text>
  <text x="130" y="80" font-size="20" fill="#c0392b" font-weight="700">later — rename a field: every client,</text>
  <text x="130" y="106" font-size="20" fill="#c0392b" font-weight="700">every old app version, a migration plan</text>
</svg>`;

export const deck = { key: 'api-00-1', code: 'API 0 · 1/2', title: 'Start here (1/2)', sub: 'What an API is and why designing it well matters' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'What an API is —<br>and why designing it<br>well matters', sub: 'Start here (1/2): the idea, the history,<br>and what this course will get you to.' },

  { t: 'This course is for you if…', to: true, giua: true, body: `
<ul>
<li>You can write an Express route, but you are <b>not sure</b> whether it should be <code class="i">POST</code> or <code class="i">PUT</code>, <b>400</b> or <b>422</b></li>
<li>Your front-end teammate keeps asking <b>“what does the API return when…?”</b></li>
<li>You want a backend job, and interviewers ask you to <b>design an API</b> on a whiteboard</li>
<li>You are building a real project (like <b>LabFlow</b>) that other apps will call</li>
</ul>
${box('Promise', 'Every idea starts from zero, in plain words. Every command in this course was <b>run for real</b> and the output is copied as-is.', 'xanh')}` },

  { t: 'Everyday example first: ordering in a restaurant', body: `${nhaHang()}
<p style="font-size:23px;margin:0">The menu tells you <b>what you can ask for</b> and <b>how</b>; the waiter brings back a dish — or says “sold out”. That agreement between two sides is exactly what an API is.</p>` },

  { t: 'API = a contract between two programs', body: two(`
<p style="margin:0">${kw('API', 'Application Programming Interface')}</p>
<ul style="margin-top:10px">
<li><b>What</b> you can ask for (list labs, book a lab)</li>
<li><b>How</b> to ask (method, address, data format)</li>
<li><b>What comes back</b> (fields, types)</li>
<li><b>What can go wrong</b> (and how you will be told)</li>
</ul>`,
  box('A Web API', `The two programs talk over <b>HTTP</b> — the same protocol your browser uses. The client sends a <b>request</b>; the server answers with a <b>response</b>.`, 'lam') +
  sql(`GET /labs/lab_2 HTTP/1.1          ← request
Host: localhost:4000

HTTP/1.1 200 OK                   ← response
Content-Type: application/json

{ "id": "lab_2", "code": "AL-305",
  "name": "Phòng Lab IoT" }`, { lang: 'http' }) + '<div class="cap">Shortened from a real run in lesson 0.3.</div>', 'r46') },

  { t: 'Five words people mix up', body: `
<table class="t lon">
<tr><th style="width:150px">Word</th><th>Meaning</th><th style="width:330px">LabFlow example</th></tr>
<tr><td><b>API</b></td><td>The <b>whole contract</b>: every operation, format, error</td><td>“The LabFlow API”</td></tr>
<tr><td><b>Resource</b></td><td>A <b>thing</b> the API lets you work with</td><td>a lab, a device, a booking</td></tr>
<tr><td><b>Endpoint</b></td><td><b>One</b> operation = method + path</td><td>${c('POST /bookings')}</td></tr>
<tr><td><b>Route</b></td><td>The <b>code</b> that handles an endpoint (server side)</td><td>${c("app.post('/bookings', …)")}</td></tr>
<tr><td><b>URL</b></td><td>The full <b>address</b> of a resource</td><td>${c('http://localhost:4000/labs/lab_1')}</td></tr>
</table>
${box('Rule of thumb', 'Clients see <b>endpoints and resources</b>. Only the server team sees <b>routes</b>. Design the first; the second is implementation.', 'lam')}` },

  { t: 'Four API styles you will hear about', body: `
<table class="t lon">
<tr><th style="width:130px">Style</th><th style="width:330px">A call looks like</th><th>Strong at</th><th style="width:220px">Seen in</th></tr>
<tr><td><b>REST</b></td><td>${c('GET /labs/lab_1')}</td><td>simple, cacheable, works everywhere</td><td>most public web APIs</td></tr>
<tr><td><b>RPC</b></td><td>${c('POST /bookLab')} {labId…}</td><td>“call a function” feels natural</td><td>internal tools, JSON-RPC</td></tr>
<tr><td><b>GraphQL</b></td><td>${c('{ lab(id:1) { name } }')}</td><td>client picks exactly the fields</td><td>Facebook, GitHub v4</td></tr>
<tr><td><b>gRPC</b></td><td>${c('LabService.Get(req)')}</td><td>fast binary calls between services</td><td>microservices</td></tr>
</table>
${box('This course', '<b>REST-style JSON over HTTP</b> first — it is what most junior backend jobs use. Chapter 7 compares GraphQL and gRPC honestly.', 'xanh')}` },

  { t: 'HTTP is not REST', to: true, giua: true, body: two(
    box('HTTP — the protocol', `<ul style="margin:6px 0 0"><li>Rules for <b>sending messages</b>: methods, status codes, headers</li><li>A standard (RFC 9110)</li><li>Used by REST, RPC, GraphQL alike</li></ul>`, 'lam'),
    box('REST — an architectural style', `<ul style="margin:6px 0 0"><li>A <b>way of designing</b>: resources + uniform methods</li><li>Defined by Roy Fielding, 2000</li><li>Not a library, not a file format</li></ul>`, '')) +
    `<p style="margin:14px 0 0;font-size:24px">“REST API” in job ads usually means <b>JSON over HTTP, organised around resources</b>. That is what we build.</p>` },

  { t: 'A short history (1/2): from remote calls to REST', body: timeline([
    ['1976', 'RFC 707', 'call procedures on|another machine'],
    ['1991', 'HTTP/0.9', 'Tim Berners-Lee:|one method, GET'],
    ['1996', 'RFC 1945', 'HTTP/1.0: headers,|status codes'],
    ['1998', 'XML-RPC', 'function calls|in XML over HTTP'],
    ['2000', 'SOAP 1.1', 'W3C Note:|heavy XML envelopes', '#b85a2b'],
    ['2000', 'REST', 'Fielding’s PhD,|UC Irvine', '#2f7d4f'],
  ]) + `<p style="margin:0;font-size:21px">The idea “ask another program to do something” is older than the Web. REST named the style that made the Web itself scale.</p>` },

  { t: 'A short history (2/2): contracts become documents', body: timeline([
    ['2011', 'Swagger 1.0', 'describe a REST API|in one file'],
    ['2015', 'GraphQL · gRPC', 'Facebook & Google|open-source theirs'],
    ['2016', 'OpenAPI', 'Swagger spec renamed,|run by the OAI'],
    ['2019', 'OWASP API', 'first API Security|Top 10 (2023 update)', '#c0392b'],
    ['2022', 'RFC 9110', 'today’s definition|of HTTP semantics'],
    ['2023', 'RFC 9457', 'standard shape|for API errors', '#2f7d4f'],
  ]) + `<p style="margin:0;font-size:21px">Trend: the contract moved <b>out of people’s heads</b> into <b>written, checkable documents</b> — and security became its own discipline.</p>` },

  { t: 'Why APIs exist: one backend, many clients', body: `${hub()}
<p style="margin:0;font-size:22px">Without an API, every client would talk to the database directly — six apps, six copies of the business rules, six ways to get them wrong.</p>` },

  { t: 'Writing endpoints ≠ designing an API', body: `${chiPhi()}
<p style="margin:0;font-size:22px">Before anyone uses it, an API is cheap to change. After the first client ships, <b>every decision becomes a promise</b>. Design = making those promises on purpose.</p>` },

  { t: 'Where this shows up at work and in interviews', to: true, body: cards([
    ['🤝 Team projects', 'Front-end and back-end agree on the contract <strong>before</strong> coding — no more “I thought it returned an array”.'],
    ['🔍 API review', 'Companies review a new endpoint like code: names, status codes, errors, pagination, security.'],
    ['📄 OpenAPI', 'The contract lives in a file that generates docs, client code and tests.'],
    ['🛡️ Security', 'Most API breaches are design mistakes: missing per-object checks, endpoints nobody remembered.'],
    ['🎤 Interviews', '“Design the API for a booking system” is a classic junior–mid question.'],
    ['🎓 Graduation project', 'A clear API makes LabFlow easy to demo, test and hand over.'],
  ], 3) },

  { t: 'After this course you will be able to…', to: true, body: two(`
<ul>
<li>Model <b>resources</b> and pick the right <b>method + status code</b></li>
<li>Return <b>one error format</b> (RFC 9457) across the API</li>
<li>Build <b>cursor pagination</b>, filters and sorting that stay fast</li>
<li>Version and <b>evolve</b> an API without breaking apps</li>
</ul>`, `
<ul>
<li>Make <b>retries safe</b>: idempotency keys, rate limits</li>
<li>Close the <b>OWASP API Top 10</b> holes</li>
<li>Write an <b>OpenAPI 3.1</b> contract and generate docs</li>
<li>Answer an <b>API / system design</b> interview step by step</li>
</ul>`) + box('Your portfolio piece', 'The <b>LabFlow API</b> — designed, documented, secured and load-tested — built a little in every chapter.', 'xanh') },

  { t: 'The project we build: LabFlow', body: two(`
<p style="margin:0;font-size:23px">Students book <b>lab rooms</b> and <b>devices</b>; lab managers approve bookings and keep equipment working. Four resources to start:</p>`,
  box('Why LabFlow, not a shop?', `<ul style="margin:4px 0 0;font-size:20px"><li>A real graduation-project domain</li><li>Booking forces every hard topic: <b>double booking</b> (409), <b>retries</b>, <b>time zones</b>, approvals</li><li>Small enough to finish, rich enough to interview with</li></ul>`, 'lam'), 'r46') + erd() + `<p style="margin:0;font-size:22px">Chapter 1 turns these four into URLs: ${c('/labs')} · ${c('/labs/{labId}/devices')} · ${c('/bookings')} · ${c('/bookings/{id}/cancel')}</p>` },

  { giua: true, to: true,  t: 'The roadmap: 13 parts, 4 phases', body: `
<table class="t lon">
<tr><th style="width:250px">Phase</th><th>Chapters</th></tr>
<tr><td><b>1 · The contract</b></td><td>0 Start · 1 Resources &amp; methods · 2 Errors &amp; validation · 3 Pagination &amp; filtering</td></tr>
<tr><td><b>2 · Living with clients</b></td><td>4 Versioning · 5 Idempotency, retries, rate limits · 6 Security · 7 OpenAPI &amp; contracts</td></tr>
<tr><td><b>3 · Systems</b></td><td>8 Latency &amp; availability · 9 Data at scale · 10 Async &amp; realtime</td></tr>
<tr><td><b>4 · Prove it</b></td><td>11 Interview round · 12 Capstone: LabFlow production API</td></tr>
</table>
${box('Each chapter', 'Slides → written lesson with real output → 🧪 practice → 🗂 key terms → 📌 summary → chapter lab with rubric → 10-question quiz.', 'lam')}` },

  { t: 'What you need before you start', to: true, body: two(`
<p style="margin:0"><b>Needed</b></p>
<ul>
<li>Basic JavaScript: variables, functions, objects, arrays</li>
<li>Comfort typing commands in a terminal</li>
<li>A computer that can install <b>Node.js 22</b> (lesson 0.3 shows how)</li>
</ul>`, `
<p style="margin:0"><b>Not needed</b></p>
<ul>
<li>Prior Express experience — lesson 0.3 builds it from zero</li>
<li>A database — data stays in memory until the capstone</li>
<li>Good English — every term is explained in Vietnamese</li>
</ul>`) + box('Coming from SDN302?', 'You will recognise HTTP, routes and status codes. Here we go <b>deeper</b>: why each choice, what breaks, what companies actually do.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>An <b>API</b> is a <b>contract</b>: what you may ask, how, what comes back, what can fail</li>
<li><b>Endpoint</b> = method + path · <b>route</b> = the server code behind it</li>
<li><b>HTTP</b> is the protocol; <b>REST</b> is a design style on top of it</li>
<li>Changing an API is cheap <b>before</b> clients exist, expensive <b>after</b></li>
<li>We learn by building the <b>LabFlow API</b>, chapter by chapter</li>
</ul>
${box('Next', 'Start here (2/2): real API disasters — and a study plan that keeps you going.', 'xanh')}` },
]);
