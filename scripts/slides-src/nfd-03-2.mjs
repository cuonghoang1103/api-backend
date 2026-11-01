/**
 * nfd-03-2 — Networking for Developers, bài 3.2 "Các loại bản ghi lập trình viên đụng tới" (slug netdev-3-2-ban-ghi).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c32-*.out.txt); tệp vùng thật đọc từ lab/moi-truong/dns/vung/.
 */
import fs from 'node:fs';
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-03-2', code: 'NFD 3.2', title: 'Record types that developers touch', sub: 'Networking for Developers · Chapter 3' };
const term = (t, o = {}) => sh(t, o);
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|^$/ };
const ZONE = fs.readFileSync(new URL('../../content/courses/networking-for-developers/lab/moi-truong/dns/vung/labflow.test.zone', import.meta.url), 'utf8').split('\n');
const vung = (re) => ZONE.filter((l) => l && !l.startsWith(';') && re.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — DNS in depth', bai: '3.2' }, [
  { cover: true, t: 'Record types that<br>developers touch', sub: 'A, CNAME, MX, TXT, CAA, SRV, HTTPS, SOA —<br>and the mistakes that still “load OK”', nhan: 'Chapter 3 · Lesson 3.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read a <b>real zone file</b> column by column</li>
<li>Every record type a developer meets — and <b>what it is for</b></li>
<li>Why the bare domain can never be a <b>CNAME</b> — and what providers do instead</li>
<li>How your code (and <code class="i">mongodb+srv://</code>) reads records</li>
<li>Four classic mistakes caught by <b>named-checkzone</b> — two of them still say “OK”</li>
<li>Primary and secondary servers, and the <b>forgotten serial</b> that splits your users</li>
</ul>` },

  { t: 'A zone file: five columns per record', body: `
${term(ZONE.slice(2, 24).filter((l) => l && !/^; ns9/.test(l) && !/^ns9/.test(l)).join('\n'), { sm: true, title: 'lab/moi-truong/dns/vung/labflow.test.zone (start of the file)' })}
${bang(['Column', 'Example'], [
    ['name · TTL · class · type · data', '<code class="i">api&nbsp;&nbsp;120&nbsp;&nbsp;IN&nbsp;&nbsp;A&nbsp;&nbsp;203.0.113.10</code>'],
    ['<code class="i">$TTL 300</code>', 'default TTL for lines without one'],
  ], { fs: 18 })}` },

  { t: 'Relative names and the final dot', giua: true, body: `
${bang(['Written in the zone', 'Means'], [
    ['<code class="i">@</code>', '<code class="i">labflow.test.</code> — the zone itself (the <b>apex</b>)'],
    ['<code class="i">www</code>', '<code class="i">www.labflow.test.</code> — relative: the zone name is appended'],
    ['<code class="i">labflow.cdn.test.</code>', 'exactly that — absolute, thanks to the <b>final dot</b>'],
    ['<code class="i">mail.labflow.test</code> (no dot)', '<code class="i">mail.labflow.test.labflow.test.</code> — a name that does not exist'],
  ], { fs: 21 })}
${box('Rule', 'Inside a zone file, a name <b>without a final dot</b> is relative. Most zone bugs are a missing (or extra) dot.', 'do2')}` },

  { t: 'A, AAAA and CNAME', body: `
${term(ra('c32-hoi', 'dig +noall +answer labflow.test A', 4, D), { title: 'nfi-laptop' })}
${steps([
    '<b>A</b> = IPv4 address · <b>AAAA</b> = IPv6 address — a name may have several of each (3.4)',
    '<b>CNAME</b> = alias: “look up that other name instead”; the resolver follows it and returns the whole chain',
    '<code class="i">static</code> → <code class="i">labflow.cdn.test</code>: another company’s zone — they change IPs without asking you',
  ])}` },

  { t: 'MX and TXT: mail and the domain’s notice board', body: `
${term(ra('c32-hoi', 'dig +noall +answer labflow.test MX', 4, D), { sm: true, title: 'nfi-laptop' })}
${bang(['Record', 'What it is for'], [
    ['<b>MX</b> 10 mail', 'who receives mail for @labflow.test · lower number first · must point to a <b>name</b> with A/AAAA'],
    ['<code class="i">v=spf1 mx -all</code>', 'SPF: only our MX servers may send mail as us'],
    ['<code class="i">labflow-verify=…</code>', 'proof you control the domain (search console, SaaS, CA)'],
    ['<code class="i">_dmarc</code>', 'what receivers do with mail failing the checks (Email infrastructure course)'],
  ], { fs: 18 })}` },

  { t: 'CAA, SRV and HTTPS', body: `
${term(ra('c32-hoi', 'dig +noall +answer labflow.test CAA', 3, D), { sm: true, title: 'nfi-laptop' })}
${bang(['Record', 'What it is for'], [
    ['<b>CAA</b>', 'which certificate authorities may issue certificates · none = any CA may'],
    ['<b>SRV</b>', 'host + port of a service, with priority/weight — what <code class="i">mongodb+srv://</code> looks up'],
    ['<b>HTTPS</b> (RFC 9460)', 'hints before connecting: ALPN (h2/h3), address hints, ECH'],
  ], { fs: 19 })}` },

  { t: 'NS and SOA: the zone describes itself', body: `
${term(ra('c32-hoi', 'dig +noall +answer labflow.test NS', 2, D), { sm: true, title: 'nfi-laptop' })}
${bang(['SOA field', 'Value', 'Meaning'], [
    ['primary · contact', 'ns1 · hostmaster.labflow.test', 'main server · hostmaster@labflow.test'],
    ['<b>serial</b>', '2026110101', 'version of the zone — secondaries copy when it <b>grows</b>'],
    ['refresh · retry · expire', '3600 · 600 · 1209600', 'how often secondaries check · retry · give up after 14 days'],
    ['minimum', '300', 'TTL of “name does not exist” answers (3.3)'],
  ], { fs: 18 })}
${box('', 'NS here should match the <b>delegation</b> at the TLD (lesson 3.1). One SOA per zone; its <b>serial</b> drives everything on the last slides.', 'lam')}` },

  { t: 'Your code reads records too', body: `
${term(ra('c32-node', 'node /tmp/ghi.mjs', 1, D), { title: 'nfi-laptop: Node dns.promises' })}
${box('', 'The order of SRV (and TXT) records changes between answers — an earlier run had db2 first. Choose by <b>priority, then weight</b>, never by position.', 'lam')}` },

  { t: 'Mistake 1: a CNAME at the apex', body: `
${term(ra('c32-kiem', "sed 's/^@              IN A    203.0.113.10/", 2, { drop: /^# /, gay: 96 }), { sm: true, title: 'nfi-ns: what the CDN “asked” for the bare domain' })}
${box('Why it fails · what to do', 'A CNAME means “no data of my own” — it cannot sit next to the apex’s SOA, NS, MX, TXT… Providers offer <b>CNAME flattening / ALIAS</b>: they resolve the target and publish plain A/AAAA at the apex.', 'do2')}` },

  { t: 'Mistakes 2–4: two of them still load “OK”', body: `
${term(ra('c32-kiem', "printf 'api", 2, { drop: /^# / }), { sm: true, title: '2 · CNAME next to another record (api already has an A)' })}
${term(ra('c32-kiem', "sed 's/^@              IN MX   10 mail/@              IN MX   10 203", 2, { drop: /^# / }), { sm: true, title: '3 · MX pointing to an IP' })}
${term(ra('c32-kiem', "sed 's/^@              IN MX   10 mail$", 2, { drop: /^# / }), { sm: true, title: '4 · missing final dot: mail.labflow.test.labflow.test — every email bounces' })}` },

  { t: 'A real zone: cuongthai.com (Cloudflare DNS)', body: `
${term(ra('c32-that', 'dig +noall +answer cuongthai.com A', 7, { ...D, cut: 104 }), { sm: true, title: 'real Internet — TXT filtered to the SPF line' })}
${term(ra('c32-that', 'dig +noall +answer cuongthai.com ANY', 2, D), { sm: true, title: 'ANY and PTR' })}` },

  { t: 'What those real records tell us', to: true, giua: true, body: `
${bang(['Record', 'Reading'], [
    ['A 160.187.1.208', 'the VPS itself — not behind Cloudflare’s proxy (3.4)'],
    ['MX + SPF', 'mail via Porkbun forwarding; Porkbun and Amazon SES may send as cuongthai.com'],
    ['DMARC <code class="i">p=none</code>', 'receivers only report failures — tighten later'],
    ['no CAA', 'any CA may issue a certificate — one line would restrict it'],
    ['SOA minimum 1800', '“does not exist” cached up to 30 minutes (3.3)'],
    ['ANY → HINFO "RFC8482"', 'ANY was abused for DDoS amplification — ask for each type'],
  ], { fs: 19 })}` },

  { t: 'Two servers, one zone: AXFR and NOTIFY', body: `
${term(ra('c32-axfr', 'dig @203.0.113.53', 1, D), { sm: true, title: 'nfi-laptop asks for the whole zone: refused' })}
${term(ra('c32-axfr-ns2', 'dig @203.0.113.53', 2, { ...D, gay: 90 }), { sm: true, title: 'nfi-ns2 (allowed): copies the zone, same serial as ns1' })}
${steps([
    'Primary ns1 holds the file; secondary ns2 copies it with a <b>zone transfer</b> (AXFR, TCP port 53)',
    'ns1 reloads ⇒ sends <b>NOTIFY</b> ⇒ ns2 copies <b>only if ns1’s serial is larger</b>',
    '<code class="i">allow-transfer</code>: a public transfer would hand anyone your full list of hostnames',
  ])}` },

  { t: 'Incident: “half the users still get the old record”', body: `
${term(ra('c32-serial-quen', 'sed -i', 3, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns: api → Singapore edge .11 — serial NOT changed' })}
${term(ra('c32-serial-hoi', 'dig', 4, D), { sm: true, title: 'nfi-laptop: ask each server directly' })}` },

  { t: 'The fix: bump the serial', body: `
${term(ra('c32-serial-sua', 'sed -i', 3, { ...D, gay: 96 }), { sm: true, title: 'nfi-ns: serial YYYYMMDDnn + 1' })}
${two(term(ra('c32-serial-hoi2', 'dig +short @203.0.113.5', 2, D), { sm: true, title: 'both servers agree' }), term(ra('c32-ns2-log', 'docker logs', 1, { ...D, boLenh: true, cut: 64 }), { sm: true, title: 'ns2 log: NOTIFY → transfer' }))}
${box('', 'Same serial ⇒ ns2 kept the old data, and each resolver got one answer or the other. Managed DNS bumps the serial for you; your own BIND does not.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>name · TTL · IN · type · data — names <b>without a final dot</b> are relative</li>
<li>A/AAAA, CNAME (never at the apex → flattening), MX → a name, TXT, CAA, SRV, HTTPS</li>
<li>Run <b>named-checkzone</b> and read its warnings — a missing dot still loads “OK”</li>
<li>Secondaries copy only when the <b>SOA serial grows</b></li>
<li>Ask for each type: <code class="i">ANY</code> returns <code class="i">HINFO "RFC8482"</code></li>
</ul>
<p style="margin:0">${kw('zone', 'vùng')} ${kw('apex', 'đỉnh tên miền')} ${kw('CNAME flattening', 'làm phẳng CNAME')} ${kw('SOA serial', 'phiên bản vùng')} ${kw('zone transfer', 'chuyển vùng')}</p>` },
]);
