/**
 * nfd-03-1 — Networking for Developers, bài 3.1 "Phân giải: stub, recursive resolver, root, TLD, authoritative"
 * (slug netdev-3-1-phan-giai). Bài MỞ CHƯƠNG 3 (slide 2 = "Chương 3 trong một khung").
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c31-*.out.txt). Khuôn _nfd-chung.mjs + sơ đồ _nfd-dns.mjs.
 */
import { lamDeck, sh, two, box, kw, bang, steps, ra } from './_nfd-chung.mjs';
import { dnsTree } from './_nfd-dns.mjs';

export const deck = { key: 'nfd-03-1', code: 'NFD 3.1', title: 'Resolution: stub, recursive resolver, root, TLD, authoritative', sub: 'Networking for Developers · Chapter 3' };
const term = (t, o = {}) => sh(t, o);
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|^$/ };
const DT = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|OPT PSEUDO|^; EDNS|^$|^;; QUESTION|^;www\.labflow|^;; Query time|^;; SERVER|^;; MSG/ };

export const slides = lamDeck({ chuong: 'Chapter 3 — DNS in depth', bai: '3.1' }, [
  { cover: true, t: 'Resolution: stub, resolver,<br>root, TLD, authoritative', sub: 'Follow one name from your code to the servers<br>that know it — and back', nhan: 'Chapter 3 · Lesson 3.1' },

  { t: 'Chapter 3 at a glance — what you can do after it', to: true, giua: true, body: `
<ul>
<li><b>Trace any name from the root down</b> and say who gave which part of the answer</li>
<li><b>Read and write the records</b> developers touch: A/AAAA, CNAME, MX, TXT, SRV, CAA, HTTPS</li>
<li><b>Change DNS without hurting users</b>: what TTL really controls, negative caching, Java vs Node caches</li>
<li><b>Explain anycast, GeoDNS and round-robin DNS</b> — and why round robin is not a health check</li>
<li><b>Diagnose DNS failures with evidence</b>: SERVFAIL, dead name server, expired domain, forgotten serial</li>
</ul>
${box('Why a developer needs this', 'Many “the server is down” outages are DNS: a wrong record, an old cached answer, a signature that expired at 3 a.m. CDNs, custom domains, <code class="i">mongodb+srv://</code> and server moves all go through DNS.', 'lam')}` },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>four roles</b> in every lookup: stub, recursive resolver, root/TLD, authoritative</li>
<li>A <b>private DNS tree</b> in the lab: your own root, TLD and LabFlow name servers</li>
<li>How to <b>read a dig answer</b> line by line — flags, sections, TTL</li>
<li>The resolver’s walk <b>by hand</b>, with <code class="i">+trace</code>, and <b>captured on the wire</b></li>
<li>The real root: <b>13 names, 2 049 machines</b>, measured from Vietnam</li>
<li>Why <b>dig ≠ your app</b>: /etc/hosts, search/ndots, 127.0.0.53</li>
</ul>` },

  { t: 'Four roles in one lookup', giua: true, body: `
${bang(['Role', 'What it does', 'In our lab'], [
    ['<b>stub resolver</b>', 'small DNS client in your OS/program: asks <b>one</b> question, never walks the tree', '<code class="i">getaddrinfo()</code> on the laptop'],
    ['<b>recursive resolver</b>', 'walks the tree for you, then <b>caches</b> the answer for everybody', 'Unbound at the ISP, 198.51.100.1'],
    ['<b>root server</b>', 'knows only which servers run each TLD', 'a.root-servers.test 192.0.2.10'],
    ['<b>TLD server</b>', 'knows which servers run each domain (the delegation)', 'ns1.nic.test 192.0.2.20'],
    ['<b>authoritative</b>', 'holds the domain’s records — the owner’s answer', 'ns1 / ns2.labflow.test'],
  ], { fs: 19 })}
${box('', 'A name is read right to left: <b>.</b> (root) → <b>test</b> (TLD) → <b>labflow</b> (domain) → <b>www</b> (host). Each level is run by a different organisation.', 'lam')}` },

  { t: 'The lab: a private DNS tree in the Internet in a box', giua: true, body: `
${dnsTree({ hl: ['root', 'tld', 'lf', 'resolver'] })}
${term(`docker build -t net-lab-dns -f Dockerfile.dns .
docker compose -f internet.yml -f dns.yml -p nfi up -d     # ~20 s: keys, signatures, BGP`, { sm: true, title: 'lab/moi-truong' })}` },

  { t: 'One answer, read from top to bottom', body: `
${term(ra('c31-dig', 'dig www.labflow.test', 1, { ...D, drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^;; WHEN|^$|OPT PSEUDO|^; EDNS/ }), { title: 'nfi-laptop → resolver 198.51.100.1' })}` },

  { t: 'What each part means', giua: true, body: `
${bang(['Part', 'Meaning'], [
    ['<code class="i">status: NOERROR</code>', 'the name exists · others: <b>NXDOMAIN</b> (no such name), <b>SERVFAIL</b> (no trustworthy answer)'],
    ['<code class="i">qr rd ra ad</code>', 'reply · recursion desired · recursion available · DNSSEC-checked (3.5) — no <b>aa</b>: from a cache'],
    ['<code class="i">CNAME</code> then <code class="i">A</code>', 'www is an alias of labflow.test; the resolver followed it: 203.0.113.10'],
    ['<code class="i">300</code>', 'the <b>TTL</b>: seconds anyone may keep this answer (lesson 3.3)'],
    ['<code class="i">Query time</code>', '13 ms the first time · <b>0 ms</b> the second: served from the resolver’s cache'],
  ], { fs: 19 })}
${term(ra('c31-dig', 'dig www.labflow.test |', 1, D), { sm: true, title: 'asked again' })}` },

  { t: 'By hand: ask the root first (+norecurse)', body: `
${term(ra('c31-tay', 'dig @192.0.2.10', 1, DT), { title: 'nfi-laptop → a.root-servers.test' })}
${steps([
    'No ANSWER, no <b>aa</b>: the root does not know www.labflow.test',
    '<b>Referral</b> in AUTHORITY: “<code class="i">test.</code> is served by ns1.nic.test”',
    '<b>Glue</b> in ADDITIONAL: that server’s address — otherwise you would need DNS to find DNS',
  ])}` },

  { t: 'Then the TLD, then LabFlow’s own server', body: `
${two(term(ra('c31-tay', 'dig @192.0.2.20', 1, DT), { sm: true, title: '→ ns1.nic.test: another referral' }), term(ra('c31-tay', 'dig @203.0.113.53', 1, DT), { sm: true, title: '→ ns1.labflow.test: the answer, flag aa' }))}
${bang(['Asked', 'Flags', 'Gave'], [
    ['root 192.0.2.10', '<code class="i">qr</code>', 'referral → ns1.nic.test (+ glue)'],
    ['TLD 192.0.2.20', '<code class="i">qr</code>', 'referral → ns1 / ns2.labflow.test (+ glue)'],
    ['ns1 203.0.113.53', '<code class="i">qr aa</code>', '<b>the answer</b>: CNAME + A 203.0.113.10'],
  ], { fs: 19 })}
${box('', 'Three questions, two referrals, one answer. Only the last one carries <b>aa</b> — the owner’s word.', 'xanh')}` },

  { t: 'dig +trace automates the walk', body: `
${term(ra('c31-trace', 'dig +trace', 1, D), { title: 'nfi-laptop' })}
${box('', '<b>172800 s = 2 days</b>: how long a resolver may remember “who runs labflow.test” — why changing name servers at the registrar can take up to two days.', 'lam')}` },

  { t: 'What the resolver really sent', body: `
${term(ra('c31-isp-doc', './dnsgoi.sh', 1, D), { sm: true, title: 'capture on the ISP machine: laptop asks www.labflow.test twice, 1 s apart' })}` },

  { t: 'Reading the capture', to: true, giua: true, body: `
${steps([
    '<b>Priming</b>: <code class="i">. NS</code> — a fresh resolver checks its root-hints list',
    '<b>QNAME minimisation</b> (RFC 9156): the root only saw <code class="i">test</code>, the TLD only <code class="i">labflow.test</code>',
    'ns1 answers www with the CNAME; ns2 answers the target — the two servers are used interchangeably',
    'Three <b>DNSKEY</b> questions: keys to check signatures (lesson 3.5)',
    'Cold lookup: <b>9 questions, 9.7 ms</b> · second lookup: <b>0 questions, 0.1 ms</b>',
  ])}` },

  { t: 'The real root: 13 names, 2 049 machines', body: `
${two(term(ra('c31-goc', 'dig +short NS .', 1, D), { sm: true, title: '13 names (512-byte UDP limit)' }), term(ra('c31-goc', 'for l in', 1, { ...D, gay: 60 }), { sm: true, title: '“which copy are you?” (id.server, CHAOS)' }))}
${box('Anycast (lesson 3.4)', 'root-servers.org, 1 Nov 2026: <b>2 049 instances</b>, 12 operators. From Vietnam F, K, M answer from <b>Hanoi</b>; B, C, D, J from <b>Singapore</b>; A from near Washington.', 'lam')}` },

  { t: 'The same walk for cuongthai.com', body: `
${term(ra('c31-goc', 'dig +trace', 1, { ...D, drop: /^# |^; <<>> DiG|^;; global options|^$|NS\t[b-l]\.root|NS\t[b-l]\.gtld|NS\t[bcdefhijkm]\.gtld/ }), { sm: true, title: 'real Internet (some NS lines removed)' })}
${steps([
    'root (206 ms) → <b>.com</b> gtld-servers (225 ms) → Cloudflare’s <b>kyrie / meilani</b> (43 ms)',
    'Resolvers keep the referrals for 2 days ⇒ real users rarely pay the first two steps',
  ])}` },

  { t: 'Your program does not run dig', body: `
${term(ra('c31-stub', "grep '^hosts'", 6, D), { sm: true, title: 'nfi-laptop: someone left a test line in /etc/hosts' })}
${box('files dns', '<b>getaddrinfo</b> (getent, curl, Node <code class="i">dns.lookup</code>, Java, drivers) reads <b>/etc/hosts first</b>. <code class="i">dig</code> and <code class="i">dns.resolve4</code> speak DNS only. Debug with <code class="i">getent</code>.', 'do2')}` },

  { t: 'Search domains and ndots: hidden extra lookups', body: `
${term(ra('c31-ndots', 'printf', 1, D), { sm: true })}
${two(term(ra('c31-ndots', 'getent ahostsv4 api', 3, D), { sm: true, title: 'three lookups' }), term(ra('c31-ndots', 'tshark', 1, { ...D, boLenh: true }), { sm: true, title: 'answers seen on the wire' }))}
${box('', 'Fewer than <b>ndots</b> dots ⇒ the search domains are tried <b>first</b> (Kubernetes: <code class="i">ndots:5</code>). A final dot — <code class="i">labflow.cdn.test.</code> — skips them.', 'lam')}` },

  { t: '“My DNS server is 127.0.0.53?”', body: `
${term(ra('c31-ubuntu', 'ls -l', 3, { ...D, gay: 70 }), { sm: true, title: 'nfi-ubuntu: an Ubuntu machine with systemd-resolved' })}
${term(ra('c31-ubuntu', 'resolvectl query', 2, { ...D, drop: /^# |^$|-- Information|-- Data is/ }), { sm: true, title: 'the second query is answered from the local cache' })}
${box('', '<b>systemd-resolved</b> is a local cache that forwards to the real server. Docker does the same with <code class="i">127.0.0.11</code>. “Flush DNS” may mean several caches.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Stub (in your program) → <b>recursive resolver</b> → root → TLD → <b>authoritative</b></li>
<li>Root and TLD give <b>referrals</b> (NS + glue); only the authoritative answer has <b>aa</b></li>
<li>The resolver caches: <b>9 questions / 9.7 ms</b> cold, <b>0 / 0.1 ms</b> warm</li>
<li>13 root names = <b>2 049 anycast copies</b>; from Vietnam several answer from Hanoi</li>
<li>Apps use <b>getaddrinfo</b>: hosts file, search/ndots, local caches — check with <code class="i">getent</code></li>
</ul>
<p style="margin:0">${kw('stub resolver', 'phân giải đầu cuối')} ${kw('recursive resolver', 'phân giải đệ quy')} ${kw('referral', 'lời giới thiệu')} ${kw('glue', 'bản ghi keo')} ${kw('authoritative', 'có thẩm quyền')}</p>` },
]);
