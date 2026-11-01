/**
 * nfd-03-5 — Networking for Developers, bài 3.5 "DNSSEC, DoH/DoT và các kiểu hỏng của DNS" (slug netdev-3-5-dns-an-toan).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c35-*.out.txt).
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra, svg, T, R, C, MK, A } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-03-5', code: 'NFD 3.5', title: 'DNSSEC, DoH/DoT and DNS failure modes', sub: 'Networking for Developers · Chapter 3' };
const term = (t, o = {}) => sh(t, o);
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|^$/ };

/** Chuỗi tin cậy: mỏ neo gốc → DS(test) → DNSKEY(test) → DS(labflow) → DNSKEY(labflow) → RRSIG → A. */
function chuoi() {
  const cot = [
    { x: 14, t: 'root anchor', s: 'in the resolver', c: C.red },
    { x: 196, t: '“.” DNSKEY', s: 'signs DS of test', c: C.red },
    { x: 378, t: 'test DNSKEY', s: 'matches that DS', c: C.br },
    { x: 560, t: 'DS labflow.test', s: 'hash of its KSK', c: C.br },
    { x: 742, t: 'labflow DNSKEY', s: 'KSK 257 · ZSK 256', c: C.tcp },
    { x: 924, t: 'A + RRSIG', s: '203.0.113.10', c: C.tcp },
  ];
  let s = '';
  cot.forEach((k, i) => {
    s += R(k.x, 40, 170, 86, k.c + '14', k.c, { rx: 10 }) + T(k.x + 85, 74, k.t, 17, { a: 'middle', w: 800, f: k.c }) + T(k.x + 85, 100, k.s, 13, { a: 'middle', f: '#555' });
    if (i) s += A(k.x - 12, 83, k.x - 2, 83, 'ch', '#777');
  });
  s += T(99, 28, 'trusted without proof', 13, { a: 'middle', f: C.red, w: 700 });
  s += R(14, 150, 1080, 92, '#f7f7f4', '#ddd', { rx: 10, sw: 1.5 });
  s += T(30, 178, 'Each arrow = one check the validating resolver makes:', 15, { w: 800, f: '#444' });
  s += T(30, 204, 'a signature (RRSIG) verified with a key (DNSKEY), or a key matched to its hash (DS) published and signed by the parent.', 15, { f: '#444' });
  s += T(30, 228, 'All checks pass ⇒ flag ad · one fails ⇒ “bogus” ⇒ SERVFAIL · no DS at the parent ⇒ “insecure” (unsigned, allowed).', 15, { f: '#444' });
  return svg(1110, 250, s, MK('ch', '#777'));
}

