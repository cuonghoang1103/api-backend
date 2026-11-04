/**
 * nfd-lab-4 — Networking for Developers, Lab chương 4 "Mổ xẻ TCP của LabFlow" (slug netdev-4-6-lab-tcp-labflow).
 * Đề + yêu cầu + thang điểm (không lộ lời giải). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, box, cards, steps, bang, topo, kw } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-4', code: 'NFD LAB 4', title: 'Lab 4 — Dissecting LabFlow’s TCP', sub: 'Networking for Developers · Chapter 4' };

export const slides = lamDeck({ chuong: 'Chapter 4 — Lab 4' }, [
  { cover: true, t: 'Lab 4 — Dissecting LabFlow’s TCP', sub: 'Read a connection, measure the handshake tax,<br>and diagnose two production-shaped incidents', nhan: 'Chapter 4 · Lab' },

  { t: 'The situation', to: true, giua: true, body: `
${cards([
    ['The complaint', 'The LabFlow API is “<b>slow and flaky</b>”: a batch job errors with <i>cannot assign requested address</i>, and an RPC call adds a fixed ~40 ms.'],
    ['Your lead', 'Wants a <b>one-page teardown</b>: read one connection end to end, prove the cost of not pooling.'],
    ['On-call', 'Two <b>incidents</b> while you work: a dependency that hangs, and a call that is always 40 ms slow.'],
  ])}
${box('Deliverable', 'A report that reads a capture, measures the handshake tax, reproduces port exhaustion, and diagnoses both incidents — each with the command that found it and the one-line fix. Part 4 of the course project.', 'do2')}
<p style="margin:0">Time: 2–3 hours · Tools: tcpdump, tshark, ss, iperf3, curl -w, nstat</p>` },

  { t: 'The system: the base lab', giua: true, body: `
${topo({ hl: ['client', 'router', 'web', 'api'] })}
<p style="margin:0;font-size:20px"><code class="i">docker compose -f compose.yml -p nfd up -d</code> · add <code class="i">tc netem delay 25ms</code> on the router to see round trips · nginx :80 → api :3000</p>` },

  { t: 'Requirements (1 of 2)', to: true, body: `
${steps([
    '<b>R1 Read one connection</b> — capture a single <code class="i">curl http://10.10.2.10/</code> and label SYN, SYN-ACK, ACK, GET, response, and the four-way FIN teardown',
    '<b>R2 The handshake tax</b> — measure <code class="i">connect</code> and <code class="i">ttfb</code> for new connections vs one keep-alive connection; state the round trips saved',
    '<b>R3 Port exhaustion</b> — reproduce the batch job’s failure by forcing a tiny source-port range; show the exit code and explain TIME_WAIT’s role',
  ])}` },

  { t: 'Requirements (2 of 2)', to: true, body: `
${steps([
    '<b>R4 Incident A — the hang</b> — a dependency’s SYNs are dropped (router DROP to .99). Show how long it hangs with no timeout vs <code class="i">--connect-timeout</code>; give the fix',
    '<b>R5 Incident B — the 40 ms</b> — an RPC splits its request into two small writes. Measure with Nagle on vs <code class="i">TCP_NODELAY</code>; explain the stall',
    '<b>R6 Monitoring</b> — a health script (ss census, TIME-WAIT count, ephemeral range) that would flag R3 before it bites',
  ])}` },

  { t: 'Report template', giua: true, body: `
${box('', `<pre class="mono" style="font-size:19px;line-height:1.5;white-space:pre-wrap">## R1 One connection    — labelled capture (handshake, data, teardown)
## R2 Handshake tax      — connect/ttfb table, round trips saved by keep-alive
## R3 Port exhaustion    — the exit code, TIME_WAIT count, why it recovers
## R4 Incident A          — hang time with/without timeout, the fix
## R5 Incident B          — ms/transaction Nagle on vs NODELAY, the cause
## R6 Monitoring          — the checker and what it prints</pre>`, 'lam')}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '2', 'every packet labelled; the 25 ms gap named as one round trip; FIN teardown identified'],
    ['R2', '1.5', 'connect/ttfb measured both ways; round trips saved stated correctly'],
    ['R3', '1.5', 'exit 45 reproduced; TIME_WAIT on the active closer explained; recovery explained'],
    ['R4', '2', 'hang vs 2 s with a connect timeout; RST-vs-timeout distinction; fix named'],
    ['R5', '2', 'Nagle×delayed-ACK measured (≈57 vs ≈30 ms); TCP_NODELAY or coalescing as fix'],
    ['R6', '1', 'a runnable checker that would flag the exhaustion before it caused errors'],
  ], { fs: 18 })}` },

  { t: 'Hints by level', to: true, giua: true, body: `
${steps([
    'R1: <code class="i">tcpdump -w /tmp/h.pcap tcp</code> while one curl runs, then <code class="i">tcpdump -tt -r</code>; S / S. / . / F.',
    'R3: <code class="i">curl --local-port 50010-50012</code> in a loop of 4 — the 4th cannot bind',
    'R4: compare plain <code class="i">curl</code> vs <code class="i">curl --connect-timeout 2</code> to the black-holed address',
    'R5: <code class="i">node nagle-cli.mjs</code> toggles <code class="i">setNoDelay</code> over the 25 ms link',
    'R6: everything you typed in R3 and R6 can be a line that prints OK / FAIL',
  ])}` },

  { t: 'Going further', to: true, giua: true, body: `
${cards([
    ['Congestion', 'Add <code class="i">netem rate 20mbit delay 80ms</code> and watch <code class="i">cwnd</code> climb in <code class="i">ss -ti</code> through slow start.'],
    ['Loss', 'Add <code class="i">loss 3%</code> and read a fast retransmit + SACK in tshark.'],
    ['Pool it', 'Rewrite the batch job with a keep-alive agent and show the port churn disappear.'],
  ])}
<p style="margin:0">Carry forward: this TCP teardown becomes one hop of the whole-path capstone in Chapter 13.</p>` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can <b>read a TCP connection</b> end to end and name every packet</li>
<li>You can <b>measure the handshake tax</b> and show pooling removes it</li>
<li>You can <b>diagnose</b> port exhaustion, a hanging dependency, and a Nagle stall — each with evidence and a fix</li>
<li>You can write a <b>checker</b> that catches the problem before users do</li>
</ul>
<p style="margin:0">${kw('handshake', 'bắt tay')} ${kw('keep-alive', 'giữ kết nối')} ${kw('port exhaustion', 'cạn cổng')} ${kw('connect timeout', 'hạn kết nối')} ${kw('TCP_NODELAY', 'tắt Nagle')}</p>` },
]);
