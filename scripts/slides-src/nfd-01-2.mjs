/**
 * nfd-01-2 — Networking for Developers, bài 1.2 "OSI và TCP/IP: mô hình người ta thật sự dùng" (slug netdev-1-1-osi-tcpip).
 * Output = CHẠY THẬT (lab/out/c11-tang.out.txt). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, sh, two, box, cards, kw, bang, vsd, stack4, svg, T, R, C, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-01-2', code: 'NFD 1.2', title: 'OSI vs TCP/IP: the model that is actually used', sub: 'Networking for Developers · Chapter 1' };
const term = (t, o = {}) => sh(t, o);

/* Mỗi thiết bị đọc tới tầng nào */
const reads = () => {
  const w = 1110, h = 300, cols = [['switch', 2, C.link], ['router', 3, C.ip], ['L4 load balancer', 4, C.tcp], ['nginx (L7 proxy)', 7, C.app], ['your API', 7, C.app]];
  const lay = [['7 HTTP', C.app], ['4 TCP', C.tcp], ['3 IP', C.ip], ['2 Ethernet', C.link]];
  let s = '';
  cols.forEach(([n, upTo, c], i) => {
    const x = 20 + i * 218;
    s += T(x + 95, 22, n, 18, { a: 'middle', w: 800, f: c });
    lay.forEach(([l, lc], j) => {
      const num = Number(l[0]), on = num <= upTo;
      s += R(x, 36 + j * 64, 190, 54, on ? lc + '30' : '#f4f4f4', on ? lc : '#ddd', { rx: 6, sw: on ? 2.5 : 1 });
      s += T(x + 95, 70 + j * 64, l, 19, { a: 'middle', w: on ? 700 : 400, f: on ? lc : '#bbb' });
    });
  });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Chapter 1 — Layers and packets', bai: '1.2' }, [
  { cover: true, t: 'OSI vs TCP/IP:<br>the model that is actually used', sub: 'Layers as a way of thinking, not a list to memorise —<br>proved with curl -v and tshark', nhan: 'Chapter 1 · Lesson 1.2' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why networks are built in <b>layers</b>, and the one rule that makes layers work</li>
<li>The 7 OSI layers next to the 4 TCP/IP layers — and which one real systems implement</li>
<li>What “L2”, “L4”, “L7” mean when engineers say them</li>
<li><b>Where</b> each layer runs in your computer, and which ones your code controls</li>
<li>Seeing the layers in a real request: <code class="i">curl -v</code> and <code class="i">tshark</code></li>
</ul>` },

  { t: 'Why layers: each one solves one problem', to: true, body: `
${cards([
    ['Application', 'What do we say? <b>HTTP</b>: “GET /api/hello”. Your code lives here.'],
    ['Transport', 'Which program, and did it arrive? <b>TCP</b>: ports, order, retransmission.'],
    ['Internet', 'Which machine, by which path? <b>IP</b>: addresses, routers, TTL.'],
    ['Link', 'Which device on this cable or Wi-Fi? <b>Ethernet</b>: MAC addresses, frames.'],
  ], 2)}
${box('The rule that makes it work', 'Each layer only talks to the layer directly above and below it, and only reads <b>its own</b> header. HTTP does not know about MAC addresses; Ethernet does not know what HTTP is. Change Wi-Fi to cable and your code does not change.', 'xanh')}` },

  { t: 'Seven layers on paper, four in real systems', giua: true, body: `
${stack4()}
<p style="margin:0;font-size:20px">OSI (1984) is a <b>vocabulary</b>. TCP/IP is what Linux, Windows, macOS and every router actually run.</p>` },

  { t: 'Engineers still count in OSI numbers', giua: true, body: `
${bang(['They say', 'They mean', 'Example'], [
    ['an <b>L2</b> switch', 'forwards by MAC address', 'the Docker bridge in our lab'],
    ['an <b>L3</b> device', 'forwards by IP address', 'our router container, your Wi-Fi box'],
    ['an <b>L4</b> load balancer', 'splits TCP/UDP connections, cannot read HTTP', 'AWS NLB, HAProxy in TCP mode'],
    ['an <b>L7</b> proxy / firewall', 'reads HTTP: paths, headers, cookies', 'nginx, Cloudflare, AWS ALB'],
    ['“it’s an L1 problem”', 'the cable, the signal, the port light', 'unplugged cable, bad Wi-Fi'],
  ], { fs: 21 })}` },

  { t: 'Each device reads only up to its layer', giua: true, body: `
${reads()}
<p style="margin:0;font-size:20px">A router never looks at your URL; an L4 load balancer cannot route by path. That is why “route /api to another server” needs an <b>L7</b> proxy.</p>` },

  { t: 'Where each layer runs — and who controls it', giua: true, body: `
${bang(['Layer', 'Runs in', 'Your code decides'], [
    ['Application', 'your process (user space)', '<b>everything</b>: protocol, headers, retries, timeouts'],
    ['Transport', 'the kernel', 'TCP or UDP, port, a few socket options (timeouts, keep-alive, NODELAY)'],
    ['Internet', 'the kernel', 'almost nothing — the routing table decides'],
    ['Link', 'driver + network chip', 'nothing'],
  ], { fs: 21 })}` },

  { t: 'curl -v: application and transport, line by line', body: `
${term(ra('c11-tang', 'curl -sv', 1, { drop: /^(\* using|\* Request|\* Connection|> Accept|>\s*$|<\s*$|< Date|< Connection|\{|< Content-Type)/, cut: 112, max: 10 }), { sm: true, title: 'terminal — client (some lines removed)' })}
${two(box('Transport (L4)', '<code class="i">Trying … :80</code>, <code class="i">Established connection … from … port N</code>: a TCP connection between two <b>ports</b>.', 'xanh'),
    box('Application (L7)', 'Lines with <code class="i">&gt;</code> and <code class="i">&lt;</code>: the <b>HTTP</b> text itself — method, path, headers, status.', ''))}` },

  { t: 'The Internet layer decides the path', to: true, giua: true, body: `
${term(ra('c11-tang', 'ip route get', 1))}
<ul>
<li>Asked “how would you send to 10.10.2.10?”, the kernel answers: <b>via the router</b> 10.10.1.254, out of <b>eth0</b>, from my address 10.10.1.10</li>
<li>curl never chose this — the <b>IP layer</b> in the kernel did, from the routing table (Chapter 2)</li>
</ul>` },

  { t: 'tshark shows the layers as nested headers', giua: true, body: `
${term(ra('c11-tang', 'tshark -r /tmp/t.pcap -Y', 1), { sm: true })}
${bang(['Line', 'Layer', 'Says'], [
    ['Ethernet II', 'Link', 'from the client’s card to the <b>router’s</b> card'],
    ['Internet Protocol', 'Internet', 'from 10.10.1.10 to <b>10.10.2.10</b>'],
    ['Transmission Control', 'Transport', 'from the client’s temporary port to port <b>80</b>, 83 bytes of data'],
    ['Hypertext Transfer', 'Application', 'GET /api/hello'],
  ], { fs: 19 })}` },

  { t: 'The model is a tool, not a law', to: true, body: `
${vsd('<ul><li>Memorise “Please Do Not Throw Sausage Pizza Away”</li><li>Argue whether TLS is layer 5 or 6</li></ul>',
    '<ul><li>Ask “which <b>header</b> does this device read?”</li><li>Locate a failure: name → path → connection → TLS → HTTP</li></ul>',
    '✗ Layers as trivia', '✓ Layers as a debugging map')}
${box('Real protocols blur the lines', 'TLS sits between TCP and HTTP and fits no OSI layer cleanly; QUIC (HTTP/3) does transport work in user space over UDP. The model still helps — just do not fight about the numbers.', 'lam')}` },

  { t: 'Layers are also your debugging checklist', giua: true, body: `
${bang(['Symptom', 'Layer to check first', 'Tool'], [
    ['“Could not resolve host”', 'application (DNS)', 'dig'],
    ['timed out, no route', 'internet', 'ip route, ping, mtr'],
    ['“Connection refused”', 'transport', 'ss -tlnp on the server'],
    ['certificate error', 'between transport and HTTP (TLS)', 'openssl s_client'],
    ['404, 500, 502', 'application', 'curl -v, the app’s logs'],
  ], { fs: 21 })}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Layers split one huge problem into four small ones; each reads only its own header</li>
<li>TCP/IP’s <b>four</b> layers are what runs; OSI’s <b>seven</b> give us the words L2, L3, L4, L7</li>
<li>Your process owns the application layer; the <b>kernel</b> runs transport and IP; driver + chip run the link</li>
<li><code class="i">curl -v</code> shows L4 + L7; <code class="i">ip route get</code> shows L3; <code class="i">tshark -V</code> shows them all</li>
<li>Next: how those headers are nested — encapsulation, byte by byte</li>
</ul>
<p style="margin:0">${kw('layer', 'tầng')} ${kw('protocol stack', 'chồng giao thức')} ${kw('L4 / L7', 'tầng giao vận / ứng dụng')}</p>` },
]);
