/**
 * nwc204-ch14.mjs — NWC204 Chapter 14: Application Layer
 * (FLM buổi 45 + 46, Cisco Module 15).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 45, 46.
 *   buổi 45: 14. Application Layer · 14.1 Application, Presentation, and Session
 *            · 14.2 Peer-to-Peer
 *   buổi 46: 14.3 Web and Email Protocols · 14.4 IP Addressing Services
 *            · 14.5 File Sharing Services
 *            · 14.6 Integrate AI Tools for Explaining Concepts (Self Learning)
 *   LO cả hai buổi: CLO1, CLO4, CLO9 · ITU: T · tài liệu "Module 15: Application Layer".
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 15, ĐO THẬT ngày 22/09/2026 từ
 *     máy của người học, đối với hạ tầng của chính họ (cuongthai.com) và các
 *     máy chủ công cộng:
 *   - curl -v: ALPN chào h2 + http/1.1, máy chủ chọn h2; TLS 1.3
 *     AEAD-CHACHA20-POLY1305-SHA256; chứng chỉ Let's Encrypt CN=YE1 hiệu lực
 *     08/09/2026 → 07/12/2026; HTTP/2 thay Host bằng giả-tiêu-đề :authority
 *   - một IP 198.51.100.208 phục vụ BA server_name; đổi tiêu đề Host là đổi trang
 *   - dig +trace qua 1.1.1.1: root → i.gtld-servers.net → kyrie.ns.cloudflare.com
 *     → A 198.51.100.208, TTL gốc 300 mà bản đệm còn 50
 *   - dig +trace qua bộ phân giải nhà (192.168.1.1) CHẾT ở bước đầu: nhận 17 byte
 *   - SMTP 587 của Gmail: banner 220, EHLO trả SIZE / STARTTLS / PIPELINING /
 *     CHUNKING / SMTPUTF8, và nó đọc ra ĐỊA CHỈ CÔNG KHAI của người gọi
 *   - IMAP 993 (TLS): "* OK Gimap ready for requests from <ip>"
 *   - ipconfig getpacket en0: DHCP ACK thật, yiaddr 192.168.1.101,
 *     server_identifier 192.168.1.1, lease_time 0x1c20 = 7200 giây = 2 giờ
 *   - media.cuongthai.com trả cache-control public, max-age=31536000, immutable
 *     còn cuongthai.com trả no-cache, no-store, must-revalidate
 *
 * ⚠️ Bất thường của bảng gốc, NÊU trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 45 mang CQ15.3 "How does TCP session establishment and termination
 *     processes facilitate reliable communication?" → đó là CHƯƠNG 13 (buổi
 *     41–42), không phải tầng ứng dụng. Độ trôi ~1 chương từ buổi 19.
 *   - Buổi 46 mang CQ16.1 "What is the functions of the Application Layer to
 *     provide network services to end users?" → KHỚP ĐÚNG chương này.
 *
 * ⚠️ SVG: viewBox="0 0 900 h" width="1150". Chữ đơn cách rộng 0,602 × font-size
 *    ⇒ font 15 tối đa ~99 ký tự/dòng từ x=4. Chữ trong <rect> phải NGẮN HƠN rect,
 *    và <rect> đánh dấu phải đặt bằng CÔNG THỨC chứ không bằng mắt.
 *
 * 26 slide (1 bìa + 25 nội dung); 19 trong số đó là SVG, sơ đồ, bảng, terminal hoặc
 * khối mã — 73%, trên ngưỡng 60% mà hợp đồng đòi.
 * Bài 14.1 = buổi 45 = slide 1–10 · bài 14.2 = buổi 46 = slide 11–26.
 */
import { CSS, stack, flow, term, kv, code } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch14',
  code: 'NWC204',
  title: 'Ch.14 — Application Layer',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: anatomy of one HTTP exchange ─────────────────────────────────── */
