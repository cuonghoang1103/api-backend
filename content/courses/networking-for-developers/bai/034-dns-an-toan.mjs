/**
 * Chương 3 · 3.5 — DNSSEC, DoH/DoT và các kiểu hỏng của DNS (slug khung netdev-3-5-dns-an-toan).
 * Output thật: lab/out/c35-*.out.txt. Output GIỮ: c35-dead, c35-isp-infra, c35-mot-ns, c35-that.
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-03-5.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN/ };

export default {
  title: '3.5 — DNSSEC, DoH/DoT and DNS failure modes|||3.5 — DNSSEC, DoH/DoT và các kiểu hỏng của DNS',
  slug: 'netdev-3-5-dns-an-toan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao DNS cần được bảo vệ (giả mạo cache 2008); chuỗi tin cậy DNSSEC đọc từ chữ ký tới mỏ neo gốc, tự tính lại DS; sự cố chữ ký hết hạn: SERVFAIL + EDE 7, +cd, resolver nhớ câu "bogus" 60 s; DoT/DoH bắt gói thấy gì; máy chủ tên chết (3 lần treo 20 s rồi SERVFAIL ngay), một trong hai máy chủ tên chết, tên miền hết hạn; bảng kiểm "máy này vào được, máy kia không".',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>DNSSEC, DoH/DoT and DNS failure modes</h2>
<p class="lead">Plain DNS was designed for a friendly network: one UDP packet, no signature, readable by anyone on the path. Two separate fixes exist — <strong>DNSSEC</strong> proves an answer really comes from the domain's owner, <strong>DoT/DoH</strong> hide your questions from the network — and each adds its own new ways to break. This lesson walks a DNSSEC chain of trust by hand, breaks it the way real operators do (signatures that expire), looks at encrypted DNS on the wire, and ends with the failure modes you will actually meet and a checklist for "it works on my machine but not on yours".</p>

<h3>Why DNS needs protecting</h3>
<p>A resolver accepts the first answer that matches its question's ID and port. In July 2008, CERT published VU#800113: with predictable IDs and fixed source ports, an attacker could flood a resolver with forged answers and <strong>poison its cache</strong> — every user of that resolver then got the attacker's address for a bank's name. Resolvers now randomise the source port as well as the ID, which makes guessing much harder, but nothing in plain DNS proves who wrote an answer, and anybody on the path (the Wi-Fi, the ISP) can read every name you look up. Two different problems, two different tools:</p>
<table>
<tr><th>Problem</th><th>Tool</th><th>Protects</th><th>Does not protect</th></tr>
<tr><td>A forged or altered answer</td><td><strong>DNSSEC</strong> (signatures)</td><td>integrity: the data was signed by the zone's owner</td><td>privacy — DNSSEC answers are readable by anyone</td></tr>
<tr><td>Others seeing your questions</td><td><strong>DoT / DoH</strong> (TLS)</td><td>privacy between you and your resolver</td><td>a resolver that lies — and the resolver still sees everything</td></tr>
</table>

<h3>The DNSSEC chain of trust, read by hand</h3>
<p>Every zone in the lab except the CDN's is signed. Each record set comes with an <strong>RRSIG</strong> (a signature), made with the zone's private key; the public keys are published in the zone as <strong>DNSKEY</strong> records; and the parent zone publishes a <strong>DS</strong> record — a hash of the child's key-signing key — which the parent signs with its own key. Read it from the bottom up:</p>
${run('c35-chuoi', 'dig +dnssec', 2, D)}
<ul>
<li>The A record comes with an RRSIG: type covered <code>A</code>, algorithm <code>13</code> (ECDSA P-256), the original TTL, then the <strong>expiry</strong> and <strong>inception</strong> times (30 days apart), the key tag and the signer <code>labflow.test.</code>, then the signature itself.</li>
<li>Two DNSKEYs: flag <strong>256</strong> = the <em>zone-signing key</em> (signs the records), <strong>257</strong> = the <em>key-signing key</em> (signs the DNSKEY set). Two keys so the busy one can be changed often without touching the parent.</li>
</ul>
${run('c35-chuoi', 'dig +noall +answer labflow.test DS', 3, D)}
<p>The DS that the TLD publishes for <code>labflow.test</code> is exactly the SHA-256 hash we compute ourselves from LabFlow's key-signing key (<code>dnssec-dsfromkey</code>) — the parent vouches for the child's key. The root vouches for <code>test</code> the same way, and the root's own key is the <strong>trust anchor</strong> configured in the resolver (the real Internet's root zone has been signed since 15 July 2010; its anchor is published by IANA):</p>
${run('c35-chuoi', 'cat /dnsz/anchor.conf', 2, D)}
<p>The <code>ad</code> flag means the resolver followed this whole chain and every signature checked out. <code>delv</code> does the same checking locally and tells you the result in words:</p>
${run('c35-chuoi', 'delv -a /dnsz/anchor.conf labflow.test', 2, D)}
<p>"Fully validated" for the CNAME, which lives in the signed <code>labflow.test</code>, and "unsigned answer" for its target in <code>cdn.test</code>: the TLD has no DS for <code>cdn.test</code>, so that zone is <strong>insecure</strong> — a legitimate, provable state ("this zone does not use DNSSEC"), different from <strong>bogus</strong> (signatures that should be there and do not check out).</p>
${net('dnssec', 'chain', 'en', 'Follow the chain from the A record up to the root trust anchor: each link is a signature or a hash you can check.', { tour: 'dnssec-chain' })}

<h3>Incident: the signatures expired</h3>
<p>DNSSEC signatures have an end date. Managed DNS providers re-sign automatically; with your own setup, a re-signing job that dies is a time bomb. We simulate a job that stopped a month ago: the zone is served with signatures that expired two days ago (serial bumped so ns2 copies it too):</p>
${run('c35-ky-hong', 'sed -i', 2, D)}
${run('c35-hong', 'dig', 4, D)}
<ul>
<li><code>SERVFAIL</code> for everybody behind a validating resolver — the site is "down" for them, while the server, the network and the records are all fine.</li>
<li>The resolver says why in an <strong>Extended DNS Error</strong> (RFC 8914): <code>EDE: 7 (Signature Expired)</code>. Not every resolver sends EDE; when it does, read it first.</li>
<li><code>+cd</code> (<em>checking disabled</em>) asks the resolver to skip validation: the address comes back. That is the quick test — <strong>works with +cd, fails without ⇒ DNSSEC problem</strong>.</li>
<li>The RRSIG's validity window ended two days before the current UTC time printed by <code>date -u</code>. (Validators allow some clock skew — Unbound up to one day by default, <code>val-sig-skew-max 86400</code> — so a signature fails a little <em>after</em> its written end date. In our first attempt the signatures had expired exactly one day earlier, and validation passed or failed depending on a few seconds.)</li>
</ul>
<p>Re-signing fixes the zone — but not immediately for users:</p>
${run('c35-ky-sua', 'sed -i', 2, D)}
${run('c35-sua-hoi', 'dig', 1, D)}
${run('c35-isp-bogus', 'unbound-control', 2, D)}
${run('c35-sua-hoi2', 'dig', 1, D)}
<p>The resolver remembers a bogus answer for <code>val-bogus-ttl</code> = 60 seconds so it does not hammer a broken zone; we cleared those entries with <code>flush_bogus</code>. On public resolvers you wait. And for a <em>broken chain</em> (wrong DS at the parent) the wait can be much longer, because the DS record itself is cached with the TLD's TTL: Slack's 30 September 2021 DNSSEC rollout ended in a 24-hour partial outage largely because <code>.com</code> tells resolvers to cache DS records for 24 hours (Lab 3 reproduces a broken chain).</p>
${net('dnssec', 'expired', 'en', 'Let the signatures expire and see who gets SERVFAIL, what +cd changes, and how long the bogus answer stays cached.', { tour: 'dnssec-expired' })}
<p>On the real Internet: <code>cloudflare.com</code> is signed and validates; <code>dnssec-failed.org</code> is deliberately broken by its owner as a test domain; <code>cuongthai.com</code> has no DS — not signed, so no <code>ad</code> flag (a choice: DNSSEC adds safety against forged answers and adds the failure modes above).</p>
${run('c35-that', 'dig +dnssec cloudflare.com', 6, D)}

<h3>Encrypted DNS: DoT and DoH</h3>
<p>We captured, on the home router's Internet side (where an ISP, a café owner or anyone on the path sits), three lookups of the same name: plain DNS, DNS over TLS (DoT, RFC 7858, port 853) and DNS over HTTPS (DoH, RFC 8484, port 443):</p>
${run('c35-rieng-laptop', 'dig', 3, D)}
${run('c35-rieng-doc', 'tshark', 1, D)}
<p>Plain DNS: the name <code>labflow.test</code> is right there. DoT and DoH: a TLS hello (<code>alpn=dot</code>, <code>alpn=h2</code>), then only encrypted bytes. DoH looks like any other HTTPS traffic, which is why browsers adopted it ("Secure DNS" in Chrome and Firefox) and why company networks that filter by DNS often block it. Real public resolvers speak both, plus a JSON API that is handy from code:</p>
${run('c35-that', 'dig +short +tls', 3, D)}
<p>Remember the limits: DoT/DoH hide your questions from the <em>network</em>, not from the resolver you send them to, and they do not prove the answer is genuine — that is DNSSEC's job.</p>

<h3>Failure modes you will meet</h3>
<div class="pitfall co-tieu-de">
<p><strong>1 · A dead name server.</strong> <code>dead.test</code> is delegated to a server that never answers (its packets are dropped silently). Seven lookups, each with a new name and a 20-second limit:</p>
${run('c35-dead', 'for n in', 1, D)}
${run('c35-isp-infra', 'unbound-control', 2, D)}
<p>The first three users each waited 20 seconds and got <em>nothing</em> — not even an error, because Unbound drops a client's query it cannot answer within about 2 seconds. Meanwhile the resolver raised its timeout for that server (<code>rto 24064</code> ms) until it gave up: from the fourth query on, <code>SERVFAIL</code> in 0.0 s, and the resolver will keep that verdict for up to 15 minutes (<code>infra-host-ttl 900</code>). For your app: the first lookups hang (Node's <code>EAI_AGAIN</code> after 10 s in lesson 3.3), later ones fail fast.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>2 · One of two name servers dead.</strong> We stopped ns2. Each round below forgets the cache <em>and</em> what the resolver knows about the servers, then asks once:</p>
${run('c35-mot-ns', 'for i in 1 2 3 4 5 6', 1, D)}
${run('c35-mot-ns', 'for i in 1 2 3;', 1, D)}
<p>Still working — but when the resolver happened to try ns2 first, the answer took 381 to 1147 ms instead of 1–2 ms. Once it remembers that ns2 does not answer, it goes to ns1 directly. This is the "DNS is sometimes slow" ticket: compare <code>dig @ns1</code> and <code>dig @ns2</code> for every name server in the delegation.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>3 · The domain expired.</strong> When a registration lapses, the registry removes the delegation from the TLD. <code>oldshop.test</code> plays an expired domain:</p>
${run('c35-het-han', 'dig', 2, D)}
<p>The TLD itself answers "no such domain" (its SOA in the authority section): every record of the domain disappears at once, website and email together, and the NXDOMAIN is then cached for the TLD's negative TTL. Turn on auto-renew, and watch domain expiry like you watch certificate expiry.</p>
</div>
<p>Add the ones from earlier lessons: a forgotten SOA serial (3.2 — half the users see the old data), a TTL that was too long when you moved (3.3), a hosts-file line or a search domain (3.1).</p>

<h3>"It works on my machine but not on yours": a checklist</h3>
<table>
<tr><th>Step</th><th>Command (on each machine)</th><th>What it tells you</th></tr>
<tr><td>1. What the app gets</td><td><code>getent ahosts api.labflow.test</code></td><td>includes /etc/hosts and search domains (3.1)</td></tr>
<tr><td>2. Which resolver</td><td><code>cat /etc/resolv.conf</code>, <code>resolvectl status</code></td><td>different resolvers = different caches</td></tr>
<tr><td>3. Each resolver's answer</td><td><code>dig api.labflow.test @&lt;resolver&gt;</code> — look at TTL and status</td><td>an old answer with TTL counting down = cache (3.3)</td></tr>
<tr><td>4. The truth</td><td><code>dig api.labflow.test @ns1</code> and <code>@ns2</code>, plus <code>SOA</code></td><td>servers disagree with the same serial = forgotten serial (3.2)</td></tr>
<tr><td>5. DNSSEC?</td><td><code>dig … +cd</code> vs without; read <code>EDE</code></td><td>works only with +cd = broken signatures / chain</td></tr>
<tr><td>6. Delegation</td><td><code>dig +trace</code></td><td>NXDOMAIN at the TLD = expired or wrong delegation; slow hops = a dead name server</td></tr>
</table>

<h3>Where this lives in the computer</h3>
<ul>
<li>Validation runs in the resolver: for each answer it checks the RRSIG with the DNSKEY, the DNSKEY with the parent's DS, and so on up to the anchor — a few public-key signature checks, cached so they happen once per key, not per query.</li>
<li>Signing happens on the authoritative side, ahead of time: <code>dnssec-signzone</code> (or the provider) writes RRSIGs into the zone; serving a signed zone costs nothing extra per query, only bigger answers.</li>
<li>DoT/DoH are ordinary TLS connections from the stub or browser to the resolver; the resolver's own questions to root, TLD and authoritative servers are still plain DNS.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong', so: '15.1', ten: 'Threats, vulnerabilities and the three families of network attack', giong: 'spoofing works because a plain DNS record is unsigned — security is added on top', khac: 'NWC204 lists the attack families across all layers', them: 'what is added on top for DNS: a DNSSEC chain read and recomputed by hand, a real signature-expiry outage with its EDE code, DoT/DoH captured on the wire, and the operational failures that matter more day to day' })}

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> at 9:05 support reports "LabFlow is down for some customers"; the server's monitoring is green. You suspect DNS.</p>
<ol>
<li>Inject the incident on <code>nfi-ns</code>: <code>sed -i 's/2026110101 3600/2026110109 3600/' /dnsz/src/labflow.test.zone; KY_TU=now-2592000 KY_DEN=now-172800 bash /lab/k/moi-truong/dns/ky.sh labflow.test &amp;&amp; rndc reload labflow.test</code>, then on <code>nfi-isp</code> <code>unbound-control flush_zone labflow.test</code>.</li>
<li>From the laptop, follow the checklist steps 1, 3, 4 and 5. Which step points to the cause? Write the evidence (status, EDE, +cd, RRSIG dates).</li>
<li>Fix it (re-sign without the KY_ variables, bump the serial again). How long until users recover, and how can you speed it up on the ISP resolver?</li>
<li>Explain in two sentences why <code>static.labflow.test</code>'s target is "unsigned" and why that is not an error.</li>
</ol>
<p><strong>Done when:</strong> your note names the cause with three pieces of evidence, the time to recover (60 s bogus cache, or a flush), and the insecure-vs-bogus distinction.</p>
<details><summary>Solution</summary>
<p>2) getent and dig give nothing / SERVFAIL; <code>dig @203.0.113.53 labflow.test</code> answers <code>203.0.113.10</code> with <code>aa</code> (servers are fine, same serial on both); <code>dig labflow.test</code> → <code>SERVFAIL</code> with <code>EDE: 7 (Signature Expired)</code>, but <code>dig +cd</code> → <code>203.0.113.10</code>; the RRSIG ends before today's UTC date. Step 5 points to the cause: expired DNSSEC signatures. 3) Re-sign, bump to <code>2026110110</code>, reload; the resolver may keep the bogus answer for <code>val-bogus-ttl</code> 60 s — <code>unbound-control flush_bogus</code> (or <code>flush_zone</code>) clears it at once; public resolvers recover within that time. Add monitoring of signature expiry. 4) <code>cdn.test</code> has no DS record in the signed <code>test</code> zone, and the TLD's signed NSEC proves that absence: the zone is provably insecure (not signed), which validators accept. Bogus would be a zone that should be signed (DS present) whose signatures do not verify.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['DNSSEC', 'Signatures on DNS data so a validating resolver can prove an answer comes from the zone’s owner.'],
    ['RRSIG / DNSKEY / DS', 'Signature on a record set / the zone’s public keys / hash of a child’s key, published by the parent.'],
    ['KSK / ZSK', 'Key-signing key (signs the DNSKEY set, referenced by DS) / zone-signing key (signs the records).'],
    ['trust anchor (mỏ neo tin cậy)', 'The root key a resolver trusts without proof; every chain ends there.'],
    ['secure / insecure / bogus', 'Validated / provably unsigned (no DS) / should validate but does not ⇒ SERVFAIL.'],
    ['EDE — Extended DNS Error (RFC 8914)', 'Reason code attached to an error, e.g. 7 Signature Expired, 9 DNSKEY Missing.'],
    ['+cd (checking disabled)', 'Ask a resolver to skip validation — the quick test for DNSSEC problems.'],
    ['DoT / DoH', 'DNS over TLS (port 853) / DNS over HTTPS (443): hide questions from the network.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>DNSSEC proves integrity (RRSIG ← DNSKEY ← DS at the parent ← … ← root anchor); DoT/DoH give privacy from the network. Neither does the other’s job.</li>
<li>Expired signatures ⇒ SERVFAIL for validating users while everything else is fine; EDE says why; +cd proves it; bogus answers stay cached ~60 s.</li>
<li>Insecure (no DS) is a valid state; bogus is an outage.</li>
<li>A dead name server: first lookups hang (3 × 20 s), then instant SERVFAIL for up to 15 minutes; one of two dead ⇒ some lookups take 0.4–1.1 s.</li>
<li>An expired domain disappears at the TLD; use the six-step checklist for “works here, not there”.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4033', '📄', 'RFC 4033 — DNS Security Introduction and Requirements', 'What DNSSEC protects and what it does not.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc4034', '📄', 'RFC 4034 — Resource records for DNSSEC', 'DNSKEY, RRSIG, NSEC and DS formats; key flags 256/257.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8914', '📄', 'RFC 8914 — Extended DNS Errors', 'The EDE codes, including 7 (Signature Expired) and 9 (DNSKEY Missing).', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc7858', '📄', 'RFC 7858 — DNS over TLS', 'Port 853.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8484', '📄', 'RFC 8484 — DNS queries over HTTPS (DoH)', 'DNS messages in HTTP/2 on port 443.', 'Open')}
${L('https://www.kb.cert.org/vuls/id/800113', '🛡️', 'CERT VU#800113 — DNS cache poisoning (8 July 2008)', 'Predictable IDs and fixed ports let attackers poison resolver caches.', 'Open')}
${L('https://www.iana.org/archive/root-dnssec-launch', '🌍', 'IANA — Initial root DNSSEC design and launch (2008–2010)', 'How the root zone came to be signed in July 2010.', 'Open')}
${L('https://slack.engineering/what-happened-during-slacks-dnssec-rollout/', '📝', 'Slack — What happened during Slack’s DNSSEC rollout', '30 September 2021: cached DS records and a 24-hour partial outage.', 'Open')}
${L('https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/', '☁️', 'Cloudflare — DoH JSON API', 'The JSON format used with curl in this lesson.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>DNSSEC, DoH/DoT và các kiểu hỏng của DNS</h2>
<p class="lead">DNS thuần được thiết kế cho một mạng thân thiện: một gói UDP, không chữ ký, ai đứng trên đường cũng đọc được. Có hai cách sửa riêng biệt — <strong>DNSSEC</strong> chứng minh câu trả lời thật sự đến từ chủ tên miền, <strong>DoT/DoH</strong> giấu câu hỏi của bạn khỏi mạng — và mỗi cách lại thêm những kiểu hỏng mới. Bài này đi một chuỗi tin cậy DNSSEC bằng tay, làm hỏng nó theo đúng cách người vận hành thật hay làm (chữ ký hết hạn), nhìn DNS mã hoá trên dây, và kết thúc bằng những kiểu hỏng bạn sẽ thật sự gặp cùng một bảng kiểm cho "máy tôi chạy mà máy bạn không".</p>

<h3>Vì sao DNS cần được bảo vệ</h3>
<p>Resolver chấp nhận câu trả lời đầu tiên khớp ID và cổng của câu hỏi. Tháng 7/2008, CERT công bố VU#800113: với ID đoán được và cổng nguồn cố định, kẻ tấn công có thể dội vào resolver hàng loạt câu trả lời giả và <strong>đầu độc cache</strong> của nó — mọi người dùng resolver đó sau đấy nhận địa chỉ của kẻ tấn công cho tên của một ngân hàng. Ngày nay resolver ngẫu nhiên hoá cả cổng nguồn lẫn ID, khiến việc đoán khó hơn nhiều, nhưng DNS thuần vẫn không có gì chứng minh ai viết câu trả lời, và bất kỳ ai trên đường đi (Wi-Fi, nhà mạng) đều đọc được mọi cái tên bạn tra. Hai vấn đề khác nhau, hai công cụ khác nhau:</p>
<table>
<tr><th>Vấn đề</th><th>Công cụ</th><th>Bảo vệ</th><th>Không bảo vệ</th></tr>
<tr><td>Câu trả lời bị giả hay bị sửa</td><td><strong>DNSSEC</strong> (chữ ký)</td><td>toàn vẹn: dữ liệu do chủ vùng ký</td><td>quyền riêng tư — câu trả lời DNSSEC ai cũng đọc được</td></tr>
<tr><td>Người khác thấy câu hỏi của bạn</td><td><strong>DoT / DoH</strong> (TLS)</td><td>riêng tư giữa bạn và resolver</td><td>một resolver nói dối — và resolver vẫn thấy hết</td></tr>
</table>

<h3>Chuỗi tin cậy DNSSEC, đọc bằng tay</h3>
<p>Mọi vùng trong lab trừ vùng của CDN đều được ký. Mỗi bộ bản ghi đi kèm một <strong>RRSIG</strong> (chữ ký), tạo bằng khoá bí mật của vùng; khoá công khai được công bố trong vùng dưới dạng bản ghi <strong>DNSKEY</strong>; còn vùng cha công bố một bản ghi <strong>DS</strong> — mã băm của khoá ký khoá của vùng con — và vùng cha ký nó bằng khoá của chính mình. Đọc từ dưới lên:</p>
${run('c35-chuoi', 'dig +dnssec', 2, D)}
<ul>
<li>Bản ghi A đi kèm một RRSIG: loại được ký <code>A</code>, thuật toán <code>13</code> (ECDSA P-256), TTL gốc, rồi lúc <strong>hết hạn</strong> và lúc <strong>bắt đầu</strong> hiệu lực (cách nhau 30 ngày), mã khoá và vùng ký <code>labflow.test.</code>, rồi tới chính chữ ký.</li>
<li>Hai DNSKEY: cờ <strong>256</strong> = <em>khoá ký vùng (ZSK)</em> (ký các bản ghi), <strong>257</strong> = <em>khoá ký khoá (KSK)</em> (ký bộ DNSKEY). Hai khoá để khoá làm việc nhiều có thể đổi thường xuyên mà không phải đụng tới vùng cha.</li>
</ul>
${run('c35-chuoi', 'dig +noall +answer labflow.test DS', 3, D)}
<p>DS mà TLD công bố cho <code>labflow.test</code> đúng bằng mã băm SHA-256 ta tự tính từ khoá ký khoá của LabFlow (<code>dnssec-dsfromkey</code>) — vùng cha bảo lãnh cho khoá của vùng con. Vùng gốc bảo lãnh cho <code>test</code> theo cùng cách, và khoá của chính vùng gốc là <strong>mỏ neo tin cậy (trust anchor)</strong> cấu hình sẵn trong resolver (vùng gốc của Internet thật được ký từ ngày 15/7/2010; mỏ neo của nó do IANA công bố):</p>
${run('c35-chuoi', 'cat /dnsz/anchor.conf', 2, D)}
<p>Cờ <code>ad</code> nghĩa là resolver đã đi hết chuỗi này và mọi chữ ký đều hợp lệ. <code>delv</code> kiểm y như vậy ngay trên máy và nói kết quả bằng chữ:</p>
${run('c35-chuoi', 'delv -a /dnsz/anchor.conf labflow.test', 2, D)}
<p>"Fully validated" cho CNAME, vốn nằm trong vùng đã ký <code>labflow.test</code>, và "unsigned answer" cho đích của nó trong <code>cdn.test</code>: TLD không có DS cho <code>cdn.test</code>, nên vùng đó là <strong>insecure (không ký)</strong> — một trạng thái hợp lệ, chứng minh được ("vùng này không dùng DNSSEC"), khác với <strong>bogus (hỏng)</strong> (chữ ký lẽ ra phải có mà kiểm không qua).</p>
${net('dnssec', 'chain', 'vi', 'Đi theo chuỗi từ bản ghi A lên tới mỏ neo gốc: mỗi mắt xích là một chữ ký hoặc một mã băm bạn kiểm được.', { tour: 'dnssec-chain' })}

<h3>Sự cố: chữ ký hết hạn</h3>
<p>Chữ ký DNSSEC có ngày hết hạn. Nhà cung cấp DNS quản lý sẵn tự ký lại; với hệ thống tự dựng, một tác vụ ký lại bị chết là quả bom hẹn giờ. Ta mô phỏng một tác vụ đã ngừng từ tháng trước: vùng được phục vụ với chữ ký đã hết hạn từ hai ngày trước (tăng serial để ns2 cũng chép theo):</p>
${run('c35-ky-hong', 'sed -i', 2, D)}
${run('c35-hong', 'dig', 4, D)}
<ul>
<li><code>SERVFAIL</code> cho mọi người dùng sau một resolver có kiểm DNSSEC — với họ trang web "sập", trong khi máy chủ, mạng và bản ghi đều ổn.</li>
<li>Resolver nói lý do trong một <strong>Extended DNS Error</strong> (lỗi DNS mở rộng, RFC 8914): <code>EDE: 7 (Signature Expired)</code>. Không phải resolver nào cũng gửi EDE; có thì hãy đọc nó trước.</li>
<li><code>+cd</code> (<em>checking disabled</em> — tắt kiểm) bảo resolver bỏ qua bước kiểm: địa chỉ quay về. Đó là phép thử nhanh — <strong>chạy với +cd, hỏng khi không có ⇒ lỗi DNSSEC</strong>.</li>
<li>Khoảng hiệu lực của RRSIG đã kết thúc hai ngày trước giờ UTC hiện tại mà <code>date -u</code> in ra. (Bộ kiểm cho phép lệch đồng hồ một chút — Unbound mặc định tới một ngày, <code>val-sig-skew-max 86400</code> — nên chữ ký hỏng muộn hơn ngày hết hạn ghi trên nó một chút. Ở lần thử đầu, chữ ký hết hạn đúng một ngày trước, và việc kiểm qua hay hỏng tuỳ vào vài giây.)</li>
</ul>
<p>Ký lại thì vùng lành — nhưng người dùng chưa lành ngay:</p>
${run('c35-ky-sua', 'sed -i', 2, D)}
${run('c35-sua-hoi', 'dig', 1, D)}
${run('c35-isp-bogus', 'unbound-control', 2, D)}
${run('c35-sua-hoi2', 'dig', 1, D)}
<p>Resolver nhớ một câu trả lời bogus trong <code>val-bogus-ttl</code> = 60 giây để khỏi dội liên tục vào một vùng hỏng; ta xoá các mục đó bằng <code>flush_bogus</code>. Trên resolver công cộng thì bạn phải chờ. Và với một <em>chuỗi bị đứt</em> (DS sai ở vùng cha) thì có thể phải chờ lâu hơn nhiều, vì chính bản ghi DS được cache theo TTL của TLD: đợt bật DNSSEC của Slack ngày 30/9/2021 kết thúc bằng một sự cố một phần kéo dài 24 giờ phần lớn vì <code>.com</code> bảo resolver cache bản ghi DS 24 giờ (Lab 3 dựng lại một chuỗi bị đứt).</p>
${net('dnssec', 'expired', 'vi', 'Để chữ ký hết hạn rồi xem ai nhận SERVFAIL, +cd thay đổi gì, và câu trả lời bogus nằm trong cache bao lâu.', { tour: 'dnssec-expired' })}
<p>Trên Internet thật: <code>cloudflare.com</code> có ký và kiểm qua; <code>dnssec-failed.org</code> bị chủ của nó cố ý làm hỏng để làm tên miền thử; <code>cuongthai.com</code> không có DS — không ký, nên không có cờ <code>ad</code> (một lựa chọn: DNSSEC thêm an toàn trước câu trả lời giả và thêm luôn các kiểu hỏng ở trên).</p>
${run('c35-that', 'dig +dnssec cloudflare.com', 6, D)}

<h3>DNS mã hoá: DoT và DoH</h3>
<p>Ta bắt gói ở phía Internet của router nhà (chỗ nhà mạng, chủ quán cà phê hay bất kỳ ai trên đường đi đứng) trong lúc tra cùng một tên theo ba cách: DNS thường, DNS qua TLS (DoT, RFC 7858, cổng 853) và DNS qua HTTPS (DoH, RFC 8484, cổng 443):</p>
${run('c35-rieng-laptop', 'dig', 3, D)}
${run('c35-rieng-doc', 'tshark', 1, D)}
<p>DNS thường: cái tên <code>labflow.test</code> nằm ngay đó. DoT và DoH: một lời chào TLS (<code>alpn=dot</code>, <code>alpn=h2</code>), rồi chỉ còn byte đã mã hoá. DoH trông y như mọi lưu lượng HTTPS khác, vì thế trình duyệt đã đưa nó vào ("Secure DNS" trong Chrome và Firefox) và các mạng công ty lọc theo DNS hay chặn nó. Resolver công cộng thật nói được cả hai, cộng một API JSON tiện dùng từ code:</p>
${run('c35-that', 'dig +short +tls', 3, D)}
<p>Nhớ giới hạn: DoT/DoH giấu câu hỏi của bạn khỏi <em>mạng</em>, không giấu khỏi resolver mà bạn gửi tới, và chúng không chứng minh câu trả lời là thật — đó là việc của DNSSEC.</p>

<h3>Những kiểu hỏng bạn sẽ gặp</h3>
<div class="pitfall co-tieu-de">
<p><strong>1 · Một máy chủ tên chết.</strong> <code>dead.test</code> được ủy quyền cho một máy chủ không bao giờ trả lời (gói tới nó bị bỏ lặng lẽ). Bảy lần tra, mỗi lần một tên mới và giới hạn 20 giây:</p>
${run('c35-dead', 'for n in', 1, D)}
${run('c35-isp-infra', 'unbound-control', 2, D)}
<p>Ba người dùng đầu mỗi người chờ 20 giây và nhận về <em>không gì cả</em> — kể cả một thông báo lỗi cũng không, vì Unbound bỏ câu hỏi của client mà nó không trả lời được trong khoảng 2 giây. Trong lúc đó resolver tăng thời gian chờ cho máy chủ đó (<code>rto 24064</code> ms) cho tới khi bỏ cuộc: từ câu thứ tư, <code>SERVFAIL</code> trong 0,0 s, và resolver giữ phán quyết đó tới 15 phút (<code>infra-host-ttl 900</code>). Với ứng dụng của bạn: những lần tra đầu bị treo (<code>EAI_AGAIN</code> của Node sau 10 s ở bài 3.3), những lần sau hỏng nhanh.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>2 · Một trong hai máy chủ tên chết.</strong> Ta tắt ns2. Mỗi vòng dưới đây xoá cache <em>và</em> những gì resolver biết về các máy chủ, rồi hỏi một lần:</p>
${run('c35-mot-ns', 'for i in 1 2 3 4 5 6', 1, D)}
${run('c35-mot-ns', 'for i in 1 2 3;', 1, D)}
<p>Vẫn chạy — nhưng khi resolver tình cờ thử ns2 trước, câu trả lời mất 381 tới 1147 ms thay vì 1–2 ms. Khi đã nhớ ns2 không trả lời, nó đi thẳng tới ns1. Đây là phiếu "DNS thỉnh thoảng chậm": hãy so <code>dig @ns1</code> và <code>dig @ns2</code> cho mọi máy chủ tên trong phần ủy quyền.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>3 · Tên miền hết hạn.</strong> Khi đăng ký hết hạn, nhà quản lý TLD gỡ phần ủy quyền khỏi TLD. <code>oldshop.test</code> đóng vai một tên miền đã hết hạn:</p>
${run('c35-het-han', 'dig', 2, D)}
<p>Chính TLD trả lời "không có tên miền này" (SOA của nó ở phần authority): mọi bản ghi của tên miền biến mất cùng lúc, website lẫn email, rồi câu NXDOMAIN còn được cache theo TTL âm của TLD. Hãy bật tự gia hạn, và theo dõi hạn tên miền như theo dõi hạn chứng chỉ.</p>
</div>
<p>Cộng thêm những kiểu đã gặp ở các bài trước: quên tăng serial SOA (3.2 — một nửa người dùng thấy dữ liệu cũ), TTL quá dài lúc chuyển máy chủ (3.3), một dòng trong tệp hosts hay một tên miền search (3.1).</p>

<h3>"Máy tôi chạy mà máy bạn không": bảng kiểm</h3>
<table>
<tr><th>Bước</th><th>Lệnh (trên từng máy)</th><th>Cho biết điều gì</th></tr>
<tr><td>1. Ứng dụng nhận gì</td><td><code>getent ahosts api.labflow.test</code></td><td>tính cả /etc/hosts và tên miền search (3.1)</td></tr>
<tr><td>2. Resolver nào</td><td><code>cat /etc/resolv.conf</code>, <code>resolvectl status</code></td><td>khác resolver = khác cache</td></tr>
<tr><td>3. Câu trả lời của từng resolver</td><td><code>dig api.labflow.test @&lt;resolver&gt;</code> — xem TTL và status</td><td>câu cũ với TTL đang đếm ngược = cache (3.3)</td></tr>
<tr><td>4. Sự thật</td><td><code>dig api.labflow.test @ns1</code> và <code>@ns2</code>, cộng <code>SOA</code></td><td>hai máy khác nhau mà cùng serial = quên serial (3.2)</td></tr>
<tr><td>5. Có phải DNSSEC?</td><td><code>dig … +cd</code> so với không có; đọc <code>EDE</code></td><td>chỉ chạy với +cd = chữ ký / chuỗi hỏng</td></tr>
<tr><td>6. Ủy quyền</td><td><code>dig +trace</code></td><td>NXDOMAIN ở TLD = hết hạn hoặc ủy quyền sai; chặng chậm = một máy chủ tên chết</td></tr>
</table>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Việc kiểm chạy trong resolver: với mỗi câu trả lời nó kiểm RRSIG bằng DNSKEY, DNSKEY bằng DS của vùng cha, cứ thế lên tới mỏ neo — vài phép kiểm chữ ký khoá công khai, có cache nên mỗi khoá chỉ kiểm một lần chứ không phải mỗi câu hỏi.</li>
<li>Việc ký diễn ra ở phía authoritative, làm trước: <code>dnssec-signzone</code> (hoặc nhà cung cấp) ghi RRSIG vào vùng; phục vụ vùng đã ký không tốn thêm gì cho mỗi câu hỏi, chỉ có câu trả lời to hơn.</li>
<li>DoT/DoH là các kết nối TLS bình thường từ stub hay trình duyệt tới resolver; các câu hỏi của chính resolver tới gốc, TLD và máy chủ authoritative vẫn là DNS thường.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong', so: '15.1', ten: 'Mối đe doạ, lỗ hổng và ba họ tấn công mạng', giong: 'giả mạo được vì một bản ghi DNS thuần không có chữ ký — an ninh là thứ thêm vào bên trên', khac: 'NWC204 liệt kê các họ tấn công ở mọi tầng', them: 'thứ được thêm vào bên trên cho DNS: một chuỗi DNSSEC đọc và tự tính lại bằng tay, một sự cố chữ ký hết hạn thật kèm mã EDE, DoT/DoH bắt trên dây, và các kiểu hỏng vận hành quan trọng hơn trong công việc hằng ngày' })}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> 9:05 đội hỗ trợ báo "LabFlow sập với một số khách hàng"; giám sát máy chủ vẫn xanh. Bạn nghi DNS.</p>
<ol>
<li>Cài sự cố trên <code>nfi-ns</code>: <code>sed -i 's/2026110101 3600/2026110109 3600/' /dnsz/src/labflow.test.zone; KY_TU=now-2592000 KY_DEN=now-172800 bash /lab/k/moi-truong/dns/ky.sh labflow.test &amp;&amp; rndc reload labflow.test</code>, rồi trên <code>nfi-isp</code> chạy <code>unbound-control flush_zone labflow.test</code>.</li>
<li>Từ laptop, làm theo các bước 1, 3, 4 và 5 của bảng kiểm. Bước nào chỉ ra nguyên nhân? Ghi bằng chứng (status, EDE, +cd, ngày của RRSIG).</li>
<li>Sửa (ký lại không có các biến KY_, tăng serial lần nữa). Bao lâu thì người dùng lành, và làm sao rút ngắn trên resolver nhà mạng?</li>
<li>Giải thích trong hai câu vì sao đích của <code>static.labflow.test</code> là "unsigned" và vì sao đó không phải lỗi.</li>
</ol>
<p><strong>Đạt khi:</strong> ghi chú của bạn gọi đúng nguyên nhân với ba bằng chứng, thời gian để lành (cache bogus 60 s, hoặc xoá cache), và phân biệt được insecure với bogus.</p>
<details><summary>Lời giải</summary>
<p>2) getent và dig không ra gì / SERVFAIL; <code>dig @203.0.113.53 labflow.test</code> trả <code>203.0.113.10</code> có <code>aa</code> (máy chủ ổn, hai máy cùng serial); <code>dig labflow.test</code> → <code>SERVFAIL</code> kèm <code>EDE: 7 (Signature Expired)</code>, nhưng <code>dig +cd</code> → <code>203.0.113.10</code>; RRSIG hết hạn trước ngày UTC hôm nay. Bước 5 chỉ ra nguyên nhân: chữ ký DNSSEC hết hạn. 3) Ký lại, tăng lên <code>2026110110</code>, nạp lại; resolver có thể giữ câu bogus trong <code>val-bogus-ttl</code> 60 s — <code>unbound-control flush_bogus</code> (hoặc <code>flush_zone</code>) xoá ngay; resolver công cộng lành trong khoảng đó. Thêm giám sát hạn chữ ký. 4) <code>cdn.test</code> không có bản ghi DS trong vùng đã ký <code>test</code>, và NSEC có chữ ký của TLD chứng minh việc không có đó: vùng là insecure có chứng minh (không ký), resolver kiểm chấp nhận. Bogus là vùng lẽ ra có ký (có DS) mà chữ ký kiểm không qua.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['DNSSEC', 'Chữ ký trên dữ liệu DNS để resolver có kiểm chứng minh được câu trả lời đến từ chủ vùng.'],
    ['RRSIG / DNSKEY / DS', 'Chữ ký trên một bộ bản ghi / khoá công khai của vùng / mã băm khoá của vùng con, do vùng cha công bố.'],
    ['KSK / ZSK', 'Khoá ký khoá (ký bộ DNSKEY, được DS tham chiếu) / khoá ký vùng (ký các bản ghi).'],
    ['trust anchor (mỏ neo tin cậy)', 'Khoá gốc mà resolver tin không cần chứng minh; mọi chuỗi kết thúc ở đó.'],
    ['secure / insecure / bogus', 'Đã kiểm qua / không ký có chứng minh (không có DS) / lẽ ra phải qua mà không ⇒ SERVFAIL.'],
    ['EDE — Extended DNS Error (RFC 8914)', 'Mã lý do gắn kèm lỗi, ví dụ 7 Signature Expired, 9 DNSKEY Missing.'],
    ['+cd (checking disabled)', 'Bảo resolver bỏ qua bước kiểm — phép thử nhanh cho lỗi DNSSEC.'],
    ['DoT / DoH', 'DNS qua TLS (cổng 853) / DNS qua HTTPS (443): giấu câu hỏi khỏi mạng.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>DNSSEC chứng minh toàn vẹn (RRSIG ← DNSKEY ← DS ở vùng cha ← … ← mỏ neo gốc); DoT/DoH cho riêng tư trước mạng. Không cái nào làm thay việc của cái kia.</li>
<li>Chữ ký hết hạn ⇒ SERVFAIL với người dùng có kiểm trong khi mọi thứ khác đều ổn; EDE nói lý do; +cd chứng minh; câu bogus nằm trong cache ~60 s.</li>
<li>Insecure (không có DS) là trạng thái hợp lệ; bogus là sự cố.</li>
<li>Máy chủ tên chết: những lần tra đầu bị treo (3 × 20 s), rồi SERVFAIL ngay tới 15 phút; một trong hai chết ⇒ một số lần tra mất 0,4–1,1 s.</li>
<li>Tên miền hết hạn biến mất ngay ở TLD; dùng bảng kiểm sáu bước cho “ở đây chạy, ở kia không”.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc4033', '📄', 'RFC 4033 — Giới thiệu và yêu cầu an ninh DNS', 'DNSSEC bảo vệ gì và không bảo vệ gì.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc4034', '📄', 'RFC 4034 — Bản ghi cho DNSSEC', 'Định dạng DNSKEY, RRSIG, NSEC và DS; cờ khoá 256/257.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8914', '📄', 'RFC 8914 — Lỗi DNS mở rộng', 'Các mã EDE, gồm 7 (Signature Expired) và 9 (DNSKEY Missing).', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc7858', '📄', 'RFC 7858 — DNS qua TLS', 'Cổng 853.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8484', '📄', 'RFC 8484 — Câu hỏi DNS qua HTTPS (DoH)', 'Thông điệp DNS trong HTTP/2 ở cổng 443.', 'Mở')}
${L('https://www.kb.cert.org/vuls/id/800113', '🛡️', 'CERT VU#800113 — đầu độc cache DNS (8/7/2008)', 'ID đoán được và cổng cố định cho phép đầu độc cache của resolver.', 'Mở')}
${L('https://www.iana.org/archive/root-dnssec-launch', '🌍', 'IANA — Thiết kế và ra mắt DNSSEC cho vùng gốc (2008–2010)', 'Vùng gốc được ký vào tháng 7/2010 ra sao.', 'Mở')}
${L('https://slack.engineering/what-happened-during-slacks-dnssec-rollout/', '📝', 'Slack — Chuyện gì xảy ra khi Slack bật DNSSEC', '30/9/2021: bản ghi DS bị cache và sự cố một phần 24 giờ.', 'Mở')}
${L('https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/', '☁️', 'Cloudflare — API JSON của DoH', 'Định dạng JSON dùng với curl trong bài.', 'Mở')}
</div>
`,
};
