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
      title: '9.1 — Why device.gateway.ts is 1.035 lines|||9.1 — Vì sao device.gateway.ts là 1.035 dòng',
      slug: 'io-9-1-vi-sao',
      type: 'VIDEO',
      description: 'ESP32 firmware có ws.h (Arduino WebSocket) — không có socket.io-client. Phải tự viết reconnect, heartbeat, room fanout, auth. Đó là 1.035 dòng vs 518 của messaging.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Why device.gateway.ts is 1.035 lines</h2>
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
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">firmware Arduino/ESP32</span><span class="lz-d">Có <code>WebSocketsClient</code> library — raw WebSocket. There is no socket.io C++ client (only JavaScript, Swift and Kotlin). The firmware has NO Node.js runtime.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">socket.io framing overhead</span><span class="lz-d">Every packet carries an engine.io prefix plus a socket.io type. For a device sending 20 bytes of telemetry, 60% overhead is too much.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">the socket.io polling fallback is meaningless here</span><span class="lz-d">An ESP32 does not use the HTTP long-poll fallback. If WS fails, the device is offline. No fallback is needed on the device side.</span></div>
</div>

<h3>The device gateway's three tiers</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Device tier</span><span class="lz-nsub">ESP32 firmware</span></span>
<span class="lz-nbody">Connects over a raw WebSocket. Ping/pong is hand-written using WebSocket ping frames. The initial auth is an HTTP POST to get a token, after which the WS opens with <code>?token=...</code> URL param.</span>
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

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Arduino WebSocketsClient</span><span class="lc-sub">github.com/Links2004/arduinoWebSockets — thư viện WS phổ biến cho ESP32/Arduino.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MQTT — the IoT standard</span><span class="lc-sub">mqtt.org — protocol chuẩn cho IoT, alternative cho raw ws.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Vì sao device.gateway.ts là 1.035 dòng</h2>
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
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">firmware Arduino/ESP32</span><span class="lz-d">Có <code>WebSocketsClient</code> library — WebSocket thuần. Không có socket.io C++ client (chỉ có JavaScript, Swift, Kotlin). Firmware KHÔNG có Node.js runtime.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">socket.io framing overhead</span><span class="lz-d">Mỗi packet có prefix engine.io + socket.io type. Cho device chỉ gửi telemetry 20 byte, overhead 60% là quá.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">socket.io polling fallback không có nghĩa</span><span class="lz-d">ESP32 không dùng HTTP long-poll fallback. Nếu WS fail, device offline. Không cần fallback ở device side.</span></div>
</div>

<h3>Ba tầng của device gateway</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Device tầng</span><span class="lz-nsub">ESP32 firmware</span></span>
<span class="lz-nbody">Connect qua raw WebSocket. Ping/pong tự viết bằng WebSocket ping frames. Auth ban đầu là POST HTTP để lấy token, sau đó open WS với <code>?token=...</code> URL param.</span>
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
      ws.begin("api.example.com", 80, "/devices");
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

<p>A WebSocket-native ping frame is lighter (~2 bytes) but some proxies strip it. An application-level ping (JSON) is heavier but always gets through. This repo uses both.</p>

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
      ws.begin("api.example.com", 80, "/devices");
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

<p>WebSocket-native ping frame nhẹ hơn (~2 byte) nhưng một số proxy strip. Application-level ping (JSON) nặng hơn nhưng luôn qua. Kho này dùng cả hai.</p>

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
    ws.close(1002, 'invalid JSON');
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
    ws.close(1002, 'invalid JSON');
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
    // Optional: send current status
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
  if (!canAccess) return socket.emit('error', { message: 'forbidden' });
  socket.join(&#96;device:\${deviceId}&#96;);
});
</code></pre>