const HTTPMSG = `<svg class="nw-svg" viewBox="0 0 900 286" width="1150" height="365"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="14" fill="#0f2a4a" font-size="15" font-weight="700">An HTTP message is plain text lines, then one blank line, then the body.</text>
  <rect x="16" y="26" width="510" height="112" rx="8" fill="#f7fbff" stroke="#1b5fa8" stroke-width="2.5"/>
  <text x="28" y="50" font-size="15" fill="#123a63">GET /academy HTTP/1.1</text>
  <text x="28" y="70" font-size="15" fill="#123a63">Host: cuongthai.com</text>
  <text x="28" y="90" font-size="15" fill="#123a63">User-Agent: curl/8.7.1</text>
  <text x="28" y="110" font-size="15" fill="#123a63">Accept: */*</text>
  <text x="28" y="130" font-size="14" fill="#8aa0b6">(blank line)</text>
  <g font-size="13" fill="#3c5570">
    <text x="556" y="50">method &#183; path &#183; version</text>
    <text x="556" y="70" fill="#b4690e" font-weight="700">WHICH site on this IP &#8212; required in 1.1</text>
    <text x="556" y="90">who is asking</text>
    <text x="556" y="110">what formats the client can read</text>
    <text x="556" y="130">the header block ends here</text>
  </g>
  <rect x="16" y="150" width="510" height="112" rx="8" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <text x="28" y="174" font-size="15" fill="#14603f">HTTP/2 200</text>
  <text x="28" y="194" font-size="15" fill="#14603f">server: nginx/1.27.5</text>
  <text x="28" y="214" font-size="15" fill="#14603f">content-type: text/html; charset=utf-8</text>
  <text x="28" y="234" font-size="15" fill="#14603f">cache-control: no-store</text>
  <text x="28" y="254" font-size="14" fill="#5d7288">&lt;!doctype html&gt; ...</text>
  <g font-size="13" fill="#3c5570">
    <text x="556" y="174">version &#183; status code</text>
    <text x="556" y="194">a claim by the server, not proof</text>
    <text x="556" y="214">how to interpret the body</text>
    <text x="556" y="234" fill="#8f2c2c" font-weight="700">&#9733; measured on cuongthai.com</text>
    <text x="556" y="254">the body itself</text>
  </g>
  <text x="4" y="280" fill="#1b5fa8" font-size="14" font-weight="700">Nothing here is binary or secret. Everything you debug at layer 7 is readable text.</text>
</svg>`;

/* ── SVG: HTTP/1.1 keep-alive vs HTTP/2 multiplexing ───────────────────── */
const H1H2 = `<svg class="nw-svg" viewBox="0 0 900 292" width="1150" height="373"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="14" fill="#0f2a4a" font-size="15" font-weight="700">&#9733; Same TCP connection, two ways of using it.</text>
  <text x="4" y="40" fill="#8f2c2c" font-size="14" font-weight="700">HTTP/1.1 keep-alive &#8212; the connection is reused, one request at a time</text>
  <g stroke="#d94b4b" stroke-width="2.5" fill="#fdeeee">
    <rect x="20" y="52" width="150" height="30" rx="5"/>
    <rect x="190" y="52" width="210" height="30" rx="5"/>
    <rect x="420" y="52" width="130" height="30" rx="5"/>
    <rect x="570" y="52" width="290" height="30" rx="5"/>
  </g>
  <g font-size="12" fill="#8f2c2c" text-anchor="middle" font-weight="700">
    <text x="95" y="72">GET /page</text>
    <text x="295" y="72">GET /app.css &#8212; waits</text>
    <text x="485" y="72">GET /logo.svg</text>
    <text x="715" y="72">GET /hero.jpg &#8212; blocks the rest</text>
  </g>
  <text x="4" y="102" fill="#8f2c2c" font-size="13">One slow response holds the line. This is head-of-line blocking, and it is why</text>
  <text x="4" y="120" fill="#8f2c2c" font-size="13">browsers used to open six connections per host just to work around it.</text>
  <text x="4" y="150" fill="#14603f" font-size="14" font-weight="700">HTTP/2 multiplexing &#8212; many streams interleaved on ONE connection</text>
  <g stroke="#1f9d6b" stroke-width="2.5" fill="#eefaf4">
    <rect x="20" y="162" width="840" height="24" rx="5"/>
    <rect x="20" y="190" width="840" height="24" rx="5"/>
    <rect x="20" y="218" width="840" height="24" rx="5"/>
  </g>
  <g font-size="12" fill="#14603f" font-weight="700">
    <text x="32" y="179">stream 1 &#183; GET /page &#8212; frames arrive interleaved with the others</text>
    <text x="32" y="207">stream 3 &#183; GET /app.css &#8212; does not wait for stream 1 to finish</text>
    <text x="32" y="235">stream 5 &#183; GET /hero.jpg &#8212; slow, and it blocks nobody</text>
  </g>
  <text x="4" y="264" fill="#1b5fa8" font-size="14" font-weight="700">&#9733; Measured: curl offered h2 and http/1.1 by ALPN; cuongthai.com chose h2.</text>
  <text x="4" y="286" fill="#8f2c2c" font-size="14" font-weight="700">&#9733; HTTP/2 is binary: Host becomes the pseudo-header :authority. Same job, no readable line.</text>
</svg>`;

