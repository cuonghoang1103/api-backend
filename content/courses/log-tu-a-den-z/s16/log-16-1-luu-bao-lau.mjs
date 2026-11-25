/**
 * 16.1 — Thời gian lưu (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s16/luu'] (máy chủ may16 = Ubuntu 24.04 systemd trong container lgz-c16-may; Loki 3.7.10 -print-config; logrotate mô phỏng 5 ngày).
 * Nguồn pháp lý đã kiểm 24/11/2026: Luật An ninh mạng 116/2025/QH15 (hiệu lực 01/7/2026, thay Luật 24/2018/QH14); Nghị định 333/2026/NĐ-CP thay Nghị định 53/2022
 * (nhật ký hệ thống phục vụ điều tra vi phạm: tối thiểu 12 tháng — tóm tắt EY 9/2026); PCI DSS v4.0.1 yêu cầu 10.5.1; GDPR Điều 5(1)(e).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Retention: how long to keep what, hot/warm/cold tiers, and legal or contractual requirements|||Thời gian lưu: giữ cái gì bao lâu, tầng nóng/ấm/lạnh, và yêu cầu pháp lý hoặc hợp đồng',
  slug: 'log-16-1-luu-bao-lau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thời gian lưu được suy ra từ MỤC ĐÍCH (gỡ lỗi: ngày; bảo mật: tháng; pháp lý/kiểm toán: năm), không chép con số của ai. Kiểm thật một máy Ubuntu: logrotate mặc định chỉ giữ 4 tuần, journald không có hạn theo thời gian, Loki mặc định giữ MÃI (retention_period: 0s), logrotate rotate 3 xoá đúng ngày thứ tư. Luật Việt Nam hiện hành (Luật An ninh mạng 2025, Nghị định 333/2026: nhật ký hệ thống tối thiểu 12 tháng), PCI DSS 10.5.1, GDPR "giới hạn lưu trữ" — và xoá đúng hạn cũng là nghĩa vụ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>How long should a log live?</h2>
<p class="lead">Chapters 7–15 taught you to read, collect and search logs. Chapter 16 is about running them for years without surprises: how long to keep them (this lesson), how much they cost (16.2), what must never be in them (16.3), who may read or delete them (16.4), the daily routine (16.5), and writing it all down as a policy (16.6). Lab 16 audits a server that gets all of this wrong.</p>

<h3>The everyday picture: receipts in a drawer</h3>
<p>You keep a supermarket receipt for a week (in case you return something), a laptop invoice for the warranty period (two years), and tax papers for as long as the law says. Nobody keeps every receipt forever: the drawer overflows, and a stolen drawer leaks your whole life. Logs are the same: the <strong>purpose</strong> decides the time, and the time decides the cost and the risk.</p>

<h3>Step 1 — find out what your machine keeps today</h3>
<p>Before choosing anything, measure. On a fresh Ubuntu 24.04 server (our lab machine <code>may16</code>, a real systemd system in a container):</p>
${lenh('s16/luu', 0)}
<p><code>weekly</code> + <code>rotate 4</code>: <code>auth.log</code>, <code>syslog</code> and friends are kept for about <strong>four weeks</strong>, then deleted. An intrusion discovered after five weeks — common, because attackers stay quiet — has no SSH log left on this machine.</p>
${lenh('s16/luu', 1)}
<p>journald has <strong>no time limit</strong> by default (<code>MaxRetentionSec=</code> empty): it keeps whatever fits in 10 % of the file system (capped at 4 GB, lesson 7.4). On a quiet server that can be a year; on a noisy one, two days. "As long as the disk allows" is not a retention policy.</p>
${lenh('s16/luu', 2)}
<p>Loki's sample configuration keeps everything <strong>forever</strong>: <code>retention_enabled: false</code>, <code>retention_period: 0s</code>. The disk grows until it is full (lesson 15.1 mentioned it). Retention in Loki needs both <code>limits_config.retention_period</code> and the compactor with <code>retention_enabled: true</code> and a <code>delete_request_store</code>.</p>
${lenh('s16/luu', 3)}
<p>Docker's <code>json-file</code> driver has no limit unless the daemon or the container sets one. This home machine already has <code>max-size: 10m, max-file: 3</code> in <code>/etc/docker/daemon.json</code>; a fresh install prints <code>map[]</code> — unlimited. Rotation of Docker logs is taught in the Observability course (2.2).</p>

<h3>Step 2 — retention by purpose</h3>
<table>
<thead><tr><th>Purpose</th><th>Typical logs</th><th>How far back you really look</th><th>Typical retention</th></tr></thead>
<tbody>
<tr><td>Debugging what is happening now</td><td>debug/trace, application info</td><td>hours to a few days</td><td>3–14 days</td></tr>
<tr><td>"When did this start?" after an incident</td><td>access logs, app errors, deploy logs</td><td>days to weeks</td><td>30–90 days</td></tr>
<tr><td>Security investigations</td><td>auth, sudo, audit, VPN, firewall, DNS</td><td>months (attackers are often found late)</td><td>≥ 12 months</td></tr>
<tr><td>Law, contracts, audits, disputes</td><td>admin actions, payments, access to personal data</td><td>years</td><td>by the rule you can name</td></tr>
</tbody>
</table>
<p>The rule of thumb: if you cannot name the reason (a person who will look, or a regulation), you probably do not need the longer tier. The Observability course (2.5) measures the same idea for application logs.</p>

<h3>Step 3 — hot, warm, cold</h3>
<ul>
<li><strong>Hot</strong>: indexed and searchable in seconds (Loki, Elasticsearch). Expensive per GB. The last days to weeks.</li>
<li><strong>Warm</strong>: still searchable but slower/cheaper (older Elasticsearch indices on cheaper nodes, CloudWatch Logs Infrequent Access).</li>
<li><strong>Cold / archive</strong>: compressed files in object storage (S3, R2, MinIO), no index — download a day and grep it. Cheap, and can be made immutable (lesson 16.4).</li>
</ul>
<p>A small calculator from measured numbers (2.64 GB of raw logs per day from lesson 16.2, 16× compression measured on the course access log):</p>
${lenh('s16/luu', 6)}
<p>Keeping everything one year in the hot tier would need about 181 GB; splitting by purpose needs about 10.5 GB hot plus 25 GB cold. The "×3" for hot storage (index + replicas) is a rough assumption — measure yours.</p>

<h3>Step 4 — deletion must actually happen</h3>
<p>Retention is two promises: keep <em>at least</em> this long, and delete <em>after</em> this long. Watch logrotate keep exactly three old files (five days simulated with <code>-f</code>):</p>
${lenh('s16/luu', 4)}
${lenh('s16/luu', 5)}
<p>Days 1 and 2 are gone; only 3, 4 and 5 remain. Check the same for every place logs end up: the Loki compactor, the bucket lifecycle rule (<code>mc ilm rule add --expire-days 365</code>), the SIEM, and the copies people made during an incident (a CSV on someone's laptop counts).</p>

<h3>The rules you will meet</h3>
<ul>
<li><strong>Vietnam — Cybersecurity Law 2025</strong> (No. 116/2025/QH15, effective 1 July 2026, replacing the 2018 law) and its implementing <strong>Decree 333/2026/NĐ-CP</strong> (replacing Decree 53/2022): system logs used to investigate violations of the cybersecurity law must be kept for <strong>at least 12 months</strong>, with integrity protected against unauthorised change or deletion. Who exactly is covered (domestic/foreign providers of telecom, Internet and online services) is defined in the decree — read the official text before advising a company.</li>
<li><strong>Vietnam — Personal Data Protection Law</strong> (No. 91/2025/QH15, effective 1 January 2026, with Decree 356/2025/NĐ-CP): logs that contain personal data are personal data — keep them only as long as needed for the purpose.</li>
<li><strong>PCI DSS v4.0.1, requirement 10.5.1</strong> (anyone handling card data): keep audit log history at least 12 months, with the most recent three months immediately available for analysis.</li>
<li><strong>GDPR Article 5(1)(e)</strong> "storage limitation" (EU customers, many outsourcing projects): no longer than necessary. Japanese customers often specify retention in the contract or their security guidelines — ask for the document.</li>
</ul>
<p>Law changes: these were checked in November 2026. In a real company the numbers come from the legal/compliance person and the contract; your job is to make the systems keep and delete exactly that.</p>

<h3>⚠ Traps</h3>
<ul>
<li><strong>Longest wins by accident.</strong> One central store with one retention for everything means debug logs are kept 12 months "because of the law" — expensive and risky. Separate streams (by label/index) with separate retention.</li>
<li><strong>Retention ≠ deletion of one person's data.</strong> A 30-day policy does not answer "delete my data now" — see Observability 2.5. The robust answer is not to log personal data at all (16.3).</li>
<li><strong>Backups and archives</strong> inherit the data but not the policy. Put a lifecycle rule on them too.</li>
</ul>

<h3>🛡️ Attacker's corner: waiting out your retention</h3>
<p>The median time attackers stay inside before being discovered has been measured in days to weeks for years (Mandiant M-Trends reports). An attacker who knows your auth logs live four weeks only needs to stay quiet for five. The SolarWinds compromise (disclosed December 2020) was active for months before discovery, and investigators needed logs from long before the alarm. Defence: security logs ≥ 12 months, off the machine, immutable (16.4) — and alert on log deletion (Chapter 15).</p>

<h3>Real-world situations</h3>
<ul>
<li><strong>OJT/outsourcing</strong>: the customer asks "how long do you keep access logs?" — answer with the per-purpose table and where each tier lives, not "as long as the disk allows".</li>
<li><strong>Student project (SWP391)</strong>: 14 days of app logs and 90 days of login logs is a defensible choice; write it in the README (16.6).</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>On your Linux VM, print the logrotate and journald settings as in Step 1. How many days of <code>auth.log</code> does it keep?</li>
<li>Make <code>auth.log</code> keep 12 months without making <code>syslog</code> keep 12 months.</li>
<li>Edit <code>ke-hoach-luu.py</code> with your own GB/day and compression ratio. What is your hot/cold split?</li>
</ol>
<p><strong>Pass:</strong> (1) 4 weeks; (2) a separate stanza for <code>/var/log/auth.log</code> with <code>monthly</code> + <code>rotate 12</code> (and remove it from the rsyslog stanza, otherwise logrotate complains about a duplicate entry), or ship auth to the central store with 12-month retention; (3) a table with a reason per row.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Retention', 'How long a log is kept before deletion — a minimum and a maximum.'],
  ['Hot / warm / cold', 'Indexed-fast / searchable-cheaper / archived-no-index tiers.'],
  ['Lifecycle rule', 'Object-storage rule that moves or deletes objects after N days.'],
  ['Storage limitation', 'GDPR principle: keep personal data no longer than necessary.'],
  ['PCI DSS 10.5.1', 'Audit logs ≥ 12 months, last 3 months immediately available.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Purpose → time → cost/risk. Name the reason for every tier.</li>
<li>Default Ubuntu keeps auth logs 4 weeks; journald has no time limit; Loki keeps forever until you enable retention.</li>
<li>Security logs ≥ 12 months (Vietnam Decree 333/2026, PCI DSS), off the machine.</li>
<li>Deletion is part of retention — verify it on every copy.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Một dòng log nên sống bao lâu?</h2>
<p class="lead">Chương 7–15 dạy bạn đọc, gom và tìm log. Chương 16 là chuyện vận hành chúng nhiều năm mà không bị bất ngờ: giữ bao lâu (bài này), tốn bao nhiêu (16.2), cái gì tuyệt đối không được có trong log (16.3), ai được đọc hay xoá (16.4), nếp kiểm hằng ngày (16.5), và viết tất cả thành chính sách (16.6). Lab 16 rà soát một máy chủ làm sai hết những điều này.</p>

<h3>Liên tưởng đời thường: hoá đơn trong ngăn kéo</h3>
<p>Hoá đơn siêu thị bạn giữ một tuần (lỡ phải đổi hàng), hoá đơn laptop giữ hết bảo hành (hai năm), giấy tờ thuế giữ đúng thời hạn luật bắt. Không ai giữ mọi hoá đơn mãi mãi: ngăn kéo tràn, và mất ngăn kéo là lộ cả cuộc đời. Log cũng vậy: <strong>mục đích</strong> quyết định thời gian, thời gian quyết định chi phí và rủi ro.</p>

<h3>Bước 1 — máy của bạn hôm nay đang giữ bao lâu</h3>
<p>Trước khi chọn gì, hãy đo. Trên một máy chủ Ubuntu 24.04 mới cài (máy lab <code>may16</code>, một hệ systemd thật chạy trong container):</p>
${lenh('s16/luu', 0)}
<p><code>weekly</code> + <code>rotate 4</code>: <code>auth.log</code>, <code>syslog</code> và các tệp cùng nhóm được giữ khoảng <strong>bốn tuần</strong> rồi bị xoá. Một vụ đột nhập phát hiện sau năm tuần — chuyện thường, vì kẻ tấn công giữ im lặng — sẽ không còn dòng log SSH nào trên máy này.</p>
${lenh('s16/luu', 1)}
<p>journald mặc định <strong>không giới hạn theo thời gian</strong> (<code>MaxRetentionSec=</code> để trống): nó giữ được bao nhiêu thì giữ trong 10 % hệ thống tệp (trần 4 GB, bài 7.4). Máy chủ yên tĩnh có thể giữ được một năm; máy ồn ào chỉ hai ngày. "Đĩa còn chỗ thì giữ" không phải chính sách lưu.</p>
${lenh('s16/luu', 2)}
<p>Cấu hình mẫu của Loki giữ mọi thứ <strong>mãi mãi</strong>: <code>retention_enabled: false</code>, <code>retention_period: 0s</code>. Đĩa cứ lớn tới khi đầy (bài 15.1 đã nhắc). Muốn Loki xoá theo hạn phải có cả <code>limits_config.retention_period</code> lẫn compactor với <code>retention_enabled: true</code> và <code>delete_request_store</code>.</p>
${lenh('s16/luu', 3)}
<p>Trình ghi <code>json-file</code> của Docker không có giới hạn nếu daemon hay container không đặt. Máy nhà này đã có <code>max-size: 10m, max-file: 3</code> trong <code>/etc/docker/daemon.json</code>; máy mới cài sẽ in <code>map[]</code> — không giới hạn. Xoay vòng log Docker đã dạy ở khoá Observability (bài 2.2).</p>

<h3>Bước 2 — lưu theo mục đích</h3>
<table>
<thead><tr><th>Mục đích</th><th>Log tiêu biểu</th><th>Thật sự nhìn lại xa tới đâu</th><th>Thời gian lưu hay dùng</th></tr></thead>
<tbody>
<tr><td>Gỡ lỗi chuyện đang xảy ra</td><td>debug/trace, info của ứng dụng</td><td>vài giờ tới vài ngày</td><td>3–14 ngày</td></tr>
<tr><td>"Lỗi này bắt đầu từ lúc nào?" sau sự cố</td><td>access log, lỗi ứng dụng, log deploy</td><td>vài ngày tới vài tuần</td><td>30–90 ngày</td></tr>
<tr><td>Điều tra bảo mật</td><td>auth, sudo, audit, VPN, tường lửa, DNS</td><td>nhiều tháng (kẻ tấn công thường bị phát hiện muộn)</td><td>≥ 12 tháng</td></tr>
<tr><td>Luật, hợp đồng, kiểm toán, tranh chấp</td><td>thao tác quản trị, thanh toán, truy cập dữ liệu cá nhân</td><td>nhiều năm</td><td>theo đúng quy định bạn gọi được tên</td></tr>
</tbody>
</table>
<p>Quy tắc dễ nhớ: nếu không gọi được tên lý do (một người sẽ xem, hoặc một quy định), có lẽ bạn không cần tầng lưu dài hơn. Khoá Observability (bài 2.5) đo cùng ý tưởng này cho log ứng dụng.</p>

<h3>Bước 3 — nóng, ấm, lạnh</h3>
<ul>
<li><strong>Nóng</strong>: có chỉ mục, tìm trong vài giây (Loki, Elasticsearch). Đắt theo GB. Vài ngày tới vài tuần gần nhất.</li>
<li><strong>Ấm</strong>: vẫn tìm được nhưng chậm/rẻ hơn (chỉ mục Elasticsearch cũ trên nút rẻ hơn, CloudWatch Logs lớp Infrequent Access).</li>
<li><strong>Lạnh / lưu trữ</strong>: tệp nén trong kho đối tượng (S3, R2, MinIO), không chỉ mục — tải một ngày về rồi grep. Rẻ, và làm được bất biến (bài 16.4).</li>
</ul>
<p>Một bộ tính nhỏ từ số đo được (2,64 GB log thô mỗi ngày ở bài 16.2, nén 16 lần đo trên access log của gói log khoá học):</p>
${lenh('s16/luu', 6)}
<p>Giữ mọi thứ một năm ở tầng nóng cần khoảng 181 GB; chia theo mục đích chỉ cần khoảng 10,5 GB nóng cộng 25 GB lạnh. Hệ số "×3" cho tầng nóng (chỉ mục + bản sao) là giả định thô — hãy đo hệ thống của bạn.</p>

<h3>Bước 4 — việc xoá phải xảy ra thật</h3>
<p>Thời gian lưu là hai lời hứa: giữ <em>ít nhất</em> chừng này, và xoá <em>sau</em> chừng này. Xem logrotate giữ đúng ba tệp cũ (mô phỏng năm ngày bằng <code>-f</code>):</p>
${lenh('s16/luu', 4)}
${lenh('s16/luu', 5)}
<p>Ngày 1 và 2 đã mất; chỉ còn 3, 4 và 5. Kiểm y như vậy cho mọi nơi log đi tới: compactor của Loki, luật vòng đời của bucket (<code>mc ilm rule add --expire-days 365</code>), SIEM, và cả các bản sao người ta tạo ra trong lúc xử lý sự cố (một tệp CSV trên laptop của ai đó cũng tính).</p>

<h3>Các quy định bạn sẽ gặp</h3>
<ul>
<li><strong>Việt Nam — Luật An ninh mạng 2025</strong> (số 116/2025/QH15, hiệu lực từ 01/7/2026, thay Luật An ninh mạng 2018) và <strong>Nghị định 333/2026/NĐ-CP</strong> hướng dẫn (thay Nghị định 53/2022): nhật ký hệ thống phục vụ điều tra, xử lý vi phạm pháp luật về an ninh mạng phải lưu <strong>tối thiểu 12 tháng</strong>, hệ thống lưu phải bảo đảm toàn vẹn, ngăn sửa hoặc xoá trái phép. Ai thuộc diện (doanh nghiệp trong và ngoài nước cung cấp dịch vụ viễn thông, Internet, dịch vụ trên không gian mạng) do nghị định xác định — đọc văn bản chính thức trước khi tư vấn cho công ty.</li>
<li><strong>Việt Nam — Luật Bảo vệ dữ liệu cá nhân</strong> (số 91/2025/QH15, hiệu lực 01/01/2026, kèm Nghị định 356/2025/NĐ-CP): log chứa dữ liệu cá nhân thì chính nó là dữ liệu cá nhân — chỉ giữ trong thời gian cần cho mục đích.</li>
<li><strong>PCI DSS v4.0.1, yêu cầu 10.5.1</strong> (ai xử lý dữ liệu thẻ): giữ lịch sử audit log ít nhất 12 tháng, ba tháng gần nhất phải sẵn sàng để phân tích ngay.</li>
<li><strong>GDPR Điều 5(1)(e)</strong> "giới hạn lưu trữ" (khách hàng châu Âu, nhiều dự án outsourcing): không lâu hơn mức cần thiết. Khách Nhật thường ghi thời gian lưu trong hợp đồng hoặc bộ hướng dẫn bảo mật của họ — hãy xin tài liệu đó.</li>
</ul>
<p>Luật thay đổi: các mục trên được kiểm vào tháng 11/2026. Ở công ty thật, con số đến từ người phụ trách pháp chế/tuân thủ và từ hợp đồng; việc của bạn là làm cho hệ thống giữ và xoá đúng như vậy.</p>

<h3>⚠ Bẫy</h3>
<ul>
<li><strong>Hạn dài nhất thắng do vô tình.</strong> Một kho trung tâm với một thời gian lưu cho tất cả nghĩa là log debug bị giữ 12 tháng "vì luật" — tốn tiền và rủi ro. Tách luồng (theo nhãn/chỉ mục) với thời gian lưu riêng.</li>
<li><strong>Thời gian lưu ≠ xoá dữ liệu của một người.</strong> Chính sách 30 ngày không trả lời được "hãy xoá dữ liệu của tôi ngay" — xem Observability 2.5. Cách chắc nhất là đừng ghi dữ liệu cá nhân vào log ngay từ đầu (16.3).</li>
<li><strong>Bản sao lưu và kho lưu trữ</strong> thừa hưởng dữ liệu nhưng không thừa hưởng chính sách. Đặt luật vòng đời cho cả chúng.</li>
</ul>

<h3>🛡️ Góc hacker: chờ cho log của bạn hết hạn</h3>
<p>Thời gian kẻ tấn công nằm trong hệ thống trước khi bị phát hiện (dwell time) nhiều năm liền được đo bằng ngày tới tuần (báo cáo M-Trends của Mandiant). Kẻ biết log xác thực của bạn chỉ sống bốn tuần thì chỉ cần im lặng năm tuần. Vụ SolarWinds (công bố 12/2020) hoạt động nhiều tháng trước khi bị phát hiện, và người điều tra cần log từ rất lâu trước khi có báo động. Phòng thủ: log bảo mật ≥ 12 tháng, nằm ngoài máy, bất biến (16.4) — và cảnh báo khi log bị xoá (Chương 15).</p>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>OJT/outsourcing</strong>: khách hỏi "các bạn giữ access log bao lâu?" — trả lời bằng bảng theo mục đích và mỗi tầng nằm ở đâu, đừng nói "đĩa còn thì còn".</li>
<li><strong>Đồ án (SWP391)</strong>: 14 ngày log ứng dụng và 90 ngày log đăng nhập là lựa chọn bảo vệ được; ghi vào README (16.6).</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy ảo Linux của bạn, in cấu hình logrotate và journald như Bước 1. <code>auth.log</code> được giữ bao nhiêu ngày?</li>
<li>Làm cho <code>auth.log</code> được giữ 12 tháng mà <code>syslog</code> không bị kéo theo 12 tháng.</li>
<li>Sửa <code>ke-hoach-luu.py</code> bằng GB/ngày và tỉ lệ nén của bạn. Chia nóng/lạnh ra sao?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) 4 tuần; (2) một khối riêng cho <code>/var/log/auth.log</code> với <code>monthly</code> + <code>rotate 12</code> (và bỏ nó khỏi khối rsyslog, nếu không logrotate báo trùng mục), hoặc đẩy auth về kho trung tâm có hạn 12 tháng; (3) một bảng, mỗi dòng có lý do.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Thời gian lưu (retention)', 'Log được giữ bao lâu trước khi xoá — gồm mức tối thiểu và tối đa.'],
  ['Nóng / ấm / lạnh', 'Tầng có chỉ mục tìm nhanh / tìm được nhưng rẻ hơn / lưu trữ không chỉ mục.'],
  ['Luật vòng đời (lifecycle)', 'Luật của kho đối tượng: chuyển lớp hoặc xoá đối tượng sau N ngày.'],
  ['Giới hạn lưu trữ', 'Nguyên tắc GDPR: không giữ dữ liệu cá nhân lâu hơn mức cần.'],
  ['PCI DSS 10.5.1', 'Audit log ≥ 12 tháng, 3 tháng gần nhất phải xem được ngay.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mục đích → thời gian → chi phí/rủi ro. Mỗi tầng phải gọi được tên lý do.</li>
<li>Ubuntu mặc định giữ log xác thực 4 tuần; journald không có hạn theo thời gian; Loki giữ mãi tới khi bạn bật retention.</li>
<li>Log bảo mật ≥ 12 tháng (Nghị định 333/2026, PCI DSS), nằm ngoài máy.</li>
<li>Xoá là một nửa của thời gian lưu — kiểm trên mọi bản sao.</li>
</ul>
${nguon('⚖️', 'EY Việt Nam — Tin nhanh pháp lý 9/2026: Nghị định 333/2026/NĐ-CP', 'Nhật ký hệ thống tối thiểu 12 tháng, toàn vẹn, thay Nghị định 53/2022', 'https://www.ey.com/vi_vn/technical/tax/tax-and-law-updates/tin-nhanh-phap-ly-nghi-dinh-so-333-2026-nd-cp-quy-dinh-chi-tiet-mot-so-dieu-va-bien-phap-thi-hanh-luat-an-ninh-mang')}
${nguon('⚖️', 'Cổng thông tin Hà Tĩnh — Luật An ninh mạng có hiệu lực từ 1/7/2026', 'Luật số 116/2025/QH15, thông qua 10/12/2025', 'https://hatinh.gov.vn/vi/bai-viet/luat-an-ninh-mang-co-hieu-luc-tu-172026-dat-con-nguoi-o-vi-tri-trung-tam')}
${nguon('📘', 'Microsoft Learn — PCI DSS Requirement 10', 'Yêu cầu 10.5.1: lưu audit log 12 tháng, 3 tháng sẵn sàng', 'https://learn.microsoft.com/en-us/entra/standards/pci-requirement-10')}
${nguon('📘', 'Grafana Loki — Log retention', 'compactor retention_enabled, retention_period, delete_request_store', 'https://grafana.com/docs/loki/latest/operations/storage/retention/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-5-luu-tru', title: 'Observability 2.5 — Giữ bao lâu, và cái đó tốn bao nhiêu', sub: 'Đo nén, phân bậc cho log ứng dụng, sink R2', cta: 'Mở bài' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-2-xoay-vong', title: 'Observability 2.2 — Xoay vòng, hoặc là đĩa đầy', sub: 'max-size/max-file của Docker', cta: 'Mở bài' })}
</div>
`,
};
