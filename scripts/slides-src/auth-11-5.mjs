/** auth-11-5 — Chapter 11 · 11.5 "Signals & runbook" (04/11/2026). Slug auth-11-5-giam-sat. Output = s11/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s11/_ma.mjs';
const clip = (s, n = 62) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const TRI = clip(CODE.triage.split('\n').filter((l) => l.includes(':') && l.includes("'")).join('\n'), 60);
const OUTS = clip(OUT['115-signals'].split('\n').slice(2, 9).join('\n'), 66);
export const deck = { key: 'auth-11-5', code: 'AUTH 11.5', title: 'Six signals, and the runbook for when one fires', sub: 'Page rarely; investigate the unknown; never ignore it' };
export const slides = lamDeck({ chuong: 'Chapter 11 — Running it', bai: '11.5' }, [
  { cover: true, t: 'Six signals, and the runbook<br>for when one fires', sub: 'Chapter 11 · Lesson 11.5 — watch the right things, respond to the right ones' },
  { t: 'The six signals', giua: true, body: cards([
      ['Refresh-reuse spike', 'stolen refresh tokens replayed (Ch5) — an active session-theft campaign'],
      ['5xx spike', 'the service itself is failing — logins are down'],
      ['New-country logins', 'travel, or the start of a takeover'],
      ['Breached-password rate', 'users trying known-breached passwords — a stuffing tell (Ch10)'],
      ['Failed-login burst', 'the stuffing defence already throttled it'],
      ['Admin actions', 'expected — recorded, reviewed'],
    ], 2) + box('Each is a number with a threshold', 'not a vibe — "reuse events per minute over X", not "something feels off".', 'lam') },
  { t: 'Four actions, and the runbook', body: js(TRI, { sm: true }) +
      box('page / investigate / auto / ignore', 'the runbook routes each signal to one of four — one small function, the whole on-call policy.', 'xanh') },
  { t: 'The measured runbook', body: sh(OUTS, { title: 'node demo11/signals.mjs', sm: true }) +
      box('Most signals are not a page', 'reuse and 5xx page; new-country and breached-rate investigate; failed-burst and admin are auto — already handled.', 'lam') },
  { t: 'An unknown signal is not ignored', giua: true, body: box('triage() defaults the unknown to INVESTIGATE', 'never ignore — a new signal nobody has classified yet gets a human look, not silence, so a surprise never passes unseen.', 'xanh') +
      box('Fail toward attention', 'the one you did not plan for is exactly the one worth seeing — the default must lean toward looking, not away.', 'lam') +
      box('Only a nameless signal is ignored', 'a signal with no name is a bug in the signal pipeline itself, not a real event — the single case where silence is correct.', 'do2') },
  { t: 'Alert fatigue is the enemy', giua: true, body: box('The "yeu" runbook pages on everything', 'within a week the on-call silences the pager, and the one real alert is lost in the noise.', 'do2') +
      box('This is the Chapter 10 fatigue attack', 'aimed at your own team, and self-inflicted. Page rarely, so a page always means something.', 'do2') +
      box('A runbook that pages on routine admin', 'is as broken as one that ignores token reuse — tune for signal, not volume.', 'lam') },
  { t: 'The runbook has steps, not just a route', giua: true, body: two(
      box('Beyond page-or-not, what to DO', 'reuse ⇒ revoke the token family and force re-auth (Ch5); 5xx ⇒ check the database and the key rotation (11.2); new-country ⇒ confirm with the user and offer to revoke sessions.', 'xanh'),
      box('Every signal is an earlier chapter', 'seen from operations — running it well is knowing which defence each signal is telling you about.', 'lam')) +
      box('Monitoring without a response plan is theatre', 'a dashboard nobody is paged on, or an alert with no written next step, produces a panicked, improvised 3am. The value is the runbook, decided in daylight.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Watch six signals, each a number with a threshold</li>
    <li>Route each to page / investigate / auto / ignore</li>
    <li>Page only for a human-now (reuse spike, 5xx spike)</li>
    <li>Default the unknown to investigate, never ignore; never page on everything</li>
    <li>Next — Chapter 12: diagnosis and the capstone</li></ul>` },
]);
