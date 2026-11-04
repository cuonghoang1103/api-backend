/**
 * nfd-13-1 — Networking for Developers, bài 13.1 "Dựng hệ thống" (slug netdev-13-1-dung-lab). Bài MỞ dự án CUỐI KHOÁ (Chương 13).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c131-*.out.txt) — một request đi qua client → nginx edge → api.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-13-1', code: 'NFD 13.1', title: 'Build the stack', sub: 'Networking for Developers · Chapter 13' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 13 — Capstone', bai: '13.1' }, [
  { cover: true, t: 'Capstone — build the request stack', sub: 'client → nginx edge → API —<br>then trace, tune, break and report it', nhan: 'Chapter 13 · Lesson 13.1 · Capstone' },

  { t: 'The capstone project', to: true, giua: true, body: `
<ul>
<li><b>Build</b> a realistic request path: client → an <b>nginx edge</b> (reverse proxy) → an API</li>
<li><b>Measure</b> every hop and record a <b>baseline</b> (DNS/TCP/TLS/TTFB + sizes)</li>
<li><b>Optimise</b>: compression, edge caching, keep-alive — and measure <b>before vs after</b></li>
<li><b>Break</b> it on purpose (502/504/refused) and <b>diagnose</b> with the layered method</li>
<li><b>Report</b>: a before/after table, an incident write-up, and the interview story</li>
</ul>
<p style="margin:.3em 0 0">Everything on the base lab, with real numbers — this is the whole course applied end to end.</p>` },

  { t: 'The stack you build', giua: true, body: `
${bang(['Tier', 'In the lab', 'Mirrors in production'], [
    ['Client', 'nfd-client (curl, tcpdump)', 'a browser / mobile app'],
    ['<b>Edge</b>', 'nginx (reverse proxy: gzip, cache, keep-alive)', 'Cloudflare + nginx'],
    ['API', 'Node on nfd-api', 'Express/Spring on Docker'],
    ['(behind)', '— (lab stops here)', 'PostgreSQL / Redis / R2'],
  ], { fs: 18 })}
${box('', 'The lab is a faithful miniature of a real path (cuongthai.com: Cloudflare → nginx → Docker → API → Postgres/Redis → R2). Same shape, same knobs, measurable on your machine.', 'lam')}` },

  { t: 'It runs', giua: true, body: `
${term(ra('c131-stack', 'curl', 1), { sm: true, title: 'a request through the edge reaches the API (note forwardedFor / seenOn)' })}
${steps([
    '<code class="i">:8080/api/hello</code> hit the <b>edge</b>; the edge proxied it to the <b>API</b>',
    '<code class="i">seenOn</code> is the API’s own address (<code class="i">10.10.2.20:3000</code>) — the request really reached the backend',
    'The edge added <code class="i">X-Forwarded-For</code> — it is an L7 reverse proxy, as in Chapter 10',
  ])}
${bang(['Field in the reply', 'Tells you'], [
    ['<code class="i">seenOn</code>', 'the API’s own address — the request reached the backend'],
    ['<code class="i">forwardedFor</code>', 'the client IP the edge forwarded (L7 reverse proxy)'],
    ['<code class="i">path</code>', 'the route the edge proxied to the API'],
  ], { fs: 20 })}
${box('', 'The path is live end to end — now it is something you can put a <b>stopwatch</b> (<code class="i">curl -w</code>) and a <b>packet capture</b> (<code class="i">tcpdump</code>) on. That is the whole rest of the capstone.', 'xanh')}` },

  { t: 'The capstone method', giua: true, body: `
${steps([
    '<b>Baseline</b> (13.2): measure every hop before you touch anything — you cannot improve what you did not measure',
    '<b>Optimise</b> (13.3): change one thing at a time, measure before/after, keep what helps',
    '<b>Break</b> (13.4): induce real failures and diagnose them by layer — prove you can read them',
    '<b>Report</b> (13.5): the numbers, the incident, and how you’d tell it in an interview',
  ])}
${box('', 'The discipline that makes it count: <b>measure, change one thing, measure again</b>. A tuning win you cannot show as a before/after number is just a claim.', 'do2')}` },

  { t: 'What you hand in', giua: true, body: `
${bang(['Deliverable', 'What it contains'], [
    ['Baseline table', 'DNS/TCP/TLS/TTFB/total + response size, per hop'],
    ['Before/after table', 'each optimisation with its measured effect'],
    ['Incident report', 'a broken scenario: symptom → layer → fix'],
    ['Interview story', 'the one-paragraph narration of the whole thing'],
  ], { fs: 19 })}
${box('', 'These four artefacts ARE the capstone. They turn "I know networking" into "here is a request path I measured, tuned by a measured amount, broke, diagnosed, and can explain."', 'lam')}` },

  { t: 'Completion checklist', giua: true, body: `
${steps([
    '☐ The stack is up and a request reaches the API through the edge',
    '☐ A baseline exists (every hop measured, numbers recorded)',
    '☐ At least two optimisations shown as <b>before/after</b> numbers (e.g. compression, cache)',
    '☐ At least two failures (e.g. 504, 502) induced and diagnosed to the right layer',
    '☐ A one-paragraph interview story that cites your own numbers',
  ])}` },

  { t: 'A real stack it mirrors', giua: true, body: `
${box('', 'cuongthai.com: <b>Cloudflare</b> (DNS + CDN + TLS) → <b>nginx</b> (reverse proxy, cache, gzip, HTTP/2) → <b>Docker</b> → <b>Express/Spring</b> → <b>PostgreSQL / Redis</b> → <b>R2</b>. Every layer in this course appears once. Your lab stack is the same path at small scale — which is exactly why the tuning and the failures transfer.', 'lam')}
${steps([
    'The edge choices (cache, gzip, keep-alive, timeouts) are the ones that move real numbers',
    'The failures (502/504/524) are the ones a real on-call engineer reads',
    'The method (baseline → tune → break → report) is how real performance work is done',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>The capstone builds a real request path — <b>client → nginx edge → API</b> — and makes it measurable</li>
<li>Method: <b>baseline → optimise (before/after) → break & diagnose → report</b></li>
<li>Deliverables: a baseline table, a before/after table, an incident report, and an interview story</li>
<li>It mirrors a production stack (Cloudflare → nginx → Docker → API → PG/Redis → R2) at small scale</li>
<li>The rule: <b>measure, change one thing, measure again</b> — a win you can’t show as a number is a claim</li>
</ul>
<p style="margin:0">${kw('edge / reverse proxy', 'biên')} ${kw('baseline', 'mốc nền')} ${kw('before/after', 'trước/sau')} ${kw('incident report', 'báo cáo sự cố')} ${kw('capstone', 'dự án cuối')}</p>` },
]);
