/**
 * Chương 13 · 13.4 — Cố tình làm hỏng rồi chẩn đoán (slug khung netdev-13-4-co-y-lam-hong). Capstone.
 * Output thật: lab/out/c134-*.out.txt (dựng lại: bash lab/code/dung-output-ch13.sh) — 504/502/refused.
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-13-4.mjs';

const L = card;

export default {
  title: '13.4 — Break it on purpose and diagnose|||13.4 — Cố tình làm hỏng rồi chẩn đoán',
  slug: 'netdev-13-4-co-y-lam-hong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Làm hỏng stack có chủ đích (lab an toàn) để nhận ra lỗi NGAY trên production. Gây ra thật: 504 (upstream chậm 3s vs timeout 1s), 502 (upstream chết), refused (cổng đóng). Chẩn đoán theo TẦNG bằng phương pháp Ch11 (nc -zv cổng, curl -I HTTP, openssl TLS). Lập luận các kiểu khác: DNS sai, trung gian cert thiếu (client cũ hỏng TLS), UDP 443 bị chặn (HTTP/3 lùi TCP), truy vấn chậm (ttfb leo → 504). Viết BÁO CÁO SỰ CỐ: triệu chứng → tầng → sửa → ngừa.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4 · Capstone</span>
<h2>Break it on purpose and diagnose</h2>
<p class="lead">You have built the stack, measured it, and made it faster. The last skill is reading it when it breaks — and the fastest way to learn that is to break it yourself, on purpose, where it is safe. Every failure you induce in the lab is one you will recognise in seconds in production, while an engineer who has never seen it guesses for an hour. This lesson breaks the capstone three ways for real, diagnoses each to a layer, reasons about a few more, and writes the incident report that turns the whole method into a story you can tell.</p>

<h3>Why break your own stack</h3>
<p>Induce a failure with a <strong>known cause</strong>, observe the <strong>symptom</strong>, diagnose it by <strong>layer</strong>, and confirm it matches what you injected. The confirmation is the point: it converts "I think a 504 means a slow backend" into "I have caused a 504 with a slow backend and read it back." That is the difference between theory and recognition.</p>

<h3>Induced failures on the stack</h3>
<p>Point the edge at a slow backend (timeout) and a dead one:</p>
${run('c134-break', 'echo "== break', 3)}
<p>A 3-second backend behind a 1-second edge timeout gives <code>504</code> (too slow); a dead upstream (a port nobody listens on) gives <code>502</code> (the edge connected to nothing). Same edge, two different backend problems, two codes — exactly as Chapter 10 taught. The status code names the failure <em>before</em> you open a log.</p>

<h3>Diagnose by layer</h3>
<p>Pin each failure with the layered checklist — here the port layer:</p>
${run('c134-break', 'echo "== diagnose', 2)}
<p><code>nc -zv</code> answers the <strong>port</strong> layer (8080 open, 8099 refused), <code>curl -I</code> the <strong>HTTP</strong> layer (the code), <code>openssl s_client</code> the <strong>TLS</strong> layer. The distinction matters: a <code>502</code> means "the port is open but the upstream behind it is broken," while a <code>refused</code> means "nothing is listening at all" — different layers, different fixes. You do not guess; you ask each layer and let the failing one name itself.</p>

<h3>More failure modes to reason about</h3>
${kv([
  ['Wrong DNS record', 'Connects to the wrong IP / NXDOMAIN → DNS layer; dig, fix the record.'],
  ['Missing intermediate cert', 'Old clients fail TLS → TLS layer; send the full chain.'],
  ['Blocked UDP 443', 'HTTP/3 fails, falls back to TCP → transport; allow UDP or accept h2.'],
  ['Slow DB query under load', 'TTFB climbs → 504 → app layer; fix the query / add capacity.'],
])}
<p>The lab runs the 502/504/refused live; the rest are described here. But every one reduces to the same move — a symptom, the single measurement that pins the layer, and the fix for <em>that</em> layer. That uniformity is the whole payoff of the layered method.</p>

<div class="pitfall co-tieu-de">
<p><strong>A failure you have never induced is one you will debug under pressure for the first time in production.</strong> The reason to break your own stack is not academic: an on-call page at 2 a.m. is the worst possible moment to <em>learn</em> what a 504 versus a 502 means, or to discover that your "the site is down" is actually a missing intermediate certificate affecting only a subset of clients. Deliberately inducing failures — <strong>chaos engineering</strong> in miniature — turns each failure from a scary unknown into a known shape you read in seconds. And there is a second deliverable hiding in it: every induced failure should make you ask <em>"would an alert, a health check, or a timeout have caught this automatically?"</em> If the answer is no, you have found a gap to close <em>before</em> it is an incident. The capstone's break-it step is not about causing damage; it is about guaranteeing that when the real thing happens, you detect it, diagnose it to a layer, and fix it fast — because you have already done it once.</p>
</div>

<h3>🧪 Practice — induce and report (25 minutes)</h3>
<div class="callout ok">
<p><strong>Deliverable:</strong> an incident report for one induced failure.</p>
<ol>
<li>Induce a <code>504</code> (slow upstream) and a <code>502</code> (dead upstream) on your stack; record the codes.</li>
<li>Diagnose each by layer: show the <code>nc -zv</code> / <code>curl -I</code> results that pin the layer.</li>
<li>Pick one failure and write an incident report: <strong>symptom → diagnosis (layer + measurement) → fix → prevention</strong>.</li>
<li>For your report's failure, name the alert/timeout/health-check that would catch it next time.</li>
</ol>
<p><strong>Done when:</strong> you have reproduced at least two failures with their codes, diagnosed each to the right layer with a measurement, and written one incident report ending in a concrete prevention (e.g. "add a TTFB alert; move the slow report to a background job").</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Induced failure', 'A failure you cause on purpose, with a known cause, to practise reading it.'],
  ['504 / 502 / refused', 'Slow upstream / broken-or-absent upstream / nothing listening.'],
  ['Diagnose by layer', 'Ask each layer (port/HTTP/TLS) and let the failing one name itself.'],
  ['Incident report', 'Symptom → diagnosis (layer + measurement) → fix → prevention.'],
  ['Chaos engineering', 'Deliberately breaking a system to build confidence in its recovery.'],
  ['Prevention', 'The alert/health-check/timeout that catches the failure next time.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><strong>Break your own stack</strong> in a safe lab so you recognise the failure instantly in production.</li>
<li>Induced live: <code>504</code> (slow upstream), <code>502</code> (dead upstream), <code>refused</code> (closed port).</li>
<li><strong>Diagnose by layer</strong>: <code>nc -zv</code> (port), <code>curl -I</code> (HTTP), <code>openssl</code> (TLS) — the code/measurement names it.</li>
<li>Reason about the rest: wrong DNS, a missing intermediate, blocked UDP 443, a slow query.</li>
<li>Write the <strong>incident report</strong> (symptom → layer → fix → prevention) — the hireable story.</li>
</ul>
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/', '📘', 'Cloudflare — 5xx errors', 'What each gateway code blames — the vocabulary of induced failures.', 'Open')}
${L('https://principlesofchaos.org/', '📘', 'Principles of Chaos Engineering', 'Why deliberately inducing failure builds resilient systems.', 'Open')}
${L('https://sre.google/sre-book/postmortem-culture/', '📘', 'Google SRE — Postmortem culture', 'How to write a blameless incident report that prevents recurrence.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4 · Capstone</span>
<h2>Cố tình làm hỏng rồi chẩn đoán</h2>
<p class="lead">Bạn đã dựng stack, đo nó, và làm nó nhanh hơn. Kỹ năng cuối là đọc nó khi nó hỏng — và cách nhanh nhất để học điều đó là tự làm hỏng nó, có chủ đích, ở nơi an toàn. Mỗi lỗi bạn gây trong lab là một cái bạn sẽ nhận ra trong giây trên production, trong khi một kỹ sư chưa từng thấy nó đoán một giờ. Bài này làm hỏng capstone ba cách thật, chẩn đoán mỗi cái tới một tầng, lập luận về vài cái nữa, và viết báo cáo sự cố biến cả phương pháp thành một câu chuyện bạn kể được.</p>

<h3>Vì sao làm hỏng stack của mình</h3>
<p>Gây một lỗi với một <strong>nguyên nhân đã biết</strong>, quan sát <strong>triệu chứng</strong>, chẩn đoán nó theo <strong>tầng</strong>, và xác nhận nó khớp cái bạn tiêm. Xác nhận là điểm: nó chuyển "tôi nghĩ một 504 nghĩa là một backend chậm" thành "tôi đã gây một 504 với một backend chậm và đọc lại nó." Đó là khác biệt giữa lý thuyết và nhận ra.</p>

<h3>Lỗi gây ra trên stack</h3>
<p>Trỏ biên vào một backend chậm (timeout) và một cái chết:</p>
${run('c134-break', 'echo "== break', 3)}
<p>Một backend 3 giây sau một edge timeout 1 giây cho <code>504</code> (quá chậm); một upstream chết (một cổng không ai nghe) cho <code>502</code> (biên nối tới không gì). Cùng biên, hai bài toán backend khác nhau, hai mã — đúng như Chương 10 dạy. Mã trạng thái gọi tên lỗi <em>trước</em> khi bạn mở một log.</p>

<h3>Chẩn đoán theo tầng</h3>
<p>Ghim mỗi lỗi với bảng kiểm theo tầng — ở đây tầng cổng:</p>
${run('c134-break', 'echo "== diagnose', 2)}
<p><code>nc -zv</code> trả lời tầng <strong>cổng</strong> (8080 mở, 8099 refused), <code>curl -I</code> tầng <strong>HTTP</strong> (mã), <code>openssl s_client</code> tầng <strong>TLS</strong>. Sự phân biệt quan trọng: một <code>502</code> nghĩa là "cổng mở nhưng upstream sau nó hỏng," còn một <code>refused</code> nghĩa là "không gì đang nghe cả" — các tầng khác nhau, cách sửa khác nhau. Bạn không đoán; bạn hỏi mỗi tầng và để cái hỏng tự gọi tên.</p>

<h3>Các kiểu lỗi khác để lập luận</h3>
${kv([
  ['Bản ghi DNS sai', 'Nối tới IP sai / NXDOMAIN → tầng DNS; dig, sửa bản ghi.'],
  ['Cert trung gian thiếu', 'Client cũ hỏng TLS → tầng TLS; gửi trọn chuỗi.'],
  ['UDP 443 bị chặn', 'HTTP/3 hỏng, lùi về TCP → giao vận; cho phép UDP hay chấp nhận h2.'],
  ['Truy vấn DB chậm dưới tải', 'TTFB leo → 504 → tầng app; sửa truy vấn / thêm dung lượng.'],
])}
<p>Lab chạy 502/504/refused trực tiếp; phần còn lại được mô tả ở đây. Nhưng mỗi cái quy về cùng nước — một triệu chứng, một phép đo ghim tầng, và cách sửa cho <em>tầng đó</em>. Sự đồng nhất đó là toàn bộ cái lợi của phương pháp theo tầng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một lỗi bạn chưa bao giờ gây là một cái bạn sẽ gỡ dưới áp lực lần đầu trên production.</strong> Lý do làm hỏng stack của mình không hàn lâm: một cuộc gọi trực 2 giờ sáng là thời điểm tệ nhất có thể để <em>học</em> một 504 so với một 502 nghĩa gì, hay phát hiện rằng "site sập" của bạn thật ra là một cert trung gian thiếu chỉ ảnh hưởng một tập con client. Cố ý gây lỗi — <strong>chaos engineering</strong> thu nhỏ — biến mỗi lỗi từ một cái vô danh đáng sợ thành một dáng đã biết bạn đọc trong giây. Và có một deliverable thứ hai ẩn trong nó: mỗi lỗi gây ra nên làm bạn hỏi <em>"một cảnh báo, một kiểm sức khoẻ, hay một timeout có bắt được cái này tự động không?"</em> Nếu câu trả lời là không, bạn đã tìm thấy một lỗ hổng để bịt <em>trước</em> khi nó là một sự cố. Bước làm-hỏng của capstone không về gây thiệt hại; nó về bảo đảm rằng khi thứ thật xảy ra, bạn phát hiện nó, chẩn đoán nó tới một tầng, và sửa nhanh — vì bạn đã làm nó một lần.</p>
</div>

<h3>🧪 Thực hành — gây ra và báo cáo (25 phút)</h3>
<div class="callout ok">
<p><strong>Deliverable:</strong> một báo cáo sự cố cho một lỗi gây ra.</p>
<ol>
<li>Gây một <code>504</code> (upstream chậm) và một <code>502</code> (upstream chết) trên stack của bạn; ghi các mã.</li>
<li>Chẩn đoán mỗi cái theo tầng: cho thấy kết quả <code>nc -zv</code> / <code>curl -I</code> ghim tầng.</li>
<li>Chọn một lỗi và viết một báo cáo sự cố: <strong>triệu chứng → chẩn đoán (tầng + phép đo) → sửa → ngừa</strong>.</li>
<li>Cho lỗi của báo cáo, kể cảnh báo/timeout/kiểm-sức-khoẻ bắt nó lần sau.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tái hiện ít nhất hai lỗi với mã của chúng, chẩn đoán mỗi cái tới tầng đúng với một phép đo, và viết một báo cáo sự cố kết thúc bằng một ngừa cụ thể (vd "thêm một cảnh báo TTFB; chuyển báo cáo chậm sang một việc nền").</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Lỗi gây ra', 'Một lỗi bạn gây có chủ đích, với nguyên nhân đã biết, để luyện đọc nó.'],
  ['504 / 502 / refused', 'Upstream chậm / upstream hỏng-hay-vắng / không gì đang nghe.'],
  ['Chẩn đoán theo tầng', 'Hỏi mỗi tầng (cổng/HTTP/TLS) và để cái hỏng tự gọi tên.'],
  ['Báo cáo sự cố', 'Triệu chứng → chẩn đoán (tầng + phép đo) → sửa → ngừa.'],
  ['Chaos engineering', 'Cố ý làm hỏng một hệ thống để xây tự tin vào khôi phục của nó.'],
  ['Ngừa (prevention)', 'Cảnh báo/kiểm-sức-khoẻ/timeout bắt lỗi lần sau.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><strong>Làm hỏng stack của mình</strong> trong một lab an toàn để bạn nhận ra lỗi ngay trên production.</li>
<li>Gây ra trực tiếp: <code>504</code> (upstream chậm), <code>502</code> (upstream chết), <code>refused</code> (cổng đóng).</li>
<li><strong>Chẩn đoán theo tầng</strong>: <code>nc -zv</code> (cổng), <code>curl -I</code> (HTTP), <code>openssl</code> (TLS) — mã/phép đo gọi tên nó.</li>
<li>Lập luận về phần còn lại: DNS sai, một trung gian thiếu, UDP 443 bị chặn, một truy vấn chậm.</li>
<li>Viết <strong>báo cáo sự cố</strong> (triệu chứng → tầng → sửa → ngừa) — câu chuyện tuyển-được.</li>
</ul>
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/', '📘', 'Cloudflare — Lỗi 5xx', 'Mỗi mã cổng đổ lỗi gì — từ vựng của các lỗi gây ra.', 'Mở')}
${L('https://principlesofchaos.org/', '📘', 'Principles of Chaos Engineering', 'Vì sao cố ý gây lỗi xây hệ thống bền.', 'Mở')}
${L('https://sre.google/sre-book/postmortem-culture/', '📘', 'Google SRE — Văn hoá postmortem', 'Cách viết một báo cáo sự cố không-đổ-lỗi ngừa tái diễn.', 'Mở')}
</div>
`,
};
