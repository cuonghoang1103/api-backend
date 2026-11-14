import G09_1 from './giang/sio-09-1.mjs';
import G09_2 from './giang/sio-09-2.mjs';
import G09_3 from './giang/sio-09-3.mjs';
import G09_4 from './giang/sio-09-4.mjs';
import G09_5 from './giang/sio-09-5.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 9: Raw WebSocket cho device.
 * Đo: kho có device.gateway.ts 1035 dòng dùng ws thuần vì device firmware (ESP32)
 * không có socket.io-client. Kèm socket.io cho dashboard.
 */

export default {
  title: 'Chapter 9 — Raw WebSocket: when socket.io is not available|||Chương 9 — Raw WebSocket: khi socket.io không sẵn có',
  slug: 'io-ch9-raw',
  description: 'Sáu bài về khi socket.io KHÔNG dùng được (device firmware, non-JS client) và bạn phải fallback raw ws — vẫn có thể bridge sang socket.io ở fanout tier.',
  sortOrder: 10,
  lessons: [

    {
      title: '9.1 — Why device.gateway.ts is 1.113 lines|||9.1 — Vì sao device.gateway.ts là 1.113 dòng',
      slug: 'io-9-1-vi-sao',
      type: 'VIDEO',
      description: 'ESP32 firmware có ws.h (Arduino WebSocket) — không có socket.io-client. Phải tự viết reconnect, heartbeat, room fanout, auth. Đó là 1.113 dòng vs 668 của messaging (đo 14/11/2026) — nhưng chỉ ~8% là phần socket.io làm hộ được.',
      content: `
${G09_1}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Why device.gateway.ts is 1.035 lines <em>(measured 14/11/2026: 1,113)</em></h2>
<p class="lead">Chapter 8 showed why socket.io is wrong for CRDT (Yjs binary). This chapter shows why it&#39;s wrong for embedded devices — and what fallback pattern this repo uses.</p>

<h3>Size comparison</h3>
<div class="out">Kho nay socket-related files:
  messaging.socket.ts             518 dong    (socket.io)
  notes-collaboration.gateway.ts  300 dong    (Hocuspocus)
  device.gateway.ts             1.035 dong    (raw ws) <- LON NHAT

Vi sao device gateway lon gap 2x?
Vi phai tu viet MOI THU socket.io lam san:
  - reconnect logic
  - heartbeat + timeout
  - room fanout
  - message framing
  - auth handshake
  - error handling
  - health check
</div>

<h3>Why socket.io is NOT used here</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">firmware Arduino/ESP32</span><span class="lz-d">Có <code>WebSocketsClient</code> library — raw WebSocket. There is no socket.io C++ client (only JavaScript, Swift and Kotlin). <em>(Measured: wrong — the very library this firmware uses, <code>links2004/WebSockets</code> 2.7.3, ships <code>SocketIOclient</code>; its default is the old <code>EIO=3</code>, see 9.5. Raw ws is a choice, not a necessity.)</em> The firmware has NO Node.js runtime.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">socket.io framing overhead</span><span class="lz-d">Every packet carries an engine.io prefix plus a socket.io type. For a device sending 20 bytes of telemetry, 60% overhead is too much. <em>(Measured: the same telemetry is <strong>58 B on the wire either way</strong> — <code>42["telemetry",{…}]</code> just moves the type from a <code>"t"</code> field into the event name; only the handshake is bigger, once.)</em></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">the socket.io polling fallback is meaningless here</span><span class="lz-d">An ESP32 does not use the HTTP long-poll fallback. If WS fails, the device is offline. No fallback is needed on the device side.</span></div>
</div>

<h3>The device gateway's three tiers</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Device tier</span><span class="lz-nsub">ESP32 firmware</span></span>
<span class="lz-nbody">Connects over a raw WebSocket. Ping/pong is hand-written using WebSocket ping frames. The initial auth is an HTTP POST to get a token, after which the WS opens with <code>?token=...</code> URL param. <em>(The repo: no token step — the board sends <code>X-Device-Key</code> / <code>X-Device-Secret</code> headers on the upgrade, bcrypt-checked; the query string is still accepted for old firmware, with a warning.)</em></span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Gateway (server)</span><span class="lz-nsub">device.gateway.ts</span></span>
<span class="lz-nbody">Accepts the WS from the device, verifies the token, joins the device to the <code>device:${'${id}'}</code>room. It receives telemetry and forwards it into a socket.io room (fanning out to dashboard subscribers).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Dashboard tier</span><span class="lz-nsub">JS browser</span></span>
<span class="lz-nbody">Connects with ordinary socket.io. Subscribes to a device through <code>maker:device:join</code>. Receives telemetry through <code>device:telemetry</code> events. It has no idea raw ws is underneath.</span>
</div>
</div>

<h3>Bridge pattern — raw ws ↔ socket.io</h3>
<pre><code class="language-ts">// device.gateway.ts
wsServer.on('connection', (ws, req) =&gt; {
  const deviceId = auth(req);
  activeDevices.set(deviceId, ws);
  
  ws.on('message', (data) =&gt; {
    const telemetry = JSON.parse(data.toString());
    // Fanout qua socket.io toi dashboard subscribers
    io.to(&#96;device:\${deviceId}&#96;).emit('device:telemetry', telemetry);
    // repo: emitToConsole() ⇒ io.to(&#96;maker:device:\${id}&#96;).emit('maker:device:telemetry', …) (device.gateway.ts:130)
  });
});
</code></pre>

<div class="callout ok">
<p><strong>This is the &quot;protocol adapter&quot; pattern.</strong> The device tier uses raw WS (a firmware constraint). The dashboard tier uses socket.io (a rich API). The server bridges the two. Each side uses the tool that fits it.</p>
</div>

<h3>Why not use MQTT instead of ws</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">MQTT is the IoT standard</span><span class="lz-lnote">Designed for devices — topic hierarchies, QoS levels, retained messages. Mosquitto and EMQ X are the common brokers</span></div>
<div class="lz-layer"><span class="lz-lname">But it adds a dependency</span><span class="lz-lnote">Its own broker, its own monitoring, its own learning curve. For a simple use case (~1000 devices), raw ws is enough and needs less infrastructure</span></div>
<div class="lz-layer"><span class="lz-lname">Bridging to the browser is still awkward</span><span class="lz-lnote">MQTT is not native to the browser. You need an MQTT-over-WebSocket bridge. You end up with 2 layers instead of 1</span></div>
</div>

<p>This repo chooses raw ws plus a socket.io bridge — good enough for 100 devices, with no separate broker.</p>

<div class="pitfall">
<p><strong>Trap — using socket.io on the device tier &quot;because it is simpler&quot;.</strong> If your firmware is JavaScript (Node.js on a Raspberry Pi), you can. But for bare ESP32/Arduino there is no socket.io-client and you would have to reverse-engineer the protocol. Not worth it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> This repo's device.gateway.ts runs to 1,035 lines (against 518 for messaging.socket.ts) because it has to hand-write everything socket.io gives you for free (reconnect, heartbeat, room fanout, auth) for ESP32 firmware that has no socket.io-client — the bridge pattern then relays telemetry into socket.io on the dashboard tier so both sides use the right tool.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Count the responsibilities in <code>device.gateway.ts</code> that socket.io would give you for free: reconnect, heartbeat, room fanout, auth.</li>
<li>Explain why an ESP32 cannot just use socket.io-client, so the raw WS code is necessary.</li>
<li>Trace the bridge: telemetry arrives on raw WS and is relayed into a socket.io room for the dashboard tier.</li>
</ol>
<p><strong>Done when:</strong> you can justify the 1,035 lines and point to where the bridge hands off to socket.io.</p></div>

<h3>🔬 Measured: where the 1,113 lines go</h3>
<p>Counted on today&#39;s repo (14/11/2026) — <code>wc -l</code>, then the gateway split by its own <code>// ─── …</code> section headers:</p>
<div class="out">$ wc -l src/socket/messaging.socket.ts src/socket/notes-collaboration.gateway.ts src/socket/device.gateway.ts
     668 src/socket/messaging.socket.ts
     306 src/socket/notes-collaboration.gateway.ts
    1113 src/socket/device.gateway.ts
    2087 total
$ node dem91.mjs src/socket/device.gateway.ts      # đếm theo từng mục "// ─── …" của chính tệp
mục                                 dòng   mã   chú thích  trống
(đầu tệp: mô tả giao thức + import)    67    10        55      2   (1-67)
Tunables                              14     6         7      1   (68-81)
Connection registry                   42    21        18      3   (82-123)
Fan-out to the browser console (socket.io)    12     8         1      3   (124-135)
Sending to a device                  127    97        19     11   (136-262)
Nói theo dòng                        264   122       122     20   (263-526)
Device event handlers                226   155        49     22   (527-752)
Message router                        87    64        19      4   (753-839)
Auth on upgrade                       87    48        31      8   (840-926)
Lifecycle                            187   137        35     15   (927-1113)
TỔNG                                1113   668       356     89</div>
<div class="callout warn"><p><strong>Read it:</strong> 1113 lines = 668 code + 356 comment + 89 blank. The two audio sections (“Sending to a device” + “Nói theo dòng”, TTS streaming) are 391 lines — over a third. The bridge to socket.io is 12 lines. What socket.io would really have replaced: heartbeat (~19 lines: <code>1017–1032</code>, <code>1083–1085</code>) and the <code>switch</code> on <code>t</code> (~70) — about <strong>90 lines, ~8%</strong>. <strong>Reconnect is 0 lines on the server</strong>: it is the board&#39;s job (<code>firmware/mini-me-robot/src/main.cpp:1619</code>, one call). So “it must hand-write everything socket.io does” does not hold.</p></div>
<p>The firmware and its library — the library already contains a socket.io client:</p>
<div class="out">$ grep -n "WebSocketsClient ws\\|setExtraHeaders\\|setReconnectInterval\\|enableHeartbeat" firmware/mini-me-robot/src/main.cpp
54:static WebSocketsClient ws;
1137:      ws.enableHeartbeat(15000, 3000, 2);
1611:  ws.setExtraHeaders(
1619:  ws.setReconnectInterval(WS_RECONNECT_BASE_MS);
$ grep -n "links2004/WebSockets" firmware/mini-me-robot/platformio.ini
77:    links2004/WebSockets@^2.6.1          ; plain RFC-6455 client → /device-ws
$ ls .pio/libdeps/mini-me/WebSockets/src/ | grep -i socketio      # thư viện firmware ĐANG DÙNG
SocketIOclient.cpp
SocketIOclient.h
$ grep -n "void begin(const char" .pio/libdeps/mini-me/WebSockets/src/SocketIOclient.h
50:    void begin(const char * host, uint16_t port, const char * url = "/socket.io/?EIO=3", const char * protocol = "ard</div>
<p>The repo&#39;s gateway running end to end (a fake board speaking the firmware protocol ⇒ <code>device.gateway.ts</code> ⇒ room <code>maker:device:1</code> ⇒ An&#39;s console). An also asked for board 2 (Binh&#39;s): the owner check in <code>messaging.socket.ts:546</code> drops it silently:</p>
<div class="out">$ node bo.mjs 1 19910 3.2                       # bo mạch 1 (của An) nối, gửi hello + telemetry
 0.14 s [bo 1] nối được sau 142 ms (lần thử 1)
 0.14 s [bo 1] ↓ {"t":"welcome","deviceId":1,"serverTime":1794608748440}
$ node bo.mjs 2 19910 1.5                       # bo mạch 2 (của Bình)
 0.08 s [bo 2] nối được sau 78 ms (lần thử 1)
 0.08 s [bo 2] ↓ {"t":"welcome","deviceId":2,"serverTime":1794608751651}
$ # Live Console của An
 0.02 s [An] nối socket.io · join maker:device:1, maker:device:2
 0.70 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T22:25:48.440Z","batteryPct":null}
 0.71 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T22:25:48.444Z","firmwareVersion":
 1.71 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794608749445},"recordedA · trễ 1 ms
 2.71 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794608750447},"recordedA · trễ 2 ms
 3.71 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":3,"gui":1794608751449},"recordedA · trễ 0 ms
 3.77 s [An] ← maker:device:status {"deviceId":1,"status":"OFFLINE"}
 6.00 s [An] tổng: {"maker:device:status":3,"maker:device:telemetry":3}
$ # log server
[logger.info] MakerLab device gateway listening on /device-ws
[may9] :19910 · device.gateway.ts của kho trên /device-ws · socket.io có · 3 thiết bị
[logger.info] MakerLab device connected {"deviceId":1,"key":"mk_lab_1"}
[logger.info] MakerLab thiết bị khai báo định dạng âm thanh {"deviceId":1,"format":"pcm"}
[logger.info] MakerLab device disconnected {"deviceId":1}
[logger.info] MakerLab device connected {"deviceId":2,"key":"mk_lab_2"}
[logger.info] MakerLab thiết bị khai báo định dạng âm thanh {"deviceId":2,"format":"pcm"}
[logger.info] MakerLab device disconnected {"deviceId":2}</div>
<p>Bytes on the wire for the same 10 telemetry messages, through a byte-counting TCP proxy:</p>
<div class="out">$ node do91.mjs        # cùng 10 tin telemetry: ws thô tới gateway kho  vs  socket.io-client — đếm byte trên dây
một tin, phần JSON trong khung:
  ws thô    {"t":"telemetry","temp":25.3,"rssi":-58,"uptime":12}   52 B (+6 B đầu khung WS có mặt nạ)
  socket.io 42["telemetry",{"temp":25.3,"rssi":-58,"uptime":12}]   52 B (+6 B)
đo trên dây (proxy TCP), 10 tin:
  ws thô    bắt tay ↑285 ↓129 B (HTTP 101) · hello ↑50 B, welcome ↓57 B · 10 telemetry ↑580 B (58 B/tin) ↓0 B
  socket.io bắt tay ↑280 ↓304 B (HTTP + gói 0 OPEN + 40 CONNECT) · 10 telemetry ↑580 B (58 B/tin) ↓0 B</div>
<div class="callout info"><p><strong>The real reasons</strong>, from the comment at the top of the file (lines 6–19): microcontroller WebSocket libraries speak plain RFC 6455 and socket.io&#39;s extra handshake/framing costs flash, RAM and debugging time on a small chip; and raw audio streams both ways as binary frames (a socket.io binary event is two frames, lesson 2.5; base64-in-JSON costs ~33%). Browsers stay on socket.io.</p></div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9: device.gateway.ts CHÉP TỪ KHO (đổi đúng dòng import @prisma/client), Prisma giả trong RAM, bcrypt cost 10 như kho</span>
npm i socket.io@4.8.3 socket.io-client@4.8.3 ws@8 bcryptjs@2.4.3
node dem91.mjs src/socket/device.gateway.ts <span class="tok-comment">  # đếm theo các mục "// ─── …" của chính tệp: mã / chú thích / trống</span>
npx tsx may9.ts &amp;                           <span class="tok-comment">  # :19910 · gateway kho trên /device-ws + socket.io (handler maker:device:join chép từ messaging.socket.ts:546)</span>
node man.mjs 1 1,2 &amp;                        <span class="tok-comment">  # Live Console của An: join thiết bị 1 (của An) và 2 (của Bình)</span>
node bo.mjs 1                               <span class="tok-comment">  # bo mạch giả: header khoá, hello, telemetry 1 Hz, trả pong</span>
node do91.mjs                               <span class="tok-comment">  # cùng 10 tin telemetry: ws thô vs socket.io-client, proxy TCP đếm byte</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — From polling to being told: WebSocket</span><span class="lc-sub">Raw ws from scratch — what this gateway builds on</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: upgrade, frames and heartbeat</span><span class="lc-sub">The RFC 6455 frames the board speaks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: binary data</span><span class="lc-sub">Raw PCM audio arrives as Buffers</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Raw WebSocket</span><span class="v">The bare <code>ws</code> protocol with none of socket.io's extras.</span></div>
  <div class="kv"><span class="k">Device tier</span><span class="v">ESP32 firmware that has no socket.io-client.</span></div>
  <div class="kv"><span class="k">Hand-written essentials</span><span class="v">Reconnect, heartbeat, room fanout, auth — all coded by hand here.</span></div>
  <div class="kv"><span class="k">Bridge pattern</span><span class="v">Relay device telemetry into socket.io on the dashboard tier.</span></div>
  <div class="kv"><span class="k">Dashboard tier</span><span class="v">The browser side, which keeps all of socket.io's conveniences.</span></div>
  <div class="kv"><span class="k">Right tool per tier</span><span class="v">Raw WS for firmware, socket.io for browsers.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>device.gateway.ts</code> is 1,035 lines against 518 for <code>messaging.socket.ts</code>.</li><li>It must hand-write everything socket.io gives for free: reconnect, heartbeat, room fanout, auth.</li><li>That is because ESP32 firmware has no socket.io-client.</li><li>The bridge pattern relays telemetry into socket.io on the dashboard tier.</li><li>So each side uses the right tool for its tier.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Arduino WebSocketsClient</span><span class="lc-sub">github.com/Links2004/arduinoWebSockets — thư viện WS phổ biến cho ESP32/Arduino.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MQTT — the IoT standard</span><span class="lc-sub">mqtt.org — protocol chuẩn cho IoT, alternative cho raw ws.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Vì sao device.gateway.ts là 1.035 dòng <em>(đo 14/11/2026: 1.113)</em></h2>
<p class="lead">Chương 8 chỉ ra vì sao socket.io sai cho CRDT (Yjs binary). Chương này chỉ ra vì sao nó sai cho embedded device — và fallback pattern kho này dùng.</p>

<h3>So sánh size</h3>
<div class="out">Kho nay socket-related files:
  messaging.socket.ts             518 dong    (socket.io)
  notes-collaboration.gateway.ts  300 dong    (Hocuspocus)
  device.gateway.ts             1.035 dong    (raw ws) &lt;- LON NHAT

Vi sao device gateway lon gap 2x?
Vi phai tu viet MOI THU socket.io lam san:
  - reconnect logic
  - heartbeat + timeout
  - room fanout
  - message framing
  - auth handshake
  - error handling
  - health check
</div>

<h3>Vì sao KHÔNG dùng socket.io</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">firmware Arduino/ESP32</span><span class="lz-d">Có <code>WebSocketsClient</code> library — WebSocket thuần. Không có socket.io C++ client (chỉ có JavaScript, Swift, Kotlin). <em>(Đo: sai — chính thư viện firmware đang dùng, <code>links2004/WebSockets</code> 2.7.3, có sẵn <code>SocketIOclient</code>; mặc định nói <code>EIO=3</code> đời cũ, xem 9.5. WebSocket trần là lựa chọn, không phải bắt buộc.)</em> Firmware KHÔNG có Node.js runtime.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">socket.io framing overhead</span><span class="lz-d">Mỗi packet có prefix engine.io + socket.io type. Cho device chỉ gửi telemetry 20 byte, overhead 60% là quá. <em>(Đo: cùng tin telemetry <strong>58 B trên dây cả hai đường</strong> — <code>42["telemetry",{…}]</code> chỉ chuyển trường <code>"t"</code> thành tên sự kiện; chỉ bắt tay lớn hơn, một lần.)</em></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">socket.io polling fallback không có nghĩa</span><span class="lz-d">ESP32 không dùng HTTP long-poll fallback. Nếu WS fail, device offline. Không cần fallback ở device side.</span></div>
</div>

<h3>Ba tầng của device gateway</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Device tầng</span><span class="lz-nsub">ESP32 firmware</span></span>
<span class="lz-nbody">Connect qua raw WebSocket. Ping/pong tự viết bằng WebSocket ping frames. Auth ban đầu là POST HTTP để lấy token, sau đó open WS với <code>?token=...</code> URL param. <em>(Kho thật: không có bước token — bo gửi header <code>X-Device-Key</code> / <code>X-Device-Secret</code> ngay trong cú upgrade, kiểm bằng bcrypt; query string vẫn nhận cho firmware cũ, kèm cảnh báo.)</em></span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Gateway (server)</span><span class="lz-nsub">device.gateway.ts</span></span>
<span class="lz-nbody">Nhận WS từ device, verify token, join device vào room <code>device:${'${id}'}</code>. Nhận telemetry, forward vào socket.io room (fanout tới dashboard subscribers).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Dashboard tầng</span><span class="lz-nsub">JS browser</span></span>
<span class="lz-nbody">Kết nối bằng socket.io CHUẨN. Subscribe device qua <code>maker:device:join</code>. Nhận telemetry qua <code>device:telemetry</code> events. Không biết bên dưới là raw ws.</span>
</div>
</div>

<h3>Bridge pattern — raw ws ↔ socket.io</h3>
<pre><code class="language-ts">// device.gateway.ts
wsServer.on('connection', (ws, req) =&gt; {
  const deviceId = auth(req);
  activeDevices.set(deviceId, ws);
  
  ws.on('message', (data) =&gt; {
    const telemetry = JSON.parse(data.toString());
    // Fanout qua socket.io toi dashboard subscribers
    io.to(&#96;device:\${deviceId}&#96;).emit('device:telemetry', telemetry);
    // repo: emitToConsole() ⇒ io.to(&#96;maker:device:\${id}&#96;).emit('maker:device:telemetry', …) (device.gateway.ts:130)
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Đây là pattern &quot;protocol adapter&quot;.</strong> Device tier dùng raw WS (giới hạn firmware). Dashboard tier dùng socket.io (rich API). Server bridge hai bên. Mỗi bên dùng tool đúng cho mình.</p>
</div>

<h3>Tại sao KHÔNG dùng MQTT thay ws</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">MQTT là chuẩn IoT</span><span class="lz-lnote">Được thiết kế cho device — topic hierarchy, QoS levels, retained message. Mosquitto, EMQ X là brokers phổ biến</span></div>
<div class="lz-layer"><span class="lz-lname">Nhưng thêm dependency</span><span class="lz-lnote">Broker riêng, monitoring riêng, learning curve. Cho use case đơn giản (~1000 devices), raw ws đủ và ít infra</span></div>
<div class="lz-layer"><span class="lz-lname">Bridge sang browser vẫn khó</span><span class="lz-lnote">MQTT không native browser. Cần MQTT-over-WebSocket bridge. Kết cục là 2 layer thay 1</span></div>
</div>

<p>Kho này chọn raw ws + socket.io bridge — đủ tốt cho 100 devices, không cần broker riêng.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng socket.io ở device tier &quot;vì đơn giản&quot;.</strong> Nếu bạn viết JS server-side firmware (Node.js trên Raspberry Pi), có thể. Nhưng cho ESP32/Arduino thuần, socket.io-client không có, phải reverse engineer protocol. Không đáng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> device.gateway.ts của kho này là 1.035 dòng (vs 518 messaging.socket.ts) vì phải tự viết mọi thứ socket.io làm sẵn (reconnect, heartbeat, room fanout, auth) cho ESP32 firmware không có socket.io-client — bridge pattern relay telemetry sang socket.io ở dashboard tier để hai bên đều dùng tool đúng cho mình.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đếm các trách nhiệm trong <code>device.gateway.ts</code> mà socket.io cho bạn miễn phí: reconnect, heartbeat, room fanout, auth.</li>
<li>Giải thích vì sao một ESP32 không thể chỉ dùng socket.io-client, nên mã raw WS là cần thiết.</li>
<li>Lần theo bridge: telemetry tới trên raw WS và được relay vào một room socket.io cho dashboard tier.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn biện minh được 1.035 dòng và chỉ ra chỗ bridge bàn giao sang socket.io.</p></div>

<h3>🔬 Đo thật: 1.113 dòng đi đâu</h3>
<p>Đếm trên kho hôm nay (14/11/2026) — <code>wc -l</code>, rồi chia gateway theo đúng các dòng tiêu đề mục <code>// ─── …</code> của nó:</p>
<div class="out">$ wc -l src/socket/messaging.socket.ts src/socket/notes-collaboration.gateway.ts src/socket/device.gateway.ts
     668 src/socket/messaging.socket.ts
     306 src/socket/notes-collaboration.gateway.ts
    1113 src/socket/device.gateway.ts
    2087 total
$ node dem91.mjs src/socket/device.gateway.ts      # đếm theo từng mục "// ─── …" của chính tệp
mục                                 dòng   mã   chú thích  trống
(đầu tệp: mô tả giao thức + import)    67    10        55      2   (1-67)
Tunables                              14     6         7      1   (68-81)
Connection registry                   42    21        18      3   (82-123)
Fan-out to the browser console (socket.io)    12     8         1      3   (124-135)
Sending to a device                  127    97        19     11   (136-262)
Nói theo dòng                        264   122       122     20   (263-526)
Device event handlers                226   155        49     22   (527-752)
Message router                        87    64        19      4   (753-839)
Auth on upgrade                       87    48        31      8   (840-926)
Lifecycle                            187   137        35     15   (927-1113)
TỔNG                                1113   668       356     89</div>
<div class="callout warn"><p><strong>Đọc:</strong> 1113 dòng = 668 mã + 356 chú thích + 89 trống. Hai mục tiếng nói (“Sending to a device” + “Nói theo dòng”, bơm TTS) là 391 dòng — hơn một phần ba. Cây cầu sang socket.io: 12 dòng. Phần socket.io thật sự thay được: heartbeat (~19 dòng: <code>1017–1032</code>, <code>1083–1085</code>) và <code>switch</code> theo <code>t</code> (~70) — chừng <strong>90 dòng, ~8%</strong>. <strong>Reconnect ở server: 0 dòng</strong> — đó là việc của bo (<code>firmware/mini-me-robot/src/main.cpp:1619</code>, một lời gọi). Nên “phải tự viết mọi thứ socket.io làm sẵn” không đúng.</p></div>
<p>Firmware và thư viện của nó — thư viện đã có sẵn một socket.io client:</p>
<div class="out">$ grep -n "WebSocketsClient ws\\|setExtraHeaders\\|setReconnectInterval\\|enableHeartbeat" firmware/mini-me-robot/src/main.cpp
54:static WebSocketsClient ws;
1137:      ws.enableHeartbeat(15000, 3000, 2);
1611:  ws.setExtraHeaders(
1619:  ws.setReconnectInterval(WS_RECONNECT_BASE_MS);
$ grep -n "links2004/WebSockets" firmware/mini-me-robot/platformio.ini
77:    links2004/WebSockets@^2.6.1          ; plain RFC-6455 client → /device-ws
$ ls .pio/libdeps/mini-me/WebSockets/src/ | grep -i socketio      # thư viện firmware ĐANG DÙNG
SocketIOclient.cpp
SocketIOclient.h
$ grep -n "void begin(const char" .pio/libdeps/mini-me/WebSockets/src/SocketIOclient.h
50:    void begin(const char * host, uint16_t port, const char * url = "/socket.io/?EIO=3", const char * protocol = "ard</div>
<p>Gateway của kho chạy từ đầu tới cuối (bo mạch giả nói đúng giao thức firmware ⇒ <code>device.gateway.ts</code> ⇒ room <code>maker:device:1</code> ⇒ console của An). An xin cả thiết bị 2 (của Bình): kiểm chủ ở <code>messaging.socket.ts:546</code> bỏ qua im lặng:</p>
<div class="out">$ node bo.mjs 1 19910 3.2                       # bo mạch 1 (của An) nối, gửi hello + telemetry
 0.14 s [bo 1] nối được sau 142 ms (lần thử 1)
 0.14 s [bo 1] ↓ {"t":"welcome","deviceId":1,"serverTime":1794608748440}
$ node bo.mjs 2 19910 1.5                       # bo mạch 2 (của Bình)
 0.08 s [bo 2] nối được sau 78 ms (lần thử 1)
 0.08 s [bo 2] ↓ {"t":"welcome","deviceId":2,"serverTime":1794608751651}
$ # Live Console của An
 0.02 s [An] nối socket.io · join maker:device:1, maker:device:2
 0.70 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T22:25:48.440Z","batteryPct":null}
 0.71 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T22:25:48.444Z","firmwareVersion":
 1.71 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794608749445},"recordedA · trễ 1 ms
 2.71 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794608750447},"recordedA · trễ 2 ms
 3.71 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":3,"gui":1794608751449},"recordedA · trễ 0 ms
 3.77 s [An] ← maker:device:status {"deviceId":1,"status":"OFFLINE"}
 6.00 s [An] tổng: {"maker:device:status":3,"maker:device:telemetry":3}
$ # log server
[logger.info] MakerLab device gateway listening on /device-ws
[may9] :19910 · device.gateway.ts của kho trên /device-ws · socket.io có · 3 thiết bị
[logger.info] MakerLab device connected {"deviceId":1,"key":"mk_lab_1"}
[logger.info] MakerLab thiết bị khai báo định dạng âm thanh {"deviceId":1,"format":"pcm"}
[logger.info] MakerLab device disconnected {"deviceId":1}
[logger.info] MakerLab device connected {"deviceId":2,"key":"mk_lab_2"}
[logger.info] MakerLab thiết bị khai báo định dạng âm thanh {"deviceId":2,"format":"pcm"}
[logger.info] MakerLab device disconnected {"deviceId":2}</div>
<p>Byte trên dây của cùng 10 tin telemetry, qua một proxy TCP đếm byte:</p>
<div class="out">$ node do91.mjs        # cùng 10 tin telemetry: ws thô tới gateway kho  vs  socket.io-client — đếm byte trên dây
một tin, phần JSON trong khung:
  ws thô    {"t":"telemetry","temp":25.3,"rssi":-58,"uptime":12}   52 B (+6 B đầu khung WS có mặt nạ)
  socket.io 42["telemetry",{"temp":25.3,"rssi":-58,"uptime":12}]   52 B (+6 B)
đo trên dây (proxy TCP), 10 tin:
  ws thô    bắt tay ↑285 ↓129 B (HTTP 101) · hello ↑50 B, welcome ↓57 B · 10 telemetry ↑580 B (58 B/tin) ↓0 B
  socket.io bắt tay ↑280 ↓304 B (HTTP + gói 0 OPEN + 40 CONNECT) · 10 telemetry ↑580 B (58 B/tin) ↓0 B</div>
<div class="callout info"><p><strong>Lý do thật</strong>, theo chú thích đầu tệp (dòng 6–19): thư viện WebSocket trên vi điều khiển nói RFC 6455 trần, bắt tay + khung riêng của socket.io tốn flash, RAM và công gỡ lỗi trên chip nhỏ; và tiếng nói chảy hai chiều dạng khung nhị phân (socket.io gửi nhị phân thành hai khung, bài 2.5; base64 trong JSON tốn ~33%). Trình duyệt vẫn ở lại với socket.io.</p></div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9: device.gateway.ts CHÉP TỪ KHO (đổi đúng dòng import @prisma/client), Prisma giả trong RAM, bcrypt cost 10 như kho</span>
npm i socket.io@4.8.3 socket.io-client@4.8.3 ws@8 bcryptjs@2.4.3
node dem91.mjs src/socket/device.gateway.ts <span class="tok-comment">  # đếm theo các mục "// ─── …" của chính tệp: mã / chú thích / trống</span>
npx tsx may9.ts &amp;                           <span class="tok-comment">  # :19910 · gateway kho trên /device-ws + socket.io (handler maker:device:join chép từ messaging.socket.ts:546)</span>
node man.mjs 1 1,2 &amp;                        <span class="tok-comment">  # Live Console của An: join thiết bị 1 (của An) và 2 (của Bình)</span>
node bo.mjs 1                               <span class="tok-comment">  # bo mạch giả: header khoá, hello, telemetry 1 Hz, trả pong</span>
node do91.mjs                               <span class="tok-comment">  # cùng 10 tin telemetry: ws thô vs socket.io-client, proxy TCP đếm byte</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — Từ hỏi đi hỏi lại tới được báo: WebSocket</span><span class="lc-sub">ws thô từ số 0 — nền của gateway này</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: nâng cấp, frame và nhịp tim</span><span class="lc-sub">Khung RFC 6455 mà bo mạch nói</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: dữ liệu nhị phân</span><span class="lc-sub">Tiếng PCM thô tới server dưới dạng Buffer</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Raw WebSocket</span><span class="v">Protocol <code>ws</code> trần không có phần thêm nào của socket.io.</span></div>
  <div class="kv"><span class="k">Device tier</span><span class="v">Firmware ESP32 không có socket.io-client.</span></div>
  <div class="kv"><span class="k">Phần cốt tự viết</span><span class="v">Reconnect, heartbeat, room fanout, auth — đều code bằng tay ở đây.</span></div>
  <div class="kv"><span class="k">Bridge pattern</span><span class="v">Relay telemetry thiết bị vào socket.io ở dashboard tier.</span></div>
  <div class="kv"><span class="k">Dashboard tier</span><span class="v">Phía trình duyệt, giữ mọi tiện ích của socket.io.</span></div>
  <div class="kv"><span class="k">Đúng tool mỗi tier</span><span class="v">Raw WS cho firmware, socket.io cho trình duyệt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>device.gateway.ts</code> là 1.035 dòng so với 518 của <code>messaging.socket.ts</code>.</li><li>Nó phải tự viết mọi thứ socket.io cho miễn phí: reconnect, heartbeat, room fanout, auth.</li><li>Đó là vì firmware ESP32 không có socket.io-client.</li><li>Bridge pattern relay telemetry vào socket.io ở dashboard tier.</li><li>Nên mỗi bên dùng đúng tool cho tier của mình.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Arduino WebSocketsClient</span><span class="lc-sub">github.com/Links2004/arduinoWebSockets — thư viện WS phổ biến cho ESP32/Arduino.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MQTT — chuẩn IoT</span><span class="lc-sub">mqtt.org — protocol chuẩn cho IoT, alternative cho raw ws.</span></span></div>
</div>
`,
    },

    {
      title: '9.2 — Manual reconnect logic|||9.2 — Logic reconnect thủ công',
      slug: 'io-9-2-reconnect',
      type: 'VIDEO',
      description: 'ESP32 firmware Arduino không có backoff library. Tự viết: 1s → 2s → 5s → 30s cap. Tránh reconnect storm khi 1.000 device power cycle.',
      content: `
${G09_2}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Manual reconnect logic</h2>
<p class="lead">Socket.io-client handles reconnect automatically (Chapter 1.3). Raw ws + Arduino needs you to write it yourself — and with 1.000 devices power-cycling together, the pattern MUST be jittered to avoid a reconnect storm.</p>

<h3>Simple exponential backoff (Arduino C++)</h3>
<pre><code class="language-cpp">// ESP32 firmware
unsigned long lastReconnect = 0;
int reconnectDelay = 1000;                   // start 1s
const int MAX_DELAY = 30000;                 // cap 30s

void loop() {
  if (!ws.isConnected()) {
    if (millis() - lastReconnect &gt; reconnectDelay) {
      Serial.printf("Reconnecting after %d ms...\\n", reconnectDelay);
      ws.begin("api.example.com", 80, "/device-ws");   // repo path: /device-ws
      lastReconnect = millis();
      reconnectDelay = min(reconnectDelay * 2, MAX_DELAY);
    }
  } else {
    reconnectDelay = 1000;                    // reset on connect
  }
  ws.loop();
}
</code></pre>

<h3>Add jitter — this is mission-critical</h3>
<pre><code class="language-cpp">// Ma khong jitter, 1000 device cung reconnect luc 30s -&gt; server SOA
int jitter = random(-500, 500);              // +/- 500ms
if (millis() - lastReconnect &gt; reconnectDelay + jitter) {
  ...
}
</code></pre>

<div class="callout warn">
<p><strong>The reconnect storm is a real scenario.</strong> A power cut: 1,000 devices go dark. The power returns 30 minutes later: 1,000 devices boot at the same instant and all try to connect. The server takes 1,000 handshakes in one second — and may die. Jitter spreads them across that second.</p>
</div>

<h3>Backoff patterns comparison</h3>
<div class="out">Attempt   Simple     Jittered      Fibonacci      Constant
1         1s         0.5-1.5s      1s             5s
2         2s         1-3s          1s             5s
3         4s         2-6s          2s             5s
4         8s         4-12s         3s             5s
5         16s        8-24s         5s             5s
6         30s (cap)  15-45s        8s             5s
7         30s        15-45s        13s (cap 30s)  5s
8         30s        15-45s        30s            5s

Kho nay: Simple exponential + jitter +/- 20%.
(DO 14/11/2026: SAI — firmware goi ws.setReconnectInterval(3000): CO DINH 3 s,
 khong nhieu; WS_RECONNECT_MAX_MS va HEARTBEAT_TIMEOUT_MS khai trong config.h ma 0 cho dung.)
</div>

<h3>Server-side visibility</h3>
<pre><code class="language-ts">// device.gateway.ts
wsServer.on('connection', (ws, req) =&gt; {
  const deviceId = auth(req);
  const now = Date.now();
  const lastSeen = deviceLastConnect.get(deviceId) || 0;
  const gap = now - lastSeen;
  
  logger.info('device connected', {
    deviceId,
    gap,                           // thoi gian giua reconnect
    attempt: reconnectAttempts.get(deviceId) || 1,
  });
  
  deviceLastConnect.set(deviceId, now);
  // ...
});
</code></pre>

<div class="callout ok">
<p><strong>Logging the gap between reconnects reveals unhealthy devices.</strong> Device 1 reconnecting every 30s means an unstable network. Device 2 not reconnecting for 5 minutes means it is dead. The dashboard shows the alert.</p>
</div>

<h3>Heartbeat WebSocket vs application-level</h3>
<pre><code class="language-cpp">// WebSocket-native ping frame
ws.enableHeartbeat(15000, 3000, 2);      // ping mỗi 15s, timeout 3s, 2 lỗi = disconnect

// HOAC application-level heartbeat
if (millis() - lastPing &gt; 30000) {
  ws.sendTXT("{\\"type\\":\\"ping\\"}");
  lastPing = millis();
}
</code></pre>

<p>A WebSocket-native ping frame is lighter (~2 bytes) but some proxies strip it. An application-level ping (JSON) is heavier but always gets through. This repo uses both. <em>(Measured: true — every 30 s the server sends a JSON <code>{"t":"ping"}</code> and a WebSocket ping frame, and any message marks the board alive. A board frozen right after a ping stayed “online” 55.9 s: cut after missing <strong>one</strong> ping, though the comment at <code>device.gateway.ts:71</code> says “two”. Proxies stripping ping frames was not measured here.)</em></p>

<div class="pitfall">
<p><strong>Trap — retrying immediately with no backoff.</strong> An ESP32 loses its WS at t=0 and keeps retrying every 100ms → 10 attempts a second. The server sees 10 failed handshakes per second per device. 100 devices = 1,000 failures a second — a DDoS you built yourself.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Raw-ws reconnection on the device tier has to be hand-written: exponential backoff (1s → 2s → 5s, capped at 30s) plus ±20% jitter so 1,000 devices do not power-cycle in unison, plus a heartbeat (WebSocket-native or application-level), plus server-side logging of the gap between reconnects to spot unhealthy devices.</p>
</div>

<h3>Backing off without synchronising every client</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Exponential, not constant</span><span class="lz-d">1 s, 2 s, 4 s, 8 s. A constant retry against a server that just fell over is a denial of service you wrote yourself.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cap the maximum</span><span class="lz-d">Otherwise a long outage pushes the delay to hours, and clients stay disconnected long after the server recovered.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Add jitter — this is the part people skip</span><span class="lz-d">Without it, every client that dropped at the same moment retries at the same moment, forever. The server comes back up and is knocked over by the reconnect stampede.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Reset the counter on a successful connect</span><span class="lz-d">Not on a successful <em>attempt</em>: a connection that drops immediately should not reset back to a one-second retry.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a reconnect storm that takes the server down again the moment it recovers.</strong> Ten thousand clients lose the connection in the same second because the server restarted; without jitter they all wait exactly one second, all reconnect in the same millisecond, and the freshly-started process handles ten thousand simultaneous handshakes and falls over. It then restarts, and the cycle repeats — an outage that looks like the server &quot;cannot stay up&quot; when the server is fine and the clients are the load. A random factor on each delay spreads the same ten thousand connections over the whole window, and it is three lines of code.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Hand-write a reconnect loop with exponential backoff (1s → 2s → 5s, capped at 30s) for a raw-ws client.</li>
<li>Add ±20% jitter and reason about why 1,000 devices without it would power-cycle in unison and knock the server over.</li>
<li>Add a heartbeat (WebSocket-native ping or application-level) and server-side logging of the gap between reconnects to spot unhealthy devices.</li>
</ol>
<p><strong>Done when:</strong> your reconnect backs off with jitter and a dead connection is detected by a missing heartbeat.</p></div>

<h3>🔬 Measured: what this repo&#39;s firmware does, and a real reconnect storm</h3>
<p>The firmware (14/11/2026) — a <strong>fixed</strong> 3 s interval, no jitter; the two “smarter” constants are never used; the library gives up a handshake after 5 s; the server checks the device secret with bcrypt:</p>
<div class="out">$ grep -n "WS_RECONNECT\\|HEARTBEAT_TIMEOUT" firmware/mini-me-robot/src/config.h
433:#define WS_RECONNECT_BASE_MS 3000
434:#define WS_RECONNECT_MAX_MS  30000
436:#define HEARTBEAT_TIMEOUT_MS  90000  // 3 lần ping của server bị lỡ
$ grep -rn "WS_RECONNECT_MAX_MS\\|HEARTBEAT_TIMEOUT_MS" firmware/mini-me-robot/src/ | grep -v "config.h" | wc -l     # chỗ DÙNG hai hằng số này
       0
$ sed -n '243,247p' .pio/libdeps/mini-me/WebSockets/src/WebSocketsClient.cpp     # vòng loop() của thư viện
    if(!clientIsConnected(&amp;_client)) {
        // do not flood the server
        if((millis() - _lastConnectionFail) &lt; _reconnectInterval) {
            return;
        }
$ grep -n "WEBSOCKETS_TCP_TIMEOUT (" .pio/libdeps/mini-me/WebSockets/src/WebSockets.h     # hạn chờ bắt tay
125:#define WEBSOCKETS_TCP_TIMEOUT (5000)
$ grep -n "randomBytes(24)\\|secretHash = await bcrypt.hash\\|bcrypt.compare(secret, device" src/services/makerlab/makerLab.service.ts src/socket/device.gateway.ts
src/services/makerlab/makerLab.service.ts:115:  const secret = randomBytes(24).toString('base64url');
src/services/makerlab/makerLab.service.ts:116:  const secretHash = await bcrypt.hash(secret, 10);
src/services/makerlab/makerLab.service.ts:134:  const secret = randomBytes(24).toString('base64url');
src/services/makerlab/makerLab.service.ts:135:  const secretHash = await bcrypt.hash(secret, 10);
src/socket/device.gateway.ts:916:  const ok = await bcrypt.compare(secret, device.secretHash);</div>
<p>“The power comes back”: N fake boards start at the same instant against the repo&#39;s <code>device.gateway.ts</code> (copied verbatim, in-memory DB, real bcrypt cost 10), each with the library&#39;s rules; counted per second:</p>
<div class="out">$ node bao.mjs 100 co-dinh        # "điện lại": 100 bo cùng khởi động · gateway KHO · nối lại cố định 3 s như firmware
N=100 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho)
    0 s  thử  100  nối    1  lỗi    0
    5 s  thử    0  nối    0  lỗi   99
    8 s  thử   99  nối    1  lỗi    0
   11 s  thử    0  nối   51  lỗi    1
   12 s  thử    0  nối   13  lỗi    0
   13 s  thử    0  nối    1  lỗi   32
   14 s  thử    1  nối    0  lỗi    0
   15 s  thử    0  nối    1  lỗi    0
   16 s  thử   32  nối    1  lỗi    0
   18 s  thử    0  nối   31  lỗi    0
⇒ ĐỦ 100/100 online sau 18.4 s · 232 lần thử · lỗi: {"Opening handshake has timed out @5s":131,"ECONNRESET @4s":1} · CPU server 0:17.29 · log warn/error 0 · event loop đứng tối đa 7216 ms
$ node bao.mjs 300 co-dinh        # 300 bo, cùng chính sách
N=300 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho)
    0 s  thử  300  nối    1  lỗi    0
    5 s  thử    0  nối    0  lỗi  299
    8 s  thử  299  nối    0  lỗi  233
   11 s  thử  233  nối    0  lỗi  233
   13 s  thử    0  nối    0  lỗi   66
   14 s  thử  233  nối    0  lỗi  233
   16 s  thử   66  nối    0  lỗi   66
  … (106 dòng)
  125 s  thử  143  nối    0  lỗi  141
  126 s  thử   71  nối    0  lỗi   72
  127 s  thử   18  nối    0  lỗi   18
  128 s  thử  141  nối    0  lỗi  141
  129 s  thử   72  nối    0  lỗi   71
⇒ sau 120 s mới 1/300 online · 10279 lần thử · lỗi: {"Opening handshake has timed out @5s":1664,"ECONNRESET @0s":8456,"EPIPE @0s":89} · CPU server 1:58.42 · log warn/error 1 · event loop đứng tối đa 17740 ms
$ RAI=10 node bao.mjs 300 mu      # 300 bo: khởi động rải 0–10 s + lùi dần 1→30 s ±20 %
N=300 · nối lại LÙI DẦN 1→30 s ±20 % · socket.io có (như kho) · khởi động rải 0–10 s
    0 s  thử   29  nối   12  lỗi    0
    1 s  thử   30  nối   14  lỗi    0
    2 s  thử   40  nối   13  lỗi    0
    3 s  thử   35  nối   12  lỗi    0
    4 s  thử   30  nối   14  lỗi    0
    5 s  thử   25  nối   14  lỗi    0
    6 s  thử   30  nối   13  lỗi    0
  … (70 dòng)
   80 s  thử    4  nối    4  lỗi    0
   81 s  thử    2  nối    2  lỗi    0
   82 s  thử    1  nối    1  lỗi    0
   83 s  thử    1  nối    1  lỗi    0
   84 s  thử    2  nối    2  lỗi    0
⇒ ĐỦ 300/300 online sau 84.2 s · 1285 lần thử · lỗi: {"ECONNRESET @0s":249,"EPIPE @0s":174,"Opening handshake has timed out @5s":562} · CPU server 1:03.24 · log warn/error 0 · event loop đứng tối đa 225 ms
$ SUA=1 node bao.mjs 1000 co-dinh # server sửa ĐÚNG MỘT dòng: bcrypt.compare ⇒ sha256 (bí mật là 24 byte ngẫu nhiên)
N=1000 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho) · server SỬA: sha256 thay bcrypt
    0 s  thử 1000  nối  817  lỗi  183
    3 s  thử  183  nối  183  lỗi    0
⇒ ĐỦ 1000/1000 online sau 3.2 s · 1183 lần thử · lỗi: {"ECONNRESET @0s":183} · CPU server 0:00.85 · log warn/error 0 · event loop đứng tối đa 21 ms</div>
<div class="callout bad"><p><strong>Latent issue in this repo:</strong> 300 boards retrying every 3 s never converge (sau 120 s mới 1/300 online · 10279 lần thử · lỗi: {"Opening handshake has timed out @5s":1664,"ECONNRESET @0s":8456,"EPIPE @0s":89} · CPU server 1:58.42 · log warn/error 1 · event loop đứng tối đa 17740 ms). Each <code>bcrypt.compare</code> is ~75 ms of CPU and N of them run back to back in one event-loop turn — the boards give up after 5 s, retry in sync, and the server keeps chewing abandoned work while socket.io chat, pings and the HTTP API all stall. Backoff + jitter + a boot spread on the board converges; replacing bcrypt for the device secret (24 random bytes from <code>randomBytes(24)</code>, not a human password) with sha256 + <code>timingSafeEqual</code> removes the storm. Reproduce: lab c9 <code>node bao.mjs 300 co-dinh</code> vs <code>SUA=1 node bao.mjs 1000 co-dinh</code>.</p></div>
<p>Heartbeat of the repo&#39;s gateway, frame by frame through a proxy, then the board frozen with <code>kill -STOP</code>:</p>
<div class="out">$ sed -n '71,72p;1017,1031p' ~/api-backend/src/socket/device.gateway.ts
/** Heartbeat: ping every 30s, drop a device that misses two. */
const HEARTBEAT_MS = 30_000;
  heartbeat = setInterval(() =&gt; {
    for (const conn of connections.values()) {
      if (!conn.alive) {
        conn.ws.terminate();
        continue;
      }
      conn.alive = false;
      sendJson(conn, { t: 'ping' });
      try {
        conn.ws.ping();
      } catch {
        /* socket already gone */
      }
    }
  }, HEARTBEAT_MS);
$ node tim92.mjs       # gateway KHO + proxy đọc từng khung · bo trả ping rồi bị kill -STOP
  3.1 s [server] MakerLab device connected {"deviceId":1,"key":"mk_lab_1"}
  3.1 s [bo 1] nối được (TELE=0: không telemetry, chỉ trả ping)
 30.4 s   ↓ server→bo  14 B  chữ {"t":"ping"}
 30.4 s   ↓ server→bo   2 B  PING (khung WS)
 30.4 s   ↑ bo→server  18 B  chữ {"t":"pong"}
 30.4 s   ↑ bo→server   6 B  PONG (khung WS)
 34.5 s [lab] kill -STOP bo 1 — tiến trình treo, TCP vẫn mở, không ai trả ping
 60.4 s   ↓ server→bo  14 B  chữ {"t":"ping"}
 60.4 s   ↓ server→bo   2 B  PING (khung WS)
 90.4 s [server] MakerLab device disconnected {"deviceId":1}
 90.4 s [console An] thiết bị 1 OFFLINE — 55.9 s sau khi bo đóng băng</div>
<div class="callout info"><p><strong>Server-side visibility:</strong> the repo logs “device connected / disconnected” only — no gap, no attempt count (the <code>reconnectAttempts</code> snippet above is illustrative). Logging the gap per device and watching event-loop lag would have shown this storm first.</p></div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9: device.gateway.ts CHÉP TỪ KHO + Prisma giả; bcryptjs 2.4.3 cost 10 như makerLab.service.ts:116</span>
node bao.mjs 100 co-dinh           <span class="tok-comment">  # "điện lại": 100 bo cùng khởi động · nối lại cố định 3 s · chờ bắt tay 5 s (như arduinoWebSockets 2.7.3)</span>
node bao.mjs 300 co-dinh 1 120     <span class="tok-comment">  # 300 bo, cùng chính sách — xem có hội tụ không, event loop đứng bao lâu</span>
RAI=10 node bao.mjs 300 mu 1 120   <span class="tok-comment">  # sửa phía bo: rải lần nối đầu 0–10 s + lùi dần 1→30 s ±20 %</span>
SUA=1 node bao.mjs 1000 co-dinh    <span class="tok-comment">  # sửa phía server: bcrypt.compare ⇒ sha256 + timingSafeEqual (kho-sua/, đúng một dòng)</span>
node tim92.mjs                      <span class="tok-comment">  # nhịp tim 30 s: bo trả ping rồi bị kill -STOP — bao lâu server mới cắt?</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 13.3 — Retry, backoff, and the charge that ran three times</span><span class="lc-sub">Backoff + jitter for jobs — the same rules</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-2-4-chan-event-loop" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 2.4 — Blocking the event loop: real numbers</span><span class="lc-sub">Why 300 bcrypt compares froze every user</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-1-mat-khau-va-bam" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.1 — Storing passwords</span><span class="lc-sub">bcrypt is for low-entropy passwords, not random device keys</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Manual reconnect</span><span class="v">Raw ws has none built in — you write the loop yourself.</span></div>
  <div class="kv"><span class="k">Exponential backoff</span><span class="v">1s → 2s → 5s, capped at 30s between attempts.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">±20% randomness so devices do not reconnect in unison.</span></div>
  <div class="kv"><span class="k">Reconnect storm</span><span class="v">Synchronized reconnects that knock a just-recovered server over.</span></div>
  <div class="kv"><span class="k">Heartbeat</span><span class="v">WebSocket-native or application-level ping to detect a dead link.</span></div>
  <div class="kv"><span class="k">Gap logging</span><span class="v">Recording the time between reconnects to find unhealthy devices.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Raw-ws reconnection on the device tier must be hand-written.</li><li>Use exponential backoff: 1s → 2s → 5s, capped at 30s.</li><li>Add ±20% jitter so 1,000 devices do not power-cycle in unison.</li><li>Add a heartbeat, native or application-level, to detect a dead link.</li><li>Log the gap between reconnects server-side to spot unhealthy devices.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6455 — WebSocket ping/pong</span><span class="lc-sub">tools.ietf.org/html/rfc6455#section-5.5.2 — spec chính thức cho ping frames.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Logic reconnect thủ công</h2>
<p class="lead">Socket.io-client xử lý reconnect tự động (Chương 1.3). Raw ws + Arduino cần bạn tự viết — và với 1.000 device power-cycle cùng nhau, pattern PHẢI jitter để tránh reconnect storm.</p>

<h3>Simple exponential backoff (Arduino C++)</h3>
<pre><code class="language-cpp">// ESP32 firmware
unsigned long lastReconnect = 0;
int reconnectDelay = 1000;                   // start 1s
const int MAX_DELAY = 30000;                 // cap 30s

void loop() {
  if (!ws.isConnected()) {
    if (millis() - lastReconnect &gt; reconnectDelay) {
      Serial.printf("Reconnecting after %d ms...\\n", reconnectDelay);
      ws.begin("api.example.com", 80, "/device-ws");   // repo path: /device-ws
      lastReconnect = millis();
      reconnectDelay = min(reconnectDelay * 2, MAX_DELAY);
    }
  } else {
    reconnectDelay = 1000;                    // reset on connect
  }
  ws.loop();
}
</code></pre>

<h3>Thêm jitter — mission-critical</h3>
<pre><code class="language-cpp">// Ma khong jitter, 1000 device cung reconnect luc 30s -&gt; server SOA
int jitter = random(-500, 500);              // +/- 500ms
if (millis() - lastReconnect &gt; reconnectDelay + jitter) {
  ...
}
</code></pre>

<div class="callout warn">
<p><strong>Reconnect storm là scenario thật.</strong> Power outage: 1.000 device tắt. Điện lại 30 phút sau: 1.000 device boot cùng lúc, cùng thử connect. Server nhận 1.000 handshake trong 1 giây — có thể chết. Jitter phân phối over 1 giây.</p>
</div>

<h3>Backoff patterns comparison</h3>
<div class="out">Attempt   Simple     Jittered      Fibonacci      Constant
1         1s         0.5-1.5s      1s             5s
2         2s         1-3s          1s             5s
3         4s         2-6s          2s             5s
4         8s         4-12s         3s             5s
5         16s        8-24s         5s             5s
6         30s (cap)  15-45s        8s             5s
7         30s        15-45s        13s (cap 30s)  5s
8         30s        15-45s        30s            5s

Kho nay: Simple exponential + jitter +/- 20%.
(DO 14/11/2026: SAI — firmware goi ws.setReconnectInterval(3000): CO DINH 3 s,
 khong nhieu; WS_RECONNECT_MAX_MS va HEARTBEAT_TIMEOUT_MS khai trong config.h ma 0 cho dung.)
</div>

<h3>Server-side visibility</h3>
<pre><code class="language-ts">// device.gateway.ts
wsServer.on('connection', (ws, req) =&gt; {
  const deviceId = auth(req);
  const now = Date.now();
  const lastSeen = deviceLastConnect.get(deviceId) || 0;
  const gap = now - lastSeen;
  
  logger.info('device connected', {
    deviceId,
    gap,                           // thoi gian giua reconnect
    attempt: reconnectAttempts.get(deviceId) || 1,
  });
  
  deviceLastConnect.set(deviceId, now);
  // ...
});
</code></pre>

<div class="callout ok">
<p><strong>Log gap giữa reconnect giúp phát hiện device kém.</strong> Device 1 reconnect mỗi 30s = network unstable. Device 2 chưa reconnect trong 5 phút = dead. Alert dashboard hiển thị.</p>
</div>

<h3>Heartbeat WebSocket vs application-level</h3>
<pre><code class="language-cpp">// WebSocket-native ping frame
ws.enableHeartbeat(15000, 3000, 2);      // ping moi 15s, timeout 3s, 2 loi = disconnect

// HOAC application-level heartbeat
if (millis() - lastPing &gt; 30000) {
  ws.sendTXT("{\\"type\\":\\"ping\\"}");
  lastPing = millis();
}
</code></pre>

<p>WebSocket-native ping frame nhẹ hơn (~2 byte) nhưng một số proxy strip. Application-level ping (JSON) nặng hơn nhưng luôn qua. Kho này dùng cả hai. <em>(Đo: đúng — mỗi 30 s server gửi cả JSON <code>{"t":"ping"}</code> lẫn khung ping WebSocket, và tin bất kỳ cũng tính là còn sống. Bo đóng băng ngay sau một lượt ping vẫn “online” 55.9 s: bị cắt sau khi hụt <strong>một</strong> lượt ping, dù chú thích ở <code>device.gateway.ts:71</code> ghi “hai”. Chuyện proxy bỏ khung ping chưa đo ở đây.)</em></p>

<div class="pitfall">
<p><strong>Bẫy — retry ngay không backoff.</strong> ESP32 mất WS ở t=0. Tiếp tục thử connect mỗi 100ms → 10 lần/giây. Server thấy 10 handshake fail per second per device. 100 device = 1.000 fail/second — DDoS trên chính bạn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Raw ws reconnect ở device tier cần tự viết: exponential backoff (1s → 2s → 5s → 30s cap) + jitter ±20% để tránh 1.000 device power-cycle cùng lúc, + heartbeat WebSocket-native hoặc application-level, + log gap giữa reconnect ở server để phát hiện device kém.</p>
</div>

<h3>Lùi dần mà không đồng bộ hoá mọi client</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Theo hàm mũ, đừng theo hằng số</span><span class="lz-d">1 s, 2 s, 4 s, 8 s. Thử lại đều đặn nhắm vào một máy chủ vừa gục là một cuộc tấn công từ chối dịch vụ do chính bạn viết ra.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chặn giá trị tối đa</span><span class="lz-d">Không thì một lần gián đoạn dài sẽ đẩy độ trễ lên hàng giờ, và client vẫn mất kết nối rất lâu sau khi máy chủ đã hồi phục.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thêm nhiễu ngẫu nhiên — đây là phần người ta hay bỏ qua</span><span class="lz-d">Không có nó, mọi client cùng rớt một thời điểm sẽ cùng thử lại một thời điểm, mãi mãi. Máy chủ sống dậy rồi bị chính cơn lũ kết nối lại quật ngã.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đặt lại bộ đếm khi KẾT NỐI thành công</span><span class="lz-d">Chứ không phải khi một <em>lần thử</em> thành công: một kết nối rớt ngay lập tức thì không nên được đặt lại về mức thử lại một giây.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một cơn bão kết nối lại quật ngã máy chủ ngay khoảnh khắc nó vừa hồi phục.</strong> Mười nghìn client mất kết nối trong cùng một giây vì máy chủ khởi động lại; không có nhiễu ngẫu nhiên thì tất cả cùng chờ đúng một giây, cùng kết nối lại trong cùng một mili giây, và cái tiến trình vừa mới lên phải xử lý mười nghìn lần bắt tay cùng lúc rồi gục. Rồi nó khởi động lại, và vòng lặp tái diễn — một cú gián đoạn trông như máy chủ &quot;không trụ nổi&quot; trong khi máy chủ vẫn ổn và chính đám client mới là cái tải. Một hệ số ngẫu nhiên trên mỗi độ trễ sẽ trải đúng mười nghìn kết nối đó ra khắp cửa sổ thời gian, và nó là ba dòng mã.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tự viết một vòng reconnect với exponential backoff (1s → 2s → 5s, trần 30s) cho một client raw-ws.</li>
<li>Thêm jitter ±20% và lập luận vì sao 1.000 device không có nó sẽ power-cycle cùng lúc và quật ngã server.</li>
<li>Thêm một heartbeat (ping WebSocket-native hoặc application-level) và log phía server khoảng cách giữa các reconnect để phát hiện device kém.</li>
</ol>
<p><strong>Đạt khi:</strong> reconnect của bạn backoff có jitter và một kết nối chết được phát hiện qua một heartbeat thiếu.</p></div>

<h3>🔬 Đo thật: firmware của kho làm gì, và một cơn bão nối lại thật</h3>
<p>Firmware (14/11/2026) — khoảng nối lại <strong>cố định</strong> 3 s, không nhiễu; hai hằng số “khôn hơn” không chỗ nào dùng; thư viện bỏ cú bắt tay sau 5 s; server kiểm bí mật thiết bị bằng bcrypt:</p>
<div class="out">$ grep -n "WS_RECONNECT\\|HEARTBEAT_TIMEOUT" firmware/mini-me-robot/src/config.h
433:#define WS_RECONNECT_BASE_MS 3000
434:#define WS_RECONNECT_MAX_MS  30000
436:#define HEARTBEAT_TIMEOUT_MS  90000  // 3 lần ping của server bị lỡ
$ grep -rn "WS_RECONNECT_MAX_MS\\|HEARTBEAT_TIMEOUT_MS" firmware/mini-me-robot/src/ | grep -v "config.h" | wc -l     # chỗ DÙNG hai hằng số này
       0
$ sed -n '243,247p' .pio/libdeps/mini-me/WebSockets/src/WebSocketsClient.cpp     # vòng loop() của thư viện
    if(!clientIsConnected(&amp;_client)) {
        // do not flood the server
        if((millis() - _lastConnectionFail) &lt; _reconnectInterval) {
            return;
        }
$ grep -n "WEBSOCKETS_TCP_TIMEOUT (" .pio/libdeps/mini-me/WebSockets/src/WebSockets.h     # hạn chờ bắt tay
125:#define WEBSOCKETS_TCP_TIMEOUT (5000)
$ grep -n "randomBytes(24)\\|secretHash = await bcrypt.hash\\|bcrypt.compare(secret, device" src/services/makerlab/makerLab.service.ts src/socket/device.gateway.ts
src/services/makerlab/makerLab.service.ts:115:  const secret = randomBytes(24).toString('base64url');
src/services/makerlab/makerLab.service.ts:116:  const secretHash = await bcrypt.hash(secret, 10);
src/services/makerlab/makerLab.service.ts:134:  const secret = randomBytes(24).toString('base64url');
src/services/makerlab/makerLab.service.ts:135:  const secretHash = await bcrypt.hash(secret, 10);
src/socket/device.gateway.ts:916:  const ok = await bcrypt.compare(secret, device.secretHash);</div>
<p>“Điện lại”: N bo mạch giả cùng khởi động một lúc, nối vào <code>device.gateway.ts</code> của kho (chép nguyên, DB trong RAM, bcrypt cost 10 thật), mỗi bo theo luật của thư viện; đếm từng giây:</p>
<div class="out">$ node bao.mjs 100 co-dinh        # "điện lại": 100 bo cùng khởi động · gateway KHO · nối lại cố định 3 s như firmware
N=100 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho)
    0 s  thử  100  nối    1  lỗi    0
    5 s  thử    0  nối    0  lỗi   99
    8 s  thử   99  nối    1  lỗi    0
   11 s  thử    0  nối   51  lỗi    1
   12 s  thử    0  nối   13  lỗi    0
   13 s  thử    0  nối    1  lỗi   32
   14 s  thử    1  nối    0  lỗi    0
   15 s  thử    0  nối    1  lỗi    0
   16 s  thử   32  nối    1  lỗi    0
   18 s  thử    0  nối   31  lỗi    0
⇒ ĐỦ 100/100 online sau 18.4 s · 232 lần thử · lỗi: {"Opening handshake has timed out @5s":131,"ECONNRESET @4s":1} · CPU server 0:17.29 · log warn/error 0 · event loop đứng tối đa 7216 ms
$ node bao.mjs 300 co-dinh        # 300 bo, cùng chính sách
N=300 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho)
    0 s  thử  300  nối    1  lỗi    0
    5 s  thử    0  nối    0  lỗi  299
    8 s  thử  299  nối    0  lỗi  233
   11 s  thử  233  nối    0  lỗi  233
   13 s  thử    0  nối    0  lỗi   66
   14 s  thử  233  nối    0  lỗi  233
   16 s  thử   66  nối    0  lỗi   66
  … (106 dòng)
  125 s  thử  143  nối    0  lỗi  141
  126 s  thử   71  nối    0  lỗi   72
  127 s  thử   18  nối    0  lỗi   18
  128 s  thử  141  nối    0  lỗi  141
  129 s  thử   72  nối    0  lỗi   71
⇒ sau 120 s mới 1/300 online · 10279 lần thử · lỗi: {"Opening handshake has timed out @5s":1664,"ECONNRESET @0s":8456,"EPIPE @0s":89} · CPU server 1:58.42 · log warn/error 1 · event loop đứng tối đa 17740 ms
$ RAI=10 node bao.mjs 300 mu      # 300 bo: khởi động rải 0–10 s + lùi dần 1→30 s ±20 %
N=300 · nối lại LÙI DẦN 1→30 s ±20 % · socket.io có (như kho) · khởi động rải 0–10 s
    0 s  thử   29  nối   12  lỗi    0
    1 s  thử   30  nối   14  lỗi    0
    2 s  thử   40  nối   13  lỗi    0
    3 s  thử   35  nối   12  lỗi    0
    4 s  thử   30  nối   14  lỗi    0
    5 s  thử   25  nối   14  lỗi    0
    6 s  thử   30  nối   13  lỗi    0
  … (70 dòng)
   80 s  thử    4  nối    4  lỗi    0
   81 s  thử    2  nối    2  lỗi    0
   82 s  thử    1  nối    1  lỗi    0
   83 s  thử    1  nối    1  lỗi    0
   84 s  thử    2  nối    2  lỗi    0
⇒ ĐỦ 300/300 online sau 84.2 s · 1285 lần thử · lỗi: {"ECONNRESET @0s":249,"EPIPE @0s":174,"Opening handshake has timed out @5s":562} · CPU server 1:03.24 · log warn/error 0 · event loop đứng tối đa 225 ms
$ SUA=1 node bao.mjs 1000 co-dinh # server sửa ĐÚNG MỘT dòng: bcrypt.compare ⇒ sha256 (bí mật là 24 byte ngẫu nhiên)
N=1000 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho) · server SỬA: sha256 thay bcrypt
    0 s  thử 1000  nối  817  lỗi  183
    3 s  thử  183  nối  183  lỗi    0
⇒ ĐỦ 1000/1000 online sau 3.2 s · 1183 lần thử · lỗi: {"ECONNRESET @0s":183} · CPU server 0:00.85 · log warn/error 0 · event loop đứng tối đa 21 ms</div>
<div class="callout bad"><p><strong>Lỗi tiềm ẩn của kho:</strong> 300 bo nối lại mỗi 3 s không bao giờ hội tụ (sau 120 s mới 1/300 online · 10279 lần thử · lỗi: {"Opening handshake has timed out @5s":1664,"ECONNRESET @0s":8456,"EPIPE @0s":89} · CPU server 1:58.42 · log warn/error 1 · event loop đứng tối đa 17740 ms). Mỗi <code>bcrypt.compare</code> tốn ~75 ms CPU và N lần chạy liền nhau trong một lượt event loop — bo bỏ cuộc ở 5 s, thử lại đồng loạt, server vẫn nhai việc đã bị bỏ, trong khi chat socket.io, nhịp ping và API HTTP đều đứng. Lùi dần + nhiễu + rải lần nối đầu ở bo thì hội tụ; thay bcrypt cho bí mật thiết bị (24 byte ngẫu nhiên từ <code>randomBytes(24)</code>, không phải mật khẩu người gõ) bằng sha256 + <code>timingSafeEqual</code> thì hết bão. Tái hiện: lab c9 <code>node bao.mjs 300 co-dinh</code> vs <code>SUA=1 node bao.mjs 1000 co-dinh</code>.</p></div>
<p>Nhịp tim của gateway kho, từng khung qua proxy, rồi bo bị đóng băng bằng <code>kill -STOP</code>:</p>
<div class="out">$ sed -n '71,72p;1017,1031p' ~/api-backend/src/socket/device.gateway.ts
/** Heartbeat: ping every 30s, drop a device that misses two. */
const HEARTBEAT_MS = 30_000;
  heartbeat = setInterval(() =&gt; {
    for (const conn of connections.values()) {
      if (!conn.alive) {
        conn.ws.terminate();
        continue;
      }
      conn.alive = false;
      sendJson(conn, { t: 'ping' });
      try {
        conn.ws.ping();
      } catch {
        /* socket already gone */
      }
    }
  }, HEARTBEAT_MS);
$ node tim92.mjs       # gateway KHO + proxy đọc từng khung · bo trả ping rồi bị kill -STOP
  3.1 s [server] MakerLab device connected {"deviceId":1,"key":"mk_lab_1"}
  3.1 s [bo 1] nối được (TELE=0: không telemetry, chỉ trả ping)
 30.4 s   ↓ server→bo  14 B  chữ {"t":"ping"}
 30.4 s   ↓ server→bo   2 B  PING (khung WS)
 30.4 s   ↑ bo→server  18 B  chữ {"t":"pong"}
 30.4 s   ↑ bo→server   6 B  PONG (khung WS)
 34.5 s [lab] kill -STOP bo 1 — tiến trình treo, TCP vẫn mở, không ai trả ping
 60.4 s   ↓ server→bo  14 B  chữ {"t":"ping"}
 60.4 s   ↓ server→bo   2 B  PING (khung WS)
 90.4 s [server] MakerLab device disconnected {"deviceId":1}
 90.4 s [console An] thiết bị 1 OFFLINE — 55.9 s sau khi bo đóng băng</div>
<div class="callout info"><p><strong>Nhìn từ server:</strong> kho chỉ log “device connected / disconnected” — không có khoảng cách, không đếm lần thử (đoạn <code>reconnectAttempts</code> ở trên là minh hoạ). Log khoảng cách theo từng thiết bị và theo dõi độ trễ event loop sẽ cho thấy cơn bão này trước tiên.</p></div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9: device.gateway.ts CHÉP TỪ KHO + Prisma giả; bcryptjs 2.4.3 cost 10 như makerLab.service.ts:116</span>
node bao.mjs 100 co-dinh           <span class="tok-comment">  # "điện lại": 100 bo cùng khởi động · nối lại cố định 3 s · chờ bắt tay 5 s (như arduinoWebSockets 2.7.3)</span>
node bao.mjs 300 co-dinh 1 120     <span class="tok-comment">  # 300 bo, cùng chính sách — xem có hội tụ không, event loop đứng bao lâu</span>
RAI=10 node bao.mjs 300 mu 1 120   <span class="tok-comment">  # sửa phía bo: rải lần nối đầu 0–10 s + lùi dần 1→30 s ±20 %</span>
SUA=1 node bao.mjs 1000 co-dinh    <span class="tok-comment">  # sửa phía server: bcrypt.compare ⇒ sha256 + timingSafeEqual (kho-sua/, đúng một dòng)</span>
node tim92.mjs                      <span class="tok-comment">  # nhịp tim 30 s: bo trả ping rồi bị kill -STOP — bao lâu server mới cắt?</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 13.3 — Thất bại: thử lại, backoff, và cú trừ tiền chạy ba lần</span><span class="lc-sub">Backoff + jitter cho job — cùng luật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-2-4-chan-event-loop" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 2.4 — Chặn event loop: đo bằng số thật</span><span class="lc-sub">Vì sao 300 lần bcrypt làm đứng mọi người dùng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-1-mat-khau-va-bam" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.1 — Lưu mật khẩu: vì sao gần như mọi cách đều sai</span><span class="lc-sub">bcrypt dành cho mật khẩu ít entropy, không cho khoá thiết bị ngẫu nhiên</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reconnect thủ công</span><span class="v">Raw ws không có sẵn — bạn tự viết vòng lặp.</span></div>
  <div class="kv"><span class="k">Exponential backoff</span><span class="v">1s → 2s → 5s, trần 30s giữa các lần.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">Ngẫu nhiên ±20% để device không reconnect cùng lúc.</span></div>
  <div class="kv"><span class="k">Reconnect storm</span><span class="v">Reconnect đồng bộ quật ngã một server vừa hồi phục.</span></div>
  <div class="kv"><span class="k">Heartbeat</span><span class="v">Ping WebSocket-native hoặc application-level để phát hiện link chết.</span></div>
  <div class="kv"><span class="k">Log gap</span><span class="v">Ghi thời gian giữa các reconnect để tìm device kém.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Reconnect raw-ws ở device tier phải tự viết.</li><li>Dùng exponential backoff: 1s → 2s → 5s, trần 30s.</li><li>Thêm jitter ±20% để 1.000 device không power-cycle cùng lúc.</li><li>Thêm một heartbeat, native hoặc application-level, để phát hiện link chết.</li><li>Log khoảng cách giữa các reconnect phía server để phát hiện device kém.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6455 — WebSocket ping/pong</span><span class="lc-sub">tools.ietf.org/html/rfc6455#section-5.5.2 — spec chính thức cho ping frames.</span></span></div>
</div>
`,
    },

    {
      title: '9.3 — Message framing: JSON is not free|||9.3 — Message framing: JSON không miễn phí',
      slug: 'io-9-3-framing',
      type: 'VIDEO',
      description: 'ESP32 phân tích JSON chậm và tốn RAM (~2 KB per JSON parse). Alternatives: MessagePack, Protobuf, hoặc binary custom format cho telemetry high-frequency.',
      content: `
${G09_3}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Message framing: JSON is not free</h2>
<p class="lead">On a server with 8 GB RAM, JSON.parse costs nothing. On an ESP32 with 320 KB RAM, parsing a 500-byte JSON message allocates ~2 KB and takes ~5 ms. For high-frequency telemetry, that&#39;s a real cost.</p>

<h3>Trade offs by format</h3>
<div class="out">Format         Size   Parse (ESP32)  Human-readable  Type-safe
JSON           1x     ~5 ms         YES             NO
MessagePack    ~0.7x  ~2 ms         NO              NO
Protobuf       ~0.5x  ~1 ms         NO              YES (schema)
CBOR           ~0.7x  ~2 ms         NO              NO
Custom binary  0.3x   ~0.1 ms       NO              custom
</div>

<h3>JSON — starting point</h3>
<pre><code class="language-cpp">// Arduino send
StaticJsonDocument&lt;200&gt; doc;
doc["temp"] = 25.3;
doc["hum"] = 60;
doc["ts"] = millis();
String json;
serializeJson(doc, json);
ws.sendTXT(json);                          // ~50 byte

// Server receive
socket.on('message', (data) =&gt; {
  const t = JSON.parse(data.toString());
  processTelemetry(t);
});
</code></pre>

<h3>Custom binary — cho telemetry high-freq</h3>
<pre><code class="language-cpp">// 8 byte: 2 float + 4 byte timestamp
uint8_t buf[8];
memcpy(buf,     &amp;temp, 4);
memcpy(buf + 4, &amp;hum,  4);
ws.sendBIN(buf, 8);                        // 8 byte, khong 50
</code></pre>

<pre><code class="language-ts">// Server receive
socket.on('message', (data) =&gt; {
  if (data instanceof Buffer) {
    const temp = data.readFloatLE(0);
    const hum  = data.readFloatLE(4);
    processTelemetry({ temp, hum });
  }
});
</code></pre>

<div class="callout ok">
<p><strong>You save 6× on bandwidth and 50× on parse time.</strong> A device sending telemetry once a second for 24 hours is 86,400 messages a day. At 50 JSON bytes × 86,400 that is 4.3 MB/day/device. At 8 binary bytes × 86,400 it is 690 KB/day/device.</p>
</div>

<h3>Trade off — lost debuggability</h3>
<pre><code class="language-text">JSON: co the tail log va doc thang
  {"temp": 25.3, "hum": 60, "ts": 12345}

Binary: hex, phai decode
  1a 47 ca 41 00 00 70 42 39 30 00 00
</code></pre>

<p>Debugging binary is far harder. If telemetry is sparse (~1/s), JSON is good enough. If it is dense (~10/s), consider binary.</p>

<h3>The switching thresholds</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">low freq</span><span class="lz-t">&lt;1 msg/s per device</span><span class="lz-d">JSON. Easy to debug, bandwidth is fine.</span></div>
<div class="lz-step"><span class="lz-k">med freq</span><span class="lz-t">1-10 msg/s per device</span><span class="lz-d">MessagePack or CBOR. Semi-readable with the right tools, and compresses well.</span></div>
<div class="lz-step"><span class="lz-k">high freq</span><span class="lz-t">&gt;10 msg/s per device</span><span class="lz-d">Custom binary or Protobuf. Requires a schema or protocol document. Expensive in maintainability.</span></div>
</div>

<h3>This repo — JSON for almost everything</h3>
<pre><code class="language-ts">// device.gateway.ts
ws.on('message', (data) =&gt; {
  try {
    const parsed = JSON.parse(data.toString());
    // ...
  } catch (err) {
    logger.warn('invalid message from device', { deviceId, error: err.message });
    ws.close(1002, 'invalid JSON');   // repo: NO close — device.gateway.ts:774 "malformed frame: ignore, don't kill the link"
  }
});
</code></pre>

<p>Maker Lab today is ~10 devices at ~1 telemetry message a second. JSON is more than enough. If it scales to 1,000 devices, reconsider binary.</p>

<div class="pitfall">
<p><strong>Trap — using Protobuf without schema versioning.</strong> Client v1 sends field A. Server v2 expects field B. Migration is painful without a plan. Protobuf schema versioning is a skill of its own — adopting it is a decision to take on complexity.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Message framing for devices: JSON is good enough at low frequency (~1/s per device) and easy to debug; custom binary or Protobuf at high frequency (>10/s) cuts bandwidth 6× and parse time 50× at the cost of debuggability and schema management; this repo uses JSON because of its current scale (~10 devices).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Send device telemetry as JSON at ~1/s and confirm it is easy to read and debug on the wire.</li>
<li>Re-encode the same payload as custom binary or Protobuf and measure the bandwidth and parse-time difference (roughly 6× and 50×).</li>
<li>Decide, for a ~10-device scale, whether the binary savings justify the loss of debuggability and the schema management.</li>
</ol>
<p><strong>Done when:</strong> you can state the frequency threshold where binary beats JSON and why this repo stays on JSON.</p></div>

<h3>🔬 Measured: what the repo puts on the wire, and what each encoding costs</h3>
<p>The firmware (14/11/2026): telemetry is one JSON text frame per second with 13 fields + <code>t</code> (not ~50 B), and voice goes up as <strong>binary</strong> 2 KB frames; the gateway <strong>ignores</strong> a frame that is not JSON:</p>
<div class="out">$ grep -n "static void sendTelemetry\\|StaticJsonDocument&lt;256&gt;\\|ws.sendTXT(out)\\|static uint8_t upBuf\\|ws.sendBIN" firmware/mini-me-robot/src/main.cpp
461:  StaticJsonDocument&lt;256&gt; doc;
476:  ws.sendTXT(out);
480:  StaticJsonDocument&lt;256&gt; doc;
486:  ws.sendTXT(out);
489:static void sendTelemetry() {
490:  StaticJsonDocument&lt;256&gt; doc;
556:  ws.sendTXT(out);
567:  ws.sendTXT(out);
578:static uint8_t upBuf[2048];
589:  if (st.wsUp) ws.sendBIN(upBuf, upLen);
$ sed -n '489,560p' firmware/mini-me-robot/src/main.cpp | grep -o 'doc\\["[a-zA-Z]*"\\]' | tr '\\n' ' '     # các trường telemetry
doc["t"] doc["rssi"] doc["uptime"] doc["heapKb"] doc["psramKb"] doc["micLevel"] doc["turns"] doc["hutDem"] doc["hutMs"] doc["roiByte"] doc["ssid"] doc["pingMs"] doc["battery"] doc["batV"] 
$ sed -n '770,775p;73,80p' src/socket/device.gateway.ts
/** 16-bit mono @16 kHz = 32 KB/s. 30s cap keeps one rogue device from eating RAM. */
const MAX_AUDIO_BYTES = 32_000 * 30;
/** Telemetry arrives ~1 Hz; persisting every row would be 86k/day/device. */
const TELEMETRY_PERSIST_MS = 10_000;
/** Keep the device log table from growing without bound. */
const LOG_RING_SIZE = 1000;
/** One board, one socket. A reconnect kicks the stale one. */
const MAX_FRAME_BYTES = 256 * 1024;
  let msg: Record&lt;string, unknown&gt;;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return; // malformed frame: ignore, don't kill the link
  }</div>
<p>The same real telemetry packet, five encodings (Node 22 on a Mac — the ESP32 parse times above were <em>not</em> measured here):</p>
<div class="out">$ node khung93.mjs
một gói = 13 trường của firmware · đo 200.000 lần mã + giải
cách             byte  ×JSON   mã+giải/gói   MB/ngày (1 Hz)  đọc bằng mắt
JSON              186   1.00      2.17 µs        16.59       có
MessagePack       138   0.74      4.30 µs        12.44       không
CBOR              143   0.77      2.54 µs        12.87       không
Protobuf           41   0.22      1.70 µs         4.06       không
tự gói (struct)    40   0.22      1.19 µs         3.97       không
(MB/ngày tính cả 6 B đầu khung WS có mặt nạ; chưa tính TCP/IP ~52 B mỗi gói nếu mỗi tin đi một gói riêng)
hex tự gói: c3 9e 0e 00 00 76 00 a3 1e 38 01 0e 00 00 00 00 00 00 00 00 00 00 00 2a 00 57 3d 0a 3f 41 09 4e 68 61 2d 43 75 6f 6e 67</div>
<p>One second of voice (32,000 B PCM in 2 KB chunks, like the firmware) three ways, bytes counted on the wire:</p>
<div class="out">$ node do93.mjs      # 1 giây tiếng nói, khối 2 KB như firmware — ba đường, proxy đếm byte
1 giây tiếng = 32.000 B PCM · 16 khối 2048 B (+ khung bắt đầu/kết thúc)
  ws thô (kho): sendBIN               32.176 B trên dây · 18 khung · +0.6%
  socket.io: emit('audio', Buffer)    32.956 B trên dây · 34 khung · +3.0%
  socket.io: JSON base64              43.212 B trên dây · 18 khung · +35.0%</div>
<p>The repo&#39;s gateway at its limits:</p>
<div class="out">$ node gay93.mjs     # gateway KHO: khung hỏng · khung 300 KB · lượt nghe &gt; 30 s
1) khung chữ không phải JSON, rồi một tin hợp lệ:
  388 ms   kết nối: VẪN MỞ
2) một khung nhị phân 300.000 B (maxPayload = 256 KB):
  392 ms   ✕ đóng 1009 
3) một lượt nghe: 470 khối 2.048 B = 962.560 B (&gt; 30 s tiếng = 960.000 B):
  885 ms   ↓ {"t":"error","scope":"audio","msg":"turn too long, buffer reset"}
 1386 ms   kết nối: VẪN MỞ</div>
<div class="callout info"><p><strong>Read it:</strong> the high-frequency stream in this repo (voice, ~16 frames/s) is <em>already</em> binary — raw frames cost +0.6%, socket.io binary +3% but twice the frames, base64-in-JSON +35% (the “~33%” in the repo&#39;s comment). Telemetry stays JSON at 1 Hz: ~16.6 MB/day per board on the wire, about nine minutes of listening; the gateway persists one row per 10 s (8,640/day). A bad frame is ignored; a frame over 256 KB closes with 1009; a turn over 30 s gets a JSON error and a reset buffer.</p></div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9 — Node 22 trên Mac (KHÔNG phải ESP32)</span>
npm i @msgpack/msgpack cbor-x@1.6.0 protobufjs@7.5.4
node khung93.mjs            <span class="tok-comment">  # gói telemetry ĐÚNG các trường firmware (main.cpp:489-540) mã 5 cách: byte · µs · MB/ngày</span>
npx tsx may9.ts &amp;           <span class="tok-comment">  # gateway KHO trên :19910</span>
node do93.mjs               <span class="tok-comment">  # 1 giây tiếng (16 khối 2 KB như main.cpp:578): ws thô · socket.io nhị phân · base64</span>
node gay93.mjs              <span class="tok-comment">  # khung không phải JSON · khung 300 KB (&gt; maxPayload 256 KB) · lượt nghe &gt; 30 s</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: binary data</span><span class="lc-sub">readInt8 / writeUInt32LE — the tools of a packed struct</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Streams</span><span class="lc-sub">Continuous data like the voice stream</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-1-1-tu-console-toi-json" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 1.1 — From console.log to a machine-readable line</span><span class="lc-sub">Why readable JSON logs pay off</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Message framing</span><span class="v">How a payload is encoded on the wire (JSON vs binary).</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">Good enough at low frequency (~1/s) and easy to debug.</span></div>
  <div class="kv"><span class="k">Custom binary / Protobuf</span><span class="v">High-frequency choice: ~6× bandwidth and ~50× parse savings.</span></div>
  <div class="kv"><span class="k">Frequency threshold</span><span class="v">Around &gt;10/s per device is where binary starts to pay off.</span></div>
  <div class="kv"><span class="k">Debuggability</span><span class="v">JSON is human-readable; binary needs tooling to inspect.</span></div>
  <div class="kv"><span class="k">Schema management</span><span class="v">Binary formats need a versioned schema you must maintain.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>JSON framing is good enough at low frequency (~1/s per device) and easy to debug.</li><li>Custom binary or Protobuf at high frequency (&gt;10/s) cuts bandwidth ~6× and parse time ~50×.</li><li>The binary cost is debuggability and schema management.</li><li>The choice is a frequency threshold, not a universal rule.</li><li>This repo uses JSON because of its current scale (~10 devices).</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ArduinoJson</span><span class="lc-sub">arduinojson.org — chuẩn cho JSON trên ESP32/Arduino.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MessagePack</span><span class="lc-sub">msgpack.org — binary JSON-compatible, có lib cho C++ và JS.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Message framing: JSON không miễn phí</h2>
<p class="lead">Trên server 8 GB RAM, JSON.parse tốn không gì. Trên ESP32 có 320 KB RAM, parse message JSON 500 byte allocate ~2 KB và tốn ~5 ms. Cho telemetry high-frequency, cost thật.</p>

<h3>Trade off theo format</h3>
<div class="out">Format         Size   Parse (ESP32)  Human-readable  Type-safe
JSON           1x     ~5 ms         YES             NO
MessagePack    ~0.7x  ~2 ms         NO              NO
Protobuf       ~0.5x  ~1 ms         NO              YES (schema)
CBOR           ~0.7x  ~2 ms         NO              NO
Custom binary  0.3x   ~0.1 ms       NO              custom
</div>

<h3>JSON — điểm xuất phát</h3>
<pre><code class="language-cpp">// Arduino send
StaticJsonDocument&lt;200&gt; doc;
doc["temp"] = 25.3;
doc["hum"] = 60;
doc["ts"] = millis();
String json;
serializeJson(doc, json);
ws.sendTXT(json);                          // ~50 byte

// Server receive
socket.on('message', (data) =&gt; {
  const t = JSON.parse(data.toString());
  processTelemetry(t);
});
</code></pre>

<h3>Custom binary — cho telemetry high-freq</h3>
<pre><code class="language-cpp">// 8 byte: 2 float + 4 byte timestamp
uint8_t buf[8];
memcpy(buf,     &amp;temp, 4);
memcpy(buf + 4, &amp;hum,  4);
ws.sendBIN(buf, 8);                        // 8 byte, khong 50
</code></pre>

<pre><code class="language-ts">// Server receive
socket.on('message', (data) =&gt; {
  if (data instanceof Buffer) {
    const temp = data.readFloatLE(0);
    const hum  = data.readFloatLE(4);
    processTelemetry({ temp, hum });
  }
});
</code></pre>

<div class="callout ok">
<p><strong>Bạn tiết kiệm 6× bandwidth + 50× parse time.</strong> Với device gửi telemetry 1 lần/giây trong 24h = 86.400 msg/day. JSON 50 byte × 86400 = 4.3 MB/day/device. Binary 8 byte × 86400 = 690 KB/day/device.</p>
</div>

<h3>Trade off — mất debuggability</h3>
<pre><code class="language-text">JSON: co the tail log va doc thang
  {"temp": 25.3, "hum": 60, "ts": 12345}

Binary: hex, phai decode
  1a 47 ca 41 00 00 70 42 39 30 00 00
</code></pre>

<p>Debug binary khó hơn nhiều. Nếu telemetry ít (~1/s), JSON đủ tốt. Nếu cao (~10/s), cân nhắc binary.</p>

<h3>Ngưỡng chuyển đổi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">low freq</span><span class="lz-t">&lt;1 msg/s per device</span><span class="lz-d">JSON. Debug dễ, bandwidth OK.</span></div>
<div class="lz-step"><span class="lz-k">med freq</span><span class="lz-t">1-10 msg/s per device</span><span class="lz-d">MessagePack hoặc CBOR. Semi-readable với tools, nén tốt.</span></div>
<div class="lz-step"><span class="lz-k">high freq</span><span class="lz-t">&gt;10 msg/s per device</span><span class="lz-d">Custom binary hoặc Protobuf. Cần schema/protocol doc. Đắt về maintainability.</span></div>
</div>

<h3>Kho này — JSON cho MOST</h3>
<pre><code class="language-ts">// device.gateway.ts
ws.on('message', (data) =&gt; {
  try {
    const parsed = JSON.parse(data.toString());
    // ...
  } catch (err) {
    logger.warn('invalid message from device', { deviceId, error: err.message });
    ws.close(1002, 'invalid JSON');   // repo: NO close — device.gateway.ts:774 "malformed frame: ignore, don't kill the link"
  }
});
</code></pre>

<p>Maker Lab hôm nay là ~10 device, telemetry ~1/s. JSON dư giả. Nếu scale lên 1000 device, cân nhắc binary.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng Protobuf mà không schema versioning.</strong> Client v1 send Field A. Server v2 expect Field B. Migration khó nếu không plan trước. Protobuf schema versioning là separate skill — quyết định adopt = quyết định tăng complexity.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Message framing cho device: JSON đủ tốt cho low-freq (~1/s per device) với debug dễ; binary custom hoặc Protobuf cho high-freq (>10/s) giảm 6× bandwidth + 50× parse time nhưng cost debug + schema management; kho này dùng JSON vì scale hiện tại (~10 device).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Gửi telemetry thiết bị dưới dạng JSON ở ~1/s và xác nhận nó dễ đọc và debug trên dây.</li>
<li>Mã lại cùng payload thành binary custom hoặc Protobuf và đo chênh lệch bandwidth và parse time (khoảng 6× và 50×).</li>
<li>Quyết, ở scale ~10 device, liệu khoản tiết kiệm binary có đáng mất debug và schema management không.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nêu được ngưỡng tần suất nơi binary thắng JSON và vì sao kho này ở lại JSON.</p></div>

<h3>🔬 Đo thật: kho đặt gì lên dây, và mỗi cách mã hoá tốn bao nhiêu</h3>
<p>Firmware (14/11/2026): telemetry là một khung chữ JSON mỗi giây, 13 trường + <code>t</code> (không phải ~50 B); tiếng nói đi lên bằng khung <strong>nhị phân</strong> 2 KB; gateway <strong>bỏ qua</strong> khung không phải JSON:</p>
<div class="out">$ grep -n "static void sendTelemetry\\|StaticJsonDocument&lt;256&gt;\\|ws.sendTXT(out)\\|static uint8_t upBuf\\|ws.sendBIN" firmware/mini-me-robot/src/main.cpp
461:  StaticJsonDocument&lt;256&gt; doc;
476:  ws.sendTXT(out);
480:  StaticJsonDocument&lt;256&gt; doc;
486:  ws.sendTXT(out);
489:static void sendTelemetry() {
490:  StaticJsonDocument&lt;256&gt; doc;
556:  ws.sendTXT(out);
567:  ws.sendTXT(out);
578:static uint8_t upBuf[2048];
589:  if (st.wsUp) ws.sendBIN(upBuf, upLen);
$ sed -n '489,560p' firmware/mini-me-robot/src/main.cpp | grep -o 'doc\\["[a-zA-Z]*"\\]' | tr '\\n' ' '     # các trường telemetry
doc["t"] doc["rssi"] doc["uptime"] doc["heapKb"] doc["psramKb"] doc["micLevel"] doc["turns"] doc["hutDem"] doc["hutMs"] doc["roiByte"] doc["ssid"] doc["pingMs"] doc["battery"] doc["batV"] 
$ sed -n '770,775p;73,80p' src/socket/device.gateway.ts
/** 16-bit mono @16 kHz = 32 KB/s. 30s cap keeps one rogue device from eating RAM. */
const MAX_AUDIO_BYTES = 32_000 * 30;
/** Telemetry arrives ~1 Hz; persisting every row would be 86k/day/device. */
const TELEMETRY_PERSIST_MS = 10_000;
/** Keep the device log table from growing without bound. */
const LOG_RING_SIZE = 1000;
/** One board, one socket. A reconnect kicks the stale one. */
const MAX_FRAME_BYTES = 256 * 1024;
  let msg: Record&lt;string, unknown&gt;;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return; // malformed frame: ignore, don't kill the link
  }</div>
<p>Cùng gói telemetry thật, năm cách mã hoá (Node 22 trên Mac — thời gian parse trên ESP32 ở trên <em>không</em> đo ở đây):</p>
<div class="out">$ node khung93.mjs
một gói = 13 trường của firmware · đo 200.000 lần mã + giải
cách             byte  ×JSON   mã+giải/gói   MB/ngày (1 Hz)  đọc bằng mắt
JSON              186   1.00      2.17 µs        16.59       có
MessagePack       138   0.74      4.30 µs        12.44       không
CBOR              143   0.77      2.54 µs        12.87       không
Protobuf           41   0.22      1.70 µs         4.06       không
tự gói (struct)    40   0.22      1.19 µs         3.97       không
(MB/ngày tính cả 6 B đầu khung WS có mặt nạ; chưa tính TCP/IP ~52 B mỗi gói nếu mỗi tin đi một gói riêng)
hex tự gói: c3 9e 0e 00 00 76 00 a3 1e 38 01 0e 00 00 00 00 00 00 00 00 00 00 00 2a 00 57 3d 0a 3f 41 09 4e 68 61 2d 43 75 6f 6e 67</div>
<p>Một giây tiếng (32.000 B PCM, khối 2 KB như firmware) theo ba đường, đếm byte trên dây:</p>
<div class="out">$ node do93.mjs      # 1 giây tiếng nói, khối 2 KB như firmware — ba đường, proxy đếm byte
1 giây tiếng = 32.000 B PCM · 16 khối 2048 B (+ khung bắt đầu/kết thúc)
  ws thô (kho): sendBIN               32.176 B trên dây · 18 khung · +0.6%
  socket.io: emit('audio', Buffer)    32.956 B trên dây · 34 khung · +3.0%
  socket.io: JSON base64              43.212 B trên dây · 18 khung · +35.0%</div>
<p>Gateway của kho ở giới hạn:</p>
<div class="out">$ node gay93.mjs     # gateway KHO: khung hỏng · khung 300 KB · lượt nghe &gt; 30 s
1) khung chữ không phải JSON, rồi một tin hợp lệ:
  388 ms   kết nối: VẪN MỞ
2) một khung nhị phân 300.000 B (maxPayload = 256 KB):
  392 ms   ✕ đóng 1009 
3) một lượt nghe: 470 khối 2.048 B = 962.560 B (&gt; 30 s tiếng = 960.000 B):
  885 ms   ↓ {"t":"error","scope":"audio","msg":"turn too long, buffer reset"}
 1386 ms   kết nối: VẪN MỞ</div>
<div class="callout info"><p><strong>Đọc:</strong> luồng tần suất cao của kho (tiếng, ~16 khung/s) <em>đã</em> là nhị phân — khung trần +0,6%, socket.io nhị phân +3% nhưng gấp đôi số khung, base64 trong JSON +35% (chính là “~33%” trong chú thích của kho). Telemetry giữ JSON ở 1 Hz: ~16,6 MB/ngày mỗi bo trên dây, bằng chừng chín phút nghe; gateway lưu một dòng mỗi 10 s (8.640/ngày). Khung hỏng bị bỏ qua; khung trên 256 KB đóng 1009; lượt nói trên 30 s nhận lỗi JSON và xoá đệm.</p></div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9 — Node 22 trên Mac (KHÔNG phải ESP32)</span>
npm i @msgpack/msgpack cbor-x@1.6.0 protobufjs@7.5.4
node khung93.mjs            <span class="tok-comment">  # gói telemetry ĐÚNG các trường firmware (main.cpp:489-540) mã 5 cách: byte · µs · MB/ngày</span>
npx tsx may9.ts &amp;           <span class="tok-comment">  # gateway KHO trên :19910</span>
node do93.mjs               <span class="tok-comment">  # 1 giây tiếng (16 khối 2 KB như main.cpp:578): ws thô · socket.io nhị phân · base64</span>
node gay93.mjs              <span class="tok-comment">  # khung không phải JSON · khung 300 KB (&gt; maxPayload 256 KB) · lượt nghe &gt; 30 s</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: dữ liệu nhị phân</span><span class="lc-sub">readInt8 / writeUInt32LE — đồ nghề của một gói tự gói</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Stream: thí nghiệm với file 348 MB</span><span class="lc-sub">Dữ liệu chảy liên tục như luồng tiếng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-1-1-tu-console-toi-json" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 1.1 — Từ console.log tới một dòng máy đọc được</span><span class="lc-sub">Vì sao log JSON đọc được đáng giá</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Message framing</span><span class="v">Cách một payload được mã hoá trên dây (JSON vs binary).</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">Đủ tốt ở tần suất thấp (~1/s) và dễ debug.</span></div>
  <div class="kv"><span class="k">Binary custom / Protobuf</span><span class="v">Lựa chọn high-freq: tiết kiệm ~6× bandwidth và ~50× parse.</span></div>
  <div class="kv"><span class="k">Ngưỡng tần suất</span><span class="v">Khoảng &gt;10/s mỗi device là nơi binary bắt đầu đáng.</span></div>
  <div class="kv"><span class="k">Debuggability</span><span class="v">JSON đọc được bằng mắt; binary cần tool để soi.</span></div>
  <div class="kv"><span class="k">Schema management</span><span class="v">Format binary cần một schema có version mà bạn phải duy trì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>JSON framing đủ tốt ở tần suất thấp (~1/s mỗi device) và dễ debug.</li><li>Binary custom hoặc Protobuf ở tần suất cao (&gt;10/s) giảm bandwidth ~6× và parse time ~50×.</li><li>Cái giá của binary là debuggability và schema management.</li><li>Lựa chọn là một ngưỡng tần suất, không phải một luật phổ quát.</li><li>Kho này dùng JSON vì scale hiện tại (~10 device).</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ArduinoJson</span><span class="lc-sub">arduinojson.org — chuẩn cho JSON trên ESP32/Arduino.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MessagePack</span><span class="lc-sub">msgpack.org — binary JSON-compatible, có lib cho C++ và JS.</span></span></div>
</div>
`,
    },

    {
      title: '9.4 — Bridge to socket.io: dashboard tier|||9.4 — Bridge sang socket.io: dashboard tier',
      slug: 'io-9-4-bridge',
      type: 'VIDEO',
      description: 'Server nhận từ raw ws device, fanout vào socket.io room `device:XX`. Dashboard tab tự subscribe/unsubscribe. Không thay đổi hành vi phía device.',
      content: `
${G09_4}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Bridge to socket.io: dashboard tier</h2>
<p class="lead">Device gateway receives raw ws. Dashboards connect via socket.io. Server bridges the two — device sends, socket.io fans out to interested dashboards.</p>

<h3>The bridge pattern</h3>
<pre><code class="language-ts">// device.gateway.ts (dan gian)
wsServer.on('connection', (ws, req) =&gt; {
  const deviceId = auth(req);
  activeDevices.set(deviceId, ws);
  
  ws.on('message', (data) =&gt; {
    const payload = JSON.parse(data.toString());
    // FANOUT toi socket.io dashboards
    io.to(&#96;device:\${deviceId}&#96;).emit('device:telemetry', {
      deviceId,
      ...payload,
      receivedAt: Date.now(),
    });
  });
  
  ws.on('close', () =&gt; {
    activeDevices.delete(deviceId);
    io.to(&#96;device:\${deviceId}&#96;).emit('device:status', { deviceId, online: false });
  });
});

// messaging.socket.ts hoac 1 file khac — dashboard tier
io.on('connection', (socket) =&gt; {
  socket.on('maker:device:join', (deviceId) =&gt; {
    socket.join(&#96;device:\${deviceId}&#96;);
    // Optional: send current status   (repo: room is &#96;maker:device:\${id}&#96;; no status on join — the list page reads isDeviceOnline over REST)
    socket.emit('device:status', {
      deviceId,
      online: activeDevices.has(deviceId),
    });
  });
  socket.on('maker:device:leave', (deviceId) =&gt; {
    socket.leave(&#96;device:\${deviceId}&#96;);
  });
});
</code></pre>

<h3>Why this pattern works well</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The device knows nothing about dashboards</span><span class="lz-d">The device only sends upward to the server. It never needs to know who is watching, or whether anyone is. The firmware stays simple.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The dashboard knows nothing about the device protocol</span><span class="lz-d">The dashboard uses the ordinary socket.io API. If tomorrow you swap the ESP32 for something else (MQTT, HTTP polling), the dashboard does NOT change.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">N-to-M fanout for free</span><span class="lz-d">One device with 5 dashboards watching: the fanout is automatic. 100 devices × 10 dashboards = 1,000 subscriptions, all managed by socket.io rooms.</span></div>
</div>

<h3>Security — a dashboard may only subscribe to devices it is entitled to</h3>
<pre><code class="language-ts">socket.on('maker:device:join', async (deviceId) =&gt; {
  // Kiem quyen truoc khi cho join
  const canAccess = await hasDeviceAccess(socket.data.userId, deviceId);
  if (!canAccess) return socket.emit('error', { message: 'forbidden' });   // repo (messaging.socket.ts:553): just return — silent
  socket.join(&#96;device:\${deviceId}&#96;);
});
</code></pre>

<h3>The reverse direction — commands from dashboard to device</h3>
<pre><code class="language-ts">// ILLUSTRATIVE — the repo has no such socket event: POST /devices/:id/commands ⇒ sendCommand() ⇒ pushCommand()
socket.on('maker:device:command', async (data) =&gt; {
  const { deviceId, command } = data;
  // Kiem quyen
  const canCommand = await canControlDevice(socket.data.userId, deviceId);
  if (!canCommand) return;
  
  // Tim device WS va send
  const ws = activeDevices.get(deviceId);
  if (!ws) return socket.emit('maker:device:error', { message: 'offline' });
  ws.send(JSON.stringify({ type: 'command', ...command }));
});
</code></pre>

<div class="callout ok">
<p><strong>The bridge pattern buys you loose coupling.</strong> The device tier can be swapped (ESP32 → Raspberry Pi → MQTT). The dashboard tier can be swapped (React → Vue → a mobile app). Only the bridge knows both — and only it has to change when either does.</p>
</div>

<h3>Latency chain</h3>
<pre><code class="language-text">Device -&gt; server: WS raw, ~10-50ms tuy network
Server bridge: parse + emit, ~1ms
Server -&gt; dashboard: socket.io broadcast, ~10-50ms
Total: ~20-100ms end-to-end
(DO 14/11/2026: cau ~5 ms cung may; moi chang 25 ms mot chieu =&gt; p50 57 ms)

Do bang: device.emit(&#96;now: \${millis()}&#96;) -&gt; dashboard log delta
</code></pre>

<div class="pitfall">
<p><strong>Trap — a bridge that does NOT authenticate the device.</strong> Anyone who knows a deviceId can send raw ws → the server bridges it → dashboards display fabricated telemetry. The bridge MUST verify the device token before emitting into socket.io. Do not trust a device merely because it &quot;has&quot; a deviceId.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The bridge pattern relays from raw ws (device tier) into a socket.io room (dashboard tier) via <code>io.to(&#96;device:XX&#96;).emit(...)</code> — the loose coupling lets you swap either tier independently; permission checks are required in BOTH directions (a dashboard joining a room, and a command going to a device); end-to-end latency is 20-100ms depending on the network.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Relay a telemetry message from the raw-ws device tier into a socket.io room with <code>io.to(&#96;device:XX&#96;).emit(...)</code> and watch the dashboard receive it.</li>
<li>Add a permission check in BOTH directions: a dashboard joining a device room, and a command heading to a device.</li>
<li>Measure end-to-end latency (expect 20-100ms) and confirm you can swap either tier without touching the other.</li>
</ol>
<p><strong>Done when:</strong> a device message reaches the dashboard through the bridge, with permission checked both ways.</p></div>

<h3>🔬 Measured: the bridge as the repo wrote it</h3>
<p>The repo (14/11/2026): five event types go into one room per board, <code>maker:device:&lt;id&gt;</code>; the join handler re-checks the owner; the page&#39;s names (<code>device:\${id}</code>, <code>device:status</code>, <code>maker:device:command</code>) occur 0 times; commands arrive over REST:</p>
<div class="out">$ grep -n "emitToConsole(.*'maker:" src/socket/device.gateway.ts | grep -o "'maker:[a-z:]*'" | sort | uniq -c
   2 'maker:command:update'
   1 'maker:device:log'
   2 'maker:device:status'
   1 'maker:device:telemetry'
   2 'maker:device:transcript'
$ sed -n '546,555p' src/socket/messaging.socket.ts
    socket.on('maker:device:join', async (deviceId: number) =&gt; {
      if (!Number.isInteger(deviceId) || deviceId &lt;= 0) return;
      try {
        const device = await prisma.makerDevice.findUnique({
          where: { id: deviceId },
          select: { ownerId: true },
        });
        if (!device || device.ownerId !== user.id) return;
        socket.join(&#96;maker:device:\${deviceId}&#96;);
      } catch {
$ grep -rnE "maker:device:command|'device:(status|telemetry)'|\\&#96;device:" src/ frontend/src/ | wc -l     # tên trong bài web
       0
$ grep -n "pushCommand(params.deviceId\\|const delivered" src/services/makerlab/makerLab.service.ts
238:  const delivered = pushCommand(params.deviceId, {</div>
<p>Three consoles, two boards, against the repo&#39;s gateway and join handler — each owner gets only their board; user 3 gets nothing, and no error:</p>
<div class="out">$ node bo.mjs 1 &amp; node bo.mjs 2        # hai bo mạch nối, telemetry mỗi giây
2 bo đã chạy 3 s
$ # Live Console của An
 0.02 s [An] nối socket.io · join maker:device:1, maker:device:2
 0.88 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.879Z","batteryPct":null}
 0.88 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.882Z","firmwareVersion":
 1.89 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794610877882},"recordedA · trễ 2 ms
 2.89 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794610878884},"recordedA · trễ 1 ms
 3.67 s [An] ← maker:device:status {"deviceId":1,"status":"OFFLINE"}
 5.01 s [An] tổng: {"maker:device:status":3,"maker:device:telemetry":2}
$ # Live Console của Bình
 0.02 s [Bình] nối socket.io · join maker:device:1, maker:device:2
 0.89 s [Bình] ← maker:device:status {"deviceId":2,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.879Z","batteryPct":null}
 0.89 s [Bình] ← maker:device:status {"deviceId":2,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.885Z","firmwareVersion":
 1.89 s [Bình] ← maker:device:telemetry {"deviceId":2,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794610877883},"recordedA · trễ 1 ms
 2.89 s [Bình] ← maker:device:telemetry {"deviceId":2,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794610878886},"recordedA · trễ 2 ms
 3.67 s [Bình] ← maker:device:status {"deviceId":2,"status":"OFFLINE"}
 5.01 s [Bình] tổng: {"maker:device:status":3,"maker:device:telemetry":2}
$ # user 3 xin vào room thiết bị 1
 0.02 s [user 3] nối socket.io · join maker:device:1
 5.01 s [user 3] tổng: {}</div>
<p>End-to-end latency through the bridge (20 telemetry messages):</p>
<div class="out">$ node tre94.mjs 0       # bo ⇒ gateway kho ⇒ room ⇒ console, cùng máy
mạng mỗi chặng 0 ms một chiều · 20/20 tin tới console · trễ đầu-cuối p50 5 ms · nhỏ nhất 3 · lớn nhất 13 ms
$ node tre94.mjs 25      # mỗi chặng mạng trễ 25 ms một chiều
mạng mỗi chặng 25 ms một chiều · 20/20 tin tới console · trễ đầu-cuối p50 57 ms · nhỏ nhất 53 · lớn nhất 72 ms</div>
<p>Commands queued while the board was away, then the board reconnects:</p>
<div class="out">$ sed -n '613,621p;1070,1072p' ~/api-backend/src/socket/device.gateway.ts
  // Flush anything queued while the board was away.
  const pending = await prisma.makerCommand.findMany({
    where: { deviceId: conn.deviceId, status: MakerCommandStatus.PENDING },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });
  for (const cmd of pending) {
    pushCommand(conn.deviceId, { id: cmd.id, type: cmd.type, payload: cmd.payload });
  }
  logger.info('MakerLab device connected', { deviceId: auth.deviceId, key: auth.deviceKey });
  sendJson(conn, { t: 'welcome', deviceId: auth.deviceId, serverTime: Date.now() });
  void handleHello(conn, {}).catch(() =&gt; undefined);
$ grep -n "static void handleCommand" -A3 firmware/mini-me-robot/src/main.cpp     # firmware có lọc lệnh trùng không?
862:static void handleCommand(JsonDocument&amp; doc) {
863-  const uint32_t id = doc["id"] | 0;
864-  const char* type = doc["type"] | "";
865-
$ node lenh94.mjs 3 0      # 3 lệnh PENDING, bo nối lại · DB trả ngay
lượt 1 · 3 lệnh PENDING · DB 0 ms/truy vấn ⇒ bo nhận 3 lệnh: #501×1 #502×1 #503×1
lượt 2 · 3 lệnh PENDING · DB 0 ms/truy vấn ⇒ bo nhận 3 lệnh: #501×1 #502×1 #503×1
$ node lenh94.mjs 3 2      # DB 2 ms mỗi truy vấn
lượt 1 · 3 lệnh PENDING · DB 2 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2
lượt 2 · 3 lệnh PENDING · DB 2 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2
$ node lenh94.mjs 3 5      # DB 5 ms mỗi truy vấn (Postgres qua mạng)
lượt 1 · 3 lệnh PENDING · DB 5 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2
lượt 2 · 3 lệnh PENDING · DB 5 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2</div>
<div class="callout bad"><p><strong>Latent bug in this repo:</strong> <code>acceptDevice</code> calls <code>handleHello(conn, {})</code> itself (<code>device.gateway.ts:1072</code>) and the board sends its own <code>hello</code> right after connecting (<code>main.cpp:1133</code>). Both read the PENDING commands before either marks them SENT: with a DB answering in 2–5 ms every queued command is delivered <strong>twice</strong>, and the firmware&#39;s <code>handleCommand</code> (<code>main.cpp:862</code>) does not check the id — a queued <code>move</code> runs twice. Fix: claim rows atomically (<code>UPDATE … SET status=&#39;SENT&#39; WHERE status=&#39;PENDING&#39; RETURNING</code>), flush only on the board&#39;s real hello, and ignore an id the board already ran. Reproduce: lab c9 <code>node lenh94.mjs 3 2</code>.</p></div>
<div class="callout info"><p><strong>With a second server process:</strong> console events still fan out through the Redis adapter, but the board&#39;s socket lives in one process&#39;s <code>connections</code> Map (<code>device.gateway.ts:119</code>). A REST command handled by the other process gets <code>pushCommand() === false</code> and waits until the board reconnects; <code>isDeviceOnline()</code> is wrong half the time (same shape as <code>call.socket.ts:161</code>, lesson 5.2).</p></div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9: device.gateway.ts CHÉP TỪ KHO + handler maker:device:join chép từ messaging.socket.ts:546-562, Prisma giả</span>
npx tsx may9.ts &amp;
node man.mjs 1 1,2 &amp;  node man.mjs 2 1,2 &amp;  node man.mjs 3 1 &amp;   <span class="tok-comment">  # An · Bình · user 3 cùng xin room</span>
node bo.mjs 1 &amp; node bo.mjs 2                                     <span class="tok-comment">  # hai bo mạch, telemetry 1 Hz</span>
node tre94.mjs 0 ; node tre94.mjs 25                              <span class="tok-comment">  # trễ đầu-cuối qua cây cầu, có/không mạng chậm</span>
node lenh94.mjs 3 0 ; node lenh94.mjs 3 2                         <span class="tok-comment">  # 3 lệnh PENDING, bo nối lại, DB 0 / 2 ms mỗi truy vấn</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 13.3 — Retry, backoff, and the charge that ran three times</span><span class="lc-sub">Idempotency: what the board&#39;s command handler is missing</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.5 — Pub/Sub, Stream, list or a real broker</span><span class="lc-sub">Routing a command to the process that holds the board</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bridge pattern</span><span class="v">Relay from raw ws (device tier) into a socket.io room (dashboard tier).</span></div>
  <div class="kv"><span class="k">Device room</span><span class="v">A <code>device:XX</code> socket.io room the dashboard joins.</span></div>
  <div class="kv"><span class="k">Loose coupling</span><span class="v">Either tier can be swapped without changing the other.</span></div>
  <div class="kv"><span class="k">Both-direction auth</span><span class="v">Check permission for a dashboard joining AND a command to a device.</span></div>
  <div class="kv"><span class="k">End-to-end latency</span><span class="v">20-100ms across the bridge, depending on the network.</span></div>
  <div class="kv"><span class="k">Telemetry</span><span class="v">The device readings relayed up to the dashboard.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The bridge relays from raw ws (device tier) into a socket.io room (dashboard tier).</li><li>It uses <code>io.to(&#96;device:XX&#96;).emit(...)</code> to reach the dashboard.</li><li>The loose coupling lets you swap either tier independently.</li><li>Permission checks are required in BOTH directions.</li><li>End-to-end latency is 20-100ms depending on the network.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Lesson 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern <code>device:XX</code> là instance của per-resource room.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Bridge sang socket.io: dashboard tier</h2>
<p class="lead">Device gateway nhận raw ws. Dashboard kết nối qua socket.io. Server bridge hai bên — device gửi, socket.io fan out đến dashboard quan tâm.</p>

<h3>Pattern bridge</h3>
<pre><code class="language-ts">// device.gateway.ts (don gian)
wsServer.on('connection', (ws, req) =&gt; {
  const deviceId = auth(req);
  activeDevices.set(deviceId, ws);
  
  ws.on('message', (data) =&gt; {
    const payload = JSON.parse(data.toString());
    // FANOUT toi socket.io dashboards
    io.to(&#96;device:\${deviceId}&#96;).emit('device:telemetry', {
      deviceId,
      ...payload,
      receivedAt: Date.now(),
    });
  });
  
  ws.on('close', () =&gt; {
    activeDevices.delete(deviceId);
    io.to(&#96;device:\${deviceId}&#96;).emit('device:status', { deviceId, online: false });
  });
});

// messaging.socket.ts hoac 1 file khac — dashboard tier
io.on('connection', (socket) =&gt; {
  socket.on('maker:device:join', (deviceId) =&gt; {
    socket.join(&#96;device:\${deviceId}&#96;);
    // Optional: send current status   (repo: room is &#96;maker:device:\${id}&#96;; no status on join — the list page reads isDeviceOnline over REST)
    socket.emit('device:status', {
      deviceId,
      online: activeDevices.has(deviceId),
    });
  });
  socket.on('maker:device:leave', (deviceId) =&gt; {
    socket.leave(&#96;device:\${deviceId}&#96;);
  });
});
</code></pre>

<h3>Vì sao pattern này tốt</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Device không biết dashboard</span><span class="lz-d">Device chỉ gửi lên server. Không cần biết ai đang xem, hay xem không. Firmware đơn giản.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dashboard không biết protocol device</span><span class="lz-d">Dashboard dùng socket.io API chuẩn. Nếu ngày mai bạn thay ESP32 bằng device khác (MQTT, HTTP polling), dashboard KHÔNG đổi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Fanout N-to-M miễn phí</span><span class="lz-d">1 device có 5 dashboard đang xem: fanout tự động. 100 device × 10 dashboard = 1000 subscriptions, socket.io room quản.</span></div>
</div>

<h3>Bảo mật — dashboard chỉ subscribe device họ có quyền</h3>
<pre><code class="language-ts">socket.on('maker:device:join', async (deviceId) =&gt; {
  // Kiem quyen truoc khi cho join
  const canAccess = await hasDeviceAccess(socket.data.userId, deviceId);
  if (!canAccess) return socket.emit('error', { message: 'forbidden' });   // repo (messaging.socket.ts:553): just return — silent
  socket.join(&#96;device:\${deviceId}&#96;);
});
</code></pre>

<h3>Reverse — command từ dashboard đến device</h3>
<pre><code class="language-ts">// ILLUSTRATIVE — the repo has no such socket event: POST /devices/:id/commands ⇒ sendCommand() ⇒ pushCommand()
socket.on('maker:device:command', async (data) =&gt; {
  const { deviceId, command } = data;
  // Kiem quyen
  const canCommand = await canControlDevice(socket.data.userId, deviceId);
  if (!canCommand) return;
  
  // Tim device WS va send
  const ws = activeDevices.get(deviceId);
  if (!ws) return socket.emit('maker:device:error', { message: 'offline' });
  ws.send(JSON.stringify({ type: 'command', ...command }));
});
</code></pre>

<div class="callout ok">
<p><strong>Bridge pattern cho phép loose coupling.</strong> Device tier có thể swap (ESP32 → Raspberry Pi → MQTT). Dashboard tier có thể swap (React → Vue → mobile app). Chỉ Bridge biết cả hai — và chỉ đổi khi bạn muốn.</p>
</div>

<h3>Chuỗi latency</h3>
<pre><code class="language-text">Device -&gt; server: WS raw, ~10-50ms tuy network
Server bridge: parse + emit, ~1ms
Server -&gt; dashboard: socket.io broadcast, ~10-50ms
Total: ~20-100ms end-to-end
(DO 14/11/2026: cau ~5 ms cung may; moi chang 25 ms mot chieu =&gt; p50 57 ms)

Do bang: device.emit(&#96;now: ${'${'}millis()}&#96;) -&gt; dashboard log delta
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bridge KHÔNG kiểm authenticate device.</strong> Ai đó biết deviceId gửi raw ws → server bridge → dashboard nhận telemetry giả. Bridge PHẢI verify device token trước khi emit sang socket.io. Đừng trust device chỉ vì họ &quot;có&quot; deviceId.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bridge pattern relay từ raw ws (device tier) sang socket.io room (dashboard tier) qua <code>io.to(&#96;device:XX&#96;).emit(...)</code> — loose coupling cho phép swap device tier hoặc dashboard tier độc lập; permission check ở CẢ chiều (dashboard join room + command đến device); latency end-to-end 20-100ms tuỳ network.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Relay một tin telemetry từ device tier raw-ws vào một room socket.io bằng <code>io.to(&#96;device:XX&#96;).emit(...)</code> và xem dashboard nhận được.</li>
<li>Thêm một permission check ở CẢ hai chiều: một dashboard join room thiết bị, và một command đi tới một device.</li>
<li>Đo latency end-to-end (dự kiến 20-100ms) và xác nhận bạn swap được tier này mà không đụng tier kia.</li>
</ol>
<p><strong>Đạt khi:</strong> một tin thiết bị tới dashboard qua bridge, với permission được kiểm cả hai chiều.</p></div>

<h3>🔬 Đo thật: cây cầu như kho đã viết</h3>
<p>Kho (14/11/2026): năm loại sự kiện vào một room mỗi bo, <code>maker:device:&lt;id&gt;</code>; handler join kiểm lại chủ; tên của bài web (<code>device:\${id}</code>, <code>device:status</code>, <code>maker:device:command</code>) có 0 chỗ; lệnh tới bằng REST:</p>
<div class="out">$ grep -n "emitToConsole(.*'maker:" src/socket/device.gateway.ts | grep -o "'maker:[a-z:]*'" | sort | uniq -c
   2 'maker:command:update'
   1 'maker:device:log'
   2 'maker:device:status'
   1 'maker:device:telemetry'
   2 'maker:device:transcript'
$ sed -n '546,555p' src/socket/messaging.socket.ts
    socket.on('maker:device:join', async (deviceId: number) =&gt; {
      if (!Number.isInteger(deviceId) || deviceId &lt;= 0) return;
      try {
        const device = await prisma.makerDevice.findUnique({
          where: { id: deviceId },
          select: { ownerId: true },
        });
        if (!device || device.ownerId !== user.id) return;
        socket.join(&#96;maker:device:\${deviceId}&#96;);
      } catch {
$ grep -rnE "maker:device:command|'device:(status|telemetry)'|\\&#96;device:" src/ frontend/src/ | wc -l     # tên trong bài web
       0
$ grep -n "pushCommand(params.deviceId\\|const delivered" src/services/makerlab/makerLab.service.ts
238:  const delivered = pushCommand(params.deviceId, {</div>
<p>Ba console, hai bo, chạy với gateway và handler join của kho — mỗi chủ chỉ nhận bo của mình; user 3 không nhận gì, cũng không lỗi:</p>
<div class="out">$ node bo.mjs 1 &amp; node bo.mjs 2        # hai bo mạch nối, telemetry mỗi giây
2 bo đã chạy 3 s
$ # Live Console của An
 0.02 s [An] nối socket.io · join maker:device:1, maker:device:2
 0.88 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.879Z","batteryPct":null}
 0.88 s [An] ← maker:device:status {"deviceId":1,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.882Z","firmwareVersion":
 1.89 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794610877882},"recordedA · trễ 2 ms
 2.89 s [An] ← maker:device:telemetry {"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794610878884},"recordedA · trễ 1 ms
 3.67 s [An] ← maker:device:status {"deviceId":1,"status":"OFFLINE"}
 5.01 s [An] tổng: {"maker:device:status":3,"maker:device:telemetry":2}
$ # Live Console của Bình
 0.02 s [Bình] nối socket.io · join maker:device:1, maker:device:2
 0.89 s [Bình] ← maker:device:status {"deviceId":2,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.879Z","batteryPct":null}
 0.89 s [Bình] ← maker:device:status {"deviceId":2,"status":"ONLINE","lastSeenAt":"2026-11-13T23:01:16.885Z","firmwareVersion":
 1.89 s [Bình] ← maker:device:telemetry {"deviceId":2,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794610877883},"recordedA · trễ 1 ms
 2.89 s [Bình] ← maker:device:telemetry {"deviceId":2,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794610878886},"recordedA · trễ 2 ms
 3.67 s [Bình] ← maker:device:status {"deviceId":2,"status":"OFFLINE"}
 5.01 s [Bình] tổng: {"maker:device:status":3,"maker:device:telemetry":2}
$ # user 3 xin vào room thiết bị 1
 0.02 s [user 3] nối socket.io · join maker:device:1
 5.01 s [user 3] tổng: {}</div>
<p>Độ trễ đầu-cuối qua cây cầu (20 tin telemetry):</p>
<div class="out">$ node tre94.mjs 0       # bo ⇒ gateway kho ⇒ room ⇒ console, cùng máy
mạng mỗi chặng 0 ms một chiều · 20/20 tin tới console · trễ đầu-cuối p50 5 ms · nhỏ nhất 3 · lớn nhất 13 ms
$ node tre94.mjs 25      # mỗi chặng mạng trễ 25 ms một chiều
mạng mỗi chặng 25 ms một chiều · 20/20 tin tới console · trễ đầu-cuối p50 57 ms · nhỏ nhất 53 · lớn nhất 72 ms</div>
<p>Lệnh xếp hàng lúc bo vắng mặt, rồi bo nối lại:</p>
<div class="out">$ sed -n '613,621p;1070,1072p' ~/api-backend/src/socket/device.gateway.ts
  // Flush anything queued while the board was away.
  const pending = await prisma.makerCommand.findMany({
    where: { deviceId: conn.deviceId, status: MakerCommandStatus.PENDING },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });
  for (const cmd of pending) {
    pushCommand(conn.deviceId, { id: cmd.id, type: cmd.type, payload: cmd.payload });
  }
  logger.info('MakerLab device connected', { deviceId: auth.deviceId, key: auth.deviceKey });
  sendJson(conn, { t: 'welcome', deviceId: auth.deviceId, serverTime: Date.now() });
  void handleHello(conn, {}).catch(() =&gt; undefined);
$ grep -n "static void handleCommand" -A3 firmware/mini-me-robot/src/main.cpp     # firmware có lọc lệnh trùng không?
862:static void handleCommand(JsonDocument&amp; doc) {
863-  const uint32_t id = doc["id"] | 0;
864-  const char* type = doc["type"] | "";
865-
$ node lenh94.mjs 3 0      # 3 lệnh PENDING, bo nối lại · DB trả ngay
lượt 1 · 3 lệnh PENDING · DB 0 ms/truy vấn ⇒ bo nhận 3 lệnh: #501×1 #502×1 #503×1
lượt 2 · 3 lệnh PENDING · DB 0 ms/truy vấn ⇒ bo nhận 3 lệnh: #501×1 #502×1 #503×1
$ node lenh94.mjs 3 2      # DB 2 ms mỗi truy vấn
lượt 1 · 3 lệnh PENDING · DB 2 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2
lượt 2 · 3 lệnh PENDING · DB 2 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2
$ node lenh94.mjs 3 5      # DB 5 ms mỗi truy vấn (Postgres qua mạng)
lượt 1 · 3 lệnh PENDING · DB 5 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2
lượt 2 · 3 lệnh PENDING · DB 5 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2</div>
<div class="callout bad"><p><strong>Lỗi tiềm ẩn của kho:</strong> <code>acceptDevice</code> tự gọi <code>handleHello(conn, {})</code> (<code>device.gateway.ts:1072</code>) và bo gửi <code>hello</code> của nó ngay khi nối (<code>main.cpp:1133</code>). Cả hai cùng đọc các lệnh PENDING trước khi lần nào đánh dấu SENT: DB trả lời trong 2–5 ms là mỗi lệnh xếp hàng tới bo <strong>hai lần</strong>, mà <code>handleCommand</code> của firmware (<code>main.cpp:862</code>) không kiểm id — lệnh <code>move</code> xếp hàng chạy hai lần. Sửa: nhận dòng nguyên tử (<code>UPDATE … SET status=&#39;SENT&#39; WHERE status=&#39;PENDING&#39; RETURNING</code>), chỉ đẩy ở hello thật của bo, và bo bỏ qua id đã làm. Tái hiện: lab c9 <code>node lenh94.mjs 3 2</code>.</p></div>
<div class="callout info"><p><strong>Thêm tiến trình server thứ hai:</strong> sự kiện lên console vẫn toả qua Redis adapter, nhưng socket của bo nằm trong Map <code>connections</code> của một tiến trình (<code>device.gateway.ts:119</code>). Lệnh REST rơi vào tiến trình kia ⇒ <code>pushCommand() === false</code>, chờ tới khi bo nối lại; <code>isDeviceOnline()</code> sai một nửa số lần (cùng dạng <code>call.socket.ts:161</code>, bài 5.2).</p></div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9: device.gateway.ts CHÉP TỪ KHO + handler maker:device:join chép từ messaging.socket.ts:546-562, Prisma giả</span>
npx tsx may9.ts &amp;
node man.mjs 1 1,2 &amp;  node man.mjs 2 1,2 &amp;  node man.mjs 3 1 &amp;   <span class="tok-comment">  # An · Bình · user 3 cùng xin room</span>
node bo.mjs 1 &amp; node bo.mjs 2                                     <span class="tok-comment">  # hai bo mạch, telemetry 1 Hz</span>
node tre94.mjs 0 ; node tre94.mjs 25                              <span class="tok-comment">  # trễ đầu-cuối qua cây cầu, có/không mạng chậm</span>
node lenh94.mjs 3 0 ; node lenh94.mjs 3 2                         <span class="tok-comment">  # 3 lệnh PENDING, bo nối lại, DB 0 / 2 ms mỗi truy vấn</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 13.3 — Thất bại: thử lại, backoff, và cú trừ tiền chạy ba lần</span><span class="lc-sub">Idempotent: thứ bộ xử lý lệnh của bo đang thiếu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.5 — Chọn: Pub/Sub, Stream, list hay một broker thật</span><span class="lc-sub">Đưa lệnh tới đúng tiến trình đang giữ bo</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bridge pattern</span><span class="v">Relay từ raw ws (device tier) vào một room socket.io (dashboard tier).</span></div>
  <div class="kv"><span class="k">Room thiết bị</span><span class="v">Một room socket.io <code>device:XX</code> mà dashboard join.</span></div>
  <div class="kv"><span class="k">Loose coupling</span><span class="v">Có thể swap tier này mà không đổi tier kia.</span></div>
  <div class="kv"><span class="k">Auth hai chiều</span><span class="v">Kiểm permission cho dashboard join VÀ command tới device.</span></div>
  <div class="kv"><span class="k">Latency end-to-end</span><span class="v">20-100ms qua bridge, tuỳ network.</span></div>
  <div class="kv"><span class="k">Telemetry</span><span class="v">Các số đo thiết bị được relay lên dashboard.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bridge relay từ raw ws (device tier) vào một room socket.io (dashboard tier).</li><li>Nó dùng <code>io.to(&#96;device:XX&#96;).emit(...)</code> để tới dashboard.</li><li>Loose coupling cho phép swap tier này độc lập.</li><li>Permission check bắt buộc ở CẢ hai chiều.</li><li>Latency end-to-end là 20-100ms tuỳ network.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern <code>device:XX</code> là instance của per-resource room.</span></span></div>
</div>
`,
    },

    {
      title: '9.5 — When socket.io is enough after all|||9.5 — Khi socket.io là đủ dù sao đi nữa',
      slug: 'io-9-5-lai-du',
      type: 'VIDEO',
      description: 'Nếu &quot;device&quot; của bạn là Raspberry Pi/Node.js, dùng socket.io-client. Nếu là mobile native, có socket.io-swift/kotlin. Chỉ ESP32/Arduino/embedded thật sự cần raw ws.',
      content: `
${G09_5}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>When socket.io is enough after all</h2>
<p class="lead">The 1.035-line device gateway is only necessary because ESP32 doesn&#39;t have socket.io-client. <em>(Measured 14/11/2026: 1,113 lines, ~8% of it protocol plumbing — and the ESP32 library this repo uses does ship a socket.io client; see below.)</em> If your &quot;device&quot; is anything else, socket.io still probably wins.</p>

<h3>The client-support table</h3>
<div class="out">Platform                socket.io-client available?
JavaScript (browser)    YES — socket.io-client
Node.js (server)        YES — socket.io-client (same)
React Native            YES — socket.io-client works
iOS (Swift)             YES — socket.io-client-swift
Android (Kotlin/Java)   YES — socket.io-client-java
Python                  YES — python-socketio
C# .NET                 YES — SocketIOClient (community)
Go                      Limited — go-socket.io (community, older)   [do 14/11/2026: ARCHIVED]
C++ / Arduino / ESP32   NO — raw WebSocket only   [do 14/11/2026: SAI — socketio/socket.io-client-cpp chinh thuc;
                        ESP32: SocketIOclient trong Links2004/arduinoWebSockets, mac dinh EIO=3]
Rust                    Community — rust-socketio
</div>

<h3>Three different kinds of &quot;device&quot;</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Raspberry Pi + Node.js</span><span class="lz-nsub">socket.io-client works</span></span>
<span class="lz-nbody">A full Node.js runtime. Use <code>socket.io-client</code>. Reconnect, rooms and acks are built in. No bridge needed.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Mobile app (iOS/Android)</span><span class="lz-nsub">socket.io-swift/java</span></span>
<span class="lz-nbody">Native libraries exist. The API mirrors the web one. No bridge needed.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ESP32/Arduino embedded</span><span class="lz-nsub">raw ws is mandatory</span></span>
<span class="lz-nbody">There is no C++ socket.io-client. You must use raw ws and hand-write reconnect, heartbeat and framing. This is the only scenario that needs the bridge pattern.</span>
</div>
</div>

<h3>This repo — the special case</h3>
<pre><code class="language-text">Maker Lab devices = ESP32
-&gt; buoc phai raw ws + bridge
-&gt; device.gateway.ts la 1.035 dong   (do 14/11/2026: 1.113)

Neu Maker Lab la Raspberry Pi:
-&gt; xai socket.io-client
-&gt; device.gateway.ts khoang 200 dong (chi handler + auth)
</code></pre>

<h3>The bridge's cost-benefit</h3>
<pre><code class="language-text">Bridge cost:
  + 500-1000 dong code (reconnect, heartbeat, framing)
  + Debug kho hon (khong co socket.io tools)
  + Team phai hoc raw ws

Bridge benefit:
  + Support embedded devices
  + Firmware nhe (~50 KB smaller vs socket.io bundle)   (chua do tren ESP32)
  + Protocol control (custom binary neu can)
</code></pre>

<div class="callout warn">
<p><strong>Do not choose raw ws because it is &quot;lightweight&quot;.</strong> You save ~150 KB of library <em>(measured: socket.io-client 4.8.3 is 46,822 B minified, 14,717 B gzip)</em> and write 800 lines of code plus reconnect bugs plus heartbeat bugs. Choose it only when the client platform LEAVES YOU NO CHOICE (embedded).</p>
</div>

<h3>Alternative — HTTP polling cho device</h3>
<pre><code class="language-cpp">// Neu WebSocket khong on dinh, device co the poll HTTP
void loop() {
  if (millis() - lastPoll &gt; 5000) {
    HTTPClient http;
    http.begin("https://api.example.com/device/poll?id=42");
    http.addHeader("Authorization", &#96;Bearer ${'${'}token}&#96;);
    int code = http.GET();
    if (code == 200) {
      // process pending commands
    }
    lastPoll = millis();
  }
}
</code></pre>

<p>HTTP polling from a device carries 5s of latency and is not realtime. But it is simpler than WS and the firmware is lighter. Use it when the telemetry barely matters (an electricity or water meter read every 5 minutes).</p>

<div class="pitfall">
<p><strong>Trap — choosing raw ws for a web browser client.</strong> The browser has socket.io-client readily available, so why avoid it? A frontend developer decides socket.io is &quot;heavy&quot; and writes raw ws — losing reconnect, losing rooms, losing the debugging tools. The road back is expensive.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> socket.io-client exists for most platforms (JS, Node, RN, iOS, Android, Python, C#) — raw ws is only NECESSARY for embedded targets (ESP32/Arduino/C++) that have no socket.io-client; everywhere else socket.io wins on reconnect, rooms, debugging and code size (on the server, not in the client bundle).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>List the platforms that have a socket.io-client (JS, Node, React Native, iOS, Android, Python, C#) and check your target against it.</li>
<li>Identify the one case that genuinely needs raw ws: embedded targets (ESP32/Arduino/C++) with no socket.io-client.</li>
<li>For a non-embedded target, argue why socket.io wins on reconnect, rooms, debugging and server-side code size.</li>
</ol>
<p><strong>Done when:</strong> you can decide raw ws vs socket.io for any target by whether a socket.io-client exists for it.</p></div>

<h3>🔬 Measured: who has a client, and socket.io by hand</h3>
<p>Checked against GitHub and npm on 14/11/2026 — an official C++ client exists, Go&#39;s community client is archived, and the ESP32 library this repo&#39;s firmware already uses ships <code>SocketIOclient</code>:</p>
<div class="out">$ node khach95.mjs       # hỏi thẳng GitHub API + npm, 14/11/2026
nền tảng                          kho GitHub                            sao   push cuối    archived
JavaScript / Node / React Native  socketio/socket.io-client            10581  2024-07-09  không
C++ (chính thức)                  socketio/socket.io-client-cpp         2357  2025-08-28  không
Swift (chính thức)                socketio/socket.io-client-swift       5288  2024-10-01  không
Java / Kotlin (chính thức)        socketio/socket.io-client-java        5396  2025-08-11  không
Python                            miguelgrinberg/python-socketio        4369  2026-11-03  không
C# .NET                           doghappy/socket.io-client-csharp       797  2026-07-24  không
Go                                googollee/go-socket.io                5765  2024-09-29  CÓ
Rust                              1c3t3a/rust-socketio                   481  2025-02-03  không
Arduino / ESP32 (SocketIOclient)  Links2004/arduinoWebSockets           2069  2026-09-22  không
socket.io-client 4.8.4 (npm) · bản lab 4.8.3: socket.io.min.js 46.822 B · gzip 14.717 B</div>
<p>socket.io spoken by hand on a raw WebSocket (13 lines) — it joins the repo&#39;s room and receives the board&#39;s telemetry through the real bridge. Then the EIO=3 default of <code>SocketIOclient</code> against socket.io 4:</p>
<div class="out">$ wc -l tay95.mjs
      13 tay95.mjs
$ node bo.mjs 1 &amp;  node tay95.mjs 4      # socket.io VIẾT TAY trên WebSocket trần, giao thức đời 4 (EIO=4)
   80 ms ↓ 0{"sid":"oEjb-b6pHiJvgJX5AAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1
   81 ms ↑ 40{"userId":1}          (CONNECT namespace /, kèm auth)
   82 ms ↓ 40{"sid":"SgKlR-oAGcqSjiq2AAAA"}
   82 ms ↑ 42["maker:device:join",1]  (EVENT)
 1079 ms ↓ 42["maker:device:telemetry",{"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794611
 2082 ms ↓ 42["maker:device:telemetry",{"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794611
 3000 ms ↓ 42["maker:device:status",{"deviceId":1,"status":"OFFLINE"}]
$ curl -i "localhost:19910/socket.io/?EIO=3&amp;transport=polling"     # mặc định của SocketIOclient trong firmware: EIO=3
HTTP/1.1 400 Bad Request
{"code":5,"message":"Unsupported protocol version"}
$ node tay95.mjs 3       # EIO=3 qua WebSocket
    8 ms ✕ lỗi: Invalid WebSocket frame: RSV1 must be clear
$ EIO3=1 npx tsx may9.ts &amp;  node tay95.mjs 3     # server bật allowEIO3: true
   13 ms ↓ 0{"sid":"oOHPYYbOslsFythDAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1
   16 ms ↑ 40{"userId":1}          (CONNECT namespace /, kèm auth)
   16 ms ↓ 44"unauthorized"
   20 ms ↓ 44"unauthorized"</div>
<div class="callout warn"><p><strong>The EIO=3 trap:</strong> <code>SocketIOclient.begin()</code> defaults to <code>/socket.io/?EIO=3</code>. socket.io 4 answers polling with 400 “Unsupported protocol version”; over WebSocket the board sees a broken frame; with <code>allowEIO3: true</code> it connects but cannot send <code>auth</code> in CONNECT, so the repo&#39;s middleware says unauthorized. Pass <code>"/socket.io/?EIO=4"</code> yourself (the library switches to v4 ping rules when it sees <code>EIO=4</code>, <code>SocketIOclient.cpp:70</code>).</p></div>
<div class="callout info"><p><strong>So why raw ws in this repo?</strong> Not because no client exists — because of two-way binary voice: one frame per 2 KB chunk instead of two (lesson 9.3: 18 vs 34 frames per second of audio), and plain RFC 6455 on a small chip.</p></div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9</span>
node khach95.mjs                        <span class="tok-comment">  # client cho từng nền tảng: GitHub API (sao, push cuối, archived) + npm + cỡ gói socket.io-client</span>
npx tsx may9.ts &amp;  node bo.mjs 1 &amp;      <span class="tok-comment">  # gateway kho + một bo giả làm nguồn telemetry</span>
node tay95.mjs 4                        <span class="tok-comment">  # socket.io VIẾT TAY (13 dòng) trên ws trần: 0 OPEN ⇒ 40 CONNECT ⇒ 42 EVENT ⇒ 2/3 ping</span>
curl -i "localhost:19910/socket.io/?EIO=3&amp;transport=polling" <span class="tok-comment">  # mặc định của SocketIOclient ⇒ 400</span>
EIO3=1 npx tsx may9.ts &amp;  node tay95.mjs 3                   <span class="tok-comment">  # allowEIO3: nối được, nhưng auth trong CONNECT không có</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — From polling to being told: WebSocket</span><span class="lc-sub">The raw WebSocket under the hand-written client</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: upgrade, frames and heartbeat</span><span class="lc-sub">Frames, masking and ping/pong</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.5 — Pub/Sub, Stream, list or a real broker</span><span class="lc-sub">When a device fleet wants a real broker</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">socket.io-client</span><span class="v">The official client, available for most platforms.</span></div>
  <div class="kv"><span class="k">Embedded target</span><span class="v">ESP32/Arduino/C++ — the one place raw ws is necessary.</span></div>
  <div class="kv"><span class="k">Platform coverage</span><span class="v">JS, Node, RN, iOS, Android, Python, C# all have a client.</span></div>
  <div class="kv"><span class="k">Server-side code size</span><span class="v">socket.io shrinks the SERVER code, not the client bundle.</span></div>
  <div class="kv"><span class="k">Reconnect/rooms</span><span class="v">Built in with socket.io; hand-written with raw ws.</span></div>
  <div class="kv"><span class="k">Decision rule</span><span class="v">Use raw ws only when no socket.io-client exists for the target.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>socket.io-client exists for most platforms: JS, Node, RN, iOS, Android, Python, C#.</li><li>Raw ws is only NECESSARY for embedded targets (ESP32/Arduino/C++) with no client.</li><li>Everywhere else socket.io wins on reconnect, rooms and debugging.</li><li>It also wins on code size — on the server, not in the client bundle.</li><li>The decision rule is simply whether a socket.io-client exists for your target.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — client libraries</span><span class="lc-sub">socket.io/docs/v4/client-installation — list official + community clients.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Khi socket.io là đủ dù sao đi nữa</h2>
<p class="lead">Gateway device 1.035 dòng chỉ cần thiết vì ESP32 không có socket.io-client. <em>(Đo 14/11/2026: 1.113 dòng, ~8% là ống nước giao thức — và thư viện ESP32 kho đang dùng có sẵn socket.io client; xem dưới.)</em> Nếu &quot;device&quot; của bạn là gì khác, socket.io vẫn có thể thắng.</p>

<h3>Bảng client support</h3>
<div class="out">Platform                socket.io-client available?
JavaScript (browser)    YES — socket.io-client
Node.js (server)        YES — socket.io-client (same)
React Native            YES — socket.io-client works
iOS (Swift)             YES — socket.io-client-swift
Android (Kotlin/Java)   YES — socket.io-client-java
Python                  YES — python-socketio
C# .NET                 YES — SocketIOClient (community)
Go                      Limited — go-socket.io (community, older)   [do 14/11/2026: ARCHIVED]
C++ / Arduino / ESP32   NO — raw WebSocket only   [do 14/11/2026: SAI — socketio/socket.io-client-cpp chinh thuc;
                        ESP32: SocketIOclient trong Links2004/arduinoWebSockets, mac dinh EIO=3]
Rust                    Community — rust-socketio
</div>

<h3>Ba dạng &quot;device&quot; khác nhau</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Raspberry Pi + Node.js</span><span class="lz-nsub">socket.io-client works</span></span>
<span class="lz-nbody">Full Node.js runtime. Dùng <code>socket.io-client</code>. Reconnect + rooms + ack built-in. Không cần bridge.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Mobile app (iOS/Android)</span><span class="lz-nsub">socket.io-swift/java</span></span>
<span class="lz-nbody">Native library có sẵn. API tương tự web. Không cần bridge.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ESP32/Arduino embedded</span><span class="lz-nsub">raw ws bắt buộc</span></span>
<span class="lz-nbody">Không có socket.io-client C++. Phải raw ws + tự viết reconnect/heartbeat/framing. Đây là kịch bản duy nhất cần bridge pattern.</span>
</div>
</div>

<h3>Kho này — trường hợp đặc biệt</h3>
<pre><code class="language-text">Maker Lab devices = ESP32
-&gt; buoc phai raw ws + bridge
-&gt; device.gateway.ts la 1.035 dong   (do 14/11/2026: 1.113)

Neu Maker Lab la Raspberry Pi:
-&gt; xai socket.io-client
-&gt; device.gateway.ts khoang 200 dong (chi handler + auth)
</code></pre>

<h3>Cost-benefit của bridge</h3>
<pre><code class="language-text">Bridge cost:
  + 500-1000 dong code (reconnect, heartbeat, framing)
  + Debug kho hon (khong co socket.io tools)
  + Team phai hoc raw ws

Bridge benefit:
  + Support embedded devices
  + Firmware nhe (~50 KB smaller vs socket.io bundle)   (chua do tren ESP32)
  + Protocol control (custom binary neu can)
</code></pre>

<div class="callout warn">
<p><strong>Đừng chọn raw ws vì &quot;lightweight&quot;.</strong> Bạn tiết kiệm ~150 KB library <em>(đo: socket.io-client 4.8.3 nặng 46.822 B bản min, 14.717 B gzip)</em> nhưng viết 800 dòng code + bug reconnect + bug heartbeat. Chỉ chọn khi client platform BUỘC PHẢI (embedded).</p>
</div>

<h3>Alternative — HTTP polling cho device</h3>
<pre><code class="language-cpp">// Neu WebSocket khong on dinh, device co the poll HTTP
void loop() {
  if (millis() - lastPoll &gt; 5000) {
    HTTPClient http;
    http.begin("https://api.example.com/device/poll?id=42");
    http.addHeader("Authorization", &#96;Bearer ${'${'}token}&#96;);
    int code = http.GET();
    if (code == 200) {
      // process pending commands
    }
    lastPoll = millis();
  }
}
</code></pre>

<p>HTTP polling từ device có latency 5s + không realtime. Nhưng đơn giản hơn WS + firmware nhẹ hơn. Dùng khi telemetry ít quan trọng (điện, water meter đọc mỗi 5 phút).</p>

<div class="pitfall">
<p><strong>Bẫy — chọn raw ws cho web browser client.</strong> Browser có socket.io-client sẵn có, tại sao KHÔNG dùng? Browser dev thấy socket.io &quot;heavy&quot; và viết raw ws — mất reconnect, mất rooms, mất debugging tools. Đường về đắt.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Socket.io-client có sẵn cho hầu hết platform (JS, Node, RN, iOS, Android, Python, C#) — raw ws chỉ CẦN cho embedded (ESP32/Arduino/C++) không có socket.io-client; trong các trường hợp khác, socket.io thắng về reconnect + rooms + debugging + code size (trên server, không client bundle).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Liệt kê các platform có socket.io-client (JS, Node, React Native, iOS, Android, Python, C#) và đối chiếu target của bạn.</li>
<li>Xác định một ca thật sự cần raw ws: embedded (ESP32/Arduino/C++) không có socket.io-client.</li>
<li>Với một target không-embedded, lập luận vì sao socket.io thắng về reconnect, rooms, debugging và code size phía server.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn quyết được raw ws vs socket.io cho bất kỳ target nào theo việc có socket.io-client cho nó không.</p></div>

<h3>🔬 Đo thật: ai có client, và socket.io viết tay</h3>
<p>Kiểm với GitHub và npm ngày 14/11/2026 — có client C++ chính thức, client Go cộng đồng đã archived, và thư viện ESP32 mà firmware của kho đang dùng có sẵn <code>SocketIOclient</code>:</p>
<div class="out">$ node khach95.mjs       # hỏi thẳng GitHub API + npm, 14/11/2026
nền tảng                          kho GitHub                            sao   push cuối    archived
JavaScript / Node / React Native  socketio/socket.io-client            10581  2024-07-09  không
C++ (chính thức)                  socketio/socket.io-client-cpp         2357  2025-08-28  không
Swift (chính thức)                socketio/socket.io-client-swift       5288  2024-10-01  không
Java / Kotlin (chính thức)        socketio/socket.io-client-java        5396  2025-08-11  không
Python                            miguelgrinberg/python-socketio        4369  2026-11-03  không
C# .NET                           doghappy/socket.io-client-csharp       797  2026-07-24  không
Go                                googollee/go-socket.io                5765  2024-09-29  CÓ
Rust                              1c3t3a/rust-socketio                   481  2025-02-03  không
Arduino / ESP32 (SocketIOclient)  Links2004/arduinoWebSockets           2069  2026-09-22  không
socket.io-client 4.8.4 (npm) · bản lab 4.8.3: socket.io.min.js 46.822 B · gzip 14.717 B</div>
<p>socket.io nói bằng tay trên WebSocket trần (13 dòng) — vào room của kho và nhận telemetry của bo qua cây cầu thật. Rồi mặc định EIO=3 của <code>SocketIOclient</code> với socket.io 4:</p>
<div class="out">$ wc -l tay95.mjs
      13 tay95.mjs
$ node bo.mjs 1 &amp;  node tay95.mjs 4      # socket.io VIẾT TAY trên WebSocket trần, giao thức đời 4 (EIO=4)
   80 ms ↓ 0{"sid":"oEjb-b6pHiJvgJX5AAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1
   81 ms ↑ 40{"userId":1}          (CONNECT namespace /, kèm auth)
   82 ms ↓ 40{"sid":"SgKlR-oAGcqSjiq2AAAA"}
   82 ms ↑ 42["maker:device:join",1]  (EVENT)
 1079 ms ↓ 42["maker:device:telemetry",{"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":1,"gui":1794611
 2082 ms ↓ 42["maker:device:telemetry",{"deviceId":1,"payload":{"temp":25.3,"rssi":-58,"uptime":2,"gui":1794611
 3000 ms ↓ 42["maker:device:status",{"deviceId":1,"status":"OFFLINE"}]
$ curl -i "localhost:19910/socket.io/?EIO=3&amp;transport=polling"     # mặc định của SocketIOclient trong firmware: EIO=3
HTTP/1.1 400 Bad Request
{"code":5,"message":"Unsupported protocol version"}
$ node tay95.mjs 3       # EIO=3 qua WebSocket
    8 ms ✕ lỗi: Invalid WebSocket frame: RSV1 must be clear
$ EIO3=1 npx tsx may9.ts &amp;  node tay95.mjs 3     # server bật allowEIO3: true
   13 ms ↓ 0{"sid":"oOHPYYbOslsFythDAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1
   16 ms ↑ 40{"userId":1}          (CONNECT namespace /, kèm auth)
   16 ms ↓ 44"unauthorized"
   20 ms ↓ 44"unauthorized"</div>
<div class="callout warn"><p><strong>Bẫy EIO=3:</strong> <code>SocketIOclient.begin()</code> mặc định <code>/socket.io/?EIO=3</code>. socket.io 4 trả polling 400 “Unsupported protocol version”; qua WebSocket bo chỉ thấy khung hỏng; bật <code>allowEIO3: true</code> thì nối được nhưng không gửi được <code>auth</code> trong CONNECT, middleware của kho trả unauthorized. Tự truyền <code>"/socket.io/?EIO=4"</code> (thư viện đổi sang luật ping đời 4 khi thấy <code>EIO=4</code>, <code>SocketIOclient.cpp:70</code>).</p></div>
<div class="callout info"><p><strong>Vậy vì sao kho dùng ws trần?</strong> Không phải vì thiếu client — mà vì tiếng nói nhị phân hai chiều: một khung mỗi khối 2 KB thay vì hai (bài 9.3: 18 vs 34 khung mỗi giây tiếng), và RFC 6455 trần trên chip nhỏ.</p></div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c9</span>
node khach95.mjs                        <span class="tok-comment">  # client cho từng nền tảng: GitHub API (sao, push cuối, archived) + npm + cỡ gói socket.io-client</span>
npx tsx may9.ts &amp;  node bo.mjs 1 &amp;      <span class="tok-comment">  # gateway kho + một bo giả làm nguồn telemetry</span>
node tay95.mjs 4                        <span class="tok-comment">  # socket.io VIẾT TAY (13 dòng) trên ws trần: 0 OPEN ⇒ 40 CONNECT ⇒ 42 EVENT ⇒ 2/3 ping</span>
curl -i "localhost:19910/socket.io/?EIO=3&amp;transport=polling" <span class="tok-comment">  # mặc định của SocketIOclient ⇒ 400</span>
EIO3=1 npx tsx may9.ts &amp;  node tay95.mjs 3                   <span class="tok-comment">  # allowEIO3: nối được, nhưng auth trong CONNECT không có</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — Từ hỏi đi hỏi lại tới được báo: WebSocket</span><span class="lc-sub">WebSocket trần bên dưới client viết tay</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: nâng cấp, frame và nhịp tim</span><span class="lc-sub">Khung, mặt nạ và ping/pong</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.5 — Chọn: Pub/Sub, Stream, list hay một broker thật</span><span class="lc-sub">Khi một đàn thiết bị cần broker thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">socket.io-client</span><span class="v">Client chính thức, có cho hầu hết platform.</span></div>
  <div class="kv"><span class="k">Embedded target</span><span class="v">ESP32/Arduino/C++ — nơi duy nhất raw ws là cần thiết.</span></div>
  <div class="kv"><span class="k">Độ phủ platform</span><span class="v">JS, Node, RN, iOS, Android, Python, C# đều có client.</span></div>
  <div class="kv"><span class="k">Code size phía server</span><span class="v">socket.io thu nhỏ code SERVER, không phải client bundle.</span></div>
  <div class="kv"><span class="k">Reconnect/rooms</span><span class="v">Có sẵn với socket.io; tự viết với raw ws.</span></div>
  <div class="kv"><span class="k">Luật quyết định</span><span class="v">Chỉ dùng raw ws khi không có socket.io-client cho target.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>socket.io-client có cho hầu hết platform: JS, Node, RN, iOS, Android, Python, C#.</li><li>Raw ws chỉ CẦN cho embedded (ESP32/Arduino/C++) không có client.</li><li>Trong các trường hợp khác socket.io thắng về reconnect, rooms và debugging.</li><li>Nó cũng thắng về code size — trên server, không phải client bundle.</li><li>Luật quyết định đơn giản là có socket.io-client cho target của bạn hay không.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — client libraries</span><span class="lc-sub">socket.io/docs/v4/client-installation — list official + community clients.</span></span></div>
</div>
`,
    },

    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra Chương 9',
      slug: 'io-9-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về raw ws cho device, reconnect manual, framing, bridge pattern.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>What Chapter 9 established</h2>
<p class="lead">Six questions on raw WebSocket — when the library is not available, and what you have to write yourself.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">A microcontroller cannot run the Socket.IO client</span><span class="lz-d">That is why the device tier speaks raw WebSocket. Everything the library gave you — reconnect with backoff, heartbeats, framing, acks — becomes code you own, which is why that gateway file is over a thousand lines.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Reconnect logic is the hard part</span><span class="lz-d">Exponential backoff with jitter, a cap, and a distinction between "the network blipped" and "the server rejected us". Getting this wrong produces either a thundering herd or a device that never comes back.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">JSON framing is not free</span><span class="lz-d">On a constrained device, parsing and allocating for every message is a real cost. A compact binary framing or a fixed schema is often the difference between comfortable and out of memory.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Chương 9 đã dựng được gì</h2>
<p class="lead">Sáu câu về WebSocket thuần — khi thư viện không dùng được, và bạn phải tự viết những gì.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Một vi điều khiển không chạy được client Socket.IO</span><span class="lz-d">Đó là lý do tầng thiết bị nói WebSocket thuần. Mọi thứ thư viện từng cho bạn — kết nối lại có backoff, nhịp tim, đóng khung, ack — trở thành mã bạn sở hữu, và đó là lý do file gateway đó dài hơn một nghìn dòng.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Logic kết nối lại mới là phần khó</span><span class="lz-d">Backoff luỹ thừa có nhiễu ngẫu nhiên, một trần, và một sự phân biệt giữa "mạng chớp" với "server từ chối chúng ta". Làm sai chỗ này sinh ra hoặc một bầy đàn ập tới, hoặc một thiết bị không bao giờ quay lại.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Đóng khung JSON không miễn phí</span><span class="lz-d">Trên một thiết bị eo hẹp, việc phân tích và cấp phát cho mỗi thông điệp là một chi phí thật. Một cách đóng khung nhị phân gọn hoặc một schema cố định thường là khác biệt giữa thoải mái và hết bộ nhớ.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Why is device.gateway.ts (1.113 lines) larger than messaging.socket.ts (668 lines)?|||Vì sao device.gateway.ts (1.113 dòng) lớn hơn messaging.socket.ts (668 dòng)?',
            options: [
              'Mostly the robot’s own work — streaming voice (~35% of the file), commands, logs, telemetry; only ~8% is protocol plumbing socket.io would give for free (heartbeat, event routing)|||Phần lớn là việc riêng của robot — bơm tiếng nói (~35% tệp), lệnh, log, telemetry; chỉ ~8% là ống nước giao thức socket.io cho không (heartbeat, chuyển sự kiện)',
              'Device gateway handles more traffic|||Device gateway handle nhiều traffic hơn',
              'It has more features|||Nó có nhiều feature hơn',
              'Random — no reason|||Ngẫu nhiên — không lý do',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '1.000 ESP32 devices power-cycle simultaneously after outage. What must the reconnect logic do?|||1.000 ESP32 device power-cycle đồng thời sau outage. Reconnect logic phải làm gì?',
            options: [
              'Exponential backoff with JITTER (±20%) — otherwise 1.000 devices all attempt at t=30s and server can be overwhelmed|||Exponential backoff với JITTER (±20%) — không thì 1.000 device đều thử ở t=30s và server có thể overload',
              'Immediate retry every 100ms|||Thử lại ngay mỗi 100ms',
              'Wait 10 minutes before retry|||Đợi 10 phút mới retry',
              'Give up after first failure|||Bỏ cuộc sau lần fail đầu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'JSON parsing on ESP32 costs ~5ms and ~2 KB RAM per parse. When to switch to binary?|||Parse JSON trên ESP32 tốn ~5ms và ~2 KB RAM per parse. Khi nào chuyển binary?',
            options: [
              'When telemetry frequency exceeds ~10 msg/s per device — JSON is fine for &lt;1/s; use MessagePack/CBOR for 1-10/s; use custom binary/Protobuf for &gt;10/s|||Khi tần suất telemetry vượt ~10 msg/s per device — JSON OK cho &lt;1/s; dùng MessagePack/CBOR cho 1-10/s; custom binary/Protobuf cho &gt;10/s',
              'Always immediately|||Luôn luôn ngay',
              'Never — JSON always wins|||Không bao giờ — JSON luôn thắng',
              'Only for security|||Chỉ vì bảo mật',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How does dashboard tier receive device telemetry?|||Dashboard tier nhận device telemetry thế nào?',
            options: [
              'Bridge pattern: device sends via raw ws → gateway forwards to socket.io room <code>device:XX</code> → dashboard subscribes via socket.io <code>maker:device:join</code>. Loose coupling: swapping either tier does not affect the other|||Bridge pattern: device gửi qua raw ws → gateway forward vào socket.io room <code>device:XX</code> → dashboard subscribe qua socket.io <code>maker:device:join</code>. Loose coupling: swap tier nào cũng không affect tier kia',
              'Direct WebSocket connection to device|||WebSocket trực tiếp đến device',
              'HTTP polling|||HTTP polling',
              'MQTT broker|||MQTT broker',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You&#39;re building a mobile chat app. Which client library?|||Bạn build mobile chat app. Client library nào?',
            options: [
              'socket.io-client-swift (iOS) or socket.io-client-java (Android) — native libraries exist for both platforms, API similar to web socket.io-client, no need for bridge or raw ws|||socket.io-client-swift (iOS) hoặc socket.io-client-java (Android) — native library có cho cả hai, API giống web socket.io-client, không cần bridge hay raw ws',
              'Raw WebSocket for lightweight|||Raw WebSocket cho lightweight',
              'HTTP long-polling|||HTTP long-polling',
              'Custom TCP protocol|||Custom TCP protocol',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to save ~15 KB (gzip) from browser bundle by using raw ws instead of socket.io-client. Good idea?|||Bạn muốn save ~15 KB (gzip) browser bundle bằng cách dùng raw ws thay socket.io-client. Ý tưởng tốt?',
            options: [
              'No — you save ~15 KB gzipped but write hundreds of lines of reconnect/room/heartbeat code with bugs; lose debugging tools. Not worth it for browsers|||Không — bạn save ~15 KB gzip nhưng viết hàng trăm dòng code reconnect/room/heartbeat với bug; mất tools debug. Không đáng cho browser',
              'Yes, always minimize bundle size|||Có, luôn minimize bundle size',
              'Only if using code splitting|||Chỉ nếu dùng code splitting',
              'Only for React apps|||Chỉ cho React app',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
