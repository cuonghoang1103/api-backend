/**
 * api-00-2 — API Design · Section 0 · "Start here (2/2)" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s00-intro.mjs › api-0-9-bat-dau-khi-khong-co. Mọi sự cố đều có nguồn (link trong bài);
 * tình huống sinh viên ghi rõ là MINH HOẠ.
 */
import { lamDeck, two, box, steps, cards, kw, c, vsd, http } from './_api-chung.mjs';

const meta = { chuong: 'Section 0 — Why API design matters', bai: '0 · Start here 2/2' };

/* Thẻ sự cố: trái = chuyện gì xảy ra, phải = bài học thiết kế. */
const suCo = ({ nam, ai, chuyen, so, bai, chuong, nguon }) => `
<div class="hai r64"><div>
<p style="margin:0 0 8px"><span style="background:#c0392b;color:#fff;font-weight:800;padding:3px 12px;border-radius:5px;font-size:21px">${nam}</span> <b style="font-size:26px">${ai}</b></p>
<ul style="font-size:25px;gap:12px">${chuyen.map((x) => `<li>${x}</li>`).join('')}</ul>
</div><div>
<div style="text-align:center;border:3px solid #c0392b;border-radius:14px;padding:12px 8px;background:#fdf0ee"><div style="font-size:54px;font-weight:800;color:#c0392b;line-height:1.1">${so[0]}</div><div style="font-size:21px;color:#555">${so[1]}</div></div>
<div style="margin-top:12px">${box('API design lesson', bai, 'xanh')}</div>
<p class="nho" style="margin:8px 0 0">→ ${chuong} · source: ${nguon}</p>
</div></div>`;

/* Lộ trình học: các mốc. */
const moc = () => {
  const items = [['Day 1', 'Run LabFlow', 'curl -i works', '#336791'], ['Week 1', 'Chapter 1', 'design 10 endpoints', '#336791'], ['Week 2', 'Ch 2–3', 'errors + pagination', '#e08a1e'],
    ['Week 4', 'Ch 4–7', 'safe, secure, documented', '#e08a1e'], ['Week 6', 'Ch 8–11', 'systems + interview', '#2f7d4f'], ['Finish', 'Capstone', 'portfolio API', '#2f7d4f']];
  let s = `<svg viewBox="0 0 1110 220" width="1110" height="220" font-family="Arial">`;
  const w = 168, g = 20;
  items.forEach(([d, t, x, m], i) => {
    const x0 = i * (w + g);
    s += `<rect x="${x0}" y="40" width="${w}" height="150" rx="12" fill="${m}14" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x0 + w / 2}" y="28" text-anchor="middle" font-size="21" font-weight="800" fill="${m}">${d}</text>`;
    s += `<text x="${x0 + w / 2}" y="100" text-anchor="middle" font-size="23" font-weight="800" fill="#262626">${t}</text>`;
    x.split(' ').reduce((acc, wd) => { const last = acc[acc.length - 1]; if ((last + ' ' + wd).trim().length <= 13) acc[acc.length - 1] = (last + ' ' + wd).trim(); else acc.push(wd); return acc; }, [''])
      .forEach((l, k) => { s += `<text x="${x0 + w / 2}" y="${135 + k * 24}" text-anchor="middle" font-size="19" fill="#555">${l}</text>`; });
    if (i < items.length - 1) s += `<path d="M${x0 + w + 3},115 L${x0 + w + g - 3},115" stroke="#b85a2b" stroke-width="3"/>`;
  });
  return s + '</svg>';
};

