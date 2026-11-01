/**
 * auth-00-9 — Authentication · Section 0 · Start here (2/2) "Real incidents, and how to study this course" (01/11/2026).
 * Slug bài: auth-0-9-bat-dau-su-co. Sự cố kiểm nguồn 01/11/2026; output = _ma.mjs của s00 (Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, steps, cards, c, flow } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s00/_ma.mjs';

export const deck = { key: 'auth-00-9', code: 'AUTH 0.9', title: 'Start here (2/2)', sub: 'Real incidents, and how to study this course' };

export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a setup that runs', bai: 'Start 2/2' }, [
  { cover: true, t: 'Start here (2/2):<br>when authentication goes wrong', sub: 'Seven real incidents, one replay on your laptop, and a study plan you can keep' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Seven real incidents — root cause and source, one sentence each</li>
    <li>Why “we hashed the passwords” failed in 2012, replayed in 11.8 ms</li>
    <li>The pattern: credentials stored, logged or trusted carelessly</li>
    <li>A minimum and a full path through the course</li>
    <li>The rhythm of one study session</li></ul>` },
  { t: 'Incidents (1/2): how credentials were stored and logged', body: `<table class="t">
    <tr><th>Incident</th><th>What went wrong</th><th>Prevented in</th></tr>
    <tr><td><b>RockYou</b> · Dec 2009</td><td>32 million+ passwords in <b>plaintext</b></td><td>Ch2</td></tr>
    <tr><td><b>LinkedIn</b> · Jun 2012</td><td>~6.5 million <b>unsalted SHA-1</b> hashes; 100 million more in 2016</td><td>Ch2</td></tr>
    <tr><td><b>Facebook</b> · reported Mar 2019</td><td>200–600 million passwords in <b>internal logs</b>, 20,000+ employees could search them</td><td>1.5</td></tr></table>` +
      box('None of them broke cryptography', 'The passwords were readable because of how they were <b>stored</b> or <b>logged</b> — choices a developer made.', 'do2') },
  { t: 'Incidents (2/2): tokens, keys and missing factors', body: `<table class="t">
    <tr><th>Incident</th><th>What went wrong</th><th>Prevented in</th></tr>
    <tr><td><b>Storm-0558</b> · 2023</td><td>a stolen <b>signing key</b> forged email tokens; a consumer key was accepted for enterprise</td><td>1.4, Ch4</td></tr>
    <tr><td><b>Okta support</b> · Sep–Oct 2023</td><td><b>session tokens</b> inside HAR files; 5 customers hijacked</td><td>1.1, Ch3</td></tr>
    <tr><td><b>23andMe</b> · Oct 2023</td><td><b>credential stuffing</b>, reused passwords; ~6.9 million people</td><td>Ch2, Ch10</td></tr>
    <tr><td><b>Snowflake customers</b> · 2024</td><td>infostealer passwords, <b>no MFA</b>; ~165 organisations</td><td>Ch7</td></tr></table>` },
  { t: 'The pattern: a credential’s life', body: flow([
      { t: 'Created', s: 'weak, reused' },
      { t: 'Stored', s: 'plaintext, fast hash', mau: '#b85a2b' },
      { t: 'Logged', s: 'logs, HAR files', mau: '#c0392b' },
      { t: 'Signed', s: 'over-trusted key', mau: '#7a3d12' },
      { t: 'Used alone', s: 'no 2nd factor', mau: '#2f7d4f' },
    ], { w: 900, h: 190, fs: 20 }) + cards([
      ['Ch2 · Ch10', 'RockYou list, LinkedIn hashes, 23andMe stuffing'],
      ['1.1 · 1.5 · Ch3', 'Facebook logs, Okta HAR files'],
      ['1.4 · Ch4 · Ch7', 'Storm-0558 key, Snowflake without MFA'],
    ], 3) },
  { t: 'Replay LinkedIn 2012 on your laptop', body: js(`const sha1 = (s) => createHash('sha1').update(s).digest('hex');
const leaked = { an: sha1('an-lab-2026'), binh: sha1('123456'), … };
const list = readFileSync('wordlists/10k-most-common.txt', 'utf8')…;
const table = new Map(list.map((p) => [sha1(p), p]));  // ONCE
for (const [user, h] of Object.entries(leaked)) table.has(h) …`, { sm: true, hl: [4] }) +
      sh(OUT['09-linkedin'], { title: 'node demo0/linkedin-replay.mjs' }) +
      box('Unsalted = one table cracks everyone', 'Same password ⇒ same hash, on every site. Built once in 11.8 ms; reusable forever.', 'do2') },
  { t: 'Add a salt: the table dies, targeted guessing does not', body: js(`const salt = randomBytes(16).toString('hex');
const binh = { salt, hash: sha1(salt + '123456') };
table.has(binh.hash);                    // false
list.findIndex((p) =>
  sha1(binh.salt + p) === binh.hash);   // guess 2`, { sm: true }) +
      sh(OUT['09-thuc-hanh'], { title: 'node demo0/th09.mjs' }) +
      cards([
        ['Salt', 'stops <b>one</b> computation from cracking <b>everyone</b>'],
        ['Still fast', 'SHA-1 of one guess costs nanoseconds — 0.26 ms for Bình'],
        ['Chapter 2', 'a deliberately <b>slow</b> hash (argon2id) + reject 123456'],
      ], 3) },
  { t: 'A scenario you may recognise (illustration)', body: steps([
      `SWP391 team, three weeks: passwords stored as typed — <i>“we will hash them later”</i> → <b>Ch2</b>`,
      'The database exported to a shared drive “so everyone can test”',
      `A failing request — ${c('x-session')} token included — pasted into the team chat → <b>1.5</b>`,
      'Sessions never expire, so that token still works next month → <b>Ch3</b>',
      'Demo day: the lecturer opens the export — every classmate’s password',
    ]) + box('Nobody attacked anything', 'Every step was a shortcut. Each shortcut is a lesson in this course.', 'do2') },
  { t: 'Two paths through the course', body: `<table class="t">
    <tr><th></th><th>Minimum (~4 weeks)</th><th>Full (~10 weeks)</th></tr>
    <tr><td>Read</td><td>0, 1, 2, 3, 4, 5, 9</td><td>all 13 sections</td></tr>
    <tr><td>Do</td><td>every Practice · Labs 1, 2, 3, 5</td><td>every Practice, Lab and Code Lab set</td></tr>
    <tr><td>Check</td><td>chapter quiz ≥ 7/10</td><td>quiz + Lab grader ≥ 7/10 · final project</td></tr>
    <tr><td>Enough for</td><td>a correct login in SWP391</td><td>a production identity service + interview stories</td></tr></table>` },
  { t: 'One study session, about 90 minutes', body: steps([
      '<b>10 min — slides</b> and the short explanation under each',
      '<b>40 min — the written lesson</b>, terminal open: run every command, compare with our output',
      '<b>25 min — 🧪 Practice</b>: try first, then read the solution; stop at “Done when”',
      '<b>15 min — Code Lab</b>: the 🏋️ button under the lesson, aim for Accepted',
    ]) + two(box('One lesson per session', 'Never two. Stuck for two sessions? Skip the last section, return after the quiz.', 'xanh'),
      box('Different output?', 'Different numbers are normal; a different <b>shape</b> is the best moment of the lesson — find out why.', 'lam')) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Seven incidents, one pattern: careless storage, logs, tokens, keys</li>
    <li>Unsalted SHA-1: 10,001 hashes in 11.8 ms, ${c('123456')} found instantly</li>
    <li>Salt kills the table, not targeted guessing — slow hashing is Chapter 2</li>
    <li>Pick a path; one lesson per session</li>
    <li>Next — 0.1: a protocol that forgets everything</li></ul>` },
]);
