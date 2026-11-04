/**
 * Chương 11 · 11.3 — Đo đường đi: mtr, ping, iperf3 và curl -w (slug khung netdev-11-3-do-duong).
 * Output thật: lab/out/c113-*.out.txt (dựng lại: bash lab/code/dung-output-ch11.sh) — netem 20ms ở router.
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-11-3.mjs';

const L = card;
const LNX = { mon: 'Linux & Bash', khoa: 'linux-bash' };

export default {
  title: '11.3 — Measuring the path: mtr, ping, iperf3 and curl -w|||11.3 — Đo đường đi: mtr, ping, iperf3 và curl -w',
  slug: 'netdev-11-3-do-duong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khi một thứ chậm, câu hỏi là Ở ĐÂU. curl -w tách một yêu cầu thành DNS/connect/TTFB/total (chặng nhảy = tầng cần sửa); ping cho RTT + mất gói; mtr cho độ trễ/mất gói MỖI HOP (hop nào có lỗi); iperf3 đo băng thông thô. Băng thông ≠ độ trễ: phần lớn "chậm" là độ trễ × vòng khứ hồi, không phải ống nhỏ — nên keep-alive/HTTP2/CDN giúp nhiều hơn link lớn. Giữ một khuôn curl -w, chạy từ vài mạng. Đo thật (netem 20ms).',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Measuring the path: mtr, ping, iperf3 and curl -w</h2>
<p class="lead">"It's slow" is not a diagnosis — it's the start of one. The next question is always <em>where</em>: in DNS, in the connect, in the server, or on the wire between here and there. Four small tools answer it from four angles, and none of them needs a packet capture. This lesson runs all four on the lab (with 20 ms of real delay injected at the router) so you can see exactly which number moves when a path gets slow.</p>

<h3>curl -w: where the time goes in one request</h3>
<p>The fastest way to localise slowness is to split a single request into its stages:</p>
${run('c113-path', 'curl', 1)}
<p><code>time_namelookup</code> is DNS, <code>time_connect</code> is the TCP handshake, <code>time_starttransfer</code> is <strong>TTFB</strong> (the server's thinking time to the first byte), and <code>time_total</code> is the whole thing. The stage that jumps names the layer: a big <code>time_namelookup</code> is DNS; a big <code>time_connect</code> is the network or TLS; a big gap from connect to <code>starttransfer</code> is the <strong>server</strong> being slow.</p>
${cauNoi('en', { ...LNX, bai: 'lnx-9-2-curl', so: '9.2', ten: 'curl: the flags that matter', giong: 'using curl to probe a server from the command line', khac: 'the Linux & Bash course drills the everyday curl flags (-v, -I, -L, -d, -o)', them: 'the -w timing template that splits a request into DNS/connect/TTFB/total, alongside ping, mtr and iperf3 for the path' })}

<h3>ping: round-trip time and loss</h3>
<p><code>ping</code> is the simplest reachability-and-latency check — ICMP echoes with the round-trip time and packet loss:</p>
${run('c113-path', 'ping', 1)}
<p>The router adds 20 ms, so the RTT is ~20–40 ms at <strong>0% loss</strong>. Rising RTT points at congestion or distance; any non-zero loss is a real problem on the path. It answers "can I reach it, and how far away is it?" in one line.</p>

<h3>mtr: which hop is the problem</h3>
<p><code>ping</code> tells you <em>that</em> the path is bad; <code>mtr</code> (traceroute + ping) tells you <em>where</em>:</p>
${run('c113-path', 'mtr', 1, { cut: 96 })}
<p>It pings every hop and shows latency and loss per hop. Here hop 1 (the router) is ~0.3 ms and hop 2 (the api, behind the 20 ms delay) is ~25 ms, 0% loss. Reading it: loss that <strong>starts at a hop and continues</strong> downstream is a real problem there; loss at a single hop that <strong>does not propagate</strong> is just that router de-prioritising ICMP replies, not a user-facing issue.</p>

<h3>iperf3: raw bandwidth</h3>
<p>When a <em>large transfer</em> is slow but latency is fine, measure the actual bandwidth with <code>iperf3</code> (<code>-s</code> on one side, <code>-c</code> on the other):</p>
${run('c113-path', 'iperf3', 1)}
<p>~100 Mbit/s here. <code>iperf3</code> answers "is the pipe big enough?" and nothing else — crucially, it does <strong>not</strong> measure latency.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bandwidth is not latency — and most "slow site" problems are latency, not a small pipe.</strong> It is tempting to fix slowness by buying a bigger link, but bandwidth (how much per second) and latency (how long one trip takes) are different axes. A page that makes many sequential round trips — DNS, TCP, TLS, then request after request — is bounded by <strong>latency × number of round trips</strong>, and a fatter pipe does nothing for it. This is exactly why the wins in this course are about <em>fewer and closer</em> round trips: keep-alive (skip handshakes), HTTP/2 multiplexing (one connection), and CDNs (a nearby edge) all cut round-trip count or distance. Measure both — <code>iperf3</code> for bandwidth, <code>ping</code>/<code>curl -w</code> for latency — before you "upgrade the network," because the network is usually not the problem.</p>
</div>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a page is slow from one office. Localise it without guessing.</p>
<ol>
<li>On the lab, run the <code>curl -w</code> template to the web server and read which stage dominates.</li>
<li><code>ping</code> the api and note the RTT and loss; run <code>mtr</code> and say which hop owns the latency.</li>
<li>Run <code>iperf3</code> client→api for the bandwidth. Say which of your measurements is latency and which is bandwidth.</li>
<li>Explain why a bigger link would not help a page that makes 30 sequential round trips at 100 ms each.</li>
</ol>
<p><strong>Done when:</strong> you can point to the dominant <code>curl -w</code> stage, read RTT/loss from <code>ping</code>, name the slow hop from <code>mtr</code>, give a bandwidth from <code>iperf3</code>, and explain that 30 × 100 ms = 3 s is a latency/round-trip problem that bandwidth cannot fix (fewer/closer round trips can).</p>
<details><summary>Solution</summary>
<p><code>curl -w</code> shows DNS/connect/TTFB/total; the stage that jumps is the layer. <code>ping</code> gives RTT (~20–40 ms with the lab delay) and loss (0%); <code>mtr</code> shows hop 2 (api) owns the added latency. <code>iperf3</code> gives ~100 Mbit/s — that's bandwidth; <code>ping</code>/<code>curl -w</code> are latency. 30 sequential round trips at 100 ms is 3 s regardless of bandwidth, so the fix is fewer/closer round trips (keep-alive, HTTP/2, CDN), not a bigger pipe.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['curl -w', 'Print timing fields: time_namelookup, time_connect, time_starttransfer, time_total.'],
  ['TTFB', 'Time to first byte — the server’s thinking time (time_starttransfer).'],
  ['ping / RTT', 'Round-trip time and packet loss via ICMP echoes.'],
  ['mtr', 'traceroute + ping: per-hop latency and loss.'],
  ['iperf3', 'Measure raw bandwidth between two endpoints (-s / -c).'],
  ['Bandwidth vs latency', 'How much per second vs how long one trip takes — different axes.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><strong>curl -w</strong> splits a request into DNS / connect / TTFB / total — the stage that jumps is the layer to fix.</li>
<li><strong>ping</strong> gives round-trip latency and packet loss; <strong>mtr</strong> shows <strong>which hop</strong> loses or delays.</li>
<li><strong>iperf3</strong> measures raw bandwidth between two points (run <code>-s</code> one side, <code>-c</code> the other).</li>
<li><strong>Bandwidth ≠ latency</strong>: most "slow" is latency × round trips, not a small pipe.</li>
<li>Keep a <strong>curl -w template</strong> and run it from several networks — a slow stage names the layer.</li>
</ul>
${L('https://everything.curl.dev/usingcurl/verbose/writeout.html', '📘', 'curl — the --write-out variables', 'Every time_* field you can print, with examples.', 'Open')}
${L('https://www.bitwizard.nl/mtr/', '📘', 'mtr — my traceroute', 'How per-hop loss and latency are measured and read.', 'Open')}
${L('https://iperf.fr/iperf-doc.php', '📄', 'iperf3 — documentation', 'Measuring TCP/UDP bandwidth between two hosts.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Đo đường đi: mtr, ping, iperf3 và curl -w</h2>
<p class="lead">"Nó chậm" không phải một chẩn đoán — nó là khởi đầu của một chẩn đoán. Câu hỏi kế luôn là <em>ở đâu</em>: trong DNS, trong connect, trong máy chủ, hay trên dây giữa đây và đó. Bốn công cụ nhỏ trả lời từ bốn góc, và không cái nào cần một bản bắt gói. Bài này chạy cả bốn trên lab (với 20 ms trễ thật tiêm ở router) để bạn thấy chính xác con số nào nhích khi một đường chậm đi.</p>

<h3>curl -w: thời gian đi đâu trong một yêu cầu</h3>
<p>Cách nhanh nhất để khoanh vùng chậm là tách một yêu cầu đơn thành các chặng của nó:</p>
${run('c113-path', 'curl', 1)}
<p><code>time_namelookup</code> là DNS, <code>time_connect</code> là cú bắt tay TCP, <code>time_starttransfer</code> là <strong>TTFB</strong> (thời gian máy chủ nghĩ tới byte đầu), và <code>time_total</code> là cả. Chặng nào nhảy gọi tên tầng: một <code>time_namelookup</code> lớn là DNS; một <code>time_connect</code> lớn là mạng hay TLS; một khoảng trống lớn từ connect tới <code>starttransfer</code> là <strong>máy chủ</strong> chậm.</p>
${cauNoi('vi', { ...LNX, bai: 'lnx-9-2-curl', so: '9.2', ten: 'curl: những cờ thật sự quan trọng', giong: 'dùng curl để dò một máy chủ từ dòng lệnh', khac: 'khoá Linux & Bash luyện các cờ curl hằng ngày (-v, -I, -L, -d, -o)', them: 'khuôn thời gian -w tách một yêu cầu thành DNS/connect/TTFB/total, cùng ping, mtr và iperf3 cho đường đi' })}

<h3>ping: thời gian khứ hồi và mất gói</h3>
<p><code>ping</code> là phép kiểm với-tới-và-độ-trễ đơn giản nhất — các echo ICMP với thời gian khứ hồi và mất gói:</p>
${run('c113-path', 'ping', 1)}
<p>Router thêm 20 ms, nên RTT là ~20–40 ms ở <strong>0% mất</strong>. RTT tăng chỉ vào tắc nghẽn hay khoảng cách; bất kỳ mất khác không nào là một vấn đề thật trên đường. Nó trả lời "tôi với tới được không, và nó xa bao nhiêu?" trong một dòng.</p>

<h3>mtr: hop nào là vấn đề</h3>
<p><code>ping</code> cho bạn biết <em>rằng</em> đường tồi; <code>mtr</code> (traceroute + ping) cho bạn biết <em>ở đâu</em>:</p>
${run('c113-path', 'mtr', 1, { cut: 96 })}
<p>Nó ping mỗi hop và cho thấy độ trễ và mất gói mỗi hop. Ở đây hop 1 (router) là ~0,3 ms và hop 2 (api, sau trễ 20 ms) là ~25 ms, 0% mất. Đọc nó: mất <strong>bắt đầu ở một hop và tiếp tục</strong> phía dưới là một vấn đề thật ở đó; mất ở một hop đơn mà <strong>không lan</strong> là chỉ router đó hạ ưu tiên các trả lời ICMP, không phải một vấn đề người dùng thấy.</p>

<h3>iperf3: băng thông thô</h3>
<p>Khi một <em>cuộc truyền lớn</em> chậm nhưng độ trễ ổn, đo băng thông thật với <code>iperf3</code> (<code>-s</code> một bên, <code>-c</code> bên kia):</p>
${run('c113-path', 'iperf3', 1)}
<p>~100 Mbit/s ở đây. <code>iperf3</code> trả lời "ống có đủ lớn không?" và không gì khác — quan trọng, nó <strong>không</strong> đo độ trễ.</p>

<div class="pitfall co-tieu-de">
<p><strong>Băng thông không phải độ trễ — và phần lớn vấn đề "site chậm" là độ trễ, không phải một ống nhỏ.</strong> Thật dễ bị cám dỗ sửa chậm bằng cách mua một link lớn hơn, nhưng băng thông (bao nhiêu mỗi giây) và độ trễ (một chuyến mất bao lâu) là các trục khác nhau. Một trang làm nhiều vòng khứ hồi tuần tự — DNS, TCP, TLS, rồi yêu cầu này sau yêu cầu kia — bị chặn bởi <strong>độ trễ × số vòng khứ hồi</strong>, và một ống béo hơn chẳng làm gì cho nó. Đây đúng là lý do các thắng lợi trong khoá này về <em>ít và gần</em> vòng khứ hồi hơn: keep-alive (bỏ bắt tay), ghép kênh HTTP/2 (một kết nối), và CDN (một biên gần) đều cắt số vòng khứ hồi hay khoảng cách. Đo cả hai — <code>iperf3</code> cho băng thông, <code>ping</code>/<code>curl -w</code> cho độ trễ — trước khi bạn "nâng cấp mạng", vì mạng thường không phải vấn đề.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một trang chậm từ một văn phòng. Khoanh vùng mà không đoán.</p>
<ol>
<li>Trên lab, chạy khuôn <code>curl -w</code> tới máy chủ web và đọc chặng nào chiếm ưu thế.</li>
<li><code>ping</code> api và ghi RTT và mất; chạy <code>mtr</code> và nói hop nào sở hữu độ trễ.</li>
<li>Chạy <code>iperf3</code> client→api cho băng thông. Nói đo nào của bạn là độ trễ và đo nào là băng thông.</li>
<li>Giải thích vì sao một link lớn hơn sẽ không giúp một trang làm 30 vòng khứ hồi tuần tự mỗi cái 100 ms.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ được chặng <code>curl -w</code> trội, đọc RTT/mất từ <code>ping</code>, gọi tên hop chậm từ <code>mtr</code>, cho một băng thông từ <code>iperf3</code>, và giải thích rằng 30 × 100 ms = 3 giây là một vấn đề độ-trễ/vòng-khứ-hồi mà băng thông không sửa được (ít/gần vòng khứ hồi hơn thì được).</p>
<details><summary>Lời giải</summary>
<p><code>curl -w</code> cho thấy DNS/connect/TTFB/total; chặng nào nhảy là tầng. <code>ping</code> cho RTT (~20–40 ms với trễ lab) và mất (0%); <code>mtr</code> cho thấy hop 2 (api) sở hữu độ trễ thêm. <code>iperf3</code> cho ~100 Mbit/s — đó là băng thông; <code>ping</code>/<code>curl -w</code> là độ trễ. 30 vòng khứ hồi tuần tự ở 100 ms là 3 giây bất kể băng thông, nên cách sửa là ít/gần vòng khứ hồi hơn (keep-alive, HTTP/2, CDN), không phải một ống lớn hơn.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['curl -w', 'In các trường thời gian: time_namelookup, time_connect, time_starttransfer, time_total.'],
  ['TTFB', 'Time to first byte — thời gian máy chủ nghĩ (time_starttransfer).'],
  ['ping / RTT', 'Thời gian khứ hồi và mất gói qua các echo ICMP.'],
  ['mtr', 'traceroute + ping: độ trễ và mất gói mỗi hop.'],
  ['iperf3', 'Đo băng thông thô giữa hai điểm cuối (-s / -c).'],
  ['Băng thông vs độ trễ', 'Bao nhiêu mỗi giây vs một chuyến mất bao lâu — các trục khác nhau.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><strong>curl -w</strong> tách một yêu cầu thành DNS / connect / TTFB / total — chặng nào nhảy là tầng cần sửa.</li>
<li><strong>ping</strong> cho độ trễ khứ hồi và mất gói; <strong>mtr</strong> cho thấy <strong>hop nào</strong> mất hay trễ.</li>
<li><strong>iperf3</strong> đo băng thông thô giữa hai điểm (chạy <code>-s</code> một bên, <code>-c</code> bên kia).</li>
<li><strong>Băng thông ≠ độ trễ</strong>: phần lớn "chậm" là độ trễ × vòng khứ hồi, không phải một ống nhỏ.</li>
<li>Giữ một <strong>khuôn curl -w</strong> và chạy nó từ vài mạng — một chặng chậm gọi tên tầng.</li>
</ul>
${L('https://everything.curl.dev/usingcurl/verbose/writeout.html', '📘', 'curl — các biến --write-out', 'Mọi trường time_* bạn in được, kèm ví dụ.', 'Mở')}
${L('https://www.bitwizard.nl/mtr/', '📘', 'mtr — my traceroute', 'Mất gói và độ trễ mỗi hop được đo và đọc thế nào.', 'Mở')}
${L('https://iperf.fr/iperf-doc.php', '📄', 'iperf3 — tài liệu', 'Đo băng thông TCP/UDP giữa hai host.', 'Mở')}
</div>
`,
};
