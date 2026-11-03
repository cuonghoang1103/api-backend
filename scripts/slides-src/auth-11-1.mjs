/** auth-11-1 — Chapter 11 · 11.1 "Secrets" (04/11/2026). Slug auth-11-1-bi-mat. Output = s11/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s11/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const LOAD = clip(CODE.secrets.split('\n').filter((l) => !l.startsWith('//')).join('\n').replace(/\n{2,}/g, '\n').trim(), 62);
const OUTC = clip(OUT['111-secrets'].split('\n').slice(2, 9).join('\n'), 62);
export const deck = { key: 'auth-11-1', code: 'AUTH 11.1', title: 'Secrets: to the process, never the repo', sub: 'Fail fast on a missing one; log [set], never the value' };
export const slides = lamDeck({ chuong: 'Chapter 11 — Running it', bai: '11.1' }, [
  { cover: true, t: 'Secrets: getting them to the process<br>without touching the repo', sub: 'Chapter 11 · Lesson 11.1 — the environment, fail-fast, and why a committed secret is forever' },
  { t: 'What you will take away', to: true, giua: true, body: `<ul>
    <li><b>Chapter 11</b> runs the service: secrets, rotation, rate limits, audit, monitoring</li>
    <li>Secrets reach the process from the ENVIRONMENT, never the repo</li>
    <li>A missing required secret is a loud startup failure — fail fast</li>
    <li>Log which config is set ([set]), never its value</li>
    <li>A committed secret is forever on every clone — rotate it</li></ul>` },
  { t: 'The environment, not the code', giua: true, body: two(
      box('Twelve-Factor config', 'config that varies between deploys — and secrets always do — lives in the environment, not the source code.', 'xanh'),
      box('The code reads process.env', 'and holds nothing itself; the VPS .env file or a secrets manager injects the values at start.', 'lam')) +
      box('Prod lives at /opt/cuonghoangdev/.env', 'loaded on every deploy, excluded from rsync, never overwritten by a code push — so values there survive deploys.', 'lam') },
  { t: 'Fail fast on a missing secret', body: js(LOAD, { sm: true }) +
      box('A clear startup failure beats a 3am 500', 'half-configured is worse than not started: it boots, serves, then fails deep in a request where it is hard to trace.', 'do2') },
  { t: 'The banner you CAN log', body: sh(OUTC, { title: 'node demo11/secrets.mjs', sm: true }) +
      box('[set], never the value', 'the banner proves the config is complete at a glance; a naive console.log(config) would print the DB password.', 'xanh') },
  { t: 'Why the repo is forever', giua: true, body: box('A secret committed once is in the git history', 'on every clone and fork, even after you "delete" it later — the old commit still has it.', 'do2') +
      box('The only fix is to ROTATE it', 'not edit the file. .gitignore the .env; gitleaks in CI fails the build before it is pushed (Chapter 1).', 'xanh') +
      box('NEXT_PUBLIC_ is a leak too', 'a secret baked into a frontend bundle ships to every browser — keep keys server-side, behind a proxy.', 'do2') },
  { t: 'Design so a leak is a rotation', giua: true, body: two(
      box('One source of truth per secret', 'copies in CI logs, a teammate\'s .env, a Slack message are all leaks waiting to happen.', 'lam'),
      box('Assume it WILL leak someday', 'make secrets rotatable (11.2), short-lived where possible, and scoped — a read-only DB user for the read path.', 'xanh')) +
      box('A leak should be a rotation, not a rebuild', 'if replacing a secret means redeploying everything, you will hesitate when speed matters most. Design it to be a one-step swap.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Secrets reach the process from the environment, never the repo</li>
    <li>Fail fast on a missing one; a half-configured process fails worse, later</li>
    <li>Log a redacted banner — which config is set, never its value</li>
    <li>A committed secret is forever; rotate it, do not just edit the file</li>
    <li>Next — 11.2: rotating a key without logging everyone out</li></ul>` },
]);
