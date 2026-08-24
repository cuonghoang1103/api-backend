const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 7: WebRTC signalling.
 * Đo: call.socket.ts của kho có 275 dòng, 5 event (offer/answer/ice/end/reject).
 * Media qua WebRTC peer-to-peer, socket.io chỉ signalling.
 */

export default {
  title: 'Chapter 7 — WebRTC signalling with socket.io|||Chương 7 — WebRTC signalling với socket.io',
  slug: 'io-ch7-webrtc',
  description: 'Sáu bài về signalling video call. Socket.io CHỈ dùng cho offer/answer/ICE exchange; media stream đi qua WebRTC peer-to-peer. Đo trên call.socket.ts của kho.',
  sortOrder: 8,
  lessons: [

    {
      title: '7.1 — Signalling: what socket.io does in a video call|||7.1 — Signalling: socket.io làm gì trong video call',
      slug: 'io-7-1-signalling',
      type: 'VIDEO',
      description: 'Media (video/audio) đi qua WebRTC RTP peer-to-peer. Socket.io CHỈ giúp hai peer khám phá network address (ICE) và thoả thuận codec (SDP). Đó là ~5-20 packet cho cả call.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Signalling: what socket.io does in a video call</h2>
<p class="lead">A common misconception: &quot;video call uses socket.io for media&quot;. It does not. WebRTC handles media peer-to-peer. Socket.io only handles signalling — a handful of packets to get the two peers talking directly.</p>

<h3>The two layers</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">signalling</span><span class="lz-t">socket.io</span><span class="lz-d">Peer A tells server &quot;I want to call peer B&quot;. Server relays. A sends offer (SDP), B sends answer, both exchange ICE candidates. ~5-20 packets total, ~2 KB.</span></div>
<div class="lz-step"><span class="lz-k">media</span><span class="lz-t">WebRTC (RTP over UDP)</span><span class="lz-d">Once peers know each other&#39;s IP+port (via ICE), video/audio flows DIRECTLY between them. Server does not see the media at all. ~1-2 Mbps per stream.</span></div>
</div>

<div class="callout ok">
<p><strong>Đây là điểm quan trọng nhất cho scale.</strong> Nếu media qua server, 1.000 concurrent calls = 1-2 Gbps qua server. Nếu peer-to-peer, server chỉ cần đủ để signalling — vài KB per call. Same server có thể handle cả trăm nghìn calls.</p>
</div>

<h3>call.socket.ts — 5 event của kho này</h3>
<pre><code class="language-ts">// src/socket/call.socket.ts (275 dong)
socket.on('call:offer',  async ({ toUserId, sdp }) =&gt; { ... });
socket.on('call:answer', async ({ toUserId, sdp }) =&gt; { ... });
socket.on('call:ice',    async ({ toUserId, candidate }) =&gt; { ... });
socket.on('call:reject', async ({ toUserId }) =&gt; { ... });
socket.on('call:end',    async ({ toUserId }) =&gt; { ... });
</code></pre>

<p>Naming: <code>call:*</code> prefix (bài 3.5). Payload nhỏ (~500 byte). Không track state cho media — chỉ relay signalling messages.</p>

<h3>Call flow trên timeline</h3>
<pre><code class="language-text">t=0     User A press "call"
t=0.05  A -&gt; server: call:offer   {toUserId: B, sdp: "v=0\\r\\no=- ..."}
t=0.06  server -&gt; B: call:incoming {fromUserId: A, sdp: "..."}
        &lt;- B's UI shows incoming call
t=2.5   User B press "accept"
t=2.51  B -&gt; server: call:answer  {toUserId: A, sdp: "v=0\\r\\no=- ..."}
t=2.52  server -&gt; A: call:answered {sdp: "..."}
t=2.6   A -&gt; server: call:ice     {toUserId: B, candidate: "candidate:1 1 udp ..."}
t=2.6   server -&gt; B: call:ice     {fromUserId: A, candidate: "..."}
        (repeat: multiple ICE candidates, both directions)
t=3.0   ICE exchange done — peers ket noi truc tiep
t=3.0-∞ VIDEO / AUDIO qua WebRTC UDP truc tiep, server KHONG thay

t=125   User A press "end"
t=125.01 A -&gt; server: call:end
t=125.02 server -&gt; B: call:end
</code></pre>

<h3>Socket.io responsibilities</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Peer discovery</span><span class="lz-lnote">User A muốn call user B → server dùng room <code>user:B</code> để tìm B online</span></div>
<div class="lz-layer"><span class="lz-lname">Relay SDP + ICE</span><span class="lz-lnote">Chuyển tin giữa A và B khi họ chưa peer-to-peer connect được</span></div>
<div class="lz-layer"><span class="lz-lname">Ring notification</span><span class="lz-lnote">Emit <code>call:incoming</code>, <code>call:ringing</code> cho UI</span></div>
<div class="lz-layer"><span class="lz-lname">Cleanup on drop</span><span class="lz-lnote">Nếu A disconnect trong lúc gọi, server emit <code>call:end</code> cho B</span></div>
</div>

<h3>Socket.io KHÔNG làm</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Không mang media</span><span class="lz-lnote">Không có video/audio qua socket.io ever. Nếu bạn nghĩ dùng socket emit binary Buffer để &quot;stream video&quot;, đó là sai kiến trúc — Chương 8 giải thích</span></div>
<div class="lz-layer"><span class="lz-lname">Không lưu media</span><span class="lz-lnote">Recording call, nếu cần, phải làm ở peer (client-side MediaRecorder) hoặc dùng SFU/MCU server (khác socket.io hoàn toàn)</span></div>
<div class="lz-layer"><span class="lz-lname">Không TURN</span><span class="lz-lnote">Khi peers không thể P2P (NAT symmetric), cần TURN server relay media. TURN là dịch vụ RIÊNG — coturn, Xirsys — không phải socket.io</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thử &quot;stream video qua socket.io emit&quot;.</strong> Bạn <code>MediaRecorder.ondataavailable</code> Buffer 100 KB mỗi 100ms, emit qua socket.io. Cost: 8 Mbps qua server + latency 100-500ms + không có jitter buffer. Video vỡ, server chết. Đây là bài học đắt mà nhiều team đã học rồi rewrite bằng WebRTC.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Video call = WebRTC cho media (RTP over UDP peer-to-peer, ~1-2 Mbps per stream, server không thấy) + socket.io cho signalling (5-20 packet SDP/ICE relay, ~2 KB total, room <code>user:${'${uid}'}</code> để tìm peer) — nhầm hai tầng này là sai kiến trúc lớn.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC signalling</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling — chuẩn Mozilla, có full example.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 7.2 — SDP là gì</span><span class="lc-sub">/courses/socket-io/learn${REF} — nội dung của cái SDP mà socket.io relay.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Signalling: socket.io làm gì trong video call</h2>
<p class="lead">Một hiểu nhầm phổ biến: &quot;video call dùng socket.io cho media&quot;. Không. WebRTC xử lý media peer-to-peer. Socket.io chỉ xử lý signalling — vài chục packet để hai peer talking direct với nhau.</p>

<h3>Hai tầng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">signalling</span><span class="lz-t">socket.io</span><span class="lz-d">Peer A báo server &quot;muốn call peer B&quot;. Server relay. A gửi offer (SDP), B gửi answer, cả hai trao đổi ICE candidates. ~5-20 packet, ~2 KB.</span></div>
<div class="lz-step"><span class="lz-k">media</span><span class="lz-t">WebRTC (RTP over UDP)</span><span class="lz-d">Khi peers biết IP+port của nhau (qua ICE), video/audio đi TRỰC TIẾP giữa họ. Server không thấy media. ~1-2 Mbps per stream.</span></div>
</div>

<div class="callout ok">
<p><strong>Đây là điểm quan trọng nhất cho scale.</strong> Nếu media qua server, 1.000 concurrent call = 1-2 Gbps qua server. Nếu peer-to-peer, server chỉ signalling — vài KB per call. Cùng server handle được cả trăm nghìn call.</p>
</div>

<h3>call.socket.ts — 5 event của kho này</h3>
<pre><code class="language-ts">// src/socket/call.socket.ts (275 dong)
socket.on('call:offer',  async ({ toUserId, sdp }) =&gt; { ... });
socket.on('call:answer', async ({ toUserId, sdp }) =&gt; { ... });
socket.on('call:ice',    async ({ toUserId, candidate }) =&gt; { ... });
socket.on('call:reject', async ({ toUserId }) =&gt; { ... });
socket.on('call:end',    async ({ toUserId }) =&gt; { ... });
</code></pre>

<p>Naming: <code>call:*</code> prefix (bài 3.5). Payload nhỏ (~500 byte). Không track state cho media — chỉ relay signalling messages.</p>

<h3>Trách nhiệm của socket.io</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Peer discovery</span><span class="lz-lnote">User A muốn call user B → server dùng room <code>user:B</code> để tìm B online</span></div>
<div class="lz-layer"><span class="lz-lname">Relay SDP + ICE</span><span class="lz-lnote">Chuyển tin giữa A và B khi họ chưa peer-to-peer connect được</span></div>
<div class="lz-layer"><span class="lz-lname">Ring notification</span><span class="lz-lnote">Emit <code>call:incoming</code>, <code>call:ringing</code> cho UI</span></div>
<div class="lz-layer"><span class="lz-lname">Cleanup khi drop</span><span class="lz-lnote">Nếu A disconnect trong lúc gọi, server emit <code>call:end</code> cho B</span></div>
</div>

<h3>Socket.io KHÔNG làm</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Không mang media</span><span class="lz-lnote">Không có video/audio qua socket.io ever. Nếu bạn nghĩ dùng socket emit binary Buffer để &quot;stream video&quot;, đó là sai kiến trúc</span></div>
<div class="lz-layer"><span class="lz-lname">Không lưu media</span><span class="lz-lnote">Recording call phải làm ở peer (client-side MediaRecorder) hoặc dùng SFU/MCU server (khác socket.io hoàn toàn)</span></div>
<div class="lz-layer"><span class="lz-lname">Không TURN</span><span class="lz-lnote">Khi peers không P2P được (NAT symmetric), cần TURN server relay media. TURN là dịch vụ RIÊNG — coturn, Xirsys</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thử &quot;stream video qua socket.io emit&quot;.</strong> <code>MediaRecorder.ondataavailable</code> Buffer 100 KB mỗi 100ms, emit qua socket.io. Cost: 8 Mbps qua server + latency 100-500ms + không có jitter buffer. Video vỡ, server chết. Bài học đắt mà nhiều team đã học rồi rewrite bằng WebRTC.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Video call = WebRTC cho media (RTP over UDP peer-to-peer, ~1-2 Mbps per stream, server không thấy) + socket.io cho signalling (5-20 packet SDP/ICE relay, ~2 KB total) — nhầm hai tầng này là sai kiến trúc lớn.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC signalling</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling — chuẩn Mozilla, có full example.</span></span></div>
</div>
`,
    },

    {
      title: '7.2 — SDP and ICE: what is in the packets you relay|||7.2 — SDP và ICE: cái trong packet bạn relay',
      slug: 'io-7-2-sdp-ice',
      type: 'VIDEO',
      description: 'SDP là text đề xuất codec + audio/video setup. ICE candidate là IP+port để peer thử kết nối. Bạn không phải parse — chỉ relay.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>SDP and ICE: what is in the packets you relay</h2>
<p class="lead">Your server never modifies SDP or ICE — just relays. But you should read one at least once so &quot;why WebRTC needs signalling&quot; makes sense.</p>

<h3>SDP — Session Description Protocol</h3>
<pre><code class="language-text">v=0
o=- 4611751892845391000 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE 0 1
m=audio 9 UDP/TLS/RTP/SAVPF 111 103
a=rtpmap:111 opus/48000/2
a=rtcp-fb:111 transport-cc
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98
a=rtpmap:96 VP8/90000
a=rtpmap:97 VP9/90000
a=rtcp-fb:96 ccm fir
a=setup:actpass
a=ice-ufrag:F7gI
a=ice-pwd:x9cml/YzichV2+XlhiMu8g
...
</code></pre>

<p>Text plain, 1-3 KB. Có ~50 dòng thông tin: codec (opus, VP8, VP9), bitrate, resolution, DTLS keys, ICE credentials. Peer A gửi &quot;offer&quot; SDP, peer B gửi &quot;answer&quot; SDP — thoả thuận cái gì cả hai support.</p>

<h3>ICE — Interactive Connectivity Establishment</h3>
<pre><code class="language-text">candidate:842163049 1 udp 1677729535 192.168.1.42 51234 typ srflx
candidate:1467250027 1 udp 2113937151 10.0.0.5 52111 typ host
candidate:1855263000 1 tcp 1518280447 66.11.12.13 9 typ relay
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">host</span><span class="lz-lnote">IP local của peer (10.0.0.5:52111). Peer khác thử connect — thành công nếu cùng LAN</span></div>
<div class="lz-layer"><span class="lz-lname">srflx (server reflexive)</span><span class="lz-lnote">IP public của peer nhìn từ STUN server (192.168.1.42:51234). Cần khi NAT — peer khác thử connect</span></div>
<div class="lz-layer"><span class="lz-lname">relay (TURN)</span><span class="lz-lnote">IP của TURN server (66.11.12.13:9). Nếu srflx không work (NAT symmetric), fall back TURN relay</span></div>
</div>

<h3>Server relay pattern</h3>
<pre><code class="language-ts">socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:\${toUserId}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });   // recipient offline
  }
  io.to(target).emit('call:incoming', {
    fromUserId: socket.data.userId,
    sdp,
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Server không parse SDP. Không kiểm codec. Không đổi ICE.</strong> Chỉ relay. Đây là điểm hay nhất của architecture WebRTC — server dumb, peers smart.</p>
</div>

<h3>Trickle ICE — vì sao ICE là nhiều event</h3>
<pre><code class="language-text">Client-side WebRTC gathering ICE candidates asynchronously:
  t=0     onicecandidate: host      -&gt; emit call:ice
  t=100   onicecandidate: srflx     -&gt; emit call:ice
  t=500   onicecandidate: relay     -&gt; emit call:ice
  t=2000  onicecandidate: null      -&gt; done gathering

Peer khac nhan tung candidate và thu connect ngay khi co du.
Neu doi cho het candidate roi mới gui, se lag them 2s.
</code></pre>

<h3>Debug — inspect SDP</h3>
<pre><code class="language-tsx">// Client-side, sau khi tao offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
console.log(offer.sdp);
// Copy-paste vao webrtc-experiment.com/DetectRTC de parse
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — modify SDP ở server để &quot;force H.264&quot;.</strong> SDP munging phổ biến trong WebRTC docs cũ. Ở modern SDP + Unified Plan, nó thường vỡ codec negotiation. Nếu bạn PHẢI force codec, dùng <code>RTCRtpTransceiver.setCodecPreferences()</code> phía client, không parse SDP text.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> SDP (1-3 KB text) mô tả codec + audio/video setup mà peer đưa ra, ICE candidates (~50 byte mỗi cái) là các cách kết nối network (host/srflx/relay) mà peer thử — server socket.io chỉ RELAY, không parse hay modify, và trickle ICE cho phép candidates đến dần thay vì đợi cả list.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC connectivity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity — cách ICE hoạt động, kèm sơ đồ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8829 — JSEP</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc8829 — chuẩn cho JavaScript Session Establishment.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>SDP và ICE: cái trong packet bạn relay</h2>
<p class="lead">Server bạn không bao giờ modify SDP hay ICE — chỉ relay. Nhưng bạn nên đọc một lần để &quot;vì sao WebRTC cần signalling&quot; có nghĩa.</p>

<h3>SDP — Session Description Protocol</h3>
<pre><code class="language-text">v=0
o=- 4611751892845391000 2 IN IP4 127.0.0.1
s=-
m=audio 9 UDP/TLS/RTP/SAVPF 111 103
a=rtpmap:111 opus/48000/2
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98
a=rtpmap:96 VP8/90000
a=rtpmap:97 VP9/90000
a=ice-ufrag:F7gI
...
</code></pre>

<p>Text plain, 1-3 KB. ~50 dòng thông tin: codec (opus, VP8, VP9), bitrate, resolution, DTLS keys, ICE credentials. Peer A gửi &quot;offer&quot; SDP, peer B gửi &quot;answer&quot; SDP — thoả thuận cái gì cả hai support.</p>

<h3>ICE — Interactive Connectivity Establishment</h3>
<pre><code class="language-text">candidate:842163049 1 udp 1677729535 192.168.1.42 51234 typ srflx
candidate:1467250027 1 udp 2113937151 10.0.0.5 52111 typ host
candidate:1855263000 1 tcp 1518280447 66.11.12.13 9 typ relay
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">host</span><span class="lz-lnote">IP local của peer. Peer khác thử connect — thành công nếu cùng LAN</span></div>
<div class="lz-layer"><span class="lz-lname">srflx (server reflexive)</span><span class="lz-lnote">IP public của peer nhìn từ STUN server. Cần khi NAT — peer khác thử connect</span></div>
<div class="lz-layer"><span class="lz-lname">relay (TURN)</span><span class="lz-lnote">IP của TURN server. Nếu srflx không work (NAT symmetric), fall back TURN relay</span></div>
</div>

<h3>Pattern relay ở server</h3>
<pre><code class="language-ts">socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:${'${toUserId}'}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });
  }
  io.to(target).emit('call:incoming', {
    fromUserId: socket.data.userId,
    sdp,
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Server không parse SDP. Không kiểm codec. Không đổi ICE.</strong> Chỉ relay. Đây là điểm hay nhất của architecture WebRTC — server dumb, peers smart.</p>
</div>

<h3>Trickle ICE — vì sao ICE là nhiều event</h3>
<pre><code class="language-text">Client-side WebRTC gathering ICE candidates asynchronously:
  t=0     onicecandidate: host      -&gt; emit call:ice
  t=100   onicecandidate: srflx     -&gt; emit call:ice
  t=500   onicecandidate: relay     -&gt; emit call:ice
  t=2000  onicecandidate: null      -&gt; done gathering

Peer khac nhan tung candidate va thu connect ngay khi co du.
Neu doi cho het candidate roi moi gui, se lag them 2s.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — modify SDP ở server để &quot;force H.264&quot;.</strong> SDP munging phổ biến trong WebRTC docs cũ. Ở modern SDP + Unified Plan, nó thường vỡ codec negotiation. Nếu bạn PHẢI force codec, dùng <code>RTCRtpTransceiver.setCodecPreferences()</code> phía client, không parse SDP text.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> SDP (1-3 KB text) mô tả codec + audio/video setup mà peer đưa ra, ICE candidates (~50 byte mỗi cái) là các cách kết nối network (host/srflx/relay) mà peer thử — server socket.io chỉ RELAY, không parse hay modify.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC connectivity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity — cách ICE hoạt động, kèm sơ đồ.</span></span></div>
</div>
`,
    },

    {
      title: '7.3 — Room semantics: incoming, ringing, busy|||7.3 — Room semantics: incoming, ringing, busy',
      slug: 'io-7-3-room-call',
      type: 'VIDEO',
      description: '`call:incoming` đến room `user:${toUserId}` để bắt mọi tab của recipient. Kho này còn kiểm `socket.rooms.has("thread:X")` để tránh spam.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Room semantics: incoming, ringing, busy</h2>
<p class="lead">A call event routes to a person, not a socket. This lesson traces how this repo uses rooms to find who to notify, and why the pattern is more nuanced than <code>io.to(user).emit</code>.</p>

<h3>The basic case</h3>
<pre><code class="language-ts">// Recipient online — deliver call:incoming
socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:\${toUserId}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });   // offline
  }
  io.to(target).emit('call:incoming', { fromUserId: socket.data.userId, sdp });
});
</code></pre>

