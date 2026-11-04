/**
 * Chương 9 · 9.4 — Lướt qua WebRTC: xuyên NAT bằng STUN và TURN (slug khung netdev-9-4-webrtc).
 * Output thật: lab/out/c94-stun.out.txt (STUN CHẠY THẬT, IP che). TURN không dựng trong lab ⇒ mô tả (CHAY-O-MAY).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-09-4.mjs';

const L = card;
const IO = { mon: 'Socket.IO', khoa: 'socket-io' };

export default {
  title: '9.4 — WebRTC at a glance: NAT traversal with STUN and TURN|||9.4 — Lướt qua WebRTC: xuyên NAT bằng STUN và TURN',
  slug: 'netdev-9-4-webrtc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'WebRTC đưa một dòng media NGANG HÀNG giữa hai bên đều sau NAT, chỉ chuyển tiếp khi buộc: STUN tiết lộ ánh xạ ip:cổng CÔNG CỘNG (cổng khác cục bộ = NAT dịch — đo thật, IP che); ICE thu ứng viên và thử tới khi một cái nối; TURN chuyển tiếp khi không đường trực tiếp nào chạy (NAT đối xứng); và SIGNALLING (trao đổi SDP + ICE candidate) là việc của BẠN, thường qua một WebSocket. Lab chạy thật một yêu cầu STUN; TURN mô tả (lab không dựng máy chủ TURN).',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>WebRTC at a glance: NAT traversal with STUN and TURN</h2>
<p class="lead">Every video call in your browser — a meeting, a support chat, a cloud game — runs on WebRTC, and WebRTC's whole difficulty is one problem you already understand: both people are behind NAT, with private addresses no one outside can dial. This lesson is a tour, not a deep dive: just enough to explain how two NATed peers find each other, when the media can go directly and when it must be relayed, and which part is actually your job as a developer. One real STUN request on the lab anchors it.</p>

<h3>The problem: two peers, both behind NAT</h3>
<p>You met NAT in the addressing chapter: a device on home or office Wi-Fi has a <strong>private</strong> IP, and the router rewrites addresses on the way out. That is fine for calling a public server, but a video call wants the <strong>two browsers to talk directly</strong> — lowest latency, no server carrying the media — and neither has a public address the other can reach. WebRTC is the machinery that threads a <strong>peer-to-peer</strong> stream through two NATs, and relays through a server only when it has no choice.</p>

<h3>STUN: discover your public address</h3>
<p>The first step is for each peer to learn how the outside world sees it. A <strong>STUN</strong> server answers exactly that, and we can ask one for real:</p>
${run('c94-stun', 'python3', 1)}
<p>The reply's <code>XOR-MAPPED-ADDRESS</code> is your <strong>public mapping</strong> — the ip:port the internet sees. The public <strong>port differs from the local port</strong>: that difference <em>is</em> the NAT doing its translation. (The lab redacts the public IP for privacy; the mapping and the port change are genuine.) One small UDP round trip, and a peer now has an address it can advertise to the other side.</p>

<h3>ICE: gather candidates and try them</h3>
<p>A public mapping alone is not enough, because there are several possible paths. <strong>ICE</strong> (Interactive Connectivity Establishment) is the trial-and-error that finds one that works:</p>
<ol>
<li>Each peer <strong>gathers candidates</strong>: its local address, its STUN-discovered public mapping, and (if configured) a TURN relay address.</li>
<li>The peers <strong>exchange</strong> their candidate lists and <strong>try them in order</strong> of preference.</li>
<li>The first pair that can actually exchange packets <strong>wins</strong> — usually a direct path, occasionally a relayed one.</li>
</ol>
<p>So STUN supplies a candidate; ICE is the process that tests every candidate and settles on the best path that works.</p>

<h3>TURN: relay when direct is impossible</h3>
<p>Some NATs — <strong>symmetric</strong> ones, common in corporate networks — hand out a <em>different</em> public port for every destination, which makes the mapping STUN found useless to a third peer. When ICE can find no direct path, the media has to flow through a <strong>TURN</strong> server that relays packets between the two peers.</p>
<p>⏳ <strong>Chưa chạy thật trong lab</strong> — the lab has no TURN server, so there is no relay capture to show; the STUN step above is real, and the relay is described here.</p>
<!-- CHAY-O-MAY: TURN relay cần một máy chủ TURN (vd coturn) + hai peer sau NAT đối xứng. Lab net-lab không dựng TURN; bước STUN (c94-stun) chạy thật với STUN công cộng, IP che. Dựng TURN vượt phạm vi "lướt qua" của bài. -->
<p>TURN is a <strong>fallback</strong>: it adds a hop and consumes server bandwidth for the whole call, so ICE uses it only when nothing direct works. In the real world a meaningful fraction of calls — behind strict firewalls and symmetric NAT — end up relayed, which is why a production WebRTC app must run or rent a TURN server even though most calls never touch it.</p>

<div class="pitfall co-tieu-de">
<p><strong>Signalling is your job — WebRTC does not do it.</strong> WebRTC defines how to carry the media, but <em>not</em> how the two peers first find each other and exchange their session description (<strong>SDP</strong> offer/answer) and ICE candidates. That exchange — <strong>signalling</strong> — you build yourself, and it almost always rides a channel you already have from this chapter: a <strong>WebSocket</strong> (often socket.io). A classic beginner mistake is expecting WebRTC to "just connect two browsers"; it will not until you relay their offers and candidates through your own signalling server. WebRTC carries the <strong>media</strong>; your WebSocket carries the <strong>setup</strong>.</p>
</div>
${cauNoi('en', { ...IO, bai: 'io-7-1-signalling', so: '7.1', ten: 'Signalling: what socket.io does in a video call', giong: 'exchanging SDP offers/answers and ICE candidates to start a call', khac: 'the Socket.IO course builds the signalling server concretely with socket.io events', them: 'the layer beneath it — STUN discovering your public NAT mapping (measured), ICE trying candidates, and TURN relaying when direct fails' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> explain to a teammate why a WebRTC call sometimes connects instantly and sometimes needs a relay — and what you must build.</p>
<ol>
<li>On the lab, run the STUN request and read the <code>XOR-MAPPED-ADDRESS</code>. Point out how the public port differs from the local one and say why.</li>
<li>Describe, in order, what STUN, ICE and TURN each contribute to connecting two NATed peers.</li>
<li>State which part WebRTC handles and which part (signalling) you must build, and over what channel.</li>
<li>Name the NAT type that forces a TURN relay.</li>
</ol>
<p><strong>Done when:</strong> you can say STUN reveals the public mapping (port changed by NAT), ICE tries candidates to find a working path, TURN relays when none is direct (symmetric NAT), and signalling — exchanging SDP + candidates, usually over a WebSocket — is the part you implement.</p>
<details><summary>Solution</summary>
<p>STUN returns your public ip:port; the port differs from the local one because the NAT maps it. ICE gathers candidates (local, STUN mapping, TURN) and tries them until a pair can exchange packets. TURN relays the media when no direct path exists, which symmetric NAT forces by using a different public port per destination. WebRTC carries the media and does STUN/ICE for you via <code>RTCPeerConnection</code>; <em>you</em> build the signalling that exchanges the SDP offer/answer and ICE candidates — typically over a WebSocket.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['NAT traversal', 'Getting a connection through NAT to a peer with no public address.'],
  ['STUN', 'A server that tells you your public ip:port mapping.'],
  ['XOR-MAPPED-ADDRESS', 'The STUN reply field carrying your public mapping.'],
  ['ICE', 'Gathering candidate addresses and trying them to find a working path.'],
  ['TURN', 'A relay server for media when no direct peer-to-peer path works.'],
  ['SDP', 'The session description (codecs, addresses) peers exchange to set up.'],
  ['Signalling', 'Exchanging SDP + ICE candidates between peers — your job, over e.g. a WebSocket.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Two peers behind NAT have no public address to dial — WebRTC gets a <strong>P2P media stream</strong> through, relaying only if it must.</li>
<li><strong>STUN</strong> reveals your <strong>public ip:port mapping</strong> (the port differs from local = NAT translating) — measured for real.</li>
<li><strong>ICE</strong> gathers candidate addresses and tries them until one connects — usually direct.</li>
<li><strong>TURN</strong> relays the media when no direct path works (strict/symmetric NAT); a production app must have one.</li>
<li><strong>Signalling</strong> — exchanging SDP + candidates — is <strong>your</strong> job, usually over a WebSocket.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/API/WebRTC_API', '📘', 'MDN — WebRTC API', 'RTCPeerConnection, ICE, STUN/TURN and the signalling you provide.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8445.html', '📄', 'RFC 8445 — ICE', 'How candidates are gathered and checked to connect two NATed peers.', 'Open')}
${L('https://webrtcforthecurious.com/', '📘', 'WebRTC for the Curious', 'A clear, vendor-neutral walk through STUN, ICE, TURN and signalling.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Lướt qua WebRTC: xuyên NAT bằng STUN và TURN</h2>
<p class="lead">Mọi cuộc gọi video trong trình duyệt của bạn — một cuộc họp, một chat hỗ trợ, một game đám mây — chạy trên WebRTC, và toàn bộ cái khó của WebRTC là một bài toán bạn đã hiểu: cả hai người đều sau NAT, với địa chỉ riêng không ai ngoài gọi được. Bài này là một chuyến lướt, không phải đào sâu: vừa đủ để giải thích hai bên sau NAT tìm thấy nhau thế nào, khi nào media đi thẳng và khi nào phải chuyển tiếp, và phần nào thật ra là việc của bạn với tư cách lập trình viên. Một yêu cầu STUN thật trên lab neo lại.</p>

<h3>Bài toán: hai bên, đều sau NAT</h3>
<p>Bạn đã gặp NAT ở chương địa chỉ: một thiết bị trên Wi-Fi nhà hay công ty có một IP <strong>riêng</strong>, và router viết lại địa chỉ trên đường ra. Thế là ổn khi gọi một máy chủ công cộng, nhưng một cuộc gọi video muốn <strong>hai trình duyệt nói thẳng với nhau</strong> — độ trễ thấp nhất, không server mang media — và không bên nào có địa chỉ công cộng bên kia với tới. WebRTC là bộ máy luồn một dòng <strong>ngang hàng</strong> qua hai NAT, và chỉ chuyển tiếp qua một server khi không còn lựa chọn.</p>

<h3>STUN: tìm địa chỉ công cộng của bạn</h3>
<p>Bước đầu là mỗi bên biết thế giới bên ngoài thấy nó thế nào. Một máy chủ <strong>STUN</strong> trả lời đúng điều đó, và ta hỏi một cái được, thật:</p>
${run('c94-stun', 'python3', 1)}
<p><code>XOR-MAPPED-ADDRESS</code> trong câu trả lời là <strong>ánh xạ công cộng</strong> của bạn — ip:cổng mà internet thấy. <strong>Cổng công cộng khác cổng cục bộ</strong>: khác biệt đó <em>chính là</em> NAT đang dịch. (Lab che IP công cộng vì quyền riêng tư; ánh xạ và đổi cổng là thật.) Một vòng khứ hồi UDP nhỏ, và một bên nay có một địa chỉ để quảng cáo cho phía kia.</p>

<h3>ICE: thu ứng viên và thử chúng</h3>
<p>Một ánh xạ công cộng thôi chưa đủ, vì có vài đường khả dĩ. <strong>ICE</strong> (Interactive Connectivity Establishment) là thử-và-sai tìm một đường chạy:</p>
<ol>
<li>Mỗi bên <strong>thu ứng viên</strong>: địa chỉ cục bộ, ánh xạ công cộng STUN tìm được, và (nếu cấu hình) một địa chỉ chuyển tiếp TURN.</li>
<li>Các bên <strong>trao đổi</strong> danh sách ứng viên và <strong>thử chúng theo thứ tự</strong> ưu tiên.</li>
<li>Cặp đầu tiên thật sự trao đổi được gói <strong>thắng</strong> — thường một đường trực tiếp, thỉnh thoảng một đường chuyển tiếp.</li>
</ol>
<p>Nên STUN cung cấp một ứng viên; ICE là tiến trình thử mọi ứng viên và chốt đường tốt nhất chạy được.</p>

<h3>TURN: chuyển tiếp khi trực tiếp bất khả</h3>
<p>Một số NAT — loại <strong>đối xứng</strong>, phổ biến trong mạng công ty — cấp một cổng công cộng <em>khác</em> cho mỗi đích, làm ánh xạ STUN tìm được vô dụng với một bên thứ ba. Khi ICE không tìm được đường trực tiếp nào, media phải chảy qua một máy chủ <strong>TURN</strong> chuyển tiếp gói giữa hai bên.</p>
<p>⏳ <strong>Chưa chạy thật trong lab</strong> — lab không có máy chủ TURN, nên không có bản bắt chuyển tiếp để trình; bước STUN ở trên là thật, và phần chuyển tiếp được mô tả ở đây.</p>
<!-- CHAY-O-MAY: TURN relay cần một máy chủ TURN (vd coturn) + hai peer sau NAT đối xứng. Lab net-lab không dựng TURN; bước STUN (c94-stun) chạy thật với STUN công cộng, IP che. Dựng TURN vượt phạm vi "lướt qua" của bài. -->
<p>TURN là một <strong>dự phòng</strong>: nó thêm một chặng và tiêu băng thông server cho cả cuộc gọi, nên ICE chỉ dùng khi không gì trực tiếp chạy. Thực tế một phần đáng kể cuộc gọi — sau tường lửa ngặt và NAT đối xứng — rốt cuộc được chuyển tiếp, lý do một app WebRTC production phải chạy hay thuê một máy chủ TURN dù phần lớn cuộc gọi không bao giờ chạm nó.</p>

<div class="pitfall co-tieu-de">
<p><strong>Signalling là việc của bạn — WebRTC không làm.</strong> WebRTC định nghĩa cách mang media, nhưng <em>không</em> định nghĩa cách hai bên lần đầu tìm thấy nhau và trao đổi mô tả phiên (<strong>SDP</strong> lời mời/câu trả lời) cùng các ứng viên ICE. Trao đổi đó — <strong>signalling</strong> — bạn tự dựng, và nó gần như luôn đi trên một kênh bạn đã có từ chương này: một <strong>WebSocket</strong> (thường socket.io). Một lỗi mới-học kinh điển là mong WebRTC "cứ thế nối hai trình duyệt"; nó sẽ không, cho tới khi bạn chuyển lời mời và ứng viên của chúng qua máy chủ signalling của chính bạn. WebRTC mang <strong>media</strong>; WebSocket của bạn mang <strong>phần dựng</strong>.</p>
</div>
${cauNoi('vi', { ...IO, bai: 'io-7-1-signalling', so: '7.1', ten: 'Signalling: socket.io làm gì trong video call', giong: 'trao đổi lời mời/câu trả lời SDP và ứng viên ICE để bắt đầu một cuộc gọi', khac: 'khoá Socket.IO dựng máy chủ signalling cụ thể bằng sự kiện socket.io', them: 'tầng bên dưới nó — STUN tìm ánh xạ NAT công cộng (đo thật), ICE thử ứng viên, và TURN chuyển tiếp khi trực tiếp thất bại' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> giải thích cho một đồng đội vì sao một cuộc gọi WebRTC đôi khi nối tức thì và đôi khi cần một chuyển tiếp — và bạn phải dựng gì.</p>
<ol>
<li>Trên lab, chạy yêu cầu STUN và đọc <code>XOR-MAPPED-ADDRESS</code>. Chỉ ra cổng công cộng khác cổng cục bộ thế nào và nói vì sao.</li>
<li>Mô tả, theo thứ tự, STUN, ICE và TURN mỗi cái đóng góp gì vào nối hai bên sau NAT.</li>
<li>Nói phần nào WebRTC xử lý và phần nào (signalling) bạn phải dựng, và qua kênh gì.</li>
<li>Kể loại NAT buộc một chuyển tiếp TURN.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được STUN tiết lộ ánh xạ công cộng (cổng đổi bởi NAT), ICE thử ứng viên để tìm một đường chạy, TURN chuyển tiếp khi không cái nào trực tiếp (NAT đối xứng), và signalling — trao đổi SDP + ứng viên, thường qua một WebSocket — là phần bạn hiện thực.</p>
<details><summary>Lời giải</summary>
<p>STUN trả ip:cổng công cộng của bạn; cổng khác cục bộ vì NAT ánh xạ nó. ICE thu ứng viên (cục bộ, ánh xạ STUN, TURN) và thử tới khi một cặp trao đổi được gói. TURN chuyển tiếp media khi không đường trực tiếp nào tồn tại, điều NAT đối xứng buộc bằng cách dùng một cổng công cộng khác mỗi đích. WebRTC mang media và làm STUN/ICE cho bạn qua <code>RTCPeerConnection</code>; <em>bạn</em> dựng signalling trao đổi lời mời/câu trả lời SDP và ứng viên ICE — thường qua một WebSocket.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Xuyên NAT (NAT traversal)', 'Đưa một kết nối qua NAT tới một bên không có địa chỉ công cộng.'],
  ['STUN', 'Một máy chủ nói cho bạn ánh xạ ip:cổng công cộng của bạn.'],
  ['XOR-MAPPED-ADDRESS', 'Trường câu trả lời STUN mang ánh xạ công cộng của bạn.'],
  ['ICE', 'Thu các địa chỉ ứng viên và thử chúng để tìm một đường chạy.'],
  ['TURN', 'Một máy chủ chuyển tiếp cho media khi không đường ngang hàng trực tiếp nào chạy.'],
  ['SDP', 'Mô tả phiên (codec, địa chỉ) các bên trao đổi để dựng.'],
  ['Signalling', 'Trao đổi SDP + ứng viên ICE giữa các bên — việc của bạn, qua vd một WebSocket.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai bên sau NAT không có địa chỉ công cộng để gọi — WebRTC đưa một <strong>dòng media P2P</strong> qua, chỉ chuyển tiếp khi buộc.</li>
<li><strong>STUN</strong> tiết lộ <strong>ánh xạ ip:cổng công cộng</strong> của bạn (cổng khác cục bộ = NAT dịch) — đo thật.</li>
<li><strong>ICE</strong> thu các địa chỉ ứng viên và thử chúng tới khi một cái nối — thường trực tiếp.</li>
<li><strong>TURN</strong> chuyển tiếp media khi không đường trực tiếp nào chạy (NAT ngặt/đối xứng); một app production phải có một cái.</li>
<li><strong>Signalling</strong> — trao đổi SDP + ứng viên — là việc của <strong>bạn</strong>, thường qua một WebSocket.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/API/WebRTC_API', '📘', 'MDN — WebRTC API', 'RTCPeerConnection, ICE, STUN/TURN và signalling bạn cung cấp.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8445.html', '📄', 'RFC 8445 — ICE', 'Cách các ứng viên được thu và kiểm để nối hai bên sau NAT.', 'Mở')}
${L('https://webrtcforthecurious.com/', '📘', 'WebRTC for the Curious', 'Một chuyến đi rõ ràng, trung lập qua STUN, ICE, TURN và signalling.', 'Mở')}
</div>
`,
};
