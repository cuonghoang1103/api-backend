/**
 * nfd-11-4 — Networking for Developers, bài 11.4 "Bảng kiểm chẩn đoán theo tầng" (slug netdev-11-4-phuong-phap).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c114-*.out.txt) — DNS → routing → port → TLS → HTTP → app, mỗi tầng một lệnh.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-11-4', code: 'NFD 11.4', title: 'A layered troubleshooting checklist', sub: 'Networking for Developers · Chapter 11' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 11 — Troubleshooting', bai: '11.4' }, [
  { cover: true, t: 'A layered troubleshooting checklist', sub: 'DNS → routing → port → TLS → HTTP → app —<br>one command per layer, no guessing', nhan: 'Chapter 11 · Lesson 11.4' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>A <b>repeatable method</b>: walk the layers bottom-up, one command each</li>
<li><b>DNS → routing → port → TLS → HTTP → app</b>, stop at the first that fails</li>
<li>The lab checklist run for real, layer by layer</li>
<li>Why "it works on my machine" is a <b>layer</b> that differs, not magic</li>
<li>A sample incident: intermittent timeouts from <b>MTU</b>, and a half-broken <b>IPv6</b></li>
</ul>` },

  { t: 'Walk the layers, bottom-up', giua: true, body: `
${steps([
    '<b>DNS</b> — does the name resolve to the right IP?',
    '<b>Routing</b> — does a packet to that IP leave by the right gateway?',
    '<b>Port</b> — is something listening (open) or is it refused/filtered?',
    '<b>TLS</b> — is the certificate valid and the handshake clean?',
    '<b>HTTP</b> — what status does the server return?',
    '<b>App</b> — does the application actually answer correctly?',
  ])}
${box('', 'Each layer depends on the one below. Check <b>bottom-up</b> and stop at the first that fails — there is no point debugging HTTP if the port is refused.', 'lam')}` },

  { t: 'Port and TLS, on the lab', body: `
${term(ra('c114-checklist', 'nc -zv', 1), { sm: true, title: 'port: 80 open, 81 refused' })}
${term(ra('c114-checklist', 'openssl', 1), { sm: true, title: 'TLS: the certificate subject and validity dates' })}
${box('', '<code class="i">nc -zv</code> answers the <b>port</b> question in one line: 80 succeeds, 81 is refused. <code class="i">openssl s_client</code> + <code class="i">x509</code> answers <b>TLS</b>: the certificate’s subject and its notBefore/notAfter. Two layers, two commands, two unambiguous answers.', 'xanh')}` },

  { t: 'One command per layer', giua: true, body: `
${bang(['Layer', 'One command', 'A good answer'], [
    ['DNS', '<code class="i">dig +short name</code> / <code class="i">getent hosts</code>', 'the expected IP'],
    ['Routing', '<code class="i">ip route get IP</code>', 'via the right gateway'],
    ['Port', '<code class="i">nc -zv host port</code>', 'succeeded (not refused/timeout)'],
    ['TLS', '<code class="i">openssl s_client -connect …</code>', 'valid cert, dates OK'],
    ['HTTP', '<code class="i">curl -sI url</code>', 'the expected status line'],
    ['App', '<code class="i">curl -s url/health</code>', 'a correct body'],
  ], { fs: 17 })}
${box('', 'Memorise this table and you can diagnose almost anything methodically. The failing layer is the one to fix; everything below it is already proven good.', 'lam')}` },

  { t: '"It works on my machine" is a layer', giua: true, body: `
${box('Key idea', '"Works here, not there" is never magic — it is a <b>layer that differs</b> between the two environments: a different DNS resolver, a firewall rule, a missing cert, an env var, a proxy. The checklist finds it by running the <b>same</b> commands in both places and comparing.', 'do2')}
${steps([
    'Run the layer checklist on the machine where it <b>works</b>',
    'Run the identical checklist where it <b>fails</b>',
    'The first layer whose answer differs is the cause',
  ])}` },

  { t: 'Sample incident: MTU and half-broken IPv6', giua: true, body: `
${bang(['Symptom', 'Layer', 'Cause'], [
    ['small requests fine, big ones hang', 'IP / MTU', 'oversized packets dropped, PMTUD blocked'],
    ['slow then works after a pause', 'DNS', 'IPv6 (AAAA) tried first, times out, falls back to IPv4'],
    ['only one region fails', 'routing', 'a bad route / peering on that path'],
  ], { fs: 18 })}
${box('', 'The nastiest bugs are <b>intermittent</b> and <b>partial</b> — a half-broken IPv6 or an MTU black hole looks random until the layered checklist isolates the one layer misbehaving. "Random" is just a layer you have not measured yet.', 'lam')}` },

  { t: 'The habit: binary-search the layers', giua: true, body: `
${steps([
    'Start in the middle (<b>port</b> / <b>TLS</b>): is the connection even getting through?',
    'If yes, go <b>up</b> (HTTP, app); if no, go <b>down</b> (routing, DNS)',
    'Each check halves the search — you reach the cause in a few steps, not by guessing',
  ])}
${box('', 'This is the whole course in one method: every layer you learned (DNS, IP, TCP, TLS, HTTP, LB) is a checkpoint, and a request that fails fails at exactly one of them. Find that one, and the fix follows.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Diagnose <b>bottom-up</b> — DNS → routing → port → TLS → HTTP → app — and stop at the first failure</li>
<li><b>One command per layer</b>: <code class="i">dig</code>, <code class="i">ip route get</code>, <code class="i">nc -zv</code>, <code class="i">openssl s_client</code>, <code class="i">curl -I</code>, a health check</li>
<li>"Works on my machine" is a <b>layer that differs</b> — run the same checklist both places and compare</li>
<li>Intermittent/partial bugs (<b>MTU</b>, half-broken <b>IPv6</b>) look random until the checklist isolates the layer</li>
<li><b>Binary-search</b> the layers: each check halves the problem — the method that ends guessing</li>
</ul>
<p style="margin:0">${kw('bottom-up', 'từ dưới lên')} ${kw('nc -zv', 'kiểm cổng')} ${kw('openssl s_client', 'kiểm TLS')} ${kw('curl -I', 'kiểm HTTP')} ${kw('binary search', 'tìm nhị phân tầng')}</p>` },
]);
