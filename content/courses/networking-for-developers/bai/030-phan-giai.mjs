/**
 * Chương 3 · 3.1 — Phân giải: stub, recursive resolver, root, TLD, authoritative (slug khung netdev-3-1-phan-giai). Bài MỞ
 * CHƯƠNG: khối "🎯 Chương 3 trong một khung" ở đầu bài đọc. Lab: "Internet trong một hộp" + phần DNS (moi-truong/dns.yml).
 * Output thật: lab/out/c31-*.out.txt (dựng lại: bash lab/code/dung-output-ch3.sh).
 */
import { run, src, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-03-1.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
// bỏ dòng chú thích của kịch bản + các dòng dig không mang thông tin cho người học (cookie, banner phiên bản)
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN/ };

const TOPO = `                         ┌──────────── who knows which part of a name ────────────┐
  "."        a.root-servers.test  192.0.2.10    root      (at the IX, like many real root copies)
  "test."    ns1.nic.test         192.0.2.20    TLD       (the registry of .test)
  "labflow.test"  ns1 203.0.113.53 · ns2 203.0.113.54     LabFlow's own name servers (in the DC)
  "cdn.test"      ns1.cdn.test 192.0.2.40                 the CDN's DNS (lesson 3.4)

  laptop 192.168.50.10 ──asks──► resolver of the ISP 198.51.100.1  (Unbound: walks the tree, caches, checks DNSSEC)
  public DNS 198.19.1.1 = one address, two places: pop1 Hanoi (IX) · pop2 Singapore (behind the DC router)`;

