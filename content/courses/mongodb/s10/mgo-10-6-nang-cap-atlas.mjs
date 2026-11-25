/**
 * 10.6 — Nâng cấp, FCV, và Atlas với tự vận hành (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s10-6-nang-cap'] (kịch bản demo/s10/s10-6-nang-cap.txt). Container mgo-fcv (--network none, 2 GB) trên volume mgo-fcv, ảnh mongo:6.0 (6.0.28),
 * mongo:7.0 (7.0.48), mongo:8.0 (8.0.38); dọn sạch sau lượt chạy.
 * Khối: 0 FCV mgo-lab · 1 script /tmp/mgo-fcv.sh · 2 dữ liệu tạo bằng 6.0 (FCV 6.0) · 3 nhảy cóc lên 8.0 ⇒ mã thoát 62 "Wrong mongod version … Invalid featureCompatibilityVersion"
 * · 4 lên 7.0 được, FCV vẫn 6.0 · 5 setFCV 7.0 thiếu confirm ⇒ lỗi · 6 confirm:true ⇒ ok · 7 lên 8.0, FCV 7.0 · 8 setFCV 8.0 · 9 hạ FCV 8.0 → 7.0 được.
 * Nguồn GET kiểm 24/11/2026: MongoDB lifecycles (6.0 hết hỗ trợ 31/07/2025, 7.0: 31/08/2027, 8.0: 31/10/2029, 9.0 ra 09/2026); Docs 8.0-upgrade-replica-set
 * (phải lên 7.0 trước, secondary từng máy, rs.stepDown); 8.0-downgrade ("Binary downgrades are not supported for MongoDB Community Edition"); setFeatureCompatibilityVersion;
 * trang giá Atlas (Free $0 512 MB; Flex $0.011/giờ tối đa $30/tháng 5 GB; Dedicated từ $0.08/giờ ~ $56.94/tháng, M10 2 GB RAM 2 vCPU).
 * Kiểm trùng: CVE-2025-14847 + kiểm phiên bản ở Bài 9.1 ⇒ liên kết; nâng cấp PostgreSQL (pg_upgrade) không giảng ở đây.
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's10-6-nang-cap';

const CUON = `# Nâng cấp cuốn chiếu replica set 3 máy 7.0 → 8.0 (tóm tắt quy trình trong tài liệu, kèm lệnh kiểm từng bước)
# 0. Trước khi bắt đầu: driver đã hỗ trợ 8.0? bản sao lưu mới + THỬ KHÔI PHỤC (Bài 10.1)? chạy thử trên staging khôi phục từ bản đó?
mongosh --eval 'db.adminCommand({ getParameter: 1, featureCompatibilityVersion: 1 })'   # mọi máy phải là FCV "7.0"
# 1. Từng SECONDARY một: thay binary, khởi động lại, chờ về SECONDARY và hết trễ rồi mới sang máy kế
mongosh --eval 'rs.status().members.map(m => [m.name, m.stateStr, m.optimeDate])'
# 2. Primary nhường quyền ⇒ bầu chọn (vài giây ứng dụng thấy lỗi ghi có thể thử lại — Bài 7.2)
mongosh --eval 'rs.stepDown()'
# 3. Nâng máy primary cũ (giờ là secondary) như bước 1
# 4. Chạy ổn vài ngày với FCV 7.0 (vẫn còn đường lùi binary) rồi mới:
mongosh --eval 'db.adminCommand({ setFeatureCompatibilityVersion: "8.0", confirm: true })'`;

export default {
  title: '10.6 — Upgrades, FCV, and Atlas vs running it yourself|||10.6 — Nâng cấp, FCV, và Atlas với tự vận hành',
  slug: 'mgo-10-6-nang-cap-atlas',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Nâng cấp MongoDB như ở dự án thật, chạy thật trên cùng một volume dữ liệu: dữ liệu tạo bằng 6.0 (đã hết hỗ trợ 31/07/2025) nhảy cóc lên 8.0 thì mongod không khởi động (mã thoát 62, "Invalid featureCompatibilityVersion"); đi đúng 6.0 → 7.0 → 8.0, binary đổi trước, featureCompatibilityVersion đổi sau và phải confirm:true; hạ FCV được một bậc nhưng Community không hỗ trợ hạ binary. Quy trình nâng cấp cuốn chiếu replica set (secondary trước, rs.stepDown). Rồi bài toán tiền: Atlas (Free 512 MB, Flex tối đa $30/tháng, Dedicated từ ~$57/tháng — giá ngày 24/11/2026) so với tự vận hành, tính cả giờ công sao lưu, nâng cấp, giám sát, trực sự cố.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Upgrades, FCV, and Atlas vs running it yourself</h2>
<p class="lead">Databases are the part of a system people are most afraid to upgrade — so they don't, and a few years later the project runs a version that gets no security fixes. MongoDB makes upgrades safer with a two-step design: change the <em>binary</em> first, change the <em>data format</em> (featureCompatibilityVersion) later. In this lesson we take data created by MongoDB 6.0 all the way to 8.0 on one volume, break it on purpose with a skipped version, and then answer the question every small team asks: should we just pay for Atlas?</p>

<h3>An everyday picture</h3>
<p>Upgrading MongoDB is like moving a family to a new house in two steps. First you move the people (the binary): they can still read the old paperwork. Only when everyone has settled in do you switch all the paperwork to the new format (FCV) — after that, the old house can no longer read it. And you cannot jump from a 2022 house to a 2026 house in one move: you stop at every house in between.</p>

<h3>1. Why upgrade at all: support ends</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">6.0</span><span class="lz-t">released July 2022</span><span class="lz-d">end of life <strong>31 July 2025</strong> — no more fixes</span></div>
  <div class="lz-step"><span class="lz-k">7.0</span><span class="lz-t">August 2023</span><span class="lz-d">supported until 31 August 2027</span></div>
  <div class="lz-step"><span class="lz-k">8.0</span><span class="lz-t">October 2024 — this course</span><span class="lz-d">supported until 31 October 2029</span></div>
  <div class="lz-step"><span class="lz-k">9.0</span><span class="lz-t">September 2026</span><span class="lz-d">supported until 31 October 2031</span></div>
</div>
<p>When a vulnerability like CVE-2025-14847 (Lesson 9.1) appears, fixes ship for supported versions. A project still on 6.0 has no patch to apply — the only fix is the upgrade you postponed, now under pressure.</p>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-9-1-su-co-that', title: 'Lesson 9.1 — CVE-2025-14847 and checking your version', sub: 'the self-check script caught an old 8.0.16 image immediately' })}
${nguon('📘', 'MongoDB — Software lifecycle schedules', 'release and end-of-life dates for every server version', 'https://www.mongodb.com/legal/support-policy/lifecycles')}

<h3>2. Binary version vs featureCompatibilityVersion</h3>
${lenh(K, 0)}
<p>Two different version numbers. <code>db.version()</code> is the <strong>binary</strong> — the program you installed. <strong>FCV</strong> is a document in <code>admin.system.version</code> saying which on-disk formats and features the data may use. A new binary can run with the previous FCV: new features stay off, and the data stays readable by the old binary. That gap is your safety window. To see it for real, we create data with 6.0 in a named volume and swap the container image like you would swap the binary on a server:</p>
${lenh(K, 1)}
${lenh(K, 2)}

<h3>3. Skipping a version breaks startup</h3>
${lenh(K, 3)}
<p>Binary 8.0 on data with FCV 6.0: mongod refuses to start (exit code 62) with "UPGRADE PROBLEM: Found an invalid featureCompatibilityVersion document". Nothing was damaged — but in production this is the moment the database is down and someone on the team is reading logs at 2 a.m. The rule from the docs: upgrade one major release at a time; from 6.0 you must reach 7.0 (binary <em>and</em> FCV) before 8.0.</p>

<h3>4. The right way: 6.0 → 7.0 → 8.0</h3>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Binary 7.0 starts on the 6.0 data, and FCV is still 6.0 — the data has not changed yet. Raising FCV without <code>confirm: true</code> is refused with a message worth reading: once FCV is raised, you cannot go back down without help. With <code>confirm</code> it succeeds; now binary 8.0 starts (FCV 7.0), and the final <code>setFeatureCompatibilityVersion: "8.0"</code> unlocks 8.0-only features. The three documents survived every step.</p>

<h3>5. Going back: FCV yes, binary no (Community)</h3>
${lenh(K, 9)}
<p>Lowering FCV by one step (8.0 → 7.0) is allowed. Lowering the <em>binary</em> is another matter: the 8.0 downgrade page says plainly "Binary downgrades are not supported for MongoDB Community Edition"; Enterprise needs support's help. (On the lab, an experiment starting 7.0 on such data did boot — but "it booted once on my machine" is not a supported rollback plan.) So your real rollback plan is: <strong>stay on the new binary with the old FCV for a few days</strong>, and keep a <strong>tested backup taken right before raising FCV</strong>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — raising FCV in the same maintenance window as the binary.</strong> It feels tidy ("finish the upgrade"), but it throws away the only cheap way back. Typical order on real projects: week 1 binary, watch errors, latency (Lesson 10.4) and slow queries; week 2 FCV, after a fresh backup.</p>
</div>

<h3>6. Rolling upgrade of a replica set</h3>
${ma('bash', CUON)}
<p>On a three-member replica set (Lesson 7.1) the application never sees the database go away: secondaries are upgraded one at a time, the primary steps down (a few seconds of election — retryable writes from Lesson 7.2 absorb it), then the old primary is upgraded. Before anything: the driver version must support the new server (check the driver compatibility table), and read the release notes' compatibility changes — removed commands and changed defaults are what break applications, not the upgrade itself.</p>
${nguon('📘', 'MongoDB Docs — Upgrade a Replica Set to 8.0', 'prerequisites (all members 7.0, FCV 7.0), secondaries one at a time, rs.stepDown(), then setFeatureCompatibilityVersion', 'https://www.mongodb.com/docs/manual/release-notes/8.0-upgrade-replica-set/')}
${nguon('📘', 'MongoDB Docs — Downgrade 8.0 to 7.0', '"Binary downgrades are not supported for MongoDB Community Edition"', 'https://www.mongodb.com/docs/manual/release-notes/8.0-downgrade/')}
${nguon('📘', 'MongoDB Docs — setFeatureCompatibilityVersion', 'confirm: true, upgrade/downgrade paths', 'https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/')}

<h3>7. Atlas or run it yourself?</h3>
<p>Everything in Chapter 10 — backups with oplog and tested restores, monitoring and alerts, upgrades, security patches — is work. Atlas (MongoDB's managed service) does most of it for a price. Prices on the Atlas pricing page on 24 Nov 2026:</p>
<table>
<thead><tr><th>Option</th><th>Price</th><th>What you get</th><th>Fits</th></tr></thead>
<tbody>
<tr><td>Atlas Free</td><td>$0</td><td>512 MB storage, shared RAM/CPU</td><td>learning, this course's project demo</td></tr>
<tr><td>Atlas Flex</td><td>$0.011/hour, capped at $30/month</td><td>5 GB, shared</td><td>prototypes, low-traffic internal tools</td></tr>
<tr><td>Atlas Dedicated M10</td><td>from $0.08/hour (~$57/month)</td><td>2 GB RAM, 2 vCPU, 3-member replica set, backups, monitoring</td><td>a first real production app</td></tr>
<tr><td>Self-managed (Community)</td><td>servers + <strong>people's time</strong></td><td>full control, any region/data-centre</td><td>teams with ops skills, data-residency rules, very large or steady workloads</td></tr>
</tbody></table>
<p>The honest comparison is not "$57 vs a $10 VPS". A self-run production setup is three servers (Lesson 7.1), backups to separate storage with weekly restore tests (Lesson 10.1), monitoring and alerts (10.2), upgrades twice a year (this lesson), security hardening (Chapter 9) — and someone on call when it breaks. A few hours of an engineer's month already costs more than M10. Self-managing pays off when the team already has that skill, when the data is large enough that managed prices multiply, or when a client contract requires servers in a specific place. For an OJT-sized product or a student project: Atlas Free/Flex while building, Dedicated when real users arrive.</p>
${nguon('💲', 'MongoDB Atlas — Pricing', 'Free, Flex and Dedicated tiers; cluster tier table (checked 24/11/2026)', 'https://www.mongodb.com/pricing')}

<h3>🕵️ Attacker's view</h3>
<p>Attackers love end-of-life versions: once a bug is public, every unpatched server is a target and nobody will ship a fix. The 2017 ransom wave (Lesson 9.1) hit installations that were not only open, but often years old. "Which version runs in production, and when does its support end?" belongs in every handover document.</p>

<h3>💼 On the job</h3>
<p>Outsourcing projects often inherit a database nobody has upgraded since go-live. A typical task for a junior: "prepare the upgrade plan from 6.0 to 8.0". A good plan has: inventory (versions of server, driver, ODM like Mongoose/Spring Data), the path (6.0 → 7.0 → 8.0, each with binary then FCV), release-note changes that touch your code, a staging rehearsal restored from a production backup, the rollback point (before each FCV raise), and the maintenance windows. Writing that document well is valued more than typing the commands.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"What is featureCompatibilityVersion?"</strong> — The data-format/feature level stored in admin.system.version. A new binary can run on the old FCV, which keeps the way back open; raising FCV enables new features and closes it.</li>
<li><strong>"Can we go from 6.0 straight to 8.0?"</strong> — No. One major release at a time: 7.0 binary, FCV 7.0, then 8.0. We measured mongod exiting with code 62 on a skip.</li>
<li><strong>"How do you upgrade without downtime?"</strong> — Rolling: secondaries one by one, stepDown the primary, upgrade it; retryable writes cover the election; FCV later.</li>
<li><strong>"What is your rollback plan?"</strong> — Keep the old FCV for a few days; take and test a backup before raising FCV; Community does not support binary downgrades.</li>
<li><strong>"Atlas or self-hosted for a new product?"</strong> — Usually Atlas until a measured reason says otherwise (cost at scale, data residency, existing ops team); count engineer time, not just server price.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Re-run the experiment, but after reaching 7.0 binary try <code>setFeatureCompatibilityVersion: "8.0"</code> directly. What happens and why?</li>
<li>Write the upgrade plan (one page) for CT Shop moving from 7.0 to 8.0 on a three-member replica set, including the rollback point.</li>
<li>Estimate one month of self-managed operation in hours (backups, restore test, upgrades, alerts, incidents) and compare with M10.</li>
</ol>
${loiGiai('Suggested answers', `<p>1. Refused — measured on 7.0.48: <code>Invalid feature compatibility version value '8.0'; expected '6.0' or '6.3' or '7.0'</code>. FCV can never be higher than the binary; upgrade the binary first.</p>
<p>2. Inventory and driver check → fresh backup + restore test → staging rehearsal → secondaries one by one (check <code>rs.status()</code> and lag between members) → <code>rs.stepDown()</code> → old primary → watch for a week (errors, p99, slow-query log) → new backup → <code>setFeatureCompatibilityVersion: "8.0", confirm: true</code>. Rollback point: before the FCV step.</p>
<p>3. A realistic small-team month: ~2 h backups/restore test, ~1 h alerts tuning, ~2 h patching/upgrade prep (averaged), plus incident time — several hours of an engineer, already above M10's ~$57. The calculation flips for large datasets or when ops staff are already there.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Binary version', 'Version of the mongod program (db.version()).'],
  ['featureCompatibilityVersion (FCV)', 'Feature/data-format level of the deployment; raised after the binary, needs confirm: true since 7.0.'],
  ['Rolling upgrade', 'Upgrade replica set members one at a time, primary last after rs.stepDown().'],
  ['End of life (EOL)', 'Date after which a version gets no fixes, including security fixes.'],
  ['Atlas Free / Flex / Dedicated', 'MongoDB\'s managed tiers: free 512 MB; capped shared tier; dedicated clusters from M10.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Upgrade one major release at a time: binary first, FCV later; skipping a version stops mongod from starting.</li>
<li>Raising FCV needs confirm: true and closes the cheap way back; Community does not support binary downgrade.</li>
<li>Replica sets upgrade without downtime: secondaries, stepDown, old primary.</li>
<li>Atlas vs self-managed is mostly a question of engineer time, not server price.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Nâng cấp, FCV, và Atlas với tự vận hành</h2>
<p class="lead">Database là phần trong hệ thống mà người ta sợ nâng cấp nhất. Vì sợ nên không nâng, và vài năm sau dự án chạy một phiên bản không còn nhận bản vá bảo mật nào. MongoDB làm việc nâng cấp an toàn hơn bằng thiết kế hai bước: đổi <em>binary</em> trước, đổi <em>định dạng dữ liệu</em> (featureCompatibilityVersion) sau. Trong bài này, ta đưa dữ liệu tạo bằng MongoDB 6.0 đi một mạch lên 8.0 trên cùng một volume, cố tình làm hỏng bằng cách nhảy cóc phiên bản, rồi trả lời câu hỏi mà nhóm nhỏ nào cũng hỏi: hay là trả tiền dùng Atlas cho xong?</p>

<h3>Hình ảnh đời thường</h3>
<p>Nâng cấp MongoDB giống chuyển cả nhà sang nhà mới theo hai bước. Đầu tiên chuyển người (binary): họ vẫn đọc được giấy tờ cũ. Chỉ khi mọi người đã ổn định mới đổi toàn bộ giấy tờ sang mẫu mới (FCV); từ lúc đó, nhà cũ không đọc được chúng nữa. Và bạn không thể nhảy từ ngôi nhà năm 2022 sang ngôi nhà năm 2026 trong một lần chuyển: phải ghé qua từng ngôi nhà ở giữa.</p>

<h3>1. Vì sao phải nâng cấp: hết hỗ trợ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">6.0</span><span class="lz-t">ra tháng 7/2022</span><span class="lz-d">hết hỗ trợ <strong>31/07/2025</strong> — không còn bản vá</span></div>
  <div class="lz-step"><span class="lz-k">7.0</span><span class="lz-t">tháng 8/2023</span><span class="lz-d">hỗ trợ tới 31/08/2027</span></div>
  <div class="lz-step"><span class="lz-k">8.0</span><span class="lz-t">tháng 10/2024 — khoá này dùng</span><span class="lz-d">hỗ trợ tới 31/10/2029</span></div>
  <div class="lz-step"><span class="lz-k">9.0</span><span class="lz-t">tháng 9/2026</span><span class="lz-d">hỗ trợ tới 31/10/2031</span></div>
</div>
<p>Khi một lỗ hổng như CVE-2025-14847 (Bài 9.1) xuất hiện, bản vá được phát hành cho các phiên bản còn hỗ trợ. Dự án còn ở 6.0 thì không có bản vá nào để cài. Cách sửa duy nhất là đợt nâng cấp bạn đã hoãn, giờ phải làm trong lúc gấp.</p>
${lienKet({ khoa: 'mongodb', bai: 'mgo-9-1-su-co-that', title: 'Bài 9.1 — CVE-2025-14847 và kiểm phiên bản', sub: 'script tự kiểm bắt ngay ảnh 8.0.16 cũ' })}
${nguon('📘', 'MongoDB — Software lifecycle schedules', 'ngày phát hành và ngày hết hỗ trợ của mọi phiên bản máy chủ', 'https://www.mongodb.com/legal/support-policy/lifecycles')}

<h3>2. Phiên bản binary và featureCompatibilityVersion</h3>
${lenh(K, 0)}
<p>Có hai con số phiên bản khác nhau. <code>db.version()</code> là <strong>binary</strong>, tức chương trình bạn đã cài. <strong>FCV</strong> là một tài liệu trong <code>admin.system.version</code>, cho biết dữ liệu được phép dùng định dạng trên đĩa và tính năng nào. Binary mới chạy được với FCV cũ: tính năng mới vẫn tắt, và binary cũ vẫn đọc được dữ liệu. Khoảng hở đó là cửa sổ an toàn của bạn. Để thấy tận mắt, ta tạo dữ liệu bằng 6.0 trong một volume có tên, rồi đổi ảnh container, giống như thay binary trên máy chủ:</p>
${lenh(K, 1)}
${lenh(K, 2)}

<h3>3. Nhảy cóc phiên bản là không khởi động được</h3>
${lenh(K, 3)}
<p>Binary 8.0 trên dữ liệu FCV 6.0: mongod từ chối khởi động (mã thoát 62), báo "UPGRADE PROBLEM: Found an invalid featureCompatibilityVersion document". Không có gì bị hỏng. Nhưng ở production, đây là lúc database đang sập và có người trong nhóm ngồi đọc log lúc 2 giờ sáng. Luật trong tài liệu: mỗi lần chỉ lên một bản lớn; từ 6.0 phải lên tới 7.0 (cả binary <em>lẫn</em> FCV) rồi mới lên 8.0.</p>

<h3>4. Cách đúng: 6.0 → 7.0 → 8.0</h3>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Binary 7.0 khởi động trên dữ liệu 6.0, và FCV vẫn là 6.0: dữ liệu chưa đổi gì. Nâng FCV mà thiếu <code>confirm: true</code> thì bị từ chối, kèm một thông báo đáng đọc: một khi đã nâng FCV, bạn không hạ xuống được nếu không có hỗ trợ. Có <code>confirm</code> thì thành công. Giờ binary 8.0 khởi động được (FCV 7.0), và lệnh cuối <code>setFeatureCompatibilityVersion: "8.0"</code> mở khoá các tính năng chỉ có ở 8.0. Ba tài liệu còn nguyên qua mọi bước.</p>

<h3>5. Quay lui: FCV thì được, binary thì không (Community)</h3>
${lenh(K, 9)}
<p>Hạ FCV một bậc (8.0 → 7.0) là được phép. Hạ <em>binary</em> lại là chuyện khác. Trang hạ cấp 8.0 viết thẳng "Binary downgrades are not supported for MongoDB Community Edition"; bản Enterprise thì cần bộ phận hỗ trợ giúp. (Trên lab, một lần thử chạy 7.0 trên dữ liệu như vậy có khởi động được. Nhưng "chạy được một lần trên máy tôi" không phải là kế hoạch quay lui được hỗ trợ.) Vậy kế hoạch quay lui thật của bạn là: <strong>ở trên binary mới với FCV cũ vài ngày</strong>, và giữ một <strong>bản sao lưu đã thử khôi phục, chụp ngay trước khi nâng FCV</strong>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — nâng FCV ngay trong cùng đợt bảo trì với binary.</strong> Cảm giác thì gọn ("xong hẳn đợt nâng cấp"), nhưng nó vứt bỏ con đường lùi rẻ duy nhất. Thứ tự hay gặp ở dự án thật: tuần 1 đổi binary, theo dõi lỗi, độ trễ (Bài 10.4) và truy vấn chậm; tuần 2 nâng FCV, sau một bản sao lưu mới.</p>
</div>

<h3>6. Nâng cấp cuốn chiếu một replica set</h3>
${ma('bash', CUON)}
<p>Với replica set ba thành viên (Bài 7.1), ứng dụng không bao giờ thấy database biến mất. Các secondary được nâng từng máy một. Primary nhường quyền, mất vài giây bầu chọn, và retryable write ở Bài 7.2 đỡ được khoảng đó. Sau cùng mới nâng primary cũ. Trước mọi thứ: phiên bản driver phải hỗ trợ máy chủ mới (xem bảng tương thích driver), và đọc phần thay đổi tương thích trong ghi chú phát hành. Lệnh bị bỏ, giá trị mặc định bị đổi mới là thứ làm hỏng ứng dụng, chứ không phải bản thân việc nâng cấp.</p>
${nguon('📘', 'MongoDB Docs — Upgrade a Replica Set to 8.0', 'điều kiện (mọi máy 7.0, FCV 7.0), secondary từng máy, rs.stepDown(), rồi setFeatureCompatibilityVersion', 'https://www.mongodb.com/docs/manual/release-notes/8.0-upgrade-replica-set/')}
${nguon('📘', 'MongoDB Docs — Downgrade 8.0 to 7.0', '"Binary downgrades are not supported for MongoDB Community Edition"', 'https://www.mongodb.com/docs/manual/release-notes/8.0-downgrade/')}
${nguon('📘', 'MongoDB Docs — setFeatureCompatibilityVersion', 'confirm: true, đường nâng/hạ', 'https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/')}

<h3>7. Atlas hay tự vận hành?</h3>
<p>Mọi thứ trong Chương 10, từ sao lưu kèm oplog và thử khôi phục, giám sát và cảnh báo, nâng cấp, tới vá bảo mật, đều là công việc. Atlas (dịch vụ quản lý sẵn của MongoDB) làm phần lớn chỗ đó, đổi lại là tiền. Giá trên trang giá Atlas ngày 24/11/2026:</p>
<table>
<thead><tr><th>Lựa chọn</th><th>Giá</th><th>Được gì</th><th>Hợp với</th></tr></thead>
<tbody>
<tr><td>Atlas Free</td><td>$0</td><td>512 MB lưu trữ, RAM/CPU dùng chung</td><td>học, demo dự án của khoá này</td></tr>
<tr><td>Atlas Flex</td><td>$0.011/giờ, tối đa $30/tháng</td><td>5 GB, dùng chung</td><td>bản mẫu, công cụ nội bộ ít truy cập</td></tr>
<tr><td>Atlas Dedicated M10</td><td>từ $0.08/giờ (~$57/tháng)</td><td>2 GB RAM, 2 vCPU, replica set 3 thành viên, sao lưu, giám sát</td><td>ứng dụng production thật đầu tiên</td></tr>
<tr><td>Tự vận hành (Community)</td><td>máy chủ + <strong>thời gian của người</strong></td><td>toàn quyền, đặt ở vùng/trung tâm dữ liệu nào cũng được</td><td>nhóm có kỹ năng vận hành, có yêu cầu nơi đặt dữ liệu, tải rất lớn hoặc đều đặn</td></tr>
</tbody></table>
<p>So sánh trung thực không phải "$57 với một VPS $10". Một hệ production tự vận hành gồm ba máy chủ (Bài 7.1), sao lưu ra kho riêng và thử khôi phục hằng tuần (Bài 10.1), giám sát và cảnh báo (10.2), nâng cấp mỗi năm hai lần (bài này), gia cố bảo mật (Chương 9), và có người trực khi nó hỏng. Chỉ vài giờ công kỹ sư mỗi tháng đã tốn hơn M10. Tự vận hành có lời khi nhóm đã có sẵn kỹ năng đó, khi dữ liệu đủ lớn để giá dịch vụ nhân lên nhiều lần, hoặc khi hợp đồng với khách bắt buộc đặt máy chủ ở một nơi cụ thể. Với một sản phẩm cỡ OJT hay đồ án sinh viên: Atlas Free/Flex lúc đang xây, Dedicated khi có người dùng thật.</p>
${nguon('💲', 'MongoDB Atlas — Pricing', 'các bậc Free, Flex, Dedicated; bảng cấu hình cụm (kiểm ngày 24/11/2026)', 'https://www.mongodb.com/pricing')}

<h3>🕵️ Góc hacker</h3>
<p>Kẻ tấn công rất thích các phiên bản đã hết hỗ trợ. Một khi lỗi được công bố, mọi máy chưa vá đều là mục tiêu, và sẽ không ai phát hành bản sửa. Làn sóng tống tiền 2017 (Bài 9.1) đánh vào những máy không chỉ để mở, mà thường đã cũ nhiều năm. Câu "production đang chạy bản nào, và bao giờ hết hỗ trợ?" phải có trong mọi tài liệu bàn giao.</p>

<h3>💼 Đi làm</h3>
<p>Dự án outsourcing hay nhận lại một database không ai nâng cấp từ ngày chạy thật. Một việc điển hình giao cho junior: "chuẩn bị kế hoạch nâng cấp từ 6.0 lên 8.0". Một kế hoạch tốt gồm: kiểm kê (phiên bản máy chủ, driver, ODM như Mongoose/Spring Data), lộ trình (6.0 → 7.0 → 8.0, mỗi bước đổi binary rồi mới tới FCV), các thay đổi trong ghi chú phát hành có chạm vào mã của mình, một lần diễn tập trên staging khôi phục từ bản sao lưu production, điểm quay lui (trước mỗi lần nâng FCV), và các khung giờ bảo trì. Viết tốt tài liệu đó được đánh giá cao hơn gõ lệnh.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"featureCompatibilityVersion là gì?"</strong> — Mức định dạng dữ liệu/tính năng, lưu trong admin.system.version. Binary mới chạy được trên FCV cũ, giữ đường lùi còn mở; nâng FCV thì bật tính năng mới và đóng đường lùi.</li>
<li><strong>"Lên thẳng từ 6.0 tới 8.0 được không?"</strong> — Không. Mỗi lần một bản lớn: binary 7.0, FCV 7.0, rồi mới 8.0. Ta đã đo mongod thoát với mã 62 khi nhảy cóc.</li>
<li><strong>"Nâng cấp không dừng hệ thống thế nào?"</strong> — Cuốn chiếu: secondary từng máy, primary stepDown rồi nâng; retryable write đỡ lúc bầu chọn; FCV làm sau.</li>
<li><strong>"Kế hoạch quay lui của bạn là gì?"</strong> — Giữ FCV cũ vài ngày; chụp và thử khôi phục bản sao lưu trước khi nâng FCV; Community không hỗ trợ hạ binary.</li>
<li><strong>"Sản phẩm mới thì Atlas hay tự dựng?"</strong> — Thường là Atlas cho tới khi có lý do đo được để đổi (chi phí khi lớn, nơi đặt dữ liệu, đã có đội vận hành); tính cả giờ công kỹ sư, không chỉ giá máy chủ.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy lại thí nghiệm, nhưng khi đã lên binary 7.0 thì thử thẳng <code>setFeatureCompatibilityVersion: "8.0"</code>. Chuyện gì xảy ra, vì sao?</li>
<li>Viết kế hoạch nâng cấp (một trang) cho CT Shop từ 7.0 lên 8.0 trên replica set ba thành viên, có điểm quay lui.</li>
<li>Ước lượng một tháng tự vận hành theo giờ công (sao lưu, thử khôi phục, nâng cấp, cảnh báo, sự cố) và so với M10.</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. Bị từ chối, đo thật trên 7.0.48: <code>Invalid feature compatibility version value '8.0'; expected '6.0' or '6.3' or '7.0'</code>. FCV không bao giờ được cao hơn binary; phải nâng binary trước.</p>
<p>2. Kiểm kê và kiểm driver → sao lưu mới + thử khôi phục → diễn tập trên staging → secondary từng máy (xem <code>rs.status()</code> và độ trễ giữa các máy) → <code>rs.stepDown()</code> → primary cũ → theo dõi một tuần (lỗi, p99, log truy vấn chậm) → sao lưu mới → <code>setFeatureCompatibilityVersion: "8.0", confirm: true</code>. Điểm quay lui: trước bước FCV.</p>
<p>3. Một tháng thực tế của nhóm nhỏ: khoảng 2 giờ sao lưu và thử khôi phục, khoảng 1 giờ chỉnh cảnh báo, khoảng 2 giờ vá và chuẩn bị nâng cấp (chia đều), cộng thời gian xử lý sự cố. Tức vài giờ công kỹ sư, đã hơn khoảng $57 của M10. Phép tính đảo chiều khi dữ liệu lớn hoặc khi đã có sẵn người vận hành.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Phiên bản binary', 'Phiên bản của chương trình mongod (db.version()).'],
  ['featureCompatibilityVersion (FCV)', 'Mức tính năng/định dạng dữ liệu của hệ thống; nâng sau binary, từ 7.0 phải có confirm: true.'],
  ['Nâng cấp cuốn chiếu', 'Nâng từng thành viên replica set một, primary sau cùng sau rs.stepDown().'],
  ['Hết hỗ trợ (EOL)', 'Ngày mà sau đó một phiên bản không còn nhận bản sửa nào, kể cả bản vá bảo mật.'],
  ['Atlas Free / Flex / Dedicated', 'Các bậc dịch vụ quản lý sẵn của MongoDB: miễn phí 512 MB; bậc dùng chung có trần giá; cụm riêng từ M10.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi lần nâng một bản lớn: binary trước, FCV sau; nhảy cóc thì mongod không khởi động.</li>
<li>Nâng FCV cần confirm: true và đóng con đường lùi rẻ; Community không hỗ trợ hạ binary.</li>
<li>Replica set nâng cấp không dừng hệ thống: secondary, stepDown, primary cũ.</li>
<li>Atlas hay tự vận hành chủ yếu là bài toán giờ công kỹ sư, không phải giá máy chủ.</li>
</ul>
</div>
`,
};
