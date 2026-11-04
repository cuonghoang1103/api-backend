/**
 * Chương 13 · 13.2 — Đo mọi chặng (slug khung netdev-13-2-do-duong-di). Capstone.
 * Output thật: lab/out/c132-*.out.txt (dựng lại: bash lab/code/dung-output-ch13.sh) — netem 20ms ở router.
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-13-2.mjs';

const L = card;

export default {
  title: '13.2 — Measure every hop|||13.2 — Đo mọi chặng',
  slug: 'netdev-13-2-do-duong-di',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc nền trước khi tinh chỉnh: curl -w tách một yêu cầu qua cả stack thành dns/connect/ttfb/total + size (đo thật, netem 20ms). Đọc từng chặng theo stack (connect→ttfb = phía máy chủ; total−ttfb = tải thân — hai khoảng trống sẽ tối ưu). Bắt ở BIÊN (tcpdump/tshark, Ch11) để thấy gói làm gì. Ghi BẢNG MỐC NỀN. Đo từ vài mạng để tách vấn đề đường khỏi vấn đề máy chủ. "Không cải thiện được cái không đo."',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2 · Capstone</span>
<h2>Measure every hop</h2>
<p class="lead">Every optimisation in this capstone will be judged by a before/after, and a before/after is only as good as the "before." So this lesson does the unglamorous, essential first step of all performance work: record a <strong>baseline</strong> — a written measurement of the current request path, hop by hop, taken <em>before</em> you touch anything. With the baseline in hand, the next lesson's tuning becomes a measured delta instead of a hopeful "it feels faster."</p>

<h3>You cannot improve what you did not measure</h3>
<p>The discipline is simple and non-negotiable: measure the current state end to end, write the numbers down, and only then change something. Without a baseline, "I enabled gzip and it's faster" is a claim nobody can check — including you. The baseline is what turns a change into a <strong>result</strong>.</p>

<h3>curl -w across the whole stack</h3>
<p>One request to the edge, split into its stages (with 20 ms injected on the path so the numbers are meaningful):</p>
${run('c132-measure', 'curl', 1)}
<p><code>dns</code> is name resolution (≈0 when cached), <code>connect</code> is the TCP handshake to the edge, <code>ttfb</code> is <strong>time to first byte</strong> (the edge + proxy + API work), and <code>total</code> is the whole request; <code>size</code> is the downloaded bytes. This single line is your per-hop stopwatch — run it a few times and take the median.</p>

<h3>Reading the stages against your stack</h3>
${kv([
  ['dns', 'Name resolution (cached ≈ 0). Big → DNS/resolver (rare once warm).'],
  ['connect', 'TCP handshake to the edge. Big → network latency / distance.'],
  ['ttfb', 'The edge + proxy + API producing the first byte. Big → tune the edge/API.'],
  ['total − ttfb', 'Body download. Big → response size / bandwidth (compress!).'],
])}
<p>Two gaps matter most: <strong>connect → ttfb</strong> is the <em>server side</em> (edge + API), and <strong>total − ttfb</strong> is the <em>download</em>. Those are exactly the two things the next lesson tunes — the server work with caching/keep-alive, and the download with compression.</p>

<h3>Capture at the edge for the detail</h3>
<p>Timing says <em>where</em> the latency is; a <strong>capture</strong> says <em>what</em> the packets did there. Run <code>tcpdump</code> at the edge during a slow request (Chapter 11) and read it with Wireshark/tshark: a single gap right before the response is the <strong>server thinking</strong>, while scattered retransmissions are <strong>network loss</strong>. Capturing at the edge shows both legs — client↔edge and edge↔API — so you can attribute the delay to the correct one.</p>

<div class="pitfall co-tieu-de">
<p><strong>One measurement from one machine can send you tuning the wrong thing.</strong> A baseline taken only from your laptop on office Wi-Fi can look slow (or fast) for reasons that have nothing to do with the server — your local network, a congested hop, a far CDN edge. If you "optimise the server" based on that single number, you may be fixing a problem that is really on the <em>path</em>, and your before/after will be noise. Take the baseline from <strong>more than one network</strong> — home, office, a cloud box in another region. A slowdown that appears in <em>one</em> region only is a <strong>path</strong> problem (routing, peering, a distant edge) that no server tuning will fix; a slowdown that appears <em>everywhere</em> is the <strong>origin</strong> (the edge or API), which is what you can actually tune. Localise before you optimise, or you will measure a real improvement to the wrong layer.</p>
</div>

<h3>🧪 Practice — record your baseline (20 minutes)</h3>
<div class="callout ok">
<p><strong>Deliverable:</strong> the baseline table for your capstone stack.</p>
<ol>
<li>Bring up the stack (<code>bash lab/code/dung-output-ch13.sh</code>) and run the <code>curl -w</code> breakdown to the edge a few times; record the median <code>dns/connect/ttfb/total</code>.</li>
<li>Record the response <strong>size</strong>, with and without <code>--compressed</code>.</li>
<li>Note which gap is the server side (<code>connect→ttfb</code>) and which is the download (<code>total−ttfb</code>).</li>
<li>Capture one request at the edge with <code>tcpdump</code> and confirm the handshake and the GET/200 are there.</li>
</ol>
<p><strong>Done when:</strong> you have a written baseline (dns/connect/ttfb/total + size + status), you can point to the server-side gap and the download gap, and you have a capture confirming the request path — this is the "before" the next lesson improves on.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Baseline', 'A recorded measurement taken before any change — the reference.'],
  ['curl -w', 'Per-stage timing: time_namelookup/connect/starttransfer/total + size_download.'],
  ['TTFB', 'Time to first byte — the server-side work (edge + proxy + API).'],
  ['connect→ttfb gap', 'The server side of the request — tune with cache/keep-alive.'],
  ['total−ttfb gap', 'The body download — tune with compression.'],
  ['Vantage point', 'Where you measure from; use several to separate path from server.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A <strong>baseline</strong> is a recorded measurement taken <strong>before</strong> any change — the reference the tuning is judged against.</li>
<li><code>curl -w</code> splits the request into <strong>dns / connect / ttfb / total</strong> + size — your per-hop stopwatch.</li>
<li><strong>connect→ttfb</strong> is the server side; <strong>total−ttfb</strong> is the download — the two gaps you'll tune.</li>
<li>Capture at the <strong>edge</strong> to see <em>what</em> the packets did where the timing says the latency is.</li>
<li>Measure from <strong>several networks</strong> to separate a path problem from a server problem.</li>
</ul>
${L('https://everything.curl.dev/usingcurl/verbose/writeout.html', '📘', 'curl — --write-out timings', 'Every time_* field and size_download for a per-hop baseline.', 'Open')}
${L('https://web.dev/articles/optimize-ttfb', '📘', 'web.dev — Optimize TTFB', 'What makes up TTFB and how to measure it before tuning.', 'Open')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', '📘', 'Wireshark — Follow streams', 'Reading the capture at the edge: gap vs retransmission.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2 · Capstone</span>
<h2>Đo mọi chặng</h2>
<p class="lead">Mọi tối ưu trong capstone này sẽ được chấm bằng một trước/sau, và một trước/sau chỉ tốt bằng cái "trước." Nên bài này làm bước đầu không hào nhoáng nhưng thiết yếu của mọi việc hiệu năng: ghi một <strong>mốc nền</strong> — một phép đo viết xuống của đường request hiện tại, từng chặng, lấy <em>trước</em> khi bạn chạm bất cứ gì. Có mốc nền trong tay, tinh chỉnh ở bài sau thành một độ chênh đo được thay vì một "cảm thấy nhanh hơn" đầy hy vọng.</p>

<h3>Không cải thiện được cái không đo</h3>
<p>Kỷ luật đơn giản và không thương lượng: đo trạng thái hiện tại đầu-cuối, viết con số xuống, và chỉ khi đó đổi một thứ. Không có mốc nền, "tôi bật gzip và nó nhanh hơn" là một khẳng định không ai kiểm được — kể cả bạn. Mốc nền là cái biến một thay đổi thành một <strong>kết quả</strong>.</p>

<h3>curl -w qua cả stack</h3>
<p>Một yêu cầu tới biên, tách thành các chặng (với 20 ms tiêm trên đường để con số có nghĩa):</p>
${run('c132-measure', 'curl', 1)}
<p><code>dns</code> là phân giải tên (≈0 khi cache), <code>connect</code> là cú bắt tay TCP tới biên, <code>ttfb</code> là <strong>time to first byte</strong> (việc biên + proxy + API), và <code>total</code> là cả yêu cầu; <code>size</code> là byte đã tải. Một dòng này là đồng hồ bấm giờ từng chặng của bạn — chạy vài lần và lấy trung vị.</p>

<h3>Đọc từng chặng theo stack</h3>
${kv([
  ['dns', 'Phân giải tên (cache ≈ 0). Lớn → DNS/resolver (hiếm khi ấm).'],
  ['connect', 'Cú bắt tay TCP tới biên. Lớn → độ trễ mạng / khoảng cách.'],
  ['ttfb', 'Biên + proxy + API tạo byte đầu. Lớn → tinh chỉnh biên/API.'],
  ['total − ttfb', 'Tải thân. Lớn → kích thước câu trả lời / băng thông (nén!).'],
])}
<p>Hai khoảng trống quan trọng nhất: <strong>connect → ttfb</strong> là <em>phía máy chủ</em> (biên + API), và <strong>total − ttfb</strong> là <em>tải</em>. Đó đúng là hai thứ bài sau tinh chỉnh — việc máy chủ với cache/keep-alive, và tải với nén.</p>

<h3>Bắt ở biên để chi tiết</h3>
<p>Thời gian nói <em>ở đâu</em> độ trễ nằm; một <strong>bản bắt</strong> nói <em>cái gì</em> các gói làm ở đó. Chạy <code>tcpdump</code> ở biên trong một yêu cầu chậm (Chương 11) và đọc nó với Wireshark/tshark: một khoảng trống đơn ngay trước câu trả lời là <strong>máy chủ đang nghĩ</strong>, còn truyền lại rải rác là <strong>mất gói mạng</strong>. Bắt ở biên cho thấy cả hai chặng — client↔biên và biên↔API — nên bạn gán độ trễ cho cái đúng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một phép đo từ một máy có thể làm bạn tinh chỉnh nhầm thứ.</strong> Một mốc nền lấy chỉ từ laptop của bạn trên Wi-Fi văn phòng có thể trông chậm (hay nhanh) vì những lý do chẳng liên quan máy chủ — mạng cục bộ của bạn, một hop tắc nghẽn, một biên CDN xa. Nếu bạn "tối ưu máy chủ" dựa trên con số đơn đó, bạn có thể đang sửa một vấn đề thật ra ở <em>đường</em>, và trước/sau của bạn sẽ là nhiễu. Lấy mốc nền từ <strong>hơn một mạng</strong> — nhà, văn phòng, một máy đám mây ở vùng khác. Một chậm chỉ xuất hiện ở <em>một</em> vùng là một vấn đề <strong>đường</strong> (định tuyến, peering, một biên xa) không tinh chỉnh máy chủ nào sửa; một chậm xuất hiện <em>mọi nơi</em> là <strong>gốc</strong> (biên hay API), cái bạn thật sự tinh chỉnh được. Định vị trước khi tối ưu, không thì bạn đo một cải thiện thật tới nhầm tầng.</p>
</div>

<h3>🧪 Thực hành — ghi mốc nền (20 phút)</h3>
<div class="callout ok">
<p><strong>Deliverable:</strong> bảng mốc nền cho stack capstone của bạn.</p>
<ol>
<li>Dựng stack (<code>bash lab/code/dung-output-ch13.sh</code>) và chạy phân tách <code>curl -w</code> tới biên vài lần; ghi trung vị <code>dns/connect/ttfb/total</code>.</li>
<li>Ghi <strong>kích thước</strong> câu trả lời, có và không <code>--compressed</code>.</li>
<li>Ghi chú khoảng trống nào là phía máy chủ (<code>connect→ttfb</code>) và cái nào là tải (<code>total−ttfb</code>).</li>
<li>Bắt một yêu cầu ở biên với <code>tcpdump</code> và xác nhận cú bắt tay và GET/200 có ở đó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một mốc nền viết xuống (dns/connect/ttfb/total + size + status), bạn chỉ được khoảng trống phía máy chủ và khoảng trống tải, và bạn có một bản bắt xác nhận đường request — đây là cái "trước" bài sau cải thiện.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Mốc nền (baseline)', 'Một phép đo đã ghi lấy trước bất kỳ thay đổi nào — tham chiếu.'],
  ['curl -w', 'Thời gian từng chặng: time_namelookup/connect/starttransfer/total + size_download.'],
  ['TTFB', 'Time to first byte — việc phía máy chủ (biên + proxy + API).'],
  ['Khoảng trống connect→ttfb', 'Phía máy chủ của yêu cầu — tinh chỉnh với cache/keep-alive.'],
  ['Khoảng trống total−ttfb', 'Tải thân — tinh chỉnh với nén.'],
  ['Điểm nhìn', 'Nơi bạn đo từ; dùng vài cái để tách đường khỏi máy chủ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <strong>mốc nền</strong> là một phép đo đã ghi lấy <strong>trước</strong> bất kỳ thay đổi nào — tham chiếu tinh chỉnh được chấm theo.</li>
<li><code>curl -w</code> tách yêu cầu thành <strong>dns / connect / ttfb / total</strong> + size — đồng hồ bấm giờ từng chặng của bạn.</li>
<li><strong>connect→ttfb</strong> là phía máy chủ; <strong>total−ttfb</strong> là tải — hai khoảng trống bạn sẽ tinh chỉnh.</li>
<li>Bắt ở <strong>biên</strong> để thấy <em>cái gì</em> các gói làm ở nơi thời gian nói độ trễ nằm.</li>
<li>Đo từ <strong>vài mạng</strong> để tách một vấn đề đường khỏi một vấn đề máy chủ.</li>
</ul>
${L('https://everything.curl.dev/usingcurl/verbose/writeout.html', '📘', 'curl — thời gian --write-out', 'Mọi trường time_* và size_download cho một mốc nền từng chặng.', 'Mở')}
${L('https://web.dev/articles/optimize-ttfb', '📘', 'web.dev — Tối ưu TTFB', 'Cái tạo nên TTFB và cách đo nó trước khi tinh chỉnh.', 'Mở')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', '📘', 'Wireshark — Theo luồng', 'Đọc bản bắt ở biên: khoảng trống vs truyền lại.', 'Mở')}
</div>
`,
};
