/**
 * node-00-4 — Node.js · Section 0 · Lesson 0.4 "The project we build together" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: s00-intro.mjs › nodejs-0-4-du-an. Output THẬT: that/c0/{git-start,git-secret} (git 2.51 trong thư mục tạm).
 * Bổ sung so với bài web: thử thật "mật khẩu đã commit rồi xoá vẫn nằm trong lịch sử".
 */
import { lamDeck, two, cot, box, cards, kw, vsd, bang, ra, js, term } from './_node-chung.mjs';

export const deck = { key: 'node-00-4', code: 'NODE 0.4', title: 'The project we build together', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', TIM = '#7c3aed', DO = '#b0281a';

/* Bốn tầng của Notes API (SVG): request đi xuống từng tầng. */
const tang = () => {
  const L = [['HTTP layer', 'routes · validation · auth · errors', NODE], ['Business layer', 'rules: "can this person share this note?"', CAM], ['Data layer', 'Prisma models · migrations · transactions', LAM], ['Infrastructure', 'PostgreSQL · Redis · object storage · queues', TIM]];
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial"><defs><marker id="m4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  L.forEach(([t, p, m], i) => { const y = 6 + i * 82; s += `<rect data-k="tang" x="130" y="${y}" width="970" height="68" rx="10" fill="${m}14" stroke="${m}" stroke-width="2.5"/><text x="156" y="${y + 43}" font-size="26" font-weight="800" fill="${m}">${t}</text><text x="440" y="${y + 43}" font-size="23" fill="#444">${p}</text>`; });
  s += `<text x="4" y="160" font-size="23" font-weight="700" fill="#b85a2b">request</text><line x1="60" y1="6" x2="60" y2="130" stroke="#b85a2b" stroke-width="4"/><line x1="60" y1="176" x2="60" y2="320" stroke="#b85a2b" stroke-width="4" marker-end="url(#m4)"/>`;
  return s + '</svg>';
};

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.4' }, [
  { cover: true, t: 'The project<br>we build together', sub: 'One API, growing chapter by chapter,<br>until it is ready for the internet.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What the <b>Notes API</b> does and why we build one project</li>
<li>Its <b>four layers</b> and what lives in each</li>
<li>How it grows through the chapters</li>
<li>The folder structure we are heading to</li>
<li><b>Git</b> from day one, and the secret you must never commit</li>
</ul>` },

  { t: 'Why one project, not many demos?', to: true, giua: true, body: `<div class="vsd">
<div class="sai"><div class="h">Disconnected demos</div><p style="margin:0">Each one works alone. You can follow along, but you cannot start from an empty folder.</p></div>
<div class="dung"><div class="h">One growing API</div><p style="margin:0">Each chapter adds a layer to the same service, until you can really put it online.</p></div>
</div>
${box('Small enough, big enough', 'Small enough to hold in your head. Big enough to force every real problem to appear: auth, permissions, relations, upload, cache, background work.', 'xanh')}` },

  { t: 'What we build: the Notes API', giua: true, body: `<ul>
<li>Users write notes, organize them, attach files, and share them in real time</li>
</ul>${tang()}
${box('Term', `${kw('API', 'a program that answers other programs, usually with JSON')} &nbsp; ${kw('layer', 'one group of code with one job')}`, 'lam')}` },

  { t: 'How it grows, chapter by chapter', body: bang(['Chapters', 'What the Notes API gains'], [
    ['3–5', 'A server that returns notes from an array in memory. No database yet, on purpose'],
    ['6', 'Proper REST: correct status codes, validation, pagination, one error shape'],
    ['7', 'PostgreSQL through Prisma. The array dies; migrations and relations appear'],
    ['8–9', 'Sign up, log in, refresh tokens, roles. Every note now belongs to someone'],
    ['10', 'File attachments upload straight to object storage, served through a CDN'],
    ['11', 'Live collaboration: someone shares a note, your screen updates itself'],
    ['12–13', 'Redis cache for hot reads, a queue for slow work (thumbnails, email)'],
    ['14–16', 'Tests, structured logs, health checks, a load test that finds the bottleneck'],
    ['17–18', 'Docker, deploy, and a structure a second developer can join'],
  ], { co: 22 }) },

  { t: 'The folder structure we are heading to', giua: true, body: two(term(`notes-api/
├─ src/
│  ├─ routes/       # HTTP endpoints, thin
│  ├─ services/     # business logic
│  ├─ middleware/   # auth, validation, errors
│  ├─ lib/          # db client, logger
│  └─ index.js      # create app, open port
├─ prisma/
│  └─ schema.prisma # data model
├─ tests/
├─ .env             # secrets: NEVER commit
├─ .env.example     # same keys, empty values
└─ package.json`, { title: 'structure from the lesson' }), cot(box('Do not start here', 'We reach this around <b>Chapter 6</b>, when one file really starts to hurt.', 'do2'), box('Why', 'Folders you do not need yet only make a project messy.', ''), box('The most valuable folder', '<code class="i">services/</code>: the rules of your business.', 'xanh')), 'r64') },

  { t: 'A rule to adopt now: thin routes', to: true, giua: true, body: vsd(js(`// business rule inside the route
app.post('/notes/:id/share', async (req, res) => {
  const note = await db.note.find(req.params.id);
  if (note.ownerId !== req.user.id) {
    return res.status(403).end();
  }
  // ...more rules...
});`, { sm: true }), js(`// route reads, calls, formats
app.post('/notes/:id/share', async (req, res) => {
  const out = await shareNote(req.params.id, req.user.id);
  res.json(out);
});

// the rule lives in a service: testable without HTTP`, { sm: true }), '✗ Fat route', '✓ Thin route') + box('Why', 'If rules leak into routes, you cannot test them without faking all of HTTP. <b>Sketch only:</b> we write real versions from Chapter 5.', 'xanh') },

  { t: 'Git from the very first lesson', giua: true, body: `${term(ra('c0/git-start', 1, 8), { title: 'real session · git 2.51', hl: [4, 5] })}
${box('Why now', 'One day you will want to look back: "what did this look like before auth?"', 'xanh')}
${box('Term', `${kw('commit', 'a saved snapshot of the project')} &nbsp; ${kw('.gitignore', 'files Git must not track')}`, 'lam')}` },

  { t: '.gitignore keeps your secrets out', to: true, giua: true, body: `${term(ra('c0/git-start', 9, 13), { title: 'real session', hl: [3] })}
${box('Read it', '<code class="i">!!</code> means ignored. The file exists on your disk, but Git will never commit it.', 'xanh')}
${box('Order matters', 'Add <code class="i">.env</code> to <code class="i">.gitignore</code> <b>before</b> the first commit that could include it.', 'do2')}` },

  { t: 'Git never forgets: a real test', giua: true, body: `${term(ra('c0/git-secret'), { title: 'real session: committed once, then deleted', hl: [5, 10, 11] })}
${box('What happened', 'The file is gone from the folder, but <code class="i">git show</code> still prints the password. Anyone with the repository can read it.', 'do2')}
${box('If this happens', 'Treat the secret as <b>leaked</b> and change it. Deleting is not enough.', 'xanh')}` },

  { t: 'This is how this website is built', to: true, giua: true, body: `${bang(['Folder', 'Job'], [
    ['<code class="i">src/routes/</code>', 'endpoints'],
    ['<code class="i">src/services/</code>', 'business rules'],
    ['<code class="i">prisma/schema.prisma</code>', 'the data model'],
  ], { co: 26 })}
${box('Real result', '"Share a note with someone" is written once, then used by both the REST API and the realtime socket handler.', 'xanh')}` },

  { t: 'Do this now', to: true, giua: true, body: `
<ol>
<li>Make an empty <code class="i">notes-api</code> folder</li>
<li>Run <code class="i">git init</code></li>
<li>Create <code class="i">.gitignore</code> with <code class="i">node_modules/</code> and <code class="i">.env</code></li>
<li>Commit: <code class="i">chore: empty project</code></li>
<li>Check with <code class="i">git log --oneline</code></li>
</ol>
${box('Done when', 'You see exactly one commit in the log.', 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>In which layer does the rule "can this person share this note?" live?</li>
<li>Why don't we create all folders on day one?</li>
<li>You committed a password, then deleted it. Are you safe?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Business layer: services. &nbsp; 2. Unused folders only add mess. &nbsp; 3. No: it stays in history, change the password.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>One project, the <b>Notes API</b>, grows through 18 chapters</li>
<li>Four layers: HTTP, business, data, infrastructure</li>
<li>Thin routes, testable services</li>
<li>Git from day one. <code class="i">.env</code> stays out, always</li>
</ul>
${box('Next', 'Chapter 1 · Lesson 1.1 — Variables and scope: var, let, const.', 'lam')}` },
]);
