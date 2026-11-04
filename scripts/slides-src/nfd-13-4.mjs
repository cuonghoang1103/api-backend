/**
 * nfd-13-4 — Networking for Developers, bài 13.4 "Cố tình làm hỏng rồi chẩn đoán" (slug netdev-13-4-co-y-lam-hong). Capstone.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c134-*.out.txt) — 504 (upstream chậm), 502 (upstream chết), cổng refused.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-13-4', code: 'NFD 13.4', title: 'Break it on purpose and diagnose', sub: 'Networking for Developers · Chapter 13' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 13 — Capstone', bai: '13.4' }, [
  { cover: true, t: 'Break it on purpose and diagnose', sub: 'Induce real failures, read them by layer,<br>and write the incident report', nhan: 'Chapter 13 · Lesson 13.4 · Capstone' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>Why you <b>break your own stack</b>: to learn to read failures before production teaches you</li>
<li>Induced failures on the capstone: <b>504</b> (slow upstream), <b>502</b> (dead upstream), <b>refused</b> (closed port)</li>
<li>Diagnosing each to a <b>layer</b> with the Chapter 11 method</li>
<li>Other failure modes to reason about: wrong DNS, a missing intermediate cert, blocked UDP 443</li>
<li>Writing an <b>incident report</b>: symptom → layer → fix</li>
</ul>` },

  { t: 'Break your own stack first', giua: true, body: `
${box('Key idea', 'Every failure you induce on purpose, in a safe lab, is one you will <b>recognise instantly</b> in production. The on-call engineer who has <i>seen</i> a 504 from a slow upstream reads it in seconds; the one who hasn’t guesses for an hour.', 'lam')}
${steps([
    'Induce a failure with a known cause',
    'Observe the symptom (the status code, the capture)',
    'Diagnose it by layer — and confirm it matches the cause you injected',
  ])}` },

  { t: 'Induced failures on the stack', body: `
${term(ra('c134-break', 'echo "== break', 3), { sm: true, title: 'slow upstream → 504 ; dead upstream → 502' })}
${box('', 'A slow backend (3 s) behind a 1 s edge timeout yields <b>504</b> (too slow). A dead upstream (a port nobody listens on) yields <b>502</b> (the edge connected to nothing). Same edge, two backend problems, two codes — exactly as Chapter 10 said. The code names the failure before you open a log.', 'do2')}` },

  { t: 'Diagnose by layer', giua: true, body: `
${term(ra('c134-break', 'echo "== diagnose', 2), { sm: true, title: 'the port layer: 8080 open, 8099 refused' })}
${box('', 'The layered checklist (Chapter 11) pins each failure: <code class="i">nc -zv</code> answers the <b>port</b> layer (open vs refused), <code class="i">curl -I</code> the <b>HTTP</b> layer (the code), <code class="i">openssl s_client</code> the <b>TLS</b> layer. A 502 says "port open, but the upstream behind it is broken"; a refused says "nothing is listening" — different layers, different fixes.', 'xanh')}` },

  { t: 'More failures to reason about', giua: true, body: `
${bang(['Inject', 'Symptom', 'Layer / fix'], [
    ['a wrong DNS record', 'connects to the wrong IP / NXDOMAIN', 'DNS — <code class="i">dig</code>, fix the record'],
    ['remove the intermediate cert', 'old clients fail TLS', 'TLS — send the full chain'],
    ['block UDP 443', 'HTTP/3 fails, falls back to TCP', 'transport — allow UDP or accept h2'],
    ['a slow DB query', 'ttfb climbs under load → 504', 'app — fix the query / add capacity'],
  ], { fs: 18 })}
${box('', 'The lab runs the 502/504/refused live; the others are described — but each reduces to the same move: a symptom, the one measurement that pins the layer, and the fix for that layer.', 'lam')}` },

  { t: 'Write the incident report', giua: true, body: `
${steps([
    '<b>Symptom</b> — what the user/monitor saw (the code, the time, the scope)',
    '<b>Diagnosis</b> — the layer, and the measurement that proved it',
    '<b>Fix</b> — what changed, and how you verified recovery',
    '<b>Prevention</b> — the alert/timeout/health-check that catches it next time',
  ])}
${box('', 'An incident report is the written form of the whole method. "504 for big accounts at peak → edge read-timeout hit a slow report query (TTFB 3× under load) → moved the report to a background job + poll → verified p99 under the timeout; added a TTFB alert." That paragraph is a hireable story.', 'xanh')}` },

  { t: 'Chaos is a skill', giua: true, body: `
${box('', 'Deliberately breaking a system to learn how it fails has a name — <b>chaos engineering</b> — and it is how resilient teams build confidence. You are doing a small version: inject a failure, confirm you can <b>detect and diagnose</b> it, and make sure a <b>health check / alert / timeout</b> would catch it in production.', 'lam')}
${steps([
    'A failure you have induced and diagnosed is no longer scary — it is a known shape',
    'Each one you practise shortens a future incident from an hour to minutes',
    'The capstone proof: at least two induced failures, each diagnosed to the right layer',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>Break your own stack</b> in a safe lab so you recognise the failure instantly in production</li>
<li>Induced live: <b>504</b> (slow upstream), <b>502</b> (dead upstream), <b>refused</b> (closed port)</li>
<li><b>Diagnose by layer</b>: <code class="i">nc -zv</code> (port), <code class="i">curl -I</code> (HTTP), <code class="i">openssl</code> (TLS) — the code/measurement names it</li>
<li>Reason about the rest: wrong DNS, a missing intermediate, blocked UDP 443, a slow query</li>
<li>Write the <b>incident report</b> (symptom → layer → fix → prevention) — the hireable story</li>
</ul>
<p style="margin:0">${kw('504 / 502 / refused', 'lỗi gây ra')} ${kw('diagnose by layer', 'chẩn đoán theo tầng')} ${kw('incident report', 'báo cáo sự cố')} ${kw('chaos engineering', 'kỹ thuật hỗn loạn')}</p>` },
]);
