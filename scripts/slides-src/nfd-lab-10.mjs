/**
 * nfd-lab-10 — Networking for Developers, Lab 10 "Dựng tầng cân bằng tải của LabFlow" (slug netdev-10-5-lab-lb-labflow).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c101..c104-*.out.txt).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-10', code: 'NFD LAB 10', title: 'Building LabFlow’s load-balancing tier', sub: 'Networking for Developers · Chapter 10' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 10 — Load balancing', bai: 'Lab 10' }, [
  { cover: true, t: 'Lab 10 — Building LabFlow’s load-balancing tier', sub: 'Round robin, sticky hashing, health failover,<br>a tunnel, and reading the gateway codes', nhan: 'Chapter 10 · Lab 10 · Course project part 10' },

  { t: 'The situation', giua: true, body: `
${box('', 'LabFlow outgrew one server. You put a load balancer in front of a pool, make it stick per user where needed, survive a backend crash, reach a backend through a tunnel, and read the 502/504 that appear when a backend breaks or stalls — all proven on the wire.', 'lam')}
${steps([
    'Prove round robin, and L7 vs L4 (X-Forwarded-For)',
    'Make a user sticky; survive a killed backend',
    'Tunnel to a backend; reproduce and read 502 and 504',
  ])}` },

  { t: 'The system', giua: true, body: `
${bang(['Piece', 'Address', 'Role'], [
    ['be1 / be2 / be3', '10.10.2.20:3001-3003', 'three identical backends (echo their id)'],
    ['nginx (L7)', '10.10.2.10:8080', 'round robin + passive health + /slow timeout'],
    ['nginx hash', '10.10.2.10:8081', 'consistent hash by ?user='],
    ['socat (L4)', '10.10.2.10:9090', 'raw TCP forward (no HTTP awareness)'],
  ], { fs: 18 })}
${box('', 'Bring it up with <code class="i">bash lab/code/dung-output-ch10.sh</code>. Three backends, an L7 nginx load balancer, an L4 socat forwarder, and a dead-upstream port for the 502.', 'lam')}` },

  { t: 'Requirements', giua: true, body: `
${steps([
    '<b>R1 L4/L7 + round robin</b>: show X-Forwarded-For through L7 but null through L4; show the pool rotating',
    '<b>R2 Algorithm + health</b>: show consistent hash sticking a user; kill a backend and show it removed',
    '<b>R3 Proxy + tunnel</b>: classify reverse/forward proxy; prove a socat tunnel reaches a backend',
    '<b>R4 Gateway codes</b>: reproduce 502 (dead upstream) and 504 (slow backend); map each code to a cause',
  ])}` },

  { t: 'Report template', giua: true, body: `
${steps([
    '<b>R1</b> — forwardedFor L7 vs L4, and the round-robin sequence',
    '<b>R2</b> — alice/bob each sticky to a backend; before/after killing be2',
    '<b>R3</b> — which proxy is which, and the tunnel reaching web:80',
    '<b>R4</b> — the 502 and 504, each mapped to broken / too-slow backend',
  ])}
${box('', 'Paste the proof line for each: a <code class="i">forwardedFor</code>, a backend id sequence, an <code class="i">HTTP 200</code> through the tunnel, a status code — not a description.', 'lam')}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '2.5', 'X-Forwarded-For L7 vs null L4; round robin shown'],
    ['R2', '3', 'consistent hash sticky; a killed backend removed, request still served'],
    ['R3', '2', 'reverse/forward classified; tunnel reaches web:80'],
    ['R4', '2.5', '502 and 504 reproduced and each mapped to a backend cause'],
  ], { fs: 18 })}
${box('', 'Full marks is <b>reading the evidence</b> and naming the cause, not just "it balanced." Half marks for a correct observation with the wrong reason — e.g. seeing the 502 but calling it a network fault instead of a dead/broken backend.', 'lam')}` },

  { t: 'Hints', giua: true, body: `
${steps([
    'R1: <code class="i">curl :8080/</code> (L7) vs <code class="i">:9090/</code> (L4); loop <code class="i">:8080/</code> six times',
    'R2: <code class="i">:8081/?user=alice</code> vs <code class="i">?user=bob</code>; kill a backend on nfd-api and re-loop <code class="i">:8080/</code>',
    'R3: <code class="i">socat TCP-LISTEN:7000,fork TCP:10.10.2.10:80</code> then <code class="i">curl localhost:7000</code>',
    'R4: <code class="i">:8082/</code> for 502; <code class="i">:8080/slow</code> for 504',
  ])}
${box('', 'Read what the backend saw with <code class="i">grep -o forwardedFor</code>; read the balancing by grepping the <code class="i">backend</code> id; read a failure by its <b>status code</b>. Always compare the <b>L7 hop</b> (<code class="i">:8080</code>) with the <b>L4 hop</b> (<code class="i">:9090</code>) — the difference names the layer.', 'lam')}` },

  { t: 'Solution — the four checks', body: `
${term(ra('c101-l4l7', 'curl', 2), { sm: true, title: 'R1 — L7 adds X-Forwarded-For; L4 does not' })}
${term(ra('c102-health-after', 'for i', 1), { sm: true, title: 'R2 — after killing be2: only be1 and be3 serve' })}
${term(ra('c103-tunnel', 'curl', 1), { sm: true, title: 'R3 — the tunnel reaches web:80 (HTTP 200)' })}
${term(ra('c104-codes', 'curl', 2), { sm: true, title: 'R4 — dead upstream 502 ; slow backend 504' })}` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can tell <b>L4 from L7</b> by what the backend sees (X-Forwarded-For or null)</li>
<li>You can make a user <b>sticky</b> and <b>survive a backend crash</b> with a health check</li>
<li>You can classify <b>reverse vs forward</b> proxies and prove a <b>tunnel</b></li>
<li>You can reproduce and <b>read 502 vs 504</b> and name the backend cause</li>
</ul>
<p style="margin:0">${kw('L4 / L7', 'tầng 4 / 7')} ${kw('consistent hash', 'dính theo khoá')} ${kw('health check', 'kiểm sức khoẻ')} ${kw('502 / 504', 'mã cổng')}</p>` },
]);
