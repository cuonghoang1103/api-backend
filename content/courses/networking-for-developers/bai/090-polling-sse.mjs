/**
 * Chương 9 · 9.1 — Polling, long polling và Server-Sent Events (slug khung netdev-9-1-polling-sse). Bài MỞ CHƯƠNG 9 (có khối 🎯).
 * Output thật: lab/out/c91-*.out.txt (dựng lại: bash lab/code/dung-output-ch9.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-09-1.mjs';

const L = card;
const API = { mon: 'API & System Design', khoa: 'api-design' };

export default {
  title: '9.1 — Polling, long polling and Server-Sent Events|||9.1 — Polling, long polling và Server-Sent Events',
  slug: 'netdev-9-1-polling-sse',
  type: 'LESSON',
  isFreePreview: true,
  description: 'HTTP là hỏi/đáp — ba cách để máy chủ ĐẨY cập nhật trên nền đó: polling (hỏi lặp lại, phí vòng khứ hồi, chậm một khoảng), long-polling (giữ yêu cầu tới khi có tin — đo time_total), và SSE (một kết nối, nhiều sự kiện data:, trình duyệt EventSource tự nối lại). SSE qua proxy cần tắt đệm (X-Accel-Buffering: no) không thì đóng băng. Đo thật trên một máy chủ thời gian thực tí hon.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Polling, long polling and Server-Sent Events</h2>
<p class="lead">HTTP has one shape: the client asks, the server answers, the connection is done. But half of what modern apps do — a chat message arriving, a notification, a live price, a build log scrolling — needs the <em>server</em> to tell the <em>client</em> something it never asked for. This chapter is about keeping a line open between the two. It opens with the three techniques that do it on top of plain HTTP, measured on a tiny real-time server, so by the time we reach WebSocket you can say exactly why — and when the simpler option was enough.</p>

<div class="callout info">
<p><strong>🎯 Chapter 9 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Choose</strong> between polling, long-polling, SSE and WebSocket by their real cost, not by habit or hype.</li>
<li><strong>Read a WebSocket</strong> on the wire: the <code>101</code> upgrade, the <code>Sec-WebSocket-Accept</code> handshake, frames, and ping/pong heartbeats.</li>
<li><strong>Scale long-lived connections</strong>: file-descriptor limits, sticky sessions, reconnect with exponential backoff, and deploying without cutting everyone off.</li>
<li><strong>Explain WebRTC</strong> at a glance: STUN to discover your public mapping, ICE to connect, TURN to relay when peer-to-peer fails.</li>
<li><strong>Keep a connection alive through proxies</strong> — the idle timeouts and buffering that silently cut streams.</li>
</ul>
<p><strong>Why a developer needs this:</strong> "notifications are delayed", "SSE works locally but not in production", "the WebSocket drops every 60 seconds", "we fall over at 10k connections", "the video call won't connect behind a corporate NAT" are all real-time connection problems you can diagnose once you can see what the connection is doing. Everything is measured on the base lab with a small SSE/polling server and a hand-written WebSocket server.</p>
</div>

<h3>HTTP pushes nothing by itself</h3>
<p>The gap is simple to state: HTTP is request/response, so the server can only speak when spoken to. Three techniques work around that without leaving HTTP. We run all three against one tiny server whose counter ticks up every 2 seconds.</p>

<h3>Polling: ask again and again</h3>
<p>The crudest fix: a timer that re-requests the state.</p>
${run('c91-poll', 'for i', 1)}
<p>It works, but look at the cost — the counter barely moves, so most responses are <strong>duplicates</strong>, each one a full HTTP round trip (DNS is cached, but TCP/TLS and headers are not free), and news arrives up to one interval <em>late</em>. Polling is acceptable when data changes slowly and you value simplicity; it is wasteful the moment updates matter.</p>

<h3>Long-polling: hold the request open</h3>
<p>A smarter move: the client asks, and the server <strong>does not answer</strong> until it actually has news (or a timeout fires).</p>
${run('c91-poll', 'curl', 1)}
<p>The <code>time_total</code> shows the request <em>waited</em> instead of spinning in a loop. News is delivered the instant it exists, with a fraction of the requests. The cost: each waiting client still holds a connection, and after every answer the client must immediately re-ask. Long-polling's great virtue is that it is still plain HTTP — it works through ancient proxies that choke on anything fancier.</p>

<h3>SSE: one connection, a stream of events</h3>
<p>Server-Sent Events removes the re-asking entirely: the client opens <strong>one</strong> connection and the server streams events down it as they happen.</p>
${run('c91-sse', 'curl -N', 1, { max: 12 })}
<p>Each <code>data:</code> line is one event, pushed when the counter changed, all over a single connection. In the browser this is the <code>EventSource</code> API — a few lines — and it <strong>auto-reconnects</strong> (the <code>retry:</code> line sets the delay). SSE is ideal for <strong>one-way</strong> server→client streams: notifications, logs, job progress, live dashboards.</p>

<div class="pitfall co-tieu-de">
<p><strong>SSE freezes in production when a proxy buffers it.</strong> An SSE response is a <code>Content-Type: text/event-stream</code> that never ends — and nginx, by default, <em>buffers</em> upstream responses, so it holds your events and the stream looks dead until the buffer fills (or the request times out). The response here carries the fix:</p>
${run('c91-sse', 'curl -s -D', 1)}
<p><code>X-Accel-Buffering: no</code> tells nginx not to buffer this response; you also set <code>proxy_buffering off</code> on the SSE location and send <code>Cache-Control: no-cache</code>. This is the single most common "works on my machine" bug for SSE — the code is correct, the proxy is swallowing the stream.</p>
</div>
${cauNoi('en', { ...API, bai: 'api-10-3-realtime', so: '10.4', ten: 'Realtime APIs: polling, SSE or WebSocket — choosing the contract', giong: 'the three techniques and when to pick each', khac: 'the API course chooses at the contract/design level — payloads, reconnection, backpressure', them: 'what actually happens on the connection — the held long-poll measured by time_total, the SSE event stream on one connection, and the proxy-buffering trap you see with curl' })}

<h3>Which one to reach for</h3>
${kv([
  ['Polling', 'Client pulls on a timer. Simple; wasteful; one interval late. For slow data.'],
  ['Long-polling', 'Client pulls, server holds until news. Instant; plain HTTP; a connection per waiter.'],
  ['SSE', 'Server → client stream over one connection. One-way; auto-reconnect; needs buffering off.'],
  ['WebSocket', 'Full two-way, low latency. For chat, games, collaboration (next lesson).'],
])}
<p>Reach for the <strong>simplest technique that fits</strong>. A great deal of "we need WebSockets" is really one-way — a feed, a log, a progress bar — which SSE or long-polling serves with far less to build and operate.</p>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you must add three live features — a notifications badge, a build-log viewer, and a "who is online" count — and justify the technique for each.</p>
<ol>
<li>Bring up the lab: <code>bash lab/code/dung-output-ch9.sh</code> starts the real-time server on <code>:5100</code>.</li>
<li>Poll <code>/poll</code> three times a second apart; note how many responses are duplicates.</li>
<li>Call <code>/longpoll?since=999</code> and read <code>time_total</code> — confirm it waited for the next tick.</li>
<li>Open <code>/sse</code> with <code>curl -N</code> and watch events stream; then read its headers and find <code>X-Accel-Buffering: no</code>.</li>
<li>Pick a technique for each of the three features and write one sentence of justification each.</li>
</ol>
<p><strong>Done when:</strong> you have seen duplicate polls, a held long-poll, and a live SSE stream, and your choices are roughly: notifications → SSE (one-way, auto-reconnect); build log → SSE; "who is online" → SSE or short polling — none of them need WebSocket.</p>
<details><summary>Solution</summary>
<p>Polling returns the same <code>n</code> repeatedly — wasted round trips. The long-poll's <code>time_total</code> is roughly one tick, proving it waited. The SSE stream pushes <code>data:</code> events on one connection and its headers include <code>text/event-stream</code>, <code>no-cache</code> and <code>X-Accel-Buffering: no</code>. All three features are one-way (server→client), so SSE fits each; "who is online" could also be a slow poll. None require the two-way cost of WebSocket.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Polling', 'Re-requesting state on a timer; most answers are duplicates.'],
  ['Long-polling', 'The server holds a request open until it has news (or a timeout).'],
  ['SSE', 'Server-Sent Events: a one-way text/event-stream the server pushes down.'],
  ['EventSource', 'The browser API for SSE; auto-reconnects using the retry: delay.'],
  ['data: / retry:', 'An SSE event line, and the reconnect delay the server suggests.'],
  ['X-Accel-Buffering: no', 'Tells nginx not to buffer this response — essential for SSE.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>HTTP is request/response; <strong>polling</strong>, <strong>long-polling</strong> and <strong>SSE</strong> push updates on top of it.</li>
<li><strong>Polling</strong> wastes round trips on duplicate answers and is one interval late — only for slow data.</li>
<li><strong>Long-polling</strong> holds the request until there is news: instant delivery, far fewer requests, plain HTTP.</li>
<li><strong>SSE</strong> streams <code>data:</code> events down one connection (<code>EventSource</code>, auto-reconnect) — one-way.</li>
<li>SSE through a proxy needs <strong>buffering off</strong> (<code>X-Accel-Buffering: no</code>) or it freezes; pick the simplest technique that fits.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events', '📘', 'MDN — Using server-sent events', 'EventSource, the event stream format, reconnection and retry.', 'Open')}
${L('https://html.spec.whatwg.org/multipage/server-sent-events.html', '📄', 'WHATWG HTML — Server-sent events', 'The specification for text/event-stream and EventSource.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/API/EventSource', '📘', 'MDN — EventSource', 'The browser API: a few lines to consume an SSE stream.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Polling, long polling và Server-Sent Events</h2>
<p class="lead">HTTP có một dáng: client hỏi, máy chủ đáp, kết nối xong. Nhưng một nửa những gì app hiện đại làm — một tin nhắn chat đến, một thông báo, một giá trực tiếp, một log dựng cuộn — cần <em>máy chủ</em> nói cho <em>client</em> một thứ nó không bao giờ hỏi. Chương này về giữ một đường dây mở giữa hai bên. Nó mở đầu với ba kỹ thuật làm điều đó trên nền HTTP thuần, đo trên một máy chủ thời gian thực tí hon, để khi tới WebSocket bạn nói được chính xác vì sao — và khi nào lựa chọn đơn giản hơn đã đủ.</p>

<div class="callout info">
<p><strong>🎯 Chương 9 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Chọn</strong> giữa polling, long-polling, SSE và WebSocket theo chi phí thật, không theo thói quen hay trào lưu.</li>
<li><strong>Đọc một WebSocket</strong> trên dây: cú nâng <code>101</code>, cú bắt tay <code>Sec-WebSocket-Accept</code>, khung, và nhịp tim ping/pong.</li>
<li><strong>Mở rộng kết nối sống lâu</strong>: trần file descriptor, sticky session, nối lại có lùi dần theo cấp số nhân, và deploy mà không cắt đứt mọi người.</li>
<li><strong>Giải thích WebRTC</strong> lướt qua: STUN để biết ánh xạ công cộng, ICE để nối, TURN để chuyển tiếp khi ngang hàng thất bại.</li>
<li><strong>Giữ một kết nối sống qua proxy</strong> — các idle timeout và đệm âm thầm cắt dòng.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> "thông báo trễ", "SSE chạy ở máy mà không chạy trên production", "WebSocket rớt mỗi 60 giây", "sập ở 10k kết nối", "video call không nối được sau NAT công ty" đều là vấn đề kết nối thời gian thực bạn chẩn đoán được một khi thấy kết nối đang làm gì. Mọi thứ đo trên lab cơ bản với một máy chủ SSE/polling nhỏ và một máy chủ WebSocket viết tay.</p>
</div>

<h3>HTTP tự nó không đẩy gì</h3>
<p>Khoảng trống dễ nói: HTTP là hỏi/đáp, nên máy chủ chỉ nói được khi được hỏi. Ba kỹ thuật lách quanh điều đó mà không rời HTTP. Ta chạy cả ba trên một máy chủ tí hon có bộ đếm nhích lên mỗi 2 giây.</p>

<h3>Polling: hỏi lặp đi lặp lại</h3>
<p>Cách thô nhất: một đồng hồ hỏi lại trạng thái.</p>
${run('c91-poll', 'for i', 1)}
<p>Nó chạy, nhưng nhìn chi phí — bộ đếm hầu như không nhích, nên phần lớn câu trả lời là <strong>trùng</strong>, mỗi cái một vòng khứ hồi HTTP đầy đủ (DNS được cache, nhưng TCP/TLS và header không miễn phí), và tin đến chậm tới một khoảng. Polling chấp nhận được khi dữ liệu đổi chậm và bạn quý sự đơn giản; nó lãng phí ngay khi cập nhật quan trọng.</p>

<h3>Long-polling: giữ yêu cầu mở</h3>
<p>Một nước khôn hơn: client hỏi, và máy chủ <strong>không trả lời</strong> tới khi nó thật sự có tin (hoặc một timeout kích hoạt).</p>
${run('c91-poll', 'curl', 1)}
<p><code>time_total</code> cho thấy yêu cầu <em>đã chờ</em> thay vì quay vòng. Tin được giao đúng lúc nó tồn tại, với một phần nhỏ số yêu cầu. Chi phí: mỗi client đang chờ vẫn giữ một kết nối, và sau mỗi câu trả lời client phải lập tức hỏi lại. Đức tính lớn của long-polling là nó vẫn là HTTP thuần — chạy qua các proxy cổ nghẹn với bất cứ gì cầu kỳ hơn.</p>

<h3>SSE: một kết nối, một dòng sự kiện</h3>
<p>Server-Sent Events bỏ hẳn việc hỏi-lại: client mở <strong>một</strong> kết nối và máy chủ đẩy sự kiện xuống nó khi chúng xảy ra.</p>
${run('c91-sse', 'curl -N', 1, { max: 12 })}
<p>Mỗi dòng <code>data:</code> là một sự kiện, đẩy khi bộ đếm đổi, tất cả trên một kết nối. Trong trình duyệt đây là API <code>EventSource</code> — vài dòng — và nó <strong>tự nối lại</strong> (dòng <code>retry:</code> đặt độ trễ). SSE lý tưởng cho dòng <strong>một chiều</strong> máy-chủ→client: thông báo, log, tiến độ việc, bảng điều khiển trực tiếp.</p>

<div class="pitfall co-tieu-de">
<p><strong>SSE đóng băng trên production khi một proxy đệm nó.</strong> Một câu trả lời SSE là một <code>Content-Type: text/event-stream</code> không bao giờ kết thúc — và nginx, mặc định, <em>đệm</em> câu trả lời thượng nguồn, nên nó giữ các sự kiện của bạn và dòng trông như chết tới khi đệm đầy (hoặc yêu cầu timeout). Câu trả lời ở đây mang cách sửa:</p>
${run('c91-sse', 'curl -s -D', 1)}
<p><code>X-Accel-Buffering: no</code> bảo nginx đừng đệm câu trả lời này; bạn cũng đặt <code>proxy_buffering off</code> trên location SSE và gửi <code>Cache-Control: no-cache</code>. Đây là lỗi "chạy ở máy tôi" phổ biến nhất của SSE — mã thì đúng, proxy đang nuốt dòng.</p>
</div>
${cauNoi('vi', { ...API, bai: 'api-10-3-realtime', so: '10.4', ten: 'API thời gian thực: polling, SSE hay WebSocket — chọn hợp đồng', giong: 'ba kỹ thuật và khi nào chọn cái nào', khac: 'khoá API chọn ở mức hợp đồng/thiết kế — payload, nối lại, backpressure', them: 'cái gì thật sự xảy ra trên kết nối — long-poll bị giữ đo bằng time_total, dòng sự kiện SSE trên một kết nối, và bẫy đệm-proxy bạn thấy bằng curl' })}

<h3>Nên với tới cái nào</h3>
${kv([
  ['Polling', 'Client kéo theo đồng hồ. Đơn giản; lãng phí; chậm một khoảng. Cho dữ liệu chậm.'],
  ['Long-polling', 'Client kéo, máy chủ giữ tới khi có tin. Tức thì; HTTP thuần; một kết nối mỗi người chờ.'],
  ['SSE', 'Dòng máy-chủ → client trên một kết nối. Một chiều; tự nối lại; cần tắt đệm.'],
  ['WebSocket', 'Hai chiều đầy đủ, độ trễ thấp. Cho chat, game, cộng tác (bài sau).'],
])}
<p>Với tới <strong>kỹ thuật đơn giản nhất vừa</strong>. Rất nhiều "chúng ta cần WebSocket" thật ra là một chiều — một feed, một log, một thanh tiến độ — mà SSE hay long-polling phục vụ với ít thứ phải dựng và vận hành hơn nhiều.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn phải thêm ba tính năng trực tiếp — một huy hiệu thông báo, một trình xem build-log, và một đếm "ai đang online" — và biện minh kỹ thuật cho mỗi cái.</p>
<ol>
<li>Dựng lab: <code>bash lab/code/dung-output-ch9.sh</code> khởi động máy chủ thời gian thực trên <code>:5100</code>.</li>
<li>Poll <code>/poll</code> ba lần cách nhau một giây; ghi bao nhiêu câu trả lời là trùng.</li>
<li>Gọi <code>/longpoll?since=999</code> và đọc <code>time_total</code> — xác nhận nó chờ nhịp kế.</li>
<li>Mở <code>/sse</code> với <code>curl -N</code> và xem sự kiện đẩy; rồi đọc header của nó và tìm <code>X-Accel-Buffering: no</code>.</li>
<li>Chọn một kỹ thuật cho mỗi trong ba tính năng và viết một câu biện minh mỗi cái.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy các poll trùng, một long-poll bị giữ, và một dòng SSE trực tiếp, và lựa chọn của bạn đại khái là: thông báo → SSE (một chiều, tự nối lại); build log → SSE; "ai đang online" → SSE hoặc polling ngắn — không cái nào cần WebSocket.</p>
<details><summary>Lời giải</summary>
<p>Polling trả cùng <code>n</code> lặp lại — vòng khứ hồi phí. <code>time_total</code> của long-poll xấp xỉ một nhịp, chứng minh nó đã chờ. Dòng SSE đẩy sự kiện <code>data:</code> trên một kết nối và header của nó gồm <code>text/event-stream</code>, <code>no-cache</code> và <code>X-Accel-Buffering: no</code>. Cả ba tính năng là một chiều (máy-chủ→client), nên SSE hợp mỗi cái; "ai đang online" cũng có thể là một poll chậm. Không cái nào cần chi phí hai-chiều của WebSocket.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Polling', 'Hỏi lại trạng thái theo đồng hồ; phần lớn câu trả lời là trùng.'],
  ['Long-polling', 'Máy chủ giữ một yêu cầu mở tới khi có tin (hoặc một timeout).'],
  ['SSE', 'Server-Sent Events: một text/event-stream một chiều máy chủ đẩy xuống.'],
  ['EventSource', 'API trình duyệt cho SSE; tự nối lại dùng độ trễ retry:.'],
  ['data: / retry:', 'Một dòng sự kiện SSE, và độ trễ nối lại máy chủ gợi ý.'],
  ['X-Accel-Buffering: no', 'Bảo nginx đừng đệm câu trả lời này — thiết yếu cho SSE.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>HTTP là hỏi/đáp; <strong>polling</strong>, <strong>long-polling</strong> và <strong>SSE</strong> đẩy cập nhật trên nền đó.</li>
<li><strong>Polling</strong> phí vòng khứ hồi vào câu trả lời trùng và chậm một khoảng — chỉ cho dữ liệu chậm.</li>
<li><strong>Long-polling</strong> giữ yêu cầu tới khi có tin: giao ngay, ít yêu cầu hơn nhiều, HTTP thuần.</li>
<li><strong>SSE</strong> đẩy sự kiện <code>data:</code> xuống một kết nối (<code>EventSource</code>, tự nối lại) — một chiều.</li>
<li>SSE qua một proxy cần <strong>tắt đệm</strong> (<code>X-Accel-Buffering: no</code>) không thì đóng băng; chọn kỹ thuật đơn giản nhất vừa.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events', '📘', 'MDN — Dùng server-sent events', 'EventSource, định dạng dòng sự kiện, nối lại và retry.', 'Mở')}
${L('https://html.spec.whatwg.org/multipage/server-sent-events.html', '📄', 'WHATWG HTML — Server-sent events', 'Đặc tả cho text/event-stream và EventSource.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/API/EventSource', '📘', 'MDN — EventSource', 'API trình duyệt: vài dòng để tiêu thụ một dòng SSE.', 'Mở')}
</div>
`,
};
