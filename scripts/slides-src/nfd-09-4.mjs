/**
 * nfd-09-4 — Networking for Developers, bài 9.4 "Lướt qua WebRTC: xuyên NAT bằng STUN và TURN" (slug netdev-9-4-webrtc).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c94-stun.out.txt) — một yêu cầu STUN lấy ánh xạ NAT công cộng (IP che).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-09-4', code: 'NFD 9.4', title: 'WebRTC at a glance', sub: 'Networking for Developers · Chapter 9' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 9 — Real-time connections', bai: '9.4' }, [
  { cover: true, t: 'WebRTC at a glance', sub: 'NAT traversal with STUN and TURN —<br>how a video call connects two peers behind NAT', nhan: 'Chapter 9 · Lesson 9.4' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>The problem</b>: two peers, each behind NAT, with no public address to dial</li>
<li><b>STUN</b>: a tiny request that reveals your <b>public</b> ip:port mapping</li>
<li><b>ICE</b>: gather candidate addresses and try them until one connects</li>
<li><b>TURN</b>: a relay for when direct peer-to-peer is impossible</li>
<li><b>Signalling</b>: how the two peers exchange offers — and why that is <b>your</b> job, not WebRTC’s</li>
</ul>` },

  { t: 'The problem: both peers behind NAT', giua: true, body: `
${box('', 'A browser on home Wi-Fi has a <b>private</b> IP (you met NAT in the addressing chapter). Two browsers that want to send video directly to each other both sit behind NAT — neither has a public address the other can dial. WebRTC is the machinery that gets a <b>peer-to-peer</b> media stream through that, falling back to a relay only when it must.', 'lam')}
${steps([
    '<b>Direct P2P</b> is the goal — lowest latency, no server in the media path',
    'But NAT hides each peer; someone must discover the public mappings',
    'And when NAT is too strict, the media must be <b>relayed</b> through a server',
  ])}` },

  { t: 'STUN: what is my public address?', body: `
${term(ra('c94-stun', 'python3', 1), { sm: true, title: 'a STUN Binding request returns your public ip:port (IP redacted)' })}
${box('', 'A <b>STUN</b> server answers one question: "from the outside, what ip:port do I see you as?" The reply’s <code class="i">XOR-MAPPED-ADDRESS</code> is your <b>public mapping</b> — note the public <b>port</b> differs from the local one: that is the NAT translating. One small UDP round trip, and now a peer knows an address to advertise.', 'xanh')}` },

  { t: 'ICE: gather and try candidates', giua: true, body: `
${steps([
    'Each peer gathers <b>candidates</b>: its local address, its STUN-discovered public mapping, and (if needed) a TURN relay',
    'The peers exchange candidate lists and <b>try them in order</b> of preference',
    'The first pair that can actually send packets to each other <b>wins</b> — usually direct, sometimes relayed',
  ])}
${box('', '<b>ICE</b> (Interactive Connectivity Establishment) is the trial-and-error that finds a working path between two NATed peers. STUN provides the public-mapping candidate; ICE is the process that tests every candidate and picks one.', 'lam')}` },

  { t: 'TURN: relay when direct fails', giua: true, body: `
${box('Key idea', 'Some NATs (symmetric) assign a <b>different</b> public port per destination, so the mapping STUN found is useless to a third party. When no direct path works, the media must flow through a <b>TURN</b> server that relays packets between the two peers.', 'do2')}
${steps([
    'TURN is a fallback: it costs bandwidth and adds a hop, so it is used only when ICE finds nothing direct',
    'In practice a meaningful share of calls (behind strict corporate NAT/firewalls) need TURN',
    'Our lab has no TURN server, so the relay path is described, not run (STUN above is real)',
  ])}` },

  { t: 'Signalling is your job, not WebRTC’s', giua: true, body: `
${box('', 'WebRTC does <b>not</b> define how the two peers first find each other and exchange their offer/answer (the <b>SDP</b>) and ICE candidates. That exchange — <b>signalling</b> — is up to you, and it almost always rides a channel you already have: a WebSocket (or socket.io). WebRTC carries the <b>media</b>; your signalling channel carries the <b>setup</b>.', 'lam')}
${bang(['Carried by WebRTC', 'Carried by you (signalling)'], [
    ['the audio/video/data stream', 'the SDP offer and answer'],
    ['the P2P or TURN-relayed path', 'the ICE candidates, exchanged via WebSocket'],
  ], { fs: 19 })}` },

  { t: 'Where you meet WebRTC', giua: true, body: `
${box('', 'You meet WebRTC any time a web app does a live audio/video call with no plugin — a meeting app, a support call, a peer-to-peer file transfer, a cloud-game stream. As a developer you rarely touch STUN/ICE directly; the browser’s <code class="i">RTCPeerConnection</code> does.', 'lam')}
${steps([
    'Your real work: the <b>signalling server</b> that passes offers and candidates between peers (a WebSocket)',
    'And deciding whether to <b>run or rent a TURN server</b> for the calls that cannot go direct',
    'The media, codecs and NAT traversal are handled for you — the networking is the setup, not the stream',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Two peers behind NAT have no public address to dial — WebRTC gets a <b>P2P media stream</b> through, relaying only if it must</li>
<li><b>STUN</b> reveals your <b>public ip:port mapping</b> (the port differs from local = NAT translating) — measured for real</li>
<li><b>ICE</b> gathers candidate addresses and tries them until one connects — usually direct</li>
<li><b>TURN</b> relays the media when no direct path works (strict/symmetric NAT)</li>
<li><b>Signalling</b> (exchanging SDP + candidates) is <b>your</b> job — usually over a WebSocket</li>
</ul>
<p style="margin:0">${kw('NAT traversal', 'xuyên NAT')} ${kw('STUN', 'tìm ánh xạ công cộng')} ${kw('ICE', 'thử ứng viên')} ${kw('TURN', 'chuyển tiếp')} ${kw('signalling', 'trao đổi SDP')}</p>` },
]);