<p>Room <code>user:42</code> đưa <code>call:incoming</code> đến MỌI tab của user 42. UI mỗi tab hiện dialog &quot;incoming call&quot;.</p>

<h3>Kho này thêm layer — thread-based filtering</h3>
<pre><code class="language-ts">// call.socket.ts:132
const inThread = socket.rooms.has(&#96;thread:\${threadId}&#96;);
// Chi ai dang MO thread do moi nhan call notification tren tab do
</code></pre>

<p>Vì sao? Nếu user có 5 tab và chỉ 1 tab đang mở chat với người gọi, bạn không muốn call dialog pop lên trên MỌI tab. Chỉ tab của thread. Xoá &quot;phiền&quot; UX.</p>

<h3>Ba trạng thái call</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">busy</span><span class="lz-nsub">recipient hoàn toàn offline</span></span>
<span class="lz-nbody">Room <code>user:B</code> size 0. Server emit <code>call:busy</code> cho caller. UI caller hiển thị &quot;Not available&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ringing</span><span class="lz-nsub">recipient online, đang chờ answer</span></span>
<span class="lz-nbody">Server emit <code>call:incoming</code> cho B, và emit <code>call:ringing</code> cho A để A biết B đã nhận notification. UI A hiển thị &quot;Ringing...&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">answered / rejected</span><span class="lz-nsub">B đã tương tác</span></span>
<span class="lz-nbody">B emit <code>call:answer</code> (accept) hoặc <code>call:reject</code>. Server relay cho A. Ringing UI đổi thành connected hoặc dismissed.</span>
</div>
</div>

<h3>Timeout ringing</h3>
<pre><code class="language-ts">// Client-side: neu ringing > 30s, tu cancel
useEffect(() =&gt; {
  if (callState === 'ringing') {
    const timer = setTimeout(() =&gt; {
      socket.emit('call:end', { toUserId });
      setCallState('missed');
    }, 30000);
    return () =&gt; clearTimeout(timer);
  }
}, [callState]);
</code></pre>

<h3>Cleanup khi caller disconnect</h3>
<pre><code class="language-ts">socket.on('disconnect', () =&gt; {
  // Neu socket nay dang trong call, notify peer
  const activeCalls = getActiveCallsForSocket(socket.id);
  for (const call of activeCalls) {
    io.to(&#96;user:\${call.peerUserId}&#96;).emit('call:end', {
      reason: 'peer-disconnected',
    });
  }
});
</code></pre>

