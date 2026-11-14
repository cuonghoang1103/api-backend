/**
 * sio-10-5 — Socket.IO · Chapter 10 · Lesson 10.5 "Cluster-specific bugs" (deck video + web, 14/11/2026).
 * Bài web: io-10-5-cluster-bugs. Output THẬT (scratchpad/sio/demo/n10-5.txt · lab ~/.rtq-sio/lab/c10: cum.mjs (fork N worker, có/không Redis adapter sio-redis, /health/socket),
 * nginx/nginx.conf + container sio-nginx-105 (round-robin · hash $cookie_io · ip_hash trước 2 worker w105.mjs), stk.mjs (20 client polling); lab 4.3 c4/cum.mjs (presence 2 worker)):
 * adapter: không gắn ⇒ 1/4 người, health "Adapter" · Redis ⇒ 4/4, "RedisAdapter" · hàm attachRedisAdapter THẬT của kho (test) in WARN "NOT attached — in-memory only" / INFO "attached".
 * sticky: round-robin 4/20 nối · hash $cookie_io 7/20 (cách sửa của bài web HỎNG) · ip_hash 20/20; POST cùng sid ⇒ 400 {"code":1,"message":"Session ID unknown"} xen 200.
 * pres: đóng tab A ở worker 1 khi tab B còn ở worker 2 ⇒ quét cục bộ (như kho) "offline" ✗ · SCARD ✓ · fetchSockets ✓. kho: messaging.socket.ts:613 quét io.sockets.sockets, :182 Set cục bộ; 0 health/socket.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-5:adapter": "$ node cum.mjs khong 4      # cụm 4 worker, adapter KHÔNG gắn · mỗi worker một người trong thread:42\n/health/socket worker 0: {\"workerId\":14171,\"adapter\":\"Adapter\",\"connected\":1}\n/health/socket worker 1: {\"workerId\":14172,\"adapter\":\"Adapter\",\"connected\":1}\n/health/socket worker 2: {\"workerId\":14173,\"adapter\":\"Adapter\",\"connected\":1}\n/health/socket worker 3: {\"workerId\":14174,\"adapter\":\"Adapter\",\"connected\":1}\nadapter KHÔNG gắn (RAM) · 4 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 0 · Nam-2 0 · Nam-3 0 ⇒ 1/4 người\n$ node cum.mjs redis 4      # cùng cụm, Redis adapter (sio-redis)\n/health/socket worker 0: {\"workerId\":14188,\"adapter\":\"RedisAdapter\",\"connected\":1}\n/health/socket worker 1: {\"workerId\":14217,\"adapter\":\"RedisAdapter\",\"connected\":1}\n/health/socket worker 2: {\"workerId\":14218,\"adapter\":\"RedisAdapter\",\"connected\":1}\n/health/socket worker 3: {\"workerId\":14220,\"adapter\":\"RedisAdapter\",\"connected\":1}\nadapter Redis · 4 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 1 · Nam-2 1 · Nam-3 1 ⇒ 4/4 người\n$ npx tsx --test src/socket/redisAdapterGan.test.ts      # hàm attachRedisAdapter THẬT của kho: dòng log nó in ra\n# [2026-11-14T01:17:34.864Z] WARN  Socket.IO Redis adapter NOT attached — in-memory only (single instance) {\"error\":\"Redis chưa sẵn sàng sau 20 ms\"}\n# [2026-11-14T01:17:35.021Z] INFO  Socket.IO Redis adapter attached (cross-worker broadcasts enabled)\n# [2026-11-14T01:17:35.022Z] WARN  Socket.IO Redis adapter NOT attached — in-memory only (single instance) {\"error\":\"down\"}",
 "n10-5:sticky": "$ cat nginx/nginx.conf | grep upstream       # ba cách chia request cho 2 worker\n  upstream rr     { server host.docker.internal:19985; server host.docker.internal:19986; }\n  upstream cookie { hash $cookie_io; server host.docker.internal:19985; server host.docker.internal:19986; }\n  upstream iphash { ip_hash; server host.docker.internal:19985; server host.docker.internal:19986; }\n$ node stk.mjs        # 20 client chỉ polling (như sau proxy chặn WebSocket) qua từng cách chia\nround-robin      ⇒ 20 client polling: 4 connect · 34 lỗi (connect_error / disconnect) trong 4 s\nhash $cookie_io  ⇒ 20 client polling: 7 connect · 28 lỗi (connect_error / disconnect) trong 4 s\nip_hash          ⇒ 20 client polling: 20 connect · 0 lỗi (connect_error / disconnect) trong 4 s\n$ SID=…; for i in 1 2 3 4; do curl -s -X POST -d 6 \"localhost:19987/socket.io/?EIO=4&transport=polling&sid=$SID\"; done     # round-robin, một sid\n{\"code\":1,\"message\":\"Session ID unknown\"} HTTP 400\nok HTTP 200\n{\"code\":1,\"message\":\"Session ID unknown\"} HTTP 400\nok HTTP 200",
 "n10-5:pres": "$ node cum.mjs      # (lab 4.3) user 7: tab A ở worker 1, tab B ở worker 2, Redis adapter · ba cách đếm khi đóng tab A\n— đóng tab A (worker 1), tab B vẫn mở ở worker 2 —\nworker 1 (thật: còn 1 tab) · quét worker này: 0 ⇒ offline ✗ · SCARD: 1 ⇒ online ✓ · fetchSockets: 1 ⇒ online ✓ (3,0 ms)\n— đóng tab B (worker 2), tab cuối —\nworker 2 (thật: còn 0 tab) · quét worker này: 0 ⇒ offline ✓ · SCARD: 0 ⇒ offline ✓ · fetchSockets: 0 ⇒ offline ✓ (2,1 ms)\nRedis còn: SMEMBERS presence:sockets:7 = []",
 "n10-5:kho": "$ sed -n '610,616p' src/socket/messaging.socket.ts      # kho quyết định \"offline\" bằng gì\n    socket.on('disconnect', () => {\n      // Only mark offline if this was the last open socket for the\n      // user (multi-tab case).\n      const socketsForUser = Array.from(io?.sockets.sockets.values() ?? [])\n        .filter((s) => (s.data.user as { id: number } | undefined)?.id === user.id);\n      if (socketsForUser.length === 0) {\n        onlineUserIds.delete(user.id);\n$ grep -n \"const onlineUserIds\" src/socket/messaging.socket.ts ; grep -rn \"health/socket\\|adapter.constructor\" src | grep -v test | wc -l\n182:const onlineUserIds = new Set<number>();\n       0"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, path, meter } from './_sio-chung.mjs';

export const deck = { key: 'sio-10-5', code: 'SIO 10.5', title: 'Cluster-specific bugs', sub: 'Chapter 10 · Lesson 10.5' };
const O = (k) => { const v = DU_LIEU[`n10-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const ADP = O('adapter'), STK = O('sticky'), PRES = O('pres'), KHO = O('kho');
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const nhan = (kieu) => +m(new RegExp(`adapter ${kieu}[^\\n]*⇒ (\\d+)/4 người`), ADP)[1];
const stk = (ten) => +m(new RegExp(`${ten.replace(/\$/g, '\\$')}\\s+⇒ 20 client polling: (\\d+) connect`), STK)[1];
const ADP1 = ADP.split('\n$ npx')[0], ADP2 = '$ npx' + ADP.split('\n$ npx')[1];

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.5', t: 'Cluster-specific bugs', sub: 'Three bugs that need two workers to exist — reproduced on this laptop with real workers, real Redis and a real nginx.',
    en: 'Lesson ten point five: cluster-specific bugs. Three bugs that need two workers to exist, reproduced with real workers, Redis and nginx.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why these bugs are invisible in <code>npm run dev</code></li>
    <li>Bug 1: exactly 1/N of users miss the event — the adapter is not attached</li>
    <li>Bug 2: HTTP 400 “Session ID unknown” — and why the page’s nginx fix fails too</li>
    <li>Bug 3: presence says offline while a tab is still open on another worker</li>
    <li>Three tools: a per-worker health line, PSUBSCRIBE, a cluster on your laptop</li></ul>`,
    en: 'Five takeaways: why dev hides these bugs; one in N users missing events; session ID unknown; presence flicker across workers; and three tools.' },
  { t: 'Why dev never shows them', to: true, body: path([
      { t: 'npm run dev', s: '1 process' }, { t: 'one Map', s: 'every socket is local' }, { t: 'production', s: 'N workers + balancer', on: true }, { t: 'N Maps', s: 'each sees 1/N' }],
      { h: 170, fs: 21, nhan: ['', 'deploy', ''] }) +
      two(box('The common root', `Each worker is a separate process with its own memory. Anything kept in a <b>local</b> structure — rooms without an adapter, a sid, an online Set — is only 1/N of the truth.`, 'info'),
        box('So reproduce with N = 2', `Two processes and a small proxy on your laptop are enough for all three bugs below. The page says so; this lesson does it.`, 'ok')),
    en: 'Why dev never shows them: one process means every socket is local. In production each worker holds only part of the truth. Two workers on your laptop are enough to reproduce all three.' },
  { t: 'Measured bug 1: the adapter is not attached', body: tn(ADP1, { fs: 13, wrap: 120 }) +
      two(meter([['no adapter', nhan('KHÔNG gắn \\(RAM\\)'), '#c0392b'], ['Redis adapter', nhan('Redis'), '#1f8a3b']], { don: '/4 users', nhan: 200, w: 520, rh: 44, fs: 17 }),
        box('The fingerprint', `Worker 0 emits to ${c('thread:42')}; one user per worker. Without an adapter <b>exactly 1/N</b> receive it — the ratio itself is the diagnosis. ${c('adapter.constructor.name')} says ${c('Adapter')} vs ${c('RedisAdapter')}.`, 'bad'), 'r46'),
    en: 'Bug one, measured: four workers, one user each. Without an adapter, exactly one in four receives the event. With the Redis adapter, four in four. The adapter’s class name tells them apart.' },
  { t: 'This repo’s attach logic, run for real', to: true, body: tn(ADP2, { fs: 12, wrap: 150 }) +
      two(box('The two log lines', `The page’s strings are exactly what ${c('attachRedisAdapter')} prints: ${c('INFO … attached (cross-worker broadcasts enabled)')} or ${c('WARN … NOT attached — in-memory only')}. Grep for the WARN on <b>every</b> worker after a deploy.`, 'ok'),
        box('Since 13/11 (82084b1e2)', `If Redis is not ready within <b>5 s</b> at boot, the worker stays on the in-memory adapter for its whole life — no late attach. Correct for one instance; in a cluster that worker becomes an island: bug 1 until it restarts.`, 'info')),
    en: 'The repo’s own attach function, run by its test, prints exactly the page’s two log lines. Since the November fix, a worker that misses Redis at boot stays on the in-memory adapter for life: in a cluster, that is bug one.' },
  { t: 'Measured bug 2: no sticky session — and the page’s fix', body: tn(STK, { fs: 12, wrap: 130 }) +
      two(box('Read it', `Round-robin: ${stk('round-robin')}/20 polling clients connect; a POST with one sid gets ${c('"Session ID unknown"')} HTTP 400 every second time. ip_hash: ${stk('ip_hash')}/20.`, 'bad'),
        box('The page’s fix fails', `${c('hash $cookie_io')}: ${stk('hash $cookie_io')}/20 — the handshake has no cookie yet, an empty key is spread round-robin. Use ${c('ip_hash')}, sid-sticky, or WebSocket-only.`, 'bad')),
    en: 'Bug two, measured: polling clients through round robin mostly fail, with HTTP four hundred session ID unknown. The page’s fix, hash on the io cookie, fails too. IP hash connects all twenty.' },
  { t: 'Measured bug 3: “offline” while a tab is still open', body: tn(PRES, { fs: 14, wrap: 120 }) +
      two(box('Read it', `User 7 has tab A on worker 1, tab B on worker 2. Close A: worker 1 scans <b>its own</b> sockets, finds 0, announces offline — while B is open. Friends see a flicker. ${c('SCARD')} (Redis set) and ${c('fetchSockets()')} (asks every worker, ~3 ms) both say online.`, 'bad'),
        box('Which fix', `${c('fetchSockets()')} self-heals when a worker dies (lesson 4.3); a Redis set needs cleanup after ${c('kill -9')}. Either way: the count must come from <b>shared</b> state.`, 'ok')),
    en: 'Bug three, measured: user seven has a tab on each worker. Closing one makes its worker scan only its own sockets and announce offline while the other tab is still open. A Redis set or fetchSockets both get it right.' },
  { t: 'Measured: where this repo would break first', body: tn(KHO, { fs: 14, wrap: 120 }) +
      two(box('Read it', `Line 613: “last socket of this user?” is answered by scanning ${c('io.sockets.sockets')} — <b>this process only</b>. Line 182: ${c('onlineUserIds')} is a local ${c('Set')}. No per-worker health line exists (0 matches).`, 'info'),
        box('Today vs the day it scales', `With one backend process all three are correct. The day a second worker is added: bug 3 appears at once; bug 1 appears whenever Redis is late at boot; bug 2 for polling users without ${c('ip_hash')}.`, 'bad')),
    en: 'Where this repo would break first: the offline check scans only the local process, and the online set is local. Correct today with one process; the day a second worker is added, bug three appears at once.' },
  { t: 'Three tools for cluster bugs', body: icards([
      ['eye', 'A health line per worker', `${c('{ workerId, adapter: io.of("/").adapter.constructor.name, connected }')} — measured: ${c('"Adapter"')} vs ${c('"RedisAdapter"')}. Note: curl through the balancer cannot pick a worker; expose it per worker or log it at boot.`],
      ['code', 'PSUBSCRIBE', `${c("redis-cli PSUBSCRIBE 'socket.io#*'")} (lesson 10.3): nothing on the channel ⇒ the adapter is not publishing.`],
      ['layers', 'A cluster on your laptop', `Two ${c('node')} processes + a 9-line nginx (or the ${c('cum.mjs')} fork script). All three bugs above reproduced in under a minute.`],
    ], 1),
    en: 'Three tools: a health line per worker with the adapter’s class name, PSUBSCRIBE on the adapter channel, and a two-worker cluster on your laptop.' },
  { t: 'Symptom ⇒ cause ⇒ fix (measured)', body: cmp(['symptom', 'cause', 'measured', 'fix'], [
      ['exactly 1/N of users miss events', 'adapter not attached', '1/4 vs 4/4', 'attach + WARN alert; health line'],
      ['HTTP 400 “Session ID unknown”', 'no sticky for polling', 'round-robin 4/20', 'ip_hash / sid-sticky / WebSocket-only'],
      ['“sticky” config still 400s', 'hash $cookie_io', '7/20', 'not a cookie hash — see above'],
      ['presence flickers offline', 'local socket scan / Set', 'scan 0 vs real 1', 'fetchSockets() or Redis set'],
    ], { hl: [2] }),
    en: 'The measured table: one in N users means no adapter; session ID unknown means no sticky; the cookie hash still fails; presence flicker means local state.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('1/N fingerprint', 'adapter missing on a worker'), kw('RedisAdapter', 'vs Adapter (in-memory)'), kw('Session ID unknown', 'HTTP 400, other worker'),
      kw('ip_hash', 'sticky by client address'), kw('hash $cookie_io', 'empty key on handshake'), kw('Local scan', 'one process’s sockets'),
      kw('fetchSockets()', 'asks every worker'), kw('Cluster on a laptop', '2 processes + a proxy'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the one in N fingerprint; RedisAdapter; session ID unknown; ip hash; hash on the io cookie; the local scan; fetchSockets; and a cluster on a laptop.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run 4 workers without an adapter; count who receives',
      'Put round-robin, cookie-hash and ip_hash nginx in front of 2 workers; count polling connects',
      'Open one tab per worker; close one; read what your presence says',
      'Add a per-worker health line; break Redis at boot; read it',
    ]), box('Keep these', `<ul><li>1/N of users ⇒ the adapter</li><li>“Session ID unknown” ⇒ sticky for polling</li><li>hash $cookie_io is not sticky</li><li>Shared state for presence</li><li>Test with N = 2 before production</li></ul>`, 'info'), ''),
    en: 'Your turn: four workers without an adapter, three balancers, one tab per worker, and a health line.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Diagnosis cookbook', bai: '10.5' }, S);
