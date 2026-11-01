/**
 * Chương 3 · Lab 3 — DNS của LabFlow: kiểm tra, chuyển máy chủ, hai sự cố (phần 3 của dự án xuyên khoá). Lab DNS (dns.yml).
 * Lời giải dùng output thật: lab/out/lab3-*.out.txt (kịch bản lab/code/ch03/lab3/, chạy bằng chay-loi-giai.sh trên lab sạch).
 */
import { run, src, card, kv, details, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-3.mjs';

const L = card;
const C = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN/ };
const PHIEU = `# Lab 3 report — <your name>, <date>

## R1 Delegation map (www.labflow.test and static.labflow.test)
| level | server (name / IP) | run by | TTL of the referral | signed? |
|---|---|---|---|---|

## R2 Launch records            — the records, named-checkzone output, both servers answering with the new serial
## R3 Moving api to .11          — plan with times, the timeline you measured, worst-case delay computed
## R4 Incident A                 — symptoms, the command that found it, the fix, proof (checker green)
## R5 Incident B                 — symptoms, +cd / EDE / DS comparison, the fix, why users were still broken, proof
## R6 Monitoring                 — your checker, what it prints in each incident`;

export default {
  title: 'Lab 3 — LabFlow’s DNS: audit, a server move and two incidents|||Lab 3 — DNS của LabFlow: kiểm tra, chuyển máy chủ và hai sự cố',
  slug: 'netdev-3-6-lab-dns-labflow',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chương 3 (phần 3 dự án xuyên khoá): vẽ bản đồ ủy quyền của LabFlow, thêm bản ghi cho đợt ra mắt mà không làm hỏng vùng, chuyển api sang máy chủ mới theo đúng thứ tự TTL và đo lại, chẩn đoán hai sự cố cài sẵn (ủy quyền gõ sai ở nhà đăng ký, đổi khoá DNSSEC mà quên DS), viết bộ kiểm DNS chạy bằng cron. Rubric 10 điểm, gợi ý theo bậc, lời giải bằng output thật.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab 3 · Course project part 3</span>
<h2>Lab 3 — LabFlow’s DNS</h2>
<p class="lead">LabFlow is launching a public status page next week and moving its API to the Singapore edge. Your lead hands you the DNS: map who answers for which part of the name, add the records the launch needs without breaking the zone, move the API without sending users to a dead address, and — because on-call is yours this week — diagnose two incidents that will be injected while you work. Everything you need is in Chapter 3.</p>

<h3>What you get</h3>
<ul>
<li>The DNS lab from lesson 3.1 (from <code>lab/moi-truong</code>): <code>docker compose -f internet.yml -f dns.yml -p nfi up -d</code>, wait ~20 s. Machines: <code>nfi-laptop</code> (your desk), <code>nfi-ns</code> (ns1, primary), <code>nfi-ns2</code>, <code>nfi-tld</code> (the registry of <code>.test</code> — "the registrar's panel"), <code>nfi-isp</code> (the resolver), <code>nfi-root</code>, <code>nfi-cdns</code>, <code>nfi-pop1</code>/<code>pop2</code>.</li>
<li>The zone source: <code>/dnsz/src/labflow.test.zone</code> on ns1. After editing: bump the serial, then <code>bash /lab/k/moi-truong/dns/ky.sh labflow.test &amp;&amp; rndc reload labflow.test</code>.</li>
<li>Two incident scripts you must <strong>not read before diagnosing</strong>: <code>lab/code/ch03/lab3/su-co-a.sh</code> (runs on <code>nfi-tld</code>) and <code>su-co-b.sh</code> (runs on <code>nfi-ns</code>).</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Delegation map.</strong> For <code>www.labflow.test</code> and <code>static.labflow.test</code>: every server that takes part, who runs it (root / registry / LabFlow / CDN), the TTL of each referral, and which parts are DNSSEC-signed. Evidence: <code>dig +trace</code>, <code>delv</code>.</li>
<li><strong>R2 Launch records.</strong> Add <code>status.labflow.test</code> → CNAME to <code>labflow.cdn.test</code>, a TXT <code>status-verify=81c2</code> on the apex, a backup mail server <code>mail2</code> (203.0.113.26, priority 20), and a CAA <code>iodef</code> contact <code>mailto:security@labflow.test</code>. Check with <code>named-checkzone</code> before loading; prove both name servers serve the new serial.</li>
<li><strong>R3 Move the API.</strong> Move <code>api.labflow.test</code> from <code>.10</code> to <code>.11</code> so that no user gets the old address for more than ~10 seconds after the change. Write the plan with times, execute it, record what the laptop sees every 5 seconds, and compute the worst case.</li>
<li><strong>R4 Incident A.</strong> Run <code>docker exec nfi-tld bash /lab/k/code/ch03/lab3/su-co-a.sh</code>. Customers report "LabFlow is slow to open, sometimes". Find the cause with DNS tools, fix it at the right place, prove it.</li>
<li><strong>R5 Incident B.</strong> Run <code>docker exec nfi-ns bash /lab/k/code/ch03/lab3/su-co-b.sh</code>, then flush the resolver (<code>docker exec nfi-isp unbound-control flush_zone labflow.test</code>). Customers report "LabFlow is down". Diagnose, fix, and explain why some users stay broken after your fix and what you do about it.</li>
<li><strong>R6 Monitoring.</strong> Write a script that would have caught both incidents (and a forgotten serial): run it before, during and after each incident.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Req.</th><th>Points</th><th>Full marks when…</th></tr>
<tr><td>R1</td><td>1.5</td><td>root → TLD → LabFlow (and → CDN for static) with correct owners and TTLs; secure vs insecure stated from <code>delv</code></td></tr>
<tr><td>R2</td><td>1.5</td><td>four records with final dots right; checkzone OK before reload; serial bumped; ns1 and ns2 show the same new records</td></tr>
<tr><td>R3</td><td>2</td><td>TTL lowered first, change made only after the old TTL; timeline shows the switch within ~10 s; worst case computed; old server kept up</td></tr>
<tr><td>R4</td><td>2</td><td>parent vs child NS compared; the dead ns3 shown; fixed at the TLD (registrar), not in the zone; resolver memory explained; checker green</td></tr>
<tr><td>R5</td><td>2</td><td>SERVFAIL + EDE + works with +cd; DS at parent ≠ DS of the published key; DS updated at the parent; cached DS explained (Slack 2021); proof with ad</td></tr>
<tr><td>R6</td><td>1</td><td>a runnable checker: delegation, every server answers, same serial, child NS = parent NS, DNSSEC validates, signatures not near expiry</td></tr>
</table>
<p class="nho">−1 for any claim without evidence (a command and its output). Report: Markdown, at most two pages.</p>

<h3>Hints by level</h3>
${details('Hint 1 — getting started (open after 10 minutes)', `<ul>
<li>R1: <code>dig +trace +nodnssec</code> prints one block per server; the TTL is the second column. <code>delv -a /dnsz/anchor.conf</code> says “fully validated” or “unsigned answer”.</li>
<li>R2: copy the zone to <code>/tmp</code> first, edit there, check there. Every name that is not relative needs a final dot.</li>
<li>R3: lesson 3.3 — what matters is the TTL already in caches when you change the IP. On the laptop: <code>for i in $(seq 1 34); do printf '%s  ' "$(date +%T)"; dig +noall +answer api.labflow.test; sleep 5; done</code>.</li>
</ul>`)}
${details('Hint 2 — the right questions (open after 20 minutes)', `<ul>
<li>R4: who does the TLD say the name servers are (<code>dig +noall +authority +additional labflow.test NS @192.0.2.20 +norecurse</code>)? Who does the zone itself say? Does every server in the parent’s list answer? Where is the delegation edited in real life?</li>
<li>R5: works with <code>+cd</code>? Read the EDE. Compare <code>dig labflow.test DS @192.0.2.20</code> with <code>dig labflow.test DNSKEY @203.0.113.53 | dnssec-dsfromkey -a SHA-256 -f - labflow.test</code>. After fixing the parent, what is the TTL of the DS record in the resolver’s cache?</li>
<li>R6: everything you checked by hand in R4 and R5 can be a line in a script that prints OK/FAIL.</li>
</ul>`)}

<h3>Going further</h3>
<ul>
<li>Do a <em>correct</em> KSK rollover: publish the new key next to the old one, add the new DS at the parent, wait the DS TTL, only then remove the old key (RFC 6781 describes the steps).</li>
<li>Add a third name server in a different network and explain with RFC 2182 why it matters.</li>
<li>Code Lab, lab module: write the TTL-plan calculator, the negative-TTL rule, the delegation checker and the DS comparison behind this report.</li>
<li>Course project: add a DNS page to your LabFlow design — the zone file, the TTL policy (normal / before a move), who can edit the delegation at the registrar, and the checker in cron.</li>
</ul>

<h3>The checker used in the solution</h3>
${src('ch03/lab3/kiem-dns.sh', 'bash')}

${details('✅ Solution (open only after you have written your report)', `
<p><strong>R1</strong>:</p>
${run('lab3-r1', 'dig +trace +nodnssec www', 3, C)}
<p>Root <code>a.root-servers.test</code> (192.0.2.10) refers to <code>.test</code> with TTL 172800; the registry’s <code>ns1.nic.test</code> (192.0.2.20) refers to LabFlow’s <code>ns1</code>/<code>ns2</code> (172800); LabFlow answers with <code>aa</code> (TTL 300). For <code>static</code>, LabFlow answers with a CNAME and the CDN’s <code>ns1.cdn.test</code> (192.0.2.40) answers the target. <code>delv</code>: <code>labflow.test</code> is signed and validates (secure); <code>cdn.test</code> has no DS — insecure, which is allowed.</p>
<p><strong>R2</strong>:</p>
${run('lab3-r2-ns', 'cp /dnsz', 5, C)}
${run('lab3-r2-hoi', 'for ns in', 1, C)}
<p><strong>R3</strong> — plan: lower the TTL from 120 to 10, wait at least 120 s, change the IP, keep .10 running. What happened:</p>
${run('lab3-r3-ha', 'date', 1, C)}
${run('lab3-r3-doi', 'date', 1, C)}
${run('lab3-r3', 'cat', 1, C)}
<p>The TTL was lowered at 17:18:12; the laptop kept seeing the old TTL count down from 120 (the copy it already had), then the short TTL of 10. The IP was changed at 17:20:17 — 125 s after lowering, more than the old TTL — and the laptop got <code>.11</code> at its next-but-one poll, 17:20:26: 9 s later. Worst case computed: max(new TTL 10, 17:18:12 + 120 s − 17:20:17 = −5 s) = <strong>10 s</strong>, plus the JVM's 30 s for Java clients — so keep .10 running a few minutes. (A <code>TTL 0</code> line is a record served in its last second before expiry.)</p>
<p><strong>R4</strong> — symptoms (each round on the resolver forgets its cache and what it knows about the servers):</p>
${run('lab3-r4-isp', 'for i in', 1, C)}
${run('lab3-r4-laptop', 'dig', 4, C)}
<p>The registry delegates to <code>ns1</code> and <code>ns3</code> (203.0.113.55), while the zone itself says <code>ns1</code> and <code>ns2</code>; <code>ns3</code> does not exist, so a resolver that tries it first waits ~380 ms to over a second before falling back to ns1. The delegation is data at the <em>parent</em> — it is fixed in the registrar’s panel (here, the TLD’s zone), not in LabFlow’s zone:</p>
${run('lab3-r4-tld', 'sed', 3, C)}
${run('lab3-r4-flush', 'unbound-control', 2, C)}
${run('lab3-r4-ok', './kiem-dns.sh', 1, C)}
<p>Resolvers had cached the wrong name-server list with the delegation’s TTL (two days); we flushed ours, public resolvers would take up to that long — which is why delegation changes deserve a check before and after.</p>
<p><strong>R5</strong>:</p>
${run('lab3-r5-laptop', 'dig', 5, C)}
<p>SERVFAIL with <code>EDE: 6 (DNSSEC Bogus)</code>, and the answer comes back with <code>+cd</code> ⇒ DNSSEC. The DS at the parent and the DS computed from the key LabFlow now publishes have different key tags and digests: someone generated a new key-signing key and re-signed the zone, but nobody gave the new DS to the registrar. Fix at the parent:</p>
${run('lab3-r5-tld', 'cat', 3, C)}
${run('lab3-r5-sau', 'dig', 2, C)}
<p>The parent now serves the new DS — and users are <em>still</em> broken: the resolver cached the old DS (TTL 3600 in this TLD; 86400 for <code>.com</code>, which is what kept Slack partly down for 24 hours in 2021). On our resolver we flush; for the rest of the Internet you can only wait — or, better, never get here: publish the new DS and wait its TTL <em>before</em> retiring the old key.</p>
${run('lab3-r5-flush', 'unbound-control', 2, C)}
${run('lab3-r5-ok', 'dig', 2, C)}
<p><strong>R6</strong> — the checker above prints, during incident A, two FAIL lines (ns3 does not answer; child NS ≠ parent NS) and, during incident B, a DNSSEC FAIL; after each fix, all OK. Run it from cron every few minutes and alert on exit code 1. A forgotten serial shows up as “serials differ”.</p>
`)}

<h3>🗂 Key terms</h3>
${kv([
    ['delegation (ủy quyền)', 'NS + glue (+ DS) records at the parent that hand a domain to its name servers; edited at the registrar.'],
    ['lame / dead delegation', 'The parent lists a name server that does not answer (or is not authoritative) for the domain.'],
    ['parent vs child NS', 'The NS set at the TLD and the NS set in the zone itself; they should match.'],
    ['KSK rollover (đổi khoá ký khoá)', 'Replacing the key the parent’s DS points to; the new DS must be at the parent before the old key goes.'],
    ['DS TTL', 'How long resolvers keep the parent’s DS — the time a wrong DS keeps breaking users after you fix it.'],
    ['DNS monitoring (giám sát DNS)', 'A script in cron that checks delegation, serials, DNSSEC and signature expiry, and alerts on failure.'],
  ])}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab 3 · Dự án xuyên khoá phần 3</span>
<h2>Lab 3 — DNS của LabFlow</h2>
<p class="lead">Tuần sau LabFlow ra mắt trang trạng thái công khai và chuyển API sang máy biên Singapore. Trưởng nhóm giao DNS cho bạn: vẽ ai trả lời phần nào của cái tên, thêm các bản ghi đợt ra mắt cần mà không làm hỏng vùng, chuyển API mà không đưa người dùng tới một địa chỉ chết, và — vì tuần này bạn trực sự cố — chẩn đoán hai sự cố sẽ được cài vào trong lúc bạn làm. Mọi thứ cần dùng đều có trong Chương 3.</p>

<h3>Bạn có gì</h3>
<ul>
<li>Lab DNS của bài 3.1 (từ <code>lab/moi-truong</code>): <code>docker compose -f internet.yml -f dns.yml -p nfi up -d</code>, chờ ~20 s. Các máy: <code>nfi-laptop</code> (bàn làm việc của bạn), <code>nfi-ns</code> (ns1, máy chính), <code>nfi-ns2</code>, <code>nfi-tld</code> (nhà quản lý <code>.test</code> — "trang quản trị của nhà đăng ký"), <code>nfi-isp</code> (resolver), <code>nfi-root</code>, <code>nfi-cdns</code>, <code>nfi-pop1</code>/<code>pop2</code>.</li>
<li>Nguồn của vùng: <code>/dnsz/src/labflow.test.zone</code> trên ns1. Sau khi sửa: tăng serial, rồi <code>bash /lab/k/moi-truong/dns/ky.sh labflow.test &amp;&amp; rndc reload labflow.test</code>.</li>
<li>Hai kịch bản sự cố bạn <strong>không được đọc trước khi chẩn đoán</strong>: <code>lab/code/ch03/lab3/su-co-a.sh</code> (chạy trên <code>nfi-tld</code>) và <code>su-co-b.sh</code> (chạy trên <code>nfi-ns</code>).</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Bản đồ ủy quyền.</strong> Với <code>www.labflow.test</code> và <code>static.labflow.test</code>: mọi máy chủ tham gia, ai vận hành (gốc / nhà quản lý TLD / LabFlow / CDN), TTL của từng lời giới thiệu, và phần nào có ký DNSSEC. Bằng chứng: <code>dig +trace</code>, <code>delv</code>.</li>
<li><strong>R2 Bản ghi cho đợt ra mắt.</strong> Thêm <code>status.labflow.test</code> → CNAME tới <code>labflow.cdn.test</code>, một TXT <code>status-verify=81c2</code> ở đỉnh, một máy nhận thư dự phòng <code>mail2</code> (203.0.113.26, ưu tiên 20), và một CAA <code>iodef</code> liên hệ <code>mailto:security@labflow.test</code>. Kiểm bằng <code>named-checkzone</code> trước khi nạp; chứng minh cả hai máy chủ tên phục vụ serial mới.</li>
<li><strong>R3 Chuyển API.</strong> Chuyển <code>api.labflow.test</code> từ <code>.10</code> sang <code>.11</code> sao cho không người dùng nào nhận địa chỉ cũ quá ~10 giây sau khi đổi. Viết kế hoạch có giờ giấc, thực hiện, ghi lại thứ laptop thấy mỗi 5 giây, và tính trường hợp xấu nhất.</li>
<li><strong>R4 Sự cố A.</strong> Chạy <code>docker exec nfi-tld bash /lab/k/code/ch03/lab3/su-co-a.sh</code>. Khách hàng báo "LabFlow thỉnh thoảng mở chậm". Tìm nguyên nhân bằng công cụ DNS, sửa đúng chỗ, chứng minh.</li>
<li><strong>R5 Sự cố B.</strong> Chạy <code>docker exec nfi-ns bash /lab/k/code/ch03/lab3/su-co-b.sh</code>, rồi xoá cache resolver (<code>docker exec nfi-isp unbound-control flush_zone labflow.test</code>). Khách hàng báo "LabFlow sập". Chẩn đoán, sửa, và giải thích vì sao một số người dùng vẫn hỏng sau khi bạn sửa và bạn làm gì với điều đó.</li>
<li><strong>R6 Giám sát.</strong> Viết một script lẽ ra đã bắt được cả hai sự cố (và cả lỗi quên serial): chạy nó trước, trong và sau mỗi sự cố.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>YC</th><th>Điểm</th><th>Điểm tối đa khi…</th></tr>
<tr><td>R1</td><td>1,5</td><td>gốc → TLD → LabFlow (và → CDN với static) đúng chủ và TTL; nói được secure hay insecure từ <code>delv</code></td></tr>
<tr><td>R2</td><td>1,5</td><td>bốn bản ghi với dấu chấm cuối đúng; checkzone OK trước khi nạp; tăng serial; ns1 và ns2 cho thấy cùng bản ghi mới</td></tr>
<tr><td>R3</td><td>2</td><td>hạ TTL trước, chỉ đổi sau khi hết TTL cũ; dòng thời gian cho thấy chuyển trong ~10 s; tính trường hợp xấu nhất; giữ máy cũ chạy</td></tr>
<tr><td>R4</td><td>2</td><td>so NS ở vùng cha với vùng con; chỉ ra ns3 chết; sửa ở TLD (nhà đăng ký), không sửa trong vùng; giải thích trí nhớ của resolver; bộ kiểm xanh</td></tr>
<tr><td>R5</td><td>2</td><td>SERVFAIL + EDE + chạy với +cd; DS ở vùng cha ≠ DS của khoá đang công bố; cập nhật DS ở vùng cha; giải thích DS bị cache (Slack 2021); chứng minh bằng ad</td></tr>
<tr><td>R6</td><td>1</td><td>một bộ kiểm chạy được: ủy quyền, mọi máy trả lời, cùng serial, NS con = NS cha, DNSSEC kiểm qua, chữ ký chưa sắp hết hạn</td></tr>
</table>
<p class="nho">−1 cho mỗi khẳng định không có bằng chứng (một lệnh và output của nó). Báo cáo: Markdown, tối đa hai trang.</p>

<h3>Gợi ý theo bậc</h3>
${details('Gợi ý 1 — bắt đầu (mở sau 10 phút)', `<ul>
<li>R1: <code>dig +trace +nodnssec</code> in mỗi máy chủ một khối; TTL là cột thứ hai. <code>delv -a /dnsz/anchor.conf</code> nói “fully validated” hoặc “unsigned answer”.</li>
<li>R2: chép vùng ra <code>/tmp</code> trước, sửa ở đó, kiểm ở đó. Mọi tên không tương đối đều cần dấu chấm cuối.</li>
<li>R3: bài 3.3 — điều quan trọng là TTL đã nằm trong cache lúc bạn đổi IP. Trên laptop: <code>for i in $(seq 1 34); do printf '%s  ' "$(date +%T)"; dig +noall +answer api.labflow.test; sleep 5; done</code>.</li>
</ul>`)}
${details('Gợi ý 2 — đặt đúng câu hỏi (mở sau 20 phút)', `<ul>
<li>R4: TLD nói máy chủ tên là ai (<code>dig +noall +authority +additional labflow.test NS @192.0.2.20 +norecurse</code>)? Chính vùng nói là ai? Mọi máy trong danh sách của vùng cha có trả lời không? Ngoài đời phần ủy quyền được sửa ở đâu?</li>
<li>R5: chạy với <code>+cd</code> không? Đọc EDE. So <code>dig labflow.test DS @192.0.2.20</code> với <code>dig labflow.test DNSKEY @203.0.113.53 | dnssec-dsfromkey -a SHA-256 -f - labflow.test</code>. Sau khi sửa vùng cha, bản ghi DS trong cache của resolver còn TTL bao nhiêu?</li>
<li>R6: mọi thứ bạn kiểm bằng tay ở R4 và R5 đều có thể thành một dòng trong script in OK/FAIL.</li>
</ul>`)}

<h3>Thử thách thêm</h3>
<ul>
<li>Làm một lần đổi KSK <em>đúng</em>: công bố khoá mới cạnh khoá cũ, thêm DS mới ở vùng cha, chờ hết TTL của DS, rồi mới gỡ khoá cũ (RFC 6781 mô tả các bước).</li>
<li>Thêm máy chủ tên thứ ba ở một mạng khác và giải thích bằng RFC 2182 vì sao điều đó quan trọng.</li>
<li>Code Lab, module lab: viết bộ tính kế hoạch TTL, quy tắc TTL âm, bộ kiểm ủy quyền và phép so DS đứng sau báo cáo này.</li>
<li>Dự án xuyên khoá: thêm một trang DNS vào thiết kế LabFlow của bạn — tệp vùng, chính sách TTL (bình thường / trước khi chuyển), ai được sửa phần ủy quyền ở nhà đăng ký, và bộ kiểm chạy bằng cron.</li>
</ul>

<h3>Bộ kiểm dùng trong lời giải</h3>
${src('ch03/lab3/kiem-dns.sh', 'bash')}

${details('✅ Lời giải (chỉ mở sau khi đã viết xong báo cáo)', `
<p><strong>R1</strong>:</p>
${run('lab3-r1', 'dig +trace +nodnssec www', 3, C)}
<p>Máy chủ gốc <code>a.root-servers.test</code> (192.0.2.10) giới thiệu xuống <code>.test</code> với TTL 172800; <code>ns1.nic.test</code> (192.0.2.20) của nhà quản lý TLD giới thiệu xuống <code>ns1</code>/<code>ns2</code> của LabFlow (172800); LabFlow trả lời kèm <code>aa</code> (TTL 300). Với <code>static</code>, LabFlow trả về một CNAME và <code>ns1.cdn.test</code> (192.0.2.40) của CDN trả lời đích. <code>delv</code>: <code>labflow.test</code> có ký và kiểm qua (secure); <code>cdn.test</code> không có DS — insecure, được chấp nhận.</p>
<p><strong>R2</strong>:</p>
${run('lab3-r2-ns', 'cp /dnsz', 5, C)}
${run('lab3-r2-hoi', 'for ns in', 1, C)}
<p><strong>R3</strong> — kế hoạch: hạ TTL từ 120 xuống 10, chờ ít nhất 120 s, đổi IP, giữ .10 chạy. Điều đã xảy ra:</p>
${run('lab3-r3-ha', 'date', 1, C)}
${run('lab3-r3-doi', 'date', 1, C)}
${run('lab3-r3', 'cat', 1, C)}
<p>TTL được hạ lúc 17:18:12; laptop vẫn thấy TTL cũ đếm ngược từ 120 (bản nó đã có), rồi tới TTL ngắn 10. IP được đổi lúc 17:20:17 — 125 s sau khi hạ, lâu hơn TTL cũ — và laptop nhận <code>.11</code> ở lượt hỏi thứ hai sau đó, 17:20:26: chậm 9 s. Trường hợp xấu nhất tính ra: max(TTL mới 10, 17:18:12 + 120 s − 17:20:17 = −5 s) = <strong>10 s</strong>, cộng 30 s của JVM với client Java — nên giữ .10 chạy thêm vài phút. (Dòng <code>TTL 0</code> là bản ghi được trả trong giây cuối trước khi hết hạn.)</p>
<p><strong>R4</strong> — triệu chứng (mỗi vòng resolver quên cache và quên những gì biết về các máy chủ):</p>
${run('lab3-r4-isp', 'for i in', 1, C)}
${run('lab3-r4-laptop', 'dig', 4, C)}
<p>Nhà quản lý TLD ủy quyền cho <code>ns1</code> và <code>ns3</code> (203.0.113.55), trong khi chính vùng ghi <code>ns1</code> và <code>ns2</code>; <code>ns3</code> không tồn tại, nên resolver nào thử nó trước sẽ chờ ~380 ms tới hơn một giây rồi mới quay sang ns1. Phần ủy quyền là dữ liệu ở <em>vùng cha</em> — nó được sửa trong trang quản trị của nhà đăng ký (ở đây là vùng của TLD), không phải trong vùng của LabFlow:</p>
${run('lab3-r4-tld', 'sed', 3, C)}
${run('lab3-r4-flush', 'unbound-control', 2, C)}
${run('lab3-r4-ok', './kiem-dns.sh', 1, C)}
<p>Resolver đã cache danh sách máy chủ tên sai theo TTL của phần ủy quyền (hai ngày); resolver của ta thì ta xoá được, resolver công cộng có thể mất chừng ấy thời gian — vì thế mọi thay đổi ủy quyền đáng được kiểm trước và sau.</p>
<p><strong>R5</strong>:</p>
${run('lab3-r5-laptop', 'dig', 5, C)}
<p>SERVFAIL kèm <code>EDE: 6 (DNSSEC Bogus)</code>, và câu trả lời quay về với <code>+cd</code> ⇒ DNSSEC. DS ở vùng cha và DS tính từ khoá mà LabFlow đang công bố có mã khoá và mã băm khác nhau: ai đó đã sinh khoá ký khoá mới và ký lại vùng, nhưng không ai đưa DS mới cho nhà đăng ký. Sửa ở vùng cha:</p>
${run('lab3-r5-tld', 'cat', 3, C)}
${run('lab3-r5-sau', 'dig', 2, C)}
<p>Vùng cha giờ đã phục vụ DS mới — vậy mà người dùng <em>vẫn</em> hỏng: resolver đã cache DS cũ (TTL 3600 ở TLD này; 86400 với <code>.com</code>, thứ đã giữ Slack sập một phần 24 giờ năm 2021). Trên resolver của ta thì xoá cache; với phần còn lại của Internet chỉ có thể chờ — hoặc tốt hơn, đừng bao giờ để tới đây: công bố DS mới và chờ hết TTL của nó <em>trước khi</em> bỏ khoá cũ.</p>
${run('lab3-r5-flush', 'unbound-control', 2, C)}
${run('lab3-r5-ok', 'dig', 2, C)}
<p><strong>R6</strong> — bộ kiểm ở trên in, trong sự cố A, hai dòng FAIL (ns3 không trả lời; NS con ≠ NS cha) và, trong sự cố B, một dòng FAIL về DNSSEC; sau mỗi lần sửa, tất cả OK. Chạy nó bằng cron vài phút một lần và cảnh báo khi mã thoát là 1. Quên serial sẽ hiện thành “serials differ”.</p>
`)}

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['delegation (ủy quyền)', 'Bản ghi NS + glue (+ DS) ở vùng cha giao một tên miền cho các máy chủ tên của nó; sửa ở nhà đăng ký.'],
    ['lame / dead delegation (ủy quyền hỏng)', 'Vùng cha liệt kê một máy chủ tên không trả lời (hoặc không có thẩm quyền) cho tên miền.'],
    ['parent vs child NS (NS cha và NS con)', 'Bộ NS ở TLD và bộ NS trong chính vùng; chúng phải khớp nhau.'],
    ['KSK rollover (đổi khoá ký khoá)', 'Thay khoá mà DS ở vùng cha trỏ tới; DS mới phải có ở vùng cha trước khi bỏ khoá cũ.'],
    ['DS TTL', 'Thời gian resolver giữ DS của vùng cha — khoảng thời gian một DS sai còn làm hỏng người dùng sau khi bạn đã sửa.'],
    ['DNS monitoring (giám sát DNS)', 'Script chạy bằng cron kiểm ủy quyền, serial, DNSSEC và hạn chữ ký, cảnh báo khi hỏng.'],
  ])}
</div>
`,
};