<div class="callout warn">
<p><strong>Không có handler này, call ghosts.</strong> Caller crash trình duyệt trong lúc gọi. Recipient vẫn thấy &quot;connecting&quot;. Không bao giờ được notify. UI stuck vô hạn. Fix: track active call cho mỗi socket, cleanup on disconnect.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng socket ID để track call thay vì userId.</strong> Reconnect = sid mới = call bị mất. Track theo <code>callId</code> (UUID) + userId. Bài 1.5 pattern áp lại.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Room <code>user:${'${uid}'}</code> route call notifications đến mọi tab của recipient; kho này lọc thêm bằng <code>socket.rooms.has(&quot;thread:X&quot;)</code> để không spam mọi tab; ba trạng thái (busy/ringing/answered-rejected) map thành 3-4 events; và cleanup on disconnect quan trọng để call không ghost.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern user:${'${uid}'} là căn bản.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Room semantics: incoming, ringing, busy</h2>
<p class="lead">Một call event route đến MỘT NGƯỜI, không phải một socket. Bài này trace cách kho này dùng room để tìm ai notify, và tại sao pattern tinh tế hơn <code>io.to(user).emit</code>.</p>

<h3>Trường hợp cơ bản</h3>
<pre><code class="language-ts">socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:${'${toUserId}'}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });
  }
  io.to(target).emit('call:incoming', { fromUserId: socket.data.userId, sdp });
});
</code></pre>

