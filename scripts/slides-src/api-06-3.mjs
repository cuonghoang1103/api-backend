/**
 * api-06-3 — API Design · Chapter 6 · Lesson 6.3 "OWASP API Security Top 10" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s06-bao-mat.mjs › api-6-3-owasp-api. Output = chạy thật audit.mjs (LABFLOW_VULN=1 và bản đã vá).
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 6 — Security for APIs', bai: '6.3' };

export const deck = { key: 'api-06-3', code: 'API 6.3', title: 'OWASP API Security Top 10', sub: 'Ten risks on LabFlow, as an automatic audit' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'OWASP API<br>Security Top 10', sub: 'The 2023 edition (current on 1 Nov 2026) —<br>mapped onto LabFlow and run as a script.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The ten risks of the 2023 list, each on LabFlow</li>
<li>Two new defences: a booking cap (API6) and <code class="i">safeFetch</code> (API7)</li>
<li>An automatic audit: <b>9 FAIL</b> vulnerable, all PASS fixed</li>
<li>Why one hole opened two more</li>
<li>How to answer “name the OWASP API Top 10” with examples you built</li>
</ul>` },

  { t: 'The ten, on LabFlow', body: `
<table class="t" style="font-size:16.5px">
<tr><th>Risk</th><th>Looks like</th><th>LabFlow’s defence</th></tr>
<tr><td>API1 Broken Object Level Authorization</td><td>Bin reads An’s receipt</td><td>policy + 404 (6.2)</td></tr>
<tr><td>API2 Broken Authentication</td><td>forged tokens, guessing</td><td>signed JWT, expiry, login limit (6.1)</td></tr>
<tr><td>API3 Broken Object Property Level Authorization</td><td>sending <code class="i">role</code> in a PATCH</td><td>strict schemas, views (2.2, 2.3)</td></tr>
<tr><td>API4 Unrestricted Resource Consumption</td><td>huge limits, bodies, floods</td><td>max 100, 10 KB, rate limits</td></tr>
<tr><td>API5 Broken Function Level Authorization</td><td>student calls a manager operation</td><td><code class="i">requireRole</code>, policies</td></tr>
<tr><td>API6 Unrestricted Access to Sensitive Business Flows</td><td>a bot books every slot</td><td>max 3 active bookings (<b>new</b>)</td></tr>
<tr><td>API7 Server Side Request Forgery</td><td>server fetches the client’s URL</td><td><code class="i">safeFetch</code> (<b>new</b>)</td></tr>
<tr><td>API8 Security Misconfiguration</td><td>stack traces, CORS *</td><td>problem+json, CORS list (6.4)</td></tr>
<tr><td>API9 Improper Inventory Management</td><td>forgotten old versions</td><td>Deprecation/Sunset (4.2, 4.3)</td></tr>
<tr><td>API10 Unsafe Consumption of APIs</td><td>trusting third-party data</td><td>none yet; validate like input</td></tr>
</table>
${box('Read the right column', 'API3, 4, 5, 8, 9 were closed by ordinary design in Chapters 1–5; 6.1 and 6.2 closed API1 and API2. This lesson adds API6 and API7, then checks all ten.', 'xanh')}` },

  { t: 'API6: a business flow needs a limit', to: true, body: sql(`// routes/bookings.js — a student holds at most 3 active bookings
export const MAX_ACTIVE = 3;
    if (req.user.role === 'STUDENT') {
      const active = bookings.filter((b) => b.userId === req.user.id
        && b.status !== 'CANCELLED' && Date.parse(b.endAt) > now()).length;
      if (active >= MAX_ACTIVE)
        throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: MAX_ACTIVE });
    }`, { lang: 'javascript', hl: [6, 7] }) + two(box('Rate limits are not enough', '5.3 counts requests per minute. A script that books one Monday slot per minute takes the whole semester anyway.', 'do2'), box('State, not speed', 'The rule is about how many bookings someone <b>holds</b> — a business decision, written in code.', 'xanh')) },

  { t: 'API7: SSRF', body: two(http(`# guard OFF (LABFLOW_VULN=1)
$ curl -s -X POST …/v2/devices/dev_1/manual -H "…lan.jwt…" --json '{"url":"http://127.0.0.1:4000/health"}' | jq -c .
{"id":"dev_1","manualUrl":"http://127.0.0.1:4000/health","probe":{"status":200,"contentType":"application/json; charset=utf-8","bytes":20}}

$ … --json '{"url":"https://169.254.169.254/latest/meta-data/"}' | jq -c …
{"status":500,"code":"INTERNAL","detail":"Something went wrong on our side, try again later"}

# guard ON
$ … --json '{"url":"http://127.0.0.1:4000/health"}' | jq -c .
{…,"status":422,"detail":"This URL cannot be fetched (https only)",…,"code":"URL_NOT_ALLOWED"}
$ … --json '{"url":"https://169.254.169.254/latest/meta-data/"}' | jq -c …
{"status":422,"code":"URL_NOT_ALLOWED","detail":"This URL cannot be fetched (private address)"}`, { sm: true, wrap: 'any' }), sql(`export async function safeFetch(raw) {
  const url = new URL(raw);
  if (url.protocol !== 'https:')
    throw new HttpError(422, 'URL_NOT_ALLOWED', …);
  const host = url.hostname.replace(/^\\[|\\]$/g, '');
  const addrs = isIP(host) ? [host]
    : (await lookup(host, { all: true }))
        .map((a) => a.address);
  if (addrs.some(isPrivate))
    throw new HttpError(422, 'URL_NOT_ALLOWED', …);
  return fetch(url, { redirect: 'error',
    signal: AbortSignal.timeout(3000) });
}`, { lang: 'javascript', sm: true, hl: [6, 9, 11] }) + box('Resolve, then check', '<code class="i">127.1</code>, <code class="i">[::1]</code>, DNS names reach the same place. No redirects: they could lead inside after the check.', 'xanh'), 'r64') },

  { t: 'The audit: the Top 10 as a script', body: two(http(`# LABFLOW_VULN=1
$ node audit.mjs
FAIL  API1 BOLA              Bin reads An’s receipt
FAIL  API2 Broken auth       token with alg "none"
FAIL  API2 Broken auth       6 wrong passwords ⇒ 429
FAIL  API3 Property level    PATCH /v2/me {"role":"LAB_MANAGER"}
PASS  API3 Property level    GET /v2/me hides passwordHash
PASS  API4 Resources         limit=1000 ⇒ 400, 20 KB body ⇒ 413
FAIL  API5 Function level    student PATCHes a device
FAIL  API6 Business flows    student holds a 4th active booking
FAIL  API7 SSRF              manual URL http://127.0.0.1:4000/health
FAIL  API7 SSRF              manual URL https://169.254.169.254/…
FAIL  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  LabFlow calls no third-party API yet — …
✗ 9 kiểm thất bại`, { sm: true }), http(`# fixed
$ node audit.mjs | cut -c1-26
PASS  API1 BOLA
PASS  API2 Broken auth
PASS  API2 Broken auth
PASS  API3 Property level
PASS  API3 Property level
PASS  API4 Resources
PASS  API5 Function level
PASS  API6 Business flows
PASS  API7 SSRF
PASS  API7 SSRF
PASS  API8 Misconfiguration
PASS  API9 Inventory
—     API10 Unsafe consump
✓ mọi kiểm đạt`, { sm: true }) + box('One hole opens the next', 'API5 and API6 were <b>not</b> switched off: API3 let An make herself a manager first — and managers may patch devices and have no booking cap.', 'do2'), 'r64') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ Security as a checklist at the end', 'Half the rows were closed by ordinary design in Chapters 1–5; retro-fitting is far harder.'],
    ['✗ Blocking “localhost” by string', '<code class="i">127.1</code>, <code class="i">[::1]</code>, DNS names. ✓ Resolve, then check addresses.'],
    ['✗ Trusting third-party APIs', 'Their data is input too. ✓ Validate it like user input (API10).'],
  ]) + box('Keep the audit', 'The script is cheap to run: put it next to the tests, so a refactor that reopens a hole turns the build red.', 'xanh') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Name the OWASP API Top 10”', 'BOLA · auth · property level · resources · function level · business flows · SSRF · misconfiguration · inventory · unsafe consumption — each with an example you built.'],
    ['“How do you prevent SSRF?”', 'Allow-list schemes and hosts, resolve and refuse private ranges, no redirects, timeouts, no raw response to the client.'],
  ], 2) + box('At work', 'Security reviews and pentest reports are written in these names — “API1 on /receipt” is understood by everyone.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>2023 Top 10 mapped onto LabFlow — half the rows were already design decisions</li>
<li>New: <b>max 3 active bookings</b> (API6) and <b>safeFetch</b> (API7)</li>
<li>Measured: vulnerable <b>9 FAIL</b> (two caused by one escalation), fixed <b>all PASS</b></li>
<li>Resolve before checking; refuse redirects; keep the audit in your tests</li>
</ul>
${box('Next', 'Lesson 6.4 — CORS and CSRF, measured in a real browser.', 'xanh')}` },
]);
