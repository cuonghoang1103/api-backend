/**
 * Chương 11 · 11.2 — Wireshark: theo một luồng, đọc một request chậm (slug khung netdev-11-2-wireshark).
 * Output thật: lab/out/c112-*.out.txt (dựng lại: bash lab/code/dung-output-ch11.sh) — tshark đọc cùng .pcap bắt ở 11.1.
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-11-2.mjs';

const L = card;

export default {
  title: '11.2 — Wireshark: follow a stream, read a slow request|||11.2 — Wireshark: theo một luồng, đọc một request chậm',
  slug: 'netdev-11-2-wireshark',
  type: 'LESSON',
  isFreePreview: true,
  description: 'tshark = Wireshark trên dòng lệnh (cùng bộ mổ/bộ lọc), đọc .pcap bắt ở 11.1 ngay trên máy chủ. Lọc HTTP (-Y http) rút method/URI/status; THEO một luồng TCP ráp các gói rải rác lại thành request/response đọc được. Bộ lọc BẮT (BPF, lúc bắt) vs HIỂN THỊ (lúc đọc). Dấu hiệu bệnh lý trong một request chậm: truyền lại (mất gói), zero window (áp lực ngược), RST (reset), và khoảng trống thời gian (khoảng trống trước response = máy chủ đang nghĩ; rải rác = mạng mất gói). Đo thật.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Wireshark: follow a stream, read a slow request</h2>
<p class="lead">Capturing packets is half the job; the other half is reading what you captured. A raw <code>.pcap</code> is thousands of packets in arrival order — useless until you can filter it, reassemble a conversation, and recognise the handful of signals that explain a slow or broken request. This lesson does that with <code>tshark</code> — Wireshark's engine on the command line — reading the very capture you made last lesson, so you can analyse a trace anywhere, including on a server over SSH.</p>

<h3>tshark is Wireshark on the command line</h3>
<p>Wireshark is the GUI you open a <code>.pcap</code> in on your laptop; <code>tshark</code> is the same engine with text output, for when you are on the box. Same dissectors, same filter language, same follow-stream. You captured with <code>tcpdump -w</code> (last lesson); you analyse with <code>tshark -r</code> here, or Wireshark later — the skills transfer both ways.</p>

<h3>Filter to the HTTP that happened</h3>
<p>Ask the whole capture one question — what HTTP exchange is in it?</p>
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -Y http', 1)}
<p>The <strong>display filter</strong> <code>-Y http</code> keeps only HTTP packets, and <code>-T fields -e http.request.method -e http.request.uri -e http.response.code</code> prints just those fields: the request's method and URI, and the response's status code. A file full of packets becomes a two-line summary of the exchange.</p>

<h3>Follow a TCP stream</h3>
<p>The most useful move in all of Wireshark is <strong>Follow TCP stream</strong> — reassembling one conversation from its scattered packets into the bytes each side actually sent:</p>
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -q', 1, { max: 13 })}
<p>Here the stream is the raw <code>GET / HTTP/1.1</code> request with its headers, exactly as the client sent it. When a trace is tangled across thousands of packets and many connections, follow-stream isolates the one you care about and shows it as plain, readable text — packets turned back into a request and response.</p>

<h3>Capture filters vs display filters</h3>
${kv([
  ['Capture filter (BPF)', 'Applied at capture time (tcpdump "tcp port 80"); decides what is saved. Keep it broad enough not to miss the bug.'],
  ['Display filter (Wireshark/-Y)', 'Applied while reading (http, tcp.analysis.retransmission); slices already-captured packets, as often as you like.'],
])}
<p>The rule: <strong>capture broad, display narrow</strong>. A too-tight capture filter can throw away the packet that proves the bug; a display filter can always be loosened and re-run on the saved file.</p>

<h3>The signals that explain a slow request</h3>
${kv([
  ['tcp.analysis.retransmission', 'A packet was lost and re-sent — loss on the path.'],
  ['tcp.analysis.zero_window', 'A receiver’s buffer is full — the app is not reading fast enough (backpressure).'],
  ['tcp.flags.reset==1', 'Someone reset the connection — refusal, timeout or crash.'],
  ['a big gap before the response', 'The server (or a specific hop) was slow right there.'],
])}
<p>These display filters jump straight to the pathology. "The request is slow" becomes "40 retransmissions between the client and the LB" or "the response sat for 3 s at the origin" — specific and fixable.</p>

<div class="pitfall co-tieu-de">
<p><strong>A capture answers "is it the network or the app?" — but only if you read the gap, not just the total time.</strong> The most common misdiagnosis is treating a slow request as one undifferentiated "slowness." The trace separates the causes precisely: a <strong>single gap with no retransmissions, right before the response</strong>, is the <em>server thinking</em> — the app or database is slow, and no amount of network tuning will help. <strong>Retransmissions and gaps scattered across the whole transfer</strong> are the <em>network losing packets</em> — and optimising the app will not help. Reading <em>where</em> the time is (follow the stream, look at the timestamps) tells you which team owns the fix. Blaming "the network" for what is a slow database query (or vice versa) wastes days; the packets say which it is.</p>
</div>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you have a <code>.pcap</code> of a slow request and must say whether the network or the app is to blame.</p>
<ol>
<li>On the lab, read the capture from 11.1 with <code>tshark -r /tmp/cap.pcap -Y http -T fields ...</code> and report the method, URI and status.</li>
<li>Follow the TCP stream (<code>-z follow,tcp,ascii,0</code>) and read the request.</li>
<li>Name the display filter you'd use to find retransmissions, zero windows, and resets.</li>
<li>Explain how a gap-before-response differs from scattered retransmissions in what it blames.</li>
</ol>
<p><strong>Done when:</strong> you have the HTTP summary and the followed stream; your filters are <code>tcp.analysis.retransmission</code>, <code>tcp.analysis.zero_window</code> and <code>tcp.flags.reset==1</code>; and you can say a single pre-response gap = the server/app is slow, while scattered retransmissions = the network is losing packets.</p>
<details><summary>Solution</summary>
<p><code>-Y http</code> with <code>-T fields</code> prints the request's <code>GET /</code> and the response <code>200</code>. Follow-stream shows the raw <code>GET / HTTP/1.1</code> with headers. Filters: <code>tcp.analysis.retransmission</code> (loss), <code>tcp.analysis.zero_window</code> (backpressure), <code>tcp.flags.reset==1</code> (reset). A single gap right before the response, with no retransmissions, blames the server (app/DB thinking); retransmissions and gaps spread across the transfer blame the network (packet loss).</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['tshark', 'Wireshark’s engine on the command line (text output).'],
  ['Display filter', 'Slices a .pcap while reading (http, tcp.analysis.*).'],
  ['Follow TCP stream', 'Reassemble one conversation into readable bytes.'],
  ['Retransmission', 'A re-sent packet — a sign of loss on the path.'],
  ['Zero window', 'A full receive buffer — the app is not reading fast enough.'],
  ['RST', 'A reset — the connection was refused, timed out or crashed.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><strong>tshark</strong> is Wireshark on the CLI — same dissectors and filters, reading your <code>.pcap</code> on the server.</li>
<li><strong>Filter to HTTP</strong> (<code>-Y http</code>) for method/URI/status; <strong>follow a TCP stream</strong> to read the whole conversation.</li>
<li><strong>Capture filters</strong> (BPF) narrow at capture time; <strong>display filters</strong> slice the saved packets.</li>
<li>Look for <strong>retransmissions</strong> (loss), <strong>zero window</strong> (backpressure), <strong>RST</strong> (reset), and the <strong>big time gap</strong>.</li>
<li>A gap before the response = the server thinking; scattered retransmits = the network losing packets.</li>
</ul>
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', '📘', 'Wireshark — Following streams', 'Reassembling a TCP/HTTP conversation into readable bytes.', 'Open')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChWorkDisplayFilterSection.html', '📘', 'Wireshark — Display filters', 'tcp.analysis.retransmission, zero_window, flags and more.', 'Open')}
${L('https://tshark.dev/', '📘', 'tshark.dev', 'A practical guide to analysing captures from the command line.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Wireshark: theo một luồng, đọc một request chậm</h2>
<p class="lead">Bắt gói là một nửa việc; nửa kia là đọc cái bạn bắt được. Một <code>.pcap</code> thô là hàng nghìn gói theo thứ tự đến — vô dụng cho tới khi bạn lọc được nó, ráp lại một cuộc hội thoại, và nhận ra một nhúm tín hiệu giải thích một yêu cầu chậm hay hỏng. Bài này làm điều đó với <code>tshark</code> — động cơ của Wireshark trên dòng lệnh — đọc chính bản bắt bạn làm ở bài trước, để bạn phân tích một trace ở đâu cũng được, kể cả trên một máy chủ qua SSH.</p>

<h3>tshark là Wireshark trên dòng lệnh</h3>
<p>Wireshark là giao diện bạn mở một <code>.pcap</code> trên laptop; <code>tshark</code> là cùng động cơ với output văn bản, cho khi bạn ở trên máy. Cùng bộ mổ, cùng ngôn ngữ lọc, cùng theo-luồng. Bạn bắt với <code>tcpdump -w</code> (bài trước); bạn phân tích với <code>tshark -r</code> ở đây, hay Wireshark sau — kỹ năng chuyển cả hai chiều.</p>

<h3>Lọc xuống HTTP đã xảy ra</h3>
<p>Hỏi cả bản bắt một câu hỏi — trao đổi HTTP nào trong nó?</p>
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -Y http', 1)}
<p><strong>Bộ lọc hiển thị</strong> <code>-Y http</code> chỉ giữ các gói HTTP, và <code>-T fields -e http.request.method -e http.request.uri -e http.response.code</code> in đúng các trường đó: method và URI của yêu cầu, và mã trạng thái của câu trả lời. Một tệp đầy gói thành một tóm tắt hai dòng của trao đổi.</p>

<h3>Theo một luồng TCP</h3>
<p>Nước hữu ích nhất trong cả Wireshark là <strong>Theo luồng TCP</strong> — ráp lại một cuộc hội thoại từ các gói rải rác thành các byte mỗi bên thật sự gửi:</p>
${run('c112-tshark', 'tshark -r /tmp/cap.pcap -q', 1, { max: 13 })}
<p>Ở đây luồng là yêu cầu <code>GET / HTTP/1.1</code> thô với các header của nó, đúng như client gửi. Khi một trace rối qua hàng nghìn gói và nhiều kết nối, theo-luồng cô lập cái bạn quan tâm và hiện nó dưới dạng văn bản thuần, đọc được — gói biến lại thành một yêu cầu và câu trả lời.</p>

<h3>Bộ lọc bắt so với bộ lọc hiển thị</h3>
${kv([
  ['Bộ lọc bắt (BPF)', 'Áp dụng lúc bắt (tcpdump "tcp port 80"); quyết cái gì được lưu. Giữ nó đủ rộng để không bỏ lỡ lỗi.'],
  ['Bộ lọc hiển thị (Wireshark/-Y)', 'Áp dụng trong khi đọc (http, tcp.analysis.retransmission); cắt các gói đã bắt, thường như bạn muốn.'],
])}
<p>Quy tắc: <strong>bắt rộng, hiển thị hẹp</strong>. Một bộ lọc bắt quá chặt có thể vứt gói chứng minh lỗi; một bộ lọc hiển thị luôn nới được và chạy lại trên tệp đã lưu.</p>

<h3>Các tín hiệu giải thích một request chậm</h3>
${kv([
  ['tcp.analysis.retransmission', 'Một gói bị mất và gửi lại — mất gói trên đường.'],
  ['tcp.analysis.zero_window', 'Đệm của một bên nhận đầy — app không đọc đủ nhanh (áp lực ngược).'],
  ['tcp.flags.reset==1', 'Ai đó reset kết nối — từ chối, timeout hay sập.'],
  ['một khoảng trống lớn trước câu trả lời', 'Máy chủ (hay một hop cụ thể) chậm ngay đó.'],
])}
<p>Các bộ lọc hiển thị này nhảy thẳng tới bệnh lý. "Yêu cầu chậm" thành "40 lần truyền lại giữa client và LB" hay "câu trả lời nằm 3 giây ở origin" — cụ thể và sửa được.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một bản bắt trả lời "là mạng hay app?" — nhưng chỉ khi bạn đọc khoảng trống, không chỉ tổng thời gian.</strong> Chẩn đoán sai phổ biến nhất là coi một yêu cầu chậm như một "chậm" không phân biệt. Trace tách các nguyên nhân chính xác: một <strong>khoảng trống đơn không truyền lại, ngay trước câu trả lời</strong>, là <em>máy chủ đang nghĩ</em> — app hay cơ sở dữ liệu chậm, và không lượng tinh chỉnh mạng nào giúp được. <strong>Truyền lại và khoảng trống rải khắp cả cuộc truyền</strong> là <em>mạng đang mất gói</em> — và tối ưu app sẽ không giúp. Đọc <em>chỗ</em> thời gian nằm (theo luồng, nhìn các mốc thời gian) cho bạn biết đội nào sở hữu cách sửa. Đổ lỗi "mạng" cho cái thật ra là một truy vấn cơ sở dữ liệu chậm (hay ngược lại) phí nhiều ngày; các gói nói nó là cái nào.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn có một <code>.pcap</code> của một yêu cầu chậm và phải nói mạng hay app đáng trách.</p>
<ol>
<li>Trên lab, đọc bản bắt từ 11.1 với <code>tshark -r /tmp/cap.pcap -Y http -T fields ...</code> và báo method, URI và status.</li>
<li>Theo luồng TCP (<code>-z follow,tcp,ascii,0</code>) và đọc yêu cầu.</li>
<li>Kể bộ lọc hiển thị bạn sẽ dùng để tìm truyền lại, cửa sổ không, và reset.</li>
<li>Giải thích một khoảng-trống-trước-câu-trả-lời khác truyền lại rải rác thế nào trong cái nó đổ lỗi.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có tóm tắt HTTP và luồng đã theo; các bộ lọc của bạn là <code>tcp.analysis.retransmission</code>, <code>tcp.analysis.zero_window</code> và <code>tcp.flags.reset==1</code>; và bạn nói được một khoảng trống đơn trước câu trả lời = máy chủ/app chậm, còn truyền lại rải rác = mạng đang mất gói.</p>
<details><summary>Lời giải</summary>
<p><code>-Y http</code> với <code>-T fields</code> in <code>GET /</code> của yêu cầu và <code>200</code> câu trả lời. Theo-luồng hiện <code>GET / HTTP/1.1</code> thô với các header. Bộ lọc: <code>tcp.analysis.retransmission</code> (mất gói), <code>tcp.analysis.zero_window</code> (áp lực ngược), <code>tcp.flags.reset==1</code> (reset). Một khoảng trống đơn ngay trước câu trả lời, không truyền lại, đổ lỗi máy chủ (app/DB đang nghĩ); truyền lại và khoảng trống trải khắp cuộc truyền đổ lỗi mạng (mất gói).</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['tshark', 'Động cơ của Wireshark trên dòng lệnh (output văn bản).'],
  ['Bộ lọc hiển thị', 'Cắt một .pcap trong khi đọc (http, tcp.analysis.*).'],
  ['Theo luồng TCP', 'Ráp một cuộc hội thoại thành các byte đọc được.'],
  ['Truyền lại', 'Một gói gửi lại — dấu hiệu mất gói trên đường.'],
  ['Cửa sổ không (zero window)', 'Một đệm nhận đầy — app không đọc đủ nhanh.'],
  ['RST', 'Một reset — kết nối bị từ chối, timeout hay sập.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><strong>tshark</strong> là Wireshark trên CLI — cùng bộ mổ và bộ lọc, đọc <code>.pcap</code> của bạn trên máy chủ.</li>
<li><strong>Lọc xuống HTTP</strong> (<code>-Y http</code>) cho method/URI/status; <strong>theo một luồng TCP</strong> để đọc cả cuộc hội thoại.</li>
<li><strong>Bộ lọc bắt</strong> (BPF) thu hẹp lúc bắt; <strong>bộ lọc hiển thị</strong> cắt các gói đã lưu.</li>
<li>Tìm <strong>truyền lại</strong> (mất gói), <strong>cửa sổ không</strong> (áp lực ngược), <strong>RST</strong> (reset), và <strong>khoảng trống thời gian lớn</strong>.</li>
<li>Một khoảng trống trước câu trả lời = máy chủ đang nghĩ; truyền lại rải rác = mạng đang mất gói.</li>
</ul>
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', '📘', 'Wireshark — Theo luồng', 'Ráp một cuộc hội thoại TCP/HTTP thành các byte đọc được.', 'Mở')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChWorkDisplayFilterSection.html', '📘', 'Wireshark — Bộ lọc hiển thị', 'tcp.analysis.retransmission, zero_window, flags và hơn nữa.', 'Mở')}
${L('https://tshark.dev/', '📘', 'tshark.dev', 'Một hướng dẫn thực hành phân tích bản bắt từ dòng lệnh.', 'Mở')}
</div>
`,
};
