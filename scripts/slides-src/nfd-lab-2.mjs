/**
 * nfd-lab-2 — Networking for Developers, Lab chương 2 "Con đường đi vào LabFlow" (slug netdev-2-6-lab-duong-vao-labflow).
 * Đề + yêu cầu + thang điểm (không lộ lời giải). Khuôn _nfd-chung.mjs + sơ đồ _nfd-inet.mjs.
 */
import { lamDeck, box, cards, steps, bang, kw } from './_nfd-chung.mjs';
import { inetTopo } from './_nfd-inet.mjs';

export const deck = { key: 'nfd-lab-2', code: 'NFD LAB 2', title: 'Lab 2 — The road into LabFlow', sub: 'Networking for Developers · Chapter 2' };

export const slides = lamDeck({ chuong: 'Chapter 2 — Lab 2' }, [
  { cover: true, t: 'Lab 2 — The road into LabFlow', sub: 'Plan the addresses, map the path, explain what the server sees —<br>then diagnose two incidents you did not cause', nhan: 'Chapter 2 · Lab' },

  { t: 'The situation', to: true, giua: true, body: `
${cards([
    ['The office', 'LabFlow opens a small office and needs an <b>address plan</b> for 10.30.0.0/23.'],
    ['Support', 'Wants a <b>path map</b> from home and from 4G — and what address the server will see.'],
    ['Sales', 'Wants to show a client a build running on a <b>laptop</b>, today.'],
  ])}
${box('On-call', 'Two incidents will be <b>injected into the network</b> while you work. Customers will say “LabFlow is down”. Your report must say why, with evidence.', 'do2')}
<p style="margin:0">Part 2 of the course project · Time: 2–3 hours · Tools: chia.py, traceroute, curl, conntrack, iptables, ip route, vtysh</p>` },

  { t: 'The system: the Internet in a box', giua: true, body: `
${inetTopo({ hl: ['laptop', 'phone', 'mobile', 'homegw', 'isp', 'dc', 'server'], v6: true })}
<p style="margin:0;font-size:20px"><code class="i">docker compose -f moi-truong/internet.yml -p nfi up -d</code> · LabFlow = <code class="i">labflow.test</code> = 203.0.113.10 / 2001:db8:d::10 — it answers with the address it sees.</p>` },

  { t: 'Requirements', to: true, body: `
${steps([
    '<b>R1 Address plan</b> — 10.30.0.0/23 for Wi-Fi 120, servers 50, cameras 25, printers 6, VPN 60; check with chia.py',
    '<b>R2 Path map</b> — laptop (IPv4 + IPv6) and 4G phone: owner and AS of every hop, from the BGP table',
    '<b>R3 What the server sees</b> — 4 devices: own address, seen address, which NAT; one conntrack line explained',
    '<b>R4 Demo for a client</b> — laptop :8080 reachable via the home router’s port 8443; why not on 4G',
    '<b>R5 Incident A</b> — <code class="i">su-co-a.sh</code> on nfi-dc: symptoms, cause with routing tools, fix, proof',
    '<b>R6 Incident B</b> — <code class="i">su-co-b.sh</code> on nfi-rogue: BGP evidence, fix on the ISP, proof, RPKI sentence',
  ])}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Req.', 'Points', 'Full marks when…'], [
    ['R1', '1.5', '5 aligned, non-overlapping subnets with first/last/broadcast = chia.py; remaining addresses stated'],
    ['R2', '1.5', 'three traces; right owner + AS on every hop, justified from show ip bgp'],
    ['R3', '2', '4 rows right; home NAT, carrier NAT, “no NAT on IPv6” named; conntrack original vs reply'],
    ['R4', '1.5', 'working DNAT + curl proof; CGNAT explained; outbound tunnel named; risk mentioned'],
    ['R5', '1.5', 'DNS failure + alternating hops; ip route get on the guilty router; exact line removed'],
    ['R6', '2', 'the /25 from AS64511 shown; longest prefix match; prefix-list fix + proof; RPKI status'],
  ], { fs: 19 })}
<p class="nho" style="margin:0">−1 for any claim without evidence (a command and its output). Report: Markdown, at most two pages.</p>` },

  { t: 'How to work', to: true, giua: true, body: `
${cards([
    ['Plan on paper first', 'R1 by hand, then the tool. If they disagree, find your mistake before moving on.'],
    ['Do not read the incident scripts', 'Inject, observe from the laptop like a customer, then go router by router.'],
    ['One claim, one proof', 'Every sentence points to a pasted command + output. Hints open after 10 / 20 minutes.'],
  ])}
${steps([
    'Start clean: <code class="i">docker compose -f moi-truong/internet.yml -p nfi down</code> then <code class="i">up -d</code>, wait ~15 s for BGP',
    'Incident method: symptoms → path (traceroute) → which router decides wrong (<code class="i">ip route get</code>, <code class="i">show ip bgp</code>) → fix → re-test',
  ])}` },

  { t: 'Going further', to: true, giua: true, body: `
<ul>
<li>Break IPv6 silently on the ISP and measure the <b>Happy Eyeballs</b> penalty for curl and Node</li>
<li>Make an app on the server listen on <code class="i">::</code> and find <code class="i">::ffff:</code> in its logs</li>
<li>Code Lab, lab module: write the VLSM planner, LPM lookup, NAT translator and RPKI validator behind this report</li>
<li>Course project: add the “outside” to your Lab 1 map — home NAT → ISP → IX → DC → nginx → API</li>
</ul>
<p style="margin:0">${kw('address plan', 'kế hoạch địa chỉ')} ${kw('path map', 'bản đồ đường đi')} ${kw('incident', 'sự cố')} ${kw('evidence', 'bằng chứng')}</p>` },
]);