<p>Room <code>user:42</code> đưa <code>call:incoming</code> đến MỌI tab của user 42.</p>

<h3>Kho này thêm layer — thread-based filtering</h3>
<pre><code class="language-ts">// call.socket.ts:132
const inThread = socket.rooms.has(&#96;thread:${'${threadId}'}&#96;);
// Chi ai dang MO thread do moi nhan call notification tren tab do
</code></pre>

<p>Vì sao? Nếu user có 5 tab và chỉ 1 tab đang mở chat với người gọi, bạn không muốn call dialog pop trên MỌI tab. Chỉ tab của thread. Xoá &quot;phiền&quot; UX.</p>

<h3>Ba trạng thái call</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">busy</span><span class="lz-nsub">recipient offline hoàn toàn</span></span>
<span class="lz-nbody">Room <code>user:B</code> size 0. Server emit <code>call:busy</code> cho caller. UI caller &quot;Not available&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ringing</span><span class="lz-nsub">recipient online, đang chờ answer</span></span>
<span class="lz-nbody">Server emit <code>call:incoming</code> cho B, emit <code>call:ringing</code> cho A. UI A &quot;Ringing...&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">answered / rejected</span><span class="lz-nsub">B đã tương tác</span></span>
<span class="lz-nbody">B emit <code>call:answer</code> hoặc <code>call:reject</code>. Server relay cho A.</span>
</div>
</div>

<h3>Timeout ringing</h3>
<pre><code class="language-ts">// Client-side: neu ringing > 30s, tu cancel
useEffect(() =&gt; {
  if (callState === 'ringing') {
    const timer = setTimeout(() =&gt; {
      socket.emit('call:end', { toUserId });
      setCallState('missed');
    }, 30000);
    return () =&gt; clearTimeout(timer);
  }
}, [callState]);
</code></pre>

<h3>Cleanup khi caller disconnect</h3>
<pre><code class="language-ts">socket.on('disconnect', () =&gt; {
  const activeCalls = getActiveCallsForSocket(socket.id);
  for (const call of activeCalls) {
    io.to(&#96;user:${'${call.peerUserId}'}&#96;).emit('call:end', {
      reason: 'peer-disconnected',
    });
  }
});
</code></pre>

