/**
 * nfd-lab-9 — Networking for Developers, Lab 9 "Dựng tầng thời gian thực của LabFlow" (slug netdev-9-5-lab-realtime-labflow).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c91..c94-*.out.txt).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-9', code: 'NFD LAB 9', title: 'Wiring LabFlow’s real-time features', sub: 'Networking for Developers · Chapter 9' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 9 — Real-time connections', bai: 'Lab 9' }, [
  { cover: true, t: 'Lab 9 — Wiring LabFlow’s real-time features', sub: 'Pick a technique per feature, read a WebSocket,<br>size the connections, and trace a NAT mapping', nhan: 'Chapter 9 · Lab 9 · Course project part 9' },

  { t: 'The situation', giua: true, body: `
${box('', 'LabFlow is adding four live features: a notifications feed, a build-log viewer, a collaborative board, and a video call. Each needs the right real-time technique, and the team needs to size the servers and plan for reconnects and NAT. Prove each choice on the wire — do not guess.', 'lam')}
${steps([
    'Choose polling / SSE / WebSocket per feature, by cost',
    'Read a real WebSocket handshake and frames; size connections by fd',
    'Show the public NAT mapping that a video call needs (STUN)',
  ])}` },

  { t: 'The system', giua: true, body: `
${bang(['Piece', 'Address', 'Role'], [
    ['rt-srv', '10.10.2.20:5100', '/poll, /longpoll, /sse on one ticking counter'],
    ['ws-srv', '10.10.2.20:5200', 'raw RFC 6455 WebSocket (handshake + frames)'],
    ['STUN', 'stun.l.google.com:19302', 'public NAT mapping (run from the "internet" machine)'],
  ], { fs: 19 })}
${box('', 'Bring it up with <code class="i">bash lab/code/dung-output-ch9.sh</code>. A tiny real-time server, a hand-written WebSocket server, and a real STUN query — enough to feel every technique in the chapter.', 'lam')}` },

  { t: 'Requirements', giua: true, body: `
${steps([
    '<b>R1 Push techniques</b>: show polling’s duplicates, a held long-poll (time_total), and an SSE event stream + its no-buffering header',
    '<b>R2 WebSocket</b>: the 101 upgrade with the RFC sample accept, and a frame exchange (text echo, ping→pong)',
    '<b>R3 Scaling</b>: the fd limit, a count of ESTABLISHED connections, and a backoff+jitter schedule',
    '<b>R4 WebRTC</b>: a STUN request returning your public mapping; explain STUN/ICE/TURN and signalling',
  ])}` },

  { t: 'Report template', giua: true, body: `
${steps([
    '<b>R1</b> — the technique chosen for notifications / build log / board, with the evidence (duplicate polls, held long-poll, SSE stream)',
    '<b>R2</b> — the 101 + <code class="i">Sec-WebSocket-Accept</code>, and the text/ping/pong frames',
    '<b>R3</b> — <code class="i">ulimit -n</code>, the connection count, the backoff table, and the graceful-deploy plan',
    '<b>R4</b> — the STUN mapping (port changed by NAT), and who does STUN/ICE/TURN vs signalling',
  ])}
${box('', 'Paste the line that proves each claim — a repeated <code class="i">n</code>, a 101, an X-Cache-free SSE header, a public mapping — not a description of it.', 'lam')}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '3', 'duplicate polls, held long-poll, SSE stream + X-Accel-Buffering: no'],
    ['R2', '3', '101 with the RFC sample accept; text echo and ping→pong frames'],
    ['R3', '2', 'fd limit, ESTABLISHED count, backoff+jitter; graceful-deploy plan'],
    ['R4', '2', 'STUN public mapping shown; STUN/ICE/TURN + signalling explained'],
  ], { fs: 18 })}
${box('', 'Full marks is reading the <b>evidence</b> and <b>choosing</b> correctly — most features here are one-way (SSE), only the board is truly two-way (WebSocket), and the video call is WebRTC with your signalling.', 'lam')}` },

  { t: 'Hints', giua: true, body: `
${steps([
    'R1: <code class="i">/poll</code> three times; <code class="i">/longpoll?since=999</code> with <code class="i">-w %{time_total}</code>; <code class="i">curl -N /sse</code> and <code class="i">curl -D - /sse</code>',
    'R2: the sample key <code class="i">dGhlIHNhbXBsZSBub25jZQ==</code> must yield <code class="i">s3pPLM…</code>; then <code class="i">node ch09/ws-client.mjs</code>',
    'R3: <code class="i">ulimit -n</code>; open 5 SSE and <code class="i">ss -tan state established | grep -c :5100</code>; <code class="i">node ch09/backoff.mjs</code>',
    'R4: <code class="i">./chay.sh internet ch09/c94-stun.sh</code> (needs UDP to the internet)',
  ])}` },

  { t: 'Solution — the four checks', body: `
${term(ra('c91-sse', 'curl -N', 1, { max: 7 }), { sm: true, title: 'R1 — SSE: one connection, many data: events' })}
${term(ra('c92-ws', 'curl', 1, { max: 5 }), { sm: true, title: 'R2 — 101 + the RFC sample Sec-WebSocket-Accept' })}
${term(ra('c93-scale', 'ss -tan', 1), { sm: true, title: 'R3 — five live connections = five fds' })}
${term(ra('c94-stun', 'python3', 1, { max: 4 }), { sm: true, title: 'R4 — STUN public mapping (IP redacted); port changed by NAT' })}` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can <b>choose</b> polling / SSE / WebSocket per feature and justify it from the wire</li>
<li>You can read a <b>WebSocket</b>: the 101, the deterministic accept, and the frames</li>
<li>You can <b>size</b> a real-time service by concurrent connections and plan reconnect + deploy</li>
<li>You can explain a <b>video call</b>: STUN’s public mapping (measured), ICE, TURN, and your signalling</li>
</ul>
<p style="margin:0">${kw('SSE', 'máy chủ đẩy')} ${kw('101 + frames', 'WebSocket')} ${kw('fd / backoff', 'mở rộng')} ${kw('STUN', 'xuyên NAT')}</p>` },
]);
