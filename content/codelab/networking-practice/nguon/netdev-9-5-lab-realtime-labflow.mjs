/**
 * Networking for Developers · Chương 9 (kết nối thời gian thực) — bộ luyện chương, gắn bài Lab 9 (netdev-9-5-lab-realtime-labflow).
 * Dữ liệu thật: lab/out/c92-ws (101 Switching Protocols với khoá mẫu của RFC 6455 ⇒ s3pPLMBiTxaQ9kYGzzhZRbK+xOo=), c93-scale (lịch nối
 * lại lùi dần + nhiễu, trần 30 s), c91-sse (header của SSE). Ca ẩn của wsAccept được đối chiếu với node:crypto lúc dựng đề.
 */
import { createHash } from 'node:crypto';
import { doiDau, KHOA, tn, jsBai, nguon, goi, ra, sauLenh, pre, cs, tinh, bang1, mt, q } from './_net.mjs';

const WS = ra('c92-ws').split('\n').map((d) => d.replace(/\r$/, ''));
const ACCEPT_RFC = (WS.find((d) => /^Sec-WebSocket-Accept: s3pP/.test(d)) || '').split(': ')[1];
const BACK = sauLenh('c93-scale', 'node /lab/k/code/ch09/backoff.mjs').filter((d) => /^\d+\s/.test(d)).map((d) => d.trim().split(/\s+/).map(Number));
const SSE_H = ra('c91-sse').split('\n').map((d) => d.replace(/\r$/, '')).filter((d) => /^(content-type|cache-control|x-accel-buffering):/i.test(d));
if (ACCEPT_RFC !== 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=' || BACK.length !== 8 || SSE_H.length < 3) throw new Error('Ch9: output thật đổi — xem lại đề');

function wsAccept(key) {
  var s = String(key) + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'; // the fixed GUID from RFC 6455
  var bytes = [];
  for (var i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i) & 255); // the key is ASCII (base64)
  // ── SHA-1 (FIPS 180-4) ──
  var ml = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (var b = 7; b >= 0; b--) bytes.push(b >= 4 ? 0 : (ml >>> (b * 8)) & 255); // 64-bit big-endian length (fits in 32 bits here)
  var h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
  var rotl = function (x, n) { return (x << n) | (x >>> (32 - n)); };
  for (var off = 0; off < bytes.length; off += 64) {
    var w = [];
    for (var t = 0; t < 16; t++) w[t] = (bytes[off + 4 * t] << 24) | (bytes[off + 4 * t + 1] << 16) | (bytes[off + 4 * t + 2] << 8) | bytes[off + 4 * t + 3];
    for (t = 16; t < 80; t++) w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
    var a = h0, bb = h1, c = h2, d = h3, e = h4;
    for (t = 0; t < 80; t++) {
      var f, k;
      if (t < 20) { f = (bb & c) | (~bb & d); k = 0x5A827999; }
      else if (t < 40) { f = bb ^ c ^ d; k = 0x6ED9EBA1; }
      else if (t < 60) { f = (bb & c) | (bb & d) | (c & d); k = 0x8F1BBCDC; }
      else { f = bb ^ c ^ d; k = 0xCA62C1D6; }
      var tmp = (rotl(a, 5) + f + e + k + w[t]) | 0;
      e = d; d = c; c = rotl(bb, 30); bb = a; a = tmp;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + bb) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
  }
  var digest = [];
  [h0, h1, h2, h3, h4].forEach(function (h) { digest.push((h >>> 24) & 255, (h >>> 16) & 255, (h >>> 8) & 255, h & 255); });
  // ── base64 of the 20 raw bytes ──
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', out = '';
  for (var j = 0; j < digest.length; j += 3) {
    var n = (digest[j] << 16) | ((digest[j + 1] || 0) << 8) | (digest[j + 2] || 0);
    out += A[(n >>> 18) & 63] + A[(n >>> 12) & 63] + (j + 1 < digest.length ? A[(n >>> 6) & 63] : '=') + (j + 2 < digest.length ? A[n & 63] : '=');
  }
  return out;
}
const KEYS = ['x3JJHMbDL1EzLkh9GBhXDw==', 'AQIDBAUGBwgJCgsMDQ4PEA==', 'LabFlowBoard0000000000==', ''];
for (const k of [ 'dGhlIHNhbXBsZSBub25jZQ==', ...KEYS]) {
  const want = createHash('sha1').update(k + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  if (wsAccept(k) !== want) throw new Error(`wsAccept lệch node:crypto với khoá ${k}`);
}

const E1 = jsBai({
  ten: 'Realtime 1 — Write wsAccept(key): the WebSocket handshake by hand', kho: 'HARD', phut: 40, diem: 40,
  en: `<p>A WebSocket starts as an HTTP request with <code>Upgrade: websocket</code> and a random <code>Sec-WebSocket-Key</code>. The server proves it understood by answering <code>101 Switching Protocols</code> with <code>Sec-WebSocket-Accept</code> = base64( SHA-1( key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" ) ). Lab 9 sent the RFC's own sample key and got, for real:</p>${pre(WS.filter((d) => /^HTTP\/1\.1 101|^Upgrade|^Connection|^Sec-WebSocket-Accept: s3pP/.test(d)).slice(0, 4))}<p>Write <code>wsAccept(key)</code> returning that string. The grader runs in a sandbox with <b>no</b> <code>crypto</code>, <code>Buffer</code> or <code>btoa</code>: implement SHA-1 (FIPS 180-4: pad with 0x80, zeros, the 64-bit bit length; 80 rounds per 64-byte block) and base64 yourself. The key is ASCII.</p>`,
  vi: `<p>WebSocket bắt đầu là một request HTTP có <code>Upgrade: websocket</code> và một <code>Sec-WebSocket-Key</code> ngẫu nhiên. Server chứng minh nó hiểu bằng cách trả <code>101 Switching Protocols</code> kèm <code>Sec-WebSocket-Accept</code> = base64( SHA-1( key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" ) ). Lab 9 gửi đúng khoá mẫu của RFC và nhận được, thật:</p>${pre(WS.filter((d) => /^HTTP\/1\.1 101|^Upgrade|^Connection|^Sec-WebSocket-Accept: s3pP/.test(d)).slice(0, 4))}<p>Viết <code>wsAccept(key)</code> trả về chuỗi đó. Máy chấm chạy trong hộp cát <b>không có</b> <code>crypto</code>, <code>Buffer</code> hay <code>btoa</code>: tự cài SHA-1 (FIPS 180-4: đệm 0x80, các số 0, độ dài 64 bit tính theo bit; 80 vòng cho mỗi khối 64 byte) và base64. Khoá là ASCII.</p>`,
  dau: 'function wsAccept(key) {\n  // SHA-1 then base64 — no crypto, no Buffer, no btoa in the sandbox\n  return "";\n}\n',
  giai: nguon(wsAccept),
  cases: [
    { goi: goi('wsAccept', 'dGhlIHNhbXBsZSBub25jZQ=='), moTa: ['Case 1: the RFC 6455 sample key, as answered by the real lab server', 'Ca 1: khoá mẫu của RFC 6455, đúng như server lab thật trả lời'] },
    { goi: goi('wsAccept', KEYS[0]) },
    { goi: goi('wsAccept', KEYS[1]), an: true },
    { goi: goi('wsAccept', KEYS[2]), an: true },
    { goi: goi('wsAccept', KEYS[3]), an: true },
  ],
  goiY: [['Write sha1(bytes) returning 20 bytes, then base64(bytes); test SHA-1 on "abc" = a9993e36…', 'Viết sha1(bytes) trả 20 byte, rồi base64(bytes); thử SHA-1 với "abc" = a9993e36…'], ['Keep every 32-bit sum with | 0 and rotate with (x << n) | (x >>> (32 - n)).', 'Giữ mọi tổng 32 bit bằng | 0 và xoay bằng (x << n) | (x >>> (32 - n)).'], ['20 bytes is not a multiple of 3, so base64 ends with exactly one "=".', '20 byte không chia hết cho 3, nên base64 kết thúc bằng đúng một dấu "=".']],
  loi: [['Base64-encoding the HEX string of the digest instead of the 20 raw bytes.', 'Mã base64 chuỗi HEX của digest thay vì 20 byte thô.'], ['Decoding the client key from base64 first — the key is used as the literal ASCII text.', 'Giải mã base64 khoá của client trước — khoá được dùng nguyên văn dạng chữ ASCII.']],
  gt: ['The accept value is not security; it proves the server speaks WebSocket and was not a confused HTTP cache replaying an old response. After the 101, the same TCP connection carries WebSocket frames instead of HTTP — which is why proxies must be configured to pass the Upgrade through.', 'Giá trị accept không phải biện pháp an ninh; nó chứng minh server nói được WebSocket chứ không phải một cache HTTP lú lẫn đang phát lại phản hồi cũ. Sau mã 101, cùng kết nối TCP đó chở frame WebSocket thay cho HTTP — vì thế proxy phải được cấu hình cho Upgrade đi qua.'],
  kn: ['WebSocket handshake', 'SHA-1', 'base64'],
});

function backoffSchedule(baseMs, capMs, jitters) {
  return jitters.map(function (j, i) {
    var base = Math.min(capMs, baseMs * Math.pow(2, i)); // 1 s, 2 s, 4 s… capped
    return { attempt: i + 1, base: base, wait: base + j };
  });
}
const E2 = jsBai({
  ten: 'Realtime 2 — Write backoffSchedule(baseMs, capMs, jitters): reconnect without a stampede', kho: 'MEDIUM', phut: 15,
  en: `<p>When a server restarts, every client reconnects. Lab 9's real schedule (base 1 s, doubling, cap 30 s, plus random jitter):</p>${pre(sauLenh('c93-scale', 'node /lab/k/code/ch09/backoff.mjs'))}<p>Write <code>backoffSchedule(baseMs, capMs, jitters)</code>: for attempt i (1, 2, 3…), <code>base</code> = min(capMs, baseMs × 2<sup>i−1</sup>) and <code>wait</code> = base + jitters[i−1]. Return one <code>{ attempt, base, wait }</code> per jitter value. The jitter is given so the result is deterministic.</p>`,
  vi: `<p>Khi server khởi động lại, mọi client đều nối lại. Lịch thật của Lab 9 (gốc 1 giây, gấp đôi, trần 30 giây, cộng nhiễu ngẫu nhiên):</p>${pre(sauLenh('c93-scale', 'node /lab/k/code/ch09/backoff.mjs'))}<p>Viết <code>backoffSchedule(baseMs, capMs, jitters)</code>: với lần thử i (1, 2, 3…), <code>base</code> = min(capMs, baseMs × 2<sup>i−1</sup>) và <code>wait</code> = base + jitters[i−1]. Trả một <code>{ attempt, base, wait }</code> cho mỗi giá trị nhiễu. Nhiễu được cho sẵn để kết quả xác định.</p>`,
  dau: 'function backoffSchedule(baseMs, capMs, jitters) {\n  return [];\n}\n',
  giai: nguon(backoffSchedule),
  cases: [
    { goi: goi('backoffSchedule', 1000, 30000, BACK.map((r) => r[2])), moTa: ['Case 1: the real jitters of Lab 9', 'Ca 1: các giá trị nhiễu thật của Lab 9'] },
    { goi: goi('backoffSchedule', 500, 4000, [0, 0, 0, 0, 0]) },
    { goi: goi('backoffSchedule', 250, 1000, [10, 20, 30, 40]), an: true },
    { goi: goi('backoffSchedule', 1000, 30000, []), an: true },
  ],
  goiY: [['Math.pow(2, i) with i starting at 0 gives 1, 2, 4, 8…', 'Math.pow(2, i) với i bắt đầu từ 0 cho 1, 2, 4, 8…'], ['Apply the cap to the base BEFORE adding the jitter.', 'Áp trần cho base TRƯỚC khi cộng nhiễu.']],
  loi: [['Capping the final wait, which removes the jitter at the top and re-synchronises clients.', 'Áp trần lên thời gian chờ cuối, làm mất nhiễu ở mức trần và khiến client đồng bộ trở lại.'], ['No jitter at all: 10,000 clients reconnect in the same millisecond after every restart.', 'Không có nhiễu: 10.000 client nối lại trong cùng một mili giây sau mỗi lần khởi động lại.']],
  gt: ['Exponential backoff spreads retries over time; jitter spreads them across clients. Without the second, every client that disconnected together comes back together and knocks the freshly started server over again — a thundering herd.', 'Lùi theo hàm mũ trải các lần thử theo thời gian; nhiễu trải chúng ra giữa các client. Thiếu thứ hai, mọi client rớt cùng lúc sẽ quay lại cùng lúc và đánh sập luôn server vừa khởi động — hiện tượng bầy đàn.'],
  kn: ['exponential backoff', 'jitter'],
});

const E3 = tinh({
  tieuDe: 'Realtime 3 — Polling, SSE, WebSocket or WebRTC?', doKho: 'MEDIUM', phut: 10,
  moTa: mt(`Lesson 9.1's rule: one-way server→client fits Server-Sent Events, genuinely two-way fits a WebSocket, peer-to-peer media is WebRTC, and rare, non-urgent changes are fine with plain polling. Real SSE response headers from the lab:${pre(SSE_H)}`, `Quy tắc của bài 9.1: một chiều server→client hợp với Server-Sent Events, hai chiều thật sự hợp với WebSocket, media ngang hàng là WebRTC, còn thay đổi hiếm và không gấp thì polling thường là đủ. Header SSE thật từ lab:${pre(SSE_H)}`),
  loai: 'table',
  bang: [bang1('b1', ['Pick the mechanism', 'Chọn cơ chế'], [{ ma: 'f', ten: 'Feature' }, { ma: 'm', ten: 'Mechanism', luaChon: ['polling', 'SSE', 'WebSocket', 'WebRTC'] }], [
    { o: { f: 'Live build log streamed to the browser' }, a: { m: 'SSE' } },
    { o: { f: 'Notification badge for new comments' }, a: { m: 'SSE' } },
    { o: { f: 'A shared whiteboard where everyone draws at once' }, a: { m: 'WebSocket' } },
    { o: { f: 'Video call between two students' }, a: { m: 'WebRTC' } },
    { o: { f: 'A dashboard figure that changes once an hour' }, a: { m: 'polling' } },
  ], ['SSE is plain HTTP, reconnects by itself (retry:) and passes proxies — as long as buffering is off (X-Accel-Buffering: no). The whiteboard sends as much as it receives, so it needs a WebSocket. Media between two peers goes over WebRTC; your part is the signalling. An hourly figure does not justify a connection held open all day.', 'SSE là HTTP thường, tự nối lại (retry:) và đi qua proxy được — miễn là tắt đệm (X-Accel-Buffering: no). Bảng vẽ chung gửi đi nhiều như nhận về, nên cần WebSocket. Media giữa hai bên đi qua WebRTC; phần của bạn là signalling. Một con số đổi mỗi giờ không đáng để giữ một kết nối mở cả ngày.'])],
  goiY: ['Ask: who talks — server only, or both sides?', 'An open connection costs a file descriptor and memory for every user, all day.'],
  loiHayGap: ['Choosing a WebSocket for a one-way notification stream.', 'Forgetting X-Accel-Buffering: no, so nginx holds SSE events until its buffer fills.'],
  thuatNgu: [tn('Server-Sent Events', 'sự kiện do server đẩy'), tn('signalling', 'kênh báo hiệu')], khaiNiem: ['realtime transports'],
});

const E4 = cs({
  ten: 'Realtime 4 — Keeping long-lived connections alive at scale', kho: 'HARD', phut: 10,
  en: 'Lessons 9.2–9.4: heartbeats, file descriptors, deploys and NAT traversal.',
  vi: 'Bài 9.2–9.4: nhịp tim, file descriptor, deploy và xuyên NAT.',
  cau: [
    q('c1', ['A WebSocket works for a few minutes on the office network, then silently freezes. Most likely cause?', 'Một WebSocket chạy được vài phút trên mạng văn phòng rồi lặng lẽ đứng hình. Nguyên nhân nhiều khả năng nhất?'], ['A NAT or proxy dropped the idle connection; add ping/pong heartbeats', 'The server ran out of CPU', 'The browser limits WebSockets to five minutes', 'TLS keys expire after five minutes'], ['Middleboxes forget idle flows without telling either side. Application-level ping/pong frames every 20–30 s keep the entry alive and detect a dead link quickly.', 'Thiết bị trung gian quên luồng nhàn rỗi mà không báo bên nào. Frame ping/pong ở tầng ứng dụng mỗi 20–30 giây giữ mục đó sống và phát hiện đường chết nhanh.']),
    q('c2', ['Why does each instance need a high file-descriptor limit (ulimit -n)?', 'Vì sao mỗi instance cần trần file descriptor (ulimit -n) cao?'], ['Every open connection is one socket, and each socket is one descriptor', 'WebSocket frames are written to temporary files', 'TLS needs one descriptor per certificate', 'The kernel opens a log file per user'], ['Five SSE clients were five ESTABLISHED sockets in the lab. 50,000 users is 50,000 descriptors on that box, plus whatever the process already uses.', 'Năm client SSE là năm socket ESTABLISHED trong lab. 50.000 người dùng là 50.000 descriptor trên máy đó, cộng những gì tiến trình đã dùng sẵn.']),
    q('c3', ['Users on instance A must receive messages published on instance B. What is the usual fix?', 'Người dùng trên instance A phải nhận tin được đăng trên instance B. Cách sửa thường dùng là gì?'], ['A shared pub/sub broker such as Redis', 'Sticky sessions on the balancer alone', 'One giant instance for everybody', 'Polling the database every 100 ms'], ['Sticky sessions keep a user on one instance but do not connect instances to each other. A broker fans every message out to all instances, each delivering to its own sockets.', 'Sticky session giữ một người trên một instance nhưng không nối các instance với nhau. Một broker phát mỗi tin tới mọi instance, mỗi instance giao cho các socket của riêng nó.']),
    q('c4', ['How do you deploy a new version without cutting every live connection at once?', 'Làm sao deploy bản mới mà không cắt mọi kết nối đang sống cùng lúc?'], ['Drain and roll instances one at a time', 'Restart every instance at the same moment', 'Raise the heartbeat interval during deploys', 'Disable WebSockets for the whole deploy'], ['Stop sending new connections to an instance, let its clients finish, restart it, then the next one. A rolling, draining deploy turns an outage into a brief reconnect, and backoff with jitter keeps the reconnect wave from overwhelming the new instances.', 'Ngừng đưa kết nối mới vào một instance, để client của nó xong việc, khởi động lại nó, rồi tới instance kế. Deploy cuốn chiếu có xả bớt biến một sự cố thành một lần nối lại ngắn, và lùi dần có nhiễu giữ cho làn sóng nối lại không đè bẹp instance mới.']),
    q('c5', ['In a WebRTC call, when is a TURN server needed?', 'Trong cuộc gọi WebRTC, khi nào cần tới server TURN?'], ['When no direct path works, e.g. behind a symmetric NAT', 'Always, to encrypt the media', 'Only to find the public IP address', 'To exchange the SDP offer and answer'], ['STUN tells each peer its public mapping; ICE tries the candidates; TURN relays the media when nothing direct connects. The SDP exchange is the signalling you build yourself, usually over a WebSocket.', 'STUN cho mỗi bên biết ánh xạ công cộng của nó; ICE thử các ứng viên; TURN chuyển tiếp media khi không đường trực tiếp nào nối được. Trao đổi SDP là phần signalling bạn tự dựng, thường qua WebSocket.']),
  ],
  goiY: [['Long-lived connections fail silently; heartbeats make the failure visible.', 'Kết nối sống lâu hỏng trong im lặng; nhịp tim làm lỗi hiện ra.'], ['Scale-out needs instances to share messages, not just users to stick.', 'Mở rộng cần các instance chia sẻ tin nhắn, không chỉ người dùng bám một chỗ.']],
  loi: [['Relying on TCP keepalive defaults (two hours) to detect a dead WebSocket.', 'Dựa vào mặc định TCP keepalive (hai giờ) để phát hiện WebSocket chết.'], ['Thinking sticky sessions solve cross-instance broadcast.', 'Tưởng sticky session giải được phát tin giữa các instance.']],
  tns: [tn('heartbeat', 'nhịp tim'), tn('drain', 'xả kết nối trước khi tắt'), tn('TURN', 'máy chủ chuyển tiếp media')], kn: ['scaling WebSockets', 'NAT traversal'],
});

export default doiDau({ slug: 'netdev-9-5-lab-realtime-labflow', ten: 'Lab 9 — Practice: WebSocket handshake, backoff and realtime choices', khoa: KHOA, baiHoc: 'netdev-9-5-lab-realtime-labflow', de: [E1, E2, E3, E4] });