<div class="callout warn">
<p><strong>Không có handler này, call ghosts.</strong> Caller crash trình duyệt trong lúc gọi. Recipient vẫn thấy &quot;connecting&quot;. Không bao giờ được notify. UI stuck vô hạn.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng socket ID để track call thay vì userId.</strong> Reconnect = sid mới = call bị mất. Track theo <code>callId</code> (UUID) + userId.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Room <code>user:${'${uid}'}</code> route call notifications đến mọi tab; kho này lọc thêm bằng <code>socket.rooms.has(&quot;thread:X&quot;)</code>; ba trạng thái (busy/ringing/answered-rejected) map thành 3-4 events; cleanup on disconnect quan trọng để call không ghost.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn — pattern user:${'${uid}'} là căn bản.</span></span></div>
</div>
`,
    },

    {
      title: '7.4 — TURN and NAT: when peer-to-peer fails|||7.4 — TURN và NAT: khi peer-to-peer thất bại',
      slug: 'io-7-4-turn',
      type: 'VIDEO',
      description: 'Symmetric NAT (một số corp/mobile network) chặn P2P. Cần TURN server relay media — đó là service riêng, không phải socket.io. Cost đáng kể vì server phải handle media bytes.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>TURN and NAT: when peer-to-peer fails</h2>
<p class="lead">7.1 said &quot;media goes P2P&quot;. That&#39;s the 85% case. 15% of the time NAT prevents it, and you need a TURN server to relay. This lesson explains when and what it costs.</p>

<h3>NAT — four types</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Full-cone NAT</span><span class="lz-d">Public IP:port maps consistently. STUN discovery works. P2P easy. Home routers typical.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Restricted NAT</span><span class="lz-d">Public port maps for known destinations. P2P works if both peers punch through simultaneously. Most consumer routers.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Port-restricted NAT</span><span class="lz-d">Stricter — checks source port too. P2P works with more retries.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Symmetric NAT</span><span class="lz-d">Public IP:port DIFFERENT for each destination. STUN can&#39;t predict — P2P impossible. Common in corporate + some mobile carriers.</span></div>
</div>

<div class="out">Uoc luong global:
  Full-cone + Restricted: 70-80% users
  Port-restricted:        10-15% users
  Symmetric:              5-15% users (cao hon o corporate + mobile)
</div>

<h3>TURN — Traversal Using Relays around NAT</h3>
<pre><code class="language-text">Khi P2P fail, TURN relay:

Peer A -&gt; TURN server -&gt; Peer B
                        &lt;-
                       (media qua server)

Cost: TURN server nhan + resend TOAN BO media bytes.
1 call = ~2 Mbps qua TURN server.
1.000 calls = 2 Gbps.
</code></pre>

<h3>Cost thật của TURN service</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tự host (coturn)</span><span class="lz-nsub">setup vài giờ</span></span>
<span class="lz-nbody">Cấu hình coturn trên VPS, mở port 3478 UDP + 5349 TLS. Cost: bandwidth server. VN VPS: ~$5/Mbps/tháng. 1 Gbps = $5.000/tháng chỉ cho TURN.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">managed TURN (Xirsys, Twilio)</span><span class="lz-nsub">$0.4-1.5/GB traffic</span></span>
<span class="lz-nbody">Không setup, tính theo GB. 10.000 phút call/tháng × 30 MB/min = 300 GB = $120-450/tháng. Cheap ở small scale, đắt ở large.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">không có TURN</span><span class="lz-nsub">chấp nhận 15% call fail</span></span>
<span class="lz-nbody">Cho app cá nhân / thử nghiệm, có thể không cần. 15% call giữa symmetric NAT peers sẽ không kết nối được. Users báo bug.</span>
</div>
</div>

<h3>WebRTC config với TURN</h3>
<pre><code class="language-tsx">const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },       // STUN free
    {
      urls: 'turn:turn.example.com:3478',
      username: 'call-42',                            // credential 1-time
      credential: 'xyz...',
    },
  ],
  iceTransportPolicy: 'all',   // hoac 'relay' de FORCE TURN (test)
});
</code></pre>

<h3>Credential rotation cho TURN</h3>
<pre><code class="language-ts">// Server: sinh credential ngan han truoc moi call
socket.on('call:request-ice-servers', async (ack) =&gt; {
  const username = &#96;\${socket.data.userId}-\${Date.now()}&#96;;
  const credential = hmac(TURN_SECRET, username);   // TIME-limited
  ack({ iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478', username, credential },
  ]});
});
</code></pre>

<div class="callout ok">
<p><strong>Không share TURN credential static.</strong> Sinh short-lived (10 phút) per user. Nếu leak, không dùng được lâu. coturn hỗ trợ HMAC-based auth.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng free public TURN cho production.</strong> Có nhiều &quot;free TURN&quot; online nhưng chúng slow, unreliable, và có thể ăn cắp media. Chỉ dùng cho dev. Production phải có TURN riêng.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> 15% users sau symmetric NAT không kết nối P2P được và cần TURN server relay media — cost TURN đáng kể (bandwidth × 2 Mbps per call), managed service (Xirsys/Twilio) rẻ ở small scale nhưng đắt ở large, self-host coturn rẻ nhưng phải setup + monitor; credential rotation TURN quan trọng để không bị abuse.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">coturn — self-hosted TURN</span><span class="lc-sub">github.com/coturn/coturn — open source, cấu hình phổ biến.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 5766 — TURN</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc5766 — spec chính thức.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>TURN và NAT: khi peer-to-peer thất bại</h2>
<p class="lead">7.1 nói &quot;media qua P2P&quot;. Đó là trường hợp 85%. 15% thời gian NAT chặn nó, và bạn cần TURN server relay. Bài này giải thích khi nào và cost bao nhiêu.</p>

<h3>NAT — bốn loại</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Full-cone NAT</span><span class="lz-d">Public IP:port maps consistent. STUN discovery works. P2P dễ. Home router phổ biến.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Restricted NAT</span><span class="lz-d">Public port maps cho destination biết. P2P works nếu cả hai peer đục xuyên đồng thời.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Port-restricted NAT</span><span class="lz-d">Chặt hơn — kiểm source port. P2P works với nhiều retry.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Symmetric NAT</span><span class="lz-d">Public IP:port KHÁC cho mỗi destination. STUN không predict — P2P impossible. Phổ biến ở corporate + một số mobile carrier.</span></div>
</div>

<div class="out">Uoc luong global:
  Full-cone + Restricted: 70-80% users
  Port-restricted:        10-15% users
  Symmetric:              5-15% users (cao hon o corporate + mobile)
</div>

<h3>TURN — Traversal Using Relays around NAT</h3>
<pre><code class="language-text">Khi P2P fail, TURN relay:

Peer A -&gt; TURN server -&gt; Peer B
                        &lt;-
                       (media qua server)

Cost: TURN server nhan + resend TOAN BO media bytes.
1 call = ~2 Mbps qua TURN server.
1.000 calls = 2 Gbps.
</code></pre>

<h3>Cost thật của TURN service</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tự host (coturn)</span><span class="lz-nsub">setup vài giờ</span></span>
<span class="lz-nbody">Cấu hình coturn trên VPS, mở port 3478 UDP + 5349 TLS. Cost: bandwidth. VN VPS: ~$5/Mbps/tháng. 1 Gbps = $5.000/tháng chỉ cho TURN.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">managed TURN (Xirsys, Twilio)</span><span class="lz-nsub">$0.4-1.5/GB traffic</span></span>
<span class="lz-nbody">Không setup, tính theo GB. 10.000 phút call/tháng × 30 MB/min = 300 GB = $120-450/tháng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">không có TURN</span><span class="lz-nsub">chấp nhận 15% call fail</span></span>
<span class="lz-nbody">Cho app cá nhân / thử nghiệm, có thể không cần. 15% call giữa symmetric NAT peers sẽ không kết nối được.</span>
</div>
</div>

<h3>WebRTC config với TURN</h3>
<pre><code class="language-tsx">const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:turn.example.com:3478',
      username: 'call-42',
      credential: 'xyz...',
    },
  ],
  iceTransportPolicy: 'all',
});
</code></pre>

<h3>Credential rotation cho TURN</h3>
<pre><code class="language-ts">// Server: sinh credential ngan han truoc moi call
socket.on('call:request-ice-servers', async (ack) =&gt; {
  const username = &#96;${'${socket.data.userId}'}-${'${Date.now()}'}&#96;;
  const credential = hmac(TURN_SECRET, username);
  ack({ iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478', username, credential },
  ]});
});
</code></pre>

<div class="callout ok">
<p><strong>Không share TURN credential static.</strong> Sinh short-lived (10 phút) per user. Nếu leak, không dùng được lâu. coturn hỗ trợ HMAC-based auth.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng free public TURN cho production.</strong> Có nhiều &quot;free TURN&quot; online nhưng chúng slow, unreliable, có thể ăn cắp media. Chỉ dùng cho dev. Production phải có TURN riêng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> 15% users sau symmetric NAT không kết nối P2P và cần TURN server relay media — cost đáng kể (bandwidth × 2 Mbps per call), managed rẻ ở small scale nhưng đắt ở large, self-host coturn rẻ nhưng phải setup + monitor; credential rotation TURN quan trọng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">coturn — self-hosted TURN</span><span class="lc-sub">github.com/coturn/coturn — open source, cấu hình phổ biến.</span></span></div>
</div>
`,
    },

    {
      title: '7.5 — Group calls: SFU is a different beast|||7.5 — Group call: SFU là con thú khác',
      slug: 'io-7-5-sfu',
      type: 'VIDEO',
      description: 'P2P mesh với N=4 là 12 connection và 8 Mbps upload per peer. Group calls cần SFU (Selective Forwarding Unit) — server nhận N stream, forward N-1 lần. Không phải socket.io.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Group calls: SFU is a different beast</h2>
<p class="lead">1-on-1 calls are simple P2P. Group calls (3+ peers) explode in complexity. This lesson shows the math and names the three architectures.</p>

<h3>Three architectures</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Mesh (P2P full)</span><span class="lz-nsub">N=2 OK, N=4 lag</span></span>
<span class="lz-nbody">Mỗi peer connect trực tiếp với mọi peer khác. N peers = N*(N-1) connections. Upload cost: (N-1) × stream bitrate PER peer. Với N=4, mỗi peer upload 3 stream = ~6-9 Mbps. Consumer internet không chịu nổi.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SFU (Selective Forwarding Unit)</span><span class="lz-nsub">chuẩn cho small groups</span></span>
<span class="lz-nbody">Mỗi peer upload 1 stream lên server SFU. Server FORWARD stream đó đến N-1 peers khác. Server không encode/decode — chỉ route. Cost server: N × stream × 2 (in + out). 10 group × 10 peers × 1 Mbps = 200 Mbps.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">MCU (Multipoint Conferencing Unit)</span><span class="lz-nsub">large groups, high server cost</span></span>
<span class="lz-nbody">Server decode mọi stream, mix thành MỘT stream composite, encode lại, gửi 1 stream cho mỗi peer. Cost CPU cao — bandwidth thấp phía client. Không phổ biến vì SFU + client-side layout đủ.</span>
</div>
</div>

<h3>Math của mesh</h3>
<pre><code class="language-text">N peers, moi peer video 1 Mbps

Mesh:
  connections: N*(N-1) = O(N^2)
  upload/peer: (N-1) Mbps
  N=2: 2 connections, 1 Mbps upload
  N=4: 12 connections, 3 Mbps upload (LAG bat dau)
  N=8: 56 connections, 7 Mbps upload (KHONG chay noi tren consumer internet)

SFU:
  connections/peer: 1 (up) + 1 (down aggregated)
  upload/peer: 1 Mbps
  server bandwidth: N * (in) + N * (N-1) * (out) = O(N^2) at server
  N=8: server = 8 in + 56 out = 64 Mbps

SFU shifts N^2 cost TU peer sang server.
</code></pre>

<h3>SFU implementations phổ biến</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mediasoup (open source, Node.js)</span><span class="lz-lnote">Rất mạnh, TypeScript API. Docs OK. Kho này CÓ thể dùng nếu group call — chưa. mediasoup.org</span></div>
<div class="lz-layer"><span class="lz-lname">Janus Gateway (open source, C)</span><span class="lz-lnote">Đa năng, plugin-based. Ổn định 10 năm. janus.conf.meetecho.com</span></div>
<div class="lz-layer"><span class="lz-lname">LiveKit (open source, Go, managed available)</span><span class="lz-lnote">Modern, cloud-native, SDK đầy đủ. Rất phổ biến hiện nay. livekit.io</span></div>
<div class="lz-layer"><span class="lz-lname">Managed (Daily.co, Twilio Video, Zoom SDK)</span><span class="lz-lnote">Không dựng infra. $0.001-0.01 per minute per user. Setup nhanh, cost cao ở scale</span></div>
</div>

<h3>Socket.io vẫn dùng cho SIGNALLING</h3>
<pre><code class="language-ts">// Socket.io signalling giua peers va SFU vẫn giong 1-on-1
socket.on('room:join', async ({ roomId }) =&gt; {
  const publishTransport = await sfu.createWebRtcTransport();
  socket.emit('room:transport-params', publishTransport.params);
  // ... more setup: subscribe existing producers, notify others of new peer
});
</code></pre>

<p>Socket.io là control plane (join room, publish/subscribe transports). SFU là data plane (media). Hai component riêng.</p>

<div class="pitfall">
<p><strong>Bẫy — thử build SFU từ đầu.</strong> WebRTC SFU cần hiểu RTP, RTCP, DTLS-SRTP, codec-specific packet handling. Vài chục nghìn dòng C++. Dùng mediasoup, Janus, LiveKit. Đừng viết lại.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Mesh N-peer P2P chỉ scale tới N=2-3 (upload cost O(N)); group calls cần SFU (server route media, cost server O(N²), peer O(1)) — kho này chưa có group call nhưng nếu thêm phải chọn mediasoup/LiveKit/managed service; socket.io vẫn dùng cho signalling giữa peer và SFU, không thay đổi.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mediasoup — SFU</span><span class="lc-sub">mediasoup.org — Node.js SFU, best for building on top.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">LiveKit — modern OSS SFU</span><span class="lc-sub">livekit.io — deploy Go SFU + JavaScript/mobile SDK.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Group call: SFU là con thú khác</h2>
<p class="lead">1-on-1 call là P2P đơn giản. Group call (3+ peers) explode về complexity. Bài này chỉ ra math và đặt tên ba architecture.</p>

<h3>Ba architecture</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Mesh (P2P full)</span><span class="lz-nsub">N=2 OK, N=4 lag</span></span>
<span class="lz-nbody">Mỗi peer connect trực tiếp với mọi peer khác. N peers = N*(N-1) connections. Upload cost: (N-1) × stream bitrate PER peer. Với N=4, mỗi peer upload 3 stream = ~6-9 Mbps. Consumer internet không chịu nổi.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SFU</span><span class="lz-nsub">chuẩn cho small groups</span></span>
<span class="lz-nbody">Mỗi peer upload 1 stream lên server SFU. Server FORWARD stream đó đến N-1 peers khác. Server không encode/decode — chỉ route. Cost server: N × stream × 2 (in + out).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">MCU</span><span class="lz-nsub">large groups, high server cost</span></span>
<span class="lz-nbody">Server decode mọi stream, mix thành MỘT stream composite, encode lại, gửi 1 stream cho mỗi peer. Cost CPU cao — bandwidth thấp phía client. Không phổ biến vì SFU + client-side layout đủ.</span>
</div>
</div>

<h3>Math của mesh</h3>
<pre><code class="language-text">N peers, moi peer video 1 Mbps

Mesh:
  connections: N*(N-1) = O(N^2)
  upload/peer: (N-1) Mbps
  N=2: 2 connections, 1 Mbps upload
  N=4: 12 connections, 3 Mbps upload (LAG bat dau)
  N=8: 56 connections, 7 Mbps upload (KHONG chay noi)

SFU:
  connections/peer: 1 (up) + 1 (down aggregated)
  upload/peer: 1 Mbps
  server bandwidth: N * (in) + N * (N-1) * (out) = O(N^2) at server
  N=8: server = 8 in + 56 out = 64 Mbps

SFU shifts N^2 cost TU peer sang server.
</code></pre>

<h3>SFU implementations phổ biến</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mediasoup (open source, Node.js)</span><span class="lz-lnote">Rất mạnh, TypeScript API. Docs OK. mediasoup.org</span></div>
<div class="lz-layer"><span class="lz-lname">Janus Gateway (open source, C)</span><span class="lz-lnote">Đa năng, plugin-based. Ổn định 10 năm. janus.conf.meetecho.com</span></div>
<div class="lz-layer"><span class="lz-lname">LiveKit (open source, Go, managed available)</span><span class="lz-lnote">Modern, cloud-native, SDK đầy đủ. Rất phổ biến hiện nay. livekit.io</span></div>
<div class="lz-layer"><span class="lz-lname">Managed (Daily.co, Twilio Video, Zoom SDK)</span><span class="lz-lnote">Không dựng infra. $0.001-0.01 per minute per user.</span></div>
</div>

<h3>Socket.io vẫn dùng cho SIGNALLING</h3>
<pre><code class="language-ts">// Socket.io signalling giua peers va SFU van giong 1-on-1
socket.on('room:join', async ({ roomId }) =&gt; {
  const publishTransport = await sfu.createWebRtcTransport();
  socket.emit('room:transport-params', publishTransport.params);
  // ... more setup: subscribe existing producers, notify others of new peer
});
</code></pre>

<p>Socket.io là control plane. SFU là data plane. Hai component riêng.</p>

<div class="pitfall">
<p><strong>Bẫy — thử build SFU từ đầu.</strong> WebRTC SFU cần hiểu RTP, RTCP, DTLS-SRTP, codec-specific packet handling. Vài chục nghìn dòng C++. Dùng mediasoup, Janus, LiveKit. Đừng viết lại.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mesh N-peer P2P chỉ scale tới N=2-3; group calls cần SFU (server route media, cost server O(N²), peer O(1)) — kho này chưa có group call nhưng nếu thêm phải chọn mediasoup/LiveKit/managed service; socket.io vẫn dùng cho signalling giữa peer và SFU.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mediasoup — SFU</span><span class="lc-sub">mediasoup.org — Node.js SFU, best for building on top.</span></span></div>
</div>
`,
    },

    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'io-7-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về signalling vs media, SDP/ICE, room semantics, TURN, SFU.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>What Chapter 7 established</h2>
<p class="lead">Sáu câu về WebRTC signalling. Điểm quan trọng nhất: socket.io signalling ~2 KB, WebRTC media 1-2 Mbps P2P — nếu bạn gộp hai cái, kiến trúc sai.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Chương 7 đã dựng được gì</h2>
<p class="lead">Sáu câu về WebRTC signalling. Điểm quan trọng nhất: socket.io signalling ~2 KB, WebRTC media 1-2 Mbps P2P — nếu bạn gộp hai cái, kiến trúc sai.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'In a 1-on-1 video call, how does the media (video/audio) travel?|||Trong call 1-on-1, media (video/audio) đi thế nào?',
            options: [
              'Peer-to-peer over WebRTC (RTP/UDP direct between browsers); socket.io only relays ~5-20 signalling packets (SDP + ICE) to help peers find each other|||Peer-to-peer qua WebRTC (RTP/UDP trực tiếp giữa browsers); socket.io chỉ relay ~5-20 signalling packet (SDP + ICE) để giúp peer tìm nhau',
              'Through the socket.io server as binary emit|||Qua server socket.io dạng binary emit',
              'Through a media broker like Kafka|||Qua media broker như Kafka',
              'Via HTTP long-polling|||Qua HTTP long-polling',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the server do with the SDP packet received via <code>call:offer</code>?|||Server làm gì với packet SDP nhận qua <code>call:offer</code>?',
            options: [
              'Just relay it to the target user (io.to("user:B").emit("call:incoming", { sdp })). Do NOT parse, do NOT modify — SDP munging usually breaks modern WebRTC|||Chỉ relay đến user đích (io.to("user:B").emit("call:incoming", { sdp })). KHÔNG parse, KHÔNG modify — SDP munging thường vỡ WebRTC modern',
              'Parse and validate codecs before forwarding|||Parse và validate codec trước khi forward',
              'Store in Redis for later replay|||Lưu vào Redis để replay sau',
              'Encrypt with the recipient\'s public key|||Encrypt với public key của recipient',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Approximately 15% of users on symmetric NAT cannot connect P2P. What do they need?|||Khoảng 15% users trên symmetric NAT không kết nối P2P được. Họ cần gì?',
            options: [
              'A TURN server that relays media between them — separate infrastructure (coturn self-hosted or Xirsys/Twilio managed) with bandwidth costs, NOT socket.io|||TURN server relay media giữa họ — infra riêng (coturn self-host hoặc Xirsys/Twilio managed) với chi phí bandwidth, KHÔNG phải socket.io',
              'Faster internet|||Internet nhanh hơn',
              'A newer browser|||Browser mới hơn',
              'Socket.io v5|||Socket.io v5',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo does <code>socket.rooms.has(&quot;thread:X&quot;)</code> before delivering <code>call:incoming</code>. Why?|||Kho này kiểm <code>socket.rooms.has(&quot;thread:X&quot;)</code> trước khi deliver <code>call:incoming</code>. Vì sao?',
            options: [
              'To only pop the call dialog on the tab currently viewing that chat thread, not on every tab the user has open — prevents UX noise|||Để chỉ pop call dialog trên tab đang xem thread chat đó, không phải mọi tab user mở — tránh UX noise',
              'To check permissions|||Kiểm quyền',
              'To rate limit calls|||Rate limit call',
              'To detect symmetric NAT|||Phát hiện symmetric NAT',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '4-person group video call via P2P mesh. What breaks?|||Call video nhóm 4 người qua P2P mesh. Cái gì vỡ?',
            options: [
              'Each peer must upload video to 3 others = ~3 Mbps upload per peer, plus 12 total connections. Consumer internet cannot handle. Fix: use SFU (server routes streams) — mediasoup, LiveKit, Janus|||Mỗi peer phải upload video cho 3 người khác = ~3 Mbps upload per peer, plus 12 connection total. Internet consumer không chịu nổi. Fix: dùng SFU (server route stream) — mediasoup, LiveKit, Janus',
              'Nothing — mesh scales infinitely|||Không có — mesh scale vô hạn',
              'Socket.io has a 4-peer limit|||Socket.io có limit 4 peer',
              'WebRTC only supports 1-on-1|||WebRTC chỉ hỗ trợ 1-on-1',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Should you try to build your own SFU?|||Có nên build SFU riêng?',
            options: [
              'No — SFU requires deep understanding of RTP, RTCP, DTLS-SRTP, codec-specific packet handling; tens of thousands of lines of C++. Use mediasoup, Janus, or LiveKit — mature and battle-tested|||Không — SFU cần hiểu sâu RTP, RTCP, DTLS-SRTP, xử lý packet theo codec; hàng chục nghìn dòng C++. Dùng mediasoup, Janus, hoặc LiveKit — chín và battle-tested',
              'Yes, it\'s a good learning exercise|||Có, exercise học tập tốt',
              'Only if using TypeScript|||Chỉ nếu dùng TypeScript',
              'Only if you need &lt;100 users|||Chỉ nếu cần &lt;100 users',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
