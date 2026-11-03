/** Web Foundations · deck bài 14.2 — Biến môi trường và khoá bí mật. */
import { deckWf, js, bash, term, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-14-2', code: 'WF 14.2', title: 'Environment variables & secrets', sub: 'Web Foundations · Chapter 14' };

const BG = OUT['_t14/out/bundle-grep'].split('\n');
const LEAK = BG.slice(1, 2).join('\n');

export const slides = deckWf({ chuong: 'Chapter 14 — Shipping it', bai: '14.2' }, [
  { cover: true, t: 'Environment variables & secrets', sub: 'Configuration that changes per machine, secrets that must never reach the browser or git — with the leaks reproduced for real' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain what an <b>environment variable</b> is and why config lives there</li>
    <li>Use <code class="i">.env</code>, <code class="i">.env.example</code> and <code class="i">.gitignore</code> correctly</li>
    <li>Know which values are <b>public</b> (front-end) and which are <b>secret</b></li>
    <li>Make a server <b>fail fast</b> when config is missing</li>
    <li>React correctly when a secret leaks: <b>rotate</b>, do not just delete</li></ul>` },

  { t: 'Same code, different machines', to: true, giua: true, body: tbl(['Setting', 'On your laptop', 'In production'], [
      ['API URL', 'http://localhost:4000', 'https://api.ctshop.vn'],
      ['Database', 'local Postgres, test data', 'real customers'],
      ['Payment key', 'test mode', 'live mode — real money'],
    ]) + box('Rule', 'Code is the same everywhere; <b>configuration</b> changes per environment, so it lives outside the code — in environment variables.', 'info') },

  { t: 'The three files', giua: true, body: bash('_t14/.env.example', null, { gon: false }) + two(bash('_t14/.gitignore', null, { gon: false }), box('Who sees what', '<code class="i">.env</code> = real values, on each machine, <b>never committed</b>. <code class="i">.env.example</code> = the list of names, committed. <code class="i">.gitignore</code> keeps the first out of git.', 'ok'), 'r37') },

  { t: 'Server side: fail fast', giua: true, body: `${js('_t14/config.mjs', null, { chi: [1, 16] })}
    ${box('Why fail fast', 'A server that starts without its database URL crashes later, on the first customer request, with a confusing error. Checking at start-up turns that into one clear line.', 'ok')}` },

  { t: 'Fail fast, measured', giua: true, body: `${term('_t14/out/config-missing', null, { title: 'node config.mjs' })}
    ${term('_t14/out/config-envfile', null, { title: 'node --env-file=.env config.mjs' })}
    ${term('_t14/out/config-ok', null, { title: 'PAYMENT_SECRET=… node --env-file=.env config.mjs' })}` },

  { t: 'Front-end: everything is public', giua: true, body: `${js('_t14/src/main.js', null, { chi: [13, 16], gon: false })}
    ${term(null, LEAK, { title: 'the built bundle, readable by anyone' })}
    ${box('VITE_ is not a security feature', 'It only marks a value as <b>safe to publish</b>. Anything the browser can use, the user can read.', 'bad')}` },

  { t: 'Where each value belongs', to: true, giua: true, body: two(box('Public — OK in the bundle', '<ul><li>API base URL</li><li>Analytics ID, map key restricted by domain</li><li>Feature flags</li><li>Name: <code class="i">VITE_…</code> / <code class="i">NEXT_PUBLIC_…</code></li></ul>', 'info'), box('Secret — server only', '<ul><li>Database password</li><li>Payment / e-mail API secret keys</li><li>JWT signing secret</li><li>Only on the server; the browser calls YOUR API</li></ul>', 'bad')) },

  { t: 'Deleting a committed secret is not enough', giua: true, body: `${term('_t14/out/git-history', null, { title: 'a fresh repo: commit .env by mistake, then remove it' })}` },

  { t: 'A secret leaked: what to do', to: true, giua: true, body: steps([
      '<b>Rotate</b>: create a new key at the provider and revoke the old one — first, within minutes.',
      'Update the value on every server / CI secret store.',
      'Then clean history if needed — but assume the old key is known forever.',
      'Add a guard: <code class="i">.gitignore</code>, secret scanning (GitHub push protection, gitleaks).',
    ]) + box('Why rotate first', 'Bots scan public GitHub pushes for keys within minutes. Deleting the file does nothing about copies already taken.', 'bad') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Config per environment ⇒ environment variables</li>
    <li><code class="i">.env</code> ignored, <code class="i">.env.example</code> committed</li>
    <li>Front-end values are public, always</li>
    <li>Leaked ⇒ rotate, then clean</li></ul>`,
    box('Practice (20 min)', 'Add a <code class="i">config.mjs</code> to a Node script that requires <code class="i">API_TOKEN</code>, load it with <code class="i">node --env-file=.env</code>, and set up .env / .env.example / .gitignore.<br><br><b>Done when</b>: the script exits 1 with a clear message without the variable, <code class="i">git check-ignore .env</code> prints <code class="i">.env</code>, and the token is never printed.', 'ok')) },
]);
