/**
 * nfd-12-3 — Networking for Developers, bài 12.3 "Chứng chỉ nên biết" (slug netdev-12-3-chung-chi). Khái niệm, không có lab output.
 */
import { lamDeck, sh, box, kw, bang, steps } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-12-3', code: 'NFD 12.3', title: 'Certifications worth knowing', sub: 'Networking for Developers · Chapter 12' };

export const slides = lamDeck({ chuong: 'Chapter 12 — Interviews', bai: '12.3' }, [
  { cover: true, t: 'Certifications worth knowing', sub: 'Network+, CCNA and beyond —<br>when a developer needs one, and when not', nhan: 'Chapter 12 · Lesson 12.3' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>The two certs you will hear named: <b>CompTIA Network+</b> and <b>Cisco CCNA</b></li>
<li>What each covers, and who it is really for</li>
<li><b>When a developer needs a networking cert</b> — and the far more common case of "not"</li>
<li>What certs <b>don’t</b> teach that this course did (measuring real systems)</li>
<li>A pragmatic stance for the interview: skills first, a cert only when it opens a door</li>
</ul>` },

  { t: 'The landscape', giua: true, body: `
${bang(['Cert', 'Scope', 'Really for'], [
    ['<b>CompTIA Network+</b>', 'vendor-neutral fundamentals (OSI, IP, routing, cabling, basic security)', 'IT/helpdesk/NOC entry, a broad baseline'],
    ['<b>Cisco CCNA</b>', 'deeper routing/switching, heavily Cisco IOS', 'network engineers, infra/ops roles'],
    ['<b>Cloud networking</b>', 'AWS/GCP/Azure VPCs, LBs, security groups', 'cloud/DevOps engineers'],
  ], { fs: 18 })}
${box('', 'These are <b>network-engineer</b> credentials. They prove breadth of config knowledge (routers, switches, VLANs) — useful, but a different job from building and debugging the <b>applications</b> that run on the network.', 'lam')}` },

  { t: 'CompTIA Network+', giua: true, body: `
${box('', 'Vendor-neutral, entry-level. Covers the OSI model, IP addressing and subnetting, routing/switching concepts, cabling and wireless, and basic network security — the vocabulary of the field, not deep configuration.', 'lam')}
${steps([
    'Good if: you are entering IT/NOC/helpdesk and want a recognised baseline',
    'Good for a <b>developer</b> mostly as a vocabulary check — you already met most of it here, measured',
    'Not a differentiator for software roles; employers rarely require it of developers',
  ])}` },

  { t: 'Cisco CCNA', giua: true, body: `
${box('', 'Deeper and more hands-on: routing and switching, VLANs, OSPF, access lists, and a lot of Cisco IOS specifics. The standard credential for someone whose <b>job is the network itself</b>.', 'lam')}
${steps([
    'Good if: you want a network-engineer / infrastructure / NetDevOps path',
    'Overkill for most application developers — you will rarely configure a router',
    'Its <b>concepts</b> (subnets, routing, VLANs) are worth knowing; the IOS syntax is not, unless it is your job',
  ])}` },

  { t: 'When a developer actually needs one', giua: true, body: `
${bang(['Reach for a cert when…', 'Skip it when…'], [
    ['moving toward DevOps/SRE/infra as a role', 'you build and debug application code'],
    ['an employer/contract explicitly requires it', 'you already diagnose with dig/curl/tcpdump'],
    ['you want a structured, examined baseline', 'you can show real measurements and incidents'],
  ], { fs: 19 })}
${box('', 'For most developers the honest answer is: a cert is <b>not</b> required. What interviews reward is the ability to <b>reason about and measure</b> a real request path — which a cert exam rarely tests, and which this course did directly.', 'do2')}` },

  { t: 'What certs don’t teach', giua: true, body: `
${steps([
    'Reading a <b>real capture</b> and telling the network apart from the app',
    'Measuring a request with <code class="i">curl -w</code>, <code class="i">mtr</code>, <code class="i">iperf3</code> and acting on the numbers',
    'Diagnosing <b>production</b> symptoms (502/504/524, stale cache, a dropped WebSocket) under the layered method',
    'The <b>application</b> side: HTTP semantics, caching headers, CDNs, real-time, load balancers in practice',
  ])}
${box('', 'A cert proves you studied the map; this course proves you can <b>drive the territory</b>. In an interview, the second is what the stories are made of.', 'xanh')}` },

  { t: 'A pragmatic stance', giua: true, body: `
${steps([
    '<b>Skills first</b>: be able to explain and measure the request path — that is portable and interview-proof',
    '<b>Cert only to open a specific door</b>: a role, a contract, a visa/procurement box that names it',
    '<b>Keep the concepts</b> from Network+/CCNA (subnets, routing, VLANs); drop the vendor syntax unless it is the job',
  ])}
${box('', 'Answer the "do I need a cert?" interview question honestly and with judgement: "For this (software) role, no — I diagnose with <code class="i">dig</code>/<code class="i">curl</code>/<code class="i">tcpdump</code>; I’d get a CCNA if I moved into network engineering." That judgement itself reads as senior.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>CompTIA Network+</b> = vendor-neutral fundamentals; <b>CCNA</b> = deeper, Cisco-flavoured routing/switching</li>
<li>Both are <b>network-engineer</b> credentials — a different job from building applications on the network</li>
<li>A developer needs one mainly to <b>move into infra/DevOps</b> or when an employer requires it</li>
<li>Certs don’t teach what interviews reward: <b>measuring and diagnosing a real request path</b></li>
<li>Stance: <b>skills first</b>, a cert only to open a specific door; keep the concepts, drop the vendor syntax</li>
</ul>
<p style="margin:0">${kw('Network+', 'nền tảng trung lập')} ${kw('CCNA', 'Cisco, sâu hơn')} ${kw('skills first', 'kỹ năng trước')} ${kw('cloud networking', 'mạng đám mây')}</p>` },
]);