/* ── SVG: the DNS hierarchy and who answers what ───────────────────────── */
const DNSTREE = `<svg class="nw-svg" viewBox="0 0 900 276" width="1150" height="353"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="14" fill="#0f2a4a" font-size="15" font-weight="700">No single server knows every name. Each one only knows who to ask next.</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="40" y="30" width="180" height="42" rx="7" stroke="#1b5fa8"/>
    <rect x="40" y="94" width="180" height="42" rx="7" stroke="#5d7288"/>
    <rect x="40" y="158" width="180" height="42" rx="7" stroke="#5d7288"/>
    <rect x="40" y="222" width="180" height="42" rx="7" stroke="#1f9d6b"/>
  </g>
  <g font-size="14" font-weight="700" fill="#0f2a4a" text-anchor="middle">
    <text x="130" y="56">root &#8212; "."</text>
    <text x="130" y="120">TLD &#8212; ".com"</text>
    <text x="130" y="184">authoritative NS</text>
    <text x="130" y="248">the answer</text>
  </g>
  <g stroke="#8aa0b6" stroke-width="2" fill="none">
    <line x1="130" y1="72" x2="130" y2="94"/>
    <line x1="130" y1="136" x2="130" y2="158"/>
    <line x1="130" y1="200" x2="130" y2="222"/>
  </g>
  <g font-size="13" fill="#25405e">
    <text x="250" y="48">"I do not know cuongthai.com, but .com is handled by</text>
    <text x="250" y="66">a.gtld-servers.net and twelve siblings." &#8212; a REFERRAL</text>
    <text x="250" y="112">"I do not know the address either, but the nameservers</text>
    <text x="250" y="130">for cuongthai.com are kyrie and meilani.ns.cloudflare.com"</text>
    <text x="250" y="176">"I am authoritative for that zone. The A record is</text>
    <text x="250" y="194">198.51.100.208, and you may cache it for 300 seconds."</text>
    <text x="250" y="240" fill="#14603f" font-weight="700">&#9733; Three referrals, then one answer. Measured, 22/09/2026.</text>
  </g>
  <text x="4" y="272" fill="#1b5fa8" font-size="14" font-weight="700">Your resolver does this walk once, then serves the cached copy until the TTL runs out.</text>
</svg>`;

