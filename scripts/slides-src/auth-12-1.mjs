/** auth-12-1 — Chapter 12 · 12.1 "First five minutes" (04/11/2026). Slug auth-12-1-nam-phut-dau. Output = s12/_ma.mjs. */
import { lamDeck, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s12/_ma.mjs';
const clip = (s, n = 62) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const DIAG = clip(OUT['121-diagnose'].split('\n').slice(4, 15).join('\n'), 66);
export const deck = { key: 'auth-12-1', code: 'AUTH 12.1', title: 'The first five minutes: "users cannot log in"', sub: 'Measure before you guess — the status names the layer' };
export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosis', bai: '12.1' }, [
  { cover: true, t: 'The first five minutes:<br>"users cannot log in"', sub: 'Chapter 12 · Lesson 12.1 — curl the status, name the broken layer, before reading any code' },
  { t: 'What you will take away', to: true, giua: true, body: `<ul>
    <li><b>Chapter 12</b>: diagnosis, reviewing code you did not write, and the capstone</li>
    <li>Measure before you guess — curl the login route, read the status</li>
    <li>404 = stale build · 500 = crashed dependency · 403 = authorization</li>
    <li>401 = pipe intact, try a real login · 200 = look past login</li>
    <li>One request at a time; the status names the layer</li></ul>` },
  { t: 'Measure before you guess', giua: true, body: box('The temptation: open the handler and read', 'the faster path is one measurement.', 'do2') +
      sh('curl -s -o /dev/null -w "%{http_code}" \\\n  https://id.labflow.example/api/v1/auth/login', { title: 'read the status first', sm: true }) +
      box('The status narrows the problem to a LAYER', 'in seconds, before you read a line — ruling out a layer is as valuable as finding the fault.', 'xanh') },
  { t: 'The decision tree, measured', body: sh(DIAG, { title: 'node demo12/diagnose.mjs', sm: true }) +
      box('One curl names the chapter to open', '404 = stale build, 500 = dependency, 403 = authz, 401 = pipe intact, 200 = past login.', 'lam') },
  { t: '404 and 500', giua: true, body: two(
      box('404 — the route is not mounted', 'a stale or partial build; the running image lacks the route that exists in source. Redeploy a clean build, do not edit code.', 'do2'),
      box('500 — a dependency crashed', 'a missing secret, the database or Redis down, an unhandled error. Read the server log and the startup banner (Ch11).', 'do2')) +
      box('Both are the environment, not the login code', 'the handler is probably correct — the build or a dependency is the fault. This is the "is it even live?" check from the earliest chapters.', 'lam') },
  { t: '403, 401, 200', giua: true, body: cards([
      ['403', 'AUTHORIZATION, not authentication — known but forbidden (Ch9). Do not debug the password'],
      ['401', 'the route is MOUNTED and asking for credentials — the pipe is intact, try a real login'],
      ['200', 'login works — the problem is AFTER it: the cookie, a redirect, the client'],
    ], 1) },
  { t: 'One request at a time', giua: true, body: box('Change one thing, measure, repeat', 'the failures that waste hours are the ones where you changed three things and cannot tell which did it.', 'do2') +
      box('Two cheap sources answer most questions', 'the request\'s status, and the startup banner showing which secrets loaded (Ch11).', 'xanh') +
      box('A 500 + a banner reading [MISSING] SESSION_SECRET', 'is the whole diagnosis in two lines.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Measure before you guess: curl the login route, read the status</li>
    <li>404 = stale build · 500 = dependency · 403 = authz · 401 = pipe intact · 200 = past login</li>
    <li>The status names the broken layer in seconds, before any code</li>
    <li>One change at a time; the code is usually right, the environment is the fault</li>
    <li>Next — 12.2: eight shapes of failure</li></ul>` },
]);