export default {
  title: '3.1 — Resolution: stub, recursive resolver, root, TLD, authoritative|||3.1 — Phân giải: stub, recursive resolver, root, TLD, authoritative',
  slug: 'netdev-3-1-phan-giai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn vai trong một lần tra tên; phòng lab DNS riêng (máy chủ gốc, TLD, máy chủ tên của LabFlow, resolver kiểm DNSSEC); đọc từng phần câu trả lời dig; tự hỏi từng cấp với +norecurse rồi dig +trace; bắt gói xem resolver thật sự hỏi gì (QNAME minimisation, DNSSEC); 13 tên máy chủ gốc và 2 049 bản sao; phía stub: /etc/hosts, nsswitch, getent vs dig, search/ndots, systemd-resolved 127.0.0.53.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Resolution: stub, recursive resolver, root, TLD, authoritative</h2>
<p class="lead">Your code says <code>fetch("https://api.labflow.test/")</code>. Before a single byte of HTTP can leave, something must turn that name into an address. Who knows the answer? Nobody, in one place — the answer is spread over several servers, each of which only knows one part of the name. This lesson follows one lookup from your program to those servers and back, on a DNS hierarchy you run yourself, then on the real Internet — and shows the places where "DNS works" and "my app gets the right address" are two different things.</p>

<div class="callout info">
<p><strong>🎯 Chapter 3 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Trace any name from the root down</strong> and say which server gave which part of the answer — with <code>dig +trace</code>, or by hand.</li>
<li><strong>Read and write DNS records</strong> a developer touches: A/AAAA, CNAME (and why not at the top of a domain), MX, TXT for verification, SRV for <code>mongodb+srv://</code>, CAA, HTTPS.</li>
<li><strong>Plan a DNS change that does not hurt users:</strong> what TTL really controls, why "I changed DNS an hour ago and it still points to the old server" happens, negative caching, and how Java and Node cache (or do not cache) DNS.</li>
<li><strong>Explain anycast, GeoDNS and DNS load balancing</strong> — one IP in many cities, answers that depend on where you ask from, and why round-robin DNS is not a health check.</li>
<li><strong>Diagnose DNS failures</strong> with evidence: SERVFAIL from a broken DNSSEC signature, a dead name server, an expired domain, a forgotten SOA serial, "it works on my machine but not on yours".</li>
</ul>
<p><strong>Why a developer needs this:</strong> many outages that look like "the server is down" are DNS — a wrong record, an old cached answer, a signature that expired at 3 a.m. Deploying behind a CDN, adding a custom domain to a SaaS, connecting to a cloud database with an SRV string, or moving to a new server all go through DNS. Everything in this chapter is measured on your machine, on a complete private DNS tree (root → TLD → LabFlow) added to the Internet in a box, and checked against the real Internet with <code>cuongthai.com</code>.</p>
</div>

<h3>Four jobs in one lookup</h3>
<p>A name like <code>www.labflow.test</code> is read from right to left: the invisible <strong>root</strong> (written as a final dot, <code>www.labflow.test.</code>), then the <strong>top-level domain</strong> (TLD) <code>test</code>, then the domain <code>labflow</code>, then the host <code>www</code>. Each level is run by a different organisation, and each one only knows who runs the level below it. Four kinds of software share the work:</p>
<table>
<tr><th>Role</th><th>What it does</th><th>In our lab</th><th>In real life</th></tr>
<tr><td><strong>stub resolver</strong></td><td>The small DNS client inside your OS and your program. It asks one question and waits — it never walks the tree itself.</td><td><code>getaddrinfo()</code> in glibc on the laptop</td><td>the same, plus the OS cache (systemd-resolved, macOS, Windows)</td></tr>
<tr><td><strong>recursive resolver</strong></td><td>Does the walking for you: asks root, TLD and the domain's servers, then <strong>caches</strong> the answer for everybody after you.</td><td>Unbound at the ISP, 198.51.100.1</td><td>your ISP's DNS, 1.1.1.1, 8.8.8.8, your company's DNS</td></tr>
<tr><td><strong>root server</strong></td><td>Knows only which servers run each TLD.</td><td><code>a.root-servers.test</code> 192.0.2.10</td><td>13 names, a.root-servers.net … m.root-servers.net</td></tr>
<tr><td><strong>TLD server</strong></td><td>Knows which servers run each domain under it (the <em>delegation</em> the registrar set up when you bought the domain).</td><td><code>ns1.nic.test</code> 192.0.2.20</td><td><code>a.gtld-servers.net</code> … for .com, the VNNIC servers for .vn</td></tr>
<tr><td><strong>authoritative server</strong></td><td>Holds the domain's records and gives the final answer — the owner's word.</td><td><code>ns1</code>/<code>ns2.labflow.test</code></td><td>Cloudflare, Route 53, your own BIND</td></tr>
</table>
<p>The same machine can play two roles — a home router often runs a small cache and forwards everything to the ISP — but the jobs stay separate, and keeping them apart in your head is half of debugging DNS.</p>

<h3>The lab: a private DNS tree inside the Internet in a box</h3>
<p>Chapter 2's lab gets a DNS layer, <code>dns.yml</code>, stacked on top of <code>internet.yml</code>: our own root server, a TLD server for <code>.test</code>, two name servers for <code>labflow.test</code>, the DNS of a CDN, a resolver at the ISP (Unbound) and a "public DNS" that lives in two cities at once. All zones except the CDN's are signed with DNSSEC (lesson 3.5).</p>
<pre><code class="language-text">${TOPO}</code></pre>
${cmd('cd lab/moi-truong', 'docker build -t net-lab-dns -f Dockerfile.dns .            # after net-lab and net-lab-inet (lesson 2.2)', 'docker compose -f internet.yml -f dns.yml -p nfi up -d     # ~20 s: keys, signatures, BGP', 'docker exec -it nfi-laptop bash')}

<h3>Reading one answer from top to bottom</h3>
<p>On the laptop, the stub's configuration file says which resolver to ask; <code>dig</code> sends one question to it and prints the whole reply:</p>
${run('c31-dig', 'cat /etc/resolv.conf', 1, D)}
${run('c31-dig', 'dig www.labflow.test', 1, D)}
<ul>
<li><code>status: NOERROR</code> — the name exists and the question was answered. The two others you will meet: <code>NXDOMAIN</code> (no such name) and <code>SERVFAIL</code> (the resolver could not get a trustworthy answer — lesson 3.5).</li>
<li><code>flags: qr rd ra ad</code> — <strong>qr</strong> this is a reply; <strong>rd</strong> "recursion desired", set by dig: please walk the tree for me; <strong>ra</strong> "recursion available": this server is willing to; <strong>ad</strong> "authenticated data": the resolver checked the DNSSEC signatures (lesson 3.5). An answer from the domain's own server would show <strong>aa</strong> (authoritative answer) — this one does not, it comes from the resolver's cache.</li>
<li><code>QUESTION</code> repeats what was asked: name, class <code>IN</code> (Internet), type <code>A</code> (an IPv4 address).</li>
<li><code>ANSWER</code> has two lines: <code>www.labflow.test</code> is a <strong>CNAME</strong> (an alias) of <code>labflow.test</code>, and <code>labflow.test</code> has the <strong>A</strong> record <code>203.0.113.10</code>. The resolver followed the alias for us. The number <code>300</code> is the <strong>TTL</strong> in seconds — how long anyone may keep this answer (lesson 3.3).</li>
<li><code>OPT PSEUDOSECTION … udp: 1232</code> — EDNS, an extension that lets DNS replies be bigger than the original 512 bytes over UDP; larger than that, DNS switches to TCP.</li>
<li><code>Query time: 13 msec</code>, <code>SERVER: 198.51.100.1#53 (UDP)</code> — who answered, over which transport, and how fast. Ask again:</li>
</ul>
${run('c31-dig', "dig www.labflow.test |", 1, D)}
<p><strong>0 ms instead of 13 ms</strong>: the second time the resolver did not ask anybody — the answer was in its cache. That is the whole point of a recursive resolver: one person pays for the walk, everybody after them gets it almost free.</p>

<h3>Doing the resolver's job by hand</h3>
<p>To see the walk, ask each level yourself. <code>+norecurse</code> clears the <code>rd</code> flag: "just tell me what you know, do not go and ask for me". Start at the root server:</p>
${run('c31-tay', 'dig @192.0.2.10', 1, { ...D, drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|OPT PSEUDO|^; EDNS/ })}
<p>No <code>ANSWER</code> and no <code>aa</code> flag: the root does not know <code>www.labflow.test</code>. What it gives instead is a <strong>referral</strong>: in <code>AUTHORITY</code>, "the zone <code>test.</code> is served by <code>ns1.nic.test</code>", and in <code>ADDITIONAL</code> the address of that server — called <strong>glue</strong>, because without it you would need DNS to find the DNS server. Follow the referral to the TLD:</p>
${run('c31-tay', 'dig @192.0.2.20', 1, { ...D, drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|OPT PSEUDO|^; EDNS/ })}
<p>Another referral, one level down: LabFlow's domain is served by two name servers, with their glue. Ask one of them:</p>
${run('c31-tay', 'dig @203.0.113.53', 1, { ...D, drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|OPT PSEUDO|^; EDNS/ })}
<p>Now the flag <strong>aa</strong> is there and the <code>ANSWER</code> section is filled: this is the owner's own answer. Three questions, two referrals, one answer — exactly what <code>dig +trace</code> automates (it starts by asking its resolver for the list of root servers):</p>
${run('c31-trace', 'dig +trace', 1, D)}
<p>The 172800 next to the NS lines is two days: that is how long a resolver may remember "who runs <code>labflow.test</code>". It is why changing your domain's name servers at the registrar can take up to two days to be seen everywhere.</p>

<h3>What the resolver really sent</h3>
<p>We cleared the resolver's cache, captured every DNS packet on the ISP machine (on both its customer side and its Internet side), and let the laptop ask <code>www.labflow.test</code> twice, one second apart. <code>dnsgoi.sh</code> is a small wrapper around <code>tshark</code> that prints one line per packet:</p>
${run('c31-isp-doc', './dnsgoi.sh', 1, D)}
<p>Read it top to bottom — one question from the laptop at 0.0000 caused nine questions to the Internet:</p>
<ol>
<li><strong>Priming</strong> (<code>. NS</code> to the root): a fresh resolver first checks that the root-server list in its <em>root hints</em> file is current.</li>
<li><code>test A</code> to the root and <code>labflow.test A</code> to the TLD — notice the resolver did <strong>not</strong> send the full name <code>www.labflow.test</code> to them. This is <strong>QNAME minimisation</strong> (RFC 9156): each server only learns the part of the name it needs, so the root never sees which website you visit. Both answers are referrals.</li>
<li><code>www.labflow.test A</code> to ns1, which answers with the CNAME (the answer counts 4 records: CNAME, A and their two signatures). The resolver then asks ns2 for the CNAME's target <code>labflow.test</code> — the two LabFlow servers are used interchangeably.</li>
<li>Three <code>DNSKEY</code> questions (root, test, labflow.test): the resolver fetches each zone's public keys to check the signatures — lesson 3.5. (<code>_ta-…</code> is the resolver telling the root which root key it trusts, RFC 8145 — a statistics signal, not something you need to act on.)</li>
<li>At 0.0097 the answer goes back to the laptop. Total: <strong>9.7 ms</strong> for a cold lookup on a lab where every server is a millisecond away.</li>
<li>At 1.0359 the second question: answered 0.1 ms later, and <strong>nothing</strong> was sent to the Internet.</li>
</ol>
${net('dns', 'trace', 'en', 'Send one lookup through an empty cache and watch every question the resolver asks — then send it again.', { tour: 'dns-trace' })}

<h3>The same walk on the real Internet</h3>
<p>The real root zone has 13 server <em>names</em> — a limit from the original 512-byte UDP reply, which had room for 13 names with their addresses:</p>
${run('c31-goc', 'dig +short NS .', 1, D)}
<p>But 13 names are not 13 machines. On 1 November 2026, root-servers.org listed <strong>2 049</strong> instances of them, run by 12 organisations. Each name is one IP address announced from many cities at once (<strong>anycast</strong>, lesson 3.4), and your packets reach the nearest copy. Many root servers answer a special question, <code>id.server</code> in the CHAOS class, with the name of the copy that answered. From the course lab in Vietnam:</p>
${run('c31-goc', 'for l in', 1, D)}
<p>F, K and M answered from Hanoi (<code>han</code>), B, C, D and J from Singapore (<code>sin</code>, <code>sgsg</code>), E from Hong Kong, A from near Washington (<code>iad</code>) — same addresses everybody in the world uses, different machines. Now the real walk for this website:</p>
${run('c31-goc', 'dig +trace', 1, D)}
<p>Root → the 13 <code>gtld-servers.net</code> servers of <code>.com</code> → Cloudflare's two name servers for <code>cuongthai.com</code> (<code>kyrie</code> and <code>meilani</code>) → the address. Look at the times: 206 ms and 225 ms for the copies of the root and the <code>.com</code> servers <code>dig</code> happened to pick, 43 ms for Cloudflare. A resolver remembers the referrals for two days, so real users almost never pay those first two steps.</p>

<h3>The stub side: your program does not run dig</h3>
<p><code>dig</code> is a DNS tool: it speaks DNS directly to a server. Your program does not. <code>curl</code>, browsers, Node's <code>http</code>, Java, Python and database drivers call the C library function <code>getaddrinfo()</code>, and that function follows <code>/etc/nsswitch.conf</code>:</p>
${run('c31-stub', "grep '^hosts'", 1, D)}
<p><code>files dns</code>: look in <strong>/etc/hosts first</strong>, and only if the name is not there, ask DNS. Someone added a line for a test and forgot it:</p>
${run('c31-stub', 'echo', 5, D)}
<p>Same name, same moment, two answers. <code>getent</code>, <code>curl</code> and Node's <code>dns.lookup</code> go through <code>getaddrinfo</code> and get the hosts file's <code>203.0.113.11</code> — the Singapore edge; <code>dig</code> and Node's <code>dns.resolve4</code> speak DNS and get <code>203.0.113.10</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"dig says the record is right, but my app still connects to the old server."</strong> Then the app is not using DNS the way dig does. Check, in this order: <code>getent ahosts &lt;name&gt;</code> (what every normal program will get), <code>/etc/hosts</code>, then the program's own cache (Java, lesson 3.3). In Node, <code>dns.lookup</code> = <code>getaddrinfo</code> (what <code>http</code> and <code>fetch</code> use), <code>dns.resolve*</code> = DNS only. In Docker, <code>extra_hosts:</code> in a compose file writes into the container's <code>/etc/hosts</code> — same trap, in YAML.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Short names, search domains and "ndots".</strong> <code>/etc/resolv.conf</code> can list <code>search</code> domains that the stub appends to short names. The rule (<code>options ndots:N</code>): a name with fewer than N dots is tried <em>with</em> each search domain <strong>first</strong>. Kubernetes writes <code>ndots:5</code> into every pod. We set the same on the laptop and counted the real questions:</p>
${run('c31-ndots', 'printf', 1, D)}
${run('c31-ndots', 'getent ahostsv4 api', 3, D)}
${run('c31-ndots', 'tshark', 1, D)}
<p><code>api</code> became <code>api.labflow.test</code> — convenient. But <code>labflow.cdn.test</code> (2 dots, fewer than 5) was first tried as <code>labflow.cdn.test.labflow.test</code> → NXDOMAIN, and only then as itself: one wasted round trip for every lookup of an outside name (in a Kubernetes pod with three search domains, three wasted round trips). The fix in code or config: write the full name with a <strong>final dot</strong> — <code>labflow.cdn.test.</code> was asked only once.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>"My DNS server is 127.0.0.53?"</strong> On Ubuntu (and most systemd-based Linux), <code>/etc/resolv.conf</code> points to a local cache, not to your real DNS server. We started an Ubuntu machine with systemd on the home network:</p>
${run('c31-ubuntu', 'ls -l', 3, D)}
${run('c31-ubuntu', 'resolvectl query', 3, D)}
<p><code>127.0.0.53</code> is <strong>systemd-resolved</strong>, a local process that caches and forwards to the real server (<code>198.51.100.1</code>, shown by <code>resolvectl status</code>). The second query says <code>Data from: cache</code> — answered on the machine itself. So when someone tells you "flush DNS", there may be several caches to flush: here, <code>resolvectl flush-caches</code> on the machine, and the resolver. Docker does the same trick: containers on a user-defined network see <code>nameserver 127.0.0.11</code>, Docker's embedded DNS server, which knows the names of the other containers and forwards the rest.</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>The <strong>stub</strong> is library code inside your process: glibc's <code>getaddrinfo()</code> reads <code>/etc/nsswitch.conf</code>, <code>/etc/hosts</code> and <code>/etc/resolv.conf</code>, builds a DNS message of a few dozen bytes and sends it in one UDP datagram to port 53. It blocks the calling thread until the answer arrives — Node therefore runs it on its libuv thread pool (lesson 3.3).</li>
<li>The <strong>resolver</strong> (Unbound here) is a long-running server process whose cache is a hash table in RAM: name + type → records + expiry time. Walking the tree is a small state machine per question; thousands run at once.</li>
<li>The <strong>authoritative</strong> servers (BIND here) load the zone file into memory at start and answer from it — they never ask anybody else.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP and file sharing', giong: 'the resolver walks root → TLD → authoritative using referrals, then caches; dig +trace', khac: 'NWC204 measures through 1.1.1.1 on the real Internet and covers DNS in one part of a lesson on five services', them: 'a private DNS tree you can inspect and break, a capture of every question the resolver sends (QNAME minimisation, DNSSEC keys, cache hit), root anycast copies measured from Vietnam, and the stub side: /etc/hosts, getent vs dig, ndots, systemd-resolved' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a new teammate writes in the team chat: "DNS is a big server that knows every name, and dig shows what my app sees." Your lead asks you to answer with evidence from the lab.</p>
<ol>
<li>From <code>nfi-laptop</code>, run <code>dig +trace +nodnssec api.labflow.test</code>. For each block, write which server answered, who runs it (root / registry / LabFlow) and whether it gave a referral or the answer.</li>
<li>Repeat the last step by hand: <code>dig @203.0.113.54 api.labflow.test +norecurse</code>. Which flag proves it is the owner's answer? Run <code>dig api.labflow.test</code> twice through the resolver — compare <code>Query time</code> and the flags.</li>
<li>Add <code>203.0.113.11 api.labflow.test</code> to <code>/etc/hosts</code>. Compare <code>dig +short api.labflow.test</code>, <code>getent ahosts api.labflow.test</code> and <code>curl -s http://api.labflow.test/</code>. Then remove the line (<code>grep -v</code> into a temp file, then <code>cat</code> it back — <code>sed -i</code> fails on Docker's bind-mounted <code>/etc/hosts</code>).</li>
<li>Write three sentences for the teammate.</li>
</ol>
<p><strong>Done when:</strong> your answer names the four roles, shows the <code>aa</code> flag and a referral from the lab, and explains with the hosts-file experiment why "dig says X" does not prove "my app gets X".</p>
<details><summary>Solution</summary>
<p>1) From the resolver: the list of root servers. From <code>a.root-servers.test</code> (the root): referral to <code>ns1.nic.test</code>. From <code>ns1.nic.test</code> (the <code>.test</code> registry): referral to <code>ns1</code>/<code>ns2.labflow.test</code>. From ns1 or ns2 (LabFlow): the answer <code>api.labflow.test 120 IN A 203.0.113.10</code>. 2) The <code>aa</code> flag. Through the resolver the first query takes a few ms, the second about 0 ms and has <code>ra</code> but no <code>aa</code> — it came from the cache. 3) dig: 203.0.113.10; getent: 203.0.113.11; curl prints "LabFlow edge Singapore (server 203.0.113.11)". 4) "There is no single server: a lookup goes from a resolver to the root, to the registry of .test and to LabFlow's own servers, each knowing one part, and the resolver caches the result. Only the last server (flag aa) owns the answer. And dig only shows DNS: real programs ask getaddrinfo, which reads /etc/hosts first — so check getent, not only dig."</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['stub resolver (bộ phân giải đầu cuối)', 'The DNS client in your OS/program (getaddrinfo): asks one resolver, never walks the tree.'],
    ['recursive resolver (bộ phân giải đệ quy)', 'Walks root → TLD → authoritative for you and caches the result for everyone.'],
    ['authoritative server (máy chủ có thẩm quyền)', 'Holds a zone’s records; its answers carry the aa flag.'],
    ['referral (lời giới thiệu)', '“I don’t know, ask these servers”: NS records in AUTHORITY, no answer.'],
    ['glue (bản ghi keo)', 'Addresses of the name servers sent with a referral, so you can reach them without another lookup.'],
    ['TLD — top-level domain (tên miền cấp cao nhất)', 'The last label of a name: com, vn, test. Run by a registry.'],
    ['QNAME minimisation', 'The resolver sends each server only the part of the name it needs (RFC 9156).'],
    ['ndots / search', 'resolv.conf rule: names with fewer than N dots are tried with the search domains first.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A lookup involves four roles: stub (in your program) → recursive resolver → root → TLD → authoritative.</li>
<li>Root and TLD servers give referrals (NS + glue); only the authoritative server gives the answer, with the <code>aa</code> flag.</li>
<li>The resolver caches: our cold lookup sent 9 questions in 9.7 ms, the second one sent none and took 0.1 ms.</li>
<li>13 root names are 2 049 machines (anycast): from Vietnam, F, K and M answer from Hanoi.</li>
<li>Programs use <code>getaddrinfo</code> (hosts file first, search/ndots, local caches like 127.0.0.53) — <code>dig</code> does not. Debug with <code>getent</code>, not only <code>dig</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1034', '📄', 'RFC 1034 — Domain names: concepts and facilities (1987)', 'Resolvers, name servers, zones, delegation and caching — the design that still runs today.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9156', '📄', 'RFC 9156 — DNS Query Name Minimisation', 'Why the root only saw “test” in our capture.', 'Open')}
${L('https://root-servers.org/', '🌍', 'root-servers.org', 'The 13 root server identities, their operators and every instance on a map.', 'Open')}
${L('https://man7.org/linux/man-pages/man5/resolv.conf.5.html', '📄', 'man 5 resolv.conf', 'nameserver, search, ndots, timeout, attempts.', 'Open')}
${L('https://www.freedesktop.org/software/systemd/man/latest/systemd-resolved.service.html', '📄', 'systemd-resolved.service', 'The local stub at 127.0.0.53 and how resolv.conf is managed.', 'Open')}
${L('https://nodejs.org/api/dns.html', '📄', 'Node.js — dns module', 'dns.lookup (getaddrinfo) versus dns.resolve (DNS only): “Implementation considerations”.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Phân giải: stub, recursive resolver, root, TLD, authoritative</h2>
<p class="lead">Code của bạn ghi <code>fetch("https://api.labflow.test/")</code>. Trước khi một byte HTTP nào được gửi đi, phải có thứ gì đó đổi cái tên ấy thành một địa chỉ. Ai biết câu trả lời? Không ai biết trọn ở một chỗ — câu trả lời nằm rải trên nhiều máy chủ, mỗi máy chỉ biết một phần của cái tên. Bài này đi theo một lần tra tên từ chương trình của bạn tới những máy chủ đó rồi quay về, trên một cây DNS do chính bạn chạy, rồi trên Internet thật — và chỉ ra những chỗ mà "DNS chạy đúng" và "ứng dụng của tôi nhận đúng địa chỉ" là hai chuyện khác nhau.</p>

<div class="callout info">
<p><strong>🎯 Chương 3 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Lần một cái tên bất kỳ từ gốc xuống</strong> và nói được máy chủ nào trả phần nào của câu trả lời — bằng <code>dig +trace</code>, hoặc bằng tay.</li>
<li><strong>Đọc và viết các bản ghi DNS</strong> mà lập trình viên đụng tới: A/AAAA, CNAME (và vì sao không đặt ở đỉnh tên miền), MX, TXT để xác minh, SRV cho <code>mongodb+srv://</code>, CAA, HTTPS.</li>
<li><strong>Lên kế hoạch đổi DNS không làm khổ người dùng:</strong> TTL thật ra điều khiển cái gì, vì sao "tôi đổi DNS một tiếng rồi mà vẫn trỏ về máy cũ", cache âm, và Java với Node có cache DNS (hay không) ra sao.</li>
<li><strong>Giải thích anycast, GeoDNS và cân bằng tải bằng DNS</strong> — một IP ở nhiều thành phố, câu trả lời tuỳ bạn hỏi từ đâu, và vì sao DNS round-robin không phải là kiểm tra sức khoẻ máy chủ.</li>
<li><strong>Chẩn đoán lỗi DNS</strong> có bằng chứng: SERVFAIL vì chữ ký DNSSEC hỏng, máy chủ tên chết, tên miền hết hạn, quên tăng serial SOA, "máy tôi chạy mà máy bạn không".</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> nhiều sự cố trông như "máy chủ sập" thật ra là DNS — một bản ghi sai, một câu trả lời cũ còn nằm trong cache, một chữ ký hết hạn lúc 3 giờ sáng. Triển khai sau CDN, gắn tên miền riêng vào một dịch vụ SaaS, kết nối cơ sở dữ liệu đám mây bằng chuỗi SRV, hay chuyển sang máy chủ mới — tất cả đều đi qua DNS. Mọi thứ trong chương này đều đo trên máy bạn, trên một cây DNS riêng đầy đủ (gốc → TLD → LabFlow) gắn thêm vào Internet trong một hộp, và đối chiếu với Internet thật bằng <code>cuongthai.com</code>.</p>
</div>

<h3>Bốn vai trong một lần tra tên</h3>
<p>Một cái tên như <code>www.labflow.test</code> được đọc từ phải sang trái: <strong>gốc (root)</strong> vô hình (viết bằng dấu chấm cuối, <code>www.labflow.test.</code>), rồi <strong>tên miền cấp cao nhất (TLD — top-level domain)</strong> <code>test</code>, rồi tên miền <code>labflow</code>, rồi tên máy <code>www</code>. Mỗi cấp do một tổ chức khác vận hành, và mỗi cấp chỉ biết ai vận hành cấp ngay dưới nó. Bốn loại phần mềm chia nhau công việc:</p>
<table>
<tr><th>Vai</th><th>Làm gì</th><th>Trong lab</th><th>Ngoài đời</th></tr>
<tr><td><strong>stub resolver</strong> (bộ phân giải đầu cuối)</td><td>Phần DNS nhỏ trong hệ điều hành và chương trình của bạn. Nó hỏi một câu rồi chờ — không bao giờ tự đi dọc cây.</td><td><code>getaddrinfo()</code> của glibc trên laptop</td><td>như vậy, cộng cache của hệ điều hành (systemd-resolved, macOS, Windows)</td></tr>
<tr><td><strong>recursive resolver</strong> (bộ phân giải đệ quy)</td><td>Đi hỏi thay bạn: hỏi gốc, TLD và máy chủ của tên miền, rồi <strong>lưu cache</strong> câu trả lời cho mọi người hỏi sau.</td><td>Unbound ở nhà mạng, 198.51.100.1</td><td>DNS của nhà mạng, 1.1.1.1, 8.8.8.8, DNS của công ty</td></tr>
<tr><td><strong>root server</strong> (máy chủ gốc)</td><td>Chỉ biết những máy chủ nào vận hành từng TLD.</td><td><code>a.root-servers.test</code> 192.0.2.10</td><td>13 tên, a.root-servers.net … m.root-servers.net</td></tr>
<tr><td><strong>TLD server</strong></td><td>Biết máy chủ nào vận hành từng tên miền dưới nó (phần <em>ủy quyền — delegation</em> mà nhà đăng ký dựng lúc bạn mua tên miền).</td><td><code>ns1.nic.test</code> 192.0.2.20</td><td><code>a.gtld-servers.net</code> … cho .com, máy chủ của VNNIC cho .vn</td></tr>
<tr><td><strong>authoritative server</strong> (máy chủ có thẩm quyền)</td><td>Giữ các bản ghi của tên miền và đưa ra câu trả lời cuối — lời của chính chủ.</td><td><code>ns1</code>/<code>ns2.labflow.test</code></td><td>Cloudflare, Route 53, BIND của chính bạn</td></tr>
</table>
<p>Một máy có thể đóng hai vai — router nhà thường chạy một cache nhỏ rồi chuyển hết lên nhà mạng — nhưng các việc vẫn tách bạch, và giữ chúng tách bạch trong đầu là một nửa việc gỡ lỗi DNS.</p>

<h3>Phòng lab: một cây DNS riêng bên trong Internet trong một hộp</h3>
<p>Lab của Chương 2 có thêm một lớp DNS, <code>dns.yml</code>, chồng lên <code>internet.yml</code>: máy chủ gốc của riêng ta, máy chủ TLD cho <code>.test</code>, hai máy chủ tên cho <code>labflow.test</code>, DNS của một CDN, một resolver ở nhà mạng (Unbound) và một "DNS công cộng" sống ở hai thành phố cùng lúc. Mọi vùng trừ vùng của CDN đều được ký DNSSEC (bài 3.5).</p>
<pre><code class="language-text">${TOPO}</code></pre>
${cmd('cd lab/moi-truong', 'docker build -t net-lab-dns -f Dockerfile.dns .            # sau net-lab và net-lab-inet (bài 2.2)', 'docker compose -f internet.yml -f dns.yml -p nfi up -d     # ~20 s: khoá, chữ ký, BGP', 'docker exec -it nfi-laptop bash')}

<h3>Đọc một câu trả lời từ trên xuống</h3>
<p>Trên laptop, tệp cấu hình của stub cho biết hỏi resolver nào; <code>dig</code> gửi một câu hỏi tới đó và in toàn bộ câu trả lời:</p>
${run('c31-dig', 'cat /etc/resolv.conf', 1, D)}
${run('c31-dig', 'dig www.labflow.test', 1, D)}
<ul>
<li><code>status: NOERROR</code> — tên có tồn tại và câu hỏi đã được trả lời. Hai trạng thái khác bạn sẽ gặp: <code>NXDOMAIN</code> (không có tên này) và <code>SERVFAIL</code> (resolver không lấy được câu trả lời đáng tin — bài 3.5).</li>
<li><code>flags: qr rd ra ad</code> — <strong>qr</strong> đây là câu trả lời; <strong>rd</strong> "recursion desired" (muốn đệ quy), dig bật: làm ơn đi hỏi hộ tôi; <strong>ra</strong> "recursion available": máy này sẵn lòng làm; <strong>ad</strong> "authenticated data": resolver đã kiểm chữ ký DNSSEC (bài 3.5). Câu trả lời từ chính máy chủ của tên miền sẽ có <strong>aa</strong> (authoritative answer — trả lời có thẩm quyền) — câu này không có, nó đến từ cache của resolver.</li>
<li><code>QUESTION</code> nhắc lại câu đã hỏi: tên, lớp <code>IN</code> (Internet), loại <code>A</code> (một địa chỉ IPv4).</li>
<li><code>ANSWER</code> có hai dòng: <code>www.labflow.test</code> là một <strong>CNAME</strong> (bí danh) của <code>labflow.test</code>, và <code>labflow.test</code> có bản ghi <strong>A</strong> là <code>203.0.113.10</code>. Resolver đã đi theo bí danh hộ ta. Con số <code>300</code> là <strong>TTL</strong> tính bằng giây — ai cũng được giữ câu trả lời này bấy lâu (bài 3.3).</li>
<li><code>OPT PSEUDOSECTION … udp: 1232</code> — EDNS, phần mở rộng cho phép câu trả lời DNS qua UDP lớn hơn 512 byte ban đầu; lớn hơn nữa thì DNS chuyển sang TCP.</li>
<li><code>Query time: 13 msec</code>, <code>SERVER: 198.51.100.1#53 (UDP)</code> — ai trả lời, qua đường nào, nhanh bao nhiêu. Hỏi lại:</li>
</ul>
${run('c31-dig', "dig www.labflow.test |", 1, D)}
<p><strong>0 ms thay vì 13 ms</strong>: lần hai resolver không hỏi ai cả — câu trả lời đã có trong cache. Đó là toàn bộ ý nghĩa của một recursive resolver: một người trả giá cho lượt đi, mọi người sau gần như được miễn phí.</p>

<h3>Tự làm việc của resolver bằng tay</h3>
<p>Muốn thấy lượt đi, hãy tự hỏi từng cấp. <code>+norecurse</code> tắt cờ <code>rd</code>: "cứ nói cái anh biết, đừng đi hỏi hộ tôi". Bắt đầu ở máy chủ gốc:</p>
${run('c31-tay', 'dig @192.0.2.10', 1, { ...D, drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|OPT PSEUDO|^; EDNS/ })}
<p>Không có <code>ANSWER</code> và không có cờ <code>aa</code>: máy chủ gốc không biết <code>www.labflow.test</code>. Thay vào đó nó đưa một <strong>lời giới thiệu (referral)</strong>: ở <code>AUTHORITY</code>, "vùng <code>test.</code> do <code>ns1.nic.test</code> phục vụ", và ở <code>ADDITIONAL</code> là địa chỉ của máy chủ đó — gọi là <strong>glue (bản ghi keo)</strong>, vì thiếu nó thì bạn lại cần DNS để tìm máy chủ DNS. Đi theo lời giới thiệu tới TLD:</p>
${run('c31-tay', 'dig @192.0.2.20', 1, { ...D, drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|OPT PSEUDO|^; EDNS/ })}
<p>Thêm một lời giới thiệu, xuống một cấp: tên miền của LabFlow do hai máy chủ tên phục vụ, kèm glue của chúng. Hỏi một trong hai:</p>
${run('c31-tay', 'dig @203.0.113.53', 1, { ...D, drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN|OPT PSEUDO|^; EDNS/ })}
<p>Giờ cờ <strong>aa</strong> đã có và phần <code>ANSWER</code> được điền: đây là câu trả lời của chính chủ. Ba câu hỏi, hai lời giới thiệu, một câu trả lời — đúng thứ mà <code>dig +trace</code> tự động hoá (nó bắt đầu bằng việc hỏi resolver của nó danh sách máy chủ gốc):</p>
${run('c31-trace', 'dig +trace', 1, D)}
<p>Con số 172800 cạnh các dòng NS là hai ngày: đó là thời gian một resolver được nhớ "ai vận hành <code>labflow.test</code>". Vì thế đổi máy chủ tên của tên miền ở nhà đăng ký có thể mất tới hai ngày mới thấy ở khắp nơi.</p>

<h3>Resolver thật sự đã gửi những gì</h3>
<p>Ta xoá cache của resolver, bắt mọi gói DNS trên máy nhà mạng (cả phía khách hàng lẫn phía Internet), rồi cho laptop hỏi <code>www.labflow.test</code> hai lần, cách nhau một giây. <code>dnsgoi.sh</code> là một lớp bọc nhỏ quanh <code>tshark</code>, in mỗi gói một dòng:</p>
${run('c31-isp-doc', './dnsgoi.sh', 1, D)}
<p>Đọc từ trên xuống — một câu hỏi của laptop lúc 0.0000 sinh ra chín câu hỏi ra Internet:</p>
<ol>
<li><strong>Priming (mồi)</strong> (<code>. NS</code> tới gốc): resolver mới khởi động kiểm lại xem danh sách máy chủ gốc trong tệp <em>root hints</em> của nó còn đúng không.</li>
<li><code>test A</code> tới gốc và <code>labflow.test A</code> tới TLD — để ý resolver <strong>không</strong> gửi cả tên <code>www.labflow.test</code> cho họ. Đó là <strong>QNAME minimisation</strong> (thu gọn tên hỏi, RFC 9156): mỗi máy chủ chỉ biết phần tên nó cần, nên máy chủ gốc không bao giờ thấy bạn vào trang web nào. Cả hai câu trả lời đều là lời giới thiệu.</li>
<li><code>www.labflow.test A</code> tới ns1, trả về CNAME (đếm được 4 bản ghi: CNAME, A và hai chữ ký của chúng). Rồi resolver hỏi ns2 về đích của CNAME là <code>labflow.test</code> — hai máy chủ của LabFlow được dùng thay nhau.</li>
<li>Ba câu hỏi <code>DNSKEY</code> (gốc, test, labflow.test): resolver lấy khoá công khai của từng vùng để kiểm chữ ký — bài 3.5. (<code>_ta-…</code> là resolver báo cho máy chủ gốc biết nó tin khoá gốc nào, RFC 8145 — một tín hiệu thống kê, bạn không cần làm gì với nó.)</li>
<li>Lúc 0.0097 câu trả lời quay về laptop. Tổng cộng <strong>9,7 ms</strong> cho một lần tra "lạnh" trong lab mà máy chủ nào cũng chỉ cách một mili giây.</li>
<li>Lúc 1.0359 là câu hỏi thứ hai: trả lời 0,1 ms sau, và <strong>không có gì</strong> được gửi ra Internet.</li>
</ol>
${net('dns', 'trace', 'vi', 'Gửi một lần tra tên qua cache rỗng và xem từng câu resolver đi hỏi — rồi gửi lại lần nữa.', { tour: 'dns-trace' })}

<h3>Cùng lượt đi đó trên Internet thật</h3>
<p>Vùng gốc thật có 13 <em>tên</em> máy chủ — giới hạn từ câu trả lời UDP 512 byte thuở đầu, chỉ đủ chỗ cho 13 tên kèm địa chỉ:</p>
${run('c31-goc', 'dig +short NS .', 1, D)}
<p>Nhưng 13 tên không phải 13 cái máy. Ngày 1/11/2026, root-servers.org liệt kê <strong>2 049</strong> bản sao (instance) của chúng, do 12 tổ chức vận hành. Mỗi tên là một địa chỉ IP được quảng bá từ nhiều thành phố cùng lúc (<strong>anycast</strong>, bài 3.4), và gói tin của bạn tới bản gần nhất. Nhiều máy chủ gốc trả lời một câu hỏi đặc biệt, <code>id.server</code> ở lớp CHAOS, bằng tên của bản sao vừa trả lời. Từ lab của khoá ở Việt Nam:</p>
${run('c31-goc', 'for l in', 1, D)}
<p>F, K và M trả lời từ Hà Nội (<code>han</code>), B, C, D và J từ Singapore (<code>sin</code>, <code>sgsg</code>), E từ Hồng Kông, A từ gần Washington (<code>iad</code>) — cùng những địa chỉ mà cả thế giới dùng, nhưng khác máy. Giờ là lượt đi thật cho chính website này:</p>
${run('c31-goc', 'dig +trace', 1, D)}
<p>Gốc → 13 máy chủ <code>gtld-servers.net</code> của <code>.com</code> → hai máy chủ tên của Cloudflare cho <code>cuongthai.com</code> (<code>kyrie</code> và <code>meilani</code>) → địa chỉ. Nhìn thời gian: 206 ms và 225 ms cho bản sao của gốc và của máy chủ <code>.com</code> mà <code>dig</code> tình cờ chọn, 43 ms cho Cloudflare. Resolver nhớ các lời giới thiệu trong hai ngày, nên người dùng thật gần như không bao giờ phải trả hai bước đầu đó.</p>

<h3>Phía stub: chương trình của bạn không chạy dig</h3>
<p><code>dig</code> là công cụ DNS: nó nói chuyện DNS thẳng với máy chủ. Chương trình của bạn thì không. <code>curl</code>, trình duyệt, <code>http</code> của Node, Java, Python và các driver cơ sở dữ liệu gọi hàm thư viện C <code>getaddrinfo()</code>, và hàm đó làm theo <code>/etc/nsswitch.conf</code>:</p>
${run('c31-stub', "grep '^hosts'", 1, D)}
<p><code>files dns</code>: tìm trong <strong>/etc/hosts trước</strong>, tên không có ở đó mới hỏi DNS. Ai đó thêm một dòng để thử rồi quên gỡ:</p>
${run('c31-stub', 'echo', 5, D)}
<p>Cùng một tên, cùng một lúc, hai câu trả lời. <code>getent</code>, <code>curl</code> và <code>dns.lookup</code> của Node đi qua <code>getaddrinfo</code> nên nhận <code>203.0.113.11</code> của tệp hosts — máy biên Singapore; <code>dig</code> và <code>dns.resolve4</code> của Node nói DNS nên nhận <code>203.0.113.10</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"dig nói bản ghi đúng rồi, mà ứng dụng vẫn kết nối tới máy chủ cũ."</strong> Vậy là ứng dụng không dùng DNS theo cách dig dùng. Kiểm theo thứ tự: <code>getent ahosts &lt;tên&gt;</code> (cái mà mọi chương trình bình thường sẽ nhận), <code>/etc/hosts</code>, rồi cache riêng của chương trình (Java, bài 3.3). Trong Node, <code>dns.lookup</code> = <code>getaddrinfo</code> (thứ <code>http</code> và <code>fetch</code> dùng), <code>dns.resolve*</code> = chỉ DNS. Trong Docker, <code>extra_hosts:</code> của tệp compose ghi vào <code>/etc/hosts</code> của container — cùng một cái bẫy, viết bằng YAML.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Tên ngắn, tên miền tìm kiếm (search) và "ndots".</strong> <code>/etc/resolv.conf</code> có thể khai các tên miền <code>search</code> mà stub ghép vào sau tên ngắn. Quy tắc (<code>options ndots:N</code>): tên có ít hơn N dấu chấm sẽ được thử <em>kèm</em> từng tên miền search <strong>trước</strong>. Kubernetes ghi <code>ndots:5</code> vào mọi pod. Ta đặt y như vậy trên laptop và đếm câu hỏi thật:</p>
${run('c31-ndots', 'printf', 1, D)}
${run('c31-ndots', 'getent ahostsv4 api', 3, D)}
${run('c31-ndots', 'tshark', 1, D)}
<p><code>api</code> thành <code>api.labflow.test</code> — tiện. Nhưng <code>labflow.cdn.test</code> (2 dấu chấm, ít hơn 5) được thử trước dưới dạng <code>labflow.cdn.test.labflow.test</code> → NXDOMAIN, rồi mới tới chính nó: phí một lượt đi về cho mỗi lần tra tên bên ngoài (trong pod Kubernetes có ba tên miền search là phí ba lượt). Cách sửa trong code hay cấu hình: viết đủ tên với <strong>dấu chấm cuối</strong> — <code>labflow.cdn.test.</code> chỉ bị hỏi một lần.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>"Máy chủ DNS của tôi là 127.0.0.53?"</strong> Trên Ubuntu (và đa số Linux dùng systemd), <code>/etc/resolv.conf</code> trỏ tới một bộ đệm cục bộ, không phải máy chủ DNS thật. Ta khởi động một máy Ubuntu có systemd trong mạng nhà:</p>
${run('c31-ubuntu', 'ls -l', 3, D)}
${run('c31-ubuntu', 'resolvectl query', 3, D)}
<p><code>127.0.0.53</code> là <strong>systemd-resolved</strong>, một tiến trình cục bộ vừa cache vừa chuyển câu hỏi lên máy chủ thật (<code>198.51.100.1</code>, <code>resolvectl status</code> cho thấy). Lần hỏi thứ hai ghi <code>Data from: cache</code> — trả lời ngay trên máy. Nên khi ai đó bảo "xoá cache DNS đi", có thể có vài lớp cache phải xoá: ở đây là <code>resolvectl flush-caches</code> trên máy, và resolver. Docker cũng làm đúng mánh này: container trong mạng do người dùng tạo thấy <code>nameserver 127.0.0.11</code>, máy chủ DNS nhúng của Docker, biết tên các container khác và chuyển phần còn lại đi.</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>Stub</strong> là mã thư viện chạy bên trong tiến trình của bạn: <code>getaddrinfo()</code> của glibc đọc <code>/etc/nsswitch.conf</code>, <code>/etc/hosts</code> và <code>/etc/resolv.conf</code>, dựng một thông điệp DNS vài chục byte và gửi trong một gói UDP tới cổng 53. Nó chặn luồng gọi cho tới khi có câu trả lời — vì vậy Node chạy nó trên thread pool của libuv (bài 3.3).</li>
<li><strong>Resolver</strong> (ở đây là Unbound) là một tiến trình máy chủ chạy lâu dài, cache của nó là một bảng băm trong RAM: tên + loại → bản ghi + lúc hết hạn. Việc đi dọc cây là một máy trạng thái nhỏ cho mỗi câu hỏi; hàng nghìn cái chạy cùng lúc.</li>
<li>Máy chủ <strong>authoritative</strong> (ở đây là BIND) nạp tệp vùng vào bộ nhớ lúc khởi động và trả lời từ đó — chúng không bao giờ đi hỏi ai khác.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP và chia sẻ tệp', giong: 'resolver đi gốc → TLD → authoritative nhờ các lời giới thiệu, rồi cache; dig +trace', khac: 'NWC204 đo qua 1.1.1.1 trên Internet thật và dạy DNS trong một phần của bài về năm dịch vụ', them: 'một cây DNS riêng xem được và làm hỏng được, bắt gói mọi câu resolver gửi đi (QNAME minimisation, khoá DNSSEC, trúng cache), các bản sao anycast của máy chủ gốc đo từ Việt Nam, và phía stub: /etc/hosts, getent với dig, ndots, systemd-resolved' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn mới vào nhóm viết trong kênh chat: "DNS là một máy chủ to biết mọi cái tên, và dig cho thấy đúng thứ ứng dụng của mình thấy." Trưởng nhóm nhờ bạn trả lời bằng bằng chứng từ lab.</p>
<ol>
<li>Từ <code>nfi-laptop</code>, chạy <code>dig +trace +nodnssec api.labflow.test</code>. Với từng khối, ghi máy chủ nào trả lời, ai vận hành nó (gốc / nhà đăng ký / LabFlow) và nó đưa lời giới thiệu hay câu trả lời.</li>
<li>Làm lại bước cuối bằng tay: <code>dig @203.0.113.54 api.labflow.test +norecurse</code>. Cờ nào chứng minh đó là câu trả lời của chính chủ? Chạy <code>dig api.labflow.test</code> hai lần qua resolver — so <code>Query time</code> và các cờ.</li>
<li>Thêm <code>203.0.113.11 api.labflow.test</code> vào <code>/etc/hosts</code>. So <code>dig +short api.labflow.test</code>, <code>getent ahosts api.labflow.test</code> và <code>curl -s http://api.labflow.test/</code>. Rồi gỡ dòng đó (<code>grep -v</code> ra tệp tạm, rồi <code>cat</code> ghi lại — <code>sed -i</code> hỏng trên <code>/etc/hosts</code> mà Docker gắn vào).</li>
<li>Viết ba câu trả lời bạn mới.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời của bạn gọi tên bốn vai, đưa ra cờ <code>aa</code> và một lời giới thiệu từ lab, và giải thích bằng thí nghiệm tệp hosts vì sao "dig nói X" không chứng minh "ứng dụng nhận X".</p>
<details><summary>Lời giải</summary>
<p>1) Từ resolver: danh sách máy chủ gốc. Từ <code>a.root-servers.test</code> (gốc): giới thiệu tới <code>ns1.nic.test</code>. Từ <code>ns1.nic.test</code> (nhà đăng ký <code>.test</code>): giới thiệu tới <code>ns1</code>/<code>ns2.labflow.test</code>. Từ ns1 hoặc ns2 (LabFlow): câu trả lời <code>api.labflow.test 120 IN A 203.0.113.10</code>. 2) Cờ <code>aa</code>. Qua resolver, lần đầu mất vài ms, lần hai gần 0 ms, có <code>ra</code> mà không có <code>aa</code> — nó đến từ cache. 3) dig: 203.0.113.10; getent: 203.0.113.11; curl in "LabFlow edge Singapore (server 203.0.113.11)". 4) "Không có một máy chủ nào biết hết: một lần tra đi từ resolver tới máy chủ gốc, tới nhà đăng ký của .test và tới máy chủ riêng của LabFlow, mỗi nơi biết một phần, và resolver cache kết quả. Chỉ máy chủ cuối (cờ aa) là chủ của câu trả lời. Và dig chỉ cho thấy DNS: chương trình thật hỏi getaddrinfo, thứ đọc /etc/hosts trước — nên hãy kiểm getent, không chỉ dig."</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['stub resolver (bộ phân giải đầu cuối)', 'Phần DNS trong hệ điều hành/chương trình (getaddrinfo): hỏi một resolver, không tự đi dọc cây.'],
    ['recursive resolver (bộ phân giải đệ quy)', 'Đi gốc → TLD → authoritative thay bạn và cache kết quả cho mọi người.'],
    ['authoritative server (máy chủ có thẩm quyền)', 'Giữ bản ghi của một vùng; câu trả lời của nó có cờ aa.'],
    ['referral (lời giới thiệu)', '“Tôi không biết, hãy hỏi những máy này”: bản ghi NS ở AUTHORITY, không có câu trả lời.'],
    ['glue (bản ghi keo)', 'Địa chỉ của máy chủ tên gửi kèm lời giới thiệu, để tới được chúng mà không phải tra thêm.'],
    ['TLD — top-level domain (tên miền cấp cao nhất)', 'Nhãn cuối của tên: com, vn, test. Do một nhà quản lý (registry) vận hành.'],
    ['QNAME minimisation (thu gọn tên hỏi)', 'Resolver chỉ gửi cho mỗi máy chủ phần tên nó cần (RFC 9156).'],
    ['ndots / search', 'Quy tắc của resolv.conf: tên có ít hơn N dấu chấm được thử ghép tên miền search trước.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lần tra tên có bốn vai: stub (trong chương trình) → recursive resolver → gốc → TLD → authoritative.</li>
<li>Máy chủ gốc và TLD đưa lời giới thiệu (NS + glue); chỉ máy chủ authoritative đưa câu trả lời, kèm cờ <code>aa</code>.</li>
<li>Resolver có cache: lần tra lạnh của ta gửi 9 câu hỏi trong 9,7 ms, lần thứ hai không gửi câu nào và mất 0,1 ms.</li>
<li>13 tên máy chủ gốc là 2 049 cái máy (anycast): từ Việt Nam, F, K và M trả lời từ Hà Nội.</li>
<li>Chương trình dùng <code>getaddrinfo</code> (tệp hosts trước, search/ndots, cache cục bộ như 127.0.0.53) — <code>dig</code> thì không. Gỡ lỗi bằng <code>getent</code>, đừng chỉ dùng <code>dig</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1034', '📄', 'RFC 1034 — Tên miền: khái niệm và cơ chế (1987)', 'Resolver, máy chủ tên, vùng, ủy quyền và cache — thiết kế vẫn chạy tới hôm nay.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9156', '📄', 'RFC 9156 — Thu gọn tên hỏi trong DNS', 'Vì sao máy chủ gốc chỉ thấy “test” trong bản bắt gói của ta.', 'Mở')}
${L('https://root-servers.org/', '🌍', 'root-servers.org', '13 danh tính máy chủ gốc, đơn vị vận hành và mọi bản sao trên bản đồ.', 'Mở')}
${L('https://man7.org/linux/man-pages/man5/resolv.conf.5.html', '📄', 'man 5 resolv.conf', 'nameserver, search, ndots, timeout, attempts.', 'Mở')}
${L('https://www.freedesktop.org/software/systemd/man/latest/systemd-resolved.service.html', '📄', 'systemd-resolved.service', 'Stub cục bộ ở 127.0.0.53 và cách resolv.conf được quản lý.', 'Mở')}
${L('https://nodejs.org/api/dns.html', '📄', 'Node.js — module dns', 'dns.lookup (getaddrinfo) khác dns.resolve (chỉ DNS): mục “Implementation considerations”.', 'Mở')}
</div>
`,
};
