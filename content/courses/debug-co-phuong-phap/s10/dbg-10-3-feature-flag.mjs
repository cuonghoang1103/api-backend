/**
 * 10.3 — Feature flag, công tắc ngắt, canary và rollback (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Node 22.22 (co.mjs chia nhóm theo SHA-256, công tắc ngắt đọc lại tệp mỗi giây), nginx 1.27 trọng số 19:1 + reload,
 * mô phỏng 8 máy kiểu Knight Capital 2012 — scratchpad/dbg/lab/ch10/node/c103.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { CO, CHIA_NHOM, APP103, CONG_TAC, NGINX_CANARY, CANARY_COMPOSE, K_CU, K_MOI, K_TRIEN_KHAI } from './_ma-10.mjs';
import { CHIA_NHOM as RA_CHIA_NHOM, CONG_TAC as RA_CONG_TAC, CANARY, KNIGHT } from './_ra-10.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;
const chiTiet = (tom, noiDung) => `<details><summary>${tom}</summary>${noiDung}</details>`;

const BANG_EN = `<table>
<thead><tr><th>Lever</th><th>Time to effect</th><th>What it undoes</th><th>Trap</th></tr></thead>
<tbody>
<tr><td>Kill switch (flag off)</td><td>seconds (here: under 1 s)</td><td>only the code behind that flag</td><td>flag store unreachable ⇒ the default value must be the safe one</td></tr>
<tr><td>Route traffic away (LB weight, remove canary)</td><td>seconds</td><td>everything the new instances do</td><td>sessions and caches pinned to the bad instances</td></tr>
<tr><td>Roll back the deploy</td><td>minutes (build, pull, start, health checks)</td><td>every change in the release, good ones too</td><td>database migrations do not roll back with the code; flags stay as they are</td></tr>
<tr><td>Hotfix forward</td><td>tens of minutes to hours</td><td>the bug, properly</td><td>written under pressure — needs the same review and tests</td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Cần gạt</th><th>Bao lâu có tác dụng</th><th>Gỡ được gì</th><th>Bẫy</th></tr></thead>
<tbody>
<tr><td>Công tắc ngắt (tắt cờ)</td><td>vài giây (ở đây: dưới 1 s)</td><td>chỉ đoạn mã nằm sau cờ đó</td><td>kho cờ không với tới ⇒ giá trị mặc định phải là giá trị an toàn</td></tr>
<tr><td>Rút lưu lượng (trọng số LB, gỡ canary)</td><td>vài giây</td><td>mọi thứ instance mới làm</td><td>phiên và cache dính vào instance hỏng</td></tr>
<tr><td>Rollback bản deploy</td><td>vài phút (build, kéo ảnh, khởi động, health check)</td><td>mọi thay đổi trong bản phát hành, cả thay đổi tốt</td><td>migration cơ sở dữ liệu không lùi theo mã; cờ vẫn giữ nguyên trạng thái</td></tr>
<tr><td>Hotfix tiến tới</td><td>vài chục phút tới vài giờ</td><td>chính lỗi đó, cho đàng hoàng</td><td>viết dưới áp lực — vẫn cần review và test như thường</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'Martin Fowler / Pete Hodgson — Feature Toggles', 'Bốn loại cờ (release, experiment, ops, permission) và chi phí giữ cờ.', 'https://martinfowler.com/articles/feature-toggles.html'),
  nguon('📘', 'Google SRE Workbook — Canarying Releases', 'Canary là một phép thử: so nhóm canary với nhóm đối chứng cùng lúc.', 'https://sre.google/workbook/canarying-releases/'),
  nguon('📘', 'OpenFeature', 'Chuẩn mở (CNCF) cho API feature flag, cắm được Unleash, flagd, LaunchDarkly…', 'https://openfeature.dev/'),
  nguon('🧯', 'SEC — Knight Capital, lệnh xử phạt 16/10/2013 (34-70694)', 'Một trong tám máy không được deploy; cờ cũ được tái dùng kích hoạt mã Power Peg chết; ~460 triệu USD trong 45 phút.', 'https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf'),
  lienKet({ khoa: 'incident-response', bai: 'ir-6-2-cam-mau', title: 'Incident Response 6.2 — Cầm máu: feature flag, chế độ chỉ đọc, chuyển lưu lượng', sub: 'Khi nào dùng cần gạt nào trong lúc chỉ huy sự cố.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-0-9-bat-dau-khi-khong-co', title: 'Bắt đầu tại đây (2/2) — Gỡ lỗi không phương pháp', sub: 'Knight Capital đã kể ở mục 0; ở đây là tái hiện cơ chế.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-3-cache', title: 'Bài 8.3 — Cache và "bản cũ vẫn chạy"', sub: '/health có commit hash: cách biết máy nào đang chạy gì.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.3 — Feature flags, kill switches, canaries and rollback|||10.3 — Feature flag, công tắc ngắt, canary và rollback',
  slug: 'dbg-10-3-feature-flag',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn cần gạt khi tính năng mới hỏng trên production, chạy thật và đo: cờ tự viết 25 dòng chia nhóm ổn định theo SHA-256 (5% = 507/10.000 người, tăng lên 20% vẫn giữ đủ 507 người cũ; Math.random() mỗi request ⇒ hai lượt chỉ trùng 31 người). Công tắc ngắt: 2.4.0 ở 20% bắn 9–18 lỗi 500 mỗi 200 request, sửa flags.json ⇒ 0 lỗi ngay cửa sổ kế, cùng một tiến trình, không deploy. Canary bằng nginx trọng số 19:1: tổng thể chỉ 1,65% lỗi (dưới ngưỡng cảnh báo) nhưng tách theo phiên bản là 2.4.0 = 33%, 2.3.1 = 0% — rút canary bằng nginx -s reload ⇒ 2000/2000 về 2.3.1. Tái hiện cơ chế Knight Capital 2012 với 8 tiến trình: deploy sót máy 8, bật cờ SMARS tái dùng ⇒ máy 8 bắn 10 triệu lệnh con; một lệnh curl /health ra "1 cu-2003, 7 moi-2012"; "khôi phục" bằng rollback mã mà để nguyên cờ ⇒ cả 8 máy chạy mã chết; tắt cờ mới hết. Bảng so 4 cần gạt, cờ cũ là bom hẹn giờ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Turning things off is a debugging tool</h2>
<p class="lead">While you look for the cause, users should stop suffering. A deploy takes minutes and drags every other change along; a well-placed flag takes seconds and touches only the broken part. This lesson builds the pieces from scratch so nothing is magic — a 25-line flag module, a kill switch, a 5% canary behind nginx, a rollback — measures each one, and then reproduces the mechanism of the most expensive flag mistake on record.</p>

<h3>An everyday picture: the circuit breaker box</h3>
<p>When the kitchen socket starts smoking you do not rewire the house, and you do not cut power to the whole building. You flip the one breaker labelled "kitchen". It only works because someone installed and labelled breakers <em>before</em> the fire. Feature flags are breakers for code: they must be installed, labelled and tested before the day you need them.</p>

<h3>1. A flag module you can read in one minute</h3>
${ma(CO)}
<p>Three rules hide in these lines. <strong>Stable bucketing</strong>: a user's bucket is a hash of <code>flag:user</code>, so the same person always gets the same answer. <strong>The kill switch wins</strong> over everything. <strong>Missing or broken config falls back to the safe default</strong> — if the flag file is corrupt, the old table stays; if the flag does not exist, the feature is off.</p>
${chiTiet('chia-nhom.mjs — measuring the bucketing', ma(CHIA_NHOM))}
${ra(RA_CHIA_NHOM)}
<p>At 5%, 507 of 10,000 users; raising to 20% keeps all 507 of them inside — nobody sees the feature appear and disappear. A per-request <code>Math.random()</code> gives about the same count each time but different people: only 31 users were in both runs. For debugging that is poison: the student who reported the bug cannot reproduce it, and you cannot pick "the users who saw version B" out of the logs. Log the flag decision (or the bucket) with the request so it can be.</p>

<h3>2. The kill switch, measured</h3>
${ma(APP103)}
${chiTiet('cong-tac.mjs — load, then flip the switch', ma(CONG_TAC))}
${ra(RA_CONG_TAC)}
<p>Version 2.4.0 adds "suggested room" for 20% of users. Users with no booking history crash it (<code>ls.at(-1).phong</code> on an empty list). The person on call edits one line in the flag store; the next window has zero errors. Same process — no build, no deploy, no restart, nothing else in 2.4.0 is undone. This is what lets you investigate calmly: the error rate is zero while you read the 37 error lines that were logged before the switch.</p>
<p>Real teams do not edit a JSON file on a server: they use a flag service (Unleash, flagd, LaunchDarkly, ConfigCat, or a table in their own database) with an audit log and permissions, and talk to it through a standard API such as OpenFeature. The mechanics are exactly the ones above.</p>

<h3>3. A canary: 5% of traffic, measured separately</h3>
${ma(NGINX_CANARY, 'nginx')}
${chiTiet('compose.yaml — two versions behind one nginx', ma(CANARY_COMPOSE, 'yaml'))}
${ra(CANARY)}
<p>Look at the overall number first: 33 errors in 2,000 requests is 1.65% — under a typical "5xx above 2%" alert, so nobody is paged. Split by version and the picture is unambiguous: the canary fails one request in three, the old version none. That is the whole point of a canary: compare the new group with the old group <em>at the same time</em>, under the same traffic, instead of comparing today with yesterday. It requires one thing from you as a developer: every response and log line says which version produced it (here the <code>x-ver</code> header, logged by nginx as <code>ver</code>). The rollback is one config change and <code>nginx -s reload</code>, which finishes in-flight requests on the old workers — 2,000 of 2,000 requests then go to 2.3.1.</p>
<p>Note the difference from the flag: the canary routes <em>requests</em>, so one user can hit 2.4.0 now and 2.3.1 on the next click. If that matters (a new UI, a data migration), route by user (sticky canary) or use a flag.</p>

<h3>4. Old flags are time bombs: Knight Capital, 1 August 2012</h3>
<p>Knight Capital was one of the largest US equity traders. According to the SEC's order, Knight deployed new code for a retail-liquidity program (RLP) to its eight SMARS order-routing servers. A technician missed one server, and nobody checked. The new code <strong>reused a flag</strong> that years earlier had activated "Power Peg", an old function that had not been used since 2003 but was still in the code — and whose order-completion tracking had been moved elsewhere in 2005. When the flag was turned on at the market open, seven servers ran RLP; the eighth ran Power Peg, which kept sending child orders because it never learned the parent orders were filled. In 45 minutes Knight sent millions of orders and lost about 460 million US dollars. During the incident, engineers rolled the new code back on the seven good servers — with the flag still on, so now all eight ran Power Peg. Here is the mechanism at toy scale, with eight Node processes:</p>
${chiTiet('ban-cu/may.mjs, ban-moi/may.mjs, trien-khai.sh', ma(K_CU) + ma(K_MOI) + ma(K_TRIEN_KHAI, 'bash'))}
${ra(KNIGHT)}
<p>Each step of the real incident is visible: the deploy script reports "done" with one machine skipped; one machine produces ten million child orders from ten parent orders (our lab stops at a million per parent; Knight had no such cap); one command — <code>/health</code> on every machine, counted with <code>uniq -c</code> — shows <code>1 cu-2003</code> immediately; the "restore" that rolls back code but not the flag makes all eight machines bad. Only switching the flag off stops it. The debugging lessons are general:</p>
<ul>
<li>Never reuse a flag name for a new meaning. Delete flags when the rollout is finished — a flag with no owner and no removal date is a time bomb.</li>
<li>Delete dead code behind flags; "nobody calls it" is not the same as "it cannot run".</li>
<li>Every instance must say what it runs (<code>/health</code> with version and commit, lesson 8.3), and the deploy must check all of them before anything is switched on.</li>
<li>During an incident, change one thing at a time and know what each lever undoes — table below.</li>
</ul>

<h3>5. Which lever, when</h3>
${BANG_EN}
<p>Rule of thumb on call: if the broken thing is behind a flag, switch the flag; if it is not, take the new version out of rotation; roll back the deploy when you cannot tell which change is guilty; fix forward only when the fix is small, reviewed and tested. In every case, write the time and the action into the incident timeline — 10.4.</p>

<h3>On the job</h3>
<p>In OJT you will not run the canary, but you will write code that goes behind flags. Habits that make you easy to work with: put every new risky path behind a flag whose default is "off"; log the flag decision with the request id; write the flag's removal as a ticket on the day you create it; make <code>/health</code> return version and commit; and in your PR description write "how to turn this off" in one sentence. When something breaks on the customer's side, the first question from your lead will be "can we switch it off?" — be the person who already knows the answer.</p>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>chia-nhom.mjs</code>, then change the hash input to just <code>user</code> (without the flag name). Why do all your flags now hit the same 5% of users? Why is that bad for experiments?</li>
<li>Run <code>cong-tac.mjs</code>, then corrupt <code>flags.json</code> (delete a brace) while it runs. What does <code>co.mjs</code> do? What should it log?</li>
<li>Run <code>c103-canary.sh</code> with weights 9:1 and compare the global and per-version error rates. Write the alert rule that would have caught 2.4.0.</li>
<li>Run <code>c103-knight.sh</code>. Change <code>trien-khai.sh</code> so the deploy fails loudly when any machine does not report the new version afterwards.</li>
<li>Add a flag (default off) and a kill switch to one feature of your project. Test that the feature disappears within seconds when switched off.</li>
</ol>
<p><strong>Done when:</strong> you can switch a broken feature off in under a minute without a deploy, and prove which version served a given request.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Feature flag</span><span class="v">A run-time switch deciding whether a code path is used, for whom.</span></div>
  <div class="kv"><span class="k">Kill switch</span><span class="v">A flag whose only job is to turn something off fast; overrides every rule.</span></div>
  <div class="kv"><span class="k">Stable bucketing</span><span class="v">Hash of flag + user ⇒ the same user always gets the same answer.</span></div>
  <div class="kv"><span class="k">Canary</span><span class="v">A small share of traffic on the new version, compared with the old version at the same time.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Returning to the previous release — undoes all its changes, not the flags or the database.</span></div>
  <div class="kv"><span class="k">Flag debt</span><span class="v">Old flags and the dead code behind them; the Knight Capital failure mode.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Stop the bleeding first, with the smallest lever that works: flag, then traffic, then rollback.</li>
<li>Flags: stable hash bucketing, kill switch wins, safe default when the store is broken, decision logged.</li>
<li>A canary only helps if you measure per version; global averages hide a 33% failure rate.</li>
<li>Never reuse a flag; remove flags and dead code; check every instance's version before switching on.</li>
<li>Know what each lever undoes — rolling back code does not roll back flags or data.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Tắt đi cũng là một công cụ gỡ lỗi</h2>
<p class="lead">Trong lúc bạn tìm nguyên nhân, người dùng nên được thôi chịu khổ. Một lần deploy mất vài phút và kéo theo mọi thay đổi khác; một cờ đặt đúng chỗ mất vài giây và chỉ chạm vào phần hỏng. Bài này dựng từng mảnh từ đầu để không có gì là phép màu — module cờ 25 dòng, công tắc ngắt, canary 5% sau nginx, rollback — đo từng cái, rồi tái hiện cơ chế của sai lầm về cờ đắt giá nhất từng được ghi lại.</p>

<h3>Liên tưởng đời thường: hộp cầu dao</h3>
<p>Khi ổ cắm trong bếp bốc khói, bạn không đi đi dây lại cả nhà, cũng không cắt điện cả toà nhà. Bạn gạt đúng cái cầu dao ghi "bếp". Việc đó chỉ làm được vì ai đó đã lắp và dán nhãn cầu dao <em>trước</em> khi có cháy. Feature flag là cầu dao cho mã: phải được lắp, dán nhãn và thử trước ngày bạn cần đến nó.</p>

<h3>1. Module cờ đọc hết trong một phút</h3>
${ma(CO)}
<p>Ba quy tắc nằm trong mấy dòng này. <strong>Chia nhóm ổn định</strong>: ô của một người dùng là mã băm của <code>cờ:người dùng</code>, nên cùng một người luôn nhận cùng một câu trả lời. <strong>Công tắc ngắt thắng</strong> mọi thứ. <strong>Cấu hình thiếu hoặc hỏng thì lùi về mặc định an toàn</strong> — tệp cờ hỏng thì giữ bảng cũ; cờ không tồn tại thì tính năng tắt.</p>
${chiTiet('chia-nhom.mjs — đo cách chia nhóm', ma(CHIA_NHOM))}
${ra(RA_CHIA_NHOM)}
<p>Ở 5% là 507 trên 10.000 người; tăng lên 20% vẫn giữ đủ 507 người đó ở trong — không ai thấy tính năng lúc hiện lúc mất. <code>Math.random()</code> mỗi request cho số lượng gần như nhau mỗi lần nhưng là những người khác nhau: chỉ 31 người có mặt ở cả hai lượt. Với việc gỡ lỗi, đó là thuốc độc: sinh viên báo lỗi không tái hiện được, và bạn không lọc được "những người đã thấy bản B" từ log. Hãy log quyết định của cờ (hoặc ô của người dùng) kèm request để làm được việc đó.</p>

<h3>2. Công tắc ngắt, đo thật</h3>
${ma(APP103)}
${chiTiet('cong-tac.mjs — tạo tải, rồi gạt công tắc', ma(CONG_TAC))}
${ra(RA_CONG_TAC)}
<p>Bản 2.4.0 thêm "gợi ý phòng" cho 20% người dùng. Người chưa từng đặt phòng làm nó sập (<code>ls.at(-1).phong</code> trên danh sách rỗng). Người trực sửa một dòng trong kho cờ; cửa sổ kế tiếp không còn lỗi nào. Vẫn là tiến trình đó — không build, không deploy, không restart, không gì khác trong 2.4.0 bị gỡ. Đây là thứ cho phép bạn điều tra bình tĩnh: tỉ lệ lỗi bằng không trong lúc bạn đọc 37 dòng lỗi đã được ghi trước khi gạt công tắc.</p>
<p>Các nhóm thật không sửa tệp JSON trên server: họ dùng một dịch vụ cờ (Unleash, flagd, LaunchDarkly, ConfigCat, hoặc một bảng trong chính cơ sở dữ liệu của họ) có nhật ký kiểm toán và phân quyền, và nói chuyện với nó qua một API chuẩn như OpenFeature. Cơ chế bên trong đúng như ở trên.</p>

<h3>3. Canary: 5% lưu lượng, đo riêng</h3>
${ma(NGINX_CANARY, 'nginx')}
${chiTiet('compose.yaml — hai phiên bản sau một nginx', ma(CANARY_COMPOSE, 'yaml'))}
${ra(CANARY)}
<p>Nhìn con số tổng trước: 33 lỗi trên 2.000 request là 1,65% — dưới một cảnh báo thường gặp kiểu "5xx trên 2%", nên không ai bị gọi dậy. Tách theo phiên bản thì bức tranh rõ ràng: canary hỏng một request trên ba, bản cũ không hỏng cái nào. Đó chính là ý nghĩa của canary: so nhóm mới với nhóm cũ <em>cùng lúc</em>, cùng lưu lượng, thay vì so hôm nay với hôm qua. Nó đòi ở bạn — người viết mã — đúng một điều: mọi response và mọi dòng log nói rõ phiên bản nào tạo ra nó (ở đây là header <code>x-ver</code>, nginx log thành <code>ver</code>). Rollback là một lần đổi cấu hình và <code>nginx -s reload</code>, lệnh này để các worker cũ làm xong request đang dở — sau đó 2.000 trên 2.000 request đi vào 2.3.1.</p>
<p>Để ý khác biệt với cờ: canary định tuyến theo <em>request</em>, nên một người dùng có thể trúng 2.4.0 lúc này và 2.3.1 ở cú bấm kế tiếp. Nếu điều đó quan trọng (giao diện mới, chuyển đổi dữ liệu), hãy định tuyến theo người dùng (sticky canary) hoặc dùng cờ.</p>

<h3>4. Cờ cũ là bom hẹn giờ: Knight Capital, 01/08/2012</h3>
<p>Knight Capital từng là một trong những công ty giao dịch cổ phiếu lớn nhất nước Mỹ. Theo lệnh xử phạt của SEC, Knight deploy mã mới cho chương trình thanh khoản bán lẻ (RLP) lên tám server định tuyến lệnh SMARS. Một kỹ thuật viên bỏ sót một server, và không ai kiểm lại. Mã mới <strong>tái dùng một cờ</strong> mà nhiều năm trước từng kích hoạt "Power Peg" — một chức năng cũ không ai dùng từ 2003 nhưng vẫn nằm trong mã, và phần theo dõi lệnh đã khớp của nó đã bị chuyển đi nơi khác từ 2005. Khi cờ được bật lúc thị trường mở cửa, bảy server chạy RLP; server thứ tám chạy Power Peg, cứ thế gửi lệnh con vì nó không bao giờ biết lệnh mẹ đã khớp xong. Trong 45 phút, Knight gửi hàng triệu lệnh và mất khoảng 460 triệu USD. Giữa sự cố, các kỹ sư rollback mã mới trên bảy server tốt — trong khi cờ vẫn bật, nên giờ cả tám đều chạy Power Peg. Đây là cơ chế đó ở quy mô đồ chơi, với tám tiến trình Node:</p>
${chiTiet('ban-cu/may.mjs, ban-moi/may.mjs, trien-khai.sh', ma(K_CU) + ma(K_MOI) + ma(K_TRIEN_KHAI, 'bash'))}
${ra(KNIGHT)}
<p>Từng bước của sự cố thật đều hiện ra: script deploy báo "xong" mà bỏ qua một máy; một máy sinh mười triệu lệnh con từ mười lệnh mẹ (lab của ta dừng ở một triệu mỗi lệnh mẹ; Knight không có trần như thế); một lệnh — <code>/health</code> trên mọi máy, đếm bằng <code>uniq -c</code> — cho thấy ngay <code>1 cu-2003</code>; lần "khôi phục" rollback mã mà không tắt cờ biến cả tám máy thành máy hỏng. Chỉ tắt cờ mới dừng được. Các bài học gỡ lỗi ở đây là bài học chung:</p>
<ul>
<li>Không bao giờ dùng lại tên cờ cho một nghĩa mới. Xoá cờ khi đã triển khai xong — một cờ không có chủ và không có ngày gỡ là bom hẹn giờ.</li>
<li>Xoá mã chết nằm sau cờ; "không ai gọi nó" không có nghĩa là "nó không thể chạy".</li>
<li>Mọi instance phải nói được nó đang chạy gì (<code>/health</code> có phiên bản và commit, bài 8.3), và bước deploy phải kiểm tất cả trước khi bật bất cứ thứ gì.</li>
<li>Trong sự cố, mỗi lần chỉ đổi một thứ và biết mỗi cần gạt gỡ được gì — bảng bên dưới.</li>
</ul>

<h3>5. Cần gạt nào, lúc nào</h3>
${BANG_VI}
<p>Quy tắc ngón tay cái khi trực: thứ hỏng nằm sau cờ thì gạt cờ; không thì rút bản mới khỏi vòng; rollback bản deploy khi không biết thay đổi nào có lỗi; chỉ sửa tiến tới khi bản sửa nhỏ, đã review và có test. Trường hợp nào cũng ghi giờ và hành động vào dòng thời gian của sự cố — bài 10.4.</p>

<h3>Đi làm thật</h3>
<p>Thời OJT bạn sẽ không vận hành canary, nhưng bạn sẽ viết mã nằm sau cờ. Vài thói quen giúp người khác dễ làm việc với bạn: mọi đường mã mới có rủi ro đều nằm sau một cờ mặc định "tắt"; log quyết định của cờ kèm request id; tạo ticket gỡ cờ ngay ngày tạo cờ; cho <code>/health</code> trả phiên bản và commit; và trong mô tả PR, viết một câu "tắt cái này bằng cách nào". Khi có gì hỏng ở phía khách hàng, câu hỏi đầu tiên của trưởng nhóm sẽ là "tắt được không?" — hãy là người đã biết sẵn câu trả lời.</p>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>chia-nhom.mjs</code>, rồi đổi đầu vào của hàm băm thành chỉ <code>user</code> (bỏ tên cờ). Vì sao giờ mọi cờ của bạn đều rơi vào cùng 5% người dùng? Vì sao điều đó tệ cho thử nghiệm?</li>
<li>Chạy <code>cong-tac.mjs</code>, rồi làm hỏng <code>flags.json</code> (xoá một dấu ngoặc nhọn) trong lúc nó chạy. <code>co.mjs</code> làm gì? Nó nên log gì?</li>
<li>Chạy <code>c103-canary.sh</code> với trọng số 9:1 và so tỉ lệ lỗi tổng với tỉ lệ theo phiên bản. Viết luật cảnh báo đáng lẽ đã bắt được 2.4.0.</li>
<li>Chạy <code>c103-knight.sh</code>. Sửa <code>trien-khai.sh</code> để bước deploy báo lỗi rõ ràng khi có máy nào sau đó không báo phiên bản mới.</li>
<li>Thêm một cờ (mặc định tắt) và một công tắc ngắt cho một tính năng trong dự án của bạn. Kiểm rằng tính năng biến mất trong vài giây khi tắt.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tắt được một tính năng hỏng trong chưa đầy một phút mà không deploy, và chứng minh được phiên bản nào đã phục vụ một request cụ thể.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Feature flag</span><span class="v">Công tắc lúc chạy quyết định một đường mã có được dùng không, cho ai.</span></div>
  <div class="kv"><span class="k">Công tắc ngắt</span><span class="v">Cờ chỉ có một việc là tắt nhanh; thắng mọi quy tắc khác.</span></div>
  <div class="kv"><span class="k">Chia nhóm ổn định</span><span class="v">Băm cờ + người dùng ⇒ cùng người luôn nhận cùng câu trả lời.</span></div>
  <div class="kv"><span class="k">Canary</span><span class="v">Một phần nhỏ lưu lượng chạy bản mới, so với bản cũ cùng lúc.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Quay về bản phát hành trước — gỡ mọi thay đổi của nó, không gỡ cờ hay cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k">Nợ cờ</span><span class="v">Cờ cũ và mã chết nằm sau nó; kiểu hỏng của Knight Capital.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cầm máu trước, bằng cần gạt nhỏ nhất còn hiệu quả: cờ, rồi lưu lượng, rồi rollback.</li>
<li>Cờ: chia nhóm bằng băm ổn định, công tắc ngắt thắng, mặc định an toàn khi kho cờ hỏng, quyết định được log.</li>
<li>Canary chỉ giúp được khi đo theo phiên bản; trung bình toàn cục giấu mất tỉ lệ hỏng 33%.</li>
<li>Không tái dùng cờ; gỡ cờ và mã chết; kiểm phiên bản của mọi instance trước khi bật.</li>
<li>Biết mỗi cần gạt gỡ được gì — rollback mã không rollback cờ hay dữ liệu.</li>
</ul>
${NGUON}
</div>
`,
};