/* ── SVG: a BitTorrent swarm ───────────────────────────────────────────── */
const SWARM = `<svg class="nw-svg" viewBox="0 0 900 262" width="1150" height="335"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="14" fill="#0f2a4a" font-size="15" font-weight="700">In a P2P swarm every downloader is also an uploader, from the first piece on.</text>
  <text x="4" y="40" fill="#8f2c2c" font-size="14" font-weight="700">Client-server: one machine carries everyone. 100 clients = 100x the load.</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="20" y="52" width="120" height="36" rx="6" stroke="#d94b4b"/>
    <rect x="300" y="52" width="86" height="36" rx="6" stroke="#6b8199"/>
    <rect x="400" y="52" width="86" height="36" rx="6" stroke="#6b8199"/>
    <rect x="500" y="52" width="86" height="36" rx="6" stroke="#6b8199"/>
    <rect x="600" y="52" width="86" height="36" rx="6" stroke="#6b8199"/>
  </g>
  <g font-size="12" fill="#0f2a4a" text-anchor="middle" font-weight="700">
    <text x="80" y="75">server</text>
    <text x="343" y="75">client</text><text x="443" y="75">client</text>
    <text x="543" y="75">client</text><text x="643" y="75">client</text>
  </g>
  <g stroke="#d94b4b" stroke-width="2">
    <line x1="140" y1="70" x2="298" y2="70"/><line x1="140" y1="70" x2="398" y2="62"/>
    <line x1="140" y1="70" x2="498" y2="78"/><line x1="140" y1="70" x2="598" y2="66"/>
  </g>
  <text x="700" y="74" font-size="13" fill="#8f2c2c" font-weight="700">all traffic, one throat</text>
  <text x="4" y="118" fill="#14603f" font-size="14" font-weight="700">P2P swarm: each peer serves the pieces it already holds.</text>
  <g stroke-width="2.5" fill="#eefaf4">
    <rect x="60" y="132" width="96" height="34" rx="6" stroke="#1f9d6b"/>
    <rect x="260" y="132" width="96" height="34" rx="6" stroke="#1f9d6b"/>
    <rect x="460" y="132" width="96" height="34" rx="6" stroke="#1f9d6b"/>
    <rect x="660" y="132" width="96" height="34" rx="6" stroke="#1f9d6b"/>
    <rect x="160" y="198" width="96" height="34" rx="6" stroke="#1f9d6b"/>
    <rect x="360" y="198" width="96" height="34" rx="6" stroke="#1f9d6b"/>
    <rect x="560" y="198" width="96" height="34" rx="6" stroke="#1f9d6b"/>
  </g>
  <g font-size="12" fill="#14603f" text-anchor="middle" font-weight="700">
    <text x="108" y="154">peer 1</text><text x="308" y="154">peer 2</text>
    <text x="508" y="154">peer 3</text><text x="708" y="154">peer 4</text>
    <text x="208" y="220">peer 5</text><text x="408" y="220">peer 6</text><text x="608" y="220">peer 7</text>
  </g>
  <g stroke="#1f9d6b" stroke-width="2">
    <line x1="156" y1="149" x2="258" y2="149"/><line x1="356" y1="149" x2="458" y2="149"/>
    <line x1="556" y1="149" x2="658" y2="149"/>
    <line x1="120" y1="166" x2="196" y2="198"/><line x1="296" y1="166" x2="232" y2="198"/>
    <line x1="320" y1="166" x2="396" y2="198"/><line x1="496" y1="166" x2="432" y2="198"/>
    <line x1="520" y1="166" x2="596" y2="198"/><line x1="696" y1="166" x2="632" y2="198"/>
  </g>
  <text x="4" y="256" fill="#1b5fa8" font-size="14" font-weight="700">More downloaders means more uploaders. That inversion is the entire point of P2P.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'Application Layer',
    sub: 'Chapter 14 — Cisco Module 15',
    body: `<div class="cov-meta">Sessions 45–46 of 60 · CLO1, CLO4, CLO9 · Type T<br>
      14.1 Application, Presentation and Session · 14.2 Peer-to-Peer<br>
      14.3 Web and Email Protocols · 14.4 IP Addressing Services<br>
      14.5 File Sharing Services · 14.6 Integrate AI Tools (Self Learning)<br>
      ★ marks material added by cuongthai.com, measured on 22 Sep 2026</div>`,
  },

  /* ── 14.1 — session 45 ───────────────────────────────────────────────── */
  {
    t: 'Two sessions, and the outcome they serve',
    body: `${CSS}
      ${kv([
        ['Session 45', '14.1 Application, Presentation and Session · 14.2 Peer-to-Peer'],
        ['Session 46', '14.3 Web and Email · 14.4 IP Addressing Services · 14.5 File Sharing · 14.6 AI tools'],
        ['Outcome', '<b>CLO1</b> — "explain how layered protocols enable communication and <b>support end-user applications</b>"'],
        ['Also', '<b>CLO4</b> (how the layers interact) and <b>CLO9</b> (AI tools for analysis and troubleshooting)'],
        ['Material', 'Cisco <b>Module 15: Application Layer</b> · student task: "Read Module 15"'],
      ])}
      <div class="box">This is the <b>last protocol chapter of the course</b>. Everything before it moved bytes; this one is about what the bytes were for. It is also the chapter with the highest ratio of things you will type at a terminal this week to things you will be asked in an exam.</div>`,
  },

  {
    t: '14.1 Where the top three layers sit',
    body: `${CSS}
      ${stack([
        ['L7', 'Application', 'HTTP, DNS, DHCP, SMTP, IMAP, FTP', true],
        ['L6', 'Presentation', 'encoding, compression, encryption', true],
        ['L5', 'Session', 'start, maintain and close a dialogue', true],
        ['L4', 'Transport', 'TCP, UDP, port numbers — Chapter 13'],
        ['L3', 'Network', 'IP addressing and routing — Chapters 7 to 11'],
      ])}
      <div class="box warn">In the <b>TCP/IP model</b> these three OSI layers are one layer, also called Application. That is not a simplification for teaching — it is how the protocols are actually built. HTTP does its own encoding negotiation and its own connection management; there is no separate piece of software sitting at layer 6 or 5.</div>`,
  },

  {
    t: '14.1 What each of the three actually does',
    body: `${CSS}
      <table class="t"><thead><tr><th>Layer</th><th>Question it answers</th><th>Concrete example</th></tr></thead>
      <tbody>
        <tr><td class="hl">7 Application</td><td>What does this message MEAN?</td><td><span class="nw-m">GET /academy HTTP/1.1</span></td></tr>
        <tr><td class="hl">6 Presentation</td><td>In what FORM are the bytes?</td><td>UTF-8 · gzip · JPEG · TLS encryption</td></tr>
        <tr><td class="hl">5 Session</td><td>Is this exchange still OPEN?</td><td>keep-alive · a login cookie · an SSH session</td></tr>
      </tbody></table>
      ${kv([
        ['The useful test', 'ask "which of the three would break if I got this wrong?"'],
        ['Wrong charset', 'presentation — the text arrives, and is unreadable'],
        ['Session dropped', 'you are logged out, though the network is perfect'],
        ['Wrong method', 'application — the server understood you and said no'],
      ])}`,
  },

  {
    t: '★ All three layers in one command',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">curl -v https://cuongthai.com/academy</span>
* Connected to cuongthai.com (198.51.100.208) port 443     <span class="c"># L4 got us here</span>
* ALPN: curl offers h2,http/1.1
* SSL connection using <span class="g">TLSv1.3 / AEAD-CHACHA20-POLY1305</span>   <span class="c"># L6 encoding</span>
*  issuer: C=US; O=Let's Encrypt; CN=YE1
* ALPN: <span class="g">server accepted h2</span>                              <span class="c"># L5/L7 negotiated</span>
&gt; GET /academy HTTP/2                                   <span class="c"># L7 the request</span>
&gt; Host: cuongthai.com
&lt; <span class="g">HTTP/2 200</span>
&lt; server: nginx/1.27.5`, 'sm')}
      <div class="box ok">One command shows the whole stack above layer 4, in order. <b>Read it top to bottom and you can point at each layer.</b> Lines starting with <span class="nw-m">*</span> are curl talking to you, <span class="nw-m">&gt;</span> is what was sent, <span class="nw-m">&lt;</span> is what came back.</div>`,
  },

  {
    t: '14.1 The client-server model, stated precisely',
    body: `${CSS}
      ${flow('client', 'server', [
        ['r', 'request — names what it wants', 'the client always starts'],
        ['l', 'response — status + data', 'the server never speaks first'],
        ['r', 'next request on the same connection', 'if keep-alive is in effect'],
      ])}
      ${kv([
        ['Client', 'initiates. It must know the server’s address and port in advance.'],
        ['Server', 'listens, and waits. It is passive by definition.'],
        ['Why it scales badly', 'every byte crosses the server, so load grows with the number of clients'],
        ['Why it is used anyway', 'one place to secure, one place to update, one source of truth'],
      ])}`,
  },

  {
    t: '14.2 Two different things are both called "P2P"',
    body: `${CSS}
      <table class="t"><thead><tr><th></th><th>P2P network</th><th>P2P application</th></tr></thead>
      <tbody>
        <tr><td class="hl">What it is</td><td>hosts share resources directly, with no dedicated server</td><td>software where each instance is both client and server</td></tr>
        <tr><td class="hl">Example</td><td>two PCs sharing a printer over a home switch</td><td>BitTorrent, a voice call over WebRTC</td></tr>
        <tr><td class="hl">Needs a server?</td><td>no</td><td>often yes, but only to FIND the other peer</td></tr>
        <tr><td class="hl">Scale</td><td>a handful of machines before it becomes unmanageable</td><td>millions, because every joiner adds capacity</td></tr>
      </tbody></table>
      <div class="box warn">The exam distinction is the third row. A BitTorrent client uses a <b>tracker</b> (a server) to learn who else has the file, then transfers peer to peer. Using a server for <em>discovery</em> does not make the transfer client-server.</div>`,
  },

  { t: '14.2 Why a swarm gets faster as it grows', body: `${CSS}${SWARM}` },

  {
    t: '14.2 What P2P buys, and what it costs',
    body: `${CSS}
      <div class="two">
        <div class="box ok"><b>Buys</b><br><span class="note">No central cost. No single point of failure. Capacity rises with demand. Works with no infrastructure at all.</span></div>
        <div class="box warn"><b>Costs</b><br><span class="note">No single place to secure or audit. Every peer needs an inbound path, which NAT and firewalls fight. Content can be anything. Nobody guarantees availability.</span></div>
      </div>
      ${kv([
        ['Where you meet it', 'BitTorrent · WebRTC voice and video · blockchain gossip · Tailscale and WireGuard mesh'],
        ['Why NAT matters', 'a peer behind NAT has no reachable address, so peers need help connecting'],
        ['★ Same lesson as Chapter 9', 'NAT solved address exhaustion and broke the assumption that any host can be reached'],
      ])}`,
  },

  {
    t: '⚠ Session 45’s constructive question belongs to Chapter 13',
    body: `${CSS}
      ${kv([
        ['FLM lists for session 45', '<b>CQ15.3</b> — "How does TCP session establishment and termination processes facilitate reliable communication?"'],
        ['What session 45 teaches', '14.1 Application, Presentation and Session · 14.2 Peer-to-Peer'],
        ['Where that question lives', '<b>Chapter 13</b>, the Transport Layer — FLM sessions 41–42, Cisco Module 14'],
        ['Session 46 instead', '<b>CQ16.1</b> — "What is the functions of the Application Layer..." — which fits exactly'],
      ])}
      <div class="box warn">The constructive-question table drifts behind the session plan by roughly one chapter, and has done since session 19. <b>The table is quoted as published and is not corrected here.</b> Answer CQ15.3 from Chapter 13; it is about the three-way handshake and the four-way close, not about layer 7.</div>`,
  },

  /* ── 14.3 to 14.6 — session 46 ───────────────────────────────────────── */
  {
    t: 'Session 46 — four families of service, one session',
    body: `${CSS}
      ${kv([
        ['14.3 Web', 'HTTP and HTTPS — the protocol this site is served over'],
        ['14.3 Email', 'SMTP to send · POP3 or IMAP to read'],
        ['14.4 IP addressing services', '<b>DNS</b> (name to address) and <b>DHCP</b> (address to host)'],
        ['14.5 File sharing', 'FTP, SFTP and SMB'],
        ['14.6 AI tools', 'self-learning — use them to explain concepts, then verify'],
      ])}
      <div class="box">Every one of these is something you will run yourself. The rest of this deck shows each protocol and then the command that proves what it is doing — because a protocol you have only read about is a protocol you cannot debug at 2 a.m.</div>`,
  },

  { t: '14.3 Anatomy of one HTTP exchange', body: `${CSS}${HTTPMSG}` },

  {
    t: '14.3 Methods and status families worth memorising',
    body: `${CSS}
      <table class="t"><thead><tr><th>Method</th><th>Means</th><th>Status</th><th>Means</th></tr></thead>
      <tbody>
        <tr><td class="hl">GET</td><td>give me this, change nothing</td><td class="hl">2xx</td><td>it worked</td></tr>
        <tr><td class="hl">POST</td><td>here is data, do something</td><td class="hl">3xx</td><td>it is somewhere else</td></tr>
        <tr><td>PUT / PATCH</td><td>replace / amend this thing</td><td class="hl">4xx</td><td><b>you</b> got it wrong</td></tr>
        <tr><td>DELETE</td><td>remove this thing</td><td class="hl">5xx</td><td><b>the server</b> got it wrong</td></tr>
        <tr><td>HEAD</td><td>headers only, no body</td><td>404 vs 401</td><td>not mounted vs needs auth</td></tr>
      </tbody></table>
      <div class="box ok">★ The last row is a working diagnostic, not trivia. On an unauthenticated request, <b>401 means the route exists</b> and <b>404 means it does not</b> — which is how a stale deploy is spotted in seconds: <span class="nw-m">curl -s -o /dev/null -w "%{http_code}" https://api.cuongthai.com/api/v1/notes</span> returned <b>401</b> today, so that route is live.</div>`,
  },

  {
    t: '★ One IP, three sites — the Host header decides',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">dig +short cuongthai.com www.cuongthai.com api.cuongthai.com</span>
<span class="g">198.51.100.208</span>
<span class="g">198.51.100.208</span>       <span class="c"># the same machine answers for all three names</span>
<span class="g">198.51.100.208</span>

<span class="p">$</span> <span class="k">curl --resolve www.cuongthai.com:443:198.51.100.208 https://www.cuongthai.com/</span>
<span class="g">200</span>
<span class="p">$</span> <span class="k">curl --resolve api.cuongthai.com:443:198.51.100.208 .../api/v1/notes</span>
<span class="g">401</span>     <span class="c"># same IP, same port, different site — only the Host differs</span>`, 'sm')}
      <div class="box">nginx picks the <span class="nw-m">server</span> block by <b>server_name</b>, which it reads from the Host header. This is why a reverse proxy must pass <span class="nw-m">proxy_set_header Host $host;</span> — drop it and every request arrives looking like it was for the upstream’s own name.</div>`,
  },

  { t: '★ 14.3 HTTP/1.1 keep-alive vs HTTP/2 multiplexing', body: `${CSS}${H1H2}` },

  {
    t: '14.3 Email: three protocols, three different jobs',
    body: `${CSS}
      <table class="t"><thead><tr><th>Protocol</th><th>Job</th><th>Port</th><th>Leaves mail on server?</th></tr></thead>
      <tbody>
        <tr><td class="hl">SMTP</td><td><b>send</b>, and relay between servers</td><td>25 relay · <b>587</b> submit</td><td>n/a</td></tr>
        <tr><td class="hl">POP3</td><td>read — download then usually delete</td><td>110 · <b>995</b> TLS</td><td>no, by default</td></tr>
        <tr><td class="hl">IMAP</td><td>read — keep folders in sync</td><td>143 · <b>993</b> TLS</td><td>yes — this is the point</td></tr>
      </tbody></table>
      ${kv([
        ['Why 587 and not 25', 'port 25 is server-to-server relay. <b>587 is a user submitting mail</b>, and it requires authentication.'],
        ['★ Why you care', 'a network that permits only 80, 443, 587 and 993 still lets you send and read mail — by design'],
        ['MX record', 'DNS is what tells a sender which server accepts mail for a domain'],
      ])}`,
  },

  {
    t: '★ A real SMTP conversation, typed by hand',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">nc smtp.gmail.com 587</span>
<span class="g">220</span> smtp.gmail.com ESMTP 5a478bee46e88 - gsmtp     <span class="c"># server greets first</span>
<span class="k">EHLO test.example</span>
250-smtp.gmail.com at your service, [<span class="r">&lt;your public IP&gt;</span>]   <span class="c"># it tells you YOUR address</span>
250-SIZE 35882577
250-<span class="g">STARTTLS</span>                                      <span class="c"># upgrade to TLS from here</span>
250-PIPELINING
250 SMTPUTF8
<span class="k">QUIT</span>
<span class="g">221</span> 2.0.0 closing connection`, 'sm')}
      <div class="box ok">Measured on 22/09/2026. Three things worth taking: the server <b>speaks first</b> (unlike HTTP), every reply is a <b>three-digit code</b> in the same 2xx/4xx/5xx spirit as HTTP, and <span class="nw-m">EHLO</span> makes the server <b>list what it supports</b> — including whether it will accept mail at all.</div>`,
  },

  { t: '14.4 DNS — a walk down the hierarchy', body: `${CSS}${DNSTREE}` },

  {
    t: '14.4 The record types you will actually meet',
    body: `${CSS}
      <table class="t"><thead><tr><th>Type</th><th>Maps a name to</th><th>Measured on cuongthai.com</th></tr></thead>
      <tbody>
        <tr><td class="hl">A</td><td>an IPv4 address</td><td>198.51.100.208 · TTL 300</td></tr>
        <tr><td class="hl">AAAA</td><td>an IPv6 address</td><td>★ <b>none</b> — the site is IPv4 only today</td></tr>
        <tr><td class="hl">CNAME</td><td>another NAME, not an address</td><td>not used here; www is its own A record</td></tr>
        <tr><td class="hl">MX</td><td>a mail server, with a priority</td><td>10 cuongthai.com · 20 fwd2.porkbun.com</td></tr>
        <tr><td class="hl">NS</td><td>the authoritative nameservers</td><td>kyrie / meilani.ns.cloudflare.com</td></tr>
        <tr><td>TXT</td><td>free text — SPF, domain verification</td><td>★ <b>two</b> v=spf1 records — see the warning</td></tr>
      </tbody></table>
      <div class="box warn">★ <b>A domain must publish at most ONE SPF record</b> (RFC 7208 §3.2); two is a permanent error and receivers may fail the check. This one was found by reading real output rather than a diagram — which is the habit the whole course is trying to build.</div>`,
  },

  {
    t: '★ dig +trace, and the day it fails on you',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">dig +trace @1.1.1.1 cuongthai.com A</span>
.        IN NS a.root-servers.net. ...            <span class="c"># step 1: the root</span>
;; Received 525 bytes from <span class="g">1.1.1.1</span>#53 in 46 ms
com.     IN NS a.gtld-servers.net. ...            <span class="c"># step 2: referral to .com</span>
;; Received 1173 bytes from <span class="g">i.root-servers.net</span> in 71 ms
cuongthai.com. IN NS kyrie.ns.cloudflare.com.     <span class="c"># step 3: referral to the zone</span>
;; Received 719 bytes from <span class="g">i.gtld-servers.net</span> in 221 ms
cuongthai.com. <span class="g">300 IN A 198.51.100.208</span>            <span class="c"># step 4: the answer</span>

<span class="p">$</span> <span class="k">dig +trace cuongthai.com A</span>   <span class="c"># through the home router instead</span>
;; Received <span class="r">17 bytes</span> from 192.168.1.1#53 in 3 ms   <span class="c"># and it stops here</span>`, 'sm')}
      <div class="box warn">★ Measured both ways. <span class="nw-m">+trace</span> needs to query the root servers <b>directly</b>; many home routers and ISP resolvers refuse that, and the trace dies at step one with no explanation. <b>Add <span class="nw-m">@1.1.1.1</span> before concluding DNS is broken.</b></div>
      <div class="box">★ <b>The TTL is a countdown, not a setting.</b> The zone publishes 300; a plain <span class="nw-m">dig</span> in the same minute showed <b>50</b> — what was left in the cache. A changed record therefore stays wrong for up to one full TTL, and flushing your own cache does not touch the resolver your users are on. Lower the TTL a day before a migration.</div>`,
  },

  {
    t: '14.4 DHCP — the four steps, and why they are broadcast',
    body: `${CSS}
      ${flow('client (no address yet)', 'DHCP server', [
        ['r', 'DISCOVER', 'broadcast — it has no address and knows no server'],
        ['l', 'OFFER', 'here is an address you may have'],
        ['r', 'REQUEST', 'broadcast again — so other servers withdraw their offers'],
        ['l', 'ACK', 'confirmed, plus mask, gateway, DNS and a lease time'],
      ])}
      <div class="box warn">DISCOVER is a <b>broadcast</b>, and Chapter 10 established that broadcasts do not cross a router. So the DHCP server must be on the same subnet — or a router must be configured with <span class="nw-m">ip helper-address</span> to forward the request. <b>"New machines on VLAN 20 get no address" is almost always this.</b></div>`,
  },

  {
    t: '★ A real DHCP lease, read off a working machine',
    body: `${CSS}
      ${term(`<span class="p">$</span> <span class="k">ipconfig getpacket en0</span>      <span class="c"># macOS. Linux: /var/lib/dhcp/*.leases</span>
op = BOOTREPLY
<span class="g">yiaddr = 192.168.1.101</span>                <span class="c"># "your" address — the one being handed out</span>
chaddr = &lt;this machine's MAC&gt;
options:
  dhcp_message_type (uint8): <span class="g">ACK</span>       <span class="c"># step 4 of DORA</span>
  server_identifier (ip): 192.168.1.1
  <span class="g">lease_time (uint32): 0x1c20</span>          <span class="c"># 7200 seconds = 2 hours</span>
  subnet_mask (ip): 255.255.255.0
  router (ip_mult): {192.168.1.1}
  domain_name_server (ip_mult): {192.168.1.1}`, 'sm')}
      <div class="box ok">★ Measured 22/09/2026. <b>DHCP hands out four things, not one:</b> address, mask, default gateway and DNS server. A host with an address but no gateway reaches its own subnet and nothing else — and that is a DHCP fault, not a routing fault.</div>`,
  },

  {
    t: '14.5 File sharing — and what replaced most of it',
    body: `${CSS}
      <table class="t"><thead><tr><th>Protocol</th><th>Ports</th><th>Encrypted</th><th>Use it for</th></tr></thead>
      <tbody>
        <tr><td class="hl">FTP</td><td>21 control + 20 data</td><td><b>no</b> — password in clear</td><td>legacy only</td></tr>
        <tr><td>FTPS</td><td>21 / 990 over TLS</td><td>yes</td><td>when a partner demands FTP</td></tr>
        <tr><td class="hl">SFTP / SCP</td><td><b>22</b> — it is SSH</td><td>yes</td><td>★ the default choice today</td></tr>
        <tr><td class="hl">SMB / CIFS</td><td>445</td><td>signing / SMB3 encryption</td><td>Windows shares, printers</td></tr>
        <tr><td>TFTP</td><td>69 · UDP</td><td>no, and no auth at all</td><td>pushing IOS images to a switch</td></tr>
      </tbody></table>
      <div class="box warn">FTP uses <b>two</b> connections, and in active mode the server opens the data one back to you — which NAT and firewalls block. That is the whole reason passive mode exists, and the reason FTP is painful. <span class="nw-m">sftp</span> rides one SSH connection on port 22 and has none of these problems.</div>`,
  },

  {
    t: '★ The file transfer you already use every deploy',
    body: `${CSS}
      ${code(`rsync -az --delete ./dist/ deployer@vps:/srv/app/      # SSH, port 22
scp report.pdf vps:/tmp/                               # SSH, port 22
sftp vps                                               # SSH, port 22

# and the one that is NOT a file-sharing protocol at all:
curl -X PUT --upload-file img.webp "https://<account>.r2.cloudflarestorage.com/..."
#   object storage over HTTPS on port 443 — it is HTTP, not FTP`, 'bash', 'sm')}
      <div class="box">★ Three of these are SSH wearing different names, which is why opening port 22 is the only firewall change they need. The fourth is worth separating in your head: <b>S3 and R2 are HTTP APIs</b>. They look like file sharing and are governed by web rules — URLs, status codes, and the <span class="nw-m">cache-control</span> header.</div>`,
  },

  {
    t: '14.6 AI tools for explaining concepts — and their limit',
    body: `${CSS}
      <div class="two">
        <div class="box ok"><b>Good use</b><br><span class="note">"Explain what :authority is in HTTP/2."<br>"What does 250-STARTTLS mean in an EHLO reply?"<br>"Give me a checklist for a host that gets an address but no gateway."</span></div>
        <div class="box warn"><b>Bad use</b><br><span class="note">Asking what the DNS records of a domain are, and believing the answer. A model cannot see your network, and it will produce plausible values.</span></div>
      </div>
      <div class="box">Every ★ number in this chapter came from a command, not from a model. The TXT record with two SPF entries is the example that matters: <b>no amount of reasoning would have produced it</b>, because it is a fact about one specific zone on one specific day. The syllabus lists 14.6 as self-learning; treat it as a way to get faster at forming the question you then answer with <span class="nw-m">dig</span>.</div>
      <p class="note">The rule that has held all course: a model proposes, a command decides.</p>`,
  },

  {
    t: 'What you can do now, and what comes next',
    body: `${CSS}
      ${kv([
        ['Explain', 'what the application, presentation and session layers each answer'],
        ['Distinguish', 'a P2P network from a P2P application, and say why a tracker does not break P2P'],
        ['Read', 'an HTTP request and response line by line, and name the layer each line belongs to'],
        ['Use', '★ 401 vs 404 on an unauthenticated GET to tell "needs auth" from "not deployed"'],
        ['Walk', '★ a DNS resolution with dig +trace, and know why it fails through a home router'],
        ['Explain', 'the four DHCP steps, and why a broadcast forces the server onto the same subnet'],
        ['Name', 'the ports: 80/443, 25/587, 110/995, 143/993, 21/20, 22, 445, 53'],
      ])}
      <div class="box ok">Next in the FLM plan: sessions 47–48 are <b>project work</b> on the small-network design, and Chapter 15 (session 49, Cisco Module 16) is <b>network security fundamentals</b> — where the ports you just learned become the surface you have to defend.</div>`,
  },
];
