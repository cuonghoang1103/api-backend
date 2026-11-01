/**
 * auth-02-5 — Authentication · Chapter 2 · Lesson 2.5 "Moving off an old hash, without a reset" (01/11/2026).
 * Slug bài: auth-2-5-chuyen-doi. Output = s02/_ma.mjs (demo2/legacy.mjs trên PostgreSQL 17.11, UV_THREADPOOL_SIZE=10, env -i).
 */
import { lamDeck, js, sh, two, box, cards, steps, flow, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s02/_ma.mjs';

export const deck = { key: 'auth-02-5', code: 'AUTH 2.5', title: 'Moving off an old hash, without a reset', sub: 'Old parameters, bcrypt, and unsalted MD5' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const H = CODE.hash.split('\n');
const VERIFY = H.slice(H.findIndex((l) => l.startsWith('export async function verifyPassword')), H.findIndex((l) => l.startsWith('/** lesson 2.5: wrap'))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/\n\s*\n/g, '\n').trim();

export const slides = lamDeck({ chuong: 'Chapter 2 — Passwords', bai: '2.5' }, [
  { cover: true, t: 'Moving off an old hash,<br>without a reset', sub: 'Chapter 2 · Lesson 2.5 — old parameters, bcrypt, and unsalted MD5' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The three situations every migration falls into</li>
    <li>Rehash on login — the only moment you hold the plain password</li>
    <li><b>Wrapping</b>: protect 1,003 MD5 rows today, without knowing one password</li>
    <li>Ashley Madison 2015: the column they forgot to remove</li>
    <li>How long it takes at scale, and what to do with the long tail</li></ul>` },
  { t: 'Changing the locks of a whole building', body: cards([
      ['Old locks', 'every flat has a lock any locksmith opens in seconds — the MD5 table'],
      ['Wait for tenants?', 'replace each lock when its tenant next visits: some never come back, their door stays weak for years'],
      ['Better', 'put a <b>strong outer door</b> on every flat today; swap the inner lock when the tenant comes'],
    ], 3) + box('That is wrapping', c('argon2id(md5(password))') + ' for every row now; plain ' + c('argon2id(password)') + ' when the user next signs in.', 'xanh') },
  { t: 'Three situations', body: `<table class="t"><tr><th>Stored today</th><th>Danger</th><th>Do</th></tr>
    <tr><td>argon2id, older parameters (m=19 MiB)</td><td>low</td><td><b>rehash on login</b> (${c('needsRehash')})</td></tr>
    <tr><td>bcrypt cost 10, another sound algorithm</td><td>low–medium</td><td>verify by prefix, <b>rehash on login</b></td></tr>
    <tr><td>MD5 / SHA-1 / SHA-256, unsalted</td><td><b>high</b> — 701 of 1,003 crack in 4 ms</td><td><b>wrap every row now</b>, unwrap on login</td></tr></table>` +
    box('One rule for all three', 'The stored string says what it is (lesson 2.2). ' + c('verifyPassword') + ' dispatches on the prefix and answers ' + c('{ ok, rehash }') + '.', 'lam') },
  { t: 'Wrapping, step by step', body: flow([
      { t: 'md5 hex', s: 'from the old table', mau: '#c62828' },
      { t: 'argon2id(md5)', s: 'same PARAMS as everyone' },
      { t: '$md5-argon2id$…', s: 'old column ⇒ NULL' },
      { t: 'sign-in', s: 'verify md5(pw) ⇒ rehash', mau: '#2e7d32' },
    ]) + js(`// demo2/legacy.mjs — step 1, for every row, in ONE update
UPDATE legacy_users SET password_hash = $2, pass_md5 = NULL WHERE id = $1
//            $2 = await wrapLegacyMd5(row.pass_md5)`, { sm: true }) +
    box('No password needed', 'MD5 hex is just a 32-character string: hash it like a password. The attacker now needs argon2id <b>per guess</b> again.', 'xanh') +
      cards([
        ['Same cost as everyone', 'wrapped rows verify in ~86 ms, like real argon2id rows — no timing tell'],
        ['A new prefix', c('$md5-argon2id$') + ' tells verify to md5 the input first'],
        ['OWASP calls it', '“layering”: upgrade now, replace with a direct hash at next login'],
      ], 3) },
  { t: '1,003 legacy rows, migrated for real', body: sh(body('25-legacy'), { title: 'UV_THREADPOOL_SIZE=10 node demo2/legacy.mjs', sm: true }) +
      cards([
        ['Before', '701 of 1,003 MD5 rows crack in <b>4 ms</b>'],
        ['Wrap', '<b>17.1 s</b> for all 1,003 rows on 10 threads; md5_left = 0'],
        ['An signs in', c('{ ok: true, rehash: true }') + ' ⇒ 1 plain argon2id, 1,002 wrapped'],
      ], 3) },
  { t: 'verifyPassword dispatches on the prefix', body: js(VERIFY, { sm: true, hl: [4, 5, 6, 7, 8] }) +
      box('rehash = ok && needsRehash', 'Only after a <b>correct</b> password — a wrong one never rewrites the row (Lab 2, T5).', 'lam') },
  { t: 'Ashley Madison, 2015: the column they kept', body: cards([
      ['What they did right', 'passwords in <b>bcrypt cost 12</b> (4,096 rounds)'],
      ['What stayed', 'a ' + c('$loginkey') + ' = MD5 of username + password (lower-cased) for accounts created or changed before June 2012'],
      ['Result', 'CynoSure Prime cracked <b>over 11 million</b> passwords in days — through the MD5, not the bcrypt'],
    ], 3) + box('Lesson', 'A migration is finished when the <b>old value is gone</b>: column, backup, log, cache. Wrapping + ' + c('pass_md5 = NULL') + ' in the same UPDATE.', 'do2') },
  { t: 'Trap: “we’ll upgrade on login, that’s enough”', body: two(steps([
      'Rows of users who never sign in stay MD5 — for years',
      'Those rows answer in µs, wrapped/argon2 rows in ~86 ms: the clock tells who has not signed in since (lesson 2.3)',
      'The next dump contains them, crackable at 164 billion MD5/s per GPU',
    ]), box('Lazy-only is right for', 'situations 1 and 2 (old params, bcrypt) — the rows are already slow. For broken hashes: <b>wrap first</b>, then lazy.', 'xanh')) },
  { t: 'At scale: batches, not one transaction', body: two(steps([
      'Measured: 1,003 rows / 17.1 s ≈ <b>59 rows/s</b> on 10 threads',
      '1,000,000 rows ⇒ ≈ <b>4.7 hours</b> — a background job, not a migration file',
      'Batches of 1,000, ' + c('WHERE pass_md5 IS NOT NULL') + ' ⇒ restartable',
      'Sign-in works throughout: it understands both shapes',
    ]), box('Keep the server responsive', 'Run the job in a separate process with its own thread pool, or at night. Never in the request path.', 'lam')) },
  { t: 'The long tail', body: cards([
      ['After the wrap', 'every row is argon2id-protected: there is no urgency left'],
      ['Months later', 'count ' + c("password_hash LIKE '$md5-argon2id$%'") + ' — those users have not signed in since'],
      ['Policy', 'keep them wrapped, or expire them and send a reset link on their next visit (Chapter 6)'],
    ], 3) + box('Also destroy', 'old backups and exports that still contain the MD5 column — a wrapped row plus an old MD5 dump is as weak as the MD5.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Old params or bcrypt ⇒ <b>rehash on login</b>, only after a correct password</li>
    <li>Unsalted fast hash ⇒ <b>wrap every row now</b> (17.1 s / 1,003 rows here), unwrap on login</li>
    <li>Remove the old value in the same UPDATE — Ashley Madison lost 11 M passwords to a leftover MD5</li>
    <li>At scale: restartable batches, ≈ 59 rows/s on 10 threads</li>
    <li>Next — Lab 2: build and defend LabFlow ID’s password module</li></ul>` },
]);
