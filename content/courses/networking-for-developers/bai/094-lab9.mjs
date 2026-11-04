/**
 * Chương 9 · Lab 9 — Dựng tầng thời gian thực của LabFlow (phần 9 dự án xuyên khoá).
 * Lời giải dùng output thật: lab/out/c91-*, c92-*, c93-*, c94-*.out.txt (STUN chạy thật, IP che; TURN mô tả).
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-9.mjs';

const L = card;
const PHIEU = `# Lab 9 report — <your name>, <date>

## R1 Push techniques — technique per feature (notifications / build log / board) + evidence (dup polls, held long-poll, SSE stream + no-buffering)
## R2 WebSocket     — 101 + Sec-WebSocket-Accept (RFC sample); text echo; ping→pong
## R3 Scaling       — ulimit -n; ESTABLISHED connection count; backoff+jitter; graceful-deploy plan
## R4 WebRTC        — STUN public mapping (port changed by NAT); STUN/ICE/TURN + signalling (your job)`;

export default {
  title: 'Lab 9 — Wiring LabFlow’s real-time features: choose, read, scale and trace|||Lab 9 — Dựng tầng thời gian thực của LabFlow: chọn, đọc, mở rộng và truy vết',
  slug: 'netdev-9-5-lab-realtime-labflow',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab 9 · Course project part 9</span>
<h2>Lab 9 — Wiring LabFlow’s real-time features</h2>
<p class="lead">LabFlow is adding four live features at once — a notifications feed, a build-log viewer, a collaborative board, and a video call — and each needs the right technique, the right sizing, and a plan for reconnects and NAT. This lab makes you choose a technique per feature and prove it on the wire, read a real WebSocket down to the handshake and frames, size a service by its open connections, and trace the public NAT mapping a call depends on. Everything is in Chapter 9.</p>

<h3>What you get</h3>
<ul>
<li>A real-time server (<code>10.10.2.20:5100</code>) with <code>/poll</code>, <code>/longpoll</code>, <code>/sse</code> on one ticking counter.</li>
<li>A hand-written WebSocket server (<code>:5200</code>) that does the RFC 6455 handshake and echoes frames.</li>
<li>A real <code>STUN</code> query (run from the <code>internet</code> machine) that returns your public NAT mapping.</li>
<li><code>bash lab/code/dung-output-ch9.sh</code> brings it all up.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Push techniques.</strong> Show polling's duplicate answers, a held long-poll (read <code>time_total</code>), and an SSE event stream plus its <code>X-Accel-Buffering: no</code> header. Choose a technique for notifications, the build log and the board.</li>
<li><strong>R2 WebSocket.</strong> Show the <code>101</code> upgrade with the RFC sample <code>Sec-WebSocket-Accept</code>, and a frame exchange (text echo, ping→pong).</li>
<li><strong>R3 Scaling.</strong> Show <code>ulimit -n</code>, a count of <code>ESTABLISHED</code> connections, and a backoff+jitter schedule. Write a graceful-deploy plan.</li>
<li><strong>R4 WebRTC.</strong> Show a STUN request returning your public mapping (IP redacted); explain STUN, ICE, TURN and whose job signalling is.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>3</td><td>duplicate polls, held long-poll, SSE stream + <code>X-Accel-Buffering: no</code>; a technique per feature</td></tr>
<tr><td>R2</td><td>3</td><td><code>101</code> with the RFC sample accept; text echo and ping→pong frames</td></tr>
<tr><td>R3</td><td>2</td><td>fd limit, <code>ESTABLISHED</code> count, backoff+jitter; graceful-deploy plan</td></tr>
<tr><td>R4</td><td>2</td><td>STUN public mapping shown; STUN/ICE/TURN + signalling explained</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: <code>/poll</code> three times; <code>/longpoll?since=999</code> with <code>-w %{time_total}</code>; <code>curl -N /sse</code> and <code>curl -sD - /sse</code>.</li>
<li>R2: the sample key <code>dGhlIHNhbXBsZSBub25jZQ==</code> must yield <code>s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code>; then <code>node ch09/ws-client.mjs</code>.</li>
<li>R3: <code>ulimit -n</code>; open 5 SSE and <code>ss -tan state established | grep -c :5100</code>; <code>node ch09/backoff.mjs</code>.</li>
<li>R4: <code>./chay.sh internet ch09/c94-stun.sh</code> (needs UDP egress to the internet).</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — polling returns duplicate answers (the counter barely moves), a long-poll <em>waits</em> for the next change (see <code>time_total</code>), and SSE streams <code>data:</code> events over one connection with the all-important <code>X-Accel-Buffering: no</code>:</p>
${run('c91-poll', 'for i', 1)}
${run('c91-sse', 'curl -N', 1, { max: 12 })}
${run('c91-sse', 'curl -s -D', 1)}
<p>All three features are one-way (server→client), so <strong>SSE</strong> fits notifications and the build log; the <strong>board</strong> is the only genuinely two-way one, so it wants a <strong>WebSocket</strong>.</p>
<p><strong>R2</strong> — the WebSocket upgrade returns <code>101</code> with the RFC's own sample accept, and the raw client exchanges frames:</p>
${run('c92-ws', 'curl', 1, { max: 6 })}
${run('c92-ws', 'node', 1)}
<p><strong>R3</strong> — each open connection is a file descriptor; five SSE clients are five <code>ESTABLISHED</code> sockets; reconnect on exponential backoff with jitter:</p>
${run('c93-scale', 'ulimit', 1)}
${run('c93-scale', 'ss -tan', 1)}
${run('c93-scale', 'node', 1)}
<p>Graceful deploy: <strong>drain</strong> (stop new, finish in-flight) → <strong>roll</strong> instances one at a time → clients <strong>reconnect</strong> with backoff, resuming from Redis-held state — a brief reconnect, not an outage.</p>
<p><strong>R4</strong> — a STUN request returns your public mapping; the public port differs from the local one because the NAT is translating:</p>
${run('c94-stun', 'python3', 1)}
<p>STUN finds the public mapping, ICE tries candidates until one connects, TURN relays when no direct path works (symmetric NAT), and <strong>signalling</strong> — exchanging the SDP and candidates, usually over a WebSocket — is the part you build. The video call is WebRTC; your part is the signalling server.</p>

<h3>Going further</h3>
<ul>
<li>Put nginx in front of the SSE endpoint <em>with</em> buffering on and watch the stream freeze; then disable buffering and watch it flow.</li>
<li>Add an app-level ping to the WebSocket client and confirm the connection survives past a 60-second idle proxy timeout.</li>
<li><strong>Course project:</strong> the real-time layer returns in the Chapter 13 capstone — keep your technique-per-feature table and your graceful-deploy plan.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab 9 · Dự án xuyên khoá phần 9</span>
<h2>Lab 9 — Dựng tầng thời gian thực của LabFlow</h2>
<p class="lead">LabFlow đang thêm bốn tính năng trực tiếp cùng lúc — một feed thông báo, một trình xem build-log, một bảng cộng tác, và một cuộc gọi video — và mỗi cái cần kỹ thuật đúng, kích cỡ đúng, và một kế hoạch cho nối lại cùng NAT. Lab này bắt bạn chọn một kỹ thuật cho mỗi tính năng và chứng minh trên dây, đọc một WebSocket thật tới tận cú bắt tay và frame, đo một dịch vụ theo kết nối mở của nó, và truy ánh xạ NAT công cộng một cuộc gọi phụ thuộc. Mọi thứ đều có trong Chương 9.</p>

<h3>Bạn được gì</h3>
<ul>
<li>Một máy chủ thời gian thực (<code>10.10.2.20:5100</code>) với <code>/poll</code>, <code>/longpoll</code>, <code>/sse</code> trên một bộ đếm nhích.</li>
<li>Một máy chủ WebSocket viết tay (<code>:5200</code>) làm cú bắt tay RFC 6455 và echo frame.</li>
<li>Một truy vấn <code>STUN</code> thật (chạy từ máy <code>internet</code>) trả ánh xạ NAT công cộng của bạn.</li>
<li><code>bash lab/code/dung-output-ch9.sh</code> dựng tất cả.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Kỹ thuật đẩy.</strong> Cho thấy câu trả lời trùng của polling, một long-poll bị giữ (đọc <code>time_total</code>), và một dòng sự kiện SSE cùng header <code>X-Accel-Buffering: no</code>. Chọn một kỹ thuật cho thông báo, build log và bảng.</li>
<li><strong>R2 WebSocket.</strong> Cho thấy cú nâng <code>101</code> với <code>Sec-WebSocket-Accept</code> mẫu của RFC, và một trao đổi frame (echo text, ping→pong).</li>
<li><strong>R3 Mở rộng.</strong> Cho thấy <code>ulimit -n</code>, một đếm kết nối <code>ESTABLISHED</code>, và một lịch backoff+nhiễu. Viết một kế hoạch deploy êm.</li>
<li><strong>R4 WebRTC.</strong> Cho thấy một yêu cầu STUN trả ánh xạ công cộng của bạn (IP che); giải thích STUN, ICE, TURN và signalling là việc của ai.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>3</td><td>poll trùng, long-poll bị giữ, dòng SSE + <code>X-Accel-Buffering: no</code>; một kỹ thuật mỗi tính năng</td></tr>
<tr><td>R2</td><td>3</td><td><code>101</code> với accept mẫu của RFC; frame echo text và ping→pong</td></tr>
<tr><td>R3</td><td>2</td><td>trần fd, đếm <code>ESTABLISHED</code>, backoff+nhiễu; kế hoạch deploy êm</td></tr>
<tr><td>R4</td><td>2</td><td>ánh xạ công cộng STUN hiện; STUN/ICE/TURN + signalling giải thích</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: <code>/poll</code> ba lần; <code>/longpoll?since=999</code> với <code>-w %{time_total}</code>; <code>curl -N /sse</code> và <code>curl -sD - /sse</code>.</li>
<li>R2: khoá mẫu <code>dGhlIHNhbXBsZSBub25jZQ==</code> phải cho ra <code>s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code>; rồi <code>node ch09/ws-client.mjs</code>.</li>
<li>R3: <code>ulimit -n</code>; mở 5 SSE và <code>ss -tan state established | grep -c :5100</code>; <code>node ch09/backoff.mjs</code>.</li>
<li>R4: <code>./chay.sh internet ch09/c94-stun.sh</code> (cần UDP ra internet).</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — polling trả câu trả lời trùng (bộ đếm hầu như không nhích), một long-poll <em>chờ</em> thay đổi kế (xem <code>time_total</code>), và SSE đẩy sự kiện <code>data:</code> trên một kết nối với <code>X-Accel-Buffering: no</code> tối quan trọng:</p>
${run('c91-poll', 'for i', 1)}
${run('c91-sse', 'curl -N', 1, { max: 12 })}
${run('c91-sse', 'curl -s -D', 1)}
<p>Cả ba tính năng là một chiều (máy-chủ→client), nên <strong>SSE</strong> hợp thông báo và build log; <strong>bảng</strong> là cái hai-chiều thật duy nhất, nên nó muốn một <strong>WebSocket</strong>.</p>
<p><strong>R2</strong> — cú nâng WebSocket trả <code>101</code> với accept mẫu của chính RFC, và client thô trao đổi frame:</p>
${run('c92-ws', 'curl', 1, { max: 6 })}
${run('c92-ws', 'node', 1)}
<p><strong>R3</strong> — mỗi kết nối mở là một file descriptor; năm client SSE là năm socket <code>ESTABLISHED</code>; nối lại theo lùi dần cấp số nhân có nhiễu:</p>
${run('c93-scale', 'ulimit', 1)}
${run('c93-scale', 'ss -tan', 1)}
${run('c93-scale', 'node', 1)}
<p>Deploy êm: <strong>drain</strong> (ngừng mới, xong việc đang bay) → <strong>cuốn</strong> thực thể lần lượt → client <strong>nối lại</strong> với backoff, tiếp từ trạng thái giữ trong Redis — một lần nối lại ngắn, không phải một sự cố.</p>
<p><strong>R4</strong> — một yêu cầu STUN trả ánh xạ công cộng của bạn; cổng công cộng khác cổng cục bộ vì NAT đang dịch:</p>
${run('c94-stun', 'python3', 1)}
<p>STUN tìm ánh xạ công cộng, ICE thử ứng viên tới khi một cái nối, TURN chuyển tiếp khi không đường trực tiếp nào chạy (NAT đối xứng), và <strong>signalling</strong> — trao đổi SDP và ứng viên, thường qua một WebSocket — là phần bạn dựng. Cuộc gọi video là WebRTC; phần của bạn là máy chủ signalling.</p>

<h3>Đi xa hơn</h3>
<ul>
<li>Đặt nginx trước điểm cuối SSE <em>với</em> đệm bật và nhìn dòng đóng băng; rồi tắt đệm và nhìn nó chảy.</li>
<li>Thêm một ping mức-app vào client WebSocket và xác nhận kết nối sống qua một idle timeout proxy 60 giây.</li>
<li><strong>Dự án xuyên khoá:</strong> tầng thời gian thực quay lại trong dự án Chương 13 — giữ bảng kỹ-thuật-mỗi-tính-năng và kế hoạch deploy êm của bạn.</li>
</ul>
</div>
`,
};