export const slides = lamDeck({ chuong: 'Chapter 3 — DNS in depth', bai: '3.5' }, [
  { cover: true, t: 'DNSSEC, DoH/DoT and<br>DNS failure modes', sub: 'Signatures, encryption, and the outages<br>you will actually meet', nhan: 'Chapter 3 · Lesson 3.5' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why plain DNS needs protecting — and the <b>two different</b> fixes</li>
<li>A <b>DNSSEC chain of trust</b> read and recomputed by hand</li>
<li>A real-style outage: <b>signatures expired</b> — SERVFAIL, EDE, +cd, bogus cache</li>
<li><b>DoT and DoH</b> on the wire: what someone on the path can still see</li>
<li>Failures you will meet: <b>dead name server</b>, one of two dead, <b>expired domain</b></li>
<li>A six-step checklist for <b>“works on my machine, not on yours”</b></li>
</ul>` },

  { t: 'Two problems, two tools', to: true, giua: true, body: `
${bang(['Problem', 'Tool', 'Protects', 'Does not protect'], [
    ['forged / altered answers', '<b>DNSSEC</b> (signatures)', 'integrity: signed by the zone’s owner', 'privacy — answers stay readable'],
    ['others reading your questions', '<b>DoT / DoH</b> (TLS)', 'privacy between you and the resolver', 'a lying resolver — which still sees all'],
  ], { fs: 19 })}
${box('Why it matters', 'July 2008, CERT VU#800113: predictable IDs and fixed ports let attackers <b>poison resolver caches</b> with forged answers. Ports are random now, but plain DNS still proves nothing.', 'do2')}` },

  { t: 'The chain of trust', giua: true, body: `
${chuoi()}
${box('', 'The real root zone has been signed since <b>15 July 2010</b>; its anchor is published by IANA. In the lab, every zone except the CDN’s is signed.', 'lam')}` },

  { t: 'Signatures and keys', body: `
${term(ra('c35-chuoi', 'dig +dnssec', 2, { ...D, gay: 96, cut: 100 }), { sm: true, title: 'nfi-laptop (long signature lines cut)' })}
${bang(['RRSIG field', 'Here'], [
    ['type covered · algorithm · labels · original TTL', '<code class="i">A 13 2 300</code>'],
    ['expiry · inception', '30 days apart — the zone must be <b>re-signed</b> before expiry'],
    ['key tag · signer', 'which DNSKEY of <code class="i">labflow.test.</code> made it'],
  ], { fs: 18 })}
${steps([
    '<b>RRSIG</b>: type covered, algorithm 13 (ECDSA P-256), TTL, <b>expiry · inception</b> (30 days), key tag, signer, signature',
    '<b>DNSKEY 256</b> = zone-signing key (signs records) · <b>257</b> = key-signing key (signs the DNSKEY set)',
  ])}` },

  { t: 'The parent vouches: DS = hash of the child’s KSK', body: `
${term(ra('c35-chuoi', 'dig +noall +answer labflow.test DS', 3, { ...D, gay: 96 }), { sm: true, title: 'nfi-laptop: DS at the TLD, then computed by hand, then the root’s DS for test' })}
${steps([
    'The TLD publishes <b>DS</b> for labflow.test: key tag · algorithm 13 · digest type 2 (SHA-256) · digest',
    '<code class="i">dnssec-dsfromkey</code> hashes LabFlow’s key-signing key ⇒ <b>the same digest</b>',
    'The TLD signs that DS with its own key; the root publishes and signs the DS of <b>test</b>',
  ])}
${box('', 'Change your KSK without updating the DS at the registrar ⇒ the chain breaks for every validating resolver (Lab 3).', 'do2')}` },

  { t: 'Validated: the ad flag and delv', body: `
${term(ra('c35-chuoi', 'cat /dnsz/anchor.conf', 2, { ...D, cut: 110 }), { sm: true, title: 'the lab’s trust anchor, and the resolver’s verdict' })}
${term(ra('c35-chuoi', 'delv -a /dnsz/anchor.conf labflow.test', 1, { ...D, cut: 100 }), { sm: true, title: 'delv: validation done locally, result in words' })}
${box('', '<b>ad</b> = the resolver followed the whole chain to its anchor and every check passed. <code class="i">delv</code> repeats the checks on your machine — use it when you do not trust the resolver’s verdict.', 'lam')}` },

  { t: 'Secure, insecure, bogus', body: `
${term(ra('c35-chuoi', 'delv -a /dnsz/anchor.conf static', 1, { ...D, cut: 100 }), { sm: true, title: 'static.labflow.test → CNAME into cdn.test (no DS at the TLD)' })}
${bang(['State', 'Meaning', 'Result'], [
    ['<b>secure</b>', 'every link checks out', 'answer + <code class="i">ad</code>'],
    ['<b>insecure</b>', 'provably unsigned: no DS at the parent', 'answer, no <code class="i">ad</code> — allowed'],
    ['<b>bogus</b>', 'should validate (DS exists) but does not', '<b>SERVFAIL</b>'],
  ], { fs: 20 })}` },

  { t: 'Incident: the signatures expired', body: `
${term(ra('c35-ky-hong', 'sed -i', 2, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns: a re-signing job that died a month ago (serial bumped so ns2 copies it)' })}
${term(ra('c35-hong', 'dig', 4, { ...D, gay: 96 }), { sm: true, title: 'nfi-laptop' })}
${box('What users saw', '“LabFlow is down” — but only behind <b>validating</b> resolvers. Monitoring that checks the server by IP stays green.', 'do2')}` },

  { t: 'Reading the evidence', to: true, giua: true, body: `
${steps([
    '<code class="i">SERVFAIL</code> for every user behind a validating resolver — server, network and records are fine',
    '<b>EDE 7 (Signature Expired)</b>: the resolver says why (RFC 8914) — read it first when present',
    '<code class="i">+cd</code> (checking disabled) returns the address ⇒ <b>works with +cd, fails without = DNSSEC</b>',
    'The RRSIG’s validity window ended before the UTC time printed by <code class="i">date -u</code>',
  ])}` },

  { t: 'The fix — and the bogus cache', body: `
${term(ra('c35-ky-sua', 'sed -i', 2, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns: re-sign correctly' })}
${two(term([ra('c35-sua-hoi', 'dig', 1, D), ra('c35-isp-bogus', 'unbound-control', 2, D)].join('\n'), { sm: true, title: 'still SERVFAIL — then flush on nfi-isp' }), term(ra('c35-sua-hoi2', 'dig', 1, D), { sm: true, title: 'after flush_bogus' }))}
${box('', 'Resolvers keep a bogus answer ~<b>60 s</b> (<code class="i">val-bogus-ttl</code>). A wrong DS is worse: the DS itself is cached with the TLD’s TTL — Slack, 30 Sep 2021: <b>24-hour</b> partial outage.', 'do2')}` },

  { t: 'The real Internet', body: `
${term(ra('c35-that', 'dig +dnssec cloudflare.com', 6, { ...D, cut: 104 }), { sm: true, title: 'signed (cloudflare.com) · deliberately broken (dnssec-failed.org) · not signed (cuongthai.com)' })}
${bang(['Domain', 'DS at parent', 'Through 1.1.1.1'], [
    ['cloudflare.com', 'yes', 'answer + <code class="i">ad</code> (secure)'],
    ['dnssec-failed.org', 'yes, but no matching key', '<b>SERVFAIL</b>, EDE 9 (DNSKEY Missing) · +cd works'],
    ['cuongthai.com', 'none', 'answer, no <code class="i">ad</code> (insecure — not signed)'],
  ], { fs: 18 })}` },

  { t: 'DoT and DoH on the wire', body: `
${term(ra('c35-rieng-laptop', 'dig', 3, D), { sm: true, title: 'nfi-laptop: the same question three ways' })}
${term(ra('c35-rieng-doc', 'tshark', 1, { ...D, boLenh: true }), { sm: true, title: 'captured on the home router’s Internet side (ISP, café, anyone on the path)' })}` },

  { t: 'Encrypted DNS: what it hides, what it does not', body: `
${term(ra('c35-that', 'dig +short +tls', 3, { ...D, gay: 96, cut: 104 }), { sm: true, title: 'real Internet: DoT, DoH and the JSON API of 1.1.1.1' })}
${steps([
    'Plain DNS shows every name · DoT (853) and DoH (443) show only a TLS hello and encrypted bytes',
    'DoH looks like normal HTTPS ⇒ browsers’ “Secure DNS” · company filters often block it',
    'The resolver still sees everything, and TLS does not prove the answer is genuine — that is DNSSEC',
  ])}` },

  { t: 'Failure: a dead name server', body: `
${term(ra('c35-dead', 'for n in', 1, { ...D, gay: 96 }), { sm: true, title: 'nfi-laptop: dead.test — a new name each time, 20 s limit' })}
${term(ra('c35-isp-infra', 'unbound-control', 2, { ...D, cut: 108 }), { sm: true, title: 'nfi-isp: the resolver remembers the server is dead' })}
${box('', 'First three users: <b>20 s and no answer</b> (Unbound drops queries it cannot answer in ~2 s). Then <b>SERVFAIL in 0.0 s</b>, remembered up to 15 minutes.', 'lam')}` },

  { t: 'Failure: one of two dead · an expired domain', body: `
${term(ra('c35-mot-ns', 'for i in 1 2 3 4 5 6', 1, { ...D, gay: 96 }), { sm: true, title: 'nfi-isp, ns2 stopped: each round forgets what it knew about the servers' })}
${term(ra('c35-het-han', 'dig', 2, D), { sm: true, title: 'nfi-laptop: oldshop.test — the registry removed the delegation' })}` },

  { t: '“Works on my machine, not on yours”: checklist', to: true, giua: true, body: `
${bang(['Step', 'Command', 'Tells you'], [
    ['1 · what the app gets', '<code class="i">getent ahosts name</code>', 'hosts file, search domains (3.1)'],
    ['2 · which resolver', '<code class="i">resolv.conf</code>, <code class="i">resolvectl status</code>', 'different caches'],
    ['3 · each resolver', '<code class="i">dig name @resolver</code>', 'old answer + TTL counting = cache (3.3)'],
    ['4 · the truth', '<code class="i">dig name @ns1 / @ns2</code> + SOA', 'disagree, same serial = forgotten serial (3.2)'],
    ['5 · DNSSEC?', '<code class="i">+cd</code> vs without · EDE', 'works only with +cd = signatures / chain'],
    ['6 · delegation', '<code class="i">dig +trace</code>', 'NXDOMAIN at TLD = expired · slow hop = dead NS'],
  ], { fs: 18 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>DNSSEC</b> = integrity (RRSIG ← DNSKEY ← DS ← … ← root); <b>DoT/DoH</b> = privacy from the network</li>
<li>Expired signatures ⇒ <b>SERVFAIL</b>; EDE says why; <b>+cd</b> proves it; bogus cached ~60 s</li>
<li><b>Insecure</b> (no DS) is allowed; <b>bogus</b> is an outage</li>
<li>Dead name server: <b>3 × 20 s</b> hangs, then instant SERVFAIL for up to 15 min</li>
<li>Expired domain: gone at the TLD · use the <b>six-step checklist</b></li>
</ul>
<p style="margin:0">${kw('DNSSEC', 'chữ ký DNS')} ${kw('trust anchor', 'mỏ neo tin cậy')} ${kw('bogus', 'hỏng')} ${kw('EDE', 'lỗi mở rộng')} ${kw('DoH / DoT', 'DNS mã hoá')}</p>` },
]);
