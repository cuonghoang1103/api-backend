/**
 * nfd-05-3 — Networking for Developers, bài 5.3 "UDP ngoài đời: tường lửa, NAT và khi QUIC bị chặn"
 * (slug netdev-5-3-udp-thuc-te). Output = CHẠY THẬT đọc bằng ra() (lab/out/c53-*, c52-altsvc).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-05-3', code: 'NFD 5.3', title: 'UDP in practice: firewalls, NAT and blocked QUIC', sub: 'Networking for Developers · Chapter 5' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 5 — UDP and QUIC', bai: '5.3' }, [
  { cover: true, t: 'UDP in practice:<br>firewalls, NAT and blocked QUIC', sub: 'Why HTTP/3 quietly falls back to TCP —<br>and how to tell', nhan: 'Chapter 5 · Lesson 5.3' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why many networks <b>block or throttle UDP</b> — and treat it with more suspicion than TCP</li>
<li>The <b>fallback</b>: block UDP 443 and watch HTTP/3 drop to HTTP/2 with no error — measured</li>
<li>How the browser <b>decides</b> between QUIC and TCP (the Alt-Svc memory, a race, a timeout)</li>
<li>Why <b>NAT timeouts</b> bite UDP harder than TCP, and what keepalives do about it</li>
<li>How to <b>measure</b> which one you got, and when to force or disable HTTP/3</li>
</ul>` },

  { t: 'Networks are suspicious of UDP', giua: true, body: `
${bang(['Reason', 'What happens'], [
    ['Default-deny firewalls', 'admins open TCP 443 for “the web”, often leaving UDP 443 closed'],
    ['Old gear & policies', 'UDP 443 as web traffic is new; some middleboxes just drop it'],
    ['DDoS caution', 'UDP is a common amplification vector, so it is rate-limited or blocked'],
    ['NAT tables', 'UDP “connections” are guessed from traffic and time out fast'],
  ], { fs: 20 })}
${box('', 'TCP has an explicit handshake and teardown a firewall can track; UDP has neither, so middleboxes must guess, and when in doubt they drop. On school, hotel and corporate networks, UDP 443 is the first thing to be closed.', 'lam')}` },

  { t: 'The happy fallback', body: `
${term(ra('c53-block', 'ss -uln | grep 8443', 1), { sm: true, title: 'UDP 8443 open — a client could try HTTP/3' })}
${term(ra('c53-block', 'curl -sk --http2', 1), { sm: true, title: 'block UDP 8443, then fetch over TCP — still 200' })}
${box('', 'We dropped all UDP to the QUIC port with one <code class="i">iptables</code> rule. The server still answers perfectly over <b>TCP/HTTP-2</b> — mã 200. QUIC is an <b>optimisation layered on top of</b> a working TCP path, so blocking it costs you HTTP/3’s speed, never the site itself.', 'xanh')}` },

  { t: 'How the browser decides', giua: true, body: `
${steps([
    'First visit: the browser uses <b>TCP/HTTP-2</b> and reads the <code class="i">Alt-Svc: h3</code> header',
    'It <b>remembers</b> that the site offers h3, and on a later connection <b>tries QUIC</b>',
    'QUIC packets dropped? The attempt <b>times out</b> and the browser <b>falls back to TCP</b> — silently',
    'Some browsers <b>race</b> QUIC and TCP and keep whichever connects first (Happy-Eyeballs-style)',
  ])}
${box('', 'The user never sees an error — only, on a QUIC-hostile network, that the page loads over HTTP/2 instead of HTTP/3. That silence is exactly why “it’s slower at the office” is hard to notice without looking.', 'lam')}` },

  { t: 'NAT timeouts bite UDP harder', giua: true, body: `
${box('The problem', 'A NAT must guess when a UDP “flow” is done — there is no FIN. So it drops idle UDP mappings <b>fast</b> (often 30 s), far sooner than idle TCP. A quiet QUIC connection can be forgotten mid-session.', 'do2')}
${box('What QUIC does', 'QUIC sends small <b>keepalive</b> packets and uses its <b>Connection ID</b> to re-establish the path if the mapping changed — the same mechanism as connection migration (lesson 5.2). This is why a well-behaved QUIC stack survives flaky NATs that would strand a naive UDP app.', 'xanh')}` },

  { t: 'Measuring which one you got', giua: true, body: `
${bang(['Tool', 'How'], [
    ['Browser dev tools', 'Network panel → <b>Protocol</b> column: <code class="i">h3</code>, <code class="i">h2</code>, or <code class="i">http/1.1</code>'],
    ['<code class="i">chrome://net-export</code>', 'full QUIC session log: attempts, fallbacks, migrations'],
    ['<code class="i">curl --http3</code>', 'force HTTP/3 (needs a curl built with it — ours is not)'],
    ['server UDP + Alt-Svc', 'the two server-side signals from lesson 5.2'],
  ], { fs: 19 })}
<p style="margin:6px 0 0;font-size:16px;color:#777">⏳ Chưa chạy thật trong lab: <code class="i">curl --http3</code> — ảnh lab thiếu HTTP/3. Dùng bảng Network của trình duyệt.</p>` },

  { t: 'When to force or disable HTTP/3', giua: true, body: `
${steps([
    '<b>Leave it on</b> by default — the Alt-Svc fallback makes it safe; users on good networks get the speed-up',
    '<b>Disable</b> only if you have a concrete reason (a broken middlebox you cannot route around)',
    '<b>Do not rely on it</b> for anything a blocked network would break — QUIC must always be optional',
    'If a feature truly needs UDP (a game, WebRTC media), <b>plan a TCP/TURN relay</b> for blocked networks',
  ])}
${box('', 'The rule of thumb: QUIC/HTTP-3 is a free speed-up where UDP is allowed, and must degrade to TCP where it is not. Build so the blocked case is slower, never broken.', 'lam')}` },

  { t: 'Where this lives in the computer', giua: true, body: `
${bang(['Piece', 'What it is'], [
    ['the block', 'a firewall/NAT dropping UDP 443 — nothing on your host; the server is fine'],
    ['the fallback', 'browser logic: try QUIC, time out, use the TCP connection it already has'],
    ['NAT mapping', 'a short-lived UDP table entry kept alive by QUIC keepalives'],
    ['the signal', 'the Protocol column / net-export in the browser — not tcpdump (QUIC is encrypted)'],
  ], { fs: 20 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Many networks <b>block or throttle UDP 443</b>, because UDP has no handshake a middlebox can track</li>
<li>Blocking QUIC is safe for the site: HTTP/3 <b>falls back to HTTP/2</b> silently — we measured <b>mã 200</b> with UDP dropped</li>
<li>The browser discovers h3 via <b>Alt-Svc</b>, tries QUIC, and times out to TCP if UDP is blocked — no error shown</li>
<li><b>NAT timeouts</b> hit UDP harder; QUIC keepalives + Connection ID keep the connection alive</li>
<li>Check the browser’s <b>Protocol</b> column; a feature that truly needs UDP needs a <b>TCP/relay fallback</b></li>
</ul>
<p style="margin:0">${kw('fallback', 'đường lùi')} ${kw('UDP 443', 'cổng QUIC')} ${kw('NAT timeout', 'hết hạn NAT')} ${kw('keepalive', 'gói duy trì')} ${kw('h3 / h2', 'HTTP/3 / HTTP/2')}</p>` },
]);
