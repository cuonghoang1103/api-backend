/**
 * nfd-lab-3 — Networking for Developers, Lab chương 3 "DNS của LabFlow" (slug netdev-3-6-lab-dns-labflow).
 * Đề + yêu cầu + thang điểm (không lộ lời giải). Khuôn _nfd-chung.mjs + sơ đồ _nfd-dns.mjs.
 */
import { lamDeck, box, cards, steps, bang, kw } from './_nfd-chung.mjs';
import { dnsTree } from './_nfd-dns.mjs';

export const deck = { key: 'nfd-lab-3', code: 'NFD LAB 3', title: 'Lab 3 — LabFlow’s DNS', sub: 'Networking for Developers · Chapter 3' };

export const slides = lamDeck({ chuong: 'Chapter 3 — Lab 3' }, [
  { cover: true, t: 'Lab 3 — LabFlow’s DNS', sub: 'Map it, extend it, move a server without hurting users —<br>then diagnose two incidents you did not cause', nhan: 'Chapter 3 · Lab' },

  { t: 'The situation', to: true, giua: true, body: `
${cards([
    ['The launch', 'A public <b>status page</b> next week: new CNAME, a verification TXT, a backup mail server, a CAA contact.'],
    ['The move', 'The <b>API moves</b> to the Singapore edge: nobody may get the old address for more than ~10 s.'],
    ['Your lead', 'Wants a <b>map</b> of who answers for which part of the name, with TTLs and DNSSEC status.'],
  ])}
${box('On-call', 'Two incidents will be <b>injected</b> while you work: “LabFlow is slow, sometimes” and “LabFlow is down”. Your report must explain both, with evidence — and a script that would have caught them.', 'do2')}
<p style="margin:0">Part 3 of the course project · Time: 2–3 hours · Tools: dig, delv, named-checkzone, ky.sh, rndc, unbound-control</p>` },

  { t: 'The system: the DNS lab', giua: true, body: `
${dnsTree({ hl: ['laptop', 'resolver', 'root', 'tld', 'lf', 'cdn'] })}
<p style="margin:0;font-size:20px"><code class="i">docker compose -f internet.yml -f dns.yml -p nfi up -d</code> · zone source: <code class="i">/dnsz/src/labflow.test.zone</code> on nfi-ns · the registrar’s panel = nfi-tld</p>` },

  { t: 'Requirements', to: true, body: `
${steps([
    '<b>R1 Delegation map</b> — www and static: every server, who runs it, referral TTLs, signed or not (dig +trace, delv)',
    '<b>R2 Launch records</b> — status CNAME, TXT, mail2 MX, CAA iodef: checkzone first, serial bumped, both servers agree',
    '<b>R3 Move the API</b> — .10 → .11 with ≤ ~10 s of old answers: plan with times, measure every 5 s, compute the worst case',
    '<b>R4 Incident A</b> — <code class="i">su-co-a.sh</code> on nfi-tld: “slow, sometimes” — find it, fix it at the right place',
    '<b>R5 Incident B</b> — <code class="i">su-co-b.sh</code> on nfi-ns: “down” — diagnose, fix, explain who stays broken and why',
    '<b>R6 Monitoring</b> — a script that catches both incidents (and a forgotten serial)',
  ])}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Req.', 'Points', 'Full marks when…'], [
    ['R1', '1.5', 'root → TLD → LabFlow (→ CDN) with owners and TTLs; secure vs insecure from delv'],
    ['R2', '1.5', 'four records, final dots right; checkzone OK before reload; same new serial on ns1 and ns2'],
    ['R3', '2', 'TTL lowered first; change after the old TTL; switch within ~10 s; worst case computed'],
    ['R4', '2', 'parent vs child NS; dead ns3 shown; fixed at the registrar; resolver memory explained'],
    ['R5', '2', 'SERVFAIL + EDE + +cd; DS ≠ published key; DS updated at parent; cached DS explained'],
    ['R6', '1', 'runnable checker: delegation, answers, serials, NS match, DNSSEC, expiry'],
  ], { fs: 19 })}
<p class="nho" style="margin:0">−1 for any claim without evidence (a command and its output). Report: Markdown, at most two pages.</p>` },

  { t: 'How to work', to: true, giua: true, body: `
${cards([
    ['Check before you load', 'Edit a copy in /tmp, run named-checkzone, read the warnings, bump the serial — then reload.'],
    ['Do not read the incident scripts', 'Inject, look like a customer from the laptop, then server by server.'],
    ['One claim, one proof', 'Every sentence points to a pasted command + output. Hints open after 10 / 20 minutes.'],
  ])}
${steps([
    'Start clean: <code class="i">down -v</code> then <code class="i">up -d</code>, wait ~20 s (new DNSSEC keys every time)',
    'Incident method: getent → which resolver → each resolver → the authoritative servers → <code class="i">+cd</code> → <code class="i">+trace</code> (lesson 3.5)',
  ])}` },

  { t: 'Going further', to: true, giua: true, body: `
<ul>
<li>A <b>correct KSK rollover</b>: new key next to the old, new DS at the parent, wait the DS TTL, then retire the old key</li>
<li>A <b>third name server</b> in another network — why RFC 2182 asks for it</li>
<li>Code Lab, lab module: TTL-plan calculator, negative TTL, delegation checker, DS comparison</li>
<li>Course project: a DNS page for LabFlow — zone, TTL policy, who can change the delegation, checker in cron</li>
</ul>
<p style="margin:0">${kw('delegation', 'ủy quyền')} ${kw('KSK rollover', 'đổi khoá')} ${kw('DS TTL', 'TTL của DS')} ${kw('monitoring', 'giám sát')}</p>` },
]);
