/** Web Foundations · deck bài 7.4 — Lưu mật khẩu. Output thật: _demo/_t7/mat-khau.mjs (Node + bcryptjs). */
import { deckWf, js, term, box, two, tbl, OUT } from './_wf-bai.mjs';

const dong = (key, a, b) => OUT[key].split('\n').slice(a - 1, b).join('\n');

export const deck = { key: 'wf-7-4', code: 'WF 7.4', title: 'Storing passwords', sub: 'Web Foundations · Chapter 7' };

export const slides = deckWf({ chuong: 'Chapter 7 — Authentication & security', bai: '7.4' }, [
  { cover: true, t: 'Storing passwords', sub: 'Hashing, salting, and why slow is good' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain <b>hash</b> vs <b>encryption</b></li>
    <li>Crack an <b>unsalted</b> table — and stop it</li>
    <li>Explain what a <b>salt</b> changes</li>
    <li>Compare <b>SHA-256</b> and <b>bcrypt</b> with real numbers</li>
    <li>Write <b>store</b> and <b>check</b> correctly</li></ul>` },

  { t: 'Hash, not encryption', to: true, giua: true, body: tbl(['Stored as', 'After a leak'], [
      ['plain text', 'every password, instantly'],
      ['encrypted', 'every password, once the key is found'],
      ['fast hash', 'common ones instantly, rest at GPU speed'],
      ['slow hash + salt', 'only weak ones, slowly, one by one'],
    ]) + box('Login', 'hash what was typed the same way, compare the hashes. The original is never needed.', 'ok') },

  { t: 'Unsalted hashes fall to a table', giua: true, body: js('_t7/mat-khau.mjs', null, { gon: true, chi: [18, 21] }) + term(null, dong('_t7/out/mat-khau', 1, 7), { title: 'node mat-khau.mjs' }) },

  { t: 'A salt per user', giua: true, body: term(null, dong('_t7/out/mat-khau', 9, 11), { title: 'same password, different hashes' }) + two(box('Salt', 'random, per user, stored next to the hash — not secret. Precomputed tables become useless.', 'ok'), box('Not enough alone', 'a salted SHA-256 is still ~1.9 million guesses per second per account.', 'bad')) },

  { t: 'Fast is bad here', giua: true, body: term(null, dong('_t7/out/mat-khau', 13, 17), { title: 'one laptop core' }) + tbl(['10,000 guesses for one account', 'time'], [['SHA-256 + salt', '≈ 5 ms'], ['bcrypt cost 10', '≈ 12.5 min'], ['bcrypt cost 12', '≈ 46 min']]) },

  { t: 'Inside a bcrypt hash', giua: true, body: term(null, dong('_t7/out/mat-khau', 19, 24), { title: 'bcryptjs' }) + tbl(['Part', 'Meaning'], [['$2a$', 'algorithm'], ['10$', 'cost: 2^10 rounds'], ['22 chars', 'salt'], ['31 chars', 'hash']]) },

  { t: 'Store and check', giua: true, body: js('_t7/app.mjs', null, { gon: true, chi: [5, 14] }) + two(box('Do', 'random salt · slow hash · timingSafeEqual · same 401 message', 'ok'), box('Never', 'log req.body · email the password · force Password1! rules', 'bad')) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Assume the database leaks</li>
    <li>Hash + random salt per user</li>
    <li>bcrypt / scrypt / Argon2, tuned cost</li>
    <li>Never log passwords</li></ul>`,
    box('Practice (35 min)', 'Crack a small unsalted table, re-hash with salts and bcrypt, time the attack again, write register/login.<br><br><b>Done when</b>: salted table uncracked; 8 bcrypt guesses take &gt; 0.5 s.', 'ok')) },
]);