export const deck = { key: 'api-00-2', code: 'API 0 · 2/2', title: 'Start here (2/2)', sub: 'Real API failures and how to study this course' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'When APIs go wrong —<br>and how to learn this<br>without giving up', sub: 'Start here (2/2): five real incidents,<br>one student story, and a study plan.' },

  { t: 'Why start with failures?', to: true, giua: true, body: `
<ul>
<li>Rules like “check permission on every object” sound boring — <b>until you see 60 million accounts</b> exposed by skipping it</li>
<li>Each story below is <b>real and sourced</b>; the numbers come from the company, a regulator or the reporter who found it</li>
<li>For each one we ask: <b>which design rule would have stopped it</b>, and which chapter teaches that rule</li>
</ul>
${box('Not a security course', 'You do not need to be a hacker. Most of these were <b>ordinary design mistakes</b> that any of us could write on a tired evening.', 'lam')}` },

  { t: 'USPS 2018: any user could read everyone else', giua: true, body: suCo({
    nam: '2018', ai: 'US Postal Service — “Informed Visibility” API',
    chuyen: ['Any <b>logged-in</b> usps.com user could query <b>other users’</b> email, phone and address', 'Wildcard searches returned whole data sets', 'Reported to USPS more than a year earlier; fixed the day after a journalist called'],
    so: ['≈ 60 M', 'usps.com accounts exposed'],
    bai: 'Being logged in is <b>not</b> permission. Check “may <i>this</i> user see <i>this</i> record?” on <b>every</b> request.',
    chuong: 'Ch 6: object-level authorisation (BOLA)', nguon: 'KrebsOnSecurity, 21 Nov 2018' }) },

  { t: 'Optus 2022: one code change weakened a check', giua: true, body: suCo({
    nam: '2022', ai: 'Optus (Australian telco) — customer API',
    chuyen: ['Per the regulator ACMA: an access control was <b>weakened by a code change</b> (around 2018)', 'Fixed on the main site in 2021 — <b>not</b> on a second, dormant API domain', 'Attacker called that API 17–20 Sep 2022 and got customer records'],
    so: ['≈ 9.5–10 M', 'customers (figures vary by report)'],
    bai: 'Keep an <b>inventory</b> of every endpoint, delete dormant ones, and protect access rules with <b>automated tests</b>.',
    chuong: 'Ch 6 + Ch 7: inventory & contract tests', nguon: 'iTnews, Jun 2024 (ACMA court filing)' }) },

  { t: 'T-Mobile 2023: one API, abused for six weeks', giua: true, body: suCo({
    nam: '2023', ai: 'T-Mobile US — customer-account API',
    chuyen: ['A bad actor pulled data through <b>a single API without authorisation</b>', 'Started around <b>25 Nov 2022</b>, noticed on <b>5 Jan 2023</b>', 'Names, billing addresses, emails, phone numbers, dates of birth'],
    so: ['≈ 37 M', 'customer accounts'],
    bai: 'Return only the fields a client needs, <b>rate-limit</b> per caller, and <b>watch</b> for unusual volumes.',
    chuong: 'Ch 2 response shapes · Ch 5 rate limits · Ch 8 monitoring', nguon: 'T-Mobile SEC Form 8-K, 19 Jan 2023' }) },

  { t: 'Twilio Authy 2024: an endpoint with no login at all', giua: true, body: suCo({
    nam: '2024', ai: 'Twilio Authy (2-factor app)',
    chuyen: ['Twilio: attackers used <b>an unauthenticated endpoint</b> to identify data linked to Authy accounts, incl. phone numbers', 'Feed in a phone number → learn whether it has an account (<b>enumeration</b>)', 'Fix: the endpoint no longer accepts unauthenticated requests'],
    so: ['≈ 33 M', 'phone numbers leaked (attackers’ claim)'],
    bai: 'Every endpoint needs an explicit <b>who may call this?</b> decision, plus <b>rate limits</b> so nobody can try millions of inputs.',
    chuong: 'Ch 5 rate limiting · Ch 6 authentication', nguon: 'Twilio security alert, Jul 2024' }) },

  { t: 'Twitter 2023: changing the contract can kill apps', giua: true, body: suCo({
    nam: '2023', ai: 'Twitter API → third-party clients',
    chuyen: ['Mid-Jan 2023: popular apps such as <b>Tweetbot</b> suddenly stopped working', '19 Jan: developer terms changed to <b>ban</b> third-party clients', 'Tweetbot, built over a decade, shut down days later'],
    so: ['No notice', 'before the apps broke'],
    bai: 'An API is a promise. Breaking changes need <b>versioning</b>, a <b>deprecation notice</b> and a timeline clients can plan for.',
    chuong: 'Ch 4: versioning, deprecation & sunset', nguon: 'TechCrunch, 19 Jan 2023' }) },

  { t: 'The pattern behind the headlines', body: `
<table class="t lon">
<tr><th>Incident</th><th>What really failed</th><th>Design rule</th><th style="width:110px">Chapter</th></tr>
<tr><td>USPS 2018</td><td>logged in = allowed everything</td><td>authorise <b>each object</b></td><td>6</td></tr>
<tr><td>Optus 2022</td><td>forgotten endpoint, untested rule</td><td><b>inventory</b> + contract tests</td><td>6, 7</td></tr>
<tr><td>T-Mobile 2023</td><td>too much data, nobody watching</td><td>minimal fields, <b>rate limits</b>, alerts</td><td>2, 5, 8</td></tr>
<tr><td>Authy 2024</td><td>endpoint without authentication</td><td><b>auth by default</b>, anti-enumeration</td><td>5, 6</td></tr>
<tr><td>Twitter 2023</td><td>contract changed overnight</td><td><b>versioning</b> + deprecation policy</td><td>4</td></tr>
</table>
${box('Takeaway', 'None of these needed genius attackers. They needed an API whose <b>contract</b> nobody had thought through. That thinking is this course.', 'xanh')}` },

  { t: 'Closer to home: the demo-day disaster (illustration)', to: true, giua: true, body: two(`
<p style="margin:0 0 6px;font-size:21px;color:#9a4a12;font-weight:800">⚠ ILLUSTRATIVE STUDENT SCENARIO — not a real event</p>
<ol style="font-size:25px">
<li>Night before demo: back-end renames <code class="i">items</code> → <code class="i">data</code> “for consistency”</li>
<li>Booking form sends local time <code class="i">"08:00"</code> with no zone; server on UTC stores <b>08:00Z = 15:00 in Hanoi</b></li>
<li>Every error returns <b>200</b> with <code class="i">{ "error": … }</code>, so the front-end shows “Success!”</li>
<li>Edit form uses <b>PUT</b> with half the fields — the other half are wiped</li>
</ol>`, box('Result', 'The lecturer books a lab at 8:00, the screen says success, the booking says 15:00, and the device list is empty. Four small contract mistakes, one ruined demo.', 'do2') +
    box('Course fixes', 'Contract first (Ch 0–1) · ISO 8601 with offset (1.4) · real status codes (1.3) · PUT vs PATCH (1.2)', 'xanh'), 'r64') },

  { t: 'Why people quit learning this — and the fix', to: true, giua: true, body: cards([
    ['😵 Too many English terms', 'Idempotent, payload, pagination… <strong>Fix:</strong> every lesson ends with a 🗂 key-terms box in Vietnamese.'],
    ['📚 Theory without doing', 'Reading about status codes does not stick. <strong>Fix:</strong> you run every example with curl and see the real response.'],
    ['😨 Red errors feel like failure', 'A 4xx is the API <strong>talking to you</strong>. <strong>Fix:</strong> we read errors line by line, on purpose.'],
  ], 3) + `<p style="margin:14px 0 0;font-size:23px">Learning API design is mostly learning a <b>vocabulary</b> and a <b>habit of asking “what if…?”</b>. Both grow by repetition, not talent.</p>` },

  { t: 'One study session, five steps', to: true, giua: true, body: steps([
    '<b>Slides</b> (10 min) — get the picture and the vocabulary',
    '<b>Written lesson</b> (20 min) — the reasons, the traps, the real output',
    '<b>Type it yourself</b> (20 min) — run every curl against your own LabFlow',
    '<b>🧪 Practice</b> (15 min) — a small task with a “done when” you can check',
    '<b>Quiz / chapter lab</b> — only at the end of a chapter',
  ]) + box('Rule', 'Never copy-paste a command you cannot explain. Read it first, then run it.', 'lam') },

  { t: 'How long it takes: two honest plans', body: `
<table class="t lon">
<tr><th style="width:230px">Plan</th><th>Pace</th><th>You finish with</th></tr>
<tr><td><b>Minimum · 2 weeks</b></td><td>1 h/day: Section 0 + Ch 1–3</td><td>a clean LabFlow contract: resources, status codes, errors, pagination — enough for a team project</td></tr>
<tr><td><b>Full · 6–8 weeks</b></td><td>1 h/day + a weekend lab per chapter</td><td>the whole course + capstone: a production-style API you can show in interviews</td></tr>
</table>
${moc()}` },

  { t: 'When you are stuck: read the response first', to: true, giua: true, body: two(steps([
    'Read the <b>status code</b> — 4xx: your request; 5xx: the server',
    'Read the <b>body</b> — a good API says what is wrong',
    'Run again with <b>curl -v</b> to see exactly what you sent',
    'Look at the <b>server terminal</b> — the stack trace is there',
    'Still stuck? Ask with: command, full output, what you expected',
  ]), http(`$ curl -i http://localhost:4000/labs/lab_9
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
…

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}`, { title: 'a 4xx is a message, not a crash' }), 'r46') },

  { t: 'Twelve words to know before Chapter 1', body: `
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 16px;font-size:24px">
${[['client', 'app that sends requests'], ['server', 'program that answers'], ['request', 'what the client sends'], ['response', 'what comes back'], ['endpoint', 'method + path'], ['resource', 'a thing: lab, booking'],
  ['payload / body', 'the data inside'], ['status code', '3-digit result: 200, 404'], ['header', 'extra info: key: value'], ['JSON', 'text format for data'], ['contract', 'promise of the API'], ['breaking change', 'change that breaks clients']]
  .map(([a, b]) => `<div style="border:1.5px solid #c9dbec;border-radius:9px;padding:11px 14px;background:#eef4fa"><b style="color:#245077">${a}</b><br><span style="color:#555">${b}</span></div>`).join('')}
</div>
<p class="nho" style="margin:8px 0 0">The written lesson gives each word in Vietnamese. You will meet all twelve again in lesson 0.1.</p>` },

  { t: 'Milestones: tick them off', to: true, body: two(`
<ul>
<li>☐ I can explain an API to a non-IT friend</li>
<li>☐ I can read a raw HTTP response</li>
<li>☐ My LabFlow API runs and answers <code class="i">curl</code></li>
<li>☐ I chose method + status for 10 endpoints and can defend each</li>
</ul>`, `
<ul>
<li>☐ One error format across my whole API</li>
<li>☐ A retry can never book a lab twice</li>
<li>☐ My API has an OpenAPI file and docs page</li>
<li>☐ I can design an API on a whiteboard in 45 min</li>
</ul>`) + box('Tip', 'Write the date next to each tick. Seeing progress is the best cure for “I am not good at this”.', 'xanh') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Big API incidents are usually <b>ordinary design mistakes</b>: missing per-object checks, forgotten endpoints, no rate limits, overnight contract changes</li>
<li>Small contract mistakes ruin student demos the same way</li>
<li>Study loop: <b>slides → read → run → 🧪 → quiz</b>; read every error on purpose</li>
<li>Two honest plans: <b>2 weeks</b> minimum, <b>6–8 weeks</b> full</li>
</ul>
${box('Next', 'Lesson 0.1 — HTTP you actually need: open a raw request and response and read every line.', 'xanh')}` },
]);
