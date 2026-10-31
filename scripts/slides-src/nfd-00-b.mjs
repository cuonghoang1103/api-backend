/**
 * nfd-00-b — Networking for Developers, Mục 0 "Bắt đầu tại đây (2/2)": sự cố thật có nguồn + tình huống minh hoạ của
 * sinh viên + cách học không nản. Khuôn _nfd-chung.mjs. Mỗi mốc giờ đã kiểm với bài viết gốc (link trong bài đọc).
 */
import { lamDeck, two, box, cards, steps, kw, tbl, bang, svg, T, R, C } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-00-b', code: 'NFD 0.B', title: 'Real outages, and how to learn this without giving up', sub: 'Networking for Developers · Section 0' };

/* Bảng "sự cố → tầng hỏng": mỗi sự cố một dòng, tô ô tầng gây ra nó */
const layerMap = () => {
  const L = ['Routing (BGP)', 'DNS', 'TLS / certs', 'App & proxy'];
  const rows = [
    ['Facebook 2021', 0, 1], ['Dyn 2016', 1], ['YouTube 2008', 0], ['Let’s Encrypt root 2021', 2], ['Slack 2021', 1], ['AWS us-east-1 2025', 1], ['cuongthai.com 2026', 3],
  ];
  const w = 1110, h = 330, x0 = 300, cw = (w - x0) / L.length, rh = 40;
  let s = '';
  L.forEach((l, j) => { s += T(x0 + j * cw + cw / 2, 26, l, 18, { a: 'middle', w: 800, f: C.br }); });
  rows.forEach(([n, ...hit], i) => {
    const y = 40 + i * rh;
    s += T(10, y + 27, n, 18, { w: 700 });
    L.forEach((_, j) => {
      const on = hit.includes(j);
      s += R(x0 + j * cw + 6, y + 4, cw - 12, rh - 8, on ? C.red + '30' : '#f5f5f5', on ? C.red : '#ddd', { rx: 6, sw: on ? 2.5 : 1 });
      if (on) s += T(x0 + j * cw + cw / 2, y + 27, '● broke here', 16, { a: 'middle', w: 700, f: C.red });
    });
  });
  return svg(w, h, s);
};