<h3>The reverse direction — commands from dashboard to device</h3>
<pre><code class="language-ts">socket.on('maker:device:command', async (data) =&gt; {
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

Do bang: device.emit(&#96;now: \${millis()}&#96;) -&gt; dashboard log delta
</code></pre>

<div class="pitfall">
<p><strong>Trap — a bridge that does NOT authenticate the device.</strong> Anyone who knows a deviceId can send raw ws → the server bridges it → dashboards display fabricated telemetry. The bridge MUST verify the device token before emitting into socket.io. Do not trust a device merely because it &quot;has&quot; a deviceId.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The bridge pattern relays from raw ws (device tier) into a socket.io room (dashboard tier) via <code>io.to(&#96;device:XX&#96;).emit(...)</code> — the loose coupling lets you swap either tier independently; permission checks are required in BOTH directions (a dashboard joining a room, and a command going to a device); end-to-end latency is 20-100ms depending on the network.</p>
</div>

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
    // Optional: send current status
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
  if (!canAccess) return socket.emit('error', { message: 'forbidden' });
  socket.join(&#96;device:\${deviceId}&#96;);
});
</code></pre>

<h3>Reverse — command từ dashboard đến device</h3>
<pre><code class="language-ts">socket.on('maker:device:command', async (data) =&gt; {
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

Do bang: device.emit(&#96;now: ${'${'}millis()}&#96;) -&gt; dashboard log delta
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bridge KHÔNG kiểm authenticate device.</strong> Ai đó biết deviceId gửi raw ws → server bridge → dashboard nhận telemetry giả. Bridge PHẢI verify device token trước khi emit sang socket.io. Đừng trust device chỉ vì họ &quot;có&quot; deviceId.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bridge pattern relay từ raw ws (device tier) sang socket.io room (dashboard tier) qua <code>io.to(&#96;device:XX&#96;).emit(...)</code> — loose coupling cho phép swap device tier hoặc dashboard tier độc lập; permission check ở CẢ chiều (dashboard join room + command đến device); latency end-to-end 20-100ms tuỳ network.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>When socket.io is enough after all</h2>
<p class="lead">The 1.035-line device gateway is only necessary because ESP32 doesn&#39;t have socket.io-client. If your &quot;device&quot; is anything else, socket.io still probably wins.</p>

<h3>The client-support table</h3>
<div class="out">Platform                socket.io-client available?
JavaScript (browser)    YES — socket.io-client
Node.js (server)        YES — socket.io-client (same)
React Native            YES — socket.io-client works
iOS (Swift)             YES — socket.io-client-swift
Android (Kotlin/Java)   YES — socket.io-client-java
Python                  YES — python-socketio
C# .NET                 YES — SocketIOClient (community)
Go                      Limited — go-socket.io (community, older)
C++ / Arduino / ESP32   NO — raw WebSocket only
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
-&gt; device.gateway.ts la 1.035 dong

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
  + Firmware nhe (~50 KB smaller vs socket.io bundle)
  + Protocol control (custom binary neu can)
</code></pre>

<div class="callout warn">
<p><strong>Do not choose raw ws because it is &quot;lightweight&quot;.</strong> You save ~150 KB of library and write 800 lines of code plus reconnect bugs plus heartbeat bugs. Choose it only when the client platform LEAVES YOU NO CHOICE (embedded).</p>
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

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — client libraries</span><span class="lc-sub">socket.io/docs/v4/client-installation — list official + community clients.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Khi socket.io là đủ dù sao đi nữa</h2>
<p class="lead">Gateway device 1.035 dòng chỉ cần thiết vì ESP32 không có socket.io-client. Nếu &quot;device&quot; của bạn là gì khác, socket.io vẫn có thể thắng.</p>

<h3>Bảng client support</h3>
<div class="out">Platform                socket.io-client available?
JavaScript (browser)    YES — socket.io-client
Node.js (server)        YES — socket.io-client (same)
React Native            YES — socket.io-client works
iOS (Swift)             YES — socket.io-client-swift
Android (Kotlin/Java)   YES — socket.io-client-java
Python                  YES — python-socketio
C# .NET                 YES — SocketIOClient (community)
Go                      Limited — go-socket.io (community, older)
C++ / Arduino / ESP32   NO — raw WebSocket only
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
-&gt; device.gateway.ts la 1.035 dong

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
  + Firmware nhe (~50 KB smaller vs socket.io bundle)
  + Protocol control (custom binary neu can)
</code></pre>

<div class="callout warn">
<p><strong>Đừng chọn raw ws vì &quot;lightweight&quot;.</strong> Bạn tiết kiệm ~150 KB library nhưng viết 800 dòng code + bug reconnect + bug heartbeat. Chỉ chọn khi client platform BUỘC PHẢI (embedded).</p>
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
            question: 'Why is device.gateway.ts (1.035 lines) larger than messaging.socket.ts (518 lines)?|||Vì sao device.gateway.ts (1.035 dòng) lớn hơn messaging.socket.ts (518 dòng)?',
            options: [
              'ESP32 has no socket.io-client, so the gateway hand-writes reconnect, heartbeat, room fanout, message framing, and auth — everything socket.io normally handles|||ESP32 không có socket.io-client, nên gateway tự viết reconnect, heartbeat, room fanout, message framing, auth — mọi thứ socket.io thường lo',
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
            question: 'You want to save 150 KB from browser bundle by using raw ws instead of socket.io-client. Good idea?|||Bạn muốn save 150 KB browser bundle bằng cách dùng raw ws thay socket.io-client. Ý tưởng tốt?',
            options: [
              'No — you save 150 KB library but write hundreds of lines of reconnect/room/heartbeat code with bugs; lose debugging tools. Not worth it for browsers|||Không — bạn save 150 KB library nhưng viết hàng trăm dòng code reconnect/room/heartbeat với bug; mất tools debug. Không đáng cho browser',
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
