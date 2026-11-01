/**
 * auth-02-1 — Authentication · Chapter 2 · Lesson 2.1 "The attacker already has your database" (01/11/2026).
 * Slug bài: auth-2-1-da-co-csdl. Output = s02/_ma.mjs (LabFlow ID v0.2 + PostgreSQL 17.11 chạy thật, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, steps, flow, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s02/_ma.mjs';

export const deck = { key: 'auth-02-1', code: 'AUTH 2.1', title: 'The attacker already has your database', sub: 'Why a fast hash is the wrong tool, and what salt does' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const CR = OUT['21-crack'].split('\n');
const cut = (t) => t.replace(/(\$argon2id\$v=19\$m=65536,p=1,t=2\$.{6})\S+/g, '$1…');

export const slides = lamDeck({ chuong: 'Chapter 2 — Passwords', bai: '2.1' }, [
  { cover: true, t: 'The attacker already<br>has your database', sub: 'Chapter 2 · Lesson 2.1 — why a fast hash is the wrong tool' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 2</b>: store passwords so a stolen table is nearly useless — then Lab 2 builds ${c('src/passwords/')}</li>
    <li>The one threat model worth designing for: <b>the table is already copied</b></li>
    <li>Plain, SHA-256, salted SHA-256, argon2id — cracked side by side</li>
    <li>What salt solves, and what it does <b>not</b></li>
    <li>A time-to-crack table from rates measured on this Mac + a public GPU benchmark</li></ul>` },
  { t: 'A key cabinet, photographed', body: cards([
      ['The hotel', 'keeps a spare key for every room in a cabinet behind the desk'],
      ['A thief', 'does not need to steal the cabinet — <b>one photo</b> of it is enough to copy keys at home'],
      ['Your users table', 'one SQL injection, one leaked backup, one ex-employee: the copy leaves, and you are not told'],
    ], 3) + box('Design question', 'Not “how do I stop the leak?” (other chapters) but: <b>once they have a copy, how slowly can they turn it into passwords?</b> People reuse passwords — the damage lands on their email and bank, not only on LabFlow.', 'lam') },
  { t: 'v0.1 moved to PostgreSQL “as it was”', body: two(sh(body('21-naive'), { title: 'node demo2/naive-copy.mjs && node demo2/dump.mjs naive_users' }),
      `<div>${box('One SELECT', 'Every password, readable. An’s <b>an-lab-2026</b> also opens her Gmail if she reused it.', 'do2')}${box('Population', '1,000 made-up accounts + An, Bình, Cô Lan: 30% top-100, 40% rest of top-10k, 30% random 12 chars.', 'lam')}</div>`, 'r64') },
  { t: 'Four storages, one attacker, one list', body: sh(CR.slice(1, 7).join('\n'), { title: 'UV_THREADPOOL_SIZE=10 node demo2/crack.mjs', sm: true }) +
      cards([
        ['SHA-256', `hash the list <b>once</b> (15 ms) ⇒ every account is a lookup; 271 rows share a hash`],
        ['+ salt', 'the list is hashed <b>again per account</b>: 4.96 M hashes, 2.4 s — <b>same 701</b> cracked'],
        ['argon2id', '<b>~51 guesses/s</b> on 10 threads ⇒ the whole list for everyone ≈ 54 h. Bình still falls in 2 guesses'],
      ], 3) },
  { t: 'What salt does — and does not do', body: two(steps([
      'Same password ⇒ <b>different</b> stored value (no “271 repeated rows”)',
      'No precomputed table works: the attacker starts from zero <b>per account</b>',
      'Cost for 1,003 accounts: × 1,003 instead of × 1',
    ]), `<div>${box('Salt does NOT', 'make one guess slower. Salted SHA-256 still runs at <b>2 million/s</b> on one core and <b>22 billion/s</b> on one GPU. A weak password in a salted row is still a weak password.', 'do2')}${box('Salt is not secret', 'It sits next to the hash — 16 random bytes per row (NIST: ≥ 32 bits).', 'lam')}</div>`) },
  { t: 'Time to try a whole space, one salted account', body: sh(body('21-table'), { title: 'UV_THREADPOOL_SIZE=10 node demo2/crack-table.mjs', sm: true }) +
      box('Read it', 'Fast hash + GPU: 8 lower-case letters in <b>9.5 s</b>. Slow hash: the same space in <b>131 years</b> on this Mac. No hash saves the top-10k list — that is lesson 2.4’s job (a blocklist).', 'lam') },
  { t: 'Where the GPU numbers come from', body: cards([
      ['hashcat 6.2.6, one RTX 4090', 'SHA2-256 <b>21,975.5 MH/s</b> · MD5 164.1 GH/s · bcrypt 184.0 kH/s at <b>32 iterations</b> (cost 5)'],
      ['bcrypt cost 12', '4,096 iterations = 2<sup>7</sup> × more work ⇒ 184,000 / 128 ≈ <b>1,438/s</b> per card'],
      ['This Mac', 'Apple M1 Max, 10 cores, Node 22.23.3 — CPU rows measured in the run above'],
    ], 3) + box('Why the 4090 is a fair attacker', 'One consumer card, rented by the hour. A fast hash gives the attacker ~11,000× one CPU core (22 billion vs 2 million/s). A memory-hard hash makes every guess need 64 MiB, which a GPU cannot multiply as cheaply.', 'xanh') },
  { t: 'LabFlow ID v0.2: argon2id in PostgreSQL', body: sh(cut(body('21-migrate') + '\n' + OUT['21-v02-dump']), { title: 'npm run migrate && npm run seed · node demo2/dump.mjs users' }) +
      two(box('Self-describing', `${c('$argon2id$v=19$m=65536,p=1,t=2$<salt>$<hash>')}: algorithm, parameters and salt travel with the hash (lesson 2.2).`, 'lam'),
        box('Same dump, different result', 'An, Bình and Cô Lan get different strings even if they share a password. Each guess costs ~86 ms of a 64 MiB core.', 'xanh')) },
  { t: 'Trap: “we hash with SHA-256, so we’re fine”', body: two(js(`// what many tutorials still write
const hash = createHash('sha256')
  .update(salt + password).digest('hex');`, { hl: [2] }) + box('Why it fails', 'The right tool for <b>tokens</b> (256 random bits, lesson 1.3) is the wrong tool for <b>passwords</b>: a human chose them, so a list of guesses finds them.', 'do2'),
      js(`// LabFlow ID v0.2 — src/passwords/hash.js
export const hashPassword = (password) =>
  argon2.hash(normalize(password), PARAMS);
// PARAMS chosen by measurement (lesson 2.2)`, { hl: [3] })) +
      cards([
        ['Token (lesson 1.3)', '256 random bits ⇒ nothing to guess ⇒ <b>SHA-256 is right</b>'],
        ['Password', 'human-chosen ⇒ a <b>list of guesses</b> is a real attack ⇒ <b>every guess must be expensive</b>'],
        ['The test', 'can an attacker <b>enumerate</b> the input? Then the hash must be slow'],
      ], 3) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Assume the table is copied; design for <b>how slowly</b> it turns into passwords</li>
    <li>Unsalted SHA-256: 10,001 hashes crack 701/1,003 in 15 ms</li>
    <li>Salt stops tables and shared work — not a GPU at 22 billion guesses/s</li>
    <li>argon2id: ~51 guesses/s here; still, <b>123456 falls in 2 guesses</b> ⇒ lesson 2.4</li>
    <li>Next — 2.2: choose argon2id’s parameters by measuring</li></ul>` },
]);
