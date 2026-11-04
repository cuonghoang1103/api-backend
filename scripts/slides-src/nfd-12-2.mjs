/**
 * nfd-12-2 — Networking for Developers, bài 12.2 "Vòng tình huống: chẩn đoán từ một triệu chứng" (slug netdev-12-2-tinh-huong).
 * Output = TÁI DÙNG c114-checklist (bảng kiểm theo tầng, Ch11) làm bằng chứng cho phương pháp.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-12-2', code: 'NFD 12.2', title: 'Scenario rounds: diagnose from a symptom', sub: 'Networking for Developers · Chapter 12' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 12 — Interviews', bai: '12.2' }, [
  { cover: true, t: 'Scenario rounds: diagnose from a symptom', sub: 'Symptom → hypothesis → measurement → conclusion —<br>the method that impresses', nhan: 'Chapter 12 · Lesson 12.2' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>The <b>scenario round</b>: an interviewer gives a symptom; you diagnose out loud</li>
<li>A repeatable frame: <b>symptom → hypothesis → measurement → conclusion</b></li>
<li>Three classic scenarios worked through with the layered method</li>
<li>How to <b>narrate</b> a diagnosis so it sounds like experience, not guessing</li>
<li>The one move that wins: name the <b>measurement</b> that would confirm each hypothesis</li>
</ul>` },

  { t: 'The frame', giua: true, body: `
${steps([
    '<b>Symptom</b> — restate it precisely (who, where, when, how often)',
    '<b>Hypotheses</b> — list a few, ordered by likelihood, across the layers',
    '<b>Measurement</b> — name the ONE command that confirms or kills each hypothesis',
    '<b>Conclusion</b> — the layer, and the fix; say what you would do next',
  ])}
${box('', 'The interviewer is testing <b>method</b>, not trivia. A candidate who says "I’d run <code class="i">curl -w</code> from both regions and compare" beats one who guesses "probably the CDN" every time.', 'lam')}` },

  { t: 'Scenario: "slow only in one region"', giua: true, body: `
${bang(['Hypothesis', 'Measurement'], [
    ['far from the origin (latency)', '<code class="i">curl -w</code> / <code class="i">ping</code> from that region vs others'],
    ['CDN missing/misconfigured there', '<code class="i">curl -I</code> → <code class="i">cf-cache-status</code>, check the PoP'],
    ['a bad network hop / peering', '<code class="i">mtr</code> from the slow region'],
  ], { fs: 19 })}
${box('', 'Conclusion pattern: "if <code class="i">curl -w</code> shows a big <code class="i">time_connect</code> only there, it’s distance/path; if TTFB is high everywhere, it’s the origin, not the region." You localise before you blame.', 'lam')}` },

  { t: 'Scenario: "API times out every evening"', giua: true, body: `
${bang(['Hypothesis', 'Measurement'], [
    ['load spike exhausts the pool', 'connection/pool metrics at peak; <code class="i">ss -s</code>'],
    ['a slow query under load', 'DB slow log; TTFB (<code class="i">curl -w</code>) rising with load'],
    ['the LB hits a read timeout → 504', 'the status code: <b>504</b> says too slow, not down'],
  ], { fs: 19 })}
${box('', '"Every evening" = correlated with <b>load</b>. The move: read the <b>status code</b> (504 vs 502 vs 503) to tell slow from broken from no-capacity, then measure TTFB vs load. Time-of-day is a clue, not a cause.', 'lam')}` },

  { t: 'Scenario: "only old Android gets cert errors"', giua: true, body: `
${term(ra('c114-checklist', 'openssl', 1), { sm: true, title: 'read the cert chain and dates with openssl s_client' })}
${box('', '"Only <b>old</b> clients" points at <b>trust</b>, not a down cert: a missing <b>intermediate</b> certificate (modern clients fetch it, old ones don’t) or an expired <b>root</b> in the old trust store. The measurement: <code class="i">openssl s_client</code> to see the chain the server actually sends, and test with an old client profile. A subset of clients failing = a trust/chain issue, almost never "the server is down."', 'do2')}` },

  { t: 'Narrate it like an engineer', giua: true, body: `
${steps([
    'Say the <b>hypotheses</b> out loud, ordered — show you think in layers, not hunches',
    'For each, name the <b>one measurement</b> that would confirm or rule it out',
    'State what the result would <b>mean</b> ("504 → the backend is slow, not missing")',
    'End with the <b>fix</b> and a way to prevent recurrence',
  ])}
${box('', 'You are not expected to know the answer from the symptom — you are expected to have a <b>method</b> that reaches it. Narrate the method and you have already passed.', 'xanh')}` },

  { t: 'The checklist is your backbone', giua: true, body: `
${box('', 'Every scenario reduces to the Chapter 11 checklist: <b>DNS → routing → port → TLS → HTTP → app</b>, one command each, stopping at the first that fails. "Slow in one region" tests the path; "evening timeouts" tests HTTP/app under load; "old-client cert errors" tests TLS. Same backbone, different entry point.', 'lam')}
${term(ra('c114-checklist', 'nc -zv', 1), { sm: true, title: 'e.g. the port layer — open vs refused, in one line' })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Scenario rounds test your <b>method</b>: symptom → hypotheses → the measurement that confirms each → conclusion</li>
<li>"Slow in one region" → localise with <code class="i">curl -w</code>/<code class="i">ping</code>/<code class="i">mtr</code> (path vs origin)</li>
<li>"Evening timeouts" → correlate with load; read the <b>status code</b> (504 slow / 503 no capacity)</li>
<li>"Only old clients fail TLS" → a trust/chain issue (missing intermediate), read it with <code class="i">openssl s_client</code></li>
<li><b>Narrate</b> the hypotheses and the confirming measurement — the method is the answer</li>
</ul>
<p style="margin:0">${kw('symptom→hypothesis', 'triệu chứng→giả thuyết')} ${kw('measurement', 'phép đo')} ${kw('curl -w / mtr', 'định vị')} ${kw('status code', 'đọc mã')} ${kw('openssl s_client', 'chuỗi cert')}</p>` },
]);