export const slides = lamDeck({ chuong: 'Section 0 — Start here', bai: '0.B' }, [
  { cover: true, t: 'Real outages, and how to<br>learn this without giving up', sub: 'Seven incidents with sources · three student stories<br>· a study plan you can keep', nhan: 'Section 0 · Start here (2/2)' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Seven <b>real</b> outages — big companies and this very website — and which layer broke</li>
<li>Three <b>illustrative</b> student stories (clearly marked) of the bugs you are most likely to meet</li>
<li>Why so many “network problems” are really <b>DNS</b>, <b>routing</b> or <b>certificates</b></li>
<li>A study plan: a minimum path, a full path, and the rhythm of one study session</li>
<li>How to read a network error message, and how to ask for help well</li>
</ul>` },

  { t: 'Facebook, 4 Oct 2021: the company deleted itself from the Internet', body: `
${two(`<ul>
<li>A maintenance command meant to <b>measure backbone capacity</b> disconnected Facebook’s backbone; an audit tool had a bug and did not stop it</li>
<li>Their DNS servers, cut off from the data centres, did what they were designed to do: <b>stop announcing their routes (BGP)</b></li>
<li>Result: the rest of the Internet could no longer even <b>find</b> facebook.com — DNS servers alive but unreachable</li>
<li>Engineers had to go on site; internal tools also depended on the same DNS</li>
</ul>`, box('Timeline seen from outside (Cloudflare)', '≈15:40 UTC routes start disappearing · 15:58 DNS prefixes gone · ≈21:28 reconnected. <b>About 6 hours</b> down; resolvers worldwide saw <b>30×</b> more queries as apps retried.', 'do2'))}` },

  { t: 'Dyn 2016 and YouTube 2008: one name service, one wrong route', body: `
${two(box('Dyn — 21 Oct 2016 (DNS)', 'A botnet of hacked cameras and home routers (<b>Mirai</b>) flooded Dyn, a DNS provider, in <b>three waves</b> (11:10–13:20, 15:50–17:00, 20:00–22:10 UTC). Twitter, GitHub, Netflix, Reddit, PayPal… were fine, but people could not <b>look up their names</b>.', 'do2'),
    box('YouTube — 24 Feb 2008 (routing)', 'Pakistan Telecom announced a route for YouTube’s addresses to block it at home; its upstream passed the route to the world. From 18:47 UTC much of the Internet sent YouTube traffic to Pakistan. YouTube answered with <b>more specific</b> routes at 20:18; the bad route was withdrawn at 21:01.', 'do2'))}
${box('Lesson', 'A site can be perfectly healthy and still unreachable: the <b>name</b> or the <b>path</b> to it is broken. Chapter 2 (routing, BGP) and Chapter 3 (DNS) teach you to tell which.', 'lam')}` },

  { t: 'Certificates and DNS changes: Let’s Encrypt, Slack, AWS', giua: true, body: `
${bang(['When', 'What happened', 'Why it matters to you'], [
    ['30 Sep 2021', '<b>Let’s Encrypt</b>’s old root certificate (DST Root CA X3) expired. Old devices and old OpenSSL 1.0.x clients began rejecting valid sites.', 'Your server’s certificate is a <b>chain</b>; the client decides what it trusts (Ch.7).'],
    ['30 Sep 2021', '<b>Slack</b> enabled DNSSEC; some resolvers cached a broken answer. About 24 hours of failures for &lt;1% of users; rolling back made it worse.', 'DNS answers are <b>cached</b> — you cannot instantly undo a DNS change (Ch.3).'],
    ['19–20 Oct 2025', '<b>AWS us-east-1</b>: a race condition left the DynamoDB endpoint with an <b>empty DNS record</b> (23:48–02:40 PDT); dozens of services that depend on it failed.', 'One DNS record can take down a whole platform.'],
  ])}` },

  { t: 'This very website, 18 Aug 2026: 502 for seven minutes', to: true, giua: true, body: `
${two(`<ul>
<li>A new backend image built on the wrong base: the database engine library did not match the system C library</li>
<li>Build ✓ · push ✓ · swap ✓ — then the API container <b>restarted in a loop</b></li>
<li>nginx kept answering, but every request to the API got <b>502 Bad Gateway</b> for 7 minutes</li>
</ul>`, box('What the network told us', '<b>502</b> = the proxy is alive but the thing <b>behind</b> it did not answer properly. Reading the status code correctly pointed straight at the API container — not at DNS, not at TLS. Chapter 10 teaches exactly this reading.', 'xanh'))}` },

  { t: 'Most “network problems” are one of four things', giua: true, body: `
${layerMap()}
<p style="margin:0;font-size:20px">Notice what is <b>missing</b>: cables and Wi-Fi. For a developer, outages almost always live in routing, DNS, certificates or the app/proxy layer.</p>` },

  { t: 'Three student stories (illustrative, not real people)', body: `
${cards([
    ['Demo day: “it works on my laptop”', 'The API listens on <b>127.0.0.1:3000</b>. On the projector laptop the front end calls the student’s IP — connection refused. Fix: listen on 0.0.0.0, open the port. <i>Lesson 1.5.</i>'],
    ['The IP that moved', 'The mobile app hard-codes <b>192.168.1.23</b>. Next morning the router hands the laptop a new address; nothing works. Fix: a name or a fixed address. <i>Chapters 2–3.</i>'],
    ['School Wi-Fi blocks it', 'SSH to the cloud server times out from the lab but works at home: the network blocks <b>port 22</b>. Fix: understand ports, test with nc, use another port or a tunnel. <i>Chapters 1, 10.</i>'],
  ])}
${box('Why these three', 'They are composites of the most common bugs in student projects. Each one takes two minutes to diagnose once you know the layer — and an afternoon if you do not.', 'lam')}` },

  { t: 'Why beginners give up on networking', to: true, giua: true, body: `
<ul>
<li><b>Acronym avalanche</b> — OSI, TCP, MSS, MTU, ARP… on page one. We introduce each word <b>when you need it</b>, with a Vietnamese meaning.</li>
<li><b>Invisible things</b> — packets cannot be seen. We <b>capture</b> them and use simulations you can step through.</li>
<li><b>Memorising instead of measuring</b> — every claim in this course comes with a command you can run.</li>
<li><b>Scary errors</b> — “connection refused”, “timed out”, “certificate” look alike. Each means one specific layer failed.</li>
</ul>` },

  { t: 'Two paths through the course', body: `
${two(box('Minimum path · ≈3 weeks', '<b>Section 0 → Ch.1 → Ch.2 (IP, NAT) → Ch.3 (DNS) → Ch.4 (TCP basics) → Ch.7 (TLS) → Ch.10 (proxies, 502/504) → Ch.11</b>. Enough to deploy and debug a student project with confidence.', 'xanh'),
    box('Full path · ≈8–10 weeks', 'Every chapter in order, all labs, the capstone. About 1 hour a day, 5 days a week. You come out able to tune a production request path and to handle the networking round of an interview.', 'lam'))}
${steps([
    'Watch the slides of one lesson (10–15 min)',
    'Read the written lesson and <b>type every command yourself</b> in the lab (20–30 min)',
    'Do 🧪 Practice, then the lesson’s Code Lab exercise (15–20 min)',
    'End of chapter: quiz + chapter lab',
  ])}` },

  { t: 'Read the error before you search it', giua: true, body: `
${bang(['You see', 'It means', 'Look at'], [
    ['<code>Could not resolve host</code>', 'DNS: the name did not become an address', 'Ch.3 · dig'],
    ['<code>Connection refused</code>', 'reached the machine; nothing listens on that port', 'Ch.1 · ss -tlnp'],
    ['<code>Connection timed out</code>', 'no answer at all: firewall, route, machine down', 'Ch.2, 11 · ping, mtr'],
    ['<code>certificate has expired</code>', 'TLS: the chain or its dates are wrong', 'Ch.7 · openssl s_client'],
    ['<code>502 / 504</code>', 'HTTP: the proxy is fine, the app behind it is not', 'Ch.10 · proxy logs'],
  ])}` },

  { t: 'When you are stuck: ask so people can help', to: true, body: `
${two(`<ul>
<li>Say what you ran, <b>exactly</b>: the command and its full output</li>
<li>Say what you expected and what happened instead</li>
<li>Say what you already checked: “ping works, curl says refused”</li>
<li>Never paste passwords, tokens or private keys</li>
</ul>`, box('English is a tool here, not a test', 'Every 🗂 box gives the English term with its Vietnamese meaning. Error messages are short and repeat a lot — after a week you will recognise them at a glance.', 'xanh'))}
<p style="margin:0">${kw('refused', 'bị từ chối')} ${kw('timed out', 'hết giờ chờ')} ${kw('resolve', 'phân giải tên')} ${kw('unreachable', 'không tới được')}</p>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Big outages are usually <b>routing, DNS or certificates</b> — rarely the cable</li>
<li>A healthy server can be unreachable because its <b>name</b> or <b>path</b> is broken</li>
<li>An error message names the layer that failed — read it before you search it</li>
<li>Pick a path (minimum or full) and keep the rhythm: slides → type → practice → Code Lab</li>
<li>Next: build your lab (0.1), then follow one URL through it (0.2)</li>
</ul>` },
]);
