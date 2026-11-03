/** Web Foundations · deck bài 10.5 — Bức tranh full-stack. Output thật: _demo/_t10/10-5/chay.mjs (Node 22.23 + node:sqlite, Chromium, curl). */
import { deckWf, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const phan = (k, ten) => { const s = OUT[k]; const i = s.indexOf('── ' + ten); const j = s.indexOf('\n\n──', i + 1); return s.slice(s.indexOf('\n', i) + 1, j < 0 ? undefined : j).trim(); };

export const deck = { key: 'wf-10-5', code: 'WF 10.5', title: 'The full-stack picture', sub: 'Web Foundations · Chapter 10' };

export const slides = deckWf({ chuong: 'Chapter 10 — Thinking, debugging, Git', bai: '10.5' }, [
  { cover: true, t: 'The full-stack picture', sub: 'One click, every chapter' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Draw one request through <b>every layer</b></li>
    <li>Name the <b>chapter</b> of each layer</li>
    <li>Read <b>browser + server logs</b> together</li>
    <li>Find the layer from the <b>status code</b></li>
    <li>Choose your <b>next course</b></li></ul>` },

  { t: 'One app, every chapter', to: true, giua: true, body: steps([
      '<b>Event</b> submit → <b>fetch</b> POST JSON (Ch 4–6)',
      '<b>Session</b> cookie → user id (Ch 7)',
      '<b>Validation</b> at the boundary (Ch 6, 9)',
      '<b>SQL</b> with parameters, by user_id (Ch 8)',
      '<b>JSON</b> reply → <b>DOM</b> textContent (Ch 4, 6)',
    ]) },

  { t: 'Logging in', giua: true, body: two(term(null, phan('_t10/out/fs-login', 'browser'), { title: 'browser console' }), term(null, phan('_t10/out/fs-login', 'server').split('\n').slice(4).join('\n'), { title: 'server terminal' })) },

  { t: 'One click, end to end', giua: true, body: term(null, phan('_t10/out/fs-click', 'browser'), { title: 'browser' }) + term(null, phan('_t10/out/fs-click', 'server'), { title: 'server' }) },

  { t: 'When validation says no', giua: true, body: term(null, phan('_t10/out/fs-invalid', 'server'), { title: 'server — no SQL ran' }) + box('422', 'the server never trusts the browser', 'info') },

  { t: 'The same API without a browser', giua: true, body: term('_t10/out/fs-curl', null, { title: 'curl' }) },

  { t: 'Where a bug lives', to: true, giua: true, body: tbl(['You see', 'Look at'], [['no request in Network', 'page JS, event'], ['401 / 403', 'session, cookie'], ['400 / 422', 'request body'], ['404', 'URL, method'], ['500', 'server log, DB'], ['200 but wrong page', 'rendering']]) },

  { t: 'Summary & what comes next', to: true, giua: true, body: two(`<ul>
    <li>Node.js — the server, properly</li>
    <li>React → Next.js — interfaces</li>
    <li>PostgreSQL + Prisma — data</li>
    <li>Deploy — Docker, VPS, HTTPS</li>
    <li>Suggested order: Node.js first</li></ul>`,
    box('Practice (60 min)', 'Add DELETE /api/notes/:id through every layer.<br><br><b>Done when</b>: curl gives 401, 404, 204 and the page deletes without reload.', 'ok')) },
]);
